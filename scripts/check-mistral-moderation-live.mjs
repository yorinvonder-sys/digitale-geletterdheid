const endpoint = 'https://api.mistral.ai/v1/moderations';
const model = (process.env.MISTRAL_MODERATION_MODEL || 'mistral-moderation-2603').trim();
const apiKey = (process.env.MISTRAL_API_KEY || '').trim();
const requireLive = process.env.REQUIRE_MISTRAL_MODERATION === '1';

function fail(message) {
  console.error(`[mistral-moderation-live] ${message}`);
  process.exit(1);
}

if (!apiKey) {
  const message = 'MISTRAL_API_KEY ontbreekt; live moderation preflight overgeslagen.';
  if (requireLive) fail(`${message} Zet MISTRAL_API_KEY of verwijder REQUIRE_MISTRAL_MODERATION=1.`);
  console.log(`[mistral-moderation-live] ${message}`);
  process.exit(0);
}

let response;
try {
  response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      input: ['Maak een korte planning voor een geschiedenisles.'],
    }),
  });
} catch (error) {
  fail(`Moderation endpoint onbereikbaar: ${error instanceof Error ? error.message : 'onbekende fout'}`);
}

if (!response.ok) {
  fail(`Moderation endpoint faalde met HTTP ${response.status}.`);
}

let payload;
try {
  payload = await response.json();
} catch {
  fail('Moderation endpoint gaf geen geldige JSON terug.');
}

const categories = payload?.results?.[0]?.categories;
if (!categories || typeof categories !== 'object' || Array.isArray(categories)) {
  fail('Moderation response mist results[0].categories.');
}

const expectedCategories = [
  'sexual',
  'hate_and_discrimination',
  'violence_and_threats',
  'dangerous_and_criminal_content',
  'selfharm',
  'jailbreaking',
];
const presentCategories = expectedCategories.filter((category) => category in categories);
if (presentCategories.length === 0) {
  fail('Moderation response bevat geen bekende safety categories.');
}

const nonBooleanCategory = presentCategories.find((category) => typeof categories[category] !== 'boolean');
if (nonBooleanCategory) {
  fail(`Moderation category "${nonBooleanCategory}" is geen boolean.`);
}

console.log(
  `[mistral-moderation-live] Live moderation preflight geslaagd voor ${model}; bekende categories: ${presentCategories.join(', ')}.`,
);
