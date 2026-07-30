import { createIssue } from './issue-builder.mjs';

export function longestSentence(text) {
  const sentences = String(text || '')
    .split(/\n+/)
    .flatMap((block) => block.replace(/\s+/g, ' ').trim().split(/(?<=[.!?])\s+/))
    .map((sentence) => ({ sentence: sentence.trim(), words: sentence.trim().split(/\s+/).filter(Boolean).length }))
    .filter((entry) => entry.sentence);
  return sentences.sort((a, b) => b.words - a.words)[0] || { sentence: '', words: 0 };
}

export function evaluateLanguageLoad({ missionId, persona, stepId, visibleText, evidence }) {
  if (persona.readingLevel !== 'a2-b1') return [];
  const longest = longestSentence(visibleText);
  if (longest.words < 28) return [];
  return [createIssue({
    missionId,
    personaId: persona.id,
    stepId,
    category: 'LANGUAGE',
    severity: 'MEDIUM',
    description: 'Een zichtbare instructie bevat een zeer lange zin voor het gesimuleerde A2/B1-profiel.',
    expected: 'Kerninstructies zijn kort en één handeling per zin is herkenbaar.',
    actual: `Langste gedetecteerde zin: ${longest.words} woorden: “${longest.sentence.slice(0, 180)}${longest.sentence.length > 180 ? '…' : ''}”`,
    learnerImpact: 'Taalzwakke Tess kan de rode draad verliezen terwijl de digitale vaardigheid wel aanwezig is.',
    reproduce: ['Open de missie als Taalzwakke Tess.', `Ga naar ${stepId}.`, 'Lees de volledige zichtbare instructie en opties.'],
    evidence: evidence ? [evidence] : [],
    recommendation: 'Laat een taalexpert de instructie toetsen en splits lange zinnen zonder het leerdoel of antwoord te wijzigen.',
    confidence: 0.72,
    evidenceType: 'SIMULATION',
    requiresHumanValidation: true,
    pedagogicalImpact: true,
  })];
}
