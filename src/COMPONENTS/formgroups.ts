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
  danger,
  success,
  textDark,
  textLight,
  mergeStyles,
  cardBase,
  standardTransition,   } from "../CORECONST";
export const formGroups: Record<string, ComponentBase> = {

    formGroup: {
      base: {
        marginBottom: "1.5rem",
        position: "relative",
      },
    },

    formLabel: {
      base: {
        display: "block",
        marginBottom: "0.5rem",
        fontWeight: "500",
        color: textDark,
        fontSize: "0.875rem",
        transition: standardTransition,
      },
    },

    formLabelDark: {
      base: {
        display: "block",
        marginBottom: "0.5rem",
        fontWeight: "500",
        color: textLight,
        fontSize: "0.875rem",
      },
    },

    formHelp: {
      base: {
        display: "block",
        marginTop: "0.25rem",
        fontSize: "0.75rem",
        color: "rgba(0, 0, 0, 0.6)",
      },
    },

    formHelpError: {
      base: {
        display: "block",
        marginTop: "0.25rem",
        fontSize: "0.75rem",
        color: danger,
        fontWeight: "500",
      },
    },

    formHelpSuccess: {
      base: {
        display: "block",
        marginTop: "0.25rem",
        fontSize: "0.75rem",
        color: success,
        fontWeight: "500",
      },
    },


    form: {
      base: {
        width: "100%",
      },
    },

    formCard: {
      base: mergeStyles(cardBase, {
        padding: "2rem",

        "@media (max-width: 640px)": {
          padding: "1.5rem",
        },
      }),
    },

    formInline: {
      base: {
        display: "flex",
        gap: "1rem",
        alignItems: "flex-end",

        "@media (max-width: 640px)": {
          flexDirection: "column",
          alignItems: "stretch",
        },
      },
    },


    formValid: {
      base: {
        "& .formLabel": {
          color: success,
        },
      },
    },

    formInvalid: {
      base: {
        "& .formLabel": {
          color: danger,
        },
      },
    },

}