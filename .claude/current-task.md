# Huidige Taak (Baton)

> Dit bestand is het stokje dat van sessie naar sessie wordt doorgegeven.
> Claude leest dit aan het begin van elke sessie om te weten waar we gebleven zijn.

---

## Actieve taak

**Werkstroom:** Product
**Sprint:** 5 — Go-to-Market
**Taak:** Fase C — Onboarding & Trial Flow (deels)
**Status:** C1 (/pilot route) ✅ + C2 (first-login wizard) ✅ + C3 (welkomstmail) ⬜

## Volgende taak

**Werkstroom:** Product OF Compliance
**Sprint:** 5-6
**Taak:** Keuze uit drie opties (zie hieronder)
**Done wanneer:** afhankelijk van keuze

### Opties voor sessie 3:
1. **Fase C C3 — Welkomstmail docenten** (Product, klein): nieuwe edge function `sendTeacherWelcomeEmail` die Yorin handmatig stuurt na invite. Past op `claude/onboarding-trial-flow`.
2. **Security follow-up — Column-level RLS** (Compliance, medium): SECURITY DEFINER RPC + column-protection trigger op `role`/`school_id`. Nieuwe branch. Belangrijk voor 2 aug 2026 deadline.
3. **Fase D — Assessment & Rapportage** (Product, groot): leerlingrapportages, docentdashboard voortgangsoverzicht, SLO-koppeling.

## Context

- Fase A (infra) + B (compliance hub) zijn compleet.
- Fase C is 2/3 af: `/pilot` route + teacher first-login wizard zijn gebouwd en gepusht.
- **Drie branches wachten op review/merge:**
  - `claude/simplify-header-nav-XtaiN` — header simplificatie
  - `claude/compliance-hub-finaliseren` — 5 commits (Hub, Checklist, SLO-rapport, review, housekeeping)
  - `claude/onboarding-trial-flow` — 3 commits (/pilot, wizard, review + migratie)
- **Pre-existing security gap** in `users_update_own_or_teacher` RLS: teacher kan `role` en `school_id` self-updaten. Zie migratie `20260301170000` regels 103-114. Gedocumenteerd in commit `21e32a4`.
- Productbeslissingen genomen in deze sessie: handmatige invite door Yorin, verplichte wizard, eigen `/pilot` route.

## Laatste sessie

- **Datum:** 15 april 2026
- **Wat gedaan:** Fase B volledig afgerond + Fase C C1 + C2 + twee zelf-review rondes met simplify skill
- **Beslissingen:**
  - Hybride doc-strategie (publiek + op aanvraag) voor Compliance Hub
  - Geen nieuwe markdown-viewer routes
  - Handmatige invite flow voor docenten (niet automatisch na pilot-aanvraag)
  - Verplichte wizard (geen optionele carrousel)
  - Eigen `/pilot` route (geen modal)
  - `display_name` server-side gecapped op 200 chars via DB CHECK constraint

## Sessie-continuïteit

- **Sessienummer:** 3 (volgende sessie)
- **Streak:** 2 (actief sinds sessie 1)
- **Voortgangslog:** `.claude/progress-log.md` — Claude schrijft hier automatisch na elke sessie
