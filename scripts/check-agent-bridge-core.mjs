import assert from "node:assert/strict";
import { AGENTS, generateAgentReply, normalizeAgent } from "./lib/agentBridgeCore.mjs";

async function testReasonixIsSupported() {
  assert.deepEqual(AGENTS, ["chatgpt", "claude", "reasonix"]);
  assert.equal(normalizeAgent(" Reasonix "), "reasonix");
}

async function testReasonixDryRunDoesNotCallOllama() {
  const reply = await generateAgentReply({
    agent: "reasonix",
    systemPrompt: "You are a local coding executor.",
    userPrompt: "Confirm readiness.",
    dryRun: true,
  });

  assert.equal(reply.model, "reasonix-dry-run");
  assert.match(reply.text, /Dry run for reasonix/);
}

async function testReasonixCallsLocalOllama() {
  const originalFetch = globalThis.fetch;
  const calls = [];

  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return new Response(
      JSON.stringify({
        model: "deepseek-r1:1.5b",
        response: "READY",
      }),
      {
        status: 200,
        headers: { "content-type": "application/json" },
      },
    );
  };

  try {
    const reply = await generateAgentReply({
      agent: "reasonix",
      systemPrompt: "You execute coding plans locally.",
      userPrompt: "Say READY.",
    });

    assert.equal(reply.model, "deepseek-r1:1.5b");
    assert.equal(reply.text, "READY");
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, "http://127.0.0.1:11434/api/generate");

    const body = JSON.parse(calls[0].options.body);
    assert.equal(body.model, "deepseek-r1:1.5b");
    assert.equal(body.stream, false);
    assert.match(body.prompt, /System:\nYou execute coding plans locally\./);
    assert.match(body.prompt, /User:\nSay READY\./);
  } finally {
    globalThis.fetch = originalFetch;
  }
}

for (const test of [testReasonixIsSupported, testReasonixDryRunDoesNotCallOllama, testReasonixCallsLocalOllama]) {
  await test();
}

console.log("Agent bridge core checks passed.");
