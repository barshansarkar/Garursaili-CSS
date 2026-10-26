export default {
  name: "@garursaili/plugin-splitscreen",
  version: "1.0.0",
  setup(api) {
    api.addUtilities({
      "split-screen": { display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "100vh" },
      "split-screen-wide": { display: "grid", gridTemplateColumns: "2fr 1fr", minHeight: "100vh" },
      "split-screen-narrow": { display: "grid", gridTemplateColumns: "1fr 2fr", minHeight: "100vh" },
      "split-screen-thirds": { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", minHeight: "100vh" },
      "split-screen-stack": { display: "grid", gridTemplateColumns: "1fr", minHeight: "100vh", "@media (min-width: 768px)": { gridTemplateColumns: "1fr 1fr" } },
    });
  },
};
