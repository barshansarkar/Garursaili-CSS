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
export declare function escapeClassName(cls: string): string;
export declare function build(cls: string, inline?: boolean): string | null;
export declare function clearBuildCache(): void;
export declare function getBuildCacheStats(): {
    buildCache: number;
    escapeCache: number;
    parseCache: number;
    handlerCache: number;
    prefixCache: number;
    variantCache: number;
    colorPatternCache: number;
};
export declare function warmupCache(commonClasses?: string[]): void;
export declare function debugBuild(cls: string): any;
export declare function validateUtilities(utilities: string[]): {
    valid: string[];
    invalid: string[];
};
