export default {
  name: "@garursaili/plugin-3d",
  version: "1.1.0",
  setup(api) {
    api.addUtilities({
      "scene-3d": { perspective: "1200px", perspectiveOrigin: "center" },
      "card-3d": { 
        position: "relative", 
        transformStyle: "preserve-3d", 
        transition: "transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1)", // ✨ Spring easing
        boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)",
        "&:hover": { 
          transform: "translateZ(30px) rotateX(4deg) rotateY(-4deg) scale(1.02)",
          boxShadow: "0 20px 40px -10px rgba(0,0,0,0.2)"
        } 
      },
      "preserve-3d": { transformStyle: "preserve-3d" }
    });
  },
};
