import assert from 'node:assert/strict';
import test from 'node:test';

import wordWizardConfig from '../src/features/missions/templates/tool-guide/configs/word-wizard.ts';

test('Word Wizard blokkeert doorgaan na een fout tot de leerling opnieuw kiest', () => {
    const questions = wordWizardConfig.steps
        .map((step) => step.verificationQuestion)
        .filter((question) => question !== undefined);

    assert.ok(questions.length > 0);
    assert.ok(questions.every((question) => question.allowRetry));
    assert.ok(questions.every((question) => /kies/i.test(question.retryHint ?? '')));
});

test('Word Wizard vraagt bij iedere externe Word-stap om concreet docentbewijs', () => {
    assert.ok(wordWizardConfig.steps.every((step) => (step.teacherCheck ?? '').length > 20));
    assert.ok(wordWizardConfig.steps.every((step) => /docent/i.test(step.teacherCheck ?? '')));
});

test('Word Wizard claimt niet dat iPad een inhoudsopgave kan toevoegen of bijwerken', () => {
    const contentsStep = wordWizardConfig.steps.find(
        (step) => step.id === 'stap-4-inhoudsopgave',
    );

    assert.ok(contentsStep);
    assert.match(contentsStep.instruction, /iPad.*niet toevoegen of bijwerken/i);
    assert.match(contentsStep.instruction, /laptop of desktop/i);
    assert.doesNotMatch(contentsStep.instruction, /Documentelementen/);
    assert.doesNotMatch(contentsStep.instruction, /Tik op.*Bijwerken/i);
});

test('Word Wizard scorecontract blijft exact 55 punten', () => {
    const questionCount = wordWizardConfig.steps.filter(
        (step) => step.verificationQuestion !== undefined,
    ).length;
    const engineMaximum = wordWizardConfig.steps.length * 10 + questionCount * 5;

    assert.equal(wordWizardConfig.maxScore, engineMaximum);
    assert.equal(engineMaximum, 55);
});
