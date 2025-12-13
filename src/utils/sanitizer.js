"use strict";
// src/utils/sanitizer.ts
// Extended sanitizer: supports calc(), vw/vh, negative values, fractions, percent, time units,
// color normalization and additional filters and forms values.
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeColorToken = normalizeColorToken;
exports.ensureUnitForLength = ensureUnitForLength;
exports.ensureTimeUnit = ensureTimeUnit;
exports.normalizeTokenValueForProperty = normalizeTokenValueForProperty;
function normalizeColorToken(val) {
    if (!val)
        return null;
    var raw = val.trim();
    // CSS functions and variables pass-through
    if (/^var\(/.test(raw) || /linear-gradient|radial-gradient|conic-gradient|rgba?\(|hsla?\(/i.test(raw))
        return raw;
    // Complex background arbitrary values (e.g., url() no-repeat center)
    if (raw.startsWith('url(') && raw.endsWith(')')) {
        // Basic URL validation: url('path') or url("path") or url(path)
        if (/^url\(['"]?([^'")]+)['"]?\)$/.test(raw))
            return raw;
        return null; // Invalid URL format
    }
    if (/^oklch\(/i.test(raw))
        return raw;
    if (/^color-mix\(/i.test(raw))
        return raw;
    if (/^hsl\(/i.test(raw))
        return raw;
    // Allow combos like "url('/img.png') no-repeat center" etc.
    if (raw.includes('url(') && (raw.includes('no-repeat') || raw.includes('repeat') || raw.includes('center') || raw.includes('top') || raw.includes('left') || raw.includes('right') || raw.includes('bottom'))) {
        // Basic permissive check — return raw so bracketed values preserved; more validation can be added later
        return raw;
    }
    // Accept hex with or without leading #
    var hexOnly = /^[0-9a-fA-F]{3,8}$/;
    if (hexOnly.test(raw))
        return "#".concat(raw);
    if (/^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(raw))
        return raw;
    // Known keywords
    if (/^(transparent|currentColor|inherit|initial|revert)$/.test(raw))
        return raw;
    // Named colors allowed (basic)
    if (/^[a-zA-Z-]+$/.test(raw))
        return raw;
    // Arbitrary combos (commas/spaces) pass through (bracketed)
    if (raw.includes(" ") || raw.includes(","))
        return raw;
    return null;
}
function ensureUnitForLength(val) {
    if (!val)
        return val;
    var s = val.trim();
    if (s === "0")
        return "0";
    if (/^calc\(/.test(s))
        return s;
    // support common CSS units
    if (/^-?\d+(\.\d+)?(px|rem|em|vw|vh|ch|ex|vmin|vmax|%)$/.test(s))
        return s;
    if (/^-?\d+(\.\d+)?$/.test(s))
        return "".concat(s, "px");
    var frac = s.match(/^(-?\d+)\/(\d+)$/);
    if (frac) {
        var a = Number(frac[1]), b = Number(frac[2]);
        if (b !== 0)
            return "".concat((a / b) * 100, "%");
    }
    return s;
}
function ensureTimeUnit(val) {
    var s = val.trim();
    if (/^\d+$/.test(s))
        return "".concat(s, "ms");
    if (/^\d+ms$/.test(s) || /^\d+s$/.test(s))
        return s;
    return s;
}
function normalizeTokenValueForProperty(prop, value) {
    if (value === undefined || value === null)
        return null;
    var v = value.trim();
    if (/color|background|accent|caret|fill|stroke|ring|gradient|decoration/i.test(prop)) {
        var c = normalizeColorToken(v);
        return c;
    }
    if (/box-shadow|shadow/i.test(prop)) {
        var c = normalizeColorToken(v);
        if (c)
            return "0 0 0 3px ".concat(c);
        return v;
    }
    if (/padding|margin|width|height|min-width|min-height|max-width|max-height|gap|top|left|right|bottom|inset|border-radius|radius/i.test(prop)) {
        if (v.startsWith("-")) {
            var positive = v.slice(1);
            var norm = ensureUnitForLength(positive);
            return norm ? "-".concat(norm) : null;
        }
        return ensureUnitForLength(v);
    }
    if (/width|height/.test(prop) && v.match(/^\d+\/\d+$/)) {
        var _a = v.split("/").map(Number), a = _a[0], b = _a[1];
        if (b && !isNaN(a) && !isNaN(b))
            return "".concat((a / b) * 100, "%");
    }
    if (/transform-rotate|rotate/.test(prop)) {
        if (/^-?\d+(\.\d+)?$/.test(v))
            return "".concat(v, "deg");
        return v;
    }
    if (/transform-scale|scale/.test(prop)) {
        if (/^-?\d+(\.\d+)?$/.test(v)) {
            var n = Number(v);
            if (Math.abs(n) > 3)
                return "".concat(n / 100);
            return "".concat(n);
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
    return v;
}
