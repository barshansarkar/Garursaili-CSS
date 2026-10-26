export default {
  name: "@garursaili/plugin-code-syntax",
  version: "2.0.0",
  setup(api) {
    api.addUtilities({
      "code-block": {
        display: "block", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        fontSize: "0.875rem", lineHeight: "1.7", letterSpacing: "-0.005em",
        background: "#0b0b0e", color: "#e2e2e6",
        padding: "1.25rem 1.5rem", borderRadius: "1rem",
        overflowX: "auto",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04), 0 8px 24px -8px rgba(0,0,0,0.30)",
      },
      "code-inline": {
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        fontSize: "0.875em",
        background: "rgba(134,87,247,0.15)", color: "#c5b5fe",
        padding: "0.15rem 0.4rem", borderRadius: "0.375rem", fontWeight: "600",
      },
      "token-keyword":  { color: "#f471b5" },
      "token-string":   { color: "#86efac" },
      "token-comment":  { color: "#71717a", fontStyle: "italic" },
      "token-number":   { color: "#fbbf24" },
      "token-function": { color: "#93c5fd" },
      "token-class":    { color: "#fcd34d" },
      "token-operator": { color: "#a1a1aa" },
    });
  },
};
