# Skill Router — Waar zit wat?

> Taak-naar-pad-index: "ik wil X wijzigen, waar begin ik". Voor de structurele
> kaart — repo-indeling, entrypoints, verificatiecommando's — zie `ARCHITECTURE.md`.
>
> Elk pad hier wordt gecontroleerd door `npm run check:agent-docs`. Voeg geen pad
> toe dat niet bestaat; die check faalt dan in CI.

---

## Missies & Content

| Vraag | Bestanden |
|-------|-----------|
| Missie toevoegen/wijzigen | `src/features/missions/`, `src/config/missions.ts` |
| Missie-templates | `src/features/missions/templates/`, `src/config/templateRegistry.ts` |
| Missie-metadata (duur, doelen, thumbnails) | `src/config/missionMeta.ts`, `src/config/missionGoals.ts`, `src/config/missionDurations.ts` |
| Missie-types | `src/types/mission.types.ts` |
| Missie-service | `src/services/missionService.ts` |
| Agentrollen per leerjaar | `src/config/agents/` |
| SLO-kerndoelen & curriculum | `src/config/slo-kerndoelen-mapping.ts`, `src/config/sloKerndoelen.ts`, `src/config/curriculum.ts` |
| Games | `src/features/games/` |

## Dashboard & UI

| Vraag | Bestanden |
|-------|-----------|
| Leerlingdashboard | `src/features/student/`, `src/features/dashboard/` |
| Docentdashboard | `src/features/teacher/`, `src/services/teacherService.ts` |
| Navigatie/routing | `src/app/AppRouter.tsx`, `src/app/AuthenticatedApp.tsx`, `src/app/App.tsx` |
| App-shell | `src/components/app-shell/` |
| Shared UI-componenten | `src/components/ui/` |
| Styling tokens | `src/config/designTokens.ts`, `src/config/duckUi.ts`, `tailwind.config.js` |
| Assessment/nulmeting | `src/features/assessment/`, `src/services/assessmentService.ts` |

## Auth & Permissies

| Vraag | Bestanden |
|-------|-----------|
| Authenticatie | `src/services/supabase.ts`, `src/services/authService.ts`, `src/hooks/useAuth.ts` |
| Login/MFA-UI | `src/features/auth/`, `src/services/mfaTrustService.ts` |
| Rolgebaseerde toegang | `src/services/PermissionService.ts` |
| Ouderlijke toestemming | `src/features/consent/`, `src/services/consentService.ts` |
| RLS policies | `supabase/migrations/` |
| Auditlog | `src/services/auditService.ts` |

## AI & Chat

| Vraag | Bestanden |
|-------|-----------|
| Chat endpoint | `supabase/functions/chat/`, `supabase/functions/chatStream/` |
| AI-providerclients (server-side) | `supabase/functions/_shared/mistralClient.ts`, `supabase/functions/_shared/bflImageClient.ts`, `supabase/functions/_shared/moderationClient.ts` |
| System prompts | `supabase/functions/_shared/systemInstructions.ts` |
| Prompt-injectieverdediging | `supabase/functions/_shared/promptSanitizer.ts`, `supabase/functions/_shared/outputFilter.ts` |
| Chat-UI | `src/features/ai-chat/` |
| Chat-clientlogica | `src/hooks/useChatSession.ts`, `src/hooks/useAgentLogic.ts`, `src/services/aiProviderService.ts` |
| AI Lab | `src/features/ai-lab/` |

## Edge Functions

| Vraag | Bestanden |
|-------|-----------|
| Alle functies | `supabase/functions/` |
| Gedeelde code | `supabase/functions/_shared/` |
| CORS-config | `supabase/functions/_shared/cors.ts` |
| Rate limiting | `supabase/functions/_shared/rateLimiter.ts` |
| Supabase-projectconfig | `supabase/config.toml` |

## Database & Migraties

| Vraag | Bestanden |
|-------|-----------|
| Schemawijzigingen | `supabase/migrations/` |
| Database-types | `src/types/database.types.ts` |
| Losse queries | `supabase/queries/` |

## Compliance & Docs

| Vraag | Bestanden |
|-------|-----------|
| Documentatie-index | `docs/README.md` |
| Ontwerpdocumenten | `docs/architecture/` |
| Compliance-documenten | `business/nl-vo/compliance/` |
| Privacy/DPIA | `business/nl-vo/compliance/dpia-dgskills-compleet.md` |
| Security-docs | `docs/security/` |
| Regelgeving & audits | `docs/compliance/regulations/` |
| Pedagogisch fundament | `docs/pedagogy/README.md` |
| DPA-generator (UI) | `src/features/developer/DpaPdfGenerator.tsx` |
| Privacyverklaring (UI) | `src/components/app-shell/PrivacyModal.tsx` |

## Config & Build

| Vraag | Bestanden |
|-------|-----------|
| Vite-config | `vite.config.ts` |
| TypeScript-config | `tsconfig.json`, `tsconfig.app.json`, `tsconfig.critical.json` |
| Tailwind-configs | `tailwind.config.js`, `tailwind.app.config.js`, `tailwind.public.config.js`, `tailwind.shared.js` |
| Entrypoint | `src/main.tsx` → `src/app/App.tsx` → `src/app/AppRouter.tsx` → `src/app/AuthenticatedApp.tsx` |
| CI-gate | `.github/workflows/claude-pr-gate.yml` |
