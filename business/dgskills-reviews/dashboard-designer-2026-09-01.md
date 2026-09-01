## Gespeeld
- Ja; begin-tot-eind: ja (intro → 3 datasets → eindscherm 95/100)
- Commit-SHA: 169e76bb906e056199ce3c5a361ae17318a10da2
- Evidence: business/dgskills-reviews/evidence/dashboard-designer-2026-09-01/manifest.json
- Validator: **FAIL (4 fouten)** — `animationEvidence` leeg (geen rAF-meting voor deze missie uitgevoerd), viewport ontbreekt: ipad-portrait/ipad-landscape/mobile.

## Handelingslijst
Afgeleid uit `actionLog[]` (8 browser-tijdstempels, strikt oplopend):
| Moment | Wat de leerling doet |
|---|---|
| 0 | leest intro-scherm, verzegelt verwachting |
| 1 | klikt "Start de missie" |
| 2 | leest/sorteert tabel, kiest antwoord 2A/2B/2C/2D bij vraag 1 |
| 3 | typt bewust fout getal (5) bij vraag 2, ziet "Niet helemaal — het juiste antwoord: 8" |
| 4 | herstelt antwoord naar 8, bevestigt (recovery) |
| 5 | typt eigen observatie (welke 2 KPI's, waarom) |
| 6 | klikt "Volgende dataset" (cirkeldiagram onvoldoendes) |
| 7 | beantwoordt MC-vraag + krijgt gedeeltelijke score (5/10) op eigen tekstantwoord met concrete verbetertip |

Dit is duidelijk actiever dan podcast-producer/app-prototyper: sorteren/filteren van een echte tabel, een numerieke berekening, en vrije tekst die daadwerkelijk wordt beoordeeld (partial credit + inhoudelijke feedback in plaats van alleen tekenlengte).

## Afkeurformulier

**Veto 1 Artefact** — GESLAAGD
Wat blijft er over: drie eigen tekstobservaties (welke KPI's, waarom een staafdiagram, dashboard-ontwerp voor 2C) plus becijferde antwoorden; de tekstobservaties krijgen inhoudelijke AI/rubric-feedback, dus zijn niet alleen "gekozen" maar eigen redenering.
Wie kan het bekijken: niet los getest in preview (geen docentweergave beschikbaar); GESLAAGD hier gebaseerd op het zichtbare, inhoudelijke karakter van het antwoord tijdens het spelen, niet op een bewezen reload/docentweergave.
Kanttekening: dit is zwakker bewijs dan Veto 1 bij datalekken-rampenplan (zie dat rapport) — geen aparte persistentietest gedaan.

**Veto 2 Handelingen** — GESLAAGD
Handelingslijst per minuut (bijgevoegd): ja
Aandeel lezen+klikken: <50% — sorteren/filteren, rekenen en een inhoudelijk beoordeelde tekstobservatie per dataset zijn actieve, niet-triviale handelingen.

**Veto 3 Onderscheid** — GEZAKT
Motor: `data-viewer` (`src/features/missions/templates/data-viewer/`)
Vergeleken met: `data-journalist` (gedeeltelijk gespeeld — dataset 1 van 3 + verdiepingsvraag; zie business/dgskills-reviews/evidence/data-journalist-2026-09-01/manifest.json, result BLOCKED omdat bewust niet afgemaakt: dit was uitsluitend een vergelijkingsinstrument).
Wat doet de leerling daar anders: structureel niets. Beide: filterbare/sorteerbare tabel → MC-vraag (radio) → numerieke vraag (spinbutton) → tekstobservatie-vraag, alle drie "Bevestigen"-gated, met identieke instructietekst ("nog minstens 8 woorden"), dezelfde puntenverdeling-vorm (15/20/10 resp. 15/15/10) en dezelfde ingebouwde verdiepingsvraag-component. Alleen het onderwerp (schooldata vs. social-media-enquête) verschilt.
→ Ondanks dat de handelingen zelf (Veto 2) actief zijn, zijn ze motorbreed identiek tussen de twee opdrachten — exact de definitie van een sjabloon in Deel 3 van opdracht-standaard.md.

**Veto 4 Belofte** — GEZAKT
Titel + verwachte handeling: "Word een Dashboard Designer" → verwacht: een dashboard ontwerpen/bouwen.
Wat de leerling werkelijk doet: bestaande tabellen en een cirkeldiagram lezen, MC/numerieke/tekstvragen beantwoorden over die bestaande data, en (stap 3) tekstueel beschrijven welke KPI's ZE ZOU kiezen voor een dashboard dat nooit wordt gebouwd of getekend. Geen enkel moment sleept, kiest of plaatst de leerling een grafiek op een canvas.
→ Exact het voorbeeld dat opdracht-standaard.md zelf noemt voor `dashboard-designer`.

Poort 1 Visueel + Beweging  NIET VASTGESTELD (niet beoordeeld)
Poort 2 Instructie          NIET VASTGESTELD (niet beoordeeld)
Poort 3 Doelen              NIET VASTGESTELD (niet beoordeeld)

Bij ieder NIET VASTGESTELD: reden — Veto 3 en Veto 4 al GEZAKT, dus volgens de uitkomstvolgorde van de skill worden de poorten niet beoordeeld (regel-conforme stop).

## UITKOMST
AFGEKEURD
