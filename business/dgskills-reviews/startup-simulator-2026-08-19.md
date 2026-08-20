## Opdracht Live Check: startup-simulator — J3P3 (motor builder-canvas)

**Advies:** fix-eerst
**Risico:** Geel
**Getest als:** gesimuleerde leerlingen (serieuze baseline · sjoemelaar · worstelaar · iPad via Playwright) op de dev-previewroute, zonder login
**Datum:** 2026-08-19

### In één alinea
De missie laat leerlingen een startup-idee uitwerken in vier stappen. Een eerlijke leerling haalt zonder moeite de volle punten, ook met korte simpele zinnen. Een sjoemelaar haalt echter ook 100/100 door één irrelevante zin overal te plakken en alle vakjes aan te vinken. Een taalzwakke leerling loopt nergens hard vast, maar krijgt bij het bewijsveld geen uitleg waarom de knop uit blijft. De kwaliteitspoort controleert alleen vorm, niet inhoud, en het 'Gehaald'-label zegt daardoor weinig.

### Scores per profiel
| Profiel | Resultaat |
|---|---|
| Serieuze baseline | 100/100 (100%), Gehaald — eerlijk |
| Sjoemelaar | 100/100 (100%), Gehaald — met één inhoudsloze zin hergebruikt in alle velden |
| Worstelaar | 100/100 (100%), Gehaald — eerlijk, in korte simpele zinnen |
| iPad (Playwright) | niet gemeten |

### Bevindingen
1. **MAJOR** · motor · bevestigd — De kwaliteitspoort controleert alleen of tekst lang genoeg is en een echte zin lijkt, niet of de inhoud klopt. Eén irrelevante zin, overal hergebruikt, geeft dezelfde 100/100 als een doordacht antwoord. _Bewijs: cheater-run: 4×25/25 met één hergebruikte zin; engine answerQuality.ts:51-56_
2. **MAJOR** · motor · bevestigd — Het bewijsveld meldt 'voldaan' bij voldoende lengte, maar de knop blijft uit zonder uit te leggen waarom. Het hoofdveld geeft in dezelfde situatie wél een duidelijke hint. _Bewijs: struggler-run: '54/45' + knop uit, geen hint; StepInstructionPanel.tsx:195-202_
3. **MAJOR** · motor · bevestigd — De 40%-drempel kan niet falen: het resultatenscherm is alleen bereikbaar als alle stappen compleet zijn, dus afronden betekent altijd 100%. Het 'Gehaald'-label meet niets. _Bewijs: cheater-run: geen route naar resultaat met onvolledige stap; BuilderCanvas.tsx:216-223_
4. **MAJOR** · missie · bevestigd — De opdracht gebruikt veel vakjargon (painkiller, freemium, USP, traction) en stap 4 stapelt zes checklist-items met timings. Voor A2-B1-lezers is dat veel leeswerk in één keer; sommige termen krijgen uitleg, andere niet. _Bewijs: struggler-run F1/F6; config startup-simulator.ts:27,48-49,64-65,80-88_
5. **MINOR** · motor · onbevestigd — Een melding kan blijven hangen als de leerling binnen twee seconden na een stapovergang herlaadt. Niet gereproduceerd in de drie runs. _Bewijs: engine topIssues[3] (BuilderCanvas.tsx:76,229-234); niet getest in runs_

### Wat goed werkte
- Vorm-poorten houden stand: herhaalde tekens en toetsenbordgeramte worden geblokkeerd, ook met alle checklistvakjes aan.
- Geen UI-trucjes mogelijk: dubbelklikken, teruglopen of opnieuw doorlopen geeft geen dubbele punten.
- Herladen is betrouwbaar: midden in de missie en op het resultaat komt exact dezelfde staat terug.
- Geen verklapte antwoorden: geen voorbeeldantwoord, geen teller, geen badge vooraf zichtbaar.
- Het hoofdtekstveld geeft bij onzin-invoer een duidelijke kwaliteitshint.
- Console en netwerk schoon in alle runs; eerlijke leerlingen halen zonder frictie 100/100.

### Reparatiekandidaten (niet uitgevoerd — ter beslissing)
| # | Wat | Waar | Omvang | Waarom |
|---|---|---|---|---|
| 1 | Blokkeer letterlijk of bijna-letterlijk hergebruik van dezelfde tekst over velden en stappen heen | motor | klein | De goedkoopste sjoemelroute verdwijnt zonder dat eerlijke leerlingen er iets van merken; haalt de scherpste kant van B1 eraf |
| 2 | Inhoudelijke relevantiecheck op tekstantwoorden (kernwoorden per stap of server-side beoordeling) | motor | groot | Kernprobleem B1: zolang inhoud niet meeweegt zijn eerlijke en gesjoemelde 100/100 niet te onderscheiden |
| 3 | Toon bij het bewijsveld dezelfde kwaliteitshint als bij het hoofdveld zodra de lengte gehaald is maar de betekenisvolheid faalt | motor | klein | B2: de teller oogt als 'voldaan' terwijl de knop dicht blijft zonder uitleg — misleidend voor taalzwakke leerlingen |
| 4 | Maak het 'Gehaald'-label betekenisvol of pas de pass/fail-framing aan nu afronden per definitie 100% oplevert | motor | middel | B3: de 40%-drempel kan nooit falen; een label dat altijd 'Gehaald' zegt meet niets |
| 5 | Verlaag de taaldrempel: leg USP, transactiekosten en licenties kort uit en splits of vereenvoudig de 6-delige checklist van stap 4 | config | klein | B4: hoge jargondichtheid en veel leeswerk in één keer voor A2-B1-lezers |

### Nog onzeker
- Mobiel/tablet niet gemeten — Playwright is op verzoek van Yorin uitgeschakeld (venster stal focus).
- AI-assistent/chat in geen van de drie runs geopend — optioneel voor voltooiing; scoring hangt er volgens het engine-rapport niet van af, maar dit is niet live bevestigd.
- Milestone-toast-herlaadbug (B5) alleen als motorclaim met code-evidence; niet in deze runs gereproduceerd.
- Bij de terugloop-test van de cheater is één doorgaan-klik via een in-page klik gedaan i.p.v. een muisklik; het zichtbare effect kwam overeen maar is niet met een event-probe bevestigd.
