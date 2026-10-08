#!/usr/bin/env node
/**
 * GarurSaili-CSS — CLI
 * Author: Barshan Sarkar
 * License: MIT
 */

import minimist from "minimist";
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import os from "node:os";
import { execSync } from "node:child_process";
import pc from "picocolors";
import { loadConfig, applyConfig } from "./config.js";
import {
  hasNative,
  nativeVersion,
  runSsc,
  runSscWithStats,
  findFiles,
  minifyCss,
  exportCache,
  importCache,
} from "./native.js";

const VERSION = (() => {
  try {
    const pkgPath = path.resolve(process.cwd(), "package.json");
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
      return pkg.version || "1.4.0";
    }
  } catch { /* ignore */ }
  return "1.4.0";
})();

const banner  = pc.cyan(`  🦅 GarurSaili-CSS v${VERSION}`);
const tagline = pc.gray("  The Semantic Indian CSS Framework\n") +
                pc.gray("  By Barshan Sarkar · Malda, West Bengal, India\n");
const funMessages = [
  "CSS so fast, it finishes before you type.",
  "Atomic CSS delivered hot.",
  "Bloat belongs to 2015.",
  "Smaller than your ego.",
  "Powered by 🦀 Rust.",
];

const DEFAULT_INCLUDES = ["**/*.{html,htm,js,jsx,ts,tsx,vue,svelte,astro,php}"];
const DEFAULT_IGNORES = [
  "node_modules/**", "dist/**", ".git/**",
  "build/**", "coverage/**", "**/*.map", "**/*.min.*",
  "rust/target/**", "**/*.node",
  // NOTE: `test-*.html` was too aggressive — matched `test-theme/*.html`.
  // Only ignore loose test files at project root:
  "test-*.test.html",
];

// Format should only touch markup — never source .ts/.js
const FORMAT_INCLUDES = ["**/*.{html,htm,vue,svelte,astro,jsx,tsx,mdx}"];

const STATS_FILE = () =>
  path.resolve(process.cwd(), ".garur-cache-stats.json");

// ═══════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════

interface BuildResult {
  css: string;
  minified: string;
  files: string[];
  elapsedMs: number;
  cssBytes: number;
  minBytes: number;
  uniqueClasses: number;
  cacheHits: number;
  cacheMisses: number;
}

interface PersistentStats {
  totalBuilds: number;
  totalFiles: number;
  totalClasses: number;
  cacheHits: number;
  cacheMisses: number;
  firstBuild: string;
  lastBuild: string;
}

// ═══════════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════════

function fmtBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function fmtMs(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function fmtHitRate(hits: number, misses: number): string {
  const total = hits + misses;
  if (total === 0) return pc.dim("N/A");
  const rate = (hits / total) * 100;
  const color = rate >= 80 ? pc.green : rate >= 50 ? pc.yellow : pc.red;
  return color(`${rate.toFixed(1)}%`);
}

function bar(pct: number, width = 16): string {
  const filled = Math.max(0, Math.min(width, Math.round((pct / 100) * width)));
  const empty = width - filled;
  const color = pct >= 80 ? pc.green : pct >= 50 ? pc.yellow : pc.red;
  return color("█".repeat(filled)) + pc.dim("░".repeat(empty));
}

// ─── Persistent stats ───

function loadPersistentStats(): PersistentStats {
  const file = STATS_FILE();
  const def: PersistentStats = {
    totalBuilds: 0,
    totalFiles: 0,
    totalClasses: 0,
    cacheHits: 0,
    cacheMisses: 0,
    firstBuild: "",
    lastBuild: "",
  };

  try {
    if (fs.existsSync(file)) {
      const raw = JSON.parse(fs.readFileSync(file, "utf-8"));
      const num = (x: any): number => {
        if (typeof x === "number" && !isNaN(x) && isFinite(x)) return x;
        const v = Number(x);
        return isNaN(v) || !isFinite(v) ? 0 : v;
      };
      return {
        totalBuilds: num(raw.totalBuilds),
        totalFiles: num(raw.totalFiles),
        totalClasses: num(raw.totalClasses),
        cacheHits: num(raw.cacheHits),
        cacheMisses: num(raw.cacheMisses),
        firstBuild: typeof raw.firstBuild === "string" ? raw.firstBuild : "",
        lastBuild: typeof raw.lastBuild === "string" ? raw.lastBuild : "",
      };
    }
  } catch { /* ignore */ }
  return def;
}

function savePersistentStats(s: PersistentStats): void {
  try {
    fs.writeFileSync(STATS_FILE(), JSON.stringify(s, null, 2));
  } catch { /* ignore */ }
}

function accumulateStats(result: BuildResult): void {
  const prev = loadPersistentStats();
  const now = new Date().toISOString();

  const num = (x: any): number => {
    if (typeof x === "number" && !isNaN(x) && isFinite(x)) return x;
    const v = Number(x);
    return isNaN(v) || !isFinite(v) ? 0 : v;
  };

  const next: PersistentStats = {
    totalBuilds: num(prev.totalBuilds) + 1,
    totalFiles: num(result.files.length),
    totalClasses: num(result.uniqueClasses),
    cacheHits: num(prev.cacheHits) + num(result.cacheHits),
    cacheMisses: num(prev.cacheMisses) + num(result.cacheMisses),
    firstBuild: prev.firstBuild || now,
    lastBuild: now,
  };
  savePersistentStats(next);
}

function resetPersistentStats(): void {
  try {
    const f = STATS_FILE();
    if (fs.existsSync(f)) fs.unlinkSync(f);
  } catch { /* ignore */ }
}

// ═══════════════════════════════════════════════════════════════
// Build
// ═══════════════════════════════════════════════════════════════

const CACHE_FILE = (cwd: string) =>
  path.resolve(cwd, ".garur-cache.bin");

function buildOnce(
  cwd: string,
  includes: string[],
  ignores: string[]
): BuildResult | null {
  const cfg = loadConfig();
  applyConfig(cfg);

  if (!hasNative()) {
    console.log(pc.red("  ❌ Native core not loaded."));
    return null;
  }

  // ── Load persistent cache from previous run
  const cacheFile = CACHE_FILE(cwd);
  if (fs.existsSync(cacheFile)) {
    try {
      const cached = fs.readFileSync(cacheFile, "utf-8");
      if (cached) importCache(cached);
    } catch { /* ignore corrupt cache */ }
  }

  const start = Date.now();
  if (process.env.GARUR_DEBUG) {
    console.log(pc.dim("  [debug] Includes: " + includes.join(", ")));
    console.log(pc.dim("  [debug] CWD: " + cwd));
  }
  const files = findFiles(cwd, includes, ignores);
  if (process.env.GARUR_DEBUG) {
    console.log(pc.dim("  [debug] Found " + files.length + " files:"));
    for (const f of files) console.log(pc.dim("    " + f));
  }

  if (files.length === 0) return null;

  const cfgJson = JSON.stringify({
    breakpoints: cfg.breakpoints,
    darkMode: cfg.darkMode,
    important: cfg.important,
    palette: cfg.palette,
  });

  const stats = runSscWithStats(files, cfgJson);
  const css = stats.css;
  if (!css) return null;

  const minified = minifyCss(css);

  const result: BuildResult = {
    css,
    minified,
    files,
    elapsedMs: Date.now() - start,
    cssBytes: Buffer.byteLength(css, "utf-8"),
    minBytes: Buffer.byteLength(minified, "utf-8"),
    uniqueClasses: stats.uniqueClasses,
    cacheHits: stats.cacheHits,
    cacheMisses: stats.cacheMisses,
  };

  // ── Save persistent cache for next run
  try {
    const exported = exportCache();
    if (exported) fs.writeFileSync(cacheFile, exported, "utf-8");
  } catch { /* ignore */ }

  accumulateStats(result);
  return result;
}

function writeCss(outputFile: string, result: BuildResult): void {
  const outDir = path.dirname(outputFile);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outputFile, result.css, "utf-8");
  const minFile = outputFile.replace(/\.css$/, ".min.css");
  fs.writeFileSync(minFile, result.minified, "utf-8");
}

// ═══════════════════════════════════════════════════════════════
// Commands
// ═══════════════════════════════════════════════════════════════

// ─── init ───

function cmdInit(force = false): boolean {
  const p = path.resolve(process.cwd(), "garur.config.js");
  if (fs.existsSync(p) && !force) {
    console.log(pc.yellow(`  Config already exists: ${path.relative(process.cwd(), p)}`));
    console.log(pc.dim(`  Use --force to overwrite`));
    return false;
  }
  const content = `// GarurSaili-CSS Configuration
export default {
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },
  darkMode: 'class',
  important: false,
  palette: {
    // Add custom colors here:
    // brand: { 500: '#6366f1', 600: '#4f46e5' }
  }
};
`;
  fs.writeFileSync(p, content, "utf-8");
  console.log(pc.green(`  ✓ Created: ${path.relative(process.cwd(), p)}`));
  return true;
}

// ─── example ───

function cmdExample(): boolean {
  const p = path.resolve(process.cwd(), "example.html");
  if (fs.existsSync(p)) {
    console.log(pc.yellow(`  Example exists: ${path.relative(process.cwd(), p)}`));
    return false;
  }
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>GarurSaili Demo</title>
  <link rel="stylesheet" href="build/garur.css">
</head>
<body class="bg-ash-50 p-8">
  <div class="max-w-4xl mx-auto">
    <h1 class="text-4xl font-bold text-azure-600 mb-6">🦅 GarurSaili-CSS</h1>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white p-6 rounded-lg shadow-lg">Card 1</div>
      <div class="bg-white p-6 rounded-lg shadow-lg">Card 2</div>
      <div class="bg-white p-6 rounded-lg shadow-lg">Card 3</div>
    </div>
  </div>
</body>
</html>`;
  fs.writeFileSync(p, html, "utf-8");
  console.log(pc.green(`  ✓ Created: ${path.relative(process.cwd(), p)}`));
  return true;
}

// ─── clean ───

function cmdClean(): void {
  const caches = [
    path.resolve(process.cwd(), "dist/.garur-cache.json"),
    path.resolve(process.cwd(), ".garur-cache.json"),
    path.resolve(process.cwd(), ".garur-cache.bin"),          // ← ADD
    path.resolve(process.cwd(), ".garur-cache-stats.json"),   // ← ADD
    path.resolve(process.cwd(), "build/garur.css"),
    path.resolve(process.cwd(), "build/garur.min.css"),
  ];
  let removed = 0;
  for (const c of caches) {
    if (fs.existsSync(c)) {
      fs.unlinkSync(c);
      removed++;
      console.log(pc.dim(`  Removed: ${path.relative(process.cwd(), c)}`));
    }
  }
  if (removed === 0) console.log(pc.gray("  Nothing to clean."));
  else console.log(pc.green(`  ✓ Cleaned ${removed} file(s)`));
}

// ─── native ───

function cmdNative(): void {
  console.log(pc.cyan("  Native engine:"));
  console.log(`    Status:   ${hasNative() ? pc.green("✓ loaded") : pc.yellow("✗ not found")}`);
  console.log(`    Version:  ${nativeVersion()}`);
  console.log(`    Platform: ${os.platform()}-${os.arch()}`);
  console.log(`    Node:     ${process.version}`);
  console.log(`    CWD:      ${process.cwd()}`);
}

// ─── doctor ───

function cmdDoctor(): void {
  console.log(pc.cyan("  🩺 GarurSaili Doctor\n"));

  const checks: { name: string; ok: boolean; msg: string }[] = [];

  checks.push({
    name: "Native engine",
    ok: hasNative(),
    msg: hasNative() ? `loaded (v${nativeVersion()})` : "NOT FOUND — run `npm run rust`",
  });

  const cfgPath = path.resolve(process.cwd(), "garur.config.js");
  checks.push({
    name: "Config file",
    ok: fs.existsSync(cfgPath),
    msg: fs.existsSync(cfgPath) ? "garur.config.js" : "missing — run `garur init`",
  });

  const distPath = path.resolve(process.cwd(), "dist");
  checks.push({
    name: "Output folder",
    ok: fs.existsSync(distPath),
    msg: fs.existsSync(distPath) ? "dist/" : "will be created on build",
  });

  const nodeMajor = parseInt(process.version.slice(1).split(".")[0]);
  checks.push({
    name: "Node version",
    ok: nodeMajor >= 18,
    msg: `${process.version}${nodeMajor >= 18 ? "" : " (requires >=18)"}`,
  });

  const files = findFiles(process.cwd(), DEFAULT_INCLUDES, DEFAULT_IGNORES);
  checks.push({
    name: "Source files",
    ok: files.length > 0,
    msg: `${files.length} file(s) matched`,
  });

  const cssPath = path.resolve(process.cwd(), "build/garur.css");
  checks.push({
    name: "CSS output",
    ok: fs.existsSync(cssPath),
    msg: fs.existsSync(cssPath)
      ? fmtBytes(fs.statSync(cssPath).size)
      : "run `garur build`",
  });

  for (const c of checks) {
    const icon = c.ok ? pc.green("✓") : pc.yellow("⚠");
    console.log(`  ${icon} ${c.name.padEnd(20)} ${pc.dim(c.msg)}`);
  }

  const failed = checks.filter((c) => !c.ok).length;
  console.log("");
  if (failed === 0) console.log(pc.green("  ✓ All checks passed!"));
  else console.log(pc.yellow(`  ⚠ ${failed} issue(s) found`));
}

// ─── stats ───

function cmdStats(): void {
  const cssPath = path.resolve(process.cwd(), "build/garur.css");
  const minPath = path.resolve(process.cwd(), "build/garur.min.css");

  if (!fs.existsSync(cssPath)) {
    console.log(pc.yellow("  No CSS output. Run `garur build` first."));
    return;
  }

  const css = fs.readFileSync(cssPath, "utf-8");
  const cssStats = fs.statSync(cssPath);
  const minStats = fs.existsSync(minPath) ? fs.statSync(minPath) : null;

  const lines = css.split("\n").length;
  const rules = (css.match(/\{[^}]*\}/g) || []).length;
  const mediaQueries = (css.match(/@media/g) || []).length;
  const keyframes = (css.match(/@keyframes/g) || []).length;
  const customProps = (css.match(/--[a-zA-Z0-9-]+:/g) || []).length;

  console.log(pc.cyan("  📈 CSS Statistics\n"));
  console.log(`    File:              ${path.relative(process.cwd(), cssPath)}`);
  console.log(`    Size (raw):        ${fmtBytes(cssStats.size)}`);
  console.log(`    Size (minified):   ${minStats ? fmtBytes(minStats.size) : "N/A"}`);
  console.log(`    Lines:             ${lines.toLocaleString()}`);
  console.log(`    Rules:             ${rules.toLocaleString()}`);
  console.log(`    Media queries:     ${mediaQueries}`);
  console.log(`    Keyframes:         ${keyframes}`);
  console.log(`    CSS variables:     ${customProps}`);
  console.log("");
}

// ─── analyze ───

function cmdAnalyze(
  includes: string[],
  ignores: string[],
  top: number = 15
): void {
  console.log(pc.cyan("  📊 Analyzing project...\n"));

  const result = buildOnce(process.cwd(), includes, ignores);
  if (!result) {
    console.log(pc.red("  No CSS generated."));
    return;
  }

  // Count utilities
  const classRe = /\.([a-zA-Z][a-zA-Z0-9_:\\/-]*)/g;
  const counts = new Map<string, number>();
  let m: RegExpExecArray | null;
  while ((m = classRe.exec(result.css)) !== null) {
    const cls = m[1].replace(/\\/g, "");
    counts.set(cls, (counts.get(cls) || 0) + 1);
  }

  // Group by base utility (strip variants & arbitrary)
  const byType = new Map<string, number>();
  for (const [cls] of counts) {
    const stripped = cls.replace(/^([a-z-]+:)+/i, "");
    const clean = stripped.replace(/\[[^\]]*\]/g, "");
    const prefix = clean.split("-")[0] || cls;
    byType.set(prefix, (byType.get(prefix) || 0) + 1);
  }

  const totalClasses = result.uniqueClasses;

  console.log(pc.bold("  Summary:"));
  console.log(`    Files scanned:      ${result.files.length}`);
  console.log(`    Unique classes:     ${totalClasses}`);
  console.log(`    CSS rules:          ${counts.size}`);
  console.log(`    CSS size:           ${fmtBytes(result.cssBytes)}`);
  console.log(`    Minified:           ${fmtBytes(result.minBytes)}`);
  console.log(`    Build time:         ${fmtMs(result.elapsedMs)}`);
  console.log(`    Compression:        ${((1 - result.minBytes / result.cssBytes) * 100).toFixed(1)}%`);

  console.log(pc.bold("\n  Top categories:"));
  const sorted = Array.from(byType.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, top);
  const max = sorted[0]?.[1] || 1;
  for (const [cat, count] of sorted) {
    const barStr = "█".repeat(Math.round((count / max) * 20));
    console.log(`    ${cat.padEnd(15)} ${pc.cyan(barStr)} ${count}`);
  }

  const suggestions: string[] = [];
  if (result.minBytes > 50 * 1024) suggestions.push("Consider splitting CSS");
  if (totalClasses > 500) suggestions.push("Large class count — review for unused");
  if (result.elapsedMs > 100) suggestions.push("Build time > 100ms — check for large files");

  if (suggestions.length > 0) {
    console.log(pc.bold("\n  💡 Suggestions:"));
    for (const s of suggestions) console.log(`    • ${s}`);
  }
  console.log("");
}

// ─── benchmark ───

function cmdBenchmark(runs: number = 5): void {
  console.log(pc.cyan(`  ⚡ Benchmarking (${runs} runs)...\n`));

  const cfg = loadConfig();
  applyConfig(cfg);

  const files = findFiles(process.cwd(), DEFAULT_INCLUDES, DEFAULT_IGNORES);
  console.log(pc.dim(`  ${files.length} files found\n`));

  const cfgJson = JSON.stringify({
    breakpoints: cfg.breakpoints,
    darkMode: cfg.darkMode,
    important: cfg.important,
    palette: cfg.palette,
  });

  const results: number[] = [];
  let lastBuildHits = 0;
  let lastBuildMisses = 0;
  let lastUnique = 0;

  for (let i = 0; i < runs; i++) {
    const start = Date.now();
    const stats = runSscWithStats(files, cfgJson);
    const elapsed = Date.now() - start;
    results.push(elapsed);
    lastBuildHits = stats.cacheHits;
    lastBuildMisses = stats.cacheMisses;
    lastUnique = stats.uniqueClasses;
    console.log(pc.dim(`    Run ${i + 1}: ${elapsed}ms (${fmtBytes(stats.css.length)})`));
  }

  const avg = results.reduce((a, b) => a + b, 0) / results.length;
  const min = Math.min(...results);
  const max = Math.max(...results);

  const totalCache = lastBuildHits + lastBuildMisses;
  const hitRate = totalCache > 0 ? (lastBuildHits / totalCache) * 100 : 0;

  console.log("");
  console.log(pc.bold("  Results:"));
  console.log(`    Files:        ${files.length}`);
  console.log(`    Classes:      ${lastUnique}`);
  console.log(`    Average:      ${pc.green(fmtMs(Math.round(avg)))}`);
  console.log(`    Min:          ${fmtMs(min)}`);
  console.log(`    Max:          ${fmtMs(max)}`);
  console.log("");
  console.log(pc.bold("  Cache performance:"));
  console.log(`    build      ${bar(hitRate, 20)} ${pc.bold(hitRate.toFixed(1) + "%")}  ${lastBuildHits.toLocaleString()}h / ${lastBuildMisses.toLocaleString()}m`);
  console.log("");
}

// ─── config ───

function cmdConfig(action?: string, key?: string): void {
  const cfgPath = path.resolve(process.cwd(), "garur.config.js");
  if (!fs.existsSync(cfgPath)) {
    console.log(pc.yellow("  No config. Run `garur init`."));
    return;
  }

  const cfg = loadConfig();

  if (!action || action === "show") {
    console.log(pc.cyan("  ⚙️  Config\n"));
    console.log(pc.bold("  Breakpoints:"));
    for (const [k, v] of Object.entries(cfg.breakpoints || {})) {
      console.log(`    ${k.padEnd(6)} ${v}`);
    }
    console.log(pc.bold("\n  Dark mode:  "), cfg.darkMode);
    console.log(pc.bold("  Important:  "), cfg.important);
    console.log(pc.bold("  Palette:    "), Object.keys(cfg.palette || {}).join(", ") || "(none)");
    console.log("");
    return;
  }

  if (action === "get" && key) {
    console.log(JSON.stringify((cfg as any)[key], null, 2));
    return;
  }

  if (action === "path") {
    console.log(cfgPath);
    return;
  }

  console.log(pc.yellow(`  Unknown action: ${action}`));
  console.log(pc.dim("  Usage: garur config [show|get <key>|path]"));
}

// ─── cache-stats ───

function cmdCacheStats(json: boolean = false): void {
  const stats = loadPersistentStats();
  const total = stats.cacheHits + stats.cacheMisses;
  const hitRate = total > 0 ? (stats.cacheHits / total) * 100 : 0;

  if (json) {
    console.log(JSON.stringify({
      total_builds: stats.totalBuilds,
      total_files: stats.totalFiles,
      total_classes: stats.totalClasses,
      cache_hits: stats.cacheHits,
      cache_misses: stats.cacheMisses,
      hit_rate: Math.round(hitRate * 10) / 10,
      first_build: stats.firstBuild,
      last_build: stats.lastBuild,
    }, null, 2));
    return;
  }

  console.log(pc.cyan("  📦 Cache Statistics\n"));

  if (stats.totalBuilds === 0) {
    console.log(pc.gray("  No build history yet."));
    console.log(pc.dim("  Run `garur build` or `garur watch` first.\n"));
    console.log(pc.dim("  Tip: Cache hit rate is measured per-process. Use ") +
      pc.cyan("garur benchmark") +
      pc.dim(" for accurate hit rate across runs.\n"));
    return;
  }

  console.log(`    Total builds:     ${stats.totalBuilds}`);
  console.log(`    Total files:      ${stats.totalFiles}`);
  console.log(`    Total classes:    ${stats.totalClasses}`);
  console.log(`    Cache hits:       ${pc.green(stats.cacheHits.toLocaleString())}`);
  console.log(`    Cache misses:     ${pc.yellow(stats.cacheMisses.toLocaleString())}`);
  console.log(`    Hit rate:         ${bar(hitRate)} ${pc.bold(hitRate.toFixed(1) + "%")}`);
  console.log("");
  console.log(pc.dim(`    First build:      ${stats.firstBuild || "—"}`));
  console.log(pc.dim(`    Last build:       ${stats.lastBuild || "—"}`));
  console.log("");
  console.log(pc.dim(`  Stats file: ${path.relative(process.cwd(), STATS_FILE())}`));
  console.log("");
  console.log(pc.yellow("  ⚠ Note: This is cross-process cumulative."));
  console.log(pc.dim("    Each cold `garur build` starts fresh — 0% is normal."));
  console.log(pc.dim("    Persistent cache is now enabled via ") + pc.cyan(".garur-cache.bin"));
  console.log(pc.dim("    Run ") + pc.cyan("garur benchmark") + pc.dim(" for in-process measurement."));
  console.log("");
}

function cmdCacheStatsReset(): void {
  resetPersistentStats();
  console.log(pc.green("  ✓ Cache stats reset"));
}

// ─── preview ───

async function cmdPreview(port: number = 3000): Promise<void> {
  const cwd = process.cwd();
  const distDir = path.resolve(cwd, "build");
  const cssPath = path.join(distDir, "garur.css");

  if (!fs.existsSync(cssPath)) {
    console.log(pc.yellow("  No CSS found. Building first..."));
    const result = buildOnce(cwd, DEFAULT_INCLUDES, DEFAULT_IGNORES);
    if (result) writeCss(cssPath, result);
  }

  const server = http.createServer((req, res) => {
    let url = (req.url || "/").split("?")[0];
    if (url === "/") url = "/example.html";

    let filePath = path.join(cwd, url);
    if (!filePath.startsWith(cwd)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(cwd, url, "index.html");
      if (!fs.existsSync(filePath)) {
        res.writeHead(404);
        res.end("Not Found");
        return;
      }
    }

    const ext = path.extname(filePath).toLowerCase();
    const mime: Record<string, string> = {
      ".html": "text/html; charset=utf-8",
      ".css": "text/css; charset=utf-8",
      ".js": "application/javascript; charset=utf-8",
      ".json": "application/json; charset=utf-8",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".svg": "image/svg+xml",
      ".ico": "image/x-icon",
      ".woff": "font/woff",
      ".woff2": "font/woff2",
    };
    res.writeHead(200, { "Content-Type": mime[ext] || "application/octet-stream" });
    fs.createReadStream(filePath).pipe(res);
  });

  server.listen(port, () => {
    console.log(pc.green(`  ✓ Preview server running`));
    console.log(`    Local:   ${pc.cyan(`http://localhost:${port}`)}`);
    console.log(pc.dim(`    Serving: ${cwd}\n`));
  });

  return new Promise(() => {});
}

// ─── format ───

function cmdFormat(): void {
  console.log(pc.cyan("  🎨 Formatting class strings...\n"));

  const files = findFiles(process.cwd(), FORMAT_INCLUDES, DEFAULT_IGNORES);
  console.log(pc.dim(`  Scanning ${files.length} markup files\n`));

  let changed = 0;

  const group = (cls: string): number => {
    const stripped = cls.replace(/^([a-z-]+:)+/i, "");
    if (/^container$/.test(stripped)) return 0;
    if (/^(fixed|absolute|relative|sticky|static)$/.test(stripped)) return 1;
    if (/^(block|inline|flex|grid|hidden|table|contents)/.test(stripped)) return 2;
    if (/^(items|justify|content|self|place)/.test(stripped)) return 3;
    if (/^(col|row|grid-)/.test(stripped)) return 4;
    if (/^(p|m|gap|space)-/.test(stripped)) return 5;
    if (/^(w|h|min|max|size)-/.test(stripped)) return 6;
    if (/^(text|font|leading|tracking|indent)/.test(stripped)) return 7;
    if (/^(bg|border|rounded|shadow|ring|outline)/.test(stripped)) return 8;
    if (/^(opacity|transform|rotate|scale|translate|skew)/.test(stripped)) return 9;
    if (/^(transition|duration|delay|ease|animate)/.test(stripped)) return 10;
    if (/^(cursor|select|pointer-events|resize)/.test(stripped)) return 11;
    if (/^(sm|md|lg|xl|2xl):/.test(cls)) return 13;
    return 12;
  };

  for (const file of files) {
    const content = fs.readFileSync(file, "utf-8");
    let updated = content;

    updated = updated.replace(
      /class(Name)?\s*=\s*"([^"]+)"/g,
      (match, name, classes) => {
        const parts = classes.trim().split(/\s+/).filter(Boolean);
        const sorted = [...parts].sort((a, b) => {
          const ga = group(a);
          const gb = group(b);
          if (ga !== gb) return ga - gb;
          return a.localeCompare(b);
        });
        const sortedStr = sorted.join(" ");
        if (sortedStr === parts.join(" ")) return match;
        return `class${name || ""}="${sortedStr}"`;
      }
    );

    if (updated !== content) {
      fs.writeFileSync(file, updated, "utf-8");
      changed++;
      console.log(pc.dim(`    Formatted: ${path.relative(process.cwd(), file)}`));
    }
  }

  console.log("");
  if (changed === 0) console.log(pc.gray("  No changes needed."));
  else console.log(pc.green(`  ✓ Formatted ${changed} file(s)`));
}

// ─── upgrade ───

function cmdUpgrade(): void {
  console.log(pc.cyan("  ⬆️  Checking for updates...\n"));

  try {
    const latest = execSync("npm view garursaili-css version", {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "ignore"],
    }).trim();

    if (latest === VERSION) {
      console.log(pc.green(`  ✓ Already on latest (${VERSION})`));
      return;
    }
    console.log(`    Current: ${VERSION}`);
    console.log(`    Latest:  ${pc.green(latest)}`);
    console.log("");
    console.log(pc.cyan("  Run:"));
    console.log(`    npm install -D garursaili-css@latest`);
  } catch {
    console.log(pc.yellow("  Could not check for updates."));
    console.log(pc.dim("  Are you online? Is the package published?"));
  }
}

// ─── watch ───

async function startWatch(
  cwd: string,
  includes: string[],
  ignores: string[],
  outputFile: string
): Promise<void> {
  console.log(pc.cyan("  🚀 Watch mode\n"));
  console.log(pc.dim(`  Patterns: ${includes.join(", ")}`));
  console.log(pc.dim(`  Output:   ${path.relative(cwd, outputFile)}\n`));

  console.log(pc.cyan("  Initial build..."));
  const initial = buildOnce(cwd, includes, ignores);
  if (initial) {
    writeCss(outputFile, initial);
    console.log(
      pc.green(`  ✓ Built in ${initial.elapsedMs}ms`) +
        pc.dim(` (${initial.files.length} files, ${initial.uniqueClasses} classes, ${fmtBytes(initial.cssBytes)})`)
    );
  }

  console.log(pc.green("\n  👀 Watching for changes..."));
  console.log(pc.dim("  Press Ctrl+C to stop\n"));

  let debounceTimer: NodeJS.Timeout | null = null;
  let buildCount = 0;
  let isBuilding = false;
  let pendingRebuild = false;

  const runRebuild = async () => {
    if (isBuilding) {
      pendingRebuild = true;
      return;
    }
    isBuilding = true;
    buildCount++;

    try {
      const result = buildOnce(cwd, includes, ignores);
      if (result) {
        writeCss(outputFile, result);
        const time = new Date().toLocaleTimeString();
        console.log(
          pc.dim(`  [${time}] `) +
            pc.green(`✓ #${buildCount}`) +
            pc.dim(
              ` in ${result.elapsedMs}ms — ${result.files.length} files, ${result.uniqueClasses} classes, ${fmtBytes(result.cssBytes)}`
            )
        );
      }
    } catch (e) {
      console.error(pc.red(`  ✗ Rebuild error:`), (e as Error).message);
    } finally {
      isBuilding = false;
      if (pendingRebuild) {
        pendingRebuild = false;
        setTimeout(runRebuild, 50);
      }
    }
  };

  const triggerRebuild = () => {
    if (isBuilding) {
      pendingRebuild = true;
      return;
    }
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(runRebuild, 80);
  };

  const watchedDirs = new Set<string>();
  const watchers: fs.FSWatcher[] = [];

  const shouldIgnore = (p: string): boolean => {
    const norm = p.replace(/\\/g, "/");
    return (
      norm.includes("/node_modules/") ||
      norm.includes("/dist/") ||
      norm.includes("/.git/") ||
      norm.includes("/rust/target/") ||
      norm.endsWith(".node") ||
      norm.endsWith(".log")
    );
  };

  const shouldWatch = (p: string): boolean => {
    const ext = path.extname(p).toLowerCase();
    return [
      ".html", ".htm", ".js", ".jsx", ".ts", ".tsx",
      ".vue", ".svelte", ".astro", ".php", ".mdx",
    ].includes(ext);
  };

  const watchDir = (dir: string) => {
    if (watchedDirs.has(dir)) return;
    watchedDirs.add(dir);

    try {
      const watcher = fs.watch(dir, { persistent: true }, (_event, filename) => {
        if (!filename) return;
        const fullPath = path.join(dir, filename);
        if (shouldIgnore(fullPath)) return;
        if (!shouldWatch(fullPath)) return;
        triggerRebuild();
      });
      watchers.push(watcher);
    } catch { /* skip */ }

    try {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (!entry.isDirectory()) continue;
        if (entry.name.startsWith(".")) continue;
        if (["node_modules", "dist", "target"].includes(entry.name)) continue;
        watchDir(path.join(dir, entry.name));
      }
    } catch { /* skip */ }
  };

  watchDir(cwd);
  console.log(pc.dim(`  Watching ${watchedDirs.size} directories...\n`));

  return new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      console.log(pc.yellow(`\n  Stopping... (${buildCount} rebuilds)`));
      for (const w of watchers) try { w.close(); } catch { /* ignore */ }
      resolve();
    });
  });
}

// ═══════════════════════════════════════════════════════════════
// Help
// ═══════════════════════════════════════════════════════════════

function printHelp(): void {
  console.log(pc.bold(pc.cyan("\n  🦅 GarurSaili-CSS CLI\n")));

  console.log(pc.bold("  Setup:"));
  console.log("    garur init [--force]        Create garur.config.js");
  console.log("    garur example               Create example.html");
  console.log("    garur all                   init + example");
  console.log("");

  console.log(pc.bold("  Build:"));
  console.log("    garur                       Build CSS (one-shot)");
  console.log("    garur [patterns...]         Custom patterns");
  console.log("    garur --output <file>       Custom output path");
  console.log("    garur -o <file>             Short form");
  console.log("");

  console.log(pc.bold("  Development:"));
  console.log("    garur watch                 Watch mode (real-time)");
  console.log("    garur preview [--port N]    Start live preview server");
  console.log("    garur -w                    Short for watch");
  console.log("");

  console.log(pc.bold("  Analysis:"));
  console.log("    garur analyze               Analyze CSS output");
  console.log("    garur stats                 Show CSS statistics");
  console.log("    garur benchmark [--runs N]  Performance benchmark");
  console.log("    garur doctor                Diagnose issues");
  console.log("");

  console.log(pc.bold("  Cache:"));
  console.log("    garur cache-stats           Cumulative cache stats");
  console.log("    garur cache-stats --json    Machine-readable JSON");
  console.log("    garur cache-stats-reset     Reset counters to zero");
  console.log("");

  console.log(pc.bold("  Tools:"));
  console.log("    garur format                Sort class attributes");
  console.log("    garur config [show|path]    View configuration");
  console.log("    garur clean                 Remove cache + output");
  console.log("    garur native                Check native engine");
  console.log("    garur upgrade               Check for updates");
  console.log("");

  console.log(pc.bold("  Info:"));
  console.log("    garur --version, -v         Show version");
  console.log("    garur --help, -h            Show help");
  console.log("");

  console.log(pc.bold("  Examples:"));
  console.log(pc.gray("    garur init && garur watch"));
  console.log(pc.gray("    garur build src/**/*.tsx"));
  console.log(pc.gray("    garur benchmark --runs 10"));
  console.log(pc.gray("    garur cache-stats"));
  console.log("");
}

// ═══════════════════════════════════════════════════════════════
// Main
// ═══════════════════════════════════════════════════════════════

async function main(): Promise<void> {
  console.log(banner);
  console.log(tagline);

  const args = minimist(process.argv.slice(2), {
    boolean: [
      "init", "example", "all", "clean", "help", "version", "native",
      "watch", "debug", "force", "doctor", "stats", "analyze", "format",
      "benchmark", "upgrade", "preview", "json",
    ],
    alias: {
      i: "init", e: "example", a: "all",
      v: "version", h: "help", w: "watch",
      o: "output", p: "port",
    },
    string: ["output"],
    default: { port: 3000, runs: 5, top: 15 },
  });

  const cmd = (args._[0] || "").toString();
  if (args.debug) process.env.GARUR_DEBUG = "1";

  // ─── Version ───
  if (args.version || cmd === "version") {
    console.log(pc.bold(pc.cyan(`  GarurSaili-CSS v${VERSION}`)));
    return;
  }

  // ─── Help ───
  if (args.help || cmd === "help") {
    printHelp();
    return;
  }

  // ─── Setup ───
  if (args.init || cmd === "init") { cmdInit(args.force); return; }
  if (args.example || cmd === "example") { cmdExample(); return; }
  if (args.all || cmd === "all") { cmdInit(args.force); cmdExample(); return; }

  // ─── Info ───
  if (args.native || cmd === "native") { cmdNative(); return; }
  if (args.doctor || cmd === "doctor") { cmdDoctor(); return; }

  // ─── Cache stats ───
  if (cmd === "cache-stats") { cmdCacheStats(args.json); return; }
  if (cmd === "cache-stats-reset") { cmdCacheStatsReset(); return; }

  // ─── Cleanup ───
  if (args.clean || cmd === "clean") { cmdClean(); return; }

  // ─── Analysis ───
  if (args.stats || cmd === "stats") { cmdStats(); return; }

  if (args.analyze || cmd === "analyze") {
    const patterns = (args._ as string[]).filter((a) => a !== "analyze");
    const includes = patterns.length ? patterns : DEFAULT_INCLUDES;
    cmdAnalyze(includes, DEFAULT_IGNORES, args.top || 15);
    return;
  }

  if (args.benchmark || cmd === "benchmark") {
    cmdBenchmark(parseInt(String(args.runs), 10) || 5);
    return;
  }

  // ─── Tools ───
  if (args.format || cmd === "format") { cmdFormat(); return; }

  if (cmd === "config") {
    cmdConfig(
      args._[1] as string | undefined,
      args._[2] as string | undefined
    );
    return;
  }

  if (args.upgrade || cmd === "upgrade") { cmdUpgrade(); return; }

  // ─── Preview ───
  if (args.preview || cmd === "preview") {
    await cmdPreview(parseInt(String(args.port), 10) || 3000);
    return;
  }

  // ─── Build / Watch ───
  const cwd = process.cwd();
  const KNOWN_CMDS = new Set([
    "init", "example", "all", "clean", "native", "help", "version", "watch",
    "doctor", "stats", "analyze", "format", "benchmark", "upgrade", "preview",
    "config", "cache-stats", "cache-stats-reset",
  ]);

  const positionalPatterns = (args._ as string[]).filter(
    (a) => typeof a === "string" && !KNOWN_CMDS.has(a)
  );

  const includes: string[] = positionalPatterns.length
    ? positionalPatterns
    : DEFAULT_INCLUDES;

  const outputFile = path.resolve(
  cwd,
  (args.output as string) || (args.o as string) || "build/garur.css"
);

  // ─── Watch mode ───
  if (args.watch || args.w || cmd === "watch") {
    await startWatch(cwd, includes, DEFAULT_IGNORES, outputFile);
    return;
  }

  // ─── Default: build ───
  console.log(pc.dim(`  Native:   ${hasNative() ? pc.green("✓") : pc.yellow("✗")}`));
  console.log(pc.dim(`  Patterns: ${includes.join(", ")}`));

  const result = buildOnce(cwd, includes, DEFAULT_IGNORES);
  if (!result) {
    if (!hasNative()) {
      console.log(pc.red("\n  ❌ Native core not loaded.\n"));
      console.log(pc.yellow("  Fix:"));
      console.log("    1) cd rust && napi build --platform --release");
      console.log("    2) cp rust/garur_core.linux-x64-gnu.node ./");
      console.log("    3) garur native\n");
    } else {
      console.log(pc.yellow("\n  No source files matched.\n"));
    }
    return;
  }

    writeCss(outputFile, result);

  const persist = loadPersistentStats();
  const cumTotal = persist.cacheHits + persist.cacheMisses;
  const cumRate = cumTotal > 0 ? (persist.cacheHits / cumTotal) * 100 : 0;

  console.log(pc.green(`\n  ✓ Built in ${result.elapsedMs}ms`));
  console.log(
    `    ${path.relative(cwd, outputFile)}  ${fmtBytes(result.cssBytes)}`
  );
  console.log(
    `    ${path.relative(cwd, outputFile).replace(/\.css$/, ".min.css")}  ${fmtBytes(result.minBytes)}`
  );
  console.log("");

  console.log(pc.bold("  Stats:"));
  console.log(`    Files scanned:    ${result.files.length}`);
  console.log(`    Unique classes:   ${result.uniqueClasses}`);
  console.log("");
  console.log(pc.bold("  Cumulative:"));
  console.log(`    Total builds:     ${persist.totalBuilds}`);
  console.log(`    Cache hits:       ${persist.cacheHits.toLocaleString()}`);
  console.log(`    Cache misses:     ${persist.cacheMisses.toLocaleString()}`);
  console.log(`    Overall rate:     ${bar(cumRate)} ${pc.bold(cumRate.toFixed(1) + "%")}`);
  console.log("");
  console.log(pc.dim(`    Tip: `) + pc.cyan("garur benchmark") + pc.dim(" for accurate hit rate"));
  console.log(pc.dim(`    ${funMessages[Math.floor(Math.random() * funMessages.length)]}\n`));

}

main().catch((e) => {
  console.error(pc.red("\n  Error:"), e);
  process.exit(1);
});