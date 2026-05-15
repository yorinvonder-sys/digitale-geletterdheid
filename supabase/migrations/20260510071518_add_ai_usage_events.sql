-- Privacy-safe AI usage telemetry.
-- Stores request/token counters only. Never store prompts, messages, model
-- outputs, images, or API keys in this table.

create table if not exists public.ai_usage_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  request_id text not null,
  user_id uuid references auth.users(id) on delete set null,
  school_id text,
  endpoint text not null,
  provider text not null default 'google-vertex',
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

alter table public.ai_usage_events enable row level security;

revoke all on public.ai_usage_events from anon, authenticated;
grant select on public.ai_usage_events to authenticated;
grant insert on public.ai_usage_events to service_role;
grant select, update, delete on public.ai_usage_events to service_role;

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
