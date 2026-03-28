import fs from "node:fs";
import { validateHandoffBody } from "./lib/claudePrUtils.mjs";

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

const result = validateHandoffBody(body);

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
