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

import {
  primary, primaryDark, primaryLight,
  success, successDark, successLight,
  danger, dangerDark, dangerLight,
  warning, warningDark, warningLight,
  info, infoDark, infoLight,
  textDark, textLight,
  surfaceLight, surfaceDark,
  borderColorLight, borderColorDark,
  radiusSm, radiusMd,
  shadowSm, shadowMd,
  blurGlass,
  mergeStyles,
  btnBase
} from "../CORECONST";
import { ComponentBase } from "../components";

export const buttons: Record<string, ComponentBase> = {
  btn: { base: btnBase },

  btnXs: {
    base: mergeStyles(btnBase, {
      padding: "0.375rem 0.75rem",
      fontSize: "0.75rem",
      borderRadius: radiusSm,
      gap: "0.25rem",
    }),
  },

  btnSm: {
    base: mergeStyles(btnBase, {
      padding: "0.5rem 1rem",
      fontSize: "0.8125rem",
      borderRadius: radiusSm,
    }),
  },

  btnMd: {
    base: mergeStyles(btnBase, {
      padding: "0.75rem 1.5rem",
      fontSize: "0.9375rem",
      borderRadius: radiusSm,
    }),
  },

  btnLg: {
    base: mergeStyles(btnBase, {
      padding: "1rem 2rem",
      fontSize: "1rem",
      borderRadius: radiusMd,
    }),
  },

  btnXl: {
    base: mergeStyles(btnBase, {
      padding: "1.125rem 2.25rem",
      fontSize: "1.125rem",
      borderRadius: radiusMd,
    }),
  },

  btnPrimary: {
    base: mergeStyles(btnBase, {
      background: `linear-gradient(135deg, ${primaryDark}, ${primary}, ${primaryLight})`,
      color: "#fff",
      boxShadow: shadowSm,
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: shadowMd,
      },
    }),
  },

  btnSecondary: {
    base: mergeStyles(btnBase, {
      border: `1px solid ${success}`,
      fontWeight: "600",
      color: success,
      background: surfaceLight,
      backdropFilter: blurGlass,
      "&:hover": {
        background: success,
        color: "#fff",
        transform: "translateY(-2px)",
        boxShadow: shadowMd,
      },
    }),
  },

  btnSuccess: {
    base: mergeStyles(btnBase, {
      background: `linear-gradient(135deg, ${successDark}, ${success}, ${successLight})`,
      color: "#fff",
      boxShadow: shadowSm,
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: shadowMd,
      },
    }),
  },

  btnDanger: {
    base: mergeStyles(btnBase, {
      background: `linear-gradient(135deg, ${dangerDark}, ${danger}, ${dangerLight})`,
      color: "#fff",
      boxShadow: shadowSm,
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: shadowMd,
      },
    }),
  },

  btnWarning: {
    base: mergeStyles(btnBase, {
      background: `linear-gradient(135deg, ${warningDark}, ${warning}, ${warningLight})`,
      color: "#fff",
      boxShadow: shadowSm,
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: shadowMd,
      },
    }),
  },

  btnInfo: {
    base: mergeStyles(btnBase, {
      background: `linear-gradient(135deg, ${infoDark}, ${info}, ${infoLight})`,
      color: "#fff",
      boxShadow: shadowSm,
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: shadowMd,
      },
    }),
  },

  btnOutline: {
    base: mergeStyles(btnBase, {
      border: `1px solid ${primary}`,
      color: primary,
      background: "transparent",
      "&:hover": {
        background: primary,
        color: "#fff",
        transform: "translateY(-2px)",
        boxShadow: shadowMd,
      },
    }),
  },

  btnOutlineSuccess: {
    base: mergeStyles(btnBase, {
      border: `1px solid ${success}`,
      color: success,
      background: "transparent",
      "&:hover": {
        background: success,
        color: "#fff",
        transform: "translateY(-2px)",
        boxShadow: shadowMd,
      },
    }),
  },

  btnOutlineDanger: {
    base: mergeStyles(btnBase, {
      border: `1px solid ${danger}`,
      color: danger,
      background: "transparent",
      "&:hover": {
        background: danger,
        color: "#fff",
        transform: "translateY(-2px)",
        boxShadow: shadowMd,
      },
    }),
  },

  btnOutlineWarning: {
    base: mergeStyles(btnBase, {
      border: `1px solid ${warning}`,
      color: warning,
      background: "transparent",
      "&:hover": {
        background: warning,
        color: "#fff",
        transform: "translateY(-2px)",
        boxShadow: shadowMd,
      },
    }),
  },

  btnOutlineInfo: {
    base: mergeStyles(btnBase, {
      border: `1px solid ${info}`,
      color: info,
      background: "transparent",
      "&:hover": {
        background: info,
        color: "#fff",
        transform: "translateY(-2px)",
        boxShadow: shadowMd,
      },
    }),
  },

  btnOutlineDark: {
    base: mergeStyles(btnBase, {
      border: `1px solid #000`,
      color: "#000",
      background: "transparent",
      "&:hover": {
        background: "#000",
        color: "#fff",
        transform: "translateY(-2px)",
        boxShadow: shadowMd,
      },
      "&:dark": {
        border: `1px solid #fff`,
        color: "#fff",
        background: "transparent",
        "&:hover": {
          background: "#fff",
          color: "#000",
        },
      },
    }),
  },

  btnDark: {
    base: mergeStyles(btnBase, {
      background: surfaceDark,
      color: textLight,
      border: `1px solid ${borderColorDark}`,
      boxShadow: shadowSm,
      "&:hover": {
        background: `${borderColorDark}`,
        transform: "translateY(-2px)",
        boxShadow: shadowMd,
      },
    }),
  },

  btnDisabled: {
    base: mergeStyles(btnBase, {
      opacity: "0.6",
      cursor: "not-allowed",
    }),
  },

  btnLoading: {
    base: mergeStyles(btnBase, {
      position: "relative",
      color: "transparent",
      pointerEvents: "none",
    }),
  },

  btnBlock: {
    base: mergeStyles(btnBase, {
      width: "100%",
      justifyContent: "center",
    }),
  },

  btnGroup: {
    base: {
      display: "inline-flex",
      borderRadius: radiusSm,
      overflow: "hidden",
    },
  },

  btnFloating: {
    base: mergeStyles(btnBase, {
      width: "3rem",
      height: "3rem",
      borderRadius: "50%",
      padding: "0",
      background: `linear-gradient(135deg, ${primaryDark}, ${primary}, ${primaryLight})`,
      color: "#fff",
      boxShadow: shadowSm,
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: shadowMd,
      },
    }),
  },

  btnFloatingSm: {
    base: mergeStyles(btnBase, {
      width: "2.5rem",
      height: "2.5rem",
      borderRadius: "50%",
      padding: "0",
      background: `linear-gradient(135deg, ${primaryDark}, ${primary}, ${primaryLight})`,
      color: "#fff",
      boxShadow: shadowSm,
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: shadowMd,
      },
    }),
  },

  btnFloatingLg: {
    base: mergeStyles(btnBase, {
      width: "4rem",
      height: "4rem",
      borderRadius: "50%",
      padding: "0",
      background: `linear-gradient(135deg, ${primaryDark}, ${primary}, ${primaryLight})`,
      color: "#fff",
      boxShadow: shadowSm,
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: shadowMd,
      },
    }),
  },

  btnGoogle: {
    base: mergeStyles(btnBase, {
      background: "#ffffff",
      color: "#3c4043",
      border: "1px solid #dadce0",
      boxShadow: shadowSm,
      "&:hover": {
        background: "#f8f9fa",
        transform: "translateY(-1px)",
        boxShadow: shadowMd,
      },
    }),
  },

  btnGithub: {
    base: mergeStyles(btnBase, {
      background: "#333",
      color: "#fff",
      boxShadow: shadowSm,
      "&:hover": {
        background: "#24292e",
        transform: "translateY(-1px)",
        boxShadow: shadowMd,
      },
    }),
  },

  btnFacebook: {
    base: mergeStyles(btnBase, {
      background: "#1877f2",
      color: "#fff",
      boxShadow: shadowSm,
      "&:hover": {
        background: "#166fe5",
        transform: "translateY(-1px)",
        boxShadow: shadowMd,
      },
    }),
  },

  btnTwitter: {
    base: mergeStyles(btnBase, {
      background: "#1da1f2",
      color: "#fff",
      boxShadow: shadowSm,
      "&:hover": {
        background: "#0d8bd9",
        transform: "translateY(-1px)",
        boxShadow: shadowMd,
      },
    }),
  },

  btnGhost: {
    base: mergeStyles(btnBase, {
      background: "transparent",
      color: primary,
      "&:hover": {
        background: `rgba(${primary.replace('#','')}, 0.1)`,
        transform: "translateY(-1px)",
      },
    }),
  },

  btnGhostSuccess: {
    base: mergeStyles(btnBase, {
      background: "transparent",
      color: success,
      "&:hover": {
        background: `rgba(${success.replace('#', '')}, 0.1)`,
        transform: "translateY(-1px)",
      },
    }),
  },

  btnIcon: {
    base: mergeStyles(btnBase, {
      width: "2.5rem",
      height: "2.5rem",
      padding: "0",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: shadowSm,
      "&:hover": {
        transform: "translateY(-1px)",
        boxShadow: shadowMd,
      },
    }),
  },

  btnIconSm: {
    base: mergeStyles(btnBase, {
      width: "2rem",
      height: "2rem",
      padding: "0",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: shadowSm,
      "&:hover": {
        transform: "translateY(-1px)",
        boxShadow: shadowMd,
      },
    }),
  },

  btnIconLg: {
    base: mergeStyles(btnBase, {
      width: "3rem",
      height: "3rem",
      padding: "0",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: shadowSm,
      "&:hover": {
        transform: "translateY(-1px)",
        boxShadow: shadowMd,
      },
    }),
  },

  btnLink: {
    base: mergeStyles(btnBase, {
      background: "transparent",
      color: primary,
      textDecoration: "underline",
      padding: "0.25rem 0",
      borderRadius: "0",
      "&:hover": {
        color: `${primaryDark}`,
        textDecoration: "none",
      },
    }),
  },
};