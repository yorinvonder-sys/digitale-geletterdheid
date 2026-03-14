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
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      {/* Badge header */}
      <div className={`bg-gradient-to-r ${getBadgeGradient(badge.tier)} p-6 text-center text-white`}>
        <div className="text-5xl mb-2">{badge.emoji}</div>
        <h3 className="text-xl font-bold" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>{badge.label} Badge</h3>
        <p className="text-white/90 text-sm mt-1" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{config.missionTitle}</p>
      </div>

      {/* Score */}
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-lab-text font-medium" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Score</span>
          <span className={`text-2xl font-bold ${getScoreColor(score, config)}`}>{score}/{maxScore}</span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-lab-primary to-lab-primaryDark h-3 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <p className="text-lab-text" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{message}</p>

        {/* Feedback sections */}
        {whatWentWell && (
          <div className="bg-lab-green/10 rounded-2xl p-4 border border-lab-green/20">
            <h4 className="font-semibold text-lab-green mb-1" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>Wat ging goed</h4>
            <p className="text-lab-text text-sm" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{whatWentWell}</p>
          </div>
        )}

        {improvementPoint && (
          <div className="bg-lab-primary/10 rounded-2xl p-4 border border-lab-primary/20">
            <h4 className="font-semibold text-lab-primary mb-1" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>Verbeterpunt</h4>
            <p className="text-lab-text text-sm" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{improvementPoint}</p>
          </div>
        )}

        {nextStep && (
          <div className="bg-lab-accent/10 rounded-2xl p-4 border border-lab-accent/20">
            <h4 className="font-semibold text-lab-accent mb-1" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>Volgende stap</h4>
            <p className="text-lab-text text-sm" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{nextStep}</p>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
