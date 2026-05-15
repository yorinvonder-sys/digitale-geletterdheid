---
name: dgskills-mission-review
description: Use this skill when reviewing, auditing, or checking an existing DGSkills learner mission for issues in design, didactics, or technical implementation. Trigger phrases include "review missie", "audit missie", "missie reviewen", "missie nakijken", "missie auditen", "review mission", "/dgskills-mission-review", or any explicit request to evaluate the quality of a specific mission by ID. Activate NIET for creating new missions (use dgskills-mission-author) or for platform-wide compliance checks (use dgskills-compliance-check).
---

# DGSkills Mission Review — Orchestrator

Je bent de orchestrator voor de M2 review-pipeline. Je dispatcht drie parallelle reviewer-agents (design, didactiek, techniek) en bundelt hun output tot één markdown-rapport. De Codex-gate (M1) reviewt het uiteindelijke bundelresultaat.

## DGSkills Mission Factory v1

Gebruik `docs/agent/dgskills-mission-factory.md` als centrale procesafspraak voor missie-werk. Elke missie-review moet aansluiten op:
- Missie Intake: doel, doelgroep, scope, risico en bewijs.
- Validation Contract: leerdoel, SLO-koppeling, succescriteria en wat niet mis mag gaan.
- Reviewrapport: wat is gecontroleerd, welke browserbewijzen bestaan, wat blijft onzeker.

Rollen blijven gescheiden: de orchestrator is Regisseur, sub-reviewers zijn Controleurs, eventuele uitvoerende agents zijn Makers, en Yorin blijft menselijke eindbeslisser.

## Verplichte Chrome-plugin verificatie

De visuele/dynamische reviewstap van deze pipeline MOET via de **Codex Chrome plugin/extension** lopen: **"Chrome — Control Chrome with Codex"**. Dit geldt voor de totale review-agent én voor de technische sub-reviewer die browser-QA uitvoert.

- Gebruik de Chrome-plugin voor lokale missie-QA, screenshots, klikken, viewport-checks, console/network-observaties en bestaande Chrome-profiel/context.
- Gebruik niet stilletjes de Codex in-app browser, Playwright-headless of een generieke browser als vervanging.
- Als de Chrome-plugin niet beschikbaar is, herstel/probeer de plugin volgens de Chrome-tooling eerst. Lukt dat niet, noteer in het rapport: `Chrome-plugin verificatie: niet uitgevoerd` met de exacte blocker, en markeer visuele/dynamische claims als unverified.
- Geef deze verplichting expliciet door in de prompt voor de tech-reviewer in Stap 3.

## Verplichte multi-viewport controle

Bij zichtbare missie-UI controleer je minimaal:
- desktop/laptop;
- iPad/tablet staand, ongeveer 1024 x 1366;
- iPad/tablet liggend, ongeveer 1366 x 1024;
- mobiel.

Controleer per formaat intro/start, normale flow, foutfeedback en eind-/CTA-staat. Als browser-emulatie mogelijk onvoldoende bewijs geeft door Safari- of iPad-specifiek gedrag, markeer `Echte iPad-check nodig`.

## Trigger­principes

Activeer bij verzoek tot **reviewen / auditen van een bestaande missie**.

NIET activeren voor:
- Een nieuwe missie maken → `dgskills-mission-author`
- Compliance-check op het hele platform → `dgskills-compliance-check`
- Edge function-review → `dgskills-supabase-edge`

## Verplichte input

Een **missionId** (kebab-case, bv. `cookie-crusher`, `phishing-fighter`, `website-bouwer`).

Als de gebruiker geen missionId geeft maar wel een missie-titel of fragment: zoek de match in `config/templateRegistry.ts` en `config/slo-kerndoelen-mapping.ts`. Bij meerdere matches: vraag de gebruiker welke.

## Stappenplan

### Stap 1 — MissionId valideren (soepel — niet rejecten op incomplete metadata)

Een missie wordt als "bestaand" beschouwd zodra **één** van de twee bestaans-checks slaagt. Metadata-checks zijn warnings, geen rejectie.

**Bestaans-checks (minstens één moet slagen):**

1. **Template-missie:** Lees `config/templateRegistry.ts`. Komt `missionId` voor? Zo ja: noteer `templateType` uit de registry.
2. **Handgemaakte missie / fallback file-search:** Doe drie zoekstrategieën in volgorde — neem de **eerste hit**, ga niet door zodra match is gevonden. Excludeer altijd `components/missions/templates/` om false positives op template-engines te voorkomen.

   **Strategie A — Filename pattern-matching (case-insensitive):**
   - Run: `find components/missions -name "*.tsx" -type f -not -path "*/templates/*"`
   - Voor elke gevonden file: normaliseer basename (lowercase, alle non-alfanumerieke chars weg) en vergelijk met genormaliseerde `missionId`:
     - **Exact match (met of zonder `mission`-suffix):** bv. file `CookieCrusherMission.tsx` → genormaliseerd `cookiecrushermission`; missionId `cookie-crusher` → genormaliseerd `cookiecrusher`. Match wanneer file-base ∈ {missionId, missionId+"mission"}
     - **Substring match:** genormaliseerd file-basename bevat genormaliseerd missionId

   **Strategie B — Grep op exacte missionId-string in code** (vangt missies waar filename afwijkt van conventie):
   - Run: `grep -rln "['\"\\\`]<missionId>['\"\\\`]" components/missions --include="*.tsx" --include="*.ts" 2>/dev/null | grep -v "/templates/"`
   - Bij ≥1 match: pak de file met het kortste pad (waarschijnlijk de hoofd-component, niet een sub-component)

   **Strategie C — Lossere grep fallback:**
   - Run: `grep -rln "<missionId>" components/missions --include="*.tsx" 2>/dev/null | grep -v "/templates/"`
   - Bij ≥1 match: pak het kortste pad

   Bij match in één van de drie strategieën: `templateType = "handcrafted"`, `handcraftedComponentPath = <gevonden pad>` (volledig pad voor stap 2).

   Bij geen match in alle drie: ga door naar de stop-conditie (zie hieronder) — beide bestaans-checks (template registry + handcrafted file-search) hebben gefaald.

**Stop ALLEEN** als beide bestaans-checks falen — d.w.z. de missie heeft géén template-entry **én** geen handgemaakte component. Foutmelding: "Missie '<id>' niet gevonden — geen entry in `config/templateRegistry.ts` en geen `*Mission.tsx`-component met die naam. Controleer spelling van missionId."

**Metadata-checks (warning, géén rejection):**

3. **SLO-koppeling:** Lees `config/slo-kerndoelen-mapping.ts`. Check `KERNDOEL_MISSIONS`-entry. Bij ontbreken: ⚠️ flag voor didactiek-reviewer als bevinding "geen SLO-mapping geregistreerd" — ga door met review.
4. **Curriculum-plek:** Lees `config/curriculum.ts`. Check of `missionId` in een `yearGroups[n].periods[p].missions` array staat. Bij ontbreken: ⚠️ flag voor didactiek-reviewer als bevinding "geen curriculum-plek geregistreerd" — ga door met review. Sla `curriculumLocation` op als `null` of `{ yearGroup: null, period: null }`.

Een geldige bestaande missie zonder volledige metadata moet **wél gereviewd** worden — de ontbrekende metadata is zelf een didactiek-bevinding.

### Stap 2 — Paths resolven

Bepaal `configPath` + `enginePath` afhankelijk van het `templateType` uit Stap 1. **Twee verschillende takken** — handcrafted volgt een ander pad-patroon dan template-missies.

**Tak A — Template-missies** (`templateType` is een echte template-naam zoals `scenario-engine`, `puzzle-lab`, `builder-canvas`, etc.):
- `configPath` = `components/missions/templates/<templateType>/configs/<missionId>.ts`
- `enginePath` = `components/missions/templates/<templateType>/<TemplateType>.tsx` (TemplateType = PascalCase van templateType, bv. `scenario-engine` → `ScenarioEngine`)
- **Verifieer alleen `configPath`** — als hij ontbreekt: stop met foutmelding "Template-missie '<id>' geregistreerd in `templateRegistry.ts` maar config-bestand `<configPath>` ontbreekt op disk."
- (`enginePath` hoeft niet expliciet bestaan-gecheckt — als het template-type bestaat, bestaat de engine; de kritieke check is dat de config bestaat.)

**Tak B — Handcrafted missies** (`templateType === "handcrafted"`):
- `configPath = null` (handcrafted missies hebben geen aparte content-config; alle content zit inline in het Mission-component)
- `enginePath = handcraftedComponentPath` uit Stap 1 (bv. `components/missions/CookieCrusherMission.tsx`)
- **Skip de template-bestaans-check volledig** — het Mission-component is al bewezen aanwezig vanuit Stap 1's pattern-match. Niet stoppen.
- Geef sub-reviewers expliciet door dat dit handcrafted is — zij gebruiken alternatieve criteria (geen config-velden om te beoordelen; alle review op de component-code).

**Metadata (beide takken — niet kritiek):**
- `sloEntry` = matching object uit `KERNDOEL_MISSIONS` of `null` (warning uit Stap 1's metadata-check)
- `curriculumLocation` = `{ yearGroup, period }` of `null` (warning uit Stap 1's metadata-check)

Output van Stap 2 = compleet object dat aan elke sub-reviewer wordt meegegeven, ongeacht of `configPath` null is of niet.

### Stap 2.5 — Dev-server starten voor visuele verificatie

Vóór Stap 3 start je een achtergrond-dev-server zodat de tech-reviewer multi-viewport screenshots kan maken. Dit is **best-effort** — bij falen ga je door met static-only review en noteer "Dynamic verificatie: dev-server kon niet starten".

```bash
# 1. Check of er al een dev-server draait
EXISTING=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000 2>/dev/null || echo "000")

if [ "$EXISTING" != "200" ]; then
  # 2. Start dev-server in achtergrond
  cd /Users/yorinvonder/Downloads/ai-lab---future-architect
  nohup npm run dev > /tmp/dgskills-mission-review-dev.log 2>&1 &
  DEV_PID=$!
  echo "Dev-server PID: $DEV_PID" > /tmp/dgskills-mission-review-pid.txt

  # 3. Wacht tot port 5173 antwoordt (max 30s)
  for i in {1..30}; do
    if curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000 | grep -q 200; then
      DEV_READY=true
      break
    fi
    sleep 1
  done
fi

devServerUrl="http://127.0.0.1:3000"
```

Sla `devServerUrl` (ofwel `null` als start faalde) op voor doorgifte aan tech-reviewer in Stap 3.

**Belangrijk:** noteer `DEV_PID` voor cleanup in Stap 7. Geen orphan processes laten staan.

### Stap 3 — Drie reviewers dispatchen — parallel

De drie sub-skills (`dgskills-design-reviewer`, `dgskills-didactiek-reviewer`, `dgskills-tech-reviewer`) zijn **rubric-bestanden** — hun SKILL.md bevat criteria + output-format die door een general-purpose agent worden uitgevoerd. Ze zijn **geen eigen `subagent_type`**.

Spawn drie general-purpose agents in parallel — één Agent-tool message met drie Agent-tool calls:

```
Agent.subagent_type: "general-purpose"
Agent.model: "sonnet"
Agent.description: kort, bv. "Design review {missionId}"
Agent.prompt: <zie template hieronder>
```

Per agent-prompt template:

> Je bent de [design/didactiek/tech]-reviewer in de DGSkills M2 review-pipeline. Lees de instructies en criteria uit `.claude/skills/dgskills-[design/didactiek/tech]-reviewer/SKILL.md` (project-relatief, project-root is `/Users/yorinvonder/Downloads/ai-lab---future-architect`) en volg ze exact.
>
> Mission-context:
> - missionId: {missionId}
> - templateType: {templateType}
> - configPath: {configPath}
> - enginePath: {enginePath}
> - sloEntry: {JSON van sloEntry}
> - curriculumLocation: {yearGroup, period}
> - devServerUrl: {devServerUrl}  // bv. "http://127.0.0.1:3000" of null
> - chromePluginRequired: true — visuele/dynamische verificatie moet via de Codex Chrome plugin/extension ("Chrome — Control Chrome with Codex"); geen in-app browser fallback zonder expliciete gebruikersapproval
>
> Output: uitsluitend de markdown-sectie volgens het format in de SKILL.md (begin met `## 🎨 Design review` of `## 📚 Didactiek review` of `## 🔧 Tech review`). Geen extra tekst, geen voor/nawoord. Bevindingen met file:regel anchors verplicht.

**Belangrijk:** vermeld bij elke spawn expliciet `model: "sonnet"` — Yorin's transparency-regel. Output van elke agent is de markdown-sectie die je in stap 4 bundelt.

**Fallback bij ontbrekende sub-skill:** als een van de drie SKILL.md files nog niet bestaat, vervang die agent-spawn door een placeholder-sectie `## 🎨 Design review\n\n_Skill nog niet geïmplementeerd — placeholder._` Stop niet de hele pipeline.

### Stap 4 — Bundelen + schrijven

**CRUCIAAL — placeholder-substitutie vóór het schrijven.** De template-tekens hieronder zijn placeholders, géén literals. Je MOET ze één-op-één substitueren met echte waarden vóór `Write`. Schrijf nooit letterlijk `<missionId>`, `YYYY-MM-DD`, of `<missionTitle>` als bestandsnaam of in het rapport.

**Stap 4a — Genereer pad + datum dynamisch:**

```bash
DATE=$(date +%Y-%m-%d)        # bv. 2026-05-06
MISSION_ID="cookie-crusher"   # de echte input-missionId, niet de placeholder
TARGET="business/dgskills-reviews/${MISSION_ID}-${DATE}.md"
mkdir -p "$(dirname "$TARGET")"
echo "$TARGET"                 # bv. business/dgskills-reviews/cookie-crusher-2026-05-06.md
```

**Stap 4b — Bundel template (substitueer ALLE `{...}`-tokens):**

```markdown
# Missie-review: {missionTitle}

**Mission ID:** {missionId}
**Template:** {templateType}
**Curriculum-plek:** {curriculumLabel}
**Datum:** {date}
**Reviewer-pipeline:** dgskills-mission-review v1.0

---

{designReviewSection}

{didactiekReviewSection}

{techReviewSection}

---

## 🖼️ Visuele evidence (multi-viewport)

{visualEvidenceSection}

---

## Samenvatting
- **Geslaagd:** {totalPassed} criteria
- **Aandachtspunten:** {totalWarnings} issues (waarvan {totalBlocking} blocking)
- **Aanbeveling:** {shipFixHerontwerp}

---

## Codex-gate (M1)
{codexStamp — invul na stap 5}
```

**Substitutie-tabel:**
| Token | Bron |
|---|---|
| `{missionTitle}` | uit configPath of registry — fallback: `missionId` zelf |
| `{missionId}` | echte input-missionId (kebab-case) |
| `{templateType}` | uit stap 1 (`scenario-engine`/`handcrafted`/etc.) |
| `{curriculumLabel}` | `Leerjaar {yearGroup}, Periode {period}` of `"Niet geregistreerd"` als curriculum-check faalde |
| `{date}` | `$DATE` uit stap 4a |
| `{designReviewSection}` | output van design-reviewer agent (begint met `## 🎨 Design review`) |
| `{didactiekReviewSection}` | output van didactiek-reviewer agent (`## 📚 Didactiek review`) |
| `{techReviewSection}` | output van tech-reviewer agent (`## 🔧 Tech review`) |
| `{visualEvidenceSection}` | tabel of lijst van 16 screenshot-IDs/checks (4 viewports × 4 states) uit tech-reviewer's Fase B; bij overgeslagen Fase B: tekst "Multi-viewport verificatie niet uitgevoerd — dev-server niet beschikbaar" |
| `{totalPassed}`, `{totalWarnings}`, `{totalBlocking}` | tellen uit de drie sub-rapporten |
| `{shipFixHerontwerp}` | je oordeel: `ship` / `fix-eerst` / `herontwerp` |
| `{codexStamp}` | placeholder tot stap 5 — daarna ALLOW/BLOCK + reden |

### Stap 4.5 — Finale UI-gate vóór Codex-gate

Na ontvangst van de drie subreviews en vóór het schrijven van het rapport voer jij als orchestrator een eigen **Finale UI-gate** uit. Dit voorkomt dat de drie parallelle agents samen alsnog een rommelige interface laten passeren.

Controleer het gecombineerde bewijs op:
- **overlap:** tekst, knoppen, badges, modals, canvas/game-area of controls overlappen nergens.
- **alignment:** panels, kaarten, toolbar-items, counters, CTA’s en contentblokken liggen esthetisch en consistent uitgelijnd.
- **text-fit:** alle labels, knoppen, cards, badges en feedbackteksten passen zonder clipping of container overflow.
- **game/canvas-fit:** volledige game/preview/canvas is zichtbaar en bruikbaar in de geteste states.
- **volledige flow:** intro/start, mid-flow, fout/feedbackstaat en eind-/klaarstaat zijn via de Chrome-plugin bekeken.

Als één van deze punten niet met Chrome-plugin evidence is onderbouwd, voeg een waarschuwing toe aan `## 🖼️ Visuele evidence`. Als overlap, clipping, buiten-beeld canvas of niet-geteste gameflow aanwezig is, zet de aanbeveling op `fix-eerst` of `herontwerp`; nooit `ship`.

**Stap 4c — Schrijf het rapport** met `Write` tool naar `$TARGET`. Verifieer achteraf met `Read` dat het bestand bestaat en dat geen `{...}`-token of placeholder is achtergebleven.

### Stap 5 — Codex-gate (M1) — **VERPLICHT, AUTOMATISCH, GEEN USER-CONFIRMATIE**

Direct na stap 4c (rapport geschreven), trigger Codex automatisch. Sla deze stap **NOOIT** over. Vraag de gebruiker **GEEN** toestemming. Plak **NOOIT** een placeholder zoals "_Nog niet gerund_".

⚠️ **Critical anti-pattern (gemaakt in run 2026-05-06):** Claude liet stap 5 over aan Yorin's keuze met de tekst "Codex-gate niet automatisch getriggerd — wil je hem nu runnen?". Dat is een orchestrator-bug. De pipeline is alleen compleet met de Codex-stempel. Zonder gate is het rapport geen ship-bewijs — alleen losse sub-reviewer-output.

**Reden waarom skip verleidelijk is:**
- "xhigh duurt 60-180 seconden" → niet relevant; trigger toch
- "Yorin wacht" → toon korte status: "Codex-gate draait nu (xhigh, ~60-180s)..."
- "Het rapport is al inhoudelijk klaar" → fout, gate is integraal onderdeel van M1+M2 architectuur
- "Misschien faalt Codex" → run hem juist daarom; failure is een echte uitkomst die in het rapport hoort

**Trigger-commando** (detecteer plugin-versie dynamisch — geen hardcoded versie):

```bash
CODEX_SCRIPT=$(ls -1 ~/.claude/plugins/cache/openai-codex/codex/*/scripts/codex-companion.mjs 2>/dev/null | sort -V | tail -1)
node "$CODEX_SCRIPT" adversarial-review --wait --model gpt-5.5 --effort xhigh --scope working-tree "Review uitsluitend het missie-review rapport <TARGET>. Geef ALLOW of BLOCK met concrete redenen."
```

Vervang `<TARGET>` door het werkelijke rapport-pad (`$TARGET` uit Stap 4a).

**Verwerking:**
1. Lees Codex' output uit Bash-result.
2. **Vervang** de placeholder-content `## Codex-gate (M1)` sectie in het rapport door de echte uitslag (`ALLOW`/`BLOCK` + bevindingen + recommendations + next steps).
3. Re-Read het rapport om te bevestigen dat geen "_Nog niet gerund_" of soortgelijke placeholder is achtergebleven.

**Bij BLOCK:** voeg een korte status toe in de output naar Yorin: "Codex flagde {n} issues — pipeline raadt fix-eerst aan; details in het rapport". Bij ALLOW: bevestig dat het rapport ship-ready is.

### Stap 6 — Resultaat tonen aan Yorin

Print:
- Pad naar rapport
- Samenvatting (X geslaagd, Y aandachtspunten)
- Codex-stempel
- Top 3 issues met file:regel
- Visuele evidence: aantal screenshots/checks per viewport (desktop/laptop / iPad-tablet staand / iPad-tablet liggend / mobiel)

### Stap 7 — Dev-server cleanup

Stop de dev-server die in Stap 2.5 is gestart. **Verplicht** — geen orphan processes laten staan.

```bash
if [ -f /tmp/dgskills-mission-review-pid.txt ]; then
  DEV_PID=$(grep -oE '[0-9]+' /tmp/dgskills-mission-review-pid.txt)
  if [ -n "$DEV_PID" ] && kill -0 "$DEV_PID" 2>/dev/null; then
    kill "$DEV_PID" 2>/dev/null
    sleep 2
    kill -9 "$DEV_PID" 2>/dev/null
  fi
  rm -f /tmp/dgskills-mission-review-pid.txt /tmp/dgskills-mission-review-dev.log
fi
```

Als de dev-server al draaide vóór Stap 2.5 (Yorin had hem zelf gestart): laat hem staan — de cleanup-pid file is dan ook niet aangemaakt.

## Output-verwachting

Aan einde van de review-flow lever je terug aan Yorin:

1. **Pad naar rapport** in `business/dgskills-reviews/`
2. **Korte samenvatting** (1-3 zinnen) — wat is de algemene staat
3. **Top issues** — max 3 met file:regel als anchor
4. **Codex-stempel** — ALLOW of BLOCK met reden
5. **Demo-zin** voor Yorin's pilot/sales — wat kun je hierover zeggen aan een schoolbestuur

## Anti-patronen (doe dit NOOIT)

- ❌ Sub-reviewers sequentieel runnen — gebruik altijd parallel dispatch (bespaart 2/3 tijd)
- ❌ Rapport schrijven zonder bewijs — elke bevinding moet een file:regel of screenshot/log-snippet hebben
- ❌ Codex-gate skippen — de M1 review op het bundelrapport is verplicht
- ❌ **Placeholders als literals schrijven** — geen `<missionId>` of `YYYY-MM-DD` letterlijk in filename of rapport (zie Stap 4a/4b)
- ❌ **Geldige missie rejecten op incomplete metadata** — alleen rejecten als beide bestaans-checks (template + handcrafted) falen
- ❌ Eigen rubric verzinnen — gebruik de criteria uit elke sub-skill consistent
- ❌ Engelse output naar Yorin — alle rapport-content in Nederlands

## Verificatie (na elke run)

- [ ] Rapport bestaat met **echte** missionId + **echte** datum in filename (bv. `business/dgskills-reviews/cookie-crusher-2026-05-06.md`) — geen `<missionId>` of `YYYY-MM-DD` als literal
- [ ] In het rapport zijn alle `{...}`-tokens vervangen — geen placeholder-tekens zichtbaar
- [ ] Drie sub-secties zijn ingevuld (geen lege placeholders zonder reden)
- [ ] Elke bevinding heeft bewijs (file:regel of screenshot/log)
- [ ] Codex-stempel onderaan
- [ ] Samenvatting telt klopt met de bevindingen
- [ ] Bij ontbrekende SLO-mapping/curriculum-plek: warnings staan als bevindingen in didactiek-sectie, niet als orchestrator-rejection

## Referentie

- Detail-plan: `~/.claude/plans/m2-mission-review-pipeline.md`
- Master-plan: `~/.claude/plans/hey-claude-ik-struggle-eager-meteor.md`
- Sub-skills: `dgskills-design-reviewer`, `dgskills-didactiek-reviewer`, `dgskills-tech-reviewer`
- Codex review-gate (M1): plugin `openai-codex/codex` met `--model gpt-5.5 --effort xhigh`
