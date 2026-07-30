## Opdracht Live Check: data-speurder

**Advies:** ship
**Risico:** Groen
**Getest als:** leerling (dev-preview zonder login)
**URL:** http://localhost:3010/dev/mission-preview?mission=data-speurder

### Student-playthrough (per profiel: start/flow/feedback/eind)

**Modelleerling** — Startscherm is helder: titel, doelomschrijving, 4 leerdoelen en een uitnodigende intro van Kees ("Geen stress: stap voor stap kom je er"). Speelde alle 4 fasen serieus op 13-jarig niveau: fase 1 (data vs. informatie vs. conclusie, multiselect), fase 2 (rangschik-vraag: grafiekvorm), fase 3 (6× eerlijk/misleidend-scenario's), fase 4 (welke conclusies zijn verantwoord — correlatie vs. causatie). Maakte 1 bewuste fout in fase 1 (een berekend klassengemiddelde als "ruwe data" bestempeld, terwijl het al samengevatte informatie is) en zag daarna heldere, per-item onderbouwde feedback. Rondde af op **96/100 punten (96%)**, badge "Data Expert", CompletionScreen met score per fase en een "Wat je hebt geleerd"-lijst met 5 inhoudelijk sterke punten (data/informatie/conclusie, correlatie≠causatie, y-as-manipulatie, gemiddelde/mediaan/modus, toegankelijkheid van visualisatie). Geen console- of netwerkfouten.

**Speedrunner** — Klikte zonder te lezen, altijd de eerst-mogelijke opties, probeerde te skippen. Geen enkele fase kon worden overgeslagen (minimaal-item-vereisten en "beantwoord alle scenario's"-gates blokkeren voortijdig doorklikken). Fase 1 (3 snelle klikken, 2 fout) en fase 3 (alles op "Eerlijk" gezet) en fase 4 (eerste 3 items, 1 fout) leverden lage deelscores op. Rondde af op **60/100 punten (60%)** met een passend minder-juichende badge ("Data Analist") en toon ("Goed bezig — en nu weet je precies wat er nog beter kan"). Geen manier gevonden om zinloze/onnadenkende input zonder puntenverlies door de missie te krijgen.

**Chaoot** — Dubbelklikte op "Start de missie" (bracht de app netjes naar fase 1, mét een opvallende bijwerking — zie Bevindingen #1), dubbelklikte op geselecteerde items (toggle bleef consistent, geen dubbele state), reloadde midden in fase 1 én fase 3 (volledige selectie-state hersteld, geen dataverlies), probeerde `back` (geen opgebouwde interne historie → about:blank, herstel door terug te navigeren naar de missie-URL werkte probleemloos), gebruikte "Opnieuw beginnen" op de rangschik-vraag na een gedeeltelijke plaatsing (schone reset), en plaatste bewust de tegenovergestelde (slechtste-naar-beste) volgorde in fase 2 om de feedback te toetsen (correct lage score + expliciete "(#4)"-postitie-aanduiding per item). Rondde af op **77/100 punten (77%)**, geen crash, geen corrupte state, geen console-/netwerkfouten ondanks alle chaos.

**Vastloper** — Gaf bewust op alle 4 fasen een volledig fout antwoord (verkeerde multiselect-items, omgekeerde rangschikking, alle eerlijk/misleidend-antwoorden verwisseld, verkeerde conclusies). Ontdekking: elke fase geeft maar **1 kans**; na "Controleer" toont de app direct de uitleg-feedback en enkel een "Volgende ronde"-knop — geen retry-optie binnen dezelfde fase (zie Bevindingen #4). Er is dus geen manier om zelf 3× op dezelfde vraag te proberen, maar ook geen permanente blokkade: bij een extreem lage eindscore van **6/100 (6%)** bleef de missie volledig afmaakbaar, met een passende bemoedigende badge ("Blijf Oefenen") en boodschap ("Afgerond! Elke poging maakt je sterker. Probeer 'm gerust nog eens."). De volledige "Wat je hebt geleerd"-sectie bleef zichtbaar, ook bij deze score.

### Visuele UI/UX (logo's/afbeeldingen/layout/tekst-knoppen)

Consistente, opgeruimde kaartlayout op alle geteste viewports (1440×900, 810×1080, 1080×810, 390×844). Geen overlappende elementen, geen afgesneden knoppen of tekst; mascotte Kees, puntenteller en fase-indicator blijven overal zichtbaar en leesbaar, ook op mobiel (390px breed). Emoji-iconen per antwoordoptie zijn consistent en dragen bij aan snelle herkenning. Eén a11y-inconsistentie gevonden tussen fase-componenten (zie Bevindingen #3) en één mogelijk-verwarrende iconografie bij foute antwoorden in fase 3 (zie Bevindingen #5) — beide cosmetisch/interpretatie, geen functionele blokkade.

### Browserbewijs (tabel 4 viewports × 4 states)

| Viewport | start | flow | feedback | eind |
|---|---|---|---|---|
| desktop (1440×900) | ✅ alle 4 profielen | ✅ alle 4 profielen | ✅ modelleerling/speedrunner/chaoot | ✅ alle 4 profielen |
| tablet-portrait (810×1080) | ✅ modelleerling | ✅ modelleerling | ✅ modelleerling | ✅ modelleerling |
| tablet-landscape (1080×810) | ✅ modelleerling | ✅ modelleerling | ✅ modelleerling | ✅ modelleerling |
| mobile (390×844) | ✅ modelleerling | ✅ modelleerling | ✅ modelleerling | ✅ modelleerling |

(Viewport-matrix per draaiboek alleen bij Modelleerling uitgevoerd op de 4 sleutelmomenten; overige profielen getest op desktop.)

### Bevindingen (BLOCK/WARN/INFO, genummerd, met bewijs-pad)

1. **WARN** — Dubbelklik op "Start de missie" bracht de app naar fase 1, maar daarbij stond al een multiselect-item (5e knop) "geselecteerd" zonder dat daarop geklikt was. Waarschijnlijk lekt de tweede klik van de dubbelklik door naar de nieuw-gerenderde fase-1-knop op dezelfde schermpositie (ghost-click bij scherm-transitie). Zelfde patroon eerder waargenomen bij missie `veilig-internet` (dezelfde scenario-engine-familie) — mogelijk een structureel patroon in deze template.
   Bewijs: `evidence/data-speurder/chaoot/desktop/start.png`

2. **INFO** — Zeer robuuste state-persistentie: reload midden in fase 1 en fase 3 herstelde exact de vorige (gedeeltelijke) selectie-staat zonder dataverlies; browser-`back` naar about:blank gevolgd door terug-navigeren herstelde de volledige voortgang; dubbelklikken op items en "Opnieuw beginnen" gaven nergens dubbele of corrupte state.
   Bewijs: `evidence/data-speurder/chaoot/desktop/flow-2-reload-check.png`

3. **WARN** — In fase 3 ("Eerlijk of misleidend?") staat de geselecteerde staat van een keuzeknop alleen visueel (kleur) aangegeven, niet in de aria-accessible-name — in tegenstelling tot fase 1, waar "geselecteerd" wél expliciet in de knoptekst staat. Inconsistente toegankelijkheidsaanpak tussen fase-componenten binnen dezelfde missie; een schermlezergebruiker hoort in fase 1 wat gekozen is, maar niet in fase 3.
   Bewijs: `evidence/data-speurder/chaoot/desktop/flow-2-reload-check.png`

4. **INFO** — Elke fase geeft maar 1 kans: na "Controleer" toont de app uitleg-feedback en enkel "Volgende ronde", geen retry-knop voor dezelfde vraag. Een leerling kan dus niet zelf 3× herhalen binnen 1 fase; leren gebeurt via de na-afloop-uitleg, niet via directe correctie-en-retry. Nooit een permanente blokkade tot gevolg — de missie blijft bij elke score afmaakbaar. Zelfde patroon eerder bij `veilig-internet`.
   Bewijs: `evidence/data-speurder/vastloper/desktop/flow-fail1.png`

5. **WARN** — In fase 3 staat bij een fout beantwoord item het ✕-icoon vóór het CORRECTE antwoordlabel (bijv. "✕ Eerlijk" wanneer de leerling zelf "Misleidend" koos maar "Eerlijk" het juiste antwoord was). Het ✕ betekent hier "jouw keuze was fout", niet "dit label is fout" — voor een vluchtige lezer kan dit verwarrend zijn.
   Bewijs: `evidence/data-speurder/vastloper/desktop/flow-3.png`

6. **INFO** — Foutfeedback is inhoudelijk sterk en consequent pedagogisch: elk item krijgt een specifieke uitleg waarom het goed of fout is (niet alleen "fout", maar het onderliggende begrip — bijv. correlatie vs. causatie, steekproefgrootte, y-as-manipulatie). De rangschik-vraag (fase 2) toont bovendien expliciet de correcte positie ("#1"–"#4") naast elk fout-geplaatst item.
   Bewijs: `evidence/data-speurder/chaoot/desktop/flow.png`

7. **INFO** — Ook bij een extreem lage score (6/100) blijft de missie volledig afmaakbaar met een passende, niet-beschamende badge ("Blijf Oefenen") en bemoedigende boodschap; de volledige "Wat je hebt geleerd"-sectie blijft zichtbaar ongeacht score.
   Bewijs: `evidence/data-speurder/vastloper/desktop/eind.png`

Geen BLOCK-bevindingen. Geen console- of netwerkfouten waargenomen over alle 4 profielen heen, ook niet tijdens de chaos-acties (dubbelklikken, reloads, back-navigatie, snelle toggles).

### Nog onzeker

- Of het ghost-click-gedrag bij dubbelklik op "Start de missie" (Bevindingen #1) een template-breed patroon is in de scenario-engine-familie (nu 2× waargenomen bij data-speurder en veilig-internet) — kon niet worden bevestigd zonder broncode-inzage, wat buiten de scope van deze browser-only audit valt.
- Of het ontbreken van herkansing per fase (Bevindingen #4) een bewuste didactische keuze is (direct de onderbouwde uitleg tonen als leermoment, in plaats van blind opnieuw proberen) of een gemiste kans voor actief oefenen — een pedagogische afweging, geen technisch defect.
