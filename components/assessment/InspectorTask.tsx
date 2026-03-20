
import React, { useState } from 'react';
import { InspectorTask as InspectorTaskType } from './types';
import { MousePointer2, AlertCircle, CheckCircle } from 'lucide-react';

interface Props {
    task: InspectorTaskType;
    onComplete: (success: boolean) => void;
}

export const InspectorTask: React.FC<Props> = ({ task, onComplete }) => {
    const [showFeedback, setShowFeedback] = useState<{ correct: boolean; message: string } | null>(null);
    const [clicks, setClicks] = useState<{ x: number; y: number }[]>([]);

    const handleHotspotClick = (hotspot: typeof task.hotspots[0]) => {
        if (showFeedback) return;

        setShowFeedback({
            correct: hotspot.correct,
            message: hotspot.feedback
        });

        if (hotspot.correct) {
            setTimeout(() => onComplete(true), 2500);
        } else {
            setTimeout(() => setShowFeedback(null), 2500);
        }
    };

    const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (showFeedback) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        setClicks([...clicks, { x, y }]);

        const hit = task.hotspots.find(h =>
            x >= h.x && x <= h.x + h.width &&
            y >= h.y && y <= h.y + h.height
        );

        if (hit) {
            setShowFeedback({
                correct: hit.correct,
                message: hit.feedback
            });

            if (hit.correct) {
                setTimeout(() => onComplete(true), 2500);
            } else {
                setTimeout(() => setShowFeedback(null), 2500);
            }
        } else {
            setShowFeedback({
                correct: false,
                message: 'Hier is niets aan de hand. Zoek verder!'
            });
            setTimeout(() => setShowFeedback(null), 1500);
        }
    };

    const isSpecialType = task.image.startsWith('SPECIAL:');

    const renderPromptComparison = () => {
        const badPrompt = task.hotspots.find(h => h.id === 'bad-prompt');
        const goodPrompt = task.hotspots.find(h => h.id === 'good-prompt');

        return (
            <div className="absolute inset-0 bg-white flex flex-col">
                {/* Header */}
                <div className="bg-lab-primary text-white px-4 py-2.5 flex items-center gap-2 shrink-0">
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">AI</div>
                    <span className="font-semibold text-sm">AI Verhalenmaker</span>
                    <span className="ml-auto text-white/60 text-xs">online</span>
                </div>
                <div className="flex-1 flex flex-col px-4 py-3 gap-3 overflow-hidden">
                    <p className="text-[11px] text-lab-textLight text-center">Twee leerlingen proberen een verhaal te maken met AI</p>

                    {/* Leerling 1 — slechte prompt (klikbaar) */}
                    <div className="flex flex-col items-end mt-1">
                        <span className="text-[10px] text-lab-textLight mb-1">Leerling 1</span>
                        <button
                            onClick={() => badPrompt && handleHotspotClick(badPrompt)}
                            className="bg-lab-primary text-white px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[50%] ml-auto text-left hover:ring-2 hover:ring-lab-primary/50 hover:ring-offset-2 transition-all cursor-pointer active:scale-95"
                        >
                            <p className="text-sm font-medium">Schrijf iets</p>
                        </button>
                    </div>
                    <div className="flex flex-col items-start">
                        <div className="bg-lab-bg border border-slate-200 px-3 py-2 rounded-2xl rounded-tl-sm max-w-[55%] shadow-sm">
                            <p className="text-[11px] text-lab-textLight italic">Eh... oké. Hier is iets: &quot;Er was eens iemand die iets deed.&quot; Ik weet niet precies wat je wilt...</p>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-2 my-0.5">
                        <div className="flex-1 border-t border-slate-200"></div>
                        <span className="text-[10px] text-lab-textLight font-medium">vs</span>
                        <div className="flex-1 border-t border-slate-200"></div>
                    </div>

                    {/* Leerling 2 — goede prompt (klikbaar) */}
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] text-lab-textLight mb-1">Leerling 2</span>
                        <button
                            onClick={() => goodPrompt && handleHotspotClick(goodPrompt)}
                            className="bg-lab-primary text-white px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[50%] ml-auto text-left hover:ring-2 hover:ring-lab-primary/50 hover:ring-offset-2 transition-all cursor-pointer active:scale-95"
                        >
                            <p className="text-sm font-medium">Schrijf een spannend verhaal over een robot die verdwaalt in een grote stad. Het verhaal is voor kinderen van 12 jaar. Maak het 200 woorden.</p>
                        </button>
                    </div>
                    <div className="flex flex-col items-start">
                        <div className="bg-lab-bg border border-slate-200 px-3 py-2 rounded-2xl rounded-tl-sm max-w-[55%] shadow-sm">
                            <p className="text-[11px] text-lab-textLight italic">ROBO-7 knipperde met zijn blauwe ogen. De hoge gebouwen leken op reusachtige vingers die naar de hemel wezen. &quot;Waar ben ik?&quot; piepte hij...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderChatbotError = () => {
        const wrongAnswer = task.hotspots.find(h => h.id === 'wrong-answer');
        const correctAnswer = task.hotspots.find(h => h.id === 'correct-answer');

        return (
            <div className="absolute inset-0 bg-white flex flex-col">
                {/* Header */}
                <div className="bg-lab-accent text-white px-4 py-2.5 flex items-center gap-2 shrink-0">
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">🤖</div>
                    <span className="font-semibold text-sm">SlimmeBot</span>
                    <span className="ml-auto text-white/60 text-xs">online</span>
                </div>
                <div className="flex-1 flex flex-col px-4 py-3 gap-3 overflow-hidden">
                    {/* Vraag */}
                    <div className="flex flex-col items-end mt-1">
                        <span className="text-[10px] text-lab-textLight mb-1">Leerling</span>
                        <div className="bg-lab-primary text-white px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[60%] ml-auto">
                            <p className="text-sm font-medium">Hoeveel planeten heeft ons zonnestelsel?</p>
                        </div>
                    </div>

                    {/* Antwoord 1 — FOUT (klikbaar) */}
                    <div className="flex flex-col items-start mt-1">
                        <span className="text-[10px] text-lab-textLight mb-1">SlimmeBot — Antwoord 1</span>
                        <button
                            onClick={() => wrongAnswer && handleHotspotClick(wrongAnswer)}
                            className="bg-lab-bg border border-slate-200 px-4 py-2.5 rounded-2xl rounded-tl-sm max-w-[55%] shadow-sm text-left hover:ring-2 hover:ring-lab-primary/50 hover:ring-offset-2 transition-all cursor-pointer active:scale-95"
                        >
                            <p className="text-sm text-lab-dark">Ons zonnestelsel heeft <strong>9 planeten</strong>! De negen planeten zijn: Mercurius, Venus, Aarde, Mars, Jupiter, Saturnus, Uranus, Neptunus en Pluto. 🪐</p>
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-2 my-0.5">
                        <div className="flex-1 border-t border-slate-200"></div>
                        <span className="text-[10px] text-lab-textLight font-medium">twee antwoorden</span>
                        <div className="flex-1 border-t border-slate-200"></div>
                    </div>

                    {/* Antwoord 2 — GOED (klikbaar) */}
                    <div className="flex flex-col items-start">
                        <span className="text-[10px] text-lab-textLight mb-1">SlimmeBot — Antwoord 2</span>
                        <button
                            onClick={() => correctAnswer && handleHotspotClick(correctAnswer)}
                            className="bg-lab-bg border border-slate-200 px-4 py-2.5 rounded-2xl rounded-tl-sm max-w-[55%] shadow-sm text-left hover:ring-2 hover:ring-lab-primary/50 hover:ring-offset-2 transition-all cursor-pointer active:scale-95"
                        >
                            <p className="text-sm text-lab-dark">Ons zonnestelsel heeft <strong>8 planeten</strong>: Mercurius, Venus, Aarde, Mars, Jupiter, Saturnus, Uranus en Neptunus. Pluto werd in 2006 herclassificeerd als dwergplaneet. 🌍</p>
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderBarChartMisleading = () => {
        const yAxisHotspot = task.hotspots.find(h => h.id === 'y-axis');
        const titleHotspot = task.hotspots.find(h => h.id === 'title');
        const barsHotspot = task.hotspots.find(h => h.id === 'bars');

        const data = [
            { label: '12-13', value: 85 },
            { label: '14-15', value: 92 },
            { label: '16-17', value: 95 },
            { label: '18+', value: 97 },
        ];
        // Y-axis starts at 60 — this is the misleading trick
        const yMin = 60;
        const yMax = 100;

        return (
            <div
                className="absolute inset-0 bg-white flex flex-col cursor-crosshair select-none"
                onClick={handleImageClick}
            >
                {/* Title area — hotspot */}
                <button
                    onClick={(e) => { e.stopPropagation(); titleHotspot && handleHotspotClick(titleHotspot); }}
                    className="pt-5 pb-2 px-6 text-center hover:bg-slate-50 transition-colors"
                >
                    <h3 className="text-base font-bold text-slate-800">Smartphonegebruik onder jongeren (%)</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Bron: Schoolkrant De Digitale Pen, 2026</p>
                </button>

                <div className="flex-1 flex px-4 pb-4 min-h-0">
                    {/* Y-axis area — hotspot (correct answer) */}
                    <button
                        onClick={(e) => { e.stopPropagation(); yAxisHotspot && handleHotspotClick(yAxisHotspot); }}
                        className="w-14 flex flex-col justify-between items-end pr-2 py-2 hover:bg-amber-50 rounded-l-lg transition-colors border border-transparent hover:border-amber-200"
                    >
                        {[100, 90, 80, 70, 60].map(v => (
                            <span key={v} className="text-[11px] font-mono text-slate-500 leading-none">{v}%</span>
                        ))}
                    </button>

                    {/* Chart bars area — hotspot */}
                    <button
                        onClick={(e) => { e.stopPropagation(); barsHotspot && handleHotspotClick(barsHotspot); }}
                        className="flex-1 flex items-end justify-around gap-3 px-4 py-2 border-l-2 border-b-2 border-slate-300 hover:bg-blue-50/30 rounded-r-lg transition-colors"
                    >
                        {data.map(d => {
                            const heightPct = ((d.value - yMin) / (yMax - yMin)) * 100;
                            return (
                                <div key={d.label} className="flex flex-col items-center flex-1 h-full justify-end">
                                    <span className="text-[11px] font-bold text-slate-600 mb-1">{d.value}%</span>
                                    <div
                                        className="w-full rounded-t-md bg-gradient-to-t from-lab-primary to-lab-primary/70 transition-all min-h-[8px]"
                                        style={{ height: `${heightPct}%` }}
                                    />
                                    <span className="text-[11px] text-slate-500 mt-2 font-medium">{d.label}</span>
                                </div>
                            );
                        })}
                    </button>
                </div>

                {/* Click markers */}
                {clicks.map((c, i) => (
                    <div
                        key={i}
                        className="absolute w-6 h-6 -ml-3 -mt-3 border-2 border-lab-primary rounded-full animate-ping motion-reduce:animate-none pointer-events-none"
                        style={{ left: `${c.x}%`, top: `${c.y}%` }}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-lab-bg text-lab-dark p-4">
            <div className="mb-4 text-center">
                <h2 className="text-2xl font-black text-lab-primary flex items-center justify-center gap-2">
                    <MousePointer2 /> {task.title}
                </h2>
                <p className="text-lab-textLight">{task.description}</p>
            </div>

            <div className="flex-1 relative flex items-center justify-center bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                {/* Simulated Slide/Image Area */}
                {isSpecialType ? (
                    <div className="relative w-full max-w-2xl aspect-[4/3]">
                        {task.image === 'SPECIAL:PROMPT_COMPARISON' && renderPromptComparison()}
                        {task.image === 'SPECIAL:CHATBOT_ERROR_DETECTION' && renderChatbotError()}
                        {task.image === 'SPECIAL:BAR_CHART_MISLEADING' && renderBarChartMisleading()}
                        {task.image === 'SPECIAL:BAD_SLIDE' && (
                            <div
                                className="relative w-full h-full cursor-crosshair"
                                onClick={handleImageClick}
                            >
                                <div className="absolute inset-0 bg-white p-8 flex flex-col pointer-events-none select-none overflow-hidden relative">
                                    <div className="absolute inset-0 bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-pink-500 via-red-500 to-yellow-500 opacity-20"></div>
                                    <h1 className="text-6xl font-bold mb-4 text-red-600 font-serif drop-shadow-md z-10" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' }}>
                                        MIJN SPREEKBEURT OVER KATTEN!!!
                                    </h1>
                                    <div className="bg-blue-100 p-4 border-4 border-blue-800 z-10 text-[10px] leading-tight text-blue-900 font-mono">
                                        {Array(35).fill("Katten zijn zoogdieren die behoren tot de familie van de katachtigen (Felidae). Ze worden al duizenden jaren als huisdier gehouden. Er zijn heel veel verschillende rassen, zoals de Siamees en de Pers. Katten houden van vis en melk, maar melk is eigenlijk niet goed voor ze. Ze slapen heel veel, wel 16 uur per dag! ").map((s, i) => (
                                            <span key={i}>{s}</span>
                                        ))}
                                    </div>
                                    <div className="absolute bottom-4 right-4 text-6xl rotate-12 z-10">🐱</div>
                                    <div className="absolute top-4 right-4 text-6xl -rotate-12 z-0 opacity-50">🍕</div>
                                </div>
                                {clicks.map((c, i) => (
                                    <div
                                        key={i}
                                        className="absolute w-6 h-6 -ml-3 -mt-3 border-2 border-lab-primary rounded-full animate-ping motion-reduce:animate-none pointer-events-none"
                                        style={{ left: `${c.x}%`, top: `${c.y}%` }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div
                        className="relative w-full max-w-2xl aspect-[4/3] bg-white cursor-crosshair group"
                        onClick={handleImageClick}
                    >
                        {!task.image.includes('http') && !task.image.startsWith('/') ? (
                            <div className="absolute inset-0 p-8 flex flex-col items-center justify-center text-lab-dark bg-lab-bg">
                                <h1 className="text-2xl font-bold mb-2 text-lab-textLight">AFBEELDING NIET GEVONDEN</h1>
                                <p className="text-lab-textLight mb-6 font-mono text-sm">{task.image}</p>
                                <p className="text-center text-lab-textLight text-sm max-w-md">
                                    Afbeeldingen worden niet automatisch gegenereerd. Gebruik alleen afbeeldingen uit de leerlingenomgeving.
                                </p>
                            </div>
                        ) : (
                            <img src={task.image} alt="Slide" className="w-full h-full object-cover pointer-events-none select-none" />
                        )}
                        {clicks.map((c, i) => (
                            <div
                                key={i}
                                className="absolute w-6 h-6 -ml-3 -mt-3 border-2 border-lab-primary rounded-full animate-ping motion-reduce:animate-none pointer-events-none"
                                style={{ left: `${c.x}%`, top: `${c.y}%` }}
                            />
                        ))}
                    </div>
                )}

                {/* Feedback Overlay */}
                {showFeedback && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 z-10">
                        <div className={`
                            p-6 rounded-2xl max-w-sm text-center shadow-2xl transform scale-100 animate-in zoom-in-95
                            ${showFeedback.correct ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}
                        `}>
                            {showFeedback.correct ? <CheckCircle size={48} className="mx-auto mb-2" /> : <AlertCircle size={48} className="mx-auto mb-2" />}
                            <h3 className="text-xl font-bold mb-1">{showFeedback.correct ? 'Goed gezien!' : 'Niet helemaal...'}</h3>
                            <p className="font-medium">{showFeedback.message}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Hint bar */}
            {isSpecialType && (
                <div className="mt-3 text-center">
                    <p className="text-xs text-lab-textLight">Klik op het element dat je wilt kiezen</p>
                </div>
            )}

            <div className="mt-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <p className="font-bold text-center text-lg text-lab-dark">{task.question}</p>
            </div>
        </div>
    );
};
