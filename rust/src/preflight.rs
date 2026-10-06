// ═══════════════════════════════════════════════════════════════════
// Garur Preflight v3 — Original design
// Author: Barshan Sarkar
// ═══════════════════════════════════════════════════════════════════
//
// Philosophy: capability-detected, accessible-by-default, cascade-first.
//
// Unique to Garur (not found in Tailwind/Bootstrap/UnoCSS):
//   • Runtime theme tokens (--garur-*)
//   • prefers-reduced-data    — data-saver mode
//   • prefers-reduced-transparency — low-vision friendly
//   • GPU-accelerated animation defaults
//   • Auto dark-mode form controls (opt-in)
//   • Layered output with @layer cascade
// ═══════════════════════════════════════════════════════════════════

use once_cell::sync::OnceCell;
use std::sync::{Arc, Mutex};

// ───────────────────────────────────────────────
// Options
// ───────────────────────────────────────────────

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct PreflightOptions {
    pub reset: bool,
    pub typography: bool,
    pub forms: bool,
    pub a11y: bool,
    pub modern: bool,
    pub print: bool,
    pub dark_auto: bool,
    pub scrollbar_gutter: bool,
    pub runtime_theme: bool,
    pub perf_animation: bool,
    pub reduced_data: bool,
    pub reduced_transparency: bool,
    pub auto_dark_controls: bool,
}

impl Default for PreflightOptions {
    fn default() -> Self {
        Self {
            reset: true,
            typography: true,
            forms: true,
            a11y: true,
            modern: true,
            print: false,
            dark_auto: false,
            scrollbar_gutter: true,
            runtime_theme: true,
            perf_animation: true,
            reduced_data: true,
            reduced_transparency: true,
            auto_dark_controls: false,
        }
    }
}

// ───────────────────────────────────────────────
// Layer declaration
// ───────────────────────────────────────────────

pub const LAYER_DECL: &str =
    "@layer garur-tokens, garur-reset, garur-elements, garur-forms, garur-motion, garur-utils;";

// ───────────────────────────────────────────────
// SECTION: Runtime design tokens
// ───────────────────────────────────────────────

const TOKENS: &str = r##"

/* ── Garur runtime design tokens ──
   Override these on :root to retheme the whole stylesheet. */
:root {
  --garur-border: currentColor;
  --garur-radius: 0.5rem;
  --garur-focus-color: currentColor;
  --garur-focus-width: 2px;
  --garur-focus-offset: 2px;
  --garur-selection-bg: highlight;
  --garur-selection-fg: highlighttext;
  --garur-mark-bg: mark;
  --garur-mark-fg: inherit;
  --garur-disabled-opacity: 0.5;
  --garur-scrollbar-thumb: rgb(0 0 0 / 0.25);
  --garur-scrollbar-track: transparent;
  --garur-placeholder: color-mix(in oklab, currentColor 50%, transparent);
  --garur-smooth-scroll: auto;

  /* ── Semantic colors ── */
  --garur-primary:    #8657f7;
  --garur-secondary:  #647490;
  --garur-success:    #26944c;
  --garur-danger:     #d12a3d;
  --garur-warning:    #f59e00;
  --garur-info:       #1a8ade;
  --garur-accent:     #e54cb5;
  --garur-muted:      #6f7780;

  --garur-primary-fg:   #ffffff;
  --garur-secondary-fg: #ffffff;
  --garur-success-fg:   #ffffff;
  --garur-danger-fg:    #ffffff;
  --garur-warning-fg:   #1e1e1e;
  --garur-info-fg:      #ffffff;
  --garur-accent-fg:    #ffffff;
  --garur-muted-fg:     #ffffff;

  /* ── Surface & foreground ── */
  --garur-surface: #ffffff;
  --garur-surface-muted: #f5f5f5;
  --garur-fg: #1a1a1a;
  --garur-subtle: #94a3b8;
  --garur-hint: #cbd5e1;
  --garur-border-subtle: rgb(0 0 0 / 0.1);

  /* ── Radius scale ── */
  --garur-radius-lg: 0.75rem;
  --garur-radius-xl: 1rem;

  /* ── Shadow scale ── */
  --garur-shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --garur-shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --garur-shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --garur-shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --garur-shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  --garur-shadow-inner: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
  --garur-shadow-ring: 0 0 0 3px color-mix(in oklab, var(--garur-primary) 20%, transparent);

  /* ── Component sizing ── */
  --garur-card-p: 1.5rem;
  --garur-btn-py: 0.5rem;
  --garur-btn-px: 1rem;
  --garur-btn-fs: 0.875rem;
  --garur-input-py: 0.5rem;
  --garur-input-px: 0.75rem;
  --garur-input-fs: 0.875rem;

  /* ── Focus ring ── */
  --garur-ring-color: var(--garur-primary);

  /* ── Layout ── */
  --garur-container-px: 1rem;
  --garur-container-max: 1280px;
  --garur-section-py: 5rem;
  --garur-hero-py: 6rem;
  --garur-navbar-py: 0.75rem;
  --garur-grid-min: 16rem;
  --garur-gap: 1rem;
}

:root.dark,
:root[data-theme="dark"] {
  --garur-border: rgb(255 255 255 / 0.15);
  --garur-scrollbar-thumb: rgb(255 255 255 / 0.3);
  --garur-disabled-opacity: 0.4;

  --garur-surface: #1e1e1e;
  --garur-surface-muted: #2a2a2a;
  --garur-fg: #f5f5f5;
  --garur-subtle: #64748b;
  --garur-hint: #475569;
  --garur-muted: #9ca3af;
  --garur-border-subtle: rgb(255 255 255 / 0.1);

  --garur-shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.4);
  --garur-shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.5);
  --garur-shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.5);
  --garur-shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.6);
  --garur-shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.7);
  --garur-shadow-inner: inset 0 2px 4px 0 rgb(0 0 0 / 0.4);
}
"##;

// ───────────────────────────────────────────────
// SECTION: Universal reset
// ───────────────────────────────────────────────

const RESET: &str = r##"

/* ── Universal box model ── */
*,
*::before,
*::after,
::backdrop,
::file-selector-button {
  box-sizing: border-box;
  min-width: 0;
  border: 0 solid;
}

/* ── Root defaults ── */
:root,
:host {
  margin: 0;
  padding: 0;
  line-height: 1.5;
  text-size-adjust: 100%;
  -webkit-tap-highlight-color: transparent;
  text-rendering: optimizeLegibility;
  font-synthesis: none;
}

/* ── Scrollbar stability (capability-detected) ── */
@supports (scrollbar-gutter: stable) {
  :root {
    scrollbar-gutter: stable;
  }
}
"##;

// ───────────────────────────────────────────────
// SECTION: Typography
// ───────────────────────────────────────────────

const TYPOGRAPHY: &str = r##"

/* ── Headings ── */
:where(h1, h2, h3, h4, h5, h6) {
  font-size: inherit;
  font-weight: inherit;
  text-wrap: balance;
  line-height: 1.2;
}

/* ── Text blocks ── */
:where(p, li, figcaption, dd, dt) {
  text-wrap: pretty;
}

/* ── Anchors ── */
:where(a) {
  color: inherit;
  text-decoration: inherit;
}

/* ── Emphasis ── */
:where(b, strong) { font-weight: 600; }
:where(i, em, cite, dfn, var) { font-style: italic; }
:where(s, del, strike) { text-decoration: line-through; }
:where(u, ins) { text-decoration: underline; }

/* ── Code ── */
:where(code, kbd, samp, pre) {
  font-family: var(--garur-font-mono,
    ui-monospace, "SF Mono", Menlo, Monaco, "Cascadia Mono",
    "Liberation Mono", "Courier New", monospace);
  font-size: 1em;
  font-feature-settings: "liga" 0;
}

/* ── Small / sub / sup ── */
:where(small) { font-size: 80%; }
:where(sub, sup) {
  font-size: 80%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}
:where(sub) { inset-block-end: -0.25em; }
:where(sup) { inset-block-start: -0.5em; }

/* ── Dividers ── */
:where(hr) {
  height: 0;
  color: inherit;
  border-block-start: 1px solid currentColor;
  opacity: 0.2;
}

/* ── Abbreviations ── */
:where(abbr[title]) {
  text-decoration: underline dotted;
  cursor: help;
}

/* ── Mark ── */
:where(mark) {
  background-color: var(--garur-mark-bg);
  color: var(--garur-mark-fg);
}

/* ── Tables ── */
:where(table) {
  text-indent: 0;
  border-color: inherit;
  border-collapse: collapse;
  border-spacing: 0;
}

/* ── Lists — preserved by default, nav-cleanup automatic ── */
:where(menu, ol, ul) {
  padding-inline-start: 1.5em;
}
:where(nav, [role="navigation"]) :where(menu, ol, ul) {
  padding-inline-start: 0;
  list-style: none;
}

/* ── Media ── */
:where(img, svg, video, canvas, audio, iframe, embed, object, picture) {
  display: block;
  max-inline-size: 100%;
  block-size: auto;
}
:where(video) { object-fit: cover; }

/* ── Figure / Blockquote / Pre ── */
:where(figure) { margin: 0; }
:where(figcaption) { font-size: 0.875em; opacity: 0.75; }
:where(blockquote) {
  margin: 0;
  padding-inline-start: 1rem;
  border-inline-start: 3px solid var(--garur-border);
}
:where(pre) {
  overflow: auto;
  padding: 1rem;
  border-radius: var(--garur-radius);
  background: color-mix(in oklab, currentColor 5%, transparent);
}
"##;

// ───────────────────────────────────────────────
// SECTION: Forms
// ───────────────────────────────────────────────

const FORMS: &str = r##"

/* ── Universal control ── */
:where(button, input, select, optgroup, textarea, ::file-selector-button) {
  font: inherit;
  color: inherit;
  letter-spacing: inherit;
  background: transparent;
  border-radius: 0;
  opacity: 1;
}

/* ── Text inputs ── */
:where(input, textarea) {
  appearance: none;
  min-width: 0;
}

:where(textarea) {
  resize: vertical;
  field-sizing: content;
  min-block-size: 2lh;
}

/* ── Select ── */
:where(select) {
  appearance: auto;
  background: Canvas;
  color: CanvasText;
}

/* ── Button ── */
:where(button) {
  appearance: none;
  cursor: pointer;
  user-select: none;
}

/* ── File button ── */
:where(::file-selector-button) {
  margin-inline-end: 4px;
  padding: 0.25em 0.5em;
  border-radius: var(--garur-radius);
}

/* ── Placeholder ── */
:where(::placeholder) {
  color: var(--garur-placeholder);
  opacity: 1;
}

/* ── Webkit / Blink internals ── */
:where(input[type="search"]) {
  -webkit-appearance: textfield;
}
:where(::-webkit-search-cancel-button),
:where(::-webkit-search-decoration) {
  -webkit-appearance: none;
}
:where(::-webkit-inner-spin-button),
:where(::-webkit-outer-spin-button) {
  height: auto;
}
:where(::-webkit-calendar-picker-indicator) { line-height: 1; }
:where(::-webkit-date-and-time-value) { text-align: inherit; }

/* ── Disabled state (Garur-only) ── */
:where([disabled], [aria-disabled="true"]) {
  opacity: var(--garur-disabled-opacity);
  cursor: not-allowed;
  pointer-events: none;
}
"##;

// ───────────────────────────────────────────────
// SECTION: Accessibility + motion
// ───────────────────────────────────────────────

const A11Y: &str = r##"

/* ── Default accessible focus ring ── */
:where(:focus-visible) {
  outline: var(--garur-focus-width) solid var(--garur-focus-color);
  outline-offset: var(--garur-focus-offset);
}
:where(:focus:not(:focus-visible)) { outline: none; }

/* ── Reduced motion ── */
@media (prefers-reduced-motion: reduce) {
  :where(*),
  :where(*::before),
  :where(*::after) {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* ── High contrast ── */
@media (prefers-contrast: more) {
  :root {
    --garur-focus-width: 3px;
    --garur-border: CanvasText;
  }
}

/* ── Forced colors (Windows High Contrast) ── */
@media (forced-colors: active) {
  :where(:focus-visible) {
    outline: 2px solid Highlight;
  }
  :where(dialog, [popover]) {
    border: 1px solid CanvasText;
  }
}

/* ── Opt-in smooth scroll ── */
@media (prefers-reduced-motion: no-preference) {
  :where([data-garur-motion="smooth"]) {
    scroll-behavior: smooth;
  }
}

/* ── Hidden elements ── */
:where([hidden]:not([hidden="until-found"])) {
  display: none !important;
}
"##;

// ───────────────────────────────────────────────
// SECTION: Modern HTML elements
// ───────────────────────────────────────────────

const MODERN: &str = r##"

/* ── Dialog ── */
:where(dialog) {
  margin: auto;
  padding: 1.25rem;
  max-inline-size: min(90ch, 90vw);
  max-block-size: 85vh;
  overflow: auto;
  border: 1px solid var(--garur-border);
  border-radius: var(--garur-radius);
  background: Canvas;
  color: CanvasText;
}
:where(dialog)::backdrop {
  background: rgb(0 0 0 / 0.5);
}

/* ── Popover ── */
:where([popover]) {
  margin: auto;
  padding: 0.75rem 1rem;
  border: 1px solid var(--garur-border);
  border-radius: var(--garur-radius);
  background: Canvas;
  color: CanvasText;
}
:where([popover])::backdrop {
  background: rgb(0 0 0 / 0.15);
}

/* ── Details / summary ── */
:where(details) > :where(summary) {
  cursor: pointer;
  user-select: none;
  list-style: none;
}
:where(details) > :where(summary)::-webkit-details-marker {
  display: none;
}
:where(details) > :where(summary)::marker {
  content: "";
}

/* ── Selection ── */
:where(::selection) {
  background-color: var(--garur-selection-bg);
  color: var(--garur-selection-fg);
}

/* ── Find-in-page highlight ── */
:where(::target-text) {
  background-color: highlight;
  color: highlighttext;
}

/* ── Meter / progress ── */
:where(meter, progress) {
  vertical-align: baseline;
  inline-size: 100%;
  block-size: 0.75rem;
  border: none;
  border-radius: var(--garur-radius);
  overflow: hidden;
}

/* ── Fieldset / legend ── */
:where(fieldset) {
  border: 1px solid var(--garur-border);
  border-radius: var(--garur-radius);
  padding: 0.75rem 1rem;
}
:where(legend) {
  padding-inline: 0.5rem;
  font-weight: 600;
}
"##;

// ───────────────────────────────────────────────
// SECTION: Performance animation hints (Garur-unique)
// ───────────────────────────────────────────────

const PERF_ANIMATION: &str = r##"

/* ── GPU-accelerated animation defaults ──
   Elements declaring animation/transition utilities get a
   composited layer hint, so the browser doesn't repaint on
   every frame. Reverted automatically when motion is reduced. */
:where([class*="animate-"], [class*="transition-"], [data-garur-animate]) {
  backface-visibility: hidden;
  transform: translateZ(0);
}

:where([class*="animate-"]) {
  will-change: transform, opacity;
}

@media (prefers-reduced-motion: reduce) {
  :where([class*="animate-"], [class*="transition-"]) {
    will-change: auto;
    transform: none;
  }
}
"##;

// ───────────────────────────────────────────────
// SECTION: Reduced data (Garur-unique)
// ───────────────────────────────────────────────

const REDUCED_DATA: &str = r##"

/* ── Data-saver mode ──
   Respects prefers-reduced-data: reduce (Chrome 115+, Edge 115+).
   Disables animations, background images, and heavy rendering. */
@media (prefers-reduced-data: reduce) {
  :where(*),
  :where(*::before),
  :where(*::after) {
    animation: none !important;
    transition: none !important;
    background-image: none !important;
  }
  :where(img, video) {
    image-rendering: pixelated;
  }
}
"##;

// ───────────────────────────────────────────────
// SECTION: Reduced transparency (Garur-unique)
// ───────────────────────────────────────────────

const REDUCED_TRANSPARENCY: &str = r##"

/* ── Low-vision friendly ──
   Respects prefers-reduced-transparency: reduce
   (Safari 17+, Chrome 118+). Replaces translucent
   surfaces with solid equivalents. */
@media (prefers-reduced-transparency: reduce) {
  :where(*) {
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
  }
  :where(dialog)::backdrop {
    background: rgb(0 0 0 / 0.75) !important;
  }
  :where([popover])::backdrop {
    background: rgb(0 0 0 / 0.4) !important;
  }
}
"##;

// ───────────────────────────────────────────────
// SECTION: Auto dark mode controls (opt-in, Garur-unique)
// ───────────────────────────────────────────────

const AUTO_DARK_CONTROLS: &str = r##"

/* ── Automatic dark-mode form controls ──
   When the OS prefers dark, native form controls adapt
   automatically without any utility classes needed.
   Opt-in via `auto_dark_controls: true`. */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    color-scheme: dark;
  }
  :root:not([data-theme="light"]) :where(input, textarea, select) {
    background-color: color-mix(in oklab, CanvasText 5%, transparent);
  }
  :root:not([data-theme="light"]) :where(::placeholder) {
    color: color-mix(in oklab, CanvasText 40%, transparent);
  }
}
"##;

// ───────────────────────────────────────────────
// SECTION: Global color-scheme (opt-in)
// ───────────────────────────────────────────────

const DARK_AUTO: &str = r##"

/* ── Native color-scheme opt-in ──
   Enables OS-level dark styling for scrollbars,
   form controls, and default UI. */
:root {
  color-scheme: light dark;
}
"##;

// ───────────────────────────────────────────────
// SECTION: Print
// ───────────────────────────────────────────────

const PRINT: &str = r##"

@media print {
  :where(:root) {
    color-scheme: only light;
  }

  :where(body) {
    background: white;
    color: black;
  }

  :where(a[href])::after {
    content: " (" attr(href) ")";
    font-size: 0.85em;
    color: inherit;
    opacity: 0.7;
  }

  :where(abbr[title])::after {
    content: " (" attr(title) ")";
  }

  :where(pre, blockquote, tr, img, figure) {
    page-break-inside: avoid;
  }

  :where(h1, h2, h3, h4, h5, h6) {
    page-break-after: avoid;
    page-break-inside: avoid;
  }

  :where(thead) {
    display: table-header-group;
  }

  @page {
    margin: 1cm;
  }
}
"##;

// ───────────────────────────────────────────────
// Cache
// ───────────────────────────────────────────────

type CacheSlot = Mutex<Option<(PreflightOptions, Arc<str>)>>;
static CACHE: OnceCell<CacheSlot> = OnceCell::new();

#[inline]
fn slot() -> &'static CacheSlot {
    CACHE.get_or_init(|| Mutex::new(None))
}

// ───────────────────────────────────────────────
// Public API
// ───────────────────────────────────────────────

/// Build preflight CSS for the given options (cached by option set).
pub fn build_preflight(opts: PreflightOptions) -> Arc<str> {
    let cell = slot();
    let mut guard = match cell.lock() {
        Ok(g) => g,
        Err(poisoned) => poisoned.into_inner(),
    };

    if let Some((cached_opts, cached_css)) = guard.as_ref() {
        if *cached_opts == opts {
            return Arc::clone(cached_css);
        }
    }

    let css = assemble(opts);
    let arc: Arc<str> = Arc::from(css);
    *guard = Some((opts, Arc::clone(&arc)));
    arc
}

/// Default preflight as `String` (backward-compatible).
pub fn preflight() -> String {
    build_preflight(PreflightOptions::default())
        .as_ref()
        .to_string()
}

/// Default preflight as `Arc<str>` — for hot paths.
pub fn preflight_arc() -> Arc<str> {
    build_preflight(PreflightOptions::default())
}

/// Clear the cached preflight. Call after config change.
pub fn clear_cache() {
    if let Some(cell) = CACHE.get() {
        if let Ok(mut g) = cell.lock() {
            *g = None;
        }
    }
}

#[inline]
pub fn layer() -> &'static str {
    LAYER_DECL
}

#[inline]
pub fn properties() -> &'static str {
    // Garur uses runtime tokens instead of @property-heavy registration.
    // This hook remains for backward compatibility.
    ""
}

// ───────────────────────────────────────────────
// Assembly
// ───────────────────────────────────────────────

fn assemble(opts: PreflightOptions) -> String {
    let mut out = String::with_capacity(9_500);

    // Layer order must be first.
    out.push_str(LAYER_DECL);
    out.push('\n');

    // @layer garur-tokens
    if opts.runtime_theme || opts.dark_auto {
        out.push_str("\n@layer garur-tokens {\n");
        if opts.runtime_theme {
            out.push_str(TOKENS);
        }
        if opts.dark_auto {
            out.push_str(DARK_AUTO);
        }
        out.push_str("\n}\n");
    }

    // @layer garur-reset
    if opts.reset {
        out.push_str("\n@layer garur-reset {\n");
        out.push_str(RESET);
        out.push_str("\n}\n");
    }

    // @layer garur-elements
    let any_elements = opts.typography || opts.modern;
    if any_elements {
        out.push_str("\n@layer garur-elements {\n");
        if opts.typography {
            out.push_str(TYPOGRAPHY);
        }
        if opts.modern {
            out.push_str(MODERN);
        }
        out.push_str("\n}\n");
    }

    // @layer garur-forms
    if opts.forms {
        out.push_str("\n@layer garur-forms {\n");
        out.push_str(FORMS);
        out.push_str("\n}\n");
    }

    // @layer garur-motion (a11y + perf + reduced-data/transparency)
    let any_motion = opts.a11y
        || opts.perf_animation
        || opts.reduced_data
        || opts.reduced_transparency
        || opts.auto_dark_controls;

    if any_motion {
        out.push_str("\n@layer garur-motion {\n");
        if opts.a11y {
            out.push_str(A11Y);
        }
        if opts.perf_animation {
            out.push_str(PERF_ANIMATION);
        }
        if opts.reduced_data {
            out.push_str(REDUCED_DATA);
        }
        if opts.reduced_transparency {
            out.push_str(REDUCED_TRANSPARENCY);
        }
        if opts.auto_dark_controls {
            out.push_str(AUTO_DARK_CONTROLS);
        }
        out.push_str("\n}\n");
    }

    // @layer garur-utils (print, no utility generation here)
    if opts.print {
        out.push_str("\n@layer garur-utils {\n");
        out.push_str(PRINT);
        out.push_str("\n}\n");
    }

    out
}

// ───────────────────────────────────────────────
// Tests
// ───────────────────────────────────────────────

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn default_contains_all_core_sections() {
        let css = build_preflight(PreflightOptions::default());
        assert!(css.contains("@layer garur-tokens"));
        assert!(css.contains("box-sizing: border-box"));
        assert!(css.contains(":focus-visible"));
        assert!(css.contains("dialog"));
        assert!(css.contains("prefers-reduced-data"));
        assert!(css.contains("prefers-reduced-transparency"));
        assert!(css.contains("backface-visibility"));
        assert!(!css.contains("@media print"), "print should be off by default");
        assert!(!css.contains("color-scheme: light dark"), "dark_auto should be off");
    }

    #[test]
    fn print_is_opt_in() {
        let opts = PreflightOptions { print: true, ..Default::default() };
        let css = build_preflight(opts);
        assert!(css.contains("@media print"));
        assert!(css.contains("attr(href)"));
    }

    #[test]
    fn dark_auto_opt_in() {
        let opts = PreflightOptions { dark_auto: true, ..Default::default() };
        let css = build_preflight(opts);
        assert!(css.contains("color-scheme: light dark"));
    }

    #[test]
    fn auto_dark_controls_opt_in() {
        let opts = PreflightOptions { auto_dark_controls: true, ..Default::default() };
        let css = build_preflight(opts);
        assert!(css.contains("prefers-color-scheme: dark"));
        assert!(css.contains("CanvasText"));
    }

    #[test]
    fn minimal_mode() {
        let opts = PreflightOptions {
            reset: false,
            typography: false,
            forms: false,
            a11y: false,
            modern: false,
            print: false,
            dark_auto: false,
            scrollbar_gutter: false,
            runtime_theme: false,
            perf_animation: false,
            reduced_data: false,
            reduced_transparency: false,
            auto_dark_controls: false,
        };
        let css = build_preflight(opts);
        // Only layer decl remains
        assert!(css.contains("@layer garur-tokens"));
        assert!(!css.contains("box-sizing"));
        assert!(!css.contains(":focus-visible"));
    }

    #[test]
    fn cache_differentiates_options() {
        let a = build_preflight(PreflightOptions::default());
        let b = build_preflight(PreflightOptions { print: true, ..Default::default() });
        assert_ne!(a.as_ref(), b.as_ref());
    }

    #[test]
    fn cache_returns_same_arc() {
        let opts = PreflightOptions::default();
        let a = build_preflight(opts);
        let b = build_preflight(opts);
        assert!(Arc::ptr_eq(&a, &b));
    }

    #[test]
    fn clear_cache_works() {
        let opts = PreflightOptions::default();
        let a = build_preflight(opts);
        clear_cache();
        let b = build_preflight(opts);
        assert_eq!(a.as_ref(), b.as_ref());
    }

    #[test]
    fn layer_and_properties_constants() {
        assert!(layer().contains("@layer"));
    }
}