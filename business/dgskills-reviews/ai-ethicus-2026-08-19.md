## Opdracht Live Check: ai-ethicus — J2P4 (motor debate-arena)

**Advies:** fix-eerst
**Risico:** Geel
**Getest als:** gesimuleerde leerlingen (serieuze baseline · sjoemelaar · worstelaar · iPad via Playwright) op de dev-previewroute, zonder login
**Datum:** 2026-08-19

### In één alinea
De missie laat leerlingen vier stakeholderperspectieven lezen, een positie kiezen en drie argumenten geven over AI-ethiek. Een serieuze leerling haalt 100/100, maar een sjoemelaar haalt ook 100/100 met pure onzin — de inhoudscheck telt alleen lengte, niet kwaliteit. Een worstelaar loopt vast in de Challenge- en Reflect-fase: de teller toont "voldaan" maar de doorgaan-knop blijft zonder uitleg uit. Zakken onder 40% is structureel onmogelijk; de laagst haalbare score is 83%. Het oordeel is fix-eerst: de missie-inhoud is sterk, maar de motor laat sjoemelen toe en heeft een onverklaarbaar vastloopmoment.

### Scores per profiel
| Profiel | Resultaat |
|---|---|
| Serieuze baseline | 100/100 (100%) eerlijk; 83/100 (83%) gok — beide 'Gehaald' |
| Sjoemelaar | 100/100 (100%) 'Gehaald' met identieke grensstrings + 'qwerty qwerty qwerty' als 3e argument |
| Worstelaar | 83/100 (83%) eerlijk (2 van 3 argumenten) én 83/100 gok met 5x dezelfde vulzin — identieke uitkomst |
| iPad (Playwright) | niet gemeten |

### Bevindingen
1. **MAJOR** · motor · bevestigd — In Challenge en Reflect toont de teller "voldaan" terwijl de doorgaan-knop zonder uitleg uit blijft; de bestaande hint die dit oplost wordt alleen in Argue getoond. _Bewijs: 3x DOM-bevestigd (alle runs); ChallengePhase.tsx:56-58,72 en ReflectPhase.tsx:54-56,108 missen de hint die ArguePhase.tsx:103-107 wél rendert_
2. **MAJOR** · motor · bevestigd — De inhoudscheck is zuiver structureel (lengte, woord- en letteraantal); exact dezelfde grensstring in alle 7 velden gaf 100/100, en een derde onzin-argument tilde 83 naar 100. _Bewijs: run-creatieve-cheater.json F2+F3 (scorechip 53→70, eindscherm 100/100); engine: answerQuality.ts:11,18,20,51-56_
3. **MAJOR** · motor · bevestigd — Zakken is structureel onmogelijk: elke fasepoort dwingt dezelfde structurele toets af, dus de laagst haalbare eindscore is 83/100; de 40%-slaagdrempel is dode code. _Bewijs: alle drie runs eindigden op 83 of 100; engine: poorten + CompletionScreen.tsx:65 (passed >= 40%)_
4. **MINOR** · missie · weerlegd — Correctie op de motoranalyse: de live ai-ethicus-config heeft 2 reflectievragen, niet 3; de voorspelde fasetabel-mismatch bestaat hier niet, de tabel telt exact op. _Bewijs: configs/ai-ethicus.ts:84-87 (2 reflectionQuestions, maxScore 100); 2 runs zagen live precies 2 vragen_
5. **MINOR** · motor · bevestigd — Geen lees-eis op de Explore-poort: vier keer blind "Gelezen ✓" klikken levert direct de volle 10/10 op. _Bewijs: run-creatieve-cheater.json stap 2; run-digisterke-dani.json gokrun (10/10 zonder lezen); engine: ExplorePhase.tsx:106-113_
6. **MINOR** · motor · bevestigd — De Kees-eindfeedback is niet kwaliteitsgevoelig: "Top gedaan!" bij letterlijk 'qwerty qwerty qwerty' en "Netjes!" bij vijf identieke vulzinnen. _Bewijs: run-creatieve-cheater.json stap 11 + giveaways; run-digisterke-dani.json F3_
7. **MINOR** · motor · bevestigd — De positiekeuze krijgt nooit enige bevestiging of reactie; bewust ontwerp (debat, geen goed/fout), maar voor een onzeker profiel een gemiste geruststellingskans. _Bewijs: run-onzekere-noor.json F4 + personaNotes; config positions (ai-ethicus.ts:62-83) hebben alleen id/label/description_
8. **MINOR** · motor · bevestigd — Wissen en herschrijven is veilig (geen puntenverlies), maar er is geen waarschuwing of undo vóór het wissen — een impulsieve wisser krijgt een onnodig schrikmoment. _Bewijs: run-onzekere-noor.json F3 (stap 4: veld gewist, score bleef 20 pts)_
9. **MINOR** · motor · onbevestigd — De tekenteller krijgt geen zichtbare "voldaan"-stijlwissel: '99/20 min.' oogt identiek aan '14/20 min.'; niet door Playwright bevestigd. _Bewijs: run-onzekere-noor.json F5 (artefactChecked:false)_
10. **MINOR** · motor · bevestigd — De registry kondigt een AI-chatrol aan die de debate-arena-motor nergens rendert — dormant metadata; in geen van de drie runs was een chat zichtbaar. _Bewijs: engine chatDependency: templateRegistry.ts:88-97 versus DebateArena.tsx:34-53 (geen enableChat-veld)_

### Wat goed werkte
- Volledig speelbaar zonder blocker in alle drie runs: intro tot eindscherm, fasetabel telt exact op tot de kopscore, geen console-fouten, geen falende requests, geen netwerkafhankelijkheid
- Autosave en hervatten werken correct: herladen zonder &reset=1 herstelt exact dezelfde fase, teksten, gelezen-status en score (3x bevestigd, ook midden in Explore); ?reset=1 begint aantoonbaar schoon
- De structurele poortcheck vangt simpele spam wél: 'aaaa aaaa aaaa' geweigerd (cheater én struggler-gokrun) en 22x hetzelfde teken geweigerd in Challenge — de gate zelf werkt, alleen de uitleg erbij ontbreekt (B1)
- Geen verklapping: nergens juiste antwoorden, volgorde of 'x van y goed' zichtbaar vóór het kiezen; voortgangsmarkers tonen alleen afgerond/geldig, geen inhoudsoordeel (baseline F5, struggler giveaways)
- State is robuust: terug-navigeren en van positie wisselen geeft geen dubbeltelling; dubbelklik op een fase-overgangsknop geeft één schone overgang zonder corruptie (cheater F5)
- De missie-eigen inhoud is sterk: 4 genuanceerde, goed geschreven stakeholderperspectieven, 4 gelijkwaardige posities, een scherp tegenargument en inhoudelijk goede takeaways — het fix-eerst-oordeel wordt volledig door de motorbevindingen B1-B3 gedragen, niet door deze config

### Reparatiekandidaten (niet uitgevoerd — ter beslissing)
| # | Wat | Waar | Omvang | Waarom |
|---|---|---|---|---|
| 1 | Toon de bestaande answerQualityHint ook in de Challenge- en Reflect-fase | motor | klein | De hint bestaat al (ArguePhase/answerQuality.ts) en lost het 3x DOM-bevestigde vastloopmoment op waar de teller 'voldaan' toont maar de knop zonder uitleg uit blijft |
| 2 | Weiger identieke antwoorden over velden heen en heroverweeg de 83%-ondergrens tegenover de 40%-slaagdrempel | motor | middel | Vijf keer dezelfde zin of grensstrings leveren nu 83-100/100 'Gehaald'; de score meet alleen doorloopgedrag en het docentdashboard krijgt een betekenisloos percentage |
| 3 | Leesbevestiging op de Explore-poort (korte dwell-tijd of mini-vraag per stakeholder) | motor | middel | De volle 10/10 is nu met vier blinde klikken te halen, terwijl het lezen van de perspectieven de didactische kern van de fase is |
| 4 | Temper de Kees-eindfeedback of koppel haar aan een kwaliteitssignaal | motor | klein | 'Top gedaan! Dit zat echt goed in elkaar.' bij pure onzin suggereert begrip dat er niet was en beloont sjoemelen |
| 5 | Geef de teller een zichtbare 'voldaan'-stijl gekoppeld aan de echte poortcheck | motor | klein | '127/20 min.' oogt identiek aan '14/20 min.' en de teller kan 'voldaan' tonen terwijl de poort dicht is; koppel de visuele status aan isMeaningfulAnswer, niet aan tekenlengte |
| 6 | Korte neutrale bevestiging na de positiekeuze ('genoteerd — er is hier geen goed of fout') | motor | klein | Een onzeker profiel krijgt nu nul reactie op de standpuntkeuze; een expliciete geen-goed/fout-boodschap stelt gerust zonder een juist antwoord te suggereren |
| 7 | Dormante chatrol voor ai-ethicus in de registry opruimen of implementeren | config | klein | templateRegistry kondigt een AI-rol aan die de motor nooit rendert — misleidende metadata richting dashboard en leerling |

### Nog onzeker
- mobiel/tablet niet gemeten — Playwright is op verzoek van Yorin uitgeschakeld (venster stal focus)
- De teller-stijlwissel-claim (B9, geen 'voldaan'-indicatie bij '99/20'/'127/20') is artefactChecked:false en niet door Playwright bevestigd — telt als onbevestigd, geen blocker
- De dormante chatrol (B10) steunt op code-bewijs uit de motoranalyse; de runs stelden alleen passief vast dat er geen chat-UI zichtbaar was, er is niet actief naar een chatknop gezocht
- Niet elke van de 4 positiekaarten is individueel op puntentoekenning getest; twee verschillende kaarten gaven beide 10/10, de overige twee zijn aangenomen gelijk (run-onzekere-noor.json unsure)
- De 83-referentie in de cheater-run is een afgeleide tussenmeting (53 pts bij 2/3 argumenten + vaste bijdragen), maar wordt onafhankelijk bevestigd door de twee volledige 83-runs van baseline-gok en struggler
- Omgevingsartefact zonder missie-impact: ref-kliks na een page-navigate registreerden soms 0 events in het gedeelde browservenster; verse screenshot + coördinaatklik loste dit telkens op (run-digisterke-dani.json F6)
