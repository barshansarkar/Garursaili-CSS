
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

type PaletteScale = Record<string, string>;
export type Palette = Record<string, PaletteScale>;

const defaultConfig = {
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  },
  darkMode: "class" as "class" | "media",
  darkSelector: ".dark",
  jit: {
    dynamicOnly: true,
    ignore: ["node_modules", "dist", ".git"],
  },
  stats: {
    topN: 25,
  },

  palette: {
    gray: { "50": "#f9fafb", "100": "#f3f4f6", "200": "#e5e7eb", "300": "#d1d5db", "400": "#9ca3af", "500": "#6b7280", "600": "#4b5563", "700": "#374151", "800": "#1f2937", "900": "#111827" },
    red: { "50": "#fff1f2", "100": "#ffe4e6", "200": "#fecdd3", "300": "#fda4af", "400": "#fb7185", "500": "#ef4444", "600": "#dc2626", "700": "#b91c1c", "800": "#991b1b", "900": "#7f1d1d" },
    yellow: { "50": "#fffbeb", "100": "#fef3c7", "200": "#fde68a", "300": "#fcd34d", "400": "#fbbf24", "500": "#f59e0b", "600": "#d97706", "700": "#b45309", "800": "#92400e", "900": "#78350f" },
    green: { "50": "#f0fdf4", "100": "#dcfce7", "200": "#bbf7d0", "300": "#86efac", "400": "#4ade80", "500": "#22c55e", "600": "#16a34a", "700": "#15803d", "800": "#166534", "900": "#14532d" },
    blue: { "50": "#eff6ff", "100": "#dbeafe", "200": "#bfdbfe", "300": "#93c5fd", "400": "#60a5fa", "500": "#3b82f6", "600": "#2563eb", "700": "#1d4ed8", "800": "#1e40af", "900": "#1e3a8a" },
    indigo: { "50": "#eef2ff", "100": "#e0e7ff", "200": "#c7d2fe", "300": "#a5b4fc", "400": "#818cf8", "500": "#6366f1", "600": "#4f46e5", "700": "#4338ca", "800": "#3730a3", "900": "#312e81" },
    purple: { "50": "#faf5ff", "100": "#f3e8ff", "200": "#e9d5ff", "300": "#d8b4fe", "400": "#c084fc", "500": "#a855f7", "600": "#9333ea", "700": "#7e22ce", "800": "#6b21a8", "900": "#581c87" },
    pink: { "50": "#fff1f2", "100": "#ffe4e6", "200": "#fecdd3", "300": "#fda4af", "400": "#fb7185", "500": "#f43f5e", "600": "#e11d48", "700": "#be123c", "800": "#9f1239", "900": "#881337" },
    teal: { "50": "#f0fdfa", "100": "#ccfbf1", "200": "#99f6e4", "300": "#5eead4", "400": "#2dd4bf", "500": "#14b8a6", "600": "#0d9488", "700": "#0f766e", "800": "#115e59", "900": "#134e4a" },
    orange: { "50": "#fff7ed", "100": "#ffedd5", "200": "#fed7aa", "300": "#fdba74", "400": "#fb923c", "500": "#f97316", "600": "#ea580c", "700": "#c2410c", "800": "#9a3412", "900": "#7c2d12" },
  } as Palette,
};

module.exports = {



  theme: {
    colors: {
      brand:        { DEFAULT: "#6366f1", 300: "#a5b4fc", 500: "#6366f1", 600: "#4f46e5" },
      success:      { DEFAULT: "#22c55e", 300: "#86efac", 500: "#22c55e", 600: "#16a34a" },
      danger:       { DEFAULT: "#ef4444", 300: "#fda4af", 500: "#ef4444", 600: "#dc2626" },
      warning:      { DEFAULT: "#f59e0b", 300: "#fcd34d", 500: "#f59e0b", 600: "#d97706" },
      dark:         { DEFAULT: "#1f2937", strong: "#111827" },

      body:         "#374151",      // gray-700
      heading:      "#111827",      // gray-900

      neutral: {
        primary: { soft: "#f3f4f6" },     // gray-100
        secondary: { medium: "#e5e7eb" }, // gray-200
        tertiary: { medium: "#d1d5db", soft: "#f3f4f6" }, // gray-300 / gray-100
      },
      default: { medium: "#6b7280" },     // gray-500
    },
    borderRadius: {
      base: "0.5rem",  // or keep your current value
    },
  },

};

// Deep merge helper (simple)
function deepMerge(target: any, source: any) {
  if (!source) return target;
  for (const k of Object.keys(source)) {
    const sv = source[k];
    const tv = target[k];
    if (Array.isArray(sv)) target[k] = sv.slice();
    else if (sv && typeof sv === "object" && !(sv instanceof RegExp)) {

      target[k] = deepMerge(tv && typeof tv === "object" ? tv : {}, sv);

    } else {

      target[k] = sv;

    }

  }
  return target;
}

// Load optional project-level config: garur.config.js at project root
let userConfig: any = {};
try {
  // require from cwd - project root
  const path = require("path");


  const cfgPath = path.resolve(process.cwd(), "garur.config.js");
  // Node require will throw if not found

  userConfig = require(cfgPath);
  if (userConfig && typeof userConfig === "object") {

    // OK
  } else {

    userConfig = {};
  }

}
catch {
  userConfig = {};
}

export const config = deepMerge(JSON.parse(JSON.stringify(defaultConfig)), userConfig);
export default config;