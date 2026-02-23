import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, FileText, Image as ImageIcon, Folder, ArrowLeft, CheckCircle, AlertCircle, Monitor, Trash2, FileWarning, Sparkles } from 'lucide-react';
import type { UserStats, VsoProfile } from '../../../types';

interface CloudCleanerProps {
    onComplete: (success: boolean) => void;
    onBack: () => void;
    stats?: UserStats;
    vsoProfile?: VsoProfile;
}

interface FileItem {
    id: string;
    name: string;
    type: 'doc' | 'image' | 'video' | 'junk';
    correctFolder: string;
}

interface FolderItem {
    id: string;
    name: string;
    icon: React.ReactNode;
}

const FILES: FileItem[] = [
    { id: 'f1', name: 'Boekverslag_NL.docx', type: 'doc', correctFolder: 'nederlands' },
    { id: 'f2', name: 'Vakantie_Selfie.jpg', type: 'image', correctFolder: 'prive' },
    { id: 'f3', name: 'Presentatie_Aard.pptx', type: 'doc', correctFolder: 'aardrijkskunde' },
    { id: 'f4', name: 'Meme_Collectie.zip', type: 'image', correctFolder: 'prive' },
    { id: 'f5', name: 'Huiswerk_Wiskunde.pdf', type: 'doc', correctFolder: 'wiskunde' },
    { id: 'f6', name: 'Lesaantekeningen.txt', type: 'doc', correctFolder: 'school_algemeen' },
    // Junk files
    { id: 'j1', name: 'Gratis_Minecraft_Hack.exe', type: 'junk', correctFolder: 'trash' },
    { id: 'j2', name: 'Virus_Alert.html', type: 'junk', correctFolder: 'trash' },
    { id: 'j3', name: 'Oude_Setup_V1.installer', type: 'junk', correctFolder: 'trash' },
];

// Pre-defined folders (original OneDrive style)
const FOLDERS: FolderItem[] = [
    { id: 'nederlands', name: 'Nederlands', icon: <Folder className="text-blue-500" fill="currentColor" fillOpacity={0.2} /> },
    { id: 'wiskunde', name: 'Wiskunde', icon: <Folder className="text-blue-500" fill="currentColor" fillOpacity={0.2} /> },
    { id: 'aardrijkskunde', name: 'Aardrijkskunde', icon: <Folder className="text-blue-500" fill="currentColor" fillOpacity={0.2} /> },
    { id: 'school_algemeen', name: 'School Algemeen', icon: <Folder className="text-indigo-500" fill="currentColor" fillOpacity={0.2} /> },
    { id: 'prive', name: "Privé & Foto's", icon: <Folder className="text-amber-500" fill="currentColor" fillOpacity={0.2} /> },
];

export const CloudCleanerMission: React.FC<CloudCleanerProps> = ({ onComplete, onBack }) => {
    const [files, setFiles] = useState<FileItem[]>(FILES);
    const [score, setScore] = useState(0);
    const [mistakes, setMistakes] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);
    const [dragActive, setDragActive] = useState<string | null>(null);
    const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [dragOverFolderId, setDragOverFolderId] = useState<string | null>(null);
    const [shakeFolder, setShakeFolder] = useState<string | null>(null);
    const [lastSuccessFolder, setLastSuccessFolder] = useState<string | null>(null);

    // Touch drag state
    const [touchDragFile, setTouchDragFile] = useState<string | null>(null);
    const [touchPosition, setTouchPosition] = useState<{ x: number; y: number } | null>(null);
    const folderRefs = useRef<Map<string, HTMLDivElement>>(new Map());

    // Auto-hide error message after 3 seconds
    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => setErrorMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    // Auto-hide success message after 2 seconds
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(null), 2000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    // Clear success folder highlight
    useEffect(() => {
        if (lastSuccessFolder) {
            const timer = setTimeout(() => setLastSuccessFolder(null), 600);
            return () => clearTimeout(timer);
        }
    }, [lastSuccessFolder]);

    const handleDragStart = (e: React.DragEvent, fileId: string) => {
        // Don't prevent default - we need native drag to work
        e.stopPropagation();
        e.dataTransfer.setData('text/plain', fileId); // Use text/plain for better compatibility
        e.dataTransfer.setData('fileId', fileId);
        e.dataTransfer.effectAllowed = 'move';
        setDragActive(fileId);
        setSelectedFile(null);
    };

    const handleDragEnd = () => {
        setDragActive(null);
        setDragOverFolderId(null);
    };

    const handleFileToFolder = (fileId: string, folderId: string) => {
        const file = files.find(f => f.id === fileId);
        if (!file) return;

        if (file.correctFolder === folderId) {
            // Correct! Show success animation
            setLastSuccessFolder(folderId);
            setSuccessMessage(`✓ ${file.name} geplaatst!`);
            setFiles(prev => prev.filter(f => f.id !== fileId));
            setScore(s => s + 10);
            setSelectedFile(null);
            setSelectedFolder(null);

            // Check win condition
            if (files.length === 1) {
                setTimeout(() => setShowSuccess(true), 500);
            }
        } else {
            // Wrong folder - shake animation
            setShakeFolder(folderId);
            setTimeout(() => setShakeFolder(null), 500);

            setMistakes(m => m + 1);
            if (folderId === 'trash' && file.correctFolder !== 'trash') {
                setErrorMessage('🚫 Ho! Dit is een belangrijk bestand, niet weggooien!');
            } else if (file.correctFolder === 'trash' && folderId !== 'trash') {
                setErrorMessage('⚠️ Dit is een virus- of onzinbestand. Gooi dit weg in de Prullenbak!');
            } else {
                setErrorMessage('❌ Oeps! Dit bestand hoort niet in deze map.');
            }
            setSelectedFile(null);
            setSelectedFolder(null);
        }
    };

    const handleDrop = (e: React.DragEvent, folderId: string) => {
        e.preventDefault();
        setDragActive(null);
        setDragOverFolderId(null);
        const fileId = e.dataTransfer.getData('fileId');
        if (fileId) {
            handleFileToFolder(fileId, folderId);
        }
    };

    const handleDragEnter = (e: React.DragEvent, folderId: string) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOverFolderId(folderId);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        // Only clear if we're leaving the folder element entirely
        const relatedTarget = e.relatedTarget as HTMLElement;
        if (!relatedTarget || !e.currentTarget.contains(relatedTarget)) {
            setDragOverFolderId(null);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleFolderClick = (e: React.MouseEvent, folderId: string) => {
        e.preventDefault();
        e.stopPropagation();

        if (selectedFile) {
            handleFileToFolder(selectedFile, folderId);
        } else {
            if (selectedFolder === folderId) {
                setSelectedFolder(null);
            } else {
                setSelectedFolder(folderId);
            }
        }
    };

    const handleFileClick = (e: React.MouseEvent, fileId: string) => {
        e.preventDefault();
        e.stopPropagation();

        if (selectedFolder) {
            handleFileToFolder(fileId, selectedFolder);
        } else {
            setSelectedFile(selectedFile === fileId ? null : fileId);
        }
    };

    // Touch handlers for mobile drag
    const handleTouchStart = (e: React.TouchEvent, fileId: string) => {
        e.preventDefault(); // Prevent pull-to-refresh
        e.stopPropagation();
        const touch = e.touches[0];
        setTouchDragFile(fileId);
        setTouchPosition({ x: touch.clientX, y: touch.clientY });
        setSelectedFile(null);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!touchDragFile) return;
        e.preventDefault(); // Prevent scrolling while dragging
        e.stopPropagation();
        const touch = e.touches[0];
        setTouchPosition({ x: touch.clientX, y: touch.clientY });

        // Check which folder we're over
        let foundFolder: string | null = null;
        folderRefs.current.forEach((element, folderId) => {
            const rect = element.getBoundingClientRect();
            if (touch.clientX >= rect.left && touch.clientX <= rect.right &&
                touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
                foundFolder = folderId;
            }
        });
        setDragOverFolderId(foundFolder);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (touchDragFile && dragOverFolderId) {
            handleFileToFolder(touchDragFile, dragOverFolderId);
        }
        setTouchDragFile(null);
        setTouchPosition(null);
        setDragOverFolderId(null);
    };

    const registerFolderRef = (folderId: string, element: HTMLDivElement | null) => {
        if (element) {
            folderRefs.current.set(folderId, element);
        } else {
            folderRefs.current.delete(folderId);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
            {/* Touch drag ghost */}
            {touchDragFile && touchPosition && (
                <div
                    className="fixed z-[100] pointer-events-none"
                    style={{
                        left: touchPosition.x - 40,
                        top: touchPosition.y - 40,
                    }}
                >
                    <div className="w-20 h-20 bg-blue-500/20 backdrop-blur-sm rounded-xl border-2 border-blue-400 flex items-center justify-center shadow-xl">
                        <FileText size={32} className="text-blue-500" />
                    </div>
                </div>
            )}

            {/* Success Toast */}
            <AnimatePresence>
                {successMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.8 }}
                        className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 font-bold"
                    >
                        <Sparkles size={20} />
                        <span>{successMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error Toast Notification */}
            <AnimatePresence>
                {errorMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: 50, x: '-50%' }}
                        className="fixed bottom-6 left-1/2 z-50 bg-red-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 max-w-md"
                    >
                        <AlertCircle size={24} className="flex-shrink-0" />
                        <span className="font-medium">{errorMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* OneDrive Header */}
            <header className="bg-[#0078D4] text-white flex items-center justify-between px-4 py-3 shadow-md">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Terug naar opdrachten">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex items-center gap-2 font-bold text-lg">
                        <Cloud size={24} />
                        <span>OneDrive - School</span>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-sm font-medium">
                    <div className="flex items-center gap-2 bg-black/10 px-3 py-1 rounded-full">
                        <Monitor size={16} />
                        <span>Mijn Bestanden</span>
                    </div>
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">
                        YO
                    </div>
                </div>
            </header>

            {/* Main Interface */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar (Folders) */}
                <aside className="w-64 bg-slate-100 border-r border-slate-200 p-4 flex flex-col overflow-y-auto">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">Mijn Mappen</h3>

                    {/* Instruction hint when dragging */}
                    <AnimatePresence>
                        {(dragActive || touchDragFile) && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-4 p-3 bg-blue-100 border border-blue-200 rounded-xl"
                            >
                                <p className="text-xs text-blue-700 font-bold text-center">
                                    👇 Sleep naar de juiste map!
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Folder List */}
                    <div className="space-y-1 mb-6">
                        {FOLDERS.map(folder => (
                            <motion.div
                                key={folder.id}
                                ref={(el) => registerFolderRef(folder.id, el)}
                                onClick={(e) => handleFolderClick(e, folder.id)}
                                onDragOver={handleDragOver}
                                onDragEnter={(e) => handleDragEnter(e, folder.id)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, folder.id)}
                                animate={{
                                    scale: dragOverFolderId === folder.id ? 1.05 : 1,
                                    x: shakeFolder === folder.id ? [0, -8, 8, -8, 8, 0] : 0,
                                }}
                                transition={{
                                    scale: { type: 'spring', stiffness: 400, damping: 25 },
                                    x: { duration: 0.4 },
                                }}
                                className={`
                                    flex items-center gap-3 px-3 py-3 rounded-xl transition-all cursor-pointer border-2
                                    ${selectedFolder === folder.id
                                        ? 'border-blue-400 bg-blue-50 shadow-md ring-2 ring-blue-200'
                                        : dragOverFolderId === folder.id
                                            ? 'border-green-400 bg-green-100 shadow-lg ring-2 ring-green-300'
                                            : lastSuccessFolder === folder.id
                                                ? 'border-emerald-400 bg-emerald-100 shadow-lg'
                                                : 'border-transparent hover:bg-white hover:shadow-sm'}
                                    ${selectedFile ? 'hover:border-green-400 hover:bg-green-50' : ''}
                                `}
                            >
                                <motion.div
                                    animate={{
                                        rotate: dragOverFolderId === folder.id ? [0, -10, 10, -5, 5, 0] : 0,
                                    }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {folder.icon}
                                </motion.div>
                                <span className="font-medium text-sm text-slate-700">{folder.name}</span>
                                {dragOverFolderId === folder.id && (
                                    <motion.span
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="ml-auto text-green-500"
                                    >
                                        <CheckCircle size={18} />
                                    </motion.span>
                                )}
                            </motion.div>
                        ))}

                        {/* TRASH BIN */}
                        <motion.div
                            ref={(el) => registerFolderRef('trash', el)}
                            onClick={(e) => handleFolderClick(e, 'trash')}
                            onDragOver={handleDragOver}
                            onDragEnter={(e) => handleDragEnter(e, 'trash')}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, 'trash')}
                            animate={{
                                scale: dragOverFolderId === 'trash' ? 1.05 : 1,
                                x: shakeFolder === 'trash' ? [0, -8, 8, -8, 8, 0] : 0,
                            }}
                            transition={{
                                scale: { type: 'spring', stiffness: 400, damping: 25 },
                                x: { duration: 0.4 },
                            }}
                            className={`
                                flex items-center gap-3 px-3 py-3 rounded-xl transition-all cursor-pointer border-2 mt-4
                                ${selectedFolder === 'trash'
                                    ? 'border-red-400 bg-red-50 shadow-md ring-2 ring-red-200'
                                    : dragOverFolderId === 'trash'
                                        ? 'border-red-500 bg-red-100 shadow-lg ring-2 ring-red-300'
                                        : lastSuccessFolder === 'trash'
                                            ? 'border-emerald-400 bg-emerald-100 shadow-lg'
                                            : 'border-transparent text-slate-500 hover:bg-red-50 hover:shadow-sm'}
                                ${selectedFile ? 'hover:border-red-400' : ''}
                            `}
                        >
                            <motion.div
                                animate={{
                                    rotate: dragOverFolderId === 'trash' ? [0, -10, 10, -5, 5, 0] : 0,
                                }}
                                transition={{ duration: 0.5 }}
                            >
                                <Trash2 size={20} className={dragOverFolderId === 'trash' || selectedFolder === 'trash' ? 'text-red-500' : 'text-slate-400'} />
                            </motion.div>
                            <span className={`font-medium text-sm ${selectedFolder === 'trash' || dragOverFolderId === 'trash' ? 'text-red-700' : 'text-slate-600'}`}>
                                Prullenbak
                            </span>
                            {dragOverFolderId === 'trash' && (
                                <motion.span
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="ml-auto text-red-500"
                                >
                                    <Trash2 size={18} />
                                </motion.span>
                            )}
                        </motion.div>
                    </div>

                    {/* Score Panel */}
                    <div className="mt-auto bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-xl text-white shadow-lg">
                        <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                            <Sparkles size={16} />
                            Score: {score} XP
                        </h4>
                        <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-white rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${(score / (FILES.length * 10)) * 100}%` }}
                                transition={{ type: 'spring', stiffness: 100 }}
                            />
                        </div>
                        <p className="text-xs text-white/70 mt-2">
                            {files.length} van {FILES.length} bestanden over
                        </p>
                        {mistakes > 0 && (
                            <p className="text-xs text-red-200 mt-1 font-medium flex items-center gap-1">
                                <AlertCircle size={12} /> {mistakes} fouten
                            </p>
                        )}
                    </div>
                </aside>

                {/* Main Content (Files) */}
                <main
                    className="flex-1 p-6 bg-white overflow-y-auto relative"
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div className="mb-6 flex items-center justify-between flex-wrap gap-2">
                        <h2 className="text-xl font-bold text-slate-800">Recente Bestanden</h2>
                        {selectedFile && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-full font-bold shadow-sm border border-blue-100 flex items-center gap-2"
                            >
                                <span>👈</span>
                                Tik nu op een map om te plaatsen
                            </motion.div>
                        )}
                        {!selectedFile && files.length > 0 && !dragActive && (
                            <div className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full hidden sm:block">
                                💡 Sleep bestanden naar de juiste map
                            </div>
                        )}
                    </div>

                    {files.length === 0 && !showSuccess && (
                        <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                            <Cloud size={64} className="mb-4 opacity-20" />
                            <p>Alles opgeruimd! Goed gedaan. 🎉</p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <AnimatePresence mode="popLayout">
                            {files.map(file => (
                                <motion.div
                                    key={file.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                    animate={{
                                        opacity: touchDragFile === file.id ? 0.3 : 1,
                                        scale: dragActive === file.id ? 1.05 : 1,
                                        y: 0,
                                        rotate: dragActive === file.id ? 3 : 0,
                                    }}
                                    exit={{
                                        opacity: 0,
                                        scale: 0,
                                        y: -50,
                                        transition: { duration: 0.3 }
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                    draggable="true"
                                    onClick={(e) => handleFileClick(e, file.id)}
                                    onDragStart={(e) => {
                                        e.stopPropagation();
                                        handleDragStart(e as unknown as React.DragEvent, file.id);
                                    }}
                                    onDragEnd={handleDragEnd}
                                    onTouchStart={(e) => handleTouchStart(e, file.id)}
                                    style={{ touchAction: 'none' }}
                                    className={`
                                        bg-white rounded-xl border-2 shadow-sm p-4 flex flex-col items-center gap-3 cursor-grab active:cursor-grabbing transition-colors group select-none
                                        ${dragActive === file.id ? 'opacity-50 ring-2 ring-blue-400 shadow-xl border-blue-300' : ''}
                                        ${selectedFile === file.id
                                            ? 'border-blue-400 bg-blue-50 ring-2 ring-blue-200 shadow-lg'
                                            : file.type === 'junk' ? 'border-red-200 bg-red-50/30 hover:border-red-300' : 'border-slate-200 hover:border-indigo-300'}
                                        ${selectedFolder ? 'hover:border-green-400 hover:bg-green-50' : ''}
                                    `}
                                >
                                    <motion.div
                                        className={`w-16 h-16 rounded-xl flex items-center justify-center transition-colors
                                            ${file.type === 'junk' ? 'bg-red-100 group-hover:bg-red-200' : 'bg-slate-100 group-hover:bg-indigo-100'}
                                        `}
                                        animate={{
                                            rotate: dragActive === file.id ? [0, -5, 5, -5, 5, 0] : 0,
                                        }}
                                        transition={{ duration: 0.5, repeat: dragActive === file.id ? Infinity : 0 }}
                                    >
                                        {file.type === 'doc' && <FileText size={32} className="text-blue-500" />}
                                        {file.type === 'image' && <ImageIcon size={32} className="text-purple-500" />}
                                        {file.type === 'junk' && <FileWarning size={32} className="text-red-500" />}
                                    </motion.div>
                                    <span className="text-sm font-medium text-slate-700 text-center break-all line-clamp-2">
                                        {file.name}
                                    </span>
                                    {selectedFile === file.id && (
                                        <motion.span
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="text-xs text-blue-500 font-bold"
                                        >
                                            Geselecteerd ✓
                                        </motion.span>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </main>
            </div>

            {/* Success Modal */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.8, y: 50 }}
                            className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl"
                        >
                            <div className="text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1, rotate: [0, -10, 10, -5, 5, 0] }}
                                    transition={{ delay: 0.2, type: 'spring' }}
                                    className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-200"
                                >
                                    <CheckCircle size={48} />
                                </motion.div>
                                <h3 className="text-2xl font-black text-slate-900 mb-2">Opgeruimd Staat Netjes!</h3>
                                <p className="text-slate-500 mb-2">
                                    Je OneDrive is weer helemaal georganiseerd. Goed gedaan!
                                </p>
                                <div className="bg-emerald-50 rounded-xl p-3 mb-6">
                                    <p className="text-emerald-700 font-bold text-lg">+{score} XP verdiend!</p>
                                    {mistakes > 0 && (
                                        <p className="text-sm text-slate-500">{mistakes} foutjes gemaakt, maar dat geeft niet!</p>
                                    )}
                                </div>
                                <button
                                    onClick={() => onComplete(true)}
                                    className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all shadow-lg shadow-green-200"
                                >
                                    🎉 Voltooien
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
