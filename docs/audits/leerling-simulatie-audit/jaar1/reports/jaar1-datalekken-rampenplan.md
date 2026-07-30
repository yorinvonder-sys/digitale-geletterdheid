## Opdracht Live Check: datalekken-rampenplan

**Advies:** fix-eerst · **Risico:** Geel · **Getest als:** leerling (dev-preview zonder login) · **URL:** http://localhost:3010/dev/mission-preview?mission=datalekken-rampenplan

### Student-playthrough (per profiel: start/flow/feedback/eind)

**Modelleerling** — Verse start op desktop: crisisintro ("De school is gehackt! 800 leerlinggegevens liggen op straat"), doel en 4 stappen (Bewijs analyseren / Prioriteiten stellen / Brief schrijven / Budget verdelen) direct zichtbaar, Kees geeft korte intro. Speelde alle 4 fases serieus met 1 bewuste fout in fase 1 (afleider "printerstoring" meegeselecteerd naast de 4 juiste bewijsstukken). Score liep op via 20 → 37 → 62 → 85 pts. Eindscherm: "Crisis Commander", 85/100, per-fase-uitsplitsing en 4 concrete takeaways. Deed de volledige viewport-matrix (desktop/tablet-portrait/tablet-landscape/mobile) op alle 4 sleutelmomenten — geen enkel layoutprobleem gevonden. Reload op het eindscherm behield de score correct. De "Missie Voltooid!"-knop deed niets (geen navigatie, geen state-change, geen console-error).

**Speedrunner** — Klikte direct "Start de missie", selecteerde in fase 1 slechts 1 van 4 juiste bewijsstukken en diende meteen in. Missie accepteerde het probleemloos (6 pts, gemiste items gemarkeerd met "gemist!"). Zelfde patroon in fase 2 (klikte gewoon van boven naar beneden, niet de juiste volgorde) en fase 3 (1 van 5 juiste onderdelen). In fase 4 werd bevestigd dat "Beveiligingsplan indienen" pas enabled is na een selectie (skip-poging op "Verstuur brief" zonder selectie faalde correct met een 1500ms-timeout op de disabled-knop). Eindscherm: "Crisis Trainee" (lagere titel dan Modelleerling), 36/100 — het systeem differentieert dus zichtbaar op prestatie zonder de speler te blokkeren. Zelfde dode eindknop.

**Chaoot** — Dubbelklikte op kaarten (gedraagt zich als correcte toggle aan/uit, geen dubbele registratie), reloadde midden in fase 2 met 2 van 6 prioriteiten al geselecteerd (state bleef volledig intact na reload), deed `back` naar `about:blank` en navigeerde daarna terug naar de missie-URL — óók dan bleef de volledige voortgang (score + 6-item-volgorde) behouden. Selecteerde in fase 3 bewust alle 8 opties (5 goed + 3 fout) — de live brief-preview toonde een realistische "slechte brief" met alle elementen door elkaar; dubbelklikte op "Verstuur brief" zonder dubbele score-optelling. In fase 4 testte de budget-guard: een over-budget item (penetratietest bij nog maar €3.500 over) was correct disabled; dubbelklikken op de firewall-kaart togglede 'm netjes aan-uit-aan. Eindscherm: 39/100. Nul console-errors en nul netwerkfouten over de hele chaotische run.

**Vastloper** — Koos in fase 1 bewust alleen de 2 afleiders (0 van 4 juist) en diende in — geen "Probeer opnieuw"-knop verscheen, alleen "Volgende fase". In fase 2 koos de exacte omgekeerde (foute) volgorde — 2 pts, dezelfde alleen-doorgaan-structuur. In fase 3 selecteerde de 3 slechtst mogelijke onderdelen (schuld toewijzen, bagatelliseren, schadeclaim-aanbod) — de live preview toonde een schokkend slechte brief ("Het valt allemaal wel mee... maakt u zich geen zorgen" + een geld-aanbod, zonder ooit te zeggen wat er gelekt is) — 2 pts. In fase 4 koos de duurste, minst-impactvolle optie (firewall, "beperkte meerwaarde") — 8 pts totaalscore. **Belangrijkste bevinding: geen enkele fase heeft een retry-mechanisme.** Je kunt dus niet permanent vastlopen (positief), maar je kunt ook niet actief herkansen op een fase — de missie forceert je door, ongeacht score. De eindscherm-takeaways waren woordelijk identiek bij 85/100 en bij 8/100 (generieke, niet-gepersonaliseerde feedback).

### Visuele UI/UX (logo's/afbeeldingen/layout/tekst-knoppen)
Consistent duck-design-systeem (geel/zwart/crème), duidelijke iconen per bewijsstuk/actie/budgetoptie, voortgangsbalk bovenaan zichtbaar op alle viewports. Live-preview-patronen (crisisbrief die zich opbouwt, kleurgecodeerde volgorde-feedback met pijl-naar-juiste-positie) zijn sterk didactisch ontwerp. Geen afgeknipte tekst, geen overlappende elementen, geen gebroken afbeeldingen op enige viewport. Jargon wordt inline uitgelegd tussen haakjes (bv. "data-exfiltratie (= gegevens stiekem naar buiten kopiëren)").

### Browserbewijs (tabel 4 viewports × 4 states)

| Viewport | start | flow | feedback | eind |
|---|---|---|---|---|
| desktop (1440×900) | ✅ modelleerling/desktop/start.png | ✅ modelleerling/desktop/flow.png (+flow-2) | ✅ modelleerling/desktop/feedback.png (+feedback-2) | ✅ modelleerling/desktop/eind.png |
| tablet-portrait (810×1080) | ✅ start.png | ✅ flow.png | ✅ feedback.png | ✅ eind.png |
| tablet-landscape (1080×810) | ✅ start.png | ✅ flow.png | ✅ feedback.png | ✅ eind.png |
| mobile (390×844) | ✅ start.png | ✅ flow.png | ✅ feedback.png | ✅ eind.png |

Alle 16 combinaties gerenderd zonder visuele defecten. Aanvullend bewijs voor Speedrunner/Chaoot/Vastloper (desktop-only, per profiel-eisen): eindschermen + relevante flow/feedback-sleutelmomenten.

### Bevindingen (BLOCK/WARN/INFO, genummerd, met bewijs-pad)

1. **BLOCK** — De "Missie Voltooid!"-knop op het eindscherm doet niets: geen navigatie, geen state-change, geen console-error. Bevestigd bij alle 4 profielen (scores 85, 36, 39, 8). `evidence/datalekken-rampenplan/modelleerling/desktop/eind.png`
2. **WARN** — Geen enkele fase (1-4) heeft een "Probeer opnieuw"-knop; bij een volledig fout antwoord toont het systeem alleen "gemist!"-labels en dwingt door naar de volgende fase. Leerling kan niet actief herkansen op dezelfde stap. `evidence/datalekken-rampenplan/vastloper/desktop/feedback-2.png`
3. **WARN** — De "Wat je moet onthouden"-takeaways op het eindscherm zijn woordelijk identiek ongeacht score (getest bij 85/100 en bij 8/100) — generiek, niet gepersonaliseerd op de daadwerkelijk gemaakte fouten.
4. **INFO** — Reload/back-navigatie behoudt state betrouwbaar op elk moment (midden-in-fase, op eindscherm) — geen dataverlies, geen dubbele score-optelling, geen score-exploit gevonden via reload. `evidence/datalekken-rampenplan/chaoot/desktop/flow.png`
5. **INFO** — Budget-guard (fase 4) en submit-guards (disabled-knoppen bij lege selectie) werken robuust, ook onder chaotisch dubbelklik-gedrag.
6. **INFO** — Systeem differentieert eindtitel op prestatie (Modelleerling "Crisis Commander" bij 85/100 vs. Speedrunner/Chaoot/Vastloper "Crisis Trainee" bij 36-8/100) — goede anti-skip-beloningsstructuur, al is er geen aparte laagste-titel voor een extreem lage score (8/100 kreeg dezelfde titel als 39/100).
7. **INFO** — Nul console-errors en nul netwerkfouten over alle 4 profielen, inclusief zwaar chaotisch gedrag (dubbelklikken, reload-midden-in-stap, back-navigatie, snelle conflicterende kliks).

### Nog onzeker
- Of de dode "Missie Voltooid!"-knop bedoeld normale navigatie (terug naar dashboard/missieoverzicht) mist, of dat afronding elders al server-side wordt vastgelegd zonder UI-feedback — dat vereist code-inzage die buiten deze black-box-test valt.
- Of het ontbreken van een per-fase-retry een bewuste ontwerpkeuze is (vloeiende flow, geen frictie) of een gemiste kans voor herkansing — een didactische afweging voor de missie-eigenaar.
