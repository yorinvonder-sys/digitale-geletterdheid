/**
 * Pip Intro Tutorial Video Generator v2
 * Gebruikt Google Veo 3.1 via de Gemini API om een intro-tutorial te genereren
 * waarin Pip (het DGSkills roodborstje) zijn verhaal vertelt.
 *
 * Verbeteringen v2:
 *   - Geen referentie-afbeeldingen meer (transparante PNGs → zwarte achtergrond)
 *   - Expliciete audio/naratie-instructies in elke prompt
 *   - Striktere karakter-beschrijving (geen gouden borsten)
 *   - Crème/warme achtergronden afgedwongen
 *
 * Gebruik:
 *   GOOGLE_API_KEY=jouw-key node scripts/generate-pip-intro.mjs
 */

import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUTPUT_DIR = path.join(ROOT, "public", "video");
const REF_IMAGE = path.join(ROOT, "public", "apple-touch-icon.png");

// ─── Config ────────────────────────────────────────────────────────────────

const API_KEY = process.env.GOOGLE_API_KEY;
if (!API_KEY) {
  console.error("Fout: GOOGLE_API_KEY ontbreekt.");
  console.error("Haal een key op via https://aistudio.google.com/apikey");
  console.error("Gebruik: GOOGLE_API_KEY=jouw-key node scripts/generate-pip-intro.mjs");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// ─── Karakter-definitie (herbruikbaar in elke prompt) ──────────────────────
//
// Pip = Europees roodborstje met:
// - Terracotta-oranje borst (#D97757), NOOIT goud/geel
// - Witte buik
// - Donkergrijze/charcoal vleugels en rug (#1A1A19)
// - Staartveren die uiteen vallen in kleine vierkante pixels
// - Grote ronde zwarte ogen, vrolijke uitdrukking
// - Schone zwarte contouren, cartoon-stijl

const PIP_DESC = `a small cute European robin bird (Erithacus rubecula) with a matte terracotta-orange breast (NOT gold, NOT yellow, NOT shiny — strictly matte warm orange-brown like the color #D97757), a clean white belly, dark charcoal-gray wings and back, small thin black legs, large round expressive black eyes, a small orange beak, and tail feathers that dissolve into small square digital pixels in terracotta and charcoal colors. The bird has clean black outlines in a friendly 2D cartoon illustration style.`;

const BG_RULE = `The background must NEVER be black or dark. Use warm, bright, inviting colors: cream (#FAF9F0), soft sky blue, warm sunlit tones.`;

const AUDIO_RULE = `This video MUST have synchronized audio. Include a warm, friendly, young male Dutch narrator voice speaking clearly and enthusiastically.`;

// ─── Pip's Verhaal — 4 scènes ─────────────────────────────────────────────

const SCENES = [
  {
    id: "01-de-vlucht",
    prompt: `${AUDIO_RULE} A bright, sunny outdoor scene with a warm cream and blue sky. ${PIP_DESC} The robin flies joyfully through the bright blue sky with soft white clouds, above a modern Dutch school building with large windows. The camera follows the bird smoothly as it swoops and glides, then dives down toward an open classroom window. Warm golden hour sunlight, vibrant but natural colors. Studio Ghibli-inspired whimsical feel. ${BG_RULE} The Dutch narrator says enthusiastically: "Hé! Ik ben Pip, een heel bijzonder roodborstje!" Cheerful background music with soft piano and gentle strings.`,
  },
  {
    id: "02-de-ontdekking",
    prompt: `${AUDIO_RULE} A bright, colorful modern classroom interior with cream-white walls and large windows letting in natural daylight. ${PIP_DESC} The robin lands on a white computer keyboard on a wooden desk. The computer monitor glows with warm colorful light. As the bird touches the keys, magical small square pixels in terracotta-orange and charcoal float upward like sparkles around the bird. The robin looks amazed and excited with wide eyes at the glowing screen. Colorful educational posters decorate the bright walls. ${BG_RULE} The Dutch narrator says with wonder: "Op een dag vloog ik een computerlokaal binnen... en ontdekte een hele nieuwe wereld!" Sound effects of gentle keyboard clicks and magical sparkle sounds.`,
  },
  {
    id: "03-de-digitale-wereld",
    prompt: `${AUDIO_RULE} A bright, warm-toned abstract digital landscape with a cream and soft terracotta color palette. ${PIP_DESC} IMPORTANT: the bird's breast must remain strictly matte terracotta-orange throughout the entire shot, never changing to gold or yellow or glowing. The robin flies through this warm digital space. Around it float soft translucent icons: a shield symbol, a lightbulb, floating binary code, a brain icon labeled AI, and a magnifying glass. Small square pixels in terracotta and charcoal trail behind the bird. The overall palette stays warm: cream, terracotta-orange, charcoal, with subtle white glowing accents. Smooth cinematic camera following the bird. ${BG_RULE} The Dutch narrator says: "Ik leerde over AI, data en digitale veiligheid. En nu wil ik jou meenemen op avontuur!" Uplifting orchestral background music.`,
  },
  {
    id: "04-de-uitnodiging",
    prompt: `${AUDIO_RULE} A cozy, warm indoor scene with soft cream-colored background and warm lighting. ${PIP_DESC} The robin sits in a small cozy nest made of brown twigs and colorful autumn leaves on a wooden desk. Next to the nest sits a small tablet device showing a bright colorful app interface with terracotta-orange accent colors. The bird raises one wing in a friendly wave toward the camera, with a warm inviting smile. Small square pixels in terracotta and charcoal float gently around like fireflies. Soft warm bokeh lights in the cream background. ${BG_RULE} The Dutch narrator says warmly and invitingly: "Klaar om een Future Architect te worden? Laten we beginnen!" The bird winks. Gentle, hopeful closing music with soft chimes.`,
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────

function loadReferenceImage() {
  if (!fs.existsSync(REF_IMAGE)) {
    console.warn(`Waarschuwing: referentie-afbeelding niet gevonden: ${REF_IMAGE}`);
    return null;
  }
  const data = fs.readFileSync(REF_IMAGE);
  console.log(`  Referentie: apple-touch-icon.png (met crème achtergrond)`);
  return {
    imageBytes: data.toString("base64"),
    mimeType: "image/png",
  };
}

async function pollOperation(operation, sceneName) {
  const startTime = Date.now();
  let dots = 0;

  while (!operation.done) {
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    dots = (dots + 1) % 4;
    process.stdout.write(`\r  ${sceneName}: wachten op generatie... ${elapsed}s ${".".repeat(dots)}${"  ".repeat(3 - dots)}`);
    await new Promise((r) => setTimeout(r, 10_000));
    operation = await ai.operations.getVideosOperation({ operation });
  }

  const elapsed = Math.round((Date.now() - startTime) / 1000);
  console.log(`\r  ${sceneName}: klaar in ${elapsed}s${"  ".repeat(20)}`);
  return operation;
}

// ─── Hoofdlogica ───────────────────────────────────────────────────────────

async function generateScene(scene, index) {
  const label = `Scene ${index + 1}/4 [${scene.id}]`;
  console.log(`\n${label}`);
  console.log(`  Prompt: "${scene.prompt.slice(0, 100)}..."`);

  try {
    const refImage = loadReferenceImage();
    const params = {
      model: "veo-3.1-generate-preview",
      prompt: scene.prompt,
      config: {
        aspectRatio: "16:9",
        numberOfVideos: 1,
      },
    };
    if (refImage) {
      params.image = refImage;
    }
    const operation = await ai.models.generateVideos(params);

    const result = await pollOperation(operation, label);

    if (!result.response?.generatedVideos?.length) {
      console.error(`  Fout: geen video gegenereerd voor ${scene.id}`);
      return null;
    }

    const video = result.response.generatedVideos[0];
    const outputPath = path.join(OUTPUT_DIR, `pip-intro-${scene.id}.mp4`);

    await ai.files.download({
      file: video.video,
      downloadPath: outputPath,
    });

    console.log(`  Opgeslagen: ${outputPath}`);
    return outputPath;
  } catch (err) {
    console.error(`  Fout bij ${scene.id}: ${err.message}`);
    if (err.message?.includes("PERMISSION_DENIED") || err.message?.includes("403")) {
      console.error("  -> Je hebt mogelijk geen toegang tot Veo 3.1. Check je API-plan.");
    }
    return null;
  }
}

async function main() {
  console.log("╔══════════════════════════════════════════════════════╗");
  console.log("║   Pip Intro Tutorial v2 — Video Generator           ║");
  console.log("║   4 scènes × 8 sec = 32 sec intro (met audio!)     ║");
  console.log("╚══════════════════════════════════════════════════════╝");
  console.log();
  console.log("Wijzigingen v2:");
  console.log("  - Geen referentie-afbeeldingen (fix zwarte achtergrond)");
  console.log("  - Expliciete audio/naratie in elke prompt");
  console.log("  - Striktere kleurbepaling (geen gouden borst)");
  console.log("  - Warme crème achtergronden afgedwongen");

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const results = [];

  for (let i = 0; i < SCENES.length; i++) {
    const result = await generateScene(SCENES[i], i);
    results.push(result);
  }

  console.log("\n══════════════════════════════════════════════════════");
  console.log("Resultaten:");
  const successful = results.filter(Boolean);
  results.forEach((r, i) => {
    const status = r ? "OK" : "MISLUKT";
    console.log(`  Scene ${i + 1} (${SCENES[i].id}): ${status}`);
  });

  console.log(`\n${successful.length}/${SCENES.length} scènes gegenereerd.`);

  if (successful.length > 0) {
    console.log("\nVolgende stappen:");
    console.log("  1. Bekijk de clips in public/video/");
    console.log("  2. Combineer met ffmpeg:");
    console.log('     ffmpeg -f concat -i <(for f in public/video/pip-intro-0*.mp4; do echo "file \'$(pwd)/$f\'"; done) -c copy public/video/pip-intro-full.mp4');
    console.log("  3. Integreer in de app als onboarding-video");
  }
}

main().catch((err) => {
  console.error("Onverwachte fout:", err);
  process.exit(1);
});
