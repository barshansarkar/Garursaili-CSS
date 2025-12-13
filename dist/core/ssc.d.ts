/**
 * ---------------------------------------------------------------------
 *  GARUR-CSS — Ultra-fast Atomic CSS Engine
 *  Author: Barshan Sarkar
 *  Version: 1.0.0
 *  License: MIT
 * ---------------------------------------------------------------------
 *
 *  This CLI powers the Garur-CSS ecosystem. It handles:
 *    • SSC ( SUPER SONIC CYCLONE ) compilation of utility classes
 *    • File scanning across HTML / JS / TS / JSX / TSX
 *    • Cache management and orphan-class detection
 *    • Config file creation (garur.config.js)
 *    • Plugin boilerplate generation
 *    • Watch mode for real-time builds ,, (coming soon)
 *
 *  Technologies:
 *    - TypeScript
 *    - Rollup bundling (CJS-compatible output)
 *    - Node.js (CLI execution via shebang)
 *
 *  Notes for contributors:
 *    • Keep the CLI ESM/CJS compatible.
 *    • Avoid dynamic require unless wrapped safely.
 *    • Keep output messages clean, fast, and developer-friendly.
 *
 *  Made in India.
 * ---------------------------------------------------------------------
 */
export type JitStats = {
    filesScanned: number;
    classOccurrences: number;
    uniqueClasses: number;
    uniqueUtilities: number;
    cssBytes: number;
    topClasses: Array<{
        cls: string;
        count: number;
    }>;
    buildTimeMs: number;
    memoryUsageMB: number;
    cacheHits: number;
    cacheMisses: number;
    cacheSize: number;
};
export declare function extractClassesFromContent(content: string): string[];
export declare function runJIT(globPattern?: string[]): Promise<JitStats>;
export declare function runJITIncremental(changedFiles: string[], deletedFiles?: string[]): Promise<{
    filesScanned: number;
    buildTimeMs: number;
}>;
export declare function cleanupMemoryCaches(): void;
export declare function cleanupMemory(): void;
