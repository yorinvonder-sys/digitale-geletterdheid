-- ===========================================================================
-- Valideer het zichtbare uiterlijk tegen daadwerkelijk bezit.
--
-- 20260802090300 dichtte de boekhoudkundige helft: inventory en xpSpent worden
-- server-side herberekend. Maar `avatarConfig` werd nog ongevalideerd
-- overgenomen, en dát is het deel dat je ziet. Een leerling die rechtstreeks
-- update_student_stats aanroept met shirtStyle 'suit_diamond' droeg het pak van
-- 5000 XP zichtbaar, terwijl zijn bezit en saldo netjes leeg bleven.
--
-- Aanpak: opschonen, niet weigeren. Een harde weigering zou een leerling met
-- één ongeldige waarde helemaal niets meer kunnen laten opslaan — inclusief
-- voortgang die niets met de avatar te maken heeft. Een niet-bezeten waarde
-- valt daarom terug op de goedkoopste gratis optie voor dat slot.
--
-- Alleen slots waar überhaupt iets te koop is worden gecontroleerd
-- (baseModel, hairStyle, shirtStyle, pantsStyle, accessory, expression, pose).
-- Kleuren, geslacht en huisdieren zijn gratis en blijven onaangeroerd.
-- ===========================================================================

CREATE OR REPLACE FUNCTION public.sanitize_avatar_config(p_user_id uuid, p_config jsonb)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
DECLARE
  v_slot     text;
  v_value    text;
  v_gender   text;
  v_fallback text;
  v_out      jsonb;
BEGIN
  IF p_config IS NULL OR jsonb_typeof(p_config) <> 'object' THEN
    RETURN p_config;
  END IF;

  v_out    := p_config;
  v_gender := coalesce(v_out ->> 'gender', 'male');

  FOR v_slot IN
    SELECT DISTINCT slot
    FROM public.avatar_shop_items
    WHERE is_active AND price > 0
  LOOP
    v_value := v_out ->> v_slot;
    CONTINUE WHEN v_value IS NULL;

    -- Gratis of in bezit: toegestaan.
    CONTINUE WHEN EXISTS (
      SELECT 1
      FROM public.avatar_shop_items s
      WHERE s.is_active
        AND s.slot  = v_slot
        AND s.value = v_value
        AND (
          s.price = 0
          OR EXISTS (
            SELECT 1 FROM public.user_avatar_items i
            WHERE i.user_id = p_user_id AND i.item_id = s.id
          )
        )
    );

    -- Waarde die de catalogus helemaal niet kent: laten staan. Dat is
    -- vrijwel altijd een oudere opgeslagen keuze, en die stilletjes
    -- veranderen is vervelender dan hem accepteren. Bezit en saldo worden er
    -- niet door beïnvloed.
    CONTINUE WHEN NOT EXISTS (
      SELECT 1 FROM public.avatar_shop_items s
      WHERE s.is_active AND s.slot = v_slot AND s.value = v_value
    );

    -- Bekend maar niet in bezit: terug naar de goedkoopste gratis optie die
    -- bij dit geslacht past (kapsels zijn gendergebonden).
    SELECT s.value INTO v_fallback
    FROM public.avatar_shop_items s
    WHERE s.is_active
      AND s.slot  = v_slot
      AND s.price = 0
      AND (s.gender IS NULL OR s.gender = v_gender)
    ORDER BY s.sort_order
    LIMIT 1;

    IF v_fallback IS NOT NULL THEN
      v_out := jsonb_set(v_out, ARRAY[v_slot], to_jsonb(v_fallback));
    END IF;
  END LOOP;

  RETURN v_out;
END;
$$;

REVOKE ALL ON FUNCTION public.sanitize_avatar_config(uuid, jsonb) FROM public;
REVOKE ALL ON FUNCTION public.sanitize_avatar_config(uuid, jsonb) FROM anon;
REVOKE ALL ON FUNCTION public.sanitize_avatar_config(uuid, jsonb) FROM authenticated;

-- --------------------------------------------------------------------------
-- update_student_stats schoont voortaan zowel de gedragen outfit als de
-- opgeslagen outfits op. savedOutfits is dezelfde structuur en dus hetzelfde
-- gat.
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
  v_outfits  jsonb;
BEGIN
  v_uid := auth.uid();
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT coalesce(stats, '{}'::jsonb) INTO v_existing
  FROM public.users
  WHERE id = v_uid
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User profile not found';
  END IF;

  -- Server-eigen sleutels. Elke nieuwe server-eigen stats-sleutel hoort hier.
  v_merged := coalesce(p_stats, '{}'::jsonb)
    || jsonb_build_object(
         'xp',    coalesce((v_existing ->> 'xp')::integer, 0),
         'level', coalesce((v_existing ->> 'level')::integer, 1))
    || public.avatar_ownership_mirror(v_uid);

  IF v_merged ? 'avatarConfig' THEN
    v_merged := jsonb_set(
      v_merged,
      '{avatarConfig}',
      public.sanitize_avatar_config(v_uid, v_merged -> 'avatarConfig')
    );
  END IF;

  IF jsonb_typeof(v_merged -> 'savedOutfits') = 'array' THEN
    SELECT coalesce(jsonb_agg(public.sanitize_avatar_config(v_uid, outfit)), '[]'::jsonb)
      INTO v_outfits
    FROM jsonb_array_elements(v_merged -> 'savedOutfits') AS outfit;

    v_merged := jsonb_set(v_merged, '{savedOutfits}', v_outfits);
  END IF;

  PERFORM set_config('app.bypass_stats_protection', 'true', true);

  UPDATE public.users
  SET stats      = v_merged,
      last_login = now()
  WHERE id = v_uid;

  PERFORM set_config('app.bypass_stats_protection', 'false', true);
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_student_stats(jsonb) TO authenticated;
