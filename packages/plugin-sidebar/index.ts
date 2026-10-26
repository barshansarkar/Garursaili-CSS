export default {
  name: "@garursaili/plugin-sidebar",
  version: "2.0.0",
  setup(api) {
    api.addUtilities({
      "sidebar-layout":        { display: "grid", gridTemplateColumns: "16rem 1fr", minHeight: "100vh" },
      "sidebar-layout-wide":   { display: "grid", gridTemplateColumns: "20rem 1fr", minHeight: "100vh" },
      "sidebar-layout-narrow": { display: "grid", gridTemplateColumns: "12rem 1fr", minHeight: "100vh" },
      "sidebar-fixed":         { position: "fixed", top: "0", left: "0", bottom: "0", width: "16rem", overflowY: "auto", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(40px) saturate(180%)", WebkitBackdropFilter: "blur(40px) saturate(180%)", borderRight: "1px solid var(--garur-border-subtle)" },
      "sidebar-fixed-right":   { position: "fixed", top: "0", right: "0", bottom: "0", width: "16rem", overflowY: "auto", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(40px) saturate(180%)", WebkitBackdropFilter: "blur(40px) saturate(180%)", borderLeft: "1px solid var(--garur-border-subtle)" },
      "sidebar-content":       { marginLeft: "16rem" },
    });
  },
};
