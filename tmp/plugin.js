// src/plugin.ts
// Simple plugin API for Garur-CSS. Plugins can register:
//
// - handlers: (token) => HandlerResult | null (handler hook runs after built-in handler)
// - variants: add names mapped to a function that transforms a selector
// - sanitisers: additional sanitizer hooks (not used directly here, but provided for extension)
//
// Plugins should call register* functions during startup. The JIT/handler will invoke the hooks.
const handlerHooks = [];
const variantHooks = {};
export function registerHandlerHook(fn) {
    handlerHooks.push(fn);
}
export function getHandlerHooks() {
    return [...handlerHooks];
}
export function registerVariant(name, fn) {
    variantHooks[name] = fn;
}
export function getVariantHook(name) {
    return variantHooks[name];
}
export default {
    registerHandlerHook,
    getHandlerHooks,
    registerVariant,
    getVariantHook,
};
