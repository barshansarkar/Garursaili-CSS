export default {
  name: "@garursaili/plugin-tables",
  version: "2.0.0",
  setup(api) {
    api.addUtilities({
      "table-striped":     { "& tbody tr:nth-child(odd)": { background: "color-mix(in oklab, var(--garur-surface-muted) 50%, transparent)" } },
      "table-hover":       { "& tbody tr": { transition: "background 150ms ease" }, "& tbody tr:hover": { background: "var(--garur-surface-muted)" } },
      "table-compact":     { "& td, & th": { padding: "0.5rem 0.625rem", fontSize: "0.8125rem" } },
      "table-comfortable": { "& td, & th": { padding: "1rem 1.125rem", letterSpacing: "-0.011em" } },
      "table-sticky-head": { "& thead th": { position: "sticky", top: "0", background: "var(--garur-surface)", zIndex: "10", backdropFilter: "blur(12px)" } },
      "table-fixed":       { tableLayout: "fixed" },
      "table-numeric":     { "& td:not(:first-child)": { textAlign: "right", fontVariantNumeric: "tabular-nums" } },
    });
  },
};
