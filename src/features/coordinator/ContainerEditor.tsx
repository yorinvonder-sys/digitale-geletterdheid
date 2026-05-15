import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronUp, ChevronDown, Plus, BookOpen } from 'lucide-react';
import type { ContainerConfig, ContainerMissionConfig, ContainerType } from '@/config/containerTypes';
import { CONTAINER_THEME_MAP } from '@/config/containerThemes';
import type { MissionInfo } from '@/config/missions';

interface ContainerEditorProps {
    container: ContainerConfig;
    yearGroup: number;
    allMissions: MissionInfo[];
    assignedMissionIds: Set<string>;
    onSave: (updated: Partial<ContainerConfig>) => void;
    onAssignMission: (missionId: string) => void;
    onRemoveMission: (missionId: string) => void;
    onReorderMissions: (missionIds: string[]) => void;
    onClose: () => void;
}

const CONTAINER_TYPE_LABELS: Record<ContainerType, string> = {
    period: 'Periode',
    project_week: 'Projectweek',
    weekly_lesson: 'Weekles',
    custom: 'Aangepast',
};

const COLOR_SWATCH_BG: Record<string, string> = {
    indigo: 'bg-lab-coral',
    pink: 'bg-lab-coral',
    cyan: 'bg-lab-coral',
    violet: 'bg-lab-coral',
    emerald: 'bg-lab-coral',
    amber: 'bg-lab-coral',
    rose: 'bg-lab-coral',
    slate: 'bg-lab-coral',
    orange: 'bg-lab-coral',
    teal: 'bg-lab-teal',
    fuchsia: 'bg-fuchsia-500',
    lime: 'bg-lab-coral',
};

export const ContainerEditor: React.FC<ContainerEditorProps> = ({
    container,
    allMissions,
    assignedMissionIds,
    onSave,
    onAssignMission,
    onRemoveMission,
    onReorderMissions,
    onClose,
}) => {
    const [label, setLabel] = useState(container.label);
    const [subtitle, setSubtitle] = useState(container.subtitle ?? '');
    const [colorKey, setColorKey] = useState(container.colorKey ?? 'slate');
    const [containerType, setContainerType] = useState<ContainerType>(container.containerType);
    const [startDate, setStartDate] = useState(container.startDate ?? '');
    const [endDate, setEndDate] = useState(container.endDate ?? '');
    const [reviewStates, setReviewStates] = useState<Record<string, boolean>>(
        Object.fromEntries(container.missions.map(m => [m.missionId, m.isReview]))
    );

    const assignedInThisContainer = new Set(container.missions.map(m => m.missionId));

    // Missions sorted by sortOrder
    const sortedAssigned: ContainerMissionConfig[] = [...container.missions].sort(
        (a, b) => a.sortOrder - b.sortOrder
    );

    const handleSave = () => {
        onSave({
            label: label.trim(),
            subtitle: subtitle.trim() || undefined,
            colorKey,
            containerType,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
            missions: sortedAssigned.map(m => ({
                ...m,
                isReview: reviewStates[m.missionId] ?? m.isReview,
            })),
        });
        onClose();
    };

    const handleMoveUp = (index: number) => {
        if (index === 0) return;
        const ids = sortedAssigned.map(m => m.missionId);
        const swapped = [...ids];
        [swapped[index - 1], swapped[index]] = [swapped[index], swapped[index - 1]];
        onReorderMissions(swapped);
    };

    const handleMoveDown = (index: number) => {
        if (index === sortedAssigned.length - 1) return;
        const ids = sortedAssigned.map(m => m.missionId);
        const swapped = [...ids];
        [swapped[index + 1], swapped[index]] = [swapped[index], swapped[index + 1]];
        onReorderMissions(swapped);
    };

    const toggleReview = (missionId: string) => {
        setReviewStates(prev => ({ ...prev, [missionId]: !prev[missionId] }));
    };

    const getMissionInfo = (id: string): MissionInfo | undefined =>
        allMissions.find(m => m.id === id);

    // SLO summary — derived from allMissions (MissionInfo has no slo field,
    // so we show mission names grouped under a placeholder label)
    const assignedMissionNames = sortedAssigned
        .map(m => getMissionInfo(m.missionId)?.name ?? m.missionId);

    const availableMissions = allMissions.filter(m => !assignedInThisContainer.has(m.id));

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[200] flex">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-lab-ink/50 backdrop-blur-sm"
                    onClick={onClose}
                />

                {/* Slide-over panel */}
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                    className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl flex flex-col overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-5 border-b border-lab-line bg-lab-cream flex-shrink-0">
                        <div>
                            <h2 className="text-lg font-black text-lab-ink">Container bewerken</h2>
                            <p className="text-sm text-lab-muted font-medium mt-0.5">{container.label}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-lab-muted hover:text-lab-muted hover:bg-lab-cream rounded-xl transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Scrollable body */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8">

                        {/* Section: Details */}
                        <section>
                            <h3 className="text-sm font-bold text-lab-muted uppercase tracking-wider mb-4">Details</h3>
                            <div className="space-y-4">
                                {/* Label */}
                                <div>
                                    <label className="block text-sm font-bold text-lab-muted mb-1.5">
                                        Naam <span className="text-lab-coral">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={label}
                                        onChange={e => setLabel(e.target.value)}
                                        placeholder="Bijv. Periode 1"
                                        className="w-full px-4 py-2.5 border border-lab-line rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-lab-coral focus:border-lab-coral"
                                    />
                                </div>

                                {/* Subtitle */}
                                <div>
                                    <label className="block text-sm font-bold text-lab-muted mb-1.5">
                                        Ondertitel <span className="text-lab-muted font-normal">(optioneel)</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={subtitle}
                                        onChange={e => setSubtitle(e.target.value)}
                                        placeholder="Bijv. Digitale Basis"
                                        className="w-full px-4 py-2.5 border border-lab-line rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-lab-coral focus:border-lab-coral"
                                    />
                                </div>

                                {/* Container type */}
                                <div>
                                    <label className="block text-sm font-bold text-lab-muted mb-1.5">Type</label>
                                    <div className="flex flex-wrap gap-2">
                                        {(Object.keys(CONTAINER_TYPE_LABELS) as ContainerType[]).map(type => (
                                            <button
                                                key={type}
                                                onClick={() => setContainerType(type)}
                                                className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                                                    containerType === type
                                                        ? 'bg-lab-coral text-white border-lab-coral shadow-sm'
                                                        : 'bg-white text-lab-muted border-lab-line hover:border-lab-coral hover:text-lab-coral'
                                                }`}
                                            >
                                                {CONTAINER_TYPE_LABELS[type]}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Color picker */}
                                <div>
                                    <label className="block text-sm font-bold text-lab-muted mb-2">Kleur</label>
                                    <div className="flex flex-wrap gap-2">
                                        {Object.keys(CONTAINER_THEME_MAP).map(key => (
                                            <button
                                                key={key}
                                                title={key}
                                                onClick={() => setColorKey(key)}
                                                className={`w-8 h-8 rounded-full transition-all ${COLOR_SWATCH_BG[key] ?? 'bg-lab-muted'} ${
                                                    colorKey === key
                                                        ? 'ring-2 ring-offset-2 ring-lab-line scale-110'
                                                        : 'hover:scale-105 opacity-80 hover:opacity-100'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Date range */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-lab-muted mb-1.5">
                                            Startdatum <span className="text-lab-muted font-normal">(optioneel)</span>
                                        </label>
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={e => setStartDate(e.target.value)}
                                            className="w-full px-4 py-2.5 border border-lab-line rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-lab-coral focus:border-lab-coral"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-lab-muted mb-1.5">
                                            Einddatum <span className="text-lab-muted font-normal">(optioneel)</span>
                                        </label>
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={e => setEndDate(e.target.value)}
                                            className="w-full px-4 py-2.5 border border-lab-line rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-lab-coral focus:border-lab-coral"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section: Mission assignment */}
                        <section>
                            <h3 className="text-sm font-bold text-lab-muted uppercase tracking-wider mb-4">Opdrachten</h3>
                            <div className="grid grid-cols-2 gap-4">

                                {/* Left: Available missions */}
                                <div>
                                    <p className="text-xs font-bold text-lab-muted mb-2 uppercase tracking-wide">Beschikbaar</p>
                                    <div className="border border-lab-line rounded-2xl overflow-hidden">
                                        {availableMissions.length === 0 ? (
                                            <div className="py-8 text-center text-lab-muted text-sm">
                                                Alle opdrachten zijn toegewezen
                                            </div>
                                        ) : (
                                            <ul className="divide-y divide-slate-50 max-h-72 overflow-y-auto">
                                                {availableMissions.map(mission => {
                                                    const isElsewhere = assignedMissionIds.has(mission.id);
                                                    return (
                                                        <li key={mission.id}>
                                                            <button
                                                                onClick={() => !isElsewhere && onAssignMission(mission.id)}
                                                                disabled={isElsewhere}
                                                                title={isElsewhere ? 'Al toegewezen aan een andere container' : `Voeg ${mission.name} toe`}
                                                                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                                                                    isElsewhere
                                                                        ? 'opacity-40 cursor-not-allowed bg-white'
                                                                        : 'hover:bg-lab-coral hover:text-white bg-white cursor-pointer'
                                                                }`}
                                                            >
                                                                <span className="w-7 h-7 flex-shrink-0 bg-lab-cream rounded-lg flex items-center justify-center text-[10px] font-black text-lab-muted">
                                                                    {mission.short}
                                                                </span>
                                                                <div className="flex-1 min-w-0">
                                                                    <span className={`text-sm font-semibold block truncate ${isElsewhere ? 'text-lab-muted' : 'text-lab-ink'}`}>
                                                                        {mission.name}
                                                                    </span>
                                                                    {isElsewhere && (
                                                                        <span className="text-[10px] text-lab-muted">Al in andere container</span>
                                                                    )}
                                                                </div>
                                                                {!isElsewhere && (
                                                                    <Plus size={14} className="text-lab-coral flex-shrink-0" />
                                                                )}
                                                            </button>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        )}
                                    </div>
                                </div>

                                {/* Right: Assigned missions */}
                                <div>
                                    <p className="text-xs font-bold text-lab-muted mb-2 uppercase tracking-wide">
                                        In deze container
                                        <span className="ml-1.5 text-lab-muted">{sortedAssigned.length}</span>
                                    </p>
                                    <div className="border border-lab-line rounded-2xl overflow-hidden">
                                        {sortedAssigned.length === 0 ? (
                                            <div className="py-8 text-center text-lab-muted text-sm">
                                                Nog geen opdrachten
                                            </div>
                                        ) : (
                                            <ul className="divide-y divide-slate-50 max-h-72 overflow-y-auto">
                                                {sortedAssigned.map((mc, index) => {
                                                    const info = getMissionInfo(mc.missionId);
                                                    const isRev = reviewStates[mc.missionId] ?? mc.isReview;
                                                    return (
                                                        <li key={mc.missionId} className="flex items-center gap-2 px-3 py-2.5 bg-white">
                                                            {/* Reorder */}
                                                            <div className="flex flex-col gap-0.5 flex-shrink-0">
                                                                <button
                                                                    onClick={() => handleMoveUp(index)}
                                                                    disabled={index === 0}
                                                                    className="p-0.5 text-lab-muted hover:text-lab-muted disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                                                                >
                                                                    <ChevronUp size={13} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleMoveDown(index)}
                                                                    disabled={index === sortedAssigned.length - 1}
                                                                    className="p-0.5 text-lab-muted hover:text-lab-muted disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                                                                >
                                                                    <ChevronDown size={13} />
                                                                </button>
                                                            </div>

                                                            {/* Short badge */}
                                                            <span className="w-6 h-6 flex-shrink-0 bg-lab-coral rounded-md flex items-center justify-center text-[9px] font-black text-lab-coral">
                                                                {info?.short ?? '?'}
                                                            </span>

                                                            {/* Name */}
                                                            <span className="flex-1 text-xs font-semibold text-lab-ink truncate min-w-0">
                                                                {info?.name ?? mc.missionId}
                                                            </span>

                                                            {/* Review toggle */}
                                                            <button
                                                                onClick={() => toggleReview(mc.missionId)}
                                                                title={isRev ? 'Reviewopdracht — klik om te wijzigen' : 'Normale opdracht — klik om review te maken'}
                                                                className={`flex-shrink-0 p-1 rounded-lg transition-colors ${
                                                                    isRev
                                                                        ? 'bg-lab-gold text-lab-ink'
                                                                        : 'text-lab-muted hover:text-lab-muted hover:bg-lab-gold hover:text-lab-ink'
                                                                }`}
                                                            >
                                                                <BookOpen size={13} />
                                                            </button>

                                                            {/* Remove */}
                                                            <button
                                                                onClick={() => onRemoveMission(mc.missionId)}
                                                                className="flex-shrink-0 p-1 text-lab-muted hover:text-lab-muted hover:bg-lab-coral hover:text-white rounded-lg transition-colors"
                                                            >
                                                                <X size={13} />
                                                            </button>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section: SLO summary */}
                        {assignedMissionNames.length > 0 && (
                            <section>
                                <h3 className="text-sm font-bold text-lab-muted uppercase tracking-wider mb-3">Gedekte opdrachten</h3>
                                <div className="bg-lab-cream rounded-2xl p-4 border border-lab-line">
                                    <p className="text-xs text-lab-muted mb-2">
                                        Deze container bevat {assignedMissionNames.length} opdracht{assignedMissionNames.length !== 1 ? 'en' : ''}:
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {assignedMissionNames.map(name => (
                                            <span
                                                key={name}
                                                className="inline-flex items-center px-2.5 py-1 bg-white border border-lab-line rounded-lg text-xs font-semibold text-lab-muted"
                                            >
                                                {name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex-shrink-0 flex items-center justify-end gap-3 px-6 py-4 border-t border-lab-line bg-lab-cream">
                        <button
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm font-bold text-lab-muted hover:text-lab-ink hover:bg-lab-cream rounded-xl transition-colors"
                        >
                            Annuleren
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!label.trim()}
                            className="px-6 py-2.5 text-sm font-bold bg-lab-coral text-white rounded-xl hover:bg-lab-coral hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
                        >
                            Opslaan
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
