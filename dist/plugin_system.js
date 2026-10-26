// ═══════════════════════════════════════════════════════════════════
// GarurSaili-CSS — Plugin System v2 (Tailwind-killer)
// ═══════════════════════════════════════════════════════════════════
import { registerPluginAtRules, registerPluginBulk, clearPluginRegistries, } from "./native.js";
// ───────────────────────────────────────────────
// Global config accessor
// ───────────────────────────────────────────────
let _globalConfig = {};
export function setGlobalConfig(cfg) { _globalConfig = cfg; }
function getGlobalConfig() { return _globalConfig; }
// ───────────────────────────────────────────────
// PluginRegistry — singleton
// ───────────────────────────────────────────────
export class PluginRegistry {
    static _instance;
    static get instance() {
        if (!this._instance)
            this._instance = new PluginRegistry();
        return this._instance;
    }
    plugins = new Map();
    staticUtilities = [];
    components = [];
    matchUtilities = [];
    matchVariants = [];
    rewrites = new Map();
    atRules = [];
    atRulesTotal = 0;
    tokens = new Map();
    merges = new Map();
    hooks = new Map();
    orderCounter = 0;
    lastSignature = "";
    // ─── Public: existence check (used by dep-wave logic) ───
    has(name) { return this.plugins.has(name); }
    hasPlugins() { return this.plugins.size > 0; }
    async register(spec) {
        if (!spec.name)
            throw new Error("[garur] Plugin must have a name");
        if (this.plugins.has(spec.name)) {
            console.warn(`[garur] Plugin "${spec.name}" already registered; skipping`);
            return;
        }
        if (spec.requires) {
            for (const dep of spec.requires) {
                if (!this.plugins.has(dep)) {
                    throw new Error(`[garur] Plugin "${spec.name}" requires "${dep}" but it wasn't registered`);
                }
            }
        }
        const enforce = spec.enforce ?? "normal";
        const registered = {
            spec,
            enforce,
            order: this.orderCounter++,
        };
        this.plugins.set(spec.name, registered);
        const ctx = this.buildContext(spec);
        await spec.setup(this.buildAPI(spec.name), ctx);
        if (spec.hooks) {
            for (const [hookName, fn] of Object.entries(spec.hooks)) {
                if (typeof fn !== "function")
                    continue;
                const list = this.hooks.get(hookName) ?? [];
                list.push(fn);
                this.hooks.set(hookName, list);
            }
        }
        this.invalidateSignature();
    }
    async initialize() {
        const ordered = this.orderedPlugins();
        for (const p of ordered) {
            if (p.spec.hooks?.onInit) {
                await p.spec.hooks.onInit(this.buildAPI(p.spec.name), this.buildContext(p.spec));
            }
        }
    }
    async runHook(name, ...args) {
        const fns = this.hooks.get(name);
        if (!fns)
            return;
        let result = undefined;
        for (const fn of fns) {
            const r = await fn(...args);
            if (r !== undefined)
                result = r;
        }
        return result;
    }
    // ═══════════════════════════════════════════════════════════════
    // ✨ Bulk push (called ONCE from bootstrapPlugins)
    // ═══════════════════════════════════════════════════════════════
    //
    // Pushes ALL static utilities + at-rules + tokens to Rust in ONE call.
    // This replaces the old N-per-plugin resolveAll path for static entries.
    // Safe because:
    //   - Rust only builds classes it's asked for (no auto-emit)
    //   - Extra entries in map = tiny memory cost, zero correctness cost
    pushAllStatic() {
        const utilities = this.staticUtilities.map((e) => [e.name, e.value]);
        const tokensCss = this.getTokensCss();
        const atRules = [...this.atRules];
        if (tokensCss)
            atRules.push(`@layer garur-tokens { ${tokensCss} }`);
        if (utilities.length === 0 && atRules.length === 0)
            return;
        // ONE bulk register — 1 ArcSwap clone, 1 cache clear
        registerPluginBulk(utilities, [], atRules);
        this.atRulesTotal += atRules.length;
        this.atRules = [];
    }
    // ═══════════════════════════════════════════════════════════════
    // ✨ Dynamic resolve (called EVERY build)
    // ═══════════════════════════════════════════════════════════════
    //
    // Handles only the entries that need per-class resolution:
    //   - Match utilities (10 × N classes)
    //   - Components (class-gated — required because ssc.rs auto-emits)
    //   - Merges (extends base static utilities)
    //
    // Static utilities are already pushed by pushAllStatic — skip them.
    resolveDynamic(classes) {
        const classSet = new Set(classes);
        const utilBatch = [];
        const compBatch = [];
        // 1. Components (class-gated)
        for (const entry of this.components) {
            if (classSet.has(entry.name)) {
                compBatch.push([entry.name, entry.value]);
            }
        }
        // 2. Match utilities (per-class resolution — REQUIRED)
        for (const m of this.matchUtilities) {
            for (const cls of classSet) {
                const resolved = this.tryMatchUtility(m, cls);
                if (resolved)
                    utilBatch.push([cls, resolved]);
            }
        }
        // 3. Merges (override base static utilities)
        for (const [name, extras] of this.merges) {
            const base = this.staticUtilities.find((s) => s.name === name);
            if (base) {
                const merged = mergeDecls(base.value, extras);
                utilBatch.push([name, merged]);
            }
        }
        if (utilBatch.length === 0 && compBatch.length === 0)
            return;
        // ONE bulk register — 1 ArcSwap clone, 1 cache clear
        registerPluginBulk(utilBatch, compBatch, []);
    }
    // ─── BC alias for old code paths ───
    resolveAll(classes) {
        this.resolveDynamic(classes);
    }
    // ═══════════════════════════════════════════════════════════════
    // Match utility resolution
    // ═══════════════════════════════════════════════════════════════
    tryMatchUtility(m, cls) {
        const base = stripVariants(cls);
        if (base === m.pattern) {
            const dv = m.values["DEFAULT"];
            if (dv)
                return this.callUtilityHandler(m, undefined, dv);
            return null;
        }
        const prefix = m.pattern + "-";
        if (!base.startsWith(prefix))
            return null;
        const rest = base.slice(prefix.length);
        if (m.values[rest] !== undefined) {
            return this.callUtilityHandler(m, rest, m.values[rest]);
        }
        if (m.supportsArbitrary && rest.startsWith("[") && rest.endsWith("]")) {
            const arb = rest.slice(1, -1).replace(/_/g, " ");
            return this.callUtilityHandler(m, undefined, arb);
        }
        return this.callUtilityHandler(m, rest, rest);
    }
    callUtilityHandler(m, key, value) {
        const result = m.handler(value, this.buildContext({
            name: m.pluginId,
            setup: () => { },
        }));
        if (!result)
            return null;
        return normalizeUtilityValue(result);
    }
    // ═══════════════════════════════════════════════════════════════
    // Signature
    // ═══════════════════════════════════════════════════════════════
    signature() {
        if (this.lastSignature)
            return this.lastSignature;
        const parts = [];
        for (const p of this.orderedPlugins()) {
            parts.push(`${p.spec.name}@${p.spec.version ?? "0"}@${p.enforce}`);
        }
        let h = 0x811c9dc5;
        const s = parts.join("|");
        for (let i = 0; i < s.length; i++) {
            h ^= s.charCodeAt(i);
            h = Math.imul(h, 0x01000193);
        }
        this.lastSignature = (h >>> 0).toString(16);
        return this.lastSignature;
    }
    invalidateSignature() { this.lastSignature = ""; }
    orderedPlugins() {
        const pre = [];
        const normal = [];
        const post = [];
        for (const p of this.plugins.values()) {
            if (p.enforce === "pre")
                pre.push(p);
            else if (p.enforce === "post")
                post.push(p);
            else
                normal.push(p);
        }
        const byOrder = (a, b) => a.order - b.order;
        return [...pre.sort(byOrder), ...normal.sort(byOrder), ...post.sort(byOrder)];
    }
    clear() {
        this.plugins.clear();
        this.staticUtilities = [];
        this.components = [];
        this.matchUtilities = [];
        this.matchVariants = [];
        this.rewrites.clear();
        this.atRules = [];
        this.atRulesTotal = 0;
        this.tokens.clear();
        this.merges.clear();
        this.hooks.clear();
        this.orderCounter = 0;
        this.invalidateSignature();
        clearPluginRegistries();
    }
    // ─── BC: flushAtRulesWithTokens (used by older code) ───
    flushAtRulesWithTokens() {
        const tokensCss = this.getTokensCss();
        if (tokensCss)
            this.atRules.push(`@layer garur-tokens { ${tokensCss} }`);
        if (this.atRules.length === 0)
            return;
        this.atRulesTotal += this.atRules.length;
        registerPluginAtRules(this.atRules);
        this.atRules = [];
    }
    getTokensCss() {
        if (this.tokens.size === 0)
            return "";
        const lines = [":root {"];
        for (const [name, value] of this.tokens) {
            const safe = name.startsWith("--") ? name : `--${name}`;
            lines.push(`  ${safe}: ${value};`);
        }
        lines.push("}");
        return lines.join("\n");
    }
    rewriteClass(cls) {
        let current = cls;
        const seen = new Set();
        while (this.rewrites.has(current) && !seen.has(current)) {
            seen.add(current);
            current = this.rewrites.get(current);
        }
        return current;
    }
    traceClass(cls) {
        for (const entry of this.staticUtilities) {
            if (entry.name === cls) {
                const plugin = this.plugins.get(entry.pluginId);
                return {
                    pluginId: entry.pluginId,
                    pluginName: plugin?.spec.name ?? entry.pluginId,
                    kind: "static",
                };
            }
        }
        for (const entry of this.components) {
            if (entry.name === cls) {
                const plugin = this.plugins.get(entry.pluginId);
                return {
                    pluginId: entry.pluginId,
                    pluginName: plugin?.spec.name ?? entry.pluginId,
                    kind: "component",
                };
            }
        }
        for (const m of this.matchUtilities) {
            if (cls === m.pattern || cls.startsWith(m.pattern + "-")) {
                const plugin = this.plugins.get(m.pluginId);
                return {
                    pluginId: m.pluginId,
                    pluginName: plugin?.spec.name ?? m.pluginId,
                    kind: "match",
                };
            }
        }
        if (this.rewrites.has(cls)) {
            return { pluginId: "?", pluginName: "rewrite", kind: "rewrite" };
        }
        return null;
    }
    snapshot() {
        return {
            plugins: this.orderedPlugins().map((p) => ({
                name: p.spec.name,
                version: p.spec.version,
                enforce: p.enforce,
            })),
            utilities: this.staticUtilities.length,
            components: this.components.length,
            matchUtilities: this.matchUtilities.length,
            matchVariants: this.matchVariants.length,
            rewrites: this.rewrites.size,
            atRules: this.atRulesTotal + this.atRules.length,
            tokens: this.tokens.size,
            signature: this.signature(),
        };
    }
    // ───────────────────────────────────────────────
    // Internal helpers
    // ───────────────────────────────────────────────
    buildAPI(pluginId) {
        return {
            addUtility: (name, value) => {
                this.staticUtilities.push({
                    name, value: normalizeUtilityValue(value),
                    layer: "utilities", pluginId,
                });
            },
            addUtilities: (map) => {
                for (const [k, v] of Object.entries(map)) {
                    this.staticUtilities.push({
                        name: k, value: normalizeUtilityValue(v),
                        layer: "utilities", pluginId,
                    });
                }
            },
            addComponent: (name, value) => {
                this.components.push({
                    name, value: normalizeUtilityValue(value),
                    layer: "components", pluginId,
                });
            },
            addComponents: (map) => {
                for (const [k, v] of Object.entries(map)) {
                    this.components.push({
                        name: k, value: normalizeUtilityValue(v),
                        layer: "components", pluginId,
                    });
                }
            },
            matchUtilities: (map, opts = {}) => {
                for (const [pattern, handler] of Object.entries(map)) {
                    this.matchUtilities.push({
                        pattern, handler,
                        values: opts.values ?? {},
                        supportsArbitrary: opts.supportsArbitrary ?? true,
                        type: opts.type,
                        layer: opts.layer ?? "utilities",
                        pluginId,
                    });
                }
            },
            matchVariant: (name, handler, opts = {}) => {
                this.matchVariants.push({
                    pattern: name, handler,
                    values: opts.values ?? {},
                    sortKey: opts.sortKey ?? 0,
                    pluginId,
                });
            },
            rewrite: (from, to) => { this.rewrites.set(from, to); },
            addKeyframes: (name, body) => {
                this.atRules.push(`@keyframes ${name} { ${body} }`);
            },
            addProperty: (name, syntax, initial, inherits = false) => {
                this.atRules.push(`@property ${name} { syntax: "${syntax}"; inherits: ${inherits}; initial-value: ${initial}; }`);
            },
            addAtRule: (css) => { this.atRules.push(css); },
            config: (path) => getByPath(getGlobalConfig(), path),
            theme: (path) => getByPath(getGlobalConfig().theme ?? {}, path),
            defineToken: (name, value) => { this.tokens.set(name, value); },
            mergeInto: (name, extra) => {
                const existing = this.merges.get(name) ?? {};
                this.merges.set(name, { ...existing, ...extra });
            },
            debug: (msg) => {
                if (process.env.GARUR_DEBUG) {
                    console.log(`[garur:${pluginId}] ${msg}`);
                }
            },
        };
    }
    buildContext(spec) {
        return {
            theme: getGlobalConfig().theme ?? {},
            config: getGlobalConfig(),
            pluginId: spec.name,
            tokens: {
                add: (name, value) => this.tokens.set(name, value),
                addMany: (map) => {
                    for (const [k, v] of Object.entries(map))
                        this.tokens.set(k, v);
                },
            },
            preflight: {
                add: (layer, css) => { this.atRules.push(`@layer ${layer} { ${css} }`); },
            },
            assets: {
                addFont: (_name, url, opts = {}) => {
                    const src = Object.entries(opts)
                        .map(([k, v]) => `${k}="${v}"`)
                        .join(" ");
                    this.atRules.push(`@font-face { font-family: "${_name}"; src: url("${url}"); ${src} }`);
                },
                addPreload: (url, as) => {
                    this.atRules.push(`/* preload: ${url} as=${as} */`);
                },
            },
            debug: {
                log: (msg) => {
                    if (process.env.GARUR_DEBUG)
                        console.log(`[garur:${spec.name}] ${msg}`);
                },
            },
        };
    }
}
// ───────────────────────────────────────────────
// Helpers
// ───────────────────────────────────────────────
function normalizeUtilityValue(value) {
    if (typeof value === "string")
        return value;
    if ("decls" in value) {
        const sel = value.selector ?? "&";
        const declsStr = declsToCss(value.decls);
        if (sel === "&")
            return declsStr;
        return `${sel} { ${declsStr} }`;
    }
    return declsToCss(value);
}
function declsToCss(obj) {
    const parts = [];
    for (const [k, v] of Object.entries(obj)) {
        if (v === undefined || v === null)
            continue;
        if (typeof v === "object" && !Array.isArray(v)) {
            parts.push(`${k} { ${declsToCss(v)} }`);
        }
        else {
            parts.push(`${camelToKebab(k)}: ${v}`);
        }
    }
    return parts.join("; ");
}
function camelToKebab(s) {
    return s.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase());
}
function mergeDecls(base, extras) {
    const extra = declsToCss(extras);
    return base ? `${base}; ${extra}` : extra;
}
function stripVariants(cls) {
    let depth = 0;
    for (let i = cls.length - 1; i >= 0; i--) {
        const c = cls[i];
        if (c === "]")
            depth++;
        else if (c === "[")
            depth--;
        else if (c === ":" && depth === 0)
            return cls.slice(i + 1);
    }
    return cls;
}
function getByPath(obj, path) {
    if (!path)
        return obj;
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
}
// ───────────────────────────────────────────────
// Public factories + wave-parallel registration
// ───────────────────────────────────────────────
export function definePlugin(spec) { return spec; }
export function definePreset(spec) {
    return { ...spec, enforce: spec.enforce ?? "pre" };
}
export async function usePlugin(spec) {
    await PluginRegistry.instance.register(spec);
}
/**
 * ✨ Wave-parallel registration.
 *
 * Plugins with no `requires` (or whose deps are already registered)
 * are set up in parallel waves. Plugins with deps wait for the wave
 * where their dep is ready.
 *
 * For 52 independent plugins → 1 wave, 52 parallel setups (~8-15ms).
 * For plugins with dependencies → multiple waves, still parallel.
 */
export async function usePlugins(specs) {
    const registry = PluginRegistry.instance;
    const pending = [...specs];
    let safety = 0;
    while (pending.length > 0) {
        if (++safety > 200) {
            throw new Error("[garur] plugin dependency cycle detected (or 200 waves exceeded)");
        }
        const ready = [];
        const deferred = [];
        for (const spec of pending) {
            const deps = spec.requires ?? [];
            const allReady = deps.every((d) => registry.has(d));
            if (allReady)
                ready.push(spec);
            else
                deferred.push(spec);
        }
        if (ready.length === 0) {
            const names = deferred.map((p) => p.name).join(", ");
            throw new Error(`[garur] unresolvable plugin dependencies: ${names}`);
        }
        await Promise.all(ready.map((s) => usePlugin(s)));
        pending.length = 0;
        pending.push(...deferred);
    }
}
export async function reloadPlugins(specs) {
    PluginRegistry.instance.clear();
    await usePlugins(specs);
}
