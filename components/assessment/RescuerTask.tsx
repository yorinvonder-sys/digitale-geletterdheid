
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
        <div className="flex flex-col h-full bg-lab-bg text-lab-dark p-4">
            <div className="mb-4 text-center">
                <h2 className="text-2xl font-black text-lab-primary flex items-center justify-center gap-2">
                    <UserCircle /> {task.title}
                </h2>
                <p className="text-lab-textLight">{task.description}</p>
            </div>

            <div className="flex-1 flex gap-4 min-h-0">
                {/* Left: Chat / Scenario */}
                <div className="w-1/3 flex flex-col gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex-1">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-lab-secondary rounded-full flex items-center justify-center font-bold text-xl text-white">
                                {task.npcName.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-lab-dark">{task.npcName}</h3>
                                <span className="text-xs text-lab-textLight">Klasgenoot</span>
                            </div>
                        </div>
                        <div className="bg-lab-bg p-4 rounded-xl rounded-tl-none relative border border-slate-200">
                            <MessageSquare className="absolute -top-3 -left-2 text-slate-300 fill-current" size={24} transform="scale(-1, 1)" />
                            <p className="text-lab-text leading-relaxed italic">"{task.scenario}"</p>
                        </div>
                    </div>
                </div>

                {/* Right: Steps Builder */}
                <div className="flex-1 flex flex-col gap-4">

                    {/* Solution Area */}
                    <div className="flex-1 bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col">
                        <h4 className="font-bold text-lab-textLight mb-2 uppercase text-xs tracking-wider">Jouw Oplossing (Sleep / Klik):</h4>

                        <div className="flex-1 space-y-2">
                            {selectedSteps.length === 0 && (
                                <div className="h-full flex items-center justify-center text-lab-textLight text-sm border-2 border-dashed border-slate-200 rounded-xl">
                                    Selecteer stappen om de oplossing te bouwen
                                </div>
                            )}
                            {selectedSteps.map((step, index) => (
                                <div key={step.id} className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4">
                                    <div className="w-6 h-6 rounded-full bg-lab-primary flex items-center justify-center text-xs font-bold text-white shadow-sm z-10">
                                        {index + 1}
                                    </div>
                                    <button
                                        onClick={() => handleRemoveStep(index)}
                                        disabled={!!result}
                                        className="flex-1 bg-lab-primary/10 border border-lab-primary/30 hover:bg-red-50 hover:border-red-300 hover:text-red-600 text-lab-dark text-left px-4 py-3 rounded-xl font-medium text-sm transition-colors shadow-sm group"
                                    >
                                        <span className="group-hover:hidden">{step.text}</span>
                                        <span className="hidden group-hover:inline">Verwijderen</span>
                                    </button>
                                    {index < selectedSteps.length - 1 && (
                                        <div className="h-4 border-l-2 border-dashed border-slate-300 absolute ml-3 mt-10 -z-0" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Available Steps Pool */}
                    <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm min-h-[140px]">
                        <h4 className="font-bold text-lab-textLight mb-2 uppercase text-xs tracking-wider">Beschikbare Stappen:</h4>
                        <div className="flex flex-wrap gap-2">
                            {availableSteps.map(step => (
                                <button
                                    key={step.id}
                                    onClick={() => handleSelectStep(step)}
                                    disabled={!!result}
                                    className="px-3 py-2 bg-lab-bg hover:bg-lab-primary/10 text-lab-text text-xs font-bold rounded-lg border border-slate-200 hover:border-lab-primary/40 transition-colors shadow-sm active:scale-95"
                                >
                                    + {step.text}
                                </button>
                            ))}
                            {availableSteps.length === 0 && (
                                <span className="text-lab-textLight text-xs italic">Geen stappen meer beschikbaar.</span>
                            )}
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleReset}
                            disabled={selectedSteps.length === 0 || !!result}
                            className="px-4 py-3 bg-white border border-slate-200 text-lab-text font-bold rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center shadow-sm"
                            aria-label="Oplossing resetten"
                        >
                            <RotateCcw size={20} />
                        </button>
                        <button
                            onClick={checkSolution}
                            disabled={selectedSteps.length === 0 || !!result}
                            className={`
                                flex-1 py-3 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2
                                ${result === 'success' ? 'bg-emerald-500 text-white' : result === 'fail' ? 'bg-red-500 text-white' : 'bg-lab-primary text-white hover:bg-lab-primaryDark'}
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
                        <div className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-center text-sm border border-red-200 animate-in shake motion-reduce:animate-none">
                            Dat is niet de juiste volgorde of actie. Reset en probeer het nog eens!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
