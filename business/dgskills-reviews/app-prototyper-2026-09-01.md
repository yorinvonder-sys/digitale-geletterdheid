## Gespeeld
- Ja; begin-tot-eind: ja (intro → 4 stappen → eindscherm 100/100)
- Commit-SHA: 169e76bb906e056199ce3c5a361ae17318a10da2
- Evidence: business/dgskills-reviews/evidence/app-prototyper-2026-09-01/manifest.json
- Validator: **FAIL (6 fouten)** — `reducedMotionChecked` niet true, checkpoints `feedback`/`recovery` niet apart bewezen (voor deze missie niet los getest, wel voor podcast-producer), viewport ontbreekt: ipad-portrait/ipad-landscape/mobile.

## Handelingslijst
Afgeleid uit `actionLog[]` (8 browser-tijdstempels, strikt oplopend):
| Moment | Wat de leerling doet |
|---|---|
| 0 | leest intro-scherm, verzegelt verwachting |
| 1 | klikt "Start de missie" |
| 2 | typt tekst stap 1 (5 W's + waardepropositie) |
| 3 | vinkt checklist aan, klikt "Volgende stap" |
| 4 | typt tekst stap 2 (wireframe-beschrijvingen) |
| 5 | vinkt checklist stap 2 aan, beantwoordt verdiepingsvraag |
| 6 | typt tekst stap 3 (gebruikersflows + foutflow) |
| 7 | rondt tekst stap 3 af (>150 tekens) |

Zelfde patroon als podcast-producer: lezen → typen → aanvinken → volgende, viermaal herhaald. Getypte tekst heeft geen aantoonbare invloed op score (elke stap krijgt vol puntenaantal zodra checklist + minimale tekenlengte kloppen).

## Afkeurformulier

**Veto 1 Artefact** — GEZAKT
Wat blijft er over: score (100/100), badge "UX Maestro", generieke leerpunten-lijst. De vier tekstvakken (probleemanalyse, wireframes, flows, testplan) zijn na afloop nergens meer te bekijken.
Wie kan het bekijken: niemand.
→ "Afgekeurd zodra: het enige wat overblijft een score, een badge of een percentage is."

**Veto 2 Handelingen** — GEZAKT
Handelingslijst per minuut (bijgevoegd): ja
Aandeel lezen+klikken: ~90%; getypte tekst beïnvloedt niets stroomafwaarts.

**Veto 3 Onderscheid** — GEZAKT
Motor: `builder-canvas`
Vergeleken met: `podcast-producer` (zie business/dgskills-reviews/evidence/podcast-producer-2026-09-01/manifest.json)
Wat doet de leerling daar anders: niets structureels — identieke actievolgorde (statische intro → 4× lezen/typen/aanvinken/volgende, incl. dezelfde MC-verdiepingsvraag-component → score-eindscherm). Alleen het onderwerp (podcast vs. app) verschilt.

**Veto 4 Belofte** — GEZAKT
Titel + verwachte handeling: "Ontwerp een app van idee tot prototype" / goal noemt "een toetsbaar prototype" → verwacht: een klikbaar prototype bouwen/ontwerpen.
Wat de leerling werkelijk doet: vier tekstvakken beschrijven (probleem, wireframe-tekst, flow-tekst, testplan-tekst). Nergens een scherm getekend, gesleept of geklikt — "wireframes" en "schermen" bestaan alleen als beschreven tekst, niet als iets aanklikbaars. Exact het voorbeeld dat opdracht-standaard.md zelf noemt voor `app-prototyper`.

Poort 1 Visueel + Beweging  NIET VASTGESTELD (niet beoordeeld)
Poort 2 Instructie          NIET VASTGESTELD (niet beoordeeld)
Poort 3 Doelen              NIET VASTGESTELD (niet beoordeeld)

Bij ieder NIET VASTGESTELD: reden — twee veto's al GEZAKT, dus volgens de uitkomstvolgorde van de skill worden de poorten niet beoordeeld (regel-conforme stop, geen ontbrekend bewijs).

## UITKOMST
AFGEKEURD
