# Taakwachtrij (Task Queue)

> Geprioriteerde lijst van taken na de huidige baton.
> Claude pakt de bovenste taak zodra de baton (`current-task.md`) is afgerond.

---

## Wachtrij (in volgorde van prioriteit)

### 0. Content-kalibratie valideren
- **Werkstroom:** Product
- **Sprint:** 5
- **Beschrijving:** Yorin reviewt MISSION-STYLE-GUIDE.md en test de review-per-ronde workflow op 1 missie. Style guide wordt bijgesteld op basis van feedback.
- **Done wanneer:** Style guide gevalideerd door Yorin, 1 missie succesvol herschreven met het nieuwe proces.

### 1. Fase B — Compliance Hub finaliseren
- **Werkstroom:** Compliance
- **Sprint:** 5
- **Beschrijving:** ComplianceHub.tsx updaten met alle 17 compliance-documenten. Compliance checklist pagina vullen. SLO-rapport pagina verifiëren.
- **Done wanneer:** ICT-coördinatoren kunnen in 1 klik alle compliance-info vinden.

### 2. Fase C — Onboarding & Trial Flow
- **Werkstroom:** Product
- **Sprint:** 5
- **Beschrijving:** Pilot-aanmeldformulier bouwen, docent-onboarding flow afronden, welkomstmail template, eerste-inlog wizard.
- **Done wanneer:** Een docent kan zich aanmelden voor de pilot en direct aan de slag.

### 3. Fase D — Assessment & Rapportage
- **Werkstroom:** Product
- **Sprint:** 5-6
- **Beschrijving:** Leerlingrapportages, docentdashboard met voortgangsoverzicht, SLO-koppeling in rapportages.
- **Done wanneer:** Docenten zien per leerling welke SLO-doelen behaald zijn.

### 4. Fase E — AI Act Compliance Code
- **Werkstroom:** Compliance
- **Sprint:** 6
- **Beschrijving:** Art. 9 risk management in code, Art. 12 logging implementatie, Art. 14 human oversight dashboard, conformiteitsverklaring genereren.
- **Done wanneer:** Alle HIGH RISK verplichtingen zijn in code geïmplementeerd.

### 5. Fase F — Pilot Operatie
- **Werkstroom:** Pilot
- **Sprint:** 6+
- **Beschrijving:** Feedback-loop inrichten, KPI tracking, wekelijkse iteratie-cyclus, docent support kanaal.
- **Done wanneer:** Pilot draait stabiel met meetbare feedback.

---

## Afgeronde taken

| Taak | Datum | Werkstroom |
|------|-------|------------|
| Fase A — Projectinfrastructuur (.claude) | 3 apr 2026 | Infra |
| Content-kalibratieplan + MISSION-STYLE-GUIDE.md | 3 apr 2026 | Product |

---

## Regels

- Bovenste item is altijd de volgende taak
- Afgeronde taken verhuizen naar de tabel onderaan
- Nieuwe taken worden op prioriteit ingevoegd, niet altijd onderaan
- Max 5-7 items in de wachtrij — splitsen als het meer wordt
