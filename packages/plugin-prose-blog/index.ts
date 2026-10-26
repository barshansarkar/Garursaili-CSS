export default {
  name: "@garursaili/plugin-prose-blog",
  version: "2.0.0",
  setup(api) {
    api.addUtilities({
      "prose-blog": {
        maxWidth: "68ch",
        letterSpacing: "-0.011em",
        "& h1": { fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "-0.04em", lineHeight: "1.0", fontWeight: "800", marginTop: "0", marginBottom: "2rem" },
        "& h2": { fontSize: "clamp(1.75rem, 3vw, 2.25rem)", letterSpacing: "-0.025em", fontWeight: "700", marginTop: "2.5rem", marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: "1px solid var(--garur-border-subtle, #e5e7eb)" },
        "& h3": { fontSize: "1.3125rem", letterSpacing: "-0.02em", fontWeight: "600", marginTop: "2rem" },
        "& p":  { fontSize: "1.125rem", lineHeight: "1.75" },
        "& img": { borderRadius: "1rem", marginBlock: "2em", boxShadow: "0 4px 24px -4px rgba(0,0,0,0.08)" },
        "& figure": { marginBlock: "2em" },
        "& figcaption": { fontSize: "0.875rem", color: "var(--garur-muted, #6f7780)", textAlign: "center", marginTop: "0.75em", letterSpacing: "0.01em" },
      },
      "prose-footnotes": {
        "& [data-footnote]": { fontSize: "0.875rem", color: "var(--garur-muted)" },
        "& sup": { fontSize: "0.75em", verticalAlign: "super", lineHeight: "0" },
      },
      "prose-toc": {
        "& nav": { position: "sticky", top: "4rem", fontSize: "0.875rem" },
        "& nav a": { display: "block", padding: "0.375rem 0", color: "var(--garur-muted)", transition: "color 200ms ease", "&:hover": { color: "var(--garur-primary)" } },
      },
    });
  },
};
