import { primary, surfaceDark, surfaceLight, textDark, textLight, borderColorLight, radiusMd, shadowSm, standardTransition } from "../CORECONST";
export const navbar = {
    navbar: {
        base: {
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            zIndex: "1000",
            background: "rgba(255, 255, 255, 0.85)",
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
            backdropFilter: "blur(16px)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&.scrolled": {
                background: "rgba(255, 255, 255, 0.95)",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            },
        },
        dark: {
            background: "rgba(17, 24, 39, 0.85)",
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.3)",
            "&.scrolled": {
                background: "rgba(17, 24, 39, 0.95)",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.4)",
            },
        },
    },
    navContainer: {
        base: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "0 auto",
            maxWidth: "1280px",
            height: "3.5rem",
            padding: "0 1rem",
            "@media (min-width: 640px)": {
                height: "4rem",
                padding: "0 1.5rem",
            },
            "@media (min-width: 1025px)": {
                height: "4.5rem",
                padding: "0 2rem",
            },
        },
    },
    navBrand: {
        base: {
            fontSize: "1.25rem",
            fontWeight: "700",
            background: "linear-gradient(135deg, #60a5fa, #3b82f6, #2563eb)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textDecoration: "none",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
                opacity: "0.9",
                transform: "scale(1.02)",
            },
            "@media (min-width: 640px)": {
                fontSize: "1.5rem",
            },
            "@media (max-width: 768px)": {
                fontSize: "1.125rem",
            },
        },
    },
    navLinks: {
        base: {
            display: "flex",
            gap: "1.5rem",
            alignItems: "center",
            listStyle: "none",
            "@media (max-width: 1024px)": {
                display: "none",
            },
        },
    },
    navLink: {
        base: {
            color: "#1e293b",
            fontWeight: "500",
            textDecoration: "none",
            padding: "0.375rem 0",
            position: "relative",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&.active": {
                color: "#3b82f6",
                "&::after": {
                    width: "100%",
                },
            },
            dark: {
                color: "#f1f5f9",
                "&.active": { color: "#60a5fa" },
            },
            "&::after": {
                content: '""',
                position: "absolute",
                bottom: "0",
                left: "50%",
                width: "0",
                height: "2px",
                background: "#3b82f6",
                transform: "translateX(-50%)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            },
            "&:hover": {
                color: "#3b82f6",
                dark: { color: "#60a5fa" },
                "&::after": {
                    width: "100%",
                },
            },
        },
    },
    menuButton: {
        base: {
            display: "none",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "2.5rem",
            height: "2.5rem",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0.375rem",
            borderRadius: radiusMd,
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            position: "relative",
            zIndex: "1001",
            color: "#1e293b",
            dark: { color: "#f1f5f9" },
            "&:hover": {
                background: "rgba(0, 0, 0, 0.05)",
                dark: { background: "rgba(255, 255, 255, 0.1)" },
            },
            "@media (max-width: 1024px)": {
                display: "flex",
            },
            "& .bar": {
                display: "block",
                width: "22px",
                height: "2px",
                background: "currentColor",
                margin: "3px 0",
                transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                borderRadius: "1px",
            },
        },
        active: {
            "& .bar:nth-child(1)": {
                transform: "translateY(7px) rotate(45deg)",
            },
            "& .bar:nth-child(2)": {
                opacity: "0",
                transform: "translateX(-100%)",
            },
            "& .bar:nth-child(3)": {
                transform: "translateY(-7px) rotate(-45deg)",
            },
        },
    },
    mobileMenu: {
        base: {
            position: "fixed",
            top: "3.5rem",
            left: "0",
            right: "0",
            background: "#ffffff",
            backdropFilter: "blur(16px)",
            borderTop: "1px solid rgba(148, 163, 184, 0.3)",
            padding: "1rem 0.75rem",
            transform: "translateY(-100%)",
            opacity: "0",
            visibility: "hidden",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            zIndex: "999",
            maxHeight: "calc(100vh - 3.5rem)",
            overflowY: "auto",
            "&::before": {
                content: '""',
                position: "fixed",
                top: "0",
                left: "0",
                right: "0",
                bottom: "0",
                background: "rgba(0, 0, 0, 0.5)",
                opacity: "0",
                visibility: "hidden",
                zIndex: "-1",
                transition: "opacity 0.4s ease",
            },
            "@media (min-width: 1025px)": {
                display: "none",
            },
            "@media (max-width: 768px)": {
                top: "3rem",
                maxHeight: "calc(100vh - 3rem)",
                padding: "0.75rem",
            },
        },
        mobileMenuOpen: {
            transform: "translateY(0)",
            opacity: "1",
            visibility: "visible",
            "&::before": {
                opacity: "1",
                visibility: "visible",
            },
        },
        dark: {
            background: "#1f2937",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            "&::before": {
                background: "rgba(0, 0, 0, 0.7)",
            },
        },
    },
    mobileMenuItem: {
        base: {
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "1rem 0.75rem",
            fontSize: "1.125rem",
            fontWeight: "500",
            color: "#1e293b",
            textDecoration: "none",
            borderBottom: "1px solid rgba(148, 163, 184, 0.3)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            position: "relative",
            overflow: "hidden",
            "&:last-child": {
                borderBottom: "none",
            },
            "&:hover": {
                color: "#3b82f6",
                paddingLeft: "1.25rem",
                background: "#f8fafc",
                dark: {
                    color: "#60a5fa",
                    background: "#374151",
                },
                "&::before": {
                    transform: "translateX(0)",
                },
            },
            "&::before": {
                content: '""',
                position: "absolute",
                left: "0",
                top: "0",
                bottom: "0",
                width: "4px",
                background: "#3b82f6",
                transform: "translateX(-100%)",
                transition: "transform 0.3s ease",
            },
            "@media (max-width: 640px)": {
                fontSize: "1rem",
                padding: "0.875rem 0.75rem",
            },
        },
        dark: {
            color: "#f1f5f9",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            "&:hover": {
                background: "#374151",
            },
        },
    },
    themeToggle: {
        base: {
            background: "none",
            border: "none",
            color: "#1e293b",
            cursor: "pointer",
            padding: "0.5rem",
            borderRadius: "6px",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.875rem",
            fontWeight: "500",
            "&:hover": {
                background: "rgba(0, 0, 0, 0.05)",
                dark: { background: "rgba(255, 255, 255, 0.1)" },
                transform: "scale(1.05)",
            },
            "& .icon": {
                transition: "transform 0.3s ease",
            },
            "&.dark .icon": {
                transform: "rotate(180deg)",
            },
        },
        dark: {
            color: "#f1f5f9",
            "&:hover": {
                background: "rgba(255, 255, 255, 0.1)",
            },
        },
    },
    darkToggle: {
        base: {
            position: "fixed",
            top: "0.75rem",
            right: "0.75rem",
            zIndex: "10000",
            padding: "0.375rem 0.875rem",
            background: surfaceDark,
            color: textLight,
            border: "none",
            borderRadius: radiusMd,
            cursor: "pointer",
            fontSize: "0.8125rem",
            transition: standardTransition,
            "&:hover": {
                transform: "scale(1.02)",
                boxShadow: shadowSm,
            },
            "&:focus": {
                outline: "none",
                boxShadow: `0 0 0 2px ${primary}20`,
            },
        },
    },
    darkToggleLight: {
        base: {
            position: "fixed",
            top: "0.75rem",
            right: "0.75rem",
            zIndex: "10000",
            padding: "0.375rem 0.875rem",
            background: surfaceLight,
            color: textDark,
            border: `1px solid ${borderColorLight}`,
            borderRadius: radiusMd,
            cursor: "pointer",
            fontSize: "0.8125rem",
            transition: standardTransition,
            "&:hover": {
                transform: "scale(1.02)",
                boxShadow: shadowSm,
            },
            "&:focus": {
                outline: "none",
                boxShadow: `0 0 0 2px ${primary}20`,
            },
        },
    },
};
