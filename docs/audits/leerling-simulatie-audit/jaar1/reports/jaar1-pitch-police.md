## Opdracht Live Check: pitch-police

**Advies:** fix-eerst
**Risico:** Geel
**Getest als:** leerling (dev-preview zonder login)
**URL:** http://localhost:3010/dev/mission-preview?mission=pitch-police

### Student-playthrough (per profiel: start/flow/feedback/eind)

**Modelleerling** — Intro-scherm ("Pitch Politie") is duidelijk: doel, hoe-werkt-het in 3 stappen, tags (minder tekst/contrast/rustige layout). Speelde alle 8 dia's serieus, koos bewust 1 fout antwoord op dia 2 (contrast-fout) om foutfeedback te testen. Elke dia toont een PowerPoint-mockup links (dia-lijst) + slide in het midden + "Politie Rapport"-paneel rechts met overtreding + 3 oplossingsopties. Correcte antwoorden herschrijven de slide live en tonen "Volgende Dia". Op de laatste dia (8, "Schoolcijfers") werd de knop "Afronden" i.p.v. "Volgende Dia" — klikken hierop deed **niets**: geen navigatie, geen eindscherm, geen score. Herhaald geprobeerd (2x + expliciete 5s wachttijd op tekst "punten") zonder resultaat.

**Speedrunner** — Klikte altijd eerste optie (vaak fout), kon niet skippen: bij een fout antwoord verschijnt geen "Volgende Dia"-knop, dus zinloze snelle input wordt effectief tegengehouden (goede didactische integriteit). Moest dus alsnog het juiste antwoord vinden op elke dia. Dubbelklikte op "Afronden" op de laatste dia — zelfde resultaat: niets gebeurt. Bevestigt de Modelleerling-bevinding onafhankelijk.

**Chaoot** — Dubbelklikken op antwoorden/navigatie, reload midden in onbeantwoorde stappen (dia 5, dia 7), browser-back, verkeerde volgorde (Vorige→Volgende→Vorige). Geen enkele crash of state-corruptie: correcte antwoorden en dia-positie overleven reload probleemloos. `back` navigeerde naar `about:blank` (verwacht harnas-gedrag, geen app-bug — SPA zonder multi-page historie). Ook hier: "Afronden" op de laatste dia bleef inert, zelfs na 3x los klikken + 1x dubbelklik.

**Vastloper** — Koos bewust 3x hetzelfde foute antwoord op dia 1, dia 2 en dia 8. Op geen van de drie verscheen een hint, extra uitleg, of enige aanmoediging — het Politie Rapport-paneel bleef woordelijk identiek bij elke herhaalde poging. Geen permanente lock: het juiste antwoord kiezen werkt na willekeurig veel eerdere foute pogingen. "Afronden" faalde ook hier (4e onafhankelijke reproductie).

### Visuele UI/UX (logo's/afbeeldingen/layout/tekst-knoppen)
- Intro-scherm en PowerPoint-mockup zien er strak en herkenbaar uit op desktop (1440x900): heldere iconen, consistente kleuren (geel/zwart/wit), duidelijke A/B/C-knoppen.
- Dia 4 (Eerste Hulp): de vervangende foto heeft een subtiel gestapeld/dubbelrand-effect (mogelijk bewust polaroid-stijl) — puur cosmetisch, geen probleem.
- Dia 6 (Droomauto): platgedrukte-auto-fout en Shift-fix werken visueel goed en zijn duidelijk zichtbaar.
- **Tablet-portrait (810x1080)**: het volledige "Politie Rapport"-paneel (overtreding + oplossingsopties) én de dia-navigatiebalk links verdwijnen uit beeld — leerling ziet alleen de kale slide. Op tablet-landscape (1080x810) is alles wel aanwezig.
- **Mobile (390x844)**: het Politie Rapport-paneel ontbreekt ook — vermoedelijk bewust weggelaten voor kleine schermen, maar leerling mist daardoor de tekstuele feedback/opdracht op het moment dat die het hardst nodig is.

### Browserbewijs (tabel 4 viewports × 4 states)

| Viewport | start | flow | feedback | eind |
|---|---|---|---|---|
| desktop (1440x900) | ✅ intro helder | ✅ slide+rapport zichtbaar | ✅ live-fix zichtbaar | ⚠️ hangt op "Afronden" (geen eindscherm) |
| tablet-portrait (810x1080) | ✅ ongewijzigd | — | ❌ rapport + dia-balk verdwenen | ⚠️ zelfde hang, rapport ook weg |
| tablet-landscape (1080x810) | ✅ ongewijzigd | — | ✅ alles aanwezig | ⚠️ zelfde hang |
| mobile (390x844) | ✅ ongewijzigd | — | ⚠️ rapport ontbreekt | ⚠️ zelfde hang |

### Bevindingen (BLOCK/WARN/INFO, genummerd, met bewijs-pad)

1. **BLOCK** — De "Afronden"-knop op de laatste dia (8/8, na correct antwoord) doet niets: geen navigatie, geen eindscherm, geen score, geen console-/network-activiteit. Onafhankelijk gereproduceerd door alle 4 profielen (single click, dubbelklik, herhaald klikken, 5s wachten op tekst "punten"). Een leerling die de missie perfect en eerlijk speelt kan hem technisch niet afsluiten.
   Bewijs: `/Users/yorinvonder/dgskills-audit/evidence/pitch-police/modelleerling/desktop/eind.png`

2. **WARN** — Een fout antwoord kiezen geeft geen enkele foutfeedback: geen melding, geen uitleg, geen visuele reactie behalve dat de gekozen knop geel gemarkeerd wordt als "geselecteerd". De slide en het Politie Rapport blijven volledig ongewijzigd. Bevestigd consistent bij herhaling (3x hetzelfde foute antwoord op 3 verschillende dia's) — er is geen enkele progressieve hint of aanmoediging voor leerlingen die vastlopen.
   Bewijs: `/Users/yorinvonder/dgskills-audit/evidence/pitch-police/modelleerling/desktop/flow-dia2-na-fout.png`, `/Users/yorinvonder/dgskills-audit/evidence/pitch-police/vastloper/vastgelopen-dia1-3x-fout.png`

3. **WARN** — Op tablet-portrait (810x1080) verdwijnt het volledige "Politie Rapport"-paneel (overtreding + oplossingsopties) én de dia-navigatiebalk uit beeld. De leerling ziet alleen de kale slide zonder enige opdracht of context — een belangrijk didactisch element valt weg op een veelgebruikte schoolgrootte (iPad rechtop).
   Bewijs: `/Users/yorinvonder/dgskills-audit/evidence/pitch-police/modelleerling/tablet-portrait/feedback.png`

4. **INFO** — Op mobile (390x844) ontbreekt het Politie Rapport-paneel ook. Vermoedelijk bewust ontworpen voor kleine schermen, maar leerling mist wel de tekstuele feedback/opdracht op mobiel.
   Bewijs: `/Users/yorinvonder/dgskills-audit/evidence/pitch-police/modelleerling/mobile/feedback.png`

5. **INFO** — Missie is robuust tegen chaotisch gedrag: dubbelklikken, reload midden in een onbeantwoorde stap, en verkeerde-volgorde navigatie (Vorige/Volgende) geven geen crash of state-corruptie. Correcte antwoord-state en dia-positie blijven behouden na reload — goede technische stabiliteit.

6. **INFO** — Speedrunners kunnen niet skippen zonder het juiste antwoord: bij een fout antwoord verschijnt geen "Volgende Dia"-knop, dus zinloze snelle input wordt effectief geblokkeerd. Positief voor didactische integriteit, ook al ontbreekt de foutfeedback zelf (zie bevinding 2).

### Nog onzeker
- Of de Afronden-bug een missende `onClick`-handler is, een conditie die nooit `true` wordt, of een ontbrekend CompletionScreen-component — geen broncode gelezen conform opdracht, alleen browser-observatie.
- Of het intro-scherm ("gebruikt hints") verwijst naar een hint-mechanisme dat elders in de missie zit maar dat ik niet heb gevonden, of dat dit puur rol-omschrijving is zonder daadwerkelijke hint-functie in de UI.
- Of de tablet-portrait layout-breuk (bevinding 3) een CSS-breakpoint-fout is specifiek voor 810px breed, of een breder responsive-probleem dat ook bij andere tussenliggende breedtes optreedt.
