import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, Search, Lock, Users, ChevronRight, Wifi } from 'lucide-react';
import { StudentData } from '../../types';

interface Mission {
    id: string;
    title: string;
    description: string;
    week: number;
}

// All available missions for focus mode
const ALL_FOCUS_MISSIONS: Mission[] = [
    // Week 1
    { id: 'magister-master', title: 'Magister Meester', description: 'Beheer je rooster en huiswerk.', week: 1 },
    { id: 'cloud-commander', title: 'Cloud Commander', description: 'Veilig bestanden opslaan in OneDrive.', week: 1 },
    { id: 'word-wizard', title: 'Word Wizard', description: 'Maak professionele verslagen.', week: 1 },
    { id: 'slide-specialist', title: 'Slide Specialist', description: 'Ontwerp interactieve presentaties.', week: 1 },
    { id: 'print-pro', title: 'Print Pro', description: 'Leer printen met de RICOH app.', week: 1 },
    // Week 2 Review
    { id: 'ipad-print-instructies', title: 'iPad Print Instructies', description: 'Leer stap-voor-stap printen vanaf je iPad.', week: 2 },
    { id: 'cloud-cleaner', title: 'Cloud Schoonmaker', description: 'Sleep bestanden naar de juiste mappen.', week: 2 },
    { id: 'layout-doctor', title: 'Word Match', description: 'Koppel Word-problemen aan de juiste oplossing!', week: 2 },
    { id: 'pitch-police', title: 'Pitch Politie', description: 'Geef deze saaie slide een makeover.', week: 2 },
    // Week 2 Main
    { id: 'prompt-master', title: 'Prompt Perfectionist', description: 'Leer het verschil tussen goede en slechte prompts.', week: 2 },
    { id: 'game-programmeur', title: 'Game Programmeur', description: 'Repareer games met code.', week: 2 },
    { id: 'ai-trainer', title: 'AI Trainer', description: 'Leer een robot het verschil tussen materialen.', week: 2 },
    { id: 'chatbot-trainer', title: 'Chatbot Trainer', description: 'Bouw je eigen chatbot.', week: 2 },
    { id: 'ai-tekengame', title: 'AI Tekengame', description: 'Teken en laat de AI raden wat het is!', week: 2 },
    { id: 'game-director', title: 'De Game Director', description: 'Herschrijf de natuurwetten en ontwerp je eigen game.', week: 2 },
    { id: 'verhalen-ontwerper', title: 'Verhalen Ontwerper', description: 'Visualiseer verhalen met AI.', week: 2 },
    { id: 'ai-beleid-brainstorm', title: 'AI Beleid Brainstorm', description: 'Denk mee over AI-regels op school.', week: 2 },
    // Week 3
    { id: 'review-week-2', title: 'De Code-Criticus', description: 'Vind fouten in AI-content uit Week 2.', week: 3 },
    { id: 'data-detective', title: 'Data Detective', description: 'Analyseer datasets en ontdek verborgen patronen.', week: 3 },
    { id: 'deepfake-detector', title: 'Deepfake Detector', description: 'Spot AI-gegenereerde content en nepnieuws.', week: 3 },
    { id: 'ai-spiegel', title: 'De AI Spiegel', description: 'Reflecteer op je AI-ervaringen.', week: 3 },
    { id: 'social-safeguard', title: 'Social Safeguard', description: 'Word een expert in online veiligheid.', week: 3 },
    { id: 'cookie-crusher', title: 'Cookie Crusher', description: 'Herken dark patterns in cookie-popups.', week: 3 },
    { id: 'data-handelaar', title: 'De Data Handelaar', description: 'Ga undercover bij een databedrijf.', week: 3 },
    { id: 'privacy-profiel-spiegel', title: 'Privacy Profiel Spiegel', description: 'Check je eigen app privacy-instellingen.', week: 3 },
    { id: 'filter-bubble-breaker', title: 'Filter Bubble Breaker', description: 'Vergelijk twee social media feeds.', week: 3 },
    { id: 'datalekken-rampenplan', title: 'Datalekken Rampenplan', description: 'Los een school datalek-crisis op.', week: 3 },
    { id: 'data-voor-data', title: 'Data voor Data', description: 'Hoeveel data zou jij inruilen?', week: 3 },
    // Week 4
    { id: 'review-week-3', title: 'De Ethische Raad', description: 'Adviseer over ethische dilemma\'s.', week: 4 },
    { id: 'mission-blueprint', title: 'De Blauwdruk', description: 'Organiseer je meesterwerk.', week: 4 },
    { id: 'mission-vision', title: 'De Visie', description: 'Visualiseer je droom.', week: 4 },
    { id: 'mission-launch', title: 'De Lancering', description: 'Breng het naar buiten.', week: 4 },
];

interface FocusMissionSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (missionId: string, missionTitle: string, selectedClass?: string) => void;
    availableClasses?: string[];
    students?: StudentData[];
}

export const FocusMissionSelector: React.FC<FocusMissionSelectorProps> = ({
    isOpen,
    onClose,
    onSelect,
    availableClasses = [],
    students = []
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
    const [selectedClass, setSelectedClass] = useState<string | null>(null);

    // Calculate active students per class (active within last 5 minutes)
    const getActiveCount = (className: string): number => {
        const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
        return students.filter(s =>
            s.identifier?.startsWith(className) &&
            s.lastActive &&
            s.lastActive.toDate().getTime() > fiveMinutesAgo
        ).length;
    };

    // Get total students per class
    const getTotalCount = (className: string): number => {
        return students.filter(s => s.identifier?.startsWith(className)).length;
    };

    const filteredMissions = ALL_FOCUS_MISSIONS.filter(mission => {
        const matchesSearch = mission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            mission.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesWeek = selectedWeek === null || mission.week === selectedWeek;
        return matchesSearch && matchesWeek;
    });

    const handleSelect = (mission: Mission) => {
        onSelect(mission.id, mission.title, selectedClass || undefined);
        // Reset state on close
        setSelectedClass(null);
        setSearchTerm('');
        setSelectedWeek(null);
        onClose();
    };

    const handleClose = () => {
        setSelectedClass(null);
        setSearchTerm('');
        setSelectedWeek(null);
        onClose();
    };

    if (!isOpen) return null;

    // If we have classes to choose from, show class selector first
    const showClassSelector = availableClasses.length > 0 && !selectedClass;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    onClick={handleClose}
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 w-full max-w-2xl max-h-[80vh] overflow-hidden relative z-10 flex flex-col"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                                    <Target size={28} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-900">Focus Modus Activeren</h2>
                                    <p className="text-slate-500 text-sm font-medium">
                                        {showClassSelector
                                            ? 'Kies eerst een klas om te focussen'
                                            : `Selecteer welke opdracht ${selectedClass || 'leerlingen'} moeten maken`
                                        }
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Class Badge & Mission Filters - only show when class is selected */}
                        {!showClassSelector && (
                            <div className="flex gap-3 mt-4">
                                {/* Selected Class Badge */}
                                {selectedClass && (
                                    <button
                                        onClick={() => setSelectedClass(null)}
                                        className="flex items-center gap-2 px-3 py-2 bg-indigo-100 text-indigo-700 rounded-xl text-sm font-bold hover:bg-indigo-200 transition-colors"
                                    >
                                        <Users size={14} />
                                        {selectedClass}
                                        <X size={14} />
                                    </button>
                                )}

                                <div className="flex-1 relative">
                                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Zoek opdracht..."
                                        className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div className="flex bg-slate-100 p-1 rounded-xl">
                                    <button
                                        onClick={() => setSelectedWeek(null)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedWeek === null ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                                    >
                                        Alle
                                    </button>
                                    {[1, 2, 3, 4].map(week => (
                                        <button
                                            key={week}
                                            onClick={() => setSelectedWeek(week)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedWeek === week ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                                        >
                                            W{week}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-4">
                        <AnimatePresence mode="wait">
                            {/* CLASS SELECTOR VIEW */}
                            {showClassSelector ? (
                                <motion.div
                                    key="class-selector"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                                >
                                    {availableClasses.map(className => {
                                        const activeCount = getActiveCount(className);
                                        const totalCount = getTotalCount(className);

                                        return (
                                            <button
                                                key={className}
                                                onClick={() => setSelectedClass(className)}
                                                className="group p-5 bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-200 rounded-xl text-left transition-all hover:shadow-md"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 bg-white group-hover:bg-indigo-100 rounded-xl flex items-center justify-center text-slate-500 group-hover:text-indigo-600 transition-colors border border-slate-100 font-black text-lg">
                                                            {className}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-slate-900 text-base">Klas {className}</h3>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <div className="flex items-center gap-1">
                                                                    <div className={`w-2 h-2 rounded-full ${activeCount > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                                                                    <span className={`text-xs font-bold ${activeCount > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                                                                        {activeCount} online
                                                                    </span>
                                                                </div>
                                                                <span className="text-slate-300">•</span>
                                                                <span className="text-xs text-slate-400">{totalCount} totaal</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <ChevronRight size={20} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                                                </div>
                                            </button>
                                        );
                                    })}
                                </motion.div>
                            ) : (
                                /* MISSION LIST VIEW */
                                <motion.div
                                    key="mission-list"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                                >
                                    {filteredMissions.map(mission => (
                                        <button
                                            key={mission.id}
                                            onClick={() => handleSelect(mission)}
                                            className="group p-4 bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-200 rounded-xl text-left transition-all hover:shadow-md"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 bg-white group-hover:bg-indigo-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors border border-slate-100">
                                                    <Target size={20} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-bold text-slate-900 text-sm truncate">{mission.title}</h3>
                                                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase">W{mission.week}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{mission.description}</p>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {!showClassSelector && filteredMissions.length === 0 && (
                            <div className="text-center py-12">
                                <Search size={40} className="text-slate-200 mx-auto mb-3" />
                                <p className="text-slate-400 font-medium">Geen opdrachten gevonden</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-slate-100 bg-slate-50">
                        <p className="text-xs text-slate-400 text-center">
                            <Lock size={12} className="inline mr-1" />
                            {showClassSelector
                                ? 'Selecteer een klas om de focus modus te activeren'
                                : `Leerlingen${selectedClass ? ` in ${selectedClass}` : ''} worden geblokkeerd totdat ze de geselecteerde opdracht voltooien`
                            }
                        </p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
