import React from 'react';

interface CodePreviewProps {
    colorScheme?: 'emerald' | 'violet' | 'indigo';
    icon?: React.ReactNode;
}

const colorMap = {
    emerald: {
        accent: 'text-emerald-400',
        keyword: 'bg-emerald-400/60',
        string: 'bg-teal-300/50',
        func: 'bg-emerald-300/40',
        terminalBorder: 'border-emerald-500/30',
        cursor: 'bg-emerald-400',
        lineNum: 'text-emerald-600/40',
    },
    violet: {
        accent: 'text-violet-400',
        keyword: 'bg-violet-400/60',
        string: 'bg-purple-300/50',
        func: 'bg-violet-300/40',
        terminalBorder: 'border-violet-500/30',
        cursor: 'bg-violet-400',
        lineNum: 'text-violet-600/40',
    },
    indigo: {
        accent: 'text-indigo-400',
        keyword: 'bg-indigo-400/60',
        string: 'bg-blue-300/50',
        func: 'bg-indigo-300/40',
        terminalBorder: 'border-indigo-500/30',
        cursor: 'bg-indigo-400',
        lineNum: 'text-indigo-600/40',
    },
};

const codeLines = [
    [{ w: '28%', type: 'keyword' }, { w: '35%', type: 'func' }],
    [{ w: '15%', type: 'keyword' }, { w: '22%', type: 'string' }, { w: '18%', type: 'normal' }],
    [{ w: '20%', type: 'func' }, { w: '40%', type: 'string' }],
    [{ w: '10%', type: 'keyword' }, { w: '30%', type: 'normal' }],
    [{ w: '25%', type: 'func' }, { w: '15%', type: 'keyword' }],
];

const CodePreview: React.FC<CodePreviewProps> = ({ colorScheme = 'emerald', icon }) => {
    const c = colorMap[colorScheme];

    const getBlockColor = (type: string) => {
        switch (type) {
            case 'keyword': return c.keyword;
            case 'string': return c.string;
            case 'func': return c.func;
            default: return 'bg-white/20';
        }
    };

    return (
        <div className="w-full h-full bg-[#1a1b2e] flex flex-col relative overflow-hidden">
            {/* Editor tab bar */}
            <div className="flex items-center gap-1 px-3 py-1.5 bg-[#12131f] border-b border-white/5">
                <div className="flex gap-1 mr-2">
                    <div className="w-2 h-2 rounded-full bg-red-400/60" />
                    <div className="w-2 h-2 rounded-full bg-yellow-400/60" />
                    <div className="w-2 h-2 rounded-full bg-green-400/60" />
                </div>
                <div className="h-1.5 w-16 bg-white/10 rounded-full" />
            </div>

            {/* Code area */}
            <div className="flex-1 flex px-2 py-2 overflow-hidden">
                {/* Line numbers */}
                <div className={`flex flex-col gap-1.5 pr-2 border-r border-white/5 mr-2 text-[8px] font-mono ${c.lineNum}`}>
                    {codeLines.map((_, i) => (
                        <div key={i} className="h-2 flex items-center justify-end w-4">{i + 1}</div>
                    ))}
                </div>

                {/* Code blocks */}
                <div className="flex-1 flex flex-col gap-1.5">
                    {codeLines.map((line, lineIdx) => (
                        <div key={lineIdx} className="flex gap-1 items-center h-2">
                            {lineIdx === 1 && <div className="w-4" />}
                            {lineIdx === 2 && <div className="w-4" />}
                            {line.map((block, blockIdx) => (
                                <div
                                    key={blockIdx}
                                    className={`h-1.5 ${getBlockColor(block.type)} rounded-sm`}
                                    style={{ width: block.w }}
                                />
                            ))}
                            {lineIdx === 2 && (
                                <div className={`w-0.5 h-3 ${c.cursor} animate-pulse ml-0.5`} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Terminal / output panel */}
            <div className={`mx-2 mb-2 bg-black/40 rounded-md border ${c.terminalBorder} p-2`}>
                <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="text-[7px] text-white/30 font-mono uppercase tracking-wider">output</div>
                </div>
                <div className="flex items-center gap-1">
                    <span className={`text-[8px] font-mono ${c.accent}`}>&gt;</span>
                    <div className="h-1 w-16 bg-green-400/30 rounded-full" />
                    <div className="h-1 w-8 bg-white/10 rounded-full" />
                </div>
            </div>

            {/* Icon overlay */}
            {icon && (
                <div className="absolute top-2 right-2 opacity-15">
                    {icon}
                </div>
            )}
        </div>
    );
};

export default CodePreview;
