import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface AccessibilitySettings {
    dyslexiaMode: boolean;
    reducedMotion: boolean;
    highContrast: boolean;
    fontSize: 'normal' | 'large' | 'extra-large';
}

interface AccessibilityContextType {
    settings: AccessibilitySettings;
    toggleDyslexiaMode: () => void;
    toggleReducedMotion: () => void;
    toggleHighContrast: () => void;
    setFontSize: (size: AccessibilitySettings['fontSize']) => void;
}

const STORAGE_KEY = 'dgskills-accessibility';

const defaultSettings: AccessibilitySettings = {
    dyslexiaMode: false,
    reducedMotion: false,
    highContrast: false,
    fontSize: 'normal',
};

function loadSettings(): AccessibilitySettings {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return { ...defaultSettings, ...JSON.parse(stored) };
    } catch {
        // ignore parse errors
    }
    // Respect OS prefers-reduced-motion on first load
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return { ...defaultSettings, reducedMotion: prefersReduced };
}

function applyToDocument(settings: AccessibilitySettings): void {
    const root = document.documentElement;
    root.classList.toggle('dyslexia-mode', settings.dyslexiaMode);
    root.classList.toggle('reduced-motion', settings.reducedMotion);
    root.classList.toggle('high-contrast', settings.highContrast);
    root.classList.toggle('font-large', settings.fontSize === 'large');
    root.classList.toggle('font-extra-large', settings.fontSize === 'extra-large');
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<AccessibilitySettings>(loadSettings);

    useEffect(() => {
        applyToDocument(settings);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        } catch {
            // ignore quota errors
        }
    }, [settings]);

    // Sync with OS reduced-motion changes
    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        const handler = (e: MediaQueryListEvent) => {
            setSettings(prev => ({ ...prev, reducedMotion: e.matches }));
        };
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    const toggleDyslexiaMode = useCallback(() =>
        setSettings(prev => ({ ...prev, dyslexiaMode: !prev.dyslexiaMode })), []);

    const toggleReducedMotion = useCallback(() =>
        setSettings(prev => ({ ...prev, reducedMotion: !prev.reducedMotion })), []);

    const toggleHighContrast = useCallback(() =>
        setSettings(prev => ({ ...prev, highContrast: !prev.highContrast })), []);

    const setFontSize = useCallback((size: AccessibilitySettings['fontSize']) =>
        setSettings(prev => ({ ...prev, fontSize: size })), []);

    return (
        <AccessibilityContext.Provider value={{
            settings,
            toggleDyslexiaMode,
            toggleReducedMotion,
            toggleHighContrast,
            setFontSize,
        }}>
            {children}
        </AccessibilityContext.Provider>
    );
}

export function useAccessibility(): AccessibilityContextType {
    const ctx = useContext(AccessibilityContext);
    if (!ctx) throw new Error('useAccessibility must be used within AccessibilityProvider');
    return ctx;
}
