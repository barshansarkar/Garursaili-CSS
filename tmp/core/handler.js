// src/handler.ts
// ok it's 3:42 am and this file is why i hate my life
// robust? mature? sure if you say so. i just want it to work
// barshan here, crying over tailwind clones at 3am
import configDefault from "../config/garur.config";
import { normalizeColorToken, ensureUnitForLength, } from "../utils/sanitizer";
import plugin from "../plugin";
// error handling utilities because everything breaks
class HandlerError extends Error {
    token;
    context;
    constructor(message, token, context) {
        super(message);
        this.token = token;
        this.context = context;
        this.name = 'HandlerError';
    }
}
const logger = {
    warn: (message, token) => {
        if (process.env.NODE_ENV !== 'production') {
            console.warn(`[Garur Handler] ${message}`, token || '');
        }
    },
    error: (message, token) => {
        if (process.env.NODE_ENV !== 'production') {
            console.error(`[Garur Handler] ${message}`, token || '');
        }
    }
};
const config = configDefault;
// enhanced UTIL_DOCS with categories why so many
export const UTIL_DOCS = [
    // Layout
    { id: "container", desc: "Container width helper", example: "container", category: "layout" },
    { id: "flex", desc: "Display flex", example: "flex", category: "layout" },
    { id: "grid", desc: "Display grid", example: "grid", category: "layout" },
    { id: "hidden", desc: "Display none", example: "hidden", category: "layout" },
    // Spacing
    { id: "p-4", desc: "Padding", example: "p-4", category: "spacing" },
    { id: "m-2", desc: "Margin", example: "m-2", category: "spacing" },
    { id: "mx-auto", desc: "Horizontal auto margin", example: "mx-auto", category: "spacing" },
    // Sizing
    { id: "w-full", desc: "Width 100%", example: "w-full", category: "sizing" },
    { id: "h-screen", desc: "Height 100vh", example: "h-screen", category: "sizing" },
    // Colors
    { id: "bg-red-500", desc: "Background color from palette", example: "bg-red-500", category: "colors" },
    { id: "text-gray-700", desc: "Text color from palette", example: "text-gray-700", category: "colors" },
    { id: "border-blue-300", desc: "Border color from palette", example: "border-blue-300", category: "colors" },
    { id: "bg-red-500/50", desc: "Background with 50% opacity", example: "bg-red-500/50", category: "colors" },
    // Typography
    { id: "text-lg", desc: "Large text", example: "text-lg", category: "typography" },
    { id: "font-bold", desc: "Bold font weight", example: "font-bold", category: "typography" },
    { id: "text-center", desc: "Text align center", example: "text-center", category: "typography" },
    // Effects
    { id: "shadow-lg", desc: "Large shadow", example: "shadow-lg", category: "effects" },
    { id: "blur-sm", desc: "Small blur", example: "blur-sm", category: "effects" },
    { id: "opacity-50", desc: "50% opacity", example: "opacity-50", category: "effects" },
    // Transforms
    { id: "rotate-45", desc: "45 degree rotation", example: "rotate-45", category: "transforms" },
    { id: "scale-110", desc: "110% scale", example: "scale-110", category: "transforms" },
    { id: "translate-x-4", desc: "Horizontal translation", example: "translate-x-4", category: "transforms" },
    // Interactivity
    { id: "hover:bg-blue-500", desc: "Hover background color", example: "hover:bg-blue-500", category: "interactivity" },
    { id: "focus:ring-2", desc: "Focus ring", example: "focus:ring-2", category: "interactivity" },
    { id: "cursor-pointer", desc: "Pointer cursor", example: "cursor-pointer", category: "interactivity" },
    // Animation
    { id: "animate-spin", desc: "Spin animation", example: "animate-spin", category: "animation" },
    { id: "transition-all", desc: "Transition all properties", example: "transition-all", category: "animation" },
    // Layout New
    { id: "aspect-video", desc: "Aspect ratio 16:9", example: "aspect-video", category: "layout" },
    { id: "grid-cols-3", desc: "3 column grid", example: "grid-cols-3", category: "layout" },
    { id: "grow", desc: "Flex grow", example: "grow", category: "layout" },
    // Typography New
    { id: "whitespace-nowrap", desc: "No wrap whitespace", example: "whitespace-nowrap", category: "typography" },
    { id: "break-words", desc: "Break words", example: "break-words", category: "typography" },
    { id: "list-disc", desc: "List style disc", example: "list-disc", category: "typography" },
    // Missing: Place items/content
    { id: "place-items-center", desc: "Place items center", example: "place-items-center", category: "layout" },
    { id: "place-content-center", desc: "Place content center", example: "place-content-center", category: "layout" },
    // Missing: Divide
    { id: "divide-x-2", desc: "Divide x with 2px border", example: "divide-x-2", category: "layout" },
    { id: "divide-y-2", desc: "Divide y with 2px border", example: "divide-y-2", category: "layout" },
    // Missing: Fill/Stroke
    { id: "fill-red-500", desc: "SVG fill color", example: "fill-red-500", category: "colors" },
    { id: "stroke-blue-500", desc: "SVG stroke color", example: "stroke-blue-500", category: "colors" },
    // Missing: Object fit
    { id: "object-cover", desc: "Object fit cover", example: "object-cover", category: "sizing" },
    { id: "object-contain", desc: "Object fit contain", example: "object-contain", category: "sizing" },
    // Missing: Content
    { id: "content-none", desc: "No generated content", example: "content-none", category: "layout" },
    { id: "list-none", desc: "No list style", example: "list-none", category: "typography" },
    // Missing: Transform origin
    { id: "origin-center", desc: "Transform origin center", example: "origin-center", category: "transforms" },
    // Missing: Resize
    { id: "resize-none", desc: "No resize", example: "resize-none", category: "interactivity" },
    // Missing: Appearance
    { id: "appearance-none", desc: "No appearance", example: "appearance-none", category: "interactivity" },
    // Missing: Outline
    { id: "outline-none", desc: "No outline", example: "outline-none", category: "interactivity" },
    // Missing: Grayscale
    { id: "grayscale", desc: "Grayscale filter", example: "grayscale", category: "effects" },
    // Missing: Delay/Duration
    { id: "delay-150", desc: "Transition delay 150ms", example: "delay-150", category: "animation" },
    { id: "duration-200", desc: "Transition duration 200ms", example: "duration-200", category: "animation" },
    // Missing: Size square
    { id: "size-4", desc: "Square size 1rem", example: "size-4", category: "sizing" },
    // Missing: Order
    { id: "order-1", desc: "Flex order 1", example: "order-1", category: "layout" },
    // Missing: Ring offset
    { id: "ring-offset-2", desc: "Ring offset 2px", example: "ring-offset-2", category: "effects" },
];
// keyframes why do i have to write these
const KEYFRAMES = {
    spin: `@keyframes garur-spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}`,
    bounce: `@keyframes garur-bounce{0%,20%,53%,80%,100%{transform:translate3d(0,0,0)}40%,43%{transform:translate3d(0,-30px,0)}70%{transform:translate3d(0,-15px,0)}90%{transform:translate3d(0,-4px,0)}}`,
    ping: `@keyframes garur-ping{75%,100%{transform:scale(2);opacity:0}}`,
    pulse: `@keyframes garur-pulse{50%{opacity:.5}}`,
    // Added: Fade in
    'fade-in': `@keyframes garur-fade-in{from{opacity:0}to{opacity:1}}`,
};
/* ---------- Core Utilities ---------- */
// safe color conversion with comprehensive error handling
// this function is my nemesis
function hexToRgba(hex, alpha = 1) {
    try {
        if (!hex || typeof hex !== 'string')
            return null;
        let h = hex.replace("#", "").trim();
        if (!h)
            return null;
        // Handle different hex formats
        if (h.length === 3) {
            h = h.split("").map(c => c + c).join("");
        }
        else if (h.length === 4) {
            const chars = h.split("");
            const r = chars[0] + chars[0];
            const g = chars[1] + chars[1];
            const b = chars[2] + chars[2];
            const aHex = chars[3] + chars[3];
            h = r + g + b;
            const hexAlpha = parseInt(aHex, 16) / 255;
            alpha = alpha * hexAlpha;
        }
        else if (h.length === 8) {
            const aHex = h.slice(6, 8);
            h = h.slice(0, 6);
            const hexAlpha = parseInt(aHex, 16) / 255;
            alpha = alpha * hexAlpha;
        }
        if (h.length !== 6)
            return null;
        const rr = parseInt(h.slice(0, 2), 16);
        const gg = parseInt(h.slice(2, 4), 16);
        const bb = parseInt(h.slice(4, 6), 16);
        if (isNaN(rr) || isNaN(gg) || isNaN(bb))
            return null;
        return `rgba(${rr}, ${gg}, ${bb}, ${Math.max(0, Math.min(1, alpha))})`;
    }
    catch (error) {
        logger.error(`Failed to convert hex to rgba: ${hex}`, undefined);
        return null;
    }
}
// enhanced color resolution with proper priority
// why colors so hard
function resolvePaletteColor(value) {
    if (!value || typeof value !== 'string')
        return null;
    try {
        const parts = value.split("/");
        const colorPart = parts[0]?.trim();
        const alphaPart = parts[1]?.trim();
        if (!colorPart)
            return null;
        const palette = config.palette || config.theme?.colors || {};
        // Direct color match (e.g., "red")
        if (palette[colorPart]) {
            if (typeof palette[colorPart] === 'string') {
                return applyAlphaToColor(palette[colorPart], alphaPart);
            }
            // Object with shades - try 500 as default
            if (typeof palette[colorPart] === 'object' && palette[colorPart]['500']) {
                return applyAlphaToColor(palette[colorPart]['500'], alphaPart);
            }
        }
        // Color-shade pattern (e.g., "red-500")
        const match = colorPart.match(/^([a-zA-Z]+)-(\d{2,3})$/);
        if (match) {
            const [_, colorName, shade] = match;
            if (palette[colorName] && typeof palette[colorName] === 'object' && palette[colorName][shade]) {
                return applyAlphaToColor(palette[colorName][shade], alphaPart);
            }
        }
        return null;
    }
    catch (error) {
        logger.error(`Failed to resolve palette color: ${value}`, undefined);
        return null;
    }
}
function applyAlphaToColor(color, alphaStr) {
    if (!alphaStr)
        return color;
    let alphaNum = parseFloat(alphaStr);
    if (isNaN(alphaNum))
        return color;
    let alpha = alphaNum;
    if (alpha > 1)
        alpha = alpha / 100;
    if (alpha < 0 || alpha > 1)
        return color;
    // Apply alpha based on color type, preserving existing alpha if present
    if (color.startsWith('#')) {
        const rgba = hexToRgba(color, alpha);
        return rgba || color;
    }
    else if (color.startsWith('rgb(')) {
        const match = color.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:\/\s*([\d.]+)\s*)?\)/);
        if (match) {
            const [, r, g, b, oldAlphaStr = '1'] = match;
            const oldAlpha = parseFloat(oldAlphaStr);
            return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, oldAlpha * alpha))})`;
        }
    }
    else if (color.startsWith('hsl(')) {
        const match = color.match(/hsl\s*\(\s*(\d+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*(?:\/\s*([\d.]+)\s*)?\)/);
        if (match) {
            const [, h, s, l, oldAlphaStr = '1'] = match;
            const oldAlpha = parseFloat(oldAlphaStr);
            return `hsla(${h}, ${s}%, ${l}%, ${Math.max(0, Math.min(1, oldAlpha * alpha))})`;
        }
    }
    return color;
}
// enhanced arbitrary value detection
function isArbitrary(value) {
    if (!value || typeof value !== 'string')
        return false;
    return /[\s()\[\]$#]|calc\(|var\(|url\(|gradient\(/i.test(value);
}
// universal arbitrary property support
const ARBITRARY_PROPERTY_RE = /^\[([a-zA-Z0-9\-_]+):\s*([^\]]+)\]$/;
// safe value flattening
function flattenColorPalette(palette) {
    const flat = {};
    try {
        for (const [color, shades] of Object.entries(palette)) {
            if (!shades)
                continue;
            if (typeof shades === "object" && !Array.isArray(shades)) {
                for (const [shade, value] of Object.entries(shades)) {
                    if (typeof value === "string" && value) {
                        flat[`${color}-${shade}`] = value;
                    }
                }
            }
            else if (typeof shades === "string") {
                flat[color] = shades;
            }
        }
    }
    catch (error) {
        logger.error('Failed to flatten color palette', undefined);
    }
    return flat;
}
// enhanced important handling
function addImportant(decl, important) {
    if (!important || !decl)
        return decl;
    return decl
        .split(';')
        .filter(part => part.trim())
        .map(part => {
        const trimmed = part.trim();
        if (!trimmed || trimmed.includes('!important'))
            return trimmed;
        return trimmed + ' !important';
    })
        .join(';') + (decl.endsWith(';') ? '' : ';');
}
// safe arbitrary value extraction
function getArbitraryValue(value, negative) {
    if (!value)
        return null;
    try {
        const match = value.match(/\[([^\[\]]+)\]/);
        if (!match)
            return null;
        let v = match[1].replace(/_/g, ' ').trim();
        if (negative && v && !v.startsWith('-')) {
            v = '-' + v;
        }
        return v || null;
    }
    catch (error) {
        return null;
    }
}
/* ---------- Dynamic Utilities ---------- */
// special handlers for arbitrary values
const specialHandlers = {
    rotate: (v) => `transform: rotate(${v})`,
    scale: (v) => `transform: scale(${v})`,
    'translate-x': (v) => `transform: translateX(${v})`,
    'translate-y': (v) => `transform: translateY(${v})`,
    skew: (v) => `transform: skew(${v})`,
    'skew-x': (v) => `transform: skewX(${v})`,
    'skew-y': (v) => `transform: skewY(${v})`,
    blur: (v) => `filter: blur(${v})`,
    brightness: (v) => `filter: brightness(${v})`,
    contrast: (v) => `filter: contrast(${v})`,
    saturate: (v) => `filter: saturate(${v})`,
    'hue-rotate': (v) => `filter: hue-rotate(${v})`,
    'drop-shadow': (v) => `filter: drop-shadow(${v})`,
    'grid-cols': (v) => `grid-template-columns: ${v}`,
    'grid-rows': (v) => `grid-template-rows: ${v}`,
    'space-x': (v) => `& > :not([hidden]) ~ :not([hidden]) { --garur-space-x-reverse: 0; margin-left: calc(${v} * calc(1 - var(--garur-space-x-reverse))); margin-right: calc(${v} * var(--garur-space-x-reverse)) }`,
    'space-y': (v) => `& > :not([hidden]) ~ :not([hidden]) { --garur-space-y-reverse: 0; margin-top: calc(${v} * calc(1 - var(--garur-space-y-reverse))); margin-bottom: calc(${v} * var(--garur-space-y-reverse)) }`,
    'backdrop-blur': (v) => `backdrop-filter: blur(${v})`,
    // Added: Grayscale
    grayscale: (v) => `filter: grayscale(${v})`,
    // Added: More for missing filters
    sepia: (v) => `filter: sepia(${v})`,
    invert: (v) => `filter: invert(${v})`,
};
function getSpecialHandler(key) {
    return specialHandlers[key];
}
/* ---------- Configuration scales with comprehensive fallbacks ---------- */
const SCALES = {
    spacing: {
        px: "1px", 0: "0", 0.5: "0.125rem", 1: "0.25rem", 1.5: "0.375rem",
        2: "0.5rem", 2.5: "0.625rem", 3: "0.75rem", 3.5: "0.875rem", 4: "1rem",
        5: "1.25rem", 6: "1.5rem", 7: "1.75rem", 8: "2rem", 9: "2.25rem",
        10: "2.5rem", 11: "2.75rem", 12: "3rem", 14: "3.5rem", 16: "4rem",
        20: "5rem", 24: "6rem", 28: "7rem", 32: "8rem", 36: "9rem",
        40: "10rem", 44: "11rem", 48: "12rem", 52: "13rem", 56: "14rem",
        60: "15rem", 64: "16rem", 72: "18rem", 80: "20rem", 96: "24rem",
        ...config.theme?.spacing
    },
    borderRadius: {
        none: "0px", sm: "0.125rem", DEFAULT: "0.25rem", md: "0.375rem",
        lg: "0.5rem", xl: "0.75rem", "2xl": "1rem", "3xl": "1.5rem",
        full: "9999px", ...config.theme?.borderRadius
    },
    borderWidth: {
        0: "0px", 1: "1px", 2: "2px", 4: "4px", 8: "8px",
        DEFAULT: "1px", ...config.theme?.borderWidth
    },
    boxShadow: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
        inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
        none: "none", ...config.theme?.boxShadow
    },
    opacity: {
        0: "0", 5: "0.05", 10: "0.1", 15: "0.15", 20: "0.2", 25: "0.25",
        30: "0.3", 35: "0.35", 40: "0.4", 45: "0.45", 50: "0.5", 55: "0.55",
        60: "0.6", 65: "0.65", 70: "0.7", 75: "0.75", 80: "0.8", 85: "0.85",
        90: "0.9", 95: "0.95", 100: "1"
    },
    zIndex: {
        0: "0", 10: "10", 20: "20", 30: "30", 40: "40", 50: "50",
        auto: "auto", ...config.theme?.zIndex
    },
    // Added: Transition duration/delay
    transitionDuration: {
        75: "75ms", 100: "100ms", 150: "150ms", 200: "200ms", 300: "300ms", 500: "500ms", 700: "700ms", 1000: "1000ms",
        ...config.theme?.transitionDuration
    },
    transitionDelay: {
        75: "75ms", 100: "100ms", 150: "150ms", 200: "200ms", 300: "300ms", 500: "500ms", 700: "700ms", 1000: "1000ms",
        ...config.theme?.transitionDelay
    },
    // Added: Letter spacing
    letterSpacing: {
        tighter: "-0.05em", tight: "-0.025em", snug: "0.025em", normal: "0em", wide: "0.1em", wider: "0.15em", widest: "0.25em",
        ...config.theme?.letterSpacing
    },
    // Added: Font family
    fontFamily: {
        sans: "ui-sans-serif, system-ui, sans-serif",
        serif: "ui-serif, Georgia, serif",
        mono: "ui-monospace, Monaco, monospace",
        ...config.theme?.fontFamily
    }
};
// Core utility generators
function generateLayoutUtilities() {
    const map = {};
    // Display
    const displays = {
        block: "block", "inline-block": "inline-block", inline: "inline",
        flex: "flex", "inline-flex": "inline-flex", grid: "grid",
        "inline-grid": "inline-grid", table: "table",
        "table-cell": "table-cell", "table-row": "table-row",
        "table-caption": "table-caption", hidden: "none"
    };
    Object.entries(displays).forEach(([key, value]) => {
        map[key === 'hidden' ? 'hidden' : key] = `display:${value}`;
    });
    // Position
    const positions = {
        static: "static", relative: "relative", absolute: "absolute",
        fixed: "fixed", sticky: "sticky"
    };
    Object.entries(positions).forEach(([key, value]) => {
        map[key] = `position:${value}`;
    });
    // Container
    map.container = "width:100%;margin-left:auto;margin-right:auto;padding-left:1rem;padding-right:1rem;max-width:1280px";
    // Box Sizing
    map['box-border'] = 'box-sizing:border-box';
    map['box-content'] = 'box-sizing:content-box';
    // Added: Place items
    const placeItems = { start: 'start', end: 'end', center: 'center', stretch: 'stretch' };
    Object.entries(placeItems).forEach(([key, value]) => {
        map[`place-items-${key}`] = `place-items:${value}`;
    });
    // Added: Place content
    const placeContent = { start: 'start', end: 'end', center: 'center', stretch: 'stretch' };
    Object.entries(placeContent).forEach(([key, value]) => {
        map[`place-content-${key}`] = `place-content:${value}`;
    });
    // Added: Order
    const orders = { 0: '0', 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10', 11: '11', 12: '12', first: '-9999', last: '9999' };
    Object.entries(orders).forEach(([key, value]) => {
        map[`order-${key}`] = `order:${value}`;
    });
    // Added: Content
    map['content-none'] = 'content:none';
    return map;
}
function generateSpacingUtilities() {
    const map = {};
    const spacing = SCALES.spacing;
    // Padding
    Object.entries(spacing).forEach(([key, value]) => {
        map[`p-${key}`] = `padding:${value}`;
        map[`pt-${key}`] = `padding-top:${value}`;
        map[`pr-${key}`] = `padding-right:${value}`;
        map[`pb-${key}`] = `padding-bottom:${value}`;
        map[`pl-${key}`] = `padding-left:${value}`;
        map[`px-${key}`] = `padding-left:${value};padding-right:${value}`;
        map[`py-${key}`] = `padding-top:${value};padding-bottom:${value}`;
    });
    // Margin
    Object.entries(spacing).forEach(([key, value]) => {
        map[`m-${key}`] = `margin:${value}`;
        map[`mt-${key}`] = `margin-top:${value}`;
        map[`mr-${key}`] = `margin-right:${value}`;
        map[`mb-${key}`] = `margin-bottom:${value}`;
        map[`ml-${key}`] = `margin-left:${value}`;
        map[`mx-${key}`] = `margin-left:${value};margin-right:${value}`;
        map[`my-${key}`] = `margin-top:${value};margin-bottom:${value}`;
    });
    // Space Between
    Object.entries(spacing).forEach(([key, value]) => {
        map[`space-x-${key}`] = `& > :not([hidden]) ~ :not([hidden]) { --garur-space-x-reverse: 0; margin-left: calc(${value} * calc(1 - var(--garur-space-x-reverse))); margin-right: calc(${value} * var(--garur-space-x-reverse)) }`;
        map[`space-y-${key}`] = `& > :not([hidden]) ~ :not([hidden]) { --garur-space-y-reverse: 0; margin-top: calc(${value} * calc(1 - var(--garur-space-y-reverse))); margin-bottom: calc(${value} * var(--garur-space-y-reverse)) }`;
    });
    // Added: Divide
    Object.entries(spacing).forEach(([key, value]) => {
        const borderWidth = SCALES.borderWidth[key] || value;
        map[`divide-x-${key}`] = `& > :not([hidden]) ~ :not([hidden]) { --garur-divide-x-reverse: 0; border-right-width: calc(${borderWidth} * var(--garur-divide-x-reverse)); border-left-width: calc(${borderWidth} * calc(1 - var(--garur-divide-x-reverse))) }`;
        map[`divide-y-${key}`] = `& > :not([hidden]) ~ :not([hidden]) { --garur-divide-y-reverse: 0; border-bottom-width: calc(${borderWidth} * var(--garur-divide-y-reverse)); border-top-width: calc(${borderWidth} * calc(1 - var(--garur-divide-y-reverse))) }`;
    });
    return map;
}
function generateSizingUtilities() {
    const map = {};
    const spacing = SCALES.spacing;
    // Width & Height from spacing scale
    Object.entries(spacing).forEach(([key, value]) => {
        map[`w-${key}`] = `width:${value}`;
        map[`h-${key}`] = `height:${value}`;
        map[`min-w-${key}`] = `min-width:${value}`;
        map[`min-h-${key}`] = `min-height:${value}`;
        map[`max-w-${key}`] = `max-width:${value}`;
        map[`max-h-${key}`] = `max-height:${value}`;
    });
    // Special sizes
    map['w-full'] = 'width:100%';
    map['w-screen'] = 'width:100vw';
    map['w-auto'] = 'width:auto';
    map['h-full'] = 'height:100%';
    map['h-screen'] = 'height:100vh';
    map['h-auto'] = 'height:auto';
    // Fractional widths and heights
    const fractions = {
        '1/2': '50%', '1/3': '33.333333%', '2/3': '66.666667%',
        '1/4': '25%', '2/4': '50%', '3/4': '75%',
        '1/5': '20%', '2/5': '40%', '3/5': '60%', '4/5': '80%',
        '1/6': '16.666667%', '2/6': '33.333333%', '3/6': '50%',
        '4/6': '66.666667%', '5/6': '83.333333%',
        '1/12': '8.333333%', '2/12': '16.666667%', '3/12': '25%',
        '4/12': '33.333333%', '5/12': '41.666667%', '6/12': '50%',
        '7/12': '58.333333%', '8/12': '66.666667%', '9/12': '75%',
        '10/12': '83.333333%', '11/12': '91.666667%'
    };
    Object.entries(fractions).forEach(([key, value]) => {
        map[`w-${key}`] = `width:${value}`;
        map[`h-${key}`] = `height:${value}`;
        map[`min-w-${key}`] = `min-width:${value}`;
        map[`min-h-${key}`] = `min-height:${value}`;
        map[`max-w-${key}`] = `max-width:${value}`;
        map[`max-h-${key}`] = `max-height:${value}`;
    });
    // Added: Square sizing
    Object.entries(spacing).forEach(([key, value]) => {
        map[`size-${key}`] = `width:${value};height:${value}`;
    });
    // Added: Aspect ratio
    const aspects = { square: '1', video: '16/9', '2/3': '2/3', '3/2': '3/2', '4/3': '4/3', '3/4': '3/4' };
    Object.entries(aspects).forEach(([key, value]) => {
        map[`aspect-${key}`] = `aspect-ratio:${value}`;
    });
    // Added: Object fit
    const objectFit = { contain: 'contain', cover: 'cover', fill: 'fill', none: 'none', scaleDown: 'scale-down' };
    Object.entries(objectFit).forEach(([key, value]) => {
        map[`object-${key}`] = `object-fit:${value}`;
    });
    return map;
}
function generateColorUtilities() {
    const map = {};
    const palette = config.palette || config.theme?.colors || {};
    const flatColors = flattenColorPalette(palette);
    const opacitySteps = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
    // Background colors
    Object.entries(flatColors).forEach(([colorToken, color]) => {
        map[`bg-${colorToken}`] = `background-color:${color}`;
        // Opacity variants
        opacitySteps.forEach(opacity => {
            const rgbaColor = applyAlphaToColor(color, opacity.toString());
            map[`bg-${colorToken}\\/${opacity}`] = `background-color:${rgbaColor}`;
        });
    });
    // Text colors
    Object.entries(flatColors).forEach(([colorToken, color]) => {
        map[`text-${colorToken}`] = `color:${color}`;
        opacitySteps.forEach(opacity => {
            const rgbaColor = applyAlphaToColor(color, opacity.toString());
            map[`text-${colorToken}\\/${opacity}`] = `color:${rgbaColor}`;
        });
    });
    // Border colors
    Object.entries(flatColors).forEach(([colorToken, color]) => {
        map[`border-${colorToken}`] = `border-color:${color}`;
        opacitySteps.forEach(opacity => {
            const rgbaColor = applyAlphaToColor(color, opacity.toString());
            map[`border-${colorToken}\\/${opacity}`] = `border-color:${rgbaColor}`;
        });
    });
    // Added: Fill/Stroke for SVG
    Object.entries(flatColors).forEach(([colorToken, color]) => {
        map[`fill-${colorToken}`] = `fill:${color}`;
        opacitySteps.forEach(opacity => {
            const rgbaColor = applyAlphaToColor(color, opacity.toString());
            map[`fill-${colorToken}\\/${opacity}`] = `fill:${rgbaColor}`;
        });
        map[`stroke-${colorToken}`] = `stroke:${color}`;
        opacitySteps.forEach(opacity => {
            const rgbaColor = applyAlphaToColor(color, opacity.toString());
            map[`stroke-${colorToken}\\/${opacity}`] = `stroke:${rgbaColor}`;
        });
    });
    // Special colors
    map['bg-transparent'] = 'background-color:transparent';
    map['bg-current'] = 'background-color:currentColor';
    map['text-transparent'] = 'color:transparent';
    map['text-current'] = 'color:currentColor';
    map['border-transparent'] = 'border-color:transparent';
    map['border-current'] = 'border-color:currentColor';
    map['fill-current'] = 'fill:currentColor';
    map['stroke-current'] = 'stroke:currentColor';
    return map;
}
function generateTypographyUtilities() {
    const map = {};
    const theme = config.theme || {};
    // Font Size
    const fontSize = theme.fontSize || {
        xs: ['0.75rem', '1rem'], sm: ['0.875rem', '1.25rem'],
        base: ['1rem', '1.5rem'], lg: ['1.125rem', '1.75rem'],
        xl: ['1.25rem', '1.75rem'], '2xl': ['1.5rem', '2rem'],
        '3xl': ['1.875rem', '2.25rem'], '4xl': ['2.25rem', '2.5rem'],
        '5xl': ['3rem', '1'], '6xl': ['3.75rem', '1'], '7xl': ['4.5rem', '1'],
        '8xl': ['6rem', '1'], '9xl': ['8rem', '1']
    };
    Object.entries(fontSize).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            map[`text-${key}`] = `font-size:${value[0]};line-height:${value[1]}`;
        }
        else {
            map[`text-${key}`] = `font-size:${value}`;
        }
    });
    // Font Weight
    const fontWeight = theme.fontWeight || {
        thin: '100', extralight: '200', light: '300', normal: '400',
        medium: '500', semibold: '600', bold: '700', extrabold: '800',
        black: '900'
    };
    Object.entries(fontWeight).forEach(([key, value]) => {
        map[`font-${key}`] = `font-weight:${value}`;
    });
    // Added: Font family
    const fontFamily = SCALES.fontFamily;
    Object.entries(fontFamily).forEach(([key, value]) => {
        map[`font-${key}`] = `font-family:${value}`;
    });
    // Text Alignment
    const textAlign = {
        left: 'left', center: 'center', right: 'right', justify: 'justify'
    };
    Object.entries(textAlign).forEach(([key, value]) => {
        map[`text-${key}`] = `text-align:${value}`;
    });
    // Text Transform
    map.uppercase = 'text-transform:uppercase';
    map.lowercase = 'text-transform:lowercase';
    map.capitalize = 'text-transform:capitalize';
    map['normal-case'] = 'text-transform:none';
    // Text Decoration
    map.underline = 'text-decoration-line:underline';
    map['line-through'] = 'text-decoration-line:line-through';
    map['no-underline'] = 'text-decoration-line:none';
    // Whitespace
    const whitespace = {
        normal: 'normal', nowrap: 'nowrap', pre: 'pre',
        'pre-line': 'pre-line', 'pre-wrap': 'pre-wrap'
    };
    Object.entries(whitespace).forEach(([key, value]) => {
        map[`whitespace-${key}`] = `white-space:${value}`;
    });
    // Line Height
    const lineHeight = theme.lineHeight || {
        none: '1', tight: '1.25', snug: '1.375', normal: '1.5',
        relaxed: '1.625', loose: '2'
    };
    Object.entries(lineHeight).forEach(([key, value]) => {
        map[`leading-${key}`] = `line-height:${value}`;
    });
    // Added: Letter spacing
    const letterSpacing = SCALES.letterSpacing;
    Object.entries(letterSpacing).forEach(([key, value]) => {
        map[`tracking-${key}`] = `letter-spacing:${value}`;
    });
    // Added: List style
    const listStyle = { none: 'none', disc: 'disc', decimal: 'decimal' };
    Object.entries(listStyle).forEach(([key, value]) => {
        map[`list-${key}`] = `list-style-type:${value}`;
    });
    return map;
}
function generateBorderUtilities() {
    const map = {};
    const borderRadius = SCALES.borderRadius;
    const borderWidth = SCALES.borderWidth;
    // Border Radius
    Object.entries(borderRadius).forEach(([key, value]) => {
        if (key === 'DEFAULT') {
            map.rounded = `border-radius:${value}`;
        }
        else {
            map[`rounded-${key}`] = `border-radius:${value}`;
            map[`rounded-t-${key}`] = `border-top-left-radius:${value};border-top-right-radius:${value}`;
            map[`rounded-r-${key}`] = `border-top-right-radius:${value};border-bottom-right-radius:${value}`;
            map[`rounded-b-${key}`] = `border-bottom-left-radius:${value};border-bottom-right-radius:${value}`;
            map[`rounded-l-${key}`] = `border-top-left-radius:${value};border-bottom-left-radius:${value}`;
        }
    });
    // Border Width
    Object.entries(borderWidth).forEach(([key, value]) => {
        if (key === 'DEFAULT') {
            map.border = `border-width:${value}`;
        }
        else {
            map[`border-${key}`] = `border-width:${value}`;
            map[`border-t-${key}`] = `border-top-width:${value}`;
            map[`border-r-${key}`] = `border-right-width:${value}`;
            map[`border-b-${key}`] = `border-bottom-width:${value}`;
            map[`border-l-${key}`] = `border-left-width:${value}`;
            map[`border-x-${key}`] = `border-left-width:${value};border-right-width:${value}`;
            map[`border-y-${key}`] = `border-top-width:${value};border-bottom-width:${value}`;
        }
    });
    // Border Style
    const borderStyles = {
        solid: 'solid', dashed: 'dashed', dotted: 'dotted',
        double: 'double', none: 'none'
    };
    Object.entries(borderStyles).forEach(([key, value]) => {
        map[`border-${key}`] = `border-style:${value}`;
    });
    return map;
}
function generateEffectUtilities() {
    const map = {};
    const opacity = SCALES.opacity;
    const boxShadow = SCALES.boxShadow;
    const zIndex = SCALES.zIndex;
    // Opacity
    Object.entries(opacity).forEach(([key, value]) => {
        map[`opacity-${key}`] = `opacity:${value}`;
    });
    // Box Shadow
    Object.entries(boxShadow).forEach(([key, value]) => {
        if (key === 'DEFAULT') {
            map.shadow = `box-shadow:${value}`;
        }
        else {
            map[`shadow-${key}`] = `box-shadow:${value}`;
        }
    });
    // Z-Index
    Object.entries(zIndex).forEach(([key, value]) => {
        map[`z-${key}`] = `z-index:${value}`;
    });
    // Added: Ring offset
    const ringOffsets = Object.entries(SCALES.spacing).map(([key, value]) => [`ring-offset-${key}`, `ring-offset-width:${value}`]);
    ringOffsets.forEach(([util, decl]) => {
        map[util] = decl;
    });
    // Added: Outline
    map['outline-none'] = 'outline:2px solid transparent;outline-offset:2px';
    return map;
}
function generateFlexGridUtilities() {
    const map = {};
    const spacing = SCALES.spacing;
    // Flex
    map.flex = 'display:flex';
    map['inline-flex'] = 'display:inline-flex';
    // Flex Direction
    map['flex-row'] = 'flex-direction:row';
    map['flex-row-reverse'] = 'flex-direction:row-reverse';
    map['flex-col'] = 'flex-direction:column';
    map['flex-col-reverse'] = 'flex-direction:column-reverse';
    // Flex Wrap
    map['flex-wrap'] = 'flex-wrap:wrap';
    map['flex-wrap-reverse'] = 'flex-wrap:wrap-reverse';
    map['flex-nowrap'] = 'flex-wrap:nowrap';
    // Flex Properties
    map['flex-1'] = 'flex:1 1 0%';
    map['flex-auto'] = 'flex:1 1 auto';
    map['flex-initial'] = 'flex:0 1 auto';
    map['flex-none'] = 'flex:none';
    // Flex Grow/Shrink
    map.grow = 'flex-grow:1';
    map['grow-0'] = 'flex-grow:0';
    map.shrink = 'flex-shrink:1';
    map['shrink-0'] = 'flex-shrink:0';
    // Grid
    map.grid = 'display:grid';
    map['inline-grid'] = 'display:inline-grid';
    // Grid Template Columns
    const gridCols = {
        1: 'repeat(1, minmax(0, 1fr))', 2: 'repeat(2, minmax(0, 1fr))',
        3: 'repeat(3, minmax(0, 1fr))', 4: 'repeat(4, minmax(0, 1fr))',
        5: 'repeat(5, minmax(0, 1fr))', 6: 'repeat(6, minmax(0, 1fr))',
        7: 'repeat(7, minmax(0, 1fr))', 8: 'repeat(8, minmax(0, 1fr))',
        9: 'repeat(9, minmax(0, 1fr))', 10: 'repeat(10, minmax(0, 1fr))',
        11: 'repeat(11, minmax(0, 1fr))', 12: 'repeat(12, minmax(0, 1fr))'
    };
    Object.entries(gridCols).forEach(([key, value]) => {
        map[`grid-cols-${key}`] = `grid-template-columns:${value}`;
    });
    // Gap
    Object.entries(spacing).forEach(([key, value]) => {
        map[`gap-${key}`] = `gap:${value}`;
        map[`gap-x-${key}`] = `column-gap:${value}`;
        map[`gap-y-${key}`] = `row-gap:${value}`;
    });
    return map;
}
function generateInteractionUtilities() {
    const map = {};
    // Cursor
    const cursors = {
        auto: 'auto', default: 'default', pointer: 'pointer',
        wait: 'wait', text: 'text', move: 'move',
        'not-allowed': 'not-allowed', none: 'none'
    };
    Object.entries(cursors).forEach(([key, value]) => {
        map[`cursor-${key}`] = `cursor:${value}`;
    });
    // User Select
    const userSelect = {
        none: 'none', text: 'text', all: 'all', auto: 'auto'
    };
    Object.entries(userSelect).forEach(([key, value]) => {
        map[`select-${key}`] = `user-select:${value}`;
    });
    // Pointer Events
    map['pointer-events-none'] = 'pointer-events:none';
    map['pointer-events-auto'] = 'pointer-events:auto';
    // Added: Appearance
    map['appearance-none'] = 'appearance:none';
    // Added: Resize
    const resizes = { none: 'none', y: 'vertical', x: 'horizontal', both: 'both' };
    Object.entries(resizes).forEach(([key, value]) => {
        map[`resize-${key}`] = `resize:${value}`;
    });
    return map;
}
function generateAnimationUtilities() {
    const map = {};
    // Animations
    const animations = {
        none: 'none',
        spin: 'garur-spin 1s linear infinite',
        ping: 'garur-ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        pulse: 'garur-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        bounce: 'garur-bounce 1s infinite',
        // Added: Fade in
        'fade-in': 'garur-fade-in 150ms ease-out'
    };
    Object.entries(animations).forEach(([key, value]) => {
        map[`animate-${key}`] = `animation:${value}`;
    });
    // Transitions
    map.transition = 'transition-property:color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms';
    map['transition-none'] = 'transition-property:none';
    map['transition-all'] = 'transition-property:all;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms';
    map['transition-colors'] = 'transition-property:color, background-color, border-color, text-decoration-color, fill, stroke;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms';
    map['transition-opacity'] = 'transition-property:opacity;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms';
    map['transition-shadow'] = 'transition-property:box-shadow;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms';
    map['transition-transform'] = 'transition-property:transform;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms';
    // Added: Delay
    const delays = SCALES.transitionDelay;
    Object.entries(delays).forEach(([key, value]) => {
        map[`delay-${key}`] = `transition-delay:${value}`;
    });
    // Added: Duration
    const durations = SCALES.transitionDuration;
    Object.entries(durations).forEach(([key, value]) => {
        map[`duration-${key}`] = `transition-duration:${value}`;
    });
    return map;
}
function generateTransformUtilities() {
    const map = {};
    // Rotate
    const rotates = {
        0: '0deg', 1: '1deg', 2: '2deg', 3: '3deg', 6: '6deg', 12: '12deg', 45: '45deg', 90: '90deg', 180: '180deg'
    };
    Object.entries(rotates).forEach(([key, value]) => {
        map[`rotate-${key}`] = `transform:rotate(${value})`;
    });
    // Scale
    const scales = {
        0: '0', 50: '0.5', 75: '0.75', 90: '0.9', 95: '0.95', 100: '1', 105: '1.05', 110: '1.1', 125: '1.25', 150: '1.5'
    };
    Object.entries(scales).forEach(([key, value]) => {
        map[`scale-${key}`] = `transform:scale(${value})`;
    });
    // Translate from spacing
    const spacing = SCALES.spacing;
    Object.entries(spacing).forEach(([key, value]) => {
        map[`translate-x-${key}`] = `transform:translateX(${value})`;
        map[`translate-y-${key}`] = `transform:translateY(${value})`;
    });
    // Skew
    const skews = { 0: '0deg', 3: '3deg', 6: '6deg', 12: '12deg' };
    Object.entries(skews).forEach(([key, value]) => {
        map[`skew-x-${key}`] = `transform:skewX(${value})`;
        map[`skew-y-${key}`] = `transform:skewY(${value})`;
    });
    // Added: Origin
    const origins = {
        center: 'center', top: 'top', 'top-right': 'top right', right: 'right',
        'bottom-right': 'bottom right', bottom: 'bottom', 'bottom-left': 'bottom left',
        left: 'left', 'top-left': 'top left'
    };
    Object.entries(origins).forEach(([key, value]) => {
        map[`origin-${key}`] = `transform-origin:${value}`;
    });
    return map;
}
function generateFilterUtilities() {
    const map = {};
    const theme = config.theme || {};
    // Blur
    const blur = theme.blur || {
        0: '0',
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '40px',
        '3xl': '64px',
    };
    Object.entries(blur).forEach(([key, value]) => {
        if (key === 'DEFAULT') {
            map.blur = `filter: blur(${value})`;
        }
        else {
            map[`blur-${key}`] = `filter: blur(${value})`;
        }
        map[`backdrop-blur-${key}`] = `backdrop-filter: blur(${value})`;
    });
    // Brightness
    const brightness = theme.brightness || {
        0: '0',
        50: '.5',
        75: '.75',
        90: '.9',
        95: '.95',
        100: '1',
        105: '1.05',
        110: '1.1',
        125: '1.25',
        150: '1.5',
        200: '2',
    };
    Object.entries(brightness).forEach(([key, value]) => {
        map[`brightness-${key}`] = `filter: brightness(${value})`;
        map[`backdrop-brightness-${key}`] = `backdrop-filter: brightness(${value})`;
    });
    // Contrast
    const contrast = theme.contrast || brightness;
    Object.entries(contrast).forEach(([key, value]) => {
        map[`contrast-${key}`] = `filter: contrast(${value})`;
        map[`backdrop-contrast-${key}`] = `backdrop-filter: contrast(${value})`;
    });
    // Saturate
    const saturate = theme.saturate || brightness;
    Object.entries(saturate).forEach(([key, value]) => {
        map[`saturate-${key}`] = `filter: saturate(${value})`;
        map[`backdrop-saturate-${key}`] = `backdrop-filter: saturate(${value})`;
    });
    // Hue Rotate
    const hueRotate = theme.hueRotate || {
        0: '0deg',
        15: '15deg',
        30: '30deg',
        60: '60deg',
        90: '90deg',
        180: '180deg',
    };
    Object.entries(hueRotate).forEach(([key, value]) => {
        map[`hue-rotate-${key}`] = `filter: hue-rotate(${value})`;
    });
    // Drop Shadow
    const dropShadow = theme.dropShadow || {
        sm: '0 1px 1px rgb(0 0 0 / 0.05)',
        DEFAULT: '0 1px 2px rgb(0 0 0 / 0.1)',
        md: '0 4px 3px rgb(0 0 0 / 0.07)',
        lg: '0 10px 8px rgb(0 0 0 / 0.04)',
        xl: '0 20px 13px rgb(0 0 0 / 0.03)',
        '2xl': '0 25px 25px rgb(0 0 0 / 0.15)',
        none: '0 0 #0000',
    };
    Object.entries(dropShadow).forEach(([key, value]) => {
        if (key === 'DEFAULT') {
            map['drop-shadow'] = `filter: drop-shadow(${value})`;
        }
        else {
            map[`drop-shadow-${key}`] = `filter: drop-shadow(${value})`;
        }
    });
    // Added: Grayscale, Sepia, Invert
    const grayscaleSteps = { 0: '0', DEFAULT: '1' };
    Object.entries(grayscaleSteps).forEach(([key, value]) => {
        if (key === 'DEFAULT') {
            map.grayscale = `filter: grayscale(${value})`;
        }
        else {
            map[`grayscale-${key}`] = `filter: grayscale(${value})`;
        }
    });
    // Similar for sepia and invert
    const filterSteps = { 0: '0', DEFAULT: '1' };
    Object.entries(filterSteps).forEach(([key, value]) => {
        map[`sepia-${key}`] = `filter: sepia(${value})`;
        map[`invert-${key}`] = `filter: invert(${value})`;
    });
    return map;
}
function generateGradientUtilities() {
    const map = {};
    // Gradient directions
    const directions = {
        'bg-gradient-to-t': 'to top',
        'bg-gradient-to-tr': 'to top right',
        'bg-gradient-to-r': 'to right',
        'bg-gradient-to-br': 'to bottom right',
        'bg-gradient-to-b': 'to bottom',
        'bg-gradient-to-bl': 'to bottom left',
        'bg-gradient-to-l': 'to left',
        'bg-gradient-to-tl': 'to top left',
    };
    // Basic gradient utilities
    Object.entries(directions).forEach(([key, value]) => {
        map[key] = `background-image: linear-gradient(${value}, var(--gradient-stops))`;
    });
    // Gradient stops (these should be combined with directions)
    const gradientColors = {
        'from-transparent': 'rgba(0,0,0,0)',
        'from-current': 'currentColor',
        'to-transparent': 'rgba(0,0,0,0)',
        'to-current': 'currentColor',
    };
    // You'll need to handle color stops dynamically based on config
    const palette = config.palette || config.theme?.colors || {};
    const flatColors = flattenColorPalette(palette);
    Object.entries(flatColors).forEach(([colorToken, color]) => {
        map[`from-${colorToken}`] = `--gradient-from: ${color}; --gradient-to: ${color}00; --gradient-stops: var(--gradient-from), var(--gradient-to)`;
        map[`via-${colorToken}`] = `--gradient-via: ${color}; --gradient-stops: var(--gradient-from, ${color}), var(--gradient-via, ${color}), var(--gradient-to, ${color}00)`;
        map[`to-${colorToken}`] = `--gradient-to: ${color}; --gradient-stops: var(--gradient-from, ${color}00), var(--gradient-via, ${color}), var(--gradient-to, ${color})`;
    });
    // Via opacity - fixed integration
    [0, 50, 75, 100].forEach(opacity => {
        map[`via-opacity-${opacity}`] = `--gradient-via-opacity: ${opacity / 100}; --gradient-via: rgb(var(--gradient-via-rgb) / var(--gradient-via-opacity, 1))`;
    });
    return map;
}
// Main utility generator with error boundary
function generateSimpleUtilities() {
    try {
        return {
            ...generateLayoutUtilities(),
            ...generateSpacingUtilities(),
            ...generateSizingUtilities(),
            ...generateColorUtilities(),
            ...generateTypographyUtilities(),
            ...generateBorderUtilities(),
            ...generateEffectUtilities(),
            ...generateFlexGridUtilities(),
            ...generateInteractionUtilities(),
            ...generateAnimationUtilities(),
            ...generateTransformUtilities(),
            ...generateFilterUtilities(),
            ...generateGradientUtilities(),
            // Common utilities
            'sr-only': 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0',
            'not-sr-only': 'position:static;width:auto;height:auto;padding:0;margin:0;overflow:visible;clip:auto;white-space:normal',
            'truncate': 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap',
            'overflow-ellipsis': 'text-overflow:ellipsis',
            'overflow-clip': 'text-overflow:clip',
        };
    }
    catch (error) {
        logger.error('Failed to generate utilities', undefined);
        return {};
    }
}
// Cache generated utilities
const SIMPLE_UTILS = generateSimpleUtilities();
/* ---------- Complex Builders ---------- */
function buildRing(color, width = "3px", inset = false, offset, offsetColor) {
    const vars = [
        `--garur-ring-color:${color}`,
        `--garur-ring-width:${width}`
    ];
    if (offset)
        vars.push(`--garur-ring-offset-width:${offset}`);
    if (offsetColor)
        vars.push(`--garur-ring-offset-color:${offsetColor}`);
    if (inset)
        vars.push(`--garur-ring-inset:1`);
    const offsetShadow = offset && offsetColor ? `0 0 0 var(--garur-ring-offset-width) var(--garur-ring-offset-color)` : "";
    const ringShadow = `0 0 0 calc(var(--garur-ring-width)) var(--garur-ring-color)`;
    const insetShadow = inset ? `, inset 0 0 0 calc(var(--garur-ring-width)) var(--garur-ring-color)` : "";
    const shadows = [offsetShadow, ringShadow + insetShadow].filter(Boolean).join(", ");
    return `${vars.join(";")};box-shadow:${shadows}`;
}
function buildGradient(value) {
    if (!value)
        return "";
    const v = value.trim();
    // Handle explicit gradient definitions
    if (v.startsWith('linear-gradient(') || v.startsWith('radial-gradient(') || v.startsWith('conic-gradient(')) {
        return `background-image: ${v}`;
    }
    // Handle gradient direction tokens like "to-r", "to-tl", etc.
    const directionMap = {
        't': 'to top',
        'tr': 'to top right',
        'r': 'to right',
        'br': 'to bottom right',
        'b': 'to bottom',
        'bl': 'to bottom left',
        'l': 'to left',
        'tl': 'to top left',
    };
    // If it's a simple direction
    if (directionMap[v]) {
        return `background-image: linear-gradient(${directionMap[v]}, var(--tw-gradient-stops))`;
    }
    // Handle from/via/to syntax - fixed for via-opacity
    const fromMatch = v.match(/from-([^\/]+)(?:\/(\d+))?/);
    const toMatch = v.match(/to-([^\/]+)(?:\/(\d+))?/);
    const viaMatch = v.match(/via-([^\/]+)(?:\/(\d+))?/);
    if (fromMatch || toMatch || viaMatch) {
        let stops = [];
        let viaOpacity = 1;
        if (fromMatch) {
            const [, color, opacity] = fromMatch;
            const resolvedColor = resolvePaletteColor(color) || normalizeColorToken(color) || color;
            const alpha = opacity ? ` / ${parseInt(opacity) / 100}` : '';
            stops.push(`${resolvedColor}${alpha} 0%`);
        }
        if (viaMatch) {
            const [, color, opacity] = viaMatch;
            const resolvedColor = resolvePaletteColor(color) || normalizeColorToken(color) || color;
            viaOpacity = opacity ? parseInt(opacity) / 100 : 1;
            stops.push(`${resolvedColor} / ${viaOpacity} 50%`);
        }
        if (toMatch) {
            const [, color, opacity] = toMatch;
            const resolvedColor = resolvePaletteColor(color) || normalizeColorToken(color) || color;
            const alpha = opacity ? ` / ${parseInt(opacity) / 100}` : '';
            stops.push(`${resolvedColor}${alpha} 100%`);
        }
        return `background-image: linear-gradient(to right, ${stops.join(', ')})`;
    }
    // Fallback to simple gradient
    const color = resolvePaletteColor(v) || normalizeColorToken(v) || v;
    return `background-image: linear-gradient(to right, ${color}, transparent)`;
}
/* ---------- Main Handler ---------- */
export function handle(token) {
    if (!token || !token.key) {
        return null;
    }
    const important = token.important || false;
    const negative = token.negative || false;
    try {
        // 🆕 Universal arbitrary [property:value] utility support
        if (token.raw && ARBITRARY_PROPERTY_RE.test(token.raw)) {
            const match = token.raw.match(ARBITRARY_PROPERTY_RE);
            if (match) {
                const prop = match[1].trim().replace(/_/g, "-");
                let value = match[2].trim().replace(/_/g, " ");
                if (negative && value && !value.startsWith("-")) {
                    value = "-" + value;
                }
                const decl = `${prop}:${value}`;
                return addImportant(decl, important);
            }
        }
        // Fast-path lookup in pre-generated utilities
        if (token.raw && SIMPLE_UTILS[token.raw]) {
            const result = SIMPLE_UTILS[token.raw];
            // Handle animations that need keyframes
            if (token.raw.startsWith('animate-')) {
                const animationType = token.raw.replace('animate-', '');
                const extra = KEYFRAMES[animationType];
                if (extra) {
                    return {
                        decl: addImportant(result, important),
                        extra
                    };
                }
            }
            return addImportant(result, important);
        }
        // Arbitrary value support (e.g., w-[72px], rounded-[2rem])
        const arbVal = getArbitraryValue(token.value || "", negative);
        if (arbVal !== null) {
            return handleArbitraryValue(token, arbVal, important);
        }
        // Complex handlers for dynamic values
        return handleComplexCases(token, important, negative);
    }
    catch (error) {
        logger.error(`Error handling token: ${token.raw}`, token);
        return null;
    }
}
function handleArbitraryValue(token, arbVal, important) {
    const propMap = {
        w: "width", h: "height",
        "min-w": "min-width", "max-w": "max-width",
        "min-h": "min-height", "max-h": "max-height",
        m: "margin", p: "padding",
        rounded: "border-radius", border: "border-width",
        shadow: "box-shadow", opacity: "opacity",
        "m-block": "margin-block", "m-inline": "margin-inline",
        "p-block": "padding-block", "p-inline": "padding-inline",
        inset: "inset", "inset-block": "inset-block",
        "inset-inline": "inset-inline",
        "grid-cols": "grid-template-columns",
        "grid-rows": "grid-template-rows",
    };
    const axisMap = {
        px: { prop: "padding", sides: ["left", "right"] },
        py: { prop: "padding", sides: ["top", "bottom"] },
        mx: { prop: "margin", sides: ["left", "right"] },
        my: { prop: "margin", sides: ["top", "bottom"] },
        pt: { prop: "padding", sides: ["top"] },
        pr: { prop: "padding", sides: ["right"] },
        pb: { prop: "padding", sides: ["bottom"] },
        pl: { prop: "padding", sides: ["left"] },
        mt: { prop: "margin", sides: ["top"] },
        mr: { prop: "margin", sides: ["right"] },
        mb: { prop: "margin", sides: ["bottom"] },
        ml: { prop: "margin", sides: ["left"] },
    };
    let result = null;
    const prop = propMap[token.key];
    if (prop) {
        result = `${prop}:${arbVal}`;
    }
    else {
        const axisEntry = axisMap[token.key];
        if (axisEntry) {
            const { prop: axProp, sides } = axisEntry;
            const decl = sides.map(side => `${axProp}-${side}:${arbVal}`).join(";");
            result = decl;
        }
        else {
            const special = getSpecialHandler(token.key);
            if (special) {
                result = special(arbVal);
            }
        }
    }
    return result ? addImportant(result, important) : null;
}
function handleComplexCases(token, important, negative) {
    const key = token.key;
    let value = token.value || "";
    if (negative && value && !value.startsWith("-")) {
        value = `-${value}`;
    }
    // Color handlers with fallbacks
    if (key === "bg" || key === "background") {
        return handleColorProperty("background-color", value, important);
    }
    if (key === "text" || key === "tc" || key === "fg") {
        return handleColorProperty("color", value, important);
    }
    if (key === "border" || key === "bd") {
        return handleBorderProperty(value, important);
    }
    // Ring utilities
    if (key === "rg" || key === "ring") {
        return handleRingProperty(value, important);
    }
    // Gradient - FIXED
    if (key === "gd" || key === "gradient") {
        const gradient = buildGradient(value);
        return gradient ? addImportant(gradient, important) : null;
    }
    // Pseudo-elements
    if (key === "ph" || key === "placeholder") {
        return handlePseudoElement("::placeholder", "color", value, important);
    }
    if (key === "sel" || key === "selection") {
        return handlePseudoElement("::selection", "background-color", value, important, "color:#fff");
    }
    // ADD THIS: Return null at the end if no handlers matched
    return handlePluginFallback(token, important);
}
function handleColorProperty(property, value, important) {
    const paletteColor = resolvePaletteColor(value);
    if (paletteColor) {
        return addImportant(`${property}:${paletteColor}`, important);
    }
    const normalizedColor = normalizeColorToken(value);
    if (normalizedColor) {
        return addImportant(`${property}:${normalizedColor}`, important);
    }
    if (isArbitrary(value)) {
        return addImportant(`${property}:${value}`, important);
    }
    return null;
}
function handleBorderProperty(value, important) {
    const paletteColor = resolvePaletteColor(value);
    if (paletteColor) {
        return addImportant(`border-color:${paletteColor}`, important);
    }
    const normalizedColor = normalizeColorToken(value);
    if (normalizedColor) {
        return addImportant(`border-color:${normalizedColor}`, important);
    }
    if (/^\d|\[/.test(value)) {
        const width = ensureUnitForLength(value);
        return addImportant(`border-width:${width};border-style:solid`, important);
    }
    if (isArbitrary(value)) {
        return addImportant(`border-color:${value}`, important);
    }
    return null;
}
// FIXED: Handle arbitrary widths in ring
function handleRingProperty(value, important) {
    let inset = false;
    let colorPart = value;
    let widthPart = "3px";
    let offsetPart = undefined;
    let offsetColor = undefined;
    if (value.startsWith("inset-")) {
        inset = true;
        colorPart = value.slice(6);
    }
    // Handle ring-{width} or ring-offset-{width}
    if (colorPart.includes("/")) {
        const parts = colorPart.split("/");
        colorPart = parts[0];
        if (parts[1]) {
            // Check if it's offset or width
            if (parts[1].startsWith('offset-')) {
                offsetPart = parts[1].replace('offset-', '');
            }
            else {
                widthPart = ensureUnitForLength(parts[1]) || "3px";
            }
        }
    }
    const arbWidth = getArbitraryValue(widthPart, false);
    if (arbWidth)
        widthPart = arbWidth;
    const color = resolvePaletteColor(colorPart) ||
        normalizeColorToken(colorPart) ||
        (isArbitrary(colorPart) ? colorPart : "#3b82f6");
    const offsetWidth = ensureUnitForLength(offsetPart || '') || undefined;
    const decl = buildRing(color, widthPart, inset, offsetWidth, offsetColor);
    return addImportant(decl, important);
}
function handlePseudoElement(pseudo, property, value, important, extraDecl) {
    const color = resolvePaletteColor(value) ||
        normalizeColorToken(value) ||
        (isArbitrary(value) ? value : null);
    if (!color)
        return null;
    let decl = `${property}:${color}`;
    if (extraDecl) {
        decl += `;${extraDecl}`;
    }
    return {
        decl: addImportant(decl, important),
        selectorSuffix: pseudo
    };
}
function handlePluginFallback(token, important) {
    try {
        const hooks = plugin.getHandlerHooks();
        for (const hook of hooks) {
            const result = hook(token);
            if (result) {
                if (typeof result === "string") {
                    return addImportant(result, important);
                }
                const handlerResult = result;
                if (handlerResult.decl) {
                    handlerResult.decl = addImportant(handlerResult.decl, important);
                }
                return handlerResult;
            }
        }
    }
    catch (error) {
        logger.error(`Plugin hook error for token: ${token.raw}`, token);
    }
    return null;
}
// Export handler with utility documentation
export default {
    handle,
    UTIL_DOCS,
    // Utility for development/debugging
    getUtilityCount: () => Object.keys(SIMPLE_UTILS).length,
    hasUtility: (util) => util in SIMPLE_UTILS
};
