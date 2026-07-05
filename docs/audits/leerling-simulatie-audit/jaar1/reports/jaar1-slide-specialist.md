## Opdracht Live Check: slide-specialist

**Advies:** ship · **Risico:** Groen · **Getest als:** leerling (dev-preview zonder login) · **URL:** http://localhost:3010/dev/mission-preview?mission=slide-specialist

### Student-playthrough (per profiel: start/flow/feedback/eind)

**Modelleerling** — Leest de intro (goal, 4 stappen, Kees-uitleg), speelt serieus door alle 4 stappen (Thema kiezen → Inhoud op de slide → Animatie toevoegen → Overgangen instellen), vinkt telkens de 3 bewijsknoppen per stap af, maakt bewust 1 fout op het eerste checkpunt. Rondt eerlijk af met **50/55 punten (91%)**. Foutfeedback op het checkpunt werkt zoals verwacht: opties disabled, juist antwoord + uitleg getoond. Duur: ~25 acties.

**Speedrunner** — Klikt alle bewijsknoppen direct aan zonder in echte PowerPoint iets te doen, kiest op elk checkpunt de eerste optie (3 van 4 keer fout). Rondt zonder enige inspanning af met **40/55 punten (73%)**. Geverifieerd met een `noRetry`-probe dat de checkpunt-vraag niet te skippen is zonder een keuze te maken — dat werkt goed. Maar de bewijsknoppen zelf accepteren blind klikken zonder enige verificatie dat de leerling echt iets in PowerPoint deed. Duur: ~20 acties.

**Chaoot** — Dubbelklikt op start-knop en bewijsknoppen, navigeert via `back` naar about:blank en weer terug, reload't tweemaal midden in een stap (na 1 van 3 knoppen), wisselt meerdere keren van checkpunt-antwoord vóór het bevestigen. Geen crash, geen corrupte eindstate. Rondt af met **50/55 (91%)**. Eén concrete bug gevonden: een dubbelklik op een bewijsknop toggled de checkbox tweemaal (aan→uit), waardoor de klik per saldo niets deed — leerling moet opnieuw enkel klikken. Voortgang (punten, checkboxen, checkpunt-keuze) overleeft reload en de about:blank-omweg volledig. Duur: ~35 acties.

**Vastloper** — Geeft op alle 3 checkpunt-vragen in de missie een fout antwoord (herhaald over de hele playthrough, niet alleen op 1 stap), test expliciet of een tweede poging mogelijk is via een `noRetry`-klik op de disabled-knoppen. Bevestigd: na de eerste fout wordt de vraag direct afgesloten (alle opties disabled + antwoord getoond), geen retry-mechanisme. Toch geen dead-end: rondt af met **40/55 (73%)**, "Volgende stap"/"Bekijk resultaten" blijft altijd beschikbaar. Ook getest: met slechts 1-2 van 3 bewijsknoppen aangevinkt verschijnt geen checkpunt/volgende-stap-knop, zonder expliciete "je mist nog iets"-tekst (wel duidelijk visueel welke checkbox leeg is). Duur: ~30 acties.

### Visuele UI/UX (logo's/afbeeldingen/layout/tekst-knoppen)

Geen logo's of afbeeldingen in deze missie — puur tekst- en knop-gebaseerde tool-instructie (verwacht voor dit missietype: leerling werkt in échte PowerPoint ernaast, de missie geeft alleen instructies + zelfrapportage). Layout is consistent en leesbaar op alle 4 geteste viewports (desktop 1440×900, tablet-portrait 810×1080, tablet-landscape 1080×810, mobile 390×844): geen tekstoverloop, geen afgesneden knoppen, geen horizontale scroll. Progressiebalk (4 segmenten) en puntenteller bovenaan blijven zichtbaar op elke viewport.

### Browserbewijs (tabel 4 viewports × 4 states)

| Viewport | start | flow | feedback | eind |
|---|---|---|---|---|
| desktop (1440×900) | ✓ modelleerling/desktop/start.png | ✓ modelleerling/desktop/flow.png | ✓ modelleerling/desktop/feedback.png | ✓ modelleerling/desktop/eind.png |
| tablet-portrait (810×1080) | ✓ modelleerling/tablet-portrait/start.png | — | ✓ modelleerling/tablet-portrait/feedback.png | ✓ modelleerling/tablet-portrait/eind.png |
| tablet-landscape (1080×810) | ✓ modelleerling/tablet-landscape/start.png | — | ✓ modelleerling/tablet-landscape/feedback.png | ✓ modelleerling/tablet-landscape/eind.png |
| mobile (390×844) | ✓ modelleerling/mobile/start.png | — | ✓ modelleerling/mobile/feedback.png | ✓ modelleerling/mobile/eind.png |

Aanvullend bewijs (single-viewport, per profiel): speedrunner/desktop/eind.png · chaoot/desktop/flow.png, flow-2.png, flow-3.png, flow-4.png, eind.png · vastloper/desktop/feedback.png, eind.png.

### Bevindingen (BLOCK/WARN/INFO, genummerd, met bewijs-pad)

1. **WARN** — Speedrunner voltooit de missie moeiteloos (40/55, 73%) zonder ooit iets in PowerPoint te doen: bewijsknoppen accepteren blind klikken zonder enige verificatie, en 3 van 4 fout-beantwoorde checkpunten blokkeren afronding niet. *(speedrunner/desktop/eind.png)*
2. **WARN** — Dubbelklik op een bewijsknop toggled de checkbox tweemaal (aan→uit); de klik doet per saldo niets en de leerling moet opnieuw enkel klikken om de knop alsnog aan te vinken. Geen debounce op deze knoppen. *(chaoot/desktop/flow-3.png)*
3. **WARN** — Checkpunt-vragen bieden geen tweede poging: na 1 fout antwoord gaan alle opties direct op disabled en verschijnt het juiste antwoord — geverifieerd met een noRetry-klik dat hernieuwde selectie niet meer mogelijk is. Geen "probeer nog eens", wat de zelfontdekkende leerroute voor een gemotiveerde leerling beperkt. *(vastloper/desktop/feedback.png)*
4. **INFO** — Voortgang (punten, aangevinkte checkboxen, checkpunt-keuze) blijft volledig behouden na reload, ook midden in een stap en na een browser-back-naar-about:blank-omweg — robuuste persistentie. *(chaoot/desktop/flow-4.png)*
5. **INFO** — Geen permanente vastloop mogelijk: zelfs met alle 3 checkpunten fout beantwoord rondt de missie af (40/55, 73%); "Volgende stap"/"Bekijk resultaten" blijft altijd bereikbaar. *(vastloper/desktop/eind.png)*
6. **INFO** — Alle 4 viewports tonen identieke, volledig leesbare content op elk sleutelmoment; geen layout-problemen op tablet of mobile. *(modelleerling/mobile/feedback.png)*
7. **INFO** — "Controleer antwoord"-knop bestaat pas nadat een checkpunt-optie is gekozen; skippen van de meerkeuzevraag zonder keuze is niet mogelijk (geverifieerd met noRetry-probe).
8. **INFO** — Met slechts 1-2 van 3 bewijsknoppen aangevinkt verschijnt geen checkpunt/volgende-stap-knop en geen expliciete "je mist nog iets"-melding — wel duidelijk visueel welke checkbox nog leeg is.

Geen console-errors of network-fouten opgetreden in alle 4 profielen (alleen normale Vite/web-vitals/analytics-dev-logs).

### Nog onzeker

- Of de "geen verificatie op bewijsknoppen" (bevinding 1) een bewuste ontwerpkeuze is (zelfrapportage/eerlijkheidsbeginsel, past bij tool-guide-missies waar de app niet in de echte PowerPoint-app kan kijken) of een gat dat opzettelijk strenger zou moeten. Dit lijkt inherent aan het `template-engine`/`tool-guide`-format en niet mission-specifiek.
- Of het ontbreken van een retry-mechanisme op checkpunt-vragen (bevinding 3) een platform-brede designkeuze is voor alle tool-guide-missies, of specifiek voor deze missie afwijkt van andere jaar-1-missies.
