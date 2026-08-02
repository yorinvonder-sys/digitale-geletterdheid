-- ===========================================================================
-- Avatar-winkel: server-side prijzenlijst + eigendomsregister.
--
-- Waarom: de aankoopflow rekende volledig in de browser. update_student_stats
-- neemt alles behalve xp/level klakkeloos over, dus een leerling kon zichzelf
-- elk item toekennen door een aangepaste inventory mee te sturen. De prijs
-- verhuist daarom naar de database en de aftrek naar een SECURITY DEFINER-
-- functie (zie 20260802090200).
--
-- AVG / dataminimalisatie: geen nieuwe categorie persoonsgegevens.
-- user_avatar_items bevat uitsluitend cosmetische spelvoortgang die vandaag al
-- in users.stats staat, aangevuld met de betaalde prijs — nodig als auditspoor
-- voor de XP-economie. Geen vrije tekst. Mislukte koop-pogingen worden bewust
-- NIET gelogd: dat zou gedragstelemetrie over minderjarigen zijn zonder
-- verwerkingsdoel. Bewaartermijn = accountduur; ON DELETE CASCADE dekt Art. 17.
-- ===========================================================================

-- --------------------------------------------------------------------------
-- 1. Prijzenlijst. Wordt beheerd via migraties (gegenereerd uit de TypeScript-
--    catalogus door scripts/sync-avatar-shop-seed.mjs), niet via de app.
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.avatar_shop_items (
  id         text PRIMARY KEY,
  slot       text    NOT NULL,
  value      text    NOT NULL,
  label      text    NOT NULL,
  price      integer NOT NULL,
  gender     text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active  boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DO $$
BEGIN
  ALTER TABLE public.avatar_shop_items
    ADD CONSTRAINT avatar_shop_items_id_format CHECK (id ~ '^[a-z0-9_]{1,64}$');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE public.avatar_shop_items
    ADD CONSTRAINT avatar_shop_items_price_range CHECK (price >= 0 AND price <= 100000);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE public.avatar_shop_items
    ADD CONSTRAINT avatar_shop_items_gender_valid
    CHECK (gender IS NULL OR gender IN ('male', 'female'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_avatar_shop_items_slot
  ON public.avatar_shop_items (slot, sort_order)
  WHERE is_active;

-- --------------------------------------------------------------------------
-- 2. Eigendomsregister, tegelijk het uitgavenboek.
--
--    price_paid + acquired_at + source beantwoorden "wie kocht wat, wanneer,
--    voor hoeveel". Een aparte uitgaven-logtabel is daarmee overbodig.
--
--    Bewust GEEN foreign key op item_id: bestaande inventories bevatten ids
--    die niet (meer) in de catalogus staan, en een catalogusopschoning mag
--    nooit eigendom cascaderen. Het schrijfpad is veilig doordat alleen de RPC
--    schrijft, en die voegt uitsluitend ids in die hij net heeft opgezocht.
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_avatar_items (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  item_id     text NOT NULL,
  price_paid  integer NOT NULL DEFAULT 0 CHECK (price_paid >= 0),
  source      text NOT NULL DEFAULT 'purchase'
              CHECK (source IN ('purchase', 'legacy_grandfathered', 'teacher_grant')),
  acquired_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, item_id)
);

CREATE INDEX IF NOT EXISTS idx_user_avatar_items_user
  ON public.user_avatar_items (user_id, acquired_at DESC);

-- --------------------------------------------------------------------------
-- 3. RLS.
--
--    De catalogus is publiek leesbaar voor ingelogde gebruikers en heeft
--    bewust GEEN schrijfpolicy: prijzen wijzigen alleen via een gereviewde
--    migratie. Dat houdt de CI-driftcheck betekenisvol en haalt een volledig
--    aanvalsoppervlak weg.
-- --------------------------------------------------------------------------
ALTER TABLE public.avatar_shop_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_avatar_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "avatar_shop_items_read_active" ON public.avatar_shop_items;
CREATE POLICY "avatar_shop_items_read_active"
  ON public.avatar_shop_items
  FOR SELECT
  TO authenticated
  USING (is_active);

-- Alleen eigen bezit leesbaar. Docenten krijgen bewust géén leesrecht:
-- welke pet of jas een leerling draagt is niet nodig voor onderwijskundig
-- toezicht (AVG Art. 5 lid 1 onder c, dataminimalisatie).
DROP POLICY IF EXISTS "user_avatar_items_select_own" ON public.user_avatar_items;
CREATE POLICY "user_avatar_items_select_own"
  ON public.user_avatar_items
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Geen INSERT/UPDATE/DELETE-policy voor authenticated: uitsluitend de
-- SECURITY DEFINER-RPC schrijft, net als bij xp_transactions.

-- --------------------------------------------------------------------------
-- 4. Grants. Nieuwe publieke tabellen worden niet meer automatisch aan de
--    Data API blootgesteld, dus dit blok is functioneel, geen decoratie.
-- --------------------------------------------------------------------------
GRANT SELECT ON TABLE public.avatar_shop_items TO authenticated;
GRANT SELECT ON TABLE public.user_avatar_items TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE
  ON TABLE public.avatar_shop_items, public.user_avatar_items TO service_role;
