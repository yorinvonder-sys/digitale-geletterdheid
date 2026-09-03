import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { cloudCommanderConfig } from '../src/features/missions/templates/tool-guide/configs/cloud-commander.ts';

const toolGuideSource = readFileSync(
    new URL('../src/features/missions/templates/tool-guide/ToolGuide.tsx', import.meta.url),
    'utf8',
);

/** Leest een genummerde constante uit de engine, zodat de puntentelling hier
 *  wordt nagerekend uit de bron in plaats van uit een kaal getal in deze test. */
function engineConstant(name: string): number {
    const match = toolGuideSource.match(new RegExp(`const ${name} = (\\d+);`));
    assert.ok(match, `constante ontbreekt in ToolGuide.tsx: ${name}`);
    return Number(match[1]);
}

const verificationQuestions = cloudCommanderConfig.steps
    .map((step) => step.verificationQuestion)
    .filter((question) => question !== undefined);

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

    // Niet meer op de exacte optielijst pinnen, wél op de didactische vorm: één
    // veilige keuze (specifieke personen + kijkrecht) tegenover afleiders die
    // breder delen. Zo blijft de vraag over veilig delen gaan, ook als de
    // formulering van een afleider verandert.
    const correctOption = question.options[question.correctIndex];
    assert.match(correctOption, /Specifieke personen/);
    assert.match(correctOption, /bekijken/i);
    assert.equal(question.options.filter((option) => /Specifieke personen/.test(option)).length, 1);
    assert.ok(
        question.options.some(
            (option, i) => i !== question.correctIndex && /Iedereen/i.test(option),
        ),
        'er moet minstens één afleider zijn die te breed deelt',
    );
    assert.match(question.explanation, /beperk je de toegang/);
});

test('Cloud Commander toetst cloudopslag met een concrete werksituatie', () => {
    const storageStep = cloudCommanderConfig.steps.find((step) => step.id === 'stap-2-map');
    const question = storageStep?.verificationQuestion;

    assert.ok(question);

    // De vraag is herschreven tot een uitvoeringsvraag: de leerling kijkt naar
    // het resultaat van zijn eigen handeling in plaats van een weetje te
    // reproduceren.
    assert.match(question.question, /aangemaakt/);
    assert.match(question.question, /Wat zie je nu/);
    assert.match(question.question, /OneDrive/);

    const correctOption = question.options[question.correctIndex];
    assert.match(correctOption, /School/);
    assert.match(correctOption, /bestandenlijst/);

    // De cloudwinst (hetzelfde bestand op een ander apparaat) mag niet uit de
    // uitleg verdwijnen — dat is het leerdoel achter deze stap.
    assert.match(question.explanation, /OneDrive/);
    assert.match(question.explanation, /schoolcomputer/);
});

test('Cloud Commander behoudt alle vier leerdoelen', () => {
    assert.deepEqual(cloudCommanderConfig.learningObjectives, [
        'De leerling herkent het verschil tussen lokale opslag en cloudopslag en benoemt één voordeel.',
        'De leerling past een mappenstructuur toe door een map aan te maken en een bestand daarin op te slaan.',
        'De leerling uploadt een bestand naar OneDrive en controleert of het uploaden is geslaagd.',
        'De leerling deelt een bestand met één specifieke ontvanger en stelt passende kijk- of bewerkrechten in.',
    ]);
});

test('Cloud Commander telt de missiebeloning gelijk aan het haalbare maximum', () => {
    const checklistPointsPerStep = engineConstant('CHECKLIST_POINTS_PER_STEP');
    const questionBonus = engineConstant('QUESTION_BONUS');
    const stepCount = cloudCommanderConfig.steps.length;
    const questionCount = verificationQuestions.length;

    // Uit de config zelf berekend, niet als kaal getal: zo blijft maxScore
    // meebewegen wanneer er een stap of checkpunt bij komt of afvalt.
    const achievableMaximum =
        stepCount * checklistPointsPerStep + questionCount * questionBonus;

    assert.equal(stepCount, 4);
    assert.equal(questionCount, 4);
    assert.equal(achievableMaximum, 60);
    assert.equal(cloudCommanderConfig.maxScore, achievableMaximum);
});

test('Cloud Commander houdt alle badgedrempels haalbaar en oplopend', () => {
    const badges = cloudCommanderConfig.badges;
    const maxScore = cloudCommanderConfig.maxScore;

    assert.ok(badges.length >= 2);

    // Een drempel boven het haalbare maximum is een badge die niemand ooit
    // krijgt; een vloer onder 0 laat een leerling zonder badge eindigen.
    for (const badge of badges) {
        assert.ok(
            badge.minScore >= 0 && badge.minScore <= maxScore,
            `badgedrempel buiten bereik: ${badge.title} (${badge.minScore})`,
        );
        assert.ok(badge.title.length > 0);
    }
    for (let i = 1; i < badges.length; i += 1) {
        assert.ok(
            badges[i].minScore < badges[i - 1].minScore,
            'badges moeten van hoog naar laag staan',
        );
    }
    assert.equal(badges[badges.length - 1].minScore, 0);

    // Een foutloze doorloop verdient de hoogste badge, en die drempel blijft
    // proportioneel streng (meegeschaald met het nieuwe maximum).
    assert.ok(badges[0].minScore <= maxScore);
    assert.ok(badges[0].minScore >= maxScore * 0.85);
    assert.ok(badges[1].minScore >= maxScore * 0.5);
});

test('Cloud Commander maakt van elk checkpunt een echte poort', () => {
    // Elke stap heeft een checkpunt, en de engine laat de stap pas door bij een
    // goed antwoord. Zonder deze pin kan een stap stil terugvallen op alleen
    // afvinken.
    assert.equal(verificationQuestions.length, cloudCommanderConfig.steps.length);

    for (const question of verificationQuestions) {
        assert.ok(question.options.length >= 3);
        assert.ok(Number.isInteger(question.correctIndex));
        assert.ok(question.correctIndex >= 0 && question.correctIndex < question.options.length);
        assert.ok(question.explanation.trim().length > 0);
        assert.equal(new Set(question.options).size, question.options.length);
    }

    assert.match(toolGuideSource, /const questionPassed = !step\.verificationQuestion \|\| !!isCorrect;/);
    assert.match(toolGuideSource, /const canProceed = allChecked && questionPassed && teacherApproved;/);
    assert.match(
        toolGuideSource,
        /!!state\.verificationSubmitted\[step\.id\] &&\s*state\.verificationAnswers\[step\.id\] === step\.verificationQuestion\.correctIndex/s,
    );
});

test('Cloud Commander laat een leerling na foutfeedback opnieuw kiezen', () => {
    assert.ok(verificationQuestions.length > 0);
    assert.ok(verificationQuestions.every((question) => /Kies|kies/.test(question.retryHint ?? '')));

    // `allowRetry` is een historisch veld: staat het er nog, dan mag het nooit
    // als "geen herkansing" bedoeld zijn.
    assert.ok(
        verificationQuestions.every(
            (question) => question.allowRetry === undefined || question.allowRetry === true,
        ),
    );

    // Herkansen hangt niet meer aan een configvlag — de engine leest die niet
    // eens meer. De uitweg staat er dus altijd, ook bij een config zonder vlag.
    assert.doesNotMatch(toolGuideSource, /step\.verificationQuestion!?\.allowRetry/);
    assert.match(toolGuideSource, /Opnieuw kiezen/);
    assert.match(
        toolGuideSource,
        /\{!isCorrect && \(\s*<button\s*onClick=\{\(\) => onRetryAnswer\(step\.id\)\}/s,
    );

    // Herkansen zet de vraag echt terug: antwoord weg, inzending terug op false,
    // en tijdens een ingezonden antwoord kun je niets meer aanklikken.
    assert.match(toolGuideSource, /delete verificationAnswers\[stepId\];/);
    assert.match(toolGuideSource, /verificationSubmitted: \{ \.\.\.prev\.verificationSubmitted, \[stepId\]: false \}/);
    assert.match(toolGuideSource, /disabled=\{verificationSubmitted\}/);
    assert.match(toolGuideSource, /!verificationSubmitted && onSelectAnswer\(step\.id, i\)/);
});

test('Cloud Commander laat de kennisbonus dalen per herkansing zonder oude saves te straffen', () => {
    const questionBonus = engineConstant('QUESTION_BONUS');
    const retryPenalty = engineConstant('RETRY_PENALTY');
    const minQuestionBonus = engineConstant('MIN_QUESTION_BONUS');

    assert.match(
        toolGuideSource,
        /return Math\.max\(MIN_QUESTION_BONUS, QUESTION_BONUS - retries \* RETRY_PENALTY\);/,
    );

    const bonusAfter = (retries: number) =>
        Math.max(minQuestionBonus, questionBonus - retries * retryPenalty);

    // Blijven doorklikken tot het goede antwoord eruit rolt mag niet dezelfde
    // bonus opleveren als het meteen goed hebben; de bodem houdt wie het na een
    // paar pogingen alsnog snapt uit de min.
    assert.deepEqual([bonusAfter(0), bonusAfter(1), bonusAfter(2), bonusAfter(3)], [5, 3, 1, 1]);

    // Elke herkansing telt precies één misser.
    assert.match(
        toolGuideSource,
        /verificationRetries: \{ \.\.\.retries, \[stepId\]: \(retries\[stepId\] \?\? 0\) \+ 1 \}/,
    );

    // Opslag van vóór deze telling heeft geen herkansingen en houdt de volle
    // bonus — de correctie werkt nooit terug op bestaand werk.
    assert.match(toolGuideSource, /verificationRetries\?: Record<string, number>;/);
    assert.match(toolGuideSource, /questionBonus\(state\.verificationRetries\?\.\[step\.id\] \?\? 0\)/);
    assert.match(
        toolGuideSource,
        /saved\.verificationRetries !== undefined && !isRecord\(saved\.verificationRetries\)/,
    );
});

test('Cloud Commander verbergt het juiste antwoord bij foutfeedback', () => {
    // Het juiste antwoord komt pas in beeld bij een goed antwoord. Zou het bij
    // een fout meelichten, dan is de poort met één extra klik te omzeilen.
    assert.match(
        toolGuideSource,
        /const revealCorrectAnswer = Boolean\(\s*verificationSubmitted &&\s*i === step\.verificationQuestion!\.correctIndex &&\s*isCorrect\s*\)/s,
    );
    assert.match(toolGuideSource, /if \(revealCorrectAnswer\)/);
    assert.match(toolGuideSource, /revealCorrectAnswer\s*\?\s*'bg-duck-ink border-duck-ink'/s);
    assert.match(toolGuideSource, /revealCorrectAnswer \|\|\s*selected/s);

    // Bij een fout krijgt de leerling de hint, niet de uitleg met het antwoord.
    assert.match(
        toolGuideSource,
        /\? isCorrect\s*\? step\.verificationQuestion\.explanation\s*: step\.verificationQuestion\.retryHint/s,
    );

    // En de hint zelf mag het juiste antwoord niet letterlijk weggeven.
    for (const question of verificationQuestions) {
        const correctOption = question.options[question.correctIndex];
        assert.ok(
            !(question.retryHint ?? '').includes(correctOption),
            `retryHint verklapt het juiste antwoord: ${correctOption}`,
        );
    }

    assert.match(toolGuideSource, /aria-pressed=\{verificationAnswer === i\}/);
    assert.match(toolGuideSource, /role="status"/);
    assert.match(toolGuideSource, /aria-live="polite"/);
    assert.match(toolGuideSource, /aria-atomic="true"/);
});

test('ToolGuide houdt missiecontrols minimaal 44px hoog', () => {
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
    // De herkansknop is nu een vaste uitweg en moet dezelfde raakhoogte hebben.
    assert.match(buttonBlockAround(toolGuideSource, 'onRetryAnswer(step.id)'), /w-full min-h-11/);
    assert.match(buttonBlockAround(toolGuideSource, 'onClick={onBack}'), /min-h-11 min-w-11/);

    const phaseBackButton = buttonBlockAround(phaseHeaderSource, 'aria-label="Terug"');
    assert.match(phaseBackButton, /min-h-\[44px\]/);
    assert.match(phaseBackButton, /min-w-\[44px\]/);
});

test('ToolGuide toont nadruk in tips zonder letterlijke markdownsterretjes', () => {
    const shareStep = cloudCommanderConfig.steps.find((step) => step.id === 'stap-4-delen');

    assert.match(shareStep?.tip ?? '', /\*\*Bekijken\*\*/);
    assert.match(toolGuideSource, /<RichText text=\{step\.tip\} \/>/);
    assert.match(toolGuideSource, /<RichText text=\{step\.instruction\} \/>/);
    // RichText knipt de sterretjes eraf in plaats van ze te tonen.
    assert.match(toolGuideSource, /part\.slice\(2, -2\)/);
});
