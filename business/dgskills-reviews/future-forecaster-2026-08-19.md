## Opdracht Live Check: future-forecaster — J2P4 (motor debate-arena)

**Advies:** fix-eerst
**Risico:** Geel
**Getest als:** gesimuleerde leerlingen (serieuze baseline · sjoemelaar · worstelaar · iPad via Playwright) op de dev-previewroute, zonder login
**Datum:** 2026-08-19

### In één alinea
De missie laat leerlingen een toekomstvoorspelling debatteren met vier stakeholders. Een serieuze leerling haalt moeiteloos 100/100, maar een sjoemelaar haalt dezelfde score door zeven keer dezelfde onzin-tekst te plakken. Zakken is onmogelijk: zelfs minimale inspanning levert 83/100 op, ruim boven de 40%-grens. Een worstelaar loopt vast in de Challenge- en Reflect-fase omdat de doorgaan-knop dicht blijft terwijl de teller "voldaan" zegt. Het oordeel is fix-eerst: de missie zelf is goed, maar de motor laat kopiëren en gokken toe en heeft een vastloper.

### Scores per profiel
| Profiel | Resultaat |
|---|---|
| Serieuze baseline | 100/100 (100%) eerlijk; gokproef 83/100 (83%), beide 'Gehaald' |
| Sjoemelaar | 100/100 (100%) met 7x dezelfde grensstring 'ab cd ef ab cd ef ab'; ondergrens-run 83/100, ook 'Gehaald' |
| Worstelaar | 83/100 (83%) eerlijk = 83/100 met 5x dezelfde vulzin; identiek resultaat |
| iPad (Playwright) | niet gemeten |

### Bevindingen
1. **MAJOR** · motor · bevestigd — Volle score haalbaar zonder inhoud: alleen lengte en tekenvariatie worden gecontroleerd, niet of er echt iets staat. Zeven keer dezelfde onzin-tekst plakken geeft 100/100 met "Top gedaan!". _Bewijs: run-creatieve-cheater.json F1+F4 (eindscherm 100/100); answerQuality.ts:11,18,20,51-56_
2. **MAJOR** · motor · bevestigd — Zakken is structureel onmogelijk: de laagst haalbare score is 83/100, altijd "Gehaald" met positieve feedback, ook bij nul leesinspanning. De 40%-drempel is dode code. _Bewijs: run-creatieve-cheater.json F2 (minimale inspanning = 83/100); CompletionScreen.tsx:65_
3. **MAJOR** · motor · bevestigd — Echte vastloper: in Challenge- en Reflect-fase blijft de doorgaan-knop uit terwijl de teller "22/20 min." toont. De eis over tekenvariatie wordt nergens uitgelegd, terwijl de hint in de Argue-fase wel bestaat. _Bewijs: run-letterlijke-luca.json F1 (disabled:true bij '22/20 min.'); ChallengePhase.tsx:56-58,72_
4. **MINOR** · motor · bevestigd — Explore-poort zonder leesbewijs: vier keer "Gelezen ✓" klikken in enkele seconden geeft 10/10 punten, zonder tijds- of interactie-eis. _Bewijs: run-creatieve-cheater.json F6 (stap 2); ExplorePhase.tsx:106-113_
5. **MINOR** · motor · bevestigd — Toegankelijkheid: uitgeschakelde knoppen hebben geen reden voor schermlezergebruikers; de Argue-fase zet de reden wél in het knoplabel. _Bewijs: run-letterlijke-luca.json F4 (aria-disabled null); ChallengePhase.tsx:70-78_
6. **MINOR** · motor · onbevestigd — Contrast vermoedelijk onder AA op vrijwel alle inhoudstekst (verhouding ≈ 3,8:1 bij 10-12px), maar in geen enkele run visueel gemeten. _Bewijs: DebateArena.tsx:289, ExplorePhase.tsx:82,90; run-snelle-sam.json unsure_
7. **MINOR** · motor · bevestigd — Dormant chat: de registry kondigt een AI-chat aan voor deze en zeven andere missies, maar de motor ondersteunt dat niet en rendert nergens een chat. _Bewijs: templateRegistry.ts:88-97 vs DebateArena.tsx:34-53; geen netwerk-calls in alle runs_
8. **MINOR** · missie · bevestigd — Geen missie-eigen defecten: de config is coherent, telt exact op tot 100, en de badge "Debatmeester" klopt. Het fix-eerst-oordeel komt volledig van motorbevindingen B1-B3. _Bewijs: configs/future-forecaster.ts:20-89; run-letterlijke-luca.json stap 13_

### Wat goed werkte
- Eerlijke route vlekkeloos: baseline haalde 100/100 zonder één vastloper — elke fase heeft een duidelijke knop en voortgangsindicatoren geven precies genoeg houvast
- Herladen betrouwbaar in alle drie de runs: fase, teksten, gelezen stakeholders en score worden exact hersteld, geen crash of dataverlies
- Geen verklap: nergens een goed/fout-indicator of zichtbaar antwoord vooraf — consistent met het open-debat-karakter
- Pure letterherhaling wordt wél geweigerd: 22x dezelfde letter blokkeert de voortgang — de check is niet met de allersimpelste gokvorm te omzeilen
- Geen console-fouten en geen netwerkfouten in alle drie runs; motor draait volledig client-side
- Eindscherm is verzorgd: fasetabel telt exact op tot 100, het debattraject toont positie en argumenten terug, focusbeheer en uitkomstlabel zijn op orde

### Reparatiekandidaten (niet uitgevoerd — ter beslissing)
| # | Wat | Waar | Omvang | Waarom |
|---|---|---|---|---|
| 1 | Toon de bestaande answerQualityHint ook in Challenge- en Reflect-fase en laat de teller niet "voldaan" tonen zolang de variatie-eis niet gehaald is | motor | klein | Lost de enige echte vastloper op (B3); de hint-code bestaat al en wordt in Argue wél gerenderd |
| 2 | Duplicaat-detectie over velden heen: identieke tekst in meerdere argument-/reflectievelden weigeren of afwaarderen | motor | middel | De goedkoopste dam tegen B1: 7x dezelfde string plakken geeft nu 100/100 |
| 3 | Scoringsmodel herijken zodat "Gehaald" iets zegt: inhoudsweging of poort-afgedwongen punten uit het slaagpercentage halen | motor | groot | B2: ondergrens 83% maakt de 40%-drempel dode code en meet alleen doorloopgedrag |
| 4 | Leesbevestiging op de Explore-fase versterken (dwell-tijd of mini-controlevraag) | motor | middel | B4: 10/10 leespunten in enkele seconden zonder één woord te lezen |
| 5 | Reden van uitgeschakelde doorgaan-knoppen toegankelijk maken (reden in knoplabel of aria-describedby) | motor | klein | B5: schermlezergebruikers horen nu geen enkele verklaring |
| 6 | Registry-opruiming: enableChat/chatRoleId voor de 8 debate-arena-missies verwijderen óf chat daadwerkelijk ondersteunen | motor | klein | B7: de aangekondigde AI-rol is dormant; opruimen voorkomt valse verwachtingen |
| 7 | Contrast van fase-tekst van /60 naar /75 brengen na visuele verificatie | motor | klein | B6: code-analyse wijst op sub-AA-contrast bij 10-12px tekst |

### Nog onzeker
- mobiel/tablet niet gemeten — Playwright is op verzoek van Yorin uitgeschakeld (venster stal focus)
- Contrast/leesbaarheid van de kleine fase-tekst is in geen enkele run visueel geverifieerd; B6 steunt alleen op code-analyse
- Discrepantie tussen runs over de Argue-fase-hint: baseline zag wél een hint bij herhaal-tekst, de cheater niet — de exacte triggercondities zijn niet uitgesplitst; het hint-gat in Challenge/Reflect zelf is 3x DOM-bevestigd
- Cheater-stappen 11-16 gebruikten geen echte kliks (el.click()/dispatchEvent) omdat het gedeelde browserpaneel de tab niet op de voorgrond had; functioneel geverifieerd via state-/scoreveranderingen
- De perspectief-tags (Lars/Jansen/Guo/Tran) bij de argumenten zijn nooit verplicht gebleken; onduidelijk of dat veld decoratief is of ergens meetelt
- durationMin in de runs is een schatting op basis van stappen, geen gemeten wandkloktijd
