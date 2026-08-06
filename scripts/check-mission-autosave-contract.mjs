import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync('src/hooks/useMissionAutoSave.ts', 'utf8');

assert.match(
  source,
  /const projectId = new URL\(supabaseUrl\)\.hostname\.split\('\.'\)\[0\][\s\S]*`sb-\$\{projectId\}-auth-token`/,
  'mission auto-save must read identity only from the configured Supabase project session',
);
assert.doesNotMatch(
  source,
  /Object\.keys\(localStorage\)\.find/,
  'mission auto-save must not select an arbitrary Supabase project token',
);

assert.match(
  source,
  /const clearedRef = useRef\(false\)/,
  'mission auto-save must remember an explicit completion cleanup',
);
assert.match(
  source,
  /const timer = setTimeout\(\(\) => \{\s*if \(clearedRef\.current\) return;/,
  'pending debounced saves must not recreate cleared mission progress',
);
assert.ok(
  (source.match(/if \(clearedRef\.current\) return;/g) || []).length >= 3,
  'beforeunload and unmount must not recreate cleared mission progress',
);
assert.match(
  source,
  /const storage = userId \? localStorage : sessionStorage/,
  'authenticated saves must be durable while anonymous preview saves stay tab-scoped',
);
assert.match(
  source,
  /\? `\$\{STORAGE_PREFIX\}\$\{userId\}_\$\{missionId\}`[\s\S]*: `\$\{STORAGE_PREFIX\}anonymous-preview_\$\{missionId\}`/,
  'mission auto-save keys must separate authenticated users from anonymous previews',
);
assert.match(
  source,
  /const clearSave = useCallback\(\(\) => \{\s*clearedRef\.current = true;[\s\S]*storage\.removeItem\(storageKey\)/,
  'clearSave must suppress future flushes before removing local progress',
);
assert.match(
  source,
  /useEffect\(\(\) => \{\s*clearedRef\.current = false;\s*\}, \[storageKey\]\)/,
  'mission auto-save must resume when a mounted hook changes storage identity',
);

console.log('Mission auto-save contract checks passed');
