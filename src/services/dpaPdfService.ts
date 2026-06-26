/**
 * DPA PDF Service — Verwerkersovereenkomst Generator
 *
 * Genereert een complete, ondertekenbare Verwerkersovereenkomst (DPA) als PDF.
 * De juridische artikeltekst komt VERBATIM uit het template-bestand via een ?raw-import.
 * Schoolgegevens worden ingevuld door de gebruiker; DGSkills-gegevens zijn vooringevuld.
 *
 * GEEN database-writes, GEEN opslag, GEEN edge functions — puur client-side.
 */

import dpaRawMd from '../../business/nl-vo/compliance/A-model-verwerkersovereenkomst-dgskills.md?raw';
import {
    createBrandedPdf,
    sectionTitle,
    subSectionTitle,
    paragraph,
    bulletPoint,
    drawTable,
    highlightBox,
    spacer,
    divider,
    finalizePdf,
    type TableColumn,
} from './pdfBrandingService';

// ============================================================================
// DGSkills entiteitsgegevens (vooringevuld)
// ============================================================================

const DGSKILLS_ENTITY = {
    handelsnaam: 'DGSkills.app',
    rechtsvorm: 'Eenmanszaak',
    kvkNummer: '81819889',
    vestigingsnummer: '000048087815',
    adres: 'Oldruitenborghstraat 39, 8043 TP Zwolle',
    email: 'info@dgskills.app',
} as const;

// ============================================================================
// Subverwerkers (vooringevuld)
// ============================================================================

const SUBVERWERKERS = [
    {
        naam: 'Supabase',
        dienst: 'Database / Auth / Hosting backend',
        locatie: 'EU-projectregio / EER, contractueel en projectmatig te verifieren',
        eerDoorgifte: 'Nee',
        regio: 'EU',
    },
    {
        naam: 'Mistral AI',
        dienst: 'Tekst / Vision / OCR AI-modellen',
        locatie: 'api.mistral.ai (Frankrijk)',
        eerDoorgifte: 'Nee',
        regio: 'EU',
    },
    {
        naam: 'Black Forest Labs',
        dienst: 'Beeldgeneratie (FLUX)',
        locatie: 'api.eu.bfl.ai (EU-endpoint)',
        eerDoorgifte: 'Via EU-endpoint',
        regio: 'EU-endpoint',
    },
    {
        naam: 'Vercel',
        dienst: 'Frontend hosting / CDN',
        locatie: 'EU-edge (ams1)',
        eerDoorgifte: 'Mogelijk (VS)',
        regio: 'EU primair',
    },
] as const;

// ============================================================================
// Formulierdata interface
// ============================================================================

export interface DpaFormData {
    schoolNaam: string;
    bezoekadres: string;
    postcodePlaats: string;
    kvkNummer?: string;
    vertegenwoordigerNaam: string;
    vertegenwoordigerFunctie: string;
    vertegenwoordigerEmail: string;
    ondertekeningPlaats: string;
    ondertekeningDatum: string;
    verwerkerVertegenwoordiger: string;
}

// ============================================================================
// Helpers
// ============================================================================

function slugify(naam: string): string {
    return naam
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60);
}

/**
 * Eenvoudige markdown → PDF renderer voor de constructies die in DIT bestand voorkomen:
 * - # / ## / ### koppen → sectionTitle / subSectionTitle / paragraph bold
 * - alinea's (tekst zonder prefix)
 * - **bold** inline → strippt markdown, rendert als bold paragraph
 * - genummerde lijsten (1. 2. ...)
 * - bullets (- )
 * - pipe-tabellen (| a | b |) → drawTable
 * - --- scheidingslijnen → divider
 *
 * Oproep met de verbatim md-string; long lines wrapt paragraph() automatisch.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderMarkdownSection(ctx: any, md: string): void {
    // Verwijder CRLF
    const text = md.replace(/\r\n/g, '\n');
    const lines = text.split('\n');

    let i = 0;
    while (i < lines.length) {
        const line = lines[i];

        // Sla lege regels op maar registreer kleine spatie
        if (line.trim() === '') {
            // Kijk of het een scheiding is tussen alinea's
            i++;
            continue;
        }

        // Horizontale lijn
        if (/^---+$/.test(line.trim())) {
            divider(ctx);
            i++;
            continue;
        }

        // Pipe-tabel: verzamel alle tabelregels
        if (line.trim().startsWith('|')) {
            const tableLines: string[] = [];
            while (i < lines.length && lines[i].trim().startsWith('|')) {
                tableLines.push(lines[i]);
                i++;
            }
            renderPipeTable(ctx, tableLines);
            spacer(ctx, 3);
            continue;
        }

        // # Kop niveau 1 (hoofdtitel) — als sectionTitle
        if (/^# /.test(line)) {
            const title = line.replace(/^# /, '').trim();
            sectionTitle(ctx, title);
            i++;
            continue;
        }

        // ## Kop niveau 2 — sectionTitle
        if (/^## /.test(line)) {
            const title = line.replace(/^## /, '').trim();
            spacer(ctx, 2);
            sectionTitle(ctx, title);
            i++;
            continue;
        }

        // ### Kop niveau 3 — subSectionTitle
        if (/^### /.test(line)) {
            const title = line.replace(/^### /, '').trim();
            subSectionTitle(ctx, title);
            i++;
            continue;
        }

        // Genummerde lijst (1. 2. enz.) — nummer BEHOUDEN: lid-nummering is
        // juridisch betekenisvol (interne verwijzingen "zoals bedoeld in lid 1").
        if (/^\d+\. /.test(line.trim())) {
            const clean = stripInlineMarkdown(line.trim());
            paragraph(ctx, clean);
            i++;
            continue;
        }

        // Sub-genummerd (   - a. / - b.)
        if (/^[\s\t]+-\s+[a-z]\.\s/.test(line) || /^[\s\t]+-\s+[a-z]\.\s/.test(line)) {
            const text2 = line.replace(/^[\s\t]+-\s+/, '').trim();
            const clean = stripInlineMarkdown(text2);
            bulletPoint(ctx, clean, { indent: 10 });
            i++;
            continue;
        }

        // Bullet (- )
        if (/^[\s\t]*-\s/.test(line)) {
            const text2 = line.replace(/^[\s\t]*-\s/, '').trim();
            const clean = stripInlineMarkdown(text2);
            bulletPoint(ctx, clean, { indent: 6 });
            i++;
            continue;
        }

        // Gewone alinea (inclusief **bold** inline)
        const cleanLine = stripInlineMarkdown(line.trim());
        if (cleanLine) {
            paragraph(ctx, cleanLine);
        }
        i++;
    }
}

/**
 * Verwijder inline markdown (**bold**, *italic*, `code`) en bewaar de tekst.
 * Verlies GEEN woorden — alleen de opmaaktekens worden weggehaald.
 */
function stripInlineMarkdown(text: string): string {
    return text
        .replace(/\*\*([^*]+)\*\*/g, '$1')   // **bold**
        .replace(/\*([^*]+)\*/g, '$1')         // *italic*
        .replace(/`([^`]+)`/g, '$1')           // `code`
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // [text](url)
}

/**
 * Parseer pipe-tabel en stuur naar drawTable.
 * Negeert scheidingsrijen (|---|---|).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderPipeTable(ctx: any, tableLines: string[]): void {
    // Filter lege regels en scheidingsrijen
    const dataLines = tableLines.filter(l => {
        const trimmed = l.trim();
        return trimmed.startsWith('|') && !/^\|[\s\-|:]+\|$/.test(trimmed);
    });

    if (dataLines.length === 0) return;

    // Parse cellen
    const parseRow = (line: string): string[] =>
        line.trim()
            .replace(/^\|/, '')
            .replace(/\|$/, '')
            .split('|')
            .map(c => stripInlineMarkdown(c.trim()));

    const [headerRow, ...bodyRows] = dataLines;
    const headers = parseRow(headerRow);

    // Gelijke kolombreedtes
    const colW = Math.floor(100 / headers.length);
    const columns: TableColumn[] = headers.map(h => ({ header: h, width: colW }));

    // Laatste kolom krijgt de rest van de breedte
    if (columns.length > 0) {
        columns[columns.length - 1].width = 100 - colW * (columns.length - 1);
    }

    const rows = bodyRows.map(l => parseRow(l));

    drawTable(ctx, columns, rows);
}

// ============================================================================
// Hoofd export: generateDpaPdf
// ============================================================================

export async function generateDpaPdf(data: DpaFormData): Promise<void> {
    const { jsPDF } = await import('jspdf');

    const today = new Date().toLocaleDateString('nl-NL', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });

    const ctx = createBrandedPdf(jsPDF, {
        title: 'Verwerkersovereenkomst',
        subtitle: `DGSkills.app × ${data.schoolNaam}`,
        author: 'DGSkills.app',
        date: today,
    });

    // -------------------------------------------------------------------------
    // Disclaimer-box
    // -------------------------------------------------------------------------
    highlightBox(ctx,
        'CONCEPT-DOCUMENT — Gegenereerd op basis van Model Verwerkersovereenkomst 4.0. ' +
        'Laat dit document vóór ondertekening controleren door een jurist of FG.',
        { type: 'warning' }
    );
    spacer(ctx, 4);

    // -------------------------------------------------------------------------
    // Intro-alinea's uit de md (vóór ## PARTIJEN)
    // -------------------------------------------------------------------------
    const md = dpaRawMd;
    const partijIdx = md.indexOf('\n## PARTIJEN');
    const introPart = partijIdx > 0 ? md.slice(0, partijIdx) : '';
    if (introPart.trim()) {
        renderMarkdownSection(ctx, introPart);
        spacer(ctx, 2);
    }

    // -------------------------------------------------------------------------
    // PARTIJEN — ingevuld vanuit formulierdata (overschrijft het md-blok)
    // -------------------------------------------------------------------------
    sectionTitle(ctx, 'PARTIJEN');

    subSectionTitle(ctx, '1. De Onderwijsinstelling (Verwerkingsverantwoordelijke)');
    const schoolRows: string[][] = [
        ['Naam instelling', data.schoolNaam],
        ['Bezoekadres', data.bezoekadres],
        ['Postcode en plaats', data.postcodePlaats],
    ];
    if (data.kvkNummer) schoolRows.push(['KvK-nummer', data.kvkNummer]);
    schoolRows.push(
        ['Vertegenwoordigd door', data.vertegenwoordigerNaam],
        ['Functie', data.vertegenwoordigerFunctie],
        ['E-mailadres', data.vertegenwoordigerEmail],
    );
    drawTable(ctx, [
        { header: 'Veld', width: 40 },
        { header: 'Waarde', width: 60 },
    ], schoolRows);
    spacer(ctx, 3);

    subSectionTitle(ctx, '2. De Verwerker (DGSkills)');
    drawTable(ctx, [
        { header: 'Veld', width: 40 },
        { header: 'Waarde', width: 60 },
    ], [
        ['Handelsnaam', DGSKILLS_ENTITY.handelsnaam],
        ['Rechtsvorm', DGSKILLS_ENTITY.rechtsvorm],
        ['KvK-nummer', DGSKILLS_ENTITY.kvkNummer],
        ['Vestigingsnummer', DGSKILLS_ENTITY.vestigingsnummer],
        ['Adres', DGSKILLS_ENTITY.adres],
        ['E-mailadres', DGSKILLS_ENTITY.email],
        ['Vertegenwoordigd door', data.verwerkerVertegenwoordiger],
        ['Functie', 'Eigenaar / Directeur'],
    ]);
    spacer(ctx, 3);

    paragraph(ctx, 'Hierna gezamenlijk "Partijen" en afzonderlijk "Partij" genoemd.');
    divider(ctx);

    // -------------------------------------------------------------------------
    // Artikelen — VERBATIM uit de geïmporteerde md-string
    // -------------------------------------------------------------------------
    const artikel1Idx = md.indexOf('\n## Artikel 1');
    const ondertekeningIdx = md.indexOf('\n## ONDERTEKENING');

    if (artikel1Idx > 0 && ondertekeningIdx > artikel1Idx) {
        const artikelenPart = md.slice(artikel1Idx + 1, ondertekeningIdx);
        renderMarkdownSection(ctx, artikelenPart);
    }

    // -------------------------------------------------------------------------
    // ONDERTEKENING — ingevuld vanuit formulierdata
    // -------------------------------------------------------------------------
    spacer(ctx, 4);
    sectionTitle(ctx, 'ONDERTEKENING');
    spacer(ctx, 2);

    paragraph(ctx,
        `Aldus overeengekomen en in tweevoud ondertekend te ${data.ondertekeningPlaats}, ` +
        `op ${data.ondertekeningDatum}.`
    );
    spacer(ctx, 4);

    drawTable(ctx, [
        { header: '', width: 10 },
        { header: 'Verwerkingsverantwoordelijke', width: 45 },
        { header: 'Verwerker (DGSkills)', width: 45 },
    ], [
        ['Naam', data.vertegenwoordigerNaam, data.verwerkerVertegenwoordiger],
        ['Functie', data.vertegenwoordigerFunctie, 'Eigenaar / Directeur'],
        ['Organisatie', data.schoolNaam, DGSKILLS_ENTITY.handelsnaam],
        ['Datum', data.ondertekeningDatum, data.ondertekeningDatum],
        ['Handtekening', '', ''],
        ['', '', ''],
    ]);
    spacer(ctx, 4);

    // -------------------------------------------------------------------------
    // BIJLAGEN — verbatim uit md (na ## BIJLAGEN)
    // -------------------------------------------------------------------------
    const bijlagenIdx = md.indexOf('\n## BIJLAGEN');
    const bijlage3Eind = md.indexOf('\n---\n\n*Dit document');
    const bijlagenPart = bijlagenIdx > 0
        ? (bijlage3Eind > bijlagenIdx ? md.slice(bijlagenIdx + 1, bijlage3Eind + 1) : md.slice(bijlagenIdx + 1))
        : '';

    if (bijlagenPart.trim()) {
        renderMarkdownSection(ctx, bijlagenPart);
        spacer(ctx, 4);
    }

    // -------------------------------------------------------------------------
    // Sub-verwerkersoverzicht (vooringevuld)
    // -------------------------------------------------------------------------
    sectionTitle(ctx, 'Sub-verwerkersoverzicht (Bijlage 4)');
    spacer(ctx, 2);
    drawTable(ctx, [
        { header: 'Sub-verwerker', width: 20 },
        { header: 'Dienst', width: 35 },
        { header: 'Locatie', width: 25 },
        { header: 'EER-doorgifte?', width: 20 },
    ], SUBVERWERKERS.map(sv => [
        sv.naam,
        sv.dienst,
        sv.locatie,
        sv.eerDoorgifte,
    ]));
    spacer(ctx, 4);

    // -------------------------------------------------------------------------
    // Slotzin (verbatim uit md)
    // -------------------------------------------------------------------------
    const slotIdx = md.indexOf('\n*Dit document is opgesteld');
    if (slotIdx > 0) {
        const slotTekst = md.slice(slotIdx + 1).replace(/\*([^*]+)\*/g, '$1').trim();
        if (slotTekst) paragraph(ctx, slotTekst, { color: [120, 100, 80] });
    }

    // -------------------------------------------------------------------------
    // Opslaan
    // -------------------------------------------------------------------------
    const slug = slugify(data.schoolNaam);
    finalizePdf(ctx, `Verwerkersovereenkomst_DGSkills_${slug}.pdf`);
}
