// ═══════════════════════════════════════════════════════════════════
// GarurSaili-CSS — utilities_v4.rs
// The Semantic Indian CSS Framework
// Author: Barshan Sarkar · Malda, West Bengal, India
// Version: 1.4.0
// ═══════════════════════════════════════════════════════════════════
//
// Garur v4 utilities + coverage gaps
// ═══════════════════════════════════════════════════════════════════
use rustc_hash::FxHashMap;

pub fn generate_v4(m: &mut FxHashMap<String, String>, palette: &FxHashMap<String, String>) {
    gen_v4_gradients(m);
    gen_drop_shadow(m);
    gen_text_shadow_colors(m, palette);
    gen_ring_offset_colors(m, palette);
    gen_bg_clip_fix(m);
    gen_keyframe_utilities(m);
    gen_extra_font_utilities(m);
    gen_semantic_primitives(m); 
}

// ───────────────────────────────────────────────
//// // text-shadow-{color} (Garur v4)
// ───────────────────────────────────────────────

fn gen_v4_gradients(m: &mut FxHashMap<String, String>) {
    // Linear (v4 rename of bg-gradient-to-*)
    for (k, v) in [
        ("bg-linear-to-t", "to top"),
        ("bg-linear-to-tr", "to top right"),
        ("bg-linear-to-r", "to right"),
        ("bg-linear-to-br", "to bottom right"),
        ("bg-linear-to-b", "to bottom"),
        ("bg-linear-to-bl", "to bottom left"),
        ("bg-linear-to-l", "to left"),
        ("bg-linear-to-tl", "to top left"),
    ] {
        m.entry(k.into()).or_insert_with(|| format!(
            "background-image:linear-gradient({}, var(--garur-gradient-stops));--garur-gradient-stops:var(--garur-gradient-from, transparent), var(--garur-gradient-via, transparent), var(--garur-gradient-to, transparent)",
            v
        ));
    }

    // Linear with angle: bg-linear-45, bg-linear-90, etc.
    for deg in [0, 45, 90, 135, 180, 225, 270, 315] {
        m.entry(format!("bg-linear-{}", deg)).or_insert_with(|| format!(
            "background-image:linear-gradient({}deg, var(--garur-gradient-stops));--garur-gradient-stops:var(--garur-gradient-from, transparent), var(--garur-gradient-via, transparent), var(--garur-gradient-to, transparent)",
            deg
        ));
        m.entry(format!("-bg-linear-{}", deg)).or_insert_with(|| format!(
            "background-image:linear-gradient(-{}deg, var(--garur-gradient-stops));--garur-gradient-stops:var(--garur-gradient-from, transparent), var(--garur-gradient-via, transparent), var(--garur-gradient-to, transparent)",
            deg
        ));
    }

    // Radial
    m.entry("bg-radial".into()).or_insert_with(|| {
        "background-image:radial-gradient(var(--garur-gradient-stops));--garur-gradient-stops:var(--garur-gradient-from, transparent), var(--garur-gradient-via, transparent), var(--garur-gradient-to, transparent)".into()
    });
    m.entry("bg-radial-none".into())
        .or_insert_with(|| "background-image:none".into());

    // Radial with position
    for (k, v) in [
        ("radial-at-top", "at top"),
        ("radial-at-bottom", "at bottom"),
        ("radial-at-left", "at left"),
        ("radial-at-right", "at right"),
        ("radial-at-center", "at center"),
        ("radial-at-top-left", "at top left"),
        ("radial-at-top-right", "at top right"),
        ("radial-at-bottom-left", "at bottom left"),
        ("radial-at-bottom-right", "at bottom right"),
    ] {
        let name = format!("bg-{}", k);
        m.entry(name).or_insert_with(|| format!(
            "background-image:radial-gradient({}, var(--garur-gradient-stops));--garur-gradient-stops:var(--garur-gradient-from, transparent), var(--garur-gradient-via, transparent), var(--garur-gradient-to, transparent)",
            v
        ));
    }

    // Conic
    m.entry("bg-conic".into()).or_insert_with(|| {
        "background-image:conic-gradient(from 180deg at 50% 50%, var(--garur-gradient-stops));--garur-gradient-stops:var(--garur-gradient-from, transparent), var(--garur-gradient-via, transparent), var(--garur-gradient-to, transparent)".into()
    });
    for deg in [0, 45, 90, 135, 180, 225, 270, 315] {
        m.entry(format!("bg-conic-{}", deg)).or_insert_with(|| format!(
            "background-image:conic-gradient(from {}deg at 50% 50%, var(--garur-gradient-stops));--garur-gradient-stops:var(--garur-gradient-from, transparent), var(--garur-gradient-via, transparent), var(--garur-gradient-to, transparent)",
            deg
        ));
    }

    // Gradient interpolation mode (v4)
    for (k, v) in [
        ("bg-linear-oklab", "in oklab"),
        ("bg-linear-srgb", "in srgb"),
        ("bg-linear-srgb-linear", "in srgb-linear"),
        ("bg-linear-hsl", "in hsl"),
        ("bg-linear-oklch", "in oklch"),
        ("bg-linear-longer", "in oklch longer hue"),
        ("bg-linear-shorter", "in oklch shorter hue"),
    ] {
        m.entry(k.into()).or_insert_with(|| format!("--garur-gradient-interpolation:{}", v));
    }
}

// ───────────────────────────────────────────────
// drop-shadow-* (was missing)
// ───────────────────────────────────────────────

fn gen_drop_shadow(m: &mut FxHashMap<String, String>) {
    for (k, v) in [
        ("2xs", "0 1px rgb(0 0 0 / 0.05)"),
        ("xs", "0 1px 1px rgb(0 0 0 / 0.05)"),
        ("sm", "0 1px 1px rgb(0 0 0 / 0.05), 0 1px 2px rgb(0 0 0 / 0.05)"),
        ("DEFAULT", "0 1px 2px rgb(0 0 0 / 0.1), 0 1px 1px rgb(0 0 0 / 0.06)"),
        ("md", "0 2px 2px rgb(0 0 0 / 0.1), 0 2px 4px rgb(0 0 0 / 0.06)"),
        ("lg", "0 4px 4px rgb(0 0 0 / 0.1), 0 4px 8px rgb(0 0 0 / 0.06)"),
        ("xl", "0 8px 8px rgb(0 0 0 / 0.1), 0 8px 16px rgb(0 0 0 / 0.06)"),
        ("2xl", "0 16px 16px rgb(0 0 0 / 0.1), 0 16px 32px rgb(0 0 0 / 0.06)"),
        ("none", "0 0 #0000"),
    ] {
        let key = if k == "DEFAULT" { "drop-shadow".to_string() } else { format!("drop-shadow-{}", k) };
        m.entry(key).or_insert_with(|| format!("filter:drop-shadow({})", v));
    }
}

// ───────────────────────────────────────────────
// text-shadow-{color} (v4)
// ───────────────────────────────────────────────

fn gen_text_shadow_colors(m: &mut FxHashMap<String, String>, palette: &FxHashMap<String, String>) {
    for (token, color) in palette {
        m.entry(format!("text-shadow-{}", token))
            .or_insert_with(|| format!("--garur-text-shadow-color:{}", color));
    }
    m.entry("text-shadow-inherit".into())
        .or_insert_with(|| "--garur-text-shadow-color:inherit".into());
    m.entry("text-shadow-current".into())
        .or_insert_with(|| "--garur-text-shadow-color:currentColor".into());
    m.entry("text-shadow-transparent".into())
        .or_insert_with(|| "--garur-text-shadow-color:transparent".into());
}

// ───────────────────────────────────────────────
// ring-offset-{color} (was missing — only widths existed)
// ───────────────────────────────────────────────

fn gen_ring_offset_colors(m: &mut FxHashMap<String, String>, palette: &FxHashMap<String, String>) {
    for (token, color) in palette {
        m.entry(format!("ring-offset-{}", token))
            .or_insert_with(|| format!("--garur-ring-offset-color:{}", color));
    }
    m.entry("ring-offset-inherit".into())
        .or_insert_with(|| "--garur-ring-offset-color:inherit".into());
    m.entry("ring-offset-current".into())
        .or_insert_with(|| "--garur-ring-offset-color:currentColor".into());
    m.entry("ring-offset-transparent".into())
        .or_insert_with(|| "--garur-ring-offset-color:transparent".into());
}

// ───────────────────────────────────────────────
// bg-clip FIX (was generating bg-clip-clip!)
// ───────────────────────────────────────────────

fn gen_bg_clip_fix(m: &mut FxHashMap<String, String>) {
    // Remove the broken `bg-clip-clip`, `bg-clip-padding`, `bg-clip-content` from utilities.rs
    // by re-inserting CORRECT ones with `or_insert` won't work — need `insert` to override.
    m.insert("bg-clip-border".into(), "background-clip:border-box".into());
    m.insert("bg-clip-padding".into(), "background-clip:padding-box".into());
    m.insert("bg-clip-content".into(), "background-clip:content-box".into());
    m.insert("bg-clip-text".into(), "background-clip:text;-webkit-background-clip:text;-webkit-text-fill-color:transparent;color:transparent".into());
}

// ───────────────────────────────────────────────
// More keyframes
// ───────────────────────────────────────────────

fn gen_keyframe_utilities(m: &mut FxHashMap<String, String>) {
    // Extra animations — keyframes are emitted by engine.rs's keyframes_for_class.
    // Here we just declare the animation shorthand classes.
    m.entry("animate-wiggle".into()).or_insert_with(|| {
        "animation:garur-wiggle 1s ease-in-out infinite".into()
    });
    m.entry("animate-float".into()).or_insert_with(|| {
        "animation:garur-float 3s ease-in-out infinite".into()
    });
    m.entry("animate-shake".into()).or_insert_with(|| {
        "animation:garur-shake 0.5s ease-in-out infinite".into()
    });
    m.entry("animate-fade-in".into()).or_insert_with(|| {
        "animation:garur-fade-in 0.3s ease-out".into()
    });
    m.entry("animate-fade-out".into()).or_insert_with(|| {
        "animation:garur-fade-out 0.3s ease-in forwards".into()
    });
    m.entry("animate-slide-in-top".into()).or_insert_with(|| {
        "animation:garur-slide-in-top 0.3s ease-out".into()
    });
    m.entry("animate-slide-in-bottom".into()).or_insert_with(|| {
        "animation:garur-slide-in-bottom 0.3s ease-out".into()
    });
}

// ───────────────────────────────────────────────
// Extra font utilities
// ───────────────────────────────────────────────

fn gen_extra_font_utilities(m: &mut FxHashMap<String, String>) {
    m.entry("font-stretch-normal".into())
        .or_insert_with(|| "font-stretch:normal".into());
    m.entry("font-stretch-condensed".into())
        .or_insert_with(|| "font-stretch:condensed".into());
    m.entry("font-stretch-expanded".into())
        .or_insert_with(|| "font-stretch:expanded".into());

    m.entry("font-feature-normal".into())
        .or_insert_with(|| "font-feature-settings:normal".into());
    m.entry("font-variation-normal".into())
        .or_insert_with(|| "font-variation-settings:normal".into());

    m.entry("font-optical-sizing-auto".into())
        .or_insert_with(|| "font-optical-sizing:auto".into());
    m.entry("font-optical-sizing-none".into())
        .or_insert_with(|| "font-optical-sizing:none".into());

    m.entry("font-smoothing-auto".into())
        .or_insert_with(|| "-webkit-font-smoothing:auto".into());
}

// ═══════════════════════════════════════════════════════════════════
// Rule 3 — Semantic layout primitives (SAFE additions)
// ═══════════════════════════════════════════════════════════════════
//
// Shorter, semantic replacements for common layout patterns.
//
// Examples:
//   center         → flex + center on both axes
//   stack          → flex column
//   row            → flex row
//   row-between    → flex row + space-between (nav bar pattern)
//   cluster        → flex wrap (chips/badges)
//   grid3          → grid with 3 equal columns
//
// SAFETY: All insertions use `.entry().or_insert_with()` — will NEVER
// override an existing utility. This is purely additive.

fn gen_semantic_primitives(m: &mut FxHashMap<String, String>) {
    // ───────────────────────────────────────────────
    // Flex containers — most common layouts
    // ───────────────────────────────────────────────

    // Both-axis centering (single most common need)
    m.entry("center".into()).or_insert_with(|| 
        "display:flex;align-items:center;justify-content:center".into());

    // Horizontal flex (row)
    m.entry("row".into()).or_insert_with(|| 
        "display:flex;flex-direction:row".into());

    m.entry("row-center".into()).or_insert_with(|| 
        "display:flex;flex-direction:row;align-items:center".into());

    m.entry("row-between".into()).or_insert_with(|| 
        "display:flex;flex-direction:row;align-items:center;justify-content:space-between".into());

    m.entry("row-around".into()).or_insert_with(|| 
        "display:flex;flex-direction:row;align-items:center;justify-content:space-around".into());

    m.entry("row-evenly".into()).or_insert_with(|| 
        "display:flex;flex-direction:row;align-items:center;justify-content:space-evenly".into());

    m.entry("row-start".into()).or_insert_with(|| 
        "display:flex;flex-direction:row;align-items:center;justify-content:flex-start".into());

    m.entry("row-end".into()).or_insert_with(|| 
        "display:flex;flex-direction:row;align-items:center;justify-content:flex-end".into());

    // Vertical flex (column / stack)
    m.entry("stack".into()).or_insert_with(|| 
        "display:flex;flex-direction:column".into());

    m.entry("stack-center".into()).or_insert_with(|| 
        "display:flex;flex-direction:column;align-items:center".into());

    m.entry("stack-between".into()).or_insert_with(|| 
        "display:flex;flex-direction:column;justify-content:space-between".into());

    m.entry("stack-start".into()).or_insert_with(|| 
        "display:flex;flex-direction:column;align-items:flex-start".into());

    m.entry("stack-end".into()).or_insert_with(|| 
        "display:flex;flex-direction:column;align-items:flex-end".into());

    // Wrapping flex (chips, tags, badge groups)
    m.entry("cluster".into()).or_insert_with(|| 
        "display:flex;flex-direction:row;flex-wrap:wrap".into());

    m.entry("cluster-center".into()).or_insert_with(|| 
        "display:flex;flex-direction:row;flex-wrap:wrap;align-items:center;justify-content:center".into());

    // ───────────────────────────────────────────────
    // Grid shortcuts — grid1 through grid12
    // ───────────────────────────────────────────────
    for n in 1..=12 {
        m.entry(format!("grid{}", n)).or_insert_with(|| 
            format!("display:grid;grid-template-columns:repeat({}, minmax(0, 1fr))", n));
    }

    // ───────────────────────────────────────────────
    // Semantic text colors (uses runtime tokens)
    // Override in :root { --garur-muted: ... }
    // ───────────────────────────────────────────────
    m.entry("muted".into()).or_insert_with(|| 
        "color:var(--garur-muted, #647490)".into());

    m.entry("subtle".into()).or_insert_with(|| 
        "color:var(--garur-subtle, #6f7780)".into());

    m.entry("hint".into()).or_insert_with(|| 
        "color:var(--garur-hint, #939aa3)".into());

    // ───────────────────────────────────────────────
    // Font weight shortcuts (bare — no `font-` prefix)
    // ───────────────────────────────────────────────
    m.entry("heavy".into()).or_insert_with(|| "font-weight:700".into());
    m.entry("semibold".into()).or_insert_with(|| "font-weight:600".into());
    m.entry("medium".into()).or_insert_with(|| "font-weight:500".into());
    m.entry("light".into()).or_insert_with(|| "font-weight:300".into());

    // ───────────────────────────────────────────────
    // Cursor shortcuts
    // ───────────────────────────────────────────────
    m.entry("not-allowed".into()).or_insert_with(|| "cursor:not-allowed".into());
    m.entry("grabbable".into()).or_insert_with(|| "cursor:grab".into());
    m.entry("grabbing".into()).or_insert_with(|| "cursor:grabbing".into());

    // ───────────────────────────────────────────────
    // Misc semantic
    // ───────────────────────────────────────────────
    m.entry("square".into()).or_insert_with(|| "aspect-ratio:1/1".into());
}