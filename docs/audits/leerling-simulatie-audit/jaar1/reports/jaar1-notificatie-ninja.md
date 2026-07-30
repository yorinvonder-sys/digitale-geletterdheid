## Opdracht Live Check: notificatie-ninja

**Advies:** fix-eerst · **Risico:** Geel · **Getest als:** leerling (dev-preview zonder login) · **URL:** http://localhost:3010/dev/mission-preview?mission=notificatie-ninja

### Student-playthrough (per profiel: start/flow/feedback/eind)

**Modelleerling** (~35 acties, viewport-matrix op alle 4 sleutelmomenten): serieuze eerste doorloop, hints niet nodig gehad (geen hint-knop aangetroffen). Fase 1 (aandachtstrekkers herkennen): 6/6 correct, 25/25. Fase 2 (rangschikken): bewuste afwijkende volgorde, 16/25 met individuele feedback per item inclusief de eigen-versus-correcte positie. Fase 3 (nuttig/manipulatief): 22/25. Fase 4 (welke aanpak helpt echt): 6/6 correct, 25/25. Eindscore 88/100 (88%), CompletionScreen toont correct "Notificatie Ninja" met per-fase-uitsplitsing en "Wat je hebt geleerd". Viewport-matrix (desktop/tablet-portrait/tablet-landscape/mobile) op start/flow/feedback/eind: layout blijft overal leesbaar en functioneel, geen clipping of overlap.

**Speedrunner** (~25 acties): geen leestijd, altijd eerste zichtbare optie, poging om "Controleer mijn keuze" te klikken zonder selectie mislukte correct (knop blijft disabled — geen skip mogelijk). Klakkeloos-eerste-optie-strategie gaf logisch lage scores op fase 1 (9/25) en fase 3 (13/25) en fase 4 (17/25), maar toevallig 25/25 op fase 2 (de DOM-volgorde was toevallig ook de correcte antwoordvolgorde). Eindscore 56/100. Missie liet zich niet zonder inspanning "doorklikken" naar een hoge score — het systeem onderscheidt goed tussen zorgvuldige en klakkeloze input.

**Chaoot** (~45 acties): dubbelklikken op navigatie- en submit-knoppen, reload midden in fase 1 en fase 2 (gedeeltelijke selectie/ranking), conflicterende kliks op hetzelfde item, "Opnieuw beginnen" gebruikt, 8/8 items geselecteerd op een fase die minimaal 6 vraagt. Niets crashte, geen dataverlies, geen dubbele score-optelling bij dubbele submits, laatste-klik-wint-gedrag bij conflicterende input. Eén klein click-through-effect: dubbelklik op "Start de missie" liet het eerste item op het volgende scherm al meteen geselecteerd staan. Eindscore 50/100, missie liet zich ondanks alle chaos gewoon afronden.

**Vastloper** (~35 acties): bewust foute selecties op fase 1 (2 van 6 items fout, 9/25) — geen "opnieuw proberen" beschikbaar ná het indienen van deze fase, alleen doorgaan naar de volgende ronde. Op fase 2 en 3 wél getest: "Opnieuw beginnen" (fase 2) en het wijzigen van een keuze vóór het definitieve indienmoment (fase 3) werkten beide probleemloos en hielpen de score echt verbeteren (fase 2 ging van een onvoltooide poging naar 22/25 na herstart). Geen enkel moment permanent vastgelopen — de missie bleef altijd afmaakbaar, ook met meerdere bewust lage scores (9/25, 3/25). Eindscore 59/100.

### Visuele UI/UX (logo's/afbeeldingen/layout/tekst-knoppen)

Consistente DUCK-stijl (geel/zwart/crème), Kees-mascotte op start- en eindscherm, duidelijke fase-indicator (1/4 t/m 4/4) en puntenteller bovenaan. Kaarten en knoppen blijven op alle geteste viewports leesbaar zonder overlap. Twee content-items in fase 2/3 ("Je vriend heeft iets gepost..." / "...reageert misschien...") missen het emoji-icoon dat alle andere items wel tonen — inconsistente stijl, geen functionele blocker.

### Browserbewijs (tabel 4 viewports × 4 states)

| Viewport | start | flow | feedback | eind |
|---|---|---|---|---|
| desktop (1440×900) | ✅ modelleerling/desktop/start.png | ✅ modelleerling/desktop/flow.png | ✅ modelleerling/desktop/feedback.png | ✅ modelleerling/desktop/eind.png |
| tablet-portrait (810×1080) | ✅ modelleerling/tablet-portrait/start.png | ✅ modelleerling/tablet-portrait/flow.png | ✅ modelleerling/tablet-portrait/feedback.png | ✅ modelleerling/tablet-portrait/eind.png |
| tablet-landscape (1080×810) | ✅ modelleerling/tablet-landscape/start.png | ✅ modelleerling/tablet-landscape/flow.png | ✅ modelleerling/tablet-landscape/feedback.png | ✅ modelleerling/tablet-landscape/eind.png |
| mobile (390×844) | ✅ modelleerling/mobile/start.png | ✅ modelleerling/mobile/flow.png | ✅ modelleerling/mobile/feedback.png | ✅ modelleerling/mobile/eind.png |

Aanvullend bewijs: speedrunner/desktop/eind.png, chaoot/desktop/flow.png, chaoot/desktop/eind.png, vastloper/desktop/feedback.png, vastloper/desktop/eind.png.

Console en netwerk gedraind na elk van de 4 profielen: geen enkele console-error/-warning (alleen verwachte dev-tooling en Web Vitals-logs), geen gefaalde netwerkrequests op geen enkel profiel.

### Bevindingen (BLOCK/WARN/INFO, genummerd, met bewijs-pad)

1. **BLOCK** — CompletionScreen toont de missietitel **"Screen Bewust"** in plaats van **"Notificatie Ninja"**. Reproduceerbaar op 3 van de 4 profielen (Speedrunner, Chaoot, Vastloper); alleen de Modelleerling-run toonde de correcte titel. Elke leerling die deze missie afrondt ziet dus (in de meeste gevallen) een andere naam op zijn eigen afrondingsscherm dan de missie die hij net gespeeld heeft — verwarrend en oogt onprofessioneel. Bewijs: `evidence/notificatie-ninja/speedrunner/desktop/eind.png`, `evidence/notificatie-ninja/chaoot/desktop/eind.png`, `evidence/notificatie-ninja/vastloper/desktop/eind.png`.
2. **WARN** — Twee content-items ("Je vriend heeft iets gepost wat je niet mag missen!" in fase 2, "Je vriend reageert misschien op jouw reactie" in fase 3) missen het emoji-icoon dat alle andere 7 items in diezelfde opdracht wel tonen. Inconsistente visuele stijl, geen functionele blocker. Bewijs: `evidence/notificatie-ninja/modelleerling/desktop/flow.png`, `evidence/notificatie-ninja/chaoot/desktop/flow.png`.
3. **INFO** — Fase 1 (multi-select aandachtstrekkers) biedt geen "opnieuw proberen" ná het indienen; de score ligt na één poging vast en de leerling kan alleen door naar de volgende ronde. Fase 2 en 3 bieden die herkansing wél (vóór het definitieve indienmoment). Mogelijk een bewuste ontwerpkeuze, maar inconsistent tussen fases binnen dezelfde missie. Bewijs: `evidence/notificatie-ninja/vastloper/desktop/feedback.png`.
4. **INFO** — Dubbelklik op de navigatieknop "Start de missie" veroorzaakte een click-through-effect: het eerste item (Autoplay) op het volgende scherm stond al meteen geselecteerd. Geen crash of dataverlies, maar een ongewenste voorselectie die de leerling niet zelf koos.
5. **INFO (positief)** — Reload midden in een gedeeltelijk ingevulde stap (fase 1 en fase 2) behield de voortgang correct zonder dataverlies of crash. Dubbele submits (dblclick op "Controleer"-knoppen) gaven geen dubbele score-optelling. Laatste-klik-wint-gedrag bij conflicterende input. De missie liet zich in geen enkel profiel forceren tot een permanente lock — altijd afmaakbaar, ook met chaos-input of bewust lage scores.

### Nog onzeker

- Of de "Screen Bewust"-titel een resterende oude naam is die specifiek via bepaalde code-paden (niet de eerste/verse render) wordt opgehaald, of dat de Modelleerling-run toevallig de uitzondering was — dit vergt code-inzicht dat buiten de scope van deze leerling-simulatie valt.
- Of het ontbreken van een "opnieuw proberen" in fase 1 een bewuste didactische keuze is (voorkomt dat leerlingen blind gokken tot ze het antwoord "raden") of een inconsistentie die gefixt moet worden.
- Er is geen expliciete hint-knop aangetroffen tijdens de Modelleerling-doorloop; niet zeker of die elders in de flow verscheen of ontbreekt.
