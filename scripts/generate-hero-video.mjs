#!/usr/bin/env node
/**
 * Generate hero video via Gemini API (Veo 3.1)
 *
 * Reads GOOGLE_API_KEY from .env.local
 * Usage: node scripts/generate-hero-video.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const MODEL = 'veo-3.0-generate-001';
const API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

// ─── Load API key from .env.local ─────────────────────────────────────
function loadApiKey() {
    const envPath = resolve(ROOT, '.env.local');
    const envContent = readFileSync(envPath, 'utf-8');
    const match = envContent.match(/GOOGLE_API_KEY\s*=\s*["']?([^\s"']+)/m);
    if (!match) throw new Error('GOOGLE_API_KEY not found in .env.local');
    return match[1];
}

// ─── Load reference image as base64 ───────────────────────────────────
function loadImage(relativePath) {
    const fullPath = resolve(ROOT, relativePath);
    return readFileSync(fullPath).toString('base64');
}

// ─── The prompt ───────────────────────────────────────────────────────
const VIDEO_PROMPT = `Create a cinematic 8-second teaser animation. The star is Pip — a small European robin bird (Erithacus rubecula) with a matte terracotta-orange breast (#D97757), white belly, charcoal-gray wings and back, large round expressive black eyes, and a small orange beak. Pip's tail feathers subtly dissolve into tiny square digital pixels in terracotta and charcoal. Clean black outlines, friendly but NOT babyish — think Ghibli companion character, confident and curious.

THE CONCEPT — "Platform Teaser":
Pip flies through real-looking UI screens of a modern edtech platform, giving the viewer a rapid, exciting preview of what's inside. The screens look like actual web app interfaces (clean, modern, rounded cards with shadows) floating in a warm, softly lit 3D space with depth-of-field blur.

SEQUENCE:

BEAT 1 (0-2s): Pip swoops into frame from the left, flying fast and determined. The camera tracks Pip as it dives toward a floating screen showing a MISSION OVERVIEW — a grid of mission cards with icons, progress indicators, and category labels. Pip banks sharply around the screen, wings spread wide. The screen glows softly as Pip passes.

BEAT 2 (2-4s): Quick cut — Pip weaves between two more floating screens: one shows an AVATAR CUSTOMIZATION panel (a character with clothing/accessory options around it), the other shows an AI CHAT INTERFACE (chat bubbles in a clean conversation UI). Pip's digital tail-pixels scatter and trail behind like a comet. The screens tilt slightly as Pip flies past, creating parallax depth.

BEAT 3 (4-6s): Pip spirals upward past a screen showing a PROGRESS DASHBOARD with XP bars, achievement badges, and a level indicator. A "+250 XP" notification pops onto the screen as Pip flies past. The camera follows Pip's ascent, revealing more screens stretching into the distance — dozens of features yet to explore.

BEAT 4 (6-8s): Pip slows down, turns to face the camera, and gives a confident, knowing look — one eyebrow raised, slight head tilt — as if saying "Want to see more?" The background screens blur into warm bokeh. Pip hovers in center frame for a beat, then darts off-screen downward (toward the rest of the page), leaving a trail of terracotta pixel-particles that linger and fade.

STYLE REQUIREMENTS:
- Color palette: warm cream backgrounds (#FAF9F0), terracotta orange (#D97757) accents, soft charcoal, touches of muted purple for UI elements. NEVER dark/black backgrounds.
- UI screens: realistic modern web design — white cards, subtle shadows, rounded corners, clean typography placeholders. They should look like actual app screenshots rendered in 3D space.
- Lighting: warm diffused light from above-right, soft volumetric glow behind screens, gentle lens flare.
- Camera: dynamic and cinematic — tracking shots, smooth whip-pans between beats, shallow depth of field.
- Pip's animation: fluid, athletic bird flight — NOT floaty or dreamy. Quick, purposeful movements with personality. Wing physics should feel real but stylized.
- Mood: exciting, fast-paced, confident, aspirational. This is a TEASER — it should create urgency to see more.
- Absolutely NO other characters — only Pip. No humans, no 3D avatars, no cartoon children.
- No text overlays or titles.
- The overall feeling should be: a confident robin guiding you through a platform that's clearly impressive and worth exploring.`;

// ─── Generate video ───────────────────────────────────────────────────
async function generateVideo(apiKey) {
    console.log('📸 Loading reference images...');
    const pipImage = loadImage('public/mascot/pip-excited.png');
    const avatarImage = loadImage('public/screenshots/avatar-customization.png');
    const missionImage = loadImage('public/screenshots/student-mission-overview.png');

    console.log('🎬 Submitting to Veo 3...');

    const url = `${API_BASE}/models/${MODEL}:predictLongRunning`;

    const body = {
        instances: [{
            prompt: VIDEO_PROMPT,
        }],
        parameters: {
            aspectRatio: '16:9',
            durationSeconds: 8,
            sampleCount: 1,
            // personGeneration not supported on this model
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

// ─── Poll for completion ──────────────────────────────────────────────
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

// ─── Download and save video ──────────────────────────────────────────
async function saveVideo(apiKey, response) {
    const outputPath = resolve(ROOT, 'public/videos/hero-pip-adventure.mp4');

    // Navigate the response structure
    const videoResponse = response.generateVideoResponse || response;
    const samples = videoResponse.generatedSamples || videoResponse.predictions || [];

    if (samples.length === 0) {
        console.log('⚠️  Response:', JSON.stringify(response, null, 2).slice(0, 1000));
        throw new Error('No video samples in response');
    }

    const sample = samples[0];
    const video = sample.video || sample;

    // Check for URI (needs fetching)
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

    // Check for inline base64
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

// ─── Main ─────────────────────────────────────────────────────────────
async function main() {
    console.log('🎬 DGSkills Hero Video Generator (Veo 3)\n');

    const apiKey = loadApiKey();
    console.log(`🔑 API key loaded (${apiKey.slice(0, 8)}...)\n`);

    const opName = await generateVideo(apiKey);
    const response = await pollOperation(apiKey, opName);
    await saveVideo(apiKey, response);

    console.log('\n🎉 Done! Restart dev server to see the new video.');
}

main().catch(err => {
    console.error('\n❌ Error:', err.message);
    process.exit(1);
});
