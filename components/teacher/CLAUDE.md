# Teacher And SLO Reporting Rules

This subtree is teacher-facing. Optimize for reliability, clarity, and evidencing learning progress.

## Read first when editing teacher flows
- `components/teacher/SLOClassOverview.tsx`
- `components/TeacherDashboard.tsx`
- `config/sloKerndoelen.ts`
- `config/slo-kerndoelen-mapping.ts`
- `business/nl-vo/didactische-onderbouwing.md`
- `business/nl-vo/sales-assets/01-one-pager-vo.md`
- `business/nl-vo/sales-assets/02-demo-script-vo.md`

## Product rules
- Teacher views must reduce admin burden, not increase it.
- SLO percentages and exports are school-facing evidence. Treat them as high-trust surfaces.
- Preserve grouping by class, school context, VSO profile handling, and export usefulness.
- If a change affects mission completion semantics, verify the teacher-facing consequences.

## Reporting rules
- Do not break `calculateStudentKerndoelStats` assumptions.
- Keep labels, codes, and percentages consistent with `config/sloKerndoelen.ts` and `config/slo-kerndoelen-mapping.ts`.
- If you change what counts as completion, explain the impact on reporting.

## Security rules
- Docentweergaven tonen data van meerdere leerlingen — zorg dat RLS alleen data van de eigen school/klas toont.
- Exports (CSV, PDF) mogen geen data van andere scholen bevatten.
- MFA (AAL2) is verplicht voor docenten. Wijzig dit niet zonder expliciete instructie.
- Teacher endpoints moeten role-check doen via `app_metadata`, niet via client-claims.

## UX rules
- Prioritize scanability for teachers and school leaders.
- Prefer explicit wording over playful wording in teacher/admin views.
- If exporting or inspection-proof claims are touched, cross-check product reality before keeping the claim.

## Output expectations
- Explain what changed for teachers.
- Explain whether exports, SLO progress, or inspection-facing evidence changed.
- Explain risks in plain Dutch.
