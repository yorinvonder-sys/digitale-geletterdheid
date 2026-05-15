
import React, { useState } from 'react';
import { ClassifierTask as ClassifierTaskType } from './types';
import { MessageSquare, UserCircle, ThumbsUp, ThumbsDown, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

interface Props {
    task: ClassifierTaskType;
    onComplete: (success: boolean) => void;
}

type Judgment = 'good' | 'bad';

interface OptionState {
    judgment: Judgment | null;
    revealed: boolean;
}

export const ClassifierTask: React.FC<Props> = ({ task, onComplete }) => {
    const [optionStates, setOptionStates] = useState<Record<string, OptionState>>(
        Object.fromEntries(task.options.map(o => [o.id, { judgment: null, revealed: false }]))
    );
    const [allDone, setAllDone] = useState(false);

    const goodLabel = task.goodLabel || 'Goed advies';
    const badLabel = task.badLabel || 'Slecht advies';

    const handleJudge = (optionId: string, judgment: Judgment) => {
        if (optionStates[optionId].revealed) return;

        const newStates = {
            ...optionStates,
            [optionId]: { judgment, revealed: true }
        };
        setOptionStates(newStates);

        // Check if all are answered
        const allRevealed = task.options.every(o => newStates[o.id].revealed);
        if (allRevealed) {
            setAllDone(true);
        }
    };

    const getCorrectCount = () => {
        return task.options.filter(o => {
            const state = optionStates[o.id];
            if (!state.revealed || !state.judgment) return false;
            const judgedAsGood = state.judgment === 'good';
            return judgedAsGood === o.correct;
        }).length;
    };

    const handleFinish = () => {
        const correctCount = getCorrectCount();
        const minRequired = task.minCorrect ?? task.options.length;
        onComplete(correctCount >= minRequired);
    };

    const isCorrectJudgment = (optionId: string): boolean => {
        const option = task.options.find(o => o.id === optionId)!;
        const state = optionStates[optionId];
        if (!state.revealed || !state.judgment) return false;
        return (state.judgment === 'good') === option.correct;
    };

    return (
        <div className="flex flex-col h-full bg-lab-bg text-lab-dark p-4">
            {/* Header */}
            <div className="mb-4 text-center">
                <h2 className="text-2xl font-black text-lab-primary flex items-center justify-center gap-2">
                    <UserCircle /> {task.title}
                </h2>
                <p className="text-lab-textLight">{task.description}</p>
            </div>

            <div className="flex-1 flex gap-4 min-h-0 overflow-hidden">
                {/* Left: Chat / Scenario */}
                <div className="w-1/3 flex flex-col gap-4">
                    <div className="bg-white p-4 rounded-xl border border-lab-line shadow-sm flex-1">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-lab-secondary rounded-full flex items-center justify-center font-bold text-xl text-white">
                                {task.npcName.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-lab-dark">{task.npcName}</h3>
                                <span className="text-xs text-lab-textLight">Klasgenoot</span>
                            </div>
                        </div>
                        <div className="bg-lab-bg p-4 rounded-xl rounded-tl-none relative border border-lab-line">
                            <MessageSquare className="absolute -top-3 -left-2 text-lab-muted fill-current" size={24} transform="scale(-1, 1)" />
                            <p className="text-lab-text leading-relaxed italic">"{task.scenario}"</p>
                        </div>

                        {/* Score indicator when all done */}
                        {allDone && (
                            <div className="mt-4 p-3 rounded-xl bg-lab-bg border border-lab-line text-center">
                                <p className="text-sm font-bold text-lab-text">
                                    {getCorrectCount()} van {task.options.length} goed
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Option cards */}
                <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1">
                    <h4 className="font-bold text-lab-textLight uppercase text-xs tracking-wider">
                        Beoordeel elk advies:
                    </h4>

                    {task.options.map((option) => {
                        const state = optionStates[option.id];
                        const correct = state.revealed ? isCorrectJudgment(option.id) : null;

                        return (
                            <div
                                key={option.id}
                                className={`bg-white rounded-xl border shadow-sm transition-all ${
                                    state.revealed
                                        ? correct
                                            ? 'border-lab-sage bg-lab-sage/50'
                                            : 'border-lab-coral bg-lab-coral/50'
                                        : 'border-lab-line'
                                }`}
                            >
                                {/* Statement */}
                                <div className="px-4 pt-4 pb-2">
                                    <p className="text-sm font-medium text-lab-dark leading-relaxed">
                                        {option.text}
                                    </p>
                                </div>

                                {/* Buttons or feedback */}
                                {!state.revealed ? (
                                    <div className="flex gap-2 px-4 pb-4">
                                        <button
                                            onClick={() => handleJudge(option.id, 'good')}
                                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-lab-sage bg-lab-sage hover:bg-lab-sage hover:text-white text-white font-bold text-sm transition-colors active:scale-95"
                                        >
                                            <ThumbsUp size={16} /> {goodLabel}
                                        </button>
                                        <button
                                            onClick={() => handleJudge(option.id, 'bad')}
                                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-lab-coral bg-lab-coral hover:bg-lab-coral hover:text-white text-white font-bold text-sm transition-colors active:scale-95"
                                        >
                                            <ThumbsDown size={16} /> {badLabel}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="px-4 pb-4">
                                        <div className={`flex items-start gap-2 p-3 rounded-lg text-sm leading-relaxed ${
                                            correct
                                                ? 'bg-lab-sage/80 text-lab-sage'
                                                : 'bg-lab-coral/80 text-lab-coral'
                                        }`}>
                                            {correct
                                                ? <CheckCircle size={16} className="mt-0.5 shrink-0" />
                                                : <XCircle size={16} className="mt-0.5 shrink-0" />
                                            }
                                            <span>{option.feedback}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {/* Finish button */}
                    {allDone && (
                        <button
                            onClick={handleFinish}
                            className="mt-2 py-3 bg-lab-primary hover:bg-lab-primaryDark text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
                        >
                            <ArrowRight size={18} /> Volgende opdracht
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
