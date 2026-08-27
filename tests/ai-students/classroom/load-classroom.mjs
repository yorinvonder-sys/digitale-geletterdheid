import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadPersonas } from '../persona/load-personas.mjs';

const DEFAULT_CLASSROOM_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
const REQUIRED_ARRAYS = ['preferredViewports', 'interests', 'interruptionBehavior', 'engagesWhen', 'quitsWhen', 'watchFor'];
const INHERITED_FIELDS = ['age', 'readingLevel', 'digitalSkill', 'deviceProfile', 'preferredViewports'];
const READING_LEVELS = new Set(['low', 'a2-b1', 'average', 'high']);
const DIGITAL_SKILLS = new Set(['low', 'average', 'high']);
const DEVICE_PROFILES = new Set(['desktop', 'tablet', 'mixed']);
const VIEWPORTS = new Set(['desktop', 'ipad-portrait', 'ipad-landscape', 'mobile']);
const EDUCATION_LEVELS = new Set(['mavo', 'havo', 'vwo']);
const MOTIVATIONS = new Set(['gedreven', 'meewerkend', 'lauw', 'zit-het-uit']);
const ATTENTION_SPANS = new Set(['kort', 'gemiddeld', 'lang']);
const INTERESTS = new Set([
  'gaming',
  'social-media',
  'sport',
  'creatief',
  'geld-business',
  'dieren-zorg',
  'tech-bouwen',
  'geen-uitgesproken',
]);

function fail(source, field, message) {
  throw new Error(`${source}: ${field} ${message}`);
}

export function validateClassroomProfile(profile, source = 'profiel') {
  if (!profile || typeof profile !== 'object' || Array.isArray(profile)) fail(source, '$', 'moet een object zijn');
  if (profile.schemaVersion !== 1) fail(source, 'schemaVersion', 'moet 1 zijn');
  if (typeof profile.id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(profile.id)) fail(source, 'id', 'heeft een ongeldig formaat');
  if (typeof profile.displayName !== 'string' || profile.displayName.trim().length < 2) fail(source, 'displayName', 'is verplicht');
  if (profile.derivedFrom !== null && typeof profile.derivedFrom !== 'string') fail(source, 'derivedFrom', 'moet een persona-id of null zijn');
  if (!Number.isInteger(profile.age) || profile.age < 10 || profile.age > 18) fail(source, 'age', 'moet een geheel getal tussen 10 en 18 zijn');
  if (!READING_LEVELS.has(profile.readingLevel)) fail(source, 'readingLevel', 'is ongeldig');
  if (!DIGITAL_SKILLS.has(profile.digitalSkill)) fail(source, 'digitalSkill', 'is ongeldig');
  if (!DEVICE_PROFILES.has(profile.deviceProfile)) fail(source, 'deviceProfile', 'is ongeldig');
  if (!EDUCATION_LEVELS.has(profile.educationLevel)) fail(source, 'educationLevel', 'is ongeldig');
  if (!MOTIVATIONS.has(profile.motivation)) fail(source, 'motivation', 'is ongeldig');
  if (!ATTENTION_SPANS.has(profile.attentionSpan)) fail(source, 'attentionSpan', 'is ongeldig');
  if (profile.yearGroupFocus !== null && ![1, 2, 3].includes(profile.yearGroupFocus)) fail(source, 'yearGroupFocus', 'moet 1, 2, 3 of null zijn');

  for (const field of REQUIRED_ARRAYS) {
    if (!Array.isArray(profile[field]) || profile[field].length === 0 || profile[field].some((value) => typeof value !== 'string' || !value.trim())) {
      fail(source, field, 'moet minimaal één niet-lege tekst bevatten');
    }
  }
  for (const viewport of profile.preferredViewports) {
    if (!VIEWPORTS.has(viewport)) fail(source, 'preferredViewports', `bevat onbekend profiel ${viewport}`);
  }
  for (const interest of profile.interests) {
    if (!INTERESTS.has(interest)) fail(source, 'interests', `bevat onbekend onderwerp ${interest}`);
  }

  const { persistence } = profile;
  if (typeof persistence !== 'number' || !Number.isFinite(persistence) || persistence < 0 || persistence > 1) {
    fail(source, 'persistence', 'moet tussen 0 en 1 liggen');
  }
  if (typeof profile.roleplayBrief !== 'string' || profile.roleplayBrief.trim().length < 80) {
    fail(source, 'roleplayBrief', 'moet een bruikbare rolbeschrijving van minimaal 80 tekens zijn');
  }
  return profile;
}

/**
 * Een afgeleid profiel mag de basispersona niet stilzwijgend tegenspreken: als
 * `personas/<id>.json` verandert en het klasprofiel niet, kiest de skill een
 * leerling op verouderde eigenschappen. Deze check dwingt af dat ze gelijk blijven.
 */
export function assertNoDriftFromBase(profile, basePersona, source = 'profiel') {
  for (const field of INHERITED_FIELDS) {
    const expected = JSON.stringify(basePersona[field]);
    const actual = JSON.stringify(profile[field]);
    if (expected !== actual) {
      fail(source, field, `wijkt af van personas/${basePersona.id}.json (verwacht ${expected}, gevonden ${actual})`);
    }
  }
  return profile;
}

export async function loadClassroom(directory = DEFAULT_CLASSROOM_DIR) {
  const entries = await readdir(directory, { withFileTypes: true });
  const fileNames = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json') && !entry.name.endsWith('.schema.json'))
    .map((entry) => entry.name)
    .sort();

  const basePersonas = new Map((await loadPersonas()).map((persona) => [persona.id, persona]));
  const profiles = [];
  const ids = new Set();

  for (const fileName of fileNames) {
    const filePath = path.join(directory, fileName);
    let profile;
    try {
      profile = JSON.parse(await readFile(filePath, 'utf8'));
    } catch (error) {
      throw new Error(`${filePath}: ongeldige JSON (${error.message})`);
    }
    validateClassroomProfile(profile, filePath);

    if (profile.derivedFrom !== null) {
      const base = basePersonas.get(profile.derivedFrom);
      if (!base) fail(filePath, 'derivedFrom', `verwijst naar onbekende persona ${profile.derivedFrom}`);
      assertNoDriftFromBase(profile, base, filePath);
    }

    if (ids.has(profile.id)) throw new Error(`${filePath}: dubbel profiel-id ${profile.id}`);
    ids.add(profile.id);
    profiles.push(Object.freeze(profile));
  }
  return profiles;
}

export async function loadClassroomProfile(id, directory = DEFAULT_CLASSROOM_DIR) {
  const profiles = await loadClassroom(directory);
  const profile = profiles.find((candidate) => candidate.id === id);
  if (!profile) throw new Error(`Onbekend klasprofiel "${id}".`);
  return profile;
}
