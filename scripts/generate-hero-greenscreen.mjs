#!/usr/bin/env node
/**
 * Generate beaver animation on green screen for hybrid video approach.
 * This generates ONLY the DGSkills beaver — to be composited over real screenshots via ffmpeg.
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

const VIDEO_PROMPT = `The DGSkills beaver mascot moving against a SOLID BRIGHT GREEN (#00FF00) chroma key background. Nothing else in the scene — ONLY the beaver and the flat green background.

CHARACTER — DGSkills beaver:
- Friendly beaver with warm brown fur, rounded ears, buck teeth, and a flat tail
- Teal hoodie (#0B453F), coral accent (#D97848), ink outlines (#08283B)
- Large round expressive black eyes
- Tiny square digital pixels dissolve from the tail and phone edge (coral + teal)
- Clean black outlines, 2D cartoon style similar to Studio Ghibli companion characters
- Confident, curious personality — NOT cute/babyish

ANIMATION SEQUENCE (8 seconds):
0-1s: The beaver enters from the left side, moving fast on a subtle digital hover path. Dynamic entry.
1-3s: The beaver moves to the center, slows down, hovers while looking around curiously. Head tilts left and right.
3-5s: The beaver does a confident swooping dive downward then back up — showing agile motion. Tail pixels scatter during the dive.
5-7s: The beaver moves in a gentle arc across the frame from left to right. Trailing coral and teal pixel particles behind.
7-8s: The beaver slows in the right-center of frame, turns to face the camera directly, gives a knowing confident look (slight head tilt), then quickly darts off-screen downward-right, leaving a burst of pixel particles that fade.

CRITICAL REQUIREMENTS:
- Background MUST be solid, uniform, bright green (#00FF00) — this is for chroma key compositing
- NO other objects, characters, ground, sky, or environment — ONLY the beaver against green
- NO shadows on the green background
- NO gradients or lighting variation on the green background
- The beaver should be well-lit with soft, even lighting from the front
- The beaver should occupy roughly 15-20% of the frame, not filling the screen
- Camera is static — does NOT move. Only the beaver moves.
- Motion should feel natural but stylized — body tilts during turns`;

async function generateVideo(apiKey) {
    console.log('🎬 Submitting beaver green screen to Veo 3...');

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
    const outputPath = resolve(ROOT, 'public/videos/beaver-greenscreen.mp4');

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
    console.log('🎬 DGSkills Beaver Green Screen Generator (Veo 3)\n');

    const apiKey = loadApiKey();
    console.log(`🔑 API key loaded (${apiKey.slice(0, 8)}...)\n`);

    const opName = await generateVideo(apiKey);
    const response = await pollOperation(apiKey, opName);
    await saveVideo(apiKey, response);

    console.log('\n🎉 Done! Beaver green screen saved as beaver-greenscreen.mp4');
    console.log('Next: combine with screenshots using ffmpeg (see scripts/combine-hero.sh)');
}

main().catch(err => {
    console.error('\n❌ Error:', err.message);
    process.exit(1);
});
