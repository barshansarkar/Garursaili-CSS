export default {
  name: "@garursaili/plugin-sticky-headers",
  version: "2.0.0",
  setup(api) {
    api.addUtilities({
      "sticky-header":       { position: "sticky", top: "0", zIndex: "40", background: "var(--garur-surface)", borderBottom: "1px solid var(--garur-border-subtle)" },
      "sticky-header-blur":  { position: "sticky", top: "0", zIndex: "40", background: "rgba(255,255,255,0.72)", backdropFilter: "blur(40px) saturate(200%)", WebkitBackdropFilter: "blur(40px) saturate(200%)", borderBottom: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 1px 0 rgba(255,255,255,0.6)" },
      "sticky-header-shrink":{ position: "sticky", top: "0", zIndex: "40", padding: "1rem 1.5rem", transition: "padding 300ms cubic-bezier(0.16, 1, 0.3, 1)", "&:hover": { padding: "0.5rem 1.5rem" } },
      "sticky-footer":       { position: "sticky", bottom: "0", zIndex: "30", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(24px) saturate(180%)", WebkitBackdropFilter: "blur(24px) saturate(180%)", borderTop: "1px solid var(--garur-border-subtle)" },
    });
  },
};
