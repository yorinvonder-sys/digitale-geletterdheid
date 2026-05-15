
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { X, Terminal, Activity, Wifi, Shield, Clock, AlertTriangle } from 'lucide-react';
import { StudentData, StudentActivity } from '@/types';
import { supabase } from '@/services/supabase';

interface LiveStudentModalProps {
    student: StudentData | null;
    onClose: () => void;
}

export const LiveStudentModal: React.FC<LiveStudentModalProps> = ({ student, onClose }) => {
    const [activities, setActivities] = useState<StudentActivity[]>([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Simulated "Connecting" state for effect
    const [connectionStep, setConnectionStep] = useState(0);

    useEffect(() => {
        if (!student) return;

        // Reset state
        setActivities([]);
        setLoading(true);
        setConnectionStep(0);

        // Simulated connection sequence
        const intervals = [
            setTimeout(() => setConnectionStep(1), 500),
            setTimeout(() => setConnectionStep(2), 1200),
            setTimeout(() => setConnectionStep(3), 2000),
        ];

        // Initial fetch
        const fetchActivities = async () => {
            const { data, error } = await supabase
                .from('student_activities')
                .select('*')
                .eq('uid', student.uid)
                .order('timestamp', { ascending: false })
                .limit(50);

            if (!error && data) {
                setActivities(data as unknown as StudentActivity[]);
            }
            setLoading(false);
        };

        fetchActivities();

        // Real-time INSERT subscription
        const channel = supabase
            .channel(`live-student-${student.uid}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'student_activities',
                    filter: `uid=eq.${student.uid}`,
                },
                (payload) => {
                    const newActivity = payload.new as StudentActivity;
                    setActivities(prev => [newActivity, ...prev].slice(0, 50));
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
            intervals.forEach(clearTimeout);
        };
    }, [student]);

    // Escape to close
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
    }, [onClose]);

    useEffect(() => {
        if (student) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [student, handleKeyDown]);

    if (!student) return null;

    const getActivityColor = (type: string) => {
        switch (type) {
            case 'login': return 'text-lab-teal';
            case 'mission_complete': return 'text-lab-sage';
            case 'badge_earned': return 'text-lab-gold';
            case 'focus_lost': return 'text-lab-coral';
            case 'xp_earned': return 'text-lab-coral';
            case 'test_taken': return 'text-lab-teal';
            default: return 'text-lab-muted';
        }
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'login': return 'LOGIN';
            case 'mission_complete': return 'SUCCESS';
            case 'badge_earned': return 'AWARD';
            case 'focus_lost': return 'WARNING';
            case 'xp_earned': return 'XP_GAIN';
            case 'test_taken': return 'ASSESSMENT';
            default: return 'INFO';
        }
    };

    return (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 font-mono" onClick={onClose}>
            <div role="dialog" aria-modal="true" aria-label="Live meekijken terminal" className="bg-lab-ink rounded-lg shadow-2xl border border-lab-line w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]" onClick={e => e.stopPropagation()}>

                {/* TERMINAL HEADER */}
                <div className="bg-lab-ink px-4 py-2 border-b border-lab-line flex items-center justify-between select-none">
                    <div className="flex items-center gap-2 text-lab-muted text-xs">
                        <Terminal size={14} />
                        <span className="font-bold">LIVE_MEEKIJKEN_TERMINAL // {student.identifier}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping motion-reduce:animate-none absolute inline-flex h-full w-full rounded-full bg-lab-sage opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-lab-coral"></span>
                            </span>
                            <span className="text-[10px] text-lab-muted font-bold tracking-widest uppercase">LIVE</span>
                        </div>
                        <button onClick={onClose} className="hover:bg-lab-ink p-1 rounded transition-colors text-lab-muted hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Sluiten">
                            <X size={16} />
                        </button>
                    </div>
                </div>

                {/* TERMINAL BODY */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-xs md:text-sm bg-lab-ink text-white/75 relative" ref={scrollRef}>

                    {/* CONNECTION SEQUENCE */}
                    <div className="space-y-1 mb-4 border-b border-lab-line pb-4">
                        <div className="text-lab-muted">Beveiligde protocollen initialiseren...</div>
                        {connectionStep >= 1 && <div className="text-lab-muted">Authenticeren: <span className="text-lab-muted">OK</span></div>}
                        {connectionStep >= 2 && <div className="text-lab-muted">Real-time verbinding maken... <span className="text-lab-muted">VERBONDEN</span></div>}
                        {connectionStep >= 3 && <div className="text-lab-muted">Studentactiviteit decoderen...</div>}
                    </div>

                    {/* ACTIVITY FEED */}
                    {connectionStep >= 3 && (
                        loading ? (
                            <div className="p-4 flex items-center justify-center gap-2 text-lab-coral animate-pulse motion-reduce:animate-none">
                                <Activity size={16} className="animate-spin motion-reduce:animate-none" /> Gegevens ophalen...
                            </div>
                        ) : activities.length === 0 ? (
                            <div className="py-8 text-center text-lab-muted italic">
                                -- GEEN RECENTE ACTIVITEIT --
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {activities.map((activity) => (
                                    <div key={activity.id} className="flex gap-3 group hover:bg-white/5 p-1 rounded transition-colors">
                                        <div className="min-w-[80px] text-lab-muted text-[10px] pt-0.5">
                                            {activity.timestamp ?
                                                new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) :
                                                '--:--:--'
                                            }
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className={`font-bold ${getActivityColor(activity.type)}`}>
                                                    [{getActivityIcon(activity.type)}]
                                                </span>
                                                <span className="text-white">{activity.data}</span>
                                            </div>
                                            {/* Optional: Add extra details if available */}
                                            {activity.type === 'mission_start' && <div className="text-lab-muted pl-2 border-l border-lab-line ml-1 mt-1 text-[10px]">Omgeving initialiseren...</div>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    )}

                    {/* Blink cursor at the bottom */}
                    {connectionStep >= 3 && (
                        <div className="mt-4 flex items-center gap-2 text-lab-muted animate-pulse motion-reduce:animate-none">
                            <span className="font-bold">{'>'}</span> Wachten op nieuwe signalen...
                        </div>
                    )}

                </div>

                {/* TERMINAL FOOTER */}
                <div className="bg-lab-ink p-2 border-t border-lab-line flex justify-between items-center text-[10px] text-white/70 font-mono">
                    <div className="flex gap-4">
                        <span className="flex items-center gap-1"><Wifi size={10} /> VERTRAGING: 24ms</span>
                        <span className="flex items-center gap-1"><Shield size={10} /> VERSLEUTELD: AES-256</span>
                    </div>
                    <div>
                        SESSION ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
                    </div>
                </div>
            </div>
        </div>
    );
};
