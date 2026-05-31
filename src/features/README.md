# Features

`src/features/` bevat lichtgewicht feature slices: productdomeinen met eigen componenten, lokale types, data en subcomponents waar dat nuttig is.

Lees voor AI-werk eerst `docs/architecture/ai-workability-map.md` en daarna de lokale `README.md`/`AGENTS.md` van het domein dat je wijzigt.

Gebruik deze regels bij nieuw werk:

- Zet domeinspecifieke UI in de featurefolder.
- Zet breed herbruikbare bouwstenen in `src/components/ui/` of `src/components/app-shell/`.
- Houd gedeelde Supabase, AI, analytics en exportlogica in `src/services/`.
- Gebruik `@/features/<feature>/...` imports voor featurecode.
- Voeg alleen een feature-README toe bij hoog-risico of complexe flows.

Cross-feature imports zijn voorlopig toegestaan voor compositieflows zoals AI Lab, teacher previews en missies. Documenteer nieuwe crossings liever hier of in `ARCHITECTURE.md` dan ze stilzwijgend te verspreiden.

## Domeinen

| Domein | Pad | Lokale agentregels |
| --- | --- | --- |
| Auth | `src/features/auth/` | `src/features/auth/AGENTS.md` |
| Consent | `src/features/consent/` | `src/features/consent/AGENTS.md` |
| Missions | `src/features/missions/` | `src/features/missions/AGENTS.md` |
| Teacher | `src/features/teacher/` | `src/features/teacher/AGENTS.md` |
| Assessment | `src/features/assessment/` | `src/features/assessment/AGENTS.md` |
| Public site | `src/features/public-site/` | `src/features/public-site/AGENTS.md` |
| SEO | `src/features/seo/` | `src/features/seo/AGENTS.md` |
| AI Lab | `src/features/ai-lab/` | `src/features/ai-lab/AGENTS.md` |
| Games | `src/features/games/` | `src/features/games/AGENTS.md` |
| Developer tooling | `src/features/developer/` | `src/features/developer/AGENTS.md` |
