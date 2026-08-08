import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const args = process.argv.slice(2);
const valueAfter = (flag) => {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
};

const batch = valueAfter('--batch');
const productionSha = valueAfter('--sha');
if (!batch || !productionSha) {
  console.error('Usage: node scripts/mission-audit/build-contact-sheets.mjs --batch j1p2 --sha <sha>');
  process.exit(2);
}

const commonGitDir = execFileSync('git', ['rev-parse', '--path-format=absolute', '--git-common-dir'], {
  encoding: 'utf8',
}).trim();
const repositoryRoot = path.dirname(commonGitDir);
const evidenceRoot = path.join(repositoryRoot, 'screenshots', 'mission-audit', 'batches', batch);
const manifestPath = path.join(evidenceRoot, 'manifest.json');
if (!existsSync(manifestPath)) throw new Error(`Manifest ontbreekt: ${manifestPath}`);

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
if (manifest.schemaVersion !== 2 || manifest.batch !== batch || manifest.productionSha !== productionSha) {
  throw new Error('Manifestcontract komt niet overeen met batch en --sha.');
}

const escapeXml = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const cellWidth = 360;
const cellHeight = 250;
const imageWidth = 336;
const imageHeight = 190;
const columns = 2;
const headerHeight = 72;
const records = [];

for (const [missionId, mission] of Object.entries(manifest.missions || {})) {
  const screenshots = [];
  for (const [viewport, viewportRecord] of Object.entries(mission.viewports || {})) {
    for (const shot of viewportRecord.screenshots || []) {
      if (shot.formatStatus !== 'png' || shot.provenanceStatus !== 'valid' || shot.dimensionStatus === 'mismatch') continue;
      const absolute = path.join(evidenceRoot, shot.file);
      if (!existsSync(absolute)) throw new Error(`Manifestbron ontbreekt: ${shot.file}`);
      const current = readFileSync(absolute);
      const currentHash = createHash('sha256').update(current).digest('hex');
      if (currentHash !== shot.sha256) throw new Error(`Manifesthash verouderd: ${shot.file}`);
      const metadata = await sharp(current).metadata();
      if (metadata.width !== shot.actual?.width || metadata.height !== shot.actual?.height) {
        throw new Error(`Manifestafmetingen verouderd: ${shot.file}`);
      }
      screenshots.push({ ...shot, viewport, absolute });
    }
  }
  const outputPath = path.join(evidenceRoot, missionId, productionSha, 'contact-sheet.png');
  if (screenshots.length === 0) {
    if (existsSync(outputPath)) unlinkSync(outputPath);
    continue;
  }

  const rows = Math.ceil(screenshots.length / columns);
  const width = columns * cellWidth;
  const height = headerHeight + rows * cellHeight;
  const composites = [];

  for (const [index, shot] of screenshots.entries()) {
    const left = (index % columns) * cellWidth + 12;
    const top = headerHeight + Math.floor(index / columns) * cellHeight + 12;
    const thumbnail = await sharp(shot.absolute)
      .resize(imageWidth, imageHeight, { fit: 'contain', background: '#f2f1ec' })
      .png()
      .toBuffer();
    composites.push({ input: thumbnail, left, top });

    const label = `${shot.viewport} / ${path.basename(shot.file)} / ${shot.actual?.width ?? '?'}x${shot.actual?.height ?? '?'}`;
    const labelSvg = Buffer.from(`<svg width="${imageWidth}" height="36" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#ffffff"/>
      <text x="4" y="15" font-family="Arial, sans-serif" font-size="11" font-weight="700" fill="#202023">${escapeXml(label)}</text>
      <text x="4" y="30" font-family="monospace" font-size="9" fill="#5f5f5f">${escapeXml(shot.sha256.slice(0, 20))}</text>
    </svg>`);
    composites.push({ input: labelSvg, left, top: top + imageHeight + 4 });
  }

  const titleSvg = Buffer.from(`<svg width="${width}" height="${headerHeight}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#202023"/>
    <text x="20" y="31" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="#ffffff">${escapeXml(missionId)} contact sheet</text>
    <text x="20" y="54" font-family="monospace" font-size="11" fill="#e1ff01">${escapeXml(productionSha)} / ${screenshots.length} PNG checkpoints</text>
  </svg>`);
  composites.unshift({ input: titleSvg, left: 0, top: 0 });

  await sharp({ create: { width, height, channels: 3, background: '#e3e2dc' } })
    .composite(composites)
    .png()
    .toFile(outputPath);

  const output = readFileSync(outputPath);
  const metadata = await sharp(output).metadata();
  records.push({
    missionId,
    file: path.relative(evidenceRoot, outputPath),
    width: metadata.width,
    height: metadata.height,
    bytes: output.length,
    sha256: createHash('sha256').update(output).digest('hex'),
    sources: screenshots.map((shot) => shot.file),
  });
}

const indexPath = path.join(evidenceRoot, 'contact-sheets.json');
writeFileSync(indexPath, `${JSON.stringify({ schemaVersion: 2, batch, productionSha, records }, null, 2)}\n`);
console.log(`Contact sheets: ${records.length}; index: ${indexPath}`);
