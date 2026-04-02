/**
 * Recursief sanitizen van objecten voor Supabase database writes.
 * Verwijdert undefined, functions, symbols, NaN, Infinity en 'loading' placeholders.
 * Converteert Date objecten naar ISO strings.
 */
export const sanitizeForDb = (obj: any): any => {
    if (obj === null || obj === undefined) return null;
    if (obj instanceof Date) return obj.toISOString();
    if (typeof obj === 'number') {
        if (Number.isNaN(obj) || !Number.isFinite(obj)) return null;
        return obj;
    }
    if (typeof obj === 'string') {
        if (obj === 'loading') return null;
        return obj;
    }
    if (typeof obj === 'boolean') return obj;
    if (Array.isArray(obj)) {
        return obj
            .map(item => sanitizeForDb(item))
            .filter(item => item !== null && item !== undefined);
    }
    if (typeof obj === 'object') {
        const result: any = {};
        for (const [key, value] of Object.entries(obj)) {
            if (value === undefined) continue;
            if (typeof value === 'function') continue;
            if (typeof value === 'symbol') continue;
            const sanitizedValue = sanitizeForDb(value);
            if (sanitizedValue !== null && sanitizedValue !== undefined) {
                result[key] = sanitizedValue;
            }
        }
        return result;
    }
    return null;
};
