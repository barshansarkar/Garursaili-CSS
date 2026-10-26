export default {
    name: "@garursaili/plugin-gallery",
    version: "2.0.0",
    setup(api) {
        api.addUtilities({
            gallery: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(12rem, 1fr))", gap: "0.5rem" },
            "gallery-2": { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.5rem" },
            "gallery-3": { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.5rem" },
            "gallery-4": { display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "0.5rem" },
            "gallery-item": { position: "relative", aspectRatio: "1", overflow: "hidden", borderRadius: "1rem", cursor: "pointer", "& img": { transition: "transform 600ms cubic-bezier(0.16, 1, 0.3, 1)" }, "&:hover img": { transform: "scale(1.08)" } },
            "gallery-item-wide": { aspectRatio: "16/9" },
            "gallery-item-tall": { aspectRatio: "3/4" },
            "gallery-overlay": { position: "absolute", inset: "0", background: "linear-gradient(to top, rgba(0,0,0,0.75), transparent 55%)", opacity: "0", transition: "opacity 300ms ease", display: "flex", alignItems: "flex-end", padding: "1rem 1.25rem", color: "white", "&:hover": { opacity: "1" } },
        });
    },
};
