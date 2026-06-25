# DGSkills Supabase Remote Migration Preflight - 2026-06-25

## Summary

Read-only remote migration verification was run after the Fase 3 processing-restriction work.

Verdict: **do not run `supabase db push` yet**.

The linked Supabase project is reachable and healthy, but remote migration history is not aligned with the local migration directory. Applying local migrations blindly could skip, duplicate, or overwrite assumptions from the remote database history.

## Read-Only Evidence

Commands run:

```bash
npx supabase projects list --output json
npx supabase migration list --linked
```

Observed linked project:

- Project name: DGSkills.app
- Region: `eu-west-1`
- Postgres: `17.6.1.063`
- Status: `ACTIVE_HEALTHY`

Relevant current Supabase platform note:

- Supabase announced that new public tables are not automatically exposed to the Data API; SQL-created public tables still need explicit role grants plus RLS. Source: https://supabase.com/changelog/45329-breaking-change-tables-not-exposed-to-data-and-graphql-api-automatically

## Migration Mismatch

Remote-only migrations reported by Supabase CLI:

- `20260221`
- `20260623114643`

Local-only migrations reported by Supabase CLI:

- `20260220000000`
- `20260221`
- `20260509165657`
- `20260509165658`
- `20260510071518`
- `20260515165303`
- `20260515181220`
- `20260607095122`
- `20260625151836`

Note: `20260221` appears as both remote-only and local-only in the CLI comparison output. Treat this as a migration-history divergence until confirmed manually; do not assume it is safe because the version text matches.

## What Is Safe Now

- Local clean-database replay passed with `npm run check:rls:throwaway`.
- The processing restriction RLS tests passed transactionally and rolled back.
- Local code/build checks passed after the fixes.
- No production data mutation was performed during this preflight.

## What Is Not Safe Yet

- Do not run `supabase db push`.
- Do not run migration repair commands against the remote project without a DBA/developer review.
- Do not mark Fase 3 live-enforced in production until the remote migration mismatch is reconciled and the live schema is verified.

## Recommended Next Step

1. Identify what remote migration `20260623114643` changed.
2. Decide whether the missing local migrations should be applied to remote, marked as repaired, or superseded by remote state.
3. Use a reviewed migration-repair plan before any remote mutation.
4. After reconciliation, rerun:

```bash
npm run check:supabase:remote-migrations
npm run check:rls:throwaway
```

## New Guard

Added:

```bash
npm run check:supabase:remote-migrations
```

This is a read-only preflight. It fails when local-only or remote-only migration rows are present and prints a "do not push" warning.
