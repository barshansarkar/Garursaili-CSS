export default {
  name: "@garursaili/plugin-command-palette",
  version: "1.0.0",
  setup(api) {
    api.addUtilities({
      "command-palette": { position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)", width: "90%", maxWidth: "40rem", background: "var(--garur-surface)", border: "1px solid var(--garur-border-subtle)", borderRadius: "1rem", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)", overflow: "hidden", zIndex: "100" },
      "command-input": { width: "100%", padding: "1rem 1.25rem", fontSize: "1rem", background: "transparent", border: "none", borderBottom: "1px solid var(--garur-border-subtle)", outline: "none", color: "var(--garur-fg)" },
      "command-list": { maxHeight: "24rem", overflowY: "auto", padding: "0.5rem" },
      "command-item": { display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", borderRadius: "0.5rem", cursor: "pointer", "&:hover": { background: "var(--garur-surface-muted)" } },
      "command-item-active": { background: "color-mix(in oklab, var(--garur-primary) 15%, transparent)", color: "var(--garur-primary)" },
      "command-empty": { padding: "2rem", textAlign: "center", color: "var(--garur-muted)" },
    });
  },
};
