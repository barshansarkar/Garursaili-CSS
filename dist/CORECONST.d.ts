export declare const primary = "#3b82f6";
export declare const primaryDark = "#2563eb";
export declare const primaryLight = "#60a5fa";
export declare const success = "#10b981";
export declare const successDark = "#059669";
export declare const successLight = "#34d399";
export declare const danger = "#ef4444";
export declare const dangerDark = "#dc2626";
export declare const dangerLight = "#f87171";
export declare const warning = "#f59e0b";
export declare const warningDark = "#d97706";
export declare const warningLight = "#fbbf24";
export declare const info = "#06b6d4";
export declare const infoDark = "#0891b2";
export declare const infoLight = "#0ea5e9";
export declare const textDark = "#111827";
export declare const textLight = "#f9fafb";
export declare const surfaceLight = "#ffffff";
export declare const surfaceDark = "#1f2937";
export declare const surfaceAltLight = "#f8fafc";
export declare const surfaceAltDark = "#334155";
export declare const borderColorLight = "rgba(0,0,0,0.08)";
export declare const borderColorDark = "rgba(255,255,255,0.12)";
export declare const radiusSm = "0.5rem";
export declare const radiusMd = "0.75rem";
export declare const radiusLg = "1rem";
export declare const radiusXl = "1.5rem";
export declare const shadowSm = "0 2px 8px rgba(0,0,0,0.04)";
export declare const shadowMd = "0 4px 16px rgba(0,0,0,0.08)";
export declare const shadowLg = "0 8px 32px rgba(0,0,0,0.12)";
export declare const shadowXl = "0 16px 48px rgba(0,0,0,0.08)";
export declare const blurGlass = "blur(16px)";
export declare const blurGlassHeavy = "blur(24px)";
export declare const standardTransition = "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)";
export declare const mergeStyles: (base: Record<string, any>, override: Record<string, any>, theme?: "light" | "dark") => {
    color?: string;
    backgroundColor?: string;
};
export declare const btnBase: {
    display: string;
    alignItems: string;
    justifyContent: string;
    gap: string;
    padding: string;
    borderRadius: string;
    border: string;
    fontWeight: string;
    letterSpacing: string;
    cursor: string;
    transition: string;
    backdropFilter: string;
    boxShadow: string;
    position: string;
    overflow: string;
    fontSize: string;
    lineHeight: string;
    textDecoration: string;
    userSelect: string;
    WebkitUserSelect: string;
    MozUserSelect: string;
    msUserSelect: string;
    "&::before": {
        content: string;
        position: string;
        top: string;
        left: string;
        width: string;
        height: string;
        background: string;
        transition: string;
    };
    "&:hover::before": {
        left: string;
    };
    "&:focus": {
        outline: string;
        boxShadow: string;
    };
    "&:active": {
        transform: string;
    };
    "@media (prefers-reduced-motion: reduce)": {
        transition: string;
        "&::before": {
            display: string;
        };
    };
    "@media (max-width: 640px)": {
        padding: string;
        fontSize: string;
    };
};
export declare const inputBase: {
    width: string;
    padding: string;
    borderRadius: string;
    border: string;
    outline: string;
    fontSize: string;
    color: string;
    background: string;
    transition: string;
    backdropFilter: string;
    fontFamily: string;
    "&:focus": {
        borderColor: string;
        boxShadow: string;
        transform: string;
    };
    "&::placeholder": {
        color: string;
    };
    "@media (max-width: 640px)": {
        padding: string;
        fontSize: string;
    };
};
export declare const toast: {
    base: {
        position: string;
        bottom: string;
        right: string;
        padding: string;
        borderRadius: string;
        background: string;
        color: string;
        boxShadow: string;
        border: string;
        zIndex: string;
        maxWidth: string;
        backdropFilter: string;
        transition: string;
        transform: string;
        opacity: string;
        "&.toastShow": {
            transform: string;
            opacity: string;
        };
        "&.toastHide": {
            transform: string;
            opacity: string;
        };
        "@media (max-width: 640px)": {
            right: string;
            left: string;
            maxWidth: string;
            bottom: string;
        };
    };
};
export declare const modalBase: {
    position: string;
    top: string;
    left: string;
    transform: string;
    background: string;
    padding: string;
    "border-radius": string;
    "box-shadow": string;
    "z-index": string;
    width: string;
    "max-width": string;
    transition: string;
    "backdrop-filter": string;
    border: string;
    "@media (max-width: 640px)": {
        padding: string;
        width: string;
    };
};
export declare const badgeBase: {
    display: string;
    "align-items": string;
    "justify-content": string;
    padding: string;
    "border-radius": string;
    "font-size": string;
    "font-weight": string;
    color: string;
    background: string;
    "box-shadow": string;
    "letter-spacing": string;
};
export declare const heroBase: {
    padding: string;
    "text-align": string;
    background: string;
    color: string;
    "border-radius": string;
    "box-shadow": string;
    position: string;
    overflow: string;
    "&::before": {
        content: string;
        position: string;
        top: string;
        left: string;
        right: string;
        bottom: string;
        background: string;
        "z-index": string;
    };
    "@media (max-width: 768px)": {
        padding: string;
    };
    "@media (max-width: 640px)": {
        padding: string;
    };
};
export declare const cardBase: {
    background: string;
    borderRadius: string;
    boxShadow: string;
    transition: string;
    overflow: string;
    position: string;
    "@media (max-width: 640px)": {
        borderRadius: string;
    };
};
export declare const alertBase: {
    padding: string;
    borderRadius: string;
    border: string;
    background: string;
    backdropFilter: string;
    fontWeight: string;
    boxShadow: string;
    transition: string;
    position: string;
    overflow: string;
    display: string;
    alignItems: string;
    gap: string;
    "&::before": {
        content: string;
        position: string;
        left: string;
        top: string;
        bottom: string;
        width: string;
        borderRadius: string;
    };
    "@media (max-width: 640px)": {
        padding: string;
        gap: string;
    };
};
export declare const avatarBase: {
    width: string;
    height: string;
    "border-radius": string;
    "object-fit": string;
    border: string;
    "box-shadow": string;
    transition: string;
};
export declare const progressBase: {
    width: string;
    borderRadius: string;
    overflow: string;
    backdropFilter: string;
    position: string;
};
export declare const tabBase: {
    padding: string;
    background: string;
    border: string;
    "border-bottom": string;
    color: string;
    cursor: string;
    transition: string;
    "font-weight": string;
    "border-radius": string;
};
export declare const tooltipBase: {
    position: string;
    padding: string;
    borderRadius: string;
    fontSize: string;
    fontWeight: string;
    whiteSpace: string;
    zIndex: string;
    boxShadow: string;
    backdropFilter: string;
    pointerEvents: string;
    opacity: string;
    visibility: string;
    transition: string;
    maxWidth: string;
    textAlign: string;
    lineHeight: string;
    "&.tooltipShow": {
        opacity: string;
        visibility: string;
        transform: string;
    };
    "&.tooltipEnter": {
        animation: string;
    };
    "&.tooltipExit": {
        animation: string;
    };
};
export declare const dropdownBase: {
    position: string;
    top: string;
    right: string;
    background: string;
    "border-radius": string;
    "box-shadow": string;
    border: string;
    "z-index": string;
    "min-width": string;
    overflow: string;
    "backdrop-filter": string;
};
export declare const skeletonBase: {
    background: string;
    "background-size": string;
    "border-radius": string;
    animation: string;
};
export declare const spinnerBase: {
    display: string;
    borderRadius: string;
    animation: string;
    border: string;
};
export declare const toastBase: {
    position: string;
    bottom: string;
    right: string;
    padding: string;
    "border-radius": string;
    background: string;
    color: string;
    "box-shadow": string;
    border: string;
    "z-index": string;
    "max-width": string;
    "backdrop-filter": string;
    transition: string;
};
declare const _default: {
    primary: string;
    primaryDark: string;
    primaryLight: string;
    success: string;
    successDark: string;
    successLight: string;
    danger: string;
    dangerDark: string;
    dangerLight: string;
    warning: string;
    warningDark: string;
    warningLight: string;
    info: string;
    infoDark: string;
    infoLight: string;
    textDark: string;
    textLight: string;
    surfaceLight: string;
    surfaceDark: string;
    surfaceAltLight: string;
    surfaceAltDark: string;
    borderColorLight: string;
    borderColorDark: string;
    radiusSm: string;
    radiusMd: string;
    radiusLg: string;
    radiusXl: string;
    shadowSm: string;
    shadowMd: string;
    shadowLg: string;
    shadowXl: string;
    blurGlass: string;
    blurGlassHeavy: string;
    standardTransition: string;
    mergeStyles: (base: Record<string, any>, override: Record<string, any>, theme?: "light" | "dark") => {
        color?: string;
        backgroundColor?: string;
    };
    btnBase: {
        display: string;
        alignItems: string;
        justifyContent: string;
        gap: string;
        padding: string;
        borderRadius: string;
        border: string;
        fontWeight: string;
        letterSpacing: string;
        cursor: string;
        transition: string;
        backdropFilter: string;
        boxShadow: string;
        position: string;
        overflow: string;
        fontSize: string;
        lineHeight: string;
        textDecoration: string;
        userSelect: string;
        WebkitUserSelect: string;
        MozUserSelect: string;
        msUserSelect: string;
        "&::before": {
            content: string;
            position: string;
            top: string;
            left: string;
            width: string;
            height: string;
            background: string;
            transition: string;
        };
        "&:hover::before": {
            left: string;
        };
        "&:focus": {
            outline: string;
            boxShadow: string;
        };
        "&:active": {
            transform: string;
        };
        "@media (prefers-reduced-motion: reduce)": {
            transition: string;
            "&::before": {
                display: string;
            };
        };
        "@media (max-width: 640px)": {
            padding: string;
            fontSize: string;
        };
    };
    inputBase: {
        width: string;
        padding: string;
        borderRadius: string;
        border: string;
        outline: string;
        fontSize: string;
        color: string;
        background: string;
        transition: string;
        backdropFilter: string;
        fontFamily: string;
        "&:focus": {
            borderColor: string;
            boxShadow: string;
            transform: string;
        };
        "&::placeholder": {
            color: string;
        };
        "@media (max-width: 640px)": {
            padding: string;
            fontSize: string;
        };
    };
    toastBase: {
        position: string;
        bottom: string;
        right: string;
        padding: string;
        "border-radius": string;
        background: string;
        color: string;
        "box-shadow": string;
        border: string;
        "z-index": string;
        "max-width": string;
        "backdrop-filter": string;
        transition: string;
    };
    modalBase: {
        position: string;
        top: string;
        left: string;
        transform: string;
        background: string;
        padding: string;
        "border-radius": string;
        "box-shadow": string;
        "z-index": string;
        width: string;
        "max-width": string;
        transition: string;
        "backdrop-filter": string;
        border: string;
        "@media (max-width: 640px)": {
            padding: string;
            width: string;
        };
    };
    badgeBase: {
        display: string;
        "align-items": string;
        "justify-content": string;
        padding: string;
        "border-radius": string;
        "font-size": string;
        "font-weight": string;
        color: string;
        background: string;
        "box-shadow": string;
        "letter-spacing": string;
    };
    heroBase: {
        padding: string;
        "text-align": string;
        background: string;
        color: string;
        "border-radius": string;
        "box-shadow": string;
        position: string;
        overflow: string;
        "&::before": {
            content: string;
            position: string;
            top: string;
            left: string;
            right: string;
            bottom: string;
            background: string;
            "z-index": string;
        };
        "@media (max-width: 768px)": {
            padding: string;
        };
        "@media (max-width: 640px)": {
            padding: string;
        };
    };
    cardBase: {
        background: string;
        borderRadius: string;
        boxShadow: string;
        transition: string;
        overflow: string;
        position: string;
        "@media (max-width: 640px)": {
            borderRadius: string;
        };
    };
    alertBase: {
        padding: string;
        borderRadius: string;
        border: string;
        background: string;
        backdropFilter: string;
        fontWeight: string;
        boxShadow: string;
        transition: string;
        position: string;
        overflow: string;
        display: string;
        alignItems: string;
        gap: string;
        "&::before": {
            content: string;
            position: string;
            left: string;
            top: string;
            bottom: string;
            width: string;
            borderRadius: string;
        };
        "@media (max-width: 640px)": {
            padding: string;
            gap: string;
        };
    };
    avatarBase: {
        width: string;
        height: string;
        "border-radius": string;
        "object-fit": string;
        border: string;
        "box-shadow": string;
        transition: string;
    };
    progressBase: {
        width: string;
        borderRadius: string;
        overflow: string;
        backdropFilter: string;
        position: string;
    };
    tabBase: {
        padding: string;
        background: string;
        border: string;
        "border-bottom": string;
        color: string;
        cursor: string;
        transition: string;
        "font-weight": string;
        "border-radius": string;
    };
    tooltipBase: {
        position: string;
        padding: string;
        borderRadius: string;
        fontSize: string;
        fontWeight: string;
        whiteSpace: string;
        zIndex: string;
        boxShadow: string;
        backdropFilter: string;
        pointerEvents: string;
        opacity: string;
        visibility: string;
        transition: string;
        maxWidth: string;
        textAlign: string;
        lineHeight: string;
        "&.tooltipShow": {
            opacity: string;
            visibility: string;
            transform: string;
        };
        "&.tooltipEnter": {
            animation: string;
        };
        "&.tooltipExit": {
            animation: string;
        };
    };
    dropdownBase: {
        position: string;
        top: string;
        right: string;
        background: string;
        "border-radius": string;
        "box-shadow": string;
        border: string;
        "z-index": string;
        "min-width": string;
        overflow: string;
        "backdrop-filter": string;
    };
    skeletonBase: {
        background: string;
        "background-size": string;
        "border-radius": string;
        animation: string;
    };
    spinnerBase: {
        display: string;
        borderRadius: string;
        animation: string;
        border: string;
    };
};
export default _default;
