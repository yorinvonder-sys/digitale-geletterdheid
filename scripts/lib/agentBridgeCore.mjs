export const AGENTS = ["chatgpt", "claude", "reasonix"];
const DEFAULT_OPENAI_MODEL = "gpt-4o-mini";
const DEFAULT_ANTHROPIC_MODEL = "claude-3-5-sonnet-latest";
const DEFAULT_REASONIX_MODEL = "deepseek-r1:1.5b";
const DEFAULT_REASONIX_BASE_URL = "http://127.0.0.1:11434";

export function normalizeAgent(value) {
  if (typeof value !== "string") {
    throw new Error("Agent name is required.");
  }

  const normalized = value.trim().toLowerCase();
  if (!AGENTS.includes(normalized)) {
    throw new Error(`Unsupported agent "${value}". Use one of: ${AGENTS.join(", ")}.`);
  }

  return normalized;
}

function extractOpenAIText(data) {
  if (typeof data?.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }

  const chunks = [];
  for (const item of data?.output ?? []) {
    for (const content of item?.content ?? []) {
      if (typeof content?.text === "string" && content.text.trim()) {
        chunks.push(content.text.trim());
      }
    }
  }

  return chunks.join("\n\n").trim();
}

async function generateOpenAIReply(userPrompt, systemPrompt) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing.");
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || DEFAULT_OPENAI_MODEL,
      input: [
        {
          role: "system",
          content: [{ type: "input_text", text: systemPrompt }],
        },
        {
          role: "user",
          content: [{ type: "input_text", text: userPrompt }],
        },
      ],
      max_output_tokens: 1200,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    const message = typeof data?.error?.message === "string" ? data.error.message : "Unknown OpenAI error.";
    throw new Error(`OpenAI request failed (${response.status}): ${message}`);
  }

  const text = extractOpenAIText(data);
  if (!text) {
    throw new Error("OpenAI returned an empty response.");
  }

  return {
    model: data.model || process.env.OPENAI_MODEL || DEFAULT_OPENAI_MODEL,
    text,
  };
}

async function generateAnthropicReply(userPrompt, systemPrompt) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is missing.");
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || DEFAULT_ANTHROPIC_MODEL,
      system: systemPrompt,
      max_tokens: 1200,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    const message = typeof data?.error?.message === "string" ? data.error.message : "Unknown Anthropic error.";
    throw new Error(`Anthropic request failed (${response.status}): ${message}`);
  }

  const text = (data?.content ?? [])
    .filter((item) => item?.type === "text" && typeof item?.text === "string")
    .map((item) => item.text.trim())
    .filter(Boolean)
    .join("\n\n")
    .trim();

  if (!text) {
    throw new Error("Anthropic returned an empty response.");
  }

  return {
    model: data.model || process.env.ANTHROPIC_MODEL || DEFAULT_ANTHROPIC_MODEL,
    text,
  };
}

async function generateReasonixReply(userPrompt, systemPrompt) {
  const baseUrl = (process.env.REASONIX_BASE_URL || DEFAULT_REASONIX_BASE_URL).replace(/\/+$/, "");
  const model = process.env.REASONIX_MODEL || DEFAULT_REASONIX_MODEL;
  const prompt = [`System:\n${systemPrompt}`, "", `User:\n${userPrompt}`].join("\n");

  const response = await fetch(`${baseUrl}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      prompt,
      stream: false,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    const message = typeof data?.error === "string" ? data.error : "Unknown Reasonix/Ollama error.";
    throw new Error(`Reasonix request failed (${response.status}): ${message}`);
  }

  const text = typeof data?.response === "string" ? data.response.trim() : "";
  if (!text) {
    throw new Error("Reasonix returned an empty response.");
  }

  return {
    model: data.model || model,
    text,
  };
}

export async function generateAgentReply({ agent, systemPrompt, userPrompt, dryRun = false, dryRunText = "" }) {
  const normalizedAgent = normalizeAgent(agent);

  if (dryRun) {
    return {
      model: `${normalizedAgent}-dry-run`,
      text:
        dryRunText ||
        [
          `[Dry run for ${normalizedAgent}]`,
          "",
          "No API call was made. Set the matching API key and run the bridge again for a real reply.",
        ].join("\n"),
    };
  }

  if (normalizedAgent === "chatgpt") {
    return generateOpenAIReply(userPrompt, systemPrompt);
  }

  if (normalizedAgent === "claude") {
    return generateAnthropicReply(userPrompt, systemPrompt);
  }

  if (normalizedAgent === "reasonix") {
    return generateReasonixReply(userPrompt, systemPrompt);
  }

  throw new Error(`No provider configured for agent "${normalizedAgent}".`);
}
