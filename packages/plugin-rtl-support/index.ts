export default {
  name: "@garursaili/plugin-rtl-support",
  version: "1.0.0",
  setup(api) {
    api.addUtilities({
      "rtl": { direction: "rtl" },
      "ltr": { direction: "ltr" },
      "rtl-flip": { "[dir='rtl'] &": { transform: "scaleX(-1)" } },
      "rtl-text-right": { "[dir='rtl'] &": { textAlign: "right" } },
      "rtl-icon": { transform: "scaleX(1)", "[dir='rtl'] &": { transform: "scaleX(-1)" } },
      "start-0": { insetInlineStart: "0" },
      "end-0": { insetInlineEnd: "0" },
      "text-start": { textAlign: "start" },
      "text-end": { textAlign: "end" },
    });
  },
};
