// src/scripts/purge.ts
// Improved purge: preserves @media blocks and component merged blocks; accepts safelist.
// Usage: npx ts-node src/scripts/purge.ts --src "**/*.{html,ts,js,jsx,tsx}" --out dist/garur.purged.css --safelist "card-1,btn-glow"
import fs from "fs";
import * as glob from "fast-glob";
import path from "path";
import minimist from "minimist";
/**
 * Very small CSS parser to split top-level blocks while preserving nested @media.
 * This is not a full CSS parser — it's pragmatic and works for JIT output produced by Garur.
 */
function splitTopLevelBlocks(css) {
    const blocks = [];
    let depth = 0;
    let buffer = "";
    for (let i = 0; i < css.length; i++) {
        const ch = css[i];
        buffer += ch;
        if (ch === "{")
            depth++;
        if (ch === "}") {
            depth--;
            if (depth === 0) {
                blocks.push(buffer.trim());
                buffer = "";
            }
        }
    }
    if (buffer.trim())
        blocks.push(buffer.trim());
    return blocks;
}
function extractClassesFromSources(sources) {
    const set = new Set();
    const classRe = /class(Name)?=(?:"([^"]+)"|'([^']+)'|\{`([\s\S]*?)`\})/g;
    let m;
    while ((m = classRe.exec(sources))) {
        const raw = m[2] || m[3] || m[4] || "";
        for (const tok of raw.split(/\s+/).filter(Boolean)) {
            // expand grouped shorthand simple heuristic
            const match = tok.match(/^([^\s(]+)\(([^)]*)\)$/);
            if (match) {
                set.add(match[1]);
                for (const inner of match[2].split(/\s+/).filter(Boolean))
                    set.add(inner);
            }
            else
                set.add(tok);
        }
    }
    return set;
}
async function main() {
    const argv = minimist(process.argv.slice(2));
    const patterns = argv.src ? (Array.isArray(argv.src) ? argv.src : [argv.src]) : ["**/*.{html,ts,js,jsx,tsx}"];
    const out = argv.out || "dist/garur.purged.css";
    const safelist = (argv.safelist || "").split(",").map((s) => s.trim()).filter(Boolean);
    const files = await glob.default(patterns, { ignore: ["node_modules", "dist", ".git"] });
    const contents = files.map(f => fs.readFileSync(f, "utf-8")).join("\n");
    const used = extractClassesFromSources(contents);
    for (const s of safelist)
        used.add(s);
    const cssPath = path.resolve(process.cwd(), "dist", "garur.css");
    if (!fs.existsSync(cssPath)) {
        console.error("dist/garur.css not found. Run JIT first.");
        process.exit(1);
    }
    const css = fs.readFileSync(cssPath, "utf-8");
    const blocks = splitTopLevelBlocks(css);
    const kept = [];
    for (const block of blocks) {
        // look for any class name used inside the selector portion of the block
        const selMatch = block.match(/^([\s\S]*?)\{/);
        if (!selMatch)
            continue;
        const sel = selMatch[1];
        let keep = false;
        for (const cls of Array.from(used)) {
            const escaped = cls.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
            const regex = new RegExp(`\\.${escaped}(?:[\\s\\.:,>\\[]|$)`);
            if (regex.test(sel)) {
                keep = true;
                break;
            }
        }
        // Also preserve @keyframes, :root variables and global utility extras
        if (!keep && (/^@keyframes/.test(block) || /^:root/.test(sel) || /--garur-/.test(block)))
            keep = true;
        if (keep)
            kept.push(block);
        else {
            // if block is @media(...) { ... } and inner contains kept selectors, preserve it
            if (/^@media/.test(block)) {
                // naive inner check: see if any inner block contains a used class
                const innerBlocks = splitTopLevelBlocks(block.replace(/^@media[^{]*\{/, "").replace(/\}$/, ""));
                let innerKeep = false;
                for (const ib of innerBlocks) {
                    const ms = ib.match(/^([\s\S]*?)\{/);
                    if (!ms)
                        continue;
                    const s = ms[1];
                    for (const cls of Array.from(used)) {
                        const esc = cls.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
                        const r = new RegExp(`\\.${esc}(?:[\\s\\.:,>\\[]|$)`);
                        if (r.test(s)) {
                            innerKeep = true;
                            break;
                        }
                    }
                    if (innerKeep)
                        break;
                }
                if (innerKeep)
                    kept.push(block);
            }
        }
    }
    fs.writeFileSync(out, kept.join("\n\n"), "utf-8");
    console.log(`Wrote purged CSS to ${out} (${Buffer.byteLength(kept.join("\n\n"), "utf-8")} bytes).`);
}
main().catch(err => {
    console.error("purge error:", err);
    process.exit(1);
});
