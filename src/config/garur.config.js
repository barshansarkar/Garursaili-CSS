module.exports = {
  // Breakpoints (responsive design)
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },
  // Color palette (Tailwind-like colors)
  palette: {
    // Primary colors
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a'
    },
    // Gray scale
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827'
    },
    // Semantic colors
    red: {
      500: '#ef4444',
      600: '#dc2626'
    },
    green: {
      500: '#10b981',
      600: '#059669'
    },
    yellow: {
      500: '#f59e0b',
      600: '#d97706'
    }

  },
  // Dark mode (media or class)
  darkMode: 'media', // or 'class'
  // JIT settings
  jit: {
    // Files to ignore during scanning
    ignore: [
      'node_modules/**',
      'dist/**',
      '.git/**',
      '**/.next/**',
      '**/.nuxt/**',
      '**/build/**',
      '**/coverage/**',
      '**/*.test.*',
      '**/*.spec.*'
    ],
    // Maximum files to scan (0 = unlimited)
    maxFiles: 0,
    // File size limit in bytes (files larger than this will be skipped)
    maxFileSize: 500 * 1024 // 500KB
  },
  // Component definitions (if you have a components system)
  components: {},
  // Custom utilities (add your own)
  utilities: {
    // Example: 'my-utility': 'color: red'
  }
};