/**
 * Error Message Utilities
 *
 * Centralizes error-to-user-message mapping and service error wrapping.
 * Keeps raw error details out of the UI while logging them for debugging.
 */
import { logger } from './logger';

/**
 * Known error patterns → Dutch user-friendly messages.
 */
const KNOWN_PATTERNS: Array<[RegExp, string]> = [
    [/duplicate key|unique constraint/i, 'Dit bestaat al.'],
    [/violates foreign key/i, 'Deze actie kan niet worden uitgevoerd vanwege een koppeling met andere gegevens.'],
    [/violates row.?level security|permission denied/i, 'Je hebt geen toegang tot deze gegevens.'],
    [/Failed to fetch|network|timeout|load failed/i, 'Verbindingsprobleem. Controleer je internetverbinding en probeer het opnieuw.'],
];

const DEFAULT_MESSAGE = 'Er is iets misgegaan. Probeer het opnieuw.';

/**
 * Convert an unknown error to a user-friendly Dutch message.
 * Matches known patterns first; falls back to the provided fallback or the default.
 *
 * @param error   - The caught error (Error instance or any other value).
 * @param fallback - Optional override for the default fallback message.
 */
export function toUserMessage(error: unknown, fallback?: string): string {
    const raw = error instanceof Error ? error.message : String(error);
    for (const [pattern, message] of KNOWN_PATTERNS) {
        if (pattern.test(raw)) return message;
    }
    return fallback ?? DEFAULT_MESSAGE;
}

/**
 * Wrap a service-level error: logs the raw message for debugging and returns
 * a clean Error with a generic Dutch message safe to surface upstream.
 *
 * @param context - Short label identifying the operation (e.g. 'Feedback laden').
 * @param error   - The caught error.
 */
export function toServiceError(context: string, error: unknown): Error {
    const raw = error instanceof Error ? error.message : String(error);
    logger.error(`[${context}]`, raw);
    return new Error(`${context} is mislukt. Probeer het opnieuw.`);
}
