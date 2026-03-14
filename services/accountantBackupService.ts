/**
 * Accountant Backup Service — Volledige backup van boekhouding
 *
 * Biedt functies voor:
 * - Data export als JSON (alle tabellen)
 * - ZIP download met bestanden + bonnetje-afbeeldingen
 * - CSV jaaroverzicht van transacties
 * - Backup timestamp tracking
 *
 * Bewaarplicht: De Belastingdienst vereist 7 jaar bewaring van administratie.
 */

import { supabase } from './supabase';
import {
    AccountantTransaction,
    AccountantReceipt,
    AccountantSettings,
    CATEGORY_LABELS,
    getTransactions,
    getReceipts,
    getSettings,
} from './accountantService';
import {
    Subscription,
    getSubscriptions,
} from './accountantSubscriptionsService';
import {
    Invoice,
    getInvoices,
} from './accountantInvoicesService';
import {
    HourEntry,
    getHourEntries,
} from './accountantHoursService';
import JSZip from 'jszip';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

// ===========================================================================
// Types
// ===========================================================================

export interface BackupData {
    exportDate: string;
    exportYear: number | 'alle';
    versie: string;
    transacties: AccountantTransaction[];
    bonnetjes: AccountantReceipt[];
    abonnementen: Subscription[];
    uren: HourEntry[];
    facturen: Invoice[];
    instellingen: AccountantSettings | null;
}

export interface BackupProgress {
    phase: string;
    current: number;
    total: number;
}

// ===========================================================================
// Data export
// ===========================================================================

/**
 * Exporteert alle boekhouddata als gestructureerde JSON.
 * Optioneel gefilterd op jaar (zonder jaar = alle data).
 */
export async function exportAllDataJSON(
    userId: string,
    year?: number,
): Promise<BackupData> {
    // Bepaal jaarbereik: als geen jaar, pak alle jaren (2020-huidig+1)
    const currentYear = new Date().getFullYear();
    const years = year
        ? [year]
        : Array.from({ length: currentYear - 2019 }, (_, i) => 2020 + i);

    // Haal alle data parallel op
    const [
        transactionsArrays,
        receiptsArrays,
        abonnementen,
        hoursArrays,
        invoicesArrays,
        instellingen,
    ] = await Promise.all([
        Promise.all(years.map(y => getTransactions(userId, y))),
        Promise.all(years.map(y => getReceipts(userId, y))),
        getSubscriptions(userId),
        Promise.all(years.map(y => getHourEntries(userId, y))),
        Promise.all(years.map(y => getInvoices(userId, y))),
        getSettings(userId),
    ]);

    return {
        exportDate: new Date().toISOString(),
        exportYear: year || 'alle',
        versie: '1.0',
        transacties: transactionsArrays.flat(),
        bonnetjes: receiptsArrays.flat(),
        abonnementen,
        uren: hoursArrays.flat(),
        facturen: invoicesArrays.flat(),
        instellingen,
    };
}

// ===========================================================================
// CSV generatie
// ===========================================================================

function escapeCSV(value: string | number | undefined | null): string {
    if (value === undefined || value === null) return '';
    const str = String(value);
    if (str.includes(';') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

function transactiesToCSV(transacties: AccountantTransaction[]): string {
    const header = 'Datum;Bedrag;Categorie;Omschrijving;Bron;Priv\u00e9;Km';
    const rows = transacties.map(tx => [
        escapeCSV(tx.date),
        escapeCSV(tx.amount.toFixed(2).replace('.', ',')),
        escapeCSV(CATEGORY_LABELS[tx.category] || tx.category),
        escapeCSV(tx.description),
        escapeCSV(tx.imported_from || 'handmatig'),
        escapeCSV(tx.is_private ? 'Ja' : 'Nee'),
        escapeCSV(tx.km_distance ?? ''),
    ].join(';'));

    return [header, ...rows].join('\n');
}

// ===========================================================================
// Storage pad extractie
// ===========================================================================

/**
 * Extraheert het Supabase Storage pad uit een bonnetje image_url.
 * Verwacht format: .../receipts/{userId}/{uuid}.{ext}
 */
function extractStoragePath(imageUrl: string): string | null {
    const marker = '/receipts/';
    const idx = imageUrl.indexOf(marker);
    if (idx === -1) return null;
    // Alles na '/receipts/' is het pad
    const path = imageUrl.substring(idx + marker.length);
    // Strip eventuele query params
    return path.split('?')[0];
}

// ===========================================================================
// ZIP download
// ===========================================================================

/**
 * Maakt een volledige backup als ZIP-bestand en triggert een download.
 * Bevat JSON data, bonnetje-afbeeldingen, en CSV jaaroverzicht.
 *
 * @param onProgress - Callback voor voortgang (fase, huidig, totaal)
 */
export async function downloadBackupZIP(
    userId: string,
    year?: number,
    onProgress?: (progress: BackupProgress) => void,
): Promise<void> {
    const zip = new JSZip();

    // Fase 1: Data ophalen
    onProgress?.({ phase: 'Data ophalen...', current: 0, total: 1 });
    const data = await exportAllDataJSON(userId, year);
    onProgress?.({ phase: 'Data ophalen...', current: 1, total: 1 });

    // Fase 2: JSON bestanden toevoegen
    onProgress?.({ phase: 'Bestanden genereren...', current: 0, total: 6 });

    zip.file('data/transacties.json', JSON.stringify(data.transacties, null, 2));
    onProgress?.({ phase: 'Bestanden genereren...', current: 1, total: 6 });

    zip.file('data/bonnetjes.json', JSON.stringify(data.bonnetjes, null, 2));
    onProgress?.({ phase: 'Bestanden genereren...', current: 2, total: 6 });

    zip.file('data/abonnementen.json', JSON.stringify(data.abonnementen, null, 2));
    onProgress?.({ phase: 'Bestanden genereren...', current: 3, total: 6 });

    zip.file('data/uren.json', JSON.stringify(data.uren, null, 2));
    onProgress?.({ phase: 'Bestanden genereren...', current: 4, total: 6 });

    zip.file('data/facturen.json', JSON.stringify(data.facturen, null, 2));
    onProgress?.({ phase: 'Bestanden genereren...', current: 5, total: 6 });

    zip.file('data/instellingen.json', JSON.stringify(data.instellingen, null, 2));
    onProgress?.({ phase: 'Bestanden genereren...', current: 6, total: 6 });

    // Fase 3: CSV jaaroverzicht
    const csvContent = transactiesToCSV(data.transacties);
    zip.file('export/jaaroverzicht.csv', csvContent);

    // Fase 4: Bonnetje-afbeeldingen downloaden uit Storage
    const receiptsWithImages = data.bonnetjes.filter(b => b.image_url);
    if (receiptsWithImages.length > 0) {
        onProgress?.({ phase: 'Bonnetjes downloaden...', current: 0, total: receiptsWithImages.length });

        for (let i = 0; i < receiptsWithImages.length; i++) {
            const receipt = receiptsWithImages[i];
            const storagePath = extractStoragePath(receipt.image_url!);
            if (!storagePath) continue;

            try {
                const { data: fileData, error } = await supabase.storage
                    .from('receipts')
                    .download(storagePath);

                if (!error && fileData) {
                    // Gebruik originele bestandsnaam uit het pad
                    const filename = storagePath.split('/').pop() || `bonnetje-${i}.jpg`;
                    zip.file(`bonnetjes/${filename}`, fileData);
                }
            } catch {
                // Sla over als download mislukt — data is al in JSON opgenomen
            }

            onProgress?.({ phase: 'Bonnetjes downloaden...', current: i + 1, total: receiptsWithImages.length });
        }
    }

    // Fase 5: ZIP genereren en downloaden
    onProgress?.({ phase: 'ZIP samenstellen...', current: 0, total: 1 });

    const blob = await zip.generateAsync({ type: 'blob' });
    onProgress?.({ phase: 'ZIP samenstellen...', current: 1, total: 1 });

    // Trigger browser download
    const yearLabel = year || 'compleet';
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `boekhouding-backup-${yearLabel}-${dateStr}.zip`;

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Sla backup timestamp op
    await saveBackupTimestamp(userId);
}

// ===========================================================================
// Backup timestamp tracking
// ===========================================================================

/**
 * Haalt de datum van de laatste backup op.
 * Slaat op in accountant_settings als extra veld via een aparte tabel
 * (accountant_backup_log), of localStorage als fallback.
 */
export async function getLastBackupDate(userId: string): Promise<string | null> {
    // Probeer eerst uit database
    try {
        const { data, error } = await db
            .from('accountant_backup_log')
            .select('backup_date')
            .eq('user_id', userId)
            .order('backup_date', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (!error && data?.backup_date) {
            return data.backup_date as string;
        }
    } catch {
        // Tabel bestaat mogelijk nog niet — gebruik localStorage fallback
    }

    // Fallback: localStorage
    const key = `accountant_last_backup_${userId}`;
    return localStorage.getItem(key);
}

/**
 * Slaat een backup timestamp op na een succesvolle download.
 */
export async function saveBackupTimestamp(userId: string): Promise<void> {
    const now = new Date().toISOString();

    // Probeer in database op te slaan
    try {
        await db
            .from('accountant_backup_log')
            .insert({ user_id: userId, backup_date: now });
    } catch {
        // Tabel bestaat mogelijk nog niet — geen probleem
    }

    // Altijd ook localStorage als fallback
    const key = `accountant_last_backup_${userId}`;
    localStorage.setItem(key, now);
}

// ===========================================================================
// Helpers
// ===========================================================================

/**
 * Controleert of de backup ouder is dan het opgegeven aantal dagen.
 */
export function isBackupStale(lastBackupDate: string | null, days: number): boolean {
    if (!lastBackupDate) return true;
    const last = new Date(lastBackupDate).getTime();
    const now = Date.now();
    return (now - last) > days * 24 * 60 * 60 * 1000;
}
