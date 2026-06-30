import React from 'react';
import { ChevronRight } from 'lucide-react';
import { KeesMessage } from '@/components/brand/KeesMessage';
import { DuckMark } from '@/components/brand/DuckMark';
import { MissionGoalBanner } from './MissionGoalBanner';
import { MissionMetaChips } from './MissionMetaChips';
import { getKeesMissionIntro } from '@/config/keesVoice';
import { getMissionMeta } from '@/config/missionMeta';
import type { MissionGoal } from './types';

export type IntroTone = 'default' | 'crisis' | 'terminal';

interface IntroScreenProps {
    emoji: string;
    title: string;
    description: string;
    onStart: () => void;
    features?: string[];
    goal?: MissionGoal | string;
    coachMessage?: string;
    missionId?: string;
    /** Visual flavour. White inner cards (goal/chips/Kees) float on every tone. */
    tone?: IntroTone;
    /** Small label shown above the title, for themed missions (e.g. "Crisis"). */
    eyebrow?: string;
    attribution?: {
        source: string;
        author?: string;
        license?: string;
        licenseUrl?: string;
        sourceUrl?: string;
    };
}

const FONT = { fontFamily: "'Outfit', system-ui, sans-serif" } as const;

const TONES: Record<
    IntroTone,
    {
        page: string;
        title: string;
        sub: string;
        desc: string;
        stepText: string;
        hero: string;
        stepCircle: string;
        connector: string;
        eyebrow: string;
    }
> = {
    default: {
        page: 'bg-duck-bg',
        title: 'text-duck-ink',
        sub: 'text-duck-ink/55',
        desc: 'text-duck-ink/60',
        stepText: 'text-duck-ink',
        hero: 'bg-duck-acid',
        stepCircle: 'bg-duck-acid text-duck-ink',
        connector: 'bg-duck-gray',
        eyebrow: 'text-duck-ink/55 font-black uppercase tracking-[0.16em]',
    },
    crisis: {
        page: 'bg-duck-bg',
        title: 'text-duck-ink',
        sub: 'text-duck-ink/55',
        desc: 'text-duck-ink/60',
        stepText: 'text-duck-ink',
        hero: 'bg-duck-error',
        stepCircle: 'bg-duck-acid text-duck-ink',
        connector: 'bg-duck-gray',
        eyebrow: 'text-duck-error font-black uppercase tracking-[0.16em]',
    },
    terminal: {
        page: 'bg-duck-ink',
        title: 'text-white',
        sub: 'text-duck-gray',
        desc: 'text-duck-gray',
        stepText: 'text-white',
        hero: 'bg-duck-acid',
        stepCircle: 'bg-duck-acid text-duck-ink',
        connector: 'bg-duck-gray/40',
        eyebrow: 'text-duck-acid font-mono',
    },
};

export const IntroScreen: React.FC<IntroScreenProps> = ({
    emoji,
    title,
    description,
    onStart,
    features,
    goal,
    coachMessage,
    missionId,
    tone = 'default',
    eyebrow,
    attribution,
}) => {
    const t = TONES[tone];
    const meta = missionId ? getMissionMeta(missionId) : undefined;
    const heroLabel = meta
        ? [meta.topicLabel, meta.leerjaar != null ? `Leerjaar ${meta.leerjaar}` : null]
              .filter(Boolean)
              .join(' · ')
        : '';

    return (
        <div
            className={`min-h-screen overflow-y-auto ${t.page} flex items-start justify-center px-4 py-6 sm:py-8`}
            style={FONT}
        >
            <div className="w-full max-w-lg text-center">
                {/* Hero — mission identity */}
                <div className="mb-3 flex flex-col items-center gap-2">
                    <div className={`flex size-14 items-center justify-center rounded-[1.1rem] ${t.hero} shadow-duck-soft`}>
                        {emoji ? (
                            <span className="text-3xl leading-none" aria-hidden="true">
                                {emoji}
                            </span>
                        ) : (
                            <DuckMark className="size-9" />
                        )}
                    </div>
                    {heroLabel && (
                        <p className={`text-[10px] font-black uppercase tracking-[0.14em] ${t.sub}`}>{heroLabel}</p>
                    )}
                </div>

                {eyebrow && <p className={`mb-1 text-[11px] ${t.eyebrow}`}>{eyebrow}</p>}

                <h1 className={`text-2xl font-black ${t.title} mb-3`} style={FONT}>
                    {title}
                </h1>

                {meta && <MissionMetaChips meta={meta} className="mb-4 justify-center" />}

                <p className={`text-sm ${t.desc} leading-relaxed mb-5`} style={FONT}>
                    {description}
                </p>

                {goal && <MissionGoalBanner goal={goal} className="mb-5" />}

                {features && features.length > 0 && (
                    <div className="mb-5 text-left">
                        {features.map((f, i) => {
                            const last = i === features.length - 1;
                            return (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="flex flex-col items-center self-stretch">
                                        <div className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-black ${t.stepCircle}`}>
                                            {i + 1}
                                        </div>
                                        {!last && <div className={`my-1 w-0.5 flex-1 ${t.connector}`} />}
                                    </div>
                                    <span
                                        className={`text-sm font-semibold ${t.stepText} ${last ? 'pt-0.5' : 'pb-3 pt-0.5'}`}
                                        style={FONT}
                                    >
                                        {f}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}

                <KeesMessage
                    message={coachMessage ?? getKeesMissionIntro(title)}
                    mood="wave"
                    layout="row"
                    duckClassName="h-9 w-9"
                    className="mb-4 text-left"
                />

                <button
                    onClick={onStart}
                    className="w-full py-3.5 bg-duck-acid hover:bg-duck-acid/80 text-duck-ink rounded-full font-black text-sm transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-duck-acid/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2"
                    style={FONT}
                >
                    Start de missie
                    <ChevronRight size={16} />
                </button>

                {attribution && (
                    <p className={`mt-4 text-[11px] leading-relaxed ${tone === 'terminal' ? 'text-duck-gray/70' : 'text-duck-ink/45'}`} style={FONT}>
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
