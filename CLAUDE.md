# Project: AI Lab - Future Architect (DGSkills)

@.claude/adhd-format.md
@.claude/current-task.md
@.claude/task-queue.md
@.claude/progress-log.md

## Stack
- React 19 + TypeScript + Vite
- Supabase (auth, database, edge functions, RLS)
- Tailwind CSS (inline, geen @apply) + Framer Motion
- Google Gemini via Vertex AI (europe-west4, service account auth)
- Vercel (deployment), build: `npm run build:prod`
- State: React hooks + Contexts (geen Redux)
- Imports: `@/*` alias naar project root

## Code Conventions
- **Componenten:** PascalCase (`MissionCard.tsx`), named exports, `React.FC<Props>`
- **Services:** camelCase (`geminiService.ts`), edge function proxy preferred
- **Hooks:** camelCase met `use` prefix (`useRateLimit.ts`)
- **Types:** PascalCase interfaces in `types/`
- **Styling:** Tailwind inline in className, conditionals via template literals, custom kleuren via `lab-*` tokens
- **Edge Functions:** Deno runtime, `esm.sh` imports, shared code in `_shared/`
- **Entry point:** `App.tsx` → `AppRouter.tsx` → `AuthenticatedApp.tsx`

## Agent Preferences
- Parallel subagents voor onafhankelijk werk. Background agents voor builds/audits.
- Default language: Dutch (Nederlands), unless context is English code/docs.
- **Implementatie-agents: altijd `model: "sonnet"`**. Opus alleen voor planning/review.

## Autonome Scoping — VERPLICHT

**Repo-first, context-first.** Bij onvolledige prompt: lees code/docs, bepaal scope, noteer aannames. Alleen terugvragen bij: meerdere plausibele scopes, privacy/security-impact, of productbeslissingen.

Lever altijd op: wat gebouwd is, aannames, geraakt bestanden, uitleg in gewone taal.

### Handoff protocol
- `.claude/current-task.md` = actieve baton. `.claude/task-queue.md` = volgorde.
- User override > baton > queue.

## ADHD Werkprotocol
- Eén taak tegelijk. Afdwaling → terugsturen. Vier kleine overwinningen.
- Max 3-5 items zichtbaar. Expliciet fasewissels benoemen.
- Werkstromen: Product, Compliance, Go-to-Market, Infra, Pilot (zie `.claude/workstreams.md`).
- Sessie-opening: volg `.claude/adhd-format.md` (Identiteit → Momentum → Statusblok → Volgende stap).
- Sessie-afsluiting: entry in `.claude/progress-log.md`, update baton.
- `Jij hoeft nu niets te doen.` als er geen actie nodig is.

## MCP Servers
- **Supabase:** database queries, schema, migrations, edge functions, logs
- **Tavily:** web search and research
- **Sequential Thinking:** complex reasoning chains

## Deployment
- Production: dgskills.app (Vercel)
- Supabase project with active migrations and RLS policies

## Key Reference Documents
Business docs: `business/nl-vo/`. Compliance: `business/nl-vo/compliance/`. Security: `docs/security/`. Lees on demand, niet pre-loaden.

## Security — VERPLICHT (HIGH RISK AI, minderjarigen)

Bij elke code-wijziging: OWASP Top 10, server-side input validatie, output encoding, RLS intact, geen secrets in code, data minimalisatie, prompt injection preventie, geen stack traces naar client.

**Security-gevoelige bestanden:** `supabase/functions/chat/`, `_shared/vertexAuth.ts`, `_shared/cors.ts`, `services/PermissionService.ts`, `supabase/migrations/`

**Waarschuwen bij:** auth/RLS/CORS/permission wijzigingen, nieuwe dependencies, user input naar DB/AI, compliance-doc wijzigingen.

Volledige checklist: `.claude/acceptance-checklist.md`. Security docs: `docs/security/`, `SECURITY.md`.

## Open Issues
1. Algemene Voorwaarden: concept gereed, nog niet door jurist gereviewed
2. Geen beroepsaansprakelijkheidsverzekering

## Launch Plan
Actief stappenplan: `LAUNCH-PLAN.md`. Werk status bij na afgeronde taak.

## AI Act
HIGH RISK (Annex III 3b). Deadline: 2 augustus 2026. KvK 81819889.
