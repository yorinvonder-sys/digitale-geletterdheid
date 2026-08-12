# Review Week 2 Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align De Code-Criticus' learner goal, XP contract, restart behavior, accessibility states, and legacy role copy without changing the backend schema.

**Architecture:** Keep ReviewArena config-driven. Add only serializable active-round snapshots to the existing mission autosave contract, derive XP display from the same reward source used by completion, and keep all completion persistence in the existing authenticated shell. Fix focus affordances locally in each ReviewArena subcomponent and update the legacy role metadata to describe the active four-round mission.

**Tech Stack:** React 19, TypeScript, Vite, Framer Motion, existing mission autosave and contract scripts.

## Global Constraints

- No Supabase migration, RLS change, auth change, production mutation, or new dependency.
- Keep `review-week-2` limited to the existing four rounds and current 40% completion threshold.
- Use existing `duck-*` design tokens and React escaping.
- Browser QA remains a separate serialized gate; this plan only adds static/runtime-test coverage.

---

### Task 1: Lock the learner contract and XP display

**Files:**
- Modify: `src/features/missions/templates/review-arena/configs/review-week-2.ts:3-10`
- Modify: `src/config/xp.ts:26-27`
- Modify: `src/config/missionMeta.ts:26-38`
- Test: `src/features/missions/templates/review-arena/review-arena.contract.mjs`

**Interfaces:**
- The config continues to expose `ReviewArenaConfig.missionGoal` and four rounds.
- `getMissionXPReward(missionId, difficulty)` remains the only reward lookup used by metadata and completion.

- [ ] **Step 1: Write the failing contract assertions**

  Assert that `review-week-2` has a config-level goal whose evidence describes observable round evidence, and that mission metadata does not derive a different reward from the legacy role difficulty.

- [ ] **Step 2: Run the focused contract and confirm failure**

  Run `node src/features/missions/templates/review-arena/review-arena.contract.mjs`.
  Expected: FAIL on the new goal/XP assertions before implementation.

- [ ] **Step 3: Implement the minimum contract fix**

  Add a config-level `missionGoal` with measurable language matching the four rounds. Add a mission-scoped XP override for `review-week-2` using the existing completion-shell amount, and make `getMissionMeta` use that same override rather than role difficulty for the display.

- [ ] **Step 4: Run the focused contract again**

  Run `node src/features/missions/templates/review-arena/review-arena.contract.mjs`.
  Expected: PASS for goal and XP assertions.

### Task 2: Make active-round autosave restart-safe

**Files:**
- Modify: `src/features/missions/templates/review-arena/ReviewArena.tsx:82-213`
- Modify: `src/features/missions/templates/review-arena/sub/DragSort.tsx:131-175`
- Modify: `src/features/missions/templates/review-arena/sub/MatchPairs.tsx:29-141`
- Modify: `src/features/missions/templates/review-arena/sub/Categorize.tsx:36-121`
- Test: `src/features/missions/templates/review-arena/review-arena.contract.mjs`

**Interfaces:**
- Subcomponents accept optional `initialState` and `onProgress` snapshots containing only JSON-safe values.
- ReviewArena stores snapshots under `activeRoundState` and validates them against the current round id/type.

- [ ] **Step 1: Add failing restart-state assertions**

  Assert that ReviewArena passes an active-round snapshot into the three local-state subcomponents and persists it through `useMissionAutoSave`.

- [ ] **Step 2: Run the focused contract and confirm failure**

  Run `node src/features/missions/templates/review-arena/review-arena.contract.mjs`.
  Expected: FAIL because no active-round snapshot contract exists.

- [ ] **Step 3: Implement minimal JSON-safe snapshots**

  Persist drag order/hasMoved, match selected/matched/wrongAttempts, and categorize placements/selection. Restore each snapshot only for the matching round id; clear it after the round advances. Keep rapid-fire behavior unchanged because it already persists question outcomes.

- [ ] **Step 4: Run focused tests**

  Run the review-arena contract and any existing mission autosave contract. Expected: PASS with no schema or type errors.

### Task 3: Close accessibility and legacy-copy gaps

**Files:**
- Modify: `src/features/missions/templates/review-arena/sub/DragSort.tsx:238-261`
- Modify: `src/features/missions/templates/review-arena/sub/MatchPairs.tsx:180-301`
- Modify: `src/features/missions/templates/review-arena/sub/FollowUpCard.tsx:107-118`
- Modify: `src/features/missions/templates/review-arena/sub/RapidFire.tsx:411-446`
- Modify: `src/config/agents/year1.tsx:1635-1715`
- Modify: `src/features/missions/templates/review-arena/review-arena.contract.mjs:21-28`

**Interfaces:**
- All learner-action buttons retain their current labels and handlers while gaining explicit `focus-visible` styling.
- The contract matcher accepts nested function calls in the awaited completion expression.

- [ ] **Step 1: Add failing assertions**

  Assert focus-ring classes on each primary subround action and a completion regex that matches `toScorePercent(...)` nesting. Assert the role description says four active rounds, not two/three cases.

- [ ] **Step 2: Run the focused checks and confirm failure**

  Run `node src/features/missions/templates/review-arena/review-arena.contract.mjs`.
  Expected: FAIL on the missing focus classes, stale role copy, and nested completion matcher.

- [ ] **Step 3: Implement minimal fixes**

  Add `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2` to the missing action buttons, synchronize the role copy with the four configured rounds, and replace the brittle completion regex with a line-scoped matcher that accepts nested parentheses.

- [ ] **Step 4: Run focused checks**

  Run the review-arena contract and `git diff --check`. Expected: PASS and no whitespace errors.

### Task 4: Full verification

**Files:**
- No new files.

- [ ] **Step 1: Run targeted mission checks**

  Run `node src/features/missions/templates/review-arena/review-arena.contract.mjs` and `node scripts/check-mission-autosave-contract.mjs`.

- [ ] **Step 2: Run project health checks**

  Run `npm run doctor` and `npm run build:prod`.

- [ ] **Step 3: Review the final diff**

  Run `git diff --stat`, `git diff --check`, and inspect only the changed mission/config files. Confirm no Supabase migration, auth code, secrets, or unrelated feature changes were introduced.

- [ ] **Step 4: Report remaining gates**

  Report browser four-viewport QA, production completion/XP readback, physical iPad/Safari, and independent review as separate remaining gates unless fresh evidence exists.
