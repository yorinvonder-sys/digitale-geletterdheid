# DGSkills Frontpage Visual and Interaction Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a second isolated preview with corrected typography and decorative lines, three realistic classroom images, a clickable assignment walkthrough, and Kees the duck as the recurring narrator.

**Architecture:** Keep the current preview route and deterministic mini-game reducer. Add a pure walkthrough state module and a focused `MissionWalkthrough` component, centralize Kees narration in a small reusable component, and consume optimized Image 2.0 assets from `public/assets/story/`. Refine the existing landing component without changing the legacy landing page, backend, auth, or production aliases.

**Tech Stack:** React 19, TypeScript 6, Vite 8, Tailwind CSS 3.4, Framer Motion 12, Node test runner, Image 2.0, Vercel previews.

## Global Constraints

- Preserve the official DuckMark, duck color tokens, Outfit, Fraunces, existing pilot route, and cautious public claims.
- Do not generate or replace the DGSkills logo; use the official `DuckMark` for Kees.
- Use Image 2.0 only for original photorealistic classroom scenes and store optimized assets under `public/assets/story/`.
- Do not add dependencies, change Supabase, touch authentication, call AI endpoints at runtime, collect personal data, or modify production Vercel aliases.
- Every interaction must work with mouse, touch, and keyboard and remain understandable under `prefers-reduced-motion`.
- Verify 390×844, 820×1180, 1180×820, and 1440×1000 layouts.

---

### Task 1: Guided walkthrough state contract

**Files:**
- Create: `src/features/public-site/story/missionWalkthroughState.ts`
- Create: `src/features/public-site/story/missionWalkthroughState.test.ts`

**Interfaces:**
- Produces: `MissionId`, `WalkthroughStep`, `MissionWalkthroughState`, `INITIAL_WALKTHROUGH_STATE`, and `missionWalkthroughReducer(state, action)`.
- Mission IDs: `game`, `website`, `deepfake`.
- Steps: `choose`, `briefing`, `build`, `proof`.

- [ ] **Step 1: Write failing reducer tests**

Test that a mission selection advances to briefing, next/previous remain within the four-step bounds, direct step navigation works only after a mission is selected, and selecting another mission resets the stage to briefing.

- [ ] **Step 2: Run the state test and verify RED**

Run: `node --test src/features/public-site/story/missionWalkthroughState.test.ts`

Expected: FAIL because `missionWalkthroughState.ts` does not exist.

- [ ] **Step 3: Implement the pure reducer**

Use a readonly step order and immutable state updates. Do not place React, DOM, storage, routing, or animation code in this file.

- [ ] **Step 4: Run the state test and verify GREEN**

Run: `node --test src/features/public-site/story/missionWalkthroughState.test.ts`

Expected: all walkthrough reducer tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/features/public-site/story/missionWalkthroughState.ts src/features/public-site/story/missionWalkthroughState.test.ts
git commit -m "test: define homepage mission walkthrough"
```

### Task 2: Image 2.0 classroom asset set

**Files:**
- Create: `public/assets/story/students-coding-dgskills.webp`
- Create: `public/assets/story/teacher-coaching-dgskills.webp`
- Create: `public/assets/story/students-presenting-dgskills.webp`

**Interfaces:**
- Produces three 3:2 or 16:10 landscape WebP assets at a practical web resolution, visually consistent in camera treatment, daylight, age range, classroom, and DGSkills palette cues.

- [ ] **Step 1: Generate three distinct Image 2.0 scenes**

Use separate prompts for coding, coaching, and presenting. Require contemporary Dutch secondary-school context, diverse pupils aged 13–16, ordinary clothing, candid behavior, realistic hands/devices, natural daylight, no watermark, no generated readable text, and no fake logo.

- [ ] **Step 2: Inspect every generated image**

Reject scenes with malformed devices/hands, posed stock-photo smiles, primary-school ages, college-age adults, illegible pseudo-text, or inconsistent visual treatment.

- [ ] **Step 3: Copy accepted outputs into the project and optimize**

Convert accepted raster outputs to WebP while keeping source aspect ratio. Target approximately 1400–1800 pixels on the long edge and verify each asset is readable at mobile crop sizes.

- [ ] **Step 4: Verify file contracts**

Run: `file public/assets/story/*.webp`

Expected: all three files are valid WebP images.

- [ ] **Step 5: Commit**

```bash
git add public/assets/story
git commit -m "feat: add realistic classroom story imagery"
```

### Task 3: Kees narrator and clickable mission walkthrough

**Files:**
- Create: `src/features/public-site/story/KeesNarrator.tsx`
- Create: `src/features/public-site/story/MissionWalkthrough.tsx`
- Modify: `src/features/public-site/story/missionWalkthroughState.test.ts`

**Interfaces:**
- `KeesNarrator` consumes `message`, optional `eyebrow`, optional `tone`, and optional `className`; it renders the official `DuckMark`, a semantic narration region, and reduced-motion-safe entry/step-change motion.
- `MissionWalkthrough` consumes no props and renders section `id="missies"`, three mission choices, four explicit step controls, previous/next controls, current-step narration, and concrete mission content.

- [ ] **Step 1: Add failing source-contract tests**

Assert the components import `DuckMark`, expose the three mission names, contain `aria-current`, `aria-live`, `Vorige stap`, and `Volgende stap`, and do not contain `localStorage`, `fetch(`, or generated image URLs.

- [ ] **Step 2: Run tests and verify RED**

Run: `node --test src/features/public-site/story/missionWalkthroughState.test.ts`

Expected: FAIL because the React components do not exist.

- [ ] **Step 3: Implement KeesNarrator**

Keep the official duck mark inside a stable framed area. Place the speech bubble in normal flow on mobile and alongside the duck from the small-tablet breakpoint. Animate only opacity and transform; disable the transform animation for reduced motion.

- [ ] **Step 4: Implement MissionWalkthrough**

Render mission choices first. After selection, show the four-step navigation and content for the selected mission. Use buttons rather than drag/swipe-only behavior. Each mission's build stage includes a deterministic choice and its proof stage describes the product plus linked skill. The Game Programmeur path includes a clear CTA to `#probeer-het` for the full command mini-game.

- [ ] **Step 5: Verify GREEN and type safety**

Run: `node --test src/features/public-site/story/missionWalkthroughState.test.ts && npm run doctor`

Expected: tests and critical TypeScript checks pass.

- [ ] **Step 6: Commit**

```bash
git add src/features/public-site/story/KeesNarrator.tsx src/features/public-site/story/MissionWalkthrough.tsx src/features/public-site/story/missionWalkthroughState.test.ts
git commit -m "feat: let visitors explore missions with Kees"
```

### Task 4: Story page visual integration and typography repair

**Files:**
- Modify: `src/features/public-site/ScholenLandingStory.tsx`
- Modify: `src/features/public-site/story/miniMissionState.test.ts`

**Interfaces:**
- Consumes `KeesNarrator`, `MissionWalkthrough`, and the three `/assets/story/*.webp` files.
- Produces a page order of hero, human classroom proof, lesson story, mission walkthrough, full mini-game, pupil projects, teacher payoff, and school pilot.

- [ ] **Step 1: Add failing source-contract tests**

Assert the story imports both new components, references all three classroom asset paths, exposes `id="missies"` through the walkthrough, and no longer contains the glyph-crossing `bottom-[0.06em]` highlight strip.

- [ ] **Step 2: Run tests and verify RED**

Run: `node --test src/features/public-site/story/miniMissionState.test.ts src/features/public-site/story/missionWalkthroughState.test.ts`

Expected: FAIL because the story has not integrated the second-preview design.

- [ ] **Step 3: Repair typography and decorative geometry**

Replace the absolute headline strip with a separated accent; use relaxed mobile/tablet line heights and tracking with desktop-only tightening; cap line measures; keep connectors outside text boxes; and widen project cards at desktop.

- [ ] **Step 4: Integrate the classroom images and Kees narration**

Use the coding scene in or directly below the hero, coaching in the lesson story, and presenting before the project outcomes. Keep exact DGSkills labels as HTML adjacent to images, include descriptive Dutch alt text, and prevent speech bubbles from becoming absolute overlaps.

- [ ] **Step 5: Integrate the mission walkthrough**

Place the walkthrough before the full mini-game and update header/hero calls to action so visitors can immediately reach `#missies`. Preserve the detailed mini-game as the deepest interactive proof.

- [ ] **Step 6: Verify GREEN and production build**

Run: `node --test src/features/public-site/story/miniMissionState.test.ts src/features/public-site/story/missionWalkthroughState.test.ts && npm run doctor && npm run build:prod`

Expected: all tests, TypeScript, Vite build, and prerender pass.

- [ ] **Step 7: Commit**

```bash
git add src/features/public-site/ScholenLandingStory.tsx src/features/public-site/story/miniMissionState.test.ts
git commit -m "feat: add human classroom story and polished layout"
```

### Task 5: Responsive interaction QA and preview deployment

**Files:**
- Modify only files needed for defects reproduced during QA.

- [ ] **Step 1: Run final static proof**

Run: `git diff --check && node --test src/features/public-site/story/miniMissionState.test.ts src/features/public-site/story/missionWalkthroughState.test.ts && npm run doctor && npm run build:prod`

Expected: every command exits 0.

- [ ] **Step 2: Check the viewport matrix**

At 390×844, 820×1180, 1180×820, and 1440×1000 verify: no horizontal overflow; no line crosses text; headings do not collide or clip; photos crop around the action; Kees bubbles remain in flow; mission choice and all four steps are reachable; previous/next and direct step buttons work; the full mini-game remains completable.

- [ ] **Step 3: Verify reduced motion and keyboard operation**

Confirm the page remains understandable with reduced motion, visible focus reaches each mission/step control, and status changes are announced without relying on color.

- [ ] **Step 4: Publish preview only**

Commit QA fixes, push the feature branch, and create a Vercel preview deployment. Do not use production promotion or production alias commands.

- [ ] **Step 5: Verify the public preview**

Confirm HTTP 200, the second-preview hero and classroom assets load, and the public source contains the mission walkthrough. Provide the new share URL for user review.
