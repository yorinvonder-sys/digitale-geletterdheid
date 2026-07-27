# AI Chat

Deze folder bevat de chat-UI waarmee leerlingen met een AI-assistent praten: de chatweergave, losse berichtbubbels en de verplichte AI-transparantiebadge.

Belangrijke ingangen:

- `StudentAIChat.tsx`
- `ChatBubble.tsx`
- `AiDisclosureBadge.tsx`
- `src/hooks/useStudentAssistant.ts`
- `src/hooks/useChatSession.ts`
- `src/services/aiProviderService.ts`

Deze folder bevat uitsluitend clientcode. Het model wordt aangeroepen via `supabase/functions/chat/` en `supabase/functions/chatStream/`; systeem-prompts, sanitisatie en outputfilters staan server-side in `supabase/functions/_shared/`. Zet hier geen providersleutels of prompts neer.

Rood risico: dit is een AI-interactie met minderjarigen. `AiDisclosureBadge.tsx` is geen decoratie maar een transparantieverplichting — verwijder of verberg die niet zonder juridische toets.
