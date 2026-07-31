import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { parseMissionCompletion } from '../src/services/missionCompletionContract.ts';

test('accepteert alleen een duurzaam bevestigde missiecompletion', () => {
    assert.deepEqual(
        parseMissionCompletion(
            {
                completed: true,
                missionId: 'magister-master',
                missionsCompleted: ['cloud-commander', 'magister-master'],
            },
            'magister-master',
        ),
        ['cloud-commander', 'magister-master'],
    );
});

test('weigert een RPC-resultaat waarin de gevraagde missie ontbreekt', () => {
    assert.throws(
        () =>
            parseMissionCompletion(
                {
                    completed: true,
                    missionId: 'magister-master',
                    missionsCompleted: [],
                },
                'magister-master',
            ),
        /did not persist/,
    );
});

test('slaat completion duurzaam op voordat XP wordt toegekend', () => {
    const source = readFileSync(
        new URL('../src/app/AuthenticatedApp.tsx', import.meta.url),
        'utf8',
    );
    const handlerStart = source.indexOf('async function handleMissionComplete');
    const handlerEnd = source.indexOf('// Peer feedback overlay', handlerStart);
    const handler = source.slice(handlerStart, handlerEnd);

    assert.ok(handlerStart >= 0 && handlerEnd > handlerStart);
    assert.match(handler, /markMissionCompleted/);
    assert.match(handler, /awardXP/);
    assert.match(handler, /setPeerFeedbackMissionId/);
    assert.equal(handler.includes('handleSaveProgress'), false);
    assert.ok(handler.indexOf('markMissionCompleted') < handler.indexOf('awardXP'));
    assert.ok(handler.indexOf('awardXP') < handler.indexOf('setPeerFeedbackMissionId'));
});
