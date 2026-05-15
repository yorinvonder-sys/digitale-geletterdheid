export interface BuildCsvOptions {
  delimiter?: string;
  includeBom?: boolean;
}

const DEFAULT_DELIMITER = ',';

function needsFormulaNeutralization(value: string): boolean {
  return /^[\t\r\n]/.test(value)
    || /^[ \t\r\n]*[=+\-@]/.test(value)
    || /[\r\n]/.test(value);
}

export function neutralizeCsvFormula(value: string): string {
  return needsFormulaNeutralization(value) ? `'${value}` : value;
}

export function escapeCsvCell(value: unknown, delimiter = DEFAULT_DELIMITER): string {
  if (value === null || value === undefined) return '';

  const raw = String(value);
  const safe = typeof value === 'string' ? neutralizeCsvFormula(raw) : raw;
  const mustQuote = safe.includes(delimiter)
    || safe.includes('"')
    || safe.includes('\n')
    || safe.includes('\r');

  return mustQuote ? `"${safe.replace(/"/g, '""')}"` : safe;
}

export function csvRow(values: unknown[], delimiter = DEFAULT_DELIMITER): string {
  return values.map((value) => escapeCsvCell(value, delimiter)).join(delimiter);
}

export function buildCsv(rows: unknown[][], options: BuildCsvOptions = {}): string {
  const delimiter = options.delimiter ?? DEFAULT_DELIMITER;
  const body = rows.map((row) => csvRow(row, delimiter)).join('\n');
  return options.includeBom ? `\uFEFF${body}` : body;
}

export function downloadCsv(filename: string, rows: unknown[][], options: BuildCsvOptions = {}): void {
  const csv = buildCsv(rows, { ...options, includeBom: true });
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
