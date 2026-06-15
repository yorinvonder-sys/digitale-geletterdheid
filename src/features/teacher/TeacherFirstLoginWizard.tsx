import React, { useState } from 'react';
import { Sparkles, ShieldCheck, ChevronRight, Loader2 } from 'lucide-react';
import { ParentUser, UserStats } from '@/types';
import { supabase } from '@/services/supabase';
import { sanitizeForDb } from '@/utils/sanitizeForDb';

const DISPLAY_NAME_MAX = 80;
const EMPTY_NAME_ERROR = 'Vul je naam in zodat leerlingen weten met wie ze werken.';

export interface TeacherOnboardingUpdates {
    displayName: string;
    stats: UserStats;
}

interface TeacherFirstLoginWizardProps {
    user: ParentUser;
    onComplete: (updates: TeacherOnboardingUpdates) => void;
}

type Step = 'welcome' | 'profile' | 'done';

const STEP_ORDER: Step[] = ['welcome', 'profile', 'done'];

const STEP_TITLES: Record<Step, string> = {
    welcome: 'Welkom bij DGSkills',
    profile: 'Hoe heet je voor je leerlingen?',
    done: 'Klaar om te starten',
};

const ProgressDots: React.FC<{ activeIndex: number }> = ({ activeIndex }) => (
    <div className="flex items-center gap-2" aria-label={`Stap ${activeIndex + 1} van ${STEP_ORDER.length}`}>
        {STEP_ORDER.map((_, idx) => (
            <span
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                    idx === activeIndex
                        ? 'w-8 bg-duck-acid'
                        : idx < activeIndex
                        ? 'w-4 bg-duck-acid'
                        : 'w-4 bg-duck-bg'
                }`}
                aria-hidden="true"
            />
        ))}
    </div>
);

export const TeacherFirstLoginWizard: React.FC<TeacherFirstLoginWizardProps> = ({
    user,
    onComplete,
}) => {
    const [step, setStep] = useState<Step>('welcome');
    const [displayName, setDisplayName] = useState<string>(user.displayName?.trim() || '');
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const sanitizedName = displayName.trim().slice(0, DISPLAY_NAME_MAX);
    const stepIndex = STEP_ORDER.indexOf(step);

    const validateName = (): boolean => {
        if (!sanitizedName) {
            setErrorMessage(EMPTY_NAME_ERROR);
            return false;
        }
        setErrorMessage(null);
        return true;
    };

    const handleSave = async () => {
        if (!validateName()) return;
        setIsSaving(true);
        try {
            const newStats: UserStats = {
                ...(user.stats ?? { xp: 0, level: 1, missionsCompleted: [], inventory: [] }),
                hasCompletedTeacherOnboarding: true,
            };

            const { error } = await supabase
                .from('users')
                .update({
                    display_name: sanitizedName,
                    stats: sanitizeForDb(newStats),
                })
                .eq('id', user.uid);

            if (error) throw error;

            onComplete({ displayName: sanitizedName, stats: newStats });
        } catch (err) {
            const message =
                err instanceof Error && err.message
                    ? err.message
                    : 'Onbekende fout — probeer het opnieuw.';
            setErrorMessage(`Opslaan mislukt: ${message}`);
            setIsSaving(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[200] bg-duck-ink/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="teacher-wizard-title"
        >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg my-8 overflow-hidden">
                <div className="px-8 pt-8 pb-4 flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-lab-coral text-white text-xs font-bold rounded-full uppercase tracking-wide">
                        <Sparkles size={14} />
                        Eerste keer
                    </span>
                    <ProgressDots activeIndex={stepIndex} />
                </div>

                <h1
                    id="teacher-wizard-title"
                    className="px-8 text-2xl md:text-3xl font-bold text-lab-ink mb-3"
                >
                    {STEP_TITLES[step]}
                </h1>

                {step === 'welcome' && (
                    <div className="px-8 pb-8">
                        <p className="text-lab-muted mb-6">
                            Fijn dat je de pilot start. We hebben een paar dingen nodig voordat je
                            naar je dashboard gaat. Het kost minder dan een minuut.
                        </p>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-start gap-3">
                                <span className="mt-0.5 w-6 h-6 rounded-full bg-lab-coral text-white text-xs font-bold flex items-center justify-center shrink-0">
                                    1
                                </span>
                                <span className="text-sm text-lab-muted">
                                    Bevestig de naam waarmee leerlingen jou zien.
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-0.5 w-6 h-6 rounded-full bg-lab-coral text-white text-xs font-bold flex items-center justify-center shrink-0">
                                    2
                                </span>
                                <span className="text-sm text-lab-muted">
                                    Daarna kom je direct in het docent-dashboard.
                                </span>
                            </li>
                        </ul>
                        <div className="flex items-center gap-2 text-xs text-lab-muted mb-6">
                            <ShieldCheck size={14} className="text-lab-sage" />
                            <span>
                                Je account is gekoppeld aan jouw school. Data blijft binnen de EER
                                en wordt alleen gedeeld binnen je eigen schoolomgeving.
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setStep('profile')}
                            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-lab-coral hover:bg-lab-coral hover:text-white text-white font-bold rounded-lg text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-lab-coral"
                        >
                            Aan de slag
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}

                {step === 'profile' && (
                    <div className="px-8 pb-8">
                        <p className="text-lab-muted text-sm mb-6">
                            Dit is de naam die in het leerling-dashboard verschijnt bij berichten
                            en feedback. Je kunt deze later aanpassen via je profiel.
                        </p>

                        <label
                            htmlFor="teacher-display-name"
                            className="block text-xs font-semibold text-lab-muted mb-1.5"
                        >
                            Naam
                        </label>
                        <input
                            id="teacher-display-name"
                            type="text"
                            autoFocus
                            required
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            maxLength={DISPLAY_NAME_MAX}
                            placeholder="Bijv. Mevrouw De Vries of Meneer Janssen"
                            autoComplete="name"
                            className="w-full px-3.5 min-h-[44px] bg-lab-cream border border-lab-line rounded-lg outline-none focus:ring-2 focus:ring-lab-coral focus:border-lab-coral transition-all text-sm text-lab-ink placeholder:text-lab-muted"
                        />
                        <p className="text-[11px] text-lab-muted mt-1.5">
                            {sanitizedName.length}/{DISPLAY_NAME_MAX} tekens
                        </p>

                        {errorMessage && (
                            <p
                                role="alert"
                                className="mt-4 text-sm text-white bg-lab-coral border border-lab-coral rounded-lg px-3 py-2"
                            >
                                {errorMessage}
                            </p>
                        )}

                        <div className="mt-8 flex flex-col sm:flex-row-reverse gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    if (validateName()) setStep('done');
                                }}
                                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-lab-coral hover:bg-lab-coral hover:text-white text-white font-bold rounded-lg text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-lab-coral"
                            >
                                Volgende
                                <ChevronRight size={16} />
                            </button>
                            <button
                                type="button"
                                onClick={() => setStep('welcome')}
                                className="px-4 py-3 text-sm font-semibold text-lab-muted hover:text-lab-ink transition-colors"
                            >
                                Terug
                            </button>
                        </div>
                    </div>
                )}

                {step === 'done' && (
                    <div className="px-8 pb-8">
                        <p className="text-lab-muted mb-6">
                            Hieronder zie je hoe leerlingen je naam zullen zien. Klopt het? Dan
                            ben je klaar om je dashboard te openen.
                        </p>

                        <div className="bg-lab-cream rounded-2xl p-5 mb-6">
                            <p className="text-[10px] uppercase tracking-wide text-lab-muted font-bold mb-1">
                                Zichtbaar voor leerlingen
                            </p>
                            <p className="text-lg font-bold text-lab-ink">{sanitizedName}</p>
                        </div>

                        <div className="bg-lab-coral rounded-2xl p-5 mb-6">
                            <p className="text-[10px] uppercase tracking-wide text-lab-coral font-bold mb-2">
                                Wat je hierna kunt
                            </p>
                            <ul className="space-y-1.5 text-sm text-lab-muted">
                                <li>· Leerlingen aan je klas koppelen vanuit het dashboard.</li>
                                <li>· De missiekalender per periode bekijken.</li>
                                <li>· De rondleiding starten voor een uitleg per onderdeel.</li>
                            </ul>
                        </div>

                        {errorMessage && (
                            <p
                                role="alert"
                                className="mb-4 text-sm text-white bg-lab-coral border border-lab-coral rounded-lg px-3 py-2"
                            >
                                {errorMessage}
                            </p>
                        )}

                        <div className="flex flex-col sm:flex-row-reverse gap-3">
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={isSaving}
                                aria-busy={isSaving}
                                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-lab-coral hover:bg-lab-coral hover:text-white text-white font-bold rounded-lg text-sm transition-colors disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-lab-coral"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                                        Opslaan…
                                    </>
                                ) : (
                                    <>
                                        Naar dashboard
                                        <ChevronRight size={16} />
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    if (!isSaving) {
                                        setErrorMessage(null);
                                        setStep('profile');
                                    }
                                }}
                                disabled={isSaving}
                                className="px-4 py-3 text-sm font-semibold text-lab-muted hover:text-lab-ink transition-colors disabled:opacity-60"
                            >
                                Naam aanpassen
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
