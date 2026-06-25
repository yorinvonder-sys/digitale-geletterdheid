# DGSkills Legal Evidence Register

Last updated: 2026-06-25

This register links public legal claims to sources and evidence. It is not legal advice. Rows with `Needs DPO` or `Needs Provider Proof` may not be turned into hard compliance claims.

Required official source URLs:

- https://www.autoriteitpersoonsgegevens.nl/themas/basis-avg
- https://www.autoriteitpersoonsgegevens.nl/themas/basis-avg/privacyrechten-avg/data-protection-impact-assessment-dpia
- https://www.autoriteitpersoonsgegevens.nl/themas/internet-slimme-apparaten/cookies
- https://wetten.overheid.nl/BWBR0040940
- https://www.privacyconvenant.nl/
- https://eur-lex.europa.eu/eli/reg/2016/679/oj
- https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai

| Claim ID | Claim area | Safe claim wording | Primary source | Evidence in repo | Status | Owner | Next review |
|---|---|---|---|---|---|---|---|
| AVG-001 | AVG/GDPR baseline | DGSkills ondersteunt scholen met privacy-by-design maatregelen; schoolinzet vereist DPA, DPIA en FG/DPO-review. | AP basis AVG; GDPR 2016/679; UAVG | `docs/compliance/legal-claim-source-of-truth.md`; `business/nl-vo/compliance/privacyverklaring-dgskills.md` | Needs DPO | Founder + FG/DPO | 2026-09-25 |
| AVG-002 | DPIA | Door minderjarigen, onderwijsdata en AI moet de school een eigen DPIA/FG-review uitvoeren. | AP DPIA guidance | `business/nl-vo/compliance/dpia-dgskills-compleet.md`; `public/compliance/dpia-support-dgskills-v1.html` | Needs DPO | Founder + school | 2026-09-25 |
| AVG-003 | Cookies and analytics | Essential storage is used for login/security; optional first-party analytics runs after consent and is skipped for authenticated users with processing restriction. | AP cookies guidance; GDPR 2016/679 | `src/services/analyticsService.ts`; `supabase/functions/trackClickEvent`; `scripts/check-processing-restriction-enforcement.mjs` | Technical Control Added; Needs DPO Review | Engineering | 2026-09-25 |
| AVG-004 | Processor agreement | School use requires a signed processor agreement and subprocessor approval. | Privacyconvenant Onderwijs; GDPR Art. 28 | `business/nl-vo/compliance/A-model-verwerkersovereenkomst-dgskills.md`; `C-sub-verwerkerslijst-dgskills.md` | Needs DPO | Founder + school | 2026-09-25 |
| AI-001 | AI Act classification | School-facing AI is treated as high-risk education AI where AI evaluates learning outcomes or steers learning. | European Commission AI Act; Regulation 2024/1689 | `business/nl-vo/compliance/eu-ai-act-conformiteitsplan.md`; `annex-iv-technische-documentatie.md` | Needs Legal Review | Founder + legal | 2026-09-25 |
| AI-002 | AI Act dates | Art. 4 applies from 2025-02-02; Art. 50 from August 2026; high-risk education obligations according to current Commission info from 2027-12-02. | European Commission AI Act | `docs/compliance/legal-claim-source-of-truth.md` | Monitor | Founder | 2026-08-01 |
| PROVIDER-001 | AI providers | School-facing AI provider wording is Mistral AI for text/chat/feedback/vision/OCR and Black Forest Labs FLUX for image generation. | Provider contracts/settings to be filed | `scripts/check-mistral-bfl-providers.mjs`; `supabase/functions/_shared/mistralClient.ts`; `bflImageClient.ts` | Needs Provider Proof | Engineering + DPO | 2026-09-25 |
| PROVIDER-002 | Model training | Provider calls are configured and contracted to prevent provider-modeltraining where covered by provider agreements/settings. | Provider DPA/settings to be filed | `docs/compliance/legal-claim-source-of-truth.md`; provider integration checks | Needs Provider Proof | Founder + DPO | 2026-09-25 |
| DATA-001 | Data location | Use only conditional EER/EU-projectregio wording until project/provider settings and contracts are filed. | DPA/subprocessor contracts | `C-sub-verwerkerslijst-dgskills.md`; `privacyverklaring-dgskills.md` | Needs Provider Proof | Founder + DPO | 2026-09-25 |
| RIGHTS-001 | Data subject rights | Export/delete/restrict wording must be cautious: main technically linked data, with backups/auditlogs/DPA terms as caveats; restriction blocks new AI, optional analytics and new non-essential student writes. | AP basis AVG; GDPR Art. 15, 17, 18, 20 | `supabase/functions/exportMyData`; `deleteMyAccount`; `restrictProcessing`; `docs/compliance/gdpr-rights-table-coverage.md`; `supabase/migrations/*_enforce_processing_restriction.sql` | Technical Control Added; Needs DPO Review | Engineering + DPO | 2026-09-25 |
| RETENTION-001 | Retention | Operational activity/feedback/shared work up to 1 year; audit/compliance logs up to 3 years; chat content session-only if not persistently stored. | GDPR Art. 5(1)(e); AP basis AVG | `supabase/migrations/20260221_add_data_retention_policies.sql`; `20260505121000_fix_audit_log_cleanup_timestamp.sql` | Needs Live Proof | Engineering | 2026-09-25 |

Required evidence files before stronger claims:

- Provider DPAs and no-training/settings proof for Mistral AI and Black Forest Labs.
- Supabase project region proof and DPA/subprocessor export.
- School-specific signed DPA and DPIA/FG approval.
- Live retention job proof from Supabase for production.
