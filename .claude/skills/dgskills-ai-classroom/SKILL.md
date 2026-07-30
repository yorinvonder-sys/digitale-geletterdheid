---
name: dgskills-ai-classroom
description: Use this skill when DGSkills missions must be PLAYED in a real browser by simulated students and judged on experience — did they finish, did they stay interested, was the level right, did it fit a lesson. Trigger phrases include "AI-testklas", "laat leerlingen de missie spelen", "hoe ervaart een leerling deze opdracht", "speel de opdracht als leerling", "beoordeel de opdrachten door leerlingogen", "/dgskills-ai-classroom". Activate NIET for code-only review of missions (gebruik `dgskills-batch-review` of `dgskills-mission-review`), niet voor het bouwen van missies (`dgskills-build-mission`), en niet voor platform-brede compliance (`dgskills-compliance-check`).
---

# DGSkills AI-testklas — missies laten spelen en beoordelen

Je bent de orchestrator van de AI-testklas. Twaalf gesimuleerde leerlingen spelen een missie écht door in de browser en jij vertaalt hun ervaringen naar **één oordeel per missie**: `ship`, `fix-eerst` of `herontwerp`.

Dit is de **belevings**-laag. `dgskills-batch-review` leest code en beoordeelt vakinhoud; deze skill kijkt wat er gebeurt als een echte leerling de opdracht opent. Beide bestaan naast elkaar en delen bewust hetzelfde vocabulaire.

## TOKEN-DISCIPLINE (KRITIEK)

Bulk-browserwerk loopt hard op. Harde regels:

- Eén sub-agent per **(missie × leerling)**. Nooit meerdere agents voor dezelfde combinatie.
- De sub-agent geeft **uitsluitend compact JSON** terug. Geen a11y-dumps, geen schermteksten, geen bestandsinhoud in de terugkoppeling — die horen op schijf.
- Alle ruwe bewijsstukken (snapshots, screenshots) schrijft de agent zelf naar schijf. De orchestrator leest ze niet in, alleen de paden.
- De orchestrator plakt nooit missie-code tussen agents door — alleen missie-id, route, bekende bevindingen en het klasprofiel.
- Bekende bevindingen geef je **samengevat** mee (titel + één regel), nooit hele rapporten.

## Veiligheidsgrens (niet onderhandelbaar)

- Uitsluitend tegen een **lokale dev-server**. `dgskills.app` en elk subdomein zijn verboden, net als elke productie- of preview-URL.
- Geen login, geen Supabase-verzoeken, geen databaseschrijfacties, geen echte leerlinggegevens.
- Zie je een agent uitkomen op een niet-localhost origin: breek de run af en meld het.
- Deze skill verandert **nooit** missie-code. Hij observeert en oordeelt. Fixen doet `dgskills-batch-review`.

## Verplichte input

- **Modus:** `sweep` (default), `scout` of `deep`.
- **sweep:** een curriculumperiode als `<leerjaar>-<periode>`, bv. `1-2`. Geen opgave → neem de laagste periode die nog geen eindstatus heeft in de statusindex.
- **scout:** een leerjaar (`1`, `2` of `3`).
- **deep:** één `missionId` (kebab-case).

Ontbreekt input, gebruik de default en noteer die in de samenvatting. Vraag niet opnieuw.

| Modus | Dekking | Leerlingen per missie | Waarvoor |
|---|---|---|---|
| `sweep` | één periode (~8 missies) | 3 (slot A + B + C) | De normale ronde |
| `scout` | een heel leerjaar (~33 missies) | 1 (slot A) | Snel blokkades vinden |
| `deep` | één missie | alle 12 | Een missie die je echt wilt begrijpen |

## Stap 1 — Dev-server starten

`preview_start` met `{name: "ai-classroom-dev"}` (poort 3011). Ontbreekt die configuratie — `.claude/launch.json` staat in `.gitignore`, dus op een verse machine bestaat hij niet — voeg hem toe of start handmatig:

```
node <repo>/node_modules/.bin/vite --port 3011 --root <worktree>
```

met `VITE_SUPABASE_URL=https://dummy.supabase.co` en `VITE_SUPABASE_ANON_KEY=dummy-anon-key-not-real` in de omgeving. Zonder die twee gooit `src/services/supabase.ts` bij import en is de pagina leeg.

**Verificatie vóór je verder gaat:** open `http://localhost:3011/dev/mission-preview?mission=mail-detective` en bevestig dat het introscherm (`[data-qa="mission-intro"]`) verschijnt. Zie je niets, dan compileert de dev-server de grote preview-chunk nog — wacht tot de globale "Laden..."-indicator wég is. Screenshotten tijdens die spinner levert waardeloos bewijs.

## Stap 2 — Missielijst en metadata bepalen

Bron van waarheid is `src/config/curriculum.ts`: `CURRICULUM.yearGroups[<leerjaar>].periods[<periode>]` levert `missions` plus optioneel `reviewMissions`. Samen zijn dat de missies van deze golf.

Verzamel per missie:

| Gegeven | Bron |
|---|---|
| `templateType`, `enableChat` | `src/config/templateRegistry.ts` |
| eigen component ja/nee | `DEDICATED_MISSIONS` in `src/app/AuthenticatedApp.tsx` |
| `difficulty` | `AgentRole` in `src/config/agents/year<N>.tsx` |
| geschatte duur | `getMissionDurationMinutes` in `src/config/missionDurations.ts` |
| thema (`topicLabel`), leerjaar | `src/config/missionMeta.ts` + `src/config/slo-kerndoelen-mapping.ts` |

## Stap 3 — Leerlingen kiezen (deterministisch)

Profielen staan in `tests/ai-students/classroom/*.json`. Laden kan met `loadClassroom()` uit `tests/ai-students/classroom/load-classroom.mjs`.

De keuze mag **niet** per run verschillen — anders zijn twee runs onvergelijkbaar. Pas de slots in volgorde toe en neem de eerste regel die matcht.

**Slot A — interactierisico**
1. `builder-canvas` of `puzzle-lab`, of de missie kent slepen/tekenen → `ipad-iris`
2. duur ≥ 25 minuten, of ≥ 6 fases → `afgeleide-amir`
3. tekstdicht (`scenario-engine`, `review-arena`, `debate-arena`, `ethics-council`) → `taalzwakke-tess`
4. anders → `snelle-sam`

**Slot B — niveaufit**
1. leerjaar 1 én `difficulty: Hard` → `concrete-milan`
2. leerjaar 3 én `difficulty: Easy` → `kritische-vera`
3. leerjaar 3 → `kritische-vera`
4. leerjaar 1 → `concrete-milan`
5. leerjaar 2 → `letterlijke-luca`

**Slot C — betrokkenheid**
1. echte scoredrempel (`scenario-engine`, `password-fortress`, `puzzle-lab`) → `creatieve-cheater`
2. open einde zonder drempel (`builder-canvas`, `debate-arena`, `ethics-council`, pure chat-rol) → `uitzit-umut`
3. anders (`data-viewer`, `simulation-lab`, `review-arena`, `tool-guide`, eigen component) → `gamer-gijs`

Levert dit tweemaal dezelfde leerling op, neem in dat slot de volgende regel. Drie verschillende leerlingen is verplicht. Noteer per missie welke regel elk slot koos — dat is later je verantwoording.

Viewport = `preferredViewports[0]` van het profiel. `ipad-iris` draait altijd **beide** iPad-oriëntaties.

## Stap 4 — Bekende bevindingen ophalen (dedup vooraf)

Vóór de runs: haal voor elke missie op wat al bekend is.

- `business/dgskills-reviews/review-status.json` → `openEscalations` van deze missie
- `business/dgskills-reviews/{missionId}-*.md` → de kopjes van bestaande bevindingen

Vat samen tot maximaal 10 regels van één zin en geef die mee in de opdracht van elke sub-agent. Elke bevinding krijgt straks `novel: true|false`. **Alleen `novel: true` telt mee in het oordeel en haalt de samenvatting.** Zo groeit de bestaande stapel openstaande bevindingen niet.

## Stap 5 — De runs (fan-out)

Eén sub-agent per (missie × leerling), `subagent_type: "general-purpose"`, `model: "sonnet"`. Draai ze **sequentieel** zolang alle agents dezelfde browser delen — parallelle Playwright-sessies vechten om dezelfde pagina en leveren vervuild bewijs.

### Opdrachtsjabloon voor de sub-agent

> Je speelt één DGSkills-missie als leerling en rapporteert wat je meemaakte.
>
> **Je rol:** `<volledige roleplayBrief uit het klasprofiel>`
> **Je let extra op:** `<watchFor>`
> **Je haakt af als:** `<quitsWhen>`
>
> **Missie:** `<missionId>` · **Route:** `http://localhost:3011/dev/mission-preview?mission=<missionId>&reset=1` · **Viewport:** `<viewport>`
> **Al bekend (NIET opnieuw melden als nieuw):** `<max 10 regels>`
>
> **Speel de missie zoals dit karakter hem zou spelen** — niet zoals een tester die alles wil dekken. Blijf in karakter. Haak af als je karakter zou afhaken; dat is een geldige uitkomst en vaak de belangrijkste bevinding.
>
> **Verplicht bewijs**, weg te schrijven naar `~/dgskills-audit/ai-classroom/<missionId>/<personaId>/`:
> 1. een a11y-snapshot bij elk beslismoment (`snapshot-<n>.txt`) — dit is het primaire bewijs, niet de screenshot
> 2. drie screenshots: intro, halverwege, eind
> 3. consolefouten en mislukte verzoeken (alleen HTTP ≥400 en `requestfailed`) in `telemetry.json`
> 4. `actions.json` — wat je in welke volgorde deed
> 5. verscheen `[data-qa="mission-completion"]`? Zo ja: de snapshot die dat aantoont
> 6. **herstel-test:** ververs halverwege de pagina en noteer of je voortgang er nog staat (`dgskills_mission_<missionId>` in localStorage)
>
> **Geen bewijs = geen bevinding.** Elke bevinding verwijst naar een bestand hierboven.
>
> **Drie dingen die GEEN bug zijn — meld ze nooit:**
> - De eindknop lijkt niets te doen. In deze preview is `onComplete` leeg. Controleer of de localStorage-sleutel gewist is; verandert die, dan werkt de knop. In juli waren 4 van de 5 "dode knop"-meldingen dit artefact.
> - Een `bonus-*` missie toont een leeg scherm. Die zitten genest in een oudermissie en werken daar prima.
> - Het eindscherm verschijnt. Alleen `scenario-engine` toetst echt op score (≥40%); negen andere sjablonen melden altijd succes. Beoordeel prestatie op de zichtbare score, niet op het eindscherm.
>
> **Geef terug (compact JSON, niets erbuiten):**
> ```json
> {
>   "missionId": "...", "personaId": "...", "viewport": "...",
>   "completed": true,
>   "quitAtStep": null,
>   "quitReason": null,
>   "minutesEstimate": 14,
>   "visibleScore": "32/50 of null",
>   "progressSurvivedReload": true,
>   "engagement": { "hookedWithin30s": true, "wouldFinishInClass": true, "note": "één zin" },
>   "levelFit": "te-makkelijk | passend | te-moeilijk",
>   "findings": [ { "...report.schema.json issue-velden...", "novel": true } ],
>   "evidencePath": "~/dgskills-audit/ai-classroom/<missionId>/<personaId>/"
> }
> ```
>
> Bevindingen volgen `tests/ai-students/reporting/report.schema.json`: `category` ∈ TECHNICAL/USABILITY/LANGUAGE/DIDACTICS/RESILIENCE, `severity` ∈ BLOCKER/HIGH/MEDIUM/LOW/OBSERVATION, en `evidenceType` ∈ OBJECTIVE/SIMULATION/INFERENCE.
>
> **Wees eerlijk over het soort bewijs.** Een consolefout is `OBJECTIVE`. "Dit boeit mijn karakter niet" is `SIMULATION` en krijgt altijd `requiresHumanValidation: true`. Verkoop een rollenspel-oordeel nooit als meting.

## Stap 6 — Van drie ervaringen naar één oordeel

Vaste regel. Niet zelf afwegen.

| Oordeel | Voorwaarde (eerste die matcht) |
|---|---|
| `herontwerp` | ≥2 van de 3 leerlingen kwamen er niet doorheen · **of** een BLOCKER met `evidenceType: OBJECTIVE` · **of** de missie faalt op ≥3 van de 7 vragen in `docs/pedagogy/rubric.md` voor het beoogde leerjaar |
| `fix-eerst` | ≥1 nieuwe HIGH-bevinding · **of** 1 leerling liep vast · **of** `minutesEstimate` van de traagste leerling > 1,5× de opgegeven duur · **of** `progressSurvivedReload: false` |
| `ship` | Al het overige |

Twee signalen die het oordeel **niet** bepalen maar wél altijd in het rapport komen, omdat ze over lesgeven gaan en niet over kapot zijn:

- `uitzit-umut` haalde een geslaagd-scherm zonder iets te doen → noteer als **"meet niets"**
- `kritische-vera` meldt `levelFit: te-makkelijk` of `gamer-gijs` was binnen 30 seconden afgehaakt → noteer als **"landt niet bij iedereen"**

## Stap 7 — Wegschrijven

| Wat | Waar |
|---|---|
| Rapport per missie | `business/dgskills-reviews/ai-classroom/{missionId}-YYYY-MM-DD.md` |
| Samenvatting van de golf | `business/dgskills-reviews/ai-classroom/wave-j{L}p{P}-YYYY-MM-DD.md` |
| Statusindex | `business/dgskills-reviews/ai-classroom-status.json` |
| Ruw bewijs (buiten Git) | `~/dgskills-audit/ai-classroom/{missionId}/{personaId}/` |

Bewijs staat bewust búíten de repo: de sessie-scratchpad wist zichzelf tijdens wachttijden en worktree-opruiming kan untracked bestanden in de repo weghalen. `~/dgskills-audit/` heeft dat overleefd.

Statusindex per missie:

```json
{
  "<missionId>": {
    "missionId": "mail-detective",
    "lastPlayed": "2026-07-30",
    "wave": "j1p1",
    "verdict": "ship|fix-eerst|herontwerp",
    "personasRun": ["taalzwakke-tess", "concrete-milan", "creatieve-cheater"],
    "completedBy": ["taalzwakke-tess", "concrete-milan"],
    "blockedBy": ["creatieve-cheater"],
    "novelFindings": 2,
    "knownFindingsConfirmed": 1,
    "slowestMinutes": 22,
    "statedMinutes": 15,
    "meetNiets": false,
    "landtNietBijIedereen": true,
    "reportPath": "business/dgskills-reviews/ai-classroom/mail-detective-2026-07-30.md",
    "evidencePath": "~/dgskills-audit/ai-classroom/mail-detective/"
  }
}
```

De samenvatting van de golf is **één tabel**: missie · oordeel · reden in max 12 woorden · wie liep vast. Yorin leest die tabel; de details staan in de rapporten per missie. Geen herhaling, geen opsomming van alle bevindingen in de samenvatting.

## Stap 8 — Branch, commit, PR

Volg het repo-protocol: nooit direct naar `main`, nooit `git add .`, bestanden individueel stagen.

- Branch: `claude/ai-classroom-wave-j{L}p{P}`
- Eén PR per golf, geen auto-merge — Yorin beslist.
- PR-body vereist vijf secties, anders faalt `validate-handoff` in CI: `## Doel` · `## Wat Is Veranderd` · `## Tests` · `## Risico's` · `## Graag Op Letten`

Vermeld in `## Risico's` altijd wat **niet** getest is: serveropslag, XP en dashboardvoortgang blijven `NOT_RUN` omdat de preview-route niets bewaart. En dat de belevingsoordelen simulaties zijn die menselijke bevestiging vragen.

## Anti-patronen

| Verleiding | Waarom fout |
|---|---|
| Agents parallel op één browser draaien om tijd te winnen | Ze vechten om dezelfde pagina; bewijs raakt vervuild en onreproduceerbaar |
| "De agent besluit het oordeel wel" | Het oordeel volgt de tabel in stap 6. Anders is geen enkele golf met een andere vergelijkbaar |
| Een bevinding melden zonder bestandsverwijzing | Dan is het een gevoel, geen bevinding. Zonder bewijs melden we niet |
| Alle bevindingen in de golfsamenvatting zetten | Yorin heeft al 88 openstaande bevindingen. De samenvatting is een beslistabel, geen ticketlijst |
| Een rollenspel-oordeel als `OBJECTIVE` markeren | Ondermijnt het vertrouwen in élke bevinding. Beleving is altijd `SIMULATION` |
| Missie-code aanpassen als je een bug vindt | Deze skill observeert. Fixen gaat via `dgskills-batch-review` |
| De leerlingkeuze aanpassen omdat een andere leerling "interessanter" lijkt | Dan zijn twee runs niet meer vergelijkbaar. De slots in stap 3 zijn bindend |
