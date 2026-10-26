export default {
  name: "@garursaili/plugin-glass",
  version: "2.0.0",
  prefixes: ["glass"],
  setup(api) {
    api.defineToken("glass-bg",        "rgba(255, 255, 255, 0.06)");
    api.defineToken("glass-bg-hover",  "rgba(255, 255, 255, 0.12)");
    api.defineToken("glass-border",    "rgba(255, 255, 255, 0.16)");
    api.defineToken("glass-highlight", "rgba(255, 255, 255, 0.42)");

    const base = {
      background: "var(--glass-bg)",
      backdropFilter: "blur(40px) saturate(180%) brightness(1.05)",
      WebkitBackdropFilter: "blur(40px) saturate(180%) brightness(1.05)",
      border: "1px solid var(--glass-border)",
      boxShadow: [
        "inset 0 1px 0 0 var(--glass-highlight)",
        "inset 0 -1px 0 0 rgba(0,0,0,0.06)",
        "0 1px 2px 0 rgba(0,0,0,0.08)",
        "0 8px 32px 0 rgba(0,0,0,0.16)",
        "0 32px 64px -16px rgba(0,0,0,0.30)",
      ].join(", "),
    };

    api.addUtilities({
      "glass-card":   { ...base, borderRadius: "1.5rem", padding: "1.75rem", transition: "all 500ms cubic-bezier(0.34, 1.56, 0.64, 1)", "&:hover": { background: "var(--glass-bg-hover)", transform: "translateY(-3px)" } },
      "glass-nav":    { position: "sticky", top: "0", zIndex: "50", background: "rgba(255, 255, 255, 0.72)", backdropFilter: "blur(40px) saturate(200%)", WebkitBackdropFilter: "blur(40px) saturate(200%)", borderBottom: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 1px 0 0 rgba(255,255,255,0.6)" },
      "glass-nav-dark": { position: "sticky", top: "0", zIndex: "50", background: "rgba(15, 15, 20, 0.72)", backdropFilter: "blur(40px) saturate(200%)", WebkitBackdropFilter: "blur(40px) saturate(200%)", borderBottom: "1px solid rgba(255,255,255,0.08)" },
      "glass-panel":  { ...base, borderRadius: "2rem", padding: "2.5rem" },
      "glass-pill":   { ...base, borderRadius: "9999px", padding: "0.5rem 1rem", display: "inline-flex", alignItems: "center", gap: "0.375rem", fontSize: "0.8125rem", fontWeight: "500" },
      "glass-overlay": { position: "fixed", inset: "0", zIndex: "100", background: "rgba(0,0,0,0.4)", backdropFilter: "blur(16px) saturate(150%)", WebkitBackdropFilter: "blur(16px) saturate(150%)" },
      "glass-thin":   { ...base, background: "rgba(255,255,255,0.03)" },
      "glass-thick":  { ...base, background: "rgba(255,255,255,0.14)" },
      "glass-specular": {
        position: "relative", overflow: "hidden",
        "&::before": {
          content: "''", position: "absolute", inset: "0", borderRadius: "inherit", padding: "1px",
          background: "linear-gradient(160deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.1) 30%, transparent 50%, rgba(255,255,255,0.05) 100%)",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor", maskComposite: "exclude", pointerEvents: "none",
        },
      },
      "glass-noise": {
        position: "relative",
        "&::after": {
          content: "''", position: "absolute", inset: "0", borderRadius: "inherit",
          pointerEvents: "none", opacity: "0.035",
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
        },
      },
    });
  },
};
