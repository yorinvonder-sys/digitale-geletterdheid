export const REQUIRED_HANDOFF_SECTIONS = [
  "Doel",
  "Wat Is Veranderd",
  "Tests",
  "Risico's",
  "Graag Op Letten",
];

const PLACEHOLDER_PATTERNS = [
  /^vul (dit )?in$/i,
  /^todo$/i,
  /^tbd$/i,
  /^n\/?a$/i,
  /^nog invullen$/i,
];

export function normalizeHeading(heading) {
  return heading
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .toLowerCase();
}

export function stripHtmlComments(markdown) {
  return markdown.replace(/<!--[\s\S]*?-->/g, "");
}

export function parseMarkdownSections(markdown) {
  const cleaned = markdown.replace(/\r\n/g, "\n");
  const sectionRegex = /^##\s+(.+?)\s*$/gm;
  const matches = [...cleaned.matchAll(sectionRegex)];
  const sections = new Map();

  for (let index = 0; index < matches.length; index += 1) {
    const current = matches[index];
    const next = matches[index + 1];
    const title = current[1].trim();
    const start = current.index + current[0].length;
    const end = next ? next.index : cleaned.length;
    const content = cleaned.slice(start, end).trim();
    sections.set(normalizeHeading(title), { title, content });
  }

  return sections;
}

export function cleanSectionContent(markdown) {
  const withoutComments = stripHtmlComments(markdown);
  const lines = withoutComments
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^[-*]\s+/, "").trim())
    .filter(Boolean);

  return lines
    .filter((line) => !PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(line)))
    .join("\n")
    .trim();
}

export function validateHandoffBody(markdown) {
  const sections = parseMarkdownSections(markdown);
  const missing = [];
  const empty = [];

  for (const required of REQUIRED_HANDOFF_SECTIONS) {
    const normalized = normalizeHeading(required);
    const section = sections.get(normalized);

    if (!section) {
      missing.push(required);
      continue;
    }

    if (!cleanSectionContent(section.content)) {
      empty.push(required);
    }
  }

  return {
    ok: missing.length === 0 && empty.length === 0,
    missing,
    empty,
    sections,
  };
}

export function getSectionText(markdown, heading) {
  const sections = parseMarkdownSections(markdown);
  const section = sections.get(normalizeHeading(heading));
  return section ? cleanSectionContent(section.content) : "";
}
