# Dashboard-baseline — Runtime-audit DGSkills

- **Datum:** 2026-04-16
- **Testaccount:** `yorinvonder+audit-leerling@gmail.com` (leerling, klas 1)
- **URL:** http://localhost:3000/dashboard
- **Leerlijn zichtbaar:** "Digitale Basis" → Periode 2 (default na onboarding)
- **Tutorial:** Skipped via "Tutorial overslaan" — werkt.

## Cross-cutting bevindingen (gelden voor elke missie)

### BLOCKER-1 — Ontbrekende tabel `public.assessment_results`

Bij het laden van het dashboard worden er 3 × 404 op Supabase REST afgevuurd:

```
GET /rest/v1/assessment_results?...&assessment_type=eq.nulmeting&school_year=eq.2025 → 404
GET /rest/v1/assessment_results?...&assessment_type=eq.eindmeting&school_year=eq.2025 → 404
```

Fout-response van Postgres: `PGRST205 — Could not find the table 'public.assessment_results' in the schema cache. Perhaps you meant the table 'public.nulmeting_results'`.

Code roept het aan via `services/assessmentService.ts` → `getAssessmentResult()`. De service verwacht een tabel die niet meer bestaat (mogelijk gerenamed naar `nulmeting_results`).

**Impact:** iedere student krijgt bij dashboard-load 3 client-side errors; `AdaptiveMissionSuggestions` kan nulmeting-score en groei niet laden → adaptieve aanbevelingen vallen stil. Elke missie-run erft deze baseline-error ruis, wat runtime-auditen per missie lastig maakt.

**Fix-suggestie:** rename code-calls naar `nulmeting_results` OF herstel migratie die `assessment_results` tabel terugzet.

### BLOCKER-2 — 406 op `classroom_configs?id=eq.Klas+1`

```
GET /rest/v1/classroom_configs?select=*&id=eq.Klas+1 → 406
```

Classroom-config voor "Klas 1" bestaat niet. 406 komt waarschijnlijk van `.single()` dat 0 rijen terugkrijgt en daar geen null op accepteert.

**Impact:** klasspecifieke restricties werken niet voor nieuwe testaccounts zonder classroom-seed. Betekent ook dat `ipad-print-instructies` (classRestriction) mogelijk niet correct toont.

**Fix-suggestie:** `.maybeSingle()` gebruiken i.p.v. `.single()` zodat missing row geen 406 geeft, OR auto-provision classroom-config bij account-aanmaak.

### MAJOR-1 — Missie-kaart toont technische slug `notificatie-ninja`

In de DOM-snapshot van de dashboard-missielijst staat een knop met tekst:

> `notificatie-ninja — Beschikbaar`

Alle andere missies tonen een mens-leesbare titel (bv. "Prompt Perfectionist"). Dit matcht exact [docs/audits/opdrachten-audit-2026-04-15.md](../opdrachten-audit-2026-04-15.md) bevinding #5: vier missies missen `ROLES`-metadata. Bug is niet opgelost sinds 15 april.

**Fix-suggestie:** Voeg `ROLES`-entry toe in `config/agents.tsx` voor `notificatie-ninja`, `digitale-balans-coach`, `online-helden`, `welzijnsonderzoeker`.

### BLOCKER-3 — `student_activities.mission_id` kolom bestaat niet

Bij klikken op een missie-kaart wordt via `services/teacherService.ts:235` een activity-record ingevoegd:

```
POST /rest/v1/student_activities → 400
PGRST204: Could not find the 'mission_id' column of 'student_activities' in the schema cache
```

**Impact:** elke missie-start mislukt om de leerling-activiteit vast te leggen. Teacher-monitoring toont geen live-activiteit voor nieuwe missies. Ook elk Wave 0–2 runtime-rapport erft deze extra error.

**Fix-suggestie:** voeg migratie toe die `mission_id text` kolom terugzet op `student_activities`, OF update `teacherService.ts` om de nieuwe kolomnaam te gebruiken.

### OBSERVATIE-2 — Missie-intro mismatch: "De Code-Criticus" → Data & privacy

Het dashboard labelt `review-week-2` als **De Code-Criticus**. De intro-pagina toont echter:

> **"Wat weet jij over data en privacy?"**
> "Test je kennis over databronnen, persoonsgegevens en de AVG via vier afwisselende ronden."

Dit is Periode-3-inhoud (Digitaal Burgerschap), niet Periode 2 (AI & Creatie). Mogelijk is de review-content verkeerd gekoppeld aan de review-ID, of wordt een generieke review-payload gebruikt.

Matcht met bevinding #4 uit [opdrachten-audit-2026-04-15.md](../opdrachten-audit-2026-04-15.md): "review-week-2 en review-week-3 verwijzen niet naar review-specifieke payloads maar naar reguliere weekassessments."

### OBSERVATIE-1 — Review-gating actief (verschilt van eerdere audit)

De visuele UI toont: **"Eerst de herhalingsopdrachten — Voltooi 0/1 herhalingen om de nieuwe missies vrij te spelen."**

Alleen 1 missie ("De Code-Criticus") is zichtbaar op het scherm, ook al staan er 13 kaarten in de DOM. Dit is tegengesteld aan bevinding #3 van opdrachten-audit-2026-04-15 die zei dat dashboard-gating was uitgezet.

**Implicatie voor audit-strategie:** een leerling moet eerst de review voltooien voordat hij bij Periode 2 missies komt. Dit maakt runtime-audit per missie complex — zonder bypass moet elke periode eerst de review afgerond worden.

## Screenshot

- [screenshots/_dashboard-initial-desktop.png](screenshots/_dashboard-initial-desktop.png)

## Uitvoeringsimpact

Deze 4 bevindingen gelden als **baseline-ruis** voor alle volgende missie-rapporten. Individuele missie-audits moeten deze 3 console-errors + 1 slug-bug uitfilteren en alleen nieuwe/missiespecifieke bevindingen rapporteren.

## Console-log fragment (10 errors bij eerste load)

```
1. 401 on POST /rest/v1/users?on_conflict=id (initial upsert, recoverable)
2. 400 on POST /auth/v1/token (pre email-confirm; verwacht)
3-4. AuthApiError: Email not confirmed (verwacht, pre-bypass)
5-7. 404 on /rest/v1/assessment_results (zie BLOCKER-1)
8-10. PGRST205 on getAssessmentResult (zie BLOCKER-1)
Na email-confirm + nulmeting-bypass resteren errors 5-10 als stabiele baseline.
```
