// ═══════════════════════════════════════════════════════════════════
// Variants Engine — full Tailwind-compatible modifier system
// ═══════════════════════════════════════════════════════════════════

#[derive(Debug, Clone)]
pub enum Variant {
    State(&'static str),
    CustomState(String),
    PseudoEl(&'static str),
    Parent(String, String),
    Peer(String),
    Media(&'static str),
    Dark,
    Arbitrary(String),
    Direction(&'static str),
    Has(String),
    Data(String),
    Aria(String),
    Supports(String),
    MinBp(String),
    MaxBp(String),
    StartingStyle,
    PointerType(&'static str),
}

pub const CONTAINER_SIZES: &[(&str, &str)] = &[
    ("@3xs", "16rem"), ("@2xs", "18rem"), ("@xs", "20rem"),
    ("@sm", "24rem"), ("@md", "28rem"), ("@lg", "32rem"),
    ("@xl", "36rem"), ("@2xl", "42rem"), ("@3xl", "48rem"),
    ("@4xl", "56rem"), ("@5xl", "64rem"), ("@6xl", "72rem"),
    ("@7xl", "80rem"),
];

#[allow(dead_code)]
pub fn is_container_bp(s: &str) -> bool {
    CONTAINER_SIZES.iter().any(|(n, _)| *n == s)
}

pub fn parse_variant(s: &str) -> Variant {
    // Arbitrary variant: [&>div]
    if s.starts_with('[') && s.ends_with(']') {
        return Variant::Arbitrary(s[1..s.len() - 1].to_string());
    }

    // Has variants
    if let Some(rest) = s.strip_prefix("has-[") {
        if let Some(inner) = rest.strip_suffix(']') {
            return Variant::Has(inner.to_string());
        }
    }
    if let Some(rest) = s.strip_prefix("has-") {
        return Variant::Has(rest.to_string());
    }

    // Data-* variants: data-[state=open] or data-open
    if let Some(rest) = s.strip_prefix("data-[") {
        if let Some(inner) = rest.strip_suffix(']') {
            return Variant::Data(inner.to_string());
        }
    }
    if let Some(rest) = s.strip_prefix("data-") {
        if let Some(pos) = rest.rfind('-') {
            let (attr, val) = rest.split_at(pos);
            let val = &val[1..];
            return Variant::Data(format!("{}={}", attr, val));
        }
        return Variant::Data(rest.to_string());
    }

    // Aria-* variants
    if let Some(rest) = s.strip_prefix("aria-[") {
        if let Some(inner) = rest.strip_suffix(']') {
            return Variant::Aria(inner.to_string());
        }
    }
    if let Some(rest) = s.strip_prefix("aria-") {
        if rest.ends_with("-undefined") {
            let attr = rest.trim_end_matches("-undefined");
            return Variant::Aria(attr.to_string());
        }
        if rest.ends_with("-true") {
            let attr = rest.trim_end_matches("-true");
            return Variant::Aria(format!("{}=true", attr));
        }
        if rest.ends_with("-false") {
            let attr = rest.trim_end_matches("-false");
            return Variant::Aria(format!("{}=false", attr));
        }
        return Variant::Aria(format!("{}=true", rest));
    }

    // Supports
    if let Some(rest) = s.strip_prefix("supports-[") {
        if let Some(inner) = rest.strip_suffix(']') {
            return Variant::Supports(inner.to_string());
        }
    }

    // Min-[...]
    if let Some(rest) = s.strip_prefix("min-[") {
        if let Some(inner) = rest.strip_suffix(']') {
            return Variant::MinBp(inner.to_string());
        }
    }

    // Max-[...] or max-md
    if let Some(rest) = s.strip_prefix("max-[") {
        if let Some(inner) = rest.strip_suffix(']') {
            return Variant::MaxBp(inner.to_string());
        }
    }
    if let Some(rest) = s.strip_prefix("max-") {
        if !rest.is_empty() {
            return Variant::MaxBp(rest.to_string());
        }
    }

    // Pointer variants
    match s {
        "pointer-fine" => return Variant::PointerType("fine"),
        "pointer-coarse" => return Variant::PointerType("coarse"),
        "pointer-none" => return Variant::PointerType("none"),
        _ => {}
    }

    // Starting style
    if s == "starting" {
        return Variant::StartingStyle;
    }

    // Group-* variants
    if let Some(rest) = s.strip_prefix("group-") {
        if let Some(arb_inner) = rest.strip_prefix('[') {
            if let Some(end) = arb_inner.find(']') {
                let sel = &arb_inner[..end];
                let suffix = &arb_inner[end + 1..];
                return Variant::Parent(format!(".group{}", sel), suffix.to_string());
            }
        }
        let pseudo = match rest {
            "hover" => "hover",
            "focus" => "focus",
            "active" => "active",
            "checked" => "checked",
            "disabled" => "disabled",
            "focus-within" => "focus-within",
            "focus-visible" => "focus-visible",
            "target" => "target",
            "open" => "open",
            "first" => "first-child",
            "last" => "last-child",
            "odd" => "nth-child(odd)",
            "even" => "nth-child(even)",
            _ => rest,
        };
        return Variant::Parent(format!(".group:{}", pseudo), String::new());
    }

    // Peer-* variants
    if let Some(rest) = s.strip_prefix("peer-") {
        if let Some(arb_inner) = rest.strip_prefix('[') {
            if let Some(end) = arb_inner.find(']') {
                let sel = &arb_inner[..end];
                let suffix = &arb_inner[end + 1..];
                return Variant::Peer(format!("{} {}", sel, suffix));
            }
        }
        let pseudo = match rest {
            "hover" => "hover",
            "focus" => "focus",
            "active" => "active",
            "checked" => "checked",
            "disabled" => "disabled",
            "focus-within" => "focus-within",
            "focus-visible" => "focus-visible",
            "placeholder-shown" => "placeholder-shown",
            "invalid" => "invalid",
            "valid" => "valid",
            "required" => "required",
            "optional" => "optional",
            "first" => "first-child",
            "last" => "last-child",
            "odd" => "nth-child(odd)",
            "even" => "nth-child(even)",
            _ => rest,
        };
        return Variant::Peer(format!(":{}", pseudo));
    }

    match s {
        // State
        "hover" => Variant::State("hover"),
        "focus" => Variant::State("focus"),
        "focus-within" => Variant::State("focus-within"),
        "focus-visible" => Variant::State("focus-visible"),
        "active" => Variant::State("active"),
        "visited" => Variant::State("visited"),
        "target" => Variant::State("target"),
        "disabled" => Variant::State("disabled"),
        "enabled" => Variant::State("enabled"),
        "checked" => Variant::State("checked"),
        "indeterminate" => Variant::State("indeterminate"),
        "default" => Variant::State("default"),
        "required" => Variant::State("required"),
        "optional" => Variant::State("optional"),
        "valid" => Variant::State("valid"),
        "invalid" => Variant::State("invalid"),
        "in-range" => Variant::State("in-range"),
        "out-of-range" => Variant::State("out-of-range"),
        "read-only" => Variant::State("read-only"),
        "read-write" => Variant::State("read-write"),
        "placeholder-shown" => Variant::State("placeholder-shown"),
        "autofill" => Variant::State("autofill"),
        "open" => Variant::State("open"),
        "closed" => Variant::State("closed"),

        // Structural
        "first" => Variant::State("first-child"),
        "last" => Variant::State("last-child"),
        "only" => Variant::State("only-child"),
        "odd" => Variant::State("nth-child(odd)"),
        "even" => Variant::State("nth-child(even)"),
        "first-of-type" => Variant::State("first-of-type"),
        "last-of-type" => Variant::State("last-of-type"),
        "only-of-type" => Variant::State("only-of-type"),
        "empty" => Variant::State("empty"),

        // Pseudo-elements
        "before" => Variant::PseudoEl("before"),
        "after" => Variant::PseudoEl("after"),
        "placeholder" => Variant::PseudoEl("placeholder"),
        "file" => Variant::PseudoEl("file-selector-button"),
        "marker" => Variant::PseudoEl("marker"),
        "selection" => Variant::PseudoEl("selection"),
        "first-letter" => Variant::PseudoEl("first-letter"),
        "first-line" => Variant::PseudoEl("first-line"),
        "backdrop" => Variant::PseudoEl("backdrop"),

        // Media
        "dark" => Variant::Dark,
        "motion-safe" => Variant::Media("prefers-reduced-motion: no-preference"),
        "motion-reduce" => Variant::Media("prefers-reduced-motion: reduce"),
        "print" => Variant::Media("print"),
        "portrait" => Variant::Media("orientation: portrait"),
        "landscape" => Variant::Media("orientation: landscape"),
        "contrast-more" => Variant::Media("prefers-contrast: more"),
        "contrast-less" => Variant::Media("prefers-contrast: less"),
        "forced-colors" => Variant::Media("forced-colors: active"),

        // Direction
        "rtl" => Variant::Direction("rtl"),
        "ltr" => Variant::Direction("ltr"),

        other => Variant::CustomState(other.to_string()),
    }
}

pub fn apply_variant(sel: &str, v: &Variant, dark_mode: &str) -> String {
    match v {
        Variant::State(p) => format!("{}:{}", sel, p),
        Variant::CustomState(s) => format!("{}:{}", sel, s),
        Variant::PseudoEl(p) => format!("{}::{}", sel, p),
        Variant::Parent(prefix, suffix) => {
            if suffix.is_empty() {
                format!("{} {}", prefix, sel)
            } else {
                format!("{}:{} {}", prefix, suffix, sel)
            }
        }
        Variant::Peer(p) => format!(".peer{} ~ {}", p, sel),
        Variant::Dark => {
            if dark_mode == "media" {
                sel.to_string()
            } else {
                format!(".dark {}", sel)
            }
        }
        Variant::Media(_) => sel.to_string(),
        Variant::Direction(d) => format!("[dir=\"{}\"] {}", d, sel),
        Variant::Has(inner) => format!("{}:has({})", sel, inner),
        Variant::Data(attr) => {
            if attr.contains('=') {
                let (k, val) = attr.split_once('=').unwrap();
                let val = val.trim_matches('"').trim_matches('\'');
                format!("{}[data-{}=\"{}\"]", sel, k, val)
            } else {
                format!("{}[data-{}]", sel, attr)
            }
        }
        Variant::Aria(attr) => {
            if attr.contains('=') {
                let (k, val) = attr.split_once('=').unwrap();
                let val = val.trim_matches('"').trim_matches('\'');
                format!("{}[aria-{}=\"{}\"]", sel, k, val)
            } else {
                format!("{}[aria-{}]", sel, attr)
            }
        }
        Variant::Supports(_) => sel.to_string(),
        Variant::MinBp(_) => sel.to_string(),
        Variant::MaxBp(_) => sel.to_string(),
        Variant::StartingStyle => sel.to_string(),
        Variant::PointerType(_) => sel.to_string(),
        Variant::Arbitrary(a) => {
            if a.starts_with('@') {
                sel.to_string()
            } else if a.contains('&') {
                a.replace('&', sel)
            } else {
                format!("{} {}", a, sel)
            }
        }
    }
}

pub fn apply_variants(sel: &str, variants: &[String], dark_mode: &str) -> String {
    let mut out = sel.to_string();
    for v_str in variants.iter().rev() {
        let v = parse_variant(v_str);
        out = apply_variant(&out, &v, dark_mode);
    }
    out
}

/// Return media queries to wrap around.
pub fn collect_media_queries(variants: &[String], dark_mode: &str) -> Vec<String> {
    let mut media = Vec::new();
    for v_str in variants {
        match parse_variant(v_str) {
            Variant::Dark if dark_mode == "media" => {
                media.push("prefers-color-scheme: dark".to_string());
            }
            Variant::Media(m) => media.push(m.to_string()),
            Variant::Arbitrary(a) if a.starts_with("@media") => {
                if let Some(inner) = a.strip_prefix("@media") {
                    media.push(
                        inner
                            .trim()
                            .trim_start_matches('(')
                            .trim_end_matches(')')
                            .to_string(),
                    );
                }
            }
            _ => {}
        }
    }
    media
}

/// Return container queries (name, width) from variants.
pub fn collect_container_queries(variants: &[String]) -> Vec<(String, String)> {
    let mut out = Vec::new();
    for v_str in variants {
        if let Some((_, width)) = CONTAINER_SIZES.iter().find(|(n, _)| *n == v_str.as_str()) {
            out.push((v_str.clone(), width.to_string()));
        }
    }
    out
}

/// Return @supports conditions.
pub fn collect_supports(variants: &[String]) -> Vec<String> {
    let mut out = Vec::new();
    for v_str in variants {
        if let Variant::Supports(cond) = parse_variant(v_str) {
            out.push(cond);
        }
    }
    out
}

/// Return true if `starting` variant is present.
pub fn has_starting_style(variants: &[String]) -> bool {
    variants
        .iter()
        .any(|v| matches!(parse_variant(v), Variant::StartingStyle))
}

/// Collect pointer-type media queries.
pub fn collect_pointer_queries(variants: &[String]) -> Vec<String> {
    let mut out = Vec::new();
    for v_str in variants {
        if let Variant::PointerType(t) = parse_variant(v_str) {
            out.push(match t {
                "fine" => "pointer: fine".to_string(),
                "coarse" => "pointer: coarse".to_string(),
                "none" => "pointer: none".to_string(),
                _ => format!("pointer: {}", t),
            });
        }
    }
    out
}

/// Collect min/max arbitrary breakpoint queries.
pub fn collect_min_max_bps(
    variants: &[String],
    breakpoint_map: &[(String, String)],
) -> Vec<String> {
    let mut out = Vec::new();
    for v_str in variants {
        match parse_variant(v_str) {
            Variant::MinBp(val) => {
                out.push(format!("min-width: {}", val));
            }
            Variant::MaxBp(name_or_val) => {
                if name_or_val.starts_with(|c: char| c.is_ascii_digit()) {
                    out.push(format!("max-width: {}", name_or_val));
                } else if let Some((_, w)) =
                    breakpoint_map.iter().find(|(n, _)| *n == name_or_val)
                {
                    if let Some(px) = w.strip_suffix("px") {
                        if let Ok(num) = px.parse::<f64>() {
                            out.push(format!("max-width: {}px", num - 0.02));
                        } else {
                            out.push(format!("max-width: {}", w));
                        }
                    } else {
                        out.push(format!("max-width: {}", w));
                    }
                } else {
                    out.push(format!("max-width: {}", name_or_val));
                }
            }
            _ => {}
        }
    }
    out
}