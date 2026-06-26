import { readFileSync } from 'node:fs';
import { Buffer } from 'node:buffer';
import ts from 'typescript';

const failures = [];
const assert = (condition, message) => {
  if (!condition) failures.push(message);
};
const read = (path) => readFileSync(path, 'utf8');

const moderationSource = read('supabase/functions/_shared/moderationClient.ts');
const compiled = ts.transpileModule(moderationSource, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2022,
    importsNotUsedAsValues: ts.ImportsNotUsedAsValues.Remove,
  },
}).outputText;
const moduleUrl = `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`;
const moderation = await import(moduleUrl);

const safe = moderation.parseMistralModerationPayload({
  results: [{ categories: { sexual: false, selfharm: false }, category_scores: { sexual: 0.01, selfharm: 0.02 } }],
}, 0.5);
assert(safe.safe === true, 'Safe moderation payload should remain safe.');
assert(safe.violated === false, 'Safe moderation payload should not be violated.');

const blockedBoolean = moderation.parseMistralModerationPayload({
  results: [{ categories: { sexual: true }, category_scores: { sexual: 0.91 } }],
}, 0.5);
assert(blockedBoolean.safe === false, 'Boolean category hit should block.');
assert(blockedBoolean.category === 'sexual', 'Sexual category should normalize correctly.');
assert(blockedBoolean.fallback && !blockedBoolean.fallback.includes('Mistral'), 'Fallback must be pupil-safe and provider-neutral.');

const blockedScore = moderation.parseMistralModerationPayload({
  results: [{ categories: { dangerous_and_criminal: false }, category_scores: { dangerous_and_criminal: 0.82 } }],
}, 0.5);
assert(blockedScore.safe === false, 'Score over threshold should block.');
assert(blockedScore.category === 'dangerous_and_criminal_content', 'Dangerous/criminal aliases should normalize.');

const logOnly = moderation.parseMistralModerationPayload({
  results: [{ categories: { health: true, financial: true, law: true }, category_scores: { health: 0.99, financial: 0.99, law: 0.99 } }],
}, 0.5);
assert(logOnly.safe === true, 'Health/financial/law categories should be log-only by default.');
assert(logOnly.logOnlyCategories.length === 3, 'Log-only categories should be preserved for telemetry.');

const malformed = moderation.parseMistralModerationPayload({ unexpected: true }, 0.5);
assert(malformed.safe === true, 'Malformed successful provider payload should not invent a violation.');

const mistralClient = read('supabase/functions/_shared/mistralClient.ts');
assert(mistralClient.includes('safe_prompt: true'), 'Mistral calls must keep safe_prompt enabled.');
assert(mistralClient.includes('guardrails'), 'Mistral calls must attach inline guardrails.');
assert(mistralClient.includes('moderation_llm_v2'), 'Inline guardrail must use Mistral moderation_llm_v2.');

for (const [name, source] of [
  ['chat', read('supabase/functions/chat/index.ts')],
  ['chatStream', read('supabase/functions/chatStream/index.ts')],
  ['demo-chat', read('supabase/functions/demo-chat/index.ts')],
]) {
  assert(source.includes('moderateMistralText'), `${name} must use Mistral moderation.`);
  assert(source.includes('moderation_category'), `${name} must log moderation category metadata.`);
  assert(!/\b(prompt|message|response)_(text|body|content)\b/i.test(source), `${name} must not log raw prompt/response content.`);
}

const chatCore = read('supabase/functions/_shared/chatCore.ts');
assert(chatCore.includes('mistral_moderation_input'), 'Authenticated chat input must be moderated after sanitization/redaction.');

const chatStream = read('supabase/functions/chatStream/index.ts');
const firstModeration = chatStream.indexOf('await moderateMistralText(accumulatedText)');
const firstTextEnqueue = chatStream.indexOf('JSON.stringify({ text: approvedText })');
assert(firstModeration !== -1 && firstTextEnqueue !== -1 && firstModeration < firstTextEnqueue, 'chatStream must moderate full output before sending text.');

if (failures.length) {
  console.error(`Mistral moderation contract failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Mistral moderation contract passed');
