
import React, { useEffect, useState, useRef } from 'react';
import { X, Terminal, Activity, Wifi, Shield, Clock, AlertTriangle } from 'lucide-react';
import { StudentData, StudentActivity } from '../../types';
import { supabase } from '../../services/supabase';

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
                setActivities(data as StudentActivity[]);
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

    if (!student) return null;

    const getActivityColor = (type: string) => {
        switch (type) {
            case 'login': return 'text-blue-400';
            case 'mission_complete': return 'text-emerald-400';
            case 'badge_earned': return 'text-amber-400';
            case 'focus_lost': return 'text-red-400';
            case 'xp_earned': return 'text-indigo-400';
            case 'test_taken': return 'text-cyan-400';
            default: return 'text-slate-300';
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
            <div className="bg-slate-950 rounded-lg shadow-2xl border border-slate-800 w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]" onClick={e => e.stopPropagation()}>

                {/* TERMINAL HEADER */}
                <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between select-none">
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                        <Terminal size={14} />
                        <span className="font-bold">LIVE_MEEKIJKEN_TERMINAL // {student.identifier}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-[10px] text-emerald-500 font-bold tracking-widest uppercase">LIVE</span>
                        </div>
                        <button onClick={onClose} className="hover:bg-slate-800 p-1 rounded transition-colors text-slate-500 hover:text-white">
                            <X size={16} />
                        </button>
                    </div>
                </div>

                {/* TERMINAL BODY */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-xs md:text-sm bg-slate-950 text-slate-300 relative" ref={scrollRef}>

                    {/* CONNECTION SEQUENCE */}
                    <div className="space-y-1 mb-4 border-b border-slate-800 pb-4">
                        <div className="text-slate-500">Beveiligde protocollen initialiseren...</div>
                        {connectionStep >= 1 && <div className="text-slate-500">Authenticeren: <span className="text-emerald-500">OK</span></div>}
                        {connectionStep >= 2 && <div className="text-slate-500">Real-time verbinding maken... <span className="text-emerald-500">VERBONDEN</span></div>}
                        {connectionStep >= 3 && <div className="text-slate-500">Studentactiviteit decoderen...</div>}
                    </div>

                    {/* ACTIVITY FEED */}
                    {connectionStep >= 3 && (
                        loading ? (
                            <div className="p-4 flex items-center justify-center gap-2 text-indigo-400 animate-pulse">
                                <Activity size={16} className="animate-spin" /> Gegevens ophalen...
                            </div>
                        ) : activities.length === 0 ? (
                            <div className="py-8 text-center text-slate-600 italic">
                                -- GEEN RECENTE ACTIVITEIT --
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {activities.map((activity) => (
                                    <div key={activity.id} className="flex gap-3 group hover:bg-white/5 p-1 rounded transition-colors">
                                        <div className="min-w-[80px] text-slate-600 text-[10px] pt-0.5">
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
                                            {activity.type === 'mission_start' && <div className="text-slate-500 pl-2 border-l border-slate-700 ml-1 mt-1 text-[10px]">Omgeving initialiseren...</div>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    )}

                    {/* Blink cursor at the bottom */}
                    {connectionStep >= 3 && (
                        <div className="mt-4 flex items-center gap-2 text-emerald-500 animate-pulse">
                            <span className="font-bold">{'>'}</span> Wachten op nieuwe signalen...
                        </div>
                    )}

                </div>

                {/* TERMINAL FOOTER */}
                <div className="bg-slate-900 p-2 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500 font-mono">
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
