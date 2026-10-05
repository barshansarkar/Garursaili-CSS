<div align="center">

```
   ██████╗  █████╗ ██████╗ ██╗   ██╗██████╗ 
  ██╔════╝ ██╔══██╗██╔══██╗██║   ██║██╔══██╗
  ██║  ███╗███████║██████╔╝██║   ██║██████╔╝
  ██║   ██║██╔══██║██╔══██╗██║   ██║██╔══██╗
  ╚██████╔╝██║  ██║██║  ██║╚██████╔╝██║  ██║
   ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝
       S A I L I   •   C S S
```
<p align="center">
  <img src="./src/garur.png" width="200" alt="GarurSaili-CSS" />
</p>

**The fastest atomic CSS engine ever built.**  
Native Rust core. Zero compromise. Milliseconds matter.

[![Rust](https://img.shields.io/badge/Rust-1.75+-orange?style=flat-square&logo=rust)](https://www.rust-lang.org/)
[![Node](https://img.shields.io/badge/Node-18+-green?style=flat-square&logo=nodedotjs)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)
[![Made in India](https://img.shields.io/badge/Made%20in-India%20%F0%9F%87%AE%F0%9F%87%B3-orange?style=flat-square)](https://github.com/barshansarkar)

</div>

---

## ⚡ The Numbers

Real benchmarks. Real projects. No marketing fluff.

| Scenario                           | GarurSaili | Typical JS-based engine |
|------------------------------------|------------|-------------------------|
| Cold build (500 classes, 26 files) | **15 ms**  | 400–800 ms              |
| Warm build (fingerprint hit)       | **0.09 ms**| 80–200 ms               |
| Watch mode rebuild (1 file edit)   | **~2 ms**  | 40–150 ms               |
| Per-class parse + emit             | **5 μs**   | 400–900 μs              |
| Memory footprint                   | **~40 MB** | 200–500 MB              |
| Binary size                        | **~1.8 MB**| ~60 MB node_modules     |

**Up to 200× faster.** Not marketing — measured on real projects.

---

## 🎯 What is GarurSaili-CSS?

**GarurSaili-CSS** is a next-generation atomic CSS engine written in **Rust** and distributed as a native Node.js addon. It scans your source files, extracts utility classes, and generates optimized CSS — at speeds that make traditional CSS tooling feel ancient.

The name comes from **Garur (গরুর)** — the mighty divine eagle of Indian mythology, mount of Lord Vishnu, symbol of supersonic speed and unmatched power.

Built by **Barshan Sarkar** — because CSS tooling shouldn't feel like a 2005 build system.

---

## 🌟 Why GarurSaili?

### 🚀 Native Rust Performance

Every part of the pipeline — parsing, extraction, generation, minification — is written in Rust. No JavaScript runtime overhead. No garbage collection pauses. Just raw, deterministic speed.

### ⚡ Fingerprint Cache Architecture

We don't just cache CSS rules — we cache the entire build output keyed by file mtimes and config hash. If nothing changed, the build takes **90 microseconds**. That's faster than opening a browser tab.

### 🧵 Parallel by Default

Powered by `rayon`, `dashmap`, and `arc-swap` — every file scan, every class parse, every rule generation runs across all CPU cores without lock contention. An 8-core machine runs **8× faster**, not 1.2× faster.

### 🎨 Modern CSS, Native

- Container queries (`@container`, named containers, `/name` syntax)
- CSS `@property` — registered variables for animations
- `color-mix()` and modern color spaces (`oklch`, `lab`, `lch`)
- `@layer` — cascade layers support
- `:has()`, `:is()`, `:where()`, `:user-valid` — modern selectors
- Anchor positioning, view transitions, field-sizing
- Safe area (`env(safe-area-inset-*)`) utilities

### 🌙 Dark Mode, Zero Config

Works with `class` strategy or `media` strategy — auto-detected from your markup.

### 📦 Fully Typed, Fully Cached

First-class TypeScript. NAPI-native bindings. Persistent disk cache across processes.

### 🇮🇳 Made in India, Built for the World

Conceived, designed, and engineered in old malda, India. Proudly open source.

---

## 📦 Installation

```bash
npm install garursaili-css
# or
pnpm add garursaili-css
# or
bun add garursaili-css
```

**Prebuilt native binaries for:**

- Linux x64 / arm64
- macOS x64 / Apple Silicon
- Windows x64

No Python. No Visual Studio. No compilation on install.

---

## 🚀 Quick Start

### 1. Initialize

```bash
npx garursaili-css init
```

Creates `garur.config.js`:

```js
export default {
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
  darkMode: "class",
  important: false,
  palette: {
    // Extend or override — full default palette included
    brand: { 500: "#6366f1", 600: "#4f46e5" },
  },
};
```

### 2. Write Markup

```html
<div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl 
            transition-all duration-300
            md:p-12 lg:p-16
            dark:bg-gray-900 dark:text-white">
  <h1 class="text-4xl font-black tracking-tight text-blue-600">
    Hello, Garur.
  </h1>
</div>
```

### 3. Build

```bash
npx garursaili-css build
```

**Output:**

```text
🦅 GarurSaili-CSS v1.1.0

  ✓ Built in 15ms
    dist/garur.css       37.19 KB
    dist/garur.min.css   33.65 KB

  Stats:
    Files scanned:    26
    Unique classes:   599
    Cache hits:       1,198
```

Done. That's your entire workflow.

---

## 🎛️ CLI Reference

### Setup

```bash
garur init [--force]      # Create garur.config.js
garur example             # Create example.html
garur all                 # init + example
```

### Build

```bash
garur                     # Build once (default)
garur [patterns...]       # Custom file patterns
garur -o dist/app.css     # Custom output path
```

### Development

```bash
garur watch               # Real-time rebuild on file change
garur preview --port 3000 # Live preview server with auto-refresh
garur -w                  # Short for watch
```

### Analysis

```bash
garur analyze             # Break down CSS by category
garur stats               # Full CSS statistics
garur benchmark --runs 10 # Performance benchmark
garur doctor              # Diagnostic checks
```

### Cache

```bash
garur cache-stats         # Cumulative cache stats across runs
garur cache-stats --json  # Machine-readable output
garur cache-stats-reset   # Reset counters
```

### Tools

```bash
garur format              # Sort class attributes in markup
garur config show         # View active config
garur config path         # Path to config file
garur clean               # Remove cache + output
garur native              # Check native engine
garur upgrade             # Check for updates
```

### Info

```bash
garur --version, -v
garur --help, -h
```

---

## 🧩 Utility Reference

GarurSaili ships with **5,000+ utilities** covering every modern CSS concern.

### Layout

```html
<div class="flex flex-col items-center justify-between gap-4">
<div class="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-12 gap-6">
<div class="block md:inline-block lg:flex">
<div class="relative absolute fixed sticky static">
```

### Spacing

```html
<div class="p-4 px-6 py-3 pt-2 pr-8 pb-4 pl-6
            m-4 mx-auto my-2 mt-8
            gap-4 gap-x-2 gap-y-6
            space-y-4 space-x-2">
```

Every spacing scale from `0.5` to `128` — plus arbitrary values.

### Sizing

```html
<div class="w-full w-1/2 w-64 w-screen
            h-screen h-12 h-[calc(100vh-4rem)]
            min-w-0 max-w-7xl min-h-full
            size-12 size-96
            aspect-video aspect-square aspect-[4/3]">
```

### Typography

```html
<h1 class="text-4xl font-black tracking-tight leading-tight
           text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
<h2 class="text-2xl font-semibold text-gray-900 dark:text-white
           uppercase underline decoration-wavy decoration-2">
<p class="text-base leading-relaxed tracking-wide
          text-gray-600 dark:text-gray-400">
```

### Colors

Full palette — **22 families × 11 shades** + black/white:

```html
<div class="bg-slate-50 bg-gray-100 bg-zinc-200 bg-neutral-300
            bg-red-400 bg-orange-500 bg-amber-600 bg-yellow-700
            bg-lime-800 bg-green-900 bg-emerald-950
            bg-teal-500 bg-cyan-400 bg-sky-300 bg-blue-600
            bg-indigo-500 bg-violet-600 bg-purple-700
            bg-fuchsia-800 bg-pink-900 bg-rose-500">
```

**Opacity modifiers:**

```html
<div class="bg-red-500/80 bg-blue-600/60 bg-emerald-500/40 text-white/90">
```

**Arbitrary colors:**

```html
<div class="bg-[#ff6b6b] text-[rgb(30,41,59)] border-[oklch(0.7_0.2_30)]">
```

### Variants

```html
<!-- State -->
<button class="hover:bg-blue-700 focus:ring-2 active:scale-95 disabled:opacity-50">

<!-- Responsive -->
<div class="w-full md:w-1/2 lg:w-1/3 xl:w-1/4">

<!-- Dark mode -->
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">

<!-- Group / Peer -->
<a class="group">
  <span class="group-hover:text-blue-600">Hover me</span>
</a>

<input class="peer" type="checkbox">
<label class="peer-checked:font-bold">Toggle</label>

<!-- Pseudo elements -->
<div class="before:content-['*'] before:text-red-500 after:content-['→']">

<!-- Positional -->
<li class="first:bg-blue-50 last:bg-green-50 odd:border-l-4 even:bg-gray-50">
<li class="nth-3:font-bold">

<!-- Container queries -->
<div class="@container">
  <div class="grid grid-cols-1 @sm:grid-cols-2 @md:grid-cols-3 @lg:grid-cols-4">

<!-- Named containers -->
<div class="@container/sidebar">
  <div class="flex-col @lg/sidebar:flex-row">

<!-- Compound -->
<button class="md:hover:focus:ring-4 dark:disabled:opacity-30">
```

### Modern CSS

```html
<!-- Container queries -->
<div class="@container card">...</div>

<!-- Anchor positioning -->
<div class="anchor-name--tooltip">Tooltip anchor</div>
<div class="position-anchor--tooltip position-area-top">

<!-- View transitions -->
<div class="view-transition-hero">

<!-- Color scheme -->
<html class="scheme-dark scheme-light-dark">

<!-- Field sizing -->
<textarea class="field-sizing-content">

<!-- Safe area -->
<div class="pt-safe pb-safe px-safe">
```

### Gradients

```html
<div class="bg-linear-to-r from-blue-500 to-purple-600">
<div class="bg-linear-to-br from-pink-400 via-rose-500 to-red-600">
<div class="bg-radial from-cyan-400 to-blue-600">
<div class="bg-conic-180 from-amber-400 to-orange-600">
```

### Transforms

```html
<div class="rotate-45 -rotate-90 scale-110 scale-x-90
            translate-x-4 -translate-y-2
            skew-x-6 skew-y-3
            transform-3d transform-flat
            perspective-dramatic">
```

### Animations

```html
<div class="animate-spin animate-pulse animate-bounce animate-ping
            animate-wiggle animate-float animate-shake
            animate-fade-in animate-slide-in-top animate-zoom-in">
```

### Filters

```html
<div class="blur-md brightness-110 contrast-125 saturate-150
            grayscale sepia
            backdrop-blur-xl backdrop-brightness-90">
```

### Forms

```html
<input class="w-full px-4 py-3 rounded-lg border border-gray-300
              focus:ring-2 focus:ring-blue-500 focus:border-transparent
              placeholder-gray-400 outline-none transition">
```

### Masks

```html
<div class="mask-t-from-transparent mask-radial mask-cover">
```

### Layout Patterns

```html
<!-- Sticky header -->
<header class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">

<!-- Card hover -->
<div class="p-6 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow">

<!-- Centered hero -->
<section class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">

<!-- Responsive grid -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
```

---

## 🎨 Configuration

### `garur.config.js`

```js
export default {
  // ── Breakpoints ──
  breakpoints: {
    xs: "480px",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
    "3xl": "1920px",
  },

  // ── Dark Mode ──
  // "class" → apply when .dark class on ancestor
  // "media" → apply when prefers-color-scheme: dark
  darkMode: "class",

  // ── !important ──
  important: false,

  // ── Custom Palette ──
  palette: {
    // Simple color
    brand: "#ff0066",

    // Shaded color
    ocean: {
      50: "#f0f9ff",
      100: "#e0f2fe",
      500: "#0ea5e9",
      900: "#0c4a6e",
    },
  },
};
```

### CSS-First Config (`@theme`)

You can also define theme tokens directly in CSS — no JS config required:

```css
@import "garur.css";

@theme {
  --color-brand-50: #fff1f2;
  --color-brand-500: #f43f5e;
  --color-brand-900: #881337;
  --spacing-xxl: 5rem;
  --radius-4xl: 2rem;
  --font-display: "Inter", sans-serif;
}
```

Now use them directly:

```html
<div class="bg-brand-500 p-xxl rounded-4xl font-display">
```

---

## 🔌 Programmatic API

### JavaScript / TypeScript

```ts
import {
  build, buildBatch,
  extractClasses, findFiles,
  runSsc, runSscWithStats,
  initConfig,
  getCacheStats, resetCacheStats,
} from "garursaili-css";

// One-off build
const css = build("bg-red-500 hover:bg-red-600");
// → ".bg-red-500{...}.hover\:bg-red-600:hover{...}"

// Batch
const rules = buildBatch(["p-4", "m-2", "flex"]);

// Extract from content
const classes = extractClasses(`
  <div class="p-4 flex items-center">Hello</div>
`);
// → ["p-4", "flex", "items-center"]

// Full project scan
const files = findFiles(process.cwd(), ["src/**/*.tsx"], ["node_modules/**"]);
const output = runSsc(files, JSON.stringify(config));

// With performance stats
const stats = runSscWithStats(files, JSON.stringify(config));
console.log(stats);
// {
//   css: "...",
//   filesScanned: 26,
//   uniqueClasses: 599,
//   cacheHits: 1198,
//   cacheMisses: 599,
//   buildHitRate: 66.7
// }
```

### Custom Plugins

Register custom utilities from JavaScript:

```ts
import { registerPluginUtility, registerPluginVariant } from "garursaili-css";

// Custom utility
registerPluginUtility(
  "glass",
  "background:rgba(255,255,255,0.1);backdrop-filter:blur(20px)"
);

// Custom variant
registerPluginVariant("hocus", "&:hover, &:focus");
```

Then use in markup:

```html
<div class="glass hocus:ring-2">
```

---

## ⚙️ Build Architecture

```text
┌──────────────────────────────────────────────────────────────┐
│                    GarurSaili-CSS Pipeline                    │
└──────────────────────────────────────────────────────────────┘

   ┌──────────────┐
   │ Source Files │  (.html, .tsx, .vue, .svelte, .jsx, ...)
   └──────┬───────┘
          │
          ▼ mmap + rayon parallel scan
   ┌──────────────────────────────────────┐
   │ File Cache (xxh3 hash keyed)         │  ← unchanged files = zero parse
   └──────┬───────────────────────────────┘
          │
          ▼ regex extraction (compiled once)
   ┌──────────────────────────────────────┐
   │ Class Extraction                     │
   └──────┬───────────────────────────────┘
          │
          ▼ dedupe + sort
   ┌──────────────────────────────────────┐
   │ Utility Resolver                     │
   │ • DashMap<utility> — lock-free       │
   │ • ArcSwap<config, palette, utils>    │
   └──────┬───────────────────────────────┘
          │
          ▼ parallel build (rayon)
   ┌──────────────────────────────────────┐
   │ Rule Generator                       │
   │ • Variant engine                     │
   │ • Container queries                  │
   │ • Arbitrary values                   │
   └──────┬───────────────────────────────┘
          │
          ▼ dedupe by declaration
   ┌──────────────────────────────────────┐
   │ Fingerprint Cache                    │
   │ (skip entire pipeline if same)       │
   └──────┬───────────────────────────────┘
          │
          ▼ optional
   ┌──────────────────────────────────────┐
   │ LightningCSS Finalize                │
   │ • Vendor prefixing                   │
   │ • Modern syntax                      │
   │ • Minification                       │
   └──────┬───────────────────────────────┘
          │
          ▼
   ┌──────────────┐
   │ dist/*.css   │
   └──────────────┘
```

### Speed Guarantees

| Layer         | Technique           | Benefit                           |
|---------------|---------------------|-----------------------------------|
| Cache reads   | DashMap (16 shards) | 8× parallelism without contention |
| Config access | ArcSwap             | Lock-free atomic reads            |
| Cache values  | Arc\<str\>          | Zero-copy clones on hit           |
| Fingerprint   | xxh3 64-bit         | Hash 1 MB in ~10 μs               |
| Parallelism   | rayon work-stealing | Saturates all CPU cores           |
| File I/O      | mmap                | Zero-copy file reads              |

---

## 📊 Cache System

GarurSaili uses **four layers** of caching:

### Layer 1: Parse Cache

Every parsed utility token (`bg-red-500`, `hover:flex`) is cached as `Arc<Token>` — parsed once, reused across the entire project.

### Layer 2: Build Cache

Every generated CSS rule is cached as `Arc<str>`. Repeat class hits cost one atomic increment.

### Layer 3: File Cache

Every source file's extracted class list is cached by content hash (xxh3). Unchanged file = zero regex work.

### Layer 4: Fingerprint Cache

Every full build output is cached by `(files × mtimes × config)`. If nothing changed → entire pipeline skipped.

Persistent disk cache (`.garur-cache.bin`) survives across CLI invocations.

---

## 🌐 Browser Support

Generated CSS is modern-first. LightningCSS handles downleveling based on your targets.

**Default targets:**

```text
> 0.5%
last 2 versions
not dead
```

Override via `garur.config.js`:

```js
export default {
  targets: ["chrome >= 100", "firefox >= 100", "safari >= 15"],
};
```

---

## 🧪 Testing Your Setup

```bash
# Native engine check
garur native

# Full diagnostic
garur doctor

# Performance benchmark
garur benchmark --runs 10

# Cache health
garur cache-stats --json
```

**Example doctor output:**

```text
🩺 GarurSaili Doctor

  ✓ Native engine       loaded (v1.1.0)
  ✓ Config file         garur.config.js
  ✓ Output folder       dist/
  ✓ Node version        v22.21.0
  ✓ Source files        26 file(s) matched
  ✓ CSS output          33.99 KB

  ✓ All checks passed!
```

---

## 🔧 Troubleshooting

### Native module not found

```bash
# Check
garur native

# If "not found" — rebuild from source
cd rust
napi build --platform --release
cp target/release/*.node ../
```

### Slow first build

First build reads all files and warms the cache. Second build is **10–100× faster**. This is expected and normal.

### Stale CSS output

```bash
garur clean
garur build
```

### Classes not being detected

- Ensure your file extensions match the patterns argument
- Check `garur doctor` for source file count
- Verify markup uses `class=`, `className=`, or `data-garur=`

---

## 🏗️ Development

### Prerequisites

- Rust 1.75+
- Node.js 18+
- napi-rs CLI: `npm install -g @napi-rs/cli`

### Build from Source

```bash
git clone https://github.com/barshansarkar/garursaili-css.git
cd garursaili-css/rust
napi build --platform --release
cd ..
cp rust/*.node ./
```

### Project Structure

```text
garursaili-css/
├── rust/                          # Native Rust core
│   ├── src/
│   │   ├── lib.rs                 # NAPI bindings
│   │   ├── engine.rs              # Parse + build + cache
│   │   ├── ssc.rs                 # Build orchestrator
│   │   ├── utilities.rs           # Core utilities
│   │   ├── utilities_extended.rs  # Extended utilities
│   │   ├── utilities_v4.rs        # Modern CSS utilities
│   │   ├── advanced.rs            # 3D, safe-area, masks, etc.
│   │   ├── variants.rs            # Variant engine
│   │   ├── preflight.rs           # CSS reset
│   │   ├── palette_default.rs     # Default color palette
│   │   ├── sanitize.rs            # Injection prevention
│   │   ├── css_input.rs           # @theme + @apply
│   │   ├── plugin.rs              # Plugin registry
│   │   └── browsers.rs            # Target resolution
│   ├── Cargo.toml
│   └── build.rs
├── src/                           # TypeScript CLI + bindings
│   ├── cli.ts
│   ├── native.ts
│   ├── config.ts
│   ├── index.ts
│   └── plugin.ts
├── tests/
├── package.json
└── README.md
```

### Running Tests

```bash
npx tsx tests/bench-cold.mjs
npx tsx tests/bench-real.mjs
```

---

## 💡 Design Philosophy

1. **Speed is a Feature**  
   Every microsecond matters. We choose `DashMap` over `HashMap`, `Arc<str>` over `String`, `xxh3` over SHA. This isn't premature optimization — it's the entire point.

2. **Zero Config by Default**  
   Sensible defaults. Full palette included. Modern breakpoints. Works out of the box.

3. **CSS-Native, Not JS-Native**  
   Theme tokens live in CSS. Custom utilities can be CSS. The build tool is JavaScript-agnostic — use it from Node, Bun, Deno, or directly from Rust.

4. **Correctness Over Cleverness**  
   Sanitization prevents CSS injection. LightningCSS validates every output. Malformed input returns the input unchanged — never broken CSS.

5. **Made with 🇮🇳 Pride**  
   Engineered in India. Named after a legendary Indian eagle. Built to compete globally.

---

## 🤝 Contributing

Contributions welcome! Areas of interest:

- New utilities — modern CSS properties not yet covered
- Variant engine — additional selector patterns
- Performance — profiling-driven optimizations
- Documentation — examples, guides, tutorials
- Native builds — additional platform targets

### Development Workflow

```bash
# Fork + clone
git clone https://github.com/YOUR_USERNAME/garursaili-css.git

# Create branch
git checkout -b feat/amazing-feature

# Make changes + test
cd rust && cargo test
npx tsx tests/bench-real.mjs

# Commit + push
git commit -m "feat: add amazing feature"
git push origin feat/amazing-feature

# Open PR
```

---

## 📜 License

MIT License © 2025 Barshan Sarkar

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files...

---

## 🙏 Acknowledgements

- The Rust community — for `napi-rs`, `rayon`, `dashmap`, and the entire toolchain
- The CSS Working Group — for the specs we implement
- LightningCSS maintainers — for the battle-tested CSS parser and minifier
- The open source ecosystem — for making tools like this possible
- Every developer in India who proves we can build world-class software at home 🇮🇳

---

## 🌟 Star History

If GarurSaili-CSS makes your builds faster, please consider giving it a ⭐ on GitHub. It genuinely helps.

---

## 📞 Contact & Support

- **Issues:** [github.com/barshansarkar/garursaili-css/issues](https://github.com/barshansarkar/garursaili-css/issues)
- **Discussions:** [github.com/barshansarkar/garursaili-css/discussions](https://github.com/barshansarkar/garursaili-css/discussions)
- **Author:** Barshan Sarkar — old malda, India 🇮🇳
- **Email:** [sarkarbarshan4@gmail.com](mailto:sarkarbarshan4@gmail.com)

---

<div align="center">

**Built with 🔥 in old malda, India**

*"Garur doesn't walk. Garur flies."*

```
          /\
         /  \        ⚡
        /____\       ⚡  ⚡
       |  🦅  |     ⚡
       |______|
```

If this project helped you, star it.  
If you built something cool with it, tell us.

<br>

🚀 **Ship faster. Ship smaller. Ship Garur.**

</div>

---

## Changelog

### v1.1.0

- ✨ Fingerprint cache for entire build output
- ✨ File-hash-cached extraction (unchanged files = zero work)
- ✨ Finalize cache for LightningCSS output
- 🐛 Fixed negative numeric utilities (`-z-10`, `-order-5`)
- 🐛 Fixed `@container` nested output
- 🐛 Removed comment leak in preflight
- 🚀 200× faster warm builds

### v1.0.0

- 🎉 Initial public release
- 5,000+ utilities
- Container queries, dark mode, variants
- Native Rust core with NAPI bindings
- CLI with 20+ commands
- Plugin system
- Persistent disk cache

---

## Roadmap

- [ ] `@utility` CSS directive
- [ ] `@variant` and `@custom-variant` CSS directives
- [ ] VSCode extension with IntelliSense
- [ ] Vite / Webpack / Rollup plugins
- [ ] Bun native support
- [ ] Wasm build for browser-only environments
- [ ] Interactive playground at [garursaili.dev](https://garursaili.dev)

---

<div align="center">

[⬆ Back to top](#)

</div>
```
