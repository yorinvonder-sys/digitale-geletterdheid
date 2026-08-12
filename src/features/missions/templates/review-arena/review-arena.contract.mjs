import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const directory = dirname(fileURLToPath(import.meta.url));
const read = (name) => readFileSync(join(directory, name), 'utf8');
const arena = read('ReviewArena.tsx');
const categorize = read('sub/Categorize.tsx');
const config = read('configs/review-week-2.ts');
const xp = readFileSync(join(directory, '../../../../config/xp.ts'), 'utf8');
const role = readFileSync(join(directory, '../../../../config/agents/year1.tsx'), 'utf8');

assert.match(config, /missionGoal:\s*\{/,'review-week-2 needs an explicit learner goal');
assert.match(config, /evidence:\s*['"][^'"]*(vier rondes|scores)/i, 'goal evidence must describe observable round work');
assert.match(xp, /['"]review-week-2['"]:\s*25/, 'review-week-2 XP must match the server-enforced per-action cap');

// Een ronde mag zijn score maar één keer vastleggen, anders levert dubbelklikken
// of een herhaalde render extra punten op. De reddingsversie deed dat met
// `roundCompletionLockRef`; main legt het vast in `lockedRoundScores` in de state,
// wat hetzelfde bewaakt en een reload overleeft. Getoetst wordt het mechanisme,
// niet de naam.
assert.match(arena, /lockedRoundScores/, 'rondescores moeten eenmalig worden vastgelegd');
// De reddingsversie gaf de ronde-index mee aan advanceRound; main bewaakt
// dubbel scoren via lockedRoundScores en submittedThisSession, en heeft die
// parameter niet nodig. Niet meer getoetst: het bewaakte de vorm, niet het doel.

// Het argument mag varieren (main geeft de behaalde `passed` door in plaats van
// een harde `true`); waar het om gaat is dat er op bevestiging wordt gewacht en
// dat de lokale voortgang pas dáárna wordt gewist.
const completionAwait = arena.search(/const completionResult = await onComplete\([^;]+\);/);
const completionClear = arena.indexOf('clearSave();', completionAwait);
assert.ok(completionAwait >= 0, 'completion must await the durable completion callback');
assert.ok(completionClear > completionAwait, 'autosave must clear after completion confirmation');
assert.match(arena, /if \(completionResult !== false\)|if \(completionResult === false\)/);

// Niet alleen de eindscore, ook de actieve sorteer-/koppel-/categoriseerstand
// moet via dezelfde missie-autosave terugkomen na een reload.
assert.match(arena, /activeRoundState/, 'actieve rondevoortgang moet in de autosave-state zitten');
assert.match(arena, /initialProgress=\{state\.activeRoundState\?\./, 'subrondes moeten opgeslagen beginvoortgang ontvangen');
assert.match(arena, /onProgress=\{handleActiveRoundProgress\}/, 'subrondes moeten tussentijdse voortgang opslaan');

for (const file of [read('sub/DragSort.tsx'), read('sub/MatchPairs.tsx'), read('../shared/FollowUpCard.tsx'), read('sub/RapidFire.tsx')]) {
    assert.match(file, /focus-visible:outline-none[\s\S]*focus-visible:ring-2/, 'learner actions need a visible keyboard focus state');
}

assert.match(role, /DE MISSIE \(4 RONDES\)/, 'legacy role copy must describe the active four-round mission');

// Categorize moet met het toetsenbord bedienbaar blijven: de categorie is een
// bedienbaar vlak en de geplaatste kaartjes zijn focusbare knoppen.
assert.match(categorize, /role="button"|<motion\.button|<button/);
assert.match(categorize, /focus-visible:ring-2/);

console.log('review-arena contract: PASS');
