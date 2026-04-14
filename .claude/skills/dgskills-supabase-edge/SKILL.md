---
name: dgskills-supabase-edge
description: Use this skill when creating, modifying, debugging, or reviewing any Supabase Edge Function in the DGSkills project — including AI endpoints (chat, chatStream, scanReceipt), auth flows (parental consent, MFA, account deletion), data exports (GDPR), or any new function under `supabase/functions/`. Also trigger when editing shared code in `supabase/functions/_shared/` (cors, vertexAuth, promptSanitizer, rateLimiter, outputFilter, chatCore, systemInstructions). Trigger phrases: "edge function", "supabase function", "deno function", "nieuwe edge function", "vertex ai", "chat endpoint".
---

# DGSkills Supabase Edge Functions — Playbook

Edge functions zijn **het trust-boundary** van DGSkills. Alles wat hier verkeerd gaat, raakt data van minderjarigen in een HIGH RISK AI-context. Deze skill is de harde checklist + patroonbibliotheek voor alle edge-function-werk.

Gebaseerd op de officiële [Supabase Agent Skills](https://github.com/supabase/agent-skills) + DGSkills-specifieke security-eisen uit `supabase/CLAUDE.md` en `docs/security/`.

## Wanneer activeren

- Nieuwe edge function aanmaken onder `supabase/functions/<name>/index.ts`
- Bestaande edge function aanpassen (logica, validatie, response, secrets)
- Shared-code-wijziging in `supabase/functions/_shared/`
- Debug van AI-endpoints (Vertex AI via `_shared/vertexAuth.ts`)
- Migratie van client-side logica naar edge function

## Verplichte leesvolgorde

1. `supabase/CLAUDE.md` — data safety regels (verplicht voor deze subtree)
2. `SECURITY.md` — project security controls
3. `supabase/functions/_shared/cors.ts` — allowed origins
4. `supabase/functions/_shared/vertexAuth.ts` — Vertex AI service account flow
5. `supabase/functions/_shared/promptSanitizer.ts` — injection patronen
6. `supabase/functions/_shared/rateLimiter.ts` — rate limit patroon
7. `supabase/functions/_shared/systemInstructions.ts` — server-side prompt logic
8. Een vergelijkbare bestaande functie als voorbeeld (bv. `chat/index.ts` of `scanReceipt/index.ts`)

## Invarianten — ALTIJD actief

### 1. Runtime & imports

- **Runtime**: Deno (geen Node)
- **Imports**: uitsluitend `esm.sh`, `deno.land/std`, of relatieve paden naar `_shared/`
- **Geen npm packages** direct; gebruik `esm.sh` wrappers als nodig
- **Gedeelde code**: `supabase/functions/_shared/` en importeer via relatief pad (`../_shared/cors.ts`)

### 2. CORS (niet-onderhandelbaar)

```typescript
import { buildCorsHeaders, rejectDisallowedBrowserRequest } from "../_shared/cors.ts";

const corsHeaders = buildCorsHeaders(req, "POST, OPTIONS");

if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
}

const disallowed = rejectDisallowedBrowserRequest(req, corsHeaders);
if (disallowed) return disallowed;
```

- ❌ Nooit `Access-Control-Allow-Origin: *`
- ✅ Alleen `dgskills.app` + localhost dev (via `_shared/cors.ts`)
- ✅ `ENVIRONMENT=production` filtert dev-origins automatisch weg

### 3. Auth-validatie

Elke endpoint die PII of user-state raakt:

```typescript
const authHeader = req.headers.get("Authorization");
if (!authHeader) {
    return new Response(JSON.stringify({ error: "Niet geautoriseerd." }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
}

// Valideer tegen Supabase auth
const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
);

const { data: { user }, error } = await supabase.auth.getUser();
if (error || !user) {
    return new Response(JSON.stringify({ error: "Ongeldige sessie." }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
}
```

- ❌ Geen anonieme endpoints tenzij expliciet ontworpen (bv. `submitPilotRequest`, `trackClickEvent`)
- ✅ Role-checks server-side (niet op client `user.role` vertrouwen)

### 4. Secrets

- ✅ `Deno.env.get("SECRET_NAME")` — set via `supabase secrets set` of Supabase dashboard
- ❌ Nooit hardcoden
- ❌ Nooit in logs printen (`console.log(Deno.env.get(...))` is een blokker)
- ✅ Bij Vertex AI: gebruik `_shared/vertexAuth.ts` → `GOOGLE_SERVICE_ACCOUNT_KEY`

### 5. Input-validatie (server-side, altijd)

Client-side validatie telt niet. Server moet opnieuw valideren:

```typescript
let body: unknown;
try {
    body = await req.json();
} catch {
    return badRequest("Ongeldige JSON.", corsHeaders);
}

if (!body || typeof body !== "object") {
    return badRequest("Ongeldige body.", corsHeaders);
}

const { message, roleId } = body as { message?: unknown; roleId?: unknown };

if (typeof message !== "string" || message.length === 0 || message.length > 4000) {
    return badRequest("Ongeldig bericht.", corsHeaders);
}
```

### 6. AI-endpoints — extra regels

- [ ] `systemInstruction` komt uit `getSystemInstruction(roleId)` server-side; **nooit** van client
- [ ] User message door `promptSanitizer` (homoglyph-normalisatie + 40+ injection-patronen NL+EN)
- [ ] Rate limiting via `_shared/rateLimiter.ts` (per user + per IP)
- [ ] AI-respons door `_shared/outputFilter.ts` vóór terugsturen
- [ ] Vertex AI-endpoint: `europe-west4-aiplatform.googleapis.com` (data residency EU)
- [ ] Timeout op Vertex calls (30s max) om hangende requests te voorkomen
- [ ] Audit-log elk AI-gesprek (Art. 12 AI Act): user-id, roleId, timestamp, token-count (niet de volledige tekst als dat de DPIA overschrijdt)

### 7. Error responses

- ✅ Generieke Nederlandse foutmelding naar client
- ✅ Gedetailleerde logs server-side (`console.error` met context)
- ❌ Geen stack traces naar client
- ❌ Geen DB-kolomnamen of SQL-fragmenten in response
- ❌ Geen interne paden (`/home/...`, `deno-deploy://...`) lekken

```typescript
// Goed:
return new Response(JSON.stringify({ error: "Er ging iets mis. Probeer het opnieuw." }), {
    status: 500,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
});
console.error("chat handler failed", { userId: user.id, error: err });

// Fout:
return new Response(JSON.stringify({ error: err.stack }), { status: 500 });
```

### 8. Data minimalisatie

- ✅ Retourneer alleen velden die de client nodig heeft
- ❌ Geen `SELECT *` naar client sturen
- ❌ Geen PII loggen die niet in DPIA staat
- ✅ Voor export-endpoints (`exportMyData`, `deleteMyAccount`): controleer parental consent + AVG-recht

### 9. RLS respecteren

- Edge functions kunnen de anon-client met `Authorization`-header gebruiken → RLS blijft actief
- Gebruik **service role** alleen bewust en beperkt (bv. admin-operaties, cleanup jobs)
- Bij service role: expliciet commentaar waarom RLS wordt omzeild

## Template voor een nieuwe edge function

```typescript
// supabase/functions/<name>/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { buildCorsHeaders, rejectDisallowedBrowserRequest } from "../_shared/cors.ts";

function badRequest(message: string, corsHeaders: Record<string, string>) {
    return new Response(JSON.stringify({ error: message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
}

serve(async (req) => {
    const corsHeaders = buildCorsHeaders(req, "POST, OPTIONS");

    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    const disallowed = rejectDisallowedBrowserRequest(req, corsHeaders);
    if (disallowed) return disallowed;

    if (req.method !== "POST") {
        return new Response(JSON.stringify({ error: "Methode niet toegestaan." }), {
            status: 405,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    // 1. Auth check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
        return new Response(JSON.stringify({ error: "Niet geautoriseerd." }), {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!,
        { global: { headers: { Authorization: authHeader } } },
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return new Response(JSON.stringify({ error: "Ongeldige sessie." }), {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    // 2. Input-validatie
    let body: unknown;
    try {
        body = await req.json();
    } catch {
        return badRequest("Ongeldige JSON.", corsHeaders);
    }

    // TODO: specifieke validatie

    // 3. Business logic (RLS blijft actief via supabase client)
    try {
        // ...
        return new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    } catch (err) {
        console.error("<name> handler failed", { userId: user.id, error: err });
        return new Response(JSON.stringify({ error: "Er ging iets mis." }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
```

## Lokale development

```bash
# Serve alle functies lokaal
supabase functions serve

# Specifieke functie met secrets
supabase functions serve chat --env-file ./supabase/.env.local

# Deploy naar staging/productie
supabase functions deploy <name>

# Secret zetten
supabase secrets set MY_SECRET=value

# Logs bekijken
supabase functions logs <name>
```

## Deploy-checklist

- [ ] Lokaal getest met `supabase functions serve`
- [ ] Benodigde secrets gezet via `supabase secrets set`
- [ ] CORS-origins correct voor productie (`ENVIRONMENT=production`)
- [ ] Rate limiting actief (voor public-facing endpoints)
- [ ] Auth-check aanwezig (tenzij expliciet anoniem)
- [ ] Error responses generiek, geen interne details
- [ ] Compliance-check gedraaid (`dgskills-compliance-check` skill)

## Anti-patronen — NOOIT doen

- ❌ `systemInstruction` vanuit client accepteren
- ❌ `Access-Control-Allow-Origin: *`
- ❌ Secrets hardcoden of loggen
- ❌ User input direct in SQL of Vertex-prompt zonder validatie/sanitization
- ❌ `console.log` met PII (email, naam, leerling-ID zonder reden)
- ❌ RLS omzeilen met service role zonder expliciete rechtvaardiging
- ❌ Stack traces of DB-errors naar client sturen
- ❌ npm packages (alleen esm.sh)
- ❌ Sync code in plaats van async (edge runtime is event-loop)
- ❌ Lange-lopende taken zonder timeout

## Output-verwachting (na oplevering)

Lever altijd:

1. **Wat de functie doet** in 1 zin
2. **Welke trust-boundaries** worden overschreden (auth, AI, PII, externe API)
3. **Welke secrets** nodig zijn
4. **Privacy-impact** in gewone taal (DPIA-relevant ja/nee)
5. **Test-instructies** (curl-voorbeeld of handmatige stappen)

## Referentie-voorbeelden

- AI-chat met sanitization + rate limit: `supabase/functions/chat/index.ts`
- Anoniem public endpoint: `supabase/functions/submitPilotRequest/index.ts`
- GDPR data-export: `supabase/functions/exportMyData/index.ts`
- Parental consent flow: `supabase/functions/approveParentalConsent/index.ts`
- Vertex AI vision: `supabase/functions/scanReceipt/index.ts`
