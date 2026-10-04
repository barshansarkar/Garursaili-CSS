// ═══════════════════════════════════════════════════════════════════
// Sanitizer — prevents CSS injection through arbitrary values
// ═══════════════════════════════════════════════════════════════════

/// Returns true if an arbitrary CSS value is safe to embed in a declaration.
pub fn is_safe_arbitrary(v: &str) -> bool {
    if v.is_empty() { return false; }
    if v.len() > 512 { return false; }

    // Ban control chars (except common whitespace)
    if v.chars().any(|c| c.is_control() && c != '\t' && c != '\n' && c != '\r') {
        return false;
    }

    let mut in_single = false;
    let mut in_double = false;
    let mut prev = '\0';

    for c in v.chars() {
        match c {
            '\'' if !in_double && prev != '\\' => in_single = !in_single,
            '"'  if !in_single && prev != '\\' => in_double = !in_double,
            ';' | '{' | '}' if !in_single && !in_double => return false,
            '<' if !in_single && !in_double => return false,
            '\\' if !in_single && !in_double => return false,
            _ => {}
        }
        prev = c;
    }

    let lower = v.to_ascii_lowercase();
    if lower.contains("url(") {
        if lower.contains("javascript:")
            || lower.contains("data:text/html")
            || lower.contains("vbscript:")
            || lower.contains("expression(")
        {
            return false;
        }
    }
    true
}

/// Strict check for property names.
pub fn is_safe_property(p: &str) -> bool {
    if p.is_empty() || p.len() > 64 { return false; }
    p.chars().all(|c| {
        c.is_ascii_lowercase()
            || c.is_ascii_digit()
            || c == '-'
            || c == '_'
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn accepts_normal() {
        assert!(is_safe_arbitrary("10px"));
        assert!(is_safe_arbitrary("#ff0000"));
        assert!(is_safe_arbitrary("calc(100% - 2rem)"));
        assert!(is_safe_arbitrary("'hello world'"));
        assert!(is_safe_arbitrary("url(https://example.com/a.png)"));
    }

    #[test]
    fn rejects_breakers() {
        assert!(!is_safe_arbitrary("red; background:blue"));
        assert!(!is_safe_arbitrary("red}"));
        assert!(!is_safe_arbitrary("{color:red}"));
        assert!(!is_safe_arbitrary("</style><script>"));
    }

    #[test]
    fn rejects_unsafe_url() {
        assert!(!is_safe_arbitrary("url(javascript:alert(1))"));
        assert!(!is_safe_arbitrary("url(data:text/html,<script>)"));
    }
}