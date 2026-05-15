import React, { useEffect, useState, useCallback } from 'react';
import {
    Brain,
    CheckCircle2,
    ArrowRightCircle,
    Trash2,
    Save,
    Edit2,
    X,
} from 'lucide-react';
import {
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    subscribeToNotes,
    type DeveloperNote,
    type DeveloperNoteLabel,
} from '@/services/developerNotesService';

// --- Helpers ---

const LABEL_CONFIG: Record<DeveloperNoteLabel, {
    label: string;
    icon: React.FC<{ size?: number; className?: string }>;
    bg: string;
    text: string;
    border: string;
    btnActive: string;
    btnInactive: string;
}> = {
    gedachte: {
        label: 'Gedachte',
        icon: Brain,
        bg: 'bg-lab-teal/15',
        text: 'text-lab-teal',
        border: 'border-lab-teal/35',
        btnActive: 'bg-lab-teal text-white',
        btnInactive: 'bg-lab-cream text-lab-teal hover:bg-lab-teal hover:text-white',
    },
    werklog: {
        label: 'Werklog',
        icon: CheckCircle2,
        bg: 'bg-lab-sage/15',
        text: 'text-lab-sage',
        border: 'border-lab-sage/35',
        btnActive: 'bg-lab-sage text-white',
        btnInactive: 'bg-lab-cream text-lab-sage hover:bg-lab-sage hover:text-white',
    },
    handoff: {
        label: 'Handoff',
        icon: ArrowRightCircle,
        bg: 'bg-lab-coral/15',
        text: 'text-lab-coral',
        border: 'border-lab-coral/35',
        btnActive: 'bg-lab-coral text-white',
        btnInactive: 'bg-lab-cream text-lab-coral hover:bg-lab-coral hover:text-white',
    },
};

function relativeTime(iso: string): string {
    const rtf = new Intl.RelativeTimeFormat('nl', { numeric: 'auto' });
    const diff = (new Date(iso).getTime() - Date.now()) / 1000;
    const absDiff = Math.abs(diff);
    if (absDiff < 60)    return rtf.format(Math.round(diff), 'second');
    if (absDiff < 3600)  return rtf.format(Math.round(diff / 60), 'minute');
    if (absDiff < 86400) return rtf.format(Math.round(diff / 3600), 'hour');
    return rtf.format(Math.round(diff / 86400), 'day');
}

function fullDate(iso: string): string {
    return new Date(iso).toLocaleString('nl-NL', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
}

// --- Component ---

export const DeveloperNotesPanel: React.FC = () => {
    const [notes, setNotes] = useState<DeveloperNote[]>([]);
    const [loading, setLoading] = useState(true);

    // Invoer
    const [body, setBody] = useState('');
    const [selectedLabel, setSelectedLabel] = useState<DeveloperNoteLabel>('gedachte');
    const [saving, setSaving] = useState(false);

    // Filter
    const [filterLabel, setFilterLabel] = useState<DeveloperNoteLabel | 'alle'>('alle');

    // Inline edit
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editBody, setEditBody] = useState('');
    const [editLabel, setEditLabel] = useState<DeveloperNoteLabel>('gedachte');
    const [editSaving, setEditSaving] = useState(false);

    useEffect(() => {
        const unsub = subscribeToNotes((fetched) => {
            setNotes(fetched);
            setLoading(false);
        });
        // Fallback: als subscribeToNotes async is en loading nooit reset
        fetchNotes().then((fetched) => {
            setNotes(fetched);
            setLoading(false);
        }).catch(() => setLoading(false));
        return unsub;
    }, []);

    const handleSave = useCallback(async () => {
        const trimmed = body.trim();
        if (!trimmed || saving) return;
        setSaving(true);
        try {
            await createNote({ label: selectedLabel, body: trimmed });
            setBody('');
        } catch (err) {
            console.error('[DeveloperNotesPanel] createNote:', err);
        } finally {
            setSaving(false);
        }
    }, [body, selectedLabel, saving]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            e.preventDefault();
            handleSave();
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteNote(id);
        } catch (err) {
            console.error('[DeveloperNotesPanel] deleteNote:', err);
        }
    };

    const startEdit = (note: DeveloperNote) => {
        setEditingId(note.id);
        setEditBody(note.body);
        setEditLabel(note.label);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditBody('');
    };

    const handleEditSave = async (id: string) => {
        const trimmed = editBody.trim();
        if (!trimmed || editSaving) return;
        setEditSaving(true);
        try {
            await updateNote(id, { label: editLabel, body: trimmed });
            setEditingId(null);
        } catch (err) {
            console.error('[DeveloperNotesPanel] updateNote:', err);
        } finally {
            setEditSaving(false);
        }
    };

    const filtered = filterLabel === 'alle'
        ? notes
        : notes.filter(n => n.label === filterLabel);

    const lastHandoff = notes.find(n => n.label === 'handoff');

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <div className="w-8 h-8 border-3 border-lab-coral border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-300">

            {/* Laatste handoff banner */}
            {lastHandoff && (
                <div className="bg-lab-coral border border-lab-coral rounded-2xl p-5 flex gap-4 items-start text-white">
                    <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center shrink-0">
                        <ArrowRightCircle size={20} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black text-white/75 uppercase tracking-widest mb-1">Laatste handoff - hoe verder</p>
                        <p className="text-sm text-white leading-relaxed whitespace-pre-wrap line-clamp-3">
                            {lastHandoff.body}
                        </p>
                        <p className="text-[10px] text-white/75 mt-1.5" title={fullDate(lastHandoff.createdAt)}>
                            {relativeTime(lastHandoff.createdAt)}
                        </p>
                    </div>
                </div>
            )}

            {/* Invoergedeelte */}
            <div className="bg-white rounded-3xl border border-lab-line shadow-sm p-6 space-y-4">
                <h3 className="text-sm font-black text-lab-ink uppercase tracking-widest">Nieuwe notitie</h3>

                <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Schrijf een gedachte, werklog of handoff... (Cmd+Enter om op te slaan)"
                    rows={4}
                    className="w-full px-4 py-3 bg-lab-cream border border-lab-line rounded-xl text-sm text-lab-ink placeholder-slate-400 focus:ring-2 focus:ring-lab-coral outline-none resize-none transition-all"
                />

                <div className="flex flex-wrap items-center gap-2">
                    {(Object.keys(LABEL_CONFIG) as DeveloperNoteLabel[]).map((lbl) => {
                        const cfg = LABEL_CONFIG[lbl];
                        const Icon = cfg.icon;
                        const isActive = selectedLabel === lbl;
                        return (
                            <button
                                key={lbl}
                                onClick={() => setSelectedLabel(lbl)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    isActive ? cfg.btnActive : cfg.btnInactive
                                }`}
                            >
                                <Icon size={13} />
                                {cfg.label}
                            </button>
                        );
                    })}

                    <button
                        onClick={handleSave}
                        disabled={!body.trim() || saving}
                        className="ml-auto inline-flex items-center gap-2 px-4 py-2 bg-lab-coral text-white rounded-xl text-xs font-bold hover:bg-lab-coral hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                        <Save size={14} />
                        {saving ? 'Opslaan...' : 'Opslaan'}
                    </button>
                </div>
            </div>

            {/* Filterrij */}
            <div className="flex flex-wrap gap-2">
                {(['alle', 'gedachte', 'werklog', 'handoff'] as const).map((lbl) => {
                    const isActive = filterLabel === lbl;
                    const cfg = lbl !== 'alle' ? LABEL_CONFIG[lbl] : null;
                    return (
                        <button
                            key={lbl}
                            onClick={() => setFilterLabel(lbl)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${
                                isActive
                                    ? (cfg ? cfg.btnActive : 'bg-lab-ink text-white')
                                    : (cfg ? cfg.btnInactive : 'bg-lab-cream text-lab-muted hover:bg-lab-creamDeep')
                            }`}
                        >
                            {lbl === 'alle' ? 'Alle' : LABEL_CONFIG[lbl].label}
                            {lbl !== 'alle' && (
                                <span className="ml-1.5 opacity-70">
                                    {notes.filter(n => n.label === lbl).length}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Lijst */}
            {filtered.length === 0 ? (
                <div className="bg-white rounded-2xl border border-lab-line p-12 text-center">
                    <div className="space-y-3">
                        <p className="text-lab-muted font-bold">Nog geen notities</p>
                        <p className="text-sm text-lab-muted max-w-sm mx-auto leading-relaxed">
                            Gebruik <span className="font-bold text-lab-teal">Gedachte</span> voor ideeën en twijfels,{' '}
                            <span className="font-bold text-lab-sage">Werklog</span> voor wat je gedaan hebt, en{' '}
                            <span className="font-bold text-lab-muted">Handoff</span> om morgen meteen te weten hoe je verder gaat.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map((note) => {
                        const cfg = LABEL_CONFIG[note.label];
                        const Icon = cfg.icon;
                        const isEditing = editingId === note.id;

                        return (
                            <div
                                key={note.id}
                                className={`bg-white rounded-2xl border ${cfg.border} shadow-sm p-5`}
                            >
                                <div className="flex items-start gap-3">
                                    {/* Label badge */}
                                    <div className={`${cfg.bg} p-2 rounded-lg shrink-0 mt-0.5`}>
                                        <Icon size={16} className={cfg.text} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        {/* Meta */}
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
                                                {cfg.label}
                                            </span>
                                            <span
                                                className="text-[10px] text-lab-muted font-medium"
                                                title={fullDate(note.createdAt)}
                                            >
                                                {relativeTime(note.createdAt)}
                                                {note.updatedAt !== note.createdAt && (
                                                    <span className="ml-1 italic" title={`Bewerkt: ${fullDate(note.updatedAt)}`}>
                                                        (bewerkt)
                                                    </span>
                                                )}
                                            </span>
                                        </div>

                                        {/* Body — edit-mode of weergave */}
                                        {isEditing ? (
                                            <div className="space-y-3">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {(Object.keys(LABEL_CONFIG) as DeveloperNoteLabel[]).map((lbl) => {
                                                        const lCfg = LABEL_CONFIG[lbl];
                                                        const LIcon = lCfg.icon;
                                                        return (
                                                            <button
                                                                key={lbl}
                                                                onClick={() => setEditLabel(lbl)}
                                                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                                                                    editLabel === lbl ? lCfg.btnActive : lCfg.btnInactive
                                                                }`}
                                                            >
                                                                <LIcon size={11} />
                                                                {lCfg.label}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                                <textarea
                                                    value={editBody}
                                                    onChange={(e) => setEditBody(e.target.value)}
                                                    rows={4}
                                                    className="w-full px-3 py-2 bg-lab-cream border border-lab-line rounded-xl text-sm text-lab-ink focus:ring-2 focus:ring-lab-coral outline-none resize-none transition-all"
                                                    autoFocus
                                                />
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEditSave(note.id)}
                                                        disabled={!editBody.trim() || editSaving}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-lab-coral text-white rounded-lg text-xs font-bold hover:bg-lab-coral hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                                    >
                                                        <Save size={12} />
                                                        {editSaving ? 'Opslaan...' : 'Opslaan'}
                                                    </button>
                                                    <button
                                                        onClick={cancelEdit}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-lab-cream text-lab-muted rounded-lg text-xs font-bold hover:bg-lab-creamDeep transition-all"
                                                    >
                                                        <X size={12} />
                                                        Annuleren
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <p
                                                className="text-sm text-lab-ink leading-relaxed whitespace-pre-wrap cursor-pointer hover:text-lab-muted transition-colors"
                                                onClick={() => startEdit(note)}
                                                title="Klik om te bewerken"
                                            >
                                                {note.body}
                                            </p>
                                        )}
                                    </div>

                                    {/* Acties */}
                                    {!isEditing && (
                                        <div className="flex gap-1 shrink-0">
                                            <button
                                                onClick={() => startEdit(note)}
                                                className="p-1.5 text-lab-muted hover:text-lab-muted hover:bg-lab-cream rounded-lg transition-all"
                                                title="Bewerken"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(note.id)}
                                                className="p-1.5 text-lab-muted hover:text-lab-muted hover:bg-lab-coral hover:text-white rounded-lg transition-all"
                                                title="Verwijderen"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
