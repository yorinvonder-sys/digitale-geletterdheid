import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/services/supabase';
import { getAiBeleidIdeeen } from '@/services/teacherService';
import { AiBeleidIdee } from '@/types';
import { Scale, ShieldCheck, Lightbulb, AlertTriangle, Sparkles, ThumbsUp, Filter, Download, TrendingUp, Users, MessageSquare } from 'lucide-react';
import { downloadCsv } from '@/utils/csvExport';

const CATEGORIES = {
    regels: { label: '📋 Regels', color: 'bg-lab-coral', bgLight: 'bg-lab-teal', icon: ShieldCheck },
    mogelijkheden: { label: '✨ Mogelijkheden', color: 'bg-lab-coral', bgLight: 'bg-lab-sage', icon: Lightbulb },
    zorgen: { label: '⚠️ Zorgen', color: 'bg-lab-coral', bgLight: 'bg-lab-gold', icon: AlertTriangle },
    suggesties: { label: '💡 Suggesties', color: 'bg-lab-coral', bgLight: 'bg-lab-teal', icon: Sparkles }
};

interface AiBeleidFeedbackPanelProps {
    classFilter?: string;
    schoolId?: string;
}

export const AiBeleidFeedbackPanel: React.FC<AiBeleidFeedbackPanelProps> = ({ classFilter, schoolId }) => {
    const refetchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [ideeen, setIdeeen] = useState<AiBeleidIdee[]>([]);
    const [stats, setStats] = useState<{
        totaal: number;
        perCategorie: Record<string, number>;
        topIdeeen: AiBeleidIdee[];
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedCategorie, setSelectedCategorie] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<'stemmen' | 'recent'>('stemmen');

    useEffect(() => {
        const fetchAndProcess = async () => {
            const items = await getAiBeleidIdeeen(classFilter, schoolId);
            processItems(items);
            setLoading(false);
        };

        const processItems = (items: AiBeleidIdee[]) => {
            setIdeeen(items);

            const perCategorie: Record<string, number> = {
                regels: 0,
                mogelijkheden: 0,
                zorgen: 0,
                suggesties: 0
            };
            items.forEach(idee => {
                perCategorie[idee.categorie] = (perCategorie[idee.categorie] || 0) + 1;
            });

            const topIdeeen = [...items]
                .sort((a, b) => (b.stemmen || 0) - (a.stemmen || 0))
                .slice(0, 5);

            setStats({ totaal: items.length, perCategorie, topIdeeen });
        };

        fetchAndProcess();

        // Real-time subscription
        const channel = supabase
            .channel('ai-beleid-feedback')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'ai_beleid_feedback' },
                () => {
                    // Re-fetch on any change (INSERT/UPDATE/DELETE), debounced
                    if (refetchTimeoutRef.current) clearTimeout(refetchTimeoutRef.current);
                    refetchTimeoutRef.current = setTimeout(() => {
                        fetchAndProcess();
                    }, 500);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
            if (refetchTimeoutRef.current) clearTimeout(refetchTimeoutRef.current);
        };
    }, [classFilter, schoolId]);

    const filteredIdeeen = selectedCategorie
        ? ideeen.filter(i => i.categorie === selectedCategorie)
        : ideeen;

    const sortedIdeeen = [...filteredIdeeen].sort((a, b) => {
        if (sortBy === 'stemmen') {
            return (b.stemmen || 0) - (a.stemmen || 0);
        }
        return 0; // Already sorted by timestamp from database
    });

    const exportToCSV = () => {
        const headers = ['Student', 'Klas', 'Categorie', 'Idee', 'Stemmen', 'Datum'];
        const rows = ideeen.map(idee => [
            idee.studentName,
            idee.studentClass || '-',
            CATEGORIES[idee.categorie as keyof typeof CATEGORIES]?.label || idee.categorie,
            idee.idee,
            idee.stemmen || 0,
            idee.timestamp ? new Date(idee.timestamp).toLocaleDateString('nl-NL') : '-'
        ]);

        downloadCsv(`ai-beleid-feedback-${new Date().toISOString().split('T')[0]}.csv`, [headers, ...rows]);
    };

    if (loading) {
        return (
            <div className="p-12 text-center text-lab-muted animate-pulse">
                <Scale className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="font-bold uppercase tracking-widest text-xs">Feedback laden...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-lab-ink flex items-center gap-3">
                        <div className="w-10 h-10 bg-lab-coral text-white rounded-xl flex items-center justify-center">
                            <Scale size={20} />
                        </div>
                        AI Beleid Feedback
                    </h2>
                    <p className="text-lab-muted font-medium">Bekijk alle ideeën en suggesties van leerlingen.</p>
                </div>
                <button
                    onClick={exportToCSV}
                    className="px-4 py-2 bg-lab-cream hover:bg-lab-creamDeep text-lab-muted font-bold rounded-xl flex items-center gap-2 transition-colors"
                >
                    <Download size={18} />
                    Export CSV
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-gradient-to-br from-lab-coral to-lab-teal rounded-2xl p-5 text-white">
                    <div className="flex items-center gap-2 mb-2 text-white/70">
                        <MessageSquare size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">Totaal</span>
                    </div>
                    <p className="text-3xl font-black">{stats?.totaal || 0}</p>
                </div>
                {Object.entries(CATEGORIES).map(([key, cat]) => (
                    <button
                        key={key}
                        onClick={() => setSelectedCategorie(selectedCategorie === key ? null : key)}
                        className={`rounded-2xl p-5 text-left transition-all ${selectedCategorie === key
                            ? `${cat.color} text-white shadow-lg`
                            : `${cat.bgLight} hover:shadow-md`
                            }`}
                    >
                        <div className={`flex items-center gap-2 mb-2 ${selectedCategorie === key ? 'text-white/70' : 'text-lab-muted'}`}>
                            <cat.icon size={16} />
                            <span className="text-xs font-bold uppercase tracking-wider">{cat.label.split(' ')[1]}</span>
                        </div>
                        <p className={`text-3xl font-black ${selectedCategorie === key ? 'text-white' : 'text-lab-muted'}`}>
                            {stats?.perCategorie[key] || 0}
                        </p>
                    </button>
                ))}
            </div>

            {/* Top Ideas */}
            {stats?.topIdeeen && stats.topIdeeen.length > 0 && (
                <div className="bg-gradient-to-br from-lab-gold to-lab-coral rounded-2xl p-6 border border-lab-gold">
                    <h3 className="font-bold text-white flex items-center gap-2 mb-4">
                        <TrendingUp size={18} />
                        Populairste Ideeën
                    </h3>
                    <div className="space-y-3">
                        {stats.topIdeeen.slice(0, 3).map((idee, idx) => {
                            const cat = CATEGORIES[idee.categorie as keyof typeof CATEGORIES];
                            return (
                                <div key={idee.id} className="flex items-center gap-3 bg-white/80 rounded-xl p-3">
                                    <span className="w-8 h-8 flex items-center justify-center font-black text-lg">
                                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-lab-muted font-medium truncate">{idee.idee}</p>
                                        <div className="flex items-center gap-2 text-xs text-lab-muted">
                                            <span>{idee.studentName}</span>
                                            <span>•</span>
                                            <span>{cat?.label}</span>
                                        </div>
                                    </div>
                                    <span className="text-lab-ink font-bold flex items-center gap-1 bg-white/90 px-3 py-1 rounded-lg">
                                        <ThumbsUp size={14} /> {idee.stemmen || 0}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Filter & Sort Controls */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-lab-muted">
                    <Filter size={16} />
                    <span className="font-medium">Sorteer:</span>
                </div>
                <button
                    onClick={() => setSortBy('stemmen')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${sortBy === 'stemmen' ? 'bg-lab-coral text-white' : 'text-lab-muted hover:bg-lab-cream'
                        }`}
                >
                    Meeste stemmen
                </button>
                <button
                    onClick={() => setSortBy('recent')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${sortBy === 'recent' ? 'bg-lab-coral text-white' : 'text-lab-muted hover:bg-lab-cream'
                        }`}
                >
                    Meest recent
                </button>
                {selectedCategorie && (
                    <button
                        onClick={() => setSelectedCategorie(null)}
                        className="ml-auto px-3 py-1.5 bg-lab-cream hover:bg-lab-creamDeep text-lab-muted rounded-lg text-sm font-bold transition-colors"
                    >
                        Filter wissen ✕
                    </button>
                )}
            </div>

            {/* Ideas List */}
            {sortedIdeeen.length === 0 ? (
                <div className="text-center py-16 bg-lab-cream rounded-2xl border-2 border-dashed border-lab-line">
                    <Scale className="w-12 h-12 mx-auto mb-4 text-lab-muted" />
                    <p className="text-lab-muted font-bold">Nog geen feedback ontvangen</p>
                    <p className="text-lab-muted text-sm">Zodra leerlingen ideeën indienen, verschijnen ze hier.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {sortedIdeeen.map((idee) => {
                        const cat = CATEGORIES[idee.categorie as keyof typeof CATEGORIES];
                        return (
                            <motion.div
                                key={idee.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-xl p-4 border border-lab-line shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`w-10 h-10 ${cat?.color || 'bg-lab-muted'} rounded-xl flex items-center justify-center text-white shrink-0`}>
                                        {cat && <cat.icon size={18} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-lab-muted mb-2">{idee.idee}</p>
                                        <div className="flex items-center gap-3 text-xs text-lab-muted">
                                            <span className="flex items-center gap-1">
                                                <Users size={12} />
                                                {idee.studentName}
                                            </span>
                                            {idee.studentClass && (
                                                <span className="bg-lab-cream px-2 py-0.5 rounded-full font-medium">
                                                    {idee.studentClass}
                                                </span>
                                            )}
                                            <span>{cat?.label}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-white font-bold bg-lab-coral px-3 py-2 rounded-lg">
                                        <ThumbsUp size={16} />
                                        <span>{idee.stemmen || 0}</span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AiBeleidFeedbackPanel;
