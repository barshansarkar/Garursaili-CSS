import { textLight, textDark, borderColorLight } from "../CORECONST";
export const footer = {
    footer: {
        base: {
            padding: "3rem 1rem", // Reduced
            "text-align": "center",
            background: "linear-gradient(135deg, #0f172a, #1e293b)",
            color: textLight,
            "font-size": "0.9375rem",
            "letter-spacing": "0.25px",
            position: "relative",
            overflow: "hidden",
            "&::before": {
                content: '""',
                position: "absolute",
                top: "0",
                left: "0",
                right: "0",
                height: "1px",
                background: "linear-gradient(90deg, transparent, primary, transparent)",
            },
            "@media (max-width: 640px)": {
                padding: "2rem 0.75rem",
            },
        },
    },
    footerLight: {
        base: {
            padding: "3rem 1rem",
            "text-align": "center",
            background: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
            color: textDark,
            borderTop: `1px solid ${borderColorLight}`,
            "font-size": "0.9375rem",
            "letter-spacing": "0.25px",
            position: "relative",
            overflow: "hidden",
            "&::before": {
                content: '""',
                position: "absolute",
                top: "0",
                left: "0",
                right: "0",
                height: "1px",
                background: "linear-gradient(90deg, transparent, primary, transparent)",
            },
            "@media (max-width: 640px)": {
                padding: "2rem 0.75rem",
            },
        },
    },
};
