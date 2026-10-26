export default {
    name: "@garursaili/plugin-bento",
    version: "2.0.0",
    setup(api) {
        api.addUtilities({
            bento: { display: "grid", gridTemplateColumns: "repeat(12, minmax(0, 1fr))", gap: "1rem" },
            "bento-tight": { display: "grid", gridTemplateColumns: "repeat(12, minmax(0, 1fr))", gap: "0.5rem" },
            "bento-loose": { display: "grid", gridTemplateColumns: "repeat(12, minmax(0, 1fr))", gap: "1.5rem" },
            "bento-1": { gridColumn: "span 1" },
            "bento-2": { gridColumn: "span 2" },
            "bento-3": { gridColumn: "span 3" },
            "bento-4": { gridColumn: "span 4" },
            "bento-5": { gridColumn: "span 5" },
            "bento-6": { gridColumn: "span 6" },
            "bento-7": { gridColumn: "span 7" },
            "bento-8": { gridColumn: "span 8" },
            "bento-9": { gridColumn: "span 9" },
            "bento-10": { gridColumn: "span 10" },
            "bento-12": { gridColumn: "span 12" },
        });
    },
};
