# Project: AI Lab - Future Architect (DGSkills)

@.claude/project-context.md
@.claude/skill-router.md
@.claude/acceptance-checklist.md
@.claude/workstreams.md
@.claude/adhd-format.md
@.claude/current-task.md
@.claude/task-queue.md
@.claude/progress-log.md

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
- **Model voor implementatie-agents: altijd Sonnet 4.6 (`model: "sonnet"`)** — alle agents die na de planningsfase worden ingezet (code schrijven, configs genereren, bestanden aanmaken) moeten expliciet `model: "sonnet"` meekrijgen. Opus 4.6 is alleen voor de hoofdconversatie (planning, review, beslissingen). Vermeld altijd het model bij het spawnen van agents.

## Autonome Scoping — VERPLICHT

**Claude werkt repo-first en context-first.**

Bij een onvolledige prompt moet Claude meestal niet terugkaatsen met een lijst ontbrekende velden, maar:
1. eerst de relevante code en lokale documentatie lezen
2. zelf een redelijke scope bepalen
3. expliciete aannames noteren
4. pas een vraag stellen als een verkeerde aanname grote gevolgen kan hebben

### Standaardgedrag
- Zoek eerst zelf uit **WAT**, **WAAR**, **WAAROM**, doelgroep, leerjaar, periode en SLO-koppeling als dat redelijk te herleiden is uit de repo.
- Gebruik de lokale DGSkills-documentatie als standaardkader.
- Reageer niet met alleen placeholder-coaching als je voldoende context uit de codebase kunt halen.
- Geef altijd ook uitleg in gewone taal voor een niet-programmerende product owner.

### Wanneer wel terugvragen
- Er zijn meerdere plausibele scopes die wezenlijk ander productgedrag opleveren.
- De keuze raakt privacy, veiligheid, compliance, data model, of school-facing claims.
- De gebruiker moet een productbeslissing nemen die je niet veilig kunt raden.

### Wat Claude standaard oplevert
- wat er gebouwd of onderzocht is
- welke aannames zijn gemaakt
- welke bestanden of systemen zijn geraakt
- welke SLO-doelen en didactische principes relevant zijn
- uitleg in gewone taal
- wat de gebruiker hierover kan zeggen in een demo, pilot of verkoopgesprek

### Handoff protocol
- Read `.claude/current-task.md` as the active baton for what should happen next.
- Read `.claude/task-queue.md` for the follow-up order after the current baton is done.
- If the user gives no new priority, continue from the baton and queue.
- If the user does override, follow the user and then resume the queue later.

### Prompt voorbeelden
- Voor herbruikbare gebruikersprompts: zie `.claude/prompt-templates.md`
- Voor vaste operatorflow: zie `.claude/operator-sessions.md`
- Voor feature-uitleg na oplevering: zie `.claude/feature-handover-template.md`

## ADHD Werkprotocol
- Eén taak tegelijk. Niet springen.
- Als Yorin afdwaalt: vriendelijk terugsturen naar het plan.
- Vier kleine overwinningen. Elke afgeronde taak is vooruitgang.
- Duidelijke "done" criteria per taak.
- Geen overweldigende lijsten — max 3-5 items tegelijk zichtbaar.
- Gebruik altijd de compacte statusweergave uit `.claude/adhd-format.md`.
- Label altijd de huidige werkstroom met een naam uit `.claude/workstreams.md`.
- Benoem expliciet fasewissels en scopewissels.
- Zeg expliciet `Jij hoeft nu niets te doen.` als er geen actie nodig is van de gebruiker.
- In ELKE nieuwe sessie moet de eerste inhoudelijke reactie direct beginnen met het statusblok uit `.claude/adhd-format.md`.
- Sla dit niet over, ook niet als de gebruiker alleen een korte opdracht geeft.
- **Sessie-opening ritueel:** Volg stappen 1-4 uit `.claude/adhd-format.md` (Identiteit → Momentum → Statusblok → Volgende stap).
- **Sessie-afsluiting:** Schrijf een entry in `.claude/progress-log.md`, update stats en baton. Zie `.claude/adhd-format.md`.
- **Progress log:** `.claude/progress-log.md` is de bron voor streak-tracking en momentum. Lees de laatste 3 entries bij sessie-start.

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

## Security & Cybersecurity — VERPLICHT

**DGSkills verwerkt data van minderjarigen in een HIGH RISK AI-context. Security is geen nice-to-have maar een harde eis.**

### Altijd-actieve security regels

Bij ELKE code-wijziging checkt Claude automatisch:

1. **OWASP Top 10** — Geen XSS, SQL injection, CSRF, SSRF, command injection, path traversal, of insecure deserialization introduceren.
2. **Input validatie** — Alle user input (formulieren, URL params, API bodies, AI prompts) wordt server-side gevalideerd en gesanitized. Vertrouw nooit op client-side validatie alleen.
3. **Output encoding** — Alle dynamische content in HTML wordt geëscaped. DOMPurify voor user-generated HTML.
4. **Authentication & Authorization** — Supabase RLS is de primaire access control. Controleer dat RLS-policies intact blijven bij schema-wijzigingen. MFA (AAL2) is verplicht voor docent- en adminrollen.
5. **Secrets management** — Geen secrets, API keys, tokens, of credentials in code, logs, of client-side bundles. Gebruik environment variables en Supabase secrets.
6. **Data minimalisatie** — Verzamel alleen data die nodig is. Geen onnodige PII opslaan. Respecteer de DPIA en het verwerkingsregister.
7. **Prompt injection preventie** — AI-interacties moeten beschermd zijn tegen prompt injection (40+ patronen, NL + EN). SystemInstruction mag niet door de client worden bepaald.
8. **Dependency security** — Geen packages met bekende CVEs toevoegen. Bij `npm install` altijd `npm audit` overwegen.
9. **Error handling** — Geen stack traces, interne paden, of database-structuur lekken naar de client. Gebruik generieke foutmeldingen voor gebruikers.
10. **Transport security** — Alle communicatie via HTTPS. CSP headers intact houden. Geen `unsafe-inline` of `unsafe-eval` in script-src.

### Security-gevoelige bestanden (extra voorzichtigheid)

- `supabase/functions/chat/index.ts` — AI endpoint, prompt injection risico
- `supabase/functions/chatStream/index.ts` — streaming AI endpoint
- `supabase/functions/_shared/vertexAuth.ts` — service account authenticatie
- `supabase/functions/_shared/cors.ts` — CORS whitelist
- `services/PermissionService.ts` — role-based access control
- `services/supabase.ts` — database client configuratie
- Alle bestanden in `supabase/migrations/` — RLS policies, schema

### Wanneer Claude moet waarschuwen

- Een wijziging raakt auth, RLS, CORS, of permission logic → **altijd expliciet benoemen**
- Een nieuwe dependency wordt toegevoegd → **check of het een bekende, onderhouden package is**
- User input wordt doorgegeven aan een database query of AI prompt → **sanitization verifiëren**
- Een edge function ontvangt data van de client → **server-side validatie verplicht**
- Compliance-docs of privacy-claims worden aangepast → **check tegen product-werkelijkheid**

### Security referentiedocumenten
- `SECURITY.md` — vulnerability reporting en bekende controls
- `docs/security/security-audit-rapport-dgskills.md` — laatste security audit
- `docs/security/rapport-ai-cybersecurity-kwetsbaarheden.md` — AI-specifieke kwetsbaarheden
- `Regelgeving/AUDIT_RAPPORT_2026.md` — compliance audit
- `business/nl-vo/compliance/dpia-dgskills-compleet.md` — DPIA
- `business/nl-vo/compliance/legal-matrix.md` — juridisch kader

## AI Act Classification
- **HIGH RISK** onder EU AI Act Annex III punt 3(b) — AI voor beoordeling leerresultaten.
- Deadline: **2 augustus 2026** — hoog-risico verplichtingen worden afdwingbaar.
- De classificatie "beperkt risico" in `08-lanceringsrapport` is INCORRECT.

## Open Issues (Pre-Launch Blockers)
1. ~~`systemInstruction` wordt ongevalideerd vanuit client naar chat Edge Function gestuurd~~ **OPGELOST** — server valideert via `roleId` + `getSystemInstruction()`
2. ~~Privacy-docs bevatten `[invullen]` placeholders~~ **OPGELOST** (28 mrt 2026) — KvK 81819889, FG: Yorin Vonder
3. ~~Geen Algemene Voorwaarden~~ **CONCEPT GEREED** (28 mrt 2026) — `business/nl-vo/compliance/algemene-voorwaarden-dgskills.md` — moet nog door jurist worden gereviewed
4. ~~Geen KvK-inschrijving / juridische entiteit~~ **OPGELOST** — Eenmanszaak DGSkills.app, KvK 81819889
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
