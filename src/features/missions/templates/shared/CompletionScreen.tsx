import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Trophy, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { KeesMessage } from '@/components/brand/KeesMessage';
import { getKeesCompletionLine } from '@/config/keesVoice';
import type { BadgeConfig } from './types';

interface PhaseScore {
    icon: string;
    title: string;
    score: number;
    max: number;
}

interface CompletionScreenProps {
    score: number;
    maxScore: number;
    badges: BadgeConfig[];
    /** Mission name, shown as an eyebrow above the badge title so the earned badge
     *  ("Screen Bewust", "Blijf Oefenen", …) is never mistaken for the mission title. */
    missionTitle?: string;
    phases?: PhaseScore[];
    /** Korte toelichting onder de uitsplitsing, bv. wanneer de onderdelen samen
     *  meer ruimte bieden dan maxScore (bonusruimte). */
    phasesNote?: string;
    takeaways: string[];
    /** Mag async zijn; het scherm wacht de afronding af en houdt de knop zolang bezig. */
    onComplete: () => void | Promise<void>;
    onRetry?: () => void | Promise<void>;
    /** Slaagdrempel als percentage. Engines met een eigen missiedrempel (bv. 60)
     *  geven die hier door, anders toont dit scherm 'Gehaald' terwijl de missie
     *  de run niet als gehaald registreert. */
    passScorePercent?: number;
    /** Expliciete slaag-uitkomst voor engines waarvan slagen niet (alleen) van de
     *  score afhangt (bv. verplichte rondes). Overstemt de percentageberekening. */
    passed?: boolean;
    attribution?: {
        source: string;
        author?: string;
        license?: string;
        licenseUrl?: string;
        sourceUrl?: string;
    };
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({
    score,
    maxScore,
    badges,
    missionTitle,
    phases,
    phasesNote,
    takeaways,
    onComplete,
    onRetry,
    passScorePercent = 40,
    passed: passedOverride,
    attribution,
}) => {
    const badge = [...badges]
        .sort((a, b) => b.minScore - a.minScore)
        .find((b) => score >= b.minScore) || badges[badges.length - 1];

    const percentage = Math.round((score / maxScore) * 100);

    // Dit scherm vervangt de hele missie; zonder focusverplaatsing landt de focus op
    // <body> en hoort een schermlezer niets. De kop is het programmatische beginpunt
    // en beschrijft zichzelf met score + uitkomst, zodat een live-regio (die
    // beginhoud niet betrouwbaar aankondigt) niet nodig is.
    const headingRef = useRef<HTMLHeadingElement>(null);
    const summaryId = useId();

    useEffect(() => {
        headingRef.current?.focus();
    }, []);

    // A learner who skipped or failed most of a mission has not actually mastered
    // the takeaways, so we must not present them as achieved (green ✓) nor claim a
    // celebratory "voltooid". 40% mirrors the pass threshold used elsewhere.
    const passed = passedOverride ?? (maxScore > 0 && percentage >= passScorePercent);

    // Zonder onRetry mag de knop nooit uitgeschakeld raken. Dit scherm vervangt de
    // hele missie en heeft geen eigen navigatie, en de results-fase staat in de
    // opgeslagen voortgang: een uitgeschakelde knop is dus een doodlopend scherm dat
    // ook na herladen terugkomt. Afronden zonder succes is dan de uitweg — de score
    // gaat mee zoals hij is, er wordt niets als 'gehaald' gerapporteerd.
    const primaryAction = passed ? onComplete : (onRetry ?? onComplete);

    // De engines geven een async onComplete mee; zonder deze poort vuren twee snelle
    // klikken (of Enter-herhaling) hem twee keer af. De host ontdubbelt de opslag al,
    // dit houdt de knop zichtbaar bezig en voorkomt de dubbele aanroep.
    const [pending, setPending] = useState(false);
    const pendingRef = useRef(false);

    const handlePrimary = useCallback(async () => {
        if (pendingRef.current) return;
        pendingRef.current = true;
        setPending(true);
        try {
            await primaryAction();
        } finally {
            // Mislukt afronden, dan moet de leerling het opnieuw kunnen proberen.
            pendingRef.current = false;
            setPending(false);
        }
    }, [primaryAction]);

    return (
        <div
            data-qa="mission-completion"
            className="min-h-screen overflow-y-auto bg-duck-bg flex items-start justify-center px-4 py-6 sm:py-8"
        >
            <div className="w-full max-w-lg">
                {/* Badge */}
                <div
                    className="text-center mb-6 p-6 rounded-3xl"
                    style={{ background: `linear-gradient(135deg, ${badge.color}15, ${badge.color}08)` }}
                >
                    <KeesMessage
                        message={getKeesCompletionLine(percentage)}
                        mood="cheer"
                        layout="stacked"
                        duckClassName="h-12 w-12"
                        className="mx-auto mb-3 max-w-xs"
                    />
                    {missionTitle && (
                        <p
                            className="text-[11px] font-black text-duck-ink/75 uppercase tracking-widest mb-1"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            {missionTitle} · afgerond
                        </p>
                    )}
                    <h2
                        ref={headingRef}
                        tabIndex={-1}
                        aria-describedby={summaryId}
                        data-qa="completion-heading"
                        className="text-2xl font-black text-duck-ink mb-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2 rounded-lg"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        {badge.title}
                    </h2>
                    {/* Score en uitkomst horen bij de kop: ze worden meegelezen zodra de
                        focus daarheen gaat. De uitkomst hangt niet alleen aan de
                        tekstkleur maar ook aan een icoon en een label. */}
                    <div
                        id={summaryId}
                        className="mt-3 flex flex-col items-center gap-2"
                    >
                        <div className="flex items-center justify-center gap-2">
                            <Trophy size={16} className="text-duck-ink" aria-hidden="true" />
                            <span className="text-lg font-black text-duck-ink">
                                {score}/{maxScore} punten ({percentage}%)
                            </span>
                        </div>
                        <span
                            data-qa="completion-outcome"
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black ${
                                passed
                                    ? 'bg-duck-ink text-duck-acid'
                                    : 'border-2 border-duck-ink bg-white text-duck-ink'
                            }`}
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            {passed ? (
                                <CheckCircle2 size={13} aria-hidden="true" />
                            ) : (
                                <RotateCcw size={13} aria-hidden="true" />
                            )}
                            {passed ? 'Gehaald' : 'Nog niet gehaald'}
                        </span>
                    </div>
                </div>

                {/* Phase breakdown */}
                {phases && phases.length > 0 && (
                    <div className="bg-white rounded-2xl border border-duck-gray p-4 mb-4">
                        {phases.map((phase, i) => (
                            <div
                                key={i}
                                className={`flex items-center justify-between py-2 ${
                                    i < phases.length - 1 ? 'border-b border-duck-gray' : ''
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <span>{phase.icon}</span>
                                    <span
                                        className="text-sm text-duck-ink/75"
                                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                    >
                                        {phase.title}
                                    </span>
                                </div>
                                <span className="text-sm font-bold text-duck-ink">
                                    {phase.score}/{phase.max}
                                </span>
                            </div>
                        ))}
                        {phasesNote && (
                            <p
                                className="mt-2 border-t border-duck-gray pt-2 text-[11px] leading-relaxed text-duck-ink/60"
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                {phasesNote}
                            </p>
                        )}
                    </div>
                )}

                {/* Complete button */}
                <button
                    data-qa="confirm-completion"
                    onClick={handlePrimary}
                    disabled={pending}
                    aria-busy={pending || undefined}
                    className="mb-4 w-full py-3.5 bg-duck-acid hover:bg-duck-acid/80 text-duck-ink rounded-full font-black text-sm transition-all duration-200 active:scale-[0.98] shadow-lg shadow-duck-acid/25 disabled:cursor-wait disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {pending
                        ? 'Bezig met opslaan…'
                        : passed
                          ? 'Missie voltooid! 🎉'
                          : 'Afronden — probeer het gerust nog eens'}
                </button>

                {/* Takeaways — framed as achieved (✓) only when the learner actually
                    passed; otherwise shown neutrally as the mission's learning goals. */}
                <div className="bg-white rounded-2xl border border-duck-gray p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles size={16} className="text-duck-ink" />
                        <span
                            className="text-xs font-black text-duck-ink uppercase tracking-widest"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            {passed ? 'Wat je hebt geleerd' : 'Wat deze missie je wilde leren'}
                        </span>
                    </div>
                    <ul className="space-y-2">
                        {takeaways.map((t, i) => (
                            <li
                                key={i}
                                className="text-sm text-duck-ink/75 flex items-start gap-2"
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                <span className="text-duck-ink mt-0.5" aria-hidden="true">{passed ? '✓' : '•'}</span>
                                {t}
                            </li>
                        ))}
                    </ul>
                </div>

                {attribution && (
                    <p className="mt-4 text-[11px] leading-relaxed text-duck-ink/75 text-center" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                        Eigen bewerking, gebaseerd op{' '}
                        {attribution.sourceUrl ? (
                            <a
                                href={attribution.sourceUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="underline decoration-duck-ink/25 underline-offset-2 hover:text-duck-ink/70"
                            >
                                de open les ‘{attribution.source}’
                            </a>
                        ) : (
                            <span>de open les ‘{attribution.source}’</span>
                        )}
                        {attribution.author ? ` van ${attribution.author}` : ''}
                        {attribution.license ? (
                            <>
                                {' · '}
                                {attribution.licenseUrl ? (
                                    <a
                                        href={attribution.licenseUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="underline decoration-duck-ink/25 underline-offset-2 hover:text-duck-ink/70"
                                    >
                                        {attribution.license}
                                    </a>
                                ) : (
                                    attribution.license
                                )}
                            </>
                        ) : ''}
                    </p>
                )}
            </div>
        </div>
    );
};
