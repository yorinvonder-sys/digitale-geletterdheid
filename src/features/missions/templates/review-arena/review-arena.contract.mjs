import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const directory = dirname(fileURLToPath(import.meta.url));
const read = (name) => readFileSync(join(directory, name), 'utf8');
const arena = read('ReviewArena.tsx');
const categorize = read('sub/Categorize.tsx');

assert.match(arena, /roundCompletionLockRef = useRef<number \| null>\(null\)/);
assert.match(arena, /if \(roundCompletionLockRef\.current === roundIndex\) return;/);
assert.match(arena, /roundAdvanceLockRef = useRef<number \| null>\(null\)/);
assert.match(arena, /s\.roundScores\.length !== roundIndex/);
assert.match(arena, /advanceRound\(score, roundIndex\)/);
assert.match(arena, /advanceRound\(finalScore, roundIndex\)/);

const completionAwait = arena.indexOf('const completionResult = await onComplete(true);');
const completionClear = arena.indexOf('clearSave();', completionAwait);
assert.ok(completionAwait >= 0, 'completion must await the durable completion callback');
assert.ok(completionClear > completionAwait, 'autosave must clear after completion confirmation');
assert.match(arena, /if \(completionResult === false\)/);
assert.match(arena, /completionAttemptRef\.current = false;/);
assert.match(arena, /role="alert"/);

assert.match(categorize, /role="button"/);
assert.match(categorize, /tabIndex=\{submitted \? -1 : 0\}/);
assert.match(categorize, /event\.key === 'Enter' \|\| event\.key === ' '/);
assert.match(categorize, /focus-visible:ring-2/);

console.log('review-arena contract: PASS');
