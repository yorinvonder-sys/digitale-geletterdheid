import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const base = '../../src/features/developer/';
const paths = {
  academy: new URL(`${base}DeveloperCodeAcademy.tsx`, import.meta.url),
  content: new URL(`${base}code-academy/academyContent.ts`, import.meta.url),
  fundament: new URL(`${base}code-academy/content/fundament.ts`, import.meta.url),
  react: new URL(`${base}code-academy/content/react.ts`, import.meta.url),
  data: new URL(`${base}code-academy/content/data.ts`, import.meta.url),
  review: new URL(`${base}code-academy/content/review.ts`, import.meta.url),
  visual: new URL(`${base}code-academy/AcademyVisual.tsx`, import.meta.url),
  architectureMap: new URL(`${base}code-academy/AcademyArchitectureMap.tsx`, import.meta.url),
  overview: new URL(`${base}code-academy/AcademyOverview.tsx`, import.meta.url),
  lessonView: new URL(`${base}code-academy/AcademyLessonView.tsx`, import.meta.url),
  progress: new URL(`${base}code-academy/progress.ts`, import.meta.url),
  docs: new URL(`${base}DeveloperDocsViewer.tsx`, import.meta.url),
};

const sources = Object.fromEntries(
  await Promise.all(Object.entries(paths).map(async ([key, path]) => [key, await readFile(path, 'utf8')]))
);
const allContent = [sources.fundament, sources.react, sources.data, sources.review].join('\n');

const requiredLessonIds = [
  'main-entry',
  'app-shell',
  'router',
  'authenticated-app',
  'folder-map',
  'component-tree',
  'react-component',
  'props',
  'state',
  'effects',
  'events',
  'conditional-rendering',
  'typescript-types',
  'service-layer',
  'supabase-read',
  'supabase-write',
  'auth-session',
  'loading-errors',
  'student-dashboard',
  'mission-builder',
  'mission-card-flow',
  'permissions-locks',
  'pull-request-review',
  'quality-gates',
];

const requiredTrackIds = ['fundament', 'react', 'data', 'review'];
const richFieldPatterns = [
  /\n    objective:/g,
  /\n    durationMinutes:/g,
  /\n    explanation: \[/g,
  /\n    concepts: \[/g,
  /\n    dataFlow: \[/g,
  /\n    pitfalls: \[/g,
  /\n    practice: \{/g,
  /\n    aiPrompt:/g,
  /\n    quiz: \{/g,
  /\n    visual: \{/g,
];

test('Code Academie bevat 24 unieke lessen verdeeld over vier routes', () => {
  for (const lessonId of requiredLessonIds) {
    assert.match(allContent, new RegExp(`id: '${lessonId}'`));
  }
  for (const trackId of requiredTrackIds) {
    assert.match(sources.content, new RegExp(`id: '${trackId}'`));
  }

  assert.equal((allContent.match(/number: \d+,/g) ?? []).length, 24);
  assert.equal(new Set(requiredLessonIds).size, 24);
});

test('elke les bevat rijke uitleg, code, data en een oefening', () => {
  for (const pattern of richFieldPatterns) {
    assert.equal(
      (allContent.match(pattern) ?? []).length,
      24,
      `verwacht 24 treffers voor ${pattern}`
    );
  }
});

test('visualisaties ondersteunen meerdere leerrepresentaties', () => {
  for (const kind of ['flow', 'tree', 'layers', 'data', 'comparison', 'cycle']) {
    assert.match(allContent, new RegExp(`kind: '${kind}'`));
  }
  assert.match(sources.visual, /function FlowVisual/);
  assert.match(sources.visual, /function TreeVisual/);
  assert.match(sources.visual, /function LayersVisual/);
  assert.match(sources.visual, /function DataVisual/);
  assert.match(sources.visual, /function ComparisonVisual/);
  assert.match(sources.visual, /function CycleVisual/);
});

test('overzicht toont afgeleide leerdata en aanbevolen volgende les', () => {
  assert.match(sources.overview, /completionPercentage/);
  assert.match(sources.overview, /remainingMinutes/);
  assert.match(sources.overview, /recommendedLesson/);
  assert.match(sources.overview, /AcademyArchitectureMap/);
  assert.doesNotMatch(sources.overview, /Math\.random/);
});

test('overzicht doseert de 24 lessen met toegankelijke route-accordions', () => {
  assert.match(sources.overview, /expandedTrack/);
  assert.match(sources.overview, /aria-expanded/);
  assert.match(sources.overview, /Toon \$\{trackLessons\.length\} lessen/);
  assert.match(sources.overview, /Verberg lessen/);
});

test('architectuurkaart blijft op mobiel compact en horizontaal navigeerbaar', () => {
  assert.match(sources.architectureMap, /overflow-x-auto/);
  assert.match(sources.architectureMap, /snap-x/);
  assert.match(sources.architectureMap, /Veeg horizontaal/);
});

test('mobiele lesweergave voorkomt afgekapte code en datatabellen', () => {
  assert.match(sources.lessonView, /whitespace-pre-wrap/);
  assert.match(sources.lessonView, /sm:whitespace-pre/);
  assert.match(sources.lessonView, /md:hidden/);
  assert.match(sources.lessonView, /hidden[^'\n]*md:block/);
  assert.match(sources.lessonView, /Van → Naar/);
});

test('lesweergave maakt de leerfasen expliciet', () => {
  assert.match(sources.lessonView, /1\. Begrijpen/);
  assert.match(sources.lessonView, /2\. Verdiepen/);
  assert.match(sources.lessonView, /3\. Oefenen/);
});

test('voortgang blijft lokaal, migreert v1 en gebruikt geen Supabase', () => {
  assert.match(sources.progress, /dgskills-code-academy-progress-v2/);
  assert.match(sources.progress, /dgskills-code-academy-progress-v1/);
  assert.match(sources.progress, /window\.localStorage/);
  assert.match(sources.progress, /migrateLegacyProgress/);
  assert.doesNotMatch(sources.progress, /supabase/i);
  assert.doesNotMatch(sources.academy, /supabase/i);
});

test('hoofdcomponent is een compacte orchestrator en de integratie blijft bestaan', () => {
  assert.match(sources.academy, /ACADEMY_LESSONS/);
  assert.match(sources.academy, /AcademyOverview/);
  assert.match(sources.academy, /AcademyLessonView/);
  assert.ok(sources.academy.split('\n').length < 180, 'DeveloperCodeAcademy.tsx hoort compact te blijven');
  assert.match(sources.docs, /DeveloperCodeAcademy/);
  assert.match(sources.docs, /Code Academie/);
  assert.match(sources.docs, /Interne documenten/);
});

test('lesweergave bevat code, begrippen, datareis, risico en AI-prompt', () => {
  assert.match(sources.lessonView, /Begrippen/);
  assert.match(sources.lessonView, /Datareis/);
  assert.match(sources.lessonView, /Wat kan misgaan/);
  assert.match(sources.lessonView, /Praktijkcontrole/);
  assert.match(sources.lessonView, /Prompt voor AI/);
  assert.match(sources.lessonView, /Kennischeck/);
});
