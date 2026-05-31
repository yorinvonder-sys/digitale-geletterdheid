import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, FileText, Image as ImageIcon, Folder, ArrowLeft, CheckCircle, AlertCircle, Monitor, Trash2, FileWarning, Sparkles, X } from 'lucide-react';
import type { UserStats, VsoProfile } from '@/types';
import { useMissionAutoSave } from '@/hooks/useMissionAutoSave';
import { getMissionGoal } from '@/config/missionGoals';
import { MissionGoalBanner } from '../templates/shared/MissionGoalBanner';

interface CloudCleanerState {
    remainingFileIds: string[];
    score: number;
    mistakes: number;
}

const EVIDENCE_PROMPTS: Record<string, { prompt: string; signal: string; modelEvidence: string }> = {
    nederlands: {
        prompt: 'Welk signaal bewijst dat dit bij Nederlands hoort?',
        signal: 'Vakcode of onderwerp in de bestandsnaam',
        modelEvidence: 'De naam verwijst naar een Nederlands-opdracht, dus de vakmap is sterker bewijs dan alleen de extensie.',
    },
    wiskunde: {
        prompt: 'Welk signaal bewijst dat dit bij Wiskunde hoort?',
        signal: 'Huiswerk of wiskundetaal in de naam',
        modelEvidence: 'De naam noemt huiswerk en Wiskunde. Het vaksignaal is belangrijker dan het bestandstype.',
    },
    aardrijkskunde: {
        prompt: 'Welk signaal bewijst dat dit bij Aardrijkskunde past?',
        signal: 'Vakafkorting of presentatie-onderwerp',
        modelEvidence: 'De naam verwijst naar Aardrijkskunde. De inhoudsaanwijzing wint van de extensie.',
    },
    school_algemeen: {
        prompt: 'Welk signaal bewijst dat dit School Algemeen is?',
        signal: 'Schooldocument zonder duidelijke vaknaam',
        modelEvidence: 'Lesaantekeningen zijn schoolwerk, maar de naam noemt geen specifiek vak. Daarom is School Algemeen logisch.',
    },
    prive: {
        prompt: 'Welk signaal bewijst dat dit prive is?',
        signal: 'Persoonlijke foto of eigen verzameling',
        modelEvidence: 'De naam wijst op iets persoonlijks. Dat hoort niet tussen schoolvakken en hoeft niet weg.',
    },
    trash: {
        prompt: 'Welk signaal bewijst dat dit naar de prullenbak moet?',
        signal: 'Verdachte naam, hack/virus/setup of ongewenst bestand',
        modelEvidence: 'De naam klinkt verdacht of ongewenst. Je bewaart dit niet tussen school- of privebestanden.',
    },
};

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
    { id: 'nederlands', name: 'Nederlands', icon: <Folder className="text-[#5F947D]" fill="currentColor" fillOpacity={0.2} /> },
    { id: 'wiskunde', name: 'Wiskunde', icon: <Folder className="text-[#5F947D]" fill="currentColor" fillOpacity={0.2} /> },
    { id: 'aardrijkskunde', name: 'Aardrijkskunde', icon: <Folder className="text-[#5F947D]" fill="currentColor" fillOpacity={0.2} /> },
    { id: 'school_algemeen', name: 'School Algemeen', icon: <Folder className="text-[#0B453F]" fill="currentColor" fillOpacity={0.2} /> },
    { id: 'prive', name: "Privé & Foto's", icon: <Folder className="text-[#D97848]" fill="currentColor" fillOpacity={0.2} /> },
];

export const CloudCleanerMission: React.FC<CloudCleanerProps> = ({ onComplete, onBack }) => {
    const { state: savedState, setState: setSavedState, clearSave } = useMissionAutoSave<CloudCleanerState>(
        'cloud-cleaner',
        {
            remainingFileIds: FILES.map(f => f.id),
            score: 0,
            mistakes: 0,
        }
    );

    // Derive files from saved remaining IDs
    const files = FILES.filter(f => savedState.remainingFileIds.includes(f.id));
    const score = savedState.score;
    const mistakes = savedState.mistakes;
    const completedCount = FILES.length - files.length;
    const progressPercent = Math.round((completedCount / FILES.length) * 100);
    const nextFile = files[0];

    // Transient UI state - niet opgeslagen
    const [showSuccess, setShowSuccess] = useState(false);
    const [dragActive, setDragActive] = useState<string | null>(null);
    const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [dragOverFolderId, setDragOverFolderId] = useState<string | null>(null);
    const [shakeFolder, setShakeFolder] = useState<string | null>(null);
    const [lastSuccessFolder, setLastSuccessFolder] = useState<string | null>(null);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    // Evidence card state
    const [whyQuestion, setWhyQuestion] = useState<{ folderId: string; fileName: string } | null>(null);
    const [evidenceNote, setEvidenceNote] = useState('');
    const [evidencePinned, setEvidencePinned] = useState(false);
    const showCompletionModal = (showSuccess || files.length === 0) && !whyQuestion;

    // Touch drag state
    const [touchDragFile, setTouchDragFile] = useState<string | null>(null);
    const [touchPosition, setTouchPosition] = useState<{ x: number; y: number } | null>(null);
    const folderRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

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
            setSuccessMessage(`\u2713 ${file.name} klopt! +10 XP`);
            setSavedState(prev => ({
                ...prev,
                remainingFileIds: prev.remainingFileIds.filter(id => id !== fileId),
                score: prev.score + 10,
            }));
            setSelectedFile(null);
            setSelectedFolder(null);

            if (EVIDENCE_PROMPTS[folderId]) {
                setTimeout(() => {
                    setWhyQuestion({ folderId, fileName: file.name });
                }, 800);
            }

            // Check win condition
            if (files.length === 1) {
                setTimeout(() => setShowSuccess(true), 1500);
            }
        } else {
            // Wrong folder - shake animation
            setShakeFolder(folderId);
            setTimeout(() => setShakeFolder(null), 500);

            setSavedState(prev => ({ ...prev, mistakes: prev.mistakes + 1 }));
            if (folderId === 'trash' && file.correctFolder !== 'trash') {
                setErrorMessage('Feedback: dit is belangrijk school- of privéwerk. Zoek een passende map in plaats van de prullenbak.');
            } else if (file.correctFolder === 'trash' && folderId !== 'trash') {
                setErrorMessage('Feedback: dit lijkt verdacht of ongewenst. Dit hoort veilig in de Prullenbak.');
            } else {
                setErrorMessage('Feedback: kijk naar de bestandsnaam. Welk vak, privédoel of risico herken je?');
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

    const registerFolderRef = (folderId: string, element: HTMLButtonElement | null) => {
        if (element) {
            folderRefs.current.set(folderId, element);
        } else {
            folderRefs.current.delete(folderId);
        }
    };

    return (
        <div className="h-dvh overflow-hidden bg-[#FCF6EA] flex flex-col text-[#08283B]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
            {/* Touch drag ghost */}
            {touchDragFile && touchPosition && (
                <div
                    className="fixed z-[100] pointer-events-none"
                    style={{
                        left: touchPosition.x - 40,
                        top: touchPosition.y - 40,
                    }}
                >
                    <div className="w-20 h-20 bg-[#D97848]/20 backdrop-blur-sm rounded-2xl border-2 border-[#D97848] flex items-center justify-center shadow-xl">
                        <FileText size={32} className="text-[#D97848]" />
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
                        className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#5F947D] text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-bold"
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
                        className="fixed bottom-6 left-1/2 z-50 bg-lab-coral text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 max-w-md"
                    >
                        <AlertCircle size={24} className="flex-shrink-0" />
                        <span className="font-medium">{errorMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* OneDrive Header */}
            <header className="bg-lab-teal text-white flex flex-wrap items-center justify-between gap-3 px-4 py-3 shadow-md">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-all duration-300 focus-visible:ring-2 focus-visible:ring-white" title="Terug naar opdrachten">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex items-center gap-2 font-bold text-lg">
                        <Cloud size={24} />
                        <span>OneDrive - School</span>
                    </div>
                </div>
                <div className="hidden sm:flex items-center gap-4 text-sm font-medium">
                    <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
                        <Monitor size={16} />
                        <span>Mijn Bestanden</span>
                    </div>
                    <div className="w-8 h-8 bg-lab-gold text-lab-ink rounded-full flex items-center justify-center font-bold">
                        YO
                    </div>
                </div>
            </header>

            <div className="bg-[#FCF6EA] border-b border-lab-line px-3 py-2">
                <div className="mx-auto max-w-4xl">
                    <MissionGoalBanner goal={getMissionGoal('cloud-cleaner')!} compact />
                </div>
            </div>

            <section className="bg-white border-b border-lab-line px-3 py-3" data-qa="cloud-cleaner-challenge">
                <div className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-lab-coral">
                            Challenge {Math.min(completedCount + 1, FILES.length)}/{FILES.length}
                        </p>
                        <h2 className="text-base font-black text-lab-ink" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                            Sorteer slim: bewaren, vakmap of prullenbak?
                        </h2>
                        <p className="text-xs leading-relaxed text-lab-muted">
                            {nextFile
                                ? `Eerste keuze: waar hoort "${nextFile.name}"? Elke goede plaatsing geeft feedback en +10 XP.`
                                : 'Alle bestanden zijn beoordeeld. Rond af met je bewijs.'}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-lab-line bg-lab-cream px-4 py-3 text-sm shadow-sm">
                        <div className="mb-2 flex items-center justify-between gap-4 font-bold text-lab-ink">
                            <span>{score} XP</span>
                            <span>{completedCount}/{FILES.length} klaar</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-white">
                            <div className="h-full rounded-full bg-lab-sage transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Interface */}
            <div className="min-h-0 flex-1 flex overflow-hidden relative">
                {/* Mobile sidebar toggle */}
                <button
                    onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                    className="lg:hidden fixed bottom-4 left-4 z-40 w-14 h-14 bg-lab-teal text-white rounded-full shadow-xl flex items-center justify-center hover:bg-lab-ink transition-all duration-300 focus-visible:ring-2 focus-visible:ring-lab-gold"
                >
                    {mobileSidebarOpen ? <X size={24} /> : <Folder size={24} />}
                </button>

                {/* Mobile sidebar backdrop */}
                {mobileSidebarOpen && (
                    <div className="lg:hidden fixed inset-0 z-30 bg-[#08283B]/30 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)} />
                )}

                {/* Sidebar (Folders) */}
                <aside className={`
                    fixed lg:relative z-30 lg:z-auto
                    w-64 bg-lab-cream border-r border-lab-line p-4 flex flex-col overflow-y-auto
                    h-[calc(100dvh-56px)] lg:h-auto
                    transition-transform duration-300 lg:transition-none
                    ${mobileSidebarOpen ? 'flex translate-x-0' : 'hidden -translate-x-full lg:flex lg:translate-x-0'}
                `}>
                    <h3 className="text-xs font-bold text-lab-muted uppercase tracking-widest mb-4 px-2">Mijn Mappen</h3>

                    {/* Instruction hint when dragging */}
                    <AnimatePresence>
                        {(dragActive || touchDragFile) && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-4 p-3 bg-lab-gold/20 border border-lab-gold/40 rounded-2xl"
                            >
                                <p className="text-xs text-lab-ink font-bold text-center">
                                    Sleep naar de juiste map!
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Folder List */}
                    <div className="space-y-1 mb-6">
                        {FOLDERS.map(folder => (
                            <motion.button
                                key={folder.id}
                                type="button"
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
                                    flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-300 cursor-pointer border-2
                                    ${selectedFolder === folder.id
                                        ? 'border-lab-teal bg-lab-teal/10 shadow-md ring-2 ring-lab-teal/20'
                                        : dragOverFolderId === folder.id
                                            ? 'border-lab-sage bg-lab-sage/10 shadow-lg ring-2 ring-lab-sage/30'
                                            : lastSuccessFolder === folder.id
                                                ? 'border-lab-sage bg-lab-sage/10 shadow-lg'
                                                : 'border-transparent hover:bg-lab-paper hover:shadow-sm'}
                                    ${selectedFile ? 'hover:border-lab-sage hover:bg-lab-sage/5' : ''}
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
                                <span className="font-medium text-sm text-lab-muted">{folder.name}</span>
                                {dragOverFolderId === folder.id && (
                                    <motion.span
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="ml-auto text-lab-sage"
                                    >
                                        <CheckCircle size={18} />
                                    </motion.span>
                                )}
                            </motion.button>
                        ))}

                        {/* TRASH BIN */}
                        <motion.button
                            type="button"
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
                                flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-300 cursor-pointer border-2 mt-4
                                ${selectedFolder === 'trash'
                                    ? 'border-lab-coral bg-lab-coral/10 shadow-md ring-2 ring-lab-coral/20'
                                    : dragOverFolderId === 'trash'
                                        ? 'border-lab-coral bg-lab-coral/10 shadow-lg ring-2 ring-lab-coral/20'
                                        : lastSuccessFolder === 'trash'
                                            ? 'border-lab-sage bg-lab-sage/10 shadow-lg'
                                            : 'border-transparent text-lab-muted hover:bg-lab-coral/10 hover:shadow-sm'}
                                ${selectedFile ? 'hover:border-lab-coral hover:bg-lab-coral/5' : ''}
                            `}
                        >
                            <motion.div
                                animate={{
                                    rotate: dragOverFolderId === 'trash' ? [0, -10, 10, -5, 5, 0] : 0,
                                }}
                                transition={{ duration: 0.5 }}
                            >
                                <Trash2 size={20} className={dragOverFolderId === 'trash' || selectedFolder === 'trash' ? 'text-lab-coral' : 'text-lab-muted'} />
                            </motion.div>
                            <span className={`font-medium text-sm ${selectedFolder === 'trash' || dragOverFolderId === 'trash' ? 'text-lab-coral' : 'text-lab-muted'}`}>
                                Prullenbak
                            </span>
                            {dragOverFolderId === 'trash' && (
                                <motion.span
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="ml-auto text-lab-coral"
                                >
                                    <Trash2 size={18} />
                                </motion.span>
                            )}
                        </motion.button>
                    </div>

                    {/* Score Panel */}
                    <div className="mt-auto bg-lab-teal p-4 rounded-2xl text-white shadow-lg">
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
                            <p className="text-xs text-lab-gold mt-1 font-medium flex items-center gap-1">
                                <AlertCircle size={12} /> {mistakes} fouten
                            </p>
                        )}
                    </div>
                </aside>

                {/* Main Content (Files) */}
                <main
                    className="flex-1 p-6 bg-lab-paper overflow-y-auto relative"
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div className="mb-6 flex items-center justify-between flex-wrap gap-2">
                        <div>
                            <h2 className="text-xl font-bold text-lab-ink">Recente Bestanden</h2>
                            <p className="text-xs text-lab-muted">Klik of sleep een bestand naar de beste bestemming. Fouten zijn oefenfeedback.</p>
                        </div>
                        {selectedFile && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-sm text-lab-coral bg-lab-coral/10 px-4 py-2 rounded-full font-bold shadow-sm border border-lab-coral/20 flex items-center gap-2"
                            >
                                <span>👈</span>
                                Tik nu op een map om te plaatsen
                            </motion.div>
                        )}
                        {!selectedFile && files.length > 0 && !dragActive && (
                            <div className="text-xs text-lab-muted bg-lab-cream px-3 py-1 rounded-full hidden sm:block border border-lab-line">
                                Sleep bestanden naar de juiste map
                            </div>
                        )}
                    </div>

                    {files.length === 0 && !showSuccess && (
                        <div className="flex flex-col items-center justify-center h-64 text-lab-muted">
                            <Cloud size={64} className="mb-4 opacity-20" />
                            <p>Alles opgeruimd! Goed gedaan.</p>
                        </div>
                    )}

                    <div className="grid grid-cols-3 gap-2 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
                        <AnimatePresence mode="popLayout">
                            {files.map(file => (
                                <motion.button
                                    key={file.id}
                                    type="button"
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
                                        bg-lab-paper rounded-xl border-2 shadow-sm p-2 md:p-4 flex flex-col items-center gap-2 md:gap-3 cursor-grab active:cursor-grabbing transition-all duration-300 group select-none
                                        ${dragActive === file.id ? 'opacity-50 ring-2 ring-lab-coral shadow-xl border-lab-coral' : ''}
                                        ${selectedFile === file.id
                                            ? 'border-lab-coral bg-lab-coral/5 ring-2 ring-lab-coral/20 shadow-lg'
                                            : file.type === 'junk' ? 'border-lab-coral bg-lab-coral/10 hover:border-lab-coral' : 'border-lab-line hover:border-lab-coral/50'}
                                        ${selectedFolder ? 'hover:border-lab-sage hover:bg-lab-sage/5' : ''}
                                    `}
                                >
                                    <motion.div
                                        className={`h-10 w-10 rounded-xl md:w-16 md:h-16 md:rounded-2xl flex items-center justify-center transition-all duration-300
                                            ${file.type === 'junk' ? 'bg-lab-coral text-white group-hover:bg-lab-coral' : 'bg-lab-cream group-hover:bg-lab-coral/10'}
                                        `}
                                        animate={{
                                            rotate: dragActive === file.id ? [0, -5, 5, -5, 5, 0] : 0,
                                        }}
                                        transition={{ duration: 0.5, repeat: dragActive === file.id ? Infinity : 0 }}
                                    >
                                        {file.type === 'doc' && <FileText size={24} className="text-lab-sage md:size-8" />}
                                        {file.type === 'image' && <ImageIcon size={24} className="text-lab-teal md:size-8" />}
                                        {file.type === 'junk' && <FileWarning size={24} className="text-white md:size-8" />}
                                    </motion.div>
                                    <span className="text-[10px] font-medium text-lab-muted text-center break-all line-clamp-2 md:text-sm">
                                        {file.name}
                                    </span>
                                    {selectedFile === file.id && (
                                        <motion.span
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="text-xs text-lab-coral font-bold"
                                        >
                                            Geselecteerd ✓
                                        </motion.span>
                                    )}
                                </motion.button>
                            ))}
                        </AnimatePresence>
                    </div>
                </main>
            </div>

            {/* Evidence Modal */}
            <AnimatePresence>
                {whyQuestion && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#08283B]/40 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 30 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.8, y: 30 }}
                            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
                            data-qa="cloud-cleaner-evidence-modal"
                        >
                            <div className="text-center mb-4">
                                <div className="w-12 h-12 bg-[#5F947D]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <FileText size={24} className="text-[#5F947D]" />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-lab-coral mb-1">Bewijskaart</p>
                                <p className="font-bold text-[#08283B]">{whyQuestion.fileName}</p>
                            </div>
                            <div className="rounded-2xl border border-[#E7D8BD] bg-[#FCF6EA] p-3 mb-4">
                                <p className="text-xs font-black uppercase tracking-widest text-[#D97848]">Te pinnen signaal</p>
                                <p className="mt-1 text-sm font-bold text-[#08283B]">{EVIDENCE_PROMPTS[whyQuestion.folderId]?.signal}</p>
                            </div>
                            <label className="text-sm font-bold text-[#445865]" htmlFor="cloud-cleaner-evidence-note">
                                {EVIDENCE_PROMPTS[whyQuestion.folderId]?.prompt}
                            </label>
                            <textarea
                                id="cloud-cleaner-evidence-note"
                                data-qa="cloud-cleaner-evidence-note"
                                value={evidenceNote}
                                onChange={event => setEvidenceNote(event.target.value)}
                                disabled={evidencePinned}
                                placeholder="Bijv: In de naam staat..."
                                className="mt-2 w-full rounded-2xl border-2 border-[#E7D8BD] bg-[#FCF6EA] p-3 text-sm leading-relaxed text-[#08283B] outline-none transition-all duration-300 focus:border-[#5F947D] disabled:opacity-70"
                                style={{ minHeight: '92px' }}
                            />
                            {evidencePinned && (
                                <div className="mt-3 rounded-2xl border border-[#5F947D]/20 bg-[#5F947D]/10 p-3" data-qa="cloud-cleaner-evidence-feedback">
                                    <p className="text-xs font-black uppercase tracking-widest text-[#5F947D]">Modelbewijs</p>
                                    <p className="mt-1 text-sm text-[#445865]">{EVIDENCE_PROMPTS[whyQuestion.folderId]?.modelEvidence}</p>
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={() => {
                                    if (!evidencePinned) {
                                        if (evidenceNote.trim().length < 18) return;
                                        setEvidencePinned(true);
                                        return;
                                    }
                                    setWhyQuestion(null);
                                    setEvidenceNote('');
                                    setEvidencePinned(false);
                                }}
                                disabled={!evidencePinned && evidenceNote.trim().length < 18}
                                data-qa="cloud-cleaner-pin-evidence"
                                className="mt-4 w-full rounded-full px-4 py-3 text-sm font-black uppercase tracking-wide transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#5F947D]"
                                style={{
                                    backgroundColor: evidencePinned || evidenceNote.trim().length >= 18 ? '#5F947D' : '#E7D8BD',
                                    color: evidencePinned || evidenceNote.trim().length >= 18 ? '#FFFFFF' : '#445865',
                                }}
                            >
                                {evidencePinned ? 'Volgende file' : 'Pin bewijs'}
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Success Modal */}
            <AnimatePresence>
                {showCompletionModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#08283B]/50 backdrop-blur-sm"
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
                                    transition={{
                                        delay: 0.2,
                                        scale: { type: 'spring' },
                                        rotate: { duration: 0.7, ease: 'easeInOut' },
                                    }}
                                    className="w-24 h-24 bg-gradient-to-br from-[#5F947D] to-lab-sage text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[#5F947D]/20"
                                >
                                    <CheckCircle size={48} />
                                </motion.div>
                                <h3 className="text-2xl font-black text-[#08283B] mb-2" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>Opgeruimd Staat Netjes!</h3>
                                <p className="text-[#445865] mb-2">
                                    Je OneDrive is weer helemaal georganiseerd. Goed gedaan!
                                </p>
                                <div className="bg-[#5F947D]/10 rounded-2xl p-3 mb-6">
                                    <p className="text-[#5F947D] font-bold text-lg">+{score} XP verdiend!</p>
                                    {mistakes > 0 && (
                                        <p className="text-sm text-[#445865]">{mistakes} foutjes gemaakt, maar dat geeft niet!</p>
                                    )}
                                </div>
                                <button
                                    onClick={() => { clearSave(); onComplete(true); }}
                                    className="w-full py-4 bg-[#D97848] hover:bg-[#D97848] text-white rounded-full font-bold transition-all duration-300 shadow-lg hover:shadow-[#D97848]/30 focus-visible:ring-2 focus-visible:ring-[#D97848]"
                                >
                                    Voltooien
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
