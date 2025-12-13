/**
 * ---------------------------------------------------------------------
 * GARUR-CSS — Ultra-fast Atomic CSS Engine
 * Author: Barshan Sarkar
  hey wait, i think i forgot to update the version last time lol
 * Version: 1.0.0
 * License: MIT
 * ---------------------------------------------------------------------
 *
 * This CLI powers the Garur-CSS ecosystem. It handles:
 * • SSC ( SUPER SONIC CYCLONE ) compilation of utility classes
 * • File scanning across HTML / JS / TS / JSX / TSX
 * • Cache management and orphan-class detection
 * • Config file creation (garur.config.js)
 * • Plugin boilerplate generation
 * • Watch mode for real-time builds ,, (coming soon)
 * oh man, watch mode is gonna be epic when i get to it
 *
 * Technologies:
 * - TypeScript
 * - Rollup bundling (CJS-compatible output)
 * - Node.js (CLI execution via shebang)
 *
 * Notes for contributors:
 * • Keep the CLI ESM/CJS compatible.
 * • Avoid dynamic require unless wrapped safely.
 * • Keep output messages clean, fast, and developer-friendly.
 *
 * Made in India.
 * ---------------------------------------------------------------------
 */
export declare function splitPrefixesFromRaw(token: string): {
    prefixes: string[];
    raw: string;
};
export declare function isBreakpoint(prefix: string): boolean;
export declare function applyVariantSelectors(baseSelector: string, variantParts: string[]): string;
export declare function wrapWithBreakpoints(rule: string, bps: string[]): string;
