// ═══════════════════════════════════════════════════════════════════
// GarurSaili-CSS — native.ts
// The Semantic Indian CSS Framework
// Author: Barshan Sarkar · Malda, West Bengal, India
// Version: 1.5.0
// ═══════════════════════════════════════════════════════════════════
//
// Cross-platform native bridge — loads the correct .node binary for:
//   • Linux x64 (glibc)   → garur_core.linux-x64-gnu.node
//   • Linux x64 (musl)    → garur_core.linux-x64-musl.node
//   • macOS Intel         → garur_core.darwin-x64.node
//   • macOS Apple Silicon → garur_core.darwin-arm64.node
//   • Windows x64         → garur_core.win32-x64-msvc.node
//
// Resolution order:
//   1. Platform-specific npm package (@garursaili/<platform>-<arch>)
//   2. Local project folder (garur_core.<target>.node)
//   3. Package root folder (garur_core.<target>.node)
//   4. Rust build folder (rust/garur_core.<target>.node)
//   5. Legacy fallback (index.cjs, index.node)
//
// ═══════════════════════════════════════════════════════════════════

import { createRequire } from "node:module";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

// ── ESM/CJS interop ──
// This file compiles to both ESM (.mjs) and CJS (.cjs).
// `import.meta.url` isn't available in CJS, so we guard it.
const requireCjs = createRequire(
  typeof import.meta !== "undefined" && import.meta.url
    ? import.meta.url
    : __filename,
);

// In CJS builds, __filename and __dirname are already global.
// In ESM builds, we derive them from import.meta.url.
let _filename = "";
let _dirname = "";

if (typeof __filename !== "undefined" && typeof __dirname !== "undefined") {
  // CommonJS context
  _filename = __filename;
  _dirname = __dirname;
} else {
  // ESM context
  _filename = fileURLToPath(import.meta.url);
  _dirname = path.dirname(_filename);
}

// ═══════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════

export type ParsedToken = {
  raw: string;
  key: string;
  value: string;
  negative: boolean;
  important: boolean;
};

export interface NativeCacheStats {
  build_hits: number;
  build_misses: number;
  parse_hits: number;
  parse_misses: number;
  build_entries: number;
  parse_entries: number;
  build_hit_rate: number;
  parse_hit_rate: number;
}

export interface SscStats {
  css: string;
  filesScanned: number;
  uniqueClasses: number;
  cacheHits: number;
  cacheMisses: number;
  parseHits: number;
  parseMisses: number;
  buildEntries: number;
  buildHitRate: number;
}

type NativeModule = {
  initConfig: (json: string) => void;
  initHandler: (json: string) => void;
  parse: (t: string) => ParsedToken;
  parseBatch: (ts: string[]) => (ParsedToken | null)[];
  lex: (s: string) => string[];
  clearParseCache: () => void;
  build: (cls: string, inline?: boolean) => string | null;
  buildBatch: (classes: string[]) => (string | null)[];
  clearCache: () => void;
  clearFileCache: () => void;
  clearFinalizeCache: () => void;
  finalizeCacheEntries: () => number;
  warmupClasses: (classes: string[]) => void;
  hasUtility: (cls: string) => boolean;
  extractClasses: (s: string) => string[];
  extractFromFile: (p: string) => string[] | null;
  scanFiles: (files: string[]) => { path: string; classes: string[] }[];
  findFiles: (cwd: string, inc: string[], ign: string[]) => string[];
  runSsc: (files: string[], cfg: string) => string;
  minifyCss: (css: string) => string;
  hashString: (s: string) => string;
  hashFile: (p: string) => string;
  cacheLoad: (p: string) => string;
  cacheSave: (p: string, json: string) => void;
  cacheStats: () => NativeCacheStats;
  resetCacheStats: () => void;
  exportCache: () => string;
  importCache: (data: string) => boolean;
  version: () => string;
};

// ═══════════════════════════════════════════════════════════════════
// Platform detection
// ═══════════════════════════════════════════════════════════════════

/**
 * Detect libc variant on Linux.
 * Returns "gnu" (glibc — Ubuntu/Debian/Fedora/Arch) or "musl" (Alpine/static).
 */
function detectLibc(): "gnu" | "musl" {
  if (process.platform !== "linux") return "gnu";

  try {
    // Node 14+ exposes this via process.report
    const report = (process as any).report?.getReport?.();
    if (report?.header?.glibcVersionRuntime) return "gnu";
    if (report?.header?.glibcVersionCompiler) return "gnu";

    // Fallback: check for musl marker
    if (report?.header?.sharedObjects) {
      const soFiles: string[] = report.header.sharedObjects;
      if (soFiles.some((f) => f.includes("musl"))) return "musl";
      if (soFiles.some((f) => f.includes("libc.so.6"))) return "gnu";
    }
  } catch { /* ignore */ }

  // Last resort: check filesystem
  try {
    if (fs.existsSync("/lib/ld-musl-x86_64.so.1")) return "musl";
    if (fs.existsSync("/lib/x86_64-linux-gnu/libc.so.6")) return "gnu";
  } catch { /* ignore */ }

  return "gnu"; // default
}

/**
 * Compute the canonical binary suffix for the current platform.
 * Example: "linux-x64-gnu", "darwin-arm64", "win32-x64-msvc"
 */
function getPlatformKey(): string {
  const p = process.platform;
  const a = process.arch;

  if (p === "linux") {
    const libc = detectLibc();
    return `linux-${a}-${libc}`;
  }
  if (p === "darwin") {
    return `darwin-${a}`;
  }
  if (p === "win32") {
    return `win32-${a}-msvc`;
  }
  return `${p}-${a}`;
}

/**
 * All possible binary filenames for the current platform, in priority order.
 */
function getBinaryNames(): string[] {
  const p = process.platform;
  const a = process.arch;
  const names: string[] = [];

  if (p === "linux" && a === "x64") {
    const libc = detectLibc();
    names.push(`garur_core.linux-x64-${libc}.node`);
    // Fallback: try the other libc too
    names.push(`garur_core.linux-x64-${libc === "gnu" ? "musl" : "gnu"}.node`);
  } else if (p === "linux" && a === "arm64") {
    names.push("garur_core.linux-arm64-gnu.node");
    names.push("garur_core.linux-arm64-musl.node");
  } else if (p === "darwin" && a === "arm64") {
    names.push("garur_core.darwin-arm64.node");
  } else if (p === "darwin" && a === "x64") {
    names.push("garur_core.darwin-x64.node");
  } else if (p === "win32" && a === "x64") {
    names.push("garur_core.win32-x64-msvc.node");
  } else if (p === "win32" && a === "arm64") {
    names.push("garur_core.win32-arm64-msvc.node");
  }

  // Generic fallbacks (older naming schemes)
  names.push("index.cjs", "index.node");

  return names;
}

/**
 * All possible platform-specific npm package names, in priority order.
 */
function getPlatformPackages(): string[] {
  const p = process.platform;
  const a = process.arch;
  const pkgs: string[] = [];

  if (p === "linux") {
    const libc = detectLibc();
    pkgs.push(`@garursaili/linux-${a}-${libc}`);
    pkgs.push(`@garursaili/linux-${a}-gnu`);
    pkgs.push(`@garursaili/linux-${a}-musl`);
  } else if (p === "darwin") {
    pkgs.push(`@garursaili/darwin-${a}`);
  } else if (p === "win32") {
    pkgs.push(`@garursaili/win32-${a}-msvc`);
  }

  // Generic
  pkgs.push(`@garursaili/${p}-${a}`);

  return pkgs;
}

// ═══════════════════════════════════════════════════════════════════
// Native loader
// ═══════════════════════════════════════════════════════════════════

let native: NativeModule | null = null;
let loadAttempted = false;
let loadSource: string = "";

function tryLoadNative(): NativeModule | null {
  if (loadAttempted) return native;
  loadAttempted = true;

  const cwd = process.cwd();

  // Search paths — ordered from most-specific to most-generic
  const searchBases: string[] = [
    path.resolve(_dirname, ".."),           // dist/.. = package root
    path.resolve(_dirname, "../.."),        // dist/utils/.. = package root
    _dirname,                                // dist/ itself
    cwd,                                     // user's project root
    path.resolve(cwd, "node_modules/garursaili-css"),
    path.resolve(cwd, "node_modules/garursaili-css/dist"),
  ];

  const binaryNames = getBinaryNames();
  const platformPkgs = getPlatformPackages();

  const candidates: string[] = [];

  // ── 1. Platform-specific npm packages (highest priority) ──
  for (const pkg of platformPkgs) {
    try {
      const pkgJsonPath = requireCjs.resolve(`${pkg}/package.json`);
      const pkgDir = path.dirname(pkgJsonPath);
      for (const name of binaryNames) {
        candidates.push(path.join(pkgDir, name));
      }
      if (process.env.GARUR_DEBUG) {
        console.log(`[garur] Found platform package: ${pkg} at ${pkgDir}`);
      }
    } catch {
      // Package not installed — normal on unsupported platforms
    }
  }

  // ── 2. Local filesystem search ──
  for (const base of searchBases) {
    for (const name of binaryNames) {
      candidates.push(path.join(base, name));
    }
  }

  // ── 3. Also check the sibling rust/ folder for dev mode ──
  candidates.push(path.resolve(cwd, "rust", "garur_core.node"));
  for (const name of binaryNames) {
    candidates.push(path.resolve(cwd, "rust", name));
  }

  // ── Debug output ──
  if (process.env.GARUR_DEBUG) {
    console.log(`[garur] Platform: ${process.platform}-${process.arch}`);
    console.log(`[garur] Platform key: ${getPlatformKey()}`);
    console.log(`[garur] Binary names: ${binaryNames.join(", ")}`);
    console.log(`[garur] Native candidates (${candidates.length}):`);
    for (const c of candidates) console.log("  ", c);
  }

  // ── Try each candidate ──
  for (const candidate of candidates) {
    if (!fs.existsSync(candidate)) continue;

    try {
      // Clear require cache to allow hot-reloading during dev
      try { delete requireCjs.cache?.[candidate]; } catch { /* ignore */ }

      const mod = requireCjs(candidate);
      const real = mod?.default ?? mod;

      if (real && typeof real.build === "function") {
        native = real as NativeModule;
        loadSource = candidate;

        if (process.env.GARUR_DEBUG || process.env.GARUR_INFO) {
          console.log(`🦀 Garur native v${native.version()} loaded from ${candidate}`);
        }
        return native;
      }
    } catch (e) {
      if (process.env.GARUR_DEBUG) {
        console.log(`[garur] Failed to load ${candidate}:`, (e as Error).message);
      }
    }
  }

  // ── No binary found — log helpful error ──
  if (process.env.GARUR_DEBUG) {
    console.warn(
      `[garur] ⚠️  No native binary found for ${getPlatformKey()}.\n` +
      `       Falling back to JavaScript (slower).\n` +
      `       Expected one of: ${binaryNames.join(", ")}\n` +
      `       Searched in: ${searchBases.join(", ")}`
    );
  }

  return null;
}

tryLoadNative();

// ═══════════════════════════════════════════════════════════════════
// Public API
// ═══════════════════════════════════════════════════════════════════

export function hasNative(): boolean {
  return native !== null;
}

export function nativeVersion(): string {
  return native?.version() ?? "js";
}

export function nativeSource(): string {
  return loadSource;
}

export function platformKey(): string {
  return getPlatformKey();
}

export function initConfig(json: string): void {
  native?.initConfig(json);
}

export function initHandler(json: string): void {
  native?.initHandler(json);
}

export function parse(token: string): ParsedToken {
  if (native) {
    try { return native.parse(token); } catch { /* fall */ }
  }
  return parseJS(token);
}

export function parseBatch(tokens: string[]): (ParsedToken | null)[] {
  if (native) {
    try { return native.parseBatch(tokens); } catch { /* fall */ }
  }
  return tokens.map((t) => {
    try { return parseJS(t); } catch { return null; }
  });
}

export function lex(s: string): string[] {
  if (native) {
    try { return native.lex(s); } catch { /* fall */ }
  }
  return s.split(/\s+/).filter(Boolean);
}

export function clearParseCache(): void {
  native?.clearParseCache();
}

export function build(cls: string, inline = false): string | null {
  if (native) {
    try { return native.build(cls, inline); } catch { return null; }
  }
  return null;
}

export function buildBatch(classes: string[]): (string | null)[] {
  if (native) {
    try { return native.buildBatch(classes); } catch { /* fall */ }
  }
  return classes.map(() => null);
}

export function clearCache(): void {
  native?.clearCache();
}

export function warmupClasses(classes: string[]): void {
  native?.warmupClasses(classes);
}

export function hasUtility(cls: string): boolean {
  if (native) {
    try { return native.hasUtility(cls); } catch { /* fall */ }
  }
  return false;
}

export function extractClasses(content: string): string[] {
  if (native) {
    try { return native.extractClasses(content); } catch { /* fall */ }
  }
  return extractJS(content);
}

export function extractFromFile(p: string): string[] | null {
  if (native) {
    try { return native.extractFromFile(p); } catch { /* fall */ }
  }
  return null;
}

export function scanFiles(files: string[]): { path: string; classes: string[] }[] {
  if (native) {
    try { return native.scanFiles(files); } catch { /* fall */ }
  }
  return [];
}

// ─── Brace expansion (JS-side workaround) ───

function expandBraces(pattern: string): string[] {
  const match = pattern.match(/\{([^{}]+)\}/);
  if (!match || match.index === undefined) return [pattern];
  const prefix = pattern.slice(0, match.index);
  const suffix = pattern.slice(match.index + match[0].length);
  const out: string[] = [];
  for (const opt of match[1].split(',')) {
    out.push(...expandBraces(`${prefix}${opt.trim()}${suffix}`));
  }
  return out;
}

export function findFiles(cwd: string, inc: string[], ign: string[]): string[] {
  const expandedInc = inc.flatMap(expandBraces);
  const expandedIgn = ign.flatMap(expandBraces);

  if (process.env.GARUR_DEBUG) {
    console.log("[garur] findFiles patterns:", expandedInc);
  }

  if (native) {
    try { return native.findFiles(cwd, expandedInc, expandedIgn); } catch { /* fall */ }
  }
  return [];
}

export function runSsc(files: string[], configJson: string): string {
  if (native) {
    try {
      return native.runSsc(files, configJson);
    } catch (e) {
      if (process.env.GARUR_DEBUG) console.error("runSsc failed:", e);
    }
  }
  return "";
}

export function minifyCss(css: string): string {
  if (native) {
    try { return native.minifyCss(css); } catch { /* fall */ }
  }
  return css;
}

export function hashString(s: string): string {
  if (native) {
    try { return native.hashString(s); } catch { /* fall */ }
  }
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h).toString(16).padStart(16, "0");
}

export function hashFile(p: string): string {
  if (native) {
    try { return native.hashFile(p); } catch { /* fall */ }
  }
  return "";
}

// ─── Cache stats ───

export function getCacheStats(): NativeCacheStats {
  const def: NativeCacheStats = {
    build_hits: 0,
    build_misses: 0,
    parse_hits: 0,
    parse_misses: 0,
    build_entries: 0,
    parse_entries: 0,
    build_hit_rate: 0,
    parse_hit_rate: 0,
  };

  if (native && typeof native.cacheStats === "function") {
    try {
      const raw: any = native.cacheStats();

      let data: any = raw;
      if (typeof raw === "string") {
        try { data = JSON.parse(raw); } catch {
          if (process.env.GARUR_DEBUG) console.error("cacheStats: JSON parse failed:", raw);
          return def;
        }
      }

      if (data && typeof data === "object") {
        const num = (x: any): number => {
          if (typeof x === "number" && !isNaN(x) && isFinite(x)) return x;
          if (typeof x === "bigint") return Number(x);
          const v = Number(x);
          return isNaN(v) || !isFinite(v) ? 0 : v;
        };
        return {
          build_hits: num(data.build_hits),
          build_misses: num(data.build_misses),
          parse_hits: num(data.parse_hits),
          parse_misses: num(data.parse_misses),
          build_entries: num(data.build_entries),
          parse_entries: num(data.parse_entries),
          build_hit_rate: num(data.build_hit_rate),
          parse_hit_rate: num(data.parse_hit_rate),
        };
      }
    } catch (e) {
      if (process.env.GARUR_DEBUG) console.error("cacheStats failed:", e);
    }
  }
  return def;
}

export function resetCacheStats(): void {
  if (native && typeof native.resetCacheStats === "function") {
    try { native.resetCacheStats(); } catch { /* ignore */ }
  }
}

/**
 * Full SSC build with cache stats.
 * Resets counters, runs build, then reads stats.
 */
export function runSscWithStats(files: string[], configJson: string): SscStats {
  resetCacheStats();

  const css = runSsc(files, configJson);
  if (!css) {
    return {
      css: "",
      filesScanned: files.length,
      uniqueClasses: 0,
      cacheHits: 0,
      cacheMisses: 0,
      parseHits: 0,
      parseMisses: 0,
      buildEntries: 0,
      buildHitRate: 0,
    };
  }

  const stats = getCacheStats();

  const classRe = /\.([a-zA-Z][a-zA-Z0-9_\\/-]*)/g;
  const seen = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = classRe.exec(css)) !== null) {
    seen.add(m[1].replace(/\\/g, ""));
  }

  return {
    css,
    filesScanned: files.length,
    uniqueClasses: seen.size,
    cacheHits: stats.build_hits,
    cacheMisses: stats.build_misses,
    parseHits: stats.parse_hits,
    parseMisses: stats.parse_misses,
    buildEntries: stats.build_entries,
    buildHitRate: stats.build_hit_rate,
  };
}

// ───────────────────────────────────────────────
// Persistent cache (cross-process)
// ───────────────────────────────────────────────

export function exportCache(): string {
  try {
    return (native as any)?.exportCache?.() ?? "";
  } catch {
    return "";
  }
}

export function importCache(data: string): boolean {
  try {
    return (native as any)?.importCache?.(data) ?? false;
  } catch {
    return false;
  }
}

export function clearFileCache(): void {
  if (native && typeof (native as any).clearFileCache === "function") {
    try { (native as any).clearFileCache(); } catch { /* */ }
  }
}

export function clearFinalizeCache(): void {
  if (native && typeof (native as any).clearFinalizeCache === "function") {
    try { (native as any).clearFinalizeCache(); } catch { /* */ }
  }
}

export function finalizeCacheEntries(): number {
  if (native && typeof (native as any).finalizeCacheEntries === "function") {
    try { return (native as any).finalizeCacheEntries(); } catch { /* */ }
  }
  return 0;
}

// ═══════════════════════════════════════════════════════════════════
// JS Fallbacks (used only when native binary is missing)
// ═══════════════════════════════════════════════════════════════════

function parseJS(token: string): ParsedToken {
  if (!token) throw new Error("parse: empty");
  let raw = token;
  let neg = false, imp = false;
  while (raw.startsWith("!")) { imp = true; raw = raw.slice(1); }
  if (raw.startsWith("-")) { neg = true; raw = raw.slice(1); }

  const bracket = raw.indexOf("[");
  if (bracket !== -1) {
    const close = raw.lastIndexOf("]");
    if (close !== -1) {
      let key = raw.slice(0, bracket);
      if (key.endsWith("-")) key = key.slice(0, -1);
      return { raw: token, key, value: raw.slice(bracket + 1, close), negative: neg, important: imp };
    }
  }
  const idx = raw.lastIndexOf("-");
  if (idx === -1) return { raw: token, key: raw, value: "", negative: neg, important: imp };
  return { raw: token, key: raw.slice(0, idx), value: raw.slice(idx + 1), negative: neg, important: imp };
}

function extractJS(content: string): string[] {
  const out = new Set<string>();
  const re = /(?:class|className|data-garur)\s*=\s*(?:"([^"]+)"|'([^']+)'|`([^`]+)`)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) {
    const s = m[1] || m[2] || m[3];
    if (!s) continue;
    for (const t of s.split(/\s+/)) if (t) out.add(t);
  }
  return Array.from(out);
}

// ═══════════════════════════════════════════════════════════════════
// Default export
// ═══════════════════════════════════════════════════════════════════

export default {
  hasNative,
  nativeVersion,
  nativeSource,
  platformKey,
  initConfig,
  initHandler,
  parse,
  parseBatch,
  lex,
  clearParseCache,
  build,
  buildBatch,
  clearCache,
  warmupClasses,
  hasUtility,
  extractClasses,
  extractFromFile,
  scanFiles,
  findFiles,
  runSsc,
  runSscWithStats,
  minifyCss,
  hashString,
  hashFile,
  getCacheStats,
  resetCacheStats,
  exportCache,
  importCache,
  clearFileCache,
  clearFinalizeCache,
  finalizeCacheEntries,
};