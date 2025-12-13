// // src/handler.ts
// // Robust, mature CSS-in-JS utility handler with comprehensive Tailwind-like functionality
// // Features: Type safety, error boundaries, performance optimizations, plugin system, and full utility coverage
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
// // Enhanced type definitions
// export type HandlerResult = string | {
//   decl: string;
//   selectorSuffix?: string;
//   extra?: string;
//   mediaQuery?: string;
// };
// export interface UtilityDefinition {
//   id: string;
//   desc: string;
//   example?: string;
//   category: string;
// }
// // Error handling utilities
// class HandlerError extends Error {
//   constructor(message: string, public token?: ParsedToken, public context?: any) {
//     super(message);
//     this.name = 'HandlerError';
//   }
// }
// const logger = {
//   warn: (message: string, token?: ParsedToken) => {
//     if (process.env.NODE_ENV !== 'production') {
//       console.warn(`[Garur Handler] ${message}`, token || '');
//     }
//   },
//   error: (message: string, token?: ParsedToken) => {
//     if (process.env.NODE_ENV !== 'production') {
//       console.error(`[Garur Handler] ${message}`, token || '');
//     }
//   }
// };
// // Enhanced configuration with fallbacks
// interface GarurConfig {
//   palette?: Record<string, any>;
//   theme?: {
//     colors?: Record<string, any>;
//     spacing?: Record<string, string>;
//     borderRadius?: Record<string, string>;
//     borderWidth?: Record<string, string>;
//     boxShadow?: Record<string, string>;
//     fontSize?: Record<string, any>;
//     fontWeight?: Record<string, string | number>;
//     lineHeight?: Record<string, string>;
//     letterSpacing?: Record<string, string>;
//     fontFamily?: Record<string, any>;
//     blur?: Record<string, string>;
//     brightness?: Record<string, string>;
//     contrast?: Record<string, string>;
//     dropShadow?: Record<string, string>;
//     hueRotate?: Record<string, string>;
//     saturate?: Record<string, string>;
//     rotate?: Record<string, string>;
//     translate?: Record<string, string>;
//     scale?: Record<string, string>;
//     skew?: Record<string, string>;
//     zIndex?: Record<string, string>;
//     transitionDuration?: Record<string, string>;
//     transitionDelay?: Record<string, string>;
//     transitionTimingFunction?: Record<string, string>;
//     backdropBlur?: Record<string, string>;
//     backdropBrightness?: Record<string, string>;
//     backdropContrast?: Record<string, string>;
//     backdropOpacity?: Record<string, string>;
//     backdropSaturate?: Record<string, string>;
//     [key: string]: any;
//   };
//   [key: string]: any;
// }
// const config = configDefault as GarurConfig;
// // Enhanced UTIL_DOCS with categories
// export const UTIL_DOCS: UtilityDefinition[] = [
//   // Layout
//   { id: "container", desc: "Container width helper", example: "container", category: "layout" },
//   { id: "flex", desc: "Display flex", example: "flex", category: "layout" },
//   { id: "grid", desc: "Display grid", example: "grid", category: "layout" },
//   { id: "hidden", desc: "Display none", example: "hidden", category: "layout" },
//   // Spacing
//   { id: "p-4", desc: "Padding", example: "p-4", category: "spacing" },
//   { id: "m-2", desc: "Margin", example: "m-2", category: "spacing" },
//   { id: "mx-auto", desc: "Horizontal auto margin", example: "mx-auto", category: "spacing" },
//   // Sizing
//   { id: "w-full", desc: "Width 100%", example: "w-full", category: "sizing" },
//   { id: "h-screen", desc: "Height 100vh", example: "h-screen", category: "sizing" },
//   // Colors
//   { id: "bg-red-500", desc: "Background color from palette", example: "bg-red-500", category: "colors" },
//   { id: "text-gray-700", desc: "Text color from palette", example: "text-gray-700", category: "colors" },
//   { id: "border-blue-300", desc: "Border color from palette", example: "border-blue-300", category: "colors" },
//   { id: "bg-red-500/50", desc: "Background with 50% opacity", example: "bg-red-500/50", category: "colors" },
//   // Typography
//   { id: "text-lg", desc: "Large text", example: "text-lg", category: "typography" },
//   { id: "font-bold", desc: "Bold font weight", example: "font-bold", category: "typography" },
//   { id: "text-center", desc: "Text align center", example: "text-center", category: "typography" },
//   // Effects
//   { id: "shadow-lg", desc: "Large shadow", example: "shadow-lg", category: "effects" },
//   { id: "blur-sm", desc: "Small blur", example: "blur-sm", category: "effects" },
//   { id: "opacity-50", desc: "50% opacity", example: "opacity-50", category: "effects" },
//   // Transforms
//   { id: "rotate-45", desc: "45 degree rotation", example: "rotate-45", category: "transforms" },
//   { id: "scale-110", desc: "110% scale", example: "scale-110", category: "transforms" },
//   { id: "translate-x-4", desc: "Horizontal translation", example: "translate-x-4", category: "transforms" },
//   // Interactivity
//   { id: "hover:bg-blue-500", desc: "Hover background color", example: "hover:bg-blue-500", category: "interactivity" },
//   { id: "focus:ring-2", desc: "Focus ring", example: "focus:ring-2", category: "interactivity" },
//   { id: "cursor-pointer", desc: "Pointer cursor", example: "cursor-pointer", category: "interactivity" },
//   // Animation
//   { id: "animate-spin", desc: "Spin animation", example: "animate-spin", category: "animation" },
//   { id: "transition-all", desc: "Transition all properties", example: "transition-all", category: "animation" },
//   // Layout New
//   { id: "aspect-video", desc: "Aspect ratio 16:9", example: "aspect-video", category: "layout" },
//   { id: "grid-cols-3", desc: "3 column grid", example: "grid-cols-3", category: "layout" },
//   { id: "grow", desc: "Flex grow", example: "grow", category: "layout" },
//   // Typography New
//   { id: "whitespace-nowrap", desc: "No wrap whitespace", example: "whitespace-nowrap", category: "typography" },
//   { id: "break-words", desc: "Break words", example: "break-words", category: "typography" },
//   { id: "list-disc", desc: "List style disc", example: "list-disc", category: "typography" },
// ];
// // Keyframes
// const KEYFRAMES = {
//   spin: `@keyframes garur-spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}`,
//   bounce: `@keyframes garur-bounce{0%,20%,53%,80%,100%{transform:translate3d(0,0,0)}40%,43%{transform:translate3d(0,-30px,0)}70%{transform:translate3d(0,-15px,0)}90%{transform:translate3d(0,-4px,0)}}`,
//   ping: `@keyframes garur-ping{75%,100%{transform:scale(2);opacity:0}}`,
//   pulse: `@keyframes garur-pulse{50%{opacity:.5}}`,
// };
// /* ---------- Core Utilities ---------- */
// // Safe color conversion with comprehensive error handling
// function hexToRgba(hex: string, alpha: number = 1): string | null {
//   try {
//     if (!hex || typeof hex !== 'string') return null;
//     let h = hex.replace("#", "").trim();
//     if (!h) return null;
//     // Handle different hex formats
//     if (h.length === 3) {
//       h = h.split("").map(c => c + c).join("");
//     } else if (h.length === 4) {
//       const chars = h.split("");
//       const r = chars[0] + chars[0];
//       const g = chars[1] + chars[1];
//       const b = chars[2] + chars[2];
//       const aHex = chars[3] + chars[3];
//       h = r + g + b;
//       const hexAlpha = parseInt(aHex, 16) / 255;
//       alpha = alpha * hexAlpha;
//     } else if (h.length === 8) {
//       const aHex = h.slice(6, 8);
//       h = h.slice(0, 6);
//       const hexAlpha = parseInt(aHex, 16) / 255;
//       alpha = alpha * hexAlpha;
//     }
//     if (h.length !== 6) return null;
//     const rr = parseInt(h.slice(0, 2), 16);
//     const gg = parseInt(h.slice(2, 4), 16);
//     const bb = parseInt(h.slice(4, 6), 16);
//     if (isNaN(rr) || isNaN(gg) || isNaN(bb)) return null;
//     return `rgba(${rr}, ${gg}, ${bb}, ${Math.max(0, Math.min(1, alpha))})`;
//   } catch (error) {
//     logger.error(`Failed to convert hex to rgba: ${hex}`, undefined);
//     return null;
//   }
// }
// // Enhanced color resolution with proper priority
// function resolvePaletteColor(value: string): string | null {
//   if (!value || typeof value !== 'string') return null;
//   try {
//     const parts = value.split("/");
//     const colorPart = parts[0]?.trim();
//     const alphaPart = parts[1]?.trim();
//     if (!colorPart) return null;
//     const palette = config.palette || config.theme?.colors || {};
//     // Direct color match (e.g., "red")
//     if (palette[colorPart]) {
//       if (typeof palette[colorPart] === 'string') {
//         return applyAlphaToColor(palette[colorPart], alphaPart);
//       }
//       // Object with shades - try 500 as default
//       if (typeof palette[colorPart] === 'object' && palette[colorPart]['500']) {
//         return applyAlphaToColor(palette[colorPart]['500'], alphaPart);
//       }
//     }
//     // Color-shade pattern (e.g., "red-500")
//     const match = colorPart.match(/^([a-zA-Z]+)-(\d{2,3})$/);
//     if (match) {
//       const [_, colorName, shade] = match;
//       if (palette[colorName] && typeof palette[colorName] === 'object' && palette[colorName][shade]) {
//         return applyAlphaToColor(palette[colorName][shade], alphaPart);
//       }
//     }
//     return null;
//   } catch (error) {
//     logger.error(`Failed to resolve palette color: ${value}`, undefined);
//     return null;
//   }
// }
// function applyAlphaToColor(color: string, alphaPart?: string): string {
//   if (!alphaPart) return color;
//   const alpha = parseFloat(alphaPart);
//   if (!isNaN(alpha) && alpha >= 0 && alpha <= 1) {
//     const rgba = hexToRgba(color, alpha);
//     return rgba || color;
//   }
//   return color;
// }
// // Enhanced arbitrary value detection
// function isArbitrary(value: string): boolean {
//   if (!value || typeof value !== 'string') return false;
//   return /[\s()\[\]$#]|calc\(|var\(|url\(/.test(value);
// }
// // Universal arbitrary property support
// const ARBITRARY_PROPERTY_RE = /^\[([a-zA-Z0-9\-_]+):\s*([^\]]+)\]$/;
// // Safe value flattening
// function flattenColorPalette(palette: Record<string, any>): Record<string, string> {
//   const flat: Record<string, string> = {};
//   try {
//     for (const [color, shades] of Object.entries(palette)) {
//       if (!shades) continue;
//       if (typeof shades === "object" && !Array.isArray(shades)) {
//         for (const [shade, value] of Object.entries(shades)) {
//           if (typeof value === "string" && value) {
//             flat[`${color}-${shade}`] = value;
//           }
//         }
//       } else if (typeof shades === "string") {
//         flat[color] = shades;
//       }
//     }
//   } catch (error) {
//     logger.error('Failed to flatten color palette', undefined);
//   }
//   return flat;
// }
// // Enhanced important handling
// function addImportant(decl: string, important: boolean): string {
//   if (!important || !decl) return decl;
//   return decl
//     .split(';')
//     .filter(part => part.trim())
//     .map(part => {
//       const trimmed = part.trim();
//       if (!trimmed || trimmed.includes('!important')) return trimmed;
//       return trimmed + ' !important';
//     })
//     .join(';') + (decl.endsWith(';') ? '' : ';');
// }
// // Safe arbitrary value extraction
// function getArbitraryValue(value: string, negative: boolean): string | null {
//   if (!value) return null;
//   try {
//     const match = value.match(/\[([^\[\]]+)\]/);
//     if (!match) return null;
//     let v = match[1].replace(/_/g, ' ').trim();
//     if (negative && v && !v.startsWith('-')) {
//       v = '-' + v;
//     }
//     return v || null;
//   } catch (error) {
//     return null;
//   }
// }
// /* ---------- Dynamic Utilities Generator ---------- */
// // Configuration scales with comprehensive fallbacks
// const SCALES = {
//   spacing: {
//     px: "1px", 0: "0", 0.5: "0.125rem", 1: "0.25rem", 1.5: "0.375rem",
//     2: "0.5rem", 2.5: "0.625rem", 3: "0.75rem", 3.5: "0.875rem", 4: "1rem",
//     5: "1.25rem", 6: "1.5rem", 7: "1.75rem", 8: "2rem", 9: "2.25rem",
//     10: "2.5rem", 11: "2.75rem", 12: "3rem", 14: "3.5rem", 16: "4rem",
//     20: "5rem", 24: "6rem", 28: "7rem", 32: "8rem", 36: "9rem",
//     40: "10rem", 44: "11rem", 48: "12rem", 52: "13rem", 56: "14rem",
//     60: "15rem", 64: "16rem", 72: "18rem", 80: "20rem", 96: "24rem",
//     ...config.theme?.spacing
//   },
//   borderRadius: {
//     none: "0px", sm: "0.125rem", DEFAULT: "0.25rem", md: "0.375rem",
//     lg: "0.5rem", xl: "0.75rem", "2xl": "1rem", "3xl": "1.5rem",
//     full: "9999px", ...config.theme?.borderRadius
//   },
//   borderWidth: {
//     0: "0px", 1: "1px", 2: "2px", 4: "4px", 8: "8px",
//     DEFAULT: "1px", ...config.theme?.borderWidth
//   },
//   boxShadow: {
//     sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
//     DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
//     md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
//     lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
//     xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
//     "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
//     inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
//     none: "none", ...config.theme?.boxShadow
//   },
//   opacity: {
//     0: "0", 5: "0.05", 10: "0.1", 15: "0.15", 20: "0.2", 25: "0.25",
//     30: "0.3", 35: "0.35", 40: "0.4", 45: "0.45", 50: "0.5", 55: "0.55",
//     60: "0.6", 65: "0.65", 70: "0.7", 75: "0.75", 80: "0.8", 85: "0.85",
//     90: "0.9", 95: "0.95", 100: "1"
//   },
//   zIndex: {
//     0: "0", 10: "10", 20: "20", 30: "30", 40: "40", 50: "50",
//     auto: "auto", ...config.theme?.zIndex
//   }
// };
// // Core utility generators
// function generateLayoutUtilities() {
//   const map: Record<string, string> = {};
//   // Display
//   const displays = {
//     block: "block", "inline-block": "inline-block", inline: "inline",
//     flex: "flex", "inline-flex": "inline-flex", grid: "grid",
//     "inline-grid": "inline-grid", table: "table",
//     "table-cell": "table-cell", "table-row": "table-row",
//     "table-caption": "table-caption", hidden: "none"
//   };
//   Object.entries(displays).forEach(([key, value]) => {
//     map[key === 'hidden' ? 'hidden' : key] = `display:${value}`;
//   });
//   // Position
//   const positions = {
//     static: "static", relative: "relative", absolute: "absolute",
//     fixed: "fixed", sticky: "sticky"
//   };
//   Object.entries(positions).forEach(([key, value]) => {
//     map[key] = `position:${value}`;
//   });
//   // Container
//   map.container = "width:100%;margin-left:auto;margin-right:auto;padding-left:1rem;padding-right:1rem;max-width:1280px";
//   // Box Sizing
//   map['box-border'] = 'box-sizing:border-box';
//   map['box-content'] = 'box-sizing:content-box';
//   return map;
// }
// function generateSpacingUtilities() {
//   const map: Record<string, string> = {};
//   const spacing = SCALES.spacing;
//   // Padding
//   Object.entries(spacing).forEach(([key, value]) => {
//     map[`p-${key}`] = `padding:${value}`;
//     map[`pt-${key}`] = `padding-top:${value}`;
//     map[`pr-${key}`] = `padding-right:${value}`;
//     map[`pb-${key}`] = `padding-bottom:${value}`;
//     map[`pl-${key}`] = `padding-left:${value}`;
//     map[`px-${key}`] = `padding-left:${value};padding-right:${value}`;
//     map[`py-${key}`] = `padding-top:${value};padding-bottom:${value}`;
//   });
//   // Margin
//   Object.entries(spacing).forEach(([key, value]) => {
//     map[`m-${key}`] = `margin:${value}`;
//     map[`mt-${key}`] = `margin-top:${value}`;
//     map[`mr-${key}`] = `margin-right:${value}`;
//     map[`mb-${key}`] = `margin-bottom:${value}`;
//     map[`ml-${key}`] = `margin-left:${value}`;
//     map[`mx-${key}`] = `margin-left:${value};margin-right:${value}`;
//     map[`my-${key}`] = `margin-top:${value};margin-bottom:${value}`;
//   });
//   // Space Between
//   Object.entries(spacing).forEach(([key, value]) => {
//     map[`space-x-${key}`] = `& > :not([hidden]) ~ :not([hidden]) { --tw-space-x-reverse: 0; margin-left: calc(${value} * calc(1 - var(--tw-space-x-reverse))); margin-right: calc(${value} * var(--tw-space-x-reverse)) }`;
//     map[`space-y-${key}`] = `& > :not([hidden]) ~ :not([hidden]) { --tw-space-y-reverse: 0; margin-top: calc(${value} * calc(1 - var(--tw-space-y-reverse))); margin-bottom: calc(${value} * var(--tw-space-y-reverse)) }`;
//   });
//   return map;
// }
// function generateSizingUtilities() {
//   const map: Record<string, string> = {};
//   const spacing = SCALES.spacing;
//   // Width & Height from spacing scale
//   Object.entries(spacing).forEach(([key, value]) => {
//     map[`w-${key}`] = `width:${value}`;
//     map[`h-${key}`] = `height:${value}`;
//     map[`min-w-${key}`] = `min-width:${value}`;
//     map[`min-h-${key}`] = `min-height:${value}`;
//     map[`max-w-${key}`] = `max-width:${value}`;
//     map[`max-h-${key}`] = `max-height:${value}`;
//   });
//   // Special sizes
//   map['w-full'] = 'width:100%';
//   map['w-screen'] = 'width:100vw';
//   map['w-auto'] = 'width:auto';
//   map['h-full'] = 'height:100%';
//   map['h-screen'] = 'height:100vh';
//   map['h-auto'] = 'height:auto';
//   // Fractional widths
//   const fractions = {
//     '1/2': '50%', '1/3': '33.333333%', '2/3': '66.666667%',
//     '1/4': '25%', '2/4': '50%', '3/4': '75%',
//     '1/5': '20%', '2/5': '40%', '3/5': '60%', '4/5': '80%',
//     '1/6': '16.666667%', '2/6': '33.333333%', '3/6': '50%',
//     '4/6': '66.666667%', '5/6': '83.333333%',
//     '1/12': '8.333333%', '2/12': '16.666667%', '3/12': '25%',
//     '4/12': '33.333333%', '5/12': '41.666667%', '6/12': '50%',
//     '7/12': '58.333333%', '8/12': '66.666667%', '9/12': '75%',
//     '10/12': '83.333333%', '11/12': '91.666667%'
//   };
//   Object.entries(fractions).forEach(([key, value]) => {
//     map[`w-${key}`] = `width:${value}`;
//   });
//   return map;
// }
// function generateColorUtilities() {
//   const map: Record<string, string> = {};
//   const palette = config.palette || config.theme?.colors || {};
//   const flatColors = flattenColorPalette(palette);
//   const opacitySteps = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
//   // Background colors
//   Object.entries(flatColors).forEach(([colorToken, color]) => {
//     map[`bg-${colorToken}`] = `background-color:${color}`;
//     // Opacity variants
//     opacitySteps.forEach(opacity => {
//       const rgbaColor = hexToRgba(color, opacity / 100);
//       if (rgbaColor) {
//         map[`bg-${colorToken}\\/${opacity}`] = `background-color:${rgbaColor}`;
//       }
//     });
//   });
//   // Text colors
//   Object.entries(flatColors).forEach(([colorToken, color]) => {
//     map[`text-${colorToken}`] = `color:${color}`;
//     opacitySteps.forEach(opacity => {
//       const rgbaColor = hexToRgba(color, opacity / 100);
//       if (rgbaColor) {
//         map[`text-${colorToken}\\/${opacity}`] = `color:${rgbaColor}`;
//       }
//     });
//   });
//   // Border colors
//   Object.entries(flatColors).forEach(([colorToken, color]) => {
//     map[`border-${colorToken}`] = `border-color:${color}`;
//     opacitySteps.forEach(opacity => {
//       const rgbaColor = hexToRgba(color, opacity / 100);
//       if (rgbaColor) {
//         map[`border-${colorToken}\\/${opacity}`] = `border-color:${rgbaColor}`;
//       }
//     });
//   });
//   // Special colors
//   map['bg-transparent'] = 'background-color:transparent';
//   map['bg-current'] = 'background-color:currentColor';
//   map['text-transparent'] = 'color:transparent';
//   map['text-current'] = 'color:currentColor';
//   map['border-transparent'] = 'border-color:transparent';
//   map['border-current'] = 'border-color:currentColor';
//   return map;
// }
// function generateTypographyUtilities() {
//   const map: Record<string, string> = {};
//   const theme = config.theme || {};
//   // Font Size
//   const fontSize = theme.fontSize || {
//     xs: ['0.75rem', '1rem'], sm: ['0.875rem', '1.25rem'],
//     base: ['1rem', '1.5rem'], lg: ['1.125rem', '1.75rem'],
//     xl: ['1.25rem', '1.75rem'], '2xl': ['1.5rem', '2rem'],
//     '3xl': ['1.875rem', '2.25rem'], '4xl': ['2.25rem', '2.5rem'],
//     '5xl': ['3rem', '1'], '6xl': ['3.75rem', '1'], '7xl': ['4.5rem', '1'],
//     '8xl': ['6rem', '1'], '9xl': ['8rem', '1']
//   };
//   Object.entries(fontSize).forEach(([key, value]) => {
//     if (Array.isArray(value)) {
//       map[`text-${key}`] = `font-size:${value[0]};line-height:${value[1]}`;
//     } else {
//       map[`text-${key}`] = `font-size:${value}`;
//     }
//   });
//   // Font Weight
//   const fontWeight = theme.fontWeight || {
//     thin: '100', extralight: '200', light: '300', normal: '400',
//     medium: '500', semibold: '600', bold: '700', extrabold: '800',
//     black: '900'
//   };
//   Object.entries(fontWeight).forEach(([key, value]) => {
//     map[`font-${key}`] = `font-weight:${value}`;
//   });
//   // Text Alignment
//   const textAlign = {
//     left: 'left', center: 'center', right: 'right', justify: 'justify'
//   };
//   Object.entries(textAlign).forEach(([key, value]) => {
//     map[`text-${key}`] = `text-align:${value}`;
//   });
//   // Text Transform
//   map.uppercase = 'text-transform:uppercase';
//   map.lowercase = 'text-transform:lowercase';
//   map.capitalize = 'text-transform:capitalize';
//   map['normal-case'] = 'text-transform:none';
//   // Text Decoration
//   map.underline = 'text-decoration-line:underline';
//   map['line-through'] = 'text-decoration-line:line-through';
//   map['no-underline'] = 'text-decoration-line:none';
//   // Whitespace
//   const whitespace = {
//     normal: 'normal', nowrap: 'nowrap', pre: 'pre',
//     'pre-line': 'pre-line', 'pre-wrap': 'pre-wrap'
//   };
//   Object.entries(whitespace).forEach(([key, value]) => {
//     map[`whitespace-${key}`] = `white-space:${value}`;
//   });
//   // Line Height
//   const lineHeight = theme.lineHeight || {
//     none: '1', tight: '1.25', snug: '1.375', normal: '1.5',
//     relaxed: '1.625', loose: '2'
//   };
//   Object.entries(lineHeight).forEach(([key, value]) => {
//     map[`leading-${key}`] = `line-height:${value}`;
//   });
//   return map;
// }
// function generateBorderUtilities() {
//   const map: Record<string, string> = {};
//   const borderRadius = SCALES.borderRadius;
//   const borderWidth = SCALES.borderWidth;
//   // Border Radius
//   Object.entries(borderRadius).forEach(([key, value]) => {
//     if (key === 'DEFAULT') {
//       map.rounded = `border-radius:${value}`;
//     } else {
//       map[`rounded-${key}`] = `border-radius:${value}`;
//       map[`rounded-t-${key}`] = `border-top-left-radius:${value};border-top-right-radius:${value}`;
//       map[`rounded-r-${key}`] = `border-top-right-radius:${value};border-bottom-right-radius:${value}`;
//       map[`rounded-b-${key}`] = `border-bottom-left-radius:${value};border-bottom-right-radius:${value}`;
//       map[`rounded-l-${key}`] = `border-top-left-radius:${value};border-bottom-left-radius:${value}`;
//     }
//   });
//   // Border Width
//   Object.entries(borderWidth).forEach(([key, value]) => {
//     if (key === 'DEFAULT') {
//       map.border = `border-width:${value}`;
//     } else {
//       map[`border-${key}`] = `border-width:${value}`;
//       map[`border-t-${key}`] = `border-top-width:${value}`;
//       map[`border-r-${key}`] = `border-right-width:${value}`;
//       map[`border-b-${key}`] = `border-bottom-width:${value}`;
//       map[`border-l-${key}`] = `border-left-width:${value}`;
//       map[`border-x-${key}`] = `border-left-width:${value};border-right-width:${value}`;
//       map[`border-y-${key}`] = `border-top-width:${value};border-bottom-width:${value}`;
//     }
//   });
//   // Border Style
//   const borderStyles = {
//     solid: 'solid', dashed: 'dashed', dotted: 'dotted',
//     double: 'double', none: 'none'
//   };
//   Object.entries(borderStyles).forEach(([key, value]) => {
//     map[`border-${key}`] = `border-style:${value}`;
//   });
//   return map;
// }
// function generateEffectUtilities() {
//   const map: Record<string, string> = {};
//   const opacity = SCALES.opacity;
//   const boxShadow = SCALES.boxShadow;
//   const zIndex = SCALES.zIndex;
//   // Opacity
//   Object.entries(opacity).forEach(([key, value]) => {
//     map[`opacity-${key}`] = `opacity:${value}`;
//   });
//   // Box Shadow
//   Object.entries(boxShadow).forEach(([key, value]) => {
//     if (key === 'DEFAULT') {
//       map.shadow = `box-shadow:${value}`;
//     } else {
//       map[`shadow-${key}`] = `box-shadow:${value}`;
//     }
//   });
//   // Z-Index
//   Object.entries(zIndex).forEach(([key, value]) => {
//     map[`z-${key}`] = `z-index:${value}`;
//   });
//   return map;
// }
// function generateFlexGridUtilities() {
//   const map: Record<string, string> = {};
//   const spacing = SCALES.spacing;
//   // Flex
//   map.flex = 'display:flex';
//   map['inline-flex'] = 'display:inline-flex';
//   // Flex Direction
//   map['flex-row'] = 'flex-direction:row';
//   map['flex-row-reverse'] = 'flex-direction:row-reverse';
//   map['flex-col'] = 'flex-direction:column';
//   map['flex-col-reverse'] = 'flex-direction:column-reverse';
//   // Flex Wrap
//   map['flex-wrap'] = 'flex-wrap:wrap';
//   map['flex-wrap-reverse'] = 'flex-wrap:wrap-reverse';
//   map['flex-nowrap'] = 'flex-wrap:nowrap';
//   // Flex Properties
//   map['flex-1'] = 'flex:1 1 0%';
//   map['flex-auto'] = 'flex:1 1 auto';
//   map['flex-initial'] = 'flex:0 1 auto';
//   map['flex-none'] = 'flex:none';
//   // Flex Grow/Shrink
//   map.grow = 'flex-grow:1';
//   map['grow-0'] = 'flex-grow:0';
//   map.shrink = 'flex-shrink:1';
//   map['shrink-0'] = 'flex-shrink:0';
//   // Grid
//   map.grid = 'display:grid';
//   map['inline-grid'] = 'display:inline-grid';
//   // Grid Template Columns
//   const gridCols = {
//     1: 'repeat(1, minmax(0, 1fr))', 2: 'repeat(2, minmax(0, 1fr))',
//     3: 'repeat(3, minmax(0, 1fr))', 4: 'repeat(4, minmax(0, 1fr))',
//     5: 'repeat(5, minmax(0, 1fr))', 6: 'repeat(6, minmax(0, 1fr))',
//     7: 'repeat(7, minmax(0, 1fr))', 8: 'repeat(8, minmax(0, 1fr))',
//     9: 'repeat(9, minmax(0, 1fr))', 10: 'repeat(10, minmax(0, 1fr))',
//     11: 'repeat(11, minmax(0, 1fr))', 12: 'repeat(12, minmax(0, 1fr))'
//   };
//   Object.entries(gridCols).forEach(([key, value]) => {
//     map[`grid-cols-${key}`] = `grid-template-columns:${value}`;
//   });
//   // Gap
//   Object.entries(spacing).forEach(([key, value]) => {
//     map[`gap-${key}`] = `gap:${value}`;
//     map[`gap-x-${key}`] = `column-gap:${value}`;
//     map[`gap-y-${key}`] = `row-gap:${value}`;
//   });
//   return map;
// }
// function generateInteractionUtilities() {
//   const map: Record<string, string> = {};
//   // Cursor
//   const cursors = {
//     auto: 'auto', default: 'default', pointer: 'pointer',
//     wait: 'wait', text: 'text', move: 'move',
//     'not-allowed': 'not-allowed', none: 'none'
//   };
//   Object.entries(cursors).forEach(([key, value]) => {
//     map[`cursor-${key}`] = `cursor:${value}`;
//   });
//   // User Select
//   const userSelect = {
//     none: 'none', text: 'text', all: 'all', auto: 'auto'
//   };
//   Object.entries(userSelect).forEach(([key, value]) => {
//     map[`select-${key}`] = `user-select:${value}`;
//   });
//   // Pointer Events
//   map['pointer-events-none'] = 'pointer-events:none';
//   map['pointer-events-auto'] = 'pointer-events:auto';
//   return map;
// }
// function generateAnimationUtilities() {
//   const map: Record<string, string> = {};
//   // Animations
//   const animations = {
//     none: 'none',
//     spin: 'garur-spin 1s linear infinite',
//     ping: 'garur-ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
//     pulse: 'garur-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
//     bounce: 'garur-bounce 1s infinite'
//   };
//   Object.entries(animations).forEach(([key, value]) => {
//     map[`animate-${key}`] = `animation:${value}`;
//   });
//   // Transitions
//   map.transition = 'transition-property:color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms';
//   map['transition-none'] = 'transition-property:none';
//   map['transition-all'] = 'transition-property:all;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms';
//   map['transition-colors'] = 'transition-property:color, background-color, border-color, text-decoration-color, fill, stroke;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms';
//   map['transition-opacity'] = 'transition-property:opacity;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms';
//   map['transition-shadow'] = 'transition-property:box-shadow;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms';
//   map['transition-transform'] = 'transition-property:transform;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms';
//   return map;
// }
// // Main utility generator with error boundary
// function generateSimpleUtilities(): Record<string, string> {
//   try {
//     return {
//       ...generateLayoutUtilities(),
//       ...generateSpacingUtilities(),
//       ...generateSizingUtilities(),
//       ...generateColorUtilities(),
//       ...generateTypographyUtilities(),
//       ...generateBorderUtilities(),
//       ...generateEffectUtilities(),
//       ...generateFlexGridUtilities(),
//       ...generateInteractionUtilities(),
//       ...generateAnimationUtilities(),
//       // Common utilities
//       'sr-only': 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0',
//       'not-sr-only': 'position:static;width:auto;height:auto;padding:0;margin:0;overflow:visible;clip:auto;white-space:normal',
//       'truncate': 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap',
//       'overflow-ellipsis': 'text-overflow:ellipsis',
//       'overflow-clip': 'text-overflow:clip',
//     };
//   } catch (error) {
//     logger.error('Failed to generate utilities', undefined);
//     return {};
//   }
// }
// // Cache generated utilities
// const SIMPLE_UTILS = generateSimpleUtilities();
// /* ---------- Complex Builders ---------- */
// function buildRing(color: string, width: string = "3px", inset: boolean = false, offset?: string, offsetColor?: string): string {
//   const vars = [
//     `--garur-ring-color:${color}`,
//     `--garur-ring-width:${width}`
//   ];
//   if (offset) vars.push(`--garur-ring-offset-width:${offset}`);
//   if (offsetColor) vars.push(`--garur-ring-offset-color:${offsetColor}`);
//   if (inset) vars.push(`--garur-ring-inset:1`);
//   const offsetShadow = offset && offsetColor ? `0 0 0 var(--garur-ring-offset-width) var(--garur-ring-offset-color)` : "";
//   const ringShadow = `0 0 0 calc(var(--garur-ring-width)) var(--garur-ring-color)`;
//   const insetShadow = inset ? `, inset 0 0 0 calc(var(--garur-ring-width)) var(--garur-ring-color)` : "";
//   const shadows = [offsetShadow, ringShadow + insetShadow].filter(Boolean).join(", ");
//   return `${vars.join(";")};box-shadow:${shadows}`;
// }
// function buildGradient(value: string): string {
//   if (!value) return "";
//   const v = value.trim();
//   if (/linear-gradient|radial-gradient|conic-gradient/i.test(v)) {
//     return `background-image:${v}`;
//   }
//   const color = normalizeColorToken(v) || resolvePaletteColor(v) || v;
//   return `background-image:linear-gradient(to right,${color},transparent)`;
// }
// /* ---------- Main Handler ---------- */
// export function handle(token: ParsedToken): HandlerResult | null {
//   if (!token || !token.key) {
//     return null;
//   }
//   const important = token.important || false;
//   const negative = token.negative || false;
//   try {
//     // 🆕 Universal arbitrary [property:value] utility support
//     if (token.raw && ARBITRARY_PROPERTY_RE.test(token.raw)) {
//       const match = token.raw.match(ARBITRARY_PROPERTY_RE);
//       if (match) {
//         const prop = match[1].trim().replace(/_/g, "-");
//         let value = match[2].trim().replace(/_/g, " ");
//         if (negative && value && !value.startsWith("-")) {
//           value = "-" + value;
//         }
//         const decl = `${prop}:${value}`;
//         return addImportant(decl, important);
//       }
//     }
//     // Fast-path lookup in pre-generated utilities
//     if (token.raw && SIMPLE_UTILS[token.raw]) {
//       const result = SIMPLE_UTILS[token.raw];
//       // Handle animations that need keyframes
//       if (token.raw.startsWith('animate-')) {
//         const animationType = token.raw.replace('animate-', '');
//         const extra = KEYFRAMES[animationType as keyof typeof KEYFRAMES];
//         if (extra) {
//           return {
//             decl: addImportant(result, important),
//             extra
//           };
//         }
//       }
//       return addImportant(result, important);
//     }
//     // Arbitrary value support (e.g., w-[72px], rounded-[2rem])
//     const arbVal = getArbitraryValue(token.value || "", negative);
//     if (arbVal !== null) {
//       return handleArbitraryValue(token, arbVal, important);
//     }
//     // Complex handlers for dynamic values
//     return handleComplexCases(token, important, negative);
//   } catch (error) {
//     logger.error(`Error handling token: ${token.raw}`, token);
//     return null;
//   }
// }
// function handleArbitraryValue(token: ParsedToken, arbVal: string, important: boolean): string | null {
//   const propMap: Record<string, string> = {
//     w: "width", h: "height",
//     "min-w": "min-width", "max-w": "max-width",
//     "min-h": "min-height", "max-h": "max-height",
//     m: "margin", p: "padding",
//     rounded: "border-radius", border: "border-width",
//     shadow: "box-shadow", opacity: "opacity",
//     "m-block": "margin-block", "m-inline": "margin-inline",
//     "p-block": "padding-block", "p-inline": "padding-inline",
//     inset: "inset", "inset-block": "inset-block",
//     "inset-inline": "inset-inline",
//   };
//   const axisMap: Record<string, { prop: string; sides: string[] }> = {
//     px: { prop: "padding", sides: ["left", "right"] },
//     py: { prop: "padding", sides: ["top", "bottom"] },
//     mx: { prop: "margin", sides: ["left", "right"] },
//     my: { prop: "margin", sides: ["top", "bottom"] },
//     pt: { prop: "padding", sides: ["top"] },
//     pr: { prop: "padding", sides: ["right"] },
//     pb: { prop: "padding", sides: ["bottom"] },
//     pl: { prop: "padding", sides: ["left"] },
//     mt: { prop: "margin", sides: ["top"] },
//     mr: { prop: "margin", sides: ["right"] },
//     mb: { prop: "margin", sides: ["bottom"] },
//     ml: { prop: "margin", sides: ["left"] },
//   };
//   let prop = propMap[token.key];
//   if (prop) {
//     return addImportant(`${prop}:${arbVal}`, important);
//   }
//   const axisEntry = axisMap[token.key];
//   if (axisEntry) {
//     const { prop, sides } = axisEntry;
//     const decl = sides.map(side => `${prop}-${side}:${arbVal}`).join(";");
//     return addImportant(decl, important);
//   }
//   return null;
// }
// function handleComplexCases(token: ParsedToken, important: boolean, negative: boolean): HandlerResult | null {
//   const key = token.key;
//   let value = token.value || "";
//   if (negative && value && !value.startsWith("-")) {
//     value = `-${value}`;
//   }
//   // Color handlers with fallbacks
//   if (key === "bg" || key === "background") {
//     return handleColorProperty("background-color", value, important);
//   }
//   if (key === "text" || key === "tc" || key === "fg") {
//     return handleColorProperty("color", value, important);
//   }
//   if (key === "border" || key === "bd") {
//     return handleBorderProperty(value, important);
//   }
//   // Ring utilities
//   if (key === "rg" || key === "ring") {
//     return handleRingProperty(value, important);
//   }
//   // Gradient
//   if (key === "gd" || key === "gradient") {
//     const gradient = buildGradient(value);
//     return gradient ? addImportant(gradient, important) : null;
//   }
//   // Pseudo-elements
//   if (key === "ph" || key === "placeholder") {
//     return handlePseudoElement("::placeholder", "color", value, important);
//   }
//   if (key === "sel" || key === "selection") {
//     return handlePseudoElement("::selection", "background-color", value, important, "color:#fff");
//   }
//   // Plugin system fallback
//   return handlePluginFallback(token, important);
// }
// function handleColorProperty(property: string, value: string, important: boolean): string | null {
//   const paletteColor = resolvePaletteColor(value);
//   if (paletteColor) {
//     return addImportant(`${property}:${paletteColor}`, important);
//   }
//   const normalizedColor = normalizeColorToken(value);
//   if (normalizedColor) {
//     return addImportant(`${property}:${normalizedColor}`, important);
//   }
//   if (isArbitrary(value)) {
//     return addImportant(`${property}:${value}`, important);
//   }
//   return null;
// }
// function handleBorderProperty(value: string, important: boolean): string | null {
//   const paletteColor = resolvePaletteColor(value);
//   if (paletteColor) {
//     return addImportant(`border-color:${paletteColor}`, important);
//   }
//   const normalizedColor = normalizeColorToken(value);
//   if (normalizedColor) {
//     return addImportant(`border-color:${normalizedColor}`, important);
//   }
//   if (/^\d|\[/.test(value)) {
//     const width = ensureUnitForLength(value);
//     return addImportant(`border-width:${width};border-style:solid`, important);
//   }
//   if (isArbitrary(value)) {
//     return addImportant(`border-color:${value}`, important);
//   }
//   return null;
// }
// function handleRingProperty(value: string, important: boolean): string | null {
//   let inset = false;
//   let colorPart = value;
//   let widthPart = "3px";
//   if (value.startsWith("inset-")) {
//     inset = true;
//     colorPart = value.slice(6);
//   }
//   if (colorPart.includes("/")) {
//     const parts = colorPart.split("/");
//     colorPart = parts[0];
//     widthPart = parts[1]?.match(/^\d+$/) ? `${parts[1]}px` : parts[1] || "3px";
//   }
//   const color = resolvePaletteColor(colorPart) ||
//                 normalizeColorToken(colorPart) ||
//                 (isArbitrary(colorPart) ? colorPart : "#3b82f6");
//   const decl = buildRing(color, widthPart, inset);
//   return addImportant(decl, important);
// }
// function handlePseudoElement(
//   pseudo: string,
//   property: string,
//   value: string,
//   important: boolean,
//   extraDecl?: string
// ): HandlerResult | null {
//   const color = resolvePaletteColor(value) ||
//                 normalizeColorToken(value) ||
//                 (isArbitrary(value) ? value : null);
//   if (!color) return null;
//   let decl = `${property}:${color}`;
//   if (extraDecl) {
//     decl += `;${extraDecl}`;
//   }
//   return {
//     decl: addImportant(decl, important),
//     selectorSuffix: pseudo
//   };
// }
// function handlePluginFallback(token: ParsedToken, important: boolean): HandlerResult | null {
//   try {
//     const hooks = plugin.getHandlerHooks();
//     for (const hook of hooks) {
//       const result = hook(token);
//       if (result) {
//         if (typeof result === "string") {
//           return addImportant(result, important);
//         }
//         const handlerResult = result as any;
//         if (handlerResult.decl) {
//           handlerResult.decl = addImportant(handlerResult.decl, important);
//         }
//         return handlerResult;
//       }
//     }
//   } catch (error) {
//     logger.error(`Plugin hook error for token: ${token.raw}`, token);
//   }
//   return null;
// }
// // Export handler with utility documentation
// export default {
//   handle,
//   UTIL_DOCS,
//   // Utility for development/debugging
//   getUtilityCount: () => Object.keys(SIMPLE_UTILS).length,
//   hasUtility: (util: string) => util in SIMPLE_UTILS
// };
// //
// // ======================================= if i want i can delete
// // ✅ Navbar toggle handler for Garur UI
