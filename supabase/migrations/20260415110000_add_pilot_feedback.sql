-- =============================================================================
-- Fase F — Pilot Operatie: feedback van docenten tijdens pilot
-- =============================================================================
-- Doel: Verzamel NPS-scores en vrije feedback van docenten/pilotdeelnemers.
-- RLS:
--   - Docenten zien alleen hun eigen feedback.
--   - Bevoorrechte schoolrollen (developer, ict-coordinator, teamleider, directie)
--     zien de feedback van hun eigen school.
--   - Platform-developer (role='developer' in app_metadata) ziet alles.
--   - Insert/update via service_role (edge function).
-- AVG: feedback_text mag geen persoonsgegevens van leerlingen bevatten
--      (client-zijde begeleid; server-zijde geen extra controle vereist).
-- Bewaartermijn: 3 jaar (AVG Art. 5(1)(e)); opruiming via bestaande cron-infra.
-- =============================================================================

create table if not exists public.pilot_feedback (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  teacher_uid    uuid not null,
  school_id      uuid,
  role           text check (role in ('docent', 'ict-coordinator', 'teamleider', 'directie', 'anders')),
  nps_score      smallint check (nps_score between 0 and 10),
  feedback_text  text,
  category       text check (category in ('ui', 'content', 'compliance', 'performance', 'onboarding', 'other')) not null default 'other',
  status         text check (status in ('new', 'reviewed', 'addressed', 'archived')) not null default 'new',
  ip_address     text,
  constraint feedback_text_length check (feedback_text is null or char_length(feedback_text) <= 4000),
  constraint at_least_one_signal check (
    nps_score is not null
    or (feedback_text is not null and char_length(feedback_text) > 0)
  )
);

alter table public.pilot_feedback enable row level security;

-- ---------------------------------------------------------------------------
-- SELECT: eigen feedback + privileged-rol eigen school + platform-developer
-- ---------------------------------------------------------------------------
create policy "users_read_own_school_feedback"
  on public.pilot_feedback for select
  using (
    -- Iedereen ziet zijn eigen feedback
    teacher_uid = auth.uid()
    -- Bevoorrechte schoolrollen zien alles van hun school
    or exists (
      select 1
      from public.users u
      where u.id = auth.uid()
        and u.role in ('developer', 'ict-coordinator', 'teamleider', 'directie')
        and (
          -- developer ziet alle feedback (schoolbreed)
          u.role = 'developer'
          -- overige privileged rollen: alleen eigen school
          or (u.school_id::uuid = pilot_feedback.school_id and pilot_feedback.school_id is not null)
        )
    )
  );

-- ---------------------------------------------------------------------------
-- INSERT: via service_role (edge function) — geen client-directe insert
-- ---------------------------------------------------------------------------
create policy "service_role_insert_feedback"
  on public.pilot_feedback for insert
  with check (current_setting('role', true) = 'service_role');

-- ---------------------------------------------------------------------------
-- UPDATE/DELETE: platform-developer en service_role voor statusbeheer
-- ---------------------------------------------------------------------------
create policy "developer_manage_feedback"
  on public.pilot_feedback for update
  using (
    current_setting('role', true) = 'service_role'
    or exists (
      select 1
      from public.users u
      where u.id = auth.uid()
        and u.role = 'developer'
    )
  );

create policy "developer_archive_feedback"
  on public.pilot_feedback for delete
  using (current_setting('role', true) = 'service_role');

-- ---------------------------------------------------------------------------
-- Indexen voor performante queries
-- ---------------------------------------------------------------------------
create index if not exists pilot_feedback_school_idx
  on public.pilot_feedback(school_id, created_at desc);

create index if not exists pilot_feedback_status_idx
  on public.pilot_feedback(status);

create index if not exists pilot_feedback_teacher_uid_idx
  on public.pilot_feedback(teacher_uid);

create index if not exists pilot_feedback_created_at_idx
  on public.pilot_feedback(created_at desc);
