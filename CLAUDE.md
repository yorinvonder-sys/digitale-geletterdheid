# Project: AI Lab - Future Architect (DGSkills)

## Stack
- React 19 + TypeScript + Vite
- Supabase (auth, database, edge functions, RLS)
- Tailwind CSS + Framer Motion
- Google Gemini API (@google/genai)
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
- **Lanceringsrapport (compleet):** `business/nl-vo/08-lanceringsrapport-compleet.md` — Bevat security audit, didactische analyse, docentvriendelijkheid review, business model analyse en 90-dagen lanceringsplan. Raadpleeg dit document bij elke sessie over lancering, compliance, didactiek of business.
- **Pricing & pakketten:** `business/nl-vo/01-offer-packages-and-sla.md` + `business/nl-vo/02-pricing-matrix.md`
- **Compliance & inkoop:** `business/nl-vo/04-compliance-and-procurement-pack.md`
- **Legal matrix:** `business/nl-vo/compliance/legal-matrix.md`
- **Pilot playbook:** `business/nl-vo/03-pilot-cohort-playbook.md`
- **USP strategie:** `business/nl-vo/07-usp-strategy-and-messaging.md`

## Known Issues (Pre-Launch Blockers)
1. CORS `Access-Control-Allow-Origin: *` op alle Edge Functions — moet beperkt worden tot `https://dgskills.app`
2. `systemInstruction` wordt ongevalideerd vanuit client naar chat Edge Function gestuurd
3. Privacy-docs bevatten `[invullen]` placeholders die ingevuld moeten worden
4. Verwerkersovereenkomst (DPA) is nog een template, geen ondertekend document
