import { ParsedToken } from "./parser";
export type HandlerResult = string | {
    decl: string;
    selectorSuffix?: string;
    extra?: string;
    mediaQuery?: string;
};
export interface UtilityDefinition {
    id: string;
    desc: string;
    example?: string;
    category: string;
}
export interface GarurConfig {
    palette?: Record<string, any>;
    theme?: {
        colors?: Record<string, any>;
        spacing?: Record<string, string>;
        borderRadius?: Record<string, string>;
        borderWidth?: Record<string, string>;
        boxShadow?: Record<string, string>;
        fontSize?: Record<string, any>;
        fontWeight?: Record<string, string | number>;
        lineHeight?: Record<string, string>;
        letterSpacing?: Record<string, string>;
        fontFamily?: Record<string, any>;
        blur?: Record<string, string>;
        brightness?: Record<string, string>;
        contrast?: Record<string, string>;
        dropShadow?: Record<string, string>;
        hueRotate?: Record<string, string>;
        saturate?: Record<string, string>;
        rotate?: Record<string, string>;
        translate?: Record<string, string>;
        scale?: Record<string, string>;
        skew?: Record<string, string>;
        zIndex?: Record<string, string>;
        transitionDuration?: Record<string, string>;
        transitionDelay?: Record<string, string>;
        transitionTimingFunction?: Record<string, string>;
        backdropBlur?: Record<string, string>;
        backdropBrightness?: Record<string, string>;
        backdropContrast?: Record<string, string>;
        backdropOpacity?: Record<string, string>;
        backdropSaturate?: Record<string, string>;
        [key: string]: any;
    };
    [key: string]: any;
}
export declare const UTIL_DOCS: UtilityDefinition[];
export declare function handle(token: ParsedToken): HandlerResult | null;
declare const _default: {
    handle: typeof handle;
    UTIL_DOCS: UtilityDefinition[];
    getUtilityCount: () => number;
    hasUtility: (util: string) => boolean;
};
export default _default;
