import React, { useState, useEffect, useMemo } from 'react';
import { MessageSquare, Trash2, Loader2, RefreshCw, User, Clock, Filter, Download, CheckSquare, Square } from 'lucide-react';
import { getAllFeedback, deleteFeedback, Feedback } from '../../services/feedbackService';
import { downloadCsv, rowsToCsv } from '../../utils/csvExport';

interface FeedbackPanelProps {
    schoolId?: string;
}

export const FeedbackPanel: React.FC<FeedbackPanelProps> = ({ schoolId }) => {
    const [feedback, setFeedback] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [massDeleting, setMassDeleting] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [classFilter, setClassFilter] = useState<string>('all');

    const loadFeedback = async () => {
        setLoading(true);
        try {
            const data = await getAllFeedback(schoolId);
            setFeedback(data);
        } catch (error) {
            console.error('Failed to load feedback:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFeedback();
    }, [schoolId]);

    // Get unique classes from feedback
    const uniqueClasses = useMemo(() => {
        const classes = new Set(feedback.map(f => f.user_class || 'Onbekend'));
        return Array.from(classes).sort();
    }, [feedback]);

    // Filter feedback by class
    const filteredFeedback = useMemo(() => {
        if (classFilter === 'all') return feedback;
        return feedback.filter(f => f.user_class === classFilter);
    }, [feedback, classFilter]);

    const handleDelete = async (id: string) => {
        setDeleting(id);
        try {
            await deleteFeedback(id);
            setFeedback(prev => prev.filter(f => f.id !== id));
        } catch (error) {
            console.error('Failed to delete feedback:', error);
        } finally {
            setDeleting(null);
        }
    };

    const formatDate = (timestamp: any) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return new Intl.DateTimeFormat('nl-NL', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const handleExport = () => {
        const rows: unknown[][] = [
            ['Datum', 'Klas', 'Leerling', 'Bericht'],
            ...filteredFeedback.map((f) => [
                formatDate(f.created_at),
                f.user_class || 'Onbekend',
                f.user_name || 'Anoniem',
                f.message
            ])
        ];

        const csv = rowsToCsv(rows);
        const date = new Date().toISOString().split('T')[0];
        downloadCsv(csv, `Feedback_Export_${date}.csv`);
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === filteredFeedback.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredFeedback.map(f => f.id || '').filter(Boolean)));
        }
    };

    const handleMassDelete = async () => {
        if (!confirm(`Weet je zeker dat je ${selectedIds.size} berichten wilt verwijderen?`)) return;

        setMassDeleting(true);
        try {
            const promises = Array.from(selectedIds).map(id => deleteFeedback(id));
            await Promise.all(promises);

            // Update local state
            setFeedback(prev => prev.filter(f => !selectedIds.has(f.id!)));
            setSelectedIds(new Set());
        } catch (error) {
            console.error('Failed to mass delete:', error);
            alert('Er is een fout opgetreden bij het verwijderen.');
        } finally {
            setMassDeleting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-[2rem] p-6 md:p-8 text-white shadow-xl">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                            <MessageSquare size={32} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black">Leerling Feedback</h2>
                            <p className="text-white/80">Verbeterpunten van leerlingen</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleExport}
                            className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors flex items-center gap-2 font-bold text-sm"
                            title="Exporteer naar CSV"
                            aria-label="Exporteer feedback naar CSV"
                        >
                            <Download size={20} />
                            <span className="hidden sm:inline">Export CSV</span>
                        </button>
                        <button
                            onClick={loadFeedback}
                            disabled={loading}
                            className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
                        >
                            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Filter & Stats Row */}
            <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-4">
                    {/* Class Filter */}
                    <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 px-3 py-2 shadow-sm">
                        <Filter size={16} className="text-slate-400" />
                        <select
                            value={classFilter}
                            onChange={(e) => {
                                setClassFilter(e.target.value);
                                setSelectedIds(new Set()); // Reset selection on filter change
                            }}
                            className="bg-transparent border-none text-sm font-bold text-slate-700 focus:outline-none cursor-pointer"
                        >
                            <option value="all">Alle klassen ({feedback.length})</option>
                            {uniqueClasses.map(cls => (
                                <option key={cls} value={cls}>
                                    {cls} ({feedback.filter(f => f.user_class === cls).length})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Select All Toggle */}
                    {filteredFeedback.length > 0 && (
                        <button
                            onClick={toggleSelectAll}
                            className="flex items-center gap-2 text-slate-500 text-sm font-bold hover:text-slate-700 transition-colors"
                        >
                            {selectedIds.size === filteredFeedback.length ? <CheckSquare size={18} className="text-indigo-600" /> : <Square size={18} />}
                            Selecteer alles
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    {/* Mass Delete Action */}
                    {selectedIds.size > 0 && (
                        <button
                            onClick={handleMassDelete}
                            disabled={massDeleting}
                            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-bold text-sm transition-colors animate-in fade-in"
                        >
                            {massDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                            Verwijder ({selectedIds.size})
                        </button>
                    )}

                    {/* Feedback Count */}
                    <div className="bg-white rounded-xl border border-slate-100 px-4 py-2 shadow-sm">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-500">
                                {classFilter === 'all' ? 'Totaal' : classFilter}
                            </span>
                            <span className="text-xl font-black text-amber-600">{filteredFeedback.length}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feedback List */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 size={32} className="animate-spin text-amber-500" />
                </div>
            ) : filteredFeedback.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
                    <MessageSquare size={48} className="text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 font-bold">
                        {classFilter === 'all' ? 'Nog geen feedback ontvangen' : `Geen feedback van ${classFilter}`}
                    </p>
                    <p className="text-slate-300 text-sm mt-1">Leerlingen kunnen feedback geven via de knop in de header</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredFeedback.map((item) => (
                        <div
                            key={item.id}
                            className={`bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition-shadow relative ${selectedIds.has(item.id!) ? 'border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50' : 'border-slate-100'}`}
                        >
                            <div className="flex items-start gap-4">
                                <button
                                    onClick={() => item.id && toggleSelect(item.id)}
                                    className="mt-1 text-slate-400 hover:text-indigo-600 transition-colors shrink-0"
                                >
                                    {selectedIds.has(item.id!) ? <CheckSquare size={20} className="text-indigo-600" /> : <Square size={20} />}
                                </button>

                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                                            <User size={18} className="text-amber-600" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900">{item.user_name}</div>
                                            <div className="text-xs text-slate-400 flex items-center gap-2">
                                                <span className="bg-slate-100 px-2 py-0.5 rounded-full">{item.user_class}</span>
                                                <span className="flex items-center gap-1">
                                                    <Clock size={10} />
                                                    {formatDate(item.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-xl">
                                        {item.message}
                                    </p>
                                </div>

                                <button
                                    onClick={() => item.id && handleDelete(item.id)}
                                    disabled={deleting === item.id}
                                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                                    title="Verwijderen"
                                >
                                    {deleting === item.id ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <Trash2 size={16} />
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
