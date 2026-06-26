# DGSkills Post-Market Monitoring Plan

Last updated: 2026-06-25

This is an internal readiness plan for EU AI Act post-market monitoring. It is not legal advice, not a declaration of conformity and not a public compliance claim. DGSkills may use this file to show that post-market controls are being prepared and documented, while final deployment still requires legal review, school DPO/FG review, provider evidence and the full conformity dossier.

## Legal Baseline

- Official legal text: https://eur-lex.europa.eu/eli/reg/2024/1689/oj
- Operational reference: https://artificialintelligenceact.eu/article/72/
- Internal claim source: `docs/compliance/legal-claim-source-of-truth.md`
- Internal evidence register: `docs/compliance/legal-evidence-register.md`
- Control matrix: `docs/compliance/ai-act-control-matrix.md`

Article 72 requires a documented post-market monitoring system for high-risk AI systems that actively and systematically collects, documents and analyses relevant performance data throughout the system lifetime. DGSkills treats school-facing AI as high-risk education AI where AI output evaluates learning outcomes or steers learning.

## Scope

This v1 process covers internal readiness monitoring for:

- AI chat, feedback, image and drawing-analysis usage telemetry.
- AI assessment and teacher-oversight events.
- Audit-log signals related to AI, consent, data rights and security.
- Optional operational health indicators such as web vitals.
- Incidents, complaints, model/provider changes and legal guidance changes.

Out of scope for v1:

- No new teacher-facing dashboard.
- No public compliance score.
- No new database table or migration.
- No raw prompts, AI responses, learner names, emails, direct user identifiers or secrets in generated reports.

## Evidence Sources

| Source | Existing evidence | Privacy boundary | Use in review |
|---|---|---|---|
| AI usage telemetry | `public.ai_usage_events`; `supabase/functions/_shared/aiUsageLogger.ts` | Aggregate endpoint, provider, model, status and token/count fields only. Do not export request IDs, user IDs, school IDs or metadata that could identify a learner. | Usage volume, errors, blocked requests, fallbacks, retry pressure and model/provider changes. |
| AI oversight events | `public.ai_oversight_events`; migration `20260415100002_add_ai_oversight_events.sql` | Aggregate event type, mission and SLO code. Do not export teacher/student IDs or free-text reasoning. | Human oversight activity, teacher overrides and review acknowledgements. |
| General audit logs | `public.audit_logs`; `src/services/auditService.ts` | Aggregate action names only. Do not export `uid`, `school_id` or `data`. | Consent, data-rights and safety-relevant process evidence. |
| Web vitals | `public.web_vitals_events` where available | Aggregate metric, rating and sanitized route only. Strip query strings and identifier-like path fragments. | Operational performance anomalies that could affect safe use. |

## Review Cadence

- Run one readiness review per quarter until launch.
- Run the first formal review directly after launch.
- Run an ad-hoc review after any material AI provider change, safety incident, serious complaint, high-risk model behavior change, legal guidance update or security event.
- Record every review in `docs/compliance/post-market-reviews/`.

## Review Workflow

1. Choose a bounded review window with explicit dates.
2. Collect only aggregate-safe fields from existing tables, or use a local JSON export containing those fields.
3. Generate the report:

```bash
npm run postmarket:review -- --from=2026-04-01 --to=2026-07-01 --out=docs/compliance/post-market-reviews/2026-Q2.md
```

When using an offline export:

```bash
npm run postmarket:review -- --from=2026-04-01 --to=2026-07-01 --input=/path/to/aggregate-safe-export.json --out=docs/compliance/post-market-reviews/2026-Q2.md
```

4. Review anomalies and decide whether any corrective action is needed.
5. Link concrete follow-up actions to Notion/GitHub where relevant.
6. Update the evidence register only with safe, reviewed conclusions.

## Report Sections

Every report must contain these sections:

- Scope
- Sources
- Usage summary
- Oversight events
- Incidents and anomalies
- Review decisions
- Actions
- Next review date

## Safety Rules

- Reports must stay aggregate-only.
- Generated reports must not include raw prompt text, AI response text, chat transcripts, student names, teacher names, direct identifiers, emails, API keys or secrets.
- Reports must use cautious wording: preparing, documenting, monitoring, reviewing. Do not write that DGSkills is fully AI Act compliant or conforms to the AI Act unless a signed conformity dossier exists.
- If the report exposes a serious incident pattern, pause public claim updates and route the issue to legal/DPO review before publishing any external statement.

