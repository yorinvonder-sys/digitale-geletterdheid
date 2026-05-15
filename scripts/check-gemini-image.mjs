import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  buildGeminiImageRequest,
  extractInlineImage,
  GEMINI_IMAGE_MODELS,
  isGeneratedImageDataUrl,
} from '../src/services/geminiImageLogic.ts';

assert.deepEqual(
  GEMINI_IMAGE_MODELS,
  ['gemini-3.1-flash-image-preview', 'gemini-2.5-flash-image'],
  'image generation should try Nano Banana 2 first and original Nano Banana as fallback',
);

const request = buildGeminiImageRequest('Teken een vrolijke golden retriever puppy in een zonnig park.', 'general', '4:3');
assert.deepEqual(
  request.generationConfig.responseModalities,
  ['TEXT', 'IMAGE'],
  'Gemini image generation must request an actual image modality',
);
assert.match(
  request.contents[0].parts[0].text,
  /Geen tekst of watermerk/i,
  'image prompt should keep the child-safe no-text/no-watermark instruction',
);

const camelPayload = {
  candidates: [{
    content: {
      parts: [
        { text: 'Hier is je afbeelding.' },
        { inlineData: { data: 'abc123', mimeType: 'image/png' } },
      ],
    },
  }],
};
assert.deepEqual(
  extractInlineImage(camelPayload),
  { imageBase64: 'abc123', mimeType: 'image/png', partCount: 2 },
  'inlineData payloads should be parsed as real generated images',
);

const snakePayload = {
  candidates: [{
    content: {
      parts: [
        { inline_data: { data: 'def456', mime_type: 'image/webp' } },
      ],
    },
  }],
};
assert.deepEqual(
  extractInlineImage(snakePayload),
  { imageBase64: 'def456', mimeType: 'image/webp', partCount: 1 },
  'inline_data payloads should also be parsed',
);

assert.equal(isGeneratedImageDataUrl('data:image/png;base64,abc123'), true, 'image data URLs are real generated images');
assert.equal(isGeneratedImageDataUrl('data:text/plain;base64,abc123'), false, 'text data URLs are not generated images');
assert.equal(isGeneratedImageDataUrl('/assets/agents/prompt_master.webp'), false, 'static assets are not generated images');
assert.equal(isGeneratedImageDataUrl('error:timeout'), false, 'error strings are not generated images');

const missionSource = await readFile(new URL('../src/features/missions/PromptMasterMission.tsx', import.meta.url), 'utf8');
assert.match(missionSource, /90_000/, 'image generation timeout should allow real Gemini images enough time');
assert.match(missionSource, /isGeneratedImageDataUrl/, 'mission should only render generated image data URLs as student output');
assert.match(missionSource, /generatedIdealImageUrl/, 'failed image challenges should support a generated ideal image URL');
assert.match(missionSource, /isGeneratingIdealImage/, 'ideal image generation should expose a loading state');
assert.match(
  missionSource,
  /Gemini Nano Banana maakt het ideale voorbeeld/,
  'ideal image card should show a clear loading state while Gemini generates it',
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

console.log('Gemini image checks passed');
