export default {
  name: "@garursaili/plugin-print-styles",
  version: "1.0.0",
  setup(api) {
    api.addUtilities({
      "print-only": { display: "none", "@media print": { display: "block" } },
      "no-print": { "@media print": { display: "none !important" } },
      "print-hidden": { "@media print": { display: "none" } },
      "print-break-before": { "@media print": { pageBreakBefore: "always" } },
      "print-break-after": { "@media print": { pageBreakAfter: "always" } },
      "print-break-inside": { "@media print": { pageBreakInside: "avoid" } },
      "print-color": { "@media print": { WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" } },
    });
  },
};
