# Huidige Taak (Baton)

> Dit bestand is het stokje dat van sessie naar sessie wordt doorgegeven.
> Claude leest dit aan het begin van elke sessie om te weten waar we gebleven zijn.

---

## Actieve taak

**Werkstroom:** Product
**Sprint:** 5-6 — Rapportage
**Taak:** Fase D — Assessment & Rapportage
**Status:** ✅ Afgerond (15 april 2026)

## Volgende taak

**Werkstroom:** Compliance
**Sprint:** 6 — AI Act Deadline
**Taak:** Fase E — AI Act Compliance Code
**Beschrijving:** Art. 9 risk management in code (risicoregister koppelen aan live systeem), Art. 12 logging implementatie (audit-log voor elke AI-beoordeling en SLO-bepaling), Art. 14 human oversight dashboard (docent kan AI-gegenereerde beoordelingen corrigeren/overrulen met log), conformiteitsverklaring genereren (automatisch pdf op basis van Annex IV).
**Done wanneer:** Alle HIGH RISK verplichtingen zijn in code geïmplementeerd en een conformiteitsverklaring kan on-demand worden gegenereerd.

## Context

- Sprint 1-4 zijn afgerond (security, missies, UI/UX, homepage, dashboard)
- Sprint 5 loopt: Go-to-Market
- Fase A (Infra), B (Compliance Hub), C (Onboarding) en D (Rapportage) zijn klaar
- Drie DGSkills-skills zijn live: `dgskills-mission-author`, `dgskills-compliance-check`, `dgskills-supabase-edge`
- Deadline hoog-risico AI Act: 2 augustus 2026 (~108 dagen vanaf vandaag)

## Laatste sessie

- **Datum:** 15 april 2026
- **Wat gedaan:**
  - `StudentSloReport` modal gebouwd — printbaar + CSV-export per individuele leerling
  - Portal via `createPortal` naar `document.body` om bestaande print-section CSS te gebruiken
  - Integratie in `SLOClassOverview`: leerlingrij klikbaar + keyboard-toegankelijk (Enter/Space)
  - VSO-profielen correct: 18A-20B voor VSO-leerlingen, 21A-23C voor regulier
  - Per kerndoel: voltooide + open missies zichtbaar (titels via `getMissionMeta`)
  - CSV-export veilig: `csvEscape`, UTF-8 BOM voor Excel, gesanitizede filename
- **Beslissingen:**
  - Modal via `createPortal` i.p.v. inline (volgt bestaand pattern in `BookPreview.tsx`)
  - Print-gedrag via bestaande `print-section` CSS-klasse en Tailwind `print:*` prefixes — geen nieuwe CSS nodig
  - CSV i.p.v. PDF (client-side genereerbaar, geen lib nodig; school-compatibel)

## Branch

- Huidige werk-branch: `claude/research-claude-skills-oF860`
- 7 commits ahead van main: skills, compliance hub, baton-B, pilot-flow, baton-C, student-rapport

## Sessie-continuïteit

- **Sessienummer:** 4 (afgerond)
- **Streak:** 4 (sessies op rij met output)
- **Voortgangslog:** `.claude/progress-log.md`
