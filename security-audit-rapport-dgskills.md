# DGSkills Security Audit Report

**Datum:** 15 maart 2026
**Auditor:** Claude Opus 4.6 (parallel audit via 4 gespecialiseerde agents)
**Scope:** Volledige codebase-audit op 8 categorieën, 60+ checkpunten
**Classificatie:** HIGH RISK onder EU AI Act Annex III punt 3(b)

---

## Managementsamenvatting

DGSkills heeft een **sterk technisch fundament** met defense-in-depth op authenticatie, RLS, CORS en prompt injection filtering. De architectuurkeuzes (app_metadata voor rollen, server-side systeeminstructies, SHA-256 token hashing, MFA op 3 lagen) zijn professioneel. Er zijn echter **7 KRITIEKE** en **18 HOGE/MEDIUM** bevindingen. De zwaarste gaps zitten in: (1) EU AI Act compliance — geen docent-override op AI-beoordelingen, geen risicoregister, geen Annex IV dossier; (2) ontbrekende rate limits op 6 Edge Function endpoints; (3) prompt sanitizer-bypasses via Unicode en meertalige aanvallen; (4) auto-merge CI/CD pipeline zonder security checks.

---

## Scores per categorie

| Categorie | Score | Kritiek | Hoog | Medium | Laag |
|-----------|-------|---------|------|--------|------|
| A: Prompt Injection & AI | 6/10 | 1 | 3 | 1 | 0 |
| B: Authenticatie & Sessie | 8/10 | 0 | 1 | 1 | 1 |
| C: Database & RLS | 7/10 | 1 | 2 | 2 | 0 |
| D: Edge Functions | 7.5/10 | 1 | 3 | 2 | 0 |
| E: Frontend Security | 7.5/10 | 0 | 1 | 2 | 0 |
| F: Privacy & AVG | 8/10 | 1 | 2 | 1 | 0 |
| G: Supply Chain & MCP | 5/10 | 1 | 1 | 1 | 0 |
| H: EU AI Act Compliance | 3/10 | 3 | 2 | 0 | 0 |
| **TOTAAL** | **52/80** | **8** | **15** | **10** | **1** |

---

## Gedetailleerde bevindingen

### KRITIEK — Docent kan STEP_COMPLETE niet overrulen (EU AI Act Art. 14)
- **Categorie:** H
- **Checkpunt:** H7
- **Bestand:** Architectuurniveau (geen override-mechanisme aanwezig)
- **Probleem:** De AI neemt beoordelingsbeslissingen (STEP_COMPLETE) die leervoortgang registreren. Docenten kunnen deze beslissingen niet terugdraaien. Er is geen monitoring-dashboard en geen noodstop.
- **Impact:** Directe schending van Art. 14 EU AI Act. Zonder menselijk toezicht is het systeem juridisch niet als hoog-risico AI op de markt te brengen. **Pre-launch blokker.**
- **CVSS-schatting:** N/A (compliance)
- **Fix:** Implementeer docent-override voor STEP_COMPLETE, bouw monitoring dashboard, implementeer per-klas/leerling noodstop.

---

### KRITIEK — Geen risicobeheersysteem (EU AI Act Art. 9)
- **Categorie:** H
- **Checkpunt:** H2
- **Bestand:** `business/nl-vo/compliance/eu-ai-act-conformiteitsplan.md:80` — "NIET VOLDAAN"
- **Probleem:** Geen risicoregister, geen risicobeoordeling per agent (30+ agents), geen specifieke risicobeoordeling voor minderjarigen (Art. 9(9)), geen adversarial testing protocol.
- **Impact:** Conformiteitsbeoordeling onmogelijk. Blokker voor CE-markering.
- **CVSS-schatting:** N/A (compliance)
- **Fix:** Risicoregister opstellen conform acties 9.1-9.7 uit het conformiteitsplan.

---

### KRITIEK — Geen Annex IV technische documentatie (EU AI Act Art. 11)
- **Categorie:** H
- **Checkpunt:** H4
- **Bestand:** `business/nl-vo/compliance/eu-ai-act-conformiteitsplan.md:141` — "NIET VOLDAAN"
- **Probleem:** Geen samenhangend technisch documentatiedossier met de 9 verplichte Annex IV secties. Bouwstenen bestaan, maar niet geassembleerd.
- **Impact:** Conformiteitsbeoordelingsprocedure (Art. 43 / Annex VI) niet uitvoerbaar. Langste pad naar compliance (~12 weken).
- **CVSS-schatting:** N/A (compliance)
- **Fix:** Annex IV dossier samenstellen met alle 9 secties.

---

### KRITIEK — Geen maxOutputTokens op chat endpoints (OWASP LLM10)
- **Categorie:** A
- **Checkpunt:** A7
- **Bestand:** `supabase/functions/chat/index.ts`, `supabase/functions/chatStream/index.ts`
- **Probleem:** Geen `generationConfig.maxOutputTokens` ingesteld. Een enkele request kan een response van tienduizenden tokens genereren. Bij 15 req/min per gebruiker kunnen kosten snel oplopen.
- **Impact:** Onbegrensde Vertex AI kosten. Potentieel financiële schade.
- **CVSS-schatting:** 6.5
- **Fix:** Voeg `generationConfig: { maxOutputTokens: 1024 }` toe aan beide endpoints.

---

### KRITIEK — Auto-merge pipeline zonder security checks
- **Categorie:** G
- **Checkpunt:** G4
- **Bestand:** `.github/workflows/auto-merge-to-main.yml`
- **Probleem:** `claude/**` branches worden direct naar main gemerged via `--ff-only` zonder enige test, lint, of security check. Geen pre-commit hooks, geen SAST, linting is een no-op (`echo 'Linting not configured'`).
- **Impact:** Kwaadaardige code kan via een `claude/**` branch ongecheckt in productie terechtkomen.
- **CVSS-schatting:** 8.0
- **Fix:** Voeg required checks toe (minimaal: build + type-check + `npm audit`). Configureer ESLint/Biome.

---

### KRITIEK — `get_next_invoice_number()` zonder permissiecheck
- **Categorie:** C
- **Checkpunt:** C6
- **Bestand:** `supabase/migrations/20260223000002:101-113`
- **Probleem:** SECURITY DEFINER functie zonder `SET search_path` en zonder permissiecheck. Elke authenticated gebruiker kan factuurnummers van andere gebruikers opsommen.
- **Impact:** Informatielek — aanvaller kan zien hoeveel facturen een gebruiker per jaar heeft.
- **CVSS-schatting:** 5.3
- **Fix:** Voeg `SET search_path = public` toe en valideer `auth.uid() = p_user_id`.

---

### KRITIEK — `approveParentalConsent` zonder rate limiting
- **Categorie:** D
- **Checkpunt:** D3
- **Bestand:** `supabase/functions/approveParentalConsent/index.ts`
- **Probleem:** Public endpoint zonder rate limiting. Elke request doet een DB lookup + SHA-256 hash.
- **Impact:** DoS-vector. Token brute-force theoretisch onmogelijk (256-bit), maar endpoint kan overbelast worden.
- **CVSS-schatting:** 5.0
- **Fix:** Voeg IP-based rate limit toe: max 10 req/min per IP.

---

### KRITIEK — Data-export mist 3 tabellen (AVG Art. 20)
- **Categorie:** F
- **Checkpunt:** F3
- **Bestand:** `supabase/functions/exportMyData/index.ts`
- **Probleem:** `student_consents`, `parental_consent_requests` en `peer_feedback` worden NIET mee-geëxporteerd. Dit is persoonlijke data die onder Art. 20 valt.
- **Impact:** Onvolledige data-export is een AVG-schending.
- **CVSS-schatting:** N/A (compliance)
- **Fix:** Voeg de 3 tabellen toe aan de Promise.all in exportMyData.

---

### HOOG — Unicode zero-width bypass in promptSanitizer
- **Categorie:** A
- **Checkpunt:** A1
- **Bestand:** `supabase/functions/_shared/promptSanitizer.ts`
- **Probleem:** Geen stripping van zero-width characters (U+200B-U+200F, U+FEFF), bidi-markers (U+202A-U+202E), of homoglyphs. NFKD normaliseert deze NIET weg. Een aanvaller kan patronen omzeilen met `i\u200Bg\u200Bn\u200Bo\u200Br\u200Be`.
- **Impact:** Volledige bypass van alle injection-patronen.
- **CVSS-schatting:** 7.0
- **Fix:** Voeg toe vóór normalisatie: `normalised = normalised.replace(/[\u200B-\u200F\u2028-\u202F\uFEFF\u00AD\u034F\u061C\u180E]/g, '')`

---

### HOOG — Geen meertalige patronen (FR/DE/ES)
- **Categorie:** A
- **Checkpunt:** A1
- **Bestand:** `supabase/functions/_shared/promptSanitizer.ts`
- **Probleem:** Alleen NL en EN patronen. Frans, Duits, Spaans injection-pogingen worden niet gedetecteerd.
- **Impact:** Elke leerling die een andere taal kent kan de filter omzeilen.
- **CVSS-schatting:** 6.0
- **Fix:** Voeg FR/DE/ES patronen toe, of implementeer taalmodel-gebaseerde detectie.

---

### HOOG — Base64-gecodeerde instructies niet gedetecteerd
- **Categorie:** A
- **Checkpunt:** A1
- **Bestand:** `supabase/functions/_shared/promptSanitizer.ts`
- **Probleem:** Geen check op base64-strings die decoderen naar injection-patronen.
- **Impact:** `aWdub3JlIGFsbCBwcmV2aW91cyBpbnN0cnVjdGlvbnM=` passeert de filter.
- **CVSS-schatting:** 5.5
- **Fix:** Detecteer en decodeer verdachte base64-strings (>50 chars), of blokkeer ze.

---

### HOOG — localStorage token-opslag (XSS-kwetsbaar)
- **Categorie:** B
- **Checkpunt:** B4
- **Bestand:** `src/services/supabase.ts:51-56`
- **Probleem:** Supabase SDK slaat JWT op in localStorage. Bij een XSS-kwetsbaarheid kunnen tokens gestolen worden.
- **Impact:** Sessie-hijacking bij XSS. Gemitigeerd door sterke CSP en geen gevonden XSS-vectoren.
- **CVSS-schatting:** 4.0 (gemitigeerd)
- **Fix:** Supabase-architectuurbeperking. Implementeer strikte CSP (gedaan) als primaire bescherming.

---

### HOOG — 5 Edge Functions zonder rate limiting
- **Categorie:** D
- **Checkpunt:** D3
- **Bestand:** `resetStudentPassword`, `mfa-trust`, `gdrive-auth`, `gdrive-callback`, `gdrive-backup`
- **Probleem:** Geen rate limiting op deze endpoints. `resetStudentPassword` heeft MFA+role check maar een gecompromitteerd teacher-account kan onbeperkt wachtwoorden resetten.
- **Impact:** DoS-vector en potentieel misbruik bij account-compromittering.
- **CVSS-schatting:** 5.0
- **Fix:** Voeg rate limits toe per endpoint.

---

### HOOG — `scanReceipt`/`scanSubscriptionClaude` in-memory rate limiting
- **Categorie:** D
- **Checkpunt:** D3
- **Bestand:** Beide edge functions
- **Probleem:** In-memory rate limiting reset bij Edge Function cold start. Niet persistent over Deno isolate instances.
- **Impact:** Rate limit bypass bij scale-up of cold starts.
- **CVSS-schatting:** 4.5
- **Fix:** Migreer naar `checkDurableRateLimit()` (Postgres-backed).

---

### HOOG — ~29 tabellen zonder bevestigde RLS in migrations
- **Categorie:** C
- **Checkpunt:** C1
- **Bestand:** Diverse (audit_logs, student_activities, mission_progress, shared_projects, etc.)
- **Probleem:** Deze tabellen worden gerefereerd in cascade-migratie maar RLS-status is niet bevestigd vanuit migrations.
- **Impact:** Als een tabel geen RLS heeft, kan elke authenticated gebruiker alle rijen lezen/schrijven.
- **CVSS-schatting:** 7.0 (als onbeschermd)
- **Fix:** Voer runtime-query uit: `SELECT relname, relrowsecurity FROM pg_class WHERE relnamespace = 'public'::regnamespace;`

---

### HOOG — Legal-matrix classificeert nog als "beperkt risico"
- **Categorie:** H
- **Checkpunt:** H1
- **Bestand:** `business/nl-vo/compliance/legal-matrix.md:32-33`
- **Probleem:** De legal-matrix — het interne referentiekader voor compliance — zegt nog "beperkt risico" en bevat alleen Art. 50 checkpunten (6 checks). Art. 9-15 verplichtingen worden systematisch gemist.
- **Impact:** Interne audits missen hoog-risico verplichtingen.
- **Fix:** Legal-matrix herschrijven met alle hoog-risico checkpunten (Art. 9-17, Art. 26, Art. 43).

---

### HOOG — STEP_COMPLETE events niet gelogd (Art. 12)
- **Categorie:** H
- **Checkpunt:** H5
- **Bestand:** `src/services/auditService.ts`
- **Probleem:** De AI-beslissing die leervoortgang registreert wordt niet in de audit trail vastgelegd. Geen tamper-resistance op audit logs.
- **Impact:** Bij vraag "waarom heeft de AI besloten dat mijn kind stap X niet heeft voltooid?" is er geen audit trail.
- **Fix:** Log STEP_COMPLETE events (agent, stap, timestamp, user_id). Overweeg append-only tabel.

---

### HOOG — `unsafe-inline` in style-src CSP
- **Categorie:** E
- **Checkpunt:** E2
- **Bestand:** `vercel.json:50`
- **Probleem:** `style-src 'self' 'unsafe-inline'` verzwakt XSS-bescherming tegen CSS-injectie.
- **Impact:** CSS-injectie kan data exfiltreren via `url()` in bepaalde browsers.
- **CVSS-schatting:** 3.5
- **Fix:** Onderzoek CSP nonces voor inline styles via Vercel middleware (niet triviaal met Tailwind).

---

### MEDIUM — System prompt leakage risico
- **Categorie:** A
- **Checkpunt:** A3
- **Bestand:** `supabase/functions/_shared/systemInstructions.ts`
- **Probleem:** Systeeminstructies bevatten pedagogische strategie, welzijnsprotocol-triggerwoorden, en `---STEP_COMPLETE:X---` marker-syntax.
- **Impact:** Leerlingen kunnen XP farming detectie omzeilen of markers manipuleren.
- **Fix:** Vervang marker-syntax door server-side evaluatie i.p.v. client-side parsing van AI-output.

---

### MEDIUM — 4 MFA-functies missen SET search_path
- **Categorie:** C
- **Checkpunt:** C6
- **Bestand:** `supabase/migrations/20260314100000` en `20260314153000`
- **Probleem:** `has_mfa_trust`, `create_mfa_trust`, `cleanup_expired_mfa_sessions`, `revoke_all_mfa_trust` zijn SECURITY DEFINER zonder `SET search_path`.
- **Impact:** Theoretisch search path injection. Praktisch laag op Supabase.
- **Fix:** Voeg `SET search_path = public` toe aan alle vier.

---

### MEDIUM — auth.uid() niet gewrapped in (SELECT ...) subqueries
- **Categorie:** C
- **Checkpunt:** C7
- **Bestand:** Alle RLS policy-definities
- **Probleem:** `auth.uid()` wordt per rij geëvalueerd i.p.v. eenmalig per query.
- **Impact:** Performance degradatie bij grote tabellen (tot 1000x trager).
- **Fix:** Wrap `auth.uid()` in `(SELECT auth.uid())` in alle policies.

---

### MEDIUM — scanSubscriptionClaude lekt error messages
- **Categorie:** D
- **Checkpunt:** D4/D5
- **Bestand:** `supabase/functions/scanSubscriptionClaude/index.ts:233-237, 305-316`
- **Probleem:** Interne error details (Claude API messages, stack traces) worden naar de client gestuurd.
- **Impact:** Informatielek over interne API-structuur.
- **Fix:** Vervang door generiek foutbericht.

---

### MEDIUM — localStorage missie-data niet gecleard bij logout
- **Categorie:** E
- **Checkpunt:** E6
- **Bestand:** `src/hooks/useMissionAutoSave.ts`
- **Probleem:** Missie-autosave in localStorage blijft staan na logout. Op gedeelde schoolcomputers leesbaar voor volgende gebruiker.
- **Impact:** Leerlingwerk (intellectueel eigendom van minderjarige) leesbaar op gedeelde computers.
- **Fix:** Clear `mission-autosave-*` keys bij logout.

---

### MEDIUM — DPA-verificatie Google Cloud en Vercel ontbreekt
- **Categorie:** F
- **Checkpunt:** F6
- **Probleem:** Verwerkersovereenkomsten met Google (Vertex AI) en Vercel niet verifieerbaar vanuit codebase.
- **Impact:** Chatberichten van minderjarigen worden naar Google gestuurd; IP-adressen naar Vercel.
- **Fix:** Bevestig dat Google Cloud DPA en Vercel DPA actief zijn.

---

### MEDIUM — Dependency version pinning
- **Categorie:** G
- **Checkpunt:** G2
- **Bestand:** `package.json`
- **Probleem:** 652 packages, alle met `^` of `~` ranges. Een kwaadaardige patch-release wordt automatisch opgehaald.
- **Impact:** Supply chain aanval via dependency update.
- **Fix:** Pin exact versions voor productie-kritische packages (react, supabase-js, dompurify).

---

### MEDIUM — Audit log bij account-verwijdering kan verdwijnen
- **Categorie:** F
- **Checkpunt:** F2
- **Bestand:** `supabase/functions/deleteMyAccount/index.ts:71`
- **Probleem:** Audit log entry wordt geschreven VOOR CASCADE delete. Als audit_logs in de CASCADE zit, is het bewijs weg.
- **Impact:** Geen compliance-bewijs dat verwijdering heeft plaatsgevonden.
- **Fix:** Verifieer dat audit_logs NIET in de CASCADE zit.

---

### LAAG — Account-enumeratie bij registratie
- **Categorie:** B
- **Checkpunt:** B7
- **Bestand:** `src/services/authService.ts:122-124`
- **Probleem:** "Dit e-mailadres is al in gebruik" lekt dat een account bestaat.
- **Impact:** Laag. Standaard Supabase-gedrag.
- **Fix:** Acceptabel trade-off voor UX.

---

## Aanbevelingen (top 5 prioriteit)

1. **[NU] Voeg `maxOutputTokens: 1024` toe** aan chat en chatStream endpoints — voorkomt onbegrensde Vertex AI kosten. Implementatietijd: 10 minuten.

2. **[NU] Fix promptSanitizer** — voeg Unicode zero-width stripping, meertalige patronen (FR/DE/ES), en base64-detectie toe. Implementatietijd: 2 uur.

3. **[DEZE WEEK] Voeg rate limiting toe** aan approveParentalConsent (IP-based) en 5 andere endpoints zonder rate limits. Migreer scanReceipt/scanSubscriptionClaude naar durable rate limiting. Implementatietijd: 4 uur.

4. **[DEZE WEEK] Fix auto-merge pipeline** — voeg minimaal build + type-check + npm audit als required checks toe. Implementatietijd: 1 uur.

5. **[DEZE MAAND] Start EU AI Act compliance** — docent-override voor STEP_COMPLETE, risicoregister, begin Annex IV dossier. Dit is het langste pad (12+ weken) met deadline 2 augustus 2026.

---

## Positieve bevindingen

1. **Roldetectie uit app_metadata** — tamper-resistant, correct afgedwongen op 3 lagen (frontend, database, edge functions). Professioneel niveau.

2. **MFA-enforcement op database-niveau** — `is_mfa_aal2()` in RLS policies voorkomt bypass via directe API-calls. Ongebruikelijk sterk voor een startup.

3. **Server-side systeeminstructies** — roleId-gebaseerde lookup voorkomt client-side prompt injection van systeeminstructies. Bekende issue uit CLAUDE.md is opgelost.

4. **Ouderlijk toestemmingssysteem** — SHA-256 gehashte tokens, 7-dagen expiry, IP/UA hashing, per-doel consent, intrekbaar. Voldoet aan AVG Art. 8.

5. **CORS-configuratie** — strict allowlist, origin + referer validatie, geen wildcard, dev-origins niet in productie. Beter dan 90% van vergelijkbare projecten.

6. **XP-fraude preventie** — self-award only, per-actie cap, dagelijkse cap, FOR UPDATE lock. Gamification-misbruik is effectief geblokkeerd.

7. **Content Security Policy** — sterke CSP met report-uri, HSTS met preload, frame-ancestors 'none', permissions-policy. Uitstekend.

8. **Vertex AI safety settings** — BLOCK_LOW_AND_ABOVE voor alle 4 categorieën. Correct voor platform met minderjarigen.

9. **Prompt sanitizer (fundament)** — 28 patronen, NFKD-normalisatie, URI-decoding, dubbele enforcement (client + server). Goed fundament ondanks de genoemde gaps.

10. **Data-minimalisatie** — chatberichten worden NIET opgeslagen, IP-adressen gehasht, AI-interactie logging is metadata-only. Privacy-by-design.

---

## Bijlage: Checkpunten-overzicht

| Check | Status | Check | Status | Check | Status |
|-------|--------|-------|--------|-------|--------|
| A1 | RISICO | C1 | RISICO | E1 | RISICO |
| A2 | VEILIG | C2 | VEILIG | E2 | RISICO |
| A3 | RISICO | C3 | VEILIG | E3 | RISICO |
| A4 | VEILIG | C4 | VEILIG | E4 | VEILIG |
| A5 | VEILIG | C5 | VEILIG | E5 | VEILIG |
| A6 | VEILIG | C6 | KRITIEK | E6 | RISICO |
| A7 | KRITIEK | C7 | RISICO | F1 | VEILIG |
| A8 | VEILIG | C8 | VEILIG | F2 | RISICO |
| B1 | VEILIG | D1 | VEILIG | F3 | KRITIEK |
| B2 | VEILIG | D2 | VEILIG | F4 | VEILIG |
| B3 | VEILIG | D3 | KRITIEK | F5 | VEILIG |
| B4 | RISICO | D4 | RISICO | F6 | RISICO |
| B5 | VEILIG | D5 | RISICO | G1 | VEILIG |
| B6 | VEILIG | D6 | VEILIG | G2 | RISICO |
| B7 | LAAG | D7 | VEILIG | G3 | VEILIG |
| B8 | VEILIG | D8 | VEILIG | G4 | KRITIEK |
| | | | | G5 | VEILIG |
| | | | | H1 | RISICO |
| | | | | H2 | KRITIEK |
| | | | | H3 | RISICO |
| | | | | H4 | KRITIEK |
| | | | | H5 | RISICO |
| | | | | H6 | RISICO |
| | | | | H7 | KRITIEK |
| | | | | H8 | RISICO |
