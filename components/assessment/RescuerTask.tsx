
import React, { useState } from 'react';
import { RescuerTask as RescuerTaskType, RescuerStep } from './types';
import { MessageSquare, ArrowRight, UserCircle, CheckCircle, RotateCcw } from 'lucide-react';

interface Props {
    task: RescuerTaskType;
    onComplete: (success: boolean) => void;
}

export const RescuerTask: React.FC<Props> = ({ task, onComplete }) => {
    const [selectedSteps, setSelectedSteps] = useState<RescuerStep[]>([]);
    const [result, setResult] = useState<'success' | 'fail' | null>(null);

    const availableSteps = task.availableSteps.filter(s => !selectedSteps.find(sel => sel.id === s.id));

    const handleSelectStep = (step: RescuerStep) => {
        if (result) return;
        setSelectedSteps(prev => [...prev, step]);
    };

    const handleRemoveStep = (stepIndex: number) => {
        if (result) return;
        setSelectedSteps(prev => prev.filter((_, i) => i !== stepIndex));
    };

    const checkSolution = () => {
        // Compare IDs
        const selectedIds = selectedSteps.map(s => s.id);
        const correctIds = task.correctSequence;

        if (JSON.stringify(selectedIds) === JSON.stringify(correctIds)) {
            setResult('success');
            setTimeout(() => onComplete(true), 1500);
        } else {
            setResult('fail');
        }
    };

    const handleReset = () => {
        setSelectedSteps([]);
        setResult(null);
    };

    return (
        <div className="flex flex-col h-full bg-slate-900 text-white p-4">
            <div className="mb-4 text-center">
                <h2 className="text-2xl font-black text-amber-400 flex items-center justify-center gap-2">
                    <UserCircle /> {task.title}
                </h2>
                <p className="text-slate-300">{task.description}</p>
            </div>

            <div className="flex-1 flex gap-4 min-h-0">
                {/* Left: Chat / Scenario */}
                <div className="w-1/3 flex flex-col gap-4">
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex-1">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center font-bold text-xl">
                                {task.npcName.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold">{task.npcName}</h3>
                                <span className="text-xs text-slate-400">Klasgenoot</span>
                            </div>
                        </div>
                        <div className="bg-slate-700/50 p-4 rounded-xl rounded-tl-none relative">
                            <MessageSquare className="absolute -top-3 -left-2 text-slate-700 fill-current" size={24} transform="scale(-1, 1)" />
                            <p className="text-slate-200 leading-relaxed italic">"{task.scenario}"</p>
                        </div>
                    </div>
                </div>

                {/* Right: Steps Builder */}
                <div className="flex-1 flex flex-col gap-4">

                    {/* Solution Area */}
                    <div className="flex-1 bg-slate-800 rounded-xl p-4 border-2 border-slate-700 flex flex-col">
                        <h4 className="font-bold text-slate-400 mb-2 uppercase text-xs tracking-wider">Jouw Oplossing (Sleep / Klik):</h4>

                        <div className="flex-1 space-y-2">
                            {selectedSteps.length === 0 && (
                                <div className="h-full flex items-center justify-center text-slate-500 text-sm border-2 border-dashed border-slate-700 rounded-xl">
                                    Selecteer stappen om de oplossing te bouwen
                                </div>
                            )}
                            {selectedSteps.map((step, index) => (
                                <div key={step.id} className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4">
                                    <div className="w-6 h-6 rounded-full bg-lab-primary flex items-center justify-center text-xs font-bold shadow-sm z-10">
                                        {index + 1}
                                    </div>
                                    <button
                                        onClick={() => handleRemoveStep(index)}
                                        disabled={!!result}
                                        className="flex-1 bg-indigo-600 hover:bg-red-500 hover:text-white text-left px-4 py-3 rounded-xl font-medium text-sm transition-colors shadow-md group"
                                    >
                                        <span className="group-hover:hidden">{step.text}</span>
                                        <span className="hidden group-hover:inline">Verwijderen</span>
                                    </button>
                                    {index < selectedSteps.length - 1 && (
                                        <div className="h-4 border-l-2 border-dashed border-slate-600 absolute ml-3 mt-10 -z-0" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Available Steps Pool */}
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 min-h-[140px]">
                        <h4 className="font-bold text-slate-400 mb-2 uppercase text-xs tracking-wider">Beschikbare Stappen:</h4>
                        <div className="flex flex-wrap gap-2">
                            {availableSteps.map(step => (
                                <button
                                    key={step.id}
                                    onClick={() => handleSelectStep(step)}
                                    disabled={!!result}
                                    className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold rounded-lg border border-slate-600 transition-colors shadow-sm active:scale-95"
                                >
                                    + {step.text}
                                </button>
                            ))}
                            {availableSteps.length === 0 && (
                                <span className="text-slate-500 text-xs italic">Geen stappen meer beschikbaar.</span>
                            )}
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleReset}
                            disabled={selectedSteps.length === 0 || !!result}
                            className="px-4 py-3 bg-slate-700 text-white font-bold rounded-xl hover:bg-slate-600 disabled:opacity-50 transition-colors"
                        >
                            <RotateCcw size={20} />
                        </button>
                        <button
                            onClick={checkSolution}
                            disabled={selectedSteps.length === 0 || !!result}
                            className={`
                                flex-1 py-3 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2
                                ${result === 'success' ? 'bg-emerald-500 text-white' : result === 'fail' ? 'bg-red-500 text-white' : 'bg-lab-primary text-white hover:bg-lab-primary/90'}
                            `}
                        >
                            {result === 'success' ? (
                                <> <CheckCircle /> Opgelost! </>
                            ) : result === 'fail' ? (
                                <> Helaas, probeer opnieuw! </>
                            ) : (
                                <> <ArrowRight /> Verstuur Oplossing </>
                            )}
                        </button>
                    </div>

                    {result === 'fail' && (
                        <div className="bg-red-500/20 text-red-200 px-4 py-2 rounded-xl text-center text-sm border border-red-500/50 animate-in shake">
                            Dat is niet de juiste volgorde of actie. Reset en probeer het nog eens!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
