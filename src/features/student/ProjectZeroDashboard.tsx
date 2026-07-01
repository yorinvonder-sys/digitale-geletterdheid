
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';

import { Rocket, BrainCircuit, ShieldCheck, Gamepad2, Stars, Info, Play, Feather, Puzzle, Database, ChevronRight, ChevronLeft, ChevronDown, ChevronUp, Calendar, Pencil, Map, Lightbulb, Trophy, LogOut, User, RotateCcw, Search, Scale, Lock, Settings2, Cloud, Folder, FileText, Monitor, Printer, AlertTriangle, Sparkles, MessageSquare, Send, Loader2, BookOpen, BarChart2, Eye, CheckCircle2, MonitorSmartphone, Home, Bell, Flame, Award } from 'lucide-react';
import { getLevelProgress, getXPToNextLevel, LEVEL_THRESHOLDS } from '@/utils/xp';
import { DuckMark } from '@/components/brand/DuckMark';
import { LazyAvatarViewer } from '@/features/profile/avatar/LazyAvatarViewer';
import { DEFAULT_AVATAR_CONFIG, UserStats, EducationLevel } from '@/types';
import { subscribeToPermissions, GamePermissions } from '@/services/PermissionService';
import { submitFeedback } from '@/services/feedbackService';
import { StudentLibrary } from '@/features/student/StudentLibrary';
import { BottomNav } from '@/components/app-shell/BottomNav';
import { SLO_KERNDOELEN, getKerndoelBadgeClasses, SloKerndoelCode } from '@/config/sloKerndoelen';
import { CURRICULUM, getYearConfig, getPeriodConfig } from '@/config/curriculum';
import { ROLES } from '@/config/agents';
import { ContainerConfig } from '@/config/containerTypes';
import { getContainerThemeDuck, getAutoTheme } from '@/config/containerThemes';
import { AdaptiveMissionSuggestions } from '@/features/dashboard/AdaptiveMissionSuggestions';
import { DashboardHero } from '@/features/dashboard/DashboardHero';
import { ProgressStrip } from '@/features/dashboard/ProgressStrip';
import { MissionPreviewVisual } from '@/features/dashboard/MissionPreviewVisual';
import { STUDENT_DASHBOARD_COLORS, PERIOD_THEME, DEFAULT_PERIOD_THEME, getYearGroupTheme, PERIOD_LEERDOELEN, type YearGroupTheme, type PeriodLeerdoel } from '@/config/dashboardThemes';
import { MISSION_SCREENSHOTS, MISSION_PREVIEW_OVERRIDES, inferMissionPreviewConfig, missionTagFor, type MissionPreviewKind, type MissionPreviewConfig } from '@/config/missionPreviewConfig';
import { Mission, MISSION_OVERRIDES, CURRICULUM_MISSION_IDS, getMissionOverride, getMissionTooltipInfo, buildMissionsForPeriod, buildMissionsFromContainer } from '@/utils/missionBuilder';
import type { SchedulingModel } from '@/config/containerTypes';
import { PLAYABLE_MISSION_IDS } from '@/features/public-site/demo/demoGalleryConfig';

interface DashboardProps {
    onSelectModule: (moduleId: string, libraryItemData?: any) => void;
    onOpenProfile: (tab?: 'profile' | 'shop' | 'trophies') => void;
    onLogout?: () => void;
    onOpenGames?: () => void;
    gamesEnabled?: boolean;
    userDisplayName?: string | null;
    userUid?: string; // For AI Chat
    activeWeek: number;
    setActiveWeek: (week: number) => void;
    activeYearGroup?: number;
    setActiveYearGroup?: (year: number) => void;
    schoolConfig?: { periodNaming?: string };
    onGoHome?: () => void;
    stats?: UserStats;
    focusMode?: boolean;
    userRole?: 'student' | 'teacher' | 'admin' | 'developer'; // For teacher/developer bypass of restrictions
    containers?: ContainerConfig[];
    schedulingModel?: SchedulingModel;
}

const FORCE_UNLOCK_ALL_ASSIGNMENTS =
    (import.meta as any).env?.DEV === true &&
    (import.meta as any).env?.VITE_FORCE_UNLOCK_ALL_ASSIGNMENTS === 'true';

const getStudentGamePush = (permissions: GamePermissions | null): { id: string; gameName: string } | null => {
    const push = permissions?.custom_settings?.studentGamePush;
    if (!push || typeof push !== 'object') return null;

    const record = push as Record<string, unknown>;
    const id =
        typeof record.id === 'string' ? record.id :
        typeof record.pushedAt === 'string' ? record.pushedAt :
        typeof record.pushed_at === 'string' ? record.pushed_at :
        null;

    if (!id) return null;

    return {
        id,
        gameName: typeof record.gameName === 'string' ? record.gameName : 'een game',
    };
};

// Legacy compat — niet meer gebruikt maar voorkomt crashes bij directe WEEK_MISSIONS referenties
const WEEK_MISSIONS: Record<number, Mission[]> = {
    1: [
        {
            id: 'magister-master',
            title: 'Magister Meester',
            description: 'Werk in de Magister app op je iPad.',
            icon: <ShieldCheck size={40} />,
            number: '01',
            status: 'available',
            isExternal: true,
            info: getMissionTooltipInfo('magister-master'),
            sloKerndoelen: ['21A', '21C']
        },
        {
            id: 'cloud-commander',
            title: 'Cloud Commander',
            description: 'Werk in de OneDrive app op je iPad.',
            icon: <Database size={40} />,
            number: '02',
            status: 'available',
            isExternal: true,
            info: getMissionTooltipInfo('cloud-commander'),
            sloKerndoelen: ['21A', '23A']
        },
        {
            id: 'word-wizard',
            title: 'Word Wizard',
            description: 'Werk in de Word app op je iPad.',
            icon: <Pencil size={40} />,
            number: '03',
            status: 'available',
            isExternal: true,
            info: getMissionTooltipInfo('word-wizard'),
            sloKerndoelen: ['21A', '22A']
        },
        {
            id: 'slide-specialist',
            title: 'Slide Specialist',
            description: 'Werk in de PowerPoint app op je iPad.',
            icon: <Play size={40} />,
            number: '04',
            status: 'available',
            isExternal: true,
            info: getMissionTooltipInfo('slide-specialist'),
            sloKerndoelen: ['21A', '21C', '22A']
        },
        {
            id: 'print-pro',
            title: 'Print Pro',
            description: 'Printen en inleveren via de apps op je iPad.',
            icon: <Stars size={40} />,
            number: '05',
            status: 'available',
            isExternal: true,
            info: getMissionTooltipInfo('print-pro'),
            sloKerndoelen: ['21A']
        },
    ],
    2: [
        { id: 'ipad-print-instructies', title: 'iPad Print Instructies', description: 'Leer stap-voor-stap printen vanaf je iPad met de RICOH myPrint app.', icon: <Printer size={40} />, number: 'MH1A', status: 'available', info: getMissionTooltipInfo('ipad-print-instructies'), isHighlighted: true, isReview: true, sloKerndoelen: ['21A'] },
        { id: 'cloud-cleaner', title: 'Cloud Schoonmaker', description: 'Sleep de rondslingerende bestanden naar de juiste mappen.', icon: <Cloud size={40} />, number: 'Review', status: 'available', info: getMissionTooltipInfo('cloud-cleaner'), isReview: true, sloKerndoelen: ['21A', '23A'] },
        { id: 'layout-doctor', title: 'Word Match', description: 'Koppel Word-problemen aan de juiste oplossing!', icon: <FileText size={40} />, number: 'Review', status: 'available', info: getMissionTooltipInfo('layout-doctor'), isReview: true, sloKerndoelen: ['21A'] },
        { id: 'pitch-police', title: 'Pitch Politie', description: 'Geef deze saaie slide een makeover zodat het publiek niet in slaap valt.', icon: <Monitor size={40} />, number: 'Review', status: 'available', info: getMissionTooltipInfo('pitch-police'), isReview: true, sloKerndoelen: ['21A', '22A'] },

        { id: 'prompt-master', title: 'Prompt Perfectionist', description: 'Leer het verschil tussen goede en slechte prompts.', icon: <Sparkles size={40} />, number: '01', status: 'available', info: getMissionTooltipInfo('prompt-master'), sloKerndoelen: ['21B', '22A'], sloVsoKerndoelen: ['18C', '19A', '20B'] },
        { id: 'game-programmeur', title: 'Game Programmeur', description: 'Repareer games met code. Bepaal zelf de regels van het spel.', icon: <Gamepad2 size={40} />, number: '02', status: 'available', info: getMissionTooltipInfo('game-programmeur'), sloKerndoelen: ['22A', '22B'], sloVsoKerndoelen: ['19A'] },
        { id: 'ai-trainer', title: 'AI Trainer', description: 'Leer een robot het verschil tussen materialen met supervised learning.', icon: <Database size={40} />, number: '04', status: 'available', info: getMissionTooltipInfo('ai-trainer'), sloKerndoelen: ['21D'], sloVsoKerndoelen: ['18C'] },
        { id: 'chatbot-trainer', title: 'Chatbot Trainer', description: 'Bouw je eigen chatbot en leer hoe AI gesprekken voert.', icon: <BrainCircuit size={40} />, number: '05', status: 'available', info: getMissionTooltipInfo('chatbot-trainer'), sloKerndoelen: ['21D', '22B'], sloVsoKerndoelen: ['18C', '19A'] },
        { id: 'ai-tekengame', title: 'AI Tekengame', description: 'Teken en laat de AI raden wat het is!', icon: <Pencil size={40} />, number: '06', status: 'available', info: getMissionTooltipInfo('ai-tekengame'), sloKerndoelen: ['21D'], sloVsoKerndoelen: ['18C'] },
        { id: 'game-director', title: 'De Game Director', description: 'Word de architect. Herschrijf de natuurwetten en ontwerp je eigen game-regelset.', icon: <Settings2 size={40} />, number: 'Vrije Keuze', status: 'available', info: getMissionTooltipInfo('game-director'), sloKerndoelen: ['22B'], sloVsoKerndoelen: ['19A'] },
        { id: 'verhalen-ontwerper', title: 'Verhalen Ontwerper', description: 'Visualiseer verhalen met AI. Leer prompts schrijven en beelden maken.', icon: <Feather size={40} />, number: '07', status: 'available', info: getMissionTooltipInfo('verhalen-ontwerper'), sloKerndoelen: ['21D', '22A'], sloVsoKerndoelen: ['18C', '19A'] },
        { id: 'ai-beleid-brainstorm', title: 'AI Beleid Brainstorm', description: 'Denk mee over AI-regels op school.', icon: <Scale size={40} />, number: '08', status: 'available', info: getMissionTooltipInfo('ai-beleid-brainstorm'), sloKerndoelen: ['21D', '23C'], sloVsoKerndoelen: ['20B'] },
    ],
    3: [
        { id: 'review-week-2', title: 'De Code-Criticus', description: 'Vind fouten in AI-content uit Week 2.', icon: <Search size={40} />, number: 'Review', status: 'available', info: getMissionTooltipInfo('review-week-2'), sloKerndoelen: ['21D', '22B'], sloVsoKerndoelen: ['18C'] },
        { id: 'data-detective', title: 'Data Detective', description: 'Ontdek wat bedrijven met data doen: risico’s en kansen.', icon: <BarChart2 size={40} />, number: '01', status: 'available', info: getMissionTooltipInfo('data-detective'), sloKerndoelen: ['21B', '23C'], sloVsoKerndoelen: ['18B', '20A'] },
        { id: 'deepfake-detector', title: 'Deepfake Detector', description: 'Spot AI-gegenereerde content en nepnieuws.', icon: <Eye size={40} />, number: '02', status: 'available', info: getMissionTooltipInfo('deepfake-detector'), sloKerndoelen: ['21B', '21D', '23A', '23C'], sloVsoKerndoelen: ['18B', '18C', '20A'] },
        { id: 'ai-spiegel', title: 'De AI Spiegel', description: 'Zie hoe jouw online gedrag een advertentieprofiel vormt.', icon: <BrainCircuit size={40} />, number: '03', status: 'available', info: getMissionTooltipInfo('ai-spiegel'), sloKerndoelen: ['23B', '23C'], sloVsoKerndoelen: ['20A', '20B'] },
        { id: 'social-safeguard', title: 'Social Safeguard', description: 'Train veilig handelen bij online druk, pesten en datamisbruik.', icon: <ShieldCheck size={40} />, number: '04', status: 'available', info: getMissionTooltipInfo('social-safeguard'), sloKerndoelen: ['23A', '23B'], sloVsoKerndoelen: ['20A', '20B'] },
        { id: 'cookie-crusher', title: 'Cookie Crusher', description: 'Herken dark patterns in cookie-popups en bescherm je privacy.', icon: <ShieldCheck size={40} />, number: '05', status: 'available', info: getMissionTooltipInfo('cookie-crusher'), sloKerndoelen: ['23C', '21B'], sloVsoKerndoelen: ['18B', '20A'] },
        { id: 'data-handelaar', title: 'De Data Handelaar', description: 'Ga undercover en ontmasker illegale datahandel.', icon: <Search size={40} />, number: '06', status: 'available', info: getMissionTooltipInfo('data-handelaar'), sloKerndoelen: ['23C', '23B'], sloVsoKerndoelen: ['20A', '20B'] },
        { id: 'privacy-profiel-spiegel', title: 'Privacy Profiel Spiegel', description: 'Check je eigen app-instellingen en ontdek wat je deelt.', icon: <Eye size={40} />, number: '07', status: 'available', info: getMissionTooltipInfo('privacy-profiel-spiegel'), sloKerndoelen: ['23A', '23B'], sloVsoKerndoelen: ['20A', '20B'] },
        { id: 'filter-bubble-breaker', title: 'Filter Bubble Breaker', description: 'Vergelijk twee social media feeds en ontdek filterbubbels.', icon: <BrainCircuit size={40} />, number: '08', status: 'available', info: getMissionTooltipInfo('filter-bubble-breaker'), sloKerndoelen: ['23B', '23C', '21B'], sloVsoKerndoelen: ['20A', '20B'] },
        { id: 'datalekken-rampenplan', title: 'Datalekken Rampenplan', description: 'Los een school datalek-crisis op!', icon: <AlertTriangle size={40} />, number: '09', status: 'available', info: getMissionTooltipInfo('datalekken-rampenplan'), sloKerndoelen: ['23A', '23B', '23C'], sloVsoKerndoelen: ['20A', '20B'] },
        { id: 'data-voor-data', title: 'Data voor Data', description: 'Hoeveel persoonlijke data zou jij inruilen?', icon: <Scale size={40} />, number: '10', status: 'available', info: getMissionTooltipInfo('data-voor-data'), sloKerndoelen: ['23C', '23B'], sloVsoKerndoelen: ['20A', '20B'] },
        { id: 'social-media-psychologist', title: 'Social Media Psycholoog', description: 'Begrijp de psychologie achter scrollen, likes en filterbubbels.', icon: <BrainCircuit size={40} />, number: 'Bonus', status: 'available', info: getMissionTooltipInfo('social-media-psychologist'), isBonus: true, sloKerndoelen: ['21B', '23B', '23C'], sloVsoKerndoelen: ['20B'] },
    ],
    4: [
        { id: 'review-week-3', title: 'De Ethische Raad', description: 'Adviseer over ethische dilemma\'s.', icon: <Scale size={40} />, number: 'Review', status: 'available', info: getMissionTooltipInfo('review-week-3'), sloKerndoelen: ['22B', '23C'] },
        { id: 'mission-blueprint', title: 'De Blauwdruk', description: 'Organiseer je meesterwerk. Gebruik Magister, OneDrive en Word om je plan te smeden.', icon: <Map size={40} />, number: '02', status: 'available', info: getMissionTooltipInfo('mission-blueprint'), sloKerndoelen: ['21A', '22A'] },
        { id: 'mission-vision', title: 'De Visie', description: 'Visualiseer je droom. Combineer AI-beelden met een strakke PowerPoint pitch.', icon: <Lightbulb size={40} />, number: '03', status: 'available', info: getMissionTooltipInfo('mission-vision'), sloKerndoelen: ['21B', '22A'] },
        { id: 'mission-launch', title: 'De Lancering', description: 'Breng het naar buiten. Print je designs en communiceer als een pro.', icon: <Rocket size={40} />, number: '04', status: 'available', info: getMissionTooltipInfo('mission-launch'), sloKerndoelen: ['21A', '21C'] },
    ]
};


const compactNumber = (value: number): string => new Intl.NumberFormat('nl-NL').format(value);

interface DashboardStatCardProps {
    icon: React.ReactNode;
    value: string | number;
    label: string;
    accent: string;
    onClick?: () => void;
}

const DashboardStatCard: React.FC<DashboardStatCardProps> = ({ icon, value, label, accent, onClick }) => {
    const content = (
        <div className="flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-duck-ink bg-duck-acid text-duck-ink">
                {icon}
            </span>
            <span className="min-w-0">
                <span className="block font-display text-2xl leading-none text-duck-ink">{value}</span>
                <span className="mt-1.5 block text-[11px] font-extrabold uppercase tracking-[0.14em] text-duck-ink/65 text-pretty">{label}</span>
            </span>
        </div>
    );

    if (onClick) {
        return (
            <button
                type="button"
                onClick={onClick}
                className="min-h-[74px] min-w-0 rounded-[1.5rem] border border-duck-ink/10 bg-white px-4 py-3 text-left shadow-duck-soft transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 motion-reduce:transition-none"
            >
                {content}
            </button>
        );
    }

    return (
        <div className="min-h-[74px] min-w-0 rounded-[1.5rem] border border-duck-ink/10 bg-white px-4 py-3 text-left shadow-duck-soft transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 motion-reduce:transition-none">
            {content}
        </div>
    );
};

interface StudentProjectCardProps {
    mission: Mission;
    isCompleted?: boolean;
    index: number;
    onSelectModule: (id: string) => void;
    onLockedDemoMission?: () => void;
    onInfoClick?: (info: string, kerndoelen?: SloKerndoelCode[]) => void;
    vsoProfile?: string;
}

const StudentProjectCard: React.FC<StudentProjectCardProps> = ({ mission, isCompleted, index, onSelectModule, onLockedDemoMission, onInfoClick, vsoProfile }) => {
    const displayKerndoelen = vsoProfile && mission.sloVsoKerndoelen ? mission.sloVsoKerndoelen : mission.sloKerndoelen;
    const canOpen = mission.status === 'available';
    const isLocked = mission.status === 'locked';
    const canOpenCard = canOpen || Boolean(isLocked && onLockedDemoMission);
    const handleOpen = () => {
        if (canOpen) {
            onSelectModule(mission.id);
            return;
        }
        if (isLocked && onLockedDemoMission) {
            onLockedDemoMission();
        }
    };

    return (
        <article
            className={`group flex h-full flex-col overflow-hidden rounded-[1.5rem] border bg-white shadow-duck-soft transition-all duration-200 motion-reduce:transition-none
                ${isCompleted ? 'border-duck-ink ring-2 ring-duck-ink/15' : 'border-duck-ink/10'}
                ${canOpen && !isCompleted ? 'hover:-translate-y-1 motion-reduce:hover:translate-y-0' : ''}
                ${isLocked ? 'opacity-60 grayscale-[0.3]' : ''}`}
        >
            <MissionPreviewVisual mission={mission} index={index} isCompleted={isCompleted} />
            <div className="flex flex-1 flex-col p-4">
                <div className="flex items-start justify-between gap-3">
                    <button
                        type="button"
                        onClick={handleOpen}
                        disabled={!canOpenCard}
                        className="min-w-0 flex-1 text-left disabled:cursor-not-allowed"
                        aria-label={`${mission.title} openen`}
                    >
                        <span className="block min-w-0">
                            <h3 className="line-clamp-2 font-display text-lg leading-tight text-balance text-duck-ink">
                                {mission.title}
                            </h3>
                            <p className="mt-2 line-clamp-2 text-sm font-semibold leading-relaxed text-pretty text-duck-ink/65">
                                {mission.description || mission.info || 'Werk aan een digitale skill en voeg bewijs toe aan je portfolio.'}
                            </p>
                        </span>
                    </button>
                    {mission.info && onInfoClick && canOpen && (
                        <button
                            type="button"
                            onClick={() => onInfoClick(mission.info!, displayKerndoelen)}
                            aria-label={`Meer informatie over ${mission.title}`}
                            className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-duck-ink/15 text-duck-ink transition-colors hover:border-duck-ink hover:bg-duck-bgLight"
                        >
                            <Info size={18} />
                        </button>
                    )}
                </div>

                <div className="mt-auto flex items-center justify-end gap-3 pt-4">
                    {isCompleted ? (
                        <span className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-duck-ink px-4 text-sm font-extrabold text-duck-acid">
                            <ShieldCheck size={16} /> Voltooid
                        </span>
                    ) : isLocked ? (
                        onLockedDemoMission ? (
                            <button
                                type="button"
                                onClick={onLockedDemoMission}
                                className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-duck-ink/10 bg-duck-bgLight px-4 text-sm font-bold text-duck-ink/65 transition-colors hover:border-duck-ink/30 hover:text-duck-ink"
                            >
                                <Lock size={14} /> {mission.lockLabel ?? 'Beschikbaar na aanmelding'}
                            </button>
                        ) : (
                            <span className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-duck-ink/10 bg-duck-bgLight px-4 text-sm font-bold text-duck-ink/65">
                                <Lock size={14} /> {mission.lockLabel ?? 'Voltooi eerst de herhalingen'}
                            </span>
                        )
                    ) : (
                        <button
                            type="button"
                            onClick={() => onSelectModule(mission.id)}
                            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-duck-ink bg-duck-acid px-5 text-sm font-extrabold text-duck-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-duck-ink hover:text-duck-acid active:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                        >
                            Start missie <ChevronRight size={16} />
                        </button>
                    )}
                </div>
            </div>
        </article>
    );
};

export const ProjectZeroDashboard: React.FC<DashboardProps> = ({
    onSelectModule,
    onOpenProfile,
    onLogout,
    onOpenGames,
    gamesEnabled = false,
    userDisplayName,
    userUid,
    activeWeek,
    setActiveWeek,
    activeYearGroup,
    setActiveYearGroup,
    schoolConfig,
    onGoHome,
    stats,
    focusMode = false,
    userRole = 'student',
    containers,
    schedulingModel = 'default',
}) => {
    // Curriculum-aware variabelen
    const currentYearGroup = activeYearGroup ?? 1;
    const isDeveloper = userRole === 'developer';
    const isCustomSchedule = schedulingModel === 'custom' && (containers?.length ?? 0) > 0;
    const periodNaming = schoolConfig?.periodNaming || CURRICULUM.defaultPeriodNaming;
    const activeContainer = containers?.find(c => c.sortOrder === activeWeek);
    const containerLabel = activeContainer?.label || `${periodNaming} ${activeWeek}`;
    const yearConfig = getYearConfig(currentYearGroup);
    const currentPeriodConfig = getPeriodConfig(currentYearGroup, activeWeek);
    const periodTheme = isCustomSchedule
        ? getContainerThemeDuck(activeContainer?.colorKey)
        : (PERIOD_THEME[activeWeek] || DEFAULT_PERIOD_THEME);
    const periodLeerdoel = PERIOD_LEERDOELEN[`${currentYearGroup}-${activeWeek}`];
    const [showXPPopup, setShowXPPopup] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = React.useState(false);
    const [showYearGroupMenu, setShowYearGroupMenu] = useState(false);
    const [selectedMissionInfo, setSelectedMissionInfo] = useState<string | { info: string; kerndoelen: SloKerndoelCode[] } | null>(null);
    const [permissions, setPermissions] = useState<GamePermissions | null>(null);
    const [dashboardModal, setDashboardModal] = useState<'notifications' | 'privacy' | null>(null);
    const yearGroupMenuRef = React.useRef<HTMLDivElement | null>(null);
    const dashboardScrollRef = React.useRef<HTMLDivElement | null>(null);

    // Feedback modal state
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [feedbackText, setFeedbackText] = useState('');
    const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
    const [showAllProjects, setShowAllProjects] = useState(false);
    const [feedbackSuccess, setFeedbackSuccess] = useState(false);
    const [feedbackError, setFeedbackError] = useState<string | null>(null);

    // Library modal state
    const [showLibrary, setShowLibrary] = useState(false);

    const handleSubmitFeedback = async () => {
        if (!feedbackText.trim() || !userUid) return;
        setFeedbackSubmitting(true);
        setFeedbackError(null);
        try {
            await submitFeedback(
                userUid,
                userDisplayName || 'Anoniem',
                stats?.studentClass,
                feedbackText.trim()
            );
            setFeedbackSuccess(true);
            setFeedbackText('');
            // Don't auto-close - let user click the "Sluiten" button to confirm they saw it
        } catch (error) {
            console.error('Failed to submit feedback:', error);
            setFeedbackError((error as Error)?.message || 'Feedback kon niet worden verzonden. Probeer het opnieuw.');
        } finally {
            setFeedbackSubmitting(false);
        }
    };

    // Touch swipe state for week navigation
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const minSwipeDistance = 80;

    // Game activation notification state
    const [showGameNotification, setShowGameNotification] = useState(false);
    const [activatedGameName, setActivatedGameName] = useState<string | null>(null);
    const seenPermissionSnapshotRef = React.useRef(false);
    const latestGamePushIdRef = React.useRef<string | null>(null);

    // Subscribe to permission changes
    useEffect(() => {
        if (userUid === 'capture-student') return;
        // Real-time updates. A game becoming available should not open a modal by itself;
        // only an explicit teacher push in custom_settings.studentGamePush may notify students.
        const unsubscribe = subscribeToPermissions(stats?.schoolId, (newPermissions) => {
            const latestPush = getStudentGamePush(newPermissions);
            const latestPushId = latestPush?.id ?? null;

            if (
                seenPermissionSnapshotRef.current &&
                latestPush &&
                latestPushId !== latestGamePushIdRef.current
            ) {
                setActivatedGameName(latestPush.gameName);
                setShowGameNotification(true);
            }

            latestGamePushIdRef.current = latestPushId;
            seenPermissionSnapshotRef.current = true;
            setPermissions(newPermissions);
        });

        return () => unsubscribe();
    }, [stats?.schoolId, userUid]);

    useEffect(() => {
        if (!showYearGroupMenu) return;

        const handlePointerDown = (event: PointerEvent) => {
            if (!yearGroupMenuRef.current) return;
            if (!yearGroupMenuRef.current.contains(event.target as Node)) {
                setShowYearGroupMenu(false);
            }
        };

        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setShowYearGroupMenu(false);
            }
        };

        document.addEventListener('pointerdown', handlePointerDown);
        document.addEventListener('keydown', handleEscapeKey);
        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [showYearGroupMenu]);

    // Daily streak calculation
    const dailyStreak = React.useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        const lastLogin = stats?.lastLoginDate;
        if (!lastLogin) return 1;
        if (lastLogin === today) return stats?.dailyStreak || 1;
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        return lastLogin === yesterday ? (stats?.dailyStreak || 0) + 1 : 1;
    }, [stats?.lastLoginDate, stats?.dailyStreak]);

    // Import shared XP utilities
    const xp = stats?.xp || 0;
    const level = stats?.level || 1;
    const availableYearGroups = useMemo(() => {
        const userLevel = (stats?.educationLevel as EducationLevel) || 'havo';
        return Object.entries(CURRICULUM.yearGroups)
            .filter(([_, config]) => isDeveloper || config.availableLevels.includes(userLevel))
            .map(([yearStr, config]) => ({ year: Number(yearStr), config }))
            .sort((a, b) => a.year - b.year);
    }, [isDeveloper, stats?.educationLevel]);
    const selectedYearGroupTitle = availableYearGroups.find(({ year }) => year === currentYearGroup)?.config.title || `Leerjaar ${currentYearGroup}`;
    const activeYearTheme = useMemo(() => getYearGroupTheme(currentYearGroup), [currentYearGroup]);
    const selectedYearGroupSubtitle = `Leerjaar ${currentYearGroup}`;

    // Memoize expensive calculations
    const progressPercentage = React.useMemo(
        () => getLevelProgress(xp, level),
        [xp, level]
    );
    const xpToNext = React.useMemo(
        () => getXPToNextLevel(xp, level),
        [xp, level]
    );

    // Filter relevant missions and apply locking logic
    const isTeacher = userRole === 'teacher' || userRole === 'admin' || isDeveloper;
    const canBypassMissionLocks = isTeacher || FORCE_UNLOCK_ALL_ASSIGNMENTS;
    const [leerdoelenOpen, setLeerdoelenOpen] = useState(isTeacher);

    const currentMissions = useMemo(() => {
        let missions = isCustomSchedule && activeContainer
            ? buildMissionsFromContainer(activeContainer)
            : buildMissionsForPeriod(currentYearGroup, activeWeek);

        // Teachers and temporary launch preview can see all missions without restrictions.
        if (canBypassMissionLocks) {
            return missions.map(mission => ({
                ...mission,
                status: 'available' as const
            }));
        }

        // Public demo (/leerlingdemo): allowlist only. Solely the curated,
        // security-vetted demo missions are openable; everything else stays
        // visibly locked. Playable missions are sorted first so they surface in
        // the dashboard's default 3-card preview. Shares PLAYABLE_MISSION_IDS
        // with DemoMissionHost (single source of truth).
        if (userUid === 'capture-student') {
            return missions
                .map(mission =>
                    PLAYABLE_MISSION_IDS.has(mission.id)
                        ? { ...mission, status: 'available' as const }
                        : { ...mission, status: 'locked' as const, lockLabel: 'Beschikbaar na aanmelding' }
                )
                .sort((a, b) => Number(PLAYABLE_MISSION_IDS.has(b.id)) - Number(PLAYABLE_MISSION_IDS.has(a.id)));
        }

        // 0. Filter out class-restricted missions if user's class doesn't match
        const userClass = stats?.studentClass;
        missions = missions.filter(mission => {
            if (!mission.classRestriction) return true;
            return mission.classRestriction === userClass;
        });

        // 1. Check if the period is locked via teacher permissions
        const weekPermissionId = `week-${activeWeek}`;
        const enabledGames = permissions?.enabled_games || [];
        const isWeekEnabled = !permissions || enabledGames.length === 0 || enabledGames.includes(weekPermissionId);

        if (!isWeekEnabled) {
            return missions.map(mission => ({
                ...mission,
                status: 'locked' as const,
                info: `Deze ${periodNaming.toLowerCase()} is nog niet geopend door je docent.`
            }));
        }

        // 2. Generic review gate: if period/container has review missions, require them first
        const pConfig = isCustomSchedule ? null : getPeriodConfig(currentYearGroup, activeWeek);
        const hasReviewGate = isCustomSchedule
            ? (activeContainer?.isReviewGate ?? false) && missions.some(m => m.isReview)
            : !!(pConfig?.reviewMissions && pConfig.reviewMissions.length > 0);

        if (hasReviewGate) {
            const reviewIds = isCustomSchedule
                ? missions.filter(m => m.isReview).map(m => m.id)
                : pConfig!.reviewMissions!;
            const completedMissions = stats?.missionsCompleted || [];
            const allReviewsDone = reviewIds.every(id => {
                if (id === 'ipad-print-instructies' && stats?.studentClass !== 'MH1A') return true;
                return completedMissions.includes(id);
            });

            return missions.map(mission => {
                if (!mission.isReview && !allReviewsDone) {
                    return {
                        ...mission,
                        status: 'locked' as const,
                        info: 'Voltooi eerst alle herhalingsopdrachten voordat je deze missie kunt starten.'
                    };
                }
                return { ...mission, status: 'available' as const };
            });
        }

        return missions;
    }, [currentYearGroup, activeWeek, stats, permissions, canBypassMissionLocks, periodNaming, userUid, isCustomSchedule, activeContainer]);

    // Stable callbacks for MissionCard memoization (reduces re-renders of mission grid)
    const handleInfoClick = useCallback((info: string, kerndoelen?: SloKerndoelCode[]) => {
        setSelectedMissionInfo({ info, kerndoelen: kerndoelen || [] });
    }, []);

    // Swipe handlers for week navigation
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        // Find next available week
        const availableWeeks = containers?.length
            ? containers.map(c => c.sortOrder)
            : [1, 2, 3, 4];

        const maxWeek = containers?.length ? Math.max(...containers.map(c => c.sortOrder)) : 4;
        if (isLeftSwipe && activeWeek < maxWeek) {
            // Swipe left = next week
            const nextWeek = availableWeeks.find(w => w > activeWeek);
            if (nextWeek) setActiveWeek(nextWeek);
        }
        const minWeek = containers?.length ? Math.min(...containers.map(c => c.sortOrder)) : 1;
        if (isRightSwipe && activeWeek > minWeek) {
            // Swipe right = previous week
            const prevWeek = [...availableWeeks].reverse().find(w => w < activeWeek);
            if (prevWeek) setActiveWeek(prevWeek);
        }

        setTouchStart(null);
        setTouchEnd(null);
    };


    // Memoized mission filtering — avoid recalculating on every render
    const reviewMissions = useMemo(() => currentMissions.filter(m => m.isReview), [currentMissions]);
    const mainMissions = useMemo(() => currentMissions.filter(m => !m.isReview), [currentMissions]);

    // Calculate progress stats for the current week
    const totalMissions = mainMissions.length;
    const completedCount = mainMissions.filter(m => stats?.missionsCompleted?.includes(m.id)).length;

    // For Week 2: check review mission progress
    const completedReviewCount = reviewMissions.filter(m => stats?.missionsCompleted?.includes(m.id) || (m.id === 'ipad-print-instructies' && stats?.studentClass !== 'MH1A')).length;
    const allReviewsDone = reviewMissions.length === 0 || completedReviewCount >= reviewMissions.length;

    const [activeNav, setActiveNav] = useState('Dashboard');

    // Bottom nav active tab state
    const [bottomNavTab, setBottomNavTab] = useState<'dashboard' | 'library' | 'profile' | 'trophies' | 'games'>('dashboard');

    const scrollDashboardToTop = useCallback(() => {
        if (dashboardScrollRef.current && window.matchMedia('(min-width: 1024px)').matches) {
            dashboardScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const scrollDashboardSectionIntoView = useCallback((sectionId: string, fallbackSectionId?: string) => {
        const target = document.getElementById(sectionId)
            ?? (fallbackSectionId ? document.getElementById(fallbackSectionId) : null);
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, []);

    const handleBottomNav = (tab: 'dashboard' | 'library' | 'profile' | 'trophies' | 'games') => {
        setBottomNavTab(tab);
        switch (tab) {
            case 'dashboard':
                scrollDashboardToTop();
                break; // Already on dashboard
            case 'library':
                setShowLibrary(true);
                break;
            case 'profile':
                onOpenProfile();
                break;
            case 'trophies':
                onOpenProfile('trophies');
                break;
            case 'games':
                if (gamesEnabled && onOpenGames) onOpenGames();
                break;
        }
    };

    const completedMissionTotal = stats?.missionsCompleted?.length || 0;
    const profileInitial = (userDisplayName || 'Mila').trim().charAt(0).toUpperCase() || 'M';
    const isVisualCapture = userUid === 'capture-student';
    const featuredMission =
        mainMissions.find(m => m.status === 'available' && !stats?.missionsCompleted?.includes(m.id))
        || mainMissions.find(m => m.status === 'available')
        || mainMissions[0];
    const projectMissions = mainMissions.length > 0 ? mainMissions : currentMissions.filter(m => m.status === 'available');
    const canOpenFeaturedMission = featuredMission?.status === 'available';
    const dashboardStats = [
        { icon: <Award size={22} />, value: compactNumber(xp), label: 'XP punten', accent: STUDENT_DASHBOARD_COLORS.olive },
        { icon: <Flame size={22} />, value: dailyStreak, label: dailyStreak === 1 ? 'dag streak' : 'dagen streak', accent: STUDENT_DASHBOARD_COLORS.coral },
        { icon: <ShieldCheck size={22} />, value: `Level ${level}`, label: 'Creator', accent: STUDENT_DASHBOARD_COLORS.teal },
        { icon: <Trophy size={22} />, value: completedMissionTotal, label: 'badges behaald', accent: STUDENT_DASHBOARD_COLORS.gold },
    ];
    const dashboardNavItems = [
        { label: 'Dashboard', icon: <Home size={19} />, active: activeNav === 'Dashboard', onClick: () => { setActiveNav('Dashboard'); scrollDashboardToTop(); } },
        { label: 'Mijn portfolio', icon: <User size={19} />, active: activeNav === 'Mijn portfolio', onClick: () => { setActiveNav('Mijn portfolio'); onOpenProfile(); } },
    ];
    const learningProgressControls = (
        <>
            <section className="mb-4 hidden items-center justify-between gap-4 lg:flex">
                <button
                    type="button"
                    onClick={onGoHome}
                    aria-label="Ga naar de startpagina"
                    className="inline-flex min-h-[52px] shrink-0 items-center gap-3 bg-transparent p-0 text-left transition-transform duration-200 hover:-translate-y-0.5 motion-reduce:transition-none"
                >
                    <DuckMark className="size-9" />
                    <span className="text-xl font-extrabold tracking-tight text-duck-ink">DGSkills</span>
                </button>

                <nav aria-label="Dashboard navigatie" className="flex min-h-[52px] min-w-0 flex-1 items-center gap-2 rounded-full border border-duck-ink/10 bg-white p-1.5 shadow-duck-soft">
                    {dashboardNavItems.map(item => (
                        <button
                            key={item.label}
                            type="button"
                            onClick={item.onClick}
                            className={`inline-flex min-h-[44px] min-w-0 flex-1 items-center justify-center gap-2 rounded-full px-4 text-sm font-extrabold transition-colors ${item.active ? 'border border-duck-ink bg-duck-acid text-duck-ink' : 'text-duck-ink/65 hover:bg-duck-bgLight hover:text-duck-ink'}`}
                        >
                            {item.icon}
                            <span className="truncate">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <button
                    type="button"
                    onClick={() => setShowFeedbackModal(true)}
                    className="inline-flex min-h-[52px] shrink-0 items-center gap-2 rounded-full border border-duck-ink/10 bg-white px-5 text-sm font-extrabold text-duck-ink shadow-duck-soft transition-transform duration-200 hover:-translate-y-0.5 motion-reduce:transition-none"
                    aria-label="Geef feedback aan de ontwikkelaar"
                    data-tutorial="student-feedback-btn"
                >
                    <MessageSquare size={17} className="text-duck-ink" />
                    Feedback
                </button>
            </section>

            <section className="mb-6 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
                <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
                    {availableYearGroups.length > 1 && (
                        <div ref={yearGroupMenuRef} className="relative shrink-0">
                            <button
                                type="button"
                                aria-haspopup="listbox"
                                aria-expanded={showYearGroupMenu}
                                aria-label="Kies digitale leerlijn"
                                onClick={() => setShowYearGroupMenu(prev => !prev)}
                                className={`flex min-h-[56px] w-full items-center gap-3 rounded-3xl border-2 px-4 text-left shadow-duck-soft transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-4 motion-reduce:transition-none sm:w-[304px] ${activeYearTheme.triggerBg} ${activeYearTheme.activeBorder} ${activeYearTheme.focusRing}`}
                            >
                                <span className={`flex size-10 shrink-0 items-center justify-center rounded-2xl ${activeYearTheme.badgeBg} ${activeYearTheme.badgeText}`}>
                                    <activeYearTheme.Icon size={16} />
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className={`flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.14em] ${activeYearTheme.activeText} opacity-80`}>
                                        <span className={`size-1.5 rounded-full ${activeYearTheme.accentDot}`} aria-hidden="true" />
                                        Leerlijn
                                    </span>
                                    <span className={`block truncate text-sm font-extrabold ${activeYearTheme.activeText}`}>{selectedYearGroupTitle}</span>
                                </span>
                                <span className={`hidden rounded-full px-2.5 py-1 text-[11px] font-extrabold sm:inline-flex ${activeYearTheme.badgeBg} ${activeYearTheme.badgeText}`}>
                                    {selectedYearGroupSubtitle}
                                </span>
                                <ChevronRight size={16} className={`shrink-0 transition-transform duration-200 ${activeYearTheme.activeText} ${showYearGroupMenu ? '-rotate-90' : 'rotate-90'}`} />
                            </button>

                            {showYearGroupMenu && (
                                <div
                                    role="listbox"
                                    aria-label="Digitale leerlijnen"
                                    className="absolute left-0 top-[calc(100%+0.5rem)] z-40 w-[min(92vw,320px)] rounded-[1.5rem] border border-duck-ink/10 bg-white p-2 shadow-duck-soft"
                                >
                                    {availableYearGroups.map(({ year, config }) => {
                                        const isActive = year === currentYearGroup;
                                        const optionTheme = getYearGroupTheme(year);
                                        return (
                                            <button
                                                key={year}
                                                type="button"
                                                role="option"
                                                aria-selected={isActive}
                                                onClick={() => {
                                                    setActiveYearGroup?.(year);
                                                    setActiveWeek(1);
                                                    setShowYearGroupMenu(false);
                                                }}
                                                className={`flex min-h-[52px] w-full items-center gap-3 rounded-2xl border px-3 text-left text-sm transition-colors ${isActive ? `${optionTheme.triggerBg} ${optionTheme.activeBorder} ${optionTheme.activeText}` : 'border-transparent text-duck-ink/65 hover:bg-duck-bgLight hover:text-duck-ink'}`}
                                            >
                                                <span className={`flex size-8 shrink-0 items-center justify-center rounded-xl ${optionTheme.badgeBg} ${optionTheme.badgeText}`}>
                                                    <optionTheme.Icon size={14} />
                                                </span>
                                                <span className="min-w-0 flex-1">
                                                    <span className="block truncate font-extrabold">{config.title}</span>
                                                    <span className="block text-xs font-semibold opacity-70">Leerjaar {year}</span>
                                                </span>
                                                {isActive && <CheckCircle2 size={16} className={optionTheme.activeText} />}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {isCustomSchedule && containers ? (
                        <div className="flex min-w-0 flex-wrap gap-2 overflow-x-auto rounded-full border border-duck-ink/10 bg-white p-1.5 shadow-duck-soft sm:flex-1">
                            {[...containers].sort((a, b) => a.sortOrder - b.sortOrder).map((container) => (
                                <button
                                    key={container.id}
                                    onClick={() => setActiveWeek(container.sortOrder)}
                                    title={container.label}
                                    className={`min-h-[44px] min-w-0 flex-shrink-0 rounded-full px-3 text-sm font-extrabold transition-colors ${activeWeek === container.sortOrder ? 'border border-duck-ink bg-duck-acid text-duck-ink' : 'text-duck-ink/65 hover:bg-duck-bgLight hover:text-duck-ink'}`}
                                >
                                    <span className="block truncate">{container.label}</span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="grid min-w-0 grid-cols-2 gap-2 rounded-full border border-duck-ink/10 bg-white p-1.5 shadow-duck-soft sm:flex-1 sm:grid-cols-4">
                            {Object.keys(yearConfig?.periods || {}).map(Number).sort((a, b) => a - b).map((period) => {
                                const pConf = yearConfig?.periods[period];
                                return (
                                    <button
                                        key={period}
                                        onClick={() => setActiveWeek(period)}
                                        title={pConf?.title}
                                        className={`min-h-[44px] min-w-0 rounded-full px-3 text-sm font-extrabold transition-colors ${activeWeek === period ? 'border border-duck-ink bg-duck-acid text-duck-ink' : 'text-duck-ink/65 hover:bg-duck-bgLight hover:text-duck-ink'}`}
                                    >
                                        <span className="block truncate">{periodNaming} {period}</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {(isCustomSchedule ? (activeContainer?.sloFocus?.length ?? 0) > 0 : !!currentPeriodConfig) && (
                    <button
                        type="button"
                        onClick={() => setLeerdoelenOpen(!leerdoelenOpen)}
                        className="inline-flex min-h-[48px] items-center justify-between gap-3 rounded-full border border-duck-ink/10 bg-white px-5 text-left text-sm font-extrabold text-duck-ink shadow-duck-soft transition-transform duration-200 hover:-translate-y-0.5 motion-reduce:transition-none"
                    >
                        <span className="inline-flex items-center gap-2"><CheckCircle2 size={17} className="text-duck-ink" /> Leerdoelen</span>
                        <ChevronRight size={16} className={`text-duck-ink/65 transition-transform duration-200 ${leerdoelenOpen ? 'rotate-90' : ''}`} />
                    </button>
                )}
            </section>

            {leerdoelenOpen && (isCustomSchedule ? (activeContainer?.sloFocus?.length ?? 0) > 0 : !!currentPeriodConfig) && (
                <section className="mb-6 rounded-[1.5rem] border border-duck-ink/10 bg-white p-5 shadow-duck-soft">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                            <h2 className="font-display text-lg text-balance text-duck-ink">Leerdoelen {isCustomSchedule ? activeContainer?.label : `${periodNaming} ${activeWeek}`}</h2>
                            <p className="mt-2 max-w-3xl text-sm font-semibold leading-relaxed text-pretty text-duck-ink/65">
                                {isCustomSchedule
                                    ? (activeContainer?.subtitle || '')
                                    : (periodLeerdoel
                                        ? (stats?.vsoProfile && periodLeerdoel.descriptionVso ? periodLeerdoel.descriptionVso : periodLeerdoel.description)
                                        : currentPeriodConfig!.subtitle)}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {(isCustomSchedule
                                ? (activeContainer?.sloFocus ?? [])
                                : (stats?.vsoProfile && currentPeriodConfig!.sloFocusVso ? currentPeriodConfig!.sloFocusVso : currentPeriodConfig!.sloFocus)
                            ).map(code => (
                                <span key={code} className={`rounded-full border px-2.5 py-1 text-xs font-extrabold ${getKerndoelBadgeClasses(code)}`}>
                                    {code}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {reviewMissions.length > 0 && !allReviewsDone && !canBypassMissionLocks && userUid !== 'capture-student' && (
                <section className="mb-6 flex items-center gap-3 rounded-[1.5rem] bg-duck-ink px-5 py-4 shadow-duck-soft">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-duck-acid text-duck-ink">
                        <AlertTriangle size={18} />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-extrabold text-white">Eerst de herhalingsopdrachten</p>
                        <p className="text-xs font-semibold text-white/70">Voltooi {completedReviewCount}/{reviewMissions.length} herhalingen om de nieuwe missies vrij te spelen.</p>
                    </div>
                </section>
            )}
        </>
    );

    return (
        <div className="relative min-h-dvh w-full bg-duck-bg pb-safe font-sans text-duck-ink lg:h-dvh lg:overflow-hidden">

                {/* Student Library Modal */}
                {userUid && (
                    <StudentLibrary
                        isOpen={showLibrary}
                        onClose={() => setShowLibrary(false)}
                        userId={userUid}
                        onStartMission={() => onGoHome?.()}
                        onOpenItem={(item) => {
                            // Close library and open the mission with the saved data
                            setShowLibrary(false);

                            // Navigate to the relevant mission WITH the saved library data
                            if (item.mission_id) {
                                onSelectModule(item.mission_id, item.data);
                            }
                        }}
                    />
                )}

                {/* FOCUS MODE OVERLAY */}
                {focusMode && (
                    <div className="fixed inset-0 z-[200] bg-duck-ink/95 backdrop-blur-md flex items-center justify-center p-6 text-center animate-in fade-in duration-500">
                        <div className="max-w-md">
                            <div className="w-24 h-24 bg-duck-acid rounded-[2rem] flex items-center justify-center text-duck-ink mx-auto mb-8 shadow-2xl shadow-black/40">
                                <Lock size={48} />
                            </div>
                            <h2 className="font-display text-4xl text-white mb-4">Focus modus actief</h2>
                            <p className="text-white/70 font-semibold text-lg leading-relaxed">
                                De docent vraagt nu je aandacht. <br />
                                Kijk naar het bord en luister naar de instructies.
                            </p>
                            <div className="mt-12 flex gap-2 justify-center">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-2 h-2 bg-duck-acid rounded-full animate-pulse motion-reduce:animate-none" style={{ animationDelay: `${i * 0.2}s` }}></div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* XP POPUP OVERLAY */}
                {showXPPopup && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-duck-ink/40 backdrop-blur-[2px] transition-opacity"
                            onClick={() => setShowXPPopup(false)}
                        />
                        <div className="bg-white rounded-[1.5rem] p-8 shadow-duck-soft border border-duck-ink/10 w-full max-w-sm relative z-10 animate-in zoom-in duration-300 motion-reduce:animate-none">
                            <div className="flex flex-col items-center text-center">
                                <div className="bg-duck-acid border border-duck-ink w-20 h-20 rounded-3xl flex items-center justify-center text-duck-ink shadow-lg mb-6 transform rotate-3">
                                    <Trophy size={40} />
                                </div>
                                <h3 className="font-display text-3xl text-duck-ink mb-1">Level {level}</h3>
                                <p className="text-duck-ink/65 font-extrabold uppercase tracking-[0.16em] text-[10px] mb-6">Jouw voortgang</p>

                                <div className="w-full bg-duck-ink/10 h-4 rounded-full overflow-hidden mb-4 p-1">
                                    <div
                                        className="h-full bg-duck-acid ring-1 ring-duck-ink/15 rounded-full transition-all duration-1000 motion-reduce:transition-none"
                                        style={{ width: `${progressPercentage}%` }}
                                    />
                                </div>

                                <div className="flex justify-between w-full text-sm font-extrabold text-duck-ink mb-8 lowercase">
                                    <span>{xp} xp</span>
                                    <span className="text-duck-ink/65">nog {xpToNext} xp voor lvl {level + 1}</span>
                                </div>

                                <button
                                    onClick={() => setShowXPPopup(false)}
                                    className="w-full py-4 bg-duck-ink text-duck-acid rounded-full font-extrabold uppercase tracking-[0.12em] transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0 motion-reduce:transition-none"
                                >
                                    Begrepen!
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* GAME ACTIVATION NOTIFICATION */}
                {showGameNotification && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-duck-ink/40 backdrop-blur-[2px] transition-opacity"
                            onClick={() => setShowGameNotification(false)}
                        />
                        <div className="rounded-[1.5rem] p-8 shadow-duck-soft border border-duck-ink/10 bg-white w-full max-w-sm relative z-10 animate-in zoom-in duration-300 motion-reduce:animate-none">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-20 h-20 rounded-2xl flex items-center justify-center bg-duck-ink text-duck-acid shadow-lg mb-5">
                                    <Gamepad2 size={40} />
                                </div>
                                <h3 className="font-display text-2xl mb-2 text-duck-ink">Game geactiveerd!</h3>
                                <p className="text-sm font-semibold mb-1 text-duck-ink/65">
                                    De docent heeft {activatedGameName || 'een game'} geactiveerd!
                                </p>
                                <p className="text-xs mb-6 text-duck-ink/65">
                                    Je kunt nu meedoen aan de game-sessie met je klasgenoten.
                                </p>

                                <div className="flex flex-col gap-2.5 w-full">
                                    <button
                                        onClick={() => {
                                            setShowGameNotification(false);
                                            if (onOpenGames) onOpenGames();
                                        }}
                                        className="w-full py-3.5 rounded-full border border-duck-ink bg-duck-acid text-duck-ink font-extrabold text-sm transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0 motion-reduce:transition-none flex items-center justify-center gap-2"
                                    >
                                        <Play size={16} fill="currentColor" />
                                        Naar games
                                    </button>
                                    <button
                                        onClick={() => setShowGameNotification(false)}
                                        className="w-full py-2.5 font-semibold text-sm transition-colors text-duck-ink/65 hover:text-duck-ink"
                                    >
                                        Later, ik ben nog bezig
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* DASHBOARD ACTION MODALS */}
                {dashboardModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="dashboard-action-title">
                        <div
                            className="absolute inset-0 bg-duck-ink/40 backdrop-blur-[2px] transition-opacity"
                            onClick={() => setDashboardModal(null)}
                        />
                        <div className="relative z-10 w-full max-w-md rounded-[1.5rem] border border-duck-ink/10 bg-white p-7 shadow-duck-soft animate-in zoom-in duration-200 motion-reduce:animate-none">
                            {dashboardModal === 'notifications' && (
                                <>
                                    <div className="mb-5 flex items-center gap-3">
                                        <div className="flex size-12 items-center justify-center rounded-2xl border border-duck-ink bg-duck-acid text-duck-ink">
                                            <Bell size={22} />
                                        </div>
                                        <div>
                                            <h3 id="dashboard-action-title" className="font-display text-2xl text-duck-ink">Geen nieuwe meldingen</h3>
                                            <p className="text-sm font-semibold text-duck-ink/65">Je bent helemaal bij.</p>
                                        </div>
                                    </div>
                                    <p className="text-sm leading-relaxed text-duck-ink/65">
                                        Als je docent een game, opdracht of bericht klaarzet, zie je dat hier terug.
                                    </p>
                                </>
                            )}
                            {dashboardModal === 'privacy' && (
                                <>
                                    <div className="mb-5 flex items-center gap-3">
                                        <div className="flex size-12 items-center justify-center rounded-2xl bg-duck-ink text-duck-acid">
                                            <Lock size={22} />
                                        </div>
                                        <div>
                                            <h3 id="dashboard-action-title" className="font-display text-2xl text-duck-ink">Veiligheid & privacy</h3>
                                            <p className="text-sm font-semibold text-duck-ink/65">Jij houdt controle over je data.</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3 text-sm leading-relaxed text-duck-ink/65">
                                        <p>DGSkills gebruikt je voortgang alleen om jou en je docent te helpen bij de opdrachten.</p>
                                        <p>We tonen geen persoonlijke gegevens aan andere leerlingen en delen je werk niet zonder toestemming.</p>
                                    </div>
                                </>
                            )}
                            <button
                                type="button"
                                onClick={() => setDashboardModal(null)}
                                className="mt-7 inline-flex min-h-[44px] w-full items-center justify-center rounded-full bg-duck-ink px-5 text-sm font-extrabold text-duck-acid transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0 motion-reduce:transition-none"
                            >
                                Begrepen
                            </button>
                        </div>
                    </div>
                )}

                {/* FEEDBACK MODAL */}
                {showFeedbackModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-duck-ink/40 backdrop-blur-[2px] transition-opacity"
                            onClick={() => { if (!feedbackSubmitting && !feedbackSuccess) { setShowFeedbackModal(false); setFeedbackError(null); } }}
                        />
                        <div className="bg-white rounded-[1.5rem] p-8 shadow-duck-soft border border-duck-ink/10 w-full max-w-md relative z-10 animate-in zoom-in duration-300 motion-reduce:animate-none">
                            {feedbackSuccess ? (
                                <div className="flex flex-col items-center text-center py-8">
                                    <div className="w-24 h-24 bg-duck-acid border border-duck-ink rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500 motion-reduce:animate-none">
                                        <span className="text-5xl">✅</span>
                                    </div>
                                    <h3 className="font-display text-3xl text-duck-ink mb-3">Bedankt!</h3>
                                    <p className="text-duck-ink/65 text-sm mb-6">Je feedback is succesvol verzonden naar de ontwikkelaar.</p>
                                    <button
                                        onClick={() => {
                                            setShowFeedbackModal(false);
                                            setFeedbackSuccess(false);
                                        }}
                                        className="px-8 py-3 bg-duck-ink text-duck-acid rounded-full font-extrabold text-sm transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0 motion-reduce:transition-none"
                                    >
                                        Sluiten
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-duck-acid border border-duck-ink rounded-xl flex items-center justify-center">
                                            <MessageSquare size={24} className="text-duck-ink" />
                                        </div>
                                        <div>
                                            <h3 className="font-display text-2xl text-duck-ink">Feedback geven</h3>
                                            <p className="text-xs text-duck-ink/65">Wat kan er beter aan de website?</p>
                                        </div>
                                    </div>

                                    <textarea
                                        value={feedbackText}
                                        onChange={(e) => {
                                            setFeedbackText(e.target.value);
                                            if (feedbackError) setFeedbackError(null);
                                        }}
                                        placeholder="Beschrijf hier wat je graag verbeterd zou zien, of deel een bug die je hebt gevonden..."
                                        className="w-full h-32 p-4 bg-white border-2 border-duck-ink/15 rounded-xl text-sm font-semibold text-duck-ink resize-none outline-none focus:border-duck-ink placeholder:text-duck-ink/40"
                                        maxLength={500}
                                        disabled={feedbackSubmitting}
                                    />
                                    <div className="flex justify-between items-center mt-2 mb-4">
                                        <span className="text-[10px] text-duck-ink/65">{feedbackText.length}/500 tekens</span>
                                    </div>

                                    {feedbackError && (
                                        <div className="mb-4 p-3 bg-duck-error/10 border border-duck-error/30 rounded-xl text-duck-error text-sm flex items-start gap-2">
                                            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                                            <span>{feedbackError}</span>
                                        </div>
                                    )}

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setShowFeedbackModal(false)}
                                            disabled={feedbackSubmitting}
                                            className="flex-1 py-3 text-duck-ink/65 font-extrabold text-sm hover:bg-duck-bgLight hover:text-duck-ink rounded-full transition-colors disabled:opacity-50"
                                        >
                                            Annuleren
                                        </button>
                                        <button
                                            onClick={handleSubmitFeedback}
                                            disabled={!feedbackText.trim() || feedbackSubmitting}
                                            className="flex-1 py-3 border border-duck-ink bg-duck-acid text-duck-ink rounded-full font-extrabold text-sm flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-0.5 hover:bg-duck-ink hover:text-duck-acid disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:bg-duck-acid disabled:hover:text-duck-ink motion-reduce:transition-none"
                                        >
                                            {feedbackSubmitting ? (
                                                <Loader2 size={16} className="animate-spin motion-reduce:animate-none" />
                                            ) : (
                                                <>
                                                    <Send size={16} />
                                                    Versturen
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
                <div className="lg:h-dvh lg:overflow-hidden">
                    <div ref={dashboardScrollRef} className="min-w-0 lg:h-dvh lg:overflow-y-auto lg:overscroll-contain">
                {/* HEADER */}
                <header className="sticky top-0 z-50 flex items-center justify-between border-b border-duck-ink/10 bg-white/90 backdrop-blur-md px-4 py-3 sm:px-8 sm:py-5 lg:hidden">
                    <button
                        onClick={onGoHome}
                        aria-label="Ga naar de startpagina"
                        className="flex min-h-[44px] min-w-[44px] items-center gap-3 hover:opacity-80 transition-opacity text-left bg-transparent border-none p-1 cursor-pointer focus:outline-none"
                    >
                        <DuckMark className="size-9" />
                        <span className="text-[15px] font-extrabold tracking-tight text-duck-ink hidden sm:inline">DGSkills</span>
                    </button>

                    {/* FEEDBACK BUTTON */}
                    <button
                        onClick={() => setShowFeedbackModal(true)}
                        className="hidden sm:flex items-center gap-2 px-4 py-2 bg-duck-acid hover:bg-duck-ink hover:text-duck-acid text-duck-ink rounded-full border border-duck-ink transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 motion-reduce:transition-none"
                        aria-label="Geef feedback aan de ontwikkelaar"
                        data-tutorial="student-feedback-btn"
                    >
                        <MessageSquare size={16} />
                        <span className="text-xs font-extrabold">Feedback</span>
                    </button>

                    <div className="flex items-center gap-4">
                        {/* DAILY STREAK BADGE */}
                        {dailyStreak > 0 && (
                            <div className={`flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-extrabold
                                ${dailyStreak >= 7 ? 'bg-duck-ink text-duck-acid' :
                                  dailyStreak >= 3 ? 'bg-duck-acid text-duck-ink border border-duck-ink' :
                                  'bg-duck-bgLight text-duck-ink/65'}`}>
                                <span role="img" aria-label="streak">&#x1F525;</span>
                                <span>{dailyStreak}</span>
                                <span className="hidden sm:inline">{dailyStreak === 1 ? 'dag' : 'dagen'}</span>
                            </div>
                        )}

                        {/* COMPACT PROGRESS BAR IN HEADER */}
                        {stats && (
                            <button
                                onClick={() => setShowXPPopup(true)}
                                aria-label={`Level ${level}, ${xp} XP - Klik voor details`}
                                className="flex min-h-[44px] flex-col items-end justify-center gap-1.5 hover:opacity-80 transition-opacity p-2 rounded-2xl hover:bg-duck-bgLight border border-transparent hover:border-duck-ink/10 group"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-extrabold text-duck-ink/65 uppercase tracking-[0.16em] group-hover:text-duck-ink transition-colors">Lvl {level}</span>
                                    <div className="w-20 sm:w-32 h-2.5 bg-duck-ink/10 rounded-full overflow-hidden p-[1px]">
                                        <div
                                            className="h-full bg-duck-acid ring-1 ring-duck-ink/15 rounded-full transition-all duration-700 motion-reduce:transition-none"
                                            style={{ width: `${progressPercentage}%` }}
                                        />
                                    </div>
                                </div>
                            </button>
                        )}

                        <div className="flex items-center gap-4 relative">
                            <div className="text-right hidden sm:block">
                                <div className="text-[9px] text-duck-ink/65 font-extrabold uppercase tracking-[0.14em] leading-none">Mijn profiel</div>
                                <div className="font-extrabold text-duck-ink text-sm tracking-tight">{userDisplayName || 'Gast'}</div>
                            </div>
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                aria-label="Profiel menu openen"
                                aria-expanded={showProfileMenu}
                                aria-haspopup="true"
                                className="w-12 h-12 bg-duck-bgLight rounded-2xl border border-duck-ink/10 flex items-center justify-center text-duck-ink font-extrabold text-sm shadow-duck-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-duck-ink cursor-pointer overflow-hidden p-0"
                                data-tutorial="student-profile-btn"
                            >
                                {/* Show Avatar Headshot if available, otherwise fallback */}
                                <div className="w-full h-full">
                                    {isVisualCapture ? (
                                        <div className="flex size-full items-center justify-center bg-duck-bgLight text-duck-ink">
                                            {profileInitial}
                                        </div>
                                    ) : (
                                        <LazyAvatarViewer
                                            config={stats?.avatarConfig || DEFAULT_AVATAR_CONFIG}
                                            interactive={false}
                                            variant="head"
                                        />
                                    )}
                                </div>
                            </button>

                            {/* Profile Dropdown Menu */}
                            {showProfileMenu && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setShowProfileMenu(false)}
                                    />
                                    <div className="absolute right-0 sm:right-0 top-14 z-50 bg-white rounded-[1.5rem] shadow-duck-soft border border-duck-ink/10 overflow-hidden min-w-[200px] max-w-[calc(100vw-2rem)] animate-in fade-in slide-in-from-top-2 duration-200 motion-reduce:animate-none">
                                        <div className="p-3 border-b border-duck-ink/10 bg-duck-bgLight">
                                            <div className="font-extrabold text-duck-ink text-sm">{userDisplayName || 'Gast'}</div>
                                            <div className="text-[10px] text-duck-ink/65 font-semibold">Leerling-account</div>
                                        </div>
                                        <div className="p-2">
                                            <button
                                                onClick={() => {
                                                    setShowProfileMenu(false);
                                                    onOpenProfile();
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-3 min-h-[48px] rounded-xl text-left hover:bg-duck-bgLight transition-colors group"
                                                data-tutorial="student-avatar-btn"
                                            >
                                                <User size={18} className="text-duck-ink" />
                                                <span className="font-extrabold text-duck-ink/65 text-sm group-hover:text-duck-ink">Avatar aanpassen</span>
                                            </button>
                                            {/* Trofeeënhal Button */}
                                            <button
                                                onClick={() => {
                                                    setShowProfileMenu(false);
                                                    onOpenProfile('trophies');
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-3 min-h-[48px] rounded-xl text-left hover:bg-duck-bgLight transition-colors group"
                                            >
                                                <Trophy size={18} className="text-duck-ink" />
                                                <span className="font-extrabold text-duck-ink/65 text-sm group-hover:text-duck-ink">Trofeeënhal</span>
                                            </button>
                                            {/* Bibliotheek Button */}
                                            <button
                                                onClick={() => {
                                                    setShowProfileMenu(false);
                                                    setShowLibrary(true);
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-3 min-h-[48px] rounded-xl text-left hover:bg-duck-bgLight transition-colors group"
                                            >
                                                <BookOpen size={18} className="text-duck-ink" />
                                                <span className="font-extrabold text-duck-ink/65 text-sm group-hover:text-duck-ink">Bibliotheek</span>
                                            </button>
                                            {/* Games Button in Profile Menu */}
                                            <button
                                                onClick={() => {
                                                    if (gamesEnabled && onOpenGames) {
                                                        setShowProfileMenu(false);
                                                        onOpenGames();
                                                    }
                                                }}
                                                disabled={!gamesEnabled}
                                                className={`w-full flex items-center gap-3 px-4 py-3 min-h-[48px] rounded-xl text-left transition-colors group ${gamesEnabled
                                                    ? 'hover:bg-duck-bgLight cursor-pointer'
                                                    : 'opacity-50 cursor-not-allowed'
                                                    }`}
                                            >
                                                <Gamepad2 size={18} className="text-duck-ink" />
                                                <div className="flex flex-col">
                                                    <span className={`font-extrabold text-sm ${gamesEnabled ? 'text-duck-ink/65 group-hover:text-duck-ink' : 'text-duck-ink/65'}`}>Games</span>
                                                    {!gamesEnabled && (
                                                        <span className="text-[9px] text-duck-ink/65">Wacht op activatie van de docent</span>
                                                    )}
                                                </div>
                                            </button>

                                            {onLogout && (
                                                <button
                                                    onClick={() => {
                                                        setShowProfileMenu(false);
                                                        onLogout();
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-3 min-h-[48px] rounded-xl text-left hover:bg-duck-bgLight transition-colors group"
                                                >
                                                    <LogOut size={18} className="text-duck-ink" />
                                                    <span className="font-extrabold text-duck-ink/65 text-sm group-hover:text-duck-ink">Uitloggen</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* BODY */}
                <main
                    className="mx-auto w-full max-w-[1560px] px-4 pb-40 pt-5 sm:px-6 md:pb-10 lg:px-8 lg:pt-7"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {learningProgressControls}

                    {/* DEBUG: temporarily disabled to isolate crash */}
                    {/* <DashboardHero
                        userDisplayName={userDisplayName || 'Mila'}
                        dailyStreak={dailyStreak}
                        level={level}
                        progressPercentage={progressPercentage}
                        xpToNext={xpToNext}
                        featuredMission={featuredMission}
                        canOpenFeaturedMission={canOpenFeaturedMission}
                        allMissionsDone={completedCount === totalMissions && totalMissions > 0}
                        onSelectModule={onSelectModule}
                    /> */}

                    {/* <ProgressStrip
                        level={level}
                        progressPercentage={progressPercentage}
                        completedCount={completedCount}
                        totalMissions={totalMissions}
                        nulmetingResult={stats?.nulmetingResult}
                    /> */}

                    {reviewMissions.length > 0 && (
                        <section id="review-missions-container" className="mb-6" data-tutorial="student-review-missions">
                            <h2 className="mb-3 flex items-center gap-2 font-display text-xl text-balance text-duck-ink">
                                <RotateCcw size={18} className="text-duck-ink" /> Herhaling &amp; basics
                            </h2>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                                {reviewMissions.map((mission, index) => (
                                    <motion.div
                                        key={mission.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2, delay: index * 0.05 }}
                                    >
                                        <StudentProjectCard
                                            mission={mission}
                                            index={index}
                                            onSelectModule={onSelectModule}
                                            onLockedDemoMission={userUid === 'capture-student' ? () => onOpenProfile() : undefined}
                                            onInfoClick={handleInfoClick}
                                            isCompleted={stats?.missionsCompleted?.includes(mission.id) || (mission.id === 'ipad-print-instructies' && stats?.studentClass !== 'MH1A')}
                                            vsoProfile={stats?.vsoProfile}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    )}

                    <section
                        id="mission-grid-container"
                        className="relative mb-6 overflow-hidden rounded-[1.5rem] border border-duck-ink/10 bg-duck-bgLight p-4 shadow-duck-soft sm:p-6"
                        data-tutorial="student-main-missions"
                    >
                        <div className="mb-5">
                            <h2 className="font-display text-2xl leading-tight text-balance text-duck-ink md:text-3xl">Mijn projecten</h2>
                            <p className="mt-2 text-sm font-semibold text-pretty text-duck-ink/65">Echte DGSkills-missies met screenshots, badges en portfolio-bewijs.</p>
                        </div>

                        {projectMissions.length > 0 ? (
                            <>
                                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                                    {(showAllProjects ? projectMissions : projectMissions.slice(0, 3)).map((mission, index) => (
                                        <motion.div
                                            key={mission.id}
                                            initial={{ opacity: 0, y: 12 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.25, delay: index * 0.06 }}
                                            {...(index === 0 && allReviewsDone ? { 'data-tutorial': 'student-first-mission' } : {})}
                                        >
                                            <StudentProjectCard
                                                mission={mission}
                                                index={index}
                                                onSelectModule={onSelectModule}
                                                onLockedDemoMission={userUid === 'capture-student' ? () => onOpenProfile() : undefined}
                                                onInfoClick={handleInfoClick}
                                                isCompleted={stats?.missionsCompleted?.includes(mission.id)}
                                                vsoProfile={stats?.vsoProfile}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                                {projectMissions.length > 3 && (
                                    <div className="mt-5 flex justify-center">
                                        <button
                                            type="button"
                                            onClick={() => setShowAllProjects(prev => !prev)}
                                            aria-expanded={showAllProjects}
                                            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-duck-ink/20 bg-white px-5 text-sm font-extrabold text-duck-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-duck-ink motion-reduce:transition-none"
                                        >
                                            {showAllProjects
                                                ? <>Toon minder <ChevronUp size={16} /></>
                                                : <>Bekijk alle {projectMissions.length} projecten <ChevronDown size={16} /></>}
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-duck-ink/20 bg-white py-16 text-center">
                                <DuckMark className="mb-4 size-16" />
                                <p className="font-display text-xl text-duck-ink">Nieuwe missies worden voorbereid...</p>
                                <p className="mt-1 text-sm text-duck-ink/65">Je docent opent binnenkort nieuwe projecten.</p>
                            </div>
                        )}
                    </section>

                    {!isVisualCapture && userUid && (
                        <AdaptiveMissionSuggestions
                            userId={userUid}
                            yearGroup={currentYearGroup}
                            nulmetingResult={stats?.nulmetingResult}
                        />
                    )}

                    {/* INFO MODAL */}
                    {selectedMissionInfo && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <div
                                className="absolute inset-0 bg-duck-ink/40 backdrop-blur-[2px] transition-opacity"
                                onClick={() => setSelectedMissionInfo(null)}
                            />
                            <div className="bg-white rounded-[1.5rem] p-8 max-w-lg w-full relative z-10 shadow-duck-soft border border-duck-ink/10 animate-in zoom-in duration-200 motion-reduce:animate-none">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="p-3 bg-duck-acid border border-duck-ink text-duck-ink rounded-xl">
                                        <Info size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-display text-2xl text-duck-ink mb-2">Over deze missie</h3>
                                        <p className="text-duck-ink/65 leading-relaxed">
                                            {typeof selectedMissionInfo === 'string' ? selectedMissionInfo : (selectedMissionInfo as any)?.info}
                                        </p>
                                    </div>
                                </div>
                                {/* SLO Kerndoelen in info modal */}
                                {typeof selectedMissionInfo === 'object' && (selectedMissionInfo as any)?.kerndoelen?.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-duck-ink/10">
                                        <p className="text-[10px] font-extrabold text-duck-ink/65 uppercase tracking-[0.16em] mb-2">SLO Kerndoelen</p>
                                        <div className="space-y-1.5">
                                            {(selectedMissionInfo as any).kerndoelen.map((code: SloKerndoelCode) => {
                                                const kd = SLO_KERNDOELEN[code];
                                                if (!kd) return null;
                                                // DUCK-stijl: drie domein-categorieën via vlak-variant.
                                                // Acid nooit als tekst op licht; acid-tekst mag op ink.
                                                const modalClasses = kd.kleur === 'amber'
                                                    ? 'bg-duck-acid border-duck-ink text-duck-ink'
                                                    : kd.kleur === 'purple'
                                                        ? 'bg-duck-bgLight border-duck-ink text-duck-ink'
                                                        : 'bg-duck-ink border-duck-ink text-duck-acid';
                                                const isInk = kd.kleur === 'blue';
                                                return (
                                                    <div
                                                        key={code}
                                                        className={`flex items-start gap-2 rounded-lg border p-2 shadow-sm ${modalClasses}`}
                                                    >
                                                        <span className="mt-0.5 shrink-0 text-[10px] font-extrabold">{code}</span>
                                                        <div>
                                                            <span className="text-[11px] font-extrabold">{kd.label}</span>
                                                            <p className={`text-[10px] leading-tight ${isInk ? 'text-duck-acid/80' : 'text-duck-ink/70'}`}>{kd.omschrijving}</p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                                <div className="flex justify-end mt-6">
                                    <button
                                        onClick={() => setSelectedMissionInfo(null)}
                                        className="px-6 py-2.5 bg-duck-ink text-duck-acid rounded-full font-extrabold transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0 motion-reduce:transition-none"
                                    >
                                        Begrepen
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </main >
                    </div>
                </div>

                {/* BOTTOM NAVIGATION BAR (mobile only) */}
                <BottomNav
                    activeTab={bottomNavTab}
                    onNavigate={handleBottomNav}
                    gamesEnabled={gamesEnabled}
                />
        </div>
    );
};
