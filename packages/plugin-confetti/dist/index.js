export default {
    name: "@garursaili/plugin-confetti",
    version: "1.0.0",
    setup(api) {
        api.addUtilities({
            "confetti": { position: "relative", overflow: "hidden" },
            "confetti-piece": { position: "absolute", width: "0.5rem", height: "1rem", borderRadius: "2px", animation: "garur-confetti 3s ease-out forwards", pointerEvents: "none" },
            "confetti-burst": { animation: "garur-confetti-burst 1s ease-out" },
        });
        api.addKeyframes("garur-confetti", "0%{transform:translate(0,0) rotate(0);opacity:1}100%{transform:translate(var(--tx,0),100vh) rotate(var(--rot,720deg));opacity:0}");
        api.addKeyframes("garur-confetti-burst", "0%{transform:scale(0);opacity:0}50%{transform:scale(1.1);opacity:1}100%{transform:scale(1);opacity:1}");
    },
};
