export default {
  name: "@garursaili/plugin-text-effects",
  version: "1.0.0",
  setup(api) {
    api.addUtilities({
      "text-outline": { WebkitTextStroke: "1px currentColor", color: "transparent" },
      "text-outline-2": { WebkitTextStroke: "2px currentColor", color: "transparent" },
      "text-outline-thin": { WebkitTextStroke: "0.5px currentColor", color: "transparent" },
      "text-3d": { textShadow: "1px 1px 0 #ccc, 2px 2px 0 #bbb, 3px 3px 0 #aaa, 4px 4px 0 #999" },
      "text-3d-deep": { textShadow: "2px 2px 0 #bbb, 4px 4px 0 #999, 6px 6px 0 #777, 8px 8px 0 #555" },
      "text-embossed": { textShadow: "1px 1px 1px rgba(255,255,255,0.5), -1px -1px 1px rgba(0,0,0,0.3)" },
      "text-engraved": { textShadow: "-1px -1px 1px rgba(255,255,255,0.5), 1px 1px 1px rgba(0,0,0,0.3)" },
      "text-stroke": { WebkitTextStroke: "1px currentColor" },
      "text-shadow-glow": { textShadow: "0 0 10px currentColor, 0 0 20px currentColor" },
    });
  },
};
