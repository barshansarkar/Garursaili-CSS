export default {
  name: "@garursaili/plugin-video-wrapper",
  version: "1.0.0",
  setup(api) {
    api.addUtilities({
      "video-16x9": { position: "relative", width: "100%", aspectRatio: "16/9", background: "#000", borderRadius: "0.5rem", overflow: "hidden", "& > iframe, & > video": { position: "absolute", inset: "0", width: "100%", height: "100%", border: "none" } },
      "video-4x3": { position: "relative", width: "100%", aspectRatio: "4/3", background: "#000", borderRadius: "0.5rem", overflow: "hidden", "& > iframe, & > video": { position: "absolute", inset: "0", width: "100%", height: "100%", border: "none" } },
      "video-1x1": { position: "relative", width: "100%", aspectRatio: "1", background: "#000", borderRadius: "0.5rem", overflow: "hidden", "& > iframe, & > video": { position: "absolute", inset: "0", width: "100%", height: "100%", border: "none" } },
      "video-9x16": { position: "relative", width: "100%", aspectRatio: "9/16", background: "#000", borderRadius: "0.5rem", overflow: "hidden", "& > iframe, & > video": { position: "absolute", inset: "0", width: "100%", height: "100%", border: "none" } },
      "video-21x9": { position: "relative", width: "100%", aspectRatio: "21/9", background: "#000", borderRadius: "0.5rem", overflow: "hidden", "& > iframe, & > video": { position: "absolute", inset: "0", width: "100%", height: "100%", border: "none" } },
    });
  },
};
