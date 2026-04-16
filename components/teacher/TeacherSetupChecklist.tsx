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

function readBoolean(key: string): boolean {
    if (typeof window === 'undefined') return false;
    try {
        return window.localStorage.getItem(key) === '1';
    } catch {
        return false;
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
    const [collapsed, setCollapsed] = useState<boolean>(() => readBoolean(collapseKey));
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
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
            {/* Header */}
            <div className="flex items-center justify-between gap-3 p-4 md:p-5 bg-gradient-to-r from-indigo-50 to-white border-b border-slate-100">
                <div className="flex items-center gap-3 min-w-0">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${allDone ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'}`}>
                        {allDone ? <Check size={20} /> : <Rocket size={20} />}
                    </div>
                    <div className="min-w-0">
                        <h2 className="text-sm md:text-base font-bold text-slate-900 truncate">
                            {allDone ? 'Je bent klaar voor je eerste les!' : 'Startchecklist voor docenten'}
                        </h2>
                        <p className="text-xs text-slate-500">
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
                        className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-100"
                        aria-label={collapsed ? 'Checklist uitklappen' : 'Checklist inklappen'}
                        aria-expanded={!collapsed}
                    >
                        {collapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                    </button>
                    {allDone && (
                        <button
                            type="button"
                            onClick={handleDismiss}
                            className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-100"
                            aria-label="Checklist verbergen"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-slate-100" aria-hidden="true">
                <div
                    className={`h-full transition-all duration-500 ${allDone ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                    style={{ width: `${progressPercent}%` }}
                />
            </div>

            {/* Items */}
            {!collapsed && (
                <ul className="divide-y divide-slate-100">
                    {CHECKLIST_ITEMS.map((item) => {
                        const isDone = completed.has(item.id);
                        return (
                            <li key={item.id} className="p-4 md:p-5 flex items-start gap-4 hover:bg-slate-50/50 transition-colors">
                                <button
                                    type="button"
                                    onClick={() => toggle(item.id)}
                                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                        isDone
                                            ? 'bg-emerald-500 border-emerald-500 text-white'
                                            : 'border-slate-300 hover:border-indigo-500 hover:bg-indigo-50'
                                    }`}
                                    aria-pressed={isDone}
                                    aria-label={isDone ? `${item.title} — afgerond, klik om ongedaan te maken` : `${item.title} — markeer als afgerond`}
                                >
                                    {isDone && <Check size={14} strokeWidth={3} />}
                                </button>
                                <div className="flex-1 min-w-0">
                                    <h3 className={`font-semibold text-sm mb-1 ${isDone ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                                        {item.title}
                                    </h3>
                                    <p className={`text-xs leading-relaxed mb-2 ${isDone ? 'text-slate-400' : 'text-slate-500'}`}>
                                        {item.description}
                                    </p>
                                    {!isDone && (item.actionHref || item.actionOnClick) && (
                                        item.actionHref ? (
                                            <a
                                                href={item.actionHref}
                                                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
                                            >
                                                {item.actionLabel} →
                                            </a>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={item.actionOnClick}
                                                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
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
            )}

            {/* Completion footer */}
            {allDone && !collapsed && (
                <div className="p-5 bg-emerald-50 border-t border-emerald-100 text-center">
                    <p className="text-sm text-emerald-900 font-medium mb-2">
                        Je hebt alle startstappen afgerond.
                    </p>
                    <p className="text-xs text-emerald-700 mb-3">
                        Tijd om je eerste les met digitale geletterdheid te geven. Veel plezier!
                    </p>
                    <button
                        type="button"
                        onClick={handleDismiss}
                        className="inline-flex items-center justify-center px-4 py-2 bg-emerald-600 text-white font-semibold text-xs rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                        Checklist sluiten
                    </button>
                </div>
            )}
        </div>
    );
};
