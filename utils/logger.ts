/**
 * Conditional logging utility
 * Only logs in development mode to keep production clean
 */

const isDev = (typeof import.meta !== 'undefined' && (import.meta as any).env?.DEV) || process.env.NODE_ENV === 'development';

export const logger = {
    log: (...args: unknown[]) => {
        if (isDev) console.log(...args);
    },
    warn: (...args: unknown[]) => {
        if (isDev) console.warn(...args);
    },
    error: (...args: unknown[]) => {
        // Always log errors, even in production
        console.error(...args);
    },
    debug: (...args: unknown[]) => {
        if (isDev) console.debug(...args);
    },
    info: (...args: unknown[]) => {
        if (isDev) console.info(...args);
    },
    group: (label: string) => {
        if (isDev) console.group(label);
    },
    groupEnd: () => {
        if (isDev) console.groupEnd();
    },
    table: (data: unknown) => {
        if (isDev) console.table(data);
    }
};

// For backwards compatibility with existing console.log calls
export const log = logger.log;
export const warn = logger.warn;
export const error = logger.error;
