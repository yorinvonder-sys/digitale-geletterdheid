---
name: security-hardening
description: Security hardening, cybersecurity, and data safety guidelines for DGSkills. Use this skill when reviewing, writing, or modifying code that touches authentication, authorization, user input, AI endpoints, secrets, RLS policies, CORS, CSP, or any data handling involving students or teachers.
metadata:
  author: DGSkills
  version: "1.0.0"
  date: March 2026
  abstract: Comprehensive security and data safety guide for an educational platform classified as HIGH RISK under EU AI Act. Covers OWASP Top 10, prompt injection prevention, RLS enforcement, data minimization, and school-facing compliance requirements.
---

# DGSkills Security Hardening

Security and data safety guide for a school-facing educational AI platform that processes data of minors. This is a HIGH RISK AI system under EU AI Act Annex III.

## When to Apply

Reference these guidelines when:
- Writing or modifying edge functions (especially AI endpoints)
- Changing Supabase schema, migrations, or RLS policies
- Handling user input (forms, URL params, API bodies, AI prompts)
- Adding or updating authentication or authorization logic
- Adding new npm or Deno dependencies
- Modifying CORS, CSP, or other security headers
- Working with student, teacher, or school data
- Creating exports, reports, or data-sharing features
- Reviewing code for security vulnerabilities

## Priority Rules

| Priority | Category | Scope |
|----------|----------|-------|
| CRITICAL | Input Validation & Sanitization | All user input, all trust boundaries |
| CRITICAL | Authentication & Authorization | Supabase auth, RLS, MFA, role checks |
| CRITICAL | Prompt Injection Prevention | AI endpoints, systemInstruction, chat |
| HIGH | Secrets Management | API keys, tokens, service accounts |
| HIGH | Data Minimization & Privacy | PII, student data, DPIA compliance |
| HIGH | Output Security | XSS prevention, error message safety |
| MEDIUM | Dependency Security | npm audit, known CVEs |
| MEDIUM | Transport & Header Security | HTTPS, CSP, CORS, HSTS |
| LOW | Logging & Monitoring | Audit trails, error tracking |

## Rule Details

### 1. Input Validation (CRITICAL)

**Principe:** Vertrouw nooit client-side data. Valideer alles server-side.

**Verplicht:**
- Valideer type, lengte, format, en bereik van alle inputs
- Sanitize HTML input met DOMPurify v3
- Blokkeer `blob:`, `javascript:`, `data:`, `vbscript:` protocols
- Gebruik parameterized queries (Supabase client doet dit standaard)
- Valideer en beperk file uploads op type en grootte

**Verboden:**
- `eval()`, `Function()`, `innerHTML` met ongesanitizede input
- String concatenation in SQL queries
- Client-gestuurde `systemInstruction` naar AI models
- Ongevalideerde redirects of URL-constructie uit user input

### 2. Authentication & Authorization (CRITICAL)

**Principe:** Supabase RLS is de primaire beveiligingslaag. Alles erachter is defense-in-depth.

**Verplicht:**
- Elke edge function valideert de `Authorization` header
- Docent- en adminrollen vereisen MFA (AAL2)
- Role checks via `app_metadata` (server-set, tamper-resistant)
- School-scoping: gebruikers zien alleen data van eigen school
- RLS-policies testen bij elke migratie

**Verboden:**
- RLS-policies uitschakelen of verzwakken zonder expliciete documentatie
- Role checks op basis van client-claims of `user_metadata`
- Service role key gebruiken in client-side code
- Anonieme toegang tot edge functions tenzij expliciet ontworpen

### 3. Prompt Injection Prevention (CRITICAL)

**Principe:** AI-interacties zijn een attack surface. Behandel ze als security-kritiek.

**Verplicht:**
- SystemInstruction wordt server-side bepaald, niet door de client
- User input naar AI wordt gesanitized tegen 40+ injection patterns (NL + EN)
- AI responses worden behandeld als untrusted output
- Rate limiting op AI endpoints
- Logging van verdachte prompt patterns

**Verboden:**
- Client-gestuurde systemInstruction of model parameters
- Onbeperkte tokenlimiet op AI responses
- AI output direct als HTML renderen zonder sanitization

### 4. Secrets Management (HIGH)

**Verplicht:**
- Secrets via environment variables of Supabase secrets
- `Deno.env.get()` in edge functions
- `.env` bestanden in `.gitignore`
- Rotate secrets bij vermoeden van compromise

**Verboden:**
- Secrets in code, comments, of commit messages
- Secrets loggen (ook niet in development)
- Secrets in client-side bundles of browser console

### 5. Data Minimization (HIGH)

**Verplicht:**
- Verzamel alleen data die nodig is (DPIA als leidraad)
- Retourneer alleen benodigde velden in API responses
- Student data is extra beschermd (minderjarigen)
- Respecteer consent-flows en ouderlijke toestemming
- Data residency: EU (europe-west4, Nederland)

**Verboden:**
- `SELECT *` in queries naar de client
- PII opslaan die niet in het verwerkingsregister staat
- Data delen met derden zonder verwerkersovereenkomst

### 6. Output Security (HIGH)

**Verplicht:**
- React's standaard escaping voor dynamische content
- DOMPurify voor user-generated HTML
- Generieke foutmeldingen naar gebruikers
- Gedetailleerde errors alleen server-side loggen

**Verboden:**
- Stack traces naar de client sturen
- Database-structuur of interne paden in error responses
- `dangerouslySetInnerHTML` zonder DOMPurify

### 7. Dependency Security (MEDIUM)

**Verplicht:**
- Controleer packages op bekende CVEs voor installatie
- Gebruik bekende, actief onderhouden packages
- Pin major versions in `package.json`
- `esm.sh` imports in edge functions met versie-pinning

**Verboden:**
- Packages met onopgeloste kritieke CVEs toevoegen
- Onbekende of unmaintained packages voor security-kritieke functies
- Wildcard versies (`*`) in dependencies

### 8. Transport & Header Security (MEDIUM)

**Actuele controls:**
- HTTPS via Vercel (HSTS preload, 2-year max-age)
- CSP: `script-src 'self'`, `object-src 'none'`, `child-src 'none'`
- CORS whitelist: alleen `dgskills.app` en lokale dev origins

**Verboden:**
- CORS wildcard (`*`) in productie
- `unsafe-inline` of `unsafe-eval` in CSP script-src
- HTTP endpoints zonder redirect naar HTTPS

## Security Reference Documents

| Document | Pad |
|----------|-----|
| Security Policy | `SECURITY.md` |
| Security Audit | `docs/security/security-audit-rapport-dgskills.md` |
| AI Cybersecurity | `docs/security/rapport-ai-cybersecurity-kwetsbaarheden.md` |
| Compliance Audit | `Regelgeving/AUDIT_RAPPORT_2026.md` |
| DPIA | `business/nl-vo/compliance/dpia-dgskills-compleet.md` |
| Legal Matrix | `business/nl-vo/compliance/legal-matrix.md` |
| Verwerkingsregister | `business/nl-vo/compliance/verwerkingsregister-dgskills.md` |

## Checklist Before Completing Security-Sensitive Work

- [ ] Geen nieuwe OWASP Top 10 kwetsbaarheden geïntroduceerd
- [ ] Input validatie op alle trust boundaries
- [ ] RLS-policies intact en getest
- [ ] Geen secrets in code, logs, of client bundles
- [ ] Error responses zijn generiek voor de client
- [ ] AI-interacties beschermd tegen prompt injection
- [ ] Data minimalisatie gerespecteerd
- [ ] Security impact uitgelegd in plain Dutch
