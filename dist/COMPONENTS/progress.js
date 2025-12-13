import { mergeStyles, surfaceAltLight, borderColorDark, borderColorLight, progressBase, surfaceAltDark, primary, primaryDark, primaryLight, success, successDark, successLight, danger, dangerDark, warning, warningDark, warningLight, dangerLight, surfaceDark, surfaceLight, info, infoDark, infoLight, radiusSm, blurGlass, blurGlassHeavy } from "../CORECONST";
export const progress = {
    progress: {
        base: mergeStyles(progressBase, {
            height: "0.5rem",
            background: surfaceAltLight,
            border: `1px solid ${borderColorLight}`,
        }),
    },
    progressDark: {
        base: mergeStyles(progressBase, {
            height: "0.5rem",
            background: surfaceAltDark,
            border: `1px solid ${borderColorDark}`,
        }, 'dark'),
    },
    progressSm: {
        base: mergeStyles(progressBase, {
            height: "0.375rem",
            background: surfaceAltLight,
            border: `1px solid ${borderColorLight}`,
        }),
    },
    progressLg: {
        base: mergeStyles(progressBase, {
            height: "0.75rem",
            background: surfaceAltLight,
            border: `1px solid ${borderColorLight}`,
        }),
    },
    progressXl: {
        base: mergeStyles(progressBase, {
            height: "1rem",
            background: surfaceAltLight,
            border: `1px solid ${borderColorLight}`,
        }),
    },
    progressFill: {
        base: {
            height: "100%",
            background: `linear-gradient(90deg, ${primaryDark}, ${primary}, ${primaryLight})`,
            transition: "width 0.6s ease",
            borderRadius: "inherit",
            position: "relative",
            overflow: "hidden",
            "&::after": {
                content: '""',
                position: "absolute",
                top: "0",
                left: "0",
                bottom: "0",
                right: "0",
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                animation: "shimmer 2s infinite",
            },
        },
    },
    progressFillSuccess: {
        base: {
            height: "100%",
            background: `linear-gradient(90deg, ${successDark}, ${success}, ${successLight})`,
            transition: "width 0.6s ease",
            borderRadius: "inherit",
            position: "relative",
            overflow: "hidden",
        },
    },
    progressFillError: {
        base: {
            height: "100%",
            background: `linear-gradient(90deg, ${dangerDark}, ${danger}, ${dangerLight})`,
            transition: "width 0.6s ease",
            borderRadius: "inherit",
            position: "relative",
            overflow: "hidden",
        },
    },
    progressFillWarning: {
        base: {
            height: "100%",
            background: `linear-gradient(90deg, ${warningDark}, ${warning}, ${warningLight})`,
            transition: "width 0.6s ease",
            borderRadius: "inherit",
            position: "relative",
            overflow: "hidden",
        },
    },
    progressFillInfo: {
        base: {
            height: "100%",
            background: `linear-gradient(90deg, ${infoDark}, ${info}, ${infoLight})`,
            transition: "width 0.6s ease",
            borderRadius: "inherit",
            position: "relative",
            overflow: "hidden",
        },
    },
    progressGradient: {
        base: {
            height: "100%",
            background: `linear-gradient(90deg, ${primary}, ${success}, ${warning}, ${danger})`,
            transition: "width 0.6s ease",
            borderRadius: "inherit",
            position: "relative",
            overflow: "hidden",
        },
    },
    progressRainbow: {
        base: {
            height: "100%",
            background: `linear-gradient(90deg, #ff6b6b, #ffa726, #ffee58, #66bb6a, #42a5f5, #5c6bc0, #ab47bc)`,
            transition: "width 0.6s ease",
            borderRadius: "inherit",
            position: "relative",
            overflow: "hidden",
        },
    },
    progressLabel: {
        base: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.5rem",
            fontSize: "0.875rem",
            fontWeight: "500",
        },
    },
    progressValue: {
        base: {
            fontSize: "0.875rem",
            fontWeight: "600",
            color: primary,
        },
    },
    progressValueSuccess: {
        base: {
            fontSize: "0.875rem",
            fontWeight: "600",
            color: success,
        },
    },
    progressValueError: {
        base: {
            fontSize: "0.875rem",
            fontWeight: "600",
            color: danger,
        },
    },
    progressWithIcon: {
        base: {
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
        },
    },
    progressIcon: {
        base: {
            fontSize: "1rem",
            width: "1.5rem",
            height: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: "0",
        },
    },
    progressAnimated: {
        base: {
            height: "100%",
            background: `linear-gradient(90deg, ${primaryDark}, ${primary}, ${primaryLight})`,
            transition: "width 0.6s ease",
            borderRadius: "inherit",
            position: "relative",
            overflow: "hidden",
            animation: "pulse 2s ease-in-out infinite",
        },
    },
    progressStriped: {
        base: {
            height: "100%",
            background: `linear-gradient(45deg, ${primary} 25%, transparent 25%, transparent 50%, ${primary} 50%, ${primary} 75%, transparent 75%, transparent)`,
            backgroundSize: "1rem 1rem",
            transition: "width 0.6s ease",
            borderRadius: "inherit",
            animation: "stripes 1s linear infinite",
        },
    },
    progressStripedSuccess: {
        base: {
            height: "100%",
            background: `linear-gradient(45deg, ${success} 25%, transparent 25%, transparent 50%, ${success} 50%, ${success} 75%, transparent 75%, transparent)`,
            backgroundSize: "1rem 1rem",
            transition: "width 0.6s ease",
            borderRadius: "inherit",
            animation: "stripes 1s linear infinite",
        },
    },
    progressCircle: {
        base: {
            width: "4rem",
            height: "4rem",
            borderRadius: "50%",
            background: `conic-gradient(primary 0%, ${surfaceAltLight} 0%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            "&::before": {
                content: '""',
                position: "absolute",
                width: "3rem",
                height: "3rem",
                borderRadius: "50%",
                background: surfaceLight,
            },
        },
    },
    progressCircleLg: {
        base: {
            width: "6rem",
            height: "6rem",
            borderRadius: "50%",
            background: `conic-gradient(primary 0%, ${surfaceAltLight} 0%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            "&::before": {
                content: '""',
                position: "absolute",
                width: "4.5rem",
                height: "4.5rem",
                borderRadius: "50%",
                background: surfaceLight,
            },
        },
    },
    progressCircleText: {
        base: {
            position: "relative",
            zIndex: "1",
            fontSize: "0.875rem",
            fontWeight: "600",
            color: primary,
        },
    },
    progressStacked: {
        base: {
            display: "flex",
            height: "0.5rem",
            borderRadius: radiusSm,
            overflow: "hidden",
            background: surfaceAltLight,
        },
    },
    progressStackedSegment: {
        base: {
            height: "100%",
            transition: "width 0.6s ease",
            "&:not(:last-child)": {
                borderRight: `2px solid ${surfaceLight}`,
            },
        },
    },
    progressGroup: {
        base: {
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
        },
    },
    progressSteps: {
        base: {
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
        },
    },
    progressStep: {
        base: {
            flex: "1",
            height: "0.25rem",
            background: surfaceAltLight,
            borderRadius: radiusSm,
            transition: "all 0.3s ease",
            "&.progressStepActive": {
                background: primary,
            },
            "&.progressStepCompleted": {
                background: success,
            },
        },
    },
    progressFillDark: {
        base: {
            height: "100%",
            background: `linear-gradient(90deg, ${primaryLight}, ${primary})`,
            transition: "width 0.6s ease",
            borderRadius: "inherit",
            position: "relative",
            overflow: "hidden",
        },
    },
    progressCircleDark: {
        base: {
            width: "4rem",
            height: "4rem",
            borderRadius: "50%",
            background: `conic-gradient(${primaryLight} 0%, ${surfaceAltDark} 0%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            "&::before": {
                content: '""',
                position: "absolute",
                width: "3rem",
                height: "3rem",
                borderRadius: "50%",
                background: surfaceDark,
            },
        },
    },
    progressIndeterminate: {
        base: {
            height: "100%",
            background: `linear-gradient(90deg, ${primaryDark}, ${primary}, ${primaryLight})`,
            borderRadius: "inherit",
            position: "relative",
            overflow: "hidden",
            animation: "indeterminate 1.5s ease-in-out infinite",
        },
    },
    progressThreshold: {
        base: {
            position: "relative",
        },
    },
    progressThresholdMarker: {
        base: {
            position: "absolute",
            top: "-0.25rem",
            width: "2px",
            height: "1rem",
            background: danger,
            transform: "translateX(-50%)",
            "&::after": {
                content: 'attr(data-threshold)',
                position: "absolute",
                top: "-1.5rem",
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: "0.75rem",
                color: danger,
                fontWeight: "600",
                whiteSpace: "nowrap",
            },
        },
    },
    progressGlass: {
        base: mergeStyles(progressBase, {
            height: "0.5rem",
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            backdropFilter: blurGlassHeavy,
        }),
    },
    progressFillGlass: {
        base: {
            height: "100%",
            background: "linear-gradient(90deg, rgba(59, 130, 246, 0.8), rgba(96, 165, 250, 0.8))",
            transition: "width 0.6s ease",
            borderRadius: "inherit",
            position: "relative",
            overflow: "hidden",
            backdropFilter: blurGlass,
        },
    },
    progressRing: {
        base: {
            width: "3rem",
            height: "3rem",
            borderRadius: "50%",
            background: `conic-gradient(primary 0%, ${surfaceAltLight} 0%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            "&::before": {
                content: '""',
                position: "absolute",
                width: "2.25rem",
                height: "2.25rem",
                borderRadius: "50%",
                background: surfaceLight,
            },
            "& .progressRingText": {
                position: "relative",
                zIndex: "1",
                fontSize: "0.75rem",
                fontWeight: "600",
                color: primary,
            },
        },
    },
};
