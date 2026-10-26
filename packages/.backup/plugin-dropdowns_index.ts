export default {
  name: "@garursaili/plugin-dropdowns",
  version: "1.0.0",
  setup(api) {
    api.addUtilities({
      "dropdown": { position: "relative", display: "inline-block" },
      "dropdown-menu": { position: "absolute", top: "100%", right: "0", minWidth: "12rem", marginTop: "0.5rem", padding: "0.25rem", background: "var(--garur-surface)", border: "1px solid var(--garur-border-subtle)", borderRadius: "0.5rem", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", zIndex: "50", opacity: "0", visibility: "hidden", transition: "opacity 150ms, visibility 150ms" },
      "dropdown-hover": { "&:hover .dropdown-menu": { opacity: "1", visibility: "visible" } },
      "dropdown-open": { opacity: "1", visibility: "visible" },
      "dropdown-item": { display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.75rem", fontSize: "0.875rem", color: "var(--garur-fg)", borderRadius: "0.375rem", cursor: "pointer", textDecoration: "none", "&:hover": { background: "var(--garur-surface-muted)" } },
    });
  },
};
