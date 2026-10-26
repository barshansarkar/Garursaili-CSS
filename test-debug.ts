import { createRequire } from "node:module";
import { applyConfig } from "./src/config.js";
import { bootstrapPluginsLazy } from "./src/plugin_runner.js";
import { build, hasNative, nativeSource } from "./src/native.js";
import path from "node:path";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);

async function main() {
  console.log("=== Native source ===");
  console.log("loaded from:", nativeSource());

  const native = require("./garur_core.linux-x64-gnu.node");
  console.log("version:", native.version());
  console.log("registerPluginBulk:", typeof native.registerPluginBulk);
  console.log("pluginUtilityCount:", typeof native.pluginUtilityCount);

  const cfgMod = await import(pathToFileURL(path.resolve("garur.config.js")).href);
  const cfg = cfgMod.default;
  applyConfig(cfg);

  console.log("\n=== BEFORE bootstrap ===");
  console.log("PLUGIN_UTILS count:", native.pluginUtilityCount?.() ?? "N/A");

  await bootstrapPluginsLazy(cfg, new Set(["apple-glass-card", "p-8", "chrome-text"]));

  console.log("\n=== AFTER bootstrap ===");
  console.log("PLUGIN_UTILS count:", native.pluginUtilityCount?.() ?? "N/A");

  console.log("\n=== build() tests ===");
  for (const cls of ["apple-glass-card", "chrome-text", "p-8"]) {
    const r = build(cls, false);
    console.log(cls + ":", r ? r.slice(0, 150) : "❌ NULL");
  }
}

main().catch(e => { console.error("ERROR:", e.message); process.exit(1); });
