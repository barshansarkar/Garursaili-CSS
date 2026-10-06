// garur.config.js
export default {
  // Breakpoints (optional — Rust has defaults)
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  darkMode: 'class',
  important: false,

  // ✨ Rule 2: Semantic colors
  semanticColors: true,
  semanticOverrides: {
    primary: '#ff0099',   // your brand
    success: '#10b981',
    danger:  '#ef4444',
  },

  // Optional: additional palette colors (merged with Rust's 343)
  palette: {
    brand: {
      50:  '#fff0f6',
      500: '#ff0099',
      900: '#66003d',
    },
  },
};