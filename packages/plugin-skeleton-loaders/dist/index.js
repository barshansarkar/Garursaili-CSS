export default {
    name: "@garursaili/plugin-skeleton-loaders",
    version: "1.0.0",
    setup(api) {
        api.addUtilities({
            "skeleton-pulse": { background: "var(--garur-surface-muted)", borderRadius: "0.375rem", animation: "garur-skeleton-pulse 1.5s ease-in-out infinite" },
            "skeleton-shimmer": { background: "linear-gradient(90deg, var(--garur-surface-muted) 25%, color-mix(in oklab, var(--garur-surface-muted) 50%, white) 50%, var(--garur-surface-muted) 75%)", backgroundSize: "200% 100%", borderRadius: "0.375rem", animation: "garur-skeleton-shimmer 1.5s infinite" },
            "skeleton-avatar": { width: "2.5rem", height: "2.5rem", borderRadius: "9999px" },
            "skeleton-text-sm": { height: "0.75rem", borderRadius: "0.25rem" },
            "skeleton-text": { height: "1rem", borderRadius: "0.25rem" },
            "skeleton-title": { height: "1.5rem", borderRadius: "0.375rem" },
            "skeleton-image": { aspectRatio: "16/9", borderRadius: "0.5rem" },
        });
        api.addKeyframes("garur-skeleton-pulse", "50% { opacity: 0.5 }");
        api.addKeyframes("garur-skeleton-shimmer", "0% { background-position: 200% 0 } 100% { background-position: -200% 0 }");
    },
};
