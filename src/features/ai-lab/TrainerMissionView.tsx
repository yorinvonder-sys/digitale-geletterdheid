import React, { useState } from 'react';
import { Target, CheckCircle2, RotateCcw, Send, Lightbulb, MessageSquare, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { AgentRole, ChatMessage, TrainerData } from '@/types';
import { ChatBubble } from '@/features/ai-chat/ChatBubble';
import MissionWelcomeCard from '@/features/missions/shared/MissionWelcomeCard';
import { TrainerPreview } from '@/features/ai-lab/previews/TrainerPreview';

interface TrainerMissionViewProps {
  data: TrainerData;
  selectedRole: AgentRole;
  goalAchieved: boolean;
  messages: ChatMessage[];
  isLoading: boolean;
  thinkingStep: string;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  input: string;
  setInput: (value: string) => void;
  onSend: (text?: string) => void;
  error: string | null;
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
  tipCost: number;
  onLinkClick: (url: string) => void;
  onReset: () => void;
}

// Light cleanup so the collapsed coach line shows readable text (the full,
// markdown-rendered history lives in the expandable "Toon gesprek" panel).
const stripForPreview = (text: string): string =>
  (text || '')
    .replace(/---STEP_COMPLETE:\d+---/g, '')
    .replace(/\[[^\]]*\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Geïntegreerde weergave voor de AI Trainer-missie (Afval Sorteerder).
 * De werkbank krijgt de volle breedte; de chat zit als vaste "commandobalk"
 * onderaan met een uitklapbaar gesprek. Vervangt de losse links/rechts-split
 * uitsluitend voor deze missie.
 */
export const TrainerMissionView: React.FC<TrainerMissionViewProps> = ({
  data,
  selectedRole,
  goalAchieved,
  messages,
  isLoading,
  thinkingStep,
  messagesEndRef,
  input,
  setInput,
  onSend,
  error,
  suggestions,
  onSuggestionClick,
  tipCost,
  onLinkClick,
  onReset,
}) => {
  const [showLog, setShowLog] = useState(false);

  const lastModelMessage = [...messages].reverse().find(m => m.role === 'model' && !m.isWelcome);
  const coachText = isLoading
    ? (thinkingStep || 'Aan het nadenken…')
    : lastModelMessage
      ? stripForPreview(lastModelMessage.text)
      : 'Typ een voorbeeld om de robot te leren sorteren.';

  return (
    <div
      className="flex-1 w-full h-full min-h-0 flex flex-col rounded-3xl overflow-hidden border-4 border-duck-ink/15 shadow-2xl animate-in fade-in duration-500"
      style={{ backgroundColor: '#f2f1ec' }}
    >
      {/* Doel-bovenbalk */}
      <div className={`px-4 py-2.5 flex items-center gap-3 shrink-0 border-b ${goalAchieved ? 'bg-duck-ink/10 border-duck-ink/20' : 'bg-duck-bg/80 border-duck-ink/15'}`}>
        <div className="p-1.5 rounded-lg text-white shrink-0" style={{ backgroundColor: goalAchieved ? '#202023' : selectedRole.color }}>
          {goalAchieved ? <CheckCircle2 size={15} aria-hidden="true" /> : <Target size={15} aria-hidden="true" />}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-duck-ink/60">
            {goalAchieved ? 'Doel behaald!' : 'Jouw doel'}
          </h4>
          <p className="text-sm font-bold leading-tight break-words text-duck-ink">
            {selectedRole.primaryGoal || selectedRole.missionObjective}
          </p>
        </div>
        <button
          onClick={onReset}
          aria-label="Missie resetten"
          className="p-2.5 text-duck-ink/60 hover:text-duck-ink hover:bg-duck-acid rounded-xl transition-colors touch-friendly-btn shrink-0"
        >
          <RotateCcw size={18} aria-hidden="true" />
        </button>
      </div>

      {/* Werkbank (scrolt intern) */}
      <div className="flex-1 min-h-0 relative">
        <TrainerPreview data={data} />
      </div>

      {/* Commandobalk */}
      <div className="shrink-0 border-t border-duck-ink/15 bg-white p-3 keyboard-safe">
        {error && (
          <div className="mb-3 px-4 py-3 bg-duck-error border border-duck-error text-white rounded-xl text-sm flex items-center gap-2 animate-in fade-in">
            <span className="font-bold">{error}</span>
          </div>
        )}

        {/* Coach-regel + uitklap-knop */}
        <div className="flex items-center gap-2 mb-2">
          <img
            src="/assets/brand/dgskills-duck-guide-v3.png"
            alt="DGSkills eend"
            className="w-8 h-8 object-contain shrink-0"
            loading="lazy"
          />
          <p className="flex-1 min-w-0 text-sm text-duck-ink/70 line-clamp-2 leading-snug">{coachText}</p>
          <button
            onClick={() => setShowLog(v => !v)}
            aria-expanded={showLog}
            className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-duck-ink/60 hover:text-duck-ink hover:bg-duck-bg rounded-lg transition-colors"
          >
            <MessageSquare size={14} aria-hidden="true" />
            <span className="hidden sm:inline">{showLog ? 'Verberg gesprek' : 'Toon gesprek'}</span>
            {showLog ? <ChevronDown size={14} aria-hidden="true" /> : <ChevronUp size={14} aria-hidden="true" />}
          </button>
        </div>

        {/* Uitklapbaar gesprek */}
        {showLog && (
          <div className="mb-3 max-h-[38vh] overflow-y-auto custom-scrollbar border border-duck-ink/15 rounded-xl p-3 bg-duck-bg/40 space-y-3">
            {messages.map((m, i) => (
              m.isWelcome ? (
                <div key={i} className="flex w-full justify-start">
                  <MissionWelcomeCard role={selectedRole} />
                </div>
              ) : (
                <ChatBubble
                  key={i}
                  message={m}
                  onLinkClick={onLinkClick}
                  isLatest={i === messages.length - 1}
                  isBusy={isLoading}
                />
              )
            ))}
            {isLoading && (
              <div className="flex justify-start" role="status" aria-live="polite">
                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none border border-duck-ink/15 flex items-center gap-3 shadow-sm">
                  <Loader2 className="animate-spin text-duck-acid" size={20} aria-hidden="true" />
                  <span className="text-sm font-bold text-duck-ink/60">{thinkingStep || 'Aan het nadenken…'}</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Tips */}
        {suggestions.length > 0 && !isLoading && (
          <div className="flex flex-wrap gap-2 mb-3">
            <div
              className="flex items-center gap-1 text-xs font-bold text-white mr-1 px-2 py-1 rounded-lg"
              style={{ backgroundColor: selectedRole.color }}
            >
              <Lightbulb size={12} fill="currentColor" aria-hidden="true" /> Tips:
            </div>
            {suggestions.slice(0, 3).map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => onSuggestionClick(suggestion)}
                className="group relative px-3 py-2 bg-white border border-duck-ink/15 hover:border-duck-acid text-duck-ink/60 hover:text-duck-ink rounded-xl text-xs font-medium shadow-sm transition-all active:scale-95 flex items-center gap-2 hover:shadow-md text-left"
              >
                <span className="whitespace-normal leading-tight">{suggestion}</span>
                <span
                  className="text-[9px] font-bold text-white px-1.5 py-0.5 rounded flex-shrink-0 whitespace-nowrap"
                  style={{ backgroundColor: selectedRole.color, border: `1px solid ${selectedRole.color}` }}
                >
                  -{tipCost} XP
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Invoer */}
        <div className="relative flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSend()}
            placeholder="Typ je antwoord..."
            className="chat-input flex-1 h-14 bg-white border border-duck-ink/15 rounded-xl px-4 focus:ring-4 focus:ring-duck-acid/10 transition-all outline-none shadow-sm text-base"
            disabled={isLoading}
          />
          <button
            onClick={() => onSend()}
            disabled={!input.trim() || isLoading}
            aria-label="Verstuur bericht"
            className="touch-friendly-btn h-14 w-14 bg-duck-ink text-white rounded-xl flex items-center justify-center shadow-lg active:scale-90 disabled:opacity-30 transition-all"
          >
            <Send size={22} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};
