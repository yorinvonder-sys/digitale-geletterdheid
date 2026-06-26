# DGSkills Supabase Migration Reconciliation - 2026-06-26

## Summary

Verdict: do not run `supabase db push` yet.

The remote migration-history problem is now split into three buckets:

- `local_only_ignore`: local bootstrap only, not a normal production migration.
- `already_live_mark_repair`: live schema already has the final effect, so a
  history repair can be considered for that version.
- `not_live_apply`: live schema is missing all or part of the migration, so do
  not repair it as applied.

One extra tooling bucket is used for the known short-version CLI display issue:

- `cli_pair_normalized`: local and remote both have the same short version and
  migration name, but `supabase migration list --linked` prints it as separate
  local-only and remote-only rows.

## Evidence Used

Read-only checks run on 2026-06-26:

```bash
npm run check:supabase:remote-migrations
npx supabase db dump --linked --schema public --file /private/tmp/dgskills-public-schema-20260626.sql
npx supabase db dump --linked --schema supabase_migrations --data-only --file /private/tmp/dgskills-migration-history-20260626.sql
```

The schema dump is schema-only for `public`; it does not dump learner rows. The
migration-history dump contains Supabase migration metadata only.

History repair performed on 2026-06-26:

```bash
npx supabase migration repair --linked --status applied 20260510071518 20260607095122
npx supabase db query --linked --file supabase/migrations/20260626143000_reconcile_profiles_view_for_remote_migrations.sql
npx supabase migration repair --linked --status applied 20260626143000
npx supabase db query --linked --file supabase/migrations/20260509165657_wellbeing_alerts.sql
npx supabase migration repair --linked --status applied 20260509165657
npx supabase db query --linked --file supabase/migrations/20260626144000_reconcile_core_auth_rls_for_remote_schema.sql
npx supabase migration repair --linked --status applied 20260626144000 20260509165658
```

Result:

- `20260510071518` is now recorded as applied remotely.
- `20260607095122` is now recorded as applied remotely.
- `20260626143000` created the missing `public.profiles` compatibility view and
  is recorded as applied remotely.
- `20260509165657` created `public.wellbeing_alerts` and is recorded as applied
  remotely.
- `20260626144000` applied the core auth/RLS reconciliation with text-safe
  audit-log casts, and `20260509165658` is recorded as applied-equivalent.
- The later remote apply paused after `20260515165303` failed on another
  `text = uuid` live-shape drift. A new local reconciliation migration
  `20260626145000_reconcile_missing_app_tables_for_remote_schema.sql` was added,
  but not yet applied remotely.

## Reconciliation Matrix

| Version | Migration | Classification | Evidence | Decision |
| --- | --- | --- | --- | --- |
| `20260220000000` | `schema_baseline` | `local_only_ignore` | Local file says it is a minimal baseline for fresh local Supabase databases. | Do not apply to production as a normal migration. The checker allows it explicitly. |
| `20260221` | `add_data_retention_policies` | `cli_pair_normalized` | Remote history has version `20260221` with name `add_data_retention_policies`; local filename has the same short version and name. | Treat as OK in the checker, but keep real local-only migrations red. |
| `20260509165657` | `wellbeing_alerts` | `not_live_apply` | Initial live schema dump had no `public.wellbeing_alerts` table and no `public.log_wellbeing_alert` function. The first direct apply failed because `public.profiles` was missing. | Applied after `20260626143000`; repaired as applied on 2026-06-26. |
| `20260509165658` | `security_report_core_auth_rls` | `not_live_apply` | Direct apply failed because live `public.audit_logs.uid` is `text` while the old migration compared it to `auth.uid()` as uuid. | Applied-equivalent through `20260626144000`; repaired as applied on 2026-06-26. |
| `20260510071518` | `add_ai_usage_events` | `already_live_mark_repair` | Live schema has `public.ai_usage_events`, its indexes, comments, grants, and RLS policies. Remote history also has later `20260623114643_restore_ai_usage_events`, which restores the final live AI usage shape. | Repaired as applied on 2026-06-26. |
| `20260515165303` | `restore_missing_app_tables` | `not_live_apply` | Live schema has some tables from this migration, but is missing others such as `developer_milestones`, `developer_settings`, `bomberman_lobbies`, `feedback`, `xp_abuse_logs`, and `teacher_message_reads`. Direct apply failed because some existing live user-id columns are `text` while the old migration policies compare them to `auth.uid()` as uuid. | Pending. Use `20260626145000_reconcile_missing_app_tables_for_remote_schema.sql`, verify the `teacher_messages` backfill cast, then apply and repair. |
| `20260515181220` | `advisor_warning_hardening` | `not_live_apply` | Live schema still has duplicate indexes `idx_mission_progress_user_mission` and `idx_shared_games_school_class_ts`. | Apply forward later. Do not repair as already applied. |
| `20260607095122` | `complete_mission_rpc` | `already_live_mark_repair` | Live schema has `public.mark_mission_completed(text)` with the expected body. | Repaired as applied on 2026-06-26. |
| `20260623114643` | `restore_ai_usage_events` | already remote | Remote history has this version with name `restore_ai_usage_events`; the local migration was fetched into the repo. | No repair needed. |
| `20260625151836` | `enforce_processing_restriction` | `not_live_apply` | Live schema has no `public.current_user_processing_restricted()` function and still has old `mission_progress_owner_insert/update` policies. | Apply forward after history repair. Do not claim live processing restriction yet. |
| `20260626120000` | `harden_game_permissions_hybrid_assessments_rls` | `not_live_apply` | Live schema still has old policy names such as `game_permissions_modify`, `game_permissions_read_scoped`, `hybrid_assessments_insert`, and `hybrid_assessments_select`; the new policy names are absent. | Apply forward after history repair. Do not claim RLS hardening live yet. |
| `20260626143000` | `reconcile_profiles_view_for_remote_migrations` | `already_live_mark_repair` | Added because live lacked `public.profiles`, which older wellbeing policies expected; local baseline already creates this view. | Applied and repaired as applied on 2026-06-26. |
| `20260626144000` | `reconcile_core_auth_rls_for_remote_schema` | `already_live_mark_repair` | Added because live `public.audit_logs.uid` is `text`; policy casts make the intended RLS shape work on both text and uuid histories. | Applied and repaired as applied on 2026-06-26. |
| `20260626145000` | `reconcile_missing_app_tables_for_remote_schema` | `not_live_apply` | Added because `20260515165303` direct apply failed on live text-vs-uuid policy drift. | Local only for now. Needs one read-only `teacher_messages.target_id` cast check before remote apply. |

## Safe Next Order

1. Completed: repaired only the proven `already_live_mark_repair` versions:

```bash
npx supabase migration repair --linked --status applied 20260510071518 20260607095122
```

2. Completed: reran:

```bash
npm run check:supabase:remote-migrations
```

3. Remaining known local-only rows after the completed repairs are expected to
   include:

- `20260515165303`
- `20260515181220`
- `20260625151836`
- `20260626120000`
- `20260626145000`

4. Apply those
   migrations through a reviewed forward-only path. Do not use a blind
   `supabase db push` while the baseline and mixed-history state can still make
   the CLI choose the wrong pending set.

Blocked note: applying `20260626145000` should wait for one read-only check that
`public.teacher_messages` has no invalid UUID `target_id` values for
`target_type = 'student'`. The remote query was not completed in this run because
the Codex approval/usage limit was reached.

5. Rerun:

```bash
npm run check:supabase:remote-migrations
npm run check:rls:throwaway
npm run security:check
npm run check:legal
```

6. Only after those are green, deploy affected Edge Functions and then Vercel
   production.
