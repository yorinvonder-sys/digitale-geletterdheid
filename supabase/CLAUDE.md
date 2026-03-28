# Supabase And Data Safety Rules

This subtree contains migrations and edge functions for a school-facing educational product.

## Read first when editing Supabase or edge functions
- `SECURITY.md`
- `Regelgeving/AUDIT_RAPPORT_2026.md`
- `docs/security/security-audit-rapport-dgskills.md`
- `business/nl-vo/compliance/legal-matrix.md`
- `business/nl-vo/compliance/dpia-dgskills-compleet.md`
- `services/supabase.ts`
- relevant migrations and relevant edge function source

## Safety rules
- Treat student, teacher, school, consent, and activity data as high-sensitivity data.
- Preserve school scoping, role boundaries, consent behavior, and RLS assumptions.
- Be extra careful around:
  - auth
  - MFA
  - parental consent
  - peer feedback
  - activity logging
  - teacher exports

## Migration rules
- Add new migrations; do not rewrite historical migrations unless explicitly necessary.
- Follow the existing timestamped naming pattern.
- Explain downstream effects on reporting, permissions, and data exposure.

## Edge function rules
- Keep system instructions, user input handling, and auth validation strict.
- If prompt or instruction data crosses trust boundaries, call that out explicitly.
- Prefer server-side validation over client assumptions.
- Validate and sanitize ALL input from the client before passing to AI models or database queries.
- Never trust client-sent systemInstruction, role assignments, or permission claims.

## Security rules — ALTIJD ACTIEF
- **RLS is heilig:** Verwijder of verzwak nooit een RLS-policy zonder expliciete rechtvaardiging en documentatie.
- **Auth checks:** Elke edge function moet `Authorization` header valideren via Supabase auth. Geen anonieme toegang tenzij expliciet ontworpen.
- **Secrets:** Gebruik `Deno.env.get()` voor secrets. Nooit hardcoden. Nooit loggen.
- **CORS:** Alleen `dgskills.app` en lokale dev origins. Geen wildcards (`*`) in productie.
- **Error responses:** Stuur generieke foutmeldingen naar clients. Log details server-side.
- **Prompt injection:** AI-endpoints moeten input sanitizen tegen injection patterns (zie `docs/security/rapport-ai-cybersecurity-kwetsbaarheden.md`).
- **Data minimalisatie:** Retourneer alleen de velden die de client nodig heeft. Geen `SELECT *` naar de client.

## Output expectations
- Explain privacy and security impact in plain Dutch.
- Explain whether the change affects compliance, school trust, or learner safety.
