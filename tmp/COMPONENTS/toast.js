import { mergeStyles, toastBase, danger, warning, success, info, textLight, borderColorDark, surfaceDark } from "../CORECONST";
export const Toast = {
    toastSuccess: {
        base: mergeStyles(toastBase, {
            border: `1px solid rgba(16, 185, 129, 0.2)`,
            background: `rgba(16, 185, 129, 0.1)`,
            color: success,
        }),
    },
    toastError: {
        base: mergeStyles(toastBase, {
            border: `1px solid rgba(239, 68, 68, 0.2)`,
            background: `rgba(239, 68, 68, 0.1)`,
            color: danger,
        }),
    },
    toastWarning: {
        base: mergeStyles(toastBase, {
            border: `1px solid rgba(245, 158, 11, 0.2)`,
            background: `rgba(245, 158, 11, 0.1)`,
            color: warning,
        }),
    },
    toastInfo: {
        base: mergeStyles(toastBase, {
            border: `1px solid rgba(6, 182, 212, 0.2)`,
            background: `rgba(6, 182, 212, 0.1)`,
            color: info,
        }),
    },
    toastDark: {
        base: mergeStyles(toastBase, {
            background: surfaceDark,
            color: textLight,
            border: `1px solid ${borderColorDark}`,
        }, 'dark'),
    },
    // 🏗️ TOAST STRUCTURE
    toastHeader: {
        base: {
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: "0.5rem",
            gap: "0.5rem",
        },
    },
    toastTitle: {
        base: {
            fontWeight: "600",
            fontSize: "0.875rem",
            margin: "0",
            flex: "1",
        },
    },
    toastBody: {
        base: {
            fontSize: "0.875rem",
            opacity: "0.9",
            lineHeight: "1.4",
        },
    },
    toastProgress: {
        base: {
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            height: "2px",
            background: "rgba(0, 0, 0, 0.1)",
            borderRadius: "0 0 0.5rem 0.5rem",
            overflow: "hidden",
            "&::after": {
                content: '""',
                position: "absolute",
                top: "0",
                left: "0",
                bottom: "0",
                background: "currentColor",
                opacity: "0.3",
                animation: "toastProgress 5s linear forwards",
            },
        },
    },
    // 📱 TOAST CONTAINER
    toastContainer: {
        base: {
            position: "fixed",
            top: "1rem",
            right: "1rem",
            zIndex: "10000",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            maxWidth: "24rem",
            "@media (max-width: 640px)": {
                right: "0.5rem",
                left: "0.5rem",
                top: "0.5rem",
                maxWidth: "none",
            },
        },
    },
};
