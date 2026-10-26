export default {
  name: "@garursaili/plugin-reduced-motion",
  version: "1.0.0",
  setup(api) {
    api.addUtilities({
      "motion-safe": { "@media (prefers-reduced-motion: no-preference)": { animation: "var(--garur-animation, none)" } },
      "motion-reduce": { "@media (prefers-reduced-motion: reduce)": { animation: "none !important", transition: "none !important" } },
      "motion-safe-transition": { "@media (prefers-reduced-motion: no-preference)": { transition: "all 200ms ease" } },
      "reduced-motion-scroll": { "@media (prefers-reduced-motion: reduce)": { scrollBehavior: "auto !important" } },
    });
  },
};
