import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const [, , outputPath] = process.argv;

if (!outputPath) {
  console.error('Usage: node scripts/save-latest-imagegen-preview.mjs <output-path>');
  process.exit(1);
}

const generatedDir = path.join(
  process.env.HOME,
  '.codex/generated_images/019ec678-011d-7af0-93f2-ec92097ebfbe',
);

const newest = fs.readdirSync(generatedDir)
  .filter((fileName) => fileName.endsWith('.png'))
  .map((fileName) => {
    const filePath = path.join(generatedDir, fileName);
    return { fileName, mtimeMs: fs.statSync(filePath).mtimeMs };
  })
  .sort((a, b) => b.mtimeMs - a.mtimeMs)[0];

if (!newest) {
  console.error(`No generated PNG files found in ${generatedDir}`);
  process.exit(1);
}

await sharp(path.join(generatedDir, newest.fileName))
  .resize(1280, 720, { fit: 'cover' })
  .webp({ quality: 88 })
  .toFile(outputPath);

console.log(`wrote ${outputPath} from ${newest.fileName}`);
