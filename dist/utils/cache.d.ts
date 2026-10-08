export interface CachedFile {
    hash: string;
    classes: string[];
    timestamp: number;
    size?: number;
}
export interface GarurCache {
    version: number;
    files: Record<string, CachedFile>;
    classes: Record<string, string>;
    meta?: {
        lastBuild: number;
        totalClasses: number;
        totalFiles: number;
        buildTime?: number;
    };
}
export declare function normalizePathForCache(filePath: string): string;
export declare function hashString(content: string): string;
export declare function getFileInfo(filePath: string): {
    hash: string;
    size: number;
    mtime: number;
};
export declare function loadCache(): GarurCache;
export declare function saveCache(cache: GarurCache): void;
export declare function hasFileChanged(cache: GarurCache, filePath: string, content?: string): boolean;
export declare function updateFileHash(cache: GarurCache, filePath: string, content: string): void;
export declare function addFileClasses(cache: GarurCache, filePath: string, classes: string[]): void;
export declare function removeFileFromCache(cache: GarurCache, filePath: string): void;
export declare function getAllReferencedClasses(cache: GarurCache): Set<string>;
export declare const getAllCachedClasses: (cache: GarurCache) => string[];
export declare const getCachedFiles: (cache: GarurCache) => string[];
export declare const hasClass: (cache: GarurCache, cls: string) => boolean;
export declare function setClass(cache: GarurCache, className: string, css: string): void;
export declare function removeClass(cache: GarurCache, className: string): boolean;
export declare function clearCache(): GarurCache;
export declare function getCacheStats(cache: GarurCache): {
    totalFiles: number;
    totalClasses: number;
    cacheSize: number;
    lastBuild: number;
    averageClassesPerFile: number;
};
export declare function pruneCache(cache: GarurCache, currentFiles?: string[]): number;
export declare function exportCache(cache: GarurCache, format?: "json" | "csv"): string;
