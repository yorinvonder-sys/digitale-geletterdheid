## Opdracht Live Check: print-pro

**Advies:** ship
**Risico:** Groen
**Getest als:** leerling (dev-preview zonder login)
**URL:** http://localhost:3010/dev/mission-preview?mission=print-pro

### Student-playthrough (per profiel: start/flow/feedback/eind)

**Modelleerling** — Startscherm is duidelijk: titel, doelomschrijving, 4 stappen-overzicht en een uitnodigende intro van Kees. Speelde alle 4 stappen serieus, maakte 1 bewuste fout op checkpunt stap 1 ("Dat staat altijd op de printer zelf") en zag daarna een heldere, correcte foutfeedback met uitleg. Rondde af op **55/60 punten (92%)**, CompletionScreen met score per stap en een "Wat je hebt geleerd"-lijst met 5 punten. Geen console- of netwerkfouten.

**Speedrunner** — Klikte overal de eerste optie zonder te lezen, probeerde te skippen. Geen enkele checkbox of docentcheck kon worden overgeslagen (elke moet apart aangeklikt worden voordat "Volgende stap" verschijnt). Alle 4 checkpuntvragen fout beantwoord (altijd eerste optie). Rondde alsnog netjes af op **40/60 punten (67%)** met een passend aangepaste eindboodschap ("Goed bezig — en nu weet je precies wat er nog beter kan"). Geen manier gevonden om zinloos snel door te klikken zonder puntenverlies.

**Chaoot** — Dubbelklikte op knoppen (checkbox toggled netjes aan→uit, geen crash), deed meerdere reloads midden in een stap (state — punten, checkboxes, gekozen checkpuntantwoord — bleef steeds correct behouden), probeerde de "Terug"-knop (geen zichtbaar effect, geen crash) en klikte snel wisselend tussen checkpunt-opties. Alles bleef consistent, geen corruptie. Rondde af op **55/60 punten (92%)**.

**Vastloper** — Gaf bewust op alle 4 checkpuntvragen een fout antwoord om te testen of herkansen mogelijk is. Ontdekking: elke checkpuntvraag staat maar **1 kans** open — na het foute antwoord worden alle opties permanent disabled (ook na reload) en toont de app direct het juiste antwoord met uitleg. Er is dus geen manier om zelf 3× te proberen op dezelfde vraag, maar er is ook geen permanente blokkade: de missie liet zich probleemloos afronden op **40/60 punten (67%)** met een bemoedigende eindboodschap.

### Visuele UI/UX (logo's/afbeeldingen/layout/tekst-knoppen)

Consistente, opgeruimde layout op alle geteste viewports (1440×900, 810×1080, 1080×810, 390×844). Geen overlappende elementen, geen afgesneden knoppen, mascotte Kees en voortgangsindicator blijven zichtbaar. Eén terugkerend tekstueel probleem: in het gele "tip"-informatieblok (het lampje-icoon) wordt markdown-vetgedrukte tekst (`**FollowMe**`, `**printbudget**`) NIET gerenderd — de sterretjes blijven letterlijk zichtbaar. Ditzelfde vet-patroon in het "Doe dit nu"-blok erboven rendert wel correct. Komt voor in stap 2 en stap 3.

### Browserbewijs (tabel 4 viewports × 4 states)

| Viewport | start | flow | feedback | eind |
|---|---|---|---|---|
| desktop (1440×900) | ✅ modelleerling/speedrunner/chaoot/vastloper | ✅ alle 4 profielen | ✅ modelleerling (fout+goed antwoord) | ✅ alle 4 profielen |
| tablet-portrait (810×1080) | ✅ modelleerling | ✅ modelleerling | — | ✅ modelleerling |
| tablet-landscape (1080×810) | ✅ modelleerling | ✅ modelleerling | — | ✅ modelleerling |
| mobile (390×844) | ✅ modelleerling | ✅ modelleerling | — | ✅ modelleerling |

(Viewport-matrix is per draaiboek alleen bij Modelleerling uitgevoerd; overige profielen getest op desktop.)

### Bevindingen (BLOCK/WARN/INFO, genummerd, met bewijs-pad)

1. **WARN** — Markdown-vetgedrukt (`**tekst**`) wordt niet gerenderd in het tip/hint-informatieblok van stap 2 en 3 ("FollowMe", "printbudget"); sterretjes blijven letterlijk zichtbaar, terwijl hetzelfde patroon in het "Doe dit nu"-blok wél correct rendert. Cosmetisch, maar zichtbaar en verwarrend voor de doelgroep.
   Bewijs: `evidence/print-pro/modelleerling/desktop/flow-step2-markdownbug.png`

2. **WARN** — Elke checkpuntvraag staat maar 1 kans open: na een fout antwoord worden alle opties permanent disabled (ook na reload) en toont de app meteen het juiste antwoord. Een leerling kan nooit zelf herkansen op dezelfde vraag — geen actief leermoment via zelf opnieuw proberen, wel een duidelijke uitleg. Nooit een permanente blokkade tot gevolg (missie blijft altijd afmaakbaar).
   Bewijs: `evidence/print-pro/vastloper/desktop/flow-noretry-attempt1.png`

3. **INFO** — De "Terug"-knop bovenaan het missiescherm reageert niet zichtbaar op een klik (blijft op dezelfde stap staan). Geen crash, geen dataverlies; kon niet worden vastgesteld of dit bewust is voor de dev-preview-context (broncode-inzage is niet toegestaan binnen deze audit).
   Bewijs: `evidence/print-pro/chaoot/desktop/terug-knop-noop.png`

4. **INFO** — Foutfeedback op checkpuntvragen is helder en pedagogisch sterk: fout antwoord blijft geel gemarkeerd, juist antwoord wordt zwart aangevinkt getoond met een korte, begrijpelijke uitleg waarom.
   Bewijs: `evidence/print-pro/modelleerling/desktop/feedback-step1-wronganswer.png`

5. **INFO** — Zeer robuuste state-persistentie: meerdere midden-stap reloads (punten, checkboxes, gekozen checkpuntantwoord) overleven allemaal correct in het Chaoot-profiel. Dubbelklik op een checkbox toggled netjes aan→uit zonder crash; dubbelklik op "Controleer antwoord" geeft geen dubbele score.
   Bewijs: `evidence/print-pro/chaoot/desktop/reload-persistence.png`

6. **INFO** — Speedrunner-profiel kan geen enkele checkbox of docentcheck overslaan; elke stap vereist alle losse bewijs-clicks voordat er wordt doorgeschakeld. Geen manier gevonden om zinloze input te laten accepteren.
   Bewijs: `evidence/print-pro/speedrunner/desktop/eind.png`

Geen BLOCK-bevindingen. Geen console- of netwerkfouten waargenomen over alle 4 profielen heen.

### Nog onzeker

- Of de niet-reagerende "Terug"-knop bewust inactief is binnen de dev-preview-route, of een navigatiepad mist dat in de reguliere (ingelogde) leerling-flow wel werkt — buiten scope van deze browser-only audit.
- Of het ontbreken van herkansing op checkpuntvragen een bewuste didactische keuze is (direct het juiste antwoord tonen als leermoment) of een gemiste kans voor actief oefenen — een pedagogische afweging, geen technisch defect.
