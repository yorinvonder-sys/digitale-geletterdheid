# Agent Context Strategy

Use this map to keep Codex, Claude, Cursor, Aider, and similar AI tools focused
on the smallest useful slice of DGSkills.

## Default Intake

1. Run `npm run context:budget` before context-heavy work.
2. Look the task up in `.claude/skill-router.md` — a task-to-path index that
   names the files to open. Use `ARCHITECTURE.md` when you need the structural
   picture instead: repo layout, entrypoints, verification commands.
3. Read the local README in the feature folder, then only the specific
   component, hook, or service the task needs.
4. Use path-scoped `rg`, `git status --short -- <paths>`, and
   `git diff -- <paths>`.

Do not start by reading baton files, progress logs, screenshots, generated
build output, broad business docs, or all feature folders.

Every path named in this file, in `.claude/skill-router.md`, and in
`ARCHITECTURE.md` is verified by `npm run check:agent-docs`. If a path here
does not resolve, that is a bug in this document — report it rather than
searching around it.

## Task-To-Context Map

- Feature UI/product logic: `.claude/skill-router.md` for the entry paths, the
  local README in that feature folder, then the specific component, hook, or
  service.
- Missions/opdrachten: `src/features/missions/`, the specific mission or
  template under `src/features/missions/templates/`, `src/config/missions.ts`,
  and the most specific check script.
- Public site/SEO: `src/features/public-site/CLAUDE.md` or
  `src/features/seo/CLAUDE.md`, the route/component, and the prerender script
  only when route output changes.
- Auth/admin/consent/teacher data: `src/services/authService.ts`,
  `src/services/PermissionService.ts`, `src/features/consent/`, and
  `src/types/database.types.ts`. Treat as Rood risk.
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
