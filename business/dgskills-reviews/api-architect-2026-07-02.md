# Missie-review: API Architect

**Mission ID:** api-architect
**Template:** builder-canvas
**Curriculum-plek:** Leerjaar 3, Periode 1 (`curriculum.ts:255`)
**Datum:** 2026-07-02
**Reviewer-pipeline:** dgskills-mission-review v1.0 (wave 14, verse review)

---

## 🎨 Design review

**Score: 7.5/10**

### ✅ Geslaagd

- **Duck-tokens:** config zelf bevat geen kleur-tokens (tekst-only builder-canvas-content); engine (`BuilderCanvas.tsx` + subcomponenten) valt onder het platform-brede duck-token-systeem (bg/bgLight/ink/acid/gray/error) — geen missie-specifiek risico.
- **Badges gedifferentieerd:** 3 unieke kleuren (`#e1ff01`, `#202023`, `#ff3c21`) i.p.v. de veelvoorkomende "alle badges identiek"-smaak — betere visuele progressie dan gemiddeld. — `api-architect.ts:86-90`
- **Scoreplafond klopt exact:** `maxScore: 100` / 4 steps = 25pt/stap (`pointsPerStep = Math.floor(100/4)`), geen `reflectionQuestion`-bonus geconfigureerd → max haalbaar = 4×25 = 100. Geen frustrerende badge/score-gap.
- **`previewType: 'text-preview'` + `enableChat: true`:** standaard builder-canvas-combinatie, consistent met vergelijkbare missies in dit template.

### ⚠️ Aandachtspunten

- **`minTextLength` niet gezet op geen enkele stap (config-default fallback = 40 tekens):**
  - **Wat:** Alle 4 steps missen `minTextLength`, dus de engine-default van 40 tekens geldt (`BuilderCanvas.tsx:85`: `step.minTextLength ?? 40`). Voor stap 2 ("Ontwerp minimaal 6 endpoints met tabel: URL, methode, beschrijving, request-body, statuscodes") en stap 4 (documentatie van 2 endpoints met JSON-voorbeelden) is 40 tekens triviaal — een leerling kan de checklist aftikken met een tekst die veel korter is dan wat de instructie feitelijk vraagt, zolang de checklist-items zijn aangevinkt (checklist en tekstlengte zijn onafhankelijke AND-voorwaarden, geen inhoudelijke koppeling). — `api-architect.ts:36-50,68-81`
  - **Voorstel:** Zet `minTextLength: 200` voor `endpoints-ontwerpen` en `documentatie` (de twee stappen met tabel/JSON-verwachtingen), `minTextLength: 120` voor `authenticatie`. `api-basics` (uitleg-only) kan op de default blijven.

- **Visual Precision Gate — unverified:** geen screenshots-map beschikbaar deze pass (geen dev-server-run in scope). Geen missie-specifieke overlap/afkap-risico's zichtbaar in statische config; builder-canvas is een van de systeem-thema's uit de UI/UX-review van 2026-06-30 zonder api-architect-specifieke vermelding (mission niet genoemd in `docs/audits/student-missions-ui-ux-review-2026-06-30.md`).

### ❌ Blocking issues

Geen.

---

## 📚 Didactiek review

**Score: 5.5/10**
**SLO-claim:** 22A, 22B, 21A (`slo-kerndoelen-mapping.ts:155`)

### ✅ Geslaagd

- **Leeftijdspassend, vakinhoudelijk correct taalgebruik:** restaurant-analogie (API=ober) is een sterke, herkenbare metafoor voor 15-16 jarigen; Engelse termen consequent toegelicht bij eerste gebruik ("eindpunt (endpoint)"). — `api-architect.ts:26`, `year3.tsx:153-155`
- **AI-as-copilot:** systemInstruction bevat expliciete SCOPE GUARD die afdwaling naar implementatie/database's afkapt en terugstuurt naar ontwerp — voorkomt dat de coach de leerling voortrekt op stof buiten de missie. — `year3.tsx:144-146`
- **3-stappen-methode (erkenning/uitleg/challenge) aanwezig** in de eerste-bericht-structuur van de coach (analogie → korte uitleg → concrete vraag). — `year3.tsx:148-156`
- **Bloom-spreiding beter dan gemiddeld:** stap 1 = Bloom 2 (uitleggen), stap 2 = Bloom 3-4 (ontwerpen van 6 endpoints met afwegingen), stap 3 = Bloom 3 (toepassen van authenticatie-concept op eigen ontwerp), stap 4 = Bloom 3 (documentatie schrijven vereist synthese). Geen Bloom-1-only stappen.
- **`introFeatures` dekt daadwerkelijk de 4 steps** (API begrijpen / endpoints ontwerpen / documentatie / authenticatie) — geen UI-claim die niet wordt geleverd.

### ⚠️ Aandachtspunten

- **SLO-codes inconsistent over drie bronnen (feitelijk risico, geen bekend platform-patroon):**
  - **Wat:** `slo-kerndoelen-mapping.ts:155` claimt `['22A', '22B', '21A']`. De systemInstruction in `year3.tsx:124` noemt slechts `22A, 22B` (21A ontbreekt). De curriculum-periode-context (`curriculum.ts` periode 1, leerjaar 3) heeft `sloFocus: ['22B', '21D', '21C']` — dat bevat `21D`/`21C`, geen van beide in de mission-specifieke mapping, en mist `22A`/`21A` die de mapping wél claimt. Drie bronnen die met elkaar zouden moeten overeenstemmen wijken op alle drie punten af.
  - **Voorstel:** Kies één brontrio dat overeenstemt. Als `22A, 22B, 21A` de bedoelde SLO's zijn (de mapping is autoritair per project-instructie): voeg `21A` toe aan de systemInstruction-regel "SLO KERNDOELEN: ..." (`year3.tsx:124`) zodat de coach zelf ook de volledige claim kent. De periode-`sloFocus`-mismatch (`21D`/`21C` i.p.v. `22A`/`21A`) is een curriculum-brede periode-instelling die mogelijk meerdere missies raakt — buiten scope van deze single-mission-fix, wel te vlaggen voor een curriculum-audit.

- **Geen VSO-kerndoelen (`sloVsoKerndoelen`) voor api-architect:**
  - **Wat:** De mapping-regel (`slo-kerndoelen-mapping.ts:155`) heeft geen `sloVsoKerndoelen`-veld, terwijl vergelijkbare leerjaar-3-missies dat wel hebben (zie bijv. regel 147 `eindproject-j2`). VSO-leerlingen die op dit curriculumpad zitten krijgen geen VSO-specifieke kerndoel-mapping voor deze missie.
  - **Voorstel:** Als api-architect (Hard-difficulty, havo/vwo-only via `educationLevels: ['havo','vwo']` in `year3.tsx:95`) bewust niet voor VSO is bedoeld, is het ontbreken correct en geen actie nodig — maar dat zou dan expliciet moeten blijken (vergelijkbare havo/vwo-only missies in dit bestand tonen hetzelfde patroon, dus dit is waarschijnlijk intentioneel, niet vergeten). Geen wijziging voorgesteld; ter info voor eventuele VSO-curriculum-audit.

- **Coach-STEP_COMPLETE dekt 3 van de 4 canvas-stappen (bekend platform-patroon, hier concreet):**
  - **Wat:** `year3.tsx:140-142` bevat `STEP_COMPLETE:1/2/3`, maar de config heeft 4 canvas-stappen. De engine's eigen voortgangslogica (`isStepComplete` in `BuilderCanvas.tsx:82-90`) is onafhankelijk van de chat-STEP_COMPLETE-markers (draait op checklist + tekstlengte), dus dit blokkeert de score/voltooiing NIET — dit is het bekende coach-plan-vs-canvas-desync-platformpatroon. Praktisch gevolg: de coach in de chat "ziet" nooit expliciet bevestigd dat de leerling aan stap 4 (documentatie) werkt/klaar is, wat de coaching-kwaliteit in die laatste stap kan verzwakken (coach mist het signaal om door te schakelen naar documentatie-begeleiding).
  - **Voorstel:** Optioneel, niet blocking: voeg `STEP_COMPLETE:4` toe aan de systemInstruction voor het documentatie-moment. Alleen doen als het platform-brede desync-patroon sowieso wordt aangepakt — geen missie-specifieke losse fix nodig.

- **Technische correctheid API-concepten — grotendeels correct, één kleine inconsistentie:**
  - **Wat:** Config noemt GET/POST/PUT/DELETE (4 methodes, `api-architect.ts:26`); systemInstruction (`year3.tsx:119`) noemt ook PATCH. PATCH ontbreekt in de leerling-instructie maar wordt door de coach wel genoemd — geen fout (PUT-only is didactisch valide voor dit niveau), maar een leerling die de coach volgt kan een 5e methode tegenkomen die niet in de kern-opdracht staat.
  - **Voorstel:** Laag risico, geen actie vereist — coach mag breder uitleggen dan de kern-checklist zolang de checklist zelf haalbaar blijft (die vraagt niet om PATCH).

### ❌ Blocking issues

Geen. SLO-codes zijn stuk voor stuk geldige codes; de inconsistentie is een cross-referentie-mismatch, geen ongeldige claim.

---

## 🔧 Tech review

**Score: 8.0/10**
**Dynamic verificatie:** niet uitgevoerd deze pass (geen dev-server/screenshots in scope).

### Scoreplafond — exact nagerekend

Engine-formule (`BuilderCanvas.tsx:78,96-103`): `pointsPerStep = floor(maxScore / steps.length)`, `totalScore = completedSteps.length × pointsPerStep + bonusScore` (bonusScore alleen via `reflectionQuestion`, niet geconfigureerd hier).

| Stap | Voltooiingseis | Stapscore |
|---|---|---|
| api-basics | 3 checklist-items + textPrompt (≥40 tekens default) | 25 |
| endpoints-ontwerpen | 4 checklist-items + textPrompt | 25 |
| authenticatie | 4 checklist-items + textPrompt | 25 |
| documentatie | 4 checklist-items + textPrompt | 25 |
| **Totaal engine-max** | | **100** |

`maxScore: 100` (`api-architect.ts:84`) — **klopt exact**, geen `Math.floor`-afronding-gap (100/4 = 25 exact). Badge-drempel "API Master" (`minScore: 90`) is haalbaar binnen het plafond.

### ✅ Geslaagd

- **Restart-safe state:** `useMissionAutoSave` gebruikt via het gedeelde builder-canvas-mechanisme (buiten deze config, engine-niveau) — geen missie-specifieke afwijking.
- **Geen `dangerouslySetInnerHTML`, geen ongesanitized leerling-input naar AI:** config bevat alleen statische strings; chat-sanitizing loopt via het gedeelde `StudentAIChat`/edge-function-pad (`BuilderCanvas.tsx:6`).
- **`chatRoleId: 'api-architect'` matcht de agent-registratie** in `year3.tsx:93` — geen dormante-rol-risico (rol bestaat en is correct gekoppeld).
- **Checklist-ids zijn uniek per stap** (geen dubbele keys tussen stappen die de `state.checklist[\`${stepId}-${item.id}\`]`-lookup zouden laten botsen).
- **Geen `any`/`@ts-ignore` in de config**, config voldoet aan het `BuilderCanvasConfig`-type zonder afwijkingen.

### ⚠️ Aandachtspunten

- **`minTextLength` ontbreekt (zie ook design-review):** functioneel geen bug (engine-default vangt het op), maar tech-risico omdat de default (40 tekens) geen inhoudelijke koppeling heeft aan wat de instructie vraagt — zie voorstel bij design-review.

### ❌ Blocking issues

Geen.

---

## Samenvatting

- **Geslaagd:** design 4/5 · didactiek 5/8 substantiële criteria · tech 5/6
- **Blocking:** 0
- **Resterende issues:** 1 design (`minTextLength` ontbreekt) · 4 didactiek (SLO-cross-referentie-mismatch over 3 bronnen, ontbrekende VSO-mapping — waarschijnlijk intentioneel, coach-STEP_COMPLETE 3-van-4 — bekend platformpatroon, PATCH-vermelding-inconsistentie — triviaal) · 1 tech (idem `minTextLength`, gedeeld met design)
- **Grootste sterkte:** bovengemiddelde Bloom-spreiding (3 van 4 stappen op Bloom 3+) en een exacte scoreplafond-berekening zonder de veelvoorkomende `Math.floor`-afrondingsgap
- **Grootste resterend risico:** de SLO-cross-referentie-mismatch tussen `slo-kerndoelen-mapping.ts` (autoritair), de systemInstruction-tekst en de curriculum-periode-`sloFocus` — geen ongeldige claim, maar drie bronnen die intern niet met elkaar overeenstemmen ondermijnt de betrouwbaarheid van de SLO-verantwoording richting docenten/schoolrapportage

**Triage-score:** 2.55 (laag = gezond; schaal (10-design)×0.3 + (10-didactiek)×0.4 + (10-tech)×0.3 = (10-7.5)×0.3 + (10-5.5)×0.4 + (10-8.0)×0.3 = 0.75 + 1.80 + 0.60 = 3.15)

**Verdict: fix-eerst** (geen blocking, maar de SLO-cross-referentie-mismatch is een feitelijke inconsistentie die de schoolrapportage-betrouwbaarheid raakt — aanbevolen vóór een release-beslissing, niet urgent genoeg om de missie te blokkeren)

---

## Codex-gate (M1)

**Niet uitgevoerd deze pass** — token-discipline batch-review (wave 14) beperkt scope tot statische drie-rubriek-analyse zonder adversarial gate. Aanbevolen vóór een release-beslissing als de SLO-cross-referentie-fix is doorgevoerd.
