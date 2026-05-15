import React from 'react';
import { Folder, FileText, Cloud, Printer, AlertTriangle, Sparkles, CheckCircle2, Gamepad2, Database, Search, Lock, Eye, BrainCircuit, ShieldCheck, BarChart2, Monitor, Play, Send } from 'lucide-react';
import { STUDENT_DASHBOARD_COLORS } from '@/config/dashboardThemes';
import { MISSION_SCREENSHOTS, inferMissionPreviewConfig, missionTagFor } from '@/config/missionPreviewConfig';
import { Mission } from '@/utils/missionBuilder';

export const MissionPreviewVisual: React.FC<{ mission: Mission; index: number; isCompleted?: boolean }> = ({ mission, index, isCompleted }) => {
    const screenshot = MISSION_SCREENSHOTS[mission.id];
    const tag = missionTagFor(mission);

    if (screenshot) {
        return (
            <div
                className="relative aspect-[16/10] overflow-hidden"
                style={{ backgroundColor: STUDENT_DASHBOARD_COLORS.creamDeep }}
            >
                <img
                    src={screenshot}
                    alt=""
                    aria-hidden="true"
                    className="size-full object-cover"
                    loading="lazy"
                    decoding="async"
                />
                <span
                    className="absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-black text-white shadow-sm"
                    style={{ backgroundColor: tag.color }}
                >
                    {tag.label}
                </span>
                {isCompleted && (
                    <span
                        className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full text-white shadow-sm"
                        style={{ backgroundColor: STUDENT_DASHBOARD_COLORS.sage }}
                    >
                        <CheckCircle2 size={18} />
                    </span>
                )}
            </div>
        );
    }

    const preview = inferMissionPreviewConfig(mission);
    const motifOffset = `${8 + (index % 3) * 8}%`;

    const renderMotif = () => {
        switch (preview.kind) {
            case 'cloud':
                return (
                    <div className="grid h-full grid-cols-[0.9fr_1.1fr] gap-3">
                        <div className="space-y-2">
                            {['Nederlands', 'Wiskunde', 'Prive'].map((folder, itemIndex) => (
                                <div
                                    key={folder}
                                    className="flex items-center gap-2 rounded-xl px-2.5 py-2 shadow-sm"
                                    style={{
                                        backgroundColor: STUDENT_DASHBOARD_COLORS.paper,
                                        borderColor: STUDENT_DASHBOARD_COLORS.line,
                                        borderWidth: 1,
                                    }}
                                >
                                    <Folder size={16} fill="currentColor" fillOpacity={0.18} style={{ color: preview.accent }} />
                                    <span className="truncate text-[10px] font-black" style={{ color: STUDENT_DASHBOARD_COLORS.ink }}>
                                        {folder}
                                    </span>
                                    {itemIndex === 0 && <CheckCircle2 size={12} style={{ color: STUDENT_DASHBOARD_COLORS.sage }} className="ml-auto" />}
                                </div>
                            ))}
                        </div>
                        <div
                            className="relative rounded-2xl border p-3 shadow-sm"
                            style={{ borderColor: STUDENT_DASHBOARD_COLORS.line, backgroundColor: STUDENT_DASHBOARD_COLORS.paper }}
                        >
                            <Cloud size={36} style={{ color: preview.accent, opacity: 0.2 }} className="absolute right-3 top-3" />
                            {['boekverslag.docx', 'huiswerk.pdf', 'virus.exe'].map((file, itemIndex) => (
                                <div
                                    key={file}
                                    className="mb-2 flex items-center gap-2 rounded-lg px-2 py-1.5 text-[9px] font-bold shadow-sm"
                                    style={{ backgroundColor: STUDENT_DASHBOARD_COLORS.paper, color: STUDENT_DASHBOARD_COLORS.muted }}
                                >
                                    <span
                                        className="size-2 rounded-full"
                                        style={{ backgroundColor: itemIndex === 2 ? STUDENT_DASHBOARD_COLORS.coral : preview.accent }}
                                    />
                                    <span className="truncate">{file}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'document':
                return (
                    <div className="grid h-full grid-cols-[0.75fr_1.25fr] gap-3">
                        <div className="rounded-2xl bg-white/80 p-2 shadow-sm">
                            {['Kop 1', 'Arial', '12 pt', 'Wrap'].map((tool) => (
                                <div key={tool} className="mb-1.5 rounded-lg px-2 py-1 text-[9px] font-black text-white" style={{ backgroundColor: preview.accent }}>
                                    {tool}
                                </div>
                            ))}
                        </div>
                        <div className="rounded-xl p-3 shadow-md" style={{ backgroundColor: STUDENT_DASHBOARD_COLORS.paper }}>
                            <div className="mb-2 h-3 w-3/4 rounded-full" style={{ backgroundColor: preview.accent }} />
                            <div className="space-y-1.5">
                                <div className="h-1.5 w-full rounded" style={{ backgroundColor: `${STUDENT_DASHBOARD_COLORS.gold}70` }} />
                                <div className="h-1.5 w-11/12 rounded" style={{ backgroundColor: STUDENT_DASHBOARD_COLORS.line }} />
                                <div className="h-1.5 w-4/5 rounded" style={{ backgroundColor: STUDENT_DASHBOARD_COLORS.line }} />
                            </div>
                            <div className="mt-3 h-12 rounded-lg border border-dashed" style={{ borderColor: preview.accent, backgroundColor: preview.surface }} />
                        </div>
                    </div>
                );
            case 'slides':
                return (
                    <div className="grid h-full grid-cols-2 gap-3">
                        <div className="rounded-2xl p-3 shadow-sm" style={{ backgroundColor: STUDENT_DASHBOARD_COLORS.paper }}>
                            <div className="mb-2 h-3 w-3/4 rounded" style={{ backgroundColor: STUDENT_DASHBOARD_COLORS.gold }} />
                            <div className="space-y-1">
                                {[0, 1, 2, 3].map((line) => <div key={line} className="h-1.5 rounded" style={{ backgroundColor: STUDENT_DASHBOARD_COLORS.line }} />)}
                            </div>
                            <AlertTriangle size={18} className="mt-3" style={{ color: STUDENT_DASHBOARD_COLORS.coral }} />
                        </div>
                        <div className="rounded-2xl p-3 text-white shadow-sm" style={{ backgroundColor: preview.accent }}>
                            <div className="mb-2 h-3 w-2/3 rounded bg-white" />
                            <div className="grid grid-cols-2 gap-2">
                                <div className="h-10 rounded-lg bg-white/25" />
                                <div className="space-y-1">
                                    <div className="h-1.5 rounded bg-white/70" />
                                    <div className="h-1.5 rounded bg-white/50" />
                                    <div className="h-1.5 rounded bg-white/50" />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'print':
                return (
                    <div className="flex h-full items-center gap-4">
                        <div className="relative flex-1 rounded-2xl p-3 shadow-sm" style={{ backgroundColor: STUDENT_DASHBOARD_COLORS.paper }}>
                            <div className="mb-2 flex items-center gap-2">
                                <Printer size={22} style={{ color: preview.accent }} />
                                <span className="text-[10px] font-black" style={{ color: STUDENT_DASHBOARD_COLORS.ink }}>
                                    Printwachtrij
                                </span>
                            </div>
                            {['Document.pdf', 'Instellingen', 'Vrijgeven'].map((step, stepIndex) => (
                                <div
                                    key={step}
                                    className="mb-1.5 flex items-center gap-2 rounded-lg px-2 py-1.5 text-[9px] font-bold"
                                    style={{ backgroundColor: STUDENT_DASHBOARD_COLORS.cream, color: STUDENT_DASHBOARD_COLORS.muted }}
                                >
                                    <span className="flex size-4 items-center justify-center rounded-full text-[8px] text-white" style={{ backgroundColor: preview.accent }}>{stepIndex + 1}</span>
                                    {step}
                                </div>
                            ))}
                        </div>
                        <div className="h-24 w-16 rounded-[1rem] border-4 bg-white p-1 shadow-sm" style={{ borderColor: STUDENT_DASHBOARD_COLORS.ink }}>
                            <div className="h-full rounded-[0.65rem] p-1" style={{ backgroundColor: preview.surface }}>
                                <Send size={16} style={{ color: preview.accent }} />
                            </div>
                        </div>
                    </div>
                );
            case 'ai':
                return (
                    <div className="relative h-full">
                        <div className="absolute left-3 top-4 rounded-2xl px-3 py-2 shadow-sm" style={{ backgroundColor: STUDENT_DASHBOARD_COLORS.paper }}>
                            <p className="text-[9px] font-black" style={{ color: STUDENT_DASHBOARD_COLORS.ink }}>
                                Prompt
                            </p>
                            <div className="mt-1 h-1.5 w-24 rounded" style={{ backgroundColor: STUDENT_DASHBOARD_COLORS.line }} />
                        </div>
                        {[0, 1, 2, 3].map((node) => (
                            <span
                                key={node}
                                className="absolute flex size-10 items-center justify-center rounded-full border-4 border-white text-white shadow-sm"
                                style={{
                                    backgroundColor: preview.accent,
                                    left: `${20 + node * 17}%`,
                                    top: `${42 + (node % 2) * 16}%`,
                                }}
                            >
                                <Sparkles size={15} />
                            </span>
                        ))}
                        <div className="absolute bottom-3 right-3 rounded-2xl px-3 py-2 text-[10px] font-black shadow-sm" style={{ backgroundColor: STUDENT_DASHBOARD_COLORS.paper, color: STUDENT_DASHBOARD_COLORS.ink }}>
                            Output score 3/3
                        </div>
                    </div>
                );
            case 'game':
                return (
                    <div className="grid h-full grid-cols-[1.2fr_0.8fr] gap-3">
                        <div className="relative overflow-hidden rounded-2xl shadow-sm" style={{ backgroundColor: STUDENT_DASHBOARD_COLORS.ink }}>
                            <div className="absolute bottom-4 left-4 right-4 h-3 rounded-full" style={{ backgroundColor: STUDENT_DASHBOARD_COLORS.sage }} />
                            <div className="absolute left-8 top-8 size-7 rounded-lg" style={{ backgroundColor: STUDENT_DASHBOARD_COLORS.gold }} />
                            <div className="absolute right-8 top-10 size-8 rounded-full" style={{ backgroundColor: STUDENT_DASHBOARD_COLORS.coral }} />
                            <Play size={22} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white" fill="currentColor" />
                        </div>
                        <div className="space-y-2">
                            {['speed', 'gravity', 'score'].map((rule) => (
                                <div key={rule} className="rounded-xl px-2.5 py-2 text-[9px] font-black shadow-sm" style={{ backgroundColor: STUDENT_DASHBOARD_COLORS.paper, color: STUDENT_DASHBOARD_COLORS.ink }}>
                                    {rule}: <span style={{ color: preview.accent }}>edit</span>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'data':
                return (
                    <div className="grid h-full grid-cols-[1fr_0.9fr] gap-3">
                        <div className="rounded-2xl p-3 shadow-sm" style={{ backgroundColor: STUDENT_DASHBOARD_COLORS.paper }}>
                            <div className="mb-3 h-2 w-24 rounded" style={{ backgroundColor: preview.accent }} />
                            {[58, 84, 42, 70].map((height, barIndex) => (
                                <div key={barIndex} className="mb-2 flex items-center gap-2">
                                    <div className="h-2 rounded" style={{ width: `${height}%`, backgroundColor: barIndex % 2 ? STUDENT_DASHBOARD_COLORS.gold : preview.accent }} />
                                    <span className="text-[8px] font-bold" style={{ color: STUDENT_DASHBOARD_COLORS.muted }}>{height}</span>
                                </div>
                            ))}
                        </div>
                        <div className="rounded-2xl p-3 shadow-sm" style={{ backgroundColor: preview.accent }}>
                            <BarChart2 size={28} className="mb-3 text-white" />
                            <div className="rounded-lg px-2 py-1 text-[9px] font-black" style={{ backgroundColor: STUDENT_DASHBOARD_COLORS.paper, color: STUDENT_DASHBOARD_COLORS.ink }}>
                                inzicht gevonden
                            </div>
                        </div>
                    </div>
                );
            case 'security':
                return (
                    <div className="grid h-full grid-cols-[0.8fr_1.2fr] gap-3">
                        <div className="flex items-center justify-center rounded-2xl text-white shadow-sm" style={{ backgroundColor: preview.accent }}>
                            <ShieldCheck size={48} />
                        </div>
                        <div className="rounded-2xl p-3 shadow-sm" style={{ backgroundColor: STUDENT_DASHBOARD_COLORS.paper }}>
                            {['Risico', 'Bewijs', 'Actie'].map((item, itemIndex) => (
                                <div key={item} className="mb-2 flex items-center gap-2 rounded-lg px-2 py-1.5 text-[9px] font-black" style={{ backgroundColor: STUDENT_DASHBOARD_COLORS.cream, color: STUDENT_DASHBOARD_COLORS.ink }}>
                                    {itemIndex < 2 ? <CheckCircle2 size={12} style={{ color: STUDENT_DASHBOARD_COLORS.sage }} /> : <AlertTriangle size={12} style={{ color: STUDENT_DASHBOARD_COLORS.coral }} />}
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'code':
                return (
                    <div className="grid h-full grid-cols-[1.2fr_0.8fr] gap-3">
                        <div className="rounded-2xl p-3 font-mono text-[9px] text-white shadow-sm" style={{ backgroundColor: STUDENT_DASHBOARD_COLORS.ink }}>
                            <div className="mb-2" style={{ color: STUDENT_DASHBOARD_COLORS.gold }}>review.ts</div>
                            <div className="mb-1"><span style={{ color: STUDENT_DASHBOARD_COLORS.sage }}>+</span> check(input)</div>
                            <div className="mb-1"><span style={{ color: STUDENT_DASHBOARD_COLORS.coral }}>!</span> bug gevonden</div>
                            <div><span style={{ color: STUDENT_DASHBOARD_COLORS.teal }}>✓</span> fix getest</div>
                        </div>
                        <div className="space-y-2">
                            {['logica', 'test', 'kwaliteit'].map((item) => (
                                <div key={item} className="rounded-xl px-2 py-2 text-[9px] font-black shadow-sm" style={{ backgroundColor: STUDENT_DASHBOARD_COLORS.paper, color: STUDENT_DASHBOARD_COLORS.ink }}>{item}</div>
                            ))}
                        </div>
                    </div>
                );
            case 'media':
                return (
                    <div className="grid h-full grid-cols-3 gap-2">
                        {[0, 1, 2].map((tile) => (
                            <div key={tile} className="rounded-2xl p-2 shadow-sm" style={{ backgroundColor: STUDENT_DASHBOARD_COLORS.paper }}>
                                <div
                                    className="mb-2 h-16 rounded-xl"
                                    style={{
                                        backgroundColor: tile === 1 ? STUDENT_DASHBOARD_COLORS.gold : preview.accent,
                                        opacity: tile === 1 ? 0.75 : 1,
                                    }}
                                />
                                <div className="h-1.5 rounded" style={{ backgroundColor: STUDENT_DASHBOARD_COLORS.line }} />
                            </div>
                        ))}
                    </div>
                );
            default:
                return (
                    <div className="grid h-full grid-cols-3 gap-2">
                        {['Plan', 'Maak', 'Test'].map((column, columnIndex) => (
                            <div key={column} className="rounded-2xl p-2 shadow-sm" style={{ backgroundColor: STUDENT_DASHBOARD_COLORS.paper }}>
                                <p className="mb-2 text-[9px] font-black" style={{ color: STUDENT_DASHBOARD_COLORS.ink }}>{column}</p>
                                <div className="space-y-1.5">
                                    {[0, 1].map((card) => (
                                        <div key={card} className="h-7 rounded-lg" style={{ backgroundColor: columnIndex === card ? preview.accent : STUDENT_DASHBOARD_COLORS.line }} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                );
        }
    };

    return (
        <div
            className="relative aspect-[16/10] overflow-hidden p-4"
            style={{ background: `linear-gradient(135deg, ${preview.surface} 0%, ${STUDENT_DASHBOARD_COLORS.paper} 62%, ${STUDENT_DASHBOARD_COLORS.cream} 100%)` }}
            aria-hidden="true"
        >
            <div className="absolute -right-8 -top-8 size-32 rounded-full opacity-15" style={{ backgroundColor: preview.accent }} />
            <div className="absolute -bottom-10 size-28 rounded-full opacity-10" style={{ backgroundColor: preview.accent, left: motifOffset }} />

            <div className="relative z-10 flex h-full flex-col pt-7">
                <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-sm [&_svg]:size-6" style={{ backgroundColor: preview.accent }}>
                            {mission.icon}
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-black leading-tight" style={{ color: STUDENT_DASHBOARD_COLORS.ink }}>{preview.title}</p>
                            <p className="line-clamp-1 text-[10px] font-bold leading-tight" style={{ color: STUDENT_DASHBOARD_COLORS.muted }}>{preview.subtitle}</p>
                        </div>
                    </div>
                    {isCompleted && (
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full text-white shadow-sm" style={{ backgroundColor: STUDENT_DASHBOARD_COLORS.sage }}>
                            <CheckCircle2 size={16} />
                        </span>
                    )}
                </div>

                <div className="min-h-0 flex-1">
                    {renderMotif()}
                </div>

                <div className="mt-3 flex gap-1.5 overflow-hidden">
                    {preview.chips.slice(0, 3).map((chip) => (
                        <span
                            key={chip}
                            className="rounded-full px-2 py-1 text-[9px] font-black shadow-sm"
                            style={{ backgroundColor: STUDENT_DASHBOARD_COLORS.paper, color: STUDENT_DASHBOARD_COLORS.ink }}
                        >
                            {chip}
                        </span>
                    ))}
                </div>
            </div>

            <span
                className="absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-black text-white shadow-sm"
                style={{ backgroundColor: tag.color }}
            >
                {tag.label}
            </span>
        </div>
    );
};
