# Missiereview: De AI Spiegel

**MissionId:** `ai-spiegel` · **Type:** `simulation-lab` · **Leerjaar:** 1, week 3 · **Config:** `src/features/missions/templates/simulation-lab/configs/ai-spiegel.ts`
**Datum:** 2026-07-02 · **Wave:** 17 (verse review)

---

## Registratie-check (voorafgaand aan rubrics)

| Bron | Status |
|---|---|
| `templateRegistry.ts:34` | ✅ `templateType: 'simulation-lab'` |
| `agents/year1.tsx:1707-1826` | ✅ agent-rol geregistreerd, kleur/icoon/briefing consistent (`briefingImage: /assets/agents/ai_spiegel.webp` bestaat) |
| `slo-kerndoelen-mapping.ts:68` (autoritair) | ✅ `sloKerndoelen: ['23A','23B','21C']`, `sloVsoKerndoelen: ['20A','20B']`, week 3, yearGroup 1 |
| `curriculum.ts` periode 3 leerjaar 1 | ✅ mission-id staat in periode 3 "Digitaal Burgerschap" (`sloFocus` bevat 23A/23B/23C/21B/21C — dekt de missie-codes) |
| `missionGoals.ts:208-215` | ✅ `primaryGoal`/`criteria`/`evidence` aanwezig, dekt privacykeuzes + data-bewustzijn correct |
| `types.ts:27` (RoleId-union) | ✅ `ai-spiegel` aanwezig |
| `agentRoleIds.ts:24` | ✅ aanwezig (dubbele bron intact, zie lessons TS2322-gotcha) |
| `missionThumbnails.ts:28` | ✅ `/assets/previews/project_ai_spiegel.webp` bestaat op schijf |
| `basisvaardigheden-mapping.ts:236` | ⚠️ zie Aandachtspunt hieronder |
| `ProjectZeroDashboard.tsx:151` | ⚠️ zie Aandachtspunt hieronder (SLO-drift) |

Geen registratie-*gaten* (alle verplichte bronnen aanwezig), maar wel twee **drift-bevindingen** tussen secundaire bronnen en de autoritaire SLO-mapping (zie Design/Didactiek).

---

## 🎨 Design review

**Score: 8.0/10**

### ✅ Geslaagd
- Simulation-lab visualisaties (meter/bar-chart/comparison) zijn thematisch passend: profielopbouw als meter (kwantitatief), app-permissies als bar-chart (per categorie vergelijkbaar), filterbubbel als comparison (kwalitatief contrast "wat je ziet" vs "wat bestaat") — juiste visualisatietype per leerdoel.
- Badge-progressie logisch (0/25/50/70/90), kleuren consistent (`#ff3c21` acid-rood voor het middenbadge "Bewuste Digitale Burger", zwart voor overige — geen willekeurige kleurkeuzes).
- `visualPreview` in de agent-rol (r.1719-1735) gebruikt legacy `lab-teal`/`lab-coral` tokens — dit is de bekende, niet-geraakte visualPreview-laag in `agents/year1.tsx` (buiten missie-config-scope, platform-breed patroon, geen nieuwe bevinding).

### ⚠️ Aandachtspunten
- **Bar-chart kleurlogica in Sim 2 is een no-op:** `computeVisuals` (ai-spiegel.ts:52,57,62) zet `color: locatieValue > 2 ? '#ff3c21' : locatieValue > 0 ? '#ff3c21' : '#e3e2dc'` — beide takken van de eerste ternary geven dezelfde kleur (`#ff3c21`), dus de driewaardige logica (rood-bij-hoog / oranje-bij-matig / grijs-bij-nul) is feitelijk een tweewaardige (rood zodra >0, grijs bij 0). Waarschijnlijk was een tussenkleur (bv. amber) bedoeld voor de middencategorie maar is die weggevallen. Geen functionele blocker (leerling ziet nog steeds rood-bij-risico), maar het visuele signaal "hoeveel erger wordt het" gaat verloren.
  - **Voorstel:**
    ```ts
    // voor (ai-spiegel.ts:52, en analoog r.57, r.62)
    color: locatieValue > 2 ? '#ff3c21' : locatieValue > 0 ? '#ff3c21' : '#e3e2dc',
    // na
    color: locatieValue > 2 ? '#ff3c21' : locatieValue > 0 ? '#ffb020' : '#e3e2dc',
    ```
    (zelfde patroon toepassen op `cameraValue` r.57 en `microfoonValue` r.62)

### ❌ Blocking issues
Geen.

---

## 📚 Didactiek review

**Score: 8.0/10**

### ✅ Geslaagd
- **SLO-fit sterk:** 23A/23B (privacy-instellingen, data-bewustzijn) worden door alle drie sims gedekt — Sim 1 (profielopbouw), Sim 2 (concrete iPad-actie), Sim 3 (filterbubbel/21C mediawijsheid) vormen een coherente opbouw van "hoe ontstaat het" → "wat kun je zelf instellen" → "wat mis je erdoor".
- **Privacy-adviezen feitelijk correct en actueel:** iPad-pad "Instellingen → Privacy & Beveiliging → [Soort toegang]" klopt (huidige iOS-naamgeving); onderscheid "Altijd" vs "Bij gebruik van de app" bij locatietoegang is accuraat; kijktijd-als-sterker-signaal-dan-likes is een correcte, actuele beschrijving van hoe aanbevelingsalgoritmes werken.
- **Kans-én-risico-balans consequent:** zowel de config (ap1-q3 vraagt expliciet naar de kans van personalisatie, niet alleen het risico) als de systemInstruction ("Benoem bij elke stap zowel een KANS als een GEVAAR") vermijden eenzijdige bangmakerij — sluit aan bij de missie-brede regel "geen normaliserende/paniekerige framing".
- **Filterbubbel-uitleg (fb1-q1/q2) legt de democratische dimensie uit** (gedeelde feiten als basis voor gesprek) — bovengemiddeld voor leerjaar 1, niet alleen "je ziet minder leuke dingen" maar het maatschappelijke gevolg.

### ⚠️ Aandachtspunten
- **SLO-drift in leerling-dashboard (niet autoFixable zonder Yorin-keuze):** `ProjectZeroDashboard.tsx:151` toont `sloKerndoelen: ['23B', '23C']`, terwijl de autoritaire bron (`slo-kerndoelen-mapping.ts:68`) `['23A', '23B', '21C']` zegt. `23C` staat niet in de autoritaire lijst voor deze missie en `23A`/`21C` ontbreken in de dashboard-weergave — een docent die het dashboard leest ziet dus niet dezelfde SLO-codes als de officiële mapping.
  - **Voorstel:**
    ```ts
    // voor (ProjectZeroDashboard.tsx:151)
    sloKerndoelen: ['23B', '23C'],
    // na
    sloKerndoelen: ['23A', '23B', '21C'],
    ```
- **basisvaardigheden-mapping dekt niet de kernvaardigheid van de missie:** `basisvaardigheden-mapping.ts:236-241` koppelt `FORMULEREN` + `ETHIEK` aan `ai-spiegel`. Beide zijn aanwezig in de missie (STAP 3 vraagt schriftelijke privacykeuzes; ap1-q3 raakt eerlijkheid van personalisatie), maar de missie draait primair om **privacy/data-bewustzijn** (23A/23B) — vergelijkbare missies in dezelfde periode (`social-safeguard`) koppelen daar wél `ONLINE_VEILIGHEID` aan. Hier ontbreekt een privacy-georiënteerde basisvaardigheid volledig, wat de mapping voor rapportagedoeleinden onvolledig maakt.
  - **Voorstel (indien een `MEDIAWIJSHEID`- of `ONLINE_VEILIGHEID`-categorie van toepassing is op deze mapping):** voeg een derde entry toe die specifiek privacy-instellingen/data-bewustzijn dekt, bijvoorbeeld naast de bestaande twee. Exacte categorienaam en tekst zijn een Yorin-keuze (afhankelijk van welke basisvaardigheden-enum al bestaat) — niet autoFixable zonder die keuze.

### ❌ Blocking issues
Geen. SLO-codes in de autoritaire bron kloppen; de drift zit alleen in secundaire/afgeleide weergaven.

---

## 🔧 Tech review

**Score: 9.0/10**
**Dynamic verificatie:** niet uitgevoerd (geen screenshots-map aanwezig voor `ai-spiegel`; niet gedekt in `docs/audits/student-missions-ui-ux-review-2026-06-30.md` — grep op missionId gaf geen treffers, dus geen eerder vastgelegde runtime-bevindingen om op voort te bouwen).

### Scoreplafond — exact nagerekend
- Sim `advertentieprofiel`: `maxScore: 30`, vragen ap1-q1/q2/q3 = 10+10+10 = 30 — **klopt exact**.
- Sim `ipad-instellingen`: `maxScore: 40`, vragen ip1-q1/q2/q3 = 15+15+10 = 40 — **klopt exact**.
- Sim `filterbubbel`: `maxScore: 30`, vragen fb1-q1/q2/q3 = 10+10+10 = 30 — **klopt exact**.
- Config-top-level `maxScore: 100` (r.396) = 30+40+30 — **klopt exact**, geen mismatch tussen som-van-sims en declared maxScore.

Badge-drempels (0/25/50/70/90) vallen allemaal binnen [0,100] — geen onbereikbare of triviale drempel.

### ✅ Geslaagd
- **`computeVisuals` is pure TypeScript switch/case op `simId`** — geen `eval`, geen dynamische code-executie, geen leerling-input die als code wordt geïnterpreteerd (comment in de file bevestigt dit expliciet als ontwerpkeuze, r.4).
- **Alle drie `visualType`-velden matchen het daadwerkelijk geretourneerde `VisualData['type']`** in `computeVisuals` (`meter`/`bar-chart`/`comparison` — 1-op-1, geen mismatch tussen config-declaratie en runtime-output).
- **Parameter-defaults binnen `min`/`max`-grenzen:** alle sliders (`kijktijd`, `likes`, `locatie-apps`, `camera-apps`, `microfoon-apps`) hebben `default` binnen `[min, max]`; `select`-parameter `aanbevelingen` heeft `defaultOption: 'Alles aan'` dat letterlijk voorkomt in `options`.
- **`computeVisuals`-switch dekt alle drie geregistreerde `simId`'s** (`advertentieprofiel`, `ipad-instellingen`, `filterbubbel`) plus een expliciete fallback (r.138-139) — geen onbedekt pad dat een lege/undefined visual zou opleveren.
- **Geen AI-call, geen leerlinginput naar backend binnen de sim-config zelf** (de agent-rol/chat is een apart platform-onderdeel, zie Platform-inzicht hieronder) — pure statische config, geen prompt-injection-oppervlak in `computeVisuals`.
- **`SimulationLab.tsx:455`** bevestigt dat `ai-spiegel` correct in de engine-lijst staat die deze config-vorm accepteert.

### ⚠️ Aandachtspunten
- **Bar-chart kleurlogica no-op** — zie Design-sectie (technisch een logica-bug, didactisch/visueel classificatie hierboven als Design opgevoerd omdat het effect puur visueel is; genoemd hier voor volledigheid, niet dubbel geteld in de score).
- **Platform-inzicht (geen bevinding, contextnotitie):** de systemInstruction in `agents/year1.tsx:1737-1826` is de **client-side fallback**; de échte chat-prompt loopt server-side via `systemInstructions.ts`. Eventuele drift tussen client-fallback en server-prompt (bv. het "Bonus: XX/10"-scoreveld in het client-format dat nergens wordt toegelicht hoe het berekend wordt) is conform instructie **niet autoFixable** en wordt hier alleen genoteerd als observatie, niet als telbare bevinding.

### ❌ Blocking issues
Geen.

---

## Samenvatting

- **Geslaagd:** design 3/4 substantiële criteria · didactiek 4/6 · tech 6/7
- **Blocking:** 0
- **Resterende issues:** 1 design (bar-chart kleurlogica no-op — cosmetisch, autoFixable via het gegeven Voorstel) · 2 didactiek (SLO-drift dashboard vs autoritaire mapping — autoFixable via het gegeven Voorstel; basisvaardigheden-mapping mist privacy-focus — Yorin-keuze, niet autoFixable zonder categorienaam)
- **Sterkste punt:** privacy-adviezen zijn feitelijk correct en actueel, kans-en-risico-balans is consequent doorgevoerd in zowel config-vragen als systemInstruction, en de scoring is op alle niveaus (vraag→sim→missie) exact sluitend.
- **Grootste resterend risico:** de SLO-drift tussen `ProjectZeroDashboard.tsx` en de autoritaire mapping is het enige punt met een reëel rapportage-gevolg (docent ziet andere kerndoelen dan de officiële registratie) — laag risico maar wel het meest concrete van de drie aandachtspunten.

**Triage-score:** (10-8.0)×0.3 + (10-8.0)×0.4 + (10-9.0)×0.3 = 0.60 + 0.80 + 0.30 = **1.70** (laag = gezond)

**Verdict: fix-eerst** (geen blocking, maar twee van de drie aandachtspunten zijn autoFixable met een concreet Voorstel — SLO-dashboard-drift en bar-chart-kleurlogica — en verdienen een snelle fix vóór verdere distributie; de basisvaardigheden-mapping-uitbreiding is een Yorin-keuze die kan wachten)

---

## Codex-gate (M1)

**Niet uitgevoerd deze pass** — token-discipline batch-review (wave 17) beperkt scope tot statische drie-rubriek-analyse zonder adversarial gate. Aanbevolen vóór een release-beslissing.
