export default {
  name: "@garursaili/plugin-matrix",
  version: "1.0.0",
  setup(api) {
    api.addUtilities({
      "matrix-bg": { background: "#000", color: "#0f0", fontFamily: "ui-monospace, monospace", position: "relative", overflow: "hidden" },
      "matrix-rain": { position: "absolute", top: "0", left: "0", right: "0", bottom: "0", background: "linear-gradient(to bottom, transparent, rgba(0,255,0,0.03) 50%, transparent)", animation: "garur-matrix-scroll 2s linear infinite", pointerEvents: "none" },
      "matrix-text": { color: "#0f0", textShadow: "0 0 4px #0f0, 0 0 8px #0f0", fontFamily: "ui-monospace, monospace" },
      "matrix-cursor": { display: "inline-block", width: "0.5em", height: "1em", background: "#0f0", verticalAlign: "text-bottom", animation: "garur-matrix-blink 1s step-end infinite" },
    });
    api.addKeyframes("garur-matrix-scroll", "from{transform:translateY(-100%)}to{transform:translateY(100%)}");
    api.addKeyframes("garur-matrix-blink", "0%,100%{opacity:1}50%{opacity:0}");
  },
};
