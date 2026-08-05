const EXTERNAL_AGENTS = new Set([
  'deepseek-scout',
  'deepseek-scout-high',
  'terra-shadow',
  'terra-shadow-high',
]);

const HEADER_RULES = [
  ['TASK_ID', /^[A-Za-z0-9._/-]+$/],
  ['RISK', /^(?:Groen|Geel|Rood)$/],
  ['DATA_CLASSIFICATION', /^(?:public|internal-sanitized)$/],
  ['PERSONAL_DATA', /^none$/],
  ['SECRETS', /^none$/],
  ['RAW_PROMPTS', /^none$/],
];

const BLOCKED_CONTENT = [
  /-----BEGIN (?:RSA |EC |OPENSSH |)PRIVATE KEY-----/,
  /\bsk-(?:proj-|live-|test-)?[A-Za-z0-9_-]{20,}\b/,
  /\bsbp_[A-Za-z0-9_-]{30,}\b/,
  /\bgh[pousr]_[A-Za-z0-9_]{30,}\b/,
  /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/,
  /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/,
  /\bAIza[0-9A-Za-z_-]{35}\b/,
  /\beyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\b/,
  /\bAuthorization:\s*Bearer\s+\S+/i,
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
  /\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/i,
  /\b(?:student|learner|leerling|pupil|teacher|docent|parent|guardian|ouder|naam|name|school|klas|class|adres|address|street|straat|postcode|telefoon|telephone|phone|email|leeftijd|age|birthday|geboortedatum)\b/i,
  /\b[A-Z][a-z]{1,}(?:\s+(?:de|den|der|van|von))?\s+[A-Z][a-z]{1,}\b/,
  /\b[A-Z][a-z]{1,}[’']s\b/,
  /(?:\+?\d[\d ().-]{7,}\d)/,
  /\b\d{4}\s?[A-Z]{2}\b/,
  /\b[A-Z]{2}\d{2}[A-Z0-9]{10,30}\b/,
  /\b(?:\d{1,3}\.){3}\d{1,3}\b/,
  /\b(?:api[_-]?key|access[_-]?token|client[_-]?secret|password|cookie|session)\s*[:=]\s*["']?[^\s"']{12,}/i,
];

function parseExternalPacket(parts) {
  if (parts.length !== 1 || parts[0]?.type !== 'text') {
    throw new Error('External delegation accepts one text-only sanitized packet');
  }

  const text = String(parts[0].text ?? '').replace(/\r\n?/g, '\n');
  const separator = text.indexOf('\n\n');

  if (separator < 0 || /[^\x09\x0A\x20-\x7E]/.test(text)) {
    throw new Error('External delegation packet has an invalid safety envelope');
  }

  const headerLines = text.slice(0, separator).split('\n');
  const body = text.slice(separator + 2).trim();

  if (headerLines.length !== HEADER_RULES.length || !body) {
    throw new Error('External delegation packet has an invalid safety envelope');
  }

  const headers = {};
  for (let index = 0; index < HEADER_RULES.length; index += 1) {
    const [name, valuePattern] = HEADER_RULES[index];
    const match = headerLines[index].match(/^([A-Z_]+)=(.*)$/);

    if (!match || match[1] !== name || !valuePattern.test(match[2])) {
      throw new Error('External delegation packet has an invalid safety envelope');
    }
    headers[name] = match[2];
  }

  if (/^[A-Z][A-Z_]*=/m.test(body) || BLOCKED_CONTENT.some((pattern) => pattern.test(body))) {
    throw new Error('External delegation packet appears sensitive');
  }

  return {
    body,
    headers,
    packet: `${HEADER_RULES.map(([name]) => `${name}=${headers[name]}`).join('\n')}\n\n${body}`,
  };
}

export function resolveExternalRoute(agent, model) {
  if (EXTERNAL_AGENTS.has(agent)) {
    return agent;
  }
  if (
    model === 'deepseek-v4-flash' ||
    model === 'deepseek/deepseek-v4-flash'
  ) {
    return 'deepseek-scout';
  }
  if (model === 'gpt-5.6-terra' || model === 'openai/gpt-5.6-terra') {
    return 'terra-shadow';
  }
  return '';
}

export function validateExternalMessage(agent, parts = []) {
  if (!EXTERNAL_AGENTS.has(agent)) {
    return;
  }

  const { headers, packet } = parseExternalPacket(parts);
  const risk = headers.RISK;

  if (risk === 'Rood' || (agent.startsWith('deepseek-') && risk !== 'Groen')) {
    throw new Error('External delegation risk is outside the agent ceiling');
  }

  return packet;
}
