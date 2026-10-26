export default {
    name: "@garursaili/plugin-shadcn-compat",
    version: "1.1.0",
    setup(api) {
        // (Keep your existing token setup here, just replacing the components)
        api.addComponent("shadcn-button", {
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", whiteSpace: "nowrap",
            borderRadius: "0.5rem", fontSize: "0.875rem", fontWeight: "500", height: "2.5rem", padding: "0 1rem",
            backgroundColor: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))",
            transition: "all 150ms cubic-bezier(0.16, 1, 0.3, 1)", cursor: "pointer", border: "none",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.15)",
            "&:hover": { backgroundColor: "hsl(var(--primary) / 0.9)", transform: "translateY(-1px)", boxShadow: "0 4px 12px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.15)" },
            "&:active": { transform: "translateY(0)" }
        });
        api.addComponent("shadcn-button-outline", {
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", whiteSpace: "nowrap",
            borderRadius: "0.5rem", fontSize: "0.875rem", fontWeight: "500", height: "2.5rem", padding: "0 1rem",
            backgroundColor: "transparent", border: "1px solid hsl(var(--input))", color: "hsl(var(--foreground))",
            transition: "all 150ms cubic-bezier(0.16, 1, 0.3, 1)", cursor: "pointer",
            boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
            "&:hover": { backgroundColor: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }
        });
        api.addComponent("shadcn-input", {
            display: "flex", width: "100%", height: "2.5rem", borderRadius: "0.5rem",
            border: "1px solid hsl(var(--input))", backgroundColor: "hsl(var(--background))",
            padding: "0 0.75rem", fontSize: "0.875rem", color: "hsl(var(--foreground))",
            transition: "all 150ms cubic-bezier(0.16, 1, 0.3, 1)", outline: "none",
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.02)",
            "&:focus-visible": { borderColor: "hsl(var(--ring))", boxShadow: "0 0 0 3px hsl(var(--ring) / 0.2)" }
        });
    },
};
