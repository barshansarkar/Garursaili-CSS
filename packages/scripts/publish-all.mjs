import { execSync } from "node:child_process";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import path from "node:path";

const VERSION = process.argv[2] || "1.0.0";
const dirs = readdirSync(process.cwd(), { withFileTypes: true })
  .filter((d) => d.isDirectory() && d.name.startsWith("plugin-"))
  .map((d) => path.join(process.cwd(), d.name));

console.log("\n📦 Publishing " + dirs.length + " plugins at v" + VERSION + "\n");

for (const dir of dirs) {
  const pkgPath = path.join(dir, "package.json");
  if (!existsSync(pkgPath)) continue;
  const name = JSON.parse(readFileSync(pkgPath, "utf-8")).name;
  console.log("  → " + name + "@" + VERSION);
  try {
    execSync("npm version " + VERSION + " --no-git-tag-version", { cwd: dir, stdio: "pipe" });
    execSync("npm run build", { cwd: dir, stdio: "pipe" });
    execSync("npm publish --access public", { cwd: dir, stdio: "pipe" });
    console.log("  ✅ " + name + "\n");
  } catch (e) {
    console.error("  ❌ " + name + ": " + e.message + "\n");
  }
}
console.log("🎉 Done.\n");
