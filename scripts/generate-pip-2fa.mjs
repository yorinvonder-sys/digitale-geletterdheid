/**
 * Generate a new DGSkills beaver 2FA image using Gemini image generation.
 * Sends reference beaver images to maintain style consistency.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const API_KEY = process.env.GOOGLE_API_KEY;
if (!API_KEY) {
  console.error('GOOGLE_API_KEY not set. Source .env.local first.');
  process.exit(1);
}

// Load reference images as base64
function loadImage(relativePath) {
  const buf = readFileSync(join(ROOT, relativePath));
  return buf.toString('base64');
}

const references = [
  { path: 'public/brand-redesign/otter/dgskills-beaver-phone-logo-transparent.png', label: 'DGSkills beaver with phone logo' },
  { path: 'public/brand-redesign/otter/dgskills-beaver-phone-favicon-512.png', label: 'DGSkills beaver favicon' },
  { path: 'public/assets/storytelling/beaver-storyteller.webp', label: 'DGSkills beaver storyteller illustration' },
];

const imageParts = references.map(ref => ({
  inline_data: {
    mime_type: 'image/png',
    data: loadImage(ref.path),
  }
}));

const textParts = references.map(ref => ({
  text: `Reference image: ${ref.label}`
}));

// Interleave text labels with images
const referenceParts = references.flatMap((ref, i) => [
  { text: `Reference ${i + 1}: ${ref.label}` },
  { inline_data: { mime_type: 'image/png', data: loadImage(ref.path) } },
]);

const prompt = `You are a professional illustrator. I need you to generate a NEW illustration of this DGSkills beaver mascot in a specific pose.

CRITICAL STYLE REQUIREMENTS — match these EXACTLY from the reference images:
- Flat 2D line-art style with clean BLACK OUTLINES
- Warm brown beaver fur with a teal hoodie and coral accent
- Digital pixel sparkles/particles emanating from the flat tail or phone edge
- Simple round black eye with a small white highlight
- Friendly buck teeth, rounded ears, and a flat beaver tail
- Clean, minimalist, graphic illustration style
- NO 3D shading, NO chibi/kawaii style, NO soft gradients
- The style is closer to a clean vector illustration with hand-drawn charm

POSE FOR THIS IMAGE:
- The beaver is holding a smartphone in one paw, showing a 2FA/authenticator app on the screen
- The phone screen shows a 6-digit code or a shield icon
- The beaver looks confident and helpful, slightly turned toward the viewer
- The other paw could be giving a thumbs-up or pointing at the phone
- Standing on both feet

COMPOSITION:
- Character centered, transparent/white background
- Square aspect ratio (will be used at 96x96 to 200x200 pixels)
- No background circle or decorative elements
- Leave some padding around the character

Generate ONLY the image, matching the exact art style of the reference images.`;

async function generate() {
  console.log('Sending request to Gemini with', references.length, 'reference images...');

  const body = {
    contents: [{
      parts: [
        { text: prompt },
        ...referenceParts,
      ]
    }],
    generationConfig: {
      responseModalities: ['IMAGE', 'TEXT'],
      temperature: 1.0,
    },
  };

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${API_KEY}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error('API error:', res.status, errText);
    process.exit(1);
  }

  const data = await res.json();

  // Extract generated image from response
  const candidates = data.candidates || [];
  if (candidates.length === 0) {
    console.error('No candidates returned.');
    console.log(JSON.stringify(data, null, 2));
    process.exit(1);
  }

  const parts = candidates[0].content?.parts || [];
  let imageFound = false;
  let attempt = 1;

  for (const part of parts) {
    const imgData = part.inline_data || part.inlineData;
    if (imgData) {
      const mime = imgData.mime_type || imgData.mimeType || 'image/png';
      const ext = mime.includes('png') ? 'png' : 'webp';
      const outPath = join(ROOT, `public/brand-redesign/otter/dgskills-beaver-phone-2fa-new-${attempt}.${ext}`);
      writeFileSync(outPath, Buffer.from(imgData.data, 'base64'));
      console.log(`Image saved to: ${outPath}`);
      imageFound = true;
      attempt++;
    }
    if (part.text) {
      console.log('Model response:', part.text);
    }
  }

  if (!imageFound) {
    console.error('No image in response. Parts:', JSON.stringify(parts.map(p => Object.keys(p)), null, 2));
  }
}

generate().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
