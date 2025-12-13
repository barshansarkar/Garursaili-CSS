// // src/handler.ts
// // Comprehensive dynamic handler: palette, arbitrary values, typography (tracking/leading),
// // additional filters, full forms controls, divide/space color support, ring-offset handling,
// // and UTIL_DOCS metadata used by docs generation.
// //
// // Exports:
// // - handle(token): HandlerResult | null
// // - UTIL_DOCS: metadata for docs generation
export {};
// import configDefault from "./garur.config";
// import { ParsedToken } from "./parser";
// import {
//   normalizeTokenValueForProperty,
//   normalizeColorToken,
//   ensureUnitForLength,
//   ensureTimeUnit,
// } from "./utils/sanitizer";
// import plugin from "./plugin";
// export type HandlerResult = string | { decl: string; selectorSuffix?: string; extra?: string };
// export const UTIL_DOCS: Array<{ id: string; desc: string; example?: string }> = [
//   { id: "p-4", desc: "Padding", example: "p-4" },
//   { id: "m-2", desc: "Margin", example: "m-2" },
//   { id: "bg-red-500", desc: "Background color from palette", example: "bg-red-500" },
//   { id: "bg-#fff", desc: "Arbitrary color (hex)", example: "bg-#fff" },
//   { id: "text-[var(--c)]", desc: "Arbitrary text color (CSS var)", example: "text-[var(--c)]" },
//   { id: "tracking-tight", desc: "Letter-spacing", example: "tracking-tight" },
//   { id: "leading-6", desc: "Line-height", example: "leading-6" },
//   { id: "space-x-4", desc: "Horizontal spacing between direct children", example: "space-x-4" },
//   { id: "divide-x-2", desc: "Divide between children (left border) with color variants", example: "divide-x-2 divide-gray-200" },
//   { id: "grid-cols-3", desc: "Grid columns", example: "grid-cols-3" },
//   { id: "animate-spin", desc: "Spin animation (keyframes injected)", example: "animate-spin" },
//   { id: "rg-red-500/4", desc: "Ring: color + width", example: "rg-red-500/4" },
//   { id: "ring-offset-2", desc: "Ring offset width helper", example: "ring-offset-2" },
//   { id: "container", desc: "Container width helpers", example: "container" },
//   { id: "object-cover", desc: "Object-fit helpers", example: "object-cover" },
//   { id: "form-input", desc: "Form input base styles", example: "form-input" },
//   { id: "form-select", desc: "Form select base styles", example: "form-select" },
//   { id: "table", desc: "Table base styles", example: "table" },
//   { id: "glass", desc: "Glassmorphism background utility", example: "glass" },
//   // New additions to superpass Tailwind
//   { id: "font-sans", desc: "Font family sans-serif", example: "font-sans" },
//   { id: "text-sm", desc: "Text size small with leading", example: "text-sm" },
//   { id: "font-bold", desc: "Font weight bold", example: "font-bold" },
//   { id: "text-center", desc: "Text align center", example: "text-center" },
//   { id: "underline", desc: "Text decoration underline", example: "underline" },
//   { id: "uppercase", desc: "Text transform uppercase", example: "uppercase" },
//   { id: "whitespace-nowrap", desc: "Whitespace no-wrap", example: "whitespace-nowrap" },
//   { id: "break-words", desc: "Word break words", example: "break-words" },
//   { id: "shadow-md", desc: "Box shadow medium", example: "shadow-md" },
//   { id: "outline-none", desc: "Outline none", example: "outline-none" },
//   { id: "transition-all", desc: "Transition all properties", example: "transition-all" },
//   { id: "skew-x-3", desc: "Transform skew X", example: "skew-x-3" },
//   { id: "cursor-pointer", desc: "Cursor pointer", example: "cursor-pointer" },
//   { id: "appearance-none", desc: "Appearance none", example: "appearance-none" },
//   { id: "pointer-events-none", desc: "Pointer events none", example: "pointer-events-none" },
//   { id: "sr-only", desc: "Screen reader only", example: "sr-only" },
//   { id: "fill-current", desc: "SVG fill current color", example: "fill-current" },
//   { id: "box-border", desc: "Box sizing border-box", example: "box-border" },
//   { id: "float-left", desc: "Float left", example: "float-left" },
//   { id: "overflow-hidden", desc: "Overflow hidden", example: "overflow-hidden" },
//   { id: "z-10", desc: "Z-index 10", example: "z-10" },
//   { id: "order-1", desc: "Flex order 1", example: "order-1" },
//   { id: "justify-center", desc: "Justify content center", example: "justify-center" },
//   { id: "items-center", desc: "Align items center", example: "items-center" },
//   { id: "flex-wrap", desc: "Flex wrap", example: "flex-wrap" },
//   { id: "grid-rows-2", desc: "Grid rows 2", example: "grid-rows-2" },
//   { id: "place-items-center", desc: "Place items center", example: "place-items-center" },
//   { id: "bg-fixed", desc: "Background attachment fixed", example: "bg-fixed" },
//   { id: "bg-clip-padding", desc: "Background clip padding", example: "bg-clip-padding" },
//   { id: "border-2", desc: "Border width 2px", example: "border-2" },
//   { id: "border-dashed", desc: "Border style dashed", example: "border-dashed" },
//   { id: "divide-opacity-50", desc: "Divide opacity", example: "divide-opacity-50" },
//   { id: "brightness-150", desc: "Filter brightness 150%", example: "brightness-150" },
//   { id: "grayscale", desc: "Filter grayscale", example: "grayscale" },
//   { id: "scroll-auto", desc: "Scroll behavior auto", example: "scroll-auto" },
//   { id: "touch-auto", desc: "Touch action auto", example: "touch-auto" },
//   { id: "select-none", desc: "User select none", example: "select-none" },
//   // Additional Tailwind-like utilities
//   { id: "aspect-auto", desc: "Aspect ratio auto", example: "aspect-auto" },
//   { id: "aspect-square", desc: "Aspect ratio 1/1", example: "aspect-square" },
//   { id: "aspect-video", desc: "Aspect ratio 16/9", example: "aspect-video" },
//   { id: "columns-3", desc: "Columns 3", example: "columns-3" },
//   { id: "break-inside-avoid", desc: "Break inside avoid", example: "break-inside-avoid" },
//   { id: "writing-mode-horizontal", desc: "Writing mode horizontal", example: "writing-mode-horizontal" },
//   { id: "min-w-0", desc: "Min width 0", example: "min-w-0" },
//   { id: "max-w-screen-xl", desc: "Max width screen xl", example: "max-w-screen-xl" },
//   { id: "font-feature-settings-auto", desc: "Font feature settings auto", example: "font-feature-settings-auto" },
//   { id: "text-shadow", desc: "Text shadow", example: "text-shadow" },
//   { id: "bg-blend-multiply", desc: "Background blend multiply", example: "bg-blend-multiply" },
//   { id: "mix-blend-multiply", desc: "Mix blend multiply", example: "mix-blend-multiply" },
//   { id: "drop-shadow-md", desc: "Drop shadow medium", example: "drop-shadow-md" },
//   { id: "table-auto", desc: "Table layout auto", example: "table-auto" },
//   { id: "animate-bounce", desc: "Bounce animation", example: "animate-bounce" },
//   { id: "origin-center", desc: "Transform origin center", example: "origin-center" },
//   { id: "accent-blue-500", desc: "Accent color blue", example: "accent-blue-500" },
//   { id: "caret-primary", desc: "Caret color primary", example: "caret-primary" },
//   { id: "col-span-2", desc: "Column span 2", example: "col-span-2" },
//   { id: "row-span-full", desc: "Row span full", example: "row-span-full" },
//   { id: "auto-cols-min", desc: "Auto columns min", example: "auto-cols-min" },
//   { id: "grid-auto-flow-row", desc: "Grid auto flow row", example: "grid-auto-flow-row" },
// ];
// const SPIN_KEYFRAMES = `@keyframes garur-spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}`;
// const BOUNCE_KEYFRAMES = `@keyframes garur-bounce{0%,20%,53%,80%,100%{transform:translate3d(0,0,0);animation-timing-function:cubic-bezier(0.215,0.61,0.355,1)}40%,43%{transform:translate3d(0,-30px,0);animation-timing-function:cubic-bezier(0.755,0.05,0.855,0.06)}70%{transform:translate3d(0,-15px,0);animation-timing-function:cubic-bezier(0.755,0.05,0.855,0.06)}90%{transform:translate3d(0,-4px,0);animation-timing-function:cubic-bezier(0.755,0.05,0.855,0.06)}}`;
// const PING_KEYFRAMES = `@keyframes garur-ping{75%,100%{transform:scale(2);opacity:0}}`;
// const PULSE_KEYFRAMES = `@keyframes garur-pulse{50%{opacity:.5}}`;
// /* ---------- helpers ---------- */
// function hexToRgba(hex: string, alpha: number) {
//   if (!hex) return null;
//   let h = hex.replace("#", "");
//   if (h.length === 3) h = h.split("").map((c) => c + c).join("");
//   if (h.length === 4) h = h.slice(0, 3).split("").map((c) => c + c).join("");
//   if (h.length === 8) h = h.slice(0, 6);
//   if (h.length !== 6) return null;
//   const r = parseInt(h.slice(0, 2), 16);
//   const g = parseInt(h.slice(2, 4), 16);
//   const b = parseInt(h.slice(4, 6), 16);
//   return `rgba(${r}, ${g}, ${b}, ${Number(alpha)})`;
// }
// function resolvePaletteColor(value: string): string | null {
//   if (!value) return null;
//   const parts = value.split("/");
//   const colorPart = parts[0];
//   const alphaPart = parts[1];
//   const palette = (configDefault as any).palette || {};
//   const m = colorPart.match(/^([a-zA-Z]+)-(\d{2,3})$/);
//   let hex: string | undefined;
//   if (m) {
//     const name = m[1];
//     const shade = m[2];
//     if (palette[name] && (palette[name] as any)[shade]) hex = (palette[name] as any)[shade];
//   } else if (palette[colorPart] && (palette[colorPart] as any)["500"]) {
//     hex = (palette[colorPart] as any)["500"];
//   }
//   if (!hex) return null;
//   if (alphaPart !== undefined) {
//     const a = Number(alphaPart);
//     const alpha = Number.isFinite(a) ? (a > 1 ? a / 100 : a) : parseFloat(alphaPart);
//     if (!Number.isFinite(alpha)) return hex;
//     const rgba = hexToRgba(hex, alpha);
//     return rgba || hex;
//   }
//   return hex;
// }
// function isArbitrary(val: string) {
//   if (!val) return false;
//   return /\s|\(|,|\[|\]|\$/.test(val) || val.startsWith("#") || val.includes("var(") || val.includes("calc(");
// }
// /* ---------- complex builders ---------- */
// function buildRing(color: string, width: string = "3px", inset = false, offset?: string, offsetColor?: string) {
//   // full ring stack: ring-offset + ring + optional inset
//   // We'll produce CSS variables and a composed box-shadow; offset is represented as an outer shadow using offsetColor.
//   const vars = [`--garur-ring-color:${color};`, `--garur-ring-width:${width};`];
//   if (offset) vars.push(`--garur-ring-offset-width:${offset};`);
//   if (offsetColor) vars.push(`--garur-ring-offset-color:${offsetColor};`);
//   // ring offset shadow
//   const offsetShadow = offset && offsetColor ? `0 0 0 var(--garur-ring-offset-width) ${offsetColor}` : "";
//   const ringShadow = `0 0 0 calc(var(--garur-ring-width)) var(--garur-ring-color)`;
//   const insetShadow = inset ? `, inset 0 0 0 calc(var(--garur-ring-width)) var(--garur-ring-color)` : "";
//   const combined = [offsetShadow, ringShadow + insetShadow].filter(Boolean).join(", ");
//   return { decl: `${vars.join("")}box-shadow:${combined};` };
// }
// function buildGradient(value: string) {
//   if (!value) return "";
//   const v = value.trim();
//   if (/linear-gradient|radial-gradient|conic-gradient/i.test(v)) return `background-image: ${v};`;
//   const c = normalizeColorToken(v) || resolvePaletteColor(v) || v;
//   let transparent = c;
//   if (typeof c === "string" && /^#[0-9a-fA-F]{6}$/.test(c)) transparent = `${c}00`;
//   return `background-image: linear-gradient(90deg, ${c} 0%, ${transparent} 100%);`;
// }
// /* ---------- main handler ---------- */
// export function handle(token: ParsedToken): HandlerResult | null {
//   if (!token || !token.key) return null;
//   const key = token.key;
//   let val = token.value || "";
//   if (token.negative && val && !val.startsWith("-")) val = `-${val}`;
//   // Colors
//   if (key === "bg" || key === "background") {
//     const palette = resolvePaletteColor(val);
//     if (palette) return `background-color:${palette};`;
//     const c = normalizeColorToken(val);
//     if (c) return `background-color:${c};`;
//     if (isArbitrary(val)) return `background:${val};`;
//     return null;
//   }
//   if (key === "text" || key === "tc" || key === "fg") {
//     const p = resolvePaletteColor(val);
//     if (p) return `color:${p};`;
//     const c = normalizeColorToken(val);
//     if (c) return `color:${c};`;
//     return null;
//   }
//   if (key === "border" || key === "bd") {
//     const p = resolvePaletteColor(val);
//     if (p) return `border-color:${p};`;
//     const c = normalizeColorToken(val);
//     if (c) return `border-color:${c};`;
//     if (/^\d/.test(val)) return `border:${ensureUnitForLength(val)} solid;`;
//     return null;
//   }
//   // Placeholder / selection / marker
//   if (key === "ph" || key === "placeholder") {
//     const c = resolvePaletteColor(val) || normalizeColorToken(val);
//     if (!c) return null;
//     return { decl: `color:${c};`, selectorSuffix: "::placeholder" };
//   }
//   if (key === "sel" || key === "selection") {
//     const c = resolvePaletteColor(val) || normalizeColorToken(val);
//     if (!c) return null;
//     return { decl: `background:${c}; color:var(--garur-selection-foreground,#fff);`, selectorSuffix: "::selection" };
//   }
//   if (key === "mk" || key === "marker") {
//     const c = normalizeColorToken(val);
//     if (!c) return null;
//     return { decl: `color:${c};`, selectorSuffix: "::marker" };
//   }
//   // Ring parity: tokens like rg-red-500/4, ring-offset-2, ring-offset-color-red-500, rg-inset-red-500/4
//   if (key === "rg" || key === "ring") {
//     // allow ring-inset, ring-offset, ring-offset-color separately; also parse compound token
//     let inset = false;
//     let offset: string | undefined;
//     let offsetColor: string | undefined;
//     let colorPart = val;
//     let widthPart = "3px";
//     // support ring-inset-... as key token: user may use 'ring-inset-#f00/4' but parser usually breaks it
//     if (val.startsWith("inset-")) {
//       inset = true;
//       colorPart = val.slice(6);
//     }
//     if (colorPart.includes("/")) {
//       const [c, w] = colorPart.split("/");
//       colorPart = c;
//       widthPart = w.match(/^\d+$/) ? `${w}px` : w;
//     }
//     // allow special keys like ring-offset-2 and ring-offset-color-red-500 when used literally as tokens:
//     // Those are handled elsewhere by handler when key === 'ring-offset' or 'ring-offset-color'.
//     const color = resolvePaletteColor(colorPart) || normalizeColorToken(colorPart) || colorPart || "#000";
//     return buildRing(color as string, widthPart, inset, undefined, undefined);
//   }
//   // ring-offset helpers
//   if (key === "ring-offset") {
//     const norm = normalizeTokenValueForProperty("margin", val) || ensureUnitForLength(val);
//     if (!norm) return null;
//     return { decl: `--garur-ring-offset-width:${norm};` };
//   }
//   if (key === "ring-offset-color") {
//     const c = resolvePaletteColor(val) || normalizeColorToken(val);
//     if (!c) return null;
//     return { decl: `--garur-ring-offset-color:${c};` };
//   }
//   if (key === "ring-inset") {
//     // ring-inset true
//     return { decl: `--garur-ring-inset:1;` };
//   }
//   // Gradient
//   if (key === "gd" || key === "gradient") {
//     return buildGradient(val);
//   }
//   // Animation
//   if (key === "animate") {
//     const animateMap: Record<string, string> = {
//       spin: "garur-spin 1s linear infinite",
//       ping: "garur-ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
//       pulse: "garur-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
//       bounce: "garur-bounce 1s infinite",
//     };
//     let extra = "";
//     if (val === "spin") extra = SPIN_KEYFRAMES;
//     else if (val === "ping") extra = PING_KEYFRAMES;
//     else if (val === "pulse") extra = PULSE_KEYFRAMES;
//     else if (val === "bounce") extra = BOUNCE_KEYFRAMES;
//     if (animateMap[val]) return { decl: `animation: ${animateMap[val]};`, extra };
//     if (val) return `animation:${val};`;
//     return null;
//   }
//   // Typography: tracking (letter-spacing) and leading (line-height)
//   if (key === "tracking") {
//     // common tokens: tight, normal, wide, px numbers etc.
//     const map: Record<string, string> = {
//       tighter: "-0.05em", tight: "-0.025em", normal: "0em", wide: "0.025em", wider: "0.05em",
//     };
//     if (map[val]) return `letter-spacing:${map[val]};`;
//     // numeric like tracking-1 -> 0.01em scale
//     if (/^-?\d+(\.\d+)?$/.test(val)) return `letter-spacing:${Number(val) / 100}em;`;
//     return null;
//   }
//   if (key === "leading") {
//     // common tokens: none, tight, snug, normal, relaxed, loose, or numeric
//     const map: Record<string, string> = {
//       none: "1", tight: "1.125", snug: "1.25", normal: "1.5", relaxed: "1.625", loose: "2",
//     };
//     if (map[val]) return `line-height:${map[val]};`;
//     // numeric like leading-6 -> 1.5 rem mapping or accept numeric
//     if (/^\d+(\.\d+)?$/.test(val)) return `line-height:${val};`;
//     return null;
//   }
//   // Spacing & sizing
//   const axisMap: Record<string, string> = {
//     p: "padding", m: "margin",
//     pt: "padding-top", pr: "padding-right", pb: "padding-bottom", pl: "padding-left",
//     px: "padding-left-right", py: "padding-top-bottom",
//     mt: "margin-top", mr: "margin-right", mb: "margin-bottom", ml: "margin-left",
//     mx: "margin-left-right", my: "margin-top-bottom",
//   };
//   if (axisMap[key]) {
//     const prop = axisMap[key];
//     const norm = normalizeTokenValueForProperty(prop, val);
//     if (norm === null) return null;
//     if (prop === "padding-left-right") return `padding-left:${norm};padding-right:${norm};`;
//     if (prop === "padding-top-bottom") return `padding-top:${norm};padding-bottom:${norm};`;
//     if (prop === "margin-left-right") return `margin-left:${norm};margin-right:${norm};`;
//     if (prop === "margin-top-bottom") return `margin-top:${norm};margin-bottom:${norm};`;
//     return `${prop}:${norm};`;
//   }
//   // Width / Height
//   if (key === "w" || key === "width") {
//     const norm = normalizeTokenValueForProperty("width", val);
//     if (norm === null) return null;
//     return `width:${norm};`;
//   }
//   if (key === "h" || key === "height") {
//     const norm = normalizeTokenValueForProperty("height", val);
//     if (norm === null) return null;
//     return `height:${norm};`;
//   }
//   // Min/Max Width/Height
//   if (key === "min-w" || key === "min-width") {
//     const norm = normalizeTokenValueForProperty("min-width", val);
//     if (norm === null) return null;
//     return `min-width:${norm};`;
//   }
//   if (key === "min-h" || key === "min-height") {
//     const norm = normalizeTokenValueForProperty("min-height", val);
//     if (norm === null) return null;
//     return `min-height:${norm};`;
//   }
//   if (key === "max-w" || key === "max-width") {
//     const norm = normalizeTokenValueForProperty("max-width", val);
//     if (norm === null) return null;
//     return `max-width:${norm};`;
//   }
//   if (key === "max-h" || key === "max-height") {
//     const norm = normalizeTokenValueForProperty("max-height", val);
//     if (norm === null) return null;
//     return `max-height:${norm};`;
//   }
//   // Border radius
//   if (key === "br" || key === "rounded" || key === "radius") {
//     const norm = normalizeTokenValueForProperty("border-radius", val);
//     if (norm === null) return null;
//     return `border-radius:${norm};`;
//   }
//   // Individual border radius
//   if (key === "rounded-t" || key === "rounded-top") {
//     const norm = normalizeTokenValueForProperty("border-top-left-radius", val);
//     if (norm === null) return null;
//     return `border-top-left-radius:${norm};border-top-right-radius:${norm};`;
//   }
//   if (key === "rounded-r" || key === "rounded-right") {
//     const norm = normalizeTokenValueForProperty("border-top-right-radius", val);
//     if (norm === null) return null;
//     return `border-top-right-radius:${norm};border-bottom-right-radius:${norm};`;
//   }
//   if (key === "rounded-b" || key === "rounded-bottom") {
//     const norm = normalizeTokenValueForProperty("border-bottom-left-radius", val);
//     if (norm === null) return null;
//     return `border-bottom-left-radius:${norm};border-bottom-right-radius:${norm};`;
//   }
//   if (key === "rounded-l" || key === "rounded-left") {
//     const norm = normalizeTokenValueForProperty("border-top-left-radius", val);
//     if (norm === null) return null;
//     return `border-top-left-radius:${norm};border-bottom-left-radius:${norm};`;
//   }
//   if (key === "rounded-tl" || key === "rounded-top-left") {
//     const norm = normalizeTokenValueForProperty("border-top-left-radius", val);
//     if (norm === null) return null;
//     return `border-top-left-radius:${norm};`;
//   }
//   if (key === "rounded-tr" || key === "rounded-top-right") {
//     const norm = normalizeTokenValueForProperty("border-top-right-radius", val);
//     if (norm === null) return null;
//     return `border-top-right-radius:${norm};`;
//   }
//   if (key === "rounded-bl" || key === "rounded-bottom-left") {
//     const norm = normalizeTokenValueForProperty("border-bottom-left-radius", val);
//     if (norm === null) return null;
//     return `border-bottom-left-radius:${norm};`;
//   }
//   if (key === "rounded-br" || key === "rounded-bottom-right") {
//     const norm = normalizeTokenValueForProperty("border-bottom-right-radius", val);
//     if (norm === null) return null;
//     return `border-bottom-right-radius:${norm};`;
//   }
//   // Display / Flex / Grid / Gap
//   if (key === "d" || key === "display") {
//     if (!val) return null;
//     return `display:${val};`;
//   }
//   if (key === "flex") {
//     if (!val) return `flex:1 1 auto;`;
//     if (/^\d+$/.test(val)) return `flex:${val} 1 0%;`;
//     if (val === "row" || val === "col" || val === "column") return `flex-direction:${val === "col" ? "column" : "row"};`;
//     return `flex:${val};`;
//   }
//   if (key === "flex-row") {
//     return `flex-direction:row;`;
//   }
//   if (key === "flex-row-reverse") {
//     return `flex-direction:row-reverse;`;
//   }
//   if (key === "flex-col") {
//     return `flex-direction:column;`;
//   }
//   if (key === "flex-col-reverse") {
//     return `flex-direction:column-reverse;`;
//   }
//   if (key === "flex-1") {
//     return `flex:1 1 0%;`;
//   }
//   if (key === "flex-auto") {
//     return `flex:1 1 auto;`;
//   }
//   if (key === "flex-initial") {
//     return `flex:0 1 auto;`;
//   }
//   if (key === "flex-none") {
//     return `flex:none;`;
//   }
//   if (key === "grid" && val.startsWith("cols-")) {
//     const n = Number(val.slice(5));
//     if (!isNaN(n) && n > 0) return `grid-template-columns: repeat(${n}, minmax(0,1fr));`;
//   }
//   if (key === "grid-cols") {
//     const n = Number(val);
//     if (!isNaN(n) && n > 0) return `grid-template-columns: repeat(${n}, minmax(0,1fr));`;
//   }
//   if (key === "grid-rows") {
//     const n = Number(val);
//     if (!isNaN(n) && n > 0) return `grid-template-rows: repeat(${n}, minmax(0,1fr));`;
//     return null;
//   }
//   if (key === "grid-auto-cols") {
//     const map: Record<string, string> = { min: "minmax(0, min-content)", max: "max-content", fr: "minmax(0, 1fr)" };
//     if (map[val]) return `grid-auto-columns:${map[val]};`;
//     return null;
//   }
//   if (key === "grid-auto-rows") {
//     const map: Record<string, string> = { min: "minmax(0, min-content)", max: "max-content", fr: "minmax(0, 1fr)" };
//     if (map[val]) return `grid-auto-rows:${map[val]};`;
//     return null;
//   }
//   if (key === "grid-auto-flow") {
//     if (["row", "col", "dense", "row-dense", "col-dense"].includes(val)) return `grid-auto-flow:${val};`;
//     return null;
//   }
//   if (key === "col-span") {
//     const n = Number(val) || 1;
//     return `grid-column: span ${n} / span ${n};`;
//   }
//   if (key === "col-start") {
//     const n = Number(val);
//     if (!isNaN(n)) return `grid-column-start: ${n};`;
//     return null;
//   }
//   if (key === "col-end") {
//     const n = Number(val);
//     if (!isNaN(n)) return `grid-column-end: ${n};`;
//     return null;
//   }
//   if (key === "row-span") {
//     const n = Number(val) || 1;
//     return `grid-row: span ${n} / span ${n};`;
//   }
//   if (key === "row-start") {
//     const n = Number(val);
//     if (!isNaN(n)) return `grid-row-start: ${n};`;
//     return null;
//   }
//   if (key === "row-end") {
//     const n = Number(val);
//     if (!isNaN(n)) return `grid-row-end: ${n};`;
//     return null;
//   }
//   if (key === "gap") {
//     if (val.startsWith("x-")) {
//       const norm = normalizeTokenValueForProperty("gap", val.slice(2));
//       if (!norm) return null;
//       return `column-gap:${norm};row-gap:0;`;
//     }
//     if (val.startsWith("y-")) {
//       const norm = normalizeTokenValueForProperty("gap", val.slice(2));
//       if (!norm) return null;
//       return `row-gap:${norm};column-gap:0;`;
//     }
//     const norm = normalizeTokenValueForProperty("gap", val);
//     if (norm === null) return null;
//     return `gap:${norm};`;
//   }
//   if (key === "gap-x") {
//     const norm = normalizeTokenValueForProperty("gap", val);
//     if (norm === null) return null;
//     return `column-gap:${norm};`;
//   }
//   if (key === "gap-y") {
//     const norm = normalizeTokenValueForProperty("gap", val);
//     if (norm === null) return null;
//     return `row-gap:${norm};`;
//   }
//   // Space utilities (RTL-aware suggestion: use logical props)
//   if (key === "space-x" || (key === "space" && val.startsWith("x-"))) {
//     const rawVal = key === "space-x" ? val : val.slice(2);
//     const norm = normalizeTokenValueForProperty("margin-inline-start", rawVal);
//     if (!norm) return null;
//     // apply to sibling selectors
//     return { decl: `margin-inline-start:${norm};`, selectorSuffix: " > :not([hidden]) ~ :not([hidden])" };
//   }
//   if (key === "space-y" || (key === "space" && val.startsWith("y-"))) {
//     const rawVal = key === "space-y" ? val : val.slice(2);
//     const norm = normalizeTokenValueForProperty("margin-top", rawVal);
//     if (!norm) return null;
//     return { decl: `margin-top:${norm};`, selectorSuffix: " > :not([hidden]) ~ :not([hidden])" };
//   }
//   // Divide utilities: support color variants (divide-gray-200) and widths
//   if (key === "divide-x" || (key === "divide" && val.startsWith("x-"))) {
//     const rawVal = key === "divide-x" ? val : val.slice(2);
//     const norm = normalizeTokenValueForProperty("border-left-width", rawVal || "1px");
//     if (!norm) return null;
//     const color = resolvePaletteColor(rawVal) || normalizeColorToken(rawVal) || "var(--garur-divide-color,#e5e7eb)";
//     const decl = `border-left-width:${norm};border-left-style:solid;border-left-color:${color};`;
//     return { decl, selectorSuffix: " > * + *" };
//   }
//   if (key === "divide-y" || (key === "divide" && val.startsWith("y-"))) {
//     const rawVal = key === "divide-y" ? val : val.slice(2);
//     const norm = normalizeTokenValueForProperty("border-top-width", rawVal || "1px");
//     if (!norm) return null;
//     const color = resolvePaletteColor(rawVal) || normalizeColorToken(rawVal) || "var(--garur-divide-color,#e5e7eb)";
//     const decl = `border-top-width:${norm};border-top-style:solid;border-top-color:${color};`;
//     return { decl, selectorSuffix: " > * + *" };
//   }
//   // Position & inset
//   if (key === "pos" || key === "position") {
//     if (!val) return null;
//     return `position:${val};`;
//   }
//   if (key === "top" || key === "left" || key === "right" || key === "bottom" || key === "inset") {
//     const prop = key === "inset" ? "inset" : key;
//     const norm = normalizeTokenValueForProperty(prop, val);
//     if (norm === null) return null;
//     return `${prop}:${norm};`;
//   }
//   // Transforms
//   if (key === "rotate" || key === "transform-rotate") {
//     const norm = normalizeTokenValueForProperty("transform-rotate", val);
//     if (norm === null) return null;
//     return `transform:rotate(${norm});`;
//   }
//   if (key === "scale" || key === "transform-scale") {
//     const norm = normalizeTokenValueForProperty("transform-scale", val);
//     if (norm === null) return null;
//     return `transform:scale(${norm});`;
//   }
//   if (key === "translate-x" || key === "translate") {
//     const norm = normalizeTokenValueForProperty("transform-translate", val);
//     if (norm === null) return null;
//     return `transform:translateX(${norm});`;
//   }
//   if (key === "translate-y") {
//     const norm = normalizeTokenValueForProperty("transform-translate", val);
//     if (norm === null) return null;
//     return `transform:translateY(${norm});`;
//   }
//   if (key === "translate-z") {
//     const norm = normalizeTokenValueForProperty("transform-translate", val);
//     if (norm === null) return null;
//     return `transform:translateZ(${norm});`;
//   }
//   if (key === "rotate-x") {
//     const norm = normalizeTokenValueForProperty("transform-rotate", val);
//     if (norm === null) return null;
//     return `transform:rotateX(${norm});`;
//   }
//   if (key === "rotate-y") {
//     const norm = normalizeTokenValueForProperty("transform-rotate", val);
//     if (norm === null) return null;
//     return `transform:rotateY(${norm});`;
//   }
//   if (key === "skew-x" || key === "transform-skew-x") {
//     const norm = normalizeTokenValueForProperty("transform-skew", val);
//     if (norm === null) return null;
//     return `transform:skewX(${norm});`;
//   }
//   if (key === "skew-y" || key === "transform-skew-y") {
//     const norm = normalizeTokenValueForProperty("transform-skew", val);
//     if (norm === null) return null;
//     return `transform:skewY(${norm});`;
//   }
//   if (key === "scale-x") {
//     const norm = normalizeTokenValueForProperty("transform-scale", val);
//     if (norm === null) return null;
//     return `transform:scaleX(${norm});`;
//   }
//   if (key === "scale-y") {
//     const norm = normalizeTokenValueForProperty("transform-scale", val);
//     if (norm === null) return null;
//     return `transform:scaleY(${norm});`;
//   }
//   if (key === "origin" || key === "transform-origin") {
//     const map: Record<string, string> = {
//       center: "center",
//       top: "top",
//       "top-right": "top right",
//       right: "right",
//       "bottom-right": "bottom right",
//       bottom: "bottom",
//       "bottom-left": "bottom left",
//       left: "left",
//       "top-left": "top left",
//     };
//     if (map[val]) return `transform-origin:${map[val]};`;
//     return `transform-origin:${val};`;
//   }
//   // Aspect ratio
//   if (key === "aspect") {
//     const aspectMap: Record<string, string> = {
//       auto: "auto",
//       square: "1",
//       video: "16/9",
//     };
//     if (aspectMap[val]) return `aspect-ratio:${aspectMap[val]};`;
//     if (val.includes("/")) return `aspect-ratio:${val};`;
//     return null;
//   }
//   // Columns
//   if (key === "columns") {
//     const n = Number(val);
//     if (!isNaN(n)) return `columns:${n};`;
//     return `columns:${val};`;
//   }
//   // Break
//   if (key === "break") {
//     if (["auto", "avoid", "all", "avoid-page"].includes(val)) return `break-${key === "break" ? "before" : key}:${val};`;
//     return null;
//   }
//   if (key === "break-after") {
//     if (["auto", "avoid", "all", "avoid-page"].includes(val)) return `break-after:${val};`;
//     return null;
//   }
//   if (key === "break-before") {
//     if (["auto", "avoid", "all", "avoid-page"].includes(val)) return `break-before:${val};`;
//     return null;
//   }
//   if (key === "break-inside") {
//     if (["auto", "avoid"].includes(val)) return `break-inside:${val};`;
//     return null;
//   }
//   // Writing mode
//   if (key === "writing") {
//     if (["horizontal-tb", "vertical-rl", "vertical-lr"].includes(val)) return `writing-mode:${val};`;
//     return null;
//   }
//   // Filters & presets
//   if (key === "blur") {
//     const norm = normalizeTokenValueForProperty("filter-blur", val);
//     if (norm === null) return null;
//     return `filter:blur(${norm});`;
//   }
//   if (key === "backdrop-blur") {
//     const norm = normalizeTokenValueForProperty("backdrop-filter", val);
//     if (norm === null) return null;
//     return `backdrop-filter:blur(${norm});`;
//   }
//   // In the Filters & presets section of handle function, replace the existing 'filter' block:
// if (key === "filter" && val) {
//   // convenience presets: filter-brightness-150 -> brightness(1.5)
//   if (val.startsWith("brightness-")) {
//     const n = val.split("-")[1];
//     return `filter:brightness(${Number(n) / 100});`;
//   }
//   if (val.startsWith("contrast-")) {
//     const n = val.split("-")[1];
//     return `filter:contrast(${Number(n) / 100});`;
//   }
//   if (val.startsWith("saturate-")) {
//     const n = val.split("-")[1];
//     return `filter:saturate(${Number(n) / 100});`;
//   }
//   // New: Arbitrary advanced filters (e.g., contrast-2 -> contrast(2), grayscale-75 -> grayscale(75%))
//   const filterMatch = val.match(/^([a-z-]+)-?(\d+(\.\d+)?)?$/);
//   if (filterMatch) {
//     const filterType = filterMatch[1];
//     const filterVal = filterMatch[2];
//     let normalizedVal: string = filterVal ? filterVal : '100%';
//     if (['grayscale', 'sepia', 'invert'].includes(filterType)) {
//       normalizedVal = `${filterVal || 100}%`;
//     }
//     if (['brightness', 'contrast', 'saturate', 'opacity'].includes(filterType)) {
//       normalizedVal = `${Number(filterVal || 100) / 100}`;
//     } else if (filterType === 'blur') {
//       normalizedVal = ensureUnitForLength(filterVal || '0px');
//     } else if (filterType === 'hue-rotate') {
//       normalizedVal = `${filterVal || 0}deg`;
//     }
//     return `filter:${filterType}(${normalizedVal});`;
//   }
//   return `filter:${val};`;
// }
//   if (key === "drop-shadow") {
//     const shadowMap: Record<string, string> = {
//       sm: "0 1px 1px 0 rgb(0 0 0 / 0.05)",
//       "": "0 1px 2px 0 rgb(0 0 0 / 0.1)",
//       md: "0 4px 3px 0 rgb(0 0 0 / 0.07), 0 2px 2px 0 rgb(0 0 0 / 0.06)",
//       lg: "0 10px 8px 0 rgb(0 0 0 / 0.1), 0 4px 3px 0 rgb(0 0 0 / 0.07)",
//       xl: "0 20px 13px 0 rgb(0 0 0 / 0.1), 0 8px 4px 0 rgb(0 0 0 / 0.06)",
//       "2xl": "0 25px 25px -12px rgb(0 0 0 / 0.25)",
//       none: "0 0 #0000",
//     };
//     if (shadowMap[val]) return `filter:drop-shadow(${shadowMap[val]});`;
//     return `filter:drop-shadow(${val});`;
//   }
//   // Object-fit
//   if (key === "object") {
//     if (["cover", "contain", "fill", "none", "scale-down"].includes(val)) return `object-fit:${val};`;
//     return null;
//   }
//   if (key === "object-position") {
//     return `object-position:${val};`;
//   }
//   // Opacity
//   if (key === "opacity") {
//     const op = Number(val);
//     if (isNaN(op) || op < 0 || op > 100) return null;
//     return `opacity:${op / 100};`;
//   }
//   // Blend modes
//   if (key === "bg-blend" || key === "background-blend-mode") {
//     const blendMap: Record<string, string> = {
//       multiply: "multiply",
//       screen: "screen",
//       overlay: "overlay",
//       darken: "darken",
//       lighten: "lighten",
//       color_dodge: "color-dodge",
//       color_burn: "color-burn",
//       hard_light: "hard-light",
//       soft_light: "soft-light",
//       difference: "difference",
//       exclusion: "exclusion",
//       hue: "hue",
//       saturation: "saturation",
//       color: "color",
//       luminosity: "luminosity",
//       normal: "normal",
//     };
//     if (blendMap[val]) return `background-blend-mode:${blendMap[val]};`;
//     return null;
//   }
//   if (key === "mix-blend" || key === "mix-blend-mode") {
//     const blendMap: Record<string, string> = {
//       multiply: "multiply",
//       screen: "screen",
//       overlay: "overlay",
//       darken: "darken",
//       lighten: "lighten",
//       color_dodge: "color-dodge",
//       color_burn: "color-burn",
//       hard_light: "hard-light",
//       soft_light: "soft-light",
//       difference: "difference",
//       exclusion: "exclusion",
//       hue: "hue",
//       saturation: "saturation",
//       color: "color",
//       luminosity: "luminosity",
//       plus_lighter: "plus-lighter",
//       normal: "normal",
//     };
//     if (blendMap[val]) return `mix-blend-mode:${blendMap[val]};`;
//     return null;
//   }
//   // Forms & tables (more detailed)
//   if (key === "form-input") {
//     const decl = [
//       "padding:0.5rem 0.75rem",
//       "border:1px solid #d1d5db",
//       "border-radius:0.5rem",
//       "background:#fff",
//       "color:inherit",
//       "outline:none",
//       "box-sizing:border-box",
//     ].join(";");
//     const focus = `__SELF__:focus { box-shadow: 0 0 0 3px rgba(59,130,246,0.12); border-color:#3b82f6; }`;
//     return { decl: `${decl};`, extra: focus };
//   }
//   if (key === "form-select") {
//     const decl = [
//       "padding:0.5rem 0.75rem",
//       "border:1px solid #d1d5db",
//       "border-radius:0.5rem",
//       "background:#fff url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%23888'><path d='M5.25 6.25L10 10.75 14.75 6.25' /></svg>\") no-repeat right 0.75rem center/1em",
//       "appearance:none",
//     ].join(";");
//     return { decl: `${decl};`, extra: "" };
//   }
//   if (key === "form-textarea") {
//     const decl = "padding:0.5rem;border:1px solid #d1d5db;border-radius:0.5rem;background:#fff;min-height:80px";
//     return { decl: `${decl};`, extra: "" };
//   }
//   if (key === "form-checkbox") {
//     const decl = "width:1rem;height:1rem;border:1px solid #d1d5db;border-radius:0.125rem";
//     return decl;
//   }
//   if (key === "form-radio") {
//     const decl = "width:1rem;height:1rem;border:1px solid #d1d5db;border-radius:9999px";
//     return decl;
//   }
//   // Table
//   if (key === "table") {
//     const decl = "width:100%;border-collapse:collapse";
//     const stripe = `__SELF__ tbody tr:nth-child(odd) { background:#fff } __SELF__ tbody tr:nth-child(even) { background:#f8fafc }`;
//     return { decl: `${decl};`, extra: stripe };
//   }
//   if (key === "table-layout") {
//     if (["auto", "fixed"].includes(val)) return `table-layout:${val};`;
//     return null;
//   }
//   if (key === "caption-side") {
//     if (["top", "bottom"].includes(val)) return `caption-side:${val};`;
//     return null;
//   }
//   if (key === "border-collapse") {
//     if (["collapse", "separate"].includes(val)) return `border-collapse:${val};`;
//     return null;
//   }
//   if (key === "border-spacing") {
//     const norm = normalizeTokenValueForProperty("border-spacing", val);
//     if (norm) return `border-spacing:${norm};`;
//     return null;
//   }
//   // Container
//   if (key === "container") {
//     const bp = (configDefault as any).breakpoints || {};
//     const rules: string[] = [];
//     rules.push(`__SELF__ { width:100%; margin-left:auto; margin-right:auto; padding-left:1rem; padding-right:1rem; }`);
//     if (bp.sm) rules.push(`@media (min-width: ${bp.sm}) { __SELF__ { max-width:640px; } }`);
//     if (bp.md) rules.push(`@media (min-width: ${bp.md}) { __SELF__ { max-width:768px; } }`);
//     if (bp.lg) rules.push(`@media (min-width: ${bp.lg}) { __SELF__ { max-width:1024px; } }`);
//     if (bp.xl) rules.push(`@media (min-width: ${bp.xl}) { __SELF__ { max-width:1280px; } }`);
//     return { decl: "", extra: rules.join("\n") };
//   }
//   // Glass utility (built-in default)
//   if (key === "glass") {
//     return `background: rgba(255,255,255,0.08); backdrop-filter: blur(6px); border-radius:8px;`;
//   }
//   // ========== NEW ADDITIONS TO SUPERPASS TAILWIND ==========
//   // Typography: font-family
//   if (key === "font") {
//     const fontMap: Record<string, string> = {
//       sans: "ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji",
//       serif: "ui-serif,Georgia,Cambria,Times New Roman,Times,serif",
//       mono: "ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace",
//     };
//     if (fontMap[val]) return `font-family:${fontMap[val]};`;
//     return `font-family:${val};`;
//   }
//   // Typography: text size with leading (e.g., text-sm -> font-size:0.875rem; line-height:1.25rem)
//   if (key === "ts" || key === "text-size") {
//     const textSizeMap: Record<string, string> = {
//       xs: "font-size:0.75rem;line-height:1rem;",
//       sm: "font-size:0.875rem;line-height:1.25rem;",
//       base: "font-size:1rem;line-height:1.5rem;",
//       lg: "font-size:1.125rem;line-height:1.75rem;",
//       xl: "font-size:1.25rem;line-height:1.75rem;",
//       "2xl": "font-size:1.5rem;line-height:2rem;",
//       "3xl": "font-size:1.875rem;line-height:2.25rem;",
//       "4xl": "font-size:2.25rem;line-height:2.5rem;",
//       "5xl": "font-size:3rem;line-height:1;",
//       "6xl": "font-size:3.75rem;line-height:1;",
//     };
//     if (textSizeMap[val]) return textSizeMap[val];
//     const norm = normalizeTokenValueForProperty("font-size", val);
//     if (norm) return `font-size:${norm};`;
//     return null;
//   }
//   // Font weight (expand on fallback fw)
//   if (key === "fw" || key === "font-weight") {
//     const weightMap: Record<string, string> = {
//       thin: "100", extralight: "200", light: "300", normal: "400", medium: "500",
//       semibold: "600", bold: "700", extrabold: "800", black: "900",
//     };
//     if (weightMap[val]) return `font-weight:${weightMap[val]};`;
//     if (/^\d+$/.test(val)) return `font-weight:${val};`;
//     return null;
//   }
//   // Text align
//   if (key === "ta" || key === "text-align") {
//     if (["left", "center", "right", "justify"].includes(val)) return `text-align:${val};`;
//     return null;
//   }
//   // Text decoration
//   if (key === "td" || key === "text-decoration") {
//     if (["none", "underline", "overline", "line-through"].includes(val)) return `text-decoration:${val};`;
//     if (val) return `text-decoration:${val};`;
//     return null;
//   }
//   // Text transform
//   if (key === "tt" || key === "text-transform") {
//     if (["none", "capitalize", "uppercase", "lowercase", "full-width"].includes(val)) return `text-transform:${val};`;
//     return null;
//   }
//   // Vertical align
//   if (key === "va" || key === "vertical-align") {
//     if (["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super"].includes(val)) return `vertical-align:${val};`;
//     return null;
//   }
//   // Whitespace
//   if (key === "ws" || key === "whitespace") {
//     if (["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"].includes(val)) return `white-space:${val};`;
//     return null;
//   }
//   // Word break / overflow-wrap
//   if (key === "break" || key === "word-break") {
//     if (["normal", "break-all", "break-word"].includes(val)) return `word-break:${val}; overflow-wrap:break-word;`;
//     return null;
//   }
//   if (key === "ow" || key === "overflow-wrap") {
//     if (["normal", "anywhere", "break-word"].includes(val)) return `overflow-wrap:${val};`;
//     return null;
//   }
//   // Hyphens
//   if (key === "hyphens") {
//     if (["none", "manual", "auto"].includes(val)) return `hyphens:${val};`;
//     return null;
//   }
//   // Line clamp
//   if (key === "line-clamp") {
//     if (/^\d+$/.test(val)) {
//       const n = val;
//       return `display:-webkit-box; -webkit-line-clamp:${n}; -webkit-box-orient:vertical; overflow:hidden;`;
//     }
//     return null;
//   }
//   // Text indent
//   if (key === "ti" || key === "text-indent") {
//     const norm = normalizeTokenValueForProperty("text-indent", val);
//     if (norm) return `text-indent:${norm};`;
//     return null;
//   }
//   // Font variant numeric
//   if (key === "fv" || key === "font-variant-numeric") {
//     if (["normal", "oldstyle-nums", "proportional-nums", "tabular-nums", "diagonal-fractions", "stacked-fractions"].includes(val)) return `font-variant-numeric:${val};`;
//     return null;
//   }
//   // Advanced typography
//   if (key === "font-feature-settings") {
//     if (val === "normal" || val === "auto") return `font-feature-settings:${val};`;
//     return `font-feature-settings:${val};`;
//   }
//   if (key === "text-shadow") {
//     const shadowMap: Record<string, string> = {
//       none: "none",
//       sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
//       "": "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px 0 rgb(0 0 0 / 0.1)",
//       md: "0 4px 3px -1px rgb(0 0 0 / 0.1), 0 2px 2px 0 rgb(0 0 0 / 0.07)",
//       lg: "0 10px 8px -3px rgb(0 0 0 / 0.1), 0 4px 3px 0 rgb(0 0 0 / 0.07)",
//       xl: "0 20px 13px -3px rgb(0 0 0 / 0.1), 0 8px 6px -1px rgb(0 0 0 / 0.06)",
//       "2xl": "0 25px 25px -12px rgb(0 0 0 / 0.25)",
//     };
//     if (shadowMap[val]) return `text-shadow:${shadowMap[val]};`;
//     return `text-shadow:${val};`;
//   }
//   // List style
//   if (key === "ls" || key === "list-style") {
//     if (val === "none") return `list-style:none;`;
//     return `list-style:${val};`;
//   }
//   if (key === "lsp" || key === "list-style-position") {
//     if (["inside", "outside"].includes(val)) return `list-style-position:${val};`;
//     return null;
//   }
//   // Background attachment
//   if (key === "ba" || key === "bg-attachment") {
//     if (["fixed", "local", "scroll"].includes(val)) return `background-attachment:${val};`;
//     return null;
//   }
//   // Background clip
//   if (key === "bc" || key === "bg-clip") {
//     if (["border", "padding", "content", "text"].includes(val)) return `background-clip:${val}; -webkit-background-clip:${val};`;
//     return null;
//   }
//   // Background origin
//   if (key === "bo" || key === "bg-origin") {
//     if (["border", "padding", "content"].includes(val)) return `background-origin:${val};`;
//     return null;
//   }
//   // Background position
//   if (key === "bp" || key === "bg-position") {
//     return `background-position:${val};`;
//   }
//   // Background repeat
//   if (key === "brp" || key === "bg-repeat") {
//     if (["no-repeat", "repeat", "repeat-x", "repeat-y", "round", "space"].includes(val)) return `background-repeat:${val};`;
//     return null;
//   }
//   // Background size
//   if (key === "bs" || key === "bg-size") {
//     if (val === "auto" || val === "cover" || val === "contain") return `background-size:${val};`;
//     const norm = normalizeTokenValueForProperty("background-size", val);
//     if (norm) return `background-size:${norm};`;
//     return null;
//   }
//   // Background image (arbitrary or preset)
//   if (key === "bi" || key === "bg-image") {
//     if (isArbitrary(val)) return `background-image:${val};`;
//     return `background-image:url(${val});`;
//   }
//   // Borders: width
//   if (key === "bw" || key === "border-width") {
//     const norm = ensureUnitForLength(val || "1px");
//     return `border-width:${norm};`;
//   }
//   // Borders: style
//   if (key === "bs" || key === "border-style") {  // Note: bs conflicts with bg-size, but parser handles key-value
//     if (["solid", "dashed", "dotted", "double", "hidden", "none", "groove", "ridge", "inset", "outset"].includes(val)) return `border-style:${val};`;
//     return null;
//   }
//   // Border opacity (for divide too, but separate)
//   if (key === "bo" || key === "border-opacity") {  // bo conflicts, but ok
//     if (/^\d+(\.\d+)?$/.test(val)) {
//       return `--garur-border-opacity:${val};`;
//     }
//     return null;
//   }
//   // Divide opacity
//   if (key === "divide-opacity") {
//     if (/^\d+(\.\d+)?$/.test(val)) {
//       return { decl: `--garur-divide-opacity:${val};`, selectorSuffix: " > * + *" };
//     }
//     return null;
//   }
//   // Box shadow
//   if (key === "shadow") {
//     const shadowMap: Record<string, string> = {
//       sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
//       "": "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",  // default md
//       md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
//       lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
//       xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
//       "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
//       inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
//       none: "0 0 #0000",
//     };
//     if (shadowMap[val]) return `box-shadow:${shadowMap[val]};`;
//     const norm = normalizeTokenValueForProperty("box-shadow", val);
//     if (norm) return `box-shadow:${norm};`;
//     return null;
//   }
//   // Outline
//   if (key === "outline") {
//     if (val === "none") return `outline:none;`;
//     const norm = normalizeTokenValueForProperty("outline", val);
//     if (norm) return `outline:${norm};`;
//     return null;
//   }
//   // Filters: additional presets
//   if (key === "grayscale") {
//     if (val === "") return `filter:grayscale(100%);`;
//     if (/^\d+(\.\d+)?$/.test(val)) return `filter:grayscale(${val}%);`;
//     return null;
//   }
//   if (key === "hue-rotate") {
//     const norm = normalizeTokenValueForProperty("transform-rotate", val);
//     if (norm) return `filter:hue-rotate(${norm});`;
//     return null;
//   }
//   if (key === "invert") {
//     if (val === "") return `filter:invert(100%);`;
//     if (/^\d+(\.\d+)?$/.test(val)) return `filter:invert(${val}%);`;
//     return null;
//   }
//   if (key === "sepia") {
//     if (val === "") return `filter:sepia(100%);`;
//     if (/^\d+(\.\d+)?$/.test(val)) return `filter:sepia(${val}%);`;
//     return null;
//   }
//   // Backdrop additional
//   if (key === "backdrop-brightness") {
//     if (/^\d+(\.\d+)?$/.test(val)) return `backdrop-filter:brightness(${Number(val)/100});`;
//     return null;
//   }
//   if (key === "backdrop-contrast") {
//     if (/^\d+(\.\d+)?$/.test(val)) return `backdrop-filter:contrast(${Number(val)/100});`;
//     return null;
//   }
//   if (key === "backdrop-grayscale") {
//     if (val === "") return `backdrop-filter:grayscale(100%);`;
//     if (/^\d+(\.\d+)?$/.test(val)) return `backdrop-filter:grayscale(${val}%);`;
//     return null;
//   }
//   if (key === "backdrop-hue-rotate") {
//     const norm = normalizeTokenValueForProperty("transform-rotate", val);
//     if (norm) return `backdrop-filter:hue-rotate(${norm});`;
//     return null;
//   }
//   if (key === "backdrop-invert") {
//     if (val === "") return `backdrop-filter:invert(100%);`;
//     if (/^\d+(\.\d+)?$/.test(val)) return `backdrop-filter:invert(${val}%);`;
//     return null;
//   }
//   if (key === "backdrop-opacity") {
//     if (/^\d+(\.\d+)?$/.test(val)) return `backdrop-filter:opacity(${val});`;
//     return null;
//   }
//   if (key === "backdrop-saturate") {
//     if (/^\d+(\.\d+)?$/.test(val)) return `backdrop-filter:saturate(${Number(val)/100});`;
//     return null;
//   }
//   if (key === "backdrop-sepia") {
//     if (val === "") return `backdrop-filter:sepia(100%);`;
//     if (/^\d+(\.\d+)?$/.test(val)) return `backdrop-filter:sepia(${val}%);`;
//     return null;
//   }
//   // Transitions
//   if (key === "transition") {
//     if (val === "") return `transition-property:all; transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1); transition-duration:150ms;`;
//     if (["all", "none"].includes(val)) return `transition-property:${val};`;
//     return `transition:${val};`;
//   }
//   if (key === "duration" || key === "transition-duration") {
//     const norm = ensureTimeUnit(val || "150ms");
//     return `transition-duration:${norm};`;
//   }
//   if (key === "ttf" || key === "transition-timing-function") {
//     if (["linear", "in", "out", "in-out"].includes(val)) return `transition-timing-function:cubic-bezier(var(--tw-ease-${val}));`;  // Assume vars defined elsewhere
//     return `transition-timing-function:${val};`;
//   }
//   if (key === "delay" || key === "transition-delay") {
//     const norm = ensureTimeUnit(val || "0ms");
//     return `transition-delay:${norm};`;
//   }
//   // Interactivity: cursor (expand)
//   if (key === "cursor") {
//     if (["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out"].includes(val)) return `cursor:${val};`;
//     return null;
//   }
//   // Appearance
//   if (key === "appearance") {
//     if (["none", ""].includes(val)) return `appearance:${val}; -webkit-appearance:${val}; -moz-appearance:${val};`;
//     return null;
//   }
//   // Pointer events
//   if (key === "pe" || key === "pointer-events") {
//     if (["none", "auto"].includes(val)) return `pointer-events:${val};`;
//     return null;
//   }
//   // Resize
//   if (key === "resize") {
//     if (["none", "both", "horizontal", "vertical"].includes(val)) return `resize:${val};`;
//     return null;
//   }
//   // Scroll behavior
//   if (key === "scroll") {
//     if (["auto", "smooth"].includes(val)) return `scroll-behavior:${val};`;
//     return null;
//   }
//   // Scroll margin / padding
//   if (key === "smg" || key === "scroll-margin") {
//     const norm = normalizeTokenValueForProperty("scroll-margin", val);
//     if (norm) return `scroll-margin:${norm};`;
//     return null;
//   }
//   if (key === "spd" || key === "scroll-padding") {
//     const norm = normalizeTokenValueForProperty("scroll-padding", val);
//     if (norm) return `scroll-padding:${norm};`;
//     return null;
//   }
//   // Scroll snap
//   if (key === "snap-align" || key === "scroll-snap-align") {
//     if (["none", "start", "end", "center", "start center", "end center"].includes(val)) return `scroll-snap-align:${val};`;
//     return null;
//   }
//   if (key === "snap-stop" || key === "scroll-snap-stop") {
//     if (["normal", "always"].includes(val)) return `scroll-snap-stop:${val};`;
//     return null;
//   }
//   if (key === "snap-type" || key === "scroll-snap-type") {
//     if (val === "none") return `scroll-snap-type:none;`;
//     if (val) return `scroll-snap-type:${val};`;
//     return null;
//   }
//   // Touch action
//   if (key === "touch") {
//     if (["auto", "none", "pan-x", "pan-left", "pan-right", "pan-y", "pan-up", "pan-down", "pan-x pan-y", "manipulation"].includes(val)) return `touch-action:${val};`;
//     return null;
//   }
//   // User select
//   if (key === "select" || key === "user-select") {
//     if (["none", "text", "all", "auto"].includes(val)) return `user-select:${val}; -webkit-user-select:${val}; -moz-user-select:${val}; -ms-user-select:${val};`;
//     return null;
//   }
//   // Will change
//   if (key === "will-change") {
//     return `will-change:${val};`;
//   }
//   // Accent color
//   if (key === "accent") {
//     const c = resolvePaletteColor(val) || normalizeColorToken(val);
//     if (c) return `accent-color:${c};`;
//     return null;
//   }
//   // Caret color
//   if (key === "caret") {
//     const c = resolvePaletteColor(val) || normalizeColorToken(val);
//     if (c) return `caret-color:${c};`;
//     return null;
//   }
//   // SVG: fill
//   if (key === "fill") {
//     const p = resolvePaletteColor(val);
//     if (p) return `fill:${p};`;
//     const c = normalizeColorToken(val);
//     if (c) return `fill:${c};`;
//     return null;
//   }
//   // SVG: stroke
//   if (key === "stroke") {
//     const p = resolvePaletteColor(val);
//     if (p) return `stroke:${p};`;
//     const c = normalizeColorToken(val);
//     if (c) return `stroke:${c};`;
//     return null;
//   }
//   // SVG: stroke width
//   if (key === "sw" || key === "stroke-width") {
//     const norm = ensureUnitForLength(val);
//     return `stroke-width:${norm};`;
//   }
//   // Additional SVG
//   if (key === "stroke-dasharray") {
//     return `stroke-dasharray:${val};`;
//   }
//   if (key === "stroke-linecap") {
//     if (["butt", "round", "square"].includes(val)) return `stroke-linecap:${val};`;
//     return null;
//   }
//   if (key === "stroke-linejoin") {
//     if (["miter", "round", "bevel"].includes(val)) return `stroke-linejoin:${val};`;
//     return null;
//   }
//   // Accessibility: sr-only
//   if (key === "sr-only") {
//     return `position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0, 0, 0, 0);white-space:nowrap;border-width:0;`;
//   }
//   if (key === "not-sr-only") {
//     return `position:static;width:auto;height:auto;padding:0;margin:0;overflow:visible;clip:auto;white-space:normal;border-width:0;`;
//   }
//   if (key === "focus-visible") {
//     return `@media (supports: (focus-visible: focus)) { &__SELF__:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; } }`;
//   }
//   // Box sizing
//   if (key === "box") {
//     if (["border", "content"].includes(val)) return `box-sizing:${val}-box;`;
//     return null;
//   }
//   // Float
//   if (key === "float") {
//     if (["none", "left", "right"].includes(val)) return `float:${val};`;
//     return null;
//   }
//   // Clear
//   if (key === "clear") {
//     if (["none", "left", "right", "both"].includes(val)) return `clear:${val};`;
//     return null;
//   }
//   // Isolation
//   if (key === "isolate") {
//     if (val === "") return `isolation:isolate;`;
//     return null;
//   }
//   // Overflow
//   if (key === "overflow") {
//     if (["visible", "hidden", "scroll", "auto"].includes(val)) return `overflow:${val};`;
//     return null;
//   }
//   if (key === "overflow-x") {
//     if (["visible", "hidden", "scroll", "auto"].includes(val)) return `overflow-x:${val};`;
//     return null;
//   }
//   if (key === "overflow-y") {
//     if (["visible", "hidden", "scroll", "auto"].includes(val)) return `overflow-y:${val};`;
//     return null;
//   }
//   // Z-index (expand)
//   if (key === "z") {
//     if (/^-?\d+$/.test(val)) return `z-index:${val};`;
//     const zMap: Record<string, string> = { auto: "auto" };
//     if (zMap[val]) return `z-index:${zMap[val]};`;
//     return null;
//   }
//   // Order (flex/grid)
//   if (key === "order") {
//     if (/^-?\d+$/.test(val)) return `order:${val};`;
//     return null;
//   }
//   // Flex: additional
//   if (key === "flex-wrap") {
//     if (["wrap", "nowrap", "wrap-reverse"].includes(val)) return `flex-wrap:${val};`;
//     return null;
//   }
//   if (key === "flex-grow") {
//     if (/^\d+$/.test(val)) return `flex-grow:${val};`;
//     return null;
//   }
//   if (key === "flex-shrink") {
//     if (/^\d+$/.test(val)) return `flex-shrink:${val};`;
//     return null;
//   }
//   // Align / Justify
//   if (key === "items" || key === "align-items") {
//     if (["start", "end", "center", "stretch", "baseline"].includes(val)) return `align-items:${val};`;
//     return null;
//   }
//   if (key === "justify") {
//     if (["start", "end", "center", "between", "around", "evenly"].includes(val)) return `justify-content:${val};`;
//     return null;
//   }
//   if (key === "align" || key === "align-self") {
//     if (["auto", "start", "end", "center", "stretch", "baseline"].includes(val)) return `align-self:${val};`;
//     return null;
//   }
//   if (key === "justify-self") {
//     if (["auto", "start", "end", "center", "stretch"].includes(val)) return `justify-self:${val};`;
//     return null;
//   }
//   if (key === "place-items") {
//     if (val) return `place-items:${val};`;
//     return null;
//   }
//   if (key === "place-content") {
//     if (val) return `place-content:${val};`;
//     return null;
//   }
//   // Grid: additional
//   if (key === "grid-rows") {
//     const n = Number(val);
//     if (!isNaN(n) && n > 0) return `grid-template-rows: repeat(${n}, minmax(0,1fr));`;
//     return null;
//   }
//   if (key === "grid-flow") {
//     if (["row", "col", "dense", "row-dense", "col-dense"].includes(val)) return `grid-auto-flow:${val};`;
//     return null;
//   }
//   // Overscroll behavior
//   if (key === "overscroll") {
//     if (["auto", "contain", "none"].includes(val)) return `overscroll-behavior:${val};`;
//     return null;
//   }
//   // Print
//   if (key === "print") {
//     if (val === "hidden") return `@media print { display:none; }`;
//     return null;
//   }
//   // Content visibility
//   if (key === "content-visibility") {
//     if (["visible", "hidden", "auto"].includes(val)) return `content-visibility:${val};`;
//     return null;
//   }
//   // Scrollbar
//   if (key === "scrollbar") {
//     if (val === "thin") return `scrollbar-width:thin;`;
//     return null;
//   }
//   if (key === "scrollbar-color") {
//     const [thumb, track] = val.split(" ");
//     const thumbC = normalizeColorToken(thumb) || thumb;
//     const trackC = normalizeColorToken(track) || track;
//     return `--garur-scrollbar-thumb:${thumbC}; --garur-scrollbar-track:${trackC}; scrollbar-color:var(--garur-scrollbar-thumb) var(--garur-scrollbar-track);`;
//   }
//   // Scrollbar gutter
//   if (key === "scrollbar-gutter") {
//     if (["stable", "stable both-edges"].includes(val)) return `scrollbar-gutter:${val};`;
//     return null;
//   }
//   // ========== END NEW ADDITIONS ==========
//   // Fallback skeleton properties
//   const skeletonMap: Record<string, string> = {
//     w: "width", h: "height", p: "padding", m: "margin", fs: "font-size", fw: "font-weight",
//     z: "z-index", cursor: "cursor", opacity: "opacity",
//   };
//   if (skeletonMap[key]) {
//     const prop = skeletonMap[key];
//     const norm = normalizeTokenValueForProperty(prop, val);
//     if (norm === null) return null;
//     return `${prop}:${norm};`;
//   }
//   // Plugin hooks last
//   const hooks = plugin.getHandlerHooks();
//   for (const h of hooks) {
//     try {
//       const r = h(token);
//       if (r) return r;
//     } catch {
//       // ignore plugin errors
//     }
//   }
//   return null;
// }
// export default { handle, UTIL_DOCS };
