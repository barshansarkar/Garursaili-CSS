export default {
  name: "@garursaili/plugin-sticky-headers",
  version: "1.0.0",
  setup(api) {
    api.addUtilities({
      "sticky-header": { position: "sticky", top: "0", zIndex: "40", background: "var(--garur-surface)", borderBottom: "1px solid var(--garur-border-subtle)" },
      "sticky-header-blur": { position: "sticky", top: "0", zIndex: "40", background: "color-mix(in oklab, var(--garur-surface) 80%, transparent)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderBottom: "1px solid var(--garur-border-subtle)" },
      "sticky-header-shrink": { position: "sticky", top: "0", zIndex: "40", padding: "1rem 1.5rem", transition: "padding 200ms", "&:hover": { padding: "0.5rem 1.5rem" } },
      "sticky-footer": { position: "sticky", bottom: "0", zIndex: "30", background: "var(--garur-surface)", borderTop: "1px solid var(--garur-border-subtle)" },
    });
  },
};
