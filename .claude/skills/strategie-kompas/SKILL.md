---
name: strategie-kompas
description: Use this DGSkills strategy skill to check whether a new product idea, feature, mission concept, roadmap item, marketing claim, sales offer, or growth idea fits DGSkills' mission, vision, target audiences, USP, do's and don'ts, anti-personas, trade-offs, evidence bar, and current small-slice strategy. Trigger phrases include "strategie-kompas", "toets dit idee", "past dit bij DGSkills", "missie visie USP", "anti-persona", "do's and don'ts", "strategie document", "feature idee beoordelen", "roadmap keuze", "productstrategie", or any request to judge whether an idea aligns with DGSkills before building or selling it.
---

# Strategie Kompas

Use this skill to turn a DGSkills idea into a strategic decision. It is a pre-build and pre-sales filter: it decides whether an idea deserves action, needs a small validation test, should be parked, or should be rejected.

## Operating Rules

- Write in Dutch unless the user explicitly asks otherwise.
- Keep the output short, practical, and decision-oriented.
- Treat Yorin as the final product decision-maker.
- Do not implement code or rewrite product copy from this skill alone.
- Do not install or copy external PM skills as part of this skill.
- Treat auth, admin, Supabase/RLS, AI endpoints, secrets, payments, invoices, exports, personal data, and minors' data as Rood.
- If a claim touches AVG, DPIA, DPA, AI Act, minors' data, or school governance, route the claim through `dgskills-legal-compliance` before public use.
- Prefer `small slice -> evidence -> ship -> next slice` over broad audits, big rewrites, or strategy theater.

## Strategy Sources

Use these repo sources when the user asks for a grounded DGSkills check:

- `business/nl-vo/branding-document.md`: mission, vision, values, target audiences, positioning, do's and don'ts.
- `business/nl-vo/07-usp-strategy-and-messaging.md`: USP architecture, proof matrix, packages, and website messaging.
- `business/nl-vo/12-go-to-market-strategie.md`: go-to-market context when the idea is sales, channel, pilot, or launch related.

Use external PM frameworks only as mental scaffolding. Do not copy Dean Peters skill text into repo artifacts because its license is non-commercial/share-alike. The `phuryn/pm-skills` approach is useful inspiration for strategy canvas, value proposition, discovery, and red-team structure, but the DGSkills answer must be grounded in DGSkills sources.

## Normalize The Idea

Accept any of these inputs:

- a feature idea;
- a mission or assignment idea;
- a marketing or sales claim;
- a roadmap item;
- a pricing or package idea;
- a user request, school request, or founder hunch.

If the idea is vague, infer a small default and mark it as an assumption. Ask only when the wrong assumption would change doelgroep, risk, public claim, or implementation cost.

## Strategic Rubric

Score each criterion as:

- `0` = weak or unclear;
- `1` = partly fits but needs sharpening;
- `2` = strong enough to act on.

| # | Criterion | Question | Strong enough means |
|---|---|---|---|
| 1 | Missie en visie | Helpt dit digitale geletterdheid concreet, veilig en kritisch maken? | It clearly supports DGSkills' mission, not just generic edtech growth. |
| 2 | Doelgroep | Voor wie is this really? | The learner, teacher, school leader, or ICT buyer is specific. |
| 3 | USP-versterking | Welke DGSkills-belofte wordt sterker? | It reinforces mission-driven learning, SLO proof, teacher relief, safety, or classroom practicality. |
| 4 | Echt probleem | Welk painful classroom or school problem does it solve? | The problem is believable from school reality, not just a nice-to-have. |
| 5 | Trade-off | What will DGSkills consciously not do? | The idea names what stays out of scope to protect focus. |
| 6 | Anti-persona | Who should we not optimize for? | It avoids serving users that pull DGSkills away from VO/VSO learning, safety, or proof. |
| 7 | Evidence | What proof is needed before building or claiming it? | There is a cheap test, teacher proof, learner proof, demo proof, or data proof. |
| 8 | Simplicity | Is the first slice small enough? | The next action can be validated without a broad refactor or multi-area build. |
| 9 | Risk | What can go wrong? | Privacy, compliance, safety, sales trust, and workload risks are named. |
| 10 | Timing | Is this the right thing now? | It fits current readiness better than polishing or expanding prematurely. |

## Decision Rules

- `16-20`: `doen` if no hard concern remains.
- `12-15`: `testen`; define the smallest validation step before building.
- `8-11`: `parkeren`; keep the idea but do not spend implementation time now.
- `0-7`: `niet doen`; it conflicts with focus, evidence, doelgroep, or risk.

Hard concerns override the score:

- the idea creates a public legal/compliance claim without proof;
- the idea touches minors' personal data or AI assessment without a privacy/safety route;
- the idea makes DGSkills feel generic instead of mission-driven;
- the idea adds work before the core teacher/learner flow is proven;
- the idea mainly serves an anti-persona or a buyer DGSkills should not chase.

## Anti-Persona Defaults

Use these defaults unless the user gives better ones:

- Schools wanting a generic LMS instead of a digital literacy learning environment.
- Buyers who only want compliance paperwork and do not care about learner experience.
- Teachers who want AI to replace teaching instead of reducing admin and supporting coaching.
- Feature requests that optimize for one custom school workflow at the cost of product clarity.
- Growth ideas that require overclaiming safety, AI capability, or inspection readiness.

## Output Format

```md
## Strategie-kompas: <idee>

**Advies:** doen / testen / parkeren / niet doen
**Risico:** Groen / Geel / Rood
**Totaal:** <score>/20
**Kort oordeel:** <one sentence>

| Criterium | Score | Oordeel |
|---|---:|---|
| Missie en visie | 0/1/2 | |
| Doelgroep | 0/1/2 | |
| USP-versterking | 0/1/2 | |
| Echt probleem | 0/1/2 | |
| Trade-off | 0/1/2 | |
| Anti-persona | 0/1/2 | |
| Evidence | 0/1/2 | |
| Simplicity | 0/1/2 | |
| Risk | 0/1/2 | |
| Timing | 0/1/2 | |

### Waarom wel/niet
- <max 3 bullets>

### Kleinste bewijsstap
- <one concrete validation step>

### Niet doen
- <what to avoid so the idea stays aligned>
```

## Good Defaults

- Default doelgroep: onderbouw VO/VSO plus the teacher who needs to run the lesson.
- Default first proof: one teacher demo, one learner playthrough, one small prototype, or one sales conversation.
- Prefer one sharp product promise over five broad benefits.
- Prefer proof from the live classroom or product over founder intuition.
- Prefer mission quality, teacher trust, and school-safe evidence over adding more features.
