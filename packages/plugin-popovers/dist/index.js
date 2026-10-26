export default {
    name: "@garursaili/plugin-popovers",
    version: "2.0.0",
    setup(api) {
        api.addUtilities({
            popover: {
                position: "absolute",
                background: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(40px) saturate(180%)",
                WebkitBackdropFilter: "blur(40px) saturate(180%)",
                border: "1px solid var(--garur-border-subtle)",
                borderRadius: "1rem",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6), 0 1px 2px rgba(0,0,0,0.04), 0 16px 40px -8px rgba(0,0,0,0.14)",
                padding: "1rem",
                zIndex: "50", minWidth: "12rem",
            },
            "popover-top": { positionAnchor: "--anchor", top: "anchor(bottom)", left: "anchor(center)", translate: "-50% 0.5rem" },
            "popover-bottom": { positionAnchor: "--anchor", bottom: "anchor(top)", left: "anchor(center)", translate: "-50% -0.5rem" },
            "popover-left": { positionAnchor: "--anchor", right: "anchor(left)", top: "anchor(center)", translate: "-0.5rem -50%" },
            "popover-right": { positionAnchor: "--anchor", left: "anchor(right)", top: "anchor(center)", translate: "0.5rem -50%" },
            "popover-anchor": { anchorName: "--anchor" },
        });
    },
};
