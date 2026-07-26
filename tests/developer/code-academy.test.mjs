import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const academyPath = new URL('../../src/features/developer/DeveloperCodeAcademy.tsx', import.meta.url);
const docsPath = new URL('../../src/features/developer/DeveloperDocsViewer.tsx', import.meta.url);

const academySource = await readFile(academyPath, 'utf8');
const docsSource = await readFile(docsPath, 'utf8');

const requiredLessonIds = [
  'main',
  'app',
  'router',
  'authenticated-app',
  'dashboard',
  'card',
  'props-data',
  'ai-review',
];

test('Code Academie bevat alle acht opeenvolgende lessen', () => {
  for (const lessonId of requiredLessonIds) {
    assert.match(academySource, new RegExp(`id: '${lessonId}'`));
  }

  assert.equal((academySource.match(/number: \d,/g) ?? []).length, 8);
});

test('elke les heeft een controlevraag en visuele stappen', () => {
  assert.equal((academySource.match(/quiz: \{/g) ?? []).length, 8);
  assert.equal((academySource.match(/steps: \[/g) ?? []).length, 8);
  assert.match(academySource, /function FlowVisual/);
});

test('voortgang blijft lokaal en introduceert geen database-opslag', () => {
  assert.match(academySource, /window\.localStorage/);
  assert.doesNotMatch(academySource, /supabase/);
});

test('de academie is geïntegreerd in de developer-documentenomgeving', () => {
  assert.match(docsSource, /DeveloperCodeAcademy/);
  assert.match(docsSource, /Code Academie/);
  assert.match(docsSource, /Interne documenten/);
});
