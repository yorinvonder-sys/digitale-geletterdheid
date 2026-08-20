## Opdracht Live Check: policy-maker — J3P3 (motor debate-arena)

**Advies:** fix-eerst
**Risico:** Geel
**Getest als:** gesimuleerde leerlingen (serieuze baseline · sjoemelaar · worstelaar · iPad via Playwright) op de dev-previewroute, zonder login
**Datum:** 2026-08-19

### In één alinea
De missie laat leerlingen een beleidsdilemma verkennen vanuit vier stakeholders, een eigen standpunt opbouwen en verdedigen. Een goede leerling haalt vlot 83/100 met twee argumenten; de volle 100 punten vereisen een derde argument dat de opdracht als optioneel aanbiedt. Een sjoemelaar haalt met betekenisloze vulzinnen dezelfde 83/100 én de hoogste badge, en bewust zakken is onmogelijk omdat de motor altijd minstens 83% afdwingt. Een worstelaar loopt vast in de tegenargument- en reflectiefase: de knop blijft dicht zonder uitleg terwijl de teller voldoende aangeeft. Het oordeel is fix-eerst: de motor beloont doorloopgedrag, niet kwaliteit, en de onduidelijke blokkade is een reëel afhaakpunt.

### Scores per profiel
| Profiel | Resultaat |
|---|---|
| Serieuze baseline | 83/100 (83%) 'Gehaald', badge Debatmeester — eerlijk, 2 van 3 argumenten |
| Sjoemelaar | 83/100 (83%) 'Gehaald' + badge Debatmeester met puur structurele vulzinnen; bewuste zakpoging bevriest op 20/100 zonder eindscherm |
| Worstelaar | 83/100 (83%) 'Gehaald' in zowel de eerlijke als de gok-doorloop (identiek eindscherm) |
| iPad (Playwright) | niet gemeten |

### Bevindingen
1. **MAJOR** · motor · bevestigd — De inhoudscheck is puur structureel (lengte en woordvariatie); betekenisloze vulzinnen leveren 83/100 plus de hoogste badge op, en dezelfde zin mag onopgemerkt in alle velden herhaald worden. _Bewijs: cheater-run exacte ondergrens 'ab cd ef ab cd ef ab', hergebruik in alle velden; identiek eindscherm in alle runs_
2. **MAJOR** · motor · bevestigd — In de tegenargument- en reflectiefase blijft de doorgaan-knop dicht zonder uitleg terwijl de teller '22/20 min.' toont; de bestaande hint wordt alleen in de eerste fase getoond. _Bewijs: alle drie runs tonen disabled=true met counter '22/20 min.' in beide fases_
3. **MAJOR** · motor · bevestigd — Zakken is structureel onmogelijk: elke fasepoort dwingt dezelfde vormcheck af, dus de laagst haalbare score is 83/100 en de 40%-drempel is dode code. _Bewijs: cheater-run stap 19: 20 punten bevroren, knop disabled, eindscherm onbereikbaar_
4. **MINOR** · motor · bevestigd — De verkenningsfase kent geen leestijd- of interactie-eis: vier keer blind 'Gelezen ✓' klikken levert de volle 10 punten op. _Bewijs: cheater-run stap 3; snelle-sam stap 2_
5. **MINOR** · motor · bevestigd — Twee knoppen zijn wisselend niet vindbaar via de interactieve toegankelijkheidsboom terwijl ze zichtbaar en werkbaar zijn; mogelijk een meet-eigenaardigheid, maar consistent met andere toegankelijkheidsgaten. _Bewijs: drie runs, wisselend reproduceerbaar; engine a11yShell_
6. **MINOR** · motor · weerlegd — De claim dat 83/100 zonder derde argument een scoringsfout is, is weerlegd: het is bedoeld ontwerp met optionele verdieping van 17 punten. _Bewijs: config belooft '2-3 argumenten'; fasetabel toont 33/50 als eerlijke partial credit_
7. **MINOR** · motor · bevestigd — De aangekondigde AI-rol in de chat verschijnt nooit: de configuratie kondigt hem aan maar de motor rendert geen chat en er zijn geen backend-calls. _Bewijs: geen chatknop in runs; geen calls naar /functions/v1_

### Wat goed werkte
- Herlaadgedrag is betrouwbaar: exact dezelfde fase, tekst, score en zelfs een vastgelopen staat worden hersteld zonder crash of dataverlies; met reset start de missie schoon.
- De eerste fase is transparant: het knoplabel telt af ('Nog 2 argumenten nodig') zodat de leerling weet waarom hij niet verder kan.
- Geen antwoord-verklapping: geen goed antwoord, teller of badge zichtbaar vóór het kiezen.
- De vormcheck vangt de domste spam af: herhaalde-teken-woorden worden geweigerd ongeacht lengte.
- Technisch schoon: geen console-fouten, geen netwerkcalls naar backend, fasetabel telt exact op tot 100.
- Missie-eigen content is inhoudelijk coherent en dekt het dilemma vanuit alle belangen.

### Reparatiekandidaten (niet uitgevoerd — ter beslissing)
| # | Wat | Waar | Omvang | Waarom |
|---|---|---|---|---|
| 1 | Toon de bestaande hint ook in de Challenge- en Reflect-fase | motor | klein | De hint bestaat al maar wordt alleen in de eerste fase getoond; toevoegen heft de bevestigde vastloper op (B2). |
| 2 | Weiger identieke of near-identieke tekst over meerdere open velden | motor | middel | Hergebruik van dezelfde vulzin wordt nu niet gedetecteerd; een duplicaatcheck maakt de goedkoopste sjoemelroute onbruikbaar (B1). |
| 3 | Herijk wat 'Gehaald' en de badge betekenen bij een afgedwongen ondergrens van 83% | motor | middel | De 40%-drempel en badge-laddering onder 80 zijn dode code; score meet alleen doorloop, niet kwaliteit (B1, B3). |
| 4 | Onderzoek waarom twee knoppen niet in de interactieve toegankelijkheidsboom verschijnen | motor | klein | Kan schermlezer- en toetsenbordgebruikers raken; eerst diagnose, dan gerichte fix (B5). |
| 5 | Voeg een licht leesbewijs toe aan de verkenningsfase | motor | klein | Vier blinde kliks geven nu de volle 10 punten; een minimale tijds- of interactie-eis maakt blind wegklikken onaantrekkelijk (B4). |

### Nog onzeker
- Mobiel/tablet niet gemeten — Playwright is op verzoek uitgeschakeld (venster stal focus).
- De toegankelijkheidsinterpretatie van B5 is niet tegen de broncode geverifieerd en was wisselend reproduceerbaar; het kan een eigenaardigheid van de meet-tools zijn.
- Het 100/100-pad (3 geldige argumenten) is in geen enkele run empirisch gespeeld; dat het 50/50 oplevert steunt op code-analyse, niet op een waargenomen eindscherm.
- De cheater-run gebruikte voor twee kliks een coördinaat met een schaalfactor uit één vroege screenshot; de kliks kwamen aan maar de factor is niet opnieuw geverifieerd.
- Er is niet actief gezocht naar een verborgen chat-entrypoint buiten de normale flow.
- startedAt/durationMin in de runs zijn schattingen zonder kloklezing.
