// ═══════════════════════════════════════════════════════════════════
// Engine — parse + escape + build + extract + finalize
// ═══════════════════════════════════════════════════════════════════

use crate::palette_default;
use crate::plugin;
use crate::sanitize::{is_safe_arbitrary, is_safe_property};
use crate::utilities;
use crate::variants::{
    apply_variants, collect_media_queries, collect_min_max_bps, collect_pointer_queries,
    collect_supports, has_starting_style, parse_variant, Variant, CONTAINER_SIZES,
};
use once_cell::sync::Lazy;
use regex::Regex;
use rustc_hash::FxHashMap;
use serde::{Deserialize, Serialize};
use std::borrow::Cow;
use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::{Arc, RwLock};

const MAX_CACHE: usize = 50_000;
const INIT_UTIL_CAP: usize = 32_768;
const INIT_PAL_CAP: usize = 512;

pub static BUILD_HITS: AtomicU64 = AtomicU64::new(0);
pub static BUILD_MISSES: AtomicU64 = AtomicU64::new(0);
pub static PARSE_HITS: AtomicU64 = AtomicU64::new(0);
pub static PARSE_MISSES: AtomicU64 = AtomicU64::new(0);

#[derive(serde::Serialize, serde::Deserialize, Default)]
pub struct CacheSnapshot {
    pub version: u32,
    pub palette_hash: u64,
    pub entries: Vec<(String, Option<String>)>,
}

pub fn export_cache_snapshot() -> CacheSnapshot {
    let palette_hash = PALETTE_HASH.read().map(|h| *h).unwrap_or(0);
    let entries: Vec<(String, Option<String>)> = BUILD_CACHE
        .read()
        .map(|c| c.iter().map(|(k, v)| (k.clone(), v.clone())).collect())
        .unwrap_or_default();
    CacheSnapshot { version: 1, palette_hash, entries }
}

pub fn import_cache_snapshot(snap: CacheSnapshot) -> bool {
    let current_hash = PALETTE_HASH.read().map(|h| *h).unwrap_or(0);
    if snap.palette_hash != current_hash && snap.palette_hash != 0 {
        return false;
    }
    if let Ok(mut c) = BUILD_CACHE.write() {
        c.reserve(snap.entries.len());
        for (k, v) in snap.entries {
            c.insert(k, v);
        }
    }
    true
}

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
    pub targets: Vec<String>,
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
            targets: vec!["> 0.5%".into(), "last 2 versions".into(), "not dead".into()],
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
    targets: Option<Vec<String>>,
}

static CONFIG: Lazy<RwLock<Arc<GarurConfig>>> =
    Lazy::new(|| RwLock::new(Arc::new(GarurConfig::default())));
static UTILS: Lazy<RwLock<FxHashMap<String, String>>> =
    Lazy::new(|| RwLock::new(FxHashMap::with_capacity_and_hasher(INIT_UTIL_CAP, Default::default())));
static PALETTE: Lazy<RwLock<FxHashMap<String, String>>> =
    Lazy::new(|| RwLock::new(FxHashMap::with_capacity_and_hasher(INIT_PAL_CAP, Default::default())));
static PARSE_CACHE: Lazy<RwLock<FxHashMap<String, Arc<Token>>>> =
    Lazy::new(|| RwLock::new(FxHashMap::default()));
static BUILD_CACHE: Lazy<RwLock<FxHashMap<String, Option<String>>>> =
    Lazy::new(|| RwLock::new(FxHashMap::default()));
static PALETTE_HASH: Lazy<RwLock<u64>> = Lazy::new(|| RwLock::new(0));

static CLASS_RE: Lazy<Regex> = Lazy::new(|| {
    Regex::new(
        r#"(?:class|className|data-garur)\s*=\s*(?:"([^"]+)"|'([^']+)'|`([^`]+)`|\{["']([^"']+)["']\}|\{`([^`]+)`\})"#,
    ).unwrap()
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
        let mut guard = CONFIG.write().map_err(|_| "config lock")?;
        let cfg = Arc::make_mut(&mut *guard);

        if let Some(bps) = parsed.breakpoints {
            let mut v: Vec<(String, String)> = bps.into_iter().collect();
            v.sort_by_key(|(_, w)| w.trim_end_matches("px").parse::<u32>().unwrap_or(0));
            cfg.breakpoints = v;
        }
        if let Some(dm) = parsed.dark_mode { cfg.dark_mode = dm; }
        if let Some(imp) = parsed.important { cfg.important = imp; }
        if let Some(t) = parsed.targets { cfg.targets = t; }
    }

    let user_extra = parsed.palette.as_ref().map(|p| p.len()).unwrap_or(0);
    let mut flat: FxHashMap<String, String> =
        FxHashMap::with_capacity_and_hasher(palette_default::DEFAULT_PALETTE.len() + user_extra, Default::default());

    for (k, v) in palette_default::DEFAULT_PALETTE {
        flat.insert((*k).to_string(), (*v).to_string());
    }

    if let Some(pal) = parsed.palette {
        for (color, shades) in pal {
            match shades {
                serde_json::Value::String(s) => { flat.insert(color, s); }
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
    }

    if let Ok(mut p) = PALETTE.write() { *p = flat.clone(); }
    regenerate_utils(&flat);
    Ok(())
}

pub fn init_handler(json: &str) -> Result<(), String> {
    let pal: FxHashMap<String, String> =
        serde_json::from_str(json).map_err(|e| format!("palette parse: {}", e))?;

    let mut flat: FxHashMap<String, String> = FxHashMap::with_capacity_and_hasher(
        palette_default::DEFAULT_PALETTE.len() + pal.len(),
        Default::default(),
    );
    for (k, v) in palette_default::DEFAULT_PALETTE {
        flat.insert((*k).to_string(), (*v).to_string());
    }
    for (k, v) in pal { flat.insert(k, v); }

    if let Ok(mut p) = PALETTE.write() { *p = flat.clone(); }
    regenerate_utils(&flat);
    Ok(())
}

fn regenerate_utils(palette: &FxHashMap<String, String>) {
    use xxhash_rust::xxh3::xxh3_64;

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

    let changed = PALETTE_HASH.read().map(|h| *h != new_hash).unwrap_or(true);
    let utils_empty = UTILS.read().map(|u| u.is_empty()).unwrap_or(true);
    if !changed && !utils_empty { return; }

    let mut map = utilities::generate(palette);
    plugin::merge_into(&mut map);

    if let Ok(mut u) = UTILS.write() { *u = map; }
    if let Ok(mut c) = BUILD_CACHE.write() { c.clear(); }
    if let Ok(mut h) = PALETTE_HASH.write() { *h = new_hash; }
}

pub fn clear_cache() {
    if let Ok(mut c) = BUILD_CACHE.write() { c.clear(); }
    if let Ok(mut c) = PARSE_CACHE.write() { c.clear(); }
    reset_cache_stats();
}

pub fn clear_parse_cache() {
    if let Ok(mut c) = PARSE_CACHE.write() { c.clear(); }
}

// ───────────────────────────────────────────────
// Parser
// ───────────────────────────────────────────────

pub fn parse(token: &str) -> Result<Arc<Token>, String> {
    if token.is_empty() { return Err("parse: empty token".into()); }

    if let Ok(c) = PARSE_CACHE.read() {
        if let Some(t) = c.get(token) {
            PARSE_HITS.fetch_add(1, Ordering::Relaxed);
            return Ok(Arc::clone(t));
        }
    }
    PARSE_MISSES.fetch_add(1, Ordering::Relaxed);

    let mut raw = token;
    let (mut neg, mut imp) = (false, false);
    while raw.starts_with('!') { imp = true; raw = &raw[1..]; }
    if raw.starts_with('-') { neg = true; raw = &raw[1..]; }

    let result = Arc::new(if let Some(open) = raw.find('[') {
        match find_bracket(raw.as_bytes(), open) {
            Some(close) => {
                let mut ke = open;
                if ke > 0 && raw.as_bytes()[ke - 1] == b'-' { ke -= 1; }
                if ke == 0 { return Err("parse: empty key".into()); }
                Token {
                    raw: token.into(),
                    key: raw[..ke].into(),
                    value: raw[open + 1..close].into(),
                    negative: neg, important: imp,
                }
            }
            None => return Err("parse: unclosed bracket".into()),
        }
    } else if let Some(i) = raw.rfind('-') {
        if i == 0 { return Err("parse: empty key".into()); }
        Token {
            raw: token.into(),
            key: raw[..i].into(),
            value: raw[i + 1..].into(),
            negative: neg, important: imp,
        }
    } else {
        Token {
            raw: token.into(),
            key: raw.into(),
            value: String::new(),
            negative: neg, important: imp,
        }
    });

    if let Ok(mut c) = PARSE_CACHE.write() {
        if c.len() >= MAX_CACHE { c.clear(); }
        c.insert(token.to_string(), Arc::clone(&result));
    }
    Ok(result)
}

fn find_bracket(s: &[u8], open: usize) -> Option<usize> {
    let (mut depth, mut sq, mut dq, mut bt) = (0i32, false, false, false);
    let mut i = open;
    while i < s.len() {
        let c = s[i];
        let p = if i > 0 { s[i - 1] } else { 0 };
        if c == b'\'' && !dq && !bt && p != b'\\' { sq = !sq; }
        else if c == b'"' && !sq && !bt && p != b'\\' { dq = !dq; }
        else if c == b'`' && !sq && !dq && p != b'\\' { bt = !bt; }
        if sq || dq || bt { i += 1; continue; }
        if c == b'[' { depth += 1; }
        else if c == b']' {
            depth -= 1;
            if depth == 0 { return Some(i); }
        }
        i += 1;
    }
    None
}

#[inline]
pub fn lex(s: &str) -> Vec<String> {
    s.split_ascii_whitespace().map(String::from).collect()
}

// ───────────────────────────────────────────────
// Escape — byte fast-path
// ───────────────────────────────────────────────

#[inline]
pub fn escape_class(cls: &str) -> Cow<'_, str> {
    let bytes = cls.as_bytes();
    if bytes.is_empty() { return Cow::Borrowed(cls); }

    let first = bytes[0];
    let first_needs = first.is_ascii_digit()
        || (first == b'-' && bytes.len() > 1 && bytes[1].is_ascii_digit());

    if !first_needs {
        let mut all_safe = true;
        for &b in bytes {
            if !(b.is_ascii_alphanumeric() || b == b'-' || b == b'_') {
                all_safe = false;
                break;
            }
        }
        if all_safe { return Cow::Borrowed(cls); }
    }

    let mut out = String::with_capacity(cls.len() + 8);
    for (i, ch) in cls.chars().enumerate() {
        let is_alnum = ch.is_ascii_alphanumeric();
        let is_dash = ch == '-';
        let is_us = ch == '_';
        if is_alnum || is_dash || is_us {
            if i == 0 && ch.is_ascii_digit() {
                out.push('\\');
            }
            if i == 0 && is_dash && cls.len() > 1 {
                if cls.as_bytes().get(1).map_or(false, |b| b.is_ascii_digit()) {
                    out.push('\\');
                }
            }
            out.push(ch);
        } else {
            out.push('\\');
            out.push(ch);
        }
    }
    Cow::Owned(out)
}

// ───────────────────────────────────────────────
// Prefix splitting
// ───────────────────────────────────────────────

fn split_prefixes(cls: &str) -> (Vec<String>, String) {
    let bytes = cls.as_bytes();
    let mut depth = 0i32;
    let mut splits: Vec<usize> = Vec::with_capacity(4);
    for (i, &c) in bytes.iter().enumerate() {
        match c {
            b'[' => depth += 1,
            b']' => { if depth > 0 { depth -= 1; } }
            b':' if depth == 0 => splits.push(i),
            _ => {}
        }
    }
    if splits.is_empty() { return (Vec::new(), cls.to_string()); }
    let base_start = splits.last().unwrap() + 1;
    let base = cls[base_start..].to_string();
    let mut prefixes = Vec::with_capacity(splits.len());
    let mut prev = 0;
    for &s in &splits {
        prefixes.push(cls[prev..s].to_string());
        prev = s + 1;
    }
    (prefixes, base)
}

// ───────────────────────────────────────────────
// Query wrapping — batch, single pass
// ───────────────────────────────────────────────

fn wrap_all_queries(
    rule: &str,
    bps: &[String],
    media: &[String],
    supports: &[String],
    pointer_queries: &[String],
    min_max_bps: &[String],
    starting: bool,
    cfg: &GarurConfig,
) -> String {
    let total = starting as usize
        + bps.len()
        + media.len()
        + supports.len()
        + pointer_queries.len()
        + min_max_bps.len();
    if total == 0 {
        return rule.to_string();
    }

    let mut wrappers: Vec<String> = Vec::with_capacity(total);

    if starting {
        wrappers.push("@starting-style".to_string());
    }

    if !bps.is_empty() {
        // Sort largest -> smallest (so tightest bp ends up innermost)
        let mut sorted: Vec<&String> = bps.iter().collect();
        sorted.sort_by(|a, b| {
            let wa: u32 = cfg.breakpoints.iter().find(|(n, _)| n == *a)
                .map(|(_, w)| w.trim_end_matches("px").parse().unwrap_or(0)).unwrap_or(0);
            let wb: u32 = cfg.breakpoints.iter().find(|(n, _)| n == *b)
                .map(|(_, w)| w.trim_end_matches("px").parse().unwrap_or(0)).unwrap_or(0);
            wb.cmp(&wa)
        });
        for bp in sorted {
            if let Some((_, w)) = cfg.breakpoints.iter().find(|(n, _)| n == bp) {
                let mut s = String::with_capacity(20 + w.len());
                s.push_str("@media (min-width: ");
                s.push_str(w);
                s.push(')');
                wrappers.push(s);
            }
        }
    }

    for m in min_max_bps {
        let mut s = String::with_capacity(9 + m.len());
        s.push_str("@media (");
        s.push_str(m);
        s.push(')');
        wrappers.push(s);
    }
    for p in pointer_queries {
        let mut s = String::with_capacity(9 + p.len());
        s.push_str("@media (");
        s.push_str(p);
        s.push(')');
        wrappers.push(s);
    }
    for m in media {
        let mut s = String::with_capacity(9 + m.len());
        s.push_str("@media (");
        s.push_str(m);
        s.push(')');
        wrappers.push(s);
    }
    for s in supports {
        let mut buf = String::with_capacity(11 + s.len());
        buf.push_str("@supports (");
        buf.push_str(s);
        buf.push(')');
        wrappers.push(buf);
    }

    // wrappers[0] = innermost, wrappers[last] = outermost
    let overhead: usize = wrappers.iter().map(|w| w.len() + 5).sum::<usize>() + wrappers.len();
    let mut out = String::with_capacity(rule.len() + overhead);
    for w in wrappers.iter().rev() {
        out.push_str(w);
        out.push_str(" { ");
    }
    out.push_str(rule);
    for _ in 0..wrappers.len() {
        out.push_str(" }");
    }
    out
}

// ───────────────────────────────────────────────
// Arbitrary utility (SANITIZED)
// ───────────────────────────────────────────────

fn arbitrary_utility(key: &str, value: &str, negative: bool) -> Option<String> {
    if !is_safe_property(key) || !is_safe_arbitrary(value) {
        return None;
    }

    let v: Cow<str> = if negative && !value.starts_with('-') {
        Cow::Owned(format!("-{}", value))
    } else {
        Cow::Borrowed(value)
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
        "ps" => format!("padding-inline-start:{}", v),
        "pe" => format!("padding-inline-end:{}", v),
        "mt" => format!("margin-top:{}", v),
        "mr" => format!("margin-right:{}", v),
        "mb" => format!("margin-bottom:{}", v),
        "ml" => format!("margin-left:{}", v),
        "ms" => format!("margin-inline-start:{}", v),
        "me" => format!("margin-inline-end:{}", v),
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
        "start" => format!("inset-inline-start:{}", v),
        "end" => format!("inset-inline-end:{}", v),
        "z" => format!("z-index:{}", v),
        "opacity" => format!("opacity:{}", v),
        "rounded" => format!("border-radius:{}", v),
        "border" => format!("border-width:{}", v),
        "border-t" => format!("border-top-width:{}", v),
        "border-r" => format!("border-right-width:{}", v),
        "border-b" => format!("border-bottom-width:{}", v),
        "border-l" => format!("border-left-width:{}", v),
        "border-x" => format!("border-left-width:{};border-right-width:{}", v, v),
        "border-y" => format!("border-top-width:{};border-bottom-width:{}", v, v),
        "shadow" => format!("box-shadow:{}", v),
        "text-shadow" => format!("text-shadow:{}", v),
        "text" => {
            if v.starts_with('#') || v.starts_with("rgb") || v.starts_with("hsl")
                || v.starts_with("var") || v.starts_with("oklch") || v.starts_with("color(")
                || v.starts_with("lab(") || v.starts_with("lch(") || v.starts_with("color-mix(") {
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
        "rotate" => format!("--garur-rotate:{};transform:rotate(var(--garur-rotate))", v),
        "rotate-x" => format!("--garur-rotate-x:{};transform:rotateX(var(--garur-rotate-x))", v),
        "rotate-y" => format!("--garur-rotate-y:{};transform:rotateY(var(--garur-rotate-y))", v),
        "scale" => format!("--garur-scale-x:{};--garur-scale-y:{};transform:scaleX(var(--garur-scale-x)) scaleY(var(--garur-scale-y))", v, v),
        "scale-x" => format!("--garur-scale-x:{};transform:scaleX(var(--garur-scale-x))", v),
        "scale-y" => format!("--garur-scale-y:{};transform:scaleY(var(--garur-scale-y))", v),
        "translate-x" => format!("--garur-translate-x:{};transform:translateX(var(--garur-translate-x))", v),
        "translate-y" => format!("--garur-translate-y:{};transform:translateY(var(--garur-translate-y))", v),
        "skew-x" => format!("--garur-skew-x:{};transform:skewX(var(--garur-skew-x))", v),
        "skew-y" => format!("--garur-skew-y:{};transform:skewY(var(--garur-skew-y))", v),
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
            "display:-webkit-box;-webkit-line-clamp:{};-webkit-box-orient:vertical;overflow:hidden", v),
        "duration" => format!("transition-duration:{}", v),
        "delay" => format!("transition-delay:{}", v),
        "content" => format!("content:{}", v),
        "scroll-m" => format!("scroll-margin:{}", v),
        "scroll-p" => format!("scroll-padding:{}", v),
        "order" => format!("order:{}", v),
        "outline-offset" => format!("outline-offset:{}", v),
        "anchor-name" => format!("anchor-name:{}", v),
        "position-anchor" => format!("position-anchor:{}", v),
        "position-area" => format!("position-area:{}", v),
        "position-try" => format!("position-try-fallbacks:{}", v),
        "position-visibility" => format!("position-visibility:{}", v),
        "perspective" => format!("perspective:{}", v),
        "translate-z" => format!("--garur-translate-z:{};transform:translateZ(var(--garur-translate-z))", v),
        "scale-z" => format!("--garur-scale-z:{};transform:scaleZ(var(--garur-scale-z))", v),
        "font" => format!("font-family:{}", v),
        _ => return None,
    };
    Some(out)
}

#[inline]
fn apply_important<'a>(decl: &'a str, token_important: bool, config_important: bool) -> Cow<'a, str> {
    if !token_important || config_important { return Cow::Borrowed(decl); }
    let mut out = String::with_capacity(decl.len() + 24);
    let mut first = true;
    for part in decl.split(';') {
        let t = part.trim();
        if t.is_empty() { continue; }
        if !first { out.push(';'); }
        first = false;
        out.push_str(t);
        if !t.contains("!important") { out.push_str(" !important"); }
    }
    Cow::Owned(out)
}

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
    let mut parts: Vec<String> = Vec::with_capacity(4);
    for part in decl.split(';') {
        let p = part.trim();
        if p.is_empty() { continue; }
        if let Some(colon) = p.find(':') {
            let (prop, val) = p.split_at(colon);
            let v = val[1..].trim();
            let is_color_prop = prop.ends_with("-color") || prop == "color"
                || prop == "fill" || prop == "stroke" || prop == "caret-color"
                || prop == "accent-color" || prop == "text-decoration-color";
            if is_color_prop {
                if v.starts_with('#') {
                    parts.push(format!("{}:{}", prop, hex_to_rgba_inline(v, alpha)));
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

fn expand_nested_decls(decl: &str, selector: &str) -> String {
    if !decl.contains('&') {
        let mut s = String::with_capacity(selector.len() + decl.len() + 6);
        s.push_str(selector);
        s.push_str(" { ");
        s.push_str(decl);
        s.push_str("; }");
        return s;
    }
    let mut out = String::with_capacity(decl.len() + selector.len() * 2 + 32);
    let mut current = String::with_capacity(64);
    let mut depth = 0;
    for ch in decl.chars() {
        if ch == '{' { depth += 1; }
        current.push(ch);
        if ch == '}' {
            depth -= 1;
            if depth == 0 {
                if let Some(open) = current.find('{') {
                    let child_sel = current[..open].trim();
                    let child_decl = current[open + 1..current.len() - 1].trim();
                    let final_sel = child_sel.replace('&', selector);
                    out.push_str(&final_sel);
                    out.push_str(" { ");
                    out.push_str(child_decl);
                    out.push_str(" }\n");
                }
                current.clear();
            }
        }
    }
    out.trim_end().to_string()
}

fn keyframes_for_class(cls: &str) -> Option<&'static str> {
    match cls {
        "animate-spin" => Some("@keyframes garur-spin { to { transform: rotate(360deg); } }"),
        "animate-ping" => Some("@keyframes garur-ping { 75%, 100% { transform: scale(2); opacity: 0; } }"),
        "animate-pulse" => Some("@keyframes garur-pulse { 50% { opacity: .5; } }"),
        "animate-bounce" => Some("@keyframes garur-bounce { 0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); } 50% { transform: none; animation-timing-function: cubic-bezier(0, 0, 0.2, 1); } }"),
        "animate-wiggle" => Some("@keyframes garur-wiggle { 0%, 100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }"),
        "animate-float" => Some("@keyframes garur-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }"),
        "animate-shake" => Some("@keyframes garur-shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }"),
        "animate-fade-in" => Some("@keyframes garur-fade-in { from { opacity: 0; } to { opacity: 1; } }"),
        "animate-fade-out" => Some("@keyframes garur-fade-out { from { opacity: 1; } to { opacity: 0; } }"),
        "animate-slide-in-top" => Some("@keyframes garur-slide-in-top { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }"),
        "animate-slide-in-bottom" => Some("@keyframes garur-slide-in-bottom { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }"),
        "animate-slide-in-left" => Some("@keyframes garur-slide-in-left { from { transform: translateX(-100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }"),
        "animate-slide-in-right" => Some("@keyframes garur-slide-in-right { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }"),
        "animate-zoom-in" => Some("@keyframes garur-zoom-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }"),
        "animate-zoom-out" => Some("@keyframes garur-zoom-out { from { transform: scale(1); opacity: 1; } to { transform: scale(0.95); opacity: 0; } }"),
        _ => None,
    }
}

fn resolve_theme<'a>(value: &'a str, palette: &FxHashMap<String, String>) -> Cow<'a, str> {
    if !value.contains("theme(") { return Cow::Borrowed(value); }

    let mut out = String::with_capacity(value.len() + 16);
    let mut rest = value;

    while let Some(idx) = rest.find("theme(") {
        out.push_str(&rest[..idx]);
        let after = &rest[idx + 6..];

        let mut depth = 1i32;
        let mut end = None;
        for (i, c) in after.char_indices() {
            match c {
                '(' => depth += 1,
                ')' => { depth -= 1; if depth == 0 { end = Some(i); break; } }
                _ => {}
            }
        }

        let Some(end) = end else {
            out.push_str(&rest[idx..]);
            return Cow::Owned(out);
        };

        let arg = after[..end].trim();
        let clean = arg.trim_matches(|c| c == '\'' || c == '"');
        let key = clean.strip_prefix("colors.").unwrap_or(clean);

        if let Some(color) = palette.get(key) {
            out.push_str(color);
        } else {
            out.push_str("theme(");
            out.push_str(arg);
            out.push(')');
        }
        rest = &after[end + 1..];
    }
    out.push_str(rest);
    Cow::Owned(out)
}

// ───────────────────────────────────────────────
// Main build
// ───────────────────────────────────────────────

pub fn build(cls: &str, inline: bool) -> Option<String> {
    if cls.is_empty() { return None; }

    if !inline {
        if let Ok(c) = BUILD_CACHE.read() {
            if let Some(v) = c.get(cls) {
                BUILD_HITS.fetch_add(1, Ordering::Relaxed);
                return v.clone();
            }
        }
    } else {
        // Prefix once, reuse the borrowed slice for the key to avoid a second alloc
        let mut key = String::with_capacity(cls.len() + 2);
        key.push_str("i:");
        key.push_str(cls);
        if let Ok(c) = BUILD_CACHE.read() {
            if let Some(v) = c.get(&key) {
                BUILD_HITS.fetch_add(1, Ordering::Relaxed);
                return v.clone();
            }
        }
        BUILD_MISSES.fetch_add(1, Ordering::Relaxed);
        let result = build_inner(cls, inline);
        if let Ok(mut c) = BUILD_CACHE.write() {
            if c.len() >= MAX_CACHE { c.clear(); }
            c.insert(key, result.clone());
        }
        return result;
    }
    BUILD_MISSES.fetch_add(1, Ordering::Relaxed);

    let result = build_inner(cls, inline);

    if let Ok(mut c) = BUILD_CACHE.write() {
        if c.len() >= MAX_CACHE { c.clear(); }
        c.insert(cls.to_string(), result.clone());
    }
    result
}

fn build_inner(cls: &str, inline: bool) -> Option<String> {
    let (prefixes, raw_base) = split_prefixes(cls);

    let (base, arbitrary_opacity): (String, Option<f64>) = {
        if let Some(slash) = raw_base.rfind("/[") {
            if raw_base.ends_with(']') {
                let inner = &raw_base[slash + 2..raw_base.len() - 1];
                let alpha = if inner.ends_with('%') {
                    inner.trim_end_matches('%').parse::<f64>().ok().map(|v| v / 100.0)
                } else {
                    inner.parse::<f64>().ok()
                };
                (raw_base[..slash].to_string(), alpha)
            } else {
                (raw_base, None)
            }
        } else {
            (raw_base, None)
        }
    };

    let (container_bps, named_containers, remaining_prefixes): (
        Vec<(String, String)>,
        Vec<String>,
        Vec<String>,
    ) = {
        let mut cq = Vec::with_capacity(2);
        let mut named = Vec::with_capacity(2);
        let mut rest = Vec::with_capacity(4);
        for p in prefixes {
            if let Some(name) = p.strip_prefix("@container/") {
                named.push(name.to_string());
            } else if let Some((cq_part, name_part)) = p.split_once('/') {
                if let Some((_, width)) = CONTAINER_SIZES.iter().find(|(n, _)| *n == cq_part) {
                    cq.push((cq_part.to_string(), (*width).to_string()));
                    named.push(name_part.to_string());
                } else {
                    rest.push(p);
                }
            } else if let Some((_, width)) = CONTAINER_SIZES.iter().find(|(n, _)| *n == p.as_str()) {
                cq.push((p, (*width).to_string()));
            } else {
                rest.push(p);
            }
        }
        (cq, named, rest)
    };

    let cfg: Arc<GarurConfig> = match CONFIG.read() {
        Ok(g) => Arc::clone(&g),
        Err(_) => return None,
    };

    let (bps, variants): (Vec<String>, Vec<String>) = {
        let mut b = Vec::with_capacity(4);
        let mut v = Vec::with_capacity(4);
        for p in remaining_prefixes {
            if cfg.breakpoints.iter().any(|(n, _)| n == &p) { b.push(p); }
            else { v.push(p); }
        }
        (b, v)
    };

    let parsed_variants: Vec<Variant> = variants.iter().map(|v| parse_variant(v)).collect();

    let media_queries = collect_media_queries(&parsed_variants, &cfg.dark_mode);
    let supports = collect_supports(&parsed_variants);
    let pointer_queries = collect_pointer_queries(&parsed_variants);
    let starting = has_starting_style(&parsed_variants);
    let min_max_bps = collect_min_max_bps(&parsed_variants, &cfg.breakpoints);

    let (base_stripped, base_neg, base_imp) = {
        let mut s = base.as_str();
        let mut n = false;
        let mut i = false;
        while s.starts_with('!') { i = true; s = &s[1..]; }
        if s.starts_with('-') { n = true; s = &s[1..]; }
        (s.to_string(), n, i)
    };

    // ── Path 1: [prop:value] arbitrary property
    if let Some(caps) = ARBITRARY_RE.captures(&base_stripped) {
        let prop = caps.get(1).unwrap().as_str().replace('_', "-");
        let raw_val = caps.get(2).unwrap().as_str().replace('_', " ");

        if !is_safe_property(&prop) || !is_safe_arbitrary(&raw_val) {
            return None;
        }

        let palette_snapshot = PALETTE.read().ok().map(|p| p.clone()).unwrap_or_default();
        let theme_resolved = resolve_theme(&raw_val, &palette_snapshot);
        let mut value = theme_resolved.into_owned();

        if base_neg && !value.starts_with('-') {
            value.insert(0, '-');
        }
        let decl_buf = format!("{}:{}", prop, value);
        let d = apply_important(&decl_buf, base_imp, cfg.important);

        if inline { return Some(d.into_owned()); }
        let escaped = escape_class(cls);
        let base_sel = format!(".{}", escaped);
        let sel = apply_variants(&base_sel, &parsed_variants, &cfg.dark_mode);
        let mut rule = String::with_capacity(sel.len() + d.len() + 6);
        rule.push_str(&sel);
        rule.push_str(" { ");
        rule.push_str(&d);
        rule.push_str("; }");

        let mut rule = wrap_all_queries(
            &rule, &bps, &media_queries, &supports,
            &pointer_queries, &min_max_bps, starting, &cfg,
        );
        for (_, w) in container_bps.iter().rev() {
            rule = format!("@container (min-width: {}) {{ {} }}", w, rule);
        }
        for name in named_containers.iter().rev() {
            rule = format!("@container {} {{ {} }}", name, rule);
        }
        return Some(rule);
    }

    let token = parse(&base).ok()?;

    // ── Path 2: arbitrary utility
    if base.contains('[') {
        let v = token.value.replace('_', " ");
        let palette_snapshot = PALETTE.read().ok().map(|p| p.clone()).unwrap_or_default();
        let theme_resolved = resolve_theme(&v, &palette_snapshot);
        let v = theme_resolved.into_owned();

        if let Some(d) = arbitrary_utility(&token.key, &v, token.negative) {
            let d = apply_important(&d, token.important, cfg.important);
            if inline { return Some(d.into_owned()); }
            let escaped = escape_class(cls);
            let base_sel = format!(".{}", escaped);
            let sel = apply_variants(&base_sel, &parsed_variants, &cfg.dark_mode);
            let mut rule = String::with_capacity(sel.len() + d.len() + 6);
            rule.push_str(&sel);
            rule.push_str(" { ");
            rule.push_str(&d);
            rule.push_str("; }");

            let mut rule = wrap_all_queries(
                &rule, &bps, &media_queries, &supports,
                &pointer_queries, &min_max_bps, starting, &cfg,
            );
            for (_, w) in container_bps.iter().rev() {
                rule = format!("@container (min-width: {}) {{ {} }}", w, rule);
            }
            for name in named_containers.iter().rev() {
                rule = format!("@container {} {{ {} }}", name, rule);
            }
            return Some(rule);
        }
    }

    let is_pseudo_el = parsed_variants.iter().any(|v| {
        matches!(v, Variant::PseudoEl("before") | Variant::PseudoEl("after"))
    });

    let utils = UTILS.read().ok()?;

    let static_lookup: Option<String> = if token.negative {
        let base_positive = base.trim_start_matches('-');
        let explicit_neg = format!("-{}", base_positive);
        if let Some(d) = utils.get(&explicit_neg) {
            Some(d.clone())
        } else if let Some(d) = utils.get(base_positive) {
            apply_negative(d)
        } else {
            None
        }
    } else {
        utils.get(&base).cloned()
    };
    drop(utils);

    let mut decl = match static_lookup {
        Some(d) => d,
        None => match try_dynamic_spacing(&base_stripped, base_neg) {
            Some(d) => d,
            None => return None,
        },
    };

    if is_pseudo_el && !decl.contains("content") {
        let mut s = String::with_capacity(decl.len() + 10);
        s.push_str("content:'';");
        s.push_str(&decl);
        decl = s;
    }

    if let Some(alpha) = arbitrary_opacity {
        decl = apply_opacity(&decl, alpha);
    }

    let decl_cow = apply_important(&decl, token.important, cfg.important);

    if inline {
        return Some(decl_cow.into_owned());
    }

    let escaped = escape_class(cls);
    let base_sel = format!(".{}", escaped);
    let sel = apply_variants(&base_sel, &parsed_variants, &cfg.dark_mode);

    let mut rule = if decl_cow.contains('&') {
        expand_nested_decls(&decl_cow, &sel)
    } else {
        let mut s = String::with_capacity(sel.len() + decl_cow.len() + 6);
        s.push_str(&sel);
        s.push_str(" { ");
        s.push_str(&decl_cow);
        s.push_str("; }");
        s
    };

    rule = wrap_all_queries(
        &rule, &bps, &media_queries, &supports,
        &pointer_queries, &min_max_bps, starting, &cfg,
    );

    for (_, w) in container_bps.iter().rev() {
        rule = format!("@container (min-width: {}) {{ {} }}", w, rule);
    }
    for name in named_containers.iter().rev() {
        rule = format!("@container {} {{ {} }}", name, rule);
    }

    if let Some(kf) = keyframes_for_class(&base) {
        rule = format!("{}\n{}", kf, rule);
    }

    Some(rule)
}

// ───────────────────────────────────────────────
// Dynamic spacing
// ───────────────────────────────────────────────

fn try_dynamic_spacing(stripped: &str, neg: bool) -> Option<String> {
    const MAP: &[(&str, &str)] = &[
        ("px-", "padding-left:{0};padding-right:{0}"),
        ("py-", "padding-top:{0};padding-bottom:{0}"),
        ("pt-", "padding-top:{0}"),
        ("pr-", "padding-right:{0}"),
        ("pb-", "padding-bottom:{0}"),
        ("pl-", "padding-left:{0}"),
        ("ps-", "padding-inline-start:{0}"),
        ("pe-", "padding-inline-end:{0}"),
        ("p-",  "padding:{0}"),

        ("mx-", "margin-left:{0};margin-right:{0}"),
        ("my-", "margin-top:{0};margin-bottom:{0}"),
        ("mt-", "margin-top:{0}"),
        ("mr-", "margin-right:{0}"),
        ("mb-", "margin-bottom:{0}"),
        ("ml-", "margin-left:{0}"),
        ("ms-", "margin-inline-start:{0}"),
        ("me-", "margin-inline-end:{0}"),
        ("m-",  "margin:{0}"),

        ("gap-x-", "column-gap:{0}"),
        ("gap-y-", "row-gap:{0}"),
        ("gap-",   "gap:{0}"),

        ("min-w-", "min-width:{0}"),
        ("min-h-", "min-height:{0}"),
        ("max-w-", "max-width:{0}"),
        ("max-h-", "max-height:{0}"),
        ("size-",  "width:{0};height:{0}"),
        ("w-",     "width:{0}"),
        ("h-",     "height:{0}"),
        ("basis-", "flex-basis:{0}"),

        ("inset-x-", "left:{0};right:{0}"),
        ("inset-y-", "top:{0};bottom:{0}"),
        ("inset-",   "inset:{0}"),
        ("top-",     "top:{0}"),
        ("right-",   "right:{0}"),
        ("bottom-",  "bottom:{0}"),
        ("left-",    "left:{0}"),
        ("start-",   "inset-inline-start:{0}"),
        ("end-",     "inset-inline-end:{0}"),

        ("scroll-mx-", "scroll-margin-left:{0};scroll-margin-right:{0}"),
        ("scroll-my-", "scroll-margin-top:{0};scroll-margin-bottom:{0}"),
        ("scroll-mt-", "scroll-margin-top:{0}"),
        ("scroll-mr-", "scroll-margin-right:{0}"),
        ("scroll-mb-", "scroll-margin-bottom:{0}"),
        ("scroll-ml-", "scroll-margin-left:{0}"),
        ("scroll-m-",  "scroll-margin:{0}"),
        ("scroll-px-", "scroll-padding-left:{0};scroll-padding-right:{0}"),
        ("scroll-py-", "scroll-padding-top:{0};scroll-padding-bottom:{0}"),
        ("scroll-pt-", "scroll-padding-top:{0}"),
        ("scroll-pr-", "scroll-padding-right:{0}"),
        ("scroll-pb-", "scroll-padding-bottom:{0}"),
        ("scroll-pl-", "scroll-padding-left:{0}"),
        ("scroll-p-",  "scroll-padding:{0}"),

        ("border-spacing-", "border-spacing:{0}"),
        ("outline-offset-", "outline-offset:{0}"),
        ("indent-", "text-indent:{0}"),
        ("leading-", "line-height:{0}"),
        ("underline-offset-", "text-underline-offset:{0}"),
        ("columns-", "columns:{0}"),

        ("z-",       "z-index:{0}"),
        ("order-",   "order:{0}"),
        ("opacity-", "opacity:calc({0} / 100)"),
        ("duration-", "transition-duration:{0}ms"),
        ("delay-",    "transition-delay:{0}ms"),
        ("stroke-",   "stroke-width:{0}"),

        ("grid-cols-", "grid-template-columns:repeat({0}, minmax(0, 1fr))"),
        ("grid-rows-", "grid-template-rows:repeat({0}, minmax(0, 1fr))"),
        ("col-span-", "grid-column:span {0} / span {0}"),
        ("row-span-", "grid-row:span {0} / span {0}"),
        ("col-start-", "grid-column-start:{0}"),
        ("col-end-",   "grid-column-end:{0}"),
        ("row-start-", "grid-row-start:{0}"),
        ("row-end-",   "grid-row-end:{0}"),
    ];

    for (prefix, template) in MAP {
        if let Some(rest) = stripped.strip_prefix(prefix) {
            if rest.is_empty() { continue; }
            if rest.contains('/') || rest.contains('%') || rest.contains('[') {
                continue;
            }
            if let Ok(n) = rest.parse::<f64>() {
                let n_used = if neg { -n } else { n };
                let n_str: Cow<str> = if n_used.fract() == 0.0 {
                    Cow::Owned(format!("{}", n_used as i64))
                } else {
                    Cow::Owned(format!("{}", n_used))
                };
                let v = format!("calc(var(--spacing, 0.25rem) * {})", n_str);
                return Some(template.replace("{0}", &v));
            }
        }
    }
    None
}

fn apply_negative(decl: &str) -> Option<String> {
    let mut out = String::with_capacity(decl.len() + 8);
    let mut first = true;
    let mut any = false;
    for part in decl.split(';') {
        let p = part.trim();
        if p.is_empty() { continue; }
        any = true;
        if !first { out.push(';'); }
        first = false;

        if let Some(colon) = p.find(':') {
            let prop = &p[..colon];
            let v = &p[colon + 1..];
            out.push_str(prop);
            out.push(':');
            if v.starts_with('-') {
                out.push_str(v.trim_start_matches('-'));
            } else if v.ends_with("px") || v.ends_with("rem") || v.ends_with("em")
                || v.ends_with('%') || v.ends_with("vh") || v.ends_with("vw")
                || v.ends_with("deg") || v.ends_with("svh") || v.ends_with("lvh")
                || v.ends_with("dvh") || v.ends_with("svw") || v.ends_with("lvw")
                || v.ends_with("dvw") {
                out.push('-');
                out.push_str(v);
            } else {
                out.push_str(v);
            }
        } else {
            out.push_str(p);
        }
    }
    if any { Some(out) } else { None }
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
                if seen.insert(t.to_string()) {
                    out.push(t.to_string());
                }
            }
        }
    }
    for cap in TMPL_RE.captures_iter(content) {
        let cleaned = INTERP_RE.replace_all(&cap[1], " ");
        for t in cleaned.split_ascii_whitespace() {
            if seen.insert(t.to_string()) {
                out.push(t.to_string());
            }
        }
    }
    out
}

pub fn minify(css: &str) -> String {
    let b = css.as_bytes();
    let mut out = Vec::with_capacity(b.len());
    let (mut com, mut sq, mut dq) = (false, false, false);
    let mut last: u8 = 0;
    let mut i = 0;

    while i < b.len() {
        let c = b[i];
        let n = if i + 1 < b.len() { b[i + 1] } else { 0 };

        if !sq && !dq && c == b'/' && n == b'*' { com = true; i += 2; continue; }
        if com {
            if c == b'*' && n == b'/' { com = false; i += 2; continue; }
            i += 1; continue;
        }

        if c == b'\'' && !dq { sq = !sq; }
        else if c == b'"' && !sq { dq = !dq; }

        if !sq && !dq && (c == b' ' || c == b'\n' || c == b'\t' || c == b'\r') {
            let last_ok = !matches!(last, 0 | b'{' | b';' | b':' | b' ');
            let next_ok = !matches!(n, b' ' | b'}' | b';' | b':' | 0);
            if last_ok && next_ok { out.push(b' '); last = b' '; }
            i += 1;
            continue;
        }
        out.push(c);
        last = c;
        i += 1;
    }
    let s = unsafe { String::from_utf8_unchecked(out) };
    let trimmed = s.trim();
    if trimmed.len() == s.len() { s } else { trimmed.to_string() }
}

pub fn finalize(css: &str, minify: bool, targets: &[String]) -> String {
    use lightningcss::stylesheet::{ParserOptions, PrinterOptions, StyleSheet};

    let sheet = match StyleSheet::parse(css, ParserOptions::default()) {
        Ok(s) => s,
        Err(_) => return css.to_string(),
    };

    let browser_targets = crate::browsers::resolve_targets(targets);

    let opts = PrinterOptions {
        minify,
        targets: lightningcss::targets::Targets {
            browsers: browser_targets,
            ..Default::default()
        },
        ..Default::default()
    };

    match sheet.to_css(opts) {
        Ok(res) => res.code,
        Err(_) => css.to_string(),
    }
}

pub fn current_targets() -> Vec<String> {
    CONFIG.read().map(|c| c.targets.clone()).unwrap_or_default()
}

pub fn warmup(classes: &[String]) {
    for c in classes {
        let _ = build(c, false);
    }
}