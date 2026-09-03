## Opdracht Live Check: advanced-code-review — J3P1 (motor review-arena)

**Advies:** fix-eerst
**Risico:** Rood
**Getest als:** gesimuleerde leerlingen (serieuze baseline · sjoemelaar · worstelaar · iPad via Playwright) op de dev-previewroute, zonder login
**Datum:** 2026-08-19

### In één alinea
De missie laat leerlingen vier rondes doen: sorteren, koppelen, categoriseren en een snelle stellingenquiz. Een serieuze leerling haalt 75 van de 100 punten, niet de volle 100 — de snelle quizronde geeft 0 punten door een scorefout en de beloofde bonus telt niet mee. Een sjoemelaar die alleen gokt blijft met 38% net onder de 40%-grens, maar kan via een trucje bij het koppelen wel 20 van de 25 punten binnenhalen. Een worstelaar loopt vast op twee plekken: één misklik bij het koppelen legt de score direct vast, en de snelle quiz is te krap voor gemiddeld leestempo. Het grootste probleem: wie onder de 40% eindigt, komt op een dood eindscherm terecht zonder enige uitweg.

### Scores per profiel
| Profiel | Resultaat |
|---|---|
| Serieuze baseline | eerlijk 75/100 (75%) — sorteren 25, koppelen 25, categoriseren 25, rapid-fire 0 (2/8); gokproef 38/100 (38%) |
| Sjoemelaar | speelrun 53/100 (53%); gokproef 19/100 (19%) |
| Worstelaar | eerlijk 48/100 (48%) incl. +5 bonus; gokproef 33/100 (33%) |
| iPad (Playwright) | 75/100 (75%) 'Gehaald' — rondes 1-3 elk 25/25, rapid-fire 0/25 (3/8), bonusvraag goed maar zonder effect op het totaal |

### Bevindingen
1. **BLOCKER** · motor · bevestigd — Wie onder de 40% scoort, komt op een eindscherm met één knop die permanent uitgeschakeld is; herladen helpt niet en de docent ziet geen resultaat. _Bewijs: 3 runs (38%, 33%, 19%) — telkens 1 button, disabled, reload identiek; CompletionScreen.tsx:163-170 + ReviewArena.tsx:520-529_
2. **MAJOR** · motor · bevestigd — In de snelle quiz wordt een logisch juist antwoord fout gerekend als de tijd net overschreden is; de score van die ronde is daardoor onbetrouwbaar. _Bewijs: Playwright zichtbare tab: ONWAAR op 'deep learning altijd beter' (config: juist) toch ✗ na timeout-sprong; baseline 2/8 goed_
3. **MAJOR** · motor · bevestigd — Bij het koppelen wordt de score al bij de eerste fout vastgelegd: wie herlaadt bankiert 20/25 zonder de rest te doen, wie netjes afmaakt houdt tóch de verlaagde score. _Bewijs: cheater-run: 1 fout → 20/25 na reload; 2 fouten + 5/5 correct → 15/25; MatchPairs.tsx:168_
4. **MAJOR** · motor · bevestigd — De beloofde '+5 bonus' wordt afgekapt op het rondemaximum: een foutloze leerling ziet '✓ Goed!' maar zijn totaal verandert niet; zwakke leerlingen krijgen de bonusvraag helemaal niet te zien. _Bewijs: iPad-run 75 na correcte bonus; Sam 19/25 + bonus → 48 i.p.v. 43; ReviewArena.tsx:381, 422_
5. **MINOR** · motor · bevestigd — Tijdens de snelle quiz verschijnt een React-fout in de console; die valt samen met de momenten waarop een antwoord verkeerd wordt gescoord. _Bewijs: 7x in baseline-run, 2x worstelaar, 1x cheater, bevestigd in Playwright ná timeout-sprong_
6. **MINOR** · motor · bevestigd — De snelle quiz geeft 12 seconden per stelling zonder pauze of waarschuwing; gemiste vragen tellen als fout en veroorzaken de sprong waar de scorefout op volgt. _Bewijs: iPad-run: 2 vragen automatisch overgeslagen (1→4, 4→6); config timePerQuestion: 12_
7. **MINOR** · missie · onbevestigd — Stelling 'Een neuraal netwerk heeft altijd minstens drie lagen' staat als WAAR in de sleutel, maar het woord 'altijd' maakt de stelling aanvechtbaar; beide serieuze spelers kozen ONWAAR en verloren het punt. _Bewijs: config answer:true; beide spelers ONWAAR gekozen, beiden fout gerekend_
8. **MINOR** · motor · weerlegd — Het 'bevriezen' van kaartinhoud bij rondewisselingen is een artefact van het testpaneel, geen echte bug; in de zichtbare tab kwamen tekst en teller wél overeen. _Bewijs: iPad-run geen renderklachten; stellingen kwamen overeen met de teller_
9. **MINOR** · missie · weerlegd — De twijfel over twee ML-antwoordsleutels is ongegrond: 'Meer data leidt altijd tot beter model' = ONWAAR en 'splitsing voorkomt trainen op testdata' = WAAR, precies zoals de UI scoort. _Bewijs: config vragen 2 en 7; Playwright bewust WAAR geklikt → ✓_

### Wat goed werkte
- Rondes 1, 2 en 3 zijn voor een serieuze leerling volledig speelbaar en eerlijk: beide serieuze spelers haalden er 25/25 op, met duidelijke voortgangsindicatie en directe feedback per stap.
- Geen gratis punten: de indienknop van sorteren blijft uitgeschakeld tot minstens één kaart is verplaatst, de starthussel is nooit al de juiste volgorde, alles in één categorie gooien geeft maar 13/25, en steeds dezelfde rapid-fire-knop klikken kapt af op 0/25 (gok-basislijn).
- Geen enkele giveaway: in geen van de vier rondetypes stond het juiste antwoord, de juiste volgorde of een 'x van y goed'-teller vóór het indienen in beeld.
- Dubbelklik-bestendig: dubbelklikken op 'Volgende ronde' en op 'Missie voltooid!' gaf geen dubbele indiening of verdubbelde score.
- De verdiepingsvraag geeft geen tweede kans: het eerste antwoord ligt definitief vast, ook na terugklikken.
- Herstel na herladen werkt: midden in een ronde hervat de missie op exact hetzelfde punt met bewaarde plaatsingen, en al ingediende rondes blijven vergrendeld op hun vaste score (geen herlaad-exploit).
- Feedback is inhoudelijk: fout geplaatste items worden per stuk gemarkeerd, elke rapid-fire-stelling krijgt uitleg achteraf, en het eindscherm sluit af met een 'Wat je hebt geleerd'-samenvatting.
- Toegankelijk en offline: 44x44px-doelen, aria-live-meldingen, sorteren volledig met pijltjesknoppen te doen, geen hover-only informatie, geen netwerkafhankelijkheid (geen chat, alles in de config).

### Reparatiekandidaten (niet uitgevoerd — ter beslissing)
| # | Wat | Waar | Omvang | Waarom |
|---|---|---|---|---|
| 1 | Uitweg op het eindscherm onder de 40% | motor | klein | De motor geeft CompletionScreen geen onRetry mee, waardoor de enige knop permanent uitgeschakeld is en de leerling ook na herladen vastzit; een herkans- of terugroute (zoals debate-arena die al heeft) heft de blocker op en zorgt dat de docent alsnog een resultaat ziet. |
| 2 | Rapid-fire: antwoord koppelen aan de zichtbaar getoonde stelling | motor | middel | Na een timeout-sprong wordt een juist antwoord fout gerekend; de bijbehorende setState-tijdens-render-fout in RapidFire wijst op dezelfde oorzaak. Zolang dit erin zit is de score van ronde 4 niet uitlegbaar aan een leerling. |
| 3 | Match-pairs pas afsluiten als de ronde echt klaar is | motor | middel | De score wordt nu bij de eerste fout vastgelegd, wat tegelijk een sluiproute (20/25 bankieren met één klik plus reload) en een straf voor een misklik of toevallige reload is; koppel het vastleggen aan het einde van de ronde en voeg een 'ik weet het niet'-uitweg toe. |
| 4 | Bonusvraag echt laten meetellen of niet als bonus aankondigen | motor | klein | De bonus wordt afgekapt op de rondemax, dus een foutloze leerling krijgt '✓ Goed! +5' te zien zonder dat zijn totaal verandert; laat de bonus buiten de rondemax meetellen, of toon hem niet als bonus wanneer hij niets kan opleveren. |
| 5 | Verdiepingsvraag ook onder de 50% aanbieden | motor | klein | De herstelvraag met bonuspunten verschijnt alleen boven de helft van de rondescore, dus juist de leerlingen die punten kunnen gebruiken krijgen hem nooit te zien. |
| 6 | Meer leestijd of pauze per rapid-fire-stelling | config | klein | 12 seconden is krap voor een leerling met gemiddeld leestempo; in de iPad-run gingen twee vragen verloren op tijd, wat ook de sprong veroorzaakt waarna de scorefout optreedt. |
| 7 | Stelling 1 van de rapid-fire herformuleren | config | klein | 'Een neuraal netwerk heeft altijd minstens drie lagen' is met dat 'altijd' aanvechtbaar; beide serieuze spelers kozen ONWAAR en verloren het punt op de formulering in plaats van op de kennis. |

### Nog onzeker
- Of de rapid-fire-scorefout (B2) zich ook voordoet zonder voorafgaande timeout-sprong — in beide runs viel hij samen met een sprong; het exacte mechanisme is niet uit de speelwaarneming af te leiden.
- Of de bonuscap op de rondemax (B4) een bewuste keuze is of een onbedoeld neveneffect; de UI kondigt de bonus in beide gevallen misleidend aan.
- Het zak-scenario (<40%) is niet in de zichtbare Playwright-tab nagespeeld — de iPad-run haalde 75% — maar wel driemaal in het browserpaneel én bevestigd door de motorcode.
- Of de 0/25 op rapid-fire bij beide serieuze spelers deels aan de testomgeving ligt (bevroren animaties en toolvertraging in het paneel) in plaats van aan het ontwerp; de iPad-run haalde in een zichtbare tab ook maar 3/8.
- Of de server buiten deze motor een eerdere hogere score beschermt bij opnieuw spelen, en of de bonuspunten aan de docentkant anders worden geteld — beide niet te testen vanuit de dev-preview.
