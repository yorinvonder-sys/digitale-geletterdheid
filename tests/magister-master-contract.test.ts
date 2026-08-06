import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import magisterMasterConfig from '../src/features/missions/templates/tool-guide/configs/magister-master.ts';

test('Magister Master laat de leerling na niet-onthullende foutfeedback opnieuw kiezen', () => {
    const questions = magisterMasterConfig.steps
        .map((step) => step.verificationQuestion)
        .filter((question) => question !== undefined);

    assert.equal(questions.length, 3);
    assert.ok(questions.every((question) => question.allowRetry));
    assert.ok(questions.every((question) => /kies.*opnieuw/i.test(question.retryHint ?? '')));

    for (const question of questions) {
        const correctAnswer = question.options[question.correctIndex].toLocaleLowerCase('nl-NL');
        const retryHint = (question.retryHint ?? '').toLocaleLowerCase('nl-NL');
        assert.ok(!retryHint.includes(correctAnswer));
    }
});

test('ToolGuide houdt het juiste antwoord verborgen totdat de herkansing slaagt', () => {
    const toolGuideSource = readFileSync(
        new URL('../src/features/missions/templates/tool-guide/ToolGuide.tsx', import.meta.url),
        'utf8',
    );

    assert.match(toolGuideSource, /!step\.verificationQuestion\.allowRetry \|\| isCorrect/);
    assert.match(toolGuideSource, /Opnieuw kiezen/);
    assert.match(toolGuideSource, /onRetryAnswer\(step\.id\)/);
    assert.match(
        toolGuideSource,
        /i === step\.verificationQuestion!\.correctIndex\s*&&\s*\(!step\.verificationQuestion!\.allowRetry \|\| isCorrect\)/s,
    );
});
