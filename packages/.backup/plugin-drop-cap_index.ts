export default {
  name: "@garursaili/plugin-drop-cap",
  version: "1.0.0",
  setup(api) {
    api.addUtilities({
      "drop-cap": { "&::first-letter": { fontSize: "4em", lineHeight: "0.85", float: "left", paddingRight: "0.1em", paddingTop: "0.05em", fontWeight: "700", color: "var(--garur-primary)" } },
      "drop-cap-lg": { "&::first-letter": { fontSize: "5.5em", lineHeight: "0.85", float: "left", paddingRight: "0.1em", fontWeight: "800" } },
      "drop-cap-sm": { "&::first-letter": { fontSize: "2.5em", lineHeight: "0.85", float: "left", paddingRight: "0.1em", fontWeight: "600" } },
      "initial-letter": { "&::first-letter": { initialLetter: "3 2", WebkitInitialLetter: "3 2" } },
      "first-letter-color": { "&::first-letter": { color: "var(--garur-primary)" } },
      "first-letter-bg": { "&::first-letter": { background: "var(--garur-primary)", color: "white", padding: "0.25em 0.5em", borderRadius: "0.25rem" } },
    });
  },
};
