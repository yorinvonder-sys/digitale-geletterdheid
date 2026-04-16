# Sprint 7 — Go-live deploy playbook

> Status: Code staat op `claude/research-claude-skills-oF860` (10 commits ahead van `main`).
> `npm run build:prod` is lokaal geverifieerd en slaagt zonder fouten.
> Deze deploy moet **jij** (Yorin) handmatig uitvoeren — de Claude-sandbox heeft geen Supabase CLI, Supabase service-role key, Vercel-token of productie-credentials.

---

## 0. Pre-flight (check voordat je begint)

- [ ] Werk-branch is up-to-date: `git fetch origin && git log origin/claude/research-claude-skills-oF860 --oneline | head -12`
- [ ] Main branch weet wat komt: overweeg of Sprint 7 rechtstreeks naar `main` gaat of eerst via een PR wordt gereviewed
- [ ] Backup Supabase-schema via Supabase Dashboard → Database → Backups (handmatige snapshot)
- [ ] Tijd gepland: ±30 minuten voor stap 1-4, +15 minuten smoke-test

---

## 1. Migraties deployen naar Supabase productie

**Twee nieuwe migraties:**

1. `supabase/migrations/20260415100000_add_ai_oversight_events.sql` — EU AI Act Art. 12 + 14 audit log
2. `supabase/migrations/20260415110000_add_pilot_feedback.sql` — Fase F pilot-feedback

### Optie A — Supabase CLI (aanbevolen)

```bash
# Eenmalig linken (als nog niet gedaan)
supabase link --project-ref <project-ref>

# Push alle pending migraties
supabase db push --db-url "postgresql://postgres:<PW>@db.<project-ref>.supabase.co:5432/postgres"
```

De CLI past **alleen migraties toe die nog niet in `supabase_migrations.schema_migrations` staan**. De twee nieuwe krijgen versie-ID's `20260415100000` en `20260415110000`.

### Optie B — Dashboard SQL editor (handmatig, als geen CLI)

1. Open Supabase Dashboard → SQL Editor → New query
2. Plak `supabase/migrations/20260415100000_add_ai_oversight_events.sql` inhoud, klik Run
3. Plak `supabase/migrations/20260415110000_add_pilot_feedback.sql` inhoud, klik Run
4. **Handmatig bijhouden in `supabase_migrations.schema_migrations`** (indien je CLI later gaat gebruiken):
   ```sql
   insert into supabase_migrations.schema_migrations (version, name)
   values
     ('20260415100000', 'add_ai_oversight_events'),
     ('20260415110000', 'add_pilot_feedback');
   ```

### Verificatie na migratie

```sql
-- Tabellen bestaan + RLS aan?
select tablename, rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in ('ai_oversight_events', 'pilot_feedback');

-- Policies actief?
select tablename, policyname
from pg_policies
where tablename in ('ai_oversight_events', 'pilot_feedback')
order by tablename, policyname;
```

Verwacht: 2 rijen met `rowsecurity = true`; minimaal 2 policies op `ai_oversight_events`, minimaal 4 op `pilot_feedback`.

---

## 2. Edge function `submitPilotFeedback` deployen

```bash
supabase functions deploy submitPilotFeedback --project-ref <project-ref>
```

Environment-vars die de function nodig heeft (al aanwezig in Supabase secrets, maar bevestig):

- `SUPABASE_URL` — automatisch beschikbaar
- `SUPABASE_SERVICE_ROLE_KEY` — automatisch beschikbaar
- `SUPABASE_ANON_KEY` — automatisch beschikbaar

### Verificatie

```bash
# Test met Authorization header (zou 400 moeten geven wegens ontbrekende body)
curl -i -X POST \
  -H "Authorization: Bearer <jouw-access-token>" \
  -H "Content-Type: application/json" \
  -d '{}' \
  "https://<project-ref>.functions.supabase.co/submitPilotFeedback"
```

Verwacht: `400 Bad Request` met JSON-body `{"error": "..."}`. Een `401` betekent dat auth-validatie werkt maar geen geldige token ontvangen.

---

## 3. Vercel production-deploy

### Optie A — Merge naar main (auto-deploy trigger)

```bash
git checkout main
git pull origin main
git merge --no-ff claude/research-claude-skills-oF860
git push origin main
```

Vercel ziet de push en start een productie-deploy. Volg via Vercel Dashboard.

### Optie B — Preview-deploy eerst (veiliger)

```bash
# Via Vercel Dashboard: Deployments → pick de branch commit → "Promote to Production"
# Of via CLI:
vercel --prod
```

### Verificatie na deploy

- [ ] `https://dgskills.app/compliance/conformiteitsverklaring` laadt (eerst login-vrij)
- [ ] `https://dgskills.app/admin/risicoregister` → 200 + "Inloggen vereist" of admin-dashboard
- [ ] `https://dgskills.app/admin/pilot-kpi` → 200 + "Inloggen vereist" of admin-dashboard

---

## 4. Smoke test na deploy

Zie `SPRINT7-SMOKE-TEST.md` voor de complete checklist per route.

---

## Rollback-plan

Als er tijdens deploy iets stuk gaat:

### Migratie rollback

```sql
-- In Supabase SQL editor:
drop table if exists public.ai_oversight_events cascade;
drop table if exists public.pilot_feedback cascade;
delete from supabase_migrations.schema_migrations
where version in ('20260415100000', '20260415110000');
```

### Edge function rollback

```bash
supabase functions delete submitPilotFeedback --project-ref <project-ref>
```

### Frontend rollback

In Vercel Dashboard → Deployments → previous stable deploy → "Promote to Production".

---

## Contactpunt bij incident

- Supabase Status: https://status.supabase.com
- Vercel Status: https://www.vercel-status.com
- Google Cloud Vertex AI: https://status.cloud.google.com

Bij een **data-incident** (leerlingdata getroffen): volg het incident-protocol uit `business/nl-vo/compliance/incident-response-protocol.md` (indien aanwezig) en meld binnen 72 uur aan de AP.
