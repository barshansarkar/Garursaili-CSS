import { mergeStyles, surfaceLight, surfaceDark, surfaceAltLight, surfaceAltDark, primary, textDark, textLight, borderColorLight, borderColorDark, radiusMd, radiusLg, shadowLg, blurGlass, standardTransition } from "../CORECONST";
export const Tooltip = {
    // Base tooltip styles
    tooltip: {
        base: {
            position: "relative",
            display: "inline-block",
            cursor: "pointer",
        },
    },
    tooltipContent: {
        base: {
            position: "absolute",
            background: `linear-gradient(135deg, ${surfaceDark} 0%, ${surfaceAltDark} 100%)`,
            color: textLight,
            padding: "0.75rem 1rem",
            borderRadius: radiusMd,
            fontSize: "0.875rem",
            fontWeight: "500",
            whiteSpace: "nowrap",
            boxShadow: `${shadowLg}, 0 20px 40px rgba(0, 0, 0, 0.3), 0 8px 32px rgba(99, 102, 241, 0.2)`,
            backdropFilter: `${blurGlass} brightness(1.1)`,
            border: `1px solid ${borderColorDark}`,
            zIndex: "1000",
            opacity: "0",
            visibility: "hidden",
            transform: "scale(0.9)",
            transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            ".tooltip:hover &": {
                opacity: "1",
                visibility: "visible",
                transform: "scale(1)",
            },
        },
    },
    // Light theme tooltip
    tooltipLight: {
        base: mergeStyles({
            position: "absolute",
            background: `linear-gradient(135deg, ${surfaceLight} 0%, ${surfaceAltLight} 100%)`,
            color: textDark,
            padding: "0.75rem 1rem",
            borderRadius: radiusMd,
            fontSize: "0.875rem",
            fontWeight: "500",
            whiteSpace: "nowrap",
            boxShadow: `${shadowLg}, 0 20px 40px rgba(0, 0, 0, 0.1)`,
            backdropFilter: `${blurGlass} brightness(1.05)`,
            border: `1px solid ${borderColorLight}`,
            zIndex: "1000",
            opacity: "0",
            visibility: "hidden",
            transform: "scale(0.9)",
            transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            ".tooltip:hover &": {
                opacity: "1",
                visibility: "visible",
                transform: "scale(1)",
            },
        }, {}, 'light'),
    },
    // Tooltip Positions
    tooltipTop: {
        base: {
            bottom: "100%",
            left: "50%",
            transform: "translateX(-50%) translateY(-8px) scale(0.9)",
            marginBottom: "12px",
            "&::after": {
                content: '""',
                position: "absolute",
                top: "100%",
                left: "50%",
                transform: "translateX(-50%)",
                border: "6px solid transparent",
                borderTopColor: surfaceDark,
            },
            ".tooltip:hover &": {
                transform: "translateX(-50%) translateY(0) scale(1)",
            },
        },
    },
    tooltipBottom: {
        base: {
            top: "100%",
            left: "50%",
            transform: "translateX(-50%) translateY(8px) scale(0.9)",
            marginTop: "12px",
            "&::after": {
                content: '""',
                position: "absolute",
                bottom: "100%",
                left: "50%",
                transform: "translateX(-50%)",
                border: "6px solid transparent",
                borderBottomColor: surfaceDark,
            },
            ".tooltip:hover &": {
                transform: "translateX(-50%) translateY(0) scale(1)",
            },
        },
    },
    tooltipLeft: {
        base: {
            right: "100%",
            top: "50%",
            transform: "translateY(-50%) translateX(-8px) scale(0.9)",
            marginRight: "12px",
            "&::after": {
                content: '""',
                position: "absolute",
                left: "100%",
                top: "50%",
                transform: "translateY(-50%)",
                border: "6px solid transparent",
                borderLeftColor: surfaceDark,
            },
            ".tooltip:hover &": {
                transform: "translateY(-50%) translateX(0) scale(1)",
            },
        },
    },
    tooltipRight: {
        base: {
            left: "100%",
            top: "50%",
            transform: "translateY(-50%) translateX(8px) scale(0.9)",
            marginLeft: "12px",
            "&::after": {
                content: '""',
                position: "absolute",
                right: "100%",
                top: "50%",
                transform: "translateY(-50%)",
                border: "6px solid transparent",
                borderRightColor: surfaceDark,
            },
            ".tooltip:hover &": {
                transform: "translateY(-50%) translateX(0) scale(1)",
            },
        },
    },
    // Color Variants
    tooltipPrimary: {
        base: {
            background: `linear-gradient(135deg, ${primary} 0%, #1d4ed8 100%)`,
            border: "none",
            "&::after": {
                borderTopColor: primary,
            },
            "&.tooltipBottom::after": {
                borderBottomColor: primary,
            },
            "&.tooltipLeft::after": {
                borderLeftColor: primary,
            },
            "&.tooltipRight::after": {
                borderRightColor: primary,
            },
        },
    },
    tooltipSuccess: {
        base: {
            background: "linear-gradient(135deg, #10b981 0%, #047857 100%)",
            border: "none",
            "&::after": {
                borderTopColor: "#10b981",
            },
            "&.tooltipBottom::after": {
                borderBottomColor: "#10b981",
            },
            "&.tooltipLeft::after": {
                borderLeftColor: "#10b981",
            },
            "&.tooltipRight::after": {
                borderRightColor: "#10b981",
            },
        },
    },
    tooltipWarning: {
        base: {
            background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
            border: "none",
            "&::after": {
                borderTopColor: "#f59e0b",
            },
            "&.tooltipBottom::after": {
                borderBottomColor: "#f59e0b",
            },
            "&.tooltipLeft::after": {
                borderLeftColor: "#f59e0b",
            },
            "&.tooltipRight::after": {
                borderRightColor: "#f59e0b",
            },
        },
    },
    tooltipDanger: {
        base: {
            background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
            border: "none",
            "&::after": {
                borderTopColor: "#ef4444",
            },
            "&.tooltipBottom::after": {
                borderBottomColor: "#ef4444",
            },
            "&.tooltipLeft::after": {
                borderLeftColor: "#ef4444",
            },
            "&.tooltipRight::after": {
                borderRightColor: "#ef4444",
            },
        },
    },
    // Size Variants
    tooltipSm: {
        base: {
            padding: "0.5rem 0.75rem",
            fontSize: "0.75rem",
            maxWidth: "12rem",
        },
    },
    tooltipLg: {
        base: {
            padding: "1rem 1.25rem",
            fontSize: "0.875rem",
            maxWidth: "24rem",
        },
    },
    // Multiline Tooltips
    tooltipMultiline: {
        base: {
            whiteSpace: "normal",
            textAlign: "left",
            maxWidth: "16rem",
            lineHeight: "1.5",
        },
    },
    tooltipMultilineLg: {
        base: {
            whiteSpace: "normal",
            textAlign: "left",
            maxWidth: "20rem",
            lineHeight: "1.6",
            padding: "1rem 1.25rem",
        },
    },
    // Rich Content Tooltips
    tooltipRich: {
        base: {
            padding: "1rem",
            textAlign: "left",
            whiteSpace: "normal",
            maxWidth: "18rem",
        },
    },
    tooltipHeader: {
        base: {
            fontWeight: "600",
            fontSize: "0.875rem",
            marginBottom: "0.375rem",
            display: "block",
            lineHeight: "1.3",
        },
    },
    // Interactive Tooltips
    tooltipInteractive: {
        base: {
            pointerEvents: "auto",
            cursor: "pointer",
            "&:hover": {
                opacity: "1 !important",
                visibility: "visible !important",
            },
        },
    },
    // Special Effects
    tooltipRounded: {
        base: {
            borderRadius: radiusLg,
        },
    },
    tooltipGlass: {
        base: {
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(25px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "#ffffff",
        },
    },
    tooltipBorderless: {
        base: {
            border: "none",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)",
        },
    },
    // Responsive Tooltips
    tooltipResponsive: {
        base: {
            "@media (max-width: 640px)": {
                fontSize: "0.75rem",
                padding: "0.5rem 0.75rem",
                maxWidth: "14rem",
                whiteSpace: "normal",
                textAlign: "center",
            },
        },
    },
    // Tooltip with Icons
    tooltipWithIcon: {
        base: {
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.625rem 0.875rem",
        },
    },
    tooltipIcon: {
        base: {
            fontSize: "0.875rem",
            flexShrink: "0",
            opacity: "0.9",
            transition: "all 0.3s ease",
            ".tooltip:hover &": {
                opacity: "1",
                transform: "scale(1.1)",
            },
        },
    },
    // Tooltip Group Container
    tooltipGroup: {
        base: {
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            flexWrap: "wrap",
        },
    },
    // Demo Elements (for the preview)
    tooltipDemoElement: {
        base: {
            background: surfaceLight,
            padding: "1rem 1.5rem",
            borderRadius: radiusMd,
            fontWeight: "600",
            color: textDark,
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
            transition: standardTransition,
            border: "2px solid transparent",
            "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
            },
        },
    },
    tooltipIconElement: {
        base: {
            width: "48px",
            height: "48px",
            background: surfaceLight,
            borderRadius: radiusMd,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.25rem",
            color: primary,
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
            transition: standardTransition,
            "&:hover": {
                transform: "scale(1.1)",
                boxShadow: "0 8px 32px rgba(59, 130, 246, 0.3)",
            },
        },
    },
    tooltipAvatarElement: {
        base: {
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: textLight,
            fontWeight: "600",
            fontSize: "1.25rem",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
            transition: standardTransition,
            "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0 8px 32px rgba(102, 126, 234, 0.4)",
            },
        },
    },
    tooltipBadgeElement: {
        base: {
            background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
            color: textLight,
            padding: "0.5rem 1rem",
            borderRadius: "2rem",
            fontSize: "0.875rem",
            fontWeight: "600",
            boxShadow: "0 4px 16px rgba(139, 92, 246, 0.3)",
            transition: standardTransition,
            "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0 8px 32px rgba(139, 92, 246, 0.5)",
            },
        },
    },
    // Animation Variants
    tooltipBounce: {
        base: {
            animation: "tooltipBounce 0.6s ease-out",
            ".tooltip:hover &": {
                animation: "tooltipBounce 0.6s ease-out",
            },
        },
    },
    tooltipFade: {
        base: {
            animation: "tooltipFade 0.4s ease-out",
            ".tooltip:hover &": {
                animation: "tooltipFade 0.4s ease-out",
            },
        },
    },
    // Arrow color variants for light theme
    tooltipArrowLight: {
        base: {
            "&::after": {
                borderTopColor: surfaceLight,
            },
            "&.tooltipBottom::after": {
                borderBottomColor: surfaceLight,
            },
            "&.tooltipLeft::after": {
                borderLeftColor: surfaceLight,
            },
            "&.tooltipRight::after": {
                borderRightColor: surfaceLight,
            },
        },
    },
};
// Keyframes for animations (you would add these to your global styles)
export const tooltipKeyframes = {
    "@keyframes tooltipBounce": {
        "0%": {
            opacity: "0",
            transform: "scale(0.3)",
        },
        "50%": {
            opacity: "0.9",
            transform: "scale(1.05)",
        },
        "100%": {
            opacity: "1",
            transform: "scale(1)",
        },
    },
    "@keyframes tooltipFade": {
        "0%": {
            opacity: "0",
            transform: "translateY(10px)",
        },
        "100%": {
            opacity: "1",
            transform: "translateY(0)",
        },
    },
};
export default { Tooltip, tooltipKeyframes };
