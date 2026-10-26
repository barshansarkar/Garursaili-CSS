export default {
  name: "@garursaili/plugin-tables",
  version: "1.0.0",
  setup(api) {
    api.addUtilities({
      "table-striped": { "& tbody tr:nth-child(odd)": { background: "color-mix(in oklab, var(--garur-surface-muted) 50%, transparent)" } },
      "table-hover": { "& tbody tr": { transition: "background 100ms" }, "& tbody tr:hover": { background: "var(--garur-surface-muted)" } },
      "table-compact": { "& td, & th": { padding: "0.375rem 0.5rem", fontSize: "0.8125rem" } },
      "table-comfortable": { "& td, & th": { padding: "0.875rem 1rem" } },
      "table-sticky-head": { "& thead th": { position: "sticky", top: "0", background: "var(--garur-surface)", zIndex: "10" } },
      "table-fixed": { tableLayout: "fixed" },
      "table-numeric": { "& td:not(:first-child)": { textAlign: "right", fontVariantNumeric: "tabular-nums" } },
    });
  },
};
