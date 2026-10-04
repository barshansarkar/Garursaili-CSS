// ═══════════════════════════════════════════════════════════════════
// utilities_extended.rs — Extended utility coverage
// Adds ~4000 utilities to reach 5000+ total
// ═══════════════════════════════════════════════════════════════════

use rustc_hash::FxHashMap;

// ───────────────────────────────────────────────
// Scales
// ───────────────────────────────────────────────

const SPACING_FULL: &[(&str, &str)] = &[
    ("0", "0px"), ("px", "1px"),
    ("0.5", "0.125rem"), ("1", "0.25rem"), ("1.5", "0.375rem"),
    ("2", "0.5rem"), ("2.5", "0.625rem"), ("3", "0.75rem"),
    ("3.5", "0.875rem"), ("4", "1rem"), ("5", "1.25rem"),
    ("6", "1.5rem"), ("7", "1.75rem"), ("8", "2rem"),
    ("9", "2.25rem"), ("10", "2.5rem"), ("11", "2.75rem"),
    ("12", "3rem"), ("13", "3.25rem"), ("14", "3.5rem"),
    ("15", "3.75rem"), ("16", "4rem"), ("17", "4.25rem"),
    ("18", "4.5rem"), ("19", "4.75rem"), ("20", "5rem"),
    ("21", "5.25rem"), ("22", "5.5rem"), ("23", "5.75rem"),
    ("24", "6rem"), ("25", "6.25rem"), ("26", "6.5rem"),
    ("27", "6.75rem"), ("28", "7rem"), ("30", "7.5rem"),
    ("32", "8rem"), ("34", "8.5rem"), ("36", "9rem"),
    ("38", "9.5rem"), ("40", "10rem"), ("42", "10.5rem"),
    ("44", "11rem"), ("46", "11.5rem"), ("48", "12rem"),
    ("50", "12.5rem"), ("52", "13rem"), ("56", "14rem"),
    ("60", "15rem"), ("64", "16rem"), ("68", "17rem"),
    ("72", "18rem"), ("76", "19rem"), ("80", "20rem"),
    ("84", "21rem"), ("88", "22rem"), ("92", "23rem"),
    ("96", "24rem"), ("100", "25rem"), ("104", "26rem"),
    ("108", "27rem"), ("112", "28rem"), ("116", "29rem"),
    ("120", "30rem"), ("124", "31rem"), ("128", "32rem"),
];

const FRACTIONS: &[(&str, &str)] = &[
    ("1/2", "50%"), ("1/3", "33.333333%"), ("2/3", "66.666667%"),
    ("1/4", "25%"), ("2/4", "50%"), ("3/4", "75%"),
    ("1/5", "20%"), ("2/5", "40%"), ("3/5", "60%"), ("4/5", "80%"),
    ("1/6", "16.666667%"), ("2/6", "33.333333%"), ("3/6", "50%"),
    ("4/6", "66.666667%"), ("5/6", "83.333333%"),
    ("1/8", "12.5%"), ("3/8", "37.5%"), ("5/8", "62.5%"), ("7/8", "87.5%"),
    ("1/10", "10%"), ("3/10", "30%"), ("7/10", "70%"), ("9/10", "90%"),
    ("1/12", "8.333333%"), ("2/12", "16.666667%"), ("3/12", "25%"),
    ("4/12", "33.333333%"), ("5/12", "41.666667%"), ("6/12", "50%"),
    ("7/12", "58.333333%"), ("8/12", "66.666667%"), ("9/12", "75%"),
    ("10/12", "83.333333%"), ("11/12", "91.666667%"),
];

// ───────────────────────────────────────────────
// Public entry
// ───────────────────────────────────────────────

pub fn generate_extended(m: &mut FxHashMap<String, String>) {
    gen_spacing_extended(m);
    gen_sizing_extended(m);
    gen_grid_extended(m);
    gen_flex_extended(m);
    gen_typography_extended(m);
    gen_transforms_extended(m);
    gen_filters_extended(m);
    gen_animations_extended(m);
    gen_borders_extended(m);
    gen_positions_extended(m);
    gen_lists_extended(m);
    gen_cursor_extended(m);
    gen_print_extended(m);
    gen_accessibility_extended(m);
    gen_mask_extended(m);
    gen_container_extended(m);
    gen_modern_css(m);
}

// ───────────────────────────────────────────────
// 1. SPACING — every property, all sides, negatives
// ───────────────────────────────────────────────

fn gen_spacing_extended(m: &mut FxHashMap<String, String>) {
    for &(k, v) in SPACING_FULL {
        // Padding — all sides + logical
        for (prefix, prop) in [
            ("p", "padding"),
            ("pt", "padding-top"),
            ("pr", "padding-right"),
            ("pb", "padding-bottom"),
            ("pl", "padding-left"),
            ("ps", "padding-inline-start"),
            ("pe", "padding-inline-end"),
        ] {
            m.entry(format!("{}-{}", prefix, k))
                .or_insert_with(|| format!("{}:{}", prop, v));
        }
        m.entry(format!("px-{}", k))
            .or_insert_with(|| format!("padding-left:{};padding-right:{}", v, v));
        m.entry(format!("py-{}", k))
            .or_insert_with(|| format!("padding-top:{};padding-bottom:{}", v, v));

        // Margin — all sides + logical
        for (prefix, prop) in [
            ("m", "margin"),
            ("mt", "margin-top"),
            ("mr", "margin-right"),
            ("mb", "margin-bottom"),
            ("ml", "margin-left"),
            ("ms", "margin-inline-start"),
            ("me", "margin-inline-end"),
        ] {
            m.entry(format!("{}-{}", prefix, k))
                .or_insert_with(|| format!("{}:{}", prop, v));
        }
        m.entry(format!("mx-{}", k))
            .or_insert_with(|| format!("margin-left:{};margin-right:{}", v, v));
        m.entry(format!("my-{}", k))
            .or_insert_with(|| format!("margin-top:{};margin-bottom:{}", v, v));

        // Gap
        m.entry(format!("gap-{}", k)).or_insert_with(|| format!("gap:{}", v));
        m.entry(format!("gap-x-{}", k)).or_insert_with(|| format!("column-gap:{}", v));
        m.entry(format!("gap-y-{}", k)).or_insert_with(|| format!("row-gap:{}", v));

        // Negative margins
        if k != "0" && k != "px" {
            for (prefix, prop) in [
                ("-m", "margin"),
                ("-mt", "margin-top"),
                ("-mr", "margin-right"),
                ("-mb", "margin-bottom"),
                ("-ml", "margin-left"),
            ] {
                m.entry(format!("{}-{}", prefix, k))
                    .or_insert_with(|| format!("{}:-{}", prop, v));
            }
            m.entry(format!("-mx-{}", k))
                .or_insert_with(|| format!("margin-left:-{};margin-right:-{}", v, v));
            m.entry(format!("-my-{}", k))
                .or_insert_with(|| format!("margin-top:-{};margin-bottom:-{}", v, v));
        }

        // Scroll margin/padding
        m.entry(format!("scroll-m-{}", k))
            .or_insert_with(|| format!("scroll-margin:{}", v));
        m.entry(format!("scroll-p-{}", k))
            .or_insert_with(|| format!("scroll-padding:{}", v));

        // Space between
        m.entry(format!("space-x-{}", k)).or_insert_with(|| format!(
            "& > :not([hidden]) ~ :not([hidden]) {{ --garur-space-x-reverse:0; margin-left:calc({v} * calc(1 - var(--garur-space-x-reverse))); margin-right:calc({v} * var(--garur-space-x-reverse)); }}",
            v = v
        ));
        m.entry(format!("space-y-{}", k)).or_insert_with(|| format!(
            "& > :not([hidden]) ~ :not([hidden]) {{ --garur-space-y-reverse:0; margin-top:calc({v} * calc(1 - var(--garur-space-y-reverse))); margin-bottom:calc({v} * var(--garur-space-y-reverse)); }}",
            v = v
        ));
    }

    // Fraction-based positioning
    for &(k, v) in FRACTIONS {
        m.entry(format!("inset-{}", k)).or_insert_with(|| format!("inset:{}", v));
        m.entry(format!("top-{}", k)).or_insert_with(|| format!("top:{}", v));
        m.entry(format!("right-{}", k)).or_insert_with(|| format!("right:{}", v));
        m.entry(format!("bottom-{}", k)).or_insert_with(|| format!("bottom:{}", v));
        m.entry(format!("left-{}", k)).or_insert_with(|| format!("left:{}", v));
        m.entry(format!("start-{}", k)).or_insert_with(|| format!("inset-inline-start:{}", v));
        m.entry(format!("end-{}", k)).or_insert_with(|| format!("inset-inline-end:{}", v));
        m.entry(format!("translate-x-{}", k))
            .or_insert_with(|| format!("transform:translateX({})", v));
        m.entry(format!("translate-y-{}", k))
            .or_insert_with(|| format!("transform:translateY({})", v));
    }
}

// ───────────────────────────────────────────────
// 2. SIZING — w/h/min/max/size, all values
// ───────────────────────────────────────────────

fn gen_sizing_extended(m: &mut FxHashMap<String, String>) {
    const NAMED: &[(&str, &str)] = &[
        ("auto", "auto"), ("full", "100%"), ("screen", "100vh"),
        ("svh", "100svh"), ("lvh", "100lvh"), ("dvh", "100dvh"),
        ("svw", "100svw"), ("lvw", "100lvw"), ("dvw", "100dvw"),
        ("min", "min-content"), ("max", "max-content"),
        ("fit", "fit-content"),
    ];

    for &(k, v) in SPACING_FULL {
        m.entry(format!("w-{}", k)).or_insert_with(|| format!("width:{}", v));
        m.entry(format!("h-{}", k)).or_insert_with(|| format!("height:{}", v));
        m.entry(format!("size-{}", k))
            .or_insert_with(|| format!("width:{};height:{}", v, v));
        m.entry(format!("min-w-{}", k)).or_insert_with(|| format!("min-width:{}", v));
        m.entry(format!("min-h-{}", k)).or_insert_with(|| format!("min-height:{}", v));
        m.entry(format!("max-w-{}", k)).or_insert_with(|| format!("max-width:{}", v));
        m.entry(format!("max-h-{}", k)).or_insert_with(|| format!("max-height:{}", v));
        m.entry(format!("basis-{}", k)).or_insert_with(|| format!("flex-basis:{}", v));
    }

    for &(k, v) in FRACTIONS {
        m.entry(format!("w-{}", k)).or_insert_with(|| format!("width:{}", v));
        m.entry(format!("h-{}", k)).or_insert_with(|| format!("height:{}", v));
        m.entry(format!("size-{}", k))
            .or_insert_with(|| format!("width:{};height:{}", v, v));
        m.entry(format!("basis-{}", k)).or_insert_with(|| format!("flex-basis:{}", v));
    }

    for &(k, v) in NAMED {
        m.entry(format!("w-{}", k)).or_insert_with(|| format!("width:{}", v));
        m.entry(format!("h-{}", k)).or_insert_with(|| format!("height:{}", v));
    }

    // Max-width named sizes
    for (k, v) in [
        ("3xs", "16rem"), ("2xs", "18rem"), ("xs", "20rem"),
        ("sm", "24rem"), ("md", "28rem"), ("lg", "32rem"),
        ("xl", "36rem"), ("2xl", "42rem"), ("3xl", "48rem"),
        ("4xl", "56rem"), ("5xl", "64rem"), ("6xl", "72rem"),
        ("7xl", "80rem"), ("prose", "65ch"),
        ("screen-sm", "640px"), ("screen-md", "768px"),
        ("screen-lg", "1024px"), ("screen-xl", "1280px"),
        ("screen-2xl", "1536px"),
    ] {
        m.entry(format!("max-w-{}", k))
            .or_insert_with(|| format!("max-width:{}", v));
    }
}

// ───────────────────────────────────────────────
// 3. GRID — 1..=24 columns/rows, spans, starts, ends
// ───────────────────────────────────────────────

fn gen_grid_extended(m: &mut FxHashMap<String, String>) {
    for i in 1..=24 {
        m.entry(format!("grid-cols-{}", i))
            .or_insert_with(|| format!("grid-template-columns:repeat({}, minmax(0, 1fr))", i));
        m.entry(format!("grid-rows-{}", i))
            .or_insert_with(|| format!("grid-template-rows:repeat({}, minmax(0, 1fr))", i));
        m.entry(format!("col-span-{}", i))
            .or_insert_with(|| format!("grid-column:span {} / span {}", i, i));
        m.entry(format!("row-span-{}", i))
            .or_insert_with(|| format!("grid-row:span {} / span {}", i, i));
    }
    for i in 1..=25 {
        m.entry(format!("col-start-{}", i))
            .or_insert_with(|| format!("grid-column-start:{}", i));
        m.entry(format!("col-end-{}", i))
            .or_insert_with(|| format!("grid-column-end:{}", i));
    }
    for i in 1..=25 {
        m.entry(format!("row-start-{}", i))
            .or_insert_with(|| format!("grid-row-start:{}", i));
        m.entry(format!("row-end-{}", i))
            .or_insert_with(|| format!("grid-row-end:{}", i));
    }
}

// ───────────────────────────────────────────────
// 4. FLEX — basis, grow/shrink, order
// ───────────────────────────────────────────────

fn gen_flex_extended(m: &mut FxHashMap<String, String>) {
    for i in 0..=12 {
        m.entry(format!("flex-{}", i))
            .or_insert_with(|| format!("flex:{} {} 0%", i, i));
        m.entry(format!("grow-{}", i))
            .or_insert_with(|| format!("flex-grow:{}", i));
        m.entry(format!("shrink-{}", i))
            .or_insert_with(|| format!("flex-shrink:{}", i));
    }
    for i in 0..=12 {
        m.entry(format!("order-{}", i))
            .or_insert_with(|| format!("order:{}", i));
    }
    m.entry("order-first".to_string())
        .or_insert_with(|| "order:-9999".to_string());
    m.entry("order-last".to_string())
        .or_insert_with(|| "order:9999".to_string());
}

// ───────────────────────────────────────────────
// 5. TYPOGRAPHY — extended
// ───────────────────────────────────────────────

fn gen_typography_extended(m: &mut FxHashMap<String, String>) {
    // Font sizes
    for (k, size, lh) in [
        ("xs", "0.75rem", "1rem"), ("sm", "0.875rem", "1.25rem"),
        ("base", "1rem", "1.5rem"), ("lg", "1.125rem", "1.75rem"),
        ("xl", "1.25rem", "1.75rem"), ("2xl", "1.5rem", "2rem"),
        ("3xl", "1.875rem", "2.25rem"), ("4xl", "2.25rem", "2.5rem"),
        ("5xl", "3rem", "1"), ("6xl", "3.75rem", "1"),
        ("7xl", "4.5rem", "1"), ("8xl", "6rem", "1"),
        ("9xl", "8rem", "1"),
    ] {
        m.entry(format!("text-{}", k))
            .or_insert_with(|| format!("font-size:{};line-height:{}", size, lh));
    }

    // Line heights (numeric + named + arbitrary-friendly)
    for (k, v) in [
        ("none", "1"), ("tight", "1.25"), ("snug", "1.375"),
        ("normal", "1.5"), ("relaxed", "1.625"), ("loose", "2"),
        ("3", "0.75rem"), ("4", "1rem"), ("5", "1.25rem"),
        ("6", "1.5rem"), ("7", "1.75rem"), ("8", "2rem"),
        ("9", "2.25rem"), ("10", "2.5rem"),
    ] {
        m.entry(format!("leading-{}", k))
            .or_insert_with(|| format!("line-height:{}", v));
    }

    // Letter spacing
    for (k, v) in [
        ("tighter", "-0.05em"), ("tight", "-0.025em"),
        ("normal", "0"), ("wide", "0.025em"),
        ("wider", "0.05em"), ("widest", "0.1em"),
    ] {
        m.entry(format!("tracking-{}", k))
            .or_insert_with(|| format!("letter-spacing:{}", v));
    }

    // Font weight
    for (k, v) in [
        ("thin", "100"), ("extralight", "200"), ("light", "300"),
        ("normal", "400"), ("medium", "500"), ("semibold", "600"),
        ("bold", "700"), ("extrabold", "800"), ("black", "900"),
    ] {
        m.entry(format!("font-{}", k))
            .or_insert_with(|| format!("font-weight:{}", v));
    }

    // Text indent
    for &(k, v) in SPACING_FULL {
        m.entry(format!("indent-{}", k))
            .or_insert_with(|| format!("text-indent:{}", v));
    }

    // Line clamp
    for i in 1..=10 {
        m.entry(format!("line-clamp-{}", i)).or_insert_with(|| {
            format!(
                "display:-webkit-box;-webkit-line-clamp:{};-webkit-box-orient:vertical;overflow:hidden",
                i
            )
        });
    }

    // Underline offset
    for &(k, v) in SPACING_FULL {
        m.entry(format!("underline-offset-{}", k))
            .or_insert_with(|| format!("text-underline-offset:{}", v));
    }
    for i in 0..=8 {
        m.entry(format!("underline-offset-{}", i))
            .or_insert_with(|| format!("text-underline-offset:{}px", i));
    }
}

// ───────────────────────────────────────────────
// 6. TRANSFORMS
// ───────────────────────────────────────────────

fn gen_transforms_extended(m: &mut FxHashMap<String, String>) {
    // Rotate — degrees
    for d in [0, 1, 2, 3, 6, 12, 45, 90, 135, 180, 270] {
        m.entry(format!("rotate-{}", d))
            .or_insert_with(|| format!("transform:rotate({}deg)", d));
        m.entry(format!("-rotate-{}", d))
            .or_insert_with(|| format!("transform:rotate(-{}deg)", d));
    }

    // Scale
    for n in [0, 25, 50, 75, 90, 95, 100, 105, 110, 125, 150, 175, 200] {
        m.entry(format!("scale-{}", n))
            .or_insert_with(|| format!("transform:scale({})", n as f64 / 100.0));
        m.entry(format!("scale-x-{}", n))
            .or_insert_with(|| format!("transform:scaleX({})", n as f64 / 100.0));
        m.entry(format!("scale-y-{}", n))
            .or_insert_with(|| format!("transform:scaleY({})", n as f64 / 100.0));
    }

    // Skew
    for d in [0, 1, 2, 3, 6, 12] {
        m.entry(format!("skew-x-{}", d))
            .or_insert_with(|| format!("transform:skewX({}deg)", d));
        m.entry(format!("skew-y-{}", d))
            .or_insert_with(|| format!("transform:skewY({}deg)", d));
    }

    // Transform origin — extended
    for k in [
        "center", "top", "top-right", "right", "bottom-right",
        "bottom", "bottom-left", "left", "top-left",
    ] {
        let v = k.replace('-', " ");
        m.entry(format!("origin-{}", k))
            .or_insert_with(|| format!("transform-origin:{}", v));
    }

    // Perspective
    for (k, v) in [
        ("dramatic", "100px"), ("near", "300px"), ("normal", "500px"),
        ("midrange", "800px"), ("distant", "1200px"),
    ] {
        m.entry(format!("perspective-{}", k))
            .or_insert_with(|| format!("perspective:{}", v));
    }
}

// ───────────────────────────────────────────────
// 7. FILTERS — full scale for every filter
// ───────────────────────────────────────────────

fn gen_filters_extended(m: &mut FxHashMap<String, String>) {
    // Blur
    for (k, v) in [
        ("none", "0"), ("xs", "2px"), ("sm", "4px"),
        ("md", "12px"), ("lg", "16px"), ("xl", "24px"),
        ("2xl", "40px"), ("3xl", "64px"),
    ] {
        if k != "none" {
            m.entry(format!("blur-{}", k))
                .or_insert_with(|| format!("filter:blur({})", v));
            m.entry(format!("backdrop-blur-{}", k))
                .or_insert_with(|| format!("backdrop-filter:blur({})", v));
        }
    }

    // Brightness / contrast / saturate
    for n in [0, 25, 50, 75, 100, 125, 150, 175, 200] {
        m.entry(format!("brightness-{}", n))
            .or_insert_with(|| format!("filter:brightness({})", n as f64 / 100.0));
        m.entry(format!("contrast-{}", n))
            .or_insert_with(|| format!("filter:contrast({})", n as f64 / 100.0));
        m.entry(format!("saturate-{}", n))
            .or_insert_with(|| format!("filter:saturate({})", n as f64 / 100.0));
    }

    // Hue rotate
    for d in [0, 15, 30, 45, 60, 90, 120, 180, 270] {
        m.entry(format!("hue-rotate-{}", d))
            .or_insert_with(|| format!("filter:hue-rotate({}deg)", d));
        m.entry(format!("-hue-rotate-{}", d))
            .or_insert_with(|| format!("filter:hue-rotate(-{}deg)", d));
    }

    // Backdrop variants (same values)
    for n in [0, 25, 50, 75, 100, 125, 150, 200] {
        m.entry(format!("backdrop-brightness-{}", n))
            .or_insert_with(|| format!("backdrop-filter:brightness({})", n as f64 / 100.0));
        m.entry(format!("backdrop-contrast-{}", n))
            .or_insert_with(|| format!("backdrop-filter:contrast({})", n as f64 / 100.0));
        m.entry(format!("backdrop-saturate-{}", n))
            .or_insert_with(|| format!("backdrop-filter:saturate({})", n as f64 / 100.0));
    }

    // Grayscale / invert / sepia
    for prop in ["grayscale", "invert", "sepia"] {
        m.entry(prop.to_string())
            .or_insert_with(|| format!("filter:{}(100%)", prop));
        m.entry(format!("{}-0", prop))
            .or_insert_with(|| format!("filter:{}(0)", prop));
        m.entry(format!("backdrop-{}", prop))
            .or_insert_with(|| format!("backdrop-filter:{}(100%)", prop));
    }
}

// ───────────────────────────────────────────────
// 8. ANIMATIONS — durations, delays, easings
// ───────────────────────────────────────────────

fn gen_animations_extended(m: &mut FxHashMap<String, String>) {
    for n in [
        0, 75, 100, 150, 200, 300, 500, 700, 1000,
        1500, 2000, 3000, 5000, 7000, 10000,
    ] {
        m.entry(format!("duration-{}", n))
            .or_insert_with(|| format!("transition-duration:{}ms", n));
        m.entry(format!("delay-{}", n))
            .or_insert_with(|| format!("transition-delay:{}ms", n));
    }

    for k in ["auto", "linear", "in", "out", "in-out"] {
        let v = match k {
            "linear" => "linear".to_string(),
            "in" => "cubic-bezier(0.4, 0, 1, 1)".to_string(),
            "out" => "cubic-bezier(0, 0, 0.2, 1)".to_string(),
            "in-out" => "cubic-bezier(0.4, 0, 0.2, 1)".to_string(),
            _ => "auto".to_string(),
        };
        m.entry(format!("ease-{}", k))
            .or_insert_with(|| format!("transition-timing-function:{}", v));
    }
}

// ───────────────────────────────────────────────
// 9. BORDERS — width, radius, colors
// ───────────────────────────────────────────────

fn gen_borders_extended(m: &mut FxHashMap<String, String>) {
    // Radius
    for (k, v) in [
        ("none", "0px"), ("xs", "0.125rem"), ("sm", "0.25rem"),
        ("md", "0.375rem"), ("lg", "0.5rem"), ("xl", "0.75rem"),
        ("2xl", "1rem"), ("3xl", "1.5rem"), ("4xl", "2rem"),
        ("full", "9999px"),
    ] {
        m.entry(format!("rounded-{}", k))
            .or_insert_with(|| format!("border-radius:{}", v));
        for side in ["t", "r", "b", "l", "tl", "tr", "br", "bl"] {
            let prop = match side {
                "t" => format!("border-top-left-radius:{0};border-top-right-radius:{0}", v),
                "r" => format!("border-top-right-radius:{0};border-bottom-right-radius:{0}", v),
                "b" => format!("border-bottom-left-radius:{0};border-bottom-right-radius:{0}", v),
                "l" => format!("border-top-left-radius:{0};border-bottom-left-radius:{0}", v),
                "tl" => format!("border-top-left-radius:{}", v),
                "tr" => format!("border-top-right-radius:{}", v),
                "br" => format!("border-bottom-right-radius:{}", v),
                "bl" => format!("border-bottom-left-radius:{}", v),
                _ => unreachable!(),
            };
            m.entry(format!("rounded-{}-{}", side, k)).or_insert(prop);
        }
    }
    m.entry("rounded".to_string())
        .or_insert_with(|| "border-radius:0.25rem".to_string());

    // Widths
    for n in [0, 1, 2, 4, 8] {
        m.entry(format!("border-{}", n))
            .or_insert_with(|| format!("border-width:{}px", n));
        for side in ["t", "r", "b", "l", "x", "y"] {
            let prop = match side {
                "t" => "border-top-width".to_string(),
                "r" => "border-right-width".to_string(),
                "b" => "border-bottom-width".to_string(),
                "l" => "border-left-width".to_string(),
                "x" => format!("border-left-width:{}px;border-right-width:{}px", n, n),
                "y" => format!("border-top-width:{}px;border-bottom-width:{}px", n, n),
                _ => unreachable!(),
            };
            m.entry(format!("border-{}-{}", side, n)).or_insert(prop);
        }
    }
    m.entry("border".to_string())
        .or_insert_with(|| "border-width:1px".to_string());
}

// ───────────────────────────────────────────────
// 10. POSITIONS — inset numeric
// ───────────────────────────────────────────────

fn gen_positions_extended(m: &mut FxHashMap<String, String>) {
    for n in 0..=20 {
        m.entry(format!("inset-{}", n))
            .or_insert_with(|| format!("inset:{}px", n));
        m.entry(format!("top-{}", n))
            .or_insert_with(|| format!("top:{}px", n));
        m.entry(format!("right-{}", n))
            .or_insert_with(|| format!("right:{}px", n));
        m.entry(format!("bottom-{}", n))
            .or_insert_with(|| format!("bottom:{}px", n));
        m.entry(format!("left-{}", n))
            .or_insert_with(|| format!("left:{}px", n));
    }
    for n in [0, 10, 20, 30, 40, 50, 100, 200, 500, 1000, 9999] {
        m.entry(format!("z-{}", n))
            .or_insert_with(|| format!("z-index:{}", n));
    }
    m.entry("z-auto".to_string())
        .or_insert_with(|| "z-index:auto".to_string());
}

// ───────────────────────────────────────────────
// 11. LISTS
// ───────────────────────────────────────────────

fn gen_lists_extended(m: &mut FxHashMap<String, String>) {
    for k in [
        "disc", "circle", "square", "decimal",
        "decimal-leading-zero", "lower-roman", "upper-roman",
        "lower-alpha", "upper-alpha", "lower-greek",
        "lower-latin", "upper-latin", "armenian", "georgian",
    ] {
        m.entry(format!("list-{}", k))
            .or_insert_with(|| format!("list-style-type:{}", k));
    }
    m.entry("list-none".to_string())
        .or_insert_with(|| "list-style-type:none".to_string());
}

// ───────────────────────────────────────────────
// 12. CURSORS — full set
// ───────────────────────────────────────────────

fn gen_cursor_extended(m: &mut FxHashMap<String, String>) {
    for k in [
        "auto", "default", "pointer", "wait", "text", "move", "help",
        "not-allowed", "none", "context-menu", "progress", "cell",
        "crosshair", "vertical-text", "alias", "copy", "no-drop",
        "grab", "grabbing", "all-scroll", "col-resize", "row-resize",
        "n-resize", "e-resize", "s-resize", "w-resize",
        "ne-resize", "nw-resize", "se-resize", "sw-resize",
        "ew-resize", "ns-resize", "nesw-resize", "nwse-resize",
        "zoom-in", "zoom-out",
    ] {
        m.entry(format!("cursor-{}", k))
            .or_insert_with(|| format!("cursor:{}", k));
    }
}

// ───────────────────────────────────────────────
// 13. PRINT
// ───────────────────────────────────────────────

fn gen_print_extended(m: &mut FxHashMap<String, String>) {
    for (k, v) in [
        ("break-after-auto", "break-after:auto"),
        ("break-after-avoid", "break-after:avoid"),
        ("break-after-page", "break-after:page"),
        ("break-after-left", "break-after:left"),
        ("break-after-right", "break-after:right"),
        ("break-before-auto", "break-before:auto"),
        ("break-before-avoid", "break-before:avoid"),
        ("break-before-page", "break-before:page"),
        ("break-before-left", "break-before:left"),
        ("break-before-right", "break-before:right"),
        ("break-inside-auto", "break-inside:auto"),
        ("break-inside-avoid", "break-inside:avoid"),
        ("break-inside-avoid-page", "break-inside:avoid-page"),
        ("break-inside-avoid-column", "break-inside:avoid-column"),
        ("columns-auto", "columns:auto"),
    ] {
        m.entry(k.to_string()).or_insert_with(|| v.to_string());
    }
}

// ───────────────────────────────────────────────
// 14. ACCESSIBILITY — sr-only + more
// ───────────────────────────────────────────────

fn gen_accessibility_extended(m: &mut FxHashMap<String, String>) {
    m.entry("sr-only".to_string()).or_insert_with(|| {
        "position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0".to_string()
    });
    m.entry("not-sr-only".to_string()).or_insert_with(|| {
        "position:static;width:auto;height:auto;padding:0;margin:0;overflow:visible;clip:auto;white-space:normal".to_string()
    });
    m.entry("forced-color-adjust-auto".to_string())
        .or_insert_with(|| "forced-color-adjust:auto".to_string());
    m.entry("forced-color-adjust-none".to_string())
        .or_insert_with(|| "forced-color-adjust:none".to_string());
}

// ───────────────────────────────────────────────
// 15. MASKS — modern mask utilities
// ───────────────────────────────────────────────

fn gen_mask_extended(m: &mut FxHashMap<String, String>) {
    for (k, v) in [
        ("mask-none", "mask-image:none"),
        ("mask-radial", "mask-image:radial-gradient(black, transparent)"),
        ("mask-t-from-transparent", "mask-image:linear-gradient(to bottom, transparent, black)"),
        ("mask-b-from-transparent", "mask-image:linear-gradient(to top, transparent, black)"),
        ("mask-l-from-transparent", "mask-image:linear-gradient(to right, transparent, black)"),
        ("mask-r-from-transparent", "mask-image:linear-gradient(to left, transparent, black)"),
        ("mask-auto", "mask-size:auto"),
        ("mask-cover", "mask-size:cover"),
        ("mask-contain", "mask-size:contain"),
        ("mask-repeat", "mask-repeat:repeat"),
        ("mask-no-repeat", "mask-repeat:no-repeat"),
        ("mask-add", "mask-composite:add"),
        ("mask-subtract", "mask-composite:subtract"),
        ("mask-intersect", "mask-composite:intersect"),
        ("mask-exclude", "mask-composite:exclude"),
    ] {
        m.entry(k.to_string()).or_insert_with(|| v.to_string());
    }
}

// ───────────────────────────────────────────────
// 16. CONTAINER QUERIES
// ───────────────────────────────────────────────

fn gen_container_extended(m: &mut FxHashMap<String, String>) {
    for (k, v) in [
        ("@container", "container-type:inline-size"),
        ("@container/normal", "container-type:normal"),
        ("@container/size", "container-type:size"),
        ("@container/inline", "container-type:inline-size"),
    ] {
        m.entry(k.to_string()).or_insert_with(|| v.to_string());
    }
}

// ───────────────────────────────────────────────
// 17. MODERN CSS — @property, @layer, etc.
// ───────────────────────────────────────────────

fn gen_modern_css(m: &mut FxHashMap<String, String>) {
    // Text wrap
    for (k, v) in [
        ("text-wrap", "text-wrap:wrap"),
        ("text-nowrap", "text-wrap:nowrap"),
        ("text-balance", "text-wrap:balance"),
        ("text-pretty", "text-wrap:pretty"),
    ] {
        m.entry(k.to_string()).or_insert_with(|| v.to_string());
    }

    // Color scheme
    for (k, v) in [
        ("scheme-normal", "color-scheme:normal"),
        ("scheme-dark", "color-scheme:dark"),
        ("scheme-light", "color-scheme:light"),
        ("scheme-light-dark", "color-scheme:light dark"),
    ] {
        m.entry(k.to_string()).or_insert_with(|| v.to_string());
    }

    // Field sizing
    m.entry("field-sizing-content".to_string())
        .or_insert_with(|| "field-sizing:content".to_string());
    m.entry("field-sizing-fixed".to_string())
        .or_insert_with(|| "field-sizing:fixed".to_string());

    // Interpolate size
    m.entry("interpolate-size-allow-keywords".to_string())
        .or_insert_with(|| "interpolate-size:allow-keywords".to_string());
    m.entry("interpolate-size-numeric-only".to_string())
        .or_insert_with(|| "interpolate-size:numeric-only".to_string());

    // Safe area
    for (k, v) in [
        ("p-safe", "padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)"),
        ("pt-safe", "padding-top:env(safe-area-inset-top)"),
        ("pr-safe", "padding-right:env(safe-area-inset-right)"),
        ("pb-safe", "padding-bottom:env(safe-area-inset-bottom)"),
        ("pl-safe", "padding-left:env(safe-area-inset-left)"),
    ] {
        m.entry(k.to_string()).or_insert_with(|| v.to_string());
    }

    // View transitions
    for name in ["hero", "card", "avatar", "header", "footer", "modal", "sidebar", "nav"] {
        m.entry(format!("view-transition-{}", name))
            .or_insert_with(|| format!("view-transition-name:{}", name));
    }
    m.entry("view-transition-none".to_string())
        .or_insert_with(|| "view-transition-name:none".to_string());
    m.entry("view-transition-auto".to_string())
        .or_insert_with(|| "view-transition-name:auto".to_string());
}