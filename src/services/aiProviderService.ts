// AI chat, streaming, and image generation via Edge Functions.
// Chat object is maintained client-side; API key stays server-side.

import { logger } from '@/utils/logger';
import { toServiceError } from '@/utils/errorMessages';
import { EDGE_FUNCTION_URL, authenticatedFetch } from './supabase';
import { logAiInteraction } from './auditService';
import { sanitizePrompt } from '@/utils/promptSanitizer';
import { markAiGeneratedText } from '@/utils/aiContentMarker';
import {
  type GenerateImageResponse,
  type ImageAspectRatio,
  type ImageGenerationStyle,
} from './imageGenerationLogic';

export type { ImageAspectRatio, ImageGenerationStyle } from './imageGenerationLogic';

// ── Fallback guard: local simulation only in DEV (AI Act Art. 50 + NIS2) ──
const ALLOW_LOCAL_FALLBACK = (() => {
  try {
    return (import.meta as any).env?.DEV === true;
  } catch { return false; }
})();

// Client-side rate limiting (Cbw Zorgplicht)
const AI_RATE_LIMIT = {
  maxPerMinute: 10,
  maxPerHour: 60,
  timestamps: [] as number[],
};

function checkAiRateLimit(): { allowed: boolean; reason?: string } {
  const now = Date.now();
  AI_RATE_LIMIT.timestamps = AI_RATE_LIMIT.timestamps.filter(t => now - t < 3600000);

  const lastMinute = AI_RATE_LIMIT.timestamps.filter(t => now - t < 60000).length;
  if (lastMinute >= AI_RATE_LIMIT.maxPerMinute) {
    return { allowed: false, reason: 'Je stuurt te veel berichten. Wacht even en probeer opnieuw.' };
  }
  if (AI_RATE_LIMIT.timestamps.length >= AI_RATE_LIMIT.maxPerHour) {
    return { allowed: false, reason: 'Je hebt het maximale aantal AI-verzoeken per uur bereikt.' };
  }

  AI_RATE_LIMIT.timestamps.push(now);
  return { allowed: true };
}

function createAiRequestId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `ai_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 1): Promise<Response> {
  let retries = 0;
  while (true) {
    try {
      const response = await fetch(url, options);
      if (response.status >= 500 && response.status <= 599 && retries < maxRetries) {
        retries++;
        const delay = Math.pow(2, retries - 1) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      return response;
    } catch (error: any) {
      if (retries >= maxRetries) {
        throw error;
      }
      retries++;
      const delay = Math.pow(2, retries - 1) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}


// --- Chat session ---

interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

interface ChatSessionOptions {
  fallbackRoleId?: string;
  localMissionContext?: string;
}

interface EdgeErrorPayload {
  error?: string;
  reason?: string;
  message?: string;
}

const DEFAULT_FALLBACK_ROLE_ID = 'student-assistant';

export class Chat {
  private history: ChatMessage[] = [];
  private roleId: string;
  private systemInstruction: string;
  private gameContext: string | null = null;
  private fallbackRoleId: string;
  private localMissionContext: string;

  constructor(roleId: string, systemInstruction?: string, options?: ChatSessionOptions) {
    this.roleId = roleId;
    // systemInstruction is kept only for local DEV fallback simulation — never sent to the server
    this.systemInstruction = systemInstruction || '';
    this.fallbackRoleId = options?.fallbackRoleId || DEFAULT_FALLBACK_ROLE_ID;
    this.localMissionContext = (options?.localMissionContext || '').trim();
  }

  /** Set current game code context (bypasses sanitizer — this is our own code, not user input) */
  setGameContext(code: string | null) {
    this.gameContext = code;
  }

  getHistory(): ChatMessage[] {
    return [...this.history];
  }

  private trimHistory(): void {
    if (this.history.length > 12) {
      this.history = this.history.slice(-12);
    }
  }

  private buildRequestBody(message: string, roleId: string, clientRequestId: string): Record<string, unknown> {
    const requestBody: Record<string, unknown> = {
      message,
      roleId,
      history: this.history.slice(0, -1),
      clientRequestId,
    };

    if (this.gameContext) {
      requestBody.gameContext = this.gameContext;
    }

    return requestBody;
  }

  private buildFallbackRoleMessage(message: string): string {
    const compactContext = this.localMissionContext.replace(/\s+/g, ' ').trim().slice(0, 700);
    if (!compactContext) return message;

    return `${message}\n\n[MISSIE_CONTEXT]\n${compactContext}\n[/MISSIE_CONTEXT]`;
  }

  private async sendEdgeRequest(
    endpoint: 'chat' | 'chatStream',
    message: string,
    roleId: string,
    clientRequestId: string
  ): Promise<Response> {
    return authenticatedFetch(`${EDGE_FUNCTION_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.buildRequestBody(message, roleId, clientRequestId))
    }, {
      fetcher: fetchWithRetry,
      onSessionExpired: 'throw',
      sessionExpiredMessage: 'Je sessie is verlopen. Log opnieuw in.',
    });
  }

  private async getEdgeErrorPayload(response: Response): Promise<EdgeErrorPayload> {
    return response.clone().json().catch(() => ({}));
  }

  private isRoleMismatchError(status: number, error?: EdgeErrorPayload): boolean {
    if (status !== 400) return false;

    const raw = `${error?.reason || ''} ${error?.message || ''} ${error?.error || ''}`.toLowerCase();
    return raw.includes('roleid') || raw.includes('role id');
  }

  private shouldRetryWithFallbackRole(status: number, error?: EdgeErrorPayload): boolean {
    return this.roleId !== this.fallbackRoleId && this.isRoleMismatchError(status, error);
  }

  private buildEdgeErrorMessage(status: number, error?: EdgeErrorPayload): string {
    if (status === 401) return 'Je sessie is verlopen. Log opnieuw in.';
    if (status === 403) return error?.reason || 'Deze AI-functie is niet toegestaan vanaf deze omgeving.';
    if (status === 422) return error?.reason || 'Je bericht kon niet worden verwerkt.';
    if (status === 429) return error?.reason || 'Te veel AI-verzoeken. Wacht even en probeer opnieuw.';
    if (this.isRoleMismatchError(status, error)) {
      return 'Deze missie is nog niet gekoppeld aan de AI-backend. Probeer het opnieuw of kies tijdelijk een andere missie.';
    }
    if (status >= 500) return 'AI is tijdelijk niet beschikbaar. Probeer het later opnieuw.';

    return error?.reason || error?.message || error?.error || `AI request failed (${status}).`;
  }

  private shouldBubbleError(error: unknown): boolean {
    const message = error instanceof Error ? error.message : String(error);
    return /sessie|log opnieuw in|niet toegestaan|niet gekoppeld|kon niet worden verwerkt|te veel ai-verzoeken/i.test(message);
  }

  private async performRequestWithRoleFallback(
    endpoint: 'chat' | 'chatStream',
    cleanMessage: string,
    clientRequestId: string
  ): Promise<{ response: Response; usedFallbackRole: boolean }> {
    let response = await this.sendEdgeRequest(endpoint, cleanMessage, this.roleId, clientRequestId);
    let error = response.ok ? undefined : await this.getEdgeErrorPayload(response);

    if (!response.ok && this.shouldRetryWithFallbackRole(response.status, error)) {
      console.warn(`[AiProviderService] roleId "${this.roleId}" not available server-side, retrying with "${this.fallbackRoleId}"`);
      response = await this.sendEdgeRequest(
        endpoint,
        this.buildFallbackRoleMessage(cleanMessage),
        this.fallbackRoleId,
        clientRequestId
      );
      return { response, usedFallbackRole: true };
    }

    return { response, usedFallbackRole: false };
  }

  async sendMessage(params: { message: string }): Promise<{ text: string }> {
    const { message } = params;

    // M-03: Check AI rate limit before processing
    const rateCheck = checkAiRateLimit();
    if (!rateCheck.allowed) {
      return { text: rateCheck.reason || 'Te veel verzoeken. Probeer later opnieuw.' };
    }

    // H-03: Sanitize user input against prompt injection (OWASP LLM01)
    const sanitizeResult = sanitizePrompt(message);
    if (sanitizeResult.wasBlocked) {
      return { text: sanitizeResult.reason || 'Je bericht kon niet worden verwerkt.' };
    }
    const cleanMessage = sanitizeResult.sanitized;
    const clientRequestId = createAiRequestId();

    this.history.push({
      role: 'user',
      parts: [{ text: cleanMessage }]
    });

    try {
      const { response } = await this.performRequestWithRoleFallback('chat', cleanMessage, clientRequestId);

      if (!response.ok) {
        const error = await this.getEdgeErrorPayload(response);
        const message = this.buildEdgeErrorMessage(response.status, error);

        if (ALLOW_LOCAL_FALLBACK && response.status >= 500) {
          console.warn('Backend AI request failed, falling back to local simulation (DEV only)', error);
          const fallbackResponse = await simulateLocalResponse(this.systemInstruction, cleanMessage);
          this.history.push({ role: 'model', parts: [{ text: fallbackResponse }] });
          this.trimHistory();
          logAiInteraction('chat', { model: 'local-fallback', fallback_used: true }).catch(() => { });
          return { text: fallbackResponse };
        }

        logAiInteraction('chat', { model: 'mistral', fallback_used: false }).catch(() => { });
        throw new Error(message);
      }

      const data = await response.json();
      const responseText = data.text || '';

      this.history.push({ role: 'model', parts: [{ text: responseText }] });
      this.trimHistory();

      return { text: responseText };
    } catch (error: any) {
      const message = error instanceof Error ? error.message : 'AI is tijdelijk niet beschikbaar. Probeer het later opnieuw.';
      if (!ALLOW_LOCAL_FALLBACK || this.shouldBubbleError(error)) {
        throw new Error(message);
      }

      console.warn('Chat proxy network error, falling back to local simulation (DEV only):', error);
      const fallbackResponse = await simulateLocalResponse(this.systemInstruction, cleanMessage);
      this.history.push({ role: 'model', parts: [{ text: fallbackResponse }] });
      this.trimHistory();
      logAiInteraction('chat', { model: 'local-fallback', fallback_used: true }).catch(() => { });
      return { text: fallbackResponse };
    }
  }

  async *sendMessageStream(params: { message: string }): AsyncGenerator<{ text: string }, void, unknown> {
    const { message } = params;

    // G-01 FIX: Add rate limiting to streaming path (Cbw Zorgplicht)
    const rateCheck = checkAiRateLimit();
    if (!rateCheck.allowed) {
      yield { text: rateCheck.reason || 'Te veel verzoeken. Probeer later opnieuw.' };
      return;
    }

    // G-01 FIX: Sanitize user input against prompt injection (OWASP LLM01)
    const sanitizeResult = sanitizePrompt(message);
    if (sanitizeResult.wasBlocked) {
      yield { text: sanitizeResult.reason || 'Je bericht kon niet worden verwerkt.' };
      return;
    }
    const cleanMessage = sanitizeResult.sanitized;
    const clientRequestId = createAiRequestId();

    this.history.push({
      role: 'user',
      parts: [{ text: cleanMessage }]
    });

    try {
      const { response } = await this.performRequestWithRoleFallback('chatStream', cleanMessage, clientRequestId);

      if (!response.ok) {
        const error = await this.getEdgeErrorPayload(response);
        throw new Error(this.buildEdgeErrorMessage(response.status, error));
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      if (!reader) throw new Error('No response body');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              this.history.push({ role: 'model', parts: [{ text: fullText }] });
              this.trimHistory();
              return;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                fullText += parsed.text;
                yield { text: parsed.text };
              }
            } catch (e) {
              // Ignore parse errors for incomplete chunks
            }
          }
        }
      }
    } catch (error) {
      if (!ALLOW_LOCAL_FALLBACK || this.shouldBubbleError(error)) {
        const message = error instanceof Error ? error.message : 'AI is tijdelijk niet beschikbaar. Probeer het later opnieuw.';
        yield { text: message };
        return;
      }

      console.warn('Streaming failed, simulating local response (DEV only)...', error);
      const fallbackResponse = await simulateLocalResponse(this.systemInstruction, cleanMessage);
      const words = fallbackResponse.split(' ');
      let accumulated = "";

      for (const word of words) {
        const chunk = word + ' ';
        accumulated += chunk;
        yield { text: chunk };
        await new Promise(r => setTimeout(r, 50));
      }

      this.history.push({ role: 'model', parts: [{ text: accumulated }] });
      this.trimHistory();
    }
  }
}

async function simulateLocalResponse(systemInstruction: string, userMessage: string): Promise<string> {
  console.log("Simulating local response for:", userMessage);

  if (systemInstruction.includes('Fact-Checker') || userMessage.includes('start de missie')) {
    if (userMessage.toLowerCase().includes('start') || userMessage.toLowerCase().includes('zaak')) {
      return `Hier is je eerste zaak! Onderzoek de foto en bepaal of het echt of nep is.
      
[CASE]
{
  "title": "Vliegende Auto in Amsterdam?",
  "description": "Een foto gaat viral waarop een vliegende auto boven de grachten te zien is.",
  "imageUrl": "https://images.unsplash.com/photo-1542255757-466d627b4e9f?auto=format&fit=crop&w=1000&q=80",
  "image": "flying car over amsterdam canals realistic style",
  "correctVerdict": "fake",
  "level": 1,
  "explanation": "Technologie voor vliegende auto's bestaat nog niet op deze manier. De schaduwen kloppen ook niet met de zon.",
  "clues": [
    { "id": "c1", "type": "visual", "content": "Schaduwen vallen de verkeerde kant op", "isFakeIndicator": true },
    { "id": "c2", "type": "metadata", "content": "Bestandsdatum: 2050", "isFakeIndicator": true },
    { "id": "c3", "type": "source", "content": "Bron: FunnyFakes.com", "isFakeIndicator": true }
  ]
}
[/CASE]`;
    }
    return "Interessant! Onderzoek de details goed. Wat valt je op aan de schaduwen?";
  }

  if (systemInstruction.includes('Verhalen Ontwerper') ||
    systemInstruction.includes('Verhalen Coach') ||
    systemInstruction.includes('Kinderboekenauteur') ||
    userMessage.toLowerCase().includes('verhaal') ||
    userMessage.includes('INSTRUCTIE')) {

    if (userMessage.includes('Genereer ALLEEN een nieuwe KAFT-illustratie')) {
      return `[IMG target="cover"]${userMessage.split('Beschrijving voor de nieuwe kaft:')[1]?.split('\n')[0] || 'cover illustration'}[/IMG]`;
    }
    if (userMessage.includes('Genereer ALLEEN een nieuwe illustratie voor pagina')) {
      const pageMatch = userMessage.match(/pagina (\d+)/);
      const pageNum = pageMatch ? pageMatch[1] : '1';
      return `[IMG target="${pageNum}"]${userMessage.split('Beschrijving voor de nieuwe illustratie:')[1]?.split('\n')[0] || 'illustration'}[/IMG]`;
    }
    if (userMessage.includes('Pas ALLEEN de tekst van pagina')) {
      const pageMatch = userMessage.match(/pagina (\d+)/);
      const pageNum = pageMatch ? pageMatch[1] : '1';
      return `[PAGE target="${pageNum}"]${userMessage.split('Gewenste aanpassing:')[1]?.split('\n')[0] || 'Nieuwe tekst'}[/PAGE]`;
    }
    if (userMessage.includes('Pas ALLEEN de titel')) {
      return `[TITLE]${userMessage.split('Nieuwe titel aanvraag:')[1]?.split('\n')[0] || 'Nieuwe Titel'}[/TITLE]`;
    }

    if (userMessage.toLowerCase().includes('start') || userMessage.toLowerCase().includes('titel')) {
      return `Wat een leuk idee! Laten we beginnen.

[TITLE]De Avonturen van de Verloren Vlieger[/TITLE]

[PAGE]
Er was eens een kleine jongen die dol was op vliegeren. Op een dag woei de wind zo hard, dat zijn vlieger ontsnapte!
[/PAGE]

[IMG target="cover"]illustration of a lost kite in the sky, children book style, no text[/IMG]
[IMG target="1"]boy looking at sky where kite is flying away, children book style, no text[/IMG]`;
    }
    return `[PAGE]
De jongen rende achter de vlieger aan, dwars door het bos. Opeens zag hij iets glinsteren tussen de bomen.
[/PAGE]
[IMG target="2"]boy running in forest seeing something shiny, children book style, no text[/IMG]`;
  }

  if (systemInstruction.includes('Game Programmeur') || systemInstruction.includes('Game Developer Mentor')) {
    return `Ik heb de code voor je aangepast! Probeer dit eens:

\`\`\`html
<!DOCTYPE html>
<html>
<head>
<style>
  body { background: #111; color: white; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; font-family: sans-serif; }
  #game { width: 400px; height: 400px; background: #222; position: relative; border: 2px solid #444; }
  #player { width: 30px; height: 30px; background: lime; position: absolute; top: 185px; left: 185px; }
</style>
</head>
<body>
  <div id="game">
    <div id="player"></div>
    <div style="position:absolute; top:10px; left:10px;">Score: 0</div>
  </div>
  <script>
    const player = document.getElementById('player');
    let x = 185, y = 185;
    document.addEventListener('keydown', e => {
      if(e.key === 'ArrowUp') y -= 10;
      if(e.key === 'ArrowDown') y += 10;
      if(e.key === 'ArrowLeft') x -= 10;
      if(e.key === 'ArrowRight') x += 10;
      player.style.top = y + 'px';
      player.style.left = x + 'px';
    });
  </script>
</body>
</html>
\`\`\`

Probeer nu of je kunt bewegen!`;
  }

  if (systemInstruction.includes('AI-assistent') || systemInstruction.includes('AI Lab')) {
    const msgLower = userMessage.toLowerCase();

    if (msgLower.includes('game') || msgLower.includes('programmeur') || msgLower.includes('code')) {
      return `Bij de **Game Programmeur** missie leer je om met AI code te genereren! 🎮

**Tips om te beginnen:**
1. Start de missie vanuit het dashboard
2. Beschrijf in het tekstveld welke aanpassing je wilt (bijv. "Maak de speler blauw")
3. De AI genereert dan javascript code voor je game

**Ideeën om te proberen:**
- Verander de kleur van de speler
- Voeg een obstakel toe
- Maak de speler groter of kleiner
- Voeg een score-teller toe

Loop je nog steeds vast? Vertel me precies wat je probeert te doen!`;
    }

    if (msgLower.includes('verhaal') || msgLower.includes('boek') || msgLower.includes('ontwerper')) {
      return `Bij de **Verhalen Ontwerper** missie maak je een prentenboek met AI! 📚

**Hoe het werkt:**
1. Start de missie vanuit het dashboard
2. Geef een thema of idee voor je verhaal
3. De AI schrijft teksten en genereert illustraties

**Tips:**
- Geef duidelijke instructies (bijv. "Schrijf een verhaal over een draak die bang is voor vuur")
- Je kunt elke pagina aanpassen door feedback te geven
- Klik op illustraties om ze opnieuw te genereren

Wat voor soort verhaal wil je maken?`;
    }

    if (msgLower.includes('magister') || msgLower.includes('onedrive') || msgLower.includes('word') || msgLower.includes('powerpoint') || msgLower.includes('print')) {
      return `Top dat je om hulp vraagt! We doen het **stap voor stap**.

**Zeg eerst waar je bent:**
- In welke app zit je nu? (Magister/OneDrive/Word/PowerPoint)
- Welke stap probeer je?
- Wat zie je precies op je scherm?

Dan geef ik je precies 1 klikstap tegelijk + een korte controlecheck.`;
    }

    if (msgLower.includes('opdracht') || msgLower.includes('missie') || msgLower.includes('help') || msgLower.includes('snap') || msgLower.includes('wat')) {
      return `Ik help je graag! 🙋‍♂️

**Beschikbare missies:**
- 🎮 **Game Programmeur** - Leer code schrijven met AI
- 📚 **Verhalen Ontwerper** - Maak een prentenboek met AI
- 🔍 **Nepnieuws Speurder** - Ontdek hoe je fake news herkent
- ☁️ **Cloud Schoonmaker** - Leer bestanden organiseren
- 🎯 **Pitch Politie** - Verbeter PowerPoint presentaties

**Waar loop je vast?** Vertel me welke stap je nu doet, dan help ik je met 1 duidelijke klikstap.`;
    }

    return `Goeie vraag! 🤔

Ik ben er om je te helpen met je opdrachten. Vertel me:
- Welke missie je aan het doen bent
- Waar je precies vastloopt

Dan kan ik je het beste helpen! 💪`;
  }

  return "De AI-service is tijdelijk niet bereikbaar. Probeer het zo opnieuw of vraag om een korte hint bij deze stap.";
}

// --- Public API ---

/**
 * Create a new chat session.
 * @param roleId - The server-side role identifier (must match a key in systemInstructions.ts)
 * @param systemInstruction - Optional, only used for local DEV fallback simulation
 */
export const createChatSession = (
  roleId: string,
  systemInstruction?: string,
  options?: ChatSessionOptions
): Chat => {
  return new Chat(roleId, systemInstruction, options);
};

export const sendMessageToAi = async (chat: Chat, message: string): Promise<string> => {
  try {
    const response = await chat.sendMessage({ message });
    const rawText = response.text || "Geen data ontvangen.";

    // G-05 FIX: Mark AI-generated response (AI Act Art. 50)
    const text = markAiGeneratedText(rawText, 'mistral');

    // EU AI Act Art. 12 — log AI interaction metadata (never message content)
    logAiInteraction('chat', {
      response_length: text.length,
      model: 'mistral',
      fallback_used: false,
    }).catch(() => { });

    return text;
  } catch (error: any) {
    throw toServiceError('AI chat', error);
  }
};

export const sendMessageToAiStream = async (
  chat: Chat,
  message: string,
  onChunk: (text: string) => void
): Promise<string> => {
  try {
    const stream = await chat.sendMessageStream({ message });
    let fullText = "";

    for await (const chunk of stream) {
      if (chunk.text) {
        fullText += chunk.text;
        onChunk(fullText);
      }
    }

    // G-05 FIX: Mark AI-generated response (AI Act Art. 50)
    fullText = markAiGeneratedText(fullText, 'mistral');

    // EU AI Act Art. 12 — log AI interaction metadata (never message content)
    logAiInteraction('stream', {
      response_length: fullText.length,
      model: 'mistral',
      fallback_used: false,
    }).catch(() => { });

    return fullText;
  } catch (error: any) {
    throw toServiceError('AI stream', error);
  }
};

// --- Image generation ---
// C2PA watermarking is lazy-loaded only when image generation is active (EU AI Act Art. 50)

interface ImageGenerationOptions {
  style?: ImageGenerationStyle;
  aspectRatio?: ImageAspectRatio;
  title?: string;
}

const decodeBase64ToBytes = (base64: string): Uint8Array<ArrayBuffer> => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

const blobToDataUrl = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Kon afbeelding niet omzetten naar data-URL.'));
      }
    };
    reader.onerror = () => reject(reader.error || new Error('Kon afbeelding niet lezen.'));
    reader.readAsDataURL(blob);
  });

export const generateImage = async (
  prompt: string,
  options: ImageGenerationOptions = {}
): Promise<string | null> => {
  try {
    const style = options.style || 'general';
    const aspectRatio = options.aspectRatio || '1:1';
      const response = await authenticatedFetch(`${EDGE_FUNCTION_URL}/generateImage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        style,
        aspectRatio,
        clientRequestId: createAiRequestId(),
      }),
    }, {
      fetcher: fetchWithRetry,
      onSessionExpired: 'throw',
      sessionExpiredMessage: 'Je sessie is verlopen. Log opnieuw in.',
    });

    const payload = await response.json().catch(() => ({} as GenerateImageResponse));
    if (!response.ok) {
      const message =
        payload.reason ||
        payload.error ||
        (response.status === 401
          ? 'Je sessie is verlopen. Log opnieuw in.'
          : 'AI-afbeelding tijdelijk niet beschikbaar.');
      throw new Error(message);
    }

    if (!payload.imageBase64) {
      throw new Error('Geen afbeelding ontvangen van de AI.');
    }

    const mimeType = payload.mimeType || 'image/png';
    const imageBlob = new Blob([decodeBase64ToBytes(payload.imageBase64)], { type: mimeType });

    let finalBlob = imageBlob;
    try {
      const { embedC2paCredentials } = await import('@/utils/c2paWatermark');
      const { imageData } = await embedC2paCredentials(
        imageBlob,
        payload.model || 'black-forest-labs',
        options.title || prompt.slice(0, 80) || 'AI-generated image'
      );

      if (imageData instanceof Blob) {
        finalBlob = imageData;
      }
    } catch (watermarkError) {
      console.warn('[AiProviderService] C2PA watermarking skipped:', watermarkError);
    }

    const dataUrl = await blobToDataUrl(finalBlob);

    logAiInteraction('image', {
      model: payload.model || 'black-forest-labs',
      fallback_used: false,
    }).catch(() => { });

    return dataUrl;
  } catch (error: any) {
    console.error('[AiProviderService] Image generation error:', error);
    return `error:${error?.message || 'AI-afbeelding tijdelijk niet beschikbaar.'}`;
  }
};

export const editImage = async (base64DataWithHeader: string, prompt: string): Promise<string | null> => {
  console.warn('editImage: Not yet implemented in secure proxy mode.');
  return null;
};

// --- Drawing analysis ---

export interface DrawingAnalysisResult {
  guesses: { label: string; confidence: number }[];
  mainGuess: string;
  reasoning: string;
}

export function parseDrawingAnalysisPayload(data: any): DrawingAnalysisResult {
  const parsed = typeof data?.result === 'string'
    ? JSON.parse(data.result)
    : data?.result || data;

  if (!parsed || !Array.isArray(parsed.guesses)) {
    throw new Error('Invalid drawing analysis response');
  }

  return {
    guesses: parsed.guesses,
    mainGuess: parsed.guesses?.[0]?.label || '???',
    reasoning: parsed.reasoning || 'Geen analyse beschikbaar'
  };
}

export const analyzeDrawingWithAI = async (
  imageBase64: string,
  possibleLabels: string[]
): Promise<DrawingAnalysisResult> => {
  try {
    const prompt = `Je bent een AI die kindertekeningen analyseert voor een educatief spel.
    
    Het doel was om een van deze objecten te tekenen: ${possibleLabels.join(', ')}.
    
    Jouw taak:
    1. Bepaal wat het object op de tekening ECHT voorstelt. 
       - Als het lijkt op het doelwoord, kies dat dan.
       - Als het DUIDELIJK iets heel anders is, geef dan dat andere object als label.
       - Forceer NIET een label uit de lijst als het er niet op lijkt.
    
    2. VEILIGHEID:
       - Als de tekening seksueel getint, haatdragend of obsceen is, geef dan als label "ONGEPAST" en confidence 0.

    Antwoord ALLEEN in dit exacte JSON-formaat, NIETS anders:
    {
      "guesses": [
        {"label": "woord1", "confidence": 85},
        {"label": "woord2", "confidence": 10},
        {"label": "woord3", "confidence": 5}
      ],
      "reasoning": "Korte uitleg in het Nederlands"
    }
    
    De confidence scores moeten optellen tot 100. Geef je top 3 gokken.`;

    const response = await authenticatedFetch(`${EDGE_FUNCTION_URL}/analyzeDrawing`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageBase64, possibleLabels, prompt, clientRequestId: createAiRequestId() })
    }, {
      fetcher: fetchWithRetry,
      onSessionExpired: 'throw',
      sessionExpiredMessage: 'Je sessie is verlopen. Log opnieuw in.',
    });

    if (!response.ok) {
      console.warn('Drawing analysis API failed, falling back to local analysis');
      throw new Error('API not available');
    }

    const data = await response.json();

    try {
      const result = parseDrawingAnalysisPayload(data);

      // EU AI Act Art. 12 — log drawing analysis metadata
      logAiInteraction('drawing_analysis', {
        model: 'mistral',
        fallback_used: false,
      }).catch(() => { });

      return result;
    } catch (parseError) {
      console.warn('Failed to parse AI response:', data);
      throw new Error('Parse failed');
    }
  } catch (error) {
    console.warn('AI drawing analysis failed:', error);
    throw error instanceof Error ? error : new Error('AI drawing analysis failed');
  }
};
