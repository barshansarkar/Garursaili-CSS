/**
 * ---------------------------------------------------------------------
 * GARUR-CSS — Ultra-fast Atomic CSS Engine
 * Author: Barshan Sarkar
  hey wait, i think i forgot to update the version last time lol
 * Version: 1.0.0
 * License: MIT
 * ---------------------------------------------------------------------
 *
 * This CLI powers the Garur-CSS ecosystem. It handles:
 * • SSC ( SUPER SONIC CYCLONE ) compilation of utility classes
 * • File scanning across HTML / JS / TS / JSX / TSX
 * • Cache management and orphan-class detection
 * • Config file creation (garur.config.js)
 * • Plugin boilerplate generation
 * • Watch mode for real-time builds ,, (coming soon)
 * oh man, watch mode is gonna be epic when i get to it
 *
 * Technologies:
 * - TypeScript
 * - Rollup bundling (CJS-compatible output)
 * - Node.js (CLI execution via shebang)
 *
 * Notes for contributors:
 * • Keep the CLI ESM/CJS compatible.
 * • Avoid dynamic require unless wrapped safely.
 * • Keep output messages clean, fast, and developer-friendly.
 *
 * Made in India.
 * ---------------------------------------------------------------------
 */
import configDefault from "../config/garur.config";
import { ParsedToken } from "./parser";
import {
  normalizeTokenValueForProperty,
  normalizeColorToken,
  ensureUnitForLength,
  ensureTimeUnit,
} from "../utils/sanitizer";
import plugin from "../plugin";
// ..............
// TYPE DEF.
// ...............
export type HandlerResult = string | {
  decl: string;
      selectorSuffix?: string;
     extra?: string;
    mediaQuery?: string;
};
export interface UtilityDefinition {
  id: string;
  desc: string;
  example?: string;
  category: string;
}
export interface GarurConfig {
  palette?: Record<string, any>;
  theme?: {
    colors?: Record<string, any>;
    spacing?: Record<string, string>;
    borderRadius?: Record<string, string>;
    borderWidth?: Record<string, string>;
    boxShadow?: Record<string, string>;
    fontSize?: Record<string, any>;
    fontWeight?: Record<string, string | number>;
    lineHeight?: Record<string, string>;
    letterSpacing?: Record<string, string>;
    fontFamily?: Record<string, any>;
    blur?: Record<string, string>;
    brightness?: Record<string, string>;
    contrast?: Record<string, string>;
   dropShadow?: Record<string, string>;
    hueRotate?: Record<string, string>;
    saturate?: Record<string, string>;
    rotate?: Record<string, string>;
    translate?: Record<string, string>;
    scale?: Record<string, string>;
    skew?: Record<string, string>;
  zIndex?: Record<string, string>;
    transitionDuration?: Record<string, string>;
    transitionDelay?: Record<string, string>;
    transitionTimingFunction?: Record<string, string>;
    backdropBlur?: Record<string, string>;
    backdropBrightness?: Record<string, string>;
    backdropContrast?: Record<string, string>;
    backdropOpacity?: Record<string, string>;
    backdropSaturate?: Record<string, string>;
    [key: string]: any;
  };
  [key: string]: any;
}
// ''''''''''''''''''''''''''''''''''''''
// CONSTANTS & CONFIGARETIONS ..YEAH <<<<<<<<<<<<<<<<<<<<<
// ''''''''''''''''''''''''''''''''''''''
const config = configDefault as GarurConfig;
// Keyframes definitions
const KEYFRAMES = {spin: `@keyframes garur-spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}`,
  bounce: `@keyframes garur-bounce{0%,20%,53%,80%,100%{transform:translate3d(0,0,0)}40%,43%{transform:translate3d(0,-30px,0)}70%{transform:translate3d(0,-15px,0)}90%{transform:translate3d(0,-4px,0)}}`,
  ping: `@keyframes garur-ping{75%,100%{transform:scale(2);opacity:0}}`,
  pulse: `@keyframes garur-pulse{50%{opacity:.5}}`,
  'fade-in': `@keyframes garur-fade-in{from{opacity:0}to{opacity:1}}`,
} as const;
// Regular expressions
const ARBITRARY_PROPERTY_RE = /^\[([a-zA-Z0-9\-_]+):\s*([^\]]+)\]$/;
const COLOR_SHADE_PATTERN = /^([a-zA-Z]+)-(\d{2,3})$/;
const HEX_COLOR_PATTERN = /^#?([a-fA-F0-9]{3,8})$/;
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ERROR HANDLING & LOGGING
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~``
class HandlerError extends Error {
  constructor(
    message: string,
    public token?: ParsedToken,
    public context?: any
  ) {
    super(message);
    this.name = 'HandlerError';
  }
}
const logger = {
  warn: (message: string, token?: ParsedToken) => {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[Garur Handler] ${message}`, token || '');
    }
  },
  error: (message: string, token?: ParsedToken) => {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[Garur Handler] ${message}`, token || '');
    }
  }
};
// -------------------------------
// CORE UTILITY FUNCTIONS
// --------------------------
/**
 * Safely convert hex color to rgba
 */
function hexToRgba(hex: string, alpha: number = 1): string | null {
  try {
    if (!hex || typeof hex !== 'string') return null;
    let h = hex.replace("#", "").trim();
    if (!h) return null;
    // Handle alpha in hex (4 or 8 characters)
    if (h.length === 4 || h.length === 8) {
      const chars = h.split("");
      if (h.length === 4) {
        h = chars[0] + chars[0] + chars[1] + chars[1] + chars[2] + chars[2];
        const aHex = chars[3] + chars[3];
        const hexAlpha = parseInt(aHex, 16) / 255;
        alpha = alpha * hexAlpha;
      } else if (h.length === 8) {
        const aHex = h.slice(6, 8);
        h = h.slice(0, 6);
        const hexAlpha = parseInt(aHex, 16) / 255;
        alpha = alpha * hexAlpha;
      }
    } else if (h.length === 3) {
      h = h.split("").map(c => c + c).join("");
    }
    if (h.length !== 6) return null;
    const rr = parseInt(h.slice(0, 2), 16);
    const gg = parseInt(h.slice(2, 4), 16);
    const bb = parseInt(h.slice(4, 6), 16);
    if (isNaN(rr) || isNaN(gg) || isNaN(bb)) return null;
    return `rgba(${rr}, ${gg}, ${bb}, ${Math.max(0, Math.min(1, alpha))})`;
  } catch (error) {
    logger.error(`Failed to convert hex to rgba: ${hex}`, undefined);
    return null;
  }
}
/**
 * Apply alpha to a color string
 */
function applyAlphaToColor(color: string, alphaStr?: string): string {
  if (!alphaStr) return color;
  let alphaNum = parseFloat(alphaStr);
  if (isNaN(alphaNum)) return color;
  let alpha = alphaNum;
  if (alpha > 1) alpha = alpha / 100;
  if (alpha < 0 || alpha > 1) return color;
  // Apply alpha based on color type
  if (color.startsWith('#')) {
    const rgba = hexToRgba(color, alpha);
    return rgba || color;
  } else if (color.startsWith('rgb(')) {
    const match = color.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:\/\s*([\d.]+)\s*)?\)/);
    if (match) {
      const [, r, g, b, oldAlphaStr = '1'] = match;
      const oldAlpha = parseFloat(oldAlphaStr);
      const finalAlpha = Math.max(0, Math.min(1, oldAlpha * alpha));
      return `rgba(${r}, ${g}, ${b}, ${finalAlpha})`;
    }
  } else if (color.startsWith('hsl(')) {
    const match = color.match(/hsl\s*\(\s*(\d+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*(?:\/\s*([\d.]+)\s*)?\)/);
    if (match) {
      const [, h, s, l, oldAlphaStr = '1'] = match;
      const oldAlpha = parseFloat(oldAlphaStr);
      const finalAlpha = Math.max(0, Math.min(1, oldAlpha * alpha));
      return `hsla(${h}, ${s}%, ${l}%, ${finalAlpha})`;
    }
  } else if (color.startsWith('rgba(') || color.startsWith('hsla(')) {
    // Already has alpha, multiply it
    if (color.includes('/')) {
      return color.replace(/\/(\s*[\d.]+)/, `/${alpha}`);
    }
  }
  return color;
}
/**
 * Resolve palette color with priority
 */
function resolvePaletteColor(value: string): string | null {
  if (!value || typeof value !== 'string') return null;
  try {
    const parts = value.split("/");
    const colorPart = parts[0]?.trim();
    const alphaPart = parts[1]?.trim();
    if (!colorPart) return null;
    const palette = config.palette || config.theme?.colors || {};
    // Direct color match
    if (palette[colorPart]) {
      if (typeof palette[colorPart] === 'string') {
        return applyAlphaToColor(palette[colorPart], alphaPart);
      }
      // Object with shades - default to 500
      if (typeof palette[colorPart] === 'object' && palette[colorPart]['500']) {
        return applyAlphaToColor(palette[colorPart]['500'], alphaPart);
      }
    }
    // Color-shade pattern
    const match = colorPart.match(COLOR_SHADE_PATTERN);
    if (match) {
      const [_, colorName, shade] = match;
      if (palette[colorName] &&
          typeof palette[colorName] === 'object' &&
          palette[colorName][shade]) {
        return applyAlphaToColor(palette[colorName][shade], alphaPart);
      }
    }
    return null;
  } catch (error) {
    logger.error(`Failed to resolve palette color: ${value}`, undefined);
    return null;
  }
}
/**
 * Check if value is arbitrary
 */
function isArbitrary(value: string): boolean {
  if (!value || typeof value !== 'string') return false;
  return /[\s()\[\]$#]|calc\(|var\(|url\(|gradient\(/i.test(value);
}
/**
 * Get arbitrary value from bracket notation
 */
function getArbitraryValue(value: string, negative: boolean): string | null {
  if (!value) return null;
  try {
    const match = value.match(/\[([^\[\]]+)\]/);
    if (!match) return null;
    let v = match[1].replace(/_/g, ' ').trim();
    if (negative && v && !v.startsWith('-')) {
      v = '-' + v;
    }
    return v || null;
  } catch (error) {
    return null;
  }
}
/**
 * Flatten color palette for utility generation
 */
function flattenColorPalette(palette: Record<string, any>): Record<string, string> {
  const flat: Record<string, string> = {};
  try {
    for (const [color, shades] of Object.entries(palette)) {
      if (!shades) continue;
      if (typeof shades === "object" && !Array.isArray(shades)) {
        for (const [shade, value] of Object.entries(shades)) {
          if (typeof value === "string" && value) {
            flat[`${color}-${shade}`] = value;
          }
        }
      } else if (typeof shades === "string") {
        flat[color] = shades;
      }
    }
  } catch (error) {
    logger.error('Failed to flatten color palette', undefined);
  }
  return flat;
}
/**
 * Add !important to declarations
 * ummm ..
 *
 */
function addImportant(decl: string, important: boolean): string {
  if (!important || !decl) return decl;
  return decl
    .split(';')
    .filter(part => part.trim())
    .map(part => {
      const trimmed = part.trim();
      if (!trimmed || trimmed.includes('!important')) return trimmed;
      return trimmed + ' !important';
    })
    .join(';') + (decl.endsWith(';') ? '' : ';');
}
// =========================================
// CONFIGURATION SCALES
// ============================================
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
  transitionDuration: {
    75: "75ms", 100: "100ms", 150: "150ms", 200: "200ms",
    300: "300ms", 500: "500ms", 700: "700ms", 1000: "1000ms",
    ...config.theme?.transitionDuration
  },
  transitionDelay: {
    75: "75ms", 100: "100ms", 150: "150ms", 200: "200ms",
    300: "300ms", 500: "500ms", 700: "700ms", 1000: "1000ms",
    ...config.theme?.transitionDelay
  },
  letterSpacing: {
    tighter: "-0.05em", tight: "-0.025em", snug: "0.025em",
    normal: "0em", wide: "0.1em", wider: "0.15em", widest: "0.25em",
    ...config.theme?.letterSpacing
  },
  fontFamily: {
    sans: "ui-sans-serif, system-ui, sans-serif",
    serif: "ui-serif, Georgia, serif",
    mono: "ui-monospace, Monaco, monospace",
    ...config.theme?.fontFamily
  }
};
// .................................................
// SPECIAL HANDLERS
// ............................................
const specialHandlers = {
  rotate: (v: string) => `transform: rotate(${v})`,
  scale: (v: string) => `transform: scale(${v})`,
  'translate-x': (v: string) => `transform: translateX(${v})`,
  'translate-y': (v: string) => `transform: translateY(${v})`,
  skew: (v: string) => `transform: skew(${v})`,
  'skew-x': (v: string) => `transform: skewX(${v})`,
  'skew-y': (v: string) => `transform: skewY(${v})`,
  blur: (v: string) => `filter: blur(${v})`,
  brightness: (v: string) => `filter: brightness(${v})`,
  contrast: (v: string) => `filter: contrast(${v})`,
  saturate: (v: string) => `filter: saturate(${v})`,
  'hue-rotate': (v: string) => `filter: hue-rotate(${v})`,
  'drop-shadow': (v: string) => `filter: drop-shadow(${v})`,
  'grid-cols': (v: string) => `grid-template-columns: ${v}`,
  'grid-rows': (v: string) => `grid-template-rows: ${v}`,
  'space-x': (v: string) => `& > :not([hidden]) ~ :not([hidden]) { --garur-space-x-reverse: 0; margin-left: calc(${v} * calc(1 - var(--garur-space-x-reverse))); margin-right: calc(${v} * var(--garur-space-x-reverse)) }`,
  'space-y': (v: string) => `& > :not([hidden]) ~ :not([hidden]) { --garur-space-y-reverse: 0; margin-top: calc(${v} * calc(1 - var(--garur-space-y-reverse))); margin-bottom: calc(${v} * var(--garur-space-y-reverse)) }`,
  'backdrop-blur': (v: string) => `backdrop-filter: blur(${v})`,
  grayscale: (v: string) => `filter: grayscale(${v})`,
  sepia: (v: string) => `filter: sepia(${v})`,
  invert: (v: string) => `filter: invert(${v})`,
} as const;
function getSpecialHandler(key: string): ((v: string) => string) | undefined {
  return specialHandlers[key as keyof typeof specialHandlers];
}
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// ~UTILITY GENERATORS~
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
// Helper to generate utilities from a scale
function generateUtilitiesFromScale(
  scale: Record<string, string>,
  prefix: string,
  property: string,
  transformValue?: (value: string) => string
): Record<string, string> {
  const map: Record<string, string> = {};
  Object.entries(scale).forEach(([key, value]) => {
    const transformedValue = transformValue ? transformValue(value) : value;
    map[`${prefix}-${key}`] = `${property}:${transformedValue}`;
  });
  return map;
}
// Layout utilities
function generateLayoutUtilities(): Record<string, string> {
  const map: Record<string, string> = {};
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
  // Place items
  const placeItems = { start: 'start', end: 'end', center: 'center', stretch: 'stretch' };
  Object.entries(placeItems).forEach(([key, value]) => {
    map[`place-items-${key}`] = `place-items:${value}`;
  });
  // Place content
  const placeContent = { start: 'start', end: 'end', center: 'center', stretch: 'stretch' };
  Object.entries(placeContent).forEach(([key, value]) => {
    map[`place-content-${key}`] = `place-content:${value}`;
  });
  // Order
  const orders = {
    0: '0', 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6',
    7: '7', 8: '8', 9: '9', 10: '10', 11: '11', 12: '12',
    first: '-9999', last: '9999'
  };
  Object.entries(orders).forEach(([key, value]) => {
    map[`order-${key}`] = `order:${value}`;
  });
  // Content
  map['content-none'] = 'content:none';
  return map;
}
// Spacing utilities
function generateSpacingUtilities(): Record<string, string> {
  const map: Record<string, string> = {};
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
  // Auto margins
  map['m-auto'] = 'margin:auto';
  map['mx-auto'] = 'margin-left:auto;margin-right:auto';
  map['my-auto'] = 'margin-top:auto;margin-bottom:auto';
  map['mt-auto'] = 'margin-top:auto';
  map['mr-auto'] = 'margin-right:auto';
  map['mb-auto'] = 'margin-bottom:auto';
  map['ml-auto'] = 'margin-left:auto';
  // Space between
  Object.entries(spacing).forEach(([key, value]) => {
    map[`space-x-${key}`] = `& > :not([hidden]) ~ :not([hidden]) { --garur-space-x-reverse: 0; margin-left: calc(${value} * calc(1 - var(--garur-space-x-reverse))); margin-right: calc(${value} * var(--garur-space-x-reverse)) }`;
    map[`space-y-${key}`] = `& > :not([hidden]) ~ :not([hidden]) { --garur-space-y-reverse: 0; margin-top: calc(${value} * calc(1 - var(--garur-space-y-reverse))); margin-bottom: calc(${value} * var(--garur-space-y-reverse)) }`;
  });
  // Divide
  Object.entries(spacing).forEach(([key, value]) => {
    const borderWidth = SCALES.borderWidth[key as keyof typeof SCALES.borderWidth] || value;
    map[`divide-x-${key}`] = `& > :not([hidden]) ~ :not([hidden]) { --garur-divide-x-reverse: 0; border-right-width: calc(${borderWidth} * var(--garur-divide-x-reverse)); border-left-width: calc(${borderWidth} * calc(1 - var(--garur-divide-x-reverse))) }`;
    map[`divide-y-${key}`] = `& > :not([hidden]) ~ :not([hidden]) { --garur-divide-y-reverse: 0; border-bottom-width: calc(${borderWidth} * var(--garur-divide-y-reverse)); border-top-width: calc(${borderWidth} * calc(1 - var(--garur-divide-y-reverse))) }`;
  });
  return map;
}
// Sizing utilities
function generateSizingUtilities(): Record<string, string> {
  const map: Record<string, string> = {};
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
  map['w-min'] = 'width:min-content';
  map['w-max'] = 'width:max-content';
  map['w-fit'] = 'width:fit-content';
  map['h-full'] = 'height:100%';
  map['h-screen'] = 'height:100vh';
  map['h-auto'] = 'height:auto';
  map['h-min'] = 'height:min-content';
  map['h-max'] = 'height:max-content';
  map['h-fit'] = 'height:fit-content';
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
  });
  // Square sizing
  Object.entries(spacing).forEach(([key, value]) => {
    map[`size-${key}`] = `width:${value};height:${value}`;
  });
  // Aspect ratio
  const aspects = {
    square: '1', video: '16/9', '2/3': '2/3', '3/2': '3/2',
    '4/3': '4/3', '3/4': '3/4', '16/9': '16/9', '9/16': '9/16'
  };
  Object.entries(aspects).forEach(([key, value]) => {
    map[`aspect-${key}`] = `aspect-ratio:${value}`;
  });
  // Object fit
  const objectFit = {
    contain: 'contain', cover: 'cover', fill: 'fill',
    none: 'none', 'scale-down': 'scale-down'
  };
  Object.entries(objectFit).forEach(([key, value]) => {
    map[`object-${key}`] = `object-fit:${value}`;
  });
  return map;
}
// Color utilities
function generateColorUtilities(): Record<string, string> {
  const map: Record<string, string> = {};
  const palette = config.palette || config.theme?.colors || {};
  const flatColors = flattenColorPalette(palette);
  const opacitySteps = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
  // Background colors
  Object.entries(flatColors).forEach(([colorToken, color]) => {
    map[`bg-${colorToken}`] = `background-color:${color}`;
    // Opacity variants
    opacitySteps.forEach(opacity => {
      const rgbaColor = applyAlphaToColor(color, opacity.toString());
      map[`bg-${colorToken}/${opacity}`] = `background-color:${rgbaColor}`;
    });
  });
  // Text colors
  Object.entries(flatColors).forEach(([colorToken, color]) => {
    map[`text-${colorToken}`] = `color:${color}`;
    opacitySteps.forEach(opacity => {
      const rgbaColor = applyAlphaToColor(color, opacity.toString());
      map[`text-${colorToken}/${opacity}`] = `color:${rgbaColor}`;
    });
  });
  // Border colors
  Object.entries(flatColors).forEach(([colorToken, color]) => {
    map[`border-${colorToken}`] = `border-color:${color}`;
    opacitySteps.forEach(opacity => {
      const rgbaColor = applyAlphaToColor(color, opacity.toString());
      map[`border-${colorToken}/${opacity}`] = `border-color:${rgbaColor}`;
    });
  });
  // Fill/Stroke for SVG
  Object.entries(flatColors).forEach(([colorToken, color]) => {
    map[`fill-${colorToken}`] = `fill:${color}`;
    map[`stroke-${colorToken}`] = `stroke:${color}`;
    opacitySteps.forEach(opacity => {
      const rgbaColor = applyAlphaToColor(color, opacity.toString());
      map[`fill-${colorToken}/${opacity}`] = `fill:${rgbaColor}`;
      map[`stroke-${colorToken}/${opacity}`] = `stroke:${rgbaColor}`;
    });
  });
  // Special colors
  map['bg-transparent'] = 'background-color:transparent';
  map['bg-current'] = 'background-color:currentColor';
  map['text-transparent'] = 'color:transparent';
  map['text-current'] = 'color:currentColor';
  map['border-transparent'] = 'border-color:transparent';
  map['border-current'] = 'border-color:currentColor';
  map['fill-transparent'] = 'fill:transparent';
  map['fill-current'] = 'fill:currentColor';
  map['stroke-transparent'] = 'stroke:transparent';
  map['stroke-current'] = 'stroke:currentColor';
  return map;
}
// Typography utilities
function generateTypographyUtilities(): Record<string, string> {
  const map: Record<string, string> = {};
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
    } else {
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
  // Font Family
  const fontFamily = SCALES.fontFamily;
  Object.entries(fontFamily).forEach(([key, value]) => {
    map[`font-${key}`] = `font-family:${value}`;
  });
  // Text Alignment
  const textAlign = {
    left: 'left', center: 'center', right: 'right', justify: 'justify',
    start: 'start', end: 'end'
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
  map['overline'] = 'text-decoration-line:overline';
  // Text Decoration Style
  const decStyles = {
    solid: 'solid', double: 'double', dotted: 'dotted',
    dashed: 'dashed', wavy: 'wavy'
  };
  Object.entries(decStyles).forEach(([key, value]) => {
    map[`decoration-${key}`] = `text-decoration-style:${value}`;
  });
  // Text Decoration Thickness
  const thicknesses = SCALES.borderWidth;
  Object.entries(thicknesses).forEach(([key, value]) => {
    map[`decoration-${key}`] = `text-decoration-thickness:${value}`;
  });
  map['decoration-auto'] = 'text-decoration-thickness:auto';
  map['decoration-from-font'] = 'text-decoration-thickness:from-font';
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
  // Letter spacing
  const letterSpacing = SCALES.letterSpacing;
  Object.entries(letterSpacing).forEach(([key, value]) => {
    map[`tracking-${key}`] = `letter-spacing:${value}`;
  });
  // List style
  const listStyle = {
    none: 'none', disc: 'disc', decimal: 'decimal',
    circle: 'circle', square: 'square', roman: 'upper-roman'
  };
  Object.entries(listStyle).forEach(([key, value]) => {
    map[`list-${key}`] = `list-style-type:${value}`;
  });
  // Text indent
  Object.entries(SCALES.spacing).forEach(([key, value]) => {
    map[`indent-${key}`] = `text-indent:${value}`;
  });
  // Text overflow
  map['truncate'] = 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap';
  map['overflow-ellipsis'] = 'text-overflow:ellipsis';
  map['overflow-clip'] = 'text-overflow:clip';
  // Vertical align
  const verticalAligns = {
    baseline: 'baseline', top: 'top', middle: 'middle',
    bottom: 'bottom', 'text-top': 'text-top', 'text-bottom': 'text-bottom'
  };
  Object.entries(verticalAligns).forEach(([key, value]) => {
    map[`align-${key}`] = `vertical-align:${value}`;
  });
  return map;
}
// Border utilities
function generateBorderUtilities(): Record<string, string> {
  const map: Record<string, string> = {};
  const borderRadius = SCALES.borderRadius;
  const borderWidth = SCALES.borderWidth;
  // Border Radius
  Object.entries(borderRadius).forEach(([key, value]) => {
    if (key === 'DEFAULT') {
      map.rounded = `border-radius:${value}`;
    } else {
      map[`rounded-${key}`] = `border-radius:${value}`;
      map[`rounded-t-${key}`] = `border-top-left-radius:${value};border-top-right-radius:${value}`;
      map[`rounded-r-${key}`] = `border-top-right-radius:${value};border-bottom-right-radius:${value}`;
      map[`rounded-b-${key}`] = `border-bottom-left-radius:${value};border-bottom-right-radius:${value}`;
      map[`rounded-l-${key}`] = `border-top-left-radius:${value};border-bottom-left-radius:${value}`;
      map[`rounded-tl-${key}`] = `border-top-left-radius:${value}`;
      map[`rounded-tr-${key}`] = `border-top-right-radius:${value}`;
      map[`rounded-br-${key}`] = `border-bottom-right-radius:${value}`;
      map[`rounded-bl-${key}`] = `border-bottom-left-radius:${value}`;
    }
  });
  // Border Width
  Object.entries(borderWidth).forEach(([key, value]) => {
    if (key === 'DEFAULT') {
      map.border = `border-width:${value}`;
    } else {
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
    double: 'double', none: 'none', hidden: 'hidden'
  };
  Object.entries(borderStyles).forEach(([key, value]) => {
    map[`border-${key}`] = `border-style:${value}`;
  });
  // Border collapse
  map['border-collapse'] = 'border-collapse:collapse';
  map['border-separate'] = 'border-collapse:separate';
  // Border spacing
  Object.entries(SCALES.spacing).forEach(([key, value]) => {
    map[`border-spacing-${key}`] = `border-spacing:${value}`;
    map[`border-spacing-x-${key}`] = `border-spacing:${value} 0`;
    map[`border-spacing-y-${key}`] = `border-spacing:0 ${value}`;
  });
  return map;
}
// Effect utilities
function generateEffectUtilities(): Record<string, string> {
  const map: Record<string, string> = {};
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
    } else {
      map[`shadow-${key}`] = `box-shadow:${value}`;
    }
  });
  // Z-Index
  Object.entries(zIndex).forEach(([key, value]) => {
    map[`z-${key}`] = `z-index:${value}`;
  });
  // Ring offset
  Object.entries(SCALES.spacing).forEach(([key, value]) => {
    map[`ring-offset-${key}`] = `--garur-ring-offset-width:${value}`;
  });
  // Outline
  map['outline-none'] = 'outline:2px solid transparent;outline-offset:2px';
  map['outline'] = 'outline:1px solid';
  map['outline-dashed'] = 'outline:1px dashed';
  map['outline-dotted'] = 'outline:1px dotted';
  map['outline-double'] = 'outline:2px double';
  // Outline offset
  Object.entries(SCALES.spacing).forEach(([key, value]) => {
    map[`outline-offset-${key}`] = `outline-offset:${value}`;
  });
  return map;
}
// Flex/Grid utilities
function generateFlexGridUtilities(): Record<string, string> {
  const map: Record<string, string> = {};
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
    11: 'repeat(11, minmax(0, 1fr))', 12: 'repeat(12, minmax(0, 1fr))',
    none: 'none'
  };
  Object.entries(gridCols).forEach(([key, value]) => {
    map[`grid-cols-${key}`] = `grid-template-columns:${value}`;
  });
  // Grid Template Rows
  const gridRows = {
    1: 'repeat(1, minmax(0, 1fr))', 2: 'repeat(2, minmax(0, 1fr))',
    3: 'repeat(3, minmax(0, 1fr))', 4: 'repeat(4, minmax(0, 1fr))',
    5: 'repeat(5, minmax(0, 1fr))', 6: 'repeat(6, minmax(0, 1fr))',
    none: 'none'
  };
  Object.entries(gridRows).forEach(([key, value]) => {
    map[`grid-rows-${key}`] = `grid-template-rows:${value}`;
  });
  // Gap
  Object.entries(spacing).forEach(([key, value]) => {
    map[`gap-${key}`] = `gap:${value}`;
    map[`gap-x-${key}`] = `column-gap:${value}`;
    map[`gap-y-${key}`] = `row-gap:${value}`;
  });
  // Flex Justify
  const justify = {
    start: 'flex-start', end: 'flex-end', center: 'center',
    between: 'space-between', around: 'space-around', evenly: 'space-evenly'
  };
  Object.entries(justify).forEach(([key, value]) => {
    map[`justify-${key}`] = `justify-content:${value}`;
    map[`justify-items-${key}`] = `justify-items:${value}`;
    map[`justify-self-${key}`] = `justify-self:${value}`;
  });
  // Flex Align
  const align = {
    start: 'flex-start', end: 'flex-end', center: 'center',
    baseline: 'baseline', stretch: 'stretch'
  };
  Object.entries(align).forEach(([key, value]) => {
    map[`items-${key}`] = `align-items:${value}`;
    map[`content-${key}`] = `align-content:${value}`;
    map[`self-${key}`] = `align-self:${value}`;
  });
  // Place items/content
  const placeItems = { start: 'start', end: 'end', center: 'center', stretch: 'stretch' };
  Object.entries(placeItems).forEach(([key, value]) => {
    map[`place-items-${key}`] = `place-items:${value}`;
    map[`place-content-${key}`] = `place-content:${value}`;
    map[`place-self-${key}`] = `place-self:${value}`;
  });
  // Grid auto flow
  const autoFlows = {
    row: 'row', col: 'column', dense: 'dense',
    'row-dense': 'row dense', 'col-dense': 'column dense'
  };
  Object.entries(autoFlows).forEach(([key, value]) => {
    map[`grid-auto-flow-${key}`] = `grid-auto-flow:${value}`;
  });
  // Grid auto columns/rows
  const autoSizes = {
    auto: 'auto', min: 'min-content', max: 'max-content',
    fr: 'minmax(0, 1fr)'
  };
  Object.entries(autoSizes).forEach(([key, value]) => {
    map[`grid-auto-cols-${key}`] = `grid-auto-columns:${value}`;
    map[`grid-auto-rows-${key}`] = `grid-auto-rows:${value}`;
  });
  return map;
}
// Interaction utilities
function generateInteractionUtilities(): Record<string, string> {
  const map: Record<string, string> = {};
  // Cursor
  const cursors = {
    auto: 'auto', default: 'default', pointer: 'pointer',
    wait: 'wait', text: 'text', move: 'move', 'not-allowed': 'not-allowed',
    none: 'none', help: 'help', progress: 'progress', 'col-resize': 'col-resize',
    'row-resize': 'row-resize', 'n-resize': 'n-resize', 'e-resize': 'e-resize',
    's-resize': 's-resize', 'w-resize': 'w-resize', 'ne-resize': 'ne-resize',
    'nw-resize': 'nw-resize', 'se-resize': 'se-resize', 'sw-resize': 'sw-resize',
    'ew-resize': 'ew-resize', 'ns-resize': 'ns-resize', 'nesw-resize': 'nesw-resize',
    'nwse-resize': 'nwse-resize', 'zoom-in': 'zoom-in', 'zoom-out': 'zoom-out'
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
  // Appearance
  map['appearance-none'] = 'appearance:none';
  map['appearance-auto'] = 'appearance:auto';
  // Resize
  const resizes = { none: 'none', y: 'vertical', x: 'horizontal', both: 'both' };
  Object.entries(resizes).forEach(([key, value]) => {
    map[`resize-${key}`] = `resize:${value}`;
  });
  // Accent color
  const palette = config.palette || config.theme?.colors || {};
  const flatColors = flattenColorPalette(palette);
  Object.entries(flatColors).forEach(([colorToken, color]) => {
    map[`accent-${colorToken}`] = `accent-color:${color}`;
  });
  // Caret color
  Object.entries(flatColors).forEach(([colorToken, color]) => {
    map[`caret-${colorToken}`] = `caret-color:${color}`;
  });
  return map;
}
// Animation utilities
function generateAnimationUtilities(): Record<string, string> {
  const map: Record<string, string> = {};
  // Animations
  const animations = {
    none: 'none',
    spin: 'garur-spin 1s linear infinite',
    ping: 'garur-ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
    pulse: 'garur-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    bounce: 'garur-bounce 1s infinite',
    'fade-in': 'garur-fade-in 150ms ease-out',
    'fade-out': 'garur-fade-in 150ms ease-out reverse',
    'slide-in-up': 'garur-slide-in-up 150ms ease-out',
    'slide-in-down': 'garur-slide-in-down 150ms ease-out'
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
  // Delay
  const delays = SCALES.transitionDelay;
  Object.entries(delays).forEach(([key, value]) => {
    map[`delay-${key}`] = `transition-delay:${value}`;
  });
  // Duration
  const durations = SCALES.transitionDuration;
  Object.entries(durations).forEach(([key, value]) => {
    map[`duration-${key}`] = `transition-duration:${value}`;
  });
  // Timing functions
  const timingFunctions = {
    linear: 'linear', ease: 'ease', 'ease-in': 'ease-in',
    'ease-out': 'ease-out', 'ease-in-out': 'ease-in-out'
  };
  Object.entries(timingFunctions).forEach(([key, value]) => {
    map[`ease-${key}`] = `transition-timing-function:${value}`;
  });
  return map;
}
// Transform utilities
function generateTransformUtilities(): Record<string, string> {
  const map: Record<string, string> = {};
  // Rotate
  const rotates = {
    0: '0deg', 1: '1deg', 2: '2deg', 3: '3deg', 6: '6deg',
    12: '12deg', 45: '45deg', 90: '90deg', 180: '180deg'
  };
  Object.entries(rotates).forEach(([key, value]) => {
    map[`rotate-${key}`] = `transform:rotate(${value})`;
  });
  // Scale
  const scales = {
    0: '0', 50: '0.5', 75: '0.75', 90: '0.9', 95: '0.95',
    100: '1', 105: '1.05', 110: '1.1', 125: '1.25', 150: '1.5'
  };
  Object.entries(scales).forEach(([key, value]) => {
    map[`scale-${key}`] = `transform:scale(${value})`;
    map[`scale-x-${key}`] = `transform:scaleX(${value})`;
    map[`scale-y-${key}`] = `transform:scaleY(${value})`;
  });
  // Translate from spacing
  const spacing = SCALES.spacing;
  Object.entries(spacing).forEach(([key, value]) => {
    map[`translate-x-${key}`] = `transform:translateX(${value})`;
    map[`translate-y-${key}`] = `transform:translateY(${value})`;
  });
  // Skew
  const skews = { 0: '0deg', 1: '1deg', 2: '2deg', 3: '3deg', 6: '6deg', 12: '12deg' };
  Object.entries(skews).forEach(([key, value]) => {
    map[`skew-x-${key}`] = `transform:skewX(${value})`;
    map[`skew-y-${key}`] = `transform:skewY(${value})`;
  });
  // Origin
  const origins = {
    center: 'center', top: 'top', 'top-right': 'top right', right: 'right',
    'bottom-right': 'bottom right', bottom: 'bottom', 'bottom-left': 'bottom left',
    left: 'left', 'top-left': 'top left'
  };
  Object.entries(origins).forEach(([key, value]) => {
    map[`origin-${key}`] = `transform-origin:${value}`;
  });
  // Transform style
  map['transform-gpu'] = 'transform:translate3d(0,0,0)';
  map['transform-cpu'] = 'transform:none';
  return map;
}
// Filter utilities
function generateFilterUtilities(): Record<string, string> {
  const map: Record<string, string> = {};
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
      map.blur = `filter:blur(${value})`;
    } else {
      map[`blur-${key}`] = `filter:blur(${value})`;
    }
    map[`backdrop-blur-${key}`] = `backdrop-filter:blur(${value})`;
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
    map[`brightness-${key}`] = `filter:brightness(${value})`;
    map[`backdrop-brightness-${key}`] = `backdrop-filter:brightness(${value})`;
  });
  // Contrast
  const contrast = theme.contrast || brightness;
  Object.entries(contrast).forEach(([key, value]) => {
    map[`contrast-${key}`] = `filter:contrast(${value})`;
    map[`backdrop-contrast-${key}`] = `backdrop-filter:contrast(${value})`;
  });
  // Grayscale
  const grayscale = {
    0: '0',
    DEFAULT: '100%'
  };
  Object.entries(grayscale).forEach(([key, value]) => {
    if (key === 'DEFAULT') {
      map.grayscale = `filter:grayscale(${value})`;
      map['backdrop-grayscale'] = `backdrop-filter:grayscale(${value})`;
    } else {
      map[`grayscale-${key}`] = `filter:grayscale(${value})`;
      map[`backdrop-grayscale-${key}`] = `backdrop-filter:grayscale(${value})`;
    }
  });
  // Hue rotate
  const hueRotate = theme.hueRotate || {
    0: '0deg',
    15: '15deg',
    30: '30deg',
    60: '60deg',
    90: '90deg',
    180: '180deg',
  };
  Object.entries(hueRotate).forEach(([key, value]) => {
    map[`hue-rotate-${key}`] = `filter:hue-rotate(${value})`;
  });
  // Invert
  const invert = {
    0: '0',
    DEFAULT: '100%'
  };
  Object.entries(invert).forEach(([key, value]) => {
    if (key === 'DEFAULT') {
      map.invert = `filter:invert(${value})`;
      map['backdrop-invert'] = `backdrop-filter:invert(${value})`;
    } else {
      map[`invert-${key}`] = `filter:invert(${value})`;
      map[`backdrop-invert-${key}`] = `backdrop-filter:invert(${value})`;
    }
  });
  // Saturate
  const saturate = theme.saturate || brightness;
  Object.entries(saturate).forEach(([key, value]) => {
    map[`saturate-${key}`] = `filter:saturate(${value})`;
    map[`backdrop-saturate-${key}`] = `backdrop-filter:saturate(${value})`;
  });
  // Sepia
  const sepia = {
    0: '0',
    DEFAULT: '100%'
  };
  Object.entries(sepia).forEach(([key, value]) => {
    if (key === 'DEFAULT') {
      map.sepia = `filter:sepia(${value})`;
      map['backdrop-sepia'] = `backdrop-filter:sepia(${value})`;
    } else {
      map[`sepia-${key}`] = `filter:sepia(${value})`;
      map[`backdrop-sepia-${key}`] = `backdrop-filter:sepia(${value})`;
    }
  });
  // Drop shadow
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
      map['drop-shadow'] = `filter:drop-shadow(${value})`;
    } else {
      map[`drop-shadow-${key}`] = `filter:drop-shadow(${value})`;
    }
  });
  // Filter none
  map['filter-none'] = 'filter:none';
  map['backdrop-filter-none'] = 'backdrop-filter:none';
  return map;
}
// Gradient utilities
function generateGradientUtilities(): Record<string, string> {
  const map: Record<string, string> = {};
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
  Object.entries(directions).forEach(([key, value]) => {
    map[key] = `background-image:linear-gradient(${value},var(--gr-gradient-stops))`;
  });
  // Gradient stops
  const palette = config.palette || config.theme?.colors || {};
  const flatColors = flattenColorPalette(palette);
  Object.entries(flatColors).forEach(([colorToken, color]) => {
    map[`from-${colorToken}`] = `--gr-gradient-from:${color};--gr-gradient-to:${color}00;--gr-gradient-stops:var(--gr-gradient-from),var(--gr-gradient-to)`;
    map[`via-${colorToken}`] = `--gr-gradient-via:${color};--gr-gradient-stops:var(--gr-gradient-from,${color}),var(--gr-gradient-via,${color}),var(--gr-gradient-to,${color}00)`;
    map[`to-${colorToken}`] = `--gr-gradient-to:${color};--gr-gradient-stops:var(--gr-gradient-from,${color}00),var(--gr-gradient-via,${color}),var(--gr-gradient-to,${color})`;
  });
  // Via opacity
  [0, 5, 10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 95, 100].forEach(opacity => {
    map[`via-opacity-${opacity}`] = `--gr-gradient-via-opacity:${opacity / 100}`;
  });
  // Gradient types
  map['bg-gradient-radial'] = 'background-image:radial-gradient(var(--gr-gradient-stops))';
  map['bg-gradient-conic'] = 'background-image:conic-gradient(var(--gr-gradient-stops))';
  return map;
}
// Overflow utilities
function generateOverflowUtilities(): Record<string, string> {
  const map: Record<string, string> = {};
  // Overflow
  const overflows = {
    auto: 'auto', hidden: 'hidden', visible: 'visible',
    scroll: 'scroll', clip: 'clip'
  };
  Object.entries(overflows).forEach(([key, value]) => {
    map[`overflow-${key}`] = `overflow:${value}`;
    map[`overflow-x-${key}`] = `overflow-x:${value}`;
    map[`overflow-y-${key}`] = `overflow-y:${value}`;
  });
  // Overscroll
  const overscrolls = { auto: 'auto', contain: 'contain', none: 'none' };
  Object.entries(overscrolls).forEach(([key, value]) => {
    map[`overscroll-${key}`] = `overscroll-behavior:${value}`;
    map[`overscroll-x-${key}`] = `overscroll-behavior-x:${value}`;
    map[`overscroll-y-${key}`] = `overscroll-behavior-y:${value}`;
  });
  // Scroll behavior
  map['scroll-smooth'] = 'scroll-behavior:smooth';
  map['scroll-auto'] = 'scroll-behavior:auto';
  return map;
}
// Additional utilities
function generateAdditionalUtilities(): Record<string, string> {
  const map: Record<string, string> = {};
  // Visibility
  map.visible = 'visibility:visible';
  map.invisible = 'visibility:hidden';
  map.collapse = 'visibility:collapse';
  // Backface visibility
  map['backface-visible'] = 'backface-visibility:visible';
  map['backface-hidden'] = 'backface-visibility:hidden';
  // Isolation
  map.isolate = 'isolation:isolate';
  map['isolation-auto'] = 'isolation:auto';
  // Mix blend mode
  const blendModes = {
    normal: 'normal', multiply: 'multiply', screen: 'screen',
    overlay: 'overlay', darken: 'darken', lighten: 'lighten',
    'color-dodge': 'color-dodge', 'color-burn': 'color-burn',
    'hard-light': 'hard-light', 'soft-light': 'soft-light',
    difference: 'difference', exclusion: 'exclusion',
    hue: 'hue', saturation: 'saturation', color: 'color',
    luminosity: 'luminosity'
  };
  Object.entries(blendModes).forEach(([key, value]) => {
    map[`mix-blend-${key}`] = `mix-blend-mode:${value}`;
    map[`bg-blend-${key}`] = `background-blend-mode:${value}`;
  });
  // Table
  map['table-auto'] = 'table-layout:auto';
  map['table-fixed'] = 'table-layout:fixed';
  // Caption side
  map['caption-top'] = 'caption-side:top';
  map['caption-bottom'] = 'caption-side:bottom';
  // Empty cells
  map['empty-cells-show'] = 'empty-cells:show';
  map['empty-cells-hide'] = 'empty-cells:hide';
  return map;
}
// ----------------------
// COMPLEX BUILDERS
// --------------------
function buildRing(color: string, width: string = "3px", inset: boolean = false, offset?: string, offsetColor?: string): string {
  const vars = [
    `--garur-ring-color:${color}`,
    `--garur-ring-width:${width}`
  ];
  if (offset) vars.push(`--garur-ring-offset-width:${offset}`);
  if (offsetColor) vars.push(`--garur-ring-offset-color:${offsetColor}`);
  if (inset) vars.push(`--garur-ring-inset:1`);
  const offsetShadow = offset && offsetColor ? `0 0 0 var(--garur-ring-offset-width) var(--garur-ring-offset-color)` : "";
  const ringShadow = `0 0 0 calc(var(--garur-ring-width)) var(--garur-ring-color)`;
  const insetShadow = inset ? `, inset 0 0 0 calc(var(--garur-ring-width)) var(--garur-ring-color)` : "";
  const shadows = [offsetShadow, ringShadow + insetShadow].filter(Boolean).join(", ");
  return `${vars.join(";")};box-shadow:${shadows}`;
}
function buildGradient(value: string): string {
  if (!value) return "";
  const v = value.trim();
  // Handle explicit gradient definitions
  if (v.startsWith('linear-gradient(') || v.startsWith('radial-gradient(') || v.startsWith('conic-gradient(')) {
    return `background-image: ${v}`;
  }
  // Handle gradient direction tokens
  const directionMap: Record<string, string> = {
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
    return `background-image: linear-gradient(${directionMap[v]}, var(--gr-gradient-stops))`;
  }
  // Handle from/via/to syntax
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
// ----------------------------------------------------------------
// MAIN UTILITY GENERATOR
// --------------------------------------------------------
function generateSimpleUtilities(): Record<string, string> {
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
      ...generateOverflowUtilities(),
      ...generateAdditionalUtilities(),
      // Common utilities
      'sr-only': 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0',
      'not-sr-only': 'position:static;width:auto;height:auto;padding:0;margin:0;overflow:visible;clip:auto;white-space:normal',
      'truncate': 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap',
      'overflow-ellipsis': 'text-overflow:ellipsis',
      'overflow-clip': 'text-overflow:clip',
    };
  } catch (error) {
    logger.error('Failed to generate utilities', undefined);
    return {};
  }
}
// Cache generated utilities
const SIMPLE_UTILS = generateSimpleUtilities();
// ============================================
// UTILITY DOCUMENTATION
// ============================================
export const UTIL_DOCS: UtilityDefinition[] = [
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
  // Additional categories
  { id: "aspect-video", desc: "Aspect ratio 16:9", example: "aspect-video", category: "sizing" },
  { id: "grid-cols-3", desc: "3 column grid", example: "grid-cols-3", category: "layout" },
  { id: "grow", desc: "Flex grow", example: "grow", category: "layout" },
  { id: "whitespace-nowrap", desc: "No wrap whitespace", example: "whitespace-nowrap", category: "typography" },
  { id: "place-items-center", desc: "Place items center", example: "place-items-center", category: "layout" },
  { id: "divide-x-2", desc: "Divide x with 2px border", example: "divide-x-2", category: "layout" },
  { id: "fill-red-500", desc: "SVG fill color", example: "fill-red-500", category: "colors" },
  { id: "object-cover", desc: "Object fit cover", example: "object-cover", category: "sizing" },
  { id: "origin-center", desc: "Transform origin center", example: "origin-center", category: "transforms" },
  { id: "resize-none", desc: "No resize", example: "resize-none", category: "interactivity" },
  { id: "appearance-none", desc: "No appearance", example: "appearance-none", category: "interactivity" },
  { id: "outline-none", desc: "No outline", example: "outline-none", category: "effects" },
  { id: "grayscale", desc: "Grayscale filter", example: "grayscale", category: "effects" },
  { id: "delay-150", desc: "Transition delay 150ms", example: "delay-150", category: "animation" },
  { id: "duration-200", desc: "Transition duration 200ms", example: "duration-200", category: "animation" },
  { id: "size-4", desc: "Square size 1rem", example: "size-4", category: "sizing" },
  { id: "order-1", desc: "Flex order 1", example: "order-1", category: "layout" },
  { id: "ring-offset-2", desc: "Ring offset 2px", example: "ring-offset-2", category: "effects" },
];
// ============================================
// HANDLER FUNCTIONS
// ============================================
function handleArbitraryValue(token: ParsedToken, arbVal: string, important: boolean): string | null {
  const propMap: Record<string, string> = {
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
  const axisMap: Record<string, { prop: string; sides: string[] }> = {
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
  let result: string | null = null;
  const prop = propMap[token.key as keyof typeof propMap];
  if (prop) {
    result = `${prop}:${arbVal}`;
  } else {
    const axisEntry = axisMap[token.key as keyof typeof axisMap];
    if (axisEntry) {
      const { prop: axProp, sides } = axisEntry;
      const decl = sides.map(side => `${axProp}-${side}:${arbVal}`).join(";");
      result = decl;
    } else {
      const special = getSpecialHandler(token.key);
      if (special) {
        result = special(arbVal);
      }
    }
  }
  return result ? addImportant(result, important) : null;
}
function handleColorProperty(property: string, value: string, important: boolean): string | null {
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
function handleBorderProperty(value: string, important: boolean): string | null {
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
function handleRingProperty(value: string, important: boolean): string | null {
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
      if (parts[1].startsWith('offset-')) {
        offsetPart = parts[1].replace('offset-', '');
      } else {
        widthPart = ensureUnitForLength(parts[1]) || "3px";
      }
    }
  }
  const arbWidth = getArbitraryValue(widthPart, false);
  if (arbWidth) widthPart = arbWidth;
  const color = resolvePaletteColor(colorPart) ||
    normalizeColorToken(colorPart) ||
    (isArbitrary(colorPart) ? colorPart : "#3b82f6");
  const offsetWidth = ensureUnitForLength(offsetPart || '') || undefined;
  const decl = buildRing(color, widthPart, inset, offsetWidth, offsetColor);
  return addImportant(decl, important);
}
function handlePseudoElement(
  pseudo: string,
  property: string,
  value: string,
  important: boolean,
  extraDecl?: string
): HandlerResult | null {
  const color = resolvePaletteColor(value) ||
    normalizeColorToken(value) ||
    (isArbitrary(value) ? value : null);
  if (!color) return null;
  let decl = `${property}:${color}`;
  if (extraDecl) {
    decl += `;${extraDecl}`;
  }
  return {
    decl: addImportant(decl, important),
    selectorSuffix: pseudo
  };
}
function handlePluginFallback(token: ParsedToken, important: boolean): HandlerResult | null {
  try {
    const hooks = plugin.getHandlerHooks();
    for (const hook of hooks) {
      const result = hook(token);
      if (result) {
        if (typeof result === "string") {
          return addImportant(result, important);
        }
        const handlerResult = result as any;
        if (handlerResult.decl) {
          handlerResult.decl = addImportant(handlerResult.decl, important);
        }
        return handlerResult;
      }
    }
  } catch (error) {
    logger.error(`Plugin hook error for token: ${token.raw}`, token);
  }
  return null;
}
function handleComplexCases(token: ParsedToken, important: boolean, negative: boolean): HandlerResult | null {
  const key = token.key;
  let value = token.value || "";
  if (negative && value && !value.startsWith("-")) {
    value = `-${value}`; }
  // Color handlers
  if (key === "bg" || key === "background") {
    return handleColorProperty("background-color", value, important);}
  if (key === "text" || key === "tc" || key === "fg") {
    return handleColorProperty("color", value, important);}
  if (key === "border" || key === "bd") {
    return handleBorderProperty(value, important);}
  // Ring utilities
  if (key === "rg" || key === "ring") {
    return handleRingProperty(value, important);}
  // Gradient
  if (key === "gd" || key === "gradient") {
    const gradient = buildGradient(value);
    return gradient ? addImportant(gradient, important) : null;}
  // Pseudo-elements
  if (key === "ph" || key === "placeholder") {
    return handlePseudoElement("::placeholder", "color", value, important);}
  if (key === "sel" || key === "selection") {
    return handlePseudoElement("::selection", "background-color", value, important, "color:#fff");}
  // Plugin fallback
  return handlePluginFallback(token, important);
}
// ============================================
// MAIN HANDLER EXPORT
// ============================================
export function handle(token: ParsedToken): HandlerResult | null {
  if (!token || !token.key) {
    return null;
  }
  const important = token.important || false;
  const negative = token.negative || false;
  try {
    // Universal arbitrary [property:value] utility support
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
        const extra = KEYFRAMES[animationType as keyof typeof KEYFRAMES];
        if (extra) {
          return {
            decl: addImportant(result, important),
            extra
          };
        }
      }
      return addImportant(result, important);
    }
    // Arbitrary value support
    const arbVal = getArbitraryValue(token.value || "", negative);
    if (arbVal !== null) {
      return handleArbitraryValue(token, arbVal, important);
    }
    // Complex handlers for dynamic values
    return handleComplexCases(token, important, negative);
  } catch (error) {
    logger.error(`Error handling token: ${token.raw}`, token);
    return null;
  }
}
export default {
  handle,
  UTIL_DOCS,
  getUtilityCount: () => Object.keys(SIMPLE_UTILS).length,
  hasUtility: (util: string) => util in SIMPLE_UTILS
}; // now it is done, phew that was a long one, need coffee