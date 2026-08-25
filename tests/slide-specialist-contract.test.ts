import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import slideSpecialistConfig from '../src/features/missions/templates/tool-guide/configs/slide-specialist.ts';

const step = (id: string) => {
    const found = slideSpecialistConfig.steps.find((candidate) => candidate.id === id);
    assert.ok(found, `stap ontbreekt: ${id}`);
    return found;
};

const toolGuideSource = () =>
    readFileSync(
        new URL('../src/features/missions/templates/tool-guide/ToolGuide.tsx', import.meta.url),
        'utf8',
    );

/** Leest een `const NAAM = <getal>;` uit de engine, zodat de puntentelling uit de
 *  bron komt en niet uit een kaal getal in deze test. */
const engineConstant = (source: string, name: string): number => {
    const match = source.match(new RegExp(`const ${name} = (\\d+);`));
    assert.ok(match, `engineconstante ontbreekt: ${name}`);
    return Number(match[1]);
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

test('Slide Specialist zet op iedere stap een checkpunt als poort', () => {
    const questions = slideSpecialistConfig.steps
        .map((missionStep) => missionStep.verificationQuestion)
        .filter((question) => question !== undefined);

    // Elke stap is nu een poort: zonder checkpunt zou die stap zonder controle
    // openvallen.
    assert.equal(questions.length, slideSpecialistConfig.steps.length);
    assert.ok(questions.every((question) => question.options.length >= 3));
    assert.ok(
        questions.every(
            (question) =>
                Number.isInteger(question.correctIndex) &&
                question.correctIndex >= 0 &&
                question.correctIndex < question.options.length,
        ),
    );
});

test('Slide Specialist laat na een fout bij ieder checkpunt opnieuw kiezen', () => {
    const questions = slideSpecialistConfig.steps
        .map((missionStep) => missionStep.verificationQuestion)
        .filter((question) => question !== undefined);

    assert.equal(questions.length, 4);
    // `allowRetry` is een historisch veld: de engine kijkt er niet meer naar,
    // maar zolang de config het zet mag het de herkansing niet tegenspreken.
    assert.ok(questions.every((question) => question.allowRetry !== false));
    // De hint is de uitweg die de leerling in beeld krijgt na een fout antwoord.
    assert.ok(questions.every((question) => /kies.*opnieuw/i.test(question.retryHint ?? '')));
    // De hint mag het juiste antwoord niet alsnog verklappen.
    assert.ok(
        questions.every(
            (question) =>
                !(question.retryHint ?? '')
                    .toLowerCase()
                    .includes(question.options[question.correctIndex].toLowerCase()),
        ),
    );
});

test('Slide Specialist stelt uitvoeringsvragen over wat de leerling zelf zag', () => {
    for (const missionStep of slideSpecialistConfig.steps) {
        const question = missionStep.verificationQuestion;
        assert.ok(question, `${missionStep.id} mist een checkpunt`);
        // Een uitvoeringsvraag verwijst naar de zojuist uitgevoerde handeling,
        // niet naar boekenkennis: "Je tikte…", "Je hebt … net…".
        assert.match(question.question, /^Je\b/, `${missionStep.id}: geen uitvoeringsvraag`);
        assert.match(
            question.question,
            /wat (gebeurde|zag|zie)/i,
            `${missionStep.id}: vraagt niet naar de waarneming`,
        );
    }
});

test('Slide Specialist telt 4 stappen x 10 punten + 4 vragen x 5 bonus als maximum', () => {
    const source = toolGuideSource();
    const checklistPoints = engineConstant(source, 'CHECKLIST_POINTS_PER_STEP');
    const questionBonus = engineConstant(source, 'QUESTION_BONUS');

    const questionCount = slideSpecialistConfig.steps.filter(
        (missionStep) => missionStep.verificationQuestion !== undefined,
    ).length;
    const engineMaximum =
        slideSpecialistConfig.steps.length * checklistPoints + questionCount * questionBonus;

    // Berekend uit de config plus de engineconstanten, niet uit een kaal getal.
    assert.equal(engineMaximum, 60);
    assert.equal(slideSpecialistConfig.maxScore, engineMaximum);
});

test('Slide Specialist schaalt de badgedrempels mee met het herijkte maximum', () => {
    const badges = slideSpecialistConfig.badges;
    const maxScore = slideSpecialistConfig.maxScore;

    // De topbadge blijft alleen haalbaar op een vlekkeloze run.
    assert.equal(badges[0]?.minScore, maxScore);
    // De middelste badge is proportioneel meegeschaald (75% van het maximum).
    assert.equal(badges[1]?.minScore, Math.round(maxScore * 0.75));
    // Drempels lopen aflopend en eindigen op 0, zodat niemand zonder badge valt.
    const thresholds = badges.map((badge) => badge.minScore);
    assert.deepEqual(thresholds, [...thresholds].sort((a, b) => b - a));
    assert.equal(thresholds.at(-1), 0);
    assert.ok(thresholds.every((threshold) => threshold <= maxScore));
});

test('De gedeelde engine blokkeert doorgaan tot het checkpunt goed is', () => {
    const source = toolGuideSource();

    // Het checkpunt is de poort: zonder goed antwoord geen Volgende stap.
    assert.match(source, /const questionPassed = !step\.verificationQuestion \|\| !!isCorrect;/);
    assert.match(source, /const teacherApproved = !step\.teacherCheck \|\| !!teacherChecks\[step\.id\]/);
    assert.match(source, /const canProceed = allChecked && questionPassed && teacherApproved;/);
    // De poort mag niet meer van een configvlag afhangen.
    assert.doesNotMatch(source, /verificationQuestion\.allowRetry/);
});

test('De gedeelde engine verklapt het juiste antwoord niet bij een fout', () => {
    const source = toolGuideSource();

    // Het juiste antwoord licht alleen op wanneer het antwoord goed was.
    assert.match(
        source,
        /const revealCorrectAnswer = Boolean\(\s*verificationSubmitted &&\s*i === step\.verificationQuestion!\.correctIndex &&\s*isCorrect\s*\)/,
    );
    // De uitleg hoort bij het goede antwoord; bij een fout krijgt de leerling
    // alleen de retryHint te zien.
    assert.match(
        source,
        /\?\s*step\.verificationQuestion\.explanation\s*:\s*step\.verificationQuestion\.retryHint/,
    );
});

test('De gedeelde engine biedt altijd een herkansing en reset dezelfde vraag', () => {
    const source = toolGuideSource();

    // Herkansen mag altijd na een fout — anders loopt de leerling vast op de poort.
    assert.match(source, /\{!isCorrect && \(\s*<button\s+onClick=\{\(\) => onRetryAnswer\(step\.id\)\}/);
    assert.match(source, /Opnieuw kiezen/);
    // De herkansknop blijft een tapdoel van minimaal 44px (min-h-11).
    assert.match(source, /onRetryAnswer\(step\.id\)\}[\s\S]{0,300}min-h-11/);
    // Herkansen zet dezelfde vraag terug op onbeantwoord.
    assert.match(source, /verificationSubmitted:\s*\{[\s\S]*?\[stepId\]: false/);
    assert.match(source, /delete verificationAnswers\[stepId\]/);
});

test('De gedeelde engine verlaagt de kennisbonus 5 -> 3 -> 1 per herkansing', () => {
    const source = toolGuideSource();
    const full = engineConstant(source, 'QUESTION_BONUS');
    const penalty = engineConstant(source, 'RETRY_PENALTY');
    const floor = engineConstant(source, 'MIN_QUESTION_BONUS');

    assert.match(source, /Math\.max\(MIN_QUESTION_BONUS, QUESTION_BONUS - retries \* RETRY_PENALTY\)/);
    const bonus = (retries: number) => Math.max(floor, full - retries * penalty);
    assert.deepEqual([bonus(0), bonus(1), bonus(2), bonus(3)], [5, 3, 1, 1]);

    // Elke herkansing telt precies één misser mee.
    assert.match(
        source,
        /verificationRetries: \{ \.\.\.retries, \[stepId\]: \(retries\[stepId\] \?\? 0\) \+ 1 \}/,
    );
    // Oude saves zonder dit veld houden de volle bonus (optioneel veld + ?? 0).
    assert.match(source, /verificationRetries\?: Record<string, number>;/);
    assert.match(source, /state\.verificationRetries\?\.\[step\.id\] \?\? 0/);
});

test('Slide Specialist toont geen letterlijke markdownsterretjes aan de leerling', () => {
    // Instructie en tip gaan door RichText: **vet** mag, losse sterretjes niet.
    const richTextFields = slideSpecialistConfig.steps.flatMap((missionStep) => [
        { id: `${missionStep.id}.instruction`, text: missionStep.instruction },
        { id: `${missionStep.id}.tip`, text: missionStep.tip ?? '' },
    ]);
    for (const field of richTextFields) {
        const leftovers = field.text.split(/\*\*[^*]+\*\*/g).join('');
        assert.ok(!leftovers.includes('*'), `${field.id} bevat een los sterretje`);
    }

    // Deze velden worden als platte tekst gerenderd: daar is elk sterretje zichtbaar.
    const plainTextFields = slideSpecialistConfig.steps.flatMap((missionStep) => [
        { id: `${missionStep.id}.teacherCheck`, text: missionStep.teacherCheck ?? '' },
        ...missionStep.checklistItems.map((item) => ({
            id: `${missionStep.id}.${item.id}`,
            text: item.label,
        })),
        { id: `${missionStep.id}.question`, text: missionStep.verificationQuestion?.question ?? '' },
        ...(missionStep.verificationQuestion?.options ?? []).map((option, i) => ({
            id: `${missionStep.id}.option-${i}`,
            text: option,
        })),
        {
            id: `${missionStep.id}.explanation`,
            text: missionStep.verificationQuestion?.explanation ?? '',
        },
        {
            id: `${missionStep.id}.retryHint`,
            text: missionStep.verificationQuestion?.retryHint ?? '',
        },
    ]);
    for (const field of plainTextFields) {
        assert.ok(!field.text.includes('*'), `${field.id} bevat een sterretje in platte tekst`);
    }
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
