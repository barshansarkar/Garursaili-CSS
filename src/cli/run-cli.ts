/**
 * ---------------------------------------------------------------------
 *  GARUR-CSS — Ultra-fast Atomic CSS Engine
 *  Author: Barshan Sarkar
 *  Version: 1.0.0
 *  License: MIT
 * ---------------------------------------------------------------------
 *
 *  This CLI powers the Garur-CSS ecosystem. It handles:
 *    • SSC ( SUPER SONIC CYCLONE ) compilation of utility classes
 *    • File scanning across HTML / JS / TS / JSX / TSX
 *    • Cache management and orphan-class detection
 *    • Config file creation (garur.config.js)
 *    • Plugin boilerplate generation
 *    • Watch mode for real-time builds ,, (coming soon)
 *
 *  Technologies:
 *    - TypeScript
 *    - Rollup bundling (CJS-compatible output)
 *    - Node.js (CLI execution via shebang)
 *
 *  Notes for contributors:
 *    • Keep the CLI ESM/CJS compatible.
 *    • Avoid dynamic require unless wrapped safely.
 *    • Keep output messages clean, fast, and developer-friendly.
 *
 *  Made in India.
 * ---------------------------------------------------------------------
 */

// src/tests/run-ci-tests.ts
// Simple Node test harness to run a set of handler/builder assertions for CI.
// Exit with non-zero code on failures so CI can detect regressions.

import { build } from "../core/builder";
import { handle } from "../core/handler";
import assert from "assert";

type Test = { input: string; expectNonNull?: boolean; expectContains?: string[] };

const tests: Test[] = [
  { input: "p-4", expectNonNull: true, expectContains: ["padding"] },
  { input: "bg-red-500", expectNonNull: true, expectContains: ["background-color"] },
  { input: "bg-#fff", expectNonNull: true, expectContains: ["#fff"] },
  { input: "text-[var(--my)]", expectNonNull: true, expectContains: ["var(--my)"] },
  { input: "space-x-4", expectNonNull: true, expectContains: ["margin-left"] },
  { input: "divide-x-2", expectNonNull: true, expectContains: ["border-left-width"] },
  { input: "grid-cols-3", expectNonNull: true, expectContains: ["grid-template-columns"] },
  { input: "animate-spin", expectNonNull: true, expectContains: ["animation", "@keyframes"] },
  { input: "rg-red-500/6", expectNonNull: true, expectContains: ["--garur-ring-color", "box-shadow"] },
  { input: "container", expectNonNull: true },
  { input: "object-cover", expectNonNull: true, expectContains: ["object-fit"] },
  { input: "form-input", expectNonNull: true, expectContains: ["border"] },
  { input: "table", expectNonNull: true, expectContains: ["border-collapse", "tbody"] },
  { input: "glass", expectNonNull: true, expectContains: ["backdrop-filter"] }, // from demo-plugin
];

console.log("Running CI tests...");

let failed = 0;
for (const t of tests) {
  const out = build(t.input);
  try {
    if (t.expectNonNull && out == null)
      throw new Error(`expected non-null but got null`);

    if (t.expectContains && out) {
      for (const s of t.expectContains) {
        if (!out.includes(s))
          throw new Error(`expected "${s}" in rule, got: ${out}`);
      }
    }

    console.log(`✅ PASS: ${t.input}`);
  } catch (err: any) {
    failed++;
    console.error(`❌ FAIL: ${t.input}\n  ${err.message}`);
  }
}


if (failed > 0) {
  console.error(`${failed} tests failed`);
  process.exit(2);
}
console.log("All tests passed")