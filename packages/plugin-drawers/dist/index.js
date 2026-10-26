export default {
    name: "@garursaili/plugin-drawers",
    version: "2.0.0",
    setup(api) {
        const base = {
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(40px) saturate(180%)",
            WebkitBackdropFilter: "blur(40px) saturate(180%)",
            zIndex: "60",
            transition: "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        };
        api.addUtilities({
            "drawer-left": { ...base, position: "fixed", top: "0", bottom: "0", left: "0", width: "22rem", maxWidth: "90vw", borderRight: "1px solid var(--garur-border-subtle)", boxShadow: "0 0 60px rgba(0,0,0,0.08)", transform: "translateX(-100%)", "&.open": { transform: "translateX(0)" } },
            "drawer-right": { ...base, position: "fixed", top: "0", bottom: "0", right: "0", width: "22rem", maxWidth: "90vw", borderLeft: "1px solid var(--garur-border-subtle)", boxShadow: "0 0 60px rgba(0,0,0,0.08)", transform: "translateX(100%)", "&.open": { transform: "translateX(0)" } },
            "drawer-top": { ...base, position: "fixed", top: "0", left: "0", right: "0", height: "auto", maxHeight: "80vh", borderBottom: "1px solid var(--garur-border-subtle)", boxShadow: "0 20px 60px rgba(0,0,0,0.08)", transform: "translateY(-100%)", "&.open": { transform: "translateY(0)" } },
            "drawer-bottom": { ...base, position: "fixed", bottom: "0", left: "0", right: "0", height: "auto", maxHeight: "80vh", borderTop: "1px solid var(--garur-border-subtle)", boxShadow: "0 -20px 60px rgba(0,0,0,0.08)", transform: "translateY(100%)", "&.open": { transform: "translateY(0)" } },
        });
    },
};
