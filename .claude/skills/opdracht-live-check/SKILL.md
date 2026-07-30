---
name: opdracht-live-check
description: Use this skill when checking a DGSkills assignment or mission in the live website or a running browser as a real student would experience it. Trigger phrases include "opdracht live check", "live-check", "check live als leerling", "speel de opdracht als student", "student-playthrough", "UI/UX live check", "staan logo's en afbeeldingen goed", or requests to verify that a DGSkills assignment is visually correct, playable, logical, and free of obvious browser/UI bugs.
---

# Opdracht Live Check

Use this skill for the live, human-facing QA pass: behave like a student, play the whole assignment, and verify the page looks and works correctly in the browser. This is not a code review first; it is a lived student-flow check.

## Operating Rules

- Write in Dutch unless the user explicitly asks otherwise.
- Start from the live URL or running local/dev URL the user provides. If none is provided, resolve the likely mission URL from the repo and state the assumption.
- Prefer Chrome/browser evidence over static code claims.
- Behave like a normal student: read what is on screen, click/tap expected controls, make reasonable learner choices, and notice confusion.
- Do not use admin shortcuts, database edits, local state manipulation, or hidden implementation knowledge to complete the assignment.
- Do not enter real personal data, learner data, secrets, or sensitive information. Use harmless test text.
- If login or a real student account is required and unavailable, stop at the blocker and report what could and could not be checked.

## What To Check

### 1. Visual UI/UX

Check whether the assignment screen looks professionally placed and understandable:
- logo is visible, sharp, not stretched, and not covering content;
- images and thumbnails load, fit their containers, and are not cropped in a misleading way;
- icons match their buttons and are not floating or misaligned;
- headers, cards, panels, progress indicators, badges, and CTAs align cleanly;
- text is readable and not clipped, overlapping, too tiny, or outside its container;
- spacing feels intentional, with no random empty gaps or cramped clusters;
- colors and contrast make the main action obvious;
- no weird decorative element blocks the assignment.

### 2. Student Playthrough

Play the whole assignment as a student:
- start from the entry/intro screen;
- follow the instructions without using code knowledge;
- interact with every required step;
- intentionally try at least one wrong or imperfect answer when possible;
- observe feedback, hint, retry, progress, score, and completion behavior;
- finish the assignment or explain the exact blocker.

Look for:
- dead buttons;
- confusing labels;
- buttons in weird places;
- progress that does not update;
- feedback that does not match the action;
- impossible or illogical next steps;
- missing final CTA or unclear completion;
- accidental navigation away from the task.

### 3. Browser And Device Coverage

For visible assignment UI, check at least:
- desktop/laptop;
- tablet/iPad portrait;
- tablet/iPad landscape;
- mobile.

For each format, inspect:
- start/intro state;
- normal mid-flow state;
- wrong/error feedback state;
- end/completion/next CTA state.

Mark `Echte iPad-check nodig` when Safari/iPad behavior could differ and only browser emulation was used.

### 4. Technical Signals From The Browser

Check and report:
- console errors or warnings that affect the student flow;
- failed network requests;
- broken image/logo requests;
- long loading states;
- obvious hydration/rendering glitches;
- page reload or back/forward weirdness if it affects play.

Do not over-report harmless dev-only warnings unless they visibly affect the student.

## Decision Rules

Return:
- `ship` when the assignment is visually sound, fully playable, and no student-facing bug remains.
- `fix-eerst` when the assignment mostly works but one or more visible issues should be fixed before learners use it.
- `herontwerp` when the flow is confusing, incomplete, visually broken, or cannot be completed by a normal student.

Hard blockers:
- assignment cannot be started or completed;
- required CTA or answer control is hidden, clipped, disabled, or placed illogically;
- logo/image/content overlaps the task;
- important text is unreadable or clipped;
- wrong answer/feedback state is broken;
- console/network failure blocks normal play;
- mobile or tablet version is not usable.

## Output Format

```md
## Opdracht Live Check: <missionId/title/url>

**Advies:** ship / fix-eerst / herontwerp
**Risico:** Groen / Geel / Rood
**Getest als:** leerling / gast / demo / geblokkeerd door login
**URL:** <url>

### Student-playthrough
- Start:
- Normale flow:
- Fout/feedback:
- Eind/CTA:

### Visuele UI/UX
- Logo's:
- Afbeeldingen:
- Layout/alignment:
- Tekst/knoppen:

### Browserbewijs
| Formaat | Start | Flow | Feedback | Eind/CTA | Opmerking |
|---|---|---|---|---|---|
| Desktop/laptop | ja/nee | ja/nee | ja/nee | ja/nee | |
| Tablet staand | ja/nee | ja/nee | ja/nee | ja/nee | |
| Tablet liggend | ja/nee | ja/nee | ja/nee | ja/nee | |
| Mobiel | ja/nee | ja/nee | ja/nee | ja/nee | |

### Bevindingen
1. `<bewijs of screenshot/viewport>` - BLOCK/WARN/INFO - <one sentence>

### Nog onzeker
- <login blocker, real iPad needed, untested state, or none>
```

## Relationship To Other Checks

- Use `opdracht-ontwerp-check` before building or rewriting a concept.
- Use `opdracht-klaar-check` as the final broad rubric gate.
- Use this skill when the main question is: "Does the live assignment actually look right and play right for a student?"
