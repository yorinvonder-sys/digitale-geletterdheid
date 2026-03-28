# School-Facing UI Rules

This subtree is school-facing marketing, procurement, and ICT communication UI.

## Read first when editing school-facing pages
- `business/nl-vo/sales-assets/01-one-pager-vo.md`
- `business/nl-vo/sales-assets/02-demo-script-vo.md`
- `business/nl-vo/07-usp-strategy-and-messaging.md`
- `business/nl-vo/04-compliance-and-procurement-pack.md`
- `business/nl-vo/didactische-onderbouwing.md`
- `business/nl-vo/compliance/legal-matrix.md`
- relevant product files such as `components/teacher/SLOClassOverview.tsx` and `config/curriculum.ts`

## Claim discipline
- Every claim must be supportable by the product, codebase, or compliance docs.
- Do not invent or amplify compliance, AI Act, privacy, or reporting claims.
- "Inspectie-proof", "één klik", "volledige dekking", and similar phrases require product evidence.
- Avoid promising features that are not visible in the current product or documents.

## Security rules
- School-facing pagina's mogen geen interne API-endpoints, database-structuur, of technische details lekken.
- Formulieren op school-pagina's moeten server-side gevalideerd worden (XSS, injection).
- Privacy- en security-claims op school-pagina's moeten overeenkomen met de werkelijke implementatie.

## Messaging rules
- Target audience: school leaders, ICT coordinators, and decision makers in VO.
- Keep tone clear, concrete, and trustworthy.
- Connect copy to actual product benefits:
  - leerlingmotivatie
  - docentontzorging
  - aantoonbare SLO-dekking
  - veilige en verantwoorde inzet

## Output expectations
- Explain what a school would understand from the change.
- Flag any claim that is persuasive but not yet fully evidenced.
