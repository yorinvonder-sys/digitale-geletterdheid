# Review: Automation Engineer (2026-08-07)

Config: `src/features/missions/templates/builder-canvas/configs/automation-engineer.ts`
Curriculum: leerjaar 2, periode 2 (`src/config/curriculum.ts:192`), SLO `22B, 21A` (`src/config/slo-kerndoelen-mapping.ts:117`)

## Stapanalyse (100 punten / 4 stappen = 25 punten per stap)

| # | Stap | textPrompt | requiredLength | Punten |
|---|------|-----------|-----------------|--------|
| 1 | taak-analyse | ja (`automation-engineer.ts:43`) | default 40 (niet overschreven) | 25 |
| 2 | algoritme | ja (`automation-engineer.ts:59`) | default 40 | 25 |
| 3 | script-structuur | ja (`automation-engineer.ts:75`) | default 40 | 25 |
| 4 | testplan | ja (`automation-engineer.ts:91`) | default 40 | 25 |

Alle vier stappen hebben een `textPrompt`, dus geen enkele stap valt onder de "100% zelfrapportage zonder textPrompt"-categorie uit de enginebevindingen. **Puur op zelf-afvinken (checklist zonder tekstvereiste) rustende punten: 0/100 (0%).**

Wél een aanverwant probleem: geen van de vier stappen zet `minTextLength` hoger dan de default (`BuilderCanvas.tsx:98`), dus elke stap accepteert al vanaf 40 tekens — ongeacht inhoud. Gecombineerd met de checklist (self-report, geen contentcheck) betekent dit dat de volledige 100 punten behaald kunnen worden met 4× circa 40 lukrake tekens plus het handmatig aanvinken van 16 checklistvinkjes, zonder dat er ooit een werkend algoritme, script of testplan wordt geleverd. Dit is geen "zonder textPrompt"-gat, maar wel een contentloze verificatie — bestandanker: `automation-engineer.ts:43,59,75,91` + `BuilderCanvas.tsx:97-99`.

## Inhoudelijke juistheid

Geen feitelijke fouten gevonden. De uitleg over automatiseringscriteria (`automation-engineer.ts:33`), pseudocode/IF-THEN/FOR-lussen (`:49`), Python-scriptstructuur met functies/main/commentaar (`:65-68`) en dry-run-testen (`:81-84`) is voor het niveau correct en didactisch verantwoord (bijv. "een fout in een script dat 1000 bestanden hernoemt is catastrofaal" als motivatie voor testen).

## Dekt kerndoel 22B (programmeren)?

**Gedeeltelijk.** De opdracht behandelt de denkstappen van programmeren (taakanalyse → algoritme → scriptstructuur → testen) maar de leerling schrijft nergens werkende code. Stap 3 vraagt expliciet "Je hoeft de functies niet volledig te implementeren" (`automation-engineer.ts:67`) en de tip herhaalt "Je hoeft de functies niet volledig te bouwen — beschrijf in commentaar wat ze zouden doen" (`:68`). Er wordt dus nooit code uitgevoerd, getest of gevalideerd — alleen beschreven. Voor 22B (programmeren) is dit een oppervlakkige dekking; het leunt zwaarder op 21A (digitale basisvaardigheden/computational thinking) dan op daadwerkelijk programmeren.

## Bewijsbaarheid

Zwak. De leerling levert uitsluitend vrije tekst (taakanalyse, pseudocode, scriptbeschrijving, testplan) — geen enkel artefact is objectief controleerbaar op correctheid. De checklist-items ("Mijn pseudocode heeft minimaal 8 stappen", "Er zijn minimaal 2 functiedefinities") worden door de leerling zelf aangevinkt, niet door het systeem geverifieerd tegen de daadwerkelijk getypte tekst. Gecombineerd met de karakter-lengte-only gate (zie hierboven) is er geen mechanisme dat aantoont dat de leerling een correct werkend automatiseringsontwerp heeft gemaakt versus 160 tekens vage proza.

## Taalniveau, opbouw, haalbaarheid

Taalniveau past bij 13-14 jaar; instructies zijn concreet met genummerde subvragen. Opbouw is logisch (analyse → ontwerp → structuur → test) en volgt een herkenbaar software-engineeringproces. Haalbaarheid binnen de tijd is redelijk gezien de lage bewijslast (geen werkende code vereist), al is dat tegelijk de zwakte hierboven.

## Verdict

`fix-eerst` — niet vanwege deze config zelf (geen kritieke fouten), maar omdat de reeds vaststaande enginebevindingen (crash bij hersteld voortgang, systeeminstructie die 3 in plaats van 4 stappen noemt, geen terug-navigatie) motorbreed moeten worden opgelost, en omdat deze missie in de praktijk 100% van de punten uitkeert zonder ooit een correct algoritme/script/testplan te verifiëren.
