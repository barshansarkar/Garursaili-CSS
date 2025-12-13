import { borderColorLight, borderColorDark, tabBase, textLight, primary, primaryLight, mergeStyles } from "../CORECONST";
export const TABS = {
    tabs: {
        base: {
            display: "flex",
            "border-bottom": `1px solid ${borderColorLight}`,
            gap: "0.5rem", // Reduced
            "@media (max-width: 640px)": {
                flexDirection: "column",
                gap: "0",
            },
        },
    },
    tabsDark: {
        base: {
            display: "flex",
            "border-bottom": `1px solid ${borderColorDark}`,
            gap: "0.5rem",
            "@media (max-width: 640px)": {
                flexDirection: "column",
                gap: "0",
            },
        },
    },
    tab: {
        base: tabBase,
    },
    tabDark: {
        base: mergeStyles(tabBase, {
            color: textLight,
        }, 'dark'),
    },
    tabActive: {
        base: mergeStyles(tabBase, {
            "border-bottom": `2px solid ${primary}`,
            color: primary,
            "font-weight": "600",
            background: "rgba(59, 130, 246, 0.03)", // Subtler
        }),
    },
    tabActiveDark: {
        base: mergeStyles(mergeStyles(tabBase, {
            "border-bottom": `2px solid ${primaryLight}`,
            color: primaryLight,
            "font-weight": "600",
            background: "rgba(96, 165, 250, 0.03)",
        }), {}, 'dark'),
    },
};
