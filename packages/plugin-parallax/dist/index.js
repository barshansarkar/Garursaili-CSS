export default {
    name: "@garursaili/plugin-parallax",
    version: "1.0.0",
    setup(api) {
        api.addUtilities({
            "parallax": { backgroundAttachment: "fixed", backgroundPosition: "center", backgroundSize: "cover", backgroundRepeat: "no-repeat" },
            "parallax-slow": { transform: "translateZ(0)", willChange: "transform" },
            "parallax-fast": { transform: "translateZ(0)", willChange: "transform" },
            "parallax-layer": { position: "absolute", inset: "0", backgroundSize: "cover", backgroundPosition: "center", willChange: "transform" },
            "parallax-fade-top": { maskImage: "linear-gradient(to bottom, transparent, black 30%)", WebkitMaskImage: "linear-gradient(to bottom, transparent, black 30%)" },
            "parallax-fade-bottom": { maskImage: "linear-gradient(to top, transparent, black 30%)", WebkitMaskImage: "linear-gradient(to top, transparent, black 30%)" },
        });
    },
};
