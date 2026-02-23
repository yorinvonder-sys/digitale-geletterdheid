
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
