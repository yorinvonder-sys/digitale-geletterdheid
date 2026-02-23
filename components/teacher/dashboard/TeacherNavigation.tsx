
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Users, Sparkles, Settings } from 'lucide-react';

type MainTab = 'overview' | 'students' | 'gamification' | 'games' | 'settings' | 'activity' | 'ai-beleid' | 'feedback' | 'progress' | 'slo' | 'documenten';

interface TeacherNavigationProps {
    activeTab: MainTab;
    setActiveTab: (tab: MainTab) => void;
}

export const TeacherNavigation: React.FC<TeacherNavigationProps> = ({ activeTab, setActiveTab }) => {
    return (
        <div data-tutorial="main-tabs" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-2">
            <div className="flex items-center justify-center gap-1 md:gap-2">
                {[
                    { id: 'overview', label: 'Dashboard', icon: BarChart3, subTabs: ['overview', 'progress', 'slo', 'documenten'], tutorialId: 'dashboard-tab' },
                    { id: 'students', label: 'Leerlingen', icon: Users, subTabs: ['students', 'feedback'], tutorialId: 'students-tab' },
                    { id: 'games', label: 'Activiteiten', icon: Sparkles, subTabs: ['games', 'gamification'], tutorialId: 'activities-tab' },
                    { id: 'settings', label: 'Beheer', icon: Settings, subTabs: ['ai-beleid', 'settings'], tutorialId: 'settings-tab' },
                ].map(tab => {
                    const isActive = tab.subTabs.includes(activeTab);
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            data-tutorial={tab.tutorialId}
                            onClick={() => setActiveTab(tab.subTabs[0] as MainTab)}
                            className={`relative flex items-center gap-2 px-4 md:px-6 py-3 rounded-xl text-sm font-bold transition-all ${isActive
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                }`}
                        >
                            <Icon size={18} />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Sub-tabs for active section */}
            <AnimatePresence mode="wait">
                {(activeTab === 'overview' || activeTab === 'progress' || activeTab === 'slo' || activeTab === 'documenten') && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex justify-center gap-2 pt-3 mt-2 border-t border-slate-100"
                    >
                        {[
                            { id: 'overview', label: 'Overzicht' },
                            { id: 'progress', label: 'Voortgang' },
                            { id: 'slo', label: 'SLO Doelen' },
                            { id: 'documenten', label: 'Documenten' },
                        ].map(sub => (
                            <button
                                key={sub.id}
                                onClick={() => setActiveTab(sub.id as MainTab)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === sub.id
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                {sub.label}
                            </button>
                        ))}
                    </motion.div>
                )}
                {(activeTab === 'students' || activeTab === 'feedback') && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex justify-center gap-2 pt-3 mt-2 border-t border-slate-100"
                    >
                        {[
                            { id: 'students', label: 'Leerlingenlijst' },
                            { id: 'feedback', label: 'Feedback' },
                        ].map(sub => (
                            <button
                                key={sub.id}
                                onClick={() => setActiveTab(sub.id as MainTab)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === sub.id
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                {sub.label}
                            </button>
                        ))}
                    </motion.div>
                )}
                {(activeTab === 'games' || activeTab === 'gamification') && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex justify-center gap-2 pt-3 mt-2 border-t border-slate-100"
                    >
                        {[
                            { id: 'games', label: 'Games' },
                            { id: 'gamification', label: 'Beloningen' },
                        ].map(sub => (
                            <button
                                key={sub.id}
                                data-tutorial={sub.id === 'gamification' ? 'gamification-subtab' : undefined}
                                onClick={() => setActiveTab(sub.id as MainTab)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === sub.id
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                {sub.label}
                            </button>
                        ))}
                    </motion.div>
                )}
                {(activeTab === 'ai-beleid' || activeTab === 'settings') && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex justify-center gap-2 pt-3 mt-2 border-t border-slate-100"
                    >
                        {[
                            { id: 'ai-beleid', label: 'AI Beleid' },
                            { id: 'settings', label: 'Instellingen' },
                        ].map(sub => (
                            <button
                                key={sub.id}
                                onClick={() => setActiveTab(sub.id as MainTab)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === sub.id
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                {sub.label}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
