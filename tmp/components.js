// src/components.ts
// ⚡ Garur-CSS Core Components Engine v3.1
// - FIXED: Navbar bullets removed (list-style: none on ul/li)
// - ENHANCED: Full mobile responsiveness across all components (sm, md, lg breakpoints)
// - SLEEKED: Reduced padding, shadows, and radii for cards, inputs, buttons (sleek modern look)
// - CONSISTENCY: All components now match navbar's refined, minimal aesthetic
// - UPGRADED: Thinner borders, subtler shadows, optimized glassmorphism for sleekness
// - ADDED: Explicit ul/li styles in navbar for bullet removal
// - RESPONSIVE: Fluid scaling, better mobile stacking, touch-friendly sizes
// - Dark/Light variants maintained with seamless switching
import { buttons } from "./COMPONENTS/button";
import { card } from "./COMPONENTS/cards";
import { hero } from "./COMPONENTS/hero";
import { alert } from "./COMPONENTS/alert";
import { primary, primaryDark, primaryLight, success, successDark, successLight, danger, dangerDark, dangerLight, warning, warningDark, warningLight, info, infoDark, infoLight, textDark, textLight, surfaceLight, surfaceDark, surfaceAltLight, surfaceAltDark, borderColorLight, borderColorDark, radiusSm, radiusMd, radiusLg, radiusXl, shadowSm, shadowMd, shadowLg, shadowXl, blurGlass, blurGlassHeavy, standardTransition, mergeStyles, inputBase } from "./CORECONST";
import { navbar } from "./COMPONENTS/navbar";
import { inputs } from "./COMPONENTS/input";
import { formGroups } from "./COMPONENTS/formgroups";
import { inputGroups } from "./COMPONENTS/inputGroup";
import { Accordion } from "./COMPONENTS/accordation";
import { textarea } from "./COMPONENTS/textarea";
import { avatar } from "./COMPONENTS/avatar";
import { footer } from "./COMPONENTS/footer";
import { progress } from "./COMPONENTS/progress";
import { badges } from "./COMPONENTS/badge";
import { Tooltip } from "./COMPONENTS/tooltip";
import { sidebar } from "./COMPONENTS/sidebar";
import { Spinner } from "./COMPONENTS/spinners";
import { Container } from "./COMPONENTS/containner";
import { Breadcrumb } from "./COMPONENTS/breadcrumb";
import { Dropdown } from "./COMPONENTS/dropdown";
import { Toast } from "./COMPONENTS/toast";
import { Skeleton } from "./COMPONENTS/skeleton";
import { TABS } from "./COMPONENTS/tab";
import { pricingCard } from "./COMPONENTS/pricingcard";
import { Modal } from "./COMPONENTS/modal";
// 🌟 Refined Core Components (Sleek & Responsive)
export const components = {
    // 🧭 REFINED RESPONSIVE NAVIGATION (Bullets Fixed, Enhanced Responsive)
    // 🎯 FIXED NAVBAR COMPONENTS - CORE LEVEL
    // 💎 Enhanced Container (Fluid)
    ...navbar,
    ...Container,
    // 🧱 SLEEKED Modern Cards (Reduced Padding/Shadows)
    // 🔘 SLEEKED Button System (Reduced Sizes)
    ...buttons,
    ...card,
    // 🦸 Enhanced Hero Sections (Sleek)
    // PRO-GRADE HERO (drop-in replacement for your old one)
    // src/components.ts
    // ... (all your existing imports, tokens, bases, etc. remain 100% unchanged)
    // ONLY HERO SECTION MODIFIED BELOW
    // Ultra-Sleek Modern Hero v5 — Fluid, Glassmorphic, Animated Mesh + Grid
    // src/components.ts - HERO SECTION ONLY (Replace your current hero components)
    // 🌟 ULTRA-SLEEK MODERN HERO v5.1 - PERFECTED
    // - Fixed all TypeScript errors
    // - Added missing animations
    // - Enhanced performance
    // - Better responsive design
    // - Perfect dark/light system
    ...hero,
    // 📦 SLEEKED Input Fields (Reduced Padding)
    ...inputs,
    // 📝 TEXTAREA
    ...textarea,
    areaLg: {
        base: mergeStyles(inputBase, {
            minHeight: "8rem",
            padding: "1rem 1.25rem",
            fontSize: "1rem",
        }),
    },
    // 🔘 SELECT DROPDOWN
    select: {
        base: mergeStyles(inputBase, {
            appearance: "none",
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 0.75rem center",
            backgroundSize: "1rem",
            paddingRight: "2.5rem",
        }),
    },
    selectMultiple: {
        base: mergeStyles(inputBase, {
            padding: "0.75rem",
            height: "auto",
            minHeight: "6rem",
            backgroundImage: "none",
        }),
    },
    // ☑️ CHECKBOX & RADIO
    checkbox: {
        base: {
            width: "1.25rem",
            height: "1.25rem",
            borderRadius: radiusSm,
            border: `1px solid ${borderColorLight}`,
            backgroundColor: surfaceLight,
            appearance: "none",
            cursor: "pointer",
            transition: standardTransition,
            position: "relative",
            "&:checked": {
                backgroundColor: primary,
                borderColor: primary,
                backgroundImage: `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e")`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "0.75rem",
            },
            "&:focus": {
                outline: "none",
                boxShadow: `0 0 0 2px ${primary}20`,
                borderColor: primary,
            },
        },
    },
    radio: {
        base: {
            width: "1.25rem",
            height: "1.25rem",
            borderRadius: "50%",
            border: `1px solid ${borderColorLight}`,
            backgroundColor: surfaceLight,
            appearance: "none",
            cursor: "pointer",
            transition: standardTransition,
            "&:checked": {
                backgroundColor: primary,
                borderColor: primary,
                backgroundImage: `radial-gradient(circle, white 30%, transparent 30%)`,
            },
            "&:focus": {
                outline: "none",
                boxShadow: `0 0 0 2px ${primary}20`,
                borderColor: primary,
            },
        },
    },
    // 🔍 SEARCH INPUT
    searchInput: {
        base: mergeStyles(inputBase, {
            paddingLeft: "2.5rem",
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' /%3e%3c/svg%3e")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "left 0.75rem center",
            backgroundSize: "1rem",
        }),
    },
    // 📎 FILE UPLOAD
    fileUpload: {
        base: mergeStyles(inputBase, {
            padding: "0.75rem",
            border: `2px dashed ${borderColorLight}`,
            background: surfaceAltLight,
            textAlign: "center",
            cursor: "pointer",
            "&:hover": {
                borderColor: primary,
                background: "rgba(59, 130, 246, 0.05)",
            },
            "&::file-selector-button": {
                display: "none",
            },
        }),
    },
    fileUploadActive: {
        base: mergeStyles(inputBase, {
            padding: "0.75rem",
            border: `2px dashed ${primary}`,
            background: "rgba(59, 130, 246, 0.05)",
            textAlign: "center",
        }),
    },
    // 🎚️ RANGE SLIDER
    rangeSlider: {
        base: {
            width: "100%",
            height: "0.375rem",
            borderRadius: radiusSm,
            background: surfaceAltLight,
            outline: "none",
            appearance: "none",
            backdropFilter: blurGlass,
            transition: standardTransition,
            "&::-webkit-slider-thumb": {
                appearance: "none",
                height: "1.25rem",
                width: "1.25rem",
                borderRadius: "50%",
                background: primary,
                cursor: "pointer",
                boxShadow: shadowSm,
                transition: standardTransition,
                "&:hover": {
                    transform: "scale(1.1)",
                    boxShadow: shadowMd,
                },
            },
            "&::-moz-range-thumb": {
                height: "1.25rem",
                width: "1.25rem",
                borderRadius: "50%",
                background: primary,
                cursor: "pointer",
                border: "none",
                boxShadow: shadowSm,
            },
        },
    },
    // 🏗️ FORM LAYOUT COMPONENTS
    ...formGroups,
    // 🎯 FORM ELEMENT GROUPS
    ...inputGroups,
    checkboxDark: {
        base: {
            width: "1.25rem",
            height: "1.25rem",
            borderRadius: radiusSm,
            border: `1px solid ${borderColorDark}`,
            backgroundColor: surfaceDark,
            appearance: "none",
            cursor: "pointer",
            transition: standardTransition,
            position: "relative",
            "&:checked": {
                backgroundColor: primaryLight,
                borderColor: primaryLight,
                backgroundImage: `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e")`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "0.75rem",
            },
        },
    },
    // 🎛️ SWITCH TOGGLE
    switch: {
        base: {
            width: "3rem",
            height: "1.5rem",
            borderRadius: "0.75rem",
            backgroundColor: surfaceAltLight,
            border: `1px solid ${borderColorLight}`,
            appearance: "none",
            cursor: "pointer",
            position: "relative",
            transition: "all 0.3s ease",
            "&::before": {
                content: '""',
                position: "absolute",
                width: "1.25rem",
                height: "1.25rem",
                borderRadius: "50%",
                backgroundColor: surfaceLight,
                top: "0.125rem",
                left: "0.125rem",
                transition: "all 0.3s ease",
                boxShadow: shadowSm,
            },
            "&:checked": {
                backgroundColor: primary,
                borderColor: primary,
                "&::before": {
                    transform: "translateX(1.5rem)",
                    backgroundColor: surfaceLight,
                },
            },
        },
    },
    // 🪞 Enhanced Modal (Sleek)
    ...Modal,
    // 🧠 Enhanced Alert System (Sleek Padding)
    ...alert,
    // 🌐 Enhanced Modern Footer (Sleek)
    ...footer,
    // 🎯 Enhanced Avatar (Sleek)
    ...avatar,
    // 📊 Enhanced Progress Bar (Thinner)
    ...progress,
    // 🎪 Enhanced Tabs (Sleek)
    ...TABS,
    // 🎚️ Enhanced Slider (Sleek)
    slider: {
        base: {
            width: "100%",
            height: "0.375rem", // Thinner
            "border-radius": radiusSm,
            background: surfaceAltLight,
            outline: "none",
            appearance: "none",
            "backdrop-filter": blurGlass,
            transition: standardTransition,
            "&::-webkit-slider-thumb": {
                height: "1rem",
                width: "1rem",
                "border-radius": "50%",
                background: primary,
                cursor: "pointer",
            },
        },
    },
    sliderDark: {
        base: mergeStyles({
            width: "100%",
            height: "0.375rem",
            "border-radius": radiusSm,
            background: surfaceAltDark,
            outline: "none",
            appearance: "none",
            "backdrop-filter": blurGlass,
            transition: standardTransition,
            "&::-webkit-slider-thumb": {
                height: "1rem",
                width: "1rem",
                "border-radius": "50%",
                background: primaryLight,
                cursor: "pointer",
            },
        }, {}, 'dark'),
    },
    // 🗂️ Enhanced Accordion (Sleek)
    ...Accordion,
    // 🎪 ENHANCED ACCORDION SYSTEM (Sleek & Responsive)
    // 🎨 Enhanced Gradient Text
    textGradient: {
        base: {
            background: `linear-gradient(135deg, ${primaryDark}, primary, ${primaryLight})`,
            "background-clip": "text",
            "-webkit-background-clip": "text",
            "-webkit-text-fill-color": "transparent",
            "font-weight": "700",
        },
    },
    textGradientDark: {
        base: {
            background: `linear-gradient(135deg, ${primaryLight}, primary)`,
            "background-clip": "text",
            "-webkit-background-clip": "text",
            "-webkit-text-fill-color": "transparent",
            "font-weight": "700",
        },
    },
    // 🏷️ Enhanced Chip/Tag (Sleek)
    chip: {
        base: {
            display: "inline-flex",
            "align-items": "center",
            gap: "0.375rem",
            padding: "0.375rem 0.75rem",
            "border-radius": radiusMd,
            background: surfaceAltLight,
            color: textDark,
            "font-size": "0.8125rem",
            "font-weight": "500",
            border: `1px solid ${borderColorLight}`,
            "backdrop-filter": blurGlass,
            transition: standardTransition,
        },
    },
    chipDark: {
        base: mergeStyles({
            display: "inline-flex",
            "align-items": "center",
            gap: "0.375rem",
            padding: "0.375rem 0.75rem",
            "border-radius": radiusMd,
            background: surfaceAltDark,
            color: textLight,
            "font-size": "0.8125rem",
            "font-weight": "500",
            border: `1px solid ${borderColorDark}`,
            "backdrop-filter": blurGlass,
            transition: standardTransition,
        }, {}, 'dark'),
    },
    // badge system sleek
    // 🏷️ ENHANCED BADGE SYSTEM (Complete & Sleek)
    ...badges,
    // 📍 Enhanced Tooltip (Sleek)
    ...Tooltip,
    tipSuccess: {
        base: {
            padding: "1rem",
            borderLeft: " 4px solid #10b981",
            background: "#f0fdf4",
            margin: "1.5rem 0",
            borderRadius: "0 0.5rem 0.5rem 0",
        }
    },
    tipWarning: {
        base: {
            padding: "1rem",
            borderLeft: "4px solid #ef4444",
            background: "#fef2f2",
            margin: "1.5rem 0",
            borderRadius: "0 0.5rem 0.5rem 0",
        }
    },
    tipInfo: {
        base: {
            padding: "1rem",
            borderLeft: " 4px solid rgb(15, 69, 141)",
            background: "#ADD8E6",
            margin: "1.5rem 0",
            borderRadius: "0 0.5rem 0.5rem 0",
        }
    },
    tipSuccessDark: {
        base: {
            background: " #166534", borderLeftColor: "#22c55e"
        }
    },
    // 🎯 Enhanced Dropdown (Sleek)
    ...Dropdown,
    // 🍞 BREADCRUMBS
    ...Breadcrumb,
    // 🔢 PAGINATION
    pagination: {
        base: {
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
            flexWrap: "wrap",
        },
    },
    paginationItem: {
        base: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "2.5rem",
            height: "2.5rem",
            padding: "0 0.75rem",
            borderRadius: radiusSm,
            border: `1px solid ${borderColorLight}`,
            background: surfaceLight,
            color: textDark,
            textDecoration: "none",
            fontSize: "0.875rem",
            fontWeight: "500",
            transition: standardTransition,
            "&:hover": {
                background: surfaceAltLight,
                borderColor: primary,
                color: primary,
            },
            "&.paginationActive": {
                background: primary,
                borderColor: primary,
                color: "#fff",
            },
            "&.paginationDisabled": {
                opacity: "0.5",
                cursor: "not-allowed",
                "&:hover": {
                    background: surfaceLight,
                    borderColor: borderColorLight,
                    color: textDark,
                },
            },
        },
    },
    paginationDark: {
        base: mergeStyles({
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
            flexWrap: "wrap",
        }, {}, 'dark'),
    },
    paginationItemDark: {
        base: mergeStyles({
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "2.5rem",
            height: "2.5rem",
            padding: "0 0.75rem",
            borderRadius: radiusSm,
            border: `1px solid ${borderColorDark}`,
            background: surfaceDark,
            color: textLight,
            textDecoration: "none",
            fontSize: "0.875rem",
            fontWeight: "500",
            transition: standardTransition,
            "&:hover": {
                background: surfaceAltDark,
                borderColor: primaryLight,
                color: primaryLight,
            },
            "&.paginationActive": {
                background: primaryLight,
                borderColor: primaryLight,
                color: "#000",
            },
        }, {}, 'dark'),
    },
    // 📱 SIDEBAR NAVIGATION
    ...sidebar,
    // 📲 MOBILE MENU IMPROVEMENTS
    mobileMenuEnhanced: {
        base: {
            position: "fixed",
            top: "var(--navbar-height, 3.5rem)",
            left: "0",
            right: "0",
            background: surfaceLight,
            backdropFilter: "blur(16px)",
            borderTop: `1px solid ${borderColorLight}`,
            padding: "1rem 0.75rem",
            paddingBottom: "env(safe-area-inset-bottom, 1.5rem)",
            transform: "translateY(-100%)",
            opacity: "0",
            visibility: "hidden",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            zIndex: "999",
            maxHeight: "calc(100vh - var(--navbar-height, 3.5rem))",
            overflowY: "auto",
            "&.mobileMenuOpen": {
                transform: "translateY(0)",
                opacity: "1",
                visibility: "visible",
            },
            "@media (max-width: 768px)": {
                top: "var(--navbar-height-mobile, 3rem)",
            },
            "@media (max-width: 640px)": {
                padding: "0.875rem 0.5rem",
            },
        },
    },
    mobileMenuEnhancedDark: {
        base: mergeStyles({
            position: "fixed",
            top: "var(--navbar-height, 3.5rem)",
            left: "0",
            right: "0",
            background: surfaceDark,
            backdropFilter: "blur(16px)",
            borderTop: `1px solid ${borderColorDark}`,
            padding: "1rem 0.75rem",
            paddingBottom: "env(safe-area-inset-bottom, 1.5rem)",
            transform: "translateY(-100%)",
            opacity: "0",
            visibility: "hidden",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            zIndex: "999",
            maxHeight: "calc(100vh - var(--navbar-height, 3.5rem))",
            overflowY: "auto",
        }, {}, 'dark'),
    },
    mobileMenuItemEnhanced: {
        base: {
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "1rem 0.75rem",
            fontSize: "1.125rem",
            fontWeight: "500",
            color: textDark,
            textDecoration: "none",
            borderBottom: `1px solid ${borderColorLight}`,
            transition: standardTransition,
            "&:last-child": {
                borderBottom: "none",
            },
            "&:hover": {
                color: primary,
                paddingLeft: "1rem",
                background: surfaceAltLight,
            },
            "& .mobileMenuIcon": {
                width: "1.5rem",
                height: "1.5rem",
                opacity: "0.7",
            },
            "@media (max-width: 640px)": {
                fontSize: "1rem",
                padding: "0.875rem 0.75rem",
            },
        },
    },
    mobileMenuItemEnhancedDark: {
        base: mergeStyles({
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "1rem 0.75rem",
            fontSize: "1.125rem",
            fontWeight: "500",
            color: textLight,
            textDecoration: "none",
            borderBottom: `1px solid ${borderColorDark}`,
            transition: standardTransition,
            "&:last-child": {
                borderBottom: "none",
            },
            "&:hover": {
                color: primaryLight,
                paddingLeft: "1rem",
                background: surfaceAltDark,
            },
        }, {}, 'dark'),
    },
    // 🎯 STEPS/PROGRESS NAV
    steps: {
        base: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            counterReset: "step",
            "&::before": {
                content: '""',
                position: "absolute",
                top: "50%",
                left: "0",
                right: "0",
                height: "2px",
                background: surfaceAltLight,
                transform: "translateY(-50%)",
                zIndex: "1",
            },
        },
    },
    step: {
        base: {
            position: "relative",
            zIndex: "2",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
            flex: "1",
        },
    },
    stepIndicator: {
        base: {
            width: "2.5rem",
            height: "2.5rem",
            borderRadius: "50%",
            background: surfaceLight,
            border: `2px solid ${borderColorLight}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "600",
            fontSize: "0.875rem",
            color: textDark,
            transition: standardTransition,
            "&.stepActive": {
                background: primary,
                borderColor: primary,
                color: "#fff",
            },
            "&.stepCompleted": {
                background: success,
                borderColor: success,
                color: "#fff",
            },
        },
    },
    stepLabel: {
        base: {
            fontSize: "0.875rem",
            fontWeight: "500",
            textAlign: "center",
            color: textDark,
            "&.stepActive": {
                color: primary,
                fontWeight: "600",
            },
        },
    },
    // 🏷️ TABS ENHANCEMENTS
    tabsVertical: {
        base: {
            display: "flex",
            flexDirection: "column",
            borderRight: `1px solid ${borderColorLight}`,
            gap: "0.25rem",
            minWidth: "12rem",
        },
    },
    tabVertical: {
        base: {
            padding: "0.75rem 1rem",
            background: "transparent",
            border: "none",
            borderRight: "2px solid transparent",
            color: textDark,
            cursor: "pointer",
            transition: standardTransition,
            fontWeight: "500",
            textAlign: "left",
            "&:hover": {
                background: surfaceAltLight,
                color: primary,
            },
            "&.tabActive": {
                borderRightColor: primary,
                color: primary,
                fontWeight: "600",
                background: "rgba(59, 130, 246, 0.05)",
            },
        },
    },
    // 🔔 NOTIFICATION BADGES
    // 🎪 MEGA MENU
    megaMenu: {
        base: {
            position: "absolute",
            top: "100%",
            left: "0",
            right: "0",
            background: surfaceLight,
            borderRadius: radiusMd,
            boxShadow: shadowXl,
            border: `1px solid ${borderColorLight}`,
            zIndex: "1000",
            opacity: "0",
            visibility: "hidden",
            transform: "translateY(-10px)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            padding: "2rem",
            "&.megaMenuOpen": {
                opacity: "1",
                visibility: "visible",
                transform: "translateY(0)",
            },
        },
    },
    megaMenuGrid: {
        base: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "2rem",
        },
    },
    megaMenuColumn: {
        base: {
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
        },
    },
    megaMenuTitle: {
        base: {
            fontSize: "0.875rem",
            fontWeight: "600",
            color: "rgba(0, 0, 0, 0.5)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginBottom: "0.5rem",
        },
    },
    // 🎭 Enhanced Skeleton Loading (Sleek)
    // 🎪 Enhanced Toast Notification (Sleek)
    ...Toast,
    // 🎨 Enhanced Glass Panel (Sleek)
    panelGlass: {
        base: {
            padding: "1.5rem",
            "border-radius": radiusLg,
            background: "rgba(255, 255, 255, 0.08)",
            "backdrop-filter": blurGlassHeavy,
            border: `1px solid rgba(255, 255, 255, 0.12)`,
            "box-shadow": shadowLg,
            transition: standardTransition,
            "@media (max-width: 640px)": {
                padding: "1.25rem",
            },
        },
    },
    panelGlassDark: {
        base: mergeStyles({
            padding: "1.5rem",
            "border-radius": radiusLg,
            background: "rgba(31, 41, 55, 0.08)",
            "backdrop-filter": blurGlassHeavy,
            border: `1px solid ${borderColorDark}`,
            "box-shadow": shadowLg,
            transition: standardTransition,
            "@media (max-width: 640px)": {
                padding: "1.25rem",
            },
        }, {}, 'dark'),
    },
    // 🆕 Advanced Components (Sleek & Responsive)
    stepper: {
        base: {
            display: "flex",
            "align-items": "center",
            "justify-content": "space-between",
            position: "relative",
            "&::before": {
                content: '""',
                position: "absolute",
                top: "50%",
                left: "0",
                right: "0",
                height: "1px", // Thinner
                background: "rgba(59, 130, 246, 0.15)",
                transform: "translateY(-50%)",
            },
            "@media (max-width: 640px)": {
                flexDirection: "column",
                gap: "1rem",
                "&::before": {
                    display: "none",
                },
            },
        },
    },
    stepperDark: {
        base: mergeStyles({
            display: "flex",
            "align-items": "center",
            "justify-content": "space-between",
            position: "relative",
            "&::before": {
                content: '""',
                position: "absolute",
                top: "50%",
                left: "0",
                right: "0",
                height: "1px",
                background: "rgba(96, 165, 250, 0.15)",
                transform: "translateY(-50%)",
            },
            "@media (max-width: 640px)": {
                flexDirection: "column",
                gap: "1rem",
                "&::before": {
                    display: "none",
                },
            },
        }, {}, 'dark'),
    },
    ...Spinner,
    // 🏗️ SKELETON LOADERS
    ...Skeleton,
    // 🎯 PROGRESS RING
    // 📱 LOADING STATES
    loading: {
        base: {
            position: "relative",
            "&::after": {
                content: '""',
                position: "absolute",
                top: "0",
                left: "0",
                right: "0",
                bottom: "0",
                background: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(2px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "inherit",
            },
        },
    },
    loadingContent: {
        base: {
            opacity: "0.6",
            filter: "blur(1px)",
            pointerEvents: "none",
        },
    },
    // 🎨 PULSE ANIMATION
    pulse: {
        base: {
            animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        },
    },
    // 🏷️ LOADER SIZES UTILITIES
    loaderXs: {
        base: {
            padding: "1rem",
            gap: "0.5rem",
            "& .spinnerSm": {
                width: "0.75rem",
                height: "0.75rem",
            },
        },
    },
    loaderSm: {
        base: {
            padding: "1.5rem",
            gap: "0.75rem",
        },
    },
    loaderLg: {
        base: {
            padding: "3rem",
            gap: "1.5rem",
        },
    },
    // 🌟 GLOW EFFECT SPINNER
    timeline: {
        base: {
            position: "relative",
            padding: "1.5rem 0", // Reduced
            "&::before": {
                content: '""',
                position: "absolute",
                left: "0.5rem", // Centered thinner
                top: "0",
                bottom: "0",
                width: "1px", // Thinner
                background: `linear-gradient(180deg, ${primary}, success)`,
            },
            "@media (max-width: 640px)": {
                padding: "1rem 0",
                "&::before": {
                    left: "0.25rem",
                },
            },
        },
    },
    timelineDark: {
        base: mergeStyles({
            position: "relative",
            padding: "1.5rem 0",
            "&::before": {
                content: '""',
                position: "absolute",
                left: "0.5rem",
                top: "0",
                bottom: "0",
                width: "1px",
                background: `linear-gradient(180deg, ${primaryLight}, successLight)`,
            },
            "@media (max-width: 640px)": {
                padding: "1rem 0",
                "&::before": {
                    left: "0.25rem",
                },
            },
        }, {}, 'dark'),
    },
    ...pricingCard,
    // 🎯 Responsive Utilities (Expanded)
    hideOnMobile: {
        base: {
            "@media (max-width: 768px)": {
                display: "none !important",
            },
        },
    },
    showOnMobile: {
        base: {
            display: "none",
            "@media (max-width: 768px)": {
                display: "block !important",
            },
        },
    },
    hideOnSm: {
        base: {
            "@media (max-width: 640px)": {
                display: "none !important",
            },
        },
    },
    showOnSm: {
        base: {
            display: "none",
            "@media (max-width: 640px)": {
                display: "block !important",
            },
        },
    },
    hideOnMd: {
        base: {
            "@media (max-width: 768px)": {
                display: "none !important",
            },
        },
    },
    showOnMd: {
        base: {
            display: "none",
            "@media (min-width: 769px)": {
                display: "block !important",
            },
        },
    },
};
// ⚙️ Refined Dynamic Component Variants Generator
export function generateComponentVariants(baseComponents, count = 20) {
    const dynamicComponents = {};
    Object.entries(baseComponents).forEach(([name, comp]) => {
        for (let i = 1; i <= count; i++) {
            dynamicComponents[`${name}-${i}`] = {
                base: {
                    ...comp.base,
                    transform: `translateY(${i * 0.25}px)`, // Subtle
                    "z-index": i,
                    "&:hover": {
                        transform: `translateY(${i * 0.25 - 1}px) scale(1.01)`,
                    },
                },
            };
            if (!name.endsWith('Dark')) {
                dynamicComponents[`${name}-${i}-dark`] = {
                    base: mergeStyles(comp.base, {}, 'dark'),
                };
            }
        }
    });
    return dynamicComponents;
}
// 🧩 Final Export
export const allComponents = {
    ...components,
    ...generateComponentVariants(components, 20),
};
// 🎯 Refined CSS Animations
export const enhancedAnimations = String.raw `
:root {
  /* Original Design System Variables */
  --primary: ${primary};
  --primary-dark: ${primaryDark};
  --primary-light: ${primaryLight};
  --success: ${success};
  --success-dark: ${successDark};
  --success-light: ${successLight};
  --danger: ${danger};
  --danger-dark: ${dangerDark};
  --danger-light: ${dangerLight};
  --warning: ${warning};
  --warning-dark: ${warningDark};
  --warning-light: ${warningLight};
  --info: ${info};
  --info-dark: ${infoDark};
  --info-light: ${infoLight};
  --text-dark: ${textDark};
  --text-light: ${textLight};
  --surface-light: ${surfaceLight};
  --surface-dark: ${surfaceDark};
  --surface-alt-light: ${surfaceAltLight};
  --surface-alt-dark: ${surfaceAltDark};
  --border-light: ${borderColorLight};
  --border-dark: ${borderColorDark};
  --radius-sm: ${radiusSm};
  --radius-md: ${radiusMd};
  --radius-lg: ${radiusLg};
  --radius-xl: ${radiusXl};
  --shadow-sm: ${shadowSm};
  --shadow-md: ${shadowMd};
  --shadow-lg: ${shadowLg};
  --shadow-xl: ${shadowXl};
  --blur-glass: ${blurGlass};
  --blur-glass-heavy: ${blurGlassHeavy};
  --transition: ${standardTransition};

  /* Exact Navbar Design Variables */
  --navbar-height: 3.5rem;
  --navbar-height-mobile: 3rem;

  /* Navbar Specific Colors */
  --nav-surface-light: rgba(255, 255, 255, 0.85);
  --nav-surface-dark: rgba(15, 23, 42, 0.85);
  --nav-text-dark: #1e293b;
  --nav-text-light: #f8fafc;
  --nav-primary: #3b82f6;
  --nav-primary-light: #60a5fa;
  --nav-primary-dark: #2563eb;
  --nav-border-light: rgba(148, 163, 184, 0.3);
  --nav-border-dark: rgba(71, 85, 105, 0.3);
  --nav-shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --nav-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --nav-transition-standard: all 0.3s ease;
}

/* Dark Theme - Combined */
.dark {
  /* Original Dark Theme */
  --text-dark: ${textLight};
  --text-light: ${textDark};
  --surface-light: ${surfaceDark};
  --surface-dark: ${surfaceLight};
  --surface-alt-light: ${surfaceAltDark};
  --surface-alt-dark: ${surfaceAltLight};
  --border-light: ${borderColorDark};
  --border-dark: ${borderColorLight};

  /* Navbar Dark Theme */
  --nav-surface-light: rgba(15, 23, 42, 0.85);
  --nav-surface-dark: rgba(15, 23, 42, 0.95);
  --nav-text-dark: #f8fafc;
  --nav-text-light: #f8fafc;
  --nav-border-light: rgba(71, 85, 105, 0.3);
  --nav-border-dark: rgba(71, 85, 105, 0.5);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  background: var(--surface-light);
  color: var(--text-dark);
  line-height: 1.6;
  padding-top: var(--navbar-height);
  transition: var(--transition);
}

.dark body {
  background: var(--surface-dark);
  color: var(--text-light);
}

/* Base list styling for navbar and global */
ul, ol {
  list-style: none;
}

/* CORE ANIMATIONS */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
}

@keyframes glow {
  0%, 100% { box-shadow: 0 0 10px rgba(59, 130, 246, 0.2); }
  50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.4); }
}

@keyframes slideIn {
  0% { transform: translateY(-100%); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* HERO SPECIFIC ANIMATIONS */
@keyframes gridScroll {
  0% { transform: translateY(0); }
  100% { transform: translateY(60px); }
}

@keyframes meshPulse {
  0% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.1); }
  100% { opacity: 0.3; transform: scale(1); }
}

@keyframes titleFloat {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

/* CARD SPECIFIC ANIMATIONS */
@keyframes borderRotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes cardPulse {
  0%, 100% { box-shadow: 0 4px 16px rgba(59, 130, 246, 0.1); }
  50% { box-shadow: 0 8px 32px rgba(59, 130, 246, 0.2); }
}

/* TOOLTIP ANIMATIONS */
@keyframes tooltipSlideIn {
  0% {
    opacity: 0;
    transform: translate(var(--tx, -50%), var(--ty, -8px)) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translate(var(--tx, -50%), var(--ty, -4px)) scale(1);
  }
}

@keyframes tooltipSlideOut {
  0% {
    opacity: 1;
    transform: translate(var(--tx, -50%), var(--ty, -4px)) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(var(--tx, -50%), var(--ty, -8px)) scale(0.9);
  }
}

@keyframes tooltipBounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(var(--tx, -50%), var(--ty, -4px), 0) scale(1);
  }
  40%, 43% {
    transform: translate3d(var(--tx, -50%), calc(var(--ty, -4px) - 8px), 0) scale(1.02);
  }
  70% {
    transform: translate3d(var(--tx, -50%), calc(var(--ty, -4px) - 4px), 0) scale(1.01);
  }
}

@keyframes tooltipFade {
  0% {
    opacity: 0;
    transform: translate(var(--tx, -50%), var(--ty, -4px)) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translate(var(--tx, -50%), var(--ty, -4px)) scale(1);
  }
}

@keyframes tooltipPulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
  }
}

/* PROGRESS & LOADING ANIMATIONS */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes bars {
  0%, 40%, 100% { transform: scaleY(0.4); }
  20% { transform: scaleY(1); }
}

@keyframes indeterminate {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes stripes {
  0% { background-position: 1rem 0; }
  100% { background-position: 0 0; }
}

@keyframes glowPulse {
  0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
  100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
}

/* TOAST ANIMATIONS */
@keyframes toastProgress {
  0% { width: 100%; }
  100% { width: 0%; }
}

/* NAVBAR SPECIFIC ANIMATIONS */
@keyframes navLinkUnderline {
  0% { width: 0; }
  100% { width: 100%; }
}

@keyframes mobileMenuSlide {
  0% { transform: translateY(-100%); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

@keyframes hamburgerToX1 {
  0% { transform: translateY(0) rotate(0); }
  100% { transform: translateY(6px) rotate(45deg); }
}

@keyframes hamburgerToX2 {
  0% { opacity: 1; }
  100% { opacity: 0; }
}

@keyframes hamburgerToX3 {
  0% { transform: translateY(0) rotate(0); }
  100% { transform: translateY(-6px) rotate(-45deg); }
}

/* ANIMATION UTILITY CLASSES */
.float-animation {
  animation: float 3s ease-in-out infinite;
}

.glow-animation {
  animation: glow 2s ease-in-out infinite;
}

.slide-in {
  animation: slideIn 0.4s ease-out;
}

.fade-in {
  animation: fadeIn 0.5s ease-in;
}

.pulse-animation {
  animation: pulse 2s ease-in-out infinite;
}

/* TOOLTIP POSITION VARIABLES */
.tooltipTop { --tx: -50%; --ty: -8px; }
.tooltipBottom { --tx: -50%; --ty: 8px; }
.tooltipLeft { --tx: 8px; --ty: -50%; }
.tooltipRight { --tx: -8px; --ty: -50%; }

/* RESPONSIVE BREAKPOINTS */
@media (max-width: 768px) {
  :root {
    --navbar-height: 3rem;
  }
}

/* TOUCH DEVICE SUPPORT */
@media (hover: none) and (pointer: coarse) {
  .tooltipContainer {
    cursor: default;
  }

  .tooltip {
    font-size: 0.875rem;
    padding: 1rem;
    max-width: 16rem;
  }
}

/* ACCESSIBILITY IMPROVEMENTS */
.tooltipContainer:focus-visible .tooltip {
  opacity: 1;
  visibility: visible;
  transform: translate(0, 0) scale(1);
}

/* PERFORMANCE OPTIMIZATIONS */
.tooltip {
  will-change: transform, opacity;
  backface-visibility: hidden;
  transform: translateZ(0);
}

/* REDUCED MOTION SUPPORT */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .hero-title,
  .hero-subtitle {
    animation: none !important;
  }

  .navbar,
  .nav-link,
  .menu-button,
  .mobile-menu {
    transition: none !important;
  }

  .btn, .btnPrimary, .btnSuccess, .btnDanger, .btnWarning, .btnInfo {
    transition: none !important;
    &::before {
      display: none !important;
    }
    &:hover {
      transform: none !important;
    }
  }

  .card, .cardHover, .cardClickable, .cardWithImage {
    transition: none !important;
    &:hover {
      transform: none !important;
    }
  }

  .cardBorderAnimated::before {
    animation: none !important;
  }
}

/* DARK MODE ENHANCEMENTS */
@media (prefers-color-scheme: dark) {
  :root {
    color-scheme: dark;
  }
}

/* NAVBAR SPECIFIC STYLES (for direct CSS usage) */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background: var(--nav-surface-light);
  box-shadow: var(--nav-shadow-sm);
  backdrop-filter: blur(16px);
  transition: var(--nav-transition-standard);
}

.dark .navbar {
  background: var(--nav-surface-dark);
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  max-width: 1280px;
  height: var(--navbar-height);
  padding: 0 1rem;
}

.nav-brand {
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--nav-primary-light), var(--nav-primary), var(--nav-primary-dark));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-decoration: none;
  transition: var(--nav-transition-standard);
}

.nav-link {
  color: var(--nav-text-dark);
  font-weight: 500;
  text-decoration: none;
  padding: 0.375rem 0;
  position: relative;
  transition: var(--nav-transition-standard);
}

.nav-link::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 1.5px;
  background: var(--nav-primary);
  transform: translateX(-50%);
  transition: var(--nav-transition-standard);
}

.nav-link:hover::after {
  width: 100%;
}

.mobile-menu {
  position: fixed;
  top: var(--navbar-height);
  left: 0;
  right: 0;
  background: var(--nav-surface-light);
  backdrop-filter: blur(16px);
  border-top: 1px solid var(--nav-border-light);
  padding: 1rem 0.75rem;
  transform: translateY(-100%);
  opacity: 0;
  visibility: hidden;
  transition: var(--nav-transition-standard);
  z-index: 999;
}

.mobile-menu.mobile-menu-open {
  transform: translateY(0);
  opacity: 1;
  visibility: visible;
}

/* MEDIA QUERIES */
@media (min-width: 1025px) {
  .nav-container {
    height: 4rem;
    padding: 0 2rem;
  }
}

@media (max-width: 768px) {
  .nav-container {
    height: var(--navbar-height-mobile);
    padding: 0 0.75rem;
  }

  .nav-brand {
    font-size: 1.125rem;
  }

  .mobile-menu {
    top: var(--navbar-height-mobile);
  }
}
`;
