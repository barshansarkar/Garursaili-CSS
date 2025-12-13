import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
// ---------- constants (I swear this is fine) -----------
const CURRENT_VERSION = 1;
// idk why there are 3 cache paths but apparently "we need them"
const CACHE_PATHS = [
    path.resolve(process.cwd(), "dist", ".garur-cache.json"),
    path.resolve(process.cwd(), ".garur-cache.json"),
    path.resolve(process.cwd(), "node_modules", ".cache", "garur", "cache.json"),
];
// fresh start fallback thing
const DEFAULT_CACHE = {
    version: CURRENT_VERSION,
    files: {},
    classes: {},
    meta: {
        lastBuild: 0,
        totalClasses: 0,
        totalFiles: 0,
    },
};
// ------------------------------------------------------
// normalizePathForCache
// ------------------------------------------------------
// ok so this tries to make file paths not explode
// this thing broke like 4 times so DO NOT touch any of it I beg you
// ------------------------------------------------------
export function normalizePathForCache(filePath) {
    if (!filePath || filePath.trim() === "") {
        // returning empty feels wrong but removing it broke everything sooo
        return "";
    }
    try {
        // absolute? idk, this resolves it anyway
        let absPath = path.isAbsolute(filePath)
            ? path.resolve(filePath)
            : path.resolve(process.cwd(), filePath);
        let posixPath = absPath.split(path.sep).join("/");
        // trailing slashes caused pain
        posixPath = posixPath.replace(/\/+$/, "");
        if (process.platform === "win32") {
            posixPath = posixPath.toLowerCase();
        }
        return posixPath;
    }
    catch (err) {
        console.warn("path normalization blew up but I'm just gonna cope:", filePath, err);
        return filePath.replace(/\\/g, "/").replace(/\/+$/, "");
    }
}
// ------------------------------------------------------
// yep hashing… pls god work
// ------------------------------------------------------
export function hashString(content) {
    // why 32? idk someone said it's "enough"
    return crypto.createHash("sha256")
        .update(content)
        .digest("hex")
        .slice(0, 32);
}
// --------------------------------------------------------
// getFileInfo
// reads file + stats. simple. except when it isn't.
// broke once because file disappeared mid-build lol
// ------------------------------------------------------
export function getFileInfo(filePath) {
    try {
        const s = fs.statSync(filePath);
        const c = fs.readFileSync(filePath, "utf-8");
        return {
            hash: hashString(c),
            size: s.size,
            mtime: s.mtimeMs
        };
    }
    catch (err) {
        // I cannot emotionally handle another crash so null is fine
        return null;
    }
}
// ------------------------------------------------------
// findCacheFile
// tries all the paths and picks first that exists
// (kind of like choosing the least broken one at 3am)
// ------------------------------------------------------
function findCacheFile() {
    for (const p of CACHE_PATHS) {
        try {
            if (fs.existsSync(p))
                return p;
        }
        catch { }
    }
    return null;
}
// ------------------------------------------------------
// getWriteCachePath
// I *think* this chooses the "best" place to store the cache
// do not "clean this up" — it WILL break
// ------------------------------------------------------
function getWriteCachePath() {
    const p = CACHE_PATHS[0];
    const dir = path.dirname(p);
    try {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        return p;
    }
    catch {
        // welp fallback time
        return CACHE_PATHS[1];
    }
}
// ------------------------------------------------------
// loadCache
// loads + migrates + validates + prays
// I added try/catch because I got tired of things exploding
// ------------------------------------------------------
export function loadCache() {
    const fp = findCacheFile();
    if (!fp) {
        return { ...DEFAULT_CACHE };
    }
    try {
        const raw = JSON.parse(fs.readFileSync(fp, "utf-8"));
        const migrated = migrateCache(raw);
        const valid = validateCache(migrated);
        // refreshing metadata because someone said it's "helpful"??
        valid.meta = {
            lastBuild: valid.meta?.lastBuild || Date.now(),
            totalClasses: Object.keys(valid.classes).length,
            totalFiles: Object.keys(valid.files).length,
            buildTime: valid.meta?.buildTime
        };
        return valid;
    }
    catch (err) {
        console.warn("cache corrupted AGAIN great. starting fresh:", err);
        return { ...DEFAULT_CACHE };
    }
}
// ------------------------------------------------------
// saveCache
// This is the scariest function in the entire file.
// Every time I touched it, something broke elsewhere.
// So if you think “oh I can clean this” → NO YOU CAN’T.
// ------------------------------------------------------
export function saveCache(cache) {
    try {
        const valid = validateCache(cache);
        valid.version = CURRENT_VERSION;
        valid.meta = {
            ...valid.meta,
            lastBuild: Date.now(),
            totalClasses: Object.keys(valid.classes).length,
            totalFiles: Object.keys(valid.files).length,
        };
        const dest = getWriteCachePath();
        const tmp = dest + ".tmp";
        const bak = dest + ".bak";
        const dir = path.dirname(dest);
        if (!fs.existsSync(dir))
            fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(tmp, JSON.stringify(valid, null, 2), "utf8");
        if (fs.existsSync(dest)) {
            try {
                fs.copyFileSync(dest, bak);
            }
            catch { }
        }
        fs.renameSync(tmp, dest);
        if (fs.existsSync(bak)) {
            try {
                fs.unlinkSync(bak);
            }
            catch { }
        }
    }
    catch (err) {
        console.error("saveCache literally fell apart:", err);
        try {
            fs.writeFileSync(CACHE_PATHS[1], JSON.stringify(cache, null, 2), "utf8");
        }
        catch {
            console.error("okay idk what to do anymore cache can't be saved anywhere goodbye");
        }
    }
}
// ------------------------------------------------------
// validateCache
// this thing ended up way too long but I’m scared to touch it now
// ------------------------------------------------------
function validateCache(cache) {
    const out = {
        version: typeof cache.version === "number" ? cache.version : CURRENT_VERSION,
        files: {},
        classes: {},
        meta: cache.meta || DEFAULT_CACHE.meta
    };
    // ok validating files…
    if (cache.files && typeof cache.files === "object") {
        for (const [fp, raw] of Object.entries(cache.files)) {
            const norm = normalizePathForCache(fp);
            if (typeof raw === "string") {
                // legacy thing
                out.files[norm] = {
                    hash: raw,
                    classes: [],
                    timestamp: Date.now(),
                };
            }
            else if (raw && typeof raw === "object") {
                const d = raw;
                out.files[norm] = {
                    hash: typeof d.hash === "string" ? d.hash : "",
                    classes: Array.isArray(d.classes)
                        ? d.classes.filter((x) => typeof x === "string")
                        : [],
                    timestamp: typeof d.timestamp === "number" ? d.timestamp : Date.now(),
                    size: typeof d.size === "number" ? d.size : undefined,
                };
            }
        }
    }
    // validating classes…
    if (cache.classes && typeof cache.classes === "object") {
        for (const [cls, css] of Object.entries(cache.classes)) {
            if (typeof css === "string" && cls.trim()) {
                out.classes[cls.trim()] = css;
            }
        }
    }
    return out;
}
// ------------------------------------------------------
// migrateCache
// I don't fully understand versioning but this works so DO NOT TOUCH.
// ------------------------------------------------------
function migrateCache(raw) {
    const v = raw.version || 1;
    if (v >= CURRENT_VERSION)
        return raw;
    console.log("migrating cache from version", v, "to", CURRENT_VERSION);
    if (v < 2) {
        if (raw.files) {
            const newFiles = {};
            for (const [fp, data] of Object.entries(raw.files)) {
                newFiles[normalizePathForCache(fp)] = data;
            }
            raw.files = newFiles;
        }
    }
    if (v < 3) {
        if (raw.files) {
            for (const d of Object.values(raw.files)) {
                const dd = d;
                if (!dd.timestamp)
                    dd.timestamp = Date.now();
            }
        }
        if (!raw.meta) {
            raw.meta = {
                lastBuild: Date.now(),
                totalClasses: Object.keys(raw.classes || {}).length,
                totalFiles: Object.keys(raw.files || {}).length,
            };
        }
    }
    raw.version = CURRENT_VERSION;
    return raw;
}
// ------------------------------------------------------
// hasFileChanged
// Basically checks if file changed.
// Pretty sure this saved me like 6 hours once.
// ------------------------------------------------------
export function hasFileChanged(cache, filePath, content) {
    const p = normalizePathForCache(filePath);
    const entry = cache.files[p];
    if (!entry)
        return true;
    try {
        if (!fs.existsSync(filePath))
            return true;
    }
    catch {
        return true;
    }
    if (content !== undefined) {
        return entry.hash !== hashString(content);
    }
    const info = getFileInfo(filePath);
    return !info || entry.hash !== info.hash;
}
// ------------------------------------------------------
// updateFileHash
// sets new hash. simple. PLEASE DON'T BREAK THIS ONE.
// ------------------------------------------------------
export function updateFileHash(cache, filePath, content) {
    const p = normalizePathForCache(filePath);
    cache.files[p] = {
        hash: hashString(content),
        classes: cache.files[p]?.classes || [],
        timestamp: Date.now(),
    };
}
// ------------------------------------------------------
// addFileClasses
// adds classes without duplicates OR exploding.
// ------------------------------------------------------
export function addFileClasses(cache, filePath, classes) {
    const p = normalizePathForCache(filePath);
    const unique = [...new Set(classes.filter(x => x && typeof x === "string"))];
    if (!cache.files[p]) {
        cache.files[p] = {
            hash: "",
            classes: unique,
            timestamp: Date.now(),
        };
    }
    else {
        const ex = cache.files[p];
        ex.classes = [...new Set([...ex.classes, ...unique])];
        ex.timestamp = Date.now();
    }
}
// ------------------------------------------------------
// removeFileFromCache
// removes file + any orphan classes
// this part once wiped my whole cache by accident
// pls double check if modifying anything here
// ------------------------------------------------------
export function removeFileFromCache(cache, filePath) {
    const p = normalizePathForCache(filePath);
    if (!cache.files[p])
        return;
    const removed = new Set(cache.files[p].classes);
    delete cache.files[p];
    if (removed.size > 0) {
        const refs = getAllReferencedClasses(cache);
        for (const cls of removed) {
            if (!refs.has(cls) && cache.classes[cls]) {
                delete cache.classes[cls];
            }
        }
    }
}
// ------------------------------------------------------
// getAllReferencedClasses
// returns all classes that are still used
// I messed this up once and everything got deleted so be careful
// ------------------------------------------------------
export function getAllReferencedClasses(cache) {
    const s = new Set();
    for (const f of Object.values(cache.files)) {
        for (const c of f.classes)
            s.add(c);
    }
    return s;
}
export const getAllCachedClasses = (cache) => Object.keys(cache.classes);
export const getCachedFiles = (cache) => Object.keys(cache.files);
export const hasClass = (cache, cls) => cls in cache.classes;
// ------------------------------------------------------
// setClass
// adds/updates a class
// ------------------------------------------------------
export function setClass(cache, className, css) {
    if (className && css) {
        cache.classes[className] = css;
    }
}
// ------------------------------------------------------
// removeClass
// deletes a class if it exists
// ------------------------------------------------------
export function removeClass(cache, className) {
    if (cache.classes[className]) {
        delete cache.classes[className];
        return true;
    }
    return false;
}
// ------------------------------------------------------
// clearCache
// wipes everything. pls use carefully, I cried once using this accidentally.
// ------------------------------------------------------
export function clearCache() {
    const fresh = { ...DEFAULT_CACHE };
    saveCache(fresh);
    return fresh;
}
// ------------------------------------------------------
// getCacheStats
// returns stats so we can pretend we know what's going on
// ------------------------------------------------------
export function getCacheStats(cache) {
    const tf = Object.keys(cache.files).length;
    const tc = Object.keys(cache.classes).length;
    const size = Buffer.byteLength(JSON.stringify(cache), "utf8");
    let cc = 0;
    for (const f of Object.values(cache.files)) {
        cc += f.classes.length;
    }
    return {
        totalFiles: tf,
        totalClasses: tc,
        cacheSize: size,
        lastBuild: cache.meta?.lastBuild || 0,
        averageClassesPerFile: tf > 0 ? cc / tf : 0,
    };
}
// ------------------------------------------------------
// pruneCache
// deletes stale file entries + orphan classes
// broke on me like 3 times so I’m scared of this one
// ------------------------------------------------------
export function pruneCache(cache, currentFiles) {
    let pruned = 0;
    const keep = {};
    const current = new Set();
    if (Array.isArray(currentFiles)) {
        for (const f of currentFiles)
            current.add(normalizePathForCache(f));
    }
    for (const [fp, data] of Object.entries(cache.files)) {
        try {
            const real = path.isAbsolute(fp) ? fp : path.resolve(process.cwd(), fp);
            if (fs.existsSync(real)) {
                if (currentFiles && !current.has(fp)) {
                    pruned++;
                    continue;
                }
                keep[fp] = data;
            }
            else {
                pruned++;
            }
        }
        catch {
            pruned++;
        }
    }
    cache.files = keep;
    const refs = getAllReferencedClasses(cache);
    const clsOut = {};
    for (const [cls, css] of Object.entries(cache.classes)) {
        if (refs.has(cls))
            clsOut[cls] = css;
        else
            pruned++;
    }
    cache.classes = clsOut;
    return pruned;
}
// ------------------------------------------------------
// exportCache
// outputs json or csv
// ------------------------------------------------------
export function exportCache(cache, format = "json") {
    if (format === "csv") {
        const rows = ["File Path,Classes Count,Last Updated"];
        for (const [fp, data] of Object.entries(cache.files)) {
            rows.push(`"${fp}",${data.classes.length},${new Date(data.timestamp).toISOString()}`);
        }
        return rows.join("\n");
    }
    return JSON.stringify(cache, null, 2);
}
