## Opdracht Live Check: data-handelaar

**Advies:** fix-eerst
**Risico:** Geel
**Getest als:** leerling (dev-preview zonder login)
**URL:** http://localhost:3010/dev/mission-preview?mission=data-handelaar

### Student-playthrough (per profiel: start/flow/feedback/eind)

**Modelleerling** — Intro-scherm laadt correct (doel, 4 stappen, Kees-begeleiding, "Start de missie"). Beantwoordde puzzels 1-3 (multiple choice) correct op eerste poging. Op puzzel 4 (tekstinvoer) bewust een te vage conclusie ingevuld — werd correct afgewezen, maar zonder enige foutfeedback-tekst (alleen een stille pogingsteller). Tweede poging met volledige conclusie werd geaccepteerd. Missie afgerond met 100/100 punten, badge "Hoofd Data-Inspecteur", volledige "Wat je hebt geleerd"-lijst.

**Speedrunner** — Klikte "Start de missie", daarna consequent de eerste optie (A) op elke multiple-choice puzzel, altijd fout. Ontdekte dat na 2 foute pogingen een "overslaan →"-knop verschijnt die de puzzel direct als afgerond markeert zonder correct antwoord. Skipte alle 3 multiple-choice puzzels en gaf op puzzel 4 alleen "ja" en "." als tekstinvoer, skipte ook die. Rondde de VOLLEDIGE missie af met 0/100 punten (0%) — badge "Stagiair Inspectie" en "Missie voltooid! 🎉" verschenen alsnog, en de "Wat je hebt geleerd"-lijst toonde bij alle 5 punten een groen vinkje, identiek aan de 100%-uitkomst.

**Chaoot** — Dubbelklikte op "Start de missie" (resulteerde in een direct geregistreerde poging op puzzel 1 — mogelijke race condition). Deed snelle conflicterende kliks op 2 verschillende antwoord-knoppen (correct verwerkt als 2 losse pogingen, geen crash) en dubbelklikte op dezelfde knop (correct gededupliceerd tot 1 poging — goede debounce). Reload midden in een puzzel (na max pogingen) behield exact de juiste staat. Vulde ~330 tekens onzin+emoji in de tekstinvoer-puzzel — geaccepteerd zonder crash of afkapping, correct als foute poging verwerkt. Testte "back" — leidde naar about:blank (verwacht harnas-gedrag bij eerste navigatie in de sessie, geen missie-bug). Rondde de missie af met 50/100 punten; leerlijst toonde wederom alle vinkjes ongeacht de 2 gemiste puzzels.

**Vastloper** — Gaf 3× hetzelfde foute antwoord (D) op puzzel 1. Progressieve hulp werkte goed: na 2 fouten ontgrendelden automatisch extra aanwijzingen en verscheen een expliciete "hint (-4 pts)"-knop; na de 3e fout verscheen "Max pogingen bereikt" met een "VOLGENDE PUZZEL →"-knop — geen permanent vastlopen mogelijk. Beantwoordde puzzel 2 en 3 direct correct. Op puzzel 4 (tekstinvoer) 3× een onvolledig antwoord ingevuld; na de 3e poging ontgrendelde een concreet voorbeeld-antwoord dat bijna letterlijk overgenomen kon worden. Gebruikte de expliciete hint-knop (-3 pts), diende daarna het correcte antwoord in. Missie afgerond met 72/100 punten, badge "Senior Undercover Agent".

### Visuele UI/UX (logo's/afbeeldingen/layout/tekst-knoppen)

Intro- en eindscherm zijn strak en consistent over alle geteste viewports (desktop 1440×900, tablet-portrait 810×1080, tablet-landscape 1080×810, mobile 390×844): geen clipping, KEES-avatar en chatbubbel netjes gepositioneerd, badge/score/CTA-knop blijven goed leesbaar en klikbaar op mobile. Eén cosmetisch punt op mobile: het "TOTAAL SCORE"-label staat tijdens de puzzelflow net onderaan de viewport zonder zichtbare waarde ernaast (niet blokkerend). Eén echte visuele bug: op puzzel 4 toont het "EXTRA AANWIJZINGEN (ONTGRENDELD)"-blok na de 3e foute poging alleen een `!`-icoon zonder zichtbare hint-tekst ernaast, terwijl de accessibility-tree de tekst wél bevat — de hint is dus onzichtbaar totdat de leerling op de aparte hint-knop klikt.

### Browserbewijs (tabel 4 viewports × 4 states)

| Viewport | start | flow | feedback | eind |
|---|---|---|---|---|
| desktop (1440×900) | modelleerling/desktop/start.png | modelleerling/desktop/flow.png | modelleerling/desktop/feedback.png | modelleerling/desktop/eind.png |
| tablet-portrait (810×1080) | modelleerling/tablet-portrait/start.png | modelleerling/tablet-portrait/flow.png | — | modelleerling/tablet-portrait/eind.png |
| tablet-landscape (1080×810) | modelleerling/tablet-landscape/start.png | modelleerling/tablet-landscape/flow.png | — | modelleerling/tablet-landscape/eind.png |
| mobile (390×844) | modelleerling/mobile/start.png | modelleerling/mobile/flow.png | — | modelleerling/mobile/eind.png |

Aanvullend bewijs buiten de matrix: speedrunner/desktop/eind.png (0%-uitkomst), chaoot/desktop/{start,flow,feedback,eind}.png, vastloper/desktop/{start,flow,feedback,feedback-2,eind}.png.

Console en netwerk zijn bij elk van de 4 profielen gedraineerd: **geen JavaScript-errors en geen mislukte netwerkrequests** in enig profiel, ook niet na chaos-input, dubbelklikken of reload.

### Bevindingen (BLOCK/WARN/INFO, genummerd, met bewijs-pad)

1. **BLOCK** — Elke puzzel biedt na 2 foute pogingen een "overslaan →"-knop die de puzzel direct als afgerond markeert zonder een correct antwoord te vereisen. Hierdoor is de hele missie (alle 4 puzzels) te skippen zonder ooit iets goed te beantwoorden. *(geen los bewijsbestand, a11y-snapshot in transcript)*
2. **BLOCK** — De missie is volledig afrondbaar met 0/100 punten (0%): badge "Stagiair Inspectie" en "Missie voltooid! 🎉" verschijnen alsnog, en de "Wat je hebt geleerd"-lijst toont bij alle 5 punten een groen vinkje — identiek aan de 100%-uitkomst. Dit geeft een leerling die niets goed beantwoordde een vals gevoel van geleerd te hebben. *(evidence/data-handelaar/speedrunner/desktop/eind.png)*
3. **WARN** — Bij een fout antwoord op puzzel 4 (tekstinvoer) wordt het tekstveld soms leeggemaakt (bij lange/foute zinnen) zonder enige zichtbare foutfeedback (geen tekst, kleur of hint) — alleen een stille pogingsteller verandert. Een leerling weet niet wat er mis was aan het antwoord. *(evidence/data-handelaar/modelleerling/desktop/feedback.png)*
4. **WARN** — Op puzzel 4 toont het "EXTRA AANWIJZINGEN (ONTGRENDELD)"-blok na de 3e foute poging alleen een `!`-icoon zonder zichtbare hint-tekst ernaast, terwijl de accessibility-snapshot de volledige hint-tekst wél bevat. De hint is zo onzichtbaar totdat de leerling apart op de losse hint-knop klikt. *(evidence/data-handelaar/vastloper/desktop/feedback.png en feedback-2.png)*
5. **WARN** — Op mobile (390×844) staat het label "TOTAAL SCORE" tijdens de puzzelflow net onderaan zichtbaar zonder waarde erbij, mogelijk net buiten beeld — cosmetisch, niet blokkerend. *(evidence/data-handelaar/modelleerling/mobile/flow.png)*
6. **WARN** — Een dubbelklik op "Start de missie" resulteerde direct in puzzel 1 met een reeds-geregistreerde poging (1/3), alsof de tweede klik op een antwoord-knop viel — mogelijke race condition tussen scherm-transitie en click-handler. Kost de leerling ongemerkt een poging. *(evidence/data-handelaar/chaoot/desktop/start.png)*
7. **INFO** — Tekstveld op puzzel 4 gedraagt zich inconsistent bij foute pogingen: soms blijft de ingevoerde tekst staan (Speedrunner: "ja", "."), soms wordt die geleegd (Modelleerling, Vastloper bij langere zinnen) — mogelijk lengte- of inhoud-afhankelijk, niet verder onderzocht (buiten scope: geen broncode-analyse).
8. **INFO** — Reload midden in een puzzel behield exact de juiste staat (pogingen, ontgrendelde aanwijzingen, "volgende puzzel"-knop) — goede persistentie, geen dataverlies bij Chaoot-reload-test.
9. **INFO** — Snelle conflicterende kliks op verschillende knoppen worden correct als losse pogingen verwerkt zonder crash; dubbelklik op hetzelfde element wordt correct gededupliceerd tot 1 poging — robuuste debounce.
10. **INFO** — Progressieve hulp werkt goed voor de Vastloper: automatische aanwijzing-ontgrendeling na 2 fouten, expliciete hint-knop met duidelijke puntenaftrek, en een harde stop op "max pogingen" die altijd doorgang biedt — geen enkel scenario waarin permanent vastlopen optrad.

### Nog onzeker

- Het wisselende leeg/niet-leeg-gedrag van het tekstveld na een foute poging (bevinding 7) — patroon niet volledig doorgrond binnen de toegestane profiel-scope (geen broncode-analyse toegestaan).
- Of de "overslaan"-knop een bewuste ontwerpkeuze is (didactisch: "niet blijven hangen") die elders in de missie-flow wordt gecompenseerd (bijv. op een lesniveau buiten deze dev-preview), of een onbedoelde makkelijke uitweg.
