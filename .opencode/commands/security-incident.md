---
description: Run the fail-closed security incident gate with Sol max, Fable 5 max, and Opus 5 max.
agent: dg-orchestrator
model: openai/gpt-5.6-sol
variant: max
---

Lead the security incident for: $ARGUMENTS

Freeze scope and create one sanitized evidence packet containing facts, commit,
diff, threat model, tests, logs without personal/auth data, rollback and open
questions. Invoke `scripts/agent-runtime/claude-delegate.mjs` separately in
`security-fable5` and `security-opus5` mode. Both reviews are read-only and blind:
do not send either reviewer Sol's conclusion or the other review. Any critical
finding blocks release. Reconcile disagreements conservatively and show all
findings to the user. Only the user decides incident closure and release. Never
merge, deploy or publish exploit details.
