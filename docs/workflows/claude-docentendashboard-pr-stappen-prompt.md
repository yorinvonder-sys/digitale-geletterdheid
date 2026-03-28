# Claude Prompt — Docentendashboard In Kleine PR-Stappen

Gebruik deze prompt als Claude het werk gefaseerd moet uitvoeren in kleine, reviewbare PR's in plaats van in één grote sprong.

Kopieer alles tussen `---PROMPT START---` en `---PROMPT END---`.

---PROMPT START---

Je werkt in deze repository als de primaire builder.

## Doel

Upgrade het docentendashboard van DGSkills, maar doe dit in kleine, logische PR-stappen die veilig te reviewen zijn.

Werk niet naar één grote alles-in-één wijziging toe. Splits het werk in maximaal 3 kleine PR's met duidelijke scope en lage regressiekans.

## Grote productdoel

Het docentendashboard moet:
- duidelijker aansluiten op de leerlingervaring
- minder versnipperd aanvoelen
- docenten sneller grip geven op klas, voortgang en interventies
- reporting en school-facing betrouwbaarheid behouden

## Lees eerst

Minimaal:
- `CLAUDE.md`
- `docs/workflows/claude-builder-prompt.md`
- `docs/workflows/claude-codex-review.md`
- `AuthenticatedApp.tsx`
- `components/TeacherDashboard.tsx`
- relevante bestanden in `components/teacher/`
- `components/ProjectZeroDashboard.tsx`
- `services/teacherService.ts`
- `services/missionService.ts`
- `types.ts`
- `config/missions.ts`
- `config/curriculum.ts`
- `components/teacher/MissionProgressPanel.tsx`
- `components/teacher/SLOClassOverview.tsx`
- `components/teacher/CLAUDE.md`

## Werkwijze

Doe eerst een korte analyse en stel dan een fasering voor in maximaal 3 PR's.

Gebruik bij voorkeur een verdeling als deze, tenzij de codebase iets beters vraagt:

1. PR 1: Informatiearchitectuur en navigatie
2. PR 2: Docent-leerling koppeling en interventielogica
3. PR 3: Reporting, detailverrijking en polish

Belangrijk:
- begin alleen met PR 1
- implementeer niet alvast onderdelen van PR 2 of PR 3 als dat vermijdbaar is
- optimaliseer voor kleine, schone handoffs naar Codex review

## Wat je in je eerste antwoord moet doen

1. Benoem kort de grootste problemen in de huidige situatie.
2. Stel een fasering voor in maximaal 3 PR's.
3. Kies bewust alleen PR 1 als uitvoerscope.
4. Implementeer PR 1 volledig.

## Richtlijnen voor PR 1

PR 1 moet:
- een duidelijke, beperkte scope hebben
- direct productwaarde geven
- weinig regressierisico hebben
- geen onnodige schemawijzigingen bevatten

Voorbeelden van goede PR 1-scope:
- tab- en navigatievereenvoudiging
- helderder overview
- duidelijkere teacher copy en hoofdacties
- betere grouping van bestaande panelen

## Randvoorwaarden

- Breek geen auth-, role-, MFA- of RLS-logica
- Respecteer school- en klasisolatie
- Verander reporting-semantiek niet stilzwijgend
- Voeg geen mockdata toe
- Houd iedere PR klein en logisch

## Acceptatiecriteria

- Claude levert alleen PR 1 op, niet stiekem alles tegelijk
- PR 1 is zelfstandig reviewbaar
- PR 1 verbetert duidelijk de docentervaring
- open punten voor volgende PR's zijn expliciet benoemd

## Werkregels

- Maak of gebruik altijd een branch met prefix `claude/`
- Werk toe naar een PR naar `main`
- Wees eerlijk over risico's en niet-uitgevoerde tests
- Schrijf de PR-body zo dat Codex de diff snel en kritisch kan reviewen

## Verplichte eindoutput

Schrijf na afloop een complete PR-beschrijving in exact dit formaat:

## Doel
[Welke gebruikers- of productuitkomst levert deze PR op?]

## Wat Is Veranderd
[De belangrijkste wijzigingen, kort en concreet]

## Tests
[Commands, handmatige checks, of duidelijk waarom iets niet getest is]

## Risico's
[Regressierisico's, aannames, open punten]

## Graag Op Letten
[Waar Codex extra scherp op moet reviewen]

---PROMPT END---
