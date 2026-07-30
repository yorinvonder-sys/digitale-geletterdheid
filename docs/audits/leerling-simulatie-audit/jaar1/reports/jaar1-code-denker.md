## Opdracht Live Check: code-denker

**Advies:** fix-eerst · **Risico:** Geel · **Getest als:** leerling (dev-preview zonder login) · **URL:** http://localhost:3010/dev/mission-preview?mission=code-denker

### Student-playthrough (per profiel: start/flow/feedback/eind)

**Modelleerling** — Verse eerste indruk, serieus meespelend op 13-jarig niveau, hints/nadenken gebruikt.
- *Start:* intro-scherm met titel "De Code Denker", metadata-chips (~15 min, Gemiddeld, +100 XP), doelbeschrijving, 4 genummerde sub-doelen, Kees-mascotte met bemoedigende tekst, duidelijke "Start de missie"-CTA. Consistent op alle 4 viewports.
- *Flow:* fase 1 (decompositie-multiselect, 8 kaarten) correct bediend, 4/4 juist geselecteerd, teller en knop-disabled-state werken correct. Consistent op alle 4 viewports.
- *Feedback:* 25/25 met rijke per-kaart uitleg en "🎉 Goed!"-boodschap. Fase 2 (algoritme-volgorde) ook 25/25 met "🎉 Perfect algoritme!". Fase 3 (abstractie-scenario's) bewust één fout gemaakt (verkeerslichten-scenario) → 21/25, correcte "Lastig"-nuance-feedback. Fase 4 (patroonherkenning) 25/25.
- *Eind:* CompletionScreen met badge "Meester Algoritme-Denker", score 96/100 (96%), per-fase score-tabel, "Missie voltooid!"-knop, "Wat je hebt geleerd"-lijst met 5 leerpunten. Consistent op alle 4 viewports, ook op mobile goed leesbaar en netjes gestapeld.
- Duur: ~9 min, ~40 acties.

**Speedrunner** — Niets lezen, snel klikken, eerste opties, proberen te skippen.
- *Start → Fase 1:* direct "Start de missie" geklikt, daarna eerste 4 kaarten geklikt zonder te lezen → 5/25 (2 toevallig goed, 2 fout, 2 gemist). Feedback correct en informatief ("Let op: decompositie gaat specifiek over...").
- *Fase 2:* willekeurige klikvolgorde gebouwd → 15/25 (2 correct, 3 fout gepositioneerd, elk met "(#n)"-hint). **BLOCK-bevinding hier: de eindboodschap zei "🎉 Perfect algoritme!" ondanks 15/25 en 3 zichtbaar foute posities — zie Bevindingen.**
- *Fase 3:* altijd "Accepteren" geklikt (nooit gelezen) → 13/25, correct gedetecteerde fouten bij scenario's die "Weigeren" vereisten.
- *Fase 4:* eerste 4 kaarten geklikt → 15/25, met passende "🎉 Goed!"-boodschap (hier geen mismatch, want boodschap is vager/neutraler).
- *Eind:* badge past zich aan naar "Goed Begonnen" bij 48/100 (48%), met steunende boodschap "Elke poging maakt je sterker. Probeer 'm gerust nog eens." Geen enkele stap kon zinloos worden geskipt zonder score-consequentie — het systeem accepteert geen "gratis" doorgang.
- Duur: ~5 min, ~30 acties.

**Chaoot** — Dubbelklikken, conflicterende kliks, reload midden-in-stap, back-en-vooruit.
- *Start:* dubbelklik op "Start de missie" navigeerde correct naar fase 1, maar de tweede klik viel door op de nieuwe pagina en selecteerde ongewenst een kaart op dezelfde schermpositie. **WARN-bevinding — zie Bevindingen.**
- *Flow:* dubbelklik-toggle op een kaart (select+deselect) werkte correct idempotent. Reload midden in fase 1 (3 van 4 geselecteerd) behield exact de juiste state. "back" gaf `about:blank` (verwacht harnas-gedrag, geen missie-bug — geen opgebouwde geschiedenis na eerdere reload). Reload midden in fase 2 (1 van 5 stappen gezet) behield eveneens de juiste state. "Opnieuw beginnen" resette schoon. Conflicterende Accepteren→Weigeren-kliks op hetzelfde scenario togglen correct zonder dubbele state.
- *Feedback:* fase 2 herhaalde de "Perfect algoritme!"-mismatch bij 20/25 (reproduceerbaar, niet toevallig). Fase 3: 8/25 na conflict-toggle, correcte feedback. Fase 4: alle 8 kaarten geselecteerd (over-selectie) → geaccepteerd zonder crash, 9/25, individuele uitleg per kaart, passende "Sommige reeksen lijken willekeurig..."-boodschap.
- *Eind:* 52/100 (52%), badge "Goed Begonnen", correcte afsluiting. Geen JS-errors in console (alleen normale web-vitals-logs + één onschuldige font-preload-waarschuwing door herhaald reloaden), geen netwerkfouten.
- Duur: ~11 min, ~45 acties.

**Vastloper** — ≥3× bewust hetzelfde foute antwoord, zoekt hulp/hints.
- *Fase 1:* alle 4 niet-decompositie-kaarten bewust gekozen → 0/25, elke kaart kreeg een individuele, inhoudelijk correcte uitleg ("Dit is patroonherkenning, niet decompositie"). Geen "opnieuw proberen"-knop binnen de fase na controle — enige weg is "Volgende ronde".
- *Fase 2:* bewust omgekeerde volgorde gebouwd → 5/25, met per-positie-hints en een sterke metacognitieve hint ("Denk als een computer: hij begrijpt NIETS vanzelf"). Ook hier geen retry-optie binnen de fase.
- *Fase 3:* alle 6 scenario's bewust omgekeerd beantwoord → 0/25, elk scenario correct als fout gemarkeerd met de juiste uitleg.
- *Fase 4:* de 4 niet-patronen bewust geselecteerd → 0/25, elk gemist correct antwoord expliciet gemarkeerd met uitleg.
- *Eind:* **geen permanente vastloop mogelijk** — bij een consistent worst-case resultaat (5/100, 5%) blijft de missie eerlijk afmaakbaar. Badge past zich aan naar "Blijf Oefenen" met een niet-veroordelende, ondersteunende boodschap. Dezelfde "Wat je hebt geleerd"-lijst wordt getoond ongeacht score.
- Duur: ~7 min, ~30 acties.

### Visuele UI/UX (logo's/afbeeldingen/layout/tekst-knoppen)
- Kees-mascotte (avatar) consistent aanwezig op intro- en eindscherm, met passende, niet-generieke boodschappen per score-niveau.
- Multi-select-kaarten (fase 1, fase 4) en accepteren/weigeren-kaarten (fase 3) hebben duidelijke visuele geselecteerd-state (gele achtergrond/rand), goed leesbaar op alle viewports inclusief mobile (8 kaarten stapelen netjes, geen overlap).
- Score-badge (pts) en fase-indicator ("Fase X/4" met icoon) blijven zichtbaar en consistent tijdens de hele playthrough.
- CompletionScreen-badge-namen scalen zichtbaar met score: "Meester Algoritme-Denker" (96%) → "Goed Begonnen" (48-52%) → "Blijf Oefenen" (5%) — consequent en motiverend getrapt systeem, geen straffende taal.
- De kleine "/GOAL"-eyebrow-label op het introscherm is een bewuste stijlkeuze (past bij het programmeer-thema), geen bug — geverifieerd via screenshot.
- Fase 2 (algoritme-volgorde) toont bij foute posities duidelijke kleurcodering (rood voor de eerste fout, geel voor overige foute posities) met "(#n)"-hints — visueel sterk, maar de begeleidende tekst klopt niet altijd (zie Bevindingen #1).

### Browserbewijs (tabel 4 viewports × 4 states, Modelleerling)

| Viewport | start | flow | feedback | eind |
|---|---|---|---|---|
| desktop (1440×900) | ✅ evidence/modelleerling/desktop/start.png | ✅ evidence/modelleerling/desktop/flow.png | ✅ evidence/modelleerling/desktop/feedback.png | ✅ evidence/modelleerling/desktop/eind.png |
| tablet-portrait (810×1080) | ✅ evidence/modelleerling/tablet-portrait/start.png | ✅ evidence/modelleerling/tablet-portrait/flow.png | ✅ evidence/modelleerling/tablet-portrait/feedback.png | ✅ evidence/modelleerling/tablet-portrait/eind.png |
| tablet-landscape (1080×810) | ✅ evidence/modelleerling/tablet-landscape/start.png | ✅ evidence/modelleerling/tablet-landscape/flow.png | ✅ evidence/modelleerling/tablet-landscape/feedback.png | ✅ evidence/modelleerling/tablet-landscape/eind.png |
| mobile (390×844) | ✅ evidence/modelleerling/mobile/start.png | ✅ evidence/modelleerling/mobile/flow.png | ✅ evidence/modelleerling/mobile/feedback.png | ✅ evidence/modelleerling/mobile/eind.png |

Alle 16 combinaties geverifieerd, geen layout-breuken, geen afgesneden content op enige viewport.

### Bevindingen (BLOCK/WARN/INFO, genummerd, met bewijs-pad)

1. **[BLOCK]** Fase 2 ("Zet het algoritme in de juiste volgorde") toont de vaste succesboodschap "🎉 Perfect algoritme! Een computer zou dit stappenplan kunnen volgen zonder extra uitleg." ook bij een gedeeltelijk foute volgorde — gereproduceerd bij Speedrunner (15/25, 3 van 5 fout) én Chaoot (20/25, 2 van 5 fout). De boodschap lijkt gekoppeld aan "elk item heeft ooit een correcte uitleg getoond" in plaats van aan de daadwerkelijke ronde-score, en misleidt de leerling over zijn eigen prestatie op precies het onderdeel dat de missie wil toetsen (correcte volgorde).
   Bewijs: `evidence/code-denker/speedrunner/desktop/feedback-mismatch-scroll.png`

2. **[WARN]** Een dubbelklik op "Start de missie" laat de tweede klik doorvallen op de nieuwe fase-1-pagina en selecteert daar ongewenst een kaart, zonder dat de leerling dat bewust koos. Geen crash, maar wel een onbedoelde vooringevulde keuze bij snel klikken (realistisch voor de doelgroep 12-15 jaar).
   Bewijs: `evidence/code-denker/chaoot/desktop/dubbelklik-ongewenste-selectie.png`

3. **[WARN]** In fase 3 (abstractie-scenario's) is de gekozen Accepteren/Weigeren-status visueel duidelijk (gele/donkere knop) maar niet in de accessible name/aria-tree zichtbaar — een schermlezer-gebruiker hoort niet welke keuze al gemaakt is per scenario.
   Bewijs: `evidence/code-denker/modelleerling/desktop/fase3-na-1-klik.png`

4. **[INFO]** Na "Controleer" is er in geen enkele fase een "opnieuw proberen"-knop binnen dezelfde fase — de enige weg vooruit is altijd "Volgende ronde", ongeacht score. Dit is mogelijk een bewuste ontwerpkeuze (voorkomt farmen/grinden), maar betekent dat een leerling die iets niet snapt niet ter plekke kan blijven oefenen op precies dat onderdeel. Geen technische bug: de missie blijft altijd afmaakbaar, ook bij een consistent 0/25-resultaat op elke fase.
   Bewijs: `evidence/code-denker/vastloper/desktop/eind.png`

5. **[INFO]** State-persistentie is opvallend robuust: reload midden in fase 1 (deels geselecteerde kaarten) en fase 2 (deels opgebouwde volgorde) behoudt exact de juiste tussentijdse staat, zonder dataverlies. Geen console- of netwerkfouten waargenomen in enig profiel.
   Bewijs: geen (a11y-snapshot-observatie tijdens Chaoot-profiel)

### Nog onzeker
- Of bevinding #1 (Perfect-mismatch) ook bij andere scorepercentages in fase 2 optreedt (bv. 20/25 vs 24/25) — beide geteste gevallen zaten rond 60-80%, dus de exacte grens van wanneer de boodschap wel/niet klopt is niet vastgesteld.
- Of het ontbreken van een fase-interne retry (bevinding #4) een bewuste didactische keuze is of een gemiste kans — dit is een productbeslissing, geen technisch defect.
- Fase 3's genuanceerde scenario's (bv. "wereldkaart zonder rivieren: hangt af van het doel") zijn inhoudelijk sterk maar vergen wat meer leesvaardigheid dan de andere fases — niet getest of dit voor de jongste leerlingen in leerjaar 1 haalbaar is zonder hulp van de docent.
