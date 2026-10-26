export default {
  name: "@garursaili/plugin-gallery",
  version: "1.0.0",
  setup(api) {
    api.addUtilities({
      "gallery": { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(12rem, 1fr))", gap: "0.5rem" },
      "gallery-2": { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.5rem" },
      "gallery-3": { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.5rem" },
      "gallery-4": { display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "0.5rem" },
      "gallery-item": { position: "relative", aspectRatio: "1", overflow: "hidden", borderRadius: "0.5rem", cursor: "pointer" },
      "gallery-item-wide": { aspectRatio: "16/9" },
      "gallery-item-tall": { aspectRatio: "3/4" },
      "gallery-overlay": { position: "absolute", inset: "0", background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent 50%)", opacity: "0", transition: "opacity 200ms", display: "flex", alignItems: "flex-end", padding: "1rem", color: "white", "&:hover": { opacity: "1" } },
    });
  },
};
