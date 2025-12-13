import { ComponentBase } from "../components";
import {radiusSm, radiusMd,surfaceLight,borderColorLight, skeletonBase} from "../CORECONST"
export const Skeleton : Record <string , ComponentBase > = {
 skeleton: {
    base: skeletonBase,
  },
  skeletonDark: {
    base: {
      background: "linear-gradient(90deg, #334155 25%, #475569 50%, #334155 75%)",
      "background-size": "200% 100%",
      "border-radius": radiusSm,
      animation: "shimmer 1.5s infinite",
    },
  },
    skeletonText: {
      base: {
        height: "1rem",
        marginBottom: "0.5rem",

        "&:last-child": {
          marginBottom: "0",
          width: "80%",
        },
      },
    },

    skeletonTitle: {
      base: {
        height: "1.5rem",
        marginBottom: "1rem",
        width: "60%",
      },
    },

    skeletonAvatar: {
      base: {
        width: "3rem",
        height: "3rem",
        borderRadius: "50%",
      },
    },

    skeletonButton: {
      base: {
        height: "2.5rem",
        width: "6rem",
        borderRadius: radiusSm,
      },
    },

    skeletonCard: {
      base: {
        padding: "1.5rem",
        borderRadius: radiusMd,
        background: surfaceLight,
        border: `1px solid ${borderColorLight}`,
      },
    },

    skeletonImage: {
      base: {
        width: "100%",
        height: "12rem",
        borderRadius: radiusSm,
        marginBottom: "1rem",
      },
    },
}