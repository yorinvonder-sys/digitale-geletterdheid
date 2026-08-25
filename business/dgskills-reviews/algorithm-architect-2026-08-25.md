# Rubric-review: Algorithm Architect

**Datum:** 2026-08-25
**templateType:** simulation-lab

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

## Design (score: 7.5/10)

De drie simulaties (meter, bar-chart, comparison) zijn elk aan een passend visualType gekoppeld en `computeVisuals` is een zuivere switch zonder eval — goed. Score-logica in `zoekalgoritme` is hardcoded per lijstgrootte/algoritme-combinatie i.p.v. een echte formule, maar dat is een aanvaardbare didactische versimpeling.

Bevindingen:
- **warning** — In `sorteeralgoritme` heeft elke sorteeralgoritme-toggle een losstaande boolean; er is geen enkele vraag of feedback die reageert op de combinatie van toggles (bv. "je hebt Bubble én Quicksort aan, vergelijk de balken"). De bar-chart nodigt uit tot vergelijken maar de vragen doen dat niet expliciet.
- **info** — De engine-bevinding over `bg-duck-acid/8`/`/20` bare slash-opacity raakt deze missie niet direct (config gebruikt eigen hex-kleuren in de bar-chart, geen duck-opacity-tokens), dus geen aparte actie hier.

## Didactiek (score: 8/10)

Sterk opgebouwd: elke simulatie heeft 3 vragen die oplopen van begripscontrole naar toepassing op de eigen simulatie-uitkomst (bv. za1-q3 vraagt letterlijk naar het aantal stappen dat de leerling net zag). `takeaways` vat de kernconcepten goed samen en `missionGoal.evidence` is concreet en toetsbaar.

Bevindingen:
- **warning** — De follow-up-vraag bij `zoekalgoritme` ("Wat zie je gebeuren...") overlapt inhoudelijk sterk met za1-q3 (allebei toetsen hetzelfde inzicht: lineair groeit mee, binair nauwelijks). Geen blokkerend probleem, maar een gemiste kans om een ander aspect te toetsen (bv. wanneer binair juist NIET gebruikt kan worden).
- **info** — Sim 3 (`pseudocode`) heeft geen `followUp`, sim 1 wel — inconsistent maar niet fout; followUp is optioneel per sim.

## Tech (score: 8/10)

Config is intern consistent: `maxScore: 100` = som van sim.maxScore (30+40+30), en per sim is de som van vraagpunten gelijk aan sim.maxScore — dus geen mismatch met de door de engine gesignaleerde totaal-vs-uitsplitsing-drift (info-bevinding in de gedeelde engine-review is hier niet van toepassing).

Bevindingen:
- **warning** — Engine-bevinding "poortlogica: één klik ontgrendelt alle vragen" (SimulationLab.tsx:188) raakt deze missie zoals elke simulation-lab-missie: bij `zoekalgoritme` volstaat het aanzetten van de `gesorteerd`-toggle om alle 3 vragen te ontgrendelen zonder de slider-parameters te hebben gebruikt. Dit is een enginedefect, geen missie-config-fix — hier alleen genoteerd voor context.
- **info** — Alle vraag-ids zijn uniek per simulatie-prefix (`za1-*`, `sa1-*`, `ps1-*`), dus het engine-risico "vraag-id-collision tussen simulaties" (SimulationLab.tsx:398) is voor deze missie niet van toepassing.

## Voorstellen

Geen mechanische config-fixes nodig binnen de whitelist — de gevonden punten zijn ofwel contentkeuzes (overlap follow-up/za1-q3) die geen blokkerend probleem vormen, ofwel liggen ze in de gedeelde engine (poortlogica) en horen daar thuis, niet in deze config.

## Samenvatting & verdict

Algorithm Architect is een degelijk uitgewerkte missie: consistente scoring, drie duidelijk onderscheiden simulaties, vragen die aansluiten op wat de leerling net heeft gezien. Geen missie-specifieke blockers gevonden; de enige echte blockers (afrondknop zonder terugweg bij <40%, geen idempotentie-guard op complete) zitten in de gedeelde simulation-lab-engine en worden daar afgehandeld, niet per missie.

**Verdict: ok**
