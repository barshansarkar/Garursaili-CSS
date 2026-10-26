export default {
  name: "@garursaili/plugin-modals",
  version: "1.0.0",
  setup(api) {
    api.addUtilities({
      "modal-overlay": { position: "fixed", inset: "0", zIndex: "50", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)", display: "grid", placeItems: "center", padding: "1rem" },
      "modal-content": { background: "var(--garur-surface)", color: "var(--garur-fg)", borderRadius: "1rem", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", padding: "1.5rem", maxWidth: "32rem", width: "100%", maxHeight: "90vh", overflowY: "auto" },
      "modal-sm": { maxWidth: "24rem" },
      "modal-lg": { maxWidth: "48rem" },
      "modal-full": { maxWidth: "100%", height: "100%", borderRadius: "0" },
      "modal-drawer-bottom": { marginTop: "auto", borderRadius: "1rem 1rem 0 0", maxHeight: "80vh" },
    });
  },
};
