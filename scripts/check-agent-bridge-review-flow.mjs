import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dirname, "..");
const baseDir = fs.mkdtempSync(path.join(os.tmpdir(), "reasonix-review-flow-"));
const inboxDir = path.join(baseDir, "inbox", "reasonix");

fs.mkdirSync(inboxDir, { recursive: true });
fs.writeFileSync(
  path.join(inboxDir, "001.json"),
  `${JSON.stringify(
    {
      id: "001",
      threadId: "review-flow-001",
      from: "chatgpt",
      to: "reasonix",
      subject: "Implement small helper",
      body: "Plan: add a tiny helper and explain the intended diff.",
      reviewWith: ["chatgpt", "claude"],
    },
    null,
    2,
  )}\n`,
  "utf8",
);

execFileSync(
  process.execPath,
  ["scripts/github-agent-bridge.mjs", "process-all", "--agent", "reasonix", "--base-dir", baseDir, "--dry-run"],
  {
    cwd: repoRoot,
    stdio: "pipe",
  },
);

const chatgptReviews = fs.readdirSync(path.join(baseDir, "inbox", "chatgpt")).filter((entry) => entry.endsWith(".json"));
const claudeReviews = fs.readdirSync(path.join(baseDir, "inbox", "claude")).filter((entry) => entry.endsWith(".json"));

assert.equal(chatgptReviews.length, 1);
assert.equal(claudeReviews.length, 1);

const chatgptReview = JSON.parse(
  fs.readFileSync(path.join(baseDir, "inbox", "chatgpt", chatgptReviews[0]), "utf8"),
);
const claudeReview = JSON.parse(fs.readFileSync(path.join(baseDir, "inbox", "claude", claudeReviews[0]), "utf8"));

for (const review of [chatgptReview, claudeReview]) {
  assert.equal(review.from, "reasonix");
  assert.equal(review.threadId, "review-flow-001");
  assert.match(review.subject, /Review Reasonix output/);
  assert.match(review.body, /Original request:/);
  assert.match(review.body, /Reasonix output:/);
  assert.match(review.body, /Review the output as a coding reviewer/);
  assert.deepEqual(review.context, ["Source message: 001", "Source model: reasonix-dry-run"]);
}

assert.equal(chatgptReview.to, "chatgpt");
assert.equal(claudeReview.to, "claude");

console.log("Agent bridge review flow checks passed.");
