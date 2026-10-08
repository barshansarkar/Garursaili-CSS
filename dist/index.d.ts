export { hasNative, nativeVersion, initConfig, initHandler, parse, parseBatch, lex, clearParseCache, build, buildBatch, clearCache, warmupClasses, hasUtility, extractClasses, extractFromFile, scanFiles, findFiles, runSsc, runSscWithStats, minifyCss, hashString, hashFile, getCacheStats, resetCacheStats, } from "./native.js";
export type { ParsedToken, SscStats, NativeCacheStats } from "./native.js";
export { loadConfig, applyConfig, DEFAULT_CONFIG } from "./config.js";
