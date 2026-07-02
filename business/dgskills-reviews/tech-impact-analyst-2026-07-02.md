# Missie-review: Tech Impact Analyst

**Mission ID:** tech-impact-analyst
**Template:** data-viewer
**Curriculum-plek:** Leerjaar 3, Periode 3 (Maatschappelijke Impact & Innovatie)
**Datum:** 2026-07-02
**Reviewer-pipeline:** M4 batch-review (wave 16)

---

## 🎨 Design review

**Mission:** tech-impact-analyst (data-viewer)
**Reviewer:** dgskills-design-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (Tailwind token consistentie)**: geen hex-literals in UI-classNames; `chartData.color` gebruikt engine-hexwaarden (`#202023`, `#ff3c21`, `#e1ff01`) die exact overeenkomen met duck-ink/duck-error/duck-acid — consistent met baseline `digital-divide-researcher.ts:84-90` (zelfde patroon) — `src/features/missions/templates/data-viewer/configs/tech-impact-analyst.ts:87-92`
- **Criterium 2 (Layout consistentie)**: identieke datasets-structuur (table → bar-chart → document-cards) als baseline `digital-divide-researcher` van hetzelfde templateType — geen structurele afwijking
- **Criterium 3 (Knop-clarity)**: geen knoppen in de config zelf; engine-knoppen (DataViewer.tsx) zijn gedeeld en al elders goedgekeurd — n.v.t. voor deze missie-specifieke review
- **Criterium 4 (Copy-lengte)**: introDescription 29 woorden (grens leerjaar 3: <120), opdrachtvragen 19-21 woorden (grens: <80) — ruim binnen grenzen — `tech-impact-analyst.ts:9`, `:69`, `:181`
- **Criterium 5 (Responsive design)**: geen missie-specifieke responsive-code (engine-gedeeld); geen vaste pixel-widths in config
- **Criterium 6 (Framer Motion)**: geen motion-gebruik in config (engine-gedeeld)
- **Criterium 7 (Toegankelijkheid)**: geen missie-specifieke a11y-afwijkingen; icons (`📋`✅⚠️📝) hebben altijd begeleidende tekst, geen kleur-only informatie

### ⚠️ Aandachtspunten
_Geen._

### ❌ Blocking issues
_Geen._

### Visual Precision Gate
`WARN` — geen dev-server/screenshots-map beschikbaar in deze batch-run (M4-pipeline draait zonder Chrome-plugin-stap); geen dynamische viewport-evidence. Geen bekende structurele UI-afwijking op basis van static analyse en de gedeelde `DataViewer`-engine (elders al geverifieerd, engine-issues buiten scope van deze missie-review).

### Score
7/7 criteria geslaagd · Aanbeveling: **ship**

---

## 📚 Didactiek review

**Mission:** tech-impact-analyst (data-viewer)
**Curriculum-plek:** Leerjaar 3, Periode 3
**SLO-claim:** 23C (Maatschappij), 21D (AI)
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (SLO-codes correct)**: `23C` en `21D` zijn beide geldige regulier-VO-codes, 2 codes (binnen de "max 3"-richtlijn) — `src/config/slo-kerndoelen-mapping.ts:180`
- **Criterium 2 (SLO-fit)**: 23C sterk geraakt via de volledige impact-matrix (voordelen/risico's per domein) en de vier-stappenmethode (document-cards dataset); 21D geraakt via TikTok-aanbevelingsalgoritme-vraag (q8) — technologie-specifiek AI-voorbeeld, niet oppervlakkig — `tech-impact-analyst.ts:19-77` (matrix), `:179-187` (q8, AI-specifiek)
- **Criterium 3 (Leerdoelen helder)**: `missionGoals.ts:789-796` bevat `primaryGoal` met actiewerkwoorden ("Ik voer... uit en weeg... af") en meetbare `criteria` (score-threshold 65) — voldoet aan action-verb + concreet-eis
- **Criterium 4 (Opdracht-beknoptheid)**: alle copy ruim binnen leerjaar-3-grenzen (zie design-sectie) — max 3 datasets/8 vragen per missie, past bij "max 4-5 rondes"-richtlijn
- **Criterium 5 (Leeftijds-passend vocabulary)**: taal past bij 13-14 jaar (havo/vwo); "structurele werkloosheid" (q3-explanation) wordt direct uitgelegd binnen dezelfde zin — geen onverklaard jargon — `tech-impact-analyst.ts:73`
- **Criterium 6 (Curriculum-plek logisch)**: staat na `digital-divide-researcher` (zelfde templateType data-viewer) in periode 3 — logische scaffolding, leerling kent het dataset-interactiepatroon al — `src/config/curriculum.ts:284-291`
- **Criterium 7 (Bloom-taxonomie balans)**: goede mix — onthouden/tellen (q1, q5: numerieke lookups), begrijpen (q2: multiple-choice met redenering), analyseren (q3, q6, q8: text-observation met eigen redenering), toepassen (q7: methode toepassen op nieuw scenario) — geen platte quiz-recall
- **Criterium 9 (Welzijn & inclusiviteit)**: geen gevoelige onderwerpen; geen gender-specifieke aannames; geen VSO-mapping aanwezig (niet strikt vereist, maar wel een aandachtspunt — zie hieronder)

### ⚠️ Aandachtspunten
- **Criterium 9 (VSO-mapping ontbreekt)**: geen `sloVsoKerndoelen` op deze entry — `src/config/slo-kerndoelen-mapping.ts:180`
  - **Wat:** de missie heeft geen VSO-kerndoel-koppeling, terwijl andere leerjaar-3-missies dat wel kunnen hebben.
  - **Waarom:** VSO-leerlingen missen mogelijk zichtbaarheid/verantwoording voor deze missie in rapportages, als dat elders wel structureel wordt bijgehouden.
  - **Voorstel:** dit is een platform-brede afweging (niet elke missie heeft per se een VSO-equivalent) — geen missie-specifieke actie vereist tenzij Yorin VSO-dekking voor periode 3 structureel wil maken.
- **Criterium 4-gerelateerd (scoring-integriteit, zie tech-sectie)**: het meetbare succescriterium in `missionGoals.ts` ("score-threshold 65") is haalbaar, maar de `maxScore: 100` in de config zelf is voor de leerling **nooit volledig behaalbaar** (zie Tech review, Blocking) — dit ondermijnt het leerdoel-principe "concreet en meetbaar" indirect: een leerling die alle 8 vragen perfect beantwoordt, ziet toch nooit 100/100, wat verwarrend is voor zelfregulatie van leren.

### ❌ Blocking issues
_Geen didactisch-specifieke blocking issues — het onderliggende scoring-defect is als technische bug geclassificeerd (zie Tech review)._

### SLO-fit oordeel
- **23C (Maatschappij)**: sterk geraakt — bewijs: volledige impact-matrix (dataset 1) + vier-stappenmethode (dataset 3) + toepassingsvraag q7
- **21D (AI)**: sterk geraakt — bewijs: q8 behandelt specifiek een AI-aanbevelingsalgoritme (TikTok) met voor-/nadeel-analyse

### Score
9/9 criteria geslaagd (1 aandachtspunt, niet-blocking) · Bloom-balans: **medium-hoog** (goede mix, geen overmatig hoge eis voor leerjaar 3) · Aanbeveling: **ship** (met de tech-fix hieronder als aanbevolen bijkomende fix)

---

## 🔧 Tech review

**Mission:** tech-impact-analyst (data-viewer)
**Reviewer:** dgskills-tech-reviewer (Sonnet)
**Dynamic verificatie:** overgeslagen — geen dev-server/screenshots-map beschikbaar in deze M4-batch-run

### Static analyse

#### ✅ Geslaagd
- **Criterium A1 (Knop-handlers)**: geen missie-specifieke knoppen in de config; engine-gedeeld (`DataViewer.tsx`) — buiten scope voor missie-review
- **Criterium A2 (Error states)**: geen missie-specifieke async-calls in de config; engine-gedeeld error-handling — buiten scope
- **Criterium A3 (TypeScript-discipline)**: geen `any`, geen `@ts-ignore` in `tech-impact-analyst.ts` — config is volledig getypeerd via `DataViewerConfig`
- **Criterium A4 (Imports via alias)**: enige import is `import type { DataViewerConfig } from '../DataViewer'` — relatief pad, maar dit is het gangbare patroon binnen dezelfde template-map (consistent met baseline `digital-divide-researcher.ts` en alle andere data-viewer-configs — geen missie-specifieke afwijking)
- **Criterium A6 (Restart-safe state)**: `useMissionAutoSave` correct aangeroepen in de gedeelde engine (`DataViewer.tsx:482`) — geldt voor alle data-viewer-missies inclusief deze
- **Criterium A7 (Security)**: geen `dangerouslySetInnerHTML`, geen client-side `systemInstruction` (deze missie heeft geen chat/`enableChat` — puur data-analyse, geen AI-interactie op templateRegistry-niveau) — `src/config/templateRegistry.ts:79`

#### ⚠️ Aandachtspunten
_Geen aanvullende (naast de blocking hieronder)._

#### ❌ Blocking issues
- **Puntensom komt niet overeen met `maxScore`** — `tech-impact-analyst.ts:192` (`maxScore: 100`) versus som van alle vraag-`points`-velden
  - **Wat:** de 8 vragen sommeren tot 85 punten (q1=15, q2=15, q3=10, q4=10, q5=10, q6=10, q7=15, q8=0), terwijl `maxScore: 100` is geconfigureerd. `clampScore()` (`DataViewer.tsx:98-100`) clampt de score naar `[0, maxScore]` maar voegt geen punten toe — een leerling die alle 8 vragen perfect beantwoordt (inclusief maximale `confidenceMultiplier`) haalt in de praktijk maximaal **85/100**, nooit 100/100.
  - **Risico:** de voortgangsbalk/percentage-weergave (`totalScore / maxScore`) toont een leerling die alles goed heeft altijd een onvolledige balk (85%) — dit is verwarrend en didactisch demotiverend (leerling denkt een fout gemaakt te hebben terwijl dat niet zo is). Het "Tech Impact Expert!"-badge (drempel 85, `tech-impact-analyst.ts:196`) is daardoor exact het theoretische plafond — technisch behaalbaar maar zonder enige marge, wat het risicovol maakt voor kleine afrondingsverschillen via `confidenceMultiplier` (`DataViewer.tsx:95`, `Math.round`).
  - **Voorstel (Voorstel-blok):**

    ```ts
    // ❌ Huidig — src/features/missions/templates/data-viewer/configs/tech-impact-analyst.ts:192
    maxScore: 100,

    // ✅ Voorgesteld (optie A — maxScore aligned met werkelijke puntensom)
    maxScore: 85,
    ```

    **Alternatief (optie B)** — als 100 als rond getal gewenst is voor de leerling-ervaring, verhoog `q8.points` van `0` naar `15` (consistent met andere text-observation-vragen zoals q3/q6 die wél punten toekennen):

    ```ts
    // ❌ Huidig — src/features/missions/templates/data-viewer/configs/tech-impact-analyst.ts:186
    points: 0,

    // ✅ Voorgesteld
    points: 15,
    ```

    Beide opties zijn een 1-regel-fix. Optie B heeft de voorkeur als q8 (TikTok-AI-vraag) inhoudelijk gelijkwaardig is aan q3/q6 (beide text-observation, beide 10pt) — q8 is zelfs de enige vraag die 21D (AI) expliciet raakt, dus 0 punten daarvoor ondergewaardeert het AI-kerndoel-bewijs. Optie A is de kleinere/veiligere fix als er een bewuste reden was om q8 niet te laten meetellen (niet uit de config af te leiden).

### Dynamic verificatie (indien uitgevoerd)
Niet uitgevoerd — geen dev-server of screenshots-map beschikbaar in deze M4-batch-run. Geen console/network/visuele evidence verzameld. Multi-viewport-verificatie is een openstaande follow-up (zie UI-UX-review-doc `docs/audits/student-missions-ui-ux-review-2026-06-30.md` — `tech-impact-analyst` komt daar niet in voor, dus nog geen bestaande dekking).

### Score
Static: 6/7 criteria geslaagd (1 blocking) · Dynamic: n.v.t. · Aanbeveling: **fix-eerst** (1-regel scoring-fix, laag risico, hoge didactische impact)

---

## 🖼️ Visuele evidence (multi-viewport)

Geen screenshots-map beschikbaar voor deze missie in deze M4-batch-run. Geen dev-server gestart (buiten scope van deze batch-review-configuratie). Multi-viewport-verificatie via Chrome-plugin is een openstaande follow-up, net als voor de rest van wave 16.

---

## Samenvatting
- **Geslaagd:** 22 criteria (7 design + 9 didactiek + 6 tech)
- **Aandachtspunten:** 2 issues (0 blocking bij design, 1 niet-blocking bij didactiek, 1 blocking bij tech)
- **Aanbeveling:** **fix-eerst** — één 1-regel-fix (maxScore of q8.points) vereist vóór ship; verder sterke missie op design en didactiek

---

## Codex-gate (M1)
_Niet uitgevoerd — deze M4-batch-review-run draait zonder Codex-adversarial-gate-stap (buiten scope van de gegeven taakinstructie voor deze wave). Rapport is sub-reviewer-output, geen Codex-gevalideerd ship-bewijs._
