#!/usr/bin/env node
/**
 * Generate hero video via Veo 3 — IMAGE-TO-VIDEO approach
 * Uses a real screenshot as first frame, Pip animated over it.
 *
 * Usage: node scripts/generate-hero-image-to-video.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const MODEL = 'veo-3.1-generate-preview';
const API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

function loadApiKey() {
    const envPath = resolve(ROOT, '.env.local');
    const envContent = readFileSync(envPath, 'utf-8');
    const match = envContent.match(/GOOGLE_API_KEY\s*=\s*["']?([^\s"']+)/m);
    if (!match) throw new Error('GOOGLE_API_KEY not found in .env.local');
    return match[1];
}

function loadImage(relativePath) {
    const fullPath = resolve(ROOT, relativePath);
    return readFileSync(fullPath).toString('base64');
}

const VIDEO_PROMPT = `Animate this screenshot of a Dutch educational platform. A small European robin bird (Pip) with a matte terracotta-orange breast, white belly, and charcoal-gray wings flies INTO this exact screen from the left side.

Pip is a 2D cartoon bird with clean black outlines, large expressive black eyes, and a small orange beak. Its tail feathers dissolve into tiny square digital pixels. Style: Ghibli companion character — confident, curious, NOT babyish.

ANIMATION:
- The screenshot/UI stays exactly as shown — it is the background. Do NOT alter the UI.
- Pip flies in from the left (0-1s), swoops across the mission cards, briefly hovers over one card as if inspecting it (1-3s).
- Pip then flies to the right side, circles around the progress/XP area (3-5s).
- Pip flies upward and does a playful loop (5-7s), then turns to face the camera with a confident look before darting off-screen to the right (7-8s), leaving a small trail of terracotta pixel-particles.

CRITICAL RULES:
- The UI/screenshot background must remain STATIC and UNCHANGED — this is a real app screenshot, not generated art.
- Only Pip moves. The UI is the stage.
- Warm, natural lighting. No dark backgrounds.
- Pip should feel alive: wing flaps, head turns, personality in movement.
- No text overlays, no other characters.`;

async function uploadFile(apiKey, filePath, mimeType) {
    const fullPath = resolve(ROOT, filePath);
    const fileData = readFileSync(fullPath);
    const numBytes = fileData.length;

    // Step 1: Start resumable upload
    console.log(`📤 Uploading ${filePath} (${(numBytes / 1024).toFixed(0)} KB)...`);
    const startRes = await fetch(`https://generativelanguage.googleapis.com/upload/v1beta/files?key=${apiKey}`, {
        method: 'POST',
        headers: {
            'X-Goog-Upload-Protocol': 'resumable',
            'X-Goog-Upload-Command': 'start',
            'X-Goog-Upload-Header-Content-Length': numBytes.toString(),
            'X-Goog-Upload-Header-Content-Type': mimeType,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ file: { displayName: filePath } }),
    });

    if (!startRes.ok) {
        const err = await startRes.text();
        throw new Error(`Upload start failed (${startRes.status}): ${err}`);
    }

    const uploadUrl = startRes.headers.get('X-Goog-Upload-URL');
    if (!uploadUrl) throw new Error('No upload URL in response');

    // Step 2: Upload bytes
    const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
            'Content-Length': numBytes.toString(),
            'X-Goog-Upload-Offset': '0',
            'X-Goog-Upload-Command': 'upload, finalize',
        },
        body: fileData,
    });

    if (!uploadRes.ok) {
        const err = await uploadRes.text();
        throw new Error(`Upload failed (${uploadRes.status}): ${err}`);
    }

    const fileInfo = await uploadRes.json();
    const fileUri = fileInfo.file?.uri;
    console.log(`✅ Uploaded: ${fileUri}`);
    return fileUri;
}

async function generateVideo(apiKey) {
    console.log('📸 Uploading dashboard screenshot...');
    const imageUri = await uploadFile(apiKey, 'public/screenshots/student-mission-overview.png', 'image/png');

    console.log('🎬 Submitting to Veo 3.1 (image-to-video)...');

    const url = `${API_BASE}/models/${MODEL}:predictLongRunning`;

    // Use fileUri reference instead of inlineData
    const body = {
        instances: [{
            prompt: VIDEO_PROMPT,
            image: {
                fileUri: imageUri,
                mimeType: 'image/png',
            },
        }],
        parameters: {
            aspectRatio: '16:9',
        },
    };

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'x-goog-api-key': apiKey,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Veo 3.1 request failed (${res.status}): ${err}`);
    }

    const operation = await res.json();
    const opName = operation.name;
    console.log('✅ Operation submitted:', opName);
    return opName;
}

async function pollOperation(apiKey, operationName) {
    const url = `${API_BASE}/${operationName}`;
    console.log('⏳ Waiting for video generation (2-5 minutes)...');

    for (let i = 0; i < 60; i++) {
        await new Promise(r => setTimeout(r, 10_000));

        const res = await fetch(url, {
            headers: { 'x-goog-api-key': apiKey },
        });

        if (!res.ok) {
            console.log(`  Poll ${i + 1}: HTTP ${res.status}`);
            continue;
        }

        const op = await res.json();

        if (op.done) {
            if (op.error) {
                throw new Error(`Generation failed: ${JSON.stringify(op.error)}`);
            }
            console.log('✅ Video generated!');
            return op.response;
        }

        console.log(`  ⏳ ${(i + 1) * 10}s elapsed...`);
    }

    throw new Error('Timeout after 10 minutes');
}

async function saveVideo(apiKey, response) {
    const outputPath = resolve(ROOT, 'public/videos/hero-image-to-video.mp4');

    const videoResponse = response.generateVideoResponse || response;
    const samples = videoResponse.generatedSamples || videoResponse.predictions || [];

    if (samples.length === 0) {
        console.log('⚠️  Response:', JSON.stringify(response, null, 2).slice(0, 1000));
        throw new Error('No video samples in response');
    }

    const sample = samples[0];
    const video = sample.video || sample;

    if (video.uri) {
        console.log(`📥 Downloading video from: ${video.uri}`);
        const dlRes = await fetch(video.uri, {
            headers: { 'x-goog-api-key': apiKey },
        });
        if (!dlRes.ok) throw new Error(`Download failed: ${dlRes.status}`);
        const buf = Buffer.from(await dlRes.arrayBuffer());
        writeFileSync(outputPath, buf);
        console.log(`💾 Saved: ${outputPath} (${(buf.length / 1024 / 1024).toFixed(1)} MB)`);
        return;
    }

    const b64 = video.bytesBase64Encoded || video.inlineData?.data;
    if (b64) {
        const buf = Buffer.from(b64, 'base64');
        writeFileSync(outputPath, buf);
        console.log(`💾 Saved: ${outputPath} (${(buf.length / 1024 / 1024).toFixed(1)} MB)`);
        return;
    }

    console.log('📎 Video data:', JSON.stringify(sample, null, 2).slice(0, 500));
    throw new Error('Could not extract video data');
}

async function main() {
    console.log('🎬 DGSkills Hero Video — Image-to-Video (Veo 3)\n');

    const apiKey = loadApiKey();
    console.log(`🔑 API key loaded (${apiKey.slice(0, 8)}...)\n`);

    const opName = await generateVideo(apiKey);
    const response = await pollOperation(apiKey, opName);
    await saveVideo(apiKey, response);

    console.log('\n🎉 Done! Video saved as hero-image-to-video.mp4');
}

main().catch(err => {
    console.error('\n❌ Error:', err.message);
    process.exit(1);
});
