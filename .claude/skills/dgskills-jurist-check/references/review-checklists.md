# Review Checklists

Use these as practical gates. Keep findings concise and source-backed.

## School-Facing Claim Review

- Identify the exact claim and audience.
- Check `docs/compliance/legal-claim-source-of-truth.md`.
- Check whether the claim needs evidence from `docs/compliance/legal-evidence-register.md` or provider documents.
- Replace absolute wording with cautious wording when legal review, provider proof, DPIA, DPA, or FG/DPO approval remains open.
- Flag any mismatch between copy and source-of-truth as `BLOCK`.
- Run `npm run check:legal` after editing claims.

## AI Feature Risk Triage

- Does the AI output evaluate learning results, recommend a learning path, score work, gate access, or influence teacher/learner decisions?
- Is a human teacher able to review, override, correct, and explain the output before it materially affects a learner?
- Is AI involvement clearly disclosed to teachers/learners where required?
- Is only the minimum necessary learner context sent to the model/provider?
- Are prompts, raw AI responses, learner names, emails, identifiers, and secrets excluded from analytics, Sentry, logs, and exports unless explicitly justified and documented?
- Does the feature require an update to DPIA, risk register, Annex IV, post-market monitoring, or school instructions?

## AVG/GDPR And Minors

- Confirm role split: school as verwerkingsverantwoordelijke/controller, DGSkills as verwerker/processor unless a specific processing activity says otherwise.
- Confirm lawful basis is determined by the school and described cautiously; do not invent consent/public-task conclusions without source support.
- Check data minimization, retention, rights handling, access controls, school scoping, and audit logging.
- Treat learners aged 12-18 as vulnerable data subjects with child-friendly transparency requirements.
- Escalate Art. 9, Art. 10, Art. 22, profiling, consent under 16, cross-border transfer, or high residual DPIA risk.

## DPA, DPIA, And School Onboarding

- Confirm the DPA/verwerkersovereenkomst, security annex, subprocessor list, privacy notice, and school DPIA route are aligned.
- Do not say a school can deploy without its own DPIA/FG review when high-risk or minors' data is involved.
- Confirm provider DPA, region, retention, subprocessor, training-use, and transfer evidence is available or marked open.
- Keep "ready for school review" separate from "legally approved" or "deployed-ready".

## Subprocessors And Providers

- List provider, service, role, data categories, location/region, transfer safeguard, DPA status, retention, training-use status, and subprocessor source.
- Treat provider pages as drift-prone; browse before updating or approving claims.
- If evidence is missing, write "te verifieren" or "providerbewijs nodig" rather than filling the gap with assumptions.

## Finding Labels

- `BLOCK`: claim is unsupported, contradicted by source-of-truth, missing required legal/FG review, or introduces a privacy/security risk.
- `WARN`: acceptable only with a wording change, caveat, provider evidence, or school-specific confirmation.
- `ALLOW`: source-backed, cautious, and within the current evidence trail.
