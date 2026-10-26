export default {
    name: "@garursaili/plugin-gradient-text",
    version: "2.0.0",
    setup(api) {
        const base = {
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
            filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.08))",
        };
        api.addUtilities({
            "text-gradient": { ...base, backgroundImage: "linear-gradient(135deg, var(--grad-from, #8657f7), var(--grad-to, #e54cb5))" },
            "text-gradient-aurora": {
                ...base,
                backgroundImage: "linear-gradient(120deg, #8657f7, #e54cb5, #f59e00, #1a8ade, #8657f7)",
                backgroundSize: "300% 300%",
                animation: "garur-gradient-shift 6s ease infinite",
            },
        });
        api.addKeyframes("garur-gradient-shift", "0%,100%{background-position:0% 50%}50%{background-position:100% 50%}");
    },
};
