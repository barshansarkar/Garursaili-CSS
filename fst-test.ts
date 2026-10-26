import { buildPrefixIndex, findMatchingPlugins } from "./src/native.js";

buildPrefixIndex([
  ["glow-", "neon"],
  ["prose", "typography"],
  ["glass", "glass-plugin"],
]);

const matched = findMatchingPlugins(["glow-md", "prose", "p-4"]);
console.log("Matched:", matched);
