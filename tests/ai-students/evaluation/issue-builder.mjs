const CATEGORIES = new Set(['TECHNICAL', 'USABILITY', 'LANGUAGE', 'DIDACTICS', 'RESILIENCE']);
const SEVERITIES = new Set(['BLOCKER', 'HIGH', 'MEDIUM', 'LOW', 'OBSERVATION']);
const EVIDENCE_TYPES = new Set(['OBJECTIVE', 'SIMULATION', 'INFERENCE']);

export function createIssue(input) {
  if (!CATEGORIES.has(input.category)) throw new Error(`Ongeldige issuecategorie: ${input.category}`);
  if (!SEVERITIES.has(input.severity)) throw new Error(`Ongeldige issue-ernst: ${input.severity}`);
  if (!EVIDENCE_TYPES.has(input.evidenceType)) throw new Error(`Ongeldig bewijstype: ${input.evidenceType}`);
  return {
    mission: input.missionId,
    persona: input.personaId,
    pageOrStep: input.stepId,
    category: input.category,
    severity: input.severity,
    description: input.description,
    expectedBehavior: input.expected,
    actualBehavior: input.actual,
    learnerImpact: input.learnerImpact,
    reproductionSteps: input.reproduce,
    evidenceReferences: input.evidence || [],
    recommendedFix: input.recommendation,
    confidence: input.confidence,
    evidenceType: input.evidenceType,
    requiresHumanValidation: input.requiresHumanValidation,
    pedagogicalImpact: input.pedagogicalImpact,
  };
}
