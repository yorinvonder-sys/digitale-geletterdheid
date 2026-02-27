import React from 'react';

interface MediaPreviewProps {
    colorScheme?: 'emerald' | 'violet' | 'indigo';
    icon?: React.ReactNode;
}

const colorMap = {
    emerald: {
        bg: 'from-emerald-600 via-emerald-700 to-emerald-900',
        playBg: 'bg-emerald-400',
        waveColor: 'bg-emerald-300',
        accent: 'bg-emerald-400/30',
        text: 'text-emerald-200',
    },
    violet: {
        bg: 'from-violet-600 via-violet-700 to-violet-900',
        playBg: 'bg-violet-400',
        waveColor: 'bg-violet-300',
        accent: 'bg-violet-400/30',
        text: 'text-violet-200',
    },
    indigo: {
        bg: 'from-indigo-600 via-indigo-700 to-indigo-900',
        playBg: 'bg-indigo-400',
        waveColor: 'bg-indigo-300',
        accent: 'bg-indigo-400/30',
        text: 'text-indigo-200',
    },
};

const MediaPreview: React.FC<MediaPreviewProps> = ({ colorScheme = 'emerald', icon }) => {
    const c = colorMap[colorScheme];
    const waveHeights = [30, 60, 45, 80, 35, 70, 50, 90, 40, 65, 55, 75, 30, 85, 45];

    return (
        <div className={`w-full h-full bg-gradient-to-br ${c.bg} flex flex-col p-3 relative overflow-hidden`}>
            {/* Video player frame */}
            <div className="relative z-10 bg-black/30 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden mb-2 flex-1 min-h-0">
                {/* Thumbnail with gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                    {/* Play button */}
                    <div className={`w-10 h-10 ${c.playBg} rounded-full flex items-center justify-center shadow-lg`}>
                        <div className="w-0 h-0 border-l-[8px] border-l-white border-y-[5px] border-y-transparent ml-1" />
                    </div>
                </div>
                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                    <div className={`h-full ${c.playBg} rounded-r-full`} style={{ width: '35%' }} />
                </div>
                {/* Time indicator */}
                <div className="absolute bottom-1.5 right-2 text-[7px] text-white/40 font-mono">2:34</div>
            </div>

            {/* Audio waveform */}
            <div className="relative z-10 flex items-end gap-px h-8 px-1 mb-2">
                {waveHeights.map((h, i) => (
                    <div
                        key={i}
                        className={`flex-1 ${c.waveColor} rounded-t-full opacity-60`}
                        style={{
                            height: `${h}%`,
                            animation: `waveAnim 1.5s ease-in-out ${i * 0.08}s infinite alternate`,
                        }}
                    />
                ))}
            </div>

            {/* Engagement indicators */}
            <div className="relative z-10 flex items-center gap-3 px-1">
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-400/60 flex items-center justify-center">
                        <div className="text-[5px] text-white">&#9829;</div>
                    </div>
                    <div className="h-1 w-5 bg-white/20 rounded-full" />
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-blue-400/60 flex items-center justify-center">
                        <div className="text-[5px] text-white">&#8634;</div>
                    </div>
                    <div className="h-1 w-4 bg-white/20 rounded-full" />
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-white/20 flex items-center justify-center">
                        <div className="text-[5px] text-white">&#9998;</div>
                    </div>
                    <div className="h-1 w-6 bg-white/20 rounded-full" />
                </div>
            </div>

            {/* Icon overlay */}
            {icon && (
                <div className="absolute top-2 right-2 opacity-15">
                    {icon}
                </div>
            )}

            <style>{`
                @keyframes waveAnim {
                    from { transform: scaleY(0.7); }
                    to { transform: scaleY(1); }
                }
            `}</style>
        </div>
    );
};

export default MediaPreview;
