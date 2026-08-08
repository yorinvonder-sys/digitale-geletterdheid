---
description: Run a read-only Terra shadow evaluation with an explicit effort ceiling
agent: dg-orchestrator
subtask: true
---

Evaluate the supplied sanitized, non-sensitive packet independently.

Required effort: `$1`

Packet:

$ARGUMENTS

Reject locally before delegation if the effort is not `medium` or `high`, if the
packet lacks the required safety headers, contains secrets or personal data, or
asks for edits. Only after validation, invoke the matching hidden Terra shadow
agent. Return only findings, uncertainties, and evidence that Sol can verify.
