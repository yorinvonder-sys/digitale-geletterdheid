# Voortgangslog — DGSkills

> Claude schrijft aan het einde van elke sessie een entry.
> Claude leest de laatste 3 entries aan het begin van de volgende sessie.
> Dit bestand wordt ALLEEN door Claude bijgewerkt — Yorin hoeft niets te doen.

---

## Identiteit

> Yorin is een onderwijsvernieuwer die digitale geletterdheid naar elke klas brengt.
> Elke sessie is bewijs. Elke shipped feature raakt straks echte leerlingen.

---

## Stats

- **Sessies totaal:** 6
- **Streak:** 6 sessie(s) achter elkaar met output
- **Taken afgerond:** 6 van 6 fasen + Sprint 7 deploy-handover klaar
- **Laatste sessie:** 16 april 2026 (middag)

---

## Log

### Sessie 6 — 16 april 2026 (middag) — Sprint 7 deploy-handover
- **Werkstroom:** Infra
- **Taak:** Sprint 7 — Go-live voorbereiding
- **Resultaat:**
  - `npm run build:prod` lokaal geslaagd (29 statische routes geprerenderd, geen errors)
  - Migratie-SQL structuur gecheckt: `ai_oversight_events` (11 statements) en `pilot_feedback` (10 statements) beide syntactisch compleet met RLS + policies + indexes + CHECK constraints
  - Vastgesteld: sandbox heeft geen Supabase CLI, geen Vercel-token → **deploy gaat handmatig door Yorin**
  - `SPRINT7-DEPLOY.md` geschreven: 4-stappen playbook (pre-flight / migraties CLI+dashboard / edge function / Vercel) + rollback-plan + verificatie-queries
  - `SPRINT7-SMOKE-TEST.md` geschreven: per-route checklist (conformiteitsverklaring publiek / admin risicoregister / admin pilot KPI), feature-checks voor TeacherFeedbackWidget + SloOverrideModal, security smoke-test (RLS, auth, CSP), final sign-off
  - `/compliance/conformiteitsverklaring` bewust niet in prerender-lijst (portal returnt null bij SSR; het is een interne compliance-doc, geen SEO-target)
- **Shipped:** 2 commits op `claude/research-claude-skills-oF860` (SPRINT7-docs + baton)
- **Identiteit:** Je hebt de hele deploy voor Sprint 7 in gecompilieerde, uitvoerbare vorm gezet. De code is deploy-klaar; jij voert de stappen uit op productie zodra je er tijd voor hebt. Geen verrassingen, geen giswerk.
- **Volgende:** Sprint 8 — pilot-werving + externe juridische review van conformiteitsverklaring

### Sessie 5 — 16 april 2026
- **Werkstroom:** Compliance + Pilot (parallel)
- **Taak:** Fase E (AI Act Compliance Code) + Fase F (Pilot Operatie)
- **Resultaat:**
  - 4 expertise-agents parallel gespawnd (2 worktree-successes, 2 timeouts met self-rebuild in main tree)
  - Art. 9: `aiActRiskRegister.ts` (20 risico's R01-R20), `riskRegisterService.ts`, `AdminRiskRegister.tsx` met CSV-export en 6-stat posture-samenvatting
  - Art. 12 + 14: migratie `ai_oversight_events` (JWT-based RLS, append-only, reasoning 10-2000 chars CHECK), `aiOversightService.ts` (logOversightEvent + batch), `SloOverrideModal`, Override-knop + "Overschreven"-badge in `StudentSloReport` (beide `print:hidden`)
  - Annex IV: `ConformiteitsVerklaring.tsx` met 13 secties, printbaar via `createPortal` + `.print-section` CSS, handtekeningsveld
  - Pilot Operatie: migratie `pilot_feedback` (RLS + `at_least_one_signal` CHECK), edge function `submitPilotFeedback` (auth + rate limit + honeypot), `TeacherFeedbackWidget` (floating FAB) en `PilotKpiDashboard` (admin KPI met weekly bar chart)
  - 3 routes in AppRouter: `/compliance/conformiteitsverklaring` (publiek) + `/admin/risicoregister` en `/admin/pilot-kpi` (via `AdminRouteWrapper` met `useAuth`)
  - `TeacherFeedbackWidget` geïntegreerd in `TeacherDashboard.tsx` als floating FAB (altijd zichtbaar voor docenten)
- **Shipped:** 1 commit op `claude/research-claude-skills-oF860` (`4bf37ce`) — 15 bestanden, 2.782 inserties
- **Identiteit:** Je hebt de HIGH RISK AI Act-blokkers weggewerkt die tot augustus 2026 boven je hoofd hingen — risicoregister, audit logging, docent-override, conformiteitsverklaring — en meteen ook Fase F (pilot-feedbackloop) afgerond. Alle 6 fasen zijn klaar voordat de pilot start.
- **Volgende:** Sprint 7 — migraties deployen + productie-rollout

### Sessie 4 — 15 april 2026 (avond)
- **Werkstroom:** Product
- **Taak:** Fase D — Assessment & Rapportage
- **Resultaat:**
  - `StudentSloReport` modal-component gebouwd — printbaar + CSV-export per leerling
  - Portal via `createPortal` naar `document.body` zodat bestaande print-section CSS (index.css) alleen het rapport print en de rest van de app verbergt
  - Header met leerlinggegevens, 4 stats-blokken (missies, kerndoelen geraakt, volledig gedekt, gem. dekking), per-kerndoel sectie met voortgangsbalk + voltooide/open missies (titels via `getMissionMeta`)
  - Auto-filter: VSO-leerlingen zien 18A-20B, regulier ziet 21A-23C
  - CSV-export: één rij per SLO-kerndoel, csvEscape voor injection-safety, UTF-8 BOM, gesanitizede filename
  - `SLOClassOverview` integratie: leerlingrij klikbaar (onClick + Enter/Space voor toetsenbord), subheader-copy bijgewerkt om nieuwe interactie uit te leggen
- **Shipped:** 1 commit op `claude/research-claude-skills-oF860` (`d1300c3`) — 2 bestanden, 446 inserties
- **Identiteit:** Je hebt de inspectie-verantwoording vandaag gesloten — elke docent kan met één klik een individueel dossier openen, printen en archiveren. Dat is bewijs per leerling, geen Excel-massa meer.
- **Volgende:** Fase E — AI Act Compliance Code

### Sessie 3 — 15 april 2026
- **Werkstroom:** Product
- **Taak:** Fase C — Onboarding & Trial Flow
- **Resultaat:**
  - `PilotRequestForm` geëxtraheerd als shared component (gebruikt door `/scholen` én nieuwe pagina)
  - Dedicated `/pilot-aanmelden` SEO-pagina gebouwd met benefits, tijdlijn, 6-item FAQ, sticky form, Compliance Hub link
  - Welkomstmail in `submitPilotRequest` uitgebreid: tijdlijn-blok, Compliance Hub CTA, FAQ (data residency, post-pilot, EU AI Act), KvK-vermelding
  - `TeacherSetupChecklist` component met 6 functionele taken (year kiezen, klas aanmaken, eerste missie, SLO-rapport verkennen, Compliance Hub delen, ouderlijke toestemming controleren)
  - localStorage-progress scoped per `user.uid`, whitelist voor XSS/drift
  - Integratie in `TeacherDashboard` Overview-tab, 1 regel toegevoegd
  - Sitemap.xml bijgewerkt met `/pilot-aanmelden` (priority 0.95)
- **Shipped:** 1 commit op `claude/research-claude-skills-oF860` (`ed5a285`) — 8 bestanden, 944 inserties / 248 schrapingen
- **Identiteit:** Je hebt de hele pilot-funnel vandaag gesloten — van eerste klik tot eerste les. Geen gaten meer tussen "school geïnteresseerd" en "docent geeft les".
- **Volgende:** Fase D — Assessment & Rapportage

### Sessie 2 — 14 april 2026
- **Werkstroom:** Infra → Compliance (scopewissel binnen sessie)
- **Taak:** Claude Skills onderzoek + Fase B — Compliance Hub finaliseren
- **Resultaat:**
  - 3 DGSkills-skills gebouwd: `dgskills-mission-author`, `dgskills-compliance-check`, `dgskills-supabase-edge`
  - ComplianceHub uitgebreid met 21 source-docs in 5 categorieën + mailto-opvraag per document
  - SloRapport gefikst: echte codes 21A-23C (regulier) + 18A-20B (VSO) uit `config/sloKerndoelen.ts`
  - ComplianceChecklist: 4e sectie "EU AI Act Hoog Risico" met 8 Art. 9-15 checkpoints
- **Shipped:** 2 commits op `claude/research-claude-skills-oF860` (`d6f6806`, `13f4773`)
- **Identiteit:** Je bouwt niet alleen een product maar een auditbaar fundament. Schoolbesturen zien nu in één blik dat je het serieus meent.
- **Volgende:** Fase C — Onboarding & Trial Flow

### Sessie 1 — 3 april 2026
- **Werkstroom:** Infra
- **Taak:** Fase A — Projectinfrastructuur
- **Resultaat:** .claude/ bestanden aangemaakt, 6 fasen geprioriteerd
- **Shipped:** Projectinfrastructuur compleet
- **Identiteit:** Je hebt een systeem neergezet waarmee je DGSkills structureel kunt bouwen. Onderwijsvernieuwers beginnen met fundament.
- **Volgende:** Fase B — Compliance Hub finaliseren
