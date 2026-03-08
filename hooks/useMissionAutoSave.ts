import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_PREFIX = 'dgskills_mission_';
const DEBOUNCE_MS = 1_000;

interface AutoSaveResult<T> {
    /** Current state value */
    state: T;
    /** Update the state (triggers debounced save to localStorage) */
    setState: React.Dispatch<React.SetStateAction<T>>;
    /** Whether a previous save was found and restored */
    hasSavedProgress: boolean;
    /** Clear saved progress from localStorage (call on mission completion) */
    clearSave: () => void;
}

/**
 * Hook die missie-state opslaat in localStorage en herstelt bij mount.
 * Voorkomt dat leerlingen voortgang verliezen bij per ongeluk sluiten
 * van de browser of teruggaan tijdens een missie.
 *
 * Features:
 * - Slaat state op in localStorage bij elke wijziging (debounced, 1 seconde)
 * - Herstelt state bij mount als er een eerdere sessie is
 * - Ruimt localStorage op bij mission completion via clearSave()
 * - beforeunload event listener als extra vangnet
 *
 * @example
 * const { state, setState, hasSavedProgress, clearSave } = useMissionAutoSave<MyState>(
 *     'prompt-master',
 *     { currentLevel: 0, score: 0 }
 * );
 *
 * // Bij voltooiing:
 * clearSave();
 * onComplete(true);
 */
export function useMissionAutoSave<T>(
    missionId: string,
    initialState: T
): AutoSaveResult<T> {
    const storageKey = `${STORAGE_PREFIX}${missionId}`;

    // Try to restore saved state on initial render
    const [state, setState] = useState<T>(() => {
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                return JSON.parse(saved) as T;
            }
        } catch {
            // Corrupt data — start fresh
            localStorage.removeItem(storageKey);
        }
        return initialState;
    });

    const [hasSavedProgress] = useState<boolean>(() => {
        try {
            return localStorage.getItem(storageKey) !== null;
        } catch {
            return false;
        }
    });

    // Keep a ref to the latest state for the beforeunload handler
    const stateRef = useRef<T>(state);
    stateRef.current = state;

    // Debounced save to localStorage
    useEffect(() => {
        const timer = setTimeout(() => {
            try {
                localStorage.setItem(storageKey, JSON.stringify(state));
            } catch {
                // localStorage full or unavailable — silent fail
            }
        }, DEBOUNCE_MS);

        return () => clearTimeout(timer);
    }, [state, storageKey]);

    // beforeunload: flush immediately (no debounce) as a safety net
    useEffect(() => {
        const handleBeforeUnload = () => {
            try {
                localStorage.setItem(storageKey, JSON.stringify(stateRef.current));
            } catch {
                // Best effort
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [storageKey]);

    const clearSave = useCallback(() => {
        try {
            localStorage.removeItem(storageKey);
        } catch {
            // Silent fail
        }
    }, [storageKey]);

    return { state, setState, hasSavedProgress, clearSave };
}
