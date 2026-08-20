## Opdracht Live Check: portfolio-builder — J3P4 (motor builder-canvas)

**Advies:** fix-eerst
**Risico:** Geel
**Getest als:** gesimuleerde leerlingen (serieuze baseline · sjoemelaar · worstelaar · iPad via Playwright) op de dev-previewroute, zonder login
**Datum:** 2026-08-19

### In één alinea
De missie laat leerlingen in vier stappen een portfolio opbouwen met reflecties en een profieltekst. Een eerlijke leerling haalt 100/100, maar een sjoemelaar haalt ook 100/100 door per stap één willekeurige zin over pizza of het weer te typen en alle vinkjes aan te zetten — de controle kijkt alleen naar lengte, niet naar inhoud. Een taalzwakke leerling komt er ook doorheen dankzij de korte checklistvragen, maar loopt vast bij het bewijsveld: de teller zegt 45/45 terwijl de knop uit blijft, en de hint noemt 40 tekens. Zakken is onmogelijk: elke afgeronde missie is per definitie 100/100. Het advies is fix-eerst: de tekstpoort moet inhoudelijk worden of de uitslag moet eerlijk worden gemaakt.

### Scores per profiel
| Profiel | Resultaat |
|---|---|
| Serieuze baseline | 100/100 (100%) — Gehaald, eerlijk gespeeld |
| Sjoemelaar | 100/100 (100%) — Gehaald met 4 volledig off-topic zinnen (pizza/weer) + 16 vinkjes; pure tekenherhaling ('aaaa...') kwam niet voorbij stap 1 |
| Worstelaar | 100/100 (100%) — Gehaald met korte, eenvoudige maar eerlijke antwoorden |
| iPad (Playwright) | niet gemeten |

### Bevindingen
1. **MAJOR** · motor · bevestigd — De score controleert nooit of de tekst over de opdracht gaat: vier irrelevante zinnen plus alle vinkjes geven exact dezelfde 100/100 als een eerlijke poging. _Bewijs: run-creatieve-cheater.json F1 (volledige off-topic-run 100/100); config zonder minTextLength_
2. **MAJOR** · motor · bevestigd — Zakken is structureel onbereikbaar: elke afgeronde missie is per definitie 100/100, want alle 4 stappen moeten volledig door de poort en er zijn geen bonusvragen. _Bewijs: run-creatieve-cheater.json F6 (geen route naar onvolledige afronding gevonden)_
3. **MAJOR** · motor · bevestigd — Het bewijsveld blokkeert bij lange-maar-inhoudsloze tekst terwijl de teller 45/45 toont, en de knop-hint noemt 40 tekens waar het veld 45 eist — twee getallen voor wat als dezelfde eis leest. _Bewijs: run-taalzwakke-tess.json F1+F2 (teller '45/45' naast knop-hint '40 tekens', knop uit zonder uitleg)_
4. **MINOR** · missie · bevestigd — Instructieteksten zijn talig zwaar voor A2-B1-leerlingen ('meest representatieve werk', 'niet-identificerende vooruitblik'); de checklist-items redden de missie maar de nuance gaat verloren. _Bewijs: run-taalzwakke-tess.json F3; config: portfolio-builder.ts:24,80_
5. **MINOR** · motor · weerlegd — UI-trucs zoals dubbelklikken, terugklikken+uitvinken en leeg indienen leveren geen scorevoordeel of crash op; er is geen route om een stap over te slaan. _Bewijs: run-creatieve-cheater.json F4+F5 (geen dubbele stap-sprong, geen score-mutatie bij uitvinken)_
6. **MINOR** · motor · onbevestigd — Een herlaad binnen ~1-2 seconden na een stapovergang zou de toast '✓ x/4 voltooid!' permanent kunnen laten hangen; dit is niet nagespeeld. _Bewijs: engine-codeanalyse BuilderCanvas.tsx:76,229-234; in geen van de drie runs nagespeeld_

### Wat goed werkte
- Eén-herhaald-teken-geramte ('aaaa aaaa...') wordt consequent geblokkeerd, ook nadat de lengte-eis is gehaald; het hoofdveld geeft daarbij een duidelijke hint
- Herladen is betrouwbaar: midden in de missie herstelt een reload exact dezelfde stap, score en teksten; &reset=1 begint schoon
- Geen verklappingen: nergens juiste antwoorden of 'x van y goed'-tellers zichtbaar vóór afronding
- Dubbelklikken, terugklikken+uitvinken en leeg indienen leveren geen exploit of crash op
- Geen console-fouten en geen netwerkfouten in alle drie de runs
- Checklist-items zijn kort en concreet en fungeren als effectief vangnet voor taalzwakke leerlingen; voortgangsfeedback is duidelijk en motiverend

### Reparatiekandidaten (niet uitgevoerd — ter beslissing)
| # | Wat | Waar | Omvang | Waarom |
|---|---|---|---|---|
| 1 | Bewijsveld dezelfde kwaliteitshint geven als het hoofdveld en de knop-hint het juiste veld en getal laten noemen | motor | klein | Toon de al berekende hint onder het bewijsveld zodra lengte gehaald is maar de kwaliteitscheck faalt; herformuleer de knop-hint zodat die niet met het 45-tekens-bewijsveld botst — lost B3 op voor alle 8 missies met een bewijsveld |
| 2 | Inhoudelijke lat voor portfolio-builder verhogen via config (minTextLength per stap) | config | klein | Mitigeert B1 zonder motorwijziging: reflecties van 60-100 woorden horen niet op een default van 40 tekens te staan |
| 3 | Tekstpoort inhoudelijk maken of de uitslag eerlijk: opdracht-relevantiecheck dan wel de schijn-uitslag 'Gehaald' loskoppelen van gegarandeerde 100% | motor | groot | Zolang elke afronding 100/100 oplevert en de tekst nooit tegen de opdracht wordt gehouden, meet de missie zelfrapportage in plaats van leren |
| 4 | Instructieteksten van portfolio-builder vereenvoudigen naar A2-B1 | config | klein | Vervang zinnen als 'meest representatieve werk' en 'niet-identificerende vooruitblik' door eenvoudige taal, in lijn met de checklist-items die al goed werken |
| 5 | showMilestone uit de autosave houden of bij herstel de 2s-timer opnieuw starten | motor | klein | Voorkomt een permanent hangende toast na een ongelukkig getimede herlaad (B6, onbevestigd maar uit code aannemelijk) |

### Nog onzeker
- mobiel/tablet niet gemeten — Playwright is op verzoek van Yorin uitgeschakeld (venster stal focus)
- AI-chat (optionele hulp, geen poort of score) is in geen van de drie runs geopend of getest
- De showMilestone-toast-hang bij herlaad binnen ~2s (B6) is niet nagespeeld; alleen uit engine-code afgeleid
- Dat gevarieerd geramte de poort passeert is afgeleid uit code en niet live nagespeeld — de runs testten alleen één-herhaald-teken-patronen en plausibele volzinnen
- De cheater-run kon geen screenshots maken ('Browser pane is not displayed'); alle observaties in die run zijn DOM-gebaseerd, de visuele laag is daar niet beoordeeld
