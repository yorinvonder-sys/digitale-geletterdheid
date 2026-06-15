import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ThumbsUp, ThumbsDown, User } from 'lucide-react';
import { PeerFeedbackRecord, voteHelpful } from '@/services/peerFeedbackService';

interface Props {
  feedback: PeerFeedbackRecord;
  onVoted?: () => void;
}

const criteriaLabels: Record<string, string> = {
  duidelijkheid: 'Duidelijkheid',
  creativiteit: 'Creativiteit',
  volledigheid: 'Volledigheid',
};

export const ReceivedFeedbackCard: React.FC<Props> = ({ feedback, onVoted }) => {
  const [voting, setVoting] = useState(false);
  const [localVote, setLocalVote] = useState<boolean | null>(feedback.helpfulVote);
  const [voteError, setVoteError] = useState(false);

  const avgScore = feedback.criteria
    ? Math.round(
        ((feedback.criteria.duidelijkheid || 0) +
          (feedback.criteria.creativiteit || 0) +
          (feedback.criteria.volledigheid || 0)) / 3 * 10
      ) / 10
    : feedback.rating;

  const handleVote = async (helpful: boolean) => {
    if (voting || localVote !== null) return;
    setVoting(true);
    setVoteError(false);
    try {
      await voteHelpful(feedback.id, helpful);
      setLocalVote(helpful);
      onVoted?.();
    } catch {
      setVoteError(true);
      setTimeout(() => setVoteError(false), 3000);
    } finally {
      setVoting(false);
    }
  };

  const renderStars = (count: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={12}
          className={i <= count ? 'text-duck-acid fill-duck-acid' : 'text-duck-gray'}
        />
      ))}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-duck-gray p-4 space-y-3"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
            <User size={14} className="text-duck-ink/60" />
          </div>
          <span className="text-sm font-bold text-duck-ink/60" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
            Klasgenoot
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full">
          <Star size={12} className="text-duck-acid fill-duck-acid" />
          <span className="text-xs font-bold text-duck-ink/60">{avgScore}</span>
        </div>
      </div>

      {/* Criteria scores */}
      <div className="grid grid-cols-3 gap-2">
        {Object.entries(feedback.criteria || {}).map(([key, value]) => (
          <div key={key} className="text-center">
            <p className="text-[10px] text-duck-ink/60 mb-0.5">{criteriaLabels[key] || key}</p>
            {renderStars(value as number)}
          </div>
        ))}
      </div>

      {/* Feedback text */}
      <p className="text-sm text-duck-ink/60 leading-relaxed bg-duck-bg rounded-xl p-3" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
        {feedback.feedbackText}
      </p>

      {/* Helpful vote */}
      {localVote === null ? (
        <div className="flex items-center gap-2 pt-1">
          <span className="text-xs text-duck-ink/60">Was deze feedback nuttig?</span>
          <button
            onClick={() => handleVote(true)}
            disabled={voting}
            className="p-1.5 rounded-lg hover:bg-duck-ink/10 text-duck-ink/60 hover:text-duck-ink transition-colors disabled:opacity-50"
          >
            <ThumbsUp size={14} />
          </button>
          <button
            onClick={() => handleVote(false)}
            disabled={voting}
            className="p-1.5 rounded-lg hover:bg-duck-error/10 text-duck-ink/60 hover:text-duck-error transition-colors disabled:opacity-50"
          >
            <ThumbsDown size={14} />
          </button>
          {voteError && (
            <span className="text-xs text-duck-error font-medium ml-1">Stem niet opgeslagen</span>
          )}
        </div>
      ) : (
        <p className="text-xs text-[#99984D] pt-1">
          {localVote ? 'Bedankt voor je stem!' : 'Bedankt, we houden er rekening mee.'}
        </p>
      )}
    </motion.div>
  );
};
