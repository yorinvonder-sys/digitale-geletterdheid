/**
 * Favicon Generator — Gemini Image Generation
 * Genereert een favicon op basis van het Pip-logo met Gemini's native image generation.
 *
 * Gebruik:
 *   GOOGLE_API_KEY=jouw-key node scripts/generate-favicon.mjs
 */

import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PIP_LOGO = path.join(ROOT, "public", "mascot", "pip-logo.png");
const OUTPUT_DIR = path.join(ROOT, "public");

const API_KEY = process.env.GOOGLE_API_KEY;
if (!API_KEY) {
  console.error("Fout: GOOGLE_API_KEY ontbreekt.");
  console.error("Haal een key op via https://aistudio.google.com/apikey");
  console.error("Gebruik: GOOGLE_API_KEY=jouw-key node scripts/generate-favicon.mjs");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const PROMPT = `Look at this bird logo carefully. This is "Pip", a European robin (Erithacus rubecula) mascot.

Create a simplified favicon version of this exact bird, optimized for very small display (32x32 pixels). Requirements:

- Show ONLY the bird's head and upper body (head + terracotta breast), cropped tightly
- Keep the exact same art style: clean black outlines, white face, terracotta-orange breast (#D97757), dark charcoal details
- Large expressive black eye with small white highlight
- Small orange beak pointing right
- Include 2-3 small square pixels dissolving from the edge (the bird's signature digital/pixel effect) in terracotta and charcoal
- Clean transparent background (NO background color)
- Bold, clear shapes that read well at tiny sizes — no fine details that disappear at 32px
- Flat 2D illustration style, matching the original logo exactly
- The image should be a clean PNG icon, square aspect ratio

Do NOT add: extra decorations, gradients, 3D effects, shadows, or text. Keep it minimal and iconic.`;

async function main() {
  console.log("Pip Favicon Generator");
  console.log("=====================\n");

  if (!fs.existsSync(PIP_LOGO)) {
    console.error(`Fout: pip-logo.png niet gevonden op ${PIP_LOGO}`);
    process.exit(1);
  }

  const logoData = fs.readFileSync(PIP_LOGO);
  console.log(`Referentie: ${PIP_LOGO} (${Math.round(logoData.length / 1024)} KB)`);
  console.log("Model: gemini-3-pro-image-preview (Nano Banana Pro)");
  console.log("Genereren...\n");

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: "image/png",
                data: logoData.toString("base64"),
              },
            },
            { text: PROMPT },
          ],
        },
      ],
      config: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    });

    let saved = 0;
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const ext = part.inlineData.mimeType === "image/png" ? "png" : "webp";
        const outputPath = path.join(OUTPUT_DIR, `favicon-pip.${ext}`);
        const buffer = Buffer.from(part.inlineData.data, "base64");
        fs.writeFileSync(outputPath, buffer);
        console.log(`Opgeslagen: ${outputPath} (${Math.round(buffer.length / 1024)} KB)`);
        saved++;
      } else if (part.text) {
        console.log(`Gemini: ${part.text}`);
      }
    }

    if (saved === 0) {
      console.error("Geen afbeelding gegenereerd. Probeer opnieuw.");
      process.exit(1);
    }

    console.log("\nKlaar! Volgende stappen:");
    console.log("  1. Bekijk het resultaat in public/favicon-pip.png");
    console.log("  2. Als het goed is, converteer naar favicon.svg of vervang favicon.svg");
    console.log("  3. Genereer ICO-variant met: npx png-to-ico public/favicon-pip.png > public/favicon.ico");
  } catch (err) {
    console.error(`Fout: ${err.message}`);
    if (err.message?.includes("API_KEY")) {
      console.error("-> Check je GOOGLE_API_KEY");
    }
    process.exit(1);
  }
}

main();
