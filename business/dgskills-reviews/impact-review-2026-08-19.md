## Opdracht Live Check: impact-review — J3P3 (motor review-arena)

**Advies:** fix-eerst
**Risico:** Geel
**Getest als:** gesimuleerde leerlingen (serieuze baseline · sjoemelaar · worstelaar · iPad via Playwright) op de dev-previewroute, zonder login
**Datum:** 2026-08-19

### In één alinea
De missie is een review-arena met vier rondes: sorteren, koppelen, verdiepingsvragen en een snelle vragenronde. Een goede leerling haalt drie van de vier rondes foutloos (75 punten), maar de volle 100 lukt niet door de strakke tijdslimiet en een bonus die niet meetelt. Een sjoemelaar die puur gokt komt net niet door de 40%-grens (38%), maar door gedwongen doorproberen bij het koppelen kan hij er net overheen komen (41%). Een worstelaar haalt 66% en raakt niet afgehaakt, maar loopt wel vast op het dode eindscherm als hij onder 40% zakt. Het oordeel is fix-eerst: het vastgelopen eindscherm moet opgelost worden voordat de missie breed ingezet kan worden.

### Scores per profiel
| Profiel | Resultaat |
|---|---|
| Serieuze baseline | 75/100 (75%) — Gehaald (25+25+25+0; rapid-fire 4/8 = gok-basislijn door timeouts) |
| Sjoemelaar | eerlijk 63/100 (63%) Gehaald; puur-gok-run 38/100 (38%) — Nog niet gehaald, dood eindscherm geraakt |
| Worstelaar | 66/100 (66%) Gehaald; gokrun 41/100 (41%) — net Gehaald |
| iPad (Playwright) | niet gemeten |

### Bevindingen
1. **BLOCKER** · motor · bevestigd — Onder 40% is het eindscherm een dood eind: de enige knop staat op disabled, er is geen terug- of herkansingsknop, en herladen brengt de leerling op hetzelfde vastgelopen scherm terug. De docent ziet geen resultaat. _Bewijs: run-creatieve-cheater.json F2 (DOM: precies 1 button, disabled:true, na reload identiek scherm op 38%)_
2. **MAJOR** · motor · bevestigd — De beloofde '+5 bonus' van de verdiepingsvraag wordt niet bij het totaal geteld: de UI toont de bonus, maar het puntentotaal verandert niet. _Bewijs: run-afgeleide-amir.json F3 (header 58 pts vóór én na correcte bonusvraag; eindtotaal 66 = 8+25+25+8 exact)_
3. **MAJOR** · motor · onbevestigd — Bij vrijwel elke rondewissel blijft de inhoud van de vorige ronde zichtbaar terwijl kop en score al de nieuwe ronde tonen; alleen herladen toont de juiste inhoud. Mogelijk een artefact van het verborgen browserpaneel. _Bewijs: run-creatieve-cheater.json F1 (drag-items bleven 6, matchLeft 0 na 'Volgende ronde', reproduceerbaar in 2 sessies)_
4. **MINOR** · motor · bevestigd — Echte React-consolefout: 'Cannot update a component while rendering a different component' — een code-smell die in alle drie de runs meermaals is gelogd. _Bewijs: run-letterlijke-luca.json F4; run-creatieve-cheater.json console (2x); run-afgeleide-amir.json stap 16 (2x gelogd)_
5. **MINOR** · motor · onbevestigd — De rapid-fire-timer (12s per vraag) telt een timeout als fout, zonder pauze en zonder waarschuwing vooraf. De gemeten schade is vertekend door toolvertraging; zonder Playwright-tijdmeting niet op echte leerlingen te projecteren. _Bewijs: config impact-review.ts:145; engine RapidFire.tsx:144-161; run-letterlijke-luca.json F2 (artefactChecked:false, needsPlaywright:true)_
6. **MINOR** · motor · bevestigd — Het gokresultaat ligt precies op de 40%-grens: puur gokken gaf 38% (niet gehaald), maar gokken plus gedwongen doorproberen bij het koppelen gaf 41% (wel gehaald). Een leerling kan dus zonder aantoonbare kennis nipt slagen. _Bewijs: run-creatieve-cheater.json scoreGuess (38/100); run-afgeleide-amir.json scoreGuess (41/100)_
7. **MINOR** · motor · bevestigd — De 'Afronden'-knop op het eindscherm stond buiten het zichtbare kader en werd niet automatisch in beeld gescrold; pas na handmatig scrollen bereikbaar. _Bewijs: run-letterlijke-luca.json F5 (getBoundingClientRect gemeten, artefactChecked:true)_
8. **MINOR** · motor · bevestigd — De verdiepingsvraag met bonuspunten verschijnt alleen boven 50% van de rondescore, dus juist de zwakste leerlingen krijgen de herstelkans nooit. Geen enkele run kreeg de tweede bonusvraag te zien. _Bewijs: engine ReviewArena.tsx:422-425; config impact-review.ts:133-144_

### Wat goed werkte
- De match-pairs-vergrendel-bug uit de motoranalyse is in drie onafhankelijke proeven weerlegd: foute koppeling + herlaad gaf telkens een verse, open ronde
- Submit-gates werken: de drag-sort-knop blijft disabled tot minstens 1 kaart is verplaatst, geen gratis punten zonder interactie
- De gok-basislijn van rapid-fire werkt zoals bedoeld: 3/8 en 4/8 goed gaven 0/25 — ook exact op het omslagpunt
- De verdiepingsvraag-shortcut werkt niet: het eerste antwoord ligt vast, alsnog het juiste aanklikken verandert niets
- Geen verklap in alle 4 rondetypes: nergens juiste antwoorden, volgorde of 'x van y goed' zichtbaar vóór indienen
- Herlaad-/hervatgedrag is robuust: mid-ronde reload hervat exact op de juiste ronde met score vast, ingediende rondes zijn niet opnieuw speelbaar
- Missie draait volledig offline: geen netwerkfouten, geen chat-afhankelijkheid

### Reparatiekandidaten (niet uitgevoerd — ter beslissing)
| # | Wat | Waar | Omvang | Waarom |
|---|---|---|---|---|
| 1 | Geef het eindscherm onder 40% een herkansingsknop plus een terug-uitweg, en zorg dat de docent ook een gezakte poging ziet | motor | klein | B1: DOM-bevestigd dood eind; leerling zit vast, onComplete wordt nooit aangeroepen |
| 2 | Tel de followUp-bonuspunten werkelijk en zichtbaar bij het totaal, of haal de '+5 bonus'-belofte uit de UI; sluit de cap-op-ronde-max-hypothese uit | motor | klein | B2: twee runs tonen dat de beloofde +5 nergens in het totaal landt |
| 3 | Repareer de setState-tijdens-render in RapidFire en verifieer daarna met een Playwright-run of de rondewissel-freeze verdwijnt | motor | middel | B4 (bevestigde consolefout) + B3 (onbevestigde overgangsfreeze) — één gecombineerde fix + meting scheidt app-bug van paneelartefact |
| 4 | Geef match-pairs een 'ik weet het niet'-uitweg zodat een vastgelopen leerling niet hoeft door te gokken tot de score op 0 staat | motor | middel | Engine-gate + B6: het afgedwongen doorproberen is nu ook de route waarmee een gokker net over de 40% komt |
| 5 | Zet in de intro/rondekop van rapid-fire een expliciete waarschuwing dat een timeout als fout telt, en overweeg timePerQuestion te verruimen (12 → 15-20s) | config | klein | B5: timeout=fout is nu impliciet; trage lezers verliezen punten zonder te begrijpen waarom |
| 6 | Scroll de 'Afronden'-knop op het eindscherm automatisch in beeld | motor | klein | B7: knop stond gemeten ~200px onder de fold bij 800px viewport zonder auto-scroll |

### Nog onzeker
- Mobiel/tablet niet gemeten — Playwright is op verzoek van Yorin uitgeschakeld (venster stal focus)
- B3 (rondewissel toont oude inhoud tot herlaad): in alle 3 runs gezien maar zonder Playwright niet te scheiden van het bevroren-animatie-artefact van het gedeelde browserpaneel
- B5/rapid-fire: de tegenstrijdige uitkomsten bij identieke input zijn vermoedelijk timeout-door-toollatentie; een echt registratieprobleem is zonder tijdmeting niet uitgesloten
- B2: de cap-op-ronde-max-verklaring voor de ontbrekende bonus is niet uitgesloten (beide bewijs-runs hadden ronde 3 op 25/25)
- De tweede verdiepingsvraag is door geen enkele run gezien omdat niemand >50% op ronde 4 haalde; het gedrag van die bonusvraag is onbeproefd
- Of een echte leerling de rapid-fire foutloos haalt (vereist voor de volle 100) is niet vast te stellen: alle timeout-verliezen in de runs zijn vertekend door agent-latentie
- Luca's gokproef besloeg alleen ronde 1; de volledige gokscore van de baseline-persona is niet gemeten

### Correcties uit de tegenlezing (sol, 20 aug)
- **"+5 bonus telt niet mee" is te sterk.** De bonus telt wél mee maar wordt afgekapt op het rondemaximum (Math.min(base+bonus, round.maxScore), ReviewArena.tsx:378-382); bij een foutloze ronde (25/25) voegt hij niets toe. De UI-belofte blijft misleidend, het mechanisme is niet stuk.
- **De match-pairs-weerlegging is zelf weerlegd.** De code schrijft bij een foute koppeling de score wél direct weg (MatchPairs.tsx:152-168; autosave flusht na ~1s én bij beforeunload). De runs herlaadden vermoedelijk binnen de debounce; de oorspronkelijke vergrendel-bug staat dus code-bevestigd maar runtime-onbeslist — hertest met >1s wachttijd nodig.
- Dead-end onder 40%: bevestigd; precies geformuleerd "geen uitweg binnen de missie-UI" (browser-terug onbeproefd).
- Rondewissel-freeze blijft onbeslist (React setState-in-render-fout in RapidFire is echt; de freeze-oorzaak vergt een zichtbare browserrun).
- Advies blijft **fix-eerst (Geel)**.
