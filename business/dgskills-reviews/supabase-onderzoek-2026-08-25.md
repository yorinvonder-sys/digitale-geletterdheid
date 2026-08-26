# Supabase-onderzoek beslispunten 2 en 3 — sweep 25-08-2026

Read-only onderzocht op productie (project `tdaylulsnbhhjuufmdzk`, DGSkills.app)
op 2026-08-25. Er is **niets** op productie gewijzigd of uitgevoerd.

## Beslispunt 2 — ai-tekengame duelmodus (`duel_presence`)

**Conclusie: het probleem zit volledig client-side; de database is al goed
afgeschermd. Er is géén migratie nodig.**

- In productie staat RLS **aan** op `duel_presence`, met exact de twee policies
  die ook in de repo-migratie (`20260515165303_restore_missing_app_tables.sql`)
  staan:
  - lezen: alleen je eigen rij, óf rijen met een `school_id` die gelijk is aan
    jouw eigen school (`get_caller_school_id()`);
  - schrijven: alleen je eigen rij, en `school_id` moet leeg zijn of jouw
    eigen school zijn.
- De client gaf `schoolId` alleen nooit door in de keten AiLab →
  DrawingGamePreview → DuelLobby → duelService. Daardoor werd elke
  presence-rij met `school_id = NULL` geschreven — en NULL-rijen zijn door de
  leespolicy voor niemand anders zichtbaar. Praktisch effect: de lobby was
  niet "ongefilterd over scholen heen" (de RLS blokkeerde dat), maar juist
  grotendeels **leeg** voor iedereen.
- De client-fix (drie kleine prop-doorgiftes) zit in de hoofd-PR van deze
  sweep. Daarmee wordt `school_id` gevuld, gaat de leespolicy correct
  school-scoped werken en ziet een leerling alleen nog spelers van de eigen
  school. Oude NULL-rijen verlopen vanzelf (presence is 2 minuten geldig).

## Beslispunt 3 — `ai_beleid_feedback` en `ai_beleid_surveys`

**Conclusie: beide tabellen bestaan in productie, mét RLS en een nette
stem-RPC. Het gat is (a) migratiedrift in de repo en (b) één te ruime
leespolicy. Twee migratievoorstellen staan klaar in deze PR.**

Aangetroffen productiestaat:

| Tabel | RLS | Policies |
|---|---|---|
| `ai_beleid_surveys` | aan | insert: alleen eigen `uid` · select: alleen docenten van de school |
| `ai_beleid_feedback` | aan | insert: eigen `uid`, stemmen=0 · select: **elke ingelogde gebruiker** · update: eigenaar |

- De RPC `vote_on_idea` bestaat, is SECURITY DEFINER met vastgezet
  `search_path`, school-scoped en met dubbelstem-preventie (FOR UPDATE). Goed
  gebouwd; letterlijk vastgelegd in het reconcile-voorstel.
- `ai_beleid_surveys` is al netjes dicht (leerlingen kunnen elkaars antwoorden
  niet lezen; alleen docenten van de eigen school).

### Voorstel 1 — `20260825220000_reconcile_ai_beleid_tables.sql`
Legt de huidige productiestaat idempotent vast in de repo (CREATE TABLE IF NOT
EXISTS + policies + RPC). Op productie een no-op; sluit de migratiedrift.
Risico: geen (verandert geen gedrag).

### Voorstel 2 — `20260825220100_scope_ai_beleid_feedback_access.sql`
Twee aanscherpingen die productiegedrag wél veranderen:
1. **Leespolicy school-scoped maken.** Nu kan elke ingelogde gebruiker van
   elke school alle vrije-tekst-ideeën van minderjarigen lezen. Nieuw: eigen
   rijen, schoolgenoten en docenten van de school.
2. **Eigenaar-updatepolicy laten vervallen.** Die liet een leerling de
   stemmenteller van het eigen idee direct manipuleren; de app heeft geen
   legitiem direct update-pad (stemmen loopt via de RPC).

Effect op eerlijke gebruikers: geen — de app leest al school-scoped en stemt
via de RPC. Bestaande data blijft staan.

## Uitvoering (pas na expliciet akkoord)

1. Voorstel 2 eerst op productie toepassen (via MCP `apply_migration` of de
   dashboard-SQL-editor), daarna voorstel 1 in de migratiehistorie opnemen —
   of beide in één keer via de gecontroleerde route. **Geen kale
   `supabase db push`** (bekende drift, zie project_supabase_migration_drift).
2. Verifieer daarna: als leerling van school A geen ideeën van school B kunnen
   lezen; stemmen werkt nog; docentenoverzicht werkt nog.
