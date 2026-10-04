// ═══════════════════════════════════════════════════════════════════
// Preflight + @layer + @property — Tailwind v4-equivalent reset
// All static, zero-allocation — returns &'static str slices.
// ═══════════════════════════════════════════════════════════════════

/// Layer order declaration (must be first in the stylesheet).
pub const LAYER_DECL: &str = "@layer theme, base, components, utilities;";

/// CSS variable registrations — enables animation + type safety.
pub const PROPERTY_DECLS: &str = r#"@property --garur-ring-width { syntax: "<length>"; inherits: false; initial-value: 0px; }
@property --garur-ring-offset-width { syntax: "<length>"; inherits: false; initial-value: 0px; }
@property --garur-ring-color { syntax: "<color>"; inherits: false; initial-value: currentColor; }
@property --garur-rotate { syntax: "<angle>"; inherits: false; initial-value: 0deg; }
@property --garur-rotate-x { syntax: "<angle>"; inherits: false; initial-value: 0deg; }
@property --garur-rotate-y { syntax: "<angle>"; inherits: false; initial-value: 0deg; }
@property --garur-scale-x { syntax: "<number>"; inherits: false; initial-value: 1; }
@property --garur-scale-y { syntax: "<number>"; inherits: false; initial-value: 1; }
@property --garur-scale-z { syntax: "<number>"; inherits: false; initial-value: 1; }
@property --garur-translate-x { syntax: "<length-percentage>"; inherits: false; initial-value: 0px; }
@property --garur-translate-y { syntax: "<length-percentage>"; inherits: false; initial-value: 0px; }
@property --garur-translate-z { syntax: "<length>"; inherits: false; initial-value: 0px; }
@property --garur-skew-x { syntax: "<angle>"; inherits: false; initial-value: 0deg; }
@property --garur-skew-y { syntax: "<angle>"; inherits: false; initial-value: 0deg; }
@property --garur-blur { syntax: "<length>"; inherits: false; initial-value: 0px; }
@property --garur-brightness { syntax: "<number>"; inherits: false; initial-value: 1; }
@property --garur-contrast { syntax: "<number>"; inherits: false; initial-value: 1; }
@property --garur-saturate { syntax: "<number>"; inherits: false; initial-value: 1; }
@property --garur-hue-rotate { syntax: "<angle>"; inherits: false; initial-value: 0deg; }
@property --garur-grayscale { syntax: "<number>"; inherits: false; initial-value: 0; }
@property --garur-invert { syntax: "<number>"; inherits: false; initial-value: 0; }
@property --garur-sepia { syntax: "<number>"; inherits: false; initial-value: 0; }
@property --garur-space-x-reverse { syntax: "<number>"; inherits: false; initial-value: 0; }
@property --garur-space-y-reverse { syntax: "<number>"; inherits: false; initial-value: 0; }
@property --garur-divide-x-reverse { syntax: "<number>"; inherits: false; initial-value: 0; }
@property --garur-divide-y-reverse { syntax: "<number>"; inherits: false; initial-value: 0; }
@property --garur-gradient-from { syntax: "<color>"; inherits: false; initial-value: transparent; }
@property --garur-gradient-via { syntax: "<color>"; inherits: false; initial-value: transparent; }
@property --garur-gradient-to { syntax: "<color>"; inherits: false; initial-value: transparent; }
@property --garur-scroll-snap-strictness { syntax: "*"; inherits: false; }
"#;

/// Full Tailwind v4-equivalent preflight reset.
pub const PREFLIGHT: &str = r#"*, ::after, ::before, ::backdrop, ::file-selector-button {
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
  font-family: var(--garur-font-sans, ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji");
  font-feature-settings: var(--garur-font-feature-settings, normal);
  font-variation-settings: var(--garur-font-variation-settings, normal);
  -webkit-tap-highlight-color: transparent;
}

hr {
  height: 0;
  color: inherit;
  border-top-width: 1px;
}

abbr:where([title]) {
  -webkit-text-decoration: underline dotted;
  text-decoration: underline dotted;
}

h1, h2, h3, h4, h5, h6 {
  font-size: inherit;
  font-weight: inherit;
}

a {
  color: inherit;
  -webkit-text-decoration: inherit;
  text-decoration: inherit;
}

b, strong {
  font-weight: bolder;
}

code, kbd, samp, pre {
  font-family: var(--garur-font-mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace);
  font-feature-settings: var(--garur-font-mono-feature-settings, normal);
  font-variation-settings: var(--garur-font-mono-variation-settings, normal);
  font-size: 1em;
}

small {
  font-size: 80%;
}

sub, sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

sub { bottom: -0.25em; }
sup { top: -0.5em; }

table {
  text-indent: 0;
  border-color: inherit;
  border-collapse: collapse;
}

:-moz-focusring { outline: auto; }
progress { vertical-align: baseline; }
summary { display: list-item; }
ol, ul, menu { list-style: none; }

img, svg, video, canvas, audio, iframe, embed, object {
  display: block;
  vertical-align: middle;
}

img, video {
  max-width: 100%;
  height: auto;
}

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

@supports (not (-webkit-appearance: -apple-pay-button)) or (contain-intrinsic-size: 1px) {
  ::placeholder {
    color: color-mix(in oklab, currentColor 50%, transparent);
  }
}

textarea { resize: vertical; }
::-webkit-search-decoration { -webkit-appearance: none; }
::-webkit-date-and-time-value { min-height: 1lh; text-align: inherit; }
::-webkit-datetime-edit { display: inline-flex; }
::-webkit-datetime-edit-fields-wrapper { padding: 0; }

::-webkit-datetime-edit,
::-webkit-datetime-edit-year-field,
::-webkit-datetime-edit-month-field,
::-webkit-datetime-edit-day-field,
::-webkit-datetime-edit-hour-field,
::-webkit-datetime-edit-minute-field,
::-webkit-datetime-edit-second-field,
::-webkit-datetime-edit-millisecond-field,
::-webkit-datetime-edit-meridiem-field { padding-block: 0; }

::-webkit-calendar-picker-indicator { line-height: 1; }
:-moz-ui-invalid { box-shadow: none; }

button, input:where([type="button"], [type="reset"], [type="submit"]), ::file-selector-button {
  appearance: button;
}

::-webkit-inner-spin-button,
::-webkit-outer-spin-button { height: auto; }

[type="search"] { -webkit-appearance: textfield; outline-offset: -2px; }

::-webkit-search-cancel-button { -webkit-appearance: none; }
::-webkit-search-decoration { -webkit-appearance: none; }
::-webkit-search-results-button,
::-webkit-search-results-decoration { -webkit-appearance: none; }

[hidden]:where(:not([hidden="until-found"])) { display: none !important; }
// Add to PROPERTY_DECLS (inside the raw string):
@property --garur-ring-offset-color { syntax: "<color>"; inherits: false; initial-value: #fff; }
@property --garur-text-shadow-color { syntax: "<color>"; inherits: false; initial-value: rgb(0 0 0 / 0.1); }
@property --garur-gradient-interpolation { syntax: "*"; inherits: false; }
"#;

#[inline]
pub fn layer() -> &'static str { LAYER_DECL }

#[inline]
pub fn properties() -> &'static str { PROPERTY_DECLS }

#[inline]
pub fn preflight() -> &'static str { PREFLIGHT }