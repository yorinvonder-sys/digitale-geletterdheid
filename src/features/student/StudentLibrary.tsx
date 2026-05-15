/**
 * StudentLibrary.tsx
 * Modal component showing student's saved games, books, and other creations
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Gamepad2, Trash2, Play, Loader2, FolderOpen, Sparkles, AlertTriangle } from 'lucide-react';
import { getLibraryItems, deleteLibraryItem, LibraryItem } from '@/services/libraryService';

interface StudentLibraryProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    onOpenItem?: (item: LibraryItem) => void;
    onStartMission?: () => void;
}

const getTypeIcon = (type: LibraryItem['type']) => {
    switch (type) {
        case 'game': return <Gamepad2 size={20} className="text-lab-muted" />;
        case 'book': return <BookOpen size={20} className="text-lab-muted" />;
        case 'chatbot': return <Sparkles size={20} className="text-lab-muted" />;
        case 'drawing': return <span className="text-lg">🎨</span>;
        default: return <FolderOpen size={20} className="text-lab-muted" />;
    }
};

const getTypeLabel = (type: LibraryItem['type']) => {
    switch (type) {
        case 'game': return 'Game';
        case 'book': return 'Boek';
        case 'chatbot': return 'Chatbot';
        case 'drawing': return 'Tekening';
        default: return 'Project';
    }
};

const getTypeBgColor = (type: LibraryItem['type']) => {
    switch (type) {
        case 'game': return 'bg-lab-sage border-lab-sage';
        case 'book': return 'bg-lab-coral border-lab-coral';
        case 'chatbot': return 'bg-lab-teal border-lab-teal';
        case 'drawing': return 'bg-lab-gold border-lab-gold';
        default: return 'bg-lab-cream border-lab-line';
    }
};

export const StudentLibrary: React.FC<StudentLibraryProps> = ({
    isOpen,
    onClose,
    userId,
    onOpenItem,
    onStartMission
}) => {
    const [items, setItems] = useState<LibraryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | LibraryItem['type']>('all');
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && userId) {
            loadItems();
        }
    }, [isOpen, userId]);

    const loadItems = async () => {
        setLoading(true);
        const libraryItems = await getLibraryItems(userId);
        setItems(libraryItems);
        setLoading(false);
    };

    const handleRequestDelete = (itemId: string) => {
        setPendingDeleteId(itemId);
    };

    const handleConfirmDelete = async () => {
        if (!pendingDeleteId) return;
        setDeleting(pendingDeleteId);
        setDeleteError(null);
        const success = await deleteLibraryItem(userId, pendingDeleteId);
        if (success) {
            setItems(prev => prev.filter(i => i.id !== pendingDeleteId));
            setPendingDeleteId(null);
        } else {
            setDeleteError('Verwijderen mislukt. Probeer het opnieuw.');
        }
        setDeleting(null);
    };

    const handleCancelDelete = () => {
        setPendingDeleteId(null);
        setDeleteError(null);
    };

    const filteredItems = filter === 'all'
        ? items
        : items.filter(item => item.type === filter);

    const formatDate = (date: any) => {
        if (!date) return '';
        const d = date.toDate ? date.toDate() : new Date(date);
        return d.toLocaleDateString('nl-NL', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="w-full max-w-4xl max-h-[85vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-lab-coral via-lab-teal to-lab-coral p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                                    <BookOpen size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black">Mijn Bibliotheek</h2>
                                    <p className="text-white/80 text-sm">{items.length} opgeslagen projecten</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                aria-label="Sluit bibliotheek"
                                className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                            >
                                <X size={24} aria-hidden="true" />
                            </button>
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                            {(['all', 'game', 'book', 'chatbot', 'drawing'] as const).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setFilter(type)}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${filter === type
                                        ? 'bg-white text-lab-teal'
                                        : 'bg-white/20 hover:bg-white/30'
                                        }`}
                                >
                                    {type === 'all' ? 'Alles' : getTypeLabel(type)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-12" role="status" aria-live="polite">
                                <Loader2 size={40} className="animate-spin text-lab-muted mb-4" aria-hidden="true" />
                                <p className="text-lab-muted">Bibliotheek laden...</p>
                            </div>
                        ) : filteredItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="w-20 h-20 bg-lab-cream rounded-full flex items-center justify-center mb-4">
                                    <FolderOpen size={32} className="text-lab-muted" />
                                </div>
                                <h3 className="font-bold text-lab-ink mb-2">Nog geen projecten</h3>
                                <p className="text-lab-muted text-sm max-w-xs">
                                    {filter === 'all'
                                        ? 'Maak een game, boek of chatbot in een missie en sla je creatie hier op!'
                                        : `Je hebt nog geen ${getTypeLabel(filter).toLowerCase()}s opgeslagen.`
                                    }
                                </p>
                                {filter === 'all' && onStartMission && (
                                    <button
                                        onClick={() => {
                                            onClose();
                                            onStartMission();
                                        }}
                                        className="mt-4 px-5 py-3 bg-lab-coral hover:bg-lab-coral hover:text-white text-white rounded-xl font-bold text-sm transition-colors"
                                    >
                                        Start een missie
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredItems.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className={`relative rounded-2xl border-2 overflow-hidden group hover:shadow-lg transition-all ${getTypeBgColor(item.type)}`}
                                    >
                                        {/* Thumbnail or Placeholder */}
                                        <div className="aspect-video bg-gradient-to-br from-lab-cream to-lab-creamDeep flex items-center justify-center relative">
                                            {item.thumbnail ? (
                                                <img
                                                    src={item.thumbnail}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center text-lab-muted">
                                                    {getTypeIcon(item.type)}
                                                    <span className="text-xs mt-1">{getTypeLabel(item.type)}</span>
                                                </div>
                                            )}

                                            {/* Hover Actions */}
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                                {onOpenItem && (
                                                    <button
                                                        onClick={() => onOpenItem(item)}
                                                        className="px-4 py-2 bg-white rounded-xl font-bold text-lab-ink text-sm flex items-center gap-2 hover:bg-lab-cream transition-colors"
                                                    >
                                                        <Play size={16} />
                                                        Openen
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => item.id && handleRequestDelete(item.id)}
                                                    disabled={deleting === item.id}
                                                    aria-label={deleting === item.id ? `Verwijderen van ${item.name}...` : `${item.name} verwijderen`}
                                                    className="p-2 bg-lab-coral rounded-xl text-white hover:bg-lab-coral hover:text-white transition-colors"
                                                >
                                                    {deleting === item.id ? (
                                                        <>
                                                            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                                                            <span className="sr-only">Bezig met verwijderen...</span>
                                                        </>
                                                    ) : (
                                                        <Trash2 size={16} aria-hidden="true" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="p-3">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-lab-ink text-sm truncate">{item.name}</h3>
                                                    <p className="text-xs text-lab-muted truncate">
                                                        {item.mission_name || item.mission_id}
                                                    </p>
                                                </div>
                                                <div className="flex-shrink-0">
                                                    {getTypeIcon(item.type)}
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-lab-muted mt-2">
                                                {formatDate(item.created_at)}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Delete confirmation overlay */}
                    {pendingDeleteId && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm rounded-3xl">
                            <div className="bg-white rounded-2xl p-6 shadow-2xl border border-lab-line w-full max-w-sm animate-in zoom-in-95 duration-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-lab-coral rounded-xl flex items-center justify-center flex-shrink-0">
                                        <AlertTriangle size={20} className="text-lab-coral" />
                                    </div>
                                    <h3 className="text-lg font-extrabold text-lab-ink">Verwijderen?</h3>
                                </div>
                                <p className="text-lab-muted text-sm mb-4 leading-relaxed">
                                    Weet je zeker dat je dit wilt verwijderen? Dit kan niet ongedaan worden gemaakt.
                                </p>
                                {deleteError && (
                                    <div className="mb-4 p-3 bg-lab-coral border border-lab-coral rounded-xl text-lab-coral text-sm font-medium flex items-center gap-2">
                                        <AlertTriangle size={16} />
                                        {deleteError}
                                    </div>
                                )}
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleCancelDelete}
                                        disabled={deleting === pendingDeleteId}
                                        className="flex-1 py-3 text-lab-muted font-bold text-sm hover:bg-lab-cream rounded-xl transition-colors disabled:opacity-50"
                                    >
                                        Annuleren
                                    </button>
                                    <button
                                        onClick={handleConfirmDelete}
                                        disabled={deleting === pendingDeleteId}
                                        className="flex-1 py-3 bg-lab-coral hover:bg-lab-coral hover:text-white text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {deleting === pendingDeleteId ? (
                                            <Loader2 size={16} className="animate-spin" />
                                        ) : (
                                            <Trash2 size={16} />
                                        )}
                                        Verwijderen
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
