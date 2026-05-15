# DGSkills

DGSkills is een AI-gestuurd platform voor digitale geletterdheid in het Nederlandse voortgezet onderwijs. Leerlingen werken aan interactieve missies rond cybersecurity, AI-ethiek, mediawijsheid en datageletterdheid; docenten volgen voortgang via dashboards en rapportages.

De codebase gebruikt React 19, TypeScript, Vite, Tailwind CSS, Supabase en server-side AI-proxy's via Supabase Edge Functions. DGSkills verwerkt leerlingcontext en valt als onderwijs-AI onder een hoog risicoprofiel; behandel wijzigingen rond auth, Supabase, AI, dashboards, consent en leerlingdata daarom extra voorzichtig.

## Snel Starten

Vereisten:

- Node.js 18 of nieuwer
- Supabase project URL en anon key

```bash
npm install
cp .env.production.template .env.local
npm run dev
```

Vul in `.env.local` minimaal in:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

De devserver draait standaard op `http://localhost:3000`.

## Belangrijke Scripts

```bash
npm run context:budget      # compacte repo-size en dirty-worktree scan
npm run doctor              # critical TypeScript-check voor auth/Supabase-paden
npx tsc -p tsconfig.json --noEmit
npm run build:prod          # Vite productie-build + prerender
npm run preview             # preview van de productie-build
npm run audit:security      # dependency audit
```

`npm run doctor` is de first-line defense. Er is bewust geen ESLint/Prettier setup; houd wijzigingen klein en verifieer met TypeScript en buildchecks.

## Projectstructuur

```text
src/                React/Vite app-code
src/app/            React entrypoints, routing en private app-shell
src/features/       Lichtgewicht feature slices per productdomein
src/components/     Alleen gedeelde app-shell en UI-bouwstenen
src/services/       Supabase, AI, analytics en productservice-lagen
src/config/         Missies, agents, curriculum, thema's en tokens
src/hooks/          Gedeelde React hooks
src/contexts/       Gedeelde React contexts
src/types/          Generated en domeintypes
supabase/           Edge Functions, shared Deno code en migrations
public/             Runtime-static assets, gidsen en resources
docs/               Agent-, audit-, workflow- en interne documentatie
business/           Founder/business/compliance-pack documenten
bridge/             GitHub-agent-bridge inbox/outbox workflow
scripts/            Build-, QA-, audit- en ops-scripts
```

Lees `ARCHITECTURE.md` voor de model-agnostische kaart van entrypoints, risicolagen en navigatieregels.

## Development Workflow

Werk in kleine, reviewbare stappen. Gebruik path-scoped searches en vermijd brede diffs in deze repo. Voor wijzigingen aan auth, admin, Supabase, RLS, AI endpoints, consent, leerlingdata of compliance: behandel het werk als Rood-risico en verifieer permissions, privacy en failure modes expliciet.

Aanbevolen volgorde per wijziging:

```bash
npm run context:budget
npm run doctor
npm run build:prod
```

Gebruik `npx tsc -p tsconfig.json --noEmit` als brede regressiecheck, maar let op: de full check kan ook bestaande domeintype-issues tonen die buiten een cleanup vallen.

## Security en Privacy

- AI-calls mogen niet rechtstreeks vanuit de client naar provider keys gaan.
- Supabase Auth en RLS zijn leidend voor toegangscontrole.
- Leerlinginput moet gesanitized blijven voordat die naar database of AI gaat.
- Zie `SECURITY.md` en `docs/security/` voor audits en richtlijnen.

## Deploy

Productie loopt via Vercel:

```bash
npm run build:prod
npx vercel --prod
```

De build draait Vite en daarna `scripts/prerender.mjs` voor publieke SEO-routes.
