// ═══════════════════════════════════════════════════════════════════
// GarurSaili-CSS — signature.rs
// The Semantic Identity Layer of the Indian CSS Framework
// Author: Barshan Sarkar · Malda, West Bengal, India
// Version: 1.4.0
// ═══════════════════════════════════════════════════════════════════
//
// LAYERS:
//    INTENT LAYER      — write what you MEAN (mid, apart, rise...)
//    TIER B INTENT     — production shorthands (status, menu, drawer...)
//    SHORTHAND LAYER   — compact aliases (jc-center, ai-center...)
//    WEB KIT           — premium website blocks
//    PREMIUM KIT       — spotlight, gradient borders, glows, beams
//
// All additions use `.entry().or_insert_with()` — NEVER override.
// Fully additive. Safe to delete any block.
use rustc_hash::FxHashMap;

pub fn generate(m: &mut FxHashMap<String, String>) {
    //  INTENT LAYER
    gen_intent_layout(m);
    gen_intent_position(m);
    gen_intent_visual(m);
    gen_intent_feedback(m);
    gen_intent_content(m);
    gen_intent_form(m);
    gen_intent_indian(m);

    //  TIER B — Extended intent
    gen_tier_b_intent(m);

    //  SHORTHAND LAYER
    gen_compat_display(m);
    gen_compat_flexbox(m);
    gen_compat_sizing(m);
    gen_compat_grid(m);
    gen_compat_effects(m);
    gen_compat_cursor(m);
    gen_compat_aspect_object(m);

    //  WEB KIT
    gen_web_kit(m);

    // PREMIUM KIT — signature effects
    gen_vercel_kit(m);
}

// ═══════════════════════════════════════════════════════════════════
//  INTENT LAYER
// ═══════════════════════════════════════════════════════════════════

fn gen_intent_layout(m: &mut FxHashMap<String, String>) {
    m.entry("mid".into()).or_insert_with(|| 
        "display:flex;align-items:center;justify-content:center".into());
    m.entry("mid-x".into()).or_insert_with(|| 
        "display:flex;justify-content:center".into());
    m.entry("mid-y".into()).or_insert_with(|| 
        "display:flex;align-items:center".into());
    m.entry("mid-screen".into()).or_insert_with(|| 
        "display:flex;align-items:center;justify-content:center;min-height:100vh".into());

    m.entry("apart".into()).or_insert_with(|| 
        "display:flex;justify-content:space-between".into());
    m.entry("apart-mid".into()).or_insert_with(|| 
        "display:flex;align-items:center;justify-content:space-between".into());
    m.entry("even".into()).or_insert_with(|| 
        "display:flex;justify-content:space-evenly".into());
    m.entry("around".into()).or_insert_with(|| 
        "display:flex;justify-content:space-around".into());

    for (n, v) in [
        (0, "0"), (1, "0.25rem"), (2, "0.5rem"), (3, "0.75rem"),
        (4, "1rem"), (5, "1.25rem"), (6, "1.5rem"), (8, "2rem"),
        (10, "2.5rem"), (12, "3rem"),
    ] {
        m.entry(format!("row-{}", n)).or_insert_with(|| 
            format!("display:flex;flex-direction:row;gap:{}", v));
        m.entry(format!("stack-{}", n)).or_insert_with(|| 
            format!("display:flex;flex-direction:column;gap:{}", v));
        m.entry(format!("wrap-{}", n)).or_insert_with(|| 
            format!("display:flex;flex-wrap:wrap;gap:{}", v));
        m.entry(format!("centered-{}", n)).or_insert_with(|| 
            format!("display:flex;align-items:center;justify-content:center;gap:{}", v));
    }

    m.entry("row-tight".into()).or_insert_with(|| 
        "display:flex;flex-direction:row;gap:0".into());
    m.entry("stack-tight".into()).or_insert_with(|| 
        "display:flex;flex-direction:column;gap:0".into());
    m.entry("chips".into()).or_insert_with(|| 
        "display:flex;flex-wrap:wrap;gap:0.5rem;align-items:center".into());

    for n in 1..=12 {
        m.entry(format!("cols-{}", n)).or_insert_with(|| 
            format!("display:grid;grid-template-columns:repeat({}, minmax(0, 1fr))", n));
    }

    m.entry("auto-grid".into()).or_insert_with(|| 
        "display:grid;grid-template-columns:repeat(auto-fit, minmax(16rem, 1fr));gap:1rem".into());
    m.entry("masonry-lite".into()).or_insert_with(|| 
        "columns:3;column-gap:1rem;\
         & > * { break-inside:avoid;margin-bottom:1rem; }".into());
    m.entry("jumbo".into()).or_insert_with(|| 
        "display:flex;flex-direction:column;align-items:center;justify-content:center;\
         text-align:center;padding:6rem 1.5rem;gap:1.5rem".into());
    m.entry("section-air".into()).or_insert_with(|| 
        "padding-block:5rem;padding-inline:1.5rem".into());
    m.entry("section-tight".into()).or_insert_with(|| 
        "padding-block:2rem;padding-inline:1.5rem".into());
}

fn gen_intent_position(m: &mut FxHashMap<String, String>) {
    m.entry("pinned".into()).or_insert_with(|| 
        "position:sticky;top:0;z-index:40".into());
    m.entry("pinned-blur".into()).or_insert_with(|| 
        "position:sticky;top:0;z-index:40;\
         backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);\
         background-color:color-mix(in oklab, var(--garur-surface) 80%, transparent)".into());
    m.entry("pinned-bottom".into()).or_insert_with(|| 
        "position:sticky;bottom:0;z-index:40".into());

    m.entry("docked-top".into()).or_insert_with(|| 
        "position:fixed;top:0;left:0;right:0;z-index:50".into());
    m.entry("docked-bottom".into()).or_insert_with(|| 
        "position:fixed;bottom:0;left:0;right:0;z-index:50".into());
    m.entry("docked-left".into()).or_insert_with(|| 
        "position:fixed;top:0;bottom:0;left:0;z-index:50".into());
    m.entry("docked-right".into()).or_insert_with(|| 
        "position:fixed;top:0;bottom:0;right:0;z-index:50".into());

    m.entry("overlay-full".into()).or_insert_with(|| 
        "position:absolute;inset:0".into());
    m.entry("overlay-screen".into()).or_insert_with(|| 
        "position:fixed;inset:0".into());
    m.entry("overlay-dim".into()).or_insert_with(|| 
        "position:fixed;inset:0;z-index:50;\
         background-color:rgb(0 0 0 / 0.5);\
         backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px)".into());

    m.entry("tucked".into()).or_insert_with(|| 
        "position:absolute;top:1rem;right:1rem".into());
    m.entry("tucked-tl".into()).or_insert_with(|| 
        "position:absolute;top:1rem;left:1rem".into());
    m.entry("tucked-bl".into()).or_insert_with(|| 
        "position:absolute;bottom:1rem;left:1rem".into());
    m.entry("tucked-br".into()).or_insert_with(|| 
        "position:absolute;bottom:1rem;right:1rem".into());
    m.entry("centered-abs".into()).or_insert_with(|| 
        "position:absolute;top:50%;left:50%;transform:translate(-50%, -50%)".into());

    m.entry("above".into()).or_insert_with(|| "z-index:10".into());
    m.entry("above-all".into()).or_insert_with(|| "z-index:9999".into());
    m.entry("behind".into()).or_insert_with(|| "z-index:-1".into());
}

fn gen_intent_visual(m: &mut FxHashMap<String, String>) {
    m.entry("rise".into()).or_insert_with(|| 
        "box-shadow:var(--garur-shadow-lg, 0 10px 15px -3px rgb(0 0 0 / 0.1))".into());
    m.entry("rise-sm".into()).or_insert_with(|| 
        "box-shadow:var(--garur-shadow-sm, 0 1px 2px 0 rgb(0 0 0 / 0.05))".into());
    m.entry("rise-lg".into()).or_insert_with(|| 
        "box-shadow:var(--garur-shadow-xl, 0 20px 25px -5px rgb(0 0 0 / 0.1))".into());
    m.entry("sunken".into()).or_insert_with(|| 
        "box-shadow:inset 0 2px 4px 0 rgb(0 0 0 / 0.06);\
         background-color:var(--garur-surface-muted)".into());
    m.entry("flat".into()).or_insert_with(|| 
        "box-shadow:none;background-color:transparent".into());

    m.entry("faded".into()).or_insert_with(|| "opacity:0.5".into());
    m.entry("dim".into()).or_insert_with(|| "opacity:0.75".into());
    m.entry("ghosted".into()).or_insert_with(|| "opacity:0.25".into());
    m.entry("solid".into()).or_insert_with(|| "opacity:1".into());

    m.entry("smooth".into()).or_insert_with(|| 
        "transition:all 300ms cubic-bezier(0.4, 0, 0.2, 1)".into());
    m.entry("quick".into()).or_insert_with(|| 
        "transition:all 100ms cubic-bezier(0.4, 0, 0.2, 1)".into());
    m.entry("lazy".into()).or_insert_with(|| 
        "transition:all 600ms cubic-bezier(0.25, 1, 0.5, 1)".into());

    m.entry("grow".into()).or_insert_with(|| 
        "transition:transform 200ms ease;\
         &:hover { transform:scale(1.03); }".into());
    m.entry("shrink".into()).or_insert_with(|| 
        "transition:transform 200ms ease;\
         &:hover { transform:scale(0.97); }".into());
    m.entry("lift".into()).or_insert_with(|| 
        "transition:transform 200ms ease, box-shadow 200ms ease;\
         &:hover { transform:translateY(-2px); box-shadow:var(--garur-shadow-lg); }".into());
    m.entry("press".into()).or_insert_with(|| 
        "transition:transform 100ms ease;\
         &:active { transform:scale(0.97); }".into());
    m.entry("glow-up".into()).or_insert_with(|| 
        "transition:box-shadow 300ms ease;\
         &:hover { box-shadow:0 0 40px -10px color-mix(in oklab, var(--garur-primary) 60%, transparent); }".into());

    m.entry("aurora".into()).or_insert_with(|| 
        "background:linear-gradient(135deg,\
           var(--garur-primary),\
           var(--garur-accent, #e54cb5),\
           var(--garur-warning, #f59e00))".into());
    m.entry("mist".into()).or_insert_with(|| 
        "background:linear-gradient(180deg,\
           color-mix(in oklab, var(--garur-surface) 95%, transparent),\
           transparent)".into());

    m.entry("outlined".into()).or_insert_with(|| 
        "border:1px solid var(--garur-border-subtle);background-color:transparent".into());
    m.entry("dashed".into()).or_insert_with(|| 
        "border:1px dashed var(--garur-border-subtle)".into());
    m.entry("dotted".into()).or_insert_with(|| 
        "border:1px dotted var(--garur-border-subtle)".into());
}

fn gen_intent_feedback(m: &mut FxHashMap<String, String>) {
    m.entry("clickable".into()).or_insert_with(|| 
        "cursor:pointer;transition:background-color 150ms ease;\
         &:hover { background-color:var(--garur-surface-muted); }".into());
    m.entry("tappable".into()).or_insert_with(|| 
        "cursor:pointer;transition:transform 100ms ease;\
         &:active { transform:scale(0.97); }".into());
    m.entry("locked".into()).or_insert_with(|| 
        "cursor:not-allowed;opacity:0.5;pointer-events:none".into());
    m.entry("draggable".into()).or_insert_with(|| 
        "cursor:grab;\
         &:active { cursor:grabbing; }".into());
    m.entry("busy".into()).or_insert_with(|| 
        "cursor:wait;pointer-events:none".into());

    m.entry("alive".into()).or_insert_with(|| 
        "position:relative;\
         &::after { content:'';position:absolute;top:0;right:0;\
                    width:0.625rem;height:0.625rem;\
                    background:var(--garur-success);border-radius:9999px;\
                    box-shadow:0 0 0 2px var(--garur-surface); }".into());
    m.entry("dead".into()).or_insert_with(|| 
        "position:relative;\
         &::after { content:'';position:absolute;top:0;right:0;\
                    width:0.625rem;height:0.625rem;\
                    background:var(--garur-muted);border-radius:9999px;\
                    box-shadow:0 0 0 2px var(--garur-surface); }".into());
    m.entry("busy-dot".into()).or_insert_with(|| 
        "position:relative;\
         &::after { content:'';position:absolute;top:0;right:0;\
                    width:0.625rem;height:0.625rem;\
                    background:var(--garur-warning);border-radius:9999px;\
                    box-shadow:0 0 0 2px var(--garur-surface);\
                    animation:garur-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }".into());

    for (name, color) in [
        ("ok",   "var(--garur-success)"),
        ("warn", "var(--garur-warning)"),
        ("err",  "var(--garur-danger)"),
        ("note", "var(--garur-info)"),
        ("hint", "var(--garur-primary)"),
    ] {
        m.entry(format!("tag-{}", name)).or_insert_with(|| 
            format!("display:inline-flex;align-items:center;gap:0.25rem;\
                     padding:0.125rem 0.5rem;border-radius:9999px;\
                     font-size:0.75rem;font-weight:500;\
                     background-color:color-mix(in oklab, {} 15%, transparent);\
                     color:{}", color, color));
    }
}

fn gen_intent_content(m: &mut FxHashMap<String, String>) {
    m.entry("clip".into()).or_insert_with(|| 
        "overflow:hidden;text-overflow:ellipsis;white-space:nowrap".into());

    for n in 2..=6 {
        m.entry(format!("fit-{}", n)).or_insert_with(|| 
            format!("display:-webkit-box;-webkit-line-clamp:{};-webkit-box-orient:vertical;overflow:hidden", n));
    }

    m.entry("balance".into()).or_insert_with(|| "text-wrap:balance".into());
    m.entry("pretty".into()).or_insert_with(|| "text-wrap:pretty".into());

    m.entry("ghost".into()).or_insert_with(|| 
        "position:absolute;width:1px;height:1px;padding:0;margin:-1px;\
         overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0".into());
    m.entry("unghost".into()).or_insert_with(|| 
        "position:static;width:auto;height:auto;padding:0;margin:0;\
         overflow:visible;clip:auto;white-space:normal".into());

    m.entry("tiny".into()).or_insert_with(|| "font-size:0.75rem;line-height:1rem".into());
    m.entry("small".into()).or_insert_with(|| "font-size:0.875rem;line-height:1.25rem".into());
    m.entry("body".into()).or_insert_with(|| "font-size:1rem;line-height:1.5rem".into());
    m.entry("lead".into()).or_insert_with(|| "font-size:1.125rem;line-height:1.75rem".into());
    m.entry("title".into()).or_insert_with(|| "font-size:1.25rem;line-height:1.75rem;font-weight:600".into());
    m.entry("headline".into()).or_insert_with(|| "font-size:1.5rem;line-height:2rem;font-weight:700".into());
    m.entry("display".into()).or_insert_with(|| 
        "font-size:2.25rem;line-height:2.5rem;font-weight:700;letter-spacing:-0.02em".into());
    m.entry("banner".into()).or_insert_with(|| 
        "font-size:3rem;line-height:1;font-weight:800;letter-spacing:-0.03em".into());

    m.entry("quiet".into()).or_insert_with(|| 
        "color:var(--garur-muted);font-size:0.875em".into());
    m.entry("subtle-text".into()).or_insert_with(|| 
        "color:var(--garur-subtle, #94a3b8)".into());
    m.entry("strong".into()).or_insert_with(|| 
        "font-weight:700;color:var(--garur-fg)".into());

    m.entry("hr".into()).or_insert_with(|| 
        "display:block;height:1px;width:100%;border:none;\
         background-color:var(--garur-border-subtle);margin-block:1rem".into());
    m.entry("hr-text".into()).or_insert_with(|| 
        "display:flex;align-items:center;gap:0.75rem;\
         color:var(--garur-muted);font-size:0.75rem;\
         text-transform:uppercase;letter-spacing:0.05em;\
         &::before, &::after { content:'';flex:1;height:1px;\
                               background:var(--garur-border-subtle); }".into());
}

fn gen_intent_form(m: &mut FxHashMap<String, String>) {
    m.entry("invalid".into()).or_insert_with(|| 
        "border-color:var(--garur-danger);\
         &:focus { border-color:var(--garur-danger);\
                   box-shadow:0 0 0 3px color-mix(in oklab, var(--garur-danger) 20%, transparent); }".into());
    m.entry("valid".into()).or_insert_with(|| 
        "border-color:var(--garur-success);\
         &:focus { border-color:var(--garur-success);\
                   box-shadow:0 0 0 3px color-mix(in oklab, var(--garur-success) 20%, transparent); }".into());
    m.entry("field-ro".into()).or_insert_with(|| 
        "background-color:var(--garur-surface-muted);cursor:not-allowed;opacity:0.7".into());

    m.entry("cta".into()).or_insert_with(|| 
        "display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;\
         padding:0.75rem 1.5rem;border-radius:var(--garur-radius);\
         background-color:var(--garur-primary);color:var(--garur-primary-fg);\
         font-weight:600;cursor:pointer;\
         transition:transform 150ms ease, box-shadow 150ms ease;\
         &:hover { transform:translateY(-1px);\
                   box-shadow:0 10px 15px -3px color-mix(in oklab, var(--garur-primary) 30%, transparent); }\
         &:active { transform:translateY(0); }".into());
    m.entry("cta-soft".into()).or_insert_with(|| 
        "display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;\
         padding:0.75rem 1.5rem;border-radius:var(--garur-radius);\
         background-color:color-mix(in oklab, var(--garur-primary) 12%, transparent);\
         color:var(--garur-primary);font-weight:600;cursor:pointer;\
         transition:background-color 150ms ease;\
         &:hover { background-color:color-mix(in oklab, var(--garur-primary) 20%, transparent); }".into());
    m.entry("cta-ghost".into()).or_insert_with(|| 
        "display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;\
         padding:0.75rem 1.5rem;border-radius:var(--garur-radius);\
         background-color:transparent;color:var(--garur-fg);\
         font-weight:500;cursor:pointer;\
         transition:background-color 150ms ease;\
         &:hover { background-color:var(--garur-surface-muted); }".into());

    m.entry("textfield".into()).or_insert_with(|| 
        "display:block;width:100%;\
         padding:0.5rem 0.75rem;\
         background-color:var(--garur-surface);color:var(--garur-fg);\
         border:1px solid var(--garur-border-subtle);\
         border-radius:var(--garur-radius);\
         font-size:0.875rem;line-height:1.5;\
         transition:border-color 150ms ease, box-shadow 150ms ease;\
         &:focus { outline:none;border-color:var(--garur-primary);\
                   box-shadow:0 0 0 3px color-mix(in oklab, var(--garur-primary) 20%, transparent); }".into());
}

fn gen_intent_indian(m: &mut FxHashMap<String, String>) {
    m.entry("namaste".into()).or_insert_with(|| 
        "display:flex;flex-direction:column;align-items:center;\
         text-align:center;padding:3rem 1.5rem;gap:1.5rem".into());
    m.entry("lotus".into()).or_insert_with(|| 
        "display:grid;place-items:center;text-align:center;\
         padding:2rem;gap:1rem".into());
    m.entry("banyan".into()).or_insert_with(|| 
        "position:sticky;top:0;z-index:40;\
         backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);\
         background-color:color-mix(in oklab, var(--garur-surface) 80%, transparent);\
         border-bottom:1px solid var(--garur-border-subtle)".into());
    m.entry("rangoli".into()).or_insert_with(|| 
        "display:grid;grid-template-columns:repeat(4, 1fr);\
         gap:1rem;place-items:center".into());
    m.entry("mehndi".into()).or_insert_with(|| 
        "border:2px double var(--garur-primary);\
         padding:1rem".into());
    m.entry("diya".into()).or_insert_with(|| 
        "position:relative;\
         &::before { content:'';position:absolute;inset:-8px;\
                     background:radial-gradient(circle,\
                       color-mix(in oklab, var(--garur-warning) 40%, transparent),\
                       transparent 70%);\
                     border-radius:9999px;z-index:-1; }".into());
    m.entry("tilak".into()).or_insert_with(|| 
        "display:inline-block;width:2px;height:1rem;\
         background:var(--garur-primary);border-radius:2px".into());
    m.entry("ghat".into()).or_insert_with(|| 
        "display:flex;flex-direction:column;gap:0.5rem;\
         & > *:nth-child(1) { margin-left:0; }\
         & > *:nth-child(2) { margin-left:1rem; }\
         & > *:nth-child(3) { margin-left:2rem; }\
         & > *:nth-child(4) { margin-left:3rem; }".into());
    m.entry("tandava".into()).or_insert_with(|| 
        "transition-timing-function:cubic-bezier(0.87, 0, 0.13, 1);\
         transition-duration:400ms".into());
    m.entry("lasya".into()).or_insert_with(|| 
        "transition-timing-function:cubic-bezier(0.25, 1, 0.5, 1);\
         transition-duration:600ms".into());
    m.entry("chakra".into()).or_insert_with(|| 
        "display:inline-block;width:1.5rem;height:1.5rem;\
         border:2px solid color-mix(in oklab, currentColor 20%, transparent);\
         border-top-color:currentColor;\
         border-radius:9999px;\
         animation:garur-spin 0.8s linear infinite".into());
    m.entry("monsoon".into()).or_insert_with(|| 
        "background-color:oklch(0.95 0.02 240);\
         color:oklch(0.35 0.05 240);\
         border:1px solid oklch(0.85 0.03 240)".into());
    m.entry("saffron".into()).or_insert_with(|| 
        "background-color:var(--garur-warning);\
         color:var(--garur-warning-fg);\
         border:1px solid color-mix(in oklab, var(--garur-warning) 70%, black)".into());
}

// ═══════════════════════════════════════════════════════════════════
// 🔧 COMPAT LAYER — UnoCSS / WindiCSS aliases
// ═══════════════════════════════════════════════════════════════════

fn gen_compat_display(m: &mut FxHashMap<String, String>) {
    m.entry("iblock".into()).or_insert_with(|| "display:inline-block".into());
    m.entry("iflex".into()).or_insert_with(|| "display:inline-flex".into());
    m.entry("igrid".into()).or_insert_with(|| "display:inline-grid".into());
}

fn gen_compat_flexbox(m: &mut FxHashMap<String, String>) {
    m.entry("jc-center".into()).or_insert_with(|| "justify-content:center".into());
    m.entry("jc-between".into()).or_insert_with(|| "justify-content:space-between".into());
    m.entry("jc-around".into()).or_insert_with(|| "justify-content:space-around".into());
    m.entry("jc-evenly".into()).or_insert_with(|| "justify-content:space-evenly".into());
    m.entry("jc-start".into()).or_insert_with(|| "justify-content:flex-start".into());
    m.entry("jc-end".into()).or_insert_with(|| "justify-content:flex-end".into());

    m.entry("ai-center".into()).or_insert_with(|| "align-items:center".into());
    m.entry("ai-baseline".into()).or_insert_with(|| "align-items:baseline".into());
    m.entry("ai-start".into()).or_insert_with(|| "align-items:flex-start".into());
    m.entry("ai-end".into()).or_insert_with(|| "align-items:flex-end".into());
    m.entry("ai-stretch".into()).or_insert_with(|| "align-items:stretch".into());

    m.entry("as-center".into()).or_insert_with(|| "align-self:center".into());
    m.entry("as-start".into()).or_insert_with(|| "align-self:flex-start".into());
    m.entry("as-end".into()).or_insert_with(|| "align-self:flex-end".into());

    m.entry("ac-between".into()).or_insert_with(|| "align-content:space-between".into());
    m.entry("ac-center".into()).or_insert_with(|| "align-content:center".into());
    m.entry("ac-around".into()).or_insert_with(|| "align-content:space-around".into());

    m.entry("fx-1".into()).or_insert_with(|| "flex:1 1 0%".into());
    m.entry("fx-auto".into()).or_insert_with(|| "flex:1 1 auto".into());
    m.entry("fx-none".into()).or_insert_with(|| "flex:none".into());
    m.entry("fx-init".into()).or_insert_with(|| "flex:0 1 auto".into());

    for (k, v) in [
        ("0", "0"), ("1", "0.25rem"), ("2", "0.5rem"), ("3", "0.75rem"),
        ("4", "1rem"), ("5", "1.25rem"), ("6", "1.5rem"), ("8", "2rem"),
        ("10", "2.5rem"), ("12", "3rem"), ("16", "4rem"),
    ] {
        m.entry(format!("gx-{}", k)).or_insert_with(|| format!("column-gap:{}", v));
        m.entry(format!("gy-{}", k)).or_insert_with(|| format!("row-gap:{}", v));
    }
}

fn gen_compat_sizing(m: &mut FxHashMap<String, String>) {
    for (k, v) in [
        ("0", "0"), ("1", "0.25rem"), ("2", "0.5rem"), ("3", "0.75rem"),
        ("4", "1rem"), ("5", "1.25rem"), ("6", "1.5rem"), ("8", "2rem"),
        ("10", "2.5rem"), ("12", "3rem"), ("16", "4rem"), ("20", "5rem"),
        ("24", "6rem"), ("32", "8rem"),
    ] {
        m.entry(format!("sz-{}", k))
            .or_insert_with(|| format!("width:{};height:{}", v, v));
    }
    m.entry("sz-full".into()).or_insert_with(|| "width:100%;height:100%".into());

    m.entry("minw-0".into()).or_insert_with(|| "min-width:0".into());
    m.entry("minw-full".into()).or_insert_with(|| "min-width:100%".into());
    m.entry("maxw-full".into()).or_insert_with(|| "max-width:100%".into());
    m.entry("minh-0".into()).or_insert_with(|| "min-height:0".into());
    m.entry("minh-full".into()).or_insert_with(|| "min-height:100%".into());
    m.entry("minh-screen".into()).or_insert_with(|| "min-height:100vh".into());
    m.entry("maxh-screen".into()).or_insert_with(|| "max-height:100vh".into());

    for (k, v) in [
        ("xs", "20rem"), ("sm", "24rem"), ("md", "28rem"), ("lg", "32rem"),
        ("xl", "36rem"), ("2xl", "42rem"), ("3xl", "48rem"), ("4xl", "56rem"),
        ("5xl", "64rem"), ("6xl", "72rem"), ("7xl", "80rem"),
    ] {
        m.entry(format!("maxw-{}", k)).or_insert_with(|| format!("max-width:{}", v));
    }
}

fn gen_compat_grid(m: &mut FxHashMap<String, String>) {
    for i in 1..=12 {
        m.entry(format!("gc-{}", i))
            .or_insert_with(|| format!("grid-template-columns:repeat({}, minmax(0, 1fr))", i));
        m.entry(format!("gr-{}", i))
            .or_insert_with(|| format!("grid-template-rows:repeat({}, minmax(0, 1fr))", i));
        m.entry(format!("cs-{}", i))
            .or_insert_with(|| format!("grid-column:span {} / span {}", i, i));
        m.entry(format!("rs-{}", i))
            .or_insert_with(|| format!("grid-row:span {} / span {}", i, i));
    }
}

fn gen_compat_effects(m: &mut FxHashMap<String, String>) {
    for op in [0, 5, 10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 95, 100] {
        m.entry(format!("op-{}", op))
            .or_insert_with(|| format!("opacity:{}", op as f64 / 100.0));
    }

    m.entry("sh".into()).or_insert_with(|| 
        "box-shadow:0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)".into());
    m.entry("sh-sm".into()).or_insert_with(|| 
        "box-shadow:0 1px 2px 0 rgb(0 0 0 / 0.05)".into());
    m.entry("sh-md".into()).or_insert_with(|| 
        "box-shadow:0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)".into());
    m.entry("sh-lg".into()).or_insert_with(|| 
        "box-shadow:0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)".into());
    m.entry("sh-xl".into()).or_insert_with(|| 
        "box-shadow:0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)".into());
    m.entry("sh-none".into()).or_insert_with(|| "box-shadow:none".into());

    for d in [75, 100, 150, 200, 300, 500, 700, 1000] {
        m.entry(format!("dur-{}", d))
            .or_insert_with(|| format!("transition-duration:{}ms", d));
    }
}

fn gen_compat_cursor(m: &mut FxHashMap<String, String>) {
    m.entry("cur-pointer".into()).or_insert_with(|| "cursor:pointer".into());
    m.entry("cur-default".into()).or_insert_with(|| "cursor:default".into());
    m.entry("cur-grab".into()).or_insert_with(|| "cursor:grab".into());
    m.entry("cur-grabbing".into()).or_insert_with(|| "cursor:grabbing".into());
    m.entry("cur-not-allowed".into()).or_insert_with(|| "cursor:not-allowed".into());
    m.entry("cur-text".into()).or_insert_with(|| "cursor:text".into());
    m.entry("cur-move".into()).or_insert_with(|| "cursor:move".into());
    m.entry("cur-wait".into()).or_insert_with(|| "cursor:wait".into());
    m.entry("cur-help".into()).or_insert_with(|| "cursor:help".into());

    m.entry("sel-n".into()).or_insert_with(|| "user-select:none".into());
    m.entry("sel-t".into()).or_insert_with(|| "user-select:text".into());
    m.entry("sel-all".into()).or_insert_with(|| "user-select:all".into());
}

fn gen_compat_aspect_object(m: &mut FxHashMap<String, String>) {
    m.entry("ar-video".into()).or_insert_with(|| "aspect-ratio:16/9".into());
    m.entry("ar-square".into()).or_insert_with(|| "aspect-ratio:1/1".into());
    m.entry("ar-photo".into()).or_insert_with(|| "aspect-ratio:4/3".into());
    m.entry("ar-portrait".into()).or_insert_with(|| "aspect-ratio:3/4".into());
    m.entry("ar-wide".into()).or_insert_with(|| "aspect-ratio:21/9".into());

    m.entry("ob-cover".into()).or_insert_with(|| "object-fit:cover".into());
    m.entry("ob-contain".into()).or_insert_with(|| "object-fit:contain".into());
    m.entry("ob-fill".into()).or_insert_with(|| "object-fit:fill".into());
    m.entry("ob-none".into()).or_insert_with(|| "object-fit:none".into());
}

// ═══════════════════════════════════════════════════════════════════
// 🎨 WEB KIT — Premium website building blocks
// ═══════════════════════════════════════════════════════════════════

fn gen_web_kit(m: &mut FxHashMap<String, String>) {
    // ─── Background layers ───
    m.entry("mesh-bg".into()).or_insert_with(|| 
        "background:\
           radial-gradient(ellipse 80% 60% at 20% 0%, rgba(134,87,247,0.18), transparent 60%),\
           radial-gradient(ellipse 60% 50% at 80% 20%, rgba(229,76,181,0.12), transparent 60%),\
           radial-gradient(ellipse 70% 40% at 50% 100%, rgba(26,138,222,0.10), transparent 60%)".into());

    m.entry("grid-bg".into()).or_insert_with(|| 
        "background-image:\
           linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),\
           linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);\
         background-size:48px 48px".into());

    m.entry("noise-overlay".into()).or_insert_with(|| 
        "position:fixed;inset:0;z-index:100;pointer-events:none;opacity:0.035;\
         background-image:url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")".into());

    // ─── Orbs ───
    m.entry("orb".into()).or_insert_with(|| 
        "position:absolute;border-radius:9999px;filter:blur(80px);\
         opacity:0.5;pointer-events:none;will-change:transform".into());
    m.entry("orb-iris".into()).or_insert_with(|| 
        "position:absolute;border-radius:9999px;filter:blur(80px);\
         opacity:0.35;pointer-events:none;background:#8657f7".into());
    m.entry("orb-pink".into()).or_insert_with(|| 
        "position:absolute;border-radius:9999px;filter:blur(80px);\
         opacity:0.28;pointer-events:none;background:#e54cb5".into());
    m.entry("orb-warm".into()).or_insert_with(|| 
        "position:absolute;border-radius:9999px;filter:blur(80px);\
         opacity:0.15;pointer-events:none;background:#f59e00".into());
    m.entry("float-slow".into()).or_insert_with(|| 
        "animation:garur-float-slow 12s ease-in-out infinite".into());
    m.entry("float-slower".into()).or_insert_with(|| 
        "animation:garur-float-slower 16s ease-in-out infinite".into());

    // ─── Visual effects ───
    m.entry("gradient-text".into()).or_insert_with(|| 
        "background:linear-gradient(120deg, #c5b5fe 0%, #8657f7 35%, #e54cb5 70%, #f59e00 100%);\
         background-size:200% 200%;\
         -webkit-background-clip:text;background-clip:text;\
         -webkit-text-fill-color:transparent;color:transparent;\
         animation:garur-gradient-shift 8s ease infinite".into());

    m.entry("glow-border".into()).or_insert_with(|| 
        "position:relative;\
         background:linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01));\
         border:1px solid rgba(255,255,255,0.06);\
         border-radius:1rem".into());

    m.entry("frosted".into()).or_insert_with(|| 
        "backdrop-filter:blur(20px) saturate(180%);\
         -webkit-backdrop-filter:blur(20px) saturate(180%);\
         background:rgba(8,8,10,0.65);\
         border-bottom:1px solid rgba(255,255,255,0.06)".into());

    m.entry("glass-pill".into()).or_insert_with(|| 
        "display:inline-flex;align-items:center;gap:0.375rem;\
         padding:0.25rem 0.75rem;border-radius:9999px;\
         font-size:0.75rem;font-weight:500;\
         background:rgba(255,255,255,0.04);\
         border:1px solid rgba(255,255,255,0.06);\
         color:#d4d4d8;white-space:nowrap".into());

    m.entry("pill-dot".into()).or_insert_with(|| 
        "width:0.375rem;height:0.375rem;border-radius:9999px;\
         background:currentColor".into());

    m.entry("pulse-ring".into()).or_insert_with(|| 
        "position:relative;width:0.5rem;height:0.5rem;\
         border-radius:9999px;background:#28c840;\
         &::before { content:''; position:absolute; inset:-3px;\
                     border-radius:9999px; background:#28c840; opacity:0.4;\
                     animation:garur-pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }".into());

    // ─── Typography ───
    m.entry("display-hero".into()).or_insert_with(|| 
        "font-size:clamp(2.75rem, 6vw, 5.5rem);\
         line-height:1.02;font-weight:800;letter-spacing:-0.035em".into());
    m.entry("display-section".into()).or_insert_with(|| 
        "font-size:clamp(2rem, 4vw, 3.25rem);\
         line-height:1.1;font-weight:700;letter-spacing:-0.025em".into());
    m.entry("stat-num".into()).or_insert_with(|| 
        "font-size:clamp(2rem, 4vw, 3rem);\
         font-weight:800;letter-spacing:-0.03em;line-height:1".into());

    // ─── Hero buttons ───
    m.entry("btn-hero".into()).or_insert_with(|| 
        "display:inline-flex;align-items:center;gap:0.5rem;\
         padding:0.875rem 1.5rem;border-radius:0.75rem;\
         font-weight:600;font-size:0.9375rem;cursor:pointer;\
         transition:all 200ms cubic-bezier(0.4, 0, 0.2, 1);\
         text-decoration:none;border:none".into());

    m.entry("btn-hero-primary".into()).or_insert_with(|| 
        "background:linear-gradient(135deg, #8657f7, #a855f7);\
         color:white;\
         box-shadow:0 8px 24px -8px rgba(134, 87, 247, 0.7),\
                    inset 0 1px 0 rgba(255,255,255,0.15);\
         &:hover { transform:translateY(-1px);\
                   box-shadow:0 12px 32px -8px rgba(134, 87, 247, 0.9),\
                              inset 0 1px 0 rgba(255,255,255,0.2); }".into());

    m.entry("btn-hero-secondary".into()).or_insert_with(|| 
        "background:rgba(255,255,255,0.05);\
         color:#f5f5f7;\
         border:1px solid rgba(255,255,255,0.10);\
         &:hover { background:rgba(255,255,255,0.08);\
                   border-color:rgba(255,255,255,0.18); }".into());

    // ─── Code window ───
    m.entry("code-window".into()).or_insert_with(|| 
        "background:#0b0b0e;\
         border:1px solid rgba(255,255,255,0.06);\
         border-radius:0.75rem;overflow:hidden;\
         font-family:ui-monospace, 'JetBrains Mono', monospace;\
         font-size:0.8125rem;line-height:1.65".into());

    m.entry("window-header".into()).or_insert_with(|| 
        "display:flex;align-items:center;gap:0.5rem;\
         padding:0.75rem 1rem;\
         background:rgba(255,255,255,0.02);\
         border-bottom:1px solid rgba(255,255,255,0.06)".into());

    m.entry("code-body".into()).or_insert_with(|| 
        "margin:0;padding:1.25rem 1.25rem 1.5rem;\
         overflow-x:auto;color:#e2e2e6".into());

    m.entry("dot-red".into()).or_insert_with(|| 
        "width:0.625rem;height:0.625rem;border-radius:9999px;background:#ff5f57".into());
    m.entry("dot-yellow".into()).or_insert_with(|| 
        "width:0.625rem;height:0.625rem;border-radius:9999px;background:#febc2e".into());
    m.entry("dot-green".into()).or_insert_with(|| 
        "width:0.625rem;height:0.625rem;border-radius:9999px;background:#28c840".into());

    m.entry("syn-tag".into()).or_insert_with(|| "color:#f471b5".into());
    m.entry("syn-attr".into()).or_insert_with(|| "color:#a5b4fc".into());
    m.entry("syn-str".into()).or_insert_with(|| "color:#86efac".into());
    m.entry("syn-punc".into()).or_insert_with(|| "color:#52525b".into());

    // ─── Marquee ───
    m.entry("marquee".into()).or_insert_with(|| 
        "display:flex;gap:3rem;\
         animation:garur-marquee 40s linear infinite;\
         will-change:transform".into());
    m.entry("fade-edges".into()).or_insert_with(|| 
        "mask-image:linear-gradient(90deg, transparent, black 20%, black 80%, transparent);\
         -webkit-mask-image:linear-gradient(90deg, transparent, black 20%, black 80%, transparent)".into());

    // ─── Section rhythm ───
    m.entry("section".into()).or_insert_with(|| 
        "padding:6rem 1.5rem;position:relative".into());
    m.entry("section-sm".into()).or_insert_with(|| 
        "padding:4rem 1.5rem;position:relative".into());
    m.entry("section-lg".into()).or_insert_with(|| 
        "padding:8rem 1.5rem;position:relative".into());

    // ─── Bento ───
    m.entry("bento".into()).or_insert_with(|| 
        "display:grid;grid-template-columns:repeat(12, 1fr);gap:1rem".into());
    m.entry("bento-4".into()).or_insert_with(|| "grid-column:span 4".into());
    m.entry("bento-6".into()).or_insert_with(|| "grid-column:span 6".into());
    m.entry("bento-8".into()).or_insert_with(|| "grid-column:span 8".into());
    m.entry("bento-12".into()).or_insert_with(|| "grid-column:span 12".into());

    // ─── FAQ ───
    m.entry("faq-item".into()).or_insert_with(|| 
        "border-bottom:1px solid rgba(255,255,255,0.06);padding:1.25rem 0".into());
    m.entry("faq-q".into()).or_insert_with(|| 
        "cursor:pointer;list-style:none;\
         display:flex;align-items:center;justify-content:space-between;\
         font-weight:500;font-size:1rem;color:#f5f5f7;\
         transition:color 200ms;\
         &:hover { color:#8657f7; }\
         &::-webkit-details-marker { display:none; }\
         &::after { content:'+'; font-size:1.5rem; font-weight:300;\
                    color:#71717a; transition:transform 200ms; }".into());
    m.entry("faq-a".into()).or_insert_with(|| 
        "margin:0.75rem 0 0;color:#a1a1aa;line-height:1.7;font-size:0.9375rem".into());

    // ─── Scrollbar + selection ───
    m.entry("scrollbar-dark".into()).or_insert_with(|| 
        "&::-webkit-scrollbar { width:10px; height:10px; }\
         &::-webkit-scrollbar-track { background:transparent; }\
         &::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.08);\
                                      border-radius:9999px;\
                                      border:2px solid #08080a; }\
         &::-webkit-scrollbar-thumb:hover { background:rgba(255,255,255,0.15); }".into());

    m.entry("selection-iris".into()).or_insert_with(|| 
        "& ::selection { background:rgba(134, 87, 247, 0.35); color:white; }".into());

    m.entry("inline-code".into()).or_insert_with(|| 
        "background:rgba(134,87,247,0.15);color:#c5b5fe;\
         padding:0.125rem 0.375rem;border-radius:0.25rem;\
         font-size:0.875em;font-family:ui-monospace, monospace".into());
}

// ═══════════════════════════════════════════════════════════════════
//  PREMIUM KIT — Signature effects
// ═══════════════════════════════════════════════════════════════════
//
// These are the effects that give GarurSaili its premium feel:
//   • Cursor-following spotlight
//   • Gradient borders that glow on hover
//   • Colored glows (iris, pink, blue, emerald, amber)
//   • Animated border beams
//   • Terminal cursor blink
//   • Dot-grid + aurora backgrounds
//   • Hover shine sweep
//   • Breathing/pulse animations

fn gen_vercel_kit(m: &mut FxHashMap<String, String>) {
    gen_spotlight(m);
    gen_gradient_borders(m);
    gen_colored_glows(m);
    gen_terminal(m);
    gen_vercel_typography(m);
    gen_animated_bg(m);
    gen_hover_effects(m);
    gen_marquee_variants(m);
    gen_shine_sweep(m);
}

// ───────────────────────────────────────────────
// SPOTLIGHT — cursor-following light
// ───────────────────────────────────────────────

fn gen_spotlight(m: &mut FxHashMap<String, String>) {
    // Iris spotlight (default)
    m.entry("spotlight".into()).or_insert_with(|| 
        "position:relative;overflow:hidden;\
         &::before { content:''; position:absolute; inset:0;\
                     background:radial-gradient(600px circle at var(--mx, 50%) var(--my, 50%),\
                       rgba(134,87,247,0.15), transparent 40%);\
                     opacity:0; transition:opacity 300ms;\
                     pointer-events:none; z-index:1; }\
         &:hover::before { opacity:1; }".into());

    // Small spotlight
    m.entry("spotlight-sm".into()).or_insert_with(|| 
        "position:relative;overflow:hidden;\
         &::before { content:''; position:absolute; inset:0;\
                     background:radial-gradient(300px circle at var(--mx, 50%) var(--my, 50%),\
                       rgba(255,255,255,0.08), transparent 40%);\
                     opacity:0; transition:opacity 300ms;\
                     pointer-events:none; z-index:1; }\
         &:hover::before { opacity:1; }".into());

    // Large spotlight
    m.entry("spotlight-lg".into()).or_insert_with(|| 
        "position:relative;overflow:hidden;\
         &::before { content:''; position:absolute; inset:0;\
                     background:radial-gradient(900px circle at var(--mx, 50%) var(--my, 50%),\
                       rgba(134,87,247,0.18), transparent 50%);\
                     opacity:0; transition:opacity 400ms;\
                     pointer-events:none; z-index:1; }\
         &:hover::before { opacity:1; }".into());

    // White spotlight
    m.entry("spotlight-white".into()).or_insert_with(|| 
        "position:relative;overflow:hidden;\
         &::before { content:''; position:absolute; inset:0;\
                     background:radial-gradient(500px circle at var(--mx, 50%) var(--my, 50%),\
                       rgba(255,255,255,0.06), transparent 40%);\
                     opacity:0; transition:opacity 300ms;\
                     pointer-events:none; z-index:1; }\
         &:hover::before { opacity:1; }".into());

    // Pink spotlight
    m.entry("spotlight-pink".into()).or_insert_with(|| 
        "position:relative;overflow:hidden;\
         &::before { content:''; position:absolute; inset:0;\
                     background:radial-gradient(600px circle at var(--mx, 50%) var(--my, 50%),\
                       rgba(229,76,181,0.15), transparent 40%);\
                     opacity:0; transition:opacity 300ms;\
                     pointer-events:none; z-index:1; }\
         &:hover::before { opacity:1; }".into());
}

// ───────────────────────────────────────────────
// GRADIENT BORDERS — Garur glass card style
// ───────────────────────────────────────────────

fn gen_gradient_borders(m: &mut FxHashMap<String, String>) {
    // Base gradient border — subtle white
    m.entry("border-gradient".into()).or_insert_with(|| 
        "position:relative;\
         background:linear-gradient(#0b0b0e, #0b0b0e) padding-box,\
                    linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.02)) border-box;\
         border:1px solid transparent".into());

    // Hover glow — iris
    m.entry("border-gradient-hover".into()).or_insert_with(|| 
        "position:relative;transition:background 300ms;\
         background:linear-gradient(#0b0b0e, #0b0b0e) padding-box,\
                    linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02)) border-box;\
         border:1px solid transparent;\
         &:hover { background:linear-gradient(#0b0b0e, #0b0b0e) padding-box,\
                              linear-gradient(135deg, rgba(134,87,247,0.6), rgba(229,76,181,0.4)) border-box; }".into());

    // Variants with specific colors
    m.entry("border-gradient-iris".into()).or_insert_with(|| 
        "background:linear-gradient(#0b0b0e, #0b0b0e) padding-box,\
                    linear-gradient(135deg, rgba(134,87,247,0.5), rgba(134,87,247,0.1)) border-box;\
         border:1px solid transparent".into());

    m.entry("border-gradient-pink".into()).or_insert_with(|| 
        "background:linear-gradient(#0b0b0e, #0b0b0e) padding-box,\
                    linear-gradient(135deg, rgba(229,76,181,0.5), rgba(229,76,181,0.1)) border-box;\
         border:1px solid transparent".into());

    m.entry("border-gradient-blue".into()).or_insert_with(|| 
        "background:linear-gradient(#0b0b0e, #0b0b0e) padding-box,\
                    linear-gradient(135deg, rgba(26,138,222,0.5), rgba(26,138,222,0.1)) border-box;\
         border:1px solid transparent".into());

    m.entry("border-gradient-emerald".into()).or_insert_with(|| 
        "background:linear-gradient(#0b0b0e, #0b0b0e) padding-box,\
                    linear-gradient(135deg, rgba(38,148,76,0.5), rgba(38,148,76,0.1)) border-box;\
         border:1px solid transparent".into());

    // Animated border beam — rotating conic gradient
    m.entry("border-beam".into()).or_insert_with(|| 
        "position:relative;\
         background:linear-gradient(#0b0b0e, #0b0b0e) padding-box,\
                    conic-gradient(from var(--beam-angle, 0deg), transparent 0%, #8657f7 25%, #e54cb5 50%, transparent 75%) border-box;\
         border:1px solid transparent;\
         animation:garur-beam 4s linear infinite".into());

    // Gradient border on cards (works with card-glass)
    m.entry("card-gradient".into()).or_insert_with(|| 
        "position:relative;\
         background:linear-gradient(rgba(255,255,255,0.02), rgba(255,255,255,0.01)) padding-box,\
                    linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02)) border-box;\
         border:1px solid transparent;\
         border-radius:1rem".into());
}

// ───────────────────────────────────────────────
// COLORED GLOWS
// ───────────────────────────────────────────────

fn gen_colored_glows(m: &mut FxHashMap<String, String>) {
    m.entry("glow-iris".into()).or_insert_with(|| 
        "box-shadow:0 0 60px -12px rgba(134,87,247,0.6),\
                    0 0 24px -8px rgba(134,87,247,0.4)".into());

    m.entry("glow-pink".into()).or_insert_with(|| 
        "box-shadow:0 0 60px -12px rgba(229,76,181,0.6),\
                    0 0 24px -8px rgba(229,76,181,0.4)".into());

    m.entry("glow-blue".into()).or_insert_with(|| 
        "box-shadow:0 0 60px -12px rgba(26,138,222,0.6),\
                    0 0 24px -8px rgba(26,138,222,0.4)".into());

    m.entry("glow-emerald".into()).or_insert_with(|| 
        "box-shadow:0 0 60px -12px rgba(38,148,76,0.6),\
                    0 0 24px -8px rgba(38,148,76,0.4)".into());

    m.entry("glow-amber".into()).or_insert_with(|| 
        "box-shadow:0 0 60px -12px rgba(245,158,0,0.6),\
                    0 0 24px -8px rgba(245,158,0,0.4)".into());

    m.entry("glow-ruby".into()).or_insert_with(|| 
        "box-shadow:0 0 60px -12px rgba(209,42,61,0.6),\
                    0 0 24px -8px rgba(209,42,61,0.4)".into());

    m.entry("glow-white".into()).or_insert_with(|| 
        "box-shadow:0 0 40px -8px rgba(255,255,255,0.15),\
                    0 0 16px -4px rgba(255,255,255,0.08)".into());

    m.entry("glow-soft".into()).or_insert_with(|| 
        "box-shadow:0 0 40px -16px rgba(255,255,255,0.1)".into());

    m.entry("glow-inner-iris".into()).or_insert_with(|| 
        "box-shadow:inset 0 0 40px -12px rgba(134,87,247,0.4)".into());

    m.entry("glow-inner-white".into()).or_insert_with(|| 
        "box-shadow:inset 0 0 30px -10px rgba(255,255,255,0.08)".into());

    // Text glows
    m.entry("text-glow-iris".into()).or_insert_with(|| 
        "text-shadow:0 0 20px rgba(134,87,247,0.5), 0 0 40px rgba(134,87,247,0.3)".into());

    m.entry("text-glow-white".into()).or_insert_with(|| 
        "text-shadow:0 0 20px rgba(255,255,255,0.4), 0 0 40px rgba(255,255,255,0.2)".into());
}

// ───────────────────────────────────────────────
// TERMINAL — prompt + blinking cursor
// ───────────────────────────────────────────────

fn gen_terminal(m: &mut FxHashMap<String, String>) {
    m.entry("terminal-prompt".into()).or_insert_with(|| 
        "color:#71717a;user-select:none;margin-right:0.5rem".into());

    m.entry("cursor-blink".into()).or_insert_with(|| 
        "display:inline-block;width:0.5rem;height:1em;\
         background:#f5f5f7;vertical-align:text-bottom;\
         margin-left:0.125rem;\
         animation:garur-blink 1.06s step-end infinite".into());

    m.entry("terminal-cursor".into()).or_insert_with(|| 
        "color:#8657f7;animation:garur-blink 1.06s step-end infinite".into());

    m.entry("terminal-line".into()).or_insert_with(|| 
        "display:flex;align-items:center;\
         font-family:ui-monospace, 'JetBrains Mono', monospace;\
         font-size:0.8125rem;line-height:1.65".into());

    m.entry("terminal-ok".into()).or_insert_with(|| "color:#86efac".into());
    m.entry("terminal-warn".into()).or_insert_with(|| "color:#fcd34d".into());
    m.entry("terminal-err".into()).or_insert_with(|| "color:#fca5a5".into());
    m.entry("terminal-dim".into()).or_insert_with(|| "color:#52525b".into());
}

// ───────────────────────────────────────────────
// DISPLAY TYPOGRAPHY — Garur signature scale
// ───────────────────────────────────────────────
fn gen_vercel_typography(m: &mut FxHashMap<String, String>) {
    m.entry("hero-vercel".into()).or_insert_with(|| 
        "font-size:clamp(3rem, 8vw, 6rem);\
         font-weight:800;letter-spacing:-0.04em;line-height:1.05".into());

    m.entry("display-vercel".into()).or_insert_with(|| 
        "font-size:clamp(2.5rem, 5vw, 4rem);\
         font-weight:700;letter-spacing:-0.03em;line-height:1.1".into());

    m.entry("section-vercel".into()).or_insert_with(|| 
        "padding-block:8rem;padding-inline:1.5rem;\
         max-width:1200px;margin-inline:auto".into());

    m.entry("section-vercel-sm".into()).or_insert_with(|| 
        "padding-block:5rem;padding-inline:1.5rem;\
         max-width:1200px;margin-inline:auto".into());

    m.entry("title-vercel".into()).or_insert_with(|| 
        "font-size:clamp(2rem, 4vw, 3rem);\
         font-weight:700;letter-spacing:-0.025em;line-height:1.15".into());

    m.entry("lead-vercel".into()).or_insert_with(|| 
        "font-size:1.125rem;line-height:1.65;\
         color:#a1a1aa;max-width:40rem".into());
}

// ───────────────────────────────────────────────
// ANIMATED BACKGROUNDS — aurora, dot grid, beams
// ───────────────────────────────────────────────

fn gen_animated_bg(m: &mut FxHashMap<String, String>) {
    // Dot grid background
    m.entry("dot-grid".into()).or_insert_with(|| 
        "background-image:radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px);\
         background-size:24px 24px".into());

    m.entry("dot-grid-lg".into()).or_insert_with(|| 
        "background-image:radial-gradient(circle, rgba(255,255,255,0.08) 1.5px, transparent 1.5px);\
         background-size:32px 32px".into());

    // Aurora background — animated gradients
    m.entry("aurora-bg".into()).or_insert_with(|| 
        "position:absolute;inset:0;overflow:hidden;pointer-events:none;\
         background:\
           radial-gradient(ellipse 100% 80% at 20% 0%, rgba(134,87,247,0.25), transparent 50%),\
           radial-gradient(ellipse 80% 60% at 80% 20%, rgba(229,76,181,0.18), transparent 50%),\
           radial-gradient(ellipse 90% 70% at 50% 100%, rgba(26,138,222,0.15), transparent 50%);\
         animation:garur-aurora 20s ease-in-out infinite".into());

    // Vertical light beam
    m.entry("beam".into()).or_insert_with(|| 
        "position:absolute;top:0;bottom:0;width:1px;\
         background:linear-gradient(to bottom,\
           transparent, rgba(134,87,247,0.5) 50%, transparent);\
         pointer-events:none".into());

    m.entry("beam-white".into()).or_insert_with(|| 
        "position:absolute;top:0;bottom:0;width:1px;\
         background:linear-gradient(to bottom,\
           transparent, rgba(255,255,255,0.15) 50%, transparent);\
         pointer-events:none".into());

    // Scan line — horizontal sweeping effect
    m.entry("scan-line".into()).or_insert_with(|| 
        "position:absolute;left:0;right:0;height:1px;\
         background:linear-gradient(to right,\
           transparent, rgba(134,87,247,0.6) 50%, transparent);\
         pointer-events:none;\
         animation:garur-scan 3s ease-in-out infinite".into());

    // Radial fade — vignette effect
    m.entry("radial-fade".into()).or_insert_with(|| 
        "mask-image:radial-gradient(ellipse at center, black 40%, transparent 70%);\
         -webkit-mask-image:radial-gradient(ellipse at center, black 40%, transparent 70%)".into());

    // Top fade — content fades into nav
    m.entry("top-fade".into()).or_insert_with(|| 
        "mask-image:linear-gradient(to bottom, transparent, black 20%);\
         -webkit-mask-image:linear-gradient(to bottom, transparent, black 20%)".into());

    // Bottom fade
    m.entry("bottom-fade".into()).or_insert_with(|| 
        "mask-image:linear-gradient(to top, transparent, black 20%);\
         -webkit-mask-image:linear-gradient(to top, transparent, black 20%)".into());

    // Spot glow behind element
    m.entry("spot-glow".into()).or_insert_with(|| 
        "position:relative;\
         &::after { content:''; position:absolute; top:50%; left:50%;\
                    transform:translate(-50%,-50%);\
                    width:120%; height:120%;\
                    background:radial-gradient(ellipse, rgba(134,87,247,0.15), transparent 60%);\
                    z-index:-1; pointer-events:none; }".into());
}

// ───────────────────────────────────────────────
// HOVER EFFECTS — lift, glow, scale, tilt
// ───────────────────────────────────────────────

fn gen_hover_effects(m: &mut FxHashMap<String, String>) {
    m.entry("hover-glow".into()).or_insert_with(|| 
        "transition:box-shadow 300ms ease;\
         &:hover { box-shadow:0 0 40px -8px rgba(134,87,247,0.5),\
                              0 0 16px -4px rgba(134,87,247,0.3); }".into());

    m.entry("hover-glow-soft".into()).or_insert_with(|| 
        "transition:box-shadow 300ms ease;\
         &:hover { box-shadow:0 0 30px -10px rgba(255,255,255,0.15); }".into());

    m.entry("hover-lift".into()).or_insert_with(|| 
        "transition:transform 250ms cubic-bezier(0.4, 0, 0.2, 1),\
                    box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1);\
         &:hover { transform:translateY(-4px);\
                   box-shadow:0 20px 40px -12px rgba(0,0,0,0.4); }".into());

    m.entry("hover-lift-sm".into()).or_insert_with(|| 
        "transition:transform 200ms ease;\
         &:hover { transform:translateY(-2px); }".into());

    m.entry("hover-scale".into()).or_insert_with(|| 
        "transition:transform 200ms ease;\
         &:hover { transform:scale(1.02); }".into());

    m.entry("hover-scale-sm".into()).or_insert_with(|| 
        "transition:transform 200ms ease;\
         &:hover { transform:scale(1.01); }".into());

    m.entry("hover-bright".into()).or_insert_with(|| 
        "transition:filter 200ms ease;\
         &:hover { filter:brightness(1.15); }".into());

    m.entry("hover-bright-sm".into()).or_insert_with(|| 
        "transition:filter 200ms ease;\
         &:hover { filter:brightness(1.08); }".into());

    m.entry("hover-tilt".into()).or_insert_with(|| 
        "transition:transform 300ms ease;\
         &:hover { transform:perspective(1000px) rotateX(-2deg) rotateY(2deg); }".into());
}

// ───────────────────────────────────────────────
// MARQUEE VARIANTS
// ───────────────────────────────────────────────

fn gen_marquee_variants(m: &mut FxHashMap<String, String>) {
    m.entry("marquee-slow".into()).or_insert_with(|| 
        "display:flex;gap:3rem;\
         animation:garur-marquee 80s linear infinite;\
         will-change:transform".into());

    m.entry("marquee-fast".into()).or_insert_with(|| 
        "display:flex;gap:3rem;\
         animation:garur-marquee 20s linear infinite;\
         will-change:transform".into());

    m.entry("marquee-reverse".into()).or_insert_with(|| 
        "display:flex;gap:3rem;\
         animation:garur-marquee 40s linear infinite reverse;\
         will-change:transform".into());

    m.entry("marquee-pause".into()).or_insert_with(|| 
        "&:hover { animation-play-state:paused; }".into());
}

// ───────────────────────────────────────────────
// SHINE SWEEP — animated highlight over buttons/cards
// ───────────────────────────────────────────────

fn gen_shine_sweep(m: &mut FxHashMap<String, String>) {
    m.entry("shine".into()).or_insert_with(|| 
        "position:relative;overflow:hidden;\
         &::after { content:''; position:absolute; top:0; left:-100%;\
                    width:100%; height:100%;\
                    background:linear-gradient(90deg,\
                      transparent, rgba(255,255,255,0.15), transparent);\
                    transition:left 600ms ease; pointer-events:none; }\
         &:hover::after { left:100%; }".into());

    m.entry("shine-always".into()).or_insert_with(|| 
        "position:relative;overflow:hidden;\
         &::after { content:''; position:absolute; top:0; left:-100%;\
                    width:100%; height:100%;\
                    background:linear-gradient(90deg,\
                      transparent, rgba(255,255,255,0.15), transparent);\
                    animation:garur-shine 3s ease-in-out infinite;\
                    pointer-events:none; }".into());

    m.entry("shine-border".into()).or_insert_with(|| 
        "position:relative;overflow:hidden;\
         &::before { content:''; position:absolute; inset:0;\
                     background:linear-gradient(90deg,\
                       transparent, rgba(134,87,247,0.5), transparent);\
                     opacity:0; transition:opacity 300ms; pointer-events:none; }\
         &:hover::before { opacity:1; }".into());
}

// ═══════════════════════════════════════════════════════════════════
// 🆕 TIER B INTENT
// ═══════════════════════════════════════════════════════════════════

fn gen_tier_b_intent(m: &mut FxHashMap<String, String>) {
    gen_status(m);
    gen_trend(m);
    gen_notification(m);
    gen_menu(m);
    gen_hamburger_drawer(m);
    gen_search(m);
    gen_kbd(m);
    gen_rating(m);
    gen_price(m);
    gen_comment(m);
    gen_testimonial(m);
    gen_post(m);
    gen_divider_text(m);
    gen_media(m);
    gen_loader(m);
    gen_states(m);
    gen_responsive(m);
}

fn gen_status(m: &mut FxHashMap<String, String>) {
    for (name, color) in [
        ("online",  "var(--garur-success)"),
        ("away",    "var(--garur-warning)"),
        ("busy",    "var(--garur-danger)"),
        ("offline", "var(--garur-muted)"),
    ] {
        m.entry(format!("status-{}", name)).or_insert_with(|| 
            format!("display:inline-block;width:0.625rem;height:0.625rem;\
                     border-radius:9999px;background:{};\
                     box-shadow:0 0 0 2px var(--garur-surface)", color));
    }
    m.entry("status-alive".into()).or_insert_with(|| 
        "display:inline-block;width:0.625rem;height:0.625rem;\
         border-radius:9999px;background:var(--garur-success);\
         box-shadow:0 0 0 2px var(--garur-surface);\
         animation:garur-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite".into());
}

fn gen_trend(m: &mut FxHashMap<String, String>) {
    m.entry("trend-up".into()).or_insert_with(|| 
        "display:inline-flex;align-items:center;gap:0.25rem;\
         font-size:0.875rem;font-weight:600;\
         color:var(--garur-success)".into());
    m.entry("trend-down".into()).or_insert_with(|| 
        "display:inline-flex;align-items:center;gap:0.25rem;\
         font-size:0.875rem;font-weight:600;\
         color:var(--garur-danger)".into());
    m.entry("trend-flat".into()).or_insert_with(|| 
        "display:inline-flex;align-items:center;gap:0.25rem;\
         font-size:0.875rem;font-weight:500;\
         color:var(--garur-muted)".into());
}

fn gen_notification(m: &mut FxHashMap<String, String>) {
    m.entry("notification-dot".into()).or_insert_with(|| 
        "position:absolute;top:0;right:0;\
         width:0.625rem;height:0.625rem;\
         background:var(--garur-danger);border-radius:9999px;\
         border:2px solid var(--garur-surface)".into());
    m.entry("notification-badge".into()).or_insert_with(|| 
        "position:absolute;top:-0.375rem;right:-0.375rem;\
         min-width:1.125rem;height:1.125rem;padding-inline:0.25rem;\
         display:grid;place-items:center;\
         background:var(--garur-danger);color:var(--garur-danger-fg);\
         border-radius:9999px;font-size:0.6875rem;font-weight:600;\
         border:2px solid var(--garur-surface)".into());
    m.entry("notify-wrap".into()).or_insert_with(|| 
        "position:relative;display:inline-flex".into());
}

fn gen_menu(m: &mut FxHashMap<String, String>) {
    m.entry("menu".into()).or_insert_with(|| 
        "display:flex;flex-direction:column;gap:0.125rem;\
         padding:0.5rem;min-width:12rem;\
         background-color:var(--garur-surface);color:var(--garur-fg);\
         border:1px solid var(--garur-border-subtle);\
         border-radius:var(--garur-radius);\
         box-shadow:var(--garur-shadow-lg)".into());
    m.entry("menu-item".into()).or_insert_with(|| 
        "display:flex;align-items:center;gap:0.5rem;\
         padding:0.5rem 0.75rem;\
         border-radius:calc(var(--garur-radius) - 2px);\
         font-size:0.875rem;cursor:pointer;color:var(--garur-fg);\
         text-decoration:none;\
         transition:background-color 100ms ease;\
         &:hover { background-color:var(--garur-surface-muted); }".into());
    m.entry("menu-item-active".into()).or_insert_with(|| 
        "background-color:color-mix(in oklab, var(--garur-primary) 12%, transparent);\
         color:var(--garur-primary);font-weight:500".into());
    m.entry("menu-divider".into()).or_insert_with(|| 
        "height:1px;background-color:var(--garur-border-subtle);\
         margin-block:0.375rem".into());
    m.entry("menu-label".into()).or_insert_with(|| 
        "padding:0.375rem 0.75rem;font-size:0.6875rem;\
         text-transform:uppercase;letter-spacing:0.05em;\
         color:var(--garur-muted);font-weight:600".into());
}

fn gen_hamburger_drawer(m: &mut FxHashMap<String, String>) {
    m.entry("hamburger".into()).or_insert_with(|| 
        "display:flex;flex-direction:column;gap:4px;\
         width:2.25rem;height:2.25rem;\
         align-items:center;justify-content:center;\
         cursor:pointer;border-radius:var(--garur-radius);\
         transition:background-color 150ms ease;\
         &:hover { background-color:var(--garur-surface-muted); }\
         & > span { width:1.25rem;height:2px;background:currentColor;\
                    border-radius:2px;transition:transform 200ms; }".into());
    m.entry("drawer".into()).or_insert_with(|| 
        "position:fixed;top:0;bottom:0;left:0;width:18rem;z-index:60;\
         background-color:var(--garur-surface);color:var(--garur-fg);\
         box-shadow:var(--garur-shadow-2xl);overflow-y:auto".into());
    m.entry("drawer-right".into()).or_insert_with(|| 
        "position:fixed;top:0;bottom:0;right:0;width:18rem;z-index:60;\
         background-color:var(--garur-surface);color:var(--garur-fg);\
         box-shadow:var(--garur-shadow-2xl);overflow-y:auto".into());
    m.entry("drawer-overlay".into()).or_insert_with(|| 
        "position:fixed;inset:0;z-index:55;\
         background:rgb(0 0 0 / 0.5);\
         backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px)".into());
}

fn gen_search(m: &mut FxHashMap<String, String>) {
    m.entry("search".into()).or_insert_with(|| 
        "position:relative;display:flex;align-items:center".into());
    m.entry("search-input".into()).or_insert_with(|| 
        "width:100%;padding:0.5rem 2.25rem 0.5rem 2.25rem;\
         background-color:var(--garur-surface);color:var(--garur-fg);\
         border:1px solid var(--garur-border-subtle);\
         border-radius:var(--garur-radius);font-size:0.875rem;\
         transition:border-color 150ms ease, box-shadow 150ms ease;\
         &:focus { outline:none;border-color:var(--garur-primary);\
                   box-shadow:0 0 0 3px color-mix(in oklab, var(--garur-primary) 20%, transparent); }".into());
    m.entry("search-icon".into()).or_insert_with(|| 
        "position:absolute;left:0.75rem;pointer-events:none;\
         color:var(--garur-muted)".into());
    m.entry("search-clear".into()).or_insert_with(|| 
        "position:absolute;right:0.5rem;\
         width:1.5rem;height:1.5rem;\
         display:grid;place-items:center;\
         border-radius:9999px;cursor:pointer;\
         color:var(--garur-muted);transition:background-color 150ms ease;\
         &:hover { background-color:var(--garur-surface-muted); }".into());
    m.entry("search-result".into()).or_insert_with(|| 
        "padding:0.625rem 0.75rem;cursor:pointer;\
         border-radius:calc(var(--garur-radius) - 2px);\
         font-size:0.875rem;transition:background-color 100ms ease;\
         &:hover { background-color:var(--garur-surface-muted); }".into());
}

fn gen_kbd(m: &mut FxHashMap<String, String>) {
    m.entry("shortcut".into()).or_insert_with(|| 
        "display:inline-flex;align-items:center;justify-content:center;\
         min-width:1.5rem;height:1.5rem;padding-inline:0.375rem;\
         font-family:ui-monospace, monospace;font-size:0.75rem;\
         background-color:var(--garur-surface-muted);\
         border:1px solid var(--garur-border-subtle);\
         border-bottom-width:2px;border-radius:0.375rem;\
         color:var(--garur-muted)".into());
    m.entry("kbd-group".into()).or_insert_with(|| 
        "display:inline-flex;align-items:center;gap:0.25rem".into());
    m.entry("kbd-sep".into()).or_insert_with(|| 
        "color:var(--garur-muted);font-size:0.75rem".into());
}

fn gen_rating(m: &mut FxHashMap<String, String>) {
    m.entry("rating".into()).or_insert_with(|| 
        "display:inline-flex;align-items:center;gap:0.375rem".into());
    m.entry("rating-stars".into()).or_insert_with(|| 
        "display:inline-flex;gap:0.0625rem;\
         color:var(--garur-warning);font-size:1rem;line-height:1".into());
    m.entry("rating-count".into()).or_insert_with(|| 
        "font-size:0.75rem;color:var(--garur-muted)".into());
    m.entry("rating-value".into()).or_insert_with(|| 
        "font-size:0.875rem;font-weight:600;color:var(--garur-fg)".into());
}

fn gen_price(m: &mut FxHashMap<String, String>) {
    m.entry("price".into()).or_insert_with(|| 
        "font-weight:700;font-size:1.5rem;color:var(--garur-fg)".into());
    m.entry("price-lg".into()).or_insert_with(|| 
        "font-weight:800;font-size:2rem;letter-spacing:-0.02em;color:var(--garur-fg)".into());
    m.entry("price-old".into()).or_insert_with(|| 
        "font-size:0.875rem;color:var(--garur-muted);\
         text-decoration:line-through".into());
    m.entry("price-discount".into()).or_insert_with(|| 
        "display:inline-flex;align-items:center;\
         font-size:0.75rem;font-weight:600;\
         color:var(--garur-danger);\
         background:color-mix(in oklab, var(--garur-danger) 15%, transparent);\
         padding:0.125rem 0.375rem;border-radius:0.25rem".into());
}

fn gen_comment(m: &mut FxHashMap<String, String>) {
    m.entry("comment".into()).or_insert_with(|| 
        "display:flex;gap:0.75rem;padding:1rem 0;\
         border-bottom:1px solid var(--garur-border-subtle)".into());
    m.entry("comment-avatar".into()).or_insert_with(|| 
        "width:2rem;height:2rem;flex-shrink:0;\
         border-radius:9999px;overflow:hidden;\
         background:var(--garur-surface-muted)".into());
    m.entry("comment-body".into()).or_insert_with(|| 
        "display:flex;flex-direction:column;gap:0.25rem;flex:1".into());
    m.entry("comment-author".into()).or_insert_with(|| 
        "font-size:0.875rem;font-weight:600;color:var(--garur-fg)".into());
    m.entry("comment-time".into()).or_insert_with(|| 
        "font-size:0.75rem;color:var(--garur-muted)".into());
    m.entry("comment-text".into()).or_insert_with(|| 
        "font-size:0.875rem;line-height:1.6;color:var(--garur-fg)".into());
}

fn gen_testimonial(m: &mut FxHashMap<String, String>) {
    m.entry("testimonial".into()).or_insert_with(|| 
        "display:flex;flex-direction:column;gap:1rem;\
         padding:1.5rem;\
         background:var(--garur-surface);color:var(--garur-fg);\
         border:1px solid var(--garur-border-subtle);\
         border-radius:var(--garur-radius-lg);\
         position:relative".into());
    m.entry("testimonial-quote".into()).or_insert_with(|| 
        "font-size:0.9375rem;line-height:1.7;color:var(--garur-fg);\
         font-style:italic;margin:0".into());
    m.entry("testimonial-author".into()).or_insert_with(|| 
        "display:flex;align-items:center;gap:0.625rem".into());
    m.entry("testimonial-name".into()).or_insert_with(|| 
        "font-size:0.875rem;font-weight:600;color:var(--garur-fg)".into());
    m.entry("testimonial-role".into()).or_insert_with(|| 
        "font-size:0.75rem;color:var(--garur-muted)".into());
}

fn gen_post(m: &mut FxHashMap<String, String>) {
    m.entry("post-card".into()).or_insert_with(|| 
        "display:flex;flex-direction:column;gap:1rem;\
         padding:1.5rem;\
         background:var(--garur-surface);color:var(--garur-fg);\
         border:1px solid var(--garur-border-subtle);\
         border-radius:var(--garur-radius-lg);\
         transition:transform 200ms ease, box-shadow 200ms ease;\
         &:hover { transform:translateY(-2px);\
                   box-shadow:var(--garur-shadow-lg); }".into());
    m.entry("post-meta".into()).or_insert_with(|| 
        "display:flex;align-items:center;gap:0.75rem;\
         font-size:0.75rem;color:var(--garur-muted)".into());
    m.entry("post-title".into()).or_insert_with(|| 
        "font-size:1.125rem;font-weight:700;line-height:1.3;\
         letter-spacing:-0.01em;color:var(--garur-fg)".into());
    m.entry("post-excerpt".into()).or_insert_with(|| 
        "font-size:0.9375rem;line-height:1.6;color:var(--garur-muted)".into());
}

fn gen_divider_text(m: &mut FxHashMap<String, String>) {
    m.entry("divider-text".into()).or_insert_with(|| 
        "display:flex;align-items:center;gap:0.75rem;\
         color:var(--garur-muted);font-size:0.75rem;\
         text-transform:uppercase;letter-spacing:0.05em;font-weight:500;\
         &::before, &::after { content:'';flex:1;height:1px;\
                               background:var(--garur-border-subtle); }".into());
}

fn gen_media(m: &mut FxHashMap<String, String>) {
    m.entry("video-wrapper".into()).or_insert_with(|| 
        "position:relative;width:100%;aspect-ratio:16/9;\
         overflow:hidden;border-radius:var(--garur-radius);\
         background:#000".into());
    m.entry("image-cover".into()).or_insert_with(|| 
        "width:100%;height:100%;object-fit:cover;display:block".into());
    m.entry("gallery".into()).or_insert_with(|| 
        "display:grid;\
         grid-template-columns:repeat(auto-fill, minmax(8rem, 1fr));\
         gap:0.5rem".into());
    m.entry("gallery-item".into()).or_insert_with(|| 
        "position:relative;aspect-ratio:1/1;\
         overflow:hidden;border-radius:var(--garur-radius);\
         cursor:pointer".into());
    m.entry("gallery-overlay".into()).or_insert_with(|| 
        "position:absolute;inset:0;\
         background:linear-gradient(to top, rgb(0 0 0 / 0.6), transparent 50%);\
         opacity:0;transition:opacity 200ms ease;\
         display:flex;align-items:flex-end;padding:0.75rem;\
         color:#fff;font-size:0.75rem".into());
}

fn gen_loader(m: &mut FxHashMap<String, String>) {
    m.entry("loader".into()).or_insert_with(|| 
        "display:inline-block;width:1.5rem;height:1.5rem;\
         border:2px solid color-mix(in oklab, currentColor 20%, transparent);\
         border-top-color:currentColor;border-radius:9999px;\
         animation:garur-spin 0.8s linear infinite".into());
    m.entry("loader-lg".into()).or_insert_with(|| 
        "display:inline-block;width:2.5rem;height:2.5rem;\
         border:3px solid color-mix(in oklab, currentColor 20%, transparent);\
         border-top-color:currentColor;border-radius:9999px;\
         animation:garur-spin 0.9s linear infinite".into());
    m.entry("loading-overlay".into()).or_insert_with(|| 
        "position:absolute;inset:0;z-index:30;\
         display:grid;place-items:center;\
         background:color-mix(in oklab, var(--garur-surface) 80%, transparent);\
         backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px)".into());
    m.entry("loading-dots".into()).or_insert_with(|| 
        "display:inline-flex;gap:0.25rem;\
         & > span { width:0.375rem;height:0.375rem;border-radius:9999px;\
                    background:currentColor;\
                    animation:garur-pulse 1.4s ease-in-out infinite; }\
         & > span:nth-child(2) { animation-delay:0.2s; }\
         & > span:nth-child(3) { animation-delay:0.4s; }".into());
}

fn gen_states(m: &mut FxHashMap<String, String>) {
    m.entry("error-state".into()).or_insert_with(|| 
        "display:flex;flex-direction:column;align-items:center;\
         justify-content:center;gap:0.75rem;\
         padding:3rem 1.5rem;text-align:center;\
         color:var(--garur-danger)".into());
    m.entry("success-state".into()).or_insert_with(|| 
        "display:flex;flex-direction:column;align-items:center;\
         justify-content:center;gap:0.75rem;\
         padding:3rem 1.5rem;text-align:center;\
         color:var(--garur-success)".into());
    m.entry("empty-state-icon".into()).or_insert_with(|| 
        "display:flex;flex-direction:column;align-items:center;\
         justify-content:center;gap:1rem;\
         padding:3rem 1.5rem;text-align:center;\
         color:var(--garur-muted);\
         & > svg, & > .icon { width:3rem;height:3rem;opacity:0.5; }".into());
}

fn gen_responsive(m: &mut FxHashMap<String, String>) {
    m.entry("stack-mobile".into()).or_insert_with(|| 
        "display:flex;flex-direction:column;gap:1rem;\
         @media (min-width: 768px) { flex-direction:row; }".into());
    m.entry("hide-mobile".into()).or_insert_with(|| 
        "display:none;\
         @media (min-width: 768px) { display:block; }".into());
    m.entry("show-mobile".into()).or_insert_with(|| 
        "display:block;\
         @media (min-width: 768px) { display:none; }".into());
    m.entry("only-mobile".into()).or_insert_with(|| 
        "display:block;\
         @media (min-width: 768px) { display:none !important; }".into());
    m.entry("hide-desktop".into()).or_insert_with(|| 
        "display:block;\
         @media (min-width: 1024px) { display:none; }".into());
}