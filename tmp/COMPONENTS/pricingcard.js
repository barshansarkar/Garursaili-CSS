import { radiusLg, surfaceLight, borderColorLight, shadowSm, standardTransition, blurGlass, surfaceDark, mergeStyles, borderColorDark, shadowLg } from "../CORECONST";
export const pricingCard = {
    pricingCard: {
        base: {
            padding: "2rem 1.25rem", // Reduced
            "border-radius": radiusLg,
            background: surfaceLight,
            "box-shadow": shadowSm,
            border: `1px solid ${borderColorLight}`,
            transition: standardTransition,
            "&:hover": {
                transform: "translateY(-4px)", // Subtle
                "box-shadow": shadowLg,
            },
            "backdrop-filter": blurGlass,
            "@media (max-width: 640px)": {
                padding: "1.5rem 1rem",
            },
        },
    },
    pricingCardDark: {
        base: mergeStyles({
            padding: "2rem 1.25rem",
            "border-radius": radiusLg,
            background: surfaceDark,
            "box-shadow": shadowSm,
            border: `1px solid ${borderColorDark}`,
            transition: standardTransition,
            "&:hover": {
                transform: "translateY(-4px)",
                "box-shadow": shadowLg,
            },
            "backdrop-filter": blurGlass,
            "@media (max-width: 640px)": {
                padding: "1.5rem 1rem",
            },
        }, {}, 'dark'),
    },
};
