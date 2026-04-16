# Skill Router — Waar zit wat?

> Snelle routering van veelvoorkomende taken naar de juiste bestanden.

---

## Missies & Content

| Vraag | Bestanden |
|-------|-----------|
| Missie toevoegen/wijzigen | `src/data/missions/`, `src/types/mission.ts` |
| Missie-templates | `src/data/mission-templates/`, `src/components/missions/` |
| Missie-registratie | `src/data/missionRegistry.ts` |
| Game-componenten | `src/components/games/` |

## Dashboard & UI

| Vraag | Bestanden |
|-------|-----------|
| Leerling dashboard | `src/components/dashboard/` |
| Docent dashboard | `src/components/teacher/` |
| Navigatie/routing | `src/AppRouter.tsx`, `src/AuthenticatedApp.tsx` |
| Shared UI componenten | `src/components/ui/` |
| Styling tokens | Tailwind config, `lab-*` tokens |

## Auth & Permissies

| Vraag | Bestanden |
|-------|-----------|
| Authenticatie | `src/services/supabase.ts`, `src/contexts/AuthContext.tsx` |
| Rolgebaseerde toegang | `src/services/PermissionService.ts` |
| RLS policies | `supabase/migrations/` |

## AI & Chat

| Vraag | Bestanden |
|-------|-----------|
| Chat endpoint | `supabase/functions/chat/index.ts` |
| Chat streaming | `supabase/functions/chatStream/index.ts` |
| Vertex AI auth | `supabase/functions/_shared/vertexAuth.ts` |
| System prompts | Server-side via `getSystemInstruction()` |
| Chat UI | `src/components/chat/` |

## Edge Functions

| Vraag | Bestanden |
|-------|-----------|
| Alle functies | `supabase/functions/` |
| Gedeelde code | `supabase/functions/_shared/` |
| CORS config | `supabase/functions/_shared/cors.ts` |

## Compliance & Docs

| Vraag | Bestanden |
|-------|-----------|
| Compliance documenten | `business/nl-vo/compliance/` |
| Security docs | `docs/security/` |
| Privacy/DPIA | `business/nl-vo/compliance/dpia-dgskills-compleet.md` |
| Regelgeving | `Regelgeving/` |
| Compliance Hub UI | `src/components/compliance/` |

## Database & Migraties

| Vraag | Bestanden |
|-------|-----------|
| Schema wijzigingen | `supabase/migrations/` |
| Database types | `src/types/database.ts` |

## Config & Build

| Vraag | Bestanden |
|-------|-----------|
| Vite config | `vite.config.ts` |
| TypeScript config | `tsconfig.json` |
| Tailwind config | `tailwind.config.js` |
| Entry point | `src/App.tsx` → `AppRouter.tsx` → `AuthenticatedApp.tsx` |
