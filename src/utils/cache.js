"use strict";
// src/utils/cache.ts
// Persistent cache helpers for Garur JIT - includes automatic migration to normalized absolute POSIX keys.
// Exports:
// - type GarurCache
// - loadCache(), saveCache()
// - hasFileChanged(cache, normPath, content), updateFileHash(cache, normPath, content)
// - addFileClasses(cache, normPath, classes), removeFileFromCache(cache, normPath)
// - getAllCachedClasses(cache)
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
exports.normalizePathForCache = normalizePathForCache;
exports.loadCache = loadCache;
exports.saveCache = saveCache;
exports.hasFileChanged = hasFileChanged;
exports.updateFileHash = updateFileHash;
exports.addFileClasses = addFileClasses;
exports.removeFileFromCache = removeFileFromCache;
exports.getAllCachedClasses = getAllCachedClasses;
exports.clearCache = clearCache;
exports.getCachedFiles = getCachedFiles;
exports.hasClass = hasClass;
exports.removeClass = removeClass;
var fs_1 = require("fs");
var path_1 = require("path");
var CACHE_PATHS = [
    path_1.default.resolve(process.cwd(), "dist", ".garur-cache.json"),
    path_1.default.resolve(process.cwd(), ".garur-cache.json"),
];
var CURRENT_VERSION = 2;
/** Normalize path: absolute, posix separators, no trailing slash */
function normalizePathForCache(p) {
    if (!p)
        return p;
    var abs = path_1.default.isAbsolute(p) ? p : path_1.default.resolve(process.cwd(), p);
    var posix = abs.split(path_1.default.sep).join(path_1.default.posix.sep);
    return posix.replace(/\/+$/, "");
}
function readFirstExisting(paths) {
    for (var _i = 0, paths_1 = paths; _i < paths_1.length; _i++) {
        var p = paths_1[_i];
        try {
            if (fs_1.default.existsSync(p))
                return { path: p, data: fs_1.default.readFileSync(p, "utf-8") };
        }
        catch ( /* ignore */_a) { /* ignore */ }
    }
    return null;
}
function loadCache() {
    var found = readFirstExisting(CACHE_PATHS);
    if (!found) {
        return { version: CURRENT_VERSION, files: {}, classes: {} };
    }
    try {
        var raw = JSON.parse(found.data || "{}");
        // Ensure top-level shape
        var filesRaw = raw.files || {};
        var classesRaw = raw.classes || {};
        // Normalize and migrate file entries:
        var normalizedFiles = {};
        for (var _i = 0, _a = Object.keys(filesRaw); _i < _a.length; _i++) {
            var key = _a[_i];
            var normKey = normalizePathForCache(key);
            var entry = filesRaw[key];
            // If entry is a plain string, it's likely an old-style hash -> migrate to object
            if (typeof entry === "string") {
                normalizedFiles[normKey] = { hash: entry, classes: [] };
                continue;
            }
            // If entry is an object but missing expected fields, coerce safely
            if (entry && typeof entry === "object") {
                var hash = typeof entry.hash === "string" ? entry.hash : undefined;
                // ensure classes is string[]
                var classes = [];
                if (Array.isArray(entry.classes)) {
                    classes = entry.classes
                        .filter(function (c) { return typeof c === "string"; })
                        .map(function (c) { return c; })
                        .reduce(function (acc, cur) {
                        if (!acc.includes(cur))
                            acc.push(cur);
                        return acc;
                    }, []);
                }
                normalizedFiles[normKey] = { hash: hash, classes: classes };
                continue;
            }
            // Fallback: empty object
            normalizedFiles[normKey] = { classes: [] };
        }
        var cache = {
            version: raw.version || 1,
            files: normalizedFiles,
            classes: classesRaw || {},
        };
        // If version < CURRENT_VERSION, persist migration
        if ((cache.version || 1) < CURRENT_VERSION) {
            cache.version = CURRENT_VERSION;
            try {
                saveCache(cache);
            }
            catch ( /* ignore */_b) { /* ignore */ }
        }
        return cache;
    }
    catch (e) {
        // Broken cache -> return fresh
        return { version: CURRENT_VERSION, files: {}, classes: {} };
    }
}
function saveCache(cache) {
    var out = JSON.stringify(cache, null, 2);
    var target = CACHE_PATHS[0];
    try {
        var dir = path_1.default.dirname(target);
        if (!fs_1.default.existsSync(dir))
            fs_1.default.mkdirSync(dir, { recursive: true });
        fs_1.default.writeFileSync(target, out, "utf-8");
    }
    catch (e) {
        try {
            fs_1.default.writeFileSync(path_1.default.resolve(process.cwd(), ".garur-cache.json"), out, "utf-8");
        }
        catch ( /* ignore */_a) { /* ignore */ }
    }
}
function hasFileChanged(cache, normPath, content) {
    if (!cache.files)
        return true;
    var entry = cache.files[normPath];
    if (!entry)
        return true;
    // entry might be object (expected) or string (legacy) — handle both
    var hash = typeof entry === "string" ? entry : (entry && entry.hash);
    var newHash = hashString(content);
    return hash !== newHash;
}
function updateFileHash(cache, normPath, content) {
    var newHash = hashString(content);
    cache.files = cache.files || {};
    var existing = cache.files[normPath];
    // If existing is a legacy string, replace it with object
    if (typeof existing === "string" || !existing) {
        cache.files[normPath] = { hash: newHash, classes: [] };
        return;
    }
    // Ensure object shape and set hash
    cache.files[normPath].hash = newHash;
    cache.files[normPath].classes = cache.files[normPath].classes || [];
}
// In cache.ts - enhance addFileClasses
function addFileClasses(cache, normPath, classes) {
    cache.files = cache.files || {};
    var existing = cache.files[normPath];
    // Ensure we have a proper object structure
    if (typeof existing === "string") {
        // Migrate from legacy string format to object
        cache.files[normPath] = {
            hash: existing,
            classes: Array.from(new Set(classes))
        };
        return;
    }
    if (!existing) {
        cache.files[normPath] = {
            classes: Array.from(new Set(classes))
        };
        return;
    }
    // Merge and dedupe classes
    var prev = existing.classes || [];
    var allClasses = Array.from(new Set(__spreadArray(__spreadArray([], prev, true), classes, true)));
    existing.classes = allClasses;
    cache.files[normPath] = existing;
}
// src/utils/cache.ts
// In cache.ts - completely rewrite removeFileFromCache
function removeFileFromCache(cache, normPath) {
    if (!cache.files || !cache.files[normPath])
        return;
    // Get ALL classes that were associated with this file
    var fileEntry = cache.files[normPath];
    var classesToRemove = new Set();
    if (typeof fileEntry === 'string') {
        // Legacy format - we need to scan ALL files to find orphaned classes
        // This is a fallback for corrupted cache
    }
    else {
        // Add all tracked classes from this file
        (fileEntry.classes || []).forEach(function (c) { return classesToRemove.add(c); });
    }
    // Remove the file entry
    delete cache.files[normPath];
    // If we have classes to remove, check if they're used by other files
    if (classesToRemove.size > 0 && cache.classes) {
        // Build set of all classes still referenced by REMAINING files
        var remainingClasses_1 = new Set();
        for (var _i = 0, _a = Object.entries(cache.files); _i < _a.length; _i++) {
            var _b = _a[_i], filePath = _b[0], fileData = _b[1];
            if (!fileData)
                continue;
            if (typeof fileData === 'string') {
                // Can't get classes from legacy format - skip
                continue;
            }
            (fileData.classes || []).forEach(function (c) { return remainingClasses_1.add(c); });
        }
        // Remove orphaned classes
        for (var _c = 0, classesToRemove_1 = classesToRemove; _c < classesToRemove_1.length; _c++) {
            var cls = classesToRemove_1[_c];
            if (!remainingClasses_1.has(cls) && cache.classes[cls]) {
                delete cache.classes[cls];
            }
        }
    }
    // Additional safety: if we couldn't track classes properly,
    // do a full scan to find orphaned classes
    if (classesToRemove.size === 0 && cache.classes) {
        var allReferencedClasses = getAllReferencedClasses(cache);
        for (var _d = 0, _e = Object.keys(cache.classes); _d < _e.length; _d++) {
            var cls = _e[_d];
            if (!allReferencedClasses.has(cls)) {
                delete cache.classes[cls];
            }
        }
    }
}
// Add this helper function to cache.ts
function getAllReferencedClasses(cache) {
    var allClasses = new Set();
    if (!cache.files)
        return allClasses;
    for (var _i = 0, _a = Object.values(cache.files); _i < _a.length; _i++) {
        var fileData = _a[_i];
        if (!fileData)
            continue;
        if (typeof fileData === 'object' && fileData.classes) {
            fileData.classes.forEach(function (c) { return allClasses.add(c); });
        }
    }
    return allClasses;
}
function getAllCachedClasses(cache) {
    return Object.keys(cache.classes || {});
}
/** Clear the entire cache and start fresh */
function clearCache() {
    var freshCache = {
        version: CURRENT_VERSION,
        files: {},
        classes: {}
    };
    saveCache(freshCache);
    return freshCache;
}
/** Get all files currently in the cache */
function getCachedFiles(cache) {
    return Object.keys(cache.files || {});
}
/** Check if a specific class exists in the cache */
function hasClass(cache, className) {
    return className in (cache.classes || {});
}
/** Remove a specific class from the cache */
function removeClass(cache, className) {
    if (cache.classes && cache.classes[className]) {
        delete cache.classes[className];
    }
}
/** Simple stable hash for content (FNV-like) - lightweight */
function hashString(s) {
    var h = 2166136261 >>> 0;
    for (var i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 16777619) >>> 0;
    }
    return h.toString(16);
}
