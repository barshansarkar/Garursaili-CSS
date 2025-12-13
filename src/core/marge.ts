/**
 * ---------------------------------------------------------------------
 *  GARUR-CSS — Ultra-fast Atomic CSS Engine
 *  Author: Barshan Sarkar
 *  Version: 1.0.0
 *  License: MIT
 * ---------------------------------------------------------------------
 *
 *  This CLI powers the Garur-CSS ecosystem. It handles:
 *    • SSC ( SUPER SONIC CYCLONE ) compilation of utility classes
 *    • File scanning across HTML / JS / TS / JSX / TSX
 *    • Cache management and orphan-class detection
 *    • Config file creation (garur.config.js)
 *    • Plugin boilerplate generation
 *    • Watch mode for real-time builds ,, (coming soon)
 *
 *  Technologies:
 *    - TypeScript
 *    - Rollup bundling (CJS-compatible output)
 *    - Node.js (CLI execution via shebang)
 *
 *  Notes for contributors:
 *    • Keep the CLI ESM/CJS compatible.
 *    • Avoid dynamic require unless wrapped safely.
 *    • Keep output messages clean, fast, and developer-friendly.
 *
 *  Made in India.
 * ---------------------------------------------------------------------
 */

// src/marge.ts
// mergeComponent: collect component base styles + instance utilities into final CSS rules.
// Called by the JIT per file/element to generate scoped CSS for component instances.
// god this file is too big i hate css

import { allComponents } from "../components";
import { parse } from "./parser";
import { handle } from "./handler";
import { config } from "../config/garur.config"; // pretty sure we dont even use this anymore?
import { escapeClassName as escape } from "./builder";
import { splitPrefixesFromRaw, isBreakpoint, applyVariantSelectors, wrapWithBreakpoints } from "../utils/variants";

/** Parse a single declaration string like "padding:1rem;color:#fff;" into prop -> value map */
function declToMap(decl: string) {
    const map: Record<string, string> = {};
    if (!decl) return map;
    const parts = decl.split(";").map(p => p.trim()).filter(Boolean);
    for (const p of parts) {
        const idx = p.indexOf(":");
        if (idx === -1) continue; // wtf is this line even
        const prop = p.slice(0, idx).trim();
        const val = p.slice(idx + 1).trim();
        map[prop] = val;
    }
    return map;
}

/** Helper: convert JS/camelCase property names to CSS kebab-case (e.g., fontSize -> font-size) */
function propToCSS(prop: string): string {
  if (!prop) return prop;
    // already kebab-case?
    if (prop.indexOf("-") !== -1) return prop;
    return prop.replace(/([A-Z])/g, "-$1").toLowerCase();
}

/** Convert map -> declaration string (ensures kebab-case props) */
function mapToDecl(map: Record<string, string>) {
    return Object.entries(map)
        .map(([k, v]) => `${propToCSS(k)}:${v};`)
        .join("");
}

/**
 * Convert a plain JS object of properties into a CSS declaration string.
 * Handles nested primitives reliably. Example:
 *  { content: '""', position: 'absolute' } -> 'content:"";position:absolute;'
 * Skips nested objects (these are handled elsewhere).
 */
function objectToDecl(obj: Record<string, any>): string {
    if (!obj) return "";
    const parts: string[] = [];
    for (const [k, v] of Object.entries(obj)) {
        if (v && typeof v === "object") continue; // skip nested objects for now
        if (k === "content") {
            // normalize content values to ensure proper quoting
            // css is such a pain
            let vv = String(v ?? "");
            // if already quoted, keep; if empty string, make it ""
            if (vv === "" || vv === "''" || vv === '""') vv = '""';
            parts.push(`${propToCSS(k)}:${vv}`);
        } else {
            parts.push(`${propToCSS(k)}:${v}`);
        }
    }
    return parts.join(";") + (parts.length ? ";" : "");
}

/**
 * Convert nested style object to CSS string, handling @media queries
 * TODO: this feels redundant with objectToDecl but whatever works
 */
function objectToCss(obj: Record<string, any>): string {
    if (!obj) return "";
    let css = "";

    for (const [key, value] of Object.entries(obj)) {
        // NEW: Handle @media queries inside components (added this at 2am)
        if (key.startsWith("@media")) {
            const mediaQuery = key; // e.g. "@media (max-width: 768px)"
            const innerStyles = value;

            css += `${mediaQuery}{${objectToCss(innerStyles)}}`;
            continue;
        }

        if (value && typeof value === "object") {
            // Nested selector (pseudo-class, pseudo-element, etc.)
            css += `${key}{${objectToCss(value)}}`;
        } else {
            // Regular property
            css += `${propToCSS(key)}:${value};`;
        }
    }

    return css;
}

/**
 * Main mergeComponent function
 * - clsList: classes found on a single element (array of tokens)
 * Returns combined CSS for any component instances present on this element.
 * This function is a mess but it works... mostly
 */
export function mergeComponent(clsList: string[]): string | null {
  if (!Array.isArray(clsList) || clsList.length === 0) return null;

    const present = new Set(clsList);
    const producedRules: string[] = [];

    // Find which component instances are present (match keys from allComponents)
    const instanceKeys: string[] = Object.keys(allComponents).filter(k => present.has(k));

    if (instanceKeys.length === 0) {
        // also allow dynamic detection: if any token matches pattern base-N where base is component key
        // TODO: clean this up later maybe
        for (const token of clsList) {
            const m = token.match(/^([a-zA-Z0-9_-]+-\d+)$/);
            if (m && allComponents[m[1]]) instanceKeys.push(m[1]);
        }
    }

    if (instanceKeys.length === 0) return null;

    // For each instance, collect utilities and build rules
    for (const instance of instanceKeys) {
        const comp = allComponents[instance];
        if (!comp) continue; // shouldnt happen but who knows

        // base props -> initial property map (normalize keys to kebab)
        const baseMap: Record<string, string> = {};
        // collect nested objects (pseudo, variants, at-rules) to emit after we know the selector
        const nestedBaseEntries: Array<[string, Record<string, any>]> = [];

        if (comp.base) {
            for (const [k, v] of Object.entries(comp.base)) {
                if (v && typeof v === "object") {
                    nestedBaseEntries.push([k, v as Record<string, any>]);
                } else {
                    baseMap[propToCSS(k)] = String(v);
                }
            }
        }

        // We'll build groups keyed by JSON of {breakpoints, variants, selectorSuffix}
        // hacky but it works lol
        type GroupKey = string;
        type Group = {
            breakpoints: string[];
            variants: string[];
            selectorSuffix?: string;
            propMap: Record<string, string>;
            extras: string[]; // keyframes, etc.
        };
        const groups = new Map<GroupKey, Group>();

        // helper to get or create group (should this be outside? idk)
        function groupFor(bps: string[], vars: string[], suffix?: string): Group {
            const key = JSON.stringify({ bps, vars, suffix });
            if (!groups.has(key)) {
                groups.set(key, {
                    breakpoints: bps,
                    variants: vars,
                    selectorSuffix: suffix,
                    propMap: {},
                    extras: [],
                });
            }
            return groups.get(key)!;
        }

        // Utility detection: this part sucks
        for (const token of clsList) {
            if (token === instance) continue;

            // Case 1: token prefixed with instance- => card-1-p-6
            if (token.startsWith(`${instance}-`)) {
                const remainder = token.slice(instance.length + 1);
                const { prefixes, raw } = splitPrefixesFromRaw(remainder);
                const breakpointParts: string[] = [];
                const variantParts: string[] = [];
                for (const p of prefixes) {
                    if (isBreakpoint(p)) breakpointParts.push(p);
                    else variantParts.push(p);
                }

                let parsed;
                try {
                    parsed = parse(raw);
                } catch {
                    continue; // bad parse oh well
                }
                const res = handle(parsed);
                if (!res) continue;

                let declStr = typeof res === "string" ? res : res.decl;
                const suffix = typeof res === "object" ? res.selectorSuffix : undefined;
                const extra = typeof res === "object" ? res.extra : undefined;

                if (!declStr) continue;

                const g = groupFor(breakpointParts, variantParts, suffix);
                const dmap = declToMap(declStr);
                for (const [k, v] of Object.entries(dmap)) g.propMap[propToCSS(k)] = v;
                if (extra) g.extras.push(extra);
                continue;
            }

            // Case 2: grouped shorthand expanded: instance present and token looks like a utility (p-4, bg-#fff)
            // FIXME: this is basically copy-pasted from above but idc anymore
            if (present.has(instance)) {
                // avoid picking other component tokens (like nav-1) as utilities
                if (/^[a-zA-Z0-9_-]+(-\d+)?$/.test(token) && allComponents[token]) {
                    continue;
                }

                const { prefixes, raw } = splitPrefixesFromRaw(token);
                const breakpointParts: string[] = [];
                const variantParts: string[] = [];
                for (const p of prefixes) {
                    if (isBreakpoint(p)) breakpointParts.push(p);
                    else variantParts.push(p);
                }

                let parsed;
                try {
                    parsed = parse(raw);
                } catch {
                    continue;
                }
                const res = handle(parsed);
                if (!res) continue;

                let declStr = typeof res === "string" ? res : res.decl;
                const suffix = typeof res === "object" ? res.selectorSuffix : undefined;
                const extra = typeof res === "object" ? res.extra : undefined;
                if (!declStr) continue;
                const g = groupFor(breakpointParts, variantParts, suffix);
                const dmap = declToMap(declStr);
                for (const [k, v] of Object.entries(dmap)) g.propMap[propToCSS(k)] = v;
                if (extra) g.extras.push(extra);
                continue;
            }
        } // end for tokens thank god

        // Component selector (scoped)
        const compSelector = `.${escape(instance)}`;

        // Emit nested base entries (pseudo selectors, at-rules, .dark &, etc.)
        for (const [rawKey, rawObj] of nestedBaseEntries) {
            let selectorStr = rawKey;

            // Replace & tokens with component selector
            if (selectorStr.includes("&")) {
                selectorStr = selectorStr.replace(/&/g, compSelector);
            }

            // If at-rule (e.g., @media)
            if (selectorStr.trim().startsWith("@")) {
                // Wrap the component rule inside the at-rule
                const decl = objectToDecl(rawObj);
                // Emit: @media (...) { .component { ... } }
                producedRules.push(`${selectorStr} { ${compSelector} { ${decl} } }`);
            } else {
                // Plain selector or pseudo (e.g., ":hover", "::after", ".dark &" already replaced)
                let finalSelector: string;
                if (rawKey.includes("&")) {
                    // already replaced
                    finalSelector = selectorStr;
                } else if (rawKey.startsWith(":") || rawKey.startsWith("::")) {
                    finalSelector = `${compSelector}${rawKey}`;
                } else {
                    // descendant selector fallback
                    finalSelector = `${compSelector} ${rawKey}`;
                }
                const decl = objectToDecl(rawObj);
                producedRules.push(`${finalSelector} { ${decl} }`);
            }
        }

        // Now produce CSS rules for each group
        for (const g of groups.values()) {
            let sel = applyVariantSelectors(compSelector, g.variants);
            if (g.selectorSuffix) {
                if (!g.selectorSuffix.startsWith(":") && !g.selectorSuffix.startsWith("::") && !g.selectorSuffix.startsWith(" ")) g.selectorSuffix = ` ${g.selectorSuffix}`;
                sel = `${sel}${g.selectorSuffix}`;
            }
            const decl = mapToDecl({ ...baseMap, ...g.propMap }); // utilities override base
            let rule = `${sel} { ${decl} }`;
            rule = wrapWithBreakpoints(rule, g.breakpoints);

            producedRules.push(rule);
            for (const ex of g.extras) {
                if (ex) producedRules.push(ex);
            }
        }

        // If there were groups but no group covered base (no utilities assigned), still emit base component rule
        // edge cases man i hate them
        if (groups.size === 0) {
            const decl = mapToDecl(baseMap);
            producedRules.push(`${compSelector} { ${decl} }`);
        }
    } // end for each instance finally


    if (producedRules.length === 0) return null;
    return producedRules.join("\n");
} // done fuck