import { appendFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

function redact(value) {
  return String(value ?? '')
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[REDACTED_EMAIL]')
    .replace(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, '[REDACTED_TOKEN]')
    .replace(/(?:apikey|api_key|password|secret)\s*[:=]\s*\S+/gi, '[REDACTED_SECRET]');
}

export async function recordModelRouting(entry, outputDir) {
  await mkdir(outputDir, { recursive: true });
  const filePath = path.join(outputDir, 'model-routing.md');
  let contents = '';
  try {
    contents = await readFile(filePath, 'utf8');
  } catch {
    contents = '# Model-routing AI-testklasje\n\n';
    await writeFile(filePath, contents);
  }

  const heading = `## Taak: ${redact(entry.task)}`;
  if (contents.includes(heading)) return filePath;
  const block = [
    heading,
    '',
    `- Complexiteit: ${redact(entry.complexity)}`,
    `- Risico: ${redact(entry.risk)}`,
    `- Gekozen model: ${redact(entry.chosenModel)}`,
    `- Thinkingniveau: ${redact(entry.thinkingLevel)}`,
    `- Reden: ${redact(entry.reason)}`,
    `- Fallback: ${redact(entry.fallback)}`,
    '',
    '',
  ].join('\n');
  await appendFile(filePath, block);
  return filePath;
}
