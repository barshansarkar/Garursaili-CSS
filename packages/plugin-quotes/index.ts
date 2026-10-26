export default {
  name: "@garursaili/plugin-quotes",
  version: "2.0.0",
  setup(api) {
    api.addUtilities({
      "quote-block": { borderInlineStart: "4px solid var(--garur-primary)", paddingInlineStart: "1.5rem", fontStyle: "italic", fontSize: "1.375rem", letterSpacing: "-0.015em", lineHeight: "1.55", color: "var(--garur-muted)" },
      "quote-pull": {
        position: "relative", padding: "2.5rem 2rem",
        fontSize: "clamp(1.5rem, 2.5vw, 2rem)", fontWeight: "500",
        letterSpacing: "-0.025em", lineHeight: "1.35",
        textAlign: "center",
        "&::before": {
          content: "\"\\201C\"", position: "absolute", top: "-1.5rem", left: "1.5rem",
          fontSize: "8rem", color: "var(--garur-primary)", opacity: "0.12",
          fontFamily: "Georgia, serif", lineHeight: "1", fontWeight: "900",
        },
      },
      "quote-highlight": {
        background: "linear-gradient(135deg, rgba(134,87,247,0.10), rgba(229,76,181,0.10))",
        border: "1px solid rgba(134,87,247,0.15)",
        padding: "1.75rem 2rem", borderRadius: "1.25rem",
        fontSize: "1.125rem", letterSpacing: "-0.011em", lineHeight: "1.7",
        position: "relative",
      },
      "quote-cite": { display: "block", marginTop: "0.875rem", fontSize: "0.875rem", fontStyle: "normal", color: "var(--garur-muted)" },
      "quote-cite::before": { content: "'— '" },
    });
  },
};
