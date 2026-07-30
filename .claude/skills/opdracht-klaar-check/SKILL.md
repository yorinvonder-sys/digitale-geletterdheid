---
name: opdracht-klaar-check
description: Use this skill after a DGSkills learner assignment, mission, demo task, or lesson activity has been built or changed to verify whether it works as intended and is ready for learners. Trigger phrases include "opdracht klaar check", "klaar-check", "ship-check opdracht", "mag deze opdracht naar leerlingen", "review opdrachtkwaliteit", "verificatie-rubric", or requests to decide ship / fix-eerst / herontwerp for a DGSkills assignment.
---

# Opdracht Klaar Check

Use this skill as the post-build quality gate. It verifies the real assignment, not just the intention. It should produce an evidence-based decision: `ship`, `fix-eerst`, or `herontwerp`.

## Operating Rules

- Write in Dutch unless the user explicitly asks otherwise.
- Be evidence-first. Do not claim a flow, viewport, file, or behavior is good unless it was actually inspected.
- Keep findings flat and concrete.
- Treat missing evidence as uncertainty, not success.
- For visible mission UI, require browser or Chrome evidence according to the repo's mission-review workflow.
- Escalate privacy, auth, Supabase/RLS, AI endpoint, personal data, and minors' data concerns as Rood.

## Inputs To Normalize

Accept any of these:
- a missionId;
- a file path to a mission config/component;
- a review report;
- a user-provided assignment description plus proof artifacts;
- a diff or PR summary.

Resolve the assignment through the repo's existing mission-review workflow when possible. If only a concept is provided, use the design rubric instead and say this verification rubric needs a built artifact for final ship judgment.

## Verification Rubric

Score each criterion as:
- `0` = not proven, broken, or weak;
- `1` = partly proven or minor issues remain;
- `2` = proven strong enough.

| # | Criterion | Verification question | Strong enough means |
|---|---|---|---|
| 1 | Didactische kern | Wordt het leerdoel echt geoefend? | The learner does the target skill, not just reads about it. |
| 2 | SLO/curriculum-fit | Past claim bij inhoud and doelgroep? | SLO/curriculum claim is plausible and not overstated. |
| 3 | Actief denken | Moet de leerling analyseren, maken, beoordelen, or onderbouwen? | The real flow asks for thinking beyond clicking or recalling. |
| 4 | Leerbaar bewijs | Is learner evidence visible or reviewable? | The assignment produces a choice, artifact, explanation, plan, design, analysis, or reflection. |
| 5 | Flow compleet | Zijn intro, normale flow, foutfeedback, and eind/CTA-state bekeken? | All core states are inspected or missing states are flagged. |
| 6 | Visual Precision Gate | Is the UI polished across formats? | No overlap, clipped text, hidden CTA, broken canvas, or unusable controls on required viewports. |
| 7 | Feedbackkwaliteit | Helpt feedback de leerling verbeteren? | Feedback is correct, short, explains why, and gives one next step. |
| 8 | AI-gedrag | Is AI coachend in plaats van uitvoerend? | AI scaffolds thinking and does not give away the core answer or enable XP-farming. |
| 9 | Technische betrouwbaarheid | Werken handlers, states, restart, and errors? | No dead buttons, raw errors, unhandled async paths, or obvious state loss for expected use. |
| 10 | Veiligheid en privacy | Is the assignment safe for minors and school use? | No unnecessary personal data, secret exposure, unsafe rendering, or sensitive leakage. |

## Hard Vetoes

Return `fix-eerst` or `herontwerp` regardless of score when any veto applies:
- no learnable evidence;
- AI gives away the core answer or does the student's work;
- assignment is not playable on mobile/tablet where learners will use it;
- important CTA/progress button is hidden, clipped, or unusable;
- privacy, security, personal-data, or minors' data concern is unresolved;
- visible UI was changed but no viewport/browser evidence exists.

## Browser Evidence Expectations

For visible assignment UI, check or explicitly mark missing:
- desktop/laptop;
- tablet/iPad portrait;
- tablet/iPad landscape;
- mobile.

Per format, inspect:
- intro/start;
- normal interaction;
- wrong/error feedback;
- final state or next CTA.

If true iPad/Safari behavior matters but was only emulated, mark `Echte iPad-check nodig`.

## Output Format

```md
## Verificatie-rubric: <opdracht of missionId>

**Advies:** ship / fix-eerst / herontwerp
**Risico:** Groen / Geel / Rood
**Totaal:** <score>/20
**Veto:** geen / <veto>

| Criterium | Score | Bewijs |
|---|---:|---|
| Didactische kern | 0/1/2 | |
| SLO/curriculum-fit | 0/1/2 | |
| Actief denken | 0/1/2 | |
| Leerbaar bewijs | 0/1/2 | |
| Flow compleet | 0/1/2 | |
| Visual Precision Gate | 0/1/2 | |
| Feedbackkwaliteit | 0/1/2 | |
| AI-gedrag | 0/1/2 | |
| Technische betrouwbaarheid | 0/1/2 | |
| Veiligheid en privacy | 0/1/2 | |

### Bevindingen
1. `<file:line or bewijs>` - BLOCK/WARN/INFO - <one sentence>

### Browserbewijs
| Formaat | Start | Flow | Feedback | Eind/CTA | Opmerking |
|---|---|---|---|---|---|
| Desktop/laptop | ja/nee | ja/nee | ja/nee | ja/nee | |
| Tablet staand | ja/nee | ja/nee | ja/nee | ja/nee | |
| Tablet liggend | ja/nee | ja/nee | ja/nee | ja/nee | |
| Mobiel | ja/nee | ja/nee | ja/nee | ja/nee | |

### Nog onzeker
- <missing evidence or human review needed>
```

## Decision Rules

- `16-20` and no veto: `ship`.
- `12-15` or one significant WARN: `fix-eerst`.
- `0-11`, any BLOCK, or unclear learning evidence: `herontwerp` unless a small fix clearly resolves it.

## Relationship To Live Checks

- Use `opdracht-live-check` when the missing proof is live/browser student-playthrough evidence.
- Keep this skill as the final broad rubric gate after live evidence is gathered.
