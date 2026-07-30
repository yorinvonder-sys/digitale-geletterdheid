## Opdracht Live Check: review-week-3

**Advies:** fix-eerst · **Risico:** Geel · **Getest als:** leerling (dev-preview zonder login) · **URL:** http://localhost:3010/dev/mission-preview?mission=review-week-3

### Student-playthrough (per profiel: start/flow/feedback/eind)

**Modelleerling** — 24 acties, ~12 min. Serieuze eerste indruk: startscherm duidelijk ("De Ethische Raad", 3 dossiers + miniboss + vonnis uitgelegd), toelichting-toggle werkt netjes ("Tik voor de volledige toelichting" ↔ "Verberg toelichting"). Doorliep Dossier 1 (oordeel + onderbouwing), Dossier 2 (sorteeropdracht, 6/6 correct → "Perfect gecategoriseerd! 30/30"), Dossier 3 (vrije tekst-uitleg, real-time feedback "Uitstekend!"), Miniboss (tegenargument weerleggen) en het Vonnis (3 zegels, alle "Goedgekeurd"). Eindigde met **100/100 punten, badge "Debatmeester"**, volledige leerdoel-lijst. Deed als enige de viewport-matrix op alle 4 sleutelmomenten (1440×900 / 810×1080 / 1080×810 / 390×844) — content en layout bleven overal consistent en leesbaar, geen clipping.

**Speedrunner** — 19 acties, ~6 min. Klikte direct door zonder de toelichting te lezen, koos altijd de eerste optie. Ontdekte dat het onderbouwingsveld in Dossier 1 een keiharde 10-tekens-minimum afdwingt (disabled-knop bevestigd met een geforceerde klik-poging) — "." alleen kwam niet door, maar 10× de letter "a" wel. In Dossier 2 gooide hij alle 6 items lukraak in dezelfde categorie → feedback "Bijna — zie de correcties hierboven. 15/30 punten" (proportionele afstraffing, geen 100%-doorlaat). In Dossier 3 bleek de minimumdrempel hoger (~59 tekens) en ook daar telt alleen karakteraantal: 20× het woord "ja" (59 tekens) activeerde de knop met feedback "Goed bezig". Miniboss-reactie was kort maar inhoudelijk ("weet ik niet ofzo boeie", 23 tekens) en kwam er wél doorheen. Eindigde met **54/100 punten, badge "Goed Bezig"** (niet de topbadge) — score/badge onderscheidt zorgvuldigheid correct, maar de missie blokkeert niet bij lukraak gedrag.

**Chaoot** — 32 acties, ~18 min. Dubbelklikte op de startknop en op "Dossier afsluiten" — geen dubbele advance, geen corruptie. Sneed twee conflicterende oordeel-klikken snel na elkaar af (tweede won netjes, geen gecombineerde/foutieve state). Vulde ~380-500 tekens onzin + emoji + een `<script>alert(1)</script>`- en `<img src=x onerror=alert(1)>`-injectiepoging in de vrije tekstvelden: **beide werden als plain text weergegeven, geen script-executie, geen console-errors**. Klikte op een categorie-target vóórdat een item was geselecteerd — geen effect, geen crash. Reloadde twee keer midden in een actieve stap (Dossier 1 en de Miniboss): **puntenvoortgang bleef intact, maar het ingevulde tekstveld werd leeggemaakt** (geen auto-save per invulveld, wel per afgeronde stap). `back` na de eerste navigatie ging naar `about:blank` (geen opgebouwde in-missie historie, verwacht gedrag). Ondanks alle chaos: **100/100 punten, badge "Debatmeester"**, volledig stabiel afgerond.

**Vastloper** — 28 acties, ~15 min. Categoriseerde in Dossier 2 opzettelijk alle 6 items fout → "Bijna — zie de correcties hierboven. 0/30 punten", maar de screenshot toont **geen enkel visueel onderscheid** tussen de 6 items (identieke gele achtergrond, geen rood/groen, geen vinkje/kruisje) — de feedback belooft correcties die niet zichtbaar zijn. Kon niet terug naar Dossier 2 om het opnieuw te proberen (missie gaat door naar Dossier 3, "Terug"-knop deed niets). Gaf in Dossier 3 en bij de Miniboss 3× achtereen een te kort/onvoldoende antwoord — geen hint-knop of inhoudelijke hulp verscheen (geprobeerd te zoeken naar een hint-element: niet gevonden), alleen een statische tekenteller ("Schrijf meer" / "X/min. tekens"). Kon uiteindelijk altijd doorgaan door simpelweg genoeg tekens te typen. Het Vonnis-scherm toonde bij deze écht lage score wél "⚠ Aandacht nodig" i.p.v. "Goedgekeurd" (corrigeert de eerdere Speedrunner-waarneming — de differentiatie bestaat, alleen bij een lagere drempel dan 24/30). Eindigde met **53/100 punten, badge "Goed Bezig"** — niet permanent vastgelopen, maar ook geen hulp gekregen tijdens het vastlopen zelf. "Wat je hebt geleerd"-lijst identiek aan een perfecte score.

### Visuele UI/UX (logo's/afbeeldingen/layout/tekst-knoppen)
Consistente DUCK-vormgeving (geel/zwart/ivoor), Kees-avatar en raadszaal-thematiek kloppen door de hele missie heen. Op mobiel (390×844) blijft alles goed leesbaar: het sorteer-mechaniek (2 kolommen naast elkaar) past prima zonder clipping, tekst-knoppen zijn volledig zichtbaar. Geen gebroken afbeeldingen, geen layout-overlap op enige geteste viewport. Voortgangsbalk (4 segmenten) en punten-teller bovenaan blijven overal zichtbaar en consistent bijgewerkt.

### Browserbewijs (tabel 4 viewports × 4 states)

| Viewport | start | flow | feedback | eind |
|---|---|---|---|---|
| Desktop (1440×900) | ✅ modelleerling/desktop/start.png | ✅ modelleerling/desktop/flow.png | ✅ modelleerling/desktop/feedback.png | ✅ modelleerling/desktop/eind.png |
| Tablet-portrait (810×1080) | ✅ modelleerling/tablet-portrait/start.png | ✅ modelleerling/tablet-portrait/flow.png | ✅ modelleerling/tablet-portrait/feedback.png | ✅ modelleerling/tablet-portrait/eind.png |
| Tablet-landscape (1080×810) | ✅ modelleerling/tablet-landscape/start.png | ✅ modelleerling/tablet-landscape/flow.png | ✅ modelleerling/tablet-landscape/feedback.png | ✅ modelleerling/tablet-landscape/eind.png |
| Mobile (390×844) | ✅ modelleerling/mobile/start.png | ✅ modelleerling/mobile/flow.png | ✅ modelleerling/mobile/feedback.png | ✅ modelleerling/mobile/eind.png |

Alle 16 combinaties gemaakt en gecontroleerd, geen enkele viewport toonde een layout-probleem.

### Bevindingen (BLOCK/WARN/INFO, genummerd, met bewijs-pad)

1. **[WARN]** Bij volledig foute sortering in Dossier 2 zegt de feedback "zie de correcties hierboven", maar geen enkel item toont visueel welke fout staat (geen kleur/icoon-onderscheid) — bewijs: `vastloper/desktop/flow-poging1-feedback.png`
2. **[WARN]** Onderbouwingsvelden in Dossier 1 en Dossier 3 valideren alleen op karakteraantal, niet op inhoud — herhaalde onzin ("aaaaaaaaaa", 20× "ja") haalt de drempel — bewijs: `speedrunner/desktop/flow-fout-antwoord.png`
3. **[WARN]** Na een fout dossier (0/30) is er geen herkansing binnen dat dossier — de missie gaat direct door, "Terug"-knop keert niet terug naar het vorige dossier
4. **[WARN]** Bij 3× achtereen een te kort antwoord verschijnt geen hint of inhoudelijke hulp, alleen een statische tekenteller — bewijs: `vastloper/desktop/flow-miniboss-3e-poging.png`
5. **[INFO]** Reload midden in een stap behoudt puntenvoortgang maar wist het actieve tekstveld (geen auto-save per invulveld)
6. **[INFO]** Categorie-targets in de sorteeropdracht zijn geen semantische buttons in de a11y-tree (alleen plain text ondanks visueel klikbare kaarten) — mogelijk toetsenbord/screenreader-toegankelijkheidsprobleem — bewijs: `modelleerling/desktop/flow-item-select.png`
7. **[INFO]** XSS-injectiepogingen (`<script>`, `<img onerror>`) worden veilig als plain text weergegeven, geen executie — positieve bevinding
8. **[INFO]** Vonnis-scherm differentieert correct bij een écht lage score ("Aandacht nodig" bij 0/30) maar niet bij een middelmatige score (nog "Goedgekeurd" bij 24/30 en 15/30) — bewijs: `vastloper/desktop/feedback-vonnis-aandacht-nodig.png`
9. **[INFO]** "Wat je hebt geleerd"-lijst is identiek ongeacht score (100/100 en 53/100 tonen dezelfde 5 leerdoelen), geen gepersonaliseerde terugkoppeling

### Nog onzeker
- Of de a11y-bevinding (categorie-targets zonder button-role) daadwerkelijk toetsenbordnavigatie blokkeert — niet getest met Tab/Enter-toetsenbordinvoer, alleen met muisklik-simulatie via de harnas.
- Exacte scoreformule van het Vonnis-scherm (welke drempel tussen 15/30 en 0/30 "Goedgekeurd" naar "Aandacht nodig" kantelt) — niet uit browserobservatie af te leiden, alleen gedrag geconstateerd op twee datapunten.
- Of de "Terug"-knop op andere plekken in de missie wél naar een vorig dossier navigeert (in deze test alleen geprobeerd na Dossier 2 → geen zichtbaar effect).
