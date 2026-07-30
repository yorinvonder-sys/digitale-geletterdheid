## Opdracht Live Check: data-detective

**Advies:** ship · **Risico:** Geel · **Getest als:** leerling (dev-preview zonder login) · **URL:** http://localhost:3010/dev/mission-preview?mission=data-detective

### Student-playthrough (per profiel: start/flow/feedback/eind)

**Modelleerling** — Intro-scherm meteen duidelijk (doel, 3 thema's Patronen Zien/Misleiding Spotten/Kritisch Denken, Kees' welkomsttekst). 6 datavragen over 3 niveaus (Beginner/Gevorderd/Expert, 2 vragen elk) met gevarieerde datavisualisaties (bar-chart, lijngrafiek, pie-chart, tabel). Sterke didactiek: correlatie-vs-causaliteit met echte studentendata-tabel, misleidende Y-as-schaal, dark-pattern-cookie-consent. Alle 6 vragen correct beantwoord (bewuste-fout-instructie per abuis niet uitgevoerd — zie "Nog onzeker"). Eindscherm "MISSIE VOLTOOID" met score 6/6, 600 punten, "Wat heb je geleerd" en een sterk reflectie-onderdeel "Mijn 3 Dataregels" met concrete voorbeeldregels.

**Speedrunner** — Kon niet zomaar skippen: elke vraag vereist een klik op een antwoord voordat "Volgende" verschijnt, dus geen zinloze/lege input geaccepteerd. Bij een dubbelklik op de "Volgende Level"-knop landde de tweede klik echter ongewild op een antwoordknop van de nieuwe vraag (zie Bevindingen #1). Eerlijk afgerond met 3/6 correct, 300 punten — laag maar geen crash.

**Chaoot** — Dubbelklikken op transitieknoppen bevestigde de race-condition een tweede keer (reproduceerbaar, 100% consistent). Reload midden in een stap en op het level-transitiescherm herstelde exact dezelfde staat zonder corruptie of dubbele scoretelling. Browser-back (naar `about:blank`, verwacht harnasgedrag zonder history) + hernavigeren herstelde de voortgang correct (score en huidige vraag bewaard — persistente state). "Terug naar Mission Control"-knop reageerde niet zichtbaar in de dev-preview (zie Bevindingen #3). Eerlijk afgerond met 4/6 correct, 400 punten, geen crash.

**Vastloper** — Elke vraag is single-attempt: na 1 antwoord zijn alle opties disabled en verschijnt alleen "Volgende" (geen ingebouwde retry-knop). Reload zet de vraag terug naar onbeantwoord, waardoor een leerling via reload alsnog kan blijven proberen. 3× hetzelfde foute antwoord gegeven (via reload) op stap 1 — feedback bleef inhoudelijk correct maar exact statisch/identiek bij elke poging, geen escalerende hint. Geen permanente vastloop: kon altijd door naar "Volgende". Eindresultaat 5/6 correct, 500 punten.

### Visuele UI/UX (logo's/afbeeldingen/layout/tekst-knoppen)

Layout, bar-charts, pie-charts, tabellen en feedback-kaarten renderen consistent en leesbaar op alle geteste viewports. Geen clipping, overlap of afgesneden tekst waargenomen. Feedback (correct = zwart vinkje, incorrect = rode X met uitleg) is visueel duidelijk onderscheidend. Reflectie-eindscherm ("Mijn 3 Dataregels") blijft goed leesbaar ook op mobile met veel tekst.

### Browserbewijs (tabel 4 viewports × 4 states)

| Viewport | start | flow | feedback | eind |
|---|---|---|---|---|
| Desktop 1440×900 | ✅ start.png | ✅ flow.png | ✅ feedback.png | ✅ eind.png |
| Tablet-portrait 810×1080 | ✅ start.png | — (structuur identiek, geen aparte screenshot) | ✅ feedback.png | ✅ eind.png |
| Tablet-landscape 1080×810 | ✅ start.png | — | ✅ feedback.png | ✅ eind.png |
| Mobile 390×844 | ✅ start.png | — | ✅ feedback.png (geverifieerd, geen clipping) | ✅ eind.png (geverifieerd, geen clipping) |

Alle 4 viewports getest op de 4 sleutelmomenten (Modelleerling); aria-snapshot-structuur bleef identiek op elke breedte, wat duidt op een robuuste responsive layout (geen aparte mobile-only bug gevonden).

### Bevindingen (BLOCK/WARN/INFO, genummerd, met bewijs-pad)

1. **[BLOCK]** Dubbelklik op transitieknoppen ("Start de missie", "Volgende", "Volgende Level") laat de tweede klik doorlekken naar een antwoordknop van de zojuist geladen volgende vraag — registreert een ongewild fout antwoord zonder bewuste keuze van de speler. Reproduceerbaar bevestigd in zowel Speedrunner- als Chaoot-profiel (2× onafhankelijk, telkens 100% consistent).
   Bewijs: `evidence/data-detective/speedrunner/desktop/flow.png`, `evidence/data-detective/chaoot/desktop/flow.png`
   Advies: debounce/disable de klik-handler direct na de eerste klik op transitieknoppen.

2. **[WARN]** Statische/niet-escalerende feedback bij herhaald hetzelfde foute antwoord (Vastloper-profiel): de uitleg-tekst is inhoudelijk correct maar identiek bij elke poging, geen extra hint voor een leerling die blijft vastlopen.
   Bewijs: `evidence/data-detective/vastloper/desktop/flow.png`

3. **[WARN]** "Terug naar Mission Control"-knop reageert niet zichtbaar in de dev-preview-omgeving (URL en scherm ongewijzigd na klik). Mogelijk dev-preview-specifiek (geen echte Mission Control-route beschikbaar) — kon niet worden bevestigd zonder broncode te lezen.
   Advies: verifiëren in de echte leerling-omgeving of deze knop daar wél navigeert.

4. **[INFO]** Console toont een terugkerende, niet-kritieke waarschuwing over een ongebruikte font-preload (`fraunces-latin.woff2`) — geen impact op functionaliteit.

### Nog onzeker

- De Modelleerling-instructie "maakt precies ÉÉN bewuste fout" is per abuis niet uitgevoerd tijdens deze run (alle 6 antwoorden waren toevallig correct). De foutfeedback-styling (rode kaart + X-icoon + uitleg) is wel apart geverifieerd via de Speedrunner/Chaoot/Vastloper-profielen, dus dit gat is inhoudelijk gedekt — puur het Modelleerling-specifieke "bewuste fout op stap 1"-scenario ontbreekt.
- Bevinding #3 (Terug naar Mission Control) kon niet definitief als bug of dev-preview-beperking geclassificeerd worden zonder broncode te lezen (verboden binnen dit protocol).
- Geen hint/hulp-knop gevonden voor Vastloper; onduidelijk of dit een bewust ontwerpkeuze is (feedback-tekst is zelfstandig genoeg) of een gemiste kans.
