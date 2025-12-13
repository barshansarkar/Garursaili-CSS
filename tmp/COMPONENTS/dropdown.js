import { surfaceLight, radiusMd, shadowLg, borderColorLight, blurGlass, radiusLg, mergeStyles, surfaceDark, borderColorDark, textDark, standardTransition, surfaceAltLight, primary, textLight, surfaceAltDark, primaryLight } from "../CORECONST";
export const Dropdown = {
    // Dropdown Trigger
    "dropdown-trigger": {
        base: {
            background: surfaceLight,
            border: `1px solid ${borderColorLight}`,
            borderRadius: radiusMd,
            padding: "0.875rem 1.5rem",
            fontSize: "0.875rem",
            fontWeight: "600",
            color: textDark,
            cursor: "pointer",
            transition: standardTransition,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            boxShadow: shadowLg,
            position: "relative",
            overflow: "hidden",
            "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
            },
            "&::after": {
                content: '""',
                width: "8px",
                height: "8px",
                borderRight: "2px solid currentColor",
                borderBottom: "2px solid currentColor",
                transform: "rotate(45deg)",
                transition: "transform 0.3s ease",
                opacity: "0.7",
            },
            "&.active::after": {
                transform: "rotate(-135deg)",
            },
        },
    },
    // Light Theme Dropdown
    "dropdown-light": {
        base: {
            position: "absolute",
            top: "calc(100% + 8px)",
            right: "0",
            background: `linear-gradient(135deg, ${surfaceLight} 0%, ${surfaceAltLight} 100%)`,
            borderRadius: `calc(${radiusMd} * 1.5)`,
            boxShadow: `${shadowLg}, 0 20px 40px rgba(0, 0, 0, 0.1)`,
            border: `1px solid ${borderColorLight}`,
            zIndex: "1000",
            minWidth: "14rem",
            overflow: "hidden",
            backdropFilter: `${blurGlass} brightness(1.05)`,
            opacity: "0",
            visibility: "hidden",
            transform: "translateY(-15px) scale(0.95)",
            transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
            padding: "0.5rem",
            "&::before": {
                content: '""',
                position: "absolute",
                top: "-8px",
                right: "20px",
                width: "16px",
                height: "16px",
                background: `linear-gradient(135deg, ${surfaceLight} 0%, ${surfaceAltLight} 100%)`,
                transform: "rotate(45deg)",
                borderTop: `1px solid ${borderColorLight}`,
                borderLeft: `1px solid ${borderColorLight}`,
                zIndex: "-1",
            },
            "&.active": {
                opacity: "1",
                visibility: "visible",
                transform: "translateY(0) scale(1)",
            },
            "@media (max-width: 768px)": {
                position: "fixed",
                top: "auto",
                bottom: "0",
                left: "1rem",
                right: "1rem",
                minWidth: "auto",
                borderRadius: `${radiusLg} ${radiusLg} 0 0`,
                transform: "translateY(100%) scale(1)",
                boxShadow: "0 -20px 60px rgba(0, 0, 0, 0.3)",
                "&::before": {
                    display: "none",
                },
                "&.active": {
                    transform: "translateY(0) scale(1)",
                },
            },
        },
    },
    // Dark Theme Dropdown
    "dropdown-dark": {
        base: mergeStyles({
            position: "absolute",
            top: "calc(100% + 8px)",
            right: "0",
            background: `linear-gradient(135deg, ${surfaceDark} 0%, ${surfaceAltDark} 100%)`,
            borderRadius: `calc(${radiusMd} * 1.5)`,
            boxShadow: `${shadowLg}, 0 20px 40px rgba(0, 0, 0, 0.3)`,
            border: `1px solid ${borderColorDark}`,
            zIndex: "1000",
            minWidth: "14rem",
            overflow: "hidden",
            backdropFilter: `${blurGlass} brightness(1.1)`,
            opacity: "0",
            visibility: "hidden",
            transform: "translateY(-15px) scale(0.95)",
            transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
            padding: "0.5rem",
            "&::before": {
                content: '""',
                position: "absolute",
                top: "-8px",
                right: "20px",
                width: "16px",
                height: "16px",
                background: `linear-gradient(135deg, ${surfaceDark} 0%, ${surfaceAltDark} 100%)`,
                transform: "rotate(45deg)",
                borderTop: `1px solid ${borderColorDark}`,
                borderLeft: `1px solid ${borderColorDark}`,
                zIndex: "-1",
            },
            "&.active": {
                opacity: "1",
                visibility: "visible",
                transform: "translateY(0) scale(1)",
            },
            "@media (max-width: 768px)": {
                position: "fixed",
                top: "auto",
                bottom: "0",
                left: "1rem",
                right: "1rem",
                minWidth: "auto",
                borderRadius: `${radiusLg} ${radiusLg} 0 0`,
                transform: "translateY(100%) scale(1)",
                boxShadow: "0 -20px 60px rgba(0, 0, 0, 0.3)",
                "&::before": {
                    display: "none",
                },
                "&.active": {
                    transform: "translateY(0) scale(1)",
                },
            },
        }, {}, 'dark'),
    },
    // Dropdown Items
    "dropdown-item": {
        base: {
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.875rem 1rem",
            color: textDark,
            textDecoration: "none",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            borderRadius: radiusMd,
            fontSize: "0.875rem",
            fontWeight: "500",
            position: "relative",
            overflow: "hidden",
            cursor: "pointer",
            "&::before": {
                content: '""',
                position: "absolute",
                left: "0",
                top: "0",
                height: "100%",
                width: "3px",
                background: `linear-gradient(to bottom, ${primary}, transparent)`,
                transform: "translateX(-100%)",
                transition: "transform 0.3s ease",
            },
            "&:hover": {
                background: `linear-gradient(135deg, ${surfaceAltLight} 0%, rgba(255,255,255,0.8) 100%)`,
                color: primary,
                transform: "translateX(4px)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                "&::before": {
                    transform: "translateX(0)",
                },
            },
            "&.active": {
                background: `linear-gradient(135deg, ${primary}15 0%, ${primary}08 100%)`,
                color: primary,
                fontWeight: "600",
                "&::before": {
                    transform: "translateX(0)",
                    background: primary,
                },
            },
        },
    },
    // Dropdown Icon
    "dropdown-icon": {
        base: {
            width: "1.25rem",
            height: "1.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.875rem",
            opacity: "0.7",
            transition: "all 0.3s ease",
            ".dropdown-item:hover &": {
                opacity: "1",
                transform: "scale(1.1)",
            },
        },
    },
    // Dropdown Badge
    "dropdown-badge": {
        base: {
            marginLeft: "auto",
            padding: "0.25rem 0.5rem",
            fontSize: "0.7rem",
            fontWeight: "600",
            background: primary,
            color: "white",
            borderRadius: "1rem",
            lineHeight: "1",
        },
    },
    // Dropdown Header
    "dropdown-header": {
        base: {
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "1rem 1rem 0.5rem",
            fontSize: "0.7rem",
            fontWeight: "700",
            color: "rgba(0, 0, 0, 0.4)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            "&::after": {
                content: '""',
                flex: "1",
                height: "1px",
                background: `linear-gradient(to right, ${borderColorLight}, transparent)`,
                marginLeft: "0.5rem",
            },
        },
    },
    // Dropdown Divider
    "dropdown-divider": {
        base: {
            height: "1px",
            background: `linear-gradient(to right, transparent, ${borderColorLight}, transparent)`,
            margin: "0.5rem 1rem",
            opacity: "0.6",
        },
    },
    // Dark theme variants for nested selectors
    "dropdown-dark-dropdown-item": {
        base: mergeStyles({
            color: textLight,
            "&::before": {
                background: `linear-gradient(to bottom, ${primaryLight}, transparent)`,
            },
            "&:hover": {
                background: `linear-gradient(135deg, ${surfaceAltDark} 0%, rgba(255,255,255,0.05) 100%)`,
                color: primaryLight,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            },
            "&.active": {
                background: `linear-gradient(135deg, ${primaryLight}15 0%, ${primaryLight}08 100%)`,
                color: primaryLight,
                "&::before": {
                    background: primaryLight,
                },
            },
        }, {}, 'dark'),
    },
    "dropdown-dark-dropdown-header": {
        base: mergeStyles({
            color: "rgba(255, 255, 255, 0.4)",
            "&::after": {
                background: `linear-gradient(to right, ${borderColorDark}, transparent)`,
            },
        }, {}, 'dark'),
    },
    "dropdown-dark-dropdown-divider": {
        base: mergeStyles({
            background: `linear-gradient(to right, transparent, ${borderColorDark}, transparent)`,
        }, {}, 'dark'),
    },
};
// Utility function to handle nested dark theme selectors
export function initDropdownStyles() {
    // This function would be used by your CSS-in-JS system to generate
    // the nested dark theme styles like ".dropdown-dark .dropdown-item"
    return {
        ".dropdown-dark .dropdown-item": Dropdown["dropdown-dark-dropdown-item"].base,
        ".dropdown-dark .dropdown-header": Dropdown["dropdown-dark-dropdown-header"].base,
        ".dropdown-dark .dropdown-divider": Dropdown["dropdown-dark-dropdown-divider"].base,
    };
}
export default { Dropdown, initDropdownStyles };
