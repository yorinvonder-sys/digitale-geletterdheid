import React from 'react';

interface EthicsPreviewProps {
    colorScheme?: 'emerald' | 'violet' | 'indigo';
    icon?: React.ReactNode;
}

const colorMap = {
    emerald: {
        bg: 'from-emerald-700 to-emerald-900',
        scaleBg: 'bg-emerald-400',
        pro: 'bg-emerald-400/40',
        contra: 'bg-rose-400/40',
        beam: 'bg-emerald-300/60',
        dotPro: 'bg-emerald-300',
        dotContra: 'bg-rose-300',
        bubble: 'bg-emerald-400/20',
    },
    violet: {
        bg: 'from-violet-700 to-violet-900',
        scaleBg: 'bg-violet-400',
        pro: 'bg-violet-400/40',
        contra: 'bg-rose-400/40',
        beam: 'bg-violet-300/60',
        dotPro: 'bg-violet-300',
        dotContra: 'bg-rose-300',
        bubble: 'bg-violet-400/20',
    },
    indigo: {
        bg: 'from-indigo-700 to-indigo-900',
        scaleBg: 'bg-indigo-400',
        pro: 'bg-indigo-400/40',
        contra: 'bg-rose-400/40',
        beam: 'bg-indigo-300/60',
        dotPro: 'bg-indigo-300',
        dotContra: 'bg-rose-300',
        bubble: 'bg-indigo-400/20',
    },
};

const EthicsPreview: React.FC<EthicsPreviewProps> = ({ colorScheme = 'emerald', icon }) => {
    const c = colorMap[colorScheme];

    return (
        <div className={`w-full h-full bg-gradient-to-br ${c.bg} flex flex-col items-center justify-center p-3 relative overflow-hidden`}>
            {/* Thought bubble background */}
            <div className={`absolute top-3 right-4 w-14 h-10 ${c.bubble} rounded-full backdrop-blur-sm border border-white/10`} />
            <div className={`absolute top-11 right-8 w-4 h-3 ${c.bubble} rounded-full border border-white/10`} />
            <div className={`absolute top-13 right-10 w-2 h-2 ${c.bubble} rounded-full border border-white/10`} />

            {/* Scale / balance visual */}
            <div className="relative z-10 w-full flex flex-col items-center mb-3">
                {/* Pivot */}
                <div className={`w-3 h-3 ${c.scaleBg} rounded-full mb-1 shadow-lg`} />
                {/* Stand */}
                <div className={`w-0.5 h-4 ${c.beam}`} />

                {/* Beam (tilted) */}
                <div className="relative w-full flex items-start justify-center" style={{ transform: 'rotate(-5deg)' }}>
                    <div className={`h-0.5 w-3/4 ${c.beam} rounded-full`} />

                    {/* Left pan (Pro) */}
                    <div className="absolute -left-1 top-0 flex flex-col items-center">
                        <div className="w-px h-3 bg-white/20" />
                        <div className={`w-12 ${c.pro} rounded-lg border border-white/10 p-1.5 backdrop-blur-sm`}>
                            <div className="text-[6px] text-white/70 font-bold text-center mb-1">PRO</div>
                            <div className="flex gap-0.5 justify-center">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className={`w-1.5 h-1.5 ${c.dotPro} rounded-full opacity-80`} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right pan (Contra) */}
                    <div className="absolute -right-1 top-0 flex flex-col items-center">
                        <div className="w-px h-5 bg-white/20" />
                        <div className={`w-12 ${c.contra} rounded-lg border border-white/10 p-1.5 backdrop-blur-sm`}>
                            <div className="text-[6px] text-white/70 font-bold text-center mb-1">CONTRA</div>
                            <div className="flex gap-0.5 justify-center">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className={`w-1.5 h-1.5 ${c.dotContra} rounded-full opacity-80`} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Voting / sentiment bars */}
            <div className="relative z-10 w-full px-4 mt-4">
                <div className="flex gap-1 items-end h-6">
                    <div className={`flex-1 ${c.pro} rounded-t-sm`} style={{ height: '60%' }}>
                        <div className="text-[5px] text-white/60 text-center pt-0.5">62%</div>
                    </div>
                    <div className={`flex-1 ${c.contra} rounded-t-sm`} style={{ height: '40%' }}>
                        <div className="text-[5px] text-white/60 text-center pt-0.5">38%</div>
                    </div>
                </div>
                <div className="h-px bg-white/20 mt-0.5" />
            </div>

            {/* Icon overlay */}
            {icon && (
                <div className="absolute bottom-2 right-2 opacity-15">
                    {icon}
                </div>
            )}
        </div>
    );
};

export default EthicsPreview;
