export default {
    name: "@garursaili/plugin-product-cards",
    version: "2.0.0",
    setup(api) {
        api.addUtilities({
            "product-card": {
                display: "flex", flexDirection: "column",
                background: "var(--garur-surface)",
                border: "1px solid var(--garur-border-subtle)",
                borderRadius: "1.25rem", overflow: "hidden",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6), 0 1px 2px rgba(0,0,0,0.04), 0 8px 24px -8px rgba(0,0,0,0.06)",
                transition: "all 400ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                "&:hover": { transform: "translateY(-4px)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6), 0 4px 8px rgba(0,0,0,0.04), 0 24px 48px -12px rgba(0,0,0,0.12)" },
            },
            "product-image": { position: "relative", aspectRatio: "1", overflow: "hidden", background: "var(--garur-surface-muted)", "& img": { transition: "transform 600ms cubic-bezier(0.16, 1, 0.3, 1)" }, "&:hover img": { transform: "scale(1.06)" } },
            "product-badge": { position: "absolute", top: "0.75rem", left: "0.75rem", padding: "0.3125rem 0.625rem", borderRadius: "9999px", fontSize: "0.6875rem", fontWeight: "600", letterSpacing: "0.02em", background: "var(--garur-danger)", color: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.20)" },
            "product-info": { padding: "1.125rem 1.25rem 1.25rem" },
            "product-name": { fontSize: "0.9375rem", fontWeight: "500", letterSpacing: "-0.011em", marginBottom: "0.25rem" },
            "product-price": { fontSize: "1.25rem", fontWeight: "700", letterSpacing: "-0.02em" },
            "product-price-old": { fontSize: "0.875rem", fontWeight: "400", color: "var(--garur-muted)", textDecoration: "line-through", marginLeft: "0.5rem" },
            "product-actions": { display: "flex", gap: "0.5rem", marginTop: "0.875rem" },
        });
    },
};
