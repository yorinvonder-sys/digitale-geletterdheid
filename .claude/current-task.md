# Huidige Taak (Baton)

> Dit bestand is het stokje dat van sessie naar sessie wordt doorgegeven.
> Claude leest dit aan het begin van elke sessie om te weten waar we gebleven zijn.

---

## Actieve taak

**Werkstroom:** Product
**Sprint:** 5 — Go-to-Market
**Taak:** Fase C — Onboarding & Trial Flow
**Status:** ✅ Afgerond (15 april 2026)

## Volgende taak

**Werkstroom:** Product
**Sprint:** 5-6 — Go-to-Market
**Taak:** Fase D — Assessment & Rapportage
**Beschrijving:** Leerlingrapportages, docentdashboard met voortgangsoverzicht per leerling, SLO-koppeling in rapportages (21A–23C + VSO 18A–20B), export/print voor docenten.
**Done wanneer:** Docenten zien per leerling welke SLO-doelen behaald zijn en kunnen dit exporteren.

## Context

- Sprint 1-4 zijn afgerond (security, missies, UI/UX, homepage, dashboard)
- Sprint 5 loopt: Go-to-Market
- Fase A (Infra), B (Compliance Hub), C (Onboarding) zijn klaar
- Drie DGSkills-skills zijn live: `dgskills-mission-author`, `dgskills-compliance-check`, `dgskills-supabase-edge`
- Zie `LAUNCH-PLAN.md` en `.claude/task-queue.md` voor de volledige wachtrij

## Laatste sessie

- **Datum:** 15 april 2026
- **Wat gedaan:**
  - PilotRequestForm geëxtraheerd en gedeeld tussen ScholenLandingContact en nieuwe pagina
  - Dedicated `/pilot-aanmelden` landing page gebouwd (benefits, FAQ, compliance-link, sticky form)
  - Welkomstmail-template uitgebreid met tijdlijn, Compliance Hub CTA, FAQ en KvK-referentie
  - TeacherSetupChecklist component gebouwd: 6 functionele first-login taken met localStorage-progress, integratie in Overview-tab
  - Sitemap bijgewerkt voor SEO-indexering
- **Beslissingen:**
  - localStorage ipv DB voor checklist-progress (MVP, scoped per user.uid)
  - Whitelist van item-IDs voor XSS/drift-bescherming
  - Bestaande TeacherOnboarding slideshow + TutorialSpotlight onaangeroerd (checklist is complementair, niet vervanging)

## Branch

- Huidige werk-branch: `claude/research-claude-skills-oF860`
- 4 commits ahead van main: `d6f6806` (skills), `13f4773` (compliance hub), `9345a27` (docs), `ed5a285` (fase C)

## Sessie-continuïteit

- **Sessienummer:** 3 (afgerond)
- **Streak:** 3 (sessies op rij met output)
- **Voortgangslog:** `.claude/progress-log.md`
