// ═══════════════════════════════════════════════════════════════════
// GarurSaili-CSS — Native Core
// ═══════════════════════════════════════════════════════════════════

use memmap2::Mmap;
use napi::bindgen_prelude::*;
use napi_derive::napi;
use std::fs::File;

mod advanced;
mod browsers;
mod css_input;
mod engine;
mod palette_default;
mod plugin;
mod preflight;
mod sanitize;
mod ssc;
mod utilities;
mod utilities_extended;
mod utilities_v4;
mod variants;

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

#[napi(object)]
pub struct SscOpts {
    pub preflight: Option<bool>,
    pub minify: Option<bool>,
    pub vendor_prefix: Option<bool>,
}

#[napi]
pub fn init_config(config_json: String) -> Result<()> {
    engine::init_config(&config_json).map_err(Error::from_reason)
}

#[napi]
pub fn init_handler(palette_json: String) -> Result<()> {
    engine::init_handler(&palette_json).map_err(Error::from_reason)
}

#[napi]
pub fn parse(token: String) -> Result<ParsedToken> {
    engine::parse(&token)
        .map(|t| ParsedToken {
            raw: t.raw.clone(),
            key: t.key.clone(),
            value: t.value.clone(),
            negative: t.negative,
            important: t.important,
        })
        .map_err(Error::from_reason)
}

#[napi]
pub fn parse_batch(tokens: Vec<String>) -> Vec<Option<ParsedToken>> {
    use rayon::prelude::*;
    tokens.par_iter().map(|t| {
        engine::parse(t).ok().map(|p| ParsedToken {
            raw: p.raw.clone(),
            key: p.key.clone(),
            value: p.value.clone(),
            negative: p.negative,
            important: p.important,
        })
    }).collect()
}

#[napi]
pub fn lex(class_string: String) -> Vec<String> { engine::lex(&class_string) }

#[napi]
pub fn clear_parse_cache() { engine::clear_parse_cache(); }

#[napi]
pub fn build(cls: String, inline: Option<bool>) -> Option<String> {
    engine::build(&cls, inline.unwrap_or(false)).map(|s| s.as_ref().to_string())
}

#[napi]
pub fn build_batch(classes: Vec<String>) -> Vec<Option<String>> {
    use rayon::prelude::*;
    classes.par_iter()
        .map(|c| engine::build(c, false).map(|s| s.as_ref().to_string()))
        .collect()
}

#[napi]
pub fn clear_cache() { engine::clear_cache(); }
#[napi]
pub fn clear_file_cache() { engine::clear_file_cache(); }

#[napi]
pub fn file_cache_stats() -> String {
    let (files, classes) = engine::file_cache_stats();
    serde_json::to_string(&serde_json::json!({
        "files":   files,
        "classes": classes,
    })).unwrap_or_else(|_| "{}".into())
}

#[napi]
pub fn extract_classes(content: String) -> Vec<String> { engine::extract(&content) }

#[napi]
pub fn extract_from_file(path: String) -> Option<Vec<String>> {
    let file = File::open(&path).ok()?;
    let meta = file.metadata().ok()?;
    if meta.len() > 5 * 1024 * 1024 { return None; }
    let mmap = unsafe { Mmap::map(&file).ok()? };
    let content = std::str::from_utf8(&mmap).ok()?;
    Some(engine::extract(content))
}

#[napi]
pub fn scan_files(files: Vec<String>) -> Vec<ScanResult> {
    use rayon::prelude::*;
    files.into_par_iter().filter_map(|p| {
        let file = File::open(&p).ok()?;
        let meta = file.metadata().ok()?;
        if meta.len() > 5 * 1024 * 1024 { return None; }
        let mmap = unsafe { Mmap::map(&file).ok()? };
        let content = std::str::from_utf8(&mmap).ok()?;
        Some(ScanResult { path: p, classes: engine::extract(content) })
    }).collect()
}

#[napi]
pub fn find_files(cwd: String, include: Vec<String>, ignore: Vec<String>) -> Vec<String> {
    ssc::find_files(&cwd, &include, &ignore)
}

#[napi]
pub fn run_ssc(files: Vec<String>, config_json: String) -> String {
    ssc::run(&files, &config_json)
}

#[napi]
pub fn run_ssc_with_options(
    files: Vec<String>,
    config_json: String,
    opts: Option<SscOpts>,
) -> String {
    let o = opts.unwrap_or(SscOpts { preflight: None, minify: None, vendor_prefix: None });
    let ssc_opts = ssc::SscOptions {
        preflight: o.preflight.unwrap_or(true),
        minify: o.minify.unwrap_or(false),
        vendor_prefix: o.vendor_prefix.unwrap_or(true),
    };
    ssc::run_with_options(&files, &config_json, ssc_opts)
}

// ═══════════════════════════════════════════════════════════════════
// Preflight — backward compatible + configurable API
// ═══════════════════════════════════════════════════════════════════

#[napi(object)]
pub struct NapiPreflightOpts {
    pub reset: Option<bool>,
    pub typography: Option<bool>,
    pub forms: Option<bool>,
    pub a11y: Option<bool>,
    pub modern: Option<bool>,
    pub print: Option<bool>,
    pub dark_auto: Option<bool>,
    pub scrollbar_gutter: Option<bool>,
    pub runtime_theme: Option<bool>,
    pub perf_animation: Option<bool>,
    pub reduced_data: Option<bool>,
    pub reduced_transparency: Option<bool>,
    pub auto_dark_controls: Option<bool>,
}

/// Default preflight (backward compatible — same as before).
#[napi]
pub fn get_preflight() -> String {
    preflight::preflight()
}

/// Layer order declaration.
#[napi]
pub fn get_layer_decl() -> String {
    preflight::layer().to_string()
}

/// `@property` registrations.
#[napi]
pub fn get_property_decls() -> String {
    preflight::properties().to_string()
}

/// Configurable preflight — pass options to toggle sections.
///
/// ```ts
/// getPreflightConfigured({ print: true, a11y: true })
/// ```
#[napi]
pub fn get_preflight_configured(opts: Option<NapiPreflightOpts>) -> String {
    use preflight::{PreflightOptions, build_preflight};

    let d = PreflightOptions::default();
    let o = opts.unwrap_or(NapiPreflightOpts {
        reset: None, typography: None, forms: None, a11y: None,
        modern: None, print: None, dark_auto: None, scrollbar_gutter: None,
        runtime_theme: None, perf_animation: None,
        reduced_data: None, reduced_transparency: None,
        auto_dark_controls: None,
    });

    let effective = PreflightOptions {
        reset:                o.reset.unwrap_or(d.reset),
        typography:           o.typography.unwrap_or(d.typography),
        forms:                o.forms.unwrap_or(d.forms),
        a11y:                 o.a11y.unwrap_or(d.a11y),
        modern:               o.modern.unwrap_or(d.modern),
        print:                o.print.unwrap_or(d.print),
        dark_auto:            o.dark_auto.unwrap_or(d.dark_auto),
        scrollbar_gutter:     o.scrollbar_gutter.unwrap_or(d.scrollbar_gutter),
        runtime_theme:        o.runtime_theme.unwrap_or(d.runtime_theme),
        perf_animation:       o.perf_animation.unwrap_or(d.perf_animation),
        reduced_data:         o.reduced_data.unwrap_or(d.reduced_data),
        reduced_transparency: o.reduced_transparency.unwrap_or(d.reduced_transparency),
        auto_dark_controls:   o.auto_dark_controls.unwrap_or(d.auto_dark_controls),
    };

    build_preflight(effective).as_ref().to_string()
}

/// Clear preflight cache (call after config change).
#[napi]
pub fn clear_preflight_cache() {
    preflight::clear_cache();
}

#[napi]
pub fn minify_css(css: String) -> String { engine::minify(&css) }

#[napi]
pub fn finalize_css(css: String, minify: Option<bool>) -> String {
    let targets = engine::current_targets();
    engine::finalize_cached(&css, minify.unwrap_or(false), &targets)
        .as_ref()
        .to_string()
}

#[napi]
pub fn clear_finalize_cache() {
    engine::clear_finalize_cache();
}

#[napi]
pub fn finalize_cache_entries() -> u32 {
    engine::finalize_cache_entries() as u32
}

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

#[napi]
pub fn cache_stats() -> String {
    serde_json::to_string(&engine::cache_stats()).unwrap_or_else(|_| "{}".into())
}

#[napi]
pub fn reset_cache_stats() { engine::reset_cache_stats(); }

#[napi]
pub fn version() -> String { env!("CARGO_PKG_VERSION").to_string() }

#[napi]
pub fn warmup_classes(classes: Vec<String>) { engine::warmup(&classes); }

#[napi]
pub fn has_utility(cls: String) -> bool { engine::build(&cls, false).is_some() }

#[napi]
pub fn process_css_input(css: String) -> Result<String> {
    css_input::process_css(&css)
        .map(|(out, _tokens)| out)
        .map_err(Error::from_reason)
}

#[napi]
pub fn expand_apply(css: String) -> Result<String> {
    css_input::expand_apply(&css).map_err(Error::from_reason)
}

#[napi]
pub fn extract_theme(css: String) -> String {
    css_input::extract_theme(&css)
}

#[napi]
pub fn get_theme_tokens(css: String) -> String {
    let (_stripped, tokens) = css_input::parse_theme(&css);
    serde_json::to_string(&serde_json::json!({
        "colors":  tokens.colors,
        "spacing": tokens.spacing,
        "radius":  tokens.radius,
        "font":    tokens.font,
        "raw":     tokens.raw,
    }))
    .unwrap_or_else(|_| "{}".into())
}

#[napi]
pub fn register_plugin_utility(name: String, decls: String) {
    plugin::register_utility(name, decls);
}

#[napi]
pub fn register_plugin_variant(name: String, template: String) {
    plugin::register_variant(name, template);
}

#[napi]
pub fn list_plugin_utilities() -> String {
    serde_json::to_string(&plugin::snapshot_utilities()).unwrap_or_else(|_| "[]".into())
}

#[napi]
pub fn list_plugin_variants() -> String {
    serde_json::to_string(&plugin::snapshot_variants()).unwrap_or_else(|_| "[]".into())
}

#[napi]
pub fn clear_plugins() { plugin::clear_all(); }

#[napi]
pub fn export_cache() -> String {
    use base64::{Engine as _, engine::general_purpose::STANDARD};
    let snap = engine::export_cache_snapshot();
    match bincode::serialize(&snap) {
        Ok(bytes) => STANDARD.encode(&bytes),
        Err(_) => String::new(),
    }
}

#[napi]
pub fn import_cache(data: String) -> bool {
    use base64::{Engine as _, engine::general_purpose::STANDARD};
    if data.is_empty() { return false; }
    let bytes = match STANDARD.decode(&data) { Ok(b) => b, Err(_) => return false };
    match bincode::deserialize::<engine::CacheSnapshot>(&bytes) {
        Ok(snap) => engine::import_cache_snapshot(snap),
        Err(_) => false,
    }
}