import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';
import { StudentActivity } from '../../types';
import { Zap, Target, Award, ShieldAlert, MousePointer2, Clock, Play, ClipboardCheck } from 'lucide-react';

interface ActivityFeedProps {
    schoolId?: string;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ schoolId }) => {
    const [activities, setActivities] = useState<StudentActivity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initial fetch
        const fetchActivities = async () => {
            let queryBuilder = supabase
                .from('student_activities')
                .select('*')
                .order('timestamp', { ascending: false })
                .limit(15);

            if (schoolId) {
                queryBuilder = queryBuilder.eq('school_id', schoolId);
            }

            const { data, error } = await queryBuilder;

            if (!error && data) {
                setActivities(data as StudentActivity[]);
            } else if (error) {
                console.error("ActivityFeed error:", error);
            }
            setLoading(false);
        };

        fetchActivities();

        // Real-time subscription for new activities
        const channel = supabase
            .channel('activity-feed')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'student_activities',
                },
                (payload) => {
                    const newActivity = payload.new as StudentActivity;
                    // Client-side filter for schoolId
                    if (schoolId && (newActivity as any).school_id !== schoolId) return;

                    setActivities(prev => {
                        const updated = [newActivity, ...prev];
                        return updated.slice(0, 15); // Keep last 15
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [schoolId]);

    const getIcon = (type: string) => {
        switch (type) {
            case 'mission_start': return <Play size={14} className="text-indigo-500" />;
            case 'mission_complete': return <Target size={14} className="text-emerald-500" />;
            case 'xp_earned': return <Zap size={14} className="text-amber-500" />;
            case 'badge_earned': return <Award size={14} className="text-purple-500" />;
            case 'focus_lost': return <ShieldAlert size={14} className="text-red-500" />;
            case 'test_taken': return <ClipboardCheck size={14} className="text-cyan-500" />;
            default: return <MousePointer2 size={14} className="text-slate-400" />;
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-400 text-xs font-bold uppercase tracking-widest animate-pulse">Activiteit laden...</div>;

    return (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-4 border-b border-slate-50 flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    Live Activiteit
                </h3>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Real-time</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {activities.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 text-xs italic">Nog geen recente activiteit...</div>
                ) : activities.map((activity) => (
                    <div key={activity.id} className="flex gap-3 group">
                        <div className="mt-1 w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            {getIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-sm font-bold text-slate-900 truncate">{activity.studentName}</span>
                                <span className="text-[9px] font-medium text-slate-400 whitespace-nowrap flex items-center gap-1">
                                    <Clock size={8} />
                                    {activity.timestamp ? new Date(activity.timestamp).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }) : 'nu'}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium">{activity.data}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
