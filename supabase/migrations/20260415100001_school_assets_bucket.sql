-- ===========================================================================
-- school-assets Storage Bucket — Self-Service Huisstijl Assets
--
-- Bevat geuploade logo's, mascots en favicons per school.
-- Public-read (nodig voor <img src> zonder signed URLs in student-views),
-- write alleen via branding-admin van de eigen school.
--
-- Pad-conventie (afgedwongen door folder-prefix check in policy):
--   <school_id>/logo-<8-char-hash>.webp
--   <school_id>/mascot-<8-char-hash>.webp
--   <school_id>/favicon-<8-char-hash>.webp
--
-- Security:
--   - GEEN SVG (XSS-risico: kan <script> bevatten).
--   - 2 MiB cap tegen DoS + storage-kosten.
--   - Folder-prefix match voorkomt dat school A bestanden in school B's map schrijft.
--   - Edge function 'validate-school-asset' doet extra server-side magic-byte
--     check en re-encoding om metadata te strippen (in latere fase).
-- ===========================================================================

-- ── 1. Bucket aanmaken (idempotent) ────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'school-assets',
    'school-assets',
    true,                                   -- public read (student-views)
    2097152,                                -- 2 MiB per bestand
    ARRAY['image/png', 'image/jpeg', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;
-- Verdediging-in-diepte: als het bucket-record ooit met verkeerde waarden is
-- aangemaakt, corrigeer naar onze policy (alleen als afwijkend).
UPDATE storage.buckets
SET public = true,
    file_size_limit = 2097152,
    allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/webp']
WHERE id = 'school-assets'
  AND (
      public IS DISTINCT FROM true
      OR file_size_limit IS DISTINCT FROM 2097152
      OR allowed_mime_types IS DISTINCT FROM ARRAY['image/png', 'image/jpeg', 'image/webp']::text[]
  );
-- ── 2. RLS policies op storage.objects (bucket-scoped) ─────────────────────
-- RLS is in Supabase standaard aan op storage.objects. We voegen
-- bucket-specifieke policies toe.

-- SELECT: publiek (bucket.public=true regelt de anon-toegang al, maar we
-- maken het expliciet voor geauthenticeerde gebruikers zodat de intent
-- zichtbaar is in de policy-lijst).
DROP POLICY IF EXISTS "school_assets_select_public" ON storage.objects;
CREATE POLICY "school_assets_select_public"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'school-assets');
-- INSERT: alleen branding-admin van eigen school; pad-prefix moet het
-- school_id van de caller zijn. Voorkomt cross-school writes.
DROP POLICY IF EXISTS "school_assets_insert_admin_own_school" ON storage.objects;
CREATE POLICY "school_assets_insert_admin_own_school"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'school-assets'
        AND (storage.foldername(name))[1] = public.get_caller_school_id()
        AND public.is_branding_admin()
    );
-- UPDATE: zelfde eisen (overwriten van bestaand pad bij nieuwe upload).
DROP POLICY IF EXISTS "school_assets_update_admin_own_school" ON storage.objects;
CREATE POLICY "school_assets_update_admin_own_school"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'school-assets'
        AND (storage.foldername(name))[1] = public.get_caller_school_id()
        AND public.is_branding_admin()
    )
    WITH CHECK (
        bucket_id = 'school-assets'
        AND (storage.foldername(name))[1] = public.get_caller_school_id()
        AND public.is_branding_admin()
    );
-- DELETE: zelfde eisen.
DROP POLICY IF EXISTS "school_assets_delete_admin_own_school" ON storage.objects;
CREATE POLICY "school_assets_delete_admin_own_school"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'school-assets'
        AND (storage.foldername(name))[1] = public.get_caller_school_id()
        AND public.is_branding_admin()
    );
