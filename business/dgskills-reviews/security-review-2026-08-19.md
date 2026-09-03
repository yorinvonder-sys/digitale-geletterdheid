## Opdracht Live Check: security-review — J3P2 (motor review-arena)

**Advies:** fix-eerst
**Risico:** Rood
**Getest als:** gesimuleerde leerlingen (serieuze baseline · sjoemelaar · worstelaar · iPad via Playwright) op de dev-previewroute, zonder login
**Datum:** 2026-08-19

### In één alinea
De missie is een beveiligingsreview met vier rondes: sorteren, koppelen, categoriseren en een snelle vragenronde. Een serieuze leerling haalt ruim de norm (97/100 en 91/100 in twee onafhankelijke runs), maar 100/100 is in geen enkele run gehaald. Een sjoemelaar zonder inhoud komt niet door de 40%-grens: de hoogste gemeten sjoemelscore is 37/100. Een worstelaar loopt vast in de koppelronde, waar elke foute klik direct en definitief punten kost, en komt daarna op een dood eindscherm terecht. Het oordeel is fix-eerst: de koppelronde en het eindscherm moeten worden aangepast voordat de missie veilig in productie kan.

### Scores per profiel
| Profiel | Resultaat |
|---|---|
| Serieuze baseline | eerlijk 97/100 (97%) — gehaald; gokproef 33/100 (33%) |
| Sjoemelaar | sjoemel-playthrough 37/100 (37%) — niet gehaald; gokproef 13/100 (13%) |
| Worstelaar | eerlijk 91/100 (91%) — gehaald; gokproef 13/100 (13%) |
| iPad (Playwright) | niet gemeten — geen Playwright-run beschikbaar |

### Bevindingen
1. **BLOCKER** · motor · bevestigd — Onder de 40%-grens is het eindscherm een doodlopende weg: de enige knop is uitgeschakeld, er is geen terug- of herkansknop, en herladen brengt de leerling terug op hetzelfde dode scherm. _Bewijs: run-letterlijke-luca.json F1 (33/100: 1 knop, disabled:true; reload geeft zelfde scherm); motor: CompletionScreen.tsx:163-170_
2. **MAJOR** · motor · bevestigd — Ronde 2 (koppelen) legt de score al vast bij de eerste foute klik: één bewuste fout + herladen geeft 20/25 zonder één koppel te maken, en wie eerst misklikt en daarna alles goed doet houdt de lage score. _Bewijs: run-creatieve-cheater.json F1 (lockedRoundScores.round-match-pairs=20, matchedIds=[]); run-afgeleide-amir.json F2 (5 fouten, daarna 5/5 correct → 0/25)_
3. **MINOR** · missie · bevestigd — De introtekst van ronde 4 belooft acht vragen, maar de ronde bevat er tien. _Bewijs: run-letterlijke-luca.json F3 ('Acht snelle vragen...' gevolgd door 'Vraag 1 van 10' t/m 'Vraag 10 van 10')_
4. **MINOR** · motor · bevestigd — De verdiepingsvraag met +5 bonus verschijnt alleen als de rondescore boven de helft ligt, dus juist de leerlingen die herstelpunten nodig hebben krijgen hem nooit te zien. _Bewijs: run-afgeleide-amir.json routemap n=3 ('alleen bij >50% rondescore ronde 1 ... bij ≤50% verschijnt hij niet')_
5. **MINOR** · motor · bevestigd — De 12s-timer per vraag in ronde 4 kent geen pauze en geen herlees-ruimte; te traag reageren telt als fout antwoord. _Bewijs: run-afgeleide-amir.json F6 (timer telt zichtbaar af vanaf 12s, geen pauzemechanisme); config security-review.ts:151 timePerQuestion: 12_
6. **MINOR** · motor · onbevestigd — De browserconsole toont een React-waarschuwing 'Cannot update a component (ReviewArenaWithConfig) while rendering a different component (RapidFire)' — een setState tijdens render. Geen zichtbaar effect waargenomen. _Bewijs: run-afgeleide-amir.json F3 (read_console_messages onlyErrors); NIET gereproduceerd in run-letterlijke-luca.json_
7. **MINOR** · motor · onbevestigd — Koppelen kent geen uitweg: de ronde eindigt pas als álle koppels goed zijn, dus wie het laatste koppel niet vindt moet blijven gokken tot de score op 0 staat. _Bewijs: motoranalyse gates + topIssues (MatchPairs.tsx:143-151, done pas bij newMatched.size === pairs.length)_
8. **MINOR** · motor · onbevestigd — Na een geslaagde afronding wist de motor de opslag en bewaart hij geen beste poging, dus de missie is onbeperkt opnieuw te spelen voor een hoger cijfer. _Bewijs: motoranalyse completion + topIssues (ReviewArena.tsx:490-492, clearSave na geslaagde afronding)_
9. **MINOR** · motor · onbevestigd — Bij rondewisselingen bleef de rondekaart soms op de oude inhoud staan terwijl de kop en de score al de nieuwe ronde toonden; één keer leek in ronde 4 de vraagtekst te bevriezen terwijl teller en timer doorliepen. _Bewijs: run-afgeleide-amir.json F4 (needsPlaywright:true, screenshot meldt 'Browser pane is not displayed'); verklaring: bekend paneelartefact_

### Wat goed werkte
- Blind gokken levert nergens gratis punten op: 'altijd WAAR' in ronde 4 gaf in drie onafhankelijke proeven 0/25 ondanks 5-6 van de 10 toevalstreffers, doordat de gok-basislijn wordt afgetrokken.
- De indienknoppen zijn correct gegate: sorteren kan pas na minstens één verplaatsing, categoriseren pas als alle 8 items geplaatst zijn — geen manier gevonden om met minder in te dienen.
- Geen verklappers: in geen enkele ronde stond het juiste antwoord, de juiste volgorde of een 'x van y goed'-teller zichtbaar vóór het indienen; alle correctie verschijnt pas erna.
- Herladen midden in de missie hervat correct (fase, ronde, score, plaatsingen behouden) en ?reset=1 geeft gegarandeerd een schone start met een nieuwe husselvolgorde — behalve het match-pairs-lek uit B2.
- Volledig offline speelbaar: geen chat, geen netwerkcalls richting Supabase of /functions/v1; alleen lokale dev-modules met 200/304. Twee van de drie runs zagen nul consolefouten.
- Toegankelijkheid van de bediening: sorteren kan met expliciet gelabelde pijltjesknoppen in plaats van slepen, en alle interacties lopen via knoppen met leesbare tekst — het profiel dat impliciete interfaceconventies mist, kon de hele missie uitspelen.
- Beide serieuze doorlopen haalden de norm ruim (97/100 en 91/100) en het geslaagde eindscherm voelt af: duidelijke score, 'Gehaald' en een overzicht per ronde.

### Reparatiekandidaten (niet uitgevoerd — ter beslissing)
| # | Wat | Waar | Omvang | Waarom |
|---|---|---|---|---|
| 1 | Uitweg op het eindscherm onder de 40% | motor | klein | Geef ReviewArena een herkans- en/of terugactie mee aan CompletionScreen, zodat de knop niet uitgeschakeld blijft. Nu zit elke leerling onder de grens permanent vast, ook na herladen — de enige harde blocker van deze missie (B1). |
| 2 | Koppelronde pas scoren bij afronding | motor | middel | Laat de rondescore pas vastleggen als de ronde echt klaar is, en tel fouten mee zonder de ronde bij de eerste misklik te vergrendelen. Dit dicht tegelijk de sluiproute (1 fout + reload = 20/25) en de onterechte straf voor wie het daarna alsnog goed doet (B2). |
| 3 | Rondetekst 'Acht snelle vragen' gelijktrekken met de 10 vragen | config | klein | De belofte in de introtekst klopt niet met de ronde; bij een timer-ronde is een verkeerde verwachting extra vervelend (B3). |
| 4 | Verdiepingsvraag ook aanbieden onder de 50% | motor | klein | De bonus-herstelvraag gaat nu juist voorbij aan de leerlingen die punten nodig hebben; dit vergroot de kans dat een worstelaar de 40% haalt en dus niet in B1 belandt (B4). |
| 5 | Pauze of extra leestijd in de snelle ronde | motor | klein | 12 seconden zonder pauze is krap voor een leerling die afdwaalt of moet herlezen; nu telt een trage reactie als fout (B5). |
| 6 | SetState-tijdens-render in RapidFire opruimen | motor | klein | De React-waarschuwing wijst op een score-update tijdens het renderen van een andere component; nu zonder zichtbaar effect, maar een bekende bron van inconsistente state (B6, onbevestigd). |
| 7 | 'Ik weet het niet'-uitweg in de koppelronde | motor | middel | Wie het laatste koppel niet vindt kan alleen doorgokken tot de score nul is; een expliciete afsluitoptie maakt de ronde afmaakbaar zonder gokstraf (B7, onbevestigd). |

### Nog onzeker
- mobiel/tablet niet gemeten — Playwright is op verzoek van Yorin uitgeschakeld (venster stal focus); er is geen run-ipad-iris.json en alle drie de runs draaiden op innerWidth 1280 zonder resize.
- Alle drie de runs speelden via /dev/mission-preview, waar onComplete een no-op is; het gedrag van het eindscherm in de echte app (met schil, terugknop en docentrapportage) is niet nagespeeld.
- In de worstelaar-run kwamen echte muis- en toetsenbordkliks niet aan op de pagina (gedeeld, verborgen browserpaneel); die run schakelde over op in-page el.click() met DOM-verificatie — de scores zijn daarmee betrouwbaar, maar de invoerweg wijkt af van een echte leerling.
- Het bevriezings-artefact bij rondewisselingen (B9) kon niet onafhankelijk met Playwright worden getoetst; het is vermoedelijk een paneelartefact van de verborgen tab en géén state-bug, maar dat is niet bewezen.
- Of 100/100 daadwerkelijk haalbaar is, is niet aangetoond: geen enkele run scoorde meer dan 97, en of de +5 bonus bovenop een perfecte 25/25 in ronde 1 wordt afgetopt is niet nagerekend.
- startedAt en durationMin in de speelrapporten zijn schattingen; er was geen exacte kloktijdbron in die sessies.
