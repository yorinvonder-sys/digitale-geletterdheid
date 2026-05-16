-- Migration: internal-docs private storage bucket
-- Purpose: serve strategy/compliance/security markdown docs to developer and admin roles only.
-- Auth model: Supabase Storage RLS on storage.objects, checking app_metadata role in JWT.
-- Read-only for authenticated privileged users; writes happen via service role (upload script).

-- 1. Create the private bucket (idempotent)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
    'internal-docs',
    'internal-docs',
    false,
    10485760, -- 10 MB per file
    array['text/markdown', 'text/plain', 'application/pdf']
)
on conflict (id) do nothing;
-- 2. RLS is already enabled on storage.objects by default in Supabase.
--    We add bucket-scoped policies for this specific bucket.

-- 3. SELECT policy: only developer or admin role (from app_metadata) may read.
drop policy if exists "internal_docs_read_privileged" on storage.objects;
create policy "internal_docs_read_privileged"
on storage.objects
for select
to authenticated
using (
    bucket_id = 'internal-docs'
    and coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') in ('developer', 'admin')
);
-- 4. No INSERT/UPDATE/DELETE policies for anon or authenticated users.
--    All writes must go through the service role (which bypasses RLS).
--    This keeps the "sync" workflow server-side only.

-- 5. Sanity check: make sure bucket is still private
update storage.buckets
set public = false
where id = 'internal-docs' and public = true;
