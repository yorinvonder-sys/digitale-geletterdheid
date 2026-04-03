import React, { useEffect, useState } from 'react';
import { Flame } from 'lucide-react';
import { updateStreak, StreakData } from '../services/streakService';

interface StreakBadgeProps {
  userId: string;
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({ userId }) => {
  const [streak, setStreak] = useState<number>(0);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    let mounted = true;
    updateStreak(userId).then((data) => {
      if (mounted && data) {
        setStreak(data.current_streak);
        if (data.updated) setAnimate(true);
      }
    });
    return () => { mounted = false; };
  }, [userId]);

  useEffect(() => {
    if (animate) {
      const t = setTimeout(() => setAnimate(false), 1000);
      return () => clearTimeout(t);
    }
  }, [animate]);

  if (streak <= 0) return null;

  return (
    <div className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-orange-50 border border-orange-200 transition-transform ${animate ? 'scale-110' : 'scale-100'}`}>
      <Flame size={16} className={`text-orange-500 ${animate ? 'animate-bounce' : ''}`} />
      <span className="text-xs font-black text-orange-700">{streak}</span>
      <span className="text-[9px] font-medium text-orange-400 hidden sm:inline">dag{streak !== 1 ? 'en' : ''}</span>
    </div>
  );
};
