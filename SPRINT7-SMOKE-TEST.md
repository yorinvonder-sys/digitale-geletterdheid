# Sprint 7 — Smoke test checklist

> Loop deze door ná de productie-deploy. Verwachte tijd: 15 minuten.
> Alles afgevinkt? Sprint 7 is done.

---

## Voorbereiding

- [ ] Log in met een **developer**-account (jouw eigen) op `https://dgskills.app`
- [ ] Open DevTools → Network + Console tabs (voor runtime-errors spotten)

---

## Route 1 — Conformiteitsverklaring (publiek)

URL: `https://dgskills.app/compliance/conformiteitsverklaring`

- [ ] Pagina laadt zonder errors in console
- [ ] Header "Conformiteitsverklaring — DGSkills.app" zichtbaar
- [ ] Datum onder de titel = vandaag (automatisch)
- [ ] Alle 13 secties aanwezig en genummerd
- [ ] "← Compliance Hub"-link gaat naar `/compliance-hub`
- [ ] "Printen / opslaan als PDF"-knop triggert `window.print()`
- [ ] In print-preview: alleen het document is zichtbaar, toolbar is verborgen
- [ ] Sectie 12: kader met "Yorin Vonder", rol, vandaag-datum, handtekeningveld

---

## Route 2 — Admin Risicoregister

URL: `https://dgskills.app/admin/risicoregister`

- [ ] **Niet ingelogd**: toont "Inloggen vereist" kaart met link naar /login
- [ ] **Ingelogd als student/teacher**: toont "Geen toegang" amber banner (role-gate client-side)
- [ ] **Ingelogd als developer**: toont volledige dashboard
  - [ ] Header "EU AI Act Art. 9 — Risicoregister" + versie + laatst bijgewerkt
  - [ ] 6 stat-blokken (Totaal / Open / Onder controle / Non-compliant / Achterstallig / Kritiek+Hoog)
  - [ ] Tabel met 20 risico's (R01-R20)
  - [ ] Filters werken: category, status, score-klasse
  - [ ] "Reset filters"-knop reset naar "all"
  - [ ] Rij klikken opent details-regel (mitigaties, restrisico, evidence)
  - [ ] Enter/Space toetsenbord opent ook details
  - [ ] CSV-download werkt: bestand `AI_Act_Risicoregister_YYYY-MM-DD.csv` geopend in Excel → 20 rijen + header

---

## Route 3 — Admin Pilot KPI Dashboard

URL: `https://dgskills.app/admin/pilot-kpi`

- [ ] **Niet ingelogd**: toont "Inloggen vereist" kaart
- [ ] **Ingelogd als developer**: toont dashboard
  - [ ] 4 stat-blokken (Totaal aanvragen / Actieve scholen / Gem. NPS / Open items)
  - [ ] Recente feedback-lijst (leeg bij eerste deploy: "Nog geen feedback")
  - [ ] Recente pilot-aanvragen-lijst (kan leeg zijn)
  - [ ] Weekly activity-grafiek rendert (ook bij 0 items)
  - [ ] Geen 403 of 401 errors in Network tab

---

## Feature 4 — Teacher Feedback Widget (floating FAB)

- [ ] Log in als **docent** (test-account op eigen school)
- [ ] Open het docent-dashboard
- [ ] Floating FAB rechts-onder zichtbaar (indigo, icon `MessageSquare`)
- [ ] Klik opent de feedback-modal
- [ ] NPS-slider werkt (0-10)
- [ ] Category dropdown heeft 6 opties
- [ ] Textarea telt karakters tot max 4000
- [ ] Verzenden (geldige feedback) → succes-state
- [ ] Check Supabase tabel `pilot_feedback` → 1 nieuwe rij
- [ ] Logout + opnieuw inloggen → widget werkt nog (localStorage persist)

---

## Feature 5 — SLO Override (Art. 14)

- [ ] Log in als **docent**
- [ ] Ga naar SLO-overzicht → klik op een leerling met voltooide missies
- [ ] In het rapport: naast elk kerndoel-percentage staat een "Override"-knop (met potlood-icoontje)
- [ ] Klik opent de `SloOverrideModal`
- [ ] AI-percentage zichtbaar
- [ ] Nieuwe waarde kan worden ingevoerd (0-100)
- [ ] Reden verplicht (min 10 chars) — bij <10 toont foutmelding
- [ ] Submit → modal sluit + badge "Overschreven door docent" verschijnt op de rij
- [ ] Check Supabase `ai_oversight_events` → 1 nieuwe rij met `event_type='teacher_override'`
- [ ] Print het rapport → **Override-knop en badge niet zichtbaar in print** (`print:hidden`)

---

## Security smoke-test

### RLS-check

Ingelogd als docent van school A — probeer via browser console:

```js
const { data, error } = await window.supabase
  .from('ai_oversight_events')
  .select('*');
console.log(data?.length, error);
```

- [ ] Verwacht: alleen events van eigen school zichtbaar (niet van andere scholen)

### Edge function auth-check

```bash
# Zonder Authorization header:
curl -i -X POST \
  -H "Content-Type: application/json" \
  -d '{"nps_score": 10}' \
  "https://<project-ref>.functions.supabase.co/submitPilotFeedback"
```

- [ ] Verwacht: `401 Unauthorized`

### CSP-check

- [ ] Open DevTools → Security tab op `/compliance/conformiteitsverklaring`
- [ ] Geen CSP-errors in console (geen `unsafe-inline` violations)

---

## Performance smoke-test

- [ ] Lighthouse op homepage → score blijft ≥ 90 (performance)
- [ ] `/admin/risicoregister` laadt in <2s (20 risico's, pure client-side data)
- [ ] Conformiteitsverklaring print-dialog opent in <1s

---

## Compliance-zelfaudit

- [ ] Compliance Hub (`/compliance-hub`) noemt alle nieuwe artefacten
- [ ] `/compliance/conformiteitsverklaring` is vanaf Compliance Hub bereikbaar (of voeg link toe)
- [ ] DPIA-doc staat nog correct op huidige producttoestand
- [ ] `SECURITY.md` hoeft geen update (geen nieuwe vulnerability classes)

---

## Final sign-off

- [ ] Alle checkboxes hierboven afgevinkt
- [ ] Geen console-errors in productie
- [ ] Supabase Logs tonen geen onverwachte RLS-denies
- [ ] Yorin tekent af: _____________ (datum)

Sprint 7 done → baton naar Sprint 8 (pilot-werving + externe conformiteitsreview).
