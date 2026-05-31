# Missions Agent Rules

Missionwerk is didactisch en vaak Geel/Rood-risico. Bescherm leerdoelen, SLO-koppeling, XP-integriteit, restartbaarheid en leerlingveiligheid.

## Lees Eerst

- `src/features/missions/README.md`
- `src/features/missions/CLAUDE.md`
- `src/config/missions.ts`
- `src/config/curriculum.ts`
- `src/config/agents/`
- `src/hooks/useMissionAutoSave.ts`

## Regels

- Houd mission-specifieke UI en data bij de mission of template.
- Gebruik `src/features/missions/shared/` alleen voor echte gedeelde mission UI.
- Verander XP, completion, autosave of assessment-signalen niet als bijvangst van copy/UI-werk.
- AI-interactie moet prompt-injection bewust blijven; stuur leerlinginput niet ongesanitized naar AI of database.
- Bij DGSkills missie-reviews hoort naast statische inspectie ook Chrome-browserbewijs volgens de projectregels.

## Proof

Gebruik het meest specifieke mission checkscript als dat bestaat. Anders minimaal `npm run doctor` plus een browsercheck van de geraakte leerlingflow. Bij route/import/templatewijzigingen ook `npm run build:prod`.
