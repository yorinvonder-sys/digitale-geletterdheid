# Review: bug-hunter — 2026-08-07

## Design (6/10)
- Sim1 (meter), Sim2 (bar-chart), Sim3 (comparison) matchen goed bij hun leerdoel qua visualtype.
- **Blocking**: bij alle 9 vragen staat het juiste antwoord op exact dezelfde positie (index 1, de tweede optie) — `bug-hunter.ts:219,235,250,282,298,314,349,365,381`. Opties worden niet geschud (bekende motor-tekortkoming), dus een leerling die simpelweg altijd "optie 2" kiest scoort de volle punten zonder de vraag te lezen. Dit ondermijnt de score als meting volledig.
- Sim1's `fouttype`-slider (0/1/2) koppelt een score (25/30/20) aan een categorie-keuze zonder duidelijke leerrelatie — voelt willekeurig naast de bestaande motor-issue "vrijblijvend instellen".

## Didactiek (5/10)
- Kerndoel 22B (Programmeren) is in de SLO-mapping en curriculum correct en consistent gekoppeld (`slo-kerndoelen-mapping.ts:116`, `curriculum.ts:191`).
- Feitelijke uitleg klopt: syntax vs runtime error (`bug-hunter.ts:231-237`), off-by-one (`bug-hunter.ts:298-300`), vier debug-stappen reproduceren→lokaliseren→diagnosticeren→fixen (`bug-hunter.ts:365-367`) zijn technisch correct.
- **Majeure zorg**: de missie heet "Bug Hunter" en het kerndoel is programmeren/foutopsporing, maar de leerling ziet nergens een échte stuk code met een bug erin om op te sporen. Alle 9 vragen zijn kennisvragen over debug-concepten (`bug-hunter.ts:207-386`); er is geen moment waarop de leerling zelf een fout in code moet aanwijzen of fixen. Dit is "erover lezen", niet "het doen" — een gemiste kans voor kerndoel 22B.
- Taalniveau past bij 13-14 jaar; uitleg is kort en concreet.

## Techniek (6/10)
- `correctAnswer` wordt overal als de volledige optietekst opgeslagen (niet als getal/index), consistent met de `===`-tekstvergelijking in de motor — geen "stil altijd fout"-bug.
- Geen dubbele optieteksten binnen een vraag aangetroffen.
- Elke vraag heeft `options` — geen leerling raakt vast zonder keuzes.
- Kleuren in Sim2 (`#ff3c21` / `#e3e2dc`, `bug-hunter.ts:49-70`) zijn eigen aan deze config en ogen contrastveilig op een lichte achtergrond; geen aanvullend contrastprobleem gevonden.
- De vaste-positie-bug (zie Design) is het enige technische defect, maar is wel repo-breed: elke vraag in dit bestand is erdoor geraakt.

## Samenvatting
Feitelijk correcte en taalkundig passende quizinhoud, maar met een systematische exploit (altijd optie 2 is goed) die de scoring waardeloos maakt, plus een fundamentele didactische mismatch: een "Bug Hunter"-missie zonder ooit een echte bug in code te tonen. De positie-bug is snel te fixen (opties husselen of variëren); het ontbreken van een echte debug-oefening is een groter, structureel gat.
