## Opdracht Live Check: ml-trainer — J3P1 (motor data-viewer)

**Advies:** fix-eerst
**Risico:** Rood
**Getest als:** gesimuleerde leerlingen (serieuze baseline · sjoemelaar · worstelaar · iPad via Playwright) op de dev-previewroute, zonder login
**Datum:** 2026-08-19

### In één alinea
De missie laat leerlingen drie datasets verkennen met grafieken en vragen over spamherkenning en nauwkeurigheid. Een goede leerling haalt 95 van de 100 punten, maar de laatste 5 punten zijn alleen te pakken door de vraag na te praten in plaats van het beter uit te leggen. Een sjoemelaar komt met alle geteste trucs niet door de 40%-grens heen. Een taalzwakke leerling haalt precies 40% en zit daarmee op de rand: wie iets zwakker is, eindigt onder de grens en zit vast op een dood eindscherm zonder uitweg. Het oordeel is daarom fix-eerst: de vastloper onder de 40% en de oneerlijke score op open vragen moeten eerst opgelost worden.

### Scores per profiel
| Profiel | Resultaat |
|---|---|
| Serieuze baseline | 95/100 (95%) — Gehaald (40/40, 30/35, 25/25); gokproef met eerste optie/fout getal/herhaalde tekst gaf 0/100 (0%) |
| Sjoemelaar | 5/100 (5%) — Nog niet gehaald (0/40, 5/35, 0/25); de enige punten kwamen uit één geparafraseerde vraagtekst (5/10) |
| Worstelaar | 40/100 (40%) — precies Gehaald (10/40, 5/35, 25/25); knop 'Missie voltooid!' actief |
| iPad (Playwright) | 95/100 (95%) — Gehaald bij eerlijk spel (Playwright, 820x1180); apart zak-scenario 0/100 (0%) |

### Bevindingen
1. **BLOCKER** · motor · bevestigd — Een leerling die onder de 40% eindigt zit permanent vast op het eindscherm: de enige knop is uitgeschakeld, er is geen terug- of opnieuw-knop, en herladen geeft hetzelfde dode scherm. Alleen een volwassene die handmatig een reset-code aan de URL plakt kan een nieuwe poging starten. _Bewijs: run-digisterke-dani.json F1 (btnDisabled:true); run-ipad-iris.json I1 BEVESTIGD; DataViewer.tsx:984-995 (geen onRetry)_
2. **MAJOR** · motor · bevestigd — Open tekstvragen worden gescoord op woordoverlap met de vraagtekst, niet op inhoudelijke juistheid. Een compleet en correct antwoord in eigen woorden krijgt de helft van de punten; hetzelfde antwoord met één sleutelwoord uit de vraag krijgt de volle punten. _Bewijs: run-digisterke-dani.json F2 (q6 correct → 5/10; q8 met vaktermen → 10/10); DataViewer.tsx:253-292 topicOverlap_
3. **MAJOR** · missie · bevestigd — De trefwoordenlijst van de accuracy-vraag bestaat uit meta-woorden ('context', 'afhankelijk', 'toepassing') die een concreet antwoord niet hoeft te bevatten. Daardoor eindigt deze vraag in drie van de vier runs op halve punten, ook bij de sterkste spelers. _Bewijs: configs/ml-trainer.ts:132-137 (keywords ['context','afhankelijk','toepassing',...]); run-digisterke-dani.json stap 3_
4. **MAJOR** · motor · onbevestigd — De volledige vraagtekst plus uitleg letterlijk terugplakken zou volle punten geven op elke open vraag, waarmee een sjoemelaar zonder inhoud over de 40%-drempel zou komen. Dit is voor deze missie niet nagespeeld; alleen een parafrase is getest en die gaf de helft van de punten. _Bewijs: _engines/data-viewer.json topIssues[1]; run-creatieve-cheater.json F2 (alleen parafrase getest → 5/10)_
5. **MAJOR** · motor · onbevestigd — Als een antwoord door de welzijnsmonitor wordt tegengehouden, doet 'Bevestigen' bij missies zonder chat stil niets — de leerling ziet een melding maar niet dat hij zijn tekst moet aanpassen. Geen enkele run heeft dit pad geprobeerd. _Bewijs: _engines/data-viewer.json topIssues[3] (DataViewer.tsx:905-914); configs/ml-trainer.ts bevat geen enableChat_
6. **MINOR** · motor · bevestigd — Meerkeuze-opties worden nooit gehusseld en staan altijd in vaste volgorde. In deze missie staat het juiste antwoord op posities 2, 4 en 2 van 4, dus de gokheuristiek 'nooit de buitenste optie' werkt hier maar beperkt. _Bewijs: _engines/data-viewer.json topIssues[2] (geen shuffle); configs/ml-trainer.ts:68, :113, :189; run-creatieve-cheater.json stappen 3, 6, 10_
7. **MINOR** · motor · weerlegd — De anti-gokbescherming op open vragen werkt: herhaalde tekens en 'weet niet'-antwoorden geven consequent 0 punten met de melding 'Dit telt nog niet mee'. Een volledige gokdoorloop eindigde exact op 0/100. _Bewijs: run-digisterke-dani.json F3 (gokproef 0/40, 0/35, 0/25); run-taalzwakke-tess.json scoreGuess 0/100_
8. **MINOR** · motor · weerlegd — De claim dat de Start-knop niet aanklikbaar is omdat de KEES-tekstballon eroverheen ligt, klopt niet. In een zichtbare tab met lopende animatie wijst het middelpunt van de knop naar de knop zelf, en een gewone tik opent dataset 1 — op alle drie de geteste formaten. _Bewijs: run-ipad-iris.json verified[1] WEERLEGD (elementFromPoint = mission-start); run-taalzwakke-tess.json F1 (artefact)_
9. **MINOR** · missie · bevestigd — De spam-voorspellervraag heeft een sterke afleider: 'Heeft link' klinkt herkenbaarder dan het juiste antwoord, en de uitleg zwakt de eigen sleutel af. Zowel de sjoemelaar als de taalzwakke leerling koos hier de afleider. _Bewijs: configs/ml-trainer.ts:57-72 (opties + explanation); run-taalzwakke-tess.json F3; run-creatieve-cheater.json stap 3_
10. **MINOR** · missie · bevestigd — De feedback na een fout antwoord is lang en zit vol vaktaal ('procentpunt', 'feature engineering', 'scheve datasets') zonder opsomming of voorbeeld. Voor een taalzwak profiel is dat een drempel om de uitleg echt te lezen. _Bewijs: run-taalzwakke-tess.json F5; configs/ml-trainer.ts:70, :127, :191 (3-4 zinnen vaktaal)_
11. **MINOR** · motor · onbevestigd — Zonder ingelogde sessie delen twee uitgelogde leerlingen op dezelfde computer elkaars voortgang, omdat de opslagsleutel geen gebruikerscode bevat. Niet getest in deze runs, maar relevant omdat het samen met de vastloper ook leerling B kan raken. _Bewijs: _engines/data-viewer.json topIssues[5] (useMissionAutoSave.ts:213-216); geen run met twee accounts_
12. **MINOR** · motor · weerlegd — Geen consolefouten en geen gefaalde netwerkrequests in drie runs; scoring werkt volledig op de computer van de leerling, hervatten na herladen werkt, en op iPad en telefoon is er geen paginascroll met tapdoelen ruim boven 44px. Enige krapte: op 390px wrapt de filterrij naar 3 regels, maar die overflow is onzichtbaar gemaakt. _Bewijs: run-ipad-iris.json viewports + stappen 7-9; run-digisterke-dani.json stap 11-12 en reloadTest_

### Wat goed werkte
- De hele route is speelbaar en logisch: intro → 3 datasets → eindscherm, met duidelijke voortgangsmarkers en een 'Volgende dataset'-knop die pas verschijnt als alle vragen bevestigd zijn — in vier runs zonder één vastloper tot aan het eindscherm.
- Anti-gok werkt: herhaalde tekens, 'weet niet'-varianten, overal de eerste optie en een fout getal leveren samen exact 0/100 op.
- Geen giveaways: geen 'x van y goed'-teller, geen vooraf gemarkeerd juist antwoord; het juiste antwoord verschijnt pas ná bevestigen, mét uitleg.
- Dubbelklikken op 'Bevestigen' geeft geen dubbele punten of foutmelding.
- De data is leesbaar zoals bedoeld: de staafgrafiek toont altijd zichtbare waardelabels, zodat de grafiekvragen zonder hover of zoom te beantwoorden zijn.
- Open vragen belonen eigen, eenvoudige taal: ook de taalzwakke leerling haalde 10/10 met korte zinnen zonder vaktaal.
- Hervatten en resetten werken allebei: herladen bewaart de voortgang exact, een reset-code geeft altijd een schone intro.
- Techniek schoon: geen consolefouten, geen gefaalde netwerkrequests, scoring volledig op de computer van de leerling.
- Mobiel/tablet in orde: geen paginascroll op drie formaten; tapdoelen ruim boven 44px; alles met tikken bedienbaar.
- De 40%-drempel, de badge-niveaus en de per-dataset-uitsplitsing op het eindscherm rekenden in alle runs exact goed.

### Reparatiekandidaten (niet uitgevoerd — ter beslissing)
| # | Wat | Waar | Omvang | Waarom |
|---|---|---|---|---|
| 1 | Geef de leerling na een onvoldoende een weg terug op het eindscherm | motor | klein | Nu is de enige knop uitgeschakeld zodra je onder de 40% eindigt en brengt herladen je terug op hetzelfde dode scherm; een opnieuw-proberen-pad haalt de enige echte blocker weg. |
| 2 | Score open vragen op inhoud in plaats van op woordoverlap met de vraag | motor | middel | Nu wordt de vraag napraten beloond en een beter geformuleerd eigen antwoord bestraft met halve punten — didactisch omgekeerd. |
| 3 | Herzie de trefwoorden van de accuracy-vraag (dataset 2, q6) | config | klein | De huidige lijst bestaat uit meta-woorden die een correct antwoord niet hoeft te bevatten; trefwoorden die passen bij wat een goed antwoord echt zegt lossen dit grotendeels op. |
| 4 | Zet het juiste meerkeuze-antwoord niet vast op een voorspelbare positie | motor | middel | Opties worden nooit gehusseld; motorbreed staat 91% van de juiste antwoorden op de middelste twee posities, wat het gokwerk halveert. |
| 5 | Toon een zichtbare melding als een antwoord door de welzijnsmonitor wordt tegengehouden | motor | klein | Bij missies zonder chat doet 'Bevestigen' dan stil niets; het risico is een harde vastloper op een open vraag. |
| 6 | Maak de foutfeedback korter en visueler | config | klein | De uitleg staat nu als vier zinnen vaktaal achter elkaar; een korte kernzin met een opsomming maakt dat leesbaar voor het profiel dat de uitleg het hardst nodig heeft. |
| 7 | Scherp de spam-voorspellervraag en zijn uitleg aan | config | klein | De afleider 'Heeft link' trekt onterecht de aandacht en de uitleg zwakt de eigen sleutel af. |

### Nog onzeker
- De volledige vraagtekst-echo (vraag plus uitleg letterlijk terugplakken) is in deze missie nooit geprobeerd; alleen een parafrase, die de helft van de punten gaf. De motorclaim dat dit volle punten geeft blijft dus onbevestigd.
- Het welzijnsmonitor-pad (een antwoord dat de monitor triggert bij een missie zonder chat) is door geen enkele run getest.
- De baseline-run rapporteert een antwoord dat volgens de eigen samenvatting 'context bepaalt' bevatte en tóch 5/10 kreeg; dat strookt niet met de trefwoordlogica. Waarschijnlijk is de rapportzin een samenvatting, maar de exacte invoertekst is niet vastgelegd.
- Alle runs liepen via de ontwikkelroute zonder ingelogde sessie; het gedrag in de echte, ingelogde omgeving is niet apart geverifieerd.
- De opslagbotsing tussen twee uitgelogde leerlingen op één computer is niet nagespeeld.
- De steekproef voor de meerkeuze-positiebias is met 3 vragen te klein om de motorbrede bevinding voor deze missie te bevestigen of te weerleggen.
- Op 390x844 viel de Start-knop bij één meting net buiten de gerapporteerde vensterhoogte; na scrollen was hij gewoon tapbaar, maar of dit een klein obstakel is of een meetartefact is niet vastgesteld.
