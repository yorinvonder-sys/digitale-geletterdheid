import React, { useState, useEffect } from 'react';
import { 
    BarChart3, 
    MousePointer2, 
    Layout, 
    Users, 
    Calendar,
    ChevronDown,
    ArrowRight,
    Loader2
} from 'lucide-react';
import { getAnalyticsSummary } from '../../services/developerService';

interface AnalyticsData {
    days: number;
    data: Record<string, Record<string, any>>;
}

export function DeveloperAnalyticsPanel() {
    const [loading, setLoading] = useState(true);
    const [days, setDays] = useState(7);
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true);
            try {
                const summary = await getAnalyticsSummary(days);
                setAnalytics(summary);
                setError(null);
            } catch (err: any) {
                console.error('Failed to fetch analytics:', err);
                setError('Kon analytics niet laden. Controleer of je de juiste rechten hebt.');
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [days]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-lab-muted">
                <Loader2 className="animate-spin mb-4" size={32} />
                <p className="font-medium">Analytics ophalen...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 p-8 rounded-[2rem] border border-red-100 text-center">
                <p className="text-red-600 font-bold mb-2">Oeps!</p>
                <p className="text-red-500 text-sm">{error}</p>
            </div>
        );
    }

    // Process data for display
    const events = analytics?.data || {};
    const dates = Object.keys(events).sort();
    
    // Aggregates
    const totalsByEvent: Record<string, number> = {};
    const totalsByPage: Record<string, number> = {};
    const totalsByRole: Record<string, number> = {};

    dates.forEach(date => {
        const dayEvents = events[date] || {};
        Object.entries(dayEvents).forEach(([eventName, pages]) => {
            // Totals
            let eventSum = 0;
            Object.entries(pages as Record<string, any>).forEach(([page, ctas]) => {
                let pageSum = 0;
                Object.entries(ctas as Record<string, any>).forEach(([cta, roles]) => {
                    Object.entries(roles as Record<string, number>).forEach(([role, count]) => {
                        eventSum += count;
                        pageSum += count;
                        totalsByRole[role] = (totalsByRole[role] || 0) + count;
                    });
                });
                totalsByPage[page] = (totalsByPage[page] || 0) + pageSum;
            });
            totalsByEvent[eventName] = (totalsByEvent[eventName] || 0) + eventSum;
        });
    });

    const topEvents = Object.entries(totalsByEvent)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    const topPages = Object.entries(totalsByPage)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    const maxEventCount = Math.max(...Object.values(totalsByEvent), 1);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Filter */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-xl font-black text-lab-muted uppercase tracking-tight">Klik Analyse</h3>
                    <p className="text-xs text-lab-muted font-medium uppercase tracking-widest">Inzichten uit anonieme gebruikersinteracties</p>
                </div>
                
                <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-lab-muted shadow-sm">
                    {[7, 14, 30, 60, 90].map(d => (
                        <button
                            key={d}
                            onClick={() => setDays(d)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                days === d 
                                    ? 'bg-indigo-600 text-white shadow-md' 
                                    : 'text-lab-muted hover:bg-lab-muted'
                            }`}
                        >
                            {d} Dagen
                        </button>
                    ))}
                </div>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-lab-muted shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                            <MousePointer2 size={16} />
                        </div>
                        <p className="text-[10px] font-black text-lab-muted uppercase tracking-widest">Totaal Interacties</p>
                    </div>
                    <h3 className="text-3xl font-black text-lab-muted">
                        {Object.values(totalsByEvent).reduce((a, b) => a + b, 0)}
                    </h3>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-lab-muted shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-lab-sage rounded-lg flex items-center justify-center text-lab-sage">
                            <Users size={16} />
                        </div>
                        <p className="text-[10px] font-black text-lab-muted uppercase tracking-widest">Actieve Rollen</p>
                    </div>
                    <h3 className="text-3xl font-black text-lab-muted">
                        {Object.keys(totalsByRole).length}
                    </h3>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-lab-muted shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-lab-gold rounded-lg flex items-center justify-center text-lab-gold">
                            <Layout size={16} />
                        </div>
                        <p className="text-[10px] font-black text-lab-muted uppercase tracking-widest">Meest Bezocht</p>
                    </div>
                    <h3 className="text-lg font-black text-lab-muted truncate">
                        {topPages[0]?.[0] || 'Geen data'}
                    </h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Popular Events Bar Chart */}
                <div className="bg-white p-8 rounded-[2rem] border border-lab-muted shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <BarChart3 className="text-indigo-600" size={20} />
                        <h4 className="font-black text-lab-muted uppercase tracking-tight text-sm">Populaire Acties</h4>
                    </div>

                    <div className="space-y-6">
                        {topEvents.map(([event, count]) => (
                            <div key={event} className="space-y-2">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                                    <span className="text-lab-muted">{event.replace(/_/g, ' ')}</span>
                                    <span className="text-indigo-600 font-black">{count}</span>
                                </div>
                                <div className="h-2.5 bg-lab-muted rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                                        style={{ width: `${(count / maxEventCount) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                        {topEvents.length === 0 && (
                            <p className="text-sm text-lab-muted italic text-center py-10">Nog geen data beschikbaar voor deze periode.</p>
                        )}
                    </div>
                </div>

                {/* Top Pages List */}
                <div className="bg-white p-8 rounded-[2rem] border border-lab-muted shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <Layout className="text-indigo-600" size={20} />
                        <h4 className="font-black text-lab-muted uppercase tracking-tight text-sm">Top Pagina's</h4>
                    </div>

                    <div className="space-y-2">
                        {topPages.map(([page, count], i) => (
                            <div key={page} className="flex items-center gap-4 p-4 hover:bg-lab-muted rounded-2xl transition-colors group">
                                <div className="w-8 h-8 rounded-lg bg-lab-muted flex items-center justify-center text-[10px] font-black text-lab-muted">
                                    0{i+1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-lab-muted truncate">{page}</p>
                                    <p className="text-[10px] text-lab-muted font-medium uppercase tracking-widest">{count} kliks</p>
                                </div>
                                <ArrowRight size={14} className="text-lab-muted group-hover:text-indigo-500 transition-colors" />
                            </div>
                        ))}
                        {topPages.length === 0 && (
                            <p className="text-sm text-lab-muted italic text-center py-10">Nog geen data beschikbaar.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Role Breakdown */}
            <div className="bg-lab-muted rounded-[2rem] p-8 text-white">
                <div className="flex items-center gap-3 mb-8">
                    <Users className="text-indigo-400" size={20} />
                    <h4 className="font-black uppercase tracking-tight text-sm">Interactie per Rol</h4>
                </div>
                
                <div className="flex flex-wrap gap-8">
                    {Object.entries(totalsByRole).map(([role, count]) => (
                        <div key={role} className="flex flex-col gap-1">
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{role}</span>
                            <span className="text-2xl font-black">{count}</span>
                        </div>
                    ))}
                    {Object.keys(totalsByRole).length === 0 && (
                        <p className="text-sm text-lab-muted italic">Geen roldata beschikbaar.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
