## Opdracht Live Check: word-wizard

**Advies:** ship · **Risico:** Geel · **Getest als:** leerling (dev-preview zonder login) · **URL:** http://localhost:3010/dev/mission-preview?mission=word-wizard

### Student-playthrough (per profiel: start/flow/feedback/eind)

**Modelleerling** (13-jarig niveau, serieus meespelen, 1 bewuste fout, viewport-matrix op 4 sleutelmomenten)
Doorliep alle 4 stappen zonder crash. Score liep 0→15→30→40→50 pts op. Bewuste fout gemaakt op checkpunt stap 4 (verkeerd antwoord gekozen) — correcte foutfeedback met uitleg, score bleef gelijk (geen straf). Eindigde op 50/55 punten (91%), badge "Word Wizard", volledige "Wat je hebt geleerd"-lijst getoond. Viewport-matrix (810×1080 / 1080×810 / 390×844) op start, feedback en eind: layout bleef in alle gevallen correct, geen afsnijding of overlap. ~40 acties, ~15 min.

**Speedrunner** (geen lezen, altijd eerste optie, proberen te skippen)
Klikte snel door alle 4 stappen zonder te lezen. Beantwoordde ALLE 3 checkpunt-vragen fout (altijd eerste optie). Missie liet hem toch overal doorheen zonder blokkade en hij behaalde 40/55 punten (73%) met volledige "Missie voltooid!"-afsluiting inclusief dezelfde "Wat je hebt geleerd"-lijst als een leerling die alles goed had. Geen crash, geen zinloze-invoer-probleem (geen vrije tekstvelden in deze missie). ~20 acties, ~3 min.

**Chaoot** (dubbelklikken, conflicterende kliks, reload midden in stap, back/vooruit)
Kernbevinding: dubbelklik op een checklist-bewijsknop toggelt het item aan-en-direct-weer-uit, waardoor het NIET als voltooid telt ondanks zichtbaar aanklikken — reproduceerbaar op meerdere stappen, zonder foutmelding. Escape-pad bestaat (nogmaals klikken herstelt het), maar is voor een leerling niet vindbaar. Overige robuustheid was sterk: "Controleer antwoord" en "Bekijk resultaten" zijn dubbelklik-veilig (disabled na eerste klik), reload midden in een half-voltooide stap behield score en voortgang correct via persistente opslag, snel van keuze wisselen op een checkpunt werkte als verwacht radiobutton-gedrag. Browser-`back` gaf `about:blank` (verwacht harnas-gedrag bij een verse sessie zonder opgebouwde SPA-historie, geen missie-bug). Eindigde alsnog op een perfecte 55/55 (100%), badge "Document Expert" (andere badge-naam dan bij 91%, correct scoregebonden gedrag). Geen console-errors of mislukte requests ondanks alle chaos. ~55 acties, ~7 min.

**Vastloper** (herhaald fout antwoord, hulp zoeken, testen op permanent vastlopen)
Kernbevinding: checkpunt-vragen staan slechts 1 poging toe — na het eerste antwoord (goed of fout) worden alle opties permanent disabled en verschijnt direct "Volgende stap", ook na een page-reload. Het "≥3× hetzelfde foute antwoord proberen op 1 stap"-scenario uit het profiel is dus technisch niet uitvoerbaar binnen 1 checkpunt. Wel bevestigd op de belangrijkste vraag: de leerling kan NOOIT permanent vastlopen — zelfs met 3/3 checkpunten fout (100% fout-quote) kwam hij automatisch tot het eindscherm (40/55 = 73%, "Missie voltooid!"). Feedback bij een fout antwoord is inhoudelijk sterk (toont steeds het juiste antwoord + korte uitleg), dus de leerling leert het concept alsnog. Geen console-errors of mislukte requests. ~25 acties, ~4 min.

### Visuele UI/UX (logo's/afbeeldingen/layout/tekst-knoppen)

Consistente, rustige tool-guide-layout: instructieblok ("Doe dit nu"), context-tip, checklist-bewijsknoppen, optioneel checkpunt met feedback. Geen afbeeldingen/logo's in deze missie zelf (het is een stap-voor-stap tekst-instructie). Score-teller en stapindicator ("Stap X van 4") bovenaan zijn op alle 3 geteste viewports goed leesbaar. Kees-mascotte-tekst op intro- en eindscherm is passend en niet opdringerig. Auteursrecht wordt expliciet en correct genoemd bij de afbeelding-stap ("geen willekeurige Google-foto's").

### Browserbewijs (tabel 4 viewports × 4 states)

| Viewport | start | flow | feedback | eind |
|---|---|---|---|---|
| desktop (1440×900) | ✓ modelleerling | ✓ modelleerling, speedrunner, chaoot, vastloper | ✓ modelleerling, vastloper | ✓ modelleerling, speedrunner, chaoot, vastloper |
| tablet-portrait (810×1080) | ✓ modelleerling | — | ✓ modelleerling | ✓ modelleerling |
| tablet-landscape (1080×810) | ✓ modelleerling | — | ✓ modelleerling | ✓ modelleerling |
| mobile (390×844) | ✓ modelleerling | — | ✓ modelleerling | ✓ modelleerling |

Alle geteste viewport/state-combinaties tonen correcte layout zonder afsnijding, overlap of onbereikbare knoppen.

### Bevindingen (BLOCK/WARN/INFO, genummerd, met bewijs-pad)

1. **WARN** (chaoot, technical) — Dubbelklik op een checklist-bewijsknop toggelt het item aan-en-weer-uit; telt niet als voltooid ondanks zichtbaar aanklikken, geen foutmelding. Reproduceerbaar op stap 1 en 2, op zowel verse als non-verse sessies. Escape-pad (nogmaals klikken) bestaat maar is niet vindbaar voor een leerling.
   Bewijs: `/Users/yorinvonder/dgskills-audit/evidence/word-wizard/chaoot/desktop/flow-dblclick-toggle-block.png`

2. **WARN** (vastloper, playthrough) — Checkpunt-vragen staan maar 1 poging toe; na het eerste antwoord (goed of fout) is de vraag permanent afgesloten, ook na reload. Geen "opnieuw proberen"-optie; het juiste antwoord wordt altijd meteen getoond na 1 fout, wat zelf-ontdekken wegneemt.
   Bewijs: `/Users/yorinvonder/dgskills-audit/evidence/word-wizard/vastloper/desktop/flow-first-wrong.png`

3. **WARN** (speedrunner, playthrough) — Een leerling die alle checkpunten fout beantwoordt krijgt toch de volledige "Wat je hebt geleerd"-afsluiting, identiek aan een leerling die alles goed had (alleen de score-badge verschilt). Geen signaal dat er inhoudelijk iets gemist is.
   Bewijs: `/Users/yorinvonder/dgskills-audit/evidence/word-wizard/speedrunner/desktop/eind.png`

4. **WARN** (modelleerling, playthrough) — Klik op "Missie voltooid!" geeft in de dev-preview-route geen zichtbare navigatie; mogelijk normaal voor deze dev-route (niet gewired naar het dashboard), maar niet bevestigd tegen de echte ingelogde app.
   Bewijs: geen (a11y-observatie)

INFO-bevindingen (26 stuks, zie JSONL): stap 3 mist als enige een checkpunt (mogelijk bewuste variatie); score wordt pas na de laatste van 4 checklist-klikken in één keer toegekend (bevestigd normaal gedrag, geen bug); "Controleer antwoord"/"Bekijk resultaten" zijn dubbelklik-veilig; reload behoudt voortgang correct via persistente opslag; badge-titel is scoregebonden (91% → "Word Wizard", 100% → "Document Expert"); geen console-errors of mislukte netwerkrequests in alle 4 profielen.

### Nog onzeker

- Of "Missie voltooid!" in de echte ingelogde app wél navigeert naar het leerlingdashboard (niet los van dit dev-harnas te verifiëren).
- Of de dubbelklik-toggle (bevinding 1) ook optreedt op een echt touchscreen-device (iPad, de doelgroep-hardware) — deze audit gebruikte een desktop-browser-daemon; dubbeltikken op glas kan een net iets ander event-patroon geven dan een muis-dubbelklik.
- Of het ontbreken van checkpunt op stap 3 een bewuste ontwerpkeuze is of een gemist stuk.
