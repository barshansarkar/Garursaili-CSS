// ═══════════════════════════════════════════════════════════════════
// GarurSaili-CSS — Plugin runner (Lazy + ART Edition)
// ═══════════════════════════════════════════════════════════════════
import fs from "node:fs";
import {
  PluginRegistry,
  setGlobalConfig,
  usePlugins,
} from "./plugin_system.js";
import { 
  extractClasses,
  buildPrefixIndex,     // ✨ নতুন Rust bridge
  findMatchingPlugins,  // ✨ নতুন Rust bridge
} from "./native.js";
import type { BuildContext, PluginSpec } from "./plugin_system.js";

export interface RunOptions {
  cwd: string;
  files: string[];
  config: Record<string, any>;
  theme?: Record<string, any>;
}

let _initialized = false;
let _lazyInitialized = false;

/**
 * Standard eager bootstrap (loads ALL plugins).
 * Used by `garur plugins` command.
 */
export async function bootstrapPlugins(config: any): Promise<void> {
  if (_initialized) return;
  _initialized = true;

  setGlobalConfig(config);

  const userPlugins = config.plugins ?? [];
  if (userPlugins.length === 0) return;

  const t0 = Date.now();

  await usePlugins(userPlugins);
  await PluginRegistry.instance.initialize();
  PluginRegistry.instance.pushAllStatic();

  if (process.env.GARUR_DEBUG) {
    console.log(`[garur:plugins] eager bootstrap ${Date.now() - t0}ms`);
  }
}

/**
 * ✨ Lazy bootstrap (loads ONLY needed plugins).
 * Uses Rust ART/FST for microsecond prefix matching.
 */
export async function bootstrapPluginsLazy(
  config: any,
  usedClasses: Set<string>
): Promise<void> {
  if (_lazyInitialized) return;
  _lazyInitialized = true;

  setGlobalConfig(config);

  const userPlugins: PluginSpec[] = config.plugins ?? [];
  if (userPlugins.length === 0) return;

  const t0 = Date.now();

  // ─── 1. Build the FST Prefix Index in Rust ───
  const prefixEntries: [string, string][] = [];
  const alwaysLoad: PluginSpec[] = [];

  for (const spec of userPlugins) {
    const prefixes = spec.prefixes ?? ["*"];
    if (prefixes.includes("*")) {
      alwaysLoad.push(spec);
    } else {
      for (const p of prefixes) {
        prefixEntries.push([p, spec.name]);
      }
    }
  }

  if (prefixEntries.length > 0) {
    buildPrefixIndex(prefixEntries);
  }

  // ─── 2. Ask Rust: which plugins are needed? ───
  let neededNames: Set<string>;
  if (prefixEntries.length > 0 && usedClasses.size > 0) {
    const matchedIds = findMatchingPlugins(Array.from(usedClasses));
    neededNames = new Set(matchedIds);
  } else {
    neededNames = new Set();
  }

  // ─── 3. Filter plugins (Always-load + Matched) ───
  const neededPlugins: PluginSpec[] = [];
  for (const spec of alwaysLoad) {
    neededPlugins.push(spec);
  }
  for (const spec of userPlugins) {
    if (!spec.prefixes?.includes("*") && neededNames.has(spec.name)) {
      neededPlugins.push(spec);
    }
  }

  const skipped = userPlugins.length - neededPlugins.length;

  if (process.env.GARUR_DEBUG) {
    console.log(`[garur:lazy] ${neededPlugins.length}/${userPlugins.length} plugins needed (${skipped} skipped)`);
  }

  // ─── 4. Load ONLY the needed plugins ───
  if (neededPlugins.length > 0) {
    await usePlugins(neededPlugins);
    await PluginRegistry.instance.initialize();
    PluginRegistry.instance.pushAllStatic();
  }

  if (process.env.GARUR_DEBUG) {
    console.log(`[garur:plugins] lazy bootstrap ${Date.now() - t0}ms`);
  }
}

/**
 * Called BEFORE each Rust build.
 */
export async function prepareBuild(opts: RunOptions): Promise<{
  rewriteMap: Map<string, string>;
  pluginSignature: string;
}> {
  const registry = PluginRegistry.instance;
  if (!registry.hasPlugins()) {
    return { rewriteMap: new Map(), pluginSignature: "" };
  }

  // 1. Collect classes
  const allClasses = new Set<string>();
  for (const file of opts.files) {
    try {
      const content = fs.readFileSync(file, "utf-8");
      for (const cls of extractClasses(content)) allClasses.add(cls);
    } catch { /* skip */ }
  }

  // 2. Apply rewrites
  const rewriteMap = new Map<string, string>();
  const rewritten = new Set<string>();
  for (const cls of allClasses) {
    const r = registry.rewriteClass(cls);
    if (r !== cls) rewriteMap.set(cls, r);
    rewritten.add(r);
  }

  // 3. onBeforeBuild hook
  const ctx: BuildContext = {
    files: opts.files,
    classes: Array.from(rewritten),
    cwd: opts.cwd,
    config: opts.config,
    theme: opts.theme ?? {},
  };
  await registry.runHook("onBeforeBuild", ctx);

  // 4. Resolve dynamic (match + components + merges)
  const t0 = Date.now();
  registry.resolveDynamic(Array.from(rewritten));

  if (process.env.GARUR_DEBUG) {
    console.log(`[garur:plugins] resolveDynamic ${Date.now() - t0}ms — ${rewritten.size} classes`);
  }

  return {
    rewriteMap,
    pluginSignature: registry.signature(),
  };
}

export async function finalizeBuild(
  css: string,
  opts: RunOptions
): Promise<string> {
  const registry = PluginRegistry.instance;
  if (!registry.hasPlugins()) return css;

  const ctx: BuildContext = {
    files: opts.files,
    classes: [],
    cwd: opts.cwd,
    config: opts.config,
    theme: opts.theme ?? {},
  };

  const patched = await registry.runHook("onAfterBuild", ctx, css);
  const finalCss = typeof patched === "string" ? patched : css;

  await registry.runHook("onCssEmitted", finalCss, ctx);
  return finalCss;
}

export function resetPluginRunner(): void {
  _initialized = false;
  _lazyInitialized = false;
}