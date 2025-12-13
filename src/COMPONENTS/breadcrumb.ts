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
import {
  primary,
  mergeStyles,
  standardTransition,
  radiusSm,
  surfaceAltLight,
  primaryLight,
  surfaceAltDark
} from "../CORECONST";

export const Breadcrumb: Record<string, ComponentBase> = {
  breadcrumb: {
    base: {
      display: "flex",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "0.5rem",
      fontSize: "0.875rem",
      color: "rgba(0, 0, 0, 0.6)",
    },
  },

  breadcrumbItem: {
    base: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",

      "&:not(:last-child)::after": {
        content: '"›"',
        color: "rgba(0, 0, 0, 0.4)",
      },
    },
  },

  breadcrumbLink: {
    base: {
      color: "rgba(0, 0, 0, 0.6)",
      textDecoration: "none",
      transition: standardTransition,
      padding: "0.25rem 0.5rem",
      borderRadius: radiusSm,

      "&:hover": {
        color: primary,
        background: surfaceAltLight,
      },

      "&.breadcrumbActive": {
        color: primary,
        fontWeight: "500",
      },
    },
  },

  breadcrumbDark: {
    base: mergeStyles({
      display: "flex",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "0.5rem",
      fontSize: "0.875rem",
      color: "rgba(255, 255, 255, 0.6)",
    }, {}, 'dark'),
  },

  breadcrumbLinkDark: {
    base: mergeStyles({
      color: "rgba(255, 255, 255, 0.6)",
      textDecoration: "none",
      transition: standardTransition,
      padding: "0.25rem 0.5rem",
      borderRadius: radiusSm,

      "&:hover": {
        color: primaryLight,
        background: surfaceAltDark,
      },

      "&.breadcrumbActive": {
        color: primaryLight,
        fontWeight: "500",
      },
    }, {}, 'dark'),
  },
}