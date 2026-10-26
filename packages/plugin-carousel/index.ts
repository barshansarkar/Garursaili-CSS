export default {
  name: "@garursaili/plugin-carousel",
  version: "2.0.0",
  setup(api) {
    api.addUtilities({
      carousel: { display: "flex", overflowX: "auto", scrollSnapType: "x mandatory", gap: "1rem", scrollbarWidth: "none", scrollPaddingLeft: "1rem", overscrollBehaviorX: "contain", "&::-webkit-scrollbar": { display: "none" } },
      "carousel-slide":        { flexShrink: "0", scrollSnapAlign: "start", width: "100%", scrollSnapStop: "always" },
      "carousel-slide-half":   { flexShrink: "0", scrollSnapAlign: "start", width: "calc(50% - 0.5rem)", scrollSnapStop: "always" },
      "carousel-slide-third":  { flexShrink: "0", scrollSnapAlign: "start", width: "calc(33.333% - 0.667rem)", scrollSnapStop: "always" },
      "carousel-buttons": {
        position: "absolute", top: "50%", transform: "translateY(-50%)",
        width: "2.75rem", height: "2.75rem", borderRadius: "9999px",
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6), 0 4px 12px rgba(0,0,0,0.10), 0 12px 24px -6px rgba(0,0,0,0.15)",
        display: "grid", placeItems: "center", cursor: "pointer",
        transition: "all 200ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        "&:hover": { transform: "translateY(-50%) scale(1.06)" },
        "&:active": { transform: "translateY(-50%) scale(0.96)" },
      },
    });
  },
};
