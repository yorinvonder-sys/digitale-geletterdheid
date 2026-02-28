
import React, { useState, useRef, useEffect, useMemo, lazy, Suspense, useCallback } from 'react';
import { AgentSelector } from './lab/AgentSelector';
import { ChatBubble } from './ChatBubble';
import { GamePreview } from './GamePreview';
import { BookPreview } from './BookPreview';
import { WordWizardPreview } from './WordWizardPreview';

import { TrainerPreview } from './TrainerPreview';
import { ChatbotTrainerPreview } from './ChatbotTrainerPreview';
import { DrawingGamePreview } from './DrawingGamePreview';
import { AiBeleidBrainstormPreview } from './AiBeleidBrainstormPreview';
import { MissionBriefing } from './MissionBriefing';
import { AgentRole, UserStats, AiLabProps } from '../types';
import { ROLES } from '../config/agents';
import { useAgentLogic } from '../hooks/useAgentLogic';
import { Loader2, ChevronRight, Trophy, ArrowLeft, Target, Lightbulb, Sparkles, RotateCcw, Send, AlertCircle, Gamepad2, Download, CheckCircle2, PenTool, Palette, BrainCircuit } from 'lucide-react';
import { WebPreviewModal } from './WebPreviewModal';
import { GamesSection } from './GamesSection';
import { getSharedProject, SharedProject } from '../services/missionService';
import { LEVEL_THRESHOLDS, getLevelProgress, getXPForNextLevel, getXPToNextLevel, getLevelFromXP } from '../utils/xp';
import { awardXP } from '../services/XPService';
import { logger } from '../utils/logger';
// KnowledgeRunner removed - using AssessmentEngine for all review missions
import { AssessmentEngine } from './assessment/AssessmentEngine';
import { getAssessment, hasAssessment } from './assessment/data/assessmentRegistry';
import { RotateDevicePrompt } from './RotateDevicePrompt';
import { logActivity, saveHybridAssessmentRecord } from '../services/teacherService';

// Periode 3 interactive mission components
import { DataDetectiveMission } from './missions/DataDetectiveMission';
import { DeepfakeDetectorMission } from './missions/DeepfakeDetectorMission';
import { FilterBubbleBreakerMission } from './missions/FilterBubbleBreakerMission';
import { DatalekkenRampenplanMission } from './missions/DatalekkenRampenplanMission';
import { DataVoorDataMission } from './missions/DataVoorDataMission';


// Filter lijst voor ongepast taalgebruik (Silent Blocking)
const FORBIDDEN_WORDS = [
  'kanker', 'tering', 'tyfus', 'hoer', 'slet', 'kut', 'fuck', 'shit',
  'bitch', 'sukkel', 'dombo', 'mongool', 'ezel', 'klootzak'
];

const CloudCleanerMission = lazy(() => import('./missions/review/CloudCleanerMission').then(module => ({ default: module.CloudCleanerMission })));
const WordSimulator = lazy(() => import('./WordSimulator/WordSimulator').then(module => ({ default: module.WordSimulator })));
const PitchPoliceMission = lazy(() => import('./missions/review/PitchPoliceMission').then(module => ({ default: module.PitchPoliceMission })));


const ConfettiExplosion = () => {
  const colors = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899'];
  const pieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    rotation: Math.random() * 360,
    isCircle: Math.random() > 0.5,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-[200]">
      {pieces.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          left: `${p.left}%`,
          top: '-10px',
          width: '10px',
          height: '10px',
          backgroundColor: p.color,
          borderRadius: p.isCircle ? '50%' : '2px',
          animation: `confetti-fall 2s ease-in ${p.delay}s forwards`,
          transform: `rotate(${p.rotation}deg)`,
        }} />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

const getXPReward = (difficulty: string): number => {
  switch (difficulty) {
    case 'Easy': return 50;
    case 'Medium': return 100;
    case 'Hard': return 150;
    default: return 75;
  }
};

export const AiLab: React.FC<AiLabProps> = ({ user, onExit, saveProgress, initialRole, libraryData, vsoProfile }) => {
  const [showXPPopup, setShowXPPopup] = useState(false);
  const [selectedRole, setSelectedRole] = useState<AgentRole | null>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [xpNotification, setXpNotification] = useState<{ amount: number, label: string } | null>(null);
  const [view, setView] = useState<'intro' | 'home' | 'tutorial' | 'lab' | 'games' | 'week1-review'>('intro');
  const [tutorialStep, setTutorialStep] = useState(0);
  const [missionStarted, setMissionStarted] = useState(false);

  // NEW: State for Web Preview
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // NEW: State for Reset Confirmation
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // NEW: Track when the game is reloading after an update
  const [isGameLoading, setIsGameLoading] = useState(false);

  // NEW: Goal Achievement Tracking
  const [goalAchieved, setGoalAchieved] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);

  // NEW: Shared Mission Data
  const [sharedData, setSharedData] = useState<any>(null);

  // Use persistent stats if available, otherwise default
  const [stats, setStats] = useState<UserStats>(user?.stats || {
    xp: 0,
    level: 1,
    missionsCompleted: [],
    inventory: []
  });

  const hasSavedSession = stats.xp > 0 || (stats.missionsCompleted?.length || 0) > 0;
  const TIP_COST = 15;

  // Memoize initialProgress to prevent re-init of agent logic when stats (XP) change
  // We only want to load progress when switching roles, not when gaining XP
  // PRIORITY: libraryData > sharedData > missionProgress
  const initialProgress = useMemo(() => {
    // If libraryData is provided (opening from library), use it
    if (libraryData) {
      return {
        data: {
          activeGameCode: libraryData.gameCode,
          activeBookData: libraryData.bookData
        },
        completedSteps: [],
        lastActive: new Date()
      };
    }
    // If sharedData exists (shared bot link), use it
    if (sharedData) {
      return { data: sharedData, completedSteps: [], lastActive: new Date() };
    }
    // Otherwise use saved mission progress
    return selectedRole && stats.missionProgress ? stats.missionProgress[selectedRole.id] : undefined;
  }, [selectedRole?.id, sharedData, libraryData]); // Intentionally omitting stats

  // --- USE MODULAR LOGIC HOOK ---
  const {
    messages,
    input,
    setInput,
    isLoading,
    thinkingStep,
    suggestions,
    handleSend,
    error,
    activeGameCode,
    activeBookData,
    activeLogicCode,
    activeTrainerData,
    activeBonusChallenges,
    unlockBonusChallenge,
    resetCurrentMission,
    completedSteps,
    setCompletedSteps,
    undoGameCode,
    canUndoGameCode,
  } = useAgentLogic({
    selectedRole,
    userIdentifier: user?.uid || '', // IMPORTANT: Must use Supabase UID, not identifier (student number)
    schoolId: user?.schoolId,
    initialProgress,
    skipLoading: !!sharedData || !!libraryData
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinkingStep]);

  // Deep linking logic
  useEffect(() => {
    if (initialRole) {
      const role = ROLES.find(r => r.id === initialRole);
      if (role) {
        setView('lab');
        setSelectedRole(role);
        setMissionStarted(true);
      }
    }
  }, [initialRole]);

  // Handle shared bot from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedBotId = params.get('shared_bot');

    if (sharedBotId) {
      // Shared project deep-link detected
      const loadShared = async () => {
        try {
          const project = await getSharedProject(sharedBotId);
          if (project) {

            if (project.type === 'chatbot') {
              setSharedData(project.data);
              const role = ROLES.find(r => r.id === 'chatbot-trainer');
              if (role) {
                setView('lab');
                setSelectedRole(role);
                setMissionStarted(true);
              }
            } else if (project.type === 'game') {
              // Map game code to expected structure
              setSharedData({ activeGameCode: project.data.code });
              const role = ROLES.find(r => r.id === 'game-programmeur');
              if (role) {
                setView('lab');
                setSelectedRole(role);
                setMissionStarted(true);
              }
            }
          }
        } catch (err) {
          console.error('Error loading shared project:', err);
        }
      };
      loadShared();
    }
  }, []);


  // Sync game loading state with active game code
  // Use useLayoutEffect to prevent flicker of "Success" state before "Loading" state kicks in
  React.useLayoutEffect(() => {
    if (activeGameCode && selectedRole?.id === 'game-programmeur') {
      setIsGameLoading(true);
    }
  }, [activeGameCode]);

  // Auto-complete mission when all steps are done
  useEffect(() => {
    if (!selectedRole?.steps || completedSteps.length === 0) return;

    const totalSteps = selectedRole.steps.length;
    const allStepsComplete = completedSteps.length >= totalSteps;

    // Check if mission not already completed
    const missionAlreadyComplete = (stats.missionsCompleted || []).includes(selectedRole.id);

    if (allStepsComplete && !missionAlreadyComplete) {
      // Award XP based on mission difficulty and mark mission complete
      const xpReward = getXPReward(selectedRole.difficulty);
      handleAwardXP(xpReward, `${selectedRole.title} Voltooid!`);

      // Trigger confetti celebration
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2500);

      setStats(prev => ({
        ...prev,
        missionsCompleted: [...new Set([...(prev.missionsCompleted || []), selectedRole.id])]
      }));

      // Log activity for teacher analytics/export (90-day retention).
      // This complements the mission_complete logging in App.tsx for non-AiLab missions.
      if (user && user.role === 'student') {
        logActivity({
          uid: user.uid,
          schoolId: user.schoolId,
          studentName: user.displayName || 'Naamloos',
          type: 'mission_complete',
          data: `Missie voltooid: ${selectedRole.id} (+${xpReward} XP)`,
          missionId: selectedRole.id
        });
      }

      // Save progress
      if (saveProgress) {
        saveProgress({
          ...stats,
          missionsCompleted: [...new Set([...(stats.missionsCompleted || []), selectedRole.id])]
        });
      }
    }
  }, [completedSteps, selectedRole, stats.missionsCompleted]);

  // Goal Achievement Detection
  useEffect(() => {
    if (!selectedRole?.goalCriteria || goalAchieved) return;

    const { type, min = 3 } = selectedRole.goalCriteria;
    let achieved = false;

    if (type === 'message-count') {
      // Count user messages (excluding system/welcome)
      const userMessageCount = messages.filter(m => m.role === 'user').length;
      achieved = userMessageCount >= min;
    } else if (type === 'steps-complete') {
      achieved = completedSteps.length >= min;
    }
    // Add more criteria types as needed

    if (achieved && !goalAchieved) {
      setGoalAchieved(true);
      setShowGoalModal(true);
      handleAwardXP(50, 'Doel Behaald!');
    }
  }, [messages, completedSteps, selectedRole, goalAchieved]);

  // Reset goalAchieved when switching missions
  useEffect(() => {
    setGoalAchieved(false);
    setShowGoalModal(false);
  }, [selectedRole?.id]);

  // AUTO-SAVE MISSION PROGRESS (Steps, Data, Chat)
  useEffect(() => {
    if (!selectedRole || !saveProgress) return;

    // Debounce save to prevent database write spam
    const timer = setTimeout(() => {
      // 1. Summarize Chat (Last 10 messages)
      const chatSummary = messages.slice(-10).map(m => ({
        role: m.role,
        text: m.text.substring(0, 500) // Truncate long messages
      }));

      // 2. Gather Mission Data
      const missionData: any = {};
      if (activeGameCode) missionData.activeGameCode = activeGameCode;
      if (activeBookData.pages.length > 0) missionData.activeBookData = activeBookData;
      if (activeLogicCode) missionData.activeLogicCode = activeLogicCode;
      if (activeTrainerData.classAItems.length > 0) missionData.activeTrainerData = activeTrainerData;
      if (activeBonusChallenges.length > 0) missionData.activeBonusChallenges = activeBonusChallenges;

      // 3. Construct Progress Object
      // NOTE: chatHistory is intentionally NOT saved (data minimization per GDPR)
      const progressUpdate = {
        completedSteps,
        lastActive: new Date(), // This will be serialized to ISO string
        data: missionData
        // chatHistory removed for privacy - session only
      };

      // 4. Update Stats
      // Only save if meaningful data exists
      if (messages.length > 0 || completedSteps.length > 0) {
        /* console.log('[AutoSave] Saving progress for', selectedRole.id); */
        setStats(prev => {
          const newStats = {
            ...prev,
            missionProgress: {
              ...(prev.missionProgress || {}),
              [selectedRole.id]: progressUpdate
            }
          };
          saveProgress(newStats); // Persist to DB
          return newStats;
        });
      }
    }, 2000); // 2s debounce

    return () => clearTimeout(timer);
  }, [
    selectedRole,
    completedSteps,
    activeGameCode,
    activeBookData,
    activeLogicCode,
    activeTrainerData,
    messages, // This changes often, hence debounce
    activeBonusChallenges
  ]);

  /* 
    ---------------------------------------------------------------------------
    USER ACTIONS: XP & LEVELING
    ---------------------------------------------------------------------------
  */
  /* 
    ---------------------------------------------------------------------------
    USER ACTIONS: XP & LEVELING
    ---------------------------------------------------------------------------
  */
  const handleAwardXP = async (amount: number, label: string) => {
    if (!user?.uid) return;

    // Call secure server-side RPC
    const result = await awardXP(user.uid, amount, label);

    if (!result.awarded) {
      console.warn(`[XP Blocked] ${result.reason}`);
      setXpNotification({ amount: 0, label: result.reason || 'XP geblokkeerd' });
      setTimeout(() => setXpNotification(null), 4000);
      return;
    }

    // Success! Update local state to match server state
    const newXP = result.newXP ?? stats.xp;
    const newLevel = result.newLevel ?? stats.level;

    setXpNotification({ amount, label });
    setTimeout(() => setXpNotification(null), 3000);

    setStats(prev => {
      if (newLevel > prev.level) {
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 4000);
      }

      const newStats = { ...prev, xp: newXP, level: newLevel };

      if (saveProgress) {
        saveProgress(newStats);
      }

      return newStats;
    });
  };

  /* 
    ---------------------------------------------------------------------------
    NAVIGATION HANDLERS
    ---------------------------------------------------------------------------
  */
  // Handle Intro Timer safely
  useEffect(() => {
    if (view === 'intro') {
      const timer = setTimeout(() => {
        setView('home');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [view]);

  /* 
    ---------------------------------------------------------------------------
    NAVIGATION HANDLERS
    ---------------------------------------------------------------------------
  */

  const handleEnterLab = () => {
    // Direct access to the Lab (Mission Control)
    setView('lab');
  };

  const handleContinueSession = () => {
    setView('lab');
  };

  const handleNextTutorial = () => {
    if (tutorialStep < ROLES.length - 1) {
      setTutorialStep(prev => prev + 1);
    } else {
      setView('lab');
    }
  };

  const handleRoleSelect = (role: AgentRole) => {
    setSelectedRole(role);
    setMissionStarted(false); // Reset to briefing
  };

  const handleBackToOverview = () => {
    // If entered via deep link (Dashboard), exit back to Dashboard
    if (initialRole && onExit) {
      onExit();
      return;
    }

    setSelectedRole(null);
    setMissionStarted(false);
  };

  // Save mission-specific data (for full-screen games)
  const handleMissionDataSave = useCallback((data: any) => {
    if (!selectedRole || !saveProgress) return;

    setStats(prev => {
      const roleId = selectedRole.id;
      const currentMissionProgress = prev.missionProgress?.[roleId];

      const newMissionProgress = {
        ...(currentMissionProgress || {}),
        completedSteps: currentMissionProgress?.completedSteps || [],
        lastActive: new Date(),
        data: data
      };

      const newStats = {
        ...prev,
        missionProgress: {
          ...(prev.missionProgress || {}),
          [roleId]: newMissionProgress
        }
      };

      saveProgress(newStats);
      return newStats;
    });
  }, [selectedRole, saveProgress]);

  const handleMissionStart = () => {
    setMissionStarted(true);
  };




  // Track used tips to detect copying
  const [usedTips, setUsedTips] = useState<string[]>([]);
  const [tipToConfirm, setTipToConfirm] = useState<string | null>(null);

  const handleSuggestionClick = (suggestion: string) => {
    setTipToConfirm(suggestion);
  };

  const confirmTipPurchase = () => {
    if (tipToConfirm) {
      if (stats.xp >= TIP_COST) {
        handleAwardXP(-TIP_COST, "Tip Gebruikt");
        setUsedTips(prev => [...prev, tipToConfirm.toLowerCase()]);
        handleSend(tipToConfirm);
      } else {
        setXpNotification({ amount: 0, label: "Niet genoeg XP!" });
        setTimeout(() => setXpNotification(null), 2000);
      }
      setTipToConfirm(null);
    }
  };

  // Check if user input is similar to a tip (to detect copying)
  const checkForTipCopy = (userInput: string) => {
    const normalizedInput = userInput.toLowerCase().trim();
    for (const tip of suggestions) {
      const normalizedTip = tip.toLowerCase().trim();
      // Check if input is very similar (>70% match) or starts with the tip
      if (normalizedInput.includes(normalizedTip.slice(0, 15)) ||
        normalizedTip.includes(normalizedInput.slice(0, 15))) {
        // Only charge if this tip wasn't already bought
        if (!usedTips.includes(normalizedTip) && stats.xp >= TIP_COST) {
          handleAwardXP(-TIP_COST, "Tip Gekopieerd");
          setUsedTips(prev => [...prev, normalizedTip]);
          return true;
        }
      }
    }
    return false;
  };

  // Wrap handleSend to check for tip copying AND award XP for engagement
  const handleSendWithTipCheck = (text?: string) => {
    const inputText = text || input;
    if (inputText && !text) {
      // Only check when user types manually (not from suggestion click)
      checkForTipCopy(inputText);
    }

    // Award XP for each meaningful interaction (5-10 XP based on message length)
    // This ensures students earn ~300-400 XP in 90 min (~40-60 interactions)
    if (inputText && inputText.trim().length > 0) {
      const xpAmount = inputText.length > 20 ? 10 : 5;
      // Award XP for each meaningful interaction (5-10 XP based on message length)
      // This ensures students earn ~300-400 XP in 90 min (~40-60 interactions)
      if (inputText && inputText.trim().length > 0) {
        const xpAmount = inputText.length > 20 ? 10 : 5;
        handleAwardXP(xpAmount, "Bericht Verstuurd");
      }

      handleSend(text);
    }
  };


  /* 
    ---------------------------------------------------------------------------
    RENDER
    ---------------------------------------------------------------------------
  */
  const showRightPanel = !!selectedRole;

  if (view === 'intro') {

    return (
      <div className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center p-6 text-center z-50 pt-safe pb-safe pl-safe pr-safe" role="status" aria-live="polite">
        <Loader2 size={48} className="animate-spin text-lab-primary mb-4" aria-hidden="true" />
        <h1 className="text-xl font-mono text-lab-primary animate-pulse tracking-widest uppercase">AI Lab Opstarten...</h1>
      </div>
    );
  }

  if (view === 'home') {
    return (
      <div className="flex-1 w-full flex flex-col justify-center items-center p-6 relative overflow-hidden pt-safe pb-safe pl-safe pr-safe bg-slate-50/50">
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none"></div>

        <div className="glass-panel p-8 md:p-16 rounded-[3rem] shadow-2xl max-w-4xl w-full text-center relative z-10 border border-white mx-auto">
          <h1 className="text-4xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Future <span className="text-transparent bg-clip-text bg-gradient-to-r from-lab-primary to-lab-accent">Architect</span>
          </h1>
          <p className="text-lg text-slate-500 mb-10 max-w-xl mx-auto font-medium">Bouw je eigen toekomst met behulp van AI.</p>

          <div className="flex flex-col gap-4">
            <button onClick={handleEnterLab} className="group px-10 py-5 bg-slate-900 text-white text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center gap-3 mx-auto active:scale-95 cursor-pointer">
              Betreed het Lab <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </button>

            {hasSavedSession && (
              <button onClick={handleContinueSession} className="px-8 py-3 bg-white text-slate-700 text-base font-bold rounded-xl shadow-md hover:bg-slate-50 border border-slate-200 transition-all flex items-center gap-2 mx-auto active:scale-95">
                <RotateCcw size={16} /> Verdergaan met vorige missie
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Simplified Tutorial View
  if (view === 'tutorial') {
    const showcaseRole = ROLES[tutorialStep];
    const isLastStep = tutorialStep === ROLES.length - 1;

    return (
      <div className="fixed inset-0 flex flex-col justify-center items-center p-6 relative overflow-hidden pt-safe pb-safe pl-safe pr-safe">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-40"></div>
        <div className="max-w-xl w-full animate-in fade-in zoom-in-95 duration-500 z-10">
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-8 md:p-12 text-center overflow-hidden relative">
            <h2 className="text-3xl font-black text-slate-900 mb-1 tracking-tight">Dit ga jij bouwen!</h2>
            <h3 className="text-2xl font-bold text-lab-primary mb-4">{showcaseRole.title}</h3>
            <p className="text-slate-500 font-medium mb-8">{showcaseRole.description}</p>
            <div className="w-64 h-64 mx-auto mb-8 rounded-[2rem] overflow-hidden shadow-xl border-4 border-slate-100 transform transition-transform hover:scale-105 duration-300 relative group">
              {showcaseRole.visualPreview}
              <div className="absolute bottom-0 left-0 w-full bg-slate-900/80 backdrop-blur p-3 text-white">
                <div className="flex items-center justify-center gap-2 font-bold">
                  {showcaseRole.icon} {showcaseRole.title}
                </div>
              </div>
            </div>
            {!selectedRole && (
              <div className="flex justify-center gap-2 mb-8">
                {ROLES.map((_, i) => (
                  <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === tutorialStep ? 'w-8 bg-lab-primary' : 'w-2 bg-slate-200'}`} />
                ))}
              </div>
            )}
            <button onClick={handleNextTutorial} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group active:scale-95">
              {selectedRole ? 'Naar de Missie' : (isLastStep ? 'Start het Avontuur' : 'Volgend Project')}
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progressPercentage = getLevelProgress(stats.xp, stats.level);
  const xpToNext = (LEVEL_THRESHOLDS[stats.level + 1] || LEVEL_THRESHOLDS[stats.level] + 1000) - stats.xp;

  return (
    <div className="fixed inset-0 overflow-hidden flex flex-col items-center pt-safe pb-safe pl-safe pr-safe">

      {/* NEW: Web Preview Modal */}
      {previewUrl && (
        <WebPreviewModal
          url={previewUrl}
          onClose={() => setPreviewUrl(null)}
        />
      )}

      {/* XP POPUP OVERLAY */}
      {showXPPopup && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setShowXPPopup(false)}
          />
          <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 w-full max-w-sm relative z-10 animate-in zoom-in duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 w-20 h-20 rounded-3xl flex items-center justify-center text-white shadow-xl mb-6 transform rotate-3">
                <Trophy size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-1 uppercase tracking-tight">Level {stats.level}</h3>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-6">Jouw Voortgang</p>

              <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden mb-4 p-1 border border-slate-200">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(79,70,229,0.4)]"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              <div className="flex justify-between w-full text-sm font-black text-slate-800 mb-8 lowercase">
                <span>{stats.xp} xp</span>
                <span className="text-slate-400">nog {xpToNext} xp voor lvl {stats.level + 1}</span>
              </div>

              <button
                onClick={() => setShowXPPopup(false)}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-lg"
              >
                Begrepen!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Goal Achievement Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowGoalModal(false)}
          />
          <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border-4 border-emerald-200 w-full max-w-md relative z-10 animate-in zoom-in duration-300">
            <div className="flex flex-col items-center text-center">
              {/* Confetti Effect */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-5xl animate-bounce">🎉</div>

              <div className="bg-gradient-to-br from-emerald-400 to-teal-500 w-24 h-24 rounded-3xl flex items-center justify-center text-white shadow-xl mb-6 transform -rotate-3">
                <CheckCircle2 size={48} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-2">Doel Behaald!</h3>
              <p className="text-slate-500 font-medium mb-2">
                Je hebt het hoofddoel van deze missie voltooid.
              </p>
              <p className="text-emerald-600 font-bold text-lg mb-6">+50 XP verdiend!</p>

              <div className="w-full space-y-3">
                <button
                  onClick={() => setShowGoalModal(false)}
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Sparkles size={20} /> Verder Experimenteren
                </button>
                <button
                  onClick={() => {
                    setShowGoalModal(false);
                    if (onExit) onExit();
                  }}
                  className="w-full py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-95"
                >
                  Afsluiten naar Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rotate Device Prompt - Show when mission started on tablet in portrait */}
      {missionStarted && <RotateDevicePrompt />}

      {showConfetti && <ConfettiExplosion />}

      {showLevelUp && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-bounce">
          <div className="bg-lab-primary text-white px-8 py-3 rounded-full shadow-2xl border-4 border-white font-bold flex items-center gap-3">
            <Trophy className="text-yellow-300" /> LEVEL {stats.level} BEREIKT!
          </div>
        </div>
      )}

      {xpNotification && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[90] animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className={`backdrop-blur text-white px-4 py-2 rounded-xl shadow-xl flex items-center gap-3 border border-slate-700 ${xpNotification.amount < 0 ? 'bg-red-900/90' : 'bg-slate-900/90'}`}>
            <span className={`font-black text-lg ${xpNotification.amount < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
              {xpNotification.amount > 0 ? '+' : ''}{xpNotification.amount} XP
            </span>
            <span className="text-slate-300 text-sm font-medium border-l border-slate-600 pl-3">{xpNotification.label}</span>
          </div>
        </div>
      )}

      <nav className="w-full max-w-7xl flex justify-between items-center px-2 h-12 md:h-14 shrink-0 print:hidden">
        <button
          onClick={() => {
            // Always go back to the week dashboard (ProjectZeroDashboard)
            if (onExit) onExit();
          }}
          className="flex items-center gap-3 bg-transparent border-none p-0 focus:outline-none cursor-pointer hover:opacity-80 transition-opacity"
          title="Terug naar Dashboard"
        >
          <div className="w-8 h-8 md:w-10 md:h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-white transform rotate-3 overflow-hidden shadow-sm">
            <img src="/logo.svg" alt="Logo" className="w-full h-full object-contain p-1" />
          </div>
          <div className="flex flex-col text-left">
            {/* Breadcrumb: Dashboard > AI Lab > missienaam */}
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">
              <span>Dashboard</span>
              <ChevronRight size={10} className="opacity-60" />
              <span className="text-lab-primary">AI Lab</span>
              {selectedRole && (
                <>
                  <ChevronRight size={10} className="opacity-60" />
                  <span className="text-slate-600 truncate max-w-[120px] sm:max-w-[180px]">{selectedRole.title}</span>
                </>
              )}
            </div>
            <span className="text-sm font-black text-slate-800 leading-none mt-0.5">
              {selectedRole ? selectedRole.title : 'Mission Control'}
            </span>
          </div>
          {/* Step Progress Dots */}
          {selectedRole?.steps && selectedRole.steps.length > 0 && (
            <div className="flex items-center gap-1.5 ml-3 bg-slate-50 px-2.5 py-1.5 rounded-full border border-slate-100">
              {selectedRole.steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${completedSteps.includes(idx)
                    ? 'bg-emerald-500 shadow-sm shadow-emerald-200'
                    : 'bg-slate-200'
                    }`}
                  title={completedSteps.includes(idx) ? `Stap ${idx + 1} ✓` : `Stap ${idx + 1}`}
                />
              ))}
              <span className="text-[9px] font-bold text-slate-400 ml-1">{completedSteps.length}/{selectedRole.steps.length}</span>
            </div>
          )}
        </button>

        <div className="flex-1 max-w-xs mx-4 hidden sm:block">
          <button
            onClick={() => setShowXPPopup(true)}
            className="w-full flex flex-col items-end gap-1.5 hover:opacity-80 transition-opacity p-2 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 group"
          >
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-indigo-600 transition-colors">Lvl {stats.level}</span>
              <div className="w-32 h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200 p-[1px]">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(79,70,229,0.3)]"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </button>
        </div>

        {selectedRole && (
          <button onClick={() => onExit && onExit()} className="p-3 bg-white text-slate-500 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2 font-bold hover:text-slate-800 transition-colors active:scale-95 touch-friendly-btn min-h-[44px]">
            <ArrowLeft size={22} /> <span className="hidden sm:inline">Dashboard</span>
          </button>
        )}

        {/* Games Button - Always visible in nav */}
        {!selectedRole && (
          <button
            onClick={() => setView('games')}
            className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl shadow-lg flex items-center gap-2 font-bold hover:shadow-xl transition-all active:scale-95"
          >
            <Gamepad2 size={20} />
            <span className="hidden sm:inline">Games</span>
          </button>
        )}
      </nav>

      <main className="w-full max-w-7xl flex-1 flex flex-col min-h-0 overflow-hidden relative pb-2 px-2 md:px-4">
        {/* Games Section */}
        {/* Games Section */}
        {view === 'games' && (
          <div className="flex-1 overflow-hidden rounded-3xl">
            <GamesSection
              userRole={user?.role || 'student'}
              avatarConfig={stats.avatarConfig}
              onXPEarned={(amount, label) => handleAwardXP(amount, label)}
              onBack={() => setView('lab')}
              userId={user?.uid}
              userClass={user?.studentClass}
            />
          </div>
        )}

        {view !== 'games' && !selectedRole && (
          // Use New AgentSelector Component
          <AgentSelector roles={ROLES} onSelect={handleRoleSelect} />
        )}

        {selectedRole && !missionStarted && (
          <div className="flex-1 overflow-y-auto pb-10">
            <MissionBriefing role={selectedRole} onStart={handleMissionStart} onBack={handleBackToOverview} />
          </div>
        )}

        {selectedRole && missionStarted && (
          (hasAssessment(selectedRole.id) || selectedRole.id === 'ai-tekengame' || selectedRole.id === 'chatbot-trainer' || selectedRole.id === 'ai-beleid-brainstorm' || selectedRole.id === 'data-detective' || selectedRole.id === 'deepfake-detector' || selectedRole.id === 'filter-bubble-breaker' || selectedRole.id === 'datalekken-rampenplan' || selectedRole.id === 'data-voor-data') ? (
            // Full Screen Game Mode fo Review Missions & Tekengame & Chatbot Trainer
            <div className="flex-1 w-full h-full min-h-0 relative animate-in zoom-in-95 duration-500 rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-900 bg-slate-900">
              {selectedRole.id === 'chatbot-trainer' ? (
                <ChatbotTrainerPreview
                  onLevelComplete={(level) => handleAwardXP(100, `Chatbot Level ${level} Voltooid`)}
                  initialState={stats.missionProgress?.['chatbot-trainer']?.data}
                  sharedState={sharedData}
                  onSave={handleMissionDataSave}
                />
              ) : selectedRole.id === 'ai-tekengame' ? (
                <DrawingGamePreview
                  onLevelComplete={(level) => handleAwardXP(100, 'AI Tekengame Voltooid')}
                  onXPEarned={(amount, label) => handleAwardXP(amount, label)}
                  user={user ? {
                    uid: user.uid,
                    displayName: user.displayName || 'Student',
                    studentClass: user.studentClass
                  } : undefined}
                  initialState={stats.missionProgress?.['ai-tekengame']?.data}
                  onSave={handleMissionDataSave}
                />
              ) : selectedRole.id === 'ai-beleid-brainstorm' ? (
                <AiBeleidBrainstormPreview
                  user={user ? {
                    uid: user.uid,
                    displayName: user.displayName,
                    studentClass: user.studentClass,
                    schoolId: user.schoolId
                  } : undefined}
                  onComplete={() => {
                    handleAwardXP(75, 'AI Beleid Brainstorm Voltooid');
                    setStats(prev => ({
                      ...prev,
                      missionsCompleted: [...new Set([...(prev.missionsCompleted || []), 'ai-beleid-brainstorm'])]
                    }));
                    handleBackToOverview();
                  }}
                />
              ) : selectedRole.id === 'data-detective' ? (
                <DataDetectiveMission
                  onBack={handleBackToOverview}
                  onComplete={(passed) => {
                    if (passed) {
                      handleAwardXP(100, 'Data Detective Voltooid!');
                      setStats(prev => ({
                        ...prev,
                        missionsCompleted: [...new Set([...(prev.missionsCompleted || []), 'data-detective'])]
                      }));
                    }
                    handleBackToOverview();
                  }}
                  stats={stats}
                  vsoProfile={vsoProfile}
                />
              ) : selectedRole.id === 'deepfake-detector' ? (
                <DeepfakeDetectorMission
                  onBack={handleBackToOverview}
                  onComplete={(passed) => {
                    if (passed) {
                      handleAwardXP(100, 'Deepfake Detector Voltooid!');
                      setStats(prev => ({
                        ...prev,
                        missionsCompleted: [...new Set([...(prev.missionsCompleted || []), 'deepfake-detector'])]
                      }));
                    }
                    handleBackToOverview();
                  }}
                  stats={stats}
                  vsoProfile={vsoProfile}
                />
              ) : selectedRole.id === 'filter-bubble-breaker' ? (
                <FilterBubbleBreakerMission
                  onBack={handleBackToOverview}
                  onComplete={(passed) => {
                    if (passed) {
                      handleAwardXP(100, 'Filter Bubble Breaker Voltooid!');
                      setStats(prev => ({
                        ...prev,
                        missionsCompleted: [...new Set([...(prev.missionsCompleted || []), 'filter-bubble-breaker'])]
                      }));
                    }
                    handleBackToOverview();
                  }}
                  stats={stats}
                />
              ) : selectedRole.id === 'datalekken-rampenplan' ? (
                <DatalekkenRampenplanMission
                  onBack={handleBackToOverview}
                  onComplete={(passed) => {
                    if (passed) {
                      handleAwardXP(100, 'Datalekken Rampenplan Voltooid!');
                      setStats(prev => ({
                        ...prev,
                        missionsCompleted: [...new Set([...(prev.missionsCompleted || []), 'datalekken-rampenplan'])]
                      }));
                    }
                    handleBackToOverview();
                  }}
                  stats={stats}
                />
              ) : selectedRole.id === 'data-voor-data' ? (
                <DataVoorDataMission
                  onBack={handleBackToOverview}
                  onComplete={(passed) => {
                    if (passed) {
                      handleAwardXP(100, 'Data voor Data Voltooid!');
                      setStats(prev => ({
                        ...prev,
                        missionsCompleted: [...new Set([...(prev.missionsCompleted || []), 'data-voor-data'])]
                      }));
                    }
                    handleBackToOverview();
                  }}
                  stats={stats}
                />
              ) : (() => {
                // Dynamic assessment lookup via registry
                const assessmentData = getAssessment(selectedRole.id);
                if (!assessmentData) return null;
                return (
                  <AssessmentEngine
                    config={assessmentData.config}
                    tasks={assessmentData.tasks}
                    onSubmitResult={async (result) => {
                      if (!user?.uid) return;
                      await saveHybridAssessmentRecord({
                        uid: user.uid,
                        schoolId: user.schoolId,
                        studentName: user.displayName || 'Naamloos',
                        studentClass: user.studentClass,
                        missionId: selectedRole.id,
                        autoScore: result.autoScore,
                        teacherScore: result.teacherScore,
                        finalScore: result.finalScore,
                        passed: result.passed,
                        teacherChecks: result.teacherChecks,
                        weights: result.weights || { autoWeight: 0.6, teacherWeight: 0.4 }
                      });
                    }}
                    onComplete={(passed, score) => {
                      if (passed) {
                        setStats(prev => ({
                          ...prev,
                          missionsCompleted: [...new Set([...(prev.missionsCompleted || []), selectedRole.id])]
                        }));
                        handleAwardXP(150, `${assessmentData.config.title || 'Praktijk'} Review`);
                      }
                    }}
                    onExit={handleBackToOverview}
                    initialState={stats.missionProgress?.[selectedRole.id]?.data}
                    onSave={handleMissionDataSave}
                  />
                );
              })()}
            </div>
          ) : (
            // Standard Split View for other missions
            <div className={`flex-1 flex flex-col ${showRightPanel ? 'md:flex-row ipad-stack' : ''} gap-3 h-full min-h-0 pb-1 animate-in fade-in slide-in-from-right-4 duration-500`}>

              {/* Chat Column */}
              <section className={`chat-column flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-0 h-full max-h-full ${showRightPanel ? 'w-full md:w-[40%]' : 'w-full flex-1'} print:hidden`}>
                {/* Goal Banner - Show primaryGoal prominently */}
                <div className={`px-4 py-3 backdrop-blur border-b flex items-center gap-3 shrink-0 transition-all ${goalAchieved ? 'bg-emerald-50/90 border-emerald-200' : 'bg-slate-50/80 border-slate-100'}`}>
                  <div className={`p-2 rounded-lg ${goalAchieved ? 'bg-emerald-500 text-white' : 'bg-indigo-100 text-lab-primary'}`}>
                    {goalAchieved ? <CheckCircle2 size={16} /> : <Target size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-[10px] font-bold uppercase tracking-wider ${goalAchieved ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {goalAchieved ? '✅ Doel Behaald!' : 'Jouw Doel'}
                    </h4>
                    <p className={`text-sm font-bold leading-tight line-clamp-2 ${goalAchieved ? 'text-emerald-700' : 'text-slate-800'}`}>
                      {selectedRole.primaryGoal || selectedRole.missionObjective}
                    </p>
                  </div>

                  {/* Reset Button - iPad touch optimized */}
                  <button
                    onClick={() => setShowResetConfirm(true)}
                    aria-label="Missie resetten"
                    className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors touch-friendly-btn"
                  >
                    <RotateCcw size={18} aria-hidden="true" />
                  </button>
                </div>

                {/* Bonus Challenges Display */}
                {activeBonusChallenges.length > 0 && (
                  <div className="px-4 py-2 bg-amber-50/50 border-b border-amber-100 flex flex-col gap-1 animate-in slide-in-from-top-2">
                    <h4 className="text-[10px] font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1">
                      <Trophy size={10} /> Bonus Missies
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {activeBonusChallenges.map(c => (
                        <span key={c.id} className="text-[10px] font-bold text-amber-800 bg-white/80 px-2 py-0.5 rounded border border-amber-200 shadow-sm flex items-center gap-1">
                          {c.title} <span className="text-amber-500">+{c.xpReward}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4 min-h-0">
                  {/* MODIFIED: Pass setPreviewUrl to handling clicks + isLatest prop */}
                  {messages.map((m, i) => (
                    <ChatBubble
                      key={i}
                      message={m}
                      onLinkClick={setPreviewUrl}
                      isLatest={i === messages.length - 1}
                      isBusy={isLoading || isGameLoading}
                    />
                  ))}

                  {isLoading && (
                    <div className="flex justify-start animate-in slide-in-from-left-4" role="status" aria-live="polite">
                      <div className="bg-slate-50 px-5 py-4 rounded-3xl rounded-bl-none border border-slate-100 flex items-center gap-4 shadow-sm min-w-[200px]">
                        <div className="relative">
                          {/* Dynamic Icon based on step */}
                          {thinkingStep.includes("schrijven") ? (
                            <PenTool className="text-indigo-500" size={24} aria-hidden="true" />
                          ) : thinkingStep.includes("Illustratie") ? (
                            <Palette className="animate-pulse text-pink-500" size={24} aria-hidden="true" />
                          ) : thinkingStep.includes("Magie") ? (
                            <Sparkles className="animate-spin text-amber-500" size={24} aria-hidden="true" />
                          ) : thinkingStep.includes("Analyseren") ? (
                            <BrainCircuit className="animate-pulse text-cyan-500" size={24} aria-hidden="true" />
                          ) : (
                            <Loader2 className="animate-spin text-lab-primary" size={24} aria-hidden="true" />
                          )}

                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-2 h-2 bg-white/0 rounded-full"></div>
                          </div>
                        </div>
                        <div className="text-left flex flex-col">
                          <span className="text-sm font-bold text-slate-700 animate-pulse">
                            {thinkingStep}
                          </span>
                          <div className="flex gap-1 mt-1">
                            {/* Progress Bars - Logic fixed for both Story and Coding modes */}
                            <div className={`h-1 w-4 rounded-full transition-colors duration-500 ${true // Always active (Start)
                              ? 'bg-lab-primary' : 'bg-slate-200'
                              }`}></div>

                            <div className={`h-1 w-4 rounded-full transition-colors duration-500 ${thinkingStep.includes("Redeneren") ||
                              thinkingStep.includes("schrijven") ||
                              thinkingStep.includes("Genereren") ||
                              thinkingStep.includes("Illustratie") ||
                              thinkingStep.includes("Magie")
                              ? 'bg-lab-primary' : 'bg-slate-200'
                              }`}></div>

                            <div className={`h-1 w-4 rounded-full transition-colors duration-500 ${thinkingStep.includes("Genereren") ||
                              thinkingStep.includes("Illustratie") ||
                              thinkingStep.includes("Magie")
                              ? 'bg-lab-primary' : 'bg-slate-200'
                              }`}></div>

                            {/* Extra bar for "Magic" step in Story Mode */}
                            {(thinkingStep.includes("Illustratie") || thinkingStep.includes("Magie")) && (
                              <div className={`h-1 w-4 rounded-full transition-colors duration-500 ${thinkingStep.includes("Magie")
                                ? 'bg-amber-400' : 'bg-slate-200'
                                }`}></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-3 border-t border-slate-100 relative keyboard-safe">
                  {error && (
                    <div className="mb-3 px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-center gap-2 animate-in fade-in">
                      <AlertCircle size={16} /> <span className="font-bold">{error}</span>
                    </div>
                  )}
                  {selectedRole.id === 'game-programmeur' && !input && messages.length < 3 && (
                    <div className="absolute -top-12 left-6 animate-pulse hidden md:block">
                      <div className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-2 rounded-xl rounded-bl-none border border-emerald-200 shadow-sm flex items-center gap-2">
                        <Sparkles size={12} className="text-emerald-600" />
                        Typ hieronder om de code te veranderen!
                      </div>
                    </div>
                  )}
                  {suggestions.length > 0 && !isLoading && (
                    <div className="flex flex-wrap gap-2 mb-3 animate-in slide-in-from-bottom-2">
                      <div className="flex items-center gap-1 text-xs font-bold text-lab-primary mr-1 bg-indigo-50 px-2 py-1 rounded-lg">
                        <Lightbulb size={12} fill="currentColor" /> Tips:
                      </div>
                      {suggestions.slice(0, 3).map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="group relative px-3 py-2 bg-white border border-slate-200 hover:border-amber-400 text-slate-600 hover:text-slate-800 rounded-xl text-xs font-medium shadow-sm transition-all active:scale-95 flex items-center gap-2 hover:shadow-md text-left"
                        >
                          <span className="whitespace-normal leading-tight">{suggestion}</span>
                          <span className="text-[9px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded border border-red-100 flex-shrink-0 whitespace-nowrap">-{TIP_COST} XP</span>
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="relative flex items-center gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendWithTipCheck()}
                      placeholder={selectedRole.id === 'game-programmeur' ? "Typ bijv: Maak de speler groen..." : "Typ je antwoord..."}
                      className="chat-input flex-1 h-14 bg-white border border-slate-200 rounded-xl px-4 focus:ring-4 focus:ring-lab-primary/10 transition-all outline-none shadow-sm text-base"
                      disabled={isLoading}
                    />
                    <button onClick={() => handleSendWithTipCheck()} disabled={!input.trim() || isLoading} aria-label="Verstuur bericht" className="touch-friendly-btn h-14 w-14 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg active:scale-90 disabled:opacity-30 transition-all">
                      <Send size={22} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </section>

              {/* Preview Column */}
              {showRightPanel && (
                <section className="preview-column flex-1 h-full min-h-0 min-w-0 flex flex-col animate-in slide-in-from-right-8 duration-500">
                  <div className={`flex-1 rounded-2xl overflow-hidden relative h-full w-full ${selectedRole?.id === 'verhalen-ontwerper' ? 'ambient-glow border-4 border-amber-100/50 shadow-inner' : 'bg-slate-900 border-4 border-slate-800 shadow-2xl'}`}>
                    {selectedRole?.id === 'word-wizard' && (
                      <WordWizardPreview
                        onTaskComplete={(task) => {
                          // Optional: Award XP or handle progress
                          logger.info('Word Wizard Task Completed:', task);
                        }}
                      />
                    )}

                    {selectedRole?.id === 'game-programmeur' && activeGameCode ? (
                      <GamePreview
                        code={activeGameCode}
                        autoStart={false}
                        isGenerating={isLoading || isGameLoading}
                        onLoad={() => setIsGameLoading(false)}
                        missionId="game-programmeur"
                        user={user ? {
                          uid: user.uid,
                          displayName: user.displayName || 'Student',
                          studentClass: user.studentClass,
                          schoolId: user.schoolId
                        } : undefined}
                        onUndo={undoGameCode}
                        canUndo={canUndoGameCode}
                      />
                    ) : selectedRole?.id === 'layout-doctor' ? (
                      <WordSimulator
                        onLevelComplete={() => {
                          handleAwardXP(50, 'Word Doctor Gediplomeerd!');
                          setStats(prev => ({
                            ...prev,
                            missionsCompleted: [...new Set([...(prev.missionsCompleted || []), 'layout-doctor'])]
                          }));
                          handleBackToOverview();
                        }}
                        onExit={handleBackToOverview}
                        // Use saved progress or start at 0
                        initialLevelIndex={(stats.missionProgress?.['layout-doctor']?.data as any)?.levelIndex || 0}
                        onProgressUpdate={(levelIndex) => {
                          setStats(prev => {
                            const newStats = {
                              ...prev,
                              missionProgress: {
                                ...(prev.missionProgress || {}),
                                'layout-doctor': {
                                  completedSteps: [],
                                  lastActive: new Date(),
                                  data: { levelIndex }
                                }
                              }
                            };
                            if (saveProgress) saveProgress(newStats);
                            return newStats;
                          });
                        }}
                      />
                    ) : selectedRole?.id === 'verhalen-ontwerper' ? (
                      <BookPreview
                        data={activeBookData}
                        user={user ? {
                          uid: user.uid,
                          displayName: user.displayName,
                          studentClass: user.studentClass,
                          schoolId: user.schoolId
                        } : undefined}
                        onStart={(prompt) => handleSend(prompt || "Start mijn prentenboek! Schrijf de eerste pagina van een spannend verhaal.")}
                        onSendPrompt={(prompt) => handleSend(prompt)}
                      />

                    ) : selectedRole?.id === 'ai-trainer' ? (
                      <TrainerPreview data={activeTrainerData} />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center p-4">
                        <div className="w-full h-full max-w-lg max-h-lg rounded-3xl overflow-hidden shadow-2xl border-8 border-slate-800 transform scale-90 md:scale-100">
                          {selectedRole?.visualPreview}
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}
            </div>
          ) // Close else block
        )}
        {/* Tip Confirmation Modal */}
        {tipToConfirm && (
          <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 transform scale-100 animate-in zoom-in-95 duration-200 border-2 border-amber-100">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mb-2 shadow-inner">
                  <Lightbulb size={32} fill="currentColor" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 mb-1">Tip gebruiken?</h3>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed">"{tipToConfirm}"</p>
                </div>
                <div className="bg-amber-50 text-amber-800 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest border border-amber-100">
                  Kost {TIP_COST} XP
                </div>
                <div className="flex gap-3 w-full mt-2">
                  <button
                    onClick={() => setTipToConfirm(null)}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors"
                  >
                    Nee, wacht
                  </button>
                  <button
                    onClick={confirmTipPurchase}
                    className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-lg shadow-amber-200 transition-all active:scale-95"
                  >
                    Ja, doe het!
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Weet je het zeker?</h3>
              <p className="text-slate-600 mb-6">
                Je staat op het punt om je voortgang voor <strong>"{selectedRole?.title}"</strong> te resetten.
                <br /><br />
                Alle code, verhalen en opgeslagen data voor deze missie worden permanent verwijderd. Dit kan niet ongedaan worden gemaakt.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                >
                  Annuleren
                </button>
                <button
                  onClick={() => {
                    resetCurrentMission();
                    setShowResetConfirm(false);
                  }}
                  className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-red-500/20"
                >
                  Ja, Reset Alles
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Week 1 Review (Assessment) */}
      {view === 'week1-review' && (() => {
        const assessmentData = getAssessment('review-week-1');
        if (!assessmentData) return null;
        return (
          <div className="absolute inset-0 z-50 bg-slate-900">
            <AssessmentEngine
              tasks={assessmentData.tasks}
              config={assessmentData.config}
              onSubmitResult={async (result) => {
                if (!user?.uid) return;
                await saveHybridAssessmentRecord({
                  uid: user.uid,
                  schoolId: user.schoolId,
                  studentName: user.displayName || 'Naamloos',
                  studentClass: user.studentClass,
                  missionId: 'week1-review',
                  autoScore: result.autoScore,
                  teacherScore: result.teacherScore,
                  finalScore: result.finalScore,
                  passed: result.passed,
                  teacherChecks: result.teacherChecks,
                  weights: result.weights || { autoWeight: 0.6, teacherWeight: 0.4 }
                });
              }}
              onComplete={(passed, score) => {
                if (passed) handleAwardXP(score, 'Week 1 Review');
                setView('lab');
              }}
              onExit={() => setView('lab')}
            />
          </div>
        );
      })()}

    </div>
  );
};

export default AiLab;
