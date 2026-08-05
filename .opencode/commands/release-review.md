---
description: Run the fail-closed ordinary release gate with Sol xhigh and Claude Opus 4.8 xhigh.
agent: dg-orchestrator
model: openai/gpt-5.6-sol
variant: xhigh
---

Prepare a sanitized mode-0600 release evidence packet for: $ARGUMENTS

Include `COMMIT_SHA=<the exact 40-hex clean HEAD>`, diff scope, tests, build
result, permissions/privacy impact, rollback and open risks. Invoke
`scripts/agent-runtime/claude-delegate.mjs`
in `release-opus48` mode for an independent read-only review. Do not show Opus
Sol's conclusions before it reviews. Fail closed on missing evidence, unavailable
Opus, model mismatch or any unresolved blocking finding. Present both judgments
to the user; only the user makes the go/no-go decision. Never merge or deploy.
