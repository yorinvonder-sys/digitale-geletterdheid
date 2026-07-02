# Missie-review: Cookie Crusher (wave 18 — verse review)

**Mission ID:** cookie-crusher
**Template:** scenario-engine
**Config:** `src/features/missions/templates/scenario-engine/configs/cookie-crusher.ts`
**Curriculum-plek:** Leerjaar 1, Periode 3 — Digitaal Burgerschap
**SLO-claim:** `['23A', '23C']` regulier · `['18B', '20A']` VSO
**Datum:** 2026-07-02
**Reviewer-pipeline:** dgskills-batch-review wave 18

Vorige review: `cookie-crusher-2026-05-06.md` (M2, TypeScript-blocker toen opgelost). Dit is een verse review; platform-brede punten (dormante chat, briefing-assets, duck-tokens-scope) worden niet herhaald.

---

## Registratie-consistentie — ✅ compleet

- `templateRegistry.ts:11` → `scenario-engine`
- `agents/year1.tsx:2350` → agent-rol aanwezig
- `slo-kerndoelen-mapping.ts:72` → `23A`/`23C` regulier, `18B`/`20A` VSO
- `curriculum.ts:115` → leerjaar 1
- `missionGoals.ts:232` → primaryGoal + criteria + evidence
- `agentRoleIds.ts:29` + `types.ts:27` (RoleId-union) → beide bronnen bijgewerkt
- `ScenarioEngine.tsx:95` (VALID_SCENARIO_ENGINE_IDS) → aanwezig

Geen orphaned entries, geen ontbrekende bronnen.

---

## 🎨 Design review

### ✅ Geslaagd
- Layout/structuur consistent met engine-baseline (PhaseHeader → PhaseCard → rondecomponent → FeedbackBanner).
- Alle vier rondecomponenten volledig naar `duck-*` tokens gemigreerd (`SelectCorrectRound.tsx`, `OrderPriorityRound.tsx`, `BinaryChoiceRound.tsx`, `FeedbackBanner.tsx`) — geen missie-specifieke hex meer, ook `ScenarioEngine.tsx` zelf is duck-clean.
- Submit-knoppen in `SelectCorrectRound.tsx:116` en `BinaryChoiceRound.tsx:111` hebben nu een echte hover-state (`hover:brightness-95`) — de gradient-no-op-bug uit de mei-review is op deze twee knoppen gefixt.
- `OrderPriorityRound.tsx:38,101` en `BinaryChoiceRound.tsx:69,80` hebben nu `focus-visible:ring-*` — WCAG 2.4.7-punt uit mei is hier verholpen.
- Copy-lengte ruim binnen norm leerjaar 1 (intro 34 woorden, rondes 17-32 woorden).

### ⚠️ Aandachtspunten (platform-breed, niet missie-specifiek — resterend na deel-fix)
- **FeedbackBanner submit-knop hover is nog steeds no-op:** `from-duck-acid to-duck-acid hover:from-duck-acid hover:to-duck-acid` (zelfde kleur default/hover). — `sub/FeedbackBanner.tsx:76`. Dit is dezelfde bug als mei, nu met duck-tokens i.p.v. hex — de fix op de andere twee knoppen is niet doorgetrokken naar dit component.
- **FeedbackBanner + SelectCorrectRound submit-knop missen `focus-visible:ring-*`:** de twee gefixte componenten tonen dat het patroon bekend is; hier nog niet toegepast. — `sub/FeedbackBanner.tsx:74-80`, `sub/SelectCorrectRound.tsx:111-122`.

Deze twee punten raken de gedeelde `scenario-engine`-template en zijn dus geen cookie-crusher-only fix, maar cookie-crusher ervaart ze wel (submit-knop na elke ronde).

### Score
Design: **8/10**

---

## 📚 Didactiek review

### ✅ Geslaagd
- SLO-codes correct en binnen grens (2 codes ≤3): 23A (privacy/veiligheid) en 23C (maatschappij) regulier geldig, 18B/20A VSO geldig.
- Sterke Bloom-progressie: herkennen (ronde 1: 8 dark-pattern-cases) → prioriteren (ronde 2: rangschikken naar manipulatie-intensiteit) → toepassen (ronde 3: situationele afweging) → begrijpen-gevolgen (ronde 4: welke data staat op het spel).
- Feitelijk correct en actueel: AVG-eisen (pre-checked boxes verboden, weigeren even makkelijk als accepteren), "consent or pay"-model (ronde 3 item 4) correct als legitiem alternatief geframed, cross-site tracking / abandoned-cart-tracking / dwell-time correct beschreven.
- Leeftijds-passend vocabulaire; vaktermen ("dark patterns", "confirmshaming") worden in `explanation`-velden uitgelegd.
- Welzijn/handelingsperspectief: scenario 5 in ronde 3 (schoolplatform zonder weigeroptie) geeft concreet advies ("Meld dit aan je docent") i.p.v. alleen te constateren dat het fout is.

### ⚠️ Aandachtspunten (herhaald uit mei-review, nog niet opgepakt)
- **`learningObjectives` nog steeds leeg:** het optionele veld is sinds mei aan `ScenarioEngineConfig` toegevoegd (`types.ts:53`), maar `cookie-crusher.ts` vult het niet in. `introFeatures` blijven activiteitsomschrijvingen, geen toetsbare gedragsdoelen. — `cookie-crusher.ts:10-15`
  - **Voorstel:** voeg toe aan de config-export:
    ```ts
    learningObjectives: [
        'De leerling herkent minstens 5 van de 8 dark patterns in ronde 1 en kan ze benoemen.',
        'De leerling kan uitleggen waarom "geen weigerknop" ernstiger is dan een kleurcontrast-truc.',
        'De leerling beargumenteert per scenario in ronde 3 waarom accepteren of weigeren slim is, gekoppeld aan het type data.',
    ],
    ```
- **Ronde 3 description-spanning nog aanwezig:** de tekst belooft "niet altijd één goed antwoord" terwijl de engine binair evalueert (correct/incorrect per scenario). — `cookie-crusher.ts:220-221`
  - **Voorstel:**
    ```
    - description: 'Voor elk van deze scenario\'s: zou jij de cookies accepteren of weigeren? Er is niet altijd één goed antwoord — maar er is wel een slim antwoord.',
    + description: 'Voor elk van deze scenario\'s: kies de slimste optie en lees de uitleg — die legt uit waarom.',
    ```
- **23C blijft feitenkennis, geen maatschappijanalyse:** AVG-regels worden correct uitgelegd, maar het verdienmodel/de machtsverhouding achter tracking (wie verdient wat aan jouw data, welke partijen) komt niet aan bod als reflectievraag. — `cookie-crusher.ts:43-48`
  - **Voorstel:** kleine, niet-blokkerende toevoeging — een `takeaway` of korte reflectie-zin na ronde 2: "Wat verdient een website eigenlijk aan jouw data?"

Geen van deze drie is blocking; ze zijn niet-destructief en kunnen in een volgende contentronde meegenomen worden.

### Score
Didactiek: **8/10**

---

## 🔧 Tech review

### ✅ Geslaagd
- `maxScore`-som klopt exact: 4 rondes × 25 = 100 = `config.maxScore`.
- `scoreRound()` nagerekend voor alle 3 gebruikte rondetypen (`select-correct`, `order-priority`, `binary-choice` in `FeedbackBanner.tsx:4-39`) — generieke engine-formules, geen missie-specifieke afwijking, rekenkundig correct.
- Alle scenario-`correct`/`correctPosition`-velden zijn feitelijk verdedigbaar: dark-pattern-classificatie in ronde 1 klopt (pre-checked=verboden, drie-gelijke-knoppen=eerlijk, transparante uitleg=geen dark pattern), rangorde in ronde 2 is logisch consistent (geen-weigerknop > confirmshaming+countdown > kleurcontrast > herhaalde popup > eerlijke drie-knoppen), data-risico's in ronde 4 zijn technisch correct (cookies kunnen geen geboortedatum/privéberichten lezen die niet gegeven zijn — items 3 en 6 zijn terecht `correct: false`).
- `cookie-crusher` correct in `VALID_SCENARIO_ENGINE_IDS`-allowlist (`ScenarioEngine.tsx:95`) — geen orphaned/dode registratie.
- Geen AI-backend-call vanuit de scenario-engine zelf: geen prompt-injection-oppervlak, geen leerling-input naar een model.
- `useMissionAutoSave` correct via de gedeelde engine (restart-safe, geen missie-specifieke afwijking).
- Geen `dangerouslySetInnerHTML`, geen XSS-oppervlak.

### ⚠️ Aandachtspunten
- **`wrongFeedback` blijft ongebruikt:** het type ondersteunt per-item foutfeedback (`item.wrongFeedback`), maar geen enkel item in cookie-crusher.ts vult het in — valt terug op de generieke `explanation`. Niet fout, wel een gemiste kans op preciezere feedback bij een foute keuze. — `cookie-crusher.ts` (alle rondes)

### Chat-rol (platform-patroon, referentie)
- Client-side `systemInstruction` (`agents/year1.tsx:2375-2432`) en server-side `systemInstructions.ts:33` zijn inhoudelijk gelijk (zelfde 5 dark patterns, zelfde AVG-uitleg, zelfde scoring-beschrijving) — geen drift geconstateerd. Chat is dormant (geen `enableChat` in templateRegistry) — bekend platform-patroon, geen actie nodig.

### Score
Techniek: **9/10**

---

## Screenshots
Geen screenshots-map aangetroffen voor deze wave; niet gegrept in `docs/audits/student-missions-ui-ux-review-2026-06-30.md` (geen treffer voor `cookie-crusher` in dat rapport).

---

## Triage

| Rubric | Score (0-10, 10=uitstekend) |
|---|---|
| Design | 8 |
| Didactiek | 8 |
| Techniek | 9 |

`triageScore = (10-8)*0.3 + (10-8)*0.4 + (10-9)*0.3 = 0.6 + 0.8 + 0.3 = 1.7`

**Aanbeveling:** ship met aandachtspunten. Geen blocking issues. De drie didactiek-punten zijn identiek aan mei en nog niet opgepakt (niet-destructief, kunnen in een contentronde); de twee resterende design-punten (FeedbackBanner hover-no-op + focus-ring) zijn platform-breed en raken meerdere missies — geen missie-specifieke fix nodig hier.
