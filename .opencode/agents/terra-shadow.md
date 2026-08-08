---
description: Produces a read-only Terra medium comparison for the DGSkills shadow evaluation.
mode: subagent
hidden: true
model: openai/gpt-5.6-terra
variant: medium
steps: 24
permission:
  edit: deny
  read: deny
  grep: deny
  glob: deny
  list: deny
  lsp: deny
  skill: deny
  bash: deny
  task: deny
  webfetch: deny
  websearch: deny
  external_directory: deny
---

Shadow evaluation only. Analyze only the sanitized packet supplied by Sol; do
not inspect the repository, edit, apply patches or make external changes. Return
a proposed solution, assumptions, expected files, proof and risks. Never make a
release or Rood decision.
