export default {
    name: "@garursaili/plugin-command-palette",
    version: "2.0.0",
    setup(api) {
        api.addUtilities({
            "command-palette": {
                position: "fixed", top: "18%", left: "50%",
                transform: "translateX(-50%)",
                width: "92%", maxWidth: "40rem",
                background: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(40px) saturate(180%)",
                WebkitBackdropFilter: "blur(40px) saturate(180%)",
                border: "1px solid rgba(255,255,255,0.4)",
                borderRadius: "1.25rem",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6), 0 2px 4px rgba(0,0,0,0.04), 0 24px 60px -12px rgba(0,0,0,0.25), 0 64px 128px -32px rgba(0,0,0,0.30)",
                overflow: "hidden",
                zIndex: "100",
                animation: "cmdp-pop 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
            },
            "command-input": {
                width: "100%", padding: "1.125rem 1.375rem",
                fontSize: "1rem", letterSpacing: "-0.011em",
                background: "transparent", border: "none",
                borderBottom: "1px solid var(--garur-border-subtle)",
                outline: "none", color: "var(--garur-fg)",
            },
            "command-list": { maxHeight: "24rem", overflowY: "auto", padding: "0.5rem" },
            "command-item": {
                display: "flex", alignItems: "center", gap: "0.75rem",
                padding: "0.75rem 1rem", borderRadius: "0.625rem",
                cursor: "pointer", transition: "background 120ms ease",
                "&:hover": { background: "var(--garur-surface-muted)" },
            },
            "command-item-active": { background: "color-mix(in oklab, var(--garur-primary) 12%, transparent)", color: "var(--garur-primary)" },
            "command-empty": { padding: "2rem", textAlign: "center", color: "var(--garur-muted)" },
        });
        api.addKeyframes("cmdp-pop", "0%{opacity:0;transform:translateX(-50%) scale(0.96)}100%{opacity:1;transform:translateX(-50%) scale(1)}");
    },
};
