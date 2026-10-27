# Security Policy

## Supported Versions

We actively support the following versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.5.x   | :white_check_mark: |
| 1.4.x   | :x:                |
| < 1.4   | :x:                |

## Reporting a Vulnerability

We take security seriously. If you discover a vulnerability in GarurSaili-CSS, please report it responsibly.

### How to Report

**⚠️ Please do NOT open a public GitHub issue for security vulnerabilities.**

Instead, use one of these private channels:

1. **GitHub Security Advisories** (preferred):  
   https://github.com/barshansarkar/Garursaili-CSS/security/advisories/new

2. **Email**: sarkarmithu387@gmail.com  
   Subject: `[SECURITY] GarurSaili-CSS — <brief description>`

### What to Include

- **Description** of the vulnerability
- **Affected version(s)** and platform(s)
- **Reproduction steps** (minimal working example)
- **Impact assessment** (who is affected and how)
- **Suggested fix** (if you have one)

### Response Timeline

- **Acknowledgment**: within 72 hours
- **Initial assessment**: within 7 days
- **Patch release**: typically within 14 days for critical issues

### Disclosure Policy

We follow [coordinated disclosure](https://en.wikipedia.org/wiki/Coordinated_vulnerability_disclosure):
- We will credit you in the release notes (unless you prefer to remain anonymous)
- We will publish a security advisory after the fix is available
- We ask that you give us reasonable time to address the issue before public disclosure

## Security Considerations

GarurSaili-CSS includes a native Rust module distributed as prebuilt binaries for multiple platforms. We ensure:

- **Reproducible builds**: All binaries built from tagged source via GitHub Actions
- **Provenance attestation**: SLSA Level 2 build provenance (via `actions/attest-build-provenance`)
- **Supply chain**: All GitHub Actions pinned to commit SHAs
- **Binary integrity**: SHA-512 hashes published for all platform packages

If you suspect a binary has been tampered with, verify it against the published hashes or rebuild from source.

## Scope

**In scope:**
- Arbitrary code execution in the Rust core
- CSS injection through user-controlled values (mitigated in `sanitize.rs`)
- Denial of service via malformed input
- Plugin sandbox escape
- Supply chain attacks on published packages

**Out of scope:**
- The user's own HTML/CSS/JS code
- Third-party dependencies (report upstream)
- Issues requiring physical device access

## Hall of Fame

We appreciate security researchers who help keep GarurSaili-CSS safe:

<!-- Contributors will be listed here with permission -->

---

**Thank you for helping keep GarurSaili-CSS secure!** 🦅
