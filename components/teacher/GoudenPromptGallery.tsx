import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';
import { HighlightedWork } from '../../types';
import { Sparkles, Star, Quote, Code, Trophy } from 'lucide-react';

interface GoudenPromptGalleryProps {
    schoolId?: string;
}

export const GoudenPromptGallery: React.FC<GoudenPromptGalleryProps> = ({ schoolId }) => {
    const [highlights, setHighlights] = useState<HighlightedWork[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHighlights = async () => {
            let queryBuilder = supabase
                .from('highlighted_work')
                .select('*')
                .order('timestamp', { ascending: false });

            if (schoolId) {
                queryBuilder = queryBuilder.eq('school_id', schoolId);
            }

            const { data, error } = await queryBuilder;
            if (!error && data) {
                setHighlights(data as HighlightedWork[]);
            }
            setLoading(false);
        };

        fetchHighlights();

        // Real-time INSERT subscription
        const channel = supabase
            .channel('highlighted-work')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'highlighted_work' },
                (payload) => {
                    const newWork = payload.new as HighlightedWork;
                    if (schoolId && (newWork as any).school_id !== schoolId) return;
                    setHighlights(prev => [newWork, ...prev]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [schoolId]);

    if (loading) return <div className="p-12 text-center animate-pulse text-slate-400 font-black uppercase tracking-widest text-xs">Gallerij laden...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                            <Trophy size={20} />
                        </div>
                        De Gouden Prompt Gallerij
                    </h2>
                    <p className="text-slate-500 font-medium">De meest creatieve, slimme en originele bijdragen van vandaag.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {highlights.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                            <Star size={32} />
                        </div>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Nog geen werk gehighlight</p>
                    </div>
                ) : highlights.map((work) => (
                    <div key={work.id} className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 relative group overflow-hidden transition-all hover:shadow-2xl">
                        <div className="absolute top-0 right-0 p-4">
                            <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center animate-pulse">
                                <Sparkles size={18} />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center font-black">
                                {work.studentName[0]}
                            </div>
                            <div>
                                <div className="text-lg font-black text-slate-900">{work.studentName}</div>
                                <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{work.missionId}</div>
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-6 relative mb-6">
                            <Quote className="absolute -top-3 -left-2 text-indigo-200" size={32} />
                            <h4 className="font-black text-slate-900 mb-2 truncate">{work.title}</h4>
                            <p className="text-sm font-medium text-slate-600 line-clamp-3 italic">
                                {work.content}
                            </p>
                        </div>

                        {work.teacherNote && (
                            <div className="flex items-start gap-2 text-[11px] font-bold text-slate-500 bg-slate-50/50 p-3 rounded-xl border border-dashed border-slate-200">
                                <Code size={14} className="mt-0.5 text-indigo-400" />
                                <span>Note van Docent: {work.teacherNote}</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
