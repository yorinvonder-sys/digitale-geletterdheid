# DGSkills Routing

Use this map to inspect the smallest relevant DGSkills documents. Avoid broad reads of generated reports, old audits, screenshots, binary assets, `.claude/worktrees/`, `dist/`, and `node_modules`.

## Claim And Copy Review

- Start with `docs/compliance/legal-claim-source-of-truth.md`.
- Check evidence in `docs/compliance/legal-evidence-register.md`.
- Use `business/nl-vo/compliance/legal-matrix.md` only as supporting context.
- Treat `business/nl-vo/compliance/audit-report.md` as historical unless the current source-of-truth says otherwise.
- Run `npm run check:legal` after edits to school-facing legal/compliance wording.

## AVG/GDPR And School Privacy

- Verwerkingsregister: `business/nl-vo/compliance/verwerkingsregister.md`
- Privacyverklaring: `business/nl-vo/compliance/privacyverklaring-dgskills.md`
- Privacybijsluiter: `business/nl-vo/compliance/E-privacybijsluiter-dgskills.md`
- Privacy explainer: `business/nl-vo/compliance/privacy-explainer-for-schools.md`
- GDPR rights coverage: `docs/compliance/gdpr-rights-table-coverage.md`

## DPIA, FG/DPO, And School Onboarding

- Full DPIA support: `business/nl-vo/compliance/dpia-dgskills-compleet.md`
- DPIA support template: `business/nl-vo/compliance/dpia-support-template.md`
- FG/DPO advice: `business/nl-vo/compliance/fg-dpo-adviesrapport.md`
- School compliance guide: `business/nl-vo/compliance/school-compliance-guide.html`
- DPA guide: `business/nl-vo/compliance/D-handleiding-verwerkersovereenkomst-scholen.md`

## Processor Agreement And Subprocessors

- Model DPA: `business/nl-vo/compliance/A-model-verwerkersovereenkomst-dgskills.md`
- Security annex: `business/nl-vo/compliance/B-beveiligingsbijlage-dgskills.md`
- Subprocessor list: `business/nl-vo/compliance/C-sub-verwerkerslijst-dgskills.md`
- DPA report: `business/nl-vo/compliance/verwerkersovereenkomsten-rapport.md`
- Data-flow template: `business/nl-vo/compliance/data-flow-overview-template.md`

## EU AI Act And AI Governance

- AI Act control matrix: `docs/compliance/ai-act-control-matrix.md`
- AI Act conformity plan: `business/nl-vo/compliance/eu-ai-act-conformiteitsplan.md`
- AI Act risk register: `business/nl-vo/compliance/risicoregister-ai-act.md`
- Annex IV technical documentation: `business/nl-vo/compliance/annex-iv-technische-documentatie.md`
- Post-market monitoring plan: `docs/compliance/post-market-monitoring-plan.md`
- Post-market review template: `docs/compliance/post-market-review-template.md`

## Code Pointers For Legal Claims

Use code only when a claim depends on implementation evidence:

- AVG export/delete/restrict: `supabase/functions/exportMyData/`, `supabase/functions/deleteMyAccount/`, `supabase/functions/restrictProcessing/`
- Permission and school scoping: `src/services/PermissionService.ts`, `src/services/supabase.ts`
- AI endpoints and prompts: `supabase/functions/`, `src/services/`
- Audit logging: search for `auditService` and privacy event logging.

For Rood work touching auth, RLS, Supabase, AI endpoints, secrets, exports, or minors' personal data, follow the repository Rood-risk workflow and verify permissions/privacy invariants before claiming readiness.
