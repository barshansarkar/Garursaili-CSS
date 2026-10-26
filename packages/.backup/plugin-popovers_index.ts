export default {
  name: "@garursaili/plugin-popovers",
  version: "1.0.0",
  setup(api) {
    api.addUtilities({
      "popover": { position: "absolute", background: "var(--garur-surface)", border: "1px solid var(--garur-border-subtle)", borderRadius: "0.5rem", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", padding: "1rem", zIndex: "50", minWidth: "12rem" },
      "popover-top": { positionAnchor: "--anchor", top: "anchor(bottom)", left: "anchor(center)", translate: "-50% 0.5rem" },
      "popover-bottom": { positionAnchor: "--anchor", bottom: "anchor(top)", left: "anchor(center)", translate: "-50% -0.5rem" },
      "popover-left": { positionAnchor: "--anchor", right: "anchor(left)", top: "anchor(center)", translate: "-0.5rem -50%" },
      "popover-right": { positionAnchor: "--anchor", left: "anchor(right)", top: "anchor(center)", translate: "0.5rem -50%" },
      "popover-anchor": { anchorName: "--anchor" },
    });
  },
};
