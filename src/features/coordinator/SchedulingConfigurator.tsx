import React, { useState, useCallback } from 'react';
import {
    Settings,
    Plus,
    Trash2,
    ArrowUp,
    ArrowDown,
    RotateCcw,
    Check,
    Layout,
    X,
    GripVertical,
} from 'lucide-react';
import { useSchoolContainers } from '@/hooks/useSchoolContainers';
import {
    createContainer,
    deleteContainer,
    reorderContainers,
    seedTemplateContainersForSchool,
    resetToDefaultScheduling,
    updateContainer,
    assignMissionToContainer,
    removeMissionFromContainer,
    reorderContainerMissions,
} from '@/services/containerService';
import { ContainerEditor } from './ContainerEditor';
import { getMissionsForYear } from '@/config/missions';
import { SCHEDULING_TEMPLATES, SchedulingTemplate } from '@/config/containerTypes';
import { getContainerTheme, getAutoTheme } from '@/config/containerThemes';
import { supabase } from '@/services/supabase';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface SchedulingConfiguratorProps {
    schoolId: string;
    yearGroup: number;
    onClose: () => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function useSchedulingModel(schoolId: string) {
    const [model, setModel] = useState<'default' | 'custom' | null>(null);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
        setLoading(true);
        const { data } = await supabase
            .from('school_configs')
            .select('*')
            .eq('school_id', schoolId)
            .single();
        setModel(((data as any)?.scheduling_model as 'default' | 'custom') ?? 'default');
        setLoading(false);
    }, [schoolId]);

    React.useEffect(() => { refresh(); }, [refresh]);

    return { model, loading, refresh };
}

// ---------------------------------------------------------------------------
// SLO Coverage Bar
// ---------------------------------------------------------------------------

interface SloCoverageBarProps {
    codes: string[];
}

const SloCoverageBar: React.FC<SloCoverageBarProps> = ({ codes }) => {
    const ALL_CODES = ['21A', '21B', '21C', '21D', '22A', '22B', '23A', '23B', '23C'];
    const covered = ALL_CODES.filter(c => codes.includes(c));
    const pct = ALL_CODES.length > 0 ? Math.round((covered.length / ALL_CODES.length) * 100) : 0;

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-lab-muted uppercase tracking-widest">SLO Kerndoel Dekking</span>
                <span className="text-xs font-black text-lab-muted">{pct}%</span>
            </div>
            <div className="h-2 bg-lab-cream rounded-full overflow-hidden">
                <div
                    className="h-full bg-lab-coral rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                />
            </div>
            <div className="flex flex-wrap gap-1">
                {ALL_CODES.map(code => (
                    <span
                        key={code}
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                            covered.includes(code)
                                ? 'bg-lab-coral text-white'
                                : 'bg-lab-cream text-lab-muted'
                        }`}
                    >
                        {code}
                    </span>
                ))}
            </div>
        </div>
    );
};

// ---------------------------------------------------------------------------
// Template Selector
// ---------------------------------------------------------------------------

interface TemplateSelectorProps {
    schoolId: string;
    yearGroup: number;
    onTemplateChosen: () => void;
    onKeepDefault: () => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
    schoolId,
    yearGroup,
    onTemplateChosen,
    onKeepDefault,
}) => {
    const [seeding, setSeeding] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSelect = async (template: SchedulingTemplate) => {
        setSeeding(template.id);
        setError(null);
        try {
            await seedTemplateContainersForSchool(schoolId, yearGroup, template);
            onTemplateChosen();
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Onbekende fout');
            setSeeding(null);
        }
    };

    return (
        <div className="space-y-4">
            <p className="text-sm text-lab-muted">
                Kies een startstructuur voor leerjaar {yearGroup}. Je kunt daarna alles aanpassen.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SCHEDULING_TEMPLATES.map(template => (
                    <button
                        key={template.id}
                        onClick={() => handleSelect(template)}
                        disabled={seeding !== null}
                        className={`text-left p-4 border rounded-2xl transition-all ${
                            seeding === template.id
                                ? 'border-lab-coral bg-lab-coral opacity-70 cursor-wait'
                                : 'border-lab-line bg-white hover:border-lab-coral hover:shadow-md hover:shadow-lab-coral/50'
                        }`}
                    >
                        <div className="flex items-start justify-between gap-2">
                            <div className="w-8 h-8 bg-lab-coral rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Layout size={16} className="text-lab-coral" />
                            </div>
                            {seeding === template.id && (
                                <div className="w-4 h-4 border-2 border-lab-coral border-t-transparent rounded-full animate-spin flex-shrink-0" />
                            )}
                        </div>
                        <div className="mt-3">
                            <div className="font-black text-lab-ink text-sm">{template.name}</div>
                            <div className="text-xs text-lab-muted mt-1">{template.description}</div>
                            <div className="text-[10px] font-bold text-lab-muted uppercase tracking-widest mt-2">
                                {template.defaultContainerCount} containers · {template.labelPattern}
                            </div>
                        </div>
                    </button>
                ))}
            </div>
            {error && (
                <div className="p-3 bg-lab-coral text-white text-sm rounded-xl border border-lab-coral">
                    {error}
                </div>
            )}
            <button
                onClick={onKeepDefault}
                className="w-full p-3 border border-lab-line text-lab-muted text-sm font-bold rounded-xl hover:bg-lab-cream transition-all"
            >
                Behoud huidige indeling (standaard curriculum)
            </button>
        </div>
    );
};

// ---------------------------------------------------------------------------
// Container Card
// ---------------------------------------------------------------------------

interface ContainerCardProps {
    container: {
        id: string;
        label: string;
        subtitle?: string;
        colorKey?: string;
        sloFocus: string[];
        missions: { missionId: string }[];
    };
    index: number;
    total: number;
    onEdit: () => void;
    onDelete: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    isDeleting: boolean;
}

const ContainerCard: React.FC<ContainerCardProps> = ({
    container,
    index,
    total,
    onEdit,
    onDelete,
    onMoveUp,
    onMoveDown,
    isDeleting,
}) => {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const theme = getAutoTheme(index);

    const handleDeleteClick = () => {
        if (confirmDelete) {
            onDelete();
        } else {
            setConfirmDelete(true);
        }
    };

    return (
        <div className={`flex items-center gap-3 p-4 border rounded-2xl bg-white transition-all ${
            isDeleting ? 'opacity-50 pointer-events-none' : 'border-lab-line hover:border-lab-line hover:shadow-sm'
        }`}>
            {/* Drag handle (visual only) */}
            <div className="text-lab-muted cursor-grab flex-shrink-0">
                <GripVertical size={16} />
            </div>

            {/* Color dot */}
            <div className={`w-3 h-3 rounded-full flex-shrink-0 ${theme.bg} border-2 ${theme.border}`} />

            {/* Label + subtitle */}
            <div className="flex-1 min-w-0">
                <div className="font-black text-lab-ink text-sm truncate">{container.label}</div>
                {container.subtitle && (
                    <div className="text-xs text-lab-muted truncate">{container.subtitle}</div>
                )}
                <div className="flex flex-wrap gap-1 mt-1.5">
                    <span className="text-[10px] font-bold text-lab-muted bg-lab-cream px-2 py-0.5 rounded-lg border border-lab-line">
                        {container.missions.length} missie{container.missions.length !== 1 ? 's' : ''}
                    </span>
                    {container.sloFocus.slice(0, 3).map(code => (
                        <span key={code} className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${theme.bg} ${theme.text}`}>
                            {code}
                        </span>
                    ))}
                    {container.sloFocus.length > 3 && (
                        <span className="text-[10px] font-bold text-lab-muted bg-lab-cream px-2 py-0.5 rounded-lg border border-lab-line">
                            +{container.sloFocus.length - 3}
                        </span>
                    )}
                </div>
            </div>

            {/* Reorder */}
            <div className="flex flex-col gap-1 flex-shrink-0">
                <button
                    onClick={onMoveUp}
                    disabled={index === 0}
                    className="w-6 h-6 flex items-center justify-center text-lab-muted hover:text-lab-muted disabled:opacity-25 transition-colors"
                    title="Omhoog"
                >
                    <ArrowUp size={12} />
                </button>
                <button
                    onClick={onMoveDown}
                    disabled={index === total - 1}
                    className="w-6 h-6 flex items-center justify-center text-lab-muted hover:text-lab-muted disabled:opacity-25 transition-colors"
                    title="Omlaag"
                >
                    <ArrowDown size={12} />
                </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
                <button
                    onClick={onEdit}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-lab-coral rounded-xl hover:bg-lab-coral hover:text-white transition-colors"
                >
                    <Settings size={12} className="inline mr-1" />
                    Bewerken
                </button>
                {confirmDelete ? (
                    <button
                        onClick={handleDeleteClick}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-lab-coral rounded-xl hover:bg-lab-coral hover:text-white transition-colors"
                    >
                        Bevestig
                    </button>
                ) : (
                    <button
                        onClick={handleDeleteClick}
                        className="w-8 h-8 flex items-center justify-center text-lab-muted hover:text-lab-muted hover:bg-lab-coral hover:text-white rounded-xl transition-colors"
                        title="Verwijderen"
                        onBlur={() => setConfirmDelete(false)}
                    >
                        <Trash2 size={14} />
                    </button>
                )}
            </div>
        </div>
    );
};

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export const SchedulingConfigurator: React.FC<SchedulingConfiguratorProps> = ({
    schoolId,
    yearGroup,
    onClose,
}) => {
    const { model, loading: modelLoading, refresh: refreshModel } = useSchedulingModel(schoolId);
    const { containers, loading: containersLoading, refresh: refreshContainers } = useSchoolContainers(schoolId, yearGroup);

    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [adding, setAdding] = useState(false);
    const [resetting, setResetting] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);
    const [savedFeedback, setSavedFeedback] = useState(false);

    // ContainerEditor is delegated — this tracks which container is being edited
    const [editingContainerId, setEditingContainerId] = useState<string | null>(null);

    const isLoading = modelLoading || containersLoading;

    // Collect all SLO codes across containers for the coverage bar
    const allSloCodes = containers.flatMap(c => c.sloFocus);

    const handleMoveContainer = async (index: number, direction: 'up' | 'down') => {
        const newOrder = [...containers];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        if (swapIndex < 0 || swapIndex >= newOrder.length) return;
        [newOrder[index], newOrder[swapIndex]] = [newOrder[swapIndex], newOrder[index]];

        setActionError(null);
        try {
            await reorderContainers(schoolId, yearGroup, newOrder.map(c => c.id));
            await refreshContainers();
        } catch (e) {
            setActionError(e instanceof Error ? e.message : 'Volgorde opslaan mislukt');
        }
    };

    const handleDeleteContainer = async (containerId: string) => {
        setDeletingId(containerId);
        setActionError(null);
        try {
            await deleteContainer(containerId);
            await refreshContainers();
        } catch (e) {
            setActionError(e instanceof Error ? e.message : 'Verwijderen mislukt');
        } finally {
            setDeletingId(null);
        }
    };

    const handleAddContainer = async () => {
        setAdding(true);
        setActionError(null);
        try {
            const newContainer = await createContainer(schoolId, yearGroup, {
                label: `Container ${containers.length + 1}`,
                containerType: 'custom',
                sortOrder: containers.length,
                sloFocus: [],
                isReviewGate: false,
                metadata: {},
                missions: [],
            });
            await refreshContainers();
            setEditingContainerId(newContainer.id);
        } catch (e) {
            setActionError(e instanceof Error ? e.message : 'Container aanmaken mislukt');
        } finally {
            setAdding(false);
        }
    };

    const handleReset = async () => {
        if (!window.confirm('Weet je zeker dat je terugwilt naar de standaard indeling? Alle aangepaste containers worden verwijderd.')) return;
        setResetting(true);
        setActionError(null);
        try {
            await resetToDefaultScheduling(schoolId);
            await refreshModel();
            await refreshContainers();
        } catch (e) {
            setActionError(e instanceof Error ? e.message : 'Reset mislukt');
        } finally {
            setResetting(false);
        }
    };

    const handleSave = () => {
        setSavedFeedback(true);
        setTimeout(() => setSavedFeedback(false), 2000);
    };

    // ---------------------------------------------------------------------------
    // Render
    // ---------------------------------------------------------------------------

    return (
        <div className="bg-white rounded-[2rem] shadow-xl shadow-lab-line/50 border border-lab-line overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-lab-line">
                <div>
                    <h2 className="text-lg font-black text-lab-ink flex items-center gap-2">
                        <Settings size={20} className="text-lab-muted" />
                        Leerlijn Inrichten
                    </h2>
                    <p className="text-sm text-lab-muted mt-0.5">
                        Leerjaar {yearGroup} — {model === 'custom' ? 'Aangepaste indeling' : 'Standaard curriculum'}
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="w-9 h-9 flex items-center justify-center text-lab-muted hover:text-lab-muted hover:bg-lab-cream rounded-xl transition-colors"
                    title="Sluiten"
                >
                    <X size={18} />
                </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
                {/* Loading state */}
                {isLoading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="w-8 h-8 border-2 border-lab-coral border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                {/* Template selector — only when model is 'default' */}
                {!isLoading && model === 'default' && (
                    <div className="space-y-4">
                        <h3 className="text-xs font-black text-lab-muted uppercase tracking-widest flex items-center gap-2">
                            <Layout size={14} />
                            Kies een structuur
                        </h3>
                        <TemplateSelector
                            schoolId={schoolId}
                            yearGroup={yearGroup}
                            onTemplateChosen={async () => {
                                await refreshModel();
                                await refreshContainers();
                            }}
                            onKeepDefault={onClose}
                        />
                    </div>
                )}

                {/* Container list — only when model is 'custom' */}
                {!isLoading && model === 'custom' && (
                    <>
                        {/* Container list */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-black text-lab-muted uppercase tracking-widest flex items-center gap-2">
                                <Layout size={14} />
                                Containers ({containers.length})
                            </h3>

                            {containers.length === 0 && (
                                <div className="p-6 bg-lab-cream rounded-2xl text-center text-sm text-lab-muted border border-lab-line">
                                    Nog geen containers. Voeg er hieronder een toe.
                                </div>
                            )}

                            {containers.map((container, index) => (
                                <ContainerCard
                                    key={container.id}
                                    container={container}
                                    index={index}
                                    total={containers.length}
                                    onEdit={() => setEditingContainerId(container.id)}
                                    onDelete={() => handleDeleteContainer(container.id)}
                                    onMoveUp={() => handleMoveContainer(index, 'up')}
                                    onMoveDown={() => handleMoveContainer(index, 'down')}
                                    isDeleting={deletingId === container.id}
                                />
                            ))}

                            {/* ContainerEditor — shown when editing */}
                            {(() => {
                                const editing = editingContainerId
                                    ? containers.find(c => c.id === editingContainerId)
                                    : undefined;
                                if (!editing) return null;
                                return (
                                    <ContainerEditor
                                        container={editing}
                                        yearGroup={yearGroup}
                                        allMissions={getMissionsForYear(yearGroup)}
                                        assignedMissionIds={new Set(
                                            containers
                                                .filter(c => c.id !== editingContainerId)
                                                .flatMap(c => c.missions.map(m => m.missionId))
                                        )}
                                        onAssignMission={async (missionId) => {
                                            await assignMissionToContainer(editingContainerId, missionId, editing.missions.length);
                                            await refreshContainers();
                                        }}
                                        onRemoveMission={async (missionId) => {
                                            await removeMissionFromContainer(editingContainerId, missionId);
                                            await refreshContainers();
                                        }}
                                        onReorderMissions={async (ids) => {
                                            await reorderContainerMissions(editingContainerId, ids);
                                            await refreshContainers();
                                        }}
                                        onClose={() => setEditingContainerId(null)}
                                        onSave={async (updated) => {
                                            await updateContainer(editingContainerId, updated);
                                            if (updated.missions) {
                                                for (const m of updated.missions) {
                                                    await assignMissionToContainer(
                                                        editingContainerId,
                                                        m.missionId,
                                                        m.sortOrder,
                                                        m.isReview
                                                    );
                                                }
                                            }
                                            await refreshContainers();
                                        }}
                                    />
                                );
                            })()}

                            {/* Add button */}
                            <button
                                onClick={handleAddContainer}
                                disabled={adding}
                                className="w-full p-3 border-2 border-dashed border-lab-line text-lab-muted text-sm font-bold rounded-2xl hover:border-lab-coral hover:text-lab-coral hover:bg-lab-coral hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-wait"
                            >
                                {adding ? (
                                    <div className="w-4 h-4 border-2 border-lab-coral border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <Plus size={16} />
                                )}
                                Container toevoegen
                            </button>
                        </div>

                        {/* SLO coverage summary */}
                        <div className="p-4 bg-lab-cream rounded-2xl border border-lab-line">
                            <SloCoverageBar codes={allSloCodes} />
                        </div>

                        {/* Error */}
                        {actionError && (
                            <div className="p-3 bg-lab-coral text-white text-sm rounded-xl border border-lab-coral">
                                {actionError}
                            </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex items-center justify-between gap-3 pt-2 border-t border-lab-line">
                            <button
                                onClick={handleReset}
                                disabled={resetting}
                                className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-lab-muted border border-lab-line rounded-xl hover:bg-lab-cream hover:text-lab-muted transition-all disabled:opacity-50 disabled:cursor-wait"
                            >
                                {resetting ? (
                                    <div className="w-4 h-4 border-2 border-lab-line border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <RotateCcw size={14} />
                                )}
                                Reset naar standaard
                            </button>
                            <button
                                onClick={handleSave}
                                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-black text-white rounded-xl transition-all ${
                                    savedFeedback
                                        ? 'bg-lab-coral hover:bg-lab-sage hover:text-white'
                                        : 'bg-lab-coral hover:bg-lab-coral hover:text-white'
                                }`}
                            >
                                <Check size={14} />
                                {savedFeedback ? 'Opgeslagen!' : 'Opslaan'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
