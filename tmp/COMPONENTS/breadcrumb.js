import { primary, mergeStyles, standardTransition, radiusSm, surfaceAltLight, primaryLight, surfaceAltDark } from "../CORECONST";
export const Breadcrumb = { breadcrumb: {
        base: {
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.5rem",
            fontSize: "0.875rem",
            color: "rgba(0, 0, 0, 0.6)",
        },
    },
    breadcrumbItem: {
        base: {
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            "&:not(:last-child)::after": {
                content: '"›"',
                color: "rgba(0, 0, 0, 0.4)",
            },
        },
    },
    breadcrumbLink: {
        base: {
            color: "rgba(0, 0, 0, 0.6)",
            textDecoration: "none",
            transition: standardTransition,
            padding: "0.25rem 0.5rem",
            borderRadius: radiusSm,
            "&:hover": {
                color: primary,
                background: surfaceAltLight,
            },
            "&.breadcrumbActive": {
                color: primary,
                fontWeight: "500",
            },
        },
    },
    breadcrumbDark: {
        base: mergeStyles({
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.5rem",
            fontSize: "0.875rem",
            color: "rgba(255, 255, 255, 0.6)",
        }, {}, 'dark'),
    },
    breadcrumbLinkDark: {
        base: mergeStyles({
            color: "rgba(255, 255, 255, 0.6)",
            textDecoration: "none",
            transition: standardTransition,
            padding: "0.25rem 0.5rem",
            borderRadius: radiusSm,
            "&:hover": {
                color: primaryLight,
                background: surfaceAltDark,
            },
            "&.breadcrumbActive": {
                color: primaryLight,
                fontWeight: "500",
            },
        }, {}, 'dark'),
    },
};
