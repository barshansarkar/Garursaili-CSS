export default {
  name: "@garursaili/plugin-tooltips",
  version: "2.0.0",
  setup(api) {
    const base = { position: "relative", cursor: "help" };
    const tip = {
      position: "absolute", padding: "0.4375rem 0.75rem",
      background: "rgba(20,20,25,0.92)",
      backdropFilter: "blur(20px) saturate(180%)",
      WebkitBackdropFilter: "blur(20px) saturate(180%)",
      color: "#fff", fontSize: "0.75rem", fontWeight: "500",
      letterSpacing: "-0.011em",
      borderRadius: "0.5rem",
      whiteSpace: "nowrap", pointerEvents: "none",
      opacity: "0", zIndex: "50",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10), 0 4px 16px -4px rgba(0,0,0,0.30), 0 12px 32px -8px rgba(0,0,0,0.20)",
      transition: "opacity 200ms ease, transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1)",
    };
    api.addUtilities({
      "tooltip-top":    { ...base, "&::after": { ...tip, content: "attr(data-tooltip)", bottom: "100%", left: "50%", transform: "translateX(-50%) translateY(-4px)", marginBottom: "0.375rem" }, "&:hover::after": { opacity: "1", transform: "translateX(-50%) translateY(-6px)" } },
      "tooltip-bottom": { ...base, "&::after": { ...tip, content: "attr(data-tooltip)", top: "100%", left: "50%", transform: "translateX(-50%) translateY(4px)", marginTop: "0.375rem" }, "&:hover::after": { opacity: "1", transform: "translateX(-50%) translateY(6px)" } },
      "tooltip-left":   { ...base, "&::after": { ...tip, content: "attr(data-tooltip)", right: "100%", top: "50%", transform: "translateY(-50%) translateX(-4px)", marginRight: "0.375rem" }, "&:hover::after": { opacity: "1", transform: "translateY(-50%) translateX(-6px)" } },
      "tooltip-right":  { ...base, "&::after": { ...tip, content: "attr(data-tooltip)", left: "100%", top: "50%", transform: "translateY(-50%) translateX(4px)", marginLeft: "0.375rem" }, "&:hover::after": { opacity: "1", transform: "translateY(-50%) translateX(6px)" } },
    });
  },
};
