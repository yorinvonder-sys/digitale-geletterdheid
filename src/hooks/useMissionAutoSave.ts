import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_PREFIX = 'dgskills_mission_';
const DEBOUNCE_MS = 1_000;

/** Sync extraction from this app's configured Supabase session only. */
const getCurrentUserId = (): string | null => {
    try {
        const supabaseUrl = ((import.meta as any).env.VITE_SUPABASE_URL as string)?.trim();
        if (!supabaseUrl) return null;
        const projectId = new URL(supabaseUrl).hostname.split('.')[0];
        const key = `sb-${projectId}-auth-token`;
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return parsed?.user?.id ?? parsed?.currentSession?.user?.id ?? null;
    } catch {
        return null;
    }
};

interface AutoSaveResult<T> {
    /** Current state value */
    state: T;
    /** Update the state (triggers a debounced browser save) */
    setState: React.Dispatch<React.SetStateAction<T>>;
    /** Whether a previous save was found and restored */
    hasSavedProgress: boolean;
    /** Clear saved progress from browser storage (call on mission completion) */
    clearSave: () => void;
}

/**
 * Hook die missie-state opslaat en herstelt bij mount.
 * Voorkomt dat leerlingen voortgang verliezen bij per ongeluk sluiten
 * van de browser of teruggaan tijdens een missie.
 *
 * Features:
 * - Slaat state op bij elke wijziging (debounced, 1 seconde)
 * - Herstelt state bij mount als er een eerdere sessie is
 * - Ruimt de save op bij mission completion via clearSave()
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
    // Authenticated state is user-scoped and durable. Anonymous dev-preview
    // state stays tab-scoped so it cannot leak into another user's session.
    const userId = useRef(getCurrentUserId()).current;
    const storage = userId ? localStorage : sessionStorage;
    const storageKey = userId
        ? `${STORAGE_PREFIX}${userId}_${missionId}`
        : `${STORAGE_PREFIX}anonymous-preview_${missionId}`;

    // Try to restore saved state on initial render
    const [state, setState] = useState<T>(() => {
        try {
            const saved = storage.getItem(storageKey);
            if (saved) {
                return JSON.parse(saved) as T;
            }
        } catch {
            // Corrupt data — start fresh
            storage.removeItem(storageKey);
        }
        return initialState;
    });

    const [hasSavedProgress] = useState<boolean>(() => {
        try {
            return storage.getItem(storageKey) !== null;
        } catch {
            return false;
        }
    });

    // Keep a ref to the latest state for the beforeunload handler
    const stateRef = useRef<T>(state);
    const clearedRef = useRef(false);
    stateRef.current = state;

    useEffect(() => {
        clearedRef.current = false;
    }, [storageKey]);

    // Debounced save to the selected browser storage
    useEffect(() => {
        const timer = setTimeout(() => {
            if (clearedRef.current) return;
            try {
                storage.setItem(storageKey, JSON.stringify(state));
            } catch {
                // Browser storage full or unavailable — silent fail
            }
        }, DEBOUNCE_MS);

        return () => clearTimeout(timer);
    }, [state, storage, storageKey]);

    // beforeunload: flush immediately (no debounce) as a safety net
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (clearedRef.current) return;
            try {
                storage.setItem(storageKey, JSON.stringify(stateRef.current));
            } catch {
                // Best effort
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [storage, storageKey]);

    // Flush on unmount so pending changes aren't lost when leaving a mission
    useEffect(() => {
        return () => {
            if (clearedRef.current) return;
            try {
                storage.setItem(storageKey, JSON.stringify(stateRef.current));
            } catch {
                // Best effort
            }
        };
    }, [storage, storageKey]);

    const clearSave = useCallback(() => {
        clearedRef.current = true;
        try {
            storage.removeItem(storageKey);
        } catch {
            // Silent fail
        }
    }, [storage, storageKey]);

    return { state, setState, hasSavedProgress, clearSave };
}
