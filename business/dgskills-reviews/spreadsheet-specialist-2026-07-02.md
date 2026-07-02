# Missie-review: spreadsheet-specialist

**Datum:** 2026-07-02
**Wave:** 14 (verse review)
**Template:** data-viewer
**Config:** `src/features/missions/templates/data-viewer/configs/spreadsheet-specialist.ts`
**Agent-rol:** `src/config/agents/year2.tsx:92-116`
**SLO:** `src/config/slo-kerndoelen-mapping.ts:99` — leerjaar 2, week 1, kerndoelen `21C` (Data & Dataverwerking), `22A` (Digitale producten); VSO `18B`, `19A`
**Curriculum:** `src/config/curriculum.ts:165`

---

## 🎨 Design review

**Mission:** spreadsheet-specialist (data-viewer)
**Reviewer:** dgskills-design-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (Tailwind tokens):** config zelf bevat geen Tailwind className-hex-literals; `#e1ff01`/`#202023` in `chartData`/`badges` zijn data-config-velden (chart-kleur, badge-kleur), geen className-strings — geen tokenschending.
- **Criterium 4 (Copy-lengte):** `introDescription` = 32 woorden (limiet leerjaar 2: <120) — `spreadsheet-specialist.ts:9`. Ronde-vragen alle <40 woorden (limiet <80). Ruim binnen grenzen.
- **Criterium 3 (Knop-clarity):** N.v.t. voor deze static config-review — knoppen zitten in `DataViewer.tsx` (gedeelde engine), niet in deze missie-config. Engine-issues niet herhaald (bekend).

### ⚠️ Aandachtspunten
- **Ontbrekende visuele asset raakt ook design-oordeel** — `src/config/agents/year2.tsx:101`
  - **Wat:** `briefingImage: '/assets/agents/spreadsheet-specialist.webp'` bestaat niet in `public/assets/agents/` (geverifieerd met `ls`, geen match).
  - **Waarom:** de briefing-kaart voor deze missie toont een gebroken afbeelding of fallback vóór de leerling zelfs aan de data-viewer begint — eerste indruk van de missie is kapot.
  - **Voorstel:** zie Voorstel-blok onder Tech review (dit is primair een tech/asset-gat, hier alleen als design-impact genoteerd om dubbele blocking-vermelding te voorkomen).
- **Legacy `lab-*` tokens in agent-rol visualPreview** — `src/config/agents/year2.tsx:105-107`
  - **Wat:** `bg-gradient-to-br from-lab-teal to-lab-teal` (identieke from/to = geen gradient-effect) en `from-lab-coral to-lab-teal`.
  - **Waarom:** `lab-*` is legacy (bekend, platformbreed, niet opnieuw als missie-specifiek issue te behandelen) — maar de `from-lab-teal to-lab-teal` zelf is een lokale slordigheid (geen gradient, want beide stops identiek), los van het lab/duck-vraagstuk.
  - **Voorstel:** `from-lab-teal to-lab-teal` → een echte tweekleurige gradient, bv. `from-lab-teal to-lab-secondary` (kleine lokale fix, geen platformbrede duck-migratie nodig).

### ❌ Blocking issues
- (geen — het ontbrekende asset is tech-blocking, zie Tech review)

**Visual Precision Gate:** unverified — geen dev-server/screenshots-map beschikbaar in deze wave; geen entry voor `spreadsheet-specialist` in `docs/audits/student-missions-ui-ux-review-2026-06-30.md` (grep leeg = niet eerder visueel gereviewd).

### Score
2/3 toepasselijke criteria geslaagd (config-scope) · Aanbeveling: fix-eerst

---

## 📚 Didactiek review

**Mission:** spreadsheet-specialist (data-viewer)
**Curriculum-plek:** Leerjaar 2, Periode (zie curriculum.ts:165)
**SLO-claim:** `21C` Data & Dataverwerking, `22A` Digitale producten (regulier); `18B`, `19A` (VSO)
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (SLO-codes correct):** `21C` en `22A` zijn beide geldige regulier-codes; `18B`/`19A` geldige VSO-codes — `slo-kerndoelen-mapping.ts:99`.
- **Criterium 2 (SLO-fit):** `21C` (Data & Dataverwerking) sterk geraakt — leerling filtert/sorteert/berekent op een echte dataset (q1, q2, q4, q5). `22A` (Digitale producten) matig-tot-sterk geraakt via formule-toepassing en grafiekkeuze-redenering (q6, q7).
- **Criterium 3 (Leerdoelen):** impliciet via `missionGoals.ts:709` (`primaryGoal`) — concreet en meetbaar: "Ik gebruik spreadsheet-formules zoals SOM, GEMIDDELDE en MAX om vragen te beantwoorden en data te filteren en sorteren." Actiewerkwoord + concreet resultaat.
- **Criterium 4 (Opdracht-beknoptheid):** alle copy ruim binnen leerjaar-2-grenzen (zie Design review).
- **Criterium 7 (Bloom-balans):** goede mix — onthouden (q7: welke formule), toepassen (q1, q5: reken uit), analyseren (q2: vergelijk categorieën), evalueren (q3, q6, q8: leg uit wanneer/waarom). Geen pure quiz-recall.
- **Criterium 9 (Welzijn/VSO):** VSO-mapping aanwezig (`18B`, `19A`); geen gevoelige onderwerpen, geen probleem.

### ⚠️ Aandachtspunten
- **Criterium 8 (AI-as-copilot) — niet verifieerbaar in deze review-scope**
  - **Wat:** data-viewer-template heeft geen chat-integratie in de config zelf; `enableChat`-status en `systemInstruction`-gedrag zit in `year2.tsx:111+` (agent-rol) en is platformbreed hetzelfde 3-stappen-patroon als andere missies.
  - **Waarom:** bekend/dormant-chat-patroon is al platformbreed gedocumenteerd (niet opnieuw als missie-specifiek issue).
  - **Voorstel:** geen actie — buiten scope van deze data-viewer-config-review.

### ❌ Blocking issues
(geen)

### SLO-fit oordeel
- **21C (Data & Dataverwerking):** sterk geraakt — leerling rekent totalen/gemiddelden/verschillen uit echte kasboekdata en kiest juiste formule per situatie (q1, q3, q5, q7, q8).
- **22A (Digitale producten):** oppervlakkig-tot-matig geraakt — de missie behandelt spreadsheet-gebruik en grafiekkeuze, maar leerling produceert zelf geen digitaal product (bouwt geen eigen spreadsheet/grafiek, beantwoordt alleen vragen over een gegeven dataset). Dit is een format-beperking van het data-viewer-template (bekend, engine-breed), niet een missie-specifiek gat.

### Score
6/6 toepasselijke criteria geslaagd · Bloom-balans: medium-hoog · Aanbeveling: ship

---

## 🔧 Tech review

**Mission:** spreadsheet-specialist (data-viewer)
**Reviewer:** dgskills-tech-reviewer (Sonnet)
**Dynamic verificatie:** overgeslagen — geen dev-server gestart in deze wave-run, geen screenshots-map aanwezig.

### Static analyse

#### ✅ Geslaagd
- **Antwoordmodel-correctheid (data-viewer-verplicht, alle vragen nagerekend):**
  - q1: 120+85+35+160+18+95 = **513** — komt overeen met `correctAnswer: 513` (`spreadsheet-specialist.ts:49`). ✓
  - q2: Subsidie 500+200=700 vs Verkoop 42+230=272 — Subsidie is aantoonbaar hoogst, komt overeen met `correctAnswer: 'Subsidie'` (`:60`). ✓
  - q3 (tekst): explanation claimt gemiddelde uitgave 513÷6 = 85,50 — rekenkundig correct (6 uitgave-rijen). ✓
  - q4: chartData `Evenement: 460` — som van Evenement-uitgaven (120+85+160+95=460) klopt exact met dataset 1 (`:93`). ✓
  - q4: chartData `Materiaal: 53` — som van Materiaal-uitgaven (35+18=53) klopt exact (`:94`). ✓
  - q5: 460−53 = **407** — komt overeen met `correctAnswer: 407` (`:114`). ✓
  - **Downstream-check:** q4/q5 bouwen beide op dezelfde chartData-waarden (460, 53); geen van beide vragen introduceert een tegenstrijdige afgeleide waarde. Geen keten-breuk gevonden (in tegenstelling tot wave-13-les).
- **Puntensom vs maxScore:** 20+15+10 (ds1) + 10+15+10 (ds2) + 15+5 (ds3) = **100**, `maxScore: 100` (`:192`) — exact gelijk, geen tekort/overschot.
- **Criterium A3 (TypeScript-discipline):** geen `any`, geen `@ts-ignore` in de config; typed via `DataViewerConfig` import (`:1`).

#### ⚠️ Aandachtspunten
- **q3-vraagformulering vs verwacht antwoord** — `spreadsheet-specialist.ts:66-73`
  - **Wat:** de vraag vraagt "Welke formule gebruik je om het gemiddelde bedrag per uitgave te berekenen?" maar `type: 'text-observation'` met `correctAnswer: ''` — er is geen scorebare correctheidscheck, engine kent participatiepunten toe (bekend data-viewer-gat, niet herhalen).
  - **Waarom:** puur informatief, geen actie nodig — bevestiging dat puntensom klopt (10 punten voor text-observation zijn participatiepunten, meegenomen in bovenstaande som).
  - **Voorstel:** geen actie (bekend engine-patroon).

### ❌ Blocking issues
- **Ontbrekend briefing-asset** — `src/config/agents/year2.tsx:101`
  - **Wat:** `briefingImage: '/assets/agents/spreadsheet-specialist.webp'` verwijst naar een bestand dat niet bestaat in `public/assets/agents/` (bevestigd met `ls`: "No such file or directory").
  - **Risico:** de missie-briefing-kaart toont een broken image of lege placeholder aan elke leerling die deze missie start — eerste indruk kapot, mogelijk ook een console 404 tijdens dynamic runtime (niet dynamisch geverifieerd deze wave).
  - **Voorstel:**

```ts
// ❌ Huidig — src/config/agents/year2.tsx:101
briefingImage: '/assets/agents/spreadsheet-specialist.webp',

// ✅ Voorgesteld (twee opties, kies op basis van wat beschikbaar is)
// Optie A: asset toevoegen aan public/assets/agents/spreadsheet-specialist.webp (matcht bestaand naampatroon)
// Optie B: als geen asset geproduceerd kan worden, tijdelijk verwijzen naar een bestaand fallback-icoon/emoji-pattern zoals andere agent-rollen zonder custom art gebruiken (grep vergelijkbare rollen in year2.tsx voor het fallback-patroon)
```

### Dynamic verificatie (indien uitgevoerd)
N.v.t. — niet uitgevoerd deze wave (geen dev-server, geen screenshots-map).

### Score
Static: 3/4 toepasselijke criteria geslaagd (1 blocking) · Dynamic: n.v.t. · Aanbeveling: kritieke fix vereist (asset)

---

## Samenvatting & Voorstel-blokken

### Voorstel 1 — Ontbrekend briefing-asset (BLOCKING)
**Axis:** tech (met design-impact)
**File:** `src/config/agents/year2.tsx:101`
**Before:**
```ts
briefingImage: '/assets/agents/spreadsheet-specialist.webp',
```
**After:**
```ts
// Zie Tech review "Blocking issues" — asset produceren of fallback-patroon toepassen
```
**Downstream-check:** dit veld wordt alleen gebruikt in de missie-briefing-kaart (agent-rol selectie-scherm); geen andere config leest dit pad. Geen keten-effect op data-viewer-vragen/scores.

### Voorstel 2 — Identieke gradient-stops (klein, niet-blocking)
**Axis:** design
**File:** `src/config/agents/year2.tsx:105`
**Before:**
```tsx
<div className="w-full h-full bg-gradient-to-br from-lab-teal to-lab-teal flex items-center justify-center">
```
**After:**
```tsx
<div className="w-full h-full bg-gradient-to-br from-lab-teal to-lab-secondary flex items-center justify-center">
```
**Downstream-check:** puur visueel, geen data/score-afhankelijkheid.

---

## Eindoordeel

Data-correctheid is volledig geverifieerd en klopt exact (alle formules, chartData-sommen, en puntensom). Didactisch sterk (SLO-fit, Bloom-mix, beknoptheid). Eén blocking tech-issue (ontbrekend briefing-asset) houdt deze missie tegen van een directe "ship"-status.
