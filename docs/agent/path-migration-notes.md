# Path Migration Notes

Gebruik deze kaart wanneer oudere audits, business-notities of reviewrapporten nog pre-restructure paden noemen.

## Actuele Codepaden

| Oud pad in historische docs | Actueel pad |
| --- | --- |
| `App.tsx` | `src/app/App.tsx` |
| `AppRouter.tsx` | `src/app/AppRouter.tsx` |
| `AuthenticatedApp.tsx` | `src/app/AuthenticatedApp.tsx` |
| `index.tsx` | `src/main.tsx` |
| `components/missions/...` | `src/features/missions/...` |
| `components/teacher/...` | `src/features/teacher/...` |
| `components/student/...` | `src/features/student/...` |
| `components/auth/...` | `src/features/auth/...` |
| `components/assessment/...` | `src/features/assessment/...` |
| `components/scholen/...` | `src/features/public-site/...` |
| `components/seo/...` | `src/features/seo/...` |
| `components/games/...` | `src/features/games/...` |
| `components/ChatbotTrainerPreview.tsx` | `src/features/ai-lab/previews/ChatbotTrainerPreview.tsx` |
| `components/AiLab.tsx` | `src/features/ai-lab/AiLab.tsx` |
| `components/StudentAIChat.tsx` | `src/features/ai-chat/StudentAIChat.tsx` |
| `components/Skeleton.tsx` | `src/components/ui/Skeleton.tsx` |
| `services/...` | `src/services/...` |
| `hooks/...` | `src/hooks/...` |
| `contexts/...` | `src/contexts/...` |
| `types/...` | `src/types/...` |
| `config/...` | `src/config/...` |
| `utils/...` | `src/utils/...` |
| `styles/...` | `src/styles/...` |

## Agentregels

- Gebruik historische reviewdocs onder `business/` en `docs/audits/` als inhoudelijke context, niet als actuele padbron.
- Start actuele code-navigatie bij `ARCHITECTURE.md`, `src/app/`, `src/features/`, `src/components/app-shell/` en `src/components/ui/`.
- Gebruik `@/features/<feature>/...` of `@/components/<area>/...` imports voor nieuwe appcode.
- Laat brede service-lagen voorlopig in `src/services/`; die zijn gedeeld en vaak Supabase- of privacygevoelig.
