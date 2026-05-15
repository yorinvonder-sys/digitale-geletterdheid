import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, Search, Lock, Users, ChevronRight, Wifi } from 'lucide-react';
import { StudentData } from '@/types';
import { CURRICULUM } from '@/config/curriculum';
import { ROLES } from '@/config/agents';

interface Mission {
    id: string;
    title: string;
    description: string;
    week: number;
}

function buildFocusMissions(yearGroup: number): Mission[] {
    const yearConfig = CURRICULUM.yearGroups[yearGroup];
    if (!yearConfig) return [];

    const missions: Mission[] = [];
    const seen = new Set<string>();

    for (const [period, periodConfig] of Object.entries(yearConfig.periods)) {
        const missionIds = [
            ...periodConfig.missions,
            ...(periodConfig.reviewMissions || []),
        ];

        for (const id of missionIds) {
            if (seen.has(id)) continue;
            seen.add(id);
            const role = ROLES.find((candidate) => candidate.id === id);
            missions.push({
                id,
                title: role?.title || id,
                description: typeof role?.description === 'string' ? role.description : 'Actuele curriculumopdracht.',
                week: Number(period),
            });
        }
    }

    return missions;
}

interface FocusMissionSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (missionId: string, missionTitle: string, selectedClass?: string) => void;
    availableClasses?: string[];
    students?: StudentData[];
    yearGroup?: number;
}

export const FocusMissionSelector: React.FC<FocusMissionSelectorProps> = ({
    isOpen,
    onClose,
    onSelect,
    availableClasses = [],
    students = [],
    yearGroup = 1
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

    const focusMissions = useMemo(() => buildFocusMissions(yearGroup), [yearGroup]);
    const availableWeeks = useMemo(() => [...new Set(focusMissions.map(mission => mission.week))].sort((a, b) => a - b), [focusMissions]);

    const filteredMissions = focusMissions.filter(mission => {
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
                    className="absolute inset-0 bg-lab-ink/60 backdrop-blur-sm"
                    onClick={handleClose}
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white rounded-[2rem] shadow-2xl border border-lab-line w-full max-w-2xl max-h-[80vh] overflow-hidden relative z-10 flex flex-col"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-lab-line bg-gradient-to-r from-lab-coral to-lab-teal">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-lab-coral to-lab-teal rounded-2xl flex items-center justify-center text-white shadow-lg shadow-lab-coral">
                                    <Target size={28} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-lab-ink">Focus Modus Activeren</h2>
                                    <p className="text-lab-muted text-sm font-medium">
                                        {showClassSelector
                                            ? 'Kies eerst een klas om te focussen'
                                            : `Selecteer welke opdracht ${selectedClass || 'leerlingen'} moeten maken`
                                        }
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-2 text-lab-muted hover:text-lab-muted hover:bg-lab-cream rounded-xl transition-colors"
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
                                        className="flex items-center gap-2 px-3 py-2 bg-lab-coral text-white rounded-xl text-sm font-bold hover:bg-lab-coral hover:text-white transition-colors"
                                    >
                                        <Users size={14} />
                                        {selectedClass}
                                        <X size={14} />
                                    </button>
                                )}

                                <div className="flex-1 relative">
                                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-lab-muted" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Zoek opdracht..."
                                        className="w-full pl-11 pr-4 py-2.5 bg-white border border-lab-line rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-lab-coral focus:border-lab-coral"
                                    />
                                </div>
                                <div className="flex bg-lab-cream p-1 rounded-xl">
                                    <button
                                        onClick={() => setSelectedWeek(null)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedWeek === null ? 'bg-white text-lab-ink shadow-sm' : 'text-lab-muted'}`}
                                    >
                                        Alle
                                    </button>
                                    {availableWeeks.map(week => (
                                        <button
                                            key={week}
                                            onClick={() => setSelectedWeek(week)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedWeek === week ? 'bg-white text-lab-ink shadow-sm' : 'text-lab-muted'}`}
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
                                                className="group p-5 bg-lab-cream hover:bg-lab-coral hover:text-white border border-lab-line hover:border-lab-coral rounded-xl text-left transition-all hover:shadow-md"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 bg-white group-hover:bg-lab-coral rounded-xl flex items-center justify-center text-lab-muted group-hover:text-lab-coral transition-colors border border-lab-line font-black text-lg">
                                                            {className}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-lab-ink text-base">Klas {className}</h3>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <div className="flex items-center gap-1">
                                                                    <div className={`w-2 h-2 rounded-full ${activeCount > 0 ? 'bg-lab-coral animate-pulse' : 'bg-lab-creamDeep'}`} />
                                                                    <span className={`text-xs font-bold ${activeCount > 0 ? 'text-lab-sage' : 'text-lab-muted'}`}>
                                                                        {activeCount} online
                                                                    </span>
                                                                </div>
                                                                <span className="text-lab-muted">•</span>
                                                                <span className="text-xs text-lab-muted">{totalCount} totaal</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <ChevronRight size={20} className="text-lab-muted group-hover:text-lab-muted transition-colors" />
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
                                            className="group p-4 bg-lab-cream hover:bg-lab-coral hover:text-white border border-lab-line hover:border-lab-coral rounded-xl text-left transition-all hover:shadow-md"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 bg-white group-hover:bg-lab-coral rounded-xl flex items-center justify-center text-lab-muted group-hover:text-lab-coral transition-colors border border-lab-line">
                                                    <Target size={20} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-bold text-lab-ink text-sm truncate">{mission.title}</h3>
                                                        <span className="text-[10px] font-bold text-lab-muted bg-lab-cream px-1.5 py-0.5 rounded uppercase">W{mission.week}</span>
                                                    </div>
                                                    <p className="text-xs text-lab-muted mt-0.5 line-clamp-2">{mission.description}</p>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {!showClassSelector && filteredMissions.length === 0 && (
                            <div className="text-center py-12">
                                <Search size={40} className="text-lab-muted mx-auto mb-3" />
                                <p className="text-lab-muted font-medium">Geen opdrachten gevonden</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-lab-line bg-lab-cream">
                        <p className="text-xs text-lab-muted text-center">
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
