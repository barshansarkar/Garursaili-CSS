import typography from "./packages/plugin-typography/index.ts";
import forms from "./packages/plugin-forms/index.ts";
import animate from "./packages/plugin-animate/index.ts";
import glass from "./packages/plugin-glass/index.ts";
import neon from "./packages/plugin-neon/index.ts";
import threeD from "./packages/plugin-3d/index.ts";
import patterns from "./packages/plugin-patterns/index.ts";
import scrollbar from "./packages/plugin-scrollbar/index.ts";
import aurora from "./packages/plugin-aurora/index.ts";
import shadcn from "./packages/plugin-shadcn-compat/index.ts";
import gradientText from "./packages/plugin-gradient-text/index.ts";
import textEffects from "./packages/plugin-text-effects/index.ts";
import proseBlog from "./packages/plugin-prose-blog/index.ts";
import codeSyntax from "./packages/plugin-code-syntax/index.ts";
import dropCap from "./packages/plugin-drop-cap/index.ts";
import quotes from "./packages/plugin-quotes/index.ts";
import masonry from "./packages/plugin-masonry/index.ts";
import bento from "./packages/plugin-bento/index.ts";
import stickyHeaders from "./packages/plugin-sticky-headers/index.ts";
import splitscreen from "./packages/plugin-splitscreen/index.ts";
import sidebar from "./packages/plugin-sidebar/index.ts";
import containerQueries from "./packages/plugin-container-queries/index.ts";
import tooltips from "./packages/plugin-tooltips/index.ts";
import popovers from "./packages/plugin-popovers/index.ts";
import modals from "./packages/plugin-modals/index.ts";
import drawers from "./packages/plugin-drawers/index.ts";
import tabs from "./packages/plugin-tabs/index.ts";
import accordion from "./packages/plugin-accordion/index.ts";
import dropdowns from "./packages/plugin-dropdowns/index.ts";
import commandPalette from "./packages/plugin-command-palette/index.ts";
import carousel from "./packages/plugin-carousel/index.ts";
import gallery from "./packages/plugin-gallery/index.ts";
import videoWrapper from "./packages/plugin-video-wrapper/index.ts";
import charts from "./packages/plugin-charts/index.ts";
import timelines from "./packages/plugin-timelines/index.ts";
import tables from "./packages/plugin-tables/index.ts";
import kanban from "./packages/plugin-kanban/index.ts";
import pricingTables from "./packages/plugin-pricing-tables/index.ts";
import productCards from "./packages/plugin-product-cards/index.ts";
import ratings from "./packages/plugin-ratings/index.ts";
import spotlight from "./packages/plugin-spotlight/index.ts";
import gradientBorders from "./packages/plugin-gradient-borders/index.ts";
import glitch from "./packages/plugin-glitch/index.ts";
import parallax from "./packages/plugin-parallax/index.ts";
import matrix from "./packages/plugin-matrix/index.ts";
import confetti from "./packages/plugin-confetti/index.ts";
import themeSwitcher from "./packages/plugin-theme-switcher/index.ts";
import rtlSupport from "./packages/plugin-rtl-support/index.ts";
import printStyles from "./packages/plugin-print-styles/index.ts";
import skeletonLoaders from "./packages/plugin-skeleton-loaders/index.ts";
import reducedMotion from "./packages/plugin-reduced-motion/index.ts";
import focusVisible from "./packages/plugin-focus-visible/index.ts";
import luxe from "./packages/plugin-luxe/index.ts";

export default {
  breakpoints: { sm: "640px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1536px" },
  darkMode: "class",
  important: false,
  palette: {},
  plugins: [luxe, 
    typography, forms, animate, glass, neon, threeD,
    patterns, scrollbar, aurora, shadcn,
    gradientText, textEffects, proseBlog, codeSyntax, dropCap, quotes,
    masonry, bento, stickyHeaders, splitscreen, sidebar, containerQueries,
    tooltips, popovers, modals, drawers, tabs, accordion, dropdowns, commandPalette,
    carousel, gallery, videoWrapper, charts, timelines,
    tables, kanban, pricingTables, productCards, ratings,
    spotlight, gradientBorders, glitch, parallax, matrix, confetti,
    themeSwitcher, rtlSupport, printStyles, skeletonLoaders,
    reducedMotion, focusVisible,
  ],
};
