# DGSkills AI Act Control Matrix

Last updated: 2026-06-25

DGSkills treats school-facing AI as high-risk education AI where AI output evaluates learning outcomes or steers the learning process. This matrix tracks controls; it is not a declaration of conformity.

| Control area | Required direction | Current evidence | Status | Owner |
|---|---|---|---|---|
| Risk management | Identify, document and reduce risks for minors, learning outcomes and bias. | `risicoregister-ai-act.md` | Needs Legal Review | Founder + DPO |
| Data governance | Minimize student data sent to AI providers and document prompt context. | AI endpoint code; system instructions; processing-restriction enforcement | Technical Control Added; Needs DPO Review | Engineering |
| Technical documentation | Maintain Annex IV-style documentation and provider evidence. | `annex-iv-technische-documentatie.md`; evidence register | Needs Provider Proof | Founder |
| Logging | Log AI interactions and step-complete markers without storing prompt content or unnecessary PII. | `auditService.ts`; server-side audit inserts; restricted users blocked from new AI usage logs | Technical Control Added; Needs Flow Test | Engineering |
| Transparency | Mark AI interactions and explain role of AI to students, teachers and schools. | `/ict/privacy/ai`; public AI pages | Monitor | Product |
| Human oversight | Teachers keep final responsibility and can review/override relevant AI outcomes. | teacher override logs; dashboard flows; RLS keeps existing school records available | Needs Flow Test | Engineering |
| Accuracy/robustness | Track fallback, model, validation and output constraints. | provider checks; usage telemetry | Needs Monitoring | Engineering |
| Cybersecurity | Keep provider calls server-side, secrets out of client, rate-limit endpoints. | `check:ai-usage`; edge function shared clients | Monitor | Engineering |
| Post-market monitoring | Keep incidents, complaints, model/provider changes and legal updates in a review cadence. | `post-market-monitoring-plan.md`; `post-market-review-template.md`; `postmarket:review`; evidence register review dates | Technical Process Added; Needs First Review | Founder + Engineering |

Before any public "conformity" wording: legal review, DPO/FG review, provider evidence and school deployer instructions must be complete.
