## Opdracht Live Check: digital-rights-defender — J2P4 (motor debate-arena)

**Advies:** fix-eerst
**Risico:** Geel
**Getest als:** gesimuleerde leerlingen (serieuze baseline · sjoemelaar · worstelaar · iPad via Playwright) op de dev-previewroute, zonder login
**Datum:** 2026-08-19

### In één alinea
De missie laat leerlingen drie standpunten verkennen over digitale rechten en daar een eigen mening over vormen. Een goede leerling die stopt bij het toegestane minimum van 2 van 3 argumenten haalt 83/100 en de badge 'Debatmeester', maar de volle 100 punten zijn ook te halen met inhoudsloze onzin. Een sjoemelaar die overal dezelfde generieke vulzin invult en blind op 'Gelezen ✓' klikt, scoort 83/100 met lovende feedback — zakken onder de 40% is structureel onmogelijk. Een worstelaar loopt vast in de tegenargument- en reflectiefase: de teller toont '22/20 min.' maar de doorgaan-knop blijft uit zonder uitleg. Het oordeel is fix-eerst: de motor meet alleen doorloopgedrag, geen inhoudelijke kwaliteit.

### Scores per profiel
| Profiel | Resultaat |
|---|---|
| Serieuze baseline | 83/100 (83%) 'Gehaald' — eerlijk én gok identiek |
| Sjoemelaar | 83/100 met identieke vulzin in alle velden (2 van 3 argumenten); 100/100 na een volledig irrelevant derde argument ('banaan kaas fiets rood muziek'); zakken (<40%) onbereikbaar |
| Worstelaar | 83/100 (83%) — gokproef op eigen eindscherm bevestigd; eerlijke ronde afgeleid uit identiek puntenaantal (zie onzeker) |
| iPad (Playwright) | niet gemeten |

### Bevindingen
1. **MAJOR** · motor · bevestigd — Bij tekst die wel de lengte-eis maar niet de woord-/tekenvariatie-eis haalt, toont de teller '22/20 min.' terwijl de doorgaan-knop uit blijft zonder enige uitleg; dezelfde uitleg-hint bestaat al maar wordt alleen in de Argue-fase getoond. _Bewijs: run-letterlijke-luca.json F1; run-creatieve-cheater.json F1; run-afgeleide-amir.json F1+F2; engine ChallengePhase.tsx:56-58,72 en ReflectPhase.tsx:54-56,108 missen de answerQualityHint die ArguePhase.tsx:103-107 wél rendert_
2. **MAJOR** · motor · bevestigd — De score is contentonafhankelijk: dezelfde generieke vulzin in alle vijf open velden geeft exact dezelfde uitkomst (83/100, 'Gehaald', identieke lovende feedback) als twee oprechte argumenten plus eerlijke reflectie; een volledig irrelevant derde argument perfectioneert de score naar 100/100. _Bewijs: run-letterlijke-luca.json F2; run-creatieve-cheater.json F2+F3; run-afgeleide-amir.json F3; engine DebateArena.tsx:99-131 + answerQuality.ts:11,18,20,51-56_
3. **MAJOR** · motor · bevestigd — Zakken is structureel onbereikbaar: elke fasepoort dwingt dezelfde vormcheck af, dus de laagst bereikbare eindscore is 83/100 en de 40%-drempel plus de 'Nog niet gehaald'-tak zijn dode code. _Bewijs: run-creatieve-cheater.json F5 + steps 11-12; engine ArguePhase.tsx:176, ChallengePhase.tsx:15, ReflectPhase.tsx:16-18, PositionPhase.tsx:74, CompletionScreen.tsx:65; config digital-rights-defender.ts:84-87_
4. **MINOR** · motor · bevestigd — Geen leestijd- of interactie-eis in de Explore-fase: 4x blind 'Gelezen ✓' klikken zonder één perspectief te lezen levert de volle 10/10 op, identiek aan echt lezen. _Bewijs: run-letterlijke-luca.json F3; run-creatieve-cheater.json F4; run-afgeleide-amir.json step 14; engine ExplorePhase.tsx:106-113_
5. **MINOR** · missie · bevestigd — De derde stakeholder ('Functionaris Gegevensbescherming') is een talige skim-zone voor 12-14-jarigen: de functietitel wordt nergens toegelicht en de juridische toon nodigt uit tot afvinken zonder begrip. AVG en DPIA worden wél direct tussen haakjes uitgelegd. _Bewijs: run-afgeleide-amir.json F6; config digital-rights-defender.ts:43-49_
6. **MINOR** · motor · bevestigd — 'Missie voltooid! 🎉' geeft in de dev-preview geen enkele zichtbare terugkoppeling maar wist wel direct de localStorage-voortgang; bekend preview-artefact, geen productiebug. _Bewijs: run-letterlijke-luca.json F4; run-creatieve-cheater.json F6; run-afgeleide-amir.json F7; engine DevMissionPreview.tsx:84,96-97 + DebateArena.tsx:257-264_

### Wat goed werkte
- Pure tekenherhaling ('aaaa...', 20-22x dezelfde letter) wordt correct geweigerd — de motor is een werkend vormfilter, alleen niet inhoudsgevoelig.
- Herladen is betrouwbaar: zonder reset landt de leerling exact terug in dezelfde fase met score en tekst intact; met reset gegarandeerd schoon.
- Per ongeluk '← Vorige' klikken tussen stakeholders kost geen 'gelezen'-status — het backtrack-afhaakmoment bestaat niet.
- Nergens wordt vooraf een juist antwoord, volgorde of 'x van y goed'-teller verklapt; ✓-markeringen zijn pure voortgangsindicatoren.
- Dubbelklik op de afrondknop geeft geen dubbele score, crash of state-corruptie.
- Eerlijke doorloop kent geen enkele blokkade: alle knoppen worden op tijd klikbaar en de Argue-fase geeft wél duidelijke tekstuele voortgang.
- Technisch schoon: geen console-fouten, geen calls naar dummy.supabase.co — chat-onafhankelijkheid live bevestigd in twee runs.

### Reparatiekandidaten (niet uitgevoerd — ter beslissing)
| # | Wat | Waar | Omvang | Waarom |
|---|---|---|---|---|
| 1 | Toon de bestaande answerQualityHint ook in de Challenge- en Reflect-fase | motor | klein | De uitleg die precies vertelt waarom een antwoord niet telt bestaat al en wordt alleen in de Argue-fase gerenderd; toevoegen heft de meest waarschijnlijke vastloper (B1) op voor alle 10 debate-arena-missies. |
| 2 | Voeg een inhouds-/relevantietoets (of docent-zichtbare kwaliteitsmarkering) toe aan open antwoorden | motor | groot | De score meet nu alleen doorloopgedrag: identieke vulzinnen en irrelevante argumenten geven 83-100/100 met lovende feedback (B2), waardoor 'Gehaald' niets over kwaliteit zegt. |
| 3 | Herzie de slaag-semantiek: maak differentiatie onder de poort-ondergrens mogelijk of communiceer dat 'Gehaald' voltooiing betekent | motor | middel | De 40%-drempel en de 'Nog niet gehaald'-tak zijn dode code (ondergrens 83%, B3); nu suggereert het eindscherm een beoordeling die er niet is. |
| 4 | Lichte interactie-eis per stakeholder in de Explore-fase (bijv. één controlevraagje of minimale dwell) | motor | middel | Blind 4x 'Gelezen ✓' klikken geeft nu de volle 10/10 (B4), terwijl de stakeholder-perspectieven juist de inhoudelijke kern zijn. |
| 5 | Licht de functietitel 'Functionaris Gegevensbescherming' toe en verlaag de taligheid van dat perspectief | config | klein | AVG en DPIA worden al tussen haakjes uitgelegd, maar de functietitel zelf niet en de juridische toon maakt dit dé skim-zone voor zwakke lezers (B5). |

### Nog onzeker
- mobiel/tablet niet gemeten — Playwright is op verzoek van Yorin uitgeschakeld (venster stal focus)
- Amirs scoreHonest (83) is niet op een eigen eindscherm bevestigd: die eerlijke ronde is bij het Reflecteer-scherm gereset t.b.v. de gokproef; de waarde is afgeleid uit het identieke puntenaantal plus de aangetoonde contentonafhankelijkheid van de motor.
- De exacte faalgrens van de structurele check (bijv. 19 tekens of 5 unieke letters) is niet empirisch getest — alleen de slaaggrens bij precies 20 tekens is bevestigd.
- Dubbelklik op tussenfase-knoppen ('Beantwoord tegenargument', 'Reflecteer') is niet getest op dubbele state-updates — alleen de finale afrondknop is op dubbelklik beproefd.
- De header-'Terug'-knop (terug naar vorige hoofdfase/intro) is niet apart getest; alleen '← Vorige' binnen de Explore-fase is beproefd.
