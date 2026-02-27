
import React, { useState, useEffect } from 'react';
import { AssessmentTask, AssessmentConfig } from './types';
import { InspectorTask } from './InspectorTask';
import { SimulatorTask } from './SimulatorTask';
import { RescuerTask } from './RescuerTask';
import { Trophy, RotateCcw, CheckCircle, XCircle, ClipboardCheck } from 'lucide-react';

interface Props {
    tasks: AssessmentTask[];
    config?: AssessmentConfig; // Optional for backward compatibility, though we'll use it
    onComplete: (passed: boolean, score: number) => void;
    onSubmitResult?: (result: {
        autoScore: number;
        teacherScore: number;
        finalScore: number;
        passed: boolean;
        teacherChecks: Record<string, boolean>;
        weights?: { autoWeight: number; teacherWeight: number };
    }) => void;
    onExit: () => void;
    minPassScore?: number;
    initialState?: any;
    onSave?: (data: any) => void;
}

export const AssessmentEngine: React.FC<Props> = ({ tasks, config, onComplete, onSubmitResult, onExit, minPassScore = 70, initialState, onSave }) => {
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [taskResults, setTaskResults] = useState<{ id: string; success: boolean; score: number }[]>([]);
    const [view, setView] = useState<'intro' | 'task' | 'summary'>('intro');
    const [showTransition, setShowTransition] = useState(false);
    const [teacherChecks, setTeacherChecks] = useState<Record<string, boolean>>({});

    const currentTask = tasks[currentTaskIndex];
    const totalPossibleScore = tasks.reduce((acc, t) => acc + t.xpReward, 0);
    const hybridConfig = config?.hybridAssessment;

    // Restore state
    useEffect(() => {
        if (initialState) {
            if (initialState.score !== undefined) setScore(initialState.score);
            if (initialState.teacherChecks) setTeacherChecks(initialState.teacherChecks);
            if (initialState.taskResults) {
                setTaskResults(initialState.taskResults);
                const count = initialState.taskResults.length;
                if (count >= tasks.length) {
                    setView('summary');
                } else {
                    setCurrentTaskIndex(count);
                    if (initialState.view === 'task' || count > 0) {
                        setView('task');
                    }
                }
            } else if (initialState.view === 'task') {
                setView('task');
            }
        }
    }, []);

    // Auto-save
    useEffect(() => {
        if (!onSave) return;
        if (view !== 'intro' || (initialState && initialState.view === 'task')) {
            onSave({
                score,
                taskResults,
                currentTaskIndex,
                view,
                teacherChecks
            });
        }
    }, [score, taskResults, currentTaskIndex, view, teacherChecks, onSave]);

    const handleStart = () => {
        setView('task');
    };

    const handleTaskComplete = (success: boolean) => {
        // Calculate score for this task
        const taskScore = success ? currentTask.xpReward : 0;

        setScore(prev => prev + taskScore);
        setTaskResults(prev => [...prev, { id: currentTask.id, success, score: taskScore }]);

        setShowTransition(true);

        setTimeout(() => {
            if (currentTaskIndex < tasks.length - 1) {
                setCurrentTaskIndex(prev => prev + 1);
                setShowTransition(false);
            } else {
                finishAssessment(score + taskScore); // Pass updated score
            }
        }, 1500);
    };

    const finishAssessment = (finalScore: number) => {
        setView('summary');
        const percentage = Math.round((finalScore / totalPossibleScore) * 100);
        const passed = percentage >= minPassScore;

        if (passed) {
            // Success effect could be added here
        }

        // Notify parent immediately or wait for user to click closing button?
        // Let's verify on button click in summary
    };

    const handleFinish = () => {
        const autoPercentage = Math.round((score / totalPossibleScore) * 100);

        if (!hybridConfig) {
            const passed = autoPercentage >= minPassScore;
            onComplete(passed, autoPercentage);
            return;
        }

        const checklist = hybridConfig.teacherChecklist || [];
        const requiredIncomplete = checklist.some((item) => item.required && !teacherChecks[item.id]);
        if (requiredIncomplete) return;

        const checkedCount = checklist.filter((item) => teacherChecks[item.id]).length;
        const teacherPercentage = checklist.length > 0
            ? Math.round((checkedCount / checklist.length) * 100)
            : 100;

        const finalPercentage = Math.round(
            autoPercentage * hybridConfig.autoWeight + teacherPercentage * hybridConfig.teacherWeight
        );
        const passed = finalPercentage >= minPassScore;
        onSubmitResult?.({
            autoScore: autoPercentage,
            teacherScore: teacherPercentage,
            finalScore: finalPercentage,
            passed,
            teacherChecks,
            weights: {
                autoWeight: hybridConfig.autoWeight,
                teacherWeight: hybridConfig.teacherWeight
            }
        });
        onComplete(passed, finalPercentage);
    };

    // Render Current Task Type
    const renderTask = () => {
        switch (currentTask.type) {
            case 'inspector':
                return <InspectorTask task={currentTask} onComplete={handleTaskComplete} />;
            case 'simulator':
                return <SimulatorTask task={currentTask} onComplete={handleTaskComplete} />;
            case 'rescuer':
                return <RescuerTask task={currentTask} onComplete={handleTaskComplete} />;
            default:
                return <div>Unknown Task Type</div>;
        }
    };

    if (view === 'intro') {
        return (
            <div className="w-full h-full bg-slate-900 overflow-y-auto text-white text-center">
            <div className="min-h-full flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-slate-800 rounded-3xl p-8 shadow-2xl border-4 border-slate-700 animate-in zoom-in-95">
                    <div className={`w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center text-4xl shadow-lg transform rotate-3 ${config?.themeColor ? `bg-${config.themeColor}-500 text-white` : 'bg-lab-primary text-white'}`}>
                        {config?.introIcon || '🛠️'}
                    </div>
                    <h1 className="text-3xl font-black mb-4">{config?.title || 'Praktijk Test'}</h1>
                    <div className="text-slate-300 mb-8 leading-relaxed">
                        {config?.introText || (
                            <p>
                                In plaats van saaie vragen ga je nu echt aan de slag.
                                Je krijgt <strong>{tasks.length} opdrachten</strong> waarin je moet laten zien wat je kunt.
                            </p>
                        )}
                    </div>

                    <div className="space-y-4 mb-8 text-left bg-slate-900/50 p-4 rounded-xl">
                        <div className="flex items-center gap-3 text-sm font-bold text-slate-400">
                            <span className="w-6 h-6 rounded bg-indigo-500/20 text-indigo-400 flex items-center justify-center">1</span>
                            Fouten opsporen
                        </div>
                        <div className="flex items-center gap-3 text-sm font-bold text-slate-400">
                            <span className="w-6 h-6 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center">2</span>
                            Bureaublad Simulator
                        </div>
                        <div className="flex items-center gap-3 text-sm font-bold text-slate-400">
                            <span className="w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center">3</span>
                            Klasgenoten Helpen
                        </div>
                    </div>
                    {hybridConfig && (
                        <div className="mb-8 rounded-xl border border-indigo-400/30 bg-indigo-500/10 p-4 text-left">
                            <p className="text-xs font-black uppercase tracking-widest text-indigo-300 mb-2">Hybride Beoordeling</p>
                            <p className="text-sm text-slate-200 leading-relaxed">
                                AI beoordeelt {Math.round(hybridConfig.autoWeight * 100)}% automatisch. De docent beoordeelt
                                {' '}{Math.round(hybridConfig.teacherWeight * 100)}% op jouw echte product en inlevering.
                            </p>
                        </div>
                    )}

                    <button
                        onClick={handleStart}
                        className="w-full py-4 bg-gradient-to-r from-lab-primary to-indigo-600 rounded-xl font-black text-xl shadow-xl hover:scale-105 transition-transform active:scale-95"
                    >
                        START DE MISSIE
                    </button>
                </div>
            </div>
            </div>
        );
    }

    if (view === 'summary') {
        const autoPercentage = Math.round((score / totalPossibleScore) * 100);
        const checklist = hybridConfig?.teacherChecklist || [];
        const checkedCount = checklist.filter((item) => teacherChecks[item.id]).length;
        const teacherPercentage = checklist.length > 0
            ? Math.round((checkedCount / checklist.length) * 100)
            : 100;
        const finalPercentage = hybridConfig
            ? Math.round(autoPercentage * hybridConfig.autoWeight + teacherPercentage * hybridConfig.teacherWeight)
            : autoPercentage;
        const passed = finalPercentage >= minPassScore;
        const hasMissingRequired = hybridConfig
            ? checklist.some((item) => item.required && !teacherChecks[item.id])
            : false;

        return (
            <div className="w-full h-full bg-slate-900 overflow-y-auto text-white text-center">
            <div className="min-h-full flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-slate-800 rounded-3xl p-8 shadow-2xl border-4 border-slate-700 animate-in zoom-in-95">
                    <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center border-4 ${passed ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-red-500/20 border-red-500 text-red-400'}`}>
                        {passed ? <Trophy size={48} /> : <XCircle size={48} />}
                    </div>

                    <h1 className="text-3xl font-black mb-2">{passed ? 'Missie Voltooid!' : 'Helaas...'}</h1>
                    <p className={`text-xl font-bold mb-8 ${passed ? 'text-emerald-400' : 'text-red-400'}`}>
                        Score: {finalPercentage}%
                    </p>

                    {hybridConfig ? (
                        <div className="mb-6 rounded-xl border border-indigo-400/30 bg-indigo-500/10 p-4 text-left">
                            <div className="flex items-center gap-2 text-indigo-300 font-black text-xs uppercase tracking-widest mb-2">
                                <ClipboardCheck size={14} /> Hybride score-opbouw
                            </div>
                            <p className="text-sm text-slate-200">
                                AI automatisch: <strong>{autoPercentage}%</strong> ({Math.round(hybridConfig.autoWeight * 100)}%)
                            </p>
                            <p className="text-sm text-slate-200">
                                Docentcheck: <strong>{teacherPercentage}%</strong> ({Math.round(hybridConfig.teacherWeight * 100)}%)
                            </p>
                            {hybridConfig.teacherInstructions && (
                                <p className="text-xs text-slate-300 mt-2 leading-relaxed">{hybridConfig.teacherInstructions}</p>
                            )}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-300 mb-6">
                            AI automatisch: {autoPercentage}% ({score}/{totalPossibleScore} XP)
                        </p>
                    )}

                    {hybridConfig && checklist.length > 0 && (
                        <div className="space-y-2 mb-6 text-left">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Docent validatie</p>
                            {checklist.map((item) => (
                                <label key={item.id} className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-xl border border-slate-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={!!teacherChecks[item.id]}
                                        onChange={(e) => setTeacherChecks((prev) => ({ ...prev, [item.id]: e.target.checked }))}
                                        className="mt-1"
                                    />
                                    <span className="text-sm text-slate-200 leading-relaxed">
                                        {item.label} {item.required && <span className="text-amber-400">(verplicht)</span>}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}

                    <div className="space-y-2 mb-8">
                        {tasks.map((task) => {
                            const result = taskResults.find(r => r.id === task.id);
                            return (
                                <div key={task.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-700">
                                    <span className="text-sm font-bold text-slate-300">{task.title}</span>
                                    {result?.success
                                        ? <CheckCircle size={16} className="text-emerald-400" />
                                        : <XCircle size={16} className="text-red-400" />
                                    }
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex gap-3">
                        {hybridConfig ? (
                            <button
                                onClick={handleFinish}
                                disabled={hasMissingRequired}
                                className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-600 disabled:text-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-black text-lg shadow-lg transition-all active:scale-95"
                            >
                                {hasMissingRequired ? 'Wacht op docentcheck' : 'Definitief beoordelen'}
                            </button>
                        ) : passed ? (
                            <button
                                onClick={handleFinish}
                                className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-black text-lg shadow-lg transition-all active:scale-95"
                            >
                                Terug naar Dashboard
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={onExit}
                                    className="flex-1 py-4 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl font-bold shadow-lg transition-all"
                                >
                                    Stoppen
                                </button>
                                <button
                                    onClick={() => window.location.reload()} // Quick restart hack or implement reset prop
                                    className="flex-1 py-4 bg-amber-500 hover:bg-amber-400 text-white rounded-xl font-black shadow-lg transition-all"
                                >
                                    <RotateCcw className="inline mr-2" /> Opnieuw
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full relative overflow-hidden">
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-slate-900 z-50">
                <div
                    className="h-full bg-lab-primary transition-all duration-500"
                    style={{ width: `${((currentTaskIndex) / tasks.length) * 100}%` }}
                />
            </div>

            {/* Task Render */}
            <div className={`w-full h-full transition-opacity duration-300 ${showTransition ? 'opacity-0' : 'opacity-100'}`}>
                {renderTask()}
            </div>

            {/* Exit Button */}
            <button onClick={onExit} className="absolute top-4 right-4 p-2 bg-slate-900/50 text-slate-400 rounded-lg hover:bg-slate-800 hover:text-white transition-colors z-50">
                <XCircle size={20} />
            </button>
        </div>
    );
};
