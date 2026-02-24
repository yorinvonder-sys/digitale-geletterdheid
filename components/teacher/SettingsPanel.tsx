import React, { useMemo } from 'react';
import { Shield, Target, Lock, Crown, Zap, Users } from 'lucide-react';
import { getMissionsForYear } from '../../config/missions';
import { TeacherGameToggle } from '../games/TeacherGameToggle';
import { ClassroomConfig } from '../../types';

interface SettingsPanelProps {
    classFilter: string;
    onClassFilterChange: (classId: string) => void;
    availableClasses: string[];
    enabledMissions: string[];
    onToggleMission: (missionId: string) => void;
    onTestGame?: (gameId: string) => void;
    yearGroup?: number;
    classroomConfig: ClassroomConfig | null;
    onUpdateConfig: (update: Partial<ClassroomConfig>) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ classFilter, onClassFilterChange, availableClasses, enabledMissions, onToggleMission, onTestGame, yearGroup = 1, classroomConfig, onUpdateConfig }) => {
    const yearMissions = useMemo(() => getMissionsForYear(yearGroup), [yearGroup]);
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden p-6">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Shield size={14} />
                    Missie Toegang {classFilter !== 'all' ? `voor ${classFilter}` : '(Selecteer een klas)'}
                </h3>

                {/* Class Selector */}
                <div className="mb-4">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block flex items-center gap-2">
                        <Users size={12} /> Selecteer Klas
                    </label>
                    <select
                        value={classFilter}
                        onChange={(e) => onClassFilterChange(e.target.value)}
                        className="w-full p-3 border border-slate-200 rounded-xl text-sm font-bold bg-white hover:border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all cursor-pointer"
                    >
                        <option value="all">-- Selecteer een klas --</option>
                        {availableClasses.map(cls => (
                            <option key={cls} value={cls}>{cls}</option>
                        ))}
                    </select>
                </div>

                {classFilter === 'all' ? (
                    <div className="p-4 bg-slate-50 text-slate-500 text-sm rounded-xl text-center">
                        Selecteer eerst een specifieke klas om instellingen te wijzigen.
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {yearMissions.map(mission => (
                            <div key={mission.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <div>
                                    <div className="font-bold text-slate-900">{mission.name}</div>
                                    <div className="text-xs text-slate-400">ID: {mission.id}</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={enabledMissions.includes(mission.id)}
                                        onChange={() => onToggleMission(mission.id)}
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </label>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* DIRECTE REGIE */}
            <div className="bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden p-8 relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>

                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Zap size={16} className="text-indigo-400" />
                    Directe Regie: Klassikale Controle
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Mission Pinning */}
                    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center">
                                <Target size={20} />
                            </div>
                            <div>
                                <div className="text-sm font-black text-white">Klassikale Deadline</div>
                                <div className="text-[10px] text-slate-400 uppercase font-bold">Pint een missie bovenaan</div>
                            </div>
                        </div>
                        <select
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 text-xs font-bold outline-none focus:border-indigo-500 transition-all"
                            value={classroomConfig?.pinnedMissionId || ''}
                            onChange={(e) => onUpdateConfig({ pinnedMissionId: e.target.value || undefined })}
                        >
                            <option value="">-- Geen gepinde missie --</option>
                            {yearMissions.map(m => (
                                <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Level Lock */}
                    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center">
                                <Lock size={20} />
                            </div>
                            <div>
                                <div className="text-sm font-black text-white">Niveau Lock</div>
                                <div className="text-[10px] text-slate-400 uppercase font-bold">Inhoud vrijgeven op Klas XP</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                placeholder="Doel XP..."
                                className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-xl p-3 text-xs font-bold outline-none focus:border-amber-500 transition-all"
                                defaultValue={500}
                            />
                            <button className="px-4 py-3 bg-amber-500 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-amber-600 transition-all">
                                Lock
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <TeacherGameToggle onTestGame={onTestGame} yearGroup={yearGroup} />
            </div>
        </div>
    );
};
