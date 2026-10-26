export default {
    name: "@garursaili/plugin-patterns",
    version: "1.0.0",
    setup(api) {
        api.addUtilities({
            "pattern-dots": { backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "24px 24px", opacity: "0.15" },
            "pattern-dots-sm": { backgroundImage: "radial-gradient(circle, currentColor 0.5px, transparent 0.5px)", backgroundSize: "16px 16px", opacity: "0.2" },
            "pattern-dots-lg": { backgroundImage: "radial-gradient(circle, currentColor 1.5px, transparent 1.5px)", backgroundSize: "32px 32px", opacity: "0.15" },
            "pattern-grid": { backgroundImage: "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)", backgroundSize: "32px 32px", opacity: "0.08" },
            "pattern-grid-lg": { backgroundImage: "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)", backgroundSize: "64px 64px", opacity: "0.06" },
            "pattern-stripes": { backgroundImage: "repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 1px, transparent 12px)", opacity: "0.1" },
            "pattern-checker": { backgroundImage: "linear-gradient(45deg, currentColor 25%, transparent 25%, transparent 75%, currentColor 75%), linear-gradient(45deg, currentColor 25%, transparent 25%, transparent 75%, currentColor 75%)", backgroundSize: "20px 20px", backgroundPosition: "0 0, 10px 10px", opacity: "0.06" },
            "pattern-mesh": { background: "radial-gradient(ellipse 80% 60% at 20% 0%, color-mix(in oklab, #8657f7 25%, transparent), transparent 60%), radial-gradient(ellipse 60% 50% at 80% 20%, color-mix(in oklab, #e54cb5 20%, transparent), transparent 60%), radial-gradient(ellipse 70% 40% at 50% 100%, color-mix(in oklab, #1a8ade 18%, transparent), transparent 60%)" },
            "pattern-noise": { position: "absolute", inset: "0", pointerEvents: "none", opacity: "0.03", backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` },
        });
        api.matchUtilities({ "pattern-size": (v) => ({ backgroundSize: v }) }, { values: { xs: "8px 8px", sm: "16px 16px", DEFAULT: "24px 24px", md: "32px 32px", lg: "48px 48px" }, supportsArbitrary: true, type: "length" });
        api.matchUtilities({ "pattern-opacity": (v) => ({ opacity: v }) }, { values: { 5: "0.05", 10: "0.1", 15: "0.15", 20: "0.2", 30: "0.3", 50: "0.5" }, supportsArbitrary: true, type: "percentage" });
    },
};
