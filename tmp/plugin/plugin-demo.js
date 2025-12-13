// src/plugins/demo-plugin.ts
// Example plugin demonstrating:
// - registering a handler hook (adds "glass" utility)
// - registering a variant (supports "svg-hover:" that scopes selectors for SVG hover contexts)
import plugin, { registerHandlerHook, registerVariant } from "../plugin";
registerHandlerHook((token) => {
    // add a small 'glass' utility: glass -> glassmorphism background
    if (token.key === "glass") {
        return `background: rgba(255,255,255,0.08); backdrop-filter: blur(6px); border-radius:8px;`;
    }
    return null;
});
// Register custom variant 'svg-hover' that turns `.svg-hover:foo` into `.svg:hover .foo`
registerVariant("svg-hover", (selector) => {
    return `.svg:hover ${selector}`;
});
export default plugin;
