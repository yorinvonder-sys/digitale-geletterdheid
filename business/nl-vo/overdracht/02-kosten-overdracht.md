# Kosten-analyse en Overdrachtsstrategie DGSkills

**Opgesteld door:** Yorin Vonder, juni 2026
**Doel:** Transparant beeld van huidige kosten en drie scenario's voor overdracht.

> **Opmerking:** Supabase Pro-tier bevestigd door Yorin (juni 2026). Overige bedragen zijn bekende tarieven. Verifieer actueel gebruik via [app.supabase.com](https://app.supabase.com) onder "Billing".

---

## 1. Huidige maandelijkse kosten (betaald door Yorin privé)

| Dienst | Tier | Maandkosten | Jaarkosten | Noot |
|---|---|---:|---:|---|
| **Supabase** | Pro (bevestigd) | ~€25 | ~€300 | |
| **Vercel** | Hobby of Pro | €0 of ~€20 | €0 of ~€240 | Verifieer in Vercel-dashboard |
| **Mistral AI** | Pay-per-use | ~€0-5 | ~€0-60 | Afhankelijk van actief leerlinggebruik |
| **Black Forest Labs** | Pay-per-use | ~€0-3 | ~€0-36 | Beeldgeneratie missies |
| **Anthropic** | Pay-per-use | ~€0-5 | ~€0-60 | `scanSubscriptionClaude` edge function |
| **Zoho** | E-mail (SMTP) | ~€0-3 | ~€0-36 | Afhankelijk van plan |
| **Claude Code / Anthropic** | Persoonlijk account Yorin | ~€18-100 | ~€216-1.200 | Voor ontwikkeling — los van het platform |
| **Domein dgskills.app** | Jaarlijks | ~€1 | ~€15 | Via Vercel of externe registrar |
| **Totaal platform (excl. Claude Code)** | | **~€26-62/mnd** | **~€315-747/jr** | |

**Conclusie:** Het platform kost ~€26-62 per maand. Supabase Pro (€25) is de vaste kostenpost. AI-gebruik (Mistral, BFL, Anthropic) en e-mail (Zoho) zijn variabel en afhankelijk van het aantal actieve leerlingen. De Claude Code-kosten zijn voor Yorins ontwikkelwerk, niet voor het draaien van de app zelf.

---

## 2. Drie scenario's

De keuze hangt samen met het eigenaarschapsbesluit in `00-eigenaarschaps-besluit.md`.

---

### Scenario A — School neemt accounts over (correspondert met Optie A)

**Wat er gebeurt:** Supabase-organisatie en Vercel-project worden overgedragen naar een school-e-mailadres. School betaalt accounts direct.

**Kosten voor school:** ~€25-63/maand (~€300-756/jaar) — exclusief eventuele AI-credits bij intensief gebruik.

**Stap-voor-stap overdracht:**

1. **Supabase:**
   - Ga naar [app.supabase.com](https://app.supabase.com) → Organization Settings → Members
   - Voeg school-e-mailadres toe als "Owner"
   - Verwijder Yorins account als owner nadat school-account actief is
   - Werk betaalmethode bij naar school-creditcard

2. **Vercel:**
   - Ga naar Vercel Dashboard → Team Settings → Members
   - Voeg school-e-mailadres toe als "Owner"
   - Overdracht facturering via Settings → Billing

3. **Externe diensten — API-sleutels overzetten:**

   De bron van waarheid voor actieve services zijn de Supabase environment variables. Op basis van de huidige codebase (`supabase/functions/`) zijn dit de actieve sleutels:

   | Env var | Dienst | Waarvoor |
   |---|---|---|
   | `MISTRAL_API_KEY` | Mistral AI | AI-feedback op leerlingwerk |
   | `BFL_API_KEY` | Black Forest Labs | Beeldgeneratie voor missies |
   | `ANTHROPIC_API_KEY` | Anthropic | Abonnements-scanning (`scanSubscriptionClaude`) |
   | `SMTP_HOST` / `SMTP_USER` / `SMTP_PASS` | Zoho Mail (smtp.zoho.eu) | E-mail (toestemmingen, notificaties) |

   > **Let op:** De actuele school-facing AI-paden zijn Mistral AI en Black Forest Labs. Anthropic is alleen een intern/accountingpad zolang niet bewezen is dat schooldata via Anthropic loopt. De nieuwe beheerder of Yorin moet `C-sub-verwerkerslijst-dgskills.md` en providerbewijzen actualiseren vóór de FG-toets.

   Stappen:
   - Maak nieuwe accounts aan voor Mistral, BFL, Anthropic en Zoho op het nieuwe beheerders-e-mailadres
   - Genereer nieuwe API-sleutels
   - Verwerk ze als Supabase secrets via: Supabase Dashboard → Edge Functions → Secrets

4. **Domein:**
   - DNS-beheer overdragen naar school-IT of laten staan bij huidige registrar met school als contactpersoon

**Tijdsduur:** ~2 uur technische overdracht met Yorin aanwezig.

---

### Scenario B — Kosten via pilotcontract (correspondert met Optie B)

**Wat er gebeurt:** Een op te richten rechtspersoon (BV/Stichting DGSkills) draagt de accounts. De school betaalt via een pilotcontract of licentie; de infrastructuurkosten worden daarin verrekend.

**Kosten voor school:** Onderdeel van pilotprijs (zie `03-pilot-propositie-school.md`). Pilot Start = €1.500 excl. btw — infrastructuurkosten zijn daarin inbegrepen.

**Actie:** Eerst rechtspersoon oprichten (zie `00-eigenaarschaps-besluit.md` Optie B), dan accounts overzetten naar nieuwe entiteit.

---

### Scenario C — Platform stopzetten (Optie C)

**Kosten na afsluiting:** €0

**Stap-voor-stap:**

1. **Data exporteren** (verplicht per DPA art. 14):
   - Supabase Dashboard → Project Settings → Backups → Download backup (JSON of SQL)
   - Of via MCP: exporteer alle tabellen naar CSV
   - Lever export aan schoolleiding/contactpersoon

2. **Data verwijderen** (verplicht per AVG art. 17 + DPA):
   - Supabase: verwijder alle gebruikerstabellen of het hele project
   - Bewaarplicht: audit logs 3 jaar conform AVG art. 30 — óf school bewaart deze, óf Yorin draagt ze over als CSV

3. **Accounts opzeggen:**
   - Supabase: Dashboard → Project Settings → Delete project, daarna Organization → Delete organization
   - Vercel: Dashboard → Team Settings → Delete Team
   - AI-diensten (Mistral, BFL, Zoho): accounts verwijderen of laten verlopen
   - Domein: niet verlengen of overdragen

**Tijdsduur:** ~2 uur, plannen zodat school data ontvangt vóór verwijdering.

---

## 3. Aanbeveling

**Koppel het kostenbesluit aan het pilot-gesprek met schoolleiding.**

- Als school kiest voor een pilot (Optie B): kosten lopen via pilotcontract, Yorin behoudt tijdelijk beheer, school hoeft niets te regelen aan infra.
- Als school kiest voor zelfbeheer (Optie A): overdracht plannen vóór 1 september 2026.
- Als school geen besluit neemt voor 1 augustus 2026: Supabase pauzeren (data bewaard, geen kosten) totdat er duidelijkheid is.

**Tussentijds:** Supabase "Pause project" is gratis en behoudt data. Dit is de veiligste tussenoplossing als het besluit tijd kost.

---

## 4. Checklist vóór overdracht

- [ ] Supabase-tier en maandkosten geverifieerd via dashboard
- [ ] Vercel-plan geverifieerd
- [ ] Eigenaarschapsbesluit genomen (zie `00-eigenaarschaps-besluit.md`)
- [ ] School-e-mailadres bepaald voor accountoverdracht
- [ ] Runbook doorgestuurd naar nieuwe beheerder
- [ ] Data-backup gemaakt vóór overdracht
- [ ] DPA ondertekend (zie `01-juridisch-dossier-voor-school.md`)
