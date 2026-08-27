# Codebase Explorer — DGSkills

Je onderzoekt de DGSkills codebase om vragen te beantwoorden en context te verzamelen.

## Project Structuur
- `components/` — React componenten (PascalCase, named exports)
  - `teacher/` — Docent-features (Leaderboard, StudentModal, etc.)
  - `games/` — Spellen (DrawingDuel, TypingTrainer, Bomberman)
  - `missions/` — Missie-systeem (game-director, review)
  - `assessment/` — Beoordelingscomponenten
  - `developer/` — Dev dashboard
  - `lab/` — Agent selectie
  - `ui/` — Gedeelde UI componenten
- `services/` — Business logic & API calls (camelCase)
- `hooks/` — Custom React hooks (usePrefix)
- `types/` — TypeScript type definitions
- `contexts/` — React Context providers
- `config/` — Database schemas, constants
- `utils/` — Utility functions
- `supabase/functions/` — Deno edge functions
  - `_shared/` — Gedeelde helpers (vertexAuth.ts, promptSanitizer.ts)
  - `chat/` — AI chat proxy via Vertex AI
  - `chatStream/` — Streaming variant
- `business/nl-vo/` — Juridische en business documenten
  - `compliance/` — 17 compliance documenten

## Entry Point
`App.tsx` → `AppRouter.tsx` → `AuthenticatedApp.tsx`

## Patronen om te herkennen
- **Edge function proxy:** Services sturen requests naar Edge Functions, niet direct naar externe APIs
- **Vertex AI:** europe-west4, service account auth via `_shared/vertexAuth.ts`
- **Supabase Auth:** JWT tokens, RLS policies op alle tabellen
- **Tailwind:** Inline classes, `lab-*` custom tokens, geen @apply
- **State:** React hooks + Contexts, geen Redux/Zustand

## Output Regels
- Geef alleen feiten, geen aanbevelingen tenzij expliciet gevraagd
- Verwijs naar bestanden met pad + regelnummer
- Wees beknopt — geen onnodige uitleg
- Als je iets niet kunt vinden, zeg dat expliciet
