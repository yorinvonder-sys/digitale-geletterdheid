## Opdracht Live Check: data-pipeline — J3P1 (motor data-viewer)

**Advies:** fix-eerst
**Risico:** Rood
**Getest als:** gesimuleerde leerlingen (serieuze baseline · sjoemelaar · worstelaar · iPad via Playwright) op de dev-previewroute, zonder login
**Datum:** 2026-08-19

### In één alinea
De missie laat leerlingen drie datasets opschonen en analyseren. Een goede leerling haalt de volle 100 punten, en blind gokken levert nul op. Maar een sjoemelaar haalt 95 punten zonder enige analyse, puur door trefwoorden te noemen en de middelste antwoordopties te kiezen. Een worstelaar haalt net de helft en dreigt vast te lopen op de lange teksten van dataset 3. Het grootste probleem zit in de motor: wie onder de 40% eindigt, zit permanent vast op een eindscherm zonder uitweg.

### Scores per profiel
| Profiel | Resultaat |
|---|---|
| Serieuze baseline | 100/100 (100%) eerlijk; gokproef 0/100 (0%) |
| Sjoemelaar | 95/100 (95%) met aflees- en trefwoord-exploits; zak-scenario 0/100 (0%) |
| Worstelaar | 50/100 (50%) Gehaald; gokproef 0/100 (0%) |
| iPad (Playwright) | 100/100 (100%) eerlijk op 820x1180 |

### Bevindingen
1. **BLOCKER** · motor · bevestigd — Een leerling die onder de 40% scoort zit permanent vast op het eindscherm: de enige knop is uitgeschakeld, er is geen terugknop, en herladen toont hetzelfde dode scherm. Dit geldt voor alle 15 data-viewer-missies. _Bewijs: drie runs meten button.disabled===true; DataViewer.tsx:984-995 geen onRetry, CompletionScreen.tsx:163-166 disabled={!passed && !onRetry}_
2. **MAJOR** · motor · bevestigd — Open vragen zijn te sjoemelen: een kale lijst losse trefwoorden zonder samenhangende zin scoorde tweemaal de volle 10 punten. De check meet alleen of losse woorden voorkomen, niet of er een gedachte staat. _Bewijs: 'extract transform load stap sensordata opschonen' → 'Goed opgeschreven! +10 punten'; DataViewer.tsx:253-292_
3. **MAJOR** · motor · bevestigd — Meerkeuzevragen worden nooit gehusseld en de juiste antwoorden staan alle drie in de middelste twee posities. Motorbreed staat 91% van de juiste antwoorden op positie 1 of 2, dus 'nooit de buitenste twee' halveert het gokwerk. _Bewijs: configs/data-pipeline.ts:57-64 (index 2), :113-120 (index 1), :179-186 (index 1); DataViewer.tsx:400 geen shuffle_
4. **MAJOR** · missie · bevestigd — Dataset 3 plaatst vier lange strategie-tekstblokken vóór de eerste vraag, zonder tussentijdse interactie. De worstelaar sloeg de uitleg over en scande alleen koppen en emoji's. _Bewijs: run-afgeleide-amir.json F2 (stap 10-12: uitleg overgeslagen)_
5. **MAJOR** · missie · bevestigd — Drie giveaways maken de missie grotendeels een leestaak: de 'Probleem?'-kolom labelt elk defect, de staafgrafiek toont waarden als tekst, en het juiste MC-antwoord staat bijna woordelijk in de uitleg erboven. _Bewijs: run-creatieve-cheater.json F4/F5; configs/data-pipeline.ts:179-186_
6. **MINOR** · motor · onbevestigd — Raakt een observatie de welzijnsmonitor, dan doet 'Bevestigen' stil niets bij missies zonder chat. De leerling ziet dan geen uitleg dat hij zijn tekst moet aanpassen. _Bewijs: DataViewer.tsx:905-914; geen enableChat in config; geen enkele run raakte de monitor_
7. **MINOR** · motor · onbevestigd — Zonder login valt de autosave-sleutel terug op een gedeelde naam zonder gebruikers-ID; twee uitgelogde leerlingen op dezelfde computer zouden elkaars voortgang zien. Alleen uit code afgeleid. _Bewijs: useMissionAutoSave.ts:213-216_
8. **MINOR** · motor · bevestigd — De 5%-tolerantie op getalvragen is ongelijk streng: bij antwoord 5 telt 4,75-5,25 mee, bij 26,2 telt ook 26 of 27 goed. _Bewijs: DataViewer.tsx:311-320; configs/data-pipeline.ts:48 en :104_
9. **MINOR** · motor · weerlegd — De motorclaim dat het terugplakken van de vraagtekst volle punten oplevert, klopt niet voor deze missie: het gaf tweemaal slechts 5 van 10 punten. Het lek bestaat wel, maar loopt via trefwoord-stuffing, niet via echo. _Bewijs: run-letterlijke-luca.json F1 (echo → 'Goed begin — +5 van 10'); keywords staan niet in de vraagteksten_
10. **MINOR** · motor · weerlegd — 'Terug', 'Vorige dataset' en 'Missie voltooid!' doen zichtbaar niets — dit is bekend testomgeving-gedrag, geen missiefout. Ook de bevroren kaart die de startknop leek te blokkeren was een artefact van het testpaneel; via Playwright startte alles normaal. _Bewijs: run-ipad-iris.json I1; DevMissionPreview.tsx:96-97_

### Wat goed werkte
- Eerlijk spelen levert exact de volle score: 100/100 in twee onafhankelijke runs, met een kloppende puntentelling 40+35+25.
- Blind gokken levert nul op: in drie onafhankelijke gokproeven kwam telkens 0/100 uit; herhaalde tekens worden geweigerd en de eerste MC-optie was elke keer fout.
- Foutfeedback is inhoudelijk sterk: bij een fout verschijnt het juiste antwoord mét berekening, wat een afgeleide leerling direct terug op de rails helpt.
- Geen dubbelscoor- of herkansingsexploits: dubbelklikken gaf precies één keer punten, en terugbladeren toont alleen read-only feedback.
- Opslag en hervatten werken zoals bedoeld: herladen komt terug op dezelfde dataset met dezelfde score; &reset=1 geeft een schone start.
- Niets wordt vooraf verklapt: het juiste antwoord verschijnt pas ná bevestigen, en er is geen 'x van y goed'-teller vooraf.
- Tablet/mobiel is schoon: geen horizontaal scrollen op drie formaten, alle raakdoelen ruim boven 44px, grafiekwaarden als vaste labels, 0 console-fouten, volledig client-side.
- Woordenteller bij observatievragen maakt zichtbaar waarom de knop nog uit staat.

### Reparatiekandidaten (niet uitgevoerd — ter beslissing)
| # | Wat | Waar | Omvang | Waarom |
|---|---|---|---|---|
| 1 | Geef DataViewer een onRetry aan CompletionScreen en wis de opgeslagen results-fase bij een gezakte poging | motor | klein | Heft de enige blocker op: een leerling onder de 40% kan nu niet opnieuw beginnen en zit ook na herladen vast. DebateArena geeft onRetry al mee, dus het patroon bestaat — dit repareert alle 15 data-viewer-missies tegelijk. |
| 2 | Laat de observatiescore een samenhangende zin eisen in plaats van losse trefwoorden | motor | middel | Een kale trefwoordenlijst scoort nu tweemaal de volle punten, waardoor de open vragen de goedkoopste punten van de missie zijn. |
| 3 | Husselen van meerkeuze-opties, of de juiste antwoorden over alle vier de posities verdelen | motor | middel | De juiste antwoorden staan op index 2, 1 en 1, en motorbreed op 91% in de middelste twee posities. 'Nooit de buitenste twee' halveert het gokwerk. |
| 4 | Dataset 3 opknippen: strategie-uitleg per strategie tonen of achter een uitklap zetten, met één korte controlevraag tussendoor | config | middel | Vier lange tekstblokken achter elkaar is het punt waar de afgeleide leerling stopt met lezen en alleen nog koppen scant. |
| 5 | Giveaways dichten in de drie datasets | config | middel | De 'Probleem?'-kolom labelt de antwoorden, de grafieklabels maken de verschilvraag kale aftrekking, en de strategie-uitleg bevat bijna woordelijk het juiste MC-antwoord — de missie meet vooral leesvaardigheid. |
| 6 | Bij een geblokkeerde welzijnsobservatie een zichtbare uitleg tonen in missies zonder chat | motor | klein | Data-pipeline heeft geen enableChat; raakt een observatie de monitor, dan doet 'Bevestigen' stil niets. Niet in de runs waargenomen, dus eerst reproduceren. |

### Nog onzeker
- Het zak-scenario is niet op tablet/telefoon geverifieerd: de iPad-testpersoon scoorde 100%, dus of het dode eindscherm op een iPad hetzelfde oogt staat niet vast.
- De filterrij boven de tabel van dataset 1 is niet op 390x844 gemeten; de mobiele checkpoints vielen op dataset 2 en het eindscherm.
- De welzijnsmonitor is in geen enkele run geraakt, dus de stille-blokkade-bevinding is voor deze missie onbevestigd.
- Het herstelscherm 'Deze missie is bijgewerkt sinds je laatste bezoek' kon niet getest worden zonder de config te wijzigen.
- De gedeelde autosave-sleutel zonder gebruikers-ID is alleen uit de code afgeleid; twee uitgelogde leerlingen op één computer is niet nagespeeld.
- Het gedrag van het schermtoetsenbord op een fysieke iPad is met Playwright niet waarneembaar.
- De exacte scoreformule van observatievragen is niet losstaand teruggerekend; alleen de zichtbare uitkomsten (0 / halve / volle punten) zijn waargenomen.
