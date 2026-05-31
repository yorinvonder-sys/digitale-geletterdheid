import React from 'react';
import { ChevronRight } from 'lucide-react';
import { MissionGoalBanner } from './MissionGoalBanner';
import type { MissionGoal } from './types';

interface IntroScreenProps {
    emoji: string;
    title: string;
    description: string;
    onStart: () => void;
    features?: string[];
    goal?: MissionGoal | string;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({
    emoji,
    title,
    description,
    onStart,
    features,
    goal,
}) => (
    <div className="min-h-dvh overflow-y-auto bg-[#FCF6EA] flex items-start justify-center px-4 py-4 sm:py-6" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
        <div className="w-full max-w-lg text-center pb-[max(1rem,env(safe-area-inset-bottom))]">
            <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl border border-[#E7D8BD] bg-[#FFFDF7] text-3xl shadow-sm sm:size-16 sm:text-4xl">{emoji}</div>
            <h1
                className="text-xl font-black text-[#08283B] mb-2 sm:text-2xl"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                {title}
            </h1>
            <p
                className="text-sm text-[#445865] leading-relaxed mb-4"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                {description}
            </p>

            {goal && <MissionGoalBanner goal={goal} compact className="mb-4" />}

            <button
                onClick={onStart}
                data-qa="intro-start"
                className="mb-4 w-full py-3.5 bg-[#D7C95F] hover:bg-[#CBC04F] text-[#08283B] rounded-full font-black text-sm transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-[#D7C95F]/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B453F] focus-visible:ring-offset-2"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                Start de missie
                <ChevronRight size={16} />
            </button>

            {features && features.length > 0 && (
                <div className="bg-[#FFFDF7] rounded-2xl border border-[#E7D8BD] p-3 text-left shadow-sm sm:p-4">
                    {features.map((f, i) => (
                        <div
                            key={i}
                            className={`flex items-center gap-3 py-2.5 ${
                                i < features.length - 1 ? 'border-b border-[#E7D8BD]' : ''
                            }`}
                        >
                            <div className="w-6 h-6 bg-[#D97848]/10 rounded-lg flex items-center justify-center">
                                <span className="text-xs font-black text-[#D97848]">{i + 1}</span>
                            </div>
                            <span
                                className="text-sm font-semibold text-[#445865]"
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
