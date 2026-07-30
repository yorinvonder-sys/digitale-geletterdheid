## Opdracht Live Check: cookie-crusher

**Advies:** ship · **Risico:** Groen · **Getest als:** leerling (dev-preview zonder login) · **URL:** http://localhost:3010/dev/mission-preview?mission=cookie-crusher

### Student-playthrough (per profiel: start/flow/feedback/eind)

**Modelleerling** (leest alles, één bewuste fout, viewport-matrix) — Start: intro-scherm compleet, doel + stappenlijst + Kees-tekst duidelijk. Flow: 4 fases correct doorlopen (herken dark patterns → rangschikken → accepteren/weigeren-scenario's → welke data staat op het spel), bewuste fout gemaakt bij het nieuwssite-scenario in fase 3 ("consent or pay"-model), systeem gaf daar correct de nuance terug. Feedback: per-item uitleg met AVG-onderbouwing na elke fase, altijd behulpzaam en to-the-point. Eind: CompletionScreen "Cookie Detective", 96/100 punten, "Wat je hebt geleerd"-lijst met 5 punten. Viewport-matrix (desktop/tablet-portrait/tablet-landscape/mobile) op alle 4 sleutelmomenten: content compleet, geen afknipping, geen layout-breuk.

**Speedrunner** (nooit lezen, altijd eerste optie, probeert te skippen) — Start: direct doorgeklikt. Flow: klikte overal de eerste zichtbare opties/altijd "Accepteren"; geen manier gevonden om de verplichte minimaal-6-selectie in fase 1 en 4 te omzeilen — de "Controleer"-knop blijft hard disabled tot het minimum gehaald is. Feedback: eerlijke lage deelscores (9/25, 25/25 toevalstreffer, 8/25, 9/25) met "gemist!"-labels. Eind: 51/100 punten, badge "Goed Begonnen" (niet de topscore-badge), mildere toon "Goed bezig — en nu weet je precies wat er nog beter kan."

**Chaoot** (dubbelklikken, reload midden-in, back-en-vooruit, omgekeerde volgorde) — Start: dubbelklik op "Start de missie" gaf één keer een niet-herhaalbare state-anomalie (zie Bevinding 2). Flow: 2× reload midden in een fase (fase 1 na 6/6 selecties, fase 3 na 2 van 6 scenario's) — beide keren volledige state-persistentie, geen dataverlies. `back`-navigatie ging naar `about:blank` (verwacht, want geen echte browser-history per stap — conform draaiboek-regel 5). Omgekeerde rangschikking in fase 2 gaf duidelijke "(#5)"-hints bij elk fout-geplaatst item. Feedback: consistent en accuraat door alle stress-acties heen. Eind: 60/100 punten, badge "Privacy Waakzaam", geen crash of corruptie ondanks alle chaotische acties.

**Vastloper** (≥3× hetzelfde foute antwoord, zoekt hints, test permanente vastloop) — Start/flow: bewust herhaaldelijk foute keuzes gemaakt (fase 1: 2 correcte items gemist + 2 onterecht gekozen; fase 2: volledig omgekeerde volgorde; fase 3: 4 van 6 scenario's fout). Getest of je vast kunt lopen: fase 4 met opzet op 1 van 6 selecties gehouden en 3× herhaald op de disabled "Controleer mijn keuze"-knop geklikt — knop blijft correct disabled, maar de instructietekst ("Selecteer minimaal 6 opties" / "X van minimaal 6 items geselecteerd") is permanent zichtbaar en zelfverklarend, geen verstopte hint nodig. Geen enkele fase blokkeert doorgang naar "Volgende ronde" ongeacht score — permanent vastlopen is niet mogelijk. Eind: 31/100 punten (laagste van alle profielen), badge "Blijf Oefenen" met de meest bemoedigende tekst van alle vier eindschermen: "Elke poging maakt je sterker. Probeer 'm gerust nog eens."

### Visuele UI/UX (logo's/afbeeldingen/layout/tekst-knoppen)

Geen logo's/afbeeldingen in deze missie (tekst- en emoji-gebaseerde scenario-kaarten). Layout op alle vier viewports (1440×900, 810×1080, 1080×810, 390×844) toont content volledig zonder afknipping; op mobile is de content een normale verticale scroll-lijst, geen gecomprimeerde of onleesbare elementen. Kleurcontrast van geselecteerde/niet-geselecteerde/gemist-states is visueel duidelijk (geel = geselecteerd/correct, rood-geel = fout, wit = neutraal) — geverifieerd via screenshot omdat de accessibility-snapshot deze states niet als los label meegeeft (zie Bevinding 1). Vier fase-afhankelijke badges/toon-varianten op het eindscherm (Cookie Detective / Goed Begonnen / Privacy Waakzaam / Blijf Oefenen) schalen consistent en gepast mee met de score.

### Browserbewijs (tabel 4 viewports × 4 states)

| Viewport | start | flow/feedback | eind |
|---|---|---|---|
| Desktop 1440×900 | modelleerling/desktop/start.png | modelleerling/desktop/feedback.png, modelleerling/desktop/flow.png | modelleerling/desktop/eind.png |
| Tablet-portrait 810×1080 | modelleerling/tablet-portrait/start.png | modelleerling/tablet-portrait/feedback.png | modelleerling/tablet-portrait/eind.png |
| Tablet-landscape 1080×810 | modelleerling/tablet-landscape/start.png | modelleerling/tablet-landscape/feedback.png | modelleerling/tablet-landscape/eind.png |
| Mobile 390×844 | modelleerling/mobile/start.png | modelleerling/mobile/feedback.png | modelleerling/mobile/eind.png |

Aanvullend bewijs buiten de matrix: speedrunner/desktop/eind.png, chaoot/desktop/flow.png, chaoot/desktop/flow-reload-check.png, chaoot/desktop/eind.png, vastloper/desktop/flow.png, vastloper/desktop/flow-scenario1-state.png, vastloper/desktop/eind.png.

### Bevindingen (BLOCK/WARN/INFO, genummerd, met bewijs-pad)

Geen BLOCK-bevindingen. 3 WARN, 9 INFO — volledige lijst in `/Users/yorinvonder/dgskills-audit/findings/jaar1-cookie-crusher.jsonl` (12 regels). Samengevat:

1. **WARN — a11y-snapshot toont geen selected-state in fase 3.** De accepteren/weigeren-toggle-knoppen in fase 3 tonen geen "geselecteerd"-label in de accessibility-tree (geen aria-pressed of vergelijkbaar attribuut), terwijl fase 1, 2 en 4 dat wel doen via "geselecteerd" in de accessible name. Visueel is de state wel correct (kleurcontrast). Mogelijk een lichte tekortkoming voor screenreader-gebruikers. Bewijs: modelleerling/desktop/flow.png.
2. **WARN — eenmalige, niet-reproduceerbare state-anomalie bij dubbelklik op Start-de-missie.** Bij de allereerste dubbelklik-transitie van intro naar fase 1 stond één item al als geselecteerd zonder daarop geklikt te hebben. Trad niet meer op bij twee latere identieke dubbelklik-transities (Volgende-ronde, Bekijk-eindresultaat). Geen waarneembare impact op score of voltooiing.
3. **WARN — geen "opnieuw proberen"-optie per fase.** Na het controleren van een fase is er alleen "Volgende ronde", geen manier om die specifieke fase direct te herhalen. Een leerling die wil oefenen op één fase moet de hele missie herstarten (freshprofile/nieuwe sessie) — binnen één speelsessie is een fase niet herhaalbaar.
4–12. **INFO** — positieve/neutrale observaties: intro-scherm compleet op alle viewports; missie functioneel onmogelijk te skippen (minimaal-6-eis is hard); gedifferentieerde eindscherm-badges/toon schalen correct met score (4 unieke varianten waargenomen); volledige state-persistentie bij reload (2× getest, geen dataverlies); dubbelklik-robuustheid (geen crash, toggle-gedrag correct); geen permanente vastloop mogelijk in enige fase; permanent zichtbare, zelfverklarende voortgangstekst bij de minimaal-6-eis.

### Nog onzeker

- Bevinding 2 (dubbelklik-state-anomalie) is één keer waargenomen en niet reproduceerbaar gebleken bij herhaling; oorzaak niet vastgesteld binnen de scope van deze browser-only audit (geen broncode gelezen, conform opdracht).
- Niet getest: gedrag bij een ingelogde leerling-sessie (deze audit liep uitsluitend via de dev-preview zonder login, zoals voorgeschreven); mogelijk verschilt state-persistentie- of voortgangsregistratie-gedrag in de productieflow met account.
- Niet getest: gedrag op zeer trage netwerkverbinding of bij expliciete server-side foutresponses (console/network toonden in alle vier profielen alleen normale dev/analytics-logs, geen enkele error).
