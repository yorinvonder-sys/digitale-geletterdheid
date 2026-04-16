# Huidige Taak (Baton)

> Dit bestand is het stokje dat van sessie naar sessie wordt doorgegeven.
> Claude leest dit aan het begin van elke sessie om te weten waar we gebleven zijn.

---

## Actieve taak

**Werkstroom:** Infra
**Sprint:** 7 — Go-live
**Taak:** Productie-deploy (Yorin executes handmatig)
**Status:** 🟡 Deploy-handover klaar — wacht op Yorin om stappen 1-3 uit `SPRINT7-DEPLOY.md` uit te voeren

## Volgende taak

**Werkstroom:** Pilot
**Sprint:** 8 — Pilot-werving + externe review
**Taak:** Eerste school binnenhalen + juridische review van conformiteitsverklaring
**Beschrijving:** Outreach naar 3-5 doelgroep-scholen via pilot-aanmelden form, parallel juridische review van ondertekende conformiteitsverklaring en risicoregister door AI Act-jurist, voorbereiding CE-markering en EU-databank registratie.
**Done wanneer:** Eerste pilot-school aan boord + juridisch ondertekende conformiteitsverklaring.

## Context

- Sprint 1-4 afgerond (security, missies, UI/UX, homepage, dashboard)
- Sprint 5 afgerond: Go-to-Market (homepage, Compliance Hub, pilot-funnel, rapportage)
- Sprint 6 afgerond: AI Act HIGH RISK in code + pilot-operatie
- Deadline hoog-risico AI Act: 2 augustus 2026 (~107 dagen vanaf vandaag)

## Laatste sessie

- **Datum:** 16 april 2026 (2x: ochtend voor Fase E+F, middag voor Sprint 7 handover)

### Sessie 6 — Sprint 7 handover (middag 16 april)

- **Wat gedaan:**
  - `npm run build:prod` lokaal geverifieerd → slaagt zonder errors (29 statische routes geprerenderd)
  - Migraties syntactisch gecheckt (`ai_oversight_events`, `pilot_feedback`) — RLS + policies + indexes + CHECK constraints intact
  - Vastgesteld: deze sandbox heeft geen Supabase CLI, geen Vercel-token, geen productie-credentials — **deploy moet handmatig door Yorin**
  - `SPRINT7-DEPLOY.md` geschreven: 4-stappen playbook (migraties via CLI of dashboard, edge function deploy, Vercel deploy, rollback-plan)
  - `SPRINT7-SMOKE-TEST.md` geschreven: 5 route-checks + RLS/auth/CSP smoke + compliance-zelfaudit + final sign-off
  - `/compliance/conformiteitsverklaring` **bewust niet toegevoegd aan prerender** (portal-component returnt null bij SSR; bovendien geen SEO-target)

### Sessie 5 — Fase E + F via parallel expertise-agents
  - **Art. 9 Risk Register** — `config/aiActRiskRegister.ts` (20 risico's R01-R20), `services/riskRegisterService.ts` (summariseRiskPosture + filters), `components/compliance/AdminRiskRegister.tsx` (admin UI + CSV-export)
  - **Art. 12 + 14 Audit + Override** — migratie `ai_oversight_events` (JWT-based RLS, append-only, reasoning 10-2000 chars), `services/aiOversightService.ts` (logOversightEvent + batch), `components/teacher/SloOverrideModal.tsx`, integratie in `StudentSloReport` (Override-knop + badge, beide `print:hidden`)
  - **Conformiteitsverklaring** — `components/compliance/ConformiteitsVerklaring.tsx` met 13 Annex IV-secties, printbaar via `createPortal` + `.print-section` CSS, A4-page CSS inline
  - **Pilot Operatie** — migratie `pilot_feedback` (RLS + `at_least_one_signal` CHECK), edge function `submitPilotFeedback` (auth + rate limit + honeypot + service-role insert), `TeacherFeedbackWidget` (floating FAB in TeacherDashboard), `PilotKpiDashboard` (admin KPI met wekelijkse bar chart)
  - **Routes** — 3 nieuwe routes in AppRouter: `/compliance/conformiteitsverklaring` (publiek), `/admin/risicoregister` en `/admin/pilot-kpi` (via `AdminRouteWrapper` met useAuth)

- **Beslissingen:**
  - Parallel expertise-agents voor non-overlappende scopes; 2 timeouts, 2 successes uit de worktrees; Agent 1 + 3 zelf gebouwd in main tree om rond stream-timeouts te werken
  - RLS in `ai_oversight_events` via JWT-claims (`auth.users.raw_app_meta_data`) i.p.v. JOIN op `public.users` — performanter en consistent met `is_teacher()`
  - Admin-routes via kleine wrapper die `useAuth` resolveert en `user` als prop injecteert i.p.v. AuthenticatedApp zelf uitbreiden (kleinere blast radius)
  - Override-effect is audit-only: `calculateStudentKerndoelStats` blijft intact; override staat in log, visuele badge op rij

## Branch

- Huidige werk-branch: `claude/research-claude-skills-oF860`
- 11 commits ahead van main: skills, compliance hub, baton-B, pilot-flow, baton-C, student-rapport, baton-D, Fase E+F, baton-E+F, SPRINT7-deploy-docs, baton-Sprint7

## Sessie-continuïteit

- **Sessienummer:** 6 (afgerond)
- **Streak:** 6 (sessies op rij met output)
- **Voortgangslog:** `.claude/progress-log.md`
