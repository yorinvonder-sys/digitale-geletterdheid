import assert from 'node:assert/strict';
import test from 'node:test';

import { getMissionXPReward, getXPReward } from '../src/config/xp.ts';

test('Magister Meester belooft de 25 XP die productie werkelijk toekent', () => {
    assert.equal(getMissionXPReward('magister-master', 'Easy'), 25);
});

test('Cloud Commander belooft de 25 XP die productie werkelijk toekent', () => {
    assert.equal(getMissionXPReward('cloud-commander', 'Easy'), 25);
});

test('Word Wizard belooft de 25 XP die productie werkelijk toekent', () => {
    assert.equal(getMissionXPReward('word-wizard', 'Medium'), 25);
});

test('andere missies behouden hun bestaande moeilijkheidsbeloning', () => {
    assert.equal(getMissionXPReward('mission-zonder-override', 'Hard'), getXPReward('Hard'));
});
