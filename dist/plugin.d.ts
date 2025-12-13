import { ParsedToken } from "./core/parser";
export type HandlerResult = string | {
    decl: string;
    selectorSuffix?: string;
    extra?: string;
};
type HandlerHook = (token: ParsedToken) => HandlerResult | null;
type VariantHook = (selector: string) => string;
export declare function registerHandlerHook(fn: HandlerHook): void;
export declare function getHandlerHooks(): HandlerHook[];
export declare function registerVariant(name: string, fn: VariantHook): void;
export declare function getVariantHook(name: string): VariantHook | undefined;
declare const _default: {
    registerHandlerHook: typeof registerHandlerHook;
    getHandlerHooks: typeof getHandlerHooks;
    registerVariant: typeof registerVariant;
    getVariantHook: typeof getVariantHook;
};
export default _default;
