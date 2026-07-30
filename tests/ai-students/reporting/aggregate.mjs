function normalize(value) {
  return String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function fingerprint(issue) {
  return [
    issue.mission,
    issue.pageOrStep,
    issue.category,
    issue.description,
    issue.recommendedFix,
  ].map(normalize).join('|');
}

export function aggregateRun(personaReports) {
  const results = personaReports.flatMap((report) => report.results || []);
  const problemMap = new Map();

  for (const report of personaReports) {
    for (const issue of report.issues || []) {
      const key = fingerprint(issue);
      const existing = problemMap.get(key);
      if (existing) {
        if (!existing.personas.includes(issue.persona)) existing.personas.push(issue.persona);
        existing.confidence = Math.max(existing.confidence, issue.confidence);
        existing.requiresHumanValidation ||= issue.requiresHumanValidation;
        existing.pedagogicalImpact ||= issue.pedagogicalImpact;
      } else {
        problemMap.set(key, {
          fingerprint: key,
          description: issue.description,
          mission: issue.mission,
          pageOrStep: issue.pageOrStep,
          category: issue.category,
          severity: issue.severity,
          recommendation: issue.recommendedFix,
          personas: [issue.persona],
          confidence: issue.confidence,
          evidenceType: issue.evidenceType,
          requiresHumanValidation: issue.requiresHumanValidation,
          pedagogicalImpact: issue.pedagogicalImpact,
          multiPersonaPriority: false,
        });
      }
    }
  }

  const problems = [...problemMap.values()].map((problem) => ({
    ...problem,
    multiPersonaPriority: problem.personas.length > 1,
  }));

  return {
    personaCount: personaReports.length,
    resultCount: results.length,
    completedCount: results.filter((result) => result.status === 'completed').length,
    issueCount: personaReports.reduce((count, report) => count + (report.issues?.length || 0), 0),
    uniqueProblemCount: problems.length,
    problems,
  };
}
