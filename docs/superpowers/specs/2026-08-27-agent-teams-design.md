# Agent Teams voor dgskills.app — ontwerp

Datum: 2026-08-27
Status: gebouwd 2026-08-27, nog niet in gebruik genomen

## Waarom

Yorin wil minder zelf hoeven sturen. Nu briefst hij elke agent apart. Doel: één
baas-agent die het werk verdeelt over vaste werkers, terwijl hij live meekijkt
en kan inspringen.

Randvoorwaarde uit de voorgeschiedenis van dit project: agents hebben eerder
ongevraagd gepusht, PR's geopend en dubbel werk gebouwd. Het ontwerp maakt die
routes structureel dicht in plaats van ze in proza te verbieden.

## Opzet in één plaatje

```
JIJ
 └─ BAAS                    tmux-vakje, Opus, verdeelt werk, bouwt zelf niets
     ├─ BOUWER              eigen vakje, eigen worktree, eigen tak
     ├─ NAKIJKER            eigen vakje, eigen worktree, eigen tak
     ├─ TECHNIEK            eigen vakje, eigen worktree, eigen tak
     └─ WEBSITE             eigen vakje, eigen worktree, eigen tak
          └─ onderaannemers  kortlevend, binnen de worktree van hun werker
```

Communicatie loopt via Claude Code's eigen berichtensysteem (`ListAgents` /
`SendMessage`), niet via `tmux send-keys`. Reden: een prompt die via de shell
wordt getypt breekt op backticks, `$()` en aanhalingstekens. Dat is in dit
project eerder misgegaan (lessons-learned 2026-08-21, 2026-08-11).

tmux levert alleen het beeld: vijf vakjes naast elkaar, zodat Yorin ziet wat er
gebeurt en kan inspringen.

## De vier werkers

| Werker | Domein | Skills | Model |
|---|---|---|---|
| Bouwer | Nieuwe leerlingopdrachten van briefing tot af | `dgskills-build-mission`, `opdracht-ontwerp-check`, `opdracht-klaar-check` | Sonnet |
| Nakijker | Bestaande opdrachten controleren en repareren, incl. browser | `dgskills-mission-review`, `dgskills-batch-review`, `opdracht-live-check` | Sonnet |
| Techniek | Bugs, Supabase, migraties, onderhoud | `code-writer`, `database`, `edge-function` | Opus |
| Website | Homepage, scholenpagina, publieke kant | `frontend-design`, `visual-redesign`, `awwwards-*` | Sonnet |

Techniek draait op Opus omdat die als enige aan database en auth komt.

Rolbestanden komen in `.claude/agents/team-<rol>.md`. Dat formaat werkt zowel
als startinstructie voor een tmux-vakje als voor aanroep via de Agent-tool.

## Gedeelde gereedschapskist (onderaannemers)

Niet per werker eigen onderaannemers — één gedeelde set waar alle vier uit
putten.

| Onderaannemer | Doet | Voor wie | Bestaat |
|---|---|---|---|
| Verkenner | Zoekt uit waar iets in de code staat | alle vier | ja (`codebase-explorer`) |
| Schrijver | Schrijft React/TS volgens huisstijl | Bouwer, Techniek, Website | ja (`code-writer`) |
| Speler | Speelt de opdracht na in een echte browser, maakt screenshots | Bouwer, Nakijker, Website | nieuw |
| Keurmeester | Leest de wijziging kritisch tegen vóór vastleggen | alle vier | nieuw |
| Database | Supabase, migraties, RLS | alleen Techniek | ja (`database`, `edge-function`) |

De Keurmeester bestaat omdat reparaties in dit project aantoonbaar nieuwe fouten
introduceren (lessons-learned 2026-08-07: 7 regressies uit één reparatieronde,
waarvan 3 blokkerend). Tegenlezing hoort op de wijziging, niet alleen op de
bevinding.

De Speler bestaat omdat "de code klopt" en "een leerling komt er doorheen" twee
verschillende dingen zijn.

## Sol als onafhankelijke tegenlezer

Sol (`gpt-5.6-sol` via Codex, agent `sol_reviewer`, read-only) is geen
tmux-vakje. Hij is een tweede paar ogen uit een andere modelfamilie en maakt
daarom andere blinde vlekken dan Claude.

```
Rode wijziging
   ├─ Keurmeester (Claude)  → leest tegen
   └─ Sol (extern)          → leest onafhankelijk tegen
              ↓
         BAAS weegt beide en beslist
```

Grenzen om Sol heen:

- Nooit sleutels, tokens, `.env`-inhoud of credentials naar Sol. Hij loopt via
  een externe dienst; alles wat hij krijgt verlaat de machine.
- Nooit afkappen op tijd. Draaien via `task --background` + `status`/`result`.
  Een afgekapte review telt niet als review.
- Sol beslist niet. Zijn oordeel is advies. Auth- en toegangswerk krijgt altijd
  óók een eigen Opus-review; Sols groen vervangt geen eigen build/typecheck.

## Wanneer tegenlezing verplicht is

Risicolabels komen uit `AGENTS.md` (§ Risk Labels) — geen nieuw begrip:

- **Groen**: copy, statische docs, onschuldige UI-politoer
- **Geel**: formulieren, dashboards, API-reads, gewone productlogica
- **Rood**: auth, admin, Supabase/RLS, AI-endpoints, secrets, betalingen,
  abonnementen, facturen, KYC, bankgegevens, persoonsgegevens, webhooks,
  exports, database-migraties, toestemming, gegevens van minderjarigen

Drempel:

| Situatie | Keurmeester | Sol |
|---|---|---|
| Rood (elke omvang) | verplicht | verplicht |
| Groot (LARGE/VERY_LARGE), elke kleur | verplicht | nee, tenzij Rood |
| Groen/Geel én klein | adviserend | nee |

Bij Rood is omvang expliciet géén maat. De RLS-drift op `mission_progress` die
leerlingvoortgang wiste was een kleine wijziging.

## Wat werkers wel en niet mogen

Wel:
- Lezen, bouwen, testen binnen de eigen worktree
- Werk vastleggen (commit) op de eigen tak
- Terugmelden aan de baas
- Vastlopen melden in plaats van gokken

Niet:
- Pushen naar GitHub
- Pull requests openen
- Samenvoegen met de hoofdlijn
- Schrijven buiten de eigen worktree
- Productie-database of live site aanraken
- In de worktree van een andere werker komen

Deze zes komen letterlijk in elk rolbestand.

## Wat de baas doet vóór hij uitdeelt

1. Duplicaat-check. Er draaien tientallen sessies en er staan ~390 lokale
   takken. `gh pr list --state open`, `git branch -a --sort=-committerdate` en
   `ListAgents` lezen op ónderwerp, niet op locatie.
2. Risicolabel bepalen (Groen/Geel/Rood) en omvang schatten.
3. Werker kiezen op domein, niet op wie vrij is.
4. Opdracht met expliciete acceptatiecriteria doorgeven via `SendMessage`.

De baas bouwt zelf niets. Zodra de baas gaat programmeren verliest hij het
overzicht, en dat is precies het probleem dat dit ontwerp oplost.

## Herstel na een crash

Elke werker houdt in `.claude/team/status.md` in twee regels bij waar hij is:
huidige taak en laatste afgeronde stap. Geen taakbord-systeem, alleen genoeg om
na het dichtklappen van de laptop te weten wat er liep.

## Dagelijks gebruik

```
scripts/agent-team.sh
```

Vijf vakjes, werkers melden zich bij de baas. Yorin praat alleen met de baas in
gewone taal. Aan het eind van de dag staan er vier takken met afgerond werk.
Niets staat online — samenvoegen en deployen doet Yorin bewust en zelf.

## Wat er gebouwd moet worden

1. `scripts/agent-team.sh` aanpassen: vaste rollen in plaats van vrije slugs,
   vijf panes, rolbestand meegeven bij start
2. `.claude/agents/team-bouwer.md`, `-nakijker.md`, `-techniek.md`,
   `-website.md`
3. `.claude/agents/team-baas.md`
4. `.claude/agents/keurmeester.md` (nieuw)
5. `.claude/agents/speler.md` (nieuw)
6. `.claude/team/status.md` (leeg startbestand)
7. Sol-aanroeproute vastleggen in het Keurmeester-rolbestand

## Bewust niet gedaan

- Geen taakbord op schijf. Berichten volstaan; een bord is extra bewegende
  delen zonder aantoonbare winst.
- Geen automatische merge of PR. Yorin houdt die knop.
- Geen rolspecifieke onderaannemers. Vijf gedeelde in plaats van vijftien
  bijna-identieke.
- De 30 worktrees met ongecommit werk blijven staan; die verdienen een eigen
  sessie per stuk.
