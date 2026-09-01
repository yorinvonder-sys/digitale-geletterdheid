# Kwaliteitspoorten

Dit bestand beschrijft de drie poorten die ná de vier veto's uit
`docs/pedagogy/opdracht-standaard.md` komen. De eigenaar mag dit bestand zelf
aanpassen; de review-skill leest en volgt de tekst hier letterlijk.

## Poort 1 — Visueel + Beweging

### Regel

De opdracht heeft een herkenbare DGSkills-vorm en beweging die betekenisvol
reageert op wat de leerling doet. Duck-tokens voeren de stijl; titels gebruiken
`font-display`, kaarten hebben `rounded-[1.6rem]` of `rounded-[1.75rem]`, en
targets zijn minimaal 44 px. Beweging gebruikt alleen opacity of transform,
werkt met reduced motion en maakt het gevolg van een handeling zichtbaar.

### Afgekeurd zodra

- `duck-*` wordt in de missie overheerst door `lab-*`, `bg-gray-*` of
  `bg-blue-*` (meer generieke/lab-klassen dan duck-klassen).
- De intro of een state change heeft op t0 en t+500 ms identieke beelden en
  `document.getAnimations().length` is 0 (of de pixelvergelijking toont geen
  verschil).
- Reduced motion verbergt of vertraagt de inhoud.
- Een controle is kleiner dan 44 px, of tekst/controls overlappen, afbreken of
  buiten beeld vallen.
- De reviewer kan niet in één zin schrijven wat beweegt als gevolg van de
  handeling van de leerling ("saai"-anker).

### Goed voorbeeld

`src/features/assessment/escaperoom/KamerCodekluis.tsx` en
`src/features/word-simulator/WordSimulator.tsx` laten beweging en gevolg zien;
de onderdelen in `src/features/missions/templates/ethics-council/sub/` zijn een
referentie voor gerichte ceremonie en overgang;
`src/features/missions/DatalekkenRampenplanMission.tsx` is een sterke inhoudelijke
referentie voor een opdracht die niet alleen generiek aanvoelt.

### Slecht voorbeeld

Een statisch kaartje met vier knoppen en een `IntroScreen` zonder overgang:
`src/features/missions/templates/shared/IntroScreen.tsx`.

### Bewijs dat de reviewer moet leveren

Een Playwright-manifest met screenshots van intro en één state change op t0 en
t+500 ms, de gemeten `document.getAnimations().length` (of pixelverschil), een
reduced-motion-screenshot, en `getBoundingClientRect`-metingen van de targets.
De reviewer schrijft ook de ene zin over wat door de leerlinghandeling beweegt.

## Poort 2 — Instructie

### Regel

De opdracht begint met een in-app presentatie van minimaal drie opeenvolgende
stappen/scènes. Elke stap is geanimeerd, volgt reduced motion en maakt duidelijk
wat de leerling gaat maken, voor wie, en hoe succes wordt herkend. De taal is
maximaal B1.

### Afgekeurd zodra

- Er alleen één statische `IntroScreen` staat.
- Er minder dan drie opeenvolgende stappen/scènes zijn, of een stap geen eigen
  beeld en overgang heeft.
- Na de intro kan de reviewer niet zonder configbestand beantwoorden: (1) wat
  maak je, (2) voor wie, (3) hoe weet je dat het goed is.
- De tekst is moeilijker dan B1 of de intro werkt niet met reduced motion.

### Goed voorbeeld

`src/features/missions/shared/MissionIntro.tsx` (paged carousel) is het minimum;
`src/features/public-site/verhaal/film/` is het doelbeeld voor een meerstaps
presentatie.

### Slecht voorbeeld

Een titel, alinea en knop op één scherm die alleen naar de opdracht leidt, zoals
de statische variant in `src/features/missions/templates/shared/IntroScreen.tsx`.

### Bewijs dat de reviewer moet leveren

Playwright-screenshots van elke stap/scène met zichtbare volgorde en overgang,
plus een korte handelingsnotitie waarin de reviewer de drie antwoorden na het
spelen aanwijst. Voeg een reduced-motion-screenshot toe.

## Poort 3 — Doelen

### Regel

Voor elk kerndoel uit `src/config/slo-kerndoelen-mapping.ts` wijst de reviewer
in het gespeelde artefact aan waar het doel zichtbaar wordt. De platformdoelen
passen bij `business/nl-vo/branding-document.md` en de AI-as-copilot-regel uit
criterium 8 van de didactiek-reviewer. P3c Project-gereedheid is observatie
alleen: het is geen poort en levert geen score op.

### Afgekeurd zodra

- Voor een kerndoel geen plek in het gespeelde artefact kan worden aangewezen.
- De platformdoelen de merkbelofte tegenspreken of AI het kernwerk laat doen.
- P3c wordt behandeld alsof het een extra veto, poort of scorecriterium is.

### Goed voorbeeld

De reviewer wijst in het opgeslagen artefact van
`src/features/missions/DatalekkenRampenplanMission.tsx` een concreet onderdeel
aan voor elk gemapt kerndoel en legt de platformfit uit met de genoemde bronnen.

### Slecht voorbeeld

Een configregel met een SLO-code zonder dat die code terug te vinden is in wat
de leerling werkelijk heeft gemaakt; of een AI die het antwoord schrijft en
alleen om akkoord vraagt.

### Bewijs dat de reviewer moet leveren

Per kerndoel een screenshot uit het gespeelde artefact met een aanwijzing of
bijschrift, plus een korte platformfit-notitie. Noteer afzonderlijk de drie
P3c-observaties (groei over lessen, tweede bijdrager, groter dan één scherm),
maar geef P3c geen poortuitkomst of score.

## Het afkeurformulier

```text
Poort 1 Visueel + Beweging  GESLAAGD / GEZAKT / NIET VASTGESTELD
  Bewijs: ............................................................
Poort 2 Instructie          GESLAAGD / GEZAKT / NIET VASTGESTELD
  Bewijs: ............................................................
Poort 3 Doelen              GESLAAGD / GEZAKT / NIET VASTGESTELD
  Bewijs: ............................................................
```
