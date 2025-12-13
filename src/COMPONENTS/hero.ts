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

import { ComponentBase } from "../components";

export const hero: Record<string, ComponentBase> = {

    hero: {
      base: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(135deg, #0b132b 0%, #1c2a44 50%, #2d4059 100%)",
        color: "#f8fafc",
        textAlign: "center",
        padding: "0 1.5rem",
        isolation: "isolate",


        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background: `
            linear-gradient(90deg, transparent 60px, #334155 60px, #334155 120px),
            linear-gradient(0deg, transparent 30px, #334155 30px, #334155 60px)
          `,
          backgroundSize: "120px 60px",
          opacity: 0.08,
          animation: "gridScroll 40s linear infinite",
          pointerEvents: "none",
          willChange: "transform",
        },


        "&::after": {
          content: '""',
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(circle at 15% 85%, rgba(96, 165, 250, 0.4) 0%, transparent 50%),
            radial-gradient(circle at 85% 15%, rgba(52, 211, 153, 0.4) 0%, transparent 50%),
            radial-gradient(circle at 50% 40%, rgba(167, 139, 250, 0.4) 0%, transparent 60%)
          `,
          opacity: 0.4,
          animation: "meshPulse 22s ease-in-out infinite alternate",
          pointerEvents: "none",
        },

        "@media (max-width: 768px)": {
          padding: "0 1rem",
          minHeight: "90vh",
        },
        "@media (max-width: 480px)": {
          padding: "0 0.75rem",
          minHeight: "85vh",
        },


        "@media (prefers-reduced-motion: reduce)": {
          "&::before": {
            animation: "none",
            opacity: 0.05,
          },
          "&::after": {
            animation: "none",
            opacity: 0.3,
          },
        },
      },
    },

    heroLight: {
      base: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)",
        color: "#0f172a",
        textAlign: "center",
        padding: "0 1.5rem",
        isolation: "isolate",

        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background: `
            linear-gradient(90deg, transparent 60px, #e2e8f0 60px, #e2e8f0 120px),
            linear-gradient(0deg, transparent 30px, #e2e8f0 30px, #e2e8f0 60px)
          `,
          backgroundSize: "120px 60px",
          opacity: 0.06,
          animation: "gridScroll 40s linear infinite",
          pointerEvents: "none",
          willChange: "transform",
        },

        "&::after": {
          content: '""',
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(circle at 15% 85%, rgba(59, 130, 246, 0.4) 0%, transparent 50%),
            radial-gradient(circle at 85% 15%, rgba(16, 185, 129, 0.4) 0%, transparent 50%),
            radial-gradient(circle at 50% 40%, rgba(139, 92, 246, 0.4) 0%, transparent 60%)
          `,
          opacity: 0.3,
          animation: "meshPulse 22s ease-in-out infinite alternate",
          pointerEvents: "none",
        },

        "@media (max-width: 768px)": {
          padding: "0 1rem",
          minHeight: "90vh",
        },
        "@media (max-width: 480px)": {
          padding: "0 0.75rem",
          minHeight: "85vh",
        },

        "@media (prefers-reduced-motion: reduce)": {
          "&::before": {
            animation: "none",
            opacity: 0.04,
          },
          "&::after": {
            animation: "none",
            opacity: 0.2,
          },
        },
      },
    },

    heroContent: {
      base: {
        position: "relative",
        zIndex: 10,
        maxWidth: "1280px",
        margin: "0 auto",
        width: "100%",

        "@media (max-width: 768px)": {
          padding: "2rem 0",
        },
      },
    },

    heroTitle: {
      base: {
        fontSize: "clamp(3.5rem, 10vw, 7rem)",
        fontWeight: 800,
        lineHeight: 1.05,
        letterSpacing: "-0.03em",
        marginBottom: "1.5rem",
        background: "linear-gradient(135deg, #60a5fa, #a78bfa, #ec4899)",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        animation: "titleFloat 7s ease-in-out infinite",
        willChange: "transform",

        "@media (max-width: 768px)": {
          lineHeight: 1.1,
          marginBottom: "1rem",
          fontSize: "clamp(2.5rem, 12vw, 4rem)",
        },
        "@media (max-width: 480px)": {
          fontSize: "clamp(2rem, 10vw, 3rem)",
          marginBottom: "0.75rem",
        },

        "@media (prefers-reduced-motion: reduce)": {
          animation: "none",
        },
      },
    },

    heroTitleLight: {
      base: {
        fontSize: "clamp(3.5rem, 10vw, 7rem)",
        fontWeight: 800,
        lineHeight: 1.05,
        letterSpacing: "-0.03em",
        marginBottom: "1.5rem",
        background: "linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        animation: "titleFloat 7s ease-in-out infinite",
        willChange: "transform",

        "@media (max-width: 768px)": {
          lineHeight: 1.1,
          marginBottom: "1rem",
          fontSize: "clamp(2.5rem, 12vw, 4rem)",
        },
        "@media (max-width: 480px)": {
          fontSize: "clamp(2rem, 10vw, 3rem)",
          marginBottom: "0.75rem",
        },

        "@media (prefers-reduced-motion: reduce)": {
          animation: "none",
        },
      },
    },

    heroSubtitle: {
      base: {
        fontSize: "clamp(1.125rem, 4vw, 1.75rem)",
        fontWeight: 500,
        opacity: 0.9,
        maxWidth: "48rem",
        margin: "0 auto 2.5rem",
        lineHeight: 1.6,
        color: "#e2e8f0",

        "@media (max-width: 768px)": {
          fontSize: "clamp(1rem, 4vw, 1.5rem)",
          margin: "0 auto 2rem",
          lineHeight: 1.5,
          padding: "0 1rem",
        },
        "@media (max-width: 480px)": {
          fontSize: "clamp(0.875rem, 4vw, 1.25rem)",
          margin: "0 auto 1.5rem",
          padding: "0 0.5rem",
        },
      },
    },

    heroSubtitleLight: {
      base: {
        fontSize: "clamp(1.125rem, 4vw, 1.75rem)",
        fontWeight: 500,
        opacity: 0.9,
        maxWidth: "48rem",
        margin: "0 auto 2.5rem",
        lineHeight: 1.6,
        color: "#475569",

        "@media (max-width: 768px)": {
          fontSize: "clamp(1rem, 4vw, 1.5rem)",
          margin: "0 auto 2rem",
          lineHeight: 1.5,
          padding: "0 1rem",
        },
        "@media (max-width: 480px)": {
          fontSize: "clamp(0.875rem, 4vw, 1.25rem)",
          margin: "0 auto 1.5rem",
          padding: "0 0.5rem",
        },
      },
    },

    heroCtaGroup: {
      base: {
        display: "flex",
        gap: "1.25rem",
        justifyContent: "center",
        flexWrap: "wrap",
        marginTop: "2rem",

        "@media (max-width: 768px)": {
          gap: "1rem",
          marginTop: "1.5rem",
          padding: "0 1rem",
        },
        "@media (max-width: 480px)": {
          flexDirection: "column",
          alignItems: "center",
          gap: "0.75rem",
          marginTop: "1rem",
        },
      },
    },

    heroCtaPrimary: {
      base: {
        padding: "1rem 2.5rem",
        fontSize: "1.125rem",
        fontWeight: 600,
        borderRadius: "9999px",
        background: "linear-gradient(135deg, #3b82f6, #60a5fa)",
        color: "white",
        border: "none",
        cursor: "pointer",
        boxShadow: "0 8px 32px rgba(59, 130, 246, 0.35)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        overflow: "hidden",

        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: "-100%",
          width: "100%",
          height: "100%",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
          transition: "left 0.5s ease",
        },

        "&:hover": {
          transform: "translateY(-4px) scale(1.02)",
          boxShadow: "0 20px 48px rgba(59, 130, 246, 0.45)",

          "&::before": {
            left: "100%",
          },
        },

        "&:active": {
          transform: "translateY(-2px) scale(1.01)",
        },

        "&:focus": {
          outline: "none",
          boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.3), 0 8px 32px rgba(59, 130, 246, 0.35)",
        },

        "@media (max-width: 768px)": {
          padding: "0.875rem 2rem",
          fontSize: "1rem",
        },
        "@media (max-width: 480px)": {
          padding: "0.75rem 1.5rem",
          fontSize: "0.875rem",
          width: "100%",
          maxWidth: "280px",
        },

        "@media (prefers-reduced-motion: reduce)": {
          transition: "none",

          "&:hover": {
            transform: "none",
          },
        },
      },
    },

    heroCtaSecondary: {
      base: {
        padding: "1rem 2.5rem",
        fontSize: "1.125rem",
        fontWeight: 600,
        borderRadius: "9999px",
        background: "rgba(255, 255, 255, 0.08)",
        color: "#e2e8f0",
        border: "2px solid rgba(255, 255, 255, 0.2)",
        backdropFilter: "blur(12px)",
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        overflow: "hidden",

        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(135deg, rgba(96, 165, 250, 0.1), rgba(236, 72, 153, 0.1))",
          opacity: 0,
          transition: "opacity 0.3s ease",
        },

        "&:hover": {
          background: "rgba(255, 255, 255, 0.15)",
          borderColor: "#60a5fa",
          color: "#60a5fa",
          transform: "translateY(-4px)",

          "&::before": {
            opacity: 1,
          },
        },

        "&:active": {
          transform: "translateY(-2px)",
        },

        "&:focus": {
          outline: "none",
          boxShadow: "0 0 0 3px rgba(96, 165, 250, 0.3)",
          borderColor: "#60a5fa",
        },

        "@media (max-width: 768px)": {
          padding: "0.875rem 2rem",
          fontSize: "1rem",
        },
        "@media (max-width: 480px)": {
          padding: "0.75rem 1.5rem",
          fontSize: "0.875rem",
          width: "100%",
          maxWidth: "280px",
        },

        "@media (prefers-reduced-motion: reduce)": {
          transition: "none",

          "&:hover": {
            transform: "none",
          },
        },
      },
    },

    heroCtaSecondaryLight: {
      base: {
        padding: "1rem 2.5rem",
        fontSize: "1.125rem",
        fontWeight: 600,
        borderRadius: "9999px",
        background: "rgba(255, 255, 255, 0.8)",
        color: "#475569",
        border: "2px solid rgba(59, 130, 246, 0.2)",
        backdropFilter: "blur(12px)",
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        overflow: "hidden",

        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))",
          opacity: 0,
          transition: "opacity 0.3s ease",
        },

        "&:hover": {
          background: "rgba(255, 255, 255, 0.9)",
          borderColor: "#3b82f6",
          color: "#3b82f6",
          transform: "translateY(-4px)",

          "&::before": {
            opacity: 1,
          },
        },

        "&:active": {
          transform: "translateY(-2px)",
        },

        "&:focus": {
          outline: "none",
          boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.3)",
          borderColor: "#3b82f6",
        },

        "@media (max-width: 768px)": {
          padding: "0.875rem 2rem",
          fontSize: "1rem",
        },
        "@media (max-width: 480px)": {
          padding: "0.75rem 1.5rem",
          fontSize: "0.875rem",
          width: "100%",
          maxWidth: "280px",
        },

        "@media (prefers-reduced-motion: reduce)": {
          transition: "none",

          "&:hover": {
            transform: "none",
          },
        },
      },
    },

    heroStats: {
      base: {
        display: "flex",
        justifyContent: "center",
        gap: "3rem",
        marginTop: "3rem",
        flexWrap: "wrap",

        "@media (max-width: 768px)": {
          gap: "2rem",
          marginTop: "2rem",
        },
        "@media (max-width: 480px)": {
          gap: "1.5rem",
          marginTop: "1.5rem",
        },
      },
    },

    heroStat: {
      base: {
        textAlign: "center",

        "&:hover .heroStatNumber": {
          transform: "scale(1.05)",
        },
      },
    },

    heroStatNumber: {
      base: {
        display: "block",
        fontSize: "2.5rem",
        fontWeight: 700,
        background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        marginBottom: "0.5rem",
        transition: "transform 0.3s ease",

        "@media (max-width: 768px)": {
          fontSize: "2rem",
        },
        "@media (max-width: 480px)": {
          fontSize: "1.75rem",
        },
      },
    },

    heroStatLabel: {
      base: {
        fontSize: "0.875rem",
        color: "#94a3b8",
        fontWeight: 500,
        textTransform: "uppercase",
        letterSpacing: "0.05em",

        "@media (max-width: 480px)": {
          fontSize: "0.75rem",
        },
      },
    },

    heroStatLabelLight: {
      base: {
        fontSize: "0.875rem",
        color: "#64748b",
        fontWeight: 500,
        textTransform: "uppercase",
        letterSpacing: "0.05em",

        "@media (max-width: 480px)": {
          fontSize: "0.75rem",
        },
      },
    },
};