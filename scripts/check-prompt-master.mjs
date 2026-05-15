import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  buildLocalPromptResult,
  calculatePromptMasterMaxScore,
  getEffectiveMinScore,
  isChallengePassed,
  scorePromptByCriteria,
} from '../src/features/missions/promptMasterLogic.ts';

const dogChallenge = {
  id: 'b1',
  level: 'beginner',
  type: 'image',
  goal: 'Laat de AI een specifieke hond tekenen',
  scenario: 'Je vraagt de AI om een hond te tekenen.',
  badOutputExample: 'De AI tekent een bruine straathond in een witte ruimte. Saai, geen achtergrond, verkeerde kleur.',
  goodOutputExample: 'De AI tekent een schattige golden retriever puppy die vrolijk rent door een groen park met de zon op de achtergrond.',
  feedbackCriteria: [
    { keyword: 'golden|retriever|labrador|puppy|ras|soort|type', label: 'Specifiek ras', hint: 'Welk soort hond wil je precies?' },
    { keyword: 'park|tuin|bos|strand|buiten|gras|locatie|plek', label: 'Locatie', hint: 'Waar staat de hond?' },
    { keyword: 'rennen|rent|spelen|zitten|liggen|staan|actie|doet', label: 'Actie', hint: 'Wat doet de hond?' },
    { keyword: 'vrolijk|schattig|speels|blij|lief|sfeer|happy', label: 'Sfeer', hint: 'Welke uitstraling?' },
  ],
  minScore: 1,
  tips: [],
};

const logoChallenge = {
  ...dogChallenge,
  id: 'g1',
  level: 'gevorderd',
  feedbackCriteria: [
    { keyword: 'logo|embleem|icoon|merk', label: 'Type', hint: 'Is het een logo?' },
    { keyword: 'brood|tarwe|croissant|bakken', label: 'Symbool', hint: 'Welk symbool past?' },
    { keyword: 'goud|bruin|warm|beige|oranje', label: 'Kleuren', hint: 'Welke kleuren passen?' },
    { keyword: 'modern|minimalistisch|strak|simpel|clean', label: 'Stijl', hint: 'Welke stijl?' },
    { keyword: 'broodjes goud|naam|tekst', label: 'Naam', hint: 'Moet de naam erin?' },
  ],
};

const weakPrompt = 'Teken een golden retriever.';
const strongPrompt = 'Teken een vrolijke golden retriever puppy die door een zonnig park rent.';

const weakScore = scorePromptByCriteria(weakPrompt, dogChallenge);
assert.equal(weakScore.score, 1, 'weak dog prompt should only match the breed criterion');
assert.equal(isChallengePassed(weakScore.score, dogChallenge), false, 'one matched criterion must not pass a 4-criterion challenge');

const strongScore = scorePromptByCriteria(strongPrompt, dogChallenge);
assert.equal(strongScore.score, 4, 'strong dog prompt should match all four dog criteria');
assert.equal(isChallengePassed(strongScore.score, dogChallenge), true, 'complete dog prompt should pass');

assert.equal(getEffectiveMinScore(dogChallenge), 3, '4 criteria should require 3 matches for regular learners');
assert.equal(getEffectiveMinScore(dogChallenge, 'dagbesteding'), 2, 'VSO dagbesteding lowers the 4-criteria threshold to 2');
assert.equal(getEffectiveMinScore(logoChallenge), 4, '5 criteria should require 4 matches for regular learners');
assert.equal(getEffectiveMinScore(logoChallenge, 'dagbesteding'), 3, 'VSO dagbesteding lowers the 5-criteria threshold to 3');

const weakFallback = buildLocalPromptResult(weakPrompt, dogChallenge);
assert.equal(weakFallback.score, 1, 'fallback should use the same keyword scoring');
assert.notEqual(
  weakFallback.output,
  dogChallenge.goodOutputExample,
  'fallback output must not use the ideal example when criteria are missing',
);
assert.match(weakFallback.output, /golden|Specifiek ras/i, 'fallback should mention what the prompt did include');
assert.match(weakFallback.output, /Locatie|Actie|Sfeer|mist/i, 'fallback should mention missing detail');

assert.equal(calculatePromptMasterMaxScore([dogChallenge, logoChallenge]), 90, 'max score should be the sum of criteria times 10');

const curriculum = await readFile(new URL('../src/config/curriculum.ts', import.meta.url), 'utf8');
const period1Block = curriculum.match(/1:\s*\{[\s\S]*?assessmentId:\s*'assessment-j1-p1'/)?.[0] ?? '';
const period2Block = curriculum.match(/2:\s*\{[\s\S]*?assessmentId:\s*'assessment-j1-p2'/)?.[0] ?? '';

assert.equal(period1Block.includes("'prompt-master'"), false, 'Prompt Perfectionist should not be listed in period 1');
assert.equal(period2Block.includes("'prompt-master'"), true, 'Prompt Perfectionist should be listed in period 2');

console.log('Prompt Master checks passed');
