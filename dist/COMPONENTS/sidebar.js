import { mergeStyles, surfaceAltDark, surfaceLight, borderColorLight, surfaceDark, borderColorDark, textDark, radiusSm, primary, standardTransition, surfaceAltLight, textLight, primaryLight } from "../CORECONST";
export const sidebar = {
    sidebar: {
        base: {
            position: "fixed",
            top: "0",
            left: "0",
            bottom: "0",
            width: "16rem",
            background: surfaceLight,
            borderRight: `1px solid ${borderColorLight}`,
            zIndex: "1000",
            transform: "translateX(-100%)",
            transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            "&.sidebarOpen": {
                transform: "translateX(0)",
            },
            "@media (min-width: 1024px)": {
                position: "relative",
                transform: "translateX(0)",
                height: "100vh",
            },
        },
    },
    sidebarDark: {
        base: mergeStyles({
            position: "fixed",
            top: "0",
            left: "0",
            bottom: "0",
            width: "16rem",
            background: surfaceDark,
            borderRight: `1px solid ${borderColorDark}`,
            zIndex: "1000",
            transform: "translateX(-100%)",
            transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            "&.sidebarOpen": {
                transform: "translateX(0)",
            },
            "@media (min-width: 1024px)": {
                position: "relative",
                transform: "translateX(0)",
                height: "100vh",
            },
        }, {}, 'dark'),
    },
    sidebarBackdrop: {
        base: {
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: "999",
            opacity: "0",
            visibility: "hidden",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            backdropFilter: "blur(4px)",
            "&.sidebarBackdropOpen": {
                opacity: "1",
                visibility: "visible",
            },
            "@media (min-width: 1024px)": {
                display: "none",
            },
        },
    },
    sidebarHeader: {
        base: {
            padding: "1.5rem",
            borderBottom: `1px solid ${borderColorLight}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: "0",
            background: surfaceLight,
        },
    },
    sidebarHeaderDark: {
        base: mergeStyles({
            padding: "1.5rem",
            borderBottom: `1px solid ${borderColorDark}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: "0",
            background: surfaceDark,
        }, {}, 'dark'),
    },
    sidebarBrand: {
        base: {
            fontSize: "1.25rem",
            fontWeight: "700",
            color: primary,
            textDecoration: "none",
            transition: standardTransition,
            "&:hover": {
                opacity: "0.8",
            },
        },
    },
    sidebarCloseButton: {
        base: {
            background: "none",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
            color: textDark,
            padding: "0.375rem",
            borderRadius: radiusSm,
            transition: standardTransition,
            width: "2rem",
            height: "2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "&:hover": {
                background: surfaceAltLight,
            },
            "@media (min-width: 1024px)": {
                display: "none",
            },
        },
    },
    sidebarCloseButtonDark: {
        base: mergeStyles({
            background: "none",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
            color: textLight,
            padding: "0.375rem",
            borderRadius: radiusSm,
            transition: standardTransition,
            width: "2rem",
            height: "2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "&:hover": {
                background: surfaceAltDark,
            },
            "@media (min-width: 1024px)": {
                display: "none",
            },
        }, {}, 'dark'),
    },
    sidebarNav: {
        base: {
            padding: "1rem 0",
            flex: "1",
            overflowY: "auto",
            // Custom scrollbar
            "&::-webkit-scrollbar": {
                width: "4px",
            },
            "&::-webkit-scrollbar-track": {
                background: surfaceAltLight,
            },
            "&::-webkit-scrollbar-thumb": {
                background: borderColorLight,
                borderRadius: "2px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
                background: primary,
            },
        },
    },
    sidebarNavDark: {
        base: mergeStyles({
            padding: "1rem 0",
            flex: "1",
            overflowY: "auto",
            "&::-webkit-scrollbar": {
                width: "4px",
            },
            "&::-webkit-scrollbar-track": {
                background: surfaceAltDark,
            },
            "&::-webkit-scrollbar-thumb": {
                background: borderColorDark,
                borderRadius: "2px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
                background: primaryLight,
            },
        }, {}, 'dark'),
    },
    sidebarGroup: {
        base: {
            marginBottom: "1.5rem",
        },
    },
    sidebarGroupLabel: {
        base: {
            padding: "0.5rem 1.5rem",
            fontSize: "0.75rem",
            fontWeight: "600",
            color: "rgba(0, 0, 0, 0.5)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginBottom: "0.5rem",
        },
    },
    sidebarGroupLabelDark: {
        base: mergeStyles({
            padding: "0.5rem 1.5rem",
            fontSize: "0.75rem",
            fontWeight: "600",
            color: "rgba(255, 255, 255, 0.5)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginBottom: "0.5rem",
        }, {}, 'dark'),
    },
    sidebarLink: {
        base: {
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.75rem 1.5rem",
            color: textDark,
            textDecoration: "none",
            transition: standardTransition,
            borderLeft: "3px solid transparent",
            position: "relative",
            "&:hover": {
                background: surfaceAltLight,
                color: primary,
                borderLeftColor: primary,
                paddingLeft: "1.75rem",
            },
            "&.sidebarActive": {
                background: "rgba(59, 130, 246, 0.1)",
                color: primary,
                borderLeftColor: primary,
                fontWeight: "600",
            },
            "& .sidebarIcon": {
                width: "1.25rem",
                height: "1.25rem",
                opacity: "0.7",
                transition: standardTransition,
                flexShrink: "0",
            },
            "&:hover .sidebarIcon, &.sidebarActive .sidebarIcon": {
                opacity: "1",
                transform: "scale(1.1)",
            },
            "& .sidebarBadge": {
                marginLeft: "auto",
                fontSize: "0.75rem",
                padding: "0.125rem 0.5rem",
                borderRadius: "0.75rem",
                background: primary,
                color: "white",
                fontWeight: "600",
            },
        },
    },
    sidebarLinkDark: {
        base: mergeStyles({
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.75rem 1.5rem",
            color: textLight,
            textDecoration: "none",
            transition: standardTransition,
            borderLeft: "3px solid transparent",
            position: "relative",
            "&:hover": {
                background: surfaceAltDark,
                color: primaryLight,
                borderLeftColor: primaryLight,
                paddingLeft: "1.75rem",
            },
            "&.sidebarActive": {
                background: "rgba(96, 165, 250, 0.1)",
                color: primaryLight,
                borderLeftColor: primaryLight,
                fontWeight: "600",
            },
            "& .sidebarIcon": {
                width: "1.25rem",
                height: "1.25rem",
                opacity: "0.7",
                transition: standardTransition,
                flexShrink: "0",
            },
            "&:hover .sidebarIcon, &.sidebarActive .sidebarIcon": {
                opacity: "1",
                transform: "scale(1.1)",
            },
            "& .sidebarBadge": {
                marginLeft: "auto",
                fontSize: "0.75rem",
                padding: "0.125rem 0.5rem",
                borderRadius: "0.75rem",
                background: primaryLight,
                color: "black",
                fontWeight: "600",
            },
        }, {}, 'dark'),
    },
    sidebarFooter: {
        base: {
            padding: "1rem 1.5rem",
            borderTop: `1px solid ${borderColorLight}`,
            background: surfaceAltLight,
            flexShrink: "0",
        },
    },
    sidebarFooterDark: {
        base: mergeStyles({
            padding: "1rem 1.5rem",
            borderTop: `1px solid ${borderColorDark}`,
            background: surfaceAltDark,
            flexShrink: "0",
        }, {}, 'dark'),
    },
    sidebarCollapsible: {
        base: {
            marginBottom: "0.5rem",
        },
    },
    sidebarCollapsibleHeader: {
        base: {
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.75rem 1.5rem",
            color: textDark,
            textDecoration: "none",
            transition: standardTransition,
            cursor: "pointer",
            border: "none",
            background: "none",
            width: "100%",
            textAlign: "left",
            "&:hover": {
                background: surfaceAltLight,
                color: primary,
            },
            "& .sidebarCollapsibleIcon": {
                transition: standardTransition,
                marginLeft: "auto",
            },
            "&.sidebarCollapsibleOpen .sidebarCollapsibleIcon": {
                transform: "rotate(180deg)",
            },
        },
    },
    sidebarCollapsibleContent: {
        base: {
            overflow: "hidden",
            maxHeight: "0",
            transition: "max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&.sidebarCollapsibleOpen": {
                maxHeight: "500px",
            },
        },
    },
};
