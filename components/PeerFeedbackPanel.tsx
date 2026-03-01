import React, { useState, useEffect } from 'react';
import { ThumbsUp, Lightbulb, HelpCircle, Send, MessageSquare, Loader2, AlertCircle } from 'lucide-react';
import { submitPeerFeedback, getFeedbackForMission, PeerFeedback } from '../services/peerFeedbackService';

// =====================================================================
// CONTENT FILTER — Block inappropriate content (same pattern as
// AiBeleidBrainstormPreview.tsx)
// =====================================================================
const BLOCKED_WORDS = [
  'kanker', 'kut', 'fuck', 'shit', 'pik', 'lul', 'hoer', 'slet', 'bitch',
  'kech', 'homo', 'flikker', 'mongool', 'debiel', 'idioot', 'achterlijk',
  'retard', 'dood', 'moord', 'bom', 'wapen', 'drugs', 'naakt', 'seks',
  'porn', 'sukkel', 'dombo', 'klootzak', 'tering', 'tyfus', 'ezel',
];

/**
 * Validate feedback message.
 * Returns an error string if invalid, null if OK.
 */
function validateFeedbackMessage(text: string): string | null {
  const trimmed = text.trim();

  if (trimmed.length < 10) {
    return 'Je bericht moet minimaal 10 tekens bevatten.';
  }

  // Reject messages that are only special characters or numbers
  if (/^[^a-zA-ZÀ-ÿ]+$/.test(trimmed)) {
    return 'Je bericht moet gewone tekst bevatten.';
  }

  // Check blocked words
  const lower = trimmed.toLowerCase().replace(/[^a-z0-9\s]/g, '');
  for (const word of BLOCKED_WORDS) {
    const regex = new RegExp(`\\b${word}`, 'i');
    if (regex.test(lower)) {
      return 'Je bericht bevat ongepaste taal. Pas het aan.';
    }
  }

  return null;
}

const FEEDBACK_TYPES = [
  {
    type: 'positive' as const,
    label: 'Positief',
    icon: ThumbsUp,
    emoji: '\uD83D\uDC4D',
    description: 'Wat ging er goed?',
    color: 'emerald',
    bgSelected: 'bg-emerald-100 border-emerald-400 text-emerald-800',
    bgDefault: 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300 hover:bg-emerald-50',
  },
  {
    type: 'suggestion' as const,
    label: 'Suggestie',
    icon: Lightbulb,
    emoji: '\uD83D\uDCA1',
    description: 'Hoe kan het beter?',
    color: 'amber',
    bgSelected: 'bg-amber-100 border-amber-400 text-amber-800',
    bgDefault: 'bg-white border-slate-200 text-slate-600 hover:border-amber-300 hover:bg-amber-50',
  },
  {
    type: 'question' as const,
    label: 'Vraag',
    icon: HelpCircle,
    emoji: '\u2753',
    description: 'Iets onduidelijk?',
    color: 'blue',
    bgSelected: 'bg-blue-100 border-blue-400 text-blue-800',
    bgDefault: 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50',
  },
];

interface PeerFeedbackPanelProps {
  currentUserId: string;
  currentUserName: string;
  targetUserId: string;
  missionId: string;
  schoolId?: string;
}

export const PeerFeedbackPanel: React.FC<PeerFeedbackPanelProps> = ({
  currentUserId,
  currentUserName,
  targetUserId,
  missionId,
  schoolId,
}) => {
  const [selectedType, setSelectedType] = useState<'positive' | 'suggestion' | 'question' | null>(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [receivedFeedback, setReceivedFeedback] = useState<PeerFeedback[]>([]);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);

  const MAX_CHARS = 280;

  // Load feedback received for this mission
  useEffect(() => {
    const loadFeedback = async () => {
      if (!targetUserId || !missionId) return;
      setIsLoadingFeedback(true);
      try {
        const data = await getFeedbackForMission(targetUserId, missionId);
        setReceivedFeedback(data);
      } catch {
        // Silently fail — feedback display is non-critical
      } finally {
        setIsLoadingFeedback(false);
      }
    };
    loadFeedback();
  }, [targetUserId, missionId]);

  const handleSubmit = async () => {
    if (!selectedType) {
      setValidationError('Kies eerst een type feedback.');
      return;
    }

    const msgError = validateFeedbackMessage(message);
    if (msgError) {
      setValidationError(msgError);
      return;
    }

    setValidationError(null);
    setError(null);
    setIsSubmitting(true);

    try {
      await submitPeerFeedback({
        fromUid: currentUserId,
        fromName: currentUserName,
        targetUid: targetUserId,
        targetMissionId: missionId,
        feedbackType: selectedType,
        message: message.trim(),
        schoolId,
      });

      setSubmitSuccess(true);
      setMessage('');
      setSelectedType(null);

      // Refresh the feedback list
      const updated = await getFeedbackForMission(targetUserId, missionId);
      setReceivedFeedback(updated);

      // Reset success state after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Er ging iets mis bij het versturen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length <= MAX_CHARS) {
      setMessage(val);
      setValidationError(null);
    }
  };

  // Don't allow self-feedback
  if (currentUserId === targetUserId) {
    return null;
  }

  return (
    <div className="mt-8 border-t border-slate-200 pt-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
          <MessageSquare size={20} />
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-900 tracking-tight">Geef Feedback</h3>
          <p className="text-sm text-slate-500 font-medium">Wat vind je van het werk van je klasgenoot?</p>
        </div>
      </div>

      {/* Feedback Type Selector */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {FEEDBACK_TYPES.map((ft) => {
          const Icon = ft.icon;
          const isSelected = selectedType === ft.type;
          return (
            <button
              key={ft.type}
              onClick={() => {
                setSelectedType(ft.type);
                setValidationError(null);
              }}
              className={`p-3 rounded-xl border-2 transition-all text-center flex flex-col items-center gap-1.5 active:scale-95 ${
                isSelected ? ft.bgSelected : ft.bgDefault
              }`}
            >
              <Icon size={20} />
              <span className="text-sm font-bold">{ft.label}</span>
              <span className="text-[10px] font-medium opacity-70">{ft.description}</span>
            </button>
          );
        })}
      </div>

      {/* Message Input */}
      <div className="relative mb-3">
        <textarea
          value={message}
          onChange={handleMessageChange}
          placeholder={
            selectedType === 'positive'
              ? 'Wat vond je goed aan dit werk?'
              : selectedType === 'suggestion'
              ? 'Welke verbetering stel je voor?'
              : selectedType === 'question'
              ? 'Wat is je vraag over dit werk?'
              : 'Kies eerst een feedbacktype hierboven...'
          }
          disabled={!selectedType || isSubmitting}
          rows={3}
          className="w-full p-4 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 transition-all outline-none resize-none disabled:opacity-50 disabled:bg-slate-50"
        />
        <span className={`absolute bottom-2 right-3 text-[10px] font-bold ${
          message.length > MAX_CHARS - 20 ? 'text-red-500' : 'text-slate-400'
        }`}>
          {message.length}/{MAX_CHARS}
        </span>
      </div>

      {/* Validation Error */}
      {validationError && (
        <div className="mb-3 px-4 py-2 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-center gap-2 animate-in fade-in">
          <AlertCircle size={14} />
          <span className="font-medium">{validationError}</span>
        </div>
      )}

      {/* Server Error */}
      {error && (
        <div className="mb-3 px-4 py-2 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-center gap-2 animate-in fade-in">
          <AlertCircle size={14} />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Success Message */}
      {submitSuccess && (
        <div className="mb-3 px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-bold animate-in fade-in">
          Feedback verstuurd! Bedankt voor je bijdrage.
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!selectedType || !message.trim() || isSubmitting}
        className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 shadow-lg"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Versturen...
          </>
        ) : (
          <>
            <Send size={18} /> Verstuur Feedback
          </>
        )}
      </button>

      {/* Received Feedback Section */}
      {isLoadingFeedback ? (
        <div className="mt-6 flex items-center justify-center py-4 text-slate-400">
          <Loader2 size={18} className="animate-spin mr-2" />
          <span className="text-sm font-medium">Feedback laden...</span>
        </div>
      ) : receivedFeedback.length > 0 ? (
        <div className="mt-8">
          <h4 className="text-sm font-black text-slate-700 uppercase tracking-wider mb-3">
            Ontvangen Feedback ({receivedFeedback.length})
          </h4>
          <div className="space-y-3">
            {receivedFeedback.map((fb) => {
              const typeConfig = FEEDBACK_TYPES.find(ft => ft.type === fb.feedbackType);
              return (
                <div
                  key={fb.id}
                  className="p-4 bg-slate-50 border border-slate-100 rounded-xl"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-base">{typeConfig?.emoji}</span>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {typeConfig?.label}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-auto">
                      {fb.fromName}
                      {fb.createdAt && (
                        <> &middot; {new Date(fb.createdAt).toLocaleDateString('nl-NL', {
                          day: 'numeric',
                          month: 'short',
                        })}</>
                      )}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">{fb.message}</p>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PeerFeedbackPanel;
