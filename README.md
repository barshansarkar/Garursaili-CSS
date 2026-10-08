<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">


</head>
<body>

<!-- ═══════════════════════════════════════════════════════ -->
<!-- HERO -->
<!-- ═══════════════════════════════════════════════════════ -->

<div class="center">

<img src="src/garur.png" alt="GarurSaili-CSS — The Semantic Indian CSS Framework" width="200" class="hero-img" />

<h1>🦅 GarurSaili-CSS</h1>

<h3 style="margin-top: 0.25rem;">India's First Semantic CSS Framework</h3>

<p class="subtitle">Native Rust Engine · Semantic Primitives · 5000+ Utilities · Made in Malda, West Bengal, India 🇮🇳</p>

<p class="tagline">A hybrid CSS engine where structure meets expression — writing what you mean, not what you remember.</p>

<div class="badges">
  <img src="https://img.shields.io/npm/v/garursaili-css?color=8657f7&label=npm&logo=npm" alt="npm version">
  <img src="https://img.shields.io/npm/dm/garursaili-css?color=e54cb5&logo=npm" alt="npm downloads">
  <img src="https://img.shields.io/badge/License-MIT-f59e00.svg" alt="License: MIT">
  <img src="https://img.shields.io/badge/Built%20with-Rust-000000?logo=rust" alt="Built with Rust">
  <img src="https://img.shields.io/badge/Made%20in-India%20🇮🇳-ff9933?labelColor=138808" alt="Made in India">
  <img src="https://img.shields.io/badge/Semantic-First-8657f7" alt="Semantic First">
  <img src="https://img.shields.io/badge/Indian%20Framework-1st-138808" alt="Indian Framework">
  <img src="https://img.shields.io/badge/build-1ms-26944c" alt="Build 1ms">
</div>

<div class="nav-links">
  <a href="#documentation">Documentation</a>
  <a href="#primitives">Primitives</a>
  <a href="#utilities">Utilities</a>
  <a href="#palette">Palette</a>
  <a href="#performance">Performance</a>
  <a href="#roadmap">Roadmap</a>
</div>

</div>

<hr>

<!-- ═══════════════════════════════════════════════════════ -->
<!-- ABOUT THE MAKER -->
<!-- ═══════════════════════════════════════════════════════ -->

<h2 id="about-the-maker">🇮🇳 About the Maker</h2>

<div class="maker-card">
  <div class="flag-strip"></div>
  <blockquote>
    GarurSaili-CSS is <strong>India's first Rust-powered semantic CSS framework</strong>.<br>
    Built from scratch, in <strong>Malda, West Bengal</strong> — a small city in eastern India —
    by a solo developer who refused to accept that "fast" and "beautiful" had to be imported.
  </blockquote>
  <p style="margin: 0.5rem 0 0;">
    <strong>Author:</strong> <a href="https://github.com/barshansarkar">Barshan Sarkar</a><br>
    <strong>Origin:</strong> Malda, West Bengal, India 🇮🇳<br>
    <strong>License:</strong> MIT (free forever)<br>
    <strong>Status:</strong> Actively developed
  </p>
</div>

<p>This is a framework made <strong>by an Indian, for the world</strong> — but with roots that never forget where they came from.</p>

<hr>

<!-- ═══════════════════════════════════════════════════════ -->
<!-- WHAT IS GARUR -->
<!-- ═══════════════════════════════════════════════════════ -->

<h2 id="what-is-garur">✨ What is Garur?</h2>

<p><strong>Garur</strong> means <strong>"speed"</strong> in Sanskrit.</p>

<p>
Every CSS framework teaches you <em>what to build</em>.<br>
<strong>Garur teaches you what to <em>mean</em>.</strong>
</p>

<p>
GarurSaili-CSS is not a Tailwind clone.<br>
GarurSaili-CSS is not a Bootstrap alternative.<br>
GarurSaili-CSS is not a component library.
</p>

<p><strong>Garur is a new category — a semantic-first CSS engine.</strong></p>

<p>It gives you <strong>two layers</strong> that compose as one:</p>

<div class="two-col">

<div>
  <h3 style="margin-top: 0.25rem;">🧱 The Primitive Layer</h3>
  <p>Semantic building blocks with opinionated, beautiful defaults.</p>
<pre><code>&lt;div class="card"&gt;
  &lt;h3 class="card-title"&gt;Hello&lt;/h3&gt;
  &lt;button class="btn btn-primary"&gt;Save&lt;/button&gt;
&lt;/div&gt;</code></pre>
  <p><strong>Three classes. Complete component. Zero boilerplate.</strong></p>
</div>

<div>
  <h3 style="margin-top: 0.25rem;">🎨 The Utility Layer</h3>
  <p>Precision escape hatches when you need exact control.</p>
<pre><code>&lt;div class="card p-8 rounded-2xl shadow-xl
            bg-iris-500/10 border-iris-500/40"&gt;
  &lt;h3 class="card-title text-3xl"&gt;Hello&lt;/h3&gt;
&lt;/div&gt;</code></pre>
  <p><strong>Structure from primitives. Soul from utilities.</strong></p>
</div>

</div>

<p><strong>Use them separately. Use them together. Your call.</strong></p>

<hr>

<!-- ═══════════════════════════════════════════════════════ -->
<!-- WHY GARUR IS DIFFERENT -->
<!-- ═══════════════════════════════════════════════════════ -->

<h2 id="why-different">🎯 Why Garur is Different</h2>

<h3>🏆 Indian Innovation, World-Class Quality</h3>
<p>GarurSaili-CSS is <strong>the first CSS framework natively written in Rust from India</strong>. It's not a wrapper. It's not a port. It's an original engine with an original design philosophy — <strong>semantic intent over utility memorization</strong>.</p>

<h3>⚡ Native Rust — Not JavaScript, Not WASM</h3>
<p>Compiled to a single <code>.node</code> binary via <strong>napi-rs</strong>. Zero JavaScript overhead in the hot path. Zero WASM bridge. Zero PostCSS plugin chain.</p>

<h3>🧠 Semantic-First Design Philosophy</h3>
<p>Write what you <strong>mean</strong>, not what you <strong>remember</strong>:</p>
<pre><code>&lt;!-- Instead of remembering 6 classes: --&gt;
&lt;div class="flex items-center justify-center gap-4 min-h-screen"&gt;
  &lt;div class="flex flex-col gap-2 items-center"&gt;...&lt;/div&gt;
&lt;/div&gt;

&lt;!-- Write what you mean: --&gt;
&lt;div class="mid-screen"&gt;
  &lt;div class="stack-center"&gt;...&lt;/div&gt;
&lt;/div&gt;</code></pre>

<h3>🎭 225+ Semantic Primitives</h3>
<p>Not utilities — <strong>complete components in a single class</strong>:</p>
<pre><code>&lt;button class="btn btn-primary btn-lg"&gt;Launch&lt;/button&gt;
&lt;div class="card card-interactive"&gt;Click me&lt;/div&gt;
&lt;div class="alert alert-success"&gt;Saved!&lt;/div&gt;
&lt;span class="badge badge-danger"&gt;New&lt;/span&gt;</code></pre>

<h3>🌈 Poetic Indian Palette</h3>
<p><strong>31 color families, 343 shades</strong> — named after the world we see, not hex codes:</p>
<p><code>iris</code> · <code>void</code> · <code>honey</code> · <code>jade</code> · <code>ember</code> · <code>plum</code> · <code>mint</code> · <code>coral</code> · <code>sunbeam</code> · <code>bone</code> · <code>sand</code> · <code>smoke</code></p>

<h3>🌓 Automatic Dark Mode</h3>
<p>Every primitive adapts via <strong>CSS custom properties</strong>. Zero <code>dark:</code> classes. Zero config. Just add <code>.dark</code> to <code>&lt;html&gt;</code>.</p>

<h3>♿ Accessible by Default</h3>
<p><code>prefers-reduced-motion</code> · <code>prefers-reduced-data</code> · <code>prefers-reduced-transparency</code> · <code>forced-colors</code> — all handled <strong>without a line of your CSS</strong>.</p>

<h3>💾 Persistent Cross-Process Cache</h3>
<p>Disk-backed <code>.garur-cache.bin</code>. After first build, every rebuild hits <strong>~100% cache rate</strong>. Rebuilds become instant.</p>

<hr>

<!-- ═══════════════════════════════════════════════════════ -->
<!-- INSTALL -->
<!-- ═══════════════════════════════════════════════════════ -->

<h2 id="install">📦 Install</h2>

<pre><code>npm install garursaili-css</code></pre>

<p><strong>That's it.</strong> No PostCSS. No bundler plugin. No config file needed.</p>

<p>Or install globally:</p>
<pre><code>npm install -g garursaili-css
garur --version</code></pre>

<hr>

<!-- ═══════════════════════════════════════════════════════ -->
<!-- QUICK START -->
<!-- ═══════════════════════════════════════════════════════ -->

<h2 id="documentation">🚀 Quick Start</h2>

<h3>1. Build your CSS</h3>
<pre><code>npx garur build</code></pre>
<p>Garur scans your project, extracts classes, generates <code>build/garur.css</code>.</p>

<h3>2. Link the stylesheet</h3>
<pre><code>&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
  &lt;link rel="stylesheet" href="/build/garur.css" /&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;!-- your content --&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>

<h3>3. Start writing</h3>
<pre><code>&lt;div class="container section"&gt;
  &lt;h1 class="page-title"&gt;Hello, Garur&lt;/h1&gt;
  &lt;p class="page-subtitle"&gt;The hybrid CSS engine.&lt;/p&gt;

  &lt;div class="grid-3"&gt;
    &lt;div class="card"&gt;
      &lt;h3 class="card-title"&gt;Fast&lt;/h3&gt;
      &lt;p class="card-text"&gt;6ms cold builds.&lt;/p&gt;
    &lt;/div&gt;
    &lt;div class="card card-interactive"&gt;
      &lt;h3 class="card-title"&gt;Smart&lt;/h3&gt;
      &lt;p class="card-text"&gt;Primitives + utilities.&lt;/p&gt;
    &lt;/div&gt;
    &lt;div class="card card-glass"&gt;
      &lt;h3 class="card-title"&gt;Beautiful&lt;/h3&gt;
      &lt;p class="card-text"&gt;343 poetic shades.&lt;/p&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/div&gt;</code></pre>

<h3>4. Dark mode?</h3>
<pre><code>&lt;html class="dark"&gt;</code></pre>
<p><strong>Done.</strong> Everything adapts.</p>

<hr>

<!-- ═══════════════════════════════════════════════════════ -->
<!-- CLI REFERENCE -->
<!-- ═══════════════════════════════════════════════════════ -->

<h2 id="cli">💻 CLI Reference</h2>

<pre><code>garur                       # Build CSS (one-shot)
garur build                 # Same as above
garur watch                 # Watch mode (live rebuilds)
garur preview --port 3000   # Live preview server
garur init                  # Create garur.config.js
garur example               # Create example.html
garur analyze               # Analyze class usage by category
garur stats                 # CSS statistics
garur benchmark --runs 10   # Performance benchmark
garur doctor                # Diagnose environment
garur config show           # View current config
garur format                # Sort class attributes in HTML
garur clean                 # Remove cache + output
garur native                # Show native engine info
garur cache-stats           # Cumulative cache stats
garur upgrade               # Check for new versions</code></pre>

<hr>

<!-- ═══════════════════════════════════════════════════════ -->
<!-- SEMANTIC PRIMITIVES -->
<!-- ═══════════════════════════════════════════════════════ -->

<h2 id="primitives">🧱 Semantic Primitives</h2>

<h3>Layout</h3>
<table>
<thead><tr><th>Primitive</th><th>Purpose</th></tr></thead>
<tbody>
<tr><td><code>container</code>, <code>container-sm/md/lg/xl/2xl</code></td><td>Centered responsive wrapper</td></tr>
<tr><td><code>section</code>, <code>section-sm</code>, <code>section-lg</code></td><td>Vertical padded section</td></tr>
<tr><td><code>hero</code>, <code>hero-sm</code>, <code>hero-lg</code></td><td>Full-width centered hero</td></tr>
<tr><td><code>row</code>, <code>row-center</code>, <code>row-between</code>, <code>row-around</code>, <code>row-evenly</code>, <code>row-start</code>, <code>row-end</code></td><td>Horizontal flex with alignment</td></tr>
<tr><td><code>stack</code>, <code>stack-center</code>, <code>stack-between</code>, <code>stack-start</code>, <code>stack-end</code></td><td>Vertical flex with alignment</td></tr>
<tr><td><code>cluster</code>, <code>cluster-center</code></td><td>Wrapping flex (chips, tags)</td></tr>
<tr><td><code>hstack</code>, <code>vstack</code></td><td>Flex row/column with default gap</td></tr>
<tr><td><code>center</code>, <code>center-x</code></td><td>Centered content shortcuts</td></tr>
<tr><td><code>grid-1</code> … <code>grid-12</code></td><td>Equal-column grid</td></tr>
<tr><td><code>grid-auto</code>, <code>grid-auto-fill</code></td><td>Responsive auto-grid</td></tr>
<tr><td><code>split</code></td><td>Two-column split</td></tr>
<tr><td><code>cover</code>, <code>fixed-cover</code>, <code>fixed-center</code>, <code>abs-center</code></td><td>Position shortcuts</td></tr>
<tr><td><code>sticky-top</code>, <code>scroll-y</code>, <code>scroll-x</code></td><td>Sticky / scroll containers</td></tr>
<tr><td><code>aspect-square</code>, <code>aspect-video</code>, <code>aspect-photo</code></td><td>Aspect ratios</td></tr>
</tbody>
</table>

<h3>Intent Layer ⭐ (Garur Exclusive)</h3>
<pre><code>&lt;!-- What you mean, not what you remember --&gt;
&lt;div class="mid-screen"&gt;          &lt;!-- full-screen centered --&gt;
&lt;div class="apart-mid"&gt;           &lt;!-- space-between + vertical center --&gt;
&lt;div class="jumbo"&gt;               &lt;!-- hero-sized section --&gt;
&lt;div class="grow"&gt;                &lt;!-- hover scale animation --&gt;</code></pre>
<table>
<thead><tr><th>Intent</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td><code>mid</code>, <code>mid-x</code>, <code>mid-y</code>, <code>mid-screen</code></td><td>Center on both axes</td></tr>
<tr><td><code>apart</code>, <code>apart-mid</code>, <code>even</code>, <code>around</code></td><td>Flex distribution</td></tr>
<tr><td><code>rise</code>, <code>rise-sm</code>, <code>rise-lg</code>, <code>sunken</code></td><td>Elevation</td></tr>
<tr><td><code>smooth</code>, <code>quick</code>, <code>lazy</code></td><td>Transition timings</td></tr>
<tr><td><code>grow</code>, <code>shrink</code>, <code>lift</code>, <code>press</code></td><td>Hover/active behavior</td></tr>
<tr><td><code>clickable</code>, <code>tappable</code>, <code>locked</code>, <code>busy</code></td><td>State</td></tr>
<tr><td><code>alive</code>, <code>dead</code>, <code>busy-dot</code></td><td>Status indicators</td></tr>
<tr><td><code>clip</code>, <code>balance</code>, <code>pretty</code></td><td>Text overflow</td></tr>
<tr><td><code>tiny</code>, <code>small</code>, <code>body</code>, <code>lead</code>, <code>title</code>, <code>headline</code>, <code>display</code>, <code>banner</code></td><td>Typographic scale</td></tr>
</tbody>
</table>

<h3>Typography</h3>
<table>
<thead><tr><th>Primitive</th><th>Purpose</th></tr></thead>
<tbody>
<tr><td><code>page-title</code>, <code>page-subtitle</code></td><td>Page-level headings</td></tr>
<tr><td><code>hero-title</code>, <code>hero-subtitle</code></td><td>Fluid clamp hero headings</td></tr>
<tr><td><code>section-title</code>, <code>section-subtitle</code></td><td>Section headings</td></tr>
<tr><td><code>card-title</code>, <code>card-text</code></td><td>Card typography</td></tr>
<tr><td><code>stat-value</code>, <code>stat-label</code>, <code>stat-change</code></td><td>Statistics display</td></tr>
<tr><td><code>muted</code>, <code>subtle</code>, <code>hint</code>, <code>quiet</code></td><td>Text hierarchy</td></tr>
<tr><td><code>strong</code>, <code>heavy</code>, <code>semibold</code>, <code>medium</code>, <code>light</code></td><td>Font weights</td></tr>
<tr><td><code>prose</code></td><td>Long-form rich text</td></tr>
</tbody>
</table>

<h3>Surface</h3>
<table>
<thead><tr><th>Primitive</th><th>Purpose</th></tr></thead>
<tbody>
<tr><td><code>card</code>, <code>card-flat</code>, <code>card-raised</code>, <code>card-interactive</code>, <code>card-glass</code></td><td>Card variants</td></tr>
<tr><td><code>surface</code>, <code>surface-muted</code>, <code>surface-glass</code></td><td>Generic surfaces</td></tr>
<tr><td><code>avatar</code>, <code>avatar-sm/lg/xl</code>, <code>avatar-square</code>, <code>avatar-ring</code>, <code>avatar-group</code></td><td>User avatars</td></tr>
<tr><td><code>divider</code>, <code>divider-vertical</code>, <code>divider-dashed</code>, <code>divider-dotted</code></td><td>Separators</td></tr>
</tbody>
</table>

<h3>Forms</h3>
<table>
<thead><tr><th>Primitive</th><th>Purpose</th></tr></thead>
<tbody>
<tr><td><code>btn</code>, <code>btn-primary</code>, <code>btn-secondary</code>, <code>btn-ghost</code>, <code>btn-outline</code></td><td>Button variants</td></tr>
<tr><td><code>btn-danger</code>, <code>btn-success</code>, <code>btn-warning</code>, <code>btn-info</code></td><td>Semantic buttons</td></tr>
<tr><td><code>btn-sm</code>, <code>btn-lg</code>, <code>btn-icon</code>, <code>btn-icon-sm</code>, <code>btn-block</code></td><td>Button sizing</td></tr>
<tr><td><code>input</code>, <code>input-sm</code>, <code>input-lg</code>, <code>input-error</code></td><td>Text inputs</td></tr>
<tr><td><code>textarea</code>, <code>select</code>, <code>label</code>, <code>field</code>, <code>help-text</code></td><td>Form fields</td></tr>
<tr><td><code>switch</code>, <code>checkbox</code>, <code>radio</code></td><td>Toggle controls</td></tr>
<tr><td><code>cta</code>, <code>cta-soft</code>, <code>cta-ghost</code></td><td>Call-to-action buttons</td></tr>
</tbody>
</table>

<h3>Feedback</h3>
<table>
<thead><tr><th>Primitive</th><th>Purpose</th></tr></thead>
<tbody>
<tr><td><code>badge</code>, <code>badge-primary/success/danger/warning/info/muted</code></td><td>Status pills</td></tr>
<tr><td><code>chip</code></td><td>Filter chips</td></tr>
<tr><td><code>alert</code>, <code>alert-info/success/danger/warning</code></td><td>Alert banners</td></tr>
<tr><td><code>toast</code>, <code>toast-success/danger/info/warning</code></td><td>Toast notifications</td></tr>
<tr><td><code>progress</code>, <code>progress-bar</code>, <code>progress-success/danger/sm/lg</code></td><td>Progress bars</td></tr>
<tr><td><code>spinner</code>, <code>spinner-sm</code>, <code>spinner-lg</code></td><td>Loading spinner</td></tr>
<tr><td><code>skeleton</code>, <code>skeleton-text</code>, <code>skeleton-circle</code></td><td>Content placeholder</td></tr>
</tbody>
</table>

<h3>Navigation</h3>
<table>
<thead><tr><th>Primitive</th><th>Purpose</th></tr></thead>
<tbody>
<tr><td><code>navbar</code>, <code>navbar-sticky</code>, <code>navbar-brand</code>, <code>navbar-link</code></td><td>Navigation bar</td></tr>
<tr><td><code>sidebar</code>, <code>sidebar-item</code>, <code>sidebar-item-active</code></td><td>Side navigation</td></tr>
<tr><td><code>breadcrumb</code>, <code>breadcrumb-item</code>, <code>breadcrumb-sep</code>, <code>breadcrumb-current</code></td><td>Breadcrumbs</td></tr>
<tr><td><code>pagination</code>, <code>page-item</code>, <code>page-item-active</code></td><td>Pagination</td></tr>
<tr><td><code>tabs</code>, <code>tab</code>, <code>tab-active</code></td><td>Tab navigation</td></tr>
<tr><td><code>stepper</code>, <code>step</code>, <code>step-active</code>, <code>step-complete</code>, <code>step-divider</code></td><td>Progress stepper</td></tr>
<tr><td><code>menu</code>, <code>menu-item</code>, <code>menu-item-active</code>, <code>menu-divider</code>, <code>menu-label</code></td><td>Menu system</td></tr>
<tr><td><code>hamburger</code>, <code>drawer</code>, <code>drawer-right</code>, <code>drawer-overlay</code></td><td>Mobile drawer</td></tr>
</tbody>
</table>

<h3>Content</h3>
<table>
<thead><tr><th>Primitive</th><th>Purpose</th></tr></thead>
<tbody>
<tr><td><code>accordion</code>, <code>accordion-item</code>, <code>accordion-header</code>, <code>accordion-body</code></td><td>Collapsible sections</td></tr>
<tr><td><code>table</code>, <code>table-striped</code>, <code>table-hover</code>, <code>table-bordered</code>, <code>table-cell</code>, <code>table-head</code></td><td>Data tables</td></tr>
<tr><td><code>timeline</code>, <code>timeline-item</code></td><td>Activity feed</td></tr>
<tr><td><code>stat</code></td><td>Statistic block</td></tr>
<tr><td><code>empty-state</code>, <code>empty-state-icon</code></td><td>No-data placeholder</td></tr>
<tr><td><code>rating</code>, <code>rating-stars</code>, <code>rating-count</code>, <code>rating-value</code></td><td>Star rating</td></tr>
<tr><td><code>code-inline</code>, <code>code-block</code>, <code>kbd</code>, <code>shortcut</code></td><td>Code and keyboard</td></tr>
<tr><td><code>link</code>, <code>link-muted</code>, <code>link-nav</code></td><td>Links</td></tr>
<tr><td><code>comment</code>, <code>comment-avatar</code>, <code>comment-body</code>, <code>comment-author</code></td><td>Comments</td></tr>
<tr><td><code>testimonial</code>, <code>testimonial-quote</code>, <code>testimonial-author</code></td><td>Testimonials</td></tr>
<tr><td><code>post-card</code>, <code>post-meta</code>, <code>post-title</code>, <code>post-excerpt</code></td><td>Blog posts</td></tr>
</tbody>
</table>

<h3>Overlay</h3>
<table>
<thead><tr><th>Primitive</th><th>Purpose</th></tr></thead>
<tbody>
<tr><td><code>overlay</code>, <code>modal</code>, <code>modal-sm/lg/full</code></td><td>Modal dialog</td></tr>
<tr><td><code>modal-header</code>, <code>modal-body</code>, <code>modal-footer</code>, <code>modal-close</code></td><td>Modal parts</td></tr>
<tr><td><code>tooltip</code> (with <code>data-tooltip="..."</code>)</td><td>Hover tooltip</td></tr>
<tr><td><code>dropdown</code>, <code>dropdown-menu</code>, <code>dropdown-item</code></td><td>Dropdown menu</td></tr>
</tbody>
</table>

<h3>Decoration</h3>
<table>
<thead><tr><th>Primitive</th><th>Purpose</th></tr></thead>
<tbody>
<tr><td><code>glass</code>, <code>glass-pill</code></td><td>Frosted-glass surface</td></tr>
<tr><td><code>glow</code>, <code>glow-iris</code>, <code>glow-pink</code>, <code>glow-blue</code></td><td>Colored glows</td></tr>
<tr><td><code>gradient-primary</code>, <code>gradient-surface</code>, <code>gradient-text</code></td><td>Gradients</td></tr>
<tr><td><code>shimmer</code></td><td>Animated gradient text</td></tr>
<tr><td><code>spotlight</code>, <code>spotlight-lg</code>, <code>spotlight-sm</code></td><td>Cursor-following spotlight</td></tr>
<tr><td><code>border-gradient</code>, <code>border-gradient-hover</code></td><td>Gradient borders</td></tr>
<tr><td><code>aurora-bg</code>, <code>mesh-bg</code>, <code>grid-bg</code>, <code>dot-grid</code></td><td>Ambient backgrounds</td></tr>
<tr><td><code>orb</code>, <code>orb-iris</code>, <code>orb-pink</code>, <code>float-slow</code></td><td>Decorative orbs</td></tr>
<tr><td><code>marquee</code>, <code>marquee-slow</code>, <code>marquee-fast</code></td><td>Scrolling text</td></tr>
<tr><td><code>noise-overlay</code></td><td>Subtle texture overlay</td></tr>
</tbody>
</table>

<h3>Interactive</h3>
<table>
<thead><tr><th>Primitive</th><th>Purpose</th></tr></thead>
<tbody>
<tr><td><code>interactive-primary</code>, <code>interactive-ghost</code>, <code>interactive-danger</code></td><td>Complete stateful buttons</td></tr>
<tr><td><code>focus-ring</code></td><td>Universal focus ring</td></tr>
</tbody>
</table>

<h3>Garur Signature — Indian Intent Layer 🇮🇳</h3>
<p>Garur ships with a <strong>signature intent layer</strong> inspired by Indian philosophy and design:</p>
<table>
<thead><tr><th>Primitive</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td><code>namaste</code></td><td>Centered greeting stack (hero pattern)</td></tr>
<tr><td><code>lotus</code></td><td>Elegant centered grid</td></tr>
<tr><td><code>banyan</code></td><td>Sticky frosted nav (like the banyan tree)</td></tr>
<tr><td><code>rangoli</code></td><td>Balanced 4-column grid</td></tr>
<tr><td><code>mehndi</code></td><td>Double-bordered decorative box</td></tr>
<tr><td><code>diya</code></td><td>Element with warm radial glow</td></tr>
<tr><td><code>chakra</code></td><td>Spinning loader</td></tr>
<tr><td><code>tilak</code></td><td>Vertical accent mark</td></tr>
<tr><td><code>ghat</code></td><td>Staggered cascade layout</td></tr>
<tr><td><code>monsoon</code></td><td>Cool blue-grey palette scheme</td></tr>
<tr><td><code>saffron</code></td><td>Warm amber call-out box</td></tr>
<tr><td><code>tandava</code></td><td>Sharp easing (Shiva's dance)</td></tr>
<tr><td><code>lasya</code></td><td>Soft easing (Parvati's grace)</td></tr>
</tbody>
</table>
<p><strong>These aren't gimmicks.</strong> They're a naming system that maps to real design patterns — and every developer worldwide can use them.</p>

<hr>

<!-- ═══════════════════════════════════════════════════════ -->
<!-- PALETTE -->
<!-- ═══════════════════════════════════════════════════════ -->

<h2 id="palette">🎨 The Garur Palette</h2>

<p><strong>31 families, 343 shades</strong> — all OKLCH-balanced for contrast and hue harmony.</p>

<p>Each family has 11 shades: <strong>50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950</strong>.</p>

<div class="two-col">

<div>
  <p><strong>Cool Blues</strong><br><code>azure</code> · <code>cobalt</code> · <code>indigo</code> · <code>iris</code> · <code>violet</code> · <code>orchid</code></p>
  <p><strong>Warm Reds &amp; Pinks</strong><br><code>ruby</code> · <code>crimson</code> · <code>coral</code> · <code>rose</code> · <code>blush</code> · <code>plum</code></p>
  <p><strong>Fire &amp; Gold</strong><br><code>ember</code> · <code>sunset</code> · <code>honey</code> · <code>gold</code> · <code>sunbeam</code></p>
</div>

<div>
  <p><strong>Nature Greens</strong><br><code>citron</code> · <code>lime</code> · <code>mint</code> · <code>forest</code> · <code>jade</code> · <code>teal</code> · <code>aqua</code> · <code>sky</code></p>
  <p><strong>Neutrals</strong><br><code>void</code> · <code>graphite</code> · <code>ash</code> · <code>smoke</code> · <code>sand</code> · <code>bone</code></p>
  <p><strong>Base</strong><br><code>black</code> · <code>white</code></p>
</div>

</div>

<pre><code>&lt;div class="bg-iris-500 text-bone-50 border border-iris-600"&gt;
  &lt;button class="bg-ruby-500 hover:bg-ruby-600"&gt;Delete&lt;/button&gt;
  &lt;span class="text-mint-600"&gt;✓ Saved&lt;/span&gt;
&lt;/div&gt;</code></pre>

<p>Opacity modifiers work everywhere:</p>
<pre><code>&lt;div class="bg-void-950/80 backdrop-blur-xl"&gt;
  &lt;span class="text-iris-500/60"&gt;Subtle&lt;/span&gt;
&lt;/div&gt;</code></pre>

<p><strong>Easy Mode</strong> — omit the shade, get 500:</p>
<pre><code>&lt;div class="bg-iris"&gt;  &lt;!-- = bg-iris-500 --&gt;
&lt;div class="bg-iris-6"&gt;  &lt;!-- = bg-iris-600 --&gt;
&lt;div class="bg-iris-95"&gt; &lt;!-- = bg-iris-950 --&gt;</code></pre>

<p><strong>Fully configurable</strong> — add your brand:</p>
<pre><code>// garur.config.js
export default {
  palette: {
    brand: {
      500: '#6366f1',
      600: '#4f46e5',
      700: '#4338ca',
    },
  },
};</code></pre>

<p>Use <code>bg-brand-500</code>, <code>text-brand-600</code>, <code>border-brand-700</code> immediately.</p>

<hr>

<!-- ═══════════════════════════════════════════════════════ -->
<!-- UTILITY REFERENCE -->
<!-- ═══════════════════════════════════════════════════════ -->

<h2 id="utilities">🛠️ Utility Reference</h2>

<p><strong>5000+ utilities generated.</strong> All v4-compatible — but with Garur's own semantic additions.</p>

<h3>Layout</h3>
<p><code>flex</code> · <code>grid</code> · <code>block</code> · <code>inline-block</code> · <code>hidden</code> · <code>contents</code> · <code>flow-root</code></p>

<h3>Spacing</h3>
<p>
<code>p-*</code> · <code>px-*</code> · <code>py-*</code> · <code>pt/pr/pb/pl/ps/pe-*</code><br>
<code>m-*</code> · <code>mx/my/mt/mr/mb/ml/ms/me-*</code><br>
<code>gap-*</code> · <code>gap-x/y-*</code> · <code>space-x/y-*</code>
</p>
<p>Values: <code>0</code> · <code>0.5</code> · <code>1</code> · <code>1.5</code> · <code>2</code> … <code>96</code> · <code>3xs</code> · <code>2xs</code> · <code>xs</code> · <code>3xl</code> … <code>9xl</code></p>

<h3>Sizing</h3>
<p><code>w-*</code> · <code>h-*</code> · <code>min-w/h-*</code> · <code>max-w/h-*</code> · <code>size-*</code> · <code>basis-*</code></p>
<p>Values: numbers, fractions (<code>w-1/2</code>), <code>auto</code>, <code>full</code>, <code>screen</code>, <code>svh</code>, <code>lvh</code>, <code>dvh</code></p>

<h3>Typography</h3>
<p><code>text-xs</code>…<code>text-9xl</code> · <code>font-thin</code>…<code>font-black</code> · <code>font-sans/serif/mono</code><br>
<code>leading-*</code> · <code>tracking-*</code> · <code>indent-*</code> · <code>line-clamp-*</code> · <code>truncate</code> · <code>text-balance</code></p>

<h3>Colors</h3>
<p><code>bg-{color}-{shade}/{opacity}</code> · <code>text-*</code> · <code>border-*</code> · <code>ring-*</code> · <code>divide-*</code><br>
<code>fill-*</code> · <code>stroke-*</code> · <code>accent-*</code> · <code>caret-*</code> · <code>outline-*</code> · <code>decoration-*</code></p>

<h3>Borders &amp; Radius</h3>
<p><code>border</code> · <code>border-{0,2,4,8}</code> · <code>border-{t,r,b,l,x,y}</code><br>
<code>rounded</code> · <code>rounded-{sm,md,lg,xl,2xl,3xl,full}</code></p>

<h3>Effects</h3>
<p><code>shadow</code> · <code>shadow-{sm,md,lg,xl,2xl,inner,none}</code><br>
<code>opacity-{0..100}</code><br>
<code>blur-*</code> · <code>brightness-*</code> · <code>contrast-*</code> · <code>saturate-*</code> · <code>hue-rotate-*</code><br>
<code>backdrop-blur-*</code> · <code>backdrop-brightness-*</code></p>

<h3>Transform</h3>
<p><code>scale-*</code> · <code>rotate-*</code> · <code>translate-x/y-*</code> · <code>skew-x/y-*</code><br>
<code>origin-*</code> · <code>perspective-*</code> · <code>perspective-origin-*</code><br>
<code>rotate-x/y/z-*</code> · <code>scale-z-*</code> · <code>translate-z-*</code></p>

<h3>Transitions</h3>
<p><code>transition</code> · <code>transition-{all,colors,opacity,shadow,transform}</code><br>
<code>duration-*</code> · <code>delay-*</code> · <code>ease-*</code></p>

<h3>Variants</h3>
<p>Every utility supports every variant:</p>
<pre><code>hover: · focus: · focus-within: · focus-visible: · active: · visited:
disabled: · enabled: · checked: · required: · valid: · invalid:
first: · last: · only: · odd: · even: · empty:
before: · after: · placeholder: · marker: · selection:
dark: · motion-safe: · motion-reduce: · print:
sm: · md: · lg: · xl: · 2xl: · min-[...]: · max-[...]:
rtl: · ltr:
group-hover: · group-focus: · peer-checked: · peer-focus:
has-[...]: · data-[...]: · aria-[...]: · supports-[...]:
not-*: · nth-*: · starting: · inert: · user-valid: · user-invalid:</code></pre>

<p>Plus <strong>arbitrary values</strong>:</p>
<pre><code>&lt;div class="w-[437px] bg-[#0a0a0a] grid-cols-[1fr_2fr_auto]"&gt;</code></pre>

<hr>

<!-- ═══════════════════════════════════════════════════════ -->
<!-- PERFORMANCE -->
<!-- ═══════════════════════════════════════════════════════ -->

<h2 id="performance">⚡ Performance</h2>

<p><strong>Verified on a real machine</strong> (Linux x64, Node 22).</p>

<h3>Build time</h3>
<table>
<thead><tr><th>Metric</th><th>Time</th></tr></thead>
<tbody>
<tr><td>Cold build (first ever)</td><td><strong>~85ms</strong></td></tr>
<tr><td>Cold build (subsequent)</td><td><strong>~6ms</strong></td></tr>
<tr><td>Warm rebuild (cached)</td><td><strong>1–2ms</strong></td></tr>
<tr><td>Watch mode initial</td><td><strong>~5ms</strong></td></tr>
</tbody>
</table>

<h3>Cache behavior</h3>
<ul>
<li><strong>100% cache hit rate</strong> after first build</li>
<li>Cache misses freeze at initial class count — never grow</li>
<li>Cross-process persistence via <code>.garur-cache.bin</code></li>
</ul>

<h3>Real-world numbers</h3>
<p>For a project with <strong>43 source files</strong> producing <strong>1,299 unique classes</strong>:</p>
<table>
<thead><tr><th>Metric</th><th>Value</th></tr></thead>
<tbody>
<tr><td>Total CSS output</td><td><strong>122.43 KB</strong></td></tr>
<tr><td>Minified</td><td><strong>105.53 KB</strong></td></tr>
<tr><td>Gzipped (browser)</td><td><strong>~12–15 KB</strong></td></tr>
<tr><td>Build time</td><td><strong>26ms</strong></td></tr>
</tbody>
</table>

<h3>Bundle comparison</h3>
<table>
<thead><tr><th>Framework</th><th>Raw CSS</th><th>Gzipped</th></tr></thead>
<tbody>
<tr><td>Bootstrap 5</td><td>210 KB</td><td>26 KB</td></tr>
<tr><td>Typical JIT build</td><td>38 KB</td><td>7 KB</td></tr>
<tr><td><strong>Garur (1,299 classes)</strong></td><td><strong>122 KB</strong></td><td><strong>~14 KB</strong></td></tr>
</tbody>
</table>
<p><em>Numbers from real builds. Reproducible — run <code>garur benchmark</code> yourself.</em></p>

<hr>

<!-- ═══════════════════════════════════════════════════════ -->
<!-- ARCHITECTURE -->
<!-- ═══════════════════════════════════════════════════════ -->

<h2 id="architecture">🏗️ Architecture</h2>

<p>Garur is built from the ground up in Rust — with an original design that has no direct equivalent.</p>

<pre><code>┌──────────────────────────────────────────────┐
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
└──────────────────────────────────────────────┘</code></pre>

<p><strong>Design decisions:</strong></p>
<ul>
<li><code>ArcSwap</code> — lock-free config hot-swap</li>
<li><code>DashMap</code> — concurrent caches without mutex contention</li>
<li><code>rayon</code> — parallel file scanning across CPU cores</li>
<li><code>Arc&lt;str&gt;</code> — O(1) cache hits with zero-copy semantics</li>
<li><code>xxh3</code> — microsecond file hashing</li>
<li><code>bincode</code> — cross-process persistent cache</li>
<li><code>once_cell::Lazy</code> — one-time initialization of static state</li>
<li><code>fxhash</code> — faster than SipHash for short keys</li>
</ul>

<p>Read the source: <a href="rust/src/"><code>rust/src/</code></a></p>

<hr>

<!-- ═══════════════════════════════════════════════════════ -->
<!-- CONFIGURATION -->
<!-- ═══════════════════════════════════════════════════════ -->

<h2 id="configuration">⚙️ Configuration</h2>

<p><strong>Zero config works for 95% of projects.</strong> For the rest:</p>

<pre><code>// garur.config.js
export default {
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  darkMode: 'class',    // or 'media'

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
};</code></pre>

<hr>

<!-- ═══════════════════════════════════════════════════════ -->
<!-- BROWSER SUPPORT -->
<!-- ═══════════════════════════════════════════════════════ -->

<h2 id="browser-support">🌐 Browser Support</h2>

<ul>
<li><strong>Chrome</strong> 105+</li>
<li><strong>Edge</strong> 105+</li>
<li><strong>Safari</strong> 16+</li>
<li><strong>Firefox</strong> 121+</li>
</ul>

<p>Uses modern CSS: <code>:has()</code>, container queries, <code>color-mix()</code>, <code>oklch()</code>,<br>
<code>@layer</code>, <code>prefers-reduced-data</code>, <code>prefers-reduced-transparency</code>.</p>

<p><strong>Progressive enhancement</strong> — older browsers ignore what they don't understand, and your site still works.</p>

<hr>

<!-- ═══════════════════════════════════════════════════════ -->
<!-- ROADMAP -->
<!-- ═══════════════════════════════════════════════════════ -->

<h2 id="roadmap">🗺️ Roadmap</h2>

<h3>✅ v1.4 — Current</h3>
<ul>
<li>225+ semantic primitives</li>
<li>5000+ utilities generated</li>
<li>343 poetic palette shades</li>
<li>Automatic dark mode</li>
<li>Persistent cross-process cache</li>
<li>Full CLI (build, watch, preview, benchmark, analyze, doctor)</li>
<li><strong>Indian signature intent layer</strong> (namaste, lotus, diya, chakra)</li>
</ul>

<h3>🚧 v1.5 — Next</h3>
<ul>
<li>[ ] Cross-platform binaries (macOS ARM/Intel, Windows x64)</li>
<li>[ ] VS Code extension (IntelliSense, autocomplete, hover docs)</li>
<li>[ ] Prettier plugin (class sorting)</li>
<li>[ ] Container query primitives</li>
</ul>

<h3>🔮 v2.0 — Future</h3>
<ul>
<li>[ ] <code>garur-ui</code> — copy-paste component library</li>
<li>[ ] Framework integrations (Next.js, Astro, SvelteKit starters)</li>
<li>[ ] Figma plugin</li>
<li>[ ] Web-based playground</li>
</ul>

<hr>

<!-- ═══════════════════════════════════════════════════════ -->
<!-- CONTRIBUTING -->
<!-- ═══════════════════════════════════════════════════════ -->

<h2 id="contributing">🤝 Contributing</h2>

<p><strong>Garur is young. It needs you.</strong></p>

<pre><code># Clone
git clone https://github.com/barshansarkar/Garursaili-CSS
cd Garursaili-CSS

# Build Rust engine
cd rust &amp;&amp; cargo build --release &amp;&amp; cd ..

# Install Node deps
npm install

# Build CSS
npx tsx src/cli.ts</code></pre>

<p><strong>Ways to contribute:</strong></p>
<ul>
<li>🐛 Report bugs</li>
<li>💡 Suggest primitives or utilities</li>
<li>📖 Improve documentation</li>
<li>🎨 Share showcase pages</li>
<li>⚡ Optimize the Rust engine</li>
<li>🌍 Add translations</li>
<li>🎯 Port to other languages / ecosystems</li>
</ul>

<p><strong>Before you PR:</strong> Run <code>cargo fmt</code> and <code>cargo test</code>.</p>

<hr>

<!-- ═══════════════════════════════════════════════════════ -->
<!-- SEO KEYWORDS -->
<!-- ═══════════════════════════════════════════════════════ -->

<h2 id="seo">🔍 SEO Keywords</h2>

<p><sub>
CSS framework India · Indian CSS framework · Rust CSS engine · Rust CSS framework · semantic CSS framework ·
atomic CSS India · first Indian CSS framework · made in India CSS · Barshan Sarkar CSS ·
GarurSaili CSS · garur css · saili css · Garur framework · Malda West Bengal developer ·
napi-rs CSS · fast CSS compiler · Rust atomic CSS · semantic utility CSS ·
hybrid CSS framework · primitive CSS · utility CSS India · CSS for Indian developers ·
best CSS framework 2024 · fastest CSS build · zero config CSS · dark mode CSS framework ·
OKLCH palette · Indian color names · poetic CSS palette · semantic primitives ·
Indian web framework · desi CSS · swadeshi CSS framework · India-made developer tool ·
open source India · MIT licensed CSS · free CSS framework
</sub></p>

<hr>

<!-- ═══════════════════════════════════════════════════════ -->
<!-- LICENSE -->
<!-- ═══════════════════════════════════════════════════════ -->

<h2 id="license">📄 License</h2>

<p><strong>MIT</strong> © <a href="https://github.com/barshansarkar">Barshan Sarkar</a></p>

<p>Free for personal and commercial use.<br>
No attribution required (but always appreciated).</p>

<hr>

<!-- ═══════════════════════════════════════════════════════ -->
<!-- FOOTER -->
<!-- ═══════════════════════════════════════════════════════ -->

<div class="footer">

<h3>🦅 <strong>Garur means "teacher" in Bengali.</strong></h3>

<p>
Every CSS framework teaches you what to build.<br>
<strong>Garur teaches you what to <em>mean</em>.</strong>
</p>

<p>
<a href="#install">Get Started</a> · 
<a href="#primitives">Read the Primitives</a> · 
<a href="https://github.com/barshansarkar/Garursaili-CSS">Star on GitHub</a>
</p>

<p style="margin-top: 2rem;">
<strong>Made with 💜 and 🦀 in Malda, West Bengal, India 🇮🇳</strong>
</p>

<p><em>"The first Indian CSS framework. Built for the world, rooted in home."</em></p>

<p style="margin-top: 1.5rem;">
<img src="https://img.shields.io/npm/v/garursaili-css?color=8657f7&logo=npm" alt="npm">
<img src="https://img.shields.io/github/stars/barshansarkar/Garursaili-CSS?color=e54cb5&logo=github" alt="GitHub stars">
<img src="https://img.shields.io/badge/Made%20in-India%20🇮🇳-ff9933?labelColor=138808" alt="Made in India">
</p>

</div>

</body>
</html>
