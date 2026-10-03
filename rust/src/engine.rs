// ═══════════════════════════════════════════════════════════════════
// Engine — parse + escape + build + extract + minify
// Uses variants.rs, utilities.rs, and advanced.rs for heavy lifting.
// ═══════════════════════════════════════════════════════════════════

use crate::utilities;
use crate::variants::{
    apply_variants, collect_container_queries, collect_media_queries,
    collect_min_max_bps, collect_pointer_queries, collect_supports,
    has_starting_style, parse_variant, Variant, CONTAINER_SIZES,
};
use once_cell::sync::Lazy;
use regex::Regex;
use rustc_hash::FxHashMap;
use serde::{Deserialize, Serialize};
use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::RwLock;

const MAX_CACHE: usize = 50_000;

// ───────────────────────────────────────────────
// Cache hit/miss counters
// ───────────────────────────────────────────────

pub static BUILD_HITS:   AtomicU64 = AtomicU64::new(0);
pub static BUILD_MISSES: AtomicU64 = AtomicU64::new(0);
pub static PARSE_HITS:   AtomicU64 = AtomicU64::new(0);
pub static PARSE_MISSES: AtomicU64 = AtomicU64::new(0);

#[derive(Serialize)]
pub struct CacheStats {
    pub build_hits: u64,
    pub build_misses: u64,
    pub parse_hits: u64,
    pub parse_misses: u64,
    pub build_entries: usize,
    pub parse_entries: usize,
    pub build_hit_rate: f64,
    pub parse_hit_rate: f64,
}

pub fn cache_stats() -> CacheStats {
    let bh = BUILD_HITS.load(Ordering::Relaxed);
    let bm = BUILD_MISSES.load(Ordering::Relaxed);
    let ph = PARSE_HITS.load(Ordering::Relaxed);
    let pm = PARSE_MISSES.load(Ordering::Relaxed);
    let bt = bh + bm;
    let pt = ph + pm;

    CacheStats {
        build_hits: bh,
        build_misses: bm,
        parse_hits: ph,
        parse_misses: pm,
        build_entries: BUILD_CACHE.read().map(|c| c.len()).unwrap_or(0),
        parse_entries: PARSE_CACHE.read().map(|c| c.len()).unwrap_or(0),
        build_hit_rate: if bt == 0 { 0.0 } else { (bh as f64 / bt as f64) * 100.0 },
        parse_hit_rate: if pt == 0 { 0.0 } else { (ph as f64 / pt as f64) * 100.0 },
    }
}

pub fn reset_cache_stats() {
    BUILD_HITS.store(0, Ordering::Relaxed);
    BUILD_MISSES.store(0, Ordering::Relaxed);
    PARSE_HITS.store(0, Ordering::Relaxed);
    PARSE_MISSES.store(0, Ordering::Relaxed);
}

// ───────────────────────────────────────────────
// Types
// ───────────────────────────────────────────────

#[derive(Clone, Debug)]
pub struct Token {
    pub raw: String,
    pub key: String,
    pub value: String,
    pub negative: bool,
    pub important: bool,
}

#[derive(Clone)]
pub struct GarurConfig {
    pub breakpoints: Vec<(String, String)>,
    pub dark_mode: String,
    pub important: bool,
}

impl Default for GarurConfig {
    fn default() -> Self {
        Self {
            breakpoints: vec![
                ("sm".into(), "640px".into()),
                ("md".into(), "768px".into()),
                ("lg".into(), "1024px".into()),
                ("xl".into(), "1280px".into()),
                ("2xl".into(), "1536px".into()),
            ],
            dark_mode: "class".into(),
            important: false,
        }
    }
}

#[derive(Deserialize, Default)]
struct ConfigJson {
    breakpoints: Option<FxHashMap<String, String>>,
    #[serde(rename = "darkMode")]
    dark_mode: Option<String>,
    important: Option<bool>,
    palette: Option<FxHashMap<String, serde_json::Value>>,
}

// ───────────────────────────────────────────────
// Globals
// ───────────────────────────────────────────────

static CONFIG: Lazy<RwLock<GarurConfig>> =
    Lazy::new(|| RwLock::new(GarurConfig::default()));
static UTILS: Lazy<RwLock<FxHashMap<String, String>>> =
    Lazy::new(|| RwLock::new(FxHashMap::default()));
static PALETTE: Lazy<RwLock<FxHashMap<String, String>>> =
    Lazy::new(|| RwLock::new(FxHashMap::default()));
static PARSE_CACHE: Lazy<RwLock<FxHashMap<String, Token>>> =
    Lazy::new(|| RwLock::new(FxHashMap::default()));
static BUILD_CACHE: Lazy<RwLock<FxHashMap<String, Option<String>>>> =
    Lazy::new(|| RwLock::new(FxHashMap::default()));
static PALETTE_HASH: Lazy<RwLock<u64>> = Lazy::new(|| RwLock::new(0));

static CLASS_RE: Lazy<Regex> = Lazy::new(|| {
    Regex::new(
        r#"(?:class|className|data-garur)\s*=\s*(?:"([^"]+)"|'([^']+)'|`([^`]+)`|\{["']([^"']+)["']\}|\{`([^`]+)`\})"#,
    )
    .unwrap()
});
static TMPL_RE: Lazy<Regex> =
    Lazy::new(|| Regex::new(r#"(?:class|className)=\{`([^`]+)`\}"#).unwrap());
static INTERP_RE: Lazy<Regex> = Lazy::new(|| Regex::new(r"\$\{[^}]*\}").unwrap());
static ARBITRARY_RE: Lazy<Regex> =
    Lazy::new(|| Regex::new(r"^\[([a-zA-Z0-9\-_]+):\s*([^\]]+)\]$").unwrap());

// ───────────────────────────────────────────────
// Config / Palette
// ───────────────────────────────────────────────

pub fn init_config(json: &str) -> Result<(), String> {
    let parsed: ConfigJson =
        serde_json::from_str(json).map_err(|e| format!("config parse: {}", e))?;

    {
        let mut cfg = CONFIG.write().map_err(|_| "config lock")?;
        if let Some(bps) = parsed.breakpoints {
            cfg.breakpoints = bps.into_iter().collect();
        }
        if let Some(dm) = parsed.dark_mode {
            cfg.dark_mode = dm;
        }
        if let Some(imp) = parsed.important {
            cfg.important = imp;
        }
    }

    if let Some(pal) = parsed.palette {
        let mut flat: FxHashMap<String, String> = FxHashMap::default();
        for (color, shades) in pal {
            match shades {
                serde_json::Value::String(s) => {
                    flat.insert(color, s);
                }
                serde_json::Value::Object(map) => {
                    for (shade, val) in map {
                        if let serde_json::Value::String(v) = val {
                            flat.insert(format!("{}-{}", color, shade), v);
                        }
                    }
                }
                _ => {}
            }
        }
        if let Ok(mut p) = PALETTE.write() {
            *p = flat.clone();
        }
        regenerate_utils(&flat);
    } else if let Ok(p) = PALETTE.read() {
        regenerate_utils(&p);
    }
    Ok(())
}

pub fn init_handler(json: &str) -> Result<(), String> {
    let pal: FxHashMap<String, String> =
        serde_json::from_str(json).map_err(|e| format!("palette parse: {}", e))?;
    if let Ok(mut p) = PALETTE.write() {
        *p = pal.clone();
    }
    regenerate_utils(&pal);
    Ok(())
}

/// Regenerate utilities. **Only** clears BUILD_CACHE if palette content
/// actually changed — this preserves cache hit rate across watch rebuilds.
fn regenerate_utils(palette: &FxHashMap<String, String>) {
    use xxhash_rust::xxh3::xxh3_64;

    // Deterministic palette hash
    let mut keys: Vec<&String> = palette.keys().collect();
    keys.sort();
    let mut buf = String::with_capacity(palette.len() * 24);
    for k in keys {
        buf.push_str(k);
        buf.push('=');
        buf.push_str(&palette[k]);
        buf.push(';');
    }
    let new_hash = xxh3_64(buf.as_bytes());

    let changed = PALETTE_HASH
        .read()
        .map(|h| *h != new_hash)
        .unwrap_or(true);

    let utils_empty = UTILS.read().map(|u| u.is_empty()).unwrap_or(true);

    if !changed && !utils_empty {
        // Palette unchanged → keep UTILS + BUILD_CACHE intact
        return;
    }

    let map = utilities::generate(palette);
    if let Ok(mut u) = UTILS.write() {
        *u = map;
    }
    if let Ok(mut c) = BUILD_CACHE.write() {
        c.clear();
    }
    if let Ok(mut h) = PALETTE_HASH.write() {
        *h = new_hash;
    }
}

pub fn clear_cache() {
    if let Ok(mut c) = BUILD_CACHE.write() {
        c.clear();
    }
    if let Ok(mut c) = PARSE_CACHE.write() {
        c.clear();
    }
    reset_cache_stats();
}

pub fn clear_parse_cache() {
    if let Ok(mut c) = PARSE_CACHE.write() {
        c.clear();
    }
}

// ───────────────────────────────────────────────
// Parser
// ───────────────────────────────────────────────

pub fn parse(token: &str) -> Result<Token, String> {
    if token.is_empty() {
        return Err("parse: empty token".into());
    }

    if let Ok(c) = PARSE_CACHE.read() {
        if let Some(t) = c.get(token) {
            PARSE_HITS.fetch_add(1, Ordering::Relaxed);
            return Ok(t.clone());
        }
    }
    PARSE_MISSES.fetch_add(1, Ordering::Relaxed);

    let mut raw = token;
    let (mut neg, mut imp) = (false, false);
    while raw.starts_with('!') {
        imp = true;
        raw = &raw[1..];
    }
    if raw.starts_with('-') {
        neg = true;
        raw = &raw[1..];
    }

    let result = if let Some(open) = raw.find('[') {
        match find_bracket(raw.as_bytes(), open) {
            Some(close) => {
                let mut ke = open;
                if ke > 0 && raw.as_bytes()[ke - 1] == b'-' {
                    ke -= 1;
                }
                if ke == 0 {
                    return Err("parse: empty key".into());
                }
                Token {
                    raw: token.into(),
                    key: raw[..ke].into(),
                    value: raw[open + 1..close].into(),
                    negative: neg,
                    important: imp,
                }
            }
            None => return Err("parse: unclosed bracket".into()),
        }
    } else if let Some(i) = raw.rfind('-') {
        if i == 0 {
            return Err("parse: empty key".into());
        }
        Token {
            raw: token.into(),
            key: raw[..i].into(),
            value: raw[i + 1..].into(),
            negative: neg,
            important: imp,
        }
    } else {
        Token {
            raw: token.into(),
            key: raw.into(),
            value: String::new(),
            negative: neg,
            important: imp,
        }
    };

    if let Ok(mut c) = PARSE_CACHE.write() {
        if c.len() >= MAX_CACHE {
            c.clear();
        }
        c.insert(token.into(), result.clone());
    }
    Ok(result)
}

fn find_bracket(s: &[u8], open: usize) -> Option<usize> {
    let (mut depth, mut sq, mut dq, mut bt) = (0i32, false, false, false);
    let mut i = open;
    while i < s.len() {
        let c = s[i];
        let p = if i > 0 { s[i - 1] } else { 0 };
        if c == b'\'' && !dq && !bt && p != b'\\' {
            sq = !sq;
        } else if c == b'"' && !sq && !bt && p != b'\\' {
            dq = !dq;
        } else if c == b'`' && !sq && !dq && p != b'\\' {
            bt = !bt;
        }
        if sq || dq || bt {
            i += 1;
            continue;
        }
        if c == b'[' {
            depth += 1;
        } else if c == b']' {
            depth -= 1;
            if depth == 0 {
                return Some(i);
            }
        }
        i += 1;
    }
    None
}

pub fn lex(s: &str) -> Vec<String> {
    s.split_ascii_whitespace()
        .filter(|t| !t.is_empty())
        .map(String::from)
        .collect()
}

// ───────────────────────────────────────────────
// Escape
// ───────────────────────────────────────────────

pub fn escape_class(cls: &str) -> String {
    let mut out = String::with_capacity(cls.len() + 8);
    for (i, ch) in cls.chars().enumerate() {
        let c = ch as u32;
        let is_alnum =
            (48..=57).contains(&c) || (65..=90).contains(&c) || (97..=122).contains(&c);
        let is_dash = ch == '-';
        let is_us = ch == '_';

        if is_alnum || is_dash || is_us {
            if i == 0 && c >= 48 && c <= 57 {
                out.push('\\');
            }
            if i == 0 && is_dash && cls.len() > 1 {
                if cls
                    .chars()
                    .nth(1)
                    .map(|c| c.is_ascii_digit())
                    .unwrap_or(false)
                {
                    out.push('\\');
                }
            }
            out.push(ch);
        } else {
            out.push('\\');
            out.push(ch);
        }
    }
    out
}

// ───────────────────────────────────────────────
// Prefix splitting (bracket-aware)
// ───────────────────────────────────────────────

fn split_prefixes(cls: &str) -> (Vec<String>, String) {
    let bytes = cls.as_bytes();
    let mut depth = 0i32;
    let mut splits: Vec<usize> = Vec::new();

    for (i, &c) in bytes.iter().enumerate() {
        match c {
            b'[' => depth += 1,
            b']' => {
                if depth > 0 {
                    depth -= 1;
                }
            }
            b':' if depth == 0 => splits.push(i),
            _ => {}
        }
    }

    if splits.is_empty() {
        return (Vec::new(), cls.to_string());
    }

    let base_start = splits.last().unwrap() + 1;
    let base = cls[base_start..].to_string();

    let mut prefixes = Vec::new();
    let mut prev = 0;
    for &s in &splits {
        prefixes.push(cls[prev..s].to_string());
        prev = s + 1;
    }
    (prefixes, base)
}

// ───────────────────────────────────────────────
// Query wrapping (all kinds)
// ───────────────────────────────────────────────

fn wrap_all_queries(
    rule: &str,
    bps: &[String],
    media: &[String],
    supports: &[String],
    pointer_queries: &[String],
    min_max_bps: &[String],
    starting: bool,
) -> String {
    let mut out = rule.to_string();

    if starting {
        out = format!("@starting-style {{ {} }}", out);
    }

    let cfg = match CONFIG.read() {
        Ok(c) => c,
        Err(_) => return out,
    };

    let mut sorted = bps.to_vec();
    sorted.sort_by(|a, b| {
        let wa: u32 = cfg
            .breakpoints
            .iter()
            .find(|(n, _)| n == a)
            .map(|(_, w)| w.trim_end_matches("px").parse().unwrap_or(0))
            .unwrap_or(0);
        let wb: u32 = cfg
            .breakpoints
            .iter()
            .find(|(n, _)| n == b)
            .map(|(_, w)| w.trim_end_matches("px").parse().unwrap_or(0))
            .unwrap_or(0);
        wb.cmp(&wa)
    });

    for bp in &sorted {
        if let Some((_, w)) = cfg.breakpoints.iter().find(|(n, _)| n == bp) {
            out = format!("@media (min-width: {}) {{ {} }}", w, out);
        }
    }
    drop(cfg);

    for m in min_max_bps {
        out = format!("@media ({}) {{ {} }}", m, out);
    }
    for p in pointer_queries {
        out = format!("@media ({}) {{ {} }}", p, out);
    }
    for m in media {
        out = format!("@media ({}) {{ {} }}", m, out);
    }
    for s in supports {
        out = format!("@supports ({}) {{ {} }}", s, out);
    }

    out
}

// ───────────────────────────────────────────────
// Arbitrary property [prop:value]
// ───────────────────────────────────────────────

fn arbitrary_utility(key: &str, value: &str, negative: bool) -> Option<String> {
    let v = if negative && !value.starts_with('-') {
        format!("-{}", value)
    } else {
        value.to_string()
    };

    let out = match key {
        "w" => format!("width:{}", v),
        "h" => format!("height:{}", v),
        "size" => format!("width:{};height:{}", v, v),
        "min-w" => format!("min-width:{}", v),
        "max-w" => format!("max-width:{}", v),
        "min-h" => format!("min-height:{}", v),
        "max-h" => format!("max-height:{}", v),
        "basis" => format!("flex-basis:{}", v),

        "p" => format!("padding:{}", v),
        "m" => format!("margin:{}", v),
        "px" => format!("padding-left:{};padding-right:{}", v, v),
        "py" => format!("padding-top:{};padding-bottom:{}", v, v),
        "mx" => format!("margin-left:{};margin-right:{}", v, v),
        "my" => format!("margin-top:{};margin-bottom:{}", v, v),
        "pt" => format!("padding-top:{}", v),
        "pr" => format!("padding-right:{}", v),
        "pb" => format!("padding-bottom:{}", v),
        "pl" => format!("padding-left:{}", v),
        "mt" => format!("margin-top:{}", v),
        "mr" => format!("margin-right:{}", v),
        "mb" => format!("margin-bottom:{}", v),
        "ml" => format!("margin-left:{}", v),
        "gap" => format!("gap:{}", v),
        "gap-x" => format!("column-gap:{}", v),
        "gap-y" => format!("row-gap:{}", v),

        "top" => format!("top:{}", v),
        "right" => format!("right:{}", v),
        "bottom" => format!("bottom:{}", v),
        "left" => format!("left:{}", v),
        "inset" => format!("inset:{}", v),
        "inset-x" => format!("left:{};right:{}", v, v),
        "inset-y" => format!("top:{};bottom:{}", v, v),
        "z" => format!("z-index:{}", v),

        "opacity" => format!("opacity:{}", v),
        "rounded" => format!("border-radius:{}", v),
        "border" => format!("border-width:{}", v),
        "border-t" => format!("border-top-width:{}", v),
        "border-r" => format!("border-right-width:{}", v),
        "border-b" => format!("border-bottom-width:{}", v),
        "border-l" => format!("border-left-width:{}", v),
        "shadow" => format!("box-shadow:{}", v),
        "text-shadow" => format!("text-shadow:{}", v),

        "text" => {
            if v.starts_with('#')
                || v.starts_with("rgb")
                || v.starts_with("hsl")
                || v.starts_with("var")
                || v.starts_with("oklch")
                || v.starts_with("color(")
            {
                format!("color:{}", v)
            } else {
                format!("font-size:{}", v)
            }
        }
        "bg" => format!("background-color:{}", v),
        "fill" => format!("fill:{}", v),
        "stroke" => format!("stroke:{}", v),
        "accent" => format!("accent-color:{}", v),
        "caret" => format!("caret-color:{}", v),

        "leading" => format!("line-height:{}", v),
        "tracking" => format!("letter-spacing:{}", v),
        "indent" => format!("text-indent:{}", v),
        "align" => format!("vertical-align:{}", v),

        "blur" => format!("filter:blur({})", v),
        "brightness" => format!("filter:brightness({})", v),
        "contrast" => format!("filter:contrast({})", v),
        "saturate" => format!("filter:saturate({})", v),
        "hue-rotate" => format!("filter:hue-rotate({})", v),
        "drop-shadow" => format!("filter:drop-shadow({})", v),
        "backdrop-blur" => format!("backdrop-filter:blur({})", v),
        "backdrop-brightness" => format!("backdrop-filter:brightness({})", v),
        "backdrop-contrast" => format!("backdrop-filter:contrast({})", v),
        "backdrop-saturate" => format!("backdrop-filter:saturate({})", v),
        "backdrop-hue-rotate" => format!("backdrop-filter:hue-rotate({})", v),

        "rotate" => format!("transform:rotate({})", v),
        "scale" => format!("transform:scale({})", v),
        "scale-x" => format!("transform:scaleX({})", v),
        "scale-y" => format!("transform:scaleY({})", v),
        "translate-x" => format!("transform:translateX({})", v),
        "translate-y" => format!("transform:translateY({})", v),
        "skew-x" => format!("transform:skewX({})", v),
        "skew-y" => format!("transform:skewY({})", v),

        "grid-cols" => format!("grid-template-columns:{}", v),
        "grid-rows" => format!("grid-template-rows:{}", v),
        "col-span" => format!("grid-column:span {} / span {}", v, v),
        "row-span" => format!("grid-row:span {} / span {}", v, v),
        "col-start" => format!("grid-column-start:{}", v),
        "col-end" => format!("grid-column-end:{}", v),
        "row-start" => format!("grid-row-start:{}", v),
        "row-end" => format!("grid-row-end:{}", v),

        "aspect" => format!("aspect-ratio:{}", v),
        "columns" => format!("columns:{}", v),
        "line-clamp" => format!(
            "display:-webkit-box;-webkit-line-clamp:{};-webkit-box-orient:vertical;overflow:hidden",
            v
        ),
        "duration" => format!("transition-duration:{}", v),
        "delay" => format!("transition-delay:{}", v),
        "content" => format!("content:{}", v),
        "scroll-m" => format!("scroll-margin:{}", v),
        "scroll-p" => format!("scroll-padding:{}", v),
        "order" => format!("order:{}", v),
        "outline-offset" => format!("outline-offset:{}", v),

        _ => return None,
    };
    Some(out)
}

// ───────────────────────────────────────────────
// Important
// ───────────────────────────────────────────────

fn apply_important(decl: &str, token_important: bool) -> String {
    let config_important = CONFIG.read().map(|c| c.important).unwrap_or(false);
    if !token_important || config_important {
        return decl.to_string();
    }

    let mut parts: Vec<String> = Vec::new();
    for part in decl.split(';') {
        let t = part.trim();
        if t.is_empty() {
            continue;
        }
        if t.contains("!important") {
            parts.push(t.to_string());
        } else {
            parts.push(format!("{} !important", t));
        }
    }
    parts.join(";")
}

// ───────────────────────────────────────────────
// Arbitrary opacity helper
// ───────────────────────────────────────────────

fn hex_to_rgba_inline(hex: &str, alpha: f64) -> String {
    let h = hex.trim_start_matches('#');
    let (r, g, b) = match h.len() {
        3 => (
            u8::from_str_radix(&h[0..1].repeat(2), 16).unwrap_or(0),
            u8::from_str_radix(&h[1..2].repeat(2), 16).unwrap_or(0),
            u8::from_str_radix(&h[2..3].repeat(2), 16).unwrap_or(0),
        ),
        6 => (
            u8::from_str_radix(&h[0..2], 16).unwrap_or(0),
            u8::from_str_radix(&h[2..4], 16).unwrap_or(0),
            u8::from_str_radix(&h[4..6], 16).unwrap_or(0),
        ),
        _ => return hex.to_string(),
    };
    format!("rgba({}, {}, {}, {})", r, g, b, alpha)
}

fn apply_opacity(decl: &str, alpha: f64) -> String {
    let alpha = alpha.clamp(0.0, 1.0);
    let mut parts: Vec<String> = Vec::new();

    for part in decl.split(';') {
        let p = part.trim();
        if p.is_empty() {
            continue;
        }
        if let Some(colon) = p.find(':') {
            let (prop, val) = p.split_at(colon);
            let v = val[1..].trim();

            let is_color_prop = prop.ends_with("-color")
                || prop == "color"
                || prop == "fill"
                || prop == "stroke"
                || prop == "caret-color"
                || prop == "accent-color"
                || prop == "text-decoration-color";

            if is_color_prop {
                if v.starts_with('#') {
                    let rgba = hex_to_rgba_inline(v, alpha);
                    parts.push(format!("{}:{}", prop, rgba));
                    continue;
                }
                if v.starts_with("rgb(") {
                    if let Some(inner) = v.strip_prefix("rgb(").and_then(|s| s.strip_suffix(')')) {
                        parts.push(format!("{}:rgba({}, {})", prop, inner, alpha));
                        continue;
                    }
                }
            }
            parts.push(p.to_string());
        } else {
            parts.push(p.to_string());
        }
    }
    parts.join(";")
}

// ───────────────────────────────────────────────
// Nested child selectors (& > ...)
// ───────────────────────────────────────────────

fn expand_nested_decls(decl: &str, selector: &str) -> String {
    if !decl.contains('&') {
        return format!("{} {{ {}; }}", selector, decl);
    }

    let mut out = String::new();
    let mut current = String::new();
    let mut depth = 0;

    for ch in decl.chars() {
        if ch == '{' {
            depth += 1;
        }
        current.push(ch);
        if ch == '}' {
            depth -= 1;
            if depth == 0 {
                if let Some(open) = current.find('{') {
                    let child_sel = current[..open].trim();
                    let child_decl = current[open + 1..current.len() - 1].trim();
                    let final_sel = child_sel.replace('&', selector);
                    out.push_str(&format!("{} {{ {} }}\n", final_sel, child_decl));
                }
                current.clear();
            }
        }
    }
    out.trim_end().to_string()
}

// ───────────────────────────────────────────────
// Main build
// ───────────────────────────────────────────────

pub fn build(cls: &str, inline: bool) -> Option<String> {
    if cls.is_empty() {
        return None;
    }

    let cache_key = if inline {
        format!("i:{}", cls)
    } else {
        cls.to_string()
    };

    // ─── Cache lookup with hit/miss tracking ───
    if let Ok(c) = BUILD_CACHE.read() {
        if let Some(v) = c.get(&cache_key) {
            BUILD_HITS.fetch_add(1, Ordering::Relaxed);
            return v.clone();
        }
    }
    BUILD_MISSES.fetch_add(1, Ordering::Relaxed);

    let result = build_inner(cls, inline);

    if let Ok(mut c) = BUILD_CACHE.write() {
        if c.len() >= MAX_CACHE {
            c.clear();
        }
        c.insert(cache_key, result.clone());
    }
    result
}

fn build_inner(cls: &str, inline: bool) -> Option<String> {
    let (prefixes, raw_base) = split_prefixes(cls);

    let (base, arbitrary_opacity): (String, Option<f64>) = {
        if let Some(slash) = raw_base.rfind("/[") {
            let inner_start = slash + 2;
            if raw_base.ends_with(']') {
                let inner = &raw_base[inner_start..raw_base.len() - 1];
                let alpha = if inner.ends_with('%') {
                    inner
                        .trim_end_matches('%')
                        .parse::<f64>()
                        .ok()
                        .map(|v| v / 100.0)
                } else {
                    inner.parse::<f64>().ok()
                };
                (raw_base[..slash].to_string(), alpha)
            } else {
                (raw_base.clone(), None)
            }
        } else {
            (raw_base.clone(), None)
        }
    };

    let (container_bps, remaining_prefixes): (Vec<(String, String)>, Vec<String>) = {
        let mut cq = Vec::new();
        let mut rest = Vec::new();
        for p in prefixes {
            if let Some((_, width)) = CONTAINER_SIZES.iter().find(|(n, _)| *n == p.as_str()) {
                cq.push((p.clone(), width.to_string()));
            } else {
                rest.push(p);
            }
        }
        (cq, rest)
    };
    let prefixes = remaining_prefixes;

    let (bps, variants): (Vec<String>, Vec<String>) = {
        let cfg = CONFIG.read().ok()?;
        prefixes
            .into_iter()
            .partition(|p| cfg.breakpoints.iter().any(|(n, _)| n == p))
    };

    let dark_mode = CONFIG
        .read()
        .ok()
        .map(|c| c.dark_mode.clone())
        .unwrap_or_else(|| "class".into());

    let media_queries = collect_media_queries(&variants, &dark_mode);
    let supports = collect_supports(&variants);
    let pointer_queries = collect_pointer_queries(&variants);
    let starting = has_starting_style(&variants);
    let min_max_bps = {
        let bp_map = CONFIG
            .read()
            .ok()
            .map(|c| c.breakpoints.clone())
            .unwrap_or_default();
        collect_min_max_bps(&variants, &bp_map)
    };
    let _ = collect_container_queries(&variants);

    let (base_stripped, base_neg, base_imp) = {
        let mut s = base.as_str();
        let mut n = false;
        let mut i = false;
        while s.starts_with('!') {
            i = true;
            s = &s[1..];
        }
        if s.starts_with('-') {
            n = true;
            s = &s[1..];
        }
        (s.to_string(), n, i)
    };

    // Path 1: [prop:value]
    if let Some(caps) = ARBITRARY_RE.captures(&base_stripped) {
        let prop = caps.get(1).unwrap().as_str().replace('_', "-");
        let mut value = caps.get(2).unwrap().as_str().replace('_', " ");
        if base_neg && !value.starts_with('-') {
            value = format!("-{}", value);
        }
        let d = apply_important(&format!("{}:{}", prop, value), base_imp);
        if inline {
            return Some(d);
        }
        let sel = format!(".{}", escape_class(cls));
        let sel = apply_variants(&sel, &variants, &dark_mode);
        let rule = format!("{} {{ {}; }}", sel, d);
        let mut rule = wrap_all_queries(
            &rule, &bps, &media_queries, &supports,
            &pointer_queries, &min_max_bps, starting,
        );
        for (_, w) in container_bps.iter().rev() {
            rule = format!("@container (min-width: {}) {{ {} }}", w, rule);
        }
        return Some(rule);
    }

    let token = parse(&base).ok()?;

    // Path 2: arbitrary utility
    if base.contains('[') {
        let v = token.value.replace('_', " ");
        if let Some(d) = arbitrary_utility(&token.key, &v, token.negative) {
            let d = apply_important(&d, token.important);
            if inline {
                return Some(d);
            }
            let sel = format!(".{}", escape_class(cls));
            let sel = apply_variants(&sel, &variants, &dark_mode);
            let rule = format!("{} {{ {}; }}", sel, d);
            let mut rule = wrap_all_queries(
                &rule, &bps, &media_queries, &supports,
                &pointer_queries, &min_max_bps, starting,
            );
            for (_, w) in container_bps.iter().rev() {
                rule = format!("@container (min-width: {}) {{ {} }}", w, rule);
            }
            return Some(rule);
        }
    }

    // Path 3: static lookup
    let is_pseudo_el = variants.iter().any(|v| {
        matches!(
            parse_variant(v),
            Variant::PseudoEl("before") | Variant::PseudoEl("after")
        )
    });

    let utils = UTILS.read().ok()?;

    let mut decl = if token.negative {
        let base_positive = base.trim_start_matches('-');
        let explicit_neg = format!("-{}", base_positive);
        if let Some(d) = utils.get(&explicit_neg) {
            d.clone()
        } else if let Some(d) = utils.get(base_positive) {
            match apply_negative(&d) {
                Some(neg) => neg,
                None => return None,
            }
        } else {
            return None;
        }
    } else {
        utils.get(&base).cloned()?
    };

    drop(utils);

    if is_pseudo_el && !decl.contains("content") {
        decl = format!("content:'';{}", decl);
    }

    if let Some(alpha) = arbitrary_opacity {
        decl = apply_opacity(&decl, alpha);
    }

    let decl = apply_important(&decl, token.important);

    if inline {
        return Some(decl);
    }

    let base_sel = format!(".{}", escape_class(cls));
    let sel = apply_variants(&base_sel, &variants, &dark_mode);

    let rule = if decl.contains('&') {
        expand_nested_decls(&decl, &sel)
    } else {
        format!("{} {{ {}; }}", sel, decl)
    };

    let mut rule = wrap_all_queries(
        &rule, &bps, &media_queries, &supports,
        &pointer_queries, &min_max_bps, starting,
    );

    for (_, w) in container_bps.iter().rev() {
        rule = format!("@container (min-width: {}) {{ {} }}", w, rule);
    }

    Some(rule)
}

fn apply_negative(decl: &str) -> Option<String> {
    let mut parts: Vec<String> = Vec::new();
    for part in decl.split(';') {
        let p = part.trim();
        if p.is_empty() {
            continue;
        }
        if let Some(colon) = p.find(':') {
            let (prop, val) = p.split_at(colon);
            let v = &val[1..];
            if v.starts_with('-') {
                parts.push(format!("{}:{}", prop, v.trim_start_matches('-')));
            } else if v.ends_with("px")
                || v.ends_with("rem")
                || v.ends_with("em")
                || v.ends_with('%')
                || v.ends_with("vh")
                || v.ends_with("vw")
                || v.ends_with("deg")
            {
                parts.push(format!("{}:-{}", prop, v));
            } else {
                parts.push(p.to_string());
            }
        } else {
            parts.push(p.to_string());
        }
    }
    if parts.is_empty() {
        None
    } else {
        Some(parts.join(";"))
    }
}

// ───────────────────────────────────────────────
// Extract
// ───────────────────────────────────────────────

pub fn extract(content: &str) -> Vec<String> {
    if !content.contains("class") && !content.contains("className") {
        return Vec::new();
    }
    let mut seen = rustc_hash::FxHashSet::default();
    let mut out: Vec<String> = Vec::with_capacity(64);

    for cap in CLASS_RE.captures_iter(content) {
        if let Some(s) = (1..=5).find_map(|i| cap.get(i)).map(|m| m.as_str()) {
            for t in s.split_ascii_whitespace() {
                if !t.is_empty() && seen.insert(t.to_string()) {
                    out.push(t.to_string());
                }
            }
        }
    }
    for cap in TMPL_RE.captures_iter(content) {
        let cleaned = INTERP_RE.replace_all(&cap[1], " ");
        for t in cleaned.split_ascii_whitespace() {
            if !t.is_empty() && seen.insert(t.to_string()) {
                out.push(t.to_string());
            }
        }
    }
    out
}

// ───────────────────────────────────────────────
// Minify
// ───────────────────────────────────────────────

pub fn minify(css: &str) -> String {
    let b = css.as_bytes();
    let mut out = Vec::with_capacity(b.len());
    let (mut com, mut sq, mut dq) = (false, false, false);
    let mut last: u8 = 0;
    let mut i = 0;

    while i < b.len() {
        let c = b[i];
        let n = if i + 1 < b.len() { b[i + 1] } else { 0 };

        if !sq && !dq && c == b'/' && n == b'*' {
            com = true;
            i += 2;
            continue;
        }
        if com {
            if c == b'*' && n == b'/' {
                com = false;
                i += 2;
                continue;
            }
            i += 1;
            continue;
        }

        if c == b'\'' && !dq {
            sq = !sq;
        } else if c == b'"' && !sq {
            dq = !dq;
        }

        if !sq && !dq && (c == b' ' || c == b'\n' || c == b'\t' || c == b'\r') {
            let last_ok = !matches!(last, 0 | b'{' | b';' | b':' | b' ');
            let next_ok = !matches!(n, b' ' | b'}' | b';' | b':' | 0);
            if last_ok && next_ok {
                out.push(b' ');
                last = b' ';
            }
            i += 1;
            continue;
        }
        out.push(c);
        last = c;
        i += 1;
    }
    String::from_utf8_lossy(&out).trim().to_string()
}

// ───────────────────────────────────────────────
// Warmup
// ───────────────────────────────────────────────

pub fn warmup(classes: &[String]) {
    for c in classes {
        let _ = build(c, false);
    }
}