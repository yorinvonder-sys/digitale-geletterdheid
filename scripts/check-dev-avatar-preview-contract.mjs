import { readFileSync } from 'node:fs';

const source = readFileSync('src/features/dev-tools/DevAvatarPreview.tsx', 'utf8');

function requireSource(cue) {
  if (!source.includes(cue)) {
    throw new Error(`DevAvatarPreview is missing cue: ${cue}`);
  }
}

const previewCardStart = source.indexOf('const PreviewCard =');
const previewCardEnd = source.indexOf('const DevAvatarPreview', previewCardStart);
if (previewCardStart === -1 || previewCardEnd === -1) {
  throw new Error('Could not isolate PreviewCard in DevAvatarPreview.tsx');
}

const previewCardBody = source.slice(previewCardStart, previewCardEnd);
// Thumbnails moeten DOM-only blijven: 25+ WebGL-contexten naast elkaar loopt vast.
if (previewCardBody.includes('<AvatarViewer')) {
  throw new Error('PreviewCard still renders an AvatarViewer thumbnail; keep thumbnails DOM-only to avoid WebGL context loss');
}

requireSource('getInitialPresetKey');
requireSource('URLSearchParams');
requireSource("searchParams.get('preset')");
requireSource('handleSelectPreset');
requireSource('window.history.replaceState');
requireSource('<AvatarViewer config={selectedPreset.config} interactive={true} />');

console.log('Dev avatar preview contract OK: query preset support and DOM-only thumbnails.');
