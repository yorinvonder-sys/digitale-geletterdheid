# Frontpage Interactions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace unexplained frontpage mascot decoration and abstract controls with one purposeful assignment guide, a concrete teacher action, and an authentic playable Game Programmeur demo.

**Architecture:** Keep page storytelling in `ScholenLandingStory.tsx`, but move the two interactive demonstrations into focused components backed by pure reducers. Render the platform game as a responsive in-page SVG driven by a small requestAnimationFrame loop; reuse the real Game Programmeur concepts without loading the authenticated mission or an iframe.

**Tech Stack:** React 19, TypeScript, Framer Motion, SVG, Tailwind CSS, Node test runner, Image 2.0, Vite, Vercel.

## Global Constraints

- Keep the duck in the official DGSkills header and footer logos.
- Remove decorative DuckMark and all repeated Kees narrator blocks from the frontpage.
- Use one Image 2.0 assignment-guide image outside the logo and always preserve its instruction as text fallback.
- Teacher flow must be touch, mouse, and keyboard operable and announced with `aria-live`.
- Game must support tap/click and focused Space input, score, collision, game over, restart, and three authentic modifications.
- No horizontal overflow at 320, 360, 375, 390, 768, or 1024 CSS pixels.
- Respect `prefers-reduced-motion`.
- Work only on `codex/frontpage-story-preview`; do not change the live branch or production domain.

---

### Task 1: Concrete teacher action state and UI

**Files:**
- Create: `src/features/public-site/story/teacherActionState.ts`
- Create: `src/features/public-site/story/teacherActionState.test.ts`
- Create: `src/features/public-site/story/TeacherActionDemo.tsx`
- Modify: `src/features/public-site/ScholenLandingStory.tsx`

**Interfaces:**
- Produces: `TeacherActionState`, `teacherActionReducer(state, action)`, `teacherActiveCount(state)`, and `<TeacherActionDemo reduceMotion={boolean} />`.
- Consumes: no later-task interfaces.

- [ ] **Step 1: Write failing reducer tests**

```ts
test('selects only a stalled student', () => {
  const selected = teacherActionReducer(INITIAL_TEACHER_ACTION_STATE, { type: 'select', student: 25 });
  assert.equal(selected.selectedStudent, 25);
});

test('sends one hint and increments the active count once', () => {
  const selected = teacherActionReducer(INITIAL_TEACHER_ACTION_STATE, { type: 'select', student: 25 });
  const helped = teacherActionReducer(selected, { type: 'send-hint' });
  const repeated = teacherActionReducer(helped, { type: 'send-hint' });
  assert.equal(teacherActiveCount(helped), 25);
  assert.equal(teacherActiveCount(repeated), 25);
});

test('reset restores the 24 of 28 starting state', () => {
  const reset = teacherActionReducer(
    { selectedStudent: 25, helpedStudent: 25 },
    { type: 'reset' },
  );
  assert.deepEqual(reset, INITIAL_TEACHER_ACTION_STATE);
});
```

- [ ] **Step 2: Run the tests and confirm RED**

Run: `node --test src/features/public-site/story/teacherActionState.test.ts`

Expected: FAIL because `teacherActionState.ts` does not exist.

- [ ] **Step 3: Implement the reducer**

```ts
export type StalledStudent = 25 | 26 | 27 | 28;
export interface TeacherActionState {
  selectedStudent: StalledStudent | null;
  helpedStudent: StalledStudent | null;
}
export const INITIAL_TEACHER_ACTION_STATE = { selectedStudent: null, helpedStudent: null } satisfies TeacherActionState;
export function teacherActiveCount(state: TeacherActionState) {
  return state.helpedStudent ? 25 : 24;
}
```

Implement `select`, `send-hint`, and `reset` without allowing a repeated hint to change the count again.

- [ ] **Step 4: Build the focused teacher interaction**

`TeacherActionDemo.tsx` must render:

- the sentence “Vier leerlingen zijn nog niet gestart.”;
- a three-state legend;
- 28 class tiles, with students 25–28 labelled and selectable;
- the instruction “Tik op een lichte tegel en help één leerling starten.”;
- a selected-student detail card;
- “Stuur gerichte hint” and “Opnieuw proberen” buttons;
- an `aria-live="polite"` confirmation.

Replace the `active === 1` tile block inside `LessonStage` with `<TeacherActionDemo reduceMotion={reduceMotion} />`. Remove the old `lessonStageState` active-student toggling from this chapter while retaining the coach interaction for `active === 2`.

- [ ] **Step 5: Run tests and commit**

Run: `node --test src/features/public-site/story/teacherActionState.test.ts src/features/public-site/story/lessonStageState.test.ts`

Expected: PASS.

Commit: `feat: clarify teacher dashboard interaction`

---

### Task 2: Game Programmeur state and physics helpers

**Files:**
- Create: `src/features/public-site/story/gameProgrammerState.ts`
- Create: `src/features/public-site/story/gameProgrammerState.test.ts`
- Create: `src/features/public-site/story/platformGameEngine.ts`
- Create: `src/features/public-site/story/platformGameEngine.test.ts`

**Interfaces:**
- Produces: `GameModification`, `GameProgrammerState`, `gameProgrammerReducer`, `gameSettingsFor`, `advancePlatformFrame`, `jumpPlatformPlayer`, and shared frame geometry.
- Consumes: no Task 1 interfaces.

- [ ] **Step 1: Write failing game-state tests**

```ts
test('selecting each authentic modification exposes its variable and value', () => {
  assert.equal(gameSettingsFor('color').playerColor, '#5F947D');
  assert.ok(gameSettingsFor('jump').jumpForce < gameSettingsFor(null).jumpForce);
  assert.ok(gameSettingsFor('speed').obstacleSpeed > gameSettingsFor(null).obstacleSpeed);
});

test('start, game over, and restart form a replayable flow', () => {
  const started = gameProgrammerReducer(INITIAL_GAME_PROGRAMMER_STATE, { type: 'start' });
  const ended = gameProgrammerReducer(started, { type: 'game-over', score: 30 });
  const restarted = gameProgrammerReducer(ended, { type: 'restart' });
  assert.equal(started.status, 'playing');
  assert.deepEqual(ended, { ...started, status: 'game-over', score: 30 });
  assert.equal(restarted.status, 'playing');
  assert.equal(restarted.runId, started.runId + 1);
});
```

- [ ] **Step 2: Write failing physics tests**

Test that `jumpPlatformPlayer` only jumps from the ground, `advancePlatformFrame` moves obstacles left, increments score after passing an obstacle, and reports collision for overlapping rectangles.

- [ ] **Step 3: Run the tests and confirm RED**

Run: `node --test src/features/public-site/story/gameProgrammerState.test.ts src/features/public-site/story/platformGameEngine.test.ts`

Expected: FAIL because both implementation modules are missing.

- [ ] **Step 4: Implement state and deterministic engine**

Use these public shapes:

```ts
export type GameModification = 'color' | 'jump' | 'speed';
export type GameStatus = 'ready' | 'playing' | 'game-over';
export interface GameSettings {
  playerColor: string;
  jumpForce: number;
  obstacleSpeed: number;
}
export interface PlatformFrame {
  playerY: number;
  velocityY: number;
  obstacles: ReadonlyArray<{ id: number; x: number; height: number; scored: boolean }>;
  score: number;
  elapsed: number;
  collision: boolean;
}
```

Use fixed viewBox geometry so tests and rendering share the same collision model.

- [ ] **Step 5: Run tests and commit**

Run: `node --test src/features/public-site/story/gameProgrammerState.test.ts src/features/public-site/story/platformGameEngine.test.ts`

Expected: PASS.

Commit: `feat: add game programmer demo engine`

---

### Task 3: Responsive playable platform game

**Files:**
- Create: `src/features/public-site/story/PlatformGame.tsx`
- Create: `src/features/public-site/story/GameProgrammerDemo.tsx`
- Modify: `src/features/public-site/ScholenLandingStory.tsx`
- Delete: `src/features/public-site/story/MiniMissionBuilder.tsx`
- Delete: `src/features/public-site/story/miniMissionState.ts`
- Modify: `src/features/public-site/story/miniMissionState.test.ts` and rename it to `gameProgrammerDemo.test.ts`

**Interfaces:**
- Consumes: `GameSettings`, `GameStatus`, `gameProgrammerReducer`, `advancePlatformFrame`, and `jumpPlatformPlayer` from Task 2.
- Produces: `<PlatformGame settings status runId onScoreChange onGameOver />` and `<GameProgrammerDemo />`.

- [ ] **Step 1: Write the failing component source contract**

Assert that the new demo includes:

```ts
for (const expected of [
  'Speler groen',
  'Hoger springen',
  'Snellere obstakels',
  'Tik of druk op spatie om te springen',
  'Game over',
  'Speel opnieuw',
  'aria-keyshortcuts="Space"',
]) assert.ok(source.includes(expected));
```

Assert that the source does not include `game_programmeur_new.webp`, `CODEWERELD`, or `DuckMark`.

- [ ] **Step 2: Implement `PlatformGame`**

Render a responsive SVG with:

- paper/green sky gradient, simple clouds, ground and ink outlines;
- a geometric student game character;
- pipe obstacles from the engine frame;
- score and state overlay;
- a focusable playfield with click/tap and focused Space handling;
- requestAnimationFrame cleanup on status change and unmount;
- the gameplay loop remains functional with reduced motion, while decorative cloud drift, bounce, and transition effects are disabled.

- [ ] **Step 3: Implement `GameProgrammerDemo`**

Compose:

- three modification cards with selected state;
- explicit variable/effect feedback;
- a start button disabled until a modification is chosen;
- the playfield;
- restart and choose-another-modification controls;
- teacher evidence shown after a played attempt.

Replace `<MiniMissionBuilder />` in `ScholenLandingStory.tsx` with `<GameProgrammerDemo />` and remove obsolete imports/files.

- [ ] **Step 4: Run tests and commit**

Run: `node --test src/features/public-site/story/*.test.ts && npm run doctor`

Expected: all tests and critical TypeScript checks PASS.

Commit: `feat: replace mini mission with game programmer demo`

---

### Task 4: One purposeful Image 2.0 guide and mascot cleanup

**Files:**
- Create: `public/assets/story/assignment-guide-kees.webp`
- Create: `src/features/public-site/story/AssignmentGuide.tsx`
- Modify: `src/features/public-site/story/MissionWalkthrough.tsx`
- Modify: `src/features/public-site/ScholenLandingStory.tsx`
- Modify: `src/features/public-site/story/GameProgrammerDemo.tsx`
- Modify: `src/features/public-site/story/missionWalkthroughState.test.ts`
- Delete: `src/features/public-site/story/KeesNarrator.tsx`

**Interfaces:**
- Produces: `<AssignmentGuide instruction="…" />`, used exactly once in `GameProgrammerDemo`.
- Consumes: the generated image at `/assets/story/assignment-guide-kees.webp`.

- [ ] **Step 1: Generate the guide asset with Image 2.0**

Generate a single hand-drawn editorial DGSkills duck guide, three-quarter body pose pointing deliberately toward an instruction panel, graduate cap, warm paper and controlled acid-lime accents, transparent or plain warm-paper background, no text, no UI, no sticker outline, no childish 3D style.

Convert the result to WebP and preserve a useful source aspect ratio for mobile and desktop.

- [ ] **Step 2: Write the failing mascot contract**

Assert:

- `ScholenLandingStory.tsx` contains exactly two `DuckMark` usages: header and footer logo;
- `MissionWalkthrough.tsx` contains neither `KeesNarrator` nor `DuckMark`;
- `GameProgrammerDemo.tsx` contains one `AssignmentGuide` usage;
- `AssignmentGuide.tsx` contains the generated asset path and visible instruction text.

- [ ] **Step 3: Remove random mascot placements**

Replace narrator blocks with compact semantic instruction panels using existing icons and copy. Remove the hero narrator, gallery narrator, teacher-evidence narrator, school-pilot duck decoration, and all MissionWalkthrough narrator instances. Keep only official header/footer logo marks.

- [ ] **Step 4: Add the one functional guide**

Use `AssignmentGuide` once before the modification controls with the instruction: “Kies één codewijziging. Speel daarna direct het verschil.” The instruction remains visible if the image fails.

- [ ] **Step 5: Run tests and commit**

Run: `node --test src/features/public-site/story/*.test.ts`

Expected: PASS.

Commit: `refactor: make mascot use purposeful`

---

### Task 5: Responsive integration and release verification

**Files:**
- Modify: `src/features/public-site/story/gameProgrammerDemo.test.ts`
- Modify: `src/features/public-site/ScholenLandingStory.tsx`
- Modify: `src/features/public-site/story/TeacherActionDemo.tsx`
- Modify: `src/features/public-site/story/GameProgrammerDemo.tsx`

**Interfaces:**
- Consumes all prior task components.
- Produces the releasable frontpage preview.

- [ ] **Step 1: Add final responsive and accessibility contracts**

Assert mobile-safe classes (`min-w-0`, `max-w-full`, responsive grid tracks), visible non-hover instructions, focus styles, `aria-live`, and reduced-motion branches in the new components.

- [ ] **Step 2: Run the complete verification suite**

Run:

```bash
node --test src/features/public-site/story/*.test.ts
npm run doctor
npm run build
git diff --check
```

Expected: all tests PASS, critical TypeScript check OK, Vite/prerender build completes, and no whitespace errors.

- [ ] **Step 3: Review changed TSX files against React best practices**

Confirm colocated state, hook cleanup, semantic controls, stable list keys, image alt text, keyboard input, and no unnecessary memoization.

- [ ] **Step 4: Commit and publish**

Commit: `fix: deliver authentic frontpage interactions`

Push the exact changed tree to GitHub branch `codex/frontpage-story-preview` through the GitHub connector. Wait for the linked Vercel deployment to reach `READY`, generate a temporary public share URL, and leave the live branch/domain unchanged.
