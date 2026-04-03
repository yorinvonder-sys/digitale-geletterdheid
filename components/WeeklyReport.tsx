import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Target, Flame, TrendingUp } from 'lucide-react';
import { useWeeklyStats } from '../hooks/useWeeklyStats';

interface WeeklyReportProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const WeeklyReport: React.FC<WeeklyReportProps> = ({ userId, isOpen, onClose }) => {
  const { xpThisWeek, missionsThisWeek, currentStreak, loading } = useWeeklyStats(userId);

  // Calculate current week number (ISO week)
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(
    ((now.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-6 relative">
              <button
                onClick={onClose}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                aria-label="Sluiten"
              >
                <X size={16} />
              </button>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={20} className="text-white/80" />
                <span className="text-white/80 text-xs font-bold uppercase tracking-wider">
                  Week {weekNumber}
                </span>
              </div>
              <h2 className="text-white text-xl font-black">Jouw Weekoverzicht</h2>
            </div>

            {/* Stats */}
            <div className="p-6 space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-[3px] border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <StatBlock
                    icon={<Zap size={20} />}
                    value={xpThisWeek}
                    label="XP verdiend"
                    color="amber"
                  />
                  <StatBlock
                    icon={<Target size={20} />}
                    value={missionsThisWeek}
                    label="Missies voltooid"
                    color="emerald"
                  />
                  <StatBlock
                    icon={<Flame size={20} />}
                    value={currentStreak}
                    label={`Dag${currentStreak !== 1 ? 'en' : ''} streak`}
                    color="orange"
                  />
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const colorMap: Record<string, { bg: string; text: string; icon: string }> = {
  amber: { bg: 'bg-amber-50', text: 'text-amber-700', icon: 'text-amber-500' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: 'text-emerald-500' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-700', icon: 'text-orange-500' },
};

const StatBlock: React.FC<{
  icon: React.ReactNode;
  value: number;
  label: string;
  color: string;
}> = ({ icon, value, label, color }) => {
  const colors = colorMap[color] || colorMap.amber;
  return (
    <div className={`flex items-center gap-4 px-4 py-3 rounded-2xl ${colors.bg}`}>
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors.icon} bg-white shadow-sm`}
      >
        {icon}
      </div>
      <div>
        <p className={`text-2xl font-black ${colors.text}`}>{value}</p>
        <p className="text-xs font-medium text-slate-500">{label}</p>
      </div>
    </div>
  );
};
