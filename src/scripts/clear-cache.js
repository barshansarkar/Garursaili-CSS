// scripts/clear-cache.js
// Remove known garur cache files so JIT starts fresh.
// Usage: node scripts/clear-cache.js

const fs = require("fs");
const path = require("path");

const candidates = [
  path.resolve(process.cwd(), "dist", ".garur-cache.json"),
  path.resolve(process.cwd(), ".garur-cache.json"),
  path.resolve(process.cwd(), "node_modules", ".garur-cache.json"),
];

let removed = 0;
for (const p of candidates) {
  try {
    if (fs.existsSync(p)) {
      fs.unlinkSync(p);
      console.log("Removed cache:", p);
      removed++;
    }
  } catch (err) {
    console.warn("Failed to remove", p, err && err.message ? err.message : err);
  }
}

if (removed === 0) {
  console.log("No cache files found in standard locations. If your cache uses a different path, delete it manually.");
} else {
  console.log(`Removed ${removed} file(s). Run the build again: npx tsc && node dist/cli.js`);
}