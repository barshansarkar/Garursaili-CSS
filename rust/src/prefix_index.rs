// ═══════════════════════════════════════════════════════════════════
// GarurSaili-CSS — prefix_index.rs (ART / FST Edition)
// ═══════════════════════════════════════════════════════════════════
//
// FST (Finite State Transducer) — a Rust implementation of the
// Adaptive Radix Tree concept, optimized for prefix lookups.
//
// Design:
//   - `map`: FST mapping prefix → u64 index
//   - `prefix_plugins`: Vec<Vec<String>>, indexed by u64 → plugin IDs
//
// This lets a single prefix map to MULTIPLE plugin IDs
// (rare, but possible — e.g. two plugins both claim "glow-").
// ═══════════════════════════════════════════════════════════════════

use fst::{Map, MapBuilder};
use once_cell::sync::Lazy;
use std::collections::BTreeMap;
use std::sync::{Arc, RwLock};

struct PrefixIndexData {
    map: Map<Vec<u8>>,
    prefix_plugins: Vec<Vec<String>>,
}

static PREFIX_INDEX: Lazy<RwLock<Option<Arc<PrefixIndexData>>>> =
    Lazy::new(|| RwLock::new(None));

// ═══════════════════════════════════════════════════════════════════
// Build
// ═══════════════════════════════════════════════════════════════════

pub fn build_index(entries: Vec<(String, String)>) -> Result<(), String> {
    // ─── 1. Group plugin IDs by prefix ───
    let mut by_prefix: BTreeMap<String, Vec<String>> = BTreeMap::new();
    for (prefix, plugin_id) in entries {
        let v = by_prefix.entry(prefix).or_default();
        if !v.contains(&plugin_id) {
            v.push(plugin_id);
        }
    }

    // ─── 2. Assign each unique prefix an integer index ───
    let mut prefix_plugins: Vec<Vec<String>> = Vec::with_capacity(by_prefix.len());
    let mut indexed: Vec<(String, u64)> = Vec::with_capacity(by_prefix.len());

    for (prefix, pids) in by_prefix {
        let idx = prefix_plugins.len() as u64;
        prefix_plugins.push(pids);
        indexed.push((prefix, idx));
    }

    // ─── 3. Build FST (indexed is already sorted by BTreeMap) ───
    let mut builder = MapBuilder::memory();
    for (key, idx) in &indexed {
        builder
            .insert(key.as_bytes(), *idx)
            .map_err(|e| format!("fst insert: {}", e))?;
    }
    let bytes = builder
        .into_inner()
        .map_err(|e| format!("fst build: {}", e))?;
    let fst = Map::new(bytes).map_err(|e| format!("fst load: {}", e))?;

    // ─── 4. Store globally ───
    if let Ok(mut lock) = PREFIX_INDEX.write() {
        *lock = Some(Arc::new(PrefixIndexData {
            map: fst,
            prefix_plugins,
        }));
    }

    Ok(())
}

// ═══════════════════════════════════════════════════════════════════
// Lookup
// ═══════════════════════════════════════════════════════════════════

pub fn find_matching_plugins(classes: &[String]) -> Vec<String> {
    let lock = match PREFIX_INDEX.read() {
        Ok(l) => l,
        Err(_) => return Vec::new(),
    };
    let data = match lock.as_ref() {
        Some(d) => d,
        None => return Vec::new(),
    };

    let mut matched: std::collections::HashSet<&str> = std::collections::HashSet::new();

    for cls in classes {
        let bytes = cls.as_bytes();

        // Try prefixes from longest → shortest. First match wins.
        // For "glow-md" with prefix "glow-":
        //   i=7 → "glow-md"  no
        //   i=6 → "glow-m"   no
        //   i=5 → "glow-"    ✅ hit
        for i in (1..=bytes.len()).rev() {
            if let Some(idx) = data.map.get(&bytes[..i]) {
                if let Some(pids) = data.prefix_plugins.get(idx as usize) {
                    for pid in pids {
                        matched.insert(pid.as_str());
                    }
                }
                break;
            }
        }
    }

    matched.into_iter().map(|s| s.to_string()).collect()
}




// ═══════════════════════════════════════════════════════════════════
// Spacing Utility Index (for try_dynamic_spacing fast path)
// ═══════════════════════════════════════════════════════════════════

struct SpacingIndex {
    map: fst::Map<Vec<u8>>,
    templates: Vec<String>,
}

static SPACING_INDEX: Lazy<RwLock<Option<Arc<SpacingIndex>>>> =
    Lazy::new(|| RwLock::new(None));

pub fn build_spacing_index(entries: Vec<(String, String)>) -> Result<(), String> {
    let mut sorted: BTreeMap<String, u64> = BTreeMap::new();
    let mut templates: Vec<String> = Vec::with_capacity(entries.len());

    for (prefix, template) in entries {
        let idx = templates.len() as u64;
        templates.push(template);
        sorted.insert(prefix, idx);
    }

    let mut builder = MapBuilder::memory();
    for (key, idx) in &sorted {
        builder.insert(key.as_bytes(), *idx).map_err(|e| format!("fst: {}", e))?;
    }
    let bytes = builder.into_inner().map_err(|e| format!("fst: {}", e))?;
    let fst = fst::Map::new(bytes).map_err(|e| format!("fst: {}", e))?;

    if let Ok(mut lock) = SPACING_INDEX.write() {
        *lock = Some(Arc::new(SpacingIndex { map: fst, templates }));
    }
    Ok(())
}

/// Lookup: given "p-4", returns Some(("padding:{0}", "4")).
pub fn lookup_spacing(cls: &str) -> Option<(String, String)> {
    let lock = SPACING_INDEX.read().ok()?;
    let data = lock.as_ref()?;

    let bytes = cls.as_bytes();
    for i in (1..=bytes.len()).rev() {
        if let Some(idx) = data.map.get(&bytes[..i]) {
            let template = data.templates.get(idx as usize)?.clone();
            let rest = std::str::from_utf8(&bytes[i..]).ok()?.to_string();
            return Some((template, rest));
        }
    }
    None
}
// ═══════════════════════════════════════════════════════════════════
// Clear
// ═══════════════════════════════════════════════════════════════════

pub fn clear_index() {
    if let Ok(mut lock) = PREFIX_INDEX.write() {
        *lock = None;
    }
}