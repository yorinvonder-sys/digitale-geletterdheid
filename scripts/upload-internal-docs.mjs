#!/usr/bin/env node
/**
 * Uploads internal markdown docs to the private 'internal-docs' Supabase storage bucket.
 * Uses service role to bypass RLS (read access is restricted to developer/admin via RLS).
 *
 * Run from project root:
 *   node scripts/upload-internal-docs.mjs
 *
 * Vereist in .env.local:
 *   VITE_SUPABASE_URL=https://xxx.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY=eyJ...
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// Laad .env.local handmatig (Node.js laadt dit niet automatisch)
function loadEnvLocal() {
  const envPath = resolve(root, '.env.local');
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx < 0) continue;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = val;
  }
}
loadEnvLocal();

const supabaseUrl = (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '').trim();
const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    'Ontbrekende env vars. Voeg toe aan .env.local:\n' +
    '  VITE_SUPABASE_URL=https://xxx.supabase.co\n' +
    '  SUPABASE_SERVICE_ROLE_KEY=eyJ...'
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

const BUCKET = 'internal-docs';
const FOLDER = 'overdracht';

const docs = [
  '00-eigenaarschaps-besluit.md',
  '01-juridisch-dossier-voor-school.md',
  '02-kosten-overdracht.md',
  '03-pilot-propositie-school.md',
];

async function ensureBucket() {
  // Probeer bucket aan te maken; als die al bestaat negeert Supabase dat.
  const { error } = await supabase.storage.createBucket(BUCKET, {
    public: false,
    fileSizeLimit: 10 * 1024 * 1024,
    allowedMimeTypes: ['text/markdown', 'text/plain', 'application/pdf'],
  });
  // "already exists" is geen probleem
  if (error && !error.message.toLowerCase().includes('already exist')) {
    console.error(`Bucket aanmaken mislukt: ${error.message}`);
    process.exit(1);
  }
}

async function uploadDocs() {
  console.log(`Verbinden met ${supabaseUrl}...`);
  await ensureBucket();
  console.log(`Uploaden naar bucket '${BUCKET}/${FOLDER}'...`);

  let ok = 0;
  let fail = 0;

  for (const filename of docs) {
    const localPath = resolve(root, 'business/nl-vo/overdracht', filename);

    if (!existsSync(localPath)) {
      console.warn(`  [skip] ${filename} — niet gevonden op ${localPath}`);
      fail++;
      continue;
    }

    // Blob geeft betere compatibiliteit met supabase-js dan raw Buffer
    const blob = new Blob([readFileSync(localPath)], { type: 'text/markdown' });
    const storagePath = `${FOLDER}/${filename}`;

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, blob, { upsert: true });

    if (error) {
      console.error(`  [fout] ${filename}: ${error.message}`);
      fail++;
    } else {
      console.log(`  [ok]   ${filename}`);
      ok++;
    }
  }

  console.log(`\nKlaar: ${ok} geüpload, ${fail} mislukt/overgeslagen.`);
  if (fail > 0) process.exit(1);
}

uploadDocs().catch((err) => {
  console.error('Onverwachte fout:', err);
  process.exit(1);
});
