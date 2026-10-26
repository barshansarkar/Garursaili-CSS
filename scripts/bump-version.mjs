#!/usr/bin/env node
/**
 * GarurSaili-CSS — Atomic version bump
 *
 * Usage:
 *   node scripts/bump-version.mjs 1.5.4
 *
 * Updates version in:
 *   - package.json (root)
 *   - package.json optionalDependencies (all platform pkgs)
 *   - rust/Cargo.toml
 *   - src/cli.ts (fallback)
 *   - rust/src/engine.rs (header comment)
 *   - rust/src/ssc.rs (header comment)
 *   - rust/src/lib.rs (header comment, if exists)
 *
 * Does NOT:
 *   - Touch plugin versions (those are independent)
 *   - Commit or tag (user does manually)
 */
import fs from "node:fs";
import path from "node:path";

const newVersion = process.argv[2];
if (!newVersion || !/^\d+\.\d+\.\d+/.test(newVersion)) {
  console.error("Usage: node scripts/bump-version.mjs <MAJOR.MINOR.PATCH>");
  console.error("Example: node scripts/bump-version.mjs 1.5.4");
  process.exit(1);
}

const root = process.cwd();
let updated = 0;
let skipped = 0;

function updateFile(relPath, transform) {
  const fullPath = path.resolve(root, relPath);
  if (!fs.existsSync(fullPath)) {
    console.log(`  ⏭  ${relPath} (not found)`);
    skipped++;
    return;
  }
  const before = fs.readFileSync(fullPath, "utf-8");
  const after = transform(before);
  if (after === before) {
    console.log(`  ⏭  ${relPath} (no change)`);
    skipped++;
    return;
  }
  fs.writeFileSync(fullPath, after);
  console.log(`  ✅ ${relPath}`);
  updated++;
}

console.log(`\n📦 Bumping to ${newVersion}\n`);

// ─── 1. package.json ───
updateFile("package.json", (src) => {
  const pkg = JSON.parse(src);
  pkg.version = newVersion;
  if (pkg.optionalDependencies) {
    for (const k of Object.keys(pkg.optionalDependencies)) {
      pkg.optionalDependencies[k] = newVersion;
    }
  }
  return JSON.stringify(pkg, null, 2) + "\n";
});

// ─── 2. rust/Cargo.toml ───
updateFile("rust/Cargo.toml", (src) =>
  src.replace(/^version\s*=\s*"[^"]+"/m, `version = "${newVersion}"`)
);

// ─── 3. src/cli.ts (fallback) ───
updateFile("src/cli.ts", (src) =>
  src.replace(
    /return\s+"\d+\.\d+\.\d+";/g,
    `return "${newVersion}";`
  )
);

// ─── 4. Rust headers ───
const rustHeaders = [
  "rust/src/engine.rs",
  "rust/src/ssc.rs",
  "rust/src/lib.rs",
];
for (const f of rustHeaders) {
  updateFile(f, (src) =>
    src.replace(/\/\/\s*Version:\s*\d+\.\d+\.\d+/g, `// Version: ${newVersion}`)
  );
}

console.log(`\n📊 Summary:`);
console.log(`   Updated: ${updated}`);
console.log(`   Skipped: ${skipped}`);
console.log(`\n${updated > 0 ? "✓" : "⚠"} Now run:`);
console.log("   cd rust && napi build --platform --release");
console.log("   cp garur_core.linux-x64-gnu.node ../");
console.log("   cd .. && npm run build");
console.log("");
