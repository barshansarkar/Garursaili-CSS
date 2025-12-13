// src/parser.ts
// Parse utility tokens into a canonical ParsedToken shape.
// Supports bracketed arbitrary values, negative prefixing, and important (!) modifier.
function unwrapBrackets(s) {
    if (!s)
        return s;
    if (s.startsWith("[") && s.endsWith("]"))
        return s.slice(1, -1);
    return s;
}
/**
 * Find matching closing bracket for the first '[' encountered.
 * This is robust against nested brackets and quotes.
 * this took me 2 hours to debug pls dont touch
 */
function findMatchingBracketIndex(s, openIndex) {
    let depth = 0;
    let inSingle = false;
    let inDouble = false;
    let inBacktick = false; // wait do we even have backticks in css values???
    for (let i = openIndex; i < s.length; i++) {
        const ch = s[i];
        const prev = i > 0 ? s[i - 1] : "";
        if (ch === "'" && !inDouble && !inBacktick && prev !== "\\")
            inSingle = !inSingle;
        else if (ch === '"' && !inSingle && !inBacktick && prev !== "\\")
            inDouble = !inDouble;
        else if (ch === "`" && !inSingle && !inDouble && prev !== "\\")
            inBacktick = !inBacktick;
        if (inSingle || inDouble || inBacktick)
            continue;
        if (ch === "[")
            depth++;
        else if (ch === "]") {
            depth--;
            if (depth === 0)
                return i;
        }
    }
    return -1; // bracket hell
}
export function parse(token) {
    if (!token || typeof token !== "string") {
        throw new Error("parse: token must be a non-empty string");
    }
    let raw = token.trim();
    let negative = false;
    let important = false;
    // Leading important marker (!) - follow Tailwind convention: !p-4
    // wait what if they do "!!p-4"?? idk
    while (raw.startsWith("!")) {
        important = true;
        raw = raw.slice(1);
    }
    // Negative prefix
    if (raw.startsWith("-")) {
        negative = true;
        raw = raw.slice(1);
    }
    // Bracketed arbitrary value: key-[...]
    const bracketIndex = raw.indexOf("[");
    if (bracketIndex !== -1) {
        const closing = findMatchingBracketIndex(raw, bracketIndex);
        if (closing !== -1) {
            let keyPart = raw.slice(0, bracketIndex);
            if (keyPart.endsWith("-"))
                keyPart = keyPart.slice(0, -1); // cleanup trailing hyphen
            const valuePart = raw.slice(bracketIndex, closing + 1);
            const value = unwrapBrackets(valuePart);
            if (!keyPart)
                throw new Error(`parse: empty key in bracket token "${token}"`);
            return { raw: token, key: keyPart, value, negative, important };
        }
        // if bracket present but no matching close, fallthrough to normal parsing to produce helpful error later
        // this feels wrong but it works???
    }
    // Non-bracketed: split on LAST hyphen so keys like "grid-cols-3" -> key=grid-cols, value=3
    const idx = raw.lastIndexOf("-");
    if (idx === -1) {
        // no value part; treat as flag-like utility (e.g., d-flex)
        return { raw: token, key: raw, value: "", negative, important };
    }
    const key = raw.slice(0, idx);
    const value = raw.slice(idx + 1);
    if (!key)
        throw new Error(`parse: empty key in token "${token}"`);
    if (value === undefined || value === null)
        throw new Error(`parse: missing value in token "${token}"`);
    return { raw: token, key, value, negative, important };
} // finally
