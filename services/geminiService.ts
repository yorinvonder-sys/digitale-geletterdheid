// AI chat, streaming, and image generation via Edge Functions.
// Chat object is maintained client-side; API key stays server-side.

import { logger } from '../utils/logger';
import { supabase, EDGE_FUNCTION_URL } from './supabase';
import { logAiInteraction } from './auditService';
import { sanitizePrompt } from '../utils/promptSanitizer';
import { markAiGeneratedText } from '../utils/aiContentMarker';

// ── Fallback guard: local simulation only in DEV (AI Act Art. 50 + NIS2) ──
const ALLOW_LOCAL_FALLBACK = (() => {
  try {
    return (import.meta as any).env?.DEV === true;
  } catch { return false; }
})();

// --- Configuration ---

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

async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3): Promise<Response> {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      const response = await fetch(url, options);
      if (response.status === 429 || (response.status >= 500 && response.status <= 599)) {
        throw { status: response.status, name: 'RetryableError' };
      }
      return response;
    } catch (error: any) {
      retries++;
      if (retries >= maxRetries || error.name !== 'RetryableError') {
        if (error.name === 'RetryableError') {
          return await fetch(url, options);
        }
        throw error;
      }
      const delay = Math.pow(2, retries - 1) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  return await fetch(url, options);
}


// --- Chat session ---

interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export class Chat {
  private history: ChatMessage[] = [];
  private systemInstruction: string;

  constructor(systemInstruction: string) {
    this.systemInstruction = systemInstruction;
  }

  getHistory(): ChatMessage[] {
    return [...this.history];
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

    this.history.push({
      role: 'user',
      parts: [{ text: cleanMessage }]
    });

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('Authenticatie vereist. Log opnieuw in.');
      }
      const token = session.access_token;

      // G-02 FIX: Send the sanitized cleanMessage to the backend, not the original
      const response = await fetchWithRetry(`${EDGE_FUNCTION_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: cleanMessage,
          history: this.history.slice(0, -1)
        })
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        if (!ALLOW_LOCAL_FALLBACK) {
          logAiInteraction('chat', { model: 'gemini', fallback_used: false }).catch(() => { });
          throw new Error('AI is tijdelijk niet beschikbaar. Probeer het later opnieuw.');
        }
        console.warn('Backend AI request failed, falling back to local simulation (DEV only)', error);
        const fallbackResponse = await simulateLocalResponse(this.systemInstruction, cleanMessage);
        this.history.push({ role: 'model', parts: [{ text: fallbackResponse }] });
        logAiInteraction('chat', { model: 'local-fallback', fallback_used: true }).catch(() => { });
        return { text: fallbackResponse };
      }

      const data = await response.json();
      const responseText = data.text || '';

      this.history.push({ role: 'model', parts: [{ text: responseText }] });

      if (this.history.length > 20) {
        this.history = this.history.slice(-20);
      }

      return { text: responseText };
    } catch (error: any) {
      if (!ALLOW_LOCAL_FALLBACK) {
        throw new Error('AI is tijdelijk niet beschikbaar. Probeer het later opnieuw.');
      }
      console.warn('Chat proxy network error, falling back to local simulation (DEV only):', error);
      const fallbackResponse = await simulateLocalResponse(this.systemInstruction, cleanMessage);
      this.history.push({ role: 'model', parts: [{ text: fallbackResponse }] });
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

    this.history.push({
      role: 'user',
      parts: [{ text: cleanMessage }]
    });

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error('Authenticatie vereist. Log opnieuw in.');
    }
    const token = session.access_token;

    try {
      const response = await fetchWithRetry(`${EDGE_FUNCTION_URL}/chatStream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: cleanMessage,
          history: this.history.slice(0, -1)
        })
      });

      if (!response.ok) throw new Error('Stream request failed');

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
      if (!ALLOW_LOCAL_FALLBACK) {
        yield { text: 'AI is tijdelijk niet beschikbaar. Probeer het later opnieuw.' };
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
    }
  }
}

// --- Fallback ---
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

  if (systemInstruction.includes('Game Programmeur')) {
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

  return "Ik ben in offline-modus. Ik kan je helpen met standaard antwoorden, maar voor creatieve taken heb ik internet nodig. Probeer de specifieke opdrachten (start, help, tip).";
}

// --- Public API ---

export const createChatSession = (systemInstruction: string): Chat => {
  return new Chat(systemInstruction);
};

export const sendMessageToGemini = async (chat: Chat, message: string): Promise<string> => {
  try {
    const response = await chat.sendMessage({ message });
    const rawText = response.text || "Geen data ontvangen.";

    // G-05 FIX: Mark AI-generated response (AI Act Art. 50)
    const text = markAiGeneratedText(rawText, 'gemini');

    // EU AI Act Art. 12 — log AI interaction metadata (never message content)
    logAiInteraction('chat', {
      response_length: text.length,
      model: 'gemini',
      fallback_used: false,
    }).catch(() => { });

    return text;
  } catch (error: any) {
    console.error("AI API Error:", error);
    throw new Error(`AI Error: ${error?.message || 'Onbekende fout'}`);
  }
};

export const sendMessageToGeminiStream = async (
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
    fullText = markAiGeneratedText(fullText, 'gemini');

    // EU AI Act Art. 12 — log AI interaction metadata (never message content)
    logAiInteraction('stream', {
      response_length: fullText.length,
      model: 'gemini',
      fallback_used: false,
    }).catch(() => { });

    return fullText;
  } catch (error: any) {
    console.error("AI Stream Error:", error);
    throw new Error(`AI Error: ${error?.message || 'Onbekende fout'}`);
  }
};

// --- Image generation ---
// C2PA watermarking is lazy-loaded only when image generation is active (EU AI Act Art. 50)

export const generateImage = async (prompt: string, style: 'book' | 'detective' | 'general' = 'book'): Promise<string | null> => {
  // IMAGE GENERATION DISABLED BY POLICY — C2PA integration ready for re-enablement.
  // When re-enabled, uncomment the C2PA block below to embed Content Credentials.
  console.warn('[GeminiService] Image generation disabled by policy', { style, promptPreview: prompt.slice(0, 80) });

  // ── C2PA WATERMARKING (activate when image generation is re-enabled) ──
  // const { embedC2paCredentials } = await import('../utils/c2paWatermark');
  // const imageBlob = new Blob([imageBuffer], { type: 'image/png' });
  // const { imageData, manifest } = await embedC2paCredentials(imageBlob, 'gemini', prompt.slice(0, 80));
  // logAiInteraction('image_generation', { model: 'gemini', c2pa_embedded: manifest.embedded }).catch(() => {});

  return 'error:Afbeeldingen genereren is uitgeschakeld. Gebruik alleen beelden uit de leerlingenomgeving.';
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

export const analyzeDrawingWithAI = async (
  imageBase64: string,
  possibleLabels: string[]
): Promise<DrawingAnalysisResult> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error('Authenticatie vereist. Log opnieuw in.');
    }
    const token = session.access_token;

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

    const response = await fetchWithRetry(`${EDGE_FUNCTION_URL}/analyzeDrawing`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ imageBase64, prompt })
    });

    if (!response.ok) {
      console.warn('Drawing analysis API failed, falling back to local analysis');
      throw new Error('API not available');
    }

    const data = await response.json();

    try {
      const parsed = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
      const result = {
        guesses: parsed.guesses || [],
        mainGuess: parsed.guesses?.[0]?.label || '???',
        reasoning: parsed.reasoning || 'Geen analyse beschikbaar'
      };

      // EU AI Act Art. 12 — log drawing analysis metadata
      logAiInteraction('drawing_analysis', {
        model: 'gemini',
        fallback_used: false,
      }).catch(() => { });

      return result;
    } catch (parseError) {
      console.warn('Failed to parse AI response:', data);
      throw new Error('Parse failed');
    }
  } catch (error) {
    console.warn('AI drawing analysis failed:', error);
    const fallbackGuess = possibleLabels[0] || '?';
    return {
      guesses: [{ label: fallbackGuess, confidence: 95 }, { label: 'Iets anders', confidence: 5 }],
      mainGuess: fallbackGuess,
      reasoning: '(Offline modus) Mijn gok is dat dit een ' + fallbackGuess + ' is!'
    };
  }
};
