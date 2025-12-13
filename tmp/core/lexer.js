// 🧠 Lexer: Break class strings into atomic tokens
export function lex(classString) {
    return classString
        .split(/\s+/)
        .map(token => token.trim())
        .filter(Boolean);
}
