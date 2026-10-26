export default {
  name: "@garursaili/plugin-focus-visible",
  version: "1.0.0",
  setup(api) {
    api.addUtilities({
      "focus-ring": { "&:focus-visible": { outline: "2px solid var(--garur-primary)", outlineOffset: "2px" } },
      "focus-ring-primary": { "&:focus-visible": { outline: "2px solid var(--garur-primary)", outlineOffset: "2px", borderRadius: "inherit" } },
      "focus-ring-danger": { "&:focus-visible": { outline: "2px solid var(--garur-danger)", outlineOffset: "2px" } },
      "focus-ring-success": { "&:focus-visible": { outline: "2px solid var(--garur-success)", outlineOffset: "2px" } },
      "focus-ring-inset": { "&:focus-visible": { outline: "2px solid var(--garur-primary)", outlineOffset: "-2px" } },
      "focus-none": { "&:focus-visible": { outline: "none" } },
      "focus-glow": { "&:focus-visible": { outline: "none", boxShadow: "0 0 0 4px color-mix(in oklab, var(--garur-primary) 30%, transparent)" } },
    });
  },
};
