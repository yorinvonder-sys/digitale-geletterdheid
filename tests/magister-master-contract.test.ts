import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import magisterMasterConfig from '../src/features/missions/templates/tool-guide/configs/magister-master.ts';

const toolGuideSource = readFileSync(
    new URL('../src/features/missions/templates/tool-guide/ToolGuide.tsx', import.meta.url),
    'utf8',
);

const questionSteps = magisterMasterConfig.steps.filter(
    (step) => step.verificationQuestion !== undefined,
);
const questions = questionSteps.map((step) => step.verificationQuestion!);

test('Magister Master zet op iedere stap een checkpunt als echte poort', () => {
    assert.equal(magisterMasterConfig.steps.length, 4);
    // Elke stap is een poort: geen enkele stap mag stilletjes zonder checkpunt
    // doorlaten.
    assert.equal(questions.length, magisterMasterConfig.steps.length);

    for (const question of questions) {
        assert.ok(question.options.length >= 3);
        assert.ok(Number.isInteger(question.correctIndex));
        assert.ok(question.correctIndex >= 0 && question.correctIndex < question.options.length);
        assert.ok(question.explanation.trim().length > 0);
        // Historisch veld: de engine laat herkansen ook zonder deze vlag toe,
        // maar de configs blijven hem zetten zodat oude lezers niet omvallen.
        assert.equal(question.allowRetry, true);
    }
});

test('Magister Master vraagt naar wat de leerling zelf heeft gedaan of gezien', () => {
    // Uitvoeringsvragen: de vraag gaat over het eigen scherm van de leerling,
    // niet over algemene Magister-kennis die je zonder de app kunt gokken.
    for (const step of questionSteps) {
        const question = step.verificationQuestion!.question;
        assert.match(question, /\b(je|jouw)\b/i, `${step.id}: vraag spreekt de leerling niet aan`);
        assert.ok(question.trim().endsWith('?'), `${step.id}: vraag eindigt niet op een vraagteken`);
    }
});

test('Magister Master laat de leerling na niet-onthullende foutfeedback opnieuw kiezen', () => {
    assert.ok(questions.every((question) => /kies.*opnieuw/i.test(question.retryHint ?? '')));

    for (const step of questionSteps) {
        const question = step.verificationQuestion!;
        const retryHint = (question.retryHint ?? '').toLocaleLowerCase('nl-NL');

        assert.ok(retryHint.length > 0, `${step.id}: geen retryHint`);

        // Het juiste antwoord mag niet in de foutfeedback staan — anders is de
        // poort met één klik te omzeilen.
        const correctAnswer = question.options[question.correctIndex].toLocaleLowerCase('nl-NL');
        assert.ok(!retryHint.includes(correctAnswer), `${step.id}: retryHint verklapt het antwoord`);

        // Ook geen enkele andere optie letterlijk terugzeggen: dat zou het
        // aantal overgebleven keuzes verklappen.
        for (const option of question.options) {
            assert.ok(
                !retryHint.includes(option.toLocaleLowerCase('nl-NL')),
                `${step.id}: retryHint citeert een antwoordoptie`,
            );
        }

        // De uitleg hoort bij een goed antwoord en mag dus niet als foutfeedback
        // worden hergebruikt.
        assert.notEqual(question.retryHint, question.explanation);
    }
});

test('ToolGuide houdt het juiste antwoord verborgen totdat het antwoord goed is', () => {
    // Onthullen gebeurt alleen bij een goed antwoord, niet bij het inleveren.
    assert.match(
        toolGuideSource,
        /const revealCorrectAnswer = Boolean\(\s*verificationSubmitted &&\s*i === step\.verificationQuestion!\.correctIndex &&\s*isCorrect\s*\)/s,
    );

    // Fout ⇒ retryHint, goed ⇒ explanation. De uitleg lekt dus niet bij een fout.
    assert.match(
        toolGuideSource,
        /isCorrect\s*\?\s*step\.verificationQuestion\.explanation\s*:\s*step\.verificationQuestion\.retryHint/s,
    );

    // Het checkpunt is de poort: doorgaan kan pas na een goed antwoord.
    assert.match(toolGuideSource, /const questionPassed = !step\.verificationQuestion \|\| !!isCorrect;/);
    assert.match(toolGuideSource, /const canProceed = allChecked && questionPassed && teacherApproved;/);
});

test('ToolGuide laat altijd opnieuw kiezen, ongeacht het historische allowRetry-veld', () => {
    assert.match(toolGuideSource, /Opnieuw kiezen/);
    assert.match(
        toolGuideSource,
        /!isCorrect && \(\s*<button\s+onClick=\{\(\) => onRetryAnswer\(step\.id\)\}/s,
    );

    // De herkansing mag nergens meer achter allowRetry hangen — dat veld is
    // historisch en zou anders leerlingen op een dood spoor kunnen zetten.
    assert.doesNotMatch(toolGuideSource, /verificationQuestion!?\.allowRetry/);
    assert.doesNotMatch(toolGuideSource, /allowRetry \|\|/);

    // Opnieuw kiezen zet de vraag echt terug: keuze weg, inlevering weg.
    assert.match(toolGuideSource, /delete verificationAnswers\[stepId\];/);
    assert.match(
        toolGuideSource,
        /verificationSubmitted: \{ \.\.\.prev\.verificationSubmitted, \[stepId\]: false \}/,
    );
});

test('ToolGuide verlaagt de kennisbonus 5 → 3 → 1 per herkansing en spaart oude saves', () => {
    const readConstant = (name: string): number => {
        const match = toolGuideSource.match(new RegExp(`const ${name} = (\\d+);`));
        assert.ok(match, `${name} niet gevonden in ToolGuide.tsx`);
        return Number(match[1]);
    };

    const questionBonusPoints = readConstant('QUESTION_BONUS');
    const retryPenalty = readConstant('RETRY_PENALTY');
    const minQuestionBonus = readConstant('MIN_QUESTION_BONUS');

    assert.match(
        toolGuideSource,
        /function questionBonus\(retries: number\): number \{\s*return Math\.max\(MIN_QUESTION_BONUS, QUESTION_BONUS - retries \* RETRY_PENALTY\);/s,
    );

    const bonusAfter = (retries: number) =>
        Math.max(minQuestionBonus, questionBonusPoints - retries * retryPenalty);
    assert.deepEqual([0, 1, 2, 3].map(bonusAfter), [5, 3, 1, 1]);

    // Elke herkansing telt precies één misser.
    assert.match(
        toolGuideSource,
        /verificationRetries: \{ \.\.\.retries, \[stepId\]: \(retries\[stepId\] \?\? 0\) \+ 1 \}/,
    );

    // Opslag van vóór deze telling heeft geen verificationRetries en houdt de
    // volle bonus: de correctie werkt nooit terug op bestaand werk.
    assert.match(toolGuideSource, /verificationRetries\?: Record<string, number>;/);
    assert.match(toolGuideSource, /questionBonus\(state\.verificationRetries\?\.\[step\.id\] \?\? 0\)/);
});

test('Magister Master scorecontract is het haalbare maximum: stappen×10 + vragen×5', () => {
    const checklistPointsPerStep = Number(
        toolGuideSource.match(/const CHECKLIST_POINTS_PER_STEP = (\d+);/)?.[1],
    );
    const questionBonusPoints = Number(toolGuideSource.match(/const QUESTION_BONUS = (\d+);/)?.[1]);

    assert.equal(checklistPointsPerStep, 10);
    assert.equal(questionBonusPoints, 5);

    const engineMaximum =
        magisterMasterConfig.steps.length * checklistPointsPerStep +
        questions.length * questionBonusPoints;

    assert.equal(magisterMasterConfig.maxScore, engineMaximum);
    assert.equal(engineMaximum, 60);
});

test('Magister Master-badges schalen mee met het herijkte maximum', () => {
    const badges = magisterMasterConfig.badges;
    const thresholds = badges.map((badge) => badge.minScore);

    // Aflopend gesorteerd, hoogste haalbaar, laagste altijd bereikbaar.
    assert.deepEqual(thresholds, [...thresholds].sort((a, b) => b - a));
    assert.equal(thresholds[0], magisterMasterConfig.maxScore);
    assert.equal(thresholds[thresholds.length - 1], 0);
    assert.ok(thresholds.every((threshold) => threshold <= magisterMasterConfig.maxScore));

    // Proportioneel meegeschaald: de middelste drempel blijft op 75%.
    const middleRatio = thresholds[1] / magisterMasterConfig.maxScore;
    assert.equal(Math.round(middleRatio * 100), 75);

    assert.ok(badges.every((badge) => badge.title.trim().length > 0));
    assert.ok(badges.every((badge) => badge.emoji.trim().length > 0));
});

test('ToolGuide houdt elk aanraakdoel op minstens 44px', () => {
    const buttonSegments = toolGuideSource.split('<button').slice(1);
    assert.ok(buttonSegments.length >= 6, 'te weinig knoppen gevonden om te controleren');

    for (const [index, segment] of buttonSegments.entries()) {
        // De className van de knop zelf staat altijd vóór de inhoud ervan.
        const head = segment.slice(0, 1200);
        assert.match(
            head,
            /min-h-11|min-w-11|py-3\.5/,
            `knop ${index + 1} heeft geen 44px-aanraakdoel`,
        );
    }

    // min-h-11 (2.75rem = 44px) blijft de standaardmaat, niet een uitzondering.
    const minHeightCount = toolGuideSource.match(/min-h-11/g)?.length ?? 0;
    assert.ok(minHeightCount >= 6, `slechts ${minHeightCount} knoppen met min-h-11`);
});

test('Magister Master toont geen letterlijke markdownsterretjes aan de leerling', () => {
    // Alleen instruction en tip gaan door RichText; al het andere wordt rauw
    // gerenderd en mag dus geen ** bevatten.
    assert.match(toolGuideSource, /<RichText text=\{step\.instruction\} \/>/);
    assert.match(toolGuideSource, /<RichText text=\{step\.tip\} \/>/);

    const plainTexts: string[] = [
        magisterMasterConfig.title,
        magisterMasterConfig.introTitle,
        magisterMasterConfig.introDescription,
        magisterMasterConfig.missionGoal?.primaryGoal ?? '',
        magisterMasterConfig.missionGoal?.criteria.description ?? '',
        magisterMasterConfig.missionGoal?.evidence ?? '',
        ...(magisterMasterConfig.introFeatures ?? []),
        ...(magisterMasterConfig.learningObjectives ?? []),
        ...magisterMasterConfig.takeaways,
        ...magisterMasterConfig.badges.map((badge) => badge.title),
    ];

    for (const step of magisterMasterConfig.steps) {
        plainTexts.push(step.title, step.teacherCheck ?? '');
        plainTexts.push(...step.checklistItems.map((item) => item.label));
        const question = step.verificationQuestion;
        if (question) {
            plainTexts.push(question.question, question.explanation, question.retryHint ?? '');
            plainTexts.push(...question.options);
        }
    }

    for (const text of plainTexts) {
        assert.ok(!text.includes('**'), `letterlijke sterretjes in: ${text}`);
    }

    // In instruction en tip mogen sterretjes staan, maar altijd als gesloten
    // paar — een los paar zou als tekst op het scherm belanden.
    for (const step of magisterMasterConfig.steps) {
        for (const richText of [step.instruction, step.tip ?? '']) {
            const markerCount = richText.match(/\*\*/g)?.length ?? 0;
            assert.equal(markerCount % 2, 0, `ongepaarde sterretjes in ${step.id}`);
            assert.ok(!/\*\*\s*\*\*/.test(richText), `leeg vetgedrukt blok in ${step.id}`);
        }
    }
});
