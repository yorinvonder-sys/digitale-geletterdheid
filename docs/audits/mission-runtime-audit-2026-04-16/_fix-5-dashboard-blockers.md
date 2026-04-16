# Fix-rapport 5 — Dashboard-BLOCKERs
- Datum: 2026-04-16

## BLOCKER 1 — assessment_results

Keuze: **GEEN RENAME** — tabel-naam in `assessmentService.ts` is correct.

De migratie `supabase/migrations/20260403100000_assessment_results.sql` bestaat al lokaal en definieert de `assessment_results` tabel met `assessment_type` kolom (enum: nulmeting/eindmeting), RLS, en backfill van `nulmeting_results`. De 404 wordt veroorzaakt doordat deze migratie nog niet is gepush'd naar Supabase.

Bijkomende fix: `.single()` → `.maybeSingle()` in `getAssessmentResult` en `hasCompletedAssessment` om 406-fouten te voorkomen wanneer de tabel bestaat maar geen rij bevat voor de gevraagde leerling/jaar/type combinatie.

**Files gewijzigd:** `services/assessmentService.ts`

Gewijzigde regels:
```diff
- .single();  // regel 151 — getAssessmentResult
+ .maybeSingle();
- if (error.code === 'PGRST116' || error.code === '42P01' ...) return null;
+ if (error.code === '42P01' ...) return null;  // PGRST116 niet meer mogelijk met maybeSingle
+ if (!data) return null;

- .single();  // regel 260 — hasCompletedAssessment
+ .maybeSingle();
```

**Deploy-actie vereist:** zie sectie onderaan.

## BLOCKER 2 — classroom_configs 406

`getClassroomConfig` in `services/teacherService.ts` gebruikt **al** `.maybeSingle()` op regel 340.

```typescript
.from('classroom_configs')
.select('*')
.eq('id', classId)
.maybeSingle();  // was al correct
```

Bij `null` retourneert de functie `createDefaultClassroomConfig(classId)` — de caller krijgt altijd een geldige config terug. **Geen wijziging nodig.**

## BLOCKER 3 — student_activities.mission_id

**Migratie-file:** `supabase/migrations/20260416000000_add_mission_id_to_student_activities.sql`

Inhoud: voegt `mission_id text` kolom toe met `IF NOT EXISTS` guard + index.

De `logActivity` functie in `services/teacherService.ts` (regel 381) inserteert al `mission_id: activity.missionId` — dat veroorzaakte de PGRST204-fout. Na deploy is de kolom aanwezig.

## Verificatie

TypeScript `assessmentService.ts`: **PASS** — geen errors.

`teacherService.ts`: pre-existing type-fouten aanwezig (geen relatie met deze fixes). Die bestonden voor deze wijzigingen.

## Deploy-instructies voor Yorin

**Voor BLOCKER 1 (kritiek):** de `assessment_results` tabel bestaat nog niet in Supabase. Run:
```bash
supabase db push
```
Dit deploy't zowel `20260403100000_assessment_results.sql` als `20260416000000_add_mission_id_to_student_activities.sql` in één keer (en alle andere nog niet-gedeploy'de migraties).

Controleer daarna in het Supabase dashboard of de tabel bestaat: Table Editor → `assessment_results`.

## Risico's

- **BLOCKER 1:** `supabase db push` zal alle lokale migraties uitvoeren die Supabase nog niet kent. Check eerst met `supabase migration list` welke dat zijn. De backfill-query in `20260403100000` kopieert bestaande `nulmeting_results` naar `assessment_results` — dit is idempotent (`ON CONFLICT DO NOTHING`).
- **BLOCKER 3:** `ADD COLUMN IF NOT EXISTS` is veilig; raakt geen bestaande data. De index wordt alleen aangemaakt als hij nog niet bestaat.
- **BLOCKER 2:** Geen wijziging, geen risico.
