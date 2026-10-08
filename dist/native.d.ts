/**
 * Garur Native Bridge
 */
export type ParsedToken = {
    raw: string;
    key: string;
    value: string;
    negative: boolean;
    important: boolean;
};
export interface NativeCacheStats {
    build_hits: number;
    build_misses: number;
    parse_hits: number;
    parse_misses: number;
    build_entries: number;
    parse_entries: number;
    build_hit_rate: number;
    parse_hit_rate: number;
}
export interface SscStats {
    css: string;
    filesScanned: number;
    uniqueClasses: number;
    cacheHits: number;
    cacheMisses: number;
    parseHits: number;
    parseMisses: number;
    buildEntries: number;
    buildHitRate: number;
}
export declare function hasNative(): boolean;
export declare function nativeVersion(): string;
export declare function initConfig(json: string): void;
export declare function initHandler(json: string): void;
export declare function parse(token: string): ParsedToken;
export declare function parseBatch(tokens: string[]): (ParsedToken | null)[];
export declare function lex(s: string): string[];
export declare function clearParseCache(): void;
export declare function build(cls: string, inline?: boolean): string | null;
export declare function buildBatch(classes: string[]): (string | null)[];
export declare function clearCache(): void;
export declare function warmupClasses(classes: string[]): void;
export declare function hasUtility(cls: string): boolean;
export declare function extractClasses(content: string): string[];
export declare function extractFromFile(p: string): string[] | null;
export declare function scanFiles(files: string[]): {
    path: string;
    classes: string[];
}[];
export declare function findFiles(cwd: string, inc: string[], ign: string[]): string[];
export declare function runSsc(files: string[], configJson: string): string;
export declare function minifyCss(css: string): string;
export declare function hashString(s: string): string;
export declare function hashFile(p: string): string;
export declare function getCacheStats(): NativeCacheStats;
export declare function resetCacheStats(): void;
/**
 * Full SSC build with cache stats.
 * Resets counters, runs build, then reads stats.
 */
export declare function runSscWithStats(files: string[], configJson: string): SscStats;
export declare function exportCache(): string;
export declare function clearFileCache(): void;
export declare function clearFinalizeCache(): void;
export declare function finalizeCacheEntries(): number;
export declare function importCache(data: string): boolean;
declare const _default: {
    hasNative: typeof hasNative;
    nativeVersion: typeof nativeVersion;
    initConfig: typeof initConfig;
    initHandler: typeof initHandler;
    parse: typeof parse;
    parseBatch: typeof parseBatch;
    lex: typeof lex;
    clearParseCache: typeof clearParseCache;
    build: typeof build;
    buildBatch: typeof buildBatch;
    clearCache: typeof clearCache;
    warmupClasses: typeof warmupClasses;
    hasUtility: typeof hasUtility;
    extractClasses: typeof extractClasses;
    extractFromFile: typeof extractFromFile;
    scanFiles: typeof scanFiles;
    findFiles: typeof findFiles;
    runSsc: typeof runSsc;
    runSscWithStats: typeof runSscWithStats;
    minifyCss: typeof minifyCss;
    hashString: typeof hashString;
    hashFile: typeof hashFile;
    getCacheStats: typeof getCacheStats;
    resetCacheStats: typeof resetCacheStats;
};
export default _default;
