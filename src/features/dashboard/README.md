# Dashboard

Deze folder bevat de bouwstenen van het leerlingdashboard: de hero-sectie, voortgangsbalk, missievoorbeelden en adaptieve missiesuggesties.

Belangrijke ingangen:

- `DashboardHero.tsx`
- `ProgressStrip.tsx`
- `AdaptiveMissionSuggestions.tsx`
- `MissionPreviewVisual.tsx`
- `src/config/dashboardThemes.tsx`
- `src/config/missionPreviewConfig.ts`

Dit zijn losse onderdelen, geen route. Ze worden samengesteld in `src/features/student/ProjectZeroDashboard.tsx`; begin daar als je het dashboard als geheel wilt begrijpen.

`AdaptiveMissionSuggestions.tsx` bepaalt wat een leerling als volgende stap krijgt voorgesteld. Wijzig die logica niet zonder te controleren wat het doet met leerlingen die nog niets hebben afgerond.
