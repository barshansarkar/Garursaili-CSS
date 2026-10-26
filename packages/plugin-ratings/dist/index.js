export default {
    name: "@garursaili/plugin-ratings",
    version: "2.0.0",
    setup(api) {
        api.addUtilities({
            "rating-stars": { display: "inline-flex", gap: "0.125rem", color: "var(--garur-warning)", fontSize: "1.125rem", lineHeight: "1" },
            "rating-star": { cursor: "pointer", transition: "transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1)", "&:hover": { transform: "scale(1.2)" } },
            "rating-star-filled": { color: "var(--garur-warning)", filter: "drop-shadow(0 0 4px color-mix(in oklab, var(--garur-warning) 40%, transparent))" },
            "rating-star-empty": { color: "var(--garur-border-subtle)" },
            "rating-half": { position: "relative", "&::before": { content: "'★'", position: "absolute", inset: "0", width: "50%", overflow: "hidden", color: "var(--garur-warning)" } },
            "rating-count": { fontSize: "0.75rem", color: "var(--garur-muted)", marginLeft: "0.375rem" },
            "rating-value": { fontSize: "0.875rem", fontWeight: "600" },
        });
    },
};
