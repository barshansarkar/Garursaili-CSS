export default {
  name: "@garursaili/plugin-drop-cap",
  version: "2.0.0",
  setup(api) {
    api.addUtilities({
      "drop-cap":    { "&::first-letter": { fontSize: "4.5em", lineHeight: "0.82", float: "left", paddingRight: "0.12em", paddingTop: "0.04em", fontWeight: "800", letterSpacing: "-0.04em", color: "var(--garur-primary)" } },
      "drop-cap-lg": { "&::first-letter": { fontSize: "6em",   lineHeight: "0.82", float: "left", paddingRight: "0.12em", fontWeight: "800", letterSpacing: "-0.04em" } },
      "drop-cap-sm": { "&::first-letter": { fontSize: "2.75em", lineHeight: "0.85", float: "left", paddingRight: "0.12em", fontWeight: "700" } },
      "initial-letter": { "&::first-letter": { initialLetter: "3 2", WebkitInitialLetter: "3 2" } },
      "first-letter-color": { "&::first-letter": { color: "var(--garur-primary)" } },
      "first-letter-bg":    { "&::first-letter": { background: "var(--garur-primary)", color: "white", padding: "0.25em 0.5em", borderRadius: "0.375rem" } },
    });
  },
};
