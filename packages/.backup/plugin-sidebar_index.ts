export default {
  name: "@garursaili/plugin-sidebar",
  version: "1.0.0",
  setup(api) {
    api.addUtilities({
      "sidebar-layout": { display: "grid", gridTemplateColumns: "16rem 1fr", minHeight: "100vh" },
      "sidebar-layout-wide": { display: "grid", gridTemplateColumns: "20rem 1fr", minHeight: "100vh" },
      "sidebar-layout-narrow": { display: "grid", gridTemplateColumns: "12rem 1fr", minHeight: "100vh" },
      "sidebar-fixed": { position: "fixed", top: "0", left: "0", bottom: "0", width: "16rem", overflowY: "auto", background: "var(--garur-surface)" },
      "sidebar-fixed-right": { position: "fixed", top: "0", right: "0", bottom: "0", width: "16rem", overflowY: "auto", background: "var(--garur-surface)" },
      "sidebar-content": { marginLeft: "16rem" },
    });
  },
};
