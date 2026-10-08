export declare function splitPrefixesFromRaw(token: string): {
    prefixes: string[];
    raw: string;
};
export declare function isBreakpoint(prefix: string): boolean;
export declare function applyVariantSelectors(baseSelector: string, variantParts: string[]): string;
export declare function wrapWithBreakpoints(rule: string, bps: string[]): string;
