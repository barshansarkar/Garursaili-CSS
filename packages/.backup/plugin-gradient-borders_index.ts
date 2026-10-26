export default {
  name: "@garursaili/plugin-gradient-borders",
  version: "1.0.0",
  setup(api) {
    api.addUtilities({
      "border-gradient": { position: "relative", background: "linear-gradient(var(--garur-surface), var(--garur-surface)) padding-box, linear-gradient(135deg, rgba(134,87,247,0.5), rgba(229,76,181,0.5)) border-box", border: "2px solid transparent" },
      "border-gradient-animate": { position: "relative", background: "linear-gradient(var(--garur-surface), var(--garur-surface)) padding-box, conic-gradient(from var(--angle, 0deg), #8657f7, #e54cb5, #f59e00, #8657f7) border-box", border: "2px solid transparent", animation: "garur-border-spin 4s linear infinite" },
      "border-beam": { position: "relative", overflow: "hidden", "&::before": { content: "''", position: "absolute", inset: "0", padding: "2px", background: "linear-gradient(90deg, transparent, rgba(134,87,247,0.8), transparent)", borderRadius: "inherit", mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", maskComposite: "exclude", WebkitMaskComposite: "xor", pointerEvents: "none" } },
    });
    api.addKeyframes("garur-border-spin", "to { --angle: 360deg }");
  },
};
