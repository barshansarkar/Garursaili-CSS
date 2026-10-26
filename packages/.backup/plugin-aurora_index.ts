
export default {
  name: "@garursaili/plugin-aurora",
  version: "1.0.0",
  setup(api) {
    api.defineToken("aurora-1", "#8657f7");
    api.defineToken("aurora-2", "#e54cb5");
    api.defineToken("aurora-3", "#1a8ade");

    api.addUtilities({
      "aurora-bg": { position: "relative", isolation: "isolate", overflow: "hidden" },
      "aurora-layer": { position: "absolute", inset: "-20%", zIndex: "-1", background: "radial-gradient(ellipse 80% 60% at 20% 30%, color-mix(in oklab, var(--aurora-1) 40%, transparent), transparent 60%), radial-gradient(ellipse 60% 50% at 80% 70%, color-mix(in oklab, var(--aurora-2) 35%, transparent), transparent 60%), radial-gradient(ellipse 70% 40% at 50% 100%, color-mix(in oklab, var(--aurora-3) 30%, transparent), transparent 60%)", filter: "blur(60px)", opacity: "0.7" },
      "aurora-layer-2": { position: "absolute", inset: "-20%", zIndex: "-1", background: "radial-gradient(ellipse 60% 50% at 80% 20%, color-mix(in oklab, var(--aurora-3) 35%, transparent), transparent 60%), radial-gradient(ellipse 80% 40% at 30% 70%, color-mix(in oklab, var(--aurora-1) 30%, transparent), transparent 60%)", filter: "blur(80px)", opacity: "0.5" },
      "aurora-orb-1": { position: "absolute", width: "500px", height: "500px", borderRadius: "9999px", background: "var(--aurora-1)", filter: "blur(100px)", opacity: "0.35", top: "-10%", left: "10%", pointerEvents: "none" },
      "aurora-orb-2": { position: "absolute", width: "400px", height: "400px", borderRadius: "9999px", background: "var(--aurora-2)", filter: "blur(100px)", opacity: "0.28", top: "20%", right: "5%", pointerEvents: "none" },
      "aurora-orb-3": { position: "absolute", width: "350px", height: "350px", borderRadius: "9999px", background: "var(--aurora-3)", filter: "blur(100px)", opacity: "0.25", bottom: "10%", left: "30%", pointerEvents: "none" },
      "aurora-hero": { position: "relative", isolation: "isolate", overflow: "hidden", minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "6rem 1.5rem", textAlign: "center" },
      "aurora-static": { background: "radial-gradient(ellipse 80% 60% at 20% 0%, color-mix(in oklab, var(--aurora-1) 25%, transparent), transparent 60%), radial-gradient(ellipse 60% 50% at 80% 20%, color-mix(in oklab, var(--aurora-2) 20%, transparent), transparent 60%), radial-gradient(ellipse 70% 40% at 50% 100%, color-mix(in oklab, var(--aurora-3) 18%, transparent), transparent 60%)" },
      "aurora-vignette": { maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)", WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)" },
    });

    api.addKeyframes("garur-aurora", "0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(30px,-30px) scale(1.08)}66%{transform:translate(-20px,20px) scale(0.96)}");
    api.addUtility("animate-aurora", "animation:garur-aurora 20s ease-in-out infinite");
  },
};
