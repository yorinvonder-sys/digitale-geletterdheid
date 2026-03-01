
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

    const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (showFeedback) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        setClicks([...clicks, { x, y }]);

        // Check if click hits a hotspot
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
                setTimeout(() => onComplete(true), 2000);
            } else {
                // Incorrect hotspot hit
                setTimeout(() => setShowFeedback(null), 2000);
            }
        } else {
            // Missed everything
            setShowFeedback({
                correct: false,
                message: 'Hier is niets aan de hand. Zoek verder!'
            });
            setTimeout(() => setShowFeedback(null), 1500);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-900 text-white p-4">
            <div className="mb-4 text-center">
                <h2 className="text-2xl font-black text-amber-400 flex items-center justify-center gap-2">
                    <MousePointer2 /> {task.title}
                </h2>
                <p className="text-slate-300">{task.description}</p>
            </div>

            <div className="flex-1 relative flex items-center justify-center bg-slate-800 rounded-2xl overflow-hidden border-2 border-slate-700">
                {/* Simulated Slide/Image Area */}
                <div
                    className="relative w-full max-w-2xl aspect-[4/3] bg-white cursor-crosshair group"
                    onClick={handleImageClick}
                >
                    {/* Native Bad Slide Component */}
                    {task.image === 'SPECIAL:BAD_SLIDE' ? (
                        <div className="absolute inset-0 bg-white p-8 flex flex-col pointer-events-none select-none overflow-hidden relative group-hover:bg-slate-50 transition-colors">
                            {/* Terrible Background */}
                            <div className="absolute inset-0 bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-pink-500 via-red-500 to-yellow-500 opacity-20"></div>

                            {/* Header - Too big, Comic Sans, Red */}
                            <h1 className="text-6xl font-bold mb-4 text-red-600 font-serif drop-shadow-md z-10" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' }}>
                                MIJN SPREEKBEURT OVER KATTEN!!!
                            </h1>

                            {/* The "Wall of Text" - The error target */}
                            <div className="bg-blue-100 p-4 border-4 border-blue-800 z-10 text-[10px] leading-tight text-blue-900 font-mono">
                                {Array(35).fill("Katten zijn zoogdieren die behoren tot de familie van de katachtigen (Felidae). Ze worden al duizenden jaren als huisdier gehouden. Er zijn heel veel verschillende rassen, zoals de Siamees en de Pers. Katten houden van vis en melk, maar melk is eigenlijk niet goed voor ze. Ze slapen heel veel, wel 16 uur per dag! ").map((s, i) => (
                                    <span key={i}>{s}</span>
                                ))}
                            </div>

                            {/* Clashing Images */}
                            <div className="absolute bottom-4 right-4 text-6xl rotate-12 z-10">🐱</div>
                            <div className="absolute top-4 right-4 text-6xl -rotate-12 z-0 opacity-50">🍕</div>
                        </div>

                    ) : task.image === 'SPECIAL:PROMPT_COMPARISON' ? (
                        <div className="absolute inset-0 bg-slate-50 pointer-events-none select-none overflow-hidden flex flex-col">
                            <div className="bg-purple-600 text-white px-4 py-2 flex items-center gap-2 shrink-0">
                                <div className="w-6 h-6 rounded-full bg-purple-400 flex items-center justify-center text-xs font-bold">AI</div>
                                <span className="font-semibold text-sm">AI Verhalenmaker</span>
                                <span className="ml-auto text-purple-200 text-xs">online</span>
                            </div>
                            <div className="flex-1 flex flex-col px-4 py-3 gap-2 overflow-hidden">
                                <p className="text-[10px] text-slate-400 text-center">Twee leerlingen proberen een verhaal te maken met AI</p>
                                <div className="flex flex-col items-end mt-1">
                                    <span className="text-[9px] text-slate-400 mb-0.5">Leerling 1</span>
                                    <div className="bg-blue-500 text-white px-3 py-2 rounded-2xl rounded-tr-sm max-w-[44%] ml-auto">
                                        <p className="text-xs font-medium">Schrijf iets</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-start">
                                    <div className="bg-white border border-slate-200 px-3 py-2 rounded-2xl rounded-tl-sm max-w-[50%] shadow-sm">
                                        <p className="text-[10px] text-slate-600 italic">Eh... oké. Hier is iets: &quot;Er was eens iemand die iets deed.&quot; Ik weet niet precies wat je wilt...</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 my-1">
                                    <div className="flex-1 border-t border-slate-200"></div>
                                    <span className="text-[9px] text-slate-300">vs</span>
                                    <div className="flex-1 border-t border-slate-200"></div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[9px] text-slate-400 mb-0.5">Leerling 2</span>
                                    <div className="bg-blue-500 text-white px-3 py-2 rounded-2xl rounded-tr-sm max-w-[44%] ml-auto">
                                        <p className="text-xs font-medium">Schrijf een spannend verhaal over een robot die verdwaalt in een grote stad. Het verhaal is voor kinderen van 12 jaar. Maak het 200 woorden.</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-start">
                                    <div className="bg-white border border-slate-200 px-3 py-2 rounded-2xl rounded-tl-sm max-w-[50%] shadow-sm">
                                        <p className="text-[10px] text-slate-600 italic">ROBO-7 knipperde met zijn blauwe ogen. De hoge gebouwen leken op reusachtige vingers die naar de hemel wezen. &quot;Waar ben ik?&quot; piepte hij...</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    ) : task.image === 'SPECIAL:CHATBOT_ERROR_DETECTION' ? (
                        <div className="absolute inset-0 bg-slate-50 pointer-events-none select-none overflow-hidden flex flex-col">
                            <div className="bg-green-600 text-white px-4 py-2 flex items-center gap-2 shrink-0">
                                <div className="w-6 h-6 rounded-full bg-green-400 flex items-center justify-center text-xs font-bold">🤖</div>
                                <span className="font-semibold text-sm">SlimmeBot</span>
                                <span className="ml-auto text-green-200 text-xs">online</span>
                            </div>
                            <div className="flex-1 flex flex-col px-4 py-3 gap-2 overflow-hidden">
                                <div className="flex flex-col items-end mt-1">
                                    <span className="text-[9px] text-slate-400 mb-0.5">Leerling</span>
                                    <div className="bg-blue-500 text-white px-3 py-2 rounded-2xl rounded-tr-sm max-w-[55%] ml-auto">
                                        <p className="text-xs font-medium">Hoeveel planeten heeft ons zonnestelsel?</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-start mt-2">
                                    <span className="text-[9px] text-slate-400 mb-0.5">SlimmeBot — Antwoord 1</span>
                                    <div className="bg-white border border-slate-200 px-3 py-2 rounded-2xl rounded-tl-sm max-w-[44%] shadow-sm">
                                        <p className="text-xs text-slate-700">Ons zonnestelsel heeft <strong>9 planeten</strong>! De negen planeten zijn: Mercurius, Venus, Aarde, Mars, Jupiter, Saturnus, Uranus, Neptunus en Pluto. 🪐</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 my-1">
                                    <div className="flex-1 border-t border-slate-200"></div>
                                    <span className="text-[9px] text-slate-300">twee antwoorden</span>
                                    <div className="flex-1 border-t border-slate-200"></div>
                                </div>
                                <div className="flex flex-col items-start">
                                    <span className="text-[9px] text-slate-400 mb-0.5">SlimmeBot — Antwoord 2</span>
                                    <div className="bg-white border border-slate-200 px-3 py-2 rounded-2xl rounded-tl-sm max-w-[44%] shadow-sm">
                                        <p className="text-xs text-slate-700">Ons zonnestelsel heeft <strong>8 planeten</strong>: Mercurius, Venus, Aarde, Mars, Jupiter, Saturnus, Uranus en Neptunus. Pluto werd in 2006 herclassificeerd als dwergplaneet. 🌍</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    ) : !task.image.includes('http') && !task.image.startsWith('/') ? (
                        <div className="absolute inset-0 p-8 flex flex-col items-center justify-center text-slate-900 bg-slate-100">
                            <h1 className="text-2xl font-bold mb-2 text-slate-400">AFBEELDING NIET GEVONDEN</h1>
                            <p className="text-slate-400 mb-6 font-mono text-sm">{task.image}</p>
                            <p className="text-center text-slate-500 text-sm max-w-md">
                                Afbeeldingen worden niet automatisch gegenereerd. Gebruik alleen afbeeldingen uit de leerlingenomgeving.
                            </p>
                        </div>
                    ) : (
                        <img src={task.image} alt="Slide" className="w-full h-full object-cover pointer-events-none select-none" />
                    )}

                    {/* Debug/Visualizer for Hotspots (Hidden in Prod, visible for now for testing) */}
                    {/* {task.hotspots.map(h => (
                        <div key={h.id} className="absolute border border-blue-500/30 bg-blue-500/10" style={{ left: `${h.x}%`, top: `${h.y}%`, width: `${h.width}%`, height: `${h.height}%` }} />
                    ))} */}

                    {clicks.map((c, i) => (
                        <div
                            key={i}
                            className="absolute w-6 h-6 -ml-3 -mt-3 border-2 border-amber-500 rounded-full animate-ping pointer-events-none"
                            style={{ left: `${c.x}%`, top: `${c.y}%` }}
                        />
                    ))}
                </div>

                {/* Feedback Overlay */}
                {showFeedback && (
                    <div className={`absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200`}>
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

            <div className="mt-4 bg-slate-800 p-4 rounded-xl border border-slate-700">
                <p className="font-bold text-center text-lg">{task.question}</p>
            </div>
        </div>
    );
};
