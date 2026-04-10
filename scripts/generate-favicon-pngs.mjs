#!/usr/bin/env node
/**
 * Generate PNG favicons from favicon.svg using sharp.
 * Usage: node scripts/generate-favicon-pngs.mjs
 */
import sharp from 'sharp';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, '..', 'public');
const svgBuffer = readFileSync(resolve(publicDir, 'favicon.svg'));

const sizes = [
  { name: 'favicon-16.png', width: 16, height: 16 },
  { name: 'favicon-32.png', width: 32, height: 32 },
  { name: 'apple-touch-icon.png', width: 180, height: 180 },
  { name: 'icon-192x192.png', width: 192, height: 192 },
  { name: 'icon-512x512.png', width: 512, height: 512 },
];

for (const { name, width, height } of sizes) {
  await sharp(svgBuffer, { density: Math.max(300, width * 10) })
    .resize(width, height)
    .png()
    .toFile(resolve(publicDir, name));
  console.log(`Generated ${name} (${width}x${height})`);
}

console.log('Done.');
