# Preflight Validator Repair Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Laat de bestaande missieregistratie- en missiedoelcontroles de huidige geldige architectuur herkennen.

**Architecture:** De reparatie houdt de bestaande tekstgebaseerde validators intact. De registratietabel krijgt de ontbrekende bestaande engine en de doelvalidator krijgt één helper die zowel directe als via `IntroScreen` samengestelde doelweergave accepteert.

**Tech Stack:** Node.js ESM, `node:test`, `child_process.spawnSync`, TypeScript/React-broncontracten.

## Global Constraints

- Wijzig geen missies, leerdoelen, antwoorden, scores, auth, database of productieconfiguratie.
- Voeg geen afhankelijkheden toe.
- Behoud alle bestaande zachte registratiewaarschuwingen.
- Gebruik echte procesuitvoering als regressiebewijs.

---

### Task 1: Regressietests voor de twee false negatives

**Files:**
- Create: `tests/ai-students/unit/preflight-validators.test.mjs`

**Interfaces:**
- Consumes: `scripts/mission-registration-preflight.mjs` en `scripts/check-mission-goals.mjs` als CLI-processen.
- Produces: twee regressietests die exitcode `0` en relevante succesuitvoer eisen.

- [ ] **Step 1: Write the failing tests**

```js
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

function runScript(script, args = []) {
  return spawnSync(process.execPath, [script, ...args], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });
}

test('registration preflight recognizes the ethics-council engine', () => {
  const result = runScript('scripts/mission-registration-preflight.mjs', ['review-week-3']);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /PASS.*review-week-3/s);
});

test('mission goal check accepts a shared IntroScreen goal banner', () => {
  const result = runScript('scripts/check-mission-goals.mjs');
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /Mission goal contract check passed/);
});
```

- [ ] **Step 2: Run the test to verify RED**

Run: `node --test tests/ai-students/unit/preflight-validators.test.mjs`

Expected: twee inhoudelijke failures: onbekend `ethics-council` en ontbrekend letterlijk `MissionGoalBanner`.

### Task 2: Minimale validatorreparatie en verificatie

**Files:**
- Modify: `scripts/mission-registration-preflight.mjs`
- Modify: `scripts/check-mission-goals.mjs`
- Test: `tests/ai-students/unit/preflight-validators.test.mjs`

**Interfaces:**
- Consumes: bestaande `VALID_ETHICS_COUNCIL_IDS` en de bestaande `IntroScreen`-aanroep met `goal={MISSION_GOAL}`.
- Produces: succesvolle registratie- en doelcontractcontroles zonder applicatiegedrag te wijzigen.

- [ ] **Step 1: Register the existing engine**

Voeg aan `TEMPLATE_ENGINES` toe:

```js
'ethics-council': {
  file: 'src/features/missions/templates/ethics-council/EthicsCouncil.tsx',
  varName: 'VALID_ETHICS_COUNCIL_IDS',
  dir: 'ethics-council',
},
```

- [ ] **Step 2: Accept both valid goal-rendering contracts**

Voeg een helper toe die slaagt bij een directe banner of bij `IntroScreen` plus de goalprop:

```js
const expectMissionGoalRendering = (path, missionId) => {
  const content = read(path);
  const rendersDirectBanner = content.includes('MissionGoalBanner');
  const rendersViaIntroScreen = content.includes('IntroScreen') && /goal=\{MISSION_GOAL\}/.test(content);
  if (!rendersDirectBanner && !rendersViaIntroScreen) {
    checks.push(`${path}: mist zichtbare missiedoelweergave voor ${missionId}`);
  }
};
```

Vervang voor dedicated missies alleen de letterlijke `MissionGoalBanner`-controle door deze helper.

- [ ] **Step 3: Verify GREEN**

Run:

```bash
node --test tests/ai-students/unit/preflight-validators.test.mjs
npm run check:mission-registration
npm run check:mission-goals
npm run test:ai-students:unit
npm run doctor
```

Expected: alle opdrachten geven exitcode `0`; de 35 registratiewaarschuwingen blijven informatief zichtbaar.

- [ ] **Step 4: Commit**

```bash
git add scripts/mission-registration-preflight.mjs scripts/check-mission-goals.mjs tests/ai-students/unit/preflight-validators.test.mjs
git commit -m "fix(checks): recognize current mission contracts"
```
