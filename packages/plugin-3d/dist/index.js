export default {
    name: "@garursaili/plugin-3d",
    version: "2.0.0",
    setup(api) {
        api.defineToken("3d-ease", "cubic-bezier(0.34, 1.56, 0.64, 1)");
        api.addUtilities({
            "scene-3d": { perspective: "1200px", perspectiveOrigin: "center" },
            "scene-3d-wide": { perspective: "2000px", perspectiveOrigin: "center" },
            "scene-3d-near": { perspective: "600px", perspectiveOrigin: "center" },
            "card-3d": {
                position: "relative",
                transformStyle: "preserve-3d",
                transition: "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                boxShadow: "0 20px 60px -12px rgba(0,0,0,0.15), 0 8px 24px -8px rgba(0,0,0,0.10)",
                "&:hover": {
                    transform: "translateZ(40px) rotateX(4deg) rotateY(-4deg) scale(1.02)",
                    boxShadow: "0 30px 80px -16px rgba(0,0,0,0.25), 0 12px 32px -8px rgba(0,0,0,0.15)",
                },
            },
            "card-3d-lift": {
                position: "relative",
                transformStyle: "preserve-3d",
                transition: "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                boxShadow: "0 20px 60px -12px rgba(0,0,0,0.15), 0 8px 24px -8px rgba(0,0,0,0.10)",
                "&:hover": {
                    transform: "translateY(-8px) translateZ(40px)",
                    boxShadow: "0 30px 80px -16px rgba(0,0,0,0.25), 0 12px 32px -8px rgba(0,0,0,0.15)",
                },
            },
            "card-3d-tilt": {
                position: "relative",
                transformStyle: "preserve-3d",
                transition: "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                "&:hover": { transform: "perspective(1000px) rotateX(6deg) rotateY(-6deg) translateZ(20px)" },
            },
            "preserve-3d": { transformStyle: "preserve-3d" },
            "backface-hidden": { backfaceVisibility: "hidden" },
            "translate-z-10": { transform: "translateZ(10px)" },
            "translate-z-20": { transform: "translateZ(20px)" },
            "translate-z-40": { transform: "translateZ(40px)" },
            "translate-z-60": { transform: "translateZ(60px)" },
            "rotate-x-4": { transform: "rotateX(4deg)" },
            "rotate-y-4": { transform: "rotateY(-4deg)" },
        });
    },
};
