## Gespeeld
- Ja; begin-tot-eind: ja (intro → 4 stappen → eindscherm 100/100)
- Commit-SHA: 169e76bb906e056199ce3c5a361ae17318a10da2
- Evidence: business/dgskills-reviews/evidence/podcast-producer-2026-09-01/manifest.json
- Validator: **FAIL (4 fouten)** — `animationEvidence[0].reducedMotionChecked moet true zijn`, viewport ontbreekt: ipad-portrait/ipad-landscape/mobile. Reden: geen Playwright emulateMedia-tool beschikbaar in deze sessie en alleen desktop (1440x900) is getest, omdat de opdracht al op de veto's AFGEKEURD is.

## Handelingslijst
Afgeleid uit `actionLog[]` (8 browser-tijdstempels, strikt oplopend) plus de verder gespeelde, gescreenshotte stappen:
| Moment | Wat de leerling doet |
|---|---|
| 0 | leest intro-scherm, verzegelt verwachting |
| 1 | klikt "Start de missie" |
| 2 | typt tekst stap 1 (onderwerp) |
| 3 | vinkt checklist aan, klikt "Volgende stap" |
| 4 | typt tekst stap 2 (structuur) |
| 5 | typt bewust kort/onvolmaakt antwoord stap 3, ziet feedback, herstelt |
| 6 | beantwoordt verdiepingsvraag (MC), leest "✓ Goed!" |
| 7 | typt tekst stap 4 (interviewvragen), vinkt checklist, klikt "Resultaten bekijken" |

7 van de 8 minuten bestaan uit lezen+typen+klikken volgens hetzelfde stramien; het getypte antwoord beïnvloedt niets stroomafwaarts (score is 24/24, 24/24, 29/29, 23/23 ongeacht inhoud — alleen tekenlengte en checklist tellen mee).

## Afkeurformulier

**Veto 1 Artefact** — GEZAKT
Wat blijft er over: uitsluitend een score (100/100) en een badge "Top Producer" plus een generieke "Wat je hebt geleerd"-lijst. De vier getypte teksten zijn tijdens het spelen wel zichtbaar in het "Wat je bouwt"-paneel, maar verdwijnen op het eindscherm volledig uit beeld.
Wie kan het bekijken: niemand — er is geen doorklik, download of docentweergave naar de getypte tekst.
→ Matcht letterlijk "Afgekeurd zodra: het enige wat overblijft een score, een badge of een percentage is" (opdracht-standaard.md).

**Veto 2 Handelingen** — GEZAKT
Handelingslijst per minuut (bijgevoegd): ja
Aandeel lezen+klikken: ~90% (getypte tekst heeft geen aantoonbare invloed op score/vervolg — checklist-items zijn onafhankelijk van de inhoud van het tekstvak)
→ Valt onder de expliciete waarschuwing "antwoord typen ziet er actief uit maar is het vaak niet... als het antwoord alleen wordt opgeslagen en niets verandert, telt het als klikken."

**Veto 3 Onderscheid** — GEZAKT
Motor: `builder-canvas` (`src/features/missions/templates/builder-canvas/`)
Vergeleken met: `app-prototyper` (zelfde motor, eigen manifest gespeeld, zie business/dgskills-reviews/evidence/app-prototyper-2026-09-01/manifest.json)
Wat doet de leerling daar anders: niets structureels. Beide missies: 1 statisch intro-scherm → 4× (lezen instructie → typen tekstvak → checklist aanvinken → "Volgende stap", incl. eenzelfde ingebouwde MC-verdiepingsvraag met "Doorgaan →") → eindscherm met alleen score/badge/leerpunten. Actiepositie-voor-actiepositie identiek; alleen onderwerp en woorden verschillen.

**Veto 4 Belofte** — GEZAKT
Titel + verwachte handeling: "Maak je eigen podcast" / goal "Ik produceer een podcast van begin tot eind" → verwacht: audio opnemen/produceren.
Wat de leerling werkelijk doet: vier tekstvakken invullen (onderwerp, structuur, intro-tekst, interviewvragen). Geen seconde geluid opgenomen, geen audiobestand, geen speler.
→ Exact het voorbeeld dat opdracht-standaard.md zelf noemt voor `podcast-producer`.

Poort 1 Visueel + Beweging  NIET VASTGESTELD (niet beoordeeld — zie hieronder)
Poort 2 Instructie          NIET VASTGESTELD (niet beoordeeld — zie hieronder)
Poort 3 Doelen              NIET VASTGESTELD (niet beoordeeld — zie hieronder)

Bij ieder NIET VASTGESTELD: reden — de skill schrijft voor dat de drie poorten alleen worden beoordeeld als alle vier veto's GESLAAGD zijn ("Fase B — Uitkomstvolgorde veto's": bij minstens één GEZAKT gaat het niet door naar de poorten). Omdat hier al twee veto's zijn gezakt, is dit rapport gestopt vóór de poortbeoordeling; benodigd bewijs is niet van toepassing, dit is een regel-conforme stop, geen ontbrekend bewijs.

## UITKOMST
AFGEKEURD
