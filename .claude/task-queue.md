# Taakwachtrij (Task Queue)

> Geprioriteerde lijst van taken na de huidige baton.
> Claude pakt de bovenste taak zodra de baton (`current-task.md`) is afgerond.

---

## Wachtrij (in volgorde van prioriteit)

### 1. Fase C C3 — Welkomstmail docenten
- **Werkstroom:** Product
- **Sprint:** 5
- **Beschrijving:** Edge function `sendTeacherWelcomeEmail` bouwen (Zoho SMTP template hergebruiken). Yorin stuurt handmatig na invite. Branch: `claude/onboarding-trial-flow`.
- **Done wanneer:** Yorin kan met 1 actie een welkomstmail naar een nieuw uitgenodigde docent sturen.

### 2. SECURITY — Column-level RLS op users-tabel
- **Werkstroom:** Compliance (security)
- **Sprint:** 5-6
- **Beschrijving:** De RLS policy `users_update_own_or_teacher` (migratie `20260301170000`:103-114) heeft geen column-restricties. Een geauthenticeerde teacher kan via een raw Supabase-call `role` of `school_id` zelf wijzigen (self-promote). Oplossing: SECURITY DEFINER RPC voor teacher-self-update + column-protection trigger op `role` en `school_id`. Of: restrictievere RLS policy. Pre-existing gap, ontdekt tijdens C2 review.
- **Done wanneer:** Teachers kunnen alleen `display_name`, `stats`, `student_class` en `year_group` op hun eigen rij updaten. `role`, `school_id`, `email` zijn beschermd.

### 3. Fase D — Assessment & Rapportage
- **Werkstroom:** Product
- **Sprint:** 5-6
- **Beschrijving:** Leerlingrapportages, docentdashboard met voortgangsoverzicht, SLO-koppeling in rapportages.
- **Done wanneer:** Docenten zien per leerling welke SLO-doelen behaald zijn.

### 4. Fase E — AI Act Compliance Code
- **Werkstroom:** Compliance
- **Sprint:** 6
- **Beschrijving:** Art. 9 risk management in code, Art. 12 logging implementatie, Art. 14 human oversight dashboard, conformiteitsverklaring genereren.
- **Done wanneer:** Alle HIGH RISK verplichtingen zijn in code geïmplementeerd.

### 5. Fase F — Pilot Operatie
- **Werkstroom:** Pilot
- **Sprint:** 6+
- **Beschrijving:** Feedback-loop inrichten, KPI tracking, wekelijkse iteratie-cyclus, docent support kanaal.
- **Done wanneer:** Pilot draait stabiel met meetbare feedback.

---

## Afgeronde taken

| Taak | Datum | Werkstroom |
|------|-------|------------|
| Fase C C1+C2 — /pilot route + wizard | 15 apr 2026 | Product |
| Fase B — Compliance Hub finaliseren | 15 apr 2026 | Compliance |
| Fase A — Projectinfrastructuur (.claude) | 3 apr 2026 | Infra |

---

## Regels

- Bovenste item is altijd de volgende taak
- Afgeronde taken verhuizen naar de tabel onderaan
- Nieuwe taken worden op prioriteit ingevoegd, niet altijd onderaan
- Max 5-7 items in de wachtrij — splitsen als het meer wordt
