
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Users, Sparkles, Settings } from 'lucide-react';

type MainTab = 'overview' | 'students' | 'gamification' | 'games' | 'settings' | 'activity' | 'ai-beleid' | 'feedback' | 'progress' | 'slo' | 'documenten' | 'nulmeting' | 'samenhang';

interface TeacherNavigationProps {
    activeTab: MainTab;
    setActiveTab: (tab: MainTab) => void;
}

// Shared sub-tab rendering to avoid repetition
const SubTabBar: React.FC<{
    tabs: { id: string; label: string; tooltip: string; tutorialId?: string }[];
    activeTab: string;
    setActiveTab: (tab: MainTab) => void;
}> = ({ tabs, activeTab, setActiveTab }) => (
    <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="flex justify-center gap-1 pt-3 mt-2 border-t border-lab-muted overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
    >
        {tabs.map(sub => (
            <button
                key={sub.id}
                data-tutorial={sub.tutorialId}
                onClick={() => setActiveTab(sub.id as MainTab)}
                title={sub.tooltip}
                className={`px-3 py-2 min-h-[36px] rounded-lg text-xs font-bold transition-all flex-shrink-0 ${activeTab === sub.id
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-lab-muted hover:text-lab-muted hover:bg-lab-muted'
                    }`}
            >
                {sub.label}
            </button>
        ))}
    </motion.div>
);

// Dashboard sub-tabs: daily workflow first, deep-dive last
const DASHBOARD_SUBTABS = [
    { id: 'overview', label: 'Overzicht', tooltip: 'Statistieken, signalering en acties' },
    { id: 'progress', label: 'Voortgang', tooltip: 'Missie-voortgang per leerling' },
    { id: 'slo', label: 'SLO Doelen', tooltip: 'Kerndoelen Digitale Geletterdheid (SLO 2025)' },
    { id: 'nulmeting', label: 'Nulmeting', tooltip: 'Nulmetingsresultaten en digitaal paspoort per klas' },
    { id: 'samenhang', label: 'Samenhang', tooltip: 'Samenhang basisvaardigheden: taal, rekenen, burgerschap' },
    { id: 'documenten', label: 'Documenten', tooltip: 'Compliance- en beleidsdocumenten' },
];

const STUDENT_SUBTABS = [
    { id: 'students', label: 'Leerlingenlijst', tooltip: 'Alle leerlingen met status en missies' },
    { id: 'feedback', label: 'Feedback', tooltip: 'Feedback van leerlingen over het platform' },
];

const ACTIVITY_SUBTABS = [
    { id: 'games', label: 'Games', tooltip: 'Beschikbare games en opdrachten' },
    { id: 'gamification', label: 'Beloningen', tooltip: 'Ranglijst, gallery en XP-events', tutorialId: 'gamification-subtab' },
];

const SETTINGS_SUBTABS = [
    { id: 'ai-beleid', label: 'AI Beleid', tooltip: 'Feedback en ideeën over AI-beleid op school' },
    { id: 'settings', label: 'Instellingen', tooltip: 'Missies aan/uit, moeilijkheidsgraad en klas-config' },
];

const MAIN_TABS = [
    { id: 'overview', label: 'Dashboard', icon: BarChart3, subTabIds: DASHBOARD_SUBTABS.map(t => t.id), tutorialId: 'dashboard-tab', tooltip: 'Overzicht van voortgang, SLO-doelen en signalering' },
    { id: 'students', label: 'Leerlingen', icon: Users, subTabIds: STUDENT_SUBTABS.map(t => t.id), tutorialId: 'students-tab', tooltip: 'Bekijk en beheer je leerlingen per klas' },
    { id: 'games', label: 'Activiteiten', icon: Sparkles, subTabIds: ACTIVITY_SUBTABS.map(t => t.id), tutorialId: 'activities-tab', tooltip: 'Games, ranglijsten en XP-beloningen' },
    { id: 'settings', label: 'Beheer', icon: Settings, subTabIds: SETTINGS_SUBTABS.map(t => t.id), tutorialId: 'settings-tab', tooltip: 'AI-beleid en klas-instellingen' },
];

export const TeacherNavigation: React.FC<TeacherNavigationProps> = ({ activeTab, setActiveTab }) => {
    // Determine which main section is active
    const activeSection = MAIN_TABS.find(t => t.subTabIds.includes(activeTab))?.id || 'overview';

    return (
        <div data-tutorial="main-tabs" className="bg-white rounded-2xl border border-lab-muted shadow-sm p-2">
            <div className="flex items-center justify-center gap-1 md:gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {MAIN_TABS.map(tab => {
                    const isActive = tab.subTabIds.includes(activeTab);
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            data-tutorial={tab.tutorialId}
                            onClick={() => setActiveTab(tab.subTabIds[0] as MainTab)}
                            title={tab.tooltip}
                            className={`relative flex items-center gap-2 px-2 sm:px-3 md:px-6 py-3 min-h-[44px] rounded-xl text-sm font-bold transition-all flex-shrink-0 ${isActive
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                : 'text-lab-muted hover:text-lab-muted hover:bg-lab-muted'
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
                {activeSection === 'overview' && <SubTabBar key="dash" tabs={DASHBOARD_SUBTABS} activeTab={activeTab} setActiveTab={setActiveTab} />}
                {activeSection === 'students' && <SubTabBar key="stu" tabs={STUDENT_SUBTABS} activeTab={activeTab} setActiveTab={setActiveTab} />}
                {activeSection === 'games' && <SubTabBar key="act" tabs={ACTIVITY_SUBTABS} activeTab={activeTab} setActiveTab={setActiveTab} />}
                {activeSection === 'settings' && <SubTabBar key="set" tabs={SETTINGS_SUBTABS} activeTab={activeTab} setActiveTab={setActiveTab} />}
            </AnimatePresence>
        </div>
    );
};
