import { mergeStyles, spinnerBase, primary, success } from "../CORECONST";
export const Spinner = {
    spinner: {
        base: mergeStyles(spinnerBase, {
            width: "2rem",
            height: "2rem",
            borderTop: "2px solid currentColor",
        }),
    },
    spinnerSm: {
        base: mergeStyles(spinnerBase, {
            width: "1rem",
            height: "1rem",
            borderTop: "2px solid currentColor",
        }),
    },
    spinnerLg: {
        base: mergeStyles(spinnerBase, {
            width: "3rem",
            height: "3rem",
            borderTop: "3px solid currentColor",
        }),
    },
    spinnerXl: {
        base: mergeStyles(spinnerBase, {
            width: "4rem",
            height: "4rem",
            borderTop: "4px solid currentColor",
        }),
    },
    spinnerPrimary: {
        base: mergeStyles(spinnerBase, {
            width: "2rem",
            height: "2rem",
            border: "2px solid rgba(59, 130, 246, 0.2)",
            borderTop: "2px solid primary",
        }),
    },
    spinnerSuccess: {
        base: mergeStyles(spinnerBase, {
            width: "2rem",
            height: "2rem",
            border: "2px solid rgba(16, 185, 129, 0.2)",
            borderTop: "2px solid success",
        }),
    },
    spinnerDanger: {
        base: mergeStyles(spinnerBase, {
            width: "2rem",
            height: "2rem",
            border: "2px solid rgba(239, 68, 68, 0.2)",
            borderTop: "2px solid danger",
        }),
    },
    spinnerWarning: {
        base: mergeStyles(spinnerBase, {
            width: "2rem",
            height: "2rem",
            border: "2px solid rgba(245, 158, 11, 0.2)",
            borderTop: "2px solid warning",
        }),
    },
    spinnerInfo: {
        base: mergeStyles(spinnerBase, {
            width: "2rem",
            height: "2rem",
            border: "2px solid rgba(6, 182, 212, 0.2)",
            borderTop: "2px solid info",
        }),
    },
    spinnerDark: {
        base: mergeStyles(spinnerBase, {
            width: "2rem",
            height: "2rem",
            border: "2px solid rgba(255, 255, 255, 0.2)",
            borderTop: "2px solid primaryLight",
        }, 'dark'),
    },
    spinnerDots: {
        base: {
            display: "inline-flex",
            gap: "0.25rem",
            alignItems: "center",
            "& span": {
                width: "0.5rem",
                height: "0.5rem",
                borderRadius: "50%",
                background: "currentColor",
                animation: "pulse 1.4s ease-in-out infinite both",
                "&:nth-child(1)": { animationDelay: "-0.32s" },
                "&:nth-child(2)": { animationDelay: "-0.16s" },
                "&:nth-child(3)": { animationDelay: "0s" },
            },
        },
    },
    spinnerDotsSm: {
        base: {
            display: "inline-flex",
            gap: "0.125rem",
            "& span": {
                width: "0.375rem",
                height: "0.375rem",
                borderRadius: "50%",
                background: "currentColor",
                animation: "pulse 1.4s ease-in-out infinite both",
            },
        },
    },
    spinnerDotsLg: {
        base: {
            display: "inline-flex",
            gap: "0.375rem",
            "& span": {
                width: "0.75rem",
                height: "0.75rem",
                borderRadius: "50%",
                background: "currentColor",
                animation: "pulse 1.4s ease-in-out infinite both",
            },
        },
    },
    spinnerBars: {
        base: {
            display: "inline-flex",
            gap: "0.125rem",
            alignItems: "end",
            height: "1rem",
            "& span": {
                width: "0.25rem",
                background: "currentColor",
                borderRadius: "1px",
                animation: "bars 1.2s ease-in-out infinite",
                "&:nth-child(1)": {
                    animationDelay: "-1.2s",
                    height: "0.5rem"
                },
                "&:nth-child(2)": {
                    animationDelay: "-1.1s",
                    height: "0.75rem"
                },
                "&:nth-child(3)": {
                    animationDelay: "-1.0s",
                    height: "1rem"
                },
                "&:nth-child(4)": {
                    animationDelay: "-0.9s",
                    height: "0.75rem"
                },
                "&:nth-child(5)": {
                    animationDelay: "-0.8s",
                    height: "0.5rem"
                },
            },
        },
    },
    spinnerBarsSm: {
        base: {
            display: "inline-flex",
            gap: "0.0625rem",
            alignItems: "end",
            height: "0.75rem",
            "& span": {
                width: "0.1875rem",
                background: "currentColor",
                borderRadius: "1px",
                animation: "bars 1.2s ease-in-out infinite",
                height: "0.375rem",
            },
        },
    },
    spinnerBarsLg: {
        base: {
            display: "inline-flex",
            gap: "0.1875rem",
            alignItems: "end",
            height: "1.5rem",
            "& span": {
                width: "0.375rem",
                background: "currentColor",
                borderRadius: "1px",
                animation: "bars 1.2s ease-in-out infinite",
                height: "0.75rem",
            },
        },
    },
    spinnerCircle: {
        base: {
            width: "2rem",
            height: "2rem",
            borderRadius: "50%",
            background: "conic-gradient(transparent, currentColor)",
            mask: "radial-gradient(farthest-side, transparent calc(100% - 2px), white 0)",
            animation: "spin 1s linear infinite",
        },
    },
    loader: {
        base: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
            padding: "2rem",
            textAlign: "center",
        },
    },
    loaderInline: {
        base: {
            display: "inline-flex",
            alignItems: "center",
            gap: "0.75rem",
        },
    },
    loaderText: {
        base: {
            fontSize: "0.875rem",
            color: "rgba(0, 0, 0, 0.6)",
            fontWeight: "500",
            margin: "0",
        },
    },
    loaderTextDark: {
        base: {
            fontSize: "0.875rem",
            color: "rgba(255, 255, 255, 0.7)",
            fontWeight: "500",
            margin: "0",
        },
    },
    spinnerGlow: {
        base: {
            width: "2rem",
            height: "2rem",
            borderRadius: "50%",
            background: primary,
            boxShadow: `0 0 0 0 rgba(59, 130, 246, 0.7)`,
            animation: "glowPulse 1.5s infinite",
        },
    },
    spinnerGlowSuccess: {
        base: {
            width: "2rem",
            height: "2rem",
            borderRadius: "50%",
            background: success,
            boxShadow: `0 0 0 0 rgba(16, 185, 129, 0.7)`,
            animation: "glowPulse 1.5s infinite",
        },
    },
};
