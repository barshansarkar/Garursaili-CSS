// ═══════════════════════════════════════════════════════════════════
// GarurSaili-CSS — utilities.rs
// The Semantic Indian CSS Framework
// Author: Barshan Sarkar · Malda, West Bengal, India
// Version: 1.4.0
// ═══════════════════════════════════════════════════════════════════
//
// Utilities — comprehensive Garur utility generator
// ═══════════════════════════════════════════════════════════════════
use rustc_hash::FxHashMap;

pub const SPACING: &[(&str, &str)] = &[
    ("px", "1px"), ("0", "0"), ("0.5", "0.125rem"), ("1", "0.25rem"),
    ("1.5", "0.375rem"), ("2", "0.5rem"), ("2.5", "0.625rem"),
    ("3", "0.75rem"), ("3.5", "0.875rem"), ("4", "1rem"),
    ("5", "1.25rem"), ("6", "1.5rem"), ("7", "1.75rem"), ("8", "2rem"),
    ("9", "2.25rem"), ("10", "2.5rem"), ("11", "2.75rem"), ("12", "3rem"),
    ("14", "3.5rem"), ("16", "4rem"), ("20", "5rem"), ("24", "6rem"),
    ("28", "7rem"), ("32", "8rem"), ("36", "9rem"), ("40", "10rem"),
    ("44", "11rem"), ("48", "12rem"), ("52", "13rem"), ("56", "14rem"),
    ("60", "15rem"), ("64", "16rem"), ("72", "18rem"), ("80", "20rem"),
    ("96", "24rem"),
];

const RADIUS: &[(&str, &str)] = &[
    ("none", "0px"), ("sm", "0.125rem"), ("DEFAULT", "0.25rem"),
    ("md", "0.375rem"), ("lg", "0.5rem"), ("xl", "0.75rem"),
    ("2xl", "1rem"), ("3xl", "1.5rem"), ("full", "9999px"),
];

const BORDER_WIDTH: &[(&str, &str)] = &[
    ("0", "0px"), ("1", "1px"), ("2", "2px"), ("4", "4px"),
    ("8", "8px"), ("DEFAULT", "1px"),
];

const SHADOW: &[(&str, &str)] = &[
    ("sm", "0 1px 2px 0 rgb(0 0 0 / 0.05)"),
    ("DEFAULT", "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)"),
    ("md", "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"),
    ("lg", "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"),
    ("xl", "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"),
    ("2xl", "0 25px 50px -12px rgb(0 0 0 / 0.25)"),
    ("inner", "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)"),
    ("none", "none"),
];

const OPACITY: &[(&str, &str)] = &[
    ("0", "0"), ("5", "0.05"), ("10", "0.1"), ("15", "0.15"),
    ("20", "0.2"), ("25", "0.25"), ("30", "0.3"), ("35", "0.35"),
    ("40", "0.4"), ("45", "0.45"), ("50", "0.5"), ("55", "0.55"),
    ("60", "0.6"), ("65", "0.65"), ("70", "0.7"), ("75", "0.75"),
    ("80", "0.8"), ("85", "0.85"), ("90", "0.9"), ("95", "0.95"),
    ("100", "1"),
];

const Z_INDEX: &[(&str, &str)] = &[
    ("0", "0"), ("10", "10"), ("20", "20"), ("30", "30"),
    ("40", "40"), ("50", "50"), ("auto", "auto"),
];

const DURATIONS: &[(&str, &str)] = &[
    ("0", "0ms"), ("75", "75ms"), ("100", "100ms"), ("150", "150ms"),
    ("200", "200ms"), ("300", "300ms"), ("500", "500ms"), ("700", "700ms"),
    ("1000", "1000ms"),
];

const OPACITY_STEPS: &[u32] = &[
    0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100,
];

// ─── Color helpers ───

fn hex_to_rgba(hex: &str, alpha: f64) -> Option<String> {
    let h = hex.trim_start_matches('#');
    let (r, g, b, a) = match h.len() {
        3 => (
            u8::from_str_radix(&h[0..1].repeat(2), 16).ok()?,
            u8::from_str_radix(&h[1..2].repeat(2), 16).ok()?,
            u8::from_str_radix(&h[2..3].repeat(2), 16).ok()?,
            alpha,
        ),
        6 => (
            u8::from_str_radix(&h[0..2], 16).ok()?,
            u8::from_str_radix(&h[2..4], 16).ok()?,
            u8::from_str_radix(&h[4..6], 16).ok()?,
            alpha,
        ),
        8 => (
            u8::from_str_radix(&h[0..2], 16).ok()?,
            u8::from_str_radix(&h[2..4], 16).ok()?,
            u8::from_str_radix(&h[4..6], 16).ok()?,
            alpha * (u8::from_str_radix(&h[6..8], 16).ok()? as f64 / 255.0),
        ),
        _ => return None,
    };
    Some(format!("rgba({}, {}, {}, {})", r, g, b, a.clamp(0.0, 1.0)))
}

pub fn apply_alpha(color: &str, opacity: u32) -> String {
    let alpha = opacity as f64 / 100.0;
    if let Some(h) = color.strip_prefix('#') {
        if let Some(rgba) = hex_to_rgba(h, alpha) {
            return rgba;
        }
    } else if let Some(inner) = color.strip_prefix("rgb(").and_then(|s| s.strip_suffix(")")) {
        return format!("rgba({}, {})", inner, alpha);
    }
    color.to_string()
}

// ─── Main entry ───

pub fn generate(palette: &FxHashMap<String, String>) -> FxHashMap<String, String> {
    // Pre-size generously: base ~8k, extended ~4k, v4 ~1k, palette×~55 variants
    let est = 16_384 + palette.len().saturating_mul(55);
    let mut m = FxHashMap::with_capacity_and_hasher(est, Default::default());

    gen_layout(&mut m);
    gen_position(&mut m);
    gen_spacing(&mut m);
    gen_sizing(&mut m);
    gen_typography(&mut m);
    gen_colors(&mut m, palette);
    gen_gradients(&mut m, palette);
    gen_border(&mut m);
    gen_effects(&mut m);
    gen_flex(&mut m);
    gen_grid(&mut m);
    gen_columns(&mut m);
    gen_transform(&mut m);
    gen_filter(&mut m);
    gen_animation(&mut m);
    gen_interaction(&mut m);
    gen_svg(&mut m);
    gen_accessibility(&mut m);
    gen_table(&mut m);
    gen_misc(&mut m);
    crate::advanced::generate(&mut m);
    gen_container_smart(&mut m);
    gen_container_queries(&mut m);
    gen_text_shadow(&mut m);
    gen_backdrop_full(&mut m);
    gen_writing_mode(&mut m);
    gen_logical_props(&mut m);
    gen_more_colors(&mut m);
    crate::utilities_extended::generate_extended(&mut m);
    crate::utilities_v4::generate_v4(&mut m, palette);
     crate::primitives::generate(&mut m); 
     crate::signature::generate(&mut m);
    m
}

// ─── Layout ───

fn gen_layout(m: &mut FxHashMap<String, String>) {
    for (k, v) in [
        ("block", "block"), ("inline-block", "inline-block"), ("inline", "inline"),
        ("flex", "flex"), ("inline-flex", "inline-flex"), ("grid", "grid"),
        ("inline-grid", "inline-grid"), ("contents", "contents"),
        ("table", "table"), ("inline-table", "inline-table"),
        ("table-caption", "table-caption"), ("table-cell", "table-cell"),
        ("table-column", "table-column"), ("table-column-group", "table-column-group"),
        ("table-footer-group", "table-footer-group"), ("table-header-group", "table-header-group"),
        ("table-row-group", "table-row-group"), ("table-row", "table-row"),
        ("flow-root", "flow-root"), ("list-item", "list-item"),
        ("hidden", "none"),
    ] {
        m.insert(k.into(), format!("display:{}", v));
    }

    m.insert("box-border".into(), "box-sizing:border-box".into());
    m.insert("box-content".into(), "box-sizing:content-box".into());

    for (k, v) in [("right", "right"), ("left", "left"), ("none", "none")] {
        m.insert(format!("float-{}", k), format!("float:{}", v));
        m.insert(format!("clear-{}", k), format!("clear:{}", v));
    }
    m.insert("clear-both".into(), "clear:both".into());
    m.insert("float-start".into(), "float:inline-start".into());
    m.insert("float-end".into(), "float:inline-end".into());
    m.insert("clear-start".into(), "clear:inline-start".into());
    m.insert("clear-end".into(), "clear:inline-end".into());

    for (k, v) in [
        ("auto", "auto"), ("hidden", "hidden"), ("clip", "clip"),
        ("visible", "visible"), ("scroll", "scroll"),
    ] {
        m.insert(format!("overflow-{}", k), format!("overflow:{}", v));
        m.insert(format!("overflow-x-{}", k), format!("overflow-x:{}", v));
        m.insert(format!("overflow-y-{}", k), format!("overflow-y:{}", v));
    }

    for (k, v) in [("auto", "auto"), ("contain", "contain"), ("none", "none")] {
        m.insert(format!("overscroll-{}", k), format!("overscroll-behavior:{}", v));
        m.insert(format!("overscroll-x-{}", k), format!("overscroll-behavior-x:{}", v));
        m.insert(format!("overscroll-y-{}", k), format!("overscroll-behavior-y:{}", v));
    }

    m.insert("visible".into(), "visibility:visible".into());
    m.insert("invisible".into(), "visibility:hidden".into());
    m.insert("collapse".into(), "visibility:collapse".into());

    for (k, v) in [
        ("contain", "contain"), ("cover", "cover"), ("fill", "fill"),
        ("none", "none"), ("scale-down", "scale-down"),
    ] {
        m.insert(format!("object-{}", k), format!("object-fit:{}", v));
    }
    for (k, v) in [
        ("bottom", "bottom"), ("center", "center"), ("left", "left"),
        ("left-bottom", "left bottom"), ("left-top", "left top"),
        ("right", "right"), ("right-bottom", "right bottom"),
        ("right-top", "right top"), ("top", "top"),
    ] {
        m.insert(format!("object-{}", k), format!("object-position:{}", v));
    }

    m.insert("isolate".into(), "isolation:isolate".into());
    m.insert("isolation-auto".into(), "isolation:auto".into());

    for (k, v) in [
        ("auto", "auto"), ("square", "1 / 1"), ("video", "16 / 9"),
        ("1/1", "1 / 1"), ("2/3", "2 / 3"), ("3/2", "3 / 2"),
        ("4/3", "4 / 3"), ("3/4", "3 / 4"), ("16/9", "16 / 9"),
        ("9/16", "9 / 16"), ("21/9", "21 / 9"), ("9/21", "9 / 21"),
    ] {
        m.insert(format!("aspect-{}", k), format!("aspect-ratio:{}", v));
    }

    m.insert("@container".into(), "container-type:inline-size".into());

    for (k, v) in [
        ("auto", "auto"), ("avoid", "avoid"), ("all", "all"),
        ("avoid-page", "avoid-page"), ("page", "page"),
    ] {
        m.insert(format!("break-after-{}", k), format!("break-after:{}", v));
        m.insert(format!("break-before-{}", k), format!("break-before:{}", v));
        m.insert(format!("break-inside-{}", k), format!("break-inside:{}", v));
    }

    for (k, v) in [("clone", "clone"), ("slice", "slice")] {
        m.insert(format!("box-decoration-{}", k), format!("box-decoration-break:{}", v));
    }
}

fn gen_position(m: &mut FxHashMap<String, String>) {
    for (k, v) in [
        ("static", "static"), ("fixed", "fixed"), ("absolute", "absolute"),
        ("relative", "relative"), ("sticky", "sticky"),
    ] {
        m.insert(k.into(), format!("position:{}", v));
    }

    for &(k, v) in SPACING {
        m.insert(format!("inset-{}", k), format!("inset:{}", v));
        m.insert(format!("inset-x-{}", k), format!("left:{};right:{}", v, v));
        m.insert(format!("inset-y-{}", k), format!("top:{};bottom:{}", v, v));
        m.insert(format!("top-{}", k), format!("top:{}", v));
        m.insert(format!("right-{}", k), format!("right:{}", v));
        m.insert(format!("bottom-{}", k), format!("bottom:{}", v));
        m.insert(format!("left-{}", k), format!("left:{}", v));
        m.insert(format!("start-{}", k), format!("inset-inline-start:{}", v));
        m.insert(format!("end-{}", k), format!("inset-inline-end:{}", v));
    }

    m.insert("inset-auto".into(), "inset:auto".into());
    m.insert("inset-x-auto".into(), "left:auto;right:auto".into());
    m.insert("inset-y-auto".into(), "top:auto;bottom:auto".into());
    m.insert("top-auto".into(), "top:auto".into());
    m.insert("right-auto".into(), "right:auto".into());
    m.insert("bottom-auto".into(), "bottom:auto".into());
    m.insert("left-auto".into(), "left:auto".into());
    m.insert("start-auto".into(), "inset-inline-start:auto".into());
    m.insert("end-auto".into(), "inset-inline-end:auto".into());

    m.insert("inset-1/2".into(), "inset:50%".into());
    m.insert("inset-1/3".into(), "inset:33.333333%".into());
    m.insert("inset-2/3".into(), "inset:66.666667%".into());
    m.insert("inset-1/4".into(), "inset:25%".into());
    m.insert("inset-3/4".into(), "inset:75%".into());
    m.insert("inset-full".into(), "inset:100%".into());
    m.insert("top-1/2".into(), "top:50%".into());
    m.insert("top-1/3".into(), "top:33.333333%".into());
    m.insert("top-2/3".into(), "top:66.666667%".into());
    m.insert("top-1/4".into(), "top:25%".into());
    m.insert("top-3/4".into(), "top:75%".into());
    m.insert("top-full".into(), "top:100%".into());
    m.insert("left-1/2".into(), "left:50%".into());
    m.insert("left-full".into(), "left:100%".into());
    m.insert("right-1/2".into(), "right:50%".into());
    m.insert("right-full".into(), "right:100%".into());
    m.insert("bottom-1/2".into(), "bottom:50%".into());
    m.insert("bottom-full".into(), "bottom:100%".into());

    for &(k, v) in Z_INDEX {
        m.insert(format!("z-{}", k), format!("z-index:{}", v));
    }
}

fn gen_spacing(m: &mut FxHashMap<String, String>) {
    for &(k, v) in SPACING {
        m.insert(format!("p-{}", k), format!("padding:{}", v));
        m.insert(format!("px-{}", k), format!("padding-left:{};padding-right:{}", v, v));
        m.insert(format!("py-{}", k), format!("padding-top:{};padding-bottom:{}", v, v));
        m.insert(format!("ps-{}", k), format!("padding-inline-start:{}", v));
        m.insert(format!("pe-{}", k), format!("padding-inline-end:{}", v));
        m.insert(format!("pt-{}", k), format!("padding-top:{}", v));
        m.insert(format!("pr-{}", k), format!("padding-right:{}", v));
        m.insert(format!("pb-{}", k), format!("padding-bottom:{}", v));
        m.insert(format!("pl-{}", k), format!("padding-left:{}", v));

        m.insert(format!("m-{}", k), format!("margin:{}", v));
        m.insert(format!("mx-{}", k), format!("margin-left:{};margin-right:{}", v, v));
        m.insert(format!("my-{}", k), format!("margin-top:{};margin-bottom:{}", v, v));
        m.insert(format!("ms-{}", k), format!("margin-inline-start:{}", v));
        m.insert(format!("me-{}", k), format!("margin-inline-end:{}", v));
        m.insert(format!("mt-{}", k), format!("margin-top:{}", v));
        m.insert(format!("mr-{}", k), format!("margin-right:{}", v));
        m.insert(format!("mb-{}", k), format!("margin-bottom:{}", v));
        m.insert(format!("ml-{}", k), format!("margin-left:{}", v));

        m.insert(format!("gap-{}", k), format!("gap:{}", v));
        m.insert(format!("gap-x-{}", k), format!("column-gap:{}", v));
        m.insert(format!("gap-y-{}", k), format!("row-gap:{}", v));

        m.insert(format!("space-x-{}", k), format!(
            "& > :not([hidden]) ~ :not([hidden]) {{ --garur-space-x-reverse:0; margin-left:calc({v} * calc(1 - var(--garur-space-x-reverse))); margin-right:calc({v} * var(--garur-space-x-reverse)); }}", v = v));
        m.insert(format!("space-y-{}", k), format!(
            "& > :not([hidden]) ~ :not([hidden]) {{ --garur-space-y-reverse:0; margin-top:calc({v} * calc(1 - var(--garur-space-y-reverse))); margin-bottom:calc({v} * var(--garur-space-y-reverse)); }}", v = v));
        m.insert(format!("-space-x-{}", k), format!(
            "& > :not([hidden]) ~ :not([hidden]) {{ --garur-space-x-reverse:0; margin-left:calc(-{v} * calc(1 - var(--garur-space-x-reverse))); margin-right:calc(-{v} * var(--garur-space-x-reverse)); }}", v = v));
        m.insert(format!("-space-y-{}", k), format!(
            "& > :not([hidden]) ~ :not([hidden]) {{ --garur-space-y-reverse:0; margin-top:calc(-{v} * calc(1 - var(--garur-space-y-reverse))); margin-bottom:calc(-{v} * var(--garur-space-y-reverse)); }}", v = v));

        m.insert(format!("scroll-m-{}", k), format!("scroll-margin:{}", v));
        m.insert(format!("scroll-mx-{}", k), format!("scroll-margin-left:{};scroll-margin-right:{}", v, v));
        m.insert(format!("scroll-my-{}", k), format!("scroll-margin-top:{};scroll-margin-bottom:{}", v, v));
        m.insert(format!("scroll-mt-{}", k), format!("scroll-margin-top:{}", v));
        m.insert(format!("scroll-mr-{}", k), format!("scroll-margin-right:{}", v));
        m.insert(format!("scroll-mb-{}", k), format!("scroll-margin-bottom:{}", v));
        m.insert(format!("scroll-ml-{}", k), format!("scroll-margin-left:{}", v));
        m.insert(format!("scroll-p-{}", k), format!("scroll-padding:{}", v));
        m.insert(format!("scroll-px-{}", k), format!("scroll-padding-left:{};scroll-padding-right:{}", v, v));
        m.insert(format!("scroll-py-{}", k), format!("scroll-padding-top:{};scroll-padding-bottom:{}", v, v));
        m.insert(format!("scroll-pt-{}", k), format!("scroll-padding-top:{}", v));
        m.insert(format!("scroll-pr-{}", k), format!("scroll-padding-right:{}", v));
        m.insert(format!("scroll-pb-{}", k), format!("scroll-padding-bottom:{}", v));
        m.insert(format!("scroll-pl-{}", k), format!("scroll-padding-left:{}", v));
    }

    m.insert("m-auto".into(), "margin:auto".into());
    m.insert("mx-auto".into(), "margin-left:auto;margin-right:auto".into());
    m.insert("my-auto".into(), "margin-top:auto;margin-bottom:auto".into());
    m.insert("ms-auto".into(), "margin-inline-start:auto".into());
    m.insert("me-auto".into(), "margin-inline-end:auto".into());
    m.insert("mt-auto".into(), "margin-top:auto".into());
    m.insert("mr-auto".into(), "margin-right:auto".into());
    m.insert("mb-auto".into(), "margin-bottom:auto".into());
    m.insert("ml-auto".into(), "margin-left:auto".into());

    m.insert("space-x-reverse".into(), "& > :not([hidden]) ~ :not([hidden]) { --garur-space-x-reverse:1; }".into());
    m.insert("space-y-reverse".into(), "& > :not([hidden]) ~ :not([hidden]) { --garur-space-y-reverse:1; }".into());
}

fn gen_sizing(m: &mut FxHashMap<String, String>) {
    for &(k, v) in SPACING {
        m.insert(format!("w-{}", k), format!("width:{}", v));
        m.insert(format!("h-{}", k), format!("height:{}", v));
        m.insert(format!("min-w-{}", k), format!("min-width:{}", v));
        m.insert(format!("min-h-{}", k), format!("min-height:{}", v));
        m.insert(format!("max-w-{}", k), format!("max-width:{}", v));
        m.insert(format!("max-h-{}", k), format!("max-height:{}", v));
        m.insert(format!("size-{}", k), format!("width:{};height:{}", v, v));
        m.insert(format!("basis-{}", k), format!("flex-basis:{}", v));
    }

    for (k, v) in [
        ("auto", "auto"), ("min", "min-content"), ("max", "max-content"),
        ("fit", "fit-content"), ("full", "100%"), ("screen", "100vw"),
        ("svw", "100svw"), ("lvw", "100lvw"), ("dvw", "100dvw"),
    ] {
        m.insert(format!("w-{}", k), format!("width:{}", v));
    }
    for (k, v) in [
        ("auto", "auto"), ("min", "min-content"), ("max", "max-content"),
        ("fit", "fit-content"), ("full", "100%"), ("screen", "100vh"),
        ("svh", "100svh"), ("lvh", "100lvh"), ("dvh", "100dvh"),
    ] {
        m.insert(format!("h-{}", k), format!("height:{}", v));
    }

    for (k, v) in [
        ("1/2", "50%"), ("1/3", "33.333333%"), ("2/3", "66.666667%"),
        ("1/4", "25%"), ("2/4", "50%"), ("3/4", "75%"),
        ("1/5", "20%"), ("2/5", "40%"), ("3/5", "60%"), ("4/5", "80%"),
        ("1/6", "16.666667%"), ("5/6", "83.333333%"),
        ("1/12", "8.333333%"), ("2/12", "16.666667%"), ("3/12", "25%"),
        ("4/12", "33.333333%"), ("5/12", "41.666667%"), ("6/12", "50%"),
        ("7/12", "58.333333%"), ("8/12", "66.666667%"), ("9/12", "75%"),
        ("10/12", "83.333333%"), ("11/12", "91.666667%"),
    ] {
        m.insert(format!("w-{}", k), format!("width:{}", v));
        m.insert(format!("h-{}", k), format!("height:{}", v));
        m.insert(format!("basis-{}", k), format!("flex-basis:{}", v));
    }

    for (k, v) in [
        ("xs", "20rem"), ("sm", "24rem"), ("md", "28rem"), ("lg", "32rem"),
        ("xl", "36rem"), ("2xl", "42rem"), ("3xl", "48rem"), ("4xl", "56rem"),
        ("5xl", "64rem"), ("6xl", "72rem"), ("7xl", "80rem"),
        ("prose", "65ch"), ("screen-sm", "640px"), ("screen-md", "768px"),
        ("screen-lg", "1024px"), ("screen-xl", "1280px"), ("screen-2xl", "1536px"),
        ("none", "none"),
    ] {
        m.insert(format!("max-w-{}", k), format!("max-width:{}", v));
    }
    m.insert("min-w-0".into(), "min-width:0".into());
    m.insert("min-h-0".into(), "min-height:0".into());
    m.insert("min-w-full".into(), "min-width:100%".into());
    m.insert("min-h-full".into(), "min-height:100%".into());
    m.insert("min-h-screen".into(), "min-height:100vh".into());
}

fn gen_typography(m: &mut FxHashMap<String, String>) {
    for (k, v) in [
        ("xs", "font-size:0.75rem;line-height:1rem"),
        ("sm", "font-size:0.875rem;line-height:1.25rem"),
        ("base", "font-size:1rem;line-height:1.5rem"),
        ("lg", "font-size:1.125rem;line-height:1.75rem"),
        ("xl", "font-size:1.25rem;line-height:1.75rem"),
        ("2xl", "font-size:1.5rem;line-height:2rem"),
        ("3xl", "font-size:1.875rem;line-height:2.25rem"),
        ("4xl", "font-size:2.25rem;line-height:2.5rem"),
        ("5xl", "font-size:3rem;line-height:1"),
        ("6xl", "font-size:3.75rem;line-height:1"),
        ("7xl", "font-size:4.5rem;line-height:1"),
        ("8xl", "font-size:6rem;line-height:1"),
        ("9xl", "font-size:8rem;line-height:1"),
    ] {
        m.insert(format!("text-{}", k), v.into());
    }

    for (k, v) in [
        ("thin", "100"), ("extralight", "200"), ("light", "300"),
        ("normal", "400"), ("medium", "500"), ("semibold", "600"),
        ("bold", "700"), ("extrabold", "800"), ("black", "900"),
    ] {
        m.insert(format!("font-{}", k), format!("font-weight:{}", v));
    }

    m.insert("font-sans".into(), "font-family:ui-sans-serif, system-ui, sans-serif".into());
    m.insert("font-serif".into(), "font-family:ui-serif, Georgia, serif".into());
    m.insert("font-mono".into(), "font-family:ui-monospace, Monaco, monospace".into());

    for (k, v) in [
        ("left", "left"), ("center", "center"), ("right", "right"),
        ("justify", "justify"), ("start", "start"), ("end", "end"),
    ] {
        m.insert(format!("text-{}", k), format!("text-align:{}", v));
    }

    m.insert("uppercase".into(), "text-transform:uppercase".into());
    m.insert("lowercase".into(), "text-transform:lowercase".into());
    m.insert("capitalize".into(), "text-transform:capitalize".into());
    m.insert("normal-case".into(), "text-transform:none".into());

    m.insert("underline".into(), "text-decoration-line:underline".into());
    m.insert("overline".into(), "text-decoration-line:overline".into());
    m.insert("line-through".into(), "text-decoration-line:line-through".into());
    m.insert("no-underline".into(), "text-decoration-line:none".into());

    for (k, v) in [
        ("solid", "solid"), ("double", "double"), ("dotted", "dotted"),
        ("dashed", "dashed"), ("wavy", "wavy"),
    ] {
        m.insert(format!("decoration-{}", k), format!("text-decoration-style:{}", v));
    }

    for &(k, v) in BORDER_WIDTH {
        if k == "DEFAULT" { continue; }
        m.insert(format!("decoration-{}", k), format!("text-decoration-thickness:{}", v));
    }
    m.insert("decoration-auto".into(), "text-decoration-thickness:auto".into());
    m.insert("decoration-from-font".into(), "text-decoration-thickness:from-font".into());

    for &(k, v) in SPACING {
        m.insert(format!("underline-offset-{}", k), format!("text-underline-offset:{}", v));
    }
    m.insert("underline-offset-auto".into(), "text-underline-offset:auto".into());

    for (k, v) in [
        ("normal", "normal"), ("nowrap", "nowrap"), ("pre", "pre"),
        ("pre-line", "pre-line"), ("pre-wrap", "pre-wrap"),
        ("break-spaces", "break-spaces"),
    ] {
        m.insert(format!("whitespace-{}", k), format!("white-space:{}", v));
    }

    m.insert("break-normal".into(), "word-break:normal;overflow-wrap:normal".into());
    m.insert("break-all".into(), "word-break:break-all".into());
    m.insert("break-keep".into(), "word-break:keep-all".into());
    m.insert("break-words".into(), "overflow-wrap:break-word".into());
    m.insert("break-anywhere".into(), "overflow-wrap:anywhere".into());

    for (k, v) in [
        ("none", "1"), ("tight", "1.25"), ("snug", "1.375"),
        ("normal", "1.5"), ("relaxed", "1.625"), ("loose", "2"),
        ("3", ".75rem"), ("4", "1rem"), ("5", "1.25rem"), ("6", "1.5rem"),
        ("7", "1.75rem"), ("8", "2rem"), ("9", "2.25rem"), ("10", "2.5rem"),
    ] {
        m.insert(format!("leading-{}", k), format!("line-height:{}", v));
    }

    for (k, v) in [
        ("tighter", "-0.05em"), ("tight", "-0.025em"), ("normal", "0"),
        ("wide", "0.025em"), ("wider", "0.05em"), ("widest", "0.1em"),
    ] {
        m.insert(format!("tracking-{}", k), format!("letter-spacing:{}", v));
    }

    for &(k, v) in SPACING {
        m.insert(format!("indent-{}", k), format!("text-indent:{}", v));
    }

    for n in 1..=6 {
        m.insert(format!("line-clamp-{}", n), format!("display:-webkit-box;-webkit-line-clamp:{};-webkit-box-orient:vertical;overflow:hidden", n));
    }
    m.insert("line-clamp-none".into(), "overflow:visible;-webkit-line-clamp:unset;-webkit-box-orient:horizontal;display:block".into());

    m.insert("truncate".into(), "overflow:hidden;text-overflow:ellipsis;white-space:nowrap".into());
    m.insert("text-ellipsis".into(), "text-overflow:ellipsis".into());
    m.insert("text-clip".into(), "text-overflow:clip".into());

    m.insert("text-wrap".into(), "text-wrap:wrap".into());
    m.insert("text-nowrap".into(), "text-wrap:nowrap".into());
    m.insert("text-balance".into(), "text-wrap:balance".into());
    m.insert("text-pretty".into(), "text-wrap:pretty".into());

    for (k, v) in [
        ("baseline", "baseline"), ("top", "top"), ("middle", "middle"),
        ("bottom", "bottom"), ("text-top", "text-top"),
        ("text-bottom", "text-bottom"), ("sub", "sub"), ("super", "super"),
    ] {
        m.insert(format!("align-{}", k), format!("vertical-align:{}", v));
    }

    for (k, v) in [
        ("none", "none"), ("disc", "disc"), ("decimal", "decimal"),
        ("circle", "circle"), ("square", "square"),
    ] {
        m.insert(format!("list-{}", k), format!("list-style-type:{}", v));
    }
    m.insert("list-inside".into(), "list-style-position:inside".into());
    m.insert("list-outside".into(), "list-style-position:outside".into());

    m.insert("hyphens-none".into(), "hyphens:none".into());
    m.insert("hyphens-manual".into(), "hyphens:manual".into());
    m.insert("hyphens-auto".into(), "hyphens:auto".into());

    m.insert("antialiased".into(), "-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale".into());
    m.insert("subpixel-antialiased".into(), "-webkit-font-smoothing:auto;-moz-osx-font-smoothing:auto".into());

    m.insert("italic".into(), "font-style:italic".into());
    m.insert("not-italic".into(), "font-style:normal".into());

    for (k, v) in [
        ("normal-nums", "normal"),
        ("ordinal", "ordinal"),
        ("slashed-zero", "slashed-zero"),
        ("lining-nums", "lining-nums"),
        ("oldstyle-nums", "oldstyle-nums"),
        ("proportional-nums", "proportional-nums"),
        ("tabular-nums", "tabular-nums"),
        ("diagonal-fractions", "diagonal-fractions"),
        ("stacked-fractions", "stacked-fractions"),
    ] {
        m.insert(k.into(), format!("font-variant-numeric:{}", v));
    }
}

fn gen_colors(m: &mut FxHashMap<String, String>, palette: &FxHashMap<String, String>) {
    // Pre-size per-token expansions (11 color props + 21 opacity steps × 6 = ~140 per token)
    for (token, color) in palette {
        m.insert(format!("bg-{}", token), format!("background-color:{}", color));
        m.insert(format!("text-{}", token), format!("color:{}", color));
        m.insert(format!("border-{}", token), format!("border-color:{}", color));
        m.insert(format!("fill-{}", token), format!("fill:{}", color));
        m.insert(format!("stroke-{}", token), format!("stroke:{}", color));
        m.insert(format!("accent-{}", token), format!("accent-color:{}", color));
        m.insert(format!("caret-{}", token), format!("caret-color:{}", color));
        m.insert(format!("decoration-{}", token), format!("text-decoration-color:{}", color));
        m.insert(format!("outline-{}", token), format!("outline-color:{}", color));
        m.insert(format!("ring-{}", token), format!("--garur-ring-color:{}", color));
        m.insert(format!("divide-{}", token), format!("& > :not([hidden]) ~ :not([hidden]) {{ border-color:{}; }}", color));
        m.insert(format!("from-{}", token), format!("--garur-gradient-from:{}", color));
        m.insert(format!("via-{}", token), format!("--garur-gradient-via:{}", color));
        m.insert(format!("to-{}", token), format!("--garur-gradient-to:{}", color));

        for &op in OPACITY_STEPS {
            let c = apply_alpha(color, op);
            m.insert(format!("bg-{}/{}", token, op), format!("background-color:{}", c));
            m.insert(format!("text-{}/{}", token, op), format!("color:{}", c));
            m.insert(format!("border-{}/{}", token, op), format!("border-color:{}", c));
            m.insert(format!("fill-{}/{}", token, op), format!("fill:{}", c));
            m.insert(format!("stroke-{}/{}", token, op), format!("stroke:{}", c));
            m.insert(format!("decoration-{}/{}", token, op), format!("text-decoration-color:{}", c));
            m.insert(format!("outline-{}/{}", token, op), format!("outline-color:{}", c));
        }
    }

    for (k, v) in [
        ("bg-transparent", "background-color:transparent"),
        ("bg-current", "background-color:currentColor"),
        ("bg-inherit", "background-color:inherit"),
        ("text-transparent", "color:transparent"),
        ("text-current", "color:currentColor"),
        ("text-inherit", "color:inherit"),
        ("border-transparent", "border-color:transparent"),
        ("border-current", "border-color:currentColor"),
        ("border-inherit", "border-color:inherit"),
        ("fill-transparent", "fill:transparent"),
        ("fill-current", "fill:currentColor"),
        ("fill-none", "fill:none"),
        ("stroke-transparent", "stroke:transparent"),
        ("stroke-current", "stroke:currentColor"),
        ("stroke-none", "stroke:none"),
    ] {
        m.insert(k.into(), v.into());
    }
}

fn gen_gradients(m: &mut FxHashMap<String, String>, _palette: &FxHashMap<String, String>) {
    for (k, v) in [
        ("bg-gradient-to-t", "linear-gradient(to top, var(--garur-gradient-stops))"),
        ("bg-gradient-to-tr", "linear-gradient(to top right, var(--garur-gradient-stops))"),
        ("bg-gradient-to-r", "linear-gradient(to right, var(--garur-gradient-stops))"),
        ("bg-gradient-to-br", "linear-gradient(to bottom right, var(--garur-gradient-stops))"),
        ("bg-gradient-to-b", "linear-gradient(to bottom, var(--garur-gradient-stops))"),
        ("bg-gradient-to-bl", "linear-gradient(to bottom left, var(--garur-gradient-stops))"),
        ("bg-gradient-to-l", "linear-gradient(to left, var(--garur-gradient-stops))"),
        ("bg-gradient-to-tl", "linear-gradient(to top left, var(--garur-gradient-stops))"),
        ("bg-gradient-radial", "radial-gradient(var(--garur-gradient-stops))"),
        ("bg-gradient-conic", "conic-gradient(from 180deg at 50% 50%, var(--garur-gradient-stops))"),
    ] {
        m.insert(k.into(), format!("background-image:{};--garur-gradient-stops:var(--garur-gradient-from, transparent), var(--garur-gradient-via, transparent), var(--garur-gradient-to, transparent)", v));
    }
}

fn gen_border(m: &mut FxHashMap<String, String>) {
    for &(k, v) in RADIUS {
        if k == "DEFAULT" {
            m.insert("rounded".into(), format!("border-radius:{}", v));
        } else {
            m.insert(format!("rounded-{}", k), format!("border-radius:{}", v));
            m.insert(format!("rounded-t-{}", k), format!("border-top-left-radius:{};border-top-right-radius:{}", v, v));
            m.insert(format!("rounded-r-{}", k), format!("border-top-right-radius:{};border-bottom-right-radius:{}", v, v));
            m.insert(format!("rounded-b-{}", k), format!("border-bottom-left-radius:{};border-bottom-right-radius:{}", v, v));
            m.insert(format!("rounded-l-{}", k), format!("border-top-left-radius:{};border-bottom-left-radius:{}", v, v));
            m.insert(format!("rounded-tl-{}", k), format!("border-top-left-radius:{}", v));
            m.insert(format!("rounded-tr-{}", k), format!("border-top-right-radius:{}", v));
            m.insert(format!("rounded-br-{}", k), format!("border-bottom-right-radius:{}", v));
            m.insert(format!("rounded-bl-{}", k), format!("border-bottom-left-radius:{}", v));
            m.insert(format!("rounded-s-{}", k), format!("border-start-start-radius:{};border-end-start-radius:{}", v, v));
            m.insert(format!("rounded-e-{}", k), format!("border-start-end-radius:{};border-end-end-radius:{}", v, v));
        }
    }

    for &(k, v) in BORDER_WIDTH {
        if k == "DEFAULT" {
            m.insert("border".into(), format!("border-width:{}", v));
        } else {
            m.insert(format!("border-{}", k), format!("border-width:{}", v));
            m.insert(format!("border-x-{}", k), format!("border-left-width:{};border-right-width:{}", v, v));
            m.insert(format!("border-y-{}", k), format!("border-top-width:{};border-bottom-width:{}", v, v));
            m.insert(format!("border-s-{}", k), format!("border-inline-start-width:{}", v));
            m.insert(format!("border-e-{}", k), format!("border-inline-end-width:{}", v));
            m.insert(format!("border-t-{}", k), format!("border-top-width:{}", v));
            m.insert(format!("border-r-{}", k), format!("border-right-width:{}", v));
            m.insert(format!("border-b-{}", k), format!("border-bottom-width:{}", v));
            m.insert(format!("border-l-{}", k), format!("border-left-width:{}", v));
        }
    }

    m.insert("border-t".into(), "border-top-width:1px".into());
    m.insert("border-r".into(), "border-right-width:1px".into());
    m.insert("border-b".into(), "border-bottom-width:1px".into());
    m.insert("border-l".into(), "border-left-width:1px".into());
    m.insert("border-x".into(), "border-left-width:1px;border-right-width:1px".into());
    m.insert("border-y".into(), "border-top-width:1px;border-bottom-width:1px".into());
    m.insert("border-s".into(), "border-inline-start-width:1px".into());
    m.insert("border-e".into(), "border-inline-end-width:1px".into());

    for (k, v) in [
        ("solid", "solid"), ("dashed", "dashed"), ("dotted", "dotted"),
        ("double", "double"), ("hidden", "hidden"), ("none", "none"),
    ] {
        m.insert(format!("border-{}", k), format!("border-style:{}", v));
    }

    for &(k, v) in BORDER_WIDTH {
        if k == "DEFAULT" { continue; }
        m.insert(format!("divide-x-{}", k), format!(
            "& > :not([hidden]) ~ :not([hidden]) {{ --garur-divide-x-reverse:0; border-right-width:calc({v} * var(--garur-divide-x-reverse)); border-left-width:calc({v} * calc(1 - var(--garur-divide-x-reverse))); }}", v = v));
        m.insert(format!("divide-y-{}", k), format!(
            "& > :not([hidden]) ~ :not([hidden]) {{ --garur-divide-y-reverse:0; border-top-width:calc({v} * calc(1 - var(--garur-divide-y-reverse))); border-bottom-width:calc({v} * var(--garur-divide-y-reverse)); }}", v = v));
    }
    m.insert("divide-x".into(), "& > :not([hidden]) ~ :not([hidden]) { border-left-width:1px; }".into());
    m.insert("divide-y".into(), "& > :not([hidden]) ~ :not([hidden]) { border-top-width:1px; }".into());
    m.insert("divide-x-reverse".into(), "& > :not([hidden]) ~ :not([hidden]) { --garur-divide-x-reverse:1; }".into());
    m.insert("divide-y-reverse".into(), "& > :not([hidden]) ~ :not([hidden]) { --garur-divide-y-reverse:1; }".into());

    for &(k, v) in BORDER_WIDTH {
        if k == "DEFAULT" { continue; }
        m.insert(format!("divide-s-{}", k), format!("& > :not([hidden]) ~ :not([hidden]) {{ border-inline-start-width:{}; }}", v));
        m.insert(format!("divide-e-{}", k), format!("& > :not([hidden]) ~ :not([hidden]) {{ border-inline-end-width:{}; }}", v));
    }
    m.insert("divide-s".into(), "& > :not([hidden]) ~ :not([hidden]) { border-inline-start-width:1px; }".into());
    m.insert("divide-e".into(), "& > :not([hidden]) ~ :not([hidden]) { border-inline-end-width:1px; }".into());

    for (k, v) in [
        ("solid", "solid"), ("dashed", "dashed"), ("dotted", "dotted"),
        ("double", "double"), ("none", "none"),
    ] {
        m.insert(format!("divide-{}", k), format!("& > :not([hidden]) ~ :not([hidden]) {{ border-style:{}; }}", v));
    }

    m.insert("outline-none".into(), "outline:2px solid transparent;outline-offset:2px".into());
    m.insert("outline".into(), "outline-style:solid".into());
    m.insert("outline-dashed".into(), "outline-style:dashed".into());
    m.insert("outline-dotted".into(), "outline-style:dotted".into());
    m.insert("outline-double".into(), "outline-style:double".into());
    for &(k, v) in BORDER_WIDTH {
        if k == "DEFAULT" { continue; }
        m.insert(format!("outline-{}", k), format!("outline-width:{}", v));
    }
    for &(k, v) in SPACING {
        m.insert(format!("outline-offset-{}", k), format!("outline-offset:{}", v));
    }
    m.insert("outline-offset-0".into(), "outline-offset:0px".into());

    m.insert("border-collapse".into(), "border-collapse:collapse".into());
    m.insert("border-separate".into(), "border-collapse:separate".into());
    for &(k, v) in SPACING {
        m.insert(format!("border-spacing-{}", k), format!("border-spacing:{}", v));
    }
}

fn gen_effects(m: &mut FxHashMap<String, String>) {
    for &(k, v) in OPACITY {
        m.insert(format!("opacity-{}", k), format!("opacity:{}", v));
    }

    for &(k, v) in SHADOW {
        if k == "DEFAULT" {
            m.insert("shadow".into(), format!("box-shadow:{}", v));
        } else {
            m.insert(format!("shadow-{}", k), format!("box-shadow:{}", v));
        }
    }

    m.insert("ring".into(), "--garur-ring-width:3px;--garur-ring-color:rgb(59 130 246 / 0.5);box-shadow:0 0 0 calc(var(--garur-ring-width) + var(--garur-ring-offset-width, 0px)) var(--garur-ring-color)".into());
    m.insert("ring-0".into(), "--garur-ring-width:0px;box-shadow:0 0 0 calc(var(--garur-ring-width) + var(--garur-ring-offset-width, 0px)) var(--garur-ring-color, rgb(59 130 246 / 0.5))".into());
    for (k, w) in [("1", "1px"), ("2", "2px"), ("4", "4px"), ("8", "8px")] {
        m.insert(format!("ring-{}", k), format!(
            "--garur-ring-width:{};box-shadow:0 0 0 calc(var(--garur-ring-width) + var(--garur-ring-offset-width, 0px)) var(--garur-ring-color, rgb(59 130 246 / 0.5))", w));
    }
    m.insert("ring-inset".into(), "--garur-ring-inset:inset".into());
    for &(k, v) in SPACING {
        m.insert(format!("ring-offset-{}", k), format!("--garur-ring-offset-width:{}", v));
    }

    for (k, v) in [
        ("normal", "normal"), ("multiply", "multiply"), ("screen", "screen"),
        ("overlay", "overlay"), ("darken", "darken"), ("lighten", "lighten"),
        ("color-dodge", "color-dodge"), ("color-burn", "color-burn"),
        ("hard-light", "hard-light"), ("soft-light", "soft-light"),
        ("difference", "difference"), ("exclusion", "exclusion"),
        ("hue", "hue"), ("saturation", "saturation"), ("color", "color"),
        ("luminosity", "luminosity"),
    ] {
        m.insert(format!("mix-blend-{}", k), format!("mix-blend-mode:{}", v));
        m.insert(format!("bg-blend-{}", k), format!("background-blend-mode:{}", v));
    }

    for (k, v) in [("fixed", "fixed"), ("local", "local"), ("scroll", "scroll")] {
        m.insert(format!("bg-{}", k), format!("background-attachment:{}", v));
    }

    for (k, v) in [("border", "border-box"), ("padding", "padding-box"), ("content", "content-box")] {
        m.insert(format!("bg-origin-{}", k), format!("background-origin:{}", v));
    }
    for (k, v) in [
        ("repeat", "repeat"), ("no-repeat", "no-repeat"),
        ("repeat-x", "repeat-x"), ("repeat-y", "repeat-y"),
        ("repeat-round", "round"), ("repeat-space", "space"),
    ] {
        m.insert(format!("bg-{}", k), format!("background-repeat:{}", v));
    }
    for (k, v) in [
        ("bottom", "bottom"), ("center", "center"), ("left", "left"),
        ("left-bottom", "left bottom"), ("left-top", "left top"),
        ("right", "right"), ("right-bottom", "right bottom"),
        ("right-top", "right top"), ("top", "top"),
    ] {
        m.insert(format!("bg-{}", k), format!("background-position:{}", v));
    }
    for (k, v) in [("auto", "auto"), ("cover", "cover"), ("contain", "contain")] {
        m.insert(format!("bg-{}", k), format!("background-size:{}", v));
    }
    m.insert("bg-none".into(), "background-image:none".into());
}

fn gen_flex(m: &mut FxHashMap<String, String>) {
    m.insert("flex".into(), "display:flex".into());
    m.insert("inline-flex".into(), "display:inline-flex".into());

    for (k, v) in [
        ("row", "row"), ("row-reverse", "row-reverse"),
        ("col", "column"), ("col-reverse", "column-reverse"),
    ] {
        m.insert(format!("flex-{}", k), format!("flex-direction:{}", v));
    }
    for (k, v) in [
        ("wrap", "wrap"), ("wrap-reverse", "wrap-reverse"), ("nowrap", "nowrap"),
    ] {
        m.insert(format!("flex-{}", k), format!("flex-wrap:{}", v));
    }

    m.insert("flex-1".into(), "flex:1 1 0%".into());
    m.insert("flex-auto".into(), "flex:1 1 auto".into());
    m.insert("flex-initial".into(), "flex:0 1 auto".into());
    m.insert("flex-none".into(), "flex:none".into());

    m.insert("grow".into(), "flex-grow:1".into());
    m.insert("grow-0".into(), "flex-grow:0".into());
    m.insert("shrink".into(), "flex-shrink:1".into());
    m.insert("shrink-0".into(), "flex-shrink:0".into());

    for (k, v) in [
        ("start", "flex-start"), ("end", "flex-end"), ("center", "center"),
        ("between", "space-between"), ("around", "space-around"),
        ("evenly", "space-evenly"), ("stretch", "stretch"),
        ("normal", "normal"),
    ] {
        m.insert(format!("justify-{}", k), format!("justify-content:{}", v));
    }
    for (k, v) in [
        ("start", "flex-start"), ("end", "flex-end"), ("center", "center"),
        ("baseline", "baseline"), ("stretch", "stretch"),
    ] {
        m.insert(format!("items-{}", k), format!("align-items:{}", v));
    }
    for (k, v) in [
        ("start", "flex-start"), ("end", "flex-end"), ("center", "center"),
        ("between", "space-between"), ("around", "space-around"),
        ("evenly", "space-evenly"),
        ("baseline", "baseline"), ("stretch", "stretch"),
        ("normal", "normal"),
    ] {
        m.insert(format!("content-{}", k), format!("align-content:{}", v));
    }
    for (k, v) in [
        ("auto", "auto"), ("start", "flex-start"), ("end", "flex-end"),
        ("center", "center"), ("stretch", "stretch"), ("baseline", "baseline"),
    ] {
        m.insert(format!("self-{}", k), format!("align-self:{}", v));
    }
    for (k, v) in [
        ("start", "start"), ("end", "end"), ("center", "center"), ("stretch", "stretch"),
    ] {
        m.insert(format!("justify-items-{}", k), format!("justify-items:{}", v));
        m.insert(format!("justify-self-{}", k), format!("justify-self:{}", v));
        m.insert(format!("place-items-{}", k), format!("place-items:{}", v));
        m.insert(format!("place-content-{}", k), format!("place-content:{}", v));
        m.insert(format!("place-self-{}", k), format!("place-self:{}", v));
    }
}

fn gen_grid(m: &mut FxHashMap<String, String>) {
    m.insert("grid".into(), "display:grid".into());
    m.insert("inline-grid".into(), "display:inline-grid".into());

    for i in 1..=12 {
        m.insert(format!("grid-cols-{}", i), format!("grid-template-columns:repeat({}, minmax(0, 1fr))", i));
        m.insert(format!("grid-rows-{}", i), format!("grid-template-rows:repeat({}, minmax(0, 1fr))", i));
        m.insert(format!("col-span-{}", i), format!("grid-column:span {} / span {}", i, i));
        m.insert(format!("row-span-{}", i), format!("grid-row:span {} / span {}", i, i));
    }
    m.insert("grid-cols-none".into(), "grid-template-columns:none".into());
    m.insert("grid-rows-none".into(), "grid-template-rows:none".into());
    m.insert("grid-cols-subgrid".into(), "grid-template-columns:subgrid".into());
    m.insert("grid-rows-subgrid".into(), "grid-template-rows:subgrid".into());

    m.insert("col-auto".into(), "grid-column:auto".into());
    m.insert("col-span-full".into(), "grid-column:1 / -1".into());
    m.insert("row-auto".into(), "grid-row:auto".into());
    m.insert("row-span-full".into(), "grid-row:1 / -1".into());

    for i in 1..=13 {
        m.insert(format!("col-start-{}", i), format!("grid-column-start:{}", i));
        m.insert(format!("col-end-{}", i), format!("grid-column-end:{}", i));
    }
    for i in 1..=7 {
        m.insert(format!("row-start-{}", i), format!("grid-row-start:{}", i));
        m.insert(format!("row-end-{}", i), format!("grid-row-end:{}", i));
    }
    m.insert("col-start-auto".into(), "grid-column-start:auto".into());
    m.insert("col-end-auto".into(), "grid-column-end:auto".into());
    m.insert("row-start-auto".into(), "grid-row-start:auto".into());
    m.insert("row-end-auto".into(), "grid-row-end:auto".into());

    for (k, v) in [
        ("row", "row"), ("col", "column"), ("dense", "dense"),
        ("row-dense", "row dense"), ("col-dense", "column dense"),
    ] {
        m.insert(format!("grid-flow-{}", k), format!("grid-auto-flow:{}", v));
    }
    for (k, v) in [
        ("auto", "auto"), ("min", "min-content"), ("max", "max-content"),
        ("fr", "minmax(0, 1fr)"),
    ] {
        m.insert(format!("auto-cols-{}", k), format!("grid-auto-columns:{}", v));
        m.insert(format!("auto-rows-{}", k), format!("grid-auto-rows:{}", v));
    }
}

fn gen_columns(m: &mut FxHashMap<String, String>) {
    for n in 1..=12 {
        m.insert(format!("columns-{}", n), format!("columns:{}", n));
    }
    for (k, v) in [
        ("auto", "auto"), ("3xs", "16rem"), ("2xs", "18rem"),
        ("xs", "20rem"), ("sm", "24rem"), ("md", "28rem"),
        ("lg", "32rem"), ("xl", "36rem"), ("2xl", "42rem"),
        ("3xl", "48rem"), ("4xl", "56rem"), ("5xl", "64rem"),
        ("6xl", "72rem"), ("7xl", "80rem"),
    ] {
        m.insert(format!("columns-{}", k), format!("columns:{}", v));
    }
}

fn gen_transform(m: &mut FxHashMap<String, String>) {
    m.insert("transform".into(), "transform:translate(var(--garur-translate-x, 0), var(--garur-translate-y, 0)) rotate(var(--garur-rotate, 0)) skewX(var(--garur-skew-x, 0)) skewY(var(--garur-skew-y, 0)) scaleX(var(--garur-scale-x, 1)) scaleY(var(--garur-scale-y, 1))".into());
    m.insert("transform-none".into(), "transform:none".into());
    m.insert("transform-gpu".into(), "transform:translate3d(var(--garur-translate-x, 0), var(--garur-translate-y, 0), 0) rotate(var(--garur-rotate, 0)) skewX(var(--garur-skew-x, 0)) skewY(var(--garur-skew-y, 0)) scaleX(var(--garur-scale-x, 1)) scaleY(var(--garur-scale-y, 1))".into());
    m.insert("transform-cpu".into(), "transform:none".into());

    for (k, v) in [
        ("0", "0deg"), ("1", "1deg"), ("2", "2deg"), ("3", "3deg"),
        ("6", "6deg"), ("12", "12deg"), ("45", "45deg"), ("90", "90deg"),
        ("180", "180deg"),
    ] {
        m.insert(format!("rotate-{}", k), format!("--garur-rotate:{};transform:var(--garur-rotate)", v));
        m.insert(format!("-rotate-{}", k), format!("--garur-rotate:-{};transform:var(--garur-rotate)", v));
    }

    for (k, v) in [
        ("0", "0"), ("50", "0.5"), ("75", "0.75"), ("90", "0.9"),
        ("95", "0.95"), ("100", "1"), ("105", "1.05"), ("110", "1.1"),
        ("125", "1.25"), ("150", "1.5"),
    ] {
        m.insert(format!("scale-{}", k), format!("--garur-scale-x:{};--garur-scale-y:{};transform:scaleX(var(--garur-scale-x)) scaleY(var(--garur-scale-y))", v, v));
        m.insert(format!("scale-x-{}", k), format!("--garur-scale-x:{};transform:scaleX(var(--garur-scale-x))", v));
        m.insert(format!("scale-y-{}", k), format!("--garur-scale-y:{};transform:scaleY(var(--garur-scale-y))", v));
    }

    for &(k, v) in SPACING {
        m.insert(format!("translate-x-{}", k), format!("--garur-translate-x:{};transform:translateX(var(--garur-translate-x))", v));
        m.insert(format!("translate-y-{}", k), format!("--garur-translate-y:{};transform:translateY(var(--garur-translate-y))", v));
        m.insert(format!("-translate-x-{}", k), format!("--garur-translate-x:-{};transform:translateX(var(--garur-translate-x))", v));
        m.insert(format!("-translate-y-{}", k), format!("--garur-translate-y:-{};transform:translateY(var(--garur-translate-y))", v));
    }
    m.insert("translate-x-full".into(), "--garur-translate-x:100%;transform:translateX(100%)".into());
    m.insert("translate-y-full".into(), "--garur-translate-y:100%;transform:translateY(100%)".into());
    m.insert("translate-x-1/2".into(), "--garur-translate-x:50%;transform:translateX(50%)".into());
    m.insert("translate-y-1/2".into(), "--garur-translate-y:50%;transform:translateY(50%)".into());

    for (k, v) in [
        ("0", "0deg"), ("1", "1deg"), ("2", "2deg"), ("3", "3deg"),
        ("6", "6deg"), ("12", "12deg"),
    ] {
        m.insert(format!("skew-x-{}", k), format!("--garur-skew-x:{};transform:skewX(var(--garur-skew-x))", v));
        m.insert(format!("skew-y-{}", k), format!("--garur-skew-y:{};transform:skewY(var(--garur-skew-y))", v));
        m.insert(format!("-skew-x-{}", k), format!("--garur-skew-x:-{};transform:skewX(var(--garur-skew-x))", v));
        m.insert(format!("-skew-y-{}", k), format!("--garur-skew-y:-{};transform:skewY(var(--garur-skew-y))", v));
    }

    for (k, v) in [
        ("center", "center"), ("top", "top"), ("top-right", "top right"),
        ("right", "right"), ("bottom-right", "bottom right"),
        ("bottom", "bottom"), ("bottom-left", "bottom left"),
        ("left", "left"), ("top-left", "top left"),
    ] {
        m.insert(format!("origin-{}", k), format!("transform-origin:{}", v));
    }
    m.insert("origin-x-center".into(), "transform-origin:center x".into());
    m.insert("origin-y-center".into(), "transform-origin:center y".into());
    m.insert("origin-z-center".into(), "transform-origin:center z".into());
}

fn gen_filter(m: &mut FxHashMap<String, String>) {
    for (k, v) in [
        ("none", "0"), ("sm", "4px"), ("DEFAULT", "8px"), ("md", "12px"),
        ("lg", "16px"), ("xl", "24px"), ("2xl", "40px"), ("3xl", "64px"),
    ] {
        if k == "DEFAULT" {
            m.insert("blur".into(), format!("--garur-blur:blur({});filter:var(--garur-blur)", v));
            m.insert("backdrop-blur".into(), format!("--garur-backdrop-blur:blur({});backdrop-filter:var(--garur-backdrop-blur)", v));
        } else if k == "none" {
            m.insert("blur-none".into(), "--garur-blur: ;filter:var(--garur-blur)".into());
            m.insert("backdrop-blur-none".into(), "--garur-backdrop-blur: ;backdrop-filter:var(--garur-backdrop-blur)".into());
        } else {
            m.insert(format!("blur-{}", k), format!("--garur-blur:blur({});filter:var(--garur-blur)", v));
            m.insert(format!("backdrop-blur-{}", k), format!("--garur-backdrop-blur:blur({});backdrop-filter:var(--garur-backdrop-blur)", v));
        }
    }

    for (k, v) in [
        ("0", "0"), ("50", ".5"), ("75", ".75"), ("90", ".9"),
        ("95", ".95"), ("100", "1"), ("105", "1.05"), ("110", "1.1"),
        ("125", "1.25"), ("150", "1.5"), ("200", "2"),
    ] {
        m.insert(format!("brightness-{}", k), format!("--garur-brightness:brightness({});filter:var(--garur-brightness)", v));
        m.insert(format!("contrast-{}", k), format!("--garur-contrast:contrast({});filter:var(--garur-contrast)", v));
        m.insert(format!("saturate-{}", k), format!("--garur-saturate:saturate({});filter:var(--garur-saturate)", v));
        m.insert(format!("backdrop-brightness-{}", k), format!("--garur-backdrop-brightness:brightness({});backdrop-filter:var(--garur-backdrop-brightness)", v));
        m.insert(format!("backdrop-contrast-{}", k), format!("--garur-backdrop-contrast:contrast({});backdrop-filter:var(--garur-backdrop-contrast)", v));
        m.insert(format!("backdrop-saturate-{}", k), format!("--garur-backdrop-saturate:saturate({});backdrop-filter:var(--garur-backdrop-saturate)", v));
    }

    for (k, v) in [
        ("0", "0deg"), ("15", "15deg"), ("30", "30deg"),
        ("60", "60deg"), ("90", "90deg"), ("180", "180deg"),
    ] {
        m.insert(format!("hue-rotate-{}", k), format!("--garur-hue-rotate:hue-rotate({});filter:var(--garur-hue-rotate)", v));
        m.insert(format!("-hue-rotate-{}", k), format!("--garur-hue-rotate:hue-rotate(-{});filter:var(--garur-hue-rotate)", v));
    }

    m.insert("grayscale".into(), "--garur-grayscale:grayscale(100%);filter:var(--garur-grayscale)".into());
    m.insert("grayscale-0".into(), "--garur-grayscale:grayscale(0);filter:var(--garur-grayscale)".into());
    m.insert("invert".into(), "--garur-invert:invert(100%);filter:var(--garur-invert)".into());
    m.insert("invert-0".into(), "--garur-invert:invert(0);filter:var(--garur-invert)".into());
    m.insert("sepia".into(), "--garur-sepia:sepia(100%);filter:var(--garur-sepia)".into());
    m.insert("sepia-0".into(), "--garur-sepia:sepia(0);filter:var(--garur-sepia)".into());

    m.insert("filter-none".into(), "filter:none".into());
    m.insert("backdrop-filter-none".into(), "backdrop-filter:none".into());
}

fn gen_animation(m: &mut FxHashMap<String, String>) {
    for (k, v) in [
        ("none", "none"),
        ("spin", "garur-spin 1s linear infinite"),
        ("ping", "garur-ping 1s cubic-bezier(0, 0, 0.2, 1) infinite"),
        ("pulse", "garur-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"),
        ("bounce", "garur-bounce 1s infinite"),
    ] {
        m.insert(format!("animate-{}", k), format!("animation:{}", v));
    }

    m.insert("transition".into(), "transition-property:color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms".into());
    m.insert("transition-none".into(), "transition-property:none".into());
    m.insert("transition-all".into(), "transition-property:all;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms".into());
    m.insert("transition-colors".into(), "transition-property:color, background-color, border-color, text-decoration-color, fill, stroke;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms".into());
    m.insert("transition-opacity".into(), "transition-property:opacity;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms".into());
    m.insert("transition-shadow".into(), "transition-property:box-shadow;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms".into());
    m.insert("transition-transform".into(), "transition-property:transform;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms".into());

    for &(k, v) in DURATIONS {
        m.insert(format!("delay-{}", k), format!("transition-delay:{}", v));
        m.insert(format!("duration-{}", k), format!("transition-duration:{}", v));
    }

    for (k, v) in [
        ("linear", "linear"), ("in", "cubic-bezier(0.4, 0, 1, 1)"),
        ("out", "cubic-bezier(0, 0, 0.2, 1)"),
        ("in-out", "cubic-bezier(0.4, 0, 0.2, 1)"),
    ] {
        m.insert(format!("ease-{}", k), format!("transition-timing-function:{}", v));
    }
}

fn gen_interaction(m: &mut FxHashMap<String, String>) {
    for (k, v) in [
        ("auto", "auto"), ("default", "default"), ("pointer", "pointer"),
        ("wait", "wait"), ("text", "text"), ("move", "move"),
        ("help", "help"), ("not-allowed", "not-allowed"),
        ("none", "none"), ("context-menu", "context-menu"),
        ("progress", "progress"), ("cell", "cell"), ("crosshair", "crosshair"),
        ("vertical-text", "vertical-text"), ("alias", "alias"),
        ("copy", "copy"), ("no-drop", "no-drop"), ("grab", "grab"),
        ("grabbing", "grabbing"), ("all-scroll", "all-scroll"),
        ("col-resize", "col-resize"), ("row-resize", "row-resize"),
        ("n-resize", "n-resize"), ("e-resize", "e-resize"),
        ("s-resize", "s-resize"), ("w-resize", "w-resize"),
        ("ne-resize", "ne-resize"), ("nw-resize", "nw-resize"),
        ("se-resize", "se-resize"), ("sw-resize", "sw-resize"),
        ("ew-resize", "ew-resize"), ("ns-resize", "ns-resize"),
        ("nesw-resize", "nesw-resize"), ("nwse-resize", "nwse-resize"),
        ("zoom-in", "zoom-in"), ("zoom-out", "zoom-out"),
    ] {
        m.insert(format!("cursor-{}", k), format!("cursor:{}", v));
    }

    for (k, v) in [
        ("none", "none"), ("text", "text"), ("all", "all"), ("auto", "auto"),
    ] {
        m.insert(format!("select-{}", k), format!("user-select:{}", v));
    }

    m.insert("pointer-events-none".into(), "pointer-events:none".into());
    m.insert("pointer-events-auto".into(), "pointer-events:auto".into());
    m.insert("appearance-none".into(), "appearance:none".into());
    m.insert("appearance-auto".into(), "appearance:auto".into());

    for (k, v) in [("none", "none"), ("y", "vertical"), ("x", "horizontal"), ("both", "both")] {
        m.insert(format!("resize-{}", k), format!("resize:{}", v));
    }
    m.insert("resize".into(), "resize:both".into());

    m.insert("scroll-auto".into(), "scroll-behavior:auto".into());
    m.insert("scroll-smooth".into(), "scroll-behavior:smooth".into());

    for (k, v) in [("none", "none"), ("x", "x"), ("y", "y"), ("both", "both")] {
        m.insert(format!("snap-{}", k), format!("scroll-snap-type:{} var(--garur-scroll-snap-strictness, mandatory)", v));
    }
    for (k, v) in [
        ("start", "start"), ("end", "end"), ("center", "center"),
        ("align-none", "none"),
    ] {
        m.insert(format!("snap-{}", k), format!("scroll-snap-align:{}", v));
    }
    m.insert("snap-mandatory".into(), "--garur-scroll-snap-strictness:mandatory".into());
    m.insert("snap-proximity".into(), "--garur-scroll-snap-strictness:proximity".into());
    m.insert("snap-always".into(), "scroll-snap-stop:always".into());
    m.insert("snap-normal".into(), "scroll-snap-stop:normal".into());

    for (k, v) in [
        ("auto", "auto"), ("none", "none"),
        ("pan-x", "pan-x"), ("pan-left", "pan-left"),
        ("pan-right", "pan-right"), ("pan-y", "pan-y"),
        ("pan-up", "pan-up"), ("pan-down", "pan-down"),
        ("pinch-zoom", "pinch-zoom"), ("manipulation", "manipulation"),
    ] {
        m.insert(format!("touch-{}", k), format!("touch-action:{}", v));
    }

    for (k, v) in [
        ("auto", "auto"), ("scroll", "scroll-position"),
        ("contents", "contents"), ("transform", "transform"),
    ] {
        m.insert(format!("will-change-{}", k), format!("will-change:{}", v));
    }

    m.insert("scrollbar-auto".into(), "scrollbar-width:auto;scrollbar-color:auto".into());
    m.insert("scrollbar-thin".into(), "scrollbar-width:thin".into());
    m.insert("scrollbar-none".into(), "scrollbar-width:none".into());
}

fn gen_svg(m: &mut FxHashMap<String, String>) {
    for (k, v) in [("0", "0"), ("1", "1"), ("2", "2")] {
        m.insert(format!("stroke-{}", k), format!("stroke-width:{}", v));
    }
}

fn gen_accessibility(m: &mut FxHashMap<String, String>) {
    m.insert("sr-only".into(), "position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0".into());
    m.insert("not-sr-only".into(), "position:static;width:auto;height:auto;padding:0;margin:0;overflow:visible;clip:auto;white-space:normal".into());
    m.insert("forced-color-adjust-auto".into(), "forced-color-adjust:auto".into());
    m.insert("forced-color-adjust-none".into(), "forced-color-adjust:none".into());
}

fn gen_table(m: &mut FxHashMap<String, String>) {
    m.insert("table-auto".into(), "table-layout:auto".into());
    m.insert("table-fixed".into(), "table-layout:fixed".into());
    m.insert("border-collapse".into(), "border-collapse:collapse".into());
    m.insert("border-separate".into(), "border-collapse:separate".into());
}

fn gen_misc(m: &mut FxHashMap<String, String>) {
    m.insert("backface-visible".into(), "backface-visibility:visible".into());
    m.insert("backface-hidden".into(), "backface-visibility:hidden".into());
    m.insert("content-none".into(), "content:none".into());
    m.insert("empty-cells-show".into(), "empty-cells:show".into());
    m.insert("empty-cells-hide".into(), "empty-cells:hide".into());
    m.insert("text-inherit".into(), "color:inherit".into());
    m.insert("text-start".into(), "text-align:start".into());
    m.insert("text-end".into(), "text-align:end".into());
}

fn gen_container_smart(m: &mut FxHashMap<String, String>) {
    m.insert("container".into(), "width:100%".into());

    for (name, w) in [
        ("sm", "640px"), ("md", "768px"), ("lg", "1024px"),
        ("xl", "1280px"), ("2xl", "1536px"),
    ] {
        m.insert(format!("container-{}", name), format!("max-width:{}", w));
    }

    m.insert("container-pad".into(), "padding-left:1rem;padding-right:1rem".into());
    m.insert("container-center".into(), "margin-left:auto;margin-right:auto".into());
}

fn gen_container_queries(m: &mut FxHashMap<String, String>) {
    m.insert("@container".into(), "container-type:inline-size".into());
    m.insert("container-normal".into(), "container-type:normal".into());
    m.insert("container-inline-size".into(), "container-type:inline-size".into());
    m.insert("container-size".into(), "container-type:size".into());
    for name in ["main", "sidebar", "card", "hero", "content"] {
        m.insert(format!("@container/{}", name), format!("container-type:inline-size;container-name:{}", name));
    }
}

fn gen_text_shadow(m: &mut FxHashMap<String, String>) {
    m.insert("text-shadow-sm".into(), "text-shadow:0 1px 2px rgb(0 0 0 / 0.05)".into());
    m.insert("text-shadow".into(), "text-shadow:0 1px 3px rgb(0 0 0 / 0.1)".into());
    m.insert("text-shadow-md".into(), "text-shadow:0 2px 4px rgb(0 0 0 / 0.1)".into());
    m.insert("text-shadow-lg".into(), "text-shadow:0 4px 8px rgb(0 0 0 / 0.12)".into());
    m.insert("text-shadow-xl".into(), "text-shadow:0 8px 16px rgb(0 0 0 / 0.15)".into());
    m.insert("text-shadow-none".into(), "text-shadow:none".into());
}

fn gen_backdrop_full(m: &mut FxHashMap<String, String>) {
    for (k, v) in [
        ("0", "0deg"), ("15", "15deg"), ("30", "30deg"),
        ("60", "60deg"), ("90", "90deg"), ("180", "180deg"),
    ] {
        m.insert(format!("backdrop-hue-rotate-{}", k), format!("--garur-backdrop-hue-rotate:hue-rotate({});backdrop-filter:var(--garur-backdrop-hue-rotate)", v));
        m.insert(format!("-backdrop-hue-rotate-{}", k), format!("--garur-backdrop-hue-rotate:hue-rotate(-{});backdrop-filter:var(--garur-backdrop-hue-rotate)", v));
    }

    for &(k, v) in OPACITY {
        m.insert(format!("backdrop-opacity-{}", k), format!("--garur-backdrop-opacity:opacity({});backdrop-filter:var(--garur-backdrop-opacity)", v));
    }

    m.insert("backdrop-grayscale".into(), "--garur-backdrop-grayscale:grayscale(100%);backdrop-filter:var(--garur-backdrop-grayscale)".into());
    m.insert("backdrop-grayscale-0".into(), "--garur-backdrop-grayscale:grayscale(0);backdrop-filter:var(--garur-backdrop-grayscale)".into());
    m.insert("backdrop-invert".into(), "--garur-backdrop-invert:invert(100%);backdrop-filter:var(--garur-backdrop-invert)".into());
    m.insert("backdrop-invert-0".into(), "--garur-backdrop-invert:invert(0);backdrop-filter:var(--garur-backdrop-invert)".into());
    m.insert("backdrop-sepia".into(), "--garur-backdrop-sepia:sepia(100%);backdrop-filter:var(--garur-backdrop-sepia)".into());
    m.insert("backdrop-sepia-0".into(), "--garur-backdrop-sepia:sepia(0);backdrop-filter:var(--garur-backdrop-sepia)".into());
}

fn gen_writing_mode(m: &mut FxHashMap<String, String>) {
    m.insert("writing-horizontal-tb".into(), "writing-mode:horizontal-tb".into());
    m.insert("writing-vertical-rl".into(), "writing-mode:vertical-rl".into());
    m.insert("writing-vertical-lr".into(), "writing-mode:vertical-lr".into());
    m.insert("text-orientation-mixed".into(), "text-orientation:mixed".into());
    m.insert("text-orientation-upright".into(), "text-orientation:upright".into());
    m.insert("text-orientation-sideways".into(), "text-orientation:sideways".into());
}

fn gen_logical_props(m: &mut FxHashMap<String, String>) {
    for &(k, v) in RADIUS {
        if k == "DEFAULT" { continue; }
        m.insert(format!("rounded-ss-{}", k), format!("border-start-start-radius:{}", v));
        m.insert(format!("rounded-se-{}", k), format!("border-start-end-radius:{}", v));
        m.insert(format!("rounded-es-{}", k), format!("border-end-start-radius:{}", v));
        m.insert(format!("rounded-ee-{}", k), format!("border-end-end-radius:{}", v));
    }
}

fn gen_more_colors(m: &mut FxHashMap<String, String>) {
    m.insert("ring-inset".into(), "--garur-ring-inset:inset".into());
}