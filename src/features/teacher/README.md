# Teacher Dashboard

Deze folder bevat docentdashboard, klasmonitoring, rapportage, leerlingdetails,
instellingen en dashboard-subcomponents.

## Informatiearchitectuur

De navigatie kent drie items, één per docenttaak:

| Item | Tab | Component |
|---|---|---|
| Vandaag | `overview` | `dashboard/TeacherCommandCenter.tsx` — Aandacht eerst, dan missiekaart, klasprogressie, klas-inzicht |
| Leerlingen | `students` | `StudentList.tsx` + leerlingdetail |
| Bewijs | `progress` | `dashboard/TeacherEvidence.tsx` — subweergaven Voortgang, SLO-dekking, Groei, Samenhang, Bronnen |

Alles wat niet dagelijks nodig is, staat in het accountmenu achter de avatar
(`dashboard/TeacherAccountMenu.tsx`): klas & missies, games, beloningen,
AI-beleid, feedback, kennisbank, import, presentatie, uitloggen.

Onder 1024px vervangt `dashboard/TeacherMobileNav.tsx` de sidebar. Voeg je een
navigatie-item toe, dan hoort het in beide.

## Belangrijke ingangen

- `TeacherDashboard.tsx` — shell, header, klasfilter, dataladen, modals
- `dashboard/TeacherCommandCenter.tsx`
- `dashboard/TeacherEvidence.tsx`
- `StudentList.tsx`
- `SLOClassOverview.tsx` — SLO-percentages en Excel-export
- `SLOProgressPanel.tsx`

## Aandachtspunten

- Het klasfilter staat **alleen** in de header van `TeacherDashboard.tsx`.
  Panelen krijgen `classFilter` als prop en bouwen geen eigen select.
- `duck-error` (rood) is voorbehouden aan echte fouten. "Nog niet gestart" of
  lage voortgang is neutraal — zie `MissionProgressPanel.tsx`.
- Zet in een color map nooit `bg` en `text` op hetzelfde token; de achtergrond
  hoort een tint te zijn.
- `yearGroupFilter` staat vast op 1: er is geen leerjaarkeuze in de UI. Zie de
  toelichting bij die state in `TeacherDashboard.tsx` voordat je er een
  toevoegt — het raakt de Excel-export.

Wijzigingen kunnen rapportage, klasfilters, docentautorisatie en
leerlingzichtbaarheid raken. Controleer bij dashboardwerk altijd de services in
`src/services/teacherService.ts`, `src/services/analyticsService.ts` en
relevante types in `src/types.ts`.
