# DGSkills J3 P1 Werkbaarheidsaudit - Geavanceerd Programmeren & AI

Datum: 2026-05-18  
Scope: alleen J3 P1 (`ml-trainer`, `api-architect`, `neural-navigator`, `data-pipeline`, `open-source-contributor`, `advanced-code-review`)  
Risico: Geel - missie-UI, completion, bewijs en AI-gerelateerde leerstof geraakt; geen echte AI-providerlogica, auth, Supabase, RLS, secrets, leerlingdata of productieconfig aangepast.

## Bronnen

- `docs/audits/dgskills-mission-review-dashboard.md`
- `docs/audits/dgskills-all-years-completion-fix-plan-2026-05-17.md`
- `docs/audits/dgskills-all-missions-goal-review-audit-2026-05-10.md`
- `docs/agent/dgskills-mission-factory.md`
- `AGENTS.md`
- `src/config/curriculum.ts`
- `src/config/missionGoals.ts`
- J3 P1 template/configpaden voor DataViewer, BuilderCanvas, ReviewArena en `src/config/templateRegistry.ts`

## Samenvatting

J3 P1 is nu werkbaar als leerlingflow: elke opdracht start met een zichtbaar leerdoel, geeft succescriteria en docent-/leerlingbewijs, kan met normale leerlingacties worden afgerond, toont foutfeedback, en eindigt met een zichtbare CTA. De oorspronkelijke risico's zaten vooral in onduidelijke completion bij DataViewer, zwakke BuilderCanvas-bewijsgates en AI/session-noise in `open-source-contributor` en `advanced-code-review`.

Belangrijkste fixes:

- DataViewer-missies kregen missiegoal, score-threshold en tekstbewijseisen.
- `ml-trainer` kreeg een inhoudelijke correctie: spampercentage is 42%, niet 50%.
- BuilderCanvas-missies kregen missionGoal en minimale tekstlengtes per stap.
- `open-source-contributor` en `advanced-code-review` draaien zonder AI-chat om sessieruis te voorkomen.
- `data-pipeline` kreeg tekstcorrecties en expliciete ETL-bewijscriteria.

## Ontwerp

De eerste viewport toont nu per missie direct het doel, succescriteria en bewijs. CTA's blijven zichtbaar in eindstaat op desktop, iPad portrait, iPad landscape en narrow mobile. De Chrome-CDP matrix vond geen horizontale overflow en geen clipping op de eind-CTA's. Op mobile zijn de CTA's smaller maar nog volledig zichtbaar.

Resterend ontwerp-risico: echte iPad/Safari kan anders omgaan met touch, viewport chrome en scrollbars. Die check blijft menselijk open.

## Didactiek

De opdrachten zijn beter zelfstandig te begrijpen omdat elke missie expliciet zegt wat een leerling moet bewijzen. DataViewer geeft nu bewijseisen bij open tekstvragen, waardoor een leerling minder willekeurig kan klikken. BuilderCanvas blokkeert doorgaan totdat checklist en tekstbewijs compleet zijn. ReviewArena maakt het eindcriterium hard: alle rondes plus minimaal 65/100.

Waar een leerling nog kan twijfelen:

- `advanced-code-review`: de sorteer-/rapid-fire vorm is speels, maar een leerling kan bij een slechte sortering alsnog slagen door latere rondes. Dat is acceptabel als reviewopdracht, maar docent kan sorteerfouten apart bespreken.
- DataViewer-missies: de open tekstvragen zijn inhoudelijk stevig voor leerjaar 3; de bewijseisen helpen, maar sommige leerlingen hebben mogelijk voorbeeldzinnen nodig van de docent.
- BuilderCanvas: leerlingen kunnen checklists afvinken zonder perfecte inhoud. De minimale tekstlengte voorkomt lege afronding, maar menselijke beoordeling blijft nuttig.

## Techniek

De aangepaste configs volgen bestaande templatepatronen. Er zijn geen nieuwe routes, geen tijdelijke QA-routes en geen provider/auth/databasewijzigingen toegevoegd. `open-source-contributor` is in zowel config als template registry op `enableChat: false` gezet, zodat de registry de config niet overschrijft.

Console: in de Chrome-extensie-run verschenen enkele `message channel closed` meldingen op de lokale `ml-trainer` URL. In de CDP-matrix kwamen geen app-runtime blockers naar voren en de flows voltooiden. Ik classificeer die meldingen als Chrome-extensie/testnoise, niet als applicatieblokker.

## Chrome Bewijs

Interactieve leerling-speeltest via `@chrome` extensie:

- Alle zes missies lokaal geopend via Chrome-extensie overgenomen tab.
- Per missie: start, normale flow, foutmoment waar passend, eind/CTA en bewijsstatus gecontroleerd.
- `open-source-contributor` en `advanced-code-review`: geen AI-chat/session-noise zichtbaar tijdens eindstaat en matrix.

Viewportmatrix via echte Chrome DevTools-emulatie:

| Viewport | Afmeting | Resultaat |
|---|---:|---|
| Desktop/laptop | 1366x768 | 6/6 groen |
| iPad portrait | 1024x1366 | 6/6 groen |
| iPad landscape | 1366x1024 | 6/6 groen |
| Mobile narrow | 390x844 | 6/6 groen |

Matrixdetails: `/private/tmp/dgskills-j3p1-cdp-matrix.json`.

## Per Missie

| Missie | Technisch bewijs | Leerlingervaring | Afhaakpunt | Verbeterd | Nog checken |
|---|---|---|---|---|---|
| `ml-trainer` | Chrome-extensie uitgespeeld; CDP 4/4 viewports; eindstaat `Bewijs compleet`, 75/100 met bewust fout antwoord | Duidelijke ML-opbouw: spamdata, accuracy, overfitting | Tekstvraag supervised learning kan lastig zijn zonder begrippen | MissionGoal, tekstbewijscriteria, correct spampercentage 42% | Echte iPad/Safari touch/scroll |
| `api-architect` | BuilderCanvas 4 stappen voltooid; CDP 4/4 viewports; CTA zichtbaar | Praktische API-opdracht met duidelijke stapgating | Leerling kan checklist afvinken met matige inhoud | MissionGoal, minTextLength per stap, docentbewijs | Menselijke beoordeling API-inhoud |
| `neural-navigator` | DataViewer uitgespeeld; CDP 4/4 viewports; eindstaat 70/100 met foutmoment | Begrippen worden concreet via berekeningen en voorbeelden | Forward pass en backpropagation blijven cognitief zwaar | MissionGoal, tekstbewijscriteria voor gewichten/backprop/toepassing | Echte iPad/Safari en docentfeedback |
| `data-pipeline` | DataViewer uitgespeeld; CDP 4/4 viewports; eindstaat 75/100 met foutmoment | ETL voelt nuttig door concrete sensordata en schoonmaakkeuzes | Imputatie-nadeel vraagt abstract redeneren | MissionGoal, tekstbewijscriteria, tekstcorrecties | Echte iPad/Safari |
| `open-source-contributor` | BuilderCanvas 4 stappen voltooid; CDP 4/4 viewports; geen AI-chat zichtbaar | Simulatie maakt open source begrijpelijk zonder echte GitHub-drempel | Git-commando's kunnen voor zwakke leerlingen veel zijn | MissionGoal, minTextLength, intro verduidelijkt simulatie, chat uit | Menselijke check of PR-inhoud inhoudelijk sterk is |
| `advanced-code-review` | ReviewArena uitgespeeld; CDP 4/4 viewports; eindstaat 79/100; geen AI-chat zichtbaar | Leukste flow: sorteren, koppelen, categoriseren en rapid-fire voelt als periodequiz | Sorteren kan frustreren, maar foutfeedback is helder | MissionGoal, threshold 65, introfeatures, chat uit | Echte iPad/Safari; docent kan sorteerfouten nabespreken |

## Oordeel

J3 P1 is lokaal release-kandidaat op basis van Chrome-extensie-speeltest en echte Chrome-CDP viewportmatrix. De opdrachten zijn didactisch begrijpelijker en completion is niet meer afhankelijk van developer-denken of voorkennis van de engine.

Resterende risico's:

- Echte iPad/Safari is niet uitgevoerd.
- Chrome-extensie zelf heeft geen viewport override; de matrix is daarom met echte Chrome-CDP-emulatie gedaan.
- BuilderCanvas blijft een zelfrapportagevorm: tekstlengte en checklist bewijzen inspanning, maar docentbeoordeling blijft nodig voor inhoudskwaliteit.
