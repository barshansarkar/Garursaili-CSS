// ═══════════════════════════════════════════════════════════════════
// Preflight v2 — production-ready, configurable, cached
// ═══════════════════════════════════════════════════════════════════
//
// Design
// ──────
// • Sections are static `&'static str` → zero-parse-cost
// • Assembled once per unique option set, cached as `Arc<str>`
// • Backward-compatible: `preflight()`, `layer()`, `properties()`
// • Thread-safe: OnceCell + Mutex, poison-recovery
//
// Layout
// ──────
// LAYER_DECL               — @layer order (must come first)
// PROPERTY_DECLS           — @property registrations
// @layer garur-base        — resets + typography + forms + a11y + modern
// @layer garur-overrides   — print (opt-in)
// ═══════════════════════════════════════════════════════════════════

use once_cell::sync::OnceCell;
use std::sync::{Arc, Mutex};

// ───────────────────────────────────────────────
// Options
// ───────────────────────────────────────────────

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct PreflightOptions {
    /// Global box-sizing / margin / padding reset.  (default: true)
    pub reset: bool,
    /// Headings, code, lists, media defaults.        (default: true)
    pub typography: bool,
    /// Input / button / select normalization.        (default: true)
    pub forms: bool,
    /// `:focus-visible`, reduced-motion, forced-colors. (default: true)
    pub a11y: bool,
    /// dialog, popover, details, field-sizing.       (default: true)
    pub modern: bool,
    /// Print reset.                                  (default: false — opt-in)
    pub print: bool,
    /// `color-scheme: light dark` native dark controls. (default: true)
    pub dark_auto: bool,
    /// `scrollbar-gutter: stable` (prevents layout shift). (default: true)
    pub scrollbar_gutter: bool,
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
            dark_auto: true,
            scrollbar_gutter: true,
        }
    }
}

// ───────────────────────────────────────────────
// Layer + @property registrations
// ───────────────────────────────────────────────

pub const LAYER_DECL: &str =
    "@layer garur-theme, garur-base, garur-components, garur-utilities, garur-overrides;";

pub const PROPERTY_DECLS: &str = r##"@property --garur-ring-width       { syntax: "<length>";           inherits: false; initial-value: 0px; }
@property --garur-ring-offset-width  { syntax: "<length>";           inherits: false; initial-value: 0px; }
@property --garur-ring-offset-color  { syntax: "<color>";            inherits: false; initial-value: #fff; }
@property --garur-ring-color         { syntax: "<color>";            inherits: false; initial-value: currentColor; }
@property --garur-rotate             { syntax: "<angle>";            inherits: false; initial-value: 0deg; }
@property --garur-rotate-x           { syntax: "<angle>";            inherits: false; initial-value: 0deg; }
@property --garur-rotate-y           { syntax: "<angle>";            inherits: false; initial-value: 0deg; }
@property --garur-scale-x            { syntax: "<number>";           inherits: false; initial-value: 1; }
@property --garur-scale-y            { syntax: "<number>";           inherits: false; initial-value: 1; }
@property --garur-scale-z            { syntax: "<number>";           inherits: false; initial-value: 1; }
@property --garur-translate-x        { syntax: "<length-percentage>"; inherits: false; initial-value: 0px; }
@property --garur-translate-y        { syntax: "<length-percentage>"; inherits: false; initial-value: 0px; }
@property --garur-translate-z        { syntax: "<length>";           inherits: false; initial-value: 0px; }
@property --garur-skew-x             { syntax: "<angle>";            inherits: false; initial-value: 0deg; }
@property --garur-skew-y             { syntax: "<angle>";            inherits: false; initial-value: 0deg; }
@property --garur-blur               { syntax: "<length>";           inherits: false; initial-value: 0px; }
@property --garur-brightness         { syntax: "<number>";           inherits: false; initial-value: 1; }
@property --garur-contrast           { syntax: "<number>";           inherits: false; initial-value: 1; }
@property --garur-saturate           { syntax: "<number>";           inherits: false; initial-value: 1; }
@property --garur-hue-rotate         { syntax: "<angle>";            inherits: false; initial-value: 0deg; }
@property --garur-grayscale          { syntax: "<number>";           inherits: false; initial-value: 0; }
@property --garur-invert             { syntax: "<number>";           inherits: false; initial-value: 0; }
@property --garur-sepia              { syntax: "<number>";           inherits: false; initial-value: 0; }
@property --garur-space-x-reverse    { syntax: "<number>";           inherits: false; initial-value: 0; }
@property --garur-space-y-reverse    { syntax: "<number>";           inherits: false; initial-value: 0; }
@property --garur-divide-x-reverse   { syntax: "<number>";           inherits: false; initial-value: 0; }
@property --garur-divide-y-reverse   { syntax: "<number>";           inherits: false; initial-value: 0; }
@property --garur-gradient-from      { syntax: "<color>";            inherits: false; initial-value: transparent; }
@property --garur-gradient-via       { syntax: "<color>";            inherits: false; initial-value: transparent; }
@property --garur-gradient-to        { syntax: "<color>";            inherits: false; initial-value: transparent; }
@property --garur-gradient-interpolation { syntax: "*";              inherits: false; }
@property --garur-text-shadow-color  { syntax: "<color>";            inherits: false; initial-value: rgb(0 0 0 / 0.1); }
@property --garur-focus-color        { syntax: "<color>";            inherits: false; initial-value: currentColor; }
@property --garur-focus-width        { syntax: "<length>";           inherits: false; initial-value: 2px; }
@property --garur-focus-offset       { syntax: "<length>";           inherits: false; initial-value: 2px; }
@property --garur-scrollbar-thumb    { syntax: "<color>";            inherits: false; initial-value: rgb(0 0 0 / 0.25); }
@property --garur-scrollbar-track    { syntax: "<color>";            inherits: false; initial-value: transparent; }
"##;

// ───────────────────────────────────────────────
// Sections
// ───────────────────────────────────────────────

const SEC_RESET: &str = r##"

*, ::before, ::after, ::backdrop, ::file-selector-button {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  border: 0 solid;
}

html, :host {
  line-height: 1.5;
  -webkit-text-size-adjust: 100%;
  -moz-tab-size: 4;
  tab-size: 4;
  -webkit-tap-highlight-color: transparent;
  text-rendering: optimizeLegibility;
}
"##;

const SEC_SCROLLBAR_GUTTER: &str = r##"

@supports (scrollbar-gutter: stable) {
  html { scrollbar-gutter: stable; }
}
"##;

const SEC_DARK_AUTO: &str = r##"

:root {
  color-scheme: light dark;
  accent-color: auto;
}

@media (prefers-color-scheme: dark) {
  :root { color-scheme: dark; }
}
"##;

const SEC_TYPOGRAPHY: &str = r##"

hr {
  height: 0;
  color: inherit;
  border-block-start-width: 1px;
}

abbr:where([title]) {
  -webkit-text-decoration: underline dotted;
          text-decoration: underline dotted;
}

h1, h2, h3, h4, h5, h6 {
  font-size: inherit;
  font-weight: inherit;
  text-wrap: balance;
}

p, li, figcaption {
  text-wrap: pretty;
}

a {
  color: inherit;
  -webkit-text-decoration: inherit;
          text-decoration: inherit;
}

b, strong { font-weight: bolder; }

code, kbd, samp, pre {
  font-family: var(--garur-font-mono,
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace);
  font-feature-settings: var(--garur-font-mono-feature-settings, normal);
  font-variation-settings: var(--garur-font-mono-variation-settings, normal);
  font-size: 1em;
}

small { font-size: 80%; }

sub, sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}
sub { inset-block-end: -0.25em; }
sup { inset-block-start: -0.5em; }

mark {
  background-color: var(--garur-mark-bg, mark);
  color: var(--garur-mark-fg, inherit);
}

table {
  text-indent: 0;
  border-color: inherit;
  border-collapse: collapse;
  border-spacing: 0;
}

:where(ol, ul, menu) { list-style: none; }

img, svg, video, canvas, audio, iframe, embed, object {
  display: block;
  vertical-align: middle;
}

img, video {
  max-inline-size: 100%;
  block-size: auto;
}
"##;

const SEC_FORMS: &str = r##"

button, input, select, optgroup, textarea, ::file-selector-button {
  font: inherit;
  font-feature-settings: inherit;
  font-variation-settings: inherit;
  letter-spacing: inherit;
  color: inherit;
  border-radius: 0;
  background-color: transparent;
  opacity: 1;
}

:where(select:is([multiple], [size])) optgroup {
  font-weight: bolder;
}

:where(select:is([multiple], [size])) optgroup option {
  padding-inline-start: 20px;
}

::file-selector-button { margin-inline-end: 4px; }

::placeholder { opacity: 1; }

@supports (not (-webkit-appearance: -apple-pay-button))
       or (contain-intrinsic-size: 1px) {
  ::placeholder {
    color: color-mix(in oklab, currentColor 50%, transparent);
  }
}

@supports (field-sizing: content) {
  :where(textarea) {
    field-sizing: content;
    min-block-size: 3lh;
  }
}

textarea { resize: vertical; }

::-webkit-search-decoration { -webkit-appearance: none; }
::-webkit-date-and-time-value { min-height: 1lh; text-align: inherit; }
::-webkit-datetime-edit { display: inline-flex; }
::-webkit-datetime-edit-fields-wrapper { padding: 0; }

:where(
  ::-webkit-datetime-edit,
  ::-webkit-datetime-edit-year-field,
  ::-webkit-datetime-edit-month-field,
  ::-webkit-datetime-edit-day-field,
  ::-webkit-datetime-edit-hour-field,
  ::-webkit-datetime-edit-minute-field,
  ::-webkit-datetime-edit-second-field,
  ::-webkit-datetime-edit-millisecond-field,
  ::-webkit-datetime-edit-meridiem-field
) {
  padding-block: 0;
}

:-moz-ui-invalid { box-shadow: none; }

:where(
  button,
  input:where([type="button"], [type="reset"], [type="submit"]),
  ::file-selector-button
) {
  -webkit-appearance: button;
          appearance: button;
}

::-webkit-inner-spin-button,
::-webkit-outer-spin-button { height: auto; }

[type="search"] {
  -webkit-appearance: textfield;
  outline-offset: -2px;
}

::-webkit-search-cancel-button,
::-webkit-search-decoration,
::-webkit-search-results-button,
::-webkit-search-results-decoration { -webkit-appearance: none; }
"##;

const SEC_A11Y: &str = r##"

:focus-visible {
  outline: var(--garur-focus-width, 2px) solid var(--garur-focus-color, currentColor);
  outline-offset: var(--garur-focus-offset, 2px);
}

:focus:not(:focus-visible) { outline: none; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

@media (prefers-contrast: more) {
  :root { --garur-focus-width: 3px; }
}

@media (forced-colors: active) {
  :focus-visible { outline: 2px solid Highlight; }
}

[hidden]:where(:not([hidden="until-found"])) {
  display: none !important;
}
"##;

const SEC_MODERN: &str = r##"

dialog {
  margin: auto;
  max-inline-size: min(90vw, 60ch);
  max-block-size: 85vh;
  overflow: auto;
  padding: 1rem;
  border: 1px solid var(--garur-border, currentColor);
  border-radius: var(--garur-radius, 0.5rem);
  background: Canvas;
  color: CanvasText;
}

dialog::backdrop {
  background: rgb(0 0 0 / 0.5);
  backdrop-filter: blur(2px);
}

[popover] {
  margin: auto;
  padding: 0.75rem 1rem;
  border: 1px solid var(--garur-border, currentColor);
  border-radius: var(--garur-radius, 0.5rem);
  background: Canvas;
  color: CanvasText;
}

[popover]::backdrop {
  background: rgb(0 0 0 / 0.15);
}

details > summary {
  cursor: pointer;
  user-select: none;
  list-style: none;
}

details > summary::-webkit-details-marker { display: none; }
details > summary::marker { content: ""; }
details[open] > summary { margin-block-end: 0.5rem; }

::selection {
  background-color: var(--garur-selection-bg, highlight);
  color: var(--garur-selection-fg, highlighttext);
}

::target-text {
  background-color: var(--garur-target-bg, yellow);
  color: inherit;
}
"##;

// NOTE: must use r##"..."## — contains `"#` inside `[href^="#"]`
const SEC_PRINT: &str = r##"

@media print {
  *, *::before, *::after {
    background: transparent !important;
    color: black !important;
    box-shadow: none !important;
    text-shadow: none !important;
  }
  a, a:visited {
    text-decoration: underline;
  }
  a[href]::after {
    content: " (" attr(href) ")";
    font-size: 90%;
  }
  a[href^="#"]::after,
  a[href^="javascript:"]::after {
    content: "";
  }
  abbr[title]::after {
    content: " (" attr(title) ")";
  }
  pre, blockquote {
    border: 1px solid #999;
    page-break-inside: avoid;
  }
  thead { display: table-header-group; }
  tr, img { page-break-inside: avoid; }
  img { max-inline-size: 100% !important; }
  h2, h3 { page-break-after: avoid; }
  @page { margin: 0.5cm; }
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

/// Build preflight for a given option set. Cached across calls.
/// Returns `Arc<str>` — cheap to clone (no re-allocation).
pub fn build_preflight(opts: PreflightOptions) -> Arc<str> {
    let cell = slot();
    let mut guard = match cell.lock() {
        Ok(g) => g,
        Err(poisoned) => {
            // Another thread panicked while holding the lock.
            // Recover gracefully — don't cascade the panic.
            poisoned.into_inner()
        }
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

/// Default preflight — backward-compatible `String` return.
pub fn preflight() -> String {
    build_preflight(PreflightOptions::default())
        .as_ref()
        .to_string()
}

/// Default preflight as `Arc<str>` — for hot paths (finalize, caches).
pub fn preflight_arc() -> Arc<str> {
    build_preflight(PreflightOptions::default())
}

/// Reset the cache. Call after config change / hot-reload.
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
    PROPERTY_DECLS
}

// ───────────────────────────────────────────────
// Assembly
// ───────────────────────────────────────────────

fn assemble(opts: PreflightOptions) -> String {
    // Pre-size generously: worst case with print ~7 KB.
    let mut out = String::with_capacity(7_500);

    // 1) Layer order (must be first).
    out.push_str(LAYER_DECL);
    out.push_str("\n\n");

    // 2) Custom-property registrations.
    out.push_str(PROPERTY_DECLS);
    out.push('\n');

    // 3) Base layer.
    let any_base = opts.reset
        || opts.dark_auto
        || opts.typography
        || opts.forms
        || opts.a11y
        || opts.modern;

    if any_base {
        out.push_str("\n@layer garur-base {\n");

        if opts.reset {
            out.push_str(SEC_RESET);
            if opts.scrollbar_gutter {
                out.push_str(SEC_SCROLLBAR_GUTTER);
            }
        }
        if opts.dark_auto {
            out.push_str(SEC_DARK_AUTO);
        }
        if opts.typography {
            out.push_str(SEC_TYPOGRAPHY);
        }
        if opts.forms {
            out.push_str(SEC_FORMS);
        }
        if opts.a11y {
            out.push_str(SEC_A11Y);
        }
        if opts.modern {
            out.push_str(SEC_MODERN);
        }

        out.push_str("\n}\n");
    }

    // 4) Overrides layer (print).
    if opts.print {
        out.push_str("\n@layer garur-overrides {\n");
        out.push_str(SEC_PRINT);
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
    fn default_contains_core_sections() {
        let css = build_preflight(PreflightOptions::default());
        assert!(css.contains("box-sizing: border-box"),      "missing reset");
        assert!(css.contains("color-scheme: light dark"),    "missing dark_auto");
        assert!(css.contains(":focus-visible"),              "missing a11y");
        assert!(css.contains("dialog"),                      "missing modern");
        assert!(!css.contains("@media print"),               "print should be off");
    }

    #[test]
    fn print_is_opt_in() {
        let opts = PreflightOptions { print: true, ..Default::default() };
        let css = build_preflight(opts);
        assert!(css.contains("@media print"));
        assert!(css.contains(r#"a[href^="#"]::after"#));
    }

    #[test]
    fn minimal_mode_has_no_reset() {
        let opts = PreflightOptions {
            reset: false,
            typography: false,
            forms: false,
            a11y: false,
            modern: false,
            print: false,
            dark_auto: false,
            scrollbar_gutter: false,
        };
        let css = build_preflight(opts);
        assert!(!css.contains("box-sizing: border-box"));
        assert!(!css.contains(":focus-visible"));
        // Layer decl + @property are always present
        assert!(css.contains("@layer garur-theme"));
        assert!(css.contains("@property --garur-ring-width"));
    }

    #[test]
    fn cache_differentiates_options() {
        let a = build_preflight(PreflightOptions::default());
        let b = build_preflight(PreflightOptions { print: true, ..Default::default() });
        assert_ne!(a.as_ref(), b.as_ref());
    }

    #[test]
    fn cache_returns_same_arc_for_same_opts() {
        let opts = PreflightOptions::default();
        let a = build_preflight(opts);
        let b = build_preflight(opts);
        assert!(Arc::ptr_eq(&a, &b), "cache should return the same Arc");
    }

    #[test]
    fn clear_cache_forces_rebuild() {
        let opts = PreflightOptions::default();
        let a = build_preflight(opts);
        clear_cache();
        let b = build_preflight(opts);
        // Different Arc instances now, but identical content.
        assert_eq!(a.as_ref(), b.as_ref());
    }

    #[test]
    fn layer_and_properties_constants() {
        assert!(layer().contains("@layer"));
        assert!(properties().contains("@property"));
    }
}