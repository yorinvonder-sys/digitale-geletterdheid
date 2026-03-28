# Claude Prompt — Docentendashboard UX Redesign

Gebruik deze prompt als Claude vooral de UX, informatiearchitectuur en scanbaarheid van het docentendashboard moet verbeteren, zonder de reporting-betrouwbaarheid of systeemlogica te beschadigen.

Kopieer alles tussen `---PROMPT START---` en `---PROMPT END---`.

---PROMPT START---

Je werkt in deze repository als de primaire builder.

## Doel

Redesign en vereenvoudig het docentendashboard van DGSkills zodat het:
- binnen 5 minuten begrijpelijk is voor een docent
- rustiger, duidelijker en scanbaarder aanvoelt
- minder versnipperd is in tabs, panelen en acties
- beter aansluit op echte docenttaken: monitoren, sturen, ingrijpen, bewijzen

Dit is geen puur cosmetische opdracht. Verbeter de UX, informatiearchitectuur en interaction design van het bestaande docentendashboard, maar behoud de inhoudelijke betrouwbaarheid van voortgang, SLO, nulmeting en klasdata.

## Lees eerst

Minimaal:
- `CLAUDE.md`
- `components/TeacherDashboard.tsx`
- alle relevante bestanden in `components/teacher/`
- `components/teacher/dashboard/TeacherHeader.tsx`
- `components/teacher/dashboard/TeacherNavigation.tsx`
- `components/teacher/MissionProgressPanel.tsx`
- `components/teacher/SLOClassOverview.tsx`
- `components/teacher/CLAUDE.md`
- `AuthenticatedApp.tsx`
- `components/ProjectZeroDashboard.tsx`

## Hoofdfocus

Optimaliseer vooral:
- informatiearchitectuur
- visuele hierarchie
- navigatielogica
- docentscanbaarheid
- duidelijke hoofdacties
- rust en prioriteit in het overview-scherm
- consistentie tussen hoofdtabbladen, subtabs en detailpanelen

## Wat je concreet moet verbeteren

1. Maak van het overview-scherm een echt command center.
2. Verminder tab-fragmentatie en groepeer schermen op docenttaken.
3. Maak belangrijke signalen sneller zichtbaar.
4. Maak de relatie tussen overzicht, leerlingdetail, voortgang en reporting logischer.
5. Verduidelijk copy en labels waar termen te intern, te speels of te vaag zijn.
6. Verbeter empty states, loading states en feedback waar dat nodig is.
7. Houd de docentervaring high-trust, professioneel en licht in cognitieve belasting.

## Ontwerpprincipes

- high-trust in plaats van playful
- expliciet in plaats van impliciet
- 1 duidelijke hoofdactie per sectie
- scanbare blokken, geen visuele drukte
- docent beslist sneller wat aandacht nodig heeft
- behoud mobiel en laptop bruikbaarheid

## Randvoorwaarden

- Breek geen bestaande auth-, role-, MFA- of RLS-logica
- Verander reporting-semantiek niet stilzwijgend
- Laat SLO, nulmeting en voortgang inhoudelijk betrouwbaar blijven
- Voeg geen mockdata toe
- Gebruik bestaande services en types waar mogelijk

## Verwachte aanpak

1. Analyseer waar de huidige UX versnipperd of zwaar aanvoelt.
2. Bepaal een helderdere IA en prioriteitenstructuur.
3. Implementeer de redesign in code.
4. Controleer dat bestaande teacher-flows blijven werken.
5. Doe redelijke checks of tests.

## Acceptatiecriteria

- Het dashboard voelt rustiger en logischer.
- Een docent begrijpt sneller waar hij moet kijken en wat hij kan doen.
- Overzicht, leerlingen, voortgang en bewijs/reporting zijn beter gegroepeerd.
- De UI voelt consistenter en minder historisch gegroeid.
- Reporting en databetrouwbaarheid blijven intact.

## Werkregels

- Maak of gebruik altijd een branch met prefix `claude/`
- Werk toe naar een PR naar `main`
- Hou wijzigingen klein en logisch
- Benoem eerlijk welke tests je wel en niet hebt gedaan

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
