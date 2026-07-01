# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in DGSkills, please report it responsibly.

**Contact:** security@dgskills.app
**Response SLA:** We aim to respond within 48 hours and patch critical issues within 7 days.

Please do **not** open a public GitHub issue for security vulnerabilities.

## Scope

- https://www.dgskills.app (production)
- https://dgskills.app (production)

## Out of Scope

- Social engineering attacks
- Physical attacks
- Denial of service attacks
- Attacks requiring physical access to a user's device

## Known Security Controls

- HTTPS enforced via Vercel (HSTS preload, 2-year max-age)
- Content Security Policy (CSP) with `script-src 'self'`, `object-src 'none'`, `child-src 'none'`
- MFA (TOTP) required for teacher and admin roles (AAL2)
  - Schools that attest their identity provider (Microsoft Entra ID / Google Workspace) enforces MFA may opt in to have that IdP-enforced MFA satisfy this requirement instead of DGSkills' own TOTP (per-school flag; TOTP remains the default for email/password logins and schools without attestation).
- Role-Based Access Control enforced via Supabase `app_metadata` (server-set, tamper-resistant)
- DOMPurify v3 for XSS sanitization on all user input
- Prompt injection detection for AI interactions (40+ patterns, English + Dutch)
- Audit logging designed to support GDPR obligations (data stored and processed within the EU/EEA project region as contractually and operationally agreed)
- `blob:`, `javascript:`, `data:`, `vbscript:` protocols blocked in URL sanitizer

## Supported Versions

Only the latest production deployment is supported.
