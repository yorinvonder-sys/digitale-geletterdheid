## Opdracht Live Check: open-source-contributor — J3P1 (motor builder-canvas)

**Advies:** fix-eerst
**Risico:** Geel
**Getest als:** gesimuleerde leerlingen (serieuze baseline · sjoemelaar · worstelaar · iPad via Playwright) op de dev-previewroute, zonder login
**Datum:** 2026-08-19

### In één alinea
Deze missie laat een leerling in vier stappen een bijdrage aan een open-sourceproject voorbereiden, van het kiezen van een issue tot het schrijven van een pull-request. Een goede leerling haalt de volle punten, maar dat zegt weinig: ook een sjoemelaar die vier irrelevante zinnen over het weer typt en alle vakjes blind aankruist, krijgt 100/100 en het label 'Open Source Hero'. Een worstelaar die toegeeft het verschil tussen fork en clone niet te snappen, krijgt eveneens 100/100 — een vals positief signaal. De missie kan niet worden gezakt: wie alle stappen doorloopt, heeft per definitie 100%. Het advies is daarom fix-eerst: de score zegt nu niets over wat een leerling kan.

### Scores per profiel
| Profiel | Resultaat |
|---|---|
| Serieuze baseline | 100/100 (100%) — 'Open Source Hero', Gehaald, 4x 25/25 |
| Sjoemelaar | 100/100 (100%) — identiek eindresultaat met vier volstrekt irrelevante zinnen (kat/weer/regen) en 16 blind aangevinkte vakjes |
| Worstelaar | 100/100 (100%) — inclusief een expliciet toegegeven fork/clone-denkfout in haar eigen stap-1-tekst |
| iPad (Playwright) | 100/100 (100%) — 0 bevindingen, 0 consolefouten, 0 mislukte requests op 820x1180, 1180x820 en 390x844 |

### Bevindingen
1. **MAJOR** · motor · bevestigd — De tekstpoort keurt alleen vorm, nooit inhoud: vier plausibele maar volledig irrelevante zinnen plus zestien zelfgerapporteerde vinkjes leveren 100/100 en 'Gehaald'. De checklist is pure zelfrapportage; de tekstcontrole test alleen lengte (default 40 tekens), 3 woorden en 6 unieke letters. _Bewijs: run-creatieve-cheater.json F1 + stappen 3-8; run-digisterke-dani.json F1; _engines/builder-canvas.json topIssue 1_
2. **MAJOR** · motor · bevestigd — De voltooiingsdrempel van 40% meet niets en kan niet falen. Het resultatenscherm is alleen bereikbaar als alle stappen al door de poort zijn; bij maxScore 100, 4 stappen en nul bonuspunten is de uitkomst dan altijd exact 100%. _Bewijs: run-creatieve-cheater.json F2 + stap 9; config open-source-contributor.ts:91; _engines/builder-canvas.json topIssue 2_
3. **MINOR** · motor · bevestigd — Het aparte bewijsveld (alleen stap 1, minLength 45) blokkeert zonder uitleg: bij afgekeurde onzin-tekst toont het uitsluitend een kale lengteteller ('60/45', '49/45', '149/45') terwijl de knop uit blijft, terwijl het gewone antwoordveld wél een verklarende hint geeft. _Bewijs: run-digisterke-dani.json F2; run-creatieve-cheater.json F3; run-taalzwakke-tess.json F2; _engines/builder-canvas.json topIssue 3_
4. **MINOR** · missie · bevestigd — Jargon wordt ongelijk uitgelegd. De intro en stap 3 verklaren sommige termen netjes tussen haakjes ('fork', 'clone', 'pull request', 'deterministisch'), maar de checklistlabels van stap 3 laten 'tiebreaker' en 'commentaarregel met motivatie' onverklaard staan. _Bewijs: run-taalzwakke-tess.json F3; config open-source-contributor.ts:67-70_
5. **MINOR** · motor · onbevestigd — showMilestone wordt meegeslagen in de autosave; herlaadt een leerling tussen ~1 en 2 seconden na een stapovergang, dan komt de toast '✓ x/y voltooid!' terug zonder timer en blijft permanent bovenaan hangen. _Bewijs: _engines/builder-canvas.json topIssue 4 + stateRestore.risks[0]; geen enkele run heeft dit tijdvenster getest_
6. **MINOR** · motor · onbevestigd — Het resultatenscherm heeft geen uitweg onder de 40%: BuilderCanvas geeft geen onRetry mee, dus de knop is dan uitgeschakeld en er is geen terug-knop. Met déze config onbereikbaar, maar het wordt een echt dood eind zodra een config bonus toevoegt of maxScore verlaagt. _Bewijs: _engines/builder-canvas.json topIssue 5 + gates[2]; niet reproduceerbaar in deze missie_
7. **MINOR** · motor · onbevestigd — Geen dubbelklik-bescherming op 'Missie voltooid!': handleComplete is async zonder laadtoestand, dus meerdere kliks kunnen meerdere onComplete-aanroepen afvuren. _Bewijs: _engines/builder-canvas.json gates[4]; run-creatieve-cheater.json stap 8 dubbelklikte wél maar zag geen effect_
8. **MINOR** · motor · onbevestigd — Twee verschillende manieren om de leerling te identificeren: de autosave-sleutel gebruikt de sleutel van het ingestelde Supabase-project, terwijl de AI-chat de eerste de beste sb-*-auth-token uit localStorage pakt. Op een gedeelde schoolcomputer kunnen die uiteenlopen. _Bewijs: _engines/builder-canvas.json topIssue 6 + stateRestore.risks[3]; in geen enkele run getest_
9. **MINOR** · motor · weerlegd — Pure tekenherhaling en toetsenbordgeramte komen er NIET doorheen. Drie runs typten onafhankelijk 'aaaa aaaa...' (49-149 tekens) in zowel het antwoord- als het bewijsveld; de knop bleef in alle gevallen uitgeschakeld. _Bewijs: run-digisterke-dani.json F3; run-creatieve-cheater.json stap 10; run-taalzwakke-tess.json scoreGuess_
10. **MINOR** · motor · weerlegd — Er lekken geen antwoorden. Geen volgorde-hint, geen 'x van y goed'-teller, geen badge die de uitkomst vóór het indienen verklapt; het Preview-tabblad echoot uitsluitend de eigen ingevoerde tekst terug. _Bewijs: run-digisterke-dani.json giveaways; run-creatieve-cheater.json giveaways; run-taalzwakke-tess.json giveaways_

### Wat goed werkte
- Volledig speelbaar van intro tot resultatenscherm in alle vier de runs — geen enkele blocker, geen doodlopend pad, geen verplichte knop die verborgen of onbereikbaar bleef.
- iPad en mobiel volledig schoon (Playwright): geen horizontaal scrollen op 820x1180, 1180x820 en 390x844, alle tapdoelen op of boven 44px, geen hover-only informatie, geen overlappende vaste elementen.
- Geen technische ruis: 0 consolefouten en 0 mislukte netwerkverzoeken in zowel de baseline- als de Playwright-run; alleen normale 200/304-responses van de dev-server.
- Bescherming tegen toetsenbordgeramte werkt aantoonbaar op zowel het antwoordveld als het bewijsveld (drie onafhankelijke bevestigingen).
- Voortgang herstellen is solide: herladen zonder reset gaf exact dezelfde stap, score, vinkjes én letterlijke tekst terug — ook midden in een stap met nog-ongeldige invoer — en ?reset=1 wist netjes terug naar een schoon introscherm.
- Duidelijke, directe feedback per stap: voortgangstoast '✓ x/4 voltooid!', zichtbaar oplopende scorepil, en aan het eind een per-stap scoretabel met badge en takeaways.
- De worstelaar haakte nergens af: de stappen zijn kort genoeg en de checklist geeft concreet houvast over wat er verwacht wordt, ook zonder volledige beheersing van de code-inhoud.
- Dubbelklikken op 'Volgende stap' gaf geen dubbele stapsprong of dubbele scoreoptelling.

### Reparatiekandidaten (niet uitgevoerd — ter beslissing)
| # | Wat | Waar | Omvang | Waarom |
|---|---|---|---|---|
| 1 | Inhoudelijke controle op de tekstpoort: toets het antwoord tegen de opdracht (bijv. verplichte kernbegrippen per stap) in plaats van alleen tegen vorm | motor | groot | Dit is de enige reparatie die B1 echt sluit. Zolang de poort alleen lengte, woordaantal en unieke letters telt, is 100/100 met vier zinnen over het weer bereikbaar en zegt de score niets over wat de leerling kan. Raakt alle 19 builder-canvas-missies. |
| 2 | minTextLength voor deze config verhogen naar het niveau van de zwaardere zusterconfigs (150+) per stap | config | klein | Halve maatregel maar direct uitvoerbaar: deze missie draait nu op de engine-default van 40 tekens terwijl app-prototyper, automation-engineer en web-developer 150/200 zetten. Vier substantiële opdrachten verdienen een hogere ondergrens dan één zin. |
| 3 | Kwaliteitshint tonen onder het bewijsveld, gelijk aan het gewone antwoordveld | motor | klein | Sluit B3. De uitleg bestaat al voor het hoofdveld maar ontbreekt bij het bewijsveld; nu ziet een leerling alleen een teller die 'genoeg' zegt terwijl de knop uit blijft. Drie van de vier runs liepen hier tegenaan. |
| 4 | Voltooiingsdrempel betekenisvol maken of expliciet laten vervallen | motor | middel | Sluit B2. Nu suggereert de 40%-drempel een zak/slaag-oordeel dat niet kan bestaan: alle stappen zijn verplicht, dus iedereen die het scherm bereikt heeft per definitie 100%. Kies: ofwel een echte gedeeltelijke afronding mogelijk maken (met onRetry, wat meteen B6 sluit), ofwel de drempel weghalen en het scherm eerlijk als 'afgerond' presenteren. |
| 5 | Onverklaarde vaktermen in de checklistlabels van stap 3 kort toelichten | config | klein | Sluit B4. 'Tiebreaker' en 'commentaarregel met motivatie' krijgen geen uitleg terwijl 'deterministisch', 'fork' en 'clone' die wél krijgen; dat is willekeurig voor een leerling op A2-B1-niveau en kost één regel per label. |
| 6 | showMilestone uitsluiten van de autosave-state | motor | klein | Sluit B5 (nog onbevestigd, maar goedkoop en zonder risico). Een vluchtige UI-vlag hoort niet in persistente voortgang; nu kan een herlaad binnen ~1-2 seconden na een stapovergang de toast permanent laten hangen. |

### Nog onzeker
- De AI-chat is in geen enkele run geopend, terwijl de config enableChat:true en chatRoleId 'open-source-contributor' zet. Chatgedrag, foutafhandeling en de door de motor gemelde userIdentifier-afwijking (B8) zijn voor deze missie dus niet beoordeeld. Volgens het motorrapport is de chat puur optionele hulp, dus dit raakt het speeladvies niet — maar het is een echte blinde vlek.
- B5 (hangende milestone-toast bij herlaad binnen ~1-2s) is uitsluitend artefactbewijs uit het motorrapport; geen run heeft dat tijdvenster geraakt. Telt daarom als onbevestigd, niet als blocker.
- B7 (dubbelklik op 'Missie voltooid!') is in de dev-preview per constructie niet te toetsen, omdat onComplete daar een no-op is; de cheater dubbelklikte wel en zag geen effect, wat niets bewijst over productiegedrag.
- B6 (<40% dood eind) is met deze config aantoonbaar onbereikbaar; het is een latent motorrisico voor toekomstige configs, geen huidig leerlingprobleem.
- De baseline speelde de gok-route niet end-to-end uit (alleen de poort op stap 1); dat gat is gedicht doordat de cheater-run dezelfde route wél tot en met het resultatenscherm heeft gelopen, dus B1 rust niet op extrapolatie.
- run-creatieve-cheater.json meldt dat vier gebundelde parallelle kliks op checklistvakjes niet registreerden terwijl losse kliks daarna wel werkten. De run schrijft dit toe aan de gedeelde browserbesturing, niet aan de missie, en kon het bij één-voor-één klikken niet reproduceren — maar dat een echte leerling bij snel klikken af en toe een vinkje mist, is niet volledig uitgesloten.
- Geen van de runs heeft de missie ingelogd via de echte route gespeeld (alles via /dev/mission-preview met dummy-Supabase), dus opslag onder een echte userId-sleutel en de werkelijke onComplete-afhandeling zijn niet waargenomen.
