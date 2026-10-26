export default {
  name: "@garursaili/plugin-charts",
  version: "1.0.0",
  setup(api) {
    api.addUtilities({
      "chart-bar": { display: "flex", alignItems: "flex-end", gap: "0.5rem", height: "12rem" },
      "chart-bar-item": { flex: "1", background: "var(--garur-primary)", borderRadius: "0.25rem 0.25rem 0 0", transition: "height 300ms", minHeight: "4px" },
      "chart-line": { width: "100%", height: "12rem", position: "relative" },
      "chart-pie": { width: "12rem", height: "12rem", borderRadius: "9999px", background: "conic-gradient(var(--garur-primary) 0 40%, var(--garur-warning) 40% 70%, var(--garur-success) 70% 100%)" },
      "chart-donut": { width: "12rem", height: "12rem", borderRadius: "9999px", background: "conic-gradient(var(--garur-primary) 0 40%, var(--garur-warning) 40% 70%, var(--garur-success) 70% 100%)", position: "relative", "&::after": { content: "''", position: "absolute", inset: "25%", background: "var(--garur-surface)", borderRadius: "9999px" } },
      "chart-legend": { display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1rem", fontSize: "0.875rem" },
      "chart-legend-item": { display: "flex", alignItems: "center", gap: "0.375rem" },
      "chart-legend-dot": { width: "0.75rem", height: "0.75rem", borderRadius: "9999px" },
    });
  },
};
