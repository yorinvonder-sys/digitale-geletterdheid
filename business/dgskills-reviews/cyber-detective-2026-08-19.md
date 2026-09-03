## Opdracht Live Check: cyber-detective — J3P2 (motor puzzle-lab)

**Advies:** fix-eerst
**Risico:** Rood
**Getest als:** gesimuleerde leerlingen (serieuze baseline · sjoemelaar · worstelaar · iPad via Playwright) op de dev-previewroute, zonder login
**Datum:** 2026-08-19

### In één alinea
De missie laat een leerling vier digitale puzzels oplossen over cybercriminaliteit. Een serieuze leerling haalt moeiteloos 100/100, maar een sjoemelaar haalt dat ook zonder één alinea te lezen: de laatste puzzel geeft het antwoord al in de opgave, en fout gokken levert gratis verklappende aanwijzingen op. Een worstelaar die onder de 40% zakt komt vast te zitten op een eindscherm zonder uitweg, ook na herladen. Daarmee is de missie niet veilig om in te zetten: de kernvraag "kan een leerling zonder inhoud slagen" is met ja beantwoord, en de afhaakroute voor een onzekere leerling is een doodlopende straat.

### Scores per profiel
| Profiel | Resultaat |
|---|---|
| Serieuze baseline | eerlijk 100/100 (100%), 'Hoofd Forensisch Analist', alle 4 puzzels 25/25 in één poging; blind dezelfde optie herhalen gaf 0/100 (0%) |
| Sjoemelaar | 100/100 (100%) via eliminatie-gokken + gratis verklappende aanwijzingen + placeholder-antwoord, zonder één alinea inhoudelijk te lezen; bewust falen gaf 0/100 |
| Worstelaar | eerlijk 100/100 (100%); gokvariant 0/100 (0%) |
| iPad (Playwright) | 100/100 (100%) op 820x1180; geen horizontale scroll op 820x1180, 1180x820 en 390x844; alle gemeten tapdoelen >=44px |

### Bevindingen
1. **BLOCKER** · motor · bevestigd — Onder de 40%-drempel is het eindscherm een doodlopende straat: de enige knop staat uit en herladen brengt de leerling terug op hetzelfde vastgelopen scherm. _Bewijs: run-digisterke-dani.json F1 (enige knop, disabled:true); run-ipad-iris.json I1 + verified#3_
2. **MAJOR** · missie · bevestigd — Het voorbeeld in de opgave van puzzel 4 ('bijv: 2-4-1-3') is letterlijk de antwoordsleutel; overtypen levert 25 punten op zonder te ordenen. _Bewijs: configs/cyber-detective.ts:113 vs :123; run-creatieve-cheater.json F3 + stap 5_
3. **MAJOR** · motor · bevestigd — Twee bewust foute antwoorden ontgrendelen gratis aanwijzingen die het antwoord vrijwel letterlijk noemen, terwijl de betaalde hintknop (-4 pts) ernaast blijft staan. _Bewijs: configs/cyber-detective.ts:89-93 en :106; run-creatieve-cheater.json F4 + stap 4_
4. **MAJOR** · motor · bevestigd — Drie meerkeuzevragen met vier opties en drie pogingen geven per puzzel ~75% kans zonder de vraag te lezen; samen met B2 en B3 ligt de gokopbrengst ruim boven de slaagdrempel. _Bewijs: run-creatieve-cheater.json F2 + stappen 2-5; configs/cyber-detective.ts:42/72/102_
5. **MINOR** · motor · bevestigd — Na de laatste mislukte poging wordt noch het juiste antwoord noch uitleg getoond; de leerling gaat door met alleen 'VOLGENDE PUZZEL →'. _Bewijs: run-digisterke-dani.json F4; run-onzekere-noor.json F4_
6. **MINOR** · motor · bevestigd — De 'overslaan →'-knop is op alle vier de puzzels vanaf binnenkomst zichtbaar, met nul eigen pogingen; opgeven is even makkelijk als antwoorden. _Bewijs: run-ipad-iris.json I4 + verified#4; run-creatieve-cheater.json stap 7_
7. **MINOR** · motor · onbevestigd — Geen bereikcontrole op herstelde opslag: een gewijzigde config kan na een update een leeg scherm opleveren zonder terug- of resetknop. _Bewijs: _engines/puzzle-lab.json topIssue major (PuzzleLab.tsx:87-90 en 288). Niet uitgelokt in enige speelrun_
8. **MINOR** · motor · onbevestigd — Contrast- en leesbaarheidsproblemen in de vaste schil: hintknop onzichtbaar bij hover, optieknoppen geen zichtbare hover, vaste labels op 10-11 px met verlaagde dekking. _Bewijs: _engines/puzzle-lab.json topIssue minor (PuzzleLab.tsx:460, 410, 321-339). Niet getest in de speelruns_
9. **MINOR** · motor · onbevestigd — Toegankelijkheid feedbackbanner: role='status' met aria-live='assertive' is tegenstrijdig, en animate-pulse respecteert prefers-reduced-motion niet. _Bewijs: _engines/puzzle-lab.json topIssue minor (PuzzleLab.tsx:392-396 en 62). Geen van de vier runs heeft dit gemeten_
10. **MINOR** · missie · weerlegd — De motorclaim dat de open eindvraag 'alleen op trefwoorden plus 30 tekens' wordt gekeurd gaat hier niet op: puzzel 4 heeft een exacte antwoordsleutel en onzin wordt afgekeurd. _Bewijs: configs/cyber-detective.ts:123; run-digisterke-dani.json F3 en run-creatieve-cheater.json stap 5_
11. **MINOR** · motor · weerlegd — De claim dat 'overslaan' op puzzel 1 pas na de eerste foute poging verschijnt klopt niet: hij staat overal vanaf binnenkomst. _Bewijs: run-ipad-iris.json verified#4 (WEERLEGD, twee aparte doorlopen)_

### Wat goed werkte
- Eerlijk spelen werkt vlekkeloos: drie personas haalden 100/100 in één poging per puzzel; opbouw fragment → aanwijzingen → vraag → opties is helder en de aanwijzingen staan standaard open.
- Feedback is duidelijk en op tijd: 'ACCESS GRANTED', oplopende TOTAAL SCORE en automatische doorgang na ~2s; eindscherm toont badge, subscores en 5 leerpunten.
- Geen giveaways in de multiple-choice opties zelf: geen vinkje, kleurcode of 'x van y goed'-teller vóór het kiezen.
- Onzin-invoer bij puzzel 4 wordt correct afgekeurd ('aaaa aaaa aaaa' en '9-9-9-9' → geen punten).
- Herlaad- en resetgedrag klopt: herladen midden in de missie herstelt exact dezelfde puzzel én score, en &reset=1 begint gegarandeerd schoon.
- Dubbelklikken op SUBMIT levert geen dubbele score of crash op.
- Geen console- of netwerkfouten in geen enkele run; puzzle-lab draait volledig lokaal, dus geen laad- of AI-afhankelijkheid.
- Tablet en telefoon zijn in orde: geen horizontale scroll op 820x1180, 1180x820 en 390x844, alle gemeten tapdoelen >=44px, geen hover-only informatie, geen sleepinteracties.

### Reparatiekandidaten (niet uitgevoerd — ter beslissing)
| # | Wat | Waar | Omvang | Waarom |
|---|---|---|---|---|
| 1 | Geef het eindscherm een werkende uitweg bij een score onder de slaagdrempel | motor | middel | Nu is de enige knop uitgeschakeld en bestaat er geen terug-, opnieuw- of sluitknop; herladen brengt de leerling terug op hetzelfde scherm. Dit is de enige bevinding die de missie van 'ship' afhoudt en raakt alle puzzle-lab-missies. |
| 2 | Vervang het voorbeeldformaat in puzzel 4 door een volgorde die niet het antwoord is | config | klein | De opgave noemt nu letterlijk '2-4-1-3' als voorbeeld terwijl dat de antwoordsleutel is; kies een aantoonbaar onjuist voorbeeld zodat de laatste puzzel weer redeneerwerk vraagt. |
| 3 | Ontkoppel de gratis extra aanwijzingen van foute pogingen, of verberg de betaalde hintknop zodra ze zichtbaar zijn | motor | middel | Twee keer bewust fout antwoorden levert nu gratis een bijna-antwoord op, terwijl de hintknop punten kost voor dezelfde informatie. De prikkel beloont gokken en bestraft eerlijk hulp vragen. |
| 4 | Toon na de laatste mislukte poging het juiste antwoord met een korte uitleg | motor | klein | Nu verschijnt alleen 'VOLGENDE PUZZEL →'; een leerling die twijfelde en fout koos leert niets en blijft met haar onzekerheid zitten. |
| 5 | Maak blind gokken duurder op de multiple-choice puzzels | motor | middel | Vier opties met drie pogingen betekent ~75% kans per puzzel zonder de vraag te lezen. Denk aan minder pogingen, puntenaftrek per foute poging of een korte wachttijd. |
| 6 | Bied 'overslaan' pas aan na minimaal één echte poging | motor | klein | De knop staat nu op elke puzzel vanaf seconde nul zichtbaar, waardoor opgeven even makkelijk is als antwoorden — precies het afhaakpunt van een onzekere leerling. |
| 7 | Valideer herstelde voortgang tegen de huidige configuratie | motor | middel | Zonder validate-callback kan een gewijzigde of ingekorte missieconfig na een update een leeg scherm opleveren zonder uitweg — hetzelfde soort dead-end als de blocker. |
| 8 | Herstel contrast en tekstgrootte in de vaste schil | motor | klein | Hintknop wordt onzichtbaar bij hover, optieknoppen hebben geen zichtbare hover-staat en vaste labels staan op 10-11 px met verlaagde dekking; nog niet in een speelrun bevestigd. |

### Nog onzeker
- Gedrag bij een score tussen 40% en 100% (bijvoorbeeld precies op de grens) is in geen enkele run apart getest; alleen 0% en 100% zijn waargenomen.
- Gedrag na de 5e mislukte poging op puzzel 4 (maxAttempts 5) is niet uitgespeeld; alle runs gingen eerder via 'overslaan' verder.
- Of onComplete en daarmee de docentrapportage bij een mislukte poging werkelijk uitblijft (motorclaim) is in de dev-preview niet te verifiëren.
- Contrast-/hoverprobleem van de hintknop en de exacte pixelgrootte van de kleine vaste labels zijn niet gemeten; niet van toepassing op een touch-leerling.
- Interne horizontale scroll binnen het codeblok van puzzel 1 (het logfragment) is niet los van document.scrollWidth gemeten op de drie formaten.
- Het validate-callback-risico op herstelde opslag is niet uitgelokt: alle reloadtests draaiden op een ongewijzigde config.
- De letterlijke tekst van de feedbackbanner bij een fout antwoord is niet woordelijk vastgelegd (page-text was afgekapt); de kern — geen antwoord getoond — is wel bevestigd.
