export const defaultTheme = {
    colors: {
        primary: "#4F46E5",
        secondary: "#06b6d4",
        white: "#ffffff",
        black: "#000000",
        gray: "#6b7280",
    },
    spacing: {
        px: "1px",
        0: "0px",
        1: "0.25rem",
        2: "0.5rem",
        3: "0.75rem",
        4: "1rem",
        6: "1.5rem",
        8: "2rem",
    },
    radii: {
        sm: "0.125rem",
        md: "0.5rem",
        lg: "1rem",
    },
    fontSize: {
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
    },
};
export function generateThemeCssVars(theme = defaultTheme, prefix = "--garur") {
    let css = ":root {";
    const emit = (obj, path) => {
        for (const [k, v] of Object.entries(obj)) {
            const name = `${prefix}-${path}-${k}`.replace(/[^a-zA-Z0-9-]/g, "-");
            css += `--${name}:${v};`;
        }
    };
    if (theme.colors)
        emit(theme.colors, "color");
    if (theme.spacing)
        emit(theme.spacing, "space");
    if (theme.radii)
        emit(theme.radii, "radius");
    if (theme.fontSize)
        emit(theme.fontSize, "font-size");
    css += "}";
    return css;
}
// garur theme
// Minimal theme switcher API for Garur CSS variables
