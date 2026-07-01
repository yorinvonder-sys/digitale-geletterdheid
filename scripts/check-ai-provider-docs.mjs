import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const roots = [
  'ARCHITECTURE.md',
  'CLAUDE.md',
  'LAUNCH-PLAN.md',
  'README.md',
  'index.html',
  '.claude/project-context.md',
  '.claude/skills',
  'business/nl-vo',
  'business/strategy',
  'docs',
  'public/compliance',
  'public/dev-docs',
  'public/guides',
  'public/resources',
  'src',
  'supabase/functions',
  'scripts',
];

const ignoredDirs = new Set([
  '.git',
  '.claude',
  '.playwright-mcp',
  'dist',
  'node_modules',
  'tmp',
]);

const allowedGoogleContexts = [
  /Google Workspace/i,
  /Google Drive/i,
  /gdrive-backup/i,
  /Google Analytics|GA4/i,
  /Search Console/i,
  /Google Meet/i,
  /Google Calendar/i,
  /lesvoorbeeld|lesson example|voorbeeldopdracht/i,
  /\.gemini\/antigravity/i,
];

const ignoredFiles = new Set([
  'docs/compliance/legal-claim-source-of-truth.md',
  'scripts/generate-hero-greenscreen.mjs',
  'scripts/generate-hero-video.mjs',
  'scripts/check-ai-provider-docs.mjs',
  'scripts/check-gdpr-rights-coverage.mjs',
  'scripts/check-legal-claims.mjs',
  'scripts/check-legal-evidence.mjs',
  'scripts/check-processing-restriction-enforcement.mjs',
  'scripts/check-retention-policy.mjs',
]);

const historicalFilePatterns = [
  /(^|\/)08-lanceringsrapport-compleet\.md$/,
  /(^|\/)09-juridisch-rapport-compleet\.md$/,
  /(^|\/)audit-report\.md$/,
  /(^|\/)verwerkersovereenkomsten-rapport\.md$/,
  /^docs\/audits\//,
  /^docs\/compliance\/regulations\//,
];

const allowedHistoricalLine = [
  /historisch/i,
  /oudere|eerdere|voormalige/i,
  /niet meer als actuele/i,
  /niet als actuele/i,
  /was onjuist/i,
  /Claim nooit/i,
  /Do not claim|Do not use|Avoid blanket claims/i,
  // Reviewer skills / audit prompts that quote a forbidden phrase to warn against it.
  /nooit\b.*claim/i,
  /verboden claim/i,
  /laten staan/i,
  /markeer dit als|markeer\b.*kritiek/i,
  // Safe conditional framing of the shifted high-risk deadline.
  /Digital Omnibus/i,
  // Explicit "not yet compliant / in progress" framing is not an overclaim.
  /compliancetraject|niet volledig compliant/i,
];

const blockedRules = [
  {
    label: 'stale school-facing Google/Gemini/Vertex provider claim',
    pattern: /\b(Google\s+Gemini|Google\s+Vertex|Vertex\s+AI|Gemini Developer API|generativelanguage\.googleapis\.com|europe-west4-aiplatform\.googleapis\.com)\b/i,
  },
  {
    label: 'unsafe AI Act limited-risk claim',
    pattern: /\b(Limited Risk|limited risk|beperkt risico)\b/i,
  },
  {
    label: 'blanket compliance overclaim',
    pattern: /\b(AVG-compliant|AVG compliant|AVG-proof|AVG proof|GDPR-compliant|GDPR compliant|GDPR-proof|GDPR proof|volledige AVG-compliance|voldoet aan (de )?AVG|voldoet aan (de )?AI Act|voldoe aan de EU AI Act|EU AI Act conform|volledig compliant|volledige naleving|volledige conformiteit|volledig in lijn met de AVG|strengste AVG-normen)\b/i,
  },
  {
    label: 'unsafe high-risk deadline text',
    pattern: /\b(2 augustus 2026|2 aug 2026)\b/i,
  },
  {
    label: 'unqualified zero-retention/training claim',
    pattern: /\b(zero-training|Zero-Training|zero data retention|Zero Data Retention|zero retention|geen training op leerlingdata|geen leerlingdata wordt gebruikt voor het trainen|geen data gebruiken voor training|data niet wordt gebruikt om het model te trainen)\b/i,
  },
  {
    label: 'unverified hard data-location claim',
    pattern: /\b(alle data in Nederland|data binnen EER|EU-servers|Eemshaven|Frankfurt|eu-west-1|eu-central-1|europe-west4|Alle persoonsgegevens worden opgeslagen en verwerkt binnen de (EU|EER))\b/i,
  },
  {
    label: 'absolute all-data deletion claim',
    pattern: /\b(alle data wordt (op verzoek )?(binnen \d+ dagen )?verwijderd|data verwijderd binnen \d+ dagen|alle gegevens binnen \d+ dagen definitief gewist|alle gegevens.*definitief gewist.*back-ups)\b/i,
  },
  {
    label: 'unsafe anonymous analytics claim',
    pattern: /\b(anonieme gebruiksstatistieken|anonieme analytics|anonymous analytics|purely anonymous)\b/i,
  },
  {
    label: 'unqualified AI memory claim',
    pattern: /\b(AI onthoudt geen|onthoudt geen persoonlijke gegevens|geen persoonlijke gegevens na de sessie)\b/i,
  },
  {
    label: 'absolute subject-rights completeness claim',
    pattern: /\b(all personal data|ALL associated data|alle persoonlijke gegevens|alle bijbehorende gegevens|alle 28 gekoppelde gegevenstabellen)\b/i,
  },
];

const scannedExtensions = new Set([
  '.html', '.md', '.mjs', '.ts', '.tsx', '.js', '.jsx', '.json',
]);

const failures = [];

function shouldScan(filePath) {
  if (ignoredFiles.has(filePath)) return false;
  if (historicalFilePatterns.some((pattern) => pattern.test(filePath))) return false;
  const ext = path.extname(filePath);
  return scannedExtensions.has(ext) || path.basename(filePath) === 'CLAUDE.md' || path.basename(filePath) === 'README.md';
}

function isAllowedLine(line) {
  return allowedHistoricalLine.some((pattern) => pattern.test(line));
}

function isPublicRetentionClaim(line) {
  return /\b(90 dagen|90 days|90-day)\b/i.test(line) && /\b(chat|audit|log|activity|activiteit|bewaar|retention|gegevens|data|purge)\b/i.test(line);
}

function stripMarkdownEmphasis(line) {
  // Emphasis / code / strike markers can split a claim across characters
  // (e.g. "voldoet aan **AVG**"); strip them so word-based rules still match.
  return line.replace(/[*_`~]+/g, '');
}

function hasHistoricalStatusHeader(source) {
  // A dated snapshot that opens with a "Historische status" header is
  // intentionally left as-is; its superseded claims are not live claims.
  return /Historische status/i.test(source.split(/\r?\n/, 20).join('\n'));
}

function walk(entry) {
  const stat = statSync(entry);
  if (stat.isDirectory()) {
    if (ignoredDirs.has(path.basename(entry))) return;
    for (const child of readdirSync(entry)) walk(path.join(entry, child));
    return;
  }
  if (!shouldScan(entry)) return;

  const source = readFileSync(entry, 'utf8');
  if (hasHistoricalStatusHeader(source)) return;

  const lines = source.split(/\r?\n/);
  for (const [index, line] of lines.entries()) {
    const normalized = stripMarkdownEmphasis(line);
    if (isAllowedLine(line) || isAllowedLine(normalized)) continue;
    const isAllowedGoogleContext = allowedGoogleContexts.some(
      (pattern) => pattern.test(line) || pattern.test(normalized),
    );
    for (const rule of blockedRules) {
      if ((rule.pattern.test(line) || rule.pattern.test(normalized)) && !isAllowedGoogleContext) {
        failures.push(`${entry}:${index + 1}: ${rule.label}`);
      }
    }
    if (isPublicRetentionClaim(line) || isPublicRetentionClaim(normalized)) {
      failures.push(`${entry}:${index + 1}: unsafe 90-day activity/audit/chat retention claim`);
    }
  }
}

for (const root of roots) {
  try {
    walk(root);
  } catch (error) {
    failures.push(`${root}: scan failed (${error.message})`);
  }
}

if (failures.length) {
  console.error(`AI provider docs check failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('AI provider docs check passed');
