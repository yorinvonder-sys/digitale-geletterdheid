import { readFileSync, existsSync, readdirSync } from 'node:fs';

const failures = [];

const read = (path) => readFileSync(path, 'utf8');
const assert = (condition, message) => {
  if (!condition) failures.push(message);
};

const migrations = readdirSync('supabase/migrations')
  .filter((name) => name.endsWith('_add_ai_usage_events.sql'))
  .sort();
const migrationPath = migrations.length
  ? `supabase/migrations/${migrations.at(-1)}`
  : null;

assert(Boolean(migrationPath), 'Missing add_ai_usage_events migration.');

const migration = migrationPath ? read(migrationPath) : '';
const helperPath = 'supabase/functions/_shared/aiUsageLogger.ts';
const helper = existsSync(helperPath) ? read(helperPath) : '';
const chatCore = read('supabase/functions/_shared/chatCore.ts');
const chat = read('supabase/functions/chat/index.ts');
const chatStream = read('supabase/functions/chatStream/index.ts');
const generateImage = read('supabase/functions/generateImage/index.ts');
const analyzeDrawing = read('supabase/functions/analyzeDrawing/index.ts');
const demoChat = read('supabase/functions/demo-chat/index.ts');
const client = read('src/services/geminiService.ts');
const agentLogic = read('src/hooks/useAgentLogic.ts');

assert(migration.includes('create table if not exists public.ai_usage_events'), 'Migration must create public.ai_usage_events.');
assert(migration.includes('alter table public.ai_usage_events enable row level security'), 'ai_usage_events must enable RLS.');
assert(migration.includes('revoke all on public.ai_usage_events from anon, authenticated'), 'ai_usage_events should revoke broad direct access.');
assert(migration.includes('grant insert on public.ai_usage_events to service_role'), 'service_role must be able to insert telemetry.');
assert(migration.includes('public.is_teacher_in_school'), 'Teacher/admin reads must be school-scoped through existing helper.');
assert(!/\b(prompt|message|response|image)_(text|body|content)\b/i.test(migration), 'Telemetry schema must not store prompt/message/response/image content.');

assert(helper.includes('export function resolveAiRequestId'), 'Helper must export resolveAiRequestId.');
assert(helper.includes('export function extractUsageMetadata'), 'Helper must export extractUsageMetadata.');
assert(helper.includes('export async function logAiUsageEvent'), 'Helper must export logAiUsageEvent.');
for (const field of ['promptTokenCount', 'candidatesTokenCount', 'totalTokenCount', 'cachedContentTokenCount', 'thoughtsTokenCount']) {
  assert(helper.includes(field), `Helper must extract ${field}.`);
}
assert(helper.includes('SUPABASE_SERVICE_ROLE_KEY'), 'Helper must use service-role inserts server-side.');
assert(!/\bprompt\b.*metadata|metadata.*\bprompt\b/i.test(helper), 'Helper metadata must not store prompt content.');

assert(chatCore.includes('clientRequestId?: string'), 'Chat request type must accept optional clientRequestId.');
assert(chatCore.includes('requestId:'), 'Validated chat request must expose a requestId.');
assert(chatCore.includes('MAX_MESSAGE_LENGTH = 4_000'), 'Chat max message length should align with prompt sanitizer.');
assert(chatCore.includes('MAX_GAME_CONTEXT_LENGTH = 40_000'), 'Game context limit should be reduced.');
assert(chatCore.includes('CODE_MAX_OUTPUT_TOKENS = 4096'), 'Code output budget should be reduced.');
assert(chatCore.includes('maxMessages: 12'), 'Server chat history should be limited to about 12 messages.');
assert(chatCore.includes('maxPartChars: 2_000'), 'Server chat history part size should be reduced.');
assert(chatCore.includes('maxTotalChars: 12_000'), 'Server chat history total size should be reduced.');

for (const [name, source] of [
  ['chat', chat],
  ['chatStream', chatStream],
  ['generateImage', generateImage],
  ['analyzeDrawing', analyzeDrawing],
  ['demo-chat', demoChat],
]) {
  assert(source.includes('logAiUsageEvent'), `${name} must log AI usage events.`);
  assert(source.includes('X-AI-Request-Id'), `${name} must return X-AI-Request-Id.`);
}

assert(client.includes('createAiRequestId'), 'Client must generate stable AI request ids.');
assert(client.includes('clientRequestId'), 'Client must send clientRequestId.');
assert(!client.includes('response.status === 429 ||'), 'Client fetchWithRetry must not retry 429 responses.');
assert(client.includes('maxRetries = 1'), 'Client fetchWithRetry should retry transient failures only once.');
assert(client.includes('this.trimHistory()'), 'Streaming and non-streaming chat should trim history through a shared method.');
assert(agentLogic.includes('MAX_AUTO_IMAGE_GENERATIONS_PER_RESPONSE'), 'Automatic [IMG] generation must be capped.');

if (failures.length) {
  console.error(`AI usage telemetry contract failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('AI usage telemetry contract passed');
