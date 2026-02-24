# Project: AI Lab - Future Architect (DGSkills)

## Stack
- React 19 + TypeScript + Vite
- Supabase (auth, database, edge functions, RLS)
- Tailwind CSS + Framer Motion
- Google Gemini via Vertex AI (europe-west4, service account auth)
- Vercel (deployment)

## Agent Preferences
- Be aggressive with parallel subagents. Use Task tool liberally for independent work streams.
- When exploring the codebase, researching, or fixing multiple files: spin up parallel agents rather than doing things sequentially.
- Background agents are preferred for long-running tasks (builds, audits, large searches).
- Default language for communication: Dutch (Nederlands), unless the context is English code/docs.

## MCP Servers Available
- Supabase: database queries, schema inspection, migrations, edge functions, logs
- Vercel: deployments, environment variables, build logs
- Tavily: web search and research
- Sequential Thinking: complex reasoning chains

## Deployment
- Production: dgskills.app (Vercel)
- Build command: `npm run build:prod`
- Supabase project with active migrations and RLS policies

## Key Reference Documents
- **Lanceringsrapport (compleet):** `business/nl-vo/08-lanceringsrapport-compleet.md` — Security audit, didactische analyse, docentvriendelijkheid, business model, 90-dagen plan.
- **Juridisch rapport (compleet):** `business/nl-vo/09-juridisch-rapport-compleet.md` — AVG/GDPR artikelsgewijs, EU AI Act (hoog-risico classificatie), ondernemingsrecht, onderwijsrecht, minderjarigenbescherming, alle actie-items met kosten.
- **Pricing & pakketten:** `business/nl-vo/01-offer-packages-and-sla.md` + `business/nl-vo/02-pricing-matrix.md`
- **Compliance & inkoop:** `business/nl-vo/04-compliance-and-procurement-pack.md`
- **Legal matrix:** `business/nl-vo/compliance/legal-matrix.md`
- **Pilot playbook:** `business/nl-vo/03-pilot-cohort-playbook.md`
- **USP strategie:** `business/nl-vo/07-usp-strategy-and-messaging.md`

## AI Act Classification
- DGSkills is classified as **HIGH RISK** under EU AI Act Annex III point 3(b) — AI systems for evaluation of learning outcomes in education.
- The earlier assessment in `08-lanceringsrapport-compleet.md` stating "beperkt risico" is INCORRECT. Follow the classification in `09-juridisch-rapport-compleet.md`.
- Key deadline: **2 August 2026** — high-risk obligations become enforceable.

## Known Issues (Pre-Launch Blockers)
1. ~~CORS `Access-Control-Allow-Origin: *` op alle Edge Functions~~ — **OPGELOST** (whitelist op dgskills.app)
2. `systemInstruction` wordt ongevalideerd vanuit client naar chat Edge Function gestuurd
3. Privacy-docs bevatten `[invullen]` placeholders die ingevuld moeten worden (wacht op KvK)
4. ~~Verwerkersovereenkomst (DPA) is template~~ — **OPGELOST** (Model 4.0 Privacyconvenant opgesteld, A-E bijlagen)
5. ~~Gemini API zonder safetySettings~~ — **OPGELOST** (BLOCK_LOW_AND_ABOVE op alle 4 categorieën)
6. ~~Geen welzijnsprotocol~~ — **OPGELOST** (toegevoegd aan SYSTEM_INSTRUCTION_SUFFIX)
7. ~~DPIA niet uitgevoerd~~ — **OPGELOST** (dpia-dgskills-compleet.md)
8. Geen Algemene Voorwaarden
9. Geen KvK-inschrijving / juridische entiteit
10. Geen beroepsaansprakelijkheidsverzekering
11. ~~Gemini Developer API ToS verbiedt gebruik voor <18~~ — **OPGELOST** (gemigreerd naar Vertex AI europe-west4)

## Launch Plan (ACTIEF)
- **Plan:** `LAUNCH-PLAN.md` — het actieve stappenplan voor marktlancering
- **Protocol:** Begin ELKE chat door `LAUNCH-PLAN.md` te lezen en rapporteer: huidige sprint, doel, volgende stap
- **Regel:** Eén taak tegelijk. Stuur Yorin terug naar het plan als hij afdwaalt.
- **Updates:** Werk de status in `LAUNCH-PLAN.md` bij na elke afgeronde taak (⬜ → ✅)

## Resolved Technical Changes (23 feb 2026)
- **Vertex AI migratie**: `supabase/functions/chat/index.ts` en `scanReceipt/index.ts` gebruiken nu Vertex AI (`europe-west4-aiplatform.googleapis.com`) i.p.v. Gemini Developer API
- **Auth**: Service account via `_shared/vertexAuth.ts` (JWT signing + token caching), secret: `GOOGLE_SERVICE_ACCOUNT_KEY`
- **Data residency**: Google garandeert data at rest + ML processing in europe-west4 (Nederland)
- **17 compliance-documenten**: Opgeslagen in `business/nl-vo/compliance/`
