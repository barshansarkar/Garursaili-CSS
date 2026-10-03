// ————————————————————————————————
// Garur-CSS Core Tokens + Base Styles (Packed Export)
// ————————————————————————————————

//  Colors
export const primary = "#3b82f6";
export const primaryDark = "#2563eb";
export const primaryLight = "#60a5fa";
export const success = "#10b981";
export const successDark = "#059669";
export const successLight = "#34d399";
export const danger = "#ef4444";
export const dangerDark = "#dc2626";
export const dangerLight = "#f87171";
export const warning = "#f59e0b";
export const warningDark = "#d97706";
export const warningLight = "#fbbf24";
export const info = "#06b6d4";
export const infoDark = "#0891b2";
export const infoLight = "#0ea5e9";
export const textDark = "#111827";
export const textLight = "#f9fafb";
export const surfaceLight = "#ffffff";
export const surfaceDark = "#1f2937";
export const surfaceAltLight = "#f8fafc";
export const surfaceAltDark = "#334155";
export const borderColorLight = "rgba(0,0,0,0.08)";
export const borderColorDark = "rgba(255,255,255,0.12)";

//  Radius
export const radiusSm = "0.5rem";
export const radiusMd = "0.75rem";
export const radiusLg = "1rem";
export const radiusXl = "1.5rem";

//  Shadows
export const shadowSm = "0 2px 8px rgba(0,0,0,0.04)";
export const shadowMd = "0 4px 16px rgba(0,0,0,0.08)";
export const shadowLg = "0 8px 32px rgba(0,0,0,0.12)";
export const shadowXl = "0 16px 48px rgba(0,0,0,0.08)";

//  Blur
export const blurGlass = "blur(16px)";
export const blurGlassHeavy = "blur(24px)";

//  Transition
export const standardTransition =
  "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)";

//  Merge Utility
export const mergeStyles = (
  base: Record<string, any>,
  override: Record<string, any>,
  theme?: "light" | "dark"
) => ({
  ...base,
  ...override,
  ...(theme === "dark"
    ? { color: textLight, backgroundColor: surfaceDark }
    : {}),
});

// —————————————————————————————
// COMPONENT BASE STYLES EXPORT
// —————————————————————————————

//  BUTTON
export const btnBase = {  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem",
  padding: "0.75rem 1.5rem",
  borderRadius: radiusSm,
  border: "none",
  fontWeight: "600",
  letterSpacing: "0.25px",
  cursor: "pointer",
  transition: standardTransition,
  backdropFilter: blurGlass,
  boxShadow: shadowSm,
  position: "relative",
  overflow: "hidden",
  fontSize: "0.9375rem",
  lineHeight: "1.5",
  textDecoration: "none",
  userSelect: "none",
  WebkitUserSelect: "none",
  MozUserSelect: "none",
  msUserSelect: "none",

  // Shine effect
  "&::before": {
    content: '""',
    position: "absolute",
    top: "0",
    left: "-100%",
    width: "100%",
    height: "100%",
    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
    transition: "left 0.4s ease",
  },

  "&:hover::before": {
    left: "100%",
  },

  "&:focus": {
    outline: "none",
    boxShadow: `0 0 0 2px ${primary}20, ${shadowSm}`,
  },

  "&:active": {
    transform: "translateY(1px)",
  },

  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",
    "&::before": {
      display: "none",
    },
  },

  "@media (max-width: 640px)": {
    padding: "0.625rem 1.25rem",
    fontSize: "0.875rem",
  }, };

//  INPUT
export const inputBase = {
  width: "100%",
  padding: "0.75rem 1rem",
  borderRadius: radiusSm,
  border: `1px solid ${borderColorLight}`,
  outline: "none",
  fontSize: "0.9375rem",
  color: textDark,
  background: surfaceLight,
  transition: standardTransition,
  backdropFilter: blurGlass,
  fontFamily: "inherit",

  "&:focus": {
    borderColor: primary,
    boxShadow: `0 0 0 2px ${primary}15`,
    transform: "translateY(-1px)",
  },

  "&::placeholder": {
    color: "rgba(0, 0, 0, 0.4)",
  },

  "@media (max-width: 640px)": {
    padding: "0.625rem 0.875rem",
    fontSize: "0.875rem",
  }, };

//  TOAST
export const toast = { base: {
    position: "fixed",
    bottom: "1.5rem",
    right: "1.5rem",
    padding: "1rem 1.25rem",
    borderRadius: radiusMd,
    background: surfaceLight,
    color: textDark,
    boxShadow: shadowLg,
    border: `1px solid ${borderColorLight}`,
    zIndex: "10000",
    maxWidth: "24rem",
    backdropFilter: blurGlass,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    transform: "translateX(100%)",
    opacity: "0",

    "&.toastShow": {
      transform: "translateX(0)",
      opacity: "1",
    },

    "&.toastHide": {
      transform: "translateX(100%)",
      opacity: "0",
    },

    "@media (max-width: 640px)": {
      right: "1rem",
      left: "1rem",
      maxWidth: "none",
      bottom: "1rem",
    },
  }, };

//  MODAL
export const modalBase = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  background: surfaceLight,
  padding: "1.5rem", // Reduced
  "border-radius": radiusMd,
  "box-shadow": shadowLg,
  "z-index": "9999",
  width: "90%",
  "max-width": "450px", // Slightly smaller
  transition: standardTransition,
  "backdrop-filter": blurGlass,
  border: `1px solid ${borderColorLight}`,
  "@media (max-width: 640px)": {
    padding: "1.25rem",
    width: "95%",
  },};

//  BADGE
export const badgeBase = {  display: "inline-flex",
  "align-items": "center",
  "justify-content": "center",
  padding: "0.375rem 0.75rem", // Reduced
  "border-radius": radiusMd,
  "font-size": "0.8125rem",
  "font-weight": "600",
  color: "#fff",
  background: `linear-gradient(135deg, ${primaryDark}, ${primary})`,
  "box-shadow": shadowSm,
  "letter-spacing": "0.25px", };

//  HERO
export const heroBase = {  padding: "6rem 1.5rem", // Reduced top padding for sleek
  "text-align": "center",
  background: `linear-gradient(135deg, ${surfaceAltLight}, #f1f5f9)`,
  color: textDark,
  "border-radius": radiusLg,
  "box-shadow": shadowSm,
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    background: "linear-gradient(45deg, rgba(59,130,246,0.05), rgba(16,185,129,0.05))", // Subtler
    "z-index": "0",
  },
  "@media (max-width: 768px)": {
    padding: "4rem 1rem",
  },
  "@media (max-width: 640px)": {
    padding: "3rem 0.75rem",
  }, };

//  CARD
export const cardBase = {  background: surfaceLight,
  borderRadius: radiusMd,
  boxShadow: shadowSm,
  transition: standardTransition,
  overflow: "hidden",
  position: "relative",

  "@media (max-width: 640px)": {
    borderRadius: radiusSm,
  }, };

//  ALERT
export const alertBase = {  padding: "1rem 1.25rem",
  borderRadius: radiusMd,
  border: `1px solid ${borderColorLight}`,
  background: surfaceAltLight,
  backdropFilter: blurGlassHeavy,
  fontWeight: "500",
  boxShadow: shadowSm,
  transition: standardTransition,
  position: "relative",
  overflow: "hidden",
  display: "flex",
  alignItems: "flex-start",
  gap: "0.75rem",

  "&::before": {
    content: '""',
    position: "absolute",
    left: "0",
    top: "0",
    bottom: "0",
    width: "4px",
    borderRadius: `${radiusMd} 0 0 ${radiusMd}`,
  },

  "@media (max-width: 640px)": {
    padding: "0.875rem 1rem",
    gap: "0.5rem",
  }, };

//  AVATAR
export const avatarBase = {  width: "2.75rem", // Slightly smaller
  height: "2.75rem",
  "border-radius": "50%",
  "object-fit": "cover",
  border: `2px solid ${surfaceLight}`, // Thinner
  "box-shadow": shadowSm,
  transition: standardTransition, };

// PROGRESS
export const progressBase = {  width: "100%",
  borderRadius: radiusSm,
  overflow: "hidden",
  backdropFilter: blurGlass,
  position: "relative", };

//  TAB
export const tabBase = { padding: "0.75rem 1.25rem", // Reduced
  background: "transparent",
  border: "none",
  "border-bottom": "2px solid transparent",
  color: textDark,
  cursor: "pointer",
  transition: standardTransition,
  "font-weight": "500",
  "border-radius": radiusSm, };

//  TOOLTIP
export const tooltipBase = {  position: "absolute",
  padding: "0.75rem 1rem",
  borderRadius: "var(--radius-md)",
  fontSize: "0.8125rem",
  fontWeight: "500",
  whiteSpace: "nowrap",
  zIndex: "10000",
  boxShadow: "var(--shadow-xl)",
  backdropFilter: "var(--blur-glass-heavy)",
  pointerEvents: "none",
  opacity: "0",
  visibility: "hidden",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  maxWidth: "20rem",
  textAlign: "center",
  lineHeight: "1.4",

  // Enhanced animations
  "&.tooltipShow": {
    opacity: "1",
    visibility: "visible",
    transform: "translate(0, 0) scale(1) !important",
  },

  // Smooth entrance animations
  "&.tooltipEnter": {
    animation: "tooltipSlideIn 0.3s ease-out",
  },

  // Exit animations
  "&.tooltipExit": {
    animation: "tooltipSlideOut 0.2s ease-in",
  }, };

//  DROPDOWN
export const dropdownBase = {
  position: "absolute",
  top: "100%",
  right: "0",
  background: surfaceLight,
  "border-radius": radiusMd,
  "box-shadow": shadowLg,
  border: `1px solid ${borderColorLight}`,
  "z-index": "1000",
  "min-width": "12rem", // Slightly smaller
  overflow: "hidden",
  "backdrop-filter": blurGlass,};

// SKELETON
export const skeletonBase = {
  background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)",
  "background-size": "200% 100%",
  "border-radius": radiusSm,
  animation: "shimmer 1.5s infinite", };

// SPINNER
export const spinnerBase = { display: "inline-block",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
  border: "2px solid transparent",};
export const toastBase ={
    position: "fixed",
  bottom: "1.5rem",
  right: "1.5rem",
  padding: "1rem 1.25rem", // Reduced
  "border-radius": radiusMd,
  background: surfaceLight,
  color: textDark,
  "box-shadow": shadowLg,
  border: `1px solid ${borderColorLight}`,
  "z-index": "10000",
  "max-width": "20rem",
  "backdrop-filter": blurGlass,
  transition: standardTransition,
}

// ————————————————————————————
// DEFAULT EXPORT PACK
// ————————————————————————————
export default {
  primary,
  primaryDark,
  primaryLight,
  success,
  successDark,
  successLight,
  danger,
  dangerDark,
  dangerLight,
  warning,
  warningDark,
  warningLight,
  info,
  infoDark,
  infoLight,

  textDark,
  textLight,
  surfaceLight,
  surfaceDark,
  surfaceAltLight,
  surfaceAltDark,
  borderColorLight,
  borderColorDark,

  radiusSm,
  radiusMd,
  radiusLg,
  radiusXl,

  shadowSm,
  shadowMd,
  shadowLg,
  shadowXl,

  blurGlass,
  blurGlassHeavy,
  standardTransition,
  mergeStyles,

  btnBase,
  inputBase,
  toastBase,
  modalBase,
  badgeBase,
  heroBase,
  cardBase,
  alertBase,
  avatarBase,
  progressBase,
  tabBase,
  tooltipBase,
  dropdownBase,
  skeletonBase,
  spinnerBase,
};
