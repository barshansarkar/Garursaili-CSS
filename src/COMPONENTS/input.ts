import { ComponentBase } from "../components";
import {
  borderColorDark,
  borderColorLight,
  danger,
  inputBase,
  mergeStyles,
  primary,
  primaryLight,
  primaryDark,
  radiusMd,
  radiusSm,
  shadowSm,
  surfaceDark,
  surfaceLight,
  surfaceAltLight,
  success,
  textLight,
  warning,
  blurGlassHeavy,
} from "../CORECONST";
export const inputs: Record<string, ComponentBase> = {

      input: {
        base: inputBase,
      },
    inputSm: {
      base: mergeStyles(inputBase, {
        padding: "0.5rem 0.875rem",
        fontSize: "0.8125rem",
        borderRadius: radiusSm,
      }),
    },

    inputMd: {
      base: mergeStyles(inputBase, {
        padding: "0.75rem 1rem",
        fontSize: "0.9375rem",
      }),
    },

    inputLg: {
      base: mergeStyles(inputBase, {
        padding: "1rem 1.25rem",
        fontSize: "1rem",
        borderRadius: radiusMd,
      }),
    },

    inputXl: {
      base: mergeStyles(inputBase, {
        padding: "1.125rem 1.5rem",
        fontSize: "1.125rem",
        borderRadius: radiusMd,
      }),
    },


    inputDark: {
      base: mergeStyles(inputBase, {
        color: textLight,
        background: surfaceDark,
        border: `1px solid ${borderColorDark}`,
        "&:focus": {
          boxShadow: `0 0 0 2px ${primaryLight}15`,
        },
        "&::placeholder": {
          color: "rgba(255, 255, 255, 0.4)",
        },
      }, 'dark'),
    },

    inputOutline: {
      base: mergeStyles(inputBase, {
        border: `2px solid rgba(59, 130, 246, 0.2)`,
        background: "transparent",
        "&:focus": {
          borderColor: primary,
          boxShadow: `0 0 0 2px ${primary}10`,
        },
      }),
    },

    inputFilled: {
      base: mergeStyles(inputBase, {
        border: "none",
        background: surfaceAltLight,
        "&:focus": {
          background: surfaceLight,
          boxShadow: `0 0 0 2px ${primary}20`,
        },
      }),
    },

    inputGlass: {
      base: mergeStyles(inputBase, {
        border: `1px solid rgba(255, 255, 255, 0.2)`,
        background: "rgba(255, 255, 255, 0.08)",
        backdropFilter: blurGlassHeavy,
        color: textLight,
        "&:focus": {
          background: "rgba(255, 255, 255, 0.12)",
          borderColor: "rgba(255, 255, 255, 0.3)",
        },
        "&::placeholder": {
          color: "rgba(255, 255, 255, 0.6)",
        },
      }),
    },


    inputSuccess: {
      base: mergeStyles(inputBase, {
        borderColor: success,
        boxShadow: `0 0 0 2px ${success}15`,
        "&:focus": {
          borderColor: success,
          boxShadow: `0 0 0 2px ${success}25`,
        },
      }),
    },

    inputError: {
      base: mergeStyles(inputBase, {
        borderColor: danger,
        boxShadow: `0 0 0 2px ${danger}15`,
        "&:focus": {
          borderColor: danger,
          boxShadow: `0 0 0 2px ${danger}25`,
        },
      }),
    },

    inputWarning: {
      base: mergeStyles(inputBase, {
        borderColor: warning,
        boxShadow: `0 0 0 2px ${warning}15`,
        "&:focus": {
          borderColor: warning,
          boxShadow: `0 0 0 2px ${warning}25`,
        },
      }),
    },

    inputDisabled: {
      base: mergeStyles(inputBase, {
        opacity: "0.6",
        cursor: "not-allowed",
        background: surfaceAltLight,
        "&:focus": {
          transform: "none",
          boxShadow: "none",
          borderColor: borderColorLight,
        },
      }),
    },
};