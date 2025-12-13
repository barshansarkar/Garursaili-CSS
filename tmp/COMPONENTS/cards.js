import { primary, primaryLight, success, successLight, danger, dangerLight, textDark, textLight, surfaceLight, surfaceDark, surfaceAltLight, borderColorLight, borderColorDark, radiusLg, shadowSm, shadowMd, shadowLg, shadowXl, blurGlassHeavy, mergeStyles, cardBase } from "../CORECONST";
export const card = {
    // -------------------------
    // CARD SIZES
    // -------------------------
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
    // CARD (DEFAULT)
    card: {
        base: mergeStyles(cardBase, {
            padding: "1.5rem",
            border: `1px solid ${borderColorLight}`,
            background: surfaceLight,
            color: textDark,
            "&:hover": { transform: "translateY(-4px)", boxShadow: shadowMd }
        }),
    },
    // -------------------------
    // VARIANTS
    // -------------------------
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
    // -------------------------
    // STRUCTURE
    // -------------------------
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
    // -------------------------
    // IMAGE CARDS
    // -------------------------
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
    // -------------------------
    // INTERACTIVE
    // -------------------------
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
    // -------------------------
    // GRADIENTS
    // -------------------------
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
    // -------------------------
    // DARK MODE
    // -------------------------
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
