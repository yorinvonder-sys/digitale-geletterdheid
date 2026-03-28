# Claude Builder + Handmatige Codex Review

Deze repository gebruikt nu een vaste builder-review-flow:

1. Claude bouwt op een branch met prefix `claude/`.
2. Claude opent een PR naar `main`.
3. De PR-body moet de handoff-secties invullen uit de standaard template:
   - `Doel`
   - `Wat Is Veranderd`
   - `Tests`
   - `Risico's`
   - `Graag Op Letten`
4. GitHub draait daarna automatisch:
   - handoff-validatie
   - typecheck, security audit en production build
5. Daarna review je handmatig met Codex.
6. Pas daarna merge je handmatig de PR.

## Benodigde GitHub-configuratie

- Laat PR's naar `main` toe.
- Bescherm `main` met minimaal deze checks:
  - `validate-handoff`
  - `quality-checks`
  - `performance`

## Dagelijkse werkwijze

- Maak branches als `claude/feature-naam`.
- Laat Claude altijd een PR openen in plaats van direct naar `main` te pushen.
- Gebruik de PR-template als compacte handoff voor Codex.
- Gebruik desnoods de vaste builderprompt in [claude-builder-prompt.md](/home/yorin-vonder/digitale-geletterdheid/docs/workflows/claude-builder-prompt.md).
- Laat Codex daarna handmatig reviewen op de diff of PR.

## Handmatige Codex Review

Handige routes:

- In Codex in deze workspace:

  ```text
  Review mijn huidige branch tegen main. Focus op bugs, regressies, missende tests en risico's.
  ```

- Of specifieker:

  ```text
  Review de diff van `main...claude/mijn-feature`. Gebruik de PR-handoff als extra context, maar vertrouw vooral de code.
  ```

- Als je GitHub CLI gebruikt:

  ```bash
  gh pr create --base main --head claude/jouw-feature --web
  gh pr view --web
  ```

- Laat na de review Claude of jezelf de opmerkingen verwerken, en merge daarna handmatig.

## Lokale checks

- Handoff valideren:

  ```bash
  PR_BODY="$(cat /tmp/pr-body.md)" node scripts/validate-claude-handoff.mjs
  ```
