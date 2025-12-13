// src/utils/sanitizer.ts
// i hate this file with every atom of my body
// it's 3:12 am, tailwind arbitrary values keep breaking, i'm crying, here's the mess
export function normalizeColorToken(val) {
    if (!val)
        return null;
    const raw = val.trim();
    // just let css functions live their life pls
    if (/^var\(/.test(raw) || /linear-gradient|radial-gradient|conic-gradient|rgba?\(|hsla?\(/i.test(raw))
        return raw;
    // oklch and color-mix showed up one day and now i have to deal with them
    if (/^oklch\(/i.test(raw))
        return raw;
    if (/^color-mix\(/i.test(raw))
        return raw;
    if (/^hsl\(/i.test(raw))
        return raw;
    // someone keeps writing url('/img.png') no-repeat center and expects it to work
    // i hate everything
    if (raw.startsWith('url(') && raw.endsWith(')')) {
        if (/^url\(['"]?([^'")]+)['"]?\)$/.test(raw))
            return raw;
        return null;
    }
    // this is the most cursed arbitrary background crap i've ever seen in my life
    if (raw.includes('url(') && (raw.includes('no-repeat') || raw.includes('repeat') || raw.includes('center') || raw.includes('top') || raw.includes('left') || raw.includes('right') || raw.includes('bottom'))) {
        return raw; // i'm not validating this anymore i give up
    }
    // hex without # because tailwind arbitrary values are satan
    const hexOnly = /^[0-9a-fA-F]{3,8}$/;
    if (hexOnly.test(raw))
        return `#${raw}`;
    if (/^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(raw))
        return raw;
    // keywords that are safe i guess
    if (/^(transparent|currentColor|inherit|initial|revert)$/.test(raw))
        return raw;
    // named colors... probably fine???
    if (/^[a-zA-Z-]+$/.test(raw))
        return raw;
    // anything with space or comma = gradient or multiple values, just let it through i'm tired
    if (raw.includes(" ") || raw.includes(","))
        return raw;
    return null; // die
}
export function ensureUnitForLength(val) {
    if (!val)
        return val;
    const s = val.trim();
    if (s === "0")
        return "0";
    if (/^calc\(/.test(s))
        return s;
    // already has unit, good for you
    if (/^-?\d+(\.\d+)?(px|rem|em|vw|vh|ch|%)$/.test(s))
        return s;
    // naked number → slap px because that's what everyone expects anyway
    if (/^-?\d+(\.\d+)?$/.test(s))
        return `${s}px`;
    // fractions like 1/2, 3/4, 5/6 etc.
    const frac = s.match(/^(-?\d+)\/(\d+)$/);
    if (frac) {
        const a = Number(frac[1]), b = Number(frac[2]);
        if (b !== 0)
            return `${(a / b) * 100}%`;
    }
    return s; // idk anymore
}
export function ensureTimeUnit(val) {
    const s = val.trim();
    if (/^\d+$/.test(s))
        return `${s}ms`;
    if (/^\d+ms$/.test(s) || /^\d+s$/.test(s))
        return s;
    return s; // probably fine
}
export function normalizeTokenValueForProperty(prop, value) {
    if (value === undefined || value === null)
        return null;
    let v = value.trim();
    if (/color|background|accent|caret|fill|stroke|ring|gradient|decoration/i.test(prop)) {
        const c = normalizeColorToken(v);
        return c;
    }
    if (/box-shadow|shadow/i.test(prop)) {
        const c = normalizeColorToken(v);
        if (c)
            return `0 0 0 3px ${c}`;
        return v;
    }
    if (/padding|margin|width|height|min-width|min-height|max-width|max-height|gap|top|left|right|bottom|inset|border-radius|radius/i.test(prop)) {
        if (v.startsWith("-")) {
            const positive = v.slice(1);
            const norm = ensureUnitForLength(positive);
            return norm ? `-${norm}` : null;
        }
        return ensureUnitForLength(v);
    }
    if (/width|height/.test(prop) && v.match(/^\d+\/\d+$/)) {
        const [a, b] = v.split("/").map(Number);
        if (b && !isNaN(a) && !isNaN(b))
            return `${(a / b) * 100}%`;
    }
    if (/transform-rotate|rotate/.test(prop)) {
        if (/^-?\d+(\.\d+)?$/.test(v))
            return `${v}deg`;
        return v;
    }
    if (/transform-scale|scale/.test(prop)) {
        if (/^-?\d+(\.\d+)?$/.test(v)) {
            const n = Number(v);
            if (Math.abs(n) > 3)
                return `${n / 100}`;
            return `${n}`;
        }
        return v;
    }
    if (/duration|delay/.test(prop))
        return ensureTimeUnit(v);
    if (/opacity|z-index|font-weight|flex-grow|flex-shrink|order|line-height/.test(prop)) {
        if (/^-?\d+(\.\d+)?$/.test(v))
            return v;
        return null;
    }
    return v; // i don't know what this property is and at this point i'm too afraid to ask
}
