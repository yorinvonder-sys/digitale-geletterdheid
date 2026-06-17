import React from 'react';
import { ChevronRight } from 'lucide-react';
import { KeesMessage } from '@/components/brand/KeesMessage';
import { MissionGoalBanner } from './MissionGoalBanner';
import { getKeesMissionIntro } from '@/config/keesVoice';
import type { MissionGoal } from './types';

interface IntroScreenProps {
    emoji: string;
    title: string;
    description: string;
    onStart: () => void;
    features?: string[];
    goal?: MissionGoal | string;
    coachMessage?: string;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({
    emoji,
    title,
    description,
    onStart,
    features,
    goal,
    coachMessage,
}) => (
    <div className="min-h-screen overflow-y-auto bg-duck-bg flex items-start justify-center px-4 py-6 sm:py-8" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
        <div className="w-full max-w-lg text-center">
            <KeesMessage
                message={coachMessage ?? getKeesMissionIntro(title)}
                mood="wave"
                layout="stacked"
                duckClassName="h-12 w-12"
                className="mx-auto mb-4 max-w-xs"
            />
            <h1
                className="text-2xl font-black text-duck-ink mb-3"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                {title}
            </h1>
            <p
                className="text-sm text-duck-ink/60 leading-relaxed mb-5"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                {description}
            </p>

            {goal && <MissionGoalBanner goal={goal} className="mb-5" />}

            <button
                onClick={onStart}
                className="mb-5 w-full py-3.5 bg-duck-acid hover:bg-duck-acid/80 text-duck-ink rounded-full font-black text-sm transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-duck-acid/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                Start de missie
                <ChevronRight size={16} />
            </button>

            {features && features.length > 0 && (
                <div className="bg-white rounded-2xl border border-duck-gray p-4 text-left shadow-sm">
                    {features.map((f, i) => (
                        <div
                            key={i}
                            className={`flex items-center gap-3 py-2.5 ${
                                i < features.length - 1 ? 'border-b border-duck-gray' : ''
                            }`}
                        >
                            <div className="w-6 h-6 bg-duck-acid/10 rounded-lg flex items-center justify-center">
                                <span className="text-xs font-black text-duck-ink">{i + 1}</span>
                            </div>
                            <span
                                className="text-sm font-semibold text-duck-ink/60"
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                {f}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
);
