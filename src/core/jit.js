"use strict";
// src/jit.ts
// JIT scanner with path normalization, pruning, and block-level dedupe.
// Exports runJIT and runJITIncremental, plus JitStats type.
// Updated: Ensure preflight layers defined in components are always emitted (global preflight).
//
// Also: write a compressed garur.min.css alongside garur.css.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractClassesFromContent = extractClassesFromContent;
exports.runJIT = runJIT;
exports.runJITIncremental = runJITIncremental;
var fs_1 = require("fs");
var glob = require("fast-glob");
var path_1 = require("path");
var marge_1 = require("../marge");
var builder_1 = require("../builder");
var components_1 = require("../components");
var cache_1 = require("../utils/cache");
var garur_config_1 = require("../config/garur.config");
var DIST = path_1.default.resolve(process.cwd(), "dist");
var OUT = path_1.default.join(DIST, "garur.css");
var OUT_MIN = path_1.default.join(DIST, "garur.min.css");
/** Split class list respecting quotes, parens, brackets */
function splitClassList(s) {
    var out = [];
    var buf = "";
    var depthParen = 0;
    var depthBracket = 0;
    var depthBrace = 0;
    var inSingle = false;
    var inDouble = false;
    var inBacktick = false;
    for (var i = 0; i < s.length; i++) {
        var ch = s[i];
        var prev = i > 0 ? s[i - 1] : "";
        if (ch === "'" && !inDouble && !inBacktick && prev !== "\\")
            inSingle = !inSingle;
        else if (ch === '"' && !inSingle && !inBacktick && prev !== "\\")
            inDouble = !inDouble;
        else if (ch === "`" && !inSingle && !inDouble && prev !== "\\")
            inBacktick = !inBacktick;
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
        if (!inSingle && !inDouble && !inBacktick && depthParen === 0 && depthBracket === 0 && depthBrace === 0 && /\s/.test(ch)) {
            if (buf.trim())
                out.push(buf.trim());
            buf = "";
            continue;
        }
        buf += ch;
    }
    if (buf.trim())
        out.push(buf.trim());
    return out;
}
function expandGroupedShorthand(token) {
    if (!token)
        return [token];
    var baseMatch = token.match(/^([^\s(]+)\(([^)]+)\)$/);
    if (baseMatch) {
        var base = baseMatch[1];
        var inner = baseMatch[2];
        var innerParts = splitClassList(inner).filter(Boolean);
        return __spreadArray([base], innerParts, true);
    }
    var parenIndex = token.indexOf("(");
    if (parenIndex > 0 && token.endsWith(")")) {
        var prefix_1 = token.slice(0, parenIndex);
        var inner = token.slice(parenIndex + 1, -1);
        var parts = splitClassList(inner).filter(Boolean);
        if (parts.length)
            return parts.map(function (p) { return "".concat(prefix_1, ":").concat(p); });
    }
    return [token];
}
/** Extract all classes from file content */
function extractClassesFromContent(content) {
    var results = new Set();
    var processClassList = function (raw) {
        if (!raw)
            return;
        var toks = splitClassList(raw);
        for (var _i = 0, toks_1 = toks; _i < toks_1.length; _i++) {
            var tok = toks_1[_i];
            var expanded = expandGroupedShorthand(tok);
            for (var _a = 0, expanded_1 = expanded; _a < expanded_1.length; _a++) {
                var e = expanded_1[_a];
                if (e.includes("(") && e.includes(")")) {
                    expandGroupedShorthand(e).forEach(function (t) { return results.add(t); });
                }
                else {
                    results.add(e);
                }
            }
        }
    };
    // Standard attributes
    for (var _i = 0, _a = [
        /class="([^"]+)"/g,
        /class='([^']+)'/g,
        /className="([^"]+)"/g,
        /className='([^']+)'/g,
        /data-garur="([^"]+)"/g,
        /data-garur='([^']+)'/g,
    ]; _i < _a.length; _i++) {
        var re = _a[_i];
        var m = void 0;
        re.lastIndex = 0;
        while ((m = re.exec(content)))
            processClassList(m[1]);
    }
    // Template literals: className={`...`}
    var tplRe = /className=\{`([\s\S]*?)`\}/g;
    var mt;
    while ((mt = tplRe.exec(content))) {
        var cleaned = mt[1].replace(/\$\{[^}]*\}/g, " ");
        processClassList(cleaned);
    }
    // className={...}
    var exprRe = /className=\{([^}]+)\}/g;
    while ((mt = exprRe.exec(content))) {
        var expr = mt[1];
        var clsxRe = /(clsx|classnames)\(([^)]*)\)/g;
        var found = false;
        var mc = void 0;
        while ((mc = clsxRe.exec(expr))) {
            found = true;
            var args = mc[2];
            var quotedRe_1 = /['"]([^'"]+)['"]/g;
            var mq_1 = void 0;
            while ((mq_1 = quotedRe_1.exec(args)))
                processClassList(mq_1[1]);
        }
        if (found)
            continue;
        var quotedRe = /['"]([^'"]+)['"]/g;
        var any = false;
        var mq = void 0;
        while ((mq = quotedRe.exec(expr))) {
            any = true;
            processClassList(mq[1]);
        }
        if (any)
            continue;
        var arrayJoinRe = /\[([^\]]+)\]\.join\(/;
        var aj = expr.match(arrayJoinRe);
        if (aj) {
            var list = aj[1];
            var elems = list.split(",").map(function (s) { return s.trim().replace(/^['"]|['"]$/g, ""); }).filter(Boolean);
            elems.forEach(processClassList);
        }
    }
    // Simple strings
    var simpleRe = /class(?:Name)?=\{?["'`]([^"'`]+)["'`]\}?/g;
    var ms;
    while ((ms = simpleRe.exec(content)))
        processClassList(ms[1]);
    return Array.from(results);
}
/** Parse rule into media, selector, decl */
function extractRuleParts(rule) {
    var r = rule.trim();
    var media = null;
    var inner = r;
    var mediaMatch = r.match(/^@media\s*\(([^)]+)\)\s*\{\s*([\s\S]+)\s*\}\s*$/);
    if (mediaMatch) {
        media = mediaMatch[1].trim();
        inner = mediaMatch[2].trim();
    }
    var innerMatch = inner.match(/^([\s\S]+?)\s*\{\s*([\s\S]+?)\s*\}\s*$/);
    if (!innerMatch)
        return { media: media, selector: inner, decl: "" };
    return {
        media: media,
        selector: innerMatch[1].trim(),
        decl: innerMatch[2].trim().replace(/\s+/g, " "),
    };
}
/** Compose formatted rule */
function composeRule(media, selectors, decl) {
    var sorted = selectors.sort();
    var selectorText = sorted.join(", ");
    var declLines = decl.split(";").filter(Boolean).map(function (d) { return "  ".concat(d.trim(), ";"); }).join("\n");
    var rule = "".concat(selectorText, " {\n").concat(declLines, "\n}");
    return media ? "@media (".concat(media, ") {\n").concat(rule, "\n}") : rule;
}
/** Dedupe and format final CSS */
function dedupeCssBlocks(css) {
    if (!css.trim())
        return "";
    var blocks = css
        .split(/\n{2,}/)
        .map(function (b) { return b.trim(); })
        .filter(Boolean)
        .map(function (b) { return b.replace(/\s{2,}/g, " ").replace(/;\s*}/g, ";}"); });
    var seen = new Set();
    var out = [];
    for (var _i = 0, blocks_1 = blocks; _i < blocks_1.length; _i++) {
        var b = blocks_1[_i];
        if (seen.has(b))
            continue;
        seen.add(b);
        var formatted = b
            .replace(/\{/g, " {\n  ")
            .replace(/;/g, ";\n  ")
            .replace(/\n\s*\n/g, "\n")
            .replace(/\n  \}/g, "\n}");
        out.push(formatted);
    }
    return out.join("\n\n");
}
/** Simple minifier (safe, removes extra whitespace and empty lines) */
function minifyCss(css) {
    // remove comments
    var out = css.replace(/\/\*[\s\S]*?\*\//g, "");
    // collapse whitespace
    out = out.replace(/\s+/g, " ");
    // tighten around braces/semicolons
    out = out.replace(/\s*{\s*/g, "{").replace(/\s*}\s*/g, "}").replace(/\s*;\s*/g, ";").trim();
    return out;
}
/** Get all referenced classes */
function getReferencedClasses(files) {
    var set = new Set();
    for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
        var file = files_1[_i];
        try {
            var content = fs_1.default.readFileSync(file, "utf-8");
            extractClassesFromContent(content).forEach(function (c) { return set.add(c); });
        }
        catch (_a) { }
    }
    return set;
}
/** Build CSS from referenced classes only */
function buildCssFromCacheAndFiles(files, cache) {
    return __awaiter(this, void 0, void 0, function () {
        var referenced, dedupeMap, order, _i, files_2, file, content, matches, _a, matches_1, m, raw, clsList, compCSS, _b, _c, rule, _d, media, selector, decl, key, _e, _f, cls, rule, _g, media, selector, decl, key, mediaBlocks, baseBlocks, _h, order_1, key, e, block;
        var _j;
        return __generator(this, function (_k) {
            referenced = getReferencedClasses(files);
            dedupeMap = new Map();
            order = [];
            // === Components via mergeComponent ===
            for (_i = 0, files_2 = files; _i < files_2.length; _i++) {
                file = files_2[_i];
                try {
                    content = fs_1.default.readFileSync(file, "utf-8");
                    matches = __spreadArray(__spreadArray([], content.matchAll(/class(?:Name)?=(["'`])([^"'`]+)\1/g), true), content.matchAll(/className=\{`([\s\S]*?)`\}/g), true);
                    for (_a = 0, matches_1 = matches; _a < matches_1.length; _a++) {
                        m = matches_1[_a];
                        raw = m[2] || m[3] || "";
                        clsList = raw.split(/\s+/).filter(Boolean);
                        compCSS = (0, marge_1.mergeComponent)(clsList);
                        if (!compCSS)
                            continue;
                        for (_b = 0, _c = compCSS.split("\n").map(function (r) { return r.trim(); }).filter(Boolean); _b < _c.length; _b++) {
                            rule = _c[_b];
                            _d = extractRuleParts(rule), media = _d.media, selector = _d.selector, decl = _d.decl;
                            if (!decl)
                                continue;
                            key = "".concat(media || "", "::").concat(decl);
                            if (!dedupeMap.has(key)) {
                                dedupeMap.set(key, { selectors: new Set(), decl: decl, media: media });
                                order.push(key);
                            }
                            dedupeMap.get(key).selectors.add(selector);
                        }
                    }
                }
                catch (_l) { }
            }
            // === Atomic utilities ===
            for (_e = 0, _f = Array.from(referenced); _e < _f.length; _e++) {
                cls = _f[_e];
                if (cls in components_1.allComponents)
                    continue;
                rule = (_j = cache.classes) === null || _j === void 0 ? void 0 : _j[cls];
                if (!rule)
                    continue;
                _g = extractRuleParts(rule), media = _g.media, selector = _g.selector, decl = _g.decl;
                if (!decl)
                    continue;
                key = "".concat(media || "", "::").concat(decl);
                if (!dedupeMap.has(key)) {
                    dedupeMap.set(key, { selectors: new Set(), decl: decl, media: media });
                    order.push(key);
                }
                dedupeMap.get(key).selectors.add(selector);
            }
            mediaBlocks = [];
            baseBlocks = [];
            for (_h = 0, order_1 = order; _h < order_1.length; _h++) {
                key = order_1[_h];
                e = dedupeMap.get(key);
                block = composeRule(e.media, Array.from(e.selectors), e.decl);
                if (e.media)
                    mediaBlocks.push({ media: e.media, block: block });
                else
                    baseBlocks.push(block);
            }
            mediaBlocks.sort(function (a, b) { return a.media.localeCompare(b.media); });
            baseBlocks.sort(function (a, b) {
                var selA = a.split("{")[0].trim();
                var selB = b.split("{")[0].trim();
                return selA.localeCompare(selB);
            });
            return [2 /*return*/, __spreadArray(__spreadArray([], mediaBlocks.map(function (m) { return m.block; }), true), baseBlocks, true).join("\n\n")];
        });
    });
}
/** Collect preflight CSS from legacy preflight.css file (src/preflight.css) if present */
function loadPreflightFile() {
    try {
        var PREFLIGHT_PATH = path_1.default.resolve(__dirname, "preflight.css");
        if (fs_1.default.existsSync(PREFLIGHT_PATH)) {
            var preflight = fs_1.default.readFileSync(PREFLIGHT_PATH, "utf-8").trim();
            if (preflight)
                return preflight + "\n\n";
        }
    }
    catch (e) {
        console.warn("Failed to load preflight file:", e);
    }
    return "";
}
/** Collect preflight rawCSS from components (keys starting with preflight-) */
function collectPreflightFromComponents() {
    try {
        var parts = [];
        for (var _i = 0, _a = Object.entries(components_1.allComponents); _i < _a.length; _i++) {
            var _b = _a[_i], k = _b[0], comp = _b[1];
            if (k.startsWith("preflight-") && comp.rawCSS && typeof comp.rawCSS === "string") {
                parts.push(comp.rawCSS.trim());
            }
        }
        if (parts.length)
            return parts.join("\n\n") + "\n\n";
    }
    catch (e) {
        console.warn("Failed to collect preflight from components:", e);
    }
    return "";
}
function paletteToCssVars(palette) {
    if (!palette || typeof palette !== "object")
        return "";
    var lines = [":root {"];
    for (var _i = 0, _a = Object.entries(palette); _i < _a.length; _i++) {
        var _b = _a[_i], name_1 = _b[0], shades = _b[1];
        if (typeof shades === "string") {
            lines.push("  --garur-color-".concat(name_1, ": ").concat(shades, ";"));
        }
        else if (shades && typeof shades === "object") {
            for (var _c = 0, _d = Object.entries(shades); _c < _d.length; _c++) {
                var _e = _d[_c], k = _e[0], v = _e[1];
                lines.push("  --garur-color-".concat(name_1, "-").concat(k, ": ").concat(v, ";"));
            }
        }
    }
    lines.push("}");
    return lines.join("\n");
}
/** Full JIT build */
function runJIT() {
    return __awaiter(this, arguments, void 0, function (globPattern) {
        var cache, filesRelative, files, currentFiles, counts, allCurrentClasses, _i, files_3, file, content, classes, classesToRemove, _a, _b, cls, _c, classesToRemove_1, cls, filesToRemove, _d, _e, cachedFilePath, _f, filesToRemove_1, fileToRemove, _g, files_4, file, content, classes, _h, classes_1, cls, _j, classes_2, cls, built, norm, css, preflightFromComponents, preflightFile, preflightCombined, STATIC_PATH, staticCss, smPath, shortmap, rules, _k, _l, _m, key, entry, esc, decl, vars, finalCss, finalMin, uniqueClasses, uniqueUtilities, classOccurrences, cssBytes, top;
        var _o, _p, _q, _r, _s;
        if (globPattern === void 0) { globPattern = ["**/*.{html,ts,js,jsx,tsx}"]; }
        return __generator(this, function (_t) {
            switch (_t.label) {
                case 0:
                    cache = (0, cache_1.loadCache)();
                    return [4 /*yield*/, glob.default(globPattern, { ignore: ((_o = garur_config_1.default.jit) === null || _o === void 0 ? void 0 : _o.ignore) || [] })];
                case 1:
                    filesRelative = _t.sent();
                    files = filesRelative.map(function (f) { return path_1.default.resolve(process.cwd(), f); });
                    currentFiles = new Set(files.map(cache_1.normalizePathForCache));
                    counts = new Map();
                    allCurrentClasses = new Set();
                    for (_i = 0, files_3 = files; _i < files_3.length; _i++) {
                        file = files_3[_i];
                        try {
                            content = fs_1.default.readFileSync(file, "utf-8");
                            classes = extractClassesFromContent(content);
                            classes.forEach(function (cls) { return allCurrentClasses.add(cls); });
                        }
                        catch (e) {
                            // Skip files that can't be read
                        }
                    }
                    // Step 2: AGGRESSIVE pruning - remove any class not in current files
                    if (cache.classes) {
                        classesToRemove = [];
                        for (_a = 0, _b = Object.keys(cache.classes); _a < _b.length; _a++) {
                            cls = _b[_a];
                            // Keep the class if:
                            // 1. It's found in current files OR
                            // 2. It's a component (these are always kept)
                            if (!allCurrentClasses.has(cls) && !(cls in components_1.allComponents)) {
                                classesToRemove.push(cls);
                            }
                        }
                        console.log("\uD83D\uDDD1\uFE0F  Pruning ".concat(classesToRemove.length, " orphaned classes"));
                        for (_c = 0, classesToRemove_1 = classesToRemove; _c < classesToRemove_1.length; _c++) {
                            cls = classesToRemove_1[_c];
                            delete cache.classes[cls];
                        }
                    }
                    // Step 3: Remove files that no longer exist
                    if (cache.files) {
                        filesToRemove = [];
                        for (_d = 0, _e = Object.keys(cache.files); _d < _e.length; _d++) {
                            cachedFilePath = _e[_d];
                            if (!currentFiles.has(cachedFilePath)) {
                                filesToRemove.push(cachedFilePath);
                            }
                        }
                        for (_f = 0, filesToRemove_1 = filesToRemove; _f < filesToRemove_1.length; _f++) {
                            fileToRemove = filesToRemove_1[_f];
                            (0, cache_1.removeFileFromCache)(cache, fileToRemove);
                        }
                    }
                    // Step 4: Scan and process current files
                    for (_g = 0, files_4 = files; _g < files_4.length; _g++) {
                        file = files_4[_g];
                        content = "";
                        try {
                            content = fs_1.default.readFileSync(file, "utf-8");
                        }
                        catch (_u) {
                            continue;
                        }
                        classes = extractClassesFromContent(content);
                        // Update counts for stats
                        for (_h = 0, classes_1 = classes; _h < classes_1.length; _h++) {
                            cls = classes_1[_h];
                            counts.set(cls, (counts.get(cls) || 0) + 1);
                        }
                        // Build missing classes
                        for (_j = 0, classes_2 = classes; _j < classes_2.length; _j++) {
                            cls = classes_2[_j];
                            if (cls in components_1.allComponents)
                                continue; // Skip components
                            if (!((_p = cache.classes) === null || _p === void 0 ? void 0 : _p[cls])) {
                                built = (0, builder_1.build)(cls);
                                if (built) {
                                    cache.classes = cache.classes || {};
                                    cache.classes[cls] = built;
                                }
                            }
                        }
                        norm = (0, cache_1.normalizePathForCache)(file);
                        (0, cache_1.addFileClasses)(cache, norm, classes);
                        (0, cache_1.updateFileHash)(cache, norm, content);
                    }
                    return [4 /*yield*/, buildCssFromCacheAndFiles(files, cache)];
                case 2:
                    css = _t.sent();
                    // 🆕 INJECT ENHANCED ANIMATIONS
                    if (components_1.enhancedAnimations && typeof components_1.enhancedAnimations === "string" && components_1.enhancedAnimations.trim()) {
                        console.log("🎨 Injecting enhanced animations...");
                        css = "".concat(css, "\n\n/* \uD83C\uDF1F ENHANCED ANIMATIONS */\n").concat(components_1.enhancedAnimations);
                    }
                    // Inject Preflight (Tailwind-like base styles)
                    try {
                        preflightFromComponents = collectPreflightFromComponents();
                        preflightFile = loadPreflightFile();
                        preflightCombined = "";
                        if (preflightFromComponents)
                            preflightCombined += preflightFromComponents;
                        if (preflightFile)
                            preflightCombined += preflightFile;
                        if (preflightCombined)
                            css = "".concat(preflightCombined).concat(css);
                    }
                    catch (e) {
                        console.warn("Failed to inject preflight:", e);
                    }
                    // Static baseline (shortmap) insertion (unchanged)
                    try {
                        if (!((_q = garur_config_1.default.jit) === null || _q === void 0 ? void 0 : _q.dynamicOnly)) {
                            STATIC_PATH = path_1.default.join(DIST, "shortmap.css");
                            if (fs_1.default.existsSync(STATIC_PATH)) {
                                staticCss = fs_1.default.readFileSync(STATIC_PATH, "utf-8").trim();
                                if (staticCss)
                                    css = "".concat(staticCss, "\n\n").concat(css);
                            }
                            else {
                                smPath = path_1.default.resolve(__dirname, "shortmap.json");
                                if (fs_1.default.existsSync(smPath)) {
                                    shortmap = JSON.parse(fs_1.default.readFileSync(smPath, "utf-8"));
                                    rules = [];
                                    for (_k = 0, _l = Object.entries(shortmap); _k < _l.length; _k++) {
                                        _m = _l[_k], key = _m[0], entry = _m[1];
                                        if (entry.decl) {
                                            esc = key.replace(/[^a-zA-Z0-9_-]/g, "\\$&");
                                            decl = entry.decl.endsWith(";") ? entry.decl : "".concat(entry.decl, ";");
                                            rules.push(".".concat(esc, " {\n  ").concat(decl.replace(/;/g, ";\n  "), "\n}"));
                                        }
                                    }
                                    if (rules.length)
                                        css = "".concat(rules.join("\n\n"), "\n\n").concat(css);
                                }
                            }
                        }
                    }
                    catch (e) {
                        console.warn("Failed to load static baseline:", e);
                    }
                    // Palette vars
                    try {
                        if (garur_config_1.default.paletteAsVars && garur_config_1.default.palette) {
                            vars = paletteToCssVars(garur_config_1.default.palette);
                            if (vars.trim())
                                css = "".concat(vars, "\n\n").concat(css);
                        }
                    }
                    catch (e) {
                        console.warn("Failed to generate palette vars:", e);
                    }
                    finalCss = dedupeCssBlocks(css);
                    finalMin = minifyCss(finalCss);
                    if (!fs_1.default.existsSync(DIST))
                        fs_1.default.mkdirSync(DIST, { recursive: true });
                    fs_1.default.writeFileSync(OUT, finalCss, "utf-8");
                    fs_1.default.writeFileSync(OUT_MIN, finalMin, "utf-8");
                    (0, cache_1.saveCache)(cache);
                    uniqueClasses = counts.size;
                    uniqueUtilities = Array.from(counts.keys()).filter(function (c) { return !(c in components_1.allComponents); }).length;
                    classOccurrences = Array.from(counts.values()).reduce(function (a, b) { return a + b; }, 0);
                    cssBytes = Buffer.byteLength(finalCss, "utf-8");
                    top = Array.from(counts.entries())
                        .sort(function (a, b) { return b[1] - a[1]; })
                        .slice(0, (_s = (_r = garur_config_1.default.stats) === null || _r === void 0 ? void 0 : _r.topN) !== null && _s !== void 0 ? _s : 25)
                        .map(function (_a) {
                        var cls = _a[0], count = _a[1];
                        return ({ cls: cls, count: count });
                    });
                    return [2 /*return*/, {
                            filesScanned: files.length,
                            classOccurrences: classOccurrences,
                            uniqueClasses: uniqueClasses,
                            uniqueUtilities: uniqueUtilities,
                            cssBytes: cssBytes,
                            topClasses: top,
                        }];
            }
        });
    });
}
/** Incremental build */
function runJITIncremental(changedFiles) {
    return __awaiter(this, void 0, void 0, function () {
        var cache, globPattern, filesRelative, files, currentFiles, referenced, _i, changedFiles_1, fileRaw, filePath, norm, content, classes, _a, classes_3, cls, built, _b, _c, cls, _d, _e, f, norm, css, preflightFromComponents, preflightFile, preflightCombined, STATIC_PATH, staticCss, vars, finalCss, finalMin;
        var _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    cache = (0, cache_1.loadCache)();
                    globPattern = ["**/*.{html,ts,js,jsx,tsx}"];
                    return [4 /*yield*/, glob.default(globPattern, { ignore: ((_f = garur_config_1.default.jit) === null || _f === void 0 ? void 0 : _f.ignore) || [] })];
                case 1:
                    filesRelative = _j.sent();
                    files = filesRelative.map(function (f) { return path_1.default.resolve(process.cwd(), f); });
                    currentFiles = new Set(files.map(cache_1.normalizePathForCache));
                    referenced = getReferencedClasses(files);
                    // Process changed files
                    for (_i = 0, changedFiles_1 = changedFiles; _i < changedFiles_1.length; _i++) {
                        fileRaw = changedFiles_1[_i];
                        filePath = path_1.default.resolve(process.cwd(), fileRaw);
                        norm = (0, cache_1.normalizePathForCache)(filePath);
                        if (!fs_1.default.existsSync(filePath)) {
                            (0, cache_1.removeFileFromCache)(cache, norm);
                            continue;
                        }
                        content = fs_1.default.readFileSync(filePath, "utf-8");
                        if (!(0, cache_1.hasFileChanged)(cache, norm, content))
                            continue;
                        classes = extractClassesFromContent(content);
                        for (_a = 0, classes_3 = classes; _a < classes_3.length; _a++) {
                            cls = classes_3[_a];
                            if (cls in components_1.allComponents)
                                continue;
                            if (!((_g = cache.classes) === null || _g === void 0 ? void 0 : _g[cls])) {
                                built = (0, builder_1.build)(cls);
                                if (built)
                                    cache.classes[cls] = built;
                            }
                        }
                        (0, cache_1.addFileClasses)(cache, norm, classes);
                        (0, cache_1.updateFileHash)(cache, norm, content);
                    }
                    // Prune
                    if (cache.classes) {
                        for (_b = 0, _c = Object.keys(cache.classes); _b < _c.length; _b++) {
                            cls = _c[_b];
                            if (!referenced.has(cls))
                                delete cache.classes[cls];
                        }
                    }
                    if (cache.files) {
                        for (_d = 0, _e = Object.keys(cache.files); _d < _e.length; _d++) {
                            f = _e[_d];
                            norm = (0, cache_1.normalizePathForCache)(f);
                            if (!currentFiles.has(norm))
                                (0, cache_1.removeFileFromCache)(cache, norm);
                        }
                    }
                    return [4 /*yield*/, buildCssFromCacheAndFiles(files, cache)];
                case 2:
                    css = _j.sent();
                    // 🆕 INJECT ENHANCED ANIMATIONS IN INCREMENTAL BUILD TOO
                    if (components_1.enhancedAnimations && typeof components_1.enhancedAnimations === "string" && components_1.enhancedAnimations.trim()) {
                        css = "".concat(css, "\n\n/* \uD83C\uDF1F ENHANCED ANIMATIONS */\n").concat(components_1.enhancedAnimations);
                    }
                    // Inject Preflight (components-first then file)
                    try {
                        preflightFromComponents = collectPreflightFromComponents();
                        preflightFile = loadPreflightFile();
                        preflightCombined = "";
                        if (preflightFromComponents)
                            preflightCombined += preflightFromComponents;
                        if (preflightFile)
                            preflightCombined += preflightFile;
                        if (preflightCombined)
                            css = "".concat(preflightCombined).concat(css);
                    }
                    catch (e) {
                        console.warn("Failed to inject preflight:", e);
                    }
                    // Static + palette (unchanged)
                    try {
                        if (!((_h = garur_config_1.default.jit) === null || _h === void 0 ? void 0 : _h.dynamicOnly)) {
                            STATIC_PATH = path_1.default.join(DIST, "garur.css");
                            if (fs_1.default.existsSync(STATIC_PATH)) {
                                staticCss = fs_1.default.readFileSync(STATIC_PATH, "utf-8").trim();
                                if (staticCss)
                                    css = "".concat(staticCss, "\n\n").concat(css);
                            }
                        }
                    }
                    catch (e) {
                        console.warn("Failed to load static baseline:", e);
                    }
                    try {
                        if (garur_config_1.default.paletteAsVars && garur_config_1.default.palette) {
                            vars = paletteToCssVars(garur_config_1.default.palette);
                            if (vars.trim())
                                css = "".concat(vars, "\n\n").concat(css);
                        }
                    }
                    catch (e) {
                        console.warn("Failed to generate palette vars:", e);
                    }
                    finalCss = dedupeCssBlocks(css);
                    finalMin = minifyCss(finalCss);
                    if (!fs_1.default.existsSync(DIST))
                        fs_1.default.mkdirSync(DIST, { recursive: true });
                    fs_1.default.writeFileSync(OUT, finalCss, "utf-8");
                    fs_1.default.writeFileSync(OUT_MIN, finalMin, "utf-8");
                    (0, cache_1.saveCache)(cache);
                    return [2 /*return*/, { filesProcessed: changedFiles.length, newCssBytes: Buffer.byteLength(finalCss, "utf-8") }];
            }
        });
    });
}
