## Opdracht Live Check: magister-master

**Advies:** ship · **Risico:** Groen · **Getest als:** leerling (dev-preview zonder login) · **URL:** http://localhost:3010/dev/mission-preview?mission=magister-master

### Student-playthrough (per profiel: start/flow/feedback/eind)

**Modelleerling** — Start-scherm correct met doel, bewijs-belofte en 4-stappenoverzicht. Doorliep alle 4 stappen (Inloggen → Rooster → Huiswerk → Cijfers), maakte één bewuste fout op de checkpunt-vraag van stap 1 (correcte foutfeedback + uitleg getoond). Rondde af met 50/55 punten (91%), badge "Magister Meester", volledige "Wat je hebt geleerd"-lijst. Viewport-matrix (desktop/tablet-portrait/tablet-landscape/mobile) op alle 4 sleutelmomenten: layout blijft overal correct en leesbaar, geen afsnijding, badge-titel past zich dynamisch aan score aan ("Magister Expert" bij 100%).

**Speedrunner** — Klikte direct door zonder lezen, koos steeds de eerste (vaak foute) optie op elke checkpunt-vraag. Geen skip-knop gevonden: alle 3 bewijsknoppen per stap moeten aangeklikt worden voordat docentcheck/checkpunt verschijnt. Rondde de missie af met 40/55 punten (73%) en kreeg toch de volledige badge "Magister Meester" — ondanks dat op geen enkele van de 3 checkpunt-vragen ooit het juiste antwoord is gekozen.

**Chaoot** — Dubbelklikken op bewijsknoppen togglet consistent aan/uit (geen puntencorruptie). Chaotisch wisselen tussen meerkeuze-antwoorden werkt correct (laatste klik telt, radio-gedrag intact). Reload op 3 verschillende momenten (midden stap 1 na checkpunt, midden stap 3 vóór docentcheck, op eindscherm) behield telkens exact de volledige state (punten, aangevinkte knoppen, feedback). Checkpunt kon beantwoord worden vóór de docentcheck was aangevinkt (geen blokkade, geen crash). Browser-back ging naar about:blank (geen per-stap URL-routing) maar opnieuw navigeren herstelde de voortgang volledig. Dubbelklik op de eind-CTA gaf geen dubbele afronding. Rondde af met 55/55 (100%).

**Vastloper** — Gaf bewust het foute antwoord op elke van de 3 checkpunt-vragen (stap 1, 2, 4). Consistent patroon: na één fout antwoord worden alle opties permanent disabled (ook na reload) en toont de feedback alleen een tekst-uitleg van het juiste antwoord — je kunt het niet alsnog aanklikken. Geen los hint-systeem gevonden buiten de altijd-zichtbare tip-tekst per stap. Geen permanente vastloop: missie bleef afmaakbaar (40/55, 73%) en gaf de badge "Magister Meester".

### Visuele UI/UX (logo's/afbeeldingen/layout/tekst-knoppen)

Consistente, rustige DUCK-stijl (crème achtergrond, geel accent, donkere kaarten voor actieve/geselecteerde staten). Voortgangsbalk bovenaan toont 4 stappen duidelijk. Checkbox- en radio-button-states zijn visueel duidelijk (vinkje + donkere achtergrond voor bewijs, gele bullet voor meerkeuze) — dit is wél zichtbaar in screenshots maar werd niet als tekst/attribuut blootgesteld in de a11y-snapshot (mogelijk beperking van het testharnas, geen bevestigde bug). Elke stap-icoon in het eindoverzicht gebruikt hetzelfde generieke kalender-icoon (📅) i.p.v. een stap-specifiek icoon — cosmetisch, geen functioneel probleem. Geen ontbrekende afbeeldingen, geen kapotte layout op enig viewport.

### Browserbewijs (tabel 4 viewports × 4 states)

| Viewport | start | flow | feedback | eind |
|---|---|---|---|---|
| desktop (1440×900) | ✓ | ✓ | ✓ | ✓ 91% |
| tablet-portrait (810×1080) | ✓ | ✓ | ✓ | ✓ 100% |
| tablet-landscape (1080×810) | ✓ | ✓ | ✓ | ✓ 100% |
| mobile (390×844) | ✓ | ✓ | ✓ | ✓ 100% |

Alle 4 viewports getest op de Modelleerling-run; layout, tekst en knoppen blijven overal leesbaar en bruikbaar zonder afsnijding.

### Bevindingen (BLOCK/WARN/INFO, genummerd, met bewijs-pad)

1. **WARN** — Checkpunt-meerkeuzevragen geven maar 1 kans: na een fout antwoord worden alle opties permanent disabled (persisteert door reload) en de leerling kan het juiste antwoord niet alsnog actief selecteren, alleen lezen als uitleg. Dit ondermijnt het leereffect van "zelf het goede antwoord vinden na een fout" — de leerling kan de fout niet corrigeren op dezelfde vraag.
   Bewijs: `evidence/magister-master/vastloper/desktop/feedback.png`

2. **WARN** — Missie kent voltooiing + volledige badge toe ("Magister Meester") ook als alle checkpunt-vragen consequent fout beantwoord zijn (Speedrunner: 40/55, 73%; Vastloper: hetzelfde patroon). De checkpunt-vragen beïnvloeden de eindscore maar blokkeren geen voortgang of badge-toekenning, waardoor de missie inhoudelijk "gehaald" kan worden zonder ooit een correct antwoord te geven.
   Bewijs: `evidence/magister-master/speedrunner/desktop/eind.png`

3. **INFO** — Bewijsknoppen (checkbox-achtige "Bewijs voor jezelf"-items) tonen pas een puntenupdate nadat alle 3 tegelijk zijn aangevinkt, niet per individuele klik; dit is consistent gedrag, geen bug, maar kan verwarrend ogen als losstaande observatie.
   Bewijs: `evidence/magister-master/modelleerling/desktop/flow.png`

4. **INFO** — Browser-back-navigatie vanuit een missiestap gaat naar `about:blank` (geen per-stap URL/history-routing); opnieuw navigeren naar de missie-URL herstelt de voortgang volledig via persistentie, dus functioneel geen probleem maar wel afwijkend van "gewone" pagina's.
   Bewijs: `evidence/magister-master/chaoot/desktop/after-terug-click.png`

5. **INFO** — De in-app "Terug"-pijl-icoonknop bovenaan het scherm had op stap 2 geen zichtbaar effect bij een klik (bleef op dezelfde stap staan). Nog onzeker of dit een "terug naar missie-overzicht"-knop is die buiten de dev-preview-context niets doet, of een echte no-op.
   Bewijs: `evidence/magister-master/chaoot/desktop/after-terug-click.png`

6. **INFO** — Elk kalender-icoon (📅) wordt hergebruikt als bullet voor alle 4 stappen in het eindoverzicht, i.p.v. een stap-specifiek icoon (bijv. login/rooster/huiswerk/cijfer-icoon). Puur cosmetisch.
   Bewijs: `evidence/magister-master/modelleerling/desktop/eind.png`

7. **INFO** — Geen console-errors, geen mislukte network-requests, geen crashes gedetecteerd over alle 4 profielen heen (inclusief dubbelklikken, chaotisch klikken, reloads op willekeurige momenten). Robuustheid van de implementatie is sterk.

### Nog onzeker

- Of bevinding 5 (Terug-knop zonder effect) een echte bug is of een bewuste "verlaat missie"-actie die alleen buiten de dev-preview zichtbaar wordt (bijv. navigatie naar het missie-dashboard in de volledige app-context) — niet verder te onderzoeken zonder broncode te lezen (verboden binnen deze audit).
- Of de "1 kans per checkpunt-vraag"-ontwerpkeuze (bevinding 1+2) bewust didactisch is bedoeld (leren omgaan met een fout, niet "gokken tot je het goed hebt") of een implementatie-detail dat een striktere leerdoel-borging in de weg staat. Dit is een productbeslissing, geen technische bug — vandaar WARN en niet BLOCK.
