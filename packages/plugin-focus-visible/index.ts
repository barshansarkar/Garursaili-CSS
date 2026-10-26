export default {
  name: "@garursaili/plugin-focus-visible",
  version: "2.0.0",
  setup(api) {
    api.addUtilities({
      "focus-ring":         { "&:focus-visible": { outline: "2px solid var(--garur-primary)", outlineOffset: "2px", boxShadow: "0 0 0 4px color-mix(in oklab, var(--garur-primary) 20%, transparent)" } },
      "focus-ring-primary": { "&:focus-visible": { outline: "2px solid var(--garur-primary)", outlineOffset: "2px", borderRadius: "inherit", boxShadow: "0 0 0 4px color-mix(in oklab, var(--garur-primary) 20%, transparent)" } },
      "focus-ring-danger":  { "&:focus-visible": { outline: "2px solid var(--garur-danger)", outlineOffset: "2px", boxShadow: "0 0 0 4px color-mix(in oklab, var(--garur-danger) 20%, transparent)" } },
      "focus-ring-success": { "&:focus-visible": { outline: "2px solid var(--garur-success)", outlineOffset: "2px", boxShadow: "0 0 0 4px color-mix(in oklab, var(--garur-success) 20%, transparent)" } },
      "focus-ring-inset":   { "&:focus-visible": { outline: "2px solid var(--garur-primary)", outlineOffset: "-2px" } },
      "focus-none":         { "&:focus-visible": { outline: "none" } },
      "focus-glow":         { "&:focus-visible": { outline: "none", boxShadow: "0 0 0 4px color-mix(in oklab, var(--garur-primary) 30%, transparent), 0 0 20px -4px var(--garur-primary)" } },
    });
  },
};
