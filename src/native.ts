/**
 * Garur Native Bridge
 */

import { createRequire } from "node:module";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const requireCjs = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  version: () => string;
};

let native: NativeModule | null = null;
let loadAttempted = false;

function tryLoadNative(): NativeModule | null {
  if (loadAttempted) return native;
  loadAttempted = true;

  const cwd = process.cwd();
  const bases = [
    cwd,
    path.resolve(__dirname, ".."),
    path.resolve(__dirname, "../.."),
    __dirname,
    path.resolve(__dirname, "..", "rust"),
  ];

  const names = [
    "garur_core.linux-x64-gnu.node",
    "garur_core.darwin-arm64.node",
    "garur_core.darwin-x64.node",
    "garur_core.win32-x64-msvc.node",
    "index.cjs",
    "index.node",
  ];

  const candidates: string[] = [];
  for (const base of bases) {
    for (const name of names) {
      candidates.push(path.join(base, name));
    }
  }

  if (process.env.GARUR_DEBUG) {
    console.log("[garur] Native candidates:");
    for (const c of candidates) console.log("  ", c);
  }

  for (const candidate of candidates) {
    if (!fs.existsSync(candidate)) continue;
    try {
      const mod = requireCjs(candidate);
      const real = mod?.default ?? mod;
      if (real && typeof real.build === "function") {
        native = real as NativeModule;
        if (process.env.GARUR_DEBUG || process.env.GARUR_INFO) {
          console.log(`🦀 Garur native v${native.version()} loaded from ${candidate}`);
        }
        return native;
      }
    } catch (e) {
      if (process.env.GARUR_DEBUG) {
        console.log(`[garur] failed to load ${candidate}:`, (e as Error).message);
      }
    }
  }
  return null;
}

tryLoadNative();

// ─── Public API ───

export function hasNative(): boolean {
  return native !== null;
}

export function nativeVersion(): string {
  return native?.version() ?? "js";
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

export function findFiles(cwd: string, inc: string[], ign: string[]): string[] {
  if (native) {
    try { return native.findFiles(cwd, inc, ign); } catch { /* fall */ }
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

      // ─── KEY FIX: Rust returns JSON STRING, not object ───
      let data: any = raw;
      if (typeof raw === "string") {
        try {
          data = JSON.parse(raw);
        } catch {
          if (process.env.GARUR_DEBUG) {
            console.error("cacheStats: JSON parse failed:", raw);
          }
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
    try {
      native.resetCacheStats();
    } catch { /* ignore */ }
  }
}

/**
 * Full SSC build with cache stats.
 * Resets counters, runs build, then reads stats.
 */
export function runSscWithStats(files: string[], configJson: string): SscStats {
  // Reset counters before build
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

  // Count unique classes from CSS
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

// ─── JS Fallbacks ───

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

export default {
  hasNative, nativeVersion, initConfig, initHandler,
  parse, parseBatch, lex, clearParseCache,
  build, buildBatch, clearCache, warmupClasses, hasUtility,
  extractClasses, extractFromFile, scanFiles, findFiles,
  runSsc, runSscWithStats, minifyCss,
  hashString, hashFile,
  getCacheStats, resetCacheStats,
};