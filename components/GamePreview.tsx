
import React, { useEffect, useRef, useState } from 'react';
import { RefreshCw, Monitor, Loader2, Gamepad2, Play, Code, MousePointer, Share2, X, Check, Sparkles, Users, Zap, BookOpen, Undo2, Database } from 'lucide-react';
import { MissionConclusion } from './MissionConclusion';
import { publishGame } from '../services/gameGalleryService';
import { GameGallery } from './GameGallery';
import { saveToLibrary, getLibraryCount, getLibraryItems, deleteLibraryItem, LibraryItem } from '../services/libraryService';

interface GamePreviewProps {
  code: string;
  autoStart?: boolean;
  isGenerating?: boolean;
  onLoad?: () => void;
  missionId?: string; // e.g. 'game-programmeur'
  user?: {
    uid: string;
    displayName: string;
    schoolId?: string;
    studentClass?: string;
  };
  onUndo?: () => void; // Callback to undo the last code change
  canUndo?: boolean; // Whether undo is available
}

// Loading state with timeout - shows retry option after 8 seconds
const LoadingStateWithTimeout: React.FC = () => {
  const [showRetry, setShowRetry] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowRetry(true), 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4 p-6" role="status" aria-live="polite">
      {!showRetry ? (
        <>
          <Loader2 className="animate-spin text-emerald-500" size={32} aria-hidden="true" />
          <span className="font-mono text-sm">Game laden...</span>
        </>
      ) : (
        <div className="text-center max-w-xs">
          <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <RefreshCw size={28} className="text-amber-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Laden duurt lang...</h3>
          <p className="text-sm text-slate-400 mb-4">
            Er is mogelijk een probleem met je opgeslagen game. Ververs de pagina of reset je voortgang.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold hover:from-amber-400 hover:to-orange-400 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} />
            Pagina Verversen
          </button>
        </div>
      )}
    </div>
  );
};

export const GamePreview: React.FC<GamePreviewProps> = ({ code, autoStart = false, isGenerating = false, onLoad, missionId, user, onUndo, canUndo = false }) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(autoStart);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [updateCount, setUpdateCount] = useState(0);
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);
  const [showConclusion, setShowConclusion] = useState(false);

  // Publish modal state
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishTitle, setPublishTitle] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  // Gallery modal state
  const [showGallery, setShowGallery] = useState(false);

  // Library save state
  const [isSavingToLibrary, setIsSavingToLibrary] = useState(false);
  const [librarySaveSuccess, setLibrarySaveSuccess] = useState(false);
  const [librarySaveError, setLibrarySaveError] = useState<string | null>(null);

  // Library Limit & Replacement State
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [existingGames, setExistingGames] = useState<LibraryItem[]>([]);
  const [isCheckingLimit, setIsCheckingLimit] = useState(false);

  // Save Name Modal State
  const [showSaveNameModal, setShowSaveNameModal] = useState(false);
  const [projectName, setProjectName] = useState('');
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const prevBlobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!code) {
      if (prevBlobUrlRef.current) {
        URL.revokeObjectURL(prevBlobUrlRef.current);
        prevBlobUrlRef.current = null;
      }
      setBlobUrl(null);
      return;
    }

    // Reset iframe loaded state when code changes
    setIframeLoaded(false);

    // Revoke previous URL using ref (avoids stale closure)
    if (prevBlobUrlRef.current) {
      URL.revokeObjectURL(prevBlobUrlRef.current);
    }

    const blob = new Blob([code], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    prevBlobUrlRef.current = url;
    setBlobUrl(url);

    // If game was already started, show update notification
    if (gameStarted) {
      setUpdateCount(prev => prev + 1);
      setShowUpdateBanner(true);
      setTimeout(() => setShowUpdateBanner(false), 2000);
    }

    return () => {
      // Cleanup: only revoke if this is the current URL
      if (prevBlobUrlRef.current === url) {
        URL.revokeObjectURL(url);
        prevBlobUrlRef.current = null;
      }
    };
  }, [code]);

  // Listen for game completion messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // SECURITY: Only accept messages from our preview iframe.
      // Blob URLs have origin 'null', so we check the source window reference.
      if (!iframeRef.current || event.source !== iframeRef.current.contentWindow) return;
      if (event.origin !== 'null' && event.origin !== window.location.origin) return;
      if (event.data === 'GAME_COMPLETE' || (typeof event.data === 'object' && event.data?.type === 'GAME_COMPLETE')) {
        setShowConclusion(true);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Auto-start logic when blobUrl changes or iframe loads
  useEffect(() => {
    if (gameStarted && blobUrl && iframeLoaded) {
      // Try multiple times to send start message (iframe might need time to initialize)
      const sendStartMessage = (attempt: number) => {
        const iframe = iframeRef.current;
        if (iframe?.contentWindow) {
          iframe.focus();
          try {
            // SECURITY: Using '*' as targetOrigin is required here because the iframe
            // loads a blob: URL, which has an opaque origin ('null'). Messages targeted
            // at a specific origin would never be received by blob: iframes. This is
            // acceptable because the message content ('start') is a non-sensitive
            // command string. The receiving side's message handler (lines 138-142)
            // validates the source window reference to prevent spoofing.
            iframe.contentWindow.postMessage('start', '*');
          } catch (e) {
            console.error('Failed to send start message:', e);
          }
        }
        // Retry up to 5 times with increasing delay
        if (attempt < 5) {
          setTimeout(() => sendStartMessage(attempt + 1), 200 * (attempt + 1));
        }
      };

      // Start sending messages after a short delay
      const timer = setTimeout(() => sendStartMessage(0), 300);
      return () => clearTimeout(timer);
    }
  }, [blobUrl, gameStarted, iframeLoaded]);

  const handleIframeLoad = () => {
    setIframeLoaded(true);
    if (onLoad) {
      onLoad();
    }
  };


  const handleReload = () => {
    if (code) {
      setBlobUrl(null);
      // Don't reset gameStarted if it was auto-started, or do we? 
      // User might want to see intro again? 
      // Typically reload means "restart game", so keeping gameStarted=true is fine if we want to skip intro.
      // But if we want to "reset to initial state including intro", we'd set it to false.
      // Let's keep it simple: just reload the content.
      setTimeout(() => {
        const blob = new Blob([code], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
      }, 50);
    }
  };



  const handleStartGame = () => {
    setGameStarted(true);
  };

  // Handle publishing game to gallery
  const handlePublish = async () => {
    if (!user || !code || !publishTitle.trim()) return;

    setIsPublishing(true);
    setPublishError(null);
    try {
      await publishGame(
        user.uid,
        user.displayName,
        publishTitle.trim(),
        { gameCode: code },
        undefined,
        user.studentClass,
        missionId, // Pass missionId for gallery organization
        user.schoolId
      );
      setPublishSuccess(true);
      setTimeout(() => {
        setShowPublishModal(false);
        setPublishSuccess(false);
        setPublishTitle('');
      }, 2000);
    } catch (error: any) {
      console.error('Failed to publish game:', error);
      setPublishError(error?.message || 'Er ging iets mis. Probeer opnieuw.');
    } finally {
      setIsPublishing(false);
    }
  };

  // Handle saving game to personal library - now shows name modal first
  const handleSaveToLibrary = async () => {
    if (!user || !code) return;
    setLibrarySaveError(null);
    setShowSaveNameModal(true);
  };

  // Called after user enters a name in the modal
  const handleConfirmSave = async () => {
    if (!user || !code || !projectName.trim()) return;

    setLibrarySaveError(null);
    setIsCheckingLimit(true);
    setIsSavingToLibrary(true);

    try {
      // 1. Check current library count
      const count = await getLibraryCount(user.uid);

      // 2. If limit reached (>= 5), fetch existing games and show replace modal
      if (count >= 5) {
        const items = await getLibraryItems(user.uid);
        const games = items.filter(item => item.type === 'game');
        setExistingGames(games);
        setShowReplaceModal(true);
        setShowSaveNameModal(false);
        setIsSavingToLibrary(false);
        setIsCheckingLimit(false);
        return;
      }

      // 3. If under limit, proceed to save directly
      await performSave();
      setShowSaveNameModal(false); // Close on success (performSave sets success state)
    } catch (error) {
      console.error('Failed to check library limit:', error);
      setLibrarySaveError((error as Error)?.message || 'Kon bibliotheek niet laden. Probeer het opnieuw.');
      setIsSavingToLibrary(false);
      setIsCheckingLimit(false);
    }
  };

  // Actual save operation - now uses custom project name
  const performSave = async () => {
    if (!user || !code) return;

    setLibrarySaveError(null);
    try {
      const gameName = projectName.trim() || `Mijn Game ${new Date().toLocaleDateString('nl-NL')}`;
      await saveToLibrary(user.uid, {
        type: 'game',
        name: gameName,
        data: { gameCode: code },
        mission_id: missionId || 'game-programmeur',
        mission_name: 'Game Programmeur'
      });
      setLibrarySaveSuccess(true);
      setProjectName('');
      setShowReplaceModal(false);
      setTimeout(() => setLibrarySaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save to library:', error);
      setLibrarySaveError((error as Error)?.message || 'Opslaan mislukt. Probeer het opnieuw.');
    } finally {
      setIsSavingToLibrary(false);
      setIsCheckingLimit(false);
    }
  };

  // Handle replacing an existing game
  const handleReplaceGame = async (gameId: string) => {
    if (!user || !gameId) return;

    setLibrarySaveError(null);
    setIsSavingToLibrary(true);

    try {
      await deleteLibraryItem(user.uid, gameId);
      await performSave();
    } catch (error) {
      console.error('Failed to replace game:', error);
      setLibrarySaveError((error as Error)?.message || 'Vervangen mislukt. Probeer het opnieuw.');
      setIsSavingToLibrary(false);
    }
  };



  // Show intro overlay when game not started
  const showIntroOverlay = !gameStarted;

  return (
    <div className="w-full h-full flex flex-col bg-slate-900 border-l border-slate-800 relative">
      {/* Header - Optimized for tablet */}
      <div className="bg-slate-800 px-3 md:px-4 py-2 md:py-3 flex justify-between items-center border-b border-slate-700 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-2">
          <div className="p-1 md:p-1.5 bg-emerald-500 rounded-lg text-white shadow-emerald-500/20 shadow-lg">
            <Monitor size={14} strokeWidth={3} />
          </div>
          <span className="text-slate-200 font-bold tracking-wide text-xs md:text-sm">Live Game Preview</span>
        </div>
        <div className="flex gap-1 md:gap-2">
          {/* Gallery Button - Browse other students' games */}
          {user && (
            <button
              onClick={() => setShowGallery(true)}
              aria-label="Bekijk games van klasgenoten"
              className="text-cyan-400 hover:text-cyan-300 transition-all p-1.5 hover:bg-cyan-500/20 rounded-lg active:scale-95 flex items-center gap-1.5"
            >
              <Users size={16} aria-hidden="true" />
              <span className="text-xs font-bold hidden md:inline">Galerij</span>
            </button>
          )}

          {/* Publish Button - Renamed to Publiceren */}
          {user && gameStarted && !showIntroOverlay && (
            <button
              onClick={() => setShowPublishModal(true)}
              aria-label="Zet in Galerij"
              className="text-emerald-400 hover:text-emerald-300 transition-all p-1.5 hover:bg-emerald-500/20 rounded-lg active:scale-95 flex items-center gap-1.5"
            >
              <Share2 size={16} aria-hidden="true" />
              <span className="text-xs font-bold hidden md:inline">Publiceren</span>
            </button>
          )}

          {/* Save to Library Button */}
          {user && gameStarted && !showIntroOverlay && (
            <button
              onClick={handleSaveToLibrary}
              disabled={isSavingToLibrary}
              className={`transition-all p-1.5 rounded-lg active:scale-95 flex items-center gap-1.5 ${librarySaveSuccess
                ? 'text-green-400 bg-green-500/20'
                : 'text-purple-400 hover:text-purple-300 hover:bg-purple-500/20'
                }`}
              title="Opslaan in Bibliotheek"
            >
              {isSavingToLibrary ? (
                <Loader2 size={16} className="animate-spin" />
              ) : librarySaveSuccess ? (
                <Check size={16} />
              ) : (
                <BookOpen size={16} />
              )}
              <span className="text-xs font-bold hidden md:inline">
                {librarySaveSuccess ? 'Opgeslagen!' : 'Opslaan'}
              </span>
            </button>
          )}

          {/* Undo Button - Revert to previous code version */}
          {canUndo && onUndo && (
            <button
              onClick={onUndo}
              className="text-amber-400 hover:text-amber-300 transition-all p-1.5 hover:bg-amber-500/20 rounded-lg active:scale-95 flex items-center gap-1.5 animate-in fade-in slide-in-from-right-2"
              title="Vorige versie herstellen"
            >
              <Undo2 size={16} />
              <span className="text-xs font-bold hidden md:inline">Ongedaan</span>
            </button>
          )}

          <button
            onClick={handleReload}
            className="text-slate-400 hover:text-white transition-all p-1.5 hover:bg-slate-700 rounded-lg active:scale-95"
            title="Herstart"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {showConclusion && (
        <MissionConclusion
          title="Missie Voltooid: Game Programmeur"
          description="Je hebt de logica van de game aangepast en bugs opgelost. De computer deed precies wat jij vroeg!"
          aiConcept={{
            title: "Algoritmes & Regels",
            text: "Net als deze game volgt software strikte regels (algoritmes). 'Als speler botst -> Game Over'.\n\nModerne AI schrijft soms zijn eigen regels door naar data te kijken, maar de basis blijft: logisch nadenken en stap-voor-stap instructies!"
          }}
          onExit={() => setShowConclusion(false)}
        />
      )}

      {/* Game Area */}
      <div
        className="flex-1 relative bg-slate-950 overflow-hidden select-none"
        style={{
          WebkitUserSelect: 'none',
          userSelect: 'none',
          WebkitTouchCallout: 'none',
          touchAction: 'manipulation'
        }}
      >
        {blobUrl ? (
          <>
            {/* The actual game iframe - key forces instant re-render on code change */}
            <iframe
              key={blobUrl} // Force new iframe on each code update
              ref={iframeRef}
              src={blobUrl}
              title="Game Output"
              onLoad={handleIframeLoad}
              className={`w-full h-full absolute inset-0 border-none transition-opacity duration-300 select-none ${!iframeLoaded || showIntroOverlay || isGenerating ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}
              sandbox="allow-scripts allow-forms"
              allow="autoplay"
              style={{
                WebkitUserSelect: 'none',
                userSelect: 'none',
                WebkitTouchCallout: 'none'
              }}
            />

            {/* INITIAL LOADING OVERLAY - Show while iframe is loading */}
            {!iframeLoaded && !isGenerating && (
              <div className="absolute inset-0 z-25 flex flex-col items-center justify-center p-6 bg-slate-900/80 animate-in fade-in duration-300 pointer-events-auto">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500/30 blur-xl rounded-full animate-pulse"></div>
                    <Loader2 className="animate-spin text-emerald-400 relative z-10" size={48} />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-black text-white mb-1 tracking-tight">Game Laden...</h3>
                    <p className="text-slate-400 text-xs font-medium">Even geduld</p>
                  </div>
                </div>
              </div>
            )}

            {/* GENERATING / LOADING INDICTATOR - Shows during AI generation AND while game is refreshing */}
            {(isGenerating || (!iframeLoaded && updateCount > 0)) && (
              <div className="absolute inset-x-0 top-0 z-30 flex justify-center p-4 pointer-events-none">
                <div className="bg-slate-900/90 text-white pl-4 pr-6 py-3 rounded-full shadow-2xl border border-emerald-500/30 flex items-center gap-4 animate-in slide-in-from-top-4 backdrop-blur-md">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500/50 blur-lg rounded-full animate-pulse"></div>
                    <Loader2 className="animate-spin text-emerald-400 relative z-10" size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm tracking-wide">
                      {isGenerating ? "AI is bezig..." : "Game verversen..."}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-widest">
                      {isGenerating ? "Code schrijven" : "Update toepassen"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* BLOCKING OVERLAY - Only for initial load (not updates) */}
            {(!iframeLoaded && updateCount === 0 && !isGenerating) && (
              <div className="absolute inset-0 z-20 bg-slate-950/20 backdrop-blur-[1px] transition-all duration-500 pointer-events-auto cursor-wait" />
            )}

            {/* Update notification banner - Only show if NOT generating */}
            {showUpdateBanner && !showIntroOverlay && !isGenerating && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 animate-in fade-in slide-in-from-top-2">
                <div className="bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                  ✨ Game Bijgewerkt!
                </div>
              </div>
            )}

            {/* INTRO OVERLAY - Always show until user clicks start */}
            {showIntroOverlay && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-b from-slate-900/98 via-slate-900/95 to-slate-900/98">
                {/* Animated top bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-cyan-400 to-emerald-500"></div>

                {/* Content - Tablet optimized */}
                <div className="text-center max-w-sm md:max-w-md w-full">
                  {/* Game Icon */}
                  <div className="relative mb-4 md:mb-6 mx-auto w-fit">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-emerald-500/40 transform rotate-3">
                      <Zap size={32} className="text-white md:w-10 md:h-10" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 md:w-8 md:h-8 bg-amber-400 rounded-full flex items-center justify-center text-sm md:text-base shadow-lg border-2 border-slate-900">
                      ⚡
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl md:text-2xl font-black text-white mb-2 tracking-tight">
                    Super Code Jumper
                  </h2>
                  <p className="text-slate-400 text-sm md:text-base mb-4 md:mb-6 leading-relaxed px-4">
                    Dit is jouw eigen game! Spring over obstakels en verzamel punten.
                  </p>

                  {/* Instructions Card - Tablet optimized */}
                  <div className="bg-slate-800/80 border border-slate-700 rounded-xl md:rounded-2xl p-4 md:p-5 mb-4 md:mb-6 text-left mx-auto">
                    <h3 className="text-xs md:text-sm font-bold text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Code size={14} /> Hoe werkt het?
                    </h3>
                    <ul className="space-y-2 md:space-y-3 text-sm md:text-base text-slate-300">
                      <li className="flex items-start gap-3">
                        <span className="text-xl">🎮</span>
                        <span><strong className="text-emerald-400">TAP</strong> op het scherm of druk <strong className="text-emerald-400">SPATIE</strong> om te springen</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-xl">💬</span>
                        <span>Typ in de chat om de game aan te passen</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-xl">✨</span>
                        <span>Probeer: <em className="text-cyan-400">"Maak de speler blauw"</em> of <em className="text-cyan-400">"Spring hoger"</em></span>
                      </li>
                    </ul>
                  </div>

                  {/* BIG Start Button - Very prominent for tablet */}
                  <button
                    onClick={handleStartGame}
                    className="w-full py-4 md:py-5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl md:rounded-2xl font-black text-lg md:text-xl hover:from-emerald-400 hover:to-cyan-400 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-emerald-500/40 active:scale-95 border-2 border-emerald-400/30"
                  >
                    <Play size={24} fill="white" className="md:w-8 md:h-8" /> START DE GAME!
                  </button>

                  <p className="text-slate-500 text-xs md:text-sm mt-3 flex items-center justify-center gap-2">
                    <MousePointer size={14} /> Tik om te beginnen
                  </p>
                </div>
              </div>
            )}
          </>
        ) : (
          <LoadingStateWithTimeout />
        )}
      </div>

      {/* Publish Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-slate-700 shadow-2xl animate-in zoom-in-95">
            {publishSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={32} className="text-emerald-400" />
                </div>
                <h3 className="text-xl font-black text-white mb-2">Gepubliceerd! 🎉</h3>
                <p className="text-slate-400 text-sm">Je game staat nu in de galerij!</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                      <Share2 size={20} className="text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white">Deel je Game</h3>
                      <p className="text-xs text-slate-400">Anderen kunnen je game spelen!</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPublishModal(false)}
                    aria-label="Sluit dialoog"
                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <X size={20} className="text-slate-400" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Geef je game een naam
                    </label>
                    <input
                      type="text"
                      value={publishTitle}
                      onChange={(e) => setPublishTitle(e.target.value)}
                      placeholder="Bijv. Super Spring Avontuur"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                      maxLength={50}
                    />
                  </div>

                  <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-2">
                      <Sparkles size={14} />
                      Tip
                    </div>
                    <p className="text-slate-400 text-sm">
                      Kies een creatieve naam zodat anderen je game willen proberen!
                    </p>
                  </div>

                  {/* Error Display */}
                  {publishError && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
                      ⚠️ {publishError}
                    </div>
                  )}

                  <button
                    onClick={handlePublish}
                    disabled={!publishTitle.trim() || isPublishing}
                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-black text-lg hover:from-emerald-400 hover:to-cyan-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20 active:scale-95"
                  >
                    {isPublishing ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Publiceren...
                      </>
                    ) : (
                      <>
                        <Share2 size={20} />
                        Publiceer naar Galerij
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Save Name Modal - For naming project before saving to library */}
      {showSaveNameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-slate-700 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <BookOpen size={20} className="text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Opslaan in Bibliotheek</h3>
                  <p className="text-xs text-slate-400">Geef je project een naam</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowSaveNameModal(false);
                  setProjectName('');
                }}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Naam van je project
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Bijv. Mijn Super Game"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                  maxLength={50}
                  autoFocus
                />
              </div>

              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-2">
                  <Sparkles size={14} />
                  Tip
                </div>
                <p className="text-slate-400 text-sm">
                  Kies een herkenbare naam zodat je deze later snel terugvindt in je bibliotheek!
                </p>
              </div>

              {librarySaveError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm flex items-center gap-2">
                  <span>⚠️</span>
                  {librarySaveError}
                </div>
              )}

              <button
                onClick={handleConfirmSave}
                disabled={!projectName.trim() || isSavingToLibrary || isCheckingLimit}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-black text-lg hover:from-purple-400 hover:to-pink-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20 active:scale-95"
              >
                {(isSavingToLibrary || isCheckingLimit) ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    {isCheckingLimit ? 'Controleren...' : 'Opslaan...'}
                  </>
                ) : (
                  <>
                    <BookOpen size={20} />
                    Opslaan
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Modal - Fullscreen overlay */}
      {showGallery && user && (
        <div className="fixed inset-0 z-50 bg-slate-900">
          <GameGallery
            userId={user.uid}
            schoolId={user.schoolId}
            userClass={user.studentClass}
            onBack={() => setShowGallery(false)}
          />
        </div>
      )}
      {/* Library Limit / Replace Game Modal */}
      {showReplaceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-slate-700 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-500">
                <Database size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Opslag Vol (5/5)</h3>
                <p className="text-xs text-slate-400">Je kunt maximaal 5 games bewaren.</p>
              </div>
            </div>

            <p className="text-slate-300 text-sm mb-4">
              Kies een oude game om te vervangen door deze nieuwe versie:
            </p>

            {librarySaveError && (
              <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm flex items-center gap-2">
                <span>⚠️</span>
                {librarySaveError}
              </div>
            )}

            <div className="flex flex-col gap-2 mb-6 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
              {existingGames.map((game) => (
                <button
                  key={game.id}
                  onClick={() => game.id && handleReplaceGame(game.id)}
                  disabled={isSavingToLibrary}
                  className="flex items-center justify-between p-3 bg-slate-900 border border-slate-700 hover:border-amber-500 hover:bg-slate-700/50 rounded-xl transition-all group text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500 group-hover:text-amber-500 transition-colors">
                      <Gamepad2 size={16} />
                    </div>
                    <div>
                      <div className="font-bold text-slate-200 text-sm">{game.name}</div>
                      <div className="text-[10px] text-slate-500">
                        {game.created_at ? new Date(game.created_at).toLocaleDateString() : 'Onbekende datum'}
                      </div>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-500 text-xs font-bold uppercase tracking-wider">
                    Vervang
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setShowReplaceModal(false);
                setIsSavingToLibrary(false);
                setLibrarySaveError(null);
              }}
              disabled={isSavingToLibrary}
              className="w-full py-3 bg-slate-700 text-white rounded-xl font-bold hover:bg-slate-600 transition-colors"
            >
              Annuleren
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
