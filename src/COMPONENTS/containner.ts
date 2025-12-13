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

import { ComponentBase } from "../components";

export const Container: Record<string, ComponentBase> = {
  container: {
    base: {
      width: "100%",
      margin: "0 auto",
      "max-width": "1000px",
      padding: "0 1rem",
      display: "block",
      "box-sizing": "border-box",
      "@media (min-width: 1025px)": {
        padding: "0 2rem",
      },
      "@media (max-width: 640px)": {
        padding: "0 0.75rem",
      },
    },
  },
  containerFluid: {
    base: {
      width: "100%",
      padding: "0 1rem",
      "box-sizing": "border-box",
      "@media (min-width: 1025px)": {
        padding: "0 2rem",
      },
      "@media (max-width: 640px)": {
        padding: "0 0.75rem",
      },
    },
  },
};