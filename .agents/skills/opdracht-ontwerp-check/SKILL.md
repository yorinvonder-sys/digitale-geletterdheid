---
name: opdracht-ontwerp-check
description: Use this skill before or during creation of a DGSkills learner assignment, mission, demo task, or lesson activity to judge whether the assignment is well designed before building or rewriting it. Trigger phrases include "opdracht ontwerp check", "ontwerp-check", "maak-check", "ontwerp-rubric", "opdracht ontwerpen", "missie ontwerpen", "check deze opdracht voordat we bouwen", or any request to improve a DGSkills assignment concept before implementation.
---

# Opdracht Ontwerp Check

Use this skill to turn an assignment idea into a build-ready learning task. This is the pre-build rubric: it checks whether the assignment deserves to be built, what should be sharpened first, and which risks must be designed out.

## Operating Rules

- Write in Dutch unless the user explicitly asks otherwise.
- Keep the output short, practical, and decision-oriented.
- Use the repo's risk labels: Groen, Geel, Rood.
- Treat Yorin as the human final decision-maker.
- Do not implement code from this skill alone. If implementation follows, use the repo's normal afstemmingscheck and proof rules.
- For DGSkills work, AI must be a coach/copilot. It must not become an answers machine.

## Inputs To Normalize

Accept any of these:
- a free-text assignment idea;
- a missionId or mission title;
- a lesson goal, SLO code, or curriculum slot;
- an existing config/component that needs redesign.

If the assignment is too vague, infer a small default and mark it as an assumption. Ask only when the wrong assumption would change the learning goal, audience, or risk.

## Design Rubric

Score each criterion as:
- `0` = missing or weak;
- `1` = partly present;
- `2` = strong enough to build.

| # | Criterion | Design question | Strong enough means |
|---|---|---|---|
| 1 | Doelgroep en context | Voor wie is dit, in welke lescontext? | Leerjaar/niveau/context zijn concreet genoeg to write the task. |
| 2 | Leerdoel | Wat moet de leerling na afloop kunnen? | The goal uses an observable action: herkennen, uitleggen, kiezen, ontwerpen, verbeteren, onderbouwen. |
| 3 | Echt probleem | Voelt de opdracht buiten school ook logisch? | The learner has a believable role, scenario, user, product, dilemma, or practical task. |
| 4 | Actief denken | Moet de leerling echt denken? | The task asks for analyzing, evaluating, creating, comparing, improving, or justifying. |
| 5 | Leerbaar bewijs | Wat laat de leerling zien? | There is a visible choice, artifact, explanation, plan, design, analysis, or reflection. |
| 6 | Scaffolding | Hoe wordt hulp opgebouwd en afgebouwd? | Early steps give examples or structure; later steps require more independence. |
| 7 | Feedbackontwerp | Hoe wordt feedback leerzaam? | Feedback will explain why and give one concrete next step without giving away the core answer. |
| 8 | Autonomie | Waar heeft de leerling echte keuze? | The learner chooses topic, route, stance, format, design decision, or solution. |
| 9 | Niveau en taal | Past load, language, and length? | Text is short enough for the doelgroep and uses concrete, age-appropriate language. |
| 10 | Veiligheid, privacy, AI-grens | Wat mag niet misgaan? | No unnecessary personal data; no unsafe topic handling; AI does not do the thinking for the learner. |

## Decision Rules

- `16-20`: `bouwen` if no hard concern remains.
- `12-15`: `eerst aanscherpen`; improve the weakest 1-2 criteria before building.
- `0-11`: `herdenken`; the assignment idea is not ready.

Hard concerns override the score:
- no observable learning goal;
- no learnable evidence;
- AI would provide the answer instead of coaching;
- the assignment likely asks for personal, sensitive, or unsafe learner data;
- the task is too broad for one lesson or one mission.

## Output Format

```md
## Ontwerp-rubric: <opdracht of missionId>

**Advies:** bouwen / eerst aanscherpen / herdenken
**Risico:** Groen / Geel / Rood
**Totaal:** <score>/20
**Belangrijkste ontwerpkeuze:** <one sentence>

| Criterium | Score | Oordeel |
|---|---:|---|
| Doelgroep en context | 0/1/2 | |
| Leerdoel | 0/1/2 | |
| Echt probleem | 0/1/2 | |
| Actief denken | 0/1/2 | |
| Leerbaar bewijs | 0/1/2 | |
| Scaffolding | 0/1/2 | |
| Feedbackontwerp | 0/1/2 | |
| Autonomie | 0/1/2 | |
| Niveau en taal | 0/1/2 | |
| Veiligheid, privacy, AI-grens | 0/1/2 | |

### Eerst aanpassen
- <max 3 concrete changes>

### Build-ready opdrachtkern
- **Leerdoel:**
- **Leerlingbewijs:**
- **AI-rol:**
- **Docentbewijs:**
```

## Good Defaults

- Default doelgroep: onderbouw VO unless the user says otherwise.
- Default lesson length: one compact mission or activity, not a whole project.
- Prefer one strong artifact or reasoned decision over many shallow clicks.
- Prefer a simple assignment that learners finish over a beautiful idea with no evidence of learning.
