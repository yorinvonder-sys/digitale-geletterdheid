---
name: dgskills-team
description: Use when work for dgskills.app should be handled by the agent team instead of solo — the user says "laat het team", "zet het team op", "agent team", "verdeel dit", or asks for several DGSkills tasks at once (missions, quality sweeps, bugs, website). Also use when a tmux session named agents is already running.
---

# DGSkills agent team

Vier vaste werkers in een tmux-scherm, elk in een eigen worktree, aangestuurd door
een baas. Ontwerp: `docs/superpowers/specs/2026-08-27-agent-teams-design.md`.

**Het team bestaat. Bouw niet zelf wat een werker hoort te doen.**

## Draait het team al?

```bash
tmux has-session -t agents 2>/dev/null && echo DRAAIT || echo GESTOPT
```

- **DRAAIT** → je praat met BAAS via `SendMessage`. Ga naar "Werk uitdelen".
- **GESTOPT** → Yorin start het met `scripts/agent-team.sh`. Jij start het niet
  voor hem: het commando eindigt in `tmux attach` en neemt zijn scherm over.
  Zeg wat hij moet typen en wacht.

## Wie doet wat

| Werker | Domein |
|---|---|
| BOUWER | nieuwe leerlingopdrachten |
| NAKIJKER | bestaande opdrachten controleren en repareren |
| TECHNIEK | bugs, Supabase, migraties, onderhoud |
| WEBSITE | homepage, scholenpagina, publieke kant |

Rolbestanden staan in `.claude/agents/team-*.md`, grenzen in
`.claude/team/grenzen.md`. Lees die van de werker die je aanspreekt vóór je
hem een opdracht geeft — er staat in wat hij nodig heeft en wat hij weigert.

## Voordat je iets uitdeelt

1. **Is de opdracht uitvoerbaar?** "Loopt vast bij stap 3" is een symptoom
   zonder reproductiestap. Stel één vraag aan Yorin in plaats van te gokken
   welk gedrag hij bedoelt. Een vage opdracht doorgeven aan een werker
   verplaatst het raadwerk alleen.

   Zijn sommige taken helder en andere niet, laat de heldere dan doorlopen en
   houd alleen de vage tegen. Eén onduidelijke taak blokkeert de rest niet.
   Stel je vragen één voor één, niet als lijst.

2. **Doet iemand dit al?** Draai `git fetch origin`, `gh pr list --state open`,
   `git branch -a --sort=-committerdate | head -20` en `ListAgents`. Lees ze op
   ónderwerp, niet op locatie. Raakt iets je taak, open het eerst.

3. **Welke kleur?** Bepaal Groen/Geel/Rood volgens `AGENTS.md` § Risk Labels.
   Bij twijfel de zwaardere. De werker gebruikt dit om te bepalen of
   tegenlezing verplicht is — geef het expliciet mee, samen met een
   omvangschatting (meer dan 3 bestanden of ~150 regels telt als groot).

## Werk uitdelen

Eén afgebakend deelresultaat per opdracht, met acceptatiecriteria: wat is er af,
en waaraan zie je dat. Stuur naar de werker wiens domein het is, niet naar wie
toevallig vrij is.

```
SendMessage({to: "NAKIJKER", message: "..."})
```

Valt een taak tussen twee domeinen, hak de knoop door en zeg waarom.

## Als een werker terugmeldt

Neem zijn oordeel niet blind over — een melding van een agent is een hypothese.
Verifieer wat je zelf kunt verifiëren. Sols groene oordeel vervangt geen eigen
build of typecheck.

Raakt de beslissing security, auth, juridische tekst of iets onomkeerbaars: leg
het bij Yorin neer met een concreet voorstel. Beslis niet zelf.

## Wat je nooit doet

- Zelf bouwen wat een werker hoort te doen
- Twee werkers tegelijk in hetzelfde bestand zetten
- `scripts/agent-team.sh` zonder `--dry-run` draaien namens Yorin
- Een werker laten pushen, mergen of een PR openen
- Klaar melden op een rapport dat je niet hebt geverifieerd

## Aan het eind

Vier takken `team/<rol>` met afgerond werk. Samenvoegen en live zetten doet
Yorin zelf. Meld welke takken klaarstaan en wat er nog een beslissing van hem
vraagt — in gewone taal, geen technische rapporten doorgeven.
