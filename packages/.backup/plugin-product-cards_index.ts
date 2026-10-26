export default {
  name: "@garursaili/plugin-product-cards",
  version: "1.0.0",
  setup(api) {
    api.addUtilities({
      "product-card": { display: "flex", flexDirection: "column", background: "var(--garur-surface)", border: "1px solid var(--garur-border-subtle)", borderRadius: "1rem", overflow: "hidden", transition: "transform 200ms, box-shadow 200ms", "&:hover": { transform: "translateY(-2px)", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" } },
      "product-image": { position: "relative", aspectRatio: "1", overflow: "hidden", background: "var(--garur-surface-muted)" },
      "product-badge": { position: "absolute", top: "0.75rem", left: "0.75rem", padding: "0.25rem 0.625rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: "600", background: "var(--garur-danger)", color: "white" },
      "product-info": { padding: "1rem" },
      "product-name": { fontSize: "0.9375rem", fontWeight: "500", marginBottom: "0.25rem" },
      "product-price": { fontSize: "1.125rem", fontWeight: "700" },
      "product-price-old": { fontSize: "0.875rem", fontWeight: "400", color: "var(--garur-muted)", textDecoration: "line-through", marginLeft: "0.5rem" },
      "product-actions": { display: "flex", gap: "0.5rem", marginTop: "0.75rem" },
    });
  },
};
