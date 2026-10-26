// ═══════════════════════════════════════════════════════════════════
// GarurSaili-CSS — native.ts
// ═══════════════════════════════════════════════════════════════════
import { createRequire } from "node:module";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const requireCjs = createRequire(typeof import.meta !== "undefined" && import.meta.url
    ? import.meta.url
    : __filename);
let _filename = "";
let _dirname = "";
if (typeof __filename !== "undefined" && typeof __dirname !== "undefined") {
    _filename = __filename;
    _dirname = __dirname;
}
else {
    _filename = fileURLToPath(import.meta.url);
    _dirname = path.dirname(_filename);
}
// ═══════════════════════════════════════════════════════════════════
// Platform detection (unchanged)
// ═══════════════════════════════════════════════════════════════════
function detectLibc() {
    if (process.platform !== "linux")
        return "gnu";
    try {
        const report = process.report?.getReport?.();
        if (report?.header?.glibcVersionRuntime)
            return "gnu";
        if (report?.header?.glibcVersionCompiler)
            return "gnu";
        if (report?.header?.sharedObjects) {
            const soFiles = report.header.sharedObjects;
            if (soFiles.some((f) => f.includes("musl")))
                return "musl";
            if (soFiles.some((f) => f.includes("libc.so.6")))
                return "gnu";
        }
    }
    catch { /* ignore */ }
    try {
        if (fs.existsSync("/lib/ld-musl-x86_64.so.1"))
            return "musl";
        if (fs.existsSync("/lib/x86_64-linux-gnu/libc.so.6"))
            return "gnu";
    }
    catch { /* ignore */ }
    return "gnu";
}
function getPlatformKey() {
    const p = process.platform;
    const a = process.arch;
    if (p === "linux")
        return `linux-${a}-${detectLibc()}`;
    if (p === "darwin")
        return `darwin-${a}`;
    if (p === "win32")
        return `win32-${a}-msvc`;
    return `${p}-${a}`;
}
function getBinaryNames() {
    const p = process.platform;
    const a = process.arch;
    const names = [];
    if (p === "linux" && a === "x64") {
        const libc = detectLibc();
        names.push(`garur_core.linux-x64-${libc}.node`);
        names.push(`garur_core.linux-x64-${libc === "gnu" ? "musl" : "gnu"}.node`);
    }
    else if (p === "linux" && a === "arm64") {
        names.push("garur_core.linux-arm64-gnu.node");
        names.push("garur_core.linux-arm64-musl.node");
    }
    else if (p === "darwin" && a === "arm64") {
        names.push("garur_core.darwin-arm64.node");
    }
    else if (p === "darwin" && a === "x64") {
        names.push("garur_core.darwin-x64.node");
    }
    else if (p === "win32" && a === "x64") {
        names.push("garur_core.win32-x64-msvc.node");
    }
    else if (p === "win32" && a === "arm64") {
        names.push("garur_core.win32-arm64-msvc.node");
    }
    names.push("index.cjs", "index.node");
    return names;
}
function getPlatformPackages() {
    const p = process.platform;
    const a = process.arch;
    const pkgs = [];
    if (p === "linux") {
        const libc = detectLibc();
        pkgs.push(`@garursaili/linux-${a}-${libc}`);
        pkgs.push(`@garursaili/linux-${a}-gnu`);
        pkgs.push(`@garursaili/linux-${a}-musl`);
    }
    else if (p === "darwin") {
        pkgs.push(`@garursaili/darwin-${a}`);
    }
    else if (p === "win32") {
        pkgs.push(`@garursaili/win32-${a}-msvc`);
    }
    pkgs.push(`@garursaili/${p}-${a}`);
    return pkgs;
}
// ═══════════════════════════════════════════════════════════════════
// Native loader
// ═══════════════════════════════════════════════════════════════════
let native = null;
let loadAttempted = false;
let loadSource = "";
function tryLoadNative() {
    if (loadAttempted)
        return native;
    loadAttempted = true;
    const cwd = process.cwd();
    const searchBases = [
        path.resolve(_dirname, ".."),
        path.resolve(_dirname, "../.."),
        _dirname,
        cwd,
        path.resolve(cwd, "node_modules/garursaili-css"),
        path.resolve(cwd, "node_modules/garursaili-css/dist"),
    ];
    const binaryNames = getBinaryNames();
    const platformPkgs = getPlatformPackages();
    const candidates = [];
    for (const pkg of platformPkgs) {
        try {
            const pkgJsonPath = requireCjs.resolve(`${pkg}/package.json`);
            const pkgDir = path.dirname(pkgJsonPath);
            for (const name of binaryNames)
                candidates.push(path.join(pkgDir, name));
        }
        catch { /* skip */ }
    }
    for (const base of searchBases) {
        for (const name of binaryNames)
            candidates.push(path.join(base, name));
    }
    candidates.push(path.resolve(cwd, "rust", "garur_core.node"));
    for (const name of binaryNames) {
        candidates.push(path.resolve(cwd, "rust", name));
    }
    if (process.env.GARUR_DEBUG) {
        console.log(`[garur] Platform: ${process.platform}-${process.arch}`);
        console.log(`[garur] Platform key: ${getPlatformKey()}`);
        console.log(`[garur] Binary names: ${binaryNames.join(", ")}`);
        console.log(`[garur] Native candidates (${candidates.length}):`);
        for (const c of candidates)
            console.log("  ", c);
    }
    for (const candidate of candidates) {
        if (!fs.existsSync(candidate))
            continue;
        try {
            try {
                delete requireCjs.cache?.[candidate];
            }
            catch { /* ignore */ }
            const mod = requireCjs(candidate);
            const real = mod?.default ?? mod;
            if (real && typeof real.build === "function") {
                native = real;
                loadSource = candidate;
                if (process.env.GARUR_DEBUG || process.env.GARUR_INFO) {
                    console.log(`🦀 Garur native v${native.version()} loaded from ${candidate}`);
                }
                return native;
            }
        }
        catch (e) {
            if (process.env.GARUR_DEBUG) {
                console.log(`[garur] Failed to load ${candidate}:`, e.message);
            }
        }
    }
    if (process.env.GARUR_DEBUG) {
        console.warn(`[garur] ⚠️  No native binary found for ${getPlatformKey()}.\n` +
            `       Falling back to JavaScript (slower).\n` +
            `       Expected one of: ${binaryNames.join(", ")}`);
    }
    return null;
}
tryLoadNative();
// ═══════════════════════════════════════════════════════════════════
// Public API
// ═══════════════════════════════════════════════════════════════════
export function hasNative() { return native !== null; }
export function nativeVersion() { return native?.version() ?? "js"; }
export function nativeSource() { return loadSource; }
export function platformKey() { return getPlatformKey(); }
export function initConfig(json) { native?.initConfig(json); }
export function initHandler(json) { native?.initHandler(json); }
export function parse(token) {
    if (native) {
        try {
            return native.parse(token);
        }
        catch { /* fall */ }
    }
    return parseJS(token);
}
export function parseBatch(tokens) {
    if (native) {
        try {
            return native.parseBatch(tokens);
        }
        catch { /* fall */ }
    }
    return tokens.map((t) => { try {
        return parseJS(t);
    }
    catch {
        return null;
    } });
}
export function lex(s) {
    if (native) {
        try {
            return native.lex(s);
        }
        catch { /* fall */ }
    }
    return s.split(/\s+/).filter(Boolean);
}
export function clearParseCache() { native?.clearParseCache(); }
export function build(cls, inline = false) {
    if (native) {
        try {
            return native.build(cls, inline);
        }
        catch {
            return null;
        }
    }
    return null;
}
export function buildBatch(classes) {
    if (native) {
        try {
            return native.buildBatch(classes);
        }
        catch { /* fall */ }
    }
    return classes.map(() => null);
}
export function clearCache() { native?.clearCache(); }
export function warmupClasses(classes) { native?.warmupClasses(classes); }
export function hasUtility(cls) {
    if (native) {
        try {
            return native.hasUtility(cls);
        }
        catch { /* fall */ }
    }
    return false;
}
export function extractClasses(content) {
    if (native) {
        try {
            return native.extractClasses(content);
        }
        catch { /* fall */ }
    }
    return extractJS(content);
}
export function extractFromFile(p) {
    if (native) {
        try {
            return native.extractFromFile(p);
        }
        catch { /* fall */ }
    }
    return null;
}
export function scanFiles(files) {
    if (native) {
        try {
            return native.scanFiles(files);
        }
        catch { /* fall */ }
    }
    return [];
}
function expandBraces(pattern) {
    const match = pattern.match(/\{([^{}]+)\}/);
    if (!match || match.index === undefined)
        return [pattern];
    const prefix = pattern.slice(0, match.index);
    const suffix = pattern.slice(match.index + match[0].length);
    const out = [];
    for (const opt of match[1].split(',')) {
        out.push(...expandBraces(`${prefix}${opt.trim()}${suffix}`));
    }
    return out;
}
export function findFiles(cwd, inc, ign) {
    const expandedInc = inc.flatMap(expandBraces);
    const expandedIgn = ign.flatMap(expandBraces);
    if (process.env.GARUR_DEBUG) {
        console.log("[garur] findFiles patterns:", expandedInc);
    }
    if (native) {
        try {
            return native.findFiles(cwd, expandedInc, expandedIgn);
        }
        catch { /* fall */ }
    }
    return [];
}
export function runSsc(files, configJson) {
    if (native) {
        try {
            return native.runSsc(files, configJson);
        }
        catch (e) {
            if (process.env.GARUR_DEBUG)
                console.error("runSsc failed:", e);
        }
    }
    return "";
}
export function minifyCss(css) {
    if (native) {
        try {
            return native.minifyCss(css);
        }
        catch { /* fall */ }
    }
    return css;
}
export function hashString(s) {
    if (native) {
        try {
            return native.hashString(s);
        }
        catch { /* fall */ }
    }
    let h = 0;
    for (let i = 0; i < s.length; i++)
        h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
    return Math.abs(h).toString(16).padStart(16, "0");
}
export function hashFile(p) {
    if (native) {
        try {
            return native.hashFile(p);
        }
        catch { /* fall */ }
    }
    return "";
}
export function getCacheStats() {
    const def = {
        build_hits: 0, build_misses: 0,
        parse_hits: 0, parse_misses: 0,
        build_entries: 0, parse_entries: 0,
        build_hit_rate: 0, parse_hit_rate: 0,
    };
    if (native && typeof native.cacheStats === "function") {
        try {
            const raw = native.cacheStats();
            let data = raw;
            if (typeof raw === "string") {
                try {
                    data = JSON.parse(raw);
                }
                catch {
                    return def;
                }
            }
            if (data && typeof data === "object") {
                const num = (x) => {
                    if (typeof x === "number" && !isNaN(x) && isFinite(x))
                        return x;
                    if (typeof x === "bigint")
                        return Number(x);
                    const v = Number(x);
                    return isNaN(v) || !isFinite(v) ? 0 : v;
                };
                return {
                    build_hits: num(data.build_hits),
                    build_misses: num(data.build_misses),
                    parse_hits: num(data.parse_hits),
                    parse_misses: num(data.parse_misses),
                    build_entries: num(data.build_entries),
                    parse_entries: num(data.parse_entries),
                    build_hit_rate: num(data.build_hit_rate),
                    parse_hit_rate: num(data.parse_hit_rate),
                };
            }
        }
        catch { /* */ }
    }
    return def;
}
export function resetCacheStats() {
    if (native && typeof native.resetCacheStats === "function") {
        try {
            native.resetCacheStats();
        }
        catch { /* */ }
    }
}
export function runSscWithStats(files, configJson) {
    resetCacheStats();
    const css = runSsc(files, configJson);
    if (!css) {
        return {
            css: "", filesScanned: files.length, uniqueClasses: 0,
            cacheHits: 0, cacheMisses: 0, parseHits: 0, parseMisses: 0,
            buildEntries: 0, buildHitRate: 0,
        };
    }
    const stats = getCacheStats();
    const classRe = /\.([a-zA-Z][a-zA-Z0-9_\\/-]*)/g;
    const seen = new Set();
    let m;
    while ((m = classRe.exec(css)) !== null)
        seen.add(m[1].replace(/\\/g, ""));
    return {
        css,
        filesScanned: files.length,
        uniqueClasses: seen.size,
        cacheHits: stats.build_hits,
        cacheMisses: stats.build_misses,
        parseHits: stats.parse_hits,
        parseMisses: stats.parse_misses,
        buildEntries: stats.build_entries,
        buildHitRate: stats.build_hit_rate,
    };
}
export function exportCache() {
    try {
        return native?.exportCache?.() ?? "";
    }
    catch {
        return "";
    }
}
export function importCache(data) {
    try {
        return native?.importCache?.(data) ?? false;
    }
    catch {
        return false;
    }
}
export function clearFileCache() {
    if (native && typeof native.clearFileCache === "function") {
        try {
            native.clearFileCache();
        }
        catch { /* */ }
    }
}
export function clearFinalizeCache() {
    if (native && typeof native.clearFinalizeCache === "function") {
        try {
            native.clearFinalizeCache();
        }
        catch { /* */ }
    }
}
export function finalizeCacheEntries() {
    if (native && typeof native.finalizeCacheEntries === "function") {
        try {
            return native.finalizeCacheEntries();
        }
        catch { /* */ }
    }
    return 0;
}
// ═══════════════════════════════════════════════════════════════════
// ✨ Plugin System v2 — NAPI bridges
// ═══════════════════════════════════════════════════════════════════
export function registerPluginUtilitiesBatch(entries) {
    if (native && typeof native.registerPluginUtilitiesBatch === "function") {
        try {
            const payload = entries.map(([k, v]) => [k, v]);
            native.registerPluginUtilitiesBatch(payload);
        }
        catch { /* fall */ }
    }
}
export function registerPluginComponentsBatch(entries) {
    if (native && typeof native.registerPluginComponentsBatch === "function") {
        try {
            const payload = entries.map(([k, v]) => [k, v]);
            native.registerPluginComponentsBatch(payload);
        }
        catch { /* fall */ }
    }
}
export function registerPluginAtRules(rules) {
    if (native && typeof native.registerPluginAtRules === "function") {
        try {
            native.registerPluginAtRules(rules);
        }
        catch { /* fall */ }
    }
}
/**
 * ✨ Bulk register: 1 ArcSwap clone + 1 cache clear for ALL entries.
 * Used by plugin_runner.ts to avoid N clones + N cache clears.
 */
export function registerPluginBulk(utilities, components, atRules) {
    if (!native || typeof native.registerPluginBulk !== "function") {
        console.error("[napi] ❌ registerPluginBulk binding missing");
        return;
    }
    try {
        const u = utilities.map(([k, v]) => [k, v]);
        const c = components.map(([k, v]) => [k, v]);
        if (process.env.GARUR_DEBUG) {
            console.log(`[napi] registerPluginBulk: ${u.length} utils, ${c.length} comp, ${atRules.length} at-rules`);
            if (u.length > 0)
                console.log(`[napi] First entry:`, u[0]);
        }
        native.registerPluginBulk(u, c, atRules);
        if (process.env.GARUR_DEBUG) {
            console.log(`[napi] registerPluginBulk ✓ DONE`);
        }
    }
    catch (e) {
        console.error("[napi] ❌ registerPluginBulk FAILED:", e);
        throw e; // ← Don't swallow!
    }
}
export function clearPluginRegistries() {
    if (native && typeof native.clearPluginRegistries === "function") {
        try {
            native.clearPluginRegistries();
        }
        catch { /* fall */ }
    }
}
export function getPluginComponentsJson() {
    if (native && typeof native.getPluginComponentsJson === "function") {
        try {
            return native.getPluginComponentsJson();
        }
        catch { /* fall */ }
    }
    return "[]";
}
export function getPluginAtRulesJson() {
    if (native && typeof native.getPluginAtRulesJson === "function") {
        try {
            return native.getPluginAtRulesJson();
        }
        catch { /* fall */ }
    }
    return "[]";
}
export function getPluginUtilitiesJson() {
    if (native && typeof native.getPluginUtilitiesJson === "function") {
        try {
            return native.getPluginUtilitiesJson();
        }
        catch { /* fall */ }
    }
    return "[]";
}
export function pluginUtilityCount() {
    if (native && typeof native.pluginUtilityCount === "function") {
        try {
            return native.pluginUtilityCount();
        }
        catch { /* fall */ }
    }
    return 0;
}
// ═══════════════════════════════════════════════════════════════════
// JS Fallbacks
// ═══════════════════════════════════════════════════════════════════
function parseJS(token) {
    if (!token)
        throw new Error("parse: empty");
    let raw = token;
    let neg = false, imp = false;
    while (raw.startsWith("!")) {
        imp = true;
        raw = raw.slice(1);
    }
    if (raw.startsWith("-")) {
        neg = true;
        raw = raw.slice(1);
    }
    const bracket = raw.indexOf("[");
    if (bracket !== -1) {
        const close = raw.lastIndexOf("]");
        if (close !== -1) {
            let key = raw.slice(0, bracket);
            if (key.endsWith("-"))
                key = key.slice(0, -1);
            return { raw: token, key, value: raw.slice(bracket + 1, close), negative: neg, important: imp };
        }
    }
    const idx = raw.lastIndexOf("-");
    if (idx === -1)
        return { raw: token, key: raw, value: "", negative: neg, important: imp };
    return { raw: token, key: raw.slice(0, idx), value: raw.slice(idx + 1), negative: neg, important: imp };
}
function extractJS(content) {
    const out = new Set();
    const re = /(?:class|className|data-garur)\s*=\s*(?:"([^"]+)"|'([^']+)'|`([^`]+)`)/g;
    let m;
    while ((m = re.exec(content)) !== null) {
        const s = m[1] || m[2] || m[3];
        if (!s)
            continue;
        for (const t of s.split(/\s+/))
            if (t)
                out.add(t);
    }
    return Array.from(out);
}
// ═══════════════════════════════════════════════════════════════════
// ✨ ART / FST Prefix Index (for Lazy Loading)
// ═══════════════════════════════════════════════════════════════════
export function buildPrefixIndex(entries) {
    if (native && typeof native.buildPrefixIndex === "function") {
        try {
            const payload = entries.map(([k, v]) => [k, v]);
            native.buildPrefixIndex(payload);
        }
        catch { /* fall */ }
    }
}
export function findMatchingPlugins(classes) {
    if (native && typeof native.findMatchingPlugins === "function") {
        try {
            return native.findMatchingPlugins(classes);
        }
        catch { /* fall */ }
    }
    return [];
}
export function clearPrefixIndex() {
    if (native && typeof native.clearPrefixIndex === "function") {
        try {
            native.clearPrefixIndex();
        }
        catch { /* fall */ }
    }
}
export function buildSpacingIndex(entries) {
    if (native && typeof native.buildSpacingIndex === "function") {
        try {
            native.buildSpacingIndex(entries);
        }
        catch { /* fall */ }
    }
}
// ═══════════════════════════════════════════════════════════════════
// Default export
// ═══════════════════════════════════════════════════════════════════
export default {
    hasNative, nativeVersion, nativeSource, platformKey,
    initConfig, initHandler,
    parse, parseBatch, lex, clearParseCache,
    build, buildBatch, clearCache, warmupClasses, hasUtility,
    extractClasses, extractFromFile, scanFiles, findFiles,
    runSsc, runSscWithStats, minifyCss,
    hashString, hashFile,
    getCacheStats, resetCacheStats,
    exportCache, importCache,
    clearFileCache, clearFinalizeCache, finalizeCacheEntries,
    // ✨ Plugin System v2
    registerPluginUtilitiesBatch,
    registerPluginComponentsBatch,
    registerPluginAtRules,
    registerPluginBulk,
    clearPluginRegistries,
    getPluginComponentsJson,
    getPluginAtRulesJson,
    getPluginUtilitiesJson,
    pluginUtilityCount,
    buildPrefixIndex,
    findMatchingPlugins,
    clearPrefixIndex,
    buildSpacingIndex,
};
