// ═══════════════════════════════════════════════════════════════════
// Plugin registry — Rust-side hook storage
// ═══════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════
// GarurSaili-CSS 
// The Semantic Indian CSS Framework
// Author: Barshan Sarkar · Malda, West Bengal, India
// Version: 1.4.0
// ═══════════════════════════════════════════════════════════════════
use once_cell::sync::Lazy;
use rustc_hash::FxHashMap;
use std::sync::RwLock;

static CUSTOM_UTILITIES: Lazy<RwLock<FxHashMap<String, String>>> =
    Lazy::new(|| RwLock::new(FxHashMap::default()));

static CUSTOM_VARIANTS: Lazy<RwLock<FxHashMap<String, String>>> =
    Lazy::new(|| RwLock::new(FxHashMap::default()));

/// Register a custom utility.
/// `name` = "glass", `decls` = "backdrop-filter:blur(10px)"
pub fn register_utility(name: String, decls: String) {
    if let Ok(mut u) = CUSTOM_UTILITIES.write() {
        u.insert(name, decls);
    }
}

/// Register a custom variant.
/// `name` = "hocus", `template` = "&:hover, &:focus"
pub fn register_variant(name: String, template: String) {
    if let Ok(mut v) = CUSTOM_VARIANTS.write() {
        v.insert(name, template);
    }
}

pub fn snapshot_utilities() -> Vec<(String, String)> {
    CUSTOM_UTILITIES
        .read()
        .map(|m| m.iter().map(|(k, v)| (k.clone(), v.clone())).collect())
        .unwrap_or_default()
}

pub fn snapshot_variants() -> Vec<(String, String)> {
    CUSTOM_VARIANTS
        .read()
        .map(|m| m.iter().map(|(k, v)| (k.clone(), v.clone())).collect())
        .unwrap_or_default()
}

pub fn clear_all() {
    if let Ok(mut u) = CUSTOM_UTILITIES.write() { u.clear(); }
    if let Ok(mut v) = CUSTOM_VARIANTS.write() { v.clear(); }
}

/// Merge plugin utilities into the engine's utility map.
/// Called from engine::regenerate_utils().
pub fn merge_into(base: &mut FxHashMap<String, String>) {
    if let Ok(u) = CUSTOM_UTILITIES.read() {
        for (k, v) in u.iter() {
            base.insert(k.clone(), v.clone());
        }
    }
}