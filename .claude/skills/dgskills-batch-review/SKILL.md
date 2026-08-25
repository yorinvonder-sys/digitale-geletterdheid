---
name: dgskills-batch-review
description: Use this skill when reviewing, auto-fixing, or tracking the quality status of MANY existing DGSkills missions in one go (SWEEP mode), or when running a single-mission quality gate before a deploy (GATE mode). Trigger phrases include "batch review", "sweep missies", "alle missies reviewen", "review wave", "/dgskills-batch-review", or any request to check the quality of multiple missions at once. Activate NIET for reviewing a single named mission interactively (gebruik dan `dgskills-mission-review`) or for building new missions (gebruik `dgskills-build-mission`).
---

# DGSkills Batch Review — Multi-Missie Sweep + Auto-Fix (M4)

Je bent de orchestrator voor de M4 batch-review-pipeline. Je selecteert een wave van missies uit de statusindex, dispatcht per missie één compacte review-agent (alle drie rubrics in één pass), verzamelt JSON-samenvattingen, triggert de Codex-gate selectief op missies die fixes ontvangen, past veilige mechanische fixes toe via de fixer, en land alles als één PR per wave. Yorin is finale beslisser — de pipeline auto-merget nooit.

## TOKEN-DISCIPLINE (KRITIEK — expliciet onderdeel van de architectuur)

Token-verbruik loopt snel op bij bulk-werk. Dit zijn harde regels, niet adviezen:

- Elke sub-agent leest zijn missie-files **één keer** en past **alle drie rubrics** toe in **één pass** — nooit drie aparte agents per missie.
- De orchestrator ontvangt van elke sub-agent **uitsluitend compact JSON** (scores + issues + fix-snippets + escalaties) — geen prosa-dumps, geen volledige file-inhoud.
- De orchestrator plakt **nooit ruwe missie-code** tussen agents door — alleen missie-ID, paden, en compact JSON samenvatting.
- Per-mission rapporten worden geschreven naar disk; de orchestrator houdt in context alleen de JSON-samenvatting + statusindex.
- Screenshots worden **hergebruikt** uit `screenshots/assignments/<id>/` — geen nieuwe opnames tenzij er geen bestaan.
- **Gedeelde engines worden één keer gereviewd, niet per missie** (zie Stap 2.5). Twaalf scenario-engine-missies delen dezelfde engine; die twaalf keer laten lezen is de grootste verspilling in deze pipeline.

### Modelkeuze per taaksoort

Niet alles op één niveau. Kies per deeltaak het lichtste model dat het werk aankan:

| Deeltaak | Model | Waarom |
|---|---|---|
| Inventarisatie, registers natrekken, paden opzoeken | Haiku 4.5 | Mechanisch opzoekwerk, geen oordeel |
| Config- en didactiekreview per missie | Sonnet 5 (low/medium) | Tekstoordeel met meegeleverde context |
| Enginereview: scoring, voltooiing, state-herstel | Opus 5 low → medium | Raakt correctheid; begin laag, escaleer alleen bij twijfel |
| Welzijn, privacy, juridische claims | Opus 5 high | Kindveiligheid en compliance — hier niet bezuinigen |
| Synthese en eindoordeel | Opus 5 high (orchestrator) | Vereist het hele beeld |
| Rapporttekst, samenvattingen, vergelijking met eerdere review | Opus 5 low, of Luna (Codex) | DeepSeek is per 2026-08-20 uit de werkwijze |
| Tegenlezing van dragende claims | Sol (Codex) medium/high | Vaste achtervang, zie Stap 6 |
| Uitzonderlijke onzekerheid | Opus 5 high | Fable wordt in deze pipeline niet als losse rol ingezet — zie ultracode-variant hieronder voor het enige geval waarin Fable meedoet |

**Opus `max` wordt in deze pipeline niet gebruikt.** Opus 5 `high` is het plafond. Elke
correctie die er in de praktijk toe deed kwam van een tegenlezer of van iemand die de missie
écht naspeelde — niet van dieper nadenken in één hoofd.

### Ultracode-variant (Fable-orchestrator)

Alleen wanneer Yorin expliciet "ultracode" met Fable aanroept voor een sweep. Fable
draait dan de Workflow-tool en houdt het overzicht (selectie, synthese, statusindex,
wave-samenvatting) — de deeltaken zelf lopen als losse `agent()`-calls met een **expliciet**
model, want zonder override erft elke sub-agent standaard het model van de hoofdsessie
(Fable) en verdwijnt het hele kostenvoordeel.

| Deeltaak | Model (expliciet in `agent()`) | Effort | Waarom |
|---|---|---|---|
| Inventarisatie: missies ophalen, paden/registers natrekken | `haiku` | low | Mechanisch, geen oordeel |
| Rubric-scoring criteria 1-7, 9 (didactiek, flow, techniek, UI) | `sonnet` | low/medium | Tekst-/codeoordeel, context al aangeleverd |
| Criterium 8 (AI-gedrag) en 10 (privacy/veiligheid) | `opus` | high | **Verplicht — nooit Fable**, ook niet als Fable orchestreert (securityclassifier-risico, zie `CLAUDE.md` § Modelpalet) |
| Live browserverificatie (speeltest, gokstrategie-check) | `sonnet` | medium | Bestaande afspraak: browserwerk via Sonnet |
| Tegenlezing van "blocked"-escalaties vóór ze naar Yorin gaan | `opus` | high | Sol/Luna (Codex) zijn niet rechtstreeks aanroepbaar vanuit een Workflow-script |
| Synthese, statusindex bijwerken, wave-samenvatting | *(geen agent-call — Fable zelf, in de hoofdloop)* | — | Dit ís het overzicht vasthouden; een subagent ervoor ondermijnt het doel |

De regel voor criterium 8 en 10 is hard: die twee scores mogen in geen enkel pad — ook niet
via de ultracode-variant — als Fable-oordeel het statusbestand in gaan.

## Triggerprincipes

Activeer bij:
- **SWEEP:** meerdere missies tegelijk reviewen/fixen — kies een wave uit statusindex.
- **GATE:** één specifieke missie als quality-gate (bv. vóór deploy), of "missies gewijzigd sinds laatste commit".

NIET activeren voor:
- Interactieve single-mission review met Yorin → `dgskills-mission-review`
- Nieuwe missie bouwen → `dgskills-build-mission`
- Platform-brede compliance-check → `dgskills-compliance-check`

## Verplichte input

- **Modus:** `sweep` (default) of `gate`.
- **Bij gate-modus:** `missionId` (kebab-case) of het sleutelwoord `"changed"` (= missies met diff t.o.v. laatste commit).
- **Bij sweep-modus:** optioneel `waveSize` (default 5) en optioneel `priorityBand` filter (`high`/`medium`/`low`; default: worst-first op basis van triageScore).

Als de gebruiker dit niet meegeeft: gebruik defaults. Vraag niet opnieuw — noteer de gebruikte defaults in de wave-samenvatting.

## Status-index: `business/dgskills-reviews/review-status.json`

Dit bestand is de bron van waarheid voor welke missies al gereviewd zijn. Schema per missie:

```json
{
  "<missionId>": {
    "missionId": "cookie-crusher",
    "lastReviewed": "2026-06-17",
    "reviewStatus": "pending|reviewed|fixed|blocked|skip",
    "triageScore": 0.0,
    "priorityBand": "high|medium|low",
    "reportPath": "business/dgskills-reviews/cookie-crusher-2026-06-17.md",
    "autoFixesApplied": [],
    "openEscalations": [],
    "codexVerdict": null
  }
}
```

**Wave-selectie (SWEEP):** lees statusindex → filter missies met `reviewStatus != "fixed"` en `!= "blocked"` en `!= "skip"` → sorteer: `priorityBand` high-first, dan `triageScore` hoog-naar-laag → neem de eerste `waveSize` missies.

**Bij ontbrekend statusbestand:** maak een leeg `{}` aan en verwerk alle missies uit `config/templateRegistry.ts` als `pending`. Schrijf het lege bestand en noteer: "Statusbestand aangemaakt — eerste wave bevat de eerste {waveSize} missies uit templateRegistry."

## Bekende omgevingsvalkuilen — geef deze mee, laat ze niet opnieuw ontdekken

In de j1p3-ronde liep elke teamgenoot afzonderlijk tegen dezelfde muren. Zet deze punten in
de agentprompt; dat scheelt per agent een verloren ronde.

- **Browsertools vereisen eerst de skill.** Laad `claude-in-chrome` met de Skill-tool vóór
  je een `mcp__claude-in-chrome__*`-tool aanroept, anders volgt "Permission for this tool use
  was denied". Die melding eindigt met "Try a different approach" — dat is standaardtekst,
  **geen** toestemming om uit te wijken naar Playwright of een andere browser.
- **`resize_window` werkt niet.** De melding zegt succes, maar de viewport verandert niet en
  de breedte verschilt per sessie (gemeten: 500px en 1440px). Meet altijd zelf
  `window.innerWidth` vóór je iets over schermformaat beweert. Onder 640px geldt de mobiele
  opmaak, dus 500px is bruikbaar bewijs voor mobiel — 375px halen lukt niet.
- **De dev-previewroute stubt callbacks.** `DevMissionPreview.tsx` geeft `onBack` en
  `onComplete` als lege functies mee en levert geen `stats`. In die route doen de terugknop
  en het voltooien dus sowieso niets: rapporteer dat nooit als missiebug.
- **Paden in `dgskills-mission-review` zijn verouderd.** Lees `src/features/missions/**` en
  `src/config/*.ts`, niet `components/missions/**` of `config/*.ts`.
- **Missies hervatten opgeslagen voortgang** en slaan het introscherm over. Wis die opslag
  niet zonder overleg — dat kan werk van een andere agent vernietigen.

## Dynamische verificatie: speel de missie, lees hem niet alleen

Screenshots hergebruiken is goedkoop, maar een deel van de defecten is per definitie
onzichtbaar in code én in stilstaande beelden. De twee zwaarste vondsten van de j1p3-ronde —
rangschikrondes die de antwoordvolgorde toonden, en open antwoorden die op lengte werden
gekeurd — kwamen alleen boven water doordat iemand de missie daadwerkelijk speelde.

Laat daarom per wave **één** browseragent (niet één per missie) een korte, geprioriteerde
lijst afwerken van claims die statisch niet hard te maken zijn. Standaard drie proeven:

1. **Gokstrategie:** haal de volle score zonder inhoudelijk werk (van boven naar beneden
   klikken, velden vullen met herhaalde tekens). Slaagt dat, dan is de scoring stuk.
2. **Verklap-check:** staat het antwoord al op het scherm (volgorde, badge, teller die het
   aantal juiste antwoorden noemt)?
3. **Berekend contrast bevestigen** op de schermen waar het rapport lage waarden claimt.

Geef die agent expliciet mee dat een weerlegging even waardevol is als een bevestiging.

## Stappenplan

### Stap 1 — Statusindex laden + wave samenstellen

```bash
# Bepaal het bestandspad
STATUS_FILE="business/dgskills-reviews/review-status.json"

# Als het niet bestaat: maak leeg skelet
if [ ! -f "$STATUS_FILE" ]; then
  mkdir -p "$(dirname "$STATUS_FILE")"
  echo '{}' > "$STATUS_FILE"
fi

cat "$STATUS_FILE"
```

**SWEEP:** selecteer wave van `waveSize` missies volgens selectie-logica hierboven.

**GATE:**
- Bij expliciete `missionId`: wave = `[missionId]`.
- Bij `"changed"`: voer uit:

```bash
git diff --name-only HEAD -- 'components/missions/templates/**/configs/*.ts' 'components/missions/*.tsx' 'config/templateRegistry.ts' | \
  grep -oE '[a-z0-9-]+(?=\.ts[x]?$)' | sort -u
```

  Elke missionId uit die output vormt de wave.

Log de wave als: `"Wave {N}: {missionId1}, {missionId2}, ..."` in de wave-samenvatting die je aan het einde schrijft.

### Stap 2 — Whitelist berekenen per missie

Voor elke missie in de wave: bepaal de file-whitelist op basis van metadata (er is geen expliciete mission-author file-list). Gebruik deze logica:

```
1. Lees templateType uit config/templateRegistry.ts voor deze missionId.
   - Als gevonden (template-missie):
       configPath     = src/features/missions/templates/<templateType>/configs/<missionId>.ts
       (of fallback:) = components/missions/templates/<templateType>/configs/<missionId>.ts
       whitelist      = [configPath,
                        "config/templateRegistry.ts (alleen entry voor <missionId>)",
                        "config/agents/year{N}.tsx (alleen agent-rol-entry voor <missionId>)",
                        "config/slo-kerndoelen-mapping.ts (alleen entry voor <missionId>)",
                        "config/curriculum.ts (alleen toevoeging/wijziging voor <missionId>)"]
   - Als niet gevonden (handcrafted):
       grep voor componentpad:
         find components/missions -name "*.tsx" -not -path "*/templates/*" | \
           xargs grep -l "<missionId>" 2>/dev/null | head -1
       whitelist      = [componentPad,
                        "config/templateRegistry.ts (alleen entry voor <missionId>)",
                        "config/agents/year{N}.tsx (alleen agent-rol-entry voor <missionId>)",
                        "config/slo-kerndoelen-mapping.ts (alleen entry voor <missionId>)",
                        "config/curriculum.ts (alleen toevoeging/wijziging voor <missionId>)"]
```

Sla `whitelist` op per missionId — geef je hem door aan zowel de review-sub-agent (voor context) als later de fixer.

### Stap 2.5 — Enginepass: gedeelde templates één keer reviewen

Groepeer de wave op `templateType`. Voor elk template dat in de wave voorkomt spawn je
**één** engine-agent (`model: "opus"`, effort `low`, escaleer naar `medium` bij twijfel).
Die leest de engine plus zijn sub-componenten en beoordeelt uitsluitend het gedeelde gedrag:
scoring, voltooiing, state-herstel, poortlogica en gedeelde toegankelijkheid.

Geef de uitkomst als compact JSON door aan élke missie-agent van dat template. Die hoeft de
engine dan **niet** meer te lezen — alleen zijn eigen config.

Zonder deze stap leest een wave van twaalf scenario-engine-missies dezelfde engine twaalf
keer. De zwaarste defecten van de j1p3-ronde zaten juist in die gedeelde laag — één keer
vinden volstaat, en per missie herhalen levert niets extra's op.

Bij handcrafted missies bestaat geen gedeelde engine: die slaan deze stap over.

### Stap 3 — Fan-out: één Sonnet sub-agent per missie in de wave (parallel)

Spawn alle missie-agents in **één Agent-tool message** (meerdere Agent-tool calls tegelijk), zodat ze parallel draaien. **NIET sequentieel** — parallellisatie is kern van token-efficiency.

Elke agent is `model: "sonnet"`, `subagent_type: "general-purpose"`.

**Agent prompt template** (substitueer alle `{...}`-tokens):

> Je bent de review-agent voor missie `{missionId}` in de DGSkills M4 batch-review-pipeline.
>
> TOKEN-DISCIPLINE: lees alle benodigde files in één pass. Geef uitsluitend compact JSON terug — geen prosa, geen volledige file-inhoud.
>
> **Missie-context:**
> - missionId: `{missionId}`
> - templateType: `{templateType}`
> - configPath: `{configPath}` (null als handcrafted)
> - enginePath: `{enginePath}` — **alleen ter oriëntatie; NIET lezen bij een template-missie**
> - enginebevindingen: `{engineJSON uit Stap 2.5}` (null bij handcrafted)
> - whitelist: `{whitelist als JSON-array}`
>
> **Stap A — Files lezen:** lees `configPath` en de entry voor deze missie in `src/config/slo-kerndoelen-mapping.ts` en `src/config/curriculum.ts`. Lees de engine **niet** — die is in Stap 2.5 al beoordeeld en de uitkomst krijg je hierboven mee. Neem die enginebevindingen over als vaststaand; herhaal ze niet in je eigen JSON, verwijs er alleen naar als ze deze missie raken. Bij een handcrafted missie is er geen gedeelde engine: lees dan wel het missie-component zelf.
>
> **Stap B — Screenshots hergebruiken:** kijk of `screenshots/assignments/{missionId}/` bestanden bevat. Zo ja: gebruik die als visueel bewijs. Zo nee: noteer "geen bestaande screenshots — dynamische verificatie overgeslagen".
>
> **Stap C — Drie rubrics in één pass beoordelen:**
> Lees de criteria uit:
> - `.claude/skills/dgskills-design-reviewer/SKILL.md`
> - `.claude/skills/dgskills-didactiek-reviewer/SKILL.md`
> - `.claude/skills/dgskills-tech-reviewer/SKILL.md`
> (project-root: `/Users/yorinvonder/Downloads/ai-lab---future-architect`)
>
> Beoordeel tegelijk op alle drie assen. Extraheer per as: score (0-10), issues, en voor elk oplosbaar issue een concreet Voorstel-blok (voor/na code-snippet) als het fix binnen de whitelist valt.
>
> **Stap D — Compact JSON output** (GEEN prosa erbuiten):
>
> ```json
> {
>   "missionId": "{missionId}",
>   "reviewDate": "YYYY-MM-DD",
>   "design": { "score": 0-10, "issues": [{"severity":"blocking|warning","description":"...","file":"...","line":0,"fixSnippet":{"before":"...","after":"..."}}] },
>   "didactiek": { "score": 0-10, "issues": [...] },
>   "tech": { "score": 0-10, "issues": [...] },
>   "triageScore": 0.0,
>   "escalations": [{"category":"security|rls|ai-act|structural|prose-only","description":"...","file":"..."}],
>   "autoFixable": [{"axis":"design|didactiek|tech","file":"...","before":"...","after":"..."}],
>   "screenshotsUsed": ["pad/naar/screenshot.png"] | [],
>   "verdict": "ok|fix-eerst|herontwerp"
> }
> ```
>
> `triageScore` = gewogen gemiddelde: `(10 - designScore) * 0.3 + (10 - didactiekScore) * 0.4 + (10 - techScore) * 0.3`. Hoog = slechter.
>
> Schrijf het uitgebreide markdown-rapport naar `business/dgskills-reviews/{missionId}-YYYY-MM-DD.md` met dezelfde structuur als een M2-rapport (drie sub-secties + samenvatting). Geef de compact JSON terug als enige output in dit agent-call (het rapport staat op disk).

**Vermeld bij elke agent-spawn expliciet `model: "sonnet"`** (transparantie-regel).

### Stap 4 — JSON-samenvattingen verzamelen + statusindex bijwerken

Ontvang de JSON van elke sub-agent. Voor elke missie:

1. **Parse compact JSON** — valideer dat alle verplichte velden aanwezig zijn.
2. **Update statusindex-entry:**

```json
{
  "lastReviewed": "<reviewDate>",
  "reviewStatus": "reviewed",
  "triageScore": <triageScore>,
  "priorityBand": "<high als triageScore>=6 | medium als >=3 | low>",
  "reportPath": "business/dgskills-reviews/<missionId>-YYYY-MM-DD.md",
  "openEscalations": [<escalations array>],
  "codexVerdict": null
}
```

3. Schrijf bijgewerkt statusbestand terug naar `business/dgskills-reviews/review-status.json`.

Bij parse-failure van de JSON (sub-agent leverde prosa of ongeldige JSON): zet `reviewStatus: "blocked"`, noteer in `openEscalations: [{"category":"parse-failure","description":"Sub-agent leverde geen geldige JSON"}]`, sla op en ga door met volgende missie.

### Stap 5 — Fixer: mechanische fixes toepassen (alleen op missies met autoFixable items)

Spawn per missie die `autoFixable.length > 0` heeft een Sonnet fixer-agent. Deze volgt de `dgskills-mission-fixer` SKILL.md voor whitelist-enforcement en Edit-uitvoering.

**Fixer-agent prompt template:**

> Je bent de mission-fixer in de DGSkills M4 batch-review-pipeline. Lees de instructies uit `.claude/skills/dgskills-mission-fixer/SKILL.md` (project-root: `/Users/yorinvonder/Downloads/ai-lab---future-architect`).
>
> Input:
> - missionId: `{missionId}`
> - reviewRapportPad: `{reportPath}`
> - whitelist: `{whitelist als JSON-array}`
> - autoFixable: `{autoFixable JSON-array uit stap 3}`
> - attemptNumber: 1
>
> Lever terug als compact JSON:
> ```json
> {
>   "missionId": "...",
>   "applied": [{"file":"...","description":"..."}],
>   "skipped": [{"file":"...","reason":"..."}],
>   "escalations": [{"category":"...","description":"...","file":"..."}]
> }
> ```

Ontvang fixer-JSON → update statusindex: voeg toe aan `autoFixesApplied`, zet `reviewStatus: "fixed"` als er toegepaste fixes zijn.

**Missions met alleen escalaties en geen autoFixable items** sla je over in deze stap — ze gaan direct naar stap 6 als pending escalatie.

### Stap 6 — Codex-gate op fixes + vaste tegenlezing van de dragende claims

Twee verschillende dingen. Sla geen van beide over.

**6a. Gate op toegepaste fixes** — alleen op missies waarbij `applied.length > 0` (stap 5).
De gate valideert de fix, niet de review; missies zonder fix hebben hem niet nodig.

```bash
CODEX_SCRIPT=$(ls -1 ~/.claude/plugins/cache/openai-codex/codex/*/scripts/codex-companion.mjs 2>/dev/null | sort -V | tail -1)
node "$CODEX_SCRIPT" adversarial-review --wait --model gpt-5.5 --effort xhigh --scope working-tree \
  "Review uitsluitend het missie-review rapport {reportPath} en de toegepaste fixes voor missie {missionId}. Geef ALLOW of BLOCK met concrete redenen."
```

Vervang `{reportPath}` en `{missionId}` door de werkelijke waarden.

**6b. Tegenlezing van de dragende claims — altijd, ook zonder fixes.**

Verzamel de zwaarste claims van de hele wave in één bestand (claim + `bestand:regel`) en leg
die voor aan **gpt-5.6-sol** met `--effort high`, met de opdracht ze te **breken** — niet om
de code opnieuw te reviewen.

Harde uitvoeringsregels, uit ondervinding:

- **Splits in groepen van 3-4 claims en draai die parallel.** Eén sessie met veertien claims
  liep vast op de tijdslimiet; vier kleine sessies leverden binnen dezelfde tijd wél
  resultaat en zijn samen goedkoper.
- Vraag per claim één regel: nummer, `BEVESTIGD` / `WEERLEGD` / `ONZEKER`, plus het bewijs.
- Vraag expliciet welke claims **te sterk of te zwak** geformuleerd zijn.
- `--scope working-tree` blijft nodig; `none` bestaat niet als scope.

Verwerk elke correctie vóór oplevering. In de j1p3-ronde: 11 bevestigd, 1 weerlegd, 2
bijgesteld — en één claim bleek juist te zwak. Dit is de goedkoopste manier om te voorkomen
dat een onjuiste bevinding in een rapport aan Yorin belandt, dus hier wordt niet bezuinigd.

**Verwerk Codex-output:**
- Lees `ALLOW` of `BLOCK` + redenen uit Bash-result.
- Update statusindex: `codexVerdict: "ALLOW"|"BLOCK"`.
- Bij BLOCK: voeg Codex-bevindingen toe aan `openEscalations`.
- Update `reviewStatus`: bij ALLOW → `"fixed"`; bij BLOCK → `"reviewed"` (fix nog onvolledig, blijft in queue voor volgende wave).

### Stap 7 — Branch aanmaken + bestanden stagen (GEEN auto-merge)

Bepaal wave-nummer uit statusindex (tel het aantal voltooide waves):

```bash
WAVE_N=$(cat business/dgskills-reviews/review-status.json | \
  python3 -c "import json,sys; d=json.load(sys.stdin); print(sum(1 for v in d.values() if v.get('reviewStatus')=='fixed') // 5 + 1)" 2>/dev/null || echo "1")
BRANCH="fix/batch-review-wave-${WAVE_N}"

git checkout -b "$BRANCH" 2>/dev/null || git checkout "$BRANCH"
```

**Stage bestanden individueel** (nooit `git add .` of `git add -A`):

```bash
# Per missie die autoFixesApplied heeft: stage de specifieke files
for FILE in {whitelist-files-die-gewijzigd-zijn}; do
  git add "$FILE"
done

# Statusindex altijd mee
git add business/dgskills-reviews/review-status.json

# Per-missie rapporten
for REPORT in {reportPaths}; do
  git add "$REPORT"
done
```

Commit met co-author:

```bash
git commit -m "$(cat <<'EOF'
fix(missions): batch-review wave {WAVE_N} — {n} missies gereviewd, {m} auto-fixes

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

**Open een PR naar main — NIET auto-mergen:**

PR-body template (gebruik heredoc):

```
## DGSkills Batch Review — Wave {WAVE_N}

**Missies in deze wave:** {missionIds als kommalijst}
**Auto-fixes toegepast:** {totaal aantal applied fixes}
**Codex-gate:** {ALLOW x missies / BLOCK y missies / niet gerund z missies}

### Toegepaste auto-fixes per missie

{voor elke missie met applied > 0:}
#### {missionId} (Codex: ALLOW|BLOCK|n.v.t.)
- `{file}`: {beschrijving}
- ...

### Openstaande escalaties (niet auto-gefixed)

De volgende issues vereisen handmatige review van Yorin:

| Missie | Categorie | Beschrijving | Bestand |
|--------|-----------|--------------|---------|
{rijen per escalatie, gerangschikt: security > rls > ai-act > structural > prose-only}

### Volgende wave

Missies in queue met hoogste triageScore (high-band eerst):
{top-5 uit statusindex die nog pending zijn}

🤖 Gegenereerd door dgskills-batch-review M4
```

### Stap 8 — Wave-samenvatting rapport schrijven + tonen aan Yorin

**Schrijf wave-samenvatting:**

```bash
DATE=$(date +%Y-%m-%d)
mkdir -p business/dgskills-reviews
SUMMARY_PATH="business/dgskills-reviews/wave-${WAVE_N}-summary-${DATE}.md"
```

Wave-samenvatting bevat:
- Wave-nummer, datum, modus (sweep/gate)
- Tabel: missionId | design-score | didactiek-score | tech-score | triageScore | verdict | codexVerdict | auto-fixes | escalaties
- Openstaande escalaties gerangschikt (zie stap 7 PR-body)
- Aantal missies nog pending in statusindex

**Print naar Yorin** (kort en concreet):

```
Wave {N} klaar — {n} missies gereviewd
Auto-fixes toegepast: {m} ({missionIds})
Codex: {x} ALLOW, {y} BLOCK, {z} niet gerund
PR: {branch-naam} — wacht op jouw review

Top escalaties (handmatig te fixen):
1. {missionId}: {categorie} — {korte beschrijving}
2. ...

Volgende wave: {topMissies uit queue}
Samenvatting: {SUMMARY_PATH}
```

## Whitelist-escalatieregels (identiek aan dgskills-mission-fixer, hier expliciet)

Nooit auto-fixen, altijd escaleren in PR-body:
- `supabase/functions/*` (edge functions) — `dgskills-supabase-edge` reviewer nodig
- `services/PermissionService.ts`, `services/supabase.ts`, `supabase/migrations/*` — auth/RLS → Yorin direct
- EU AI Act Art. 9/12/14 implicaties (bias, transparantie, menselijk toezicht) — Yorin direct
- `components/missions/templates/<engine>/<Engine>.tsx` (gedeelde template-engines) — alleen per-missie configs zijn in scope
- Structurele herontwerpen (verdict = `"herontwerp"`) — buiten fixer-bereik
- Fundamentele SLO-mismatch (kerndoel-koppeling klopt niet inhoudelijk) — Yorin beslist
- Prose-only suggesties zonder concrete before/after snippet — niet mechanisch toepasbaar

## Anti-patronen (doe dit NOOIT)

- ❌ **Alle 86 missies tegelijk in één wave** — gebruik waves van ~5; de statusindex houdt bij welke er nog in de queue zitten
- ❌ **Drie aparte agents per missie (design + didactiek + tech)** — token-verspilling; één agent per missie doet alle drie rubrics in één pass
- ❌ **Codex-gate op elke missie** — alleen op missies die daadwerkelijk fixes ontvingen (gate valideert de fix)
- ❌ **Auto-mergen naar main** — PR openen, Yorin merget
- ❌ **`git add .` of `git add -A`** — altijd individuele bestanden per naam stagen
- ❌ **Commit naar main** — altijd branch `fix/batch-review-wave-N`
- ❌ **Ruwe file-inhoud tussen agents doorsluizen** — alleen compact JSON-samenvattingen
- ❌ **Screenshots opnieuw schieten** als ze al bestaan in `screenshots/assignments/<id>/`
- ❌ **Triage opnieuw uitvoeren** als triageScore al in statusindex staat (herlees alleen als >30 dagen oud)
- ❌ **Security/RLS/AI-act items auto-fixen** — altijd escaleren
- ❌ **Engelse output naar Yorin** — alle samenvatting en PR-body in Nederlands
- ❌ **De gedeelde engine per missie laten lezen** — één enginepass per template (Stap 2.5), daarna alleen de config per missie
- ❌ **Opus `max` gebruiken** — `high` is het plafond in deze pipeline; onzekerheid los je op met een tegenlezer, niet met een zwaarder model
- ❌ **Alles op één modelniveau draaien** — kies per deeltaak het lichtste model dat het aankan (zie tabel bovenaan)
- ❌ **De tegenlezing overslaan omdat er geen fixes waren** — 6b draait altijd, op de dragende claims
- ❌ **Alle claims in één sol-sessie proppen** — splits in groepen van 3-4 en draai parallel, anders loopt de sessie op tijd vast
- ❌ **Alleen code lezen en nooit spelen** — de zwaarste defecten (gratis punten, onzin die volle score haalt) zijn statisch onzichtbaar
- ❌ **Een gestubte `onBack`/`onComplete` in de dev-preview als missiebug rapporteren**
- ❌ **Beweren dat iets op mobiel is getest zonder `window.innerWidth` te hebben gemeten**

## Verificatie (na elke wave-run)

- [ ] `review-status.json` is bijgewerkt voor alle missies in de wave
- [ ] Elk per-missie rapport bestaat in `business/dgskills-reviews/<missionId>-YYYY-MM-DD.md`
- [ ] Wave-samenvatting bestaat in `business/dgskills-reviews/wave-{N}-summary-{DATE}.md`
- [ ] Branch `fix/batch-review-wave-{N}` bestaat en bevat alleen missie-specifieke bestanden + statusindex
- [ ] Geen bestanden buiten whitelist gestaged of gecommit
- [ ] PR-body bevat escalatie-tabel met alle niet-auto-gefixte items
- [ ] Codex-gate gerund op en alleen op missies met toegepaste fixes
- [ ] Geen auto-merge, geen push naar main

## Referenties

- Statusindex: `business/dgskills-reviews/review-status.json`
- Sub-skills (rubrics): `dgskills-design-reviewer`, `dgskills-didactiek-reviewer`, `dgskills-tech-reviewer`
- Fixer-skill: `dgskills-mission-fixer`
- M2 single-mission review: `dgskills-mission-review`
- M3 autonome bouw-loop: `dgskills-build-mission`
- Codex-gate: plugin `openai-codex/codex` met `--model gpt-5.5 --effort xhigh`
- Screenshots: `screenshots/assignments/<missionId>/`
- Wave-PR-branch: `fix/batch-review-wave-{N}`
