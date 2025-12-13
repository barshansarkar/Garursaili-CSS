import { danger, success, textDark, textLight, mergeStyles, cardBase, standardTransition, } from "../CORECONST";
export const formGroups = {
    formGroup: {
        base: {
            marginBottom: "1.5rem",
            position: "relative",
        },
    },
    formLabel: {
        base: {
            display: "block",
            marginBottom: "0.5rem",
            fontWeight: "500",
            color: textDark,
            fontSize: "0.875rem",
            transition: standardTransition,
        },
    },
    formLabelDark: {
        base: {
            display: "block",
            marginBottom: "0.5rem",
            fontWeight: "500",
            color: textLight,
            fontSize: "0.875rem",
        },
    },
    formHelp: {
        base: {
            display: "block",
            marginTop: "0.25rem",
            fontSize: "0.75rem",
            color: "rgba(0, 0, 0, 0.6)",
        },
    },
    formHelpError: {
        base: {
            display: "block",
            marginTop: "0.25rem",
            fontSize: "0.75rem",
            color: danger,
            fontWeight: "500",
        },
    },
    formHelpSuccess: {
        base: {
            display: "block",
            marginTop: "0.25rem",
            fontSize: "0.75rem",
            color: success,
            fontWeight: "500",
        },
    },
    // 📋 FORM CONTAINERS
    form: {
        base: {
            width: "100%",
        },
    },
    formCard: {
        base: mergeStyles(cardBase, {
            padding: "2rem",
            "@media (max-width: 640px)": {
                padding: "1.5rem",
            },
        }),
    },
    formInline: {
        base: {
            display: "flex",
            gap: "1rem",
            alignItems: "flex-end",
            "@media (max-width: 640px)": {
                flexDirection: "column",
                alignItems: "stretch",
            },
        },
    },
    // 🔄 FORM VALIDATION STATES
    formValid: {
        base: {
            "& .formLabel": {
                color: success,
            },
        },
    },
    formInvalid: {
        base: {
            "& .formLabel": {
                color: danger,
            },
        },
    },
};
