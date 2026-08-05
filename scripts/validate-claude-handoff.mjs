import fs from "node:fs";
import {
  REQUIRED_HANDOFF_SECTIONS,
  validateAgentRoute,
  validateHandoffBody,
} from "./lib/claudePrUtils.mjs";

function setGitHubOutput(name, value) {
  const outputFile = process.env.GITHUB_OUTPUT;
  if (!outputFile) return;
  const serialized = String(value).replace(/\n/g, "%0A");
  fs.appendFileSync(outputFile, `${name}=${serialized}\n`);
}

function getPullRequestBody() {
  const body = process.env.PR_BODY ?? "";
  return body.trim();
}

const body = getPullRequestBody();

if (!body) {
  const message = "PR body ontbreekt. Gebruik de Claude handoff-template voordat je review aanvraagt.";
  console.error(message);
  setGitHubOutput("ok", "false");
  setGitHubOutput("message", message);
  process.exit(1);
}

const requiredSections =
  process.env.REQUIRE_AGENT_ROUTE === "true"
    ? [...REQUIRED_HANDOFF_SECTIONS, "Agentroute"]
    : REQUIRED_HANDOFF_SECTIONS;
const result = validateHandoffBody(body, requiredSections);

if (
  process.env.REQUIRE_AGENT_ROUTE === "true" &&
  !validateAgentRoute(body).ok &&
  !result.empty.includes("Agentroute")
) {
  result.empty.push("Agentroute");
  result.ok = false;
}

if (!result.ok) {
  const parts = [];
  if (result.missing.length > 0) {
    parts.push(`Ontbrekende secties: ${result.missing.join(", ")}`);
  }
  if (result.empty.length > 0) {
    parts.push(`Lege secties: ${result.empty.join(", ")}`);
  }

  const message = `Claude handoff is niet compleet. ${parts.join(". ")}.`;
  console.error(message);
  setGitHubOutput("ok", "false");
  setGitHubOutput("message", message);
  process.exit(1);
}

const successMessage = "Claude handoff is compleet.";
console.log(successMessage);
setGitHubOutput("ok", "true");
setGitHubOutput("message", successMessage);
