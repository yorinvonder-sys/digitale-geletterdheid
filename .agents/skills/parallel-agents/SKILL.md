---
name: parallel-agents
description: Guides efficient use of parallel subagents (Task tool) in Claude Code. Use when planning multi-step tasks, refactors across files, research-heavy work, or any task with independent work streams. Helps decide when to parallelize, which agent types to use, and how to structure prompts.
---

# Parallel Agents

Maximizes throughput by running independent work streams concurrently via the Task tool.

## How to use

- `/parallel-agents`
  Apply these patterns to the current task. Identify parallelization opportunities before starting work.

- `/parallel-agents <task description>`
  Analyze the task and output a parallel execution plan:
  - which agents to spawn (type, purpose)
  - which run in foreground vs background
  - dependency order (what must finish before what)
  - expected outputs per agent

## When to parallelize

MUST use parallel agents when:
- A task requires 3+ independent searches or file reads
- Multiple files need analysis before making changes
- Research (web/codebase) and implementation can overlap
- A refactor touches 3+ unrelated files
- You need both online research and local codebase search

SHOULD use parallel agents when:
- Exploring unfamiliar code across multiple directories
- Running an audit (security, accessibility, performance) across the codebase
- Preparing a PR that spans multiple concerns

NEVER use parallel agents when:
- The task is a single file edit with clear instructions
- Agent B depends on agent A's output (run sequentially instead)
- The task is conversational or informational (no tool use needed)

## Agent types and when to use them

| Type | Use for | Example |
|---|---|---|
| `Explore` | Codebase search, file discovery, pattern analysis | "Find all components using useEffect for data fetching" |
| `Plan` | Architecture decisions, implementation strategy | "Design the approach for adding dark mode" |
| `Bash` | Git operations, builds, installs, terminal commands | "Run the test suite and report failures" |
| `general-purpose` | Multi-step research, complex searches, web + code | "Research best practices for Supabase RLS and check our current policies" |

## Foreground vs background

### Foreground (default)
Use when you need the result before continuing.
- Research that informs your next step
- File analysis needed before editing
- Dependency checks before installing

### Background (`run_in_background: true`)
Use when you can continue working without the result.
- Long-running builds or test suites
- Broad codebase audits
- Web research while you already know enough to start coding
- Secondary context gathering (nice to have, not blocking)

## Prompt design for agents

MUST include in every agent prompt:
- **Goal:** what the agent should find or produce
- **Scope:** which files, directories, or topics to focus on
- **Output format:** what to return (file list, summary, code snippet, boolean)
- **Research vs write:** explicitly state whether the agent should only read or also write code

SHOULD include:
- Relevant context from the current conversation
- Constraints (e.g., "only look in src/components/", "ignore test files")

NEVER:
- Give an agent a vague prompt like "look into this"
- Assume the agent knows the conversation context (it starts fresh unless noted)
- Duplicate work across agents (each agent should have a unique scope)

## Common patterns

### Pattern 1: Research + Implement
```
Agent A (Explore, foreground): "Find all files that import X and how they use it"
Agent B (general-purpose, background): "Research best practices for Y"
→ Wait for A, start implementing
→ Check B's result when available, adjust if needed
```

### Pattern 2: Multi-file audit
```
Agent A (Explore): "Check src/components/ for accessibility issues"
Agent B (Explore): "Check src/pages/ for accessibility issues"
Agent C (Explore): "Check src/layouts/ for accessibility issues"
→ All foreground, all parallel, merge results
```

### Pattern 3: Impact analysis + preparation
```
Agent A (Explore): "Find all usages of function X across the codebase"
Agent B (Explore): "Find the type definitions and interfaces related to X"
→ Both foreground, use results to plan the refactor
```

### Pattern 4: Build + Research
```
Agent A (Bash, background): "Run npm run build:prod and report errors"
Agent B (general-purpose, foreground): "Research the error pattern we saw earlier"
→ Work on the fix while build runs
```

## Anti-patterns

- **Serial where parallel works:** Running 5 searches one after another when they're independent. Spawn 5 agents instead.
- **Parallel where serial is needed:** Spawning an edit agent before the research agent returns. Wait for research first.
- **Over-parallelizing:** Spawning 10 agents for a task that needs 2 searches. More agents ≠ better — each has overhead.
- **Vague delegation:** "Look into the auth system" — too broad. Be specific: "Find all files in src/ that call supabase.auth and list the methods used."
- **Duplicate work:** Spawning an agent to search AND searching yourself. Pick one.

## Checkpoint rule

After spawning agents and receiving results:
1. Summarize what each agent found (1 line each)
2. Identify if any gaps remain
3. Only then proceed to implementation
