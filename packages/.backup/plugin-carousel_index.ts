export default {
  name: "@garursaili/plugin-carousel",
  version: "1.0.0",
  setup(api) {
    api.addUtilities({
      "carousel": { display: "flex", overflowX: "auto", scrollSnapType: "x mandatory", gap: "1rem", scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } },
      "carousel-slide": { flexShrink: "0", scrollSnapAlign: "start", width: "100%" },
      "carousel-slide-half": { flexShrink: "0", scrollSnapAlign: "start", width: "calc(50% - 0.5rem)" },
      "carousel-slide-third": { flexShrink: "0", scrollSnapAlign: "start", width: "calc(33.333% - 0.667rem)" },
      "carousel-buttons": { position: "absolute", top: "50%", transform: "translateY(-50%)", width: "2.5rem", height: "2.5rem", borderRadius: "9999px", background: "var(--garur-surface)", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", display: "grid", placeItems: "center", cursor: "pointer" },
    });
  },
};
