
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
    <div className="flex flex-col items-center justify-center h-full gap-4 p-6" style={{ color: '#6B6B66' }} role="status" aria-live="polite">
      {!showRetry ? (
        <>
          <Loader2 className="animate-spin" size={32} style={{ color: '#D97757' }} aria-hidden="true" />
          <span className="font-mono text-sm">Game laden...</span>
        </>
      ) : (
        <div className="text-center max-w-xs">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(217, 119, 87, 0.1)' }}>
            <RefreshCw size={28} style={{ color: '#D97757' }} />
          </div>
          <h3 className="text-lg font-bold mb-2" style={{ color: '#1A1A19' }}>Laden duurt lang...</h3>
          <p className="text-sm mb-4" style={{ color: '#6B6B66' }}>
            Er is mogelijk een probleem met je opgeslagen game. Ververs de pagina of reset je voortgang.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 text-white rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2"
            style={{ backgroundColor: '#D97757' }}
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
      // 1. Source check: verify the message comes from our iframe's window reference.
      //    This is the primary defense since blob URLs have an opaque origin ('null').
      if (!iframeRef.current || event.source !== iframeRef.current.contentWindow) return;
      // 2. Origin check: allow blob origin ('null') and same-origin messages only.
      if (event.origin !== 'null' && event.origin !== window.location.origin) return;
      // 3. Payload validation: only accept the exact expected message formats.
      const data = event.data;
      const isComplete =
        data === 'GAME_COMPLETE' ||
        (typeof data === 'object' && data !== null && data.type === 'GAME_COMPLETE');
      if (isComplete) {
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
    <div className="w-full h-full flex flex-col relative" style={{ backgroundColor: '#FAF9F0', borderLeft: '1px solid #E8E6DF' }}>
      {/* Header */}
      <div className="px-3 md:px-4 py-2 md:py-3 flex justify-between items-center shrink-0 shadow-sm z-10" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E8E6DF' }}>
        <div className="flex items-center gap-2">
          <div className="p-1 md:p-1.5 rounded-lg text-white" style={{ backgroundColor: '#10B981' }}>
            <Monitor size={14} strokeWidth={3} />
          </div>
          <span className="font-bold tracking-wide text-xs md:text-sm" style={{ color: '#1A1A19' }}>Live Game Preview</span>
        </div>
        <div className="flex gap-1 md:gap-2">
          {/* Gallery Button */}
          {user && (
            <button
              onClick={() => setShowGallery(true)}
              aria-label="Bekijk games van klasgenoten"
              className="transition-all p-1.5 rounded-lg active:scale-95 flex items-center gap-1.5"
              style={{ color: '#2A9D8F' }}
            >
              <Users size={16} aria-hidden="true" />
              <span className="text-xs font-bold hidden md:inline">Galerij</span>
            </button>
          )}

          {/* Publish Button */}
          {user && gameStarted && !showIntroOverlay && (
            <button
              onClick={() => setShowPublishModal(true)}
              aria-label="Zet in Galerij"
              className="transition-all p-1.5 rounded-lg active:scale-95 flex items-center gap-1.5"
              style={{ color: '#10B981' }}
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
              className="transition-all p-1.5 rounded-lg active:scale-95 flex items-center gap-1.5"
              style={{
                color: librarySaveSuccess ? '#10B981' : '#4F46E5',
                backgroundColor: librarySaveSuccess ? 'rgba(16, 185, 129, 0.1)' : undefined,
              }}
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

          {/* Undo Button */}
          {canUndo && onUndo && (
            <button
              onClick={onUndo}
              className="transition-all p-1.5 rounded-lg active:scale-95 flex items-center gap-1.5 animate-in fade-in slide-in-from-right-2"
              style={{ color: '#D97757' }}
              title="Vorige versie herstellen"
            >
              <Undo2 size={16} />
              <span className="text-xs font-bold hidden md:inline">Ongedaan</span>
            </button>
          )}

          <button
            onClick={handleReload}
            className="transition-all p-1.5 rounded-lg active:scale-95"
            style={{ color: '#6B6B66' }}
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
        className="flex-1 relative overflow-hidden select-none"
        style={{
          backgroundColor: '#1A1A19',
          WebkitUserSelect: 'none',
          userSelect: 'none',
          WebkitTouchCallout: 'none',
          touchAction: 'manipulation'
        }}
      >
        {blobUrl ? (
          <>
            {/* The actual game iframe */}
            <iframe
              key={blobUrl}
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

            {/* INITIAL LOADING OVERLAY */}
            {!iframeLoaded && !isGenerating && (
              <div className="absolute inset-0 z-25 flex flex-col items-center justify-center p-6 animate-in fade-in duration-300 pointer-events-auto" style={{ backgroundColor: 'rgba(250, 249, 240, 0.9)' }}>
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="animate-spin" size={48} style={{ color: '#D97757' }} />
                  <div className="text-center">
                    <h3 className="text-lg font-black mb-1 tracking-tight" style={{ color: '#1A1A19' }}>Game Laden...</h3>
                    <p className="text-xs font-medium" style={{ color: '#6B6B66' }}>Even geduld</p>
                  </div>
                </div>
              </div>
            )}

            {/* GENERATING / LOADING INDICATOR */}
            {(isGenerating || (!iframeLoaded && updateCount > 0)) && (
              <div className="absolute inset-x-0 top-0 z-30 flex justify-center p-4 pointer-events-none">
                <div className="text-white pl-4 pr-6 py-3 rounded-full shadow-2xl flex items-center gap-4 animate-in slide-in-from-top-4 backdrop-blur-md" style={{ backgroundColor: 'rgba(26, 26, 25, 0.9)', border: '1px solid rgba(217, 119, 87, 0.3)' }}>
                  <Loader2 className="animate-spin" size={20} style={{ color: '#D97757' }} />
                  <div className="flex flex-col">
                    <span className="font-bold text-sm tracking-wide">
                      {isGenerating ? "Pip is bezig..." : "Game verversen..."}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: '#D97757' }}>
                      {isGenerating ? "Code schrijven" : "Update toepassen"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* BLOCKING OVERLAY */}
            {(!iframeLoaded && updateCount === 0 && !isGenerating) && (
              <div className="absolute inset-0 z-20 backdrop-blur-[1px] transition-all duration-500 pointer-events-auto cursor-wait" style={{ backgroundColor: 'rgba(250, 249, 240, 0.2)' }} />
            )}

            {/* Update notification banner */}
            {showUpdateBanner && !showIntroOverlay && !isGenerating && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 animate-in fade-in slide-in-from-top-2">
                <div className="text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2" style={{ backgroundColor: '#10B981' }}>
                  Game Bijgewerkt!
                </div>
              </div>
            )}

            {/* INTRO OVERLAY */}
            {showIntroOverlay && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 md:p-8" style={{ backgroundColor: 'rgba(250, 249, 240, 0.98)' }}>
                {/* Content */}
                <div className="text-center max-w-sm md:max-w-md w-full">
                  {/* Pip mascot */}
                  <div className="relative mb-4 md:mb-6 mx-auto w-fit">
                    <img src="/mascot/pip-excited.webp" alt="Pip" className="w-20 h-20 object-contain" loading="lazy" />
                  </div>

                  {/* Title */}
                  <h2 className="text-xl md:text-2xl font-black mb-2 tracking-tight" style={{ fontFamily: "'Newsreader', Georgia, serif", color: '#1A1A19' }}>
                    Super Code Jumper
                  </h2>
                  <p className="text-sm md:text-base mb-4 md:mb-6 leading-relaxed px-4" style={{ color: '#3D3D38' }}>
                    Dit is jouw eigen game! Spring over obstakels en verzamel punten.
                  </p>

                  {/* Instructions Card */}
                  <div className="rounded-xl md:rounded-2xl p-4 md:p-5 mb-4 md:mb-6 text-left mx-auto" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E6DF' }}>
                    <h3 className="text-xs md:text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: '#D97757' }}>
                      <Code size={14} /> Hoe werkt het?
                    </h3>
                    <ul className="space-y-2 md:space-y-3 text-sm md:text-base" style={{ color: '#3D3D38' }}>
                      <li className="flex items-start gap-3">
                        <span className="text-xl">🎮</span>
                        <span><strong style={{ color: '#D97757' }}>TAP</strong> op het scherm of druk <strong style={{ color: '#D97757' }}>SPATIE</strong> om te springen</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-xl">💬</span>
                        <span>Typ in de chat om de game aan te passen</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-xl">✨</span>
                        <span>Probeer: <em style={{ color: '#2A9D8F' }}>"Maak de speler blauw"</em> of <em style={{ color: '#2A9D8F' }}>"Spring hoger"</em></span>
                      </li>
                    </ul>
                  </div>

                  {/* Numbered Intro Steps */}
                  <div className="rounded-xl md:rounded-2xl p-4 md:p-5 mb-4 md:mb-6 text-left mx-auto" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E6DF' }}>
                    <h3 className="text-xs md:text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: '#4F46E5' }}>
                      <Sparkles size={14} /> Zo werkt het
                    </h3>
                    <ol className="space-y-2 md:space-y-3 text-sm md:text-base" style={{ color: '#3D3D38' }}>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: '#4F46E5' }}>1</span>
                        <span>Beschrijf in de chat welk spel je wilt maken</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: '#4F46E5' }}>2</span>
                        <span>De AI schrijft de code voor je</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: '#4F46E5' }}>3</span>
                        <span>Je ziet het resultaat live in het speelveld rechts</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: '#4F46E5' }}>4</span>
                        <span>Vraag de AI om aanpassingen totdat je tevreden bent!</span>
                      </li>
                    </ol>
                  </div>

                  {/* BIG Start Button */}
                  <button
                    onClick={handleStartGame}
                    className="w-full py-4 md:py-5 text-white rounded-xl md:rounded-full font-black text-lg md:text-xl transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
                    style={{ backgroundColor: '#D97757' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#C46849')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#D97757')}
                  >
                    <Play size={24} fill="white" className="md:w-8 md:h-8" /> START DE GAME!
                  </button>

                  <p className="text-xs md:text-sm mt-3 flex items-center justify-center gap-2" style={{ color: '#6B6B66' }}>
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
          <div className="rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E6DF' }}>
            {publishSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                  <Check size={32} style={{ color: '#10B981' }} />
                </div>
                <h3 className="text-xl font-black mb-2" style={{ color: '#1A1A19' }}>Gepubliceerd!</h3>
                <p className="text-sm" style={{ color: '#6B6B66' }}>Je game staat nu in de galerij!</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                      <Share2 size={20} style={{ color: '#10B981' }} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black" style={{ color: '#1A1A19' }}>Deel je Game</h3>
                      <p className="text-xs" style={{ color: '#6B6B66' }}>Anderen kunnen je game spelen!</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPublishModal(false)}
                    aria-label="Sluit dialoog"
                    className="p-2 rounded-lg transition-colors"
                    style={{ color: '#6B6B66' }}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#6B6B66' }}>
                      Geef je game een naam
                    </label>
                    <input
                      type="text"
                      value={publishTitle}
                      onChange={(e) => setPublishTitle(e.target.value)}
                      placeholder="Bijv. Super Spring Avontuur"
                      className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                      style={{ backgroundColor: '#FAF9F0', border: '1px solid #E8E6DF', color: '#1A1A19' }}
                      maxLength={50}
                    />
                  </div>

                  <div className="rounded-xl p-4" style={{ backgroundColor: '#FAF9F0', border: '1px solid #F0EEE8' }}>
                    <div className="flex items-center gap-2 text-xs font-bold mb-2" style={{ color: '#D97757' }}>
                      <Sparkles size={14} />
                      Tip
                    </div>
                    <p className="text-sm" style={{ color: '#3D3D38' }}>
                      Kies een creatieve naam zodat anderen je game willen proberen!
                    </p>
                  </div>

                  {publishError && (
                    <div className="rounded-xl p-4 text-sm" style={{ backgroundColor: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#EF4444' }}>
                      {publishError}
                    </div>
                  )}

                  <button
                    onClick={handlePublish}
                    disabled={!publishTitle.trim() || isPublishing}
                    className="w-full py-4 text-white rounded-full font-black text-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg active:scale-95"
                    style={{ backgroundColor: '#10B981' }}
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

      {/* Save Name Modal */}
      {showSaveNameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E6DF' }}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(79, 70, 229, 0.1)' }}>
                  <BookOpen size={20} style={{ color: '#4F46E5' }} />
                </div>
                <div>
                  <h3 className="text-lg font-black" style={{ color: '#1A1A19' }}>Opslaan in Bibliotheek</h3>
                  <p className="text-xs" style={{ color: '#6B6B66' }}>Geef je project een naam</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowSaveNameModal(false);
                  setProjectName('');
                }}
                className="p-2 rounded-lg transition-colors"
                style={{ color: '#6B6B66' }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#6B6B66' }}>
                  Naam van je project
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Bijv. Mijn Super Game"
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                  style={{ backgroundColor: '#FAF9F0', border: '1px solid #E8E6DF', color: '#1A1A19' }}
                  maxLength={50}
                  autoFocus
                />
              </div>

              <div className="rounded-xl p-4" style={{ backgroundColor: '#FAF9F0', border: '1px solid #F0EEE8' }}>
                <div className="flex items-center gap-2 text-xs font-bold mb-2" style={{ color: '#D97757' }}>
                  <Sparkles size={14} />
                  Tip
                </div>
                <p className="text-sm" style={{ color: '#3D3D38' }}>
                  Kies een herkenbare naam zodat je deze later snel terugvindt in je bibliotheek!
                </p>
              </div>

              {librarySaveError && (
                <div className="rounded-xl p-4 text-sm flex items-center gap-2" style={{ backgroundColor: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#EF4444' }}>
                  {librarySaveError}
                </div>
              )}

              <button
                onClick={handleConfirmSave}
                disabled={!projectName.trim() || isSavingToLibrary || isCheckingLimit}
                className="w-full py-4 text-white rounded-full font-black text-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg active:scale-95"
                style={{ backgroundColor: '#4F46E5' }}
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

      {/* Gallery Modal */}
      {showGallery && user && (
        <div className="fixed inset-0 z-50" style={{ backgroundColor: '#FAF9F0' }}>
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
          <div className="rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E6DF' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(217, 119, 87, 0.1)', color: '#D97757' }}>
                <Database size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black" style={{ color: '#1A1A19' }}>Opslag Vol (5/5)</h3>
                <p className="text-xs" style={{ color: '#6B6B66' }}>Je kunt maximaal 5 games bewaren.</p>
              </div>
            </div>

            <p className="text-sm mb-4" style={{ color: '#3D3D38' }}>
              Kies een oude game om te vervangen door deze nieuwe versie:
            </p>

            {librarySaveError && (
              <div className="mb-4 rounded-xl p-4 text-sm flex items-center gap-2" style={{ backgroundColor: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#EF4444' }}>
                {librarySaveError}
              </div>
            )}

            <div className="flex flex-col gap-2 mb-6 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
              {existingGames.map((game) => (
                <button
                  key={game.id}
                  onClick={() => game.id && handleReplaceGame(game.id)}
                  disabled={isSavingToLibrary}
                  className="flex items-center justify-between p-3 rounded-xl transition-all group text-left"
                  style={{ backgroundColor: '#FAF9F0', border: '1px solid #E8E6DF' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E6DF', color: '#6B6B66' }}>
                      <Gamepad2 size={16} />
                    </div>
                    <div>
                      <div className="font-bold text-sm" style={{ color: '#1A1A19' }}>{game.name}</div>
                      <div className="text-[10px]" style={{ color: '#9C9C95' }}>
                        {game.created_at ? new Date(game.created_at).toLocaleDateString() : 'Onbekende datum'}
                      </div>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold uppercase tracking-wider" style={{ color: '#D97757' }}>
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
              className="w-full py-3 rounded-xl font-bold transition-colors"
              style={{ backgroundColor: '#FAF9F0', color: '#3D3D38', border: '1px solid #E8E6DF' }}
            >
              Annuleren
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
