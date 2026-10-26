import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const name = process.argv[2];
if (!name) {
  console.error("Usage: node scripts/create-plugin.mjs <plugin-name>");
  process.exit(1);
}

const safeName = name.replace(/^@[^/]+\//, "").replace(/^plugin-/, "").replace(/^garursaili-plugin-/, "");
const pkgName = name.startsWith("@") ? name : "@garursaili/plugin-" + safeName;
const dir = path.join(process.cwd(), "plugin-" + safeName);

if (existsSync(dir)) {
  console.error("Directory already exists: " + dir);
  process.exit(1);
}

mkdirSync(dir, { recursive: true });

writeFileSync(path.join(dir, "package.json"), JSON.stringify({
  name: pkgName,
  version: "1.0.0",
  description: "GarurSaili-CSS plugin",
  type: "module",
  main: "./dist/index.js",
  types: "./dist/index.d.ts",
  files: ["dist"],
  keywords: ["garur-plugin"],
  peerDependencies: { "garursaili-css": "^1.5.0" },
  scripts: { build: "tsc" },
}, null, 2) + "\n");

writeFileSync(path.join(dir, "tsconfig.json"), JSON.stringify({
  extends: "../tsconfig.base.json",
  compilerOptions: { outDir: "./dist", rootDir: "." },
  include: ["index.ts"],
}, null, 2) + "\n");

writeFileSync(path.join(dir, "index.ts"), `import { definePlugin } from "garursaili-css";

export default definePlugin({
  name: "${pkgName}",
  version: "1.0.0",
  setup(api) {
    // Add your utilities here:
    api.addUtility("my-class", { color: "red" });

    // Or batch register:
    // api.addUtilities({ ... });

    // Match utilities (dynamic):
    // api.matchUtilities({ "my-util": (v) => ({ padding: v }) }, { values: { sm: "4px", DEFAULT: "8px" } });

    // Register tokens:
    // api.defineToken("my-var", "#ff0099");
  },
});
`);

console.log("✅ Created " + pkgName);
console.log("   cd " + path.relative(process.cwd(), dir));
console.log("   npm run build && npm publish --access public");
