import { supabase } from './supabase';

export interface StreakData {
  current_streak: number;
  longest_streak: number;
  updated: boolean;
}

export async function updateStreak(userId: string): Promise<StreakData | null> {
  try {
    const { data, error } = await supabase.rpc('update_streak', { p_user_id: userId });
    if (error) {
      console.error('[Streak] Failed to update:', error.message);
      return null;
    }
    return data as StreakData;
  } catch (e) {
    console.error('[Streak] Unexpected error:', e);
    return null;
  }
}

export async function getStreak(userId: string): Promise<{ current_streak: number; longest_streak: number } | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('current_streak, longest_streak')
      .eq('id', userId)
      .single();
    if (error) return null;
    return data;
  } catch {
    return null;
  }
}
