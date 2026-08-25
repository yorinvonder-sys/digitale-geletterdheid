import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import wordWizardConfig from '../src/features/missions/templates/tool-guide/configs/word-wizard.ts';

const toolGuideSource = readFileSync(
    new URL('../src/features/missions/templates/tool-guide/ToolGuide.tsx', import.meta.url),
    'utf8',
);

const verificationQuestions = wordWizardConfig.steps
    .map((step) => step.verificationQuestion)
    .filter((question) => question !== undefined);

/** Leest een `const NAAM = <getal>;` uit de engine, zodat de puntentelling tegen
 *  de werkelijke constanten wordt getoetst en niet tegen een kaal getal. */
function engineConstant(name: string): number {
    const match = toolGuideSource.match(new RegExp(`const ${name} = (\\d+);`));
    assert.ok(match, `engineconstante ontbreekt: ${name}`);
    return Number(match[1]);
}

test('Word Wizard blokkeert doorgaan tot het checkpunt goed is beantwoord', () => {
    assert.ok(verificationQuestions.length > 0);
    assert.ok(verificationQuestions.every((question) => /kies/i.test(question.retryHint ?? '')));
    // allowRetry is een historisch veld; herkansen mag altijd. Een config mag het
    // dus nooit op false zetten en daarmee suggereren dat de uitweg dicht kan.
    assert.ok(verificationQuestions.every((question) => question.allowRetry !== false));

    // De poort zelf zit in de engine: afvinken alleen is niet genoeg.
    assert.match(
        toolGuideSource,
        /const questionPassed = !step\.verificationQuestion \|\| !!isCorrect;/,
    );
    assert.match(
        toolGuideSource,
        /const canProceed = allChecked && questionPassed && teacherApproved;/,
    );
    assert.match(toolGuideSource, /if \(!step\.verificationQuestion\) return true;/);
    assert.match(
        toolGuideSource,
        /state\.verificationAnswers\[step\.id\] === step\.verificationQuestion\.correctIndex/,
    );
});

test('Word Wizard laat na een fout altijd opnieuw kiezen en zet de vraag terug', () => {
    // De herkansknop hangt uitsluitend aan een fout antwoord, niet aan allowRetry.
    assert.match(toolGuideSource, /\{!isCorrect && \(\s*<button/s);
    assert.match(toolGuideSource, /onClick=\{\(\) => onRetryAnswer\(step\.id\)\}/);
    assert.match(toolGuideSource, /Opnieuw kiezen/);
    assert.match(toolGuideSource, /delete verificationAnswers\[stepId\]/);
    assert.match(
        toolGuideSource,
        /verificationSubmitted: \{ \.\.\.prev\.verificationSubmitted, \[stepId\]: false \}/,
    );
    // Zolang een antwoord vaststaat, kan de leerling niet stiekem doorklikken.
    assert.match(toolGuideSource, /disabled=\{verificationSubmitted\}/);
    assert.match(toolGuideSource, /!verificationSubmitted && onSelectAnswer\(step\.id, i\)/);
});

test('Word Wizard verklapt het juiste antwoord niet bij een fout', () => {
    assert.match(toolGuideSource, /const revealCorrectAnswer = Boolean\(/);
    assert.match(
        toolGuideSource,
        /verificationSubmitted &&\s*i === step\.verificationQuestion!\.correctIndex &&\s*isCorrect/s,
    );
    assert.match(toolGuideSource, /if \(revealCorrectAnswer\)/);
    assert.match(toolGuideSource, /revealCorrectAnswer\s*\?\s*'bg-duck-ink border-duck-ink'/s);
    // Fout antwoord ⇒ de retryHint, nooit de explanation met het antwoord erin.
    assert.match(
        toolGuideSource,
        /\? step\.verificationQuestion\.explanation\s*:\s*step\.verificationQuestion\.retryHint \?\?/s,
    );
    assert.match(toolGuideSource, /aria-pressed=\{verificationAnswer === i\}/);
    assert.match(toolGuideSource, /role="status"/);
    assert.match(toolGuideSource, /aria-live="polite"/);
    assert.match(toolGuideSource, /aria-atomic="true"/);

    // Een retryHint mag het juiste antwoord ook niet in tekst weggeven.
    for (const question of verificationQuestions) {
        const correctOption = question.options[question.correctIndex];
        assert.ok(
            !(question.retryHint ?? '').includes(correctOption),
            `retryHint verklapt het juiste antwoord: ${question.question}`,
        );
    }
});

test('Word Wizard verlaagt de kennisbonus per herkansing van 5 naar 3 naar 1', () => {
    const questionBonusMax = engineConstant('QUESTION_BONUS');
    const retryPenalty = engineConstant('RETRY_PENALTY');
    const minQuestionBonus = engineConstant('MIN_QUESTION_BONUS');
    const bonusAfter = (retries: number) =>
        Math.max(minQuestionBonus, questionBonusMax - retries * retryPenalty);

    assert.deepEqual([0, 1, 2, 3].map(bonusAfter), [5, 3, 1, 1]);
    assert.match(
        toolGuideSource,
        /return Math\.max\(MIN_QUESTION_BONUS, QUESTION_BONUS - retries \* RETRY_PENALTY\);/,
    );
    // Elke herkansing telt precies één misser mee.
    assert.match(
        toolGuideSource,
        /verificationRetries: \{ \.\.\.retries, \[stepId\]: \(retries\[stepId\] \?\? 0\) \+ 1 \}/,
    );
    // Opslag van vóór deze telling heeft geen herkansingen en houdt de volle bonus.
    assert.match(toolGuideSource, /questionBonus\(state\.verificationRetries\?\.\[step\.id\] \?\? 0\)/);
    assert.match(toolGuideSource, /verificationRetries\?: Record<string, number>;/);
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

test('Word Wizard beschrijft Microsoft 365-voorwaarden zonder een abonnement altijd verplicht te noemen', () => {
    const setupStep = wordWizardConfig.steps.find(
        (step) => step.id === 'stap-1-nieuw-document',
    );

    assert.ok(setupStep);
    assert.match(setupStep.instruction, /Word voor iPad/i);
    assert.match(setupStep.instruction, /schoolaccount/i);
    assert.match(setupStep.instruction, /OneDrive/i);
    assert.match(setupStep.instruction, /kan Microsoft 365 nodig zijn/i);
    assert.match(setupStep.instruction, /groter dan 10,1 inch/i);
    assert.match(setupStep.instruction, /OneDrive van school/i);
    assert.match(setupStep.instruction, /premiumfuncties/i);
    assert.match(setupStep.instruction, /vraag je docent/i);
    assert.doesNotMatch(setupStep.instruction, /je hebt een Microsoft 365-licentie nodig/i);
    assert.doesNotMatch(setupStep.instruction, /gratis Office-account via school/i);
});

test('Word Wizard houdt de stijlenroute versie- en schermstandveilig', () => {
    const stylesStep = wordWizardConfig.steps.find((step) => step.id === 'stap-2-koppen');

    assert.ok(stylesStep);
    assert.match(stylesStep.instruction, /Start.*Home/i);
    assert.match(stylesStep.instruction, /Stijlen/i);
    assert.match(stylesStep.instruction, /Lettertype.*Font/i);
    assert.match(stylesStep.instruction, /Word-versie en schermstand/i);
    assert.match(stylesStep.instruction, /Vraag je docent/i);
    assert.doesNotMatch(stylesStep.instruction, /A-knop.*rechtsboven/i);
});

test('Word Wizard vraagt om een herbruikbare neutrale afbeelding zonder personen', () => {
    const imageStep = wordWizardConfig.steps.find((step) => step.id === 'stap-3-afbeelding');

    assert.ok(imageStep);
    assert.match(imageStep.instruction, /docent aanlevert/i);
    assert.match(imageStep.instruction, /herbruikbaar/i);
    assert.match(imageStep.instruction, /geen persoonlijke foto's/i);
    assert.match(imageStep.instruction, /geen persoonlijke foto's of afbeeldingen van mensen/i);
    assert.match(imageStep.instruction, /Noteer de bron/i);
    assert.ok(imageStep.checklistItems.some((item) => /bron genoteerd/i.test(item.label)));
    assert.match(imageStep.teacherCheck ?? '', /bron/i);
    assert.doesNotMatch(imageStep.instruction, /eigen schoolfoto/i);
});

test('Word Wizard houdt iedere instructie binnen 60 woorden voor leerjaar 1', () => {
    for (const step of wordWizardConfig.steps) {
        const wordCount = step.instruction.trim().split(/\s+/).length;
        assert.ok(wordCount <= 60, `${step.id} bevat ${wordCount} woorden`);
    }
});

test('Word Wizard toont nadruk in instructies zonder letterlijke markdownsterretjes', () => {
    assert.ok(
        wordWizardConfig.steps.every((step) => /\*\*[^*]+\*\*/.test(step.instruction)),
        'elke instructie markeert de knopnamen vet',
    );
    assert.match(toolGuideSource, /<RichText text=\{step\.instruction\} \/>/);
    assert.match(toolGuideSource, /<RichText text=\{step\.tip\} \/>/);
    assert.match(toolGuideSource, /text\.split\(\/\(\\\*\\\*\[\^\*\]\+\\\*\\\*\)\/g\)/);
    assert.match(toolGuideSource, /part\.slice\(2, -2\)/);
});

test('ToolGuide houdt de missiecontrols van Word Wizard minimaal 44px hoog', () => {
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
    // De herkansknop is nieuw en is de enige uitweg na een fout: ook die moet raakbaar zijn.
    assert.match(buttonBlockAround(toolGuideSource, 'onRetryAnswer(step.id)'), /w-full min-h-11/);
    assert.match(buttonBlockAround(toolGuideSource, 'onClick={onBack}'), /min-h-11 min-w-11/);

    const phaseBackButton = buttonBlockAround(phaseHeaderSource, 'aria-label="Terug"');
    assert.match(phaseBackButton, /min-h-\[44px\]/);
    assert.match(phaseBackButton, /min-w-\[44px\]/);
});

test('Word Wizard-agent gebruikt bronveilige iPad-instructies en zichtbaar bewijs', () => {
    const year1Source = readFileSync(
        new URL('../src/config/agents/year1.tsx', import.meta.url),
        'utf8',
    );
    const blockStart = year1Source.indexOf("id: 'word-wizard'");
    const blockEnd = year1Source.indexOf("id: 'social-media-psychologist'", blockStart);
    assert.ok(blockStart >= 0 && blockEnd > blockStart);
    const wordWizardBlock = year1Source.slice(blockStart, blockEnd);

    assert.doesNotMatch(wordWizardBlock, /penseel/i);
    assert.doesNotMatch(wordWizardBlock, /A-knop/i);
    assert.match(wordWizardBlock, /Start \(Home\).*Stijlen/s);
    assert.match(wordWizardBlock, /Word voor iPad\/iOS.*bestaande inhoudsopgave openen, maar niet toevoegen of bijwerken/s);
    assert.match(wordWizardBlock, /laptop of desktop/i);
    assert.match(wordWizardBlock, /docentdemonstratie/i);
    assert.match(wordWizardBlock, /neutrale.*herbruikbare afbeelding/s);
    assert.match(wordWizardBlock, /Geen persoonlijke foto's of afbeeldingen van mensen/i);
    assert.match(wordWizardBlock, /bron/i);
    assert.match(wordWizardBlock, /zichtbaar bewijs/i);
    assert.match(wordWizardBlock, /Vraag niet om een inhoudsopgave op de iPad/i);
    assert.doesNotMatch(wordWizardBlock, /Hoeveel koppen staan er nu in je inhoudsopgave/i);
});

test('Word Wizard toetst met uitvoeringsvragen over wat de leerling zag gebeuren', () => {
    for (const question of verificationQuestions) {
        assert.match(
            question.question,
            /\b(kijk|wat gebeurde|wat zag|wat stond)\b/i,
            `vraag toetst geen eigen uitvoering: ${question.question}`,
        );
    }
});

test('Word Wizard-leerdoel past bij voorbereiden en uitleggen in plaats van zelf toevoegen', () => {
    const contentsObjective = wordWizardConfig.learningObjectives[3];
    const saveQuestion = wordWizardConfig.steps
        .find((step) => step.id === 'stap-1-nieuw-document')
        ?.verificationQuestion;

    assert.match(contentsObjective, /bereidt.*Kop 1 en Kop 2.*voor/i);
    assert.match(contentsObjective, /legt uit/i);
    assert.doesNotMatch(contentsObjective, /voegt.*toe/i);
    assert.doesNotMatch(contentsObjective, /werkt.*bij/i);

    // De uitleg koppelt automatisch opslaan aan een voorwaarde (naam + OneDrive)
    // en belooft nooit dat werk niet meer verloren kan gaan.
    assert.match(saveQuestion?.explanation ?? '', /OneDrive/i);
    assert.match(saveQuestion?.explanation ?? '', /Zodra je het bestand een naam/i);
    assert.match(saveQuestion?.explanation ?? '', /slaat Word je werk vanzelf op/i);
    assert.doesNotMatch(saveQuestion?.explanation ?? '', /nooit je werk/i);
    assert.doesNotMatch(saveQuestion?.explanation ?? '', /nooit meer kwijt/i);
    assert.doesNotMatch(saveQuestion?.explanation ?? '', /altijd veilig/i);
});

test('Word Wizard scorecontract blijft gelijk aan het haalbare maximum', () => {
    const checklistPointsPerStep = engineConstant('CHECKLIST_POINTS_PER_STEP');
    const questionBonusMax = engineConstant('QUESTION_BONUS');
    const questionCount = wordWizardConfig.steps.filter(
        (step) => step.verificationQuestion !== undefined,
    ).length;
    const engineMaximum =
        wordWizardConfig.steps.length * checklistPointsPerStep + questionCount * questionBonusMax;

    assert.equal(checklistPointsPerStep, 10);
    assert.equal(questionBonusMax, 5);
    assert.equal(engineMaximum, 4 * 10 + 4 * 5);
    assert.equal(engineMaximum, 60);
    assert.equal(wordWizardConfig.maxScore, engineMaximum);
});

test('Word Wizard schaalt de badgedrempels mee met het herijkte maximum', () => {
    const { badges, maxScore } = wordWizardConfig;
    const thresholds = badges.map((badge) => badge.minScore);

    assert.equal(badges.length, 3);
    // Aflopend en binnen bereik: geen onbereikbare of dubbele drempel.
    assert.deepEqual(thresholds, [...thresholds].sort((a, b) => b - a));
    assert.ok(thresholds.every((minScore) => minScore >= 0 && minScore <= maxScore));
    // Hoogste badge = alles goed; middenbadge staat proportioneel op 75%.
    assert.equal(thresholds[0], maxScore);
    assert.equal(thresholds[1], Math.round(maxScore * 0.75));
    assert.equal(thresholds[2], 0);
});
