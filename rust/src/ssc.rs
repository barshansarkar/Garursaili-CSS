// ═══════════════════════════════════════════════════════════════════
// GarurSaili-CSS — SSC (SUPER SONIC CYCLONE)
// Full build pipeline: scan → build → dedupe → group → emit
// ═══════════════════════════════════════════════════════════════════

use crate::engine;
use globset::{Glob, GlobSetBuilder};
use memmap2::Mmap;
use rayon::prelude::*;
use rustc_hash::FxHashMap;
use serde::{Deserialize, Serialize};
use std::fs::File;
use walkdir::WalkDir;

// ───────────────────────────────────────────────
// Public entry
// ───────────────────────────────────────────────

pub fn run(files: &[String], config_json: &str) -> String {
    // Config init happens in JS via init_config(), but be safe here
    let _ = engine::init_config(config_json);

    // 1. Parallel extract classes from all files
    let all_classes: Vec<String> = files
        .par_iter()
        .filter_map(|p| {
            let file = File::open(p).ok()?;
            let meta = file.metadata().ok()?;
            if meta.len() > 5 * 1024 * 1024 {
                return None;
            }
            let mmap = unsafe { Mmap::map(&file).ok()? };
            let content = std::str::from_utf8(&mmap).ok()?;
            Some(engine::extract(content))
        })
        .flatten()
        .collect();

    // Dedupe
    let mut unique: Vec<String> = {
        let mut seen = rustc_hash::FxHashSet::default();
        let mut v = Vec::with_capacity(all_classes.len());
        for c in all_classes {
            if seen.insert(c.clone()) {
                v.push(c);
            }
        }
        v
    };
    unique.sort();

    // 2. Parallel build each class → rule
    let rules: Vec<(String, String)> = unique
        .par_iter()
        .filter_map(|cls| engine::build(cls, false).map(|r| (cls.clone(), r)))
        .collect();

    // 3. Dedupe and group
    let mut base_blocks: Vec<String> = Vec::new();
    let mut media_blocks: FxHashMap<String, Vec<String>> = FxHashMap::default();
    let mut dedupe: FxHashMap<String, Vec<String>> = FxHashMap::default();
    let mut order: Vec<String> = Vec::new();

    for (_, rule) in &rules {
        // rule may contain multiple lines (e.g. @keyframes appended)
        for chunk in split_top_level(rule) {
            let trimmed = chunk.trim();
            if trimmed.is_empty() {
                continue;
            }

            if trimmed.starts_with("@keyframes") || trimmed.starts_with("@font-face") {
                // keyframes/fonts go straight to base
                base_blocks.push(trimmed.to_string());
                continue;
            }

            let (media, inner) = extract_media(trimmed);
            let (sel, decl) = split_selector_decl(&inner);
            if decl.is_empty() {
                continue;
            }

            let key = match &media {
                Some(m) => format!("{}::{}", m, decl),
                None => format!("::{}", decl),
            };

            if let Some(sels) = dedupe.get_mut(&key) {
                if !sels.iter().any(|s| s == &sel) {
                    sels.push(sel);
                }
            } else {
                dedupe.insert(key.clone(), vec![sel]);
                order.push(key);
            }
        }
    }

    // 4. Format output
    for key in &order {
        let sels = match dedupe.get(key) {
            Some(s) => s,
            None => continue,
        };
        if sels.is_empty() {
            continue;
        }

        // Determine media
        let (media, decl) = if let Some(pos) = key.find("::") {
            let (m, d) = key.split_at(pos);
            let media = if m.is_empty() { None } else { Some(m.to_string()) };
            (media, d[2..].to_string())
        } else {
            (None, key.clone())
        };

        let decl_formatted = decl
            .split(';')
            .filter(|s| !s.trim().is_empty())
            .map(|s| format!("  {};", s.trim()))
            .collect::<Vec<_>>()
            .join("\n");

        let block = format!("{} {{\n{}\n}}", sels.join(",\n"), decl_formatted);

        match media {
            Some(m) => {
                media_blocks.entry(m).or_default().push(block);
            }
            None => base_blocks.push(block),
        }
    }

    // 5. Assemble with breakpoints sorted
    let mut parts: Vec<String> = Vec::new();
    if !base_blocks.is_empty() {
        parts.push(base_blocks.join("\n\n"));
    }
    // Sort media queries: breakpoints first (by config order), then custom
    let mut media_keys: Vec<String> = media_blocks.keys().cloned().collect();
    media_keys.sort_by(|a, b| {
        let wa = extract_min_width(a);
        let wb = extract_min_width(b);
        wa.cmp(&wb)
    });
    for m in media_keys {
        if let Some(blocks) = media_blocks.get(&m) {
            if !blocks.is_empty() {
                parts.push(format!("@media ({}) {{\n{}\n}}", m, blocks.join("\n\n")));
            }
        }
    }

    parts.join("\n\n")
}

fn extract_min_width(media: &str) -> u32 {
    // Extract min-width value for sorting
    if let Some(idx) = media.find("min-width") {
        let rest = &media[idx + 9..];
        let num: String = rest.chars().take_while(|c| c.is_ascii_digit()).collect();
        return num.parse().unwrap_or(0);
    }
    u32::MAX
}

fn split_top_level(rule: &str) -> Vec<String> {
    // Split by top-level newlines followed by new rule (rough heuristic)
    let mut out = Vec::new();
    let mut depth = 0;
    let mut cur = String::new();
    for ch in rule.chars() {
        match ch {
            '{' => depth += 1,
            '}' => {
                if depth > 0 {
                    depth -= 1;
                }
                cur.push(ch);
                if depth == 0 {
                    out.push(std::mem::take(&mut cur));
                }
                continue;
            }
            _ => {}
        }
        cur.push(ch);
    }
    if !cur.trim().is_empty() {
        out.push(cur);
    }
    out
}

fn extract_media(rule: &str) -> (Option<String>, String) {
    if rule.starts_with("@media") {
        if let Some(open) = rule.find('{') {
            let raw = rule[6..open].trim();
            // Strip outer parens if present (e.g. "(min-width: 768px)" → "min-width: 768px")
            let media = if raw.starts_with('(') && raw.ends_with(')') {
                raw[1..raw.len() - 1].trim().to_string()
            } else {
                raw.to_string()
            };
            let inner = rule[open + 1..].trim_end_matches('}').trim().to_string();
            return (Some(media), inner);
        }
    }
    (None, rule.to_string())
}

fn split_selector_decl(rule: &str) -> (String, String) {
    if let Some(open) = rule.find('{') {
        if let Some(close) = rule.rfind('}') {
            let sel = rule[..open].trim().to_string();
            let decl = rule[open + 1..close].trim().to_string();
            return (sel, decl);
        }
    }
    (String::new(), String::new())
}

// ───────────────────────────────────────────────
// File finder
// ───────────────────────────────────────────────

pub fn find_files(cwd: &str, include: &[String], ignore: &[String]) -> Vec<String> {
    let mut ib = GlobSetBuilder::new();
    for p in include {
        if let Ok(g) = Glob::new(p) {
            ib.add(g);
        }
    }
    let inc = match ib.build() {
        Ok(s) => s,
        Err(_) => return vec![],
    };

    let mut gb = GlobSetBuilder::new();
    for p in ignore {
        if let Ok(g) = Glob::new(p) {
            gb.add(g);
        }
    }
    let ign = match gb.build() {
        Ok(s) => s,
        Err(_) => return vec![],
    };

    let mut out: Vec<String> = WalkDir::new(cwd)
        .follow_links(false)
        .max_depth(12)
        .into_iter()
        .filter_entry(|e| {
            let n = e.file_name().to_string_lossy();
            !matches!(
                n.as_ref(),
                "node_modules" | ".git" | "dist" | "build"
                    | ".next" | ".nuxt" | "target" | ".cache" | "coverage"
            )
        })
        .filter_map(|e| e.ok())
        .filter(|e| e.file_type().is_file())
        .filter_map(|e| {
            let p = e.path();
            let rel = p
                .strip_prefix(cwd)
                .unwrap_or(p)
                .to_string_lossy()
                .replace('\\', "/");
            if ign.is_match(&rel) || !inc.is_match(&rel) {
                None
            } else {
                Some(p.to_string_lossy().to_string())
            }
        })
        .collect();

    out.sort();
    out
}

// ───────────────────────────────────────────────
// Cache
// ───────────────────────────────────────────────

#[derive(Serialize, Deserialize, Default)]
pub struct CacheEntry {
    pub hash: u64,
    pub classes: Vec<String>,
}

#[derive(Serialize, Deserialize, Default)]
pub struct GarurCache {
    pub version: u32,
    pub files: FxHashMap<String, CacheEntry>,
    pub classes: FxHashMap<String, String>,
}

pub fn cache_encode(json: &str) -> Result<Vec<u8>, String> {
    let cache: GarurCache =
        serde_json::from_str(json).map_err(|e| format!("cache decode: {}", e))?;
    bincode::serialize(&cache).map_err(|e| format!("cache encode: {}", e))
}

pub fn cache_decode(data: &[u8]) -> Result<String, String> {
    let cache: GarurCache =
        bincode::deserialize(data).map_err(|e| format!("cache decode: {}", e))?;
    serde_json::to_string(&cache).map_err(|e| format!("cache json: {}", e))
}