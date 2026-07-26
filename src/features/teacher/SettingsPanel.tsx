import React, { useMemo } from 'react';
import { Shield, Target, Zap, Layout } from 'lucide-react';
import { getMissionsForYear } from '@/config/missions';
import { TeacherGameToggle } from '../games/TeacherGameToggle';
import { ClassroomConfig } from '@/types';

interface SettingsPanelProps {
    classFilter: string;
    enabledMissions: string[];
    onToggleMission: (missionId: string) => void;
    onTestGame?: (gameId: string) => void;
    yearGroup?: number;
    classroomConfig: ClassroomConfig | null;
    onUpdateConfig: (update: Partial<ClassroomConfig>) => void;
    onOpenSchedulingConfig?: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ classFilter, enabledMissions, onToggleMission, onTestGame, yearGroup = 1, classroomConfig, onUpdateConfig, onOpenSchedulingConfig }) => {
    const yearMissions = useMemo(() => getMissionsForYear(yearGroup), [yearGroup]);
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-[2rem] shadow-sm border border-duck-ink/15 overflow-hidden p-6">
                <h3 className="text-xs font-black text-duck-ink/60 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Shield size={14} />
                    Missietoegang {classFilter !== 'all' ? `voor ${classFilter}` : '(Selecteer een klas)'}
                </h3>

                {/* Geen eigen klasselect: de klas kies je bovenaan in de header. */}
                {classFilter === 'all' ? (
                    <div className="p-4 bg-duck-bg text-duck-ink/60 text-sm rounded-xl text-center">
                        Kies eerst een klas bovenaan in de header om instellingen te wijzigen.
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
                                    <div className="w-11 h-6 bg-duck-bg peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-duck-ink/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-duck-ink/15 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-duck-ink"></div>
                                </label>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Directe regie. "Niveau Lock" is hier verwijderd: die knop had geen
                onClick en ClassroomConfig kent geen XP-drempel — het was niet-werkende UI. */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-duck-ink/15 overflow-hidden p-6">
                <h3 className="text-xs font-black text-duck-ink/60 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Zap size={14} />
                    Directe regie
                </h3>

                <div className="p-4 bg-duck-bg rounded-xl border border-duck-ink/15 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-duck-acid/20 text-duck-ink rounded-xl flex items-center justify-center">
                            <Target size={20} />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-duck-ink">Klassikale deadline</div>
                            <div className="text-xs font-medium text-duck-ink/60">Pint één missie bovenaan bij al je leerlingen</div>
                        </div>
                    </div>
                    <select
                        className="w-full bg-white border border-duck-ink/15 text-duck-ink rounded-xl p-3 text-sm font-bold outline-none focus:border-duck-ink transition-all"
                        value={classroomConfig?.pinnedMissionId || ''}
                        onChange={(e) => onUpdateConfig({ pinnedMissionId: e.target.value || undefined })}
                    >
                        <option value="">-- Geen gepinde missie --</option>
                        {yearMissions.map(m => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {onOpenSchedulingConfig && (
                <div className="mt-8 bg-white rounded-[2rem] shadow-sm border border-duck-ink/15 overflow-hidden p-6">
                    <h3 className="text-xs font-black text-duck-ink/60 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Layout size={14} />
                        Leerlijn configureren
                    </h3>
                    <p className="text-sm text-duck-ink/60 mb-4">
                        Bepaal hoe missies worden ingedeeld: periodes, projectweken, weeklessen of een eigen structuur.
                    </p>
                    <button
                        onClick={onOpenSchedulingConfig}
                        className="px-6 py-3 bg-duck-ink text-white font-bold text-sm rounded-xl hover:bg-duck-ink/90 transition-all flex items-center gap-2"
                    >
                        <Layout size={16} />
                        Leerlijn inrichten
                    </button>
                </div>
            )}

            <div className="mt-8">
                <TeacherGameToggle onTestGame={onTestGame} yearGroup={yearGroup} />
            </div>
        </div>
    );
};
