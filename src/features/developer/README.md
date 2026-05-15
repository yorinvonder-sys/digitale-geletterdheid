# Developer

Deze folder bevat interne developer- en admin-achtige tooling.

Belangrijke ingangen:

- `DeveloperDashboard.tsx`
- `DeveloperReviewChecklist.tsx`
- `accountant/`
- `src/services/developerService.ts`
- `src/services/teacherService.ts`

Developer tooling kan gevoelige status, gebruikersdata of beheerflows tonen. Behandel wijzigingen als hoog risico als ze auth, rollen, exports, leerlingdata of Supabase-mutaties raken.
