-- ===========================================================================
-- Amnestie voor bestaande avatar-items.
--
-- Onder de oude flow werd de XP nooit echt afgeschreven, dus leerlingen hebben
-- items die ze feitelijk gratis kregen. Achteraf alsnog afrekenen zou de
-- meesten diep in de min zetten — ze bezitten samen meer dan ze ooit verdiend
-- hebben — en items afpakken verandert hun avatar van de ene dag op de andere.
-- Beide zijn slechter dan de scheefheid accepteren.
--
-- Daarom: alles wat nu in stats.inventory staat wordt vastgelegd met
-- price_paid = 0 en herkomst 'legacy_grandfathered'. Niemand verliest iets,
-- niemand verliest XP, en xpSpent begint vanzelf op 0 omdat het de som van
-- price_paid is. Vanaf de volgende migratie wordt elke nieuwe aankoop wél
-- afgerekend.
--
-- Deze migratie moet vóór 20260802090300 draaien: die laat
-- update_student_stats de inventory uit dit grootboek herberekenen. Draait het
-- grootboek nog leeg, dan zou de eerstvolgende opslag ieders items wissen.
-- ===========================================================================

-- Expliciete transactie: set_config(..., is_local => true) geldt alleen binnen
-- de lopende transactie. De Supabase-CLI draait een migratiebestand als één
-- transactie, maar via de SQL-editor of een autocommit-runner zou de vlag na
-- het eigen statement vervallen en zou de UPDATE hieronder afketsen op
-- protect_stats_column. BEGIN/COMMIT haalt die aanname weg.
BEGIN;

-- ELK id uit de bestaande inventaris wordt vastgelegd, ook ids die de huidige
-- catalogus niet (meer) kent. De spiegel hieronder overschrijft
-- stats.inventory met dit register; filteren zou die items onherroepelijk
-- wissen. Denk aan acc_pet_dog/acc_pet_cat/acc_pet_robo: die zijn op productie
-- voor 700-4000 XP verkocht en heten in de nieuwe catalogus anders.
-- Het register betekent "wat de leerling bezit", niet "wat de catalogus kent".
INSERT INTO public.user_avatar_items (user_id, item_id, price_paid, source, acquired_at)
SELECT
  u.id,
  inv.item_id,
  0,
  'legacy_grandfathered',
  coalesce(u.created_at, now())
FROM public.users u
CROSS JOIN LATERAL jsonb_array_elements_text(
  CASE
    WHEN jsonb_typeof(u.stats -> 'inventory') = 'array' THEN u.stats -> 'inventory'
    ELSE '[]'::jsonb
  END
) AS inv(item_id)
-- Enige filter is het id-formaat, dat de CHECK-constraint sowieso afdwingt.
WHERE inv.item_id ~ '^[a-z0-9_]{1,64}$'
ON CONFLICT (user_id, item_id) DO NOTHING;

-- protect_stats_column blokkeert ook migraties: auth.uid() is hier NULL, dus
-- de rolcontrole in de trigger vindt geen teacher/admin en gooit een fout.
SELECT set_config('app.bypass_stats_protection', 'true', true);

-- Spiegel stats.inventory gelijk aan het grootboek en zet xpSpent op 0.
UPDATE public.users u
SET stats = coalesce(u.stats, '{}'::jsonb) || jsonb_build_object(
      'inventory', coalesce(
        (SELECT jsonb_agg(i.item_id ORDER BY i.acquired_at, i.item_id)
           FROM public.user_avatar_items i
          WHERE i.user_id = u.id),
        '[]'::jsonb
      ),
      'xpSpent', 0
    )
WHERE u.stats ? 'inventory'
   OR EXISTS (SELECT 1 FROM public.user_avatar_items i WHERE i.user_id = u.id);

SELECT set_config('app.bypass_stats_protection', 'false', true);

COMMIT;
