# Missie-review: Neural Navigator (`neural-navigator`)

**Datum:** 2026-07-02 · **Wave:** 13 (verse review) · **Template:** `data-viewer`
**Curriculum:** Leerjaar 3, Week 1 (havo/vwo) · **SLO:** 21D (AI), 22B (Data)

**Config:** `src/features/missions/templates/data-viewer/configs/neural-navigator.ts`
**Agent-rol:** `src/config/agents/year3.tsx:178-200` (geen chat — `templateRegistry.ts:76` heeft geen `enableChat`/`chatRoleId`, dus geen dormante-chat-issue)
**Visueel bewijs:** geen bestaande screenshots-map (`.ui-review/` bevat geen `neural-navigator`-resultaten); geen vermelding in `docs/audits/student-missions-ui-ux-review-2026-06-30.md` — dynamische verificatie overgeslagen, statisch oordeel op basis van config + rekenkundige verificatie tegen de dataset.
**Intro-registratie (post-#186 unificatie):** `IntroScreen` (shared) wordt correct aangeroepen via `DataViewer.tsx:611-620` met `missionId`, `goal` en `features`; `getMissionMeta()` leidt topicLabel/leerjaar generiek af uit de SLO-mapping (die neural-navigator al bevat) — geen missie-specifieke registratie nodig, geen "light-touch"-gat gevonden.

---

## 🎨 Design review

**Mission:** neural-navigator (data-viewer)
**Reviewer:** dgskills-design-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (Tailwind tokens):** config bevat geen hardcoded hex voor UI-chrome — enige hex-literals zijn badge-kleuren (`#ff3c21`, `#202023`) en bar-chart-kleuren, het bekende, al-geëscaleerde badge-/chart-kleurpatroon (niet opnieuw rapporteren) — `configs/neural-navigator.ts:81-86,193,199,205,211`
- **Criterium 2 (Layout consistentie):** gebruikt hetzelfde `DataViewerConfig`-schema (datasets/badges/takeaways) als de overige 9 data-viewer-missies — geen structurele afwijking; drie datasettypen (table, bar-chart, document-cards) zorgen voor visuele afwisseling binnen één missie
- **Criterium 4 (Copy-lengte):** introDescription 62 woorden, dataset-beschrijvingen 15-25 woorden — binnen leerjaar 3-grenzen
- **Criterium 6 (Framer Motion):** geen missie-specifieke animatie-code in de config (animaties zitten in de gedeelde engine — buiten scope)

### ⚠️ Aandachtspunten
- **Visual Precision Gate — unverified**: geen Chrome-plugin bewijs beschikbaar voor deze missie specifiek. Bekend, al-geëscaleerd engine-breed risico dat óók hier kan spelen: data-viewer a11y-set + hex-tokenisatie (engine-lijst, niet opnieuw als missie-issue rapporteren).
  - **Voorstel:** meenemen in een volgende Fase B-sweep zodra een dev-server draait; geen actie nu.

### ❌ Blocking issues
_geen_

### Score
4/4 statisch-verifieerbare criteria geslaagd (Visual Precision Gate = unverified, niet fail) · Aanbeveling: **ship**

---

## 📚 Didactiek review

**Mission:** neural-navigator (data-viewer)
**Curriculum-plek:** Leerjaar 3, Week 1 (havo/vwo)
**SLO-claim:** 21D (AI), 22B (Data)
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (SLO-codes correct):** 21D en 22B zijn geldige VO-codes — `src/config/slo-kerndoelen-mapping.ts:156`
- **Criterium 2 (SLO-fit):** 21D (AI) wordt sterk geraakt — de hele missie draait om het van-binnenuit begrijpen van een neuraal netwerk (forward pass, gewichten, backpropagatie). 22B (Data) via het narekenen en interpreteren van numerieke datasets (neuron-tabel, trainingsresultaten) — `configs/neural-navigator.ts:16-183`
- **Criterium 3 (Leerdoelen helder):** `missionGoals.ts:762-769` bevat een expliciet, meetbaar `primaryGoal` ("Ik bereken een forward pass... en leg uit hoe lagen, gewichten en backpropagatie werken") met concreet `evidence`-criterium
- **Criterium 6 (Curriculum-plek):** leerjaar 3, havo/vwo-only (`educationLevels: ['havo','vwo']`), passend bij de conceptuele zwaarte (backpropagatie is abstracter dan eerdere-leerjaar AI-missies)
- **Criterium 7 (Bloom-balans):** goede mix — dataset 1 = berekenen/toepassen (q1 rekenen, q2 vergelijken), dataset 2 = interpreteren/verklaren waarom (q4-q6, incl. "leg uit hoe backpropagation werkt" als synthese-vraag), dataset 3 = classificeren/toepassen op nieuwe context (q7 generaliseren, q8 eigen voorbeeld bedenken). Drie text-observation-reflectievragen (q3, q6, q8) stimuleren eigen formulering boven aanvinken.
- **Criterium 9 (Welzijn & inclusiviteit):** neutraal technisch onderwerp, geen gevoelige categorieën, geen risico's.

### ⚠️ Aandachtspunten
- **Rekenfout in brondata ondermijnt het "reken zelf na"-doel:** de tabel in dataset 1 toont voor Neuron A output `0.69` en Neuron C output `0.81`, maar de missie legt zelf de formule uit: `output = (input1 × gewicht1) + (input2 × gewicht2) + bias`. Narekenen geeft Neuron A = `0.68` (tabel toont 0.69, verschil 0.01) en Neuron C = `1.01` (tabel toont 0.81, verschil 0.20 — significant). De missie-intro belooft expliciet "Reken zelf een forward pass door een neuraal netwerk" als kernactiviteit; een leerling die dat letterlijk doet op Neuron A of C botst op tabeldata die niet bij de eigen formule van de missie past.
  - **Impact op scoring:** geen — q1 vraagt alleen naar Neuron B (correct: 0.48) en q2 vraagt naar de hoogste output; Neuron D blijft met de foute C-waarde (0.81 i.p.v. 0.84) toevallig nog steeds de hoogste, dus geen leerling wordt onterecht fout gerekend. Het is een content-integriteitsprobleem, geen scoring-bug.
  - **Voorstel:** zie Voorstel-blok 1 hieronder (tech-sectie) — corrigeer de tabelwaarden voor Neuron A en Neuron C zodat ze kloppen met de eigen formule van de missie.

### ❌ Blocking issues
_geen_ (didactisch storend, maar niet leerdoel-blokkerend — q1/q2 blijven correct beantwoordbaar)

### SLO-fit oordeel
- **21D (AI):** sterk geraakt — kernonderwerp van alle drie datasets, met correcte AI-concepten (forward pass, gewichten, bias, activatiefuncties, backpropagatie)
- **22B (Data):** matig-sterk geraakt — narekenen en interpreteren van numerieke tabellen/grafieken, enigszins verzwakt door de foutieve brondata in dataset 1

### Score
6/7 relevante criteria volledig geslaagd (rekenfout in brondata is een content-defect, geen SLO- of Bloom-gat) · Bloom-balans: **medium-hoog** · Aanbeveling: **fix-then-ship**

---

## 🔧 Tech review

**Mission:** neural-navigator (data-viewer)
**Reviewer:** dgskills-tech-reviewer (Sonnet)
**Dynamic verificatie:** overgeslagen — geen dev-server gestart, geen bestaande screenshots, geen vermelding in het 30-juni-auditrapport

### Static analyse

#### ✅ Geslaagd
- **Criterium A3 (TypeScript-discipline):** geen `any`, geen `@ts-ignore`, config volledig getypeerd via `DataViewerConfig` — `configs/neural-navigator.ts:1-3`
- **Criterium A4 (Imports via alias):** enige import is `DataViewerConfig` via relatief pad `'../DataViewer'`, consistent met zustermissies binnen de configs-submap
- **Criterium A6 (Restart-safe state):** config zelf bevat geen state-logica — state/autosave via de gedeelde `DataViewer.tsx` (engine-verantwoordelijkheid)
- **Criterium A7 (Security):** geen user-input naar een AI-model (multiple-choice/number-input/text-observation lokaal gescoord), geen sanitization-risico op missie-niveau
- **Antwoordmodel-verificatie (VERPLICHT voor data-viewer):**
  - q1 (Neuron B, number-input): berekend `0.48`, `correctAnswer: 0.48` — **correct**
  - q2 (hoogste output, multiple-choice): dataset-max is Neuron D (0.84), `correctAnswer: 'Neuron D'` — **correct**
  - q4 (kans na training, number-input): chartData `Cijfer 3 (na) = 0.87`, `correctAnswer: 0.87` — **correct**
  - q5 (waarom verwarring vóór training, multiple-choice): kwalitatief correct, geen rekenfout mogelijk
  - q7 (aantal output-neuronen, number-input): 5 bloemsoorten → 5 klassen, `correctAnswer: 5` — **correct**
  - explanation bij q4 claimt "75 procentpunt zekerder" — geverifieerd: `0.87 - 0.12 = 0.75` → **correct**
  - text-observation q3/q6/q8: geen `correctAnswer` nodig (altijd participatiepunten via engine-logica `if (q.type === 'text-observation') return q.points`) — conform patroon

#### ⚠️ Aandachtspunten
- **Tabelwaarden Neuron A en Neuron C kloppen niet met de eigen formule van de missie** (zie ook didactiek-sectie). Geverifieerd met exacte decimale rekening (geen float-afronding):
  - Neuron A: `(0.8×0.5) + (0.6×0.3) + 0.1 = 0.68` — tabel toont `0.69`
  - Neuron C: `(0.5×0.9) + (0.9×0.4) + 0.2 = 1.01` — tabel toont `0.81`
  - **Voorstel:** zie Voorstel-blok 1.
- **Puntensom ≠ maxScore:** dataset 1 (20+10+10=40) + dataset 2 (15+10+10=35) + dataset 3 (15+0=15) = **90**, terwijl `maxScore: 100`. Oorzaak: q8 (text-observation, "noem een toepassing die je dagelijks gebruikt") heeft `points: 0`, terwijl de twee andere text-observation-vragen in dezelfde missie (q3, q6) wél 10 punten hebben — en de engine geeft text-observation-vragen sowieso altijd volle punten bij een ingevulde reflectie. Dit is het bekende puntensom-patroon, en hier is de oorzaak ondubbelzinnig: een participatiepunten-vraag met `points: 0` naast twee identieke vraagtypes met `points: 10`. Fixbaar zonder interpretatie-risico.
  - **Voorstel:** zie Voorstel-blok 2.

#### ❌ Blocking issues
_geen_

### Dynamic verificatie
Niet uitgevoerd — geen dev-server actief, geen bestaande screenshots, geen vermelding in het 30-juni-auditrapport. Aanbeveling: meenemen in een gerichte Fase B-sweep.

### Score
Static: 4/6 relevante criteria volledig geslaagd (2 content-defecten, beide mechanisch fixbaar, geen van beide is een scoring-bug) · Dynamic: n.v.t. · Aanbeveling: **fix-then-ship**

---

## Voorstel-blokken

### Voorstel 1 — Tabelwaarden Neuron A en Neuron C corrigeren

**Bestand:** `src/features/missions/templates/data-viewer/configs/neural-navigator.ts`
**Regels:** 34, 36

**Voor:**
```ts
{ neuron: 'Neuron A', input1: 0.8, gewicht1: 0.5, input2: 0.6, gewicht2: 0.3, bias: 0.1, output: 0.69 },
{ neuron: 'Neuron B', input1: 1.0, gewicht1: 0.2, input2: 0.4, gewicht2: 0.7, bias: 0.0, output: 0.48 },
{ neuron: 'Neuron C', input1: 0.5, gewicht1: 0.9, input2: 0.9, gewicht2: 0.4, bias: 0.2, output: 0.81 },
```

**Na:**
```ts
{ neuron: 'Neuron A', input1: 0.8, gewicht1: 0.5, input2: 0.6, gewicht2: 0.3, bias: 0.1, output: 0.68 },
{ neuron: 'Neuron B', input1: 1.0, gewicht1: 0.2, input2: 0.4, gewicht2: 0.7, bias: 0.0, output: 0.48 },
{ neuron: 'Neuron C', input1: 0.5, gewicht1: 0.9, input2: 0.9, gewicht2: 0.4, bias: 0.2, output: 1.01 },
```

**Reden:** `output = (input1 × gewicht1) + (input2 × gewicht2) + bias` (de formule die de missie zelf uitlegt) geeft voor Neuron A `0.68` en Neuron C `1.01`, niet `0.69`/`0.81`. Neuron D (`0.84`, ongewijzigd) blijft de hoogste output, dus q2's antwoordmodel (`correctAnswer: 'Neuron D'`) blijft correct na deze fix.

---

### Voorstel 2 — Puntensom naar 100 sluiten via q8

**Bestand:** `src/features/missions/templates/data-viewer/configs/neural-navigator.ts`
**Regel:** 180

**Voor:**
```ts
                    explanation:
                        'Goede voorbeelden: gezichtsontgrendeling van je telefoon (input: pixelwaarden, output: jij/niet jij), TikTok aanbevelingsalgoritme (input: kijkgedrag en likes, output: kans dat je een video leuk vindt), autocorrectie (input: getypte letters, output: waarschijnlijkste woord). Neurale netwerken zitten overal in moderne apps.',
                    points: 0,
```

**Na:**
```ts
                    explanation:
                        'Goede voorbeelden: gezichtsontgrendeling van je telefoon (input: pixelwaarden, output: jij/niet jij), TikTok aanbevelingsalgoritme (input: kijkgedrag en likes, output: kans dat je een video leuk vindt), autocorrectie (input: getypte letters, output: waarschijnlijkste woord). Neurale netwerken zitten overal in moderne apps.',
                    points: 10,
```

**Reden:** q3 en q6 zijn ook text-observation-vragen in deze missie en hebben beide `points: 10`; q8 wijkt daar zonder aanwijsbare reden van af met `points: 0`. Met `points: 10` sluit de puntensom (40+35+25=100) exact op `maxScore: 100`, en wordt q8 consistent behandeld met de andere twee reflectievragen.

---

## Samenvatting

| As | Score | Verdict |
|---|---|---|
| 🎨 Design | 8/10 | ship (visueel bewijs ontbreekt, config zelf schoon) |
| 📚 Didactiek | 7/10 | fix-then-ship (rekenfout in brondata ondermijnt het "reken zelf na"-doel) |
| 🔧 Tech | 8/10 | fix-then-ship (2 mechanisch fixbare content-defecten, geen scoring-bug) |

**Triage-score:** (10-8)×0.3 + (10-7)×0.4 + (10-8)×0.3 = 0.6 + 1.2 + 0.6 = **2.4**

**Eindverdict: fix-then-ship** — geen blocking issues, geen leerling wordt onterecht fout gerekend (q1/q2 blijven correct met of zonder de fix). Maar de tabelfout in Neuron A/C raakt de kernbelofte van de missie ("reken zelf na") en is ondubbelzinnig fixbaar (twee Voorstel-blokken, beide mechanisch, geen interpretatie-risico). Aanbevolen vóór livegang toe te passen.

### Auto-fixable issues
Beide bevindingen (Voorstel 1: tabelwaarden Neuron A/C; Voorstel 2: q8-punten 0→10) zijn mechanisch fixbaar binnen missie-scope zonder architectuurkeuze — geschikt voor een M3 autonome fix-loop.
