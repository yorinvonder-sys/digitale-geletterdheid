# Agent Context Strategy

Use this map to keep Codex, Claude, Cursor, Aider, and similar AI tools focused
on the smallest useful slice of DGSkills.

## Default Intake

1. Run `npm run context:budget` before context-heavy work.
2. Read the nearest `AGENTS.md` for the files you will touch.
3. Read only the domain README or source files needed for the task.
4. Use path-scoped `rg`, `git status --short -- <paths>`, and
   `git diff -- <paths>`.

Do not start by reading baton files, progress logs, screenshots, generated
build output, broad business docs, or all feature folders.

## Task-To-Context Map

- Feature UI/product logic: `src/features/AGENTS.md`, the local
  `src/features/<domain>/AGENTS.md`, local README, then the specific component,
  hook, or service.
- Missions/opdrachten: `src/features/missions/AGENTS.md`, the specific mission
  or template, mission config, and the most specific check script.
- Public site/SEO: local public-site or SEO agent rules, the route/component,
  and prerender script only when route output changes.
- Auth/admin/consent/teacher data: local feature rules plus the relevant
  service and database types. Treat as Rood risk.
- Supabase/Edge Functions/RLS: `supabase/CLAUDE.md`, the specific function or
  migration, and security docs only when behavior or claims depend on them.
- Docs-only work: read the target doc and directly linked sources, not the
  whole `business/` or `docs/` tree.

## Never Broad-Read

- `.claude/worktrees/`
- `.playwright-mcp/`
- `.agent/skills/`
- `node_modules/`
- `dist/` and `dist-ssr/`
- `.vercel/` and `.firebase/`
- `lighthouse-reports/`, `playwright-report/`, `test-results/`, `screenshots/`
- `.tmp-context/`, `.superpowers/`, `public/dev-docs/`
- binary assets unless the task is specifically about that asset

Use explicit paths if one of these folders is the actual subject of the task.

## Minimum Proof

- Context/docs/ignore changes: `npm run context:budget`, plus
  `npm run context:check` when artifact tracking is relevant.
- Hooks or agent policy changes: `npm run hooks:test`.
- TypeScript app/config changes: `npm run doctor`.
- Route/import/build behavior: `npm run build:prod`.
- Mission or UI QA: targeted browser check; mission review requires the Chrome
  viewport matrix from `AGENTS.md`.
- Rood-risk work: doctor, production build, and explicit privacy/permission
  verification.

## Context Smell Checklist

Stop and narrow the task when:

- more than ten unrelated files are needed before there is a hypothesis;
- more than three feature areas would be touched in one pass;
- broad reports are replacing a concrete decision or fix;
- the same check fails twice without new evidence;
- a noisy folder appears in `npm run context:budget` as tracked or indexed.
