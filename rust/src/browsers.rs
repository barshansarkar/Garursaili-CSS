// ═══════════════════════════════════════════════════════════════════
// GarurSaili-CSS 
// The Semantic Indian CSS Framework
// Author: Barshan Sarkar · Malda, West Bengal, India
// Version: 1.4.0
// ═══════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════
// Browserslist → lightningcss::Browsers bridge
// ═══════════════════════════════════════════════════════════════════
//
// NOTE: browserslist resolution is currently disabled because the
// `browserslist-rs` crate has unstable feature flags across versions.
// lightningcss will use its internal defaults (modern browsers),
// which is safe for 99% of use cases.
//
// To enable later: add `browserslist-rs = "0.19"` to Cargo.toml,
// then implement resolve_targets() using its `resolve()` API.

use lightningcss::targets::Browsers;

/// Resolve browserslist query strings into lightningcss::Browsers.
/// Returns None → lightningcss uses its default targets.
pub fn resolve_targets(_queries: &[String]) -> Option<Browsers> {
    None
}