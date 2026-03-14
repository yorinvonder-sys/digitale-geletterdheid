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
    <div className="bg-white rounded-2xl shadow-lg border border-[#E8E6DF] overflow-hidden">
      {/* Badge header */}
      <div className={`bg-gradient-to-r ${getBadgeGradient(badge.tier)} p-6 text-center text-white`}>
        <div className="text-5xl mb-2">{badge.emoji}</div>
        <h3 className="text-xl font-bold" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>{badge.label} Badge</h3>
        <p className="text-white/90 text-sm mt-1" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{config.missionTitle}</p>
      </div>

      {/* Score */}
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[#3D3D38] font-medium" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Score</span>
          <span className={`text-2xl font-bold ${getScoreColor(score, config)}`}>{score}/{maxScore}</span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-[#F0EEE8] rounded-full h-3">
          <div
            className="bg-gradient-to-r from-[#D97757] to-[#C46849] h-3 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <p className="text-[#3D3D38]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{message}</p>

        {/* Feedback sections */}
        {whatWentWell && (
          <div className="bg-[#10B981]/10 rounded-2xl p-4 border border-[#10B981]/20">
            <h4 className="font-semibold text-[#10B981] mb-1" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>Wat ging goed</h4>
            <p className="text-[#3D3D38] text-sm" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{whatWentWell}</p>
          </div>
        )}

        {improvementPoint && (
          <div className="bg-[#D97757]/10 rounded-2xl p-4 border border-[#D97757]/20">
            <h4 className="font-semibold text-[#D97757] mb-1" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>Verbeterpunt</h4>
            <p className="text-[#3D3D38] text-sm" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{improvementPoint}</p>
          </div>
        )}

        {nextStep && (
          <div className="bg-[#2A9D8F]/10 rounded-2xl p-4 border border-[#2A9D8F]/20">
            <h4 className="font-semibold text-[#2A9D8F] mb-1" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>Volgende stap</h4>
            <p className="text-[#3D3D38] text-sm" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{nextStep}</p>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
