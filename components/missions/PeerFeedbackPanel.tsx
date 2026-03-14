import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, Users, Award, ChevronDown, ChevronUp, MessageSquare, Loader2 } from 'lucide-react';
import {
  submitPeerFeedback,
  getReceivedFeedback,
  getRandomPeerForReview,
  getGivenFeedback,
  getFeedbackGivenCount,
  PeerFeedbackCriteria,
  PeerFeedbackRecord,
} from '@/services/peerFeedbackService';
import { awardXP } from '@/services/XPService';
import { ReceivedFeedbackCard } from './ReceivedFeedbackCard';

interface Props {
  missionId: string;
  studentId: string;
  schoolId: string;
  classId: string;
}

type PanelState = 'prompt' | 'review' | 'submitting' | 'done' | 'no-peers';

const CRITERIA_KEYS: { key: keyof PeerFeedbackCriteria; label: string; description: string }[] = [
  { key: 'duidelijkheid', label: 'Duidelijkheid', description: 'Is het werk helder en begrijpelijk?' },
  { key: 'creativiteit', label: 'Creativiteit', description: 'Is er een originele aanpak gebruikt?' },
  { key: 'volledigheid', label: 'Volledigheid', description: 'Is de opdracht compleet uitgewerkt?' },
];

const PEER_REVIEWER_BADGE_THRESHOLD = 5;

export const PeerFeedbackPanel: React.FC<Props> = ({ missionId, studentId, schoolId, classId }) => {
  const [state, setState] = useState<PanelState>('prompt');
  const [peer, setPeer] = useState<{ studentId: string; displayName: string } | null>(null);
  const [criteria, setCriteria] = useState<PeerFeedbackCriteria>({
    duidelijkheid: 0,
    creativiteit: 0,
    volledigheid: 0,
  });
  const [feedbackText, setFeedbackText] = useState('');
  const [error, setError] = useState('');
  const [receivedFeedback, setReceivedFeedback] = useState<PeerFeedbackRecord[]>([]);
  const [showReceived, setShowReceived] = useState(false);
  const [loading, setLoading] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(false);

  // Load received feedback on mount
  useEffect(() => {
    getReceivedFeedback(studentId, missionId)
      .then(setReceivedFeedback)
      .catch(() => {});
  }, [studentId, missionId]);

  const handleStartReview = async () => {
    setLoading(true);
    try {
      const found = await getRandomPeerForReview(missionId, classId, studentId);
      if (found) {
        setPeer(found);
        setState('review');
      } else {
        setState('no-peers');
      }
    } catch {
      setState('no-peers');
    } finally {
      setLoading(false);
    }
  };

  const handleSetRating = (key: keyof PeerFeedbackCriteria, value: number) => {
    setCriteria(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setError('');

    if (feedbackText.trim().length < 20) {
      setError('Schrijf minimaal 20 tekens feedback.');
      return;
    }

    const allRated = criteria.duidelijkheid > 0 && criteria.creativiteit > 0 && criteria.volledigheid > 0;
    if (!allRated) {
      setError('Geef alle criteria een score.');
      return;
    }

    if (!peer) return;

    setState('submitting');

    try {
      const avgRating = Math.round((criteria.duidelijkheid + criteria.creativiteit + criteria.volledigheid) / 3);

      await submitPeerFeedback({
        missionId,
        toStudentId: peer.studentId,
        feedbackText: feedbackText.trim(),
        rating: avgRating,
        criteria,
        schoolId,
        classId,
      });

      // Award XP bonus
      const xpResult = await awardXP(studentId, 25, 'peer_feedback', missionId);
      setXpAwarded(xpResult.awarded);

      // Check for Peer Reviewer badge
      const count = await getFeedbackGivenCount(studentId);
      if (count >= PEER_REVIEWER_BADGE_THRESHOLD) {
        setEarnedBadge(true);
      }

      // Refresh received feedback
      const updated = await getReceivedFeedback(studentId, missionId);
      setReceivedFeedback(updated);
      setShowReceived(updated.length > 0);

      setState('done');
    } catch (e: any) {
      setError(e.message || 'Er ging iets mis.');
      setState('review');
    }
  };

  const renderStarInput = (key: keyof PeerFeedbackCriteria, label: string, description: string) => (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-[#3D3D38]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
          {label}
        </span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(i => (
            <button
              key={i}
              onClick={() => handleSetRating(key, i)}
              className="p-0.5 transition-transform hover:scale-110 active:scale-95"
            >
              <Star
                size={20}
                className={`transition-colors ${
                  i <= criteria[key]
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-[#D1CFC7] hover:text-yellow-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
      <p className="text-xs text-[#A3A196]">{description}</p>
    </div>
  );

  // Prompt state: ask if they want to review
  if (state === 'prompt') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-[#FAFAF8] to-[#F0EFEA] rounded-2xl border border-[#E8E6DF] p-5 space-y-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Users size={20} className="text-blue-500" />
          </div>
          <div>
            <h3 className="text-base font-black text-[#3D3D38]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
              Peer Feedback
            </h3>
            <p className="text-xs text-[#6B6B66]">Beoordeel het werk van een klasgenoot</p>
          </div>
        </div>

        <p className="text-sm text-[#3D3D38]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
          Wil je het werk van een klasgenoot beoordelen? Je helpt hen verbeteren en verdient <span className="font-bold text-blue-500">+25 XP</span>!
        </p>

        <button
          onClick={handleStartReview}
          disabled={loading}
          className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <MessageSquare size={16} />
          )}
          {loading ? 'Klasgenoot zoeken...' : 'Ja, ik wil feedback geven!'}
        </button>

        {/* Show received feedback if any */}
        {receivedFeedback.length > 0 && (
          <div>
            <button
              onClick={() => setShowReceived(!showReceived)}
              className="flex items-center gap-1.5 text-xs font-bold text-[#6B6B66] hover:text-[#3D3D38] transition-colors"
            >
              {showReceived ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {receivedFeedback.length} feedback ontvangen
            </button>
            <AnimatePresence>
              {showReceived && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden space-y-2 mt-2"
                >
                  {receivedFeedback.map(fb => (
                    <ReceivedFeedbackCard key={fb.id} feedback={fb} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    );
  }

  // No peers available
  if (state === 'no-peers') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-[#FAFAF8] rounded-2xl border border-[#E8E6DF] p-5 text-center space-y-2"
      >
        <Users size={24} className="text-[#A3A196] mx-auto" />
        <p className="text-sm text-[#6B6B66]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
          Er zijn nog geen klasgenoten die deze missie hebben afgerond, of je hebt iedereen al beoordeeld.
        </p>
      </motion.div>
    );
  }

  // Review form
  if (state === 'review' || state === 'submitting') {
    const isSubmitting = state === 'submitting';

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-[#E8E6DF] p-5 space-y-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <MessageSquare size={20} className="text-blue-500" />
          </div>
          <div>
            <h3 className="text-base font-black text-[#3D3D38]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
              Beoordeel {peer?.displayName}
            </h3>
            <p className="text-xs text-[#6B6B66]">Geef eerlijke en constructieve feedback</p>
          </div>
        </div>

        {/* Criteria star ratings */}
        <div className="space-y-3 bg-[#FAFAF8] rounded-xl p-4">
          {CRITERIA_KEYS.map(c => renderStarInput(c.key, c.label, c.description))}
        </div>

        {/* Feedback text */}
        <div>
          <label className="text-sm font-bold text-[#3D3D38] block mb-1.5" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
            Geschreven feedback
          </label>
          <textarea
            value={feedbackText}
            onChange={e => setFeedbackText(e.target.value)}
            placeholder="Wat vond je goed? Wat kan beter? (min. 20 tekens)"
            maxLength={1000}
            rows={3}
            disabled={isSubmitting}
            className="w-full px-4 py-3 rounded-xl border border-[#E8E6DF] bg-[#FAFAF8] text-sm text-[#3D3D38] placeholder-[#A3A196] resize-none focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent disabled:opacity-50"
            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
          />
          <p className="text-xs text-[#A3A196] mt-1 text-right">
            {feedbackText.length}/1000
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-500 font-medium">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}
          {isSubmitting ? 'Versturen...' : 'Feedback versturen'}
        </button>
      </motion.div>
    );
  }

  // Done state
  if (state === 'done') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-blue-50 to-[#FAFAF8] rounded-2xl border border-blue-100 p-5 space-y-4"
      >
        <div className="text-center space-y-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto"
          >
            <Award size={28} className="text-blue-500" />
          </motion.div>
          <h3 className="text-lg font-black text-[#3D3D38]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
            Feedback verstuurd!
          </h3>
          {xpAwarded && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-sm font-bold text-blue-500"
            >
              +25 XP verdiend!
            </motion.p>
          )}
          {earnedBadge && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="inline-flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 px-3 py-1.5 rounded-full"
            >
              <Award size={14} className="text-yellow-500" />
              <span className="text-xs font-bold text-yellow-700">Badge: Peer Reviewer</span>
            </motion.div>
          )}
        </div>

        {/* Show received feedback */}
        {receivedFeedback.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-bold text-[#3D3D38]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
              Feedback die jij hebt ontvangen:
            </p>
            {receivedFeedback.map(fb => (
              <ReceivedFeedbackCard key={fb.id} feedback={fb} />
            ))}
          </div>
        )}
      </motion.div>
    );
  }

  return null;
};
