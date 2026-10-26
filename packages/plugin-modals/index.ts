export default {
  name: "@garursaili/plugin-modals",
  version: "2.0.0",
  setup(api) {
    api.addUtilities({
      "modal-overlay": {
        position: "fixed", inset: "0", zIndex: "50",
        background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(16px) saturate(150%)",
        WebkitBackdropFilter: "blur(16px) saturate(150%)",
        display: "grid", placeItems: "center", padding: "1rem",
      },
      "modal-content": {
        background: "var(--garur-surface)",
        color: "var(--garur-fg)",
        borderRadius: "1.75rem",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6), 0 1px 2px rgba(0,0,0,0.04), 0 24px 48px -12px rgba(0,0,0,0.18), 0 64px 128px -32px rgba(0,0,0,0.30)",
        padding: "2rem",
        maxWidth: "32rem", width: "100%", maxHeight: "90vh", overflowY: "auto",
        animation: "modal-pop 400ms cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      "modal-sm": { maxWidth: "24rem" },
      "modal-lg": { maxWidth: "48rem" },
      "modal-full": { maxWidth: "100%", height: "100%", borderRadius: "0" },
      "modal-drawer-bottom": { marginTop: "auto", borderRadius: "1.75rem 1.75rem 0 0", maxHeight: "80vh" },
    });
    api.addKeyframes("modal-pop", "0%{opacity:0;transform:scale(0.96) translateY(8px)}100%{opacity:1;transform:none}");
  },
};
