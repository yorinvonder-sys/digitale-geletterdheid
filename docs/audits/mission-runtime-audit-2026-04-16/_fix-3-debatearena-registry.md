# Fix-rapport 3 — DebateArena enableChat cleanup
- Datum: 2026-04-16

## Systeem-check

- **DebateArena.tsx gebruikt enableChat?** NEE — `DebateArenaProps` extends alleen `TemplateMissionProps` (missionId, onBack, onComplete). Geen `enableChat`-prop, geen `<StudentAIChat>` in de render.
- **TemplateMissionRouter geeft enableChat door?** NEE — Regel 43: `const templateProps = { ...props }` spreadt alleen de `TemplateMissionProps`-velden. De registry-entry (inclusief `enableChat`) wordt nooit doorgegeven aan de template-component.
- **Conclusie:** Fix UITGEVOERD — Patroon-C was een echte bug (UI-belofte in registry die niet overeenkomt met werkelijke implementatie).

## Fix details

Bestand: `config/templateRegistry.ts`

| Missie                  | Actie   |
|-------------------------|---------|
| `schermtijd-coach`      | REMOVED |
| `scroll-stopper`        | REMOVED |
| `ai-ethicus`            | REMOVED |
| `digital-rights-defender` | REMOVED |
| `tech-court`            | REMOVED |
| `future-forecaster`     | REMOVED |
| `policy-maker`          | REMOVED |
| `reflection-report`     | REMOVED |
| `digitale-balans-coach` | SKIPPED (had al geen enableChat) |
| `review-week-3`         | SKIPPED (had al geen enableChat) |

Van elke REMOVED-missie zijn `enableChat: true` en `chatRoleId: '<id>'` verwijderd. Alleen `missionId` en `templateType` blijven over.

## Verificatie

TypeScript (templateRegistry.ts): **PASS** — geen fouten in dit bestand na wijziging.

## Risico's

- Geen functionele regressie: `enableChat` had toch al geen effect in DebateArena. De gebruiker zag geen chat-knop, en dat verandert niet.
- Toekomstige chat-implementatie in DebateArena vereist: (1) `StudentAIChat` toevoegen aan `DebateArena.tsx`, (2) `enableChat`/`chatRoleId` doorsturen via `TemplateMissionRouter`, (3) de registry-entries hier opnieuw toevoegen. Dit is een feature, geen bugfix.
- `eindproject-j2` (DataViewer) heeft ook `enableChat: true` — niet aangeraakt, want DataViewer valt buiten scope van deze fix.
