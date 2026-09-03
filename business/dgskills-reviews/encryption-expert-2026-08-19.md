## Opdracht Live Check: encryption-expert — J3P2 (motor puzzle-lab)

**Advies:** fix-eerst
**Risico:** Rood
**Getest als:** gesimuleerde leerlingen (serieuze baseline · sjoemelaar · worstelaar · iPad via Playwright) op de dev-previewroute, zonder login
**Datum:** 2026-08-19

### In één alinea
De missie laat leerlingen vier beveiligingspuzzels oplossen (Caesar-cijfer, Base64, publieke/privésleutel, wachtwoordsterkte). Een eerlijke leerling haalt moeiteloos 100/100, maar een sjoemelaar komt ook op 75/100 zonder één puzzel te begrijpen — ruim boven de slaagdrempel van 40%. De grootste problemen zitten in de motor: onder de 40% eindigt de missie in een doodlopend scherm zonder uitweg, en de overslaan-knop staat vanaf het begin klaar en kost niets. Daarnaast verklapt de Caesar-puzzel het antwoord gratis en keurt de wachtwoordcheck alleen de vorm, niet de inhoud. Het oordeel is fix-eerst: de eerlijke leerling wordt goed bediend, maar de toets is niet betrouwbaar en een gezakte leerling zit vast.

### Scores per profiel
| Profiel | Resultaat |
|---|---|
| Serieuze baseline | eerlijk 100/100 (100%), badge 'Master Cryptograaf', 4x 25/25; gok-/skip-run 25/100 (25%) = 'Nog niet gehaald' |
| Sjoemelaar | sjoemel-run 75/100 (75%), badge 'Gevorderd Hacker', 'Gehaald' zonder enig begrip; volledig blind gokken + alles overslaan 0/100 (0%) |
| Worstelaar | eerlijk 100/100 (100%), 'Master Cryptograaf'; gok-/skip-run 0/100 (0%) eindigend op het doodlopende eindscherm |
| iPad (Playwright) | 100/100 (100%) touch-only in één rechte lijn; geen horizontale overflow op 820x1180, 1180x820 en 390x844; tapdoelen 512x48 en 406x44 (op de 44px-ondergrens); 0 console-fouten/waarschuwingen |

### Bevindingen
1. **BLOCKER** · motor · bevestigd — Onder de 40%-drempel is het eindscherm een doodlopende weg: de enige knop is uitgeschakeld en er is geen terug-, opnieuw- of sluitknop. Dit raakt alle puzzle-lab-missies, niet alleen deze. _Bewijs: 3 runs tonen 1 knop met disabled:true op 0/25-100-scherm; PuzzleLab.tsx:270-283 + CompletionScreen.tsx:163-171_
2. **MAJOR** · motor · bevestigd — Een mislukte poging blijft opgeslagen: herladen zonder reset landt opnieuw op hetzelfde doodlopende scherm, en de docent ziet de poging nooit omdat afronden alleen bij succes gebeurt. _Bewijs: herladen gaf woordelijk 'Leerling Cryptograaf 0/100 punten (0%) Nog niet gehaald' met dezelfde disabled knop; PuzzleLab.tsx:277-282_
3. **MAJOR** · motor · bevestigd — De overslaan-knop staat al klikbaar bij de eerste weergave van elke puzzel en kost geen punten. Vier klikken brengen een leerling met 0 punten naar het doodlopende eindscherm zonder één vraag te lezen. _Bewijs: 'overslaan →' zichtbaar naast SUBMIT bij eerste render; PuzzleLab.tsx:466-475_
4. **MAJOR** · missie · bevestigd — De wachtwoordcheck keurt alleen de vorm (lengte, hoofdletter, cijfer, symbool), niet de inhoud — terwijl het scherm zelf 'geen echt woord' eist. Zowel 'Password1234!' als 12x hetzelfde teken krijgt de volle 25 punten. _Bewijs: beide voorbeelden → ACCESS GRANTED, 25/25; validator encryption-expert.ts:108-117 vs eis :97_
5. **MAJOR** · missie · bevestigd — De Caesar-puzzel verklapt het antwoord gratis: de derde basis-aanwijzing vertaalt elke letter apart, wat samen VEILIG spelt. Overtikken volstaat; het leerdoel wordt niet getoetst. _Bewijs: alle vier runs zagen de vertaling vóór enige poging; encryption-expert.ts:27_
6. **MAJOR** · motor · bevestigd — Bij de meerkeuzepuzzel is er geen puntenaftrek voor foute pogingen en worden geprobeerde opties niet gemarkeerd. Met 4 opties en 3 pogingen levert blind elimineren 75% kans op volle punten. _Bewijs: A fout, B fout, C goed → +25 pts, alle opties bleven aanklikbaar; PuzzleLab.tsx:131-135_
7. **MINOR** · missie · bevestigd — De Base64-puzzel geeft in de derde aanwijzing al de eerste 4 letters weg ('d2Fj' = w, a, c, h), waarmee 'wachtwoord' triviaal te raden is. De enige echte denkstap is half weggegeven. _Bewijs: aanwijzing zichtbaar bij eerste weergave; encryption-expert.ts:51_
8. **MINOR** · motor · bevestigd — Na het maximum aantal pogingen wordt het juiste antwoord niet getoond en volgt geen uitleg. De leerling gaat door zonder te weten wat goed was. _Bewijs: na 3x fout alleen 'Max pogingen bereikt' + knop 'VOLGENDE PUZZEL →'; PuzzleLab.tsx:482-495_
9. **MINOR** · motor · onbevestigd — De hintprikkel staat omgekeerd: extra aanwijzingen komen gratis vrij na foute pogingen, terwijl de hintknop punten kost en pas verschijnt als die aanwijzingen al zichtbaar zijn. Niet in het spel bevestigd: de hintknop kwam in geen enkele run in beeld. _Bewijs: motorcode PuzzleLab.tsx:119-121, 376-388, 456-465; config hintCost 3/4/5/2_
10. **MINOR** · motor · onbevestigd — Zonder bereikcheck kan een gewijzigde config een opgeslagen puzzelindex buiten bereik laten vallen, wat een leeg scherm zonder uitweg oplevert. Niet gereproduceerd: alle herlaadtests met de huidige config waren schoon. _Bewijs: PuzzleLab.tsx:87-90 en 288, useMissionAutoSave.ts:136-145; tegenbewijs in 3 runs_
11. **MINOR** · motor · onbevestigd — Toegankelijkheidskwesties in de vaste schil: hintknop wordt onzichtbaar bij hover, optieknoppen hebben geen hover-status, veel labels op 10-11px, en de feedbackbanner combineert tegenstrijdige aria-attributen. Niet waargenomen tijdens het spelen; de touch-run mat wél voldoende grote tapdoelen. _Bewijs: motorcode PuzzleLab.tsx:460, 410, 321-339; iPad-run geen touchIssues_
12. **MINOR** · motor · weerlegd — Geen enkele aanwijzing voor instabiliteit, netwerk-/AI-afhankelijkheid of voortgangsverlies. De motor werkt volledig lokaal en offline, zonder console-fouten. _Bewijs: 0 console errors/warnings en 0 dynamische requests in alle vier runs_

### Wat goed werkte
- Het eerlijke speelpad is volledig af te maken en foutloos: drie onafhankelijke runs haalden 100/100 zonder vastlopen, hint of foute poging.
- Score-optelling klopt exact (4 x 25 = 100) en de per-puzzel scorelijst op het eindscherm komt overeen met wat er tijdens het spelen is verdiend.
- Feedback is ondubbelzinnig en direct: '>> ACCESS GRANTED <<' / '>> ACCESS DENIED <<', een zichtbare pogingenteller, en automatische doorstroom na ~2s zonder extra klik.
- Opslag en herstel werken betrouwbaar: herladen zonder reset gaf exact dezelfde puzzelindex én score terug; met reset een echt schone herstart.
- Geen enkele console- of netwerkfout in vier runs; geen Supabase-/AI-afhankelijkheid, dus geen laadwachttijd of externe faalkans tijdens de les.
- Mobiel/tablet is in orde: geen horizontale overflow op drie formaten; tapdoelen op of boven de 44px-ondergrens; geen hover-only informatie en geen sleep-interactie.
- De opbouw past bij een afgeleide of zwakke lezer: één puzzel per scherm, korte opgave, aanwijzingen ernaast — nergens moest informatie van een vorig scherm worden onthouden.
- Inhoudelijk zijn de vier onderwerpen correct en didactisch logisch opgebouwd; de successMessages en takeaways kloppen feitelijk.

### Reparatiekandidaten (niet uitgevoerd — ter beslissing)
| # | Wat | Waar | Omvang | Waarom |
|---|---|---|---|---|
| 1 | Geef het eindscherm onder de drempel een echte uitweg | motor | klein | Blokkerend (B1): nu is de enige knop uitgeschakeld en is er geen terug-, opnieuw- of sluitknop. |
| 2 | Rond ook een mislukte poging netjes af: voortgang opruimen en de poging registreren | motor | klein | B2: opruimen gebeurt alleen bij succes, waardoor een gezakte leerling bij elk bezoek opnieuw op het doodlopende scherm start en de docent de poging nooit ziet. |
| 3 | Bied 'overslaan' pas aan na een echte poging, en maak de prijs zichtbaar | motor | klein | B3: de knop staat vanaf seconde nul klaar en kost niets, dus vier klikken leiden zonder waarschuwing naar 0% en het doodlopende scherm. |
| 4 | Laat de wachtwoordcheck ook op inhoud toetsen, met feedback per eis | config | middel | B4: de validator keurt alleen de vorm goed, terwijl de opgave zelf 'geen echt woord' eist. |
| 5 | Verplaats de letter-voor-letter vertaling van de Caesar-puzzel naar de extra aanwijzingen | config | klein | B5: aanwijzing 3 spelt het antwoord VEILIG gratis uit bij de eerste weergave, waardoor het leerdoel niet wordt getoetst. |
| 6 | Zwak de Base64-aanwijzing af tot een methode-hint in plaats van de eerste letters | config | klein | B7: 'd2Fj = w, a, c, h' plus een Nederlandse woordvorm maakt raden triviaal. |
| 7 | Laat de puntenopbrengst meebewegen met het aantal pogingen en markeer geprobeerde opties | motor | middel | B6: nu levert blind elimineren 75% kans op volle punten en kan dezelfde foute optie twee keer worden aangeklikt. |
| 8 | Toon na de laatste poging het juiste antwoord met een korte uitleg | motor | klein | B8: de leerling gaat nu door zonder te weten wat goed was — precies het moment waarop uitleg het meeste oplevert. |
| 9 | Draai de hintvolgorde om: eerst de betaalde hint, daarna pas gratis extra aanwijzingen | motor | middel | B9 (onbevestigd in het spel, wel in de motorcode): nu is bewust fout antwoorden goedkoper dan een hint vragen. |
| 10 | Controleer herstelde opslag op bereik en bied een resetknop bij een lege staat | motor | klein | B10: zonder bereikcheck kan een latere configwijziging een leeg scherm zonder uitweg opleveren; preventief. |

### Nog onzeker
- Of een leerling in de echte app (niet de preview) via een schil-terugknop alsnog van het doodlopende eindscherm af kan: onBack is in de preview een bewuste no-op, dus B1 is daar niet direct te toetsen.
- Het hint-pad (betaalde hintknop, hintCost 3/4/5/2) is in geen enkele run in beeld gekomen en dus niet in de praktijk getoetst — B9 rust volledig op de motorcode.
- De iPad-run is niet onder de 40% gezakt, dus het doodlopende eindscherm is niet op touch-formaten nagespeeld; het kan daar visueel anders uitpakken.
- Mogelijke race condition bij dubbelklikken op SUBMIT vlak vóór de auto-doorstroom (dubbele puntentoekenning) is niet uitgesloten.
- Het lege-scherm-risico bij configdrift (B10) is niet gereproduceerd — met de huidige config waren alle herlaadtests schoon.
- Of de wachtwoordvalidator een té kort wachtwoord mét alle vier tekentypes correct afwijst is niet getest; alleen het positieve pad en het 'woord/herhaling toegestaan'-gat zijn bevestigd.
- Tijdens de Playwright-run verschenen twee onverklaarde extra browsertabbladen (Google-zoekopdracht en x.com) die niet uit een klik op de missiepagina voortkwamen — waarschijnlijk een artefact van de gedeelde browseromgeving; geen aanwijzing dat het de meting heeft beïnvloed.
