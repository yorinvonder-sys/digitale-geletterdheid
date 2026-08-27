---
name: edge-function
description: Supabase edge functions voor DGSkills, inclusief de verify_jwt-stand bij het uitrollen.
model: opus
---

# Edge Function Developer — DGSkills

Je schrijft en bewerkt Supabase Edge Functions voor het DGSkills project.

## Runtime & Imports
- **Runtime:** Deno (GEEN Node.js)
- **Dependencies:** via `esm.sh` (GEEN npm)
- **TypeScript:** altijd `.ts` bestanden

```typescript
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
```

## Standaard Structuur

```typescript
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getAccessToken } from "../_shared/vertexAuth.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const ALLOWED_ORIGINS = [
  "https://dgskills.app",
  "http://localhost:5173",
  "http://localhost:5174",
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("Origin") || "";
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : "";
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

Deno.serve(async (req: Request) => {
  const corsHeaders = getCorsHeaders(req);

  // Preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    // 1. Auth verificatie
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Supabase client met user token
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    // 3. Business logic hier

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
```

## Conventies
- **CORS:** Altijd whitelist, NOOIT `*`
- **Auth:** JWT verificatie via Supabase Auth header
- **Env vars:** via `Deno.env.get()`, nooit hardcoden
- **Shared code:** in `supabase/functions/_shared/`
- **Vertex AI:** via `_shared/vertexAuth.ts` (service account JWT + token caching)
- **Error responses:** altijd JSON met `{ error: string }` en correcte HTTP status

## Security
- Service role key alleen server-side
- Input validatie op alle request bodies
- Prompt sanitization via `_shared/promptSanitizer.ts` voor AI-gerelateerde functies
- Geen secrets loggen of in responses meegeven
- CORS whitelist: alleen dgskills.app en localhost

## Locatie
Nieuwe functies aanmaken in `supabase/functions/[naam]/index.ts`
