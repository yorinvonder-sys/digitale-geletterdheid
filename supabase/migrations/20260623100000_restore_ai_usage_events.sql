-- ===========================================================================
-- Restore public.ai_usage_events — privacy-safe AI usage telemetry.
--
-- Why this migration exists
--   A full migration for this table already shipped
--   (20260510071518_add_ai_usage_events.sql), but the table is ABSENT from the
--   production database (verified via information_schema on 2026-06-23: the
--   public schema has ai_oversight_events / ai_beleid_feedback /
--   ai_beleid_surveys, but no ai_usage_events). It was lost around the same
--   incident that required 20260515165303_restore_missing_app_tables.sql, but
--   — unlike the core app tables — it was not included in that restore.
--
--   Consequence: every client.from("ai_usage_events").insert(...) in
--   supabase/functions/_shared/aiUsageLogger.ts fails silently (the error is
--   caught and only console.error'd). AI usage / observability logging
--   therefore persists NOTHING for any AI endpoint (chat, chatStream,
--   demo-chat, generateImage, scanReceipt, growthRecommendation,
--   getClassInsight, …) and any status (ok / error / blocked / rate_limited),
--   including the moderation-block logging from PR #142.
--
--   EU AI Act Art. 12 (record-keeping / logging) depends on this table.
--
-- Privacy
--   Stores request/token COUNTERS and small operational metadata only. Never
--   store prompts, messages, model outputs, images, or API keys here. The
--   column set mirrors exactly what logAiUsageEvent() inserts.
--
-- Idempotency / safety
--   Restore-style: safe whether the table is fully absent or partially present
--   (CREATE TABLE IF NOT EXISTS + ADD COLUMN IF NOT EXISTS + drop/create
--   policies). Review-first — NOT applied automatically by CI; apply via the
--   authenticated Supabase channel after merge.
-- ===========================================================================

create extension if not exists pgcrypto;

create table if not exists public.ai_usage_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  request_id text not null,
  user_id uuid references auth.users(id) on delete set null,
  school_id text,
  endpoint text not null,
  provider text not null default 'mistral',
  model text not null,
  status text not null check (status in ('ok', 'error', 'blocked', 'rate_limited')),
  input_chars integer not null default 0 check (input_chars >= 0),
  history_chars integer not null default 0 check (history_chars >= 0),
  game_context_chars integer not null default 0 check (game_context_chars >= 0),
  output_chars integer not null default 0 check (output_chars >= 0),
  prompt_tokens integer check (prompt_tokens is null or prompt_tokens >= 0),
  candidates_tokens integer check (candidates_tokens is null or candidates_tokens >= 0),
  total_tokens integer check (total_tokens is null or total_tokens >= 0),
  cached_tokens integer check (cached_tokens is null or cached_tokens >= 0),
  thinking_tokens integer check (thinking_tokens is null or thinking_tokens >= 0),
  image_count integer not null default 0 check (image_count >= 0),
  retry_count integer not null default 0 check (retry_count >= 0),
  fallback_used boolean not null default false,
  metadata jsonb not null default '{}'::jsonb
);

-- Defensive column alignment in case a partial/older table already exists.
-- Only nullable / defaulted columns are added here; the NOT NULL columns
-- without a default live in the CREATE TABLE above (adding those to a table
-- with pre-existing rows would fail, which is the impossible state here).
alter table public.ai_usage_events
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists school_id text,
  add column if not exists provider text not null default 'mistral',
  add column if not exists input_chars integer not null default 0,
  add column if not exists history_chars integer not null default 0,
  add column if not exists game_context_chars integer not null default 0,
  add column if not exists output_chars integer not null default 0,
  add column if not exists prompt_tokens integer,
  add column if not exists candidates_tokens integer,
  add column if not exists total_tokens integer,
  add column if not exists cached_tokens integer,
  add column if not exists thinking_tokens integer,
  add column if not exists image_count integer not null default 0,
  add column if not exists retry_count integer not null default 0,
  add column if not exists fallback_used boolean not null default false,
  add column if not exists metadata jsonb not null default '{}'::jsonb;

-- Correct the stale provider default if this table predates the Mistral switch
-- (the original migration defaulted to 'google-vertex'). The logger always
-- sends provider explicitly, so this only affects manual inserts.
alter table public.ai_usage_events alter column provider set default 'mistral';

comment on table public.ai_usage_events is
  'Privacy-safe AI usage telemetry with counters and operational metadata only.';
comment on column public.ai_usage_events.request_id is
  'Client-provided or server-generated id used to group retries and fallbacks.';
comment on column public.ai_usage_events.metadata is
  'Small operational metadata only. No natural-language content or binary data.';

create index if not exists ai_usage_events_created_idx
  on public.ai_usage_events (created_at desc);
create index if not exists ai_usage_events_request_idx
  on public.ai_usage_events (request_id);
create index if not exists ai_usage_events_user_created_idx
  on public.ai_usage_events (user_id, created_at desc);
create index if not exists ai_usage_events_school_created_idx
  on public.ai_usage_events (school_id, created_at desc);
create index if not exists ai_usage_events_endpoint_model_created_idx
  on public.ai_usage_events (endpoint, model, created_at desc);

-- ---------------------------------------------------------------------------
-- Row Level Security
--   - service_role (the edge functions' SUPABASE_SERVICE_ROLE_KEY) inserts.
--   - reads limited to the platform owner ('developer') globally and teachers
--     scoped to their own school. No student / anon access.
-- ---------------------------------------------------------------------------
alter table public.ai_usage_events enable row level security;

revoke all on public.ai_usage_events from anon, authenticated;
grant select on public.ai_usage_events to authenticated;
grant insert, select, update, delete on public.ai_usage_events to service_role;

drop policy if exists "ai_usage_events_read_trusted" on public.ai_usage_events;
create policy "ai_usage_events_read_trusted"
  on public.ai_usage_events
  for select
  to authenticated
  using (
    public.get_caller_app_role() = 'developer'
    or public.is_teacher_in_school(ai_usage_events.school_id::text)
  );

drop policy if exists "ai_usage_events_service_role_insert" on public.ai_usage_events;
create policy "ai_usage_events_service_role_insert"
  on public.ai_usage_events
  for insert
  to service_role
  with check (true);

drop policy if exists "ai_usage_events_service_role_update" on public.ai_usage_events;
create policy "ai_usage_events_service_role_update"
  on public.ai_usage_events
  for update
  to service_role
  using (true)
  with check (true);

drop policy if exists "ai_usage_events_service_role_delete" on public.ai_usage_events;
create policy "ai_usage_events_service_role_delete"
  on public.ai_usage_events
  for delete
  to service_role
  using (true);
