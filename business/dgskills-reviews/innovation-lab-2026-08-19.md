## Opdracht Live Check: innovation-lab — J3P3 (motor builder-canvas)

**Advies:** fix-eerst
**Risico:** Geel
**Getest als:** gesimuleerde leerlingen (serieuze baseline · sjoemelaar · worstelaar · iPad via Playwright) op de dev-previewroute, zonder login
**Datum:** 2026-08-19

### In één alinea
De missie laat leerlingen in vier stappen een innovatie-idee uitwerken tot een concreet plan. Een serieuze leerling haalt zonder problemen de volle 100 punten en de titel 'Top Innovator'. Een sjoemelaar haalt echter ook 100 punten met vier volstrekt irrelevante zinnen en het aanklikken van alle checklistvakjes — de controle kijkt alleen naar de vorm van het antwoord, niet naar de inhoud. Een onzekere leerling loopt vast bij het bewijsveld in Stap 1, waar de teller 'voldaan' toont maar de knop uit blijft zonder uitleg. Het oordeel is fix-eerst: de missie is didactisch sterk, maar de inhoudsblinde controle en het structureel onmogelijke zakken ondermijnen de geloofwaardigheid.

### Scores per profiel
| Profiel | Resultaat |
|---|---|
| Serieuze baseline | 100/100 (100%) 'Top Innovator', Gehaald — zowel eerlijk als met inhoudsloze gok-zinnen |
| Sjoemelaar | 100/100 (100%) 'Top Innovator', Gehaald — met vier volstrekt irrelevante zinnen + 16 zelfrapportage-vinkjes |
| Worstelaar | 100/100 (100%) eerlijk; gokproef met onzin-tekst: 0/100, geblokkeerd op de vorm-poort in Stap 1 |
| iPad (Playwright) | niet gemeten |

### Bevindingen
1. **MAJOR** · motor · bevestigd — De tekstcontrole keurt alleen de vorm (lengte, aantal woorden), nooit of het antwoord over de opdracht gaat. Vier irrelevante zinnen over gitaar, weer, eten en film leveren de volle 100 punten op. _Bewijs: run-digisterke-dani.json F1; run-creatieve-cheater.json F1; engine builder-canvas.json topIssues[0]_
2. **MAJOR** · motor · bevestigd — Zakken is structureel onmogelijk: het resultatenscherm is alleen bereikbaar als alle stappen zijn doorlopen, en er zijn geen verdiepingsvragen. Elke afronding komt dus altijd exact op 100/100 uit; de 40%-drempel en de badgeladder meten niets. _Bewijs: run-digisterke-dani.json F2; engine topIssues[1]; config innovation-lab.ts:19-91_
3. **MINOR** · motor · bevestigd — Het bewijsveld in Stap 1 blokkeert bij afgekeurde tekst zonder uitleg: de teller toont '49/45' (voldaan) maar de knop blijft uit. Het hoofdtekstveld toont in dezelfde situatie wél een hint. _Bewijs: run-onzekere-noor.json F1; engine gates[0] (StepInstructionPanel.tsx:195-202 vs 160-167)_
4. **MINOR** · motor · bevestigd — De eindknop 'Missie voltooid! 🎉' heeft geen dubbelklik-bescherming: twee snelle klikken vuren twee keer de afrondingsactie. In de preview onschadelijk, maar in productie kan dit meerdere keren een voltooiing aanroepen. _Bewijs: run-creatieve-cheater.json F3; engine gates[4] (BuilderCanvas.tsx:264-271)_
5. **MINOR** · motor · bevestigd — Terugklikken naar een voltooide stap en een checklistvakje uitvinken trekt de al toegekende punten niet terug. Geen exploit, maar wel inconsistent gedrag. _Bewijs: run-creatieve-cheater.json F2_
6. **MINOR** · motor · onbevestigd — De AI-coach gaf op een hulpvraag de kale foutmelding 'Je sessie is verlopen. Log opnieuw in.' in plaats van de vriendelijke fallback-tekst. Alleen gezien in de dev-preview zonder ingelogde sessie; de missie loopt gewoon door. _Bewijs: run-onzekere-noor.json F2 (artefactChecked:false)_
7. **MINOR** · motor · onbevestigd — De KEES-introkaart zou de 'Start de missie'-knop overlappen (klik kwam niet aan). Alleen DOM-gemeten, niet visueel bevestigd; mogelijk een paneel-/animatie-artefact. _Bewijs: run-onzekere-noor.json F3 (needsPlaywright:true)_

### Wat goed werkte
- Vorm-poort blokkeert echte rommel: herhaalde tekens en keyboard-mash hielden 'Volgende stap' dicht in alle drie de runs
- Dichte knop is niet te forceren: pointerdown op de disabled knop vuurt geen click
- Dubbelklik op 'Volgende stap' slaat geen stap over en kent geen dubbele punten toe
- Herladen midden in een stap herstelt fase, stap, score, vinkjes en tekst exact; &reset=1 start schoon
- Wissen en herschrijven van een half antwoord kost niets — geen data- of puntenverlies
- Geen giveaways: geen antwoorden, tellers of badges zichtbaar vóór indienen
- Didactisch sterke opbouw: concrete deelvragen per stap, goede voorbeelden (Airbnb-MVP, WhatsApp-analogie), duidelijke voortgang en warme eindfeedback

### Reparatiekandidaten (niet uitgevoerd — ter beslissing)
| # | Wat | Waar | Omvang | Waarom |
|---|---|---|---|---|
| 1 | Inhoudskoppeling in de tekstpoort: toets of het antwoord over de opdracht gaat (steekwoorden per stap of AI-rubric) | motor | groot | Kernzwakte B1: plausibele onzin geeft nu de volle 100 en dezelfde lof als een sterk antwoord — beloont afraffelen actief, raakt alle 19 builder-canvas-missies |
| 2 | Maak de voltooiingsdrempel betekenisvol: laat stappunten (deels) van antwoordkwaliteit afhangen of maak een niet-100%-uitkomst bereikbaar | motor | middel | B2: afronden = altijd 100%, dus 'Gehaald/Nog niet gehaald' en de badgeladder differentiëren niets |
| 3 | Voeg verdiepingsvragen (bonus) toe aan de innovation-lab-config en zet een hogere minTextLength (zoals app-prototyper/web-developer: 150-200) | config | klein | Mitigeert B1/B2 voor déze missie zonder motorwijziging: introduceert scorevariatie en maakt gok-zinnen van 40 tekens onvoldoende |
| 4 | Geef het bewijsveld dezelfde kwaliteitshint als het hoofdtekstveld wanneer de tekst wordt afgekeurd | motor | klein | B3: nu toont het veld een voldane teller terwijl de knop dicht blijft — het belangrijkste frictiepunt voor onzekere leerlingen, geldt voor alle 8 configs met bewijsvelden |
| 5 | Dubbelklik-bescherming op 'Missie voltooid!': knop disabled/loading zodra handleComplete loopt | motor | klein | B4: voorkomt meerdere onComplete-aanroepen in productie |
| 6 | Vang de 'sessie verlopen'-fout in de AI-chat af met de bestaande vriendelijke fallback-regel | motor | klein | B6 (onbevestigd): een kale auth-foutmelding op een hulpzoekmoment is het tegendeel van houvast; eerst reproduceren in een ingelogde omgeving |

### Nog onzeker
- mobiel/tablet niet gemeten — Playwright is op verzoek van Yorin uitgeschakeld (venster stal focus)
- KEES-kaart-overlap over de startknop (B7) is alleen DOM-gemeten, niet visueel bevestigd — mogelijk paneel-/animatie-artefact; alleen met Playwright te beslechten
- AI-coach-foutmelding (B6) is chat-afhankelijk en alleen in de dev-preview zonder sessie gezien; of de nette fallback in productie wél verschijnt is lokaal niet vast te stellen
- De toast-herlaadproef (showMilestone blijft permanent hangen bij herlaad binnen ~2s na een stapovergang, engine-risico) is in geen van de drie runs uitgevoerd
- Enkele klikken in de runs verliepen via een in-page el.click()-fallback na paneel-stagnatie; de uitkomsten zijn telkens via paginatekst/event-probe bevestigd, maar het gedeelde browserpaneel bleef een storingsbron
