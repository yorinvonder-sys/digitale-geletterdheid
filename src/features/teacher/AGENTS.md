# Teacher Agent Rules

Teacher is Geel/Rood-risico. Wijzigingen kunnen docentautorisatie, leerlingzichtbaarheid, klasfilters en rapportage raken.

## Lees Eerst

- `src/features/teacher/README.md`
- `src/features/teacher/CLAUDE.md`
- `src/services/teacherService.ts`
- `src/services/analyticsService.ts`
- `src/types.ts`

## Regels

- Controleer bij elk dataveld of het voor de docent zichtbaar mag zijn.
- Houd dashboard-subcomponents onder `src/features/teacher/dashboard/` wanneer ze alleen daar gebruikt worden.
- Laat rapportage-, filter- en SLO-berekeningen consistent met bestaande services.
- Voeg geen cross-feature import toe zonder te controleren of dit bundle- of privacy-impact heeft.

## Proof

Minimaal `npm run doctor`. Bij dashboard-UI of rapportageflow is een browsercheck nodig. Bij auth/role/datawijzigingen ook `npm run build:prod` en expliciete permission-check.
