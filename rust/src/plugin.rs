// ═══════════════════════════════════════════════════════════════════
// GarurSaili-CSS — plugin.rs (Papaya Edition)
// ═══════════════════════════════════════════════════════════════════
use papaya::HashMap as PapayaMap;
use once_cell::sync::Lazy;
use rustc_hash::FxHashMap;
use std::sync::{Arc, RwLock};

// ─── Legacy (kept for BC) ───
static CUSTOM_UTILITIES: Lazy<RwLock<FxHashMap<String, String>>> =
    Lazy::new(|| RwLock::new(FxHashMap::default()));
static CUSTOM_VARIANTS: Lazy<RwLock<FxHashMap<String, String>>> =
    Lazy::new(|| RwLock::new(FxHashMap::default()));

// ─── Layer 1: Papaya (Lock-free, zero-clone concurrent map) ───
static PLUGIN_UTILS: Lazy<PapayaMap<Box<str>, Arc<str>>> =
    Lazy::new(PapayaMap::new);
static PLUGIN_COMPONENTS: Lazy<PapayaMap<Box<str>, Arc<str>>> =
    Lazy::new(PapayaMap::new);

// At-rules: Append-only, kept as a RwLock Vec (at-rules are rare)
static PLUGIN_AT_RULES: Lazy<RwLock<Vec<Arc<str>>>> =
    Lazy::new(|| RwLock::new(Vec::new()));

// ═══════════════════════════════════════════════════════════════════
// Legacy API
// ═══════════════════════════════════════════════════════════════════

pub fn register_utility(name: String, decls: String) {
    if let Ok(mut u) = CUSTOM_UTILITIES.write() { u.insert(name, decls); }
}

pub fn register_variant(name: String, template: String) {
    if let Ok(mut v) = CUSTOM_VARIANTS.write() { v.insert(name, template); }
}

pub fn snapshot_utilities() -> Vec<(String, String)> {
    CUSTOM_UTILITIES.read()
        .map(|m| m.iter().map(|(k, v)| (k.clone(), v.clone())).collect())
        .unwrap_or_default()
}

pub fn snapshot_variants() -> Vec<(String, String)> {
    CUSTOM_VARIANTS.read()
        .map(|m| m.iter().map(|(k, v)| (k.clone(), v.clone())).collect())
        .unwrap_or_default()
}

pub fn clear_all() {
    if let Ok(mut u) = CUSTOM_UTILITIES.write() { u.clear(); }
    if let Ok(mut v) = CUSTOM_VARIANTS.write() { v.clear(); }
}

pub fn merge_into(base: &mut FxHashMap<String, String>) {
    if let Ok(u) = CUSTOM_UTILITIES.read() {
        for (k, v) in u.iter() { base.insert(k.clone(), v.clone()); }
    }
    // Pull from Papaya (only on regenerate)
    let pin = PLUGIN_UTILS.pin();
    for (k, v) in pin.iter() {
        base.insert(k.to_string(), v.to_string());
    }
}

// ═══════════════════════════════════════════════════════════════════
// Hot-path lookups (Lock-free, O(1))
// ═══════════════════════════════════════════════════════════════════

#[inline]
pub fn lookup_utility(name: &str) -> Option<Arc<str>> {
    PLUGIN_UTILS.pin().get(name).cloned()
}

#[inline]
pub fn lookup_component(name: &str) -> Option<Arc<str>> {
    PLUGIN_COMPONENTS.pin().get(name).cloned()
}

// ═══════════════════════════════════════════════════════════════════
// Bulk registration (Zero full-map clones!)
// ═══════════════════════════════════════════════════════════════════

pub fn register_plugin_bulk(
    utilities: Vec<(String, String)>,
    components: Vec<(String, String)>,
    at_rules: Vec<String>,
) {
    if !utilities.is_empty() {
        let pin = PLUGIN_UTILS.pin();
        for (k, v) in utilities {
            pin.insert(k.into_boxed_str(), Arc::from(v));
        }
    }

    if !components.is_empty() {
        let pin = PLUGIN_COMPONENTS.pin();
        for (k, v) in components {
            pin.insert(k.into_boxed_str(), Arc::from(v));
        }
    }

    if !at_rules.is_empty() {
        if let Ok(mut v) = PLUGIN_AT_RULES.write() {
            v.extend(at_rules.into_iter().map(Arc::from));
        }
    }
}

// Keep BC for individual batches
pub fn register_utilities_batch(entries: Vec<(String, String)>) {
    register_plugin_bulk(entries, Vec::new(), Vec::new());
}

pub fn register_components_batch(entries: Vec<(String, String)>) {
    register_plugin_bulk(Vec::new(), entries, Vec::new());
}

pub fn register_at_rules(rules: Vec<String>) {
    register_plugin_bulk(Vec::new(), Vec::new(), rules);
}

// ═══════════════════════════════════════════════════════════════════
// Getters
// ═══════════════════════════════════════════════════════════════════

pub fn get_at_rules() -> Vec<String> {
    PLUGIN_AT_RULES.read()
        .map(|v| v.iter().map(|s| s.to_string()).collect())
        .unwrap_or_default()
}

pub fn get_plugin_components() -> Vec<(String, String)> {
    PLUGIN_COMPONENTS.pin()
        .iter()
        .map(|(k, v)| (k.to_string(), v.to_string()))
        .collect()
}

pub fn get_plugin_utilities() -> Vec<(String, String)> {
    PLUGIN_UTILS.pin()
        .iter()
        .map(|(k, v)| (k.to_string(), v.to_string()))
        .collect()
}

pub fn plugin_utility_count() -> u32 {
    PLUGIN_UTILS.pin().len() as u32
}

// ═══════════════════════════════════════════════════════════════════
// Clear
// ═══════════════════════════════════════════════════════════════════

pub fn clear_plugin_registries() {
    PLUGIN_UTILS.pin().clear();
    PLUGIN_COMPONENTS.pin().clear();
    if let Ok(mut v) = PLUGIN_AT_RULES.write() { v.clear(); }
}