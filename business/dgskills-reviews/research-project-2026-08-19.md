## Opdracht Live Check: research-project — J3P4 (motor data-viewer)

**Advies:** fix-eerst
**Risico:** Rood
**Getest als:** gesimuleerde leerlingen (serieuze baseline · sjoemelaar · worstelaar · iPad via Playwright) op de dev-previewroute, zonder login
**Datum:** 2026-08-19

### In één alinea
Deze missie laat leerlingen een onderzoeksopzet beoordelen aan de hand van een tabel, grafiek en leestekst. Een serieuze leerling haalt 95 van de 100 punten, maar verliest 5 punten op een onduidelijk geformuleerde tweeledige vraag. Een sjoemelaar die de data niet leest, haalt 55% en krijgt daarmee het predicaat 'Gehaald' plus een badge. Een worstelaar die alleen koppen leest, strandt op 5% en zit permanent vast op een eindscherm dat ten onrechte een herkansing belooft. Het oordeel is daarom rood: de missie is speelbaar voor sterke leerlingen, maar de motor heeft een blokkerende valkuil en de config maakt gokken te makkelijk.

### Scores per profiel
| Profiel | Resultaat |
|---|---|
| Serieuze baseline | 95/100 (95%) — Gehaald; enige verlies: -5 op de tweeledige vraag q8 |
| Sjoemelaar | 55/100 (55%) — 'Gehaald' + badge 'Kritisch Denker' via middenpositie-gok (alle 3 MC goed) + vraagtekst-echo (3x +5/10), zonder de data te lezen; blinde gokproef (eerste optie + onzin): 0/100 |
| Worstelaar | 5/100 (5%) — 'Nog niet gehaald', permanent vast op dood eindscherm; gokproef 0/100 |
| iPad (Playwright) | niet gemeten |

### Bevindingen
1. **BLOCKER** · motor · bevestigd — Een leerling die onder de 40% eindigt zit permanent vast op het eindscherm: de enige knop is uitgeschakeld, er is geen terugknop, en na herladen komt de leerling op hetzelfde dode scherm terug. De tekst 'Probeer 'm gerust nog eens' belooft een herkansing die niet bestaat. _Bewijs: DOM-check bij 0%, 0% en 5%; engine: geen onRetry in DataViewer, knop disabled zonder onRetry_
2. **MAJOR** · missie · bevestigd — Alle 3 juiste meerkeuze-antwoorden staan op de middelste posities, en de meerkeuzepunten tellen op tot precies 40/100. Een gok op de middelste positie haalt daarmee in z'n eentje al de 40%-drempel ('Gehaald'), en met vraagtekst-echo erbij 55%. _Bewijs: cheater 3/3 MC correct via positiegok, eindscherm 55/100; config: juiste antwoorden op index 2, 2 en 1_
3. **MAJOR** · motor · bevestigd — Meerkeuze wordt nooit gehusseld en het juiste antwoord staat vrijwel altijd in de middelste twee posities (91% van de gevallen). 'Kies nooit de buitenste optie' is daarmee een leerbaar patroon dat het gokwerk halveert. _Bewijs: engine-meting {0:2,1:20,2:19,3:2} van 43; deze missie bevestigt het patroon (3/3 in de middelste twee)_
4. **MAJOR** · missie · bevestigd — De tweeledige vraag q8 ('noem één beperking EN beschrijf een verbetering') vraagt twee dingen in één tekstveld zonder visuele scheiding. Wie alleen het eerste deel beantwoordt krijgt stil 5/10, en de feedback benoemt nergens dat het tweede deel ontbreekt. _Bewijs: baseline -5 (enige gemiste punten); worstelaar haalde zijn enige 5 punten hiervandaan; config: één tekstveld, tweeledig geformuleerd_
5. **MINOR** · motor · weerlegd — De eerder gemelde 'vraagtekst-echo geeft volle punten' geldt hier NIET: de keywords staan niet in de vraagteksten, dus echo scoort consistent halve punten (3x +5/10). Nog steeds een lek (5/10 voor nul begrip), maar geen volle punten. _Bewijs: cheater 3x +5/10, nooit meer; config: keywords komen niet in de vraagteksten voor_
6. **MINOR** · motor · bevestigd — Staafgrafiekwaarden staan permanent als tekst boven elke staaf (bewuste toegankelijkheidsreparatie), waardoor het antwoord op 'hoogste/laagste'-vragen direct afleesbaar is zonder de vraag te begrijpen. _Bewijs: cheater beantwoordde q4 correct via zichtbaar label 'Meta-analyse: 95' vóór enige interactie_
7. **MINOR** · motor · bevestigd — Onzin- en degeneratie-invoer ('aaaa'x8, vaag off-topic) scoort consequent 0 punten met de melding 'Dit telt nog niet mee' — nooit de helft. De blinde gokproef eindigde 3x op 0/100. _Bewijs: 3 runs, meerdere pogingen, allemaal 0 punten_

### Wat goed werkte
- Doordachte, correcte antwoorden scoren betrouwbaar de volle punten: baseline haalde op alle 6 losse (niet-tweeledige) vragen exact het volle puntenaantal
- Onzin- en degeneratie-invoer wordt consequent afgekeurd met duidelijke feedback ('Dit telt nog niet mee') en 0 punten — in 3 runs, meerdere pogingen
- Geen verklap-elementen: het juiste antwoord verschijnt pas ná Bevestigen, er is geen 'x van y goed'-teller en geen badge vooraf (dubbel gecheckt door baseline en struggler)
- Reload mid-missie hervat exact met behoud van score (geen dubbeltelling, geen reset), reset=1 start schoon, en na een geslaagde afronding wist clearSave() de opslag netjes
- Technisch schoon: geen console-fouten, geen netwerkfouten; missie draait volledig client-side (chatDependency none) — geen chat-afhankelijkheid die kan wegvallen
- Afwezigheid van verdiepingsvraag en zelfinschatting is een configkeuze (research-project.ts bevat geen followUp-/showConfidence-velden), geen bug — de onzekerheid uit de baseline-run is hiermee opgelost
- Getalvragen zijn streng maar eerlijk: gokken scoort 0, en de uitleg na afloop rekent het juiste antwoord voor (42-6=36, 80-45=35)

### Reparatiekandidaten (niet uitgevoerd — ter beslissing)
| # | Wat | Waar | Omvang | Waarom |
|---|---|---|---|---|
| 1 | Geef onRetry door van DataViewer aan CompletionScreen en wis de opslag bij herkansing | motor | klein | Heft de permanente lock onder 40% op; het patroon bestaat al in DebateArena (onRetry wordt daar wél meegegeven), dus dit is overnemen, niet ontwerpen. Lost meteen de valse belofte 'probeer het gerust nog eens' op. Geldt voor alle 15 data-viewer-missies. |
| 2 | Sluit vraagtekst-echo en halve-punten-terugval voor betekenisloze overlap uit in scoreObservation | motor | middel | Teruggeplakte vraagtekst levert nu overal gegarandeerd 5/10 op zonder enig begrip; overlap met de letterlijke vraagtekst zou 0 moeten scoren, net als degeneratie-invoer. |
| 3 | Hussel MC-opties (of herverdeel juiste posities motorbreed naar een gelijkmatige verdeling) | motor | middel | Zonder shuffle en met 91% van de juiste antwoorden in de middelste twee posities is 'kies nooit de buitenste optie' een leerbaar patroon over vijftien missies; in deze missie volstond het voor exact de drempel. Een render-shuffle in de motor repareert alle configs tegelijk. |
| 4 | Herverdeel de 3 juiste MC-posities in research-project.ts zolang de motor-shuffle er niet is | config | klein | Snelle mitigatie missie-eigen: nu staan alle drie de juiste antwoorden in de middelste posities en tellen de MC-punten (40) precies op tot de drempel. |
| 5 | Splits q8 in twee expliciete onderdelen (twee velden of genummerde deelinstructie) en laat de feedback het ontbrekende deel benoemen | config | klein | De tweeledige vraag kost nu zowel sterke als zwakke lezers stil punten; de halve-punten-feedback legt niet uit wát er mist, dus niemand leert ervan. Veldsplitsing is config; feedback die het ontbrekende deel benoemt raakt de motor (middel als dat meegenomen wordt). |

### Nog onzeker
- mobiel/tablet niet gemeten — Playwright is op verzoek van Yorin uitgeschakeld (venster stal focus)
- 'MC-only = precies 40% gehaald' is afgeleid uit config-punten plus de >=0.4-drempel in de code, niet als aparte run gespeeld; het geobserveerde pass-pad was 55% (MC + echo). Randgeval exact 40/100 is dus code-gestaafd maar niet live gereproduceerd
- Welzijnsmonitor-blokkade (Bevestigen doet stil niets bij enableChat:false, engine topIssues[3]) is in geen van de drie runs getriggerd — voor deze missie onbevestigd, telt niet als blocker
- Motorbrede MC-verdeling: engine-JSON meldt {0:2,1:20,2:19,3:2} van 43, de sol-correctie J3P3 {0:2,1:20,2:19,3:4} over 45 — niet zelf hergemeten over alle configs; alleen de 3 posities van deze missie zijn hier zelf geverifieerd
- Browser-artefacten in de runs (kliks die pas na tabs_select aankwamen, screenshot-tool 'pane not displayed', URL zonder querystring) zijn als gedeeld-paneel-artefacten behandeld, niet als missiebugs — conform de bekende beperking van het gedeelde Browser-paneel

### Correcties uit de tegenlezing (sol, 20 aug)
- **De tweeledige-vraag-bevinding is aangescherpt.** De feedback toont ná afloop wél de volledige uitleg mét een expliciete sectie "Verbetering" — "nergens benoemd" was te sterk. Wat blijft staan: de scoring toetst de twee delen niet afzonderlijk (een antwoord over één deel kan 0, 5 óf 10 punten krijgen) en de deelpunten-feedback zegt niet rechtstreeks wélk deel ontbrak.
- "Permanent vast onder 40%" is preciezer: **geen uitweg binnen de missie-UI** (het config-driftherstel in de code kent wel een wispad, maar dat is voor een leerling onbereikbaar).
- Bevestigd en verscherpt: de drie juiste MC-antwoorden (posities 2/2/1, samen exact 40 punten) halen in hun eentje precies de slaagdrempel — positiegok alleen volstaat om te slagen.
- Advies blijft **fix-eerst (Rood)**.
