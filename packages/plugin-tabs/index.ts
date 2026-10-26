export default {
  name: "@garursaili/plugin-tabs",
  version: "2.0.0",
  setup(api) {
    api.addUtilities({
      tabs:      { display: "flex", gap: "0.25rem", borderBottom: "1px solid var(--garur-border-subtle)" },
      "tabs-pill": { display: "flex", gap: "0.25rem", padding: "0.25rem", background: "var(--garur-surface-muted)", borderRadius: "1rem" },
      tab: {
        padding: "0.625rem 1rem", fontSize: "0.875rem", fontWeight: "500",
        letterSpacing: "-0.011em", color: "var(--garur-muted)",
        cursor: "pointer", border: "none", background: "transparent",
        borderBottom: "2px solid transparent", marginBottom: "-1px",
        transition: "color 200ms ease, border-color 200ms ease",
        "&:hover": { color: "var(--garur-fg)" },
      },
      "tab-active": { color: "var(--garur-primary)", borderBottomColor: "var(--garur-primary)" },
      "tab-pill":   { padding: "0.5rem 1rem", borderRadius: "0.75rem", transition: "all 200ms cubic-bezier(0.16, 1, 0.3, 1)", "&.active": { background: "var(--garur-surface)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6), 0 1px 2px rgba(0,0,0,0.06), 0 4px 12px -2px rgba(0,0,0,0.06)" } },
    });
  },
};
