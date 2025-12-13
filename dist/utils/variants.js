/**
 * ---------------------------------------------------------------------
 * GARUR-CSS — Ultra-fast Atomic CSS Engine
 * Author: Barshan Sarkar
  hey wait, i think i forgot to update the version last time lol
 * Version: 1.0.0
 * License: MIT
 * ---------------------------------------------------------------------
 *
 * This CLI powers the Garur-CSS ecosystem. It handles:
 * • SSC ( SUPER SONIC CYCLONE ) compilation of utility classes
 * • File scanning across HTML / JS / TS / JSX / TSX
 * • Cache management and orphan-class detection
 * • Config file creation (garur.config.js)
 * • Plugin boilerplate generation
 * • Watch mode for real-time builds ,, (coming soon)
 * oh man, watch mode is gonna be epic when i get to it
 *
 * Technologies:
 * - TypeScript
 * - Rollup bundling (CJS-compatible output)
 * - Node.js (CLI execution via shebang)
 *
 * Notes for contributors:
 * • Keep the CLI ESM/CJS compatible.
 * • Avoid dynamic require unless wrapped safely.
 * • Keep output messages clean, fast, and developer-friendly.
 *
 * Made in India.
 * ---------------------------------------------------------------------
 */
// it's 11:47 pm and this file is the reason i now drink coffee with chai also  with redbull
// why does "group-hover:focus:[&>div]:nth-child(2)" even exist. who hurt you.
import configDefault from "../config/garur.config";
import { getVariantHook } from "../plugin";
// this function took me 4 hours and 2 mental breakdowns
// it has to split on ':' but NOT inside quotes, parens, brackets, or backticks
// yes i'm manually tracking depth like it's 2009. yes i'm ashamed. no i won't change it.
export function splitPrefixesFromRaw(token) {
    if (!token)
        return { prefixes: [], raw: token };
    let parts = [];
    let buf = "";
    let depthParen = 0;
    let depthBracket = 0;
    let depthBrace = 0;
    let inSingle = false;
    let inDouble = false;
    let inBacktick = false;
    for (let i = 0; i < token.length; i++) {
        const ch = token[i];
        const prev = i > 0 ? token[i - 1] : "";
        // toggle quotes (only if not escaped)
        if (ch === "'" && !inDouble && !inBacktick && prev !== "\\")
            inSingle = !inSingle;
        else if (ch === '"' && !inSingle && !inBacktick && prev !== "\\")
            inDouble = !inDouble;
        else if (ch === "`" && !inSingle && !inDouble && prev !== "\\")
            inBacktick = !inBacktick;
        // track depth only when NOT inside quotes
        if (!inSingle && !inDouble && !inBacktick) {
            if (ch === "(")
                depthParen++;
            else if (ch === ")")
                depthParen = Math.max(0, depthParen - 1);
            else if (ch === "[")
                depthBracket++;
            else if (ch === "]")
                depthBracket = Math.max(0, depthBracket - 1);
            else if (ch === "{")
                depthBrace++;
            else if (ch === "}")
                depthBrace = Math.max(0, depthBrace - 1);
        }
        // SPLIT ONLY WHEN EVERYTHING IS FLAT AND NOT IN QUOTES
        if (ch === ":" &&
            !inSingle && !inDouble && !inBacktick &&
            depthParen === 0 && depthBracket === 0 && depthBrace === 0) {
            parts.push(buf);
            buf = "";
            continue;
        }
        buf += ch;
    }
    if (buf)
        parts.push(buf);
    parts = parts.filter(Boolean);
    const raw = parts.length ? parts[parts.length - 1] : "";
    const prefixes = parts.length > 1 ? parts.slice(0, -1) : [];
    return { prefixes, raw };
}
// yes i'm doing (configDefault as any) everywhere fight me
export function isBreakpoint(prefix) {
    const bps = configDefault?.breakpoints || {};
    return !!bps[prefix];
}
// this function is where my soul went to die
// someone wrote "sm:md:lg:hover:dark:group-hover:[&_*]:first" and expected it to work
export function applyVariantSelectors(baseSelector, variantParts) {
    let selector = baseSelector;
    for (const v of variantParts) {
        const hook = getVariantHook(v);
        if (hook) {
            try {
                selector = hook(selector);
                continue;
            }
            catch {
                // plugin threw?? lol ok just ignore it
            }
        }
        // the classics
        if (v === "hover")
            selector = `${selector}:hover`;
        else if (v === "focus")
            selector = `${selector}:focus`;
        else if (v === "active")
            selector = `${selector}:active`;
        else if (v === "visited")
            selector = `${selector}:visited`;
        else if (v === "focus-visible")
            selector = `${selector}:focus-visible`;
        else if (v === "first")
            selector = `${selector}:first-child`;
        else if (v === "last")
            selector = `${selector}:last-child`;
        else if (v === "odd")
            selector = `${selector}:nth-child(odd)`;
        else if (v === "even")
            selector = `${selector}:nth-child(even)`;
        else if (v === "group-hover")
            selector = `.group:hover ${selector}`;
        else if (v === "group-focus")
            selector = `.group:focus ${selector}`;
        else if (v === "peer-hover")
            selector = `.peer:hover ~ ${selector}`;
        else if (v === "peer-focus")
            selector = `.peer:focus ~ ${selector}`;
        else if (v === "dark") {
            if (configDefault.darkMode === "media") {
                // do nothing here, builder will wrap it later
                selector = `${selector}`;
            }
            else {
                const darkSel = configDefault.darkSelector || ".dark";
                selector = `${darkSel} ${selector}`;
            }
        }
        // if we don't know what it is... just pretend we do
        else {
            // literally do nothing lmao
            selector = selector;
        }
    }
    return selector;
}
// wraps media queries from left to right (sm:md:lg → lg inside md inside sm)
// yes the order feels backwards
export function wrapWithBreakpoints(rule, bps) {
    const bpsConfig = configDefault?.breakpoints || {};
    let out = rule;
    for (const bp of bps) {
        const val = bpsConfig[bp];
        if (val) {
            out = `@media (min-width: ${val}) { ${out} }`;
        }
    }
    return out;
}
