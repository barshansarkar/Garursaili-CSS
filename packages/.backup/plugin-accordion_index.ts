export default {
  name: "@garursaili/plugin-accordion",
  version: "1.0.0",
  setup(api) {
    api.addUtilities({
      "accordion": { width: "100%", border: "1px solid var(--garur-border-subtle)", borderRadius: "0.75rem", overflow: "hidden", "& > details": { borderBottom: "1px solid var(--garur-border-subtle)" }, "& > details:last-child": { borderBottom: "none" } },
      "accordion-summary": { padding: "1rem 1.25rem", fontWeight: "500", cursor: "pointer", listStyle: "none", display: "flex", alignItems: "center", justifyContent: "space-between", "&::-webkit-details-marker": { display: "none" }, "&::after": { content: "'+'", fontSize: "1.25rem", color: "var(--garur-muted)", transition: "transform 200ms" } },
      "accordion-body": { padding: "0 1.25rem 1.25rem", fontSize: "0.9375rem", lineHeight: "1.7", color: "var(--garur-muted)" },
      "details-open-after": { "&[open] summary::after": { content: "'−'" } },
    });
  },
};
