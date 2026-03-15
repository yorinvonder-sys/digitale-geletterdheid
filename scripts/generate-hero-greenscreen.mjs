#!/usr/bin/env node
/**
 * Generate Pip animation on green screen for hybrid video approach.
 * This generates ONLY Pip flying — to be composited over real screenshots via ffmpeg.
 *
 * Usage: node scripts/generate-hero-greenscreen.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const MODEL = 'veo-3.0-generate-001';
const API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

function loadApiKey() {
    const envPath = resolve(ROOT, '.env.local');
    const envContent = readFileSync(envPath, 'utf-8');
    const match = envContent.match(/GOOGLE_API_KEY\s*=\s*["']?([^\s"']+)/m);
    if (!match) throw new Error('GOOGLE_API_KEY not found in .env.local');
    return match[1];
}

const VIDEO_PROMPT = `A small European robin bird (Pip) flying against a SOLID BRIGHT GREEN (#00FF00) chroma key background. Nothing else in the scene — ONLY the bird and the flat green background.

CHARACTER — Pip:
- European robin (Erithacus rubecula)
- Matte terracotta-orange breast (#D97757), white belly, charcoal-gray wings and back
- Large round expressive black eyes, small orange beak
- Tail feathers dissolve into tiny square digital pixels (terracotta + charcoal)
- Clean black outlines, 2D cartoon style similar to Studio Ghibli companion characters
- Confident, curious personality — NOT cute/babyish

ANIMATION SEQUENCE (8 seconds):
0-1s: Pip enters from the left side, flying fast with wings fully spread. Dynamic entry.
1-3s: Pip flies to the center, slows down, hovers while looking around curiously. Head tilts left and right. Wings beating steadily.
3-5s: Pip does a confident swooping dive downward then back up — showing off agile flight. Tail pixels scatter during the dive.
5-7s: Pip flies in a gentle arc across the frame from left to right, wings spread wide. Trailing terracotta pixel particles behind.
7-8s: Pip slows in the right-center of frame, turns to face the camera directly, gives a knowing confident look (slight head tilt), then quickly darts off-screen downward-right, leaving a burst of pixel particles that fade.

CRITICAL REQUIREMENTS:
- Background MUST be solid, uniform, bright green (#00FF00) — this is for chroma key compositing
- NO other objects, characters, ground, sky, or environment — ONLY Pip against green
- NO shadows on the green background
- NO gradients or lighting variation on the green background
- Pip should be well-lit with soft, even lighting from the front
- Pip should occupy roughly 15-20% of the frame (small bird, not filling the screen)
- Camera is static — does NOT move. Only Pip moves.
- Bird flight physics should feel natural but stylized — real wing beats, body tilts during turns`;

async function generateVideo(apiKey) {
    console.log('🎬 Submitting Pip green screen to Veo 3...');

    const url = `${API_BASE}/models/${MODEL}:predictLongRunning`;

    const body = {
        instances: [{ prompt: VIDEO_PROMPT }],
        parameters: {
            aspectRatio: '16:9',
            durationSeconds: 8,
            sampleCount: 1,
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
        throw new Error(`Veo 3 request failed (${res.status}): ${err}`);
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
    const outputPath = resolve(ROOT, 'public/videos/pip-greenscreen.mp4');

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
    console.log('🎬 DGSkills Pip Green Screen Generator (Veo 3)\n');

    const apiKey = loadApiKey();
    console.log(`🔑 API key loaded (${apiKey.slice(0, 8)}...)\n`);

    const opName = await generateVideo(apiKey);
    const response = await pollOperation(apiKey, opName);
    await saveVideo(apiKey, response);

    console.log('\n🎉 Done! Pip green screen saved as pip-greenscreen.mp4');
    console.log('Next: combine with screenshots using ffmpeg (see scripts/combine-hero.sh)');
}

main().catch(err => {
    console.error('\n❌ Error:', err.message);
    process.exit(1);
});
