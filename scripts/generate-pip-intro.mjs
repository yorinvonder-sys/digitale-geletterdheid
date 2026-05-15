/**
 * Beaver Intro Tutorial Video Generator v2
 * Gebruikt Google Veo 3.1 via de Gemini API om een intro-tutorial te genereren
 * waarin de DGSkills bever zijn verhaal vertelt.
 *
 * Verbeteringen v2:
 *   - Geen referentie-afbeeldingen meer (transparante PNGs → zwarte achtergrond)
 *   - Expliciete audio/naratie-instructies in elke prompt
 *   - Striktere karakter-beschrijving volgens design.md
 *   - Crème/warme achtergronden afgedwongen
 *
 * Gebruik:
 *   GOOGLE_API_KEY=jouw-key node <dit-script>
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
  console.error("Gebruik: GOOGLE_API_KEY=jouw-key node <dit-script>");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// ─── Karakter-definitie (herbruikbaar in elke prompt) ──────────────────────
//
// DGSkills bever met:
// - Warme bruine vacht, teal hoodie (#0B453F), coral accent (#D97848)
// - Donkere ink contouren (#08283B)
// - Platte staart met kleine vierkante pixels
// - Grote ronde zwarte ogen, vrolijke uitdrukking
// - Schone zwarte contouren, cartoon-stijl

const BEAVER_DESC = `a friendly DGSkills beaver mascot with warm brown fur, rounded ears, buck teeth, a flat tail, large round expressive black eyes, a teal hoodie (#0B453F), coral accents (#D97848), and small square digital pixels dissolving from the tail and phone edge in coral and teal. The beaver has clean ink outlines (#08283B) in a friendly 2D cartoon illustration style.`;

const BG_RULE = `The background must NEVER be black or dark. Use warm, bright, inviting colors: cream (#FCF6EA), soft sky blue, warm sunlit tones.`;

const AUDIO_RULE = `This video MUST have synchronized audio. Include a warm, friendly, young male Dutch narrator voice speaking clearly and enthusiastically.`;

// ─── Mascotteverhaal — 4 scènes ───────────────────────────────────────────

const SCENES = [
  {
    id: "01-de-vlucht",
    prompt: `${AUDIO_RULE} A bright, sunny outdoor scene with a warm cream and blue sky. ${BEAVER_DESC} The beaver moves joyfully through the bright sky on a subtle digital hover path above a modern Dutch school building with large windows. The camera follows the beaver smoothly as it swoops and glides, then dives down toward an open classroom window. Warm golden hour sunlight, vibrant but natural colors. Studio Ghibli-inspired whimsical feel. ${BG_RULE} The Dutch narrator says enthusiastically: "Hé! Ik ben je digitale gids!" Cheerful background music with soft piano and gentle strings.`,
  },
  {
    id: "02-de-ontdekking",
    prompt: `${AUDIO_RULE} A bright, colorful modern classroom interior with cream-white walls and large windows letting in natural daylight. ${BEAVER_DESC} The beaver lands on a white computer keyboard on a wooden desk. The computer monitor glows with warm colorful light. As the beaver touches the keys, magical small square pixels in coral and teal float upward like sparkles around the beaver. The beaver looks amazed and excited with wide eyes at the glowing screen. Colorful educational posters decorate the bright walls. ${BG_RULE} The Dutch narrator says with wonder: "Op een dag kwam ik een computerlokaal binnen... en ontdekte een hele nieuwe wereld!" Sound effects of gentle keyboard clicks and magical sparkle sounds.`,
  },
  {
    id: "03-de-digitale-wereld",
    prompt: `${AUDIO_RULE} A bright, warm-toned abstract digital landscape with a cream and coral-teal color palette. ${BEAVER_DESC} IMPORTANT: the hoodie stays deep teal and accents stay coral throughout the entire shot. The beaver moves through this warm digital space. Around it float soft translucent icons: a shield symbol, a lightbulb, floating binary code, a brain icon labeled AI, and a magnifying glass. Small square pixels in coral and teal trail behind the beaver. The overall palette stays warm: cream, paper, ink, coral, teal, sage, and gold, with subtle white glowing accents. Smooth cinematic camera following the beaver. ${BG_RULE} The Dutch narrator says: "Ik leerde over AI, data en digitale veiligheid. En nu wil ik jou meenemen op avontuur!" Uplifting orchestral background music.`,
  },
  {
    id: "04-de-uitnodiging",
    prompt: `${AUDIO_RULE} A cozy, warm indoor scene with soft cream-colored background and warm lighting. ${BEAVER_DESC} The beaver sits at a wooden desk with a small tablet device showing a bright colorful app interface with coral and teal accent colors. The beaver raises one paw in a friendly wave toward the camera, with a warm inviting smile. Small square pixels in coral and teal float gently around like fireflies. Soft warm bokeh lights in the cream background. ${BG_RULE} The Dutch narrator says warmly and invitingly: "Klaar om een Future Architect te worden? Laten we beginnen!" The beaver winks. Gentle, hopeful closing music with soft chimes.`,
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
    const outputPath = path.join(OUTPUT_DIR, `beaver-intro-${scene.id}.mp4`);

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
  console.log("║   Beaver Intro Tutorial v2 — Video Generator        ║");
  console.log("║   4 scènes × 8 sec = 32 sec intro (met audio!)     ║");
  console.log("╚══════════════════════════════════════════════════════╝");
  console.log();
  console.log("Wijzigingen v2:");
  console.log("  - Geen referentie-afbeeldingen (fix zwarte achtergrond)");
  console.log("  - Expliciete audio/naratie in elke prompt");
  console.log("  - Striktere design.md-kleurbepaling");
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
    console.log('     ffmpeg -f concat -i <(for f in public/video/beaver-intro-0*.mp4; do echo "file \'$(pwd)/$f\'"; done) -c copy public/video/beaver-intro-full.mp4');
    console.log("  3. Integreer in de app als onboarding-video");
  }
}

main().catch((err) => {
  console.error("Onverwachte fout:", err);
  process.exit(1);
});
