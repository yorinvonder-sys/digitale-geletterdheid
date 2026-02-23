/**
 * Response Validator — OWASP A08:2021 (Data Integrity)
 * 
 * Validates the shape of API and Edge Function responses before
 * the application trusts and processes them.
 */

// ============================================================================
// TYPES
// ============================================================================

export interface ValidationError {
    field: string;
    expected: string;
    received: string;
}

// ============================================================================
// VALIDATORS
// ============================================================================

/**
 * Validate that an API response contains all required fields.
 * Throws a descriptive error if validation fails.
 * 
 * @param data - The raw response data to validate
 * @param requiredFields - List of field names that must be present
 * @param contextName - Human-readable name for error messages
 * @returns The validated data, typed as T
 */
export const validateResponse = <T>(
    data: unknown,
    requiredFields: string[],
    contextName: string
): T => {
    if (data === null || data === undefined) {
        throw new ResponseValidationError(
            `${contextName}: response is null/undefined`,
            [{ field: 'root', expected: 'object', received: String(data) }]
        );
    }

    if (typeof data !== 'object' || Array.isArray(data)) {
        throw new ResponseValidationError(
            `${contextName}: expected object, got ${Array.isArray(data) ? 'array' : typeof data}`,
            [{ field: 'root', expected: 'object', received: typeof data }]
        );
    }

    const record = data as Record<string, unknown>;
    const missingFields: ValidationError[] = [];

    for (const field of requiredFields) {
        if (!(field in record) || record[field] === undefined) {
            missingFields.push({
                field,
                expected: 'present',
                received: 'missing',
            });
        }
    }

    if (missingFields.length > 0) {
        throw new ResponseValidationError(
            `${contextName}: missing required fields: ${missingFields.map(f => f.field).join(', ')}`,
            missingFields
        );
    }

    return data as T;
};

/**
 * Validate and safely parse JSON from a string.
 * Returns the parsed result typed as T, or throws.
 */
export const safeJsonParse = <T>(
    raw: string,
    contextName: string
): T => {
    try {
        const parsed = JSON.parse(raw);
        return parsed as T;
    } catch (e) {
        throw new ResponseValidationError(
            `${contextName}: invalid JSON — ${(e as Error).message}`,
            [{ field: 'json', expected: 'valid JSON', received: raw.slice(0, 100) }]
        );
    }
};

/**
 * Validate that a value is a non-empty string.
 */
export const validateString = (
    value: unknown,
    fieldName: string
): string => {
    if (typeof value !== 'string' || value.trim().length === 0) {
        throw new ResponseValidationError(
            `${fieldName}: expected non-empty string`,
            [{ field: fieldName, expected: 'string', received: typeof value }]
        );
    }
    return value;
};

// ============================================================================
// ERROR CLASS
// ============================================================================

export class ResponseValidationError extends Error {
    public readonly errors: ValidationError[];

    constructor(message: string, errors: ValidationError[]) {
        super(message);
        this.name = 'ResponseValidationError';
        this.errors = errors;
    }
}
