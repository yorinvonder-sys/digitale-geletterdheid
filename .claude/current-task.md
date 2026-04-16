# Huidige Taak (Baton)

> Dit bestand is het stokje dat van sessie naar sessie wordt doorgegeven.
> Claude leest dit aan het begin van elke sessie om te weten waar we gebleven zijn.

---

## Actieve taak

**Werkstroom:** Compliance + Pilot
**Sprint:** 6 — AI Act Deadline
**Taak:** Fase E (AI Act Compliance Code) + Fase F (Pilot Operatie)
**Status:** ✅ Afgerond (16 april 2026)

## Volgende taak

**Werkstroom:** Infra
**Sprint:** 7 — Go-live
**Taak:** Migraties deployen + productie-rollout
**Beschrijving:** `ai_oversight_events` en `pilot_feedback` migraties naar Supabase productie, `submitPilotFeedback` edge function deployen, `npm run build:prod` verifiëren, Vercel preview, smoke test op `/admin/risicoregister`, `/admin/pilot-kpi`, `/compliance/conformiteitsverklaring`, en `SloOverrideModal` in docent-rapport.
**Done wanneer:** Alle nieuwe routes draaien live op dgskills.app; admin-dashboards en override-flow werken end-to-end.

## Context

- Sprint 1-4 afgerond (security, missies, UI/UX, homepage, dashboard)
- Sprint 5 afgerond: Go-to-Market (homepage, Compliance Hub, pilot-funnel, rapportage)
- Sprint 6 afgerond: AI Act HIGH RISK in code + pilot-operatie
- Deadline hoog-risico AI Act: 2 augustus 2026 (~107 dagen vanaf vandaag)

## Laatste sessie

- **Datum:** 16 april 2026
- **Wat gedaan (Fase E + F via parallel expertise-agents):**
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
- 9 commits ahead van main: skills, compliance hub, baton-B, pilot-flow, baton-C, student-rapport, baton-D, Fase E+F, baton-E+F

## Sessie-continuïteit

- **Sessienummer:** 5 (afgerond)
- **Streak:** 5 (sessies op rij met output)
- **Voortgangslog:** `.claude/progress-log.md`
