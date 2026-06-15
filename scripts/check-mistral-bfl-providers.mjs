import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';

const failures = [];
const read = (path) => readFileSync(path, 'utf8');
const assert = (condition, message) => {
  if (!condition) failures.push(message);
};

const mistralPath = 'supabase/functions/_shared/mistralClient.ts';
const bflPath = 'supabase/functions/_shared/bflImageClient.ts';

assert(existsSync(mistralPath), 'Missing shared Mistral adapter.');
assert(existsSync(bflPath), 'Missing shared BFL image adapter.');

const mistral = existsSync(mistralPath) ? read(mistralPath) : '';
const bfl = existsSync(bflPath) ? read(bflPath) : '';
const chat = read('supabase/functions/chat/index.ts');
const chatStream = read('supabase/functions/chatStream/index.ts');
const growth = read('supabase/functions/growthRecommendation/index.ts');
const taskSuggestions = read('supabase/functions/getTaskSuggestions/index.ts');
const validateTask = read('supabase/functions/validateDeveloperTask/index.ts');
const developerPlan = read('supabase/functions/generateDeveloperPlan/index.ts');
const demoChat = read('supabase/functions/demo-chat/index.ts');
const generateImage = read('supabase/functions/generateImage/index.ts');
const analyzeDrawing = read('supabase/functions/analyzeDrawing/index.ts');
const scanReceipt = read('supabase/functions/scanReceipt/index.ts');
const clientAiProviderService = read('src/services/aiProviderService.ts');
const usageLogger = read('supabase/functions/_shared/aiUsageLogger.ts');
const systemInstructions = read('supabase/functions/_shared/systemInstructions.ts');
const legacyImageModelsSymbol = 'GEMINI' + '_IMAGE_MODELS';
const legacyApiKeySymbol = 'GEMINI' + '_API_KEY';
const legacyGoogleApiHost = 'generative' + 'language.googleapis.com';

assert(mistral.includes('MISTRAL_API_KEY'), 'Mistral adapter must read MISTRAL_API_KEY server-side.');
assert(mistral.includes('mistral-small-latest'), 'Mistral adapter must default to mistral-small-latest.');
assert(mistral.includes('/v1/chat/completions'), 'Mistral adapter must call the chat completions API.');
assert(mistral.includes('streamMistralChat'), 'Mistral adapter must support streaming chat.');
assert(mistral.includes('completeMistralJson'), 'Mistral adapter must support JSON completion helpers.');

for (const [name, source] of [
  ['chat', chat],
  ['growthRecommendation', growth],
  ['getTaskSuggestions', taskSuggestions],
  ['validateDeveloperTask', validateTask],
  ['generateDeveloperPlan', developerPlan],
  ['demo-chat', demoChat],
]) {
  assert(source.includes('completeMistral'), `${name} must use the Mistral completion adapter.`);
}
assert(chatStream.includes('streamMistralChat'), 'chatStream must use the Mistral streaming adapter.');

for (const [name, source] of [
  ['chat', chat],
  ['chatStream', chatStream],
  ['growthRecommendation', growth],
  ['getTaskSuggestions', taskSuggestions],
  ['validateDeveloperTask', validateTask],
  ['generateDeveloperPlan', developerPlan],
  ['demo-chat', demoChat],
  ['analyzeDrawing', analyzeDrawing],
  ['scanReceipt', scanReceipt],
]) {
  assert(!source.includes('getVertexUrl'), `${name} must not call Vertex getVertexUrl for text AI.`);
  assert(!source.includes('getAccessToken'), `${name} must not use Vertex access tokens for text AI.`);
}

assert(bfl.includes('BFL_API_KEY'), 'BFL adapter must read BFL_API_KEY server-side.');
assert(bfl.includes('api.eu.bfl.ai'), 'BFL adapter must default to the EU endpoint.');
assert(bfl.includes('flux-2-klein-9b'), 'BFL adapter must default to flux-2-klein-9b.');
assert(bfl.includes('polling_url'), 'BFL adapter must poll the provider result URL.');
assert(bfl.includes('arrayBuffer'), 'BFL adapter must download generated images server-side.');
assert(generateImage.includes('generateFluxImage'), 'generateImage must use the BFL adapter.');
assert(analyzeDrawing.includes('completeMistralVisionJson'), 'analyzeDrawing must use the Mistral vision adapter.');
assert(scanReceipt.includes('processMistralOcr'), 'scanReceipt must use the Mistral OCR adapter.');
assert(!generateImage.includes(legacyImageModelsSymbol), 'generateImage must not keep legacy image model routing.');
assert(!generateImage.includes(legacyApiKeySymbol), 'generateImage must not keep legacy API key fallback.');
assert(!generateImage.includes('getVertexUrl'), 'generateImage must not call Vertex for image generation.');
assert(!clientAiProviderService.includes('generateImageWithClientApiKey'), 'Client image generation must not keep a direct provider fallback.');
assert(!clientAiProviderService.includes(legacyImageModelsSymbol), 'Client image generation must not reference legacy image models.');
assert(!clientAiProviderService.includes(legacyGoogleApiHost), 'Client chat/image code must not call legacy Google AI APIs directly.');
assert(!clientAiProviderService.includes(legacyApiKeySymbol), 'Client chat/image code must not read legacy AI API keys.');

assert(usageLogger.includes('completion_tokens'), 'Usage logger must extract Mistral completion_tokens.');
assert(usageLogger.includes('prompt_tokens'), 'Usage logger must extract Mistral prompt_tokens.');
assert(usageLogger.includes('event.provider ??'), 'Usage logger must preserve provider override.');
assert(usageLogger.includes('event.provider ?? "mistral"'), 'Usage logger provider fallback must be mistral.');
assert(!usageLogger.includes('google-vertex'), 'Usage logger must not default to a legacy Google provider.');

const serverRoleIds = new Set([...systemInstructions.matchAll(/^  "([^"]+)":/gm)].map((match) => match[1]));
const studentChatRoleIds = new Set(['student-assistant']);

function walkSourceFiles(entry) {
  const stat = statSync(entry);
  if (stat.isDirectory()) {
    for (const child of readdirSync(entry)) walkSourceFiles(`${entry}/${child}`);
    return;
  }
  if (!/\.(ts|tsx)$/.test(entry)) return;

  const source = read(entry);
  for (const match of source.matchAll(/chatRoleId:\s*'([^']+)'/g)) studentChatRoleIds.add(match[1]);
  for (const match of source.matchAll(/roleId="([^"]+)"/g)) studentChatRoleIds.add(match[1]);
}

walkSourceFiles('src');
for (const roleId of studentChatRoleIds) {
  assert(serverRoleIds.has(roleId), `Student chat role "${roleId}" must exist in server-side systemInstructions.`);
}

if (failures.length) {
  console.error(`Mistral/BFL provider contract failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Mistral/BFL provider contract passed');
