// tests/utility-check.mjs
// ─────────────────────────────────────────────────────────
// Comprehensive utility verification test
// ─────────────────────────────────────────────────────────

import {
  initConfig,
  build,
  hasUtility,
  getCacheStats,
  resetCacheStats,
} from "../src/native.ts";

// ═══════════════════════════════════════════════
// Setup
// ═══════════════════════════════════════════════

initConfig(JSON.stringify({
  breakpoints: {
    sm: "640px", md: "768px", lg: "1024px",
    xl: "1280px", "2xl": "1536px",
  },
  darkMode: "class",
  palette: {},
}));

// ═══════════════════════════════════════════════
// Test data
// ═══════════════════════════════════════════════

const utilities = {
  // ── Spacing ──
  spacing: [
    "p-0", "p-1", "p-4", "p-8", "p-16", "p-32", "p-64", "p-96",
    "px-4", "py-4", "pt-4", "pr-4", "pb-4", "pl-4",
    "ps-4", "pe-4",
    "m-4", "mx-4", "my-4", "mt-4", "mr-4", "mb-4", "ml-4",
    "ms-4", "me-4",
    "-m-4", "-mx-4", "-my-4", "-mt-4", "-ml-4",
    "m-auto", "mx-auto", "my-auto",
    "gap-4", "gap-x-4", "gap-y-4",
    "space-x-4", "space-y-4",
    "p-0.5", "p-2.5", "p-3.5",
  ],

  // ── Sizing ──
  sizing: [
    "w-0", "w-4", "w-16", "w-32", "w-64", "w-96",
    "w-1/2", "w-1/3", "w-2/3", "w-1/4", "w-3/4",
    "w-full", "w-screen", "w-auto", "w-min", "w-max", "w-fit",
    "h-4", "h-16", "h-64", "h-full", "h-screen", "h-auto",
    "size-4", "size-8", "size-16",
    "min-w-0", "min-w-full", "min-h-0", "min-h-full", "min-h-screen",
    "max-w-xs", "max-w-sm", "max-w-md", "max-w-lg",
    "max-w-xl", "max-w-2xl", "max-w-4xl", "max-w-7xl", "max-w-prose",
  ],

  // ── Layout ──
  layout: [
    "block", "inline-block", "inline", "flex", "inline-flex",
    "grid", "inline-grid", "hidden", "contents", "flow-root",
    "table", "table-cell", "table-row", "list-item",
  ],

  // ── Position ──
  position: [
    "static", "fixed", "absolute", "relative", "sticky",
    "inset-0", "inset-4", "inset-x-4", "inset-y-4",
    "top-0", "top-4", "top-1/2", "top-full",
    "right-0", "right-4", "right-1/2",
    "bottom-0", "bottom-4", "bottom-full",
    "left-0", "left-4", "left-1/2", "left-full",
    "start-0", "start-4", "end-0", "end-4",
    "inset-auto", "top-auto",
    "z-0", "z-10", "z-20", "z-50", "z-auto",
  ],

  // ── Flex ──
  flex: [
    "flex-row", "flex-col", "flex-row-reverse", "flex-col-reverse",
    "flex-wrap", "flex-nowrap", "flex-wrap-reverse",
    "flex-1", "flex-auto", "flex-initial", "flex-none",
    "grow", "grow-0", "shrink", "shrink-0",
    "justify-start", "justify-end", "justify-center",
    "justify-between", "justify-around", "justify-evenly",
    "items-start", "items-end", "items-center",
    "items-baseline", "items-stretch",
    "content-start", "content-center", "content-between",
    "self-start", "self-end", "self-center", "self-stretch",
    "order-1", "order-2", "order-first", "order-last",
  ],

  // ── Grid ──
  grid: [
    "grid-cols-1", "grid-cols-2", "grid-cols-3", "grid-cols-4",
    "grid-cols-6", "grid-cols-12",
    "grid-rows-1", "grid-rows-2", "grid-rows-3",
    "col-span-1", "col-span-2", "col-span-full",
    "row-span-1", "row-span-2", "row-span-full",
    "col-start-1", "col-start-2", "col-end-2", "col-end-4",
    "row-start-1", "row-end-2",
    "grid-flow-row", "grid-flow-col", "grid-flow-dense",
    "auto-cols-auto", "auto-cols-min", "auto-cols-max", "auto-cols-fr",
    "auto-rows-auto", "auto-rows-min", "auto-rows-fr",
  ],

  // ── Typography ──
  typography: [
    "text-xs", "text-sm", "text-base", "text-lg", "text-xl",
    "text-2xl", "text-3xl", "text-4xl", "text-5xl", "text-6xl",
    "font-thin", "font-light", "font-normal", "font-medium",
    "font-semibold", "font-bold", "font-extrabold", "font-black",
    "font-sans", "font-serif", "font-mono",
    "italic", "not-italic",
    "uppercase", "lowercase", "capitalize", "normal-case",
    "underline", "line-through", "no-underline", "overline",
    "text-left", "text-center", "text-right", "text-justify",
    "leading-none", "leading-tight", "leading-normal", "leading-loose",
    "tracking-tight", "tracking-normal", "tracking-wide", "tracking-widest",
    "truncate", "text-ellipsis", "text-clip",
    "whitespace-nowrap", "whitespace-pre", "whitespace-pre-wrap",
    "break-words", "break-all", "break-keep",
    "list-disc", "list-decimal", "list-none",
    "list-inside", "list-outside",
    "line-clamp-1", "line-clamp-2", "line-clamp-3", "line-clamp-none",
  ],

  // ── Colors ──
  colors: [
    // Background
    "bg-white", "bg-black", "bg-transparent", "bg-current",
    "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500",
    "bg-gray-100", "bg-gray-900", "bg-slate-50", "bg-slate-900",
    "bg-red-500/50", "bg-blue-500/25", "bg-black/10",
    // Text
    "text-white", "text-black", "text-red-500", "text-blue-600",
    "text-gray-700", "text-slate-900",
    "text-red-500/80",
    // Border
    "border-red-500", "border-blue-500", "border-gray-300",
    "border-transparent", "border-current",
    // Gradient stops
    "from-red-500", "from-blue-500", "from-indigo-500",
    "via-purple-500", "via-pink-500",
    "to-pink-500", "to-yellow-500",
    // Ring
    "ring-red-500", "ring-blue-500", "ring-offset-4",
    // Fill/Stroke
    "fill-current", "fill-none", "fill-blue-500",
    "stroke-current", "stroke-none", "stroke-blue-500",
    // Accent
    "accent-red-500", "accent-blue-500",
    "caret-blue-500",
  ],

  // ── Borders ──
  borders: [
    "border", "border-0", "border-2", "border-4", "border-8",
    "border-t", "border-r", "border-b", "border-l",
    "border-t-2", "border-b-4",
    "border-solid", "border-dashed", "border-dotted",
    "border-double", "border-none",
    "rounded", "rounded-none", "rounded-sm", "rounded-md",
    "rounded-lg", "rounded-xl", "rounded-2xl", "rounded-3xl",
    "rounded-full",
    "rounded-t-lg", "rounded-r-lg", "rounded-b-lg", "rounded-l-lg",
    "rounded-tl-lg", "rounded-tr-lg", "rounded-bl-lg", "rounded-br-lg",
    "divide-x", "divide-y", "divide-x-2", "divide-y-2",
    "divide-red-500", "divide-blue-500",
    "outline", "outline-0", "outline-1", "outline-2", "outline-4",
    "outline-none", "outline-dashed", "outline-dotted",
  ],

  // ── Effects ──
  effects: [
    "shadow", "shadow-sm", "shadow-md", "shadow-lg", "shadow-xl",
    "shadow-2xl", "shadow-inner", "shadow-none",
    "opacity-0", "opacity-25", "opacity-50", "opacity-75", "opacity-100",
    "mix-blend-multiply", "mix-blend-screen", "mix-blend-overlay",
    "bg-blend-multiply",
    "backdrop-blur", "backdrop-blur-sm", "backdrop-blur-md",
    "backdrop-blur-lg", "backdrop-blur-xl",
    "backdrop-brightness-50", "backdrop-contrast-125",
  ],

  // ── Transforms ──
  transforms: [
    "transform", "transform-none", "transform-gpu",
    "rotate-0", "rotate-45", "rotate-90", "rotate-180",
    "-rotate-45", "-rotate-90",
    "scale-0", "scale-50", "scale-75", "scale-100", "scale-125", "scale-150",
    "scale-x-50", "scale-y-75",
    "translate-x-0", "translate-x-4", "translate-x-1/2", "translate-x-full",
    "translate-y-0", "translate-y-4", "translate-y-1/2", "translate-y-full",
    "-translate-x-4", "-translate-y-4",
    "skew-x-0", "skew-x-3", "skew-y-3", "skew-y-6",
    "origin-center", "origin-top", "origin-top-right",
    "origin-bottom", "origin-left",
  ],

  // ── Transitions ──
  transitions: [
    "transition", "transition-none", "transition-all",
    "transition-colors", "transition-opacity",
    "transition-shadow", "transition-transform",
    "duration-0", "duration-75", "duration-150", "duration-300",
    "duration-500", "duration-700", "duration-1000",
    "delay-0", "delay-75", "delay-150", "delay-300", "delay-700",
    "ease-linear", "ease-in", "ease-out", "ease-in-out",
  ],

  // ── Animations ──
  animations: [
    "animate-none", "animate-spin", "animate-ping",
    "animate-pulse", "animate-bounce",
  ],

  // ── Filters ──
  filters: [
    "blur-none", "blur-sm", "blur", "blur-md", "blur-lg", "blur-xl",
    "brightness-0", "brightness-50", "brightness-100", "brightness-150",
    "contrast-0", "contrast-100", "contrast-200",
    "grayscale", "grayscale-0", "invert", "invert-0", "sepia", "sepia-0",
    "saturate-0", "saturate-100", "saturate-200",
    "hue-rotate-0", "hue-rotate-90", "hue-rotate-180",
    "filter-none", "backdrop-filter-none",
  ],

  // ── Interaction ──
  interaction: [
    "cursor-auto", "cursor-default", "cursor-pointer", "cursor-wait",
    "cursor-text", "cursor-move", "cursor-help", "cursor-not-allowed",
    "cursor-grab", "cursor-grabbing", "cursor-zoom-in", "cursor-zoom-out",
    "select-none", "select-text", "select-all", "select-auto",
    "pointer-events-none", "pointer-events-auto",
    "resize", "resize-none", "resize-x", "resize-y",
    "appearance-none", "appearance-auto",
    "scroll-auto", "scroll-smooth",
    "snap-none", "snap-x", "snap-y", "snap-both",
    "snap-start", "snap-center", "snap-end", "snap-align-none",
    "snap-mandatory", "snap-proximity",
    "touch-auto", "touch-none", "touch-pan-x", "touch-pan-y",
    "touch-manipulation",
    "will-change-auto", "will-change-scroll",
    "will-change-contents", "will-change-transform",
  ],

  // ── Filters/misc ──
  misc: [
    "aspect-auto", "aspect-square", "aspect-video",
    "object-contain", "object-cover", "object-fill", "object-none",
    "object-center", "object-top", "object-bottom",
    "overflow-auto", "overflow-hidden", "overflow-visible", "overflow-scroll",
    "overflow-x-auto", "overflow-y-auto",
    "overscroll-auto", "overscroll-contain", "overscroll-none",
    "visible", "invisible", "collapse",
    "isolate", "isolation-auto",
    "box-border", "box-content",
    "sr-only", "not-sr-only",
    "antialiased", "subpixel-antialiased",
    "field-sizing-content", "field-sizing-fixed",
    "scheme-dark", "scheme-light", "scheme-normal",
    "text-wrap", "text-nowrap", "text-balance", "text-pretty",
  ],

  // ── Variants ──
  variants: [
    "hover:bg-blue-500",
    "focus:ring-2",
    "focus:ring-blue-500",
    "active:scale-95",
    "disabled:opacity-50",
    "checked:bg-blue-500",
    "dark:bg-gray-900",
    "dark:text-white",
    "md:flex",
    "lg:grid-cols-3",
    "sm:hidden",
    "hover:md:bg-red-500",
    "md:hover:bg-red-500",
    "first:mt-0",
    "last:mb-0",
    "odd:bg-gray-50",
    "even:bg-white",
    "group-hover:opacity-100",
    "peer-checked:block",
    "before:content-['']",
    "after:absolute",
    "print:hidden",
    "motion-safe:animate-spin",
    "motion-reduce:transition-none",
  ],

  // ── Arbitrary ──
  arbitrary: [
    "w-[137px]", "h-[50vh]",
    "bg-[#abc123]", "text-[#ff0000]",
    "p-[3px]", "m-[2rem]",
    "top-[42px]", "left-[10%]",
    "grid-cols-[repeat(3,1fr)]",
    "text-[14px]",
    "[mask-type:luminance]",
    "[color:red]",
    "bg-red-500/50",
    "text-blue-500/[0.3]",
  ],
};

// ═══════════════════════════════════════════════
// Test runner
// ═══════════════════════════════════════════════

const results = {
  passed: 0,
  failed: 0,
  empty: 0,
  failures: [],
  categories: {},
};

function runCategory(name, items) {
  const catResult = { passed: 0, failed: 0, failures: [] };
  console.log(`\n▶ ${name.toUpperCase()} (${items.length} items)`);

  for (const cls of items) {
    const output = build(cls);
    if (output === null || output === undefined || output === "") {
      catResult.failed++;
      catResult.failures.push(cls);
      console.log(`  ❌ ${cls}`);
    } else {
      catResult.passed++;
    }
  }

  const rate = ((catResult.passed / items.length) * 100).toFixed(0);
  const icon = catResult.failed === 0 ? "✅" : catResult.failed < items.length / 2 ? "⚠️" : "❌";
  console.log(`  ${icon} ${catResult.passed}/${items.length} passed (${rate}%)`);

  results.passed += catResult.passed;
  results.failed += catResult.failed;
  results.categories[name] = catResult;
  results.failures.push(...catResult.failures);
}

// Run all
const start = Date.now();

for (const [name, items] of Object.entries(utilities)) {
  runCategory(name, items);
}

const elapsed = Date.now() - start;

// ═══════════════════════════════════════════════
// Summary
// ═══════════════════════════════════════════════

const total = results.passed + results.failed;
const rate = ((results.passed / total) * 100).toFixed(1);

console.log("\n" + "═".repeat(60));
console.log("  SUMMARY");
console.log("═".repeat(60));
console.log(`  Total utilities:   ${total}`);
console.log(`  ✅ Passed:         ${results.passed}`);
console.log(`  ❌ Failed:         ${results.failed}`);
console.log(`  Success rate:      ${rate}%`);
console.log(`  Time:              ${elapsed}ms`);
console.log(`  Avg per utility:   ${(elapsed / total).toFixed(2)}ms`);

console.log("\n  Category breakdown:");
for (const [name, r] of Object.entries(results.categories)) {
  const bar = "█".repeat(Math.round((r.passed / (r.passed + r.failed)) * 20));
  const icon = r.failed === 0 ? "✅" : "⚠️ ";
  console.log(`  ${icon} ${name.padEnd(15)} ${bar} ${r.passed}/${r.passed + r.failed}`);
}

if (results.failures.length > 0 && results.failures.length <= 50) {
  console.log("\n  ⚠️  Failed utilities:");
  for (const f of results.failures) {
    console.log(`    - ${f}`);
  }
}

console.log("\n" + "═".repeat(60));

// Cache stats
try {
  const stats = getCacheStats();
  console.log("\n  Cache stats (this run):");
  console.log(`    Build hits:   ${stats.build_hits}`);
  console.log(`    Build misses: ${stats.build_misses}`);
  console.log(`    Parse hits:   ${stats.parse_hits}`);
  console.log(`    Parse misses: ${stats.parse_misses}`);
  console.log(`    Cache entries: ${stats.build_entries}`);
} catch { /* ignore */ }

console.log("");

process.exit(results.failed > 0 ? 1 : 0);