import React from 'react';

interface SecurityPreviewProps {
    colorScheme?: 'emerald' | 'violet' | 'indigo';
    icon?: React.ReactNode;
}

const colorMap = {
    emerald: {
        accent: 'text-emerald-400',
        scanBar: 'bg-emerald-400',
        progressBg: 'bg-emerald-400/30',
        progressFill: 'bg-emerald-400',
        matrixColor: 'text-emerald-500/20',
        border: 'border-emerald-500/20',
        lockBg: 'bg-emerald-500/20',
    },
    violet: {
        accent: 'text-violet-400',
        scanBar: 'bg-violet-400',
        progressBg: 'bg-violet-400/30',
        progressFill: 'bg-violet-400',
        matrixColor: 'text-violet-500/20',
        border: 'border-violet-500/20',
        lockBg: 'bg-violet-500/20',
    },
    indigo: {
        accent: 'text-indigo-400',
        scanBar: 'bg-indigo-400',
        progressBg: 'bg-indigo-400/30',
        progressFill: 'bg-indigo-400',
        matrixColor: 'text-indigo-500/20',
        border: 'border-indigo-500/20',
        lockBg: 'bg-indigo-500/20',
    },
};

const matrixChars = '01アイウエオカキクケコ';

const SecurityPreview: React.FC<SecurityPreviewProps> = ({ colorScheme = 'violet', icon }) => {
    const c = colorMap[colorScheme];

    return (
        <div className="w-full h-full bg-[#0a0a1a] flex flex-col relative overflow-hidden font-mono">
            {/* Matrix-like background */}
            <div className="absolute inset-0 opacity-100">
                {[...Array(8)].map((_, col) => (
                    <div
                        key={col}
                        className={`absolute ${c.matrixColor} text-[7px] leading-tight`}
                        style={{
                            left: `${col * 13}%`,
                            top: '-10%',
                            animation: `matrixFall ${3 + col * 0.5}s linear ${col * 0.3}s infinite`,
                        }}
                    >
                        {[...Array(12)].map((_, i) => (
                            <div key={i}>{matrixChars[Math.floor((col * 3 + i * 7) % matrixChars.length)]}</div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Terminal header */}
            <div className={`relative z-10 flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border-b ${c.border}`}>
                <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400/60" />
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/60" />
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400/60" />
                </div>
                <div className="text-[7px] text-white/30 ml-1">security-scan</div>
            </div>

            {/* Terminal content */}
            <div className="relative z-10 flex-1 flex flex-col p-3 gap-1.5">
                {/* Lock / shield icon */}
                <div className="flex items-center gap-2 mb-1">
                    <div className={`w-8 h-8 ${c.lockBg} rounded-lg flex items-center justify-center border ${c.border}`}>
                        {icon || (
                            <span className={`text-sm ${c.accent}`}>&#128274;</span>
                        )}
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <div className={`text-[7px] ${c.accent} font-bold`}>SECURITY SCAN</div>
                        <div className="text-[6px] text-white/30">v2.4.1</div>
                    </div>
                </div>

                {/* Scanning text with typing animation */}
                <div className="flex items-center gap-1">
                    <span className={`text-[7px] ${c.accent}`}>&gt;</span>
                    <div className="text-[7px] text-white/60 flex items-center">
                        <span>Scanning network</span>
                        <span className="inline-flex ml-0.5">
                            {[...Array(3)].map((_, i) => (
                                <span
                                    key={i}
                                    className={c.accent}
                                    style={{
                                        animation: `dotBlink 1.4s steps(1) ${i * 0.4}s infinite`,
                                    }}
                                >.</span>
                            ))}
                        </span>
                    </div>
                </div>

                {/* Log lines */}
                <div className="text-[6px] text-white/30 flex flex-col gap-0.5">
                    <div>[OK] ports 80, 443</div>
                    <div>[OK] SSL/TLS valid</div>
                    <div className="text-yellow-400/50">[WARN] open port 8080</div>
                </div>

                {/* Progress bar */}
                <div className="mt-auto">
                    <div className="flex justify-between mb-0.5">
                        <div className="text-[6px] text-white/30">Progress</div>
                        <div className={`text-[6px] ${c.accent}`}>73%</div>
                    </div>
                    <div className={`h-1.5 ${c.progressBg} rounded-full overflow-hidden`}>
                        <div
                            className={`h-full ${c.progressFill} rounded-full`}
                            style={{
                                width: '73%',
                                animation: 'progressPulse 2s ease-in-out infinite',
                            }}
                        />
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes matrixFall {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(200%); }
                }
                @keyframes dotBlink {
                    0%, 100% { opacity: 0; }
                    50% { opacity: 1; }
                }
                @keyframes progressPulse {
                    0%, 100% { opacity: 0.8; }
                    50% { opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default SecurityPreview;
