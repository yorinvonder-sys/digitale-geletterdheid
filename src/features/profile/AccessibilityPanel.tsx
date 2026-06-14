import React, { useState, useRef, useEffect } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import type { AccessibilitySettings } from '@/contexts/AccessibilityContext';

const FONT_SIZE_LABELS: Record<AccessibilitySettings['fontSize'], string> = {
    normal: 'Normaal',
    large: 'Groot',
    'extra-large': 'Extra groot',
};

const FONT_SIZE_OPTIONS: AccessibilitySettings['fontSize'][] = ['normal', 'large', 'extra-large'];

function Toggle({
    id,
    label,
    checked,
    onToggle,
}: {
    id: string;
    label: string;
    checked: boolean;
    onToggle: () => void;
}) {
    return (
        <div className="flex items-center justify-between gap-4 py-2">
            <label
                htmlFor={id}
                className="font-sans text-sm font-semibold text-duck-ink cursor-pointer select-none"
            >
                {label}
            </label>
            <button
                id={id}
                role="switch"
                aria-checked={checked}
                onClick={onToggle}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2 ${checked ? 'bg-duck-ink' : 'bg-duck-ink/15'}`}
            >
                <span className="sr-only">{label}</span>
                <span
                    aria-hidden="true"
                    className="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transform transition-transform duration-200 mt-0.5"
                    style={{ transform: `translateX(${checked ? '1.375rem' : '0.125rem'})` }}
                />
            </button>
        </div>
    );
}

export function AccessibilityPanel() {
    const { settings, toggleDyslexiaMode, toggleReducedMotion, toggleHighContrast, setFontSize } = useAccessibility();
    const [open, setOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Close on outside click
    useEffect(() => {
        if (!open) return;
        function handleClick(e: MouseEvent) {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [open]);

    // Close on Escape
    useEffect(() => {
        if (!open) return;
        function handleKey(e: KeyboardEvent) {
            if (e.key === 'Escape') {
                setOpen(false);
                buttonRef.current?.focus();
            }
        }
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [open]);

    const hasActiveSettings =
        settings.dyslexiaMode ||
        settings.reducedMotion ||
        settings.highContrast ||
        settings.fontSize !== 'normal';

    return (
        <div ref={panelRef} className="relative font-sans">
            {/* Trigger button */}
            <button
                ref={buttonRef}
                onClick={() => setOpen(prev => !prev)}
                aria-label="Toegankelijkheidsopties openen"
                aria-expanded={open}
                aria-haspopup="dialog"
                className={`relative flex items-center justify-center h-11 w-11 rounded-full text-duck-ink/70 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2 ${open ? 'bg-duck-ink/10' : 'bg-transparent hover:bg-duck-ink/5'}`}
                title="Toegankelijkheid"
            >
                {/* Universeel toegankelijkheidsicoontje (SVG) */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4l2 2" />
                    <circle cx="12" cy="6" r="1" fill="currentColor" stroke="none" />
                    <path d="M9 12h6M12 15v3M9.5 18l-1.5 1M14.5 18l1.5 1" />
                </svg>
                {/* Dot wanneer instellingen actief zijn */}
                {hasActiveSettings && (
                    <span
                        aria-hidden="true"
                        className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-duck-ink ring-2 ring-duck-acid"
                    />
                )}
            </button>

            {/* Panel */}
            {open && (
                <div
                    role="dialog"
                    aria-label="Toegankelijkheidsopties"
                    aria-modal="false"
                    className="absolute right-0 mt-2 w-64 rounded-[1.25rem] bg-white text-duck-ink shadow-duck-soft border border-duck-ink/10 z-50 p-4"
                    style={{ top: '100%' }}
                >
                    <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-duck-ink/60 mb-3">
                        Toegankelijkheid
                    </p>

                    <Toggle
                        id="a11y-dyslexia"
                        label="Dyslexie-modus"
                        checked={settings.dyslexiaMode}
                        onToggle={toggleDyslexiaMode}
                    />
                    <Toggle
                        id="a11y-motion"
                        label="Minder beweging"
                        checked={settings.reducedMotion}
                        onToggle={toggleReducedMotion}
                    />
                    <Toggle
                        id="a11y-contrast"
                        label="Hoog contrast"
                        checked={settings.highContrast}
                        onToggle={toggleHighContrast}
                    />

                    {/* Font size */}
                    <div className="mt-3 pt-3 border-t border-duck-ink/10">
                        <p className="text-xs font-bold text-duck-ink/65 mb-2">
                            Tekstgrootte
                        </p>
                        <div className="flex gap-2">
                            {FONT_SIZE_OPTIONS.map(size => (
                                <button
                                    key={size}
                                    onClick={() => setFontSize(size)}
                                    aria-pressed={settings.fontSize === size}
                                    className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-1 ${settings.fontSize === size ? 'bg-duck-ink border-duck-ink text-duck-acid' : 'bg-transparent border-duck-ink/15 text-duck-ink hover:border-duck-ink'}`}
                                >
                                    {FONT_SIZE_LABELS[size]}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
