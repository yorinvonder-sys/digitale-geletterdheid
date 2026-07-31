import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { aggregateRun } from './aggregate.mjs';

function safeSegment(value) {
  return String(value).replace(/[^a-z0-9._-]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase();
}

function markdownCell(value) {
  return String(value ?? '').replaceAll('|', '/').replace(/\s+/g, ' ').trim();
}

function renderIssue(issue) {
  return [
    `### ${issue.severity}: ${issue.description}`,
    '',
    `- Missie: \`${issue.mission}\``,
    `- Persona: \`${issue.persona}\``,
    `- Stap: ${issue.pageOrStep}`,
    `- Categorie: ${issue.category}`,
    `- Verwacht: ${issue.expectedBehavior}`,
    `- Feitelijk: ${issue.actualBehavior}`,
    `- Gevolg: ${issue.learnerImpact}`,
    `- Aanbeveling: ${issue.recommendedFix}`,
    `- Zekerheid: ${Math.round(issue.confidence * 100)}%`,
    `- Bewijstype: ${issue.evidenceType}`,
    `- Menselijke validatie: ${issue.requiresHumanValidation ? 'nodig' : 'niet nodig'}`,
    `- Pedagogische impact: ${issue.pedagogicalImpact ? 'mogelijk' : 'niet verwacht'}`,
    `- Bewijs: ${issue.evidenceReferences.join(', ') || 'geen bestand'}`,
    '',
    'Reproduceren:',
    '',
    ...issue.reproductionSteps.map((step, index) => `${index + 1}. ${step}`),
  ].join('\n');
}

function renderPersonaMarkdown(report) {
  const lines = [
    `# ${report.displayName}`,
    '',
    `Persona-id: \`${report.personaId}\``,
    '',
    '## Resultaten',
    '',
    '| Missie | Apparaat | Status | Score | Eindstatus |',
    '|---|---|---|---:|---|',
    ...report.results.map((result) => `| ${markdownCell(result.missionId)} | ${markdownCell(result.deviceId)} | ${markdownCell(result.status)} | ${markdownCell(result.finalScore)} | ${markdownCell(result.finalStatus)} |`),
    '',
    '## Problemen en observaties',
    '',
    report.issues.length ? report.issues.map(renderIssue).join('\n\n') : 'Geen problemen geregistreerd.',
  ];
  return `${lines.join('\n')}\n`;
}

function renderSummaryMarkdown(run, summary, personaReports) {
  const displayNames = new Map(personaReports.map((report) => [report.personaId, report.displayName]));
  const lines = [
    '# DGSkills AI-testklasje',
    '',
    `Run: \`${run.runId}\``,
    `Origin: \`${run.origin}\``,
    `Missies: ${run.missions.join(', ')}`,
    `Persona's: ${run.personas.join(', ')}`,
    `Apparaten: ${run.devices.join(', ')}`,
    '',
    '## Samenvatting',
    '',
    `- Persona's: ${summary.personaCount}`,
    `- Uitgevoerde resultaten: ${summary.resultCount}`,
    `- Voltooid: ${summary.completedCount}`,
    `- Bevindingen: ${summary.issueCount}`,
    `- Unieke problemen: ${summary.uniqueProblemCount}`,
    '',
    "| Probleem | Missie | Persona's | Ernst | Aanbeveling |",
    '|---|---|---|---|---|',
    ...summary.problems.map((problem) => [
      problem.multiPersonaPriority ? `Prioriteit: ${problem.description}` : problem.description,
      problem.mission,
      problem.personas.map((id) => displayNames.get(id) || id).join(', '),
      problem.severity,
      problem.recommendation,
    ].map(markdownCell).join(' | ').replace(/^/, '| ').replace(/$/, ' |')),
    '',
    '## Interpretatie',
    '',
    '- OBJECTIVE-bevindingen zijn technisch reproduceerbaar.',
    '- SIMULATION- en INFERENCE-bevindingen zijn persona-inschattingen.',
    '- Bevindingen met “menselijke validatie” moeten met echte leerlingen worden onderzocht.',
    '- Pedagogische wijzigingen worden alleen voorgesteld en niet automatisch uitgevoerd.',
  ];
  return `${lines.join('\n')}\n`;
}

export async function createRunDirectory(root, now = new Date()) {
  const runName = now.toISOString().replace(/[:.]/g, '-');
  const runDir = path.resolve(root, runName);
  await mkdir(root, { recursive: true });
  await mkdir(runDir, { recursive: false });
  return runDir;
}

export async function writeRunReports({ runDir, run, personaReports }) {
  const summary = aggregateRun(personaReports);
  const payload = { schemaVersion: 1, run, summary, personaReports };
  await mkdir(runDir, { recursive: true });
  await writeFile(path.join(runDir, 'summary.json'), `${JSON.stringify(payload, null, 2)}\n`);
  await writeFile(path.join(runDir, 'summary.md'), renderSummaryMarkdown(run, summary, personaReports));

  for (const report of personaReports) {
    const personaDir = path.join(runDir, safeSegment(report.personaId));
    await mkdir(path.join(personaDir, 'screenshots'), { recursive: true });
    await writeFile(path.join(personaDir, 'report.json'), `${JSON.stringify({ schemaVersion: 1, ...report }, null, 2)}\n`);
    await writeFile(path.join(personaDir, 'report.md'), renderPersonaMarkdown(report));
  }
  return payload;
}
