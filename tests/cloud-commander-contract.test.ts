import assert from 'node:assert/strict';
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
    assert.equal(question.options[question.correctIndex], 'Specifieke personen mogen bekijken');
    assert.match(question.explanation, /beperk je de toegang/);
});
