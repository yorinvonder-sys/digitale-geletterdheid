## Opdracht Live Check: api-architect — J3P1 (motor builder-canvas)

**Advies:** fix-eerst
**Risico:** Geel
**Getest als:** gesimuleerde leerlingen (serieuze baseline · sjoemelaar · worstelaar · iPad via Playwright) op de dev-previewroute, zonder login
**Datum:** 2026-08-19

### In één alinea
De missie laat leerlingen in vier stappen een API-architectuur ontwerpen, van REST-beschrijving tot Engelstalige documentatie. Een serieuze leerling haalt zonder problemen de volle 100 punten, maar een sjoemelaar haalt exact hetzelfde resultaat met vier willekeurige zinnen en zestien vinkjes — de inhoud wordt nergens gecontroleerd. Een worstelaar loopt nergens echt vast, maar het aparte bewijsveld op stap 1 blokkeert zonder uit te leggen waarom, ook als de tekst lang genoeg is. De iPad-run is schoon op drie formaten, zonder fouten of overlap. Het oordeel is fix-eerst: de score zegt nu niets over wat een leerling kan, en de missie-eigen eis dat de documentatie in het Engels moet, wordt nergens afgedwongen.

### Scores per profiel
| Profiel | Resultaat |
|---|---|
| Serieuze baseline | 100/100 (100%) 'Gehaald' bij oprechte antwoorden; identieke 100/100 bij vier plausibele maar inhoudsloze zinnen |
| Sjoemelaar | 100/100 (100%) 'Gehaald' zonder één inhoudelijk antwoord; 0/100 (vast op stap 1) bij puur toetsenbordgeraas |
| Worstelaar | 100/100 (100%) 'Gehaald', inclusief volle 25/25 op stap 4 terwijl de documentatie in het Nederlands was; 0/100 bij geraas |
| iPad (Playwright) | 100/100 (100%) 'Gehaald' via Playwright op 820x1180, 1180x820 en 390x844; 0 console-errors, geen horizontaal scrollen, alle raakvlakken >=44px |

### Bevindingen
1. **MAJOR** · motor · bevestigd — De volle score wordt gehaald zonder dat de inhoud ooit tegen de opdracht wordt gehouden: de checklist is pure zelfrapportage en de tekstpoort toetst alleen vorm (lengte, woordaantal, unieke letters), nooit of het antwoord over REST, endpoints of documentatie gaat. Vier korte irrelevante zinnen plus zestien vinkjes leveren exact hetzelfde resultaat als een serieuze playthrough. _Bewijs: run-letterlijke-luca.json F1; run-creatieve-cheater.json F1; _engines/builder-canvas.json topIssue 1_
2. **MAJOR** · missie · bevestigd — De expliciete eis 'schrijf de documentatie in het Engels' wordt nergens gecontroleerd: het vakje aanvinken volstaat. Een leerling die de eis mist, levert de hele stap in het Nederlands in en krijgt toch 25/25 en 'Gehaald'. _Bewijs: run-snelle-sam.json F1 (Nederlandse tekst, resultaat 25/25, totaal 100/100); api-architect.ts:79 en :85_
3. **MINOR** · motor · bevestigd — Het aparte bewijsveld blokkeert zonder uitleg: bij afgekeurde tekst verschijnt alleen een lengteteller terwijl de voortgangsknop uitgeschakeld blijft, ook als de teller ruim boven het minimum staat. Het gewone tekstveld toont daarnaast wél een verklarende hint. _Bewijs: run-letterlijke-luca.json F2 (teller '68/45', knop disabled); _engines/builder-canvas.json topIssue 3_
4. **MINOR** · motor · bevestigd — De voltooiingsdrempel van 40% kan niet falen en meet dus niets: 'Nog niet gehaald' is onbereikbaar, want het resultatenscherm verschijnt pas als alle stappen al door de poort zijn. Wie blijft steken, ziet geen falend eindscherm maar blijft op de stap hangen met 0 punten en zonder alternatieve uitweg. _Bewijs: run-creatieve-cheater.json F3; _engines/builder-canvas.json topIssue 2_
5. **MINOR** · motor · onbevestigd — De voortgangstoast wordt meegeschreven in de autosave; bij een herlaad binnen ongeveer twee seconden zou de toast permanent bovenaan blijven staan. _Bewijs: _engines/builder-canvas.json topIssue 4; geen enkele run heeft binnen dat tijdvenster herladen_
6. **MINOR** · motor · onbevestigd — Het resultatenscherm heeft geen opnieuw-proberen-uitweg bij minder dan 40%: er wordt geen onRetry meegegeven, dus die knop staat uit. Met deze config onbereikbaar, maar het wordt een dood eind zodra een config meer bonus of een lagere maxScore krijgt. _Bewijs: _engines/builder-canvas.json topIssue 5; niet reproduceerbaar in de runs_
7. **MINOR** · motor · onbevestigd — Twee verschillende manieren om de leerling te identificeren: de autosave gebruikt de sleutel van het ingestelde Supabase-project, de chat pakt de eerste beste sb-*-auth-token uit localStorage — op een gedeelde schoolcomputer kunnen die uiteenlopen. _Bewijs: _engines/builder-canvas.json topIssue 6; in geen enkele run getest_
8. **MINOR** · missie · weerlegd — De knop 'Missie voltooid! 🎉' op het resultatenscherm doet zichtbaar niets — dit is verwacht dev-preview-gedrag (onComplete is daar een no-op) en geen leerlingzichtbare bug in productie. _Bewijs: run-letterlijke-luca.json F4 (paginatekst woordelijk identiek); run-ipad-iris.json stap 10_

### Wat goed werkte
- Puur toetsenbordgeraas wordt consequent geweerd: 60x 'a' en 'aaaa aaaa...' hielden de voortgangsknop uitgeschakeld op elke geteste stap, ook na een geforceerde klik op de uitgeschakelde knop.
- Dubbelklikken op 'Volgende stap' geeft geen dubbele punten en slaat geen stap over: precies één stap vooruit, exact +25 punten.
- Herladen werkt in beide richtingen betrouwbaar: zonder reset blijven vinkjes, getypte tekst, stap én score behouden; met &reset=1 begint de missie gegarandeerd schoon op het introscherm.
- Geen console-fouten en geen mislukte netwerkverzoeken in de eerlijke playthrough en in de Playwright-run.
- Mobiel en tablet zijn schoon: 390, 820 en 1180 breed zonder horizontaal scrollen of overlap, raakvlakken >=44px, en op telefoonbreedte een nette tabbalk in plaats van gestapelde kolommen.
- Geen verklap: nergens staat het juiste antwoord, een volgorde-hint of een 'x van y goed'-teller vóór het invullen.
- De instructies zijn expliciet en lopen 1-op-1 met de checklist mee, plus duidelijke feedback per stap — een letterlijk lezende leerling loopt nergens vast op impliciete aannames.

### Reparatiekandidaten (niet uitgevoerd — ter beslissing)
| # | Wat | Waar | Omvang | Waarom |
|---|---|---|---|---|
| 1 | Inhoudelijke toets op de tekstantwoorden in plaats van alleen een vormpoort | motor | groot | Zolang de poort alleen lengte, woordaantal en unieke letters telt, levert vier keer een willekeurige zin dezelfde 100/100 als een serieuze uitwerking; de score zegt dan niets over wat de leerling kan. Vraagt een per-stap-toets (kernbegrippen of een rubric) en raakt alle 19 builder-canvas-missies. |
| 2 | Bewijsveld laat zien waaróm de tekst wordt afgekeurd | motor | klein | Nu blijft de knop uit terwijl de teller ruim boven het minimum staat — de leerling ziet geen uitweg. Het gewone tekstveld heeft de juiste hint al; die tekst hoeft alleen ook onder het bewijsveld te verschijnen. |
| 3 | De Engelse-taaleis in stap 4 controleerbaar maken of laten vallen | config | klein | Een eis die zowel in de instructie als in de checklist staat maar nooit gecontroleerd wordt, leert leerlingen dat vinkjes zetten genoeg is. Kies: eis schrappen, als vrijblijvende suggestie formuleren, of een minimale taalcontrole op stap 4 aanzetten. |
| 4 | Score en drempel betekenis geven | motor | middel | Met 4 x 25 punten en een eindscherm dat alleen bij volledige voortgang verschijnt, is 100% de enige uitkomst en meet de 40%-drempel niets. Ofwel de punten per stap laten meebewegen met de kwaliteit, ofwel het eindscherm ook bereikbaar maken bij onvolledige voortgang (mét opnieuw-proberen-uitweg, zie B6). |
| 5 | Voortgangstoast buiten de autosave houden | motor | klein | De toast is een tijdelijk signaal; hem meebewaren kan hem na een snelle herlaad permanent in beeld laten staan. Niet waargenomen in de runs, wel aannemelijk uit de code. |
| 6 | Eén bron voor de leerling-identiteit | motor | middel | Autosave en chat lezen de ingelogde leerling op twee verschillende manieren uit localStorage; op een gedeelde schoolcomputer kan dat uiteenlopen. Niet getest, maar de gevolgen (voortgang onder de verkeerde leerling) zijn ernstig genoeg om te beleggen. |

### Nog onzeker
- De AI-chat ('Open AI-assistent') is in geen enkele run geopend — de dev-preview wijst naar een dummy Supabase-URL. Chat-afhankelijk gedrag, de hint-kwaliteit en het mobiele overlap-risico met open chatpaneel zijn dus niet beoordeeld.
- B5 (blijvende toast), B6 (geen uitweg onder 40%) en B7 (twee identiteitsbronnen) komen uitsluitend uit de motoranalyse en zijn in geen enkele run gereproduceerd; ze tellen als onbevestigd, niet als blocker.
- Het introscherm is alleen op 820x1180 bekeken, niet ook liggend of op telefoonbreedte (de latere twee meetmomenten dekten wel beide formaten).
- De voortgangsknop meet precies 44px hoog — op de grens van de raakvlaknorm, niet eronder; of dat op een echt toestel prettig aantikt is niet vastgesteld.
- Tijdsduren in de runs zijn schattingen; twee runs meldden artefacten van de gedeelde browsersessie (tab-focus, compositing-timeouts) waardoor kliks deels via in-page el.click() zijn gedaan — telkens wel geverifieerd met echte DOM-statuswisselingen, dus geen missiebevinding.
