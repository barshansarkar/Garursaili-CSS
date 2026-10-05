
import { runSsc, findFiles, clearCache, getCacheStats, resetCacheStats } from '../src/native.ts';
import { loadConfig, applyConfig } from '../src/config.ts';

const cfg = loadConfig();
applyConfig(cfg);

const files = findFiles(
  process.cwd(),
  ['**/*.{html,js,ts,tsx,vue,svelte}'],
  ['node_modules/**','dist/**','target/**','.git/**']
);

const cfgJson = JSON.stringify({
  breakpoints: cfg.breakpoints, darkMode: cfg.darkMode,
  important: cfg.important, palette: cfg.palette,
});

console.log(`\n📁 Files: ${files.length}\n`);

// ── COLD (fresh cache) ──
clearCache();
let t = performance.now();
const coldCss = runSsc(files, cfgJson);
const coldMs = performance.now() - t;
const coldStats = getCacheStats();
console.log(`❄️  COLD   ${coldMs.toFixed(2).padStart(8)}ms  |  ${coldStats.build_misses} misses  |  ${(coldCss.length/1024).toFixed(2)} KB`);

// ── WARM (5 iterations, same process) ──
console.log('');
const warmTimes = [];
for (let i = 0; i < 5; i++) {
  resetCacheStats();
  t = performance.now();
  runSsc(files, cfgJson);
  const ms = performance.now() - t;
  warmTimes.push(ms);
  console.log(`🔥 WARM #${i+1} ${ms.toFixed(2).padStart(8)}ms`);
}

const avg = warmTimes.reduce((a,b) => a+b, 0) / warmTimes.length;
const min = Math.min(...warmTimes);

// ── Final stats ──
resetCacheStats();
runSsc(files, cfgJson);
const s = getCacheStats();
const rate = s.build_hits / (s.build_hits + s.build_misses) * 100;

console.log('');
console.log(`📊 Summary`);
console.log(`   Cold:      ${coldMs.toFixed(2)}ms`);
console.log(`   Warm avg:  ${avg.toFixed(2)}ms`);
console.log(`   Warm min:  ${min.toFixed(2)}ms`);
console.log(`   Speedup:   ${(coldMs / avg).toFixed(1)}x`);
console.log(`   Hit rate:  ${rate.toFixed(1)}%  (${s.build_hits} hits / ${s.build_entries} entries)`);
console.log('');
