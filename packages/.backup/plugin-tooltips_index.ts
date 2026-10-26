export default {
  name: "@garursaili/plugin-tooltips",
  version: "1.0.0",
  setup(api) {
    const base = { position: "relative", cursor: "help" };
    const tip = { position: "absolute", padding: "0.375rem 0.625rem", background: "#1a1a1a", color: "#fff", fontSize: "0.75rem", borderRadius: "0.375rem", whiteSpace: "nowrap", pointerEvents: "none", opacity: "0", transition: "opacity 150ms", zIndex: "50" };
    api.addUtilities({
      "tooltip-top": { ...base, "&::after": { ...tip, content: "attr(data-tooltip)", bottom: "100%", left: "50%", transform: "translateX(-50%) translateY(-4px)", marginBottom: "0.25rem" }, "&:hover::after": { opacity: "1" } },
      "tooltip-bottom": { ...base, "&::after": { ...tip, content: "attr(data-tooltip)", top: "100%", left: "50%", transform: "translateX(-50%) translateY(4px)", marginTop: "0.25rem" }, "&:hover::after": { opacity: "1" } },
      "tooltip-left": { ...base, "&::after": { ...tip, content: "attr(data-tooltip)", right: "100%", top: "50%", transform: "translateY(-50%) translateX(-4px)", marginRight: "0.25rem" }, "&:hover::after": { opacity: "1" } },
      "tooltip-right": { ...base, "&::after": { ...tip, content: "attr(data-tooltip)", left: "100%", top: "50%", transform: "translateY(-50%) translateX(4px)", marginLeft: "0.25rem" }, "&:hover::after": { opacity: "1" } },
    });
  },
};
