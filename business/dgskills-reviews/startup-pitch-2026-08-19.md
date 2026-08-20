## Opdracht Live Check: startup-pitch — J3P3 (motor tool-guide)

**Advies:** fix-eerst
**Risico:** Geel
**Getest als:** gesimuleerde leerlingen (serieuze baseline · sjoemelaar · worstelaar · iPad via Playwright) op de dev-previewroute, zonder login
**Datum:** 2026-08-19

### In één alinea
Deze missie laat leerlingen in vier stappen een startup-pitch voorbereiden, met tussentijdse kennisvragen. Een serieuze leerling haalt eerlijk de volle 55 punten, maar een sjoemelaar haalt ook 100% door blind altijd het derde antwoord te kiezen — zonder één vraag te lezen. Zelfs iemand die alle kennisvragen fout heeft, krijgt met alleen het afvinken van de checklist 73% en het predicaat 'Gehaald'. Een onzekere leerling loopt vast als één vinkje mist (geen knop, geen hint) en ervaart spanning omdat nergens staat dat een kennisvraag maar één poging heeft. De missie is speelbaar en voelt goed, maar de puntentelling maakt zakken onmogelijk en beloont oppervlakkig klikken.

### Scores per profiel
| Profiel | Resultaat |
|---|---|
| Serieuze baseline | eerlijk 55/55 (100%) 'Gehaald'; gokproef (alle 3 vragen fout) 40/55 (73%) eveneens 'Gehaald' |
| Sjoemelaar | 55/55 (100%) via blind 'altijd de derde optie' zonder één vraag te lezen; vloer met alles fout: 40/55 (73%) 'Gehaald' |
| Worstelaar | eerlijk 55/55 (100%); gokrun (3x fout) 40/55 (73%) 'Gehaald' met felicitatietoon |
| iPad (Playwright) | niet gemeten (run-ipad-iris.json ontbreekt) |

### Bevindingen
1. **MAJOR** · motor · bevestigd — De checklist is pure zelfrapportage (nergens een invoerveld) en levert 40 van de 55 punten; wie alles aanvinkt maar alle kennisvragen fout heeft, eindigt op 73% 'Gehaald' met felicitaties. Zakken is structureel onbereikbaar; dit geldt voor alle 8 tool-guide-missies. _Bewijs: run-digisterke-dani.json F1; run-creatieve-cheater.json F1; engine: ToolGuide.tsx:80-99, CompletionScreen.tsx:65 (drempel 40%)_
2. **MAJOR** · missie · bevestigd — Alle 3 kennisvragen hebben het juiste antwoord op de derde positie; blind 'altijd de derde' gaf 100% zonder lezen. Past in een motorbreed patroon (index 0 is nooit juist in 26 vragen over 8 configs). _Bewijs: run-creatieve-cheater.json F2; config: startup-pitch.ts:38, :62, :99 alle correctIndex 2_
3. **MAJOR** · motor · bevestigd — Kennisvragen kennen geen herkansing, maar dat wordt vooraf nergens gemeld; bij een fout antwoord toont de feedback direct het volledige juiste antwoord en gaat de leerling gewoon door. Een onzekere leerling ervaart onnodige spanning; een zwakke leerling krijgt het antwoord cadeau. _Bewijs: run-onzekere-noor.json F1; engine: ToolGuide.tsx:345-349; config: geen allowRetry_
4. **MINOR** · motor · bevestigd — De doorgaan-knop wordt niet getoond zolang de checklist incompleet is; wie één item mist ziet geen knop, geen hint en geen volgende vraag — volledige stilstand zonder uitleg. _Bewijs: run-creatieve-cheater.json F3; engine: ToolGuide.tsx:445-454_
5. **MINOR** · motor · bevestigd — De afrondknop 'Missie voltooid!' doet in de preview zichtbaar niets maar wist stilletjes de opgeslagen voortgang; herladen daarna landt op het introscherm. In productie is dit gemaskeerd, maar de volgorde blijft fragiel. _Bewijs: run-onzekere-noor.json F4 (localStorage-sleutel verdwenen na klik); engine: ToolGuide.tsx:570-573_
6. **MINOR** · missie · bevestigd — De checklist vraagt om werk dat nergens in de missie wordt gemaakt of getoond (bijv. 'Ik heb het probleem beschreven in één duidelijke zin' zonder plek om dat te doen); voor een onzekere leerling blijft onduidelijk of aanvinken volstaat. _Bewijs: run-onzekere-noor.json F3; config: startup-pitch.ts checklistItems_
7. **MINOR** · motor · onbevestigd — Een klik op de startknop landde tweemaal op een overlappende Kees-tip-kaart, maar dit is alleen gemeten in een verborgen paneel met bevroren animatie; waarschijnlijk een testartefact, niet door Playwright bevestigd. _Bewijs: run-onzekere-noor.json F6; geen Playwright-run beschikbaar_

### Wat goed werkte
- Volledig speelbaar en afrondbaar in alle drie de runs: intro → 4 stappen → resultatenscherm, zonder crash, console-fouten of netwerkfouten.
- Geen verklap: het juiste antwoord, een teller of badge is nergens zichtbaar vóór het beantwoorden; de reveal komt pas ná 'Controleer antwoord'.
- Dubbelklik is niet exploiteerbaar: checklist-items en 'Controleer antwoord' zijn idempotent — geen dubbele punten, geen corruptie.
- Voortgangsherstel is betrouwbaar: mid-missie herladen hervat exact op dezelfde stap/score/vinkjes; ?reset=1 geeft een schone start.
- De score-pil telt correct op (0→15→30→40→55) en het resultatenscherm toont per-stapscores die kloppen met het gespeelde pad.
- De tips zijn didactisch functioneel: de concreet-vs-vaag-tip in stap 1 maakte de kennisvraag voor de worstelaar goed beantwoordbaar; de toon van Kees past bij een onzeker profiel.

### Reparatiekandidaten (niet uitgevoerd — ter beslissing)
| # | Wat | Waar | Omvang | Waarom |
|---|---|---|---|---|
| 1 | Spreid de juiste antwoorden over de posities in de startup-pitch-config (nu 3x derde optie) | config | klein | Blind 'altijd de derde' geeft nu 100% zonder lezen; herschikken heft de missie-eigen bias direct op. Motorbreed geldt hetzelfde patroon voor alle 8 configs. |
| 2 | Maak 'Gehaald' afhankelijk van meer dan zelfrapportage (herweeg checklist vs. kennisbonus, of stel per missie een drempel boven de checklist-vloer in) | motor | middel | De vloer van 67-73% uit alleen vinkjes maakt de drempel van 40% betekenisloos en beloont oppervlakkig klikken — strijdig met de XP-farming-preventieregel. |
| 3 | Toon bij een incomplete stap een uitgeschakelde doorgaan-knop mét hint wat er nog ontbreekt | motor | klein | Nu wordt de knop simpelweg niet gerenderd; een leerling die één vinkje mist zit stil zonder uitleg. Een disabled-knop met tekst lost de stille vastloper op. |
| 4 | Meld vóór de kennisvraag dat er één poging is, en stem de eindfeedback af op de kennisscore | motor | klein | De onaangekondigde één-kans-mechaniek geeft onnodige spanning, en Kees feliciteert ook wie 0 van 3 kennisvragen goed had — een onterecht geruststellend signaal. |
| 5 | Geef in de dev-preview zichtbare feedback op de afrondknop of stel clearSave uit tot na een geslaagde onComplete | motor | klein | De knop lijkt kapot terwijl hij de opslag al wist; herladen daarna gooit de leerling terug naar het intro. In productie gemaskeerd, maar de volgorde blijft fragiel. |

### Nog onzeker
- mobiel/tablet niet gemeten — Playwright is op verzoek van Yorin uitgeschakeld (venster stal focus)
- B7 (Kees-kaart-overlap over de startknop) is onbevestigd: DOM-gemeten in een verborgen paneel met bevroren animatie; heeft een Playwright-herhaling nodig voordat er iets uit volgt
- Het productiegedrag van de afrondknop (onComplete met server-vastlegging) is in deze runs niet getest; alle waarnemingen over B5 gelden de dev-preview
- startedAt/durationMin in de runs zijn schattingen van de agents, geen klokmetingen
