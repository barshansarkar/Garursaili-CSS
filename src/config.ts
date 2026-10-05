// GarurSaili-CSS — Config loader

import path from "node:path";
import fs from "node:fs";
import { createRequire } from "node:module";
import { initConfig } from "./native";

const requireCjs = createRequire(import.meta.url);

export interface GarurConfig {
  breakpoints?: Record<string, string>;
  palette?: Record<string, any>;
  darkMode?: "class" | "media";
  important?: boolean;
  [key: string]: any;
}

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
 
};

/**
 * Deep merge: user palette shades merge with default shades.
 * e.g. user has { blue: { 500: '#0000ff' } } → keeps all other blue shades from default.
 */
function mergePalette(
  defaultPal: Record<string, any>,
  userPal: Record<string, any> | undefined
): Record<string, any> {
  if (!userPal) return { ...defaultPal };
  const out: Record<string, any> = { ...defaultPal };
  for (const [color, shades] of Object.entries(userPal)) {
    if (
      shades &&
      typeof shades === "object" &&
      !Array.isArray(shades) &&
      defaultPal[color] &&
      typeof defaultPal[color] === "object"
    ) {
      // Merge shades
      out[color] = { ...defaultPal[color], ...shades };
    } else {
      out[color] = shades;
    }
  }
  return out;
}

export function loadConfig(): GarurConfig {
  const p = path.resolve(process.cwd(), "garur.config.js");
  if (fs.existsSync(p)) {
    try {
      const mod = requireCjs(p);
      const user = (mod.default || mod) as GarurConfig;
      return {
        ...DEFAULT_CONFIG,
        ...user,
        palette: mergePalette(DEFAULT_CONFIG.palette!, user.palette),
        breakpoints: {
          ...DEFAULT_CONFIG.breakpoints,
          ...(user.breakpoints || {}),
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

export function applyConfig(cfg: GarurConfig): void {
  const flatPalette: Record<string, string> = {};
  const pal = cfg.palette || {};
  for (const [color, shades] of Object.entries(pal)) {
    if (typeof shades === "string") {
      flatPalette[color] = shades;
    } else if (shades && typeof shades === "object") {
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
    })
  );
}

export default DEFAULT_CONFIG;