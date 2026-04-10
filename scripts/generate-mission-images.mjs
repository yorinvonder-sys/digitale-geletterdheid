/**
 * Generate mission preview images via Gemini API or Vertex AI
 *
 * Usage:
 *   # Option A: Google API Key (simplest)
 *   export GOOGLE_API_KEY='AIza...'
 *   node scripts/generate-mission-images.mjs --only=cyber-shield
 *
 *   # Option B: Service Account (Vertex AI)
 *   export GOOGLE_SERVICE_ACCOUNT_KEY='{ ... }'
 *   node scripts/generate-mission-images.mjs --only=cyber-shield
 *
 *   # Flags:
 *   --only=id1,id2   Generate only specific missions
 *   --dry-run        Show what would be generated without calling the API
 *
 * Images are saved to public/assets/agents/{id}.webp
 */

import { writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { createSign } from "node:crypto";

// ── Config ──────────────────────────────────────────────────────────────────

const VERTEX_LOCATION = "europe-west4";
const VERTEX_MODEL = "gemini-2.5-flash-image";
const GEMINI_API_MODEL = "gemini-2.0-flash-exp";
const ASSETS_DIR = join(import.meta.dirname, "..", "public", "assets", "agents");
const RATE_LIMIT_DELAY_MS = 13_000; // ~5 req/min

// Detect auth mode: API key (simple) or service account (Vertex AI)
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || "";
const USE_GEMINI_API = GOOGLE_API_KEY.length > 0;

// ── Theme colors per category ───────────────────────────────────────────────

const THEME_COLORS = {
  cyber: "teal and dark blue-green tones (#2A9D8F)",
  ai: "soft purple and lavender tones (#8B6F9E)",
  media: "warm terracotta and coral tones (#D97757)",
  data: "calm blue and slate tones (#3B82F6)",
  creative: "soft rose and pink tones (#EC4899)",
  general: "warm neutral and amber tones (#F59E0B)",
};

// ── Mission manifest ────────────────────────────────────────────────────────
// Hardcoded list extracted from config/agents/year{1,2,3}.tsx
// Each entry: [id, title, short description, theme]

const MISSIONS = [
  // Year 1 - Period 1
  ["prompt-master", "Prompt Master", "Leer effectieve AI-prompts schrijven", "ai"],
  ["game-director", "Game Director", "Ontwerp een compleet game concept met AI", "creative"],
  ["magister-master", "Magister Master", "Hack het schoolsysteem als ethische hacker", "cyber"],
  ["deepfake-detective", "Deepfake Detective", "Ontmasker deepfakes en manipulatie", "media"],
  ["social-media-psychologist", "Social Media Psycholoog", "Analyseer hoe social media je beïnvloedt", "media"],
  ["robot-bestuurder", "Robot Bestuurder", "Programmeer een robot met AI", "ai"],
  // Year 1 - Period 2
  ["cloud-commander", "Cloud Commander", "Beheer en beveilig cloud-opslag", "cyber"],
  ["data-detective", "Data Detective", "Onderzoek datasets en vind patronen", "data"],
  ["ai-trainer", "AI Trainer", "Train je eigen AI-model", "ai"],
  ["nepnieuws-speurder", "Nepnieuws Speurder", "Ontmasker nepnieuws en desinformatie", "media"],
  ["chatbot-trainer", "Chatbot Trainer", "Bouw en train een chatbot", "ai"],
  ["code-kraker", "Code Kraker", "Los puzzels op met code", "data"],
  ["cloud-cleaner", "Cloud Schoonmaker", "Organiseer en beveilig je cloud-bestanden", "cyber"],
  ["layout-doctor", "Layout Doctor", "Verbeter website layouts en designs", "creative"],
  // Year 1 - Period 3
  ["cyber-shield", "Cyber Shield", "Bescherm systemen tegen cyberaanvallen", "cyber"],
  ["word-wizard", "Word Wizard", "Schrijf overtuigende teksten met AI", "creative"],
  ["wifi-warrior", "WiFi Warrior", "Beveilig draadloze netwerken", "cyber"],
  ["pixel-perfectionist", "Pixel Perfectionist", "Maak perfecte digitale ontwerpen", "creative"],
  ["smart-speaker-hacker", "Smart Speaker Hacker", "Test de beveiliging van IoT-apparaten", "cyber"],
  ["pitch-police", "Pitch Police", "Beoordeel en verbeter presentaties", "media"],
  // Year 1 - Period 4
  ["algorithm-architect", "Algorithm Architect", "Ontwerp en bouw algoritmes", "data"],
  ["privacy-agent", "Privacy Agent", "Bescherm persoonsgegevens online", "cyber"],
  ["trend-analist", "Trend Analist", "Analyseer digitale trends met data", "data"],
  ["ethical-hacker", "Ethical Hacker", "Voer ethische hacking tests uit", "cyber"],
  // Year 1 - Review weeks
  ["review-week-1", "Review Week 1", "Terugblik op periode 1", "general"],
  ["review-week-2", "Review Week 2", "Terugblik op periode 2", "general"],
  ["review-week-3", "Review Week 3", "Terugblik op periode 3", "general"],
  // Year 1 - Bonus
  ["verhalen-ontwerper", "Verhalen Ontwerper", "Schrijf interactieve verhalen met AI", "creative"],
  ["game-programmeur", "Game Programmeur", "Programmeer een game van scratch", "creative"],
  ["game-programmeur-bonus-breakout", "Breakout Game", "Bouw een breakout-game", "creative"],
  ["game-programmeur-bonus-platformer", "Platformer Game", "Bouw een platformer-game", "creative"],
  ["game-programmeur-bonus-puzzle", "Puzzel Game", "Bouw een puzzelgame", "creative"],

  // Year 2 - Period 1
  ["data-journalist", "Data Journalist", "Verwerk ruwe data tot nieuwsverhalen", "data"],
  ["api-explorer", "API Explorer", "Ontdek en gebruik web-APIs", "data"],
  ["ux-researcher", "UX Researcher", "Onderzoek gebruikerservaringen", "creative"],
  ["ml-trainer", "ML Trainer", "Train machine learning modellen", "ai"],
  ["bias-detector", "Bias Detector", "Herken en corrigeer AI-bias", "ai"],
  ["security-analyst", "Security Analyst", "Analyseer beveiligingsrisicos", "cyber"],
  // Year 2 - Period 2
  ["open-data-activist", "Open Data Activist", "Gebruik open data voor maatschappelijke impact", "data"],
  ["podcast-producer", "Podcast Producer", "Produceer een professionele podcast", "media"],
  ["infographic-designer", "Infographic Designer", "Ontwerp data-visualisaties", "creative"],
  ["network-detective", "Network Detective", "Analyseer netwerkverkeer en beveiliging", "cyber"],
  ["ab-tester", "A/B Tester", "Voer A/B-tests uit op digitale producten", "data"],
  ["automation-engineer", "Automation Engineer", "Automatiseer taken met scripts", "data"],
  // Year 2 - Period 3
  ["privacy-engineer", "Privacy Engineer", "Ontwerp privacy-by-design systemen", "cyber"],
  ["content-moderator", "Content Moderator", "Modereer online content met AI", "media"],
  ["accessibility-champion", "Accessibility Champion", "Maak websites toegankelijk voor iedereen", "creative"],
  ["cloud-architect", "Cloud Architect", "Ontwerp cloud-infrastructuur", "cyber"],
  ["digital-wellbeing-coach", "Digital Wellbeing Coach", "Help bij digitaal welzijn", "media"],
  ["version-control-master", "Version Control Master", "Beheer code met versiebeheer", "data"],
  // Year 2 - Period 4
  ["ai-ethicus", "AI Ethicus", "Onderzoek ethische vraagstukken rond AI", "ai"],
  ["blockchain-explorer", "Blockchain Explorer", "Verken blockchain-technologie", "data"],
  ["digital-rights-advocate", "Digital Rights Advocate", "Bescherm digitale rechten", "cyber"],
  ["innovation-lab", "Innovation Lab", "Ontwikkel innovatieve tech-oplossingen", "ai"],

  // Year 3 - Period 1
  ["systems-thinker", "Systems Thinker", "Analyseer complexe systemen", "data"],
  ["research-methodologist", "Research Methodologist", "Pas wetenschappelijke methoden toe", "data"],
  ["debate-moderator", "Debate Moderator", "Modereer debatten over technologie", "media"],
  ["tech-policy-advisor", "Tech Policy Advisor", "Adviseer over technologiebeleid", "media"],
  ["interdisciplinary-designer", "Interdisciplinary Designer", "Ontwerp interdisciplinaire oplossingen", "creative"],
  // Year 3 - Period 2
  ["sustainable-tech-designer", "Sustainable Tech Designer", "Ontwerp duurzame technologie", "creative"],
  ["data-ethics-officer", "Data Ethics Officer", "Waarborg ethisch datagebruik", "data"],
  ["community-tech-leader", "Community Tech Leader", "Leid technologie-initiatieven", "general"],
  ["future-of-work-analyst", "Future of Work Analyst", "Analyseer de toekomst van werk", "ai"],
  ["critical-ai-reviewer", "Critical AI Reviewer", "Review AI-systemen kritisch", "ai"],
  // Year 3 - Period 3
  ["digital-transformation-lead", "Digital Transformation Lead", "Leid digitale transformatie", "ai"],
  ["impact-assessor", "Impact Assessor", "Beoordeel technologische impact", "data"],
  ["cross-cultural-tech-mediator", "Cross-Cultural Tech Mediator", "Verbind culturen via technologie", "media"],
  ["emerging-tech-scout", "Emerging Tech Scout", "Verken opkomende technologieën", "ai"],
  ["capstone-architect", "Capstone Architect", "Ontwerp een eindproject", "creative"],
];

// ── Auth ────────────────────────────────────────────────────────────────────

function getServiceAccountKey() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!raw) {
    console.error("Error: GOOGLE_SERVICE_ACCOUNT_KEY is not set.");
    console.error("Export it: export GOOGLE_SERVICE_ACCOUNT_KEY='{ ... }'");
    process.exit(1);
  }
  return JSON.parse(raw);
}

function base64url(str) {
  return Buffer.from(str).toString("base64url");
}

async function getAccessToken() {
  const sa = getServiceAccountKey();
  const now = Math.floor(Date.now() / 1000);

  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64url(
    JSON.stringify({
      iss: sa.client_email,
      scope: "https://www.googleapis.com/auth/cloud-platform",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    })
  );

  const unsignedToken = `${header}.${payload}`;

  const sign = createSign("RSA-SHA256");
  sign.update(unsignedToken);
  const signature = sign.sign(sa.private_key, "base64url");

  const jwt = `${unsignedToken}.${signature}`;

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  });

  if (!tokenRes.ok) {
    const errText = await tokenRes.text();
    throw new Error(`Vertex AI auth failed (${tokenRes.status}): ${errText}`);
  }

  const tokenData = await tokenRes.json();
  return tokenData.access_token;
}

// ── Image generation ────────────────────────────────────────────────────────

function buildPrompt(title, description, themeColor) {
  return [
    "SAFE FOR CHILDREN. No violence, no sexual content, no scary imagery.",
    "Create a minimalist educational illustration on a soft gradient background.",
    `Subject: a single iconic object representing "${title}" — ${description}.`,
    `Style: flat design, soft rounded shapes, subtle shadows, pastel color palette based on ${themeColor}.`,
    "Clean, spacious composition with generous whitespace around the central object.",
    "No text, no words, no letters, no numbers in the image.",
    "No dark or neon backgrounds. Use a light, warm gradient background.",
    "The illustration should feel calm, modern, and educational.",
    "Aspect ratio: landscape (wider than tall, approximately 16:9).",
  ].join(" ");
}

async function generateImageGeminiApi(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_API_MODEL}:generateContent?key=${GOOGLE_API_KEY}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseModalities: ["IMAGE", "TEXT"],
        temperature: 0.4,
      },
    }),
  });

  if (!res.ok) {
    const errBody = await res.text().catch(() => "");
    throw new Error(`Gemini API error (${res.status}): ${errBody}`);
  }

  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts ?? [];
  const imagePart = parts.find((p) => p.inlineData?.data);

  if (!imagePart?.inlineData) {
    const textParts = parts.filter((p) => p.text).map((p) => p.text).join(" ");
    throw new Error(`No image in response. Text: ${textParts.slice(0, 200)}`);
  }

  return {
    base64: imagePart.inlineData.data,
    mimeType: imagePart.inlineData.mimeType,
  };
}

async function generateImageVertexAi(accessToken, prompt, projectId) {
  const url = `https://${VERTEX_LOCATION}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${VERTEX_LOCATION}/publishers/google/models/${VERTEX_MODEL}:generateContent`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseModalities: ["image", "text"],
        temperature: 0.4,
        maxOutputTokens: 4096,
      },
    }),
  });

  if (!res.ok) {
    const errBody = await res.text().catch(() => "");
    throw new Error(`Vertex AI error (${res.status}): ${errBody}`);
  }

  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts ?? [];
  const imagePart = parts.find((p) => p.inlineData?.data);

  if (!imagePart?.inlineData) {
    throw new Error("No image data in Vertex AI response");
  }

  return {
    base64: imagePart.inlineData.data,
    mimeType: imagePart.inlineData.mimeType,
  };
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const onlyFlag = args.find((a) => a.startsWith("--only="));
  const onlyIds = onlyFlag
    ? new Set(onlyFlag.replace("--only=", "").split(","))
    : null;

  // Determine which missions need images
  // Existing files use underscores (prompt_master.webp), check both formats
  const missing = MISSIONS.filter(([id]) => {
    if (onlyIds && !onlyIds.has(id)) return false;
    const kebab = join(ASSETS_DIR, `${id}.webp`);
    const snake = join(ASSETS_DIR, `${id.replace(/-/g, "_")}.webp`);
    return !existsSync(kebab) && !existsSync(snake);
  });

  if (missing.length === 0) {
    console.log("✓ All mission images exist. Nothing to generate.");
    return;
  }

  console.log(`\n${missing.length} mission image(s) to generate:\n`);
  for (const [id, title, , theme] of missing) {
    console.log(`  - ${id} (${title}) [${theme}]`);
  }

  if (dryRun) {
    console.log("\n--dry-run: No images generated.");
    return;
  }

  // Auth
  let accessToken = null;
  let projectId = null;

  if (USE_GEMINI_API) {
    console.log(`\nUsing Gemini API with API key (model: ${GEMINI_API_MODEL})`);
    console.log("✓ Ready\n");
  } else {
    console.log("\nAuthenticating with Vertex AI...");
    const sa = getServiceAccountKey();
    projectId = sa.project_id;
    accessToken = await getAccessToken();
    console.log("✓ Authenticated\n");
  }

  let success = 0;
  let failed = 0;
  const failures = [];

  for (let i = 0; i < missing.length; i++) {
    const [id, title, description, theme] = missing[i];
    const themeColor = THEME_COLORS[theme] || THEME_COLORS.general;
    const prompt = buildPrompt(title, description, themeColor);
    const outPath = join(ASSETS_DIR, `${id.replace(/-/g, "_")}.webp`);

    console.log(`[${i + 1}/${missing.length}] Generating: ${id}...`);

    try {
      const { base64, mimeType } = USE_GEMINI_API
        ? await generateImageGeminiApi(prompt)
        : await generateImageVertexAi(accessToken, prompt, projectId);

      // Determine extension from mime type
      const ext = mimeType === "image/png" ? "png" : "webp";
      const finalPath = ext === "png"
        ? outPath.replace(".webp", ".png")
        : outPath;

      writeFileSync(finalPath, Buffer.from(base64, "base64"));
      const sizeKb = (Buffer.from(base64, "base64").length / 1024).toFixed(1);
      console.log(`  ✓ Saved: ${finalPath} (${sizeKb} KB, ${mimeType})`);
      success++;
    } catch (err) {
      console.error(`  ✗ Failed: ${err.message}`);
      failures.push([id, err.message]);
      failed++;

      // Back off extra on rate limit errors
      if (err.message.includes("429")) {
        console.log("  ⏳ Rate limited — waiting 60s...");
        await sleep(60_000);
      }
    }

    // Rate limit delay between requests (skip after last)
    if (i < missing.length - 1) {
      await sleep(RATE_LIMIT_DELAY_MS);
    }
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`✓ Success: ${success}`);
  if (failed > 0) {
    console.log(`✗ Failed:  ${failed}`);
    console.log(`\nFailed missions (retry with --only=):`);
    console.log(`  --only=${failures.map(([id]) => id).join(",")}`);
  }
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
