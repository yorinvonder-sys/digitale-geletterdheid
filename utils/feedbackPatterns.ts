// Badge tier system
export type BadgeTier = 'bronze' | 'silver' | 'gold';

export interface FeedbackConfig {
  bronzeThreshold?: number;  // default 40
  silverThreshold?: number;  // default 70
  goldThreshold?: number;    // default 90
  maxScore?: number;         // default 100
  missionTitle: string;
}

export function getMissionBadge(score: number, config: FeedbackConfig): { tier: BadgeTier; emoji: string; label: string } {
  const gold = config.goldThreshold ?? 90;
  const silver = config.silverThreshold ?? 70;

  if (score >= gold) return { tier: 'gold', emoji: '🥇', label: 'Goud' };
  if (score >= silver) return { tier: 'silver', emoji: '🥈', label: 'Zilver' };
  return { tier: 'bronze', emoji: '🥉', label: 'Brons' };
}

export function getFeedbackMessage(score: number, config: FeedbackConfig): string {
  const { tier } = getMissionBadge(score, config);

  switch (tier) {
    case 'gold':
      return `Uitstekend werk! Je hebt ${config.missionTitle} met vlag en wimpel afgerond.`;
    case 'silver':
      return `Goed gedaan! Je hebt ${config.missionTitle} succesvol afgerond.`;
    case 'bronze':
      return `Je hebt ${config.missionTitle} voltooid. Er is nog ruimte voor verbetering!`;
  }
}

export function getScoreColor(score: number, config: FeedbackConfig): string {
  const { tier } = getMissionBadge(score, config);
  switch (tier) {
    case 'gold': return 'text-lab-gold';
    case 'silver': return 'text-lab-muted';
    case 'bronze': return 'text-lab-gold';
  }
}

export function getBadgeGradient(tier: BadgeTier): string {
  switch (tier) {
    case 'gold': return 'from-yellow-400 to-amber-500';
    case 'silver': return 'from-slate-300 to-slate-400';
    case 'bronze': return 'from-amber-600 to-amber-700';
  }
}
