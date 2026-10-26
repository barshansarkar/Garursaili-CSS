export default {
  name: "@garursaili/plugin-tabs",
  version: "1.0.0",
  setup(api) {
    api.addUtilities({
      "tabs": { display: "flex", gap: "0.25rem", borderBottom: "1px solid var(--garur-border-subtle)" },
      "tabs-pill": { display: "flex", gap: "0.25rem", padding: "0.25rem", background: "var(--garur-surface-muted)", borderRadius: "0.75rem" },
      "tab": { padding: "0.625rem 1rem", fontSize: "0.875rem", fontWeight: "500", color: "var(--garur-muted)", cursor: "pointer", border: "none", background: "transparent", borderBottom: "2px solid transparent", marginBottom: "-1px", transition: "color 150ms, border-color 150ms", "&:hover": { color: "var(--garur-fg)" } },
      "tab-active": { color: "var(--garur-primary)", borderBottomColor: "var(--garur-primary)" },
      "tab-pill": { padding: "0.5rem 1rem", borderRadius: "0.5rem", "&.active": { background: "var(--garur-surface)", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" } },
    });
  },
};
