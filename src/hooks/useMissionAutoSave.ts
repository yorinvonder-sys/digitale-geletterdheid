import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_PREFIX = 'dgskills_mission_';
const DEBOUNCE_MS = 1_000;

/**
 * Verhoog dit nummer zodra het opslagformaat van missie-state onverenigbaar
 * verandert. Opslag met een hogere of onbekende versie wordt gewist, zodat een
 * leerling verse state krijgt in plaats van een kapot scherm.
 *
 * Versie 0 is de ongewikkelde opslag van vóór deze versionering: daar stond de
 * state zélf in localStorage, zonder envelope. Die wordt gemigreerd, niet
 * gewist — anders verliest elke leerling die op het moment van uitrol midden in
 * een opdracht zit zijn volledige voortgang.
 */
const SCHEMA_VERSION = 1;

interface StoredPayload<T> {
    v: number;
    state: T;
}

/** Sync extraction from this app's configured Supabase session only. */
export const getCurrentUserId = (): string | null => {
    try {
        // Bewust de sleutel van hét ingestelde project, niet de eerste de beste
        // sb-*-auth-token: op een gedeelde schoolcomputer kan een token van een
        // ander Supabase-project in de browser staan, en dan sla je de voortgang
        // op onder de verkeerde leerling.
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

const serialize = <T,>(state: T): string =>
    JSON.stringify({ v: SCHEMA_VERSION, state } satisfies StoredPayload<T>);

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * Herkent het opslagformaat. Een envelope `{ v, state }` van de huidige versie
 * levert de state binnenin; alles wat geen envelope is, is ongewikkelde opslag
 * van vóór de versionering (versie 0) en wordt als state zelf gelezen. Een
 * envelope met een ándere versie is onbruikbaar en levert `null`.
 */
function unwrapPayload<T>(payload: unknown): { state: T } | null {
    const isEnvelope =
        isPlainObject(payload) && typeof payload.v === 'number' && 'state' in payload;

    if (isEnvelope) {
        return (payload as { v: number }).v === SCHEMA_VERSION
            ? { state: (payload as unknown as StoredPayload<T>).state }
            : null;
    }

    // Versie 0: de state stond ongewikkeld in localStorage.
    return { state: payload as T };
}

/**
 * Leest opgeslagen state en geeft die alleen terug als hij veilig te gebruiken
 * is. Bij corrupte JSON, een onbekende schemaversie of een gefaalde validatie
 * wordt de opslag gewist en de initiële state teruggegeven. Opslag in het oude,
 * ongewikkelde formaat wordt gemigreerd en teruggeschreven als versie 1.
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

    const unwrapped = unwrapPayload<T>(payload);
    if (!unwrapped) return discard();

    const stored = unwrapped.state;
    // Merge over de initiële state, zodat een veld dat in oude opslag ontbreekt
    // geen undefined oplevert in de engine.
    const merged =
        isPlainObject(stored) && isPlainObject(initialState)
            ? ({ ...initialState, ...stored } as T)
            : (stored as T);

    if (merged === undefined || merged === null) return discard();
    if (validate && !validate(merged)) return discard();

    // Migratie van versie 0: de state is bruikbaar gebleken, dus schrijf hem
    // meteen terug in het huidige formaat. Lukt dat niet, dan blijft de oude
    // opslag staan en wordt hij bij het volgende bezoek opnieuw gemigreerd.
    const wasWrapped =
        isPlainObject(payload) && typeof payload.v === 'number' && 'state' in payload;
    if (!wasWrapped) {
        try {
            localStorage.setItem(storageKey, serialize(merged));
        } catch {
            // Best effort
        }
    }

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
 * 1. opslag zonder envelope is versie 0 en wordt gemigreerd naar het huidige
 *    formaat; een envelope met een ándere versie wordt gewist;
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

    const [state, setStateInternal] = useState<T>(restored.current.state);
    const [hasSavedProgress] = useState<boolean>(restored.current.found);

    // Na clearSave() mag niets de zojuist gewiste opslag terugschrijven — niet de
    // lopende debounce, niet beforeunload en niet de unmount-flush. Zonder deze
    // vlag herstelde de cleanup direct na afronding de voltooide of vergrendelde
    // opslag, waardoor een volgend bezoek in die oude toestand begon.
    const writesSuppressed = useRef(false);
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Een expliciete state-wijziging heft de blokkade weer op: wie na wissen
    // opnieuw begint (zoals het herstelscherm doet) moet gewoon weer opslaan.
    const setState = useCallback<React.Dispatch<React.SetStateAction<T>>>((value) => {
        writesSuppressed.current = false;
        setStateInternal(value);
    }, []);

    // Keep a ref to the latest state for the beforeunload handler
    const stateRef = useRef<T>(state);
    stateRef.current = state;

    // Debounced save to localStorage
    useEffect(() => {
        if (writesSuppressed.current) return;

        const timer = setTimeout(() => {
            if (writesSuppressed.current) return;
            try {
                localStorage.setItem(storageKey, serialize(state));
            } catch {
                // localStorage full or unavailable — silent fail
            }
        }, DEBOUNCE_MS);
        debounceTimer.current = timer;

        return () => {
            clearTimeout(timer);
            if (debounceTimer.current === timer) debounceTimer.current = null;
        };
    }, [state, storageKey]);

    // beforeunload: flush immediately (no debounce) as a safety net
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (writesSuppressed.current) return;
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
            if (writesSuppressed.current) return;
            try {
                localStorage.setItem(storageKey, serialize(stateRef.current));
            } catch {
                // Best effort
            }
        };
    }, [storageKey]);

    const clearSave = useCallback(() => {
        writesSuppressed.current = true;
        if (debounceTimer.current !== null) {
            clearTimeout(debounceTimer.current);
            debounceTimer.current = null;
        }
        try {
            localStorage.removeItem(storageKey);
        } catch {
            // Silent fail
        }
    }, [storageKey]);

    return { state, setState, hasSavedProgress, clearSave };
}
