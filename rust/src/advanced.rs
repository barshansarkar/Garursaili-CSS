// ═══════════════════════════════════════════════════════════════════
// Advanced utilities — 3D transforms, safe area, scheme, etc.
// ═══════════════════════════════════════════════════════════════════

use rustc_hash::FxHashMap;

pub fn generate(m: &mut FxHashMap<String, String>) {
    gen_3d_transforms(m);
    gen_transform_style(m);
    gen_color_scheme(m);
    gen_field_sizing(m);
    gen_safe_area(m);
    gen_scrollbar_gutter(m);
    gen_interpolate_size(m);
    gen_view_transition(m);
    gen_extra_spacing(m);
    gen_extra_will_change(m);
    gen_mask_utilities(m);
    gen_scrollbar_style(m);
    gen_table_extra(m);
    gen_caption_extra(m);
}

// ─── 3D Transforms ───

fn gen_3d_transforms(m: &mut FxHashMap<String, String>) {
    // Perspective
    for (k, v) in [
        ("dramatic", "100px"), ("near", "300px"), ("normal", "500px"),
        ("midrange", "800px"), ("distant", "1200px"),
    ] {
        m.insert(format!("perspective-{}", k), format!("perspective:{}", v));
    }
    m.insert("perspective-none".into(), "perspective:none".into());
    m.insert("perspective-0".into(), "perspective:0".into());

    // Perspective origin
    for (k, v) in [
        ("center", "center"), ("top", "top"), ("top-right", "top right"),
        ("right", "right"), ("bottom-right", "bottom right"),
        ("bottom", "bottom"), ("bottom-left", "bottom left"),
        ("left", "left"), ("top-left", "top left"),
    ] {
        m.insert(format!("perspective-origin-{}", k), format!("perspective-origin:{}", v));
    }

    // rotate-x / rotate-y / rotate-z
    for (k, v) in [
        ("0", "0deg"), ("1", "1deg"), ("2", "2deg"), ("3", "3deg"),
        ("6", "6deg"), ("12", "12deg"), ("45", "45deg"), ("90", "90deg"), ("180", "180deg"),
    ] {
        m.insert(format!("rotate-x-{}", k), format!("--garur-rotate-x:{};transform:rotateX(var(--garur-rotate-x))", v));
        m.insert(format!("rotate-y-{}", k), format!("--garur-rotate-y:{};transform:rotateY(var(--garur-rotate-y))", v));
        m.insert(format!("-rotate-x-{}", k), format!("--garur-rotate-x:-{};transform:rotateX(var(--garur-rotate-x))", v));
        m.insert(format!("-rotate-y-{}", k), format!("--garur-rotate-y:-{};transform:rotateY(var(--garur-rotate-y))", v));
    }

    // translate-z
    for (k, v) in [
        ("0", "0px"), ("1", "0.25rem"), ("2", "0.5rem"), ("4", "1rem"),
        ("8", "2rem"), ("12", "3rem"), ("16", "4rem"),
    ] {
        m.insert(format!("translate-z-{}", k), format!("--garur-translate-z:{};transform:translateZ(var(--garur-translate-z))", v));
        m.insert(format!("-translate-z-{}", k), format!("--garur-translate-z:-{};transform:translateZ(var(--garur-translate-z))", v));
    }

    // scale-z
    for (k, v) in [
        ("0", "0"), ("50", "0.5"), ("75", "0.75"), ("90", "0.9"),
        ("95", "0.95"), ("100", "1"), ("105", "1.05"), ("110", "1.1"),
        ("125", "1.25"), ("150", "1.5"),
    ] {
        m.insert(format!("scale-z-{}", k), format!("--garur-scale-z:{};transform:scaleZ(var(--garur-scale-z))", v));
    }

    // Full 3D transform composition
    m.insert(
        "transform-3d".into(),
        "transform:translate3d(var(--garur-translate-x,0), var(--garur-translate-y,0), var(--garur-translate-z,0)) rotateX(var(--garur-rotate-x,0)) rotateY(var(--garur-rotate-y,0)) rotate(var(--garur-rotate,0)) skewX(var(--garur-skew-x,0)) skewY(var(--garur-skew-y,0)) scale3d(var(--garur-scale-x,1), var(--garur-scale-y,1), var(--garur-scale-z,1))".into(),
    );
}

fn gen_transform_style(m: &mut FxHashMap<String, String>) {
    m.insert("transform-3d".into(), "transform-style:preserve-3d".into());
    m.insert("transform-flat".into(), "transform-style:flat".into());
    m.insert("transform-style-3d".into(), "transform-style:preserve-3d".into());
    m.insert("transform-style-flat".into(), "transform-style:flat".into());
}

// ─── Color scheme ───

fn gen_color_scheme(m: &mut FxHashMap<String, String>) {
    m.insert("scheme-normal".into(), "color-scheme:normal".into());
    m.insert("scheme-dark".into(), "color-scheme:dark".into());
    m.insert("scheme-light".into(), "color-scheme:light".into());
    m.insert("scheme-light-dark".into(), "color-scheme:light dark".into());
    m.insert("scheme-only-dark".into(), "color-scheme:only dark".into());
    m.insert("scheme-only-light".into(), "color-scheme:only light".into());
}

// ─── Field sizing (auto-grow) ───

fn gen_field_sizing(m: &mut FxHashMap<String, String>) {
    m.insert("field-sizing-content".into(), "field-sizing:content".into());
    m.insert("field-sizing-fixed".into(), "field-sizing:fixed".into());
}

// ─── Safe area (mobile notches) ───

fn gen_safe_area(m: &mut FxHashMap<String, String>) {
    m.insert("p-safe".into(), "padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)".into());
    m.insert("pt-safe".into(), "padding-top:env(safe-area-inset-top)".into());
    m.insert("pr-safe".into(), "padding-right:env(safe-area-inset-right)".into());
    m.insert("pb-safe".into(), "padding-bottom:env(safe-area-inset-bottom)".into());
    m.insert("pl-safe".into(), "padding-left:env(safe-area-inset-left)".into());
    m.insert("px-safe".into(), "padding-left:env(safe-area-inset-left);padding-right:env(safe-area-inset-right)".into());
    m.insert("py-safe".into(), "padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom)".into());

    m.insert("m-safe".into(), "margin:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)".into());
    m.insert("mt-safe".into(), "margin-top:env(safe-area-inset-top)".into());
    m.insert("mb-safe".into(), "margin-bottom:env(safe-area-inset-bottom)".into());
    m.insert("ml-safe".into(), "margin-left:env(safe-area-inset-left)".into());
    m.insert("mr-safe".into(), "margin-right:env(safe-area-inset-right)".into());

    for (k, v) in [
        ("top", "top"), ("bottom", "bottom"), ("left", "left"), ("right", "right"),
    ] {
        m.insert(format!("{}-safe", k), format!("{}:env(safe-area-inset-{})", v, v));
    }
}

// ─── Scrollbar gutter ───

fn gen_scrollbar_gutter(m: &mut FxHashMap<String, String>) {
    m.insert("scrollbar-gutter-auto".into(), "scrollbar-gutter:auto".into());
    m.insert("scrollbar-gutter-stable".into(), "scrollbar-gutter:stable".into());
    m.insert("scrollbar-gutter-both".into(), "scrollbar-gutter:stable both-edges".into());
}

// ─── Interpolate size ───

fn gen_interpolate_size(m: &mut FxHashMap<String, String>) {
    m.insert("interpolate-size-allow-keywords".into(), "interpolate-size:allow-keywords".into());
    m.insert("interpolate-size-numeric-only".into(), "interpolate-size:numeric-only".into());
}

// ─── View Transitions ───

fn gen_view_transition(m: &mut FxHashMap<String, String>) {
    m.insert("view-transition-none".into(), "view-transition-name:none".into());
    m.insert("view-transition-auto".into(), "view-transition-name:auto".into());

    // Common named transitions
    for name in ["hero", "card", "avatar", "header", "footer", "modal", "sidebar", "nav"] {
        m.insert(format!("view-transition-{}", name), format!("view-transition-name:{}", name));
    }
}

// ─── Extra spacing (Tailwind v4) ───

fn gen_extra_spacing(m: &mut FxHashMap<String, String>) {
    // Tiny values
    for (k, v) in [
        ("3xs", "0.125rem"), ("2xs", "0.1875rem"), ("xs", "0.25rem"),
        ("3xl", "4.5rem"), ("4xl", "5rem"), ("5xl", "6rem"),
        ("6xl", "7rem"), ("7xl", "8rem"), ("8xl", "10rem"), ("9xl", "12rem"),
    ] {
        m.insert(format!("p-{}", k), format!("padding:{}", v));
        m.insert(format!("px-{}", k), format!("padding-left:{};padding-right:{}", v, v));
        m.insert(format!("py-{}", k), format!("padding-top:{};padding-bottom:{}", v, v));
        m.insert(format!("pt-{}", k), format!("padding-top:{}", v));
        m.insert(format!("pr-{}", k), format!("padding-right:{}", v));
        m.insert(format!("pb-{}", k), format!("padding-bottom:{}", v));
        m.insert(format!("pl-{}", k), format!("padding-left:{}", v));
        m.insert(format!("m-{}", k), format!("margin:{}", v));
        m.insert(format!("mx-{}", k), format!("margin-left:{};margin-right:{}", v, v));
        m.insert(format!("my-{}", k), format!("margin-top:{};margin-bottom:{}", v, v));
        m.insert(format!("mt-{}", k), format!("margin-top:{}", v));
        m.insert(format!("mr-{}", k), format!("margin-right:{}", v));
        m.insert(format!("mb-{}", k), format!("margin-bottom:{}", v));
        m.insert(format!("ml-{}", k), format!("margin-left:{}", v));
        m.insert(format!("gap-{}", k), format!("gap:{}", v));
        m.insert(format!("gap-x-{}", k), format!("column-gap:{}", v));
        m.insert(format!("gap-y-{}", k), format!("row-gap:{}", v));
        m.insert(format!("w-{}", k), format!("width:{}", v));
        m.insert(format!("h-{}", k), format!("height:{}", v));
        m.insert(format!("size-{}", k), format!("width:{};height:{}", v, v));
        m.insert(format!("inset-{}", k), format!("inset:{}", v));
        m.insert(format!("top-{}", k), format!("top:{}", v));
        m.insert(format!("right-{}", k), format!("right:{}", v));
        m.insert(format!("bottom-{}", k), format!("bottom:{}", v));
        m.insert(format!("left-{}", k), format!("left:{}", v));
        m.insert(format!("space-x-{}", k), format!(
            "& > :not([hidden]) ~ :not([hidden]) {{ --garur-space-x-reverse:0; margin-left:calc({v} * calc(1 - var(--garur-space-x-reverse))); margin-right:calc({v} * var(--garur-space-x-reverse)); }}",
            v = v
        ));
        m.insert(format!("space-y-{}", k), format!(
            "& > :not([hidden]) ~ :not([hidden]) {{ --garur-space-y-reverse:0; margin-top:calc({v} * calc(1 - var(--garur-space-y-reverse))); margin-bottom:calc({v} * var(--garur-space-y-reverse)); }}",
            v = v
        ));
    }
}

// ─── Will change extras ───

fn gen_extra_will_change(m: &mut FxHashMap<String, String>) {
    m.insert("will-change-opacity".into(), "will-change:opacity".into());
    m.insert("will-change-filter".into(), "will-change:filter".into());
    m.insert("will-change-backdrop".into(), "will-change:backdrop-filter".into());
    m.insert("will-change-scroll-position".into(), "will-change:scroll-position".into());
}

// ─── Mask utilities (modern CSS) ───

fn gen_mask_utilities(m: &mut FxHashMap<String, String>) {
    // Linear gradient masks
    m.insert(
        "mask-t-from-transparent".into(),
        "mask-image:linear-gradient(to bottom, transparent, black)".into(),
    );
    m.insert(
        "mask-b-from-transparent".into(),
        "mask-image:linear-gradient(to top, transparent, black)".into(),
    );
    m.insert(
        "mask-l-from-transparent".into(),
        "mask-image:linear-gradient(to right, transparent, black)".into(),
    );
    m.insert(
        "mask-r-from-transparent".into(),
        "mask-image:linear-gradient(to left, transparent, black)".into(),
    );

    m.insert("mask-none".into(), "mask-image:none".into());
    m.insert("mask-radial".into(), "mask-image:radial-gradient(black, transparent)".into());

    // Mask composite
    m.insert("mask-add".into(), "mask-composite:add".into());
    m.insert("mask-subtract".into(), "mask-composite:subtract".into());
    m.insert("mask-intersect".into(), "mask-composite:intersect".into());
    m.insert("mask-exclude".into(), "mask-composite:exclude".into());

    // Mask size
    m.insert("mask-auto".into(), "mask-size:auto".into());
    m.insert("mask-cover".into(), "mask-size:cover".into());
    m.insert("mask-contain".into(), "mask-size:contain".into());

    // Mask repeat
    m.insert("mask-repeat".into(), "mask-repeat:repeat".into());
    m.insert("mask-no-repeat".into(), "mask-repeat:no-repeat".into());

    // Mask position
    for (k, v) in [
        ("center", "center"), ("top", "top"), ("bottom", "bottom"),
        ("left", "left"), ("right", "right"),
    ] {
        m.insert(format!("mask-{}", k), format!("mask-position:{}", v));
    }
}

// ─── Scrollbar styling (Webkit) ───

fn gen_scrollbar_style(m: &mut FxHashMap<String, String>) {
    m.insert("scrollbar-thin".into(), "scrollbar-width:thin;scrollbar-color:rgb(0 0 0 / 0.2) transparent".into());
    m.insert("scrollbar-none".into(), "scrollbar-width:none;-ms-overflow-style:none".into());
    m.insert("scrollbar-auto".into(), "scrollbar-width:auto".into());
}

// ─── Table extras ───

fn gen_table_extra(m: &mut FxHashMap<String, String>) {
    m.insert("caption-top".into(), "caption-side:top".into());
    m.insert("caption-bottom".into(), "caption-side:bottom".into());
    m.insert("table-bordered".into(), "border-collapse:collapse;border:1px solid".into());
}

fn gen_caption_extra(_m: &mut FxHashMap<String, String>) {}