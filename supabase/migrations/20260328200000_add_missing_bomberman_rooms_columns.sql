-- Add missing columns to bomberman_rooms that the game code expects
ALTER TABLE public.bomberman_rooms
  ADD COLUMN IF NOT EXISTS grid jsonb,
  ADD COLUMN IF NOT EXISTS bombs jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS explosions jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS winner_id text,
  ADD COLUMN IF NOT EXISTS force_started boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS force_started_by text;
