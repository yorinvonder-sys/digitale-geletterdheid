# Review: algorithm-architect (2026-08-07)

Bestand: `src/features/missions/templates/simulation-lab/configs/algorithm-architect.ts`
Kerndoel: 22B (SLO), 19A (VSO), leerjaar 2 periode 2 week 2 — curriculumplaatsing klopt (`curriculum.ts:187`, `slo-kerndoelen-mapping.ts:113`).

Enginebevindingen (SimulationLab.tsx) worden hier niet herhaald, alleen toegepast op deze config.

## Design

**Blocking**
- `ps1-q3` (regel 383-397): de gemarkeerde `correctAnswer` ("Begin met het getal 0 als tijdelijke grootste") is inhoudelijk in tegenspraak met de eigen `explanation`, die letterlijk zegt "Stel tijdelijke grootste in op het eerste element." Dat is een weggevertje dat het verkeerde antwoord bevestigt aan de leerling. Zie ook Didactiek voor de feitelijke kant.

**Warning**
- `za1-q3` (regel 254-269): vraagt "hoeveel stappen zag je in de meter staan" bij exact de parameterstand (binair, gesorteerd, lijstgrootte=2) waarvoor `computeVisuals` (regel 40-42) letterlijk "~10 stappen (binair zoeken)" toont. Het juiste antwoord is dus rechtstreeks van het scherm af te lezen zonder de vraag te begrijpen — test aflezen, niet redeneren.
- Correct antwoord staat in 6 van de 10 vragen op optiepositie B (index 1): `za1-q1`, `za1-q2`, `sa1-q1`, `sa1-q2`, `sa1-q3`, `ps1-q2`. Omdat opties nooit geschud worden (enginebevinding), is dit een gokbaar patroon (60% kans door altijd B te kiezen).

## Didactiek

**Blocking**
- `ps1-q3` (regel 383-397): feitelijk onjuist/inconsistent. Initialiseren van "tijdelijke grootste" op 0 werkt niet als alle getallen in de lijst negatief zijn (het antwoord blijft dan foutief op 0 staan). De juiste en gangbare aanpak — die de eigen explanation ook citeert — is starten met het eerste element van de lijst. De leerling wordt hier een onjuist concept aangeleerd en tegelijk tegengesproken binnen dezelfde vraag.

**Warning**
- Sim 1 (zoekalgoritme) bouwt van concept (q1) naar toepassingsvoorwaarde (q2) naar pure aflezing (q3, zie Design) — de moeilijkheidsopbouw zakt terug bij de laatste vraag in plaats van door te bouwen naar synthese/toepassing.
- `followUp` van sim 1 (regel 189-195) test wél synthese (groei van stappen bij grotere lijst) en overlapt inhoudelijk met `za1-q3` — twee vragen in dezelfde simulatie testen bijna hetzelfde feit op een net iets ander niveau; `za1-q3` voegt weinig toe.

**OK**
- Leerdoeldekking van 22B (algoritmisch denken/computational thinking) is aanwezig in alle drie de simulaties; taalniveau past bij 13-14 jaar; uitleg-teksten (behalve ps1-q3) zijn feitelijk correct en aansluitend bij de vraag.

## Techniek

**OK**
- Alle vragen in `questions[]` hebben een niet-lege `options`-array; geen enkele `correctAnswer` is een numerieke index (allemaal exacte optie-tekst, consistent met de `===`-tekstvergelijking in de engine).
- `followUp.correctIndex` is een apart, elders in de codebase (zie `privacy-by-design.ts:185`) gebruikt schema voor `FollowUpQuestion` — geen bug, wel een ander vergelijkingsmechanisme dan `questions[].correctAnswer`.
- Geen duplicate optieteksten binnen een vraag gevonden.
- `maxScore`-som per simulatie (30+40+30=100) klopt met top-level `maxScore: 100`; sim 1's `followUp.bonusPoints` (5) kan de score alleen compenseren tot het sim-plafond van 30 (clamp in engine) — geen overflow-bug, wel een bonus die feitelijk nooit boven het plafond kan uitkomen.

## Samenvatting

Verdict: **fix-eerst**. Eén blocking content-fout (`ps1-q3`, tegenstrijdig en algoritmisch onjuist startpunt) moet gerepareerd worden vóór livegang. Daarnaast twee warnings: een aflees-vraag die niets toetst (`za1-q3`) en een gokbaar antwoordpositie-patroon (60% optie B). Leerdoeldekking, curriculumplaatsing en scoring-mechanica zijn verder in orde.
