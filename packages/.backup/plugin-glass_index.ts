export default {
  name: "@garursaili/plugin-glass",
  version: "1.1.0",
  prefixes: ["glass"],
  setup(api) {
    api.defineToken("glass-bg", "rgba(255, 255, 255, 0.05)");
    api.defineToken("glass-border", "rgba(255, 255, 255, 0.15)");
    
    api.addUtilities({
      "glass-card": { 
        background: "var(--glass-bg)", 
        backdropFilter: "blur(24px) saturate(180%)", 
        WebkitBackdropFilter: "blur(24px) saturate(180%)", 
        border: "1px solid var(--glass-border)", 
        borderRadius: "1rem", 
        boxShadow: "0 8px 32px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.2)",
        padding: "1.5rem"
      },
      "glass-nav": { 
        position: "sticky", top: "0", zIndex: "40", 
        background: "rgba(255, 255, 255, 0.03)", 
        backdropFilter: "blur(24px) saturate(180%)", 
        WebkitBackdropFilter: "blur(24px) saturate(180%)", 
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 4px 30px rgba(0,0,0,0.03)"
      }
    });
  },
};
