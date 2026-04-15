# Taakwachtrij (Task Queue)

> Geprioriteerde lijst van taken na de huidige baton.
> Claude pakt de bovenste taak zodra de baton (`current-task.md`) is afgerond.

---

## Wachtrij (in volgorde van prioriteit)

### 1. Fase E — AI Act Compliance Code
- **Werkstroom:** Compliance
- **Sprint:** 6
- **Beschrijving:** Art. 9 risk management in code (risicoregister koppelen aan live systeem), Art. 12 logging implementatie (audit-log voor elke AI-beoordeling en SLO-bepaling), Art. 14 human oversight dashboard (docent kan AI-gegenereerde beoordelingen corrigeren/overrulen met log), conformiteitsverklaring genereren (automatisch pdf op basis van Annex IV).
- **Done wanneer:** Alle HIGH RISK verplichtingen zijn in code geïmplementeerd en een conformiteitsverklaring kan on-demand worden gegenereerd.

### 2. Fase F — Pilot Operatie
- **Werkstroom:** Pilot
- **Sprint:** 6+
- **Beschrijving:** Feedback-loop inrichten, KPI tracking, wekelijkse iteratie-cyclus, docent support kanaal.
- **Done wanneer:** Pilot draait stabiel met meetbare feedback.

---

## Afgeronde taken

| Taak | Datum | Werkstroom |
|------|-------|------------|
| Fase A — Projectinfrastructuur (.claude) | 3 apr 2026 | Infra |
| Fase B — Compliance Hub finaliseren | 14 apr 2026 | Compliance |
| Fase C — Onboarding & Trial Flow | 15 apr 2026 | Product |
| Fase D — Assessment & Rapportage | 15 apr 2026 | Product |

---

## Regels

- Bovenste item is altijd de volgende taak
- Afgeronde taken verhuizen naar de tabel onderaan
- Nieuwe taken worden op prioriteit ingevoegd, niet altijd onderaan
- Max 5-7 items in de wachtrij — splitsen als het meer wordt
