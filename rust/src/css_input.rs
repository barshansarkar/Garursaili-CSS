// ═══════════════════════════════════════════════════════════════════
// CSS input processor — @theme extraction + @apply expansion
// ═══════════════════════════════════════════════════════════════════

use crate::engine;
use crate::variants::{apply_variants, parse_variant};
use once_cell::sync::Lazy;
use regex::Regex;
use rustc_hash::FxHashMap;

#[derive(Default, Clone)]
pub struct ThemeTokens {
    pub colors:  FxHashMap<String, String>,
    pub spacing: FxHashMap<String, String>,
    pub radius:  FxHashMap<String, String>,
    pub font:    FxHashMap<String, String>,
    pub raw:     FxHashMap<String, String>,
}

impl ThemeTokens {
    pub fn merge(&mut self, other: ThemeTokens) {
        self.colors.extend(other.colors);
        self.spacing.extend(other.spacing);
        self.radius.extend(other.radius);
        self.font.extend(other.font);
        self.raw.extend(other.raw);
    }

    pub fn flat_palette(&self) -> FxHashMap<String, String> {
        self.colors.clone()
    }

    pub fn is_empty(&self) -> bool {
        self.colors.is_empty() && self.spacing.is_empty()
            && self.radius.is_empty() && self.font.is_empty()
            && self.raw.is_empty()
    }
}

static THEME_BLOCK_RE: Lazy<Regex> = Lazy::new(|| {
    Regex::new(r"@theme(?:\s+(?:inline|static|default))?\s*\{([^}]*)\}").unwrap()
});

static THEME_VAR_RE: Lazy<Regex> = Lazy::new(|| {
    Regex::new(r"--([a-zA-Z0-9_-]+)\s*:\s*([^;]+);").unwrap()
});

static APPLY_RE: Lazy<Regex> = Lazy::new(|| {
    Regex::new(r"@apply\s+([^;]+);").unwrap()
});

pub fn parse_theme(css: &str) -> (String, ThemeTokens) {
    let mut tokens = ThemeTokens::default();
    if !css.contains("@theme") {
        return (css.to_string(), tokens);
    }
    let mut out = String::with_capacity(css.len());
    let mut last_end = 0;

    for cap in THEME_BLOCK_RE.captures_iter(css) {
        let m = cap.get(0).unwrap();
        out.push_str(&css[last_end..m.start()]);
        last_end = m.end();

        let body = &cap[1];
        for var_cap in THEME_VAR_RE.captures_iter(body) {
            let key = var_cap[1].trim();
            let val = var_cap[2].trim();

            if let Some(rest) = key.strip_prefix("color-") {
                tokens.colors.insert(rest.to_string(), val.to_string());
            } else if let Some(rest) = key.strip_prefix("spacing-") {
                tokens.spacing.insert(rest.to_string(), val.to_string());
            } else if let Some(rest) = key.strip_prefix("radius-") {
                tokens.radius.insert(rest.to_string(), val.to_string());
            } else if let Some(rest) = key.strip_prefix("font-") {
                tokens.font.insert(rest.to_string(), val.to_string());
            }
            tokens.raw.insert(key.to_string(), val.to_string());
        }
    }
    out.push_str(&css[last_end..]);

    if !tokens.raw.is_empty() {
        out.push_str("\n\n/* ── @theme vars ── */\n:root {\n");
        let mut keys: Vec<&String> = tokens.raw.keys().collect();
        keys.sort();
        for k in keys {
            out.push_str("  --");
            out.push_str(k);
            out.push_str(": ");
            out.push_str(&tokens.raw[k]);
            out.push_str(";\n");
        }
        out.push_str("}\n");
    }
    (out, tokens)
}

pub fn extract_theme(css: &str) -> String {
    parse_theme(css).0
}

pub fn expand_apply(css: &str) -> Result<String, String> {
    if !css.contains("@apply") {
        return Ok(css.to_string());
    }
    let mut out = String::with_capacity(css.len() + 64);
    let mut last_end = 0;

    for cap in APPLY_RE.captures_iter(css) {
        let m = cap.get(0).unwrap();
        out.push_str(&css[last_end..m.start()]);
        last_end = m.end();

        let class_list = cap[1].trim();
        let mut decls = String::with_capacity(class_list.len() * 8);

        for cls in class_list.split_ascii_whitespace() {
            let (prefixes, base) = split_variants(cls);

            let base_decl = match engine::build(base, true) {
                Some(d) => d,
                None => return Err(format!("@apply: unknown utility `{}`", cls)),
            };

            if prefixes.is_empty() {
                if !decls.is_empty() { decls.push(' '); }
                decls.push_str(&base_decl);
                if !base_decl.ends_with(';') { decls.push(';'); }
            } else {
                let parsed: Vec<_> = prefixes.iter().map(|p| parse_variant(p)).collect();
                let sel = apply_variants("&", &parsed, "class");
                if !decls.is_empty() { decls.push(' '); }
                decls.push_str(&sel);
                decls.push_str(" { ");
                decls.push_str(&base_decl);
                decls.push_str("; }");
            }
        }
        out.push_str(&decls);
    }
    out.push_str(&css[last_end..]);
    Ok(out)
}

fn split_variants(cls: &str) -> (Vec<String>, &str) {
    let bytes = cls.as_bytes();
    let mut depth = 0i32;
    let mut splits: Vec<usize> = Vec::with_capacity(2);
    for (i, &c) in bytes.iter().enumerate() {
        match c {
            b'[' => depth += 1,
            b']' => { if depth > 0 { depth -= 1; } }
            b':' if depth == 0 => splits.push(i),
            _ => {}
        }
    }
    if splits.is_empty() { return (Vec::new(), cls); }
    let base_start = splits.last().unwrap() + 1;
    let base = &cls[base_start..];
    let mut prefixes = Vec::with_capacity(splits.len());
    let mut prev = 0;
    for &s in &splits {
        prefixes.push(cls[prev..s].to_string());
        prev = s + 1;
    }
    (prefixes, base)
}

pub fn process_css(css: &str) -> Result<(String, ThemeTokens), String> {
    let (stripped, tokens) = parse_theme(css);
    let expanded = expand_apply(&stripped)?;
    Ok((expanded, tokens))
}