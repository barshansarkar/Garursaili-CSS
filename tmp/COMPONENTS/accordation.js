import { borderColorDark, borderColorLight, blurGlassHeavy, primary, primaryLight, radiusLg, radiusMd, radiusSm, shadowLg, shadowMd, shadowSm, shadowXl, standardTransition, surfaceAltDark, surfaceDark, surfaceLight, surfaceAltLight, textDark, textLight, success, mergeStyles, } from "../CORECONST";
export const Accordion = {
    accordion: {
        base: {
            width: "100%",
            borderRadius: radiusMd,
            border: `1px solid ${borderColorLight}`,
            overflow: "hidden",
            boxShadow: shadowSm,
            transition: standardTransition,
            background: surfaceLight,
            "&:hover": {
                boxShadow: shadowMd,
            },
            "@media (max-width: 640px)": {
                borderRadius: radiusSm,
            },
        },
    },
    accordionDark: {
        base: mergeStyles({
            width: "100%",
            borderRadius: radiusMd,
            border: `1px solid ${borderColorDark}`,
            overflow: "hidden",
            boxShadow: shadowSm,
            transition: standardTransition,
            background: surfaceDark,
            "&:hover": {
                boxShadow: shadowMd,
            },
            "@media (max-width: 640px)": {
                borderRadius: radiusSm,
            },
        }, {}, 'dark'),
    },
    // 🎯 ACCORDION ITEMS
    accordionItem: {
        base: {
            borderBottom: `1px solid ${borderColorLight}`,
            transition: standardTransition,
            "&:last-child": {
                borderBottom: "none",
            },
            "&:hover": {
                background: surfaceAltLight,
            },
            "&.accordionItemActive": {
                background: "rgba(59, 130, 246, 0.03)",
            },
        },
    },
    accordionItemDark: {
        base: mergeStyles({
            borderBottom: `1px solid ${borderColorDark}`,
            transition: standardTransition,
            "&:last-child": {
                borderBottom: "none",
            },
            "&:hover": {
                background: surfaceAltDark,
            },
            "&.accordionItemActive": {
                background: "rgba(96, 165, 250, 0.05)",
            },
        }, {}, 'dark'),
    },
    // 🔘 ACCORDION TRIGGERS
    accordionTrigger: {
        base: {
            width: "100%",
            padding: "1.25rem 1.5rem",
            background: "none",
            border: "none",
            textAlign: "left",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            color: textDark,
            fontWeight: "600",
            fontSize: "1rem",
            transition: standardTransition,
            position: "relative",
            "&:hover": {
                background: "rgba(59, 130, 246, 0.05)",
                color: primary,
            },
            "&:focus": {
                outline: "none",
                boxShadow: `inset 0 0 0 2px ${primary}20`,
            },
            "&.accordionTriggerActive": {
                color: primary,
                background: "rgba(59, 130, 246, 0.08)",
            },
            "@media (max-width: 640px)": {
                padding: "1rem 1.25rem",
                fontSize: "0.9375rem",
            },
        },
    },
    accordionTriggerDark: {
        base: mergeStyles({
            width: "100%",
            padding: "1.25rem 1.5rem",
            background: "none",
            border: "none",
            textAlign: "left",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            color: textLight,
            fontWeight: "600",
            fontSize: "1rem",
            transition: standardTransition,
            position: "relative",
            "&:hover": {
                background: "rgba(96, 165, 250, 0.08)",
                color: primaryLight,
            },
            "&:focus": {
                outline: "none",
                boxShadow: `inset 0 0 0 2px ${primaryLight}20`,
            },
            "&.accordionTriggerActive": {
                color: primaryLight,
                background: "rgba(96, 165, 250, 0.12)",
            },
        }, {}, 'dark'),
    },
    // ➕ ACCORDION ICON/INDICATOR
    accordionIcon: {
        base: {
            width: "1.25rem",
            height: "1.25rem",
            transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            flexShrink: "0",
            opacity: "0.7",
            "&.accordionIconActive": {
                transform: "rotate(180deg)",
                opacity: "1",
            },
        },
    },
    // 📖 ACCORDION CONTENT
    accordionContent: {
        base: {
            padding: "0 1.5rem",
            maxHeight: "0",
            overflow: "hidden",
            transition: "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), padding 0.3s ease",
            background: surfaceLight,
            "&.accordionContentActive": {
                padding: "0 1.5rem 1.5rem",
                maxHeight: "500px",
            },
            "@media (max-width: 640px)": {
                padding: "0 1.25rem",
                "&.accordionContentActive": {
                    padding: "0 1.25rem 1.25rem",
                },
            },
        },
    },
    accordionContentDark: {
        base: mergeStyles({
            padding: "0 1.5rem",
            maxHeight: "0",
            overflow: "hidden",
            transition: "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), padding 0.3s ease",
            background: surfaceDark,
            "&.accordionContentActive": {
                padding: "0 1.5rem 1.5rem",
                maxHeight: "500px",
            },
        }, {}, 'dark'),
    },
    // 🎨 ACCORDION VARIANTS
    // 🔵 PRIMARY ACCORDION
    accordionPrimary: {
        base: mergeStyles({
            width: "100%",
            borderRadius: radiusMd,
            border: `1px solid rgba(59, 130, 246, 0.2)`,
            overflow: "hidden",
            boxShadow: shadowSm,
            transition: standardTransition,
            background: surfaceLight,
            "&:hover": {
                boxShadow: shadowMd,
                borderColor: "rgba(59, 130, 246, 0.4)",
            },
        }, {
            "& .accordionItem": {
                borderBottom: `1px solid rgba(59, 130, 246, 0.1)`,
            },
            "& .accordionTrigger": {
                "&:hover, &.accordionTriggerActive": {
                    background: "rgba(59, 130, 246, 0.08)",
                    color: primary,
                },
            },
        }),
    },
    // ✅ SUCCESS ACCORDION
    accordionSuccess: {
        base: mergeStyles({
            width: "100%",
            borderRadius: radiusMd,
            border: `1px solid rgba(16, 185, 129, 0.2)`,
            overflow: "hidden",
            boxShadow: shadowSm,
            transition: standardTransition,
            background: surfaceLight,
            "&:hover": {
                boxShadow: shadowMd,
                borderColor: "rgba(16, 185, 129, 0.4)",
            },
        }, {
            "& .accordionItem": {
                borderBottom: `1px solid rgba(16, 185, 129, 0.1)`,
            },
            "& .accordionTrigger": {
                "&:hover, &.accordionTriggerActive": {
                    background: "rgba(16, 185, 129, 0.08)",
                    color: success,
                },
            },
        }),
    },
    // 🚫 BORDERLESS ACCORDION
    accordionBorderless: {
        base: {
            width: "100%",
            borderRadius: radiusMd,
            border: "none",
            overflow: "hidden",
            boxShadow: "none",
            transition: standardTransition,
            background: "transparent",
            "& .accordionItem": {
                border: "none",
                marginBottom: "0.75rem",
                borderRadius: radiusMd,
                background: surfaceLight,
                boxShadow: shadowSm,
                transition: standardTransition,
                "&:hover": {
                    boxShadow: shadowMd,
                    transform: "translateY(-2px)",
                },
            },
            "& .accordionTrigger": {
                borderRadius: radiusMd,
            },
        },
    },
    // 🪞 GLASS ACCORDION
    accordionGlass: {
        base: {
            width: "100%",
            borderRadius: radiusLg,
            border: `1px solid rgba(255, 255, 255, 0.15)`,
            overflow: "hidden",
            boxShadow: shadowLg,
            transition: standardTransition,
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: blurGlassHeavy,
            "&:hover": {
                background: "rgba(255, 255, 255, 0.15)",
                boxShadow: shadowXl,
            },
            "& .accordionItem": {
                borderBottom: `1px solid rgba(255, 255, 255, 0.1)`,
                background: "transparent",
                "&:last-child": {
                    borderBottom: "none",
                },
            },
            "& .accordionTrigger": {
                color: textLight,
                background: "transparent",
                "&:hover": {
                    background: "rgba(255, 255, 255, 0.1)",
                    color: primaryLight,
                },
                "&.accordionTriggerActive": {
                    background: "rgba(255, 255, 255, 0.15)",
                    color: primaryLight,
                },
            },
            "& .accordionContent": {
                background: "transparent",
                color: "rgba(255, 255, 255, 0.9)",
            },
        },
    },
    // 📏 SIZES
    // 🔘 SMALL ACCORDION
    accordionSm: {
        base: {
            "& .accordionTrigger": {
                padding: "1rem 1.25rem",
                fontSize: "0.875rem",
            },
            "& .accordionContent": {
                padding: "0 1.25rem",
                fontSize: "0.875rem",
                "&.accordionContentActive": {
                    padding: "0 1.25rem 1.25rem",
                },
            },
        },
    },
    // 🔘 LARGE ACCORDION
    accordionLg: {
        base: {
            "& .accordionTrigger": {
                padding: "1.5rem 2rem",
                fontSize: "1.125rem",
            },
            "& .accordionContent": {
                padding: "0 2rem",
                fontSize: "1.0625rem",
                "&.accordionContentActive": {
                    padding: "0 2rem 2rem",
                },
            },
        },
    },
    // 🎯 ENHANCED FEATURES
    // ➕ ACCORDION WITH ICONS
    accordionWithIcons: {
        base: {
            "& .accordionTrigger": {
                "&::before": {
                    content: '""',
                    width: "1.5rem",
                    height: "1.5rem",
                    background: "currentColor",
                    mask: "var(--accordion-icon)",
                    WebkitMask: "var(--accordion-icon)",
                    opacity: "0.6",
                    transition: standardTransition,
                },
                "&:hover::before": {
                    opacity: "1",
                    transform: "scale(1.1)",
                },
                "&.accordionTriggerActive::before": {
                    opacity: "1",
                    transform: "rotate(180deg)",
                },
            },
        },
    },
    // 📍 ACCORDION WITH BADGES
    accordionWithBadges: {
        base: {
            "& .accordionTrigger": {
                position: "relative",
                "& .accordionBadge": {
                    marginLeft: "auto",
                    marginRight: "2rem",
                    fontSize: "0.75rem",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "1rem",
                    background: surfaceAltLight,
                    color: textDark,
                    fontWeight: "600",
                    transition: standardTransition,
                },
                "&:hover .accordionBadge": {
                    background: primary,
                    color: "#fff",
                },
            },
        },
    },
    // ✨ ANIMATED ACCORDION
    accordionAnimated: {
        base: {
            "& .accordionItem": {
                position: "relative",
                overflow: "hidden",
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: "0",
                    left: "0",
                    width: "3px",
                    height: "100%",
                    background: `linear-gradient(180deg, ${primary}, ${success})`,
                    transform: "scaleY(0)",
                    transition: "transform 0.3s ease",
                },
                "&.accordionItemActive::before": {
                    transform: "scaleY(1)",
                },
            },
            "& .accordionContent": {
                transition: "max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1), padding 0.4s ease, opacity 0.3s ease",
                opacity: "0",
                "&.accordionContentActive": {
                    opacity: "1",
                },
            },
        },
    },
    // 🏷️ ACCORDION GROUP
    accordionGroup: {
        base: {
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
        },
    },
    accordionGroupSm: {
        base: {
            gap: "0.75rem",
        },
    },
    accordionGroupLg: {
        base: {
            gap: "1.5rem",
        },
    },
    // 🔄 SINGLE OPEN MODE
    accordionSingle: {
        base: {
            "& .accordionItem": {
                "&.accordionItemActive": {
                    background: "rgba(59, 130, 246, 0.05)",
                },
            },
        },
    },
    // 🌙 DARK MODE VARIANTS
    accordionPrimaryDark: {
        base: mergeStyles({
            width: "100%",
            borderRadius: radiusMd,
            border: `1px solid rgba(96, 165, 250, 0.2)`,
            overflow: "hidden",
            boxShadow: shadowSm,
            transition: standardTransition,
            background: surfaceDark,
            "&:hover": {
                boxShadow: shadowMd,
                borderColor: "rgba(96, 165, 250, 0.4)",
            },
        }, {
            "& .accordionItem": {
                borderBottom: `1px solid rgba(96, 165, 250, 0.1)`,
            },
            "& .accordionTrigger": {
                "&:hover, &.accordionTriggerActive": {
                    background: "rgba(96, 165, 250, 0.08)",
                    color: primaryLight,
                },
            },
        }, 'dark'),
    },
    accordionGlassDark: {
        base: mergeStyles({
            width: "100%",
            borderRadius: radiusLg,
            border: `1px solid rgba(255, 255, 255, 0.1)`,
            overflow: "hidden",
            boxShadow: shadowLg,
            transition: standardTransition,
            background: "rgba(31, 41, 55, 0.1)",
            backdropFilter: blurGlassHeavy,
            "&:hover": {
                background: "rgba(31, 41, 55, 0.15)",
                boxShadow: shadowXl,
            },
        }, {
            "& .accordionItem": {
                borderBottom: `1px solid rgba(255, 255, 255, 0.08)`,
            },
            "& .accordionTrigger": {
                "&:hover, &.accordionTriggerActive": {
                    background: "rgba(255, 255, 255, 0.1)",
                    color: primaryLight,
                },
            },
        }, 'dark'),
    },
};
