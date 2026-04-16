# Taakwachtrij (Task Queue)

> Geprioriteerde lijst van taken na de huidige baton.
> Claude pakt de bovenste taak zodra de baton (`current-task.md`) is afgerond.

---

## Wachtrij (in volgorde van prioriteit)

### 1. Go-live voorbereiding
- **Werkstroom:** Infra
- **Sprint:** 7
- **Beschrijving:** Migraties runnen op productie (`ai_oversight_events`, `pilot_feedback`), edge function `submitPilotFeedback` deployen, `npm run build:prod` verifiëren, Vercel preview + productie-deploy, smoke test op admin-routes.
- **Done wanneer:** Alle nieuwe routes draaien op dgskills.app en admin-dashboards zijn bereikbaar voor Yorin.

### 2. Externe conformiteitsreview
- **Werkstroom:** Compliance
- **Sprint:** 7
- **Beschrijving:** Juridische review van conformiteitsverklaring + risicoregister door een AI Act-jurist, ondertekening, opname in conformiteitsdossier, voorbereiding voor CE-markering en EU-databank registratie.
- **Done wanneer:** Juridisch ondertekende conformiteitsverklaring is archiveerbaar en klaar voor externe audit.

---

## Afgeronde taken

| Taak | Datum | Werkstroom |
|------|-------|------------|
| Fase A — Projectinfrastructuur (.claude) | 3 apr 2026 | Infra |
| Fase B — Compliance Hub finaliseren | 14 apr 2026 | Compliance |
| Fase C — Onboarding & Trial Flow | 15 apr 2026 | Product |
| Fase D — Assessment & Rapportage | 15 apr 2026 | Product |
| Fase E — AI Act Compliance Code | 16 apr 2026 | Compliance |
| Fase F — Pilot Operatie | 16 apr 2026 | Pilot |

---

## Regels

- Bovenste item is altijd de volgende taak
- Afgeronde taken verhuizen naar de tabel onderaan
- Nieuwe taken worden op prioriteit ingevoegd, niet altijd onderaan
- Max 5-7 items in de wachtrij — splitsen als het meer wordt
