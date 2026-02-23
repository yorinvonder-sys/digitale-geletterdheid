/**
 * Input Sanitization Utilities
 * 
 * Centralized input validation and sanitization for all user-facing forms.
 * Prevents XSS, script injection, and data abuse in text fields.
 */
import DOMPurify from 'dompurify';

/**
 * Strip HTML tags and limit length of free text input.
 * Use on chat messages, feedback, teacher notes, etc.
 * 
 * SECURITY: Uses DOMPurify instead of regex to handle malformed HTML,
 * unclosed tags, and encoding tricks that regex patterns miss.
 */
export function sanitizeTextInput(input: string, maxLength = 5000): string {
    if (!input || typeof input !== 'string') return '';

    // Strip ALL HTML using DOMPurify (no tags or attributes allowed)
    const stripped = DOMPurify.sanitize(input, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
    });

    // Collapse excessive whitespace (but keep single newlines)
    const collapsed = stripped.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n');

    // Limit length
    return collapsed.trim().slice(0, maxLength);
}

/**
 * Sanitize a project/game name — alphanumeric, spaces, basic punctuation only.
 * Use on library item names, project names, etc.
 */
export function sanitizeProjectName(name: string, maxLength = 100): string {
    if (!name || typeof name !== 'string') return '';

    // Allow letters (incl. Dutch chars), numbers, spaces, hyphens, apostrophes
    const cleaned = name.replace(/[^a-zA-ZÀ-ÿ0-9\s\-'!?.]/g, '');

    return cleaned.trim().slice(0, maxLength);
}

/**
 * Validate that a text input doesn't exceed the max length.
 * Returns { valid, message } for use in form validation.
 */
export function validateMessageLength(
    text: string,
    maxLength = 2000
): { valid: boolean; message?: string } {
    if (!text || text.trim().length === 0) {
        return { valid: false, message: 'Bericht mag niet leeg zijn.' };
    }
    if (text.length > maxLength) {
        return {
            valid: false,
            message: `Bericht is te lang (${text.length}/${maxLength} tekens).`
        };
    }
    return { valid: true };
}

/**
 * Encode HTML entities to prevent XSS when displaying user content.
 * Use when rendering user-generated content outside of React's auto-escaping.
 */
export function escapeForDisplay(text: string): string {
    if (!text || typeof text !== 'string') return '';

    const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
    };

    return text.replace(/[&<>"']/g, (char) => map[char] || char);
}

/**
 * Validate and sanitize a URL. Returns null if the URL is invalid or suspicious.
 * Blocks javascript: and data: URIs, only allows http/https.
 */
export function sanitizeUrl(url: string): string | null {
    if (!url || typeof url !== 'string') return null;

    const trimmed = url.trim();

    // Block dangerous protocols
    const lower = trimmed.toLowerCase();
    if (
        lower.startsWith('javascript:') ||
        lower.startsWith('data:') ||
        lower.startsWith('vbscript:') ||
        lower.startsWith('blob:')
    ) {
        return null;
    }

    // Add https:// if no protocol
    const withProtocol = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;

    try {
        const parsed = new URL(withProtocol);
        if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
            return null;
        }
        return parsed.href;
    } catch {
        return null;
    }
}
