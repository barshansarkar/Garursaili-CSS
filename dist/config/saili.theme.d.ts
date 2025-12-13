export type ThemeTokens = {
    colors?: Record<string, string>;
    spacing?: Record<string, string>;
    radii?: Record<string, string>;
    fonts?: Record<string, string>;
    fontSize?: Record<string, string>;
    [k: string]: any;
};
export declare const defaultTheme: ThemeTokens;
export declare function generateThemeCssVars(theme?: ThemeTokens, prefix?: string): string;
