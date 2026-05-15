# Missions

Deze folder bevat leerlingmissies, dedicated mission components en herbruikbare mission templates.

Lees eerst:

- `src/config/curriculum.ts`
- `src/config/agents/`
- `src/config/slo-kerndoelen-mapping.ts`
- `src/features/missions/CLAUDE.md`
- `src/hooks/useMissionAutoSave.ts`

Missiewerk is didactisch werk: behoud leerdoel, SLO-koppeling, XP-integriteit, restartbaarheid en leerlingveiligheid. AI-interactie moet prompt-injection bewust blijven en leerlinginput mag niet ongesanitized naar AI of database gaan.

Gebruik `src/features/missions/shared/` voor gedeelde mission UI en laat template-specifieke types/configs bij de templatefolder staan.
