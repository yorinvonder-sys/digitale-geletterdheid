/**
 * Accountant Asset Service — Bedrijfsmiddelen & Afschrijvingen
 *
 * Beheert bedrijfsmiddelen (laptop, bureau, software, etc.) en berekent
 * lineaire afschrijving, boekwaarde en Kleinschaligheidsinvesteringsaftrek (KIA).
 */

import { supabase } from './supabase';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

// ===========================================================================
// Types
// ===========================================================================

export type AssetCategory = 'computer' | 'meubilair' | 'software' | 'vervoer' | 'overig';
export type DepreciationMethod = 'linear' | 'declining';

export const ASSET_CATEGORY_LABELS: Record<AssetCategory, string> = {
    computer:   'Computer / Laptop',
    meubilair:  'Meubilair',
    software:   'Software',
    vervoer:    'Auto / Fiets',
    overig:     'Overig',
};

export const DEFAULT_USEFUL_LIFE: Record<AssetCategory, number> = {
    computer:   3,
    meubilair:  5,
    software:   3,
    vervoer:    5,
    overig:     5,
};

export interface Asset {
    id?: string;
    user_id: string;
    name: string;
    purchase_date: string;         // YYYY-MM-DD
    purchase_price: number;
    residual_value: number;
    useful_life_years: number;
    depreciation_method: DepreciationMethod;
    category: AssetCategory;
    notes?: string;
    is_disposed: boolean;
    disposal_date?: string | null;
    disposal_amount?: number | null;
    created_at?: string;
}

export interface DepreciationResult {
    year: number;
    depreciationAmount: number;    // Afschrijving dat jaar
    bookValueStart: number;        // Boekwaarde begin jaar
    bookValueEnd: number;          // Boekwaarde eind jaar
}

// ===========================================================================
// CRUD
// ===========================================================================

export async function getAssets(userId: string): Promise<Asset[]> {
    const { data, error } = await db
        .from('accountant_assets')
        .select('*')
        .eq('user_id', userId)
        .order('is_disposed', { ascending: true })
        .order('purchase_date', { ascending: false });

    if (error) throw new Error(`Bedrijfsmiddelen ophalen mislukt: ${error.message}`);
    return (data || []) as Asset[];
}

export async function createAsset(
    asset: Omit<Asset, 'id' | 'created_at'>
): Promise<Asset> {
    const { data, error } = await db
        .from('accountant_assets')
        .insert(asset)
        .select()
        .single();

    if (error) throw new Error(`Bedrijfsmiddel aanmaken mislukt: ${error.message}`);
    return data as Asset;
}

export async function updateAsset(
    id: string,
    updates: Partial<Asset>
): Promise<void> {
    const { error } = await db
        .from('accountant_assets')
        .update(updates)
        .eq('id', id);

    if (error) throw new Error(`Bedrijfsmiddel bijwerken mislukt: ${error.message}`);
}

export async function deleteAsset(id: string): Promise<void> {
    const { error } = await db
        .from('accountant_assets')
        .delete()
        .eq('id', id);

    if (error) throw new Error(`Bedrijfsmiddel verwijderen mislukt: ${error.message}`);
}

export async function disposeAsset(
    id: string,
    disposalDate: string,
    disposalAmount: number
): Promise<void> {
    const { error } = await db
        .from('accountant_assets')
        .update({
            is_disposed: true,
            disposal_date: disposalDate,
            disposal_amount: disposalAmount,
        })
        .eq('id', id);

    if (error) throw new Error(`Bedrijfsmiddel afstoten mislukt: ${error.message}`);
}

// ===========================================================================
// Afschrijvingsberekening
// ===========================================================================

/**
 * Berekent de afschrijving voor een specifiek jaar.
 *
 * Lineair: (aanschafwaarde - restwaarde) / levensduur
 * Pro-rata eerste jaar: naar rato van resterende maanden (incl. aanschafmaand)
 * Pro-rata laatste jaar: naar rato van verstreken maanden
 * Stopt bij restwaarde.
 *
 * Bij degressieve methode: 2x lineair percentage over boekwaarde,
 * maar nooit onder restwaarde.
 */
export function calculateDepreciation(asset: Asset, year: number): DepreciationResult {
    const purchaseYear = parseInt(asset.purchase_date.split('-')[0]);
    const purchaseMonth = parseInt(asset.purchase_date.split('-')[1]);
    const depreciableAmount = asset.purchase_price - asset.residual_value;
    const endYear = purchaseYear + asset.useful_life_years;

    // Buiten afschrijvingsperiode
    if (year < purchaseYear || year > endYear || depreciableAmount <= 0) {
        const bookValue = year < purchaseYear
            ? asset.purchase_price
            : asset.residual_value;
        return {
            year,
            depreciationAmount: 0,
            bookValueStart: bookValue,
            bookValueEnd: bookValue,
        };
    }

    if (asset.depreciation_method === 'linear') {
        return calculateLinearDepreciation(asset, year, purchaseYear, purchaseMonth, depreciableAmount, endYear);
    } else {
        return calculateDecliningDepreciation(asset, year, purchaseYear, purchaseMonth, depreciableAmount);
    }
}

function calculateLinearDepreciation(
    asset: Asset,
    year: number,
    purchaseYear: number,
    purchaseMonth: number,
    depreciableAmount: number,
    endYear: number,
): DepreciationResult {
    const yearlyFull = depreciableAmount / asset.useful_life_years;

    // Bereken boekwaarde begin van het gevraagde jaar door alle voorgaande jaren op te tellen
    let totalDepreciated = 0;
    for (let y = purchaseYear; y < year; y++) {
        if (y === purchaseYear) {
            // Pro-rata eerste jaar: resterende maanden incl. aanschafmaand
            const monthsRemaining = 13 - purchaseMonth; // incl. aanschafmaand
            totalDepreciated += yearlyFull * (monthsRemaining / 12);
        } else if (y === endYear) {
            // Laatste jaar: resterende afschrijving
            const remaining = depreciableAmount - totalDepreciated;
            totalDepreciated += Math.max(0, remaining);
        } else {
            totalDepreciated += yearlyFull;
        }
    }

    // Begrens op totale afschrijfbare waarde
    totalDepreciated = Math.min(totalDepreciated, depreciableAmount);
    const bookValueStart = asset.purchase_price - totalDepreciated;

    // Afschrijving dit jaar
    let depreciationThisYear: number;
    if (year === purchaseYear) {
        const monthsRemaining = 13 - purchaseMonth;
        depreciationThisYear = yearlyFull * (monthsRemaining / 12);
    } else if (year === endYear) {
        // Laatste jaar: alleen het restant
        depreciationThisYear = depreciableAmount - totalDepreciated;
    } else {
        depreciationThisYear = yearlyFull;
    }

    // Nooit meer afschrijven dan wat er nog over is
    depreciationThisYear = Math.max(0, Math.min(depreciationThisYear, bookValueStart - asset.residual_value));

    // Afstoting: stop afschrijving na disposal
    if (asset.is_disposed && asset.disposal_date) {
        const disposalYear = parseInt(asset.disposal_date.split('-')[0]);
        if (year > disposalYear) {
            return {
                year,
                depreciationAmount: 0,
                bookValueStart: asset.residual_value,
                bookValueEnd: asset.residual_value,
            };
        }
        if (year === disposalYear) {
            const disposalMonth = parseInt(asset.disposal_date.split('-')[1]);
            depreciationThisYear = depreciationThisYear * (disposalMonth / 12);
        }
    }

    const bookValueEnd = bookValueStart - depreciationThisYear;

    return {
        year,
        depreciationAmount: Math.round(depreciationThisYear * 100) / 100,
        bookValueStart: Math.round(bookValueStart * 100) / 100,
        bookValueEnd: Math.round(Math.max(bookValueEnd, asset.residual_value) * 100) / 100,
    };
}

function calculateDecliningDepreciation(
    asset: Asset,
    year: number,
    purchaseYear: number,
    purchaseMonth: number,
    depreciableAmount: number,
): DepreciationResult {
    // Degressief: 2x het lineaire percentage, toegepast op boekwaarde
    const linearRate = 1 / asset.useful_life_years;
    const decliningRate = Math.min(linearRate * 2, 1);

    let bookValue = asset.purchase_price;

    // Bereken boekwaarde door alle voorgaande jaren te doorlopen
    for (let y = purchaseYear; y < year; y++) {
        let dep: number;
        if (y === purchaseYear) {
            const monthsRemaining = 13 - purchaseMonth;
            dep = bookValue * decliningRate * (monthsRemaining / 12);
        } else {
            dep = bookValue * decliningRate;
        }
        // Niet onder restwaarde
        dep = Math.min(dep, bookValue - asset.residual_value);
        dep = Math.max(0, dep);
        bookValue -= dep;
    }

    const bookValueStart = bookValue;

    // Afschrijving dit jaar
    let depreciationThisYear: number;
    if (year === purchaseYear) {
        const monthsRemaining = 13 - purchaseMonth;
        depreciationThisYear = bookValue * decliningRate * (monthsRemaining / 12);
    } else {
        depreciationThisYear = bookValue * decliningRate;
    }

    depreciationThisYear = Math.min(depreciationThisYear, bookValueStart - asset.residual_value);
    depreciationThisYear = Math.max(0, depreciationThisYear);

    // Afstoting
    if (asset.is_disposed && asset.disposal_date) {
        const disposalYear = parseInt(asset.disposal_date.split('-')[0]);
        if (year > disposalYear) {
            return {
                year,
                depreciationAmount: 0,
                bookValueStart: asset.residual_value,
                bookValueEnd: asset.residual_value,
            };
        }
        if (year === disposalYear) {
            const disposalMonth = parseInt(asset.disposal_date.split('-')[1]);
            depreciationThisYear = depreciationThisYear * (disposalMonth / 12);
        }
    }

    const bookValueEnd = bookValueStart - depreciationThisYear;

    return {
        year,
        depreciationAmount: Math.round(depreciationThisYear * 100) / 100,
        bookValueStart: Math.round(bookValueStart * 100) / 100,
        bookValueEnd: Math.round(Math.max(bookValueEnd, asset.residual_value) * 100) / 100,
    };
}

/**
 * Berekent de totale afschrijving voor een gebruiker in een specifiek jaar.
 */
export async function calculateTotalDepreciation(userId: string, year: number): Promise<number> {
    const assets = await getAssets(userId);
    let total = 0;

    for (const asset of assets) {
        const result = calculateDepreciation(asset, year);
        total += result.depreciationAmount;
    }

    return Math.round(total * 100) / 100;
}

/**
 * Berekent de huidige boekwaarde van een bedrijfsmiddel.
 */
export function calculateCurrentBookValue(asset: Asset): number {
    const currentYear = new Date().getFullYear();
    const result = calculateDepreciation(asset, currentYear);
    return result.bookValueEnd;
}

/**
 * Geeft het volledige afschrijvingsschema voor een bedrijfsmiddel.
 */
export function getDepreciationSchedule(asset: Asset): DepreciationResult[] {
    const purchaseYear = parseInt(asset.purchase_date.split('-')[0]);
    const endYear = purchaseYear + asset.useful_life_years;
    const schedule: DepreciationResult[] = [];

    for (let year = purchaseYear; year <= endYear; year++) {
        schedule.push(calculateDepreciation(asset, year));
    }

    return schedule;
}

// ===========================================================================
// Kleinschaligheidsinvesteringsaftrek (KIA) 2025
// ===========================================================================

/**
 * KIA-staffel 2025:
 * - Investering < EUR 2.901: geen aftrek
 * - EUR 2.901 - EUR 69.764: 28% van het investeringsbedrag
 * - EUR 69.765 - EUR 129.194: EUR 19.534 - (7,72% x (investering - EUR 69.764))
 * - EUR 129.195 - EUR 398.235: EUR 14.946 - (5,53% x (investering - EUR 129.194))
 * - > EUR 398.235: geen aftrek
 */
export async function calculateKIA(userId: string, year: number): Promise<{
    totalInvestment: number;
    kiaAmount: number;
    qualifyingAssets: Asset[];
}> {
    const assets = await getAssets(userId);

    // KIA geldt alleen voor nieuwe investeringen in dat jaar
    const qualifyingAssets = assets.filter(a => {
        const purchaseYear = parseInt(a.purchase_date.split('-')[0]);
        return purchaseYear === year && !a.is_disposed;
    });

    const totalInvestment = qualifyingAssets.reduce((sum, a) => sum + a.purchase_price, 0);

    let kiaAmount = 0;

    if (totalInvestment >= 2901 && totalInvestment <= 69764) {
        kiaAmount = totalInvestment * 0.28;
    } else if (totalInvestment >= 69765 && totalInvestment <= 129194) {
        kiaAmount = 19534 - 0.0772 * (totalInvestment - 69764);
    } else if (totalInvestment >= 129195 && totalInvestment <= 398235) {
        kiaAmount = 14946 - 0.0553 * (totalInvestment - 129194);
    }
    // < 2901 of > 398235: geen aftrek

    kiaAmount = Math.max(0, Math.round(kiaAmount * 100) / 100);

    return { totalInvestment, kiaAmount, qualifyingAssets };
}
