import React, { useState, useEffect } from 'react';
import { ParentUser } from '../../types';
import { 
    Plus, 
    Trash2, 
    Flag, 
    Calendar, 
    CheckCircle2, 
    Clock, 
    BookOpen,
    X,
    ChevronRight,
    Loader2,
    Map
} from 'lucide-react';
import { 
    subscribeToDevTimeline, 
    addDevMilestone, 
    updateDevMilestone, 
    deleteDevMilestone, 
    DevMilestone 
} from '../../services/developerService';

interface DeveloperTimelineProps {
    user: ParentUser;
}

export function DeveloperTimeline({ user }: DeveloperTimelineProps) {
    const [milestones, setMilestones] = useState<DevMilestone[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    // Form state
    const [newTitle, setNewTitle] = useState('');
    const [newPhase, setNewPhase] = useState('');
    const [newStart, setNewStart] = useState('');
    const [newEnd, setNewEnd] = useState('');
    const [newLearning, setNewLearning] = useState('');

    useEffect(() => {
        const unsubscribe = subscribeToDevTimeline(user.uid, (fetched) => {
            setMilestones(fetched);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [user.uid]);

    const handleAddMilestone = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim()) return;

        try {
            await addDevMilestone(user.uid, {
                title: newTitle,
                phase: newPhase || 'Onbekend',
                startDate: newStart,
                endDate: newEnd,
                status: 'pending',
                learningGoal: newLearning || undefined
            });
            // Reset form
            setNewTitle('');
            setNewPhase('');
            setNewStart('');
            setNewEnd('');
            setNewLearning('');
            setIsAdding(false);
        } catch (error) {
            console.error("Error adding milestone:", error);
        }
    };

    const updateStatus = async (milestoneId: string, status: DevMilestone['status']) => {
        try {
            await updateDevMilestone(user.uid, milestoneId, { status });
        } catch (error) {
            console.error("Error updating milestone status:", error);
        }
    };

    const deleteMilestone = async (id: string) => {
        if (!window.confirm('Verwijderen?')) return;
        try {
            await deleteDevMilestone(user.uid, id);
        } catch (error) {
            console.error("Error deleting milestone:", error);
        }
    };

    const seedWeeklyTimeline = async () => {
        if (milestones.length > 0 && !window.confirm('Er staan al mijlpalen in je roadmap. Wil je de weektemplate hieraan toevoegen?')) {
            return;
        }

        const today = new Date();
        const formatDate = (date: Date) => date.toISOString().split('T')[0];
        
        const addDays = (date: Date, days: number) => {
            const d = new Date(date);
            d.setDate(d.getDate() + days);
            return d;
        };

        const weeklyMilestones: Omit<DevMilestone, 'id' | 'updatedAt'>[] = [
            {
                title: 'Documentatie & Inventarisatie',
                phase: 'Foundation',
                startDate: formatDate(today),
                endDate: formatDate(addDays(today, 2)),
                status: 'pending',
                learningGoal: 'Portal architectuur & asset management'
            },
            {
                title: 'Compliance & Legal Review',
                phase: 'Setup',
                startDate: formatDate(today),
                endDate: formatDate(addDays(today, 4)),
                status: 'pending',
                learningGoal: 'Juridische validatie voor pilots'
            },
            {
                title: 'Pilot Program Planning',
                phase: 'Pilot',
                startDate: formatDate(addDays(today, 3)),
                endDate: formatDate(addDays(today, 7)),
                status: 'pending',
                learningGoal: 'Stakeholder alignment'
            },
            {
                title: 'Sales & Pitch Personalization',
                phase: 'Growth',
                startDate: formatDate(addDays(today, 4)),
                endDate: formatDate(addDays(today, 7)),
                status: 'pending',
                learningGoal: 'B2B messaging effectiveness'
            },
            {
                title: 'AI Integration MVP',
                phase: 'Development',
                startDate: formatDate(today),
                endDate: formatDate(addDays(today, 7)),
                status: 'pending',
                learningGoal: 'AI Agent orchestration'
            }
        ];

        try {
            for (const milestone of weeklyMilestones) {
                await addDevMilestone(user.uid, milestone);
            }
            alert('Roadmap succesvol gevuld!');
        } catch (error) {
            console.error("Error seeding timeline:", error);
            alert('Er ging iets mis bij het vullen.');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="animate-spin text-indigo-600" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-10 max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Project Roadmap</h3>
                    <p className="text-sm text-slate-500">Volg de belangrijkste mijlpalen van DGSkills naar scholen.</p>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={seedWeeklyTimeline}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm shadow-sm"
                    >
                        <Clock size={18} className="text-indigo-500" />
                        Weekplan laden
                    </button>
                    <button 
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all text-sm shadow-xl"
                    >
                        <Plus size={18} />
                        Mijlpaal toevoegen
                    </button>
                </div>
            </div>

            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                {milestones.length === 0 ? (
                    <div className="text-center py-12">
                        <Map size={48} className="mx-auto text-slate-300 mb-4" />
                        <p className="text-slate-400 font-medium italic">Nog geen mijlpalen gedefinieerd...</p>
                    </div>
                ) : (
                    milestones.map((milestone, index) => (
                        <div key={milestone.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                            {/* Dot */}
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full border border-white shadow-lg shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-0 md:left-1/2 -translate-x-1/2 z-10 transition-colors ${
                                milestone.status === 'completed' ? 'bg-emerald-500' : 
                                milestone.status === 'in_progress' ? 'bg-indigo-500' : 'bg-slate-300'
                            }`}>
                                {milestone.status === 'completed' ? <CheckCircle2 size={20} className="text-white" /> : <Flag size={20} className="text-white" />}
                            </div>

                            {/* Card */}
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-3xl border border-slate-200 shadow-sm group-hover:shadow-md transition-all ml-12 md:ml-0">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 bg-slate-100 text-[10px] font-black text-slate-600 uppercase tracking-widest rounded-full">
                                            {milestone.phase}
                                        </span>
                                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                            <Calendar size={10} />
                                            {new Date(milestone.startDate).toLocaleDateString('nl-NL', { month: 'short', day: 'numeric' })}
                                        </div>
                                    </div>
                                    <button onClick={() => deleteMilestone(milestone.id!)} className="text-slate-300 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Trash2 size={14} />
                                    </button>
                                </div>

                                <h4 className="text-lg font-black text-slate-900 mb-2 leading-tight">{milestone.title}</h4>
                                
                                {milestone.learningGoal && (
                                    <div className="flex gap-2 p-3 bg-indigo-50/50 rounded-xl mb-4 border border-indigo-50">
                                        <BookOpen size={16} className="text-indigo-400 shrink-0" />
                                        <p className="text-xs text-indigo-700 italic leading-relaxed">
                                            <span className="font-bold not-italic">Leerdoel:</span> {milestone.learningGoal}
                                        </p>
                                    </div>
                                )}

                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                                    <div className="flex gap-2">
                                        {(['pending', 'in_progress', 'completed'] as const).map((s) => (
                                            <button 
                                                key={s}
                                                onClick={() => updateStatus(milestone.id!, s)}
                                                className={`w-3 h-3 rounded-full border-2 transition-all ${
                                                    milestone.status === s 
                                                        ? (s === 'completed' ? 'bg-emerald-500 border-emerald-500 scale-125' : s === 'in_progress' ? 'bg-indigo-500 border-indigo-500 scale-125' : 'bg-slate-400 border-slate-400 scale-125')
                                                        : 'bg-transparent border-slate-200 hover:border-slate-300'
                                                }`}
                                                title={s}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        {milestone.status === 'completed' ? 'Gereed' : milestone.status === 'in_progress' ? 'Bezig' : 'Wachten'}
                                        <ChevronRight size={12} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add Milestone Modal */}
            {isAdding && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Nieuwe Mijlpaal</h3>
                            <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600 p-2">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleAddMilestone} className="p-6 space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Titel</label>
                                <input 
                                    autoFocus
                                    required
                                    type="text" 
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="Bijv: Eerste Beta Test op School"
                                    value={newTitle}
                                    onChange={e => setNewTitle(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Fase</label>
                                <input 
                                    type="text" 
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="Bijv: Foundation, Pilot, Growth"
                                    value={newPhase}
                                    onChange={e => setNewPhase(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Start Datum</label>
                                    <input 
                                        required
                                        type="date" 
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                        value={newStart}
                                        onChange={e => setNewStart(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Eind Datum</label>
                                    <input 
                                        required
                                        type="date" 
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                        value={newEnd}
                                        onChange={e => setNewEnd(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-indigo-500 uppercase tracking-widest flex items-center gap-2">
                                    <BookOpen size={14} />
                                    Leerdoel voor deze mijlpaal
                                </label>
                                <textarea 
                                    className="w-full px-4 py-3 bg-indigo-50/50 border border-indigo-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none min-h-[80px]"
                                    placeholder="Wat is het belangrijkste dat je wilt valideren of leren?"
                                    value={newLearning}
                                    onChange={e => setNewLearning(e.target.value)}
                                />
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
