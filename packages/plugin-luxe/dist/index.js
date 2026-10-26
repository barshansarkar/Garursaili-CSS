export default {
    name: "@garursaili/plugin-luxe",
    version: "2.0.0",
    description: "Apple liquid glass, titanium chrome, subtle holographic",
    prefixes: ["liquid-", "chrome-", "holo-", "aurora-", "card-luxe", "btn-luxe", "tilt-", "pop-", "lift-", "reveal-", "shine-", "focus-glow"],
    setup(api) {
        // ── Design tokens ──
        // Adaptive: color-mix means it works on light AND dark backgrounds
        api.defineToken("lx-glass-1", "color-mix(in oklab, white 4%, transparent)");
        api.defineToken("lx-glass-2", "color-mix(in oklab, white 7%, transparent)");
        api.defineToken("lx-glass-3", "color-mix(in oklab, white 11%, transparent)");
        api.defineToken("lx-glass-4", "color-mix(in oklab, white 17%, transparent)");
        api.defineToken("lx-glass-5", "color-mix(in oklab, white 24%, transparent)");
        // Specular highlight (the catch light at the top edge)
        api.defineToken("lx-specular", "rgba(255,255,255,0.42)");
        api.defineToken("lx-specular-soft", "rgba(255,255,255,0.22)");
        // Bottom reflected light (suggests depth/thickness)
        api.defineToken("lx-reflect", "rgba(0,0,0,0.08)");
        // Chromatic aberration (glass refracts light into pink/cyan at edges)
        api.defineToken("lx-chroma-warm", "rgba(255,140,200,0.10)");
        api.defineToken("lx-chroma-cool", "rgba(140,210,255,0.10)");
        // Noise texture (kills banding, adds tactile grain)
        api.defineToken("lx-noise", `url("data:image/svg+xml,%3Csvg viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`);
        // ── Keyframes ──
        api.addKeyframes("lx-holo-shift", "0%,100%{background-position:0% 50%}50%{background-position:100% 50%}");
        api.addKeyframes("lx-chrome-shine", "0%{background-position:0% 50%}100%{background-position:200% 50%}");
        api.addKeyframes("lx-aurora-float-1", "0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(60px,-50px) scale(1.15)}");
        api.addKeyframes("lx-aurora-float-2", "0%,100%{transform:translate(0,0) scale(1.05)}50%{transform:translate(-50px,40px) scale(0.9)}");
        api.addKeyframes("lx-aurora-float-3", "0%,100%{transform:translate(0,0) scale(0.95)}50%{transform:translate(40px,-60px) scale(1.1)}");
        api.addKeyframes("lx-aurora-float-4", "0%,100%{transform:translate(0,0) scale(1.02)}50%{transform:translate(-40px,-40px) scale(0.95)}");
        api.addKeyframes("lx-silk-flow", "0%,100%{background-position:0% 0%}50%{background-position:100% 100%}");
        api.addKeyframes("lx-shine-sweep", "0%{left:-100%}100%{left:200%}");
        // ═══════════════════════════════════════════════════════════
        // THE CORE RECIPE — every liquid-glass-* class builds on this
        // ═══════════════════════════════════════════════════════════
        const LG = {
            position: "relative",
            isolation: "isolate",
            // the "liquid" formula — 40px blur + saturation + brightness compensation
            backdropFilter: "blur(40px) saturate(180%) brightness(1.05)",
            WebkitBackdropFilter: "blur(40px) saturate(180%) brightness(1.05)",
            // NO visible border — 5-layer shadow stack does the work
            boxShadow: [
                "inset 0 1px 0 0 var(--lx-specular)", // top specular catch light
                "inset 0 -1px 0 0 var(--lx-reflect)", // bottom reflected light
                "inset 1px 0 0 0 var(--lx-chroma-warm)", // pink chromatic fringe (left)
                "inset -1px 0 0 0 var(--lx-chroma-cool)", // cyan chromatic fringe (right)
                "inset 0 0 32px -16px var(--lx-specular-soft)", // inner glow
                "0 1px 2px rgba(0,0,0,0.04)", // ambient
                "0 4px 8px rgba(0,0,0,0.04)", // contact
                "0 16px 32px rgba(0,0,0,0.06)", // diffuse
                "0 32px 64px -16px rgba(0,0,0,0.10)", // deep
            ].join(", "),
            // fading gradient border (masked to 1px)
            "&::before": {
                content: "''", position: "absolute", inset: "0", borderRadius: "inherit",
                padding: "1px",
                background: "linear-gradient(160deg, var(--lx-specular) 0%, transparent 25%, transparent 75%, var(--lx-reflect) 100%)",
                WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor", maskComposite: "exclude",
                pointerEvents: "none",
            },
            // noise grain
            "&::after": {
                content: "''", position: "absolute", inset: "0", borderRadius: "inherit",
                pointerEvents: "none", opacity: "0.04",
                backgroundImage: "var(--lx-noise)",
            },
        };
        api.addUtilities({
            // ═══════════════════════════════════════════════════════════
            // LIQUID GLASS — 5 Apple material thicknesses + variants
            // ═══════════════════════════════════════════════════════════
            "liquid-glass-ultra-thin": { ...LG, background: "var(--lx-glass-1)", borderRadius: "1.25rem" },
            "liquid-glass-thin": { ...LG, background: "var(--lx-glass-2)", borderRadius: "1.25rem" },
            "liquid-glass": { ...LG, background: "var(--lx-glass-3)", borderRadius: "1.25rem" },
            "liquid-glass-thick": { ...LG, background: "var(--lx-glass-4)", borderRadius: "1.25rem" },
            "liquid-glass-ultra-thick": { ...LG, background: "var(--lx-glass-5)", borderRadius: "1.25rem" },
            // Layout variants
            "liquid-glass-card": {
                ...LG,
                background: "var(--lx-glass-3)",
                borderRadius: "1.5rem",
                padding: "1.75rem",
            },
            "liquid-glass-panel": {
                ...LG,
                background: "var(--lx-glass-3)",
                backdropFilter: "blur(60px) saturate(200%) brightness(1.05)",
                WebkitBackdropFilter: "blur(60px) saturate(200%) brightness(1.05)",
                borderRadius: "1.75rem",
                padding: "2.5rem",
            },
            "liquid-glass-pill": {
                ...LG,
                display: "inline-flex", alignItems: "center", gap: "0.375rem",
                padding: "0.375rem 0.875rem",
                borderRadius: "9999px",
                fontSize: "0.75rem", fontWeight: "500",
            },
            "liquid-glass-nav": {
                position: "sticky", top: "0", zIndex: "50",
                background: "color-mix(in oklab, white 4%, transparent)",
                backdropFilter: "blur(40px) saturate(200%) brightness(1.02)",
                WebkitBackdropFilter: "blur(40px) saturate(200%) brightness(1.02)",
                boxShadow: "inset 0 -1px 0 0 rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.06)",
            },
            "liquid-glass-overlay": {
                position: "fixed", inset: "0",
                background: "rgba(0,0,0,0.45)",
                backdropFilter: "blur(20px) saturate(140%)",
                WebkitBackdropFilter: "blur(20px) saturate(140%)",
                zIndex: "100",
            },
            // Specialty finishes
            "liquid-glass-dark": {
                ...LG,
                background: "color-mix(in oklab, #0a0a0d 62%, transparent)",
                backdropFilter: "blur(40px) saturate(180%) brightness(0.95)",
                WebkitBackdropFilter: "blur(40px) saturate(180%) brightness(0.95)",
                boxShadow: [
                    "inset 0 1px 0 0 rgba(255,255,255,0.14)",
                    "inset 0 -1px 0 0 rgba(0,0,0,0.40)",
                    "inset 0 0 32px -16px rgba(255,255,255,0.08)",
                    "0 1px 2px rgba(0,0,0,0.20)",
                    "0 16px 32px rgba(0,0,0,0.40)",
                    "0 32px 64px -16px rgba(0,0,0,0.55)",
                ].join(", "),
                borderRadius: "1.25rem",
                color: "#f5f5f7",
            },
            "liquid-glass-tint": {
                ...LG,
                background: "color-mix(in oklab, #8657f7 8%, transparent)",
                borderRadius: "1.25rem",
            },
            "liquid-glass-vibrant": {
                ...LG,
                background: "var(--lx-glass-3)",
                backdropFilter: "blur(40px) saturate(220%) brightness(1.08)",
                WebkitBackdropFilter: "blur(40px) saturate(220%) brightness(1.08)",
                borderRadius: "1.25rem",
            },
            "liquid-glass-chrome": {
                ...LG,
                background: "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 40%, rgba(255,255,255,0.02) 60%, rgba(255,255,255,0.08) 100%)",
                borderRadius: "1.25rem",
            },
            // ═══════════════════════════════════════════════════════════
            // CHROME — brushed titanium / Pro hardware
            // ═══════════════════════════════════════════════════════════
            "chrome-surface": {
                background: "repeating-linear-gradient(90deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 3px)," +
                    "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.30) 100%)," +
                    "linear-gradient(180deg, #2a2a30 0%, #14141a 100%)",
                boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.18), inset 0 -1px 0 0 rgba(0,0,0,0.55), 0 1px 2px rgba(0,0,0,0.20), 0 16px 32px rgba(0,0,0,0.30)",
                color: "#e8e8ee",
            },
            "chrome-text": {
                background: "linear-gradient(180deg, #ffffff 0%, #d4d4d8 25%, #71717a 50%, #d4d4d8 75%, #ffffff 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
            },
            "chrome-border": {
                border: "1px solid transparent",
                background: "linear-gradient(var(--garur-surface, #0b0b0e), var(--garur-surface, #0b0b0e)) padding-box," +
                    "linear-gradient(180deg, rgba(255,255,255,0.30), rgba(255,255,255,0.05) 40%, rgba(0,0,0,0.30) 100%) border-box",
            },
            "chrome-button": {
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                gap: "0.5rem", padding: "0.75rem 1.5rem",
                borderRadius: "0.75rem",
                fontWeight: "600", fontSize: "0.875rem", lineHeight: "1",
                cursor: "pointer", border: "none", color: "#e8e8ee",
                background: "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.25) 100%)," +
                    "linear-gradient(180deg, #38383f 0%, #1e1e24 100%)",
                boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.22), inset 0 -1px 0 0 rgba(0,0,0,0.45), 0 1px 2px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.25)",
                transition: "all 200ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                "&:hover": {
                    transform: "translateY(-1px)",
                    boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.30), inset 0 -1px 0 0 rgba(0,0,0,0.50), 0 4px 8px rgba(0,0,0,0.20), 0 12px 24px rgba(0,0,0,0.35)",
                },
                "&:active": { transform: "translateY(0)" },
            },
            "chrome-shine": {
                position: "relative", overflow: "hidden",
                "&::after": {
                    content: "''", position: "absolute", top: "0", left: "-100%",
                    width: "50%", height: "100%",
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
                    animation: "lx-shine-sweep 5s ease-in-out infinite",
                    pointerEvents: "none",
                },
            },
            "chrome-rim": {
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.10), inset 0 0 0 2px rgba(0,0,0,0.30), inset 0 1px 2px rgba(255,255,255,0.15), 0 8px 20px rgba(0,0,0,0.25)",
            },
            // ═══════════════════════════════════════════════════════════
            // HOLOGRAPHIC — subtle iridescence (not rainbow)
            // ═══════════════════════════════════════════════════════════
            "holo-surface": {
                background: "linear-gradient(135deg, rgba(255,107,157,0.55) 0%, rgba(192,132,252,0.45) 25%, rgba(96,165,250,0.55) 50%, rgba(52,211,153,0.45) 75%, rgba(251,191,36,0.55) 100%)",
                backgroundSize: "300% 300%",
                animation: "lx-holo-shift 8s ease infinite",
            },
            "holo-text": {
                background: "linear-gradient(135deg, #ff8ab6 0%, #c894ff 25%, #8cc0ff 50%, #6ee8b0 75%, #ffd670 100%)",
                backgroundSize: "300% 300%",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
                animation: "lx-holo-shift 6s ease infinite",
            },
            "holo-border": {
                border: "1px solid transparent",
                background: "linear-gradient(var(--garur-surface, #0b0b0e), var(--garur-surface, #0b0b0e)) padding-box," +
                    "linear-gradient(135deg, #ff8ab6, #c894ff, #8cc0ff, #6ee8b0, #ffd670) border-box",
            },
            "holo-shine": {
                position: "relative", overflow: "hidden",
                "&::after": {
                    content: "''", position: "absolute", top: "0", left: "-100%",
                    width: "50%", height: "100%",
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.20), transparent)",
                    animation: "lx-shine-sweep 4s ease-in-out infinite",
                    pointerEvents: "none",
                },
            },
            "holo-iridescent": {
                background: "linear-gradient(135deg, rgba(255,107,157,0.12), rgba(192,132,252,0.12), rgba(96,165,250,0.12), rgba(52,211,153,0.12), rgba(251,191,36,0.12))",
                backgroundSize: "300% 300%",
                animation: "lx-holo-shift 10s ease infinite",
                backdropFilter: "blur(16px) saturate(180%)",
                WebkitBackdropFilter: "blur(16px) saturate(180%)",
            },
            // ═══════════════════════════════════════════════════════════
            // AURORA — soft blurred blobs (unchanged, they were fine)
            // ═══════════════════════════════════════════════════════════
            "aurora-blob-1": { position: "absolute", width: "500px", height: "500px", borderRadius: "9999px", background: "radial-gradient(circle, rgba(134,87,247,0.7) 0%, transparent 70%)", filter: "blur(80px)", opacity: "0.5", pointerEvents: "none", animation: "lx-aurora-float-1 18s ease-in-out infinite" },
            "aurora-blob-2": { position: "absolute", width: "450px", height: "450px", borderRadius: "9999px", background: "radial-gradient(circle, rgba(229,76,181,0.6) 0%, transparent 70%)", filter: "blur(80px)", opacity: "0.45", pointerEvents: "none", animation: "lx-aurora-float-2 22s ease-in-out infinite" },
            "aurora-blob-3": { position: "absolute", width: "400px", height: "400px", borderRadius: "9999px", background: "radial-gradient(circle, rgba(26,138,222,0.6) 0%, transparent 70%)", filter: "blur(80px)", opacity: "0.4", pointerEvents: "none", animation: "lx-aurora-float-3 20s ease-in-out infinite" },
            "aurora-blob-4": { position: "absolute", width: "350px", height: "350px", borderRadius: "9999px", background: "radial-gradient(circle, rgba(245,158,0,0.5) 0%, transparent 70%)", filter: "blur(80px)", opacity: "0.35", pointerEvents: "none", animation: "lx-aurora-float-4 24s ease-in-out infinite" },
            "aurora-mesh": { background: "radial-gradient(ellipse 80% 60% at 20% 0%, color-mix(in oklab, #8657f7 25%, transparent), transparent 60%), radial-gradient(ellipse 60% 50% at 80% 20%, color-mix(in oklab, #e54cb5 20%, transparent), transparent 60%), radial-gradient(ellipse 70% 40% at 50% 100%, color-mix(in oklab, #1a8ade 18%, transparent), transparent 60%)" },
            "aurora-silk": { background: "linear-gradient(120deg, rgba(134,87,247,0.5) 0%, rgba(229,76,181,0.4) 25%, rgba(26,138,222,0.5) 50%, rgba(245,158,0,0.3) 75%, rgba(134,87,247,0.5) 100%)", backgroundSize: "400% 400%", animation: "lx-silk-flow 20s ease infinite" },
            // ═══════════════════════════════════════════════════════════
            // CARDS — Apple-style soft layered shadows, concentric radii
            // ═══════════════════════════════════════════════════════════
            "card-luxe": {
                position: "relative",
                background: "var(--garur-surface, #ffffff)",
                borderRadius: "1.5rem",
                padding: "2rem",
                border: "1px solid color-mix(in oklab, var(--garur-fg, #000) 4%, transparent)",
                boxShadow: "0 1px 2px rgba(0,0,0,0.03), 0 4px 8px rgba(0,0,0,0.03), 0 16px 32px rgba(0,0,0,0.04), 0 32px 64px -16px rgba(0,0,0,0.06)",
                color: "var(--garur-fg, #0b0b0e)",
            },
            "card-luxe-hover": {
                position: "relative",
                background: "var(--garur-surface, #ffffff)",
                borderRadius: "1.5rem", padding: "2rem",
                border: "1px solid color-mix(in oklab, var(--garur-fg, #000) 4%, transparent)",
                boxShadow: "0 1px 2px rgba(0,0,0,0.03), 0 4px 8px rgba(0,0,0,0.03), 0 16px 32px rgba(0,0,0,0.04)",
                transition: "all 400ms cubic-bezier(0.16, 1, 0.3, 1)",
                cursor: "pointer",
                "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.03), 0 16px 32px rgba(0,0,0,0.06), 0 48px 96px -16px rgba(0,0,0,0.12)",
                },
            },
            "card-luxe-glass": { ...LG, background: "var(--lx-glass-3)", borderRadius: "1.5rem", padding: "2rem" },
            "card-luxe-glow": {
                position: "relative",
                background: "var(--garur-surface, #ffffff)",
                borderRadius: "1.5rem", padding: "2rem",
                boxShadow: "0 1px 2px rgba(0,0,0,0.03), 0 16px 32px rgba(134,87,247,0.06), 0 32px 64px -16px rgba(134,87,247,0.10), inset 0 1px 0 rgba(255,255,255,0.5)",
            },
            "card-luxe-dark": {
                position: "relative",
                background: "linear-gradient(180deg, #18181b 0%, #0b0b0e 100%)",
                borderRadius: "1.5rem", padding: "2rem",
                border: "1px solid rgba(255,255,255,0.06)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04), 0 4px 8px rgba(0,0,0,0.20), 0 32px 64px -16px rgba(0,0,0,0.50)",
                color: "#f5f5f7",
            },
            "card-luxe-bordered": {
                position: "relative",
                background: "var(--garur-surface, #ffffff)",
                borderRadius: "1.5rem", padding: "2rem",
                boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
                "&::before": {
                    content: "''", position: "absolute", inset: "0", borderRadius: "inherit",
                    padding: "1px",
                    background: "linear-gradient(135deg, #8657f7 0%, #e54cb5 50%, #1a8ade 100%)",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor", maskComposite: "exclude",
                    pointerEvents: "none",
                },
            },
            "card-luxe-tilt": {
                position: "relative",
                background: "var(--garur-surface, #ffffff)",
                borderRadius: "1.5rem", padding: "2rem",
                border: "1px solid color-mix(in oklab, var(--garur-fg, #000) 4%, transparent)",
                boxShadow: "0 1px 2px rgba(0,0,0,0.03), 0 16px 32px rgba(0,0,0,0.04)",
                transformStyle: "preserve-3d",
                transition: "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 500ms ease",
                "&:hover": {
                    transform: "perspective(1200px) rotateX(4deg) rotateY(-4deg) translateZ(10px)",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.04), 0 32px 64px -16px rgba(0,0,0,0.15)",
                },
            },
            "card-luxe-spotlight": {
                position: "relative",
                background: "var(--garur-surface, #ffffff)",
                borderRadius: "1.5rem", padding: "2rem",
                border: "1px solid color-mix(in oklab, var(--garur-fg, #000) 4%, transparent)",
                boxShadow: "0 1px 2px rgba(0,0,0,0.03), 0 16px 32px rgba(0,0,0,0.04)",
                overflow: "hidden",
                "&::before": {
                    content: "''", position: "absolute", inset: "0",
                    background: "radial-gradient(600px circle at var(--mx, 50%) var(--my, 50%), rgba(134,87,247,0.10), transparent 40%)",
                    opacity: "0", transition: "opacity 400ms ease", pointerEvents: "none",
                },
                "&:hover::before": { opacity: "1" },
            },
            // ═══════════════════════════════════════════════════════════
            // BUTTONS — Apple-style, weightless, no harsh borders
            // ═══════════════════════════════════════════════════════════
            "btn-luxe": {
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                gap: "0.5rem", padding: "0.75rem 1.5rem",
                borderRadius: "0.875rem",
                fontWeight: "600", fontSize: "0.875rem", lineHeight: "1",
                cursor: "pointer", border: "none", textDecoration: "none",
                position: "relative", overflow: "hidden",
                transition: "all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
            },
            "btn-luxe-primary": {
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                gap: "0.5rem", padding: "0.75rem 1.5rem",
                borderRadius: "0.875rem",
                fontWeight: "600", fontSize: "0.875rem", lineHeight: "1",
                cursor: "pointer", border: "none", color: "white",
                background: "linear-gradient(180deg, #9565ff 0%, #7a43f0 100%)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.10), 0 4px 16px -2px rgba(134,87,247,0.35)",
                transition: "all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                "&:hover": {
                    transform: "translateY(-1px)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.30), inset 0 -1px 0 rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.10), 0 12px 28px -4px rgba(134,87,247,0.45)",
                },
                "&:active": { transform: "translateY(0) scale(0.98)" },
            },
            "btn-luxe-glass": {
                ...LG,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                gap: "0.5rem", padding: "0.75rem 1.5rem",
                borderRadius: "0.875rem",
                fontWeight: "600", fontSize: "0.875rem", lineHeight: "1",
                cursor: "pointer", color: "inherit", textDecoration: "none",
                transition: "all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                "&:hover": {
                    background: "var(--lx-glass-4)",
                    transform: "translateY(-1px)",
                },
                "&:active": { transform: "translateY(0) scale(0.98)" },
            },
            "btn-luxe-chrome": {
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                gap: "0.5rem", padding: "0.75rem 1.5rem",
                borderRadius: "0.875rem",
                fontWeight: "600", fontSize: "0.875rem", lineHeight: "1",
                cursor: "pointer", border: "none", color: "#e8e8ee",
                background: "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.25) 100%)," +
                    "linear-gradient(180deg, #38383f 0%, #1e1e24 100%)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.45), 0 1px 2px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.25)",
                transition: "all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                "&:hover": { transform: "translateY(-1px)" },
            },
            "btn-luxe-holo": {
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                gap: "0.5rem", padding: "0.75rem 1.5rem",
                borderRadius: "0.875rem",
                fontWeight: "600", fontSize: "0.875rem", lineHeight: "1",
                cursor: "pointer", border: "none", color: "white",
                background: "linear-gradient(135deg, #ff8ab6 0%, #c894ff 25%, #8cc0ff 50%, #6ee8b0 75%, #ffd670 100%)",
                backgroundSize: "300% 300%",
                animation: "lx-holo-shift 8s ease infinite",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.10), 0 4px 16px -2px rgba(192,132,252,0.40)",
                transition: "all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                "&:hover": { transform: "translateY(-1px)" },
            },
            "btn-luxe-glow": {
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                gap: "0.5rem", padding: "0.75rem 1.5rem",
                borderRadius: "0.875rem",
                fontWeight: "600", fontSize: "0.875rem", lineHeight: "1",
                cursor: "pointer", color: "#8657f7",
                background: "var(--garur-surface, #ffffff)",
                border: "1px solid rgba(134,87,247,0.20)",
                boxShadow: "0 0 0 0 rgba(134,87,247,0.20), inset 0 1px 0 rgba(255,255,255,0.6)",
                transition: "all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                "&:hover": { boxShadow: "0 0 24px -4px rgba(134,87,247,0.35), inset 0 1px 0 rgba(255,255,255,0.6)" },
            },
            "btn-luxe-shine": {
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                gap: "0.5rem", padding: "0.75rem 1.5rem",
                borderRadius: "0.875rem",
                fontWeight: "600", fontSize: "0.875rem", lineHeight: "1",
                cursor: "pointer", border: "none", color: "white",
                background: "linear-gradient(180deg, #9565ff 0%, #7a43f0 100%)",
                position: "relative", overflow: "hidden",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.15), 0 4px 16px -2px rgba(134,87,247,0.35)",
                transition: "all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                "&::after": {
                    content: "''", position: "absolute", top: "0", left: "-100%",
                    width: "60%", height: "100%",
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.30), transparent)",
                    transform: "skewX(-20deg)",
                    animation: "lx-shine-sweep 4s ease-in-out infinite",
                    pointerEvents: "none",
                },
            },
            "btn-luxe-icon": {
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: "2.5rem", height: "2.5rem",
                borderRadius: "0.75rem",
                cursor: "pointer",
                background: "var(--garur-surface, #ffffff)",
                color: "var(--garur-fg, #374151)",
                border: "1px solid color-mix(in oklab, var(--garur-fg, #000) 5%, transparent)",
                boxShadow: "0 1px 2px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.5)",
                transition: "all 200ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                "&:hover": {
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.5)",
                },
            },
            // ═══════════════════════════════════════════════════════════
            // MICRO-INTERACTIONS (polished)
            // ═══════════════════════════════════════════════════════════
            "tilt-soft": {
                transition: "transform 400ms cubic-bezier(0.16, 1, 0.3, 1)",
                "&:hover": { transform: "perspective(1200px) rotateX(2deg) rotateY(-2deg) translateZ(6px)" },
            },
            "tilt-hard": {
                transition: "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                "&:hover": { transform: "perspective(1000px) rotateX(6deg) rotateY(-6deg) translateZ(16px)" },
            },
            "pop-glow": {
                transition: "all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                "&:hover": { transform: "scale(1.03)" },
            },
            "lift-shadow": {
                transition: "all 400ms cubic-bezier(0.16, 1, 0.3, 1)",
                "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.04), 0 24px 48px -12px rgba(0,0,0,0.20)",
                },
            },
            "reveal-hover": {
                position: "relative", overflow: "hidden",
                "&::before": {
                    content: "''", position: "absolute", inset: "0",
                    background: "linear-gradient(135deg, rgba(134,87,247,0.06), rgba(229,76,181,0.06))",
                    opacity: "0", transition: "opacity 400ms ease", pointerEvents: "none",
                },
                "&:hover::before": { opacity: "1" },
            },
            "shine-sweep": {
                position: "relative", overflow: "hidden",
                "&::after": {
                    content: "''", position: "absolute", top: "0", left: "-100%",
                    width: "50%", height: "100%",
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
                    transform: "skewX(-20deg)",
                    animation: "lx-shine-sweep 5s ease-in-out infinite",
                    pointerEvents: "none",
                },
            },
            "focus-glow": {
                "&:focus-visible": {
                    outline: "2px solid #8657f7",
                    outlineOffset: "2px",
                    boxShadow: "0 0 0 4px color-mix(in oklab, #8657f7 22%, transparent)",
                },
            },
        });
    },
};
