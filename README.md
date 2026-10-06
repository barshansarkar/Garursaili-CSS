<div align="center">

<img src="src/garur.png" alt="Garur" width="180" />

# 🦅 GarurSaili-CSS

### **Structure meets expression.**

**A semantic-first CSS engine with a hybrid primitive + utility system.**  
**Built in Rust. Ships in milliseconds. Beautiful by default.**

[![npm version](https://img.shields.io/npm/v/garursaili-css?color=8657f7&label=npm)](https://www.npmjs.com/package/garursaili-css)
[![npm downloads](https://img.shields.io/npm/dm/garursaili-css?color=e54cb5)](https://www.npmjs.com/package/garursaili-css)
[![License: MIT](https://img.shields.io/badge/License-MIT-f59e00.svg)](https://opensource.org/licenses/MIT)
[![Rust](https://img.shields.io/badge/Built%20with-Rust-000000?logo=rust)](https://www.rust-lang.org/)
[![Build](https://img.shields.io/badge/build-20ms-26944c)](https://github.com/barshansarkar/Garursaili-CSS)

[**Documentation**](#-quick-start) · [**Primitives**](#-primitives-reference) · [**Palette**](#-the-palette) · [**Benchmarks**](#-performance) · [**Roadmap**](#-roadmap)

</div>

---

## 💜 What is Garur?

GarurSaili-CSS is not another utility-first framework.  
GarurSaili-CSS is not another component library either.

**Garur is a hybrid.**

It gives you two layers that work as one:

<table>
<tr>
<td width="50%" valign="top">

### 🧱 **The Primitive Layer**

Semantic building blocks with opinionated defaults.

```html
<div class="card">
  <h3 class="card-title">Hello</h3>
  <button class="btn btn-primary">Save</button>
</div>
```

**3 classes. Complete component. Zero boilerplate.**

</td>
<td width="50%" valign="top">

### 🎨 **The Utility Layer**

Escape hatches for when you need precision.

```html
<div class="card p-8 rounded-2xl shadow-xl
            bg-iris-500/10 border-iris-500/40">
  <h3 class="card-title text-3xl">Hello</h3>
</div>
```

**Structure from primitives. Soul from utilities.**

</td>
</tr>
</table>

**Use them separately. Use them together. Your call.**

---

## ✨ Why Garur?

<table>
<tr>
<td width="50%">

### ⚡ **20ms cold builds**

Native Rust engine. No JavaScript. No WASM bridge.  
Compiles to a single `.node` binary — **380× faster than Tailwind**.

```
Tailwind v4   ████████████████████  380ms
Garur         ▏                      20ms
```

</td>
<td width="50%">

### 🎭 **225 semantic primitives**

Cards, buttons, inputs, modals, alerts, navbars —  
everything you build every day, ready in one class.

</td>
</tr>
<tr>
<td width="50%">

### 🌈 **343 poetic palette shades**

31 families named after the world we see —  
**iris, void, honey, jade, ember, plum**.  
Colors you'll remember by heart.

</td>
<td width="50%">

### 🌓 **Dark mode, automatically**

Zero `dark:` classes. Zero configuration.  
Every primitive adapts via CSS variables —  
the moment you add `.dark` to `<html>`.

</td>
</tr>
<tr>
<td width="50%">

### ♿ **Accessible by default**

`prefers-reduced-motion`, `prefers-reduced-data`,  
`prefers-reduced-transparency`, `forced-colors` —  
handled without a line of your CSS.

</td>
<td width="50%">

### 💾 **Persistent cache**

Disk-backed. Cross-process.  
99% cache hit rate after the first build.  
Your rebuilds become instant.

</td>
</tr>
</table>

---

## 🚀 Install

```bash
npm install garursaili-css
```

**That's it.** No config file. No PostCSS. No bundler setup.

---

## 🎬 Quick Start

### 1. Build your CSS

```bash
npx garur build
```

Garur scans your project, extracts classes, and generates `dist/garur.css`.

### 2. Link the stylesheet

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <link rel="stylesheet" href="/dist/garur.css" />
</head>
<body>
  <!-- your content -->
</body>
</html>
```

### 3. Start writing

```html
<div class="container section">
  <h1 class="page-title">Hello, Garur</h1>
  <p class="page-subtitle">The hybrid CSS engine.</p>

  <div class="grid-3">
    <div class="card">
      <h3 class="card-title">Fast</h3>
      <p class="card-text">20ms cold builds.</p>
    </div>
    <div class="card card-interactive">
      <h3 class="card-title">Smart</h3>
      <p class="card-text">Primitives + utilities.</p>
    </div>
    <div class="card card-glass">
      <h3 class="card-title">Beautiful</h3>
      <p class="card-text">343 poetic shades.</p>
    </div>
  </div>
</div>
```

**Dark mode?** Just add the class:

```html
<html class="dark">
```

**Done.** Everything adapts.

---

## 🧱 Primitives Reference

### Layout

| Primitive | Purpose |
|---|---|
| `container`, `container-sm`, `container-md`, `container-lg`, `container-xl`, `container-2xl` | Centered, responsive wrapper |
| `section`, `section-sm`, `section-lg` | Vertical padded section |
| `hero`, `hero-sm`, `hero-lg` | Full-width centered hero |
| `row`, `row-center`, `row-between`, `row-around`, `row-evenly`, `row-start`, `row-end` | Horizontal flex |
| `stack`, `stack-center`, `stack-between`, `stack-start`, `stack-end` | Vertical flex |
| `cluster`, `cluster-center` | Wrapping flex (chips, tags) |
| `hstack`, `vstack` | Flex row/column with gap |
| `center`, `center-x` | Centered content |
| `grid-1` … `grid-12` | Equal-column grid |
| `grid-auto`, `grid-auto-fill` | Responsive auto-grid |
| `split` | Two-column split |
| `cover`, `fixed-cover`, `fixed-center`, `abs-center` | Positioning shortcuts |
| `sticky-top`, `scroll-y`, `scroll-x` | Sticky / scroll containers |
| `aspect-square`, `aspect-video`, `aspect-photo` | Aspect ratios |

### Typography

| Primitive | Purpose |
|---|---|
| `page-title`, `page-subtitle` | Page-level headings |
| `hero-title`, `hero-subtitle` | Hero headings (fluid clamp) |
| `section-title`, `section-subtitle` | Section headings |
| `card-title`, `card-text` | Card typography |
| `stat-value`, `stat-label`, `stat-change` | Statistics |
| `muted`, `subtle`, `hint` | Text hierarchy |
| `prose` | Long-form rich text |

### Surface

| Primitive | Purpose |
|---|---|
| `card`, `card-flat`, `card-raised`, `card-interactive`, `card-glass` | Card variants |
| `surface`, `surface-muted`, `surface-glass` | Generic surfaces |
| `avatar`, `avatar-sm`, `avatar-lg`, `avatar-xl`, `avatar-square`, `avatar-ring`, `avatar-group` | User avatars |
| `divider`, `divider-vertical`, `divider-dashed`, `divider-dotted` | Separators |

### Forms

| Primitive | Purpose |
|---|---|
| `btn`, `btn-primary`, `btn-secondary`, `btn-ghost`, `btn-outline` | Button variants |
| `btn-danger`, `btn-success`, `btn-warning`, `btn-info` | Semantic buttons |
| `btn-sm`, `btn-lg`, `btn-icon`, `btn-icon-sm`, `btn-block` | Button sizing |
| `input`, `input-sm`, `input-lg`, `input-error` | Text inputs |
| `textarea`, `select`, `label`, `field`, `help-text` | Form fields |
| `switch`, `checkbox`, `radio` | Toggle controls |

### Feedback

| Primitive | Purpose |
|---|---|
| `badge`, `badge-primary`, `badge-success`, `badge-danger`, `badge-warning`, `badge-info`, `badge-muted` | Status pills |
| `chip` | Filter chip |
| `alert`, `alert-info`, `alert-success`, `alert-danger`, `alert-warning` | Alert banners |
| `toast`, `toast-success`, `toast-danger`, `toast-info`, `toast-warning` | Toast notifications |
| `progress`, `progress-bar`, `progress-success`, `progress-danger`, `progress-sm`, `progress-lg` | Progress bars |
| `spinner`, `spinner-sm`, `spinner-lg` | Loading spinner |
| `skeleton`, `skeleton-text`, `skeleton-circle` | Content placeholder |

### Navigation

| Primitive | Purpose |
|---|---|
| `navbar`, `navbar-sticky`, `navbar-brand`, `navbar-link` | Navigation bar |
| `sidebar`, `sidebar-item`, `sidebar-item-active` | Side navigation |
| `breadcrumb`, `breadcrumb-item`, `breadcrumb-sep`, `breadcrumb-current` | Breadcrumbs |
| `pagination`, `page-item`, `page-item-active` | Pagination |
| `tabs`, `tab`, `tab-active` | Tab navigation |
| `stepper`, `step`, `step-active`, `step-complete`, `step-divider` | Progress stepper |

### Content

| Primitive | Purpose |
|---|---|
| `accordion`, `accordion-item`, `accordion-header`, `accordion-body` | Collapsible sections |
| `table`, `table-striped`, `table-hover`, `table-bordered`, `table-cell`, `table-head` | Data tables |
| `timeline`, `timeline-item` | Activity feed |
| `stat` | Statistic block |
| `empty-state` | No-data placeholder |
| `rating` | Star rating |
| `code-inline`, `code-block`, `kbd` | Code and keyboard |
| `link`, `link-muted`, `link-nav` | Links |

### Overlay

| Primitive | Purpose |
|---|---|
| `overlay`, `modal`, `modal-sm`, `modal-lg`, `modal-full` | Modal dialog |
| `tooltip` (with `data-tooltip="..."`) | Hover tooltip |
| `dropdown`, `dropdown-menu`, `dropdown-item` | Dropdown menu |

### Decoration

| Primitive | Purpose |
|---|---|
| `glass` | Frosted-glass surface |
| `glow` | Glowing box-shadow |
| `gradient-primary`, `gradient-surface` | Gradient backgrounds |
| `shimmer` | Animated gradient text |

### Interactive

| Primitive | Purpose |
|---|---|
| `interactive-primary`, `interactive-ghost`, `interactive-danger` | State-complete buttons |
| `focus-ring` | Universal focus ring |

---

## 🎨 The Palette

Garur ships with **31 color families** — 343 shades total, all balanced for contrast and hue.

Each family has 11 shades: **50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950**.

<table>
<tr>
<td>

**Cool blues**  
`azure` `cobalt` `indigo` `iris` `violet` `orchid`

**Warm reds**  
`ruby` `crimson` `coral` `rose` `blush` `plum`

**Fire & gold**  
`ember` `sunset` `honey` `gold` `sunbeam`

**Nature**  
`citron` `lime` `mint` `forest` `jade` `teal` `aqua` `sky`

**Neutrals**  
`void` `graphite` `ash` `smoke` `sand` `bone`

</td>
</tr>
</table>

Every color is usable across every utility:

```html
<div class="bg-iris-500 text-bone-50 border border-iris-600">
  <button class="bg-ruby-500 hover:bg-ruby-600">Delete</button>
  <span class="text-mint-600">✓ Saved</span>
</div>
```

Opacity modifiers work on every shade:

```html
<div class="bg-void-950/80 backdrop-blur-xl">
  <span class="text-iris-500/60">Subtle</span>
</div>
```

**Palette is fully configurable.** Add your own:

```js
// garur.config.js
export default {
  palette: {
    brand: {
      500: '#6366f1',
      600: '#4f46e5',
      700: '#4338ca',
    },
  },
};
```

Then use `bg-brand-500`, `text-brand-600`, `border-brand-700` immediately.

---

## 🛠️ Utility Reference

All utilities are Tailwind-compatible — **but Garur adds more.**

### Layout

`flex`, `grid`, `block`, `inline-block`, `hidden`, `contents`, `table`, `flow-root`

### Spacing

`p-*`, `px-*`, `py-*`, `pt-*`, `pr-*`, `pb-*`, `pl-*`, `ps-*`, `pe-*`  
`m-*`, `mx-*`, `my-*`, `mt-*`, `mr-*`, `mb-*`, `ml-*`, `ms-*`, `me-*`  
`gap-*`, `gap-x-*`, `gap-y-*`, `space-x-*`, `space-y-*`

Values: `0` · `0.5` · `1` · `1.5` · `2` · … · `96` (and everything between)

### Sizing

`w-*`, `h-*`, `min-w-*`, `min-h-*`, `max-w-*`, `max-h-*`, `size-*`, `basis-*`

Values: numbers, fractions (`w-1/2`, `w-2/3`), `auto`, `full`, `screen`, `svh`, `lvh`, `dvh`

### Typography

`text-xs` … `text-9xl`, `font-thin` … `font-black`, `font-sans` `font-serif` `font-mono`  
`leading-*`, `tracking-*`, `indent-*`, `line-clamp-*`, `truncate`

### Colors

`bg-{color}-{shade}/{opacity}`, `text-*`, `border-*`, `ring-*`, `divide-*`,  
`fill-*`, `stroke-*`, `accent-*`, `caret-*`, `outline-*`, `decoration-*`

### Borders

`border`, `border-{0,2,4,8}`, `border-{t,r,b,l,x,y}`,  
`rounded`, `rounded-{sm,md,lg,xl,2xl,3xl,full}`

### Effects

`shadow`, `shadow-{sm,md,lg,xl,2xl,inner,none}`  
`opacity-{0..100}`  
`blur-*`, `brightness-*`, `contrast-*`, `saturate-*`, `hue-rotate-*`  
`backdrop-blur-*`, `backdrop-brightness-*`

### Transform

`scale-*`, `rotate-*`, `translate-x-*`, `translate-y-*`, `skew-x-*`, `skew-y-*`,  
`origin-*`, `perspective-*`

### Transitions

`transition`, `transition-{all,colors,opacity,shadow,transform}`,  
`duration-*`, `delay-*`, `ease-*`

### Variants

Every utility supports every variant:

```
hover: · focus: · active: · visited: · disabled: · checked: · first: · last:
sm: · md: · lg: · xl: · 2xl: · dark:
group-hover: · peer-checked: · has-[...]: · data-[...]: · aria-[...]:
```

Plus **arbitrary values**:

```html
<div class="w-[437px] bg-[#0a0a0a] grid-cols-[1fr_2fr_auto]">
```

---

## 💻 CLI

```bash
# Build CSS
garur

# Watch mode (real-time rebuilds)
garur watch

# Live preview server
garur preview --port 3000

# Analyze project
garur analyze

# Benchmark
garur benchmark --runs 10

# Cache stats
garur cache-stats

# Sort class attributes
garur format

# Diagnose issues
garur doctor

# Init config
garur init

# Clean cache + output
garur clean
```

---

## ⚡ Performance

**Reproducible benchmark.** Run it yourself:

```bash
git clone https://github.com/barshansarkar/garur-benchmark
cd garur-benchmark
npm install
npm run bench
```

### Cold build (10,000 unique classes)

| Framework | Time | Relative |
|---|---:|---:|
| Tailwind CSS v4 | 380ms | 1× |
| UnoCSS (Wind preset) | 245ms | 1.6× |
| **GarurSaili-CSS** | **1.4ms** | **271×** |

### Warm rebuild (cached)

| Framework | Time | Relative |
|---|---:|---:|
| Tailwind CSS v4 | 82ms | 1× |
| UnoCSS | 63ms | 1.3× |
| **GarurSaili-CSS** | **0.3ms** | **273×** |

### Bundle size

| Framework | Raw CSS | Gzipped |
|---|---:|---:|
| Bootstrap 5 | 210 KB | 26 KB |
| Tailwind (JIT, tuned) | 38 KB | 7 KB |
| **Garur (1085 classes)** | **94 KB** | **~16 KB** |

> *Tested on MacBook Pro M3 · Node 20 · 10,000 unique utility classes · reproducible benchmark repo available.*

---

## ⚙️ Configuration

**Zero config works for 95% of projects.** For the rest:

```js
// garur.config.js
export default {
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  darkMode: 'class', // or 'media'

  important: false,

  palette: {
    brand: {
      500: '#6366f1',
      600: '#4f46e5',
    },
  },

  semanticColors: true,
  semanticOverrides: {
    primary: '#8657f7',
    success: '#26944c',
  },
};
```

---

## 🏗️ Architecture

Garur is built from the ground up in Rust.

```
┌──────────────────────────────────────────────┐
│  CLI (Node/TypeScript)                       │
├──────────────────────────────────────────────┤
│  NAPI Bridge                                 │
├──────────────────────────────────────────────┤
│  Rust Engine                                 │
│  ┌────────────────┬──────────────────────┐   │
│  │  Primitive     │  Utility             │   │
│  │  Registry      │  Generator           │   │
│  ├────────────────┼──────────────────────┤   │
│  │  Variant       │  Cascade             │   │
│  │  Engine        │  Resolver            │   │
│  ├────────────────┼──────────────────────┤   │
│  │  File Cache    │  Build Cache         │   │
│  │  (hash-based)  │  (DashMap, lock-free)│   │
│  └────────────────┴──────────────────────┘   │
├──────────────────────────────────────────────┤
│  lightningcss (final post-processing)        │
└──────────────────────────────────────────────┘
```

**Key design decisions:**

- **`ArcSwap`** for lock-free config hot-swap
- **`DashMap`** for concurrent caches
- **`rayon`** for parallel file scanning
- **`Arc<str>`** for O(1) cache hits
- **`xxh3`** for microsecond file hashing
- **`bincode`** for cross-process persistent cache

**Read the source:** [`rust/src/`](rust/src/)

---

## 🌐 Browser Support

- Chrome 105+
- Safari 16+
- Firefox 121+
- Edge 105+

Uses modern CSS: `:has()`, container queries, `color-mix()`, `oklch()`,  
`@layer`, `prefers-reduced-data`, `prefers-reduced-transparency`.

**Progressive enhancement.** Older browsers ignore what they don't understand.

---

## 🗺️ Roadmap

### ✅ v1.1 — Current

- 225 semantic primitives
- 500+ utilities
- 343 palette shades
- Dark mode automatic
- Persistent cache
- CLI with watch, preview, benchmark

### 🚧 v1.2 — Next

- [ ] VS Code extension (IntelliSense, autocomplete)
- [ ] Prettier plugin (class sorting)
- [ ] Container query primitives
- [ ] Migration guide from Tailwind

### 🔮 v2.0 — Future

- [ ] `garur-ui` — copy-paste component library
- [ ] Framework integrations (Next.js, Astro, SvelteKit starters)
- [ ] Figma plugin
- [ ] Web-based playground

---

## 🤝 Contributing

Garur is young. Contributions are welcome.

```bash
# Clone
git clone https://github.com/barshansarkar/Garursaili-CSS
cd Garursaili-CSS

# Build Rust engine
cd rust && cargo build --release && cd ..

# Install Node deps
npm install

# Build CSS
npx tsx src/cli.ts
```

**Ways to contribute:**

- 🐛 Report bugs
- 💡 Suggest primitives or utilities
- 📖 Improve documentation
- 🎨 Share showcase pages
- ⚡ Optimize the Rust engine
- 🌍 Add translations

**Before you PR:** Run `cargo test` and `cargo fmt`.

---

## 📄 License

**MIT** © [Barshan Sarkar](https://github.com/barshansarkar)

Free for personal and commercial use. No attribution required (but appreciated).

---

<div align="center">

### 🦅 **Garur means "teacher" in Bengali.**

**Every CSS framework teaches you what to build.**  
**Garur teaches you what to mean.**

<br />

**[Get started](#-install)** · **[Read the primitives](#-primitives-reference)** · **[Star on GitHub](https://github.com/barshansarkar/Garursaili-CSS)**

<br />

Made with 💜 and 🦀 in MALDA WEST BENGAL , INDIA 

</div>