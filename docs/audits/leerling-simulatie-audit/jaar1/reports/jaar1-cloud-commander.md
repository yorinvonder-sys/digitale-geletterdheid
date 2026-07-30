## Opdracht Live Check: cloud-commander

**Advies:** ship
**Risico:** Groen
**Getest als:** leerling (dev-preview zonder login)
**URL:** http://localhost:3010/dev/mission-preview?mission=cloud-commander

### Student-playthrough (per profiel: start/flow/feedback/eind)

**Modelleerling** — Las alle instructies, klikte serieus de zelfrapportage-checkboxes per stap, maakte één bewuste fout op de checkpunt-vraag in stap 2 ("waar worden bestanden opgeslagen") en koos daarna het juiste antwoord op het checkpunt in stap 4. Doorliep de volledige viewport-matrix (start/flow/feedback/eind op 1440x900, 810x1080, 1080x810 en 390x844). Score 45/50 (90%) op desktop, 50/50 (100%) op de drie andere viewports (waar het tweede checkpunt wel goed werd beantwoord). Badge "Cloud Expert". ~40 acties, ruim binnen de max.

**Speedrunner** — Klikte snel zonder te lezen, koos consequent de eerste optie bij checkpunt-vragen (beide keren toevallig het foute antwoord). Kon geen enkele stap skippen zonder eerst beide bewijs-checkboxes aan te vinken. Ontdekte dat de twee bewijs-checkboxes in stap 3 in willekeurige volgorde aangevinkt mogen worden. Voltooide de missie met 40/50 (80%), badge "Cloud Commander". ~20 acties.

**Chaoot** — Dubbelklikte op knoppen (toggle-gedrag: checkbox ging aan-uit, terug naar 0 pts, geen crash), deed snelle conflicterende kliks op alle drie checkpunt-antwoorden achter elkaar, reloadde midden in stap 1 (na gedeeltelijke voortgang) en midden in de open docentcheck-stap 3, en dubbelklikte op "Controleer antwoord" en "Bekijk resultaten". Alles bleef stabiel: geen crashes, geen dubbele puntentoekenning, reload behield voortgang inclusief op het CompletionScreen zelf. Voltooide met 45/50 (90%). ~30 acties.

**Vastloper** — Testte op beide checkpunt-vragen bewust het foute antwoord, en probeerde vóór "Controleer antwoord" tussen meerdere foute opties te wisselen (dat kan, de laatste keuze telt). Ontdekte dat een checkpunt-vraag maar één definitieve controle toestaat: na klikken op "Controleer antwoord" worden alle opties disabled en verschijnt direct de doorgang-knop, zonder eigen retry-mogelijkheid op diezelfde vraag. De leerling ziet wel altijd het juiste antwoord in de feedback-tekst. De missie bleef volledig afmaakbaar ondanks twee foute checkpunt-antwoorden: geen permanent vastlopen. Score 40/50 (80%). ~20 acties.

### Visuele UI/UX (logo's/afbeeldingen/layout/tekst-knoppen)

Consistente DUCK-stijl (geel/zwart/crème), Kees-mascotte-avatar bij elke stap, voortgangsindicator bovenaan (4 balkjes), puntenteller rechtsboven. Geen ontbrekende afbeeldingen, geen tekst-overflow, geen clipping op enige viewport. Checkboxes tonen duidelijke visuele feedback (checkmark + doorgestreepte tekst bij afvinken). Checkpunt-feedback is kleurgecodeerd (rood "!" bij fout, groen "✓" bij goed) met heldere uitleg. CompletionScreen toont per-stap score-uitsplitsing, badge-naam gekoppeld aan score-niveau ("Cloud Commander" bij 80%, "Cloud Expert" bij 90-100%), en een "Wat je hebt geleerd"-lijst.

### Browserbewijs (tabel 4 viewports × 4 states)

| Viewport | start | flow | feedback | eind |
|---|---|---|---|---|
| desktop (1440x900) | ✓ modelleerling | ✓ modelleerling | ✓ modelleerling | ✓ alle 4 profielen |
| tablet-portrait (810x1080) | ✓ modelleerling | ✓ modelleerling | ✓ modelleerling | ✓ modelleerling |
| tablet-landscape (1080x810) | ✓ modelleerling | ✓ modelleerling | ✓ modelleerling | ✓ modelleerling |
| mobile (390x844) | ✓ modelleerling | ✓ modelleerling | ✓ modelleerling | ✓ modelleerling |

Alle screenshots onder `$H/evidence/cloud-commander/<profiel>/<viewport>/`.

### Bevindingen (BLOCK/WARN/INFO, genummerd, met bewijs-pad)

1. **WARN** — Bij stap 3 (Bestand uploaden) accepteert de app het aanvinken van de tweede zelfrapportage-checkbox ("De foto staat nu in mijn School-map") zonder dat de eerste ("Ik heb een foto gemaakt of gekozen") al is aangevinkt. De twee claims zijn logisch afhankelijk (je kunt niet weten dat het bestand in de map staat als je nog geen foto hebt gemaakt), maar de UI dwingt die volgorde niet af — punten worden gewoon toegekend zodra beide staan aangevinkt, in elke volgorde.
   Bewijs: `$H/evidence/cloud-commander/speedrunner/desktop/flow-stap3-skip-order.png`

2. **WARN** — Checkpunt-vragen (2 stuks, in stap 2 en stap 4) staan maar één definitieve controle toe. Zodra "Controleer antwoord" is aangeklikt, worden alle antwoordopties permanent disabled en verschijnt direct de doorgang-knop — er is geen eigen "probeer opnieuw"-knop op de vraag zelf. De leerling krijgt wel het juiste antwoord te lezen in de feedback-tekst, en kan gewoon door met de missie, dus dit blokkeert niets — maar een leerling die actief wil leren door zelf te herkansen (in plaats van het antwoord te worden voorgeschoteld) kan dat niet op deze vraag.
   Bewijs: `$H/evidence/cloud-commander/vastloper/desktop/feedback-eenmalige-poging.png`, `$H/evidence/cloud-commander/vastloper/desktop/checkpunt-1poging-disabled.png`

3. **INFO** — Dubbelklik op een zelfrapportage-checkbox toggled 'm tweemaal (aan → uit), wat resulteert in verlies van de zojuist behaalde punten voor die checkbox en terugval naar de begintoestand, zonder foutmelding of bevestigingsvraag. Verwacht toggle-gedrag voor dit knoptype, geen bug, maar een onoplettende leerling die per ongeluk dubbeltikt (bijvoorbeeld op een touchscreen) verliest stilzwijgend voortgang.
   Bewijs: `$H/evidence/cloud-commander/chaoot/desktop/dblclick-toggle-off.png`

4. **INFO** — Reload (ook midden in een stap, ook tijdens de open docentcheck-stap, ook op het CompletionScreen zelf) behoudt punten en voortgang correct. Geen dataverlies waargenomen bij chaos-testen.

5. **INFO** — Snelle conflicterende kliks op meerdere antwoordopties en dubbelklikken op actie-knoppen (Controleer antwoord, Bekijk resultaten) geven geen crash en geen dubbele puntentoekenning; het systeem evalueert deterministisch de laatst geselecteerde optie en de knoppen zijn idempotent na de eerste effectieve klik.

6. **INFO** — Badge-naam op het CompletionScreen schaalt mee met de score: "Cloud Commander" bij 80%, "Cloud Expert" bij 90-100%. Goed didactisch signaal dat kwaliteit van uitvoering wordt herkend.

7. **INFO** — Geen enkele console-error of network-failure waargenomen over alle 4 profielen en alle 4 viewports; alleen normale devlogs (Vite HMR, Web Vitals, analytics-skips wegens ontbrekende consent — verwacht in dev-preview zonder cookiebanner-interactie).

### Nog onzeker

- De docentcheck in stap 3 ("Laat je docent zien...") is een pure zelfrapportage-knop zonder enige verificatie — niet te beoordelen of dit in een echte klassikale setting voldoende didactische waarde heeft, dat valt buiten wat deze browser-simulatie kan testen.
- Niet getest: gedrag bij een daadwerkelijke OneDrive-koppeling/echte bestandsupload, aangezien dit een dev-preview zonder backend-integratie is — de missie is volledig zelfrapportage-gebaseerd (leerling bevestigt eigen handelingen buiten de simulatie om). Dat is inherent aan het tool-guide-format en geen bug.
