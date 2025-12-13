/**
 * ---------------------------------------------------------------------
 *  GARUR-CSS — Ultra-fast Atomic CSS Engine
 *  Author: Barshan Sarkar
 *  Version: 1.0.0
 *  License: MIT
 * ---------------------------------------------------------------------
 *
 *  This CLI powers the Garur-CSS ecosystem. It handles:
 *    • SSC ( SUPER SONIC CYCLONE ) compilation of utility classes
 *    • File scanning across HTML / JS / TS / JSX / TSX
 *    • Cache management and orphan-class detection
 *    • Config file creation (garur.config.js)
 *    • Plugin boilerplate generation
 *    • Watch mode for real-time builds ,, (coming soon)
 *
 *  Technologies:
 *    - TypeScript
 *    - Rollup bundling (CJS-compatible output)
 *    - Node.js (CLI execution via shebang)
 *
 *  Notes for contributors:
 *    • Keep the CLI ESM/CJS compatible.
 *    • Avoid dynamic require unless wrapped safely.
 *    • Keep output messages clean, fast, and developer-friendly.
 *
 *  Made in India.
 * ---------------------------------------------------------------------
 */
import { alertBase, borderColorDark, danger, dangerLight, info, infoLight, mergeStyles, primary, primaryLight, radiusSm, standardTransition, surfaceAltDark, success, successLight, textDark, textLight, warning, warningLight, } from "../CORECONST";
export const alert = {
    alert: {
        base: mergeStyles(alertBase, {
            color: textDark,
            "&::before": {
                background: primary,
            },
        }),
    },
    alertSuccess: {
        base: mergeStyles(alertBase, {
            border: `1px solid rgba(16, 185, 129, 0.2)`,
            background: `rgba(16, 185, 129, 0.08)`,
            color: success,
            "&::before": {
                background: success,
            },
        }),
    },
    alertError: {
        base: mergeStyles(alertBase, {
            border: `1px solid rgba(239, 68, 68, 0.2)`,
            background: `rgba(239, 68, 68, 0.08)`,
            color: danger,
            "&::before": {
                background: danger,
            },
        }),
    },
    alertWarning: {
        base: mergeStyles(alertBase, {
            border: `1px solid rgba(245, 158, 11, 0.2)`,
            background: `rgba(245, 158, 11, 0.08)`,
            color: warning,
            "&::before": {
                background: warning,
            },
        }),
    },
    alertInfo: {
        base: mergeStyles(alertBase, {
            border: `1px solid rgba(6, 182, 212, 0.2)`,
            background: `rgba(6, 182, 212, 0.08)`,
            color: info,
            "&::before": {
                background: info,
            },
        }),
    },
    alertDark: {
        base: mergeStyles(alertBase, {
            background: surfaceAltDark,
            border: `1px solid ${borderColorDark}`,
            color: textLight,
            "&::before": {
                background: primaryLight,
            },
        }, 'dark'),
    },
    alertSuccessDark: {
        base: mergeStyles(alertBase, {
            border: `1px solid rgba(52, 211, 153, 0.2)`,
            background: `rgba(52, 211, 153, 0.08)`,
            color: successLight,
            "&::before": {
                background: successLight,
            },
        }, 'dark'),
    },
    alertErrorDark: {
        base: mergeStyles(alertBase, {
            border: `1px solid rgba(248, 113, 113, 0.2)`,
            background: `rgba(248, 113, 113, 0.08)`,
            color: dangerLight,
            "&::before": {
                background: dangerLight,
            },
        }, 'dark'),
    },
    alertWarningDark: {
        base: mergeStyles(alertBase, {
            border: `1px solid rgba(251, 191, 36, 0.2)`,
            background: `rgba(251, 191, 36, 0.08)`,
            color: warningLight,
            "&::before": {
                background: warningLight,
            },
        }, 'dark'),
    },
    alertInfoDark: {
        base: mergeStyles(alertBase, {
            border: `1px solid rgba(14, 165, 233, 0.2)`,
            background: `rgba(14, 165, 233, 0.08)`,
            color: infoLight,
            "&::before": {
                background: infoLight,
            },
        }, 'dark'),
    },
    alertSm: {
        base: mergeStyles(alertBase, {
            padding: "0.75rem 1rem",
            fontSize: "0.875rem",
            "@media (max-width: 640px)": {
                padding: "0.625rem 0.875rem",
            },
        }),
    },
    alertLg: {
        base: mergeStyles(alertBase, {
            padding: "1.25rem 1.5rem",
            fontSize: "1.0625rem",
            "@media (max-width: 640px)": {
                padding: "1rem 1.25rem",
            },
        }),
    },
    alertDismissible: {
        base: mergeStyles(alertBase, {
            paddingRight: "3rem",
            "@media (max-width: 640px)": {
                paddingRight: "2.5rem",
            },
        }),
    },
    alertClose: {
        base: {
            position: "absolute",
            top: "0.75rem",
            right: "0.75rem",
            background: "none",
            border: "none",
            fontSize: "1.25rem",
            color: "inherit",
            opacity: "0.7",
            cursor: "pointer",
            padding: "0.25rem",
            borderRadius: radiusSm,
            transition: standardTransition,
            lineHeight: "1",
            width: "1.5rem",
            height: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "&:hover": {
                opacity: "1",
                background: "rgba(0, 0, 0, 0.1)",
            },
            ".alertDark &:hover, .alertSuccessDark &:hover, .alertErrorDark &:hover, .alertWarningDark &:hover, .alertInfoDark &:hover": {
                background: "rgba(255, 255, 255, 0.1)",
            },
        },
    },
    alertIcon: {
        base: {
            fontSize: "1.25rem",
            lineHeight: "1",
            flexShrink: "0",
            marginTop: "0.125rem",
        },
    },
    alertContent: {
        base: {
            flex: "1",
            minWidth: "0",
        },
    },
    alertTitle: {
        base: {
            fontWeight: "600",
            margin: "0 0 0.25rem 0",
            fontSize: "1em",
        },
    },
    alertDescription: {
        base: {
            margin: "0",
            opacity: "0.9",
            fontSize: "0.9375em",
            lineHeight: "1.5",
        },
    },
    alertGroup: {
        base: {
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
        },
    },
    alertBanner: {
        base: mergeStyles(alertBase, {
            borderRadius: "0",
            borderLeft: "none",
            borderRight: "none",
            margin: "0 -1rem",
            padding: "0.75rem 1rem",
            "&::before": {
                borderRadius: "0",
            },
            "@media (min-width: 1025px)": {
                margin: "0 -2rem",
                padding: "0.75rem 2rem",
            },
        }),
    },
    alertBannerSuccess: {
        base: mergeStyles(alertBase, {
            border: `1px solid rgba(16, 185, 129, 0.2)`,
            background: `rgba(16, 185, 129, 0.08)`,
            color: success,
            "&::before": {
                background: success,
            },
        }),
    },
    alertWithActions: {
        base: mergeStyles(alertBase, {
            paddingBottom: "1.25rem",
        }),
    },
    alertActions: {
        base: {
            display: "flex",
            gap: "0.5rem",
            marginTop: "0.75rem",
            flexWrap: "wrap",
            "& .btnSm": {
                fontSize: "0.75rem",
                padding: "0.25rem 0.75rem",
            },
        },
    },
};
