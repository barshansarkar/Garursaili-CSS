export default {
  name: "@garursaili/plugin-code-syntax",
  version: "1.0.0",
  setup(api) {
    api.addUtilities({
      "code-block": { display: "block", fontFamily: "ui-monospace, monospace", fontSize: "0.875rem", lineHeight: "1.65", background: "#0b0b0e", color: "#e2e2e6", padding: "1rem", borderRadius: "0.5rem", overflowX: "auto" },
      "code-inline": { fontFamily: "ui-monospace, monospace", fontSize: "0.875em", background: "rgba(134,87,247,0.15)", color: "#c5b5fe", padding: "0.125rem 0.375rem", borderRadius: "0.25rem" },
      "token-keyword": { color: "#f471b5" },
      "token-string": { color: "#86efac" },
      "token-comment": { color: "#71717a", fontStyle: "italic" },
      "token-number": { color: "#fbbf24" },
      "token-function": { color: "#93c5fd" },
      "token-class": { color: "#fcd34d" },
      "token-operator": { color: "#a1a1aa" },
    });
  },
};
