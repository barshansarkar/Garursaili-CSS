// ═══════════════════════════════════════════════════════════════════
// GarurSaili-CSS — Config loader
// ═══════════════════════════════════════════════════════════════════

import path from "node:path";
import fs from "node:fs";
import { createRequire } from "node:module";
import { initConfig } from "./native.js";

const requireCjs = createRequire(import.meta.url);

// ───────────────────────────────────────────────
// Types
// ───────────────────────────────────────────────

export interface GarurConfig {
  breakpoints?: Record<string, string>;
  palette?: Record<string, any>;
  darkMode?: "class" | "media";
  important?: boolean;
  // ✨ Rule 2: Semantic colors (optional, default OFF)
  semanticColors?: boolean;
  semanticOverrides?: Record<string, string>;
  [key: string]: any;
}

// ───────────────────────────────────────────────
// Defaults
// ───────────────────────────────────────────────
//
// NOTE: Palette intentionally NOT defined here.
// The Rust side owns DEFAULT_PALETTE (31 families · 343 colors).
// Users only need to pass `palette` if they want to add/override colors.

const DEFAULT_CONFIG: GarurConfig = {
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
  darkMode: "class",
  important: false,
  // ✨ Rule 2 — default OFF (opt-in)
  semanticColors: false,
  semanticOverrides: {},
};

// ───────────────────────────────────────────────
// Deep merge helpers
// ───────────────────────────────────────────────

/**
 * Deep merge user palette with default palette (if any).
 * If neither side has palette, returns empty object.
 */
function mergePalette(
  defaultPal: Record<string, any> | undefined,
  userPal: Record<string, any> | undefined
): Record<string, any> {
  // No user palette → use default (or empty)
  if (!userPal) return defaultPal ? { ...defaultPal } : {};

  // No default palette → use user palette as-is
  if (!defaultPal) return { ...userPal };

  // Both exist → merge shades color-by-color
  const out: Record<string, any> = { ...defaultPal };
  for (const [color, shades] of Object.entries(userPal)) {
    if (
      shades &&
      typeof shades === "object" &&
      !Array.isArray(shades) &&
      defaultPal[color] &&
      typeof defaultPal[color] === "object"
    ) {
      // Merge shades: { ...default[color], ...user[color] }
      out[color] = { ...defaultPal[color], ...shades };
    } else {
      // Direct override
      out[color] = shades;
    }
  }
  return out;
}

// ───────────────────────────────────────────────
// Load config from disk
// ───────────────────────────────────────────────

export function loadConfig(): GarurConfig {
  const p = path.resolve(process.cwd(), "garur.config.js");

  if (fs.existsSync(p)) {
    try {
      const mod = requireCjs(p);
      const user = (mod.default || mod) as GarurConfig;

      return {
        ...DEFAULT_CONFIG,
        ...user,

        // Palette: merge if both sides have it
        palette: mergePalette(DEFAULT_CONFIG.palette, user.palette),

        // Breakpoints: shallow merge (user overrides defaults)
        breakpoints: {
          ...DEFAULT_CONFIG.breakpoints,
          ...(user.breakpoints || {}),
        },

        // ✨ Rule 2: semantic overrides shallow merge
        semanticOverrides: {
          ...(DEFAULT_CONFIG.semanticOverrides || {}),
          ...(user.semanticOverrides || {}),
        },
      };
    } catch (e) {
      if (process.env.GARUR_DEBUG) {
        console.error("Failed to load garur.config.js:", e);
      }
    }
  }

  return { ...DEFAULT_CONFIG };
}

// ───────────────────────────────────────────────
// Apply config to native engine
// ───────────────────────────────────────────────

export function applyConfig(cfg: GarurConfig): void {
  // Flatten palette: { blue: { 500: '#...' } } → { 'blue-500': '#...' }
  const flatPalette: Record<string, string> = {};
  const pal = cfg.palette || {};

  for (const [color, shades] of Object.entries(pal)) {
    if (typeof shades === "string") {
      // Direct color: { brand: '#ff0099' }
      flatPalette[color] = shades;
    } else if (shades && typeof shades === "object") {
      // Shaded color: { brand: { 500: '#...', 600: '#...' } }
      for (const [shade, val] of Object.entries(shades)) {
        if (typeof val === "string") {
          flatPalette[`${color}-${shade}`] = val;
        }
      }
    }
  }

  initConfig(
    JSON.stringify({
      breakpoints: cfg.breakpoints,
      darkMode: cfg.darkMode,
      important: cfg.important,
      palette: flatPalette,
      // ✨ Rule 2: Semantic colors (optional)
      semanticColors: cfg.semanticColors ?? false,
      semanticOverrides: cfg.semanticOverrides ?? {},
    })
  );
}

export { DEFAULT_CONFIG };
export default DEFAULT_CONFIG;