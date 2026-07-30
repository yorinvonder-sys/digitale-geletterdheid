---
name: dgskills-jurist-check
description: Legal and compliance judgment for DGSkills (dgskills.app) school-facing work — whether a change, feature, document, or claim is lawful under AVG/UAVG (GDPR), EU AI Act (Regulation 2024/1689, high-risk Annex III 3(b)), Privacyconvenant Onderwijs, and Dutch education law. Also covers compliance triage and source routing for claims, DPIA/DPA evidence, subprocessors, and evidence gaps. Use for "juridische check", "mag dit van de wet", "is dit rechtmatig", "AVG check", "AI Act", "compliance triage", "claim check", "subverwerker", "DPIA-bewijs", "legal review", "onderwijsrecht". Replaces the former dgskills-legal-compliance skill.
---

# DGSkills Jurist-Check

Use the shared Claude playbook as the source of truth:

`.claude/skills/dgskills-jurist-check/SKILL.md`

Read that file before acting and follow its workflow exactly — reading order, J1–J5 test framework, claim discipline, BLOCK/WARN/ALLOW labels, escalation triggers, report format, and the mandatory disclaimer.

The detail files live next to it:

- `.claude/skills/dgskills-jurist-check/references/source-priority.md`
- `.claude/skills/dgskills-jurist-check/references/dgskills-routing.md`
- `.claude/skills/dgskills-jurist-check/references/review-checklists.md`

Keep legal, privacy, AI Act, DPIA, DPA, subprocessor, and release judgments on the strongest available model. Do not delegate a final decision, and never present output as formal legal advice — it stays informative analysis that a real jurist or FG/DPO must confirm.

This skill supersedes `dgskills-legal-compliance` (merged 30 July 2026).
