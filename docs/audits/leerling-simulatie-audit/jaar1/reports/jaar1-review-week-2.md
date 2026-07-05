## Opdracht Live Check: review-week-2

**Advies:** fix-eerst
**Risico:** Geel
**Getest als:** leerling (dev-preview zonder login)
**URL:** http://localhost:3010/dev/mission-preview?mission=review-week-2

### Student-playthrough (per profiel: start/flow/feedback/eind)

**Modelleerling** — Serieuze, eerlijke doorloop van alle 4 ronden (Sorteren → Koppelen → Categoriseren → Snel beantwoorden) plus 1 bonusvraag. Startscherm toont titel, tijdsduur, moeilijkheid, XP, doel/bewijs en 4 stappen duidelijk. Ronde 1-3 verliepen zonder problemen met heldere directe feedback ("Perfect! 25/25 punten"). Ronde 4 (Waar/Onwaar, 8 vragen met korte countdown-timer) verliep zeer moeizaam: door de tool-roundtrip-latency verliepen meerdere vraag-timers voordat een antwoord kon worden geklikt, wat resulteerde in een laag deelresultaat (1/8 goed, 3/25 punten) ondanks serieus meespelen. Missie rondde alsnog netjes af: eindscore 78/100 (78%), badge "Scherp Oog", 5-punts leerpuntenlijst. Duur: ca. 15 minuten, ~45 acties.

**Speedrunner** — Klikte overal de eerste optie / bevestigde ongewijzigde input zonder na te denken. Systeem accepteerde dit overal zonder crash en gaf eerlijke gedeeltelijke scores (bijv. 3/6 sorteerposities correct = 13/25 punten; 5/5 koppels correct behaald na 5 fouten = 0/25 punten door foutenstraf). Geen manier gevonden om de missie zonder inspanning te voltooien met hoge score. Ronde 4's timer-doorschiet-gedrag werd hier opnieuw bevestigd (vraag 5 werd overgeslagen, laatste klik kwam te laat). Eindscore: 44/100 (44%), badge "Kennis in opbouw", bemoedigende hertry-tekst. Duur: ca. 8 minuten, ~35 acties.

**Chaoot** — Dubbelklikken, reload midden in stappen, back-navigatie, conflicterende kliks. Vond hier de belangrijkste bugs van deze audit: (1) een dubbelklik op "Volgende ronde" sloeg Ronde 2 (Koppelen) volledig over — rechtstreeks van Ronde 1 naar Ronde 3; (2) het uiteindelijke eindscherm toonde alsnog een score (4/25) voor die nooit-gespeelde ronde, wat een verzonnen deelcijfer aan leerling/docent presenteert; (3) een reload vlak na het voltooien van een ronde (terwijl de bonusvraag-flow nog niet was afgerond) verloor de zojuist behaalde punten van die ronde volledig, twee keer reproduceerbaar bevestigd; (4) browser-back navigeerde direct naar een lege pagina (about:blank) zonder interne stap-historie. Positief: reload midden in de Ronde 4-timer herstelde netjes, dubbelklikken op antwoord-knoppen gaf geen dubbele score-registratie. Eindscore: 51/100 (51%), badge "Op de goede weg" — met het bovengenoemde vervalste deelcijfer erin verwerkt. Duur: ca. 20 minuten, ~60 acties.

**Vastloper** — Herhaalde bewust 5× dezelfde foute koppeling op één item in Ronde 2. Geen progressieve hint of extra hulptekst verscheen na 3 of 5 fouten — enkel een oplopende foutenteller. Geen permanente blokkade: de juiste koppeling werkte daarna gewoon. Ontdekte bijkomend dat Ronde 1 (Sorteren) maar 1 poging toestaat — na bevestigen met een foute volgorde is er geen "opnieuw proberen", enkel doorgaan naar de volgende ronde (wel met duidelijke per-item goed/fout-markering). Wanneer alle 4 ronden daadwerkelijk gespeeld werden, was de eindscore intern consistent en correct herleidbaar: 50/100 (50%), badge "Op de goede weg". Duur: ca. 18 minuten, ~50 acties.

### Visuele UI/UX (logo's/afbeeldingen/layout/tekst-knoppen)
Consistente DUCK-stijl (geel/zwart/wit), Kees-mascotte aanwezig op start- en eindscherm. Categoriseer-ronde geeft heldere visuele correctie via kleurmarkering (geel = fout gestaan) op het bevestigingsmoment. Sorteer-ronde markeert elk item individueel met rode kruisjes (fout) of groen vinkje (goed) — sterke, ondubbelzinnige feedback. Geen logo's, afbeeldingen of externe media in deze missie (puur tekst/kaartjes-gebaseerd). Geen clipping, overlap of afgesneden tekst gevonden op enig viewport.

### Browserbewijs (tabel 4 viewports × 4 states)

| Viewport | start | flow | feedback | eind |
|---|---|---|---|---|
| desktop (1440x900) | ok | ok | ok | ok |
| tablet-portrait (810x1080) | ok | — | — | ok |
| tablet-landscape (1080x810) | ok | — | — | ok |
| mobile (390x844) | ok | — | — | ok |

Alleen Modelleerling doorliep de volledige viewport-matrix (per draaiboek); flow/feedback op tablet/mobile niet apart getest maar start/eind bevestigen consistente, niet-clippende layout op alle 4 formaten.

### Bevindingen (BLOCK/WARN/INFO, genummerd, met bewijs-pad)

1. **BLOCK** — Dubbelklik op "Volgende ronde" na Ronde 1 slaat Ronde 2 (Koppelen) volledig over, rechtstreeks door naar Ronde 3. De leerling krijgt dat leerdoel nooit te oefenen.
   `/Users/yorinvonder/dgskills-audit/evidence/review-week-2/chaoot/desktop/flow-2-skip-bug.png`

2. **BLOCK** — Gevolgschade van bevinding 1: het definitieve eindscherm toont een score (4/25) voor de nooit-gespeelde Ronde 2, alsof de leerling die wél gedaan en slecht gescoord heeft. Vertekent het cijfer richting leerling én docent.
   `/Users/yorinvonder/dgskills-audit/evidence/review-week-2/chaoot/desktop/eind-skipped-round-score.png`

3. **WARN** — Reload direct na het voltooien+bevestigen van een ronde (terwijl de bonusvraag-flow eronder nog open staat) verliest de zojuist behaalde punten van die ronde volledig; 2× onafhankelijk gereproduceerd. De leerling ziet "Perfect! 25/25 punten" maar dat blijkt nog niet permanent opgeslagen.
   `/Users/yorinvonder/dgskills-audit/evidence/review-week-2/chaoot/desktop/flow-3-reload-lost-progress.png`

4. **WARN** — Ronde 4's per-vraag countdown-timer schiet automatisch door naar de volgende vraag (incl. het overslaan van een hele vraag) als er niet snel genoeg wordt gereageerd; bevestigd bij 3 van de 4 profielen. Kan trage lezers onevenredig raken.
   `/Users/yorinvonder/dgskills-audit/evidence/review-week-2/modelleerling/desktop/flow-4-timer-issue.png`

5. **WARN** — Browser-back tijdens de missie navigeert direct naar een lege pagina (about:blank) zonder interne stap-historie; een leerling die per ongeluk de terugknop gebruikt valt volledig uit de missie.
   `/Users/yorinvonder/dgskills-audit/evidence/review-week-2/chaoot/desktop/flow-3-back-blank.png`

6. **WARN** — Geen progressieve hint/hulptekst verschijnt na herhaaldelijk (5×) dezelfde fout op één item in Ronde 2 — enkel een oplopende foutenteller, geen scaffolding voor een vastlopende leerling.
   `/Users/yorinvonder/dgskills-audit/evidence/review-week-2/vastloper/desktop/flow-3-attempts.png`

7. **INFO** — Ronde 1 (Sorteren) staat maar 1 poging toe; na een foute bevestiging is er geen "opnieuw proberen", enkel doorgaan (wel met duidelijke per-item correctiemarkering).
   `/Users/yorinvonder/dgskills-audit/evidence/review-week-2/vastloper/desktop/flow-1-no-retry.png`

8. **INFO** — Bij ronde-overgangen toont de header (rondelabel/puntentotaal) soms al de nieuwe ronde terwijl de body nog kort de vorige, afgeronde ronde toont (~1-2s stale render) voordat de content bijwerkt. Cosmetisch, geen functionele impact bevestigd.
   `/Users/yorinvonder/dgskills-audit/evidence/review-week-2/modelleerling/desktop/flow-2.png`

9. **INFO** — De verdiepingsvraag (+5 bonus) na Ronde 3 verschijnt visueel ONDER de "Volgende ronde"-knop op dezelfde pagina; een leerling die snel doorklikt kan de bonusvraag missen zonder te beseffen dat er meer content stond.
   `/Users/yorinvonder/dgskills-audit/evidence/review-week-2/modelleerling/desktop/bonus-debug.png`

10. **INFO** — Geen console-errors of gefaalde netwerkrequests over alle 4 profielen; missie is technisch stabiel qua runtime-fouten. Startscherm en eindscherm renderen consistent zonder clipping op alle 4 viewports.
    `/Users/yorinvonder/dgskills-audit/evidence/review-week-2/modelleerling/mobile/eind.png`

### Nog onzeker
- Of bevinding 1 (dubbelklik-skip) specifiek is voor de "Volgende ronde"-knop of breder voorkomt bij andere primaire CTA's in dit template — niet getest op andere knoppen dan "Volgende ronde"/"Afronden"/"Doorgaan".
- Of de puntenverrekening bij een overgeslagen ronde (bevinding 2) een vaste fallback-waarde toekent (hier steeds "4", gelijk aan Ronde 1's score) of een ander patroon volgt — geen code gelezen, puur uit browserobservatie afgeleid.
- Of het reload-dataverlies (bevinding 3) ook optreedt wanneer de bonusvraag-flow wél volledig is afgerond vóór de reload, of uitsluitend in de tussentoestand.
- Exacte duur van de Ronde 4-timer (5s/10s/11s werden alle drie waargenomen bij verschillende starts) — mogelijk variabel per vraag of afhankelijk van laadmoment; niet met een stopwatch geverifieerd.
