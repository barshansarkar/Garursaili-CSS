export default {
  name: "@garursaili/plugin-typography",
  version: "3.0.0",
  description: "Complete typography — display, heading, body, prose, callouts, quotes, dropcap",

  prefixes: [
    "display-", "heading-",
    "prose", "prose-",
    "lead", "body", "body-", "caption", "overline", "eyebrow",
    "small-caps", "all-small-caps", "petite-caps", "unicase",
    "mark", "abbr", "sup", "sub", "cite", "dfn", "var", "samp", "small",
    "callout-",
    "pull-quote", "blockquote", "cite-inline",
    "figure", "figcaption",
    "rhythm", "rhythm-", "measure", "measure-",
    "divider-ornament", "divider-dot",
    "dropcap", "dropcap-",
    "font-display",
  ],

  setup(api: any) {
    // ═══════════════════════════════════════════════════════════════
    // 1. TOKENS — themeable at :root. Prose reads these; modifiers
    //    override them. Cascade-order-independent by design.
    // ═══════════════════════════════════════════════════════════════
    api.defineToken("typography-fg", "var(--garur-fg, #1a1a1a)");
    api.defineToken("typography-muted", "var(--garur-muted, #6f7780)");
    api.defineToken("typography-subtle", "var(--garur-subtle, #94a3b8)");
    api.defineToken("typography-primary", "var(--garur-primary, #8657f7)");
    api.defineToken("typography-code-bg", "color-mix(in oklab, var(--typography-primary) 12%, transparent)");
    api.defineToken("typography-code-fg", "var(--typography-primary)");
    api.defineToken("typography-code-block-bg", "#0b0b0e");
    api.defineToken("typography-code-block-fg", "#e2e2e6");
    api.defineToken("typography-measure", "68ch");
    api.defineToken("typography-size", "1.0625rem");
    api.defineToken("typography-line-height", "1.7");
    api.defineToken("typography-spacing", "1.25em");

    // ═══════════════════════════════════════════════════════════════
    // 2. BASE RECIPES
    // ═══════════════════════════════════════════════════════════════
    const DISPLAY = {
      fontWeight: "800",
      lineHeight: "0.95",
      letterSpacing: "-0.04em",
      textWrap: "balance",
    } as const;

    const HEADING = {
      fontWeight: "700",
      lineHeight: "1.1",
      letterSpacing: "-0.025em",
      textWrap: "balance",
    } as const;

    const PROSE_HEADING_1 = { ...HEADING, fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "-0.045em", lineHeight: "0.95", marginBlock: "1.5em 0.6em" };
    const PROSE_HEADING_2 = { ...HEADING, fontSize: "clamp(1.875rem, 3vw, 2.5rem)", marginBlock: "1.5em 0.5em" };
    const PROSE_HEADING_3 = { ...HEADING, fontSize: "1.375rem", marginBlock: "1.25em 0.4em" };
    const PROSE_HEADING_4 = { ...HEADING, fontSize: "1.125rem", marginBlock: "1.25em 0.4em" };

    const CALLOUT_BASE = {
      display: "flex",
      gap: "0.75rem",
      padding: "1rem 1.25rem",
      borderRadius: "0.75rem",
      borderLeft: "3px solid var(--typography-primary)",
      background: "color-mix(in oklab, var(--typography-primary) 8%, transparent)",
      fontSize: "0.9375rem",
      lineHeight: "1.6",
      marginBlock: "1.5em",
    } as const;

    // ═══════════════════════════════════════════════════════════════
    // 3. UTILITIES
    // ═══════════════════════════════════════════════════════════════
    api.addUtilities({
      // ─────────────────────────────────────────────────────────────
      // DISPLAY SCALE — 6 sizes
      // ─────────────────────────────────────────────────────────────
      "display-hero": { ...DISPLAY, fontSize: "clamp(4rem, 14vw, 12rem)", letterSpacing: "-0.05em", lineHeight: "0.88" },
      "display-1":    { ...DISPLAY, fontSize: "clamp(3.5rem, 11vw, 9rem)",  letterSpacing: "-0.045em", lineHeight: "0.92" },
      "display-2":    { ...DISPLAY, fontSize: "clamp(2.75rem, 8vw, 7rem)",  letterSpacing: "-0.04em",  lineHeight: "0.95" },
      "display-3":    { ...DISPLAY, fontSize: "clamp(2.25rem, 6vw, 5rem)",  letterSpacing: "-0.035em", lineHeight: "1.0" },
      "display-4":    { ...DISPLAY, fontSize: "clamp(1.875rem, 5vw, 3.5rem)", letterSpacing: "-0.03em", lineHeight: "1.05" },
      "display-5":    { ...DISPLAY, fontSize: "clamp(1.5rem, 4vw, 2.5rem)", letterSpacing: "-0.025em", lineHeight: "1.1" },

      // ─────────────────────────────────────────────────────────────
      // HEADING SCALE — 6 sizes
      // ─────────────────────────────────────────────────────────────
      "heading-1": { ...HEADING, fontSize: "clamp(1.875rem, 4vw, 3rem)" },
      "heading-2": { ...HEADING, fontSize: "clamp(1.5rem, 3vw, 2.25rem)" },
      "heading-3": { ...HEADING, fontSize: "clamp(1.25rem, 2vw, 1.75rem)", letterSpacing: "-0.02em" },
      "heading-4": { ...HEADING, fontSize: "1.25rem", letterSpacing: "-0.015em" },
      "heading-5": { ...HEADING, fontSize: "1.125rem", letterSpacing: "-0.012em" },
      "heading-6": { ...HEADING, fontSize: "1rem",     letterSpacing: "-0.008em" },

      // ─────────────────────────────────────────────────────────────
      // BODY / TEXT SCALE — 8 sizes
      // ─────────────────────────────────────────────────────────────
      "lead": {
        fontSize: "clamp(1.125rem, 1.5vw, 1.375rem)",
        lineHeight: "1.6",
        letterSpacing: "-0.011em",
        color: "var(--typography-muted)",
      },
      "body-lg": {
        fontSize: "1.125rem",
        lineHeight: "1.7",
        letterSpacing: "-0.011em",
        color: "var(--typography-fg)",
      },
      "body": {
        fontSize: "1.0625rem",
        lineHeight: "1.7",
        letterSpacing: "-0.011em",
        color: "var(--typography-fg)",
      },
      "body-sm": {
        fontSize: "0.9375rem",
        lineHeight: "1.6",
        color: "var(--typography-fg)",
      },
      "body-xs": {
        fontSize: "0.875rem",
        lineHeight: "1.55",
        color: "var(--typography-fg)",
      },
      "caption": {
        fontSize: "0.8125rem",
        lineHeight: "1.4",
        letterSpacing: "0.01em",
        color: "var(--typography-muted)",
      },
      "overline": {
        fontSize: "0.75rem",
        lineHeight: "1.4",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        fontWeight: "600",
        color: "var(--typography-muted)",
      },
      "eyebrow": {
        display: "inline-block",
        fontSize: "0.75rem",
        lineHeight: "1.4",
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        fontWeight: "600",
        color: "var(--typography-primary)",
      },

      // ─────────────────────────────────────────────────────────────
      // SMALL CAPS — font-variant-caps variants (new)
      // ─────────────────────────────────────────────────────────────
      "small-caps":     { fontVariantCaps: "small-caps" },
      "all-small-caps": { fontVariantCaps: "all-small-caps" },
      "petite-caps":    { fontVariantCaps: "petite-caps" },
      "unicase":        { fontVariantCaps: "unicase" },

      // ─────────────────────────────────────────────────────────────
      // PROSE — rich base, cascade-order-independent via vars
      // ─────────────────────────────────────────────────────────────
      prose: {
        maxWidth: "var(--typography-measure)",
        color: "var(--typography-fg)",
        fontSize: "var(--typography-size)",
        lineHeight: "var(--typography-line-height)",
        letterSpacing: "-0.011em",
        textRendering: "optimizeLegibility",
        fontFeatureSettings: '"ss01", "cv11"',

        "& h1": PROSE_HEADING_1,
        "& h2": PROSE_HEADING_2,
        "& h3": PROSE_HEADING_3,
        "& h4": PROSE_HEADING_4,

        "& p": {
          marginBlock: "var(--typography-spacing)",
          fontSize: "var(--typography-size)",
          lineHeight: "var(--typography-line-height)",
        },
        "& p:first-child": { marginTop: "0" },
        "& p:last-child":  { marginBottom: "0" },

        "& a": {
          color: "var(--typography-primary)",
          textDecoration: "underline",
          textUnderlineOffset: "3px",
          textDecorationThickness: "2px",
          textDecorationColor: "color-mix(in oklab, var(--typography-primary) 30%, transparent)",
          transition: "text-decoration-color 0.2s ease",
          "&:hover": { textDecorationColor: "var(--typography-primary)" },
        },
        "& strong, & b": { fontWeight: "700", color: "var(--typography-fg)" },
        "& em, & i":     { fontStyle: "italic" },
        "& u":           { textUnderlineOffset: "3px" },
        "& s, & del":    { color: "var(--typography-muted)" },
        "& sup, & sub":  { fontSize: "0.75em", lineHeight: "0" },

        "& code": {
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: "0.875em",
          background: "var(--typography-code-bg)",
          color: "var(--typography-code-fg)",
          padding: "0.2em 0.4em",
          borderRadius: "0.375rem",
          fontWeight: "600",
        },
        "& pre": {
          background: "var(--typography-code-block-bg)",
          color: "var(--typography-code-block-fg)",
          padding: "1.25rem",
          borderRadius: "0.75rem",
          overflowX: "auto",
          marginBlock: "1.5em",
          border: "1px solid rgba(255,255,255,0.05)",
          fontSize: "0.875rem",
          lineHeight: "1.65",
        },
        "& pre code": {
          background: "none",
          color: "inherit",
          padding: "0",
          fontWeight: "400",
          fontSize: "inherit",
        },

        "& ul, & ol": {
          marginBlock: "1.25em",
          paddingInlineStart: "1.5em",
        },
        "& li": { marginBlock: "0.5em" },
        "& li::marker": { color: "var(--typography-muted)" },

        "& blockquote": {
          borderInlineStart: "3px solid var(--typography-primary)",
          paddingInlineStart: "1.25rem",
          fontStyle: "italic",
          color: "var(--typography-muted)",
          marginBlock: "1.5em",
          fontSize: "1.0625rem",
        },

        "& hr": {
          border: "none",
          borderTop: "1px solid rgba(128,128,128,0.20)",
          marginBlock: "2.5em",
        },

        "& img": {
          borderRadius: "0.75rem",
          marginBlock: "1.5em",
          maxWidth: "100%",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        },
        "& figure": { marginBlock: "1.5em" },
        "& figcaption": {
          fontSize: "0.875rem",
          color: "var(--typography-muted)",
          textAlign: "center",
          marginTop: "0.5rem",
        },

        "& table": {
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "0.9375rem",
          marginBlock: "1.5em",
        },
        "& th, & td": {
          padding: "0.5rem 0.75rem",
          textAlign: "left",
          borderBottom: "1px solid rgba(128,128,128,0.15)",
        },
        "& th": {
          fontWeight: "600",
          background: "color-mix(in oklab, var(--typography-fg) 4%, transparent)",
        },

        "& mark": {
          background: "color-mix(in oklab, var(--typography-primary) 20%, transparent)",
          color: "var(--typography-fg)",
          padding: "0.1em 0.25em",
          borderRadius: "0.25rem",
        },
        "& kbd": {
          fontFamily: "ui-monospace, monospace",
          fontSize: "0.875em",
          padding: "0.15em 0.4em",
          background: "color-mix(in oklab, var(--typography-fg) 8%, transparent)",
          borderRadius: "0.375rem",
          border: "1px solid rgba(128,128,128,0.20)",
        },
        "& abbr[title]": {
          textDecoration: "underline dotted",
          cursor: "help",
        },

        "& ::selection": {
          background: "color-mix(in oklab, var(--typography-primary) 30%, transparent)",
        },
      },

      // ── Prose size modifiers (override vars — cascade-safe) ──
      "prose-xs": {
        "--typography-size": "0.875rem",
        "--typography-measure": "55ch",
        "--typography-spacing": "1em",
        "--typography-line-height": "1.6",
      },
      "prose-sm": {
        "--typography-size": "0.9375rem",
        "--typography-measure": "60ch",
        "--typography-line-height": "1.65",
      },
      "prose-lg": {
        "--typography-size": "1.125rem",
        "--typography-measure": "75ch",
        "--typography-line-height": "1.75",
      },
      "prose-xl": {
        "--typography-size": "1.25rem",
        "--typography-measure": "80ch",
        "--typography-line-height": "1.8",
      },

      // ── Prose rhythm modifiers ──
      "prose-tight": { "--typography-spacing": "0.75em" },
      "prose-loose": { "--typography-spacing": "1.75em" },

      // ── Prose theme modifiers ──
      "prose-invert": {
        "--typography-fg": "#f5f5f7",
        "--typography-muted": "#a1a1aa",
        "--typography-subtle": "#71717a",
        "--typography-primary": "#a585fc",
        "--typography-code-bg": "rgba(165,133,252,0.14)",
        "--typography-code-fg": "#c5b5fe",
      },
      "prose-muted": {
        "--typography-fg": "var(--typography-muted)",
      },

      // ── Prose embellishments ──
      "prose-dropcap": {
        "& > p:first-of-type::first-letter": {
          fontSize: "4.5em",
          lineHeight: "0.9",
          fontWeight: "800",
          float: "left",
          marginRight: "0.1em",
          marginTop: "0.05em",
          color: "var(--typography-primary)",
          fontFamily: "Georgia, serif",
        },
      },
      "prose-no-indent": {
        "& p": { textIndent: "0" },
        "& > p:first-of-type": { textIndent: "0" },
      },

      // ═══════════════════════════════════════════════════════════════
      // CALLOUTS — 5 semantic variants (new)
      // ═══════════════════════════════════════════════════════════════
      "callout-note": {
        ...CALLOUT_BASE,
      },
      "callout-tip": {
        ...CALLOUT_BASE,
        borderLeftColor: "#34c759",
        background: "rgba(52,199,89,0.08)",
      },
      "callout-warning": {
        ...CALLOUT_BASE,
        borderLeftColor: "#ff9500",
        background: "rgba(255,149,0,0.08)",
      },
      "callout-caution": {
        ...CALLOUT_BASE,
        borderLeftColor: "#ff3b30",
        background: "rgba(255,59,48,0.08)",
      },
      "callout-important": {
        ...CALLOUT_BASE,
        borderLeftColor: "#ff2d55",
        background: "rgba(255,45,85,0.08)",
        fontWeight: "500",
      },

      // ═══════════════════════════════════════════════════════════════
      // INLINE ELEMENTS — 9 new
      // ═══════════════════════════════════════════════════════════════
      "mark": {
        background: "color-mix(in oklab, var(--typography-primary) 22%, transparent)",
        color: "var(--typography-fg)",
        padding: "0.1em 0.3em",
        borderRadius: "0.25rem",
      },
      "abbr": {
        textDecoration: "underline dotted",
        cursor: "help",
        textUnderlineOffset: "2px",
      },
      "sup": {
        fontSize: "0.75em",
        lineHeight: "0",
        verticalAlign: "super",
      },
      "sub": {
        fontSize: "0.75em",
        lineHeight: "0",
        verticalAlign: "sub",
      },
      "cite": { fontStyle: "italic" },
      "dfn": { fontStyle: "italic", fontWeight: "600" },
      "var": {
        fontFamily: "ui-monospace, monospace",
        fontStyle: "italic",
        fontWeight: "500",
      },
      "samp": {
        fontFamily: "ui-monospace, monospace",
        fontSize: "0.875em",
      },
      "small": { fontSize: "0.875em" },

      // ═══════════════════════════════════════════════════════════════
      // QUOTES & FIGURES
      // ═══════════════════════════════════════════════════════════════
      "pull-quote": {
        borderTop: "2px solid var(--typography-primary)",
        borderBottom: "2px solid var(--typography-primary)",
        padding: "1.5rem 0",
        fontSize: "1.5rem",
        lineHeight: "1.35",
        fontWeight: "500",
        fontStyle: "italic",
        letterSpacing: "-0.015em",
        color: "var(--typography-fg)",
        marginBlock: "2em",
        textAlign: "center",
      },
      "blockquote": {
        borderInlineStart: "3px solid var(--typography-primary)",
        paddingInlineStart: "1.25rem",
        marginBlock: "1.5em",
        fontStyle: "italic",
        color: "var(--typography-muted)",
        fontSize: "1.0625rem",
        lineHeight: "1.65",
      },
      "figure": { marginBlock: "1.5em", margin: "0" },
      "figcaption": {
        fontSize: "0.875rem",
        color: "var(--typography-muted)",
        textAlign: "center",
        marginTop: "0.5rem",
        lineHeight: "1.5",
      },

      // ═══════════════════════════════════════════════════════════════
      // RHYTHM & MEASURE
      // ═══════════════════════════════════════════════════════════════
      "rhythm": {
        "& > * + *": { marginTop: "1.5em" },
      },
      "rhythm-sm": {
        "& > * + *": { marginTop: "1em" },
      },
      "rhythm-lg": {
        "& > * + *": { marginTop: "2.5em" },
      },
      "measure-narrow": { maxWidth: "45ch" },
      "measure":        { maxWidth: "68ch" },
      "measure-wide":   { maxWidth: "75ch" },
      "measure-full":   { maxWidth: "100%" },

      // ═══════════════════════════════════════════════════════════════
      // DIVIDERS (enhanced)
      // ═══════════════════════════════════════════════════════════════
      "divider-ornament": {
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        color: "var(--typography-muted)",
        fontSize: "0.75rem",
        textTransform: "uppercase",
        letterSpacing: "0.15em",
        marginBlock: "2em",
        "&::before, &::after": {
          content: "''",
          flex: "1",
          height: "1px",
          background: "linear-gradient(90deg, transparent, currentColor, transparent)",
          opacity: "0.3",
        },
      },
      "divider-dot": {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        marginBlock: "2em",
        color: "var(--typography-muted)",
        "&::before, &::after": {
          content: "''",
          width: "4px",
          height: "4px",
          borderRadius: "9999px",
          background: "currentColor",
          opacity: "0.4",
        },
      },

      // ═══════════════════════════════════════════════════════════════
      // DROP CAP
      // ═══════════════════════════════════════════════════════════════
      "dropcap": {
        "&::first-letter": {
          fontSize: "4em",
          lineHeight: "0.85",
          fontWeight: "800",
          float: "left",
          marginRight: "0.08em",
          marginTop: "0.05em",
          color: "var(--typography-primary)",
          fontFamily: "Georgia, serif",
        },
      },
      "dropcap-lg": {
        "&::first-letter": {
          fontSize: "6em",
          lineHeight: "0.8",
          fontWeight: "800",
          float: "left",
          marginRight: "0.05em",
          marginTop: "0.02em",
          color: "var(--typography-primary)",
          fontFamily: "Georgia, serif",
        },
      },

      // ═══════════════════════════════════════════════════════════════
      // FONT FAMILY
      // ═══════════════════════════════════════════════════════════════
      "font-display": {
        fontFamily:
          '"Instrument Serif", "Playfair Display", Georgia, "Times New Roman", serif',
        fontOpticalSizing: "auto",
      },
    });
  },
};

// ═══════════════════════════════════════════════════════════════════
// GLOBAL_CSS — emit once via your build tool's raw-CSS hook.
// These need top-level @media wrappers, which the plugin SDK
// can't nest inside a single utility.
// ═══════════════════════════════════════════════════════════════════
export const GLOBAL_CSS = `
/* ── Accessibility — forced colors (Windows High Contrast) ── */
@media (forced-colors: active) {
  .prose a,
  .prose strong,
  .prose em { color: LinkText; }
  .prose code,
  .prose kbd {
    background: ButtonFace;
    color: ButtonText;
    border: 1px solid CanvasText;
  }
  .prose pre {
    background: Canvas;
    color: CanvasText;
    border: 1px solid CanvasText;
  }
  .callout-note, .callout-tip, .callout-warning,
  .callout-caution, .callout-important {
    border: 1px solid CanvasText;
    background: Canvas;
    color: CanvasText;
  }
  .mark, .prose mark {
    background: Highlight;
    color: HighlightText;
  }
  .pull-quote {
    border-color: CanvasText;
    color: CanvasText;
  }
}

/* ── Accessibility — higher contrast ── */
@media (prefers-contrast: more) {
  .prose {
    --typography-fg: #000;
    --typography-muted: #333;
    --typography-primary: #5a2fc4;
  }
  .prose-invert {
    --typography-fg: #fff;
    --typography-muted: #ddd;
    --typography-primary: #c0a0ff;
  }
  .prose a {
    text-decoration-thickness: 2px;
    text-decoration-color: currentColor;
  }
}

/* ── Accessibility — reduced motion ── */
@media (prefers-reduced-motion: reduce) {
  .prose a {
    transition: none;
  }
}

/* ── Print — bibliography-friendly ── */
@media print {
  .prose {
    max-width: 100%;
    color: #000;
  }
  .prose a {
    color: #000;
    text-decoration: none;
    border-bottom: 1px dotted;
  }
  .prose a[href]::after {
    content: " (" attr(href) ")";
    font-size: 0.85em;
    color: #555;
  }
  .prose pre {
    background: #f5f5f7;
    color: #000;
    border: 1px solid #ccc;
    page-break-inside: avoid;
  }
  .prose h1, .prose h2, .prose h3 { page-break-after: avoid; }
}
`;