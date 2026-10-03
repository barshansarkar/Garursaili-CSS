// ═══════════════════════════════════════════════════════════════════
// GarurSaili-CSS — Native Core (lib.rs)
// Thin napi layer. All heavy work in engine.rs / ssc.rs
// ═══════════════════════════════════════════════════════════════════

use memmap2::Mmap;
use napi::bindgen_prelude::*;
use napi_derive::napi;
use std::fs::File;

mod advanced;
mod engine;
mod ssc;
mod utilities;
mod variants;

// ───────────────────────────────────────────────
// Types
// ───────────────────────────────────────────────

#[napi(object)]
#[derive(Clone)]
pub struct ParsedToken {
    pub raw: String,
    pub key: String,
    pub value: String,
    pub negative: bool,
    pub important: bool,
}

#[napi(object)]
pub struct ScanResult {
    pub path: String,
    pub classes: Vec<String>,
}

// ───────────────────────────────────────────────
// Config
// ───────────────────────────────────────────────

#[napi]
pub fn init_config(config_json: String) -> Result<()> {
    engine::init_config(&config_json).map_err(Error::from_reason)
}

#[napi]
pub fn init_handler(palette_json: String) -> Result<()> {
    engine::init_handler(&palette_json).map_err(Error::from_reason)
}

// ───────────────────────────────────────────────
// Parser / Lexer
// ───────────────────────────────────────────────

#[napi]
pub fn parse(token: String) -> Result<ParsedToken> {
    engine::parse(&token)
        .map(|t| ParsedToken {
            raw: t.raw,
            key: t.key,
            value: t.value,
            negative: t.negative,
            important: t.important,
        })
        .map_err(Error::from_reason)
}

#[napi]
pub fn parse_batch(tokens: Vec<String>) -> Vec<Option<ParsedToken>> {
    use rayon::prelude::*;
    tokens
        .par_iter()
        .map(|t| {
            engine::parse(t).ok().map(|p| ParsedToken {
                raw: p.raw,
                key: p.key,
                value: p.value,
                negative: p.negative,
                important: p.important,
            })
        })
        .collect()
}

#[napi]
pub fn lex(class_string: String) -> Vec<String> {
    engine::lex(&class_string)
}

#[napi]
pub fn clear_parse_cache() {
    engine::clear_parse_cache();
}

// ───────────────────────────────────────────────
// Builder
// ───────────────────────────────────────────────

#[napi]
pub fn build(cls: String, inline: Option<bool>) -> Option<String> {
    engine::build(&cls, inline.unwrap_or(false))
}

#[napi]
pub fn build_batch(classes: Vec<String>) -> Vec<Option<String>> {
    use rayon::prelude::*;
    classes.par_iter().map(|c| engine::build(c, false)).collect()
}

#[napi]
pub fn clear_cache() {
    engine::clear_cache();
}

// ───────────────────────────────────────────────
// Extractor / Scanner
// ───────────────────────────────────────────────

#[napi]
pub fn extract_classes(content: String) -> Vec<String> {
    engine::extract(&content)
}

#[napi]
pub fn extract_from_file(path: String) -> Option<Vec<String>> {
    let file = File::open(&path).ok()?;
    let meta = file.metadata().ok()?;
    if meta.len() > 5 * 1024 * 1024 {
        return None;
    }
    let mmap = unsafe { Mmap::map(&file).ok()? };
    let content = std::str::from_utf8(&mmap).ok()?;
    Some(engine::extract(content))
}

#[napi]
pub fn scan_files(files: Vec<String>) -> Vec<ScanResult> {
    use rayon::prelude::*;
    files
        .into_par_iter()
        .filter_map(|p| {
            let file = File::open(&p).ok()?;
            let meta = file.metadata().ok()?;
            if meta.len() > 5 * 1024 * 1024 {
                return None;
            }
            let mmap = unsafe { Mmap::map(&file).ok()? };
            let content = std::str::from_utf8(&mmap).ok()?;
            Some(ScanResult {
                path: p,
                classes: engine::extract(content),
            })
        })
        .collect()
}

#[napi]
pub fn find_files(cwd: String, include: Vec<String>, ignore: Vec<String>) -> Vec<String> {
    ssc::find_files(&cwd, &include, &ignore)
}

// ───────────────────────────────────────────────
// Full SSC build
// ───────────────────────────────────────────────

#[napi]
pub fn run_ssc(files: Vec<String>, config_json: String) -> String {
    ssc::run(&files, &config_json)
}

// ───────────────────────────────────────────────
// Minify
// ───────────────────────────────────────────────

#[napi]
pub fn minify_css(css: String) -> String {
    engine::minify(&css)
}

// ───────────────────────────────────────────────
// Hash
// ───────────────────────────────────────────────

#[napi]
pub fn hash_string(s: String) -> String {
    use xxhash_rust::xxh3::xxh3_64;
    format!("{:016x}", xxh3_64(s.as_bytes()))
}

#[napi]
pub fn hash_file(path: String) -> Result<String> {
    use xxhash_rust::xxh3::xxh3_64;
    let bytes = std::fs::read(&path).map_err(|e| Error::from_reason(e.to_string()))?;
    Ok(format!("{:016x}", xxh3_64(&bytes)))
}

// ───────────────────────────────────────────────
// Cache (bincode)
// ───────────────────────────────────────────────

#[napi]
pub fn cache_load(path: String) -> Result<String> {
    let data = std::fs::read(&path).map_err(|e| Error::from_reason(e.to_string()))?;
    ssc::cache_decode(&data).map_err(Error::from_reason)
}

#[napi]
pub fn cache_save(path: String, json: String) -> Result<()> {
    let bytes = ssc::cache_encode(&json).map_err(Error::from_reason)?;
    let tmp = format!("{}.tmp", path);
    std::fs::write(&tmp, &bytes).map_err(|e| Error::from_reason(e.to_string()))?;
    std::fs::rename(&tmp, &path).map_err(|e| Error::from_reason(e.to_string()))?;
    Ok(())
}

// ───────────────────────────────────────────────
// ★ Cache statistics (NEW)
// ───────────────────────────────────────────────

#[napi]
pub fn cache_stats() -> String {
    serde_json::to_string(&engine::cache_stats())
        .unwrap_or_else(|_| "{}".into())
}

#[napi]
pub fn reset_cache_stats() {
    engine::reset_cache_stats();
}

// ───────────────────────────────────────────────
// Version
// ───────────────────────────────────────────────

#[napi]
pub fn version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

#[napi]
pub fn warmup_classes(classes: Vec<String>) {
    engine::warmup(&classes);
}

#[napi]
pub fn has_utility(cls: String) -> bool {
    engine::build(&cls, false).is_some()
}