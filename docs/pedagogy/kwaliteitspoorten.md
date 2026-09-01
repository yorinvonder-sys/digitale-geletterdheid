# Kwaliteitspoorten

Dit bestand beschrijft de drie poorten die ná de vier veto's uit
`docs/pedagogy/opdracht-standaard.md` komen. De eigenaar mag dit bestand zelf
aanpassen; de review-skill leest en volgt deze tekst letterlijk. Een reviewer
beoordeelt altijd eerst alle vier veto's. Alleen als die vier alle `GESLAAGD`
zijn, beoordeelt de reviewer alle drie poorten. Daarna wordt per fase de
volgorde toegepast: één `GEZAKT` maakt de uitkomst afgekeurd; zonder een gezakt
onderdeel maakt één `NIET VASTGESTELD` de uitkomst niet vastgesteld; alleen als
alles is vastgesteld en geslaagd gaat de review door naar de rubric.
De enige harde stop vóór dit formulier is: niet gespeeld of geen valide
manifest.

## Bewijscontract voor de vier veto's

Deze vier controles komen uit Deel 1 en het afkeurformulier van
`docs/pedagogy/opdracht-standaard.md`. Ze worden alle vier uitgevoerd voordat
de uitkomstvolgorde wordt toegepast. Een oordeel dat alleen op config, een
opslaanknop of een ingevuld veld steunt, is geen speelbewijs.

- **Veto 1 — Artefact:** in de preview is opslaan niet altijd mogelijk. Bewijs
  is: maken → volledige reload → het artefact terugvinden, en/of een
  docent-/klasgenootweergave die het artefact toont. Lukt dat niet in de
  preview, dan is het oordeel `NIET VASTGESTELD`, met als reden en benodigd
  bewijs exact: `geautoriseerde synthetische niet-productierun met testaccount`.
  Een opslaanknop of configveld is nooit voldoende voor `GESLAAGD`.
- **Veto 2 — Handelingen:** de handelingslijst komt uit een door de browser
  gegenereerd tijdlog. Bij iedere klik- of typactie schrijft Playwright via
  `browser_evaluate` een regel met `Date.now()` uit de pagina, een omschrijving
  en een screenshotnummer. Dat staat in `manifest.actionLog[]` met strikt
  oplopende tijdstippen. Een handelingslijst zonder `actionLog[]` is
  `NIET VASTGESTELD`.
- **Veto 3 — Onderscheid:** speel twee volledige manifests: de eigen opdracht
  en een tweede opdracht op dezelfde motor. Beide hebben een eigen
  `actionLog[]`; het rapport vergelijkt iedere actiepositie. Het veld
  `manifest.comparedWith` is de `missionId` van die tweede opdracht. Zonder
  twee volledige speelbewijzen, twee logs en positie-voor-positie-vergelijking
  is het veto `NIET VASTGESTELD`.
- **Veto 4 — Belofte:** vóór de eerste interactie verzegelt de speler in het
  manifest `expectation` met titel, openingszin en de letterlijke vorm
  `ik verwacht dat ik ga [werkwoord]`, plus tijdstip. Achteraf invullen is
  `NIET VASTGESTELD`; een later geformuleerde verwachting mag niet alsnog als
  voorafgaande belofte gelden.

Bij elk `NIET VASTGESTELD` schrijft het rapport zowel de reden als het
benodigde bewijs op. Gebruik daarna deze letterlijke uitkomsttekst uit het
afkeurformulier:

```text
UITKOMST:  DOOR NAAR RUBRIC  /  AFGEKEURD  /  NIET VASTGESTELD — NIET NAAR LEERLINGEN
```

## Poort 1 — Visueel + Beweging

### Regel

De opdracht heeft een herkenbare DGSkills-vorm en beweging die betekenisvol
reageert op wat de leerling doet. Duck-tokens voeren de stijl; titels gebruiken
`font-display`, kaarten hebben `rounded-[1.6rem]` of `rounded-[1.75rem]`, en
targets zijn minimaal 44 px. Statische controles blijven bestaan, maar worden
alleen op werkelijk getoonde elementen gecontroleerd met berekende DOM-stijlen:
tokens, `font-display`, afronding en uitsluitend `opacity`/`transform`.

Beweging is actiegebonden: kies één zichtbare leerlingactie, meet het
afgebakende element direct vóór die actie en op minstens drie opeenvolgende
animation frames erna. Gebruik via `browser_evaluate` en
`requestAnimationFrame` `getComputedStyle` voor `transform` en `opacity` van
het werkelijk getoonde element en leg keyframes/eigenschappen vast.
Zwevende of andere ambient animaties tellen niet. Identieke frames zijn
`NIET VASTGESTELD`, niet `GEZAKT`. `GEZAKT` mag alleen wanneer na de actie
aantoonbaar geen enkel element beweegt én reduced motion niet actief is.
Test reduced motion met een verse reload: `emulateMedia` via
`browser_evaluate`/Playwright én de opgeslagen toegankelijkheidsinstelling van
de app (`AccessibilityContext`).

### Afgekeurd zodra

- `duck-*` wordt in de werkelijk getoonde missie overheerst door `lab-*`,
  `bg-gray-*` of `bg-blue-*`, vastgesteld op berekende DOM-stijlen.
- De actiegebonden frames aantonen dat na een zichtbare leerlingactie geen
  element beweegt terwijl reduced motion niet actief is.
- Reduced motion verbergt of vertraagt de inhoud.
- Een werkelijk getoonde controle kleiner is dan 44 px, of tekst/controls
  overlappen, afbreken of buiten beeld vallen.
- De reviewer niet in één zin kan schrijven wat als gevolg van de
  leerlinghandeling beweegt.

### Goed voorbeeld

`src/features/assessment/escaperoom/KamerCodekluis.tsx`,
`src/features/word-simulator/WordSimulator.tsx` en de onderdelen in
`src/features/missions/templates/ethics-council/sub/` laten betekenisvolle,
actiegebonden beweging zien; `src/features/missions/DatalekkenRampenplanMission.tsx`
is een inhoudelijke referentie.

### Slecht voorbeeld

Een statisch kaartje met vier knoppen en een `IntroScreen` zonder overgang:
`src/features/missions/templates/shared/IntroScreen.tsx`; losse zwevende
decoratie zonder relatie met de leerlingactie telt evenmin.

### Bewijs dat de reviewer moet leveren

Het rapport bevat één actiegebonden `animationEvidence`-item met element,
actie, meting vóór de actie, minstens drie opeenvolgende frames erna. Elk frame
bevat het browser-tijdstip en de berekende `transform`- en `opacity`-waarden;
frametijden lopen strikt op. Leg daarnaast keyframes/eigenschappen en
`reducedMotionChecked`. Voeg screenshots toe waarop de actie en het werkelijk
getoonde gevolg staan. Voeg een verse reduced-motion-run toe met de
`AccessibilityContext`-instelling. Een identieke frame-reeks is
`NIET VASTGESTELD` met reden en benodigd bewijs; alleen aantoonbaar stilvallen
zonder reduced motion is `GEZAKT`.

**Geannoteerde gevallen**

- Positief — `src/features/word-simulator/WordSimulator.tsx`: `GESLAAGD`, omdat
  een leerlingactie een gemeten element zichtbaar laat transformeren in drie
  opeenvolgende frames.
- Negatief — `src/features/missions/templates/shared/IntroScreen.tsx`:
  `GEZAKT`, omdat geen enkel element als gevolg van de actie beweegt terwijl
  reduced motion uit staat.
- Grensgeval — `src/features/missions/DatalekkenRampenplanMission.tsx`:
  `NIET VASTGESTELD`, omdat een statische run zonder actiegebonden frames niet
  kan aantonen of de beweging ontbreekt of alleen niet is gemeten.

## Poort 2 — Instructie

### Regel

De speler bedient browser-only, zonder configbestand te openen, de intro-stappen
achtereen. Er zijn minimaal drie opeenvolgende in-app stappen/scènes; elke stap
heeft een zichtbare overgang en volgt reduced motion. Daarna formuleert de
speler uitsluitend uit zichtbare schermtekst drie zinnen: wat maak je, voor wie,
hoe weet je dat het goed is. Die drie zinnen én de uitgelezen `innerText` van
alle intro-stappen komen in het rapport. De B1-toets gaat alleen over die
uitgelezen tekst. Een oordeel dat op config leunt is `NIET VASTGESTELD`.

### Afgekeurd zodra

- Er alleen één statische `IntroScreen` staat, of minder dan drie opeenvolgende
  stappen/scènes zichtbaar zijn.
- Een stap geen eigen beeld, overgang of reduced-motion-gedrag heeft.
- Eén van de drie zinnen ontbreekt of niet uit de zichtbare tekst kan worden
  onderbouwd.
- De zichtbare intro-tekst boven B1-niveau ligt.

### Goed voorbeeld

`src/features/missions/shared/MissionIntro.tsx` is het minimum voor een
meer-staps presentatie; `src/features/public-site/verhaal/film/` is een
referentie voor een rijkere presentatie.

### Slecht voorbeeld

Een titel, alinea en knop op één scherm, zoals de statische variant in
`src/features/missions/templates/shared/IntroScreen.tsx`, waarbij de reviewer
de config moet openen om doel of doelgroep te raden.

### Bewijs dat de reviewer moet leveren

Leg per intro-stap een screenshot, volgorde en overgang vast; voeg de volledige
browser-`innerText` toe, plus de drie zinnen van de speler en de B1-beoordeling.
De manifestwaarde `introText` bevat minstens één niet-lege regel per stap en
minstens drie regels. Configbestanden, componentnamen en statische bronclaims
zijn geen vervanging voor dit bewijs.

**Geannoteerde gevallen**

- Positief — `src/features/missions/shared/MissionIntro.tsx`: `GESLAAGD`, omdat
  de speler drie zichtbare stappen doorloopt en alle drie antwoorden uit
  `innerText` kan citeren.
- Negatief — `src/features/missions/templates/shared/IntroScreen.tsx`:
  `GEZAKT`, omdat één statisch scherm geen drie opeenvolgende intro-stappen
  geeft.
- Grensgeval — `src/features/public-site/verhaal/film/`: `NIET VASTGESTELD`,
  omdat een mooie meerstaps-presentatie zonder vastgelegde leerling-`innerText`
  de begrijpelijkheid niet bewijst.

## Poort 3 — Doelen

### Regel

Voor elk toegekend kerndoel uit `src/config/slo-kerndoelen-mapping.ts` én voor
elk platformdoel legt de reviewer een koppeling vast aan één gespeelde
handeling uit `actionLog[]` en aan de plek in het leerlinggemaakte artefact
(screenshotnummer). Eén toegekend kerndoel zonder die twee bewijsankers is
`GEZAKT`. Platformdoelen passen bij `business/nl-vo/branding-document.md` en
de AI-as-copilot-regel uit criterium 8 van de didactiek-reviewer. P3c
Project-gereedheid blijft observatie en krijgt géén `GESLAAGD`/`GEZAKT`.

### Afgekeurd zodra

- Eén toegekend kerndoel of platformdoel geen gespeelde actie én
  artefact-screenshot heeft.
- Een doel alleen in config staat en niet zichtbaar wordt in het gespeelde
  artefact.
- De platformbelofte wordt tegengesproken of AI doet het kernwerk.
- P3c wordt behandeld alsof het een extra veto, poort of scorecriterium is.

### Goed voorbeeld

De reviewer koppelt per doel een actie uit `actionLog[]` aan een gemarkeerd
onderdeel in het leerlingartefact van
`src/features/missions/DatalekkenRampenplanMission.tsx` en noteert P3c alleen
als observatie.

### Slecht voorbeeld

Een configregel met een SLO-code zonder screenshot van het leerlingartefact of
zonder actie uit `actionLog[]`; ook een AI die het antwoord schrijft en alleen
om akkoord vraagt voldoet niet.

### Bewijs dat de reviewer moet leveren

Maak een tabel in het rapport met per kerndoel en platformdoel: doel, één
`actionLog`-regel, screenshotnummer van de artefactplek en korte uitleg. Voeg de
drie P3c-observaties afzonderlijk toe (groei over lessen, tweede bijdrager,
groter dan één scherm), zonder poortstatus of score voor P3c.

**Geannoteerde gevallen**

- Positief — `src/features/missions/DatalekkenRampenplanMission.tsx`:
  `GESLAAGD`, omdat ieder toegekend doel aan een gespeelde actie en een
  artefact-screenshot is gekoppeld.
- Negatief — `src/config/slo-kerndoelen-mapping.ts`: `GEZAKT`, omdat een code in
  de mapping zonder artefactplek en actie geen doelbewijs is.
- Grensgeval — `src/features/missions/templates/builder-canvas/configs/podcast-producer.ts`:
  `NIET VASTGESTELD`, omdat de config wel een doel kan noemen maar de vereiste
  gespeelde actie- en screenshotkoppeling ontbreekt.

## Uitkomstvolgorde

Beoordeel eerst alle vier veto's. Pas daarna geldt: minstens één `GEZAKT` →
`AFGEKEURD`; anders minstens één `NIET VASTGESTELD` →
`NIET VASTGESTELD — NIET NAAR LEERLINGEN`; anders door naar de drie poorten.
Beoordeel vervolgens alle drie poorten. Pas daarna geldt opnieuw: minstens één
`GEZAKT` → `AFGEKEURD`; anders minstens één `NIET VASTGESTELD` →
`NIET VASTGESTELD — NIET NAAR LEERLINGEN`; anders `DOOR NAAR RUBRIC`.
De beoordeling wordt niet tussentijds afgebroken: alle vier respectievelijk
alle drie worden vastgelegd. Bij ieder `NIET VASTGESTELD` staan reden en
benodigd bewijs.

## Het afkeurformulier

```text
Poort 1 Visueel + Beweging  GESLAAGD / GEZAKT / NIET VASTGESTELD
  Bewijs: ............................................................
Poort 2 Instructie          GESLAAGD / GEZAKT / NIET VASTGESTELD
  Bewijs: ............................................................
Poort 3 Doelen              GESLAAGD / GEZAKT / NIET VASTGESTELD
  Bewijs: ............................................................
```

## Regressieset

| missionId | Verwachte uitkomst | Verwachte veto/poort | Exacte afkeurreden |
|---|---|---|---|
| `podcast-producer` | `AFGEKEURD` | Veto 1 + Veto 4 | Er blijft geen aantoonbaar artefact over en de titel belooft maken/opnemen terwijl de speler alleen tekst beschrijft. |
| `app-prototyper` | `AFGEKEURD` | Veto 1 + Veto 4 | Er blijft geen klikbaar prototype over en de titel belooft bouwen terwijl de speler alleen tekst beschrijft. |
| `dashboard-designer` | `AFGEKEURD` | Veto 4 | De speler leest een bestaand dashboard; de titel belooft ontwerpen maar bevat geen ontwerpactie. |
| `datalekken-rampenplan` | `AFGEKEURD` | veto's `GESLAAGD`, Poort 2 `GEZAKT` | De veto's zijn speelbaar en geslaagd, maar de intro is statisch en bevat niet de vereiste geanimeerde, opeenvolgende presentatie. |

Deze missionId's zijn op deze branch gecontroleerd in de bestaande config- en
reviewbestanden. Wijkt een review af van deze tabel zonder dat de tabel is
aangepast, dan is de REVIEW verdacht, niet de tabel.

## Beslislog

| Datum | Wat de eigenaar besliste | Gevolg voor welke poort |
|---|---|---|
| 2026-09-01 | Instructie = geanimeerde intro in de app, geen video; review speelt altijd eerst. | Poort 2 vereist zichtbare, opeenvolgende in-app stappen; video is geen vervanging. |
