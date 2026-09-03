## Opdracht Live Check: pitch-perfect — J3P4 (motor builder-canvas)

**Advies:** fix-eerst
**Risico:** Geel
**Getest als:** gesimuleerde leerlingen (serieuze baseline · sjoemelaar · worstelaar · iPad via Playwright) op de dev-previewroute, zonder login
**Datum:** 2026-08-19

### In één alinea
De missie laat leerlingen in vier stappen een pitch opbouwen met checklists en tekstvelden. Een serieuze leerling haalt eerlijk de volle 100 punten, maar een sjoemelaar haalt diezelfde 100 punten met alleen vinkjes en vier nietszeggende zinnen — de tekstpoort kijkt alleen naar lengte, niet naar inhoud. Zakken is onmogelijk: wie het eindscherm haalt, staat altijd op 100. Een worstelaar loopt niet vast maar moet op stap 1 zelf zoeken welk vinkje mist, omdat de knop uit blijft zonder uitleg. De missie-inhoud zelf is sterk, maar de motor laat sjoemelen volledig toe en moet eerst worden aangepakt.

### Scores per profiel
| Profiel | Resultaat |
|---|---|
| Serieuze baseline | 100/100 (100%) eerlijk; 100/100 (100%) met één herhaalde irrelevante zin in alle 4 velden |
| Sjoemelaar | 100/100 (100%) met 19 vinkjes + 4 plausibele-maar-irrelevante zinnen |
| Worstelaar | 100/100 (100%) eerlijk met korte generieke tekst (39-76 tekens); gokproef 0 (geblokkeerd op stap 1 door herhaalde-tekens-filter) |
| iPad (Playwright) | niet gemeten |

### Bevindingen
1. **MAJOR** · motor · bevestigd — De tekstpoort kijkt alleen naar vorm (lengte, aantal woorden, unieke letters) en nooit of de tekst over de eigen pitch gaat; vier keer dezelfde irrelevante zin levert 100/100 en "Top gedaan!" op, identiek aan een eerlijke run. _Bewijs: run-letterlijke-luca.json F1; run-creatieve-cheater.json F1; run-afgeleide-amir.json F3; BuilderCanvas.tsx:144-159, answerQuality.ts:51-56_
2. **MAJOR** · motor · bevestigd — Zakken is structureel onmogelijk: het resultatenscherm is alleen bereikbaar als alle 4 stappen door de poort zijn, en zonder bonusvragen staat iedereen die het scherm haalt op 4×25=100; de 40%-drempel en "Nog niet gehaald" meten dus niets. _Bewijs: run-creatieve-cheater.json F4; BuilderCanvas.tsx:133-140,267; config maxScore 100 zonder followUp/bonus_
3. **MINOR** · motor · bevestigd — Het bewijsveld op stap 1 toont bij lange maar betekenisloze tekst alleen een lengteteller (bijv. "60/45") die voldaan oogt, terwijl de knop uit blijft en de echte reden nergens staat; het hoofdtekstveld op dezelfde stap geeft die uitleg wél. _Bewijs: run-letterlijke-luca.json F2; run-afgeleide-amir.json F2; StepInstructionPanel.tsx:195-202 vs :160-167_
4. **MINOR** · missie · bevestigd — Stap 1 is de zwaarste poort (8 checklistitems + hoofdtekst + bewijsveld) en geeft geen aanwijzing welke voorwaarde nog openstaat; een leerling die één vinkje mist ziet alleen een uitgeschakelde knop en moet zelf zoeken. _Bewijs: run-afgeleide-amir.json steps 2-4; config pitch-perfect.ts stap "pitch-structuur" (8 checklistItems + evidence minLength 45)_
5. **MINOR** · motor · onbevestigd — Een toast "✓ x/4 voltooid!" zou na snel herladen permanent kunnen blijven hangen doordat de toast-instelling wordt meegeslagen in de autosave; in de speelronde niet reproduceerbaar door tool-latency, code wijst het risico wel aan. _Bewijs: run-creatieve-cheater.json F6 (needsPlaywright:true); BuilderCanvas.tsx:76,229-234 + useMissionAutoSave.ts debounce 1s_
6. **MINOR** · motor · onbevestigd — Ontbrekende dubbelklik-bescherming op "Missie voltooid!" kon niet worden geverifieerd omdat de previewomgeving geen echte afronding uitvoert; dubbelklikken gaf geen effect en geen foutmelding. _Bewijs: run-creatieve-cheater.json F5 (needsPlaywright:true); BuilderCanvas.tsx:264-271_

### Wat goed werkte
- Geramte-bescherming werkt: herhaalde tekens ("aaaa…", 60x "a") blokkeren de knop in alle drie de runs — de eerder gerapporteerde reparatie uit teamreview-j2p2 houdt stand
- UI-trucs leveren geen exploit op: terugklikken + vakje uitvinken neemt geen punten terug maar levert er ook geen op; klikken op de uitgeschakelde knop is inert; dubbelklik op de eindknoppen gaf geen crash of dubbele voortgang
- Herladen is betrouwbaar: mid-missie resume herstelt fase/stap/score/tekst exact, reset=1 geeft gegarandeerd een schone start, en het wissen van de autosave ná voltooiing is bedoeld gedrag
- Geen verklappingen: geen vooraf zichtbare antwoorden, tellers of badges; deze config heeft geen verdiepingsvraag, dus het bekende vastgelegd-eerste-antwoord-risico is hier niet van toepassing
- Missie-eigen inhoud is sterk en concreet: expliciete checklists per stap, duidelijke instructies (kernzin per onderdeel, max 3 zinnen per jury-antwoord) — de letterlijke lezer (Luca) liep nergens vast
- Stapovergangen zijn helder gemarkeerd ("Stap X van 4" als role=status, toast na overgang, knoptekst wisselt naar "Resultaten bekijken" op de laatste stap)

### Reparatiekandidaten (niet uitgevoerd — ter beslissing)
| # | Wat | Waar | Omvang | Waarom |
|---|---|---|---|---|
| 1 | Tekstpoort inhoudelijk koppelen aan de opdracht (of eindscore differentiëren) zodat irrelevante volzinnen geen 100/100 opleveren | motor | groot | Kernzwakte, in alle drie de runs bevestigd: een leerling die niets van de opdracht begrijpt haalt exact dezelfde score en dezelfde lof als een leerling die serieus werkt — de score meet typen en vinken, geen pitchvaardigheid |
| 2 | Bewijsveld dezelfde specifieke kwaliteitshint geven als het hoofdveld (conform sol-correctie J3P3), i.p.v. alleen de generieke "betekenisvol bewijs"-teller | motor | klein | Bij betekenisloze-maar-lange invoer oogt de teller voldaan (60/45) terwijl de knop uit blijft; leerling ziet een getal maar geen reden — afhaakrisico voor zwakkere profielen |
| 3 | Bij een uitgeschakelde "Volgende stap" tonen welke voorwaarde nog openstaat (x/8 vinkjes, hoofdtekst, bewijs) | motor | klein | Op de zware stap 1 van deze missie zocht de worstelaar blind naar het gemiste vinkje; één regel ontbrekende-voorwaarde-feedback voorkomt dat |
| 4 | 40%-drempel betekenis geven of eerlijk communiceren dat afronden = gehaald | motor | middel | "Nog niet gehaald" is met deze motor + config onbereikbaar; een drempel die niets kan meten wekt een schijn van toetsing richting leerling en docent |
| 5 | minTextLength voor pitch-perfect verhogen, minimaal op stap 2 ("Pitch uitschrijven") | config | klein | Een "volledig uitgeschreven 5-minuten-pitch" die met de engine-default van 40 tekens door de poort komt is ongeloofwaardig; app-prototyper/web-developer zetten al 150-200 als precedent |
| 6 | showMilestone niet meepersisteren in de autosave | motor | klein | Code-aangewezen risico op een permanent hangende toast na snel herladen; in de speelronde onbevestigd, dus lage prioriteit maar goedkoop af te dichten |

### Nog onzeker
- mobiel/tablet niet gemeten — Playwright is op verzoek van Yorin uitgeschakeld (venster stal focus)
- Milestone-toast-herlaadbug niet reproduceerbaar door tool-latency; code wijst het risico aan maar speelbewijs ontbreekt (needsPlaywright)
- Dubbelklik-bescherming op "Missie voltooid!" niet verifieerbaar in /dev/mission-preview (onComplete is no-op); vereist test met echte backend
- De stil-dataverlies-observatie na herladen op stap 3 (run-afgeleide-amir.json F1) was hoogstwaarschijnlijk een gedeeld-browserpaneel-focusartefact (andere speelagent had de tabfocus); na tabs_select werkte alles — niet als missiebug gewogen
- AI-chat (Kees) in geen enkele run geopend; foutafhandeling van de edge function niet beoordeeld — chat is optionele hulp, geen poort hangt eraan
