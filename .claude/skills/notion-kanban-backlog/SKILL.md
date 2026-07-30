---
name: notion-kanban-backlog
description: Use when the user asks Claude to pick up an open Notion Kanban backlog item, choose a task from Backlog, plan it, get human review/approval, then execute it with the safest appropriate thinking level and update the Notion board status through Backlog, In Progress (Coding), Review, and Done.
---

# Notion Kanban Backlog

Use the shared Codex skill as the source of truth:

`.agents/skills/notion-kanban-backlog/SKILL.md`

Before acting, read that file and follow its workflow exactly. For Claude sessions, also follow root `CLAUDE.md`, especially the Notion MCP hint and lean startup rules.

Claude-specific mapping:

- Treat "thinking level" as the Claude reasoning depth appropriate to the approved card.
- Keep planning, risk judgment, implementation integration, and final validation in the main Claude context.
- Use Claude subagents only for bounded low-risk sidecar inspection when that does not touch auth, Supabase/RLS, payments, personal data, AI endpoints, secrets, release decisions, or final validation.
- Never execute a Notion backlog item before the user has reviewed and approved the plan.
