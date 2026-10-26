import { applyConfig } from "./src/config.js";
import { bootstrapPluginsLazy } from "./src/plugin_runner.js";
import { build } from "./src/native.js";
import path from "node:path";
import { pathToFileURL } from "node:url";

async function main() {
  // Load native module directly
  const native = require("./garur_core.linux-x64-gnu.node");
  console.log("=== Native bindings ===");
  console.log("registerPluginBulk:", typeof native.registerPluginBulk);
  console.log("pluginUtilityCount:", typeof native.pluginUtilityCount);

  // Load config
  const cfgMod = await import(pathToFileURL(path.resolve("garur.config.js")).href);
  const cfg = cfgMod.default;
  applyConfig(cfg);

  // Check before
  if (typeof native.pluginUtilityCount === "function") {
    console.log("\n=== BEFORE bootstrap ===");
    console.log("PLUGIN_UTILS count:", native.pluginUtilityCount());
  }

  // Bootstrap
  const classes = new Set(["apple-glass-card", "drop-water-bubble", "p-8"]);
  await bootstrapPluginsLazy(cfg, classes);

  // Check after
  if (typeof native.pluginUtilityCount === "function") {
    console.log("\n=== AFTER bootstrap ===");
    console.log("PLUGIN_UTILS count:", native.pluginUtilityCount());
  }

  // Try build directly
  console.log("\n=== build() tests ===");
  const a = build("apple-glass-card", false);
  const b = build("drop-water-bubble", false);
  const c = build("p-8", false);
  const d = build("chrome-text", false);

  console.log("build apple-glass-card:", a ? a.slice(0, 120) : "❌ null");
  console.log("build drop-water-bubble:", b ? b.slice(0, 120) : "❌ null");
  console.log("build chrome-text:", d ? d.slice(0, 120) : "❌ null");
  console.log("build p-8:", c ? c.slice(0, 80) : "❌ null");
}
main().catch(e => { console.error(e); process.exit(1); });
