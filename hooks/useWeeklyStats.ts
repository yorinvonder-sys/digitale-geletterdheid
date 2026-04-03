import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export interface WeeklyStats {
  xpThisWeek: number;
  missionsThisWeek: number;
  currentStreak: number;
  loading: boolean;
}

export function useWeeklyStats(userId: string | undefined): WeeklyStats {
  const [stats, setStats] = useState<WeeklyStats>({
    xpThisWeek: 0,
    missionsThisWeek: 0,
    currentStreak: 0,
    loading: true,
  });

  useEffect(() => {
    if (!userId) return;
    let mounted = true;

    async function fetchStats() {
      // Get Monday of current week
      const now = new Date();
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(now.getFullYear(), now.getMonth(), diff);
      monday.setHours(0, 0, 0, 0);
      const mondayISO = monday.toISOString();

      // Parallel fetch: XP transactions this week + profile streak
      const [xpResult, profileResult] = await Promise.all([
        supabase
          .from('xp_transactions')
          .select('amount')
          .eq('user_id', userId)
          .gte('created_at', mondayISO),
        supabase
          .from('profiles')
          .select('current_streak')
          .eq('id', userId)
          .single(),
      ]);

      if (!mounted) return;

      const xpThisWeek = (xpResult.data || []).reduce(
        (sum: number, t: { amount: number }) => sum + t.amount,
        0
      );
      // Mission completions award 50+ XP
      const missionsThisWeek = (xpResult.data || []).filter(
        (t: { amount: number }) => t.amount >= 50
      ).length;
      const currentStreak = profileResult.data?.current_streak || 0;

      setStats({ xpThisWeek, missionsThisWeek, currentStreak, loading: false });
    }

    fetchStats();
    return () => {
      mounted = false;
    };
  }, [userId]);

  return stats;
}
