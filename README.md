GARURSAILI-CSS 
# 🦅 GarurSaili-CSS

<p align="center">
  <img src="./src/garur.png" />
  <img src="https://img.shields.io/npm/v/garursaili-css?color=blue&logo=npm" />
  <img src="https://img.shields.io/github/license/barshansarkar/Garursaili-CSS?logo=github" />
  <img src="https://img.shields.io/github/stars/barshansarkar/Garursaili-CSS?style=social" />
</p>

<p align="center">
<b>GarurSaili-CSS</b> is a next‑generation, ultra‑fast, SSC(_SUPER SONIC CYCLONE_)‑powered utility‑first CSS framework with a dynamic build engine, engineered for extreme performance, flexibility, and developer control.
</p>

---

##  Why GarurSaili-CSS?

> **Garur** means *Eagle* — speed, power, and precision.

GarurSaili‑CSS is built to:

* ⚡ Compile styles in **under 100ms**
* 🧠 Generate CSS **only when used** (true JIT)
* 🧩 Offer **component‑aware utilities**
* 🔌 Support plugins, themes, and future Rust acceleration
* 🛠 Give developers **full control** over CSS generation

---

## 📦 Installation
```bash
npm init -y
```

```bash
npm install garursaili-css
```

Or globally for CLI usage:

```bash
npm install -g garursaili-css
```

---

## 🖥 CLI Usage

```bash
garur init
garur build
garur watch

```
or 
```bash
npx garur -h
npx garur
```

The CLI is built for **zero‑config productivity** while remaining deeply customizable.

---

## Garur Dynamic Engine:

GarurSaili‑CSS is not a static CSS framework. It is a **dynamic CSS compiler engine**.

### 🔥 Dynamic JIT Compilation

* Scans your project files in real time
* Detects only the classes you actually use
* Instantly generates optimized CSS
* Removes unused utilities automatically

Unlike traditional frameworks:

| Feature         |   GarurSaili‑CSS  |
| --------------- | ---------------   |
| Build Type      |  Dynamic JIT      |
| Unused CSS      |    No             |
| Speed           |  Ultra Fast       |
| Runtime Control |  Full             |

---

### 🧬 Internal Pipeline

```text
Source Files
   ↓
Lexer → Parser → Variant Engine → Builder
   ↓
Optimized CSS Output
```

Each stage is modular and hackable.

---

###  Smart Class Intelligence

Garur understands:

* Variants (`hover:`, `focus:`)
* Responsive rules (`sm:`, `md:`)
* Custom tokens
* Theme variables

All processed dynamically — **no pre‑generation**.

---

## 🎨 Components System

Garur includes a rich component layer:

* Buttons
* Cards
* Navbar
* Modal
* Tooltip
* Toast
* Skeletons
* Pricing Cards
more...


---

##  Theming

```ts
export default {
  colors: {
    primary: '#2563eb',
    accent: '#22c55e'
  }
}
```

Themes are dynamic, hot‑reloadable, and future‑proof.

---

## ⚙️ Configuration

```ts
export default {
  content: ['./src/**/*.{html,js,ts}'],
  theme: {},
  plugins: []
}
```

Simple on the surface, powerful underneath.

---

## 🧩 Plugin System

Garur supports a plugin API:

```ts
export default function plugin(api) {
  api.addUtility('.glass', {
    backdropFilter: 'blur(10px)'
  })
}
```

---

##  Rust Engine (Experimental)

GarurSaili‑CSS is evolving.

A **Rust‑powered engine** is being integrated using **NAPI‑RS** to:

* Boost parsing speed
* Enable parallel builds
* Prepare for enterprise‑scale usage

This will make Garur one of the **fastest CSS engines ever built**.

---

## 📊 Performance

| Task       | Time         |
| ---------- | ------------ |
| Cold Build | ~80‑100ms    |
| Rebuild    | ~10‑20ms     |
| Watch Mode | Near‑instant |

⚡ Performance Overview
Metric	GarurSaili-CSS
Build Time	≤ 100 ms
Engine Type	True JIT (On-Demand)
Initial Scan Speed	Ultra Fast
Incremental Rebuild	Near Instant
Memory Usage	Very Low
Cold Start Time	Minimal
File Watching	Native & Optimized
Output CSS Size	Highly Optimized
Runtime Dependency	Zero
CLI Startup Time	Fast
Future Engine Backend	Rust (NAPI)
---

## 🔒 License

MIT License © 2025 **Barshan Sarkar**

You are free to use, modify, software built using GarurSaili‑CSS.

---

## 🌟 Vision

GarurSaili‑CSS is not just a framework.

It is an **engine**, a **compiler**, and a **movement** toward faster, smarter, and cleaner CSS.
indian first dynamic utility + component = hybrid css framework . made my BARSHAN SARKAR 
made in india (west bengal )

> *Built non‑stop. Released with belief. Garur now flies.* 🦅
