export default {
  name: "@garursaili/plugin-drawers",
  version: "1.0.0",
  setup(api) {
    api.addUtilities({
      "drawer-left": { position: "fixed", top: "0", bottom: "0", left: "0", width: "20rem", maxWidth: "90vw", background: "var(--garur-surface)", borderRight: "1px solid var(--garur-border-subtle)", zIndex: "60", transform: "translateX(-100%)", transition: "transform 300ms", "&.open": { transform: "translateX(0)" } },
      "drawer-right": { position: "fixed", top: "0", bottom: "0", right: "0", width: "20rem", maxWidth: "90vw", background: "var(--garur-surface)", borderLeft: "1px solid var(--garur-border-subtle)", zIndex: "60", transform: "translateX(100%)", transition: "transform 300ms", "&.open": { transform: "translateX(0)" } },
      "drawer-top": { position: "fixed", top: "0", left: "0", right: "0", height: "auto", maxHeight: "80vh", background: "var(--garur-surface)", borderBottom: "1px solid var(--garur-border-subtle)", zIndex: "60", transform: "translateY(-100%)", transition: "transform 300ms", "&.open": { transform: "translateY(0)" } },
      "drawer-bottom": { position: "fixed", bottom: "0", left: "0", right: "0", height: "auto", maxHeight: "80vh", background: "var(--garur-surface)", borderTop: "1px solid var(--garur-border-subtle)", zIndex: "60", transform: "translateY(100%)", transition: "transform 300ms", "&.open": { transform: "translateY(0)" } },
    });
  },
};
