import React, { useState } from 'react';
import { Sparkles, ShieldCheck, ChevronRight, Loader2 } from 'lucide-react';
import { ParentUser, UserStats } from '../../types';
import { supabase } from '../../services/supabase';
import { sanitizeForDb } from '../../utils/sanitizeForDb';

const DISPLAY_NAME_MAX = 80;

interface TeacherFirstLoginWizardProps {
    user: ParentUser;
    onComplete: (updatedUser: ParentUser) => void;
}

type Step = 'welcome' | 'profile' | 'done';

const STEP_ORDER: Step[] = ['welcome', 'profile', 'done'];

const ProgressDots: React.FC<{ activeIndex: number }> = ({ activeIndex }) => (
    <div className="flex items-center gap-2" aria-label={`Stap ${activeIndex + 1} van ${STEP_ORDER.length}`}>
        {STEP_ORDER.map((_, idx) => (
            <span
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                    idx === activeIndex
                        ? 'w-8 bg-indigo-600'
                        : idx < activeIndex
                        ? 'w-4 bg-indigo-300'
                        : 'w-4 bg-slate-200'
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

    const trimmedName = displayName.trim();
    const sanitizedName = trimmedName.slice(0, DISPLAY_NAME_MAX);
    const stepIndex = STEP_ORDER.indexOf(step);

    const handleSave = async () => {
        if (!sanitizedName) {
            setErrorMessage('Vul je naam in zodat leerlingen weten met wie ze werken.');
            return;
        }
        setIsSaving(true);
        setErrorMessage(null);
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

            onComplete({
                ...user,
                displayName: sanitizedName,
                stats: newStats,
            });
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
            className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="teacher-wizard-title"
        >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg my-8 overflow-hidden">
                <div className="px-8 pt-8 pb-4 flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-wide">
                        <Sparkles size={14} />
                        Eerste keer
                    </span>
                    <ProgressDots activeIndex={stepIndex} />
                </div>

                {step === 'welcome' && (
                    <div className="px-8 pb-8">
                        <h1
                            id="teacher-wizard-title"
                            className="text-2xl md:text-3xl font-bold text-slate-900 mb-3"
                        >
                            Welkom bij DGSkills
                        </h1>
                        <p className="text-slate-600 mb-6">
                            Fijn dat je de pilot start. We hebben een paar dingen nodig voordat je
                            naar je dashboard gaat. Het kost minder dan een minuut.
                        </p>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-start gap-3">
                                <span className="mt-0.5 w-6 h-6 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0">
                                    1
                                </span>
                                <span className="text-sm text-slate-700">
                                    Bevestig de naam waarmee leerlingen jou zien.
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-0.5 w-6 h-6 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0">
                                    2
                                </span>
                                <span className="text-sm text-slate-700">
                                    Daarna kom je direct in het docent-dashboard.
                                </span>
                            </li>
                        </ul>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
                            <ShieldCheck size={14} className="text-emerald-600" />
                            <span>
                                Je account is gekoppeld aan jouw school. Data blijft binnen de EER
                                en wordt alleen gedeeld binnen je eigen schoolomgeving.
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setStep('profile')}
                            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
                        >
                            Aan de slag
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}

                {step === 'profile' && (
                    <div className="px-8 pb-8">
                        <h1 id="teacher-wizard-title" className="text-2xl font-bold text-slate-900 mb-2">
                            Hoe heet je voor je leerlingen?
                        </h1>
                        <p className="text-slate-500 text-sm mb-6">
                            Dit is de naam die in het leerling-dashboard verschijnt bij berichten
                            en feedback. Je kunt deze later aanpassen via je profiel.
                        </p>

                        <label
                            htmlFor="teacher-display-name"
                            className="block text-xs font-semibold text-slate-600 mb-1.5"
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
                            className="w-full px-3.5 min-h-[44px] bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all text-sm text-slate-900 placeholder:text-slate-400"
                        />
                        <p className="text-[11px] text-slate-400 mt-1.5">
                            {sanitizedName.length}/{DISPLAY_NAME_MAX} tekens
                        </p>

                        {errorMessage && (
                            <p
                                role="alert"
                                className="mt-4 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2"
                            >
                                {errorMessage}
                            </p>
                        )}

                        <div className="mt-8 flex flex-col sm:flex-row-reverse gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    if (!sanitizedName) {
                                        setErrorMessage('Vul je naam in zodat leerlingen weten met wie ze werken.');
                                        return;
                                    }
                                    setErrorMessage(null);
                                    setStep('done');
                                }}
                                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
                            >
                                Volgende
                                <ChevronRight size={16} />
                            </button>
                            <button
                                type="button"
                                onClick={() => setStep('welcome')}
                                className="px-4 py-3 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                            >
                                Terug
                            </button>
                        </div>
                    </div>
                )}

                {step === 'done' && (
                    <div className="px-8 pb-8">
                        <h1 id="teacher-wizard-title" className="text-2xl font-bold text-slate-900 mb-2">
                            Klaar om te starten
                        </h1>
                        <p className="text-slate-600 mb-6">
                            Hieronder zie je hoe leerlingen je naam zullen zien. Klopt het? Dan
                            ben je klaar om je dashboard te openen.
                        </p>

                        <div className="bg-slate-50 rounded-2xl p-5 mb-6">
                            <p className="text-[10px] uppercase tracking-wide text-slate-500 font-bold mb-1">
                                Zichtbaar voor leerlingen
                            </p>
                            <p className="text-lg font-bold text-slate-900">{sanitizedName}</p>
                        </div>

                        <div className="bg-indigo-50 rounded-2xl p-5 mb-6">
                            <p className="text-[10px] uppercase tracking-wide text-indigo-700 font-bold mb-2">
                                Wat je hierna kunt
                            </p>
                            <ul className="space-y-1.5 text-sm text-slate-700">
                                <li>· Leerlingen aan je klas koppelen vanuit het dashboard.</li>
                                <li>· De missiekalender per periode bekijken.</li>
                                <li>· De rondleiding starten voor een uitleg per onderdeel.</li>
                            </ul>
                        </div>

                        {errorMessage && (
                            <p
                                role="alert"
                                className="mb-4 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2"
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
                                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-sm transition-colors disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
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
                                className="px-4 py-3 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-60"
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
