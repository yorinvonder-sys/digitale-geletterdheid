import React, { createContext, useContext, useState, useEffect } from 'react';

export type Persona = 'teacher' | 'ict' | 'director';

const STORAGE_KEY = 'dgskills:persona';

const VALID_PERSONAS: Persona[] = ['teacher', 'ict', 'director'];

function sanitizePersona(raw: unknown): Persona {
    if (typeof raw === 'string' && (VALID_PERSONAS as string[]).includes(raw)) {
        return raw as Persona;
    }
    return 'director';
}

function readFromStorage(): Persona {
    try {
        return sanitizePersona(sessionStorage.getItem(STORAGE_KEY));
    } catch {
        // sessionStorage may be unavailable (private browsing, storage quota exceeded)
        return 'director';
    }
}

interface PersonaContextValue {
    persona: Persona;
    setPersona: (next: Persona, source?: string) => void;
}

const PersonaContext = createContext<PersonaContextValue | null>(null);

export const PersonaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [persona, setPersonaState] = useState<Persona>(readFromStorage);

    // Persist every change to sessionStorage
    useEffect(() => {
        try {
            sessionStorage.setItem(STORAGE_KEY, persona);
        } catch {
            // Non-fatal — storage may be blocked
        }
    }, [persona]);

    const setPersona = (next: Persona, source = 'unknown') => {
        const from = persona;
        if (from === next) return;
        setPersonaState(next);

        // Fire analytics — dynamic import so it never blocks interaction
        // Source: same pattern as trackLandingEvent in ScholenLanding.tsx lines 5-11
        void import('../../services/analyticsService')
            .then(({ trackEvent }) => trackEvent('persona_switch', { from, to: next, source }))
            .catch(() => {
                // Analytics should never block interaction.
            });
    };

    return (
        <PersonaContext.Provider value={{ persona, setPersona }}>
            {children}
        </PersonaContext.Provider>
    );
};

export function usePersona(): PersonaContextValue {
    const ctx = useContext(PersonaContext);
    if (!ctx) {
        throw new Error('usePersona must be used inside <PersonaProvider>');
    }
    return ctx;
}
