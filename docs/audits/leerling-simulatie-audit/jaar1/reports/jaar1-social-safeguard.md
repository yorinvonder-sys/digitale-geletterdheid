## Opdracht Live Check: social-safeguard

**Advies:** ship · **Risico:** Groen · **Getest als:** leerling (dev-preview zonder login) · **URL:** http://localhost:3010/dev/mission-preview?mission=social-safeguard

### Student-playthrough (per profiel: start/flow/feedback/eind)

**Modelleerling** — Intro laadt correct met titel, doel, SAFE-ACT-preview en Kees-avatar. Speelde serieus door alle 4 fasen (multi-select herkenning, SAFE-ACT-sequencing, 6× omstander-scenario's, privacy-multi-select), met één bewuste fout in fase 1. Eindigde op 92/100, badge "Online Beschermer". Viewport-matrix (810×1080, 1080×810, 390×844) op start/feedback/eind toonde identieke, intacte structuur — geen gebroken layout. Duur: ~9 minuten, ~45 acties.

**Speedrunner** — Klikte altijd de eerste optie / eerste 4-6 kaarten zonder afweging, probeerde te skippen. De missie liet dit nooit gratis door: score daalde navenant (9/25, 15/25, 13/25, 11/25 per fase) en de feedback-teksten pasten zich aan een matige prestatie aan (bijv. "Sommige situaties lijken onschuldig maar zijn dat niet" i.p.v. het feestelijke bericht). Eindigde op 48/100, badge "Goed Begonnen" met aanmoedigende, niet-bestraffende eindtekst. Duur: ~4 minuten, ~30 acties.

**Chaoot** — Dubbelklikken, conflicterende toggle-kliks, reload midden in fase 1 (4/6 selectie) en midden in de sequencing-taak (5/5 opgebouwd), browser-back naar about:blank en terugkeer. Geen enkele crash of datacorruptie: toggle-gedrag bleef correct, reload behield tussentijdse voortgang exact, dubbelklikken op controle-/volgende-knoppen leidde nooit tot dubbele scoretelling of dubbele fase-overgang. Eindigde foutloos op 84/100, badge "Online Beschermer". Duur: ~5 minuten, ~40 acties.

**Vastloper** — Zocht actief naar hints (geen gevonden — Kees is decoratief), gaf bewust foute antwoorden op 3 opeenvolgende fasen (fase 1: 9/25, fase 2: 5/25 met volledig omgekeerde SAFE-ACT-volgorde, fase 3: 0/25 met alle 6 scenario's fout). Elke fase bleef leerzaam: de correcte uitleg staat altijd naast het foute antwoord, ongeacht score. Geen enkele fase biedt een directe "probeer opnieuw"-knop — herkansen kan alleen door de hele missie na afronding te herstarten. Eindigde op 14/100, badge "Blijf Oefenen" met eerlijke maar aanmoedigende tekst; geen permanent vastlopen mogelijk. Duur: ~6 minuten, ~35 acties.

### Visuele UI/UX (logo's/afbeeldingen/layout/tekst-knoppen)

Consistente DUCK-stijl kaarten-layout over alle 4 fasen. Emoji-iconen bij elk scenario/kaart geven snelle visuele herkenning. Geselecteerde staat is duidelijk zichtbaar (gele/acid-achtergrond) — bevestigd via screenshot, ook wanneer de a11y-snapshot geen expliciete "geselecteerd"-tekst toont (fase 3 ja/nee-knoppen). Geen ontbrekende afbeeldingen, geen tekst-overflow of afgesneden content waargenomen op de 4 geteste viewports.

### Browserbewijs (tabel 4 viewports × 4 states)

| Viewport | start | flow | feedback | eind |
|---|---|---|---|---|
| desktop (1440×900) | ✅ modelleerling | ✅ modelleerling, speedrunner, chaoot | ✅ modelleerling, speedrunner (bug-bewijs), chaoot (toggle-bewijs) | ✅ modelleerling, speedrunner, chaoot, vastloper |
| tablet-portrait (810×1080) | ✅ modelleerling | — | ✅ modelleerling | ✅ modelleerling |
| tablet-landscape (1080×810) | ✅ modelleerling | — | ✅ modelleerling | ✅ modelleerling |
| mobile (390×844) | ✅ modelleerling | — | ✅ modelleerling | ✅ modelleerling |

Viewport-matrix uitsluitend door Modelleerling gedraaid (per draaiboek). Geen structurele afwijkingen tussen viewports in de a11y-snapshots.

### Bevindingen (BLOCK/WARN/INFO, genummerd, met bewijs-pad)

1. **WARN** — Fase 2 (SAFE-ACT-sequencing) toont een hardcoded "🎉 Perfect!"-slotzin ongeacht de behaalde score; bij Speedrunner verscheen deze tekst bij een score van 15/25 (2 van 5 items fout gepositioneerd). Fase 1 en 4 passen hun slotzin wél aan de score aan. *Bewijs:* `/Users/yorinvonder/dgskills-audit/evidence/social-safeguard/speedrunner/desktop/flow.png`
2. **WARN** — Geen enkele fase biedt een "probeer deze ronde opnieuw"-knop na feedback; een leerling die matig scoort moet noodgedwongen doorgaan naar de volgende fase en kan pas na volledige afronding de hele missie herstarten. *Bewijs:* `/Users/yorinvonder/dgskills-audit/evidence/social-safeguard/vastloper/desktop/feedback.png`
3. **INFO** — Dubbelklikken op "Start de missie" liet de intro-naar-fase1-overgang doorschieten naar een kaart-klik op dezelfde schermpositie (1 item vooraf geselecteerd bij binnenkomst in fase 1). Geen crash, teller bleef correct. *Bewijs:* `/Users/yorinvonder/dgskills-audit/evidence/social-safeguard/chaoot/desktop/start.png`
4. **INFO** — Reload midden in fase 1 (4/6 geselecteerd) en midden in de sequencing-taak (5/5 opgebouwd, nog niet gecontroleerd) behoudt de exacte tussentijdse voortgang perfect — geen dataverlies. *Bewijs:* `/Users/yorinvonder/dgskills-audit/evidence/social-safeguard/chaoot/desktop/flow.png`
5. **INFO** — Browser-back-navigatie (naar about:blank) tijdens fase 3 verliest de niet-bevestigde klikselecties binnen de huidige fase, maar de missie-voortgang (fase-positie + eerder behaalde score) blijft correct bewaard na terugkeer.
6. **INFO** — Fase 3 (ja/nee-omstander-knoppen) toont geen "geselecteerd"-status in de a11y-snapshot, hoewel de visuele styling (gele achtergrond) de keuze correct bevestigt — mogelijk ontbrekende `aria-pressed` voor schermlezers. *Bewijs:* `/Users/yorinvonder/dgskills-audit/evidence/social-safeguard/modelleerling/desktop/flow-2-after-click.png`
7. **INFO** — "Terug"-knop (aria-label) matcht ambigu met tekst in de sequencing-fase bij naam-gebaseerde selectors, en het klikken erop toonde geen navigatie-effect in de dev-preview-context (verwacht: leidt normaal naar het missieoverzicht buiten deze testmodus).
8. **INFO** — Gevoelig scenario (zorgwekkende Instagram-status met suïcide-signaal) krijgt bij correct én fout antwoord evenwichtige, niet-alarmistische feedback die een volwassene laat inschakelen.
9. **INFO** — Ook bij de laagst mogelijke score (14/100) is de missie eerlijk afmaakbaar: geen permanent vastlopen, aanmoedigende eindboodschap, volledige leerstof-samenvatting blijft zichtbaar. *Bewijs:* `/Users/yorinvonder/dgskills-audit/evidence/social-safeguard/vastloper/desktop/eind.png`

Geen console- of netwerkfouten waargenomen over alle 4 profielen (alleen normale web-vitals/analytics-logging, analytics correct geskipt zonder consent in dev-preview).

### Nog onzeker

- Het gedrag van de "Terug"-knop en de "Missie voltooid! 🎉"-knop kon niet volledig geverifieerd worden omdat de dev-preview-route (zonder login) geen missieoverzicht/dashboard heeft om naartoe te navigeren — dit is mogelijk correct productiegedrag dat in deze testcontext niet zichtbaar wordt.
- Niet getest: gedrag bij een ingelogde leerling-sessie (score-persistentie naar het leerlingprofiel, XP-toekenning, badge-weergave op het dashboard) — buiten scope van dev-preview zonder login.
