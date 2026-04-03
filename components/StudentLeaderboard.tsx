import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X } from 'lucide-react';
import { supabase } from '../services/supabase';

interface StudentLeaderboardProps {
  userId: string;
  schoolId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface LeaderboardEntry {
  id: string;
  display_name: string;
  xp: number;
  rank: number;
}

const MEDAL_COLORS = [
  'bg-yellow-400 text-yellow-900',
  'bg-slate-300 text-slate-700',
  'bg-orange-400 text-orange-900',
];

const ROW_BG = [
  'bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-200',
  'bg-slate-50 border border-slate-200',
  'bg-orange-50 border border-orange-200',
];

const MEDALS = ['🥇', '🥈', '🥉'];

export const StudentLeaderboard: React.FC<StudentLeaderboardProps> = ({
  userId,
  schoolId,
  isOpen,
  onClose,
}) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    let mounted = true;
    setLoading(true);
    setError(false);

    async function fetchLeaderboard() {
      // Query users in same school ordered by stats->xp (JSON path)
      const { data, error: fetchError } = await supabase
        .from('users')
        .select('id, display_name, stats')
        .eq('school_id', schoolId)
        .eq('role', 'student')
        .limit(50);

      if (!mounted) return;

      if (fetchError || !data) {
        setError(true);
        setLoading(false);
        return;
      }

      const ranked = data
        .map((d) => ({
          id: d.id,
          display_name: d.display_name || 'Anoniem',
          xp: ((d.stats as any)?.xp as number) || 0,
        }))
        .sort((a, b) => b.xp - a.xp)
        .slice(0, 10)
        .map((d, i) => ({ ...d, rank: i + 1 }));

      setEntries(ranked);
      setLoading(false);
    }

    fetchLeaderboard();
    return () => {
      mounted = false;
    };
  }, [isOpen, schoolId]);

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
            <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-400 p-6 relative">
              <button
                onClick={onClose}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                aria-label="Sluiten"
              >
                <X size={16} />
              </button>
              <div className="flex items-center gap-2 mb-1">
                <Trophy size={20} className="text-white/90" />
                <p className="text-white/80 text-sm font-semibold uppercase tracking-wider">Jouw school</p>
              </div>
              <h2 className="text-2xl font-black text-white">Klassement</h2>
              <p className="text-white/70 text-xs mt-0.5">Top 10 leerlingen op basis van XP</p>
            </div>

            {/* Body */}
            <div className="p-4">
              {loading && (
                <div className="flex flex-col items-center justify-center py-10 gap-3 text-slate-400">
                  <div className="w-8 h-8 border-2 border-amber-300 border-t-amber-500 rounded-full animate-spin" />
                  <span className="text-sm">Laden…</span>
                </div>
              )}

              {!loading && error && (
                <p className="text-center text-slate-400 text-sm py-8">
                  Klassement kon niet worden geladen.
                </p>
              )}

              {!loading && !error && entries.length === 0 && (
                <p className="text-center text-slate-400 text-sm py-8">
                  Nog geen leerlingen gevonden.
                </p>
              )}

              {!loading && !error && entries.length > 0 && (
                <div className="grid gap-2">
                  {entries.map((entry) => {
                    const isMe = entry.id === userId;
                    const rowClass =
                      entry.rank <= 3
                        ? ROW_BG[entry.rank - 1]
                        : isMe
                        ? 'bg-indigo-50 border-2 border-indigo-300'
                        : 'bg-white border border-slate-100';
                    const badgeClass =
                      entry.rank <= 3
                        ? MEDAL_COLORS[entry.rank - 1]
                        : 'bg-slate-100 text-slate-500';

                    return (
                      <div
                        key={entry.id}
                        className={`flex items-center gap-3 p-3 rounded-xl ${rowClass}`}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm flex-shrink-0 ${badgeClass}`}
                        >
                          {entry.rank}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-slate-900 text-sm truncate">
                            {entry.display_name}
                            {isMe && (
                              <span className="ml-2 text-[10px] font-extrabold text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded-full">
                                jij
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <span className="font-black text-slate-900 text-sm">{entry.xp} XP</span>
                          {entry.rank <= 3 && (
                            <span className="text-lg leading-none">{MEDALS[entry.rank - 1]}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <p className="text-center text-slate-400 text-[10px] mt-4">
                Alleen weergavenamen zichtbaar — geen e-mailadressen of andere persoonsgegevens
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
