export { hasNative, nativeVersion, initConfig, initHandler, parse, parseBatch, lex, clearParseCache, build, buildBatch, clearCache, warmupClasses, hasUtility, extractClasses, extractFromFile, scanFiles, findFiles, runSsc, runSscWithStats, minifyCss, hashString, hashFile, getCacheStats, resetCacheStats, registerPluginUtilitiesBatch, registerPluginComponentsBatch, registerPluginAtRules, clearPluginRegistries, getPluginComponentsJson, getPluginAtRulesJson, } from "./native.js";
export type { ParsedToken, SscStats, NativeCacheStats } from "./native.js";
export { loadConfig, applyConfig, DEFAULT_CONFIG } from "./config.js";
export { definePlugin, definePreset, usePlugin, usePlugins, reloadPlugins, PluginRegistry, } from "./plugin_system.js";
export type { PluginSpec, PluginAPI, PluginContext, PluginSource, HookMap, Layer, Enforce, TypeHint, UtilityValue, UtilityHandler, VariantHandler, MatchUtilityOptions, MatchVariantOptions, BuildContext, } from "./plugin_system.js";
export { bootstrapPlugins, prepareBuild, finalizeBuild, } from "./plugin_runner.js";
