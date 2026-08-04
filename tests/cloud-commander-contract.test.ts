import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { cloudCommanderConfig } from '../src/features/missions/templates/tool-guide/configs/cloud-commander.ts';

test('Cloud Commander laat de leerling toegangsbereik en rechten controleren', () => {
    const shareStep = cloudCommanderConfig.steps.find((step) => step.id === 'stap-4-delen');

    assert.ok(shareStep);
    assert.match(shareStep.instruction, /Specifieke personen/);
    assert.match(shareStep.instruction, /Bewerken toestaan/);
    assert.match(shareStep.instruction, /Toegang beheren/);
    assert.match(shareStep.teacherCheck ?? '', /alleen de bedoelde klasgenoot toegang/);
    assert.ok(shareStep.checklistItems.some((item) => /Specifieke personen/.test(item.label)));
    assert.ok(shareStep.checklistItems.some((item) => /Bekijken of Bewerken/.test(item.label)));
});

test('Cloud Commander toetst veilig delen in plaats van alleen versiebeheer', () => {
    const shareStep = cloudCommanderConfig.steps.find((step) => step.id === 'stap-4-delen');
    const question = shareStep?.verificationQuestion;

    assert.ok(question);
    assert.match(question.question, /één klasgenoot/);
    assert.match(question.question, /bekijken, maar niets wijzigen/);
    assert.deepEqual(question.options, [
        'Iedereen + bewerken',
        'Specifieke personen + bekijken',
        'Iedereen op internet',
    ]);
    assert.equal(question.options[question.correctIndex], 'Specifieke personen + bekijken');
    assert.match(question.explanation, /beperk je de toegang/);
});

test('Cloud Commander toetst cloudopslag met een concrete werksituatie', () => {
    const storageStep = cloudCommanderConfig.steps.find((step) => step.id === 'stap-2-map');
    const question = storageStep?.verificationQuestion;

    assert.ok(question);
    assert.match(question.question, /school-iPad/);
    assert.match(question.question, /Thuis/);
    assert.match(question.question, /schoolcomputer/);
    assert.match(question.question, /map School/);
    assert.deepEqual(question.options, ['Alleen op mijn iPad', 'In OneDrive', 'Op de schoolprinter']);
    assert.equal(question.options[question.correctIndex], 'In OneDrive');
    assert.match(question.explanation, /op een ander apparaat openen/);
});

test('Cloud Commander behoudt alle vier leerdoelen', () => {
    assert.deepEqual(cloudCommanderConfig.learningObjectives, [
        'De leerling herkent het verschil tussen lokale opslag en cloudopslag en benoemt één voordeel.',
        'De leerling past een mappenstructuur toe door een map aan te maken en een bestand daarin op te slaan.',
        'De leerling uploadt een bestand naar OneDrive en controleert of het uploaden is geslaagd.',
        'De leerling deelt een bestand met één specifieke ontvanger en stelt passende kijk- of bewerkrechten in.',
    ]);
});

test('Cloud Commander behoudt de missiebeloning tijdens de didactische vraagwijziging', () => {
    assert.equal(cloudCommanderConfig.maxScore, 50);
});

test('Cloud Commander laat een leerling na foutfeedback opnieuw kiezen', () => {
    const verificationQuestions = cloudCommanderConfig.steps
        .map((step) => step.verificationQuestion)
        .filter((question) => question !== undefined);
    const toolGuideSource = readFileSync(
        new URL('../src/features/missions/templates/tool-guide/ToolGuide.tsx', import.meta.url),
        'utf8',
    );

    assert.ok(verificationQuestions.length > 0);
    assert.ok(verificationQuestions.every((question) => question.allowRetry));
    assert.ok(verificationQuestions.every((question) => /Kies|kies/.test(question.retryHint ?? '')));
    assert.match(toolGuideSource, /Opnieuw kiezen/);
    assert.match(toolGuideSource, /onRetryAnswer\(step\.id\)/);
    assert.match(toolGuideSource, /!step\.verificationQuestion\.allowRetry \|\| isCorrect/);
    assert.match(toolGuideSource, /delete verificationAnswers\[stepId\]/);
    assert.match(toolGuideSource, /verificationSubmitted: \{ \.\.\.prev\.verificationSubmitted, \[stepId\]: false \}/);
    assert.match(toolGuideSource, /disabled=\{verificationSubmitted\}/);
    assert.match(toolGuideSource, /!verificationSubmitted && onSelectAnswer\(step\.id, i\)/);
    assert.match(toolGuideSource, /const canProceed = allChecked && questionAnswered && teacherApproved;/);
    assert.match(toolGuideSource, /questionAnswered =[^;]+verificationSubmitted[^;]+isCorrect/s);
});

test('Cloud Commander verbergt het juiste antwoord bij herkansbare foutfeedback', () => {
    const toolGuideSource = readFileSync(
        new URL('../src/features/missions/templates/tool-guide/ToolGuide.tsx', import.meta.url),
        'utf8',
    );

    assert.match(toolGuideSource, /const revealCorrectAnswer = Boolean\(/);
    assert.match(
        toolGuideSource,
        /i === step\.verificationQuestion!\.correctIndex\s*&&\s*\(!step\.verificationQuestion!\.allowRetry \|\| isCorrect\)/s,
    );
    assert.match(toolGuideSource, /if \(revealCorrectAnswer\)/);
    assert.match(toolGuideSource, /revealCorrectAnswer\s*\?\s*'bg-duck-ink border-duck-ink'/s);
    assert.match(toolGuideSource, /aria-pressed=\{verificationAnswer === i\}/);
    assert.match(toolGuideSource, /role="status"/);
    assert.match(toolGuideSource, /aria-live="polite"/);
    assert.match(toolGuideSource, /aria-atomic="true"/);
    assert.match(toolGuideSource, /revealCorrectAnswer \|\|\s*selected/s);
});

test('ToolGuide houdt missiecontrols minimaal 44px hoog', () => {
    const toolGuideSource = readFileSync(
        new URL('../src/features/missions/templates/tool-guide/ToolGuide.tsx', import.meta.url),
        'utf8',
    );
    const phaseHeaderSource = readFileSync(
        new URL('../src/features/missions/templates/shared/PhaseHeader.tsx', import.meta.url),
        'utf8',
    );
    const buttonBlockAround = (source: string, anchor: string) => {
        const anchorIndex = source.indexOf(anchor);
        assert.notEqual(anchorIndex, -1, `anchor ontbreekt: ${anchor}`);
        const buttonStart = source.lastIndexOf('<button', anchorIndex);
        const buttonEnd = source.indexOf('</button>', anchorIndex);
        assert.ok(buttonStart >= 0 && buttonEnd > anchorIndex, `buttonblok ontbreekt: ${anchor}`);
        return source.slice(buttonStart, buttonEnd);
    };

    assert.match(buttonBlockAround(toolGuideSource, 'onCheckItem(step.id, item.id)'), /w-full min-h-11/);
    assert.match(buttonBlockAround(toolGuideSource, 'onToggleTeacherCheck(step.id)'), /w-full min-h-11/);
    assert.match(buttonBlockAround(toolGuideSource, 'onSelectAnswer(step.id, i)'), /w-full min-h-11/);
    assert.match(buttonBlockAround(toolGuideSource, 'onSubmitAnswer(step.id)'), /w-full min-h-11/);
    assert.match(buttonBlockAround(toolGuideSource, 'onClick={onBack}'), /min-h-11 min-w-11/);

    const phaseBackButton = buttonBlockAround(phaseHeaderSource, 'aria-label="Terug"');
    assert.match(phaseBackButton, /min-h-\[44px\]/);
    assert.match(phaseBackButton, /min-w-\[44px\]/);
});

test('ToolGuide toont nadruk in tips zonder letterlijke markdownsterretjes', () => {
    const shareStep = cloudCommanderConfig.steps.find((step) => step.id === 'stap-4-delen');
    const toolGuideSource = readFileSync(
        new URL('../src/features/missions/templates/tool-guide/ToolGuide.tsx', import.meta.url),
        'utf8',
    );

    assert.match(shareStep?.tip ?? '', /\*\*Bekijken\*\*/);
    assert.match(toolGuideSource, /<RichText text=\{step\.tip\} \/>/);
});
