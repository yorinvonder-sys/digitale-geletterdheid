import React from 'react';

interface DataPreviewProps {
    colorScheme?: 'emerald' | 'violet' | 'indigo';
    icon?: React.ReactNode;
}

const colorMap = {
    emerald: {
        bg: 'from-emerald-600 to-emerald-800',
        headerBg: 'bg-emerald-400/30',
        cellBg: 'bg-white/10',
        barColors: ['bg-emerald-300', 'bg-emerald-400', 'bg-emerald-200', 'bg-emerald-500'],
        accent: 'bg-emerald-400/20',
    },
    violet: {
        bg: 'from-violet-700 to-violet-900',
        headerBg: 'bg-violet-400/30',
        cellBg: 'bg-white/10',
        barColors: ['bg-violet-300', 'bg-violet-400', 'bg-violet-200', 'bg-violet-500'],
        accent: 'bg-violet-400/20',
    },
    indigo: {
        bg: 'from-indigo-600 to-indigo-800',
        headerBg: 'bg-indigo-400/30',
        cellBg: 'bg-white/10',
        barColors: ['bg-indigo-300', 'bg-indigo-400', 'bg-indigo-200', 'bg-indigo-500'],
        accent: 'bg-indigo-400/20',
    },
};

const DataPreview: React.FC<DataPreviewProps> = ({ colorScheme = 'emerald', icon }) => {
    const c = colorMap[colorScheme];
    const barHeights = [60, 85, 45, 70, 90];

    return (
        <div className={`w-full h-full bg-gradient-to-br ${c.bg} flex flex-col p-3 relative overflow-hidden`}>
            {/* Subtle grid background */}
            <div className="absolute inset-0 opacity-5">
                {[...Array(6)].map((_, i) => (
                    <div key={`h-${i}`} className="absolute w-full border-t border-white" style={{ top: `${(i + 1) * 16}%` }} />
                ))}
                {[...Array(4)].map((_, i) => (
                    <div key={`v-${i}`} className="absolute h-full border-l border-white" style={{ left: `${(i + 1) * 25}%` }} />
                ))}
            </div>

            {/* Mini table */}
            <div className="relative z-10 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden mb-2">
                {/* Header row */}
                <div className={`flex gap-px ${c.headerBg} px-2 py-1.5`}>
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex-1">
                            <div className="h-1.5 bg-white/40 rounded-full" style={{ width: `${50 + i * 15}%` }} />
                        </div>
                    ))}
                </div>
                {/* Data rows */}
                {[...Array(3)].map((_, row) => (
                    <div key={row} className="flex gap-px px-2 py-1 border-t border-white/5">
                        {[...Array(3)].map((_, col) => (
                            <div key={col} className="flex-1">
                                <div className={`h-1 ${c.cellBg} rounded-full`} style={{ width: `${40 + ((row + col) * 12) % 50}%` }} />
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Bar chart */}
            <div className="relative z-10 flex-1 flex items-end gap-1.5 px-2 pb-1">
                {barHeights.map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col justify-end items-center">
                        <div
                            className={`w-full ${c.barColors[i % c.barColors.length]} rounded-t-sm opacity-80`}
                            style={{
                                height: `${h}%`,
                                animation: `fadeInUp 0.5s ease-out ${i * 0.1}s both`,
                            }}
                        />
                        <div className="w-full h-px bg-white/20 mt-0.5" />
                    </div>
                ))}
            </div>

            {/* Icon overlay */}
            {icon && (
                <div className="absolute top-2 right-2 opacity-20">
                    {icon}
                </div>
            )}

            <style>{`
                @keyframes fadeInUp {
                    from { height: 0%; opacity: 0; }
                    to { opacity: 0.8; }
                }
            `}</style>
        </div>
    );
};

export default DataPreview;
