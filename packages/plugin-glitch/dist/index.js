export default {
    name: "@garursaili/plugin-glitch",
    version: "1.0.0",
    setup(api) {
        api.addUtilities({
            "glitch": { position: "relative", color: "#fff", "&::before, &::after": { content: "attr(data-text)", position: "absolute", top: "0", left: "0", width: "100%", height: "100%" }, "&::before": { color: "#00ffff", animation: "garur-glitch-1 2s infinite linear alternate-reverse", clipPath: "inset(0 0 60% 0)" }, "&::after": { color: "#ff00ff", animation: "garur-glitch-2 2s infinite linear alternate-reverse", clipPath: "inset(60% 0 0 0)" } },
            "glitch-text": { animation: "garur-glitch-skew 3s infinite" },
            "glitch-rgb": { textShadow: "2px 0 #ff0000, -2px 0 #00ffff" },
        });
        api.addKeyframes("garur-glitch-1", "0%,100%{clip-path:inset(20% 0 40% 0)}20%{clip-path:inset(60% 0 10% 0)}40%{clip-path:inset(40% 0 40% 0)}60%{clip-path:inset(80% 0 5% 0)}80%{clip-path:inset(10% 0 70% 0)}");
        api.addKeyframes("garur-glitch-2", "0%,100%{clip-path:inset(60% 0 10% 0)}20%{clip-path:inset(10% 0 80% 0)}40%{clip-path:inset(30% 0 50% 0)}60%{clip-path:inset(5% 0 85% 0)}80%{clip-path:inset(70% 0 20% 0)}");
        api.addKeyframes("garur-glitch-skew", "0%,100%{transform:skew(0)}20%{transform:skew(-2deg)}40%{transform:skew(1deg)}60%{transform:skew(-1deg)}80%{transform:skew(2deg)}");
    },
};
