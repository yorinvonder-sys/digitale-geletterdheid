---
name: dgskills-legal-compliance
description: Compliance triage and source-routing guidance for DGSkills school-facing legal, privacy, and AI governance work. Use when reviewing, writing, or modifying claims, docs, product flows, or evidence involving AVG/GDPR, UAVG, EU AI Act, DPIA, FG/DPO review, verwerkersovereenkomsten/DPA, subprocessors, minors' data, Dutch schools, AI literacy/transparency, human oversight, or AI education high-risk classification.
---

# DGSkills Legal Compliance

## Overview

Use this skill to keep DGSkills compliance work source-bound, cautious, and useful for Dutch schools. Treat outputs as compliance triage and implementation guidance, not legal advice or a final legal opinion.

DGSkills handles minors' data in an AI education context. Keep `gpt-5.5` on legal/compliance judgment, final risk calls, and school-facing wording. Do not delegate final privacy, AI Act, DPIA, DPA, subprocessor, or release decisions.

## Core Workflow

1. Scope the question: identify whether it is marketing/copy, product behavior, technical control, school onboarding, DPIA/DPA evidence, subprocessor evidence, or legal classification.
2. Read repo source-of-truth first for DGSkills-specific claims:
   - `docs/compliance/legal-claim-source-of-truth.md`
   - `docs/compliance/legal-evidence-register.md`
   - Relevant files under `business/nl-vo/compliance/`
3. Use official/current external sources when the legal rule, deadline, authority position, or school guidance might have changed. Prefer AP, EUR-Lex, Wetten.nl, European Commission, Kennisnet, SIVON, Privacyconvenant Onderwijs, and EDPB.
4. Separate confirmed evidence, repo assumptions, open evidence gaps, and items requiring jurist/FG/DPO review.
5. For code/config changes, run the repo's normal checks. For docs/legal wording, at minimum run `npm run check:legal` unless the task is a read-only review.

## Claim Discipline

Use cautious, evidence-backed wording:

- Prefer: "AVG-bewust ontworpen", "privacy-by-design maatregelen", "ondersteunt scholen bij hun AVG-verplichtingen", "voorbereid op AI Act-verplichtingen", "onder voorbehoud van DPA, DPIA en FG/DPO-review".
- Avoid: "AVG-compliant", "voldoet volledig aan de AVG", "AI Act compliant", "juridisch goedgekeurd", "zero-training guarantee", "geen risico", "school kan direct live zonder DPIA".
- Never turn a draft document, historical audit, unchecked provider page, or model memory into a public compliance claim.
- Never say DGSkills is fully AI Act conformant unless a signed conformity dossier and required legal review exist.
- If a claim concerns provider training, retention, data location, subprocessor status, or transfer safeguards, require provider evidence and record the evidence gap if missing.

## Escalation Triggers

Escalate to a jurist, FG/DPO, or formal school review before finalizing when any of these are true:

- Final DPIA approval, DPA/verwerkersovereenkomst signing, subprocessor approval, or Transfer Impact Assessment is needed.
- A feature processes minors' personal data in a new way or adds a new AI provider, analytics tool, export, retention path, or external sharing path.
- AI output may evaluate learning results, steer a learning path, affect access to opportunities, or require human oversight under the AI Act.
- The answer would classify a system as prohibited, high-risk, limited-risk, or outside scope under the AI Act.
- The question involves Art. 9 special-category data, Art. 10 criminal data, Art. 22 automated decision-making, profiling of minors, consent under 16, or cross-border transfers.
- Public wording would claim legal compliance, conformity, certification, guarantee, or school deployment readiness.

## Required References

Load only the needed reference file:

- `references/source-priority.md`: source hierarchy and official links.
- `references/dgskills-routing.md`: which DGSkills compliance docs to inspect for each kind of work.
- `references/review-checklists.md`: practical review checklists for claims, features, school onboarding, DPIA/DPA, subprocessors, and AI risk.

## Output Shape

For reviews, lead with findings:

- `BLOCK`: unsupported compliance claim, missing legal/evidence gate, privacy/security risk, or required legal review missing.
- `WARN`: acceptable with caveat, wording change, provider evidence, or school-specific confirmation.
- `ALLOW`: source-backed and within approved cautious wording.

For implementation work, include changed files, why they changed, checks run, and remaining legal/privacy risk.
