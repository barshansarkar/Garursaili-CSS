export type Layer = "base" | "components" | "utilities" | "overrides";
export type Enforce = "pre" | "normal" | "post";
export type TypeHint = "length" | "color" | "angle" | "time" | "percentage" | "number" | "url" | "shadow" | "image" | "font" | "any";
export type UtilityValue = string | Record<string, string | number | Record<string, string | number>> | {
    selector?: string;
    decls: string | Record<string, string | number>;
};
export type UtilityHandler = (value: string | undefined, ctx: PluginContext) => UtilityValue | null;
export type VariantHandler = (value: string | undefined, ctx: PluginContext) => string | null;
export interface PluginContext {
    theme: Record<string, any>;
    config: Record<string, any>;
    pluginId: string;
    tokens: {
        add(name: string, value: string): void;
        addMany(map: Record<string, string>): void;
    };
    preflight: {
        add(layer: Layer, css: string): void;
    };
    assets: {
        addFont(name: string, url: string, opts?: Record<string, string>): void;
        addPreload(url: string, as: "font" | "image" | "style" | "script"): void;
    };
    debug: {
        log(msg: string): void;
    };
}
export interface BuildContext {
    files: string[];
    classes: string[];
    cwd: string;
    config: Record<string, any>;
    theme: Record<string, any>;
}
export interface HookMap {
    onInit?: (api: PluginAPI, ctx: PluginContext) => void | Promise<void>;
    onConfig?: (config: Record<string, any>) => Record<string, any> | void | Promise<Record<string, any> | void>;
    onBeforeBuild?: (ctx: BuildContext) => void | Promise<void>;
    onAfterBuild?: (ctx: BuildContext, css: string) => string | void | Promise<string | void>;
    onClassResolved?: (cls: string, source: PluginSource) => void;
    onCssEmitted?: (css: string, ctx: BuildContext) => void;
}
export interface MatchUtilityOptions {
    values?: Record<string, string>;
    supportsArbitrary?: boolean;
    type?: TypeHint;
    layer?: Layer;
}
export interface MatchVariantOptions {
    values?: Record<string, string>;
    sortKey?: number;
}
export interface PluginSpec {
    name: string;
    description?: string;
    version?: string;
    requires?: string[];
    enforce?: Enforce;
    prefixes?: string[];
    setup: (api: PluginAPI, ctx: PluginContext) => void | Promise<void>;
    hooks?: HookMap;
    theme?: Record<string, any>;
    preflight?: (layer: Layer) => string;
}
export interface PluginSource {
    pluginId: string;
    pluginName: string;
    kind: "static" | "match" | "component" | "rewrite";
}
export interface PluginAPI {
    addUtility(name: string, value: UtilityValue): void;
    addUtilities(map: Record<string, UtilityValue>): void;
    addComponent(name: string, value: UtilityValue): void;
    addComponents(map: Record<string, UtilityValue>): void;
    matchUtilities(map: Record<string, UtilityHandler>, opts?: MatchUtilityOptions): void;
    matchVariant(name: string, handler: VariantHandler, opts?: MatchVariantOptions): void;
    rewrite(from: string, to: string): void;
    addKeyframes(name: string, body: string): void;
    addProperty(name: string, syntax: string, initial: string, inherits?: boolean): void;
    addAtRule(css: string): void;
    config<T = any>(path?: string): T;
    theme<T = any>(path: string): T;
    defineToken(name: string, value: string): void;
    mergeInto(name: string, extraDecls: Record<string, string | number>): void;
    debug(msg: string): void;
}
export declare function setGlobalConfig(cfg: any): void;
export declare class PluginRegistry {
    private static _instance;
    static get instance(): PluginRegistry;
    private plugins;
    private staticUtilities;
    private components;
    private matchUtilities;
    private matchVariants;
    private rewrites;
    private atRules;
    private atRulesTotal;
    private tokens;
    private merges;
    private hooks;
    private orderCounter;
    private lastSignature;
    has(name: string): boolean;
    hasPlugins(): boolean;
    register(spec: PluginSpec): Promise<void>;
    initialize(): Promise<void>;
    runHook<K extends keyof HookMap>(name: K, ...args: Parameters<NonNullable<HookMap[K]>>): Promise<any>;
    pushAllStatic(): void;
    resolveDynamic(classes: string[]): void;
    resolveAll(classes: string[]): void;
    private tryMatchUtility;
    private callUtilityHandler;
    signature(): string;
    private invalidateSignature;
    private orderedPlugins;
    clear(): void;
    flushAtRulesWithTokens(): void;
    getTokensCss(): string;
    rewriteClass(cls: string): string;
    traceClass(cls: string): PluginSource | null;
    snapshot(): {
        plugins: {
            name: string;
            version: string;
            enforce: Enforce;
        }[];
        utilities: number;
        components: number;
        matchUtilities: number;
        matchVariants: number;
        rewrites: number;
        atRules: number;
        tokens: number;
        signature: string;
    };
    private buildAPI;
    private buildContext;
}
export declare function definePlugin(spec: PluginSpec): PluginSpec;
export declare function definePreset(spec: PluginSpec): PluginSpec;
export declare function usePlugin(spec: PluginSpec): Promise<void>;
/**
 * ✨ Wave-parallel registration.
 *
 * Plugins with no `requires` (or whose deps are already registered)
 * are set up in parallel waves. Plugins with deps wait for the wave
 * where their dep is ready.
 *
 * For 52 independent plugins → 1 wave, 52 parallel setups (~8-15ms).
 * For plugins with dependencies → multiple waves, still parallel.
 */
export declare function usePlugins(specs: PluginSpec[]): Promise<void>;
export declare function reloadPlugins(specs: PluginSpec[]): Promise<void>;
