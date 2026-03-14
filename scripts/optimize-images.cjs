/**
 * Image Optimization Script
 * Converts PNG/JPG images to WebP format for better compression
 * 
 * Usage: node scripts/optimize-images.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ASSETS_DIRS = [
    './public/assets/agents',
    './public/assets/previews',
    './public/assets/word-simulator',
    './public/illustrations',
    './public/screenshots',
    './public/mascot',
    './public'
];

const QUALITY = 85; // WebP quality (0-100), 85 for good quality/size balance

const EXCLUDE_FILES = new Set([
    'favicon-16.png',
    'favicon-32.png',
    'icon-512x512.png',
    'apple-touch-icon.png',
    'og-image.png',
]);

async function optimizeImage(inputPath) {
    const ext = path.extname(inputPath).toLowerCase();
    if (!['.png', '.jpg', '.jpeg'].includes(ext)) return null;

    const basename = path.basename(inputPath);
    if (EXCLUDE_FILES.has(basename)) return null;

    const outputPath = inputPath.replace(/\.(png|jpg|jpeg)$/i, '.webp');

    // Skip if webp already exists and is newer than source
    if (fs.existsSync(outputPath)) {
        const srcMtime = fs.statSync(inputPath).mtimeMs;
        const webpMtime = fs.statSync(outputPath).mtimeMs;
        if (webpMtime > srcMtime) return null;
    }

    try {
        const inputStats = fs.statSync(inputPath);
        const inputSize = inputStats.size;

        await sharp(inputPath)
            .webp({ quality: QUALITY })
            .toFile(outputPath);

        const outputStats = fs.statSync(outputPath);
        const outputSize = outputStats.size;
        const savings = ((inputSize - outputSize) / inputSize * 100).toFixed(1);

        return {
            input: inputPath,
            output: outputPath,
            inputSize: (inputSize / 1024).toFixed(1) + ' KB',
            outputSize: (outputSize / 1024).toFixed(1) + ' KB',
            savings: savings + '%'
        };
    } catch (error) {
        console.error(`Error optimizing ${inputPath}:`, error.message);
        return null;
    }
}

async function processDirectory(dir) {
    if (!fs.existsSync(dir)) {
        console.log(`Directory not found: ${dir}`);
        return [];
    }

    const files = fs.readdirSync(dir);
    const results = [];

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isFile()) {
            const result = await optimizeImage(filePath);
            if (result) results.push(result);
        }
    }

    return results;
}

async function main() {
    console.log('🖼️  Image Optimization Script');
    console.log('============================\n');

    let totalResults = [];

    for (const dir of ASSETS_DIRS) {
        console.log(`Processing: ${dir}`);
        const results = await processDirectory(dir);
        totalResults = [...totalResults, ...results];
    }

    console.log('\n📊 Results:');
    console.log('──────────────────────────────────────────────────────────────');

    let totalInputSize = 0;
    let totalOutputSize = 0;

    for (const result of totalResults) {
        console.log(`✅ ${path.basename(result.input)}`);
        console.log(`   ${result.inputSize} → ${result.outputSize} (${result.savings} saved)`);

        totalInputSize += parseFloat(result.inputSize);
        totalOutputSize += parseFloat(result.outputSize);
    }

    console.log('──────────────────────────────────────────────────────────────');
    console.log(`\n🎉 Total: ${totalResults.length} images optimized`);
    console.log(`   ${totalInputSize.toFixed(1)} KB → ${totalOutputSize.toFixed(1)} KB`);
    console.log(`   Saved: ${(totalInputSize - totalOutputSize).toFixed(1)} KB (${((totalInputSize - totalOutputSize) / totalInputSize * 100).toFixed(1)}%)`);

    console.log('\n⚠️  Note: Update your code to use .webp instead of .png/.jpg');
    console.log('   You can safely delete the original files after testing.');
}

main().catch(console.error);
