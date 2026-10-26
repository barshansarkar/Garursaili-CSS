export default {
    name: "@garursaili/plugin-scrollbar",
    version: "1.0.0",
    setup(api) {
        api.defineToken("scrollbar-thumb", "rgba(0,0,0,0.25)");
        api.defineToken("scrollbar-thumb-hover", "rgba(0,0,0,0.4)");
        api.addUtilities({
            "scrollbar-styled": {
                scrollbarWidth: "thin", scrollbarColor: "var(--scrollbar-thumb) transparent",
                "&::-webkit-scrollbar": { width: "10px", height: "10px" },
                "&::-webkit-scrollbar-track": { background: "transparent" },
                "&::-webkit-scrollbar-thumb": { background: "var(--scrollbar-thumb)", borderRadius: "9999px", border: "2px solid transparent", backgroundClip: "padding-box" },
                "&::-webkit-scrollbar-thumb:hover": { background: "var(--scrollbar-thumb-hover)", backgroundClip: "padding-box" },
            },
            "scrollbar-thin": { scrollbarWidth: "thin", "&::-webkit-scrollbar": { width: "6px", height: "6px" }, "&::-webkit-scrollbar-thumb": { background: "var(--scrollbar-thumb)", borderRadius: "9999px" } },
            "scrollbar-hidden": { scrollbarWidth: "none", msOverflowStyle: "none", "&::-webkit-scrollbar": { display: "none" } },
            "scrollbar-iris": { scrollbarColor: "#8657f7 transparent", "&::-webkit-scrollbar-thumb": { background: "#8657f7", borderRadius: "9999px" } },
            "scrollbar-pink": { scrollbarColor: "#e54cb5 transparent", "&::-webkit-scrollbar-thumb": { background: "#e54cb5", borderRadius: "9999px" } },
            "scrollbar-dark": { scrollbarColor: "rgba(255,255,255,0.2) transparent", "&::-webkit-scrollbar": { width: "10px", height: "10px" }, "&::-webkit-scrollbar-thumb": { background: "rgba(255,255,255,0.2)", borderRadius: "9999px" }, "&::-webkit-scrollbar-thumb:hover": { background: "rgba(255,255,255,0.35)" } },
            "scrollbar-gutter": { scrollbarGutter: "stable" },
            "scroll-smooth": { scrollBehavior: "smooth" },
            "scroll-auto": { scrollBehavior: "auto" },
            "snap-x": { scrollSnapType: "x mandatory" },
            "snap-y": { scrollSnapType: "y mandatory" },
            "snap-item": { scrollSnapAlign: "start" },
            "snap-center": { scrollSnapAlign: "center" },
        });
        api.matchUtilities({ "scrollbar-color": (v) => ({ scrollbarColor: v + " transparent", "&::-webkit-scrollbar-thumb": { background: v, borderRadius: "9999px" } }) }, { values: {}, supportsArbitrary: true, type: "color" });
        api.matchUtilities({ "scrollbar-w": (v) => ({ "&::-webkit-scrollbar": { width: v, height: v } }) }, { values: { thin: "6px", DEFAULT: "10px", md: "12px", thick: "16px" }, supportsArbitrary: true, type: "length" });
    },
};
