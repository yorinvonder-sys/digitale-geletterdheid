# Rubric-review: Dashboard Designer

**Datum:** 2026-08-25
**templateType:** data-viewer
**Sweep:** wave 22 — batch-review

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

---

## 🎨 Design review

**Reviewer:** dgskills-design-reviewer (statisch, config-only — geen JSX in deze missie)

### ✅ Geslaagd
- **Criterium 1 (tokens):** badge-kleuren gebruiken uitsluitend geldige duck-tokens (`#202023` = duck-ink, `#e1ff01` = duck-acid) — `src/features/missions/templates/data-viewer/configs/dashboard-designer.ts:191-214`
- **Criterium 4 (copy-lengte):** `introDescription` ≈ 45 woorden, dataset-`description`s 35-60 woorden — ruim binnen de grens van <80 woorden voor leerjaar 2 (`dashboard-designer.ts:9`, `21`, `78`, `146`)
- **Criterium 3 (knop-clarity):** n.v.t. — geen eigen UI-elementen in deze config, valt onder de gedeelde engine

### ⚠️ Aandachtspunten
- **Criterium 1 (tokens)**: pie-chart kleur `#99984D` is geen bestaand duck- of lab-token — `dashboard-designer.ts:97`
  - **Wat:** vier van de vijf `chartData`-kleuren zijn exacte duck-tokens (`#ff3c21`, `#202023`, `#e1ff01`, `#c2c1bd`), maar `#99984D` (Nederlands-segment) staat los van het palet.
  - **Waarom:** leerlingen zien een kleur die nergens anders in de DUCK-huisstijl terugkomt — inconsistent visueel systeem in een missie die zelf leert "gebruik kleur bewust, max 4-5 kleuren uit één systeem".
  - **Voorstel:** vervang door een bestaand duck-alias-token dat voldoende contrast geeft met de andere vier (bv. een gedimde variant van `duck-ink` of `duck-gray`-verwant), zodat alle vijf segmenten uit hetzelfde palet komen.

### ❌ Blocking issues
Geen.

### Score
2/3 relevante criteria volledig geslaagd (1 warning, geen blocking) · **8/10**

---

## 📚 Didactiek review

**Reviewer:** dgskills-didactiek-reviewer

### ✅ Geslaagd
- **Criterium 1 (SLO-codes geldig):** `21C` (Data & Dataverwerking) regulier, `18B` VSO — beide bestaande, correcte codes — `src/config/slo-kerndoelen-mapping.ts:108`
- **Criterium 2 (SLO-fit):** de missie laat leerlingen data lezen, KPI's kiezen en grafiektype-keuzes beoordelen — dat is kernactiviteit van 21C. De mapping-comment scoopt bewust af ("de leerling ontwerpt geen eigen dashboard") — eerlijke, onderbouwde claim in plaats van overclaim.
- **Criterium 3 (leerdoelen):** `missionGoals.ts:746-753` — `primaryGoal` gebruikt meetbare werkwoorden ("kies de juiste visualisatie", "selecteer zinvolle KPI's"); `evidence`-veld is concreet toetsbaar.
- **Criterium 6 (curriculum-plek):** leerjaar 2, past bij een missie die voortbouwt op eerdere data-missies (`data-detective`, `data-verzamelaar` in leerjaar 1).
- **Criterium 7 (Bloom-balans):** goede spreiding — `q1`/`q4` (herkennen/vergelijken), `q2` (toepassen: procentpunt-verschil berekenen), `q3`/`q6`/`q8` (analyseren/evalueren: KPI-keuze beargumenteren, chart-type beargumenteren) — geen pure recall-quiz.
- **Criterium 9 (VSO):** `sloVsoKerndoelen: ['18B']` aanwezig.

### ⚠️ Aandachtspunten
- **Criterium 4 (cognitieve load)**: 3 datasets × gemiddeld 2-3 vragen = 8 vragen totaal in één sessie — binnen de norm (max 3-4 "rondes" voor leerjaar 1-2, en 3 datasets tellen als zodanig), maar wel aan de bovenkant. Geen actie nodig, alleen genoteerd als context.

### ❌ Blocking issues
Geen.

### SLO-fit oordeel
Terecht — de scope-beperking is expliciet gedocumenteerd in de mapping-comment.

### Score
6/6 relevante criteria geslaagd · **9/10**

---

## 🔧 Tech review

**Reviewer:** dgskills-tech-reviewer (statisch — geen dev-server draaide voor deze sub-review; dynamische verificatie liep bij de gedeelde engine-pass)

### ✅ Geslaagd
- **Scoring-optelsom:** de acht vraag-`points` (15+15+10+15+15+10+15+10) tellen op tot exact `maxScore: 100` — `dashboard-designer.ts:19-224`
- **Config-structuur:** alle 3 datasets hebben geldige `type`, bijpassende velden (`columns`/`rows`, `chartData`, `cards`) en elke vraag heeft `explanation` + `points`.

### ⚠️ Aandachtspunten
- **Overgenomen van de gedeelde engine (data-viewer):** de twee blocking-bevindingen uit de engine-review (`DataViewer.tsx:984` ontbrekend `onRetry` → dode knop onder 40%; `DataViewer.tsx:950` `clearSave()` vóór bevestigde `onComplete`) raken **deze missie concreet**, omdat de badge-lijst hier expliciet een tier `minScore: 0, "Aan de slag!"` definieert (`dashboard-designer.ts:216-221`). Dat impliceert dat een score tussen 0-39% een bedoelde, zichtbare uitkomst is — maar door de engine-bug komt zo'n leerling vast te zitten op een resultatenscherm zonder terugweg en wordt de missie nooit als voltooid geregistreerd. De badge-config van déze missie maakt de impact van de engine-bug tastbaar; de fix zelf hoort bij de engine (whitelist van deze pass dekt dat niet).
- **Drempel-inconsistentie:** dezelfde engine-bevinding over 40%-afronding (`totalScore/maxScore >= 0.4` vs. afgerond percentage `>= 40`) is bij `maxScore: 100` van deze missie het scherpst zichtbaar, omdat hier procenten en score 1-op-1 samenvallen (bv. 39/100 → 39% wordt niet als "gehaald" getoond, maar 39,5/100 zou al wel afronden naar 40% als de score niet-geheel was — bij dit gehele-getallen-schema is het randgeval zeldzaam maar niet uitgesloten bij text-observation-deelscoring).

### ❌ Blocking issues
Geen **missie-eigen** blocking issues — de blocking issues zitten in de gedeelde engine (zie engine-review) en zijn hierboven alleen genoteerd voor hun concrete impact op déze missie's badge-config.

### Score
2/2 missie-eigen criteria geslaagd, engine-erfenis apart genoteerd · **6/10** (verlaagd t.o.v. missie-eigen kwaliteit vanwege de tastbare impact van de gedeelde engine-bugs op deze missie se badge-tier 0-39%)

---

## Voorstellen

### 1. Pie-chart kleur uitlijnen met duck-palet (design, mechanisch)

```ts
// ❌ Huidig — dashboard-designer.ts:97
{ label: 'Nederlands', value: 15, color: '#99984D' },

// ✅ Voorgesteld — vervang door een duck-tokenkleur die voldoende contrasteert
{ label: 'Nederlands', value: 15, color: '#6b6a3f' }, // of een aangewezen 5e duck-dataviz-kleur
```

Dit is een mechanische één-regel-wijziging binnen de config-whitelist van deze pass.

---

## Samenvatting & verdict

Dashboard Designer is een inhoudelijk sterke missie: de SLO-claim (21C) is eerlijk en goed onderbouwd, de leerdoelen zijn meetbaar geformuleerd, en de vraagopbouw dekt een gezonde Bloom-spreiding (van "welke klas heeft de laagste aanwezigheid" tot "beargumenteer je KPI-keuze voor 2C"). Op design is er één kleine palet-inconsistentie in de cirkeldiagram-kleuren. Op techniek zijn er geen missie-eigen fouten; de enige zwaarwegende risico's komen uit de gedeelde data-viewer-engine (geen terugweg onder 40%, opslag gewist vóór bevestigde voltooiing) — bevindingen die al zijn vastgelegd in de aparte engine-review en die de badge-tier "Aan de slag!" (0-39%) van deze missie in de praktijk onbereikbaar maken.

**Verdict: fix-eerst** — niet vanwege de missie-config zelf (die is ship-klaar), maar omdat de gedeelde engine-bug een badge-tier van déze missie functioneel breekt. Zodra de engine-fix (elders in de sweep) landt, is deze missie zonder verdere wijzigingen ship-klaar; de kleurfix hierboven is optioneel gepland onderhoud.
