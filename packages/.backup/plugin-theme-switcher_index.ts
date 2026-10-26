export default {
  name: "@garursaili/plugin-theme-switcher",
  version: "1.0.0",
  setup(api) {
    api.addUtilities({
      "theme-light": { colorScheme: "light" },
      "theme-dark": { colorScheme: "dark" },
      "theme-auto": { colorScheme: "light dark" },
      "theme-transition": { transition: "background-color 200ms, color 200ms" },
      "theme-toggle": { position: "relative", width: "3rem", height: "1.5rem", borderRadius: "9999px", background: "var(--garur-surface-muted)", cursor: "pointer", transition: "background 200ms", "&::after": { content: "''", position: "absolute", top: "2px", left: "2px", width: "1.25rem", height: "1.25rem", borderRadius: "9999px", background: "var(--garur-surface)", boxShadow: "0 1px 3px rgba(0,0,0,0.2)", transition: "transform 200ms" }, "&[aria-checked='true']": { background: "var(--garur-primary)" }, "&[aria-checked='true']::after": { transform: "translateX(1.5rem)" } },
    });
  },
};
