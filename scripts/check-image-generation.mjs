import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  buildImageGenerationPrompt,
  extractGeneratedImage,
  SUPPORTED_IMAGE_ASPECT_RATIOS,
  isGeneratedImageDataUrl,
} from '../src/services/imageGenerationLogic.ts';

assert.ok(SUPPORTED_IMAGE_ASPECT_RATIOS.includes('4:3'), 'image generation should support classroom-friendly 4:3 output');
assert.ok(SUPPORTED_IMAGE_ASPECT_RATIOS.includes('16:9'), 'image generation should support wide output');

const prompt = buildImageGenerationPrompt('Teken een vrolijke golden retriever puppy in een zonnig park.', 'general', '4:3');
assert.match(
  prompt,
  /Geen tekst of watermerk/i,
  'image prompt should keep the child-safe no-text/no-watermark instruction',
);
assert.match(prompt, /VEILIG VOOR KINDEREN/i, 'image prompt should keep the child-safe prefix');

assert.deepEqual(
  extractGeneratedImage({ imageBase64: 'abc123', mimeType: 'image/png' }),
  { imageBase64: 'abc123', mimeType: 'image/png', partCount: 1 },
  'server image payloads should be parsed as real generated images',
);

assert.deepEqual(
  extractGeneratedImage({}),
  { imageBase64: undefined, mimeType: 'image/png', partCount: 0 },
  'missing generated images should not be treated as successful output',
);

assert.equal(isGeneratedImageDataUrl('data:image/png;base64,abc123'), true, 'image data URLs are real generated images');
assert.equal(isGeneratedImageDataUrl('data:text/plain;base64,abc123'), false, 'text data URLs are not generated images');
assert.equal(isGeneratedImageDataUrl('/assets/agents/prompt_master.webp'), false, 'static assets are not generated images');
assert.equal(isGeneratedImageDataUrl('error:timeout'), false, 'error strings are not generated images');

const missionSource = await readFile(new URL('../src/features/missions/PromptMasterMission.tsx', import.meta.url), 'utf8');
assert.match(missionSource, /90_000/, 'image generation timeout should allow real BFL images enough time');
assert.match(missionSource, /isGeneratedImageDataUrl/, 'mission should only render generated image data URLs as student output');
assert.match(missionSource, /generatedIdealImageUrl/, 'failed image challenges should support a generated ideal image URL');
assert.match(missionSource, /isGeneratingIdealImage/, 'ideal image generation should expose a loading state');
assert.match(
  missionSource,
  /Black Forest Labs FLUX maakt het ideale voorbeeld/,
  'ideal image card should show a clear loading state while BFL generates it',
);
assert.match(
  missionSource,
  /formatLearnerImageError/,
  'provider image errors should be converted to a generic learner-safe message',
);
assert.equal(
  missionSource.includes("generatedImageResult.replace(/^error:/"),
  false,
  'student image errors should not expose raw provider details',
);
assert.equal(
  missionSource.includes('? imageError\n            ? imageError'),
  false,
  'rendered image errors should not expose persisted raw provider details',
);
assert.match(missionSource, /max-w-7xl/, 'result view should use a wider desktop layout for image comparison and feedback');
assert.equal(
  missionSource.includes('exampleImage={currentChallenge.exampleImage}'),
  false,
  'failed ideal image comparisons must not rely on the static mission example image',
);
assert.equal(
  missionSource.includes('Simulatie — zo zou de AI je prompt interpreteren'),
  false,
  'student image output must not present a fake SVG/CSS simulation as AI output',
);

console.log('Image generation checks passed');
