import React, { useRef, useCallback } from 'react';
import { usePersona, type Persona } from './PersonaContext';

// Inline palet — same hex values as C in ScholenLanding.tsx (no circular import)
const C = {
    bg: '#FCF6EA',
    text: '#08283B',
    textMuted: '#445865',
    accent: '#D97848',
    border: '#E7D8BD',
} as const;

const SANS = "'Outfit', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

interface Tab {
    value: Persona;
    label: string;
}

const TABS: Tab[] = [
    { value: 'teacher', label: 'Docent' },
    { value: 'ict', label: 'ICT-coördinator' },
    { value: 'director', label: 'Schoolleider' },
];

const prefersReducedMotion = (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const PersonaSwitcher: React.FC = () => {
    const { persona, setPersona } = usePersona();
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const handleSelect = useCallback((next: Persona) => {
        setPersona(next, 'hero_tab');

        // Smooth scroll to persona-bewijs section after state update
        requestAnimationFrame(() => {
            const target = document.getElementById('persona-bewijs');
            if (!target) return;
            if (prefersReducedMotion()) {
                target.scrollIntoView({ behavior: 'instant', block: 'start' });
            } else {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }, [setPersona]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
        const count = TABS.length;
        let nextIndex: number | null = null;

        if (e.key === 'ArrowRight') {
            nextIndex = (currentIndex + 1) % count;
        } else if (e.key === 'ArrowLeft') {
            nextIndex = (currentIndex - 1 + count) % count;
        } else if (e.key === 'Home') {
            nextIndex = 0;
        } else if (e.key === 'End') {
            nextIndex = count - 1;
        }

        if (nextIndex !== null) {
            e.preventDefault();
            const nextTab = TABS[nextIndex];
            handleSelect(nextTab.value);
            tabRefs.current[nextIndex]?.focus();
        }
    }, [handleSelect]);

    return (
        <div
            id="persona-switcher"
            role="tablist"
            aria-label="Kies jouw rol"
            style={{
                display: 'flex',
                flexWrap: 'nowrap',
                gap: '6px',
                overflowX: 'auto',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
                marginBottom: '20px',
                fontFamily: SANS,
            }}
            // Hide scrollbar on webkit
            className="[&::-webkit-scrollbar]:hidden"
        >
            {TABS.map((tab, index) => {
                const isActive = persona === tab.value;
                return (
                    <button
                        key={tab.value}
                        ref={el => { tabRefs.current[index] = el; }}
                        role="tab"
                        aria-selected={isActive}
                        aria-controls="persona-bewijs"
                        tabIndex={isActive ? 0 : -1}
                        onClick={() => handleSelect(tab.value)}
                        onKeyDown={e => handleKeyDown(e, index)}
                        style={{
                            whiteSpace: 'nowrap',
                            padding: '6px 14px',
                            borderRadius: '9999px',
                            fontSize: '13px',
                            fontWeight: 500,
                            lineHeight: 1.4,
                            cursor: 'pointer',
                            transition: 'background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease',
                            outline: 'none',
                            ...(isActive
                                ? {
                                    backgroundColor: C.accent,
                                    color: '#ffffff',
                                    border: `1px solid ${C.accent}`,
                                }
                                : {
                                    backgroundColor: C.bg,
                                    color: C.textMuted,
                                    border: `1px solid ${C.border}`,
                                }),
                        }}
                        // Keyboard focus ring via className — inline style cannot do :focus-visible
                        className="focus-visible:ring-2 focus-visible:ring-offset-2"
                    >
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
};
