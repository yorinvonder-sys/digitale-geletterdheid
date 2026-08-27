---
description: Zet het DGSkills agent-team aan het werk — verdeelt taken over bouwer, nakijker, techniek en website
argument-hint: <wat er moet gebeuren, in gewone taal>
---

Use the `dgskills-team` skill to route this work through the DGSkills agent team instead of doing it solo: `$ARGUMENTS`

The skill will:
1. Check whether the tmux session `agents` is running; if not, tell Yorin to start it with `scripts/agent-team.sh` and wait — never start it on his behalf.
2. Refuse to pass on a task that has no reproducible symptom; ask one clarifying question instead. Clear tasks proceed while unclear ones wait.
3. Check for duplicate work first: `git fetch origin`, `gh pr list --state open`, recent branches, and `ListAgents`, read by topic.
4. Assign a risk label (Groen/Geel/Rood per `AGENTS.md` § Risk Labels) and a size estimate, and pass both to the worker.
5. Route each task to the worker whose domain it is — BOUWER, NAKIJKER, TECHNIEK or WEBSITE — with explicit acceptance criteria.
6. Report back in plain Dutch which `team/<rol>` branches are ready.

Never build yourself what a worker should build. Never let a worker push, merge, or open a PR. Security, auth, legal or irreversible decisions go to Yorin with a concrete proposal, never decided alone.
