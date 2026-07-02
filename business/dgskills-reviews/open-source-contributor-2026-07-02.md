# Missie-review: Open Source Contributor

**Missie-ID:** `open-source-contributor`
**TemplateType:** `builder-canvas`
**Config:** `src/features/missions/templates/builder-canvas/configs/open-source-contributor.ts`
**Wave:** 16 (verse review)
**Datum:** 2026-07-02

---

## Stap A — Config, registratie en feitelijke juistheid

### Registratie-check (compleet)

| Bron | Status |
|---|---|
| `templateRegistry.ts:57` | ✅ aanwezig, `builder-canvas`, `enableChat: true` |
| `missionGoals.ts:625` | ✅ aanwezig, coherent met steps |
| `slo-kerndoelen-mapping.ts:158` | ✅ aanwezig — **inhoud wijkt af, zie bevinding 1** |
| `basisvaardigheden-mapping.ts:580` | ✅ aanwezig — **claim wijkt af van inhoud, zie bevinding 2** |
| `agentRoleIds.ts:80` | ✅ aanwezig |
| `missionThumbnails.ts:80` | ✅ aanwezig |
| `agents/year3.tsx:358` | ✅ aanwezig, volledige `systemInstruction` |
| `curriculum.ts:258` | ✅ geplaatst in leerjaar 3 (buildMissions) |

Interface-conformiteit tegen `BuilderCanvasConfig` (`BuilderCanvas.tsx:30-45`): alle verplichte velden aanwezig (`missionId`, `title`, `introEmoji/Title/Description`, `enableChat`, `previewType`, `steps` (4), `maxScore`, `badges`, `takeaways`). Geen technische afwijkingen.

### Bevinding 1 — SLO-bron-inconsistentie (kritiek, feitelijk)

De **autoritaire** `slo-kerndoelen-mapping.ts:158` registreert:
```ts
{ id: 'open-source-contributor', ..., sloKerndoelen: ['22B', '23C'] }
```//  comment: "22A,23B→23C: git/code = programmeren + open source community"

Maar de `systemInstruction` in `agents/year3.tsx:391` zegt letterlijk aan het model:
```
SLO KERNDOELEN: 22A (Digitale vaardigheden toepassen in praktische contexten), 22B (Programmeren: ontwerpen, schrijven en testen van programma's).
```

Dit noemt **22A** (niet in de autoritaire mapping) en **mist 23C volledig** (wél in de autoritaire mapping). Twee bronnen die docenten/leerlingen zien claimen verschillende kerndoelen voor dezelfde missie.

Inhoudelijke check van wat de missie daadwerkelijk dekt:
- **22B** (Programmeren): ✅ sterk gedekt — de hele missie is Git-workflow + bugfix schrijven.
- **22A** (Digitale producten): ✅ ook plausibel gedekt (workflow toepassen is een praktische digitale vaardigheid) — dus de systemInstruction-claim is niet fout, maar wijkt af van wat de autoritaire mapping zegt.
- **23C** (Maatschappij — "hoe digitale technologie en de samenleving elkaar wederzijds beïnvloeden"): ⚠️ zwak gedekt. Geen enkele stap laat de leerling nadenken over de maatschappelijke rol van open source (bijv. dat kritieke infrastructuur wereldwijd op onbetaald vrijwilligerswerk draait, wie er wel/niet toegang toe heeft, of waarom bedrijven bijdragen). De missie is functioneel-technisch, niet maatschappij-analyserend.

**Voorstel 1 — SLO-bronnen synchroniseren:**

Voor: `src/config/agents/year3.tsx:391`
```
SLO KERNDOELEN: 22A (Digitale vaardigheden toepassen in praktische contexten), 22B (Programmeren: ontwerpen, schrijven en testen van programma's).
```

Na (aansluiten bij autoritaire mapping, én 23C tastbaar maken in de rol):
```
SLO KERNDOELEN: 22B (Programmeren: ontwerpen, schrijven en testen van programma's), 23C (Maatschappij: hoe digitale technologie en de samenleving elkaar beïnvloeden — open source als wereldwijde samenwerkingsvorm).
```

Om 23C ook daadwerkelijk didactisch te dekken (niet alleen te noemen), voorstel voor een korte toevoeging in de `KERNIDEE`-sectie (`year3.tsx:404-405`) — Na:
```
KERNIDEE:
Leerlingen leren hoe de professionele open source workflow werkt: van het begrijpen van een issue tot het indienen van een pull request. Ze ontdekken dat samenwerken aan code een gestructureerd proces vereist met duidelijke communicatie en verantwoordelijkheid. Dit is relevant omdat open source bijdragen een van de meest gewaardeerde ervaringen is op een CV in de tech-wereld.

Daarnaast ontdekken leerlingen dat open source een maatschappelijk fenomeen is: grote delen van internet en kritieke software draaien op vrijwillig werk van wereldwijde communities, zonder centrale eigenaar. Dat roept vragen op over wie bijdraagt, wie profiteert en waarom bedrijven meewerken aan iets dat "gratis" is.
```

---

### Bevinding 2 — Beloofd leerdoel "licenties" ontbreekt volledig (didactisch)

`basisvaardigheden-mapping.ts:580-586` claimt:
```ts
ETHIEK('Leerling leert over samenwerking, licenties en eerlijk delen van kennis.'),
```

Grep op "licentie|license|MIT|GPL|copyright" in zowel de builder-canvas config als de volledige agent-rol (`year3.tsx:358-448`) levert **nul treffers** op. Het begrip licentie komt in de missie helemaal niet voor — niet in de steps, niet in de systemInstruction, niet in de checklistItems.

Dit is relevant: licenties zijn een basaal open-source concept (mag je de code gebruiken/aanpassen/verkopen? MIT vs. GPL vs. "alle rechten voorbehouden") en precies het soort ethiek-vraagstuk dat de basisvaardigheden-tag claimt te bedekken. Een leerling die deze missie voltooit heeft geen idee wat een licentie is, ondanks dat het platform aan docenten claimt dat dit geleerd wordt.

**Voorstel 2 — Licentie-concept toevoegen aan stap 1 (git-workflow):**

Voor: `open-source-contributor.ts:22-27` (step `git-workflow`)
```ts
description:
    'Open source projecten leven op GitHub. De workflow is altijd hetzelfde: Fork (kopieer het project naar je account) → Clone (download het naar je computer) → Branch (maak een eigen tak) → Fix → Commit → Push → Pull Request. Dit is hoe miljoenen developers wereldwijd samenwerken.',
instruction:
    'Beschrijf de complete open source workflow stap voor stap in eigen woorden. Leg bij elke stap uit: wat doe je, en waarom is deze stap nodig? Schrijf ook de bijbehorende Git-commando\'s op. Begin bij `git clone` en eindig bij `git push`. Verklaar ook het verschil tussen een "fork" en een "clone" — veel beginners verwarren ze.',
tip: 'Nooit direct op de `main`-branch werken bij een open source project. Altijd een nieuwe branch aanmaken, bijv. `git checkout -b fix/zoek-sortering`. Zo houd je je wijzigingen gescheiden.',
checklistItems: [
    { id: 'zes-stappen', label: 'De workflow is beschreven in minimaal 6 stappen' },
    { id: 'commando', label: 'Bij elke stap staat het Git-commando' },
    { id: 'fork-clone', label: 'Het verschil tussen fork en clone is uitgelegd' },
    { id: 'branch', label: 'Ik heb uitgelegd waarom je een aparte branch aanmaakt' },
],
```

Na (licentie-vraag toegevoegd aan instructie + checklist, description krijgt een zin over licenties):
```ts
description:
    'Open source projecten leven op GitHub. De workflow is altijd hetzelfde: Fork (kopieer het project naar je account) → Clone (download het naar je computer) → Branch (maak een eigen tak) → Fix → Commit → Push → Pull Request. Dit is hoe miljoenen developers wereldwijd samenwerken. Elk open source project heeft ook een licentie (bijv. MIT of GPL) die bepaalt wat jij wel en niet mag doen met de code.',
instruction:
    'Beschrijf de complete open source workflow stap voor stap in eigen woorden. Leg bij elke stap uit: wat doe je, en waarom is deze stap nodig? Schrijf ook de bijbehorende Git-commando\'s op. Begin bij `git clone` en eindig bij `git push`. Verklaar ook het verschil tussen een "fork" en een "clone" — veel beginners verwarren ze. Leg ten slotte kort uit: wat is een licentie (bijv. MIT), en waarom moet je die checken voordat je code van een ander project gebruikt of aanpast?',
tip: 'Nooit direct op de `main`-branch werken bij een open source project. Altijd een nieuwe branch aanmaken, bijv. `git checkout -b fix/zoek-sortering`. Zo houd je je wijzigingen gescheiden.',
checklistItems: [
    { id: 'zes-stappen', label: 'De workflow is beschreven in minimaal 6 stappen' },
    { id: 'commando', label: 'Bij elke stap staat het Git-commando' },
    { id: 'fork-clone', label: 'Het verschil tussen fork en clone is uitgelegd' },
    { id: 'branch', label: 'Ik heb uitgelegd waarom je een aparte branch aanmaakt' },
    { id: 'licentie', label: 'Ik heb uitgelegd wat een licentie is en waarom die belangrijk is' },
],
```

---

### Feitelijke juistheid Git/PR-inhoud (positief)

De technische kern van de missie is correct:
- Workflow-volgorde Fork → Clone → Branch → Fix → Commit → Push → PR is de standaard GitHub-contributieflow.
- Het sorteerprobleem (instabiele sort bij gelijke datums, tiebreaker nodig) is een reëel en veelvoorkomend bug-patroon; de gevraagde oplossing (secundaire sleutel op titel) is de juiste aanpak.
- PR-conventies zijn correct: beschrijvende titel, "Closes #42"-syntax (GitHub's issue-auto-close-keyword), teststappen voor reviewer.
- Didactische volgorde (issue begrijpen → reproduceren → pas dan coderen) is precies de professionele praktijk en wordt ook zo als tip benadrukt (`instruction` stap `issue-analyseren`).

Geen feitelijke fouten gevonden in de Git/PR-content zelf.

---

### Coach-plan vs. canvas-stappen (bekend platform-patroon, kort genoteerd)

De `systemInstruction` (chat-rol) heeft een eigen 3-fasen `steps`-array (`Repository verkennen` / `Issue oplossen` / `Pull request maken`) met 3 STEP_COMPLETE-markers, terwijl de builder-canvas 4 losse steps heeft (`git-workflow`, `issue-analyseren`, `bugfix`, `pull-request`). Dit is het bekende platform-brede coach-plan-desync-patroon (chat-rol en canvas-template zijn onafhankelijk ontworpen) — een platform-beslispunt, geen missie-specifiek issue. Niet verder uitgewerkt in dit rapport.

---

## Stap B — UI/UX-review-dekking

- **Geen screenshots-map** gevonden onder `.ui-review/` voor deze missie.
- **Geen vermelding** van `open-source-contributor` in `docs/audits/student-missions-ui-ux-review-2026-06-30.md` (grep leverde 0 treffers).

Deze missie is dus niet gedekt door de laatste platform-brede UI/UX-sweep. Geen visuele bevindingen beschikbaar; dit rapport steunt uitsluitend op config-/code-analyse.

---

## Stap C — Rubric-scores

**Schaal: 0-10 kwaliteit, 10 = uitstekend.**

| Rubric | Score | Onderbouwing |
|---|---|---|
| **Design** | 7/10 | Correcte builder-canvas-toepassing, heldere tip/checklist-structuur per stap, coherente badge-progressie. Geen recente UI/UX-screenshotdata beschikbaar (Stap B) → lichte onzekerheid, geen aftrek voor concrete gebreken. |
| **Didactiek** | 6/10 | Sterke stapsgewijze opbouw (issue→reproductie→fix→PR volgt de professionele praktijk) en realistisch scenario. Aftrek voor: SLO-bron-inconsistentie tussen autoritaire mapping en systemInstruction (Bevinding 1), en een expliciet beloofd leerdoel (licenties, Bevinding 2) dat nergens in de missie-inhoud terugkomt. |
| **Techniek** | 8/10 | Alle 8 registratiepunten compleet en coherent, volledige interface-conformiteit tegen `BuilderCanvasConfig`, technisch/inhoudelijk correcte Git- en PR-content zonder fouten. |

**triageScore** = (10-7)×0.3 + (10-6)×0.4 + (10-8)×0.3 = 0.9 + 1.6 + 0.6 = **3.1**

---

## Samenvatting voor Voorstel-toepassing

Twee concrete, scoped voorstellen klaar voor toepassing (M3-fixer-compatibel):
1. **Voorstel 1**: SLO-claim in `agents/year3.tsx:391` + `KERNIDEE` (regel 404-405) synchroniseren met de autoritaire `slo-kerndoelen-mapping.ts` (22B/23C i.p.v. 22A/22B), inclusief tastbare 23C-dekking in de kernidee-tekst.
2. **Voorstel 2**: Licentie-concept toevoegen aan stap `git-workflow` in `open-source-contributor.ts` (description-zin + instructie-vraag + nieuw checklistItem), zodat de ETHIEK-claim in `basisvaardigheden-mapping.ts` daadwerkelijk gedekt wordt.

Geen wijzigingen aangebracht — uitsluitend review conform opdracht ("Wijzig NIETS").
