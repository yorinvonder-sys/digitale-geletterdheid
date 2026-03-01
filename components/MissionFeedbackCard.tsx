import React from 'react';
import { getMissionBadge, getFeedbackMessage, getScoreColor, getBadgeGradient, type FeedbackConfig } from '../utils/feedbackPatterns';

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
    <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
      {/* Badge header */}
      <div className={`bg-gradient-to-r ${getBadgeGradient(badge.tier)} p-6 text-center text-white`}>
        <div className="text-5xl mb-2">{badge.emoji}</div>
        <h3 className="text-xl font-bold">{badge.label} Badge</h3>
        <p className="text-white/90 text-sm mt-1">{config.missionTitle}</p>
      </div>

      {/* Score */}
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-slate-600 font-medium">Score</span>
          <span className={`text-2xl font-bold ${getScoreColor(score, config)}`}>{score}/{maxScore}</span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 rounded-full h-3">
          <div
            className={`bg-gradient-to-r ${getBadgeGradient(badge.tier)} h-3 rounded-full transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <p className="text-slate-700">{message}</p>

        {/* Feedback sections */}
        {whatWentWell && (
          <div className="bg-green-50 rounded-xl p-4">
            <h4 className="font-semibold text-green-800 mb-1">Wat ging goed</h4>
            <p className="text-green-700 text-sm">{whatWentWell}</p>
          </div>
        )}

        {improvementPoint && (
          <div className="bg-amber-50 rounded-xl p-4">
            <h4 className="font-semibold text-amber-800 mb-1">Verbeterpunt</h4>
            <p className="text-amber-700 text-sm">{improvementPoint}</p>
          </div>
        )}

        {nextStep && (
          <div className="bg-indigo-50 rounded-xl p-4">
            <h4 className="font-semibold text-indigo-800 mb-1">Volgende stap</h4>
            <p className="text-indigo-700 text-sm">{nextStep}</p>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
