# Review: research-project (data-viewer)
Datum: 2026-08-25 · templateType: data-viewer

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

## Design — score 8/10
- Geen missie-specifieke designbevindingen. Consistente `#202023`/`#e1ff01`-badgekleuren, duidelijke titel/emoji, drie datasettypes (tabel, staafgrafiek, document-cards) geven visuele afwisseling.
- Info (gedeeld, geërfd van engine): `InteractiveTable.tsx:97` — filterveld-placeholder en ingevoerde tekst hebben dezelfde kleur (`text-duck-ink/75`), waardoor niet direct te zien is of een veld leeg of ingevuld is. Raakt deze missie via Dataset 1 (tabel met sorteerbare kolommen).

## Didactiek — score 9/10
- Sterk opgebouwd: expliciete correlatie-vs-causaliteit-uitleg (q1, q3), evidence-hiërarchie met concrete voorbeelden (q4, q5), en een goed geschreven module over onderzoeksvraag-kwaliteit (q7) en steekproefbeperkingen (q8).
- Uitleg-teksten zijn inhoudelijk correct en leerling-vriendelijk; `source.methodNote` maakt overal duidelijk dat het om gesimuleerde data gaat (voorkomt dat leerlingen de fictieve n=200-studie voor echt onderzoek aanzien).
- Kleine verbeterkans: q3 en q6 zijn `text-observation` met `minKeywords: 1` — een leerling die toevallig één keyword noemt zonder de kern te begrijpen haalt de punten. Niet blokkerend, wel een lichte scoringszwakte.
- Warning (gedeeld, geërfd van engine): `DataViewer.tsx:953` — de 40%-slaagdrempel (`totalScore/maxScore >= 0.4`) en het afgeronde percentage in `CompletionScreen` (`>= 40`) kunnen bij randgevallen uiteenlopen. Bij `maxScore: 100` in deze config is de kans op een afrondingsverschil klein maar niet uitgesloten (bijv. score 39.5 → toont 40% "Gehaald" maar `success=false` in de rapportage).

## Tech — score 6/10
- Config zelf is technisch schoon: `missionId` consistent in `templateRegistry.ts` (`data-viewer`), `slo-kerndoelen-mapping.ts` (21B/21C/23C, week 4, yearGroup 3), `curriculum.ts` (leerjaar 3, periode 4, Meesterproef) en `missionGoals.ts`. Geen missie-specifieke techbevindingen.
- Score wordt gedrukt door de gedeelde engine-defecten die deze missie erft (zie hieronder) — bij een score <40% loopt een leerling van deze missie vast op het resultatenscherm zonder terugweg.

### Overgeërfd van de gedeelde data-viewer-engine (niet opnieuw beoordeeld, wel van toepassing)
- **Blocking**: `DataViewer.tsx:984` — geen `onRetry` naar `CompletionScreen`; een leerling die onder 40% scoort (bijv. bij fouten in q2/q5/q8, samen 40 punten) krijgt een uitgeschakelde knop en geen terugweg. Missie kan dan nooit worden afgerond.
- **Blocking**: `DataViewer.tsx:950` — `clearSave()` vóór `onComplete`; bij een mislukte serveropslag verliest de leerling zijn voortgang in deze missie.
- **Warning**: `DataViewer.tsx:953` — geen eenmalig-guard op `onComplete`; kan de voltooiing van research-project meermaals melden.
- **Warning**: 40%-drempel vs. afgerond percentage lopen uiteen (zie Didactiek).
- **Info**: userId-lookup, verklap van juiste antwoord bij "Vorige dataset".

## Voorstellen
Deze missie heeft geen eigen mechanische fixes binnen de whitelist — de blocking/warning-items zitten in de gedeelde engine (`DataViewer.tsx`) en vallen buiten de scope van dit config-bestand. Geen voor/na-snippet voor `research-project.ts` nodig.

Optionele, niet-blokkerende verbetering in de config zelf (didactiek, niet auto-fixable want geen mechanische 1-op-1 wijziging maar een keuze):
- Overweeg `minKeywords: 2` voor q3 en q6 zodat een leerling niet op één toevallig keyword de punten haalt. Dit is een inhoudelijke afweging voor Yorin, geen automatische fix.

## Samenvatting en verdict
research-project is een inhoudelijk sterke missie: heldere didactische opbouw rond onderzoeksmethodologie, correcte en leerling-vriendelijke uitleg, consistente config over alle vier registries. Er zijn geen missie-specifieke design- of techdefecten. De enige blocking-issues (vastlopen onder 40%, dataverlies bij mislukte opslag) zitten in de gedeelde data-viewer-engine en gelden voor alle missies die dit template gebruiken — die moeten centraal in `DataViewer.tsx` worden opgelost, niet per missie.

**Verdict: fix-eerst** (geblokkeerd door gedeelde engine-defecten, niet door deze config).
