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
import {textLight,textDark,borderColorLight} from "../CORECONST"
export const footer: Record<string, ComponentBase> = {
    footer: {
        base: {
          padding: "3rem 1rem", // Reduced
          "text-align": "center",
          background: "linear-gradient(135deg, #0f172a, #1e293b)",
          color: textLight,
          "font-size": "0.9375rem",
          "letter-spacing": "0.25px",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            height: "1px",
            background: "linear-gradient(90deg, transparent, primary, transparent)",
          },
          "@media (max-width: 640px)": {
            padding: "2rem 0.75rem",
          },
        },
      },
      footerLight: {
        base: {
          padding: "3rem 1rem",
          "text-align": "center",
          background: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
          color: textDark,
          borderTop: `1px solid ${borderColorLight}`,
          "font-size": "0.9375rem",
          "letter-spacing": "0.25px",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            height: "1px",
            background: "linear-gradient(90deg, transparent, primary, transparent)",
          },
          "@media (max-width: 640px)": {
            padding: "2rem 0.75rem",
          },
        },
      },
}