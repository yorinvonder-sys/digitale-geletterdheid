import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

function withoutComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '');
}

const previewSource = withoutComments(
  readFileSync('src/features/dev-tools/DevAvatarPreview.tsx', 'utf8'),
);

function requirePreviewSource(cue) {
  if (!previewSource.includes(cue)) {
    throw new Error(`DevAvatarPreview is missing cue: ${cue}`);
  }
}

const previewCardStart = previewSource.indexOf('const PreviewCard =');
const previewCardEnd = previewSource.indexOf('const DevAvatarPreview', previewCardStart);
if (previewCardStart === -1 || previewCardEnd === -1) {
  throw new Error('Could not isolate PreviewCard in DevAvatarPreview.tsx');
}

const previewCardBody = previewSource.slice(previewCardStart, previewCardEnd);
if (previewCardBody.includes('<AvatarViewer')) {
  throw new Error('PreviewCard renders an AvatarViewer thumbnail; cards must stay DOM-only');
}

const avatarViewerCount = previewSource.match(/<AvatarViewer\b/g)?.length ?? 0;
if (avatarViewerCount !== 1) {
  throw new Error(`DevAvatarPreview must render exactly one WebGL avatar, found ${avatarViewerCount}`);
}

[
  'getInitialPresetKey',
  'URLSearchParams',
  "searchParams.get('preset')",
  'handleSelectPreset',
  'window.history.replaceState',
  '<AvatarViewer config={selectedPreset.config} interactive={true} />',
  'BODY_PRESETS',
  "getItemsForSlot('baseModel', 'male')",
  "'body-slim-male'",
  'CLOTHING_PRESETS',
  "getItemsForSlot('shirtStyle', 'male')",
  "getItemsForSlot('pantsStyle', 'female')",
  'ACCESSORY_PRESETS',
  "getItemsForSlot('accessory', 'male')",
  'aria-pressed={selected}',
].forEach(requirePreviewSource);

function collectFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? collectFiles(path) : [path];
  });
}

const sourcePaths = collectFiles('src');
const forbidden2DPaths = sourcePaths.filter(path => /AvatarViewer2D|avatar.*2d/i.test(path));
if (forbidden2DPaths.length > 0) {
  throw new Error(`2D avatar renderer paths are still tracked: ${forbidden2DPaths.join(', ')}`);
}

const textSourcePaths = sourcePaths.filter(path => /\.(?:[cm]?[jt]sx?|md)$/i.test(path));
const forbidden2DReferences = textSourcePaths.filter(path => /AvatarViewer2D/.test(readFileSync(path, 'utf8')));
if (forbidden2DReferences.length > 0) {
  throw new Error(`2D avatar renderer references remain: ${forbidden2DReferences.join(', ')}`);
}

const profileReadme = readFileSync('src/features/profile/README.md', 'utf8');
if (/2D en 3D|AvatarViewer2D/i.test(profileReadme)) {
  throw new Error('Profile documentation still advertises a 2D avatar environment');
}

const avatarScene = withoutComments(
  readFileSync('src/features/profile/avatar/AvatarScene.tsx', 'utf8'),
);
const avatarViewer = withoutComments(
  readFileSync('src/features/profile/avatar/AvatarViewer.tsx', 'utf8'),
);
const avatarCatalog = withoutComments(readFileSync('src/config/avatarCatalog.ts', 'utf8'));
const normalizedScene = avatarScene.replace(/\s+/g, ' ');
const normalizedViewer = avatarViewer.replace(/\s+/g, ' ');

function numberConstant(name, contents) {
  const match = contents.match(new RegExp(`export const ${name} = (-?\\d+(?:\\.\\d+)?);`));
  if (!match) throw new Error(`Missing numeric avatar constant: ${name}`);
  return Number(match[1]);
}

function assertNumber(label, actual, expected) {
  if (Math.abs(actual - expected) > 1e-9) {
    throw new Error(`${label} drifted: expected ${expected}, received ${actual}`);
  }
}

const platformCenter = numberConstant('AVATAR_PLATFORM_CENTER_Y', avatarScene);
const platformThickness = numberConstant('AVATAR_PLATFORM_THICKNESS', avatarScene);
const humanFootBottom = numberConstant('AVATAR_HUMAN_FOOT_BOTTOM_Y', avatarViewer);
const clearance = numberConstant('AVATAR_GROUND_CLEARANCE_Y', avatarViewer);
assertNumber('Platform center', platformCenter, -0.15);
assertNumber('Platform thickness', platformThickness, 0.06);
assertNumber('Platform top', platformCenter + platformThickness / 2, -0.12);
assertNumber('Human boot bottom', humanFootBottom, 0.085);
assertNumber('Ground clearance', clearance, 0.005);
assertNumber('Human full-body root', -0.12 + clearance - humanFootBottom, -0.20);

const requiredSceneFormula =
  'export const AVATAR_PLATFORM_TOP_Y = AVATAR_PLATFORM_CENTER_Y + AVATAR_PLATFORM_THICKNESS / 2;';
if (!normalizedScene.includes(requiredSceneFormula)) {
  throw new Error('Platform top no longer derives from its center and thickness');
}

const requiredShadowFormula =
  'export const AVATAR_CONTACT_SHADOW_Y = AVATAR_PLATFORM_TOP_Y - 0.01;';
if (!normalizedScene.includes(requiredShadowFormula)) {
  throw new Error('Contact shadow no longer derives from the platform top');
}
[
  'position={[0, AVATAR_PLATFORM_CENTER_Y, 0]}',
  '<boxGeometry args={[2.4, 2.4, AVATAR_PLATFORM_THICKNESS]} />',
  'position={[0, AVATAR_CONTACT_SHADOW_Y, 0]}',
].forEach(cue => {
  if (!normalizedScene.includes(cue)) {
    throw new Error(`Avatar scene no longer uses its platform contract: ${cue}`);
  }
});

const requiredHumanFormula =
  'export const AVATAR_FULL_BODY_ROOT_Y = AVATAR_PLATFORM_TOP_Y + AVATAR_GROUND_CLEARANCE_Y - AVATAR_HUMAN_FOOT_BOTTOM_Y;';
if (!normalizedViewer.includes("import { AvatarScene, AVATAR_PLATFORM_TOP_Y } from './AvatarScene';")) {
  throw new Error('Avatar viewer no longer imports the shared platform-top constant');
}
if (!normalizedViewer.includes(requiredHumanFormula)) {
  throw new Error('Human root expression drifted from the reviewed geometry formula');
}
if (!normalizedViewer.includes("variant === 'head' ? -1.5 : AVATAR_FULL_BODY_ROOT_Y")) {
  throw new Error('Full-body renderer no longer uses the derived human root');
}

const petMapMatch = avatarViewer.match(
  /export const AVATAR_PET_FOOT_BOTTOM_Y:[\s\S]*?= \{([\s\S]*?)\};/,
);
if (!petMapMatch) throw new Error('Missing per-pet foot-bottom map');

const expectedPetFeet = {
  pet_cat: 0.10,
  pet_dog: 0.10,
  pet_duck: 0.115,
  pet_robo: 0.095,
};
for (const [pet, expected] of Object.entries(expectedPetFeet)) {
  const match = petMapMatch[1].match(new RegExp(`${pet}:\\s*(-?\\d+(?:\\.\\d+)?)`));
  if (!match) throw new Error(`Missing foot-bottom geometry for ${pet}`);
  assertNumber(`${pet} foot bottom`, Number(match[1]), expected);
}

const requiredPetFormula =
  'export const getAvatarPetCompensationY = (pet: AvatarPet): number => AVATAR_PLATFORM_TOP_Y + AVATAR_GROUND_CLEARANCE_Y - AVATAR_PET_FOOT_BOTTOM_Y[pet] - AVATAR_FULL_BODY_ROOT_Y;';
if (!normalizedViewer.includes(requiredPetFormula)) {
  throw new Error('Pet compensation expression drifted from the per-pet geometry formula');
}
if (!normalizedViewer.includes('position={[0, getAvatarPetCompensationY(config.pet), 0]}')) {
  throw new Error('Companion renderer does not use its per-pet ground anchor');
}
if (normalizedViewer.includes("variant === 'head' ? -1.5 : -0.56")) {
  throw new Error('Legacy sinking body offset is still present');
}

function readStringField(block, field) {
  return block.match(new RegExp(`\\b${field}:\\s*'([^']+)'`))?.[1];
}

function readNumberField(block, field) {
  const raw = block.match(new RegExp(`\\b${field}:\\s*(-?\\d+(?:\\.\\d+)?)`))?.[1];
  return raw === undefined ? undefined : Number(raw);
}

const catalogItems = (avatarCatalog.match(/\{[^{}]*\}/gs) ?? [])
  .map(block => ({
    slot: readStringField(block, 'slot'),
    value: readStringField(block, 'value'),
    price: readNumberField(block, 'price'),
  }))
  .filter(item => item.slot && item.value && item.price !== undefined);

const paidCosmetics = catalogItems.filter(item =>
  ['shirtStyle', 'pantsStyle', 'accessory'].includes(item.slot) && item.price > 0,
);
if (paidCosmetics.length < 54) {
  throw new Error(`Paid avatar catalog parser failed closed: expected at least 54 values, found ${paidCosmetics.length}`);
}

const petItems = catalogItems.filter(item => item.slot === 'pet' && item.value !== 'none');
if (petItems.length < 4) {
  throw new Error(`Pet catalog parser failed closed: expected at least 4 values, found ${petItems.length}`);
}

const shirtMapStart = avatarViewer.indexOf('export const SHIRT_SILHOUETTES');
const shirtMapEnd = avatarViewer.indexOf('export const getShirtSilhouette', shirtMapStart);
if (shirtMapStart === -1 || shirtMapEnd === -1) throw new Error('Could not isolate shirt silhouette map');
const shirtMap = avatarViewer.slice(shirtMapStart, shirtMapEnd);
const shirtMapValues = new Set(
  [...shirtMap.matchAll(/^\s*(?:'([^']+)'|([a-z][a-z0-9_]*)):\s*\[/gm)]
    .map(match => match[1] ?? match[2]),
);
const shirtOverlayStart = avatarViewer.indexOf('export const ShirtOverlay');
const legsSectionStart = avatarViewer.indexOf('export const LegsSection', shirtOverlayStart);
const accessoryLayerStart = avatarViewer.indexOf('export const AccessoryLayer', legsSectionStart);
const avatarModelStart = avatarViewer.indexOf('const AvatarModel', accessoryLayerStart);
if ([shirtOverlayStart, legsSectionStart, accessoryLayerStart, avatarModelStart].includes(-1)) {
  throw new Error('Could not isolate avatar renderer sections');
}
const shirtOverlay = avatarViewer.slice(shirtOverlayStart, legsSectionStart);
const accessoryLayer = avatarViewer.slice(accessoryLayerStart, avatarModelStart);
const normalizedLegsSection = avatarViewer
  .slice(legsSectionStart, accessoryLayerStart)
  .replace(/\s+/g, ' ');
const shirtOverlayCaseValues = new Set(
  [...shirtOverlay.matchAll(/case '([^']+)':/g)].map(match => match[1]),
);
const accessoryCaseValues = new Set(
  [...accessoryLayer.matchAll(/case '([^']+)':/g)].map(match => match[1]),
);

for (const item of paidCosmetics) {
  if (item.slot === 'shirtStyle') {
    if (!shirtMapValues.has(item.value) || !shirtOverlayCaseValues.has(item.value)) {
      throw new Error(`Paid shirt lacks a silhouette or overlay case: ${item.value}`);
    }
  } else if (item.slot === 'pantsStyle') {
    const hasPantsCue = normalizedLegsSection.includes(`case '${item.value}':`)
      || normalizedLegsSection.includes(`style === '${item.value}'`);
    if (!hasPantsCue) throw new Error(`Paid pants value lacks a renderer branch: ${item.value}`);
  } else if (!accessoryCaseValues.has(item.value)) {
    throw new Error(`Paid accessory value lacks an explicit renderer case: ${item.value}`);
  }
}

for (const item of petItems) {
  if (!accessoryCaseValues.has(item.value)) {
    throw new Error(`Catalog pet lacks an explicit renderer case: ${item.value}`);
  }
}

console.log(
  `Dev avatar preview contract OK: 3D-only, one canvas, ${paidCosmetics.length} paid values, ${petItems.length} pets, exact human/pet grounding, and accessible QA presets.`,
);
