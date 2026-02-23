import React, { useState, useEffect } from 'react';
import { ParentUser } from '../../types';
import {
    LayoutDashboard,
    CheckSquare,
    Calendar,
    FileText,
    LogOut,
    BookOpen,
    Clock,
    Shield,
    Sparkles,
    TrendingUp,
    AlertCircle,
    History,
    Zap,
    ChevronRight,
    BarChart3,
    Calculator
} from 'lucide-react';
import { DeveloperTaskList } from './DeveloperTaskList';
import { DeveloperTimeline } from './DeveloperTimeline';
import { DeveloperDocsViewer } from './DeveloperDocsViewer';
import { DeveloperAnalyticsPanel } from './DeveloperAnalyticsPanel';
import { AccountantDashboard } from './AccountantDashboard';
import {
    subscribeToDeveloperTasks,
    DeveloperTask,
    getDeveloperPlanHistory,
    DeveloperPlan
} from '../../services/developerService';

interface DeveloperDashboardProps {
    user: ParentUser;
    onLogout: () => void;
}

type TabId = 'overview' | 'tasks' | 'timeline' | 'docs' | 'analytics' | 'boekhouding';

export function DeveloperDashboard({ user, onLogout }: DeveloperDashboardProps) {
    const [activeTab, setActiveTab] = useState<TabId>('overview');
    const [tasks, setTasks] = useState<DeveloperTask[]>([]);
    const [planHistory, setPlanHistory] = useState<DeveloperPlan[]>([]);

    useEffect(() => {
        const unsubTasks = subscribeToDeveloperTasks(user.uid, (fetched) => {
            setTasks(fetched);
        });
        getDeveloperPlanHistory(user.uid).then(setPlanHistory).catch(console.error);
        return () => {
            unsubTasks();
        };
    }, [user.uid]);

    const completedTasks = tasks.filter(t => t.status === 'done');
    const blockedTasks = tasks.filter(t => t.status === 'blocked');
    const validatedTasks = tasks.filter(t => t.evidence?.aiValidationStatus === 'validated');
    const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;
    const recentReflection = tasks.filter(t => t.evidence?.reflection).sort((a, b) => new Date(b.updated_at || '').getTime() - new Date(a.updated_at || '').getTime())[0];

    // Calculate real KPIs instead of hardcoded values
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const tasksCompletedThisWeek = completedTasks.filter(t => t.updated_at && new Date(t.updated_at) >= oneWeekAgo).length;
    const weeksSinceFirstTask = tasks.length > 0
        ? Math.max(1, Math.ceil((now.getTime() - Math.min(...tasks.map(t => new Date(t.created_at || now).getTime()))) / (7 * 24 * 60 * 60 * 1000)))
        : 1;
    const avgTasksPerWeek = (completedTasks.length / weeksSinceFirstTask).toFixed(1);
    const learningGoalRate = tasks.length > 0
        ? Math.round((tasks.filter(t => t.learningNote).length / tasks.length) * 100)
        : 0;

    const tabs = [
        { id: 'overview',     label: 'Overzicht',     icon: LayoutDashboard },
        { id: 'tasks',        label: 'Takenlijst',    icon: CheckSquare },
        { id: 'timeline',     label: 'Tijdpaden',     icon: Calendar },
        { id: 'docs',         label: 'Documenten',    icon: FileText },
        { id: 'analytics',    label: 'Analytics',     icon: BarChart3 },
        { id: 'boekhouding',  label: 'Boekhouding',   icon: Calculator },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Weekly Scorecard */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Voortgang</p>
                                <div className="flex items-baseline gap-2">
                                    <h3 className="text-3xl font-black text-slate-900">{completionRate}%</h3>
                                    {tasksCompletedThisWeek > 0 && (
                                        <span className="text-xs font-bold text-emerald-500 flex items-center gap-0.5">
                                            <TrendingUp size={12} />
                                            +{tasksCompletedThisWeek} deze week
                                        </span>
                                    )}
                                </div>
                                <div className="mt-4 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${completionRate}%` }}></div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Taken Gereed</p>
                                <div className="flex items-baseline gap-2">
                                    <h3 className="text-3xl font-black text-slate-900">{completedTasks.length}</h3>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">/ {tasks.length}</span>
                                </div>
                                <p className="text-[10px] text-slate-500 mt-2 font-medium">Deze week</p>
                            </div>

                            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">AI Checks</p>
                                <div className="flex items-baseline gap-2">
                                    <h3 className="text-3xl font-black text-slate-900">
                                        {validatedTasks.length}
                                    </h3>
                                    <Shield size={16} className="text-indigo-500" />
                                </div>
                                <p className="text-[10px] text-slate-500 mt-2 font-medium">Goedgekeurd door Coach</p>
                            </div>

                            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Blokkades</p>
                                <div className="flex items-baseline gap-2">
                                    <h3 className="text-3xl font-black text-red-600">
                                        {blockedTasks.length}
                                    </h3>
                                    <AlertCircle size={16} className="text-red-500" />
                                </div>
                                <p className="text-[10px] text-slate-500 mt-2 font-medium">Aandacht nodig</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* AI Reflection Coach */}
                            <div className="lg:col-span-2 bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
                                            <Sparkles size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black uppercase tracking-tight">AI Coach</h3>
                                            <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest">Tips op basis van je bewijs</p>
                                        </div>
                                    </div>

                                    {recentReflection ? (
                                        <div className="space-y-6">
                                            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 italic text-slate-300 text-sm leading-relaxed">
                                                "{recentReflection.evidence?.reflection}"
                                                <div className="mt-4 flex items-center gap-2 not-italic">
                                                    <span className="text-[10px] font-black text-slate-500 uppercase">Bron:</span>
                                                    <span className="text-[10px] font-bold text-indigo-400 uppercase">{recentReflection.title}</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="w-1 h-auto bg-indigo-500 rounded-full" />
                                                <div className="space-y-2">
                                                    <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Tip van de Coach</p>
                                                    <p className="text-sm text-slate-300 leading-relaxed">
                                                        Je focus op {recentReflection.learningNote || 'validatie'} werpt zijn vruchten af.
                                                        Zorg dat je deze week de documentatie volledig afrondt voordat je de sales week ingaat.
                                                        De AI-check laat zien dat je bewijsvoering steeds concreter wordt.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="py-10 text-center">
                                            <p className="text-slate-400 italic text-sm">Nog geen reflecties beschikbaar. Voeg bewijs toe aan voltooide taken om coach-inzichten te ontvangen.</p>
                                        </div>
                                    )}
                                </div>
                                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
                            </div>

                            {/* Weekly Goal */}
                            <div className="bg-indigo-50 rounded-[2rem] p-8 border border-indigo-100 flex flex-col">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                                        <BookOpen size={24} />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Weekdoel</h3>
                                </div>
                                <p className="text-indigo-900 font-bold text-xl leading-tight mb-4">
                                    {tasks.length > 0
                                        ? `${tasks.filter(t => t.status !== 'done').length} taken nog open. Focus op de hoogste prioriteit.`
                                        : 'Start met het aanmaken van taken via de Takenlijst.'
                                    }
                                </p>
                                <div className="mt-auto space-y-4">
                                    <div className="flex items-center justify-between text-xs font-black text-indigo-400 uppercase tracking-widest">
                                        <span>Status</span>
                                        <span>{completionRate}% gereed</span>
                                    </div>
                                    <div className="h-2 bg-indigo-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${completionRate}%` }}></div>
                                    </div>
                                    <button
                                        onClick={() => setActiveTab('tasks')}
                                        className="w-full py-3 bg-white text-indigo-600 rounded-xl font-bold text-xs uppercase tracking-widest shadow-sm hover:bg-indigo-100 transition-colors"
                                    >
                                        Update Voortgang
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Additional Insights / History */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Plan History */}
                            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                                            <History size={20} />
                                        </div>
                                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Plan Historie</h3>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {planHistory.slice(0, 3).map((item, i) => (
                                        <div key={i} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors group">
                                            <div className={`w-2 h-2 rounded-full ${item.status === 'approved' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-slate-900 truncate">AI Plan v{planHistory.length - i}</p>
                                                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">
                                                    {item.created_at ? new Date(item.created_at).toLocaleDateString('nl-NL') : ''} • {item.status || 'draft'}
                                                </p>
                                            </div>
                                            <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                                        </div>
                                    ))}
                                    {planHistory.length === 0 && (
                                        <p className="text-sm text-slate-400 italic text-center py-4">Nog geen plannen gegenereerd.</p>
                                    )}
                                </div>
                            </div>

                            {/* Performance KPI's */}
                            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                            <Zap size={20} />
                                        </div>
                                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Snelheid & Focus</h3>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">Taken per week</p>
                                            <p className="text-[10px] text-slate-400 uppercase font-black">Gemiddelde snelheid</p>
                                        </div>
                                        <span className="text-xl font-black text-indigo-600">{avgTasksPerWeek}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">Leerdoelen ingevuld</p>
                                            <p className="text-[10px] text-slate-400 uppercase font-black">Taken met leerdoel</p>
                                        </div>
                                        <span className="text-xl font-black text-emerald-600">{learningGoalRate}%</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">AI Validaties</p>
                                            <p className="text-[10px] text-slate-400 uppercase font-black">Goedgekeurd door Coach</p>
                                        </div>
                                        <span className="text-xl font-black text-indigo-600">{validatedTasks.length}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'tasks':
                return <DeveloperTaskList user={user} />;
            case 'timeline':
                return <DeveloperTimeline user={user} />;
            case 'docs':
                return <DeveloperDocsViewer />;
            case 'analytics':
                return <DeveloperAnalyticsPanel />;
            case 'boekhouding':
                return <AccountantDashboard userId={user.uid} />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-72 bg-white border-r border-slate-200 flex flex-col z-20">
                <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                            <LayoutDashboard size={20} className="text-white" />
                        </div>
                        <div>
                            <h1 className="font-black text-slate-900 uppercase tracking-tight leading-none">Developer</h1>
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Portal</span>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as TabId)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                    ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                            >
                                <Icon size={20} />
                                <span className="font-bold text-sm">{tab.label}</span>
                                {isActive && <div className="ml-auto w-1.5 h-1.5 bg-indigo-600 rounded-full" />}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 mt-auto border-t border-slate-100">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mb-4">
                        <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold text-xs uppercase">
                            {user.displayName?.charAt(0) || user.role.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">{user.displayName}</p>
                            <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-bold text-sm transition-colors"
                    >
                        <LogOut size={20} />
                        Uitloggen
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto max-h-screen">
                <header className="sticky top-0 bg-slate-50 backdrop-blur-md z-30 px-6 md:px-10 py-6 border-b border-slate-100">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight m-0 border-none p-0 flex items-center gap-3">
                        {tabs.find(t => t.id === activeTab)?.label}
                    </h2>
                </header>

                <div className="px-6 md:px-10 pb-10">
                    {renderContent()}
                </div>
            </main>
        </div>
    );

    function renderContent() {
        return renderTabContent();
    }
}
