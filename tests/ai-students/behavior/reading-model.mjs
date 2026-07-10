export function visibleReading(text, persona) {
  const normalized = String(text || '').replace(/\s+/g, ' ').trim();
  if (!normalized) return '';
  const coverage = persona.behaviorWeights?.readingCoverage ?? 1;
  if (coverage >= 0.95) return normalized;

  const words = normalized.split(' ');
  const wordCount = Math.max(3, Math.ceil(words.length * coverage));
  return words.slice(0, wordCount).join(' ');
}
