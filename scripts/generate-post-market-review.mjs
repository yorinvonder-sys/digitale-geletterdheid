#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const FIXED_SECTIONS = [
  'Scope',
  'Sources',
  'Usage summary',
  'Oversight events',
  'Incidents and anomalies',
  'Review decisions',
  'Actions',
  'Next review date',
];

const TABLE_CONFIG = {
  ai_usage_events: {
    timestampField: 'created_at',
    select: 'created_at,endpoint,provider,model,status,input_chars,history_chars,game_context_chars,output_chars,image_count,retry_count,fallback_used,total_tokens',
  },
  ai_oversight_events: {
    timestampField: 'created_at',
    select: 'created_at,event_type,slo_code,mission_id',
  },
  audit_logs: {
    timestampField: 'timestamp',
    select: 'timestamp,action',
  },
  web_vitals_events: {
    timestampField: 'created_at',
    select: 'created_at,route,metric_name,metric_rating,metric_value',
  },
};

const TABLES = Object.keys(TABLE_CONFIG);
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DIRECT_IDENTIFIER_PATTERN = /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith('--')) continue;
    const [rawKey, inlineValue] = arg.slice(2).split('=', 2);
    const value = inlineValue ?? argv[i + 1];
    if (inlineValue === undefined) i += 1;
    args[rawKey] = value;
  }
  return args;
}

function parseDate(value, name) {
  if (!DATE_PATTERN.test(value || '')) {
    throw new Error(`Missing or invalid --${name}; expected YYYY-MM-DD.`);
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid --${name}; expected a real calendar date.`);
  }
  return date;
}

function daysBetween(from, to) {
  return Math.ceil((to.getTime() - from.getTime()) / 86_400_000);
}

function addMonths(date, months) {
  const next = new Date(date.getTime());
  next.setUTCMonth(next.getUTCMonth() + months);
  return next;
}

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

function countBy(rows, field, mapper = (value) => value || 'unknown') {
  const counts = new Map();
  for (const row of rows) {
    const key = mapper(row[field]);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

function sumBy(rows, field) {
  return rows.reduce((sum, row) => {
    const value = Number(row[field] ?? 0);
    return Number.isFinite(value) ? sum + value : sum;
  }, 0);
}

function sanitizeLabel(value) {
  if (value === null || value === undefined || value === '') return 'unknown';
  return String(value)
    .replace(/\?.*$/, '')
    .replace(DIRECT_IDENTIFIER_PATTERN, '[redacted]')
    .replace(/\/[0-9a-f]{10,}(?=\/|$)/gi, '/[redacted]')
    .slice(0, 120);
}

function rowsFromInput(input, table) {
  const direct = input?.[table];
  const snapshot = input?.snapshot?.datasets?.[table];
  const datasets = input?.datasets?.[table];
  const rows = direct ?? snapshot ?? datasets ?? [];
  return Array.isArray(rows) ? rows : [];
}

function filterRows(rows, table, from, to) {
  const timestampField = TABLE_CONFIG[table].timestampField;
  return rows.filter((row) => {
    const rawTimestamp = row?.[timestampField] ?? row?.created_at ?? row?.timestamp;
    const timestamp = new Date(rawTimestamp);
    return !Number.isNaN(timestamp.getTime()) && timestamp >= from && timestamp < to;
  });
}

async function readFromSupabase(table, from, to) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_POSTMARKET_READ_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !key) {
    return {
      rows: [],
      issue: 'No data source configured; provide --input or read-only Supabase environment credentials.',
    };
  }

  const { createClient } = await import('@supabase/supabase-js');
  const client = createClient(supabaseUrl, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { timestampField, select } = TABLE_CONFIG[table];
  const { data, error } = await client
    .from(table)
    .select(select)
    .gte(timestampField, from.toISOString())
    .lt(timestampField, to.toISOString())
    .limit(10_000);

  if (error) {
    return { rows: [], issue: `${table} unavailable: ${error.message}` };
  }
  return { rows: Array.isArray(data) ? data : [], issue: null };
}

async function loadEvidence(args, from, to) {
  const issues = [];
  if (args.input) {
    const inputPath = resolve(args.input);
    const input = JSON.parse(readFileSync(inputPath, 'utf8'));
    const datasets = {};
    for (const table of TABLES) {
      datasets[table] = filterRows(rowsFromInput(input, table), table, from, to);
    }
    return { datasets, sourceMode: `offline JSON export: ${inputPath}`, issues };
  }

  const datasets = {};
  for (const table of TABLES) {
    const result = await readFromSupabase(table, from, to);
    datasets[table] = result.rows;
    if (result.issue) issues.push(result.issue);
  }
  return { datasets, sourceMode: 'Supabase read-only query using aggregate-safe fields', issues };
}

function tableMarkdown(rows, headers) {
  if (!rows.length) return 'No rows provided or found for this review window.';
  return [
    `| ${headers.join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...rows.map((row) => `| ${row.map((cell) => String(cell)).join(' | ')} |`),
  ].join('\n');
}

function countsMarkdown(counts, label = 'Value') {
  return tableMarkdown(counts.map(([key, count]) => [sanitizeLabel(key), count]), [label, 'Count']);
}

function weeklyCounts(rows, timestampField) {
  const counts = new Map();
  for (const row of rows) {
    const date = new Date(row[timestampField] ?? row.created_at ?? row.timestamp);
    if (Number.isNaN(date.getTime())) continue;
    const day = date.getUTCDay();
    const mondayOffset = day === 0 ? -6 : 1 - day;
    const weekStart = new Date(date.getTime());
    weekStart.setUTCDate(date.getUTCDate() + mondayOffset);
    weekStart.setUTCHours(0, 0, 0, 0);
    const key = isoDate(weekStart);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]));
}

function renderReport({ from, to, outPath, sourceMode, issues, datasets }) {
  const usage = datasets.ai_usage_events;
  const oversight = datasets.ai_oversight_events;
  const audit = datasets.audit_logs;
  const vitals = datasets.web_vitals_events;
  const sourceIssues = [...new Set(issues.map((issue) => sanitizeLabel(issue)))];

  const usageProblems = usage.filter((row) => ['error', 'blocked', 'rate_limited'].includes(row.status));
  const fallbacks = usage.filter((row) => row.fallback_used === true || row.fallback_used === 'true');
  const retries = usage.filter((row) => Number(row.retry_count ?? 0) > 0);
  const overrides = oversight.filter((row) => row.event_type === 'teacher_override');
  const poorVitals = vitals.filter((row) => String(row.metric_rating || '').toLowerCase() === 'poor');

  const output = `# DGSkills Post-Market Monitoring Review

Period: ${isoDate(from)} to ${isoDate(to)} (start inclusive, end exclusive)
Generated: ${new Date().toISOString()}
Output: ${outPath}
Status: Internal readiness evidence, not a declaration of conformity

## Scope

This report covers aggregate-only post-market monitoring evidence for DGSkills school-facing AI readiness. It includes AI usage telemetry, AI oversight events, general audit-log action counts and optional web-vitals indicators. It does not contain learner message bodies, AI answer bodies, learner names, direct user identifiers or credentials.

## Sources

- Source mode: ${sourceMode}
- Tables expected: ${TABLES.join(', ')}
- Rows included: ai_usage_events ${usage.length}; ai_oversight_events ${oversight.length}; audit_logs ${audit.length}; web_vitals_events ${vitals.length}
${sourceIssues.length ? `- Source issues: ${sourceIssues.join('; ')}` : '- Source issues: none reported'}

## Usage summary

Total AI usage events: ${usage.length}
Total token count reported: ${sumBy(usage, 'total_tokens')}
Total input characters reported: ${sumBy(usage, 'input_chars') + sumBy(usage, 'history_chars') + sumBy(usage, 'game_context_chars')}
Total output characters reported: ${sumBy(usage, 'output_chars')}
Fallback events: ${fallbacks.length}
Retry events: ${retries.length}
Image count: ${sumBy(usage, 'image_count')}

Status counts:

${countsMarkdown(countBy(usage, 'status'), 'Status')}

Endpoint counts:

${countsMarkdown(countBy(usage, 'endpoint'), 'Endpoint')}

Provider/model counts:

${countsMarkdown(countBy(usage, 'model', (_value) => `${sanitizeLabel(_value)} (${sanitizeLabel(usage.find((row) => row.model === _value)?.provider || 'unknown')})`), 'Model')}

Weekly usage trend:

${tableMarkdown(weeklyCounts(usage, 'created_at'), ['Week starting', 'Usage events'])}

## Oversight events

Total oversight events: ${oversight.length}
Teacher override events: ${overrides.length}

Event type counts:

${countsMarkdown(countBy(oversight, 'event_type'), 'Event type')}

Mission counts:

${countsMarkdown(countBy(oversight, 'mission_id'), 'Mission')}

SLO code counts:

${countsMarkdown(countBy(oversight, 'slo_code'), 'SLO code')}

## Incidents and anomalies

AI usage problem events: ${usageProblems.length}
Fallback events: ${fallbacks.length}
Retry events: ${retries.length}
Teacher override events: ${overrides.length}
Poor web-vital events: ${poorVitals.length}

Audit action counts:

${countsMarkdown(countBy(audit, 'action'), 'Action')}

Web-vital rating counts:

${countsMarkdown(countBy(vitals, 'metric_rating'), 'Rating')}

Sanitized route counts:

${countsMarkdown(countBy(vitals, 'route', sanitizeLabel), 'Route')}

## Review decisions

- [ ] No corrective action needed.
- [ ] Corrective action needed and linked in Actions.
- [ ] Legal/DPO review needed before external claim changes.
- [ ] Provider evidence or contract review needed.

## Actions

| Action | Owner | Due date | Link | Status |
|---|---|---|---|---|
| Review problem-event pattern and decide whether any corrective action is needed. | Founder + Engineering | ${isoDate(addMonths(to, 1))} | TBD | Open |
| File reviewed report in the compliance evidence folder. | Founder | ${isoDate(addMonths(to, 1))} | ${outPath} | Open |

## Next review date

${isoDate(addMonths(to, 3))}
`;

  return output;
}

function assertPrivacySafe(markdown) {
  const forbidden = [
    /prompt[_ -]?(text|body|content)/i,
    /response[_ -]?(text|body|content)/i,
    /chat[_ -]?transcript/i,
    /api[_ -]?key/i,
    /service[_ -]?role[_ -]?key/i,
    /secret/i,
    DIRECT_IDENTIFIER_PATTERN,
  ];
  for (const pattern of forbidden) {
    if (pattern.test(markdown)) {
      throw new Error(`Generated report failed privacy check: ${pattern}`);
    }
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const from = parseDate(args.from, 'from');
  const to = parseDate(args.to, 'to');
  if (to <= from) throw new Error('--to must be later than --from.');
  if (daysBetween(from, to) > 370) throw new Error('Review window is too large; keep exports bounded to 370 days or less.');
  if (!args.out) throw new Error('Missing --out; reports must be written to an explicit path.');

  const outPath = resolve(args.out);
  const { datasets, sourceMode, issues } = await loadEvidence(args, from, to);
  const markdown = renderReport({ from, to, outPath, sourceMode, issues, datasets });
  assertPrivacySafe(markdown);

  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, markdown, 'utf8');
  console.log(`Post-market monitoring review written to ${outPath}`);
  if (!existsSync(outPath)) throw new Error('Report write failed.');
}

main().catch((error) => {
  console.error(`[postmarket:review] ${error.message}`);
  process.exit(1);
});
