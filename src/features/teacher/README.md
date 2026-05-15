# Teacher Dashboard

Deze folder bevat docentdashboard, klasmonitoring, rapportage, leerlingdetails, instellingen en dashboard-subcomponents.

Belangrijke ingangen:

- `TeacherDashboard.tsx`
- `dashboard/TeacherCommandCenter.tsx`
- `dashboard/TeacherNavigation.tsx`
- `StudentList.tsx`
- `MetricsOverview.tsx`
- `SLOProgressPanel.tsx`

Wijzigingen kunnen rapportage, klasfilters, docentautorisatie en leerlingzichtbaarheid raken. Controleer bij dashboardwerk altijd de services in `src/services/teacherService.ts`, `src/services/analyticsService.ts` en relevante types in `src/types.ts`.
