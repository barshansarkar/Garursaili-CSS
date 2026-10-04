// ═══════════════════════════════════════════════════════════════════
// GarurSaili-CSS — SSC (SUPER SONIC CYCLONE)
// ═══════════════════════════════════════════════════════════════════

use crate::css_input;
use crate::engine;
use crate::preflight;
use globset::GlobSetBuilder;
use memmap2::Mmap;
use rayon::prelude::*;
use rustc_hash::FxHashMap;
use serde::{Deserialize, Serialize};
use std::borrow::Cow;
use std::fs::File;
use walkdir::WalkDir;

#[derive(Clone, Copy)]
pub struct SscOptions {
    pub preflight: bool,
    pub minify: bool,
    pub vendor_prefix: bool,
}

impl Default for SscOptions {
    fn default() -> Self {
        Self { preflight: true, minify: false, vendor_prefix: true }
    }
}

pub fn run(files: &[String], config_json: &str) -> String {
    run_with_options(files, config_json, SscOptions::default())
}

pub fn run_with_options(files: &[String], config_json: &str, opts: SscOptions) -> String {
    let mut css_files: Vec<&str> = Vec::new();
    let mut markup_files: Vec<&str> = Vec::new();
    for p in files {
        if p.ends_with(".css") { css_files.push(p.as_str()); }
        else { markup_files.push(p.as_str()); }
    }

    // Read + parse @theme from CSS files
    let mut theme_tokens = css_input::ThemeTokens::default();
    let mut css_sources: Vec<(String, String)> = Vec::with_capacity(css_files.len());

    for &path in &css_files {
        if let Ok(content) = std::fs::read_to_string(path) {
            let (stripped, tokens) = css_input::parse_theme(&content);
            theme_tokens.merge(tokens);
            css_sources.push((path.to_string(), stripped));
        }
    }

    let merged_cfg = merge_config_with_theme(config_json, &theme_tokens);
    let _ = engine::init_config(&merged_cfg);

    let mut user_css_out = String::with_capacity(4096);
    for (_path, content) in &css_sources {
        match css_input::expand_apply(content) {
            Ok(expanded) => { user_css_out.push_str(&expanded); user_css_out.push('\n'); }
            Err(_) => { user_css_out.push_str(content); user_css_out.push('\n'); }
        }
    }

    // Parallel extract classes
    let all_classes: Vec<String> = markup_files
        .par_iter()
        .filter_map(|p| {
            let file = File::open(p).ok()?;
            let meta = file.metadata().ok()?;
            if meta.len() > 5 * 1024 * 1024 { return None; }
            let mmap = unsafe { Mmap::map(&file).ok()? };
            let content = std::str::from_utf8(&mmap).ok()?;
            Some(engine::extract(content))
        })
        .flatten()
        .collect();

    // Dedup via borrow set (avoids one allocation per duplicate)
    let mut unique: Vec<String> = {
        let mut seen = rustc_hash::FxHashSet::default();
        let mut v = Vec::with_capacity(all_classes.len());
        for c in all_classes {
            if seen.insert(c.clone()) { v.push(c); }
        }
        v
    };
    unique.sort();

    let rules: Vec<(String, String)> = unique
        .par_iter()
        .filter_map(|cls| engine::build(cls, false).map(|r| (cls.clone(), r)))
        .collect();

    let mut base_blocks: Vec<String> = Vec::with_capacity(rules.len());
    let mut keyframes_seen: rustc_hash::FxHashSet<String> = rustc_hash::FxHashSet::default();
    let mut media_blocks: FxHashMap<String, Vec<String>> = FxHashMap::default();
    let mut dedupe: FxHashMap<String, Vec<String>> = FxHashMap::default();
    let mut order: Vec<String> = Vec::with_capacity(rules.len());

    for (_, rule) in &rules {
        for chunk in split_top_level(rule) {
            let trimmed = chunk.trim();
            if trimmed.is_empty() { continue; }

            if trimmed.starts_with("@keyframes") {
                let key = trimmed.split_whitespace().nth(1).unwrap_or("")
                    .trim_end_matches('{').to_string();
                if keyframes_seen.insert(key) {
                    base_blocks.push(trimmed.to_string());
                }
                continue;
            }
            if trimmed.starts_with("@font-face") {
                base_blocks.push(trimmed.to_string());
                continue;
            }

            let (media, inner) = extract_media(trimmed);
            let (sel, decl) = split_selector_decl(&inner);
            if decl.is_empty() { continue; }

            let key = match &media {
                Some(m) => {
                    let mut k = String::with_capacity(m.len() + 2 + decl.len());
                    k.push_str(m); k.push_str("::"); k.push_str(&decl); k
                }
                None => {
                    let mut k = String::with_capacity(2 + decl.len());
                    k.push_str("::"); k.push_str(&decl); k
                }
            };

            if let Some(sels) = dedupe.get_mut(&key) {
                if !sels.iter().any(|s| s == &sel) { sels.push(sel); }
            } else {
                dedupe.insert(key.clone(), vec![sel]);
                order.push(key);
            }
        }
    }

    for key in &order {
        let sels = match dedupe.get(key) { Some(s) => s, None => continue };
        if sels.is_empty() { continue; }

        let (media, decl) = if let Some(pos) = key.find("::") {
            let (m, d) = key.split_at(pos);
            let media = if m.is_empty() { None } else { Some(m) };
            (media, &d[2..])
        } else { (None, &key[..]) };

        let mut decl_formatted = String::with_capacity(decl.len() + 16);
        let mut first = true;
        for s in decl.split(';') {
            let t = s.trim();
            if t.is_empty() { continue; }
            if !first { decl_formatted.push('\n'); }
            first = false;
            decl_formatted.push_str("  ");
            decl_formatted.push_str(t);
            decl_formatted.push(';');
        }

        let joined_sels = sels.join(",\n");
        let mut block = String::with_capacity(joined_sels.len() + decl_formatted.len() + 8);
        block.push_str(&joined_sels);
        block.push_str(" {\n");
        block.push_str(&decl_formatted);
        block.push_str("\n}");

        match media {
            Some(m) => media_blocks.entry(m.to_string()).or_default().push(block),
            None => base_blocks.push(block),
        }
    }

    let mut parts: Vec<String> = Vec::with_capacity(8 + media_blocks.len());
    parts.push(preflight::layer().to_string());
    parts.push(preflight::properties().to_string());
    if opts.preflight { parts.push(preflight::preflight().to_string()); }
    if !base_blocks.is_empty() { parts.push(base_blocks.join("\n\n")); }

    let mut media_keys: Vec<String> = media_blocks.keys().cloned().collect();
    media_keys.sort_by_key(|a| extract_min_width(a));
    for m in media_keys {
        if let Some(blocks) = media_blocks.get(&m) {
            if !blocks.is_empty() {
                parts.push(format!("@media ({}) {{\n{}\n}}", m, blocks.join("\n\n")));
            }
        }
    }

    let mut css = parts.join("\n\n");

    if !user_css_out.trim().is_empty() {
        css.push_str("\n\n/* ── user css ── */\n");
        css.push_str(&user_css_out);
    }

    if opts.vendor_prefix {
        let targets = engine::current_targets();
        engine::finalize(&css, opts.minify, &targets)
    } else if opts.minify {
        engine::minify(&css)
    } else {
        css
    }
}

fn merge_config_with_theme(config_json: &str, tokens: &css_input::ThemeTokens) -> String {
    if tokens.is_empty() { return config_json.to_string(); }

    let Ok(mut cfg) = serde_json::from_str::<serde_json::Value>(config_json) else {
        return config_json.to_string();
    };

    let theme_palette = tokens.flat_palette();
    if !theme_palette.is_empty() {
        match cfg.get_mut("palette").and_then(|p| p.as_object_mut()) {
            Some(pal) => for (k, v) in theme_palette {
                pal.entry(k).or_insert(serde_json::Value::String(v));
            },
            None => {
                let mut pal = serde_json::Map::with_capacity(theme_palette.len());
                for (k, v) in theme_palette { pal.insert(k, serde_json::Value::String(v)); }
                cfg["palette"] = serde_json::Value::Object(pal);
            }
        }
    }

    for (field, map) in [
        ("themeSpacing", &tokens.spacing),
        ("themeRadius",  &tokens.radius),
        ("themeFont",    &tokens.font),
    ] {
        if !map.is_empty() {
            let mut obj = serde_json::Map::with_capacity(map.len());
            for (k, v) in map { obj.insert(k.clone(), serde_json::Value::String(v.clone())); }
            cfg[field] = serde_json::Value::Object(obj);
        }
    }
    cfg.to_string()
}

fn extract_min_width(media: &str) -> u32 {
    if let Some(idx) = media.find("min-width") {
        let rest = &media[idx + 9..];
        let num: String = rest.chars().take_while(|c| c.is_ascii_digit()).collect();
        return num.parse().unwrap_or(0);
    }
    u32::MAX
}

fn split_top_level(rule: &str) -> Vec<String> {
    let bytes = rule.as_bytes();
    let mut out = Vec::with_capacity(4);
    let mut depth: i32 = 0;
    let mut start = 0usize;
    for i in 0..bytes.len() {
        match bytes[i] {
            b'{' => depth += 1,
            b'}' => {
                if depth > 0 { depth -= 1; }
                if depth == 0 {
                    out.push(rule[start..i + 1].to_string());
                    start = i + 1;
                }
            }
            _ => {}
        }
    }
    if !rule[start..].trim().is_empty() { out.push(rule[start..].to_string()); }
    out
}

fn extract_media(rule: &str) -> (Option<String>, String) {
    if rule.starts_with("@media") {
        if let Some(open) = rule.find('{') {
            let raw = rule[6..open].trim();
            let media = if raw.starts_with('(') && raw.ends_with(')') {
                raw[1..raw.len() - 1].trim().to_string()
            } else { raw.to_string() };
            let inner = rule[open + 1..].trim_end_matches('}').trim().to_string();
            return (Some(media), inner);
        }
    }
    (None, rule.to_string())
}

fn split_selector_decl(rule: &str) -> (String, String) {
    if let Some(open) = rule.find('{') {
        if let Some(close) = rule.rfind('}') {
            return (rule[..open].trim().to_string(), rule[open + 1..close].trim().to_string());
        }
    }
    (String::new(), String::new())
}

// ───────────────────────────────────────────────
// Brace expansion + file finder
// ───────────────────────────────────────────────

fn expand_braces(pattern: &str) -> Vec<String> {
    let bytes = pattern.as_bytes();
    let mut i = 0;
    while i < bytes.len() {
        if bytes[i] == b'{' {
            let mut depth = 1i32;
            let mut j = i + 1;
            while j < bytes.len() && depth > 0 {
                match bytes[j] {
                    b'{' => depth += 1,
                    b'}' => depth -= 1,
                    _ => {}
                }
                j += 1;
            }
            if depth == 0 {
                let prefix = &pattern[..i];
                let inner = &pattern[i + 1..j - 1];
                let suffix = &pattern[j..];
                let mut out = Vec::new();
                for opt in inner.split(',') {
                    let sub = format!("{}{}{}", prefix, opt.trim(), suffix);
                    out.extend(expand_braces(&sub));
                }
                return out;
            }
            break;
        }
        i += 1;
    }
    vec![pattern.to_string()]
}

pub fn find_files(cwd: &str, include: &[String], ignore: &[String]) -> Vec<String> {
    use globset::GlobBuilder;

    let make_glob = |pattern: &str| -> Option<globset::Glob> {
        GlobBuilder::new(pattern).literal_separator(true).build().ok()
    };

    let mut ib = GlobSetBuilder::new();
    for p in include {
        for expanded in expand_braces(p) {
            if let Some(g) = make_glob(&expanded) { ib.add(g); }
        }
    }
    let inc = match ib.build() { Ok(s) => s, Err(_) => return vec![] };

    let mut gb = GlobSetBuilder::new();
    for p in ignore {
        for expanded in expand_braces(p) {
            if let Some(g) = make_glob(&expanded) { gb.add(g); }
        }
    }
    let ign = match gb.build() { Ok(s) => s, Err(_) => return vec![] };

    let mut out: Vec<String> = WalkDir::new(cwd)
        .follow_links(false)
        .max_depth(12)
        .into_iter()
        .filter_entry(|e| {
            let n = e.file_name().to_string_lossy();
            !matches!(n.as_ref(),
                "node_modules" | ".git" | "dist" | "build"
                | ".next" | ".nuxt" | "target" | ".cache" | "coverage")
        })
        .filter_map(|e| e.ok())
        .filter(|e| e.file_type().is_file())
        .filter_map(|e| {
            let p = e.path();
            let stripped = p.strip_prefix(cwd).unwrap_or(p).to_string_lossy();
            let rel: Cow<'_, str> = if stripped.contains('\\') {
                Cow::Owned(stripped.replace('\\', "/"))
            } else { stripped };
            if ign.is_match(rel.as_ref()) || !inc.is_match(rel.as_ref()) {
                None
            } else {
                Some(p.to_string_lossy().to_string())
            }
        })
        .collect();

    out.sort();
    out
}

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