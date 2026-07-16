# DGSkills Frontpage Story Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and publish an isolated, responsive DGSkills homepage preview that tells one lesson story and includes a deterministic mini-game visitors can complete.

**Architecture:** Keep the existing landing page untouched and add a new `ScholenLandingStory` entry component. Put the interactive game state in a small pure TypeScript module, render the new page from focused story/demo components, and switch only the public route import on the feature branch. Use existing Framer Motion, brand components, screenshots, and tokens; do not add dependencies or call backend services.

**Tech Stack:** React 19, TypeScript 6, Vite 8, Tailwind CSS 3.4, Framer Motion 12, Node test runner, Playwright/Chrome, Vercel preview deployments.

## Global Constraints

- Preserve the official DuckMark, duck color tokens, Outfit, Fraunces, existing pilot route, and cautious public claims.
- Do not modify Supabase, auth, AI endpoints, personal data flows, or production Vercel aliases.
- Use real repository artwork and screenshots; do not create replacement logos or stock placeholders.
- Every interaction must work with mouse, touch, and keyboard, and remain understandable under `prefers-reduced-motion`.
- Desktop, tablet landscape, tablet portrait, and mobile must all be browser-verified.

---

### Task 1: Mini-mission state contract

**Files:**
- Create: `src/features/public-site/story/miniMissionState.ts`
- Create: `src/features/public-site/story/miniMissionState.test.ts`

**Interfaces:**
- Produces: `MissionCommand`, `MiniMissionState`, `INITIAL_MINI_MISSION_STATE`, `miniMissionReducer(state, action)`, and `isWinningProgram(commands)`.
- Winning sequence: `['boost', 'jump', 'collect']`.

- [ ] **Step 1: Write the failing state tests**

```ts
import assert from 'node:assert/strict';
import test from 'node:test';
import {
  INITIAL_MINI_MISSION_STATE,
  isWinningProgram,
  miniMissionReducer,
} from './miniMissionState.ts';

test('accepts at most three commands in selection order', () => {
  let state = miniMissionReducer(INITIAL_MINI_MISSION_STATE, { type: 'add', command: 'boost' });
  state = miniMissionReducer(state, { type: 'add', command: 'jump' });
  state = miniMissionReducer(state, { type: 'add', command: 'collect' });
  state = miniMissionReducer(state, { type: 'add', command: 'boost' });
  assert.deepEqual(state.commands, ['boost', 'jump', 'collect']);
});

test('marks the required program as successful when it runs', () => {
  const state = miniMissionReducer(
    { ...INITIAL_MINI_MISSION_STATE, commands: ['boost', 'jump', 'collect'] },
    { type: 'run' },
  );
  assert.equal(isWinningProgram(state.commands), true);
  assert.equal(state.result, 'success');
});

test('preserves an incorrect program for a retry and supports undo', () => {
  const failed = miniMissionReducer(
    { ...INITIAL_MINI_MISSION_STATE, commands: ['jump', 'boost', 'collect'] },
    { type: 'run' },
  );
  assert.equal(failed.result, 'retry');
  const corrected = miniMissionReducer(failed, { type: 'undo' });
  assert.deepEqual(corrected.commands, ['jump', 'boost']);
  assert.equal(corrected.result, 'idle');
});
```

- [ ] **Step 2: Run the tests and verify RED**

Run: `node --test src/features/public-site/story/miniMissionState.test.ts`

Expected: FAIL because `miniMissionState.ts` does not exist.

- [ ] **Step 3: Implement the pure reducer**

```ts
export type MissionCommand = 'boost' | 'jump' | 'collect';
export type MissionResult = 'idle' | 'success' | 'retry';

export interface MiniMissionState {
  commands: MissionCommand[];
  result: MissionResult;
  runId: number;
}

export const INITIAL_MINI_MISSION_STATE: MiniMissionState = {
  commands: [],
  result: 'idle',
  runId: 0,
};

export type MiniMissionAction =
  | { type: 'add'; command: MissionCommand }
  | { type: 'undo' }
  | { type: 'reset' }
  | { type: 'run' };

const WINNING_PROGRAM: MissionCommand[] = ['boost', 'jump', 'collect'];

export function isWinningProgram(commands: MissionCommand[]): boolean {
  return commands.length === WINNING_PROGRAM.length
    && commands.every((command, index) => command === WINNING_PROGRAM[index]);
}

export function miniMissionReducer(
  state: MiniMissionState,
  action: MiniMissionAction,
): MiniMissionState {
  if (action.type === 'reset') return INITIAL_MINI_MISSION_STATE;
  if (action.type === 'undo') {
    return { ...state, commands: state.commands.slice(0, -1), result: 'idle' };
  }
  if (action.type === 'add') {
    if (state.commands.length >= 3) return state;
    return { ...state, commands: [...state.commands, action.command], result: 'idle' };
  }
  return {
    ...state,
    result: isWinningProgram(state.commands) ? 'success' : 'retry',
    runId: state.runId + 1,
  };
}
```

- [ ] **Step 4: Run the tests and verify GREEN**

Run: `node --test src/features/public-site/story/miniMissionState.test.ts`

Expected: 3 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/features/public-site/story/miniMissionState.ts src/features/public-site/story/miniMissionState.test.ts
git commit -m "test: define homepage mini mission behavior"
```

### Task 2: Interactive mini mission UI

**Files:**
- Create: `src/features/public-site/story/MiniMissionBuilder.tsx`
- Modify: `src/features/public-site/story/miniMissionState.test.ts`

**Interfaces:**
- Consumes: state types and reducer from Task 1, `DuckMark`, `usePrefersReducedMotion`, and Framer Motion.
- Produces: `MiniMissionBuilder` with `id="probeer-het"`, `data-testid="mini-mission"`, command buttons, run/undo/reset controls, `aria-live` feedback, and a success evidence receipt.

- [ ] **Step 1: Add a source-contract test for accessible labels and evidence copy**

Read `MiniMissionBuilder.tsx` as UTF-8 and assert it contains `Test mijn game`, `Programma wissen`, `aria-live="polite"`, `Computational thinking`, and `SLO`.

- [ ] **Step 2: Run the source-contract test and verify RED**

Run: `node --test src/features/public-site/story/miniMissionState.test.ts`

Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement the component**

Render three command buttons (`Boost`, `Spring`, `Pak ster`), three numbered program slots, run/undo/reset controls, a real `/assets/agents/game_programmeur_new.webp` stage, and an animated official `DuckMark`. On success, show a dark evidence card with `Computational thinking`, `SLO 22B`, and `Project opgeslagen`; on retry, explain which numbered obstacle needs a different command. Disable run until three commands exist.

- [ ] **Step 4: Verify GREEN and type safety**

Run: `node --test src/features/public-site/story/miniMissionState.test.ts && npm run doctor`

Expected: tests and critical TypeScript check pass.

- [ ] **Step 5: Commit**

```bash
git add src/features/public-site/story/MiniMissionBuilder.tsx src/features/public-site/story/miniMissionState.test.ts
git commit -m "feat: add interactive homepage mini mission"
```

### Task 3: Story-led responsive landing page

**Files:**
- Create: `src/features/public-site/ScholenLandingStory.tsx`

**Interfaces:**
- Consumes: `DuckMark`, `HeroEyes`, `MiniMissionBuilder`, `usePrefersReducedMotion`, Framer Motion, Lucide icons, and existing repository artwork.
- Produces: `ScholenLandingStory` with semantic header/main/footer and section IDs `lesverhaal`, `probeer-het`, `leerlingwerk`, `docentbewijs`, and `schoolpilot`.

- [ ] **Step 1: Add a failing source-contract test**

Extend the source-contract test to assert the new component contains all five section IDs, the official DuckMark import, `/pilot`, `/leerlingdemo`, `/docentdemo`, and a reduced-motion branch.

- [ ] **Step 2: Run and verify RED**

Run: `node --test src/features/public-site/story/miniMissionState.test.ts`

Expected: FAIL because `ScholenLandingStory.tsx` does not exist.

- [ ] **Step 3: Build the page**

Implement:

- a sticky responsive header;
- hero copy `Eén les. Van eerste klik tot zichtbaar bewijs.` and dual CTA;
- a four-chapter lesson story with sticky desktop stage and vertical mobile fallback;
- the interactive mini mission from Task 2;
- a five-card gallery using `/assets/previews/project_game_programmeur.webp`, `/assets/previews/project_website_bouwer.webp`, `/assets/previews/project_deepfake_detector.webp`, `/assets/previews/project_ai_tekengame.webp`, and `/assets/previews/project_digital_storyteller.webp`;
- a teacher evidence section continuing the mini-mission vocabulary;
- school proof, pilot CTA, and compact footer with ICT/privacy links.

All animated content must use opacity/transform, `useInView`/`whileInView`, or local state transitions. Add `motion-reduce` classes and pass zero-duration transitions when reduced motion is enabled.

- [ ] **Step 4: Verify source contract and type safety**

Run: `node --test src/features/public-site/story/miniMissionState.test.ts && npm run doctor`

Expected: all checks pass.

- [ ] **Step 5: Commit**

```bash
git add src/features/public-site/ScholenLandingStory.tsx src/features/public-site/story/miniMissionState.test.ts
git commit -m "feat: tell one coherent homepage lesson story"
```

### Task 4: Preview route and critical hero shell

**Files:**
- Modify: `src/app/AppRouter.tsx`
- Modify: `index.html`

**Interfaces:**
- Consumes: `ScholenLandingStory`.
- Produces: `/` and `/scholen` preview routes rendering the new story page; pre-hydration hero text matching the new H1.

- [ ] **Step 1: Add a failing route contract test**

Assert `AppRouter.tsx` imports and renders `ScholenLandingStory`, and `index.html` contains `Eén les. Van eerste klik tot zichtbaar bewijs.`

- [ ] **Step 2: Run and verify RED**

Run: `node --test src/features/public-site/story/miniMissionState.test.ts`

Expected: FAIL while the router still uses `ScholenLanding`.

- [ ] **Step 3: Switch only the public landing route**

Replace the import and `<ScholenLanding />` usage with `ScholenLandingStory`; update only the fixed critical H1 text in `index.html`. Do not change authenticated routing.

- [ ] **Step 4: Verify GREEN and production build**

Run: `node --test src/features/public-site/story/miniMissionState.test.ts && npm run doctor && npm run build:prod`

Expected: tests, TypeScript, Vite build, and prerender pass.

- [ ] **Step 5: Commit**

```bash
git add src/app/AppRouter.tsx index.html src/features/public-site/story/miniMissionState.test.ts
git commit -m "feat: route public preview to story homepage"
```

### Task 5: Browser QA and Vercel preview

**Files:**
- Modify only files needed to fix verified UI defects.

- [ ] **Step 1: Start the production preview server**

Run: `npm run preview -- --host 0.0.0.0`

Expected: Vite serves the built app.

- [ ] **Step 2: Verify Chrome viewport matrix**

Check 1440×1000 desktop, 1180×820 tablet landscape, 820×1180 tablet portrait, and 390×844 mobile. At each width confirm no horizontal overflow, readable hero, reachable CTA, usable command controls, successful mini-game sequence, visible evidence receipt, and natural sticky-section release.

- [ ] **Step 3: Re-run final local proof**

Run: `git diff --check && node --test src/features/public-site/story/miniMissionState.test.ts && npm run doctor && npm run build:prod`

Expected: all commands exit 0.

- [ ] **Step 4: Deploy preview only**

Deploy the worktree as a Vercel preview against the user's connected Vercel account. Do not use `--prod`, promote, alias, or modify the production domain.

- [ ] **Step 5: Verify the public URL**

Fetch the deployment, confirm HTTP 200 and the new hero copy, then repeat the mobile interaction smoke test against the public Vercel URL.

- [ ] **Step 6: Commit QA-only fixes if any**

```bash
git add <only-files-fixed-during-qa>
git commit -m "fix: polish responsive homepage preview"
```
