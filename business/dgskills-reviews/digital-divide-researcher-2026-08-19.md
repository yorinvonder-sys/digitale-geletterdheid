## Opdracht Live Check: digital-divide-researcher — J3P3 (motor data-viewer)

**Advies:** fix-eerst
**Risico:** Rood
**Getest als:** gesimuleerde leerlingen (serieuze baseline · sjoemelaar · worstelaar · iPad via Playwright) op de dev-previewroute, zonder login
**Datum:** 2026-08-19

### In één alinea
De missie laat leerlingen drie datasets over digitale ongelijkheid onderzoeken met grafieken en vragen. Een eerlijke leerling haalt exact 100/100 en verdient de badge Connectivity Expert. Een sjoemelaar die antwoorden kopieert of trefwoorden plakt komt niet door de 40%-grens: hij scoort 30/100, en puur gokken levert 0/100 op. Een worstelaar die eerlijk werkt blijft steken op 20/100 en komt daarna vast te zitten op een dood eindscherm waar de enige knop is uitgeschakeld. Het oordeel is fix-eerst: de missie-inhoud is goed, maar de motor blokkeert leerlingen die onder de 40% scoren permanent.

### Scores per profiel
| Profiel | Resultaat |
|---|---|
| Serieuze baseline | 100/100 (100%) — Gehaald, badge Connectivity Expert |
| Sjoemelaar | 30/100 (30%) met echo+stuffing+midden-gok; 0/100 (0%) bij pure gok |
| Worstelaar | 20/100 (20%) eerlijke poging; 0/100 (0%) gokproef |
| iPad (Playwright) | niet gemeten |

### Bevindingen
1. **BLOCKER** · motor · bevestigd — Een leerling die onder de 40% eindigt zit permanent vast op het eindscherm: de enige knop is uitgeschakeld, er is geen terugknop, en herladen brengt exact hetzelfde dode scherm terug. De knoptekst nodigt uit tot een herkansing die niet bestaat. _Bewijs: drie runs met DOM-check (disabled:true, 1 button) en herlaadtest; DataViewer.tsx:984-995 geen onRetry_
2. **MAJOR** · motor · bevestigd — Vraagtekst-echo en losse trefwoord-stuffing geven consequent halve punten (5/10) in plaats van volle punten, drie keer gemeten. De vraagteksten bevatten geen eigen zoekwoorden, dus de echo valt in de halve-punten-terugval. _Bewijs: cheater F1 stap 5+12, F2 stap 9; config regels 69,122,188_
3. **MAJOR** · motor · bevestigd — Open vragen belonen onzekere, inhoudsarme zinnen mild: een 'misschien denk ik'-zin met twee trefwoorden kreeg volle punten, andere onzekere zinnen kregen de helft. Getalvragen geven daarentegen hard 0 bij één kolom- of staafverwisseling. _Bewijs: struggler F3 stap 4 vol, stap 7+9 half; F4 stap 3+5 nul_
4. **MINOR** · motor · bevestigd — Meerkeuze-opties worden nooit gehusseld; in deze missie stond het juiste antwoord 1 van de 2 keer op de verwachte middenpositie. De midden-gok werkte dus deels, maar dit valt onder een vlootbreed motorprobleem. _Bewijs: cheater F4 stap 3 goed, stap 11 fout; verdeling {0:2,1:20,2:19,3:2}_
5. **MINOR** · missie · weerlegd — Er verschijnt geen verdiepingsvraag in de drie datasets, maar dit is een bewuste configkeuze, geen motorfout. _Bewijs: config bevat geen followUp-velden in alle drie datasets_
6. **MINOR** · missie · bevestigd — De meerkeuzevraag in dataset 3 vereist samengestelde redenering (combinatie-antwoord 'B en C zijn allebei juist'); zowel baseline als worstelaar vonden dit het lastigste moment. Geen bug: de uitleg na bevestigen is helder. _Bewijs: baseline F5 stap 10; struggler stap 8; config regels 172-181_

### Wat goed werkte
- Een eerlijke leerling haalt exact 100/100: alle 8 vragen over 3 datasets scoorden correct met inhoudelijke uitleg per antwoord
- Pure gokstrategie levert een eerlijke 0/100 op — drie keer onafhankelijk bevestigd; lukraak doorklikken wordt niet beloond
- Degeneratie-bescherming werkt: onder 8 woorden blijft de Bevestigknop uitgeschakeld en herhaald-woord-tekst scoort 0 zonder de voortgang te blokkeren
- Herlaad-persistentie van een actieve poging is exact: 15 punten en dataset-positie precies hersteld, niet verdubbeld en niet gereset; &reset=1 geeft betrouwbaar een schone herstart
- Niets wordt vooraf verklapt: juiste antwoorden en uitleg verschijnen pas ná Bevestigen, er is nergens een 'x van y goed'-teller
- Geen console-fouten en geen netwerkafhankelijkheid in het scorepad — de missie draait volledig client-side, chat staat uit
- Staafgrafiekwaarden staan als permanent zichtbare labels boven elke staaf — toegankelijk zonder hover, zonder het antwoord op de vraag zelf te lekken

### Reparatiekandidaten (niet uitgevoerd — ter beslissing)
| # | Wat | Waar | Omvang | Waarom |
|---|---|---|---|---|
| 1 | Geef onRetry door aan CompletionScreen in DataViewer en wis de opslag bij herkansing | motor | klein | Heft de permanente doodlopende weg onder 40% op; het patroon bestaat al in DebateArena. Lost meteen de tegenstrijdige knoptekst op. Geldt voor alle 15 data-viewer-missies. |
| 2 | Scherp de halve-punten-terugval van scoreObservation aan zodat vraagtekst-echo en losse trefwoord-stuffing 0 scoren | motor | middel | 5/10 gratis punten per observatievraag voor kopieer-plakwerk, drie keer gemeten; in configs waar de vraagtekst wél een eigen keyword bevat kan het lek volgens de motoranalyse zelfs vol scoren. |
| 3 | Hussel MC-opties bij rendering of herverdeel de juiste-antwoordposities over de data-viewer-configs | motor | middel | Vlootbreed staat 91% van de juiste antwoorden op de middelste twee posities; 'nooit de buitenste' halveert het gokwerk over vijftien missies. |
| 4 | Toon een uitleg hoe de leerling verder komt wanneer de welzijnsmonitor het bevestigen blokkeert bij missies zonder chat | motor | klein | Engine-bevinding: Bevestigen doet stil niets bij enableChat:false. In geen run gespeeld, dus alleen code-geverifieerd — maar het codepad is eenduidig. |

### Nog onzeker
- mobiel/tablet niet gemeten — Playwright is op verzoek van Yorin uitgeschakeld (venster stal focus)
- De welzijnsmonitor-blokkade (Bevestigen doet stil niets bij enableChat:false) is in geen enkele run gespeeld — alleen code-geverifieerd, telt hier niet als bevestigde blocker
- Cheater-F4 meldt 'midden-gok werkte 2 van de 3 keer', maar de eigen steps tonen maar 2 MC-vragen in deze missie; aangehouden als 1 van 2 — de '2 van 3'-telling is niet uit het bewijs te herleiden
- Vraagtekst-echo mét extra uitleg-achtige padding is niet getest; omdat topicOverlap ook tegen q.explanation meet, kan een leerling die méér tekst plakt mogelijk alsnog de volle punten halen
- Of het motorlek 'echo scoort vol' in andere data-viewer-configs (waar de vraagtekst wél een keyword bevat) nog bestaat, is hier niet speler-geverifieerd — de halve-punten-uitkomst is alleen voor deze missie bewezen
