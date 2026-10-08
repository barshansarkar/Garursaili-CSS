// ═══════════════════════════════════════════════════════════════════
// GarurSaili-CSS — primitives.rs
// The Semantic Indian CSS Framework
// Author: Barshan Sarkar · Malda, West Bengal, India
// Version: 1.4.0
// ═══════════════════════════════════════════════════════════════════
//
// primitives.rs — Complete semantic primitive system
// ═══════════════════════════════════════════════════════════════════
//
// All primitives:
//   • Use CSS variables → runtime themeable
//   • Include `color: var(--garur-fg)` for dark mode safety
//   • COMPOSE with utilities (utilities win in cascade)
//   • Never override existing utilities (or_insert_with)
use rustc_hash::FxHashMap;

pub fn generate(m: &mut FxHashMap<String, String>) {
    gen_layout_shortcuts(m);
    gen_layout_structural(m);
    gen_container(m);
    gen_typography(m);
    gen_surface(m);
    gen_avatar(m);
    gen_divider(m);
    gen_form(m);
    gen_toggle(m);
    gen_feedback(m);
    gen_progress(m);
    gen_overlay(m);
    gen_navigation(m);
    gen_content(m);
    gen_inline(m);
    gen_interactive(m);
    gen_decoration(m);

    // 🆕 TIER B — Extended primitives
    gen_tier_b_primitives(m);
}

// ═══════════════════════════════════════════════════════════════════
// LAYOUT SHORTCUTS
// ═══════════════════════════════════════════════════════════════════

fn gen_layout_shortcuts(m: &mut FxHashMap<String, String>) {
    // Flex row
    m.entry("row".into()).or_insert_with(|| 
        "display:flex;flex-direction:row".into());

    m.entry("row-center".into()).or_insert_with(|| 
        "display:flex;flex-direction:row;align-items:center;justify-content:center".into());

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

    // Vertical stack
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

    // Cluster (wrap)
    m.entry("cluster".into()).or_insert_with(|| 
        "display:flex;flex-direction:row;flex-wrap:wrap".into());

    m.entry("cluster-center".into()).or_insert_with(|| 
        "display:flex;flex-direction:row;flex-wrap:wrap;align-items:center;justify-content:center".into());

    // Hstack / vstack (with gap)
    m.entry("hstack".into()).or_insert_with(|| 
        "display:flex;flex-direction:row;align-items:center;gap:0.5rem".into());

    m.entry("vstack".into()).or_insert_with(|| 
        "display:flex;flex-direction:column;gap:0.5rem".into());

    // Center both axes (grid-based)
    m.entry("center".into()).or_insert_with(|| 
        "display:grid;place-items:center".into());

    m.entry("center-x".into()).or_insert_with(|| 
        "margin-inline:auto".into());

    // Grid shortcuts
    for n in 1..=12 {
        m.entry(format!("grid-{}", n)).or_insert_with(|| 
            format!("display:grid;grid-template-columns:repeat({}, minmax(0, 1fr))", n));
    }

    m.entry("grid-auto".into()).or_insert_with(|| 
        "display:grid;grid-template-columns:repeat(auto-fit, minmax(var(--garur-grid-min, 16rem), 1fr))".into());

    m.entry("grid-auto-fill".into()).or_insert_with(|| 
        "display:grid;grid-template-columns:repeat(auto-fill, minmax(var(--garur-grid-min, 16rem), 1fr))".into());

    m.entry("split".into()).or_insert_with(|| 
        "display:grid;grid-template-columns:1fr 1fr".into());

    m.entry("spacer".into()).or_insert_with(|| "flex:1 1 auto".into());
}

// ═══════════════════════════════════════════════════════════════════
// LAYOUT STRUCTURAL
// ═══════════════════════════════════════════════════════════════════

fn gen_layout_structural(m: &mut FxHashMap<String, String>) {
    m.entry("main".into()).or_insert_with(|| 
        "display:block;width:100%;flex:1 1 auto".into());

    m.entry("aside".into()).or_insert_with(|| 
        "display:block;flex-shrink:0".into());

    // Section with padding
    m.entry("section".into()).or_insert_with(|| 
        "display:block;padding-block:var(--garur-section-py, 5rem)".into());

    m.entry("section-sm".into()).or_insert_with(|| 
        "display:block;padding-block:3rem".into());

    m.entry("section-lg".into()).or_insert_with(|| 
        "display:block;padding-block:7rem".into());

    m.entry("page-section".into()).or_insert_with(|| 
        "display:block;padding-block:var(--garur-section-py, 5rem)".into());

    // Hero section
    m.entry("hero".into()).or_insert_with(|| 
        "display:flex;flex-direction:column;align-items:center;justify-content:center;\
         text-align:center;padding-block:var(--garur-hero-py, 6rem);min-height:60vh".into());

    m.entry("hero-sm".into()).or_insert_with(|| 
        "display:flex;flex-direction:column;align-items:center;justify-content:center;\
         text-align:center;padding-block:4rem;min-height:40vh".into());

    m.entry("hero-lg".into()).or_insert_with(|| 
        "display:flex;flex-direction:column;align-items:center;justify-content:center;\
         text-align:center;padding-block:10rem;min-height:80vh".into());

    // Cover patterns
    m.entry("cover".into()).or_insert_with(|| 
        "position:absolute;inset:0".into());

    m.entry("fixed-cover".into()).or_insert_with(|| 
        "position:fixed;inset:0".into());

    m.entry("fixed-center".into()).or_insert_with(|| 
        "position:fixed;inset:0;display:grid;place-items:center;z-index:50".into());

    m.entry("abs-center".into()).or_insert_with(|| 
        "position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)".into());

    // Sticky / scroll
    m.entry("sticky-top".into()).or_insert_with(|| 
        "position:sticky;top:0;z-index:40".into());

    m.entry("scroll-y".into()).or_insert_with(|| 
        "overflow-y:auto;overscroll-behavior:contain".into());

    m.entry("scroll-x".into()).or_insert_with(|| 
        "overflow-x:auto;overscroll-behavior:contain".into());

    // Aspect ratios
    m.entry("aspect-square".into()).or_insert_with(|| "aspect-ratio:1 / 1".into());
    m.entry("aspect-video".into()).or_insert_with(|| "aspect-ratio:16 / 9".into());
    m.entry("aspect-photo".into()).or_insert_with(|| "aspect-ratio:4 / 3".into());
}

// ═══════════════════════════════════════════════════════════════════
// CONTAINER
// ═══════════════════════════════════════════════════════════════════

fn gen_container(m: &mut FxHashMap<String, String>) {
    let base = "width:100%;margin-inline:auto;padding-inline:var(--garur-container-px, 1rem)";

    m.entry("container".into()).or_insert_with(|| 
        format!("{};max-width:var(--garur-container-max, 1280px)", base));

    m.entry("container-sm".into()).or_insert_with(|| 
        format!("{};max-width:640px", base));

    m.entry("container-md".into()).or_insert_with(|| 
        format!("{};max-width:768px", base));

    m.entry("container-lg".into()).or_insert_with(|| 
        format!("{};max-width:1024px", base));

    m.entry("container-xl".into()).or_insert_with(|| 
        format!("{};max-width:1280px", base));

    m.entry("container-2xl".into()).or_insert_with(|| 
        format!("{};max-width:1536px", base));

    m.entry("container-fluid".into()).or_insert_with(|| 
        "width:100%;padding-inline:var(--garur-container-px, 1rem)".into());

    m.entry("container-pad".into()).or_insert_with(|| 
        "padding-inline:var(--garur-container-px, 1rem)".into());
}

// ═══════════════════════════════════════════════════════════════════
// TYPOGRAPHY
// ═══════════════════════════════════════════════════════════════════

fn gen_typography(m: &mut FxHashMap<String, String>) {
    // Page / hero typography
    m.entry("page-title".into()).or_insert_with(|| 
        "font-size:clamp(2.25rem, 5vw, 3.75rem);font-weight:700;\
         line-height:1.05;letter-spacing:-0.02em;color:var(--garur-fg)".into());

    m.entry("page-subtitle".into()).or_insert_with(|| 
        "font-size:1.125rem;line-height:1.6;color:var(--garur-muted);max-width:42rem".into());

    m.entry("hero-title".into()).or_insert_with(|| 
        "font-size:clamp(3rem, 8vw, 6rem);font-weight:800;\
         line-height:1;letter-spacing:-0.03em;color:var(--garur-fg)".into());

    m.entry("hero-subtitle".into()).or_insert_with(|| 
        "font-size:1.25rem;line-height:1.6;color:var(--garur-muted);max-width:42rem".into());

    // Section typography
    m.entry("section-title".into()).or_insert_with(|| 
        "font-size:clamp(1.75rem, 3vw, 2.5rem);font-weight:700;\
         line-height:1.15;letter-spacing:-0.01em;color:var(--garur-fg)".into());

    m.entry("section-subtitle".into()).or_insert_with(|| 
        "font-size:1rem;line-height:1.5;color:var(--garur-muted)".into());

    // Card typography
    m.entry("card-title".into()).or_insert_with(|| 
        "font-size:1.125rem;font-weight:600;line-height:1.3;\
         margin-bottom:0.5rem;color:var(--garur-fg)".into());

    m.entry("card-text".into()).or_insert_with(|| 
        "font-size:0.875rem;line-height:1.6;color:var(--garur-muted)".into());

    // Stat typography
    m.entry("stat-value".into()).or_insert_with(|| 
        "font-size:2rem;font-weight:700;line-height:1.1;color:var(--garur-fg)".into());

    m.entry("stat-label".into()).or_insert_with(|| 
        "font-size:0.75rem;text-transform:uppercase;letter-spacing:0.05em;\
         color:var(--garur-muted);font-weight:500".into());

    m.entry("stat-change".into()).or_insert_with(|| 
        "font-size:0.75rem;font-weight:500".into());

    // Semantic text colors
    m.entry("muted".into()).or_insert_with(|| "color:var(--garur-muted)".into());
    m.entry("subtle".into()).or_insert_with(|| "color:var(--garur-subtle, #94a3b8)".into());
    m.entry("hint".into()).or_insert_with(|| "color:var(--garur-hint, #cbd5e1)".into());
}

// ═══════════════════════════════════════════════════════════════════
// SURFACE
// ═══════════════════════════════════════════════════════════════════

fn gen_surface(m: &mut FxHashMap<String, String>) {
    m.entry("card".into()).or_insert_with(|| 
        "background-color:var(--garur-surface);color:var(--garur-fg);\
         border:1px solid var(--garur-border-subtle);\
         border-radius:var(--garur-radius);\
         padding:var(--garur-card-p, 1.5rem);\
         box-shadow:var(--garur-shadow-sm)".into());

    m.entry("card-flat".into()).or_insert_with(|| 
        "background-color:var(--garur-surface);color:var(--garur-fg);\
         border:1px solid var(--garur-border-subtle);\
         border-radius:var(--garur-radius);\
         padding:var(--garur-card-p, 1.5rem);box-shadow:none".into());

    m.entry("card-raised".into()).or_insert_with(|| 
        "background-color:var(--garur-surface);color:var(--garur-fg);\
         border:1px solid var(--garur-border-subtle);\
         border-radius:var(--garur-radius);\
         padding:var(--garur-card-p, 1.5rem);\
         box-shadow:var(--garur-shadow-lg)".into());

    m.entry("card-interactive".into()).or_insert_with(|| 
        "background-color:var(--garur-surface);color:var(--garur-fg);\
         border:1px solid var(--garur-border-subtle);\
         border-radius:var(--garur-radius);\
         padding:var(--garur-card-p, 1.5rem);\
         box-shadow:var(--garur-shadow-sm);\
         transition:box-shadow 200ms ease, transform 200ms ease;\
         cursor:pointer;\
         &:hover { box-shadow:var(--garur-shadow-lg); transform:translateY(-2px); }".into());

    m.entry("card-glass".into()).or_insert_with(|| 
        "background-color:color-mix(in oklab, var(--garur-surface) 70%, transparent);\
         backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);\
         border:1px solid color-mix(in oklab, var(--garur-border-subtle) 60%, transparent);\
         border-radius:var(--garur-radius);\
         padding:var(--garur-card-p, 1.5rem);color:var(--garur-fg)".into());

    m.entry("surface".into()).or_insert_with(|| 
        "background-color:var(--garur-surface);color:var(--garur-fg);\
         border:1px solid var(--garur-border-subtle);\
         border-radius:var(--garur-radius)".into());

    m.entry("surface-muted".into()).or_insert_with(|| 
        "background-color:var(--garur-surface-muted);color:var(--garur-fg);\
         border:1px solid var(--garur-border-subtle);\
         border-radius:var(--garur-radius)".into());

    m.entry("surface-glass".into()).or_insert_with(|| 
        "background-color:color-mix(in oklab, var(--garur-surface) 70%, transparent);\
         backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);\
         border:1px solid color-mix(in oklab, var(--garur-border-subtle) 60%, transparent)".into());
}

// ═══════════════════════════════════════════════════════════════════
// AVATAR
// ═══════════════════════════════════════════════════════════════════

fn gen_avatar(m: &mut FxHashMap<String, String>) {
    m.entry("avatar".into()).or_insert_with(|| 
        "display:inline-flex;align-items:center;justify-content:center;\
         width:2.5rem;height:2.5rem;border-radius:9999px;overflow:hidden;\
         flex-shrink:0;background-color:var(--garur-surface-muted);\
         color:var(--garur-fg);font-weight:500;font-size:0.875rem".into());

    m.entry("avatar-sm".into()).or_insert_with(|| 
        "width:2rem;height:2rem;font-size:0.75rem".into());

    m.entry("avatar-lg".into()).or_insert_with(|| 
        "width:3.5rem;height:3.5rem;font-size:1.125rem".into());

    m.entry("avatar-xl".into()).or_insert_with(|| 
        "width:4.5rem;height:4.5rem;font-size:1.25rem".into());

    m.entry("avatar-square".into()).or_insert_with(|| 
        "border-radius:var(--garur-radius)".into());

    m.entry("avatar-ring".into()).or_insert_with(|| 
        "padding:2px;border-radius:9999px;\
         background:linear-gradient(135deg, var(--garur-primary), var(--garur-accent, #e54cb5))".into());

    m.entry("avatar-group".into()).or_insert_with(|| 
        "display:inline-flex;\
         & > *:not(:first-child) { margin-left:-0.5rem; }\
         & > * { border:2px solid var(--garur-surface); }".into());
}

// ═══════════════════════════════════════════════════════════════════
// DIVIDER
// ═══════════════════════════════════════════════════════════════════

fn gen_divider(m: &mut FxHashMap<String, String>) {
    m.entry("divider".into()).or_insert_with(|| 
        "display:block;height:1px;width:100%;border:none;\
         background-color:var(--garur-border-subtle);margin-block:1rem".into());

    m.entry("divider-vertical".into()).or_insert_with(|| 
        "display:inline-block;width:1px;height:1em;border:none;\
         background-color:var(--garur-border-subtle);\
         margin-inline:0.5rem;vertical-align:middle".into());

    m.entry("divider-dashed".into()).or_insert_with(|| 
        "display:block;height:0;width:100%;border:none;\
         border-top:1px dashed var(--garur-border-subtle);margin-block:1rem".into());

    m.entry("divider-dotted".into()).or_insert_with(|| 
        "display:block;height:0;width:100%;border:none;\
         border-top:1px dotted var(--garur-border-subtle);margin-block:1rem".into());
}

// ═══════════════════════════════════════════════════════════════════
// FORM
// ═══════════════════════════════════════════════════════════════════

fn gen_form(m: &mut FxHashMap<String, String>) {
    // Buttons
    m.entry("btn".into()).or_insert_with(|| 
        "display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;\
         padding:var(--garur-btn-py, 0.5rem) var(--garur-btn-px, 1rem);\
         border-radius:var(--garur-radius);\
         font-weight:500;font-size:var(--garur-btn-fs, 0.875rem);line-height:1;\
         cursor:pointer;user-select:none;text-decoration:none;\
         transition:background-color 150ms ease, color 150ms ease, border-color 150ms ease".into());

    m.entry("btn-primary".into()).or_insert_with(|| 
        "background-color:var(--garur-primary);color:var(--garur-primary-fg);\
         border:1px solid transparent".into());

    m.entry("btn-secondary".into()).or_insert_with(|| 
        "background-color:var(--garur-surface-muted);color:var(--garur-fg);\
         border:1px solid var(--garur-border-subtle)".into());

    m.entry("btn-ghost".into()).or_insert_with(|| 
        "background-color:transparent;color:var(--garur-fg);\
         border:1px solid transparent".into());

    m.entry("btn-outline".into()).or_insert_with(|| 
        "background-color:transparent;color:var(--garur-primary);\
         border:1px solid var(--garur-primary)".into());

    m.entry("btn-danger".into()).or_insert_with(|| 
        "background-color:var(--garur-danger);color:var(--garur-danger-fg);\
         border:1px solid transparent".into());

    m.entry("btn-success".into()).or_insert_with(|| 
        "background-color:var(--garur-success);color:var(--garur-success-fg);\
         border:1px solid transparent".into());

    m.entry("btn-warning".into()).or_insert_with(|| 
        "background-color:var(--garur-warning);color:var(--garur-warning-fg);\
         border:1px solid transparent".into());

    m.entry("btn-info".into()).or_insert_with(|| 
        "background-color:var(--garur-info);color:var(--garur-info-fg);\
         border:1px solid transparent".into());

    m.entry("btn-sm".into()).or_insert_with(|| 
        "padding:0.375rem 0.75rem;font-size:0.8125rem".into());

    m.entry("btn-lg".into()).or_insert_with(|| 
        "padding:0.75rem 1.5rem;font-size:1.0625rem".into());

    m.entry("btn-icon".into()).or_insert_with(|| 
        "padding:0.5rem;aspect-ratio:1/1".into());

    m.entry("btn-icon-sm".into()).or_insert_with(|| 
        "padding:0.375rem;aspect-ratio:1/1;font-size:0.8125rem".into());

    m.entry("btn-block".into()).or_insert_with(|| "width:100%".into());

    // Inputs
    m.entry("input".into()).or_insert_with(|| 
        "display:block;width:100%;\
         padding:var(--garur-input-py, 0.5rem) var(--garur-input-px, 0.75rem);\
         background-color:var(--garur-surface);color:var(--garur-fg);\
         border:1px solid var(--garur-border-subtle);\
         border-radius:var(--garur-radius);\
         font-size:var(--garur-input-fs, 0.875rem);line-height:1.5;\
         transition:border-color 150ms ease, box-shadow 150ms ease;\
         &:focus { outline:none; border-color:var(--garur-primary);\
                   box-shadow:0 0 0 3px color-mix(in oklab, var(--garur-primary) 20%, transparent); }".into());

    m.entry("input-error".into()).or_insert_with(|| 
        "border-color:var(--garur-danger);\
         &:focus { border-color:var(--garur-danger);\
                   box-shadow:0 0 0 3px color-mix(in oklab, var(--garur-danger) 20%, transparent); }".into());

    m.entry("input-sm".into()).or_insert_with(|| 
        "padding:0.25rem 0.5rem;font-size:0.8125rem".into());

    m.entry("input-lg".into()).or_insert_with(|| 
        "padding:0.75rem 1rem;font-size:1rem".into());

    m.entry("textarea".into()).or_insert_with(|| 
        "display:block;width:100%;\
         padding:var(--garur-input-py, 0.5rem) var(--garur-input-px, 0.75rem);\
         background-color:var(--garur-surface);color:var(--garur-fg);\
         border:1px solid var(--garur-border-subtle);\
         border-radius:var(--garur-radius);\
         font-size:var(--garur-input-fs, 0.875rem);line-height:1.5;\
         resize:vertical;min-height:6rem".into());

    m.entry("select".into()).or_insert_with(|| 
        "display:block;width:100%;\
         padding:var(--garur-input-py, 0.5rem) var(--garur-input-px, 0.75rem);\
         background-color:var(--garur-surface);color:var(--garur-fg);\
         border:1px solid var(--garur-border-subtle);\
         border-radius:var(--garur-radius);\
         font-size:var(--garur-input-fs, 0.875rem)".into());

    // Labels & fields
    m.entry("label".into()).or_insert_with(|| 
        "display:block;font-size:0.875rem;font-weight:500;\
         margin-bottom:0.375rem;color:var(--garur-fg)".into());

    m.entry("field".into()).or_insert_with(|| 
        "display:flex;flex-direction:column;gap:0.375rem;margin-bottom:1rem".into());

    m.entry("help-text".into()).or_insert_with(|| 
        "font-size:0.75rem;color:var(--garur-muted);margin-top:0.25rem".into());
}

// ═══════════════════════════════════════════════════════════════════
// TOGGLES
// ═══════════════════════════════════════════════════════════════════

fn gen_toggle(m: &mut FxHashMap<String, String>) {
    m.entry("switch".into()).or_insert_with(|| 
        "position:relative;display:inline-block;appearance:none;\
         width:2.75rem;height:1.5rem;flex-shrink:0;\
         background-color:var(--garur-border-subtle);\
         border-radius:9999px;cursor:pointer;\
         transition:background-color 200ms ease;\
         &::after { content:\"\"; position:absolute; top:2px; left:2px;\
                    width:1.25rem; height:1.25rem; border-radius:9999px;\
                    background:var(--garur-surface);\
                    transition:transform 200ms ease; }\
         &:checked { background-color:var(--garur-primary); }\
         &:checked::after { transform:translateX(1.25rem); }\
         &:focus-visible { outline:2px solid var(--garur-ring-color); outline-offset:2px; }".into());

    m.entry("checkbox".into()).or_insert_with(|| 
        "appearance:none;width:1.125rem;height:1.125rem;flex-shrink:0;\
         border:1.5px solid var(--garur-border-subtle);\
         border-radius:0.25rem;\
         background-color:var(--garur-surface);\
         cursor:pointer;transition:all 150ms ease;\
         &:checked { background-color:var(--garur-primary);\
                     border-color:var(--garur-primary); }\
         &:focus-visible { outline:2px solid var(--garur-ring-color); outline-offset:2px; }".into());

    m.entry("radio".into()).or_insert_with(|| 
        "appearance:none;width:1.125rem;height:1.125rem;flex-shrink:0;\
         border:1.5px solid var(--garur-border-subtle);\
         border-radius:9999px;\
         background-color:var(--garur-surface);\
         cursor:pointer;transition:all 150ms ease;\
         &:checked { border-color:var(--garur-primary);\
                     box-shadow:inset 0 0 0 4px var(--garur-primary); }\
         &:focus-visible { outline:2px solid var(--garur-ring-color); outline-offset:2px; }".into());
}

// ═══════════════════════════════════════════════════════════════════
// FEEDBACK
// ═══════════════════════════════════════════════════════════════════

fn gen_feedback(m: &mut FxHashMap<String, String>) {
    m.entry("badge".into()).or_insert_with(|| 
        "display:inline-flex;align-items:center;gap:0.25rem;\
         padding:0.125rem 0.5rem;border-radius:9999px;\
         font-size:0.75rem;font-weight:500;line-height:1.25".into());

    m.entry("badge-primary".into()).or_insert_with(|| 
        "background-color:color-mix(in oklab, var(--garur-primary) 15%, transparent);\
         color:var(--garur-primary)".into());

    m.entry("badge-success".into()).or_insert_with(|| 
        "background-color:color-mix(in oklab, var(--garur-success) 15%, transparent);\
         color:var(--garur-success)".into());

    m.entry("badge-danger".into()).or_insert_with(|| 
        "background-color:color-mix(in oklab, var(--garur-danger) 15%, transparent);\
         color:var(--garur-danger)".into());

    m.entry("badge-warning".into()).or_insert_with(|| 
        "background-color:color-mix(in oklab, var(--garur-warning) 15%, transparent);\
         color:var(--garur-warning)".into());

    m.entry("badge-info".into()).or_insert_with(|| 
        "background-color:color-mix(in oklab, var(--garur-info) 15%, transparent);\
         color:var(--garur-info)".into());

    m.entry("badge-muted".into()).or_insert_with(|| 
        "background-color:var(--garur-surface-muted);color:var(--garur-muted)".into());

    m.entry("badge-dot".into()).or_insert_with(|| 
        "width:0.5rem;height:0.5rem;padding:0;border-radius:9999px".into());

    m.entry("chip".into()).or_insert_with(|| 
        "display:inline-flex;align-items:center;gap:0.375rem;\
         padding:0.25rem 0.75rem;border-radius:9999px;\
         background-color:var(--garur-surface-muted);\
         color:var(--garur-fg);font-size:0.875rem".into());

    m.entry("alert".into()).or_insert_with(|| 
        "padding:1rem;border-radius:var(--garur-radius);\
         border:1px solid var(--garur-border-subtle);\
         background-color:var(--garur-surface);color:var(--garur-fg)".into());

    m.entry("alert-info".into()).or_insert_with(|| 
        "border-color:var(--garur-info);\
         background-color:color-mix(in oklab, var(--garur-info) 10%, transparent)".into());

    m.entry("alert-success".into()).or_insert_with(|| 
        "border-color:var(--garur-success);\
         background-color:color-mix(in oklab, var(--garur-success) 10%, transparent)".into());

    m.entry("alert-danger".into()).or_insert_with(|| 
        "border-color:var(--garur-danger);\
         background-color:color-mix(in oklab, var(--garur-danger) 10%, transparent)".into());

    m.entry("alert-warning".into()).or_insert_with(|| 
        "border-color:var(--garur-warning);\
         background-color:color-mix(in oklab, var(--garur-warning) 10%, transparent)".into());

    m.entry("toast".into()).or_insert_with(|| 
        "display:flex;align-items:center;gap:0.75rem;\
         padding:0.875rem 1rem;\
         background-color:var(--garur-surface);color:var(--garur-fg);\
         border:1px solid var(--garur-border-subtle);\
         border-radius:var(--garur-radius);\
         box-shadow:var(--garur-shadow-lg);font-size:0.875rem".into());

    m.entry("toast-success".into()).or_insert_with(|| 
        "border-left:3px solid var(--garur-success)".into());

    m.entry("toast-danger".into()).or_insert_with(|| 
        "border-left:3px solid var(--garur-danger)".into());

    m.entry("toast-info".into()).or_insert_with(|| 
        "border-left:3px solid var(--garur-info)".into());

    m.entry("toast-warning".into()).or_insert_with(|| 
        "border-left:3px solid var(--garur-warning)".into());
}

// ═══════════════════════════════════════════════════════════════════
// PROGRESS / SPINNER / SKELETON
// ═══════════════════════════════════════════════════════════════════

fn gen_progress(m: &mut FxHashMap<String, String>) {
    m.entry("progress".into()).or_insert_with(|| 
        "width:100%;height:0.5rem;\
         background-color:var(--garur-surface-muted);\
         border-radius:9999px;overflow:hidden".into());

    m.entry("progress-bar".into()).or_insert_with(|| 
        "height:100%;background-color:var(--garur-primary);\
         border-radius:inherit;transition:width 300ms ease".into());

    m.entry("progress-success".into()).or_insert_with(|| 
        "background-color:var(--garur-success)".into());

    m.entry("progress-danger".into()).or_insert_with(|| 
        "background-color:var(--garur-danger)".into());

    m.entry("progress-lg".into()).or_insert_with(|| "height:0.75rem".into());
    m.entry("progress-sm".into()).or_insert_with(|| "height:0.25rem".into());

    m.entry("spinner".into()).or_insert_with(|| 
        "display:inline-block;width:1.25rem;height:1.25rem;\
         border:2px solid color-mix(in oklab, currentColor 20%, transparent);\
         border-top-color:currentColor;\
         border-radius:9999px;\
         animation:garur-spin 0.6s linear infinite".into());

    m.entry("spinner-sm".into()).or_insert_with(|| 
        "width:0.875rem;height:0.875rem;border-width:1.5px".into());

    m.entry("spinner-lg".into()).or_insert_with(|| 
        "width:2rem;height:2rem;border-width:3px".into());

    m.entry("skeleton".into()).or_insert_with(|| 
        "background:linear-gradient(90deg,\
           color-mix(in oklab, var(--garur-surface-muted) 100%, transparent) 0%,\
           color-mix(in oklab, var(--garur-surface-muted) 60%, white) 50%,\
           color-mix(in oklab, var(--garur-surface-muted) 100%, transparent) 100%);\
         background-size:200% 100%;\
         border-radius:var(--garur-radius);\
         animation:garur-shimmer 1.5s ease-in-out infinite".into());

    m.entry("skeleton-text".into()).or_insert_with(|| 
        "height:1em;border-radius:0.25rem".into());

    m.entry("skeleton-circle".into()).or_insert_with(|| 
        "border-radius:9999px".into());
}

// ═══════════════════════════════════════════════════════════════════
// OVERLAY
// ═══════════════════════════════════════════════════════════════════

fn gen_overlay(m: &mut FxHashMap<String, String>) {
    m.entry("overlay".into()).or_insert_with(|| 
        "position:fixed;inset:0;z-index:50;\
         display:grid;place-items:center;\
         background-color:rgb(0 0 0 / 0.5);\
         backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px)".into());

    m.entry("modal".into()).or_insert_with(|| 
        "position:relative;width:100%;max-width:32rem;\
         padding:1.5rem;\
         background-color:var(--garur-surface);color:var(--garur-fg);\
         border-radius:var(--garur-radius-lg, 0.75rem);\
         box-shadow:var(--garur-shadow-xl)".into());

    m.entry("modal-sm".into()).or_insert_with(|| "max-width:24rem".into());
    m.entry("modal-lg".into()).or_insert_with(|| "max-width:48rem".into());
    m.entry("modal-full".into()).or_insert_with(|| 
        "max-width:none;width:calc(100% - 2rem);max-height:calc(100vh - 2rem)".into());

    m.entry("tooltip".into()).or_insert_with(|| 
        "position:relative;\
         &::after { content:attr(data-tooltip); position:absolute; bottom:100%; left:50%;\
                    transform:translateX(-50%) translateY(-6px);\
                    padding:0.375rem 0.625rem; border-radius:0.375rem;\
                    background:var(--garur-fg); color:var(--garur-surface);\
                    font-size:0.75rem; white-space:nowrap; pointer-events:none;\
                    opacity:0; transition:opacity 150ms; }\
         &:hover::after { opacity:1; }".into());

    m.entry("dropdown".into()).or_insert_with(|| 
        "position:relative;display:inline-block".into());

    m.entry("dropdown-menu".into()).or_insert_with(|| 
        "position:absolute;top:100%;right:0;min-width:12rem;\
         margin-top:0.5rem;padding:0.25rem;\
         background-color:var(--garur-surface);color:var(--garur-fg);\
         border:1px solid var(--garur-border-subtle);\
         border-radius:var(--garur-radius);\
         box-shadow:var(--garur-shadow-lg);z-index:50".into());

    m.entry("dropdown-item".into()).or_insert_with(|| 
        "display:flex;align-items:center;gap:0.5rem;\
         padding:0.5rem 0.75rem;border-radius:calc(var(--garur-radius) - 2px);\
         font-size:0.875rem;cursor:pointer;color:var(--garur-fg);\
         text-decoration:none;transition:background-color 100ms ease;\
         &:hover { background-color:var(--garur-surface-muted); }".into());
}

// ═══════════════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════════════

fn gen_navigation(m: &mut FxHashMap<String, String>) {
    m.entry("navbar".into()).or_insert_with(|| 
        "display:flex;align-items:center;justify-content:space-between;\
         padding-block:var(--garur-navbar-py, 0.75rem);\
         padding-inline:var(--garur-container-px, 1rem);\
         background-color:var(--garur-surface);color:var(--garur-fg);\
         border-bottom:1px solid var(--garur-border-subtle)".into());

    m.entry("navbar-sticky".into()).or_insert_with(|| 
        "position:sticky;top:0;z-index:40;\
         backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);\
         background-color:color-mix(in oklab, var(--garur-surface) 80%, transparent)".into());

    m.entry("navbar-brand".into()).or_insert_with(|| 
        "display:flex;align-items:center;gap:0.5rem;\
         font-weight:700;font-size:1.125rem;color:var(--garur-fg);\
         text-decoration:none".into());

    m.entry("navbar-link".into()).or_insert_with(|| 
        "padding:0.5rem 0.75rem;border-radius:var(--garur-radius);\
         font-size:0.875rem;font-weight:500;color:var(--garur-fg);\
         text-decoration:none;transition:background-color 150ms ease;\
         &:hover { background-color:var(--garur-surface-muted); }".into());

    m.entry("site-header".into()).or_insert_with(|| "display:block;width:100%".into());

    m.entry("site-footer".into()).or_insert_with(|| 
        "display:block;width:100%;padding-block:3rem;\
         border-top:1px solid var(--garur-border-subtle);\
         color:var(--garur-muted)".into());

    m.entry("sidebar".into()).or_insert_with(|| 
        "display:flex;flex-direction:column;gap:0.25rem;\
         width:16rem;padding:1rem;\
         background-color:var(--garur-surface);color:var(--garur-fg);\
         border-right:1px solid var(--garur-border-subtle)".into());

    m.entry("sidebar-item".into()).or_insert_with(|| 
        "display:flex;align-items:center;gap:0.75rem;\
         padding:0.5rem 0.75rem;border-radius:var(--garur-radius);\
         font-size:0.875rem;color:var(--garur-fg);\
         text-decoration:none;cursor:pointer;\
         transition:background-color 150ms ease;\
         &:hover { background-color:var(--garur-surface-muted); }".into());

    m.entry("sidebar-item-active".into()).or_insert_with(|| 
        "background-color:color-mix(in oklab, var(--garur-primary) 12%, transparent);\
         color:var(--garur-primary);font-weight:500".into());

    m.entry("breadcrumb".into()).or_insert_with(|| 
        "display:flex;align-items:center;gap:0.5rem;\
         font-size:0.875rem;color:var(--garur-muted)".into());

    m.entry("breadcrumb-item".into()).or_insert_with(|| 
        "color:inherit;text-decoration:none;transition:color 150ms ease;\
         &:hover { color:var(--garur-fg); }".into());

    m.entry("breadcrumb-sep".into()).or_insert_with(|| 
        "color:var(--garur-border-subtle);user-select:none".into());

    m.entry("breadcrumb-current".into()).or_insert_with(|| 
        "color:var(--garur-fg);font-weight:500".into());

    m.entry("pagination".into()).or_insert_with(|| 
        "display:inline-flex;align-items:center;gap:0.25rem".into());

    m.entry("page-item".into()).or_insert_with(|| 
        "display:inline-flex;align-items:center;justify-content:center;\
         min-width:2.25rem;height:2.25rem;padding-inline:0.5rem;\
         border-radius:var(--garur-radius);\
         font-size:0.875rem;color:var(--garur-fg);\
         text-decoration:none;cursor:pointer;\
         transition:background-color 150ms ease;\
         &:hover { background-color:var(--garur-surface-muted); }".into());

    m.entry("page-item-active".into()).or_insert_with(|| 
        "background-color:var(--garur-primary);color:var(--garur-primary-fg)".into());

    m.entry("tabs".into()).or_insert_with(|| 
        "display:flex;gap:0.25rem;\
         border-bottom:1px solid var(--garur-border-subtle)".into());

    m.entry("tab".into()).or_insert_with(|| 
        "padding:0.5rem 1rem;border-radius:var(--garur-radius) var(--garur-radius) 0 0;\
         font-size:0.875rem;font-weight:500;color:var(--garur-muted);\
         cursor:pointer;border-bottom:2px solid transparent;\
         margin-bottom:-1px;text-decoration:none;\
         transition:color 150ms ease, border-color 150ms ease;\
         &:hover { color:var(--garur-fg); }".into());

    m.entry("tab-active".into()).or_insert_with(|| 
        "color:var(--garur-primary);border-bottom-color:var(--garur-primary)".into());

    m.entry("stepper".into()).or_insert_with(|| 
        "display:flex;align-items:center;gap:0.5rem".into());

    m.entry("step".into()).or_insert_with(|| 
        "display:flex;align-items:center;gap:0.5rem;\
         font-size:0.875rem;color:var(--garur-muted)".into());

    m.entry("step-active".into()).or_insert_with(|| 
        "color:var(--garur-primary);font-weight:500".into());

    m.entry("step-complete".into()).or_insert_with(|| 
        "color:var(--garur-success)".into());

    m.entry("step-divider".into()).or_insert_with(|| 
        "flex:1;height:1px;background-color:var(--garur-border-subtle)".into());
}

// ═══════════════════════════════════════════════════════════════════
// CONTENT
// ═══════════════════════════════════════════════════════════════════

fn gen_content(m: &mut FxHashMap<String, String>) {
    m.entry("accordion".into()).or_insert_with(|| 
        "width:100%;border:1px solid var(--garur-border-subtle);\
         border-radius:var(--garur-radius);overflow:hidden".into());

    m.entry("accordion-item".into()).or_insert_with(|| 
        "border-bottom:1px solid var(--garur-border-subtle);\
         &:last-child { border-bottom:none; }".into());

    m.entry("accordion-header".into()).or_insert_with(|| 
        "padding:0.875rem 1rem;font-weight:500;cursor:pointer;\
         background-color:var(--garur-surface);color:var(--garur-fg);\
         transition:background-color 150ms ease;\
         &:hover { background-color:var(--garur-surface-muted); }".into());

    m.entry("accordion-body".into()).or_insert_with(|| 
        "padding:0.875rem 1rem;\
         border-top:1px solid var(--garur-border-subtle);\
         font-size:0.875rem;line-height:1.6".into());

    m.entry("table".into()).or_insert_with(|| 
        "width:100%;border-collapse:collapse;font-size:0.875rem".into());

    m.entry("table-striped".into()).or_insert_with(|| 
        "& tbody tr:nth-child(odd) { \
           background-color:color-mix(in oklab, var(--garur-surface-muted) 50%, transparent); }".into());

    m.entry("table-hover".into()).or_insert_with(|| 
        "& tbody tr { transition:background-color 100ms ease; }\
         & tbody tr:hover { background-color:var(--garur-surface-muted); }".into());

    m.entry("table-bordered".into()).or_insert_with(|| 
        "& th, & td { border:1px solid var(--garur-border-subtle); }".into());

    m.entry("table-cell".into()).or_insert_with(|| 
        "padding:0.5rem 0.75rem;text-align:left;vertical-align:middle".into());

    m.entry("table-head".into()).or_insert_with(|| 
        "font-weight:600;color:var(--garur-fg);\
         background-color:var(--garur-surface-muted)".into());

    m.entry("timeline".into()).or_insert_with(|| 
        "display:flex;flex-direction:column;gap:1rem;\
         padding-inline-start:1.5rem;\
         border-inline-start:2px solid var(--garur-border-subtle)".into());

    m.entry("timeline-item".into()).or_insert_with(|| 
        "position:relative;\
         &::before { content:\"\"; position:absolute; left:-1.9rem; top:0.25rem;\
                    width:0.75rem; height:0.75rem; border-radius:9999px;\
                    background:var(--garur-primary);\
                    border:2px solid var(--garur-surface); }".into());

    m.entry("stat".into()).or_insert_with(|| 
        "display:flex;flex-direction:column;gap:0.25rem".into());

    m.entry("empty-state".into()).or_insert_with(|| 
        "display:flex;flex-direction:column;align-items:center;justify-content:center;\
         padding:3rem 1.5rem;text-align:center;\
         color:var(--garur-muted);gap:0.75rem".into());

    m.entry("rating".into()).or_insert_with(|| 
        "display:inline-flex;gap:0.125rem;\
         color:var(--garur-warning);font-size:1.25rem;line-height:1".into());

    m.entry("prose".into()).or_insert_with(|| 
        "max-width:65ch;color:var(--garur-fg);line-height:1.75;\
         & h1 { font-size:2.25rem;font-weight:700;margin-block:1.5em 0.5em;line-height:1.2; }\
         & h2 { font-size:1.75rem;font-weight:700;margin-block:1.5em 0.5em;line-height:1.3; }\
         & h3 { font-size:1.375rem;font-weight:600;margin-block:1.25em 0.5em; }\
         & h4 { font-size:1.125rem;font-weight:600;margin-block:1.25em 0.5em; }\
         & p { margin-block:1em; }\
         & a { color:var(--garur-primary);text-decoration:underline;text-underline-offset:2px; }\
         & strong { font-weight:600; }\
         & code { font-family:ui-monospace,monospace;font-size:0.875em;\
                  background:var(--garur-surface-muted);padding:0.125rem 0.375rem;\
                  border-radius:0.25rem; }\
         & pre { background:var(--garur-surface-muted);padding:1rem;\
                 border-radius:var(--garur-radius);overflow-x:auto;margin-block:1.25em; }\
         & pre code { background:none;padding:0; }\
         & ul, & ol { margin-block:1em;padding-inline-start:1.5em; }\
         & li { margin-block:0.375em; }\
         & blockquote { border-inline-start:3px solid var(--garur-border-subtle);\
                        padding-inline-start:1rem;font-style:italic;\
                        color:var(--garur-muted);margin-block:1.25em; }\
         & hr { border:none;border-top:1px solid var(--garur-border-subtle);margin-block:2em; }\
         & img { border-radius:var(--garur-radius);margin-block:1.5em;max-width:100%; }".into());
}

// ═══════════════════════════════════════════════════════════════════
// INLINE ELEMENTS
// ═══════════════════════════════════════════════════════════════════

fn gen_inline(m: &mut FxHashMap<String, String>) {
    m.entry("code-inline".into()).or_insert_with(|| 
        "font-family:ui-monospace,SFMono-Regular,Menlo,monospace;\
         font-size:0.875em;\
         background-color:var(--garur-surface-muted);\
         padding:0.125rem 0.375rem;border-radius:0.25rem".into());

    m.entry("code-block".into()).or_insert_with(|| 
        "display:block;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;\
         font-size:0.875rem;line-height:1.6;\
         background-color:var(--garur-surface-muted);\
         padding:1rem;border-radius:var(--garur-radius);overflow-x:auto".into());

    m.entry("link".into()).or_insert_with(|| 
        "color:var(--garur-primary);text-decoration:underline;\
         text-underline-offset:2px;text-decoration-thickness:1px;\
         transition:color 150ms ease;\
         &:hover { color:color-mix(in oklab, var(--garur-primary) 80%, black); }".into());

    m.entry("link-muted".into()).or_insert_with(|| 
        "color:var(--garur-muted);text-decoration:none;\
         transition:color 150ms ease;\
         &:hover { color:var(--garur-fg); }".into());

    m.entry("link-nav".into()).or_insert_with(|| 
        "color:inherit;text-decoration:none;transition:color 150ms ease;\
         &:hover { color:var(--garur-primary); }".into());

    m.entry("kbd".into()).or_insert_with(|| 
        "display:inline-flex;align-items:center;justify-content:center;\
         min-width:1.5rem;height:1.5rem;padding-inline:0.375rem;\
         font-family:ui-monospace,monospace;font-size:0.75rem;\
         background-color:var(--garur-surface-muted);\
         border:1px solid var(--garur-border-subtle);\
         border-bottom-width:2px;border-radius:0.375rem;\
         color:var(--garur-muted)".into());
}

// ═══════════════════════════════════════════════════════════════════
// INTERACTIVE
// ═══════════════════════════════════════════════════════════════════

fn gen_interactive(m: &mut FxHashMap<String, String>) {
    m.entry("interactive-primary".into()).or_insert_with(|| 
        "background-color:var(--garur-primary);color:var(--garur-primary-fg);\
         transition:background-color 150ms ease;cursor:pointer;\
         &:hover { background-color:color-mix(in oklab, var(--garur-primary) 85%, black); }\
         &:active { background-color:color-mix(in oklab, var(--garur-primary) 75%, black); }\
         &:disabled { opacity:0.5; cursor:not-allowed; }".into());

    m.entry("interactive-ghost".into()).or_insert_with(|| 
        "background-color:transparent;color:var(--garur-fg);\
         transition:background-color 150ms ease;cursor:pointer;\
         &:hover { background-color:var(--garur-surface-muted); }\
         &:disabled { opacity:0.5; cursor:not-allowed; }".into());

    m.entry("interactive-danger".into()).or_insert_with(|| 
        "background-color:var(--garur-danger);color:var(--garur-danger-fg);\
         transition:background-color 150ms ease;cursor:pointer;\
         &:hover { background-color:color-mix(in oklab, var(--garur-danger) 85%, black); }\
         &:active { background-color:color-mix(in oklab, var(--garur-danger) 75%, black); }\
         &:disabled { opacity:0.5; cursor:not-allowed; }".into());

    m.entry("focus-ring".into()).or_insert_with(|| 
        "&:focus-visible { outline:2px solid var(--garur-ring-color); outline-offset:2px; }".into());
}

// ═══════════════════════════════════════════════════════════════════
// DECORATION HELPERS (not primitives per se, but reusable)
// ═══════════════════════════════════════════════════════════════════

fn gen_decoration(m: &mut FxHashMap<String, String>) {
    m.entry("glass".into()).or_insert_with(|| 
        "background-color:color-mix(in oklab, var(--garur-surface) 60%, transparent);\
         backdrop-filter:blur(16px) saturate(180%);\
         -webkit-backdrop-filter:blur(16px) saturate(180%);\
         border:1px solid color-mix(in oklab, var(--garur-border-subtle) 60%, transparent)".into());

    m.entry("glow".into()).or_insert_with(|| 
        "box-shadow:0 0 40px -10px color-mix(in oklab, var(--garur-primary) 60%, transparent)".into());

    m.entry("gradient-primary".into()).or_insert_with(|| 
        "background:linear-gradient(135deg, var(--garur-primary), var(--garur-accent, #e54cb5))".into());

    m.entry("gradient-surface".into()).or_insert_with(|| 
        "background:linear-gradient(180deg, var(--garur-surface), var(--garur-surface-muted))".into());

    m.entry("shimmer".into()).or_insert_with(|| 
        "background:linear-gradient(90deg,\
           var(--garur-primary), var(--garur-accent, #e54cb5), var(--garur-warning, #f59e00),\
           var(--garur-primary));\
         background-size:200% 100%;\
         -webkit-background-clip:text;background-clip:text;color:transparent;\
         animation:garur-shimmer-text 8s linear infinite".into());

    m.entry("divider-gap".into()).or_insert_with(|| 
        "display:block;height:1px;width:100%;border:none;\
         background-color:var(--garur-border-subtle);margin-block:1.5rem".into());
}

// ═══════════════════════════════════════════════════════════════════
// TIER B — Extended Primitives
// ═══════════════════════════════════════════════════════════════════

fn gen_tier_b_primitives(m: &mut FxHashMap<String, String>) {
    gen_card_parts(m);
    gen_modal_parts(m);
    gen_form_parts(m);
    gen_commerce(m);
    gen_empty_state(m);
}

// ───────────────────────────────────────────────
// CARD PARTS
// ───────────────────────────────────────────────

fn gen_card_parts(m: &mut FxHashMap<String, String>) {
    m.entry("card-header".into()).or_insert_with(|| 
        "display:flex;align-items:center;justify-content:space-between;\
         gap:0.75rem;padding:1.25rem 1.5rem;\
         border-bottom:1px solid var(--garur-border-subtle)".into());

    m.entry("card-body".into()).or_insert_with(|| 
        "padding:1.5rem".into());

    m.entry("card-footer".into()).or_insert_with(|| 
        "display:flex;align-items:center;gap:0.5rem;\
         padding:1rem 1.5rem;\
         border-top:1px solid var(--garur-border-subtle)".into());

    m.entry("card-media".into()).or_insert_with(|| 
        "width:100%;aspect-ratio:16/9;overflow:hidden;\
         border-radius:var(--garur-radius) var(--garur-radius) 0 0".into());

    m.entry("card-overlay".into()).or_insert_with(|| 
        "position:absolute;inset:auto 0 0 0;padding:1.5rem;\
         background:linear-gradient(to top, rgb(0 0 0 / 0.7), transparent);\
         color:#ffffff".into());

    m.entry("card-actions".into()).or_insert_with(|| 
        "display:flex;align-items:center;gap:0.5rem;\
         padding-top:1rem".into());
}

// ───────────────────────────────────────────────
// MODAL PARTS
// ───────────────────────────────────────────────

fn gen_modal_parts(m: &mut FxHashMap<String, String>) {
    m.entry("modal-header".into()).or_insert_with(|| 
        "display:flex;align-items:center;justify-content:space-between;\
         gap:0.75rem;padding-bottom:1rem;\
         border-bottom:1px solid var(--garur-border-subtle)".into());

    m.entry("modal-body".into()).or_insert_with(|| 
        "padding-block:1.5rem".into());

    m.entry("modal-footer".into()).or_insert_with(|| 
        "display:flex;justify-content:flex-end;gap:0.5rem;\
         padding-top:1rem;\
         border-top:1px solid var(--garur-border-subtle)".into());

    m.entry("modal-close".into()).or_insert_with(|| 
        "position:absolute;top:1rem;right:1rem;\
         width:2rem;height:2rem;display:grid;place-items:center;\
         border-radius:9999px;cursor:pointer;\
         color:var(--garur-muted);\
         transition:background-color 150ms ease, color 150ms ease;\
         &:hover { background-color:var(--garur-surface-muted);\
                   color:var(--garur-fg); }".into());
}

// ───────────────────────────────────────────────
// FORM PARTS
// ───────────────────────────────────────────────

fn gen_form_parts(m: &mut FxHashMap<String, String>) {
    m.entry("form-group".into()).or_insert_with(|| 
        "display:flex;flex-direction:column;gap:0.375rem;\
         margin-bottom:1rem".into());

    m.entry("form-row".into()).or_insert_with(|| 
        "display:grid;\
         grid-template-columns:repeat(auto-fit, minmax(12rem, 1fr));\
         gap:1rem".into());

    m.entry("input-group".into()).or_insert_with(|| 
        "display:flex;align-items:stretch;\
         & > *:not(:first-child) {\
           border-top-left-radius:0;border-bottom-left-radius:0;\
           margin-left:-1px;\
         }\
         & > *:not(:last-child) {\
           border-top-right-radius:0;border-bottom-right-radius:0;\
         }".into());

    m.entry("input-icon".into()).or_insert_with(|| 
        "position:relative;\
         & > svg, & > .icon {\
           position:absolute;left:0.75rem;top:50%;\
           transform:translateY(-50%);\
           pointer-events:none;color:var(--garur-muted);\
         }\
         & > input { padding-left:2.25rem; }".into());

    m.entry("field-label".into()).or_insert_with(|| 
        "display:block;font-size:0.875rem;font-weight:500;\
         margin-bottom:0.375rem;color:var(--garur-fg)".into());

    m.entry("field-hint".into()).or_insert_with(|| 
        "font-size:0.75rem;color:var(--garur-muted);\
         margin-top:0.25rem".into());

    m.entry("field-error".into()).or_insert_with(|| 
        "font-size:0.75rem;color:var(--garur-danger);\
         margin-top:0.25rem".into());

    m.entry("field-success".into()).or_insert_with(|| 
        "font-size:0.75rem;color:var(--garur-success);\
         margin-top:0.25rem".into());
}

// ───────────────────────────────────────────────
// COMMERCE
// ───────────────────────────────────────────────

fn gen_commerce(m: &mut FxHashMap<String, String>) {
    m.entry("product-card".into()).or_insert_with(|| 
        "display:flex;flex-direction:column;\
         background:var(--garur-surface);color:var(--garur-fg);\
         border:1px solid var(--garur-border-subtle);\
         border-radius:var(--garur-radius-lg);\
         overflow:hidden;cursor:pointer;\
         transition:transform 200ms ease, box-shadow 200ms ease;\
         &:hover { transform:translateY(-2px);\
                   box-shadow:var(--garur-shadow-lg); }".into());

    m.entry("cart-item".into()).or_insert_with(|| 
        "display:flex;align-items:center;gap:1rem;\
         padding:0.75rem 0;\
         border-bottom:1px solid var(--garur-border-subtle)".into());

    m.entry("cart-item-image".into()).or_insert_with(|| 
        "width:3.5rem;height:3.5rem;flex-shrink:0;\
         border-radius:var(--garur-radius);overflow:hidden;\
         background:var(--garur-surface-muted)".into());

    m.entry("cart-item-info".into()).or_insert_with(|| 
        "display:flex;flex-direction:column;gap:0.125rem;flex:1;\
         min-width:0".into());
}

// ───────────────────────────────────────────────
// EMPTY STATE + AVATAR GROUP EXTRAS
// ───────────────────────────────────────────────

fn gen_empty_state(m: &mut FxHashMap<String, String>) {
    m.entry("empty-state-icon".into()).or_insert_with(|| 
        "display:flex;flex-direction:column;align-items:center;\
         justify-content:center;gap:1rem;padding:3rem 1.5rem;\
         text-align:center;color:var(--garur-muted);\
         & > svg, & > .icon { width:3rem;height:3rem;opacity:0.5; }".into());

    m.entry("avatar-group-count".into()).or_insert_with(|| 
        "display:inline-flex;align-items:center;justify-content:center;\
         width:2.5rem;height:2.5rem;flex-shrink:0;\
         border-radius:9999px;\
         background:var(--garur-surface-muted);\
         color:var(--garur-fg);\
         font-size:0.75rem;font-weight:600;\
         border:2px solid var(--garur-surface)".into());
}