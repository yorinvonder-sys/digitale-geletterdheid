# Mission Work Rules

This subtree contains learner-facing missions. Treat mission work as curriculum work, not just UI work.

## Read first when editing mission flows
- `config/curriculum.ts`
- `config/agents.tsx`
- `config/slo-kerndoelen-mapping.ts`
- `components/ProjectZeroDashboard.tsx`
- `hooks/useMissionAutoSave.ts`
- `business/nl-vo/didactische-onderbouwing.md`
- inspect at least one comparable mission component in this folder

## Mission invariants
- Every mission must fit a real leerjaar + periode in `config/curriculum.ts`.
- Every mission must have coherent identity across:
  - `config/agents.tsx`
  - `config/slo-kerndoelen-mapping.ts`
  - learner visibility in `components/ProjectZeroDashboard.tsx`
- Do not create a mission that exists in UI but not in SLO mapping, or vice versa.

## Didactic rules
- Default target: onderbouw VO unless explicitly different.
- AI is a copiloot, not an antwoordenmachine.
- Preserve the 3-step method: erkenning, korte uitleg, challenge.
- Keep learner feedback short, concrete, and safe.
- Keep cognitive load low and steps explicit.
- Do not reward shallow interaction. Respect XP-farming prevention patterns.
- For sensitive topics, preserve wellbeing and referral behavior.

## Security rules
- Missions die AI-interactie bevatten moeten beschermd zijn tegen prompt injection.
- Leerling-input wordt altijd gesanitized voordat het naar een AI-model of database gaat.
- Missie-state mag geen gevoelige data bevatten die niet bij de leerling hoort.
- XSS-preventie: alle dynamische content in mission UI wordt geëscaped via React's standaard escaping of DOMPurify.

## Technical rules
- Reuse `useMissionAutoSave` patterns for mission state and progress recovery.
- Ensure completion flows still clear saved progress where appropriate.
- Keep mission state understandable and restart-safe.
- If a mission affects completion or kerndoelen, think through downstream effects on teacher reporting.

## When adding a new mission
- Add or update:
  - curriculum placement
  - mission role/config
  - SLO mapping
  - learner dashboard visibility and info text when needed
- Prefer existing mission structure and naming patterns over inventing a new architecture.

## Automated validation
- Run `npm run validate:missions` after any mission-related change.
- The script cross-checks templateRegistry, slo-kerndoelen-mapping, curriculum, agentRoleIds, and AuthenticatedApp routing.
- CI will block PRs that introduce mission inconsistencies.

## Output expectations
- Explain what the learner experiences.
- Explain what the teacher can observe or report later.
- Name the SLO goals explicitly.
- Explain the didactic rationale in plain Dutch.
