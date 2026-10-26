export interface RunOptions {
    cwd: string;
    files: string[];
    config: Record<string, any>;
    theme?: Record<string, any>;
}
/**
 * Standard eager bootstrap (loads ALL plugins).
 * Used by `garur plugins` command.
 */
export declare function bootstrapPlugins(config: any): Promise<void>;
/**
 * ✨ Lazy bootstrap (loads ONLY needed plugins).
 * Uses Rust ART/FST for microsecond prefix matching.
 */
export declare function bootstrapPluginsLazy(config: any, usedClasses: Set<string>): Promise<void>;
/**
 * Called BEFORE each Rust build.
 */
export declare function prepareBuild(opts: RunOptions): Promise<{
    rewriteMap: Map<string, string>;
    pluginSignature: string;
}>;
export declare function finalizeBuild(css: string, opts: RunOptions): Promise<string>;
export declare function resetPluginRunner(): void;
