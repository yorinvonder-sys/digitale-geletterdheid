## Opdracht Live Check: mission-launch

**Advies:** fix-eerst · **Risico:** Rood · **Getest als:** leerling (dev-preview zonder login) · **URL:** http://localhost:3010/dev/mission-preview?mission=mission-launch

### Student-playthrough (per profiel: start/flow/feedback/eind)

**Modelleerling** (~35 acties, ~19 min): Volledige serieuze playthrough van start tot eindscherm. Startscherm compleet (titel "De Lancering", doel, 4 stappen, mascotte Kees). Alle 4 stappen doorlopen met bewijs-knoppen + checkpunt-vragen; bewuste fout ingebouwd bij het privacy-checkpunt in stap 3 (foto van klasgenoot zonder toestemming) — foutfeedback was sterk: legde uit waarom fout, verwees terug naar eerdere lesstof ("Periode 3"), gaf terecht geen punten. Eindscherm compleet: badge "Marketing Expert", 55/60 punten (92%), correcte per-stap-breakdown, 6-punts "Wat je hebt geleerd"-lijst. Viewport-matrix op alle 4 sleutelmomenten (desktop/tablet-portrait/tablet-landscape/mobile) toonde geen structurele problemen.

**Speedrunner** (~15 acties, ~4 min): Klikte snel door zonder lezen, koos steevast de eerste (vaak foute) checkpunt-optie. Score liep normaal op (0→20 pts) tot in stap 3 een dubbelklik op een bewijs-knop de checklist-voortgang **permanent corrumpeerde**: score bleef vastzitten op 20 pts, checkpunt verscheen niet meer, en 2 herstelpogingen (opnieuw klikken op alle 3 items + page reload) losten het niet op. Sessie afgebroken op deze blocker conform de "2× vast"-regel.

**Chaoot** (~13 acties, ~4 min): Dubbelklikte op de start-knop (geen probleem) en vervolgens op bewijs-knoppen in stap 1 — dit reproduceerde dezelfde bug als bij Speedrunner, nu in stap 1: score bleef op 0 pts staan ondanks dat alle 3 bewijs-items (2× dubbel, 1× enkel) waren aangeklikt. Bug overleefde page reload én weg-/terug-navigeren. Dit is de 2e onafhankelijke reproductie en bewijst dat de bug generiek is (elke stap, elk item), niet stap-3-specifiek.

**Vastloper** (~30 acties, ~13 min): Beantwoordde bewust alle 4 checkpunten fout (met enkelvoudige, nette klikken om de dubbelklik-bug te vermijden). Ontdekte dat elk checkpunt slechts **1 poging** toestaat: na het eerste antwoord worden alle opties direct disabled (bevestigd op DOM-niveau, niet alleen visueel) en is er geen "opnieuw proberen". Reload en de "Terug"-knop veranderden niets aan die staat. Desondanks kon de missie volledig worden afgerond: eindscore 40/60 (67%), badge "Launcher" (lager dan Modelleerling's "Marketing Expert") — dus geen permanente vastloop, en de badge differentieert correct naar prestatie.

### Visuele UI/UX (logo's/afbeeldingen/layout/tekst-knoppen)
Geen logo's of afbeeldingen in deze missie — puur tekst- en knop-gebaseerd (tool-instructiemissie, geen chat/media). Layout en tekst bleven op alle 4 geteste viewports (1440×900, 810×1080, 1080×810, 390×844) structureel intact volgens de accessibility-snapshots; geen aanwijzingen voor afgeknipte content of gebroken layout op smallere schermen. Mascotte Kees en de "/goal"-regio renderden consistent op het startscherm.

### Browserbewijs (tabel 4 viewports × 4 states)

| Viewport | start | flow | feedback | eind |
|---|---|---|---|---|
| desktop (1440×900) | ✅ modelleerling | ✅ modelleerling / ❌ speedrunner (BLOCK) / ❌ chaoot (BLOCK) | ✅ modelleerling / ✅ vastloper (×2) | ✅ modelleerling / ✅ vastloper |
| tablet-portrait (810×1080) | ✅ modelleerling | — | ✅ modelleerling | ✅ modelleerling |
| tablet-landscape (1080×810) | ✅ modelleerling | — | ✅ modelleerling | ✅ modelleerling |
| mobile (390×844) | ✅ modelleerling | — | ✅ modelleerling | ✅ modelleerling |

Viewport-matrix is alleen door Modelleerling gedaan (per draaiboek); Speedrunner/Chaoot/Vastloper testten uitsluitend op desktop.

### Bevindingen (BLOCK/WARN/INFO, genummerd, met bewijs-pad)

1. **[BLOCK]** Dubbelklikken op een bewijs-checklist-knop corrumpeert de stap-voortgang permanent — gereproduceerd in zowel stap 1 (Chaoot) als stap 3 (Speedrunner), overleeft page reload en weg-/terug-navigeren, geen console-errors zichtbaar (silent state-bug). Speedrunner: `evidence/mission-launch/speedrunner/desktop/flow.png`. Chaoot: `evidence/mission-launch/chaoot/desktop/flow.png`.
2. **[WARN]** Checkpunt-vragen staan slechts 1 poging toe: na het eerste (foute) antwoord worden alle opties hard disabled (DOM-niveau bevestigd) zonder retry-optie, consistent op alle 4 checkpunten. Reload/Terug-knop bieden geen herkansing. `evidence/mission-launch/vastloper/desktop/feedback.png`.
3. **[INFO]** Docentcheck-knop ("Mijn docent heeft dit gezien") in stap 4 geeft geen score en geen zichtbare bevestiging na klikken, maar is wél een verplichte stap om "Bekijk resultaten" te laten verschijnen — functioneel vereist, maar geen duidelijke visuele feedback dat de klik iets deed.
4. **[INFO]** Positief: herhaald klikken op hetzelfde checklist-item (zonder dubbelklik) gaf geen score-inflatie — correct als toggle geïmplementeerd.
5. **[INFO]** Positief: foute checkpunt-antwoorden geven consistent geen punten en tonen sterke, uitlegrijke foutfeedback die soms terugverwijst naar eerdere lesstof.
6. **[INFO]** Positief: geen permanente vastloop mogelijk — een leerling die alle checkpunten fout beantwoordt, rondt de missie alsnog af met een lagere (maar navenante) score en badge.
7. **[INFO]** "Terug"-knop bovenaan het scherm had geen zichtbaar effect toen getest in een beantwoord-checkpunt-staat op stap 1 — functie onduidelijk vanuit leerling-perspectief, mogelijk overbodig of verkeerd gelabeld.

### Nog onzeker
- De exacte trigger van bevinding 1 (dubbelklik) kon niet dieper onderzocht worden zonder broncode te lezen (verboden binnen dit draaiboek) — onduidelijk of het een React-double-fire-race is, een debounce die verkeerd reset, of iets anders in de completion-telling.
- Niet getest: of de bug óók optreedt bij twee losse, snelle-maar-niet-dubbele kliks op verschillende bewijs-knoppen vlak na elkaar (alleen letterlijke dblclick en herhaalde-klik-op-zelfde-knop zijn getest).
- Niet getest: gedrag van de "Terug"-knop op stap 2/3/4 (alleen op stap 1 getest, gaf geen zichtbaar effect) — onbekend of dit overal een no-op is of alleen in deze specifieke staat.
