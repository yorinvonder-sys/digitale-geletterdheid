/**
 * Lazy Load with Retry
 * 
 * Wrapper for React.lazy() that automatically retries failed chunk loads.
 * This handles cases where a deploy happens while a user has the app open,
 * causing old cached HTML to reference JS files that no longer exist.
 */

import React, { ComponentType, LazyExoticComponent } from 'react';

type ComponentFactory<T extends ComponentType<any>> = () => Promise<{ default: T }>;

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

/**
 * Creates a lazy-loaded component with automatic retry on failure.
 * 
 * @param factory - The import factory function (e.g., () => import('./MyComponent'))
 * @param retries - Number of retry attempts (default: 3)
 * @returns LazyExoticComponent with retry capability
 */
export function lazyWithRetry<T extends ComponentType<any>>(
    factory: ComponentFactory<T>,
    retries: number = MAX_RETRIES
): LazyExoticComponent<T> {
    return React.lazy(() => retryImport(factory, retries));
}

async function retryImport<T extends ComponentType<any>>(
    factory: ComponentFactory<T>,
    retriesLeft: number
): Promise<{ default: T }> {
    try {
        return await factory();
    } catch (error) {
        if (retriesLeft > 0) {
            console.warn(`Chunk load failed, retrying... (${retriesLeft} attempts left)`);

            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));

            // For MIME type errors, try clearing cache
            if (error instanceof Error &&
                (error.message.toLowerCase().includes('mime') ||
                    error.message.toLowerCase().includes('text/html'))) {
                console.warn('MIME type error detected, clearing caches...');
                try {
                    if ('caches' in window) {
                        const cacheNames = await caches.keys();
                        await Promise.all(cacheNames.map(name => caches.delete(name)));
                    }
                } catch (cacheError) {
                    console.warn('Could not clear caches:', cacheError);
                }
            }

            return retryImport(factory, retriesLeft - 1);
        }

        // All retries exhausted, throw the error
        throw error;
    }
}

export default lazyWithRetry;
