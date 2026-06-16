import React from 'react';
import { ChevronRight } from 'lucide-react';

interface IntroScreenProps {
    emoji: string;
    title: string;
    description: string;
    onStart: () => void;
    features?: string[];
}

export const IntroScreen: React.FC<IntroScreenProps> = ({
    emoji,
    title,
    description,
    onStart,
    features,
}) => (
    <div className="min-h-screen bg-[#FCF6EA] flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
            <div className="text-6xl mb-4">{emoji}</div>
            <h1
                className="text-2xl font-black text-[#08283B] mb-3"
                style={{ fontFamily: "'Newsreader', Georgia, serif" }}
            >
                {title}
            </h1>
            <p
                className="text-sm text-[#445865] leading-relaxed mb-6"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                {description}
            </p>

            {features && features.length > 0 && (
                <div className="bg-white rounded-2xl border border-[#E7D8BD] p-4 mb-6 text-left">
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
                                className="text-sm text-[#445865]"
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                {f}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            <button
                onClick={onStart}
                className="w-full py-3.5 bg-gradient-to-r from-[#D97848] to-[#D97848] hover:from-[#D97848] hover:to-[#D97848] text-white rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                Start de missie
                <ChevronRight size={16} />
            </button>
        </div>
    </div>
);
