import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_PREFIX = 'dgskills_mission_';
const DEBOUNCE_MS = 1_000;

/**
 * Verhoog dit nummer zodra het opslagformaat van missie-state onverenigbaar
 * verandert. Opslag met een andere versie wordt genegeerd en gewist, zodat een
 * leerling met oude opslag verse state krijgt in plaats van een kapot scherm.
 */
const SCHEMA_VERSION = 1;

interface StoredPayload<T> {
    v: number;
    state: T;
}

/** Best-effort sync extraction of current user ID from Supabase's localStorage session. */
const getCurrentUserId = (): string | null => {
    try {
        const key = Object.keys(localStorage).find(k => /^sb-[a-z0-9_-]+-auth-token$/i.test(k));
        if (!key) return null;
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return parsed?.user?.id ?? null;
    } catch {
        return null;
    }
};

const serialize = <T,>(state: T): string =>
    JSON.stringify({ v: SCHEMA_VERSION, state } satisfies StoredPayload<T>);

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * Leest opgeslagen state en geeft die alleen terug als hij veilig te gebruiken
 * is. Bij een versieverschil, corrupte JSON of een gefaalde validatie wordt de
 * opslag gewist en de initiële state teruggegeven.
 */
function restoreState<T>(
    storageKey: string,
    initialState: T,
    validate?: (state: T) => boolean
): { state: T; found: boolean } {
    const fresh = { state: initialState, found: false };
    let saved: string | null = null;

    try {
        saved = localStorage.getItem(storageKey);
    } catch {
        return fresh;
    }
    if (saved === null) return fresh;

    const discard = () => {
        try {
            localStorage.removeItem(storageKey);
        } catch {
            // Silent fail
        }
        return fresh;
    };

    let payload: unknown;
    try {
        payload = JSON.parse(saved);
    } catch {
        return discard();
    }

    if (!isPlainObject(payload) || payload.v !== SCHEMA_VERSION) return discard();

    const stored = (payload as unknown as StoredPayload<T>).state;
    // Merge over de initiële state, zodat een veld dat in oude opslag ontbreekt
    // geen undefined oplevert in de engine.
    const merged =
        isPlainObject(stored) && isPlainObject(initialState)
            ? ({ ...initialState, ...stored } as T)
            : (stored as T);

    if (merged === undefined || merged === null) return discard();
    if (validate && !validate(merged)) return discard();

    return { state: merged, found: true };
}

interface AutoSaveOptions<T> {
    /**
     * Toetst herstelde state tegen de HUIDIGE config. Geef hier bijvoorbeeld mee
     * of een opgeslagen ronde-id nog bestaat of een dataset-index nog binnen
     * bereik valt. Retourneer false en de opslag wordt gewist; de missie start
     * dan met verse initiële state in plaats van te crashen op een veld dat na
     * een configwijziging niet meer bestaat.
     */
    validate?: (state: T) => boolean;
}

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
 * Herstel gebeurt alleen als de opslag veilig is:
 * 1. schemaversie moet gelijk zijn aan SCHEMA_VERSION, anders wissen;
 * 2. corrupte JSON wordt gewist en genegeerd;
 * 3. objecten worden over de initiële state heen gemerged, zodat een veld dat
 *    in oude opslag ontbreekt `undefined` noch een crash oplevert;
 * 4. de optionele `validate`-callback toetst het resultaat tegen de huidige
 *    config; faalt die, dan wordt de opslag gewist en start de missie vers.
 * Aanroepers zonder `options` krijgen alleen de versiecheck en de merge.
 *
 * @example
 * const { state, setState, hasSavedProgress, clearSave } = useMissionAutoSave<MyState>(
 *     'prompt-master',
 *     { currentLevel: 0, score: 0 },
 *     { validate: (s) => s.currentLevel < config.levels.length }
 * );
 *
 * // Bij voltooiing:
 * clearSave();
 * onComplete(true);
 */
export function useMissionAutoSave<T>(
    missionId: string,
    initialState: T,
    options?: AutoSaveOptions<T>
): AutoSaveResult<T> {
    // Include userId in key to prevent cross-user data leakage on shared computers
    const userId = useRef(getCurrentUserId()).current;
    const storageKey = userId
        ? `${STORAGE_PREFIX}${userId}_${missionId}`
        : `${STORAGE_PREFIX}${missionId}`;

    // Try to restore saved state on initial render. Runs once; validate wordt
    // daarom alleen bij mount gelezen en hoeft geen stabiele identiteit te hebben.
    const validate = useRef(options?.validate).current;
    const restored = useRef<{ state: T; found: boolean } | null>(null);
    if (!restored.current) {
        restored.current = restoreState(storageKey, initialState, validate);
    }

    const [state, setState] = useState<T>(restored.current.state);
    const [hasSavedProgress] = useState<boolean>(restored.current.found);

    // Keep a ref to the latest state for the beforeunload handler
    const stateRef = useRef<T>(state);
    stateRef.current = state;

    // Debounced save to localStorage
    useEffect(() => {
        const timer = setTimeout(() => {
            try {
                localStorage.setItem(storageKey, serialize(state));
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
                localStorage.setItem(storageKey, serialize(stateRef.current));
            } catch {
                // Best effort
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [storageKey]);

    // Flush on unmount so pending changes aren't lost when leaving a mission
    useEffect(() => {
        return () => {
            try {
                localStorage.setItem(storageKey, serialize(stateRef.current));
            } catch {
                // Best effort
            }
        };
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
