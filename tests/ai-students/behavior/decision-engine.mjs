import { createSeededRandom } from './seeded-random.mjs';
import { visibleReading } from './reading-model.mjs';

const RISK_TERMS = [
  'wachtwoord', 'geblokkeerd', 'onbekend', 'verdacht', '.exe', 'link', 'klik',
  'vandaag', 'urgent', 'afgesloten', 'rekeningnummer', 'factuur', 'gratis',
  'win', 'cadeau', 'externe', 'malware', 'nep', 'valstrik',
];
const SAFE_TERMS = [
  'officieel', 'school.nl', 'magister.net', 'via magister', 'zelf naar',
  'geen link', 'geen bijlage', 'docent', 'beveiligde', 'controleren', 'niet klikken',
];

function termsScore(text, terms) {
  const lower = text.toLowerCase();
  return terms.reduce((score, term) => score + (lower.includes(term) ? 1 : 0), 0);
}

function optionView(option, persona) {
  return {
    id: String(option.id),
    text: visibleReading(option.text, persona),
  };
}

function rankedOptions(options, persona, random) {
  return options.map((raw, index) => {
    const option = optionView(raw, persona);
    const risk = termsScore(option.text, RISK_TERMS);
    const safe = termsScore(option.text, SAFE_TERMS);
    const languageBias = persona.readingLevel === 'a2-b1'
      ? termsScore(option.text, ['wachtwoord', 'link', 'school', 'bijlage', 'docent']) * 0.7
      : 0;
    const errorNoise = (random() - 0.5) * 4 * (persona.behaviorWeights?.errorRate ?? 0);
    return { ...option, index, risk, safe, score: risk - safe + languageBias + errorNoise };
  });
}

function selectDecision(observation, persona, random) {
  const options = observation.options.map((option) => optionView(option, persona));
  const minimum = Math.min(options.length, Math.max(1, observation.minimumSelections || 1));
  if ((persona.behaviorWeights?.decisionSpeed ?? 0) >= 0.85) {
    return {
      action: 'answer-select',
      optionIds: options.slice(0, minimum).map((option) => option.id),
      reason: 'Snelle selectie op basis van de eerst zichtbare opties.',
    };
  }
  const ranked = rankedOptions(observation.options, persona, random)
    .sort((a, b) => b.score - a.score || a.index - b.index);
  const extra = random() < (persona.behaviorWeights?.uncertainty ?? 0) ? 1 : 0;
  return {
    action: 'answer-select',
    optionIds: ranked.slice(0, Math.min(options.length, minimum + extra)).map((option) => option.id),
    reason: 'Selectie op basis van herkenbare risico- en veiligheidswoorden.',
  };
}

function orderDecision(observation, persona, random) {
  const ranked = rankedOptions(observation.options, persona, random)
    .sort((a, b) => b.score - a.score || a.index - b.index);
  return {
    action: 'answer-order',
    optionIds: ranked.map((option) => option.id),
    reason: 'Volgorde op basis van de zichtbare mogelijke schade.',
  };
}

function binaryDecision(observation, persona, random) {
  const choices = {};
  for (const option of rankedOptions(observation.options, persona, random)) {
    let accepted = option.safe >= option.risk;
    if (random() < (persona.behaviorWeights?.errorRate ?? 0) * 0.18) accepted = !accepted;
    choices[option.id] = accepted;
  }
  return {
    action: 'answer-binary',
    choices,
    reason: 'Echt/vals-inschatting op basis van afzender-, link- en urgentiesignalen.',
  };
}

function followUpDecision(observation, persona, random) {
  const ranked = rankedOptions(observation.options, persona, random)
    .map((option) => ({ ...option, score: option.safe - option.risk + option.score * 0.1 }))
    .sort((a, b) => b.score - a.score || a.index - b.index);
  return {
    action: 'answer-follow-up',
    optionId: ranked[0]?.id,
    reason: 'Verdiepingskeuze op basis van zichtbare veilige handelingswoorden.',
  };
}

export function decideNextAction({ observation, persona, seed }) {
  const random = createSeededRandom(`${seed}:${persona.seedSalt}:${observation.stepId}:${observation.phase}`);
  switch (observation.phase) {
    case 'round':
      if (observation.roundType === 'select-correct') return selectDecision(observation, persona, random);
      if (observation.roundType === 'order-priority') return orderDecision(observation, persona, random);
      if (observation.roundType === 'binary-choice') return binaryDecision(observation, persona, random);
      break;
    case 'confidence': {
      const uncertainty = persona.behaviorWeights?.uncertainty ?? 0.5;
      return {
        action: 'answer-confidence',
        optionId: uncertainty >= 0.67 ? '1' : uncertainty >= 0.3 ? '2' : '3',
        reason: 'Zelfinschatting afgeleid van het persona-onzekerheidsniveau.',
      };
    }
    case 'follow-up':
      return followUpDecision(observation, persona, random);
    default:
      break;
  }
  throw new Error(`Geen persona-beslissing beschikbaar voor fase ${observation.phase}.`);
}
