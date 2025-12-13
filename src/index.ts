//  Garur-CSS Entry Point
// Connects all modules and starts the JIT engine

import { runJIT } from "./core/ssc";

async function start() {
  console.log(" Garur-CSS v0.1 Beta Starting...");
  await runJIT();
  console.log(" Build complete: dist/garur.css generated");
}

start(); // past
// for test

// yah

//-------
// ### #