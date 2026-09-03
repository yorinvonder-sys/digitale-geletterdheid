## Opdracht Live Check: welzijnsonderzoeker — J3P3 (motor data-viewer)

**Advies:** fix-eerst
**Risico:** Rood
**Getest als:** gesimuleerde leerlingen (serieuze baseline · sjoemelaar · worstelaar · iPad via Playwright) op de dev-previewroute, zonder login
**Datum:** 2026-08-19

### In één alinea
De missie laat leerlingen drie datasets over welzijn en schermtijd analyseren. Een zorgvuldige leerling haalt 85% en de les over causaliteit werkt goed, maar een eerlijk antwoord kan door een te strenge woordenlijst op 0 vallen. Een sjoemelaar die gokt en vraagtekens herhaalt komt niet door de 40%-grens, maar lekt wel gratis halve punten. Een worstelaar haalt het net, maar loopt vast op drie plekken, waaronder een bevroren knop na 'geen idee' typen. Het grootste probleem: wie onder de 40% zakt, komt op een dood scherm zonder uitweg — de missie is dan onafrondbaar.

### Scores per profiel
| Profiel | Resultaat |
|---|---|
| Serieuze baseline | 85/100 (85%) — Gehaald (verlies door bewuste welzijns-probe, 0/15 definitief); gokrun 0/100 (0%) |
| Sjoemelaar | 18/100 (18%) met eerste-optie-gok + vraagtekst-echo/keyword-stuffing — Nog niet gehaald; pure gok/degeneratie 0/100 (0%) |
| Worstelaar | 53/100 (53%) — Gehaald; gokproef 10/100 (10%) — Nog niet gehaald |
| iPad (Playwright) | niet gemeten |

### Bevindingen
1. **BLOCKER** · motor · bevestigd — Wie onder de 40% zakt, komt op een dood scherm terecht: de enige knop is uitgeschakeld, er is geen terugknop en herladen helpt niet. Alleen een verborgen reset-truc (met volledig verlies van voortgang) ontsnapt. _Bewijs: drie runs op vier scores (0%, 10%, 18%, 0%) tonen disabled knop, reload identiek; reset=1 enige uitweg_
2. **BLOCKER** · motor · bevestigd — Na een 'geen idee'-antwoord in een open vraag blijft de Bevestig-knop permanent uitgeschakeld, ook als de leerling daarna wel serieus antwoordt (getest tot 19 woorden). Alleen het veld volledig wissen en opnieuw typen werkt — een onvindbare truc. _Bewijs: 'geen idee' x3 + 4 legitieme woorden → knop disabled, hint bevroren; na wissen + verse zin → knop werkt_
3. **MAJOR** · motor · bevestigd — Een eerlijk antwoord van 10 woorden kreeg 0 punten met de feedback 'Schrijf minstens 8 woorden' — de leerling kan onmogelijk zien wat er mis is. Het woord 'tevredener' werd afgekeurd terwijl 'tevreden' in de woordenlijst staat. _Bewijs: 10-woorden antwoord → 0/10 met lengte-feedback; zelfde tekst bij 13-woorden probe_
4. **MAJOR** · motor · bevestigd — Vraagtekst herhalen of losse trefwoorden plakken levert gratis halve punten op zonder de data te lezen (5/10, 5/10, 8/15). Minder dan de volle punten die de motor voorspelde, maar het lek blijft bestaan. _Bewijs: vraagtekst-echo → 5/10 en 5/10; negen losse trefwoorden → 8/15_
5. **MAJOR** · motor · bevestigd — Bevestigen is per vraag definitief zonder waarschuwing: na één klik verdwijnen veld en knop, ook bij 0 punten. Een baseline verloor zo blijvend 15 van de 30 punten op één dataset. _Bewijs: na klik veld+knop weg, 15/30 vast; geen herkansing mogelijk_
6. **MAJOR** · motor · bevestigd — Meerkeuzevragen worden nooit door elkaar gehaald en de juiste antwoorden staan hier op posities 2, 2 en 3. Eerste-optie-gokken faalt volledig, maar 'altijd de middelste twee' blijft een leerbaar patroon dat gokwerk halveert. _Bewijs: juiste antwoorden op posities 2/2/3; eerste-optie-gok → 0/3 goed; geen shuffle in motor_
7. **MAJOR** · motor · weerlegd — Het gevreesde stille blokkeren bij een 'somber'-zin trad NIET op: een milde zin over somber voelen doorliep de normale scoring met zichtbare feedback. Het voorspelde dode-knop-scenario is bij neutrale bewoording niet reproduceerbaar. _Bewijs: normale feedback 'Dit telt nog niet mee...', geen waarschuwing, geen dode knop_
8. **MINOR** · missie · bevestigd — Geen van de 3 datasets toont een verdiepingsvraag; de config bevat er aantoonbaar geen. Of dit bewust didactisch ontwerp is, blijft een inhoudelijke keuze. _Bewijs: platte paginatekst in beide playthroughs; geen followUp-velden in config_
9. **MINOR** · missie · bevestigd — De getalvraag (gemiddelde 2,6 uur) met 5%-tolerantie geeft geen krediet voor 'dichtbij': een educated guess '3' scoort 0. Streng maar verdedigbaar; stapelt wel op voor worstelaars. _Bewijs: '3' i.p.v. 2,6 → 0 punten; tolerantie 2,47-2,73_

### Wat goed werkte
- Welzijnsmonitor-weerlegging: een milde 'somber'-zin blokkeerde NIET stil maar doorliep de normale scoring met zichtbare feedback — het gevreesde dode-knop-scenario trad bij neutrale bewoording niet op.
- Degeneratie-check is schoon: herhaalde tekens/woorden ('aaaa' x8 e.d.) scoren op alle tekstvragen consequent 0 punten, in drie onafhankelijke runs — geen gratis punten via die route.
- Verklap-check is schoon: geen zichtbaar juist antwoord vóór bevestigen, geen 'x van y goed'-teller; eerste-optie-gokken + onzin gaf 0%.
- Reload-gedrag mid-missie is correct: exacte hervatting van dataset én score (geen dubbeltelling, geen verlies), en na een GESLAAGDE afronding gaf reload een verse intro (clearSave werkt daar).
- Leeg indienen (getalveld) wordt netjes genegeerd zonder crash of foutmelding.
- Geen console-fouten en geen onverwachte netwerk-calls in alle drie de runs; chatDependency:none klopt — missie draait volledig client-side.
- De datasets zijn consequent als synthetisch gelabeld met expliciete geen-eigen-gegevens-instructie (config intro + per dataset source-notes) — passend bij het gevoelige welzijnsthema.
- Baseline-didactiek staat: een zorgvuldige leerling haalt 85% en de causaliteit/correlatie-les (dataset 3) werkt zoals bedoeld.

### Reparatiekandidaten (niet uitgevoerd — ter beslissing)
| # | Wat | Waar | Omvang | Waarom |
|---|---|---|---|---|
| 1 | Geef onRetry door aan CompletionScreen in DataViewer (incl. saveclear bij retry), zoals DebateArena al doet | motor | klein | Heft blocker B1 op voor alle 15 data-viewer-missies: een gezakte leerling kan dan opnieuw proberen i.p.v. permanent vast te zitten op een dood scherm. |
| 2 | Repareer de bevroren Bevestig-knop/woordenteller na een niet-antwoordpatroon ('geen idee' e.d.): oorzaak eerst in de code vaststellen, dan de telling bij elke invoerwijziging vers herberekenen | motor | middel | Blocker B2: een onzekere leerling die 'geen idee' typt en daarna echt gaat antwoorden zit muurvast; de workaround (veld volledig wissen) is niet ontdekbaar. Oorzaak is nog onbekend, dus diagnose hoort bij de fix. |
| 3 | Maak observatie-feedback inhoudsbewust: onderscheid 'te kort' van 'inhoud mist' en zeg bij een keyword/topic-afkeuring wát er ontbreekt | motor | klein | B3: 'Schrijf minstens 8 woorden' bij een 10-woorden antwoord is aantoonbaar misleidend en straft juist eerlijke leerlingen zonder leereffect. |
| 4 | Sluit vraagtekst-echo en losse keyword-stuffing uit in scoreObservation (overlap met de vraagtekst zelf niet laten meetellen; eis zinsverband) | motor | middel | B4: echo/stuffing geeft nu gratis halve punten (5/10, 8/15) zonder één blik op de data — halveert het lek uit de statische analyse maar dicht het niet. |
| 5 | Verruim de keyword-sets van de open vragen met woordvormen en synoniemen (o.a. 'tevredener', 'garandeert niet', 'toetsperiode') | config | klein | B3: de huidige set laat een correct geformuleerd eerlijk antwoord op 0 vallen door een morfologische near-miss. |
| 6 | Herverdeel de juiste MC-antwoordposities naar een gemengd patroon (of voer een geseede shuffle in de motor in) | config | middel | B6: posities 2/2/3 hier en 39/43 op midden-posities repo-breed maken 'altijd de middelste twee' een leerbaar gokpatroon; de j2p2-correctie is nooit op de data-viewer-configs toegepast. |
| 7 | Waarschuw vóór definitief bevestigen van een open antwoord (bijv. 'Dit is je enige poging') of geef één herkansing bij een 0-score observatie | motor | middel | B5: onaangekondigde onomkeerbaarheid kostte de baseline blijvend 15 punten; voor een letterlijke leerling die zijn eerste gedachte opschrijft is dit een oneerlijke valkuil. |

### Nog onzeker
- mobiel/tablet niet gemeten — Playwright is op verzoek van Yorin uitgeschakeld (venster stal focus)
- De oorzaak van de bevroren Bevestig-knop (B2) is niet in de broncode geverifieerd — het gedrag is uitsluitend via DOM/JS-checks vastgesteld; run-snelle-sam benoemt dit zelf in unsure.
- Of een midden-positie-gokstrategie (altijd optie 2/3) gecombineerd met vraagtekst-echo de 40% daadwerkelijk haalt is niet empirisch gedraaid; de 'nee' op sjoemelaarHaalt40 geldt alleen voor de geteste strategieën.
- Of de welzijnsmonitor bij sterkere/alarmerende trefwoorden wél stil blokkeert kon niet worden getest — alarmerende taal was in de runs expliciet verboden; de weerlegging (B7) geldt alleen voor milde bewoordingen.
- Dubbelklikken op Bevestigen (mogelijke dubbele telling) en terug-navigeren naar een eerdere dataset voor een herkansing zijn niet apart getest (run-creatieve-cheater unsure).
- Of vraagtekst-echo bij andere data-viewer-configs wél volle punten geeft is onbekend — de correctie op de motorvoorspelling steunt op 2-3 steekproeven per missie.
- Of het ontbreken van verdiepingsvragen (B8) bewust didactisch ontwerp is — de config bevat er aantoonbaar geen, maar de intentie is niet gedocumenteerd.

### Correcties uit de tegenlezing (sol, 20 aug)
- **De "bevroren Bevestig-knop" is geen blocker.** De code herberekent de knopstatus bij elke tekstwijziging (DataViewer.tsx:366-375,454-456); er bestaat geen permanente vergrendeling. Wat wél klopt en blijft staan als major: de woordenteller/hint telt rúwe woorden terwijl de knop de gestripte tekst telt, dus de hint kan schijnbaar bevriezen — misleidende feedback, geen vastloper. Herreproductie nodig voordat dit ooit weer als blocker geldt.
- 'tevredener' ≠ keyword 'tevreden' is nu ook code-bevestigd (hele-token-vergelijking, DataViewer.tsx:216-225).
- Midden-gok "altijd optie 2" levert exact 35/100 op (nog steeds onder de drempel).
- Advies blijft **fix-eerst (Rood)**: het dode eindscherm onder 40% en de 0/10 op een eerlijk antwoord dragen dat zelfstandig.
