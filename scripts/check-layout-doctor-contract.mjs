import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

const simulator = read('src/features/word-simulator/WordSimulator.tsx');
const dashboard = read('src/features/student/ProjectZeroDashboard.tsx');

assert.match(
  simulator,
  /data-layout-doctor-toc="true"/,
  'TOC must carry an explicit structural layout-doctor marker',
);

assert.match(
  simulator,
  /label\.textContent\s*=\s*h1\.textContent\s*\|\|\s*''/,
  'Learner-controlled heading text must enter the TOC as textContent',
);

assert.match(
  simulator,
  /DOMPurify\.sanitize\(tocContainer\.outerHTML[\s\S]*?document\.execCommand\('insertHTML', false, safeToc\)/,
  'The serialized TOC must be sanitized before insertHTML',
);

assert.doesNotMatch(
  simulator,
  /\$\{h1\.(?:innerHTML|innerText|textContent)\}/,
  'Learner-controlled heading content must not be interpolated into TOC HTML',
);

assert.match(
  simulator,
  /const toc = doc\.querySelector\(LAYOUT_DOCTOR_TOC_SELECTOR\);[\s\S]*?return Boolean\(toc && hasTocTitle && hasTocEntry\);/,
  'TOC completion must require the generated structural marker and structure',
);

assert.doesNotMatch(
  simulator,
  /content\.includes\(['"]Inhoudsopgave['"]\)/,
  'TOC completion must not accept arbitrary Inhoudsopgave text',
);

assert.match(
  dashboard,
  /id: 'layout-doctor'[\s\S]*?sloKerndoelen: \['21A', '22A'\]/,
  'Layout Doctor dashboard metadata must use canonical SLO codes 21A and 22A',
);

console.log('Layout Doctor contract checks passed');
