import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  'ipad-portrait': { width: 820, height: 1180 },
  'ipad-landscape': { width: 1180, height: 820 },
  mobile: { width: 390, height: 844 },
};

const REQUIRED_CHECKPOINTS = [
  'intro',
  'normal-interaction',
  'deliberate-error',
  'recovery',
  'mid-flow',
  'end-state',
];

const EXPECTED_MISSIONS = {
  j1p2: [
    'prompt-master',
    'game-programmeur',
    'ai-trainer',
    'chatbot-trainer',
    'verhalen-ontwerper',
    'game-director',
    'ai-tekengame',
    'ai-beleid-brainstorm',
    'code-denker',
    'website-bouwer',
    'schermtijd-coach',
    'notificatie-ninja',
    'cloud-cleaner',
    'layout-doctor',
    'pitch-police',
    'review-week-2',
  ],
};

const args = process.argv.slice(2);
const valueAfter = (flag) => {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
};

const batch = valueAfter('--batch');
const productionSha = valueAfter('--sha');
const strict = args.includes('--strict');

if (!batch || !productionSha) {
  console.error('Usage: node scripts/mission-audit/build-evidence-manifest.mjs --batch j1p2 --sha <sha> [--evidence-root <path>] [--strict]');
  process.exit(2);
}

const commonGitDir = execFileSync('git', ['rev-parse', '--path-format=absolute', '--git-common-dir'], {
  encoding: 'utf8',
}).trim();
const repositoryRoot = path.dirname(commonGitDir);
const evidenceRoot = path.resolve(
  valueAfter('--evidence-root') || path.join(repositoryRoot, 'screenshots', 'mission-audit', 'batches', batch),
);
const expectedMissions = EXPECTED_MISSIONS[batch] || [];
if (expectedMissions.length === 0) {
  throw new Error(`Unsupported evidence batch: ${batch}`);
}
if (!/^[0-9a-f]{40}$/.test(productionSha)) {
  throw new Error('--sha must be a full 40-character lowercase Git SHA');
}
execFileSync('git', ['cat-file', '-e', `${productionSha}^{commit}`], { stdio: 'ignore' });

const readPngDimensions = (buffer) => {
  const signature = buffer.subarray(0, 8).toString('hex');
  if (signature !== '89504e470d0a1a0a' || buffer.subarray(12, 16).toString('ascii') !== 'IHDR') return null;
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
};

const readJpegDimensions = (buffer) => {
  if (buffer[0] !== 0xff || buffer[1] !== 0xd8) return null;
  let offset = 2;
  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) { offset += 1; continue; }
    const marker = buffer[offset + 1];
    const length = buffer.readUInt16BE(offset + 2);
    if (marker >= 0xc0 && marker <= 0xc3) {
      return { width: buffer.readUInt16BE(offset + 7), height: buffer.readUInt16BE(offset + 5) };
    }
    if (length < 2) break;
    offset += 2 + length;
  }
  return null;
};

const screenshotRecord = (filePath, requested) => {
  const buffer = readFileSync(filePath);
  const pngDimensions = readPngDimensions(buffer);
  const jpegDimensions = pngDimensions ? null : readJpegDimensions(buffer);
  const actual = pngDimensions || jpegDimensions;
  const formatStatus = pngDimensions ? 'png' : jpegDimensions ? 'jpeg-with-png-extension' : 'invalid';
  const inset = actual && requested ? requested.height - actual.height : null;
  const dimensionStatus = actual && requested && actual.width === requested.width && actual.height === requested.height
    ? 'exact'
    : actual && requested && actual.width === requested.width && inset >= 0 && inset <= 20
      ? 'browser-inset'
      : 'mismatch';

  return {
    file: path.relative(evidenceRoot, filePath),
    bytes: buffer.length,
    sha256: createHash('sha256').update(buffer).digest('hex'),
    actual,
    requested,
    formatStatus,
    dimensionStatus,
  };
};

const missionRecords = {};
const failures = [];

for (const missionId of expectedMissions) {
  const missionRoot = path.join(evidenceRoot, missionId, productionSha);
  const viewportRecords = {};

  for (const [viewport, requested] of Object.entries(VIEWPORTS)) {
    const viewportRoot = path.join(missionRoot, viewport);
    const capturePath = path.join(viewportRoot, 'capture.json');
    let capture = null;
    let captureError = null;
    if (existsSync(capturePath)) {
      try {
        capture = JSON.parse(readFileSync(capturePath, 'utf8'));
        const requestedMatches = capture?.requested?.width === requested.width && capture?.requested?.height === requested.height;
        if (
          capture?.schemaVersion !== 1 ||
          capture?.missionId !== missionId ||
          capture?.viewport !== viewport ||
          capture?.sourceSha !== productionSha ||
          capture?.sourceWorktreeClean !== true ||
          !requestedMatches ||
          !Array.isArray(capture?.checkpoints)
        ) {
          captureError = 'capture metadata failed provenance contract';
        }
      } catch {
        captureError = 'capture metadata is unreadable';
      }
    } else {
      captureError = 'capture.json missing';
    }
    const checkpointByFile = new Map(
      captureError ? [] : capture.checkpoints.map((checkpoint) => [checkpoint.file, checkpoint]),
    );
    const pngs = existsSync(viewportRoot)
      ? readdirSync(viewportRoot)
          .filter((name) => name.toLowerCase().endsWith('.png'))
          .sort()
          .map((name) => {
            const record = screenshotRecord(path.join(viewportRoot, name), requested);
            const checkpoint = checkpointByFile.get(name);
            return {
              ...record,
              checkpoint: checkpoint?.checkpoint ?? null,
              checkpointDescription: checkpoint?.description ?? null,
              provenanceStatus: captureError || !checkpoint ? 'invalid' : 'valid',
            };
          })
      : [];

    const invalidFormats = pngs.filter((record) => record.formatStatus !== 'png').length;
    const invalidDimensions = pngs.filter((record) => record.dimensionStatus === 'mismatch').length;
    const invalidCheckpointMetadata = pngs.filter((record) => record.provenanceStatus !== 'valid').length;
    const capturedCheckpoints = new Set(pngs.map((record) => record.checkpoint).filter(Boolean));
    const missingCheckpoints = REQUIRED_CHECKPOINTS.filter((checkpoint) => !capturedCheckpoints.has(checkpoint));
    const validPngCount = pngs.filter((record) => (
      record.formatStatus === 'png' &&
      record.dimensionStatus !== 'mismatch' &&
      record.provenanceStatus === 'valid'
    )).length;
    viewportRecords[viewport] = {
      requested,
      checkpointCount: pngs.length,
      validPngCount,
      formatValidPngCount: pngs.length - invalidFormats,
      invalidFormats,
      invalidDimensions,
      invalidCheckpointMetadata,
      missingCheckpoints,
      captureMetadata: captureError ? { status: 'invalid', error: captureError } : { status: 'valid', file: path.relative(evidenceRoot, capturePath) },
      status: validPngCount >= 6 && missingCheckpoints.length === 0 ? 'complete' : pngs.length > 0 ? 'partial' : 'missing',
      screenshots: pngs,
    };

    if (pngs.length < 6) failures.push(`${missionId}/${viewport}: ${pngs.length}/6 checkpoints`);
    if (invalidFormats > 0) failures.push(`${missionId}/${viewport}: ${invalidFormats} files are not PNG`);
    if (invalidDimensions > 0) failures.push(`${missionId}/${viewport}: ${invalidDimensions} dimension mismatches`);
    if (captureError) failures.push(`${missionId}/${viewport}: ${captureError}`);
    if (invalidCheckpointMetadata > 0) failures.push(`${missionId}/${viewport}: ${invalidCheckpointMetadata} PNG files lack valid checkpoint metadata`);
    if (missingCheckpoints.length > 0) failures.push(`${missionId}/${viewport}: missing semantic checkpoints ${missingCheckpoints.join(', ')}`);
  }

  const viewportStatuses = Object.values(viewportRecords).map((record) => record.status);
  missionRecords[missionId] = {
    sha: productionSha,
    status: viewportStatuses.every((status) => status === 'complete')
      ? 'complete'
      : viewportStatuses.every((status) => status === 'missing')
        ? 'missing'
        : 'partial',
    viewports: viewportRecords,
  };
}

const manifest = {
  schemaVersion: 2,
  generatedAt: new Date().toISOString(),
  batch,
  productionSha,
  evidenceRoot,
  requirements: {
    missions: expectedMissions.length,
    viewports: Object.keys(VIEWPORTS),
    minimumCheckpointsPerViewport: 6,
    requiredSemanticCheckpoints: REQUIRED_CHECKPOINTS,
    acceptedDimensions: 'exact viewport or same-width browser capture with 0-20px vertical inset',
  },
  status: failures.length === 0 ? 'complete' : 'partial',
  failures,
  missions: missionRecords,
};

mkdirSync(evidenceRoot, { recursive: true });
const outputPath = path.join(evidenceRoot, 'manifest.json');
writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, { mode: 0o644 });

console.log(`Evidence manifest: ${outputPath}`);
console.log(`Status: ${manifest.status}; open requirements: ${failures.length}`);

if (strict && failures.length > 0) process.exit(1);
