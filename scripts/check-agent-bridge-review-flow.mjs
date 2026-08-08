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

assert.throws(
  () =>
    execFileSync(
      process.execPath,
      [
        "scripts/github-agent-bridge.mjs",
        "process-all",
        "--agent",
        "reasonix",
        "--base-dir",
        baseDir,
        "--dry-run",
      ],
      {
        cwd: repoRoot,
        stdio: "pipe",
      },
    ),
  /Command failed/,
);

console.log("Retired agent bridge direct invocation is blocked.");
