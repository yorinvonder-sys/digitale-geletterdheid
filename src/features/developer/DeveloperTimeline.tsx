import React, { useState, useEffect } from 'react';
import { ParentUser } from '@/types';
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
} from '@/services/developerService';

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
                <Loader2 className="animate-spin text-duck-ink" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-10 max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-black text-duck-ink uppercase tracking-tight">Project Roadmap</h3>
                    <p className="text-sm text-duck-ink/60">Volg de belangrijkste mijlpalen van DGSkills naar scholen.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={seedWeeklyTimeline}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-duck-ink/15 text-duck-ink/60 rounded-xl font-bold hover:bg-duck-bg transition-all text-sm shadow-sm"
                    >
                        <Clock size={18} className="text-duck-ink/60" />
                        Weekplan laden
                    </button>
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-duck-ink text-white rounded-xl font-bold hover:bg-duck-ink transition-all text-sm shadow-xl"
                    >
                        <Plus size={18} />
                        Mijlpaal toevoegen
                    </button>
                </div>
            </div>

            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-duck-bg before:to-transparent">
                {milestones.length === 0 ? (
                    <div className="text-center py-12">
                        <Map size={48} className="mx-auto text-duck-ink/60 mb-4" />
                        <p className="text-duck-ink/60 font-medium italic">Nog geen mijlpalen gedefinieerd...</p>
                    </div>
                ) : (
                    milestones.map((milestone, index) => (
                        <div key={milestone.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                            {/* Dot */}
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full border border-white shadow-lg shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-0 md:left-1/2 -translate-x-1/2 z-10 transition-colors ${
                                milestone.status === 'completed' ? 'bg-duck-acid' :
                                milestone.status === 'in_progress' ? 'bg-duck-acid' : 'bg-duck-ink/10'
                            }`}>
                                {milestone.status === 'completed' ? <CheckCircle2 size={20} className="text-white" /> : <Flag size={20} className="text-white" />}
                            </div>

                            {/* Card */}
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-3xl border border-duck-ink/15 shadow-sm group-hover:shadow-md transition-all ml-12 md:ml-0">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 bg-duck-bg text-[10px] font-black text-duck-ink/60 uppercase tracking-widest rounded-full">
                                            {milestone.phase}
                                        </span>
                                        <div className="flex items-center gap-1 text-[10px] text-duck-ink/60 font-bold uppercase tracking-widest">
                                            <Calendar size={10} />
                                            {new Date(milestone.startDate).toLocaleDateString('nl-NL', { month: 'short', day: 'numeric' })}
                                        </div>
                                    </div>
                                    <button onClick={() => deleteMilestone(milestone.id!)} className="text-duck-ink/60 hover:text-duck-ink p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Trash2 size={14} />
                                    </button>
                                </div>

                                <h4 className="text-lg font-black text-duck-ink mb-2 leading-tight">{milestone.title}</h4>

                                {milestone.learningGoal && (
                                    <div className="flex gap-2 p-3 bg-duck-acid/30 rounded-xl mb-4 border border-duck-acid">
                                        <BookOpen size={16} className="text-duck-ink shrink-0" />
                                        <p className="text-xs text-duck-ink italic leading-relaxed">
                                            <span className="font-bold not-italic">Leerdoel:</span> {milestone.learningGoal}
                                        </p>
                                    </div>
                                )}

                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-duck-ink/15">
                                    <div className="flex gap-2">
                                        {(['pending', 'in_progress', 'completed'] as const).map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => updateStatus(milestone.id!, s)}
                                                className={`w-3 h-3 rounded-full border-2 transition-all ${
                                                    milestone.status === s
                                                        ? (s === 'completed' ? 'bg-duck-acid border-duck-acid scale-125' : s === 'in_progress' ? 'bg-duck-acid border-duck-acid scale-125' : 'bg-duck-ink border-duck-ink/15 scale-125')
                                                        : 'bg-transparent border-duck-ink/15 hover:border-duck-ink/15'
                                                }`}
                                                title={s}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] font-black text-duck-ink/60 uppercase tracking-widest">
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
                <div className="fixed inset-0 bg-duck-ink/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-duck-ink/15 flex items-center justify-between">
                            <h3 className="text-xl font-black text-duck-ink uppercase tracking-tight">Nieuwe Mijlpaal</h3>
                            <button onClick={() => setIsAdding(false)} className="text-duck-ink/60 hover:text-duck-ink p-2">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleAddMilestone} className="p-6 space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-duck-ink/60 uppercase tracking-widest">Titel</label>
                                <input
                                    autoFocus
                                    required
                                    type="text"
                                    className="w-full px-4 py-3 bg-duck-bg border border-duck-ink/15 rounded-xl focus:ring-2 focus:ring-duck-ink/15 outline-none"
                                    placeholder="Bijv: Eerste Beta Test op School"
                                    value={newTitle}
                                    onChange={e => setNewTitle(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-duck-ink/60 uppercase tracking-widest">Fase</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 bg-duck-bg border border-duck-ink/15 rounded-xl focus:ring-2 focus:ring-duck-ink/15 outline-none"
                                    placeholder="Bijv: Foundation, Pilot, Growth"
                                    value={newPhase}
                                    onChange={e => setNewPhase(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-duck-ink/60 uppercase tracking-widest">Start Datum</label>
                                    <input
                                        required
                                        type="date"
                                        className="w-full px-4 py-3 bg-duck-bg border border-duck-ink/15 rounded-xl focus:ring-2 focus:ring-duck-ink/15 outline-none"
                                        value={newStart}
                                        onChange={e => setNewStart(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-duck-ink/60 uppercase tracking-widest">Eind Datum</label>
                                    <input
                                        required
                                        type="date"
                                        className="w-full px-4 py-3 bg-duck-bg border border-duck-ink/15 rounded-xl focus:ring-2 focus:ring-duck-ink/15 outline-none"
                                        value={newEnd}
                                        onChange={e => setNewEnd(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-duck-ink/60 uppercase tracking-widest flex items-center gap-2">
                                    <BookOpen size={14} />
                                    Leerdoel voor deze mijlpaal
                                </label>
                                <textarea
                                    className="w-full px-4 py-3 bg-duck-acid/30 border border-duck-acid rounded-xl focus:ring-2 focus:ring-duck-ink/15 outline-none min-h-[80px]"
                                    placeholder="Wat is het belangrijkste dat je wilt valideren of leren?"
                                    value={newLearning}
                                    onChange={e => setNewLearning(e.target.value)}
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAdding(false)}
                                    className="flex-1 py-3 border border-duck-ink/15 rounded-xl font-bold text-duck-ink/60 hover:bg-duck-bg transition-colors"
                                >
                                    Annuleren
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-duck-acid text-duck-ink rounded-xl font-bold transition-all shadow-lg"
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
