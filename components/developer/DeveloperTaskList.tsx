import React, { useState, useEffect } from 'react';
import { ParentUser } from '../../types';
import { 
    Plus, 
    Trash2, 
    CheckCircle2, 
    Circle, 
    AlertCircle, 
    Clock, 
    BookOpen,
    X,
    ChevronRight,
    Search,
    Filter,
    Loader2,
    CheckSquare,
    Flag,
    ExternalLink,
    Shield
} from 'lucide-react';
import { 
    subscribeToDevTasks, 
    addDevTask, 
    updateDevTask, 
    deleteDevTask, 
    DevTask,
    addDevMilestone,
    addDevPlanHistory,
    subscribeToDevSettings,
    updateDevSettings
} from '../../services/developerService';
import { 
    validateDeveloperTasks, 
    generateDeveloperPlan, 
    AIPlanProposal 
} from '../../services/developerAiService';

interface DeveloperTaskListProps {
    user: ParentUser;
}

export function DeveloperTaskList({ user }: DeveloperTaskListProps) {
    const [tasks, setTasks] = useState<DevTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

    // Form state
    const [newTitle, setNewTitle] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
    const [newStatus, setNewStatus] = useState<DevTask['status']>('pending');
    const [newDueDate, setNewDueDate] = useState('');
    const [newLearning, setNewLearning] = useState('');
    const [newEvidenceUrl, setNewEvidenceUrl] = useState('');
    const [newReflection, setNewReflection] = useState('');
    const [newDependencies, setNewDependencies] = useState<string>('');

    // AI Flow state
    const [isValidating, setIsValidating] = useState(false);
    const [isPlanning, setIsPlanning] = useState(false);
    const [aiProposal, setAiProposal] = useState<AIPlanProposal | null>(null);
    const [tweakPrompt, setTweakPrompt] = useState('');
    const [globalPolicy, setGlobalPolicy] = useState('');
    const [showSettings, setShowSettings] = useState(false);
    const [isAutoPlanning, setIsAutoPlanning] = useState(false);

    useEffect(() => {
        const unsubscribe = subscribeToDevSettings(user.uid, (settings) => {
            if (settings?.globalPolicy) {
                setGlobalPolicy(settings.globalPolicy);
            }
        });
        return () => unsubscribe();
    }, [user.uid]);

    const autoPlanTriggered = React.useRef(false);

    useEffect(() => {
        const unsubscribe = subscribeToDevTasks(user.uid, (fetchedTasks) => {
            setTasks(fetchedTasks);
            setLoading(false);

            // Trigger A: Init if empty and not already planning (only once per mount)
            if (fetchedTasks.length === 0 && !autoPlanTriggered.current && !isPlanning && !isAutoPlanning) {
                autoPlanTriggered.current = true;
                console.log("Trigger A: Empty task list detected, starting auto-planning...");
                handleAIPlanning(true);
            }
        });
        return () => unsubscribe();
    }, [user.uid]);

    // Trigger B: Document set change (simulated via manifest fetch)
    useEffect(() => {
        const checkManifest = async () => {
            try {
                const response = await fetch('/dev-docs/manifest.json');
                const manifest = await response.json();
                const manifestHash = JSON.stringify(manifest).length; // Simple hash
                const lastHash = localStorage.getItem(`dev-docs-hash-${user.uid}`);
                
                if (lastHash && parseInt(lastHash) !== manifestHash && !isPlanning && !isAutoPlanning) {
                    console.log("Trigger B: Document manifest changed, suggesting new tasks...");
                    handleAIPlanning(true);
                }
                localStorage.setItem(`dev-docs-hash-${user.uid}`, manifestHash.toString());
            } catch (err) {
                console.error("Failed to check manifest hash:", err);
            }
        };

        checkManifest();
    }, [user.uid]);

    const getDocumentContext = async () => {
        try {
            const response = await fetch('/dev-docs/manifest.json');
            const manifest = await response.json();
            const selectedDocs = manifest.slice(0, 5);
            
            const contextDocs = await Promise.all(selectedDocs.map(async (doc: any) => {
                if (doc.format === 'MD' || doc.format === 'HTML') {
                    try {
                        const contentResponse = await fetch(doc.path);
                        const content = await contentResponse.text();
                        return {
                            id: doc.id,
                            title: doc.title,
                            category: doc.category,
                            content: content.substring(0, 2000)
                        };
                    } catch (e) {
                        return { id: doc.id, title: doc.title, category: doc.category };
                    }
                }
                return { id: doc.id, title: doc.title, category: doc.category };
            }));
            
            return contextDocs;
        } catch (err) {
            console.error("Failed to get document context:", err);
            return [];
        }
    };

    const handleAIPlanning = async (isAuto = false) => {
        if (isPlanning || isAutoPlanning) return;
        
        if (isAuto) setIsAutoPlanning(true);
        else setIsPlanning(true);

        try {
            const documentContext = await getDocumentContext();
            const context = {
                currentTasks: tasks.map(t => ({ title: t.title, status: t.status, description: t.description })),
                recentLearnings: tasks.filter(t => t.learningNote).map(t => t.learningNote),
                documentContext,
                tweakPrompt,
                globalPolicy
            };
            
            console.log(`[DeveloperAI] Generating plan for user ${user.uid}`, { taskCount: tasks.length });
            const proposal = await generateDeveloperPlan(context);
            
            await addDevPlanHistory(user.uid, {
                proposal,
                status: 'proposed'
            });

                if (isAuto && tasks.length === 0 && proposal.tasks.length > 0) {
                    console.log("[DeveloperAI] Auto-applying initial plan for empty list...");
                    // Direct application for a smooth first-time experience
                    for (const task of proposal.tasks) {
                        await addDevTask(user.uid, { checked: false, ...task });
                    }
                    for (const milestone of proposal.milestones) {
                        await addDevMilestone(user.uid, milestone);
                    }
                    setAiProposal(null);
                
                await addDevPlanHistory(user.uid, {
                    proposal,
                    status: 'approved',
                    note: 'Auto-approved initial plan'
                });
            } else {
                setAiProposal(proposal);
                if (isAuto) {
                    console.log("[DeveloperAI] Auto-plan generated and ready for review.");
                }
            }
        } catch (error: any) {
            console.error("[DeveloperAI] Planning failure:", {
                uid: user.uid,
                status: error.status,
                message: error.message,
                details: error.details,
                isAuto
            });
            
            if (!isAuto) {
                const displayMessage = error.message || 'AI Planning mislukt door een onbekende fout.';
                alert(`AI Planning Fout\n\n${displayMessage}`);
            }
        } finally {
            setIsPlanning(false);
            setIsAutoPlanning(false);
        }
    };

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim()) return;

        try {
            await addDevTask(user.uid, {
                title: newTitle,
                description: newDesc,
                checked: false,
                priority: newPriority,
                status: newStatus,
                dueDate: newDueDate || undefined,
                learningNote: newLearning || undefined,
                dependencies: newDependencies ? newDependencies.split(',').map(s => s.trim()) : undefined,
                evidence: (newEvidenceUrl || newReflection) ? {
                    url: newEvidenceUrl || undefined,
                    reflection: newReflection || undefined,
                    aiValidationStatus: 'none'
                } : undefined
            });
            // Reset form
            setNewTitle('');
            setNewDesc('');
            setNewPriority('medium');
            setNewStatus('pending');
            setNewDueDate('');
            setNewLearning('');
            setNewEvidenceUrl('');
            setNewReflection('');
            setIsAdding(false);
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    const toggleTask = async (task: DevTask) => {
        if (!task.id) return;
        try {
            await updateDevTask(user.uid, task.id, { checked: !task.checked });
        } catch (error) {
            console.error("Error toggling task:", error);
        }
    };

    const deleteTask = async (taskId?: string) => {
        if (!taskId) return;
        if (!window.confirm('Weet je zeker dat je deze taak wilt verwijderen?')) return;
        try {
            await deleteDevTask(user.uid, taskId);
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const updateTaskStatus = async (taskId: string, status: DevTask['status']) => {
        try {
            await updateDevTask(user.uid, taskId, { 
                status,
                checked: status === 'completed'
            });
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const updateTaskEvidence = async (taskId: string, evidence: DevTask['evidence']) => {
        try {
            await updateDevTask(user.uid, taskId, { evidence });
        } catch (error) {
            console.error("Error updating evidence:", error);
        }
    };

    const filteredTasks = tasks
        .filter(t => {
            if (filter === 'pending') return !t.checked;
            if (filter === 'completed') return t.checked;
            return true;
        })
        .filter(t => 
            t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            t.description.toLowerCase().includes(searchQuery.toLowerCase())
        );

    const handleAIValidation = async () => {
        const completedTasks = tasks.filter(t => t.status === 'completed' && t.evidence);
        if (completedTasks.length === 0) {
            alert('Geen voltooide taken met bewijsmateriaal gevonden om te valideren.');
            return;
        }

        setIsValidating(true);
        try {
            const results = await validateDeveloperTasks(completedTasks);
            for (const result of results) {
                const task = tasks.find(t => t.id === result.taskId);
                if (task && task.evidence) {
                    await updateTaskEvidence(task.id!, {
                        ...task.evidence,
                        aiValidationStatus: result.status,
                        aiFeedback: result.feedback
                    });
                }
            }
            alert('AI Validatie voltooid!');
        } catch (error) {
            console.error("AI Validation error:", error);
            alert('AI Validatie mislukt.');
        } finally {
            setIsValidating(false);
        }
    };

    const rejectAIPlan = async () => {
        if (!aiProposal) return;
        try {
            await addDevPlanHistory(user.uid, {
                proposal: aiProposal,
                status: 'rejected'
            });
            setAiProposal(null);
            setTweakPrompt('');
        } catch (error) {
            console.error("Plan rejection error:", error);
        }
    };

    const approveAIPlan = async () => {
        if (!aiProposal) return;
        try {
            for (const task of aiProposal.tasks) {
                await addDevTask(user.uid, { checked: false, ...task });
            }
            for (const milestone of aiProposal.milestones) {
                await addDevMilestone(user.uid, milestone);
            }
            
            await addDevPlanHistory(user.uid, {
                proposal: aiProposal,
                status: 'approved'
            });

            setAiProposal(null);
            alert('AI Plan succesvol toegepast!');
        } catch (error) {
            console.error("Plan approval error:", error);
            alert('Fout bij toepassen van plan.');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-5xl">
            {/* Header / Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Zoek taken..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <select 
                        className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as any)}
                    >
                        <option value="all">Alle</option>
                        <option value="pending">Openstaand</option>
                        <option value="completed">Voltooid</option>
                    </select>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <button 
                        onClick={() => setShowSettings(!showSettings)}
                        className={`flex-1 md:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all ${
                            showSettings ? 'bg-slate-200 text-slate-800' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                        title="AI Beleid Instellingen"
                    >
                        <Filter size={18} />
                        Beleid
                    </button>
                    <button 
                        onClick={handleAIValidation}
                        disabled={isValidating}
                        className="flex-1 md:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl font-bold hover:bg-indigo-100 transition-all disabled:opacity-50"
                    >
                        {isValidating ? <Loader2 className="animate-spin" size={18} /> : <Shield size={18} />}
                        AI Check
                    </button>
                    <button 
                        onClick={() => handleAIPlanning(false)}
                        disabled={isPlanning || isAutoPlanning}
                        className="flex-1 md:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
                    >
                        {isPlanning || isAutoPlanning ? <Loader2 className="animate-spin" size={18} /> : <BookOpen size={18} />}
                        AI Plan
                    </button>
                    <div className="w-px h-10 bg-slate-200 mx-1 hidden md:block" />
                    <button 
                        onClick={() => setIsAdding(true)}
                        className="flex-1 md:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                    >
                        <Plus size={18} />
                        Taak
                    </button>
                </div>
            </div>

            {/* AI Policy & Tweak Prompt Settings */}
            {showSettings && (
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 animate-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                            <BookOpen size={16} className="text-indigo-500" />
                            AI Takenbeleid Instellingen
                        </h4>
                        <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-600">
                            <X size={18} />
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-between">
                                <span>Globaal Beleid (Permanent)</span>
                                <span className="text-indigo-400 text-[8px] border border-indigo-100 px-1.5 rounded-full lowercase font-medium">Blijft gelden</span>
                            </label>
                            <textarea 
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none min-h-[80px]"
                                placeholder="Bijv: Focus op security en GDPR in alle taken. Gebruik altijd Typescript voor codevoorbeelden."
                                value={globalPolicy}
                                onChange={e => setGlobalPolicy(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-between">
                                <span>Huidige Tweak Prompt (Eenmalig)</span>
                                <span className="text-amber-400 text-[8px] border border-amber-100 px-1.5 rounded-full lowercase font-medium">Alleen volgend plan</span>
                            </label>
                            <textarea 
                                className="w-full px-4 py-3 bg-amber-50/30 border border-amber-100/50 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 outline-none min-h-[80px]"
                                placeholder="Bijv: Maak dit plan specifiek voor de Almere College pilot. Voeg een extra taak toe voor data migratie."
                                value={tweakPrompt}
                                onChange={e => setTweakPrompt(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <div className="flex justify-end">
                        <button 
                            onClick={async () => {
                                try {
                                    await updateDevSettings(user.uid, { globalPolicy });
                                    setShowSettings(false);
                                } catch (err) {
                                    console.error("Failed to save settings:", err);
                                    alert("Opslaan mislukt.");
                                }
                            }}
                            className="text-xs font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-all"
                        >
                            Beleid opslaan
                        </button>
                    </div>
                </div>
            )}

            {/* Tasks Grid */}
            <div className="grid grid-cols-1 gap-4">
                {filteredTasks.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                            <CheckSquare size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Geen taken gevonden</h3>
                        <p className="text-slate-500 mb-6">Begin met het toevoegen van je eerste developer taak.</p>
                        
                        {aiProposal ? (
                            <button 
                                onClick={() => approveAIPlan()}
                                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                            >
                                Gebruik AI Voorstel
                            </button>
                        ) : (
                            <button 
                                onClick={() => handleAIPlanning(false)}
                                disabled={isPlanning || isAutoPlanning}
                                className="px-6 py-3 bg-indigo-50 text-indigo-600 rounded-xl font-bold hover:bg-indigo-100 transition-all"
                            >
                                {isPlanning || isAutoPlanning ? <Loader2 className="animate-spin" size={18} /> : 'Genereer Plan met AI'}
                            </button>
                        )}
                    </div>
                ) : (
                    filteredTasks.map((task) => (
                        <div 
                            key={task.id}
                            className={`group bg-white p-5 rounded-2xl border transition-all duration-300 flex gap-4 ${
                                task.checked ? 'border-slate-100 opacity-75' : 'border-slate-200 hover:border-indigo-300 hover:shadow-md'
                            }`}
                        >
                            <button 
                                onClick={() => toggleTask(task)}
                                className={`mt-1 transition-colors ${task.checked ? 'text-emerald-500' : 'text-slate-300 hover:text-indigo-500'}`}
                            >
                                {task.checked ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                            </button>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-4 mb-2">
                                    <h4 className={`font-bold text-lg truncate ${task.checked ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                                        {task.title}
                                    </h4>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <select 
                                            value={task.status}
                                            onChange={(e) => updateTaskStatus(task.id!, e.target.value as any)}
                                            className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full border transition-all outline-none ${
                                                task.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                task.status === 'in_progress' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                                task.status === 'blocked' ? 'bg-red-50 text-red-600 border-red-100' :
                                                task.status === 'waiting_external' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                                'bg-slate-50 text-slate-600 border-slate-100'
                                            }`}
                                        >
                                            <option value="pending">Wachten</option>
                                            <option value="in_progress">Bezig</option>
                                            <option value="blocked">Geblokkeerd</option>
                                            <option value="waiting_external">Extern</option>
                                            <option value="completed">Gereed</option>
                                        </select>
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                            task.priority === 'high' ? 'bg-red-50 text-red-600' :
                                            task.priority === 'medium' ? 'bg-amber-50 text-amber-600' :
                                            'bg-slate-50 text-slate-600'
                                        }`}>
                                            {task.priority}
                                        </span>
                                        <button 
                                            onClick={() => deleteTask(task.id)}
                                            className="p-1.5 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <p className={`text-sm mb-4 leading-relaxed ${task.checked ? 'text-slate-400' : 'text-slate-600'}`}>
                                    {task.description}
                                </p>

                                <div className="flex flex-wrap gap-4 items-center">
                                    {task.dueDate && (
                                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                            <Clock size={14} className="text-indigo-400" />
                                            Deadline: {new Date(task.dueDate).toLocaleDateString('nl-NL')}
                                        </div>
                                    )}
                                    {task.learningNote && (
                                        <div className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                                            <BookOpen size={14} />
                                            <span>Leerdoel: {task.learningNote}</span>
                                        </div>
                                    )}
                                </div>

                                {task.evidence && (
                                    <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bewijs & Reflectie</span>
                                            {task.evidence.aiValidationStatus && task.evidence.aiValidationStatus !== 'none' && (
                                                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                                                    task.evidence.aiValidationStatus === 'validated' ? 'bg-emerald-100 text-emerald-700' :
                                                    task.evidence.aiValidationStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                                                    'bg-amber-100 text-amber-700'
                                                }`}>
                                                    {task.evidence.aiValidationStatus === 'validated' ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
                                                    AI {task.evidence.aiValidationStatus}
                                                </div>
                                            )}
                                        </div>
                                        {task.evidence.url && (
                                            <a 
                                                href={task.evidence.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                                            >
                                                <ExternalLink size={14} />
                                                Bekijk resultaat
                                            </a>
                                        )}
                                        {task.evidence.reflection && (
                                            <p className="text-xs text-slate-500 italic leading-relaxed">
                                                "{task.evidence.reflection}"
                                            </p>
                                        )}
                                        {task.evidence.aiFeedback && (
                                            <div className="pt-2 border-t border-slate-200 mt-2">
                                                <p className="text-[10px] text-indigo-400 font-bold mb-1 uppercase">AI Feedback</p>
                                                <p className="text-[11px] text-slate-600">{task.evidence.aiFeedback}</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {!task.evidence && task.status === 'completed' && (
                                    <button 
                                        onClick={() => {
                                            const url = window.prompt('URL naar bewijs (optioneel):');
                                            const reflection = window.prompt('Korte reflectie (wat heb je gedaan/geleerd?):');
                                            if (url || reflection) {
                                                updateTaskEvidence(task.id!, {
                                                    url: url || undefined,
                                                    reflection: reflection || undefined,
                                                    aiValidationStatus: 'none'
                                                });
                                            }
                                        }}
                                        className="mt-4 flex items-center gap-2 text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-700 transition-colors"
                                    >
                                        <Plus size={12} />
                                        Voeg bewijs toe voor AI-check
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* AI Proposal Modal */}
            {aiProposal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                                    <BookOpen size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">AI Voorstel: Volgende Stap</h3>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Nieuwe taken en mijlpalen</p>
                                </div>
                            </div>
                            <button onClick={() => setAiProposal(null)} className="text-slate-400 hover:text-slate-600 p-2">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            {aiProposal.rationale && (
                                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                                        <AlertCircle size={12} />
                                        AI Rationale
                                    </p>
                                    <p className="text-xs text-amber-800 leading-relaxed italic">{aiProposal.rationale}</p>
                                </div>
                            )}

                            <div>
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Nieuwe Taken</h4>
                                <div className="space-y-3">
                                    {aiProposal.tasks.map((task, i) => (
                                        <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <div className="flex items-start justify-between gap-4 mb-1">
                                                <input 
                                                    className="font-bold text-slate-900 bg-transparent border-none p-0 focus:ring-0 w-full"
                                                    value={task.title}
                                                    onChange={e => {
                                                        const newTasks = [...aiProposal.tasks];
                                                        newTasks[i].title = e.target.value;
                                                        setAiProposal({...aiProposal, tasks: newTasks});
                                                    }}
                                                />
                                                <span className="px-2 py-0.5 bg-white border border-slate-200 rounded-full text-[9px] font-black text-slate-400 uppercase">{task.priority}</span>
                                            </div>
                                            <textarea 
                                                className="text-xs text-slate-500 bg-transparent border-none p-0 focus:ring-0 w-full min-h-[40px] resize-none"
                                                value={task.description}
                                                onChange={e => {
                                                    const newTasks = [...aiProposal.tasks];
                                                    newTasks[i].description = e.target.value;
                                                    setAiProposal({...aiProposal, tasks: newTasks});
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Nieuwe Mijlpalen</h4>
                                <div className="space-y-3">
                                    {aiProposal.milestones.map((ms, i) => (
                                        <div key={i} className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 flex gap-4">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-500 shrink-0 border border-indigo-100 shadow-sm">
                                                <Flag size={20} />
                                            </div>
                                            <div className="flex-1">
                                                <input 
                                                    className="font-bold text-slate-900 text-sm bg-transparent border-none p-0 focus:ring-0 w-full"
                                                    value={ms.title}
                                                    onChange={e => {
                                                        const newMilestones = [...aiProposal.milestones];
                                                        newMilestones[i].title = e.target.value;
                                                        setAiProposal({...aiProposal, milestones: newMilestones});
                                                    }}
                                                />
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{ms.phase}</span>
                                                    <span className="text-[10px] font-medium text-slate-400 italic">{new Date(ms.startDate).toLocaleDateString('nl-NL')} - {new Date(ms.endDate).toLocaleDateString('nl-NL')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                            <button 
                                onClick={rejectAIPlan}
                                className="flex-1 py-3 border border-slate-200 bg-white rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                            >
                                Nee, verwerpen
                            </button>
                            <button 
                                onClick={approveAIPlan}
                                className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                            >
                                Ja, toevoegen
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Task Modal */}
            {isAdding && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Nieuwe Taak</h3>
                            <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600 p-2">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleAddTask} className="p-6 space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Titel</label>
                                <input 
                                    autoFocus
                                    required
                                    type="text" 
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="Bijv: Pitch deck voor scholen afmaken"
                                    value={newTitle}
                                    onChange={e => setNewTitle(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Omschrijving</label>
                                <textarea 
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px]"
                                    placeholder="Wat moet er precies gebeuren?"
                                    value={newDesc}
                                    onChange={e => setNewDesc(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Prioriteit</label>
                                    <select 
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                        value={newPriority}
                                        onChange={e => setNewPriority(e.target.value as any)}
                                    >
                                        <option value="low">Laag</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">Hoog</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Status</label>
                                    <select 
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                        value={newStatus}
                                        onChange={e => setNewStatus(e.target.value as any)}
                                    >
                                        <option value="pending">Wachten</option>
                                        <option value="in_progress">Bezig</option>
                                        <option value="blocked">Geblokkeerd</option>
                                        <option value="waiting_external">Extern</option>
                                        <option value="completed">Gereed</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Deadline</label>
                                    <input 
                                        type="date" 
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                        value={newDueDate}
                                        onChange={e => setNewDueDate(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-indigo-500 uppercase tracking-widest flex items-center gap-2">
                                        <BookOpen size={14} />
                                        Leerdoel
                                    </label>
                                    <input 
                                        type="text" 
                                        className="w-full px-4 py-3 bg-indigo-50/50 border border-indigo-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="Wat leer je?"
                                        value={newLearning}
                                        onChange={e => setNewLearning(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Afhankelijkheden (Task IDs, komma-gescheiden)</label>
                                <input 
                                    type="text" 
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="Bijv: id1, id2"
                                    value={newDependencies}
                                    onChange={e => setNewDependencies(e.target.value)}
                                />
                            </div>

                            <div className="space-y-4 pt-2 border-t border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bewijs (Optioneel)</p>
                                <div className="space-y-2">
                                    <input 
                                        type="url" 
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="URL naar resultaat (bijv. GitHub, Doc)"
                                        value={newEvidenceUrl}
                                        onChange={e => setNewEvidenceUrl(e.target.value)}
                                    />
                                    <textarea 
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none min-h-[60px]"
                                        placeholder="Korte reflectie..."
                                        value={newReflection}
                                        onChange={e => setNewReflection(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button 
                                    type="button"
                                    onClick={() => setIsAdding(false)}
                                    className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                                >
                                    Annuleren
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                                >
                                    Opslaan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
