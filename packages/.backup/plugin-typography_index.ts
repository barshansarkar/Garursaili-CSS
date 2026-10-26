export default {
  name: "@garursaili/plugin-typography",
  version: "1.1.0",
  prefixes: ["prose"],
  setup(api) {
    const PROSE = {
      maxWidth: "68ch",
      color: "var(--garur-fg, #1a1a1a)",
      lineHeight: "1.7",
      "& h1": { fontSize: "2.5rem", fontWeight: "800", letterSpacing: "-0.03em", marginBlock: "1.5em 0.6em", lineHeight: "1.1" },
      "& h2": { fontSize: "1.875rem", fontWeight: "700", letterSpacing: "-0.02em", marginBlock: "1.5em 0.5em", lineHeight: "1.2" },
      "& h3": { fontSize: "1.375rem", fontWeight: "600", marginBlock: "1.25em 0.4em" },
      "& h4": { fontSize: "1.125rem", fontWeight: "600", marginBlock: "1.25em 0.4em" },
      "& p":  { marginBlock: "1.25em", fontSize: "1.0625rem" },
      "& a":  { 
        color: "var(--garur-primary, #8657f7)", 
        textDecoration: "underline", 
        textUnderlineOffset: "3px", 
        textDecorationThickness: "2px", 
        textDecorationColor: "color-mix(in oklab, var(--garur-primary) 30%, transparent)", 
        transition: "text-decoration-color 0.2s ease",
        "&:hover": { textDecorationColor: "var(--garur-primary)" }
      },
      "& strong": { fontWeight: "700", color: "var(--garur-fg)" },
      "& code": { 
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", 
        fontSize: "0.875em", 
        background: "color-mix(in oklab, var(--garur-primary) 10%, transparent)", 
        color: "var(--garur-primary)", 
        padding: "0.2em 0.4em", 
        borderRadius: "0.375rem",
        fontWeight: "600"
      },
      "& pre": { 
        background: "#0b0b0e", 
        color: "#e2e2e6",
        padding: "1.25rem", 
        borderRadius: "0.75rem", 
        overflowX: "auto", 
        marginBlock: "1.5em",
        border: "1px solid rgba(255,255,255,0.05)"
      },
      "& pre code": { background: "none", color: "inherit", padding: "0", fontWeight: "400" },
      "& ul, & ol": { marginBlock: "1.25em", paddingInlineStart: "1.5em" },
      "& li": { marginBlock: "0.5em" },
      "& blockquote": { 
        borderInlineStart: "3px solid var(--garur-primary)", 
        paddingInlineStart: "1.25rem", 
        fontStyle: "italic", 
        color: "var(--garur-muted)", 
        marginBlock: "1.5em",
        fontSize: "1.0625rem"
      },
      "& hr": { border: "none", borderTop: "1px solid var(--garur-border-subtle)", marginBlock: "2.5em" },
      "& img": { borderRadius: "0.75rem", marginBlock: "1.5em", maxWidth: "100%", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" },
    };
    api.addUtilities({ prose: PROSE, "prose-sm": { ...PROSE, fontSize: "0.875rem" }, "prose-lg": { ...PROSE, fontSize: "1.125rem", maxWidth: "75ch" } });
  },
};
