export default {
    name: "@garursaili/plugin-kanban",
    version: "2.0.0",
    setup(api) {
        api.addUtilities({
            kanban: { display: "grid", gridAutoFlow: "column", gridAutoColumns: "19rem", gap: "1rem", overflowX: "auto", padding: "1rem 0", scrollSnapType: "x mandatory" },
            "kanban-column": { display: "flex", flexDirection: "column", gap: "0.75rem", background: "var(--garur-surface-muted)", borderRadius: "1.25rem", padding: "0.875rem", scrollSnapAlign: "start" },
            "kanban-header": { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 0.375rem" },
            "kanban-title": { fontSize: "0.8125rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--garur-muted)" },
            "kanban-count": { fontSize: "0.6875rem", fontWeight: "600", padding: "0.1875rem 0.5rem", background: "var(--garur-surface)", borderRadius: "9999px" },
            "kanban-card": {
                background: "var(--garur-surface)",
                borderRadius: "0.75rem",
                padding: "0.875rem 1rem",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6), 0 1px 2px rgba(0,0,0,0.04), 0 4px 12px -2px rgba(0,0,0,0.06)",
                cursor: "grab",
                transition: "all 250ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                "&:hover": { transform: "translateY(-2px)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6), 0 4px 8px rgba(0,0,0,0.06), 0 12px 24px -6px rgba(0,0,0,0.10)" },
            },
        });
    },
};
