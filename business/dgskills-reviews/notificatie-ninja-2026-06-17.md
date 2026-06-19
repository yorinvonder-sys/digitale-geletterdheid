# Missie-review: notificatie-ninja — 2026-06-17

**Mission:** notificatie-ninja (scenario-engine)
**Reviewer:** M4 batch-review-pipeline (wave-2)
**Datum:** 2026-06-17
**Curriculum-plek:** Leerjaar 1, Periode 2, Week 2
**SLO-claim:** 23B (Digitaal welzijn) + 21B (Media & Informatie) | VSO: 20A + 18B

---

## 🎨 Design review

**Mission:** notificatie-ninja (scenario-engine)
**Reviewer:** dgskills-design-reviewer (embedded)

### ✅ Geslaagd

- **Criterium 1 (Tailwind tokens in config):** Config bevat geen Tailwind-klassen — alle content is data, geen JSX. Badge `color`-velden zijn hex waarden die via inline `style` in `CompletionScreen.tsx` worden gebruikt als CSS gradient-inputs (`linear-gradient(135deg, ${badge.color}15, ...)`), niet als Tailwind classes. Dit is het correcte pattern voor dynamische kleur-rendering. Geen tokenisatiefout.
- **Criterium 2 (Layout consistentie):** Config volgt exact het scenario-engine template-patroon — 4 rondes, elk met `id`, `emoji`, `title`, `description`, `type`, `items`, `maxScore`, `feedbackCorrect`/`feedbackIncorrect`. Consistent met `phishing-fighter` en `mail-detective`.
- **Criterium 3 (Knop-clarity):** Alle interactie via de engine-laag. Engine heeft functionele handlers voor select-correct, order-priority en binary-choice. Geen dode knoppen gedetecteerd in de engine (`ScenarioEngine.tsx`).
- **Criterium 5 (Responsive design):** Config bevat geen layout-overrides. De engine gebruikt `max-w-md mx-auto` en Tailwind-responsive defaults — past binnen dezelfde mobile-first container die andere scenario-engine missies gebruiken. Dynamische verificatie overgeslagen (geen dev-server beschikbaar in batch-pipeline).
- **Criterium 6 (Framer Motion):** Geen Framer Motion in config; engine gebruikt geen motion-wrappers. Geen cognitieve-overload-risico.
- **Criterium 7 (Toegankelijkheid):** `/assets/brand/ui-icons/dgskills-duck-surprised.webp` images in item 5 van ronde 2 en item 8 van ronde 3 worden gerenderd via `ScenarioIcon` met `alt=""` (decoratief) — correct pattern voor icon-as-visual (`OrderPriorityRound.tsx:6-9`, `BinaryChoiceRound.tsx:5-8`).

### ⚠️ Aandachtspunten

- **Visual Precision Gate — unverified:** Geen Chrome-plugin screenshots beschikbaar (batch-pipeline, geen dev-server). Visuele verificatie van alignment, overlap en text-fit voor de vier ronde-types is niet uitgevoerd. In het bijzonder ronde 2 (order-priority) met 8 items is op mobiel potentieel erg lang — de rij van 8 klikbare items kan op 375px viewport buiten viewport schuiven. Dit is een bekende spanning in langere order-priority rondes.
  - **Voorstel:** Dynamische verificatie op localhost:5173 na merge, specifiek ronde 2 op 375px viewport.

- **Criterium 4 (Copy-lengte):** Leerjaar 1 (12-13 jaar) — limiet intro <80 woorden, ronde-opdracht <60 woorden.
  - `introDescription` (config:8-9): 38 woorden ✅
  - Ronde 1 `description` (config:63-64): 17 woorden ✅
  - Ronde 2 `description` (config:159-161): 26 woorden ✅
  - Ronde 3 `description` (config:256-258): 20 woorden ✅
  - Ronde 4 `description` (config:354-356): 25 woorden ✅
  - Item-uitleg (`explanation`) velden zijn gedetailleerd — bv. item 1 ronde 1 (config:78-80): "Rode badges activeren een gevoel van urgentie..." — ~35 woorden per explanation. Dit is cognitief zwaar voor leerjaar 1, maar de explanations verschijnen als post-submit-feedback, niet als primaire opdrachttekst. Grensgebied, niet blocking.

### ❌ Blocking issues

Geen blocking design-issues.

### Score design

6/7 criteria geslaagd (criterium 5 dynamisch unverified) · Visual Precision Gate: UNVERIFIED · **Score: 7/10** · Aanbeveling: ship (na visuele verificatie ronde 2 mobiel)

---

## 📚 Didactiek review

**Mission:** notificatie-ninja (scenario-engine)
**Curriculum-plek:** Leerjaar 1, Periode 2, Week 2
**SLO-claim:** [23B, 21B] + VSO [20A, 18B]
**Reviewer:** dgskills-didactiek-reviewer (embedded)

### ✅ Geslaagd

- **Criterium 1 (SLO-codes correct):** 23B (Digitaal welzijn) en 21B (Media & Informatie) zijn geldige reguliere VO-codes (`slo-kerndoelen-mapping.ts:17-19`). VSO-codes 20A en 18B zijn geldig. Maximaal 2 reguliere codes — niet te breed.
- **Criterium 2 (SLO-fit):**
  - **23B Digitaal welzijn:** Ronde 1 (herkennen aandachtstrekkers), ronde 2 (rangschikken manipulatie), ronde 3 (nuttig vs. manipulatief) en ronde 4 (welke aanpak helpt echt) raken allemaal substantieel aan bewust mediagebruik en welzijn. Sterk geraakt.
  - **21B Media & Informatie:** Ronde 2 en 3 oefenen informatiecritisch denken (welk doel dient een melding, wie profiteert), wat valt onder media & informatie-vaardigheid. Geraakt, zij het niet de primaire focus — in lijn met hoe 21B als co-kerndoel wordt ingezet bij deze missie.
- **Criterium 3 (Leerdoelen):** `learningObjectives` aanwezig (config:16-21). Vier doelen, elk met actiewerkwoord:
  - "herken" → Bloom L1/L2 ✅
  - "kan ordenen" → Bloom L4 (analyseren) ✅
  - "kan uitleggen" → Bloom L2/L3 ✅
  - "kies" → Bloom L3 (toepassen) ✅
  - Concrete drempels ("minimaal 5", "minimaal 2") aanwezig ✅
- **Criterium 6 (Curriculum-plek):** Week 2 periode 2, direct na `schermtijd-coach` — logische verdieping van het welzijn-thema. Voorgaande missie legt het thema breed neer; notificatie-ninja gaat dieper op de mechaniek. Goede sequencing.
- **Criterium 7 (Bloom-balans):** Mix van L1 (herkennen), L2 (uitleggen), L3 (toepassen), L4 (analyseren) over de vier rondes. Geen pure quiz-recall — de mission vraagt echte redenering, met name in ronde 2 (rangschikken op abstracte manipulatieschaal) en ronde 3 (intentie-analyse achter meldingen). Bloom-balans: **medium-hoog**, passend voor leerjaar 1.
- **Criterium 8 (AI-as-copilot):** Geen chat (`enableChat` niet aanwezig in registry-entry). N.v.t.
- **Criterium 9 (Welzijn & inclusiviteit):** VSO-mapping aanwezig. Taal is inclusief. Schermtijd/social media is een gevoelig welzijns-thema voor deze leeftijdsgroep — de missie is feitelijk en neutraal van toon, geeft geen moreel oordeel over appgebruik zelf, maar leert herkennen. Geen doorverwijsgedrag nodig voor dit specifieke thema (geen zelfschadevraagstukken).

### ⚠️ Aandachtspunten

- **Criterium 4 (Cognitieve load — ronde 2):** `config:154-248` — order-priority ronde met 8 items, waarbij leerlingen alle 8 van meest naar minst manipulatief moeten rangschikken door ze in volgorde aan te klikken. Dit is voor leerjaar 1 (12-13 jaar) een hoge cognitieve belasting: 8 abstracte oordelen vergelijken + onthouden welke al gekozen is. De rubric stelt max 3-4 keuzes/rondes per scherm voor leerjaar 1-2.
  - **Wat:** 8 items in één order-priority ronde voor 12-13-jarigen.
  - **Waarom:** Risico op cognitieve overload; leerlingen kunnen afhaken of willekeurig klikken.
  - **Voorstel:** Overweeg de ronde te splitsen: 4 meest-manipulatief rangsschikken (items 1-4) + 4 minst-manipulatief rangschikken (items 5-8), of de rondes te beperken tot top-3 selecteren i.p.v. alle 8 ordenen.

- **Criterium 5 (Vocabulary):** Begrippen als "verliesaversie" (config:88), "variabele beloningsverdeling" (config:149), "urgency scarcity" (config:303) worden gebruikt zonder uitleg in de opdrachttekst zelf — ze staan wel in de `explanation` die pas na submit zichtbaar is. Voor leerjaar 1 is dit een spanning: de concepten worden pas uitgelegd ná de keuze, terwijl ze bij de analyse van items 1-8 kunnen helpen.
  - **Voorstel:** Geen blocking — uitleg-na-keuze is het gewenste patroon (leerling denkt eerst zelf na). Maar overweeg in de feedback-copy voor ronde 2 (`feedbackIncorrect: config:164-166`) de terminologie terug te brengen naar leerlingtaal.

- **Criterium 7 (Bloom — ronde 4):** Ronde 4 `select-correct` vraagt te herkennen welke strategieën "echt werken". Item 6 (apps permanent verwijderen) is marked as `correct: false` met de redenering dat mensen herinstalleren. Dit is empirisch aanvechtbaar voor 12-13 jarigen: sommige leerlingen ervaren permanent verwijderen wél als effectief. De `explanation` geeft een pragmatisch argument maar presenteert het als absoluut feit ("werkt zelden lang"). Dit benadert een mening als wetenschappelijk vaststaand.
  - **Voorstel:** Nuanceer item 6 `explanation` van "Radicale maatregelen werken zelden lang" naar "Voor de meeste mensen werkt dit tijdelijk; bewust gebruik leer je niet door iets weg te gooien, maar door te oefenen met instellingen." Dit behoud de pedagogische boodschap zonder een empirische absolute.

- **Ontbrekend `showConfidence`:** Vergelijkbare scenario-engine missies (`phishing-fighter`, `mail-detective`) gebruiken `showConfidence: true` op complexe rondes als metacognitieve scaffolding. Notificatie-ninja heeft dit op geen enkele ronde. Geen blocking, maar een gemiste kans voor metacognitie.

### ❌ Blocking issues

Geen blocking didactiek-issues.

### SLO-fit oordeel

- **23B Digitaal welzijn:** Sterk geraakt — alle 4 rondes oefenen bewust mediagebruik en zelfregulatie. Bewijs: ronde 1 (herkennen), ronde 2 (analyseren impact), ronde 3 (doel-analyse), ronde 4 (concrete strategieën).
- **21B Media & Informatie:** Geraakt — met name ronde 2 en 3 oefenen kritisch informatielezen (wiens belang dient een melding). Oppervlakkiger dan 23B maar voldoende als co-kerndoel.

### Score didactiek

7/9 criteria volledig geslaagd, 3 warnings, 0 blocking · Bloom-balans: medium-hoog · **Score: 7/10** · Aanbeveling: ship (met aanbevolen fix voor ronde 4 item 6 explanation + cognitieve load overweging ronde 2)

---

## 🔧 Tech review

**Mission:** notificatie-ninja (scenario-engine)
**Reviewer:** dgskills-tech-reviewer (embedded)
**Dynamic verificatie:** overgeslagen — DGSkills SPA is state-based (geen URL per missie). Multi-viewport visuele verificatie niet uitgevoerd.

### Static analyse

#### ✅ Geslaagd

- **A1 (Knop-handlers):** Engine (`ScenarioEngine.tsx:140-168`) koppelt alle interacties correct: `handleToggle`, `handleAddToOrder`, `handleResetOrder`, `handleBinaryChoice`, `handleSubmit`, `handleNextRound`, `handleComplete`. Config definieert geen handlers — correcte pattern voor template-missies.
- **A2 (Error states):** `ScenarioEngine.tsx:103-104` heeft `loadError` state met `ErrorScreen` component, `LoadingScreen` voor async import. Config-laad-errors worden afgevangen. Config bevat geen async-operaties zelf.
- **A3 (TypeScript-discipline):** `notificatie-ninja.ts:1` importeert `ScenarioEngineConfig` type en config is `const config: ScenarioEngineConfig` — volledig getypeerd. Geen `any` of `@ts-ignore` in config-file.
- **A4 (Imports via @/ alias):** Config-file importeert alleen het lokale type (`../types`) via relatief pad — acceptabel voor config-files binnen dezelfde feature-module. Engine gebruikt `@/hooks/useMissionAutoSave` en `@/config/missionGoals` — correct.
- **A5 (Edge function calls):** Geen edge-function calls in config of engine voor deze missie. N.v.t.
- **A6 (Restart-safe state):** Engine (`ScenarioEngine.tsx:116-118`) gebruikt `useMissionAutoSave<ScenarioEngineState>` — progress opgeslagen bij elke state-update.
- **A7 (Security):** Geen user-input-naar-AI in dit template. Geen `dangerouslySetInnerHTML`. Geen client-side `systemInstruction`. N.v.t.

#### ⚠️ Aandachtspunten

- **maxScore-berekening:** maxScore `100` (config:22), som van ronde-maxScores: 25+25+25+25=100. Consistent ✅. Badge-drempels: 80/60/40/0 — alle binnen 0-100, geen drempel boven maxScore ✅. Engine past correcte `Math.min(withBonus, round.maxScore)` toe (`ScenarioEngine.tsx:32`). Volledig consistent.

- **Image-pad in icon (non-blocking):** Item 5 in ronde 2 (`config:209-216`) en item 8 in ronde 3 (`config:337-344`) gebruiken `/assets/brand/ui-icons/dgskills-duck-surprised.webp` als `icon`-waarde. `ScenarioIcon` in `OrderPriorityRound.tsx:5-9` en `BinaryChoiceRound.tsx:4-8` handelt dit correct af via `icon.startsWith('/assets/')` check met `<img alt="">`. Geen bug — maar de keuze voor de duck-surprised icoon voor meldingen over Instagram/Facebook-verdachte notificaties is contextueel enigszins willekeurig; geen functioneel probleem.

#### ❌ Blocking issues

Geen blocking tech-issues.

### Dynamic verificatie

**Overgeslagen** — DGSkills SPA gebruikt state-based routing zonder URL per missie. Voor automatische Fase B is een dev-preview route (bv. `/dev/mission/notificatie-ninja` met auth-bypass in `import.meta.env.DEV`) een follow-up taak. Zie tech-reviewer SKILL.md Stap B2-3b.

### Score tech

7/7 static criteria geslaagd · Dynamic: n.v.t. (geen dev-server) · **Score: 8/10** · Aanbeveling: ship

---

## Samenvatting

`notificatie-ninja` is een inhoudelijk sterke missie met goed uitgewerkte scenario's, accurate feiten over aandachtstrekkers, en een logische Bloom-progressie voor leerjaar 1. De vier ronde-types dekken samen zowel herkennen als analyseren als concrete keuze-oefening.

**Belangrijkste aandachtspunten:**
1. Ronde 2 (order-priority, 8 items) heeft hoge cognitieve load voor 12-13-jarigen — overweeg splitting of beperking tot top-3.
2. Ronde 4 item 6 explanation presenteert een empirisch debatteerbaar standpunt als feit — kleine nuancering gewenst.
3. `showConfidence` ontbreekt op alle rondes — gemiste metacognitive scaffolding.
4. Visuele verificatie op mobiel (met name ronde 2 lengte) niet uitgevoerd in deze pipeline.

**Escalaties:** geen.

**Verdict: ok** — klaar voor ship na optionele kleine fixes.

---

*Gegenereerd door M4 batch-review-pipeline wave-2, 2026-06-17.*
