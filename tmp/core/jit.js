// src/jit.ts - OPTIMIZED BUT COMPLETE
// ugh 3am... this file is getting too big
import fs from "fs";
import * as glob from "fast-glob";
import path from "path";
import crypto from "crypto";
import { mergeComponent } from "./marge"; // TODO: fix typo later
import { build } from "./builder";
import { allComponents, enhancedAnimations } from "../components";
import { loadCache, saveCache, normalizePathForCache, pruneCache, removeFileFromCache, } from "../utils/cache";
import configDefault from "../config/garur.config";
const DIST = path.resolve(process.cwd(), "dist");
const OUT = path.join(DIST, "garur.css");
const OUT_MIN = path.join(DIST, "garur.min.css");
// ==================== OPTIMIZED CACHES ====================
// trying to make this faster but brain is mush
/** OPTIMIZED: Fast class extraction */
const extractorCache = new Map();
const MAX_EXTRACTOR_CACHE_SIZE = 500;
export function extractClassesFromContent(content) {
    if (!content || content.length < 10)
        return [];
    // Cache key strategy
    const cacheKey = content.length > 10000
        ? crypto.createHash('md5').update(content).digest('hex').slice(0, 12)
        : content;
    const cached = extractorCache.get(cacheKey);
    if (cached)
        return cached;
    const results = new Set();
    // Original regex for ACCURACY (don't break this pls)
    const classPattern = /(?:class|className|data-garur)\s*=\s*(?:"([^"]+)"|'([^']+)'|`([^`]+)`|\{["']([^"']+)["']\}|\{`([^`]+)`\})/g;
    let match;
    while ((match = classPattern.exec(content)) !== null) {
        // Get the first non-empty capturing group
        let classString = '';
        for (let i = 1; i <= 5; i++) {
            if (match[i]) {
                classString = match[i];
                break;
            }
        }
        if (!classString)
            continue;
        // Fast splitting algorithm (keeps accuracy)
        let start = 0;
        let inClass = false;
        for (let i = 0; i <= classString.length; i++) {
            const char = classString[i];
            const isWhitespace = char === ' ' || char === '\t' || char === '\n' || i === classString.length;
            if (isWhitespace && inClass) {
                const cls = classString.slice(start, i).trim();
                if (cls && cls.length > 0) {
                    results.add(cls);
                }
                inClass = false;
            }
            else if (!isWhitespace && !inClass) {
                start = i;
                inClass = true;
            }
        }
    }
    // Handle template literals with interpolations (ACCURATE)
    const templatePattern = /(?:class|className)=\{`([^`]+)`\}/g;
    while ((match = templatePattern.exec(content)) !== null) {
        const classString = match[1];
        const cleaned = classString.replace(/\$\{[^}]*\}/g, ' ');
        if (cleaned.trim()) {
            const classes = cleaned.split(/\s+/).filter(Boolean);
            for (const cls of classes) {
                results.add(cls);
            }
        }
    }
    const result = Array.from(results);
    // Cache management
    if (extractorCache.size >= MAX_EXTRACTOR_CACHE_SIZE) {
        const keys = Array.from(extractorCache.keys());
        const toRemove = Math.floor(MAX_EXTRACTOR_CACHE_SIZE * 0.3);
        for (let i = 0; i < toRemove && i < keys.length; i++) {
            extractorCache.delete(keys[i]);
        }
    }
    extractorCache.set(cacheKey, result);
    return result;
}
/** OPTIMIZED: Rule parser */
const rulePartsCache = new Map();
const MAX_RULE_CACHE_SIZE = 800;
function extractRuleParts(rule) {
    const cached = rulePartsCache.get(rule);
    if (cached)
        return cached;
    const r = rule.trim();
    let media = null;
    let inner = r;
    if (r.startsWith('@media')) {
        const openBrace = r.indexOf('{');
        if (openBrace !== -1) {
            media = r.slice(6, openBrace).trim().replace(/^\(|\)$/g, '');
            inner = r.slice(openBrace + 1, -1).trim();
        }
    }
    // Find the main selector block (handles nested rules)
    let braceCount = 0;
    let mainSelectorEnd = -1;
    for (let i = 0; i < inner.length; i++) {
        const char = inner[i];
        if (char === '{') {
            braceCount++;
            if (braceCount === 1 && mainSelectorEnd === -1) {
                mainSelectorEnd = i;
            }
        }
        else if (char === '}') {
            braceCount--;
        }
    }
    let selector = '';
    let decl = '';
    if (mainSelectorEnd !== -1) {
        selector = inner.slice(0, mainSelectorEnd).trim();
        // Get everything between the first { and matching }
        let declStart = mainSelectorEnd + 1;
        let declEnd = inner.length;
        braceCount = 0;
        for (let i = declStart; i < inner.length; i++) {
            const char = inner[i];
            if (char === '{')
                braceCount++;
            else if (char === '}') {
                if (braceCount === 0) {
                    declEnd = i;
                    break;
                }
                braceCount--;
            }
        }
        decl = inner.slice(declStart, declEnd).trim();
    }
    const result = { media, selector, decl };
    if (rulePartsCache.size >= MAX_RULE_CACHE_SIZE) {
        const firstKey = rulePartsCache.keys().next().value;
        if (firstKey)
            rulePartsCache.delete(firstKey);
    }
    rulePartsCache.set(rule, result);
    return result;
}
/** Breakpoints from config */
const breakpointConfig = configDefault.breakpoints || {};
const breakpointKeys = Object.keys(breakpointConfig);
const variantSet = new Set(['hover', 'focus', 'active', 'disabled', 'dark', 'light']);
const variantParserCache = new Map();
const MAX_VARIANT_CACHE_SIZE = 1500;
function parseClassWithVariants(cls) {
    const cached = variantParserCache.get(cls);
    if (cached)
        return cached;
    const parts = cls.split(':');
    const baseClass = parts.pop() || '';
    const breakpoints = [];
    const variants = [];
    if (parts.length > 0) {
        for (const part of parts) {
            if (breakpointKeys.includes(part)) {
                breakpoints.push(part);
            }
            else if (variantSet.has(part)) {
                variants.push(part);
            }
            else {
                // Check prefixes (important for custom variants)
                if (part.startsWith('sm-') && breakpointKeys.includes('sm')) {
                    breakpoints.push('sm');
                }
                else if (part.startsWith('md-') && breakpointKeys.includes('md')) {
                    breakpoints.push('md');
                }
                else if (part.startsWith('lg-') && breakpointKeys.includes('lg')) {
                    breakpoints.push('lg');
                }
                else if (part.startsWith('xl-') && breakpointKeys.includes('xl')) {
                    breakpoints.push('xl');
                }
                else {
                    variants.push(part); // Custom variants
                }
            }
        }
    }
    const result = { breakpoints, variants, baseClass };
    if (variantParserCache.size >= MAX_VARIANT_CACHE_SIZE) {
        const firstKey = variantParserCache.keys().next().value;
        if (firstKey)
            variantParserCache.delete(firstKey);
    }
    variantParserCache.set(cls, result);
    return result;
}
/** OPTIMIZED: Build CSS with parallel processing (KEEPS ALL FUNCTIONALITY) */
async function buildCssFromCacheAndFiles(files, cache, stats) {
    const referencedClasses = new Set();
    // Fast file scanning with batches
    const BATCH_SIZE = 200;
    const fileCount = files.length;
    for (let batchStart = 0; batchStart < fileCount; batchStart += BATCH_SIZE) {
        const batchEnd = Math.min(batchStart + BATCH_SIZE, fileCount);
        const batchPromises = [];
        for (let i = batchStart; i < batchEnd; i++) {
            const file = files[i];
            batchPromises.push(Promise.resolve().then(() => {
                try {
                    const content = fs.readFileSync(file, "utf-8");
                    const classes = extractClassesFromContent(content);
                    for (const cls of classes) {
                        referencedClasses.add(cls);
                    }
                }
                catch (error) {
                    // Silent fail for speed
                }
            }));
        }
        await Promise.all(batchPromises);
    }
    if (referencedClasses.size === 0) {
        return "";
    }
    const dedupeMap = new Map();
    const order = [];
    const componentClasses = Object.keys(allComponents);
    const isComponent = new Set(componentClasses);
    // Process classes
    const referencedArray = Array.from(referencedClasses);
    const cacheClasses = cache.classes || {};
    // Separate utilities and components (preserves component functionality)
    const utilities = [];
    const components = [];
    for (const cls of referencedArray) {
        if (isComponent.has(cls)) {
            components.push(cls);
        }
        else {
            utilities.push(cls);
        }
    }
    // Process utilities in chunks
    const UTILITY_CHUNK_SIZE = 500;
    for (let i = 0; i < utilities.length; i += UTILITY_CHUNK_SIZE) {
        const chunk = utilities.slice(i, i + UTILITY_CHUNK_SIZE);
        const chunkPromises = chunk.map(cls => Promise.resolve().then(() => {
            let rule = null;
            if (cacheClasses[cls]) {
                rule = cacheClasses[cls];
                if (stats)
                    stats.cacheHits++;
                return { cls, rule };
            }
            else {
                try {
                    rule = build(cls); // IMPORTANT: Uses original builder
                    if (rule) {
                        cacheClasses[cls] = rule;
                        if (stats)
                            stats.cacheMisses++;
                    }
                }
                catch {
                    rule = null;
                }
                return { cls, rule };
            }
        }));
        const chunkResults = await Promise.all(chunkPromises);
        for (const { rule } of chunkResults) {
            if (!rule)
                continue;
            const { media, selector, decl } = extractRuleParts(rule);
            if (!decl)
                continue;
            const key = media ? `${media}::${decl}` : `::${decl}`;
            let entry = dedupeMap.get(key);
            if (!entry) {
                entry = { selectors: [selector], decl, media };
                dedupeMap.set(key, entry);
                order.push(key);
            }
            else if (!entry.selectors.includes(selector)) {
                entry.selectors.push(selector);
            }
        }
    }
    // Process components (preserves component merging functionality)
    for (const cls of components) {
        try {
            const compCSS = mergeComponent([cls]); // IMPORTANT: Uses original mergeComponent
            if (!compCSS)
                continue;
            // Split CSS into rules (accurate parsing)
            const rules = [];
            let currentRule = '';
            let braceCount = 0;
            for (let i = 0; i < compCSS.length; i++) {
                const char = compCSS[i];
                currentRule += char;
                if (char === '{')
                    braceCount++;
                else if (char === '}') {
                    braceCount--;
                    if (braceCount === 0) {
                        rules.push(currentRule.trim());
                        currentRule = '';
                    }
                }
            }
            for (const rule of rules) {
                if (!rule)
                    continue;
                const { media, selector, decl } = extractRuleParts(rule);
                if (!decl)
                    continue;
                const key = media ? `${media}::${decl}` : `::${decl}`;
                let entry = dedupeMap.get(key);
                if (!entry) {
                    entry = { selectors: [selector], decl, media };
                    dedupeMap.set(key, entry);
                    order.push(key);
                }
                else if (!entry.selectors.includes(selector)) {
                    entry.selectors.push(selector);
                }
            }
        }
        catch {
            continue;
        }
    }
    // Update cache
    cache.classes = cacheClasses;
    // Build CSS output (preserves media query order and formatting)
    const mediaBlocks = new Map();
    const baseBlocks = [];
    for (const key of order) {
        const entry = dedupeMap.get(key);
        if (!entry || entry.selectors.length === 0)
            continue;
        const formattedDecl = entry.decl
            .split(';')
            .filter(Boolean)
            .map(line => `  ${line.trim()};`)
            .join('\n');
        const block = `${entry.selectors.join(',\n')} {\n${formattedDecl}\n}`;
        if (entry.media) {
            let blocks = mediaBlocks.get(entry.media);
            if (!blocks) {
                blocks = [];
                mediaBlocks.set(entry.media, blocks);
            }
            blocks.push(block);
        }
        else {
            baseBlocks.push(block);
        }
    }
    // Clear dedupeMap to free memory
    dedupeMap.clear();
    // Assemble final CSS with proper ordering
    const cssParts = [];
    // Base blocks first
    if (baseBlocks.length > 0) {
        cssParts.push(baseBlocks.join('\n\n'));
    }
    // Media queries in breakpoint order (important for specificity)
    for (const bp of breakpointKeys) {
        const blocks = mediaBlocks.get(bp);
        if (blocks && blocks.length > 0) {
            cssParts.push(`@media (min-width: ${breakpointConfig[bp]}) {`);
            cssParts.push(blocks.join('\n\n'));
            cssParts.push('}');
            mediaBlocks.delete(bp);
        }
    }
    // Remaining media queries (custom media queries, prefers-color-scheme, etc.)
    for (const [media, blocks] of mediaBlocks.entries()) {
        if (blocks.length > 0) {
            cssParts.push(`@media (${media}) {`);
            cssParts.push(blocks.join('\n\n'));
            cssParts.push('}');
        }
    }
    return cssParts.join('\n\n');
}
/** Minifier (keeps accuracy) */
function minifyCss(css) {
    let result = '';
    let inComment = false;
    let inSingleQuote = false;
    let inDoubleQuote = false;
    let lastChar = '';
    for (let i = 0; i < css.length; i++) {
        const char = css[i];
        const nextChar = i + 1 < css.length ? css[i + 1] : '';
        // Handle comments
        if (!inSingleQuote && !inDoubleQuote && char === '/' && nextChar === '*') {
            inComment = true;
            i++;
            continue;
        }
        if (inComment && char === '*' && nextChar === '/') {
            inComment = false;
            i++;
            continue;
        }
        if (inComment)
            continue;
        // Handle quotes
        if (char === "'" && !inDoubleQuote && lastChar !== '\\') {
            inSingleQuote = !inSingleQuote;
        }
        else if (char === '"' && !inSingleQuote && lastChar !== '\\') {
            inDoubleQuote = !inDoubleQuote;
        }
        // Remove whitespace but keep important ones
        if (!inSingleQuote && !inDoubleQuote) {
            if (char === ' ' || char === '\t' || char === '\n' || char === '\r') {
                // Only add space if needed
                if (lastChar && lastChar !== ' ' && lastChar !== '{' && lastChar !== ';' && lastChar !== ':') {
                    if (nextChar && nextChar !== ' ' && nextChar !== '}' && nextChar !== ';' && nextChar !== ':') {
                        result += ' ';
                        lastChar = ' ';
                    }
                }
                continue;
            }
            // Remove unnecessary semicolons
            if (char === ';' && (nextChar === '}' || nextChar === ' ')) {
                result += ';';
                lastChar = ';';
                continue;
            }
        }
        result += char;
        lastChar = char;
    }
    return result.trim();
}
/** Cached preflight loading */
let preflightCache = null;
function loadPreflightFile() {
    if (preflightCache !== null)
        return preflightCache;
    try {
        const PREFLIGHT_PATH = path.resolve(__dirname, "preflight.css");
        if (fs.existsSync(PREFLIGHT_PATH)) {
            preflightCache = fs.readFileSync(PREFLIGHT_PATH, "utf-8").trim() + "\n\n";
        }
        else {
            preflightCache = "";
        }
    }
    catch {
        preflightCache = "";
    }
    return preflightCache;
}
/** OPTIMIZED: Full JIT build with all functionality */
export async function runJIT(globPattern = ["**/*.{html,ts,js,jsx,tsx}"]) {
    const startTime = performance.now();
    const startMemory = process.memoryUsage().heapUsed;
    const stats = {
        cacheHits: 0,
        cacheMisses: 0
    };
    // Load cache
    const cache = loadCache();
    const pruned = pruneCache(cache);
    if (pruned > 0) {
        console.log(`🧹 Pruned ${pruned} stale cache entries`);
    }
    // Clean memory
    cleanupMemoryCaches();
    // File exclusion (balanced for speed and coverage)
    const filesRelative = await glob.default(globPattern, {
        ignore: [
            // Core exclusions
            'node_modules/**',
            'dist/**',
            '.git/**',
            '**/.next/**',
            '**/.nuxt/**',
            '**/build/**',
            '**/out/**',
            '**/.output/**',
            // Test files
            '**/*.test.*',
            '**/*.spec.*',
            '**/__tests__/**',
            '**/__mocks__/**',
            '**/*.test',
            '**/*.spec',
            '**/*.snap',
            '**/coverage/**',
            // Build artifacts
            '**/*.map',
            '**/*.d.ts',
            '**/*.min.*',
            '**/*.bundle.*',
            // Documentation
            '**/docs/**',
            '**/*.md',
            '**/*.mdx',
            // Config files
            '**/config/**',
            '**/*.config.*',
            '**/*.conf',
            // Logs and temp files
            '**/*.log',
            '**/.tmp/**',
            '**/tmp/**',
            '**/.cache/**',
            // Platform-specific
            '**/.vercel/**',
            '**/.netlify/**',
            '**/.github/**',
            '**/.vscode/**',
            '**/.idea/**',
            // Large binary assets (but keep source assets)
            '**/public/**/*.{jpg,jpeg,png,gif,svg,ico,webp,mp4,webm,mp3,wav}',
            '**/static/**/*.{jpg,jpeg,png,gif,svg,ico,webp,mp4,webm,mp3,wav}',
            '**/assets/**/*.{jpg,jpeg,png,gif,svg,ico,webp,mp4,webm,mp3,wav}',
            // Lock files
            '**/package-lock.json',
            '**/yarn.lock',
            '**/pnpm-lock.yaml',
            ...(configDefault.jit?.ignore || [])
        ],
        caseSensitiveMatch: false,
        followSymbolicLinks: false,
        onlyFiles: true,
        deep: 5, // Balanced depth
        absolute: false,
    });
    console.log(`📁 Found ${filesRelative.length} files`);
    // Apply size filtering only if needed
    let files = filesRelative.map(f => path.resolve(process.cwd(), f));
    if (files.length > 1500) {
        console.log("📏 Applying size filtering...");
        const filteredFiles = [];
        for (const file of files) {
            try {
                const stats = fs.statSync(file);
                // Skip files larger than 300KB (reasonable for source files)
                if (stats.size < 300 * 1024) {
                    filteredFiles.push(file);
                }
            }
            catch {
                // Skip if can't stat
            }
        }
        files = filteredFiles;
        console.log(`📏 Filtered to ${files.length} files`);
    }
    // Track classes
    const counts = new Map();
    const allCurrentClasses = new Set();
    const componentKeys = Object.keys(allComponents);
    // Batch processing
    const BATCH_SIZE = Math.min(200, files.length);
    let processedFiles = 0;
    for (let i = 0; i < files.length; i += BATCH_SIZE) {
        const batch = files.slice(i, i + BATCH_SIZE);
        const batchPromises = batch.map(file => Promise.resolve().then(() => {
            try {
                if (!fs.existsSync(file)) {
                    removeFileFromCache(cache, file);
                    return;
                }
                const content = fs.readFileSync(file, "utf-8");
                const classes = extractClassesFromContent(content);
                for (const cls of classes) {
                    allCurrentClasses.add(cls);
                    counts.set(cls, (counts.get(cls) || 0) + 1);
                }
                // Update cache
                const norm = normalizePathForCache(file);
                cache.files = cache.files || {};
                cache.files[norm] = {
                    hash: crypto.createHash('md5').update(content).digest('hex'),
                    classes: Array.from(new Set(classes)),
                    timestamp: Date.now()
                };
                processedFiles++;
            }
            catch {
                // Silent fail
            }
        }));
        await Promise.all(batchPromises);
        // Clean memory periodically
        if (processedFiles % 1000 === 0) {
            cleanupMemoryCaches();
        }
    }
    // Remove orphaned classes
    if (cache.classes) {
        const cacheClassKeys = Object.keys(cache.classes);
        let removedCount = 0;
        for (const cls of cacheClassKeys) {
            if (!allCurrentClasses.has(cls) && !componentKeys.includes(cls)) {
                delete cache.classes[cls];
                removedCount++;
            }
        }
        if (removedCount > 0) {
            console.log(`🗑️  Removed ${removedCount} orphaned classes`);
        }
    }
    // Build CSS (main functionality preserved)
    let css = await buildCssFromCacheAndFiles(files, cache, stats);
    // Inject animations (preserves animation functionality)
    if (enhancedAnimations && typeof enhancedAnimations === "string") {
        const animTrimmed = enhancedAnimations.trim();
        if (animTrimmed) {
            css = `${css}\n\n/* 🌟 ENHANCED ANIMATIONS */\n${animTrimmed}`;
        }
    }
    // Inject Preflight
    const preflightFile = loadPreflightFile();
    if (preflightFile) {
        css = `${preflightFile}${css}`;
    }
    // Write outputs
    const finalMin = minifyCss(css);
    if (!fs.existsSync(DIST)) {
        fs.mkdirSync(DIST, { recursive: true });
    }
    try {
        await Promise.all([
            fs.promises.writeFile(OUT, css, "utf-8"),
            fs.promises.writeFile(OUT_MIN, finalMin, "utf-8")
        ]);
    }
    catch (error) {
        console.error('Failed to write CSS files:', error);
        throw error;
    }
    // Save cache
    saveCache(cache);
    // Clear memory
    cleanupMemory();
    // Calculate stats
    const endTime = performance.now();
    const endMemory = process.memoryUsage().heapUsed;
    const uniqueClasses = counts.size;
    const uniqueUtilities = Array.from(counts.keys())
        .filter(c => !componentKeys.includes(c)).length;
    const classOccurrences = Array.from(counts.values())
        .reduce((a, b) => a + b, 0);
    const cssBytes = Buffer.byteLength(css, "utf-8");
    // Top classes
    const top = Array.from(counts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([cls, count]) => ({ cls, count }));
    const memoryDelta = (endMemory - startMemory) / 1024 / 1024;
    const resultStats = {
        filesScanned: files.length,
        classOccurrences,
        uniqueClasses,
        uniqueUtilities,
        cssBytes,
        topClasses: top,
        buildTimeMs: Math.round(endTime - startTime),
        memoryUsageMB: Math.round(memoryDelta * 100) / 100,
        cacheHits: stats.cacheHits,
        cacheMisses: stats.cacheMisses,
        cacheSize: Object.keys(cache.classes || {}).length,
    };
    // Performance summary
    console.log(`\n⚡ Build completed in ${resultStats.buildTimeMs}ms`);
    console.log(`📊 ${files.length} files, ${uniqueClasses} classes, ${(cssBytes / 1024).toFixed(1)}KB CSS`);
    console.log(`🧠 Memory: ${resultStats.memoryUsageMB}MB`);
    console.log(`💾 Cache: ${stats.cacheHits} hits, ${stats.cacheMisses} misses`);
    return resultStats;
}
/** OPTIMIZED incremental build */
export async function runJITIncremental(changedFiles, deletedFiles = []) {
    const startTime = performance.now();
    const cache = loadCache();
    // Process changed files
    for (const file of changedFiles) {
        try {
            if (!fs.existsSync(file)) {
                removeFileFromCache(cache, file);
                continue;
            }
            const content = fs.readFileSync(file, "utf-8");
            const classes = extractClassesFromContent(content);
            const norm = normalizePathForCache(file);
            cache.files = cache.files || {};
            cache.files[norm] = {
                hash: crypto.createHash('md5').update(content).digest('hex'),
                classes: Array.from(new Set(classes)),
                timestamp: Date.now()
            };
        }
        catch {
            // Silent fail
        }
    }
    // Remove deleted files
    for (const file of deletedFiles) {
        removeFileFromCache(cache, file);
    }
    // Get all files from cache
    const allFiles = [];
    const cacheFiles = cache.files || {};
    for (const [relativePath] of Object.entries(cacheFiles)) {
        try {
            const fullPath = path.resolve(process.cwd(), relativePath);
            if (fs.existsSync(fullPath)) {
                allFiles.push(fullPath);
            }
            else {
                removeFileFromCache(cache, relativePath);
            }
        }
        catch {
            // Skip
        }
    }
    // Build CSS
    const css = await buildCssFromCacheAndFiles(allFiles, cache);
    // Write output
    const finalMin = minifyCss(css);
    if (!fs.existsSync(DIST)) {
        fs.mkdirSync(DIST, { recursive: true });
    }
    await Promise.all([
        fs.promises.writeFile(OUT, css, "utf-8"),
        fs.promises.writeFile(OUT_MIN, finalMin, "utf-8")
    ]);
    saveCache(cache);
    const buildTime = Math.round(performance.now() - startTime);
    console.log(`⚡ Incremental build in ${buildTime}ms`);
    return { filesScanned: allFiles.length, buildTimeMs: buildTime };
}
/** Memory cleanup */
export function cleanupMemoryCaches() {
    if (extractorCache.size > MAX_EXTRACTOR_CACHE_SIZE * 0.5) {
        const keys = Array.from(extractorCache.keys());
        const toRemove = Math.floor(keys.length * 0.3);
        for (let i = 0; i < toRemove && i < keys.length; i++) {
            extractorCache.delete(keys[i]);
        }
    }
    if (rulePartsCache.size > MAX_RULE_CACHE_SIZE * 0.5) {
        const firstKey = rulePartsCache.keys().next().value;
        if (firstKey)
            rulePartsCache.delete(firstKey);
    }
    if (variantParserCache.size > MAX_VARIANT_CACHE_SIZE * 0.5) {
        const firstKey = variantParserCache.keys().next().value;
        if (firstKey)
            variantParserCache.delete(firstKey);
    }
}
/** Full cleanup */
export function cleanupMemory() {
    extractorCache.clear();
    rulePartsCache.clear();
    variantParserCache.clear();
    preflightCache = null;
    if (global.gc) {
        global.gc();
    }
}
