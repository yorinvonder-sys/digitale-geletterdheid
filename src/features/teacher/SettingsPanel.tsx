import React, { useMemo } from 'react';
import { Shield, Target, Lock, Crown, Zap, Users, Layout } from 'lucide-react';
import { getMissionsForYear } from '@/config/missions';
import { TeacherGameToggle } from '../games/TeacherGameToggle';
import { ClassroomConfig } from '@/types';

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
    onOpenSchedulingConfig?: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ classFilter, onClassFilterChange, availableClasses, enabledMissions, onToggleMission, onTestGame, yearGroup = 1, classroomConfig, onUpdateConfig, onOpenSchedulingConfig }) => {
    const yearMissions = useMemo(() => getMissionsForYear(yearGroup), [yearGroup]);
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-[2rem] shadow-xl shadow-duck-ink/15/50 border border-duck-ink/15 overflow-hidden p-6">
                <h3 className="text-xs font-black text-duck-ink/60 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Shield size={14} />
                    Missie Toegang {classFilter !== 'all' ? `voor ${classFilter}` : '(Selecteer een klas)'}
                </h3>

                {/* Class Selector */}
                <div className="mb-4">
                    <label className="text-xs font-bold text-duck-ink/60 uppercase tracking-wider mb-2 block flex items-center gap-2">
                        <Users size={12} /> Selecteer Klas
                    </label>
                    <select
                        value={classFilter}
                        onChange={(e) => onClassFilterChange(e.target.value)}
                        className="w-full p-3 border border-duck-ink/15 rounded-xl text-sm font-bold bg-white hover:border-duck-error focus:border-duck-error focus:ring-2 focus:ring-duck-error/20 outline-none transition-all cursor-pointer"
                    >
                        <option value="all">-- Selecteer een klas --</option>
                        {availableClasses.map(cls => (
                            <option key={cls} value={cls}>{cls}</option>
                        ))}
                    </select>
                </div>

                {classFilter === 'all' ? (
                    <div className="p-4 bg-duck-bg text-duck-ink/60 text-sm rounded-xl text-center">
                        Selecteer eerst een specifieke klas om instellingen te wijzigen.
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {yearMissions.map(mission => (
                            <div key={mission.id} className="flex items-center justify-between p-4 bg-duck-bg rounded-xl border border-duck-ink/15">
                                <div>
                                    <div className="font-bold text-duck-ink">{mission.name}</div>
                                    <div className="text-xs text-duck-ink/60">ID: {mission.id}</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={enabledMissions.includes(mission.id)}
                                        onChange={() => onToggleMission(mission.id)}
                                    />
                                    <div className="w-11 h-6 bg-duck-bg peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-duck-error rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-duck-ink/15 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-duck-error"></div>
                                </label>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* DIRECTE REGIE */}
            <div className="bg-duck-ink rounded-[2rem] shadow-2xl overflow-hidden p-8 relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-duck-error/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>

                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Zap size={16} className="text-duck-error" />
                    Directe Regie: Klassikale Controle
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Mission Pinning */}
                    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-duck-error/20 text-duck-error rounded-xl flex items-center justify-center">
                                <Target size={20} />
                            </div>
                            <div>
                                <div className="text-sm font-black text-white">Klassikale Deadline</div>
                                <div className="text-[10px] text-duck-ink/60 uppercase font-bold">Pint een missie bovenaan</div>
                            </div>
                        </div>
                        <select
                            className="w-full bg-duck-ink border border-duck-ink/15 text-white rounded-xl p-3 text-xs font-bold outline-none focus:border-duck-error transition-all"
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
                            <div className="w-10 h-10 bg-duck-error/20 text-duck-ink rounded-xl flex items-center justify-center">
                                <Lock size={20} />
                            </div>
                            <div>
                                <div className="text-sm font-black text-white">Niveau Lock</div>
                                <div className="text-[10px] text-duck-ink/60 uppercase font-bold">Inhoud vrijgeven op Klas XP</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                placeholder="Doel XP..."
                                className="flex-1 bg-duck-ink border border-duck-ink/15 text-white rounded-xl p-3 text-xs font-bold outline-none focus:border-duck-error transition-all"
                                defaultValue={500}
                            />
                            <button className="px-4 py-3 bg-duck-error text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-duck-acid hover:text-duck-ink transition-all">
                                Lock
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {onOpenSchedulingConfig && (
                <div className="mt-8 bg-white rounded-[2rem] shadow-xl shadow-duck-ink/15/50 border border-duck-ink/15 overflow-hidden p-6">
                    <h3 className="text-xs font-black text-duck-ink/60 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Layout size={14} />
                        Leerlijn Configuratie
                    </h3>
                    <p className="text-sm text-duck-ink/60 mb-4">
                        Bepaal hoe missies worden ingedeeld: periodes, projectweken, weeklessen of een eigen structuur.
                    </p>
                    <button
                        onClick={onOpenSchedulingConfig}
                        className="px-6 py-3 bg-duck-error text-white font-bold text-sm rounded-xl hover:bg-duck-error hover:text-white transition-all shadow-lg shadow-duck-error flex items-center gap-2"
                    >
                        <Layout size={16} />
                        Leerlijn Inrichten
                    </button>
                </div>
            )}

            <div className="mt-8">
                <TeacherGameToggle onTestGame={onTestGame} yearGroup={yearGroup} />
            </div>
        </div>
    );
};
