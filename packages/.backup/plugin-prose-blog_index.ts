export default {
  name: "@garursaili/plugin-prose-blog",
  version: "1.0.0",
  setup(api) {
    api.addUtilities({
      "prose-blog": {
        maxWidth: "70ch",
        "& h1": { fontSize: "2.5rem", letterSpacing: "-0.03em", marginTop: "0", marginBottom: "2rem" },
        "& h2": { fontSize: "1.75rem", marginTop: "2.5rem", marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: "1px solid var(--garur-border-subtle, #e5e7eb)" },
        "& h3": { fontSize: "1.25rem", marginTop: "2rem" },
        "& p": { fontSize: "1.125rem", lineHeight: "1.8" },
        "& img": { borderRadius: "0.75rem", marginBlock: "2em" },
        "& figure": { marginBlock: "2em" },
        "& figcaption": { fontSize: "0.875rem", color: "var(--garur-muted, #6f7780)", textAlign: "center", marginTop: "0.75em" },
      },
      "prose-footnotes": {
        "& [data-footnote]": { fontSize: "0.875rem", color: "var(--garur-muted)" },
        "& sup": { fontSize: "0.75em", verticalAlign: "super", lineHeight: "0" },
      },
      "prose-toc": {
        "& nav": { position: "sticky", top: "4rem", fontSize: "0.875rem" },
        "& nav a": { display: "block", padding: "0.25rem 0", color: "var(--garur-muted)" },
        "& nav a:hover": { color: "var(--garur-primary)" },
      },
    });
  },
};
