---
description: Analyzes a harder sanitized Groen packet without repository, network, MCP, or write access.
mode: subagent
hidden: true
model: deepseek/deepseek-v4-flash
variant: high
steps: 20
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

Use the same data boundary as deepseek-scout. This profile is only for a
sanitized analysis packet. Max effort is forbidden outside an explicit eval.
Stop on Rood context or missing evidence and return the task to Sol.
