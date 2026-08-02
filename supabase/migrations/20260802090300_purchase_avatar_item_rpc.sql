-- ===========================================================================
-- Aankoop van avatar-items, server-side afgerekend.
--
-- Kern: stats.xp blijft "totaal ooit verdiend" en wordt NOOIT verlaagd —
-- verlagen zou calculate_level() het level omlaag laten zetten, de 500-XP-badge
-- breken en de ranglijst en docentexports vervuilen. Uitgaven staan apart in
-- stats.xpSpent. Besteedbaar saldo = xp - xpSpent.
--
-- Dicht de BOEKHOUDKUNDIGE helft van het cheat-gat: update_student_stats nam
-- inventory klakkeloos van de client over, dus een leerling kon zichzelf elk
-- item in bezit schrijven. Dat kan nu niet meer.
--
-- NIET GEDICHT — bewust, en belangrijk om te weten: `avatarConfig` wordt nog
-- steeds ongevalideerd overgenomen. Een leerling die rechtstreeks
-- update_student_stats aanroept met bijvoorbeeld shirtStyle 'suit_diamond'
-- (5000 XP) draagt dat pak zichtbaar, terwijl inventory en xpSpent leeg
-- blijven. Hetzelfde geldt voor savedOutfits. Het bezit klopt dan wél, het
-- uiterlijk niet. Volledig dichten vraagt server-side validatie van elke
-- config-sleutel tegen de catalogus; dat is een aparte stap.
-- ===========================================================================

-- --------------------------------------------------------------------------
-- Eén bron van waarheid voor beide spiegelvelden in users.stats.
-- Altijd HERBEREKEND uit het grootboek, nooit opgeteld bij de vorige waarde,
-- zodat elke drift zichzelf herstelt.
-- --------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.avatar_ownership_mirror(p_user_id uuid)
RETURNS jsonb
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  -- Bezit telt altijd; kwijtgescholden uitgaven tellen niet meer mee voor het
  -- saldo. Zo houdt een leerling na een docentreset zijn items én is zijn
  -- opnieuw verdiende XP weer besteedbaar, zonder dat het aankoopbewijs
  -- verdwijnt.
  SELECT jsonb_build_object(
    'inventory', coalesce(jsonb_agg(item_id ORDER BY acquired_at, item_id), '[]'::jsonb),
    'xpSpent',   coalesce(sum(price_paid) FILTER (WHERE voided_at IS NULL), 0)::integer
  )
  FROM public.user_avatar_items
  WHERE user_id = p_user_id;
$$;

REVOKE ALL ON FUNCTION public.avatar_ownership_mirror(uuid) FROM public;
REVOKE ALL ON FUNCTION public.avatar_ownership_mirror(uuid) FROM anon;
REVOKE ALL ON FUNCTION public.avatar_ownership_mirror(uuid) FROM authenticated;

-- --------------------------------------------------------------------------
-- De aankoop zelf.
--
-- Geeft een envelop terug in plaats van een exception: PostgREST maakt van een
-- exception een ondoorzichtige 400, waarna de UI op foutteksten zou moeten
-- matchen. Nu kan de UI op `code` sturen.
-- --------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.purchase_avatar_item(p_item_id text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid     uuid;
  v_item_id text;
  v_price   integer;
  v_stats   jsonb;
  v_mirror  jsonb;
  v_xp      integer;
  v_spent   integer;
  v_balance integer;
BEGIN
  v_uid := auth.uid();
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'code', 'NOT_AUTHENTICATED');
  END IF;

  v_item_id := lower(trim(coalesce(p_item_id, '')));
  IF v_item_id !~ '^[a-z0-9_]{1,64}$' THEN
    RETURN jsonb_build_object('ok', false, 'code', 'INVALID_ITEM_ID');
  END IF;

  -- Prijs ALTIJD server-side. De client stuurt nooit een bedrag mee.
  SELECT price INTO v_price
  FROM public.avatar_shop_items
  WHERE id = v_item_id AND is_active;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'code', 'ITEM_NOT_FOUND', 'itemId', v_item_id);
  END IF;

  -- Rijvergrendeling serialiseert gelijktijdige aankopen (dubbel-uitgeven).
  SELECT coalesce(stats, '{}'::jsonb) INTO v_stats
  FROM public.users
  WHERE id = v_uid
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'code', 'PROFILE_NOT_FOUND');
  END IF;

  v_mirror  := public.avatar_ownership_mirror(v_uid);
  v_xp      := greatest(coalesce((v_stats ->> 'xp')::integer, 0), 0);
  v_spent   := coalesce((v_mirror ->> 'xpSpent')::integer, 0);
  v_balance := greatest(v_xp - v_spent, 0);

  -- Gratis items zijn van iedereen: nooit vastleggen, nooit afschrijven.
  -- Het grootboek betekent daardoor consequent "dingen die XP gekost hebben".
  IF v_price = 0 OR (v_mirror -> 'inventory') ? v_item_id THEN
    RETURN jsonb_build_object(
      'ok', true, 'code', 'ALREADY_OWNED', 'itemId', v_item_id, 'price', v_price,
      'xp', v_xp, 'xpSpent', v_spent, 'balance', v_balance,
      'inventory', v_mirror -> 'inventory');
  END IF;

  IF v_balance < v_price THEN
    RETURN jsonb_build_object(
      'ok', false, 'code', 'INSUFFICIENT_XP', 'itemId', v_item_id,
      'price', v_price, 'xp', v_xp, 'xpSpent', v_spent, 'balance', v_balance,
      'needed', v_price - v_balance);
  END IF;

  INSERT INTO public.user_avatar_items (user_id, item_id, price_paid, source)
  VALUES (v_uid, v_item_id, v_price, 'purchase')
  ON CONFLICT (user_id, item_id) DO NOTHING;

  v_mirror := public.avatar_ownership_mirror(v_uid);
  v_spent  := coalesce((v_mirror ->> 'xpSpent')::integer, 0);

  -- protect_stats_column blokkeert ook SECURITY DEFINER-functies:
  -- current_setting('role') blijft 'authenticated'. Vandaar de bypass-vlag.
  PERFORM set_config('app.bypass_stats_protection', 'true', true);

  UPDATE public.users
  SET stats      = coalesce(stats, '{}'::jsonb) || v_mirror,
      updated_at = now()
  WHERE id = v_uid;

  PERFORM set_config('app.bypass_stats_protection', 'false', true);

  RETURN jsonb_build_object(
    'ok', true, 'code', 'PURCHASED', 'itemId', v_item_id, 'price', v_price,
    'xp', v_xp, 'xpSpent', v_spent, 'balance', greatest(v_xp - v_spent, 0),
    'inventory', v_mirror -> 'inventory');
END;
$$;

REVOKE ALL ON FUNCTION public.purchase_avatar_item(text) FROM public;
REVOKE ALL ON FUNCTION public.purchase_avatar_item(text) FROM anon;
GRANT EXECUTE ON FUNCTION public.purchase_avatar_item(text) TO authenticated;

-- --------------------------------------------------------------------------
-- VERPLICHT bij het bovenstaande.
--
-- Zonder deze wijziging zou (a) de eerstvolgende gewone stats-opslag de
-- aankoop wissen, want deze functie vervangt de hele blob, en (b) het gat
-- openblijven waarmee een leerling zichzelf elk item cadeau doet door een
-- verzonnen inventory mee te sturen.
--
-- inventory en xpSpent worden nu server-side HERBEREKEND uit het grootboek.
-- Elke nieuwe server-eigen stats-sleutel moet hieronder worden toegevoegd.
-- --------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_student_stats(p_stats jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid      uuid;
  v_existing jsonb;
  v_merged   jsonb;
BEGIN
  v_uid := auth.uid();
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- FOR UPDATE voorkomt dat een gelijktijdige aankoop tussen SELECT en UPDATE
  -- wordt overschreven.
  SELECT coalesce(stats, '{}'::jsonb) INTO v_existing
  FROM public.users
  WHERE id = v_uid
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User profile not found';
  END IF;

  v_merged := coalesce(p_stats, '{}'::jsonb)
    || jsonb_build_object(
         'xp',    coalesce((v_existing ->> 'xp')::integer, 0),
         'level', coalesce((v_existing ->> 'level')::integer, 1))
    || public.avatar_ownership_mirror(v_uid);

  PERFORM set_config('app.bypass_stats_protection', 'true', true);

  UPDATE public.users
  SET stats      = v_merged,
      last_login = now()
  WHERE id = v_uid;

  PERFORM set_config('app.bypass_stats_protection', 'false', true);
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_student_stats(jsonb) TO authenticated;

-- --------------------------------------------------------------------------
-- Docentreset: zette xp op 0 maar liet uitgaven staan, waardoor het saldo op 0
-- bleef tot de leerling zijn oude uitgaven opnieuw verdiend had. Bij een reset
-- worden uitgaven daarom kwijtgescholden via voided_at. De rij zelf blijft
-- onaangeroerd: price_paid en source overschrijven zou het aankoopbewijs
-- wissen — precies waarvoor deze tabel bestaat — en na een reset zou niemand
-- meer kunnen zien dat er ooit iets gekocht is.
--
-- Meteen ook de ontbrekende bypass-vlag toegevoegd: is_teacher() staat ook
-- 'developer' toe, terwijl de trigger alleen teacher/admin doorlaat — een
-- reset door een developer liep daardoor stuk.
-- --------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.reset_student_progress(p_student_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_target_school_id text;
  v_current_stats    jsonb;
BEGIN
  IF NOT public.is_teacher() THEN
    RAISE EXCEPTION 'Unauthorized: teacher/admin/developer with MFA required';
  END IF;

  SELECT school_id, stats
    INTO v_target_school_id, v_current_stats
  FROM public.users
  WHERE id = p_student_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Student not found: %', p_student_id;
  END IF;

  IF NOT public.is_teacher_in_school(v_target_school_id) THEN
    RAISE EXCEPTION 'Unauthorized: only same-school privileged users may reset progress';
  END IF;

  DELETE FROM public.mission_progress
  WHERE user_id = p_student_id;

  UPDATE public.user_avatar_items
  SET voided_at = now()
  WHERE user_id = p_student_id AND price_paid > 0 AND voided_at IS NULL;

  v_current_stats := coalesce(v_current_stats, '{}'::jsonb) - 'missionProgress'
    || jsonb_build_object(
      'xp', 0,
      'level', 1,
      'missionsCompleted', '[]'::jsonb
    )
    || public.avatar_ownership_mirror(p_student_id);

  PERFORM set_config('app.bypass_stats_protection', 'true', true);

  UPDATE public.users
  SET stats = v_current_stats
  WHERE id = p_student_id;

  PERFORM set_config('app.bypass_stats_protection', 'false', true);

  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.reset_student_progress(uuid) TO authenticated;
