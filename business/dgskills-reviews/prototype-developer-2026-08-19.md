## Opdracht Live Check: prototype-developer — J3P4 (motor builder-canvas)

**Advies:** fix-eerst
**Risico:** Geel
**Getest als:** gesimuleerde leerlingen (serieuze baseline · sjoemelaar · worstelaar · iPad via Playwright) op de dev-previewroute, zonder login
**Datum:** 2026-08-19

### In één alinea
De missie laat leerlingen in vier stappen een eigen prototype bouwen en beschrijven. Een serieuze leerling haalt zonder problemen de volle punten, maar een sjoemelaar haalt die ook: met zestien vinkjes en vier irrelevante zinnen over lunch en weer staat er 100/100. Zakken is met deze opdracht structureel onmogelijk, dus de 40%-drempel zegt niets. Een onzekere leerling loopt nergens definitief vast, maar krijgt op stap 1 wel een foutieve melding die haar zou doen stoppen. Het advies is dan ook: eerst repareren, daarna pas inzetten.

### Scores per profiel
| Profiel | Resultaat |
|---|---|
| Serieuze baseline | 100/100 (100%) — Gehaald, zowel eerlijk als met irrelevante zinnen |
| Sjoemelaar | 100/100 (100%) — Gehaald, zonder één relevante zin over het eigen prototype |
| Worstelaar | 100/100 (100%) — Gehaald (eerlijk); gokproef met geramte correct geblokkeerd (0, kwam niet voorbij stap 1) |
| iPad (Playwright) | niet gemeten |

### Bevindingen
1. **MAJOR** · motor · bevestigd — De tekstpoort kijkt alleen naar lengte en generieke onzin, niet of de tekst over de opdracht gaat; zestien vinkjes plus vier irrelevante zinnen leveren 100/100 op. _Bewijs: run-creatieve-cheater.json F1; engine topIssues[0] (BuilderCanvas.tsx:144-159)_
2. **MAJOR** · motor · bevestigd — Zakken is onmogelijk: geen bonusvragen, vier verplichte stappen van 25 punten, dus wie het eindscherm haalt staat altijd op exact 100/100; de 40%-drempel meet niets. _Bewijs: configcheck prototype-developer.ts (maxScore 100, 4 steps, geen bonusvelden)_
3. **MAJOR** · motor · bevestigd — Bij een complete checklist maar een nog niet goedgekeurd bewijsveld zegt de knop ten onrechte 'Vink alle items af', terwijl alle vakjes al aan staan; voor een onzekere leerling is dit het vastloopmoment. _Bewijs: run-onzekere-noor.json F1; aria-checked 4x 'true' in dezelfde DOM-snapshot_
4. **MAJOR** · motor · bevestigd — Het bewijsveld toont een voldaan-ogende teller ('59/45') maar mist de kwaliteitshint die het hoofdveld wél geeft; de leerling ziet genoeg tekens maar geen knop, zonder uitleg waarom. _Bewijs: run-creatieve-cheater.json F2; StepInstructionPanel.tsx:195-202 vs :160-167_
5. **MINOR** · motor · bevestigd — De knop-hint zegt 'minimaal 40 tekens' terwijl het bewijsveld 45 tekens eist; beide teksten stonden tegelijk op één scherm. _Bewijs: run-onzekere-noor.json F3; configcheck prototype-developer.ts:39 (minLength: 45)_
6. **MINOR** · motor · bevestigd — Terugklikken en een vinkje uitzetten neemt toegekende punten niet terug; voor een sjoemelaar risicoloos, voor een twijfelaar juist een veiligheid. _Bewijs: run-creatieve-cheater.json F4; run-onzekere-noor.json F5_
7. **MINOR** · motor · onbevestigd — Een toast-melding bij stapovergang blijft mogelijk permanent hangen bij herladen binnen twee seconden; drie pogingen leverden niets op, vermoedelijk door tool-vertraging. _Bewijs: engine topIssues[3] (BuilderCanvas.tsx:76,229-234); run-creatieve-cheater.json unsure[0]_
8. **MINOR** · motor · weerlegd — De eerdere lezing dat de 40-tekens-hint op het hoofdveld blijft staan na het halen van de drempel, klopt niet; daar verdwijnt de hint netjes. _Bewijs: run-creatieve-cheater.json F5 (regex-check op de DOM na 50 tekens)_

### Wat goed werkte
- Volledige doorloop werkt in alle drie de runs vlekkeloos: intro → 4 stappen → resultatenscherm, zonder console- of netwerkfouten
- Herladen zonder reset hervat exact (juiste stap, score én tekstinhoud tot op het teken geverifieerd); &reset=1 start aantoonbaar schoon — in totaal 5x getest over de runs
- Eén-herhaald-teken-geramte ('aaaa aaaa…') wordt in zowel hoofd- als bewijsveld echt geblokkeerd: knop bleef disabled:true in de DOM, niet alleen visueel
- Het hoofdtekstveld toont bij onzin wél een duidelijke kwaliteitshint ('Schrijf je antwoord in een paar woorden, als een echte zin.') — de hint-bug uit de baseline bleek daar niet te bestaan (B8)
- Terugklikken, wissen en herschrijven zijn straffeloos — precies de veiligheid die een onzekere leerling nodig heeft (Noor's backtrack-gedrag kostte nergens punten)
- Geen antwoord-verklapping in de UI: geen 'x van y goed'-teller, geen badge-preview, geen inhoudelijke hints vóór het invullen
- Duidelijke steigers per stap (concrete instructies met format-voorbeelden als 'Mijn tool helpt [GEBRUIKER] om...') — de worstelaar kon de missie zonder hulp volgen en afronden
- Dubbelklik op 'Missie voltooid!' gaf geen zichtbare fout of dubbele state (het achterliggende dubbel-vuren-risico is in dev-preview niet toetsbaar)

### Reparatiekandidaten (niet uitgevoerd — ter beslissing)
| # | Wat | Waar | Omvang | Waarom |
|---|---|---|---|---|
| 1 | Blokkade-reden onder de knop per oorzaak tonen: bij complete checklist maar ongeldig bewijsveld de bewijsveld-reden noemen i.p.v. 'Vink alle items af om door te gaan' | motor | klein | Twee onafhankelijke runs zagen de foutieve reden bij 4/4 checklist (B3); voorspelbaar vastloop-/hulpvraagmoment voor onzekere leerlingen. |
| 2 | Bewijsveld dezelfde specifieke kwaliteitshint geven als het hoofdveld zodra de lengte gehaald is maar de kwaliteitscheck faalt | motor | klein | Drie runs bevestigden een voldaan-ogende teller ('59/45') naast een knop die zonder uitleg uit blijft (B4). |
| 3 | Generieke knop-hint het veldspecifieke minimum laten noemen (hier 45) in plaats van de hardcoded 40 | motor | klein | Zichtbare getal-tegenstrijdigheid op één scherm (40 vs 45) voor zorgvuldige lezers (B5). |
| 4 | minTextLength per stap verhogen (bijv. 150, zoals app-prototyper/web-developer al doen) | config | klein | Maakt nep-invullen bewerkelijker als korte-termijnmaatregel, maar lost de inhoudsblindheid zelf niet op — combineren met de motor-kandidaat hieronder. |
| 5 | Inhoudelijke koppeling tussen tekst en opdracht toevoegen (bijv. onderwerps-/trefwoordtoets per stap of een lichtgewicht inhoudscheck) | motor | groot | Kernzwakte: 100/100 met lunch/weer-zinnen in twee onafhankelijke runs; de checklist is pure zelfrapportage (B1). |
| 6 | Verdiepingsvragen met bonuspunten aan deze config toevoegen zodat de uitslag kan differentiëren | config | middel | Nu is elke uitkomst exact 100/100 en meet de 40%-drempel niets (B2). |
| 7 | showMilestone niet mee-opslaan in de autosave, of de 2s-timer herstarten bij hydrate | motor | klein | Code-analyse wijst op een permanent hangende toast bij herlaad binnen ~2s; live onbevestigd gebleven (B7), dus lage prioriteit maar goedkoop te sluiten. |

### Nog onzeker
- mobiel/tablet niet gemeten — Playwright is op verzoek van Yorin uitgeschakeld (venster stal focus)
- Milestone-toast-herlaadbug (B7): 3 reproductiepogingen mislukt, vermoedelijk door tool-latency die het ~1-2s-venster overschreed — onbevestigd, geen weerlegging
- AI-assistent/chat in geen enkele run geopend; volgens de motor-analyse optioneel en niet scorebepalend, maar het live-gedrag (nette foutbubbel in dev-preview) is niet zelf waargenomen
- Geramte-blokkade is alleen aangetoond voor één-herhaald-teken-patronen ('aaaa aaaa…'); varianten zoals 'asdf asdf' zijn niet live getest
- Dubbelklik-risico op 'Missie voltooid!' (meerdere onComplete-aanroepen) is in /dev/mission-preview niet toetsbaar omdat onComplete daar een no-op is
- Delen van de cheater- en struggler-runs gebruikten in-page clicks of leden onder ref-race-artefacten van de gedeelde browsersessie; de kernuitkomsten zijn via aparte DOM-reads herverifieerd, maar niet elke tussenstap was een 'echte' klik. Het bewijsveld-antwoord van de struggler-hoofddoorloop was bovendien deels vervuild door een tooling-artefact (aanplakken i.p.v. vervangen); de score bleef correct
