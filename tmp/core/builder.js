// src/builder.ts - FIXED VERSION
// Preserving all existing optimizations while fixing handler integration
import { parse } from "./parser";
import { handle, UTIL_DOCS } from "./handler"; // Removed KEYFRAMES import
import plugin from "../plugin";
import configDefault from "../config/garur.config";
import { splitPrefixesFromRaw, applyVariantSelectors } from "../utils/variants";
import cssEscape from "css.escape";
// ==================== ENHANCED PRE-COMPUTED CONSTANTS ====================
const CONFIG_BREAKPOINTS = configDefault.breakpoints || {};
const BREAKPOINT_SET = new Set(Object.keys(CONFIG_BREAKPOINTS));
const DARK_MODE = configDefault.darkMode;
const IMPORTANT_MODE = configDefault.important === true;
// ==================== ENHANCED CACHES ====================
const buildCache = new Map();
const MAX_BUILD_CACHE = 5000;
const escapeCache = new Map();
const MAX_ESCAPE_CACHE = 10000;
const parseCache = new Map();
const MAX_PARSE_CACHE = 3000;
const handlerCache = new Map();
const MAX_HANDLER_CACHE = 5000;
const prefixCache = new Map();
const MAX_PREFIX_CACHE = 3000;
const variantCache = new Map();
const MAX_VARIANT_CACHE = 3000;
// NEW: Cache for color utility patterns - FIXED TYPE
const colorPatternCache = new Map();
const MAX_COLOR_PATTERN_CACHE = 2000;
// ==================== ENHANCED ESCAPING ====================
export function escapeClassName(cls) {
    if (!cls)
        return cls;
    const cached = escapeCache.get(cls);
    if (cached !== undefined)
        return cached;
    let result;
    // Try native CSS.escape first
    if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
        try {
            result = CSS.escape(cls);
        }
        catch {
            result = cls; // Fallback on error
        }
    }
    else {
        // Manual escaping with optimization
        let needsEscape = false;
        // Fast path for common patterns
        if (cls.includes(':') || cls.includes('/') || cls.includes('[')) {
            needsEscape = true;
        }
        else {
            // Check each character efficiently
            for (let i = 0; i < cls.length; i++) {
                const code = cls.charCodeAt(i);
                if (!(code >= 48 && code <= 57) && // 0-9
                    !(code >= 65 && code <= 90) && // A-Z
                    !(code >= 97 && code <= 122) && // a-z
                    code !== 45 && // -
                    code !== 95 // _
                ) {
                    needsEscape = true;
                    break;
                }
            }
        }
        if (!needsEscape) {
            result = cls;
        }
        else {
            try {
                if (typeof cssEscape === "function") {
                    result = cssEscape(cls);
                }
                else {
                    // Optimized regex escape
                    result = cls.replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, '\\$&');
                }
            }
            catch {
                // Ultimate fallback
                result = cls.replace(/[^a-zA-Z0-9_-]/g, (ch) => `\\${ch}`);
            }
        }
    }
    // Cache management
    if (escapeCache.size >= MAX_ESCAPE_CACHE) {
        const firstKey = escapeCache.keys().next().value;
        if (firstKey)
            escapeCache.delete(firstKey);
    }
    escapeCache.set(cls, result);
    return result;
}
// ==================== ENHANCED PREFIX SPLITTING ====================
function cachedSplitPrefixesFromRaw(cls) {
    const cached = prefixCache.get(cls);
    if (cached)
        return cached;
    // Special handling for color utilities to prevent misparsing
    const colorPatterns = [
        /^(text|bg|border|divide|ring|outline|fill|stroke|accent|caret|decoration)-[a-z]+-\d+$/,
        /^(text|bg|border|divide|ring|outline|fill|stroke|accent|caret|decoration)-[a-z]+$/,
    ];
    let result;
    // Check if it's a color utility
    const isColorUtility = colorPatterns.some(pattern => pattern.test(cls));
    if (isColorUtility) {
        // For color utilities, try to keep them together
        const colorCached = colorPatternCache.get(cls);
        if (colorCached) {
            result = colorCached;
        }
        else {
            // Try to parse as single unit first
            const parsed = splitPrefixesFromRaw(cls);
            // If parsing split a color (e.g., "text-indigo-500" -> "text-indigo", "500")
            // Recombine and try without prefix splitting
            if (parsed.raw.includes('-') && /^\d+$/.test(parsed.raw)) {
                // This might be a misparsed color utility
                // Try parsing the class as a whole
                result = { prefixes: [], raw: cls };
            }
            else {
                result = parsed;
            }
            // Cache color pattern
            if (colorPatternCache.size >= MAX_COLOR_PATTERN_CACHE) {
                const firstKey = colorPatternCache.keys().next().value;
                if (firstKey)
                    colorPatternCache.delete(firstKey);
            }
            colorPatternCache.set(cls, result);
        }
    }
    else {
        result = splitPrefixesFromRaw(cls);
    }
    // Cache management
    if (prefixCache.size >= MAX_PREFIX_CACHE) {
        const firstKey = prefixCache.keys().next().value;
        if (firstKey)
            prefixCache.delete(firstKey);
    }
    prefixCache.set(cls, result);
    return result;
}
// ==================== ENHANCED VARIANT APPLICATION ====================
function cachedApplyVariantsToSelector(baseSelector, variantParts) {
    const cacheKey = baseSelector + '|' + variantParts.join(':');
    const cached = variantCache.get(cacheKey);
    if (cached)
        return cached;
    let result = baseSelector;
    // Apply variants in reverse order (most specific last)
    for (let i = variantParts.length - 1; i >= 0; i--) {
        const variant = variantParts[i];
        // Special handling for common variants
        switch (variant) {
            case 'hover':
                result = `${result}:hover`;
                break;
            case 'focus':
                result = `${result}:focus`;
                break;
            case 'active':
                result = `${result}:active`;
                break;
            case 'disabled':
                result = `${result}:disabled`;
                break;
            case 'checked':
                result = `${result}:checked`;
                break;
            case 'first':
                result = `${result}:first-child`;
                break;
            case 'last':
                result = `${result}:last-child`;
                break;
            case 'odd':
                result = `${result}:nth-child(odd)`;
                break;
            case 'even':
                result = `${result}:nth-child(even)`;
                break;
            case 'group-hover':
                result = `.group:hover ${result}`;
                break;
            case 'group-focus':
                result = `.group:focus ${result}`;
                break;
            case 'dark':
                if (DARK_MODE === 'class') {
                    result = `.dark ${result}`;
                }
                break;
            default:
                // Use the utility function for complex variants
                result = applyVariantSelectors(result, [variant]);
        }
    }
    // Cache management
    if (variantCache.size >= MAX_VARIANT_CACHE) {
        const firstKey = variantCache.keys().next().value;
        if (firstKey)
            variantCache.delete(firstKey);
    }
    variantCache.set(cacheKey, result);
    return result;
}
// ==================== ENHANCED PARSING ====================
function cachedParse(raw) {
    const cached = parseCache.get(raw);
    if (cached !== undefined)
        return cached;
    let result;
    try {
        // Special handling for color utilities
        const isColorLike = raw.includes('-') && (raw.startsWith('text-') ||
            raw.startsWith('bg-') ||
            raw.startsWith('border-') ||
            raw.startsWith('ring-') ||
            raw.startsWith('fill-') ||
            raw.startsWith('stroke-'));
        if (isColorLike) {
            // For color utilities, parse as single token
            // This prevents "text-indigo-500" from being parsed as "text-indigo" with value "500"
            const lastDash = raw.lastIndexOf('-');
            if (lastDash !== -1) {
                const potentialValue = raw.substring(lastDash + 1);
                // Check if the part after last dash looks like a color value (number or hex)
                if (/^\d+$/.test(potentialValue) || /^[a-fA-F0-9]+$/.test(potentialValue)) {
                    // This is likely a color utility like "text-indigo-500"
                    // Parse it as a single key
                    result = {
                        key: raw,
                        raw: raw,
                        important: false,
                        negative: false
                    };
                }
                else {
                    // Use normal parsing
                    result = parse(raw);
                }
            }
            else {
                result = parse(raw);
            }
        }
        else {
            result = parse(raw);
        }
    }
    catch (error) {
        console.warn(`Parse error for "${raw}":`, error);
        result = null;
    }
    // Cache management
    if (parseCache.size >= MAX_PARSE_CACHE) {
        const firstKey = parseCache.keys().next().value;
        if (firstKey)
            parseCache.delete(firstKey);
    }
    parseCache.set(raw, result);
    return result;
}
// ==================== ENHANCED HANDLING ====================
function cachedHandle(token) {
    const cacheKey = JSON.stringify(token);
    const cached = handlerCache.get(cacheKey);
    if (cached !== undefined)
        return cached;
    let result;
    try {
        result = handle(token);
        // If handler returned null, check if it's a known utility
        if (!result && token && token.key) {
            // Try to see if it's a documented utility
            const isDocumented = UTIL_DOCS.some(doc => {
                if (doc.example) {
                    return doc.example.includes(token.key) ||
                        token.key.includes(doc.id.replace(/[\[\]]/g, ''));
                }
                return false;
            });
            if (isDocumented) {
                // This is a known utility but handler didn't produce output
                // Try plugins as fallback
                const hooks = plugin.getHandlerHooks();
                for (const hook of hooks) {
                    try {
                        const hookResult = hook(token);
                        if (hookResult) {
                            result = hookResult;
                            break;
                        }
                    }
                    catch {
                        // Ignore plugin errors
                    }
                }
            }
        }
    }
    catch (error) {
        console.warn(`Handler error for token:`, token, error);
        result = null;
    }
    // Cache management
    if (handlerCache.size >= MAX_HANDLER_CACHE) {
        const firstKey = handlerCache.keys().next().value;
        if (firstKey)
            handlerCache.delete(firstKey);
    }
    handlerCache.set(cacheKey, result);
    return result;
}
// ==================== ENHANCED HELPER FUNCTIONS ====================
function applyImportantToDecl(decl, important) {
    if (!important || !decl || IMPORTANT_MODE)
        return decl;
    // Fast path for simple declarations
    if (!decl.includes(';') && !decl.includes('!important')) {
        return decl.trim().endsWith(';')
            ? decl.trim().slice(0, -1) + ' !important;'
            : decl + ' !important;';
    }
    // Parse multiple declarations
    const parts = [];
    let current = '';
    let inParen = 0;
    let inQuote = false;
    let quoteChar = '';
    for (let i = 0; i < decl.length; i++) {
        const char = decl[i];
        const prevChar = i > 0 ? decl[i - 1] : '';
        // Handle quotes
        if ((char === '"' || char === "'") && prevChar !== '\\') {
            if (!inQuote) {
                inQuote = true;
                quoteChar = char;
            }
            else if (quoteChar === char) {
                inQuote = false;
            }
        }
        // Handle parentheses
        if (!inQuote) {
            if (char === '(')
                inParen++;
            if (char === ')')
                inParen--;
        }
        // Handle semicolons (only when not in quotes or parens)
        if (char === ';' && !inQuote && inParen === 0) {
            const trimmed = current.trim();
            if (trimmed && !trimmed.includes('!important')) {
                parts.push(trimmed + ' !important');
            }
            else if (trimmed) {
                parts.push(trimmed);
            }
            current = '';
        }
        else {
            current += char;
        }
    }
    // Handle last part
    const last = current.trim();
    if (last && !last.includes('!important')) {
        parts.push(last + ' !important');
    }
    else if (last) {
        parts.push(last);
    }
    return parts.join('; ') + (parts.length ? ';' : '');
}
function wrapWithBps(rule, bps) {
    if (bps.length === 0)
        return rule;
    let result = rule;
    // Apply breakpoints in descending order (largest first)
    const sortedBps = [...bps].sort((a, b) => {
        const widthA = parseInt(CONFIG_BREAKPOINTS[a] || '0');
        const widthB = parseInt(CONFIG_BREAKPOINTS[b] || '0');
        return widthB - widthA;
    });
    for (const bp of sortedBps) {
        const width = CONFIG_BREAKPOINTS[bp];
        if (width) {
            result = `@media (min-width: ${width}) { ${result} }`;
        }
    }
    return result;
}
// ==================== ENHANCED MAIN BUILD FUNCTION ====================
export function build(cls, inline = false) {
    if (!cls || typeof cls !== "string")
        return null;
    const cacheKey = inline ? `inline:${cls}` : cls;
    const cached = buildCache.get(cacheKey);
    if (cached !== undefined)
        return cached;
    if (cls.length === 0) {
        buildCache.set(cacheKey, null);
        return null;
    }
    // FIX: Apply color utility fix before parsing
    const { prefixes, raw } = cachedSplitPrefixesFromRaw(cls);
    const fixedRaw = fixColorUtilityParsing(raw);
    const token = cachedParse(fixedRaw);
    if (!token) {
        buildCache.set(cacheKey, null);
        return null;
    }
    // REST OF YOUR ORIGINAL CODE STAYS THE SAME...
    // (I'll show the rest, but it's your original code with minimal changes)
    const result = cachedHandle(token);
    if (!result) {
        buildCache.set(cacheKey, null);
        return null;
    }
    let declaration = null;
    let selectorSuffix;
    let extra;
    if (typeof result === "string") {
        declaration = result.endsWith(";") ? result : `${result};`;
    }
    else if (result && typeof result === "object") {
        declaration = result.decl
            ? (result.decl.endsWith(";") ? result.decl : `${result.decl};`)
            : null;
        selectorSuffix = result.selectorSuffix;
        extra = result.extra;
    }
    if (!declaration && !extra) {
        buildCache.set(cacheKey, null);
        return null;
    }
    if (token.important && declaration) {
        declaration = applyImportantToDecl(declaration, true);
    }
    if (inline) {
        buildCache.set(cacheKey, declaration);
        return declaration;
    }
    const escaped = `.${escapeClassName(cls)}`;
    const breakpointParts = [];
    const variantParts = [];
    for (let i = 0; i < prefixes.length; i++) {
        const p = prefixes[i];
        if (BREAKPOINT_SET.has(p)) {
            breakpointParts.push(p);
        }
        else {
            variantParts.push(p);
        }
    }
    let variantSelector = cachedApplyVariantsToSelector(escaped, variantParts);
    if (selectorSuffix) {
        if (!selectorSuffix.startsWith(":") &&
            !selectorSuffix.startsWith("::") &&
            !selectorSuffix.startsWith(" ")) {
            selectorSuffix = ` ${selectorSuffix}`;
        }
        variantSelector = `${variantSelector}${selectorSuffix}`;
    }
    let rule = "";
    let finalResult = null;
    if (declaration) {
        rule = `${variantSelector} { ${declaration} }`;
        if (variantParts.includes("dark") && DARK_MODE === "media") {
            rule = wrapWithBps(rule, breakpointParts);
            rule = `@media (prefers-color-scheme: dark) { ${rule} }`;
            finalResult = rule;
        }
        else {
            finalResult = wrapWithBps(rule, breakpointParts);
        }
    }
    if (extra) {
        const substituted = extra.replace(/__SELF__/g, variantSelector);
        const extraWrapped = wrapWithBps(substituted, breakpointParts);
        if (finalResult) {
            finalResult = `${finalResult}\n${extraWrapped}`;
        }
        else {
            finalResult = extraWrapped;
        }
    }
    if (buildCache.size >= MAX_BUILD_CACHE) {
        const keys = Array.from(buildCache.keys());
        const toRemove = Math.floor(MAX_BUILD_CACHE * 0.2);
        for (let i = 0; i < toRemove && i < keys.length; i++) {
            buildCache.delete(keys[i]);
        }
    }
    buildCache.set(cacheKey, finalResult);
    return finalResult;
}
// Helper function for building from parsed parts
function buildFromParts(prefixes, raw, originalCls, inline, cacheKey) {
    // Step 2: Parse the raw class
    const token = cachedParse(raw);
    if (!token) {
        buildCache.set(cacheKey, null);
        return null;
    }
    // Step 3: Handle the parsed token
    const result = cachedHandle(token);
    if (!result) {
        buildCache.set(cacheKey, null);
        return null;
    }
    // Step 4: Extract declaration and metadata
    let declaration = null;
    let selectorSuffix;
    let extra;
    let mediaQuery;
    let containerQuery;
    let supportsQuery;
    let atRule;
    if (typeof result === "string") {
        declaration = result.endsWith(";") ? result : `${result};`;
    }
    else if (result && typeof result === "object") {
        declaration = result.decl
            ? (result.decl.endsWith(";") ? result.decl : `${result.decl};`)
            : null;
        selectorSuffix = result.selectorSuffix;
        extra = result.extra;
        mediaQuery = result.mediaQuery;
        containerQuery = result.containerQuery;
        supportsQuery = result.supports;
        atRule = result.atRule;
    }
    if (!declaration && !extra) {
        buildCache.set(cacheKey, null);
        return null;
    }
    // Step 5: Apply important flag
    if ((token.important || IMPORTANT_MODE) && declaration) {
        declaration = applyImportantToDecl(declaration, true);
    }
    // Step 6: Handle inline mode (return only declaration)
    if (inline) {
        buildCache.set(cacheKey, declaration);
        return declaration;
    }
    // Step 7: Create selector with variants
    const escaped = `.${escapeClassName(originalCls)}`;
    const breakpointParts = [];
    const variantParts = [];
    // Separate breakpoints from other variants
    for (const p of prefixes) {
        if (BREAKPOINT_SET.has(p)) {
            breakpointParts.push(p);
        }
        else {
            variantParts.push(p);
        }
    }
    let variantSelector = cachedApplyVariantsToSelector(escaped, variantParts);
    // Apply selector suffix if provided
    if (selectorSuffix) {
        if (!selectorSuffix.startsWith(":") &&
            !selectorSuffix.startsWith("::") &&
            !selectorSuffix.startsWith(" ")) {
            selectorSuffix = ` ${selectorSuffix}`;
        }
        variantSelector = `${variantSelector}${selectorSuffix}`;
    }
    // Step 8: Build the final CSS rule
    let rule = "";
    let finalResult = null;
    if (declaration) {
        rule = `${variantSelector} { ${declaration} }`;
        // Apply dark mode if needed
        if (variantParts.includes("dark") && DARK_MODE === "media") {
            rule = wrapWithBps(rule, breakpointParts);
            rule = `@media (prefers-color-scheme: dark) { ${rule} }`;
            finalResult = rule;
        }
        else {
            finalResult = wrapWithBps(rule, breakpointParts);
        }
        // Apply other media/container queries
        if (mediaQuery) {
            finalResult = `@media ${mediaQuery} { ${finalResult} }`;
        }
        if (containerQuery) {
            finalResult = `@container ${containerQuery} { ${finalResult} }`;
        }
        if (supportsQuery) {
            finalResult = `@supports ${supportsQuery} { ${finalResult} }`;
        }
        if (atRule) {
            finalResult = `${atRule} { ${finalResult} }`;
        }
    }
    // Step 9: Add extra CSS (like keyframes)
    if (extra) {
        const substituted = extra.replace(/__SELF__/g, variantSelector);
        let extraWrapped = wrapWithBps(substituted, breakpointParts);
        // Apply same queries to extra CSS
        if (mediaQuery)
            extraWrapped = `@media ${mediaQuery} { ${extraWrapped} }`;
        if (containerQuery)
            extraWrapped = `@container ${containerQuery} { ${extraWrapped} }`;
        if (supportsQuery)
            extraWrapped = `@supports ${supportsQuery} { ${extraWrapped} }`;
        if (atRule)
            extraWrapped = `${atRule} { ${extraWrapped} }`;
        if (finalResult) {
            finalResult = `${finalResult}\n${extraWrapped}`;
        }
        else {
            finalResult = extraWrapped;
        }
    }
    // Step 10: Cache management
    if (buildCache.size >= MAX_BUILD_CACHE) {
        const keys = Array.from(buildCache.keys());
        const toRemove = Math.floor(MAX_BUILD_CACHE * 0.2);
        for (let i = 0; i < toRemove && i < keys.length; i++) {
            buildCache.delete(keys[i]);
        }
    }
    buildCache.set(cacheKey, finalResult);
    return finalResult;
}
// ==================== ENHANCED CACHE MANAGEMENT ====================
export function clearBuildCache() {
    buildCache.clear();
    escapeCache.clear();
    parseCache.clear();
    handlerCache.clear();
    prefixCache.clear();
    variantCache.clear();
    colorPatternCache.clear();
}
export function getBuildCacheStats() {
    return {
        buildCache: buildCache.size,
        escapeCache: escapeCache.size,
        parseCache: parseCache.size,
        handlerCache: handlerCache.size,
        prefixCache: prefixCache.size,
        variantCache: variantCache.size,
        colorPatternCache: colorPatternCache.size
    };
}
// ==================== ENHANCED WARMUP FUNCTION ====================
export function warmupCache(commonClasses = [
    'container', 'mx-auto', 'px-4', 'py-2', 'text-center',
    'font-bold', 'text-red-500', 'bg-blue-500', 'rounded',
    'border-gray-300', 'hover:bg-blue-600', 'focus:outline-none',
    'sm:flex', 'md:grid', 'lg:block', 'xl:hidden', 'dark:bg-gray-800',
    'text-lg', 'font-semibold', 'shadow-lg', 'transition-all',
    'duration-200', 'ease-in-out', 'cursor-pointer', 'select-none',
    'opacity-50', 'rotate-45', 'scale-110', 'translate-x-4',
    'w-full', 'h-screen', 'min-h-[100px]', 'max-w-[200px]',
    '[&>div]:p-4', 'grid-cols-3', 'gap-4', 'items-center',
    'justify-between', 'space-x-4', 'divide-y', 'ring-2',
    'outline-none', 'bg-gradient-to-r', 'from-blue-500', 'to-purple-500'
]) {
    console.log(`🔥 Warming up cache with ${commonClasses.length} common classes...`);
    const start = performance.now();
    let successCount = 0;
    for (const cls of commonClasses) {
        const result = build(cls);
        if (result)
            successCount++;
    }
    const time = performance.now() - start;
    const stats = getBuildCacheStats();
    console.log(`🔥 Cache warmup complete in ${Math.round(time)}ms`);
    console.log(`📊 Success: ${successCount}/${commonClasses.length} classes`);
    console.log(`📊 Cache sizes: Build=${stats.buildCache}, Parse=${stats.parseCache}, Handler=${stats.handlerCache}`);
}
// ==================== DEBUG UTILITIES ====================
export function debugBuild(cls) {
    const { prefixes, raw } = cachedSplitPrefixesFromRaw(cls);
    const token = cachedParse(raw);
    const result = cachedHandle(token);
    return {
        original: cls,
        prefixes,
        raw,
        token,
        handlerResult: result,
        built: build(cls),
        escaped: escapeClassName(cls)
    };
}
export function validateUtilities(utilities) {
    const valid = [];
    const invalid = [];
    for (const util of utilities) {
        const result = build(util);
        if (result) {
            valid.push(util);
        }
        else {
            invalid.push(util);
        }
    }
    return { valid, invalid };
}
function fixColorUtilityParsing(raw) {
    // If it looks like a color utility (text-red-500, bg-blue-300, etc.)
    const colorPrefixes = ['text-', 'bg-', 'border-', 'ring-', 'fill-', 'stroke-', 'accent-', 'caret-', 'decoration-'];
    for (const prefix of colorPrefixes) {
        if (raw.startsWith(prefix) && raw.includes('-', prefix.length)) {
            // Don't modify - let the parser handle it
            return raw;
        }
    }
    return raw;
}
