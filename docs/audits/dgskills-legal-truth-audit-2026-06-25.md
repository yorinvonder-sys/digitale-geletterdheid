# DGSkills Legal Truth Audit - AVG, EU AI Act and School Compliance

Date: 2026-06-25  
Scope: audit only; no source documents were changed.  
Important: this is an engineering and documentation truth audit, not legal advice. A lawyer, school DPO/FG and procurement/privacy officer should confirm the final legal position before use with schools.

## Executive Summary

DGSkills has a serious compliance foundation in the repo: high-risk AI Act analysis exists, DPIA material exists, export/delete/restriction endpoints exist, AI calls are mostly server-side, consent handling exists, and security headers/CORS are materially implemented.

The current legal/public corpus is not truth-consistent enough for school procurement. The main blockers are not "missing paperwork" only; several public and contractual claims are inaccurate, stale or overconfident when compared with current code, official law sources and provider terms.

### Top Blockers

| Severity | Finding | Why it blocks |
|---|---|---|
| Blocker | AI Act classification conflict: "Limited Risk" appears in public/sales docs while other docs correctly classify DGSkills as high-risk education AI. | For an AI system influencing learning progress/evaluation, the limited-risk framing is not defensible as the primary classification. It materially misleads schools. |
| Blocker | Provider truth is inconsistent: docs alternate between Google Vertex/Gemini, Mistral AI, Black Forest Labs and Anthropic. | Processor lists, DPIA, DPA, privacy copy, zero-training claims and data-residency claims cannot be correct until the actual provider set is frozen and reflected everywhere. |
| Blocker | Zero-training / EU-only claims are broader than the evidence. | Mistral/BFL public legal terms do not by themselves prove "no training" for every DGSkills use. BFL public terms/privacy allow training/improvement use unless separate API/enterprise terms override. Anthropic is also present for a bookkeeping scanner. |
| High | AI Act dates are stale/overgeneralized. | Many docs use 2 August 2026 for all high-risk obligations. The current European Commission AI Act page says transparency rules apply from August 2026, but high-risk education systems listed in Annex III apply from 2 December 2027 after the 2026 simplification package. |
| High | Public "compliant", "voldoet" and "minimal risk" language is too strong. | Internal docs themselves mark risk management, QMS, Annex IV technical documentation, CE/declaration/database registration and some human oversight as not yet done or partial. |
| High | Cookie/privacy claims conflict with implementation. | The app has first-party analytics after consent and backend fingerprinting/hash fields. The formal privacy statement says only strictly necessary cookies and no prior consent is needed. |
| High | Retention claims conflict across UI/docs and migrations. | Public/privacy UI claims 90-day activity/audit logs; migrations show student activities for 1 year and audit logs for 3 years. |
| Medium | Data subject rights are implemented but some "all data" / "direct full erasure" claims are overbroad. | Export covers many tables, but not proven exhaustive against live schema. Account deletion can return partial success if auth deletion fails, and audit log cascade/append-only behavior needs live DB verification. |

## Method

I reviewed the discovered legal/compliance corpus under:

- `business/nl-vo/compliance`
- related `business/nl-vo` launch/sales/procurement documents
- `docs/compliance`
- public compliance HTML under `public/compliance`
- public/legal UI under `src/features/public-site` and `src/features/seo`
- implementation evidence in `supabase/functions`, `supabase/migrations`, `src/services`, `src/components`, `scripts`, `package.json`, and `vercel.json`

I excluded generated screenshots, build output, node modules and historical worktrees except where current public/legal claims referenced them.

Checks run:

- `npm run context:budget` - completed; worktree is dirty with many unrelated existing changes.
- `npm run check:ai-provider-docs` - failed, confirming stale Google/Nano Banana references in scripts.
- `npm run check:ai-usage` - passed; Mistral/BFL provider contract passed.
- `npm run check:rls:functions` - could not run because Docker/Colima socket was unavailable.
- `npm run doctor` - passed.
- Live header checks with `curl -I` for `https://dgskills.app`, `/ict/privacy/ai`, `/compliance-hub` - public pages returned 200 and security headers were present.

Primary sources used:

- European Commission, AI Act overview and timeline: https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai
- Regulation (EU) 2024/1689 text on EUR-Lex: https://eur-lex.europa.eu/eli/reg/2024/1689/oj
- Autoriteit Persoonsgegevens DPIA guidance: https://www.autoriteitpersoonsgegevens.nl/themas/basis-avg/praktisch-avg/data-protection-impact-assessment-dpia
- Autoriteit Persoonsgegevens processor agreement guidance: https://www.autoriteitpersoonsgegevens.nl/themas/basis-avg/avg-algemeen/verwerkersovereenkomst
- Autoriteit Persoonsgegevens pupil record guidance: https://www.autoriteitpersoonsgegevens.nl/themas/onderwijs/gebruik-van-persoonsgegevens-in-het-onderwijs/leerlingdossier
- Rijksoverheid cookie/ePrivacy guidance: https://www.rijksoverheid.nl/vraag-en-antwoord/telecommunicatie/mag-een-website-ongevraagd-cookies-plaatsen
- Supabase regions/security/privacy: https://supabase.com/docs/guides/platform/regions, https://supabase.com/security, https://supabase.com/privacy
- Mistral Legal Center / DPA: https://legal.mistral.ai/terms and https://legal.mistral.ai/terms/data-processing-addendum
- Black Forest Labs privacy/terms: https://bfl.ai/legal/privacy-policy and https://bfl.ai/legal/terms-of-service
- Vercel DPA: https://vercel.com/legal/dpa

## Law Applicability Matrix

| Regime | Applies? | Audit position |
|---|---:|---|
| AVG/GDPR | Applies | DGSkills processes personal data for school users, including minors. School likely acts as controller for school deployment; Future Architect/DGSkills is generally processor for school use, but may also be controller for its own sales, website, support, security and billing processing. |
| UAVG | Applies | Dutch rules matter, especially for minors and consent where processing relies on consent. For school core use, public task/education authority may be the better legal basis, but schools/DPOs must confirm. |
| AVG Art. 28 processor agreement | Applies | School-facing use requires a written processor agreement and accurate subprocessors. Current provider/subprocessor lists are not accurate enough. |
| AVG Art. 30 records | Applies | A processing register exists in docs, but provider and retention truth must be updated. |
| AVG Art. 32 security | Applies | Many technical controls exist. RLS/function proof could not be fully rerun locally because Docker was unavailable. |
| AVG Art. 35 DPIA | Likely required | AI education platform, minors, systematic progress tracking, profiling/evaluation signals and innovative AI make DPIA a high-probability requirement. Current docs correctly treat DPIA as required in several places. |
| AVG Art. 36 prior consultation | Needs DPO/legal confirmation | Docs say prior consultation is not needed if residual risk is reduced. That may be true only after school-specific DPIA and actual mitigations are confirmed. Do not state as final for every school. |
| ePrivacy / Telecommunicatiewet cookies | Applies | Essential cookies/local storage can be used without consent; analytics/tracking-like storage needs careful consent analysis. DGSkills has consent-gated first-party analytics, so "only strictly necessary, no consent needed" is false. |
| EU AI Act Art. 4 AI literacy | Applies to providers/deployers | DGSkills and schools must take measures for staff/other users operating AI systems on their behalf. Public copy should avoid implying a generic school curriculum mandate unless tied to DGSkills' education offer. |
| EU AI Act Art. 5 prohibited practices | Applies as a check | Emotion recognition in education is a specific red-flag/prohibited area. DGSkills claims no emotion recognition; I saw no contrary repo evidence in the sampled implementation. |
| EU AI Act Annex III education high-risk | Likely applies | DGSkills AI appears to influence learning progress/evaluation via step completion, progress, XP, growth recommendations or feedback. "Limited Risk" is not the right primary classification. |
| EU AI Act Art. 9-17, 43, 47-49, 72 | Applies if DGSkills is provider of high-risk AI system | Internal docs correctly identify these obligations but statuses/deadlines are stale and public copy overstates completion. |
| EU AI Act Art. 26 deployer obligations | Applies to schools; DGSkills must support | Schools need instructions, human oversight, monitoring, DPIA/FRIA where applicable and logs. DGSkills can support, but should not imply schools are fully covered by using DGSkills docs. |
| NIS2 / Dutch cyber legislation | Maybe | Not enough evidence that DGSkills itself is in scope. Schools may have sector duties. Treat as "needs counsel", not as a current compliance claim. |
| Accessibility/procurement duties | Maybe | Relevant for selling to schools/public entities, but not fully audited here because the corpus focused on privacy/AI. |
| Copyright/IP in AI outputs | Needs counsel | Some terms claim AI output is not copyright protected. That is too broad and should be softened. |

## Claim-by-Claim Findings

### 1. AI Act "Limited Risk" classification is wrong for DGSkills' school AI flow

Verdict: incorrect / blocker.

Repo claims:

- `public/compliance/school-compliance-guide.html:139-145` says DGSkills uses supporting AI via Mistral and falls under "Limited Risk" Art. 50.
- `business/nl-vo/compliance/school-compliance-guide.html:141-147` says the same, with Google Gemini.
- `business/nl-vo/compliance/eu-ai-act-conformiteitsplan.md:12-63` correctly says DGSkills is high-risk under Annex III point 3(b), and that the Art. 6(3) exception is not defensible.
- `src/features/public-site/ict/AiTransparency.tsx:76-93` also recognizes high-risk education AI.

Official source:

- The European Commission describes high-risk AI as including AI in education where it may determine access/course of education or professional life, including scoring exams, and lists obligations such as risk mitigation, high-quality datasets, logging, documentation, human oversight and cybersecurity.
- EUR-Lex Regulation (EU) 2024/1689 Annex III includes education/vocational-training uses, including evaluation of learning outcomes or steering the learning process.

Repo/technical evidence:

- Internal legal docs identify AI-generated `STEP_COMPLETE` markers, XP/progress and learning route influence.
- `business/nl-vo/compliance/dpia-dgskills-compleet.md:52-69` treats DPIA and high-risk classification as tied to evaluation/learning-process steering.
- `business/nl-vo/compliance/dpia-dgskills-compleet.md:546-553` describes AI-generated growth recommendations and teacher approval.

Recommended correction:

Use: "DGSkills behandelt de school-facing AI-functionaliteit als een hoog-risico AI-systeem onder Annex III, punt 3(b), voor zover AI-output leerresultaten evalueert of het leerproces stuurt. Art. 50-transparantie is aanvullend, niet de hoofdclassificatie."

Do not use: "Limited Risk" as the classification for school-facing AI.

### 2. AI Act deadline of 2 August 2026 is stale for high-risk education obligations

Verdict: partially incorrect / high.

Repo claims:

- `business/nl-vo/compliance/eu-ai-act-conformiteitsplan.md:5` says high-risk obligations deadline is 2 August 2026.
- `business/nl-vo/compliance/eu-ai-act-conformiteitsplan.md:489-572` builds a full plan around 2 August 2026.
- `business/nl-vo/compliance/dpia-dgskills-compleet.md:521-532` lists Art. 9-15, 49 and 50 deadlines as 2 August 2026.
- `src/features/seo/ComplianceChecklist.tsx:149-231` repeats the 2 August 2026 high-risk deadline.
- `src/features/seo/AiGeletterdheid.tsx:81-89` says full AI Act conformance before August 2026.

Official source:

- Current European Commission AI Act page: prohibited practices and AI literacy apply from 2 February 2025; GPAI rules from 2 August 2025; transparency rules from August 2026; high-risk systems in Annex III education and related categories apply from 2 December 2027 after the 2026 simplification package.

Recommended correction:

Split dates:

- Art. 4 AI literacy: 2 February 2025.
- Art. 50 transparency: August 2026.
- High-risk education obligations for Annex III education systems: use current Commission date, 2 December 2027, while noting counsel should monitor final legislative/transition updates.

Keep internal readiness work earlier if desired, but label it as an internal target, not the legal deadline.

### 3. Public pages overstate AI Act compliance completion

Verdict: incorrect / blocker where public-facing.

Repo claims:

- `src/features/public-site/ict/AiTransparency.tsx:86-93` says DGSkills "voldoet aan de bijbehorende verplichtingen".
- `src/features/public-site/ict/AiTransparency.tsx:118-120` says the statement satisfies transparency obligations including high-risk requirements.
- `public/compliance/school-compliance-guide.html:188` says DGSkills offers necessary measures to comply with AVG and AI Act and school implementation risk is minimal.
- `business/nl-vo/compliance/school-compliance-guide.html:198-199` says implementation risk is low and manageable.

Contrary repo evidence:

- `business/nl-vo/compliance/eu-ai-act-conformiteitsplan.md:80-82` says Art. 9 risk management is not met.
- `business/nl-vo/compliance/eu-ai-act-conformiteitsplan.md:141-143` says Annex IV technical documentation is not met.
- `business/nl-vo/compliance/eu-ai-act-conformiteitsplan.md:234-253` says human oversight is only partially met and teacher override/noodstop are missing.
- `business/nl-vo/compliance/eu-ai-act-conformiteitsplan.md:321-323` says no formal QMS exists.
- `business/nl-vo/compliance/eu-ai-act-conformiteitsplan.md:415-425` says EU AI database registration is not done.

Recommended correction:

Use: "DGSkills is designed to support AI Act compliance and already implements transparency, server-side AI routing, consent gates, logging and teacher-control patterns. Several high-risk provider obligations still require formal documentation, QMS, validation, registration/declaration steps and school/DPO review."

Do not use: "voldoet", "compliant", "minimal risk", "fully covered" unless backed by a signed legal/compliance dossier.

### 4. Provider/subprocessor truth is inconsistent and currently not procurement-ready

Verdict: incorrect / blocker.

Repo claims:

- `business/nl-vo/compliance/verwerkingsregister.md:56-80` says AI chat uses Google Vertex AI/Gemini in `europe-west4`.
- `business/nl-vo/compliance/algemene-voorwaarden-dgskills.md:20-23` defines AI components as Google Vertex AI/Gemini.
- `business/nl-vo/compliance/C-sub-verwerkerslijst-dgskills.md:37-59` lists Google LLC/Vertex AI as the AI subprocessor.
- `src/features/public-site/ict/PrivacyPolicy.tsx:97-110` lists Supabase, Mistral AI and Black Forest Labs.
- `public/compliance/dpa-dgskills-v4.html:136-138` lists Google Ireland Ltd. but describes "AI-verwerking via Mistral, FLUX image generation, Edge Functions and database infrastructure".
- `src/components/app-shell/PrivacyModal.tsx:151-157` says Mistral powers AI, processing is in Belgium, and Google keeps API inputs 30 days.

Repo/technical evidence:

- `scripts/check-mistral-bfl-providers.mjs:34-87` enforces Mistral/BFL and rejects direct Google/Vertex fallback in the main AI paths.
- `supabase/functions/_shared/mistralClient.ts:26-44` calls Mistral chat/OCR endpoints with `MISTRAL_API_KEY`.
- `supabase/functions/_shared/bflImageClient.ts:15-42` defaults to `https://api.eu.bfl.ai` and `flux-2-klein-9b`.
- `supabase/functions/scanSubscriptionClaude/index.ts:1-5` and `:204-214` show an Anthropic Claude scanner for bookkeeping/developer use.
- `npm run check:ai-usage` passed, supporting current Mistral/BFL routing for main AI paths.
- `npm run check:ai-provider-docs` failed, finding stale Google/Nano Banana references in scripts.

Recommended correction:

Create one provider source of truth and propagate it everywhere:

- School/student AI chat/OCR/vision: Mistral, if that is current.
- Image generation: Black Forest Labs FLUX, if that is current.
- Developer/bookkeeping scanner: Anthropic, if deployed/available, and mark as outside school learner processing if true.
- Supabase/Vercel/Zoho/etc.: list exactly by service and actual data categories.

Remove Google Vertex/Gemini claims unless the code and live environment actually use Google again.

### 5. Zero-training and data-residency guarantees are overbroad

Verdict: unproven / blocker.

Repo claims:

- `public/compliance/school-compliance-guide.html:144` and `business/nl-vo/compliance/school-compliance-guide.html:146` promise zero-training.
- `src/features/public-site/ict/AiTransparency.tsx:34-37` says learner AI data is never used to train third-party models and all processing happens in secure EU API environments.
- `src/features/public-site/ict/PrivacyPolicy.tsx:125-130` says data is not used for marketing profiling or model training.
- `src/features/seo/AiGeletterdheid.tsx:96-99` says a zero-training guarantee.

Provider/legal evidence:

- Mistral's public DPA describes Mistral as processor for customer personal data, but also says Mistral may process certain data as controller for training/feedback/usage unless opt-outs, product settings or zero-data-retention arrangements apply.
- Black Forest Labs' public privacy policy/terms allow use of interactions/input/output for operating, developing, training or improving services/models. That may be overridden by separate API/enterprise terms, but those were not proven in the repo.
- Anthropic usage exists in the repo for the subscription/receipt scanner, contradicting blanket "only Mistral/BFL" or "all AI EU" language if that function is deployed with personal/business documents.

Recommended correction:

Use conditional, evidence-based wording:

"For school learner AI flows, DGSkills routes provider calls server-side and is configured to avoid using learner input for provider model training where this is covered by the applicable provider agreement/settings. DGSkills must keep signed DPAs, opt-out/ZDR confirmations and subprocessor terms on file. Public no-training claims are only valid after those documents are verified for Mistral, BFL and any other active AI provider."

### 6. Data location claims conflict across Ireland, Frankfurt, Netherlands, Belgium and EU endpoints

Verdict: inconsistent / high.

Repo claims:

- `public/compliance/school-compliance-guide.html:134` says all data including AI API is in Supabase/AWS `eu-west-1` Ireland.
- `business/nl-vo/compliance/C-sub-verwerkerslijst-dgskills.md:29-31` says Supabase processing is `eu-central-1` Frankfurt.
- `business/nl-vo/compliance/dpia-dgskills-compleet.md:468-472` says Supabase is `eu-west-1` Ireland and Vertex AI is `europe-west4`.
- `src/features/public-site/ict/PrivacyPolicy.tsx:97-109` says Supabase Ireland, Mistral EU API processing, BFL EU endpoint.
- `src/components/app-shell/PrivacyModal.tsx:155-156` says Belgium and Google 30-day retention.
- `src/features/seo/AiGeletterdheid.tsx:91-98` says EU Eemshaven/Belgium.

Official/source evidence:

- Supabase documents supported project regions including `eu-west-1` and `eu-central-1`; the correct region is project-specific and must be verified from project settings or Supabase CLI/API.
- BFL code defaults to an EU endpoint, but "EU endpoint" is not the same as a full contractual data-residency guarantee.
- Vercel uses global edge infrastructure; the DPA and actual project settings matter.

Recommended correction:

Replace broad location claims with a verified data-location table:

- Supabase project region: verified live project setting, exact region.
- Supabase Edge Functions: verified deployment region/runtime behavior.
- Mistral: contractual processing location and transfers per DPA/settings.
- BFL: API endpoint plus contractual processing/storage/training terms.
- Anthropic/developer scanner: location/transfers and whether school/student data is excluded.
- Vercel: global edge/CDN and transfer mechanism; do not claim all hosting stays in one EU city unless configured and proven.

### 7. DPIA support is directionally right, but "light/limited risk" wording underplays the risk

Verdict: partially incorrect / high.

Repo claims:

- `business/nl-vo/compliance/dpia-dgskills-compleet.md:52-69` correctly says a DPIA is required because of high-risk processing, minors, AI and learning evaluation.
- `public/compliance/dpia-support-dgskills-v1.html:126-131` says the risk profile can in many cases be considered limited if the school signs the DPA and its own context adds no risks.
- `public/compliance/school-compliance-guide.html:184` and `business/nl-vo/compliance/school-compliance-guide.html:195` refer to an internal DPIA "light".

Official source:

- AP guidance says a DPIA is required where processing is likely to create high privacy risk. AP education guidance emphasizes that pupil records are privacy-sensitive and children are extra vulnerable.

Recommended correction:

Use: "DGSkills provides DPIA support material. Because the platform involves minors, school progress data, AI interaction and possible learning evaluation/profiling, each school should treat the DPIA as a substantive DPIA, not a light formality. The school's FG/DPO must assess residual risk and whether prior consultation is needed."

### 8. Cookie and analytics claims conflict with code

Verdict: incorrect / high.

Repo claims:

- `business/nl-vo/compliance/privacyverklaring-dgskills.md:466-480` says DGSkills only uses strictly necessary cookies and therefore no prior consent is required.
- `src/features/public-site/ict/CookiePolicy.tsx:25-27` says minimal cookies plus anonymous usage analysis.
- `src/features/public-site/ict/CookiePolicy.tsx:55-58` lists internal click analytics.
- `src/features/public-site/ict/CookiePolicy.tsx:98-104` says no third-party analytics and first-party aggregate analytics.

Repo/technical evidence:

- `src/components/app-shell/CookieConsent.tsx:93-104` stores accepted/declined analytics consent and logs it.
- `src/components/app-shell/CookieConsent.tsx:130-138` explicitly lists analytics.
- `src/components/app-shell/CookieConsent.tsx:179-190` only returns true after accepted consent.
- `src/services/analyticsService.ts:110-118` skips analytics if no consent.
- `supabase/functions/trackClickEvent/index.ts` was reviewed by the sidecar and stores role/device/metric fields plus an IP+UA fingerprint hash.

Official source:

- Rijksoverheid explains that cookies with little/no privacy impact may be placed without consent, but tracking cookies require consent and AVG applies where personal data is processed.

Recommended correction:

Use: "DGSkills uses essential storage for login/security and optional first-party analytics after consent. Analytics are not shared with Google Analytics/Facebook/etc., but they are not purely 'strictly necessary' and should not be described as consent-free."

Also replace "anonymous" with "pseudonymous/aggregated where possible" unless the backend truly cannot single out users/devices.

### 9. Retention claims are internally inconsistent

Verdict: incorrect / high.

Repo claims:

- `src/features/public-site/ict/PrivacyPolicy.tsx:133-137` says activity logs are kept max 90 days.
- `src/components/app-shell/PrivacyModal.tsx:265-268` says activity logs are 90 days and chats are session-only.
- `public/compliance/school-compliance-guide.html:136` and `business/nl-vo/compliance/school-compliance-guide.html:136` say security logs are kept 90 days.
- `business/nl-vo/compliance/dpia-dgskills-compleet.md:107-117` says activities/feedback/shared work are 1 year and audit logs 3 years.

Repo/technical evidence:

- `supabase/migrations/20260221_add_data_retention_policies.sql:8-12` sets operational data to 1 year and audit logs to 3 years.
- `supabase/migrations/20260221_add_data_retention_policies.sql:79-87` purges `student_activities` older than 1 year.
- `supabase/migrations/20260221_add_data_retention_policies.sql:116-124` purges `audit_logs` older than 3 years.
- `supabase/migrations/20260402200000_harden_audit_logs.sql:61-80` replaces direct audit-log deletion with a cleanup function for 3-year retention.

Recommended correction:

Use a single retention table with exact categories:

- session-only chat content, if truly not persisted;
- student activities: 1 year, if migration reflects live DB;
- audit/compliance logs: 3 years, if live DB reflects migration;
- account deletion/backups: define primary DB deletion vs backup deletion separately.

Do not say "all logs 90 days" unless the database policy is changed.

### 10. Export/delete/restriction claims are real but should be softened

Verdict: partially supported / medium.

Repo claims:

- `src/features/public-site/ict/PrivacyPolicy.tsx:145-148` says export/delete/restriction are directly possible.
- `business/nl-vo/compliance/dpia-dgskills-compleet.md:434-443` marks rights implementation as implemented.

Repo/technical evidence:

- `supabase/functions/exportMyData/index.ts:55-126` exports many user-linked tables and logs export.
- `supabase/functions/deleteMyAccount/index.ts:70-111` deletes public user data and auth user, but returns partial success if `auth.users` deletion fails.
- `supabase/functions/restrictProcessing/index.ts` exists, but sidecar found analytics/export paths are not consistently gated by `processing_restricted`.
- `supabase/migrations/20260222010000_cascade_delete_policies.sql:19-25` sets audit logs to cascade on user deletion.
- `supabase/migrations/20260402200000_harden_audit_logs.sql:1-8` later makes audit logs append-only but does not visibly change that cascade relationship.

Risk:

"Direct possible" is acceptable for user UX, but "all data" and "permanent/full erasure" need live schema proof. The deletion audit entry may be deleted by cascade depending on final live FK/trigger behavior. That is not necessarily wrong, but it conflicts with compliance traceability if deletion evidence is expected to survive.

Recommended correction:

Use: "Self-service export and account deletion are implemented for the main user-linked tables. Final completeness depends on the live schema, backup retention and school/controller procedures. Restriction requests are registered and should be checked against analytics/AI/export paths before claiming full automated enforcement."

### 11. Security header/CORS claims are mostly supported, with nuance

Verdict: mostly supported / medium nuance.

Repo claims:

- `business/nl-vo/compliance/school-compliance-guide.html:153-158` claims CSP hardening and no unsafe inline scripts.
- `business/nl-vo/compliance/dpia-dgskills-compleet.md:341-356` lists TLS, JWT, RLS, CORS whitelist and server-side credentials.

Repo/live evidence:

- `vercel.json:49-54` sets `script-src 'self'` and no `unsafe-inline` for scripts. It still permits `style-src 'self' 'unsafe-inline'`.
- `supabase/functions/_shared/cors.ts:6-99` restricts edge-function CORS to production origins and local dev origins based on env.
- Live headers returned CSP, HSTS, `nosniff`, `x-frame-options: DENY`, permissions policy and public page 200 responses.
- Live public/static headers also include `access-control-allow-origin: *`; this is less concerning for static public pages than for authenticated API/edge functions, but public claims should distinguish the two.

Recommended correction:

Say: "Edge functions use a production CORS allowlist; public static pages may send broad public CORS headers. CSP blocks inline scripts; inline styles are still allowed for current styling."

### 12. Public privacy language says "strictest AVG standards" and "AVG compliant" too strongly

Verdict: overconfident / high.

Repo claims:

- `src/features/public-site/ict/IctPrivacy.tsx` uses wording like "strengste AVG-normen" and "AVG-compliant".
- `public/compliance/school-compliance-guide.html:188` and `business/nl-vo/compliance/school-compliance-guide.html:198-199` give strong compliance conclusions.

Reality:

The codebase has real controls, but provider truth, retention, cookie language, high-risk AI docs, school-specific DPIA and processor agreement status are not aligned. "AVG compliant" is a legal conclusion that should not be used as a blanket marketing claim.

Recommended correction:

Use: "AVG-bewust ontworpen", "privacy-by-design maatregelen", "ondersteunt scholen bij AVG-verplichtingen", "onder voorbehoud van school-DPIA, verwerkersovereenkomst en DPO-review".

## Contradiction List

| Topic | Contradictory sources |
|---|---|
| AI Act classification | `public/compliance/school-compliance-guide.html:140` says Limited Risk; `business/nl-vo/compliance/eu-ai-act-conformiteitsplan.md:12-63` says high-risk; `src/features/public-site/ict/AiTransparency.tsx:76-93` says high-risk. |
| AI provider | `verwerkingsregister.md` and `C-sub-verwerkerslijst` say Google Vertex; public privacy says Mistral/BFL; code says Mistral/BFL for main paths; `scanSubscriptionClaude` uses Anthropic. |
| Data region | Claims include Ireland `eu-west-1`, Frankfurt `eu-central-1`, Netherlands `europe-west4`, Belgium, EU endpoint and Vercel global/EU CDN. |
| Training | Public pages promise never training; Mistral/BFL public terms require contract/settings proof; BFL public terms are not compatible with a blanket no-training statement without additional agreement. |
| Cookies | Formal privacy statement says only essential/no consent; app has consent-gated first-party analytics and a cookie banner. |
| Retention | UI/public pages say 90 days; DPIA/migrations say 1 year operational and 3 years audit. |
| Security/CORS | Docs claim CORS whitelist; edge functions support this, but live public/static pages send broad public CORS headers. |
| DPA subprocessors | `public/compliance/dpa-dgskills-v4.html:136-138` lists Google Ireland for Mistral/FLUX/Supabase/Vercel-like services. |
| Human oversight | Public AI page says teacher has full insight and DGSkills meets obligations; internal AI Act plan says teacher override/noodstop/monitoring are partial or missing. |

## Recommended Wording Fixes

### Replace AI Act classification copy

Current unsafe pattern:

> DGSkills valt onder Limited Risk (Art. 50 AI Act).

Safer wording:

> DGSkills treats its school-facing AI functionality as high-risk education AI where AI output evaluates learning outcomes or steers the learning process. Art. 50 transparency duties also apply. DGSkills is building and documenting the required high-risk controls; school deployment still requires school/DPO review.

### Replace "fully compliant" copy

Current unsafe pattern:

> DGSkills voldoet aan AVG en EU AI Act; implementatierisico is minimaal.

Safer wording:

> DGSkills is designed with AVG, ePrivacy and AI Act controls in mind and provides documentation for school procurement and DPIA review. Final compliance depends on signed processor terms, school-specific DPIA/FG approval, accurate subprocessors, verified retention, and completion of remaining high-risk AI Act documentation and governance steps.

### Replace zero-training guarantee

Current unsafe pattern:

> Student input is never used to train third-party models.

Safer wording:

> DGSkills routes learner AI requests server-side and is configured to prevent learner input being used for provider model training where covered by applicable provider agreements/settings. DGSkills must retain written proof for each active AI provider and disclose any provider-specific retention/training exceptions.

### Replace cookie statement

Current unsafe pattern:

> DGSkills only uses strictly necessary cookies; no consent is needed.

Safer wording:

> DGSkills uses essential storage for login/security and optional first-party analytics. Optional analytics runs only after consent and can be declined or withdrawn. DGSkills does not use third-party advertising analytics.

### Replace retention statement

Current unsafe pattern:

> Activity/security logs are kept 90 days.

Safer wording:

> Retention differs by data category. Current database policy indicates operational activity/feedback data is retained for up to 1 year and audit/compliance logs for up to 3 years, unless a school contract or legal requirement requires a different verified period.

### Replace provider list

Current unsafe pattern:

> Google AI / Mistral / BFL mixed in the same DPA row.

Safer wording:

> Maintain one table with actual providers: Supabase, Vercel, Mistral, Black Forest Labs, Anthropic if active, Zoho if active, and any underlying cloud/subprocessors required by signed provider terms. For each: service, categories, region, transfer mechanism, DPA status, no-training/ZDR proof, and whether school learner data is processed.

## Recommended Priority Plan

1. Freeze a single provider/subprocessor source of truth.
2. Remove all "Limited Risk" school-facing AI copy.
3. Update AI Act timeline: separate Art. 4, Art. 50 and Annex III high-risk dates.
4. Replace public "compliant/voldoet/minimal risk" claims with support/review language.
5. Align retention across UI, privacy policy, DPIA, migrations and school-facing guides.
6. Fix cookie/ePrivacy copy to match consent-gated first-party analytics.
7. Verify live Supabase project region, cron jobs, audit log FK/trigger behavior and RLS/function tests.
8. Obtain and store legal proof for Mistral/BFL/Anthropic DPAs, no-training/ZDR settings, subprocessors and transfer mechanisms.
9. Re-issue DPA/subprocessor appendix and DPIA support docs after provider truth is fixed.
10. Ask a lawyer/DPO to review high-risk AI Act provider/deployer allocation, school legal basis, DPIA residual risk and prior consultation position.

## Needs Lawyer / DPO Confirmation

- Whether every DGSkills school-facing AI feature is high-risk, or whether a narrower feature-by-feature split is defensible.
- Whether DGSkills is always processor for school use, or joint/independent controller for specific analytics, product improvement, security, sales/support or AI logging activities.
- Whether public-task legal basis is appropriate for every school deployment and how parent/guardian consent is handled for under-16 optional processing.
- Whether prior consultation with AP is unnecessary after the school-specific DPIA.
- Whether BFL, Mistral and Anthropic terms actually prohibit model training for DGSkills school data under the active account/plan/settings.
- Whether international transfers are adequately covered by DPF/SCCs/TIAs for each active provider.
- Whether Article 22 AVG is truly not triggered by progress, XP, recommendations and teacher approval flows.
- Whether "AI output not copyright protected" language in terms is legally safe.
- Whether AI Act CE marking, EU declaration, QMS and EU database registration obligations apply exactly as provider obligations for DGSkills' implementation.

## Verification Gaps

- `npm run check:rls:functions` could not run because Docker/Colima was unavailable. RLS/function evidence is therefore based on code/migration inspection, not a fresh local policy test.
- I did not mutate or query production Supabase data.
- Live project region/provider settings were not changed or read from authenticated dashboards.
- Provider no-training/ZDR/DPA status was not proven from signed account documents, only public legal/provider pages and repo code.
- The audit is claim-level and evidence-backed, but it is not a signed legal opinion.

