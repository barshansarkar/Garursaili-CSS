export default {
  name: "@garursaili/plugin-dropdowns",
  version: "2.0.0",
  setup(api) {
    api.addUtilities({
      dropdown: { position: "relative", display: "inline-block" },
      "dropdown-menu": {
        position: "absolute", top: "100%", right: "0",
        minWidth: "13rem", marginTop: "0.5rem", padding: "0.375rem",
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(40px) saturate(180%)",
        WebkitBackdropFilter: "blur(40px) saturate(180%)",
        border: "1px solid var(--garur-border-subtle)",
        borderRadius: "1rem",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6), 0 1px 2px rgba(0,0,0,0.04), 0 16px 40px -8px rgba(0,0,0,0.14)",
        zIndex: "50",
        opacity: "0", visibility: "hidden",
        transform: "translateY(-6px) scale(0.98)",
        transition: "opacity 200ms cubic-bezier(0.16, 1, 0.3, 1), visibility 200ms, transform 200ms cubic-bezier(0.16, 1, 0.3, 1)",
      },
      "dropdown-hover": { "&:hover .dropdown-menu": { opacity: "1", visibility: "visible", transform: "none" } },
      "dropdown-open": { opacity: "1", visibility: "visible", transform: "none" },
      "dropdown-item": {
        display: "flex", alignItems: "center", gap: "0.5rem",
        padding: "0.5rem 0.75rem", fontSize: "0.875rem",
        color: "var(--garur-fg)", borderRadius: "0.5rem",
        cursor: "pointer", textDecoration: "none",
        transition: "background 120ms ease",
        "&:hover": { background: "var(--garur-surface-muted)" },
      },
    });
  },
};
