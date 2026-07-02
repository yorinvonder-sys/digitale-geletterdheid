# DGSkills Legal Claim Source of Truth

Last updated: 2026-06-25

This document is the working source of truth for school-facing legal, privacy and AI Act wording in DGSkills. It is not legal advice and must be reviewed by a lawyer and the school FG/DPO before being used as a final legal position.

## Official Source Baseline

- Autoriteit Persoonsgegevens basis AVG: https://www.autoriteitpersoonsgegevens.nl/themas/basis-avg
- Autoriteit Persoonsgegevens DPIA: https://www.autoriteitpersoonsgegevens.nl/themas/basis-avg/privacyrechten-avg/data-protection-impact-assessment-dpia
- Autoriteit Persoonsgegevens cookies: https://www.autoriteitpersoonsgegevens.nl/themas/internet-slimme-apparaten/cookies
- UAVG: https://wetten.overheid.nl/BWBR0040940
- Privacyconvenant Onderwijs: https://www.privacyconvenant.nl/
- GDPR/AVG Regulation 2016/679: https://eur-lex.europa.eu/eli/reg/2016/679/oj
- European Commission AI Act: https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai

## EU AI Act

- Treat DGSkills school-facing AI as high-risk education AI where AI output evaluates learning outcomes or steers the learning process, including progress, XP, step completion or recommendations.
- Article 4 AI literacy has applied since 2 February 2025.
- Article 50 transparency duties apply from August 2026.
- The current European Commission AI Act page states that high-risk obligations for Annex III education systems apply from 2 December 2027. Use that date for public roadmap copy, while monitoring legal updates.
- DGSkills may say it is preparing and documenting high-risk controls. Do not say full AI Act compliance is already achieved unless a signed conformity dossier exists.

## AVG, DPIA And School Review

- DGSkills is designed to support AVG/GDPR compliance for Dutch schools, but school deployment still requires a signed processor agreement, a school-specific DPIA/FG review and correct subprocessor approval.
- Avoid blanket claims such as "AVG-compliant" or "voldoet aan de AVG" in school-facing copy.
- Preferred wording: "AVG-bewust ontworpen", "privacy-by-design maatregelen", "ondersteunt scholen bij hun AVG-verplichtingen" and "onder voorbehoud van DPA, DPIA en FG-review".

## Processing Restriction Enforcement

- `processing_restricted=true` is enforced as a strict but workable AVG Art. 18 technical control.
- New school-facing AI provider calls, optional authenticated analytics and new non-essential student writes are blocked for restricted users.
- Necessary auth, security, audit, export/delete/restrict, consent administration, teacher oversight and existing school records remain available.
- Do not claim this alone completes AVG compliance; it is technical support for school/DPO handling of a restriction request.

## Providers And Data Location

- Current school-facing AI provider wording: Mistral AI for text, chat, feedback, vision and OCR; Black Forest Labs FLUX for image generation; provider calls run server-side through Supabase Edge Functions.
- Anthropic may only be mentioned as an internal developer/accounting helper unless school or learner data is proven to pass through it.
- Do not claim Google Vertex/Gemini as the active school-facing AI provider unless the code and live environment have been migrated back and verified.
- Do not hard-code exact Supabase or AI processing regions in public copy unless verified from project/provider settings and contracts.
- Preferred wording for location: "opslag en verwerking binnen de EER/EU-projectregio waar contractueel en projectmatig vastgelegd".

## Training, Analytics And Retention

- Do not use unconditional "zero-training guarantee" wording. Use conditional wording: provider calls are configured and contracted to prevent use for model training where covered by applicable provider agreements/settings, and evidence must be kept per provider.
- Essential cookies/storage support login and security. Optional first-party analytics runs only after consent.
- Analytics should be described as first-party and consent-gated, pseudonymous or aggregated where possible, not as purely anonymous unless technically proven.
- Retention must match the database policy: operational activity, feedback and shared work are kept for up to 1 year; audit/compliance logs for up to 3 years; chat content is session-only if not persistently stored.

## School Compliance Guide — Canonical Source And Sync

The school compliance guide (`school-compliance-guide.html`) exists in three locations that must stay identical:

- **Canonical source:** `business/nl-vo/compliance/school-compliance-guide.html` — the single hand-edited master.
- **Published copy:** `public/compliance/school-compliance-guide.html` — served live at `/compliance/school-compliance-guide.html` and linked from ComplianceHub and the ICT/privacy page.
- **Dev-docs mirror:** `public/dev-docs/school-compliance-guide.html` — part of the internal docs bundle (`public/dev-docs/manifest.json`); `.vercelignore`'d, so it is not deployed.

Only edit the canonical source. Propagate changes to the published copy and the dev-docs mirror with:

- `npm run sync:compliance-guide` — copy the source verbatim into both copies.
- `npm run check:compliance-guide-sync` — verify the copies match the source (exit 1 on drift; safe to add to CI once the copies are in sync).

Claim wording in this guide is school-facing legal/privacy content: change it only in the canonical source and only per the wording rules above, then sync. Because the published copy is live, promoting new content to it should go through the same lawyer/FG review as any other public compliance claim.
