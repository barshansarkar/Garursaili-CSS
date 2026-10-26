export default {
  name: "@garursaili/plugin-container-queries",
  version: "1.0.0",
  setup(api) {
    api.addUtilities({
      "cq": { containerType: "inline-size" },
      "cq-size": { containerType: "size" },
      "cq-normal": { containerType: "normal" },
      "cq-main": { containerType: "inline-size", containerName: "main" },
      "cq-sidebar": { containerType: "inline-size", containerName: "sidebar" },
      "cq-card": { containerType: "inline-size", containerName: "card" },
    });
  },
};
