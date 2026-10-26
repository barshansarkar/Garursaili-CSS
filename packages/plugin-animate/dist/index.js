const KF = {
    "fade-in": "from{opacity:0}to{opacity:1}",
    "fade-out": "from{opacity:1}to{opacity:0}",
    "fade-in-up": "from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}",
    "fade-in-down": "from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:none}",
    "fade-in-left": "from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:none}",
    "fade-in-right": "from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:none}",
    "slide-in-up": "from{transform:translateY(100%)}to{transform:none}",
    "slide-in-down": "from{transform:translateY(-100%)}to{transform:none}",
    "slide-in-left": "from{transform:translateX(-100%)}to{transform:none}",
    "slide-in-right": "from{transform:translateX(100%)}to{transform:none}",
    "slide-out-up": "from{transform:none}to{transform:translateY(-100%)}",
    "slide-out-down": "from{transform:none}to{transform:translateY(100%)}",
    "zoom-in": "from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}",
    "zoom-out": "from{opacity:1;transform:scale(1)}to{opacity:0;transform:scale(0.95)}",
    "pop": "0%{transform:scale(1)}50%{transform:scale(1.1)}100%{transform:scale(1)}",
    "bounce-in": "0%{opacity:0;transform:scale(0.3)}50%{opacity:1;transform:scale(1.05)}70%{transform:scale(0.9)}100%{transform:scale(1)}",
    "bounce": "0%,100%{transform:translateY(-25%);animation-timing-function:cubic-bezier(0.8,0,1,1)}50%{transform:none;animation-timing-function:cubic-bezier(0,0,0.2,1)}",
    "shake": "0%,100%{transform:translateX(0)}10%,30%,50%,70%,90%{transform:translateX(-6px)}20%,40%,60%,80%{transform:translateX(6px)}",
    "wiggle": "0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}",
    "swing": "20%{transform:rotate(15deg)}40%{transform:rotate(-10deg)}60%{transform:rotate(5deg)}80%{transform:rotate(-5deg)}100%{transform:rotate(0)}",
    "spin": "to{transform:rotate(360deg)}",
    "ping": "75%,100%{transform:scale(2);opacity:0}",
    "pulse": "50%{opacity:0.5}",
    "heartbeat": "0%,100%{transform:scale(1)}14%{transform:scale(1.3)}28%{transform:scale(1)}42%{transform:scale(1.3)}70%{transform:scale(1)}",
    "float": "0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}",
    "float-slow": "0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(20px,-30px) scale(1.05)}",
    "breathe": "0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.03);opacity:0.9}",
    "shimmer": "0%{background-position:200% 0}100%{background-position:-200% 0}",
    "marquee": "0%{transform:translateX(0)}100%{transform:translateX(-50%)}",
    "gradient-shift": "0%,100%{background-position:0% 50%}50%{background-position:100% 50%}",
    "scan": "0%,100%{transform:translateY(-100%);opacity:0}50%{transform:translateY(100vh);opacity:1}",
    "aurora": "0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(20px,-20px) scale(1.05)}66%{transform:translate(-15px,15px) scale(0.98)}",
    "glow-pulse": "0%,100%{box-shadow:0 0 20px -8px currentColor}50%{box-shadow:0 0 40px -4px currentColor}",
    "blink": "0%,100%{opacity:1}50%{opacity:0}",
};
export default {
    name: "@garursaili/plugin-animate",
    version: "2.0.0",
    setup(api) {
        const utils = {};
        for (const [name, body] of Object.entries(KF)) {
            api.addKeyframes("garur-" + name, body);
            let dur = "600ms", timing = "cubic-bezier(0.16, 1, 0.3, 1)", iter = "", fill = "";
            if (name === "fade-out" || name.startsWith("slide-out") || name === "zoom-out") {
                timing = "cubic-bezier(0.4, 0, 1, 1)";
                fill = " forwards";
            }
            else if (name === "spin") {
                dur = "1s";
                timing = "linear";
                iter = " infinite";
            }
            else if (name === "ping") {
                dur = "1s";
                timing = "cubic-bezier(0,0,0.2,1)";
                iter = " infinite";
            }
            else if (name === "pulse") {
                dur = "2s";
                timing = "cubic-bezier(0.4,0,0.6,1)";
                iter = " infinite";
            }
            else if (name === "bounce") {
                dur = "1s";
                iter = " infinite";
            }
            else if (name === "float") {
                dur = "4s";
                timing = "ease-in-out";
                iter = " infinite";
            }
            else if (name === "float-slow") {
                dur = "12s";
                timing = "ease-in-out";
                iter = " infinite";
            }
            else if (name === "breathe") {
                dur = "3s";
                timing = "ease-in-out";
                iter = " infinite";
            }
            else if (name === "marquee") {
                dur = "40s";
                timing = "linear";
                iter = " infinite";
            }
            else if (name === "shimmer") {
                dur = "2s";
                timing = "linear";
                iter = " infinite";
            }
            else if (name === "gradient-shift") {
                dur = "8s";
                timing = "ease";
                iter = " infinite";
            }
            else if (name === "aurora") {
                dur = "20s";
                timing = "ease-in-out";
                iter = " infinite";
            }
            else if (name === "scan") {
                dur = "3s";
                timing = "ease-in-out";
                iter = " infinite";
            }
            else if (name === "blink") {
                dur = "1.06s";
                timing = "step-end";
                iter = " infinite";
            }
            else if (name === "shake" || name === "wiggle" || name === "swing") {
                dur = "1s";
                timing = "ease-in-out";
                iter = " infinite";
            }
            else if (name === "heartbeat") {
                dur = "1.5s";
                timing = "ease-in-out";
                iter = " infinite";
            }
            else if (name === "glow-pulse") {
                dur = "2s";
                timing = "ease-in-out";
                iter = " infinite";
            }
            else if (name === "pop" || name === "bounce-in") {
                dur = "600ms";
                timing = "cubic-bezier(0.34, 1.56, 0.64, 1)";
            }
            utils["animate-" + name] = "animation:garur-" + name + " " + dur + " " + timing + iter + fill;
        }
        for (const ms of [75, 100, 150, 200, 300, 400, 500, 700, 1000, 1500, 2000]) {
            utils["anim-dur-" + ms] = "animation-duration:" + ms + "ms";
            utils["anim-delay-" + ms] = "animation-delay:" + ms + "ms";
        }
        utils["anim-forwards"] = "animation-fill-mode:forwards";
        utils["anim-both"] = "animation-fill-mode:both";
        utils["anim-paused"] = "animation-play-state:paused";
        utils["anim-running"] = "animation-play-state:running";
        utils["animate-pause"] = { animationPlayState: "running", "&:hover": { animationPlayState: "paused" } };
        api.addUtilities(utils);
    },
};
