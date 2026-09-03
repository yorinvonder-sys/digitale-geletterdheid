## Opdracht Live Check: meesterproef — J3P4 (motor builder-canvas)

**Advies:** fix-eerst
**Risico:** Rood
**Getest als:** gesimuleerde leerlingen (serieuze baseline · sjoemelaar · worstelaar · iPad via Playwright) op de dev-previewroute, zonder login
**Datum:** 2026-08-19

### In één alinea
De meesterproef is de eindbeoordelingsmissie van leerjaar 3, waarin een leerling een eigen projectvoorstel en ontwikkelproces moet documenteren. Een eerlijke leerling haalt met goed werk de volle 100 punten, maar een sjoemelaar haalt die ook: vier irrelevante zinnen over de kat en het weer plus het aanvinken van alle checklistvakjes leveren het label 'Meesterproef Geslaagd' op. De tekstpoort controleert alleen of er genoeg tekens staan, niet of de inhoud ergens over gaat. Een worstelaar loopt nergens hard vast — juist het probleem: ook minimale, ongestructureerde invulling wordt beloond met de volle score. De missie meet daardoor op dit moment vrijwel niets.

### Scores per profiel
| Profiel | Resultaat |
|---|---|
| Serieuze baseline | 100/100 (100%) — Gehaald |
| Sjoemelaar | 100/100 (100%) — Gehaald, zonder enige projectinhoud |
| Worstelaar | 100/100 (100%) — Gehaald, met minimale niet-gestructureerde invulling |
| iPad (Playwright) | niet gemeten |

### Bevindingen
1. **MAJOR** · motor · bevestigd — Volle score en 'Meesterproef Geslaagd' zonder dat er een eigen project bestaat: de checklist is zelfrapportage en de tekstpoort keurt alleen vorm (minimaal 40 tekens), nooit of de tekst over het project gaat. De missie gebruikt de lage standaard van 40 tekens, terwijl vergelijkbare missies 150-200 eisen. _Bewijs: cheater-run: 100/100 na 4 irrelevante zinnen; config zonder minTextLength_
2. **MAJOR** · motor · bevestigd — Het SLO-bewijsveld accepteert het letterlijk gekopieerde voorbeeldformaat met onzinwoorden ('SLO: koffie | artefact/test: banaan') als volwaardig bewijs en telt volledig mee voor 25 punten. Het vakjargon is daarmee een invuloefening zonder begripstoets. _Bewijs: cheater-run: '91 tekens bewijs — compleet.'; worstelaar kopieerde placeholder 1-op-1_
3. **MAJOR** · missie · bevestigd — Stap 2 vraagt 3 werksessies met elk 5 velden plus een beslissingenlog met 3 gemotiveerde keuzes, maar biedt één vrij tekstveld zonder structuurcontrole: drie losse zinnetjes van 237 tekens kregen volle 25/25. De gevraagde structuur kan de motor niet afdwingen. _Bewijs: worstelaar-run: 237 tekens, 25/25 op resultatenscherm_
4. **MAJOR** · motor · bevestigd — De eindscore differentieert niets: iedereen die het resultatenscherm bereikt scoort exact 100/100, want alle stappen zijn verplicht en zakken is onmogelijk. Van de 5 badges is alleen 'Meesterproef Geslaagd' haalbaar; de andere 4 zijn dode configuratie. _Bewijs: alle drie de runs eindigden op exact 100/100_
5. **MINOR** · motor · bevestigd — Het bewijsveld toont bij afgekeurde kwaliteit alleen een kale lengteteller ('59/55') zonder uitleg, terwijl het hoofdveld bij dezelfde invoer wél een kwaliteitshint toont. Een leerling met genoeg tekens ziet niet waarom de knop uit blijft. _Bewijs: alle drie de runs; teller-regel zonder hint_
6. **MINOR** · motor · bevestigd — Terugklikken naar een voltooide stap en een checklistvakje uitvinken neemt de al toegekende punten niet terug: de score bleef op 25 staan. Geen sjoemelvoordeel, wel een inconsistente scoreweergave. _Bewijs: cheater-run terugloopproef; voltooide stappen blijven staan_
7. **MINOR** · motor · bevestigd — De eindknop 'Missie voltooid!' heeft geen dubbelklik-bescherming: een dubbelklik vuurt 2x, wat in de preview onschadelijk is maar in productie dubbele aanroepen kan geven. _Bewijs: cheater-run event-probe 2x click, geen zichtbaar effect_
8. **MINOR** · motor · bevestigd — Na 'Missie voltooid!' is de autosave gewist; een herlaad toont het introscherm in plaats van het resultaat. Volgens de motoranalyse bedoeld, maar verwarrend voor een leerling die zijn eindresultaat terug wil zien. _Bewijs: cheater-run herlaadtest; clearSave na voltooiing_

### Wat goed werkte
- Letterherhaling ('aaaa aaaa...') wordt op beide velden betrouwbaar geweerd zodra de lengte-eis gehaald is — bevestigd in alle drie de runs
- Zakken of stappen overslaan is structureel onmogelijk: de uitgeschakelde 'Volgende stap'-knop is een echte HTML-disabled-knop die 0 events doorlaat
- Dubbelklik op de stapknop veroorzaakt geen dubbele stapsprong (score ging correct 50→75, niet 100)
- Herladen is betrouwbaar in beide richtingen: midden in de missie hervat exact dezelfde stap, na voltooiing komt het resultatenscherm terug, en &reset=1 start aantoonbaar schoon
- Geen verklap-risico: deze missie heeft geen keuzevragen, tellers of badges-vooraf — alleen checklists en vrije tekst
- De genummerde, expliciete instructies per stap werken uitstekend voor een leerling die ze letterlijk volgt; feedback is kort, visueel en direct
- Geen console-fouten en geen verdachte netwerkcalls in de gemeten runs

### Reparatiekandidaten (niet uitgevoerd — ter beslissing)
| # | Wat | Waar | Omvang | Waarom |
|---|---|---|---|---|
| 1 | Inhoudelijke relevantiecheck op tekst- en bewijsvelden voor eindbeoordelingsmissies | motor | groot | Kernzwakte: de poort keurt alleen vorm, nooit of de tekst over het eigen project gaat. 'Geslaagd' op kat-en-weer-zinnen is onacceptabel voor de eindbeoordeling |
| 2 | minTextLength voor meesterproef optrekken naar 150-200 per stap | config | klein | Nu geldt de lage standaard van 40 tekens; vergelijkbare zware missies eisen 150-200. Maakt de goedkoopste sjoemelroute direct duurder |
| 3 | Stap 2 opsplitsen in gestructureerde invoervelden (3 werksessies + beslissingenlog) | config | middel | De gevraagde structuur is in één vrij tekstveld niet afdwingbaar; aparte velden maken de eis controleerbaar |
| 4 | SLO-bewijsveld: placeholder-kopie afkeuren en 'SLO' in leerlingtaal uitleggen | config | middel | Het voorbeeldformaat met onzinwoorden telt nu als volwaardig bewijs; keur invoer af die de structuur zonder inhoud herhaalt |
| 5 | Kwaliteitshint ook onder het bewijsveld tonen | motor | klein | Bij afgekeurde kwaliteit toont het bewijsveld alleen een lengteteller; dezelfde 'echte zin'-hint als bij het hoofdveld voorkomt vastlopen zonder uitleg |
| 6 | Score-differentiatie toevoegen zodat de eindscore iets meet | config | middel | Iedere afronder scoort per constructie exact 100/100 en 4 van de 5 badges zijn onbereikbaar; verdiepingsvragen geven onderscheidend vermogen |
| 7 | Dubbelklik-bescherming op de eindknop 'Missie voltooid!' | motor | klein | De knop is async zonder laadtoestand; dubbelklik vuurt 2x en kan in productie dubbele aanroepen geven |

### Nog onzeker
- Mobiel/tablet niet gemeten — Playwright is op verzoek van Yorin uitgeschakeld (venster stal focus)
- De cheater-run kon geen enkele screenshot maken; alle bevindingen van die run steunen op DOM-metingen, niet op zichtbare pixels — de visuele laag is niet pixel-geverifieerd
- De AI-chat is in geen van de drie runs geopend; chatgedrag van deze missie is dus niet getest
- De toast-herlaadproef (melding permanent blijven hangen bij herlaad binnen ~2s na een stapovergang) is niet uitgevoerd — onbevestigd voor deze missie
- Het effect van de dubbele click op 'Missie voltooid!' in productie (echte afronding i.p.v. preview-no-op) is niet gemeten; alleen het dubbel vuren zelf is aangetoond
