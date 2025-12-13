import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import { terser } from "rollup-plugin-terser";

export default [

  // MAIN LIB (ESM + CJS)

  {
    input: "src/index.ts",
    output: [
      { file: "dist/garur.esm.js", format: "esm" },
      { file: "dist/garur.cjs", format: "cjs" }
    ],
    plugins: [
      resolve(),
      commonjs(),
      json(),
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: false
      }),
      terser()
    ],
    external: [
      'fs','path','crypto','url','os','child_process',
      'minimist', 'picocolors', 'ora', 'chalk',
      'fast-glob', 'css.escape', 'chokidar'
    ]
  },


  // CLI BUNDLE

{
  input: "src/cli/cli.ts",
  output: {
    file: "dist/cli.cjs",
    format: "cjs",
    banner: "#!/usr/bin/env node\n",
    sourcemap: false,
    inlineDynamicImports: true
  },
  plugins: [
    resolve(),
    commonjs(),
    json(),
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: false,

      module: "esnext",
      target: "es2019"
    })
  ],
  external: [
    "fs", "path", "url", "os", "child_process",
    "minimist", "picocolors", "ora"
  ]
}
];
