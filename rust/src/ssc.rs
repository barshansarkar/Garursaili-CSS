// ═══════════════════════════════════════════════════════════════════
// GarurSaili-CSS — SSC (SUPER SONIC CYCLONE)
// ═══════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════
// GarurSaili-CSS 
// The Semantic Indian CSS Framework
// Author: Barshan Sarkar · Malda, West Bengal, India
// Version: 1.4.0
// ═══════════════════════════════════════════════════════════════════
use crate::css_input;
use crate::engine;
use crate::preflight;
use globset::GlobSetBuilder;
use rayon::prelude::*;
use rustc_hash::FxHashMap;
use serde::{Deserialize, Serialize};
use std::borrow::Cow;
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

    let class_sets: Vec<std::sync::Arc<Vec<String>>> = markup_files
        .par_iter()
        .filter_map(|p| engine::extract_cached(p))
        .collect();

    let mut all_classes: Vec<String> = Vec::with_capacity(
        class_sets.iter().map(|s| s.len()).sum()
    );
    for set in class_sets {
        all_classes.extend_from_slice(&set);
    }

    let mut unique: Vec<String> = {
        let mut seen = rustc_hash::FxHashSet::default();
        let mut v = Vec::with_capacity(all_classes.len());
        for c in all_classes {
            if seen.insert(c.clone()) { v.push(c); }
        }
        v
    };
    unique.sort_by(|a, b| {
        class_priority(a).cmp(&class_priority(b)).then_with(|| a.cmp(b))
    });

    let rules: Vec<(String, std::sync::Arc<str>)> = unique
        .par_iter()
        .filter_map(|cls| engine::build(cls, false).map(|r| (cls.clone(), r)))
        .collect();

    let mut base_blocks: Vec<String> = Vec::with_capacity(rules.len());
    let mut keyframes_seen: rustc_hash::FxHashSet<String> = rustc_hash::FxHashSet::default();
    let mut media_blocks: FxHashMap<String, Vec<String>> = FxHashMap::default();
    let mut dedupe: FxHashMap<String, Vec<String>> = FxHashMap::default();
    let mut order: Vec<String> = Vec::with_capacity(rules.len());

    for (_, rule) in &rules {
        for chunk in split_top_level(rule.as_ref()) {
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
    if opts.preflight {
    parts.push(preflight::preflight_arc().as_ref().to_string());
}
    if !base_blocks.is_empty() { parts.push(base_blocks.join("\n\n")); }

    let mut media_keys: Vec<String> = media_blocks.keys().cloned().collect();
    media_keys.sort_by_key(|a| extract_min_width(a));
    for m in media_keys {
        if let Some(blocks) = media_blocks.get(&m) {
            if !blocks.is_empty() {
                let at_rule = if m.starts_with("container") {
                    format!("@{}", m)
                } else {
                    format!("@media ({})", m)
                };
                parts.push(format!("{} {{\n{}\n}}", at_rule, blocks.join("\n\n")));
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
        engine::finalize_cached(&css, opts.minify, &targets)
            .as_ref()
            .to_string()
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

    if rule.starts_with("@container") {
        if let Some(open) = rule.find('{') {
            let header = rule[10..open].trim();
            let inner  = rule[open + 1..].trim_end_matches('}').trim().to_string();

            if !header.starts_with('(') && inner.starts_with("@container") {
                if let Some(inner_open) = inner.find('{') {
                    let inner_header = inner[10..inner_open].trim();
                    let body = inner[inner_open + 1..].trim_end_matches('}').trim();
                    if inner_header.starts_with('(') && inner_header.ends_with(')') {
                        let cond = &inner_header[1..inner_header.len() - 1];
                        return (Some(format!("container {} ({})", header, cond)), body.to_string());
                    }
                }
            }

            if let Some(space) = header.find(' ') {
                let name = &header[..space];
                let rest = header[space..].trim();
                if rest.starts_with('(') && rest.ends_with(')') {
                    let cond = &rest[1..rest.len() - 1];
                    return (Some(format!("container {} ({})", name, cond)), inner);
                }
            }

            if header.starts_with('(') && header.ends_with(')') {
                let cond = &header[1..header.len() - 1];
                return (Some(format!("container ({})", cond)), inner);
            }
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

#[inline]
fn class_priority(cls: &str) -> u8 {
    if is_primitive(cls) { return 1; }
    if cls.contains('[') { return 5; }
    if cls.starts_with('@') { return 3; }
    if cls.contains(':') { return 4; }
    2
}

// ═══════════════════════════════════════════════════════════════════
// is_primitive — marks classes that should appear FIRST in output
// ═══════════════════════════════════════════════════════════════════

fn is_primitive(cls: &str) -> bool {
    // ═══════════════════════════════════════════════════════════════
    // ⭐ INTENT SHORTHANDS
    // ═══════════════════════════════════════════════════════════════

    // ── Layout ──
    if matches!(cls,
        "mid" | "mid-x" | "mid-y" | "mid-screen" |
        "apart" | "apart-mid" | "even" | "around" |
        "chips" | "auto-grid" | "masonry-lite" |
        "jumbo" | "section-air" | "section-tight" |
        "row-tight" | "stack-tight"
    ) { return true; }

    if cls.starts_with("row-") || cls.starts_with("stack-")
        || cls.starts_with("wrap-") || cls.starts_with("centered-")
        || cls.starts_with("cols-") {
        return true;
    }

    // ── Position ──
    if matches!(cls,
        "pinned" | "pinned-blur" | "pinned-bottom" |
        "docked-top" | "docked-bottom" | "docked-left" | "docked-right" |
        "overlay-full" | "overlay-screen" | "overlay-dim" |
        "tucked" | "tucked-tl" | "tucked-bl" | "tucked-br" |
        "centered-abs" | "above" | "above-all" | "behind"
    ) { return true; }

    // ── Visual ──
    if matches!(cls,
        "rise" | "rise-sm" | "rise-lg" | "sunken" | "flat" |
        "faded" | "dim" | "ghosted" | "solid" |
        "smooth" | "quick" | "lazy" |
        "grow" | "shrink" | "lift" | "press" | "glow-up" |
        "aurora" | "mist" |
        "outlined" | "dashed" | "dotted"
    ) { return true; }

    // ── Feedback ──
    if matches!(cls,
        "clickable" | "tappable" | "locked" | "draggable" | "busy" |
        "alive" | "dead" | "busy-dot"
    ) { return true; }

    if cls.starts_with("tag-") { return true; }

    // ── Content ──
    if matches!(cls,
        "clip" | "balance" | "pretty" | "ghost" | "unghost" |
        "tiny" | "small" | "body" | "lead" |
        "title" | "headline" | "display" | "banner" |
        "quiet" | "subtle-text" | "strong" |
        "hr" | "hr-text"
    ) { return true; }

    if cls.starts_with("fit-") { return true; }

    // ── Form ──
    if matches!(cls,
        "invalid" | "valid" | "field-ro" |
        "cta" | "cta-soft" | "cta-ghost" | "textfield"
    ) { return true; }

    // ── Indian ──
    if matches!(cls,
        "namaste" | "lotus" | "banyan" | "rangoli" | "mehndi" |
        "diya" | "tilak" | "ghat" |
        "tandava" | "lasya" | "chakra" |
        "monsoon" | "saffron"
    ) { return true; }

    // ═══════════════════════════════════════════════════════════════
    // TIER B — Extended Intent
    // ═══════════════════════════════════════════════════════════════

    if matches!(cls,
        "status-online" | "status-away" | "status-busy" |
        "status-offline" | "status-alive"
    ) { return true; }

    if matches!(cls, "trend-up" | "trend-down" | "trend-flat") { return true; }

    if matches!(cls,
        "notification-dot" | "notification-badge" | "notify-wrap"
    ) { return true; }

    if matches!(cls,
        "menu" | "menu-item" | "menu-item-active" |
        "menu-divider" | "menu-label"
    ) { return true; }

    if matches!(cls,
        "hamburger" | "drawer" | "drawer-right" | "drawer-overlay"
    ) { return true; }

    if matches!(cls,
        "search" | "search-input" | "search-icon" |
        "search-clear" | "search-result"
    ) { return true; }

    if matches!(cls, "shortcut" | "kbd-group" | "kbd-sep") { return true; }

    if matches!(cls,
        "rating" | "rating-stars" | "rating-count" | "rating-value"
    ) { return true; }

    if matches!(cls,
        "price" | "price-lg" | "price-old" | "price-discount"
    ) { return true; }

    if matches!(cls,
        "comment" | "comment-avatar" | "comment-body" |
        "comment-author" | "comment-time" | "comment-text"
    ) { return true; }

    if matches!(cls,
        "testimonial" | "testimonial-quote" | "testimonial-author" |
        "testimonial-name" | "testimonial-role"
    ) { return true; }

    if matches!(cls,
        "post-card" | "post-meta" | "post-title" | "post-excerpt"
    ) { return true; }

    if cls == "divider-text" { return true; }

    if matches!(cls,
        "video-wrapper" | "image-cover" | "gallery" |
        "gallery-item" | "gallery-overlay"
    ) { return true; }

    if matches!(cls,
        "loader" | "loader-lg" | "loading-overlay" | "loading-dots"
    ) { return true; }

    if matches!(cls,
        "error-state" | "success-state" | "empty-state-icon"
    ) { return true; }

    if matches!(cls,
        "stack-mobile" | "hide-mobile" | "show-mobile" |
        "only-mobile" | "hide-desktop"
    ) { return true; }

    // ═══════════════════════════════════════════════════════════════
    // COMPAT SHORTHANDS
    // ═══════════════════════════════════════════════════════════════

    if matches!(cls, "iblock" | "iflex" | "igrid") { return true; }

    if matches!(cls,
        "jc-center" | "jc-between" | "jc-around" | "jc-evenly" | "jc-start" | "jc-end"
        | "ai-center" | "ai-baseline" | "ai-start" | "ai-end" | "ai-stretch"
        | "as-center" | "as-start" | "as-end"
        | "ac-between" | "ac-center" | "ac-around"
        | "fx-1" | "fx-auto" | "fx-none" | "fx-init"
    ) { return true; }

    if cls.starts_with("gx-") || cls.starts_with("gy-") { return true; }

    if matches!(cls,
        "minw-0" | "minw-full" | "maxw-full"
        | "minh-0" | "minh-full" | "minh-screen" | "maxh-screen"
        | "sz-full"
    ) { return true; }

    if cls.starts_with("sz-") || cls.starts_with("maxw-") { return true; }

    if cls.starts_with("gc-") || cls.starts_with("gr-")
        || cls.starts_with("cs-") || cls.starts_with("rs-") {
        return true;
    }

    if matches!(cls,
        "sh" | "sh-sm" | "sh-md" | "sh-lg" | "sh-xl" | "sh-none"
    ) { return true; }

    if cls.starts_with("op-") || cls.starts_with("dur-") { return true; }

    if cls.starts_with("cur-") { return true; }
    if matches!(cls, "sel-n" | "sel-t" | "sel-all") { return true; }

    if matches!(cls,
        "ar-video" | "ar-square" | "ar-photo" | "ar-portrait" | "ar-wide"
        | "ob-cover" | "ob-contain" | "ob-fill" | "ob-none"
    ) { return true; }

    // ═══════════════════════════════════════════════════════════════
    // WEB KIT
    // ═══════════════════════════════════════════════════════════════

    if matches!(cls,
        "mesh-bg" | "grid-bg" | "noise-overlay" |
        "orb" | "orb-iris" | "orb-pink" | "orb-warm" |
        "float-slow" | "float-slower" |
        "gradient-text" | "glow-border" | "frosted" |
        "glass-pill" | "pill-dot" | "pulse-ring" |
        "display-hero" | "display-section" | "stat-num" |
        "btn-hero" | "btn-hero-primary" | "btn-hero-secondary" |
        "code-window" | "window-header" | "code-body" |
        "dot-red" | "dot-yellow" | "dot-green" |
        "syn-tag" | "syn-attr" | "syn-str" | "syn-punc" |
        "marquee" | "fade-edges" |
        "section-sm" | "section-lg" |
        "bento" | "bento-4" | "bento-6" | "bento-8" | "bento-12" |
        "faq-item" | "faq-q" | "faq-a" |
        "scrollbar-dark" | "selection-iris" |
        "inline-code"
    ) { return true; }

    // ═══════════════════════════════════════════════════════════════
    // TIER B PRIMITIVES
    // ═══════════════════════════════════════════════════════════════

    if matches!(cls,
        "card-header" | "card-body" | "card-footer" |
        "card-media" | "card-overlay" | "card-actions"
    ) { return true; }

    if matches!(cls,
        "modal-header" | "modal-body" | "modal-footer" | "modal-close"
    ) { return true; }

    if matches!(cls,
        "form-group" | "form-row" | "input-group" | "input-icon" |
        "field-label" | "field-hint" | "field-error" | "field-success"
    ) { return true; }

    if matches!(cls,
        "product-card" | "cart-item" | "cart-item-image" | "cart-item-info"
    ) { return true; }

    if matches!(cls,
        "empty-state-icon" | "avatar-group-count"
    ) { return true; }

    // ═══════════════════════════════════════════════════
    if matches!(cls,
    // PREMIUM kit — spotlight
    "spotlight" | "spotlight-sm" | "spotlight-lg" |
    "spotlight-white" | "spotlight-pink" |
    // gradient borders
    "border-gradient" | "border-gradient-hover" |
    "border-gradient-iris" | "border-gradient-pink" |
    "border-gradient-blue" | "border-gradient-emerald" |
    "border-beam" | "card-gradient" |
    // colored glows
    "glow-iris" | "glow-pink" | "glow-blue" |
    "glow-emerald" | "glow-amber" | "glow-ruby" |
    "glow-white" | "glow-soft" |
    "glow-inner-iris" | "glow-inner-white" |
    "text-glow-iris" | "text-glow-white" |
    // terminal
    "terminal-prompt" | "cursor-blink" | "terminal-cursor" |
    "terminal-line" | "terminal-ok" | "terminal-warn" |
    "terminal-err" | "terminal-dim" |
    // Garur display typography
    "hero-garur" | "display-garur" |
    "section-garur" | "section-garur-sm" |
    "title-garur" | "lead-garur" |
    // animated backgrounds
    "dot-grid" | "dot-grid-lg" | "aurora-bg" |
    "beam" | "beam-white" | "scan-line" |
    "radial-fade" | "top-fade" | "bottom-fade" | "spot-glow" |
    // hover effects
    "hover-glow" | "hover-glow-soft" |
    "hover-lift" | "hover-lift-sm" |
    "hover-scale" | "hover-scale-sm" |
    "hover-bright" | "hover-bright-sm" | "hover-tilt" |
    // marquee variants
    "marquee-slow" | "marquee-fast" |
    "marquee-reverse" | "marquee-pause" |
    // shine
    "shine" | "shine-always" | "shine-border"
) { return true; }
    matches!(
        cls,
        "center" | "center-x"
        | "row" | "row-center" | "row-between" | "row-around" | "row-evenly" | "row-start" | "row-end"
        | "stack" | "stack-center" | "stack-between" | "stack-start" | "stack-end"
        | "cluster" | "cluster-center"
        | "hstack" | "vstack"
        | "grid-1" | "grid-2" | "grid-3" | "grid-4" | "grid-5" | "grid-6"
        | "grid-7" | "grid-8" | "grid-9" | "grid-10" | "grid-11" | "grid-12"
        | "grid-auto" | "grid-auto-fill" | "split" | "spacer"
        | "main" | "aside"
        | "section" | "page-section"
        | "hero" | "hero-sm" | "hero-lg"
        | "cover" | "fixed-cover" | "fixed-center" | "abs-center"
        | "sticky-top" | "scroll-y" | "scroll-x"
        | "aspect-square" | "aspect-video" | "aspect-photo"
        | "container" | "container-sm" | "container-md" | "container-lg"
        | "container-xl" | "container-2xl" | "container-fluid" | "container-pad"
        | "page-title" | "page-subtitle"
        | "hero-title" | "hero-subtitle"
        | "section-title" | "section-subtitle"
        | "card-title" | "card-text"
        | "stat-value" | "stat-label" | "stat-change"
        | "muted" | "subtle" | "hint"
        | "card" | "card-flat" | "card-raised" | "card-interactive" | "card-glass"
        | "surface" | "surface-muted" | "surface-glass"
        | "avatar" | "avatar-sm" | "avatar-lg" | "avatar-xl"
        | "avatar-square" | "avatar-ring" | "avatar-group"
        | "divider" | "divider-vertical" | "divider-dashed" | "divider-dotted"
        | "btn" | "btn-primary" | "btn-secondary" | "btn-ghost" | "btn-outline"
        | "btn-danger" | "btn-success" | "btn-warning" | "btn-info"
        | "btn-sm" | "btn-lg" | "btn-icon" | "btn-icon-sm" | "btn-block"
        | "input" | "input-error" | "input-sm" | "input-lg"
        | "textarea" | "select" | "label" | "field" | "help-text"
        | "switch" | "checkbox" | "radio"
        | "badge" | "badge-primary" | "badge-success" | "badge-danger"
        | "badge-warning" | "badge-info" | "badge-muted" | "badge-dot"
        | "chip"
        | "alert" | "alert-info" | "alert-success" | "alert-danger" | "alert-warning"
        | "toast" | "toast-success" | "toast-danger" | "toast-info" | "toast-warning"
        | "progress" | "progress-bar" | "progress-success" | "progress-danger"
        | "progress-lg" | "progress-sm"
        | "spinner" | "spinner-sm" | "spinner-lg"
        | "skeleton" | "skeleton-text" | "skeleton-circle"
        | "overlay" | "modal" | "modal-sm" | "modal-lg" | "modal-full"
        | "tooltip" | "dropdown" | "dropdown-menu" | "dropdown-item"
        | "navbar" | "navbar-sticky" | "navbar-brand" | "navbar-link"
        | "site-header" | "site-footer"
        | "sidebar" | "sidebar-item" | "sidebar-item-active"
        | "breadcrumb" | "breadcrumb-item" | "breadcrumb-sep" | "breadcrumb-current"
        | "pagination" | "page-item" | "page-item-active"
        | "tabs" | "tab" | "tab-active"
        | "stepper" | "step" | "step-active" | "step-complete" | "step-divider"
        | "accordion" | "accordion-item" | "accordion-header" | "accordion-body"
        | "table" | "table-striped" | "table-hover" | "table-bordered"
        | "table-cell" | "table-head"
        | "timeline" | "timeline-item"
        | "stat" | "empty-state" | "rating" | "prose"
        | "code-inline" | "code-block"
        | "link" | "link-muted" | "link-nav"
        | "kbd"
        | "interactive-primary" | "interactive-ghost" | "interactive-danger"
        | "focus-ring"
        | "glass" | "glow" | "gradient-primary" | "gradient-surface"
        | "shimmer" | "divider-gap"
    )
}