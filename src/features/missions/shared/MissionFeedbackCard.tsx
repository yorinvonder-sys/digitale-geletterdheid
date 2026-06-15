import React from 'react';
import { getMissionBadge, getFeedbackMessage, getScoreColor, getBadgeGradient, type FeedbackConfig } from '@/utils/feedbackPatterns';

interface MissionFeedbackCardProps {
  score: number;
  config: FeedbackConfig;
  whatWentWell?: string;
  improvementPoint?: string;
  nextStep?: string;
  children?: React.ReactNode;
}

export function MissionFeedbackCard({ score, config, whatWentWell, improvementPoint, nextStep, children }: MissionFeedbackCardProps) {
  const badge = getMissionBadge(score, config);
  const message = getFeedbackMessage(score, config);
  const maxScore = config.maxScore ?? 100;
  const percentage = Math.round((score / maxScore) * 100);

  return (
    <div className="bg-white rounded-[1.6rem] shadow-lg border border-duck-ink/15 overflow-hidden">
      {/* Badge header */}
      <div className={`bg-gradient-to-r ${getBadgeGradient(badge.tier)} p-6 text-center text-white`}>
        <div className="text-5xl mb-2">{badge.emoji}</div>
        <h3 className="text-xl font-bold" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>{badge.label} Badge</h3>
        <p className="text-white/90 text-sm mt-1" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{config.missionTitle}</p>
      </div>

      {/* Score */}
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-duck-ink font-medium" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Score</span>
          <span className={`text-2xl font-bold ${getScoreColor(score, config)}`}>{score}/{maxScore}</span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-duck-bg rounded-full h-3">
          <div
            className="bg-gradient-to-r from-duck-acid to-duck-ink h-3 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <p className="text-duck-ink" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{message}</p>

        {/* Feedback sections */}
        {whatWentWell && (
          <div className="bg-duck-ink/10 rounded-2xl p-4 border border-duck-ink/20">
            <h4 className="font-semibold text-duck-ink mb-1" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>Wat ging goed</h4>
            <p className="text-duck-ink text-sm" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{whatWentWell}</p>
          </div>
        )}

        {improvementPoint && (
          <div className="bg-duck-acid/10 rounded-2xl p-4 border border-duck-acid/20">
            <h4 className="font-semibold text-duck-ink mb-1" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>Verbeterpunt</h4>
            <p className="text-duck-ink text-sm" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{improvementPoint}</p>
          </div>
        )}

        {nextStep && (
          <div className="bg-duck-ink/10 rounded-2xl p-4 border border-duck-ink/20">
            <h4 className="font-semibold text-duck-ink mb-1" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>Volgende stap</h4>
            <p className="text-duck-ink text-sm" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{nextStep}</p>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
