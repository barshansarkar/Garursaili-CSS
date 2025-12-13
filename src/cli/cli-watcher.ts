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

// src/cli-watch.ts
// it's 6:03 am and this is the last file before i finally pass out
// why am i even writing a watch mode. who asked for this. i just want sleep

import chokidar from "chokidar";
import path from "path";
import { runJITIncremental } from "../core/ssc";

// i hate async main functions but here we are
async function main() {
  const args = process.argv.slice(2);

  const patterns = args.length ? args : ["**/*.{html,ts,js,jsx,tsx}"];

  console.log("Starting Garur-CSS watch for patterns:", patterns.join(", "));
  console.log("if this crashes again im deleting the entire repo");

  // Initial full build — pls work just once
  try {
    // yes i'm dynamically importing because static import broke for some reason at 4am
    const jit = await import("../core/ssc");
    if (jit.runJIT) {
      await jit.runJIT(patterns as any);
      console.log("Initial build done. miracle achieved.");
    } else {
      console.log("runJIT not found lol ok guess we're skipping initial build");
    }
  } catch (e) {
    console.warn("Initial build failed as expected:", e);
    console.warn("moving on because nothing matters anymore");
  }

  const watcher = chokidar.watch(patterns, {
    ignored: /node_modules|dist|\.git/,
    ignoreInitial: true,   // thank god
    persistent: true,
    cwd: process.cwd(),
  });

  let pending = new Set<string>();
  let timer: NodeJS.Timeout | null = null;

  function scheduleFlush() {
    if (timer) clearTimeout(timer);

    timer = setTimeout(async () => {
      const files = Array.from(pending);
      pending.clear();

      if (files.length === 0) return;

      try {
        await runJITIncremental(files);
        console.log(`[Garur] Rebuilt ${files.length} file${files.length > 1 ? 's' : ''} @ ${new Date().toLocaleTimeString()}`);
      } catch (e) {
        console.error("[Garur] Incremental build exploded again:", e);
        console.error("why do i even try");
      }
    }, 120); // 120ms debounce because 100 wasn't enough and 200 felt slow
  }

  watcher.on("add", p => {
    pending.add(path.resolve(p));
    scheduleFlush();
  });

  watcher.on("change", p => {
    pending.add(path.resolve(p));
    scheduleFlush();
  });

  watcher.on("unlink", p => {
    pending.add(path.resolve(p)); // yes even deleted files trigger rebuild
    scheduleFlush();
  });

  // goodbye cruel world
  process.on("SIGINT", () => {
    console.log("\nshutting down... finally");
    watcher.close().then(() => process.exit(0));
  });

  console.log("Watcher running. send coffee.");
}

// run it or crash trying
main().catch(err => {
  console.error("watch mode died a horrible death:", err);
  process.exit(1);
});