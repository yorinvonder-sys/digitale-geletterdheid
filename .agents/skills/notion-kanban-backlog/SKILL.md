---
name: notion-kanban-backlog
description: Use when the user asks Codex or Claude to pick up an open Notion Kanban backlog item, choose a task from Backlog, plan it, get human review/approval, then execute it with the safest appropriate reasoning level and update the Notion board status through Backlog, In Progress (Coding), Review, and Done.
---

# Notion Kanban Backlog

Use this skill to turn a broad request like "pak nog een backlog item op" into one controlled work slice from the Notion Kanban board.

## Operating Contract

- Treat Notion as the task tracker and source of truth for backlog status.
- Pick one open Backlog item unless the user names a specific item.
- Do not start implementation before the user approves the plan.
- Keep the main model on planning, risk judgment, integration, and final validation.
- Use cheaper or delegated agents only for narrow, low-risk sidecar checks when available and useful.
- Never delegate auth, Supabase/RLS, payments, personal data, AI endpoints, secrets, release decisions, or final validation.
- Move the Notion card only when the work state truly changes.

## Workflow

1. Discover candidate work.
   - Use the Notion connector/plugin to find open cards in the Kanban board.
   - Prefer cards in `Backlog`.
   - If multiple cards are plausible, choose the smallest high-value item with clear acceptance criteria.
   - If the board, database, or status fields are ambiguous, ask one concise question before moving anything.

2. Summarize the chosen card.
   - State the Notion title, current status, likely scope, assumptions, and visible acceptance criteria.
   - Classify risk as Groen, Geel, or Rood using the repo's `AGENTS.md` risk labels when working in DGSkills.
   - Choose the lowest safe reasoning level for the planning slice.
   - Identify whether a safe cheap route exists: local DeepSeek/Reasonix bridge, explicit DeepSeek API bridge, then `gpt-5.3-codex-spark`. If none is useful, say so briefly.

3. Produce a reviewable plan for the human.
   - Include:
     - goal in plain language;
     - files or systems likely to change;
     - status moves expected in Notion;
     - verification proof;
     - risk and rollback notes.
   - Ask the user to approve or adjust the plan.
   - Stop here until the user approves.

4. Execute after approval.
   - Move the Notion card from `Backlog` to `In Progress (Coding)`.
   - Re-read relevant local instructions before editing, including `AGENTS.md`, `CLAUDE.md` when using Claude, and feature-local instructions.
   - Use the reasoning level appropriate to the approved task, raising it if risk or coupling increases.
   - Keep changes scoped to the approved card.

5. Request review.
   - Run the smallest sufficient verification for the risk level.
   - Move the Notion card to `Review`.
   - Report what changed, what proof ran, and what remains uncertain.
   - Ask the user for human review before marking Done unless the user explicitly authorized auto-completion.

6. Finish.
   - After human approval and completed verification, move the Notion card to `Done`.
   - Leave a concise Notion update/comment when supported by the connector: summary, changed files or PR link, checks run, and remaining notes.

## Status Discipline

- `Backlog`: work not started.
- `In Progress (Coding)`: implementation or active investigation has begun after plan approval.
- `Review`: code/docs/work is ready for human review.
- `Done`: human approved and the requested outcome is complete.

If execution is blocked, keep the card in its current truthful status and add a short blocker note when supported.

## Safety Defaults

- For broad or vague cards, narrow to the smallest useful slice and ask before proceeding.
- For Rood work, slow down, define verification before editing, and do not claim production readiness without proof.
- Do not expose secrets, learner data, personal data, raw prompts, or sensitive auth/session details in Notion comments.
- Do not use Notion board updates as proof of technical correctness; still run local, browser, build, or service checks appropriate to the task.
