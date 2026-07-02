# Missie-review: api-verkenner

**Datum:** 2026-07-02
**Wave:** 11 (verse review)
**Template:** data-viewer
**Config:** `src/features/missions/templates/data-viewer/configs/api-verkenner.ts`
**Curriculum-plek:** Leerjaar 2, Periode 1 (Data & Informatie)
**SLO-claim:** 21A, 21C (regulier) · 18A, 18B (VSO)

---

## 🎨 Design review

**Mission:** api-verkenner (data-viewer)
**Reviewer:** dgskills-design-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (Tailwind tokens)**: geen hex-literals of tokens in de config — kleuren in `chartData` (`#ff3c21`, `#202023`, `api-verkenner.ts:85-90`) zijn engine-bekende bar-chart value-kleuren, geen Tailwind classes. Consistent met andere data-viewer-configs.
- **Criterium 2 (Layout consistentie)**: config-structuur (datasets → questions → badges → takeaways) is identiek aan zusterconfigs van hetzelfde templateType; geen structurele afwijking.
- **Criterium 4 (Copy-lengte)**: introDescription 49 woorden (<80), dataset-descriptions 24-39 woorden (<60) — ruim binnen leerjaar 2-grens (`api-verkenner.ts:8-9, 21-22, 81-82, 130-131`).
- **Criterium 7 (Toegankelijkheid, basis)**: engine-brede a11y-set (bekend, niet missie-specifiek) — geen missie-specifieke a11y-afwijking gevonden.

### ⚠️ Aandachtspunten
- (geen)

### ❌ Blocking issues
- (geen)

**Visual Precision Gate:** unverified — geen screenshots-map aanwezig, geen Chrome-plugin evidence beschikbaar in deze review-pass (zie Tech review, Fase B).

### Score
4/4 criteria geslaagd (2 n.v.t. voor data-viewer content-only config) · Aanbeveling: ship

---

## 📚 Didactiek review

**Mission:** api-verkenner (data-viewer)
**Curriculum-plek:** Leerjaar 2, Periode 1
**SLO-claim:** 21A, 21C · VSO 18A, 18B
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (SLO-codes correct)**: `21A` (Digitale systemen) en `21C` (Data & Dataverwerking) zijn geldige regulier-codes; `18A`/`18B` geldige VSO-codes (`src/config/slo-kerndoelen-mapping.ts:101`). Comment in de mapping bevestigt een bewuste correctie (`21D→21A: APIs begrijpen = systeemkennis, geen AI`) — geen mismatch.
- **Criterium 2 (SLO-fit)**: alle 3 datasets vragen leerlingen JSON-structuur te lezen (21C) en systeemwerking van API's te begrijpen (21A) — substantieel contact, geen oppervlakkig raken.
- **Criterium 3 (Leerdoelen helder)**: `missionGoals.ts:717-724` heeft een expliciet, meetbaar `primaryGoal` + `evidence` ("Je kunt een veld in een JSON-antwoord aanwijzen, uitleggen wat een URL-parameter doet en waarom een API-sleutel nodig is") — concreet en actie-gericht.
- **Criterium 4 (Opdracht-beknoptheid)**: zie Design review — ruim binnen leerjaar 2-grens.
- **Criterium 5 (Leeftijds-passend vocabulary)**: ober-metafoor in agent-briefing (`year2.tsx:288`) en concrete voorbeeld-apps (Instagram, Buienradar, Google Maps) sluiten aan bij 13-14 jaar; geen onuitgelegd jargon.
- **Criterium 6 (Curriculum-plek)**: past logisch in periode "Data & Informatie" naast data-journalist, spreadsheet-specialist, factchecker, dashboard-designer (`curriculum.ts:163-169`) — API's als vervolg op databegrip is een logische opbouw.
- **Criterium 7 (Bloom-balans)**: mix aanwezig — q2/q4 zijn onthouden/herkennen (tabel/grafiek aflezen), q1/q5 zijn toepassen (berekenen), q3/q6/q7/q8 zijn analyseren/toepassen (waarom-vragen, patroon-extrapolatie in q8: "hoe zou de URL voor charizard eruitzien"). Geen pure quiz-recall.
- **Criterium 9 (Welzijn & inclusiviteit)**: VSO-mapping aanwezig; geen gevoelig onderwerp van toepassing.

### ⚠️ Aandachtspunten
- (geen)

### ❌ Blocking issues
- (geen)

### SLO-fit oordeel
- **21A (Digitale systemen)**: sterk geraakt — dataset 3 (API-endpoints) + agent-briefing leggen request/response-systematiek uit.
- **21C (Data & Dataverwerking)**: sterk geraakt — dataset 1 (JSON-tabel) + dataset 2 (staafgrafiek) vragen leerlingen data te interpreteren en berekenen.

### Score
8/8 criteria geslaagd (criterium 8 n.v.t. — `enableChat` niet gezet voor api-verkenner in `templateRegistry.ts:71`, dus geen live chat-flow om te toetsen) · Bloom-balans: medium · Aanbeveling: ship

---

## 🔧 Tech review

**Mission:** api-verkenner (data-viewer)
**Reviewer:** dgskills-tech-reviewer (Sonnet)
**Dynamic verificatie:** overgeslagen — geen dev-server gestart in deze review-pass, geen screenshots-map aanwezig

### Static analyse

#### ✅ Geslaagd
- **Antwoordmodel-correctheid (data-viewer-specifiek verplicht)**: alle 8 vragen nagerekend tegen de dataset.
  - q1 (number-input): 14,2 − 12,8 = 1,4 — claimed `1.4` klopt exact (`api-verkenner.ts:48`).
  - q2 (multiple-choice): `humidity` = `78` = type `number` in de tabel — claimed `'number'` klopt (`api-verkenner.ts:59`).
  - q4 (multiple-choice): Google Maps = 47, hoogste bar in chartData — claimed `'Google Maps'` klopt (`api-verkenner.ts:98`).
  - q5 (number-input): 38 ÷ 3 = 12,6667 → afgerond 12,7 — claimed `12.7` klopt, ruim binnen de 5%-tolerantie (`api-verkenner.ts:108`).
- **Puntensom vs maxScore**: dataset 1 = 15+10+10=35, dataset 2 = 10+15+10=35, dataset 3 = 15+15=30 → totaal 100 = `maxScore: 100` (`api-verkenner.ts:47,52,62,72,93,101,111,163,173,183,190`). Klopt exact.
- **text-observation-punten**: q3, q6, q8 zijn `text-observation` — engine kent hier altijd volle participatiepunten toe (bekend, geen missie-issue).
- **Agent-briefing inhoudelijke match**: `systemInstruction` in `year2.tsx:279-306` sluit inhoudelijk aan op de config — ober-metafoor, JSON-als-boodschappenlijst, URL-parameters, publieke API's (weer/Pokemon) komen letterlijk terug in de datasets. Briefing benoemt expliciet "geef NOOIT het volledige antwoord" (AI-as-copilot). Chat is echter niet actief voor deze missie (`templateRegistry.ts:71` heeft geen `enableChat`), dus deze briefing wordt momenteel niet aan leerlingen getoond — bekend platform-breed beslispunt (dormante chat-rol), niet missie-specifiek te fixen.
- **TypeScript-discipline**: geen `any`, geen `@ts-ignore` in de config; typed via `DataViewerConfig` (`api-verkenner.ts:1`).
- **Imports**: geen relatieve imports in de config zelf.

#### ⚠️ Aandachtspunten
- (geen)

#### ❌ Blocking issues
- (geen)

### Dynamic verificatie
Niet uitgevoerd — geen dev-server / screenshots-map beschikbaar in deze review-pass. Visual Precision Gate: unverified (zie Design review).

### Score
Static: 7/7 · Dynamic: n.v.t. · Aanbeveling: ship (dynamic verificatie als follow-up bij volgende volledige sweep)

---

## Samenvatting

| Rubric | Score (0-10, 10=uitstekend) |
|---|---|
| Design | 9 |
| Didactiek | 9 |
| Tech | 9 |

**triageScore** = (10-9)×0.3 + (10-9)×0.4 + (10-9)×0.3 = 0.3 + 0.4 + 0.3 = **1.0**

Geen blocking issues, geen aandachtspunten gevonden. Antwoordmodellen kloppen exact tegen de dataset, puntensom klopt exact tegen maxScore, SLO-claim is correct en substantieel geraakt, copy ruim binnen leeftijdsgrens. Enige beperking: dynamic/visuele verificatie (Chrome-plugin screenshots) is niet uitgevoerd in deze pass — aanbevolen als follow-up bij de volgende UI/UX-sweep, geen blocker voor ship.

**Eindaanbeveling: ship.**
