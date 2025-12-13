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

// ei ekla ghor amar desh ... amar ekla thakar obhesh ... vabi kichu tei vabbona tomar kotha .. boba teliphone er pase bose ... tobu govir rater o govir cinemai jodi prem chay ...
import {
  primary, primaryDark, primaryLight,
  success, successDark, successLight,
  danger, dangerDark, dangerLight,
  warning, warningDark, warningLight,
  info, infoDark, infoLight,
  textDark, textLight,
  surfaceLight, surfaceDark, surfaceAltLight, surfaceAltDark,
  borderColorLight, borderColorDark,
  radiusSm, radiusMd, radiusLg, radiusXl,
  shadowSm, shadowMd, shadowLg, shadowXl,
  blurGlass, blurGlassHeavy,
  mergeStyles,
  badgeBase,
  avatarBase,
  cardBase
} from "../CORECONST";

export const card = {
  cardSm: {
    base: mergeStyles(cardBase, { padding: "1rem" }),
  },

  cardMd: {
    base: mergeStyles(cardBase, { padding: "1.5rem" }),
  },

  cardLg: {
    base: mergeStyles(cardBase, { padding: "2rem" }),
  },

  cardXl: {
    base: mergeStyles(cardBase, { padding: "3rem" }),
  },

  card: {
    base: mergeStyles(cardBase, {
      padding: "1.5rem",
      border: `1px solid ${borderColorLight}`,
      background: surfaceLight,
      color: textDark,
      "&:hover": { transform: "translateY(-4px)", boxShadow: shadowMd }
    }),
  },

  cardOutlined: {
    base: mergeStyles(cardBase, {
      padding: "1.5rem",
      background: "transparent",
      color: textDark,
      border: `2px solid rgba(59, 130, 246, 0.2)`,
      "&:hover": {
        borderColor: primary,
        boxShadow: shadowSm,
        transform: "translateY(-2px)",
      },
    }),
  },

  cardBorderless: {
    base: mergeStyles(cardBase, {
      padding: "1.5rem",
      background: surfaceLight,
      boxShadow: shadowSm,
      border: "none",
    }),
  },

  cardGlass: {
    base: mergeStyles(cardBase, {
      padding: "2rem",
      borderRadius: radiusLg,
      background: "rgba(255, 255, 255, 0.1)",
      backdropFilter: blurGlassHeavy,
      border: `1px solid rgba(255, 255, 255, 0.15)`,
      boxShadow: shadowLg,
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: shadowXl,
      },
    }),
  },

  cardHeader: {
    base: {
      padding: "1.5rem 1.5rem 1rem",
      borderBottom: `1px solid ${borderColorLight}`,
      fontWeight: "600",
      fontSize: "1.25rem",
    },
  },

  cardBody: {
    base: { padding: "1.5rem", flex: "1" },
  },

  cardFooter: {
    base: {
      padding: "1rem 1.5rem 1.5rem",
      borderTop: `1px solid ${borderColorLight}`,
      background: surfaceAltLight,
    },
  },

  cardWithImage: {
    base: mergeStyles(cardBase, {
      padding: "0",
      background: surfaceLight,
      overflow: "hidden",
      "&:hover": { transform: "translateY(-4px)", boxShadow: shadowLg },
    }),
  },

  cardImage: {
    base: {
      width: "100%",
      height: "12rem",
      objectFit: "cover",
    },
  },

  cardImageLg: {
    base: {
      width: "100%",
      height: "16rem",
      objectFit: "cover",
    },
  },

  cardImageSm: {
    base: {
      width: "100%",
      height: "8rem",
      objectFit: "cover",
    },
  },

  cardHover: {
    base: mergeStyles(cardBase, {
      padding: "1.5rem",
      cursor: "pointer",
      border: `1px solid ${borderColorLight}`,
      "&:hover": {
        transform: "translateY(-8px)",
        boxShadow: shadowLg,
        borderColor: primary,
      },
    }),
  },

  cardClickable: {
    base: mergeStyles(cardBase, {
      padding: "1.5rem",
      cursor: "pointer",
      border: `1px solid ${borderColorLight}`,
      transition: "all 0.2s ease",
      "&:active": { transform: "translateY(2px)", boxShadow: shadowSm },
      "&:hover": { borderColor: primary },
    }),
  },

  cardGradient: {
    base: mergeStyles(cardBase, {
      padding: "1.5rem",
      color: "#fff",
      background: `linear-gradient(135deg, ${primaryLight}, ${primary})`,
    }),
  },

  cardGradientSuccess: {
    base: mergeStyles(cardBase, {
      padding: "1.5rem",
      color: "#fff",
      background: `linear-gradient(135deg, ${successLight}, ${success})`,
    }),
  },

  cardGradientDanger: {
    base: mergeStyles(cardBase, {
      padding: "1.5rem",
      color: "#fff",
      background: `linear-gradient(135deg, ${dangerLight}, ${danger})`,
    }),
  },

  cardDark: {
    base: mergeStyles(cardBase, {
      padding: "1.5rem",
      background: surfaceDark,
      color: textLight,
      border: `1px solid ${borderColorDark}`,
    }),
  },

  cardGlassDark: {
    base: mergeStyles(cardBase, {
      padding: "2rem",
      borderRadius: radiusLg,
      background: "rgba(31, 41, 55, 0.1)",
      backdropFilter: blurGlassHeavy,
      border: `1px solid ${borderColorDark}`,
      boxShadow: shadowLg,
    }),
  },
};