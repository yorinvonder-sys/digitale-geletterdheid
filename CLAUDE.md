# Project: AI Lab - Future Architect (DGSkills)

## Stack
- React 19 + TypeScript + Vite
- Supabase (auth, database, edge functions, RLS)
- Tailwind CSS (inline, geen @apply) + Framer Motion
- Google Gemini via Vertex AI (europe-west4, service account auth)
- Vercel (deployment), build: `npm run build:prod`
- State: React hooks + Contexts (geen Redux)
- Imports: `@/*` alias naar project root

## Code Conventions
- **Componenten:** PascalCase (`MissionCard.tsx`), named exports, `React.FC<Props>`
- **Services:** camelCase (`geminiService.ts`), edge function proxy preferred
- **Hooks:** camelCase met `use` prefix (`useRateLimit.ts`)
- **Types:** PascalCase interfaces in `types/`
- **Styling:** Tailwind inline in className, conditionals via template literals, custom kleuren via `lab-*` tokens
- **Edge Functions:** Deno runtime, `esm.sh` imports, shared code in `_shared/`
- **Entry point:** `App.tsx` → `AppRouter.tsx` → `AuthenticatedApp.tsx`

## Agent Preferences
- Be aggressive with parallel subagents. Use Task tool liberally for independent work streams.
- When exploring, researching, or fixing multiple files: spin up parallel agents.
- Background agents for long-running tasks (builds, audits, large searches).
- Default language: Dutch (Nederlands), unless context is English code/docs.

## Prompt Guidance — VERPLICHT

**Bij ELKE gebruikersprompt checkt Claude eerst of deze voldoende informatie bevat:**

Een complete prompt heeft:
1. **WAT** — Wat moet er gebeuren? (actie/doel)
2. **WAAR** — Welk bestand, component, of deel van het systeem?
3. **WAAROM** — Welk probleem lost dit op? (context)

**Als 1 of meer van deze ontbreken, stel Claude EEN verhelderingsvraag** voordat er code wordt geschreven. Gebruik het `AskUserQuestion` tool hiervoor.

Voorbeelden van wanneer te vragen:
- "Fix de chat" → WAAR en WAAROM ontbreken → Vraag: "Welk specifiek probleem ervaar je met de chat? Bijv. foutmelding, trage response, of iets anders?"
- "Voeg een knop toe" → WAAR en WAAROM ontbreken → Vraag: "Op welke pagina/component moet de knop komen, en wat moet hij doen?"
- "Het werkt niet" → ALLES ontbreekt → Vraag: "Wat probeer je te doen, en wat zie je in plaats van het verwachte resultaat?"

**Uitzonderingen** (direct handelen, niet vragen):
- De prompt bevat WAT + WAAR + WAAROM
- De gebruiker heeft code geselecteerd in VSCode (dat is de "WAAR")
- Het is een follow-up op een lopend gesprek waar de context al duidelijk is
- Het is een simpele vraag ("Wat doet deze functie?")

**Prompt templates** beschikbaar in `.claude/prompt-templates.md` — verwijs hiernaar als de gebruiker moeite heeft met het formuleren van prompts.

## ADHD Werkprotocol
- Eén taak tegelijk. Niet springen.
- Als Yorin afdwaalt: vriendelijk terugsturen naar het plan.
- Vier kleine overwinningen. Elke afgeronde taak is vooruitgang.
- Duidelijke "done" criteria per taak.
- Geen overweldigende lijsten — max 3-5 items tegelijk zichtbaar.

## MCP Servers
- **Supabase:** database queries, schema, migrations, edge functions, logs
- **Tavily:** web search and research
- **Sequential Thinking:** complex reasoning chains

## Deployment
- Production: dgskills.app (Vercel)
- Supabase project with active migrations and RLS policies

## Key Reference Documents
- **Lanceringsrapport:** `business/nl-vo/08-lanceringsrapport-compleet.md`
- **Juridisch rapport:** `business/nl-vo/09-juridisch-rapport-compleet.md`
- **Pricing:** `business/nl-vo/01-offer-packages-and-sla.md` + `02-pricing-matrix.md`
- **Compliance:** `business/nl-vo/04-compliance-and-procurement-pack.md`
- **Legal matrix:** `business/nl-vo/compliance/legal-matrix.md`
- **Pilot playbook:** `business/nl-vo/03-pilot-cohort-playbook.md`
- **USP strategie:** `business/nl-vo/07-usp-strategy-and-messaging.md`

## AI Act Classification
- **HIGH RISK** onder EU AI Act Annex III punt 3(b) — AI voor beoordeling leerresultaten.
- Deadline: **2 augustus 2026** — hoog-risico verplichtingen worden afdwingbaar.
- De classificatie "beperkt risico" in `08-lanceringsrapport` is INCORRECT.

## Open Issues (Pre-Launch Blockers)
1. `systemInstruction` wordt ongevalideerd vanuit client naar chat Edge Function gestuurd
2. Privacy-docs bevatten `[invullen]` placeholders (wacht op KvK)
3. Geen Algemene Voorwaarden
4. Geen KvK-inschrijving / juridische entiteit
5. Geen beroepsaansprakelijkheidsverzekering

## Resolved Issues (referentie, niet opnieuw doen)
CORS whitelist, Safety Settings, Welzijnsprotocol, DPIA, DPA Model 4.0, Verwerkingsregister, Vertex AI migratie, Privacyverklaring, AI-transparantieverklaring, FG/DPO adviesrapport.

## Launch Plan (ACTIEF)
- **Plan:** `LAUNCH-PLAN.md` — het actieve stappenplan
- **Protocol:** Begin ELKE chat door `LAUNCH-PLAN.md` te lezen. Rapporteer: huidige sprint, doel, volgende stap.
- **Updates:** Werk status bij na afgeronde taak (⬜ → ✅)

## Technical Context
- **Vertex AI:** `supabase/functions/chat/index.ts` en `scanReceipt/index.ts` via `europe-west4-aiplatform.googleapis.com`
- **Auth:** Service account via `_shared/vertexAuth.ts`, secret: `GOOGLE_SERVICE_ACCOUNT_KEY`
- **Data residency:** europe-west4 (Nederland)
- **Compliance docs:** `business/nl-vo/compliance/` (17 documenten)
