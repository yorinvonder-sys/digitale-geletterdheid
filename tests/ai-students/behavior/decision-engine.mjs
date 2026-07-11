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

function visibleTextAttempt(instruction, persona) {
  const text = String(instruction || '');
  const spelled = text.match(/letters (?:zijn|vormen)\s+([a-z](?:[-–][a-z]){2,})/i)?.[1];
  if (spelled) return spelled.replace(/[-–]/g, '');
  const explicit = text.match(/antwoord is(?: een [^:.,]+[:])?\s*["“']?([\p{L}\d!@#$%^&*_-]{3,})/iu)?.[1];
  if (explicit) return explicit;
  const codeResult = text.match(/[A-Z0-9+/=]{4,}\s*(?:→|wordt|betekent)\s*["“']?([\p{L}\d!@#$%^&*_-]{3,})/u)?.[1];
  if (codeResult) return codeResult;
  return persona.readingLevel === 'a2-b1' ? 'weet ik niet' : 'onbekend';
}

function puzzleDecision(observation, persona, random) {
  if (observation.roundType === 'puzzle-recovery') {
    return { action: 'skip', reason: 'Gaat verder via de enige zichtbare herstelactie.' };
  }
  if (observation.availableRecoveryActions?.includes('skip') && random() < 0.35 + (persona.behaviorWeights?.errorRate ?? 0)) {
    return { action: 'skip', reason: 'Gebruikt de zichtbare herstelactie na meerdere mislukte pogingen.' };
  }
  if (observation.roundType === 'puzzle-choice') {
    const ranked = rankedOptions(observation.options, persona, random)
      .sort((a, b) => b.score - a.score || a.index - b.index);
    return {
      action: 'answer-puzzle-choice',
      optionId: ranked[0]?.id,
      reason: 'Meerkeuze op basis van zichtbare sleutelwoorden en persona-ruis.',
    };
  }
  return {
    action: 'answer-puzzle-text',
    value: visibleTextAttempt(observation.instruction, persona),
    reason: 'Tekstpoging uitsluitend afgeleid uit zichtbare aanwijzingen.',
  };
}

function fortressDecision(observation, persona) {
  if (observation.roundType === 'fortress-next') {
    return { action: 'next-fortress-round', reason: 'Gaat door nadat het fort zichtbaar standhield.' };
  }
  if (
    observation.attemptCount > 0 &&
    observation.availableRecoveryActions?.includes('hint') &&
    (persona.behaviorWeights?.hintUsage ?? 0) >= 0.65
  ) {
    return { action: 'request-hint', reason: 'Gebruikt zichtbare hulp na een mislukte aanval.' };
  }
  const startsWeak = (persona.behaviorWeights?.errorRate ?? 0) >= 0.4;
  const value = startsWeak && observation.attemptCount === 0
    ? 'abc123'
    : 'Kobalt-Vork!7Rivier-Mist';
  return {
    action: 'test-password',
    value,
    reason: startsWeak && observation.attemptCount === 0
      ? 'Probeert eerst een kort herkenbaar fictief patroon.'
      : 'Bouwt een lange unieke synthetische passphrase.',
  };
}

function simulationDecision(observation, persona, random) {
  if (observation.roundType === 'simulation-parameter') {
    return { action: 'change-simulation-parameter', reason: 'Probeert een zichtbare instelling uit.' };
  }
  if (observation.roundType === 'simulation-submit') {
    return { action: 'submit-simulation-answer', reason: 'Controleert de gemaakte keuze.' };
  }
  if (observation.roundType === 'simulation-next') {
    return { action: 'next-simulation', reason: 'Gaat door na alle zichtbare vragen.' };
  }
  const ranked = rankedOptions(observation.options, persona, random)
    .sort((a, b) => b.score - a.score || a.index - b.index);
  return {
    action: 'answer-simulation-question',
    optionId: ranked[0]?.id,
    reason: 'Kiest op basis van zichtbare woorden en persona-ruis.',
  };
}

export function decideNextAction({ observation, persona, seed }) {
  const random = createSeededRandom(`${seed}:${persona.seedSalt}:${observation.stepId}:${observation.phase}`);
  switch (observation.phase) {
    case 'round':
      if (observation.roundType === 'select-correct') return selectDecision(observation, persona, random);
      if (observation.roundType === 'order-priority') return orderDecision(observation, persona, random);
      if (observation.roundType === 'binary-choice') return binaryDecision(observation, persona, random);
      if (observation.roundType === 'puzzle-text' || observation.roundType === 'puzzle-choice') return puzzleDecision(observation, persona, random);
      if (observation.roundType === 'puzzle-recovery') return puzzleDecision(observation, persona, random);
      if (observation.roundType === 'password-entry' || observation.roundType === 'fortress-next') return fortressDecision(observation, persona);
      if (observation.roundType?.startsWith('simulation-')) return simulationDecision(observation, persona, random);
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
