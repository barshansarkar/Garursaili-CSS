export default {
  name: "@garursaili/plugin-spotlight",
  version: "1.0.0",
  setup(api) {
    const makeSpot = (size, color) => ({ position: "relative", overflow: "hidden", "&::before": { content: "''", position: "absolute", inset: "0", background: `radial-gradient(${size} circle at var(--mx, 50%) var(--my, 50%), ${color}, transparent 40%)`, opacity: "0", transition: "opacity 300ms", pointerEvents: "none", zIndex: "1" }, "&:hover::before": { opacity: "1" } });
    api.addUtilities({
      "spotlight": makeSpot("600px", "rgba(134,87,247,0.15)"),
      "spotlight-sm": makeSpot("300px", "rgba(255,255,255,0.08)"),
      "spotlight-lg": makeSpot("900px", "rgba(134,87,247,0.18)"),
      "spotlight-white": makeSpot("500px", "rgba(255,255,255,0.06)"),
      "spotlight-pink": makeSpot("600px", "rgba(229,76,181,0.15)"),
      "spotlight-cyan": makeSpot("600px", "rgba(26,138,222,0.15)"),
    });
  },
};
