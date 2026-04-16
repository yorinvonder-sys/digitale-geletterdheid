---
name: dgskills-compliance-check
description: Use this skill BEFORE marking any DGSkills task, feature, or pull request as "done" — and whenever a change touches auth, RLS, CORS, permission logic, AI endpoints, edge functions, compliance docs, privacy claims, dependencies, or schema migrations. This skill runs the full DGSkills acceptance checklist plus EU AI Act Annex III 3(b) HIGH RISK verplichtingen (Art. 9 risk management, Art. 12 logging, Art. 14 human oversight, transparantie). Trigger phrases include "is dit klaar", "check compliance", "mag dit live", "done?", "acceptance check", "AI Act check", "security review".
---

# DGSkills Compliance Check — Playbook

DGSkills is een **HIGH RISK AI-systeem** onder EU AI Act Annex III 3(b) — AI voor beoordeling van leerresultaten bij **minderjarigen**. Elke wijziging loopt langs deze checklist voordat iets "done" mag zijn. Deadline AI Act-verplichtingen: **2 augustus 2026**.

## Wanneer activeren

- Voor elke taak markeren als ✅
- Voor elke PR maken of pushen naar main
- Na elke wijziging in: `supabase/functions/`, `services/supabase.ts`, `services/PermissionService.ts`, `supabase/migrations/`, `business/nl-vo/compliance/`, `docs/security/`, `Regelgeving/`
- Bij toevoegen van een nieuwe dependency
- Bij wijziging van privacy-claims, SLO-claims, of school-facing teksten

## Leesvolgorde (bij twijfel)

1. `.claude/acceptance-checklist.md` — de volledige projectchecklist
2. `CLAUDE.md` — altijd-actieve security regels
3. `SECURITY.md` — vulnerability reporting en controls
4. `docs/security/security-audit-rapport-dgskills.md` — laatste audit
5. `docs/security/rapport-ai-cybersecurity-kwetsbaarheden.md` — AI-specifieke risico's
6. `Regelgeving/AUDIT_RAPPORT_2026.md` — compliance audit
7. `business/nl-vo/compliance/legal-matrix.md` — juridisch kader
8. `business/nl-vo/compliance/dpia-dgskills-compleet.md` — DPIA

## Uitvoering — runs deze checks in volgorde

### Blok A — Snelle blokkade-check (stop als iets rood is)

| Check | Vraag | Rood als |
|---|---|---|
| Secrets in code | Staan er API keys, tokens, wachtwoorden in de diff? | `git diff` toont env-achtige strings |
| RLS omzeild | Is er een nieuwe tabel of query zonder RLS? | Migratie zonder `ENABLE ROW LEVEL SECURITY` + policies |
| systemInstruction via client | Wordt instructie vanaf browser gestuurd? | Client zet `systemInstruction` in request body |
| Build faalt | `npm run build:prod` groen? | Errors of TypeScript-fouten |
| Prompt injection mogelijk | User input gaat ongesanitized naar AI? | Geen aanroep van `promptSanitizer` |

**Als één van deze rood is: STOP. Fix eerst, dan hervatten.**

### Blok B — Security (OWASP + AI-specifiek)

- [ ] **XSS**: dynamische HTML geëscaped, user-generated HTML via DOMPurify, geen `dangerouslySetInnerHTML` met ongesanitized input
- [ ] **SQL injection**: Supabase query builder gebruikt, geen raw SQL met user input, geen string concat in `.rpc()` payloads
- [ ] **CSRF**: Supabase auth tokens, geen cookies-based state-changing endpoints zonder token
- [ ] **SSRF**: edge functions doen geen HTTP calls naar user-controlled URLs
- [ ] **Command injection**: Deno subprocess calls bevatten geen user input
- [ ] **Path traversal**: bestandsnamen gesanitized, geen `../` toegestaan
- [ ] **Secrets**: alleen via `Deno.env.get()` (server) of Vite env vars prefixed `VITE_` (client, alleen public)
- [ ] **Auth**: elke edge function valideert `Authorization` header via Supabase auth
- [ ] **CORS**: alleen `dgskills.app` + localhost dev-origins, geen `*`
- [ ] **MFA (AAL2)**: niet omzeild voor docent/admin
- [ ] **Error handling**: generieke messages naar client, details in server-logs
- [ ] **CSP**: geen nieuwe `unsafe-inline` of `unsafe-eval` in script-src
- [ ] **HTTPS**: alle fetches via https

### Blok C — AI-veiligheid (HIGH RISK specifiek)

- [ ] `systemInstruction` wordt **uitsluitend** server-side bepaald via `roleId` → `getSystemInstruction()` in `supabase/functions/_shared/systemInstructions.ts`
- [ ] User input voor AI-prompt gaat door `promptSanitizer` (client + server, beide kanten)
- [ ] Prompt injection patronen (40+ NL + EN) getoetst
- [ ] Homoglyph-normalisatie actief (Cyrillisch/Grieks/Cherokee/fullwidth → Latijn)
- [ ] Output-filter actief op AI-responses (`supabase/functions/_shared/outputFilter.ts`)
- [ ] Rate limiting op AI-endpoints (`supabase/functions/_shared/rateLimiter.ts`)
- [ ] AI-output wordt niet ongesanitized aan DOM meegegeven
- [ ] Welzijnsprotocol triggert bij gevoelige onderwerpen (zelfbeschadiging, pesten)

### Blok D — EU AI Act HIGH RISK (Annex III 3b)

- [ ] **Art. 9 Risk Management**: raakt de wijziging een risico-categorie? Update risk register in `business/nl-vo/compliance/`
- [ ] **Art. 10 Data Governance**: trainingsdata-claims kloppen? (Gemini via Vertex AI, geen trainings-gebruik door Anthropic/Google)
- [ ] **Art. 12 Logging**: AI-interacties, beoordelingsresultaten en bias-signalen worden audit-logged (server-side)
- [ ] **Art. 13 Transparantie**: leerling/docent ziet dat AI wordt gebruikt, welke beslissingen AI neemt
- [ ] **Art. 14 Human Oversight**: docent heeft override-mogelijkheid voor AI-gegenereerde beoordelingen
- [ ] **Art. 15 Accuracy & Cybersecurity**: accuraatheid-claims kloppen met productie-werkelijkheid

### Blok E — AVG / Privacy

- [ ] Geen nieuwe PII verzameld die niet in DPIA staat
- [ ] Data minimalisatie: alleen wat nodig is voor de functie
- [ ] Bewaartermijnen ongewijzigd OF DPIA bijgewerkt
- [ ] Bij minderjarigen: parental consent-flow intact (`approveParentalConsent` edge function)
- [ ] Privacyverklaring en AI-transparantieverklaring reflecteren de code-werkelijkheid
- [ ] Recht op inzage/verwijdering blijft werken (`exportMyData`, `deleteMyAccount` edge functions)
- [ ] Data residency: EU (europe-west4). Geen calls naar US-regio's toegevoegd
- [ ] Verwerkingsregister klopt voor nieuwe verwerkingen

### Blok F — Codekwaliteit

- [ ] TypeScript strict: geen `any`, geen impliciete `any`
- [ ] Componenten: PascalCase, named export, `React.FC<Props>`
- [ ] Services: camelCase, geen default exports
- [ ] Hooks: `use`-prefix, camelCase
- [ ] Types in `types/`, PascalCase
- [ ] Imports via `@/*` alias, geen relatieve `../../`-paden
- [ ] Geen ongebruikte imports, variabelen, dead code
- [ ] Edge functions: Deno runtime, `esm.sh` imports, gedeelde code in `_shared/`

### Blok G — Styling

- [ ] Tailwind inline in `className`, geen `@apply`
- [ ] Conditionals via template literals
- [ ] Kleuren via `lab-*` tokens, geen hardcoded hex
- [ ] Responsive: 375px (mobiel) en desktop getest
- [ ] Framer Motion alleen intentioneel

### Blok H — Toegankelijkheid (WCAG AA basis)

- [ ] Interactieve elementen: zichtbare focus-state
- [ ] Afbeeldingen: `alt`-attribuut (of `alt=""` decoratief)
- [ ] Formulieren: gekoppeld `<label>` of `aria-label`
- [ ] Kleurcontrast: WCAG AA
- [ ] Geen informatie alleen via kleur

### Blok I — Taal & Compliance-docs

- [ ] UI-teksten en foutmeldingen in Nederlands
- [ ] Code, variabelen, commentaar, commits in Engels
- [ ] Geen `[invullen]` placeholders in productie-teksten
- [ ] Compliance-docs aangepast? Check tegen code-werkelijkheid
- [ ] Claims in marketing/pricing kloppen met wat de code doet

### Blok J — Build & Deploy

- [ ] `npm run build:prod` slaagt zonder errors/warnings
- [ ] `tsc --noEmit` is groen
- [ ] Vercel preview-deploy werkt
- [ ] Edge functions getest (staging of `supabase functions serve`)
- [ ] `npm audit` — geen critical/high CVEs in nieuwe deps

## Uitvoer-format (rapportage)

Na het draaien van de check, rapporteer in dit format:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔒 COMPLIANCE CHECK — [taak/feature naam]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Groen: [X/10 blokken geslaagd]
⚠️  Aandachtspunten: [korte lijst]
❌ Blokkers: [korte lijst, of "geen"]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Status: [GO / NO-GO / GO met kanttekening]
Toelichting (gewone taal): [1-3 zinnen]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Gewone-taal samenvatting (altijd bijleveren)

Leg in 2-3 zinnen uit aan een niet-technische product owner:
- Wat is er gewijzigd?
- Wat is de privacy- of veiligheidsimpact?
- Kunnen we dit met een gerust hart naar een schoolbestuur laten zien?

## Wanneer WEL terugvragen aan Yorin

- Een blokker raakt een school-facing claim of compliance-document
- Een wijziging vraagt een update in de DPIA of verwerkingsregister (juridisch)
- Een nieuwe dataverwerking raakt minderjarigen en staat niet in de bestaande DPIA
- Onduidelijk of een afwijking van de checklist acceptabel is voor de mei-deadline

## Anti-patronen

- ❌ Task afvinken met "meeste checks groen, rest fix ik later"
- ❌ Secrets commiten om later te rebasen (ook in draft-PRs niet)
- ❌ RLS disabling "tijdelijk voor debug"
- ❌ `console.log` met PII in edge functions
- ❌ Privacyverklaring aanpassen zonder code-werkelijkheid te checken
- ❌ AI Act-verplichtingen "voor later" uitstellen — we hebben tot 2 aug 2026

## Referentie

Volledige checklist: `.claude/acceptance-checklist.md`
Security regels: `CLAUDE.md` → sectie "Security & Cybersecurity — VERPLICHT"
