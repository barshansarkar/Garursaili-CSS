export default {
  name: "@garursaili/plugin-kanban",
  version: "1.0.0",
  setup(api) {
    api.addUtilities({
      "kanban": { display: "grid", gridAutoFlow: "column", gridAutoColumns: "18rem", gap: "1rem", overflowX: "auto", padding: "1rem 0" },
      "kanban-column": { display: "flex", flexDirection: "column", gap: "0.75rem", background: "var(--garur-surface-muted)", borderRadius: "0.75rem", padding: "0.75rem" },
      "kanban-header": { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 0.25rem" },
      "kanban-title": { fontSize: "0.875rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--garur-muted)" },
      "kanban-count": { fontSize: "0.75rem", padding: "0.125rem 0.5rem", background: "var(--garur-surface)", borderRadius: "9999px" },
      "kanban-card": { background: "var(--garur-surface)", borderRadius: "0.5rem", padding: "0.75rem", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", cursor: "grab", "&:hover": { boxShadow: "0 4px 6px rgba(0,0,0,0.1)" } },
    });
  },
};
