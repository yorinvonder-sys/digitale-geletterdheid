export interface CsvSection {
    title: string;
    rows: unknown[][];
}

function escapeCsvCell(value: unknown, delimiter: string): string {
    if (value === null || value === undefined) return '';
    const raw = value instanceof Date ? value.toISOString() : String(value);
    const normalized = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const quoted = normalized.replace(/"/g, '""');
    const needsQuotes = quoted.includes(delimiter) || quoted.includes('"') || quoted.includes('\n');
    return needsQuotes ? `"${quoted}"` : quoted;
}

export function rowsToCsv(rows: unknown[][], delimiter = ';'): string {
    return rows.map((row) => row.map((cell) => escapeCsvCell(cell, delimiter)).join(delimiter)).join('\n');
}

export function sectionsToCsv(sections: CsvSection[], delimiter = ';'): string {
    const chunks: string[] = [];
    sections.forEach((section, index) => {
        if (index > 0) {
            chunks.push('');
            chunks.push('');
        }
        chunks.push(`# ${section.title}`);
        chunks.push(rowsToCsv(section.rows, delimiter));
    });
    return chunks.join('\n');
}

export function downloadCsv(content: string, filename: string): void {
    const blob = new Blob([`\uFEFF${content}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}
