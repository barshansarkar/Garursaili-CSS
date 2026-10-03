// src/plugin.ts
// Simple plugin API for Garur-CSS. Plugins can register:#########
// - sanitisers: additional sanitizer hooks (not used directly here, but provided for extension)<<>>
//
// Plugins should call register* functions during startup. The JIT/handler will invoke the hooks.<<<<<<<

import { ParsedToken } from "./core/parser";

export type HandlerResult = string | { decl: string; selectorSuffix?: string; extra?: string };

type HandlerHook = (token: ParsedToken) => HandlerResult | null;
type VariantHook = (selector: string) => string;

const handlerHooks: HandlerHook[] = [];
const variantHooks: Record<string, VariantHook> = {};

export function registerHandlerHook(fn: HandlerHook) {
  handlerHooks.push(fn);
}

export function getHandlerHooks(): HandlerHook[] {
  return [...handlerHooks];
}

export function registerVariant(name: string, fn: VariantHook) {
  variantHooks[name] = fn;
}

export function getVariantHook(name: string): VariantHook | undefined {
  return variantHooks[name];
}

export default {
  registerHandlerHook,
  getHandlerHooks,
  registerVariant,
  getVariantHook,
};