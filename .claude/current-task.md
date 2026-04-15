# Huidige Taak (Baton)

> Dit bestand is het stokje dat van sessie naar sessie wordt doorgegeven.
> Claude leest dit aan het begin van elke sessie om te weten waar we gebleven zijn.

---

## Actieve taak

**Werkstroom:** Compliance
**Sprint:** 5 — Go-to-Market
**Taak:** Fase B — Compliance Hub finaliseren
**Status:** ✅ Afgerond (14 april 2026)

## Volgende taak

**Werkstroom:** Product
**Sprint:** 5 — Go-to-Market
**Taak:** Fase C — Onboarding & Trial Flow
**Beschrijving:** Pilot-aanmeldformulier bouwen, docent-onboarding flow afronden, welkomstmail template, eerste-inlog wizard.
**Done wanneer:** Een docent kan zich aanmelden voor de pilot en direct aan de slag.

## Context

- Sprint 1-4 zijn afgerond (security, missies, UI/UX, homepage, dashboard)
- Sprint 5 loopt: Go-to-Market
- Fase A (Infra) en Fase B (Compliance Hub) zijn klaar
- Drie DGSkills-specifieke Claude Skills zijn live: `dgskills-mission-author`, `dgskills-compliance-check`, `dgskills-supabase-edge`
- Zie `LAUNCH-PLAN.md` voor sprintoverzicht en `.claude/task-queue.md` voor wachtrij

## Laatste sessie

- **Datum:** 14 april 2026
- **Wat gedaan:**
  - Onderzoek Claude Skills community (Reddit/HN/Medium/GitHub) → 3 skills gebouwd
  - Fase B afgerond: ComplianceHub uitgebreid met 21 source-docs in 5 categorieën, SLO-rapport gefikst naar echte codes 21A-23C + VSO 18A-20B, checklist uitgebreid met EU AI Act hoog-risico sectie (Art. 9-15)
- **Beslissingen:**
  - Community-skills niet zonder audit installeren (Snyk ToxicSkills: 13,4% critical issues)
  - Source-docs uit `business/nl-vo/compliance/` zijn "op aanvraag" via mailto (niet publiek gehost)

## Branch

- Huidige werk-branch: `claude/research-claude-skills-oF860`
- 2 commits ahead van main: `d6f6806` (skills), `13f4773` (compliance hub)

## Sessie-continuïteit

- **Sessienummer:** 2 (afgerond)
- **Streak:** 2 (sessies op rij met output)
- **Voortgangslog:** `.claude/progress-log.md`
