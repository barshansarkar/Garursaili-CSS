export default {
  name: "@garursaili/plugin-quotes",
  version: "1.0.0",
  setup(api) {
    api.addUtilities({
      "quote-block": { borderInlineStart: "4px solid var(--garur-primary)", paddingInlineStart: "1.5rem", fontStyle: "italic", fontSize: "1.25rem", lineHeight: "1.6", color: "var(--garur-muted)" },
      "quote-pull": { position: "relative", padding: "2rem", fontSize: "1.5rem", fontWeight: "500", lineHeight: "1.4", textAlign: "center", "&::before": { content: "\"\\201C\"", position: "absolute", top: "-1rem", left: "1rem", fontSize: "6rem", color: "var(--garur-primary)", opacity: "0.15", fontFamily: "Georgia, serif", lineHeight: "1" } },
      "quote-highlight": { background: "linear-gradient(120deg, rgba(134,87,247,0.15), rgba(229,76,181,0.15))", padding: "1.5rem 2rem", borderRadius: "1rem", fontSize: "1.125rem", lineHeight: "1.7", position: "relative" },
      "quote-cite": { display: "block", marginTop: "0.75rem", fontSize: "0.875rem", fontStyle: "normal", color: "var(--garur-muted)" },
      "quote-cite::before": { content: "'— '" },
    });
  },
};
