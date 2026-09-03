import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import startupPitchConfig from '../src/features/missions/templates/tool-guide/configs/startup-pitch.ts';

const toolGuideSource = readFileSync(
    new URL('../src/features/missions/templates/tool-guide/ToolGuide.tsx', import.meta.url),
    'utf8',
);

const engineConstant = (name: string): number => {
    const match = toolGuideSource.match(new RegExp(`const ${name} = (\\d+);`));
    assert.ok(match, `engine-constante ontbreekt: ${name}`);
    return Number(match![1]);
};

test('Startup Pitch heeft op elke stap een checkpunt als poort', () => {
    assert.equal(startupPitchConfig.steps.length, 4);
    for (const step of startupPitchConfig.steps) {
        const question = step.verificationQuestion;
        assert.ok(question, `stap zonder checkpunt: ${step.id}`);
        assert.ok(question.options.length >= 3, `te weinig opties: ${step.id}`);
        assert.equal(new Set(question.options).size, question.options.length, `dubbele opties: ${step.id}`);
        assert.ok(
            question.correctIndex >= 0 && question.correctIndex < question.options.length,
            `ongeldige correctIndex: ${step.id}`,
        );
        assert.ok(question.explanation.length > 0, `lege uitleg: ${step.id}`);
        assert.ok((question.retryHint ?? '').length > 0, `ontbrekende retryHint: ${step.id}`);
    }
});

test('Startup Pitch maxScore is het haalbare maximum uit de config zelf', () => {
    const checklistPoints = engineConstant('CHECKLIST_POINTS_PER_STEP');
    const questionBonus = engineConstant('QUESTION_BONUS');
    const questions = startupPitchConfig.steps.filter((step) => step.verificationQuestion).length;
    const haalbaar = startupPitchConfig.steps.length * checklistPoints + questions * questionBonus;
    assert.equal(haalbaar, 60);
    assert.equal(startupPitchConfig.maxScore, haalbaar);
});

test('Startup Pitch badge-drempels blijven haalbaar en aflopend', () => {
    const minScores = startupPitchConfig.badges.map((badge) => badge.minScore);
    for (const minScore of minScores) {
        assert.ok(minScore >= 0 && minScore <= startupPitchConfig.maxScore);
    }
    for (let i = 1; i < minScores.length; i++) {
        assert.ok(minScores[i] < minScores[i - 1], 'badge-drempels moeten strikt aflopen');
    }
    assert.equal(minScores[minScores.length - 1], 0, 'laagste badge moet altijd haalbaar zijn');
});

test('Startup Pitch retryHints verklappen het juiste antwoord niet', () => {
    // De hint mag naar de plek of handeling wijzen, maar niet het onderscheidende
    // criterium van de juiste optie benoemen — anders is de poort met de hint
    // alleen al te openen, zonder het eigen werk te bekijken.
    const verboden: Record<string, RegExp[]> = {
        'stap-1-probleem': [/voor wie/i, /allebei/i, /twee onderdelen/i],
        'stap-2-oplossing': [/AI (zelf|zélf)/i, /werkwoord.*AI/i],
        'stap-3-branding': [/zes woorden/i, /6 woorden/i, /kern van (jouw|je) startup/i],
        'stap-4-ethiek': [/uitvoerbaar/i, /handeling die je (echt )?kunt uitvoeren/i],
    };
    for (const step of startupPitchConfig.steps) {
        const question = step.verificationQuestion;
        assert.ok(question);
        const hint = question.retryHint ?? '';
        const correcte = question.options[question.correctIndex];
        assert.ok(!hint.includes(correcte), `retryHint bevat de juiste optie letterlijk: ${step.id}`);
        for (const patroon of verboden[step.id] ?? []) {
            assert.ok(!patroon.test(hint), `retryHint verklapt het criterium (${patroon}): ${step.id}`);
        }
    }
});

test('Startup Pitch vragen keuren alleen onaf werk af, geen geldige varianten', () => {
    const probleem = startupPitchConfig.steps.find((step) => step.id === 'stap-1-probleem')?.verificationQuestion;
    assert.ok(probleem);
    // De juiste optie eist beide onderdelen die de instructie zelf als losse
    // opdrachten noemt — niet dat ze in dezelfde zin staan.
    assert.match(probleem.options[probleem.correctIndex], /wát er misgaat/);
    assert.match(probleem.options[probleem.correctIndex], /voor wie/);
    assert.doesNotMatch(probleem.options[probleem.correctIndex], /zelfde zin|in één zin/i);

    const slogan = startupPitchConfig.steps.find((step) => step.id === 'stap-3-branding')?.verificationQuestion;
    assert.ok(slogan);
    // Toetst de eisen uit de instructie (max 6 woorden, eigenheid), geen
    // subjectieve weglaat-test die goed werk fout kan rekenen.
    assert.match(slogan.question, /Tel de woorden/);
    assert.match(slogan.options[slogan.correctIndex], /Maximaal 6 woorden/);
});
