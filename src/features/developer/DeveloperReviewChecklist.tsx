import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    AlertCircle,
    ClipboardCheck,
    Loader2,
    Search,
} from 'lucide-react';
import { ParentUser } from '@/types';
import {
    getDeveloperSettings,
    updateDeveloperSettings,
    type DeveloperSettings,
} from '@/services/developerService';

interface DeveloperReviewChecklistProps {
    user: ParentUser;
}

interface ReviewGroup {
    id: string;
    label: string;
    assignments: string[];
}

const REVIEW_GROUPS: ReviewGroup[] = [
    { id: 'j1-p1', label: 'J1 P1', assignments: ['magister-master', 'cloud-commander', 'word-wizard', 'slide-specialist', 'print-pro', 'cloud-cleaner', 'layout-doctor', 'pitch-police'] },
    { id: 'j1-p2', label: 'J1 P2', assignments: ['prompt-master', 'game-programmeur', 'ai-trainer', 'chatbot-trainer', 'verhalen-ontwerper', 'game-director', 'ai-tekengame', 'ai-beleid-brainstorm', 'code-denker', 'website-bouwer', 'schermtijd-coach', 'notificatie-ninja', 'review-week-2'] },
    { id: 'j1-p3', label: 'J1 P3', assignments: ['data-detective', 'data-verzamelaar', 'deepfake-detector', 'ai-spiegel', 'social-safeguard', 'scroll-stopper', 'cookie-crusher', 'mail-detective', 'data-handelaar', 'filter-bubble-breaker', 'datalekken-rampenplan', 'data-voor-data', 'data-speurder', 'digitale-balans-coach'] },
    { id: 'j1-p4', label: 'J1 P4', assignments: ['mission-blueprint', 'mission-vision', 'mission-launch', 'review-week-3'] },
    { id: 'j2-p1', label: 'J2 P1', assignments: ['data-journalist', 'spreadsheet-specialist', 'factchecker', 'api-verkenner', 'dashboard-designer', 'ai-bias-detective', 'data-review'] },
    { id: 'j2-p2', label: 'J2 P2', assignments: ['algorithm-architect', 'web-developer', 'app-prototyper', 'bug-hunter', 'automation-engineer', 'code-reviewer', 'wachtwoord-warrior', 'access-control-engineer', 'code-review-2'] },
    { id: 'j2-p3', label: 'J2 P3', assignments: ['ux-detective', 'podcast-producer', 'meme-machine', 'digital-storyteller', 'brand-builder', 'video-editor', 'online-helden', 'media-review'] },
    { id: 'j2-p4', label: 'J2 P4', assignments: ['ai-ethicus', 'digital-rights-defender', 'tech-court', 'future-forecaster', 'sustainability-scanner', 'eindproject-j2'] },
    { id: 'j3-p1', label: 'J3 P1', assignments: ['ml-trainer', 'api-architect', 'neural-navigator', 'data-pipeline', 'open-source-contributor', 'advanced-code-review'] },
    { id: 'j3-p2', label: 'J3 P2', assignments: ['cyber-detective', 'encryption-expert', 'phishing-fighter', 'security-auditor', 'digital-forensics', 'security-review'] },
    { id: 'j3-p3', label: 'J3 P3', assignments: ['startup-simulator', 'policy-maker', 'innovation-lab', 'digital-divide-researcher', 'tech-impact-analyst', 'welzijnsonderzoeker', 'startup-pitch', 'impact-review'] },
    { id: 'j3-p4', label: 'J3 P4', assignments: ['portfolio-builder', 'research-project', 'prototype-developer', 'pitch-perfect', 'reflection-report', 'meesterproef'] },
];

const TOTAL_ASSIGNMENTS = REVIEW_GROUPS.reduce((sum, group) => sum + group.assignments.length, 0);
const ASSIGNMENT_KEYS = REVIEW_GROUPS.flatMap(group =>
    group.assignments.map(assignment => getAssignmentKey(group.id, assignment))
);

function getAssignmentKey(groupId: string, assignment: string): string {
    return `${groupId}:${assignment}`;
}

function formatAssignmentName(slug: string): string {
    return slug
        .split('-')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

export function DeveloperReviewChecklist({ user }: DeveloperReviewChecklistProps) {
    const [settings, setSettings] = useState<DeveloperSettings>({});
    const [checked, setChecked] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(true);
    const [savingKey, setSavingKey] = useState<string | null>(null);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
    const [query, setQuery] = useState('');
    const settingsRef = useRef<DeveloperSettings>({});

    useEffect(() => {
        let mounted = true;

        getDeveloperSettings(user.uid)
            .then((fetched) => {
                if (!mounted) return;
                settingsRef.current = fetched;
                setSettings(fetched);
                setChecked(fetched.assignmentReviewChecklist || {});
            })
            .catch((err) => {
                console.error('[DeveloperReviewChecklist] load settings:', err);
                if (mounted) setSaveError('Checklist laden mislukt.');
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, [user.uid]);

    const filteredGroups = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        if (!normalizedQuery) return REVIEW_GROUPS;

        return REVIEW_GROUPS
            .map(group => ({
                ...group,
                assignments: group.assignments.filter(assignment =>
                    group.label.toLowerCase().includes(normalizedQuery)
                    || assignment.toLowerCase().includes(normalizedQuery)
                    || formatAssignmentName(assignment).toLowerCase().includes(normalizedQuery)
                ),
            }))
            .filter(group => group.assignments.length > 0);
    }, [query]);

    const reviewedCount = ASSIGNMENT_KEYS.filter(key => checked[key]).length;
    const reviewPercent = TOTAL_ASSIGNMENTS > 0 ? Math.round((reviewedCount / TOTAL_ASSIGNMENTS) * 100) : 0;

    const toggleAssignment = async (key: string) => {
        if (savingKey) return;

        let nextChecked: Record<string, boolean> | null = null;

        setChecked((currentChecked) => {
            nextChecked = {
                ...currentChecked,
                [key]: !currentChecked[key],
            };
            return nextChecked;
        });

        if (!nextChecked) return;

        setSavingKey(key);
        setSaveError(null);

        try {
            const nextSettings = {
                ...settingsRef.current,
                assignmentReviewChecklist: nextChecked,
            };
            await updateDeveloperSettings(user.uid, nextSettings);
            settingsRef.current = nextSettings;
            setSettings(nextSettings);
            setLastSavedAt(new Date().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }));
        } catch (err) {
            console.error('[DeveloperReviewChecklist] save checklist:', err);
            setSaveError('Afgevinkt op dit scherm, maar opslaan mislukt. Probeer opnieuw voor je vernieuwt.');
        } finally {
            setSavingKey(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <div className="w-8 h-8 border-2 border-duck-ink border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <section className="bg-white border border-duck-ink/15 rounded-3xl p-6 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-duck-ink text-white flex items-center justify-center shrink-0">
                            <ClipboardCheck size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-duck-ink/60 uppercase tracking-widest mb-1">Assignment review</p>
                            <h3 className="text-2xl font-black text-duck-ink tracking-tight">Review checklist</h3>
                            <p className="text-sm text-duck-ink/60 mt-1">
                                {reviewedCount} van {TOTAL_ASSIGNMENTS} assignments afgevinkt.
                            </p>
                        </div>
                    </div>

                    <div className="w-full lg:w-72">
                        <div className="flex items-center justify-between text-[10px] font-black text-duck-ink/60 uppercase tracking-widest mb-2">
                            <span>Voortgang</span>
                            <span>{reviewPercent}%</span>
                        </div>
                        <div className="h-2 bg-duck-bg rounded-full overflow-hidden">
                            <div
                                className="h-full bg-duck-acid transition-all duration-500"
                                style={{ width: `${reviewPercent}%` }}
                            />
                        </div>
                        <p className="text-[10px] text-duck-ink/60 mt-2">
                            {savingKey ? 'Opslaan...' : lastSavedAt ? `Laatst opgeslagen om ${lastSavedAt}` : 'Wordt opgeslagen per vinkje'}
                        </p>
                    </div>
                </div>

                {saveError && (
                    <div className="mt-5 flex items-center gap-2 rounded-xl border border-duck-error bg-duck-error/10 px-4 py-3 text-sm font-bold text-duck-error">
                        <AlertCircle size={16} />
                        {saveError}
                    </div>
                )}
            </section>

            <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-duck-ink/60" />
                <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Zoek assignment of periode..."
                    className="w-full bg-white border border-duck-ink/15 rounded-2xl py-3 pl-11 pr-4 text-sm text-duck-ink placeholder:text-duck-ink/60 focus:outline-none focus:ring-2 focus:ring-duck-ink/15"
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                {filteredGroups.map((group) => {
                    const groupTotal = group.assignments.length;
                    const groupReviewed = group.assignments.filter(assignment => checked[getAssignmentKey(group.id, assignment)]).length;

                    return (
                        <section key={group.id} className="bg-white border border-duck-ink/15 rounded-3xl p-5 shadow-sm">
                            <div className="flex items-center justify-between gap-4 mb-4">
                                <div>
                                    <h4 className="text-sm font-black text-duck-ink uppercase tracking-widest">{group.label}</h4>
                                    <p className="text-xs text-duck-ink/60 font-bold">{groupReviewed} van {groupTotal} reviewed</p>
                                </div>
                                <div className="text-xs font-black text-duck-ink bg-duck-acid/30 rounded-full px-3 py-1">
                                    {groupTotal > 0 ? Math.round((groupReviewed / groupTotal) * 100) : 0}%
                                </div>
                            </div>

                            <div className="space-y-2">
                                {group.assignments.map((assignment) => {
                                    const key = getAssignmentKey(group.id, assignment);
                                    const isChecked = !!checked[key];
                                    const isSaving = savingKey === key;
                                    const assignmentTextClass = isChecked
                                        ? 'text-duck-ink/60 line-through decoration-2 decoration-duck-ink/40'
                                        : 'text-duck-ink';
                                    const assignmentSlugClass = isChecked
                                        ? 'text-duck-ink/60 line-through decoration-2 decoration-duck-ink/40'
                                        : 'text-duck-ink/60';

                                    return (
                                        <label
                                            key={key}
                                            className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition-colors cursor-pointer ${
                                                isChecked
                                                    ? 'border-duck-ink/35 bg-duck-ink/10'
                                                    : 'border-duck-ink/15 bg-duck-bg hover:bg-duck-ink/10'
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                disabled={!!savingKey}
                                                onChange={() => toggleAssignment(key)}
                                                className="h-5 w-5 rounded border-duck-ink/15 accent-duck-ink cursor-pointer disabled:cursor-wait disabled:opacity-60"
                                            />
                                            <span className="flex-1 min-w-0">
                                                <span className={`block text-sm font-bold ${assignmentTextClass}`}>
                                                    {formatAssignmentName(assignment)}
                                                </span>
                                                <span className={`block sm:hidden text-[10px] font-black uppercase tracking-widest ${assignmentSlugClass}`}>
                                                    {assignment}
                                                </span>
                                            </span>
                                            <span className={`hidden sm:inline text-[10px] font-black uppercase tracking-widest ${assignmentSlugClass}`}>
                                                {assignment}
                                            </span>
                                            {isSaving && <Loader2 size={16} className="animate-spin text-duck-ink/60 shrink-0" />}
                                        </label>
                                    );
                                })}
                            </div>
                        </section>
                    );
                })}
            </div>

            {filteredGroups.length === 0 && (
                <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-duck-ink/15">
                    <p className="text-sm font-bold text-duck-ink/60">Geen assignments gevonden.</p>
                </div>
            )}
        </div>
    );
}
