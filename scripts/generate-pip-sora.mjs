/**
 * Beaver Intro — Scene 3 + 4 via OpenAI Sora 2
 * Genereert de ontbrekende scenes terwijl provider quota gereset wordt.
 *
 * Gebruik:
 *   OPENAI_API_KEY=sk-... node scripts/generate-pip-sora.mjs
 */

import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUTPUT_DIR = path.join(ROOT, "public", "video");
const REF_IMAGE = path.join(ROOT, "public", "apple-touch-icon.png");

const API_KEY = process.env.OPENAI_API_KEY;
if (!API_KEY) {
  console.error("Fout: OPENAI_API_KEY ontbreekt.");
  process.exit(1);
}

const openai = new OpenAI({ apiKey: API_KEY });

// ─── DGSkills bever karakter-beschrijving ──────────────────────────────────

const BEAVER_DESC = `a friendly DGSkills beaver mascot with warm brown fur, rounded ears, buck teeth, a flat tail, large round expressive black eyes, a teal hoodie (#0B453F), coral accents (#D97848), and small square digital pixels dissolving from the tail and phone edge in coral and teal. Clean ink outlines (#08283B), friendly 2D cartoon illustration style.`;

const SCENES = [
  {
    id: "03-de-digitale-wereld",
    prompt: `A bright, warm-toned abstract digital landscape with a cream, coral, and teal color palette. Background must NEVER be black or dark — use warm cream (#FCF6EA), paper (#FFFDF7), ink (#08283B), coral (#D97848), teal (#0B453F), sage (#5F947D), and gold (#D7C95F). ${BEAVER_DESC} IMPORTANT: the hoodie stays deep teal and accents stay coral throughout the entire shot. The beaver moves through this warm digital space. Around it float soft translucent icons: a shield symbol, a lightbulb, floating binary code, a brain icon labeled AI, and a magnifying glass. Small square pixels in coral and teal trail behind the beaver like a comet tail. Smooth cinematic camera following the beaver. A warm, friendly, young male Dutch narrator voice says clearly: "Ik leerde over AI, data en digitale veiligheid. En nu wil ik jou meenemen op avontuur!" Uplifting orchestral background music with gentle strings.`,
  },
  {
    id: "04-de-uitnodiging",
    prompt: `A cozy, warm indoor scene with soft cream-colored background (#FCF6EA) and warm lighting. Background must NEVER be black or dark. ${BEAVER_DESC} The beaver sits at a wooden desk. Next to it sits a small tablet device showing a bright colorful app interface with coral and teal accent colors. The beaver raises one paw in a friendly wave toward the camera, with a warm inviting smile. Small square pixels in coral and teal float gently around like fireflies. Soft warm bokeh lights in the cream background. A warm, friendly, young male Dutch narrator voice says warmly: "Klaar om een Future Architect te worden? Laten we beginnen!" The beaver winks playfully. Gentle, hopeful closing music with soft chimes.`,
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────

function loadReferenceImage() {
  if (!fs.existsSync(REF_IMAGE)) return null;
  const data = fs.readFileSync(REF_IMAGE);
  return `data:image/png;base64,${data.toString("base64")}`;
}

async function pollVideo(videoId, label) {
  const startTime = Date.now();
  let dots = 0;

  while (true) {
    const status = await openai.videos.retrieve(videoId);
    const elapsed = Math.round((Date.now() - startTime) / 1000);

    if (status.status === "completed") {
      console.log(`\r  ${label}: klaar in ${elapsed}s${"  ".repeat(20)}`);
      return status;
    }

    if (status.status === "failed") {
      console.error(`\r  ${label}: MISLUKT na ${elapsed}s — ${status.error?.message || "onbekende fout"}`);
      return null;
    }

    dots = (dots + 1) % 4;
    process.stdout.write(`\r  ${label}: ${status.status}... ${elapsed}s ${".".repeat(dots)}${"  ".repeat(3 - dots)}`);
    await new Promise((r) => setTimeout(r, 5_000));
  }
}

// ─── Hoofdlogica ───────────────────────────────────────────────────────────

async function generateScene(scene, index) {
  const label = `Scene ${index + 3}/4 [${scene.id}]`;
  console.log(`\n${label}`);
  console.log(`  Prompt: "${scene.prompt.slice(0, 100)}..."`);

  try {
    const params = {
      model: "sora-2",
      prompt: scene.prompt,
      size: "1280x720",
    };

    const video = await openai.videos.create(params);
    console.log(`  Video job gestart: ${video.id}`);

    const result = await pollVideo(video.id, label);
    if (!result) return null;

    // Download video
    const outputPath = path.join(OUTPUT_DIR, `beaver-intro-${scene.id}.mp4`);
    const response = await openai.videos.download(video.id);

    // response is a readable stream
    const writer = fs.createWriteStream(outputPath);
    response.pipe(writer);
    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    console.log(`  Opgeslagen: ${outputPath}`);
    return outputPath;
  } catch (err) {
    console.error(`  Fout bij ${scene.id}: ${err.message}`);
    return null;
  }
}

async function main() {
  console.log("╔══════════════════════════════════════════════════════╗");
  console.log("║   Beaver Intro — Scene 3+4 via OpenAI Sora 2       ║");
  console.log("╚══════════════════════════════════════════════════════╝");

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const results = [];
  for (let i = 0; i < SCENES.length; i++) {
    const result = await generateScene(SCENES[i], i);
    results.push(result);
  }

  console.log("\n══════════════════════════════════════════════════════");
  const successful = results.filter(Boolean);
  results.forEach((r, i) => {
    console.log(`  Scene ${i + 3} (${SCENES[i].id}): ${r ? "OK" : "MISLUKT"}`);
  });
  console.log(`\n${successful.length}/${SCENES.length} scènes gegenereerd.`);
}

main().catch((err) => {
  console.error("Onverwachte fout:", err);
  process.exit(1);
});
