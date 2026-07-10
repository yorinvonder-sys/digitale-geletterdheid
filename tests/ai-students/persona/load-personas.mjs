import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULT_PERSONA_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../personas');
const REQUIRED_ARRAYS = ['readingBehavior', 'decisionBehavior', 'errorBehavior', 'helpBehavior', 'testGoals'];
const REQUIRED_WEIGHTS = [
  'readingCoverage',
  'decisionSpeed',
  'uncertainty',
  'errorRate',
  'hintUsage',
  'backtrackRate',
  'shortcutSeeking',
  'manipulationAttempt',
  'touchReliance',
];
const VIEWPORTS = new Set(['desktop', 'ipad-portrait', 'ipad-landscape', 'mobile']);

function fail(source, field, message) {
  throw new Error(`${source}: ${field} ${message}`);
}

export function validatePersona(persona, source = 'persona') {
  if (!persona || typeof persona !== 'object' || Array.isArray(persona)) fail(source, '$', 'moet een object zijn');
  if (persona.schemaVersion !== 1) fail(source, 'schemaVersion', 'moet 1 zijn');
  if (typeof persona.id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(persona.id)) fail(source, 'id', 'heeft een ongeldig formaat');
  if (typeof persona.displayName !== 'string' || persona.displayName.trim().length < 2) fail(source, 'displayName', 'is verplicht');
  if (!Number.isInteger(persona.age) || persona.age < 10 || persona.age > 18) fail(source, 'age', 'moet een geheel getal tussen 10 en 18 zijn');
  if (!['low', 'a2-b1', 'average', 'high'].includes(persona.readingLevel)) fail(source, 'readingLevel', 'is ongeldig');
  if (!['low', 'average', 'high'].includes(persona.digitalSkill)) fail(source, 'digitalSkill', 'is ongeldig');
  if (!['desktop', 'tablet', 'mixed'].includes(persona.deviceProfile)) fail(source, 'deviceProfile', 'is ongeldig');

  for (const field of REQUIRED_ARRAYS) {
    if (!Array.isArray(persona[field]) || persona[field].length === 0 || persona[field].some((value) => typeof value !== 'string' || !value.trim())) {
      fail(source, field, 'moet minimaal één niet-lege tekst bevatten');
    }
  }

  if (!Array.isArray(persona.preferredViewports) || persona.preferredViewports.length === 0) fail(source, 'preferredViewports', 'is verplicht');
  for (const viewport of persona.preferredViewports) {
    if (!VIEWPORTS.has(viewport)) fail(source, 'preferredViewports', `bevat onbekend profiel ${viewport}`);
  }

  if (!persona.behaviorWeights || typeof persona.behaviorWeights !== 'object') fail(source, 'behaviorWeights', 'is verplicht');
  for (const field of REQUIRED_WEIGHTS) {
    const value = persona.behaviorWeights[field];
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 1) {
      fail(source, `behaviorWeights.${field}`, 'moet tussen 0 en 1 liggen');
    }
  }
  if (typeof persona.seedSalt !== 'string' || persona.seedSalt.length < 3) fail(source, 'seedSalt', 'is verplicht');
  return persona;
}

export async function loadPersonas(directory = DEFAULT_PERSONA_DIR) {
  const entries = await readdir(directory, { withFileTypes: true });
  const fileNames = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json') && entry.name !== 'persona.schema.json')
    .map((entry) => entry.name)
    .sort();
  const personas = [];
  const ids = new Set();

  for (const fileName of fileNames) {
    const filePath = path.join(directory, fileName);
    let persona;
    try {
      persona = JSON.parse(await readFile(filePath, 'utf8'));
    } catch (error) {
      throw new Error(`${filePath}: ongeldige JSON (${error.message})`);
    }
    validatePersona(persona, filePath);
    if (ids.has(persona.id)) throw new Error(`${filePath}: dubbele persona-id ${persona.id}`);
    ids.add(persona.id);
    personas.push(Object.freeze(persona));
  }
  return personas;
}

export async function loadPersona(id, directory = DEFAULT_PERSONA_DIR) {
  const personas = await loadPersonas(directory);
  const persona = personas.find((candidate) => candidate.id === id);
  if (!persona) throw new Error(`Onbekende persona "${id}".`);
  return persona;
}
