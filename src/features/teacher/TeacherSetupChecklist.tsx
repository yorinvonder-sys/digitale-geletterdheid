/**
 * TeacherSetupChecklist — Functional first-login checklist for pilot teachers.
 *
 * Complementary to TeacherOnboarding (slideshow) and TutorialSpotlight (in-app tour).
 * This component shows concrete action items a new pilot teacher should complete to
 * be ready for their first lesson.
 *
 * Progress is stored in localStorage (MVP). Can later be moved server-side per teacher.
 * The checklist auto-hides once all items are complete.
 */
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Check, ChevronDown, ChevronUp, Rocket, X } from 'lucide-react';

export interface TeacherSetupChecklistProps {
    /** Called when the user dismisses the checklist permanently. */
    onDismiss?: () => void;
    /** Optional key suffix to scope storage per teacher (e.g. user id). */
    storageKeySuffix?: string;
}

interface ChecklistItem {
    id: string;
    title: string;
    description: string;
    actionLabel: string;
    actionHref?: string;
    actionOnClick?: () => void;
}

const STORAGE_KEY_BASE = 'dgskills_teacher_setup_v1';
const COLLAPSE_KEY_BASE = 'dgskills_teacher_setup_collapsed_v1';
const DISMISSED_KEY_BASE = 'dgskills_teacher_setup_dismissed_v1';

/** Whitelist of item IDs persisted in localStorage to prevent drift. */
const ALLOWED_ITEM_IDS = new Set([
    'choose-year',
    'create-class',
    'start-first-mission',
    'share-compliance',
    'invite-parents',
    'explore-slo-rapport',
]);

function readCompleted(key: string): Set<string> {
    if (typeof window === 'undefined') return new Set();
    try {
        const raw = window.localStorage.getItem(key);
        if (!raw) return new Set();
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return new Set();
        return new Set(parsed.filter((id): id is string => typeof id === 'string' && ALLOWED_ITEM_IDS.has(id)));
    } catch {
        return new Set();
    }
}

function writeCompleted(key: string, completed: Set<string>): void {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(key, JSON.stringify(Array.from(completed)));
    } catch {
        // Silent: localStorage may be unavailable (private mode, quota).
    }
}

function readBoolean(key: string, fallback = false): boolean {
    if (typeof window === 'undefined') return false;
    try {
        const raw = window.localStorage.getItem(key);
        if (raw == null) return fallback;
        return raw === '1';
    } catch {
        return fallback;
    }
}

function writeBoolean(key: string, value: boolean): void {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(key, value ? '1' : '0');
    } catch {
        // Silent
    }
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
    {
        id: 'choose-year',
        title: 'Kies jouw leerjaar',
        description: 'Selecteer in de filterbalk welk leerjaar je lesgeeft. DGSkills toont dan de juiste missies en SLO-doelen.',
        actionLabel: 'Naar filter',
        actionOnClick: () => {
            document.querySelector('[data-tutorial="year-filter"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        },
    },
    {
        id: 'create-class',
        title: 'Voeg je klas toe (of importeer via SSO)',
        description: 'Klas aanmaken via het leerlingenoverzicht of automatisch via Microsoft/Google SSO. Tijdens onboarding helpen we je hiermee.',
        actionLabel: 'Naar leerlingen',
        actionOnClick: () => {
            document.querySelector('[data-tutorial="students-tab"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        },
    },
    {
        id: 'start-first-mission',
        title: 'Plan je eerste missie',
        description: 'Gebruik Focus-modus om de hele klas naar dezelfde opdracht te sturen. Tip: "Cookie Crusher" is een populaire opener.',
        actionLabel: 'Bekijk missies',
        actionOnClick: () => {
            document.querySelector('[data-tutorial="focus-toggle"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        },
    },
    {
        id: 'explore-slo-rapport',
        title: 'Verken het SLO-rapport',
        description: 'Zie hoe de SLO-dekking per klas wordt opgebouwd. Handig voor de inspectie-verantwoording.',
        actionLabel: 'Naar SLO-tab',
        actionOnClick: () => {
            document.querySelector('[data-tutorial="slo-tab"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        },
    },
    {
        id: 'share-compliance',
        title: 'Deel de Compliance Hub met je FG of ICT-coordinator',
        description: 'Alle 21 privacy- en AI Act-documenten staan klaar. Deel de link zodat het schoolbestuur kan meelezen.',
        actionLabel: 'Open Compliance Hub',
        actionHref: '/compliance-hub',
    },
    {
        id: 'invite-parents',
        title: 'Controleer ouderlijke toestemming (<16 jaar)',
        description: 'Voor leerlingen jonger dan 16 is ouderlijke toestemming verplicht (Art. 8 AVG). Wij sturen de mails automatisch — check of ze aankomen.',
        actionLabel: 'Meer info',
        actionHref: '/ict/privacy',
    },
];

export const TeacherSetupChecklist: React.FC<TeacherSetupChecklistProps> = ({ onDismiss, storageKeySuffix }) => {
    const suffix = storageKeySuffix ? `:${storageKeySuffix}` : '';
    const storageKey = `${STORAGE_KEY_BASE}${suffix}`;
    const collapseKey = `${COLLAPSE_KEY_BASE}${suffix}`;
    const dismissedKey = `${DISMISSED_KEY_BASE}${suffix}`;

    const [completed, setCompleted] = useState<Set<string>>(() => readCompleted(storageKey));
    const [collapsed, setCollapsed] = useState<boolean>(() => readBoolean(collapseKey, true));
    const [dismissed, setDismissed] = useState<boolean>(() => readBoolean(dismissedKey));

    useEffect(() => {
        writeCompleted(storageKey, completed);
    }, [completed, storageKey]);

    useEffect(() => {
        writeBoolean(collapseKey, collapsed);
    }, [collapsed, collapseKey]);

    useEffect(() => {
        writeBoolean(dismissedKey, dismissed);
    }, [dismissed, dismissedKey]);

    const totalItems = CHECKLIST_ITEMS.length;
    const completedCount = completed.size;
    const allDone = completedCount === totalItems;
    const progressPercent = useMemo(() => Math.round((completedCount / totalItems) * 100), [completedCount, totalItems]);
    const visibleItems = useMemo(() => {
        const remaining = CHECKLIST_ITEMS.filter((item) => !completed.has(item.id));
        return (remaining.length > 0 ? remaining : CHECKLIST_ITEMS).slice(0, collapsed ? 2 : CHECKLIST_ITEMS.length);
    }, [collapsed, completed]);

    const toggle = useCallback((id: string) => {
        if (!ALLOWED_ITEM_IDS.has(id)) return;
        setCompleted((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }, []);

    const handleDismiss = useCallback(() => {
        setDismissed(true);
        onDismiss?.();
    }, [onDismiss]);

    if (dismissed) return null;

    return (
        <div className="overflow-hidden rounded-xl border border-duck-ink/15 bg-duck-bgLight shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between gap-3 px-4 py-3 md:px-5">
                <div className="flex items-center gap-3 min-w-0">
                    <div className={`flex size-9 flex-shrink-0 items-center justify-center rounded-lg ${allDone ? 'bg-duck-ink/15 text-duck-ink' : 'bg-duck-acid/15 text-duck-ink'}`}>
                        {allDone ? <Check size={20} /> : <Rocket size={20} />}
                    </div>
                    <div className="min-w-0">
                        <h2 className="truncate text-sm font-black text-duck-ink md:text-base">
                            {allDone ? 'Je bent klaar voor je eerste les!' : 'Startchecklist voor docenten'}
                        </h2>
                        <p className="text-xs font-medium text-duck-ink/60">
                            {allDone
                                ? 'Top. Sluit deze checklist en ga aan de slag.'
                                : `${completedCount} van ${totalItems} stappen afgerond — nog ${totalItems - completedCount} te gaan.`}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                        type="button"
                        onClick={() => setCollapsed((v) => !v)}
                        className="rounded-lg p-2 text-duck-ink/60 transition-colors hover:bg-duck-bg hover:text-duck-ink"
                        aria-label={collapsed ? 'Checklist uitklappen' : 'Checklist inklappen'}
                        aria-expanded={!collapsed}
                    >
                        {collapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                    </button>
                    {allDone && (
                        <button
                            type="button"
                            onClick={handleDismiss}
                            className="rounded-lg p-2 text-duck-ink/60 transition-colors hover:bg-duck-bg hover:text-duck-ink"
                            aria-label="Checklist verbergen"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-duck-bg" aria-hidden="true">
                <div
                    className={`h-full transition-all duration-500 ${allDone ? 'bg-duck-ink' : 'bg-duck-acid'}`}
                    style={{ width: `${progressPercent}%` }}
                />
            </div>

            {/* Items */}
            <div className={collapsed ? 'border-t border-duck-ink/15 bg-duck-bg/35 px-4 py-3 md:px-5' : ''}>
                {collapsed && !allDone && (
                    <p className="mb-2 text-[11px] font-black uppercase text-duck-ink/60">Volgende stappen</p>
                )}
                <ul className={collapsed ? 'grid gap-2 md:grid-cols-2' : 'divide-y divide-duck-ink/15'}>
                    {visibleItems.map((item) => {
                        const isDone = completed.has(item.id);
                        return (
                            <li key={item.id} className={`${collapsed ? 'flex items-start gap-3 rounded-lg border border-duck-ink/15 bg-duck-bgLight p-3' : 'flex items-start gap-4 p-3 md:p-4'} transition-colors hover:bg-duck-bg/45`}>
                                <button
                                    type="button"
                                    onClick={() => toggle(item.id)}
                                    className={`flex size-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                                        isDone
                                            ? 'border-duck-ink bg-duck-ink text-white'
                                            : 'border-duck-ink/15 hover:border-duck-error hover:bg-duck-error/10'
                                    }`}
                                    aria-pressed={isDone}
                                    aria-label={isDone ? `${item.title} — afgerond, klik om ongedaan te maken` : `${item.title} — markeer als afgerond`}
                                >
                                    {isDone && <Check size={14} strokeWidth={3} />}
                                </button>
                                <div className="min-w-0 flex-1">
                                    <h3 className={`mb-1 text-sm font-black ${isDone ? 'text-duck-ink/60 line-through' : 'text-duck-ink'}`}>
                                        {item.title}
                                    </h3>
                                    <p className={`mb-2 text-xs leading-relaxed ${collapsed ? 'line-clamp-1' : ''} ${isDone ? 'text-duck-ink/60' : 'text-duck-ink/60'}`}>
                                        {item.description}
                                    </p>
                                    {!isDone && (item.actionHref || item.actionOnClick) && (
                                        item.actionHref ? (
                                            <a
                                                href={item.actionHref}
                                                className="inline-flex items-center gap-1 text-xs font-black text-duck-error hover:underline"
                                            >
                                                {item.actionLabel} →
                                            </a>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={item.actionOnClick}
                                                className="inline-flex items-center gap-1 text-xs font-black text-duck-error hover:underline"
                                            >
                                                {item.actionLabel} →
                                            </button>
                                        )
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* Completion footer */}
            {allDone && !collapsed && (
                <div className="border-t border-duck-ink/15 bg-duck-ink/10 p-5 text-center">
                    <p className="mb-2 text-sm font-bold text-duck-ink">
                        Je hebt alle startstappen afgerond.
                    </p>
                    <p className="mb-3 text-xs text-duck-ink/60">
                        Tijd om je eerste les met digitale geletterdheid te geven. Veel plezier!
                    </p>
                    <button
                        type="button"
                        onClick={handleDismiss}
                        className="inline-flex min-h-11 items-center justify-center rounded-lg bg-duck-ink px-4 py-2 text-xs font-black text-white transition-colors hover:bg-duck-ink hover:text-white"
                    >
                        Checklist sluiten
                    </button>
                </div>
            )}
        </div>
    );
};
