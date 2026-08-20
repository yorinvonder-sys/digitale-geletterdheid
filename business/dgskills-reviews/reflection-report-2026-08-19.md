## Opdracht Live Check: reflection-report — J3P4 (motor debate-arena)

**Advies:** fix-eerst
**Risico:** Geel
**Getest als:** gesimuleerde leerlingen (serieuze baseline · sjoemelaar · worstelaar · iPad via Playwright) op de dev-previewroute, zonder login
**Datum:** 2026-08-19

### In één alinea
Deze missie laat leerlingen een debat voeren over een dilemma, met stakeholders, argumenten en een reflectie. Een serieuze leerling haalt de volle 100 punten, maar een sjoemelaar die blind aanklikt en onzin intypt komt ook op 83 punten en krijgt de hoogste badge. Een taalzwakke leerling loopt vast bij een knop die niet reageert zonder uitleg, en begrijpt de inhoud van het debat niet door moeilijke woorden. Het oordeel is fix-eerst: de motor laat sjoemelen toe en heeft een onduidelijk vastloopmoment, maar het eerlijke pad werkt goed.

### Scores per profiel
| Profiel | Resultaat |
|---|---|
| Serieuze baseline | 100/100 (100%) — Gehaald |
| Sjoemelaar | 83/100 (83%) — Gehaald + hoogste badge 'Debatmeester' |
| Worstelaar | 83/100 (83%) — Gehaald |
| iPad (Playwright) | niet gemeten |

### Bevindingen
1. **MAJOR** · motor · bevestigd — In de Challenge- en Reflect-fase blijft de doorgaan-knop uitgeschakeld zonder uitleg, terwijl de teller zegt dat het antwoord voldoet. De hint die dit oplost bestaat al, maar wordt alleen in de Argue-fase getoond. _Bewijs: run-taalzwakke-tess.json F1 (disabled:true, geen hinttekst); engine ChallengePhase.tsx:56-58,72_
2. **MAJOR** · motor · bevestigd — De inhoudscheck kijkt alleen naar lengte en aantal woorden, niet naar betekenis. Dezelfde onzin-tekst in alle velden levert exact hetzelfde resultaat als een serieus antwoord, zonder waarschuwing. _Bewijs: run-creatieve-cheater.json F2+F3 ('ab cd ef ab cd ef ab' in alle poorten); engine answerQuality.ts:11,18,20_
3. **MAJOR** · motor · bevestigd — Zakken is structureel onmogelijk: de laagst haalbare score is 83/100, dus de 40%-slaagdrempel is dode code. De minimale sjoemelrun eindigde op 83 en kreeg de hoogste badge. _Bewijs: run-creatieve-cheater.json F4+F7 (fasetabel 83); engine poorten ArguePhase.tsx:176, ChallengePhase.tsx:15_
4. **MAJOR** · motor · bevestigd — Blind alle 4 stakeholders 'Gelezen ✓' wegklikken zonder te lezen geeft de volle 10/10. Er is geen leestijd- of interactie-eis. _Bewijs: run-creatieve-cheater.json F1 (score sprong 0->10); engine ExplorePhase.tsx:106-113_
5. **MAJOR** · missie · bevestigd — De teksten zitten vol moeilijke woorden zoals 'verantwoordelijkheidsgevoel', 'digitale ethiek' en 'concurrentiepositie'. Een taalzwakke leerling rondt mechanisch af zonder het debat te begrijpen. _Bewijs: run-taalzwakke-tess.json F2; config reflection-report.ts:19,47,57,88-89_
6. **MINOR** · missie · bevestigd — Reflectievraag 1 is een dubbele vraag in één zin ('Wat heb jij het meest geleerd — en was dat wat je verwachtte te leren?'), met de lastige woordgroep 'verwachtte te leren'. _Bewijs: run-taalzwakke-tess.json F3; config reflection-report.ts:85_
7. **MINOR** · motor · bevestigd — Het contrast van de tekst is te laag (ca. 3,8:1) op bijna alle inhoudsteksten, onder de toegankelijkheidsnorm. Het eindscherm is al gecorrigeerd, de fases niet. _Bewijs: engine topIssues[2] (DebateArena.tsx:289, ExplorePhase.tsx:82,90)_
8. **MINOR** · motor · bevestigd — 'Missie voltooid! 🎉' geeft geen zichtbare reactie maar wist wel de voortgang. Dit is bekend preview-only gedrag, geen bug op het live platform. _Bewijs: run-digisterke-dani.json F5; engine DevMissionPreview.tsx:84,96-97_

### Wat goed werkte
- Geen enkele verklap: geen antwoordsleutels, geen score per optie, geen 'x van y goed' vooraf — in alle drie de runs onafhankelijk gecontroleerd
- Pure tekenherhaling ('aaaaaaaaaaaaaaaaaaaaaa') wordt geweerd door de structurele check; in de argumentfase zelfs met een zichtbare hint
- Herladen zonder &reset=1 hervat exact in dezelfde fase met alle teksten en score intact (3x getest); &reset=1 start gegarandeerd schoon
- Geen consolefouten en geen netwerkfouten in alle drie de runs; de motor is volledig client-side
- De fasetabel telt bij deze config rekenkundig exact op tot het totaal (83 = 10+10+33+10+20; 100 bij volle run) — geen discrepantie zoals bij andere configs
- Eindscherm is helder: duidelijke uitkomst met icoon en label, correcte score en fasetabel, goed focusbeheer; alle knoppen bleken echt klikbaar

### Reparatiekandidaten (niet uitgevoerd — ter beslissing)
| # | Wat | Waar | Omvang | Waarom |
|---|---|---|---|---|
| 1 | Toon de bestaande answerQualityHint ook in de Challenge- en Reflect-fase | motor | klein | De hint bestaat al en wordt alleen in ArguePhase gerenderd; de stille disabled-knop is het meest waarschijnlijke afhaakmoment, in twee runs DOM-bevestigd. |
| 2 | Duplicaatdetectie over de open tekstvelden heen (letterlijk hergebruikt antwoord -> waarschuwing of afkeuring) | motor | middel | Zeven keer exact dezelfde onzin-tekst gaf 83/100 'Gehaald' plus de hoogste badge zonder enige wrijving; het eindscherm toont de duplicaten zelfs letterlijk naast elkaar. |
| 3 | Scorebetekenis herstellen: ondergrens 83 en dode 40%-drempel heroverwegen (strengere weging van open tekst of kwaliteitssignaal richting docent) | motor | groot | 'Gehaald' en het percentage meten nu alleen doorloopgedrag; zakken is onmogelijk en het docentdashboard krijgt een cijfer dat niets over kwaliteit zegt. |
| 4 | Lichte interactie-eis op de explore-poort (minimale kijktijd per stakeholder of één controlevraag) | motor | klein | Blind vier keer 'Gelezen ✓' klikken geeft nu de volle 10/10 zonder dat er iets gelezen is. |
| 5 | Hertaal de dragende missieteksten naar B1-niveau (dilemma, stakeholderquotes, tegenargument, takeaways) | config | middel | Abstract vocabulaire laat een taalzwakke leerling mechanisch afronden zonder het debat te begrijpen — de kern van de missie gaat aan die leerling voorbij. |
| 6 | Maak van reflectievraag 1 één enkelvoudige vraag (of splits in twee aparte vragen) | config | klein | De samengestelde vraag met gedachtestreepje is een extra drempel voor zwakke lezers; onduidelijk welk deel beantwoord moet worden. |
| 7 | Contrast van de motorfase-tekst van duck-ink/60 naar /75 brengen (zoals CompletionScreen al doet) | motor | klein | Ca. 3,8:1 op duck-bg bij 10-12px tekst zit onder AA; het gedeelde eindscherm is al gecorrigeerd, de fases zijn achtergebleven. |

### Nog onzeker
- mobiel/tablet niet gemeten — Playwright is op verzoek van Yorin uitgeschakeld (venster stal focus)
- Het zak-scenario is niet als aparte lege-run afgedwongen; 'structureel onmogelijk' is afgeleid uit de tijdens de runs waargenomen poortvoorwaarden plus de engine-code, niet uit een expliciete poging met 0 argumenten
- Of een leerling als Tess bij de stille Challenge/Reflect-poort daadwerkelijk afhaakt is niet live gemeten; de speler loste het zelf op met een echt antwoord — de vastlooptijd van een echte leerling zonder hulp kan langer zijn
- De contrastbevinding (duck-ink/60) komt uit code-review door de engine, niet uit een visuele meting in deze runs
- 'Missie voltooid! 🎉' zonder zichtbaar effect is preview-only gedrag (onComplete is no-op in /dev/mission-preview); het live afrondgedrag richting de server is in deze runs niet getoetst
