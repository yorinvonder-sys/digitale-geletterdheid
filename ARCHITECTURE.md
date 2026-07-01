# DGSkills Architecture

## Product En Risicoklasse

DGSkills is een leerplatform voor digitale geletterdheid in het voortgezet onderwijs. Het product werkt met minderjarige leerlingen, docentdashboards, consent flows en AI-ondersteunde missies; behandel wijzigingen aan auth, Supabase, AI, rapportage, consent en leerlingdata als hoog risico.

## Repo-Kaart

```text
src/          React/Vite applicatie
supabase/     Edge Functions, Deno shared code en SQL migrations
public/       Runtime-static assets, gidsen, resources en PWA-bestanden
docs/         Agent-, audit-, workflow-, compliance- en interne documentatie
business/     Business, sales en compliance-pack documenten
bridge/       GitHub-agent-bridge inbox/outbox flow
scripts/      Build-, QA-, audit- en operationele scripts
.agent/       Actieve agent-workflows en task baton
.agents/      Project-skills; niet als duplicate verwijderen zonder tooling-check
```

## Runtime Entrypoints

- `src/main.tsx` mount React, laadt publieke CSS en start Web Vitals later.
- `src/app/App.tsx` is bewust klein en delegeert naar `src/app/AppRouter.tsx`.
- `src/app/AppRouter.tsx` scheidt publieke routes, login, consent en authenticated app loading.
- `src/app/AuthenticatedApp.tsx` is de private app-shell voor leerlingen, docenten en developer/admin-achtige workflows.

## Auth, Data En Supabase

Begin bij `src/services/supabase.ts`, `src/services/authService.ts`, `src/hooks/useAuth.ts`, `src/features/auth/`, `src/features/consent/` en `src/types/database.types.ts`. Wijzigingen hier kunnen sessies, rollen, MFA, RLS-verwachtingen of privacy raken en moeten minimaal met `npm run doctor` en `npm run build:prod` bewezen worden.

## AI-Assistenten En Edge Functions

Client-code mag geen provider secrets bevatten. AI-interactie loopt via Supabase Edge Functions en gedeelde servercode onder `supabase/functions/`. Relevante clientlagen zitten in `src/services/aiProviderService.ts`, `src/hooks/useAgentLogic.ts`, `src/hooks/useChatSession.ts`, `src/features/ai-chat/` en mission components.

## Feature Map

- `src/app/`: React entrypoints, route switching en authenticated shell.
- `src/components/app-shell/` en `src/components/ui/`: herbruikbare shell- en UI-bouwstenen zonder domeineigenaarschap.
- `src/features/missions/`: leerlingmissies, templates en mission-shared UI.
- `src/features/teacher/`: docentdashboard, monitoring, rapportage en klasbeheer.
- `src/features/public-site/` en `src/features/seo/`: publieke school-, ICT- en SEO-routes.
- `src/features/assessment/`: nulmeting, eindmeting en hybride assessment flows.
- `src/features/games/`: game flows en teacher toggles.
- `src/features/ai-lab/`: AI Lab en missiepreview-ervaringen.
- `src/services/`: gedeelde productservices voor Supabase, analytics, AI, teacher flows en exports.

## Verificatiecommando's

```bash
npm run context:budget
npm run doctor
npx tsc -p tsconfig.json --noEmit
npm run build:prod
npm run preview
```

`npm run doctor` is de snelle critical-path check. `npm run build:prod` is verplicht na pad-, import-, Vite-, Tailwind- of routewijzigingen.

## Agent Navigatieregels

Gebruik compacte, path-scoped inspectie. Vermijd brede `git diff`, `git show` of repo-wide searches tenzij de taak dat echt vraagt. Excludeer grote of generated paden zoals `.claude/worktrees/`, `.playwright-mcp/`, `dist/`, `node_modules/`, `public/video/` en grote binary assets. Behandel de vier Tailwind-configs en twee tsconfigs als bewuste keuzes, niet als cleanup-rommel.

## Bekende Gaps

Historische audit- en reviewdocumenten onder `business/dgskills-reviews/` kunnen nog pre-restructure paden zoals `components/missions/...` noemen. Gebruik voor actuele code-navigatie altijd `src/app/`, `src/features/`, `src/components/app-shell/` en `src/components/ui/`.
