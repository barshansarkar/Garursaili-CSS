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
 *    • Vite integration for modern web development
 *    • Watch mode for real-time builds
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
import { runJIT } from "../core/ssc.js";
import { loadCache } from "../utils/cache";
// barshan sarkar here,
// i just want to sleep but this code wont let me
import minimist from "minimist";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pc from "picocolors";
let ora = null;
// esm dirname hack because node is stupid sometimes
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// read package.json or die trying
let pkg = { version: "0.0.0" };
try {
    const pkgPath = path.resolve(__dirname, "../package.json");
    if (fs.existsSync(pkgPath)) {
        pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    }
}
catch (e) {
    // fallback to default because everything breaks
}
const banner = pc.cyan(`v${pkg.version}
`);
const tagline = pc.gray("Ultra-fast atomic CSS engine • Built for speed & joy\n");
const AUT = ("INDIAN 1ST CSS FRAMEWORK MADE BY BARSHAN SARKAR\n");
const funMessages = [
    "CSS so fast, it finishes before you type the class.",
    "Atomic CSS delivered hotter than a fresh GPU.",
    "Garur-CSS: Because bloat belongs in 2015.",
    "Blink and you'll miss how fast this compiled.",
    "This CSS is smaller than your ego.",
    "Powered by Vite ⚡ + Garur 🦅 = Lightning fast dev"
];
function debugCache(cache) {
    console.log(pc.bold(pc.cyan("\n=== CACHE DEBUG ===\n")));
    console.log("Files in cache: ", Object.keys(cache.files || {}).length);
    console.log("Classes in cache: ", Object.keys(cache.classes || {}).length);
    const fileClasses = new Set();
    Object.values(cache.files || {}).forEach((fileData) => {
        if (fileData?.classes) {
            fileData.classes.forEach((cls) => fileClasses.add(cls));
        }
    });
    console.log("Classes in files: ", fileClasses.size);
    const orphanedClasses = Object.keys(cache.classes || {}).filter((cls) => !fileClasses.has(cls));
    console.log("Orphaned classes: ", orphanedClasses.length);
    console.log(""); // empty line because why not
}
// ==================== AUTO-CREATION FUNCTIONS ====================
function createConfigFile() {
    const configPath = path.resolve(process.cwd(), "garur.config.js");
    if (fs.existsSync(configPath)) {
        console.log(pc.yellow(` Config already exists at ${configPath}`));
        return false;
    }
    // Use ESM format for better compatibility
    const configContent = `// Garur-CSS Configuration (ESM format)
export default {
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
`;
    fs.writeFileSync(configPath, configContent, "utf-8");
    console.log(pc.green(` Created config file: ${configPath}`));
    return true;
}
function createPluginDemo() {
    const pluginPath = path.resolve(process.cwd(), "garur.plugin.js");
    if (fs.existsSync(pluginPath)) {
        console.log(pc.yellow(` Plugin already exists at ${pluginPath}`));
        return false;
    }
    const pluginContent = `// Garur-CSS Plugin Example
// Add custom utilities, variants, or components
module.exports = {
  // Add custom utilities
  utilities: {
    // Simple utility
    'my-gradient': 'background: linear-gradient(45deg, #3b82f6, #8b5cf6)',
    // Dynamic utility with value
    'my-border-{value}': (value) => \`border: \${value}px solid #3b82f6\`,
    // Complex utility with multiple declarations
    'glass-card': \`
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
\`
  },
  // Add custom variants
  variants: {
    // Add a custom variant 'rtl' for right-to-left support
    rtl: (selector) => \`[dir="rtl"] \${selector}\`,
    // Add a custom variant 'print' for print styles
    print: (selector) => \`@media print { \${selector} }\`,
    // Add a custom breakpoint variant
    'custom-bp': (selector) => \`@media (min-width: 900px) { \${selector} }\`
  },
  // Add custom components
  components: {
    // Button component with variants
    'btn': \`
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 150ms;
\`,
    'btn-primary': \`
      background-color: #3b82f6;
      color: white;
      &:hover { background-color: #2563eb; }
\`,
    'btn-secondary': \`
      background-color: #6b7280;
      color: white;
      &:hover { background-color: #4b5563; }
\`
  },
  // Modify existing utilities
  extend: {
    // Extend spacing scale
    spacing: {
      '128': '32rem',
      '144': '36rem'
    },
    // Extend colors
    colors: {
      'brand': '#ff6b35',
      'accent': '#00d4aa'
    }
  }
};
`;
    fs.writeFileSync(pluginPath, pluginContent, "utf-8");
    console.log(pc.green(` Created plugin demo: ${pluginPath}`));
    return true;
}
function createExampleHTML() {
    const htmlPath = path.resolve(process.cwd(), "example.html");
    if (fs.existsSync(htmlPath)) {
        console.log(pc.yellow(` Example already exists at ${htmlPath}`));
        return false;
    }
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Garur-CSS Example</title>
  <link rel="stylesheet" href="dist/garur.css">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, sans-serif; padding: 2rem; }
  </style>
</head>
<body>
  <div class="container mx-auto">
    <h1 class="text-4xl font-bold text-gray-900 mb-8">
       Garur-CSS Demo
    </h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Card 1 -->
      <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
          <span class="text-white text-2xl">⚡</span>
        </div>
        <h3 class="text-xl font-semibold text-gray-800 mb-2">Ultra Fast</h3>
        <p class="text-gray-600">
          Generates CSS in milliseconds with JIT compilation.
        </p>
        <button class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
          Learn More
        </button>
      </div>
      <!-- Card 2 -->
      <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
          <span class="text-white text-2xl">🦅</span>
        </div>
        <h3 class="text-xl font-semibold text-gray-800 mb-2">Atomic CSS</h3>
        <p class="text-gray-600">
          Only the CSS you actually use. No bloat, no unused styles.
        </p>
        <button class="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
          Get Started
        </button>
      </div>
      <!-- Card 3 -->
      <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
          <span class="text-white text-2xl">🔧</span>
        </div>
        <h3 class="text-xl font-semibold text-gray-800 mb-2">Fully Customizable</h3>
        <p class="text-gray-600">
          Extend with plugins, custom utilities, and your own design system.
        </p>
        <button class="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition">
          Customize
        </button>
      </div>
    </div>
    <!-- Vite Integration Card -->
    <div class="mt-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl p-6 text-white">
      <div class="flex items-center mb-4">
        <span class="text-3xl mr-3">⚡</span>
        <h2 class="text-2xl font-bold">Vite + Garur = Lightning Fast Dev</h2>
      </div>
      <p class="mb-4">
        Use <code class="bg-white/20 px-2 py-1 rounded">garur --vite</code> to setup Vite integration.
        Get instant HMR, hot reload, and optimized builds.
      </p>
      <div class="flex flex-wrap gap-2">
        <span class="px-3 py-1 bg-white/20 rounded-full">Instant HMR</span>
        <span class="px-3 py-1 bg-white/20 rounded-full">Hot CSS Reload</span>
        <span class="px-3 py-1 bg-white/20 rounded-full">Optimized Builds</span>
        <span class="px-3 py-1 bg-white/20 rounded-full">TypeScript Support</span>
      </div>
    </div>
    <!-- Responsive Demo -->
    <div class="mt-8 p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white">
      <h2 class="text-2xl font-bold mb-4">Responsive Design</h2>
      <p class="mb-4">
        This text is <span class="font-bold">large on desktop</span> but
        <span class="font-bold sm:hidden"> hidden on mobile</span>
        <span class="hidden sm:inline"> adjusts on smaller screens</span>.
      </p>
      <div class="flex flex-wrap gap-2">
        <span class="px-3 py-1 bg-white/20 rounded-full">Mobile First</span>
        <span class="px-3 py-1 bg-white/20 rounded-full">Dark Mode</span>
        <span class="px-3 py-1 bg-white/20 rounded-full">Hover States</span>
        <span class="px-3 py-1 bg-white/20 rounded-full">Animations</span>
      </div>
    </div>
    <!-- Quick Start -->
    <div class="mt-8 p-6 bg-gray-50 rounded-xl">
      <h3 class="text-lg font-semibold text-gray-800 mb-3">Quick Start:</h3>
      <pre class="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
<code>npm install garur-css
npx garur init # Create config
npx garur build # Generate CSS
npx garur --vite # Setup Vite integration
npx garur --watch # Watch for changes</code>
      </pre>
    </div>
  </div>
  <footer class="mt-12 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
    <p>Made using Garur-CSS - The Indian CSS Framework</p>
    <p class="mt-1">Run <code class="bg-gray-100 px-2 py-1 rounded">npx garur build</code> to generate CSS from this file!</p>
  </footer>
</body>
</html>`;
    fs.writeFileSync(htmlPath, htmlContent, "utf-8");
    console.log(pc.green(` Created example HTML: ${htmlPath}`));
    return true;
}
// ==================== VITE INTEGRATION FUNCTIONS ====================
function createViteConfig() {
    const viteConfigPath = path.resolve(process.cwd(), "vite.config.ts");
    if (fs.existsSync(viteConfigPath)) {
        console.log(pc.yellow(` Vite config already exists at ${viteConfigPath}`));
        return false;
    }
    const viteConfigContent = `import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
});
`;
    fs.writeFileSync(viteConfigPath, viteConfigContent, "utf-8");
    console.log(pc.green(` Created Vite config: ${viteConfigPath}`));
    // Update package.json with Vite scripts
    const pkgPath = path.resolve(process.cwd(), "package.json");
    if (fs.existsSync(pkgPath)) {
        try {
            const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
            if (!pkg.scripts)
                pkg.scripts = {};
            // Add Vite scripts if they don't exist
            if (!pkg.scripts.dev) {
                pkg.scripts.dev = "vite";
            }
            if (!pkg.scripts.build) {
                pkg.scripts.build = "vite build";
            }
            if (!pkg.scripts.preview) {
                pkg.scripts.preview = "vite preview";
            }
            fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), "utf-8");
            console.log(pc.green(` Added Vite scripts to package.json`));
        }
        catch (e) {
            // Silent fail - package.json might be malformed
        }
    }
    // Create a basic index.html for Vite if it doesn't exist
    const indexPath = path.resolve(process.cwd(), "index.html");
    if (!fs.existsSync(indexPath)) {
        const indexContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Garur + Vite App</title>
  <link rel="stylesheet" href="/dist/garur.css">
</head>
<body>
  <div id="app" class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold text-gray-900 mb-6">
        ⚡ Garur-CSS + Vite
      </h1>
      <p class="text-gray-600 mb-8">
        Your Garur-CSS is now integrated with Vite! Hot reload is enabled.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white p-6 rounded-xl shadow">
          <h2 class="text-xl font-semibold mb-3">Development</h2>
          <p class="text-gray-600 mb-4">Run: <code class="bg-gray-100 px-2 py-1 rounded">npm run dev</code></p>
          <p>Changes to your HTML/JSX will trigger instant CSS regeneration.</p>
        </div>
        <div class="bg-white p-6 rounded-xl shadow">
          <h2 class="text-xl font-semibold mb-3">Production</h2>
          <p class="text-gray-600 mb-4">Run: <code class="bg-gray-100 px-2 py-1 rounded">npm run build</code></p>
          <p>Get optimized, minified CSS for production deployment.</p>
        </div>
      </div>
      <div class="mt-8 p-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl text-white">
        <h3 class="text-lg font-bold mb-2">Try it out!</h3>
        <p class="mb-4">Edit this file and see changes instantly:</p>
        <div class="flex flex-wrap gap-2">
          <span class="px-3 py-1 bg-white/20 rounded-full">text-red-500</span>
          <span class="px-3 py-1 bg-white/20 rounded-full">p-8</span>
          <span class="px-3 py-1 bg-white/20 rounded-full">hover:scale-105</span>
          <span class="px-3 py-1 bg-white/20 rounded-full">md:flex-row</span>
        </div>
      </div>
    </div>
  </div>
  <script type="module">
    // Your app code here
    console.log('Garur + Vite = ');
  </script>
</body>
</html>`;
        fs.writeFileSync(indexPath, indexContent, "utf-8");
        console.log(pc.green(` Created index.html for Vite`));
    }
    return true;
}
// ==================== WATCH MODE FUNCTION ====================// ==================== SIMPLE POLLING WATCH MODE ====================
async function startWatchMode(patterns = []) {
    console.log(pc.cyan("🚀 Garur-CSS Watch Mode Starting..."));
    console.log(pc.gray("Using polling-based watch mode...\n"));
    const watchPatterns = patterns.length ? patterns : [
        "**/*.{html,js,jsx,ts,tsx,vue,svelte}",
        "src/**/*.{html,js,jsx,ts,tsx,vue,svelte}",
        "app/**/*.{html,js,jsx,ts,tsx}",
        "components/**/*.{js,jsx,ts,tsx,vue,svelte}",
        "pages/**/*.{html,js,jsx,ts,tsx}",
        "*.html",
        "index.html"
    ];
    console.log(pc.dim(`Watching: ${watchPatterns.join(", ")}`));
    // Initial build
    try {
        console.log(pc.cyan("⚡ Running initial build..."));
        const stats = await runJIT(watchPatterns);
        console.log(pc.green(`Initial build complete (${stats.buildTimeMs}ms)`));
        console.log(pc.dim(`   ${stats.filesScanned} files, ${stats.uniqueClasses} classes, ${(stats.cssBytes / 1024).toFixed(1)}KB CSS`));
    }
    catch (error) {
        console.error(pc.red("Initial build failed:"), error.message);
    }
    console.log(pc.green("\n Watch mode is now ACTIVE!"));
    console.log(pc.cyan("========================================"));
    console.log(pc.white("Polling for changes every 2 seconds"));
    console.log(pc.dim("Edit and save any file to see CSS rebuild"));
    console.log(pc.cyan("========================================"));
    console.log(pc.gray("\nPress Ctrl+C to stop\n"));
    // Track file timestamps
    const fileTimestamps = new Map();
    let buildCount = 0;
    let isBuilding = false;
    let pendingBuild = false;
    // Function to get all watched files
    const getWatchedFiles = async () => {
        try {
            const { default: glob } = await import("fast-glob");
            return await glob(watchPatterns, {
                ignore: [
                    "**/node_modules/**",
                    "**/dist/**",
                    "**/.git/**",
                    "**/.next/**",
                    "**/.nuxt/**",
                    "**/build/**",
                    "**/coverage/**",
                    "**/*.test.*",
                    "**/*.spec.*"
                ],
                absolute: true,
                cwd: process.cwd()
            });
        }
        catch (error) {
            console.error(pc.red("Error finding files:"), error);
            return [];
        }
    };
    // Function to check for changes
    const checkForChanges = async () => {
        try {
            const files = await getWatchedFiles();
            let hasChanges = false;
            const changedFiles = [];
            for (const file of files) {
                try {
                    const stats = fs.statSync(file);
                    const lastMtime = fileTimestamps.get(file);
                    const currentMtime = stats.mtimeMs;
                    if (!lastMtime) {
                        // First time seeing this file
                        fileTimestamps.set(file, currentMtime);
                    }
                    else if (currentMtime > lastMtime) {
                        // File has changed
                        hasChanges = true;
                        changedFiles.push(path.relative(process.cwd(), file));
                        fileTimestamps.set(file, currentMtime);
                    }
                }
                catch (error) {
                    // File might have been deleted
                    if (fileTimestamps.has(file)) {
                        fileTimestamps.delete(file);
                        hasChanges = true;
                        changedFiles.push(`${path.relative(process.cwd(), file)} (deleted)`);
                    }
                }
            }
            // Clean up timestamps for files that no longer exist
            for (const [file] of fileTimestamps) {
                if (!files.includes(file)) {
                    fileTimestamps.delete(file);
                }
            }
            if (hasChanges && changedFiles.length > 0) {
                console.log(pc.gray(` Detected changes in: ${changedFiles.slice(0, 3).join(", ")}${changedFiles.length > 3 ? "..." : ""}`));
            }
            return hasChanges;
        }
        catch (error) {
            console.error(pc.red("Error checking for changes:"), error);
            return false;
        }
    };
    // Function to run build
    const runBuild = async (reason) => {
        if (isBuilding) {
            pendingBuild = true;
            console.log(pc.yellow("Build in progress, queuing..."));
            return;
        }
        isBuilding = true;
        buildCount++;
        console.log(pc.cyan(`\n Build #${buildCount}: ${reason}...`));
        const startTime = Date.now();
        try {
            const stats = await runJIT(watchPatterns);
            const buildTime = Date.now() - startTime;
            console.log(pc.green(` CSS rebuilt successfully (${buildTime}ms)`));
            console.log(pc.dim(` ${stats.filesScanned} files, ${stats.uniqueClasses} classes, ${(stats.cssBytes / 1024).toFixed(1)}KB`));
            if (stats.topClasses && stats.topClasses.length > 0) {
                const newClasses = stats.topClasses.slice(0, 3).map(c => c.cls).join(", ");
                console.log(pc.dim(`   Latest classes: ${newClasses}`));
            }
        }
        catch (error) {
            console.error(pc.red("❌ Build failed:"), error.message);
        }
        finally {
            isBuilding = false;
            if (pendingBuild) {
                pendingBuild = false;
                console.log(pc.yellow("📦 Processing queued build..."));
                setTimeout(() => runBuild("queued build"), 100);
            }
        }
    };
    console.log(pc.dim("Initializing file watcher..."));
    try {
        const initialFiles = await getWatchedFiles();
        for (const file of initialFiles) {
            try {
                const stats = fs.statSync(file);
                fileTimestamps.set(file, stats.mtimeMs);
            }
            catch {
            }
        }
        console.log(pc.dim(`Tracking ${fileTimestamps.size} files for changes`));
    }
    catch (error) {
        console.error(pc.red("Error initializing watcher:"), error);
    }
    let pollCount = 0;
    const pollInterval = 2000;
    const pollLoop = async () => {
        try {
            pollCount++;
            if (pollCount % 10 === 0) {
                console.log(pc.dim(`\n Still watching... (poll #${pollCount})`));
            }
            const hasChanges = await checkForChanges();
            if (hasChanges) {
                await runBuild("file changes detected");
            }
        }
        catch (error) {
            console.error(pc.red("Polling error:"), error);
        }
        setTimeout(pollLoop, pollInterval);
    };
    const safetyBuild = async () => {
        await runBuild("periodic safety build");
        setTimeout(safetyBuild, 30000);
    };
    pollLoop();
    setTimeout(safetyBuild, 30000);
    // Handle shutdown
    process.on("SIGINT", () => {
        console.log(pc.yellow("\nStopping watch mode..."));
        console.log(pc.green(` Completed ${buildCount} builds`));
        process.exit(0);
    });
    await new Promise(() => { });
}
async function main() {
    console.clear();
    console.log(banner);
    console.log(tagline);
    console.log(AUT);
    const args = minimist(process.argv.slice(2), {
        boolean: ['init', 'example', 'plugin', 'all', 'vite', 'clean', 'watch', 'help', 'version'],
        alias: {
            i: 'init',
            e: 'example',
            p: 'plugin',
            a: 'all',
            v: 'version',
            h: 'help',
            w: 'watch'
        },
        string: ['output']
    });
    if (args.v || args.version) {
        console.log(pc.bold(pc.cyan(`Garur-CSS v${pkg.version}`)));
        console.log(pc.dim(`⚡ With Vite integration & Watch mode`));
        return;
    }
    if (args.h || args.help) {
        console.log(pc.bold(pc.cyan("\nGarur-CSS CLI Commands:\n")));
        console.log(pc.gray(" garur -v, --version        ") + "Show version");
        console.log(pc.gray(" garur -h, --help          ") + "Show this help");
        console.log(pc.gray(" garur --clean             ") + "Clear cache");
        console.log(pc.gray(" garur --init              ") + "Create config file");
        console.log(pc.gray(" garur --plugin            ") + "Create plugin demo");
        console.log(pc.gray(" garur --example           ") + "Create example HTML");
        console.log(pc.gray(" garur --vite              ") + "Setup Vite integration");
        console.log(pc.gray(" garur --all               ") + "Create all starter files");
        console.log(pc.gray(" garur [patterns...]       ") + "Run JIT (default: **/*.{html,ts,js,jsx,tsx})");
        console.log(pc.gray(" garur --output <file>     ") + "Output CSS file (default: dist/garur.css)");
        console.log(pc.gray(" garur --watch [patterns]  ") + "Watch mode for real-time builds\n");
        console.log(pc.yellow(" Examples:"));
        console.log(" garur                          # Build CSS");
        console.log(" garur --init                   # Create config");
        console.log(" garur --vite                   # Setup Vite + Garur");
        console.log(" garur --all                    # Setup everything");
        console.log(" garur --watch                  # Watch all files");
        console.log(" garur src/**/*.tsx --watch     # Watch specific files");
        console.log(" garur --output custom.css      # Output to custom file\n");
        return;
    }
    if (args.vite) {
        console.log(pc.cyan(" Setting up Vite integration...\n"));
        console.log(pc.dim(" This will:"));
        console.log(" • Create vite.config.ts");
        console.log(" • Add Vite scripts to package.json");
        console.log(" • Create index.html (if missing)");
        console.log(" • Show next steps\n");
        let created = 0;
        if (createViteConfig())
            created++;
        if (created > 0) {
            console.log(pc.green(`\n Vite integration setup complete!`));
            console.log(pc.bold(pc.cyan("\nNext steps:\n")));
            console.log(" 1. Install Vite:");
            console.log(pc.gray("    npm install vite --save-dev"));
            console.log(" 2. Install Garur CSS:");
            console.log(pc.gray("    npm install garur-css --save-dev"));
            console.log(" 3. Run Garur in watch mode:");
            console.log(pc.gray("    npx garur --watch"));
            console.log(" 4. Start Vite dev server:");
            console.log(pc.gray("    npm run dev"));
            console.log(" 5. Edit your HTML/JSX files");
            console.log(" 6. Watch CSS update instantly! ⚡\n");
        }
        return;
    }
    if (args.watch || args.w) {
        await startWatchMode(args._);
        return;
    }
    if (args.init || args.i) {
        console.log(pc.cyan(" Setting up Garur-CSS...\n"));
        createConfigFile();
        console.log(pc.dim("\nEdit garur.config.js to customize your setup."));
        return;
    }
    if (args.plugin || args.p) {
        console.log(pc.cyan(" Creating plugin demo...\n"));
        createPluginDemo();
        console.log(pc.dim("\nEdit garur.plugin.js to add custom utilities."));
        return;
    }
    if (args.example || args.e) {
        console.log(pc.cyan(" Creating example HTML...\n"));
        createExampleHTML();
        console.log(pc.dim("\nOpen example.html in browser to see Garur in action."));
        return;
    }
    if (args.all || args.a) {
        console.log(pc.cyan(" Setting up complete Garur-CSS project...\n"));
        let created = 0;
        if (createConfigFile())
            created++;
        if (createPluginDemo())
            created++;
        if (createExampleHTML())
            created++;
        if (created > 0) {
            console.log(pc.green(`\n Created ${created} starter files!`));
            console.log(pc.dim("\nNext steps:"));
            console.log(" 1. Edit garur.config.js to customize");
            console.log(" 2. Run: npx garur build");
            console.log(" 3. Open example.html in browser");
            console.log(pc.dim("\nFor Vite integration, run: npx garur --vite"));
        }
        return;
    }
    if (args.clean) {
        console.log(pc.yellow("Cleaning cache..."));
        const cacheFiles = [
            path.resolve(process.cwd(), "dist/.garur-cache.json"),
            path.resolve(process.cwd(), ".garur-cache.json"),
        ];
        let deleted = 0;
        for (const file of cacheFiles) {
            if (fs.existsSync(file)) {
                fs.unlinkSync(file);
                console.log(pc.dim(` Deleted: ${file}`));
                deleted++;
            }
        }
        if (deleted === 0) {
            console.log(pc.gray(" No cache files found."));
        }
        else {
            console.log(pc.green(`\nCache cleaned! ${deleted} file(s) removed.\n`));
        }
        return;
    }
    let patterns = args._.length
        ? args._
        : [
            "**/*.{html,htm,js,jsx,ts,tsx,vue,svelte,astro,php}",
            "!node_modules/**",
            "!dist/**",
            "!.*/**"
        ];
    patterns = patterns.map((p) => path.isAbsolute(p) ? p : path.resolve(process.cwd(), p));
    const outputFile = args.output || args.o || path.resolve(process.cwd(), "dist/garur.css");
    const defaultOutput = path.resolve(process.cwd(), "dist/garur.css");
    console.log(pc.dim(`Scanning patterns: ${patterns.join(", ")}`));
    console.log(pc.dim(`Output file: ${outputFile}\n`));
    const before = loadCache();
    debugCache(before);
    if (!ora) {
        const oraPkg = require("ora");
        ora = typeof oraPkg === "function" ? oraPkg : oraPkg.default;
    }
    const spinner = ora({
        text: "Running Garur-CSS JIT engine...",
        spinner: "dots12",
        color: "cyan",
    }).start();
    let stats;
    try {
        stats = await runJIT(patterns);
    }
    catch (err) {
        spinner.fail(pc.red("JIT failed!"));
        console.error(pc.red("\n" +
            (err && typeof err === "object" && "message" in err
                ? err.message
                : String(err))));
        process.exit(1);
    }
    const after = loadCache();
    debugCache(after);
    if (!fs.existsSync(path.dirname(outputFile))) {
        fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    }
    if (fs.existsSync(defaultOutput)) {
        if (outputFile !== defaultOutput) {
            fs.copyFileSync(defaultOutput, outputFile);
        }
    }
    else {
        spinner.warn(pc.yellow("Default CSS not found — nothing generated?"));
    }
    spinner.succeed(pc.green("Generated CSS"));
    console.log(pc.bold(pc.cyan("\n=== Garur-CSS JIT Report ===\n")));
    const format = (n) => n.toLocaleString();
    console.log(`${pc.cyan("Files scanned")} ${format(stats.filesScanned)}`);
    console.log(`${pc.yellow("Class occurrences")} ${format(stats.classOccurrences)}`);
    console.log(`${pc.green("Unique classes")} ${format(stats.uniqueClasses)}`);
    console.log(`${pc.blue("Utilities generated")} ${format(stats.uniqueUtilities)}`);
    console.log(`${pc.magenta("CSS size")} ${pc.bold((stats.cssBytes / 1024).toFixed(2) + " KB")}`);
    if (stats.cssBytes < 10000) {
        console.log(pc.green("\nUnder 10KB — Lightning fast & production-ready!"));
    }
    else if (stats.cssBytes < 50000) {
        console.log(pc.cyan("\nSolid size. You're doing great!"));
    }
    console.log(pc.magenta(`\nOutput written to → ${pc.bold(path.relative(process.cwd(), outputFile))}`));
    console.log(pc.dim("\n Tip: Run ") + pc.cyan("garur --watch") + pc.dim(" to automatically rebuild on file changes!"));
    const randomFun = funMessages[Math.floor(Math.random() * funMessages.length)];
    console.log(pc.dim(`\n${randomFun}\n`));
}
main().catch((err) => {
    console.error(pc.red("\nUnexpected error:"), err);
    process.exit(1);
});
