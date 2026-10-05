// bench-cold.mjs
// tests/bench-cold.mjs
import { runSsc, findFiles, clearCache, getCacheStats } from '../src/native.ts';
import { loadConfig, applyConfig } from '../src/config.ts';

const cfg = loadConfig();
applyConfig(cfg);

const files = findFiles(process.cwd(), ['**/*.{html,js,ts,tsx,vue,svelte}'], ['node_modules/**','dist/**']);
const cfgJson = JSON.stringify({
  breakpoints: cfg.breakpoints, darkMode: cfg.darkMode,
  important: cfg.important, palette: cfg.palette,
});

// ── COLD ──
clearCache();
let t = performance.now();
const coldCss = runSsc(files, cfgJson);
const coldMs = performance.now() - t;
console.log(`COLD: ${coldMs.toFixed(2)}ms, ${coldCss.length} bytes`);

// ── WARM ──
t = performance.now();
runSsc(files, cfgJson);
const warmMs = performance.now() - t;
console.log(`WARM: ${warmMs.toFixed(2)}ms`);

// ── STATS ──
console.log(getCacheStats());