// ═══════════════════════════════════════════════════════════════════
// GarurSaili-CSS — plugin-luxe v5.0.0
// iOS 26 / macOS Tahoe · Apple Liquid Glass · Real Refraction ·
// Physics · LQD Button · Forms · Overlays · Navigation
//
// v5.0 additions vs v4.1:
//   · Fixed lens-glass — uses cascade trick, not @supports (survives SDK)
//   · 7 glass form controls (input, textarea, select, switch, slider, checkbox, radio)
//   · 6 glass overlays (modal, sheet, drawer, toast, tooltip, dropdown)
//   · 6 glass navigation primitives (tab bar, segmented, sidebar, nav link)
//   · LQD state machine (primary, loading, success, error, disabled)
//   · Glass tables (headers, rows, sticky)
//   · Light-mode glass (apple-glass-light)
//   · Runtime exports (magnetic, spotlight, scroll-nav, physics)
//   · GLOBAL_CSS export (a11y, reduced-motion, forced-colors)
// ═══════════════════════════════════════════════════════════════════

// ───────────────────────────────────────────────────────────────
// Shared recipe constants — extracted so utilities stay DRY
// ───────────────────────────────────────────────────────────────

/** The 8-layer glass shadow stack — every layer earns its pixels. */
const GLASS_SHADOW = [
  "inset 0 1px 0 0 var(--lx-hi)",
  "inset 0 -1px 0 0 var(--lx-lo)",
  "inset 1px 0 0 0 var(--lx-chroma-w)",
  "inset -1px 0 0 0 var(--lx-chroma-c)",
  "inset 0 -10px 24px -12px var(--lx-deep)",
  "0 1px 2px rgba(0,0,0,0.04)",
  "0 12px 32px -12px rgba(0,0,0,0.10)",
  "0 40px 80px -32px rgba(0,0,0,0.14)",
].join(", ");

/** Water drop uses stronger, closer, offset speculars for real lensing. */
const DROP_SHADOW = [
  "inset 3px 4px 10px -2px var(--lx-hi)",
  "inset -2px -3px 8px -2px var(--lx-lo)",
  "inset 4px 0 14px -4px var(--lx-chroma-w)",
  "inset -4px 0 14px -4px var(--lx-chroma-c)",
  "inset 0 4px 24px -8px var(--lx-hi-soft)",
  "inset 0 -8px 28px -8px var(--lx-deep)",
  "0 2px 4px rgba(0,0,0,0.06)",
  "0 16px 32px -8px rgba(0,0,0,0.14)",
  "0 40px 80px -20px rgba(0,0,0,0.18)",
].join(", ");

/** Overlay shadow stack — heavier ambient for elements floating over content. */
const OVERLAY_SHADOW = [
  "inset 0 1px 0 0 rgba(255,255,255,0.14)",
  "inset 0 -1px 0 0 rgba(0,0,0,0.30)",
  "0 1px 2px rgba(0,0,0,0.15)",
  "0 16px 32px -8px rgba(0,0,0,0.25)",
  "0 48px 96px -24px rgba(0,0,0,0.35)",
].join(", ");

/** Form control shadow stack — shallower, tighter, specular-only. */
const FORM_SHADOW = [
  "inset 0 1px 0 0 rgba(255,255,255,0.10)",
  "inset 0 -1px 0 0 rgba(0,0,0,0.06)",
  "0 1px 2px rgba(0,0,0,0.04)",
].join(", ");

const FORM_SHADOW_FOCUS = [
  "inset 0 1px 0 0 rgba(255,255,255,0.14)",
  "inset 0 -1px 0 0 rgba(0,0,0,0.06)",
  "0 1px 2px rgba(0,0,0,0.04)",
  "0 0 0 4px rgba(134,87,247,0.18)",
].join(", ");

// ═══════════════════════════════════════════════════════════════════
// Runtime helpers — exported, NOT auto-invoked. Users call
// `runtime.attachAll()` in a client entry file. SSR-safe.
// ═══════════════════════════════════════════════════════════════════

export interface LuxeRuntime {
  attachMagnetic: (selector?: string) => void;
  attachSpotlight: (selector?: string) => void;
  attachScrollNav: (selector?: string) => void;
  attachParallax: (selector?: string) => void;
  attachAll: (root?: HTMLElement | Document) => void;
}

// ═══════════════════════════════════════════════════════════════════
// GLOBAL_CSS — emit once via your build tool's raw-CSS hook.
// These rules MUST be global (not per-utility) because they need
// top-level @media wrappers, which the plugin SDK can't nest.
// ═══════════════════════════════════════════════════════════════════

export const GLOBAL_CSS = `
/* ── Accessibility — reduced transparency ── */
@media (prefers-reduced-transparency: reduce) {
  .apple-glass, .apple-glass-thin, .apple-glass-strong,
  .apple-glass-card, .apple-glass-panel, .apple-glass-pill,
  .apple-glass-button, .glass-lens, .glass-lens-strong,
  .apple-glass-input, .apple-glass-textarea, .apple-glass-select,
  .apple-glass-modal, .apple-glass-sheet, .apple-glass-drawer,
  .apple-glass-toast, .apple-glass-tooltip,
  .apple-glass-tab-bar, .apple-glass-segmented,
  .drop-water-card, .drop-water-bubble, .drop-water-bubble-lg,
  .fluid-glass, .fluid-glass-card {
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    background: rgba(20, 20, 25, 0.94) !important;
  }
}

/* ── Accessibility — forced colors (Windows High Contrast) ── */
@media (forced-colors: active) {
  .apple-glass, .apple-glass-thin, .apple-glass-strong,
  .apple-glass-card, .apple-glass-panel, .apple-glass-pill,
  .apple-glass-button, .glass-lens, .glass-lens-strong,
  .apple-glass-input, .apple-glass-textarea, .apple-glass-select,
  .apple-glass-modal, .apple-glass-sheet, .apple-glass-drawer,
  .apple-glass-toast, .apple-glass-tooltip,
  .apple-glass-tab-bar, .apple-glass-segmented,
  .drop-water-card, .drop-water-bubble, .drop-water-bubble-lg,
  .fluid-glass, .fluid-glass-card,
  .lqd-btn, .lqd-btn-primary, .lqd-btn-dark, .lqd-btn-iris, .lqd-btn-holo {
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    background: Canvas !important;
    border: 1px solid CanvasText !important;
    color: CanvasText !important;
    box-shadow: none !important;
  }
  .lqd-btn::after, .lqd-btn > span::after { display: none !important; }
}

/* ── Accessibility — higher contrast ── */
@media (prefers-contrast: more) {
  .apple-glass, .apple-glass-thin, .apple-glass-strong,
  .apple-glass-card, .apple-glass-panel,
  .glass-lens, .glass-lens-strong,
  .apple-glass-input, .apple-glass-textarea, .apple-glass-select {
    border-color: rgba(255, 255, 255, 0.30) !important;
  }
}

/* ── Accessibility — reduced motion ── */
@media (prefers-reduced-motion: reduce) {
  .physics-float, .physics-breathe, .physics-spring,
  .physics-spring-soft, .physics-spring-snappy,
  .physics-elastic, .physics-magnetic, .physics-parallax,
  .physics-inertia {
    animation: none !important;
    transition: none !important;
    transform: none !important;
  }
  .lqd-btn, .lqd-btn::after, .lqd-btn > span, .lqd-btn > span::after {
    transition-duration: 0.01ms !important;
  }
  .lqd-btn-wrap:has(.lqd-btn:active) {
    transform: none !important;
  }
}

/* ── Light-mode glass — for users who prefer light ── */
@media (prefers-color-scheme: light) {
  .apple-glass-auto-light {
    --lx-hi: rgba(255, 255, 255, 0.85);
    --lx-hi-soft: rgba(255, 255, 255, 0.55);
    --lx-lo: rgba(0, 0, 0, 0.06);
    --lx-chroma-w: rgba(200, 50, 150, 0.08);
    --lx-chroma-c: rgba(50, 150, 220, 0.08);
    --lx-deep: rgba(0, 0, 0, 0.06);
    background: rgba(255, 255, 255, 0.65);
    color: #0b0b0e;
  }
}
`;

// ═══════════════════════════════════════════════════════════════════
// Default export — the plugin
// ═══════════════════════════════════════════════════════════════════

export default {
  name: "@garursaili/plugin-luxe",
  version: "5.0.0",
  description:
    "Apple liquid glass · real refraction · physics · LQD button · forms · overlays · navigation",

  prefixes: [
    "apple-glass", "glass-lens", "chromatic-depth",
    "lqd-btn", "lqd-",
    "drop-water",
    "fluid-glass",
    "card-luxe", "btn-luxe",
    "chrome-", "holo-", "aurora-",
    "physics-", "tilt-", "lift-", "pop-", "shine-", "reveal-", "focus-",
  ],

  setup(api: any) {
    // ═══════════════════════════════════════════════════════════════
    // 1. TOKENS — themeable at :root
    // ═══════════════════════════════════════════════════════════════
    api.defineToken("lx-hi", "rgba(255,255,255,0.55)");
    api.defineToken("lx-hi-soft", "rgba(255,255,255,0.22)");
    api.defineToken("lx-lo", "rgba(0,0,0,0.10)");
    api.defineToken("lx-chroma-w", "rgba(255,170,215,0.14)");
    api.defineToken("lx-chroma-c", "rgba(150,215,255,0.14)");
    api.defineToken("lx-deep", "rgba(0,0,0,0.14)");
    api.defineToken("lx-nav-opacity", "0.4");

    // ═══════════════════════════════════════════════════════════════
    // 2. @property — required for LQD angle animation + custom tokens
    // ═══════════════════════════════════════════════════════════════
    api.addProperty("--lqd-angle-1", "<angle>", "-75deg", false);
    api.addProperty("--lqd-angle-2", "<angle>", "-45deg", false);
    api.addProperty("--lx-nav-opacity", "<number>", "0.4", false);

    // ═══════════════════════════════════════════════════════════════
    // 3. KEYFRAMES
    // ═══════════════════════════════════════════════════════════════
    api.addKeyframes("lx-holo-shift", "0%,100%{background-position:0% 50%}50%{background-position:100% 50%}");
    api.addKeyframes("lx-shine-sweep", "0%{left:-100%}100%{left:200%}");
    api.addKeyframes("lx-aurora-1", "0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(60px,-50px) scale(1.15)}");
    api.addKeyframes("lx-aurora-2", "0%,100%{transform:translate(0,0) scale(1.05)}50%{transform:translate(-50px,40px) scale(0.9)}");
    api.addKeyframes("lx-aurora-3", "0%,100%{transform:translate(0,0) scale(0.95)}50%{transform:translate(40px,-60px) scale(1.1)}");
    api.addKeyframes("lx-float", "0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}");
    api.addKeyframes("lx-breathe", "0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.015);opacity:0.95}");
    api.addKeyframes("lx-ripple", "0%{transform:scale(0);opacity:0.6}100%{transform:scale(4);opacity:0}");
    // v5 additions
    api.addKeyframes("lx-lqd-spin", "to{transform:rotate(360deg)}");
    api.addKeyframes("lx-toast-in", "from{transform:translateX(120%);opacity:0}to{transform:translateX(0);opacity:1}");
    api.addKeyframes("lx-toast-out", "from{transform:translateX(0);opacity:1}to{transform:translateX(120%);opacity:0}");
    api.addKeyframes("lx-modal-in", "from{transform:scale(0.94);opacity:0}to{transform:scale(1);opacity:1}");
    api.addKeyframes("lx-shake", "0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-4px)}40%,80%{transform:translateX(4px)}");

    // ═══════════════════════════════════════════════════════════════
    // 4. RUNTIME — auto-inject the SVG lens filter.
    //    Safe no-op during build/SSR. Idempotent.
    // ═══════════════════════════════════════════════════════════════
    if (typeof document !== "undefined" && typeof window !== "undefined") {
      const FILTER_ID = "lx-lens-filter";
      if (!document.getElementById(FILTER_ID)) {
        const SVG_NS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(SVG_NS, "svg");
        svg.id = FILTER_ID;
        svg.setAttribute("aria-hidden", "true");
        svg.setAttribute("width", "0");
        svg.setAttribute("height", "0");
        svg.style.cssText =
          "position:absolute;width:0;height:0;overflow:hidden;pointer-events:none";
        svg.innerHTML = `
          <defs>
            <filter id="lx-lens-warp" x="-4%" y="-4%" width="108%" height="108%">
              <feImage
                href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 100' preserveAspectRatio='none'%3E%3Cdefs%3E%3CradialGradient id='r' cx='50%25' cy='50%25' r='52%25'%3E%3Cstop offset='0%25' stop-color='%23808080'/%3E%3Cstop offset='58%25' stop-color='%23808080'/%3E%3Cstop offset='100%25' stop-color='%23cfcfcf'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='200' height='100' fill='url(%23r)'/%3E%3C/svg%3E"
                result="map" x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" />
              <feDisplacementMap in="SourceGraphic" in2="map" scale="11"
                xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
        `;
        const mount = () => {
          if (document.body && !document.getElementById(FILTER_ID)) {
            document.body.appendChild(svg);
          }
        };
        if (document.body) mount();
        else document.addEventListener("DOMContentLoaded", mount, { once: true });
      }
    }

    // ═══════════════════════════════════════════════════════════════
    // 5. CORE RECIPES — shared, composable
    // ═══════════════════════════════════════════════════════════════

    const APPLE_GLASS: Record<string, any> = {
      position: "relative",
      isolation: "isolate",
      borderRadius: "1.5rem",
      backdropFilter: "blur(30px) saturate(200%) brightness(1.05) contrast(1.05)",
      WebkitBackdropFilter: "blur(30px) saturate(200%) brightness(1.05) contrast(1.05)",
      boxShadow: GLASS_SHADOW,
      "&::before": {
        content: "''",
        position: "absolute",
        inset: "0",
        borderRadius: "inherit",
        padding: "0.75px",
        background:
          "conic-gradient(from 135deg, rgba(255,255,255,0.60), rgba(255,180,220,0.25) 25%, rgba(255,255,255,0.15) 50%, rgba(160,220,255,0.25) 75%, rgba(255,255,255,0.60) 100%)",
        WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
        pointerEvents: "none",
        zIndex: "2",
      },
      "&::after": {
        content: "''",
        position: "absolute",
        inset: "0",
        borderRadius: "inherit",
        background:
          "radial-gradient(ellipse 50% 25% at 50% 0%, rgba(255,255,255,0.20), transparent 70%)",
        pointerEvents: "none",
        zIndex: "1",
      },
    };

    /**
     * Lens variant — uses the CSS cascade trick so the refraction survives
     * even when the plugin SDK can't nest @supports. Browsers see both
     * `backdrop-filter` declarations; Safari keeps the blur fallback,
     * Chromium keeps the url() lens.
     */
    const APPLE_GLASS_LENS: Record<string, any> = {
      ...APPLE_GLASS,
      backdropFilter:
        "blur(20px) saturate(200%) brightness(1.05); backdrop-filter: url(#lx-lens-warp) blur(20px) saturate(200%) brightness(1.05)",
      WebkitBackdropFilter:
        "blur(20px) saturate(200%) brightness(1.05); -webkit-backdrop-filter: url(#lx-lens-warp) blur(20px) saturate(200%) brightness(1.05)",
    };

    const WATER_DROP: Record<string, any> = {
      position: "relative",
      isolation: "isolate",
      borderRadius: "50%",
      backdropFilter: "blur(16px) saturate(240%) brightness(1.15) contrast(1.1)",
      WebkitBackdropFilter: "blur(16px) saturate(240%) brightness(1.15) contrast(1.1)",
      boxShadow: DROP_SHADOW,
      transition: "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
      "&::before": {
        content: "''",
        position: "absolute",
        inset: "0",
        borderRadius: "inherit",
        background:
          "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.45) 0%, transparent 30%)",
        pointerEvents: "none",
        zIndex: "1",
      },
      "&::after": {
        content: "''",
        position: "absolute",
        inset: "0",
        borderRadius: "inherit",
        padding: "0.5px",
        background:
          "conic-gradient(from 0deg, rgba(255,255,255,0.70), rgba(255,200,230,0.20) 30%, rgba(255,255,255,0.10) 50%, rgba(200,230,255,0.20) 70%, rgba(255,255,255,0.70) 100%)",
        WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
        pointerEvents: "none",
        zIndex: "2",
      },
      "&:hover": { transform: "scale(1.04)" },
    };

    // ─── Form controls — shared base ───
    const FORM_BASE: Record<string, any> = {
      display: "block",
      width: "100%",
      padding: "0.75rem 1rem",
      borderRadius: "0.875rem",
      background: "rgba(255,255,255,0.06)",
      backdropFilter: "blur(20px) saturate(180%)",
      WebkitBackdropFilter: "blur(20px) saturate(180%)",
      border: "1px solid rgba(255,255,255,0.12)",
      boxShadow: FORM_SHADOW,
      color: "#f5f5f7",
      fontSize: "0.9375rem",
      lineHeight: "1.5",
      transition: "background 200ms cubic-bezier(0.25, 1, 0.5, 1), border-color 200ms cubic-bezier(0.25, 1, 0.5, 1), box-shadow 200ms cubic-bezier(0.25, 1, 0.5, 1)",
      "&::placeholder": { color: "rgba(255,255,255,0.40)" },
      "&:focus": {
        outline: "none",
        background: "rgba(255,255,255,0.10)",
        borderColor: "rgba(134,87,247,0.65)",
        boxShadow: FORM_SHADOW_FOCUS,
      },
      "&:disabled": {
        opacity: "0.4",
        cursor: "not-allowed",
      },
    };

    // ─── Overlay base — shared backdrop + specular ───
    const OVERLAY_BASE: Record<string, any> = {
      background: "rgba(20,20,25,0.72)",
      backdropFilter: "blur(40px) saturate(200%)",
      WebkitBackdropFilter: "blur(40px) saturate(200%)",
      border: "1px solid rgba(255,255,255,0.10)",
      boxShadow: OVERLAY_SHADOW,
      color: "#f5f5f7",
    };

    // ─── LQD button recipe (unchanged from v4.1) ───
    const LQD_BTN: Record<string, any> = {
      "--lqd-border-w": "clamp(1px, 0.0625em, 4px)",
      all: "unset",
      cursor: "pointer",
      position: "relative",
      WebkitTapHighlightColor: "rgba(0,0,0,0)",
      pointerEvents: "auto",
      zIndex: "3",
      background:
        "linear-gradient(-75deg, rgba(255,255,255,0.05), rgba(255,255,255,0.20), rgba(255,255,255,0.05))",
      borderRadius: "999vw",
      boxShadow: [
        "inset 0 0.125em 0.125em rgba(0,0,0,0.05)",
        "inset 0 -0.125em 0.125em rgba(255,255,255,0.50)",
        "0 0.25em 0.125em -0.125em rgba(0,0,0,0.20)",
        "inset 0 0 0.1em 0.25em rgba(255,255,255,0.20)",
        "0 0 0 0 rgba(255,255,255,1)",
      ].join(", "),
      backdropFilter: "blur(clamp(1px, 0.125em, 4px))",
      WebkitBackdropFilter: "blur(clamp(1px, 0.125em, 4px))",
      transition: "all 400ms cubic-bezier(0.25, 1, 0.5, 1)",

      "& > span": {
        position: "relative",
        display: "block",
        userSelect: "none",
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
        letterSpacing: "-0.05em",
        fontWeight: "500",
        fontSize: "1em",
        color: "rgba(50,50,50,1)",
        textShadow: "0 0.25em 0.05em rgba(0,0,0,0.10)",
        paddingInline: "1.5em",
        paddingBlock: "0.875em",
        transition: "all 400ms cubic-bezier(0.25, 1, 0.5, 1)",
      },

      "& > span::after": {
        content: "''",
        display: "block",
        position: "absolute",
        width: "calc(100% - var(--lqd-border-w))",
        height: "calc(100% - var(--lqd-border-w))",
        top: "calc(var(--lqd-border-w) / 2)",
        left: "calc(var(--lqd-border-w) / 2)",
        boxSizing: "border-box",
        borderRadius: "999vw",
        overflow: "clip",
        background:
          "linear-gradient(var(--lqd-angle-2), rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 40% 50%, rgba(255,255,255,0) 55%)",
        zIndex: "3",
        mixBlendMode: "screen",
        pointerEvents: "none",
        backgroundSize: "200% 200%",
        backgroundPosition: "0% 50%",
        backgroundRepeat: "no-repeat",
        transition:
          "background-position 500ms cubic-bezier(0.25, 1, 0.5, 1), --lqd-angle-2 500ms cubic-bezier(0.25, 1, 0.5, 1)",
      },

      "&::after": {
        content: "''",
        position: "absolute",
        zIndex: "1",
        inset: "0",
        borderRadius: "999vw",
        width: "calc(100% + var(--lqd-border-w))",
        height: "calc(100% + var(--lqd-border-w))",
        top: "calc(var(--lqd-border-w) / -2)",
        left: "calc(var(--lqd-border-w) / -2)",
        padding: "var(--lqd-border-w)",
        boxSizing: "border-box",
        background:
          "conic-gradient(from var(--lqd-angle-1) at 50% 50%, rgba(0,0,0,0.50), rgba(0,0,0,0) 5% 40%, rgba(0,0,0,0.50) 50%, rgba(0,0,0,0) 60% 95%, rgba(0,0,0,0.50)), linear-gradient(180deg, rgba(255,255,255,0.5), rgba(255,255,255,0.5))",
        WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
        mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
        WebkitMaskComposite: "exclude",
        maskComposite: "exclude",
        transition:
          "all 400ms cubic-bezier(0.25, 1, 0.5, 1), --lqd-angle-1 500ms ease",
        boxShadow: "inset 0 0 0 calc(var(--lqd-border-w) / 2) rgba(255,255,255,0.5)",
        pointerEvents: "none",
      },

      "&:hover": {
        transform: "scale(0.975)",
        backdropFilter: "blur(0.01em)",
        WebkitBackdropFilter: "blur(0.01em)",
        boxShadow: [
          "inset 0 0.125em 0.125em rgba(0,0,0,0.05)",
          "inset 0 -0.125em 0.125em rgba(255,255,255,0.50)",
          "0 0.15em 0.05em -0.1em rgba(0,0,0,0.25)",
          "inset 0 0 0.05em 0.1em rgba(255,255,255,0.50)",
          "0 0 0 0 rgba(255,255,255,1)",
        ].join(", "),
      },
      "&:hover > span": { textShadow: "0.025em 0.025em 0.025em rgba(0,0,0,0.12)" },
      "&:hover > span::after": { backgroundPosition: "25% 50%" },
      "&:hover::after": { "--lqd-angle-1": "-125deg" },

      "&:active > span::after": {
        backgroundPosition: "50% 15%",
        "--lqd-angle-2": "-15deg",
      },
      "&:active::after": { "--lqd-angle-1": "-75deg" },

      "@media (hover: none) and (pointer: coarse)": {
        "& > span::after": { "--lqd-angle-2": "-45deg" },
        "&:active > span::after": { "--lqd-angle-2": "-45deg" },
        "&::after": { "--lqd-angle-1": "-75deg" },
        "&:hover::after": { "--lqd-angle-1": "-75deg" },
        "&:active::after": { "--lqd-angle-1": "-75deg" },
      },
    };

    // ═══════════════════════════════════════════════════════════════
    // 6. UTILITIES
    // ═══════════════════════════════════════════════════════════════
    api.addUtilities({
      // ─────────────────────────────────────────────────────────────
      // MATERIALS — Apple Glass
      // ─────────────────────────────────────────────────────────────
      "apple-glass": APPLE_GLASS,
      "apple-glass-strong": {
        ...APPLE_GLASS,
        backdropFilter: "blur(50px) saturate(240%) brightness(1.08) contrast(1.08)",
        WebkitBackdropFilter: "blur(50px) saturate(240%) brightness(1.08) contrast(1.08)",
      },
      "apple-glass-thin": {
        ...APPLE_GLASS,
        backdropFilter: "blur(8px) saturate(140%) brightness(1.01)",
        WebkitBackdropFilter: "blur(8px) saturate(140%) brightness(1.01)",
      },
      "apple-glass-dark": {
        ...APPLE_GLASS,
        background: "rgba(20,20,25,0.55)",
        color: "#f5f5f7",
        boxShadow: [
          "inset 0 1px 0 rgba(255,255,255,0.15)",
          "inset 0 -1px 0 rgba(0,0,0,0.40)",
          "inset 0 -10px 24px -12px rgba(0,0,0,0.35)",
          "0 1px 2px rgba(0,0,0,0.20)",
          "0 12px 32px -12px rgba(0,0,0,0.30)",
          "0 40px 80px -32px rgba(0,0,0,0.40)",
        ].join(", "),
      },
      "apple-glass-light": {
        ...APPLE_GLASS,
        background: "rgba(255,255,255,0.55)",
        color: "#0b0b0e",
        boxShadow: [
          "inset 0 1px 0 rgba(255,255,255,0.85)",
          "inset 0 -1px 0 rgba(0,0,0,0.06)",
          "inset 0 -10px 24px -12px rgba(0,0,0,0.04)",
          "0 1px 2px rgba(0,0,0,0.04)",
          "0 12px 32px -12px rgba(0,0,0,0.08)",
          "0 40px 80px -32px rgba(0,0,0,0.10)",
        ].join(", "),
      },
      "apple-glass-card": { ...APPLE_GLASS, padding: "2rem", borderRadius: "1.75rem" },
      "apple-glass-panel": {
        ...APPLE_GLASS,
        padding: "2rem",
        borderRadius: "2rem",
        backdropFilter: "blur(40px) saturate(220%) brightness(1.05) contrast(1.05)",
        WebkitBackdropFilter: "blur(40px) saturate(220%) brightness(1.05) contrast(1.05)",
      },
      "apple-glass-pill": {
        ...APPLE_GLASS,
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.5rem 1rem",
        borderRadius: "9999px",
        fontSize: "0.8125rem",
        fontWeight: "500",
      },
      "apple-glass-button": {
        ...APPLE_GLASS,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        padding: "0.75rem 1.5rem",
        borderRadius: "9999px",
        fontWeight: "600",
        fontSize: "0.875rem",
        cursor: "pointer",
        border: "none",
        transition: "all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        "&:hover": { transform: "translateY(-1px) scale(1.02)" },
        "&:active": { transform: "scale(0.97)" },
      },
      "apple-glass-badge": {
        ...APPLE_GLASS,
        display: "inline-flex",
        alignItems: "center",
        gap: "0.25rem",
        padding: "0.125rem 0.5rem",
        borderRadius: "9999px",
        fontSize: "0.6875rem",
        fontWeight: "600",
        letterSpacing: "0.02em",
      },
      "apple-glass-divider": {
        display: "block",
        height: "1px",
        width: "100%",
        background:
          "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
        border: "none",
      },

      // ─────────────────────────────────────────────────────────────
      // LENS — self-contained refraction (shadow stack + lens backdrop)
      // Use `glass-lens` INSTEAD of `apple-glass` for elements that need
      // real refraction. Cascade trick: Safari keeps blur, Chromium lenses.
      // ─────────────────────────────────────────────────────────────
      "glass-lens": APPLE_GLASS_LENS,
      "glass-lens-strong": {
        ...APPLE_GLASS,
        backdropFilter:
          "blur(30px) saturate(200%) brightness(1.05); backdrop-filter: url(#lx-lens-warp) blur(10px) saturate(200%) brightness(1.05)",
        WebkitBackdropFilter:
          "blur(30px) saturate(200%) brightness(1.05); -webkit-backdrop-filter: url(#lx-lens-warp) blur(10px) saturate(200%) brightness(1.05)",
      },

      /**
       * Chromatic fringe — universal fallback for depth.
       * Pair with any glass utility on non-Chromium browsers.
       */
      "chromatic-depth": {
        position: "relative",
        isolation: "isolate",
        "&::before": {
          content: "''",
          position: "absolute",
          inset: "0",
          borderRadius: "inherit",
          padding: "0.75px",
          background:
            "conic-gradient(from 135deg, rgba(255,170,215,0.35), rgba(255,255,255,0.06) 25%, rgba(150,215,255,0.35) 50%, rgba(255,255,255,0.06) 75%, rgba(255,170,215,0.35) 100%)",
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          pointerEvents: "none",
          zIndex: "2",
          mixBlendMode: "screen",
          opacity: "0.85",
        },
      },

      // ─────────────────────────────────────────────────────────────
      // MATERIALS — Water Drop
      // ─────────────────────────────────────────────────────────────
      "drop-water": WATER_DROP,
      "drop-water-card": { ...WATER_DROP, borderRadius: "2rem", padding: "2rem" },
      "drop-water-pill": {
        ...WATER_DROP,
        borderRadius: "9999px",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.5rem 1rem",
        fontSize: "0.8125rem",
      },
      "drop-water-button": {
        ...WATER_DROP,
        borderRadius: "9999px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        padding: "0.75rem 1.5rem",
        fontWeight: "600",
        cursor: "pointer",
        border: "none",
        "&:hover": { transform: "scale(1.05)" },
        "&:active": { transform: "scale(0.95)" },
      },
      "drop-water-bubble": {
        ...WATER_DROP,
        width: "8rem",
        height: "8rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.5rem",
        fontWeight: "700",
      },
      "drop-water-bubble-lg": {
        ...WATER_DROP,
        width: "12rem",
        height: "12rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "2rem",
        fontWeight: "700",
      },

      // ─────────────────────────────────────────────────────────────
      // MATERIALS — Fluid Glass
      // ─────────────────────────────────────────────────────────────
      "fluid-glass": {
        ...APPLE_GLASS,
        borderRadius: "2rem / 2.2rem",
        transition: "all 600ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        "&:hover": { borderRadius: "2.2rem / 2rem", transform: "translateY(-2px)" },
      },
      "fluid-glass-card": {
        ...APPLE_GLASS,
        padding: "2rem",
        borderRadius: "2rem / 2.2rem",
        transition: "all 600ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        "&:hover": { transform: "translateY(-3px) scale(1.01)" },
      },

      // ═══════════════════════════════════════════════════════════════
      // FORMS — 7 glass controls (v5 addition)
      // ═══════════════════════════════════════════════════════════════
      "apple-glass-input": { ...FORM_BASE },
      "apple-glass-textarea": {
        ...FORM_BASE,
        minHeight: "6rem",
        resize: "vertical",
        fontFamily: "inherit",
      },
      "apple-glass-select": {
        ...FORM_BASE,
        appearance: "none",
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='rgba(255,255,255,0.55)' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 1rem center",
        backgroundSize: "0.75rem",
        paddingRight: "2.5rem",
      },
      "apple-glass-switch": {
        appearance: "none",
        position: "relative",
        display: "inline-block",
        width: "3.25rem",
        height: "1.875rem",
        flexShrink: "0",
        borderRadius: "9999px",
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: [
          "inset 0 1px 2px rgba(0,0,0,0.15)",
          "inset 0 -1px 0 rgba(255,255,255,0.05)",
        ].join(", "),
        cursor: "pointer",
        transition: "background 200ms cubic-bezier(0.25, 1, 0.5, 1)",
        "&::after": {
          content: "''",
          position: "absolute",
          top: "0.125rem",
          left: "0.125rem",
          width: "1.625rem",
          height: "1.625rem",
          borderRadius: "9999px",
          background: "#ffffff",
          boxShadow: "0 2px 4px rgba(0,0,0,0.25), 0 1px 1px rgba(0,0,0,0.10)",
          transition: "transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        },
        "&:checked": { background: "rgba(52,199,89,0.9)" },
        "&:checked::after": { transform: "translateX(1.375rem)" },
        "&:focus-visible": {
          outline: "2px solid rgba(134,87,247,0.65)",
          outlineOffset: "2px",
        },
      },
      "apple-glass-slider": {
        appearance: "none",
        width: "100%",
        height: "0.375rem",
        borderRadius: "9999px",
        background: "rgba(255,255,255,0.12)",
        boxShadow: "inset 0 1px 2px rgba(0,0,0,0.15)",
        outline: "none",
        cursor: "pointer",
        "&::-webkit-slider-thumb": {
          appearance: "none",
          width: "1.5rem",
          height: "1.5rem",
          borderRadius: "9999px",
          background:
            "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.9), rgba(255,255,255,0.7))",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.9), 0 2px 6px rgba(0,0,0,0.25)",
          cursor: "pointer",
        },
        "&::-moz-range-thumb": {
          width: "1.5rem",
          height: "1.5rem",
          borderRadius: "9999px",
          background:
            "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.9), rgba(255,255,255,0.7))",
          border: "none",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.9), 0 2px 6px rgba(0,0,0,0.25)",
          cursor: "pointer",
        },
      },
      "apple-glass-checkbox": {
        appearance: "none",
        width: "1.25rem",
        height: "1.25rem",
        flexShrink: "0",
        borderRadius: "0.375rem",
        background: "rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.15)",
        boxShadow: FORM_SHADOW,
        cursor: "pointer",
        transition: "background 150ms, border-color 150ms",
        "&:checked": {
          background: "rgba(134,87,247,0.9)",
          borderColor: "rgba(134,87,247,0.9)",
        },
        "&:focus-visible": {
          outline: "2px solid rgba(134,87,247,0.65)",
          outlineOffset: "2px",
        },
      },
      "apple-glass-radio": {
        appearance: "none",
        width: "1.25rem",
        height: "1.25rem",
        flexShrink: "0",
        borderRadius: "9999px",
        background: "rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.15)",
        boxShadow: FORM_SHADOW,
        cursor: "pointer",
        transition: "background 150ms, border-color 150ms",
        "&:checked": {
          borderColor: "rgba(134,87,247,0.9)",
          boxShadow: "inset 0 0 0 4px rgba(134,87,247,0.9)",
        },
        "&:focus-visible": {
          outline: "2px solid rgba(134,87,247,0.65)",
          outlineOffset: "2px",
        },
      },

      // ═══════════════════════════════════════════════════════════════
      // OVERLAYS — 6 floating glass primitives (v5 addition)
      // ═══════════════════════════════════════════════════════════════
      "apple-glass-modal": {
        ...OVERLAY_BASE,
        position: "relative",
        width: "100%",
        maxWidth: "32rem",
        padding: "1.5rem",
        borderRadius: "1.5rem",
        animation: "lx-modal-in 300ms cubic-bezier(0.25, 1, 0.5, 1)",
      },
      "apple-glass-modal-backdrop": {
        position: "fixed",
        inset: "0",
        zIndex: "60",
        display: "grid",
        placeItems: "center",
        padding: "1rem",
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      },
      "apple-glass-sheet": {
        ...OVERLAY_BASE,
        position: "fixed",
        bottom: "0",
        left: "0",
        right: "0",
        maxHeight: "85vh",
        padding: "2.5rem 1.5rem 1.5rem",
        borderRadius: "1.5rem 1.5rem 0 0",
        borderBottom: "none",
        transform: "translateY(100%)",
        transition: "transform 400ms cubic-bezier(0.25, 1, 0.5, 1)",
        zIndex: "60",
        "&[data-open='true']": { transform: "translateY(0)" },
        "&::before": {
          content: "''",
          position: "absolute",
          top: "0.75rem",
          left: "50%",
          transform: "translateX(-50%)",
          width: "2.5rem",
          height: "0.25rem",
          borderRadius: "9999px",
          background: "rgba(255,255,255,0.25)",
        },
      },
      "apple-glass-drawer": {
        ...OVERLAY_BASE,
        position: "fixed",
        top: "0",
        bottom: "0",
        left: "0",
        width: "20rem",
        maxWidth: "85vw",
        borderRadius: "0 1.5rem 1.5rem 0",
        padding: "1.5rem",
        transform: "translateX(-100%)",
        transition: "transform 400ms cubic-bezier(0.25, 1, 0.5, 1)",
        zIndex: "60",
        overflowY: "auto",
        "&[data-open='true']": { transform: "translateX(0)" },
      },
      "apple-glass-drawer-right": {
        ...OVERLAY_BASE,
        position: "fixed",
        top: "0",
        bottom: "0",
        right: "0",
        width: "20rem",
        maxWidth: "85vw",
        borderRadius: "1.5rem 0 0 1.5rem",
        padding: "1.5rem",
        transform: "translateX(100%)",
        transition: "transform 400ms cubic-bezier(0.25, 1, 0.5, 1)",
        zIndex: "60",
        overflowY: "auto",
        "&[data-open='true']": { transform: "translateX(0)" },
      },
      "apple-glass-toast": {
        ...OVERLAY_BASE,
        position: "fixed",
        top: "1rem",
        right: "1rem",
        minWidth: "18rem",
        maxWidth: "24rem",
        padding: "0.875rem 1rem",
        borderRadius: "1rem",
        display: "flex",
        alignItems: "flex-start",
        gap: "0.75rem",
        fontSize: "0.875rem",
        zIndex: "70",
        animation: "lx-toast-in 400ms cubic-bezier(0.25, 1, 0.5, 1)",
      },
      "apple-glass-tooltip": {
        position: "relative",
        display: "inline-block",
        "&::after": {
          content: "attr(data-tooltip)",
          position: "absolute",
          bottom: "100%",
          left: "50%",
          transform: "translateX(-50%) translateY(-8px)",
          padding: "0.375rem 0.625rem",
          borderRadius: "0.5rem",
          background: "rgba(20,20,25,0.85)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.10)",
          color: "white",
          fontSize: "0.75rem",
          fontWeight: "500",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          opacity: "0",
          transition: "opacity 150ms, transform 150ms",
          zIndex: "80",
        },
        "&:hover::after": {
          opacity: "1",
          transform: "translateX(-50%) translateY(-4px)",
        },
      },
      "apple-glass-dropdown": {
        position: "relative",
        display: "inline-block",
      },
      "apple-glass-dropdown-menu": {
        ...OVERLAY_BASE,
        position: "absolute",
        top: "100%",
        right: "0",
        marginTop: "0.5rem",
        minWidth: "14rem",
        padding: "0.25rem",
        borderRadius: "0.875rem",
        zIndex: "50",
      },
      "apple-glass-dropdown-item": {
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.5rem 0.75rem",
        borderRadius: "0.625rem",
        fontSize: "0.875rem",
        color: "rgba(245,245,247,0.85)",
        cursor: "pointer",
        textDecoration: "none",
        transition: "background 100ms",
        "&:hover": { background: "rgba(255,255,255,0.08)" },
      },

      // ═══════════════════════════════════════════════════════════════
      // NAVIGATION — 6 glass navigation primitives (v5 addition)
      // ═══════════════════════════════════════════════════════════════
      "apple-glass-nav": {
        ...APPLE_GLASS,
        position: "sticky",
        top: "1rem",
        zIndex: "50",
        padding: "0.75rem 1.25rem",
        borderRadius: "1.125rem",
        background: "rgba(20,20,25,var(--lx-nav-opacity, 0.4))",
        transition: "background 200ms cubic-bezier(0.25, 1, 0.5, 1)",
      },
      "apple-glass-nav-link": {
        display: "inline-flex",
        alignItems: "center",
        gap: "0.375rem",
        padding: "0.5rem 0.75rem",
        borderRadius: "0.75rem",
        fontSize: "0.875rem",
        fontWeight: "500",
        color: "rgba(245,245,247,0.75)",
        textDecoration: "none",
        transition: "all 150ms",
        "&:hover": {
          background: "rgba(255,255,255,0.06)",
          color: "rgba(245,245,247,0.95)",
        },
      },
      "apple-glass-tab-bar": {
        ...OVERLAY_BASE,
        position: "fixed",
        bottom: "1rem",
        left: "50%",
        transform: "translateX(-50%)",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.25rem",
        padding: "0.375rem",
        borderRadius: "1.25rem",
        zIndex: "40",
      },
      "apple-glass-tab-item": {
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.25rem",
        padding: "0.5rem 0.875rem",
        borderRadius: "0.875rem",
        fontSize: "0.6875rem",
        fontWeight: "500",
        color: "rgba(245,245,247,0.6)",
        cursor: "pointer",
        transition: "all 200ms",
        "&:hover": {
          background: "rgba(255,255,255,0.06)",
          color: "rgba(245,245,247,0.85)",
        },
        "&[aria-selected='true']": {
          background: "rgba(255,255,255,0.12)",
          color: "white",
        },
      },
      "apple-glass-segmented": {
        position: "relative",
        display: "inline-flex",
        padding: "0.25rem",
        borderRadius: "0.875rem",
        background: "rgba(20,20,25,0.4)",
        backdropFilter: "blur(30px) saturate(200%)",
        WebkitBackdropFilter: "blur(30px) saturate(200%)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "inset 0 1px 2px rgba(0,0,0,0.15)",
      },
      "apple-glass-segmented-item": {
        position: "relative",
        padding: "0.375rem 0.875rem",
        borderRadius: "0.625rem",
        fontSize: "0.8125rem",
        fontWeight: "500",
        color: "rgba(245,245,247,0.6)",
        cursor: "pointer",
        transition: "all 200ms",
        "&[aria-selected='true']": {
          background: "rgba(255,255,255,0.15)",
          color: "white",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.20), 0 1px 2px rgba(0,0,0,0.15)",
        },
      },
      "apple-glass-sidebar": {
        ...OVERLAY_BASE,
        display: "flex",
        flexDirection: "column",
        gap: "0.25rem",
        width: "16rem",
        padding: "1rem",
        borderRadius: "1.25rem",
      },
      "apple-glass-sidebar-item": {
        display: "flex",
        alignItems: "center",
        gap: "0.625rem",
        padding: "0.5rem 0.75rem",
        borderRadius: "0.75rem",
        fontSize: "0.875rem",
        color: "rgba(245,245,247,0.75)",
        cursor: "pointer",
        textDecoration: "none",
        transition: "all 150ms",
        "&:hover": {
          background: "rgba(255,255,255,0.06)",
          color: "rgba(245,245,247,0.95)",
        },
        "&[aria-current='page']": {
          background: "rgba(134,87,247,0.15)",
          color: "rgba(200,180,255,1)",
        },
      },

      // ═══════════════════════════════════════════════════════════════
      // TABLES — glass tables (v5 addition)
      // ═══════════════════════════════════════════════════════════════
      "apple-glass-table": {
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "0.875rem",
        color: "#f5f5f7",
      },
      "apple-glass-table-header": {
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        borderBottom: "1px solid rgba(255,255,255,0.10)",
        "& th": {
          padding: "0.75rem 1rem",
          textAlign: "left",
          fontWeight: "600",
          fontSize: "0.75rem",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: "rgba(245,245,247,0.6)",
        },
      },
      "apple-glass-table-row": {
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        transition: "background 100ms",
        "&:hover": { background: "rgba(255,255,255,0.04)" },
        "& td": {
          padding: "0.75rem 1rem",
          color: "rgba(245,245,247,0.85)",
        },
      },

      // ═══════════════════════════════════════════════════════════════
      // LQD BUTTON — v5 state machine
      // ═══════════════════════════════════════════════════════════════
      "lqd-btn": LQD_BTN,
      "lqd-btn-wrap": {
        "--lqd-shadow-fix": "2em",
        "--lqd-shadow-blur": "clamp(2px, 0.125em, 12px)",
        "--lqd-shadow-top": "calc(var(--lqd-shadow-fix) - 0.5em)",
        "--lqd-shadow-opacity": "0.85",
        position: "relative",
        zIndex: "2",
        borderRadius: "999vw",
        background: "transparent",
        pointerEvents: "none",
        transition: "all 400ms cubic-bezier(0.25, 1, 0.5, 1)",
        "&:has(.lqd-btn:hover)": {
          "--lqd-shadow-blur": "clamp(2px, 0.0625em, 6px)",
          "--lqd-shadow-top": "calc(var(--lqd-shadow-fix) - 0.875em)",
        },
        "&:has(.lqd-btn:active)": {
          transform: "rotate3d(1, 0, 0, 25deg)",
          "--lqd-shadow-top": "calc(var(--lqd-shadow-fix) - 0.5em)",
          "--lqd-shadow-opacity": "0.75",
        },
      },
      "lqd-btn-shadow": {
        position: "absolute",
        width: "calc(100% + var(--lqd-shadow-fix, 2em))",
        height: "calc(100% + var(--lqd-shadow-fix, 2em))",
        top: "calc(var(--lqd-shadow-fix, 2em) / -2)",
        left: "calc(var(--lqd-shadow-fix, 2em) / -2)",
        filter: "blur(var(--lqd-shadow-blur, clamp(2px, 0.125em, 12px)))",
        overflow: "visible",
        pointerEvents: "none",
        transition: "filter 400ms cubic-bezier(0.25, 1, 0.5, 1)",
        "&::after": {
          content: "''",
          position: "absolute",
          zIndex: "0",
          inset: "0",
          borderRadius: "999vw",
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.20), rgba(0,0,0,0.10))",
          width: "calc(100% - var(--lqd-shadow-fix, 2em) - 0.25em)",
          height: "calc(100% - var(--lqd-shadow-fix, 2em) - 0.25em)",
          top: "var(--lqd-shadow-top, calc(var(--lqd-shadow-fix, 2em) - 0.5em))",
          left: "calc(var(--lqd-shadow-fix, 2em) - 0.875em)",
          padding: "0.125em",
          boxSizing: "border-box",
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "exclude",
          maskComposite: "exclude",
          opacity: "var(--lqd-shadow-opacity, 0.85)",
          transition: "all 400ms cubic-bezier(0.25, 1, 0.5, 1)",
          overflow: "visible",
        },
      },

      // LQD colour variants
      "lqd-btn-dark": {
        color: "rgba(240,240,245,1)",
        textShadow: "0 0.25em 0.05em rgba(255,255,255,0.10)",
      },
      "lqd-btn-iris": { color: "#7a43f0" },
      "lqd-btn-holo": { color: "#c894ff" },

      // LQD primary — filled Apple blue (v5)
      "lqd-btn-primary": {
        background: "linear-gradient(180deg, #007aff 0%, #0055b8 100%)",
        boxShadow: [
          "inset 0 0.125em 0.125em rgba(255,255,255,0.30)",
          "inset 0 -0.125em 0.125em rgba(0,0,0,0.15)",
          "0 0.25em 0.5em -0.125em rgba(0,122,255,0.5)",
        ].join(", "),
        color: "white",
        "& > span": {
          color: "white",
          textShadow: "0 0.25em 0.05em rgba(0,0,0,0.15)",
        },
      },

      // LQD states (v5)
      "lqd-btn-loading": {
        pointerEvents: "none",
        "& > span": {
          color: "transparent",
          "&::before": {
            content: "''",
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "1em",
            height: "1em",
            marginTop: "-0.5em",
            marginLeft: "-0.5em",
            border: "2px solid rgba(255,255,255,0.30)",
            borderTopColor: "rgba(255,255,255,0.95)",
            borderRadius: "9999px",
            animation: "lx-lqd-spin 0.8s linear infinite",
          },
        },
      },
      "lqd-btn-success": {
        background: "linear-gradient(180deg, #34c759 0%, #248a3d 100%)",
        boxShadow: [
          "inset 0 0.125em 0.125em rgba(255,255,255,0.30)",
          "inset 0 -0.125em 0.125em rgba(0,0,0,0.15)",
          "0 0.25em 0.5em -0.125em rgba(52,199,89,0.5)",
        ].join(", "),
        color: "white",
        "& > span": { color: "white" },
      },
      "lqd-btn-error": {
        background: "linear-gradient(180deg, #ff3b30 0%, #c41e14 100%)",
        boxShadow: [
          "inset 0 0.125em 0.125em rgba(255,255,255,0.30)",
          "inset 0 -0.125em 0.125em rgba(0,0,0,0.15)",
          "0 0.25em 0.5em -0.125em rgba(255,59,48,0.5)",
        ].join(", "),
        color: "white",
        animation: "lx-shake 0.5s ease-in-out",
        "& > span": { color: "white" },
      },
      "lqd-btn-disabled": {
        opacity: "0.4",
        pointerEvents: "none",
        cursor: "not-allowed",
      },

      // LQD shapes + sizes
      "lqd-btn-icon": {
        "& > span": {
          paddingInline: "0.875em",
          paddingBlock: "0.875em",
        },
      },
      "lqd-btn-block": { display: "block", width: "100%" },
      "lqd-btn-sm": { fontSize: "0.75em" },
      "lqd-btn-lg": { fontSize: "1.5em" },

      // ═══════════════════════════════════════════════════════════════
      // CARDS
      // ═══════════════════════════════════════════════════════════════
      "card-luxe": {
        position: "relative",
        background: "var(--garur-surface, #ffffff)",
        borderRadius: "1.5rem",
        padding: "2rem",
        border: "1px solid color-mix(in oklab, var(--garur-fg, #000) 4%, transparent)",
        boxShadow:
          "0 1px 2px rgba(0,0,0,0.03), 0 4px 8px rgba(0,0,0,0.03), 0 16px 32px rgba(0,0,0,0.04), 0 32px 64px -16px rgba(0,0,0,0.06)",
        color: "var(--garur-fg, #0b0b0e)",
      },
      "card-luxe-hover": {
        position: "relative",
        background: "var(--garur-surface, #ffffff)",
        borderRadius: "1.5rem",
        padding: "2rem",
        border: "1px solid color-mix(in oklab, var(--garur-fg, #000) 4%, transparent)",
        boxShadow:
          "0 1px 2px rgba(0,0,0,0.03), 0 4px 8px rgba(0,0,0,0.03), 0 16px 32px rgba(0,0,0,0.04)",
        transition: "all 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow:
            "0 4px 8px rgba(0,0,0,0.03), 0 16px 32px rgba(0,0,0,0.06), 0 48px 96px -16px rgba(0,0,0,0.12)",
        },
      },
      "card-luxe-tilt": {
        position: "relative",
        background: "var(--garur-surface, #ffffff)",
        borderRadius: "1.5rem",
        padding: "2rem",
        border: "1px solid color-mix(in oklab, var(--garur-fg, #000) 4%, transparent)",
        boxShadow: "0 1px 2px rgba(0,0,0,0.03), 0 16px 32px rgba(0,0,0,0.04)",
        transformStyle: "preserve-3d",
        transition:
          "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 500ms ease",
        "&:hover": {
          transform:
            "perspective(1200px) rotateX(4deg) rotateY(-4deg) translateZ(10px)",
          boxShadow:
            "0 4px 8px rgba(0,0,0,0.04), 0 32px 64px -16px rgba(0,0,0,0.15)",
        },
      },
      "card-luxe-spotlight": {
        position: "relative",
        background: "var(--garur-surface, #ffffff)",
        borderRadius: "1.5rem",
        padding: "2rem",
        border: "1px solid color-mix(in oklab, var(--garur-fg, #000) 4%, transparent)",
        boxShadow: "0 1px 2px rgba(0,0,0,0.03), 0 16px 32px rgba(0,0,0,0.04)",
        overflow: "hidden",
        "&::before": {
          content: "''",
          position: "absolute",
          inset: "0",
          background:
            "radial-gradient(600px circle at var(--mx, 50%) var(--my, 50%), rgba(134,87,247,0.10), transparent 40%)",
          opacity: "0",
          transition: "opacity 400ms ease",
          pointerEvents: "none",
        },
        "&:hover::before": { opacity: "1" },
      },

      // ═══════════════════════════════════════════════════════════════
      // BUTTONS
      // ═══════════════════════════════════════════════════════════════
      "btn-luxe-primary": {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        padding: "0.75rem 1.5rem",
        borderRadius: "0.875rem",
        fontWeight: "600",
        fontSize: "0.875rem",
        lineHeight: "1",
        cursor: "pointer",
        border: "none",
        color: "white",
        background: "linear-gradient(180deg, #9565ff 0%, #7a43f0 100%)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.10), 0 4px 16px -2px rgba(134,87,247,0.35)",
        transition: "all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.30), inset 0 -1px 0 rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.10), 0 12px 28px -4px rgba(134,87,247,0.45)",
        },
        "&:active": { transform: "translateY(0) scale(0.98)" },
      },
      "btn-luxe-glass": {
        ...APPLE_GLASS,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        padding: "0.75rem 1.5rem",
        borderRadius: "9999px",
        fontWeight: "600",
        fontSize: "0.875rem",
        lineHeight: "1",
        cursor: "pointer",
        color: "inherit",
        textDecoration: "none",
        transition: "all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        "&:hover": { transform: "translateY(-1px)" },
        "&:active": { transform: "translateY(0) scale(0.98)" },
      },
      "btn-luxe-shine": {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        padding: "0.75rem 1.5rem",
        borderRadius: "0.875rem",
        fontWeight: "600",
        fontSize: "0.875rem",
        lineHeight: "1",
        cursor: "pointer",
        border: "none",
        color: "white",
        background: "linear-gradient(180deg, #9565ff 0%, #7a43f0 100%)",
        position: "relative",
        overflow: "hidden",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.25), 0 4px 16px -2px rgba(134,87,247,0.35)",
        transition: "all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        "&::after": {
          content: "''",
          position: "absolute",
          top: "0",
          left: "-100%",
          width: "60%",
          height: "100%",
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.30), transparent)",
          transform: "skewX(-20deg)",
          animation: "lx-shine-sweep 4s ease-in-out infinite",
          pointerEvents: "none",
        },
      },
      "btn-luxe-holo": {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        padding: "0.75rem 1.5rem",
        borderRadius: "0.875rem",
        fontWeight: "600",
        fontSize: "0.875rem",
        lineHeight: "1",
        cursor: "pointer",
        border: "none",
        color: "white",
        background:
          "linear-gradient(135deg, #ff8ab6 0%, #c894ff 25%, #8cc0ff 50%, #6ee8b0 75%, #ffd670 100%)",
        backgroundSize: "300% 300%",
        animation: "lx-holo-shift 8s ease infinite",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.35), 0 4px 16px -2px rgba(192,132,252,0.40)",
        transition: "all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        "&:hover": { transform: "translateY(-1px)" },
      },

      // ═══════════════════════════════════════════════════════════════
      // CHROME / HOLO / AURORA
      // ═══════════════════════════════════════════════════════════════
      "chrome-surface": {
        background:
          "repeating-linear-gradient(90deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 3px), linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.30) 100%), linear-gradient(180deg, #2a2a30 0%, #14141a 100%)",
        boxShadow:
          "inset 0 1px 0 0 rgba(255,255,255,0.18), inset 0 -1px 0 0 rgba(0,0,0,0.55), 0 1px 2px rgba(0,0,0,0.20), 0 16px 32px rgba(0,0,0,0.30)",
        color: "#e8e8ee",
      },
      "chrome-text": {
        background:
          "linear-gradient(180deg, #ffffff 0%, #d4d4d8 25%, #71717a 50%, #d4d4d8 75%, #ffffff 100%)",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        color: "transparent",
      },
      "chrome-button": {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        padding: "0.75rem 1.5rem",
        borderRadius: "0.875rem",
        fontWeight: "600",
        fontSize: "0.875rem",
        cursor: "pointer",
        border: "none",
        color: "#e8e8ee",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.25) 100%), linear-gradient(180deg, #38383f 0%, #1e1e24 100%)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.45), 0 1px 2px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.25)",
        transition: "all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        "&:hover": { transform: "translateY(-1px)" },
        "&:active": { transform: "translateY(0)" },
      },
      "holo-surface": {
        background:
          "linear-gradient(135deg, rgba(255,107,157,0.55) 0%, rgba(192,132,252,0.45) 25%, rgba(96,165,250,0.55) 50%, rgba(52,211,153,0.45) 75%, rgba(251,191,36,0.55) 100%)",
        backgroundSize: "300% 300%",
        animation: "lx-holo-shift 8s ease infinite",
      },
      "holo-text": {
        background:
          "linear-gradient(135deg, #ff8ab6 0%, #c894ff 25%, #8cc0ff 50%, #6ee8b0 75%, #ffd670 100%)",
        backgroundSize: "300% 300%",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        color: "transparent",
        animation: "lx-holo-shift 6s ease infinite",
      },
      "aurora-blob-1": {
        position: "absolute",
        width: "500px",
        height: "500px",
        borderRadius: "9999px",
        background:
          "radial-gradient(circle, rgba(134,87,247,0.7) 0%, transparent 70%)",
        filter: "blur(80px)",
        opacity: "0.5",
        pointerEvents: "none",
        animation: "lx-aurora-1 18s ease-in-out infinite",
      },
      "aurora-blob-2": {
        position: "absolute",
        width: "450px",
        height: "450px",
        borderRadius: "9999px",
        background:
          "radial-gradient(circle, rgba(229,76,181,0.6) 0%, transparent 70%)",
        filter: "blur(80px)",
        opacity: "0.45",
        pointerEvents: "none",
        animation: "lx-aurora-2 22s ease-in-out infinite",
      },
      "aurora-blob-3": {
        position: "absolute",
        width: "400px",
        height: "400px",
        borderRadius: "9999px",
        background:
          "radial-gradient(circle, rgba(26,138,222,0.6) 0%, transparent 70%)",
        filter: "blur(80px)",
        opacity: "0.4",
        pointerEvents: "none",
        animation: "lx-aurora-3 20s ease-in-out infinite",
      },

      // ═══════════════════════════════════════════════════════════════
      // PHYSICS — CSS-only transition hints (JS feeds the vars)
      // ═══════════════════════════════════════════════════════════════
      "physics-spring": { transition: "all 500ms cubic-bezier(0.34, 1.56, 0.64, 1)" },
      "physics-spring-soft": { transition: "all 400ms cubic-bezier(0.16, 1, 0.3, 1)" },
      "physics-spring-snappy": { transition: "all 200ms cubic-bezier(0.25, 1.5, 0.5, 1)" },
      "physics-magnetic": {
        transition: "transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        "&:hover": {
          transform:
            "translate(var(--mx-offset, 0), var(--my-offset, 0)) scale(1.02)",
        },
      },
      "physics-elastic": {
        transition: "all 600ms cubic-bezier(0.68, -0.6, 0.32, 1.6)",
        "&:active": { transform: "scale(0.92)" },
      },
      "physics-parallax": {
        transition: "transform 100ms linear",
        transform:
          "translate3d(calc(var(--parallax-x, 0) * 8px), calc(var(--parallax-y, 0) * 8px), 0)",
        willChange: "transform",
      },
      "physics-float": { animation: "lx-float 4s ease-in-out infinite" },
      "physics-breathe": { animation: "lx-breathe 4s ease-in-out infinite" },

      // ═══════════════════════════════════════════════════════════════
      // MICRO-INTERACTIONS
      // ═══════════════════════════════════════════════════════════════
      "tilt-soft": {
        transition: "transform 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        "&:hover": {
          transform:
            "perspective(1200px) rotateX(2deg) rotateY(-2deg) translateZ(6px)",
        },
      },
      "tilt-hard": {
        transition: "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        "&:hover": {
          transform:
            "perspective(1000px) rotateX(6deg) rotateY(-6deg) translateZ(16px)",
        },
      },
      "lift-shadow": {
        transition: "all 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow:
            "0 4px 8px rgba(0,0,0,0.04), 0 24px 48px -12px rgba(0,0,0,0.20)",
        },
      },
      "pop-glow": {
        transition: "all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        "&:hover": { transform: "scale(1.03)" },
      },
      "shine-sweep": {
        position: "relative",
        overflow: "hidden",
        "&::after": {
          content: "''",
          position: "absolute",
          top: "0",
          left: "-100%",
          width: "50%",
          height: "100%",
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
          transform: "skewX(-20deg)",
          animation: "lx-shine-sweep 5s ease-in-out infinite",
          pointerEvents: "none",
        },
      },
      "focus-glow": {
        "&:focus-visible": {
          outline: "2px solid #8657f7",
          outlineOffset: "3px",
          boxShadow: "0 0 0 6px color-mix(in oklab, #8657f7 22%, transparent)",
        },
      },
    });
  },
};