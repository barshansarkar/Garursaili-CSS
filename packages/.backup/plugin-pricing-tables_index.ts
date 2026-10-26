export default {
  name: "@garursaili/plugin-pricing-tables",
  version: "1.0.0",
  setup(api) {
    api.addUtilities({
      "pricing-grid": { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))", gap: "1.5rem", alignItems: "stretch" },
      "pricing-card": { display: "flex", flexDirection: "column", padding: "2rem", background: "var(--garur-surface)", border: "1px solid var(--garur-border-subtle)", borderRadius: "1rem" },
      "pricing-card-featured": { background: "linear-gradient(135deg, var(--garur-primary), var(--garur-accent))", color: "white", border: "none", transform: "scale(1.05)", boxShadow: "0 20px 40px -12px rgba(134,87,247,0.5)" },
      "pricing-name": { fontSize: "0.875rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" },
      "pricing-price": { fontSize: "2.5rem", fontWeight: "800", lineHeight: "1", marginBottom: "0.25rem" },
      "pricing-period": { fontSize: "0.875rem", opacity: "0.7", marginBottom: "1.5rem" },
      "pricing-features": { display: "flex", flexDirection: "column", gap: "0.75rem", flex: "1", marginBottom: "1.5rem" },
      "pricing-cta": { width: "100%", padding: "0.75rem", borderRadius: "0.5rem", fontWeight: "600", textAlign: "center", cursor: "pointer" },
    });
  },
};
