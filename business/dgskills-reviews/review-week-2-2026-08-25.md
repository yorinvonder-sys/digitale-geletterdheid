# Review: review-week-2 ("De Code-Criticus")
**Datum:** 2026-08-25 · **templateType:** review-arena · **Leerjaar 1, week 3** (SLO 21D, 22B; VSO 18C)

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

---

## 🎨 Design review — 8/10

De config bevat alleen content (geen JSX/Tailwind-classes), dus de meeste UI-criteria vallen buiten scope van dit bestand en zijn al gedekt door de gedeelde engine-review.

- ✅ Badgekleuren (`#e1ff01`, `#202023`, `#ff3c21`) zijn letterlijke duck-tokens (duck-acid, duck-ink, duck-error) — consistent met andere review-arena-missies, geen afwijkende hex.
- ✅ Copy-lengte binnen grenzen voor leerjaar 1 (intro <80 woorden): `introDescription` is 33 woorden, alle ronde-`description`-velden <30 woorden.
- ⚠️ Geërfd van de engine (niet mission-specifiek, geen nieuwe bevinding hier): `DragSort.tsx:94` positienummer op `#ff3c21`+`text-duck-ink` en `text-duck-ink/70` op body-tekst raken ook de rondes van déze missie (`round-drag-sort` bevat 6 items met dat label-patroon).
- Geen dynamische viewport-verificatie uitgevoerd — geen dev-server beschikbaar in dit sweep-run. Statisch oordeel.

---

## 📚 Didactiek review — 8.5/10

- ✅ **SLO-fit:** 21D (AI) + 22B (Programmeren) worden allebei substantieel geraakt — categorize-ronde en match-pairs mengen AI-fouten (hallucinatie, stopsignaal) met programmeer-bugs (randdetectie, event listener, score-bug) één-op-één met beide kerndoelen.
- ✅ **Leerdoel** ("Ik herken AI- en programmeerfouten, koppel ze aan een oplossing en controleer mijn keuzes") heeft drie meetbare werkwoorden (herken, koppel, controleer) — geen vaag "begrijpt".
- ✅ **Bloom-balans:** drag-sort (ordenen/begrijpen) → match-pairs (koppelen/toepassen) → categorize (classificeren/analyseren, met transfer-vraag over bronnen controleren) → rapid-fire (herkennen, met transfer-vraag over randdetectie). De twee `followUp`-scenariovragen tillen de ronde boven kaal quiz-recall uit — goede opbouw voor leerjaar 1.
- ✅ Curriculum-plek logisch: week 3, na de missies die AI-content-generatie en game-opbouw introduceren (curriculum.ts) — deze missie test wat daarvoor is aangeleerd.
- ✅ Geen chat/agent-rol nodig (template zonder `enableChat`) — bewust, geen bevinding.
- ⚠️ `round-categorize` heeft 8 items verdeeld 4/4 over 2 categorieën — evenwichtig, dus de kans op giswinst is beperkter dan bij een scheve verdeling, maar het engine-gebrek hieronder (geen inhoudelijke poort) blijft van toepassing.

---

## 🔧 Tech review — 5/10

De config zelf bevat geen logica (geen handlers, geen `any`, geen edge-function-calls) — alle technische risico's komen uit de **gedeelde review-arena-engine**, die al apart is beoordeeld. Voor déze missie concreet van toepassing:

- 🔴 **Blocking (geërfd, `MatchPairs.tsx:168`):** `round-match-pairs` heeft 5 paren, maxScore 25. Eén foute koppelpoging + herladen bevriest de ronde op `scoreFor(1)` (≈19-20/25) zonder één juiste koppeling — exploiteerbaar in déze missie.
- 🔴 **Blocking (geërfd, `ReviewArena.tsx:521` / `CompletionScreen.tsx:157-160`):** deze missie heeft 4 rondes (`min: 4` in `missionGoal.criteria`) en een 40%-drempel voor "geslaagd". Een leerling die onder 40% van de 100 punten scoort, ziet een uitgeschakelde knop zonder terugweg — de missie loopt vast, precies bij de doelgroep die hulp nodig heeft.
- ⚠️ **Warning (geërfd, `DragSort.tsx:169` / `Categorize.tsx:332`):** `round-drag-sort` (6 items, geen gokcorrectie) en `round-categorize` (4/4-verdeling, geen inhoudelijke poort) geven allebei een niet-nul startscore bij willekeurig indienen.
- ⚠️ **Warning (geërfd, `RapidFire.tsx:148`):** timeout-afhandeling in de state-updater kan bij dubbele render twee resultaten voor één vraag geven — raakt de 8-vragen-ronde van deze missie.
- ✅ Config-niveau is verder correct: `correctPosition` 0-5 sequentieel zonder gaten/duplicaten, match-pairs-paren zijn 1-op-1 uniek, categorize-categorieën kloppen met de items, rapid-fire-antwoorden zijn balanced (4× waar, 4× onwaar).

Geen dynamische Fase B uitgevoerd (geen dev-server in dit sweep-run) — console/network-verificatie ontbreekt.

---

## Voorstellen

Alle onderstaande fixes zitten in de **gedeelde engine**, niet in `review-week-2.ts` — ze vallen buiten de auto-fix-whitelist voor deze missie en moeten als engine-taak worden opgepakt (raakt alle review-arena-missies, niet alleen deze).

**1. MatchPairs mid-ronde scoring (`MatchPairs.tsx`)**
```tsx
// voor: onSubmit wordt bij elke foute poging al aangeroepen
// (submit binnen de fout-afhandeling van een koppelpoging)
onSubmit(scoreFor(attempts));

// na: alleen bij definitieve indiening van de ronde submitten,
// niet bij elke tussentijdse foute klik
```

**2. CompletionScreen zonder terugweg bij <40%**
```tsx
// voor (ReviewArena.tsx:521)
<CompletionScreen onComplete={handleComplete} ... />

// na: geef expliciet een onRetry/terugweg mee zodat de knop
// nooit permanent disabled is zonder uitgang
<CompletionScreen onComplete={handleComplete} onRetry={handleRetryOrBack} ... />
```

Voor déze missie is er geen config-only fix mogelijk zolang deze twee engine-gebreken openstaan — het rapport bevat daarom geen `autoFixable`-items binnen de whitelist.

---

## Samenvatting & verdict

`review-week-2` is inhoudelijk en didactisch een sterke missie: heldere SLO-koppeling (21D+22B), goede Bloom-opbouw met transfer-vragen, en nette copy voor leerjaar 1. De blokkerende problemen zitten niet in de missie-config maar in de gedeelde review-arena-engine (MatchPairs mid-ronde scoring-exploit, en een dead-end CompletionScreen onder 40%) — beide raken déze missie concreet omdat ze een `match-pairs`-ronde en een 40%-drempel gebruiken.

**Verdict: fix-eerst** — niet vanwege de config, maar omdat de missie pas eerlijk en zonder doodlopers speelbaar is nadat de twee blocking engine-fixes zijn doorgevoerd (raakt alle review-arena-missies, dus één engine-fix lost dit voor de hele wave op).

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).
