export default {
  name: "@garursaili/plugin-accordion",
  version: "2.0.0",
  setup(api) {
    api.addUtilities({
      accordion: {
        width: "100%",
        border: "1px solid var(--garur-border-subtle)",
        borderRadius: "1.25rem",
        overflow: "hidden",
        background: "rgba(255,255,255,0.03)",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px -8px rgba(0,0,0,0.06)",
        "& > details": { borderBottom: "1px solid var(--garur-border-subtle)", transition: "background 200ms ease" },
        "& > details:last-child": { borderBottom: "none" },
        "& > details[open]": { background: "color-mix(in oklab, var(--garur-primary) 3%, transparent)" },
      },
      "accordion-summary": {
        padding: "1.125rem 1.5rem",
        fontWeight: "500",
        cursor: "pointer",
        listStyle: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        letterSpacing: "-0.011em",
        transition: "color 200ms ease",
        "&::-webkit-details-marker": { display: "none" },
        "&::after": {
          content: "'+'",
          fontSize: "1.25rem",
          fontWeight: "300",
          color: "var(--garur-muted)",
          transition: "transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        },
        "&:hover": { color: "var(--garur-primary)" },
      },
      "accordion-body": { padding: "0 1.5rem 1.5rem", fontSize: "0.9375rem", lineHeight: "1.7", color: "var(--garur-muted)", letterSpacing: "-0.011em" },
      "details-open-after": { "&[open] summary::after": { content: "'−'", transform: "rotate(180deg)" } },
    });
  },
};
