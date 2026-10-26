export default {
  name: "@garursaili/plugin-neon",
  version: "1.1.0",
  prefixes: ["glow-", "text-glow-", "border-neon-", "bg-neon-", "hover-glow-"],
  setup(api) {
    api.defineToken("neon-iris", "#8657f7");
    api.defineToken("neon-pink", "#e54cb5");
    api.defineToken("neon-cyan", "#1a8ade");
    
    const COLORS = { iris: "var(--neon-iris)", pink: "var(--neon-pink)", cyan: "var(--neon-cyan)" };
    const utils = {};
    
    for (const [name, color] of Object.entries(COLORS)) {
      // Elegant, layered box-shadow instead of a single hard blur
      utils["glow-" + name] = { 
        boxShadow: `0 0 20px -3px ${color}, 0 0 40px -10px ${color}, inset 0 0 10px -5px ${color}` 
      };
      utils["text-glow-" + name] = { 
        textShadow: `0 0 12px color-mix(in oklab, ${color} 60%, transparent), 0 0 24px ${color}` 
      };
      utils["border-neon-" + name] = { 
        border: `1px solid ${color}`, 
        boxShadow: `0 0 15px -2px ${color}, inset 0 0 10px -2px ${color}` 
      };
    }
    api.addUtilities(utils);
  },
};
