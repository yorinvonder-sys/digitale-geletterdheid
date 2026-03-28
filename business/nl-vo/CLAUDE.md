# Business And School Documentation Rules

This subtree contains school-facing business, pilot, sales, didactic, and compliance materials.

## Read first when editing these docs
- `business/nl-vo/didactische-onderbouwing.md`
- `business/nl-vo/slo-gap-analyse.md`
- `business/nl-vo/sales-assets/01-one-pager-vo.md`
- `business/nl-vo/sales-assets/02-demo-script-vo.md`
- `business/nl-vo/07-usp-strategy-and-messaging.md`
- `business/nl-vo/04-compliance-and-procurement-pack.md`
- product truth in:
  - `config/curriculum.ts`
  - `config/slo-kerndoelen-mapping.ts`
  - `components/teacher/SLOClassOverview.tsx`
  - `components/ProjectZeroDashboard.tsx`

## Security & compliance rules
- Compliance-claims in documenten moeten overeenkomen met de technische werkelijkheid.
- Verwijs naar specifieke controls (RLS, MFA, CSP, CORS) alleen als ze daadwerkelijk geïmplementeerd zijn.
- Privacy-documenten (DPIA, verwerkingsregister, privacyverklaring) zijn juridisch bindend — wijzig ze alleen na expliciete instructie.
- AI Act classificatie is HIGH RISK. Claim nooit "beperkt risico" in school-facing documenten.

## Documentation rules
- Do not let documentation drift away from the actual product.
- Sales copy, didactic claims, and compliance claims must agree with the codebase where relevant.
- If a statement is aspirational rather than current reality, label it clearly.
- Prefer clear Dutch for school audiences over marketing inflation.

## Output expectations
- State what changed in the document.
- State whether it reflects current product behavior, future roadmap, or a proposal.
- Flag any claims that need product verification before external use.
