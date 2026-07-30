## Opdracht Live Check: data-voor-data

**Advies:** fix-eerst · **Risico:** Rood · **Getest als:** leerling (dev-preview zonder login) · **URL:** http://localhost:3010/dev/mission-preview?mission=data-voor-data

### Student-playthrough (per profiel)

**Modelleerling** — start: intro toont doel, bewijs-eis en 3-stappen-uitleg netjes; klopt op alle viewports. flow: 5 DEAL/NO DEAL-rondes met oplopend risico (laag → extreem), elke ronde geeft na de keuze inhoudelijk sterke, ronde-specifieke feedback. feedback: reflectief tussenscherm tussen ronde 3 en 4 ("Even pauzeren...") toont terugblik + waarschuwing. eind: "Privacy Kampioen", 85/100, keuze-overzicht + "De les"-samenvatting — maar de finale "Missie Voltooid!"-knop deed niets. ~29 acties, geen crashes.

**Speedrunner** — klikte overal de eerste optie (steeds DEAL, ook op extreem-risico-rondes), geen tekstvelden om te spammen (geen tekstinvoer in deze missie). Systeem accepteerde alle keuzes zonder te blokkeren en beloonde het niet: eindresultaat "Data Verkoper", 0/100. ~16 acties, geen crashes, "Missie Voltooid!" opnieuw dood.

**Chaoot** — dubbelklikken op start/DEAL/NO DEAL werd overal correct als één klik verwerkt (geen dubbele ronde-sprong). Reload tijdens ronde 2 en op het pauzeer-scherm bleef veilig (state persisteert, geen crash). Maar: reload ná een keuze maar vóór "Volgende ronde" (ronde 4) liet de knoppen terugkomen en de keuze opnieuw registreren — dit corrumpeerde de opgeslagen data. Bij het bereiken van "Bekijk resultaat" crashte de app volledig en **permanent** (overleeft reload én de eigen "Pagina Verversen"-knop). ~20 acties tot de crash, daarna gestopt zoals voorgeschreven.

**Vastloper** — 3x achtereen bewust dezelfde onverstandige keuze (DEAL op oplopend risico) gemaakt: geen enkele blokkade, elke ronde corrigeerde met duidelijke feedback, het pauzeer-scherm werkte als impliciete hint ("zou je dit nu anders doen?"). Na bijsturen (NO DEAL op ronde 4-5): schoon eindscherm, 60/100 "Data Diplomaat" — score schaalt gradueel mee. Geen hard vastloop-punt gevonden in het speelgedrag zelf; "Terug naar dashboard" deed niets (mogelijk dev-preview-beperking). ~22 acties, geen crash.

### Visuele UI/UX (logo's/afbeeldingen/layout/tekst-knoppen)

Layout blijft consistent en leesbaar op alle 4 viewports (desktop 1440×900, tablet-portrait 810×1080, tablet-landscape 1080×810, mobile 390×844) op alle 4 sleutelmomenten — geen tekst-overflow, geen afgesneden knoppen, geen structuurbreuk gezien in de a11y-snapshots. Emoji-iconen per ronde (🎵🎮📱💰🏫) en per badge (🛡️💸⚖️) werken als duidelijke visuele ankers. Geen screenshot wees op een visuele blocker, dus geen PNG's teruggelezen voor nadere inspectie.

### Browserbewijs (4 viewports × 4 states, Modelleerling)

| Viewport | start | flow | feedback | eind |
|---|---|---|---|---|
| Desktop 1440×900 | ✅ | ✅ | ✅ | ✅ |
| Tablet-portrait 810×1080 | ✅ | ✅ | ✅ | ✅ |
| Tablet-landscape 1080×810 | ✅ | ✅ | ✅ | ✅ |
| Mobile 390×844 | ✅ | ✅ | ✅ | ✅ |

Extra bewijs: crash-eind.png (Chaoot, desktop) en eind.png (Vastloper, desktop).

### Bevindingen (BLOCK/WARN/INFO)

1. **BLOCK** — Reload tijdens de feedback-fase van een ronde (ná klikken, vóór "Volgende ronde") corrumpeert de opgeslagen keuzes. Bij afronding crasht de app **permanent** met `TypeError: Cannot read properties of undefined (reading 'privacyRisk')` in `DataVoorDataMission.tsx:194` (`getScore`). Noch "Pagina Verversen" noch een harde reload herstelt dit — de leerling zit vast tot browserdata handmatig gewist wordt. Bewijs: `evidence/data-voor-data/chaoot/desktop/crash-eind.png`.
2. **BLOCK** — Knop "Missie Voltooid!" op het eindscherm doet niets bij klik (geen navigatie, geen statusverandering, geen console-fout). Consistent over meerdere profielen/klikken heen. Bewijs: `evidence/data-voor-data/modelleerling/desktop/eind.png`.
3. **WARN** — Elke ronde toont "kon nog niet anoniem worden opgeslagen" en het vergelijkingspercentage blijft altijd "nog te weinig anonieme antwoorden" — de anonieme-aggregatie-feature lijkt niet te werken, over alle 4 profielen heen. Bewijs: `evidence/data-voor-data/modelleerling/desktop/feedback.png`.
4. **INFO** — Accessible name "DEAL!" matcht zonder exact-vlag ook op "NO DEAL!" (substring); testtool moest `nth:0` gebruiken. Puur harnas-observatie, geen leerling-impact.
5. **INFO** — Scoresysteem is robuust tegen zinloos klikgedrag: 5x klakkeloos DEAL geeft "Data Verkoper", 0/100 — geen gratis punten.
6. **INFO** — "Terug naar dashboard" reageert niet in de dev-preview (geen navigatie/fout); mogelijk verwacht dev-preview-gedrag zonder login, maar opvallend voor een leerling die een uitweg zoekt.
7. **INFO** — Geen hard vastloop-punt in het speelgedrag zelf: 3x dezelfde foute keuze blokkeert nooit, feedback + reflectiescherm corrigeren consequent, score schaalt gradueel (60/100 bij gemengd gedrag).

### Nog onzeker

- Of de "kon nog niet anoniem worden opgeslagen"-melding een lokale dev-omgeving-beperking is (ontbrekende backend-koppeling in preview) of ook op productie zo gedraagt — niet te bevestigen zonder broncode/backend-inzicht (buiten scope van deze test).
- Of "Terug naar dashboard" in de echte (ingelogde) omgeving wél normaal navigeert — dev-preview mist mogelijk een routing-doel.
- Exacte reproductiestappen voor de reload-crash zijn hier vastgesteld op ronde 4, maar niet uitgetest of dit ook optreedt bij reload-tijdens-feedback op andere rondes (1-3, 5) — aannemelijk dat het generiek is aan de `getScore`-berekening, maar niet apart bevestigd per ronde.
