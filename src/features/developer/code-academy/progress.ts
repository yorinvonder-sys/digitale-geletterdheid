import { ACADEMY_LESSON_IDS } from './academyContent';

const STORAGE_KEY_V2 = 'dgskills-code-academy-progress-v2';
const STORAGE_KEY_V1 = 'dgskills-code-academy-progress-v1';

function normalizeLessonIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return [...new Set(
    value.filter((item): item is string =>
      typeof item === 'string' && ACADEMY_LESSON_IDS.has(item)
    )
  )];
}

function readJson(key: string): unknown {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function readAcademyProgress(): string[] {
  if (typeof window === 'undefined') return [];

  const current = normalizeLessonIds(readJson(STORAGE_KEY_V2));
  if (current.length > 0 || window.localStorage.getItem(STORAGE_KEY_V2) !== null) {
    return current;
  }

  const legacy = normalizeLessonIds(readJson(STORAGE_KEY_V1));
  if (legacy.length > 0) {
    writeAcademyProgress(legacy);
  }
  return legacy;
}

export function writeAcademyProgress(ids: string[]): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(
      STORAGE_KEY_V2,
      JSON.stringify(normalizeLessonIds(ids))
    );
  } catch {
    // De academie blijft bruikbaar wanneer opslag is geblokkeerd of vol is.
  }
}

export function resetAcademyProgress(): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.removeItem(STORAGE_KEY_V2);
  } catch {
    // Geen foutscherm nodig: alleen lokale voortgang kan niet worden gewist.
  }
}
