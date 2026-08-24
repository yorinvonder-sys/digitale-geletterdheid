## Opdracht Live Check: tech-court — J2P4 (motor debate-arena)

**Advies:** fix-eerst
**Risico:** Geel
**Getest als:** gesimuleerde leerlingen (serieuze baseline · sjoemelaar · worstelaar · iPad via Playwright) op de dev-previewroute, zonder login
**Datum:** 2026-08-19

### In één alinea
De missie laat leerlingen een rechtszaak voorbereiden over AI-discriminatie, met stakeholders, argumenten en een reflectie. Een goede leerling haalt niet de volle punten: eerlijk invullen en lukraak gokken leveren allebei exact 83/100 op. Een sjoemelaar haalt moeiteloos 100/100 door vijf keer dezelfde betekenisloze tekst in te vullen. Een worstelaar loopt vast bij de tegenargument- en reflectiefase: de teller zegt "voldaan", maar de knop blijft uit zonder uitleg. Het oordeel is fix-eerst: de motor beloont doorloopgedrag, niet inhoud.

### Scores per profiel
| Profiel | Resultaat |
|---|---|
| Serieuze baseline | 83/100 (83%) eerlijk — en exact 83/100 met een generieke gokzin in alle velden; beide 'Gehaald' |
| Sjoemelaar | 100/100 (100%) 'Gehaald' met vijf keer letterlijk dezelfde betekenisloze grensstring 'ab cd ef ab cd ef ab'; naïef gokken met herhaalde tekens strandt op 20 pts (poort blokkeert i.p.v. lage score toe te laten); laagst haalbare voltooide score is 83 |
| Worstelaar | 83/100 (83%) eerlijk met eigen simpele zinnen; vulzin-run gaf 100/100 mét lovende Kees-feedback ('Top gedaan! Dit zat echt goed in elkaar. 🎉') |
| iPad (Playwright) | niet gemeten |

### Bevindingen
1. **MAJOR** · motor · bevestigd — De motor scoort alleen op vorm, niet op inhoud: eerlijk invullen en vijf keer dezelfde onzin geven allebei 'Gehaald', en zakken is onmogelijk omdat de laagste score 83/100 is. _Bewijs: baseline 83 = 83; cheater 100/100 met 'ab cd ef ab cd ef ab'; engine answerQuality.ts:11,18,20,51-56_
2. **MAJOR** · motor · bevestigd — Bij de tegenargument- en reflectiefase blijft de doorgaan-knop uit terwijl de teller '20/20 min.' toont, zonder enige uitleg op het scherm; de hint die dit oplost bestaat al maar wordt alleen in de argumentfase getoond. _Bewijs: 3x DOM-gemeten disabled=true bij '20-22/20 min.'; ChallengePhase.tsx:56-58 vs ArguePhase.tsx:103-107_
3. **MAJOR** · missie · bevestigd — Het juridische vocabulaire ('indirecte discriminatie', 'gelijkebehandelingswet', 'aansprakelijk', 'afgewenteld') is waarschijnlijk te zwaar voor A2-B1; een taalzwakke leerling kiest dan op woordherkenning in plaats van begrip. _Bewijs: config tech-court.ts:19,37,39,47,66,71,76,81,120; struggler-run F3_
4. **MINOR** · motor · bevestigd — Doorgaan-knoppen staan na een fase-overgang soms net onder de fold bij 1280×800 (y=842-865px) zonder scroll-aanwijzing; mogelijk deels tool-artefact. _Bewijs: struggler-run F5; y=842-865px bij 800px viewport_
5. **MINOR** · motor · bevestigd — De aangekondigde AI-rol (enableChat) verschijnt nooit: de config kent het veld niet en er is nul chat-activiteit in alle runs. _Bewijs: templateRegistry.ts:88-97 vs DebateArena.tsx:34-53; nul netwerkcalls in drie runs_
6. **MAJOR** · motor · bevestigd — Contrast onder AA op vrijwel alle inhoudstekst: text-duck-ink/60 geeft ca. 3,8:1 op duck-bg en ca. 4,3:1 op wit bij 10-12px; het eindscherm is al gecorrigeerd naar /75. _Bewijs: engine a11yShell; DebateArena.tsx:289, ChallengePhase.tsx:38 vs CompletionScreen.tsx:148,189_

### Wat goed werkte
- Herladen is betrouwbaar: mid-fase herladen herstelt exact dezelfde staat en &reset=1 start schoon — in alle drie de runs getest
- Terugnavigeren tussen fasen verliest geen ingevoerde tekst; de score sprong correct naar 100 zodra Arg 3 geldig werd
- Geen verklap: stakeholder-tabs en positiekaarten geven geen 'juist antwoord'-aanwijzing, nergens een goed/fout-teller vóór het eindscherm
- Geen console- of netwerkfouten in drie volledige runs; nul calls naar supabase/functions — de missie is operationeel volledig chat-onafhankelijk
- Het structurele filter is niet volledig tandeloos: pure herhaalde-tekens-input wordt geweigerd; alleen doelbewuste of grammaticaal volwaardige herhaling glipt erdoor
- De worstelaar kon de missie eerlijk afronden op 83/100: vier perspectieven met plaatjes en korte koppen, navigeren op herkenbare woorden lukte; de fasetabel klopte rekenkundig

### Reparatiekandidaten (niet uitgevoerd — ter beslissing)
| # | Wat | Waar | Omvang | Waarom |
|---|---|---|---|---|
| 1 | Toon de bestaande antwoordkwaliteit-hint ook in de tegenargument- en reflectiefase | motor | klein | De uitleg die het vastloopmoment oplost bestaat al en wordt alleen in de argumentfase gerenderd; dit dicht de door alle drie de runs bevestigde 'teller zegt ja, knop zegt nee'-val (B2) |
| 2 | Detecteer letterlijk hergebruikte tekst over meerdere velden en weiger of markeer die | motor | middel | Vijf keer exact dezelfde zin in alle open velden geeft nu 100/100 mét lovende feedback; een eenvoudige duplicaat-/gelijkeniscontrole over de velden haalt de goedkoopste sjoemelroute weg (B1) |
| 3 | Herzie de score-opbouw zodat 'Gehaald' iets over kwaliteit zegt (zak-mogelijkheid of inhoudelijker waardering) | motor | groot | De poorten leggen de ondergrens op 83% waardoor de 40%-drempel dode code is en het docentdashboard alleen doorloopgedrag meet; dit is een didactische ontwerpkeuze die alle 10 debate-arena-missies raakt (B1) |
| 4 | Vereenvoudig het juridische vocabulaire van tech-court of voeg korte uitleg toe (woordkaders/eenvoudiger synoniemen) | config | middel | Stelling, perspectieven en positiekaarten gebruiken onvertaald juridisch register ('gelijkebehandelingswet', 'indirecte discriminatie', 'afgewenteld') dat voor A2-B1 waarschijnlijk ontoegankelijk is; kern van de missie-eigen bevinding B3 |
| 5 | Scroll-aanwijzing of autoscroll naar de nieuwe doorgaan-knop na een fase-overgang | motor | klein | Doorgaan-knoppen stonden bij 1280×800 soms net onder de fold zonder cue (B4); autoscroll naar de knop bij fase-wissel neemt ook het tool-artefact-voorbehoud weg |
| 6 | Ruim de enableChat/chatRoleId-vlaggen voor debate-arena-missies op in de templateRegistry (of implementeer de chat) | motor | klein | Acht missies kondigen een AI-rol aan die nooit verschijnt; opruimen voorkomt verkeerde verwachtingen bij leerling en docent (B5) |
| 7 | Breng de motorfase-tekst van text-duck-ink/60 naar /75 zoals het eindscherm | motor | klein | Vrijwel alle inhoudstekst zit onder de AA-contrasteis bij 10-12px; het gedeelde eindscherm is al gecorrigeerd, de fases zijn achtergebleven (B6) |

### Nog onzeker
- mobiel/tablet niet gemeten — Playwright is op verzoek van Yorin uitgeschakeld (venster stal focus)
- De taalniveau-claim (B3) is een didactische inschatting op basis van één persona-run plus de configtekst, niet een instrumentele meting (geen leesbaarheidsindex); daarom als 'waarschijnlijk' geformuleerd conform de sol-correctie op taalniveau-claims
- De fold-bevinding (B4) is mogelijk deels tool-artefact: de accessibility-snapshot is viewport-gebonden en het gedeelde Browser-paneel haperde in de struggler-run; baseline en cheater rapporteerden het scrollen niet als probleem
- Contrast (B6) is uitsluitend code-gemeten door de engine-analyse; niet apart in de browser geverifieerd tijdens deze drie runs
- Dubbelklik-race op indienknoppen is niet expliciet getest (enkelvoudige klikken gaven geen dubbele afhandeling)
- Hoe letterlijk hergebruikte identieke antwoorden in een eventueel docentdashboard verschijnen is niet bekeken — alleen het leerling-eindscherm
- De Kees-eindfeedback ('Top gedaan!') bij de vulzin-run is alleen in de struggler-run geciteerd; de generieke herkomst (statisch vs. gegenereerd) is niet apart vastgesteld, al sluit de nul-netwerkactiviteit een AI-call uit
- durationMin in de runs zijn schattingen; er was geen klok-tool beschikbaar
