import { sanitizePrompt } from "./promptSanitizer.ts";

export interface SafeChatPart {
  text: string;
}

export interface SafeChatMessage {
  role: "user" | "model";
  parts: SafeChatPart[];
}

export interface SafeHistoryOptions {
  maxMessages?: number;
  maxPartsPerMessage?: number;
  maxPartChars?: number;
  maxTotalChars?: number;
}

export interface SafeHistoryResult {
  history: SafeChatMessage[];
  blocked: boolean;
  detectionLabel?: string;
}

const DEFAULT_OPTIONS: Required<SafeHistoryOptions> = {
  maxMessages: 12,
  maxPartsPerMessage: 2,
  maxPartChars: 1_000,
  maxTotalChars: 6_000,
};

export function buildSafeHistory(
  rawHistory: unknown,
  options: SafeHistoryOptions = {},
): SafeHistoryResult {
  if (!Array.isArray(rawHistory)) {
    return { history: [], blocked: false };
  }

  const config = { ...DEFAULT_OPTIONS, ...options };
  const safeHistory: SafeChatMessage[] = [];
  let totalChars = 0;

  for (const entry of rawHistory.slice(-config.maxMessages)) {
    if (!entry || typeof entry !== "object") continue;

    const rawRole = (entry as { role?: unknown }).role;
    const role = rawRole === "model" ? "model" : rawRole === "user" ? "user" : null;
    if (!role) continue;

    const rawParts = Array.isArray((entry as { parts?: unknown[] }).parts)
      ? ((entry as { parts: unknown[] }).parts)
      : [];

    const safeParts: SafeChatPart[] = [];

    for (const part of rawParts.slice(0, config.maxPartsPerMessage)) {
      if (!part || typeof part !== "object") continue;

      const rawText = (part as { text?: unknown }).text;
      if (typeof rawText !== "string") continue;

      const trimmed = rawText.trim().slice(0, config.maxPartChars);
      if (!trimmed) continue;

      const validation = sanitizePrompt(trimmed);
      if (validation.wasBlocked) {
        return {
          history: [],
          blocked: true,
          detectionLabel: validation.detectionLabel,
        };
      }

      const remainingChars = config.maxTotalChars - totalChars;
      if (remainingChars <= 0) break;

      const text = validation.sanitized.slice(0, remainingChars).trim();
      if (!text) continue;

      safeParts.push({ text });
      totalChars += text.length;

      if (totalChars >= config.maxTotalChars) break;
    }

    if (safeParts.length > 0) {
      safeHistory.push({ role, parts: safeParts });
    }

    if (totalChars >= config.maxTotalChars) break;
  }

  return { history: safeHistory, blocked: false };
}
