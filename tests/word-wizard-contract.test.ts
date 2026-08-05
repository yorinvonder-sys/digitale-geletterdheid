import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
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

test('Word Wizard-leerdoel past bij voorbereiden en uitleggen in plaats van zelf toevoegen', () => {
    const contentsObjective = wordWizardConfig.learningObjectives[3];
    const saveQuestion = wordWizardConfig.steps
        .find((step) => step.id === 'stap-1-nieuw-document')
        ?.verificationQuestion;

    assert.match(contentsObjective, /bereidt.*Kop 1 en Kop 2.*voor/i);
    assert.match(contentsObjective, /legt uit/i);
    assert.doesNotMatch(contentsObjective, /voegt.*toe/i);
    assert.doesNotMatch(contentsObjective, /werkt.*bij/i);
    assert.match(saveQuestion?.explanation ?? '', /kans kleiner dat je werk verliest/i);
    assert.doesNotMatch(saveQuestion?.explanation ?? '', /nooit je werk/i);
});

test('Word Wizard scorecontract blijft exact 55 punten', () => {
    const questionCount = wordWizardConfig.steps.filter(
        (step) => step.verificationQuestion !== undefined,
    ).length;
    const engineMaximum = wordWizardConfig.steps.length * 10 + questionCount * 5;

    assert.equal(wordWizardConfig.maxScore, engineMaximum);
    assert.equal(engineMaximum, 55);
});
