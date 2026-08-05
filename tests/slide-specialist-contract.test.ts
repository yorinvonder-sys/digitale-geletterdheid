import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import slideSpecialistConfig from '../src/features/missions/templates/tool-guide/configs/slide-specialist.ts';

const step = (id: string) => {
    const found = slideSpecialistConfig.steps.find((candidate) => candidate.id === id);
    assert.ok(found, `stap ontbreekt: ${id}`);
    return found;
};

test('Slide Specialist houdt iedere iPad-instructie binnen 60 woorden', () => {
    for (const missionStep of slideSpecialistConfig.steps) {
        const wordCount = missionStep.instruction.trim().split(/\s+/).length;
        assert.ok(wordCount <= 60, `${missionStep.id} bevat ${wordCount} woorden`);
    }
});

test('Slide Specialist maakt timing desktop/docent-only en blokkeert geen iPad-flow', () => {
    const animation = step('stap-3-animatie');
    const transition = step('stap-4-overgang');

    assert.match(animation.instruction, /desktop|docentdemonstratie/i);
    assert.match(transition.instruction, /alleen.*desktop|docentdemonstratie/i);
    assert.doesNotMatch(animation.instruction, /Pas de timing aan/i);
    assert.doesNotMatch(transition.instruction, /Stel de duur in/i);
    assert.match(transition.tip ?? '', /slide-timings niet instellen/i);
});

test('Slide Specialist borgt school-OneDrive en neutrale bestandsnaam', () => {
    const setup = step('stap-1-thema');
    assert.match(setup.instruction, /school-OneDrive/i);
    assert.match(setup.instruction, /klas_onderwerp_presentatie\.pptx/);
    assert.match(setup.instruction, /geen naam of e-mail/i);
    assert.match(setup.instruction, /als die optie zichtbaar is/i);
    assert.match(setup.instruction, /eerlijk/i);
    assert.ok(setup.checklistItems.some((item) => /school-OneDrive/i.test(item.label)));
    assert.ok(setup.checklistItems.some((item) => /eerlijk genoteerd.*optie ontbreekt/i.test(item.label)));
});

test('Slide Specialist benoemt Microsoft 365-, versie-, account- en schermstandcaveat', () => {
    const setup = step('stap-1-thema');
    assert.match(setup.instruction, /Microsoft 365/i);
    assert.match(setup.instruction, /versie, account of schermstand/i);
});

test('Slide Specialist gebruikt privacyveilige beelden met bronbewijs', () => {
    const content = step('stap-2-inhoud');
    assert.match(content.instruction, /tweede én derde slide/i);
    assert.ok(content.checklistItems.some((item) => /derde slide/i.test(item.label)));
    assert.match(content.teacherCheck ?? '', /alle drie slides/i);
    assert.match(content.instruction, /privacyveilige, herbruikbare afbeelding/i);
    assert.match(content.instruction, /geen personen, namen, schoollogo's of privé-screenshots/i);
    assert.match(content.instruction, /maker\/bron en URL/i);
    assert.match(content.instruction, /plek die je docent aanwijst/i);
    assert.match(content.tip ?? '', /Zie je geen speaker notes\? Stop niet/i);
    assert.ok(content.checklistItems.some((item) => /bron/i.test(item.label)));
    assert.match(content.teacherCheck ?? '', /afbeelding.*bronnotitie/i);
});

test('Slide Specialist vraagt afzonderlijk bewijs voor de tweede en derde slide', () => {
    const content = step('stap-2-inhoud');
    const labels = content.checklistItems.map((item) => item.label);

    assert.ok(labels.some((label) => /tweede slide.*maximaal 5/i.test(label)));
    assert.ok(labels.some((label) => /derde slide.*maximaal 5/i.test(label)));
    assert.match(content.teacherCheck ?? '', /alle drie slides.*beide tekstcontroles/i);
});

test('Slide Specialist vraagt bij iedere externe stap om concreet docentbewijs', () => {
    assert.equal(slideSpecialistConfig.steps.length, 4);
    assert.ok(slideSpecialistConfig.steps.every((missionStep) => /docent/i.test(missionStep.teacherCheck ?? '')));
    assert.ok(slideSpecialistConfig.steps.every((missionStep) => (missionStep.teacherCheck ?? '').length > 40));
});

test('Slide Specialist laat alle drie de vragen na een fout opnieuw kiezen', () => {
    const questions = slideSpecialistConfig.steps
        .map((missionStep) => missionStep.verificationQuestion)
        .filter((question) => question !== undefined);

    assert.equal(questions.length, 3);
    assert.ok(questions.every((question) => question.allowRetry));
    assert.ok(questions.every((question) => /kies.*opnieuw/i.test(question.retryHint ?? '')));
});

test('Slide Specialist behoudt het 55-puntencontract en kan na recovery 55/55 halen', () => {
    const questionCount = slideSpecialistConfig.steps.filter(
        (missionStep) => missionStep.verificationQuestion !== undefined,
    ).length;
    const engineMaximum = slideSpecialistConfig.steps.length * 10 + questionCount * 5;

    assert.equal(slideSpecialistConfig.maxScore, 55);
    assert.equal(engineMaximum, 55);
    assert.equal(slideSpecialistConfig.badges[0]?.minScore, 55);
});

test('De gedeelde engine blokkeert doorgaan na een fout en reset dezelfde vraag', () => {
    const toolGuideSource = readFileSync(
        new URL('../src/features/missions/templates/tool-guide/ToolGuide.tsx', import.meta.url),
        'utf8',
    );

    assert.match(toolGuideSource, /!step\.verificationQuestion\.allowRetry \|\| isCorrect/);
    assert.match(toolGuideSource, /const teacherApproved = !step\.teacherCheck \|\| !!teacherChecks\[step\.id\]/);
    assert.match(toolGuideSource, /Opnieuw kiezen/);
    assert.match(toolGuideSource, /verificationSubmitted:\s*\{[\s\S]*\[stepId\]: false/);
});

test('Slide Specialist-agent bewaakt capability-, privacy- en evidencegrenzen', () => {
    const year1Source = readFileSync(
        new URL('../src/config/agents/year1.tsx', import.meta.url),
        'utf8',
    );
    const blockStart = year1Source.indexOf("id: 'slide-specialist'");
    const blockEnd = year1Source.indexOf("id: 'print-pro'", blockStart);
    assert.ok(blockStart >= 0 && blockEnd > blockStart);
    const block = year1Source.slice(blockStart, blockEnd);

    assert.match(block, /versie, Microsoft-account, licentie en schermstand/i);
    assert.match(block, /timing.*alleen desktopwerk of een docentdemonstratie/i);
    assert.match(block, /school-OneDrive.*neutrale bestandsnaam/i);
    assert.match(block, /account, e-mailadres, wachtwoord/i);
    assert.match(block, /Geen gezichten, namen, schoollogo's of privé-screenshots/i);
    assert.match(block, /bij iedere externe PowerPoint-stap.*docentbewijs/i);
});

test('Slide Specialist-dashboard claimt niet langer Data SLO 21C', () => {
    const dashboard = readFileSync(
        new URL('../src/features/student/ProjectZeroDashboard.tsx', import.meta.url),
        'utf8',
    );
    const blockStart = dashboard.indexOf("id: 'slide-specialist'");
    const blockEnd = dashboard.indexOf("id: 'print-pro'", blockStart);
    assert.ok(blockStart >= 0 && blockEnd > blockStart);
    const block = dashboard.slice(blockStart, blockEnd);

    assert.match(block, /sloKerndoelen: \['21A', '22A'\]/);
    assert.doesNotMatch(block, /21C/);
});
