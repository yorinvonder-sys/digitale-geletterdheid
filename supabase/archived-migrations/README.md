# Gearchiveerde migraties

Migraties die **nooit zijn toegepast** en ook niet meer toegepast moeten worden.
Ze staan hier in plaats van in `supabase/migrations/` zodat `supabase db push`
ze niet kan oppakken. Zet ze niet terug zonder de reden hieronder te weerleggen.

---

## `20260625151836_enforce_processing_restriction.sql`

**Gearchiveerd op 2026-08-05. Vervangen door `20260805104252_enforce_processing_restriction_in_rls.sql`.**

Deze migratie zou de AVG Art. 18-verwerkingsbeperking in RLS afdwingen. Het doel
klopte; de methode niet. Ze DROPT policies en maakt ze opnieuw aan, en de nieuwe
versies missen bescherming die alleen in productie bestaat.

Concreet: de live policies `mission_progress_owner_insert` en
`mission_progress_owner_update` bevatten `status <> 'completed'`. Die guard zorgt
dat een leerling zichzelf niet op voltooid kan zetten — voltooien mag uitsluitend
via de SECURITY DEFINER-functie `public.mark_mission_completed()` uit
`20260607095122_complete_mission_rpc.sql`. Zonder de guard is XP-fraude mogelijk.

Die guard staat in **geen enkele migratie in deze repo**. Hij is ooit rechtstreeks
op productie gezet. Deze migratie toepassen zou hem dus stil hebben verwijderd.

**De bredere les:** de productiedatabase is op punten strenger dan de repo weet.
Vergelijk daarom vóór het toepassen van een oudere policy-migratie altijd eerst de
live `pg_policies`-definities met wat de migratie zou aanmaken. Geef de voorkeur
aan `ALTER POLICY` boven `DROP` + `CREATE POLICY`: dan blijven de USING-clausule,
de rollen en het commando per definitie staan en kan er niets wegvallen. Zo is de
vervangende migratie opgebouwd.
