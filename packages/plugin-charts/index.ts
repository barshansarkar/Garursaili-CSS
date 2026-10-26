export default {
  name: "@garursaili/plugin-charts",
  version: "2.0.0",
  setup(api) {
    api.addUtilities({
      "chart-bar":      { display: "flex", alignItems: "flex-end", gap: "0.5rem", height: "12rem" },
      "chart-bar-item": { flex: "1", background: "linear-gradient(to top, var(--garur-primary), color-mix(in oklab, var(--garur-primary) 60%, white))", borderRadius: "0.5rem 0.5rem 0 0", transition: "all 400ms cubic-bezier(0.34, 1.56, 0.64, 1)", minHeight: "4px", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.30)", "&:hover": { filter: "brightness(1.1)" } },
      "chart-line":     { width: "100%", height: "12rem", position: "relative" },
      "chart-pie":      { width: "12rem", height: "12rem", borderRadius: "9999px", background: "conic-gradient(var(--garur-primary) 0 40%, var(--garur-warning) 40% 70%, var(--garur-success) 70% 100%)", boxShadow: "0 4px 16px -4px rgba(0,0,0,0.10)" },
      "chart-donut":    { width: "12rem", height: "12rem", borderRadius: "9999px", background: "conic-gradient(var(--garur-primary) 0 40%, var(--garur-warning) 40% 70%, var(--garur-success) 70% 100%)", position: "relative", boxShadow: "0 4px 16px -4px rgba(0,0,0,0.10)", "&::after": { content: "''", position: "absolute", inset: "25%", background: "var(--garur-surface)", borderRadius: "9999px", boxShadow: "inset 0 2px 8px rgba(0,0,0,0.06)" } },
      "chart-legend":   { display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1rem", fontSize: "0.875rem", letterSpacing: "-0.011em" },
      "chart-legend-item": { display: "flex", alignItems: "center", gap: "0.375rem" },
      "chart-legend-dot":  { width: "0.75rem", height: "0.75rem", borderRadius: "9999px", boxShadow: "0 0 0 2px var(--garur-surface)" },
    });
  },
};
