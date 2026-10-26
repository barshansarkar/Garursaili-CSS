export default {
  name: "@garursaili/plugin-pricing-tables",
  version: "2.0.0",
  setup(api) {
    api.addUtilities({
      "pricing-grid": { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(17rem, 1fr))", gap: "1.5rem", alignItems: "stretch" },
      "pricing-card": {
        display: "flex", flexDirection: "column", padding: "2.25rem",
        background: "var(--garur-surface)",
        border: "1px solid var(--garur-border-subtle)",
        borderRadius: "1.75rem",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6), 0 1px 2px rgba(0,0,0,0.04), 0 8px 24px -8px rgba(0,0,0,0.06)",
        transition: "all 400ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        "&:hover": { transform: "translateY(-4px)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6), 0 4px 8px rgba(0,0,0,0.04), 0 24px 48px -12px rgba(0,0,0,0.12)" },
      },
      "pricing-card-featured": {
        background: "linear-gradient(135deg, var(--garur-primary), var(--garur-accent))",
        color: "white", border: "none",
        transform: "scale(1.04)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.30), 0 20px 60px -12px rgba(134,87,247,0.45), 0 32px 96px -24px rgba(134,87,247,0.30)",
      },
      "pricing-name":     { fontSize: "0.8125rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" },
      "pricing-price":    { fontSize: "3rem", fontWeight: "800", lineHeight: "1", letterSpacing: "-0.04em", marginBottom: "0.25rem" },
      "pricing-period":   { fontSize: "0.875rem", opacity: "0.7", marginBottom: "1.75rem" },
      "pricing-features": { display: "flex", flexDirection: "column", gap: "0.75rem", flex: "1", marginBottom: "1.75rem" },
      "pricing-cta":      { width: "100%", padding: "0.875rem", borderRadius: "0.75rem", fontWeight: "600", letterSpacing: "-0.011em", textAlign: "center", cursor: "pointer", transition: "all 200ms cubic-bezier(0.34, 1.56, 0.64, 1)", "&:active": { transform: "scale(0.98)" } },
    });
  },
};
