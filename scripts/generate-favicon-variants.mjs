/**
 * Favicon Variants Generator — 3 varianten via Gemini Nano Banana Pro
 */

import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BEAVER_ICON = path.join(ROOT, "public", "brand-redesign", "otter", "dgskills-beaver-phone-favicon-512.png");
const OUTPUT_DIR = path.join(ROOT, "public");

const API_KEY = process.env.GOOGLE_API_KEY;
if (!API_KEY) {
  console.error("GOOGLE_API_KEY ontbreekt.");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const logoData = fs.readFileSync(BEAVER_ICON);

const BASE = `Look at this DGSkills beaver mascot carefully. It is a friendly beaver with a phone for a Dutch ed-tech platform. The brand colors are cream (#FCF6EA), ink (#08283B), teal (#0B453F), sage (#5F947D), gold (#D7C95F), and coral (#D97848).`;

const VARIANTS = [
  {
    id: "variant-a",
    label: "Close-up hoofd, ronder",
    prompt: `${BASE}

Create a favicon version: a tight circular crop of just the beaver's head and phone. Requirements:
- Round composition that works in a circle
- Warm brown beaver face with a small teal hoodie hint filling the bottom half
- One large expressive black eye with white highlight, centered
- Friendly buck teeth and rounded ears remain readable
- Clean ink outline around the head
- 2 tiny square pixels (one coral, one teal) floating near the top-right as the digital effect
- Transparent background, flat 2D illustration, no gradients or shadows
- Bold shapes readable at 32x32px
- Match the exact art style of the reference image`,
  },
  {
    id: "variant-b",
    label: "Mini full-body, iconic",
    prompt: `${BASE}

Create a favicon version: a simplified full-body silhouette of this beaver, small enough to work at 32x32 pixels. Requirements:
- The full beaver holding a tiny phone, facing right
- Extremely simplified shapes: round body, round head, rounded ears, flat tail
- Teal hoodie, coral accent, warm brown fur
- One dot for the eye
- 3-4 small square pixels dissolving from the tail in coral and teal
- Transparent background
- Very bold, minimal icon style — like an app icon
- Clean black outlines, flat 2D, no gradients
- Must be clearly recognizable as a beaver even at tiny sizes`,
  },
  {
    id: "variant-c",
    label: "Gestileerd, modern app-icon",
    prompt: `${BASE}

Create a modern app-icon style favicon of this beaver. Requirements:
- Show the beaver's head, phone, and upper body at a 3/4 angle, slightly tilted
- Geometric, slightly stylized shapes — modern and clean
- Teal (#0B453F) and coral (#D97848) as accent colors
- Warm brown face, ink details for eye area and phone outline
- Large friendly black eye
- The signature pixel-dissolve effect: 3 small squares floating away from the beaver in coral and teal
- Transparent background
- Flat design, no gradients, no 3D, no shadows
- Should feel like a premium app icon — simple but distinctive
- Must read clearly at 32x32 pixels`,
  },
];

async function generate(variant) {
  console.log(`\n[${variant.id}] ${variant.label}`);
  console.log("  Genereren...");

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
            { text: variant.prompt },
          ],
        },
      ],
      config: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const ext = part.inlineData.mimeType === "image/png" ? "png" : "webp";
        const outputPath = path.join(OUTPUT_DIR, `favicon-${variant.id}.${ext}`);
        const buffer = Buffer.from(part.inlineData.data, "base64");
        fs.writeFileSync(outputPath, buffer);
        console.log(`  Opgeslagen: ${outputPath} (${Math.round(buffer.length / 1024)} KB)`);
        return outputPath;
      }
    }
    console.error("  Geen afbeelding gegenereerd.");
    return null;
  } catch (err) {
    console.error(`  Fout: ${err.message}`);
    return null;
  }
}

async function main() {
  console.log("DGSkills Beaver Favicon — 3 Varianten");
  console.log("=====================================");
  console.log("Model: gemini-3-pro-image-preview (Nano Banana Pro)");

  for (const v of VARIANTS) {
    await generate(v);
  }

  console.log("\nKlaar! Bekijk de varianten in public/favicon-variant-*.webp");
}

main();
