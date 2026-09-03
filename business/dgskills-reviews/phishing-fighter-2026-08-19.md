## Opdracht Live Check: phishing-fighter — J3P2 (motor scenario-engine)

**Advies:** fix-eerst
**Risico:** Rood
**Getest als:** gesimuleerde leerlingen (serieuze baseline · sjoemelaar · worstelaar · iPad via Playwright) op de dev-previewroute, zonder login
**Datum:** 2026-08-19

### In één alinea
De missie leert leerlingen phishing herkennen via vier rondes: herkennen, rangschikken, beoordelen en beschermen. Een goede leerling haalt de volle punten niet: de beste eerlijke score was 78%, en twee verschillende maar logische redeneringen leverden allebei 15/25 op in de rangschikronde. Een sjoemelaar komt nergens: alle trucs (alles aanvinken, overal dezelfde knop) gaven 0/25 per ronde. Een worstelaar haalt de missie wel (65%), maar loopt vast op een eindscherm zonder uitweg zodra iemand onder de 40% zakt — dat is de harde blocker. Het oordeel is fix-eerst: de missie-inhoud is goed, maar de motor heeft een dodelijke valkuil voor wie halverwege afhaakt.

### Scores per profiel
| Profiel | Resultaat |
|---|---|
| Serieuze baseline | eerlijk 78/100 (78%), 'Gehaald', badge Waakzame Detective; gokrun 20/100 (20%) |
| Sjoemelaar | zak-scenario 5/100 (5%), 'Nog niet gehaald'; alle sjoemeltrucs (alles aanvinken, overal dezelfde knop) gaven 0/25 per ronde |
| Worstelaar | eerlijk 65/100 (65%), 'Gehaald'; aparte gokrun 3/100 (3%) |
| iPad (Playwright) | nog niet gemeten — run-ipad-iris.json ontbreekt, Playwright-verificatie loopt (verify-claims.json staat klaar); alle drie de runs draaiden op innerWidth 1280 |

### Bevindingen
1. **BLOCKER** · motor · bevestigd — Een leerling die onder 40% eindigt zit muurvast op het eindscherm: de enige knop is uitgeschakeld, er is geen terugknop, en herladen brengt hem op hetzelfde doodlopende scherm terug. _Bewijs: run-digisterke-dani.json F1 (20%, DOM: precies 1 button, disabled===true); run-creatieve-cheater.json F1 (5%, idem + herlaadtest); run-taalzwakke-tess.json F1 (3%, idem); _engines/scenario-engine.json topIssues[0]: shared/CompletionScreen.tsx:163-171 (disabled={!passed && !onRetry}, passed = >=40%) + ScenarioEngine.tsx:326-343 (geen onRetry) + useMissionAutoSave.ts:231-248_
2. **BLOCKER** · motor · onbevestigd — Geclaimde reload-bestendige soft-lock op de verdiepingsvraag: beantwoord de vraag en herlaad vóór 'Doorgaan →', dan verschijnt de vraag opnieuw als onbeantwoord maar doet elke klik zichtbaar niets. Dit is NIET meegewogen in het oordeel: nog niet met Playwright gereproduceerd. _Bewijs: run-creatieve-cheater.json F2 (localStorage roundStates['bescherm-jezelf'].followUpCorrect al false vóór herlaad; na herlaad geen 'Doorgaan'-knop); verify-claims.json claim 1; _engines/scenario-engine.json stateRestore.risks_
3. **MAJOR** · missie · bevestigd — Ronde 4 heeft 6 juiste items en maar 2 afleiders; één misklik halveert de rondescore (13/25 bij zes van zes goed). De worstelaar herkende alle zes juiste maatregelen maar klikte één afleider aan en werd daarvoor gehalveerd. _Bewijs: run-taalzwakke-tess.json F2 (7 van 8 geselecteerd, 13/25); run-digisterke-dani.json step 5 (5 van 6 juist, geen fout, 21/25); _engines/scenario-engine.json topIssues[3] en scoring (sub/FeedbackBanner.tsx:13,31-36); config phishing-fighter.ts:333-423 (6x correct:true, 2x correct:false)_
4. **MINOR** · missie · bevestigd — Ronde 3 bevat een bewust tegen-intuïtief item: de Google-melding 'ingelogd vanuit Rusland' telt als ECHT bericht. Beide eerlijke spelers maakten hier hun enige fout en bleven op 17/25. _Bewijs: run-digisterke-dani.json step 4 + unsure; run-taalzwakke-tess.json F3 (feedback '✕ Begrijpelijk — inloggen uit Rusland klinkt alarmerend'); config phishing-fighter.ts:274-283 (item 4, correct:true)_
5. **MINOR** · motor · onbevestigd — Een dubbelklik op de inzendknop slaat de feedback-banner met de uitleg over: de tweede klik landt op de net verschenen 'Volgende ronde'-knop. Geen scorevoordeel, wel een gemiste leerkans. _Bewijs: run-creatieve-cheater.json F3 (na dubbelklik direct Fase 2/4 zonder zichtbare feedback-banner); verify-claims.json claim 2_
6. **MINOR** · missie · onbevestigd — De kaarttitels in ronde 2 gebruiken onvertaalde vaktaal ('Spear phishing naar de directeur', 'Smishing via sms') zonder uitleg in de titel zelf; alleen de beschrijving eronder verduidelijkt de term. _Bewijs: run-taalzwakke-tess.json F4 (artefactChecked:false, didactische observatie)_
7. **MINOR** · missie · weerlegd — WEERLEGD: de baseline meldde dat de verdiepingsvraag twee keer verschijnt (na ronde 3 én ronde 4). De config bevat maar één followUp-blok, in ronde 4; de sjoemelaar en de worstelaar zagen hem ook uitsluitend daar. _Bewijs: config phishing-fighter.ts:321-332 (enige followUp, correctIndex 2, bonusPoints 0); run-taalzwakke-tess.json routemap[4] ('alleen bij laatste ronde'); run-creatieve-cheater.json routemap[4]; tegenover run-digisterke-dani.json F4_
8. **MINOR** · missie · bevestigd — Ronde 2 'gevaarlijkste aanval eerst' beloont alleen de exacte auteursvolgorde met volle punten. Twee spelers redeneerden onafhankelijk plausibel en kwamen allebei op 15/25 door één buurpositie-verwisseling. _Bewijs: run-digisterke-dani.json step 3 + unsure; run-taalzwakke-tess.json step 3 (15/25 bij een andere maar even logische volgorde); config phishing-fighter.ts:163-229 (correctPosition 0-4), 233-234_

### Wat goed werkte
- De missie is van begin tot eind speelbaar zonder blokkade zolang je boven de 40% blijft: drie runs kwamen zonder haperen bij het eindscherm, met een duidelijke per-ronde-uitsplitsing en een actieve afrondknop.
- Sjoemelbestendigheid werkt aantoonbaar: 'alles aanvinken' gaf twee keer 0/25, 'overal Accepteren' 0/25, 'overal Weigeren' 0/25, omgekeerde volgorde 3-5/25. Vrije punten zonder inhoud zijn er niet.
- De verborgen minSelections-val die andere missies van deze motor treft (grijze inzendknop zonder uitleg) zit NIET in deze config: de inzendknop was in beide select-correct-rondes al actief bij één selectie, in drie runs onafhankelijk gemeten.
- Geen enkele verklapping: geen zichtbaar juist antwoord, geen 'x van y goed'-teller, geen badge vooraf, en de rangschikronde hussel per leerling.
- Technisch schoon en volledig client-side: geen console-fouten, alle netwerkverzoeken 200/304, geen dummy-Supabase-aanroepen — in drie runs bevestigd.
- Herlaadgedrag midden in een ronde klopt: exacte hervatting inclusief nog niet ingezonden selecties, geen dataverlies en geen tweede kans; met &reset=1 start de missie schoon.
- De verdiepingsvraag verschijnt ook bij een rondescore van 0/25 — de eerder gerepareerde drempel is aantoonbaar weg — en een fout antwoord kan niet via een herlaad worden omgezet in punten.
- Feedback per ronde is inhoudelijk en concreet: gemiste items krijgen 'gemist!' met uitleg, foute volgordeposities krijgen '(#N)', en de banner wordt als role=status aangekondigd.

### Reparatiekandidaten (niet uitgevoerd — ter beslissing)
| # | Wat | Waar | Omvang | Waarom |
|---|---|---|---|---|
| 1 | Geef het eindscherm onder 40% een uitweg (herkansing of terugknop) | motor | middel | Dit is de enige bevestigde harde blocker. Zolang de motor geen onRetry meegeeft is de enige knop op het scherm uitgeschakeld en is er geen terugweg; omdat phase 'results' wordt opgeslagen is de val bovendien herlaad-bestendig. Raakt alle missies van deze motor, niet alleen phishing-fighter. |
| 2 | Verdiepingsvraag herlaad-vast maken (of eerst met Playwright bevestigen) | motor | middel | Als de geclaimde soft-lock klopt, blokkeert een toevallige refresh op de laatste ronde het afronden volledig. Eerst reproduceren met Playwright (verify-claims.json staat klaar); daarna moet een al beantwoorde followUp na herladen zijn beantwoorde staat plus de 'Doorgaan'-knop tonen in plaats van als onbeantwoord te renderen. |
| 3 | Afleiderverhouding in ronde 4 herzien | config | klein | Met 6 juiste items en 2 afleiders halveert één misklik de rondescore (13/25 bij zes van zes goed). Een derde afleider toevoegen — of de items herverdelen — maakt de straf evenredig aan de fout, zonder de motorformule te hoeven aanpassen. |
| 4 | Rangschikcriterium in ronde 2 expliciet maken | config | klein | Beide eerlijke spelers bleven op 15/25 met een verdedigbare volgorde. Eén zin in de rondebeschrijving over waarop 'gevaarlijkst' beoordeeld wordt (doelwit, schade, bereik) maakt volle punten haalbaar door redeneren in plaats van raden. |
| 5 | Vaktermen ondertitelen in de kaarttitels van ronde 2 | config | klein | 'Spear phishing' en 'smishing' staan onvertaald in de titel — het deel dat een taalzwakke leerling als enige leest. Een korte Nederlandse toevoeging in de titel houdt de kaart begrijpelijk zonder het antwoord te verklappen. |
| 6 | Voorkom dat een dubbelklik de feedback-uitleg overslaat | motor | klein | De 'Volgende ronde'-knop verschijnt op of vlak bij de plek van de inzendknop, waardoor de tweede klik van een dubbelklik de leeruitleg wegklikt. Een korte niet-klikbare periode of een andere positie voor de doorgaan-knop houdt de uitleg in beeld. |
| 7 | Google-item van ronde 3 didactisch afronden | config | klein | Het item straft voorzichtig gedrag dat de rest van de missie juist aanleert. De fout-feedback erkent dat al; een expliciete regel in de ronde-intro ('let op: niet elk alarmerend bericht is nep') maakt van de valstrik een aangekondigd leermoment. |

### Nog onzeker
- iPad/tablet is volledig ongemeten: run-ipad-iris.json bestaat nog niet, de Playwright-run loopt. Alle drie de speelruns draaiden op innerWidth 1280 met mobile.measured:false.
- De soft-lock bij de verdiepingsvraag (B2) is onbevestigd — verificatie loopt via verify-claims.json. Als Playwright hem reproduceert, verschuift het risico van 'alleen de zwakke leerling' naar 'elke leerling die toevallig ververst op de laatste ronde'.
- De dead-end is alleen in /dev/mission-preview op localhost gemeten. De onderliggende logica is gedeeld met productie (motorreview: CompletionScreen + useMissionAutoSave), maar op dgskills.app is het niet nagespeeld.
- Onbekend of de 'Hoe zeker ben je?'-selector in ronde 3 invloed heeft op de score; dat viel buiten de proeven.
- Of 25/25 in ronde 2 haalbaar is door louter redeneren blijft open: twee spelers met verschillende, allebei plausibele volgordes kwamen allebei op 15/25.
- Bij één submit in de gokrun van de baseline is de knop via een in-page click aangeroepen in plaats van een echte muisklik; de uitkomst kwam overeen met de wel via muisklik gemeten rondes, dus behandeld als geldig.
