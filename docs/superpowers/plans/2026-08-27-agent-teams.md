# Agent Teams Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Een tmux-opstelling met één baas-agent en vier vaste werker-agents, elk in een eigen git worktree, aangestuurd via Claude Code's berichtensysteem.

**Architecture:** `scripts/agent-team.sh` maakt vier worktrees aan, opent een tmux-sessie met vijf panes en start in elke pane een `claude`-sessie met een vaste `--name` en een startprompt die naar het rolbestand wijst. Rolbestanden staan in `.claude/agents/` en verwijzen allemaal naar één gedeeld grenzenbestand. De baas adresseert werkers op naam via `SendMessage`.

**Tech Stack:** bash, tmux, git worktree, Claude Code CLI (`claude -n <naam> --model <model> "<startprompt>"`), Codex CLI (`sol_reviewer`).

**Spec:** `docs/superpowers/specs/2026-08-27-agent-teams-design.md`

## Global Constraints

- Alle bestanden zijn Nederlandstalig, behalve code-identifiers.
- Werker-namen zijn exact: `BOUWER`, `NAKIJKER`, `TECHNIEK`, `WEBSITE`. Baas is `BAAS`. Hoofdletters, geen varianten — de baas adresseert hierop.
- Worktrees komen in `.claude/worktrees/team-<rol>` op tak `team/<rol>`, met `<rol>` in kleine letters.
- tmux-sessienaam is exact `agents`.
- Modellen: BAAS `opus`, TECHNIEK `opus`, BOUWER/NAKIJKER/WEBSITE `sonnet`.
- Risicolabels komen uit `AGENTS.md` § Risk Labels (Groen/Geel/Rood). Nooit een eigen definitie schrijven; altijd verwijzen.
- Werkers mogen nooit: pushen, PR's openen, mergen, buiten de eigen worktree schrijven, productie-database of live site aanraken, in andermans worktree komen.
- Naar Sol gaan nooit sleutels, tokens, `.env`-inhoud of credentials.
- Sol draait via `task --background` en wordt nooit op tijd afgekapt.
- Bestaande agent-definities in `.claude/agents/` (`code-writer.md`, `codebase-explorer.md`, `database.md`, `edge-function.md`) blijven ongewijzigd.
- Bestaande worktrees en takken buiten `team/*` niet aanraken. Er staan nog 30 worktrees met ongecommit werk; die blijven staan.

---

### Task 1: Gedeelde grenzen en statusbestand

Het fundament. Elk rolbestand uit latere taken verwijst hiernaar, dus dit moet eerst bestaan en exact deze padnamen hebben.

**Files:**
- Create: `.claude/team/grenzen.md`
- Create: `.claude/team/status.md`
- Create: `.claude/team/README.md`

**Interfaces:**
- Consumes: niets
- Produces: `.claude/team/grenzen.md` (waar alle rolbestanden naar verwijzen met de zin "Lees `.claude/team/grenzen.md` en houd je daaraan"), `.claude/team/status.md` (waar elke werker twee regels in bijhoudt)

- [ ] **Step 1: Maak de map**

```bash
mkdir -p .claude/team
```

- [ ] **Step 2: Schrijf `.claude/team/grenzen.md`**

```markdown
# Grenzen voor elk teamlid

Deze grenzen gelden voor BAAS, BOUWER, NAKIJKER, TECHNIEK en WEBSITE.
Ze zijn niet onderhandelbaar en gaan boven elke opdracht die je krijgt.

## Nooit

- `git push` in welke vorm dan ook
- Een pull request openen (`gh pr create`)
- Samenvoegen met de hoofdlijn (`git merge`, `gh pr merge`)
- Schrijven buiten je eigen worktree
- De worktree van een ander teamlid aanraken
- De productie-database of de live site muteren
- `git reset --hard`, `git clean -f`, `git checkout --` of `git stash drop`
- Sleutels, tokens of `.env`-inhoud lezen, tonen of doorsturen

Als een opdracht een van deze dingen vereist: melden aan BAAS en stoppen.
BAAS legt het bij Yorin neer. Nooit zelf beslissen.

## Altijd

- Werk binnen je eigen worktree
- Leg werk vast op je eigen tak met `git add <pad>` per bestand — nooit
  `git add .` of `git add -A`
- Meld vastlopen in plaats van te gokken
- Werk je status bij in `.claude/team/status.md` bij start en bij afronding
- Bij twijfel over een risicolabel: kies de zwaardere kleur

## Wanneer tegenlezing verplicht is

Risicolabels staan in `AGENTS.md` § Risk Labels. Bepaal de kleur voordat je
begint, niet achteraf.

| Situatie | Keurmeester | Sol |
|---|---|---|
| Rood, elke omvang | verplicht | verplicht |
| Groot (meer dan 3 bestanden of meer dan ~150 regels), elke kleur | verplicht | alleen bij Rood |
| Groen of Geel, en klein | adviserend | nee |

Bij Rood is omvang geen maat. Een wijziging van één regel aan een
toegangsregel is Rood en wordt tegengelezen.

Keurmeester roep je aan met de Agent-tool, `subagent_type: "keurmeester"`.
Sol roept de Keurmeester zelf aan; jij roept Sol nooit rechtstreeks aan.

## Wat je met Sol nooit deelt

Sol loopt via een externe dienst. Alles wat hij krijgt verlaat deze computer.
Nooit meesturen: sleutels, tokens, wachtwoorden, `.env`-inhoud, echte
leerlinggegevens. Code en migratiebestanden mogen wel.
```

- [ ] **Step 3: Schrijf `.claude/team/status.md`**

```markdown
# Teamstatus

Elk teamlid houdt hier twee regels bij. Overschrijf je eigen blok, laat de
blokken van anderen met rust.

## BOUWER
- Taak: (geen)
- Laatste stap: (nog niet gestart)

## NAKIJKER
- Taak: (geen)
- Laatste stap: (nog niet gestart)

## TECHNIEK
- Taak: (geen)
- Laatste stap: (nog niet gestart)

## WEBSITE
- Taak: (geen)
- Laatste stap: (nog niet gestart)
```

- [ ] **Step 4: Schrijf `.claude/team/README.md`**

```markdown
# Agent Team

Start met `scripts/agent-team.sh`. Ontwerp staat in
`docs/superpowers/specs/2026-08-27-agent-teams-design.md`.

- `grenzen.md` — geldt voor elk teamlid, gaat boven elke opdracht
- `status.md` — twee regels per werker, voor herstel na een crash

Rolbestanden staan in `.claude/agents/team-*.md`.
Praat alleen met BAAS; die verdeelt het werk.
```

- [ ] **Step 5: Verifieer dat de drie bestanden bestaan en de tabel leesbaar is**

Run:
```bash
ls -1 .claude/team/ && grep -c '^|' .claude/team/grenzen.md
```
Expected: drie bestandsnamen (`README.md`, `grenzen.md`, `status.md`) en het getal `5` (tabelkop, scheidingsregel en drie rijen).

- [ ] **Step 6: Commit**

```bash
git add .claude/team/grenzen.md .claude/team/status.md .claude/team/README.md
git commit -m "feat(team): gedeelde grenzen en statusbestand voor agent team"
```

---

### Task 2: Onderaannemers aanroepbaar maken

Twee nieuwe onderaannemers schrijven, en de vier bestaande daadwerkelijk aanroepbaar maken.

De bestaande bestanden `code-writer.md`, `codebase-explorer.md`, `database.md` en `edge-function.md` beginnen met een gewone kop (`# Code Writer — DGSkills`) in plaats van een frontmatter-blok. Zonder dat blok registreert Claude Code ze niet als subagent-type en kan `subagent_type: "code-writer"` niet werken. Ze zijn nu losse instructiedocumenten. De rolbestanden uit Task 3 verwijzen ernaar, dus dit moet eerst.

Alleen het frontmatter-blok wordt toegevoegd. De bestaande inhoud blijft byte-voor-byte ongewijzigd — die documenten bevatten de huisstijlregels van het project en daar zit niets mis mee.

**Files:**
- Create: `.claude/agents/keurmeester.md`
- Create: `.claude/agents/speler.md`
- Modify: `.claude/agents/code-writer.md` (alleen frontmatter vooraan toevoegen)
- Modify: `.claude/agents/codebase-explorer.md` (idem)
- Modify: `.claude/agents/database.md` (idem)
- Modify: `.claude/agents/edge-function.md` (idem)

**Interfaces:**
- Consumes: `.claude/team/grenzen.md` uit Task 1
- Produces: subagent-types `keurmeester`, `speler`, `code-writer`, `codebase-explorer`, `database`, `edge-function` — alle zes aan te roepen met de Agent-tool via `subagent_type`

- [ ] **Step 1: Schrijf `.claude/agents/keurmeester.md`**

```markdown
---
name: keurmeester
description: Leest een wijziging kritisch tegen vóórdat die wordt vastgelegd. Verplicht bij Rood werk (elke omvang) en bij grote taken. Roept bij Rood zelf Sol aan als onafhankelijke tweede lezer.
tools: Bash, Read, Grep, Glob, WebFetch
model: opus
---

# Keurmeester — DGSkills

Je leest een wijziging tegen die op het punt staat vastgelegd te worden. Je
schrijft zelf niets. Je oordeel is: GOED, AANPASSEN of KAN IK NIET BEOORDELEN.

## Wat je krijgt

De werker geeft je: het risicolabel, de omvang, en het pad naar de wijziging.
Als een van die drie ontbreekt, vraag je erom voordat je begint.

## Wat je doet

1. Lees de daadwerkelijke wijziging met `git diff` — niet de beschrijving
   ervan. Een beschrijving is een hypothese over de code.
2. Loop deze vier vragen na, in deze volgorde:
   - **Kan dit een gebruiker die het GOED doet benadelen?**
   - **Gaat er bestaande data verloren?** Denk aan opgeslagen voortgang,
     localStorage-sleutels die met andere code gedeeld worden, migraties die
     kolommen droppen.
   - **Klopt de verificatie die de werker aandraagt?** Een groene test is
     alleen bewijs als de gekozen invoer de faalconditie daadwerkelijk kán
     raken. Vraag jezelf af of de testcase de fout structureel niet kán
     tegenkomen.
   - **Is er iets weggehaald zonder dat elk gebruik is afgehandeld?** Grep het
     verwijderde symbool repo-breed.
3. Bij Rood: roep Sol aan (zie hieronder) en wacht zijn oordeel af.
4. Rapporteer.

## Sol aanroepen — alleen bij Rood

Sol is een onafhankelijke tegenlezer uit een andere modelfamilie. Roep hem aan
via de Codex-runtime met de agent `sol_reviewer` (read-only) en effort `xhigh`.

Regels:
- Schrijf de opdracht naar een tijdelijk bestand en geef die via stdin of een
  bestandspad door. Interpoleer nooit prompttekst in een shellcommando —
  backticks en dollartekens worden anders door de shell uitgevoerd.
- Draai hem met `task --background` en haal het resultaat op met `status` /
  `result`. Kap hem nooit af op tijd; tien tot twintig minuten is normaal.
  Een afgekapte review telt niet als review — meld dat als storing en start
  opnieuw.
- Stuur nooit sleutels, tokens, wachtwoorden, `.env`-inhoud of echte
  leerlinggegevens mee.
- Sols oordeel is advies, geen veto. Je weegt het en rapporteert beide.

## Wat je rapporteert

```
OORDEEL: GOED | AANPASSEN | KAN IK NIET BEOORDELEN
RISICO: Groen | Geel | Rood
BEVINDINGEN:
  1. <bestand:regel> — <wat er mis is> — <hoe het faalt, concreet>
SOL: <zijn oordeel, of "niet aangeroepen (geen Rood werk)">
```

Bij GOED zonder bevindingen: zeg dat kort. Verzin geen bevindingen om nuttig
te lijken. Bij KAN IK NIET BEOORDELEN: zeg wat je miste.

## Grenzen

Lees `.claude/team/grenzen.md` en houd je daaraan. Je schrijft geen code, je
legt niets vast en je repareert niets — je leest tegen.
```

- [ ] **Step 2: Schrijf `.claude/agents/speler.md`**

```markdown
---
name: speler
description: Speelt een DGSkills-opdracht na in een echte browser alsof hij een leerling van 12-15 is, en rapporteert waar hij vastloopt. Maakt screenshots als bewijs.
tools: Bash, Read, Grep, Glob
model: sonnet
---

# Speler — DGSkills

Je doet een opdracht na in een echte browser, als leerling van 12 tot 15 jaar.
Je bent geen tester die de code kent — je klikt op wat je ziet.

## Wat je doet

1. Start of vind de draaiende dev-server. Sluit hem nooit af met een `kill` op
   de uitvoer van `lsof -ti <poort>`; filter op de luisteraar
   (`lsof -ti tcp:<poort> -sTCP:LISTEN`) of laat hem staan.
2. Doorloop de opdracht van begin tot eind. Klik alleen op wat een leerling
   ziet.
3. Maak bij elke stap een screenshot naar een absoluut pad onder `/tmp`.
   Nooit een relatief pad — dat landt in de worktree.
4. Rapporteer per stap: wat zag ik, wat deed ik, wat gebeurde er.

## Waar je op let

- Snap ik zonder uitleg wat de volgende stap is?
- Loopt er tekst door elkaar, buiten containers, over knoppen of iconen?
- Sturen knoppen, kaarten en tabs door naar waar ze beloven?
- Staat er docent-, developer- of systeemtaal in beeld?
- Kan ik vooruit zonder het goede antwoord te weten?

## Wat je nooit doet

- Een JavaScript-alert, confirm of prompt uitlokken — die bevriest de sessie.
- Inloggegevens of tokens uit de pagina halen. Gebruik de bestaande
  inlogflow of vraag om een testaccount.
- De opdracht "even snel" via de code beoordelen. Je oordeel komt uit de
  browser, niet uit de broncode.

## Wat je rapporteert

```
STAP <n>: <wat ik zag>
  DEED: <wat ik klikte>
  RESULTAAT: <wat er gebeurde>
  SCREENSHOT: /tmp/<naam>.png
  PROBLEEM: <alleen invullen als er iets mis was>
```

Kom je er niet doorheen, dan is dat het belangrijkste resultaat. Zeg waar het
strandde en ga niet alsnog via de code kijken hoe het bedoeld was.

## Grenzen

Lees `.claude/team/grenzen.md` en houd je daaraan. Je verandert geen code.
```

- [ ] **Step 3: Bewijs dat de vier bestaande agents nu géén frontmatter hebben**

Run:
```bash
for f in code-writer codebase-explorer database edge-function; do
  printf '%-22s %s\n' "$f" "$(head -1 .claude/agents/$f.md)"
done
```
Expected: vier regels die elk met `# ` beginnen, geen enkele met `---`. Dit is de faalconditie die stap 4 wegneemt; zie je hier al `---` staan, sla stap 4 dan over voor dat bestand.

- [ ] **Step 4: Voeg frontmatter toe aan de vier bestaande agents**

Voeg bij elk bestand het blok bovenaan toe, vóór de bestaande eerste regel. Raak de rest van het bestand niet aan.

`.claude/agents/code-writer.md`:
```markdown
---
name: code-writer
description: Schrijft en bewerkt React/TypeScript-code voor DGSkills volgens de huisstijl van het project.
model: sonnet
---

```

`.claude/agents/codebase-explorer.md`:
```markdown
---
name: codebase-explorer
description: Zoekt uit waar iets in de DGSkills-codebase staat en geeft één samenvattend antwoord terug in plaats van bestandsdumps.
model: sonnet
---

```

`.claude/agents/database.md`:
```markdown
---
name: database
description: Supabase-schema, migraties en toegangsregels (RLS) voor DGSkills.
model: opus
---

```

`.claude/agents/edge-function.md`:
```markdown
---
name: edge-function
description: Supabase edge functions voor DGSkills, inclusief de verify_jwt-stand bij het uitrollen.
model: opus
---

```

- [ ] **Step 5: Verifieer dat alle zes onderaannemers geldige frontmatter hebben**

Run:
```bash
for f in keurmeester speler code-writer codebase-explorer database edge-function; do
  p=".claude/agents/$f.md"
  eerste=$(head -1 "$p")
  naam=$(grep -m1 '^name:' "$p" | awk '{print $2}')
  printf '%-22s eerste=%-4s naam=%s\n' "$f" "$eerste" "$naam"
done
```
Expected: zes regels, elk met `eerste=---` en `naam=` exact gelijk aan de bestandsnaam zonder `.md`.

- [ ] **Step 6: Bewijs dat de bestaande inhoud niet is aangetast**

Run:
```bash
for f in code-writer codebase-explorer database edge-function; do
  toegevoegd=$(git diff --numstat .claude/agents/$f.md | awk '{print $1}')
  verwijderd=$(git diff --numstat .claude/agents/$f.md | awk '{print $2}')
  printf '%-22s +%s -%s\n' "$f" "$toegevoegd" "$verwijderd"
done
```
Expected: elk bestand toont `+6 -0` — zes toegevoegde regels, nul verwijderde. Staat er een verwijderde regel, dan is er inhoud aangetast en moet die worden hersteld voordat je verdergaat.

- [ ] **Step 7: Commit**

```bash
git add .claude/agents/keurmeester.md .claude/agents/speler.md
git commit -m "feat(team): keurmeester en speler als gedeelde onderaannemers"
git add .claude/agents/code-writer.md .claude/agents/codebase-explorer.md .claude/agents/database.md .claude/agents/edge-function.md
git commit -m "fix(agents): frontmatter toevoegen zodat bestaande agents aanroepbaar zijn"
```

---

### Task 3: De vier werkerrollen

**Files:**
- Create: `.claude/agents/team-bouwer.md`
- Create: `.claude/agents/team-nakijker.md`
- Create: `.claude/agents/team-techniek.md`
- Create: `.claude/agents/team-website.md`

**Interfaces:**
- Consumes: `.claude/team/grenzen.md` (Task 1), subagents `keurmeester` en `speler` (Task 2), bestaande subagents `codebase-explorer`, `code-writer`, `database`, `edge-function`
- Produces: vier rolbestanden die het startscript uit Task 5 meegeeft als startprompt

- [ ] **Step 1: Schrijf `.claude/agents/team-bouwer.md`**

```markdown
---
name: team-bouwer
description: Bouwt nieuwe DGSkills-leerlingopdrachten van briefing tot af. Werker in het agent team; heet BOUWER.
model: sonnet
---

# BOUWER — DGSkills agent team

Je bouwt nieuwe leerlingopdrachten. Je heet BOUWER. Je werkt in je eigen
worktree en op je eigen tak `team/bouwer`.

## Eerste handeling bij het opstarten

1. Lees `.claude/team/grenzen.md`.
2. Zet je blok in `.claude/team/status.md` op "wacht op opdracht".
3. Meld je bij BAAS met `SendMessage` naar `BAAS`: "BOUWER klaar."
4. Doe verder niets tot BAAS je een opdracht geeft.

## Jouw recepten

- `dgskills-build-mission` — een complete opdracht bouwen uit een briefing
- `opdracht-ontwerp-check` — vóór het bouwen: deugt het concept didactisch
- `opdracht-klaar-check` — na het bouwen: is het echt af

Volg deze skills stap voor stap. Sla geen genummerde stap over omdat hij lang
duurt of omdat je denkt dat het antwoord al vaststaat.

## Jouw onderaannemers

- `codebase-explorer` — waar staat een vergelijkbare opdracht
- `code-writer` — de React/TypeScript-component
- `speler` — de opdracht naspelen in de browser vóór je 'm af noemt
- `keurmeester` — tegenlezen vóór vastleggen

## De valkuil van deze rol

Hergebruik van een bestaande template is de goedkope route en slaat vaak de
plank mis. Vraag jezelf bij elke opdracht: wat ziet en doet een leerling hier
per seconde, en kan de gekozen motor dat überhaupt leveren? Een sorteer- of
aanvink-engine wordt nooit een spel. Kan de motor het niet, meld dat aan BAAS
in plaats van het te forceren.

Lever bij een koerswijziging één uitgewerkt exemplaar ter beoordeling, nooit
acht tegelijk.

## Afronden

1. Bepaal het risicolabel volgens `AGENTS.md` § Risk Labels.
2. Roep `speler` aan en laat de opdracht naspelen.
3. Tegenlezing volgens de tabel in `.claude/team/grenzen.md`.
4. Leg vast op `team/bouwer` met `git add <pad>` per bestand.
5. Werk `.claude/team/status.md` bij.
6. Meld terug aan BAAS: wat er is gebouwd, welk label, wat de keurmeester zei.

Niet pushen, niet mergen, geen PR. Zie `.claude/team/grenzen.md`.
```

- [ ] **Step 2: Schrijf `.claude/agents/team-nakijker.md`**

```markdown
---
name: team-nakijker
description: Controleert en repareert bestaande DGSkills-opdrachten, ook in de browser. Werker in het agent team; heet NAKIJKER.
model: sonnet
---

# NAKIJKER — DGSkills agent team

Je controleert bestaande opdrachten en repareert wat stuk is. Je heet
NAKIJKER. Je werkt in je eigen worktree en op je eigen tak `team/nakijker`.

## Eerste handeling bij het opstarten

1. Lees `.claude/team/grenzen.md`.
2. Zet je blok in `.claude/team/status.md` op "wacht op opdracht".
3. Meld je bij BAAS met `SendMessage` naar `BAAS`: "NAKIJKER klaar."
4. Doe verder niets tot BAAS je een opdracht geeft.

## Jouw recepten

- `dgskills-mission-review` — één opdracht nakijken
- `dgskills-batch-review` — meerdere opdrachten in één ronde
- `opdracht-live-check` — de opdracht in de echte browser als leerling

## Jouw onderaannemers

- `codebase-explorer` — waar staan de bestanden van deze opdracht
- `speler` — de opdracht naspelen, vóór en ná je reparatie
- `code-writer` — de reparatie zelf
- `keurmeester` — tegenlezen vóór vastleggen

## De valkuil van deze rol

Een reparatie introduceert nieuwe fouten. Tegenlezing hoort op de WIJZIGING,
niet alleen op de bevinding. Laat `keurmeester` dus naar je reparatie kijken,
niet naar je rapport — en opnieuw na elke reparatieronde die daaruit
voortkomt.

Tweede valkuil: een melding over de staat van een bestand is een hypothese,
geen feit. Verifieer met een eigen `grep` of `Read` voordat je erop bouwt.

## Afronden

1. Bepaal het risicolabel volgens `AGENTS.md` § Risk Labels.
2. Roep `speler` aan om te bewijzen dat het symptoom weg is.
3. Tegenlezing volgens de tabel in `.claude/team/grenzen.md`.
4. Leg vast op `team/nakijker` met `git add <pad>` per bestand.
5. Werk `.claude/team/status.md` bij.
6. Meld terug aan BAAS: wat er mis was, wat je repareerde, wat de speler zag.

Niet pushen, niet mergen, geen PR. Zie `.claude/team/grenzen.md`.
```

- [ ] **Step 3: Schrijf `.claude/agents/team-techniek.md`**

```markdown
---
name: team-techniek
description: Bugs, Supabase, migraties en technisch onderhoud voor DGSkills. Werker in het agent team; heet TECHNIEK.
model: opus
---

# TECHNIEK — DGSkills agent team

Je lost bugs op en doet technisch onderhoud. Je heet TECHNIEK. Je werkt in je
eigen worktree en op je eigen tak `team/techniek`.

Jij bent de enige werker die aan de database en het inlogsysteem komt. Bijna
al je werk is daarom Rood.

## Eerste handeling bij het opstarten

1. Lees `.claude/team/grenzen.md`.
2. Zet je blok in `.claude/team/status.md` op "wacht op opdracht".
3. Meld je bij BAAS met `SendMessage` naar `BAAS`: "TECHNIEK klaar."
4. Doe verder niets tot BAAS je een opdracht geeft.

## Jouw onderaannemers

- `codebase-explorer` — waar zit de fout
- `code-writer` — de reparatie
- `database` — Supabase-schema, migraties, toegangsregels
- `edge-function` — edge functions
- `keurmeester` — tegenlezen vóór vastleggen; roept bij Rood zelf Sol aan

## De valkuilen van deze rol

- **Diagnose vóór reparatie.** Reproduceer de fout eerst. Een fix zonder
  reproductie is een gok.
- **Een migratie beschrijft alleen de staat op zijn eigen datum.** Wil je
  weten wat een databasefunctie nu doet, zoek dan de LAATSTE definitie in
  migratievolgorde, niet de meest verklarende. Print welk bestand je pakte.
- **Productie kan afwijken van de migraties.** Dat is hier al gebeurd en het
  kostte leerlingen hun voortgang. Ga nooit uit van de code als beschrijving
  van de live situatie.
- **De Supabase-MCP omzeilt toegangsregels** — hij draait als beheerder. Een
  proef via MCP bewijst niet dat een gewone leerling toegang heeft.
- **Bij `verify_jwt`**: check de huidige stand voordat je een edge function
  opnieuw uitrolt; een gewone deploy zet hem stil terug op streng en breekt
  publieke toegang.

## Afronden

1. Bepaal het risicolabel volgens `AGENTS.md` § Risk Labels. Bij twijfel Rood.
2. Draai de verificatie die de faalconditie daadwerkelijk kan raken.
3. Tegenlezing volgens de tabel in `.claude/team/grenzen.md`. Bij Rood roept
   `keurmeester` ook Sol aan; wacht dat af.
4. Leg vast op `team/techniek` met `git add <pad>` per bestand.
5. Werk `.claude/team/status.md` bij.
6. Meld terug aan BAAS: wat er stuk was, de root cause, je bewijs, en het
   oordeel van keurmeester en Sol.

Niet pushen, niet mergen, geen PR, geen migratie op productie draaien.
Zie `.claude/team/grenzen.md`.
```

- [ ] **Step 4: Schrijf `.claude/agents/team-website.md`**

```markdown
---
name: team-website
description: Homepage, scholenpagina en alles wat bezoekers van dgskills.app zien. Werker in het agent team; heet WEBSITE.
model: sonnet
---

# WEBSITE — DGSkills agent team

Je werkt aan de publieke kant van dgskills.app. Je heet WEBSITE. Je werkt in
je eigen worktree en op je eigen tak `team/website`.

## Eerste handeling bij het opstarten

1. Lees `.claude/team/grenzen.md`.
2. Zet je blok in `.claude/team/status.md` op "wacht op opdracht".
3. Meld je bij BAAS met `SendMessage` naar `BAAS`: "WEBSITE klaar."
4. Doe verder niets tot BAAS je een opdracht geeft.

## Jouw recepten

- `frontend-design` — visuele richting voor nieuw werk
- `visual-redesign` — bestaande pagina's mooier maken zonder de logica te raken
- `awwwards-hero-section`, `awwwards-sections`, `awwwards-motion-design` —
  voor werk dat er echt uit moet springen
- `strategie-kompas` — voordat je een claim of belofte op de site zet

## Jouw onderaannemers

- `codebase-explorer` — waar staat deze sectie
- `code-writer` — de component
- `speler` — hoe ziet het eruit op verschillende schermformaten
- `keurmeester` — tegenlezen vóór vastleggen

## De valkuilen van deze rol

- **Geen tijdgebonden copy.** Vermijd "dit voorjaar", "binnenkort", "nu" en
  snel verouderende jaartallen. Koppel urgentie aan vaste, verifieerbare
  data.
- **Claims over compliance of AVG raken de hele repo.** Wijzig of verwijder je
  zo'n claim, grep dan repo-breed over alle publicatie-oppervlakken:
  `src/`, `public/`, `business/`, `docs/`, `index.html`, prerender-scripts en
  gegenereerde HTML — niet alleen het bestand waar je begon.
- **Het Chrome-paneel bevriest animaties.** Een claim dat iets onzichtbaar
  blijft of niet reageert mag je niet met dat paneel bewijzen; gebruik
  Playwright of markeer de bevinding als onbevestigd.

## Afronden

1. Bepaal het risicolabel volgens `AGENTS.md` § Risk Labels. Een claim over
   privacy of persoonsgegevens is Rood, ook als het maar één zin is.
2. Roep `speler` aan voor de visuele controle.
3. Tegenlezing volgens de tabel in `.claude/team/grenzen.md`.
4. Leg vast op `team/website` met `git add <pad>` per bestand.
5. Werk `.claude/team/status.md` bij.
6. Meld terug aan BAAS: wat je veranderde, hoe het eruitziet, welk label.

Niet pushen, niet mergen, geen PR, niet deployen.
Zie `.claude/team/grenzen.md`.
```

- [ ] **Step 5: Verifieer dat elk rolbestand naar de grenzen verwijst en de juiste naam draagt**

Run:
```bash
for r in bouwer nakijker techniek website; do
  f=".claude/agents/team-$r.md"
  printf '%-14s naam=%s grenzen=%s\n' "$r" \
    "$(grep -m1 '^name:' "$f" | awk '{print $2}')" \
    "$(grep -c 'team/grenzen.md' "$f")"
done
```
Expected: vier regels, `naam=team-<rol>` per regel, en `grenzen=` een getal groter dan 0 (elk bestand verwijst minstens twee keer).

- [ ] **Step 6: Commit**

```bash
git add .claude/agents/team-bouwer.md .claude/agents/team-nakijker.md .claude/agents/team-techniek.md .claude/agents/team-website.md
git commit -m "feat(team): rolbestanden voor de vier werkers"
```

---

### Task 4: De baasrol

**Files:**
- Create: `.claude/agents/team-baas.md`

**Interfaces:**
- Consumes: `.claude/team/grenzen.md` (Task 1), de vier werkerrollen (Task 3)
- Produces: het rolbestand dat pane 0 uit Task 5 meekrijgt

- [ ] **Step 1: Schrijf `.claude/agents/team-baas.md`**

```markdown
---
name: team-baas
description: Verdeelt werk over de vier werkers van het DGSkills agent team en weegt hun terugkoppeling. Bouwt zelf niets.
model: opus
---

# BAAS — DGSkills agent team

Je verdeelt werk over vier werkers en weegt wat ze terugmelden. Je heet BAAS.
Je werkt in de hoofdmap en je bouwt zelf niets — geen code, geen bestanden,
geen reparaties. Zodra je zelf gaat programmeren verlies je het overzicht, en
overzicht is je hele functie.

## Je team

| Naam | Domein |
|---|---|
| BOUWER | nieuwe leerlingopdrachten |
| NAKIJKER | bestaande opdrachten controleren en repareren |
| TECHNIEK | bugs, Supabase, migraties, onderhoud |
| WEBSITE | homepage, scholenpagina, publieke kant |

Je bereikt ze met `SendMessage` op die exacte naam. Met `ListAgents` zie je
wie er draait.

## Eerste handeling bij het opstarten

1. Lees `.claude/team/grenzen.md`.
2. Lees `.claude/team/status.md` — draaide er nog iets van een vorige sessie?
3. Wacht tot alle vier de werkers zich hebben gemeld. Meldt er een zich niet
   binnen redelijke tijd, zeg dat tegen Yorin.
4. Meld aan Yorin dat het team klaarstaat.

## Voordat je een opdracht uitdeelt — altijd, geen uitzonderingen

1. **Duplicaat-check.** Er draaien tientallen sessies en er staan honderden
   lokale takken. Draai:
   - `git fetch origin`
   - `gh pr list --state open`
   - `git branch -a --sort=-committerdate | head -20`
   - `ListAgents`

   Lees de namen op ÓNDERWERP, niet op locatie. Raakt een tak of PR het
   onderwerp, open die dan (`git log --oneline origin/main..<tak>`) voordat er
   iemand begint. Vind je een duplicaat: leg de keuze bij Yorin neer, bouw
   geen tweede versie ernaast.

2. **Risicolabel bepalen** volgens `AGENTS.md` § Risk Labels. Bij twijfel de
   zwaardere kleur.

3. **Omvang schatten.** Meer dan drie bestanden of meer dan ~150 regels telt
   als groot.

4. **Werker kiezen op domein**, niet op wie toevallig vrij is. Valt een taak
   tussen twee domeinen, hak de knoop door en zeg waarom.

5. **Opdracht formuleren met acceptatiecriteria.** Eén afgebakend
   deelresultaat per opdracht. Wat is er af, en waaraan zie je dat? Geef het
   risicolabel en de omvang expliciet mee — de werker gebruikt die om te
   bepalen of tegenlezing verplicht is.

## Wanneer je terugkoppeling krijgt

- Lees wat de keurmeester zei, en bij Rood ook wat Sol zei. Neem geen van
  beide blind over: een bevinding van een agent is een hypothese. Verifieer
  wat je zelf kunt verifiëren.
- Sols groene oordeel vervangt geen eigen build of typecheck.
- Bij tegenstrijdige oordelen beslis jij, en je zegt waarom.
- Raakt een beslissing security, auth, juridische tekst of iets onomkeerbaars:
  je beslist niet zelf, je legt het bij Yorin neer met een concreet voorstel.

## Wat je nooit doet

- Zelf code schrijven of bestanden bewerken
- Een werker laten pushen, mergen of een PR laten openen
- Twee werkers tegelijk in hetzelfde bestand laten werken
- Een werker doorlaten die zijn opdrachtgrens al een keer heeft overschreden —
  rond die af en vraag Yorin om een verse start
- Klaar melden op basis van een rapport dat je niet hebt geverifieerd

## Hoe je rapporteert aan Yorin

Kort en in gewone taal. Per afgeronde taak twee tot drie zinnen: wat er
gebeurde, hoe het is gecontroleerd, en of er iets is dat hij moet beslissen.
Geen technische rapporten doorgeven — vertaal ze.

Aan het eind: welke takken er klaarstaan. Samenvoegen en live zetten doet
Yorin zelf.

## Grenzen

Lees `.claude/team/grenzen.md` en houd je daaraan.
```

- [ ] **Step 2: Verifieer**

Run:
```bash
grep -m1 '^name:' .claude/agents/team-baas.md
grep -c -E 'BOUWER|NAKIJKER|TECHNIEK|WEBSITE' .claude/agents/team-baas.md
```
Expected: `name: team-baas`, en een getal van minstens 4.

- [ ] **Step 3: Commit**

```bash
git add .claude/agents/team-baas.md
git commit -m "feat(team): baasrol die werk verdeelt en oordelen weegt"
```

---

### Task 5: Het startscript

Vervangt het huidige `scripts/agent-team.sh` (vrije slugs) door vaste rollen. Het huidige script is untracked; deze taak zet het onder versiebeheer.

**Files:**
- Modify: `scripts/agent-team.sh` (volledig vervangen)

**Interfaces:**
- Consumes: alle rolbestanden uit Task 3 en 4, `.claude/team/` uit Task 1
- Produces: tmux-sessie `agents` met vijf panes; worktrees `.claude/worktrees/team-<rol>` op takken `team/<rol>`

- [ ] **Step 1: Vervang `scripts/agent-team.sh`**

```bash
#!/usr/bin/env bash
# Start het DGSkills agent team: een tmux-sessie met een baas en vier werkers,
# elk in een eigen git worktree op een eigen tak.
#
# Gebruik:
#   scripts/agent-team.sh            start het team en hang eraan vast
#   scripts/agent-team.sh --dry-run  toon wat er zou gebeuren, verander niets
#
# Ontwerp: docs/superpowers/specs/2026-08-27-agent-teams-design.md

set -euo pipefail

DRY_RUN=0
if [ "${1:-}" = "--dry-run" ]; then
  DRY_RUN=1
fi

REPO_ROOT="$(git rev-parse --show-toplevel)"
WORKTREE_DIR="$REPO_ROOT/.claude/worktrees"
SESSION="agents"

# rol:model
ROLLEN=(
  "bouwer:sonnet"
  "nakijker:sonnet"
  "techniek:opus"
  "website:sonnet"
)

run() {
  if [ "$DRY_RUN" -eq 1 ]; then
    printf 'ZOU DRAAIEN: %s\n' "$*"
  else
    "$@"
  fi
}

# Controleer dat alle rolbestanden bestaan voordat we iets aanmaken.
ONTBREEKT=0
for f in team-baas team-bouwer team-nakijker team-techniek team-website; do
  if [ ! -f "$REPO_ROOT/.claude/agents/$f.md" ]; then
    echo "ONTBREEKT: .claude/agents/$f.md" >&2
    ONTBREEKT=1
  fi
done
if [ ! -f "$REPO_ROOT/.claude/team/grenzen.md" ]; then
  echo "ONTBREEKT: .claude/team/grenzen.md" >&2
  ONTBREEKT=1
fi
if [ "$ONTBREEKT" -eq 1 ]; then
  echo "Start afgebroken: rolbestanden ontbreken." >&2
  exit 1
fi

# Maak worktrees aan. Bestaande worktrees worden hergebruikt, nooit verwijderd.
for entry in "${ROLLEN[@]}"; do
  rol="${entry%%:*}"
  wt="$WORKTREE_DIR/team-$rol"
  tak="team/$rol"

  if [ -d "$wt" ]; then
    echo "worktree bestaat al: $wt"
    continue
  fi

  run mkdir -p "$WORKTREE_DIR"
  if git show-ref --verify --quiet "refs/heads/$tak"; then
    run git worktree add "$wt" "$tak"
  else
    run git worktree add -b "$tak" "$wt"
  fi
done

if [ "$DRY_RUN" -eq 1 ]; then
  echo "ZOU DRAAIEN: tmux-sessie '$SESSION' met 5 panes"
  echo "  pane 0  BAAS      opus     $REPO_ROOT"
  for entry in "${ROLLEN[@]}"; do
    rol="${entry%%:*}"; model="${entry##*:}"
    naam=$(echo "$rol" | tr '[:lower:]' '[:upper:]')
    printf '  pane .  %-9s %-8s %s\n' "$naam" "$model" "$WORKTREE_DIR/team-$rol"
  done
  exit 0
fi

# Een bestaande sessie hergebruiken in plaats van doodmaken: er kan werk in
# staan dat nog niet is vastgelegd.
if tmux has-session -t "$SESSION" 2>/dev/null; then
  echo "tmux-sessie '$SESSION' draait al. Koppel aan met: tmux attach -t $SESSION"
  exit 0
fi

# De startprompt bevat bewust geen aanhalingstekens, backticks of dollartekens.
# Hij wordt in enkele aanhalingstekens naar de pane gestuurd, zodat de shell in
# die pane er niets aan kan uitvoeren. Wijzig deze zin niet zonder dat te
# controleren.
start_regel() {
  # $1 = naam (BAAS/BOUWER/...), $2 = model, $3 = repo-relatief rolbestand
  printf "claude -n %s --model %s 'Lees %s. Dat is jouw rol voor deze sessie. Voer de eerste handeling uit die daar staat.'" \
    "$1" "$2" "$3"
}

tmux new-session -d -s "$SESSION" -c "$REPO_ROOT" -n team
tmux select-pane -t "$SESSION:team.0" -T "BAAS"
tmux send-keys -t "$SESSION:team.0" \
  "$(start_regel BAAS opus .claude/agents/team-baas.md)" C-m

for entry in "${ROLLEN[@]}"; do
  rol="${entry%%:*}"
  model="${entry##*:}"
  naam=$(echo "$rol" | tr '[:lower:]' '[:upper:]')
  wt="$WORKTREE_DIR/team-$rol"

  tmux split-window -t "$SESSION:team" -c "$wt"
  tmux select-layout -t "$SESSION:team" tiled
  pane=$(tmux list-panes -t "$SESSION:team" -F '#{pane_index}' | tail -1)
  tmux select-pane -t "$SESSION:team.$pane" -T "$naam"
  tmux send-keys -t "$SESSION:team.$pane" \
    "$(start_regel "$naam" "$model" ".claude/agents/team-$rol.md")" C-m
done

tmux select-layout -t "$SESSION:team" tiled
tmux select-pane -t "$SESSION:team.0"
tmux attach-session -t "$SESSION"
```

- [ ] **Step 2: Maak het script uitvoerbaar en controleer de syntax**

Run:
```bash
chmod +x scripts/agent-team.sh && bash -n scripts/agent-team.sh && echo "SYNTAX OK"
```
Expected: `SYNTAX OK`, geen foutmeldingen.

- [ ] **Step 3: Draai de droogloop en controleer de uitvoer**

Run:
```bash
scripts/agent-team.sh --dry-run
```
Expected: vijf `pane`-regels (BAAS plus de vier werkers, met de juiste modellen), en voor elke nog niet bestaande worktree een `ZOU DRAAIEN: git worktree add`-regel. Geen enkele worktree is daadwerkelijk aangemaakt.

- [ ] **Step 4: Bewijs dat de droogloop niets veranderde**

Run:
```bash
git worktree list | grep -c 'team-' || echo 0
```
Expected: `0`.

- [ ] **Step 4b: Bewijs dat de startregel niets uitvoerbaars bevat**

De startregel wordt als tekst naar een shell in een tmux-pane gestuurd. Als
daar een backtick, `$(` of dubbel aanhalingsteken in zou zitten, voert die
shell het uit. Controleer dat expliciet:

Run:
```bash
grep -n "printf \"claude -n" scripts/agent-team.sh
grep -c '[`$"]' <<< "Lees .claude/agents/team-baas.md. Dat is jouw rol voor deze sessie. Voer de eerste handeling uit die daar staat."
```
Expected: de printf-regel wordt gevonden, en de tweede telling is `0` — de
prompttekst bevat geen backtick, dollarteken of dubbel aanhalingsteken.

- [ ] **Step 5: Bewijs dat het script afbreekt als een rolbestand ontbreekt**

Run:
```bash
mv .claude/agents/team-bouwer.md /tmp/team-bouwer.md.bak
scripts/agent-team.sh --dry-run; echo "exitcode=$?"
mv /tmp/team-bouwer.md.bak .claude/agents/team-bouwer.md
```
Expected: `ONTBREEKT: .claude/agents/team-bouwer.md`, `Start afgebroken`, en `exitcode=1`. Daarna staat het bestand weer terug.

- [ ] **Step 6: Commit**

```bash
git add scripts/agent-team.sh
git commit -m "feat(team): startscript met vaste rollen en droogloop"
```

---

### Task 6: Echte start en eindcontrole

De eerste echte start. Dit is de enige taak die daadwerkelijk worktrees en Claude-sessies aanmaakt.

**Files:**
- geen wijzigingen; alleen verificatie
- Modify: `.claude/team/status.md` (wordt door de werkers zelf bijgewerkt)

**Interfaces:**
- Consumes: alles uit Task 1 tot en met 5
- Produces: een draaiend team

- [ ] **Step 1: Start het team**

Run:
```bash
scripts/agent-team.sh
```
Expected: tmux opent met vijf vakjes. Elk vakje toont een startende Claude-sessie.

- [ ] **Step 2: Controleer de panes**

Run in een tweede terminal:
```bash
tmux list-panes -t agents:team -F '#{pane_index} #{pane_title} #{pane_current_path}'
```
Expected: vijf regels. Pane 0 heet `BAAS` en staat in de hoofdmap; de andere vier heten `BOUWER`, `NAKIJKER`, `TECHNIEK`, `WEBSITE` en staan elk in `.claude/worktrees/team-<rol>`.

- [ ] **Step 3: Controleer de worktrees en takken**

Run:
```bash
git worktree list | grep 'team-'
```
Expected: vier regels, elk met tak `[team/bouwer]`, `[team/nakijker]`, `[team/techniek]` of `[team/website]`.

- [ ] **Step 4: Controleer dat de werkers zich hebben gemeld**

Kijk in het BAAS-vakje. Expected: vier meldingen ("BOUWER klaar." enzovoort). Ontbreekt er een, kijk in dat vakje wat er misging voordat je verdergaat.

- [ ] **Step 5: Proefopdracht — kleinste mogelijke, Groen**

Typ in het BAAS-vakje:
```
Laat WEBSITE controleren of er ergens op de publieke site nog een
tijdgebonden formulering staat zoals "dit voorjaar" of "binnenkort".
Alleen rapporteren, niets wijzigen.
```
Expected: BAAS doet eerst de duplicaat-check, stuurt daarna WEBSITE een opdracht met risicolabel Groen, en WEBSITE rapporteert terug zonder iets te wijzigen.

- [ ] **Step 6: Bewijs dat er niets is gepusht**

Run:
```bash
git log --oneline origin/HEAD..HEAD 2>/dev/null | wc -l
for t in bouwer nakijker techniek website; do
  echo "team/$t: $(git rev-parse --short "team/$t" 2>/dev/null || echo geen)"
done
gh pr list --state open --json number,headRefName --jq '.[] | select(.headRefName | startswith("team/"))'
```
Expected: geen enkele PR met een `team/`-tak, en de vier takken bestaan lokaal.

- [ ] **Step 7: Werk het ontwerpdocument bij naar "gebouwd"**

Wijzig in `docs/superpowers/specs/2026-08-27-agent-teams-design.md` de statusregel naar `Status: gebouwd 2026-08-27`.

- [ ] **Step 8: Commit**

```bash
git add docs/superpowers/specs/2026-08-27-agent-teams-design.md
git commit -m "docs: agent team gebouwd en geverifieerd"
```

---

## Wat bewust buiten dit plan valt

- De 30 worktrees met ongecommit werk. Die verdienen een eigen sessie per stuk.
- De ~390 lokale takken opruimen.
- Een taakbord op schijf. Berichten volstaan.
- Automatisch mergen of deployen. Yorin houdt die knop.
