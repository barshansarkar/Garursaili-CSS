export default {
  name: "@garursaili/plugin-timelines",
  version: "1.0.0",
  setup(api) {
    api.addUtilities({
      "timeline": { position: "relative", paddingLeft: "1.5rem", "&::before": { content: "''", position: "absolute", left: "0.5rem", top: "0.5rem", bottom: "0.5rem", width: "2px", background: "var(--garur-border-subtle)" } },
      "timeline-item": { position: "relative", paddingBottom: "1.5rem", "&::before": { content: "''", position: "absolute", left: "-1.5rem", top: "0.375rem", width: "0.75rem", height: "0.75rem", borderRadius: "9999px", background: "var(--garur-primary)", border: "2px solid var(--garur-surface)" } },
      "timeline-date": { fontSize: "0.75rem", color: "var(--garur-muted)", marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.05em" },
      "timeline-title": { fontSize: "1rem", fontWeight: "600", marginBottom: "0.25rem" },
      "timeline-description": { fontSize: "0.875rem", color: "var(--garur-muted)", lineHeight: "1.6" },
    });
  },
};
