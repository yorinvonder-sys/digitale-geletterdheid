# SEO And Landing Page Rules

This subtree contains search-facing landing pages and topical authority pages.

## Read first when editing SEO pages
- `business/nl-vo/sales-assets/01-one-pager-vo.md`
- `business/nl-vo/didactische-onderbouwing.md`
- `business/nl-vo/slo-gap-analyse.md`
- `business/nl-vo/compliance/legal-matrix.md`
- `config/curriculum.ts`
- `config/sloKerndoelen.ts`
- `config/slo-kerndoelen-mapping.ts`

## Security rules
- SEO-pagina's mogen geen interne paden, API-structuur, of technische implementatiedetails bevatten.
- Dynamische content in SEO-pagina's moet XSS-veilig zijn (React escaping standaard, extra sanitization bij raw HTML).

## Content rules
- Use exact SLO terminology where relevant.
- Keep dates and policy claims aligned with source docs and actual product state.
- Do not overstate legal certainty or inspection guarantees.
- SEO pages should still remain faithful to the product, not just optimized for keywords.

## Output expectations
- Explain both the SEO intent and the product truth behind the copy.
- Flag any time-sensitive claim that may need human confirmation.
